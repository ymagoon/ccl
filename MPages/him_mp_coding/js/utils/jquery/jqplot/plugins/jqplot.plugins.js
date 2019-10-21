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
 * making a donation at: http://www.jqplot.com/donate.php.
 *
 * Thanks for using jqPlot!
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
    };
    
    $.jqplot.DateAxisRenderer.prototype = new $.jqplot.LinearAxisRenderer();
    $.jqplot.DateAxisRenderer.prototype.constructor = $.jqplot.DateAxisRenderer;
    
    $.jqplot.DateTickFormatter = function(format, val) {
        if (!format) {
            format = '%Y/%m/%d';
        }
        return Date.create(val).strftime(format);
    };
	
	$.jqplot.DateTickFormatterSpecial = function(format, val, showDate) {
		var iDate = Date.create(Math.abs(val));
		var curDtTm = new Date;
		curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);
		var nFormat = "<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span><span class='jqplot-elem-hideOnHover nowTime'>%H:%M</span>";
		return iDate.strftime(nFormat);
	};
	
	$.jqplot.DateTickFormatterXSpecial = function(format, val, showDate) {
		var iDate = Date.create(Math.abs(val));
		var curDtTm = new Date();
		curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);
		var nFormat = format;
		if (DAR_HELPERS.createdNow && iDate.getTime() == curDtTm.getTime())
		{
			nFormat = "<span class='jqplot-elem-hideOnHover'>&nbsp;</span><span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span>";
		}
		//if midnight, show time over date
		else if (showDate || (iDate.getMilliseconds()==0 && iDate.getSeconds()==0 && iDate.getMinutes() == 0 && iDate.getHours() == 0)) {
            nFormat = "<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;</span>%H:%M<br class='jqplot-elem-hideOnHover'/><span class='jqplot-elem-hideOnHover'>%#m/%#d/%y</span>";
        }
		//show just time
		else {
			nFormat = "<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;</span>%H:%M";
		}
        return iDate.strftime(nFormat);
    };
	
	$.jqplot.DateTickFormatterX2Special = function(format, val, showDate) {
		var iDate = Date.create(Math.abs(val));
		var curDtTm = new Date();
		curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);
		var nFormat = format;
		if (DAR_HELPERS.createdNow && iDate.getTime() == curDtTm.getTime())
		{
			nFormat = "<span class='jqplot-elem-hideOnHover'>&nbsp;</span><span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span>";
		}
		//if midnight, show time over date
		else if (showDate || (iDate.getMilliseconds()==0 && iDate.getSeconds()==0 && iDate.getMinutes() == 0 && iDate.getHours() == 0)) {
            nFormat = "%#m/%#d/<span class='jqplot-elem-showOnHover'>%Y</span><span class='jqplot-elem-hideOnHover'>%y</span><br class='jqplot-elem-hideOnHover'/><span class='jqplot-elem-showOnHover'>&nbsp;</span>%H:%M";
        }
		//show just time
		else {
			nFormat = "<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y</span>&nbsp;<br class='jqplot-elem-hideOnHover'/>%H:%M";
		}
        return iDate.strftime(nFormat);
    };
	
	$.jqplot.DateTickFormatterYSpecial = function(format, val, showDate) {
		var iDate = Date.create(Math.abs(val));
		var curDtTm = new Date();
		curDtTm.setMilliseconds(0);curDtTm.setSeconds(0);
		var nFormat = format;
		if (DAR_HELPERS.createdNow && iDate.getTime() == curDtTm.getTime())
		{
			nFormat = "<span class='jqplot-elem-hideOnHover'>&nbsp;</span><span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;%H:%M</span>";
		}
		//if midnight, show time over date
		else if (showDate || (iDate.getMilliseconds()==0 && iDate.getSeconds()==0 && iDate.getMinutes() == 0 && iDate.getHours() == 0)) {
            nFormat = "%#m/%#d/<span class='jqplot-elem-showOnHover'>%Y</span><span class='jqplot-elem-hideOnHover'>%y</span><br class='jqplot-elem-hideOnHover'/><span class='jqplot-elem-showOnHover'>&nbsp;</span>%H:%M";
        }
		//show just time
		else {
			nFormat = "<span class='jqplot-elem-showOnHover'>%#m/%#d/%Y&nbsp;</span>%H:%M";
		}
        return iDate.strftime(nFormat);
    };
    
    $.jqplot.DateAxisRenderer.prototype.init = function(options){
        // prop: tickRenderer
        // A class of a rendering engine for creating the ticks labels displayed on the plot, 
        // See <$.jqplot.AxisTickRenderer>.
        // this.tickRenderer = $.jqplot.AxisTickRenderer;
        // this.labelRenderer = $.jqplot.AxisLabelRenderer;
        this.daTickInterval = null;
        this._daTickInterval = null;
        $.extend(true, this, options);
		
		if (this.specialFormat && this.specialFormatFlag!=null && this.specialFormatFlag == 1)
		{
			this.tickOptions.formatter = $.jqplot.DateTickFormatterSpecial;
		}
		else if (this.specialFormat && this.name.match("xaxis")!=null)
		{
			this.tickOptions.formatter = $.jqplot.DateTickFormatterXSpecial;
		}
		else if (this.specialFormat && this.name.match(/^x/)!=null)
		{
			this.tickOptions.formatter = $.jqplot.DateTickFormatterX2Special;
		}
		else if (this.specialFormat && this.name.match(/^y/)!=null)
		{
			this.tickOptions.formatter = $.jqplot.DateTickFormatterYSpecial;
		}
		else
		{
			this.tickOptions.formatter = $.jqplot.DateTickFormatter;
		}
        var db = this._dataBounds;
        // Go through all the series attached to this axis and find
        // the min/max bounds for this axis.
        for (var i=0; i<this._series.length; i++) {
            var s = this._series[i];
            var d = s.data;
            var pd = s._plotData;
            var sd = s._stackData;
            
            for (var j=0; j<d.length; j++) { 
                if (this.name.match(/^x/)) {
                    d[j][0] = Date.create(d[j][0]).getTime();
                    pd[j][0] = Date.create(d[j][0]).getTime();
                    sd[j][0] = Date.create(d[j][0]).getTime();
                    if (d[j][0] < db.min || db.min == null) {
                        db.min = d[j][0];
                    }
                    if (d[j][0] > db.max || db.max == null) {
                        db.max = d[j][0];
                    }
                }              
                else {
                    d[j][1] = Date.create(d[j][1]).getTime();
                    pd[j][1] = Date.create(d[j][1]).getTime();
                    sd[j][1] = Date.create(d[j][1]).getTime();
                    if (d[j][1] < db.min || db.min == null) {
                        db.min = d[j][1];
                    }
                    if (d[j][1] > db.max || db.max == null) {
                        db.max = d[j][1];
                    }
                }              
            }
        }
    };
    
    // called with scope of an axis
    $.jqplot.DateAxisRenderer.prototype.reset = function() {
        this.min = this._min;
        this.max = this._max;
        this.tickInterval = this._tickInterval;
        this.numberTicks = this._numberTicks;
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
			if (this.specialFormatFlag==null || this.specialFormatFlag != 1){
				var minDtTm = Date.create(this.min);
				var maxDtTm = Date.create(this.max);
				DAR_HELPERS.createdNow = true;
				var tickVals = DAR_HELPERS.DynamicRangeTickCalc(minDtTm.getTime(),maxDtTm.getTime());
				this.numberTicks = tickVals.length;
				userTicks = tickVals;
				midnightExists = false;
				for (var i=0;i<userTicks.length;i++)
				{
					var tDate = Date.create(userTicks[i]);
					if (tDate.getMilliseconds()==0 && tDate.getSeconds()==0 && tDate.getMinutes()==0 && tDate.getHours()==0)
						midnightExists = true;
				}
				this.min = tickVals[0];
				this.max = tickVals[tickVals.length-1];
				this.daTickInterval = [(this.max - this.min) / (this.numberTicks - 1)/1000, 'seconds'];
			}
			else if (this.specialFormatFlag == 1)
				userTicks = [new Date().getTime()];
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
						var t1Date = Date.create(t1Time), t2Date = Date.create(t2Time);
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
            for (i=0; i<userTicks.length; i++){
                var t = new this.tickRenderer(this.tickOptions);
				/* creating date first in case of value not in Milliseconds */
				t.value = Date.create((userTicks[i].constructor == Array)?userTicks[i][0]:userTicks[i]).getTime();
				if (t.value > this.max)
					continue;
				t.label = (userTicks[i].constructor == Array)?userTicks[i][1]:null;
				var dateShown = false;
				
				if (this.specialFormat)
				{
					/* show date with time on first tick if all other ticks are just time */
					if (i==0 && !midnightExists)
						dateShown = true;
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
						
						var t1Date = Date.create((userTicks[i-1].constructor == Array)?userTicks[i-1][0]:userTicks[i-1]);
						var t2Date = Date.create((userTicks[i].constructor == Array)?userTicks[i][0]:userTicks[i]);
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
				t.setTick(t.value, this.name, false, dateShown);
				this._ticks.push(t);
            }
            this.numberTicks = userTicks.length;
			if (!this.specialFormat) {
				this.min = this._ticks[0].value;
				this.max = this._ticks[this.numberTicks-1].value;
			}
            this.daTickInterval = [(this.max - this.min) / (this.numberTicks - 1)/1000, 'seconds'];
        }
        
        // we don't have any ticks yet, let's make some!
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
        
            min = ((this.min != null) ? Date.create(this.min).getTime() : db.min);
            max = ((this.max != null) ? Date.create(this.max).getTime() : db.max);
            
            // if min and max are same, space them out a bit
            if (min == max) {
                var adj = 24*60*60*500;  // 1/2 day
                min -= adj;
                max += adj;
            }

            var range = max - min;
            var rmin, rmax;
        
            rmin = (this.min != null) ? Date.create(this.min).getTime() : min - range/2*(this.padMin - 1);
            rmax = (this.max != null) ? Date.create(this.max).getTime() : max + range/2*(this.padMax - 1);
            this.min = rmin;
            this.max = rmax;
            range = this.max - this.min;
    
            if (this.numberTicks == null){
                // if tickInterval is specified by user, we will ignore computed maximum.
                // max will be equal or greater to fit even # of ticks.
                if (this.daTickInterval != null) {
                    var nc = Date.create(this.max).diff(this.min, this.daTickInterval[1], true);
                    this.numberTicks = Math.ceil(nc/this.daTickInterval[0]) +1;
                    // this.max = Date.create(this.min).add(this.numberTicks-1, this.daTickInterval[1]).getTime();
                    this.max = Date.create(this.min).add((this.numberTicks-1) * this.daTickInterval[0], this.daTickInterval[1]).getTime();
                }
                else if (dim > 200) {
                    this.numberTicks = parseInt(3+(dim-200)/100, 10);
                }
                else {
                    this.numberTicks = 2;
                }
            }
    
            if (this.daTickInterval == null) {
                this.daTickInterval = [range / (this.numberTicks-1)/1000, 'seconds'];
            }
            for (var i=0; i<this.numberTicks; i++){
                var min = Date.create(this.min);
				if (this.useDST){
					tt = min.add(i*this.daTickInterval[0], this.daTickInterval[1]).getTime();
				}
				else{
					tt = min.addNoDST(i*this.daTickInterval[0], this.daTickInterval[1]).getTime();
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
        if (this._daTickInterval == null) {
            this._daTickInterval = this.daTickInterval;    
        }
    };
   
})(jQuery);

var DAR_HELPERS = function(){
	return {
		createdNow:false,
		tickDiff:null,
		DynamicRangeTickCalc:function(iMin,iMax){
			var unitSize = {
				"second": 1000,
				"minute": 60 * 1000,
				"hour": 60 * 60 * 1000,
				"day": 24 * 60 * 60 * 1000,
				"month": 30 * 24 * 60 * 60 * 1000,
				"year": 365.2425 * 24 * 60 * 60 * 1000
			};
			var minDtTm = Date.create(iMin);
			var maxDtTm = Date.create(iMax);
			var dtTmDiff = iMax-iMin;
			var tickVals = [], curDtTm = new Date(), noNowTick = false;
			curDtTm.setMilliseconds(0); curDtTm.setSeconds(0);
			if (dtTmDiff<=(2*unitSize["second"])) // <= 2 seconds
			{
				DAR_HELPERS.tickDiff = [250,"Milliseconds"];
				if ((maxDtTm.getMilliseconds()%250) != 0)
					maxDtTm.setMilliseconds(maxDtTm.getMilliseconds()+(250-(maxDtTm.getMilliseconds()%250)));
				tickVals.push(maxDtTm.getTime());
				while (maxDtTm.getTime() > minDtTm.getTime())
				{
					maxDtTm.setMilliseconds(maxDtTm.getMilliseconds()-250);
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
			else if (dtTmDiff<=((2*unitSize["minute"])+(15*unitSize["second"]))) // <= 2 minutes 15 seconds		
			{
				DAR_HELPERS.tickDiff = [15,"Seconds"];
				if ((maxDtTm.getSeconds()%15) != 0 ||((maxDtTm.getSeconds()%15) == 0 && maxDtTm.getMilliseconds()>0))
					maxDtTm.setSeconds(maxDtTm.getSeconds()+(15-(maxDtTm.getSeconds()%15)));
				maxDtTm.setMilliseconds(0);
				tickVals.push(maxDtTm.getTime());
				while (maxDtTm.getTime() > minDtTm.getTime())
				{
					maxDtTm.setSeconds(maxDtTm.getSeconds()-15);
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
			else if (dtTmDiff<=((2*unitSize["hour"])+(15*unitSize["minute"]))) // <= 2 hours 15 minutes
			{
				DAR_HELPERS.tickDiff = [15,"Minutes"];
				if ((maxDtTm.getMinutes()%15) != 0 || ((maxDtTm.getMinutes()%15) == 0 && (maxDtTm.getSeconds()>0 || maxDtTm.getMilliseconds()>0)))
					maxDtTm.setMinutes(maxDtTm.getMinutes()+(15-(maxDtTm.getMinutes()%15)));
				maxDtTm.setMilliseconds(0);
				maxDtTm.setSeconds(0);
				tickVals.push(maxDtTm.getTime());
				while (maxDtTm.getTime() > minDtTm.getTime())
				{
					maxDtTm.setMinutes(maxDtTm.getMinutes()-15);
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
			else if (dtTmDiff<=(unitSize["day"]+(2*unitSize["hour"]))) // <= 1 day 2 hours
			{
				DAR_HELPERS.tickDiff = [2,"Hours"];
				if ((maxDtTm.getHours()%2) != 0 || ((maxDtTm.getHours()%2) == 0 && (maxDtTm.getMinutes()>0 || maxDtTm.getSeconds()>0 || maxDtTm.getMilliseconds()>0)))
					maxDtTm.setHours(maxDtTm.getHours()+(2-(maxDtTm.getHours()%2)));
				maxDtTm.setMilliseconds(0);
				maxDtTm.setSeconds(0);
				maxDtTm.setMinutes(0);
				tickVals.push(maxDtTm.getTime());
				while (maxDtTm.getTime() > minDtTm.getTime())
				{
					maxDtTm.setHours(maxDtTm.getHours()-2);
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
			else if (dtTmDiff<=((2*unitSize["day"])+(4*unitSize["hour"]))) // <= 2 days 4 hours
			{
				DAR_HELPERS.tickDiff = [4,"Hours"];
				if ((maxDtTm.getHours()%4) != 0 || ((maxDtTm.getHours()%4) == 0 && (maxDtTm.getMinutes()>0 || maxDtTm.getSeconds()>0 || maxDtTm.getMilliseconds()>0)))
					maxDtTm.setHours(maxDtTm.getHours()+(4-(maxDtTm.getHours()%4)));
				maxDtTm.setMilliseconds(0);
				maxDtTm.setSeconds(0);
				maxDtTm.setMinutes(0);
				tickVals.push(maxDtTm.getTime());
				while (maxDtTm.getTime() > minDtTm.getTime())
				{
					maxDtTm.setHours(maxDtTm.getHours()-4);
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
			else if (dtTmDiff<=(15*unitSize["day"])) // <= 2 weeks 1 day
			{
				DAR_HELPERS.tickDiff = [1,"Date"];
				if (maxDtTm.getMilliseconds()>0 || maxDtTm.getSeconds()>0 || maxDtTm.getMinutes()>0 || maxDtTm.getHours()>0)
					maxDtTm.setDate(maxDtTm.getDate()+1);
				maxDtTm.setMilliseconds(0);
				maxDtTm.setSeconds(0);
				maxDtTm.setMinutes(0);
				maxDtTm.setHours(0);
				tickVals.push(maxDtTm.getTime());
				while (maxDtTm.getTime() > minDtTm.getTime())
				{
					maxDtTm.setDate(maxDtTm.getDate()-1);
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
			else if (dtTmDiff<=((2*unitSize["month"])+(7*unitSize["day"]))) // <= 2 months 1 week
			{
				DAR_HELPERS.tickDiff = [7,"Date"];
				if (maxDtTm.getMilliseconds()>0 || maxDtTm.getSeconds()>0 || maxDtTm.getMinutes()>0 || maxDtTm.getHours()>0)
					maxDtTm.setDate(maxDtTm.getDate()+1);
				maxDtTm.setMilliseconds(0);
				maxDtTm.setSeconds(0);
				maxDtTm.setMinutes(0);
				maxDtTm.setHours(0);
				tickVals.push(maxDtTm.getTime());
				while (maxDtTm.getTime() > minDtTm.getTime())
				{
					maxDtTm.setDate(maxDtTm.getDate()-7);
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
			else // > 2 month
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
			tickVals.reverse();
			if (tickVals[tickVals.length-1] > new Date().getTime())
				tickVals[tickVals.length-1] = new Date().getTime();
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
		this.performOnZoom = function(plot){};
		// prop: performAfterZoom
		// function to perform after zooming complete
		this.performAfterZoom = function(plot){};
        // prop: showTooltip
        // show a cursor position tooltip near the cursor
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
		this.zoomOnController = false;
        this.zoomTarget = false;
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
        this._zoom = {start:[], end:[], started: false, zooming:false, isZoomed:false, axes:{start:{}, end:{}}};
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
        $.extend(true, this, options);
    };
    
    $.jqplot.Cursor.cursorLegendFormatString = '%s x:%s, y:%s';
    
    // called with scope of plot
    $.jqplot.Cursor.init = function (target, data, opts){
        // add a cursor attribute to the plot
        var options = opts || {};
        this.plugins.cursor = new $.jqplot.Cursor(options.cursor);
        var c = this.plugins.cursor;

        if (c.show) {
            $.jqplot.eventListenerHooks.push(['jqplotMouseEnter', handleMouseEnter]);
            $.jqplot.eventListenerHooks.push(['jqplotMouseLeave', handleMouseLeave]);
            $.jqplot.eventListenerHooks.push(['jqplotMouseMove', handleMouseMove]);
            
            if (c.showCursorLegend) {              
                opts.legend = opts.legend || {};
                opts.legend.renderer =  $.jqplot.CursorLegendRenderer;
                opts.legend.formatString = this.plugins.cursor.cursorLegendFormatString;
                opts.legend.show = true;
            }
            
            if (c.zoom) {
                $.jqplot.eventListenerHooks.push(['jqplotMouseDown', handleMouseDown]);
                $.jqplot.eventListenerHooks.push(['jqplotMouseUp', handleMouseUp]);
                
                if (c.clickReset) {
                    $.jqplot.eventListenerHooks.push(['jqplotClick', handleClick]);
                }
                
                if (c.dblClickReset) {
                    $.jqplot.eventListenerHooks.push(['jqplotDblClick', handleDblClick]);
                }
            }
    
            this.resetZoom = function() {
                var axes = this.axes;
                if (!c.zoomProxy) {
                    for (var ax in axes) {
                        axes[ax].reset();
                    }
                    this.replot();
                }
                else {
                    var ctx = this.plugins.cursor.zoomCanvas._ctx;
                    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                }
                this.plugins.cursor._zoom.isZoomed = false;
                this.target.trigger('jqplotResetZoom', [this, this.plugins.cursor]);
            };
            

            if (c.showTooltipDataPosition) {
                c.showTooltipUnitPosition = false;
                c.showTooltipGridPosition = false;
                if (options.cursor.tooltipFormatString == undefined) {
                    c.tooltipFormatString = $.jqplot.Cursor.cursorLegendFormatString;
                }
            }
        }
    };
    
    // called with context of plot
    $.jqplot.Cursor.postDraw = function() {
        var c = this.plugins.cursor;
        // if (c.zoom) {
        c.zoomCanvas = new $.jqplot.GenericCanvas();
        this.eventCanvas._elem.before(c.zoomCanvas.createElement(this._gridPadding, 'jqplot-zoom-canvas', this._plotDimensions));
        var zctx = c.zoomCanvas.setContext();
        // }
        c._tooltipElem = $('<div class="jqplot-cursor-tooltip" style="position:absolute;display:none"></div>');
        c.zoomCanvas._elem.before(c._tooltipElem);
        if (c.showVerticalLine || c.showHorizontalLine) {
            c.cursorCanvas = new $.jqplot.GenericCanvas();
            this.eventCanvas._elem.before(c.cursorCanvas.createElement(this._gridPadding, 'jqplot-cursor-canvas', this._plotDimensions));
            var zctx = c.cursorCanvas.setContext();
        }

        // if we are showing the positions in unit coordinates, and no axes groups
        // were specified, create a default set.
        if (c.showTooltipUnitPosition){
            if (c.tooltipAxisGroups.length === 0) {
                var series = this.series;
                var s;
                var temp = [];
                for (var i=0; i<series.length; i++) {
                    s = series[i];
                    var ax = s.xaxis+','+s.yaxis;
                    if ($.inArray(ax, temp) == -1) {
                        temp.push(ax);
                    }
                }
                for (var i=0; i<temp.length; i++) {
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
		cc.zoomOnController = zoomOnController;
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
            for (var ax in axes) {
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
				
				for (var i=0;i<targetPlot.series.length;i++)
				{
					var sObj = targetPlot.series[i];
					var dStr = ax.match(/^[xy]/);
					if (sObj.show && sObj[dStr+"axis"] == ax)
					{
						var minStr = (dStr=="x")?"minX":"minY";
						var maxStr = (dStr=="x")?"maxX":"maxY";
						if (sObj[minStr] && sObj[minStr] < newMin)
							newMin = sObj[minStr];
						if (sObj[maxStr] && sObj[maxStr] > newMax)
							newMax = sObj[maxStr];
					}
				}
				if (newMin != Number.POSITIVE_INFINITY)
				{
					axes[ax].min = (newMin > 0 && (newMin*0.9) < 0)?0:newMin*0.9;
					axes[ax].numberTicks = null;
					axes[ax].tickInterval = null;
					axes[ax].daTickInterval = null;
				}
				if (newMax != Number.NEGATIVE_INFINITY)
				{
					axes[ax].max = newMax*1.1;
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
        if ((!plot.plugins.cursor.zoomProxy || plot.plugins.cursor.zoomOnController) && cursor._zoom.isZoomed) {
            for (var ax in axes) {
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
            ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        }
        plot.target.trigger('jqplotResetZoom', [plot, cursor]);
    };
    
    $.jqplot.Cursor.resetZoom = function(plot) {
        plot.resetZoom();
    };
    
    $.jqplot.Cursor.prototype.doZoom = function (gridpos, datapos, plot, cursor) {
		this.performOnZoom(plot);
        var c = cursor;
        var axes = plot.axes;
        var zaxes = c._zoom.axes;
        var start = zaxes.start;
        var end = zaxes.end;
        var min, max;
        var ctx = plot.plugins.cursor.zoomCanvas._ctx;
        // don't zoom if zoom area is too small (in pixels)
        if ((c.constrainZoomTo == 'none' && Math.abs(gridpos.x - c._zoom.start[0]) > 6 && Math.abs(gridpos.y - c._zoom.start[1]) > 6) || (c.constrainZoomTo == 'x' && Math.abs(gridpos.x - c._zoom.start[0]) > 6) ||  (c.constrainZoomTo == 'y' && Math.abs(gridpos.y - c._zoom.start[1]) > 6)) {
            if (!plot.plugins.cursor.zoomProxy || plot.plugins.cursor.zoomOnController) {
                for (var ax in datapos) {
                    // make a copy of the original axes to revert back.
                    if (c._zoom.axes[ax] == undefined) {
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
                        c._zoom.axes[ax].max = axes[ax].max;
                    }
                    if ((c.constrainZoomTo == 'none') || (c.constrainZoomTo == 'x' && ax.charAt(0) == 'x') || (c.constrainZoomTo == 'y' && ax.charAt(0) == 'y')) {   
                        dp = datapos[ax];
                        if (dp != null) {           
                            if (dp > start[ax]) {
								var newMin = (axes[ax].renderer == $.jqplot.DateAxisRenderer)?(Date.create(start[ax])).round(c.snapZoomTo,'down'):start[ax];
								var newMax = (axes[ax].renderer == $.jqplot.DateAxisRenderer)?(Date.create(dp)).round(c.snapZoomTo,'up'):dp;
                            }
                            else {
								span = start[ax] - dp;
								var newMin = (axes[ax].renderer == $.jqplot.DateAxisRenderer)?(Date.create(dp)).round(c.snapZoomTo,'down'):dp;
								var newMax = (axes[ax].renderer == $.jqplot.DateAxisRenderer)?(Date.create(start[ax])).round(c.snapZoomTo,'up'):start[ax];
                            }
							if (newMin != newMax)
							{
								axes[ax].min = newMin;
								axes[ax].max = newMax;
							}
                            axes[ax].tickInterval = null;
                            // for date axes...
                            axes[ax].daTickInterval = null;
                            axes[ax]._ticks = [];
                        }
						if (axes[ax].autoscaleOnZoom != null)
							axes[ax].autoscale = this.autoscaleOnZoom;
                    }
                }
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                plot.redraw();
                c._zoom.isZoomed = true;
            }
			this.performAfterZoom(plot);
            plot.target.trigger('jqplotZoom', [gridpos, datapos, plot, cursor]);
        }
    };
    
    $.jqplot.preInitHooks.push($.jqplot.Cursor.init);
    $.jqplot.postDrawHooks.push($.jqplot.Cursor.postDraw);
    
    function updateTooltip(gridpos, datapos, plot) {
        var c = plot.plugins.cursor;
        var s = '';
        var addbr = false;
        if (c.showTooltipGridPosition) {
            s = gridpos.x+', '+gridpos.y;
            addbr = true;
        }
        if (c.showTooltipUnitPosition) {
            var g;
            for (var i=0; i<c.tooltipAxisGroups.length; i++) {
                g = c.tooltipAxisGroups[i];
                if (addbr) {
                    s += '<br />';
                }
                if (c.useAxesFormatters) {
                    var xf = plot.axes[g[0]]._ticks[0].formatter;
                    var yf = plot.axes[g[1]]._ticks[0].formatter;
                    var xfstr = plot.axes[g[0]]._ticks[0].formatString;
                    var yfstr = plot.axes[g[1]]._ticks[0].formatString;
                    s += xf(xfstr, datapos[g[0]]) + ', '+ yf(yfstr, datapos[g[1]]);
                }
                else {
                    s += $.jqplot.sprintf(c.tooltipFormatString, datapos[g[0]], datapos[g[1]]);
                }
                addbr = true;
            }
        }
        
        if (c.showTooltipDataPosition) {
            var series = plot.series; 
            var ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);
            var addbr = false;
        
            for (var i = 0; i< series.length; i++) {
                if (series[i].show) {
                    var idx = series[i].index;
                    var label = series[i].label.toString();
                    var cellid = $.inArray(idx, ret.indices);
                    var sx = undefined;
                    var sy = undefined;
                    if (cellid != -1) {
                        var data = ret.data[cellid].data;
                        if (c.useAxesFormatters) {
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
                        if (addbr) {
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
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        if (c.showVerticalLine) {
            c.shapeRenderer.draw(ctx, [[gridpos.x, 0], [gridpos.x, ctx.canvas.height]]);
        }
        if (c.showHorizontalLine) {
            c.shapeRenderer.draw(ctx, [[0, gridpos.y], [ctx.canvas.width, gridpos.y]]);
        }
        var ret = getIntersectingPoints(plot, gridpos.x, gridpos.y);
        if (c.showCursorLegend) {
            var cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');
            for (var i=0; i<cells.length; i++) {
                var idx = $(cells[i]).data('seriesIndex');
                var series = plot.series[idx];
                var label = series.label.toString();
                var cellid = $.inArray(idx, ret.indices);
                var sx = undefined;
                var sy = undefined;
                if (cellid != -1) {
                    var data = ret.data[cellid].data;
                    if (c.useAxesFormatters) {
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
                if (plot.legend.escapeHtml) {
                    $(cells[i]).text($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
                }
                else {
                    $(cells[i]).html($.jqplot.sprintf(c.cursorLegendFormatString, label, sx, sy));
                }
            }        
        }
    }
        
    function getIntersectingPoints(plot, x, y) {
        var ret = {indices:[], data:[]};
        var s, i, d0, d, j, r;
        var threshold;
        var c = plot.plugins.cursor;
        for (var i=0; i<plot.series.length; i++) {
            s = plot.series[i];
            r = s.renderer;
            if (s.show) {
                threshold = c.intersectionThreshold;
                if (s.showMarker) {
                    threshold += s.markerRenderer.size/2;
                }
                for (var j=0; j<s.gridData.length; j++) {
                    p = s.gridData[j];
                    // check vertical line
                    if (c.showVerticalLine) {
                        if (Math.abs(x-p[0]) <= threshold) {
                            ret.indices.push(i);
                            ret.data.push({seriesIndex: i, pointIndex:j, gridData:p, data:s.data[j]});
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
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - c.tooltipOffset - elem.outerHeight(true);
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default:
                var x = gridpos.x + plot._gridPadding.left + c.tooltipOffset;
                var y = gridpos.y + plot._gridPadding.top + c.tooltipOffset;
                break;
        }
            
        c._tooltipElem.css('left', x);
        c._tooltipElem.css('top', y);
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
                var a = (grid.left + (plot._plotDimensions.width - grid.right))/2 - elem.outerWidth(true)/2;
                var b = grid.top + c.tooltipOffset;
                elem.css('left', a);
                elem.css('top', b);
                break;
            case 'ne':
                var a = grid.right + c.tooltipOffset;
                var b = grid.top + c.tooltipOffset;
                elem.css({right:a, top:b});
                break;
            case 'e':
                var a = grid.right + c.tooltipOffset;
                var b = (grid.top + (plot._plotDimensions.height - grid.bottom))/2 - elem.outerHeight(true)/2;
                elem.css({right:a, top:b});
                break;
            case 'se':
                var a = grid.right + c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({right:a, bottom:b});
                break;
            case 's':
                var a = (grid.left + (plot._plotDimensions.width - grid.right))/2 - elem.outerWidth(true)/2;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({left:a, bottom:b});
                break;
            case 'sw':
                var a = grid.left + c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({left:a, bottom:b});
                break;
            case 'w':
                var a = grid.left + c.tooltipOffset;
                var b = (grid.top + (plot._plotDimensions.height - grid.bottom))/2 - elem.outerHeight(true)/2;
                elem.css({left:a, top:b});
                break;
            default:  // same as 'se'
                var a = grid.right - c.tooltipOffset;
                var b = grid.bottom + c.tooltipOffset;
                elem.css({right:a, bottom:b});
                break;
        }
    }
    
    function handleClick (ev, gridpos, datapos, neighbor, plot) {
        ev.stopPropagation();
        ev.preventDefault();
        var c = plot.plugins.cursor;
        if (c.clickReset) {
            c.resetZoom(plot, c);
        }
        return false;
    }
    
    function handleDblClick (ev, gridpos, datapos, neighbor, plot) {
        ev.stopPropagation();
        ev.preventDefault();
        var c = plot.plugins.cursor;
        if (c.dblClickReset) {
            c.resetZoom(plot, c);
        }
        return false;
    }
    
    function handleMouseLeave(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        if (c.show) {
            $(ev.target).css('cursor', c.previousCursor);
            if (c.showTooltip) {
                c._tooltipElem.hide();
            }
            if (c.zoom) {
                c._zoom.started = false;
                c._zoom.zooming = false;
                if (!c.zoomProxy) {
                    var ctx = c.zoomCanvas._ctx;
                    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                }
            }
            if (c.showVerticalLine || c.showHorizontalLine) {
                var ctx = c.cursorCanvas._ctx;
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
            } if (c.showCursorLegend) {
            var cells = $(plot.targetId + ' td.jqplot-cursor-legend-label');
            for (var i=0; i<cells.length; i++) {
                var idx = $(cells[i]).data('seriesIndex');
                var series = plot.series[idx];
                var label = series.label.toString();
                if (plot.legend.escapeHtml) {
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
        if (c.show) {
            c.previousCursor = ev.target.style.cursor;
            ev.target.style.cursor = c.style;
            if (c.showTooltip) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
                else {
                    positionTooltip(plot);
                }
                c._tooltipElem.show();
            }
            if (c.showVerticalLine || c.showHorizontalLine) {
                moveLine(gridpos, plot);
            }
        }
    }
    
    function handleMouseMove(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        var ctx = c.zoomCanvas._ctx;
        if (c.show) {
            if (c.showTooltip) {
                updateTooltip(gridpos, datapos, plot);
                if (c.followMouse) {
                    moveTooltip(gridpos, plot);
                }
            }
            if (c.zoom && c._zoom.started && !c.zoomTarget) {
                c._zoom.zooming = true;
                if (c.constrainZoomTo == 'x') {
                    c._zoom.end = [gridpos.x, ctx.canvas.height];
                }
                else if (c.constrainZoomTo == 'y') {
                    c._zoom.end = [ctx.canvas.width, gridpos.y];
                }
                else {
                    c._zoom.end = [gridpos.x, gridpos.y];
                }
                drawZoomBox.call(c);
            }
            if (c.showVerticalLine || c.showHorizontalLine) {
                moveLine(gridpos, plot);
            }
        }
    }
    
    function handleMouseDown(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        var axes = plot.axes;
        if (c.zoom) {
            if (!c.zoomProxy) {
                var ctx = c.zoomCanvas._ctx;
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
            }
            if (c.constrainZoomTo == 'x') {
                c._zoom.start = [gridpos.x, 0];
            }
            else if (c.constrainZoomTo == 'y') {
                c._zoom.start = [0, gridpos.y];
            }
            else {
                c._zoom.start = [gridpos.x, gridpos.y];
            }
            c._zoom.started = true;
            for (var ax in datapos) {
                // get zoom starting position.
                c._zoom.axes.start[ax] = datapos[ax];
            }
        }
    }
    
    function handleMouseUp(ev, gridpos, datapos, neighbor, plot) {
        var c = plot.plugins.cursor;
        if (c.zoom && c._zoom.zooming && !c.zoomTarget) {
            c.doZoom(gridpos, datapos, plot, c);
        }
        c._zoom.started = false;
        c._zoom.zooming = false;
    }
    
    $.jqplot.CursorLegendRenderer = function(options) {
        $.jqplot.TableLegendRenderer.call(this, options);
        this.formatString = '%s';
    };
    
    $.jqplot.CursorLegendRenderer.prototype = new $.jqplot.TableLegendRenderer();
    $.jqplot.CursorLegendRenderer.prototype.constructor = $.jqplot.CursorLegendRenderer;
    
    // called in context of a Legend
    $.jqplot.CursorLegendRenderer.prototype.draw = function() {
        if (this.show) {
            var series = this._series;
            // make a table.  one line label per row.
            this._elem = $('<table class="jqplot-legend jqplot-cursor-legend" style="position:absolute"></table>');
        
            var pad = false;
            for (var i = 0; i< series.length; i++) {
                s = series[i];
                if (s.show) {
                    var lt = $.jqplot.sprintf(this.formatString, s.label.toString());
                    if (lt) {
                        var color = s.color;
                        if (s._stack && !s.fill) {
                            color = '';
                        }
                        addrow.call(this, lt, color, pad, i);
                        pad = true;
                    }
                    // let plugins add more rows to legend.  Used by trend line plugin.
                    for (var j=0; j<$.jqplot.addLegendRowHooks.length; j++) {
                        var item = $.jqplot.addLegendRowHooks[j].call(this, s);
                        if (item) {
                            addrow.call(this, item.label, item.color, pad);
                            pad = true;
                        } 
                    }
                }
            }
        }
        
        function addrow(label, color, pad, idx) {
            var rs = (pad) ? this.rowSpacing : '0';
            var tr = $('<tr class="jqplot-legend jqplot-cursor-legend"></tr>').appendTo(this._elem);
            tr.data('seriesIndex', idx);
            $('<td class="jqplot-legend jqplot-cursor-legend-swatch" style="padding-top:'+rs+';">'+
                '<div style="border:1px solid #cccccc;padding:0.2em;">'+
                '<div class="jqplot-cursor-legend-swatch" style="background-color:'+color+';"></div>'+
                '</div></td>').appendTo(tr);
            var td = $('<td class="jqplot-legend jqplot-cursor-legend-label" style="vertical-align:middle;padding-top:'+rs+';"></td>');
            td.appendTo(tr);
            td.data('seriesIndex', idx);
            if (this.escapeHtml) {
                td.text(label);
            }
            else {
                td.html(label);
            }
        }
        return this._elem;
    };
    
})(jQuery);

function drawZoomBox() {
	var start = this._zoom.start;
	var end = this._zoom.end;
	var ctx = this.zoomCanvas._ctx;
	var l, t, h, w;
	if (end[0] > start[0]) {
		l = start[0];
		w = end[0] - start[0];
	}
	else {
		l = end[0];
		w = start[0] - end[0];
	}
	if (end[1] > start[1]) {
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
	ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
	ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
	ctx.clearRect(l, t, w, h);
	// IE won't show transparent fill rect, so stroke a rect also.
	ctx.strokeRect(l,t,w,h);
	if ($.browser.msie)
		ctx.fillRect(l,t,w,h);
}

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
        // prop: tooltipFade
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
        this._tooltipElem;
        this.isHighlighting = false;

        $.extend(true, this, options);
    };
    
    // axis.renderer.tickrenderer.formatter
    
    // called with scope of plot
    $.jqplot.Highlighter.init = function (target, data, opts){
        var options = opts || {};
        // add a highlighter attribute to the plot
        this.plugins.highlighter = new $.jqplot.Highlighter(options.highlighter);
    };
    
    // called within scope of series
    $.jqplot.Highlighter.parseOptions = function (defaults, options) {
        this.showHighlight = true;
    };
    
    // called within context of plot
    // create a canvas which we can draw on.
    // insert it before the eventCanvas, so eventCanvas will still capture events.
    $.jqplot.Highlighter.postPlotDraw = function() {
        this.plugins.highlighter.highlightCanvas = new $.jqplot.GenericCanvas();
        
        this.eventCanvas._elem.before(this.plugins.highlighter.highlightCanvas.createElement(this._gridPadding, 'jqplot-highlight-canvas', this._plotDimensions));
        var hctx = this.plugins.highlighter.highlightCanvas.setContext();
        
        var p = this.plugins.highlighter;
        p._tooltipElem = $('<div class="jqplot-highlighter-tooltip" style="position:absolute;display:none"></div>');
        this.target.append(p._tooltipElem);
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
        if (hl.useAxesFormatters) {
            var xf = series._xaxis._ticks[0].formatter;
            var yf = series._yaxis._ticks[0].formatter;
            var xfstr = series._xaxis._ticks[0].formatString;
            var yfstr = series._yaxis._ticks[0].formatString;
            var str;
            var xstr = xf(xfstr, neighbor.data[0]);
            var ystrs = [];
            for (var i=1; i<hl.yvalues+1; i++) {
                ystrs.push(yf(yfstr, neighbor.data[i]));
            }
            if (hl.formatString) {
                switch (hl.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        ystrs.unshift(xstr);
                        ystrs.unshift(hl.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'yx':
                        ystrs.push(xstr);
                        ystrs.unshift(hl.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    case 'x':
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, [hl.formatString, xstr]);
                        break;
                    case 'y':
                        ystrs.unshift(hl.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                    default: // same as xy
                        ystrs.unshift(xstr);
                        ystrs.unshift(hl.formatString);
                        str = $.jqplot.sprintf.apply($.jqplot.sprintf, ystrs);
                        break;
                } 
            }
            else {
                switch (hl.tooltipAxes) {
                    case 'both':
                    case 'xy':
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += hl.tooltipSeparator + ystrs[i];
                        }
                        break;
                    case 'yx':
                        str = '';
                        for (var i=0; i<ystrs.length; i++) {
                            str += ystrs[i] + hl.tooltipSeparator;
                        }
                        str += xstr;
                        break;
                    case 'x':
                        str = xstr;
                        break;
                    case 'y':
                        str = '';
                        for (var i=0; i<ystrs.length; i++) {
                            str += ystrs[i] + hl.tooltipSeparator;
                        }
                        break;
                    default: // same as 'xy'
                        str = xstr;
                        for (var i=0; i<ystrs.length; i++) {
                            str += hl.tooltipSeparator + ystrs[i];
                        }
                        break;
                    
                }                
            }
        }
        else {
            var str;
            if (hl.tooltipAxes == 'both' || hl.tooltipAxes == 'xy') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[0]) + hl.tooltipSeparator + $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[1]);
            }
            else if (hl.tooltipAxes == 'yx') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[1]) + hl.tooltipSeparator + $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[0]);
            }
            else if (hl.tooltipAxes == 'x') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[0]);
            }
            else if (hl.tooltipAxes == 'y') {
                str = $.jqplot.sprintf(hl.tooltipFormatString, neighbor.data[1]);
            } 
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
            ms = (series.markerRenderer.size + hl.sizeAdjust)/2;
        }
        switch (hl.tooltipLocation) {
            case 'nw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'n':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - ms;
                break;
            case 'ne':
                var x = gridpos.x + plot._gridPadding.left + hl.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
            case 'e':
                var x = gridpos.x + plot._gridPadding.left + hl.tooltipOffset + ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            case 'se':
                var x = gridpos.x + plot._gridPadding.left + hl.tooltipOffset + fact * ms;
                var y = gridpos.y + plot._gridPadding.top + hl.tooltipOffset + fact * ms;
                break;
            case 's':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true)/2;
                var y = gridpos.y + plot._gridPadding.top + hl.tooltipOffset + ms;
                break;
            case 'sw':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top + hl.tooltipOffset + fact * ms;
                break;
            case 'w':
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - ms;
                var y = gridpos.y + plot._gridPadding.top - elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                var x = gridpos.x + plot._gridPadding.left - elem.outerWidth(true) - hl.tooltipOffset - fact * ms;
                var y = gridpos.y + plot._gridPadding.top - hl.tooltipOffset - elem.outerHeight(true) - fact * ms;
                break;
        }
        elem.css('left', x);
        elem.css('top', y);
        if (hl.fadeTooltip) {
            elem.fadeIn(hl.tooltipFadeSpeed);
        }
        else {
            elem.show();
        }
        
    }
    
    function handleMove(ev, gridpos, datapos, neighbor, plot) {
        var hl = plot.plugins.highlighter;
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
				hl.isHighlighting = false;
				HIGHLIGHTER_HELPERS.isHighlighting = false;
            }
            if (neighbor != null && plot.series[neighbor.seriesIndex].showHighlight && !hl.isHighlighting && !HIGHLIGHTER_HELPERS.isHighlighting) {
                hl.isHighlighting = true;
				HIGHLIGHTER_HELPERS.isHighlighting = true;
                if (hl.showMarker) {
                    draw(plot, neighbor);
                }
                if (hl.showTooltip) {
                    showTooltip(plot, plot.series[neighbor.seriesIndex], neighbor);
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
        // if null, will use the last element of teh data point array.
        this.seriesLabelIndex = null;
        // prop: labels
        // array of arrays of labels, one array for each series.
        this.labels = [];
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
        this.edgeTolerance = 0;
        // prop: hideZeros
        // true to not show a label for a value which is 0.
        this.hideZeros = false;
        
        $.extend(true, this, options);
    };
    
    var locations = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    var locationIndicies = {'nw':0, 'n':1, 'ne':2, 'e':3, 'se':4, 's':5, 'sw':6, 'w':7};
    var oppositeLocations = ['se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];
    
    // called with scope of a series
    $.jqplot.PointLabels.init = function (target, data, seriesDefaults, opts){
        var options = $.extend(true, {}, seriesDefaults, opts);
        // add a pointLabels attribute to the series plugins
        this.plugins.pointLabels = new $.jqplot.PointLabels(options.pointLabels);
        var p = this.plugins.pointLabels;
        if (p.labels.length == 0 || p.labelsFromSeries) {
            if (p.stackedValue) {
                if (this._plotData.length && this._plotData[0].length){
                    var idx = p.seriesLabelIndex || this._plotData[0].length -1;
                    for (var i=0; i<this._plotData.length; i++) {
                        p.labels.push(this._plotData[i][idx]);
                    }
                }
            }
            else {
                var d = this.data;
                if (this.renderer.constructor == $.jqplot.BarRenderer && this.waterfall) {
                    d = this._data;
                }
                if (d.length && d[0].length) {
                    var idx = p.seriesLabelIndex || d[0].length -1;
                    for (var i=0; i<d.length; i++) {
                        p.labels.push(d[i][idx]);
                    }
                }
            }
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
                offset = -elem.outerWidth(true)/2;
                break;
            case 'ne':
                offset =  this.xpadding;
                break;
            case 'e':
                offset = this.xpadding;
                break;
            case 'se':
                offset = this.xpadding;
                break;
            case 's':
                offset = -elem.outerWidth(true)/2;
                break;
            case 'sw':
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
            case 'w':
                offset = -elem.outerWidth(true) - this.xpadding;
                break;
            default: // same as 'nw'
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
                offset = -elem.outerHeight(true)/2;
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
                offset = -elem.outerHeight(true)/2;
                break;
            default: // same as 'nw'
                offset = -elem.outerHeight(true) - this.ypadding;
                break;
        }
        return offset; 
    };
    
    // called with scope of series
    $.jqplot.PointLabels.draw = function (sctx, options) {
        var p = this.plugins.pointLabels;
        if (p.show) {
            // var xoffset, yoffset;
            //         
            // switch (p.location) {
            //     case 'nw':
            //         xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; };
            //         yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; };
            //         break;
            //     case 'n':
            //         xoffset = function(elem) { return -elem.outerWidth(true)/2; };
            //         yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; };
            //         break;
            //     case 'ne':
            //         xoffset = function(elem) { return p.xpadding; };
            //         yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; };
            //         break;
            //     case 'e':
            //         xoffset = function(elem) { return p.xpadding; };
            //         yoffset = function(elem) { return -elem.outerHeight(true)/2; };
            //         break;
            //     case 'se':
            //         xoffset = function(elem) { return p.xpadding; };
            //         yoffset = function(elem) { return p.ypadding; };
            //         break;
            //     case 's':
            //         xoffset = function(elem) { return -elem.outerWidth(true)/2; };
            //         yoffset = function(elem) { return p.ypadding; };
            //         break;
            //     case 'sw':
            //         xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; };
            //         yoffset = function(elem) { return p.ypadding; };
            //         break;
            //     case 'w':
            //         xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; };
            //         yoffset = function(elem) { return -elem.outerHeight(true)/2; };
            //         break;
            //     default: // same as 'nw'
            //         xoffset = function(elem) { return -elem.outerWidth(true) - p.xpadding; };
            //         yoffset = function(elem) { return -elem.outerHeight(true) - p.ypadding; };
            //         break;
            // }        
            for (var i=0; i<p.labels.length; i++) {
                var pd = this._plotData;
                var xax = this._xaxis;
                var yax = this._yaxis;
                var label = p.labels[i];
                
                if (p.hideZeros && parseInt(p.labels[i], 10) == 0) {
                    label = '';
                }
                
                var elem = $('<div class="jqplot-point-label" style="position:absolute"></div>');
                elem.insertAfter(sctx.canvas);
                if (p.escapeHTML) {
                    elem.text(label);
                }
                else {
                    elem.html(label);
                }
                var location = p.location;
                if (this.waterfall && parseInt(label, 10) < 0) {
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
                if (ell - et < scl || elt - et < sct || elr + et > scr || elb + et > scb) {
                    $(elem).remove();
                }
            }
        }
    };
    
    $.jqplot.postSeriesInitHooks.push($.jqplot.PointLabels.init);
    $.jqplot.postDrawSeriesHooks.push($.jqplot.PointLabels.draw);
})(jQuery);