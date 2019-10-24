define(['moment', 'numeral', 'i18next', 'mpages/logger'], function (moment, numeral, i18n, logger) {
    function isNumber(n) {
        return n && !isNaN(parseFloat(n)) && isFinite(n);
    }

	function isArray(input) {
            return (typeof (input) === 'object' && (input instanceof Array));
        }
		
    return {
        /*
        *   Checks if the string is a valid number
        */
        isNumber: isNumber,
        isArray: isArray,
        isString: function (input) {
            return (typeof (input) === 'string');
        },
        getValueFromArray: function (name, array) {
            if (array != null) {
                for (var x = 0, xi = array.length; x < xi; x++) {
                    if (array[x].name == name) {
                        return (array[x].value);
                    }
                }
            }
            return (null);
        },
        createParamArray: function (ar, type) {
            var returnVal = (type === 1) ? "0.0" : "0";
            if (ar && ar.length > 0) {
                if (ar.length > 1) {
                    if (type === 1) {
                        returnVal = "value(" + ar.join(".0,") + ".0)"
                    }
                    else {
                        returnVal = "value(" + ar.join(",") + ")"
                    }
                }
                else {
                    returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
                }
            }
            return returnVal;
        },
        /*
        *   Retrieves the localized date
        *   @method getLocalizedDate
        *   @param {String} utcDateString - a UTC date
        *   @param {String} file calling this method
        *   @return {String} Localized date
        */
        getLocalizedDate: function (utcDateString, source) {
            var date = moment(utcDateString);
            var locale = CERN_locale;
            if (date.isValid()) {
                if (!locale) {
                    locale = "en-US";
                    logger.log(i18n.t('app:modules.logMessage.MISSING_LOCALE'), CERN_locale,
                    source ? source + ":getLocalizedDate" : "mp_util.js:getLocalizedDate", false);
                }
                return date.lang(locale).format('L HH:mm');
            } else {
                logger.log(i18n.t('app:modules.logMessage.INVALID_DATE'), utcDateString,
                source ? source + ":getLocalizedDate" : "mp_util.js:getLocalizedDate", false);
                return utcDateString;
            }
        },
        getLocalizedValue: function (labValue) {
            if (isNumber(labValue)) {
                return numeral(labValue).format('0[.][00]');
            }
            // In case the entered value is not a number, no need to format it.
            return labValue;
        },
        /**
        * Retrieves a document for viewing via the MPages RTF viewer
        * @param {Object} eventId The parent or child event id for retrieval
        * @param {Object} docViewerType
        * 0: Parent Event Id retrieval of child event blobs
        * 1: Event Id blob retrieval
        * 2: Long text retrieval
        * 3: Micro Detail retrieval
        * 4: Anatomic Pathology retrieval
        */
        LaunchClinNoteViewer: function (patient_id, encntr_id, event_id, docViewerType, pevent_id) {
            var x = 0;
            var m_dPersonId = parseFloat(patient_id);
            var m_dEncntrId = parseFloat(encntr_id);
            var m_dPeventId = parseFloat(pevent_id);
            var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
            logger.log("PVVIEWERMPAGE", "mp_util.js", "LaunchClinNoteViewer", false);
            try {
                switch (docViewerType) {
                    case 'AP':
                        viewerObj.CreateAPViewer();
                        viewerObj.AppendAPEvent(event_id, m_dPeventId);
                        viewerObj.LaunchAPViewer();
                        break;
                    case 'DOC':
                        viewerObj.CreateDocViewer(m_dPersonId);
                        if (isArray(event_id)) {
                            for (var x = event_id.length; x--; ) {
                                viewerObj.AppendDocEvent(event_id[x]);
                            }
                        }
                        else {
                            viewerObj.AppendDocEvent(event_id);
                        }
                        viewerObj.LaunchDocViewer();
                        break;
                    case 'EVENT':
                        viewerObj.CreateEventViewer(m_dPersonId);
                        if (isArray(event_id)) {
                            for (var x = event_id.length; x--; ) {
                                viewerObj.AppendEvent(event_id[x]);
                            }
                        }
                        else {
                            viewerObj.AppendEvent(event_id);
                        }
                        viewerObj.LaunchEventViewer();
                        break;
                    case 'MICRO':
                        viewerObj.CreateMicroViewer(m_dPersonId);
                        if (isArray(event_id)) {
                            for (var x = event_id.length; x--; ) {
                                viewerObj.AppendMicroEvent(event_id[x]);
                            }
                        }
                        else {
                            viewerObj.AppendMicroEvent(event_id);
                        }
                        viewerObj.LaunchMicroViewer();
                        break;
                    case 'GRP':
                        viewerObj.CreateGroupViewer();
                        if (isArray(event_id)) {
                            for (var x = event_id.length; x--; ) {
                                viewerObj.AppendGroupEvent(event_id[x]);
                            }
                        }
                        else {
                            viewerObj.AppendGroupEvent(event_id);
                        }
                        viewerObj.LaunchGroupViewer();
                        break;
                    case 'PROC':
                        viewerObj.CreateProcViewer(m_dPersonId);
                        if (isArray(event_id)) {
                            for (var x = event_id.length; x--; ) {
                                viewerObj.AppendProcEvent(event_id[x]);
                            }
                        }
                        else {
                            viewerObj.AppendProcEvent(event_id);
                        }
                        viewerObj.LaunchProcViewer();
                        break;
                    case 'HLA':
                        viewerObj.CreateAndLaunchHLAViewer(m_dPersonId, event_id);
                        break;
                    case 'NR':
                        viewerObj.LaunchRemindersViewer(event_id);
                        break;
                    case 'STANDARD':
                        logger.log(i18n.t('app:modules.logMessage.PATIENT_INFO_FAILED'), "mp_util.js", null, true);
                        break;
                }
            }
            catch (err) {
                logger.logError(i18n.t('app:modules.worklist.CLINICAL_NOTE_OPEN_FAILED'), err, "mp_util.js", true);
            }

        }
    };

});
