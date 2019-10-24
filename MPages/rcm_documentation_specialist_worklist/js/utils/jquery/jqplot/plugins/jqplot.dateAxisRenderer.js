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
