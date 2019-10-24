var PARTO_GRAPH_BASE = (function() {

    function PartoGraphBase() {
        this.components = [];
        //defaults to last load time unless scrolled. Always in ms unit for convenience
        this.endDate = null;
        this.finalStartTime = null;
        this.finalEndTime = null;
        this.HOUR_WINDOW = 12;
        var ONE_HOUR_MS = 1 * 60 * 60 * 1000;
        var ONE_MINUTE_MS = 1 * 60 * 1000;
        this.hourTicks = [];
        this.quarterTicks = [];
        this.majorGridLines = [];
        this.COLOR_DARK_GRAY = '#505050';
        this.GRID_BACKGROUND_COLOR = '#ffffff';
        this.MINOR_GRID_LINE_COLOR = '#ececec';
        this.partogramLastLoadTime = null;
        //the end time of partogram components depend on when the alert/action lines are drawn on
        //labor curve component
        this.alertActionEndTime = null;
        this.COMPONENT_BOTTOM_MARGIN = '8px';
        this.epiduralData = [
            [],
            [],
            [],
            []
        ];
        //default to true
        this.isEpiVisible = true;
        this.oxytocinData = [];
        //default to true
        this.isOxyVisible = true;
        this.ARROW_BUTTON_WIDTH = 20;
        //the event names of oxytocin and epidural, populated by overview component
        this.oxyNameArray = [];
        this.epiNameArray = [];
        this.componentWidth = 0;
        this.offsetWidth = 0;
        this.personId = 0;
        this.providerId = 0;
        //hoverDataMap holds hover data for components using it.
        this.hoverDataMap = {};
        //the width of the outer div container
        this.container2Width = null;
        //topBar contains the time scale, saved here to avoid redrawing
        this.topBarGraphHTML = "";
        this.topBarTableHTML = "";
        //this is obtained from Labor Curve Component. used in
        //calculating the width of the component depending on
        //the mode
        this.fetalHeadEngagementMode = null;
        
        /**
         * sets the Labor Curve configuration for Fetal Head Engagagement
         * @param mode {String} : FIFTHS_PALPABLE or FETAL_STATION
         */
        this.setFetalHeadEngagementMode = function (mode) {
        	this.fetalHeadEngagementMode = mode
        };
        
        /**
         * Returns the time when Partogram was last loaded
         */
        this.getPartogramLastLoadTime = function() {
            return this.partogramLastLoadTime;
        };

        /**
         * sets the Partogram last loaded time
         */
        this.setPartogramLastLoadTime = function(val) {
            this.partogramLastLoadTime = val;
        };

        /**
         * Set the end date when the configuration is changed by scrolling.
         * Re-calculate the ticks and grid lines based on the current time value.
         * @param val {Number} : The time in ms.
         */
        this.setEndDate = function(val) {
            this.endDate = val;
            this.generateHourTicks();
            this.generateQuarterTicks();
            this.generateMajorGridLines();
        };

        /**
         * Returns the end date for all components.
         */
        this.getEndDate = function() {
            return this.endDate;
        };

        /**
         * Returns the current time scale window.
         */
        this.getHourWindow = function() {
            return this.HOUR_WINDOW;
        };

        /**
         * Sets the current time scale window and also the cookie to preserve the timescale option for the session.
         */
        this.setHourWindow = function(val) {
            this.HOUR_WINDOW = val;
            //store the hour window
            if (this.personId && this.providerId) {
                var hourWindowKey = 'HourWindow' + "|" + this.personId + "|" + this.providerId;
                MP_Util.AddCookieProperty("PartogramUserHourWindowPref", hourWindowKey, this.HOUR_WINDOW);
                MP_Util.WriteCookie();
            }
        };

        /**
         * Returns the step size of the major ticks for the current hour window.
         * The unit is in hours.
         */
        this.getMajorTickStep = function() {
            switch (this.HOUR_WINDOW) {
                case 1:
                    return 0.25;
                case 4:
                    return 1;
                case 8:
                    return 1;
                case 12:
                    return 1;
                case 24:
                    return 1;
            }
        };

        /**
         * Returns the step size of the minor ticks for the current hour window.
         * The unit is in minutes.
         */
        this.getMinorTickStep = function() {
            switch (this.HOUR_WINDOW) {
                case 1:
                    return 5;
                case 4:
                    return 15;
                case 8:
                    return 15;
                case 12:
                    return 60;
                case 24:
                    return 60;
            }
        };

        /**
         * Returns the tick label's step size compared to major tick lines.
         * For eg: 1 implies the label will be drawn at every major tick
         * 2 implies the label will be drawn at every 2nd major tick as in 12 hour window.
         */
        this.getMajorTickLabelStep = function() {
            switch (this.HOUR_WINDOW) {
                case 1:
                    return 1;
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

        /**
         * Returns the start date in ms
         */
        this.getStartDate = function() {
            var startTime = this.endDate - this.HOUR_WINDOW * ONE_HOUR_MS;
            //do not go beyond hard left defined by this.startDateTime
            if (this.finalStartTime) {
                startTime = Math.max(startTime, this.finalStartTime);
            }
            return startTime;
        };

        /**
         * Sets Partogram's range time in ms (user will not be able to scroll beyond this range)
         */
        this.calculatePartogramStartAndEndTime = function(partogramOnsetDate) {
            if (partogramOnsetDate) {
                this.finalStartTime = partogramOnsetDate.getTime();
                //setting the final end time for partogram components
                this.setFinalEndTime();
                //get adjusted end date in case alert/action end time is available on page load
                var adjustEndTime = this.getAdjustedEndDateForScaleSwitch(this.finalEndTime);
                this.setEndDate(adjustEndTime);
            }
        };

        /**
         * Sets user preferences. 
         * Currently stores user's hour window preference
         * The hour window that was set prior to a Partogram refresh is persisted using cookie
         */
        this.setUserPreferences = function(criterion) {
            //check if the user  has any hour window preference
            this.personId = criterion.person_id;
            this.providerId = criterion.provider_id;
            var hourWindowKey = MP_Util.GetCookieProperty("PartogramUserHourWindowPref", 'HourWindow' + "|" + this.personId + "|" + this.providerId);
            if (hourWindowKey) {
                this.HOUR_WINDOW = parseInt(hourWindowKey, 10);
                PARTO_TABLE_BASE.setHourWindow(this.HOUR_WINDOW);
            }
        };

        /**
         * Sets the time beyond which user cannot scroll.
         * the time (date in ms) is an optional parameter.
         */
        this.setFinalEndTime = function (time) {
            this.finalEndTime = time || this.calculateFinalEndTime();
        };
        
        /**
         * Gets the end time beyond which user cannot scroll.
         * 
         */
        this.getFinalEndTime = function () {
            return this.finalEndTime;
        };
        
        /**
         * Gets the begin time (the max time in the past) beyond which user cannot scroll.
         * 
         */
        this.getFinalStartTime = function () {
            return this.finalStartTime;
        };
        
        /**
         * Calculates the time beyond which user cannot scroll.
         */
        this.calculateFinalEndTime = function() {
        	var finalTime;
        	var endTime = this.alertActionEndTime || this.partogramLastLoadTime;
            if (endTime - this.finalStartTime >= this.HOUR_WINDOW * ONE_HOUR_MS) {
            	finalTime = endTime;
            } else {
            	finalTime = this.finalStartTime + this.HOUR_WINDOW * ONE_HOUR_MS;
            }
            return finalTime;
        };
        
        /**
         * Sets the time beyond which user cannot scroll.
         * the time is date in milliseconds.
         */
        this.setAlertActionEndTime = function (time) {
            this.alertActionEndTime = time;
        };

        /**
         * Handles the display range when the user scrolls. 
         * Converts the pixel difference to time difference and returns an end time in ms that is valid ie. within left and right bounds (the partogram range)
         */
        this.getAdjustedEndDateForScrolling = function(endDateTime, pixelDiff) {
            var timeDiff = this.HOUR_WINDOW * ONE_HOUR_MS;
            var endDt = endDateTime;
            if (pixelDiff) {
                var timeToPixelRatio = timeDiff / this.getComponentWidth();
                var diff = pixelDiff * timeToPixelRatio;
                endDt = this.getEndDate() + diff;
            }
            if (endDt > this.finalEndTime) {
                endDt = this.finalEndTime;
            }
            if (endDt - this.finalStartTime < timeDiff) {
                endDt = this.finalStartTime + timeDiff;
            }
            return endDt;
        };

        /** Handles the display range when the user switches time scale/hour window. 
         * if the user switches scale, the current end date time is checked whether it is in future, if so,
         * we make sure the display range includes the last load time. If the current end date time is in past,
         * we zoom in/out by going back by hour_window time.
         */
        this.getAdjustedEndDateForScaleSwitch = function(endDateTime) {
            var timeDiff = this.HOUR_WINDOW * ONE_HOUR_MS;
            var endDt = endDateTime;

            if (endDt > this.partogramLastLoadTime) {
                endDt = this.partogramLastLoadTime;
            }
            if (endDt - this.finalStartTime < timeDiff) {
                endDt = this.finalStartTime + timeDiff;
            }
            return endDt;
        };

        /**
         * Returns the bottom padding for each component
         */
        this.getComponentBottomPadding = function() {
            return this.COMPONENT_BOTTOM_MARGIN;
        };

        /**
         * Returns the hourticks array for the components to use.
         */
        this.getHourTicks = function() {
            return this.hourTicks;
        };

        /**
         * Returns the quarterticks array for the components to use.
         */
        this.getQuarterTicks = function() {
            return this.quarterTicks;
        };

        /**
         * Returns the major grid lines array for the components to use.
         */
        this.getMajorGridLines = function() {
            return this.majorGridLines;
        };

        /**
         * A utility function to generate the quarter tick values.
         */
        this.generateQuarterTicks = function() {
            var min = this.getStartDate();
            var max = this.endDate;
            var step = this.getMinorTickStep();
            var res = [];
            res.push(min);
            var stepMins = step * ONE_MINUTE_MS;
            var v = Math.ceil(min / stepMins) * stepMins;
            if (min % stepMins === 0) {
                v += stepMins;
            }
            while (v < max) {
                res.push(v);
                v += stepMins;
            }
            res.push(max);
            this.quarterTicks = res;
        };

        /**
         * A utility function to generate the major gird lines which will be placed
         * as CanvasOverlay on the graph.
         */
        this.generateMajorGridLines = function() {
            var gridLine = function(v) {
                return {
                    verticalLine: {
                        x: v,
                        lineWidth: "1px",
                        color: '#a5a5a5',
                        shadow: false,
                        lineCap: 'butt',
                        xaxis: 'x2axis',
                        yOffset: 0
                    }
                };
            };

            var min = this.getStartDate();
            var max = this.endDate;
            var step = this.getMajorTickStep();

            var gridLines = [];
            gridLines.push(gridLine(min));
            var stepHrs = step * ONE_HOUR_MS;
            var v = Math.ceil(min / stepHrs) * stepHrs;
            if (min % stepHrs === 0) {
                v += stepHrs;
            }
            while (v < max) {
                gridLines.push(gridLine(v));
                v += stepHrs;
            }
            this.majorGridLines = gridLines;
        };

        /**
         * A utility function to generate the hour tick values.
         */
        this.generateHourTicks = function() {
            var min = this.getStartDate();
            var max = this.endDate;
            var step = this.getMajorTickStep();
            var res = [];
            res.push([min, '']);
            var stepHrs = step * ONE_HOUR_MS;
            var v = Math.ceil(min / stepHrs) * stepHrs;
            if (min % stepHrs === 0) {
                v += stepHrs;
            }
            while (v < max) {
                res.push(v);
                v += stepHrs;
            }
            res.push([max, '']);
            this.hourTicks = res;
        };

        //A helper method to return local date from UTC date.
        this.getLocalDateTime = function(UTCDateStr) {
            var dateTime = new Date();
            dateTime.setISO8601(UTCDateStr);
            return dateTime.getTime();
        };

        /**
         * Formats the date to suit the locale.
         * if UTC string is passed, it is converted to locate date before being formatted.
         * @param {Date} dateObject the date object needs to be formatted
         * or {String} UTC String
         * @param {String} format the format required
         */
        this.getFormattedLocalDateTime = function(dateObject, format) {
            if (!dateObject) {
                return "";
            }
            if (mp_formatter._validateFormatString(dateObject)) {
                dateObject = new Date(this.getLocalDateTime(dateObject));
            }
            switch (format) {
                case "MEDIUM_DATE": //"mmm d, yyyy"
                    return dateObject.format("mediumDate");
                case "SHORT_DATE": //""mm/dd/yy"
                    return dateObject.format("shortDate3");
                case "FULL_DATE_TIME": //"mmm d, yyyy HH:MM"
                    return dateObject.format("mediumDate") + " " + dateObject.format("militaryTime");
                case "MILITARY_TIME": //"HH:MM"
                    return dateObject.format("militaryTime");
            }
        };

        /**
         * Sets the epidural data, populated by overview component
         */
        this.setEpiduralData = function(epiData) {
            if (!epiData) {
                return;
            }
            this.epiduralData = epiData;
            var compLength = this.components.length;
            //this is for the components which get loaded before the epidural data is not yet set. So add the vertical dashed start lines for these components.
            for (var i = 0; i < compLength; i++) {
                var component = this.components[i];
                var plot = component.getPlot();
                if (!plot) {
                    continue;
                }
                var epiStartLines = this.getEpiduralVerticalLines();
                var len = epiStartLines.length;
                for (var j = 0; j < len; j++) {
                    plot.plugins.canvasOverlay.addDashedVerticalLine(epiStartLines[j].dashedVerticalLine);
                }
                if (len > 0) {
                    plot.redraw();
                }
            }
            if (compLength > 0) {
                this.refreshTopbar();
            }
        };

        /**
         * Sets the epidural event names array, populated by overview component
         */
        this.setEpiduralNames = function(epiNames) {
            this.epiNameArray = epiNames || [];
        };

        /**
         * Gets the epidural event names array, populated by overview component
         */
        this.getEpiduralNames = function() {
            return this.epiNameArray;
        };

        /**
         * Returns the epidural map object. Convention should match the backend script.
         */
        this.getEpiduralMap = function() {
            return {
                DISCONTINUED: 0,
                START: 1,
                BOLUS_PATIENT: 2,
                BOLUS_ANESTHESIA: 3
            };
        };

        /**
         * Sets the epidural visibility, populated by overview component on toggling the images once active.
         */
        this.setEpiVisibility = function(isVisible) {
            this.isEpiVisible = isVisible || false;
        };

        /**
         * Gets the canvas overlay objects for the epidural start vertical lines to be drawn on the all graphing components.
         */
        this.getEpiduralVerticalLines = function() {
            var epiLine = function(epiStartTime) {
                return {
                    dashedVerticalLine: {
                        x: epiStartTime,
                        color: "#3D79E9",
                        lineCap: "square",
                        shadow: false,
                        yOffset: 0
                    }
                };
            };
            var epiVerticalLines = [];
            var isEpiVisible = this.isEpiVisible;
            var epiMap = this.getEpiduralMap();
            for (var i = 0, len = this.epiduralData[epiMap.START].length; isEpiVisible && i < len; i++) {
                epiVerticalLines.push(epiLine(this.getLocalDateTime(this.epiduralData[epiMap.START][i].EPIDURAL_VALUE)));
            }
            return epiVerticalLines;
        };

        /**
         * Sets the oxytocin data, populated by overview component
         */
        this.setOxytocinData = function(oxyData) {
            if (!oxyData) {
                return;
            }
            this.oxytocinData = oxyData;
            //this is for the components which get loaded before the oxytocin data is not yet set. So add the vertical dashed start lines for these components.
            for (var i = 0; i < this.components.length; i++) {
                var component = this.components[i];
                var plot = component.getPlot();
                if (!plot) {
                    continue;
                }
                var oxyStartLines = this.getOxytocinVerticalLines();
                var len = oxyStartLines.length;
                for (var j = 0; j < len; j++) {
                    plot.plugins.canvasOverlay.addDashedVerticalLine(oxyStartLines[j].dashedVerticalLine);
                }
                plot.redraw();
            }
            this.refreshTopbar();
        };

        /**
         * Returns the oxytocin map object. Convention should match the backend script.
         */
        this.getOxytocinMap = function() {
            return {
                START: 0,
                INCREASE: 1,
                DECREASE: 2,
                STOP: 3
            };
        };

        /**
         * Sets the oxytocin visibility, populated by overview component on toggling the images once active.
         */
        this.setOxyVisibility = function(isVisible) {
            this.isOxyVisible = isVisible || false;
        };

        /**
         * Gets the canvas overlay objects for the oxytocin start vertical lines to be drawn on the all graphing components.
         */
        this.getOxytocinVerticalLines = function() {
            var oxyLine = function(oxyStartTime) {
                return {
                    dashedVerticalLine: {
                        x: oxyStartTime,
                        color: "#FF3398",
                        lineCap: "square",
                        shadow: false,
                        yOffset: 0
                    }
                };
            };
            var oxyVerticalLines = [];
            var oxyData = this.oxytocinData;
            var dataLen = oxyData.length;
            var isOxyVisible = this.isOxyVisible;
            if (dataLen === 0 || !isOxyVisible) {
                return [];
            }
            if (oxyData[0].VALUE !== 0) {
                oxyVerticalLines.push(oxyLine(oxyData[0].TIME));
            }
            for (var i = 1; isOxyVisible && i < dataLen; i++) {
                if (oxyData[i - 1].VALUE === 0 && oxyData[i].VALUE !== 0) {
                    oxyVerticalLines.push(oxyLine(oxyData[i].TIME));
                }
            }
            return oxyVerticalLines;
        };

        /**
         * A utility function to set tooltip location on the graphs
         * depending on where the datapoint hovered on is.
         * This will prevent tooltip from getting truncated if the datapoint
         * is close to the borders of the graph
         */
        this.setToolTipLocation = function(plot, seriesIndex, pointIndex) {
            var gridData = plot.series[seriesIndex].gridData[pointIndex];
            //if a datapoints X value falls within xValueTrigger from the edges of the graphs, the location is changed.
            var xValueTrigger = plot._width / 2;
            var yValueTrigger = plot._height * 0.33;
            var gridpos = {
                x: gridData[0],
                y: gridData[1]
            };
            var direction = '';
            // adjust the tooltip location if it too close to the borders of the graph
            if (gridpos.y < yValueTrigger) {
                direction = 's';
            } else if (gridpos.y > (plot._height - yValueTrigger)) {
                direction = 'n';
            }
            if (gridpos.x < xValueTrigger) {
                direction += 'e';
            } else if (gridpos.x > xValueTrigger) {
                direction += 'w';
            }

            plot.series[seriesIndex].highlighter.tooltipLocation = direction;

        };

        /**
         * A helper method to get the normalcy CSS class from the normalcy mean. The classes are defined by Dicern Team, and is used across different MPage Components.
         * @param normalcyMean {String} : A String representing the one of the normalcy range.
         * @return A CSS Class to be used to represent the normalcy means.
         */
        this.getNormalcyClass = function(normalcyMean) {
            switch (normalcyMean) {
                case "CRITICAL":
                case "EXTREMEHIGH":
                case "PANICHIGH":
                case "EXTREMELOW":
                case "PANICLOW":
                case "VABNORMAL":
                case "POSITIVE":
                    return "res-severe";
                case "HIGH":
                    return "res-high";
                case "LOW":
                    return "res-low";
                case "ABNORMAL":
                    return "res-abnormal";
                default:
                    return "res-normal";
            }
        };

        /**
         * A method to get the Criticality HTML.
         * @param value {String/Number} : Value of the datapoint to be displayed with reference ranges
         * @param resCSSClass {String} : A CSS Class representing the Normalcy range of the value
         * @param modifiedInd {Number/Boolean} : An indicator, 1 = Result Modified, 0 = Result Not Modified.
         * @return HTML String to be used to show the reference ranges and modification indicator.
         */
        this.getResultIndHTML = function(value, unit, resCSSClass, modifiedInd) {
            value = value || '';
            resCSSClass = resCSSClass || '';
            modifiedInd = modifiedInd || 0;
            var criticalityHTML = '';
            criticalityHTML += '<span class="' + resCSSClass + '">';
            criticalityHTML += '<span class="res-ind">&nbsp;</span><span class="res-val">' + value + '</span>';
            if (unit) {
                criticalityHTML += '<span class="parto-graph-wf-unit">' + unit + '</span>';
            }
            if (modifiedInd) {
                criticalityHTML += '<span class="res-modified"></span>';
            }
            criticalityHTML += '</span>';
            return criticalityHTML;
        };

        /**
         * This method clears the hover data for a particular component.
         * @param componentKey {String} : A unique key representing a component.
         * @return null
         */
        this.clearHoverMap = function(componentKey) {
            this.hoverDataMap[componentKey] = {};
        };

        /**
         * A helper method to check if hover data is populated for a component.
         * @param componentKey {String} : A unique key representing a component.
         * @return A boolean representing whether the data is populated for the requested component or not
         */
        this.isHoverDataPopulated = function(componentKey) {
            if (typeof this.hoverDataMap[componentKey] === 'undefined') {
                this.hoverDataMap[componentKey] = {};
                return false;
            }
            return true;
        };

        /**
         * Method to insert data into the hover data structure, hoverDataMap, for each component at a particular timestamp.
         * @param componentKey {String} : A unique key representing a component.
         * @param timestamp {String/number} : A String or a number representing the timestamp in milliseconds
         * @param icon {String} : A HTML String representing representing the icon. This could be an image, or sprite div.
         * @param key {String} : The event code name, to be displayed in the key column of the hover. This could be just the event name, or could also be HTML.
         * @param value {String} : A HTML String to be displayed in the Value column of the hover.
         * @return A boolean representing whether the data is populated for the requested component or not
         */
        this.insertSeriesIntoHoverMap = function(componentKey, timestamp, icon, key, value) {
            if (typeof this.hoverDataMap[componentKey] === 'undefined') {
                this.hoverDataMap[componentKey] = {};
            }
            if (typeof this.hoverDataMap[componentKey][timestamp] === 'undefined') {
                this.hoverDataMap[componentKey][timestamp] = [];
            }
            this.hoverDataMap[componentKey][timestamp].push({
                ICON: icon,
                KEY: key,
                VALUE: value
            });
        };

        /**
         * Method to get the HTML to be rendered on hover, triggered by the jqplot highligher function from individual components.
         * @param componentKey {String} : A unique key representing a component.
         * @param timestamp {String/number} : A String or a number representing the timestamp in milliseconds
         * @return A consumable HTML string having Icon, Key, Value columns.
         */
        this.getHoverHTML = function(componentKey, timestamp) {
            var dataPoints = this.hoverDataMap[componentKey][timestamp];
            if (!dataPoints) {
                return "";
            }
            var eventDate = new Date(timestamp);
            var hoverHTML = "";
            var formattedDate = this.getFormattedLocalDateTime(eventDate, "FULL_DATE_TIME");
            hoverHTML += "<div class='parto-graph-hover-result-date'>" + formattedDate + "</div>";
            var partoi18n = i18n.discernabu.partogrambase_o2;
            hoverHTML += "<table class ='partogram-graph-tooltip'>";
            hoverHTML += '<tr><th>' + partoi18n.HOVER_ICON + '</th>';
            hoverHTML += '<th>' + partoi18n.HOVER_KEY + '</th>';
            hoverHTML += '<th>' + partoi18n.HOVER_VALUE + '</th></tr>';
            var dataLen = dataPoints.length;
            for (var i = 0; i < dataLen; i++) {
                var dataPoint = dataPoints[i];
                hoverHTML += '<tr>';
                hoverHTML += '<td>' + dataPoint.ICON + '</td>';
                hoverHTML += '<td>' + dataPoint.KEY + '</td>';
                hoverHTML += '<td>' + dataPoint.VALUE + '</td>';
                hoverHTML += '</tr>';
            }
            hoverHTML += "</table>";
            return hoverHTML;
        };

        /**
         * Adds the time scale button as lookback buttons, on the component's header.
         * The styling is same as the lookback buttons.
         * @param {string} compId The component id on which the timescale buttons needs to be added.
         */
        this.addTimeScaleButtons = function(compId) {
            var timeScaleButtonsExists = $('#lookbackDisplay' + compId).find('.lookback-button');
            if (typeof timeScaleButtonsExists[0] === 'undefined') {
                var partoi18n = i18n.discernabu.partogrambase_o2;
                var ONE_HR = partoi18n.ONE_HOUR;
                var FOUR_HR = partoi18n.FOUR_HOUR;
                var EIGHT_HR = partoi18n.EIGHT_HOUR;
                var TWELVE_HR = partoi18n.TWELVE_HOUR;
                var TWENTY_FOUR_HR = partoi18n.TWENTY_FOUR_HOUR;
                var buttonsHTML = '';
                buttonsHTML += '<div class="lookback-button parto1HrButton">' + ONE_HR + '</div>';
                buttonsHTML += '<div class="lookback-button parto4HrButton">' + FOUR_HR + '</div>';
                buttonsHTML += '<div class="lookback-button parto8HrButton">' + EIGHT_HR + '</div>';
                buttonsHTML += '<div class="lookback-button parto12HrButton">' + TWELVE_HR + '</div>';
                buttonsHTML += '<div class="lookback-button parto24HrButton">' + TWENTY_FOUR_HR + '</div>';
                var lookbackDiv = $('#lookbackDisplay' + compId);
                if (lookbackDiv.length > 0) {
                    lookbackDiv = lookbackDiv[0];
                    $(lookbackDiv).append(buttonsHTML);
                    var activeHourWindowClass = ".parto" + this.HOUR_WINDOW + "HrButton";
                    $(lookbackDiv).find(activeHourWindowClass).addClass("lookback-button-active");
                }
            }
        };

        /**
         * This method creates the top time line HTML required by the components to have on the top.
         * @param imageFolder {String} : A string representing the path to the image folder for the calling component.
         * @param componentType {String} : A string representing the type of calling component
         */
        this.createTopBar = function(imageFolder, componentType) {
            //if the top bar html is available, just return it
            if (componentType === "TABLE" && PARTO_GRAPH_BASE.topBarTableHTML) {
                return "<div class ='partoTopBarContainer table'>" + PARTO_GRAPH_BASE.topBarTableHTML + "</div>";
            } else if (componentType === "GRAPH" && PARTO_GRAPH_BASE.topBarGraphHTML) {
                return "<div class ='partoTopBarContainer graph'>" + PARTO_GRAPH_BASE.topBarGraphHTML + "</div>";
            }

            var layoutHTML = '';
            if (componentType === "TABLE") {
                layoutHTML += '<div class="partoTopBarContainer table">';
            } else {
                layoutHTML += '<div class="partoTopBarContainer graph">';
            }
            layoutHTML += '<div class="partoArrowImageDiv">';
            layoutHTML += '<div class="partoArrowImage partoArrowImageLeft partoGraphBaseSprite partoArrowLeft"></div>';
            layoutHTML += '</div>';
            layoutHTML += '<div class="partogram-ruler-time-bar-container">';
            layoutHTML += '<div class="partogram-top-bar-date"><div class="partogram-top-time-bar-date-left"></div><div class="partogram-top-time-bar-date-middle"></div>';
            layoutHTML += '</div>';
            layoutHTML += '<div class="partogram-top-bar-ticks">';
            layoutHTML += '</div>';
            if (componentType === "GRAPH") {
                layoutHTML += '<div class="partogram-top-bar-oxytocin">';
                layoutHTML += "</div>";
                layoutHTML += '<div class="partogram-top-bar-epidural">';
                layoutHTML += "</div>";
            }
            layoutHTML += '</div>';
            layoutHTML += '<div class="partoArrowImageDiv">';
            layoutHTML += '<div class="partoArrowImage partoArrowImageRight partoGraphBaseSprite partoArrowRight"></div>';
            layoutHTML += '</div>';
            layoutHTML += '</div>';
            return layoutHTML;
        };

        /**
         * This function refreshes the graph for each component when any of the graph is scrolled/moved using arrow buttons or
         * dragging on the graph.
         @param endDt {Number} : A number representing time in millisecond.
         */
        this.refreshGraph = function(endDt) {
            endDt = endDt || this.getEndDate();
            this.setEndDate(endDt);
            var componentLen = this.components.length;
            if (this.components.length === 0) {
                return;
            }

            var startDate = this.getStartDate();
            var quarterticks = this.getQuarterTicks();
            var hourticks = this.getHourTicks();
            var majorGridLines = this.getMajorGridLines();
            var todayBar = this.getTodayVerticalBar();
            //A safe estimate for the time difference between the function call and calculating the date here.
            var lastLoadTime = this.partogramLastLoadTime - 2 * ONE_MINUTE_MS;
            for (var i = 0; i < componentLen; i++) {
                var component = this.components[i];
                var jqplotGraph = component.getPlot();
                // a component that has no data will not have a jqplot object
                if (jqplotGraph) {
                    jqplotGraph.axes.x2axis.min = startDate;
                    jqplotGraph.axes.x2axis.max = endDt;
                    jqplotGraph.axes.xaxis.min = startDate;
                    jqplotGraph.axes.xaxis.max = endDt;
                    jqplotGraph.axes.xaxis.ticks = quarterticks;
                    jqplotGraph.axes.x2axis.ticks = hourticks;
                    var canvasOverlayObjs = [];
                    if (component.IS_FHR) {
                        canvasOverlayObjs = canvasOverlayObjs.concat(component.getShadedOverlay());
                    }
                    canvasOverlayObjs = canvasOverlayObjs.concat(majorGridLines);
                    canvasOverlayObjs = canvasOverlayObjs.concat(this.getOxytocinVerticalLines());
                    canvasOverlayObjs = canvasOverlayObjs.concat(this.getEpiduralVerticalLines());
                    //show the today's bar only if dragged till today.
                    if (endDt >= lastLoadTime) {
                        canvasOverlayObjs = canvasOverlayObjs.concat(todayBar);
                    }
                    var canvasOpts = {};
                    canvasOpts.objects = canvasOverlayObjs;
                    var co = new $.jqplot.CanvasOverlay(canvasOpts);
                    jqplotGraph.plugins.canvasOverlay = co;
                    jqplotGraph.redraw();
                }
            }
            this.addOpenHandCursor();
        };

        /**
         * This function generates an canvas overlay object used by the component's to show the today's vertical bar.
         */
        this.getTodayVerticalBar = function() {
            var plotWidth = this.container2Width;
            //plotWidth will null only for the first component
            if (plotWidth === null) {
                var containers = $('.partogramGraphDiv');
                //this condition implies if there are any graph components already loaded/rendered, then take their width as plot width.
                if (containers.length > 0) {
                    plotWidth = parseInt($(containers.get(0)).css('width'), 10);
                    //else the mpage has only overview and table component(s)
                } else {
                    plotWidth = this.getComponentWidth();
                }
                //set container2Width for the next component loading to avoid caclulating the width again
                this.container2Width = plotWidth;
            }
            var timeDiff = this.HOUR_WINDOW * ONE_HOUR_MS;
            //convert 5px to time
            var timeToPixelRatio = timeDiff / plotWidth * 5;
            var adjustedLastLoadTime = this.partogramLastLoadTime - timeToPixelRatio;
            return {
                verticalLine: {
                    name: "todayNow",
                    x: adjustedLastLoadTime,
                    lineWidth: 10,
                    color: "rgba(245, 118, 0, 0.2)",
                    lineCap: "square",
                    shadow: false
                }
            };
        };

        /**
         * Removes the colon from a string if it is the last character
         */
        this.removeColonEndOfString = function(stringVal) {
            var str = $.trim(stringVal);
            if (str && str.length > 0) {
                var lastChar = str[str.length - 1];
                if (lastChar === ":") {
                    return str.substring(0, str.length - 1);
                }
            }
            return str;
        };

        /**
         * Refreshes the epidural bar on top of all graphing components.
         */
        this.refreshEpidural = function() {
            //return if no graphing component loaded or overview component is not loaded.
            if (this.components.length === 0 || this.epiNameArray.length === 0) {
                return;
            }
            var childDiv = '';
            var i, eventTime;
            var epiduralDiv = $('.partogram-top-bar-epidural');

            $(epiduralDiv).html('');
            var epiData = this.epiduralData;
            var epiMap = this.getEpiduralMap();
            var sortedEpiData = [];
            var len;
            for (i = 0, len = epiData[epiMap.START].length; i < len; i++) {
                eventTime = this.getLocalDateTime(epiData[epiMap.START][i].EPIDURAL_VALUE);
                sortedEpiData.push([eventTime, epiMap.START]);
            }
            for (i = 0; i < epiData[epiMap.BOLUS_ANESTHESIA].length; i++) {
                eventTime = this.getLocalDateTime(epiData[epiMap.BOLUS_ANESTHESIA][i].EPIDURAL_VALUE);
                sortedEpiData.push([eventTime, epiMap.BOLUS_ANESTHESIA]);
            }
            for (i = 0; i < epiData[epiMap.BOLUS_PATIENT].length; i++) {
                eventTime = this.getLocalDateTime(epiData[epiMap.BOLUS_PATIENT][i].EPIDURAL_VALUE);
                sortedEpiData.push([eventTime, epiMap.BOLUS_PATIENT]);
            }
            for (i = 0; i < epiData[epiMap.DISCONTINUED].length; i++) {
                eventTime = this.getLocalDateTime(epiData[epiMap.DISCONTINUED][i].EPIDURAL_VALUE);
                sortedEpiData.push([eventTime, epiMap.DISCONTINUED]);
            }
            sortedEpiData.sort(function(epiPoint1, epiPoint2) {
                return epiPoint1[0] - epiPoint2[0];
            });

            //high level algorithm for drawing epidural data:
            //Get the first epidural start time. The data needs to be documented in a session which has a start event and discontinued event if the session is ended.
            //Ignore all other documentation/data till you find the start time as other documentations without a start implied incorrect documentation by the user.
            //Once you have the start time, get that sessions end time if it's discontinued or get the last documented point.
            //Add the points to a HTML string as they come after the start time.
            //Once you encounter discontinued, add the above HTML string to the DOM.
            //Repeat the above steps after the session is done to get the new session.
            var epiSessionValid = false;
            var epiSessionStart = null;
            var epiSessionEnd = null;
            var min = this.getStartDate();
            var plotWidth = this.getComponentWidth();
            var timeDiff = this.HOUR_WINDOW * ONE_HOUR_MS;
            var lastLoadTime = this.partogramLastLoadTime;
            var pixelToTimeRatio = plotWidth / timeDiff;
            var horizontalBarWidth = 0;
            var EPI_IMG_WIDTH = 8;
            var EPI_START_IMG_WIDTH = 8;
            for (i = 0, len = sortedEpiData.length; i < len; i++) {
                if (sortedEpiData[i][1] === epiMap.START && !epiSessionValid) {
                    epiSessionValid = true;
                    epiSessionStart = sortedEpiData[i][0];
                    epiSessionEnd = lastLoadTime;
                    var j;
                    for (j = i + 1; j < len; j++) {
                        if (sortedEpiData[j][1] === epiMap.DISCONTINUED) {
                            epiSessionEnd = sortedEpiData[j][0];
                            break;
                        }
                    }
                    epiSessionEnd = Math.min(lastLoadTime, epiSessionEnd);
                    var barLeft = parseFloat((epiSessionStart - min) * pixelToTimeRatio) - this.ARROW_BUTTON_WIDTH;
                    horizontalBarWidth = parseFloat((epiSessionEnd - min) * pixelToTimeRatio) - parseFloat((epiSessionStart - min) * pixelToTimeRatio);
                    childDiv = '<div class="partoEpiHorizontalBar" style="width:' + horizontalBarWidth + 'px;left:' + barLeft + 'px;top:1px;"></div>';
                    $(epiduralDiv).append(childDiv);
                    childDiv = '';
                }
                if (!epiSessionValid || sortedEpiData[i][0] > lastLoadTime) {
                    continue;
                }
                var left = parseFloat((sortedEpiData[i][0] - min) * pixelToTimeRatio) - this.ARROW_BUTTON_WIDTH;
                switch (sortedEpiData[i][1]) {
                    case epiMap.START:
                        left -= EPI_START_IMG_WIDTH / 2.0;
                        childDiv += '<div class="partoEpiHover partoOverviewSprite partoEpiStart" time="' + sortedEpiData[i][0] + '" style="position:absolute;left:' + left + 'px"></div>';
                        break;
                    case epiMap.BOLUS_ANESTHESIA:
                        left -= EPI_IMG_WIDTH / 2.0;
                        childDiv += '<div class="partoEpiHover partoOverviewSprite partoEpiBA" time="' + sortedEpiData[i][0] + '" style="position:absolute;left:' + left + 'px"></div>';
                        break;
                    case epiMap.BOLUS_PATIENT:
                        left -= EPI_IMG_WIDTH / 2.0;
                        childDiv += '<div class="partoEpiHover partoOverviewSprite partoEpiBP" time="' + sortedEpiData[i][0] + '" style="position:absolute;left:' + left + 'px"></div>';
                        break;
                    case epiMap.DISCONTINUED:
                        left -= EPI_IMG_WIDTH / 2.0;
                        childDiv += '<div class="partoEpiHover partoOverviewSprite partoIVStop" time="' + sortedEpiData[i][0] + '" style="position:absolute;left:' + left + 'px"></div>';
                        break;
                }
                if (sortedEpiData[i][1] === epiMap.DISCONTINUED) {
                    epiSessionValid = false;
                    $(epiduralDiv).append(childDiv);
                    childDiv = '';
                }
            }
            //Append the trailing points if any to the DOM as the last session is might not have ended.
            if (childDiv) {
                $(epiduralDiv).append(childDiv);
            }
        };

        this.refreshOxytocin = function() {
            if (this.components.length === 0 || this.oxytocinData.length === 0) {
                return;
            }
            var oxytocinDiv = $('.partogram-top-bar-oxytocin');
            $(oxytocinDiv).html('');
            var oxyData = this.oxytocinData;
            var dosageCnt = oxyData.length;
            var min = this.getStartDate();
            var lastLoadTime = this.partogramLastLoadTime;
            var timeDiff = this.HOUR_WINDOW * ONE_HOUR_MS;
            var plotWidth = this.getComponentWidth();
            var pixelToTimeRatio = plotWidth / timeDiff;
            var OXY_IMG_WIDTH = 8;
            var OXY_START_IMG_WIDTH = 8;
            var startTime = null;
            var startDoseIndex = null;
            var currentState = 1;
            var prevDosageValue = -1;
            var oxyState = {
                STOP: 0,
                START: 1,
                INCREASE: 2,
                DECREASE: 3
            };
            var i = 0,
                index;
            var childDiv = '';
            for (i = 0; i < dosageCnt; i++) {
                var dosage = oxyData[i];
                //ignore the stop points
                if (startTime === null && dosage.VALUE !== 0) {
                    startTime = dosage.TIME;
                    startDoseIndex = i;
                    var endTime = lastLoadTime;
                    prevDosageValue = dosage.VALUE;
                    for (index = i + 1; index < dosageCnt; index++) {
                        if (oxyData[index].VALUE === 0) {
                            endTime = oxyData[index].TIME;
                            break;
                        }
                    }
                    endTime = Math.min(lastLoadTime, endTime);
                    var barLeft = parseFloat((startTime - min) * pixelToTimeRatio) - this.ARROW_BUTTON_WIDTH;
                    var horizontalBarWidth = parseFloat((endTime - min) * pixelToTimeRatio) - parseFloat((startTime - min) * pixelToTimeRatio);
                    var horizontalBarHTML = '<div class="partoOxyHorizontalBar" style="width:' + horizontalBarWidth + 'px;left:' + barLeft + 'px;top:1px;"></div>';
                    $(oxytocinDiv).append(horizontalBarHTML);
                    currentState = oxyState.START;
                }

                var currentDosageValue = dosage.VALUE;
                if (currentDosageValue === 0) {
                    currentState = oxyState.STOP;
                }
                if (startDoseIndex !== i && currentState !== oxyState.STOP) {
                    if (currentDosageValue > prevDosageValue) {
                        currentState = oxyState.INCREASE;
                    } else if (currentDosageValue < prevDosageValue) {
                        currentState = oxyState.DECREASE;
                    } else {
                        continue;
                    }
                }
                var currentDosageTime = dosage.TIME;
                if (currentDosageTime > lastLoadTime) {
                    break;
                }
                var left = parseFloat((currentDosageTime - min) * pixelToTimeRatio, 10) - this.ARROW_BUTTON_WIDTH;
                switch (currentState) {
                    case oxyState.START:
                        left -= OXY_START_IMG_WIDTH / 2.0;
                        childDiv += '<div class="partoOxyHover partoOverviewSprite partoOxyStart" time="' + currentDosageTime + '" style="position:absolute;left:' + left + 'px"></div>';
                        break;
                    case oxyState.INCREASE:
                        left -= OXY_IMG_WIDTH / 2.0;
                        childDiv += '<div class="partoOxyHover partoOverviewSprite partoOxyIncrease" time="' + currentDosageTime + '" style="position:absolute;left:' + left + 'px"></div>';
                        break;
                    case oxyState.DECREASE:
                        left -= OXY_IMG_WIDTH / 2.0;
                        childDiv += '<div class="partoOxyHover partoOverviewSprite partoOxyDecrease" time="' + currentDosageTime + '" style="position:absolute;left:' + left + 'px"></div>';
                        break;
                    case oxyState.STOP:
                        left -= OXY_IMG_WIDTH / 2.0;
                        childDiv += '<div class="partoOxyHover partoOverviewSprite partoIVStop" time="' + currentDosageTime + '" style="position:absolute;left:' + left + 'px"></div>';
                        $(oxytocinDiv).append(childDiv);
                        childDiv = '';
                        startTime = null;
                        break;
                    default:
                        continue;
                }
                prevDosageValue = currentDosageValue;
            }
            if (childDiv) {
                $(oxytocinDiv).append(childDiv);
            }
        };

        this.refreshTopbarTicks = function() {
            //renders the numbers in the format XX:XX
            var min = this.getStartDate();
            var plotWidth = this.getComponentWidth();
            var timeDiff = this.HOUR_WINDOW * ONE_HOUR_MS;
            var pixelToTimeRatio = plotWidth / timeDiff;
            var hourticks = this.hourTicks;
            var len = hourticks.length;
            var ticksDiv = $('.partogram-top-bar-ticks');
            $(ticksDiv).html('');
            //Based on the font that MPages have, each character is taking around 8 pixels. 
            //We have two characters before the colon. The colon acts like the center of the tick. 
            //Hence we need to subtract 16 pixels. 
            var TWO_CHAR_WIDTH = 16;
            var i, tick, left, tickwidth, currentHour;
            var labelStep = this.getMajorTickLabelStep();
            for (i = 0; i < len; i++) {
                if (hourticks[i] instanceof Array) {
                    continue;
                }
                currentHour = new Date(hourticks[i]).getHours();
                //draw only when hour is a multiple of label step. 
                if (currentHour % labelStep !== 0) {
                    continue;
                }
                tick = this.getFormattedLocalDateTime(new Date(hourticks[i]), "MILITARY_TIME");
                //get the absolute position of the current tick label. For this, the parent div needs to be a positioned element.
                left = (hourticks[i] - min) * pixelToTimeRatio - TWO_CHAR_WIDTH - this.ARROW_BUTTON_WIDTH;
                $(ticksDiv).append('<span class="partoHourTick" style="left:' + left + 'px">' + tick + '</span>');
            }
        };

        /**
         * This function refreshes all the graphing components to show the correct time if
         * uniqueCompID is not provided, else it will only refresh it for that particular component
         */
        this.refreshTopbar = function(uniqueCompID) {
            var compID = uniqueCompID ? "#" + uniqueCompID : "";
            var startDate = new Date(this.getStartDate());
            var endDate = new Date(this.endDate);
            var partoLastLoadTime = new Date(this.partogramLastLoadTime);
            var rfi18n = i18n.discernabu.partogrambase_o2;
            var startDateString = this.getFormattedLocalDateTime(startDate, "MEDIUM_DATE");
            var endDateString = this.getFormattedLocalDateTime(endDate, "MEDIUM_DATE");
            if (startDate.toDateString() === partoLastLoadTime.toDateString()) {
                startDateString = '<b>' + rfi18n.TODAY + '</b> ' + startDateString;
            }
            if (endDate.toDateString() === partoLastLoadTime.toDateString()) {
                endDateString = '<b>' + rfi18n.TODAY + '</b> ' + endDateString;
            }
            startDateString = '&nbsp;' + startDateString;
            endDateString = '&nbsp;' + endDateString;
            var BUTTON_WIDTH = 20;
            var LEFT_BORDER_WIDTH = 2;
            var plotWidth = this.getComponentWidth();
            var timeBarWidth = plotWidth - 2 * BUTTON_WIDTH;
            $(compID + ' .partogram-ruler-time-bar-container').css('width', timeBarWidth);
            $(compID + ' .partogram-top-bar-date').css('width', timeBarWidth);
            $(compID + ' .partogram-top-bar-ticks').css('width', timeBarWidth);
            var dateLeft = $(compID + ' .partogram-top-time-bar-date-left');
            var dateMiddle = $(compID + ' .partogram-top-time-bar-date-middle');
            var max = this.getEndDate();
            var timeDiff = this.HOUR_WINDOW * ONE_HOUR_MS;
            var pixelToTimeRatio = plotWidth / timeDiff;
            dateLeft.html('');
            dateLeft.css('width', timeBarWidth);
            dateMiddle.css('border-left', '');
            dateMiddle.html('');
            dateMiddle.css('width', '0px');
            dateLeft.html(startDateString);
            var min = this.getStartDate();
            //show 2 dates in the timeline axis.
            if (startDate.toDateString() !== endDate.toDateString()) {
                $(compID + ' .partogram-top-time-bar-date-middle').html(endDateString);
                $(compID + ' .partogram-top-time-bar-date-middle').css('border-left', '2px solid #a5a5a5');
                var nextDate = new Date(max);
                nextDate.setHours(0);
                nextDate.setMinutes(0);
                nextDate.setSeconds(0);
                nextDate.setMilliseconds(0);
                var dayChangeTick = Math.floor((nextDate.getTime() - min) * pixelToTimeRatio);
                //when the 00:00 tick is behind the left arrow button. Show only one date.
                // These conditions are present only due to the fact that the left/right arrow buttons sits inside the
                //graphing area
                if (dayChangeTick <= BUTTON_WIDTH) {
                    dateLeft.html('');
                    dateLeft.css('width', '0px');
                    dateMiddle.css('width', timeBarWidth - LEFT_BORDER_WIDTH);
                } else {
                    var leftWidth = Math.min(timeBarWidth, dayChangeTick - BUTTON_WIDTH - LEFT_BORDER_WIDTH);
                    var rightWidth = Math.max(0, timeBarWidth - leftWidth - BUTTON_WIDTH);
                    dateLeft.css('width', leftWidth);
                    dateMiddle.css('width', rightWidth);
                    if (rightWidth === 0) {
                        dateMiddle.css('border-left', '');
                    }
                }
                //the 00:00 tick goes beyond the right arrow.
                if (dayChangeTick >= timeBarWidth + BUTTON_WIDTH) {
                    dateMiddle.html('');
                }
            }
            this.refreshTopbarTicks();
            this.refreshOxytocin();
            this.refreshEpidural();
            this.topBarGraphHTML = $('.partoTopBarContainer.graph').html();
            this.topBarTableHTML = $('.partoTopBarContainer.table').html();
        };


        /**
         * A utility function to get the correct format of time as required. Prepends a 0 if the number is less than 10.
         */
        this.formatTime = function(val) {
            if (val < 10) {
                return '0' + val;
            }
            return val;
        };

        /**
         * A subscriber method where graphing component can subscribe to get the user changes to refresh the graph.
         */
        this.addSubscriber = function(component) {
            if (component instanceof MPageComponent) {
                this.components.push(component);
            }
        };

        /**
         * Returns the width of the partogram components
         */
        this.getComponentWidth = function() {
            //since we cannot guarantee the order in which components loads,
            //always make sure graph is not there, before taking table's width
            return this.componentWidth || this.setComponentWidth();
        };

        /** 
         * Sets the Partogram components width
         * if graph component is not available, table component's width will be returned
         */
        this.setComponentWidth = function() {
        	//obtained from CSS rule we set for jqplot y-axis width and margin
            var leftaxesWidth = 25;
            var padding = 16;
            //the partogram component column 1's % width.This must match the width provided
            //in the css for .partogram-container-col-1
            var percentageCol1Width = 0.12;
            //the partogram component column 2's % width.This must match the width provided
            //in the css for .partogram-container-col-2
            var percentageCol2Width = 0.88;
            var marginOffsetForAxes = 10;
            var i;
            var rightaxesWidth = marginOffsetForAxes + this.getWidthOffsetForGraph();
            var compWidth;
            for (i = 0; i < this.components.length; i++) {
                compWidth = $('#' + this.components[i].getStyles().getId()).width();
                if (compWidth)
                    break;
            }
            //if not available, get width from table component
            if (!compWidth) {
                var tableMap = PARTO_TABLE_BASE.tableComponentsMap;
                for (var uniqueCompId in tableMap) {
                    if (tableMap.hasOwnProperty(uniqueCompId)) {
                        compWidth = $('#' + uniqueCompId).width();
                        if (compWidth)
                            break;
                    }
                }
            }

            this.componentWidth = (compWidth - padding) * percentageCol2Width - leftaxesWidth - rightaxesWidth;
            //since we already have the component width, setting the table's legend col width
            PARTO_TABLE_BASE.legendColumnWidth = (compWidth - padding) * percentageCol1Width;
            return this.componentWidth;
        };

        /**
         * A function which registers the dragging events on the graph and table, the left arrow and right arrow click events.
         */
        this.registerEvents = function() {
            var isGraphDragging = false;
            var isTableDragging = false;


            /**
             * Calls the capability timer to capture what time scale was clicked.
             * @param timeScale : A string indicating the timescale button selected
             */
            function captureTimeScaleClickTime(timeScale) {
                var timeScaleTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMGRAPHBASE.O2 - time scale switch", '');
                if (timeScaleTimer) {
                    timeScaleTimer.addMetaData('rtms.legacy.metadata.1', timeScale);
                    timeScaleTimer.capture();
                }
            }


            var originalX = 0.0;
            $(document).on('mousedown', '.partogramGraphDiv', function(e) {
                PARTO_GRAPH_BASE.addGrabbingHandCursor();
                originalX = e.clientX;
                $(document).mousemove(function() {
                    isGraphDragging = true;
                    $(document).unbind("mousemove");
                });
            });
            $(document).on('mouseup', '.partogramGraphDiv', function(e) {
                var wasDragging = isGraphDragging;
                isGraphDragging = false;
                PARTO_GRAPH_BASE.addOpenHandCursor();
                $(document).unbind("mousemove");
                if (!wasDragging) {
                    return;
                }
                var pixelDiff = originalX - e.clientX;
                //Move graph
                var endDt = PARTO_GRAPH_BASE.getEndDate();
                endDt = PARTO_GRAPH_BASE.getAdjustedEndDateForScrolling(endDt, pixelDiff);
                PARTO_GRAPH_BASE.refreshGraph(endDt);
                PARTO_TABLE_BASE.refreshTable();
                PARTO_GRAPH_BASE.refreshTopbar();
                captureMovingComponentTime('DRAGGED, GRAPH');

            });
            $(document).on('mousedown', ".partogramTableBodyDiv td", function(e) {
                originalX = e.clientX;
                PARTO_TABLE_BASE.setCursorHand("CLOSE");
                $(document).mousemove(function() {
                    isTableDragging = true;
                    $(document).unbind("mousemove");
                });
            });
            $(document).on('mouseup', ".partogramTableBodyDiv td", function(e) {
                var wasDragging = isTableDragging;
                isTableDragging = false;
                $(document).unbind("mousemove");
                if (!wasDragging) {
                    return;
                }
                var pixelDiff = originalX - e.clientX;
                //Move graph
                var endDt = PARTO_GRAPH_BASE.getEndDate();
                endDt = PARTO_GRAPH_BASE.getAdjustedEndDateForScrolling(endDt, pixelDiff);
                PARTO_GRAPH_BASE.refreshGraph(endDt);
                //scroll table
                PARTO_TABLE_BASE.refreshTable();
                PARTO_GRAPH_BASE.refreshTopbar();
                captureMovingComponentTime('DRAGGED, TABLE');
            });
            $(document).on("click", ".partoArrowImageLeft", function() {
                var endDt = PARTO_GRAPH_BASE.getEndDate() - PARTO_GRAPH_BASE.getMajorTickLabelStep() * PARTO_GRAPH_BASE.getMajorTickStep() * ONE_HOUR_MS;
                endDt = PARTO_GRAPH_BASE.getAdjustedEndDateForScrolling(endDt, 0);
                PARTO_GRAPH_BASE.refreshGraph(endDt);
                PARTO_TABLE_BASE.refreshTable();
                PARTO_GRAPH_BASE.refreshTopbar();
                captureMovingComponentTime('BUTTON');
            });
            $(document).on("click", ".partoArrowImageRight", function() {
                var endDt = PARTO_GRAPH_BASE.getEndDate() + PARTO_GRAPH_BASE.getMajorTickLabelStep() * PARTO_GRAPH_BASE.getMajorTickStep() * ONE_HOUR_MS;
                endDt = PARTO_GRAPH_BASE.getAdjustedEndDateForScrolling(endDt, 0);
                PARTO_GRAPH_BASE.refreshGraph(endDt);
                PARTO_TABLE_BASE.refreshTable();
                PARTO_GRAPH_BASE.refreshTopbar();
                captureMovingComponentTime('BUTTON');
            });

            /**
             * The event handlers for the timescale buttons. Set the hour window so that the new major/minor ticks
             * are recalculated based on the new time scale.
             * Update the CSS to show it's active, removing the previous active state.
             */
            $(document).on('click', '.parto1HrButton', function() {
                PARTO_GRAPH_BASE.repaintComponents(1);
                captureTimeScaleClickTime('1');
            });

            $(document).on('click', '.parto4HrButton', function() {
                PARTO_GRAPH_BASE.repaintComponents(4);
                captureTimeScaleClickTime('4');
            });

            $(document).on('click', '.parto8HrButton', function() {
                PARTO_GRAPH_BASE.repaintComponents(8);
                captureTimeScaleClickTime('8');
            });

            $(document).on('click', '.parto12HrButton', function() {
                PARTO_GRAPH_BASE.repaintComponents(12);
                captureTimeScaleClickTime('12');
            });

            $(document).on('click', '.parto24HrButton', function() {
                PARTO_GRAPH_BASE.repaintComponents(24);
                captureTimeScaleClickTime('24');
            });


            /**
             * Calls the capability timer to capture when a graph was moved.
             * @param timeScale : A string indicating the method used to move, either drag/arrow button
             */
            function captureMovingComponentTime(triggeringMethod) {
                var timeScaleTimer = new CapabilityTimer("CAP:MPG.PARTOGRAMGRAPHBASE.O2 - moving component", '');
                if (timeScaleTimer) {
                    timeScaleTimer.addMetaData('rtms.legacy.metadata.1', triggeringMethod);
                    timeScaleTimer.capture();
                }
            }
        };

        /**
         * A method which set the common css for all components.
         */
        this.setGraphsCommonCSS = function() {
            this.addOpenHandCursor();
        };

        this.repaintComponents = function(hourWindow) {
            var buttonName = 'parto' + hourWindow + 'HrButton';
            this.setHourWindow(hourWindow);
            this.setFinalEndTime();
            var endDt = this.getEndDate();
            endDt = this.getAdjustedEndDateForScaleSwitch(endDt, 0);
            this.refreshGraph(endDt);
            $('.lookback-button-active').removeClass('lookback-button-active');
            $('.' + buttonName).addClass('lookback-button-active');
            PARTO_TABLE_BASE.redrawTable(hourWindow);
            this.refreshTopbar();
        };

        /**
         * Adds the open hand cursor on all the graphing components.
         * Need to give full relative URL as I.E. doesn't support relative URL from the CSS file(which will be "../images/<FILENAME>")
         * Giving full relative URL works for all browsers.
         */
        this.addOpenHandCursor = function() {
            if (this.components.length === 0) {
                return;
            }
            var component = this.components[0];
            var staticContentPath = component.getCriterion().static_content;
            var cursorPath = staticContentPath + '/images/partoOpenHand.cur';
            $('.partogramGraphDiv').find('.jqplot-event-canvas').css('cursor', 'url(' + cursorPath + '), default');
        };

        /**
         * Adds the grabbing hand cursor on all the graphing components.
         * Need to give full relative URL as I.E. doesn't support relative URL from the CSS file(which will be "../images/<FILENAME>")
         * Giving full relative URL works for all browsers.
         */
        this.addGrabbingHandCursor = function() {
            if (this.components.length === 0) {
                return;
            }
            var component = this.components[0];
            var staticContentPath = component.getCriterion().static_content;
            var cursorPath = staticContentPath + '/images/partoClosedHand.cur';
            $('.partogramGraphDiv').find('.jqplot-event-canvas').css('cursor', 'url(' + cursorPath + '), default');
        };

        /**
         * This method calculates the offset width for the graph's which do not have the y2axis.
         * Since Labor Curve component has a y2axis, it breaks the alignment of the timeline
         * and the ticks.
         */
        this.getWidthOffsetForGraph = function() {
            if (this.offsetWidth) {
                return this.offsetWidth;
            } else {
                var widthOffset = 0;
                var axisMargin = 10;
                var fifthsPalPableAxisWidth = 6;
                //because of the use of -ve integers, fetal station width is bigger
                var fetalStationAxisWidth = 12;
                if (this.fetalHeadEngagementMode) {
                    if (this.fetalHeadEngagementMode === "FIFTHS_PALPABLE") {
                        widthOffset = fifthsPalPableAxisWidth;
                    } else {
                        widthOffset = fetalStationAxisWidth;
                    }
                }
                widthOffset += axisMargin;
                this.offsetWidth = widthOffset;
                
                return widthOffset;
            }
        };
    }

    var partoGraphBaseObj = new PartoGraphBase();
    var currentTime = new Date().getTime();
    partoGraphBaseObj.setPartogramLastLoadTime(currentTime);
    jQuery.jqplot.config.enablePlugins = true;
    partoGraphBaseObj.registerEvents();
    return partoGraphBaseObj;
})();
