﻿if (typeof i18n == "undefined") 
    var i18n = {};

if (typeof i18n.discernabu == "undefined") 
    i18n.discernabu = {};

i18n.discernabu.graph = {
    DATE_TIME: "Data/hora",
    RESULT: "Resultado",
    DATE: "Data",
    NORMAL_LOW: "Baixo normal",
    NORMAL_HIGH: "Alto normal",
    CRITICAL_LOW: "Crítico baixo",
    CRITICAL_HIGH: "Crítico alto",
    TWO_DAY_MAX: "48 horas, no máximo",
    TWO_DAY_MIN: "48 horas, no mínimo",
    RESULT_DT_TM:"Data/hora dos resultados",
    SYS : "SIS",
    DIA : "DIA",
    GRAPH_NO_RESULTS : "Não há resultados a exibir para este gráfico",
    MISSING_STATIC_CONTENT_LOC : "Local do conteúdo estático ausente:",
    NO_UNITS_FOUND : "Nenhuma unidade encontrada",
    UNGRAPHABLE_WARNING: "* Resultado não representado no gráfico",
    STATUS: "Status",
	PRINTGRAPH: "Imprimir"
}
var dateFormat=function(){var token=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,timezone=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,timezoneClip=/[^-+\dA-Z]/g,pad=function(val,len){val=String(val);
len=len||2;
while(val.length<len){val="0"+val;
}return val;
};
return function(date,mask,utc){var dF=dateFormat;
if(arguments.length==1&&Object.prototype.toString.call(date)=="[object String]"&&!/\d/.test(date)){mask=date;
date=undefined;
}date=date?new Date(date):new Date;
if(isNaN(date)){throw SyntaxError("invalid date");
}mask=String(dF.masks[mask]||mask||dF.masks["default"]);
if(mask.slice(0,4)=="UTC:"){mask=mask.slice(4);
utc=true;
}var _=utc?"getUTC":"get",d=date[_+"Date"](),D=date[_+"Day"](),m=date[_+"Month"](),y=date[_+"FullYear"](),H=date[_+"Hours"](),M=date[_+"Minutes"](),s=date[_+"Seconds"](),L=date[_+"Milliseconds"](),o=utc?0:date.getTimezoneOffset(),flags={d:d,dd:pad(d),ddd:dF.i18n.dayNames[D],dddd:dF.i18n.dayNames[D+7],m:m+1,mm:pad(m+1),mmm:dF.i18n.monthNames[m],mmmm:dF.i18n.monthNames[m+12],yy:String(y).slice(2),yyyy:y,h:H%12||12,hh:pad(H%12||12),H:H,HH:pad(H),M:M,MM:pad(M),s:s,ss:pad(s),l:pad(L,3),L:pad(L>99?Math.round(L/10):L),t:H<12?"a":"p",tt:H<12?"am":"pm",T:H<12?"A":"P",TT:H<12?"AM":"PM",Z:utc?"UTC":(String(date).match(timezone)||[""]).pop().replace(timezoneClip,""),o:(o>0?"-":"+")+pad(Math.floor(Math.abs(o)/60)*100+Math.abs(o)%60,4),S:["th","st","nd","rd"][d%10>3?0:(d%100-d%10!=10)*d%10]};
return mask.replace(token,function($0){return $0 in flags?flags[$0]:$0.slice(1,$0.length-1);
});
};
}();
dateFormat.masks={"default":"ddd, dd mmm yyyy HH:MM:ss",shortDate:"dd/m/yy",shortDate2:"dd/mm/yyyy",shortDate3:"dd/mm/yy",shortDate4:"mm/yyyy",shortDate5:"yyyy",mediumDate:"d mmm, yyyy",longDate:"d mmmm, yyyy",fullDate:"dddd, d mmmm, yyyy",shortTime:"HH:MM",mediumTime:"HH:MM:ss",longTime:"HH:MM:ss Z",militaryTime:"HH:MM",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",longDateTime:"dd/mm/yyyy HH:MM:ss Z",longDateTime2:"dd/mm/yy HH:MM",longDateTime3:"dd/mm/yyyy HH:MM",shortDateTime:"dd/mm HH:MM",mediumDateNoYear:"d mmm"};
dateFormat.i18n={dayNames:["dom","seg","ter","qua","qui","sex","sáb","domingo","segunda","terça","quarta","quinta","sexta","sábado"],monthNames:["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez","janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"]};
Date.prototype.format=function(mask,utc){return dateFormat(this,mask,utc);
};
Date.prototype.setISO8601=function(string){var regexp="([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?Z?)?)?)?";
var d=string.match(new RegExp(regexp));
var date=new Date(d[1],0,1);
if(d[7]){date.setUTCHours(d[7]);
}else{date.setUTCHours(0);
}if(d[8]){date.setUTCMinutes(d[8]);
}else{date.setUTCMinutes(0);
}if(d[10]){date.setUTCSeconds(d[10]);
}else{date.setUTCSeconds(0);
}if(d[12]){date.setUTCMilliseconds(Number("0."+d[12])*1000);
}else{date.setUTCMilliseconds(0);
}if(d[1]){date.setUTCFullYear(d[1]);
}if(d[5]){date.setUTCDate(d[5]);
}if(d[3]){date.setUTCMonth(d[3]-1);
}this.setTime(date.getTime());
};
if(typeof MPAGE_LC=="undefined"){var MPAGE_LC={};
}MPAGE_LC.pt_BR={decimal_point:",",thousands_sep:".",grouping:"3",time24hr:"HH:MM:ss",time24hrnosec:"HH:MM",shortdate2yr:"d/m/yy",fulldate2yr:"dd/mm/yy",fulldate4yr:"dd/mm/yyyy",fullmonth4yrnodate:"mm/yyyy",full4yr:"yyyy",fulldatetime2yr:"dd/mm/yy HH:MM",fulldatetime4yr:"dd/mm/yyyy HH:MM",fulldatetimenoyr:"dd/mm HH:MM"};
