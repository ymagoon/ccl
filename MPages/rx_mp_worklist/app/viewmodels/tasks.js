define(['durandal/system', 'knockout', 'moment', 'mpages/logger', 'mpages/mp_util'], function (system, ko, moment, logger, mp_util) {
    var tasksVM = function () {
        /***
        *   Array of tasks
        */
        this.tasks = ko.observableArray([]);
    };

    /***
    *   Activate function called by Durandal when the ViewModel is activated
    */
    tasksVM.prototype.activate = function (tasks) {
        if (tasks)
            this.tasks(tasks.COLTASKQUAL);
    };

    /*
    *   Retrieves the localized date
    *   @method getLocalizedDate
    *   @param {String} utcDateString - a UTC date
    *   @return {String} Localized date
    */
    tasksVM.prototype.getLocalizedDate = function (utcDateString) {
        return mp_util.getLocalizedDate(utcDateString, system.getModuleId(this));
    };

    tasksVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.tasks = null;
        viewModelReference = null;
    };


    return tasksVM;
});