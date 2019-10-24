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