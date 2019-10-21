if(typeof i18n != "object"){
	var i18n = {};
}
// TabName
i18n.ARRIVED_IN_LAST_100_DAYS		 = "Arrived in the last 100 days";
i18n.OTHER							 = "Other";


// General Messages

i18n.OPEN_ITEMS						= "Open Items"
i18n.MY_DAY							= "My Day"
i18n.CALENDAR						= "Calendar"
i18n.TODAY							= "Today"
i18n.WEEK							= "Week"
i18n.DAY							= "Day"
i18n.LOCATION						= "Location"
i18n.NAME							= "Name"

i18n.AGE							= "Age"
i18n.REASON							= "Reason for Visit"
i18n.FIN							= "FIN"

i18n.ATTEND							= "Attending"
i18n.CONSULT						= "Consulting"

i18n.APPTTIME						= "Appointment Time"
i18n.PATIENT						= "Patient"
i18n.APPTDETAILS					= "Appointment Details"
i18n.STATUS							= "Status"
i18n.NOTES							= "Notes"

i18n.PATIENTINFORMATION_TITLE	 	= "Patient Information"
i18n.VISITREASON_TITLE 				=  "Visit Reason"

i18n.BABY_HOVER						= "Baby"
i18n.FETAL_DEMISE_HOVER				= "Fetal Demise"

//Month of the year
i18n.JANUARY						= "January"
i18n.FEBRUARY						= "February"
i18n.MARCH							= "March"
i18n.APRIL							= "April"
i18n.MAY							= "May"
i18n.JUNE							= "June"
i18n.JULY							= "July"
i18n.AUGUST							= "August"
i18n.SEPTEMBER						= "September"
i18n.OCTOBER						= "October"
i18n.NOVEMBER						= "November"
i18n.DECEMBER						= "December"
i18n.JAN							= "Jan"
i18n.FEB							= "Feb"
i18n.MAR							= "Mar"
i18n.APR							= "Apr"
i18n.MAY							= "May"
i18n.JUN							= "Jun"
i18n.JUL							= "Jul"
i18n.AUG							= "Aug"
i18n.SEP							= "Sep"
i18n.OCT							= "Oct"
i18n.NOV							= "Nov"
i18n.DEC							= "Dec"

i18n.SUNDAY							= "Sunday"
i18n.MONDAY							= "Monday"
i18n.TUESDAY						= "Tuesday"
i18n.WEDNESDAY						= "Wednesday"
i18n.THURSDAY						= "Thursday"
i18n.FRIDAY							= "Friday"
i18n.SATURDAY						= "Saturday"

i18n.SUN							= "Sun"
i18n.MON							= "Mon"
i18n.TUE							= "Tue"
i18n.WED							= "Wed"
i18n.THU							= "Thu"
i18n.FRI							= "Fri"
i18n.SAT							= "Sat"

//buttons
i18n.APPLY							= "Apply"
i18n.CANCEL							= "Cancel"
i18n.FIND							= "Find"
i18n.OK								= "OK"

//labels or General messages
i18n.ADD_OTHER						= "Add Other..."
i18n.CHIEF_COMPLAINT				= "Chief Complaint"
i18n.COMPLETED						= "Completed"
i18n.DATE_ORDERED					= "Date Ordered"

i18n.DOB							= "DOB"
i18n.ERROR_LAUNCH_DOC_VIEWER	    = "Error launching Document Viewer."
i18n.ERROR_RETRIEVING_RESULTS		= "Error retrieving results"
i18n.LOCATION_NOT_DEFINED			= "Location Not Defined"
i18n.MRN							= "MRN"
i18n.MORE_THAN_2_DAYS_AGO			= "More Than 2 Days Ago"


i18n.NO_RESULTS_FOUND				= "No results found"
i18n.NO_RESOURCE_SELECTED			= "No Resource Selected"
i18n.NOTE_NOT_STARTED				= "Note Not Started"
i18n.ORDER_NOT_STARTED				= "Charge Not Started"
i18n.ORDER							= "Order"
i18n.ORDER_COMPLETED				= "Charge Completed"
i18n.ORDER_ID						= "Order ID"
i18n.ORDERED_BY						= "Ordered By"
i18n.OUTSTANDING_ACTIONS			= "Outstanding Actions"
i18n.PATIENTS_FOR					= "Patients for"
i18n.NOTE_SAVED						= "Note Saved"
i18n.SEARCH_FOR						= "Search For"
i18n.RESOURCES_LIST					= "Resources List"
i18n.RESOURCES_SEARCH				= "Resources Search"
i18n.SLATIMER_OBJ_CREATION_FAILED	= "SLATimer object creation failed." 
i18n.TIMELINE						= "Timeline"
i18n.TWO_DAYS_AGO					= "2 Days Ago"
i18n.WITHIN_DAYS					="{0} days";
i18n.WITHIN_HOURS					="{0} hrs";
i18n.WITHIN_MINS					="{0} mins";
i18n.WITHIN_MONTHS					="{0} mos";
i18n.WITHIN_WEEKS					="{0} wks";
i18n.WITHIN_YEARS					="{0} yrs";
i18n.X_DAYS							="{0} days";
i18n.X_HOURS						="{0} hours";
i18n.X_MINUTES						="{0} minutes";
i18n.X_MONTHS						="{0} months";
i18n.X_WEEKS						="{0} weeks";
i18n.X_YEARS						="{0} years";
i18n.MULTIPLE_RESOURCE	      	    ="*Only displaying calendar events for ";
i18n.LOADING_DATA	                ="Loading data...";
i18n.ERROR_LOADING					="Sorry, could not load your data, please try again later";
i18n.REQUEST_PROCESS				="The request is being processed ...";
i18n.SUCCESS						="Success!";

i18n.xgcalendar = {
        dateformat: {
            fulldaykey: "MMddyyyy",
            fulldayshow: "L d, yyyy",
            fulldayvalue: "M/d/yyyy",
            Md: "W, d",
            Md3: "L d",
            separator: "/",
            year_index: 2,
            month_index: 0,
            day_index: 1,
            day: "d",
            sun: "Sunday",
            mon: "Monday",
            tue: "Tuesday",
            wed: "Wednesday",
            thu: "Thursday",
            fri: "Friday",
            sat: "Saturday",
            jan: "January",
            feb: "Feburary",
            mar: "March",
            apr: "April",
            may: "May",
            jun: "June",
            jul: "July",
            aug: "August",
            sep: "September",
            oct: "October",
            nov: "November",
            dec: "December"
	        },
        no_implemented: "No implemented yet",
        to_date_view: "Click to the view of current date",
        i_undefined: "Undefined",
        allday_event: "All day event",
        repeat_event: "Repeat event",
        time: "Time",
        event: "Event",
        location: "Location",
        participant: "Participant",
        get_data_exception: "Exception when getting data",
        new_event: "New event",
        confirm_delete_event: "Do you confirm to delete this event? ",
        confrim_delete_event_or_all: "Do you want to all repeat events or only this event? \r\nClick [OK] to delete only this event, click [Cancel] delete all events",
        data_format_error: "Data format error! ",
        invalid_title: "Event title can not be blank or contains ($<>)",
        view_no_ready: "View is not ready",
        example: "e.g., meeting at room 107",
        content: "What",
        create_event: "Create event",
        update_detail: "Edit details",
        click_to_detail: "View details",
        i_delete: "Delete",
        day_plural: "days",
        others: "Others",
        item: "",
        firstDay : "st",
        secondDay : "nd",
        thridDay : "rd",
        restDays : "th",
        timeSuffix_AM : "AM",
        timeSuffix_PM : "PM",
        CHECKOUT : "Checked Out",
        SEENBYPHYSIC : "Seen By Physician",
        SEENBYMIDLEV : "Seen By Mid-Level",
        SEENBYMEDSTU : "Seen By Med-Student",
        SEENBYRESIDE : "Seen By Resident",
        SEENBYNURSE :  "Seen By Nurse",
        CHECKIN : "Checked In",
        CONFIRM:  "Confirmed", 
        CANCEL: "Cancelled" 
    }
	i18n.datepicker = {
        dateformat: {
            fulldayvalue: "M/d/yyyy",
            separator: "/",
            year_index: 2,
            month_index: 0,
            day_index: 1,
            sun: "Sun",
            mon: "Mon",
            tue: "Tue",
            wed: "Wed",
            thu: "Thu",
            fri: "Fri",
            sat: "Sat",
            jan: "Jan",
            feb: "Feb",
            mar: "Mar",
            apr: "Apr",
            may: "May",
            jun: "Jun",
            jul: "Jul",
            aug: "Aug",
            sep: "Sep",
            oct: "Oct",
            nov: "Nov",
            dec: "Dec",
            postfix: ""
        },
        ok: " Ok ",
        cancel: "Cancel",
        today: "Today",
        prev_month_title: "prev month",
        next_month_title: "next month"
    }
