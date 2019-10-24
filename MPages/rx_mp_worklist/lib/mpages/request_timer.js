define(['mpages/logger'], function (logger) {

    function createTimer(timerName, subTimerName, metaData1, metaData2, metaData3) {
        try {
            var slaTimer = window.external.DiscernObjectFactory("SLATIMER");
        }
        catch (err) {
            return null;
        }

        if (slaTimer) {
            slaTimer.TimerName = timerName;
            if (subTimerName)
                slaTimer.SubtimerName = subTimerName;
            if (metaData1)
                slaTimer.Metadata1 = String(metaData1);
            if (metaData2)
                slaTimer.Metadata2 = String(metaData2);
            if (metaData3)
                slaTimer.Metadata3 = String(metaData3);

            slaTimer.Start();
            return slaTimer;
        }
        else {
            return null;
        }
    }

    /**
    * A RequestTimer object to wrap the slatimer logic.
    * @return {RequestTimer} returns self.
    * @constructor
    * @author Will Reynolds
    */
    function RequestTimer() {
        this.timerName = null;
        this.subTimerName = null;
        this.metaData1 = null;
        this.metaData2 = null;
        this.metaData3 = null;
        this.slaTimer = null;
        return this;
    }

    /**
    * Set the primary name of the timer.
    * @param timerName the name of the timer.
    * @return {RequestTimer} returns self.
    */
    RequestTimer.prototype.setTimerName = function (timerName) {
        this.timerName = timerName;
        return this;
    };

    /**
    * Set the sub name of the timer.
    * @param subTimerName the timer sub-name.
    * @return {RequestTimer} returns self.
    */
    RequestTimer.prototype.setSubTimerName = function (subTimerName) {
        this.subTimerName = subTimerName;
        return this;
    };

    /**
    * Sets the first metadata for the timer.
    * @param metaData1 the first metadata for the timer.
    * @return {RequestTimer} returns self.
    */
    RequestTimer.prototype.setMetaData1 = function (metaData1) {
        this.metaData1 = metaData1;
        return this;
    };

    /**
    * Sets the second metadata for the timer.
    * @param metaData2 the second metadata for the timer.
    * @return {RequestTimer} returns self.
    */
    RequestTimer.prototype.setMetaData2 = function (metaData2) {
        this.metaData2 = metaData2;
        return this;
    };

    /**
    * Sets the third metadata for the timer.
    * @param metaData3 the third metadata for the timer.
    * @return {RequestTimer} returns self.
    */
    RequestTimer.prototype.setMetaData3 = function (metaData3) {
        this.metaData3 = metaData3;
        return this;
    };

    /**
    * Starts the timer running. This calls the MP_Util method to create the timer object, which also
    * starts the timer.
    */
    RequestTimer.prototype.start = function () {
        this.slaTimer = createTimer(this.timerName, this.subTimerName, this.metaData1, this.metaData2, this.metaData3);
        logger.log(["Start timer at ", new Date(), "Timer Name: ", this.timerName, "<br />Subtime Name:  ", this.subTimerName, "<br />Timer Type: SLATIMER", "<br />"].join(""),
        this, "request_timer.js", false);
    };

    /**
    * Attempts to stop the slatimer (if it exists), otherwise it will simply return.
    */
    RequestTimer.prototype.stop = function () {
        if (!this.slaTimer) {
            return;
        }

        this.slaTimer.Stop();
        logger.log(["Stop timer at ", new Date(), "Timer Name: ", this.timerName, "<br />Subtime Name:  ", this.subTimerName, "<br />Timer Type: SLATIMER", "<br />"].join(""),
        this, "request_timer.js", false);
    };

    /**
    * Attempts to abort the slatimer (if it exists), otherwise it will simply return.
    */
    RequestTimer.prototype.abort = function () {
        if (!this.slaTimer) {
            return;
        }

        this.slaTimer.Abort();
        this.slaTimer = null;
        logger.log(["Abort timer at ", new Date(), "Timer Name: ", this.timerName, "<br />Subtime Name:  ", this.subTimerName, "<br />Timer Type: SLATIMER", "<br />"].join(""),
        this, "request_timer.js", false);
    };


    return RequestTimer;
});