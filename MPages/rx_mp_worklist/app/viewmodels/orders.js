define(['knockout', 'durandal/system', 'i18next', 'mpages/logger'], function (ko, system, i18n, logger) {
    var ordersVM = function () {
        /*
        *   Observable array of available orders for the patient
        */
        this.availableOrders = ko.observableArray([]);
    };

    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the orders for the patient.
    *   @method activate
    *   @params {Object} patientDetails - patient data passed in via the view
    */
    ordersVM.prototype.activate = function (patientDetails) {
        if (patientDetails)
            this.availableOrders(patientDetails.COLORDQUAL);
    };

    /*
    *   Retrieves the order details for the current order
    *   @method getOrderDetail
    *   @param {Object} currentOrder
    *   @return {String} order details of current order
    */
    ordersVM.prototype.getOrderDetail = function (currentOrder) {
        try {
            if (currentOrder) {
                return currentOrder.COLORDEVENTDISP + ": " + currentOrder.COLORDSIMPCLINDISP;
            }
        } catch (error) {
            logger.log(i18n.t('app:modules.logMessage.ORDER_DETAIL_FAILED'), currentOrder, system.getModuleId(this) + ' - getOrderDetail', false);
        }
        return "";
    };

    ordersVM.prototype.detached = function (node, parentNode, viewModelReference) {
        this.availableOrders = null;
        viewModelReference = null;
    };

    return ordersVM;
});