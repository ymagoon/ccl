define(['durandal/app', 'durandal/system', 'knockout', 'services/model', 'mpages/logger', 'i18next'], function (app, system, ko, model, logger, i18n) {
    /*******************************************************************
    *   Private variables
    *
    *******************************************************************/
    var viewsLoaded = false;
    var highRiskCategoriesLoaded = false;
    var queuedQualificationCriteria = null;
    var availableHRCList = null;
    var availableViews = null;
    var defaultMyPopulationView = null;

    /******************************************************************
    *   Observables
    *
    ******************************************************************/

    var currentView = ko.observable();
    var viewPayload = ko.observable();

    /********************************************************************
    *   Private functions
    *
    ********************************************************************/

    /**
    *   Pauses the worklist activation to wait for the views to load
    *   @method pauseWorklistActivation
    *   @params {Object} dataToQueue
    */
    function pauseWorklistActivation(dataToQueue) {
        queuedQualificationCriteria = dataToQueue;
    }

    /**
    *   Resumes the worklist activation. This happens after the views are loaded
    *   @method continueWorklistActivation
    */
    function continueWorklistActivation() {

        if (queuedQualificationCriteria) {
            viewPayload({ QualificationCriteria: queuedQualificationCriteria, isAdHocSearch: true, AvailableViews: availableViews });
            currentView('viewmodels/worklist');
            queuedQualificationCriteria = null;
        }
    }

    function dispose() {
        if (viewsLoadedSubscription)
            viewsLoadedSubscription.off();

        if (viewsLoadFailedSubscription)
            viewsLoadFailedSubscription.off();

        if (categoriesLoadedSubscription)
            categoriesLoadedSubscription.off();

        if (categoriesLoadFailedSubscription)
            categoriesLoadFailedSubscription.off();

        if (loadMyPopulationSubscription)
            loadMyPopulationSubscription.off();

        if (loadSearchResultSubscription)
            loadSearchResultSubscription.off();

        queuedQualificationCriteria = null;
        availableHRCList = null;
        availableViews = null;
        defaultMyPopulationView = null;
        currentView = null;
        viewPayload = null;

        app.trigger('mpage-reload');
        location.reload(true);
    }

    /***********************************************************************
    *   Event subscriptions
    *
    ***********************************************************************/
    var viewsLoadedSubscription = app.on('views-loaded').then(function (viewsList, defaultView) {
        viewsLoaded = true;
        availableViews = viewsList;
        defaultMyPopulationView = defaultView;
        // If there is no default MyPopulation view and there is queued ad-hoc search, continue its execution
        if (!defaultView && queuedQualificationCriteria) {
            continueWorklistActivation();
        }

        // Reset the queue
        queuedQualificationCriteria = null;
    });

    var categoriesLoadedSubscription = app.on('categories-loaded').then(function (availableHRC) {
        availableHRCList = availableHRC;
        highRiskCategoriesLoaded = true;
    });

    var viewsLoadFailedSubscription = app.on('views-load-failed').then(function () {
        viewsLoaded = false;
        availableViews = null;
        defaultMyPopulationView = null;
    });

    var categoriesLoadFailedSubscription = app.on('categories-load-failed').then(function () {
        highRiskCategoriesLoaded = false;
        availableHRCList = null;
    });

    var loadSearchResultSubscription = app.on('load-search-results').then(function (qualificationCriteria) {
        // ensure that MyPopulations are loaded
        if (!viewsLoaded) {
            // pause activation of adhoc-search view as there can be a default MyPopulation view
            pauseWorklistActivation(qualificationCriteria);
            return;
        }
        if (qualificationCriteria && viewsLoaded && highRiskCategoriesLoaded) {
            qualificationCriteria.MPREQUEST.HRCsToDisplay = [];

            for (var index = 0; index < availableHRCList.length; index++) {
                if (availableHRCList[index].DEFAULT_IND) {
                    qualificationCriteria.MPREQUEST.HRCsToDisplay.push({ FILTERID: availableHRCList[index].FILTER_ID + ".0" });
                }
            }

            viewPayload({
                QualificationCriteria: qualificationCriteria,
                isAdHocSearch: true,
                AvailableViews: availableViews,
                DefaultView: defaultMyPopulationView
            });
            currentView('viewmodels/worklist');
        }
    });

    var loadMyPopulationSubscription = app.on('load-myPopulation').then(function (viewInfo) {
        if (viewInfo && viewsLoaded && highRiskCategoriesLoaded) {
            var viewDetails = viewInfo().MYPOPJSON.LISTREPLY;
            var qualificationCriteria = {};
            qualificationCriteria.PTCNT = viewDetails.PTCNT;
            qualificationCriteria.FUCNT = viewDetails.FUCNT;

            if (viewDetails.PTCNT === 0)
                qualificationCriteria.PTLIST = [];
            else
                qualificationCriteria.PTLIST = viewDetails.PTLIST;

            if (viewDetails.FUCNT === 0)
                qualificationCriteria.FUQUAL = [];
            else
                qualificationCriteria.FUQUAL = viewDetails.FUQUAL;

            qualificationCriteria.ORGSEC = viewDetails.ORGSEC;
            qualificationCriteria.BWTOPICMEAN = viewDetails.BWTOPICMEAN;
            qualificationCriteria.PRSNLID = viewDetails.PRSNLID;
            qualificationCriteria.PATIENT_ID = "0.0";
            qualificationCriteria.ENCNTR_ID = "0.0";
            qualificationCriteria.HRCsToDisplay = [];

            for (var index = 0; index < viewDetails.COLUMNS.length; index++) {
                qualificationCriteria.HRCsToDisplay.push({ FILTERID: viewDetails.COLUMNS[index].FILTER_ID + ".0" });
            }

            viewPayload({
                QualificationCriteria:
                {
                    MPREQUEST: qualificationCriteria
                },
                isAdHocSearch: false,
                ViewInfo: viewInfo,
                HRCList: availableHRCList,
                AvailableViews: availableViews,
                DefaultView: defaultMyPopulationView
            });
            currentView('viewmodels/worklist');
        } else {
            logger.logError(i18n.t('app:modules:worklist:WORKLIST_LOAD_FAILED'), [viewInfo, viewsLoaded, highRiskCategoriesLoaded], system.getModuleId(self) + ':load-myPopulation', true);
        }
    });

    return {
        currentWorklistView: currentView,
        qualificationCriteria: viewPayload,
        activate: function () {
            if (window.external && 'MPAGESOVERRIDEREFRESH' in window.external) {
                window.external.MPAGESOVERRIDEREFRESH("dispose()");
            }
        },
        detached: function (node, parentNode, viewModelReference) {
            dispose();
            viewModelReference = null;
        }
    };
});