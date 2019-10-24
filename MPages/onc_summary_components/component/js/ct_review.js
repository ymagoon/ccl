(function(a3){function al(b,a){return function(c){return aX(b.call(this,c),a)
}
}function an(a){return function(b){return this.lang().ordinal(a.call(this,b))
}
}function a8(){}function ay(a){at(this,a)
}function ak(j){var m=this._data={},d=j.years||j.year||j.y||0,b=j.months||j.month||j.M||0,g=j.weeks||j.week||j.w||0,p=j.days||j.day||j.d||0,c=j.hours||j.hour||j.h||0,l=j.minutes||j.minute||j.m||0,k=j.seconds||j.second||j.s||0,h=j.milliseconds||j.millisecond||j.ms||0;
this._milliseconds=h+k*1000+l*60000+c*3600000,this._days=p+g*7,this._months=b+d*12,m.milliseconds=h%1000,k+=aA(h/1000),m.seconds=k%60,l+=aA(k/60),m.minutes=l%60,c+=aA(l/60),m.hours=c%24,p+=aA(c/24),p+=g*7,m.days=p%30,b+=aA(p/30),m.months=b%12,d+=aA(b/12),m.years=d
}function at(b,a){for(var c in a){a.hasOwnProperty(c)&&(b[c]=a[c])
}return b
}function aA(a){return a<0?Math.ceil(a):Math.floor(a)
}function aX(b,a){var c=b+"";
while(c.length<a){c="0"+c
}return c
}function aw(f,b,h){var d=b._milliseconds,a=b._days,c=b._months,g;
d&&f._d.setTime(+f+d*h),a&&f.date(f.date()+a*h),c&&(g=f.date(),f.date(1).month(f.month()+c*h).date(Math.min(g,f.daysInMonth())))
}function ar(a){return Object.prototype.toString.call(a)==="[object Array]"
}function aO(f,b){var g=Math.min(f.length,b.length),d=Math.abs(f.length-b.length),a=0,c;
for(c=0;
c<g;
c++){~~f[c]!==~~b[c]&&a++
}return a+d
}function ai(b,a){return a.abbr=b,aM[b]||(aM[b]=new a8),aM[b].set(a),aM[b]
}function af(a){return a?(!aM[a]&&aR&&require("./lang/"+a),aM[a]):aL.fn._lang
}function aF(a){return a.match(/\[.*\]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")
}function ad(c){var a=c.match(a7),d,b;
for(d=0,b=a.length;
d<b;
d++){aB[a[d]]?a[d]=aB[a[d]]:a[d]=aF(a[d])
}return function(e){var f="";
for(d=0;
d<b;
d++){f+=typeof a[d].call=="function"?a[d].call(e,c):a[d]
}return f
}
}function ac(c,a){function b(e){return c.lang().longDateFormat(e)||e
}var d=5;
while(d--&&a1.test(a)){a=a.replace(a1,b)
}return az[a]||(az[a]=ad(a)),az[a](c)
}function ae(a){switch(a){case"DDDD":return aP;
case"YYYY":return a4;
case"YYYYY":return aJ;
case"S":case"SS":case"SSS":case"DDD":return aZ;
case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":case"a":case"A":return aT;
case"X":return a6;
case"Z":case"ZZ":return a0;
case"T":return aG;
case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return a5;
default:return new RegExp(a.replace("\\",""))
}}function aE(f,b,g){var d,a,c=g._a;
switch(f){case"M":case"MM":c[1]=b==null?0:~~b-1;
break;
case"MMM":case"MMMM":d=af(g._l).monthsParse(b),d!=null?c[1]=d:g._isValid=!1;
break;
case"D":case"DD":case"DDD":case"DDDD":b!=null&&(c[2]=~~b);
break;
case"YY":c[0]=~~b+(~~b>68?1900:2000);
break;
case"YYYY":case"YYYYY":c[0]=~~b;
break;
case"a":case"A":g._isPm=(b+"").toLowerCase()==="pm";
break;
case"H":case"HH":case"h":case"hh":c[3]=~~b;
break;
case"m":case"mm":c[4]=~~b;
break;
case"s":case"ss":c[5]=~~b;
break;
case"S":case"SS":case"SSS":c[6]=~~(("0."+b)*1000);
break;
case"X":g._d=new Date(parseFloat(b)*1000);
break;
case"Z":case"ZZ":g._useUTC=!0,d=(b+"").match(aH),d&&d[1]&&(g._tzh=~~d[1]),d&&d[2]&&(g._tzm=~~d[2]),d&&d[0]==="+"&&(g._tzh=-g._tzh,g._tzm=-g._tzm)
}b==null&&(g._isValid=!1)
}function aq(c){var a,d,b=[];
if(c._d){return
}for(a=0;
a<7;
a++){c._a[a]=b[a]=c._a[a]==null?a===2?1:0:c._a[a]
}b[3]+=c._tzh||0,b[4]+=c._tzm||0,d=new Date(0),c._useUTC?(d.setUTCFullYear(b[0],b[1],b[2]),d.setUTCHours(b[3],b[4],b[5],b[6])):(d.setFullYear(b[0],b[1],b[2]),d.setHours(b[3],b[4],b[5],b[6])),c._d=d
}function ap(d){var b=d._f.match(a7),f=d._i,c,a;
d._a=[];
for(c=0;
c<b.length;
c++){a=(ae(b[c]).exec(f)||[])[0],a&&(f=f.slice(f.indexOf(a)+a.length)),aB[b[c]]&&aE(b[c],a,d)
}d._isPm&&d._a[3]<12&&(d._a[3]+=12),d._isPm===!1&&d._a[3]===12&&(d._a[3]=0),aq(d)
}function aj(g){var c,j,f,b=99,d,h,a;
while(g._f.length){c=at({},g),c._f=g._f.pop(),ap(c),j=new ay(c);
if(j.isValid()){f=j;
break
}a=aO(c._a,j.toArray()),a<b&&(b=a,f=j)
}at(g,f)
}function av(b){var a,c=b._i;
if(aI.exec(c)){b._f="YYYY-MM-DDT";
for(a=0;
a<4;
a++){if(ah[a][1].exec(c)){b._f+=ah[a][0];
break
}}a0.exec(c)&&(b._f+=" Z"),ap(b)
}else{b._d=new Date(c)
}}function ab(a){var c=a._i,b=aK.exec(c);
c===a3?a._d=new Date:b?a._d=new Date(+b[1]):typeof c=="string"?av(a):ar(c)?(a._a=c.slice(0),aq(a)):a._d=c instanceof Date?new Date(+c):new Date(c)
}function aa(d,b,f,c,a){return a.relativeTime(b||1,!!f,d,c)
}function aQ(h,l,c){var d=aN(Math.abs(h)/1000),m=aN(d/60),b=aN(m/60),k=aN(b/24),j=aN(k/365),g=d<45&&["s",d]||m===1&&["m"]||m<45&&["mm",m]||b===1&&["h"]||b<22&&["hh",b]||k===1&&["d"]||k<=25&&["dd",k]||k<=45&&["M"]||k<345&&["MM",aN(k/30)]||j===1&&["y"]||["yy",j];
return g[2]=l,g[3]=h>0,g[4]=c,aa.apply({},g)
}function a2(d,f,c){var a=c-f,b=c-d.day();
return b>a&&(b-=7),b<a-7&&(b+=7),Math.ceil(aL(d).add("d",b).dayOfYear()/7)
}function aW(b){var c=b._i,a=b._f;
return c===null||c===""?null:(typeof c=="string"&&(b._i=c=af().preparse(c)),aL.isMoment(c)?(b=at({},c),b._d=new Date(+c._d)):a?ar(a)?aj(b):ap(b):ab(b),new ay(b))
}function aD(a,b){aL.fn[a]=aL.fn[a+"s"]=function(d){var c=this._isUTC?"UTC":"";
return d!=null?(this._d["set"+c+b](d),this):this._d["get"+c+b]()
}
}function aC(a){aL.duration.fn[a]=function(){return this._data[a]
}
}function au(a,b){aL.duration.fn["as"+a]=function(){return +this/b
}
}var aL,aS="2.0.0",aN=Math.round,aY,aM={},aR=typeof module!="undefined"&&module.exports,aK=/^\/?Date\((\-?\d+)/i,a7=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,a1=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,aU=/([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,a5=/\d\d?/,aZ=/\d{1,3}/,aP=/\d{3}/,a4=/\d{1,4}/,aJ=/[+\-]?\d{1,6}/,aT=/[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i,a0=/Z|[\+\-]\d\d:?\d\d/i,aG=/T/i,a6=/[\+\-]?\d+(\.\d{1,3})?/,aI=/^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,ax="YYYY-MM-DDTHH:mm:ssZ",ah=[["HH:mm:ss.S",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],aH=/([\+\-]|\d\d)/gi,ag="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),am={Milliseconds:1,Seconds:1000,Minutes:60000,Hours:3600000,Days:86400000,Months:2592000000,Years:31536000000},az={},aV="DDD w W M D d".split(" "),ao="M D H h m s w W".split(" "),aB={M:function(){return this.month()+1
},MMM:function(a){return this.lang().monthsShort(this,a)
},MMMM:function(a){return this.lang().months(this,a)
},D:function(){return this.date()
},DDD:function(){return this.dayOfYear()
},d:function(){return this.day()
},dd:function(a){return this.lang().weekdaysMin(this,a)
},ddd:function(a){return this.lang().weekdaysShort(this,a)
},dddd:function(a){return this.lang().weekdays(this,a)
},w:function(){return this.week()
},W:function(){return this.isoWeek()
},YY:function(){return aX(this.year()%100,2)
},YYYY:function(){return aX(this.year(),4)
},YYYYY:function(){return aX(this.year(),5)
},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)
},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)
},H:function(){return this.hours()
},h:function(){return this.hours()%12||12
},m:function(){return this.minutes()
},s:function(){return this.seconds()
},S:function(){return ~~(this.milliseconds()/100)
},SS:function(){return aX(~~(this.milliseconds()/10),2)
},SSS:function(){return aX(this.milliseconds(),3)
},Z:function(){var b=-this.zone(),a="+";
return b<0&&(b=-b,a="-"),a+aX(~~(b/60),2)+":"+aX(~~b%60,2)
},ZZ:function(){var b=-this.zone(),a="+";
return b<0&&(b=-b,a="-"),a+aX(~~(10*b/6),4)
},X:function(){return this.unix()
}};
while(aV.length){aY=aV.pop(),aB[aY+"o"]=an(aB[aY])
}while(ao.length){aY=ao.pop(),aB[aY+aY]=al(aB[aY],2)
}aB.DDDD=al(aB.DDD,3),a8.prototype={set:function(b){var a,c;
for(c in b){a=b[c],typeof a=="function"?this[c]=a:this["_"+c]=a
}},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]
},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]
},monthsParse:function(d){var f,c,a,b;
this._monthsParse||(this._monthsParse=[]);
for(f=0;
f<12;
f++){this._monthsParse[f]||(c=aL([2000,f]),a="^"+this.months(c,"")+"|^"+this.monthsShort(c,""),this._monthsParse[f]=new RegExp(a.replace(".",""),"i"));
if(this._monthsParse[f].test(d)){return f
}}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]
},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]
},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]
},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(b){var a=this._longDateFormat[b];
return !a&&this._longDateFormat[b.toUpperCase()]&&(a=this._longDateFormat[b.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(c){return c.slice(1)
}),this._longDateFormat[b]=a),a
},meridiem:function(b,a,c){return b>11?c?"pm":"PM":c?"am":"AM"
},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},calendar:function(b,a){var c=this._calendar[b];
return typeof c=="function"?c.apply(a):c
},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(d,b,f,c){var a=this._relativeTime[f];
return typeof a=="function"?a(d,b,f,c):a.replace(/%d/i,d)
},pastFuture:function(b,a){var c=this._relativeTime[b>0?"future":"past"];
return typeof c=="function"?c(a):c.replace(/%s/i,a)
},ordinal:function(a){return this._ordinal.replace("%d",a)
},_ordinal:"%d",preparse:function(a){return a
},postformat:function(a){return a
},week:function(a){return a2(a,this._week.dow,this._week.doy)
},_week:{dow:0,doy:6}},aL=function(b,a,c){return aW({_i:b,_f:a,_l:c,_isUTC:!1})
},aL.utc=function(b,a,c){return aW({_useUTC:!0,_isUTC:!0,_l:c,_i:b,_f:a})
},aL.unix=function(a){return aL(a*1000)
},aL.duration=function(d,g){var c=aL.isDuration(d),a=typeof d=="number",b=c?d._data:a?{}:d,f;
return a&&(g?b[g]=d:b.milliseconds=d),f=new ak(b),c&&d.hasOwnProperty("_lang")&&(f._lang=d._lang),f
},aL.version=aS,aL.defaultFormat=ax,aL.lang=function(b,c){var a;
if(!b){return aL.fn._lang._abbr
}c?ai(b,c):aM[b]||af(b),aL.duration.fn._lang=aL.fn._lang=af(b)
},aL.langData=function(a){return a&&a._lang&&a._lang._abbr&&(a=a._lang._abbr),af(a)
},aL.isMoment=function(a){return a instanceof ay
},aL.isDuration=function(a){return a instanceof ak
},aL.fn=ay.prototype={clone:function(){return aL(this)
},valueOf:function(){return +this._d
},unix:function(){return Math.floor(+this._d/1000)
},toString:function(){return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
},toDate:function(){return this._d
},toJSON:function(){return aL.utc(this).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
},toArray:function(){var a=this;
return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]
},isValid:function(){return this._isValid==null&&(this._a?this._isValid=!aO(this._a,(this._isUTC?aL.utc(this._a):aL(this._a)).toArray()):this._isValid=!isNaN(this._d.getTime())),!!this._isValid
},utc:function(){return this._isUTC=!0,this
},local:function(){return this._isUTC=!1,this
},format:function(a){var b=ac(this,a||aL.defaultFormat);
return this.lang().postformat(b)
},add:function(b,c){var a;
return typeof b=="string"?a=aL.duration(+c,b):a=aL.duration(b,c),aw(this,a,1),this
},subtract:function(b,c){var a;
return typeof b=="string"?a=aL.duration(+c,b):a=aL.duration(b,c),aw(this,a,-1),this
},diff:function(f,h,d){var b=this._isUTC?aL(f).utc():aL(f).local(),c=(this.zone()-b.zone())*60000,g,a;
return h&&(h=h.replace(/s$/,"")),h==="year"||h==="month"?(g=(this.daysInMonth()+b.daysInMonth())*43200000,a=(this.year()-b.year())*12+(this.month()-b.month()),a+=(this-aL(this).startOf("month")-(b-aL(b).startOf("month")))/g,h==="year"&&(a/=12)):(g=this-b-c,a=h==="second"?g/1000:h==="minute"?g/60000:h==="hour"?g/3600000:h==="day"?g/86400000:h==="week"?g/604800000:g),d?a:aA(a)
},from:function(a,b){return aL.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!b)
},fromNow:function(a){return this.from(aL(),a)
},calendar:function(){var a=this.diff(aL().startOf("day"),"days",!0),b=a<-6?"sameElse":a<-1?"lastWeek":a<0?"lastDay":a<1?"sameDay":a<2?"nextDay":a<7?"nextWeek":"sameElse";
return this.format(this.lang().calendar(b,this))
},isLeapYear:function(){var a=this.year();
return a%4===0&&a%100!==0||a%400===0
},isDST:function(){return this.zone()<aL([this.year()]).zone()||this.zone()<aL([this.year(),5]).zone()
},day:function(b){var a=this._isUTC?this._d.getUTCDay():this._d.getDay();
return b==null?a:this.add({d:b-a})
},startOf:function(a){a=a.replace(/s$/,"");
switch(a){case"year":this.month(0);
case"month":this.date(1);
case"week":case"day":this.hours(0);
case"hour":this.minutes(0);
case"minute":this.seconds(0);
case"second":this.milliseconds(0)
}return a==="week"&&this.day(0),this
},endOf:function(a){return this.startOf(a).add(a.replace(/s?$/,"s"),1).subtract("ms",1)
},isAfter:function(a,b){return b=typeof b!="undefined"?b:"millisecond",+this.clone().startOf(b)>+aL(a).startOf(b)
},isBefore:function(a,b){return b=typeof b!="undefined"?b:"millisecond",+this.clone().startOf(b)<+aL(a).startOf(b)
},isSame:function(a,b){return b=typeof b!="undefined"?b:"millisecond",+this.clone().startOf(b)===+aL(a).startOf(b)
},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()
},daysInMonth:function(){return aL.utc([this.year(),this.month()+1,0]).date()
},dayOfYear:function(a){var b=aN((aL(this).startOf("day")-aL(this).startOf("year"))/86400000)+1;
return a==null?b:this.add("d",a-b)
},isoWeek:function(b){var a=a2(this,1,4);
return b==null?a:this.add("d",(b-a)*7)
},week:function(b){var a=this.lang().week(this);
return b==null?a:this.add("d",(b-a)*7)
},lang:function(a){return a===a3?this._lang:(this._lang=af(a),this)
}};
for(aY=0;
aY<ag.length;
aY++){aD(ag[aY].toLowerCase().replace(/s$/,""),ag[aY])
}aD("year","FullYear"),aL.fn.days=aL.fn.day,aL.fn.weeks=aL.fn.week,aL.fn.isoWeeks=aL.fn.isoWeek,aL.duration.fn=ak.prototype={weeks:function(){return aA(this.days()/7)
},valueOf:function(){return this._milliseconds+this._days*86400000+this._months*2592000000
},humanize:function(b){var a=+this,c=aQ(a,!b,this.lang());
return b&&(c=this.lang().pastFuture(a,c)),this.lang().postformat(c)
},lang:aL.fn.lang};
for(aY in am){am.hasOwnProperty(aY)&&(au(aY,am[aY]),aC(aY.toLowerCase()))
}au("Weeks",604800000),aL.lang("en",{ordinal:function(b){var a=b%10,c=~~(b%100/10)===1?"th":a===1?"st":a===2?"nd":a===3?"rd":"th";
return b+c
}}),aR&&(module.exports=aL),typeof ender=="undefined"&&(this.moment=aL),typeof define=="function"&&define.amd&&define("moment",[],function(){return aL
})
}).call(this);
var registerNS=function(d){var c=d.split(".");
var a=window;
var b=0;
for(b=0;
b<c.length;
b++){if(a[c[b]]===null||typeof(a[c[b]])!=="object"){a[c[b]]={}
}a=a[c[b]]
}};
registerNS("com.cerner.oncology.util");
com.cerner.oncology.util=com.cerner.oncology.util;
com.cerner.oncology.util.getViewportWidth=function(){var a=0;
if(document.documentElement&&document.documentElement.clientWidth){a=document.documentElement.clientWidth
}else{if(document.body&&document.body.clientWidth){a=document.body.clientWidth
}else{if(window.innerWidth){a=window.innerWidth-18
}}}return a
};
com.cerner.oncology.util.getViewportHeight=function(){var a=0;
if(document.documentElement&&document.documentElement.clientHeight){a=document.documentElement.clientHeight
}else{if(document.body&&document.body.clientHeight){a=document.body.clientHeight
}else{if(window.innerHeight){a=window.innerHeight-18
}}}return a
};
com.cerner.oncology.util.getViewportScrollX=function(){var a=0;
if(document.documentElement&&document.documentElement.scrollLeft){a=document.documentElement.scrollLeft
}else{if(document.body&&document.body.scrollLeft){a=document.body.scrollLeft
}else{if(window.pageXOffset){a=window.pageXOffset
}else{if(window.scrollX){a=window.scrollX
}}}}return a
};
com.cerner.oncology.util.getViewportScrollY=function(){var a=0;
if(document.documentElement&&document.documentElement.scrollTop){a=document.documentElement.scrollTop
}else{if(document.body&&document.body.scrollTop){a=document.body.scrollTop
}else{if(window.pageYOffset){a=window.pageYOffset
}else{if(window.scrollY){a=window.scrollY
}}}}return a
};
com.cerner.oncology.util.getAbsoluteViewportWidth=function(){return(+com.cerner.oncology.util.getViewportWidth())+com.cerner.oncology.util.getViewportScrollX()
};
com.cerner.oncology.util.getAbsoluteViewportHeight=function(){return(+com.cerner.oncology.util.getViewportHeight())+com.cerner.oncology.util.getViewportScrollY()
};
com.cerner.oncology.util.stripUnit=function(a){return parseInt(a.replace(/[^\d\.]/g,""),10)
};
com.cerner.oncology.util.positionPopup=function(a,g){$(a).css("position","absolute");
var b=com.cerner.oncology.util.getAbsoluteViewportWidth();
var d=com.cerner.oncology.util.getAbsoluteViewportHeight();
var j=$(a).width();
var h=$(a).height();
var k=(+g.clientX)+com.cerner.oncology.util.getViewportScrollX();
var i=(+g.clientY)+com.cerner.oncology.util.getViewportScrollY();
if((k+j+10)>=b){var f=g.pageX-j-10;
$(a).css({left:f<0?0:f})
}else{$(a).css({left:(+g.pageX)+10})
}if((i+h+10)>=d){var c=g.pageY-h-10;
$(a).css({top:c<0?0:c})
}else{$(a).css({top:(+g.pageY)+10})
}};
com.cerner.oncology.util.movePopupToBody=function(a){$("#"+a).remove().appendTo("body")
};
com.cerner.oncology.util.createRow=function(m,a,h,k){var f,e,b;
var g=$(document.createElement("tr"));
h&&h.length&&$(g).addClass(h.join(" "));
var d=k&&k.length?k.join(" "):[];
var l=$(document.createElement(a?"th":"td"));
for(e=0,b=m;
e<b;
e++){f=$(l).clone();
d.length&&f.addClass(d);
$(g).append(f)
}return g
};
com.cerner.oncology.util.createTable=function(b,f,c){var d=$(document.createElement("table")).attr("summary",b);
f&&$(d).attr("id",f);
c&&c.length&&$(d).addClass(c.join(" "));
var e=$(document.createElement("thead"));
$(d).append(e);
var a=$(document.createElement("tbody"));
$(d).append(a);
return d
};
com.cerner.oncology.util.getTextWidth=function(b){var c,a;
c=$(document.createElement("div")).hide();
$("body").append(c);
$(c).text($(b).text());
a=$(c).width();
$(c).remove();
return a
};
com.cerner.oncology.util.findLongestText=function(b){var d,c,a,e;
a=0;
for(d=0,c=$(b).length;
d<c;
d++){e=com.cerner.oncology.util.getTextWidth(b[d]);
a=e>a?e:a
}return a
};
com.cerner.oncology.util.isTextOverflowing=function(a){return com.cerner.oncology.util.getTextWidth(a)>$(a).width()
};
com.cerner.oncology.util.loadBedrockConfig=function(c){var a,b;
b=c.toLowerCase();
if(window.m_bedrockMpage){a=$.grep(m_bedrockMpage.MPAGE[0].COMPONENT,function(f,d){return f.FILTER_MEAN===c
})
}return a&&a.length?a[0]:null
};
registerNS("com.cerner.oncology.ctreview");
com.cerner.oncology.ctreview.wasLoaded=false;
com.cerner.oncology.ctreview.call=function(a,d,c){var b;
if(!com.cerner.oncology.ctreview.wasLoaded){b=MP_Util.CreateTimer("CAP:2012.1.00123.1");
if(b){b.Stop()
}com.cerner.oncology.ctreview.wasLoaded=true
}return function(f){var g,e;
g=CERN_BrowserDevInd?new XMLHttpRequest():new XMLCclRequest();
g.onreadystatechange=function(){var h,k,j,n,l;
n="script: "+a+"\n";
n=n+"inputs: "+f+"\n";
if(g.readyState===4){if(g.status===200){h=true;
try{j=$.parseJSON(g.responseText);
l=null;
for(k in j){if(j[k]["STATUS_DATA"]){l=j[k]["STATUS_DATA"];
break
}}if(l&&l.STATUS){if(c){c(l)
}else{if(/[fp]/i.test(l.STATUS)){n="CCL failure or partial status returned.\n"+n;
n=n+JSON.stringify(l);
alert(n);
h=false
}}}h&&d(j)
}catch(m){n="error parsing reply.\nmessage: "+m.message+"\n"+n;
n=n+"response text: "+g.responseText;
alert(n)
}}else{n="ajax status non-success: "+g.status+"\n"+n;
n=n+"status text: "+g.statusText;
alert(n)
}}};
if(CERN_BrowserDevInd){e=a+"?parameters="+f;
g.open("GET",e);
g.send(null)
}else{g.open("GET",a);
g.send(f)
}}
};
registerNS("com.cerner.oncology.ctreview");
$.extend(com.cerner.oncology.ctreview,{Bedrock:function(){this.types=[];
this.currScrollNum=0;
this.currScroll=false;
this.histScrollNum=0;
this.histScroll=false;
this.histOpen=false;
this.histLookback=180;
this.loadResponses=true;
this.loadStatus=false;
this.setTreatmentTypes=function(a){this.types=a||[]
};
this.setCurrentScrollNum=function(a){this.currScrollNum=a
};
this.setCurrentScroll=function(a){this.currScroll=a
};
this.setHistoricalScrollNum=function(a){this.histScrollNum=a
};
this.setHistoricalScroll=function(a){this.histScroll=a
};
this.setHistoricalOpen=function(a){this.histOpen=a
};
this.setHistoricalLookback=function(a){this.histLookback=a
};
this.setLoadResponses=function(a){this.loadResponses=a
};
this.setStatusCol=function(a){this.loadStatus=a
}
},bedrock:null,rootDir:"../",hoverLabelColumnWidth:0,widgetWidth:0,formatDate:function(a){var b="";
if(a){b=moment(a);
b=b.format(MPAGE_LOCALE.fulldate4yr.toUpperCase())
}return b
},createTreatmentName:function(d){var b,h,c,g,f,a,e;
a=com.cerner.oncology.util.getTextWidth;
e=0;
f=function(j,i){$(j).text(i);
e=Math.max(e,a($(j)))
};
c=d.NAME;
h=d.TYPE_FLAG===1;
g=$(document.createElement("p")).addClass("default-6B6245 ellipses-6B6245");
b=$(document.createElement("img")).addClass("image-6B6245").attr({src:h?this.rootDir+"/images/6404_16.png":this.rootDir+"/images/5893.gif",alt:h?"power plan":"regimen"});
$(g).append(b).append(c);
$(g).hover(function(q){var m,n,l,k,o,r;
f("#id-6B6245-23",c);
f("#id-6B6245-14",d.ORDERED_AS);
if(!d.ORDERED_AS){$("#id-6B6245-24").hide()
}else{$("#id-6B6245-24").show()
}f("#id-6B6245-16",d.STATUS);
o=this.createDate(d.START,d.START_EST_IND);
f("#id-6B6245-18",$(o).text());
$("#id-6B6245-20").empty();
if(typeof d.STOP!=="undefined"){o=this.createDate(d.STOP);
f("#id-6B6245-20",$(o).text())
}if(!$("#id-6B6245-20").text()){$("#id-6B6245-25").hide()
}else{$("#id-6B6245-25").show()
}$("#id-6B6245-32").empty();
if(typeof d.CYCLES!=="undefined"&&d.CYCLES.length){for(l=0,k=d.CYCLES.length;
l<k;
l++){m=d.CYCLES[l];
r=m.NAME+" - "+m.STATUS;
if(m.START){r=r.concat(" - ");
if(m.START_EST_IND){r=r.concat("*Est. ")
}r=r.concat(this.formatDate(m.START))
}o=$(document.createElement("p"));
$(o).text(r);
$("#id-6B6245-32").append(o);
e=Math.max(e,a(o))
}}n=e+10;
$(".data-6B6245").width(n);
$("#id-6B6245-12").width(this.hoverLabelColumnWidth+n+10);
$("#id-6B6245-12").show();
com.cerner.oncology.util.positionPopup($("#id-6B6245-12"),q)
}.bind(this),function(){$("#id-6B6245-12").hide()
});
return g
},createCycleName:function(a){var b;
b=$(document.createElement("p")).addClass("default-6B6245 cycleName-6B6245 ellipses-6B6245");
$(b).text(a);
$(b).hover(function(d){var c,f;
f=com.cerner.oncology.util.getTextWidth(this)+(+$(this).css("padding-left").match(/\d*/)[0]);
c=$(this).parent().width();
if(f>c){$("#id-6B6245-11").text($(b).text());
$("#id-6B6245-2").show();
com.cerner.oncology.util.positionPopup($("#id-6B6245-2"),d)
}},function(){$("#id-6B6245-2").hide()
});
return b
},createResponse:function(a){var b;
b=$(document.createElement("p")).addClass("default-6B6245");
if(a){$("#id-6B6245-2").css("width","auto");
$(b).hover(function(d){var f,c;
f=a.CODE+". "+(a.TEXT.length>255?a.TEXT.slice(0,254)+"...":a.TEXT);
$("#id-6B6245-11").text(f+" "+i18n.discernabu.ctreview.CHARTED_ON+": "+this.formatDate(a.CHART_DATE)+", "+i18n.discernabu.ctreview.BY+" "+a.CHART_PRSNL_NAME+".");
c=com.cerner.oncology.util.getTextWidth($("#id-6B6245-11"));
if(c>400){$("#id-6B6245-2").css("width","400px")
}$("#id-6B6245-2").show();
com.cerner.oncology.util.positionPopup($("#id-6B6245-2"),d)
}.bind(this),function(){$("#id-6B6245-2").hide()
})
}else{a={CODE:""}
}return $(b).text(a.CODE)
},createStatus:function(a){var b=$(document.createElement("p")).addClass("default-6B6245");
return $(b).text(a)
},createDate:function(b,a){var e,c;
c=$(document.createElement("p")).addClass("default-6B6245");
e=!b?"":this.formatDate(b);
return $(c).text(a?"*Est. "+e:e)
},setTableScrolling:function(){var g,a,h,d,i,c,j,f,e,b;
if(this.bedrock.currScroll&&this.bedrock.currScrollNum){a=$("#id-6B6245-26");
h=$("#id-6B6245-9").children().length;
i=this.bedrock.currScrollNum;
if(h>i){d=true;
$(a).height(i*18);
j=$("#id-6B6245-5 .widthStartTime-6B6245");
f=$(j).width()+18;
$(j).width(f)
}}if(this.bedrock.histScroll&&this.bedrock.histScrollNum){a=$("#id-6B6245-27");
h=$("#id-6B6245-10").children().length;
i=this.bedrock.histScrollNum;
if(h>i){d=true;
$(a).height(i*18);
e=$("#id-6B6245-5 .widthStartTime-6B6245");
b=$(e).width()+18;
$(e).width(b)
}}},resizeTables:function(e){var f,b,a,d,c;
a=com.cerner.oncology.util.findLongestText;
f=d=0;
c=a($("#id-6B6245-29 .widthStopTime-6B6245"));
c=c+5;
$("#id-6B6245-29 .widthStopTime-6B6245").width(c);
f+=c;
b=$("#id-6B6245-28 .widthStartTime-6B6245");
c=a(b);
c=c+7;
$(b).width(c);
d+=c;
b=$("#id-6B6245-29 .widthStartTime-6B6245");
c=a(b);
c=c+7;
$(b).width(c);
f+=c;
if(this.bedrock.loadStatus){c=a($(".widthStatus-6B6245"));
c=c+7;
$(".widthStatus-6B6245").width(c);
d+=c;
f+=c
}else{$(".widthStatus-6B6245").remove();
th=$("#id-6B6245-28 .widthName-6B6245");
colspan=$(th).attr("colspan");
$(th).attr("colspan",(+colspan)+1);
th=$("#id-6B6245-29 .widthName-6B6245");
colspan=$(th).attr("colspan");
$(th).attr("colspan",(+colspan)+1)
}if(this.bedrock.loadResponses){c=a($(".widthResponse-6B6245"));
$(".widthResponse-6B6245").width(c);
d+=c;
f+=c;
if(e==false){$(".widthResponse-6B6245").remove();
th=$("#id-6B6245-28 .widthName-6B6245");
colspan=$(th).attr("colspan");
$(th).attr("colspan",(+colspan)+1);
th=$("#id-6B6245-29 .widthName-6B6245");
colspan=$(th).attr("colspan");
$(th).attr("colspan",(+colspan)+1)
}}else{$(".widthResponse-6B6245").remove();
th=$("#id-6B6245-28 .widthName-6B6245");
colspan=$(th).attr("colspan");
$(th).attr("colspan",(+colspan)+1);
th=$("#id-6B6245-29 .widthName-6B6245");
colspan=$(th).attr("colspan");
$(th).attr("colspan",(+colspan)+1)
}$("#id-6B6245-28 .widthStopTime-6B6245").remove();
th=$("#id-6B6245-28 .widthName-6B6245");
colspan=$(th).attr("colspan");
$(th).attr("colspan",(+colspan)+1);
this.setTableScrolling()
},setComponentMessage:function(c){var b,a;
b=$("#id-6B6245-1").closest('div[class~="sec-content"]');
if(b){a=$(b).prev().find('span[class~="sec-total"]');
$(a).text(c);
$(a).removeClass("hidden")
}},loadTreatment:function(f,l){var a,b,h,k,i,e;
var g=false;
e=0;
try{var j=MP_Util.CreateTimer(f.getComponentRenderTimerName(),f.criterion.category_mean);
var d=MP_Util.CreateTimer(f.getComponentLoadTimerName(),f.criterion.category_mean);
i=function(m){return{total:function(n){$("#id-6B6245-"+m).text(" ("+n+")")
}}
};
k=function(o){var m,n;
n=com.cerner.oncology.util.createRow(5);
$("#id-6B6245-"+o).append(n);
m=$(document.createElement("p")).addClass("res-none");
$(n).children(":first").append(m);
$(m).text(i18n.NO_RESULTS_FOUND)
};
a=function(m){var n,p,o;
n=m%2?"even":"odd";
p=com.cerner.oncology.util.createRow(5,false,[n]);
$(p).hover(function(){$(p).attr("class","selectedRow-6B6245")
},function(){$(p).attr("class",n)
});
o=$(p).children();
$(o[0]).addClass("widthName-6B6245 ellipses-6B6245");
$(o[1]).addClass("widthResponse-6B6245");
$(o[2]).addClass("widthStatus-6B6245");
$(o[3]).addClass("widthStartTime-6B6245");
$(o[4]).addClass("widthStopTime-6B6245");
return p
};
b=function(s,p){var r,n,t,m,o,q;
q=$(s).children();
if(typeof p.ACCESS_IND!=="undefined"&&!p.ACCESS_IND){r=false;
n=undefined;
t="";
m="";
o=""
}else{r=p.START_EST_IND;
n=!p.RESPONSE_CODE?undefined:{CODE:p.RESPONSE_CODE,TEXT:p.RESPONSE_TEXT,CHART_DATE:p.RESPONSE_CHART_DATE,CHART_PRSNL_NAME:p.RESPONSE_CHART_PRSNL_NAME};
t=p.START;
m=p.STATUS;
o=p.STOP
}$(q[1]).append(this.createResponse(n));
$(q[2]).append(this.createStatus(m));
$(q[3]).append(this.createDate(t,r));
$(q[4]).append(this.createDate(o,false))
}.bind(this);
h=function(w,z,q){var s,n,u,x,r,o,v,y,m,A,t;
v=w.length;
v?i(q).total(v):k(z);
if(v){x=typeof w[0].CYCLES!=="undefined";
for(u=0;
u<v;
u++){n=w[u];
A=a(u);
$("#id-6B6245-"+z).append(A);
if(g==false){if(!n.RESPONSE_CODE){g=false
}else{g=true
}}b(A,n);
t=$(A).children();
m=this.createTreatmentName(n);
$(t[0]).append(m);
if(x){y=n.CYCLES.length;
if(n.TYPE_FLAG===0&&!y){$(t[0]).append(this.createCycleName(i18n.discernabu.ctreview.NO_PLANS))
}else{for(r=0,o=y;
r<o;
r++){s=n.CYCLES[r];
if(s.DISPLAY_IND){A=a(u);
$("#id-6B6245-"+z).append(A);
b(A,s);
t=$(A).children();
$(t[0]).append(this.createCycleName(s.NAME));
break
}}}}}}return v
}.bind(this);
e=h(l.TREATMENT.CURRENT,"9","7");
e=e+h(l.TREATMENT.HISTORICAL,"10","8");
this.setComponentMessage("("+e+")");
this.resizeTables(g)
}catch(c){logger.logJSError(c,this,"ct_review.js","loadTreatment");
throw (c)
}finally{j.Stop();
d.Stop()
}},retrieveTreatment:function(g){var d,a,f,h,b,e,c;
h=function(i){this.loadTreatment(g,i)
}.bind(this);
if(typeof m_criterionJSON!=="undefined"){a=JSON.parse(m_criterionJSON);
b=a.CRITERION.PERSON_ID;
e=a.CRITERION.PRSNL_ID;
c=a.CRITERION.PPR_CD
}else{b="$PAT_PersonId$";
e="$USR_PersonId$";
c="$PAT_PPRCode$"
}d=this.bedrock.types;
d=d!==undefined&&d.length?d.join(".0,").concat(".0"):"";
f="^MINE^,"+b+","+e+","+c+","+(this.bedrock.histLookback)+",value("+d+"),"+(+this.bedrock.loadResponses)+",0";
this.setComponentMessage(i18n.LOADING_DATA+"...");
this.call("onc_mp_chemotherapy_review",h)(f)
},registerTableToggles:function(a){$(".subSec-6B6245").click(function(f){var g,d,b,c;
if($(f.target).hasClass("subSec-6B6245")){g=$(f.target)
}else{g=$(f.target).closest(".subSec-6B6245")
}c=$(g).next();
d=$(c).is(":hidden");
b=$(g).children(":first").children(":first");
if(d){$(g).removeClass("closed");
$(b).attr("title","Collapse");
$(b).text("-")
}else{$(g).addClass("closed");
$(b).attr("title","Expand");
$(b).text("+")
}$(c).toggle()
});
if(!this.bedrock.histOpen){$("#id-6B6245-29").hide();
$("#id-6B6245-29").prev().addClass("closed").children(":first").children(":first").attr("title","Expand").text("+")
}this.retrieveTreatment(a)
},setHistoricalRange:function(d){var c,b,a;
b=1000*60*60*24;
a=moment().startOf("day");
c=a.valueOf()-(this.bedrock.histLookback*b);
$("#id-6B6245-21").text("- "+moment(c).format(MPAGE_LOCALE.fulldate4yr.toUpperCase())+" "+i18n.discernabu.ctreview.TO_CURRENT);
this.registerTableToggles(d)
},setTreatmentHoverLabels:function(c){var b,a;
a=0;
b=function(f,e){var d=com.cerner.oncology.util.getTextWidth;
$(f).text(e+":");
a=Math.max(a,d($(f)))
};
b("#id-6B6245-22",i18n.NAME);
b("#id-6B6245-13",i18n.discernabu.ctreview.ORDERED_AS);
b("#id-6B6245-15",i18n.STATUS);
b("#id-6B6245-17",i18n.START);
b("#id-6B6245-19",i18n.STOP);
this.hoverLabelColumnWidth=a+10;
$(".label-6B6245").width(this.hoverLabelColumnWidth);
this.setHistoricalRange(c)
},setTableHeaderLabels:function(c){var a,d,b;
a=[];
a.push(i18n.discernabu.NAME);
a.push(i18n.discernabu.ctreview.RESPONSE);
a.push(i18n.STATUS);
a.push(i18n.START);
d=a.slice(0);
d.push(i18n.STOP);
b=function(e,l){var g,f,k,h;
h=$(l).children();
for(g=0,f=e.length;
g<f;
g++){k=$(document.createElement("p"));
$(k).text(e[g]);
$(h[g]).append(k)
}};
b(a,$("#id-6B6245-5"));
b(d,$("#id-6B6245-6"));
this.setTreatmentHoverLabels(c)
},setTableSectionLabels:function(b){var a=$("#id-6B6245-1").width();
this.widgetWidth=a-20;
$("#id-6B6245-1").css("width","auto");
$("#id-6B6245-3").text(i18n.CURRENT);
$("#id-6B6245-4").text(i18n.discernabu.ctreview.HISTORICAL);
!this.bedrock&&this.initializeBedrockMember();
this.setTableHeaderLabels(b)
},initializeBedrockMember:function(){this.bedrock=new this.Bedrock()
},movePopupsToBody:function(){com.cerner.oncology.util.movePopupToBody("id-6B6245-2");
com.cerner.oncology.util.movePopupToBody("id-6B6245-12")
}});
function ChemotherapyReviewComponentStyle(){this.initByNamespace("ctr")
}ChemotherapyReviewComponentStyle.inherits(ComponentStyle);
function ChemotherapyReviewComponent(a){this.classes=[];
this.currentScrollInd="";
this.currentScrollNum="";
this.historicalLookback="";
this.historicalOpen="";
this.historicalScrollInd="";
this.historicalScrollNum="";
this.responseInd="";
this.statusInd="";
this.setStyles(new ChemotherapyReviewComponentStyle());
this.setCriterion(a);
this.setComponentLoadTimerName("USR:MPG.CHEMOTHERAPY_REVIEW.O1 - load component");
this.setComponentRenderTimerName("ENG:MPG.CHEMOTHERAPY_REVIEW.O1 - render component");
this.setAlwaysExpanded(false);
this.setPowerPlanClasses=function(b){this.classes=b
};
this.setCurrentScrollInd=function(b){this.currentScrollInd=b
};
this.setCurrentScrollNum=function(b){this.currentScrollNum=b
};
this.setHistoricalLookback=function(b){this.historicalLookback=b
};
this.setHistoricalOpen=function(b){this.historicalOpen=b
};
this.setHistoricalScrollInd=function(b){this.historicalScrollInd=b
};
this.setHistoricalScrollNum=function(b){this.historicalScrollNum=b
};
this.setResponseInd=function(b){this.responseInd=b
};
this.setStatusInd=function(b){this.statusInd=b
};
this.InsertData=function(){var b,c;
c=com.cerner.oncology.ctreview;
b=this.getCriterion();
MP_Util.Doc.FinalizeComponent(this.getHTML(),this,"");
c.rootDir=b.static_content;
c.initializeBedrockMember();
c.bedrock.setTreatmentTypes(this.classes);
c.bedrock.setCurrentScrollNum((+this.currentScrollNum));
c.bedrock.setCurrentScroll((+this.currentScrollInd));
c.bedrock.setHistoricalScrollNum((+this.historicalScrollNum));
c.bedrock.setHistoricalScroll((+this.historicalScrollInd));
c.bedrock.setHistoricalOpen((+this.historicalOpen));
c.bedrock.setHistoricalLookback((+this.historicalLookback));
c.bedrock.setLoadResponses((+this.responseInd));
c.bedrock.setStatusCol((+this.statusInd));
c.movePopupsToBody();
c.setTableSectionLabels(this)
};
this.HandleSuccess=function(){};
this.getHTML=function(){var b=[];
b.push('<div id="id-6B6245-1">');
b.push('<div class="sub-sec subSec-6B6245 pointer-6B6245">');
b.push('<div class="sub-sec-hd">');
b.push('<span class="sub-sec-hd-tgl">+</span>');
b.push('<span id="id-6B6245-3" class="sub-sec-title"></span>');
b.push('<span id="id-6B6245-7">(0)</span>');
b.push("</div>");
b.push("</div>");
b.push('<table id="id-6B6245-28" class="fixedLayout-6B6245" summary="current chemotherapy review header table">');
b.push("<thead>");
b.push('<tr id="id-6B6245-5">');
b.push('<th class="widthName-6B6245 default-6B6245" colspan="1"></th>');
b.push('<th class="widthResponse-6B6245 default-6B6245"></th>');
b.push('<th class="widthStatus-6B6245 default-6B6245"></th>');
b.push('<th class="widthStartTime-6B6245 default-6B6245"></th>');
b.push('<th class="widthStopTime-6B6245 default-6B6245"></th>');
b.push("</tr>");
b.push("</thead>");
b.push("<tbody>");
b.push("<tr>");
b.push('<td colspan="5">');
b.push('<div id="id-6B6245-26" class="scrollable-6B6245">');
b.push('<table class="fixedLayout-6B6245" summary="current chemotherapy review table">');
b.push('<tbody id="id-6B6245-9">');
b.push("</tbody>");
b.push("</table>");
b.push("</div>");
b.push("</td>");
b.push("</tr>");
b.push("</tbody>");
b.push("</table>");
b.push('<div class="sub-sec subSec-6B6245 pointer-6B6245">');
b.push('<div class="sub-sec-hd">');
b.push('<span class="sub-sec-hd-tgl">-</span>');
b.push('<span id="id-6B6245-4" class="sub-sec-title"></span>');
b.push('<span id="id-6B6245-8">(0)</span>');
b.push('<span id="id-6B6245-21"></span>');
b.push("</div>");
b.push("</div>");
b.push('<table id="id-6B6245-29" class="fixedLayout-6B6245" summary="historical chemotherapy review header table">');
b.push("<thead>");
b.push('<tr id="id-6B6245-6">');
b.push('<th class="widthName-6B6245 default-6B6245" colspan="1"></th>');
b.push('<th class="widthResponse-6B6245 default-6B6245"></th>');
b.push('<th class="widthStatus-6B6245 default-6B6245"></th>');
b.push('<th class="widthStartTime-6B6245 default-6B6245"></th>');
b.push('<th class="widthStopTime-6B6245 default-6B6245"></th>');
b.push("</tr>");
b.push("</thead>");
b.push("<tbody>");
b.push("<tr>");
b.push('<td colspan="5">');
b.push('<div id="id-6B6245-27" class="scrollable-6B6245">');
b.push('<table class="fixedLayout-6B6245" summary="historical chemotherapy review table">');
b.push('<tbody id="id-6B6245-10">');
b.push("</tbody>");
b.push("</table>");
b.push("</div>");
b.push("</td>");
b.push("</tr>");
b.push("</tbody>");
b.push("</table>");
b.push('<div id="id-6B6245-2" class="hover-6B6245" style="display: none;">');
b.push('<p id="id-6B6245-11"></p>');
b.push("</div>");
b.push('<table id="id-6B6245-12" class="hover-6B6245" summary="treatment hover" style="display: none;">');
b.push("<tbody>");
b.push("<tr>");
b.push('<td><p id="id-6B6245-22" class="label-6B6245 rightAlign-6B6245"></p></td>');
b.push('<td><p id="id-6B6245-23" class="data-6B6245 paddingLeft3p-6B6245 leftAlign-6B6245"></p></td>');
b.push('<tr id="id-6B6245-24">');
b.push('<td><p id="id-6B6245-13" class="label-6B6245 rightAlign-6B6245"></p></td>');
b.push('<td><p id="id-6B6245-14" class="data-6B6245 paddingLeft3p-6B6245 leftAlign-6B6245"></p></td>');
b.push("</tr>");
b.push("<tr>");
b.push('<td><p id="id-6B6245-15" class="label-6B6245 rightAlign-6B6245"></p></td>');
b.push('<td><p id="id-6B6245-16" class="data-6B6245 paddingLeft3p-6B6245 leftAlign-6B6245"></p></td>');
b.push("</tr>");
b.push("<tr>");
b.push('<td><p id="id-6B6245-17" class="label-6B6245 rightAlign-6B6245"></p></td>');
b.push('<td><p id="id-6B6245-18" class="data-6B6245 paddingLeft3p-6B6245 leftAlign-6B6245"></p></td>');
b.push("</tr>");
b.push('<tr id="id-6B6245-25">');
b.push('<td><p id="id-6B6245-19" class="label-6B6245 rightAlign-6B6245"></p></td>');
b.push('<td><p id="id-6B6245-20" class="data-6B6245 paddingLeft3p-6B6245 leftAlign-6B6245"></p></td>');
b.push("</tr>");
b.push('<tr id="id-6B6245-30">');
b.push('<td><p id="id-6B6245-31" class="label-6B6245 rightAlign-6B6245"></p></td>');
b.push('<td><p id="id-6B6245-32" class="data-6B6245 paddingLeft3p-6B6245 leftAlign-6B6245"></p></td>');
b.push("</tr>");
b.push("</tbody>");
b.push("</table>");
b.push("</div>");
return b.join("")
}
}ChemotherapyReviewComponent.prototype=new MPageComponent();
ChemotherapyReviewComponent.prototype.constructor=MPageComponent;
ChemotherapyReviewComponent.inherits(MPageComponent);
ChemotherapyReviewComponent.prototype.loadFilterMappings=function(){MPageComponent.prototype.loadFilterMappings.call(this);
this.addFilterMappingObject("STATUS_COL_IND",{setFunction:this.setStatusInd,type:"String",field:"FREETEXT_DESC"})
};