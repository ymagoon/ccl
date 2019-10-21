var ManageCaseSumm = ManageCaseSumm || {};

ManageCaseSumm.caseInformation = (function(){
  function numberOfDaysInCurrentStatus(caseStatusDate) {
    var currentStatusDateInMs = caseStatusDate.setHours(0,0,0);
    var currentTimeInMs = new Date().setHours(0,0,0);
    var oneDayInMs = 24 * 60 * 60 * 1000;

    return Math.round((currentTimeInMs - currentStatusDateInMs)/(oneDayInMs));
  }

  function formattedDate(i18nMcO1, caseInformation, statusMeaning) {
    var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    var newCaseInformation = findCaseStatus(caseInformation, { STATUS_CDF_MEANING: statusMeaning});

    if (newCaseInformation && newCaseInformation.STATUS_ISO_DT_TM) {
      return dateFormatter.formatISO8601(newCaseInformation.STATUS_ISO_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
    } else {
      return i18nMcO1.NO_DATA;
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

  function getProgramDataDisplay(caseInformation, i18nMcO1, programLinkId) {
    if (caseInformation.PROGRAMS && caseInformation.PROGRAMS.length > 0) {
      return "<a href='#' id='" + programLinkId + "'>" +
        $.map($.makeArray(caseInformation.PROGRAMS), function(program){ return program.NAME;})
        .join(i18nMcO1.COMMA) + "</a>";
    }
    else {
      return i18nMcO1.NO_DATA;
    }
  }

  function getCaseStatusDisplay(i18nMcO1, currentCase) {
    if (currentCase && currentCase.STATUS_DISP) {
      var i18nKey = currentCase.numberOfDaysInCurrentStatus == 1 ? i18nMcO1.STATUS_DISPLAY_SINGULAR : i18nMcO1.STATUS_DISPLAY_PLURAL;

      return i18nKey
        .replace("{days}", currentCase.numberOfDaysInCurrentStatus)
        .replace("{case_status}", currentCase.STATUS_DISP);
    } else {
      return i18nMcO1.NO_DATA;
    }
  }

  function getFinNbrDisplay(caseInformation, i18nMcO1) {
    aliases = caseInformation.ALIASES || []
    finNbrAliases = $.grep(aliases, function(alias){ return alias.TYPE_MEANING === "FIN NBR"; })
    return finNbrAliases.length ?  finNbrAliases[0].ALIAS :  i18nMcO1.NO_DATA;
  }

  ManageCaseSumm.__caseInformation = {
    numberOfDaysInCurrentStatus: numberOfDaysInCurrentStatus
  };

  // public
  return function(component, caseInformation) {
    var currentCase   = findCaseStatus(caseInformation, { STATUS_CD: caseInformation.CURRENT_STATUS_CD }) || {};
    var i18nMcO1      = component.i18n;
    var programLinkId = component.getComponentId() + "-program-link";
    var assignedDate  = formattedDate(i18nMcO1, caseInformation, "NEW");
    var enrolledDate  = formattedDate(i18nMcO1, caseInformation, "ENROLLED");
    var caseRows;

    currentCase.numberOfDaysInCurrentStatus = numberOfDaysInCurrentStatus(new Date(formattedDate(i18nMcO1, caseInformation, currentCase.STATUS_CDF_MEANING)));

    caseRows = [
      { 
        ID: 'PROGRAM',
        LABEL: i18nMcO1.PROGRAM,
        VALUE: getProgramDataDisplay(caseInformation, i18nMcO1, programLinkId),
        GROUPER: "case-detail"
      },
      {
        ID: 'SOURCE',
        LABEL: i18nMcO1.REFERRAL_SOURCE,
        VALUE: caseInformation.REFERRAL_SOURCE_DISP || i18nMcO1.NO_DATA,
        GROUPER: "case-detail"
      },
      {
        ID: 'REASON',
        LABEL: i18nMcO1.REFERRAL_REASON,
        VALUE: caseInformation.REFERRAL_REASON_DISP || i18nMcO1.NO_DATA,
        GROUPER: "case-detail"
      },
      {
        ID: 'CASE_TYPE',
        LABEL: i18nMcO1.CASE_TYPE,
        VALUE: caseInformation.ENCNTR_TYPE_DISP || i18nMcO1.NO_DATA,
        GROUPER: "case-detail"
      },
      {
        ID: 'CASE_STATUS',
        LABEL: i18nMcO1.CASE_STATUS,
        VALUE: getCaseStatusDisplay(i18nMcO1, currentCase),
        GROUPER: "case-detail"
      },
      {
        ID: 'FIN',
        LABEL: i18nMcO1.FIN_NBR,
        VALUE: getFinNbrDisplay(caseInformation, i18nMcO1),
        GROUPER: "case-detail"
      },
      {
        ID: 'SCORE',
        LABEL: i18nMcO1.RISK_SCORE,
        VALUE: caseInformation.RISK_SCORE || i18nMcO1.NO_DATA,
        GROUPER: "case-detail"
      },
      {
        ID: 'DATE_ASSIGNED',
        LABEL: i18nMcO1.DATE_ASSIGNED,
        VALUE: assignedDate || i18nMcO1.NO_DATA,
        GROUPER: "case-date"
      },
      {
        ID: 'DATE_ENROLLED',
        LABEL: i18nMcO1.DATE_ENROLLED,
        VALUE: enrolledDate || i18nMcO1.NO_DATA,
        GROUPER: "case-date"
      },
      {
        ID: 'MANAGER',
        LABEL: i18nMcO1.CARE_MANAGER,
        VALUE: caseInformation.CARE_MANAGER_FULL_NAME || i18nMcO1.NO_DATA,
        GROUPER: "case-personnel"
      },
      {
        ID: 'PHYSICIAN',
        LABEL: i18nMcO1.CASE_PHYSICIAN,
        VALUE: caseInformation.CASE_PHYSICIAN_FULL_NAME || i18nMcO1.NO_DATA,
        GROUPER: "case-personnel"
      }
    ];
    if(component.mfaAuthStatusData && component.mfaAuthStatusData.statusInd === false) {
      caseRows = $.grep(caseRows, function(row, i) { if(row.ID !== 'PROGRAM' && row.ID !== 'SCORE') { return row } });
    }
    return caseRows;
  };
})();
