/**
 * Generates series of times, based on interval param and date supplied
 * @author Aaron Nordyke - AN015953
 * @param {Number} interval Size of interval in minutes
 * @param {Date} date Date from which to generate intervals going backward
 */
var timeIntervalGenerator = function(interval,date, range) {
	
	var _date = date || new Date(),
			_interval = interval,
			_range = range;

	if(arguments.length !== 3) {
		throw new Error("timeIntervalGenerator(): must have three parameter");
	}
	if(typeof arguments[0] !== "number" || typeof arguments[1] !== "object") {
		throw new TypeError("timeIntervalGenerator(): Incorrect parameter types : " + arguments[0] + " " + arguments[1]);
	}

	/**
	 * Gets array of time intervals
	 * 
	 * @returns {Array} intervals Array of objects in the form of {endDate,startDate,endMilitary,startMilitary,military}
	 */
	function getIntervals() {
		var intervals = [],
				twelveHoursInPast = getTwelveHoursAgo(date),
				intervalSet,
				startDate,
				endDate,
				startMilitary,
				endMilitary,
				endDate = getStartingDate(),
				endMilitary = getMilitaryTimeString(endDate);
				
        //As HeaderTime is changed as per the iView,endDate.valueOf()>=twelveHoursInPast.valueOf() 
		
		while(endDate.valueOf() >= twelveHoursInPast.valueOf()) {
			startDate = subtractInterval(endDate);
			startDate.setMinutes ( startDate.getMinutes() + 1 );
			startMilitary = getMilitaryTimeString(startDate);
			var startdt=df.format(startDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR),
			enddt=df.format(endDate, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR),
			headerDate = startdt===enddt ? startdt: startdt + "-" + enddt,
			array = (startDate).toString().split(" "),
			timezone = array[4];
			intervals[intervals.length] = {
				endDate:endDate,
				startDate:startDate,
				endMilitary:endMilitary,
				startMilitary:startMilitary,
				date: headerDate,
				//Each Time slots should be as per iView
				military : startMilitary+ "-" + endMilitary + " " + timezone				
			};
			endDate = new Date(startDate);
			endDate.setMinutes ( endDate.getMinutes() - 1 );
			endMilitary = getMilitaryTimeString(endDate);
		}
		return intervals;
	}

	/**
	 * Get specific interval array based on index
	 * @param {Integer} position array index
	 * @returns {Object} interval at position supplied
	 */
	function getInterval(position) {
		return getIntervals()[position];
	}

	/**
	 * Gets next interval based on date supplied
	 * @param {Date} date of last interval
	 * @returns {Date} date of next interval
	 */
	function subtractInterval(date) {
		var d = new Date(date.valueOf());
		d = new Date(d.setMinutes(d.getMinutes() - interval).valueOf());
		return d;
	}

	/**
	 * Get Military Time String from date supplied
	 * @param {Date} date from which to create string
	 * @returns {String} Military Time String
	 */
	function getMilitaryTimeString(date) {
		var hour = date.getHours().toString();
		var minutes = date.getMinutes().toString();
		hour = hour.length == 2 ? hour : "0" + hour;
		minutes = minutes.length == 2 ? minutes : "0" + minutes;
		return hour + ":" +  minutes;
	}

	/**
	 * Gets starting date for generating all intervals moving backwards
	 * @returns {Date} Starting Date
	 */
	function getStartingDate() {
		var intervalInMilliseconds = 1000*60*interval;
		var latestDate = new Date(date.valueOf());
		latestDate.setMinutes(60);
		latestDate.setSeconds(0,0);
		while(latestDate.getTime() - date.getTime() >= intervalInMilliseconds) {
			latestDate = subtractInterval(latestDate);
		}
		return latestDate;
	}

	/**
	 * Returns 12 hours before supplied date
	 * @param {Date} date
	 * @returns {Date} twelve hours before parameter
	 */
	function getTwelveHoursAgo(date) {
		var twelveHrsInMs = 1000*60*60*_range;
		date = new Date(date.valueOf() - twelveHrsInMs);
		date.setSeconds(0,0);
		return date;
	}

	/**
	 * Gets interval from array based on supplied date
	 * @param {Date} date
	 * @returns {Object} Interval object, if date is found in 12 hour range, -1 if not found
	 */
	function getIntervalForDate(date){
		if(date < getTwelveHoursAgo(_date)){
			return -1;
		}
		var intervals = getIntervals();
		for(var i = 0,l = intervals.length;i<l;i++){
			if(date < intervals[i].endDate && date >= intervals[i].startDate){
				return i;
			}
		}
		return -1;
	}
	
	
	return {
		getIntervals:getIntervals,
		getInterval:getInterval,
		subtractInterval:subtractInterval,
		getMilitaryTimeString:getMilitaryTimeString,
		getStartingDate:getStartingDate,
		getTwelveHoursAgo:getTwelveHoursAgo,
		getIntervalForDate:getIntervalForDate
	};
};
