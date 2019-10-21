/**
 * The JavaScript code for the Febrile Neutropenia MPage.
 * 
 * @author <a href="mailto:steven.mountjoy@cerner.com>Steven MountJoy</a>
 * @version 1.0
 */
/**
 * Override jQuery flot's formatDate function to zero-pad month and date, if
 * necessary.
 *
 * This was supposed to be fixed (format: "%0_") but I could not get it to work.
 * See <a href="http://groups.google.com/group/flot-graphs/browse_thread/thread/79a840c3e0b9c9c1>
 * issue</a>.
 * 
 * @param {Number} The time of the Date (i.e. Date.getTime()) that will be
 *          formatted.
 * @param {String} formatstring The string that will be used to format the date.
 *          Unused here.
 * @param {Array} The array of Strings representing the month names that will be
 *          used in the formatted date. Unused here.
 *          
 * @returns {String} The formatted date String, MM/DD, both MM and DD zero-padded
 *          if necessary.        
 */
$.plot.formatDate = function(date, formatstring, monthNames) {
    var m = date.getUTCMonth() + 1;
    var d = date.getUTCDate();
    
    var zeroPad = function(num) {
        return num < 10 ? "0" + num : num;
    };
    
    return zeroPad(m) + "/" + zeroPad(d);
};

registerNS("com.cerner.oncology.fn"); // register namespace

/**
 * @namespace The namespace for this MPage.
 */
com.cerner.oncology.fn = com.cerner.oncology.fn;

/**
 * Represents a datum for creating the coordinates of the graph and various css
 * properties for calculating offsets and positions of all other position-sensitive
 * elements.
 * 
 * @param {Array} plot (x:Number, y:Number) coordinates that will be plotted on
 *             the graph. x should represent the UTC-version of the desired locale-
 *             specific time, in Number format (i.e. Date.getTime()).
 * @class
 * @property {Number} center An integer, irrespective of units, representing 
 * the center x-coordinate of this datum.
 * @property {Number} left An integer, irrespective of units, representing 
 * the left-most x-coordinate of this datum.
 * @property {Array} plot (x:Number, y:Number) the cartesian plot of this datum.
 * x should be the UTC time (from Date.getTime()) and y should be the measurement.
 */
com.cerner.oncology.fn.GraphDatum = function(plot) {
    this.center = 0;  
    this.left = 0;
    this.plot = plot || [];
};

/**
 * @returns {Number} The locale time version of the x-coordinate of the plot. 
 */
com.cerner.oncology.fn.GraphDatum.prototype.getLocaleTime = function() {
    return this.getUTCTime() + (new Date(this.getUTCTime()).getTimezoneOffset()) * 60 * 1000;
};

/**
 * @returns {Number} measurement The measurement that will be plotted, with respect
 *                  to the x-coordinate (the time value), on the graph.
 */        
com.cerner.oncology.fn.GraphDatum.prototype.getMeasurement = function() {
    return this.plot[1];
};

/**
 * @returns {Number} The UTC time version of the x-coordinate of the plot. 
 */        
com.cerner.oncology.fn.GraphDatum.prototype.getUTCTime = function() {
    return this.plot[0];
};

/**
 * @param {Number} measurement The measurement with respect to the x-axis.
 * 
 * @see GraphDatum.prototype#getMeasurement()
 */        
com.cerner.oncology.fn.GraphDatum.prototype.setMeasurement = function(measurement) {
    this.plot = [this.getUTCTime(), measurement];
};

/**
 * Contains the data necessary for displaying in popups for temperature and lab results.
 * 
 * @param {Date} date The Date of the result.
 * @class
 * @property {Date} date The Date of the result.
 * @property {String} label The name of the result.
 * @property {String} result The actual measured result.  
 * @property {String} unit The unit of the result.  
 * @property {Number} xValue For temperatures, this is the x-axis coordinate of the result.
 * Used as a key to look up data in the data store.
 */
com.cerner.oncology.fn.TemperatureLabPopupDatum = function(date) {
    this.date = date; 
    this.label = "";
    this.result = "";
    this.unit = "";
    this.xValue = 0;
};

/**
 * Contains the data necessary for displaying in popups order results.
 * 
 * @class
 * @property {String} label The label of the result.
 * @property {String} name The name of the result.
 * @property {Number} startDate The start date of the order, from Date.getTime().  
 * @property {Number} stopDate The stop date of the order, from Date.getTime().
 * May be 0 if order has no stop date.
 * @property {Boolean} estStart Indicates if the order start date is an estimation. 
 * @property {Boolean} estStop Indicates if the order stop date is an estimation.
 * @property {String} status The status of the order.
 * @property {String} clinicalDisplayLine The clinical display line for the order.         
 */
com.cerner.oncology.fn.OrderPopupDatum = function() {
    this.label = "";
    this.name = "";
    this.startDate = 0;
    this.stopDate = 0;
    this.estStart = false;  
    this.estStop = false;     
    this.status = "";
    this.clinicalDisplayLine = "";
    
    /**
     * Prepends an estimated designation if present and formats the Date string.
     * 
     * @param {Boolean} estInd If true, &quot;Est*&quot; will be prepended to the date.
     * @param {Number} date The time of the Date (i.e. Date.getTime()) that may
     *          be modified with the estimation string and will be formatted.
     *          
     * @returns {String} The formatted date string.   
     */     
    this.getDateDisplay = function(estInd, date) {
        var d = new Date(date);
        if (isNaN(d)) {
            return "";
        } else {
            var est = (estInd ? "*Est. " : "");
            return est + d.format("mm/dd/yyyy HH:MM Z");
        }       
    };
};   

/**
 * Gets the start date display.
 * 
 * @returns {String} The formatted start date string.   
 */
com.cerner.oncology.fn.OrderPopupDatum.prototype.getStartDateDisplay = function() {
    return this.getDateDisplay(this.estStart, this.startDate);
};

/**
 * Gets the stop date display.
 * 
 * @returns {String} The formatted stop date string.   
 */
com.cerner.oncology.fn.OrderPopupDatum.prototype.getStopDateDisplay = function() {
    return this.getDateDisplay(this.estStop, this.stopDate);
};

com.cerner.oncology.fn.graphData = []; // contains the graph data of the selected date range.
com.cerner.oncology.fn.dataStore = {}; // the data store for popup data
com.cerner.oncology.fn.xmlParser = new DOMParser(); // used to load xml ajax returns
com.cerner.oncology.fn.containerAdd = 28; // additional width to prevent v-scroll bar

/**
 * Removes the unit of a measured CSS properties (e.g. "176px" becomes 176).
 * 
 * @param {String} The measured CSS property.
 * 
 * @returns {Number} The numerical value of the property.
 */
com.cerner.oncology.fn.stripUnit = function(measurement) {
    return parseInt(measurement.replace(/[^\d\.]/g, ''), 10);
};

/**
 * Positions the popup so as to not appear off screen.
 * 
 * @param {Object} popup The jQuery popup whose position (top, left) will be set
 *              according to the event coordinates and the window dimensions.
 * @param {Object} event Whose pageX and pageY members will be used to determine
 *              popup positioning.              
 */
com.cerner.oncology.fn.positionPopup = function(popup, event) {
    var stripUnit = com.cerner.oncology.fn.stripUnit;
    var winWidth = getAbsoluteViewportWidth();
    var winHeight = getAbsoluteViewportHeight();
    var popupWidth = stripUnit($(popup).css("width"));
    isNaN(popupWidth) && (popupWidth = popup.width());
    var popupHeight = $(popup).height() * 1;
    var x = (event.clientX * 1) + getViewportScrollX();
    var y = (event.clientY * 1) + getViewportScrollY();


    var rightlimit = event.pageX - popupWidth - 10;
    var leftlimit = getViewportScrollX();
    if ((x + popupWidth + 10) >= winWidth) {
        if (rightlimit < leftlimit) {
            rightlimit = leftlimit
        }
        popup.css({
            left: rightlimit
        });
    } else {

        popup.css({
            left: (event.pageX * 1) + 10

        });
    }

    var lowerlimit = event.pageY - popupHeight - 10;
    var upperlimit = getViewportScrollY();
    if ((y + popupHeight + 10) >= winHeight) {
        if (lowerlimit < upperlimit) {
            lowerlimit = upperlimit
        }
        popup.css({
            top: lowerlimit
        });
    } else {

        popup.css({
            top: (event.pageY * 1) + 10

        });
    }

};

/**
 * Apply static width styles to the dynamic sections according to the selected date range.
 * 
 * @param {Number} daysBack  The days back, today inclusive, for which to set the
 *                  width for all dynamic sections of the page.
 */
com.cerner.oncology.fn.resizeDynamicWidths = function(daysBack) {
    var stripUnit = com.cerner.oncology.fn.stripUnit;
    switch (daysBack) {
    case 14:
        $(".graph, .xAxis").removeClass("width4Weeks width8Weeks").addClass("width2Weeks");
        break;
    case 28:
        $(".graph, .xAxis").removeClass("width2Weeks width8Weeks").addClass("width4Weeks");
        break;
    case 56:
        $(".graph, .xAxis").removeClass("width2Weeks width4Weeks").addClass("width8Weeks");
        break;
    default:
        alert("Unrecognized date range: " + daysBack + ". Please select again.");
        break;
    }
    
    /* 
     * since the graph has a margin-left offset, we need to account for that in
     * the .data elements' (which are not offset) widths
     */
    var graphWidth = stripUnit($(".graph").css("width"));
    var graphMargin = stripUnit($(".graph").css("margin-left"));
    var offset = graphWidth + graphMargin;
    $(".section, .data").css("width", offset + com.cerner.oncology.fn.containerAdd);
};

/**
 * Retrieves and sets each section's label from the database.
 */
com.cerner.oncology.fn.getSectionLabels = function() {
    var getLabel = function (key, selector) {
        if ($(selector).children().length === 0) {
            var ajax = new XMLCclRequest();
            
            ajax.onreadystatechange = function() {
                if (ajax.readyState === 4 && ajax.status === 200) {
                    var xml = com.cerner.oncology.fn.xmlParser.parseFromString(ajax.responseText, "text/xml");
                    var text = $(xml).find("bedrockInfo").eq(3).children().eq(1).text().trim();
                    $(selector).text(text);
                }
            };
            
            ajax.open("GET", "onc_fn_get_bedrock");
            ajax.send("^MINE^,^" + key + "^");
        }      
    };
    
    getLabel("FEB_NEUT_TEMP", "#temperatureLabel");
    getLabel("FEB_NEUT_LABS", "#labsLabel");
    getLabel("FEB_NEUT_ANTIMICROBIALS", "#ordersLabel");    
};

/**
 * Extracts the relevant data for the temperature and lab sections AJAX calls
 * from the supplied XML event set.
 * 
 * @param {Object} eventSet The DOM XML event set whose events will be
 *                  sorted, functionally, and returned.
 *                  
 * @returns {Array} An array of arrays. The first dimension of the array will sorted
 *                  by date, ascending. The secord dimension will be an array of popup
 *                  data occurring on that date in time, descending.
 */
com.cerner.oncology.fn.sortTemperatureAndLabEventSet = function(eventSet) {
    var popupData = []; // will hold popup data
    var buckets = []; // the return array of arrays
    var results = $(eventSet).find("event");
    var label = $(eventSet).find("event_cd_disp").text().trim();
    
    /*
     * for each event (temp or lab taken), create a TemperatureLabelDatum
     * and lookup its x-coordinate in the data array. add each new popupDatum
     * to a popupDatum array
     */    
    results.each(function(j) {
        var date = Date.parse($(this).find("effective_date").text().trim());
        var result = null;
        var unit = $(this).find("unit_disp").text().trim();
        var measurementType = $(this).find("classification").text().trim();
                            
        if (measurementType === "quantity_value") {
            var number = $(this).find("number").text().trim();
            
            if (isNaN(number)) {
                result = number;
            } else {
                result = (+number).toString();
            }
        } else if (measurementType === "string_value" || measurementType === "code_value") {
            result = $(this).find("value").text().trim();
        }
        
        /* 
         * create new TemperatureLabelDatum. each represents a row on the
         * popup table.
         */
        var popupDatum = new com.cerner.oncology.fn.TemperatureLabPopupDatum(date);
        popupDatum.result = result;
        popupDatum.label = label;
        popupDatum.unit = unit;

        var graphData = com.cerner.oncology.fn.graphData;

        /* if the event date begins before the first graph date = bad script return */
        if (graphData[0].getLocaleTime() > date) {
            return true;            
        }
        /* 
         * if the event date ends after the last graph date (midnight, today), get
         * tomorrow midnight. if the date is greater than that, it didn't fall on
         * today = bad script return
         */
        if (graphData[graphData.length - 1].getLocaleTime() < date) {
            var nextMidnite = graphData[graphData.length - 1].getLocaleTime() + (1000 * 60 * 60 * 24);
            if (date > nextMidnite) {               
                return true; 
            }
        }
        
        /* find the new popupDatum's x-coordinate in the data array */ 
        $.each(graphData, function(k) {
            var localeTime = graphData[k].getLocaleTime();
            var found = localeTime > date;
            if (found) {
                popupDatum.xValue = graphData[k - 1].getUTCTime();
            }
            if (!found && (found = (localeTime === date))) {
                popupDatum.xValue = graphData[k].getUTCTime();                       
            }
            if (!found && (k === graphData.length - 1)) {
                popupDatum.xValue = graphData[k].getUTCTime();
            }
            return !found;
        });
        
        popupData.push(popupDatum);
    });
        
    /* sort the popup array by graph date (x-axis label), ascending */
    popupData.sort(function(a, b) {
        var aXValue = a.xValue;
        var bXValue = b.xValue;
        var comparison = null;
        
        if (aXValue < bXValue) {
            comparison = -1;
        } else if (aXValue > bXValue) {
            comparison = 1;
        } else {
            comparison = 0;
        }
        return comparison;
    });
        
    var prevXAxis = 0; // indicates if new array bucket needs creating
        
    /* 
     * now we must create an array of arrays. each first-order array
     * will represent a graph date. inside each of those, there will be
     * the popup labels (popupDatum) we just sorted by graph date. 
     */
    $.each(popupData, function(k, value) {
        var xAxis = value.xValue;
        
        /* create a new array if need be, push it on the parent array */
        if (xAxis !== prevXAxis) {
            prevXAxis = xAxis;
            var a = [value];
            buckets.push(a);
        /* else add it to the latest array in the parent array */
        } else {
            var b = buckets[buckets.length - 1];
            b.push(value);
        }
    });
        
    /* 
     * next, for each bucket (i.e. the first-order arrays designating
     * graph dates), sort their popup data by date, descending.
     */
    $.each(buckets, function(k) {
        $(this).sort(function(a, b) {
            var aDate = a.date;
            var bDate = b.date;
            var comparison = null;
            
            if (aDate < bDate) {
                comparison = 1;
            } else if (aDate > bDate) {
                comparison = -1;
            } else {
                comparison = 0;
            }
            return comparison;
        });
    });
    
    return buckets;
};

/**
 * Creates the popup table from the passed array for temperature and lab popups.
 * 
 * @param {Array} array An array of TemperatureLabPopupDatums whose data will 
 *          populate the popup.
 *                  
 * @returns {Object} The created popup.
 */
com.cerner.oncology.fn.createTemperatureAndLabPopup = function(array) {
    var popup = $("#tempLabPopup").clone();
    popup.attr("style", ""); // clear hidden and display styles
    popup.find("#tempLabPopupTitle").text(array[0].label);
    
    /* create a row in the popup table for each array element */
    $.each(array, function(index, value) {
        var row = $(document.createElement("tr")).addClass("popupRow");
        var timeColumn = $(document.createElement("td")).addClass("popupColumn tempLabColumn0");
        timeColumn.text(new Date(value.date).format("mm/dd/yyyy HH:MM Z"));
        var resultColumn = $(document.createElement("td")).addClass("popupColumn tempLabColumn1");
        resultColumn.text(value.result + " " + value.unit);
        popup.find("tbody").append(row.append(timeColumn).append(resultColumn));                
    });
    
    popup.appendTo("body"); // append to body for absolute positioning
    
    return popup;    
};

/**
 * Registers popup listeners for temperature plots.
 */
com.cerner.oncology.fn.registerTemperaturePopupListener = function() {
    $("#graphDiv").unbind(); // unbind any previous handlers    
    var clone; // popup clone
    
    /* register plothover listener for popup */
    $("#graphDiv").bind("plothover", function(event, pos, item) {
        $("#x").text(pos.x.toFixed(2));
        $("#y").text(pos.y.toFixed(2));
        
        /* if plot reached, create popup by cloning hidden table (in html) */
        if (item) {
            clone && clone.remove();
            var x = item.datapoint[0];
            var array = $.data(com.cerner.oncology.fn.dataStore, "temp-" + x);            
            clone = com.cerner.oncology.fn.createTemperatureAndLabPopup(array);
            var xDiff = getAbsoluteViewportWidth() - pos.pageX;
            var yDiff = getAbsoluteViewportHeight() - pos.pageY;
            pos.clientX = getViewportWidth() - xDiff;
            pos.clientY = getViewportHeight() - yDiff;
            com.cerner.oncology.fn.positionPopup(clone, pos);
        } else {
            clone && clone.remove(); // remove clone if not on plot
        }
    });
    
    /* scenario: popup on edge of graph, user leaves graph div */
    $("#graphDiv").mouseout(function() {
        clone && clone.remove();
    });    
};

/**
 * Calls flot API for graphing.
 *
 * Supplies flot with plots and register handlers.
 * 
 * @param {Number} daysBack  The days back, today inclusive, for which to set the
 *          date range of the graph.
 * @see com.cerner.oncology.fn.populatePlots
 * @see http://code.google.com/p/flot/
 */
com.cerner.oncology.fn.createGraph = function(daysBack) {
    $("#graphDiv").empty();

    /* get each GraphDatum plot and put into this array */
    var graphData = com.cerner.oncology.fn.graphData;
    var p = [];
    var xMin = graphData[0].getUTCTime();
    var xMax = graphData[graphData.length - 1].getUTCTime();
    var yMin = 0;
    var yMax = 0;
    
    
  
    /* add each graphDatum to the plot array, calculate y-min and y-max */
    $.each(graphData, function(index, value) {
        var a = [value.getUTCTime(), value.getMeasurement()];
        p.push(a);
        var measurement = a[1];
        if (measurement) {
            !yMin && (yMin = measurement);
            (measurement < yMin) && (yMin = measurement);
            !yMax && (yMax = measurement);
            (measurement > yMax) && (yMax = measurement);
        } else {
           p[index][0] = null;
        }
    });
    
    /* pad y-min and y-max */
    if (yMin && yMax) {
        yMin = yMin - 2;
        yMax = (yMax * 1) + 2;
    }
   
    /* dynamically set graph height (needed for flot) = 1/3 viewport height */
    $("#graphDiv").css("height", Math.round(getViewportHeight() / 3));
    
    /* 
     * flot plot call, with plot array and various options. note: flot's formatDate()
     * is overridden elsewhere in this script.
     */
    $.plot($("#graphDiv"), [p], {
        colors: ["#FF0000"],
        grid: {
            hoverable: true
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        xaxis: {
            max: xMax,
            min: xMin,
            mode: "time",
            tickSize: [1, "day"]
        },
        yaxis: {
            max: Math.ceil(yMax),
            min: Math.floor(yMin)
        }
    });
    
    /* and register listeners */
    com.cerner.oncology.fn.registerTemperaturePopupListener();
};

/**
 * Creates the other x-axes by cloning the one created by flot and inserting it 
 * into the axes divs.
 * 
 * @see com.cerner.oncology.fn.createGraph
 */
com.cerner.oncology.fn.createXAxes = function() {
    $(".xAxis").empty(); // remove existing
    /* remove y-axis members of flot-generated labels. add to all .xAxis divs */
    var xAxisChildren = $(".tickLabel").clone().slice(0, com.cerner.oncology.fn.graphData.length);
    xAxisChildren.appendTo(".xAxis");
    $(".xAxis").children().css("top", "0px"); // set top to 0 (parent position=relative)
};

/**
 * Calculates the plots' (on the x-axes) positions, so their data may be used to 
 * position other sections' data.
 * 
 * @see com.cerner.oncology.fn.createXAxes
 */
com.cerner.oncology.fn.calculatePlotsPositions = function() {
    var graphData = com.cerner.oncology.fn.graphData;
    $("#xAxisDiv0").children().each(function(index) {
        graphData[index].left = $(this).position().left;
        var range = [graphData[index].left, graphData[index].left + $(this).width()];
        var center = range[0] + Math.floor((range[1] - range[0]) / 2);
        graphData[index].center = center;
    });
};

/**
 * Create the plots of the selected date range for the graph.
 *
 * The plots will be adjusted to UTC for flot's (graphing API) purposes.
 * 
 * @param {Number} daysBack The days back, today inclusive, for which to set the
 *                  range of date plots that will be graphed.
 * @see http://code.google.com/p/flot/issues/detail?id=141
 */
com.cerner.oncology.fn.populatePlots = function(daysBack) {
    var graphData = com.cerner.oncology.fn.graphData;
    /* define the absolute value for a day length in milliseconds */
    var day = 1000 * 60 * 60 * 24; // in ms
    
    /* 
     * create a GraphDatum for each day, up to and including today. the date is offset
     * for UTC, per flot.  It is important to calculate the rollingDate value for each day 
     * independently because during the DST change events there may be 23 hours or 25 hours
     * between midnight values of consecutive dates.
     * */
    for (var i = 1; i <= daysBack; i++) {
    	/* create a new date for each day within the range */
    	var rollingDate = new Date(new Date() - (day * (daysBack - i)));
    	/* adjust to midnight of this day, to align with flot's x-axis */
    	var midnite = (rollingDate.getMonth() + 1) + "/" + rollingDate.getDate() + "/" + rollingDate.getFullYear();
    	/* get the absolute value for midnight in milliseconds */
    	rollingDate = new Date(midnite).getTime();
    	/* calculate the timezone offset value in milliseconds that was in effect for this particular day, this value varies due to DST */
        var offset = (new Date(rollingDate).getTimezoneOffset()) * 60 * 1000;
        /* set the absolute date value for midnight using UTC*/
        var datum = new com.cerner.oncology.fn.GraphDatum([rollingDate - offset, 0]);
        
        graphData.push(datum);
    }    
    
    $("#graphDiv").attr("style", ""); /* remove previous stylings (may've been shrunk) */
    var ajax = new XMLCclRequest();
    
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4 && ajax.status === 200) {
            var xml = com.cerner.oncology.fn.xmlParser.parseFromString(ajax.responseText, "text/xml");
            var eventSet = $(xml).find("event_set"); // only 1 for temperature
            var graphDates = com.cerner.oncology.fn.sortTemperatureAndLabEventSet(eventSet);
                
            /* 
             * now take each bucket array, get its highest popup value, and 
             * set it upon the graph array. also associate the bucket array with 
             * the x-value coordinate in the data store. this will be retrieved 
             * by the hover listener.
             */
            $.each(graphDates, function(i) {
                var array = $(this);
                var xAxis = array[0].xValue;
                var result = 0;
                
                $.each(array, function(j, value) {
                	//value.result is a string, so needs to be converted to a number for comparison purposes,
                	//otherwise the evaluation treats 99 as greater than 100...
                	((+value.result) > result) && (result = (+value.result));
                });
                
                $.each(graphData, function(i) {
                    var plotUTCTime = graphData[i].getUTCTime();
                    var found = plotUTCTime === xAxis;
                    if (found) {
                        graphData[i].setMeasurement(result);
                        $.data(com.cerner.oncology.fn.dataStore, "temp-" + plotUTCTime, array);
                    }
                    return !found;
                });
            });
            
            /* create the graph with the new graph data ajax data */          
            com.cerner.oncology.fn.createGraph(daysBack);
            
            /* 
             * we had to create the graph even if there were no qualifying
             * results because the graph axis drives the x-axes in other sections.
             * (it is literally copied.) so if no results, we remove the graph,
             * its y-axis (leaving the x-axis) and display the "no results" div.
             */
            if ($(xml).find("event").length === 0) {
                $("#graphDiv").children("canvas").remove();
                var noResults = $("#noResults").clone();
                noResults.attr("id", "noResults0");
                noResults.attr("style", "");
                noResults.removeClass("offsetLeft");
                $("#graphDiv").prepend(noResults).css("height", "40");
                var xChildren = $(".tickLabel").clone().slice(0, daysBack);
                xChildren.css("top", "0");
                var xAxis = $("#graphDiv").find(".tickLabels");
                xAxis.empty();
                xChildren.appendTo(xAxis);
                xAxis.css({
                    height: "12",
                    position: "relative"
                });
            }
            
            /* create other x-axes and stylings based upon flot graph attributes */
            com.cerner.oncology.fn.createXAxes();
            com.cerner.oncology.fn.calculatePlotsPositions();                                
        }
    };
    
    ajax.open("GET", "onc_fn_get_results");
    ajax.send("^MINE^, value($PAT_Personid$), ^TEMP^, " + daysBack);        
};

/**
 * Registers popup listeners for lab data.
 */
com.cerner.oncology.fn.registerLabPopupListener = function () {
    $(".labResult").unbind(); // unbind any previous handlers    
    var clone = null; // the popup clone
    
    /* define hover handlers for jquery. hover creates popup */
    var inHandler = function(event) {
        var array = $.data(com.cerner.oncology.fn.dataStore, $(event.target).attr("id"));
        clone = com.cerner.oncology.fn.createTemperatureAndLabPopup(array);
        com.cerner.oncology.fn.positionPopup(clone, event);
    };
    
    var outHandler = function(event) {
        clone.remove();
    };
    
    $(".labResult").hover(inHandler, outHandler);    
};

/**
 * Stripes (background color) every other lab row.
 */
com.cerner.oncology.fn.stripeLabRows = function() {
    $(".labRow:odd").css( {
        "background-color": "rgb(211,211,211)",
        color: "black"
    });    
};

/**
 * Create the labs section for the selected time range.
 * 
 * Registers popup handlers for each result and stripes rows.
 * 
 * @param {Number} daysBack The days back, today inclusive, for which to search
 *                  for labs.
 * @see com.cerner.oncology.fn.stripeLabRows
 * @see com.cerner.oncology.fn.registerLabPopupListener
 */
com.cerner.oncology.fn.createLabs = function(daysBack) {
    var displayUnit;
    var graphData = com.cerner.oncology.fn.graphData;
    var stripUnit = com.cerner.oncology.fn.stripUnit;
    
    /* these are for dynamic position calculations of lab rows, results, etc */
    var width = stripUnit($("#graphDiv").css("margin-left"));
    var labelWidth = graphData[1].center - graphData[0].center;
    var rowOffset = Math.ceil(labelWidth / 6); 
    var resultOffset = Math.ceil(labelWidth / 4);

    var labDiv = $("#labResults");
    labDiv.empty();  

    /* ajax call for the lab data (invoked at end of this method) */
    var getLabs = function() {
        var ajax = new XMLCclRequest();
        
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4 && ajax.status === 200) {
                var xml = com.cerner.oncology.fn.xmlParser.parseFromString(ajax.responseText, "text/xml");
                var labRowIdx = 0;
                var pIdx = 0;
                var resultIdx = 0;
                var eventSets = $(xml).find("event_set");
                
                /* for each event set.. */
                eventSets.each(function(index, value) {
                    /* 
                     * sort data according to functional reqs, invalid data will
                     * be weeded out from this call.
                     */
                    var popupData = com.cerner.oncology.fn.sortTemperatureAndLabEventSet(value);
                    
                    /* create lab row, set dynamic stylings */
                    var labRow = $(document.createElement("div"));
                    labRow.addClass("labRow");
                    labRow.attr("id", "labRow" + labRowIdx++);
                    labRow.css("width", graphData[graphData.length - 1].center + width);

                    /* lab name */
                    var p = $(document.createElement("p"));
                    p.addClass("leftColumnText leftColumnWidth");
                    p.attr("id", "labName" + pIdx++);
                    p.text($(this).find("event_cd_disp").text().trim());
                    labRow.append(p);
                    
                    /* for each sorted popup datum, create the ONE visible result */
                    $.each(popupData, function(i, v) {
                        /* the first one is the correct result */
                        var popupDatum = v[0];
                        
                        /* create and style the result div */
                        var result = $(document.createElement("div"));
                        result.addClass("labResult");
                        result.css("width", 1.5 * labelWidth);
                        result.textOverflow();
                        result.attr("id", "labResult" + resultIdx++);
                        
                        /* now find the result's graph datum position */
                        $.each(graphData, function(j) {
                            var date = popupDatum.date;
                            var localeTime = graphData[j].getLocaleTime();
                            var found = localeTime > date;
                            
                            /* result was on the day before */
                            if (found) {
                                result.css("left", graphData[j - 1].left + width - resultOffset);
                                if (((j - 1) % 2) === 0) {
                                    result.addClass("labResultEven");
                                } else {
                                    result.addClass("labResultOdd");
                                }
                            }
                            
                            /* result occurred at midnight */
                            if (!found && (found = (localeTime === date))) {
                                result.css("left", graphData[j].left + width - resultOffset);
                                if ((j % 2) === 0) {
                                    result.addClass("labResultEven");
                                } else {
                                    result.addClass("labResultOdd");
                                }                          
                            }
                            
                            /* result occurred sometime on the latest date */
                            if (!found && (j === (graphData.length - 1))) {
                                found = true;
                                result.css("left", graphData[j].left + width - resultOffset);
                                if ((j % 2) === 0) {
                                    result.addClass("labResultEven");
                                } else {
                                    result.addClass("labResultOdd");
                                }                                
                            }
                            
                            /* if found, display the result and possibly the unit */
                            if (found) {
                                var text = popupDatum.result + (displayUnit ? " " + popupDatum.unit : "");
                                result.text(text);
                                $.data(com.cerner.oncology.fn.dataStore, result.attr("id"), v);
                            }
                            
                            return !found;
                        });
                        
                        labRow.append(result);  // append result to lab row                                                        
                    });
                    
                    labDiv.append(labRow); // append row to data div
                });
                
                /* 
                 * register listeners if results were returned, else display the
                 * "no results" message.
                 */
                if ($(xml).find("event").length !== 0) {
                    com.cerner.oncology.fn.registerLabPopupListener();
                } else {
                    var noResults = $("#noResults").clone();
                    noResults.attr("id", "noResults1");
                    noResults.attr("style", "");               
                    labDiv.prepend(noResults);                
                }
                com.cerner.oncology.fn.stripeLabRows(); // stripe rows                             
            }
        };
        
        ajax.open("GET", "onc_fn_get_results");
        ajax.send("^MINE^, value($PAT_Personid$), ^LABS^, " + daysBack);
    };
    
    /* load display indicator from bedrock */
    var getDisplayIndicator = function() {
        var ajax = new XMLCclRequest();
        
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4 && ajax.status === 200) {
                var xml = com.cerner.oncology.fn.xmlParser.parseFromString(ajax.responseText, "text/xml");
                var bedrockInfos = $(xml).find("bedrockInfo");
                bedrockInfos.each(function(index, value) {
                    var found = false;
                    if ($(this).children().eq(0).text().trim() === "RESULT 5:") {
                        displayUnit = ($(this).children().eq(1).text().trim() === "1");
                        found = true;
                    }
                    return !found;
                });
                
                (displayUnit === undefined) && (displayUnit = false);
                //getLabs();                                 
            }
        };
        
        ajax.open("GET", "onc_fn_get_bedrock");
        ajax.send("^MINE^, ^FEB_NEUT_LAB_UNITS_IND^");
    };
    
    /* get lab unit display indicator, then get labs */
    getDisplayIndicator();
    getLabs();
};

/**
 * Registers popup listeners for order data.
 */
com.cerner.oncology.fn.registerOrderPopupListener = function() {
    $(".orderBar").unbind(); // unbind any previous handlers
    var clone = null; // the popup clone
    
    /* define hover handlers for jquery. hover creates popup */
    var inHandler = function(event) {
        /* get the array bound to the order row */
        var array = $.data(com.cerner.oncology.fn.dataStore, $(event.target).parent().attr("id"));
        /* get the bar datum bound to the order bar */
        var barDatum = $.data(com.cerner.oncology.fn.dataStore, $(event.target).attr("id"));
        var popupArray = [barDatum]; // at least add it to the popup array
        
        /* gets midnight of the passed in date */
        var getMidnight = function(date) {
            var d = new Date(date);
            var midnite = (d.getMonth() + 1) + "/" + d.getDate() + "/" +
            d.getFullYear();
            return new Date(midnite).getTime();
        };
        
        /* 
         * get bar datum's start date's midnight and its end date's midnight, which
         * can be 0. if so, create an arbitrary end date for the coming comparison.
         */
        var barStartMidnite = getMidnight(barDatum.startDate);
        var oneYearFromNow = getMidnight(new Date().getTime()) + (1000 * 60 * 60 * 24 * 7 * 52);
        var barStopMidnite = isNaN(barDatum.stopDate) ? oneYearFromNow : getMidnight(barDatum.stopDate);
        
        /* 
         * find overlapping dates. we spin thru the array tied to the order row, 
         * comparing each value to determine if there's overlap w/ the selected
         * bar datum, comparing their midnights. if overlap, they are pushed into
         * the popup array for display.
         */
        $.each(array, function(index, value) {
            if (value !== barDatum) {
                var valueStartMidnite = getMidnight(value.startDate);
                var valueStopMidnite = isNaN(value.stopDate) ? oneYearFromNow : getMidnight(value.stopDate);
                var overlap = (barStartMidnite === valueStartMidnite) ||
                    (barStopMidnite === valueStopMidnite) ||
                    (barStopMidnite === valueStartMidnite) ||
                    (barStartMidnite === valueStopMidnite) ||
                    ((barStartMidnite > valueStartMidnite) && 
                        (barStartMidnite < valueStopMidnite)) ||
                    ((barStopMidnite > valueStartMidnite) && 
                        (barStopMidnite < valueStopMidnite)) ||
                    ((barStartMidnite < valueStartMidnite) && 
                        (barStopMidnite > valueStopMidnite));
                if (overlap) {
                    popupArray.push(value);
                }
            }
        });
        
        /* functionals: sort popup array by start date, descending, else alphabetically */
        popupArray.sort(function(a,b) {
            if (a.startDate > b.startDate) {
                return -1;
            }
            if (a.startDate < b.startDate) {
                return 1;
            }
            if (a.label < b.label) {
                return -1;
            }
            if (a.label > b.label) {
                return 1;
            }
            return 0;
        });
        
        /* create clone popup */              
        clone = $("#orderPopup").clone();
        clone.attr("style", "");
        var cloneId = clone.attr("id") + "0";
        clone.attr("id", cloneId);
        var orderName = popupArray[0].label;
        clone.find("#orderPopupTitle").text(orderName);
        
        /* and now add the sorted popup array data */
        $.each(popupArray, function(index, value) {
            var row = $(document.createElement("tr")).addClass("popupRow");
            var name = $(document.createElement("td")).addClass("popupColumn orderColumn0");
            name.text(value.name);
            var startTimeColumn = $(document.createElement("td")).addClass("popupColumn orderColumn0");
            startTimeColumn.text(value.getStartDateDisplay());
            var stopTimeColumn = $(document.createElement("td")).addClass("popupColumn orderColumn0");
            stopTimeColumn.text(isNaN(value.stopDate) ? "" : value.getStopDateDisplay());
            var clinDispLineColumn = $(document.createElement("td")).addClass("popupColumn orderColumn1");
            clinDispLineColumn.text(value.clinicalDisplayLine);
            var orderStatusColumn = $(document.createElement("td")).addClass("popupColumn orderColumn0");
            orderStatusColumn.text(value.status);
            clone.find("tbody").append(row.append(name).append(startTimeColumn).append(stopTimeColumn).append(clinDispLineColumn).append(orderStatusColumn));            
        });
        
        clone.appendTo("body"); // append to body for absolute positioning
        com.cerner.oncology.fn.positionPopup(clone, event); // position it
    };
    
    var outHandler = function(event) {
        clone.remove();
    };

    $(".orderBar").hover(inHandler, outHandler);    
};

/**
 * Adds color to each order row's order bars.
 */
com.cerner.oncology.fn.applyColorToOrderBars = function() {
    var colorMap = {
        "0": "red",
        "1": "goldenrod",
        "2": "blue",
        "3": "chocolate",
        "4": "green",
        "5": "purple"
    };
    
    $(".orderRow").each(function(index) {
        $(this).children(".orderBar").each(function(i) {
            $(this).css({
                "background-color": colorMap[(index + 6) % 6],
                color: "black"
            });            
        });
    });    
};

/**
 * Creates the orders section for the selected time range.
 * 
 * Registers popup handlers for each result and colors the order bars.
 * 
 * @param {Number} daysBack The days back, today inclusive, for which to query
 *          for order results. 
 * @see com.cerner.oncology.fn.applyColorToOrderBars
 * @see com.cerner.oncology.fn.registerOrderPopupListener
 */
com.cerner.oncology.fn.createOrders = function(daysBack) {
    var graphData = com.cerner.oncology.fn.graphData;
    var stripUnit = com.cerner.oncology.fn.stripUnit;
    var orderDiv = $("#orderResults");
    orderDiv.empty();

    /* gets midnight of the passed in date */
    var getMidnight = function(date) {
        var d = new Date(date);
        var midnite = (d.getMonth() + 1) + "/" + d.getDate() + "/" +
        d.getFullYear();
        return new Date(midnite).getTime();
    };
        
    var ajax = new XMLCclRequest();
    
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4 && ajax.status === 200) {
            var xml = com.cerner.oncology.fn.xmlParser.parseFromString(ajax.responseText, "text/xml");
            var orderRowIdx = 0;
            var pIdx = 0;
            var orderBarIdx = 0;
            var labelWidth = graphData[1].center - graphData[0].center;
            var offset = stripUnit($("#graphDiv").css("margin-left"));
            var oneYearFromNow = new Date().getTime() + (1000 * 60 * 60 * 24 * 7 * 52);
            
            /* create each order row. called near end of this method */
            var createOrderRows = function(category) {
                
                /* create each order bar inside the order row. called later, too */
                var createOrderBars = function(orderType) {
                    /* create the order row and style */
                    var orderRow = $(document.createElement("div"));
                    orderRow.addClass("orderRow");
                    orderRow.attr("id", "orderRow" + orderRowIdx++);
                    orderRow.width(orderDiv.width() - labelWidth);
                    
                    /* order name */
                    var p = $(document.createElement("p"));
                    p.addClass("leftColumnText leftColumnWidth");
                    p.attr("id", "orderName" + pIdx++);
                    p.text($(category).find("primary_mnemonic").text().trim());
                    orderRow.append(p);
                                        
                    var orders = $(orderType).find("order");
                    var orderData = []; // hold the OrderPopupDatums
                    
                    /* for each order in the order type */
                    orders.each(function(index) {
                        /* create bar div */
                        var orderBar = $(document.createElement("div"));
                        orderBar.addClass("orderBar");
                        orderBar.attr("id", "orderBar" + orderBarIdx++);
                        
                        /* create datum from order */
                        var orderDatum = new com.cerner.oncology.fn.OrderPopupDatum();
                        orderDatum.label = p.text();
                        orderDatum.name = $(this).find("clinical_name").text().trim();
                        orderDatum.startDate = Date.parse($(this).find("current_start_date").text().trim());
                        orderDatum.stopDate = Date.parse($(this).find("projected_stop_date").text().trim());
                        orderDatum.estStart = ($(this).find("start_date_estimated_ind").text().trim() === "1");
                        orderDatum.estStop = ($(this).find("stop_date_estimated_ind").text().trim() === "1");
                        orderDatum.clinicalDisplayLine = $(this).find("clinical_display_line").text().trim();
                        orderDatum.status = $(this).find("order_status_disp").text().trim();
                        orderData.push(orderDatum);
                        
                        var orderStopDate = isNaN(orderDatum.stopDate) ? oneYearFromNow : orderDatum.stopDate;
                        
                        /* bounds check */
                        if (graphData[0].getLocaleTime() > orderStopDate) {
                            return true;
                        }
                        
                        var tomorrow = graphData[graphData.length - 1].getLocaleTime() + (1000 * 60 * 60 * 24);
                        
                        /* bounds check */
                        if (orderDatum.startDate >= tomorrow) {
                            return true;
                        }
                        
                        /* bounds check */
                        if (orderDatum.startDate > orderStopDate) {
                            return true;
                        }
                        
                        /* now find its graph datum positioning */
                        $.each(graphData, function(i) {
                            var localeTime = graphData[i].getLocaleTime();
                            
                            /* if the order bar's left position isn't set */
                            if (!orderBar.css("left") || orderBar.css("left") === "0px") {
                                /* if this is the first date on the graph */
                                if (i === 0) {
                                    /* start is before graph, set left to first date */
                                    if (localeTime >= orderDatum.startDate) {
                                        orderBar.css("left", graphData[i].center + offset);
                                    } 
                                    /* start is on the first date of the graph */
                                    else if (getMidnight(localeTime) === getMidnight(orderDatum.startDate)) {
                                        orderBar.css("left", graphData[i].center + offset);
                                    }
                                /* if the order starts on the last date, offset to the left by 1/3 */
                                } else if (i === (graphData.length - 1)) {
                                	orderBar.css("left", graphData[i].center + offset - Math.floor(labelWidth / 3));
                                /* otherwise, standard logic */
                                } else {
                                    if (getMidnight(localeTime) === getMidnight(orderDatum.startDate)) {
                                        orderBar.css("left", graphData[i].center + offset);
                                    }
                                }
                            }
                            
                            var barWidth = orderBar.css("width");
                            /* if the order bar's width isn't set */
                            if (!barWidth || (barWidth === "auto") || !stripUnit(barWidth)) {
                                /* if the order stops on the first date, offset it to the right by 1/3 */
                            	if (i === 0) {
                            		if (getMidnight(localeTime) === getMidnight(orderStopDate)) {
                            			orderBar.css("width", Math.floor(labelWidth / 3));
                            		}
                            	/* if this is the last date on the graph */
                            	} else if (i === (graphData.length - 1)) {
                            		/* if we got here, the order should just stop on the last date hashmark */
                            		orderBar.css("width", (graphData[i].center + offset) - stripUnit(orderBar.css("left")));
                            	/* any date other between first and last */	
                            	} else {
                            		/* if the order stop date is today */
									if (localeTime === getMidnight(orderStopDate)) {
										/* order started and stopped on the same day */
										if (getMidnight(orderDatum.startDate) === getMidnight(orderStopDate)) {
											orderBar.css("width", Math.floor(labelWidth / 3));
										} else {
											orderBar.css("width", graphData[i].center - stripUnit(orderBar.css("left")) + offset);
										} 
									} 
                            	}
                            }
                        });
                                          
                        orderRow.append(orderBar);
                        $.data(com.cerner.oncology.fn.dataStore, orderBar.attr("id"), orderDatum);
                    });
                    
                    if (orderRow.children().length > 1) {
                        orderDiv.append(orderRow);
                        $.data(com.cerner.oncology.fn.dataStore, orderRow.attr("id"), orderData);
                    }
                };
                
                /* create order bars, first for active orders, then inactive */
                var activeOrders = $(category).find("active_orders");
                activeOrders.length > 0 && createOrderBars(activeOrders);
                var inactiveOrders = $(category).find("inactive_orders");
                inactiveOrders.length > 0 && createOrderBars(inactiveOrders);
            };
            
            /* for each category, call the order row function */
            $(xml).find("category").each(function(i,v) {
                createOrderRows(v);
            });
            
            /* 
             * if no orders found, create "no results" msg, else apply colors
             * and register popup listeners.
             */
            if (orderDiv.children().length === 0) {
                var noResults = $("#noResults").clone();
                noResults.attr("id", "noResults2");
                noResults.attr("style", "");             
                orderDiv.prepend(noResults);                 
            } else {
                com.cerner.oncology.fn.applyColorToOrderBars();
                com.cerner.oncology.fn.registerOrderPopupListener();
            }                                
        }
    };
    
    ajax.open("GET", "onc_fn_get_orders");
    ajax.send("^MINE^, value($PAT_Personid$), " + daysBack);        
};

/**
 * The main function.
 *
 * All subsequent functions are initiated from here.
 *
 * @param {Number} daysBack The days back, today inclusive, for which to set the
 *                  data range for all sections of the page.
 */
com.cerner.oncology.fn.getData = function(daysBack) {
	$.cookie("daysBack", daysBack);
    com.cerner.oncology.fn.graphData = [];
    com.cerner.oncology.fn.dataStore = [];
    com.cerner.oncology.fn.resizeDynamicWidths(daysBack);
    
    com.cerner.oncology.fn.getSectionLabels();
    com.cerner.oncology.fn.populatePlots(daysBack);    
    com.cerner.oncology.fn.createLabs(daysBack);    
    com.cerner.oncology.fn.createOrders(daysBack);

    //Check to see whether the client turned on the ability to implement custom code.
    //If they did, the driver script generates a customSectionDiv element in the document
    //and creates a couple of external links to a .js and .css files that are to be defined
    //by the client.  This call is an entry point into the custom code.
	if ($("#customSectionDiv").length > 0){
		try {
			com.cerner.oncology.fn.createCustomSection(daysBack);
		}
		catch(err) {
			var txt = "";
			txt = "The call to custom code API is throwing an error.\n\n";
			txt += "Please, make sure you have created a source file named com.cerner.oncology.fn.client.js ";
			txt += "and a function named com.cerner.oncology.fn.createCustomSection(daysBack) ";
			txt += "for your entry point.\n\n";
			txt += "Click OK to view the error message.";
			alert(txt);
			throw(err);
		}
	}
};

/**
 * Initializes the page after the DOM is fully loaded.
 */
$(document).ready(function() {
    if (navigator.userAgent.indexOf("MSIE") !== -1) {
        $.ie6hover(); // jquery plugin adds hand pointer for IE6 support
    }
    
    /* dynamically add css based upon viewport width */
    var addCss = function () {
        var viewportWidth = getViewportWidth() - 17; // get viewport width
        
        /* create css */
        var css = $(document.createElement("link")).attr({
            rel: "stylesheet",
            type: "text/css"
        });
        
        /* get relative css path */
        var oncFnCss = $("link[href*='onc_fn_css.css']");
        var cssPath = oncFnCss.attr("href").split("onc_fn_css.css");
        
        /* add to css tag, style html */
        if (viewportWidth <= 1000) {
            css.attr("href", cssPath[0] + "onc_fn_small.css");
            $("html").css("font-size", "8pt");
        } else if (viewportWidth < 1300) {
            css.attr("href", cssPath[0] + "onc_fn_medium.css");
            $("html").css("font-size", "9pt");
        } else {
            css.attr("href", cssPath[0] + "onc_fn_large.css");
            $("html").css("font-size", "9pt");
        }
        
        /* more html styling. add new css to last css in list */
        $("html").css("font-family", "Tahoma, Geneva, sans-serif");
        $("head").children("link:last").after(css);        
    };
    
    addCss(); // create dynamic css
    
    /* map of daysBack */
    var daysBack = {
        "0": 14,
        "1": 28,
        "2": 56
    };
    
    var getData = com.cerner.oncology.fn.getData;
    
    /* style the links according to which is selected and those that are not */
    var styleLinks = function(selected) {
        $(".rangeLabel").attr("style", "");        
        $(selected).css( {
            "background-color": "white",
            color: "black",
            cursor: "default",
            "text-decoration": "none"
        });        
    };
    
    /* 
     * register each date range label (e.g. "2 weeks") to call getData() on
     * click.
     */
    $(".rangeLabel").click(function(event) {
        styleLinks($(this));        
        getData(daysBack[$(this).index()]);
    });
    
    var cookie = parseInt($.cookie("daysBack"), 10); // grab daysBack cookie
    
    /* if exists, style date range links accordingly */
    if (cookie) {
        switch (cookie) {
        case 28:
            styleLinks($("#dateRangeLabel1"));
            break;
        case 56:
            styleLinks($("#dateRangeLabel2"));
            break;
        default:
            styleLinks($("#dateRangeLabel0"));
            break;    
        }
    } else { // otherwise default is "2 weeks"
        styleLinks($("#dateRangeLabel0"));
    }
    
    getData(cookie || daysBack[0]); // call getData() with "2 weeks" as default
    
});
