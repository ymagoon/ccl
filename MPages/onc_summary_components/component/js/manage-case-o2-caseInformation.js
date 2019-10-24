var ManageCaseWorkFlow = ManageCaseWorkFlow || {};

ManageCaseWorkFlow.caseInformation = (function(){

  function formattedDate(caseInformation, statusMeaning) {
    var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    var newCaseInformation = findCaseStatus(caseInformation, { STATUS_CDF_MEANING: statusMeaning})

    if(newCaseInformation && newCaseInformation.STATUS_ISO_DT_TM) {
      return dateFormatter.formatISO8601(newCaseInformation.STATUS_ISO_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
    } else {
      return i18n.discernabu.manageCaseO2.NO_DATA;
    }
  }

  /**
   * This method will find the case status object from the response
   * @param {object} caseInformation: Case Information object.
   * @param {object} options: Object with key value pair.
   *        STATUS_CD          : status code
   *        STATUS_CDF_MEANING : status cdf meaning
   *        STATUS_DISP        : status display
   *        STATUS_ISO_DT_TM   : status iso dt tm
   *
   * @return case status object
   */
  function findCaseStatus(caseInformation, options) {
    // sets the first property in options to "key" variable.
    // For Example, options = {a: 'b'} then key will become key = 'a'
    for(var key in options) { break; }

    return $.grep(caseInformation.CASE_STATUSES, function(caseStatus) {
      return caseStatus[key] === options[key];
    })[0];
  }

  function availableCaseStatuses(caseInformation) {
    delete caseInformation.AVAILABLE_CASE_STATUSES['CLOSURE_REASONS'];

    return $.grep(caseInformation.AVAILABLE_CASE_STATUSES.STATUSES, function(status) {
      return status.STATUS_CDF_MEANING != 'CLOSED'
    });
  }

  function numberOfDaysInCurrentStatus(caseStatusDate) {
    var currentStatusDateInMs = caseStatusDate.setHours(0,0,0);
    var currentTimeInMs = new Date().setHours(0,0,0);
    var oneDayInMs = 24 * 60 * 60 * 1000;

    return Math.round((currentTimeInMs - currentStatusDateInMs)/(oneDayInMs));
  }

  //private api exposed for testing
  ManageCaseWorkFlow.__caseInformation = {
    numberOfDaysInCurrentStatus: numberOfDaysInCurrentStatus
  };

  //public

  return function(rawCaseInformation, readOnly, mfaStatus) {
    var caseInformation = $.extend({}, rawCaseInformation);
    caseInformation.CURRENT_CASE = findCaseStatus(caseInformation, { STATUS_CD: caseInformation.CURRENT_STATUS_CD }) || {};
    caseInformation.CURRENT_CASE.NO_OF_DAYS_IN_CURRENT_STATUS = numberOfDaysInCurrentStatus(new Date(formattedDate(caseInformation, caseInformation.CURRENT_CASE.STATUS_CDF_MEANING)))
    caseInformation.ASSIGNED_DATE= formattedDate(caseInformation, "NEW");
    caseInformation.ENROLLED_DATE= formattedDate(caseInformation, "ENROLLED");
    caseInformation.AVAILABLE_CASE_STATUSES.STATUSES = availableCaseStatuses(caseInformation);
    caseInformation.SHOW_SUPPORTING_FACTS = 1;
    // Filter out current case type.
    caseInformation.AVAILABLE_CASE_TYPES = $.grep($.makeArray(caseInformation.AVAILABLE_CASE_TYPES), function(caseType) {
      return caseType.CASE_TYPE_CD !== caseInformation.ENCNTR_TYPE_CD;
    });

    caseInformation.REFERRAL_SOURCES = $.grep($.makeArray(caseInformation.REFERRAL_SOURCES), function(referralSource) {
      return referralSource.CODE_VALUE !== caseInformation.REFERRAL_SOURCE_CD;
    });
    
    if (readOnly){
      caseInformation.SHOW_SUPPORTING_FACTS = 0;
    }
    
    if (caseInformation.CURRENT_CASE.STATUS_CDF_MEANING === "CLOSED" || readOnly) {
      caseInformation.HAS_MODIFY_CASE_IND = 0
      caseInformation.HAS_REASSIGN_CASE_IND = 0
    }

    if (!mfaStatus) {
      delete caseInformation.PROGRAMS;
      delete caseInformation.RISK_SCORE;
    }

    return caseInformation;
  };
})();
