$(function(){

    $('.innerTable').each(function(){
        var numRows = $(this).find('tr').length;
        if (numRows >= 12) {
            $(this).parent().css('height', '16em');
        }
        else {
            $(this).parent().css('height', 'auto');
        }
    });
    
    for (var i = 1; i <= graphCount; i++) {
    
        $('#flotTable' + i + ' .dateHead').each(function(){
            var valDate = $(this).text();
            var tempDate = new Date();
            tempDate.setISO8601(valDate);
            $(this).text(tempDate.getTime());
        });
        
        $('#flotTable' + i).each(function(){
        
            var tableMin = parseFloat($(this).find('td:first').text());
            var tableMax = 0;
            
            $(this).find('td').each(function(){
                var tempFloat = parseFloat($(this).text())
                
                if (isNaN(tableMin)) {
                    tableMin = tempFloat;
                }
                if (tempFloat < tableMin && !isNaN(tempFloat)) {
                    tableMin = tempFloat;
                }
                
                if (tempFloat > tableMax && !isNaN(tempFloat)) {
                    tableMax = tempFloat;
                }
            });
            
            tableMin = tableMin - 5;
            tableMax = tableMax + 5;
            if ($(this).hasClass('bpTable')) {
                $(this).graphTable({
                    graphNum: i,
                    series: 'columns',
                    width: '50em',
                    height: '200px',
                    min: tableMin,
                    max: tableMax,
                    legendLabels: ['SYS', 'DIA']
                }, {
                    series: {
                        lines: {
                            show: true
                        },
                        points: {
                            show: true
                        }
                    },
                    grid: {
                        hoverable: true,
                        backgroundColor: {
                            colors: ["##DBE9CF", "#fff"]
                        }
                    },
                    xaxis: {
                        mode: "time",
                        tickFormatter: function(val, axis){
                            var d = new Date();
                            d.setTime(val);

                            switch (axis.tickSize[1]) {
                                case "second":
                                case "minute":
                                    return d.format("isoTime"); 
                                case "hour":
                                    return d.format("longDateTime2"); 
                                case "day":
                                    if (axis.tickSize[0] > 1) 
                                        return d.format("shortDate3");
                                    return d.format("isoTime");
                                case "month":
                                case "year":
                                    return d.format("shortDate3");
                                default:
                                    return d.format("shortDate3");
                            }
                        }
                    },
                    legend: {
                        show: true,
                        noColumns: 2
                    },
                    selection: {
                        mode: "x"
                    }
                });
            }
            else {
                $(this).graphTable({
                    graphNum: i,
                    series: 'columns',
                    width: '50em',
                    height: '200px',
                    min: tableMin,
                    max: tableMax
                }, {
                    series: {
                        lines: {
                            show: true
                        },
                        points: {
                            show: true
                        }
                    },
                    grid: {
                        hoverable: true,
                        backgroundColor: {
                            colors: ["##DBE9CF", "#fff"]
                        }
                    },
                    xaxis: {
                        mode: "time",
                        tickFormatter: function(val, axis){
                            var d = new Date();
                            d.setTime(val);
                            
                            switch (axis.tickSize[1]) {
                                case "second":
                                case "minute":
                                    return d.format("isoTime"); 
                                case "hour":
                                    return d.format("longDateTime2"); 
                                case "day":
                                    if (axis.tickSize[0] > 1) 
                                        return d.format("shortDate3");
                                    return d.format("isoTime");
                                case "month":
                                case "year":
                                    return d.format("shortDate3");
                                default:
                                    return d.format("shortDate3");
                            }
                        }
                    },
                    legend: {
                        show: false
                    },
                    selection: {
                        mode: "x"
                    }
                });
            }
            
        });
        
        $('#flotTable' + i + ' th.dateHead').each(function(){
            var valDate = GetHeadsUpDateDisplay(parseFloat($(this).text()))
            $(this).text(valDate);
        });
        
        function showTooltip(x, y, contents){
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 10,
                left: x + 10,
                border: '1px solid #000',
                padding: '2px',
                'background-color': '#FFF',
                opacity: 100,
                textAlign: 'left'
            }).appendTo("body").fadeIn(200);
        }
        
        function CalculateNormalcy(normalcyMeaning){
            var normalcy = "";
            
            if (normalcyMeaning != null) {
                if (normalcyMeaning == "LOW" || normalcyMeaning == "EXTREMELOW") {
                    normalcy = "res-low";
                }
                else if (normalcyMeaning == "HIGH" || normalcyMeaning == "EXTREMEHIGH") {
                    normalcy = "res-high";
                }
                else if (normalcyMeaning == "CRITICAL" || normalcyMeaning == "PANICHIGH" || normalcyMeaning == "PANICLOW") {
                    normalcy = "res-severe";
                }
            }
            return normalcy;
        }
        
        function GetHeadsUpDateDisplay(flotDate){
            var tempDate = new Date();
            tempDate.setTime(flotDate);
            return tempDate.format("longDateTime2");
        }
        function GetHoverDateDisplay(flotDate){
            var tempDate = new Date();
            tempDate.setTime(flotDate);
            return tempDate.format("longDateTime3");
        }
        
        var previousPoint = null;
        $(".flot-graph").bind("plothover", function(event, pos, item){
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));
            
            if (item) {
                if (previousPoint != item.datapoint) {
                    var graphDetails = null;
                    var isBP = false;
                    var mappedData = mappedResults.MAPPED_DATA;
                    //locate the corresponding datapoint in the json record for displaying the details
                    for (var zl = mappedData.QUAL.length; zl--;) {
                        var graphResults = mappedData.QUAL[zl];
                        if (graphResults.ID == event.currentTarget.id) {
                            if (graphResults.CE.length) {
                                graphDetails = graphResults.CE[item.dataIndex];
                            }
                            else {
                                graphDetails = graphResults.BP[item.dataIndex];
                                isBP = true;
                            }
                        }
                    }
                    previousPoint = item.datapoint;
                    
                    $("#tooltip").remove();
                    var x = item.datapoint[0], y = item.datapoint[1];
                    
                    var dateTime = GetHoverDateDisplay(x);
                    var refRange = "";
                    var maxTemp = "";
                    var ar = [];
                    var arRefRange = [];
                    var arMaxTemp = [];
                    var displayEvent = "";
                    if (!isBP) {
                        var normalcy = CalculateNormalcy(graphDetails.NORMALCY);
                        
                        displayEvent = graphDetails.EVENT;
                        
                        if (graphDetails.NORM_LOW != "&nbsp" || graphDetails.NORM_HIGH != "&nbsp" || graphDetails.CRIT_LOW != "&nbsp" || graphDetails.CRIT_HIGH != "&nbsp") {
                            arRefRange.push("<dt><span>Normal Low:</span></dt><dd><span>", graphDetails.NORM_LOW, "</span></dd>");
                            arRefRange.push("<dt><span>Normal High:</span></dt><dd><span>", graphDetails.NORM_HIGH, "</span></dd>");
                            arRefRange.push("<dt><span>Critical Low:</span></dt><dd><span>", graphDetails.CRIT_LOW, "</span></dd>");
                            arRefRange.push("<dt><span>Critical High:</span></dt><dd><span>", graphDetails.CRIT_HIGH, "</span></dd>");
                        }

                        if (mappedData.MAX48HTEMP != "" && mappedData.MAX48HTEMP != null) {
                            var max48HNormalcy = CalculateNormalcy(mappedData.MAX48HNORMALCY);
                            valDate = mappedData.MAX48HTEMPDT;
                            var tempDate = new Date();
                            tempDate.setISO8601(valDate);
                            arMaxTemp.push("<dt><span>48 Hour Max:</span></dt><dd><span class='", max48HNormalcy, "'>", mappedData.MAX48HTEMP, "</span><span>&nbsp", tempDate.format("longDateTime3"), "</span></dd>");
                            maxTemp = arMaxTemp.join("");
                        }
                        
                    }
                    else { //BP
                        if (item.seriesIndex == 0) {//Systolic
                            displayEvent = graphDetails.SYS_BP_LABEL;
                            var normalcy = CalculateNormalcy(graphDetails.SYS_NORMALCY);
                            var norm_low = graphDetails.SYS_NORM_LOW;
                            var norm_high = graphDetails.SYS_NORM_HIGH;
                            var crit_low = graphDetails.SYS_CRIT_LOW;
                            var crit_high = graphDetails.SYS_CRIT_HIGH;
                        }
                        else {
                            displayEvent = graphDetails.DIA_BP_LABEL;
                            var normalcy = CalculateNormalcy(graphDetails.DIA_NORMALCY);
                            var norm_low = graphDetails.DIA_NORM_LOW;
                            var norm_high = graphDetails.DIA_NORM_HIGH;
                            var crit_low = graphDetails.DIA_CRIT_LOW;
                            var crit_high = graphDetails.DIA_CRIT_HIGH;
                        }
                        arRefRange.push("<dt><span>Normal Low:</span></dt><dd><span>", norm_low, "</span></dd>");
                        arRefRange.push("<dt><span>Normal High:</span></dt><dd><span>", norm_high, "</span></dd>");
                        arRefRange.push("<dt><span>Critical Low:</span></dt><dd><span>", crit_low, "</span></dd>");
                        arRefRange.push("<dt><span>Critical High:</span></dt><dd><span>", crit_high, "</span></dd>");
                    }
                    ar.push("<div class='hvr'><dl><dt><span>", displayEvent, ":</span></dt><dd><span class='", normalcy, "'>", y, " " + graphDetails.UNITS, "</span></dd><br/><dt><span>Result Date/Time:</span></dt><dd><span>", dateTime, "</span></dd>");
                    var hoverContent = ar.join("") + arRefRange.join("") + arMaxTemp.join("") + "</dl></div>";
                    showTooltip(item.pageX, item.pageY, hoverContent);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }
    var tWdth = window.innerWidth || document.documentElement.clientWidth;
    $('body, hr').width(tWdth);
});
