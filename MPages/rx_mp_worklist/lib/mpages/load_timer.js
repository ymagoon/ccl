define(['mpages/request_timer', 'knockout'], function (RequestTimer, ko) {
    var loadTimer = new RequestTimer();
    loadTimer.setTimerName("USR:MPG.WRKLIST.INIT_PHARMACIST_WORKLIST - initialize worklist");
    loadTimer.patientPopulationLoaded = ko.observable(false);
    loadTimer.populationLinksLoaded = ko.observable(false);
  
    loadTimer.canStop = ko.computed(function () {
        if (loadTimer.patientPopulationLoaded() && loadTimer.populationLinksLoaded()) {
            loadTimer.stop();
            return true;
        }
        return false;
    });

    return loadTimer;
});