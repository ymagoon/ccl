define(['services/dataservice', 'durandal/app', 'durandal/system', 'mpages/logger', 'knockout', 'ko.command', 'i18next', 'mpages/load_timer', 'jquery'], function (dataService, app, system, logger, ko, koCommand, i18n, loadTimer, $) {

    var viewList = ko.observableArray([]);
    var selectedView = ko.observable();
    var HRCDescriptionsList = ko.observableArray([]);
    var isLoading = ko.observable(false);
    var defaultMyPopulationView = ko.observable();
    var isViewListActive = ko.observable(true);

    var loadSearchResultsSubscription = app.on('load-search-results').then(function (qualificationCriteria) {
        if (qualificationCriteria) {
            selectedView(undefined);
        }
    });

    var viewsUpdatedSubscription = app.on('views-updated').then(function (updatedList) {
        // need to refresh the dropdown list as an item in the list might have changed.
        // so clean the existing bindings and reapply them.

        var nodeToClean = $("#myPopulations");
        if (nodeToClean && nodeToClean.length === 1) {
            ko.cleanNode(nodeToClean[0]);
            ko.applyBindings(vm, nodeToClean[0]);
        } else {
            logger.logError(i18n.t('app:modules.populationLinks.UPDATE_VIEW_FAILED'), nodeToClean, system.getModuleId(self) + ':view-updated', true);
        }

        nodeToClean = null;
    });

    var reloadWorklistSubscription = app.on('mpage-reload').then(function () {
        dispose();
        if (reloadWorklistSubscription) {
            reloadWorklistSubscription.off();
            reloadWorklistSubscription = null;
        }
    });

    var worklistLoadingSubscription = app.on('worklist-loading').then(function () {
        isViewListActive(false);
    });

    var worklistLoadedSubscription = app.on('worklist-loaded worklist-load-failed').then(function () {
        isViewListActive(true);
    });

    var mpageReloadSubscription = app.on('mpage-reload').then(function () {
        dispose();
    });

    /**
    * Loads the Patients List using the data service.
    * @method loadPatientsList
    */
    function loadMyViews() {
        return dataService.getMyViews()
            .done(function (myViewListReturn, defaultView) {
                if (myViewListReturn) {
                    // set the observable
                    myViewListReturn = myViewListReturn.sort(Sort);
                    viewList(myViewListReturn);
                    defaultMyPopulationView(defaultView);
                }
            })
            .fail(function (response) {
                logger.logError(i18n.t('app:modules.populationLinks.VIEWS_LOAD_FAILED'), response, system.getModuleId(self) + ' - loadMyViews', true);
                app.trigger('views-load-failed');
            });
    }

    /**
    *   Loads the High Risk Categories descriptions
    *   @method loadHRCDescriptions
    */
    function loadHRCDescriptions() {
        return dataService.getHighRiskCatDescriptions()
            .done(function (HRCDescReturn) {
                HRCDescriptionsList(HRCDescReturn);
            })
            .fail(function (response) {
                logger.logError(i18n.t('app:modules.populationLinks.HRC_LOAD_FAILED'), response, system.getModuleId(self) + ' - loadHRCDescriptions', true);
                app.trigger('categories-load-failed');
            });
    }

    /** Manual notification change subscriptions **/

    // Subscribe to population view combo selection change (the 'selectedView' observable):
    selectedView.subscribe(function (newView) {
        if (newView) {
            // Raise an event for other subscribers to know a new population view has been selected:
            app.trigger('load-myPopulation', selectedView);
        }
    });

    function Sort(populationA, populationB) {
        return populationA.MYPOPJSON.LISTREPLY.DISPLAYNAME.localeCompare(populationB.MYPOPJSON.LISTREPLY.DISPLAYNAME);
    }

    function dispose() {
        if (loadSearchResultsSubscription)
            loadSearchResultsSubscription.off();

        if (viewsUpdatedSubscription)
            viewsUpdatedSubscription.off();

        if (worklistLoadingSubscription)
            worklistLoadingSubscription.off();

        if (worklistLoadedSubscription)
            worklistLoadedSubscription.off();

        viewList = null;
        selectedView = null;
        HRCDescriptionsList = null;
        isLoading = null;
        defaultMyPopulationView = null;
        isViewListActive = null;
    }

    var vm = {
        /*
        *   Activate function that is invoked by Durandal when this View Model is loaded.
        *   It initializes the populations dropdown and MyPopulations button
        *   @method activate
        */
        activate: function () {
            isLoading(true);
            $.when(loadMyViews(), loadHRCDescriptions())
            .done(function () {
                app.trigger('views-loaded', viewList(), defaultMyPopulationView);
                app.trigger('categories-loaded', HRCDescriptionsList());
                selectedView(defaultMyPopulationView());
            })
            .fail(function () {
                loadTimer.abort();
            })
            .always(function () {
                isLoading(false);
                loadTimer.populationLinksLoaded(true);
            });

        },
        isViewListActive: isViewListActive,
        isLoading: isLoading,
        /**
        *   List of available views
        */
        myViewList: viewList,
        /**
        *   The current selected view
        */
        mySelectedView: selectedView,
        viewListCaption: i18n.t('app:modules.populationLinks.VIEW_LIST_CAPTION'),
        /**
        *   function that appends an asterix for a default view
        */
        viewDisplayName: function (item) {
            if (item.MYPOPJSON.LISTREPLY.DISPLAYDEFAULT !== 0)
                return item.MYPOPJSON.LISTREPLY.DISPLAYNAME + "*";
            else
                return item.MYPOPJSON.LISTREPLY.DISPLAYNAME;
        },
        /**
        *   Specifies the command that executes when my populations button is clicked
        */
        showMyPop: koCommand.asyncCommand({
            execute: function (callback) {
                app.showDialog("viewmodels/my_populations", { myViewsList: viewList, defaultView: defaultMyPopulationView }, 'custom').done(function () {
                    callback();
                })
                .fail(function () {
                    logger.logError(i18n.t('app:modules.populationLinks.MY_POPULAIONS_FAILED'), null, system.getModuleId(self) + '- showMyPop', true);
                });
            },
            canExecute: function (isExecuting) {
                return !isExecuting && !isLoading() && HRCDescriptionsList().length > 0;
            }
        }),

        detached: function (node, parentNode, viewModelReference) {
            dispose();
            viewModelReference = null;
        }
    };

    return vm;
});