define(['knockout', 'plugins/dialog', 'i18next'], function (ko, dialog, i18n) {
    var vm = function () {
        var self = this;

        /*
        *   Private observable to store the current facility being viewed
        */
        var currentFacility = ko.observable();

        /*
        *   A computed observable that puts three nurse units in each row
        */
        var rows = ko.computed(function () {
            var result = [],
                row,
                columnLength = 3;
            if (currentFacility()) {
                //loop through items and push each item to a row array that gets pushed to the final result
                for (var i = 0; i < currentFacility().LOCNT; i++) {
                    if (i % columnLength === 0) {
                        if (row) {
                            result.push(row);
                        }
                        row = [];
                    }
                    row.push(currentFacility().LOCQUAL[i]);
                }

                //push the final row  
                if (row) {
                    result.push(row);
                }
            }
            return result;
        });

        /*
        *   Reset the dirty nurse units, i.e. nurse units that have been modified compared to their
        *   initial state during load
        */
        function resetDirtyItems() {
            if (currentFacility()) {
                ko.utils.arrayForEach(currentFacility().LOCQUAL, function (nurseUnit) {

                    if (nurseUnit.dirtyFlag().isDirty()) {
                        nurseUnit.isSelected(!nurseUnit.isSelected()); // invert the selection as it is dirty and user is cancelling

                        nurseUnit.dirtyFlag().reset();

                    }
                });
            }
        }


        /*
        *   Activate function that is invoked by Durandal when this View Model is loaded.
        *   It initializes the nurse units for the facility.
        *   @method activate
        *   @params {Object} facility - the current facility
        */
        self.activate = function (facility) {
            if (facility)
                currentFacility(facility);
        };

        /*
        *   The rows of nurse units to be rendered
        */
        self.rows = rows;

        /*
        *   The click event handler for the Submit button
        */
        self.submit = function () {
            var selectedNurseUnits = [];
            if (currentFacility()) {
                ko.utils.arrayForEach(currentFacility().LOCQUAL, function (nurseUnit) {

                    if (nurseUnit.isSelected()) {
                        selectedNurseUnits.push(nurseUnit);
                    }

                    if (nurseUnit.dirtyFlag().isDirty()) {
                        nurseUnit.dirtyFlag().reset();
                    }

                });
            }
            dialog.close(self, selectedNurseUnits);
        };

        /*
        *   The click event handler for Cancel button
        */
        self.cancel = function () {
            resetDirtyItems();
            dialog.close(self);

        };

        /*
        *   Deactivate is a durandal life cycle function that is called before the viewmodel is unloaded and removed from DOM
        */
        self.deactivate = resetDirtyItems;

        /*
        *   the modal displays the title from this property
        */
        self.title = i18n.t('app:modules.patientPopulation.NURSE_UNIT_LABEL');

        /*
        *   the modal displays the buttons from this property
        */
        self.buttons = [{ text: i18n.t('app:modules.myPopulation.OK_CAPTION'), click: this.submit },
        { text: i18n.t('app:modules.patientPopulation.CANCEL_CAPTION'), click: this.cancel}];

        self.detached = function (node, parentNode, viewModelReference) {
            rows.dispose();
            rows = null;
            currentFacility = null;
            viewModelReference = null;
        };

    };

    return vm;
});