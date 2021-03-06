/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.0b2_r1012
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can
 * choose the license that best suits your project and use it accordingly.
 *
 * Although not required, the author would appreciate an email letting him
 * know of any substantial use of jqPlot.  You can reach the author at:
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 *
 */
(function($) {
	/**
	 * Class: $.jqplot.DateAxisRenderer
	 * A plugin for a jqPlot to render an axis as a series of date values.
	 * This renderer has no options beyond those supplied by the <Axis> class.
	 * It supplies it's own tick formatter, so the tickOptions.formatter option
	 * should not be overridden.
	 *
	 * Thanks to Ken Synder for his enhanced Date instance methods which are
	 * included with this code <http://kendsnyder.com/sandbox/date/>.
	 *
	 * To use this renderer, include the plugin in your source
	 * > <script type="text/javascript" language="javascript" src="plugins/jqplot.dateAxisRenderer.js"></script>
	 *
	 * and supply the appropriate options to your plot
	 *
	 * > {axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}}}
	 *
	 * Dates can be passed into the axis in almost any recognizable value and
	 * will be parsed.  They will be rendered on the axis in the format
	 * specified by tickOptions.formatString.  e.g. tickOptions.formatString = '%Y-%m-%d'.
	 *
	 * Accecptable format codes
	 * are:
	 *
	 * > Code    Result                  Description
	 * >             == Years ==
	 * > %Y      2008                Four-digit year
	 * > %y      08                  Two-digit year
	 * >             == Months ==
	 * > %m      09                  Two-digit month
	 * > %#m     9                   One or two-digit month
	 * > %B      September           Full month name
	 * > %b      Sep                 Abbreviated month name
	 * >             == Days ==
	 * > %d      05                  Two-digit day of month
	 * > %#d     5                   One or two-digit day of month
	 * > %e      5                   One or two-digit day of month
	 * > %A      Sunday              Full name of the day of the week
	 * > %a      Sun                 Abbreviated name of the day of the week
	 * > %w      0                   Number of the day of the week (0 = Sunday, 6 = Saturday)
	 * > %o      th                  The ordinal suffix string following the day of the month
	 * >             == Hours ==
	 * > %H      23                  Hours in 24-hour format (two digits)
	 * > %#H     3                   Hours in 24-hour integer format (one or two digits)
	 * > %I      11                  Hours in 12-hour format (two digits)
	 * > %#I     3                   Hours in 12-hour integer format (one or two digits)
	 * > %p      PM                  AM or PM
	 * >             == Minutes ==
	 * > %M      09                  Minutes (two digits)
	 * > %#M     9                   Minutes (one or two digits)
	 * >             == Seconds ==
	 * > %S      02                  Seconds (two digits)
	 * > %#S     2                   Seconds (one or two digits)
	 * > %s      1206567625723       Unix timestamp (Seconds past 1970-01-01 00:00:00)
	 * >             == Milliseconds ==
	 * > %N      008                 Milliseconds (three digits)
	 * > %#N     8                   Milliseconds (one to three digits)
	 * >             == Timezone ==
	 * > %O      360                 difference in minutes between local time and GMT
	 * > %Z      Mountain Standard Time  Name of timezone as reported by browser
	 * > %G      -06:00              Hours and minutes between GMT
	 * >             == Shortcuts ==
	 * > %F      2008-03-26          %Y-%m-%d
	 * > %T      05:06:30            %H:%M:%S
	 * > %X      05:06:30            %H:%M:%S
	 * > %x      03/26/08            %m/%d/%y
	 * > %D      03/26/08            %m/%d/%y
	 * > %#c     Wed Mar 26 15:31:00 2008  %a %b %e %H:%M:%S %Y
	 * > %v      3-Sep-2008          %e-%b-%Y
	 * > %R      15:31               %H:%M
	 * > %r      3:31:00 PM          %I:%M:%S %p
	 * >             == Characters ==
	 * > %n      \n                  Newline
	 * > %t      \t                  Tab
	 * > %%      %                   Percent Symbol
	 */
	$.jqplot.DateAxisRenderer = function() {
		$.jqplot.LinearAxisRenderer.call(this);
		this.date = new $.jsDate();
	};

	var second = 1000;
	var minute = 60 * second;
	var hour = 60 * minute;
	var day = 24 * hour;
	var week = 7 * day;

	// these are less definitive
	var month = 30.4368499 * day;
	var year = 365.242199 * day;

	var daysInMonths = [31, 28, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30];
	// array of consistent nice intervals.  Longer intervals
	// will depend on days in month, days in year, etc.
	var niceFormatStrings = ['%M:%S.%#N', '%M:%S.%#N', '%M:%S.%#N', '%M:%S', '%M:%S', '%M:%S', '%M:%S', '%H:%M:%S', '%H:%M:%S', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%H:%M', '%a %H:%M', '%a %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%b %e %H:%M', '%v', '%v', '%v', '%v', '%v', '%v', '%v'];
	var niceIntervals = [0.1 * second, 0.2 * second, 0.5 * second, second, 2 * second, 5 * second, 10 * second, 15 * second, 30 * second, minute, 2 * minute, 5 * minute, 10 * minute, 15 * minute, 30 * minute, hour, 2 * hour, 4 * hour, 6 * hour, 8 * hour, 12 * hour, day, 2 * day, 3 * day, 4 * day, 5 * day, week, 2 * week];

	var niceMonthlyIntervals = [];

	function bestDateInterval(min, max, titarget) {
		// iterate through niceIntervals to find one closest to titarget
		var badness = Number.MAX_VALUE;
		var temp, bestTi, bestfmt;
		for(var i = 0, l = niceIntervals.length; i < l; i++) {
			temp = Math.abs( titarget - niceIntervals[i]);
			if(temp < badness) {
				badness = temp;
				bestTi = niceIntervals[i];
				bestfmt = niceFormatStrings[i];
			}
		}

		return [bestTi, bestfmt];
	}

	$.jqplot.DateAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
	$.jqplot.DateAxisRenderer.prototype.constructor = $.jqplot.DateAxisRenderer;

	$.jqplot.DateTickFormatter = function(format, val) {
		if(!format) {
			format = '%Y/%m/%d';
		}
		return $.jsDate.strftime(val, format);
	};

	$.jqplot.DateTickFormatterSpecialPhys = function(format, val) {
		var iDate = $.jsDate.createDate(Math.abs(val));
		var df = MP_Util.GetDateFormatter();
		var iDate2 = df.format(iDate,mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
		var iDate4 = df.format(iDate,mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
		var curDtTm = new Date;
		curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);
		//if midnight, show date over time
		if (iDate.getMilliseconds()==0 && iDate.getSeconds()==0 && iDate.getMinutes() == 0 && iDate.getHours() == 0) {
			var nFormat = "<span>"+iDate2+"</span><br/><span>&nbsp;</span>%H:%M";
		}
		else {
			var nFormat = "<span>%H:%M</span>";
		}
		return $.jsDate.strftime(val, nFormat);
	};
	
	$.jqplot.DateTickFormatterSpecial = function(format, val) {
		var curDtTm = new Date();
		curDtTm.setMilliseconds(0);
		curDtTm.setSeconds(0);
		var nFormat = "<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span><span class='jqplot-elem-hideOnHover nowTime'>%H:%M</span>";
		return $.jsDate.strftime(val, nFormat);
	};

	$.jqplot.DateTickFormatterXSpecial = function(format, val) {
		var iDate = $.jsDate.createDate(Math.abs(val));
		var curDtTm = new Date();
		curDtTm.setMilliseconds(0);
		curDtTm.setSeconds(0);
		var nFormat = format;
		if(DAR_HELPERS.createdNow && iDate.getTime() == curDtTm.getTime()) {
			nFormat = "<span class='jqplot-elem-hideOnHover'>&nbsp;</span><span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span>";
		}
		//if midnight, show time over date
		else if(siDate.getMilliseconds() == 0 && iDate.getSeconds() == 0 && iDate.getMinutes() == 0 && iDate.getHours() == 0) {
			nFormat = "<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;</span>%H:%M<br class='jqplot-elem-hideOnHover'/><span class='jqplot-elem-hideOnHover'>%#m/%#d/%y</span>";
		}
		//show just time
		else {
			nFormat = "<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;</span>%H:%M";
		}
		return $.jsDate.strftime(val, nFormat);
	};

	$.jqplot.DateTickFormatterX2Special = function(format, val) {
		var iDate = $.jsDate.createDate(Math.abs(val));
		var df = MP_Util.GetDateFormatter();
		var iDate2 = df.format(iDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR);
		var iDate4 = df.format(iDate, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
		var curDtTm = new Date();
		curDtTm.setMilliseconds(0);
		curDtTm.setSeconds(0);
		var nFormat = format;
		if(DAR_HELPERS.createdNow && iDate.getTime() == curDtTm.getTime()) {
			nFormat = "<span class='jqplot-elem-hideOnHover'>&nbsp;</span><span class='jqplot-elem-showOnHover'>" + iDate4 + "&nbsp;%H:%M</span>";
		}
		//if midnight, show time over date
		else if(iDate.getMilliseconds() == 0 && iDate.getSeconds() == 0 && iDate.getMinutes() == 0 && iDate.getHours() == 0) {
			nFormat = "<span class='jqplot-elem-showOnHover'>" + iDate4 + "</span><span class='jqplot-elem-hideOnHover'>" + iDate2 + "</span><br class='jqplot-elem-hideOnHover'/><span class='jqplot-elem-showOnHover'>&nbsp;</span>%H:%M";
		}
		//show just time
		else {
			nFormat = "<span class='jqplot-elem-showOnHover'>" + iDate4 + "</span>&nbsp;<br class='jqplot-elem-hideOnHover'/>%H:%M";
		}
		return $.jsDate.strftime(val, nFormat);
	};

	$.jqplot.DateTickFormatterYSpecial = function(format, val) {
		var iDate = $.jsDate.createDate(Math.abs(val));
		var curDtTm = new Date();
		curDtTm.setMilliseconds(0);
		curDtTm.setSeconds(0);
		var nFormat = format;
		if(DAR_HELPERS.createdNow && iDate.getTime() == curDtTm.getTime()) {
			nFormat = "<span class='jqplot-elem-hideOnHover'>&nbsp;</span><span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span>";
		}
		//if midnight, show time over date
		else if(iDate.getMilliseconds() == 0 && iDate.getSeconds() == 0 && iDate.getMinutes() == 0 && iDate.getHours() == 0) {
			nFormat = "%#m/%#d/<span class='jqplot-elem-showOnHover'>%Y</span><span class='jqplot-elem-hideOnHover'>%y</span><br class='jqplot-elem-hideOnHover'/><span class='jqplot-elem-showOnHover'>&nbsp;</span>%H:%M";
		}
		//show just time
		else {
			nFormat = "<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;</span>%H:%M";
		}
		return $.jsDate.strftime(val, nFormat);
	};

	$.jqplot.DateAxisRenderer.prototype.init = function(options) {
		// prop: tickRenderer
		// A class of a rendering engine for creating the ticks labels displayed on the plot,
		// See <$.jqplot.AxisTickRenderer>.
		// this.tickRenderer = $.jqplot.AxisTickRenderer;
		// this.labelRenderer = $.jqplot.AxisLabelRenderer;
		this.tickOptions.formatter = $.jqplot.DateTickFormatter;
		// prop: tickInset
		// Controls the amount to inset the first and last ticks from
		// the edges of the grid, in multiples of the tick interval.
		// 0 is no inset, 0.5 is one half a tick interval, 1 is a full
		// tick interval, etc.
		this.tickInset = 0;
		// prop: drawBaseline
		// True to draw the axis baseline.
		this.drawBaseline = true;
		// prop: baselineWidth
		// width of the baseline in pixels.
		this.baselineWidth = null;
		// prop: baselineColor
		// CSS color spec for the baseline.
		this.baselineColor = null;
		this.daTickInterval = null;
		this._daTickInterval = null;
		$.extend(true, this, options);

		if (this.specialFormat && this.specialFormatFlag!=null && this.specialFormatFlag == 3) //For Physiology View
		{
			this.tickOptions.formatter = $.jqplot.DateTickFormatterSpecialPhys;
		}
		else if(this.specialFormat && this.specialFormatFlag != null && this.specialFormatFlag == 1) {
			this.tickOptions.formatter = $.jqplot.DateTickFormatterSpecial;
		}
		else if(this.specialFormat && this.name.match("xaxis") != null) {
			this.tickOptions.formatter = $.jqplot.DateTickFormatterXSpecial;
		}
		else if(this.specialFormat && this.name.match(/^x/) != null) {
			this.tickOptions.formatter = $.jqplot.DateTickFormatterX2Special;
		}
		else if(this.specialFormat && this.name.match(/^y/) != null) {
			this.tickOptions.formatter = $.jqplot.DateTickFormatterYSpecial;
		}
		else {
			this.tickOptions.formatter = $.jqplot.DateTickFormatter;
		}

		var db = this._dataBounds, stats, sum, s, d, pd, sd, intv;

		// Go through all the series attached to this axis and find
		// the min/max bounds for this axis.
		for(var i = 0; i < this._series.length; i++) {
			stats = {
				intervals: [],
				frequencies: {},
				sortedIntervals: [],
				min: null,
				max: null,
				mean: null
			};
			sum = 0;
			s = this._series[i];
			d = s.data;
			pd = s._plotData;
			sd = s._stackData;
			intv = 0;

			for(var j = 0; j < d.length; j++) {
				if(this.name == 'xaxis' || this.name == 'x2axis') {
					d[j][0] = new $.jsDate(d[j][0]).getTime();
					pd[j][0] = new $.jsDate(d[j][0]).getTime();
					sd[j][0] = new $.jsDate(d[j][0]).getTime();
					if((d[j][0] != null && d[j][0] < db.min) || db.min == null) {
						db.min = d[j][0];
					}
					if((d[j][0] != null && d[j][0] > db.max) || db.max == null) {
						db.max = d[j][0];
					}
					if(j > 0) {
						intv = Math.abs(d[j][0] - d[j-1][0]);
						stats.intervals.push(intv);
						if(stats.frequencies.hasOwnProperty(intv)) {
							stats.frequencies[intv] += 1;
						}
						else {
							stats.frequencies[intv] = 1;
						}
					}
					sum += intv;

				}
				else {
					d[j][1] = new $.jsDate(d[j][1]).getTime();
					pd[j][1] = new $.jsDate(d[j][1]).getTime();
					sd[j][1] = new $.jsDate(d[j][1]).getTime();
					if((d[j][1] != null && d[j][1] < db.min) || db.min == null) {
						db.min = d[j][1];
					}
					if((d[j][1] != null && d[j][1] > db.max) || db.max == null) {
						db.max = d[j][1];
					}
					if(j > 0) {
						intv = Math.abs(d[j][1] - d[j-1][1]);
						stats.intervals.push(intv);
						if(stats.frequencies.hasOwnProperty(intv)) {
							stats.frequencies[intv] += 1;
						}
						else {
							stats.frequencies[intv] = 1;
						}
					}
				}
				sum += intv;
			}

			if(s.renderer.bands) {
				if(s.renderer.bands.hiData.length) {
					var bd = s.renderer.bands.hiData;
					for(var j = 0, l = bd.length; j < l; j++) {
						if(this.name === 'xaxis' || this.name === 'x2axis') {
							bd[j][0] = new $.jsDate(bd[j][0]).getTime();
							if((bd[j][0] != null && bd[j][0] > db.max) || db.max == null) {
								db.max = bd[j][0];
							}
						}
						else {
							bd[j][1] = new $.jsDate(bd[j][1]).getTime();
							if((bd[j][1] != null && bd[j][1] > db.max) || db.max == null) {
								db.max = bd[j][1];
							}
						}
					}
				}
				if(s.renderer.bands.lowData.length) {
					var bd = s.renderer.bands.lowData;
					for(var j = 0, l = bd.length; j < l; j++) {
						if(this.name === 'xaxis' || this.name === 'x2axis') {
							bd[j][0] = new $.jsDate(bd[j][0]).getTime();
							if((bd[j][0] != null && bd[j][0] < db.min) || db.min == null) {
								db.min = bd[j][0];
							}
						}
						else {
							bd[j][1] = new $.jsDate(bd[j][1]).getTime();
							if((bd[j][1] != null && bd[j][1] < db.min) || db.min == null) {
								db.min = bd[j][1];
							}
						}
					}
				}
			}

			var tempf = 0, tempn = 0;
			for(var n in stats.frequencies) {
				stats.sortedIntervals.push({
					interval: n,
					frequency: stats.frequencies[n]
				});
			}
			stats.sortedIntervals.sort(function(a, b) {
				return b.frequency - a.frequency;
			});

			stats.min = $.jqplot.arrayMin(stats.intervals);
			stats.max = $.jqplot.arrayMax(stats.intervals);
			stats.mean = sum / d.length;
			this._intervalStats.push(stats);
			stats = sum = s = d = pd = sd = null;
		}
		db = null;

	};

	// called with scope of an axis
	$.jqplot.DateAxisRenderer.prototype.reset = function() {
		this.min = this._options.min;
		this.max = this._options.max;
		this.tickInterval = this._options.tickInterval;
		this.numberTicks = this._options.numberTicks;
		this._autoFormatString = '';
		if(this._overrideFormatString && this.tickOptions && this.tickOptions.formatString) {
			this.tickOptions.formatString = '';
		}
		this.daTickInterval = this._daTickInterval;
		this.useDST = this._useDST;
		this.specialFormat = this._specialFormat;
		this.specialFormatFlag = this._specialFormatFlag;
		// this._ticks = this.__ticks;
	};

	$.jqplot.DateAxisRenderer.prototype.createTicks = function() {
        // we're are operating on an axis here
        var ticks = this._ticks;
        var userTicks = this.ticks;
        var name = this.name;
        // databounds were set on axis initialization.
        var db = this._dataBounds;
		// determines if we need to have date/time on at least one tick for specialFormat == true
		var midnightExists = false;
        var dim, interval;
        var min, max;
        var pos1, pos2;
        var tt, i;
		// for special formatting of axis where date only shows on ticks for midnight, and
		// time shows on others with rule of two
		// all tick settings are disregarded
		if (this.specialFormat)
		{
			if (this.specialFormatFlag==null || (this.specialFormatFlag != 1 && this.specialFormatFlag != 3)){
				var minDtTm = $.jsDate.createDate(this.min);
				var maxDtTm = $.jsDate.createDate(this.max);
				DAR_HELPERS.createdNow = true;
				var tickVals = DAR_HELPERS.DynamicRangeTickCalc(minDtTm.getTime(),maxDtTm.getTime());
				this.numberTicks = tickVals.length;
				userTicks = tickVals;
				midnightExists = false;
				for (var i=0;i<userTicks.length;i++)
				{
					var tDate = $.jsDate.createDate(userTicks[i]);
					if (tDate.getMilliseconds()==0 && tDate.getSeconds()==0 && tDate.getMinutes()==0 && tDate.getHours()==0)
						midnightExists = true;
				}
				this.min = tickVals[0];
				this.max = tickVals[tickVals.length-1];
				this.daTickInterval = [(this.max - this.min) / (this.numberTicks - 1)/1000, 'seconds'];
			}
			else if (this.specialFormatFlag == 3) {
				var threshold = 30;
				var insetMult = 1;
				var tickInterval = this.tickInterval;
				// if we already have ticks, use them.
				// ticks must be in order of increasing value.
				min = ((this.min != null) ? new $.jsDate(this.min).getTime() : db.min);
				max = ((this.max != null) ? new $.jsDate(this.max).getTime() : db.max);
				var range = max - min;

				if (this.tickOptions == null || !this.tickOptions.formatString) {
					this._overrideFormatString = true;
				}
			}
			else if (this.specialFormatFlag == 1) {
				userTicks = [new Date().getTime()];
			}
			/* adding ticks if specialFormatFlag == 2.  This will help create table look */
			if (this.specialFormatFlag == 2)
			{
				var tempTicks = []
					, cDiffOpt = null, cDiff = null;
				for (var i=0;i<userTicks.length;i++)
				{
					var t1Time = (userTicks[i].constructor == Array)?userTicks[i][0]:userTicks[i];
					if (i==0)
						tempTicks.push(t1Time);
					else
					{
						var t2Time = (userTicks[i-1].constructor == Array)?userTicks[i-1][0]:userTicks[i-1];
						cDiff = t1Time - t2Time;
						var t1Date = $.jsDate.createDate(t1Time), t2Date = $.jsDate.createDate(t2Time);
						eval(["t1Date.set",DAR_HELPERS.tickDiff[1],"(t1Date.get",DAR_HELPERS.tickDiff[1],"()-DAR_HELPERS.tickDiff[0]);"].join(""));
						if (t1Date.getTime()==t2Date.getTime())
						{
							tempTicks.push(Math.round(t2Time+(cDiff/2)));
							tempTicks.push(t1Time);
						}
						else 
						{
							if (DAR_HELPERS.tickDiff[0]==1 && DAR_HELPERS.tickDiff[1]=="Date")
								t2Date.setHours(t2Date.getHours()+12);
							else if (DAR_HELPERS.tickDiff[0]==1 && DAR_HELPERS.tickDiff[1]=="Month")
								t2Date.setDate(t2Date.getDate()+15);
							else
								eval(["t2Date.set",DAR_HELPERS.tickDiff[1],"(t2Date.get",DAR_HELPERS.tickDiff[1],"()+Math.round(DAR_HELPERS.tickDiff[0]/2));"].join(""));
							var t2TempTime = t2Date.getTime();
							if (t2TempTime >= t1Time)
							{
								tempTicks.push(t1Time);
							}
							else
							{
								tempTicks.push(t2TempTime);
								tempTicks.push(t1Time);
							}
						}
					}
				}
				userTicks = tempTicks;
				this.numberTicks = userTicks.length;
			}
		}
        /* if we already have ticks, use them. Ticks must be in order of increasing value. */
        if (userTicks.length) {
            /* ticks could be 1D or 2D array of [val, val, ,,,] or [[val, label], [val, label], ...] or mixed */
			if (this.specialFormatFlag == 3) {
				for (i=0; i<userTicks.length; i++){
					var ut = userTicks[i];
					var t = new this.tickRenderer(this.tickOptions);
					if (ut.constructor == Array) {
						t.value = new $.jsDate(ut[0]).getTime();
						t.label = ut[1];
						if (!this.showTicks) {
							t.showLabel = false;
							t.showMark = false;
						}
						else if (!this.showTickMarks) {
							t.showMark = false;
						}
						t.setTick(t.value, this.name);
						this._ticks.push(t);
					}
					
					else {
						t.value = new $.jsDate(ut).getTime();
						if (!this.showTicks) {
							t.showLabel = false;
							t.showMark = false;
						}
						else if (!this.showTickMarks) {
							t.showMark = false;
						}
						t.setTick(t.value, this.name);
						this._ticks.push(t);
					}
				}
			}
			else {
				for (i=0; i<userTicks.length; i++){
					var t = new this.tickRenderer(this.tickOptions);
					/* creating date first in case of value not in Milliseconds */
					t.value = $.jsDate.createDate((userTicks[i].constructor == Array)?userTicks[i][0]:userTicks[i]).getTime();
					if (t.value > this.max)
						continue;
					t.label = (userTicks[i].constructor == Array)?userTicks[i][1]:null;
					
					if (this.specialFormat)
					{
						/* show date with time on first tick if all other ticks are just time */
						if (this.specialFormatFlag != null && this.specialFormatFlag == 2)
						{
							if (i==0 || i==(userTicks.length-1))
							{
								t.showLabel = false;
								t.showGridline = false;
								t.showMark = false;
							}
							else if ((i%2)==0)
							{
								t.showGridline = false;
								t.showLabel = true;
								t.showMark = false;
							}
							else
							{
								t.showGridline = true;
								t.showLabel = false;
								t.showMark = true;
							}
						}
						else if (userTicks.length >=2 && i==(userTicks.length-1) && userTicks[userTicks.length-1]==this.max)
						{
							
							var t1Date = $.jsDate.createDate((userTicks[i-1].constructor == Array)?userTicks[i-1][0]:userTicks[i-1]);
							var t2Date = $.jsDate.createDate((userTicks[i].constructor == Array)?userTicks[i][0]:userTicks[i]);
							eval(["t2Date.set",DAR_HELPERS.tickDiff[1],"(t2Date.get",DAR_HELPERS.tickDiff[1],"()-DAR_HELPERS.tickDiff[0]);"].join(""));
							
							if (t1Date.getTime() != t2Date.getTime())
							{
								t.showLabel = false;
								t.showGridline = false;
								t.showMark = false;
							}	
						}
					}
						
					if (!this.showTicks) {
						t.showLabel = false;
						t.showMark = false;
					}
					else if (!this.showTickMarks) {
						t.showMark = false;
					}
					t.setTick(t.value, this.name);
					this._ticks.push(t);
				}
			}
            this.numberTicks = this._ticks.length;
			//if (!this.specialFormat) {
				this.min = this._ticks[0].value;
				this.max = this._ticks[this.numberTicks-1].value;
			//}
            this.daTickInterval = [(this.max - this.min) / (this.numberTicks - 1)/1000, 'seconds'];
        }
        
        ////////
        // We don't have any ticks yet, let's make some!
        ////////

        // if user specified min and max are null, we set those to make best ticks.
        else if (this.min == null && this.max == null) {
            var opts = $.extend(true, {}, this.tickOptions, {name: this.name, value: null});
            // want to find a nice interval 
            var nttarget,
                titarget;

            // if no tickInterval or numberTicks options specified,  make a good guess.
			if (!this.tickInterval && !this.numberTicks) {
                var tdim = Math.max(dim, threshold+1);
                // how many ticks to put on the axis?
                // date labels tend to be long.  If ticks not rotated,
                // don't use too many and have a high spacing factor.
                // If we are rotating ticks, use a lower factor.
                var spacingFactor = 100;
                if (this.tickRenderer === $.jqplot.CanvasAxisTickRenderer && this.tickOptions.angle) {
                    spacingFactor = 115 - 40 * Math.abs(Math.sin(this.tickOptions.angle/180*Math.PI));
                }

                nttarget =  Math.ceil((tdim-threshold)/spacingFactor + 1);
                titarget = (max - min) / (nttarget - 1);
            }

            // If tickInterval is specified, we'll try to honor it.
            // Not gauranteed to get this interval, but we'll get as close as
            // we can.
            // tickInterval will be used before numberTicks, that is if
            // both are specified, numberTicks will be ignored.
            else if (this.tickInterval) {
                titarget = this.tickInterval;
            }

            // if numberTicks specified, try to honor it.
            // Not gauranteed, but will try to get close.
            else if (this.numberTicks) {
                nttarget = this.numberTicks;
                titarget = (max - min) / (nttarget - 1);
            }

            // If we can use an interval of 2 weeks or less, pick best one
            if (titarget <= 19*day) {
                var ret = bestDateInterval(min, max, titarget);
                var tempti = ret[0];
                this._autoFormatString = ret[1];

                min = Math.floor(min/tempti) * tempti;
                min = new $.jsDate(min);
                min = min.getTime() + min.getUtcOffset();

                nttarget = Math.ceil((max - min) / tempti) + 1;
                this.min = min;
                this.max = min + (nttarget - 1) * tempti;

                // if max is less than max, add an interval
                if (this.max < max) {
                    this.max += tempti;
                    nttarget += 1;
                }
                this.tickInterval = tempti;
                this.numberTicks = nttarget;

                for (var i=0; i<nttarget; i++) {
                    opts.value = this.min + i * tempti;
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }

                insetMult = this.tickInterval;
            }

            // should we use a monthly interval?
            else if (titarget <= 9 * month) {

                this._autoFormatString = '%v';

                // how many months in an interval?
                var intv = Math.round(titarget/month);
                if (intv < 1) {
                    intv = 1;
                }
                else if (intv > 6) {
                    intv = 6;
                }

                // figure out the starting month and ending month.
                var mstart = new $.jsDate(min).setDate(1).setHours(0,0,0,0);

                // See if max ends exactly on a month
                var tempmend = new $.jsDate(max);
                var mend = new $.jsDate(max).setDate(1).setHours(0,0,0,0);

                if (tempmend.getTime() !== mend.getTime()) {
                    mend = mend.add(1, 'month');
                }

                var nmonths = mend.diff(mstart, 'month');

                nttarget = Math.ceil(nmonths/intv) + 1;

                this.min = mstart.getTime();
                this.max = mstart.clone().add((nttarget - 1) * intv, 'month').getTime();
                this.numberTicks = nttarget;

                for (var i=0; i<nttarget; i++) {
                    if (i === 0) {
                        opts.value = mstart.getTime();
                    }
                    else {
                        opts.value = mstart.add(intv, 'month').getTime();
                    }
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }

                insetMult = intv * month;
            }

            // use yearly intervals
            else {

                this._autoFormatString = '%v';

                // how many years in an interval?
                var intv = Math.round(titarget/year);
                if (intv < 1) {
                    intv = 1;
                }

                // figure out the starting and ending years.
                var mstart = new $.jsDate(min).setMonth(0, 1).setHours(0,0,0,0);
                var mend = new $.jsDate(max).add(1, 'year').setMonth(0, 1).setHours(0,0,0,0);

                var nyears = mend.diff(mstart, 'year');

                nttarget = Math.ceil(nyears/intv) + 1;

                this.min = mstart.getTime();
                this.max = mstart.clone().add((nttarget - 1) * intv, 'year').getTime();
                this.numberTicks = nttarget;

                for (var i=0; i<nttarget; i++) {
                    if (i === 0) {
                        opts.value = mstart.getTime();
                    }
                    else {
                        opts.value = mstart.add(intv, 'year').getTime();
                    }
                    t = new this.tickRenderer(opts);
                    
                    if (this._overrideFormatString && this._autoFormatString != '') {
                        t.formatString = this._autoFormatString;
                    }
                    if (!this.showTicks) {
                        t.showLabel = false;
                        t.showMark = false;
                    }
                    else if (!this.showTickMarks) {
                        t.showMark = false;
                    }
                    this._ticks.push(t);
                }

                insetMult = intv * year;
            }
        }

        ////////
        // Some option(s) specified, work around that.
        ////////
        else {
            if (name.match(/^x/)) {
                dim = this._plotDimensions.width;
            }
            else {
                dim = this._plotDimensions.height;
            }
            
            // if min, max and number of ticks specified, user can't specify interval.
            if (this.min != null && this.max != null && this.numberTicks != null) {
                this.tickInterval = null;
            }
            
            // if user specified a tick interval, convert to usable.
            if (this.tickInterval != null)
            {
                // if interval is a number or can be converted to one, use it.
                // Assume it is in SECONDS!!!
                if (Number(this.tickInterval)) {
                    this.daTickInterval = [Number(this.tickInterval), 'seconds'];
                }
                // else, parse out something we can build from.
                else if (typeof this.tickInterval == "string") {
                    var parts = this.tickInterval.split(' ');
                    if (parts.length == 1) {
                        this.daTickInterval = [1, parts[0]];
                    }
                    else if (parts.length == 2) {
                        this.daTickInterval = [parts[0], parts[1]];
                    }
                }
            }
        
            min = ((this.min != null) ? $.jsDate.createDate(this.min).getTime() : db.min);
            max = ((this.max != null) ? $.jsDate.createDate(this.max).getTime() : db.max);
            
            // if min and max are same, space them out a bit
            if (min == max) {
                var adj = 24*60*60*500;  // 1/2 day
                min -= adj;
                max += adj;
            }

            var range = max - min;
            var rmin, rmax;
        
            rmin = (this.min != null) ? $.jsDate.createDate(this.min).getTime() : min - range/2*(this.padMin - 1);
            rmax = (this.max != null) ? $.jsDate.createDate(this.max).getTime() : max + range/2*(this.padMax - 1);
            this.min = rmin;
            this.max = rmax;
            range = this.max - this.min;
    
            if (this.numberTicks == null){
                // if tickInterval is specified by user, we will ignore computed maximum.
                // max will be equal or greater to fit even # of ticks.
                if (this.daTickInterval != null) {
					var max = $.jsDate.createDate(this.max);
                    var nc = new $.jsDate(max).diff(this.min, this.daTickInterval[1], true);
                    this.numberTicks = Math.ceil(nc/this.daTickInterval[0]) +1;
					var min = $.jsDate.createDate(this.min);
                    this.max = new $.jsDate(min).add((this.numberTicks-1) * this.daTickInterval[0], this.daTickInterval[1]).getTime();
                }
                else if (dim > 200) {
                    this.numberTicks = parseInt(3+(dim-200)/100, 10);
                }
                else {
                    this.numberTicks = 2;
                }
            }
			
			insetMult = range / (this.numberTicks-1)/1000;
            if (this.daTickInterval == null) {
                this.daTickInterval = [insetMult, 'seconds'];
            }
			
			if (this.specialFormatFlag == 3) {
				for (var i=0; i<this.numberTicks; i++){
					var min = new $.jsDate(this.min);
					tt = min.add(i*this.daTickInterval[0], this.daTickInterval[1]).getTime();
					var t = new this.tickRenderer(this.tickOptions);
					// var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
					if (!this.showTicks) {
						t.showLabel = false;
						t.showMark = false;
					}
					else if (!this.showTickMarks) {
						t.showMark = false;
					}
					t.setTick(tt, this.name);
					this._ticks.push(t);
				}
			}
			else {
				for (var i=0; i<this.numberTicks; i++){
					var min = $.jsDate.createDate(this.min);
					if (this.useDST){
						tt = new $.jsDate(min).add(i*this.daTickInterval[0], this.daTickInterval[1]).getTime();
					}
					else{
						tt = new $.jsDate(min).addNoDST(i*this.daTickInterval[0], this.daTickInterval[1]).getTime();
					}
					var t = new this.tickRenderer(this.tickOptions);
					// var t = new $.jqplot.AxisTickRenderer(this.tickOptions);
					if (!this.showTicks) {
						t.showLabel = false;
						t.showMark = false;
					}
					else if (!this.showTickMarks) {
						t.showMark = false;
					}
					t.setTick(tt, this.name);
					this._ticks.push(t);
				}
			}
        }
        if (this._daTickInterval == null) {
            this._daTickInterval = this.daTickInterval;    
        }
    };
})(jQuery);

var DAR_HELPERS = function() {
	return {
		createdNow: false,
		tickDiff: null,
		minuteCntPerTickSpecial: 0,
		DynamicRangeTickCalc: function(iMin, iMax) {
			var unitSize = {
				"second": 1000,
				"minute": 60 * 1000,
				"hour": 60 * 60 * 1000,
				"day": 24 * 60 * 60 * 1000,
				"month": 30 * 24 * 60 * 60 * 1000,
				"year": 365.2425 * 24 * 60 * 60 * 1000
			};
			var minDtTm = $.jsDate.createDate(iMin);
			var maxDtTm = $.jsDate.createDate(iMax);
			var dtTmDiff = iMax - iMin;
			var tickVals = [], curDtTm = new Date(), noNowTick = false;
			var minuteCnt = DAR_HELPERS.minuteCntPerTickSpecial;
			curDtTm.setMilliseconds(0);
			curDtTm.setSeconds(0);
			if(minuteCnt > 0) //special tick calc for ICU Flowsheet
			{
				DAR_HELPERS.tickDiff = [minuteCnt, "Minutes"];
				if((maxDtTm.getMinutes() % minuteCnt) != 0 || ((maxDtTm.getMinutes() % minuteCnt) == 0 && (maxDtTm.getSeconds() > 0 || maxDtTm.getMilliseconds() > 0))) {
					maxDtTm.setMinutes(maxDtTm.getMinutes() + ( minuteCnt - (maxDtTm.getMinutes() % minuteCnt)));
				}
				maxDtTm.setMilliseconds(0);
				maxDtTm.setSeconds(0);
				tickVals.push(maxDtTm.getTime());
				DAR_HELPERS.createdNow = false;
				while(maxDtTm.getTime() > minDtTm.getTime()) {
					maxDtTm.setMinutes(maxDtTm.getMinutes() - minuteCnt);
					tickVals.push(maxDtTm.getTime());
				}
				tickVals.reverse();
				return tickVals;
			}
			else {
				if(dtTmDiff <= (2 * unitSize["second"])) // <= 2 seconds
				{
					DAR_HELPERS.tickDiff = [250, "Milliseconds"];
					if((maxDtTm.getMilliseconds() % 250) != 0) {
						maxDtTm.setMilliseconds(maxDtTm.getMilliseconds() + (250 - (maxDtTm.getMilliseconds() % 250)));
					}
					tickVals.push(maxDtTm.getTime());
					while(maxDtTm.getTime() > minDtTm.getTime()) {
						maxDtTm.setMilliseconds(maxDtTm.getMilliseconds() - 250);
						if(maxDtTm.getTime() == curDtTm.getTime()) {
							noNowTick = true;
							/* removing curTick to prevent override of actual ticks */
						}
						else if(!noNowTick && !DAR_HELPERS.createdNow && maxDtTm.getTime() < curDtTm.getTime()) {
							DAR_HELPERS.createdNow = true;
							tickVals.push(curDtTm.getTime());
						}
						tickVals.push(maxDtTm.getTime());
					}
				}
				else if(dtTmDiff <= ((2 * unitSize["minute"]) + (15 * unitSize["second"]))) // <= 2 minutes 15 seconds
				{
					DAR_HELPERS.tickDiff = [15, "Seconds"];
					if((maxDtTm.getSeconds() % 15) != 0 || ((maxDtTm.getSeconds() % 15) == 0 && maxDtTm.getMilliseconds() > 0)) {
						maxDtTm.setSeconds(maxDtTm.getSeconds() + (15 - (maxDtTm.getSeconds() % 15)));
					}
					maxDtTm.setMilliseconds(0);
					tickVals.push(maxDtTm.getTime());
					while(maxDtTm.getTime() > minDtTm.getTime()) {
						maxDtTm.setSeconds(maxDtTm.getSeconds() - 15);
						if(maxDtTm.getTime() == curDtTm.getTime()) {
							noNowTick = true;
							/* removing curTick to prevent override of actual ticks */
						}
						else if(!noNowTick && !DAR_HELPERS.createdNow && maxDtTm.getTime() < curDtTm.getTime()) {
							DAR_HELPERS.createdNow = true;
							tickVals.push(curDtTm.getTime());
						}
						tickVals.push(maxDtTm.getTime());
					}
				}
				else if(dtTmDiff <= ((2 * unitSize["hour"]) + (15 * unitSize["minute"]))) // <= 2 hours 15 minutes
				{
					DAR_HELPERS.tickDiff = [15, "Minutes"];
					if((maxDtTm.getMinutes() % 15) != 0 || ((maxDtTm.getMinutes() % 15) == 0 && (maxDtTm.getSeconds() > 0 || maxDtTm.getMilliseconds() > 0))) {
						maxDtTm.setMinutes(maxDtTm.getMinutes() + (15 - (maxDtTm.getMinutes() % 15)));
					}
					maxDtTm.setMilliseconds(0);
					maxDtTm.setSeconds(0);
					tickVals.push(maxDtTm.getTime());
					while(maxDtTm.getTime() > minDtTm.getTime()) {
						maxDtTm.setMinutes(maxDtTm.getMinutes() - 15);
						if(maxDtTm.getTime() == curDtTm.getTime()) {
							noNowTick = true;
							/* removing curTick to prevent override of actual ticks */
						}
						else if(!noNowTick && !DAR_HELPERS.createdNow && maxDtTm.getTime() < curDtTm.getTime()) {
							DAR_HELPERS.createdNow = true;
							tickVals.push(curDtTm.getTime());
						}
						tickVals.push(maxDtTm.getTime());
					}
				}
				else if(dtTmDiff <= (unitSize["day"] + (2 * unitSize["hour"]))) // <= 1 day 2 hours
				{
					DAR_HELPERS.tickDiff = [2, "Hours"];
					if((maxDtTm.getHours() % 2) != 0 || ((maxDtTm.getHours() % 2) == 0 && (maxDtTm.getMinutes() > 0 || maxDtTm.getSeconds() > 0 || maxDtTm.getMilliseconds() > 0))) {
						maxDtTm.setHours(maxDtTm.getHours() + (2 - (maxDtTm.getHours() % 2)));
					}
					maxDtTm.setMilliseconds(0);
					maxDtTm.setSeconds(0);
					maxDtTm.setMinutes(0);
					tickVals.push(maxDtTm.getTime());
					while(maxDtTm.getTime() > minDtTm.getTime()) {
						maxDtTm.setHours(maxDtTm.getHours() - 2);
						if(maxDtTm.getTime() == curDtTm.getTime()) {
							noNowTick = true;
							/* removing curTick to prevent override of actual ticks */
						}
						else if(!noNowTick && !DAR_HELPERS.createdNow && maxDtTm.getTime() < curDtTm.getTime()) {
							DAR_HELPERS.createdNow = true;
							tickVals.push(curDtTm.getTime());
						}
						tickVals.push(maxDtTm.getTime());
					}
				}
				else if(dtTmDiff <= ((2 * unitSize["day"]) + (4 * unitSize["hour"]))) // <= 2 days 4 hours
				{
					DAR_HELPERS.tickDiff = [4, "Hours"];
					if((maxDtTm.getHours() % 4) != 0 || ((maxDtTm.getHours() % 4) == 0 && (maxDtTm.getMinutes() > 0 || maxDtTm.getSeconds() > 0 || maxDtTm.getMilliseconds() > 0))) {
						maxDtTm.setHours(maxDtTm.getHours() + (4 - (maxDtTm.getHours() % 4)));
					}
					maxDtTm.setMilliseconds(0);
					maxDtTm.setSeconds(0);
					maxDtTm.setMinutes(0);
					tickVals.push(maxDtTm.getTime());
					while(maxDtTm.getTime() > minDtTm.getTime()) {
						maxDtTm.setHours(maxDtTm.getHours() - 4);
						if(maxDtTm.getTime() == curDtTm.getTime()) {
							noNowTick = true;
							/* removing curTick to prevent override of actual ticks */
						}
						else if(!noNowTick && !DAR_HELPERS.createdNow && maxDtTm.getTime() < curDtTm.getTime()) {
							DAR_HELPERS.createdNow = true;
							tickVals.push(curDtTm.getTime());
						}
						tickVals.push(maxDtTm.getTime());
					}
				}
				else if(dtTmDiff <= (15 * unitSize["day"])) // <= 2 weeks 1 day
				{
					DAR_HELPERS.tickDiff = [1, "Date"];
					if(maxDtTm.getMilliseconds() > 0 || maxDtTm.getSeconds() > 0 || maxDtTm.getMinutes() > 0 || maxDtTm.getHours() > 0) {
						maxDtTm.setDate(maxDtTm.getDate() + 1);
					}
					maxDtTm.setMilliseconds(0);
					maxDtTm.setSeconds(0);
					maxDtTm.setMinutes(0);
					maxDtTm.setHours(0);
					tickVals.push(maxDtTm.getTime());
					while(maxDtTm.getTime() > minDtTm.getTime()) {
						maxDtTm.setDate(maxDtTm.getDate() - 1);
						if(maxDtTm.getTime() == curDtTm.getTime()) {
							noNowTick = true;
							/* removing curTick to prevent override of actual ticks */
						}
						else if(!noNowTick && !DAR_HELPERS.createdNow && maxDtTm.getTime() < curDtTm.getTime()) {
							DAR_HELPERS.createdNow = true;
							tickVals.push(curDtTm.getTime());
						}
						tickVals.push(maxDtTm.getTime());
					}
				}
				else if(dtTmDiff <= ((2 * unitSize["month"]) + (7 * unitSize["day"]))) // <= 2 months 1 week
				{
					DAR_HELPERS.tickDiff = [7, "Date"];
					if(maxDtTm.getMilliseconds() > 0 || maxDtTm.getSeconds() > 0 || maxDtTm.getMinutes() > 0 || maxDtTm.getHours() > 0) {
						maxDtTm.setDate(maxDtTm.getDate() + 1);
					}
					maxDtTm.setMilliseconds(0);
					maxDtTm.setSeconds(0);
					maxDtTm.setMinutes(0);
					maxDtTm.setHours(0);
					tickVals.push(maxDtTm.getTime());
					while(maxDtTm.getTime() > minDtTm.getTime()) {
						maxDtTm.setDate(maxDtTm.getDate() - 7);
						if(maxDtTm.getTime() == curDtTm.getTime()) {
							noNowTick = true;
							/* removing curTick to prevent override of actual ticks */
						}
						else if(!noNowTick && !DAR_HELPERS.createdNow && maxDtTm.getTime() < curDtTm.getTime()) {
							DAR_HELPERS.createdNow = true;
							tickVals.push(curDtTm.getTime());
						}
						tickVals.push(maxDtTm.getTime());
					}
				}
				else if (dtTmDiff > ((2 * unitSize["month"]) + (7 * unitSize["day"])) && dtTmDiff<=((12*unitSize["month"])))// <= 12 months
				{
					DAR_HELPERS.tickDiff = [1,"Month"];
					if (maxDtTm.getDate()>1 || (maxDtTm.getDate()==1 && 
							(maxDtTm.getMilliseconds()>0 || maxDtTm.getSeconds()>0 || maxDtTm.getMinutes()>0 || maxDtTm.getHours()>0)))
						maxDtTm.setMonth(maxDtTm.getMonth()+1);
					maxDtTm.setMilliseconds(0);
					maxDtTm.setSeconds(0);
					maxDtTm.setMinutes(0);
					maxDtTm.setHours(0);
					maxDtTm.setDate(1);
					tickVals.push(maxDtTm.getTime());
					while (maxDtTm.getTime() > minDtTm.getTime())
					{
						maxDtTm.setMonth(maxDtTm.getMonth()-1);
						if (maxDtTm.getTime() == curDtTm.getTime())
							noNowTick = true; /* removing curTick to prevent override of actual ticks */
						else if (!noNowTick && !DAR_HELPERS.createdNow && maxDtTm.getTime() < curDtTm.getTime())
						{
							DAR_HELPERS.createdNow = true;
							tickVals.push(curDtTm.getTime());
						}
						tickVals.push(maxDtTm.getTime());
					}
				}
				else if (dtTmDiff>((12*unitSize["month"])))// > 12 months
				{
					DAR_HELPERS.tickDiff = [12,"Month"];
					if (maxDtTm.getDate()>12 || (maxDtTm.getDate()==12 && 
							(maxDtTm.getMilliseconds()>0 || maxDtTm.getSeconds()>0 || maxDtTm.getMinutes()>0 || maxDtTm.getHours()>0)))
						maxDtTm.setMonth(maxDtTm.getMonth()+12);
					maxDtTm.setMilliseconds(0);
					maxDtTm.setSeconds(0);
					maxDtTm.setMinutes(0);
					maxDtTm.setHours(0);
					maxDtTm.setDate(12);
					tickVals.push(maxDtTm.getTime());
					while (maxDtTm.getTime() > minDtTm.getTime())
					{
						maxDtTm.setMonth(maxDtTm.getMonth()-12);
						if (maxDtTm.getTime() == curDtTm.getTime())
							noNowTick = true; /* removing curTick to prevent override of actual ticks */
						else if (!noNowTick && !DAR_HELPERS.createdNow && maxDtTm.getTime() < curDtTm.getTime())
						{
							DAR_HELPERS.createdNow = true;
							tickVals.push(curDtTm.getTime());
						}
						tickVals.push(maxDtTm.getTime());
					}
				}
			}
			tickVals.reverse();
			if(tickVals[tickVals.length - 1] > new Date().getTime()) {
				tickVals[tickVals.length - 1] = new Date().getTime();
			}
			return tickVals;
		}

	}
}();
/**
 * Copyright (c) 2009 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT and GPL version 2.0 licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * The author would appreciate an email letting him know of any substantial
 * use of jqPlot.  You can reach the author at: chris dot leonello at gmail 
 * dot com or see http://www.jqplot.com/info.php .  This is, of course, 
 * not required.
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * Thanks for using jqPlot!
 * 
 */
(function($) {
    // class: $.jqplot.MarkerRenderer
    // The default jqPlot marker renderer, rendering the points on the line.
    $.jqplot.MarkerRenderer = function(options){
        // Group: Properties
        // prop: show
        // wether or not to show the marker.
        this.show = true;
        // prop: style
        // One of diamond, circle, square, x, plus, dash, filledDiamond, filledCircle, filledSquare
        this.style = 'filledCircle';
        // prop: lineWidth
        // size of the line for non-filled markers.
        this.lineWidth = 2;
        // prop: size
        // Size of the marker (diameter or circle, length of edge of square, etc.)
        this.size = 9.0;
        // prop: color
        // color of marker.  Will be set to color of series by default on init.
        this.color = '#666666';
        // prop: shadow
        // wether or not to draw a shadow on the line
        this.shadow = true;
        // prop: shadowAngle
        // Shadow angle in degrees
        this.shadowAngle = 45;
        // prop: shadowOffset
        // Shadow offset from line in pixels
        this.shadowOffset = 1;
        // prop: shadowDepth
        // Number of times shadow is stroked, each stroke offset shadowOffset from the last.
        this.shadowDepth = 3;
        // prop: shadowAlpha
        // Alpha channel transparency of shadow.  0 = transparent.
        this.shadowAlpha = '0.07';
        // prop: shadowRenderer
        // Renderer that will draws the shadows on the marker.
        this.shadowRenderer = new $.jqplot.ShadowRenderer();
        // prop: shapeRenderer
        // Renderer that will draw the marker.
        this.shapeRenderer = new $.jqplot.ShapeRenderer();
		// prop: whiskerColor
		// line color for a whisker line if drawn.
		this.whiskerColor = "#000000";
		// prop: whiskerData
		// data that is converted into whisker lines according to the "x" values passed in.
		// format: [[x, y1, y2],...]]
		this.whiskerData = [];
		// prop: _whiskerData
		// data (in pixels) that is converted into whisker lines according to the "x" values passed in.
		// format: [[x, y1, y2],...]]
		this._whiskerData = [];
	
        $.extend(true, this, options);
    };
    
    $.jqplot.MarkerRenderer.prototype.init = function(options) {
		$.extend(true, this, options);
        var sdopt = {angle:this.shadowAngle, offset:this.shadowOffset, alpha:this.shadowAlpha, lineWidth:this.lineWidth, depth:this.shadowDepth, closePath:true};
        if (this.style.indexOf('filled') != -1) {
            sdopt.fill = true;
        }
        if (this.style.indexOf('ircle') != -1) {
            sdopt.isarc = true;
            sdopt.closePath = false;
        }
        this.shadowRenderer.init(sdopt);
        var shopt = {fill:false, isarc:false, strokeStyle:this.color, fillStyle:this.color, lineWidth:this.lineWidth, closePath:true};
        if (this.style.indexOf('filled') != -1) {
            shopt.fill = true;
        }
        if (this.style.indexOf('ircle') != -1) {
            shopt.isarc = true;
            shopt.closePath = false;
        }
        this.shapeRenderer.init(shopt);
    };
	
	$.jqplot.MarkerRenderer.prototype.drawLine = function(x1, y1, x2, y2, ctx){
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.strokeStyle = this.color;
		ctx.stroke();
		ctx.restore();
	};
	
	$.jqplot.MarkerRenderer.prototype.drawUpVee = function(x, y, ctx, fill, options) {
        var stretch = 1.2;
        var dx = this.size/1/stretch;
        var dy = this.size/1*stretch;
		var opts = $.extend(true, {}, this.options, {closePath:false});
        var points = [[x+dx,y+dy],[x,y],[x-dx,y+dy]];
		if (this.shadow) {
            this.shadowRenderer.draw(ctx, points, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points, opts);

		ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawDownVee = function(x, y, ctx, fill, options) {
        var stretch = 1.2;
        var dx = this.size/1/stretch;
        var dy = this.size/1*stretch;
		var opts = $.extend(true, {}, this.options, {closePath:false});
        var points = [[x+dx,y-dy],[x,y],[x-dx,y-dy]];
		if (this.shadow) {
            this.shadowRenderer.draw(ctx, points, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points, opts);

		ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawDiamond = function(x, y, ctx, fill, options) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = [[x-dx, y], [x, y+dy], [x+dx, y], [x, y-dy]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawStar = function(x, y, ctx, fill, options) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = 0-(this.size/2*stretch);
		var dyE = 0-(this.size/1.5*stretch);
        var points = [[x,y+dyE],[x+(dx/3),y+(dy/2)],[x+dx,y+(dy/2)],[x+(dx/2),y],[x+dx,y-dy],[x,y-(dy/2)],[x-dx,y-dy],[x-(dx/2),y],[x-dx,y+(dy/2)],[x-(dx/3),y+(dy/2)]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawRectangleDiag = function(x, y, ctx, fill, options, direction) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = null;
		switch (direction)
		{
			case "l":
				points = [[x, y+dy], [x+dx, y+(dy/2)], [x, y-dx], [x-dx,y-(dy/2)]];
				break;
			default: //right
				points = [[x, y+dy], [x+dx, y-(dy/2)], [x, y-dx], [x-dx,y+(dy/2)]];
				break;
		}
		
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
    
	$.jqplot.MarkerRenderer.prototype.drawTriangle = function(x, y, ctx, fill, options, direction) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = null;
		switch (direction)
		{
			case "r":
				points = [[x+dx, y], [x-dx, y-dy], [x-dx, y+dx]];
				break;
			case "l":
				points = [[x-dx, y], [x+dx, y-dy], [x+dx, y+dx]];
				break;
			case "d":
				points = [[x, y+dy], [x-dx, y-dy], [x+dx, y-dx]];
				break;
			default: //up
				points = [[x, y-dy], [x-dx, y+dy], [x+dx, y+dx]];
				break;
		}
		
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawRectangle = function(x, y, ctx, fill, options, direction) {
        var stretch = 1.2;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
		switch (direction)
		{
			case "v":
				dx = this.size/4*stretch;
				break;
			default: //horizontal
				dy = this.size/4*stretch;
				break;
		}
        var points = [[x-dx, y-dy], [x-dx, y+dy], [x+dx, y+dy], [x+dx, y-dy]];
		
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
	$.jqplot.MarkerRenderer.prototype.drawHeart = function(x, y, ctx, fill, options) {
        var stretch = 1.5;
        var dx = this.size/2*stretch;
        var dy = 0-(this.size/2*stretch);
        var points = [[x, y+(dy/2)], [x+(dx/3), y+dy], [x+dx, y+dy], [x+dx, y], [x, y-dy], [x-dx, y], [x-dx, y+dy], [x-(dx/3), y+dy]];
		
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
	
    $.jqplot.MarkerRenderer.prototype.drawPlus = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points1 = [[x, y-dy], [x, y+dy]];
        var points2 = [[x+dx, y], [x-dx, y]];
        var opts = $.extend(true, {}, this.options, {closePath:false});
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points1, {closePath:false});
            this.shadowRenderer.draw(ctx, points2, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points1, opts);
        this.shapeRenderer.draw(ctx, points2, opts);

        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawX = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var opts = $.extend(true, {}, this.options, {closePath:false});
        var points1 = [[x-dx, y-dy], [x+dx, y+dy]];
        var points2 = [[x-dx, y+dy], [x+dx, y-dy]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points1, {closePath:false});
            this.shadowRenderer.draw(ctx, points2, {closePath:false});
        }
        this.shapeRenderer.draw(ctx, points1, opts);
        this.shapeRenderer.draw(ctx, points2, opts);

        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawDash = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = [[x-dx, y], [x+dx, y]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);

        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawSquare = function(x, y, ctx, fill, options) {
        var stretch = 1.0;
        var dx = this.size/2*stretch;
        var dy = this.size/2*stretch;
        var points = [[x-dx, y-dy], [x-dx, y+dy], [x+dx, y+dy], [x+dx, y-dy]];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);
		
        ctx.restore();
    };
    
    $.jqplot.MarkerRenderer.prototype.drawCircle = function(x, y, ctx, fill, options) {
        var radius = this.size/2;
        var end = 2*Math.PI;
        var points = [x, y, radius, 0, end, true];
        if (this.shadow) {
            this.shadowRenderer.draw(ctx, points);
        }
        this.shapeRenderer.draw(ctx, points, options);
        
        ctx.restore();
    };
	$.jqplot.MarkerRenderer.prototype.drawWhiskerLine = function( x, y, ctx, fill, options )
	{
		var y1 = y, y2 = y, wLen = (this._whiskerData)?this._whiskerData.length:0;
		for (var cnt = 0; cnt < wLen; cnt++) {
			if (this._whiskerData[cnt][0] == x) {
				y1 = this._whiskerData[cnt][1];
				y2 = this._whiskerData[cnt][2];
				break;
			}
		}
		var points = [];
		if (y1 !== y || y2 !== y) {		
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x,y1);
			ctx.lineTo(x,y2);
			ctx.strokeStyle = this.whiskerColor;
			ctx.stroke();
			ctx.restore();
		}
	};
	
    $.jqplot.MarkerRenderer.prototype.draw = function(x, y, ctx, options) {
        options = options || {};
		this.drawWhiskerLine(x,y,ctx, false, options);
        switch (this.style) {
			case 'upVee':
				this.drawUpVee(x,y,ctx, false, options);
				break;
			case 'downVee':
				this.drawDownVee(x,y,ctx, false, options);
				break;
			case 'diamond':
				this.drawDiamond(x,y,ctx, false, options);
				break;
			case 'filledDiamond':
				this.drawDiamond(x,y,ctx, true, options);
				break;
			case 'star':
				this.drawStar(x,y,ctx, false, options);
				break;
			case 'filledStar':
				this.drawStar(x,y,ctx, true, options);
				break;
			case 'rectDiagRight':
				this.drawRectangleDiag(x,y,ctx, false, options, "r");
				break;
			case 'filledRectDiagRight':
				this.drawRectangleDiag(x,y,ctx, true, options, "r");
				break;
			case 'rectDiagLeft':
				this.drawRectangleDiag(x,y,ctx, false, options, "l");
				break;
			case 'filledRectDiagLeft':
				this.drawRectangleDiag(x,y,ctx, true, options, "l");
				break;
			case 'triangleRight':
				this.drawTriangle(x,y,ctx, false, options, "r");
				break;
			case 'filledTriangleRight':
				this.drawTriangle(x,y,ctx, true, options, "r");
				break;
			case 'triangleLeft':
				this.drawTriangle(x,y,ctx, false, options, "l");
				break;
			case 'filledTriangleLeft':
				this.drawTriangle(x,y,ctx, true, options, "l");
				break;
			case 'triangleUp':
				this.drawTriangle(x,y,ctx, false, options, "u");
				break;
			case 'filledTriangleUp':
				options = {fill:true, isarc:false, strokeStyle:this.color, fillStyle:this.color, lineWidth:this.lineWidth, closePath:true};
				this.drawTriangle(x,y,ctx, true, options, "u");
				break;
			case 'triangleDown':
				this.drawTriangle(x,y,ctx, false, options, "d");
				break;
			case 'filledTriangleDown':
				this.drawTriangle(x,y,ctx, true, options, "d");
				break;	
			case 'rectHorizontal':
				this.drawRectangle(x,y,ctx, false, options, "h");
				break;
			case 'filledRectHorizontal':
				this.drawRectangle(x,y,ctx, true, options, "h");
				break;	
			case 'rectVertical':
				this.drawRectangle(x,y,ctx, false, options, "v");
				break;
			case 'filledRectVertical':
				this.drawRectangle(x,y,ctx, true, options, "v");
				break;	
			case 'heart':
				this.drawHeart(x,y,ctx, false, options);
				break;
			case 'filledHeart':
				this.drawHeart(x,y,ctx, true, options);
				break;
			case 'circle':
				this.drawCircle(x,y,ctx, false, options);
				break;
			case 'filledCircle':
				this.drawCircle(x,y,ctx, true, options);
				break;
			case 'square':
				this.drawSquare(x,y,ctx, false, options);
				break;
			case 'filledSquare':
				this.drawSquare(x,y,ctx, true, options);
				break;
			case 'x':
				this.drawX(x,y,ctx, true, options);
				break;
			case 'plus':
				this.drawPlus(x,y,ctx, true, options);
				break;
			case 'dash':
				this.drawDash(x,y,ctx, true, options);
				break;
			default:
				this.drawDiamond(x,y,ctx, false, options);
				break;
        }
    };
})(jQuery);

/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.0b2_r1012
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can
 * choose the license that best suits your project and use it accordingly.
 *
 * Although not required, the author would appreciate an email letting him
 * know of any substantial use of jqPlot.  You can reach the author at:
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 *
 */
(function($) {

	/**
	 * Class: $.jqplot.Cursor
	 * Plugin class representing the cursor as displayed on the plot.
	 */
	$.jqplot.Cursor = function(options) {
		// Group: Properties
		//
		// prop: style
		// CSS spec for cursor style
		this.style = 'crosshair';
		this.previousCursor = 'auto';
		// units to snap to when zooming
		// ie. "minutes" will set zoomed min/max minutes, seconds, milliseconds to zero
		this.snapZoomTo = null;
		// prop: show
		// wether to show the cursor or not.
		this.show = $.jqplot.config.enablePlugins;
		// prop: performOnZoom
		// function to perform on zoom
		this.performOnZoom = function(plot) {
		};

		// prop: performAfterZoom
		// function to perform after zooming complete
		this.performAfterZoom = function(plot) {
		};

		// prop: showTooltip
		// show a cursor position tooltip.  Location of the tooltip
		// will be controlled by followMouse and tooltipLocation.
		this.showTooltip = true;
		// prop: followMouse
		// Tooltip follows the mouse, it is not at a fixed location.
		// Tooltip will show on the grid at the location given by
		// tooltipLocation, offset from the grid edge by tooltipOffset.
		this.followMouse = false;
		// prop: tooltipLocation
		// Where to position tooltip.  If followMouse is true, this is
		// relative to the cursor, otherwise, it is relative to the grid.
		// One of 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
		this.tooltipLocation = 'se';
		// prop: tooltipOffset
		// Pixel offset of tooltip from the grid boudaries or cursor center.
		this.tooltipOffset = 6;
		// prop: showTooltipGridPosition
		// show the grid pixel coordinates of the mouse.
		this.showTooltipGridPosition = false;
		// prop: showTooltipUnitPosition
		// show the unit (data) coordinates of the mouse.
		this.showTooltipUnitPosition = true;
		// prop: showTooltipDataPosition
		// Used with showVerticalLine to show intersecting data points in the tooltip.
		this.showTooltipDataPosition = false;
		// prop: tooltipFormatString
		// sprintf format string for the tooltip.
		// Uses Ash Searle's javascript sprintf implementation
		// found here: http://hexmen.com/blog/2007/03/printf-sprintf/
		// See http://perldoc.perl.org/functions/sprintf.html for reference
		// Note, if showTooltipDataPosition is true, the default tooltipFormatString
		// will be set to the cursorLegendFormatString, not the default given here.
		this.tooltipFormatString = '%.4P, %.4P';
		// prop: useAxesFormatters
		// Use the x and y axes formatters to format the text in the tooltip.
		this.useAxesFormatters = true;
		// prop: tooltipAxisGroups
		// Show position for the specified axes.
		// This is an array like [['xaxis', 'yaxis'], ['xaxis', 'y2axis']]
		// Default is to compute automatically for all visible axes.
		this.tooltipAxisGroups = [];
		// prop: zoom
		// Enable plot zooming.
		this.zoom = false;
		// zoomProxy and zoomTarget properties are not directly set by user.
		// They Will be set through call to zoomProxy method.
		this.zoomProxy = false;
		//if zoom proxy set up, this will zoom and zoom out on reset on the controller graph
		this.zoomOnController = true;
		this.zoomTarget = false;
		// prop: looseZoom
		// Will expand zoom range to provide more rounded tick values.
		// Works only with linear, log and date axes.
		this.looseZoom = true;
		// prop: clickReset
		// Will reset plot zoom if single click on plot without drag.
		this.clickReset = false;
		// prop: dblClickReset
		// Will reset plot zoom if double click on plot without drag.
		this.dblClickReset = true;
		// prop: showVerticalLine
		// draw a vertical line across the plot which follows the cursor.
		// When the line is near a data point, a special legend and/or tooltip can
		// be updated with the data values.
		this.showVerticalLine = false;
		// prop: showHorizontalLine
		// draw a horizontal line across the plot which follows the cursor.
		this.showHorizontalLine = false;
		// prop: constrainZoomTo
		// 'none', 'x' or 'y'
		this.constrainZoomTo = 'none';
		// // prop: autoscaleConstraint
		// // when a constrained axis is specified, true will
		// // auatoscale the adjacent axis.
		// this.autoscaleConstraint = true;
		this.shapeRenderer = new $.jqplot.ShapeRenderer();
		this._zoom = {
			start: [],
			end: [],
			started: false,
			zooming: false,
			isZoomed: false,
			axes: {
				start: {},
				end: {}
			},
			gridpos: {},
			datapos: {}
		};
		this._tooltipElem;
		this.zoomCanvas;
		this.cursorCanvas;
		// prop: intersectionThreshold
		// pixel distance from data point or marker to consider cursor lines intersecting with point.
		// If data point markers are not shown, this should be >= 1 or will often miss point intersections.
		this.intersectionThreshold = 2;
		// prop: showCursorLegend
		// Replace the plot legend with an enhanced legend displaying intersection information.
		this.showCursorLegend = false;
		// prop: cursorLegendFormatString
		// Format string used in the cursor legend.  If showTooltipDataPosition is true,
		// this will also be the default format string used by tooltipFormatString.
		this.cursorLegendFormatString = $.jqplot.Cursor.cursorLegendFormatString;
		// whether the cursor is over the grid or not.
		this._oldHandlers = {
			onselectstart: null,
			ondrag: null,
			onmousedown: null
		};
		// prop: constrainOutsideZoom
		// True to limit actual zoom area to edges of grid, even when zooming
		// outside of plot area.  That is, can't zoom out by mousing outside plot.
		this.constrainOutsideZoom = true;
		// prop: showTooltipOutsideZoom
		// True will keep updating the tooltip when zooming of the grid.
		this.showTooltipOutsideZoom = false;
		// true if mouse is over grid, false if not.
		this.onGrid = false;
		$.extend(true, this, options);
	};

	$.jqplot.Cursor.cursorLegendFormatString = '%s x:%s, y:%s';

	// called with scope of plot
	$.jqplot.Cursor.init = function(target, data, opts) {
		// add a cursor attribute to the plot
		var options = opts || {};
		this.plugins.cursor = new $.jqplot.Cursor(options.cursor);
		var c = this.plugins.cursor;
		if(c.show) {
			$.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleMouseEnter]);
			$.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleMouseLeave]);
			$.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMouseMove]);

			if(c.showCursorLegend) {
				opts.legend = opts.legend || {};
				opts.legend.renderer = $.jqplot.CursorLegendRenderer;
				opts.legend.formatString = this.plugins.cursor.cursorLegendFormatString;
				opts.legend.show = true;
			}

			if(c.zoom) {
				$.jqplot.eventListenerHooks.push(['jqplotMouseDown', handleMouseDown]);

				if(c.clickReset) {
					$.jqplot.eventListenerHooks.push(['jqplotClick', handleClick]);
				}

				if(c.dblClickReset) {
					$.jqplot.eventListenerHooks.push(['jqplotDblClick', handleDblClick]);
				}
			}

			this.resetZoom = function() {
				var axes = this.axes;

				if(!c.zoomProxy) {
					var axesLen = axes.length;
					for(var ax = 0, y = axesLen; ax < y; ax++) {
						axes[ax].reset();
						axes[ax]._ticks = [];
						// fake out tick creation algorithm to make sure original auto
						// computed format string is used if _overrideFormatString is true
						if(c._zoom.axes[ax] !== undefined) {
							axes[ax]._autoFormatString = c._zoom.axes[ax].tickFormatString;
						}
					}

					this.redraw();
				}
				else {
					var ctx = this.plugins.cursor.zoomCanvas._ctx;
					ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
					ctx = null;
				}
				this.plugins.cursor._zoom.isZoomed = false;
				this.target.trigger('jqplotResetZoom', [this, this.plugins.cursor]);
			};

			if(c.showTooltipDataPosition) {
				c.showTooltipUnitPosition = false;
				c.showTooltipGridPosition = false;
				if(options.cursor.tooltipFormatString == undefined) {
					c.tooltipFormatString = $.jqplot.Cursor.cursorLegendFormatString;
				}
			}
		}
	};

	// called with context of plot
	$.jqplot.Cursor.postDraw = function() {
		var c = this.plugins.cursor;

		// Memory Leaks patch
		if(c.zoomCanvas) {
			c.zoomCanvas.resetCanvas();
			c.zoomCanvas = null;
		}

		if(c.cursorCanvas) {
			c.cursorCanvas.resetCanvas();
			c.cursorCanvas = null;
		}

		if(c._tooltipElem) {
			c._tooltipElem.emptyForce();
			c._tooltipElem = null;
		}

		//if (c.zoom) {
		c.zoomCanvas = new $.jqplot.GenericCanvas();
		this.eventCanvas._elem.before(c.zoomCanvas.createElement(this._gridPadding, 'jqplot-zoom-canvas', this._plotDimensions, this));
		c.zoomCanvas.setContext();
		//}

		var elem = document.createElement('div');
		c._tooltipElem = $(elem);
		elem = null;
		c._tooltipElem.addClass('jqplot-cursor-tooltip');
		c._tooltipElem.css({
			position: 'absolute',
			display: 'none'
		});

		if(c.zoomCanvas) {
			c.zoomCanvas._elem.before(c._tooltipElem);
		}

		else {
			this.eventCanvas._elem.before(c._tooltipElem);
		}

		if(c.showVerticalLine || c.showHorizontalLine) {
			c.cursorCanvas = new $.jqplot.GenericCanvas();
			this.eventCanvas._elem.before(c.cursorCanvas.createElement(this._gridPadding, 'jqplot-cursor-canvas', this._plotDimensions, this));
			c.cursorCanvas.setContext();
		}

		// if we are showing the positions in unit coordinates, and no axes groups
		// were specified, create a default set.
		if(c.showTooltipUnitPosition) {
			if(c.tooltipAxisGroups.length === 0) {
				var series = this.series;
				var s;
				var temp = [];
				for(var i = 0; i < series.length; i++) {
					s = series[i];
					var ax = s.xaxis + ',' + s.yaxis;
					if($.inArray(ax, temp) == -1) {
						temp.push(ax);
					}
				}
				for(var i = 0; i < temp.length; i++) {
					c.tooltipAxisGroups.push(temp[i].split(','));
				}
			}
		}
	};

	// Group: methods
	//
	// method: $.jqplot.Cursor.zoomProxy
	// links targetPlot to controllerPlot so that plot zooming of
	// targetPlot will be controlled by zooming on the controllerPlot.
	// controllerPlot will not actually zoom, but acts as an
	// overview plot.  Note, the zoom options must be set to true for
	// zoomProxy to work.
	$.jqplot.Cursor.zoomProxy = function(targetPlot, controllerPlot, zoomOnController) {
		var tc = targetPlot.plugins.cursor;
		var cc = controllerPlot.plugins.cursor;
		tc.zoomTarget = true;
		tc.zoom = true;
		tc.style = 'auto';
		tc.dblClickReset = false;
		cc.zoom = true;
		cc.zoomProxy = true;

		controllerPlot.target.bind('jqplotZoom', plotZoom);
		controllerPlot.target.bind('jqplotResetZoom', plotReset);

		function plotZoom(ev, gridpos, datapos, plot, cursor) {
			tc.doZoom(gridpos, datapos, targetPlot, cursor);
		}

		function plotReset(ev, plot, cursor) {
			var cax = cursor._zoom.axes;
			var axes = targetPlot.axes;
			var axesLen = axes.length;

			for(var ax in axes) {
				axes[ax]._ticks = [];
				axes[ax].min = cax[ax].min;
				axes[ax].max = cax[ax].max;
				axes[ax].autoscale = cax[ax].autoscale;
				axes[ax].numberTicks = cax[ax].numberTicks;
				axes[ax].tickInterval = cax[ax].tickInterval;
				// for date axes
				axes[ax].specialFormat = cax[ax].specialFormat;
				axes[ax].specialFormatFlag = cax[ax].specialFormatFlag;
				axes[ax].useDST = cax[ax].useDST;
				axes[ax].daTickInterval = cax[ax].daTickInterval;
				//if minX, maxX, minY, maxY set, then update min and max respectively to their axis for absolute min/max of "show" series
				var newMin = Number.POSITIVE_INFINITY, newMax = Number.NEGATIVE_INFINITY;
				var targetPlotLen = targetPlot.series.length;

				for(var i = 0; i < targetPlotLen; i++) {
					var sObj = targetPlot.series[i];
					var dStr = ax.match(/^[xy]/);
					if(sObj.show && sObj[dStr + "axis"] == ax) {
						var minStr = (dStr == "x") ? "minX" : "minY";
						var maxStr = (dStr == "x") ? "maxX" : "maxY";
						if(sObj[minStr] && sObj[minStr] < newMin) {
							newMin = sObj[minStr];
						}
						if(sObj[maxStr] && sObj[maxStr] > newMax) {
							newMax = sObj[maxStr];
						}
					}
				}
				if(newMin != Number.POSITIVE_INFINITY) {
					axes[ax].min = (newMin > 0 && (newMin * 0.9) < 0) ? 0 : newMin * 0.9;
					axes[ax].numberTicks = null;
					axes[ax].tickInterval = null;
					axes[ax].daTickInterval = null;
				}
				if(newMax != Number.NEGATIVE_INFINITY) {
					axes[ax].max = newMax * 1.1;
					axes[ax].numberTicks = null;
					axes[ax].tickInterval = null;
					axes[ax].daTickInterval = null;
				}
			}
			targetPlot.redraw();
			cursor._zoom.isZoomed = false;
			//targetPlot.resetZoom();
		}

	};

	$.jqplot.Cursor.prototype.resetZoom = function(plot, cursor) {
		var axes = plot.axes;
		var cax = cursor._zoom.axes;
		if((!plot.plugins.cursor.zoomProxy || plot.plugins.cursor.zoomOnController) && cursor._zoom.isZoomed) {
			for(var ax in axes) {
				axes[ax]._ticks = [];
				axes[ax].min = cax[ax].min;
				axes[ax].max = cax[ax].max;

				axes[ax].autoscale = cax[ax].autoscale;
				axes[ax].numberTicks = cax[ax].numberTicks;
				axes[ax].tickInterval = cax[ax].tickInterval;
				// for date axes
				axes[ax].daTickInterval = cax[ax].daTickInterval;
				axes[ax].specialFormat = cax[ax].specialFormat;
				axes[ax].specialFormatFlag = cax[ax].specialFormatFlag;
				axes[ax].useDST = cax[ax].useDST;
			}
			plot.redraw();
			cursor._zoom.isZoomed = false;
		}
		else {
			var ctx = cursor.zoomCanvas._ctx;
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx = null;
		}
		plot.target.trigger('jqplotResetZoom', [plot, cursor]);
	};

	$.jqplot.Cursor.resetZoom = function(plot) {

		plot.resetZoom();
	};

	$.jqplot.Cursor.prototype.doZoom = function(gridpos, datapos, plot, cursor) {
		this.performOnZoom(plot);
		var c = cursor;
		var axes = plot.axes;
		var zaxes = c._zoom.axes;
		var start = zaxes.start;
		var end = zaxes.end;
		var min, max, dp, span, newmin, newmax, curax, _numberTicks, ret;
		var ctx = plot.plugins.cursor.zoomCanvas._ctx;
		var Date = new $.jsDate();
		// don't zoom if zoom area is too small (in pixels)
		if((c.constrainZoomTo == 'none' && Math.abs(gridpos.x - c._zoom.start[0]) > 6 && Math.abs(gridpos.y - c._zoom.start[1]) > 6) || (c.constrainZoomTo == 'x' && Math.abs(gridpos.x - c._zoom.start[0]) > 6) || (c.constrainZoomTo == 'y' && Math.abs(gridpos.y - c._zoom.start[1]) > 6)) {
			if(!plot.plugins.cursor.zoomProxy || plot.plugins.cursor.zoomOnController) {
				for(var ax in datapos) {
					// make a copy of the original axes to revert back.
					if(c._zoom.axes[ax] == undefined) {
						c._zoom.axes[ax] = {};
						c._zoom.axes[ax].numberTicks = axes[ax].numberTicks;
						c._zoom.axes[ax].tickInterval = axes[ax].tickInterval;
						c._zoom.axes[ax].autoscale = axes[ax].autoscale;
						// for date axes...
						c._zoom.axes[ax].daTickInterval = axes[ax].daTickInterval;
						c._zoom.axes[ax].specialFormat = axes[ax].specialFormat;
						c._zoom.axes[ax].specialFormatFlag = axes[ax].specialFormatFlag;
						c._zoom.axes[ax].useDST = axes[ax].useDST;
						c._zoom.axes[ax].min = axes[ax].min;
						var curmin = new $.jsDate(axes[ax].min);
						c._zoom.axes[ax].max = axes[ax].max;
						var curmax = new $.jsDate(axes[ax].max);
						c._zoom.axes[ax].tickFormatString = (axes[ax].tickOptions != null) ? axes[ax].tickOptions.formatString : '';
					}

					if((c.constrainZoomTo == 'none') || (c.constrainZoomTo == 'x' && ax.charAt(0) == 'x') || (c.constrainZoomTo == 'y' && ax.charAt(0) == 'y')) {
						dp = datapos[ax];
						if(dp != null) {
							if(dp > start[ax]) {
								if(c.snapZoomTo != null) {
									var minDate = $.jsDate.createDate(start[ax]);
									newmin = round(minDate, c.snapZoomTo, 'down');
									var maxDate = $.jsDate.createDate(dp);
									newmax = round(maxDate, c.snapZoomTo, 'up');
								}
								else {
									newmin = start[ax];
									newmax = dp;
								}
							}
							else {
								span = start[ax] - dp;
								if(c.snapZoomTo != null) {
									var minDate = $.jsDate.createDate(start[ax]);
									newmin = round(minDate, c.snapZoomTo, 'down');
									var maxDate = $.jsDate.createDate(dp);
									newmax = round(maxDate, c.snapZoomTo, 'up');
								}
								else {
									newmin = start[ax];
									newmax = dp;
								}
							}
							curax = axes[ax];
							_numberTicks = null;

							// if aligning this axis, use number of ticks from previous axis.
							// Do I need to reset somehow if alignTicks is changed and then graph is replotted??
							if(curax.alignTicks) {
								if(curax.name === 'x2axis' && plot.axes.xaxis.show) {
									_numberTicks = plot.axes.xaxis.numberTicks;
								}
								else if(curax.name.charAt(0) === 'y' && curax.name !== 'yaxis' && curax.name !== 'yMidAxis' && plot.axes.yaxis.show) {
									_numberTicks = plot.axes.yaxis.numberTicks;
								}
							}
							if(this.looseZoom && (axes[ax].renderer.constructor === $.jqplot.LinearAxisRenderer || axes[ax].renderer.constructor === $.jqplot.LogAxisRenderer )) { //} || axes[ax].renderer.constructor === $.jqplot.DateAxisRenderer)) {

								ret = $.jqplot.LinearTickGenerator(newmin, newmax, curax._scalefact, _numberTicks);

								// if new minimum is less than "true" minimum of axis display, adjust it
								if(axes[ax].tickInset && ret[0] < axes[ax].min + axes[ax].tickInset * axes[ax].tickInterval) {
									ret[0] += ret[4];
									ret[2] -= 1;
								}

								// if new maximum is greater than "true" max of axis display, adjust it
								if(axes[ax].tickInset && ret[1] > axes[ax].max - axes[ax].tickInset * axes[ax].tickInterval) {
									ret[1] -= ret[4];
									ret[2] -= 1;
								}

								// for log axes, don't fall below current minimum, this will look bad and can't have 0 in range anyway.
								if(axes[ax].renderer.constructor === $.jqplot.LogAxisRenderer && ret[0] < axes[ax].min) {
									// remove a tick and shift min up
									ret[0] += ret[4];
									ret[2] -= 1;
								}
								axes[ax].min = ret[0];
								axes[ax].max = ret[1];
								axes[ax]._autoFormatString = ret[3];
								axes[ax].numberTicks = ret[2];
								axes[ax].tickInterval = ret[4];
								// for date axes...
								axes[ax].daTickInterval = [ret[4] / 1000, 'seconds'];
							}
							else {
								axes[ax].min = newmin;
								var rmin = new $.jsDate(newmin).getTime();
								axes[ax].max = newmax;
								var rmax = new $.jsDate(newmax).getTime();
								var nc = new $.jsDate(rmax).diff(rmin, c.snapZoomTo, true);
								var tickIntervalStr = (Math.ceil(nc / axes[ax].numberTicks)) + " minutes";
								axes[ax].tickInterval = tickIntervalStr;
								axes[ax].numberTicks = null;
								// for date axes...
								axes[ax].daTickInterval = tickIntervalStr;
							}

							axes[ax]._ticks = [];
						}

						if(axes[ax].autoscaleOnZoom != null) {
							axes[ax].autoscale = this.autoscaleOnZoom;
						}
					}

					// if ((c.constrainZoomTo == 'x' && ax.charAt(0) == 'y' && c.autoscaleConstraint) || (c.constrainZoomTo == 'y' && ax.charAt(0) == 'x' && c.autoscaleConstraint)) {
					//     dp = datapos[ax];
					//     if (dp != null) {
					//         axes[ax].max == null;
					//         axes[ax].min = null;
					//     }
					// }
				}
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				plot.redraw();
				c._zoom.isZoomed = true;
				ctx = null;
			}
			this.performAfterZoom(plot);
			plot.target.trigger('jqplotZoom', [gridpos, datapos, plot, cursor]);
		}
	};

	$.jqplot.preInitHooks.push($.jqplot.Cursor.init);
	$.jqplot.postDrawHooks.push($.jqplot.Cursor.postDraw);

	/*
	 This is used to set all unrelated time units to 0.
	 unit entered will be set to zero as well as all other units smaller (only works for seconds, minutes, or hours)
	 */
	function round(dateObj, unit, option) {
		//unit = "seconds";
		if(unit != null) {
			switch (unit.toLowerCase()) {
				case "seconds":
					dateObj.setSeconds((option == "down") ? 0 : 60);
					dateObj.setMilliseconds(0);
					break;
				case "minutes":
					dateObj.setMinutes((option == "down") ? 0 : 60);
					dateObj.setSeconds(0);
					dateObj.setMilliseconds(0);
					break;
				case "hours":
					dateObj.setHours((option == "down") ? 0 : 24);
					dateObj.setMinutes(0);
					dateObj.setSeconds(0);
					dateObj.setMilliseconds(0);
					break;
				default:
					break;
			}
		}
		return dateObj;
	};

	function updateTooltip(gridpos, datapos, plot) {
		var c = plot.plugins.cursor;
		var s = '';
		var addbr = false;
		if(c.showTooltipGridPosition) {
			s = gridpos.x + ', ' + gridpos.y;
			addbr = true;
		}
		if(c.showTooltipUnitPosition) {
			var g;
			for(var i = 0; i < c.tooltipAxisGroups.length; i++) {
				g = c.tooltipAxisGroups[i];
				if(addbr) {
					s += '<br />';
				}
				if(c.useAxesFormatters) {
					var xf = plot.axes[g[0]]._ticks[0].formatter;
					var yf = plot.axes[g[1]]._ticks[0].formatter;
					var xfstr = plot.axes[g[0]]._ticks[0].formatString;
					var yfstr = plot.axes[g[1]]._ticks[0].formatString;
					s += xf(xfstr, datapos[g[0]]) + ', ' + yf(yfstr, datapos[g[1]]);
				}
				else {
					s += $.jqplot.sprintf(c.tooltipFormatString, datapos[g[0]], datapos[g[1]]);
				}
				addbr = true;
			}
		}

		if(c.showTooltipDataPosition) {
			var series = plot.series;
			var ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);
			var addbr = false;

			for(var i = 0; i < series.length; i++) {
				if(series[i].show) {
					var idx = series[i].index;
					var label = series[i].label.toString();
					var cellid = $.inArray(idx, ret.indices);
					var sx = undefined;
					var sy = undefined;
					if(cellid != -1) {
						var data = ret.data[cellid].data;
						if(c.useAxesFormatters) {
							var xf = series[i]._xaxis._ticks[0].formatter;
							var yf = series[i]._yaxis._ticks[0].formatter;
							var xfstr = series[i]._xaxis._ticks[0].formatString;
							var yfstr = series[i]._yaxis._ticks[0].formatString;
							sx = xf(xfstr, data[0]);
							sy = yf(yfstr, data[1]);
						}
						else {
							sx = data[0];
							sy = data[1];
						}
						if(addbr) {
							s += '<br />';
						}
						s += $.jqplot.sprintf(c.tooltipFormatString, label, sx, sy);
						addbr = true;
					}
				}
			}

		}
		c._tooltipElem.html(s);
	}

	function moveLine(gridpos, plot) {
		var c = plot.plugins.cursor;
		var ctx = c.cursorCanvas._ctx;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		if(c.showVerticalLine) {
			c.shapeRenderer.draw(ctx, [[gridpos.x, 0], [gridpos.x, ctx.canvas.height]]);
		}
		if(c.showHorizontalLine) {
			c.shapeRenderer.draw(ctx, [[0, gridpos.y], [ctx.canvas.width, gridpos.y]]);
		}
		var ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);
		if(c.showCursorLegend) {
			var cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');
			for(var i = 0; i < cells.length; i++) {
				var idx = $(cells[i]).data('seriesIndex');
				var series = plot.series[idx];
				var label = series.label.toString();
				var cellid = $.inArray(idx, ret.indices);
				var sx = undefined;
				var sy = undefined;
				if(cellid != -1) {
					var data = ret.data[cellid].data;
					if(c.useAxesFormatters) {
						var xf = series._xaxis._ticks[0].formatter;
						var yf = series._yaxis._ticks[0].formatter;
						var xfstr = series._xaxis._ticks[0].formatString;
						var yfstr = series._yaxis._ticks[0].formatString;
						sx = xf(xfstr, data[0]);
						sy = yf(yfstr, data[1]);
					}
					else {
						sx = data[0];
						sy = data[1];
					}
				}
				if(plot.legend.escapeHtml) {
					$(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
				}
				else {
					$(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
				}
			}
		}
		ctx = null;
	}

	function getIntersectingPoints(plot, x, y) {
		var ret = {
			indices: [],
			data: []
		};
		var s, i, d0, d, j, r, p;
		var threshold;
		var c = plot.plugins.cursor;
		for(var i = 0; i < plot.series.length; i++) {
			s = plot.series[i];
			r = s.renderer;
			if(s.show) {
				threshold = c.intersectionThreshold;
				if(s.showMarker) {
					threshold += s.markerRenderer.size / 2;
				}
				for(var j = 0; j < s.gridData.length; j++) {
					p = s.gridData[j];
					// check vertical line
					if(c.showVerticalLine) {
						if(Math.abs( x - p[0]) <= threshold) {
							ret.indices.push(i);
							ret.data.push({
								seriesIndex: i,
								pointIndex: j,
								gridData: p,
								data: s.data[j]
							});
						}
					}
				}
			}
		}
		return ret;
	}

	function moveTooltip(gridpos, plot) {
		var c = plot.plugins.cursor;
		var elem = c._tooltipElem;
		switch (c.tooltipLocation) {
			case 'nw':
				var x = gridpos.x + plot._gridPadding.left -  elem.outerWidth(true) - c.tooltipOffset;
				var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset -  elem.outerHeight(true);
				break;
			case 'n':
				var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) / 2;
				var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset -  elem.outerHeight(true);
				break;
			case 'ne':
				var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
				var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset -  elem.outerHeight(true);
				break;
			case 'e':
				var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
				var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true) / 2;
				break;
			case 'se':
				var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
				var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
				break;
			case 's':
				var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) / 2;
				var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
				break;
			case 'sw':
				var x = gridpos.x + plot._gridPadding.left -  elem.outerWidth(true) - c.tooltipOffset;
				var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
				break;
			case 'w':
				var x = gridpos.x + plot._gridPadding.left -  elem.outerWidth(true) - c.tooltipOffset;
				var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true) / 2;
				break;
			default:
				var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
				var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
				break;
		}

		elem.css('left', x);
		elem.css('top', y);
		elem = null;
	}

	function positionTooltip(plot) {
		// fake a grid for positioning
		var grid = plot._gridPadding;
		var c = plot.plugins.cursor;
		var elem = c._tooltipElem;
		switch (c.tooltipLocation) {
			case 'nw':
				var a = grid.left + c.tooltipOffset;
				var b = grid.top + c.tooltipOffset;
				elem.css('left', a);
				elem.css('top', b);
				break;
			case 'n':
				var a = (grid.left + (plot._plotDimensions.width - grid.right)) / 2 - elem.outerWidth(true) / 2;
				var b = grid.top + c.tooltipOffset;
				elem.css('left', a);
				elem.css('top', b);
				break;
			case 'ne':
				var a = grid.right + c.tooltipOffset;
				var b = grid.top + c.tooltipOffset;
				elem.css({
					right: a,
					top: b
				});
				break;
			case 'e':
				var a = grid.right + c.tooltipOffset;
				var b = (grid.top + (plot._plotDimensions.height - grid.bottom)) / 2 - elem.outerHeight(true) / 2;
				elem.css({
					right: a,
					top: b
				});
				break;
			case 'se':
				var a = grid.right + c.tooltipOffset;
				var b = grid.bottom + c.tooltipOffset;
				elem.css({
					right: a,
					bottom: b
				});
				break;
			case 's':
				var a = (grid.left + (plot._plotDimensions.width - grid.right)) / 2 - elem.outerWidth(true) / 2;
				var b = grid.bottom + c.tooltipOffset;
				elem.css({
					left: a,
					bottom: b
				});
				break;
			case 'sw':
				var a = grid.left + c.tooltipOffset;
				var b = grid.bottom + c.tooltipOffset;
				elem.css({
					left: a,
					bottom: b
				});
				break;
			case 'w':
				var a = grid.left + c.tooltipOffset;
				var b = (grid.top + (plot._plotDimensions.height - grid.bottom)) / 2 - elem.outerHeight(true) / 2;
				elem.css({
					left: a,
					top: b
				});
				break;
			default:
				// same as 'se'
				var a = grid.right - c.tooltipOffset;
				var b = grid.bottom + c.tooltipOffset;
				elem.css({
					right: a,
					bottom: b
				});
				break;
		}
		elem = null;
	}

	function handleClick(ev, gridpos, datapos, neighbor, plot) {
		ev.preventDefault();
		ev.stopImmediatePropagation();
		var c = plot.plugins.cursor;
		if(c.clickReset) {
			c.resetZoom(plot, c);
		}
		var sel = window.getSelection;
		if(document.selection && document.selection.empty) {
			document.selection.empty();
		}
		else if(sel && !sel().isCollapsed) {
			sel().collapse();
		}
		return false;
	}

	function handleDblClick(ev, gridpos, datapos, neighbor, plot) {
		ev.preventDefault();
		ev.stopImmediatePropagation();
		var c = plot.plugins.cursor;
		if(c.dblClickReset) {
			c.resetZoom(plot, c);
		}
		var sel = window.getSelection;
		if(document.selection && document.selection.empty) {
			document.selection.empty();
		}
		else if(sel && !sel().isCollapsed) {
			sel().collapse();
		}
		return false;
	}

	function handleMouseLeave(ev, gridpos, datapos, neighbor, plot) {
		var c = plot.plugins.cursor;
		c.onGrid = false;
		if(c.show) {
			$(ev.target).css('cursor', c.previousCursor);
			if(c.showTooltip && !(c._zoom.zooming && c.showTooltipOutsideZoom && !c.constrainOutsideZoom)) {
				c._tooltipElem.hide();
			}
			if(c.zoom) {
				c._zoom.gridpos = gridpos;
				c._zoom.datapos = datapos;
			}
			if(c.showVerticalLine || c.showHorizontalLine) {
				var ctx = c.cursorCanvas._ctx;
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx = null;
			}
			if(c.showCursorLegend) {
				var cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');
				for(var i = 0; i < cells.length; i++) {
					var idx = $(cells[i]).data('seriesIndex');
					var series = plot.series[idx];
					var label = series.label.toString();
					if(plot.legend.escapeHtml) {
						$(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString, label, undefined, undefined));
					}
					else {
						$(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString, label, undefined, undefined));
					}

				}
			}
		}
	}

	function handleMouseEnter(ev, gridpos, datapos, neighbor, plot) {
		var c = plot.plugins.cursor;
		c.onGrid = true;
		if(c.show) {
			c.previousCursor = ev.target.style.cursor;
			ev.target.style.cursor = c.style;
			if(c.showTooltip) {
				updateTooltip(gridpos, datapos, plot);
				if(c.followMouse) {
					moveTooltip(gridpos, plot);
				}
				else {
					positionTooltip(plot);
				}
				c._tooltipElem.show();
			}
			if(c.showVerticalLine || c.showHorizontalLine) {
				moveLine(gridpos, plot);
			}
		}

	}

	function handleMouseMove(ev, gridpos, datapos, neighbor, plot) {
		var c = plot.plugins.cursor;
		if(c.show) {
			if(c.showTooltip) {
				updateTooltip(gridpos, datapos, plot);
				if(c.followMouse) {
					moveTooltip(gridpos, plot);
				}
			}
			if(c.showVerticalLine || c.showHorizontalLine) {
				moveLine(gridpos, plot);
			}
		}
	}

	function getEventPosition(ev) {
		var plot = ev.data.plot;
		var go = plot.eventCanvas._elem.offset();
		var gridPos = {
			x: ev.pageX - go.left,
			y: ev.pageY - go.top
		};
		//////
		// TO DO: handle yMidAxis
		//////
		var dataPos = {
			xaxis: null,
			yaxis: null,
			x2axis: null,
			y2axis: null,
			y3axis: null,
			y4axis: null,
			y5axis: null,
			y6axis: null,
			y7axis: null,
			y8axis: null,
			y9axis: null,
			yMidAxis: null
		};
		var an = ['xaxis', 'yaxis', 'x2axis', 'y2axis', 'y3axis', 'y4axis', 'y5axis', 'y6axis', 'y7axis', 'y8axis', 'y9axis', 'yMidAxis'];
		var ax = plot.axes;
		var n, axis;
		for( n = 11; n > 0; n--) {
			axis = an[ n - 1];
			if(ax[axis].show) {
				dataPos[axis] = ax[axis].series_p2u(gridPos[axis.charAt(0)]);
			}
		}

		return {
			offsets: go,
			gridPos: gridPos,
			dataPos: dataPos
		};
	}

	function handleZoomMove(ev) {
		var plot = ev.data.plot;
		var c = plot.plugins.cursor;
		// don't do anything if not on grid.
		if(c.show && c.zoom && c._zoom.started && !c.zoomTarget) {
			var ctx = c.zoomCanvas._ctx;
			var positions = getEventPosition(ev);
			var gridpos = positions.gridPos;
			var datapos = positions.dataPos;
			c._zoom.gridpos = gridpos;
			c._zoom.datapos = datapos;
			c._zoom.zooming = true;
			var xpos = gridpos.x;
			var ypos = gridpos.y;
			var height = ctx.canvas.height;
			var width = ctx.canvas.width;
			if(c.showTooltip && !c.onGrid && c.showTooltipOutsideZoom) {
				updateTooltip(gridpos, datapos, plot);
				if(c.followMouse) {
					moveTooltip(gridpos, plot);
				}
			}
			if(c.constrainZoomTo == 'x') {
				c._zoom.end = [xpos, height];
			}
			else if(c.constrainZoomTo == 'y') {
				c._zoom.end = [width, ypos];
			}
			else {
				c._zoom.end = [xpos, ypos];
			}
			var sel = window.getSelection;
			if(document.selection && document.selection.empty) {
				document.selection.empty();
			}
			else if(sel && !sel().isCollapsed) {
				sel().collapse();
			}
			drawZoomBox.call(c);
			ctx = null;
		}
	}

	function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
		var c = plot.plugins.cursor;
		$(document).one('mouseup.jqplot_cursor', {
			plot: plot
		}, handleMouseUp);
		var axes = plot.axes;
		if(document.onselectstart != undefined) {
			c._oldHandlers.onselectstart = document.onselectstart;
			document.onselectstart = function() {
				return false;
			};

		}
		if(document.ondrag != undefined) {
			c._oldHandlers.ondrag = document.ondrag;
			document.ondrag = function() {
				return false;
			};

		}
		if(document.onmousedown != undefined) {
			c._oldHandlers.onmousedown = document.onmousedown;
			document.onmousedown = function() {
				return false;
			};

		}
		if(c.zoom) {
			if(!c.zoomProxy) {
				var ctx = c.zoomCanvas._ctx;
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx = null;
			}
			if(c.constrainZoomTo == 'x') {
				c._zoom.start = [gridpos.x, 0];
			}
			else if(c.constrainZoomTo == 'y') {
				c._zoom.start = [0, gridpos.y];
			}
			else {
				c._zoom.start = [gridpos.x, gridpos.y];
			}
			c._zoom.started = true;
			for(var ax in datapos) {
				// get zoom starting position.
				c._zoom.axes.start[ax] = datapos[ax];
			}
			$(document).bind('mousemove.jqplotCursor', {
				plot: plot
			}, handleZoomMove);
		}
	}

	function handleMouseUp(ev) {
		var plot = ev.data.plot;
		var c = plot.plugins.cursor;
		if(c.zoom && c._zoom.zooming && !c.zoomTarget) {
			var xpos = c._zoom.gridpos.x;
			var ypos = c._zoom.gridpos.y;
			var datapos = c._zoom.datapos;
			var height = c.zoomCanvas._ctx.canvas.height;
			var width = c.zoomCanvas._ctx.canvas.width;
			var axes = plot.axes;

			if(c.constrainOutsideZoom && !c.onGrid) {
				if(xpos < 0) {
					xpos = 0;
				}
				else if(xpos > width) {
					xpos = width;
				}
				if(ypos < 0) {
					ypos = 0;
				}
				else if(ypos > height) {
					ypos = height;
				}

				for(var axis in datapos) {
					if(datapos[axis]) {
						if(axis.charAt(0) == 'x') {
							datapos[axis] = axes[axis].series_p2u(xpos);
						}
						else {
							datapos[axis] = axes[axis].series_p2u(ypos);
						}
					}
				}
			}

			if(c.constrainZoomTo == 'x') {
				ypos = height;
			}
			else if(c.constrainZoomTo == 'y') {
				xpos = width;
			}
			c._zoom.end = [xpos, ypos];
			c._zoom.gridpos = {
				x: xpos,
				y: ypos
			};
			c.doZoom(c._zoom.gridpos, datapos, plot, c);
		}
		c._zoom.started = false;
		c._zoom.zooming = false;

		$(document).unbind('mousemove.jqplotCursor', handleZoomMove);

		if(document.onselectstart != undefined && c._oldHandlers.onselectstart != null) {
			document.onselectstart = c._oldHandlers.onselectstart;
			c._oldHandlers.onselectstart = null;
		}
		if(document.ondrag != undefined && c._oldHandlers.ondrag != null) {
			document.ondrag = c._oldHandlers.ondrag;
			c._oldHandlers.ondrag = null;
		}
		if(document.onmousedown != undefined && c._oldHandlers.onmousedown != null) {
			document.onmousedown = c._oldHandlers.onmousedown;
			c._oldHandlers.onmousedown = null;
		}

	}

	$.jqplot.CursorLegendRenderer = function(options) {
		$.jqplot.TableLegendRenderer.call(this, options);
		this.formatString = '%s';
	};

	$.jqplot.CursorLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
	$.jqplot.CursorLegendRenderer.prototype.constructor = $.jqplot.CursorLegendRenderer;

	// called in context of a Legend
	$.jqplot.CursorLegendRenderer.prototype.draw = function() {
		if(this._elem) {
			this._elem.emptyForce();
			this._elem = null;
		}
		if(this.show) {
			var series = this._series, s;
			// make a table.  one line label per row.
			var elem = document.createElement('div');
			this._elem = $(elem);
			elem = null;
			this._elem.addClass('jqplot-legend jqplot-cursor-legend');
			this._elem.css('position', 'absolute');

			var pad = false;
			for(var i = 0; i < series.length; i++) {
				s = series[i];
				if(s.show && s.showLabel) {
					var lt = $.jqplot.sprintf(this.formatString, s.label.toString());
					if(lt) {
						var color = s.color;
						if(s._stack && !s.fill) {
							color = '';
						}
						addrow.call(this, lt, color, pad, i);
						pad = true;
					}
					// let plugins add more rows to legend.  Used by trend line plugin.
					for(var j = 0; j < $.jqplot.addLegendRowHooks.length; j++) {
						var item = $.jqplot.addLegendRowHooks[j].call(this, s);
						if(item) {
							addrow.call(this, item.label, item.color, pad);
							pad = true;
						}
					}
				}
			}
			series = s = null; delete series; delete s;
		}

		function addrow(label, color, pad, idx) {
			var rs = (pad) ? this.rowSpacing : '0';
			var tr = $('<tr class="jqplot-legend jqplot-cursor-legend"></tr>').appendTo(this._elem);
			tr.data('seriesIndex', idx);
			$('<td class="jqplot-legend jqplot-cursor-legend-swatch" style="padding-top:'+rs+';">'+
			'<div style="border:1px solid #cccccc;padding:0.2em;">'+
			'<div class="jqplot-cursor-legend-swatch" style="background-color:'+color+';"></div>'+
			'</div></td>').appendTo(tr);
			var td = $('<td class="jqplot-legend jqplot-cursor-legend-label" style="vertical-align:middle;padding-top:' + rs + ';"></td>');
			td.appendTo(tr);
			td.data('seriesIndex', idx);
			if(this.escapeHtml) {
				td.text(label);
			}
			else {
				td.html(label);
			}
			tr = null;
			td = null;
		}

		return this._elem;
	};

})(jQuery);

function drawZoomBox() {
	var start = this._zoom.start;
	var end = this._zoom.end;
	var ctx = this.zoomCanvas._ctx;
	var l, t, h, w;
	if(end[0] > start[0]) {
		l = start[0];
		w = end[0] - start[0];
	}
	else {
		l = end[0];
		w = start[0] - end[0];
	}
	if(end[1] > start[1]) {
		t = start[1];
		h = end[1] - start[1];
	}
	else {
		t = end[1];
		h = start[1] - end[1];
	}
	ctx.fillStyle = 'rgba(0,0,0,0.2)';
	ctx.strokeStyle = '#999999';
	ctx.lineWidth = 1.0;
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.clearRect(l, t, w, h);
	// IE won't show transparent fill rect, so stroke a rect also.
	ctx.strokeRect(l, t, w, h);
	if($.browser.msie) {
		ctx.fillRect(l, t, w, h);
	}
	ctx = null;
}
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.0b2_r1012
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can
 * choose the license that best suits your project and use it accordingly.
 *
 * Although not required, the author would appreciate an email letting him
 * know of any substantial use of jqPlot.  You can reach the author at:
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 *
 */
(function($) {

	/**
	 * Class: $.jqplot.PointLabels
	 * Plugin for putting labels at the data points.
	 *
	 * To use this plugin, include the js
	 * file in your source:
	 *
	 * > <script type="text/javascript" src="plugins/jqplot.pointLabels.js"></script>
	 *
	 * By default, the last value in the data ponit array in the data series is used
	 * for the label.  For most series renderers, extra data can be added to the
	 * data point arrays and the last value will be used as the label.
	 *
	 * For instance,
	 * this series:
	 *
	 * > [[1,4], [3,5], [7,2]]
	 *
	 * Would, by default, use the y values in the labels.
	 * Extra data can be added to the series like so:
	 *
	 * > [[1,4,'mid'], [3 5,'hi'], [7,2,'low']]
	 *
	 * And now the point labels would be 'mid', 'low', and 'hi'.
	 *
	 * Options to the point labels and a custom labels array can be passed into the
	 * "pointLabels" option on the series option like so:
	 *
	 * > series:[{pointLabels:{
	 * >    labels:['mid', 'hi', 'low'],
	 * >    location:'se',
	 * >    ypadding: 12
	 * >    }
	 * > }]
	 *
	 * A custom labels array in the options takes precendence over any labels
	 * in the series data.  If you have a custom labels array in the options,
	 * but still want to use values from the series array as labels, set the
	 * "labelsFromSeries" option to true.
	 *
	 * By default, html entities (<, >, etc.) are escaped in point labels.
	 * If you want to include actual html markup in the labels,
	 * set the "escapeHTML" option to false.
	 *
	 */
	$.jqplot.PointLabels = function(options) {
		// Group: Properties
		//
		// prop: show
		// show the labels or not.
		this.show = $.jqplot.config.enablePlugins;
		// prop: location
		// compass location where to position the label around the point.
		// 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
		this.location = 'n';
		// prop: labelsFromSeries
		// true to use labels within data point arrays.
		this.labelsFromSeries = false;
		// prop: seriesLabelIndex
		// array index for location of labels within data point arrays.
		// if null, will use the last element of the data point array.
		this.seriesLabelIndex = null;
		// prop: labels
		// array of arrays of labels, one array for each series.
		this.labels = [];
		// actual labels that will get displayed.
		// needed to preserve user specified labels in labels array.
		this._labels = [];
		// prop: stackedValue
		// true to display value as stacked in a stacked plot.
		// no effect if labels is specified.
		this.stackedValue = false;
		// prop: ypadding
		// vertical padding in pixels between point and label
		this.ypadding = 6;
		// prop: xpadding
		// horizontal padding in pixels between point and label
		this.xpadding = 6;
		// prop: escapeHTML
		// true to escape html entities in the labels.
		// If you want to include markup in the labels, set to false.
		this.escapeHTML = true;
		// prop: edgeTolerance
		// Number of pixels that the label must be away from an axis
		// boundary in order to be drawn.  Negative values will allow overlap
		// with the grid boundaries.
		this.edgeTolerance = -5;
		// prop: formatter
		// A class of a formatter for the tick text.  sprintf by default.
		this.formatter = $.jqplot.DefaultTickFormatter;
		// prop: formatString
		// string passed to the formatter.
		this.formatString = '';
		// prop: hideZeros
		// true to not show a label for a value which is 0.
		this.hideZeros = false;
		this._elems = [];

		$.extend(true, this, options);
	};

	var locations = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
	var locationIndicies = {
		'nw': 0,
		'n': 1,
		'ne': 2,
		'e': 3,
		'se': 4,
		's': 5,
		'sw': 6,
		'w': 7
	};
	var oppositeLocations = ['se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];

	// called with scope of a series
	$.jqplot.PointLabels.init = function(target, data, seriesDefaults, opts, plot) {
		var options = $.extend(true, {}, seriesDefaults, opts);
		options.pointLabels = options.pointLabels || {};
		if(this.renderer.constructor === $.jqplot.BarRenderer && this.barDirection === 'horizontal' && !options.pointLabels.location) {
			options.pointLabels.location = 'e';
		}
		// add a pointLabels attribute to the series plugins
		this.plugins.pointLabels = new $.jqplot.PointLabels(options.pointLabels);
		this.plugins.pointLabels.setLabels.call(this);
	};

	// called with scope of series
	$.jqplot.PointLabels.prototype.setLabels = function() {
		var p = this.plugins.pointLabels;
		var labelIdx;
		if(p.seriesLabelIndex != null) {
			labelIdx = p.seriesLabelIndex;
		}
		else if(this.renderer.constructor === $.jqplot.BarRenderer && this.barDirection === 'horizontal') {
			labelIdx = 0;
		}
		else {
			labelIdx = (this._plotData.length === 0) ? 0 : this._plotData[0].length - 1;
		}
		p._labels = [];
		if(p.labels.length === 0 || p.labelsFromSeries) {
			if(p.stackedValue) {
				if(this._plotData.length && this._plotData[0].length) {
					// var idx = p.seriesLabelIndex || this._plotData[0].length -1;
					for(var i = 0; i < this._plotData.length; i++) {
						p._labels.push(this._plotData[i][labelIdx]);
					}
				}
			}
			else {
				var d = this._plotData;
				if(this.renderer.constructor === $.jqplot.BarRenderer && this.waterfall) {
					d = this._data;
				}
				if(d.length && d[0].length) {
					// var idx = p.seriesLabelIndex || d[0].length -1;
					for(var i = 0; i < d.length; i++) {
						p._labels.push(d[i][labelIdx]);
					}
				}
				d = null;
			}
		}
		else if(p.labels.length) {
			p._labels = p.labels;
		}
	};

	$.jqplot.PointLabels.prototype.xOffset = function(elem, location, padding) {
		location = location || this.location;
		padding = padding || this.xpadding;
		var offset;

		switch (location) {
			case 'nw':
				offset = -elem.outerWidth(true) - this.xpadding;
				break;
			case 'n':
				offset = -elem.outerWidth(true) / 2;
				break;
			case 'ne':
				offset = this.xpadding;
				break;
			case 'e':
				offset = this.xpadding;
				break;
			case 'se':
				offset = this.xpadding;
				break;
			case 's':
				offset = -elem.outerWidth(true) / 2;
				break;
			case 'sw':
				offset = -elem.outerWidth(true) - this.xpadding;
				break;
			case 'w':
				offset = -elem.outerWidth(true) - this.xpadding;
				break;
			default:
				// same as 'nw'
				offset = -elem.outerWidth(true) - this.xpadding;
				break;
		}
		return offset;
	};

	$.jqplot.PointLabels.prototype.yOffset = function(elem, location, padding) {
		location = location || this.location;
		padding = padding || this.xpadding;
		var offset;

		switch (location) {
			case 'nw':
				offset = -elem.outerHeight(true) - this.ypadding;
				break;
			case 'n':
				offset = -elem.outerHeight(true) - this.ypadding;
				break;
			case 'ne':
				offset = -elem.outerHeight(true) - this.ypadding;
				break;
			case 'e':
				offset = -elem.outerHeight(true) / 2;
				break;
			case 'se':
				offset = this.ypadding;
				break;
			case 's':
				offset = this.ypadding;
				break;
			case 'sw':
				offset = this.ypadding;
				break;
			case 'w':
				offset = -elem.outerHeight(true) / 2;
				break;
			default:
				// same as 'nw'
				offset = -elem.outerHeight(true) - this.ypadding;
				break;
		}
		return offset;
	};

	// called with scope of series
	$.jqplot.PointLabels.draw = function(sctx, options, plot) {
		var p = this.plugins.pointLabels;
		// set labels again in case they have changed.
		p.setLabels.call(this);
		// remove any previous labels
		for(var i = 0; i < p._elems.length; i++) {
			// Memory Leaks patch
			// p._elems[i].remove();
			p._elems[i].emptyForce();
		}
		p._elems.splice(0, p._elems.length);

		if(p.show) {
			for(var i = 0; i < p.labels.length; i++) {
				var pd = this._plotData;
				var xax = this._xaxis;
				var yax = this._yaxis;
				var label = p.labels[i];

				if(p.hideZeros && parseInt(p.labels[i], 10) == 0) {
					label = '';
				}

				var elem = $('<div class="jqplot-point-label" style="position:absolute"></div>');
				elem.insertAfter(sctx.canvas);
				if(p.escapeHTML) {
					elem.text(label);
				}
				else {
					elem.html(label);
				}
				var location = p.location;
				if(this.waterfall && parseInt(label, 10) < 0) {
					location = oppositeLocations[locationIndicies[location]];
				}

				var ell = xax.u2p(pd[i][0]) + p.xOffset(elem, location);
				var elt = yax.u2p(pd[i][1]) + p.yOffset(elem, location);
				elem.css('left', ell);
				elem.css('top', elt);
				var elr = ell + $(elem).width();
				var elb = elt + $(elem).height();
				var et = p.edgeTolerance;
				var scl = $(sctx.canvas).position().left;
				var sct = $(sctx.canvas).position().top;
				var scr = sctx.canvas.width + scl;
				var scb = sctx.canvas.height + sct;
				// if label is outside of allowed area, remove it
				if( ell - et < scl || elt - et < sct || elr + et > scr || elb + et > scb) {
					$(elem).remove();
				}
			}

		}
	};

	$.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init);
	$.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw);
})(jQuery);
/**
 * jqPlot
 * Pure JavaScript plotting plugin using jQuery
 *
 * Version: 1.0.0b2_r1012
 *
 * Copyright (c) 2009-2011 Chris Leonello
 * jqPlot is currently available for use in all personal or commercial projects 
 * under both the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL 
 * version 2.0 (http://www.gnu.org/licenses/gpl-2.0.html) licenses. This means that you can 
 * choose the license that best suits your project and use it accordingly. 
 *
 * Although not required, the author would appreciate an email letting him 
 * know of any substantial use of jqPlot.  You can reach the author at: 
 * chris at jqplot dot com or see http://www.jqplot.com/info.php .
 *
 * If you are feeling kind and generous, consider supporting the project by
 * making a donation at: http://www.jqplot.com/donate.php .
 *
 * sprintf functions contained in jqplot.sprintf.js by Ash Searle:
 *
 *     version 2007.04.27
 *     author Ash Searle
 *     http://hexmen.com/blog/2007/03/printf-sprintf/
 *     http://hexmen.com/js/sprintf.js
 *     The author (Ash Searle) has placed this code in the public domain:
 *     "This code is unrestricted: you are free to use it however you like."
 * 
 */
(function($) {
    $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMove]);
    
    /**
     * Class: $.jqplot.Highlighter
     * Plugin which will highlight data points when they are moused over.
     * 
     * To use this plugin, include the js
     * file in your source:
     * 
     * > <script type="text/javascript" src="plugins/jqplot.highlighter.js"></script>
     * 
     * A tooltip providing information about the data point is enabled by default.
     * To disable the tooltip, set "showTooltip" to false.
     * 
     * You can control what data is displayed in the tooltip with various
     * options.  The "tooltipAxes" option controls wether the x, y or both
     * data values are displayed.
     * 
     * Some chart types (e.g. hi-low-close) have more than one y value per
     * data point. To display the additional values in the tooltip, set the
     * "yvalues" option to the desired number of y values present (3 for a hlc chart).
     * 
     * By default, data values will be formatted with the same formatting
     * specifiers as used to format the axis ticks.  A custom format code
     * can be supplied with the tooltipFormatString option.  This will apply 
     * to all values in the tooltip.  
     * 
     * For more complete control, the "formatString" option can be set.  This
     * Allows conplete control over tooltip formatting.  Values are passed to
     * the format string in an order determined by the "tooltipAxes" and "yvalues"
     * options.  So, if you have a hi-low-close chart and you just want to display 
     * the hi-low-close values in the tooltip, you could set a formatString like:
     * 
     * > highlighter: {
     * >     tooltipAxes: 'y',
     * >     yvalues: 3,
     * >     formatString:'<table class="jqplot-highlighter">
     * >         <tr><td>hi:</td><td>%s</td></tr>
     * >         <tr><td>low:</td><td>%s</td></tr>
     * >         <tr><td>close:</td><td>%s</td></tr></table>'
     * > }
     * 
     */
    $.jqplot.Highlighter = function(options) {
        // Group: Properties
        //
        //prop: show
        // true to show the highlight.
        this.show = $.jqplot.config.enablePlugins;
        // prop: markerRenderer
        // Renderer used to draw the marker of the highlighted point.
        // Renderer will assimilate attributes from the data point being highlighted,
        // so no attributes need set on the renderer directly.
        // Default is to turn off shadow drawing on the highlighted point.
        this.markerRenderer = new $.jqplot.MarkerRenderer({shadow:false});
        // prop: showMarker
        // true to show the marker
        this.showMarker  = true;
        // prop: lineWidthAdjust
        // Pixels to add to the lineWidth of the highlight.
        this.lineWidthAdjust = 2.5;
        // prop: sizeAdjust
        // Pixels to add to the overall size of the highlight.
        this.sizeAdjust = 5;
        // prop: showTooltip
        // Show a tooltip with data point values.
        this.showTooltip = true;
        // prop: tooltipLocation
        // Where to position tooltip, 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'
        this.tooltipLocation = 'nw';
        // prop: fadeTooltip
        // true = fade in/out tooltip, flase = show/hide tooltip
        this.fadeTooltip = true;
        // prop: tooltipFadeSpeed
        // 'slow', 'def', 'fast', or number of milliseconds.
        this.tooltipFadeSpeed = "fast";
        // prop: tooltipOffset
        // Pixel offset of tooltip from the highlight.
        this.tooltipOffset = 2;
        // prop: tooltipAxes
        // Which axes to display in tooltip, 'x', 'y' or 'both', 'xy' or 'yx'
        // 'both' and 'xy' are equivalent, 'yx' reverses order of labels.
        this.tooltipAxes = 'both';
        // prop; tooltipSeparator
        // String to use to separate x and y axes in tooltip.
        this.tooltipSeparator = ', ';
        // prop; tooltipContentEditor
        // Function used to edit/augment/replace the formatted tooltip contents.
        // Called as str = tooltipContentEditor(str, seriesIndex, pointIndex)
        // where str is the generated tooltip html and seriesIndex and pointIndex identify
        // the data point being highlighted. Should return the html for the tooltip contents.
        this.tooltipContentEditor = null;
        // prop: useAxesFormatters
        // Use the x and y axes formatters to format the text in the tooltip.
        this.useAxesFormatters = true;
        // prop: tooltipFormatString
        // sprintf format string for the tooltip.
        // Uses Ash Searle's javascript sprintf implementation
        // found here: http://hexmen.com/blog/2007/03/printf-sprintf/
        // See http://perldoc.perl.org/functions/sprintf.html for reference.
        // Additional "p" and "P" format specifiers added by Chris Leonello.
        this.tooltipFormatString = '%.5P';
        // prop: formatString
        // alternative to tooltipFormatString
        // will format the whole tooltip text, populating with x, y values as
        // indicated by tooltipAxes option.  So, you could have a tooltip like:
        // 'Date: %s, number of cats: %d' to format the whole tooltip at one go.
        // If useAxesFormatters is true, values will be formatted according to
        // Axes formatters and you can populate your tooltip string with 
        // %s placeholders.
        this.formatString = null;
        // prop: yvalues
        // Number of y values to expect in the data point array.
        // Typically this is 1.  Certain plots, like OHLC, will
        // have more y values in each data point array.
        this.yvalues = 1;
        // prop: bringSeriesToFront
        // This option requires jQuery 1.4+
        // True to bring the series of the highlighted point to the front
        // of other series.
        this.bringSeriesToFront = false;
        this._tooltipElem;
        this.isHighlighting = false;
        this.currentNeighbor = null;

        $.extend(true, this, options);
    };
    
    var locations = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    var locationIndicies = {'nw':0, 'n':1, 'ne':2, 'e':3, 'se':4, 's':5, 'sw':6, 'w':7};
    var oppositeLocations = ['se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];
    
    // axis.renderer.tickrenderer.formatter
    
    // called with scope of plot
    $.jqplot.Highlighter.init = function (target, data, opts){
        var options = opts || {};
		this.plugins.highlighter = new $.jqplot.Highlighter(options.highlighter);
    };
    
    // called within scope of series
    $.jqplot.Highlighter.parseOptions = function (defaults, options) {
        // Add a showHighlight option to the series 
        // and set it to true by default.
        this.showHighlight = true;
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    $.jqplot.Highlighter.postPlotDraw = function() {
        // Memory Leaks patch    
        if (this.plugins.highlighter && this.plugins.highlighter.highlightCanvas) {
            this.plugins.highlighter.highlightCanvas.resetCanvas();
            this.plugins.highlighter.highlightCanvas = null;
        }

        if (this.plugins.highlighter && this.plugins.highlighter._tooltipElem) {
            this.plugins.highlighter._tooltipElem.emptyForce();
            this.plugins.highlighter._tooltipElem = null;
        }

        this.plugins.highlighter.highlightCanvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding, 'jqplot-highlight-canvas', this._plotDimensions, this));
        this.plugins.highlighter.highlightCanvas.setContext();

        var elem = document.createElement('div');
        this.plugins.highlighter._tooltipElem = $(elem);
        elem = null;
        this.plugins.highlighter._tooltipElem.addClass('jqplot-highlighter-tooltip');
        this.plugins.highlighter._tooltipElem.css({position:'absolute', display:'none'});
        
        this.eventCanvas._elem.before(this.plugins.highlighter._tooltipElem);
    };
    
    $.jqplot.preInitHooks.push($.jqplot.Highlighter.init);
    $.jqplot.preParseSeriesOptionsHooks.push($.jqplot.Highlighter.parseOptions);
    $.jqplot.postDrawHooks.push($.jqplot.Highlighter.postPlotDraw);
    
    function draw(plot, neighbor) {
        var hl = plot.plugins.highlighter;
        var s = plot.series[neighbor.seriesIndex];
        var smr = s.markerRenderer;
        var mr = hl.markerRenderer;
        mr.style = smr.style;
        mr.lineWidth = smr.lineWidth + hl.lineWidthAdjust;
        mr.size = smr.size + hl.sizeAdjust;
        var rgba = $.jqplot.getColorComponents(smr.color);
        var newrgb = [rgba[0], rgba[1], rgba[2]];
        var alpha = (rgba[3] >= 0.6) ? rgba[3]*0.6 : rgba[3]*(2-rgba[3]);
        mr.color = 'rgba('+newrgb[0]+','+newrgb[1]+','+newrgb[2]+','+alpha+')';
        mr.init();
        mr.draw(s.gridData[neighbor.pointIndex][0], s.gridData[neighbor.pointIndex][1], hl.highlightCanvas._ctx);
    }
    
    function showTooltip(plot, series, neighbor) {
        // neighbor looks like: {seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]}
        // gridData should be x,y pixel coords on the grid.
        // add the plot._gridPadding to that to get x,y in the target.
        var hl = plot.plugins.highlighter;
        var elem = hl._tooltipElem;
        var serieshl = series.highlighter || {};

        var opts = $.extend(true, {}, hl, serieshl);

        if (opts.useAxesFormatters) {
            var xf = series._xaxis._ticks[0].formatter;
            var yf = series._yaxis._ticks[0].formatter;
            var xfstr = series._xaxis._ticks[0].formatString;
            var yfstr = series._yaxis._ticks[0].formatString;
            var str;
            var xstr = xf(xfstr, neighbor.data[0]);
            var ystrs = [];
            for (var i=1; i<opts.yvalues+1; i++) {
                ystrs.push(yf(yfstr, neighbor.data[i]));
            }
            if (typeof opts.formatString === 'string') {
                switch (opts.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        ystrs.unshift(xstr);
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'yx':
                        ystrs.push(xstr);
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'x':
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString, xstr]);
                        break;
                    case 'y':
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    default: // same as xy
                        ystrs.unshift(xstr);
                        ystrs.unshift(opts.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                } 
            }
            else {
                switch (opts.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += opts.tooltipSeparator + ystrs[i];
                        }
                        break;
                    case 'yx':
                        str = '';
                        for (var i=0; i<ystrs.length; i++) {
                            str += ystrs[i] + opts.tooltipSeparator;
                        }
                        str += xstr;
                        break;
                    case 'x':
                        str = xstr;
                        break;
                    case 'y':
                        str = ystrs.join(opts.tooltipSeparator);
                        break;
                    default: // same as 'xy'
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += opts.tooltipSeparator + ystrs[i];
                        }
                        break;
                    
                }                
            }
        }
        else {
            var str;
            if (typeof opts.formatString ===  'string') {
                str = $.jqplot.sprintf.apply($.jqplot.sprintf, [opts.formatString].concat(neighbor.data));
            }

            else {
                if (opts.tooltipAxes == 'both' || opts.tooltipAxes == 'xy') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[0]) + opts.tooltipSeparator + $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[1]);
                }
                else if (opts.tooltipAxes == 'yx') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[1]) + opts.tooltipSeparator + $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[0]);
                }
                else if (opts.tooltipAxes == 'x') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[0]);
                }
                else if (opts.tooltipAxes == 'y') {
                    str = $.jqplot.sprintf(opts.tooltipFormatString, neighbor.data[1]);
                } 
            }
        }
        if ($.isFunction(opts.tooltipContentEditor)) {
            // args str, seriesIndex, pointIndex are essential so the hook can look up
            // extra data for the point.
            str = opts.tooltipContentEditor(str, neighbor.seriesIndex, neighbor.pointIndex, plot);
        }
        str = str.replace(/%l/,series.label);
		if (neighbor.data[2]!=undefined && neighbor.data[2])
			str = str.replace(/%1/,neighbor.data[2]);
		else
			str = str.replace(/%1/,"");
		if (neighbor.data[3]!=undefined && neighbor.data[3])
			str = str.replace(/%2/,neighbor.data[3]);
		else
			str = str.replace(/%2/,"");
		if (neighbor.data[4]!=undefined && neighbor.data[4])
			str = str.replace(/%3/,neighbor.data[4]);
		else
			str = str.replace(/%3/,"");
		if (neighbor.data[5]!=undefined && neighbor.data[5])
			str = str.replace(/%4/,neighbor.data[5]);
		else
			str = str.replace(/%4/,"");
		if (neighbor.data[8]!=undefined&&neighbor.data[8])
			str=str.replace(/%5/,neighbor.data[8]);
		else 
			str=str.replace(/%5/,"");
		if (neighbor.data[7]!=undefined&&neighbor.data[7])
			str=str.replace(/%6/,neighbor.data[7]);
		else 
			str=str.replace(/%6/,"");
		elem.html(str);
        var gridpos = {x:neighbor.gridData[0], y:neighbor.gridData[1]};
        var ms = 0;
        var fact = 0.707;
        if (series.markerRenderer.show == true) { 
            ms = (series.markerRenderer.size + opts.sizeAdjust)/2;
        }
		
		var loc = locations;
		if (series.fillToZero && series.fill && neighbor.data[1] < 0) {
			loc = oppositeLocations;
		}
		
        switch (loc[locationIndicies[opts.tooltipLocation]]) {
            case 'nw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - ms;
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + opts.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + opts.tooltipOffset + ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + opts.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top + opts.tooltipOffset + fact * ms;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + opts.tooltipOffset + ms;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top + opts.tooltipOffset + fact * ms;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - opts.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - opts.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
        }
        elem.css('left', x);
        elem.css('top', y);
        if (opts.fadeTooltip) {
            // Fix for stacked up animations.  Thnanks Trevor!
            elem.stop(true,true).fadeIn(opts.tooltipFadeSpeed);
        }
        else {
            elem.show();
        }
        elem = null;
        
    }
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        var hl = plot.plugins.highlighter;
        var c = plot.plugins.cursor;
        if (hl.show) {
            if (neighbor == null && hl.isHighlighting && HIGHLIGHTER_HELPERS.isHighlighting) {
                var ctx = hl.highlightCanvas._ctx;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                if (hl.fadeTooltip) {
                    hl._tooltipElem.fadeOut(hl.tooltipFadeSpeed);
                }
                else {
                    hl._tooltipElem.hide();
                }
                if (hl.bringSeriesToFront) {
                    plot.restorePreviousSeriesOrder();
                }
                hl.isHighlighting = false;
				HIGHLIGHTER_HELPERS.isHighlighting = false;
                hl.currentNeighbor = null;
                ctx = null;
            }
            else if (neighbor != null && plot.series[neighbor.seriesIndex].showHighlight && !hl.isHighlighting && !HIGHLIGHTER_HELPERS.isHighlighting) {
                hl.isHighlighting = true;
				HIGHLIGHTER_HELPERS.isHighlighting = true;
                hl.currentNeighbor = neighbor;
                if (hl.showMarker) {
                    draw(plot, neighbor);
                }
                if (hl.showTooltip && (!c || !c._zoom.started)) {
                    showTooltip(plot, plot.series[neighbor.seriesIndex], neighbor);
                }
                if (hl.bringSeriesToFront) {
                    plot.moveSeriesToFront(neighbor.seriesIndex);
                }
            }
            // check to see if we're highlighting the wrong point.
            else if (neighbor != null && hl.isHighlighting  && HIGHLIGHTER_HELPERS.isHighlighting && hl.currentNeighbor != neighbor) {
                // highlighting the wrong point.

                // if new series allows highlighting, highlight new point.
                if (plot.series[neighbor.seriesIndex].showHighlight) {
                    var ctx = hl.highlightCanvas._ctx;
                    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    hl.isHighlighting = true;
					HIGHLIGHTER_HELPERS.isHighlighting = true;
                    hl.currentNeighbor = neighbor;
                    if (hl.showMarker) {
                        draw(plot, neighbor);
                    }
                    if (hl.showTooltip && (!c || !c._zoom.started)) {
                        showTooltip(plot, plot.series[neighbor.seriesIndex], neighbor);
                    }
                    if (hl.bringSeriesToFront) {
                        plot.moveSeriesToFront(neighbor.seriesIndex);
                    }                    
                }                
            }
        }
    }
})(jQuery);

var HIGHLIGHTER_HELPERS = function(){
	return {
		isHighlighting: false
	};
}();
