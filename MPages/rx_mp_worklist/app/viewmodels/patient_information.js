define(['durandal/app', 'durandal/system', 'knockout', 'i18next', 'jquery', 'mpages/logger', 'mpages/mp_util', 'moment', 'durandal/events'], function (app, system, ko, i18n, $, logger, mp_util, moment, Events) {

    var patientInformationVM = function () {
        this.notesUpdatedSubscription = null;
        /*
        *   Stores the details of the patient passed in via the Worklist
        */
        this.patientDetails = null;

        /*
        *   An observable to store the patient name
        */
        this.patientName = null;

        /*
        *   An observable to store the patient age
        */
        this.patientAge = null;

        /*
        *   An observable to store the patient gender
        */
        this.patientGender = null;

        /*
        *   An observable to store the patient date of birth
        */
        this.patientDOB = null;

        /*
        *   An observable to store if sticky notes are active or not. 
        *   Only if sticky notes are active (Set in bedrock) will it be shown
        */
        this.isStickyNotesActive = false;

        /*
        *   An observable to store if sticky notes are present
        */
        this.isStickyNotePresent = ko.observable(false);

        /*
        *   An observable to store PCP
        */
        this.PCP = null;

        /*
        *   An observable to store the attending physician
        */
        this.attendingPhysician = null;

        /*
        *   An observable to store the admitting physician details
        */
        this.admittingPhysician = null;

        /*
        *   An observable to store the nurse unit
        */
        this.nurseUnit = null;

        /*
        *   An observable to store the room
        */
        this.room = null;

        /*
        *   An observable to store the bed
        */
        this.bed = null;

        /*
        *   An observable to store the admit date
        */
        this.admitDate = null;

        /*
        *   An observable to store the MRN /FIN text
        */
        this.MRNFINText = null;

        /*
        *   An observable to store the MRN FIN value
        */
        this.MRNFINValue = null;

        /*
        *   An observable to store LOS
        */
        this.LOS = null;

        /*
        *   An observable to store the LOS suffix
        */
        this.LOSSuffix = null;

        /*
        *   An observable to store the latest sticky note text
        */
        this.latestStickyNote = ko.observable();

        /*
        *   A computed observable to retrieve the sticky note image
        *   depending on if a note is present or not
        */
        this.imageCss = ko.computed(function () {
            try {
                if (this.isStickyNotePresent())
                    return "sticky-note-modify-icon";
                else
                    return "sticky-note-add-icon";
            } catch (error) {
                logger.log(i18n.t('app:modules.logMessage.IMAGE_PATH_FAILED'), require.toUrl(''), system.getModuleId(this) + ' - imageCss', false);
            }

            return '';
        }, this);

        this.patientDetailsSubscription = null;

        /*
        *   An observable to indicate if the worklist row is selected or not
        */
        this.isSelected = ko.observable(false);


        /*
        *   Subscribes to changes to the isSelected observable. This is bound 
        *   to the checkbox. Whenever checkbox state changes, the patient details
        *   model also changes
        */
        this.isSelectedSubscription = this.isSelected.subscribe(function (newValue) {
            if (this.patientDetails) {
                this.patientDetails.isSelected(newValue);
            }
        }, this);

        /*
        *   This exposes the tooltip for the patient name. Clicking this opens
        *   the powerchart tab
        */
        this.linkCaption = i18n.t('app:modules.patientInformation.LINK_CLICK_CAPTION');


        /*
        *   Exposes the tooltip of sticky note
        */
        this.stickyNoteCaption = i18n.t('app:modules.patientInformation.STICKY_NOTE_ICON_TOOLTIP');
    };


    /*
    *   Activate function that is invoked by Durandal when this View Model is loaded.
    *   It initializes the patient information for the patient.
    *   @method activate
    *   @params {Object} patientData - patient data passed in via the view
    */
    patientInformationVM.prototype.activate = function (patientData) {
        var deferred = $.Deferred();
        try {
            if (patientData) {
                this.patientDetails = patientData;

                this.patientDetailsSubscription = this.patientDetails.isSelected.subscribe(function (newValue) {
                    if (this.isSelected() != newValue) {
                        this.isSelected(newValue);
                    }
                }, this);

                var patientInformation = patientData.HRCColumns[0];

                this.patientName = patientInformation.PATNAME;
                this.patientAge = patientInformation.PATAGE;
                this.patientGender = patientInformation.PATGENDER;
                this.patientDOB = mp_util.getLocalizedDate(patientInformation.PATDOB, system.getModuleId(this));
                this.isStickyNotesActive = (patientInformation.SNACTIVE == 1);
                this.isStickyNotePresent(patientInformation.SNCNT > 0);
                this.PCP = patientInformation.PCP;
                this.attendingPhysician = patientInformation.ATTENDPHYS;
                this.admittingPhysician = patientInformation.ADMITPHYS;
                this.nurseUnit = patientInformation.NURSEUNIT;
                this.room = patientInformation.ROOM;
                this.bed = patientInformation.BED;
                this.admitDate = mp_util.getLocalizedDate(patientInformation.ADMITDT, system.getModuleId(this));
                this.MRNFINText = patientInformation.MRNFINTEXT;
                this.MRNFINValue = patientInformation.MRNFINVALUE;
                this.LOS = patientInformation.LOS;
                this.isSelected(this.patientDetails.isSelected());

                if (this.isStickyNotePresent())
                    this.latestStickyNote(patientInformation.SNQUAL[0].SNTEXT);

                if (patientInformation.LOS === 0 || patientInformation.LOS === 1) {
                    this.LOSSuffix = (i18n.t('app:modules.patientInformation.DAY_CAPTION'));
                } else {
                    this.LOSSuffix = (i18n.t('app:modules.patientInformation.DAYS_CAPTION'));
                }

                deferred.resolve();
            }
        } catch (error) {
            logger.logError(i18n.t('app:modules.logMessage.PATIENT_INFO_FAILED'), patientData, system.getModuleId(this) + ' - activate', false);
            deferred.reject();
        }

        return deferred;
    };



    /*
    *   Exposes the function to launch sticky notes
    */
    patientInformationVM.prototype.launchStickyNotes = function () {

        // if object level events are not registered, register then
        if (!this.patientDetails.HRCColumns[0].SNQUAL.on) {
            Events.includeIn(this.patientDetails.HRCColumns[0].SNQUAL);

            this.notesUpdatedSubscription = this.patientDetails.HRCColumns[0].SNQUAL.on('notes-updated').then(function () {
                try {
                    this.patientDetails.HRCColumns[0].SNQUAL.sort(sortByDateDesc);
                    var notesCount = this.patientDetails.HRCColumns[0].SNQUAL.length;
                    this.patientDetails.HRCColumns[0].SNCNT = notesCount;

                    if (notesCount > 0) {
                        this.latestStickyNote(this.patientDetails.HRCColumns[0].SNQUAL[0].SNTEXT);
                        this.isStickyNotePresent(true);
                    } else {
                        this.isStickyNotePresent(false);
                        this.latestStickyNote(undefined);
                    }
                } catch (error) {
                    logger.logError(i18n.t('app:modules.logMessage.UPDATE_INFORMATION_FAILED'), null, system.getModuleId(this) + ' - launchStickyNotes', true);
                }
            }, this);
        }
        app.showDialog("viewmodels/sticky_notes", this.patientDetails.HRCColumns[0], 'custom')
            .fail(function (error) {
                logger.logError(i18n.t('app:modules.logMessage.STICKY_NOTES_FAILED'), null, system.getModuleId(this) + ' - launchStickyNotes', true);
            });
    };


    /*
    *   This function launches the tab when patient name is clicked
    */
    patientInformationVM.prototype.launchTab = function () {
        try {
            if (this.patientDetails && typeof APPLINK !== "undefined") {
                APPLINK(100, "powerchart.exe", "/PERSONID=" + this.patientDetails.HRCColumns[0].PERSONID + " /ENCNTRID=" + this.patientDetails.HRCColumns[0].ENCNTRID + " /FIRSTTAB=^" + this.patientDetails.HRCColumns[0].TABNAME + "^");
            } else {
                logger.logError(i18n.t('app:modules.worklist.TAB_OPEN_FAILED'), this.patientDetails, "patient_information.js", true);
            }
        } catch (error) {
            logger.logError(i18n.t('app:modules.worklist.TAB_OPEN_FAILED'), this.patientDetails, "patient_information.js", true);
        }
    };

    /*
    *   This function handles the expand collapse of the patient information
    */
    patientInformationVM.prototype.expandCollapse = function (data, event) {
        try {
            var $span = $(event.target || event.srcElement);
            var $panel = $span.parent().next();

            $panel.slideToggle(100, function () {
                //execute this after slideToggle is done
                //change text of header based on visibility of content div
                $span.text(function () {
                    //change text based on condition
                    return $panel.is(":visible") ? "[-]" : "[+]";
                });

                $span = null;
                $panel = null;
            });


        } catch (error) {
            logger.logError(i18n.t('app:modules.logMessage.PATIENT_INFO_FAILED'), patientDetails, "patient_information.js", true);
        }
    };



    patientInformationVM.prototype.detached = function (node, parentNode, viewModelReference) {
        if (this.isSelectedSubscription) {
            this.isSelectedSubscription.dispose();
            this.isSelectedSubscription = null;
        }

        if (this.patientDetailsSubscription) {
            this.patientDetailsSubscription.dispose();
            this.patientDetailsSubscription = null;
        }

        if (this.notesUpdatedSubscription) {
            this.notesUpdatedSubscription.off();
            this.notesUpdatedSubscription = null;
        }

        if (this.imagePath) {
            this.imagePath.dispose();
            this.imagePath = null;
        }

        this.patientDetails = null;

        this.isSelected(null);
        
        this.patientName = this.patientAge = this.patientGender = this.patientDOB = null;

        this.isStickyNotesActive = false;

        this.isStickyNotePresent(null);

        this.PCP = this.attendingPhysician = this.admittingPhysician = this.nurseUnit = null;
        this.room = this.bed = this.admitDate = this.MRNFINText = this.MRNFINValue = null;
        this.LOS = this.LOSSuffix = this.latestStickyNote = null;

        viewModelReference = null;
    };

    /*
    *   A function to sort the update date-time of the 
    *   sticky notes in descending order
    */
    sortByDateDesc = function (lhs, rhs) {
        var lhsDate = moment(lhs.SNDT);
        var rhsDate = moment(rhs.SNDT);
        return lhsDate < rhsDate ? 1 : lhsDate > rhsDate ? -1 : 0;
    };

    return patientInformationVM;
});