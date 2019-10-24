define(['durandal/system', 'toastr'],
    function (system, toastr) {
        var logger = {
            log: logInfo,
            logSuccess: logSuccess,
            logError: logError,
            stickyToast: logStickyToast,
            clearToast: clearToast
        };

        return logger;

        function logInfo(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'info');
        }

        function logSuccess(message, data, source, showToast) {
            logIt(message, data, source, showToast, 'success');
        }

        function logError(message, data, source, showToast) {
            logStickyToast(message, data, source, showToast, 'error');
        }

        function logStickyToast(message, data, source, showToast, toastType) {
            var oldTimeOut = toastr.options.timeOut;
            var canCloseToast = toastr.options.closeButton;
            toastr.options.timeOut = 0; // make it sticky
            toastr.options.closeButton = true; // Show the close button on the toast
            var toast = logIt(message, data, source, showToast, toastType);
            toastr.options.timeOut = oldTimeOut;
            toastr.options.closeButton = canCloseToast;
            return toast;
        }

        function clearToast(toast) {
            toastr.clear(toast);
        }

        function logIt(message, data, source, showToast, toastType) {
            var toast = null;
            source = source ? '[' + source + '] ' : '';
            if (data) {
                system.log(source, message, data);
            } else {
                system.log(source, message);
            }
            if (showToast) {
                if (toastType === 'error') {
                    toast = toastr.error(message);
                } else if (toastType === 'success') {
                    toast = toastr.success(message);
                } else {
                    toast = toastr.info(message);
                }
            }

            if (log && log.isBlackBirdActive()) {
                if (toastType === 'error') {
                    log.error(message + "<br/>source : ", source, "<br/>data : ", JSON.stringify(data));
                } else if (toastType === 'success') {
                    log.debug(message + "<br/>source : ", source, "<br/>data : ", JSON.stringify(data));
                } else {
                    log.info(message + "<br/>source : ", source, "<br/>data : ", JSON.stringify(data));
                }
            }

            return toast;
        }
    });