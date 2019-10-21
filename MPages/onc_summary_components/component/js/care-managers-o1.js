CareManagers = (function() {
  "use strict";

  function Component(criterion) {
    // required attributes
    this.setCriterion(criterion);
    this.setStyles(new Style());
    this.setComponentLoadTimerName("USR:MPG.CARE_MANAGERS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.CARE_MANAGERS.O1 - render component");

    // custom attributes
    Component.i18n = i18n.discernabu.CareManagers;
  }

  function Style() {
    this.initByNamespace("hcmCareManagers");
  }

  // inherit from ComponentStyle
  Style.prototype = new ComponentStyle();

  // inherit from MPageComponent
  Component.prototype = new MPageComponent();

  // define bedrock mapping
  MP_Util.setObjectDefinitionMapping("CARE_MANAGERS_COMP", Component);

  /**
   * STATIC INITIALIZATIONS
   */

  var PAGE_SIZE = 20;

  /**
   * SUPPORTING PUBLIC METHODS
   */

  /**
   * Load bedrock filters.
   */
  Component.prototype.loadFilterMappings = function() {
    var component = this;

    this.addFilterMappingObject('CARE_MANAGERS_TEST_URI', {
      setFunction: function(value) { component.testURI(value); },
      type: 'STRING',
      field: 'FREETEXT_DESC'
    });

    this.addFilterMappingObject('HIDE_POTENTIAL_CASES_COUNT', {
      setFunction: function(value) { component.setIsPotentialCasesDisabled(value); },
      type: "BOOLEAN",
      field: "FREETEXT_DESC"
    });
  };

  /**
   * Test uri setter/getter.
   */
  Component.prototype.testURI = function(uri) {
    if (uri) {
      this._testURI = uri.replace(/&#047;/g, "/");
    }
    return this._testURI || "";
  };

  /**
   * Disable Potential Cases Column flag setter.
   */
  Component.prototype.setIsPotentialCasesDisabled = function(hidePotentialCasesFlag) {
    this.isPotentialCasesDisabled = hidePotentialCasesFlag;
  };

  /**
   * Getter for isPotentialCasesDiasbled flag. Defaults to false.
   * @param: none
   * 
   * Returns isPotentialCasesDisabled flag.
   */
  Component.prototype.getIsPotentialCasesDisabled = function() {
    return this.isPotentialCasesDisabled || false;
  };

  /**
   * Entry point of the component when it is loaded. Retrieve the care manager data and set the callback to render the
   * component when it is ready.
   */
  Component.prototype.retrieveComponentData = function() {
    var component = this;

    // Perform MFA and set component.mfaAuthStatus attribute.
    component.performMFA();

    if (component.mfaAuthStatus && component.mfaAuthStatus.value === false) {
      component.setIsPotentialCasesDisabled(true);
    }

    // load component care managers list
    component.retrieveCareManagers(0, function(careManagers) {
      component.renderComponent(careManagers);
    });
  };

  /**
   * Gets the Multi factor authentication data and sets the mfaAuthStatus which is used in alert banner.
   */
  Component.prototype.performMFA = function() {
    var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
    var authResourceAvailable = authStatus && authStatus.isResourceAvailable();
    var authStatusData = authResourceAvailable && authStatus.getResourceData();

    if (authStatusData) {
      // 0 - Authentication Success 5 - Authentication Not Required
      authStatusData.value = authStatusData.status === 0 || authStatusData.status === 5;

      this.mfaAuthStatus = authStatusData;
    } else {
      // Display generic utility error message.
      this.mfaAuthStatus = { value: false, message: i18n.discernabu.mfa_auth.MFA_ERROR_MSG, status: 4 };
    }

    // Audit the MFA event.
    this.auditMFAEvent();
  };

  /**
   *  Adds audit event data for multi factor authentication
   */
  Component.prototype.auditMFAEvent = function() {
    var providerID = this.criterion.provider_id + '.0';
    var mpEventAudit = new MP_EventAudit();
    var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    var dateTime = dateFormatter.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

    mpEventAudit.setAuditMode(0);
    mpEventAudit.setAuditParticipantType('PERSON');
    mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
    mpEventAudit.setAuditParticipantID(providerID);
    mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
    mpEventAudit.setAuditDataLifeCycle(null);
    mpEventAudit.setAuditEventName('HCM_CARE_MANAGER_LIST_MFA_ATTEMPT');
    mpEventAudit.setAuditEventType('SECURITY');
    mpEventAudit.setAuditParticipantName('STATUS=' + this.mfaAuthStatus.status + ';DATE=' + dateTime);
    mpEventAudit.addAuditEvent();
    mpEventAudit.submit();
  };

  /**
   * Retrieve a given page of care manager and execute a callback on that data.
   */
  Component.prototype.retrieveCareManagers = function(page, successCallback) {
    var component = this;
    var isPotentialCasesDisabled = component.getIsPotentialCasesDisabled();

    scriptRequest(component, {
      name: "HCM_GET_CARE_MANAGERS_V2",
      params: [
        component.getCriterion().provider_id + '.0',
        page * PAGE_SIZE,
        PAGE_SIZE, '^' + component.testURI() + '^',
        isPotentialCasesDisabled
      ],
      success: function(response) {
        var careManagers = formatAlignmentCounts(response.CARE_MANAGERS);
        careManagers.total_results = response.TOTAL_RESULTS;

        successCallback && successCallback(careManagers);
      }
    });
  };

  /**
   * Get the MPage UI alert banner when MFA authentication has an error.
   * @returns {String} alert banner html string.
   */
  Component.prototype.mfaAlertBanner = function() {
    var bannerHtml = '';
    var alertBanner;

    // Return an alert banner if Multi factor authentication fails.
    if (!this.mfaAuthStatus.value) {
      alertBanner = new MPageUI.AlertBanner();

      // 2 - Access denied  authentication failed, 3 - Access denied authentication cancelled 
      if (this.mfaAuthStatus.status === 2 || this.mfaAuthStatus.status === 3) {
        alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.INFO);
      } else {
        alertBanner.setType(MPageUI.ALERT_OPTIONS.TYPE.ERROR);
      }

      alertBanner
        .setPrimaryText(this.mfaAuthStatus.message)
        .setSecondaryText(Component.i18n.MFA_SECONDARY_ERROR_TXT);

      bannerHtml = alertBanner.render();
    }

    return bannerHtml;
  };

  /**
   * Render the care manager table and pager.
   * @param {Object} careManagers - a page list of care managers and their alignment counts along with the total.
   *        {Object} table - an optional table that can be injected for testing.
   *        {Object} pager - an optional pager that can be injected for testing.
   */
  Component.prototype.renderComponent = function(careManagers, table, pager) {
    var component = this;
    var html = "";
    var nameSpace = this.getStyles().getNameSpace();
    var componentId = this.getComponentId();
    var categoryMean = component.getCriterion().category_mean;
    var table = table || new CareManagersTable(
          careManagers,
          nameSpace,
          componentId,
          categoryMean,
          component.getIsPotentialCasesDisabled()
        );
    var pager = pager || new CareManagersPager(careManagers.total_results, PAGE_SIZE, function(pageInfo) {
          component.retrieveCareManagers(pageInfo.currentPage, function(careManagers) {
            pageComponent(careManagers, table, pager);
          });
        });
    html += component.mfaAlertBanner();
    html += table.render();

    if (pager.numberPages() > 1) {
      html += pager.render();
    }

    this.finalizeComponent(html, Component.i18n.TOTAL_RESULTS.replace('{total_results}', careManagers.total_results));
    if (pager.numberPages() > 1) {
      pager.attachEvents();
    }
    this.setComponentTable(table);
    table.finalize();
  };

  // private api exposed for testing
  Component.__private = {
    pageComponent: pageComponent,
    scriptRequest: scriptRequest,
    handleRawResponse: handleRawResponse
  };

  /**
   * PRIVATE FUNCTIONS
   */

  function formatAlignmentCounts(careManagers) {
    var formatted = careManagers.slice();

    $.each(formatted, function(_, careManager) {
      if (careManager.POTENTIAL_CASES === -1) {
        careManager.POTENTIAL_CASES = Component.i18n.NO_DATA;
      }
    });

    return formatted;
  };

  /**
   * An on page callback that updates the table with a new page of care managers, updates the pager, and selects the
   * first care manager in the list.
   */

  function pageComponent(careManagers, table, pager) {
    table.update(careManagers);
    pager.update(careManagers.total_results);

    // select the first care manager in the list.
    table.clickRow(0);
  }

  /**
   * Creates and performs a ComponentScriptRequest. Will be moved into reusable library in HICAREDEV-307
   * @param {Object} settings - setting for the ComponentScriptReply.
   *        {String} name - name of the ccl program that needs to be executed.
   *        {(String|String[])} [params] - a param, or an array of params to be passed to the ccl script.
   *        {Boolean} [rawDataIndicator] - sets the raw data on ComponentScriptRequest and sets response
   *                                       handler to handle raw data correctly.
   *        {callBack} success - sets a success callback handler. This callback gets the json parsed body
   *                     from the proxyReply when raw data is set and response object when it's not set.
   *        {callBack} failure - sets a failure callback handler. This callback gets the json parsed proxyReply
   *                     when raw data is set and is never called when it's not set.
   *        {RTMSTimer} [loadTimer=new RTMSTimer(component.getComponentLoadTimerName())]
   *        {RTMSTimer} [renderTimer=new RTMSTimer(component.getComponentRenderTimerName())]
   */
  function scriptRequest(component, settings) {
    var settings      = settings || {},
        loadTimer     = settings.loadTimer || new RTMSTimer(component.getComponentLoadTimerName()),
        renderTimer   = settings.renderTimer || new RTMSTimer(component.getComponentRenderTimerName()),
        scriptRequest = new ComponentScriptRequest();

    scriptRequest.setComponent(component);
    scriptRequest.setLoadTimer(loadTimer);
    scriptRequest.setRenderTimer(renderTimer);
    scriptRequest.setProgramName(settings.name);
    settings.params && scriptRequest.setParameterArray(["^MINE^"].concat(settings.params));

    if (settings.rawDataIndicator) {
      scriptRequest.setRawDataIndicator(settings.rawDataIndicator);
      scriptRequest.setResponseHandler(function(reply) {
        handleRawResponse(reply, settings.success, settings.failure);
      });
    } else {
      scriptRequest.setResponseHandler(function(reply) { settings.success(reply.getResponse()); });
    }

    scriptRequest.performRequest();
  }

  function handleRawResponse(reply, successHandler, failureHandler) {
    var proxyReply = JSON.parse(reply.getResponse()).PROXYREPLY,
        status     = proxyReply.HTTPREPLY.STATUS;

    if (proxyReply.TRANSACTIONSTATUS.SUCCESSIND === 1 && status === 200) {
      successHandler && successHandler(JSON.parse(proxyReply.HTTPREPLY.BODY));
    } else if (proxyReply.TRANSACTIONSTATUS.PREREQERRORIND === 1) {
      failureHandler && failureHandler(proxyReply);
    }
  }

  return Component;
})();
