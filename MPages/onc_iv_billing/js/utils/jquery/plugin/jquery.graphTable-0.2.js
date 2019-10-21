
/******************************************************************************
*
* jquery.graphTable-0.2.js
* by rebecca murphey
* http://blog.rebeccamurphey.com
* rmurphey gmail com
* License: GPL
* 17 December 2007
*
* requires:
*
*   - jquery.js (http://jquery.com) -- tested with 1.2.1
*   - jquery.flot.js (http://code.google.com/p/flot/)
*
* usage:
*
*   $('#myTable').graphTable(graphTableOptionsObject,flotOptionsObject);
*
*   - both arguments are optional; defaults will work in most cases
*     but you'll need to include {series: 'columns'} if your data is
*     in columns.
*   - for details on graphTable options and defaults, see below.
*   - for details on flot options and defaults, see
*     http://code.google.com/p/flot/
*
* notes:
*
*   - this isn't going to work well with tables that use rowspan or colspan
*   - make sure to use the transform args to transform your cell contents into
*     something flot can understand -- especially important if your cells
*     contain currency or dates
*
******************************************************************************/

(function ($)
{

    $.fn.graphTable = function (graphArgs_, flotArgs_)
    {

        var args = {

            /*
            * options for reading the table -- defaults will work in most cases except
            * you'll want to override the default args.series if your series are in columns
            *
            * note that anywhere the word "index" is used, the count starts from 0 at
            * the top left of the table
            *
            */
            graphNum: 0, //The identifier of the graph which should be populated
            // overviewFrom: 0,
            // overviewTo: 0,
            series: 'rows', // are the series in rows or columns?
            labels: 0, // index of the cell in the series row/column that contains the label for the series
            xaxis: 0, // index of the row/column (whatever args.series is) that contains the x values
            firstSeries: 1, // index of the row/column containing the first series
            lastSeries: null, // index of the row/column containing the last series; will use the last cell in the row/col if not set
            dataStart: 0, // index of the first cell in the series containing data
            dataEnd: null, // index of the last cell in the series containing data; will use the last cell in the row/col if not set
            legendLabels: null, //Label for the each series to be used in the legend

            /* graph size and position */
            position: 'after', // before the table, after the table, or replace the table
            width: null, // set to null to use the width of the table
            height: null, // set to null to use the height of the table
            min: 0, // defaults to minimum y value in the table
            max: 0, // defaults to maximum y value in the table

            /* data transformation before plotting */
            dataTransform: null, // function to run on cell contents before passing to flot; string -> string
            labelTransform: null, // function to run on cell contents before passing to flot; string -> string
            xaxisTransform: null // function to run on cell contents before passing to flot; string -> string

        }


        // override defaults with user args
        $.extend(true, args, graphArgs_);

        /* default to last cell in the row/col for
        * lastSeries and dataEnd if they haven't been set yet */

        // index of the row/column containing the last series
        if (!args.lastSeries)
        {
            args.lastSeries = (args.series == 'columns') ?
				$('tr', $(this)).eq(args.labels).find('th,td').length - 1 :
				$('tr', $(this)).length - 1;
        }

        // index of the last cell in the series containing data
        if (!args.dataEnd)
        {
            args.dataEnd = (args.series == 'rows') ?
				$('tr', $(this)).eq(args.firstSeries).find('th,td').length - 1 :
				$('tr', $(this)).length - 1;
        }

        return $(this).each(function ()
        {
            // use local min/max for y of each graph, based on initial args
            var $table = $(this);

            // make sure the table is a table!
            if (!$table.is('table')) { return; }

            // if no height and width have been set, then set
            // width and height based on the width and height of the table
            if (!args.width) { args.width = $table.width(); }
            if (!args.height) { args.height = $table.height(); }

            var min = args.min;
            var max = args.max;
            var $rows = $('tr', $table);
            var tableData = new Array();

            switch (args.series)
            {
                case 'rows':

                    var $xaxisRow = $rows.eq(args.xaxis);

                    // iterate over each of the rows in the series
                    for (i = args.firstSeries; i <= args.lastSeries; i++)
                    {
                        var rowData = new Array();

                        $dataRow = $('tr', $table).eq(i);

                        // get the label for the whole row
                        var label = graphUnits[args.graphNum - 1];

                        if (args.labelTransform) { label = args.labelTransform(label); }

                        for (j = args.dataStart; j <= args.dataEnd; j++)
                        {
                            var x = $('th,td', $xaxisRow).eq(j).text();
                            var y = $('th,td', $dataRow).eq(j).text();

                            if (args.dataTransform) { y = args.dataTransform(y); }
                            if (args.xaxisTransform) { x = args.xaxisTransform(x); }

                            test_x = parseFloat(x);
                            test_y = parseFloat(y);

                            if (test_y < min) { min = test_y; }
                            else if (test_y > max) { max = test_y; }

                            rowData[rowData.length] = [x, y];
                        }

                        tableData[tableData.length] = { label: label, data: rowData };
                    }
                    break;
                case 'columns':
                    // iterate over each of the columns in the series					
                    for (j = args.firstSeries; j <= args.lastSeries; j++)
                    { // j designates the column
                        var colData = new Array();

                        var label = "";

                        if (args.legendLabels != null)
                        {
                            label = args.legendLabels[j - 1];
                        }
                        else
                        {
                            // get the label for the whole row
                            label = graphUnits[args.graphNum - 1];
                        }

                        if (args.labelTransform) { label = args.labelTransform(label); }

                        for (i = args.dataStart; i <= args.dataEnd; i++)
                        { // i designates the row

                            $cell = $rows.eq(i).find('th,td').eq(j);
                            var y = $cell.text();
                            var x = $rows.eq(i).find('th,td').eq(args.xaxis).text();

                            if (args.dataTransform) { y = args.dataTransform(y); }
                            if (args.xaxisTransform) { x = args.xaxisTransform(x); }

                            test_x = parseFloat(x);
                            test_y = parseFloat(y);

                            if (test_y < min) { min = test_y - 2; }
                            else if (test_y > max) { max = test_y + 2; }

                            if (i == args.dataStart)
                            {
                                overviewFrom = test_x;
                            }
                            else if (i == args.dataEnd)
                            {
                                overviewTo = test_x;
                            }

                            colData[colData.length] = [x, y];
                        }
                        tableData[tableData.length] = { label: label, data: colData };
                    }
                    break;
            }

            var flotArgs = { yaxis: { min: min, max: max} };
            var placeholder = $("#placeHolder" + args.graphNum)
            placeholder.width(args.width).height(args.height);
            $.extend(true, flotArgs, flotArgs_);
            var plot = $.plot(placeholder, tableData, flotArgs);


            // setup overview
            var overview = $("#overviewGraph" + args.graphNum)
            overview.width(150).height(50);

            var overviewPlot = $.plot(overview, tableData, {
                legend: { show: false },
                series: {
                    lines: { show: true, lineWidth: 1 },
                    shadowSize: 0
                },
                xaxis: { ticks: 0 },
                yaxis: { ticks: 0, min: args.min, max: args.max },
                grid: { color: "#999", backgroundColor: { colors: ["##DBE9CF", "#fff"]} },
                selection: { mode: "x" }
            });
            /*Zoom into data*/
            placeholder.bind("plotselected", function (event, ranges)
            {
                // clamp the zooming to prevent eternal zoom
                if (ranges.xaxis.to - ranges.xaxis.from < 0.00001)
                    ranges.xaxis.to = ranges.xaxis.from + 0.00001;
                if (ranges.yaxis.to - ranges.yaxis.from < 0.00001)
                    ranges.yaxis.to = ranges.yaxis.from + 0.00001;

                plot = $.plot(placeholder, tableData, $.extend(true, {}, flotArgs, { xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }, series: { show: true, lineWidth: 1} }));

                // don't fire event on the overview to prevent eternal loop
                overviewPlot.setSelection(ranges, true);
            });

            overview.bind("plotselected", function (event, ranges)
            {
                plot.setSelection(ranges);
            });
        });
    };
})(jQuery); 