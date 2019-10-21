 function bh_sa_init_i18n(){
	//i18n
	var CCL_LANG = m_criterionJSON.CRITERION.LOCALE_ID;// "en-US";
	var i18nOptions = 	
		{ 
			lng: CCL_LANG, //Translation language
			fallbackLng: "en", //Default language if resource is not found
			resGetPath: m_criterionJSON.CRITERION.STATIC_CONTENT + '/locales/__lng__/__ns__.json',
			useCookie: false,
			ns: 'translation.safety' //resource file name with ../locale/<lng>/<ns>.json
		};

	$.i18n.init( i18nOptions,
	function(t) 
		{ 
		//$('[data-i18n]').i18n();
		});
		var additionalResources = { 'STATIC_CONTENT': m_criterionJSON.CRITERION.STATIC_CONTENT };
		$.i18n.addResourceBundle(CCL_LANG, i18nOptions.ns, additionalResources);
	
		
		}
		bh_sa_init_i18n();
	var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
	Date.prototype.toDate = function (strDate) 
	{
		if (strDate == "")
			return;
		var dateSeparator = "/",
		timeSeparator = ":",
		datetimeSeparator = " ";
		if (strDate.indexOf("-") != -1) {
			dateSeparator = "-";
		}
		var list = strDate.split(datetimeSeparator);
		var date = list[0].split(dateSeparator);
		var time = list[1].split(timeSeparator);
		var year = date[2];
		var month = date[1];
		month = parseInt(month, 10) - 1;
		var day = date[0];
		var hour = time[0];
		var minute = time[1];
		var second = time.length >= 3 ? time[2] : "0";
		var milli = time.length >= 4 ? time[3] : "0";
		return new Date(year, month, day, hour, minute, second, milli);
	}
	
	var mConsole = {
	debug_level_fatal : 0,
	debug_level_error : 1,
	debug_level_warning :2,
	debug_level_info : 4,
	debug_level_trace : 8,
	debug_level_debug : 16,
	debug_level_all : 32,
	debug_level_warning_bit : 0,
	
	isInfoBitOn : false,
	isDebugTraceBitOn : false,
	isDebugErrorBitOn : false,
	logInfo : false,
	
	logLevel : "",
	
	init : function(){
	    if(Criterion.debug_mode_ind <= 0){
	        return;
        }
	    var debug_level_param = 
	        Criterion.debug_level_ind === undefined ? 
	            this.debug_level_fatal | this.debug_level_error : Criterion.debug_level_ind;        
	    this.isInfoBitOn = (debug_level_param & this.debug_level_info) ==  this.debug_level_info;
	    this.isDebugTraceBitOn = ( debug_level_param & this.debug_level_trace) == this.debug_level_trace ;
	    this.isDebugErrorBitOn = ( debug_level_param & this.debug_level_error) == this.debug_level_error;	
    	this.logInfo = this.isInfoBitOn || this.isDebugTraceBitOn || this.isDebugErrorBitOn;
    	
	    //Info
	    if(this.isInfoBitOn){
		    this.logLevel = "Debug info:";
	    }
	    //Trace 
	    if(this.isDebugTraceBitOn ){
		    this.logLevel = "Debug trace:";
	    }
	    //debug_level_error or debug_level_Fatal 
	    if(this.isDebugErrorBitOn ){
		    this.logLevel = "Debug Error/Fatal:";
	    }		
	},

	log : function(value, debug_level_arg){
        if (this.logInfo == false) return;
        var isLogging = false;
        if((debug_level_arg & this.debug_level_info) && this.isInfoBitOn)
            isLogging = true;
        if((debug_level_arg & this.debug_level_trace) && this.isDebugTraceBitOn)
            isLogging = true;            
        if((debug_level_arg & this.debug_level_error) && this.isDebugErrorBitOn)
            isLogging = true;              
            
	    //write the log
    	if(isLogging == true)
		    log.info(this.logLevel + " " + value);
	    }
	};
	
	var thread = function(){
		return {
			init : function (patientReq, check, onComplete){
				this.fnCheck = check;
				this.request = patientReq;
				this.fnComplete = onComplete;
			},
			checkStatus : function (){
				if (this.fnCheck(this.request) == 1) this.fnComplete();
				else{
					return;
				}
			}
		};
	};
	
		var waitUntil = {
			threadPool : {},	
			getInstance : function(instanceID){
				var thd = this.threadPool[instanceID];
				if(thd === undefined){
					thd = new thread();
					this.threadPool[instanceID] = thd; 
					}
				
				return thd;
			},
			dispose : function(instanceID){
				delete this.threadPool[instanceID];
			}
		};
		
