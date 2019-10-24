var ManageCaseWorkFlow = ManageCaseWorkFlow || {};

ManageCaseWorkFlow.caseInformationTable = (function(){

  function caseDetails(component, caseInformation, i18nManageCaseO2) {
    var Value             = ManageCaseWorkFlow.KeyValueTable.Value,
        currentCaseStatus = caseInformation.CURRENT_CASE.STATUS_DISP || i18nManageCaseO2.NO_DATA,
        referralReason    = caseInformation.REFERRAL_REASON_DISP || i18nManageCaseO2.NO_DATA,
        finNbr            = getFinNbrDisplay(caseInformation, i18nManageCaseO2),
        caseDetails       = {},
        namespace         = component.namespace,
        componentId       = component.getComponentId(),
        programNames,
        programLinks,
        riskScore;

    if (caseInformation.PROGRAMS !== undefined) {
      programNames = getProgramNames(caseInformation, i18nManageCaseO2);
      programLinks = programNames;

      if (caseInformation.SHOW_SUPPORTING_FACTS === 1 && programNames !== i18nManageCaseO2.NO_DATA) {
        programLinks = getProgramLinksForDisplay(programNames, componentId);
      }

      caseDetails[i18nManageCaseO2.PROGRAM] = new Value(programLinks, programNames);
    }

    caseDetails[i18nManageCaseO2.REFERRAL_SOURCE] = new Value(
      getReferralSourceDisplay(i18nManageCaseO2, caseInformation, componentId, caseInformation.HAS_MODIFY_CASE_IND),
      getReferralSourceDisplay(i18nManageCaseO2, caseInformation, componentId, 0)
    );

    caseDetails[i18nManageCaseO2.REFERRAL_REASON] = new Value(referralReason, referralReason);

    caseDetails[i18nManageCaseO2.CASE_TYPE] = new Value(
      getCaseTypeDisplay(i18nManageCaseO2, caseInformation, componentId, 1),
      getCaseTypeDisplay(i18nManageCaseO2, caseInformation, componentId, 0)
    );

    caseDetails[i18nManageCaseO2.CASE_STATUS] = new Value(
      getCaseStatusDisplay(i18nManageCaseO2, caseInformation, componentId, caseInformation.HAS_MODIFY_CASE_IND),
      getCaseStatusDisplay(i18nManageCaseO2, caseInformation, componentId, 0)
    );

    caseDetails[i18nManageCaseO2.FIN_NBR] = new Value(finNbr, finNbr);

    if (caseInformation.RISK_SCORE !== undefined) {
      riskScore = caseInformation.RISK_SCORE || i18nManageCaseO2.NO_DATA;
      caseDetails[i18nManageCaseO2.RISK_SCORE] = new Value(riskScore, riskScore);
    }

    return ManageCaseWorkFlow.KeyValueTable.create({
      namespace: namespace,
      data: caseDetails,
      header: i18nManageCaseO2.CASE_DETAILS
    }).html();
  }

  function getProgramNames(caseInformation, i18nManageCaseO2) {
    var programsMap = $.map(caseInformation.PROGRAMS, function(p) { return p.NAME; }).join(i18nManageCaseO2.COMMA_JOINER);
    return  programsMap || i18nManageCaseO2.NO_DATA;
  }

  function getFinNbrDisplay(caseInformation, i18nManageCaseO2) {
    aliases = caseInformation.ALIASES || []
    finNbrAliases = $.grep(aliases, function(alias){ return alias.TYPE_MEANING === "FIN NBR"; })
    return finNbrAliases.length ?  finNbrAliases[0].ALIAS :  i18nManageCaseO2.NO_DATA;
  }

  function getProgramLinksForDisplay(programNames, componentId) {
    return "<a href='#' id='" + componentId  + "ProgramLink'>" + programNames + "</a>";
  }

  function getCaseStatusDisplay(i18nMcO2, caseInformation, componentId, showLink) {
    if (caseInformation.CURRENT_CASE.STATUS_DISP) {
      if (showLink) {
        return "<a href='#' id='"+ componentId + "CaseStatusLink'>"+ caseInformation.CURRENT_CASE.STATUS_DISP +"</a>" + " " + noOfDaysInCurrentStatus(i18nMcO2, caseInformation);
      } else {
        return caseInformation.CURRENT_CASE.STATUS_DISP +" "+ noOfDaysInCurrentStatus(i18nMcO2, caseInformation);
      }
    } else {
      return i18nMcO2.NO_DATA;
    }
  }

  function getReferralSourceDisplay(i18nMcO2, caseInformation, componentId, showLink) {
    if (caseInformation.REFERRAL_SOURCE_DISP) {
      if (showLink && caseInformation.REFERRAL_SOURCE_CDF !== "SYSTEM" && caseInformation.REFERRAL_SOURCES.length) {
        return '<a href="#" id="'+ componentId + 'ReferralSourceUpdateLink">'+ caseInformation.REFERRAL_SOURCE_DISP +'</a>';
      } else {
        return caseInformation.REFERRAL_SOURCE_DISP;
      }
    } else {
      return i18nMcO2.NO_DATA;
    }
  }

  function getCaseTypeDisplay(i18nMcO2, caseInformation, componentId, showLink) {
    if (caseInformation.ENCNTR_TYPE_DISP) {
      if (caseInformation.HAS_MODIFY_CASE_IND && caseInformation.AVAILABLE_CASE_TYPES.length > 0 && showLink) {
        return "<a href='#' id='" + componentId + "CaseTypeLink'>" + caseInformation.ENCNTR_TYPE_DISP + "</a>";
      } else {
        return caseInformation.ENCNTR_TYPE_DISP;
      }
    } else {
      return i18nMcO2.NO_DATA;
    }
  }

  function noOfDaysInCurrentStatus(i18nMcO2, caseInformation) {
    var i18nKey = caseInformation.CURRENT_CASE.NO_OF_DAYS_IN_CURRENT_STATUS == 1 ? i18nMcO2.STATUS_DISPLAY_SINGULAR : i18nMcO2.STATUS_DISPLAY_PLURAL;

    return i18nKey.replace("{days}", caseInformation.CURRENT_CASE.NO_OF_DAYS_IN_CURRENT_STATUS);
  }

  function caseDates(component, caseInformation, i18nManageCaseO2) {
    var Value = ManageCaseWorkFlow.KeyValueTable.Value;
    var namespace = component.namespace;
    var caseDates = {};

    caseDates[i18nManageCaseO2.DATE_ASSIGNED] = new Value(caseInformation.ASSIGNED_DATE);
    caseDates[i18nManageCaseO2.DATE_ENROLLED] = new Value(caseInformation.ENROLLED_DATE);

    return ManageCaseWorkFlow.KeyValueTable.create({
      namespace: namespace,
      data: caseDates,
      header: i18nManageCaseO2.CASE_DATES,
      numberOfEmptyRows: component.mfaAuthStatus.value ? 5 : 3
    }).html();
  }

  function casePersonnel(component, caseInformation, i18nManageCaseO2) {
    var Value               = ManageCaseWorkFlow.KeyValueTable.Value,
        careManagerFullName = caseInformation.CARE_MANAGER_FULL_NAME || i18nManageCaseO2.NO_DATA,
        casePersonnel       = {},
        namespace           = component.namespace,
        componentId  = component.getComponentId();

    casePersonnel[i18nManageCaseO2.CARE_MANAGER] = new Value(
      getCareManagerDisplay(componentId, caseInformation, i18nManageCaseO2, caseInformation.HAS_REASSIGN_CASE_IND),
      getCareManagerDisplay(componentId, caseInformation, i18nManageCaseO2, 0)
    );

    casePersonnel[i18nManageCaseO2.CASE_PHYSICIAN] = new Value(
      getCarePhysicianDisplay(componentId, caseInformation, i18nManageCaseO2, caseInformation.HAS_MODIFY_CASE_IND),
      getCarePhysicianDisplay(componentId, caseInformation, i18nManageCaseO2, 0)
    );

    return ManageCaseWorkFlow.KeyValueTable.create({
      namespace: namespace,
      data: casePersonnel,
      header: i18nManageCaseO2.CASE_PERSONNEL,
      numberOfEmptyRows: component.mfaAuthStatus.value ? 5 : 3
    }).html();
  }

  function getCareManagerDisplay(componentId, caseInformation, i18nManageCaseO2, showLink) {
    var careManagerFullName = caseInformation.CARE_MANAGER_FULL_NAME || i18nManageCaseO2.NO_DATA;

    if (showLink) {
      return "<span><a href='#' id='" + componentId + "CareManagerLink'>" + careManagerFullName + "</a></span>";
    } else {
      return careManagerFullName;
    }
  }

  function getCarePhysicianDisplay(componentId, caseInformation, i18nManageCaseO2, showLink) {
    var addText = '';

    if (showLink) {
      if (caseInformation.CASE_PHYSICIAN_FULL_NAME) {
        // If CASE_PHYSICIAN_FULL_NAME present, return name as link.
        return "<span><a href='#' id='" + componentId + "CasePhysicianUpdateLink'>" + caseInformation.CASE_PHYSICIAN_FULL_NAME + "</a></span>";
      } else {
        // If CASE_PHYSICIAN_FULL_NAME not present, return NO_DATA (--) with Add physician link besides it.
        addText = i18nManageCaseO2.PARENTHESES.replace("{display}", i18nManageCaseO2.ADD);
        return "<span>" + i18nManageCaseO2.NO_DATA + " <a href='#' id='" + componentId + "CasePhysicianAddLink'>" + addText + "</a></span>";
      }
    } else {
      // Return CASE_PHYSICIAN_FULL_NAME if present, else NO_DATA (--).
      return caseInformation.CASE_PHYSICIAN_FULL_NAME || i18nManageCaseO2.NO_DATA;
    }
  }

  //private api exposed for testing
  ManageCaseWorkFlow.__caseInformationTable = {
    caseDetails   : caseDetails,
    caseDates     : caseDates,
    casePersonnel : casePersonnel
  };

  return function(component, caseInformation) {
    var html = caseDetails(component, caseInformation, component.i18n);
    html += caseDates(component, caseInformation, component.i18n);
    html += casePersonnel(component, caseInformation, component.i18n);

    return html;
  };
})();
