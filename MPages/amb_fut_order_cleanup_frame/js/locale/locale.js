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
dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",shortDate2:"mm/dd/yyyy",shortDate3:"mm/dd/yy",shortDate4:"mm/yyyy",shortDate5:"yyyy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",militaryTime:"HH:MM",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",longDateTime:"mm/dd/yyyy h:MM:ss TT Z",longDateTime2:"mm/dd/yy HH:MM",longDateTime3:"mm/dd/yyyy HH:MM",longDateTime4:"mm/dd/yy hh:MM TT",shortDateTime:"mm/dd h:MM TT"};
dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};
Date.prototype.format=function(mask,utc){
if(utc = "") {
	return "";
} else {
	return dateFormat(this,mask,utc);
}
};
Date.prototype.setISO8601=function(string){
if(string != "") {
	var regexp="([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
	var d=string.match(new RegExp(regexp));
	var offset=0;
	var date=new Date(d[1],0,1);
	if(d[3]){date.setMonth(d[3]-1);
	}if(d[5]){date.setDate(d[5]);
	}if(d[7]){date.setHours(d[7]);
	}if(d[8]){date.setMinutes(d[8]);
	}if(d[10]){date.setSeconds(d[10]);
	}if(d[12]){date.setMilliseconds(Number("0."+d[12])*1000);
	}if(d[14]){offset=(Number(d[16])*60)+Number(d[17]);
	offset*=((d[15]=="-")?1:-1);
	}offset-=date.getTimezoneOffset();
	time=(Number(date)+(offset*60*1000));
	this.setTime(Number(time));
}
};

var amb_i18n = {
	ABN: "ABN",
	ABN_TEMPLATE: "ABN Template",
	ABN_SELECT: "Select an ABN template",  
	ACCESSION: "Accession",  
	ACCESSION_NUM: "Accession Number",
	ACTIONS_NOT_AVAIL: "Actions Not Available",  
	ACTIVE: "Active",
	AGE: "Age",
	ALERT_DATE: "Alert Date",
	ALERT_STATE: "Alert State",
	ALL: "All",
	ALL_FORMS: "All Forms...",  
	ALLERGIES: "Allergies",
	BY_DATE: "By Date",
	CANCEL: "Cancel",
	CHART_DONE: "Chart Done",
	CHART_FORMS: "Chart Forms",
	CHARTED_DONE_REFRESH: "Charted Done (Please Refresh)",  
	CHARTED_NOT_DONE_REFRESH: "Charted Not Done (Please Refresh)",  
	CLEAR: "Clear",
	ABN_TOOLTIP: "Click to view ABN details and print",
	CLOSE: "Close",
	COLLECT_SPEC: "Collect Specimen",  
	COLLECTED_BY: "Collected By",
	COLLECTED_DATE: "Collected Date",
	COLLECTED_IN_OFFICE: "Collected in Office",
	COLLECTED_OUT_OFFICE: "Collected Out of Office",
	COLLECTION_DETAILS: "Collection Details",
	COLLECTED_IN_OFFICE_TOOLTIP: "Collection performed in office",
	COLLECTED_OUT_OFFICE_TOOLTIP: "Specimen collected at lab service center (PSC)",
	COMPLETE: "Complete",
	CONTAINER: "Container",
	CONTAINER_ON_TRANS_LIST: "Container is already on a transmit list. Please remove from current list to transmit using this page.",  
	CONTAINER_EXIST_LIST: "Container on existing list",
	CREATE: "Create",  
	DESCRIPTION: "Description",
	DESELECT_ALL: "Deselect All",
	DIAGNOSIS: "Diagnosis",
	DISCONTINUED: "Discontinued",
	DISPLAY: "Display",
	DOB: "DOB",
	DONE: "Done",
	DONE_WITH_DATE_TIME: "Done (with Date/Time)",
	ERROR: "Error",
	FAILED_TO: "Failed to",
	FIRST_LOGIN_SENT1: "To view tasks, select a location from the location drop down located in the top right quadrant. The system will save your last selected location and will default the next time the task list is accessed.", //new
	FIRST_LOGIN_SENT2: "After selecting the location, select the refresh button to load tasks into view defaulting the last weeks tasks. The date range of the tasks viewed can be changed, however the system will limit retrieval for up to a 1 month time period for system performance", //new
	FROM: "from",
	GENDER: "Gender",
	HELP_PAGE: "Help Page",
	HIDE_ADV_FILTERS: "Hide Advanced Filters",
	ID: "ID",  
	LAB: "Lab",
	LAB_RDY_TRANS: "Lab is ready to transmit",  
	LIST_ALREADY_TRANS: "List already transmitted, cannot remove from the list. Please try refreshing the page.",  
	LIST_NUM: "List #",  
	LOADING: "Loading",
	LOCATION: "Location",
	LOGIN_TO_SPEC_LOC: "Login to specimen location",  
	MRN: "MRN",
	NAME: "Name",
	NO: "No",  
	NO_DEFAULT_SPEC_LOC: "No default specimen location",
	NO_LAB_ASSOC: "No lab locations associated to the order or your account. Please contact support.",  
	NO_LAB_LOC: "No lab locations", 
	NO_RESULTS: "No results found",
	NO_RELATED_LOC: "No Related Locations Found", 
	NOT_ALLOW_TRANS: "Not allowed to transmit",  
	NOT_DONE: "Not Done",
	NOT_TRANSMITTED: "Not transmitted",  
	OF: "of",  
	OK: "OK",   
	ON: "on",
	OPEN_CHARTED_FORM: "Open Charted Form",
	OPEN_PT_CHART: "Open Patient Chart",
	ORDER: "Order",
	ORDER_COMM_DETECT: "Order Comment Detected",
	ORDER_COMMS: "Order Comments",
	ORDER_DATE: "Order Date",  
	ORDER_DETAILS: "Order Details",
	ORDER_INFO: "Order Information",
	ORDER_ID: "Order ID",  
	ORDER_NOT_TRANS: "Order not transmitted successfully. Attempt to retransmit.",  
	ORDER_PLAN: "Order Plan",  
	ORDER_RESULTS: "Order Results",  
	ORDER_TASKS: "Order Tasks",
	ORDERED: "Ordered",
	ORDERED_AS: "Ordered As",
	ORDERED_DATE: "Ordered Date",
	ORDERING_ID: "Ordering ID",
	ORDERING_PROV: "Ordering Provider",
	PAGE: "Page",
	PAGE_TIMER: "Page Load Timer",
	PARTIAL_RESULTS: "Partial Results Received",
	PATIENT: "Patient",
	PATIENT_DETAILS: "Patient Details",
	PATIENT_NAME: "Patient Name",   
 	PATIENT_SNAPSHOT: "Patient Snapshot",
	PCP: "PCP",
	PENDING_RESULTS: "Pending Results",  
	PHONE_NUM: "Phone Numbers",
	PRINT_LABELS: "Print Label(s)",
	PRINT_PICKUP: "Print Pickup List(s)",
	PRINT_REQ: "Print Requisitions",
	PRN: "PRN",     //like a prn task
	REASON: "Reason",
	REASON_COMM: "Reason Comment",
	REF_LAB: "Reference Lab",
	REF_LAB_INFO: "Reference Lab Information",
	REFRESH_LIST: "Refresh List",
	REMOVE: "Remove",  
	REMOVE_FROM_LIST: "Remove from list",
	REQUEST_TEXT: "Request Text",
	RESCHEDULE: "Reschedule",
	RESCHEDULE_TASK: "Reschedule Task",
	RESCHEDULED_TO: "Reschedule to",
	RESCHEDULE_REFRESH: "Rescheduled (Please Refresh)",  
	RESULT: "Result",  
	RESULT_DATE: "Result Date",  
	RESULT_STATUS: "Result Status",
	RESULTS_REC: "Results Received",
	RETRANSMIT: "Retransmit",
	SAVE_LOC_PREF: "Save a Location Preference", 
	SAVE_TASK_TYPE_TOOLTIP: "Save Selected Task Types as Default",
	SEC: "sec", //as in seconds
	SELECT: "Select",  
	SELECT_ALL: "Select All",
	SELECT_LAB_LOC: "Select Lab Location",
	SELECT_TO_LOCATION: "Select To Location",  
	SELECT_STATUS: "Select Statuses",  
	SELECT_PROV: "Select Provider",  
	SELECT_TYPE: "Select Types",  
	SELECT_UNCHART: "Select Tasks to Unchart",  
	SELECTED: "selected",
	SELECTED_FILTERS_NO_LABS: "Selected filters do not display any labs",
	SELECTED_FILTERS_NO_TASKS: "Selected filters do not display any tasks",
	SELECTED_REQ: "Selected Requisitions",
	SELECTED_ACC: "Selected Accession(s)",
	SHOW_ADV_FILTERS: "Show Advanced Filters",
	SPEC_LOGIN_ERROR: "Default clinic specimen received location not defined for a specimen. Unable to login specimen. Please contact Cerner support.",  
	SPEC_NO_LAB_LOC: "Specimen does not have a lab location. Please contact support.",  
	SPEC_NOT_LOGIN_LOC_TOOLTIP: "Specimen is not in the correct lab location. Please contact support if attempted re-login does not work.",  
	SPEC_NOT_LOGIN: "Specimen not logged in",   
	STATUS: "Status",
	SYSTEM_TRANS_INFO: "System Transmit Info",
	TASK: "Task",
	TASK_COMM: "Task Comment",
	TASK_COMM_DETECT: "Task Comment Detected",
	TASK_COMMS: "Task Comments",
	TASK_COMM_REFRESH: "Task Comment Added/Modified (Please Refresh)",  
	TASK_DATE: "Task Date",
	TASK_DETAILS: "Task Details",
	TASK_DISCONTINUED: "Task Discontinued",  
	TASK_DONE: "Task Done",  
	TASK_IN_PROCESS: "Task In Process",  
	TASK_NOT_DONE: "Task Not Done",  
	TASK_LIST: "Task List",
	TASK_LIST_INFO: "Task List Information",
	TASK_ORDER: "Task/Order",
	TASK_NOT_AVAIL: "Task Not Available",  
	THIS_VISIT: "This Visit",
	TO: "to",
	TOTAL_ITEMS: "total items",
	TRANSFERRED: "transferred", 
	TRANSMIT: "Transmit",
	TRANSMIT_DATE: "Transmit Date",
	TRANSMIT_DETAILS: "Transmit Details",
	TRANSMIT_LIST: "Transmit List",
	TRANSMITTED: "Transmitted",
	TRANSMITTED_BY: "Transmitted By",
	TRANSMITTING: "Transmitting",
	TYPE: "Type",
	UNABLE_ESO_ERROR: "Unable to create the ESO message. Please retransmit the list.",  
	UNCHART: "Unchart",
	UNCHART_COMM: "Unchart Comment",
	UNCHART_TASK: "Unchart Task",
	UNCHART_REFRESH: "Uncharted (Please Refresh)",  
	UPDATE: "Update",
	VALUE: "Value",  
	VIEW: "View",
	VIEW_PT_DETAILS: "View Patient Details",
	VIEW_TASK_DETAILS: "View Task Details",
	VISIT_DATE: "Visit Date",
	VISIT_DATE_LOC: "Visit Date/Location",
	VISIT_DIAG: "Visit Diagnosis",
	VISIT_LOC: "Visit Location",
	VISIT_REQ: "Visit Requisitions",
	VISIT_ACC: "Visit Accession(s)",  
	YES: "Yes"  
};