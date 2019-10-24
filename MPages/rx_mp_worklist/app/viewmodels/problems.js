define(['knockout'], function (ko) {
    var problemsVM = function () {
        /***
        *   An observable array of problems
        */
        this.problems = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the problems for the patient.
    *   @method activate
    *   @params {Object} patientDetails - patient data passed in via the view
    */
    problemsVM.prototype.activate = function (patientDetails) {
        this.problems(patientDetails.COLPROBLEMQUAL);
    };

    /**
    *   Retrieves the header used while displaying problems
    *   @method getProblemHeader
    *   @params {Object} currentProblem
    *   @return {String} header
    */
    problemsVM.prototype.getProblemHeader = function (currentProblem) {
        var header = '';
        if (currentProblem) {
            if (currentProblem.COLPROBLEMAD !== '') {
                header = currentProblem.COLPROBLEMAD;
            }
            else {
                header = currentProblem.COLPROBLEMSOURCEST;
            }
        }
        return header;
    };

    /**
    *   Retrieves the details of the current problem
    *   @method getProblemDetail
    *   @params {Object} currentProblem
    *   @return {String} detail - Details of the current problem
    */
    problemsVM.prototype.getProblemDetail = function (currentProblem) {
        var detail = '';
        if (currentProblem && currentProblem.COLPROBLEMSOURCEID !== '') {
            detail = '(' + currentProblem.COLPROBLEMSOURCEID + ')';
        }

        return detail;
    };

    problemsVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.problems = null;
        viewModelReference = null;
    };

    return problemsVM;
});