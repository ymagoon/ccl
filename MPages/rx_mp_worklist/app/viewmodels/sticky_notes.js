define(['knockout', 'ko.command', 'plugins/dialog', 'i18next', 'durandal/app', 'moment', 'services/model', 'ko.dirtyFlag', 'mpages/logger', 'jquery', 'services/dataservice', 'durandal/system', 'mpages/mp_util'], function (ko, koCommand, dialog, i18n, app, moment, model, koDirty, logger, $, dataService, system, mp_util) {
    var MESSAGE_BOX_YES = i18n.t('app:modules.stickyNote.MESSAGE_BOX_YES'),
        MESSAGE_BOX_NO = i18n.t('app:modules.stickyNote.MESSAGE_BOX_NO'),
        MESSAGE_BOX_CANCEL = i18n.t('app:modules.stickyNote.MESSAGE_BOX_CANCEL'),
        MESSAGE_BOX_TITLE = i18n.t('app:modules.stickyNote.MESSAGE_BOX_TITLE'),
        MESSAGE_BOX_CONTENT = i18n.t('app:modules.stickyNote.MESSAGE_BOX_CONTENT'),
        DELETE_NOTE_TITLE = i18n.t('app:modules.stickyNote.DELETE_NOTE_TITLE'),
        DELETE_NOTE_CONTENT = i18n.t('app:modules.stickyNote.DELETE_NOTE_CONTENT');

    var vm = function () {
        /*****************************************************************************
        *   Private Variables
        ******************************************************************************/
        var self = this;
        /**
        *   Stores the list of notes
        */
        var noteList = ko.observableArray();

        /**
        *   Stores details such as author, note type etc.
        */
        var noteSettings = {};

        /**
        *   Indicates if the note is the first note.
        */
        var firstNote = true;
        var detached = false;
        var isProcessing = ko.observable(false);
        /******************************************************************************
        *   Observables
        ******************************************************************************/

        var currentNoteNumber = ko.observable(0);
        var totalNoteNumber = ko.observable(0);
        var currentNote = ko.observable();
        var noteText = ko.observable("");
        var currentNoteDate = ko.observable("");
        // Decides if the note is dirty or not
        var dirtyFlag = new koDirty.DirtyFlag(noteText);

        var writtenBy = ko.observable("");
        var newInProgress = ko.observable(false);

        /********************************************************************************
        *    Computed observables
        *
        ********************************************************************************/

        /**
        *   A computed variable that enables or disables the new note icon - Blue plus (+) icon
        */
        var newNoteCssClass = ko.computed(function () {
            if (newInProgress() || isProcessing())
                return "sticky-note-add-disabled";
            else
                return "sticky-note-add-enabled";
        });

        /**
        *   A computed variable that enables or disables the delete note icon - Red X icon
        */
        var deleteNoteCssClass = ko.computed(function () {
            if ((newInProgress() && firstNote) || isProcessing())
                  return "sticky-note-delete-disabled";
            else
                return "sticky-note-delete-enabled";    

        });

        /**
        *   A computed variable that enables or disables the save icon - floppy disk icon
        */
        var saveImgCssClass = ko.computed(function () {

            if (dirtyFlag().isDirty() && !isProcessing())
                return "sticky-note-save-enabled";
            else
                return "sticky-note-save-disabled";
        });

        /**
        *   A computed variable that enables or disables the left arrow icon
        */
        var leftArrowImgCssClass = ko.computed(function () {
            if (currentNoteNumber() <= 1 || isProcessing())
                return "sticky-note-left-arrow-disabled";
            else
                return "sticky-note-left-arrow-enabled";
        });

        /**
        *   A computed variable that enables or disables the right arrow icon
        */
        var rightArrowImgCssClass = ko.computed(function () {
            if (currentNoteNumber() >= totalNoteNumber() || isProcessing())
                return "sticky-note-right-arrow-disabled";
            else
                return "sticky-note-right-arrow-enabled";
        });
        /***************************************************
        *   Manual Subscriptions
        *
        ****************************************************/

        /*
        *   Whenever the current note changes, update the Written By and Note Text.
        *   Also reset the dirty flag to as a new note is set
        */
        var currentNoteSubscription = currentNote.subscribe(function (note) {
            if (note && noteList) {
                writtenBy(note.SNAUTHOR);
                noteText(note.SNTEXT);
                currentNoteDate(mp_util.getLocalizedDate(note.SNDT, system.getModuleId(self)));
                dirtyFlag().reset();
            }
        });

        /*
        *   Whenever the note list changes, i.e a note is added or removed,
        *   update the total note number
        */
        var noteListSubscription = noteList.subscribe(function (updatedList) {
            if (updatedList) {
                totalNoteNumber(updatedList.length);
            }
        });

        var noteTextSubscription = noteText.subscribe(function (newText) {
            if (newText) {
                currentNote().SNTEXT = noteText();
            }
        });

        /*********************************************************************************
        *   Private Methods
        *
        *********************************************************************************/

        /**
        *   A function to handle the result of the message box displayed when the note is
        *   dirty and user tries to close the sticky note window or navigate to another note
        */
        function handleMessageBoxResult(result) {
            switch (result) {
                case MESSAGE_BOX_YES:
                    self.saveNote();
                    break;
                case MESSAGE_BOX_NO:
                    // If it is a new note, the only valid navigation direction is forward.
                    // So set the next note as the current note and remove unsaved note
                    if (currentNote().SNID === 0) {

                        if (noteList().length > currentNoteNumber()) {
                            currentNote(noteList()[currentNoteNumber()]);
                        }
                        noteList.shift();
                        newInProgress(false);
                    }
                    break;
            }
            return result;
        }

        /**
        *   Navigate to the next note only if the user seelcts "Yes" option
        *   @method switchToNextNote
        *   @param {Object} dialogResult
        */
        function switchToNextNote(dialogResult) {
            if (dialogResult != MESSAGE_BOX_CANCEL && currentNoteNumber() < totalNoteNumber() && !isProcessing()) {
                // the note was saved or is not dirty. So move to the next note number
                currentNoteNumber(currentNoteNumber() + 1);
                currentNote(noteList()[currentNoteNumber() - 1]);
            }
        }

        /**
        *   Navigate to the previous note only if the user selects "Yes" option
        *   @method switchToNextNote
        *   @param {Object} dialogResult
        */
        function switchToPreviousNote(dialogResult) {
            if (dialogResult != MESSAGE_BOX_CANCEL && currentNoteNumber() > 1 && !isProcessing()) {
                currentNoteNumber(currentNoteNumber() - 1);
                currentNote(noteList()[currentNoteNumber() - 1]);
            }

        }

        /**
        *   Dispose all subscriptions and computed observables
        *   @method dispose
        */
        function dispose() {
            if (newNoteCssClass)
                newNoteCssClass.dispose();

            if (deleteNoteCssClass)
                deleteNoteCssClass.dispose();

            if (saveImgCssClass)
                saveImgCssClass.dispose();

            if (leftArrowImgCssClass)
                leftArrowImgCssClass.dispose();

            if (rightArrowImgCssClass)
                rightArrowImgCssClass.dispose();

            if (currentNoteSubscription)
                currentNoteSubscription.dispose();

            if (noteListSubscription)
                noteListSubscription.dispose();

            if (noteTextSubscription)
                noteTextSubscription.dispose();

            self.title.dispose();

            dirtyFlag = null;
            currentNoteNumber = null;
            totalNoteNumber = null;
            currentNote = null;
            noteText = null;
            currentNoteDate = null;
            writtenBy = null;
            newInProgress = null;

            detached = true;
        }

        /*********************************************************************************
        *   Exposed variables
        *********************************************************************************/
        /**
        *   The title of the modal window
        */
        self.title = ko.computed(function () {
            if (newInProgress() === true) {
                return i18n.t('app:modules.stickyNote.NOTE_ENTRY');
            } else {
                return i18n.t('app:modules.stickyNote.NOTE_VIEW');
            }
        });

        /**
        *   The function used to create a new note
        */
        self.createNewNote = function () {
            if (newInProgress() === false && !isProcessing()) {
                var creationDate = moment.utc().format();
                currentNote({
                    SNID: 0,
                    SNTEXT: "",
                    SNDT: creationDate,
                    SNAUTHOR: noteSettings.SNAUTHOR,
                    SNTYPECV: noteSettings.SNCODEVALUE,
                    SNTYPEMEAN: "RX_WL"
                });
                noteList.unshift(currentNote());
                currentNoteNumber(1);
                newInProgress(true);
            }
        };

        /**
        *   Durandal calls this function when the view model is loaded
        *   @method activate
        *   @param {Object} data - data related to the sticky notes for a patient
        */
        self.activate = function (data) {
            if (data) {
                noteList(data.SNQUAL);

                // store all the settings
                for (var property in data) {
                    if (property != "SNQUAL")
                        noteSettings[property] = data[property];
                }

                // always show the latest note as the first note
                // Note : The script always sorts the notes in descending order based on date
                currentNoteNumber(1);

                if (noteSettings.SNCNT > 0) {
                    currentNote(noteList()[0]);
                    firstNote = false;
                } else {
                    firstNote = true;
                    self.createNewNote();
                }
            }
        };

        /**
        *   The current note number
        */
        self.currentNoteNumber = currentNoteNumber;

        /**
        *   Total number of notes for the patient
        */
        self.totalNoteNumber = totalNoteNumber;

        /**
        *   The image displayed for new note button
        */
        self.newNoteCssClass = newNoteCssClass;

        /**
        *   The image displayed for delete note button
        */
        self.deleteNoteCssClass = deleteNoteCssClass;

        /**
        *   The image displayed for save button
        */
        self.saveImgCssClass = saveImgCssClass;

        /**
        *   The image displayed for left arrow used to navigate to previous note
        */
        self.leftArrowImgCssClass = leftArrowImgCssClass;

        /**
        *   The image displayed for the right arrow
        */
        self.rightArrowImgCssClass = rightArrowImgCssClass;

        /**
        *   The text of a sticky note
        */
        self.noteText = noteText;

        /**
        *   The author of the sticky note
        */
        self.writtenBy = writtenBy;

        /**
        *   When the note was changed
        */
        self.currentNoteDate = currentNoteDate;


        self.isProcessing = isProcessing;

        /**
        *   The operation executed when delete button is clicked
        */
        self.deleteNote = function () {
            if (!firstNote && !isProcessing()) {

                app.showMessage(DELETE_NOTE_CONTENT, DELETE_NOTE_TITLE, [MESSAGE_BOX_YES, MESSAGE_BOX_NO]).then(function (dialogResult) {
                    if (dialogResult == MESSAGE_BOX_YES) {
                        var noteToDelete = currentNote();
                        var toast = logger.stickyToast(i18n.t('app:modules.stickyNote.DELETING_NOTE'), noteToDelete, system.getModuleId(self), true, 'info');
                        var deletedNoteNumber = currentNoteNumber();
                        var totalNumberOfNotes = totalNoteNumber();
                        dataService.deleteStickyNote(noteToDelete, noteSettings.PERSONID)
                        .done(function (reply) {
                            noteList.remove(noteToDelete);
                            isProcessing(false);
                            noteList().trigger('notes-updated');
                            if (!detached) {
                                if (noteList().length > 0) {
                                    if (deletedNoteNumber >= totalNumberOfNotes) {
                                        currentNote(noteList()[deletedNoteNumber - 2]);
                                        currentNoteNumber(deletedNoteNumber - 1);
                                    } else {
                                        currentNote(noteList()[currentNoteNumber() - 1]);
                                    }
                                } else {
                                    firstNote = true;
                                    self.createNewNote();
                                }
                            }
                            logger.logSuccess(i18n.t('app:modules.stickyNote.NOTE_DELETED'), reply, system.getModuleId(self), true);

                        })
                        .fail(function (response) {
                            logger.logError(i18n.t('app:modules.stickyNote.NOTE_DELETE_FAILED'), response, system.getModuleId(self), true);
                            isProcessing(false);
                        })
                        .always(function () {
                            if (toast)
                                logger.clearToast(toast);
                        });

                        isProcessing(true);
                    }
                });
            }
        };

        /**
        *   The operation executed when save note button is clicked
        */
        self.saveNote = function () {
            if (dirtyFlag().isDirty() && !isProcessing()) {
                var noteNumber = currentNoteNumber();
                var noteContent = noteText();
                var toast = logger.stickyToast(i18n.t('app:modules.stickyNote.SAVING_NOTE'), currentNote(), system.getModuleId(self), true, 'info');
                dataService.saveStickyNote(currentNote(), noteSettings.PERSONID)
                .done(function (reply) {
                    var updateDate = moment.utc().format();

                    noteList()[noteNumber - 1].SNID = reply.STICKY_NOTE_ID;
                    noteList()[noteNumber - 1].SNDT = updateDate;
                    noteList()[noteNumber - 1].SNTEXT = noteContent;

                    if (!detached) {
                        newInProgress(false);
                        firstNote = false;
                        dirtyFlag().reset();
                    }
                    noteList().trigger('notes-updated');
                    logger.logSuccess(i18n.t('app:modules.stickyNote.NOTE_SAVED'), reply, system.getModuleId(self), true);
                })
                .fail(function (response) {
                    logger.logError(i18n.t('app:modules.stickyNote.NOTE_SAVE_FAILED'), response, system.getModuleId(self), true);
                })
                .always(function () {
                    if (!detached)
                        isProcessing(false);
                    if (toast)
                        logger.clearToast(toast);
                });

                isProcessing(true);
            }
        };

        /**
        *   The operation executed when Next Note button is clicked
        */
        self.showNextNote = function () {
            if (totalNoteNumber() != 1 && dirtyFlag().isDirty() && !isProcessing()) {
                app.showMessage(MESSAGE_BOX_CONTENT, MESSAGE_BOX_TITLE, [MESSAGE_BOX_YES, MESSAGE_BOX_NO, MESSAGE_BOX_CANCEL])
                .then(handleMessageBoxResult)
                .then(switchToNextNote);
            } else {
                switchToNextNote();
            }

        };

        /**
        *   The operation executed when Previous Note button is clicked
        */
        self.showPreviousNote = function () {
            if (totalNoteNumber() != 1 && dirtyFlag().isDirty() && !isProcessing()) {
                app.showMessage(MESSAGE_BOX_CONTENT, MESSAGE_BOX_TITLE, [MESSAGE_BOX_YES, MESSAGE_BOX_NO, MESSAGE_BOX_CANCEL])
                .then(handleMessageBoxResult)
                .then(switchToPreviousNote);
            } else {
                switchToPreviousNote();
            }
        };

        /**
        *   Event handler for the close button
        */
        self.close = function () {
            // this automatically initiates the durnadal lifecycle events
            dialog.close(self, isProcessing());
        };

        /**
        *   A durandal lifecycle function that is called before the
        *   sticky note window is closed. Only if this function returns/resolves
        *   to 'true' the window can be closed.
        */
        self.canDeactivate = function () {
            var deferred = $.Deferred();
            // if the user has performed a save/delete operation on a note, he is started processing
            // and can close the window if required. Otherwise processing is not being done and if
            // there is a modifcation to the note, the user must be prompted if we wants to save.
            if (!isProcessing() && dirtyFlag().isDirty()) {
                app.showMessage(MESSAGE_BOX_CONTENT, MESSAGE_BOX_TITLE, [MESSAGE_BOX_YES, MESSAGE_BOX_NO, MESSAGE_BOX_CANCEL])
                .then(handleMessageBoxResult)
                .then(function (dialogResult) {
                    deferred.resolve(dialogResult && dialogResult != MESSAGE_BOX_CANCEL);
                });
            } else {
                deferred.resolve(true);
            }
            return deferred;
        };

        /***
        *   A durandal lifecycle function that is called whenever the 
        *   sticky note window is being closed
        */
        self.deactivate = function () {
            // if dummy note was not saved, remove the dummy note
            // Note : Dummy note is always added to the start of the list
            if (noteList().length > 0 && noteList()[0].SNID === 0 && !isProcessing()) {
                noteList.remove(currentNote());
            }
            dispose();
        };

        /**
        *   Validates the sticky note text as it is entered. If
        *   the characters present in 'strChars' are entered, it is
        *   considered as invalid note text.
        */
        self.validateString = function (p, data) {
            var character = null;
            var keyCode = null;
            if (data.charCode && data.charCode > 0) keyCode = data.charCode;
            else if (data.which) keyCode = data.which;
            else if (data.keyCode) keyCode = data.keyCode;

            if (keyCode) {
                character = String.fromCharCode(keyCode);
            }
            var strChars = "@#$%^&*()+=[]\\\';{}|\"<>~_";
            if (character) {
                if (strChars.indexOf(character) === -1) {
                    return true;
                }
            }
            return false;
        };

        // close button:
        self.buttons = [{ text: i18n.t('app:modules.stickyNote.CLOSE_CAPTION'), click: self.close }];

    };

    return vm;
});
