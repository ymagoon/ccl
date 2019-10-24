/**
 * Populates and initializes the um assignment worklist.
 *
 * @author Eric Amavizca (ea026644)
 */
$(function() {
    $.views.helpers({
        formatDate: function(dateString) {
            if (dateString) {
                return moment(dateString).format("MM/DD/YY");
            }
        }
    });
    umaw.init();
});

var umaw = {

    selectedPatientList: null,
    providerSearchControl: null,
    worklistData: null,
    canAdd: false,
    canDelete: false,
    resizeTimer: null,
    hadPatientList: false,

    init: function() {
        umaw.loadi18nValues();
        if (umaw.loadPatientLists()) {
            umaw.disableListSelectionAndFilter(false);
            RCM_UMAW_Filters.setDefaultData();
            umaw.loadWorklist();
            umaw.setupEvents();

            if (umaw.worklistData) {
                RCM_UMAW_Filters.loadi18nValues();
                RCM_UMAW_Filters.loadFilterBox();
                RCM_UMAW_Filters.setupEvents();
                umaw.checkSecurity();
                umaw.populateAssignmentDropdown();
                umaw.initProviderSearch();
                umaw.setupHovers();
                umaw.manageHeader();
            }
            umaw.hadPatientList = true;
        } else {
            umaw.disableListSelectionAndFilter(true);
        }
    },

    reloadPatientList: function() {
        umaw.removeWorklist();
        umaw.clearAssignmentDropdown();
        RCM_UMAW_Filters.setDefaultData();
        umaw.loadWorklist();

        if (umaw.worklistData) {
            RCM_UMAW_Filters.loadFilterBox();
            umaw.checkSecurity();
            umaw.populateAssignmentDropdown();
            umaw.setupHovers();
            umaw.manageHeader();
        }
    },

    setupHovers: function() {
        $(".hoverable").each(function() {
            hs(this, $(this).siblings(".hover-div").get(0));
        });
    },

    setupEvents: function() {
        $("#filterBtn").click(function() {
            RCM_UMAW_Filters.toggleFilters();
        });

        $("#currentAssignmentSelect").change(function() {
            var selectedVal = $(this).val();
            if (selectedVal === "CURRENT_SELECTION" || selectedVal === "") {
                return;
            } else if (selectedVal === "ALL") {
                $(".care-manager-div").addClass("care-manager-selected-div");
            } else if (selectedVal === "UNASSIGNED") {
                $(".care-manager-selected-div").removeClass("care-manager-selected-div");
                $(".care-manager-unassigned").addClass("care-manager-selected-div");
            } else if (selectedVal === "CLEAR") {
                $(".care-manager-selected-div").removeClass("care-manager-selected-div");
                $(this).val("");
            } else {
                $(".care-manager-selected-div").removeClass("care-manager-selected-div");
                $(".assigned-" + selectedVal).addClass("care-manager-selected-div");
            }
            umaw.updatePatientCountforAssignButton();
        });

        $("#patientListDropdown").change(function() {
            umaw.selectedPatientList = $("option:selected", this).data("item");
            umaw.reloadPatientList();
        });

        $("#worklistTable > tbody").on("click", ".care-manager-div", function() {
            var index = $(this).closest("tr").prop("id").split("row-")[1];
            $(this).toggleClass("care-manager-selected-div");
            if ($(".care-manager-selected-div").length) {
                $("#currentAssignmentSelect").val("CURRENT_SELECTION");
            } else {
                $("#currentAssignmentSelect").val("");
            }
            umaw.updatePatientCountforAssignButton();
        });

        $("#worklistTableContainer").scroll(function() {
            umaw.closeSplitButtonDropdown();
        });

        $(window).resize(function() {
            umaw.manageHeader();
        });

        $(document).keyup(function(e) {
            if (e.keyCode === 27) {
                if ($("#filterBox").is(":visible")) {
                    RCM_UMAW_Filters.cancelFilters();
                }
            }
        });
    },

    loadPatientLists: function() {
        var patientLists = UMAssignmentWorklistDelegate.getPatientLists();
        if (patientLists && patientLists.length > 0) {
            $("#noPatientListMsgDiv").hide();
            umaw.selectedPatientList = umaw.getDefaultPatientList(patientLists);
            $.each(patientLists, function(i, item) {
                $("#patientListDropdown").append($("<option>", {
                    value: item.patientList.id,
                    text: item.patientList.name
                }).data("item", item));
            });
            $("#patientListDropdown").val(umaw.selectedPatientList.patientList.id);
            return true;
        }

        if (patientLists) {
            $("#noPatientListMsgDiv").show();
            return false;
        }

        $("#noPatientListMsgDiv").hide();
        umaw.setTableMessage(i18n.UMAW_GET_PATIENT_LISTS_ERROR, true);
        return false;
    },

    setTableMessage: function(message, isError) {
        $("#worklistTable > tbody").empty();
        var $tr = $("<tr><td class='table-message' colspan='6'>" + message + "</td></tr>");
        if (isError) {
            $tr.addClass("red");
        }
        $("#worklistTable > tbody").append($tr);
    },

    loadWorklist: function() {
        if(umaw.selectedPatientList) {
            document.cookie = "rcm_umaw_pl=" + umaw.selectedPatientList.patientList.id;
        }
        umaw.worklistData = UMAssignmentWorklistDelegate.getWorklist();
        if (umaw.worklistData) {
            umaw.canAdd = umaw.worklistData.canAssignRelationshipIndicator || false;
            umaw.canDelete = umaw.worklistData.canUnassignRelationshipIndicator || false;
            if (!umaw.worklistData.bedRockCareManagerSet) {
                umaw.setTableMessage(i18n.UMAW_BUILD_ERROR_MESSAGE, true);
            } else if (umaw.worklistData.workListItems) {
                var itemLength = umaw.worklistData.workListItems.length;
                $("#patientCountLabel").text(i18n.UMAW_PATIENT_COUNT + itemLength);
                if (itemLength > 0) {
                    $("#worklistTable > tbody").append($("#mainRowTmpl").render(umaw.worklistData.workListItems, {
                        i18n: i18n
                    }));
                } else {
                    umaw.setTableMessage(i18n.UMAW_NO_ENCOUNTERS, false);
                }
            } else {
                $("#patientCountLabel").text(i18n.UMAW_PATIENT_COUNT + "0");
                umaw.setTableMessage(i18n.UMAW_NO_PATIENT_LISTS_DATA, false);
            }
        }
        $("#worklistTableContainer").scrollTop(0);
    },

    removeWorklist: function() {
        umaw.worklistData = null;
        $("#worklistTable > tbody").empty();
    },

    openPatient: function(personId, encounterId) {
        VIEWLINK(0, "Powerchart.exe", personId, encounterId, umaw.worklistData.patientNameLink,
            umaw.worklistData.patientNameViewLink, umaw.worklistData.patientNameViewpointLink);
    },

    populateAssignmentDropdown: function() {
        if (umaw.worklistData.availablePersonnel) {
            $.each(umaw.worklistData.availablePersonnel, function(i, val) {
                if ($(".assigned-" + val.id).length) {
                    $("#currentAssignmentSelect").append($("<option>", {
                        value: val.id,
                        text: val.name + " (" + $(".assigned-" + val.id).length + ")"
                    }));
                }
            });
        }
        //workaround for select growing right instead of left when float:right
        $("#currentAssignmentSelect").hide().show();
    },

    clearAssignmentDropdown: function() {
        $("#currentAssignmentSelect option").filter(function() {
            return this.value.match(/\d+/);
        }).remove();
    },

    initProviderSearch: function() {
        var personnelText = document.getElementById("personnelInput");
        umaw.providerSearchControl = umaw.providerSearchControl || new ProviderSearchControl(personnelText);
        umaw.providerSearchControl.setSelectedProvider(umaw.worklistData.currentUserId, umaw.worklistData.currentUserName);
        umaw.providerSearchControl.addVerifyStateChangeListener(function() {
            if (umaw.providerSearchControl.isVerified()) {
                if ($(".care-manager-selected-div").length > 0) {
                    $("#assignSplitButton").prop("disabled", false);
                    if (umaw.canAdd && umaw.canDelete) {
                        $("#splitButtonReplaceData").show();
                    }
                }
                $("#personnelInput").removeClass("requiredInput");
            } else {
                if (umaw.canAdd) {
                    $("#assignSplitButton").prop("disabled", true);
                    $("#splitButtonReplaceData").hide();
                    $("#personnelInput").addClass("requiredInput");
                }
            }
        });
    },

    updateAssignedCountForAdd: function(addCareManagerId) {
        if ($("#currentAssignmentSelect option[value='" + addCareManagerId + "']").length) {
            $("#currentAssignmentSelect option[value='" + addCareManagerId + "']").text($("#personnelInput").val() + " (" + $(".assigned-" + addCareManagerId).length + ")");
        } else {
            $("#currentAssignmentSelect").append($("<option>", {
                value: addCareManagerId,
                text: $("#personnelInput").val() + " (" + $(".assigned-" + addCareManagerId).length + ")"
            }));
        }
    },

    updateAssignedCountForRemove: function(removedPerson) {
        if ($(".assigned-" + removedPerson.personnelId).length) {
            $("#currentAssignmentSelect option[value='" + removedPerson.personnelId + "']").text(removedPerson.personnelNameFull + " (" + $(".assigned-" + removedPerson.personnelId).length + ")");
        } else {
            $("#currentAssignmentSelect option[value='" + removedPerson.personnelId + "']").remove();
        }
    },

    addAssignments: function() {
        var updateMap = umaw.generateUpdateMap(1);
        var updateCount = 0;
        for (var i in updateMap) {
            updateCount++;
        }
        if (updateCount > 0) {
            $("#dialog-overlay").show();
            UMAssignmentWorklistDelegate.updateCareManagers(updateMap, function(encounterResults) {
                var addPersonIds = {};
                for (var i in updateMap) {
                    var encounter = encounterResults[umaw.worklistData.workListItems[i].encounterId];
                    umaw.worklistData.workListItems[i].version = encounter.version;
                    $.each(updateMap[i].addCareManagerIds, function(index, careManagerId) {
                        addPersonIds[careManagerId] = careManagerId;
                        umaw.worklistData.workListItems[i].careManagers.push({
                            id: encounter.personnelNewRelationIds[careManagerId],
                            personnelId: careManagerId,
                            personnelNameFull: $("#personnelInput").val()
                        });
                    });
                    umaw.renderCareManagers(i);
                }
                for (var i in addPersonIds) {
                    umaw.updateAssignedCountForAdd(i);
                }
                umaw.resetSelection();
                $("#dialog-overlay").hide();
            });
        }
    },

    replaceAssignments: function() {
        var updateMap = umaw.generateUpdateMap(2);
        var updateCount = 0;
        for (var i in updateMap) {
            updateCount++;
        }
        if (updateCount > 0) {
            $("#dialog-overlay").show();
            UMAssignmentWorklistDelegate.updateCareManagers(updateMap, function(encounterResults) {
                var addPersonIds = {};
                var removePersonIds = {};
                for (var i in updateMap) {
                    var encounter = encounterResults[umaw.worklistData.workListItems[i].encounterId];
                    umaw.worklistData.workListItems[i].version = encounter.version;
                    $.each(updateMap[i].removeRelationshipIds, function(index, relationshipId) {
                        umaw.worklistData.workListItems[i].careManagers = $.grep(umaw.worklistData.workListItems[i].careManagers, function(val) {
                            if (val.id != relationshipId) {
                                return true;
                            } else {
                                removePersonIds[val.personnelId] = val;
                            }
                        });
                    });
                    $.each(updateMap[i].addCareManagerIds, function(index, careManagerId) {
                        addPersonIds[careManagerId] = careManagerId;
                        umaw.worklistData.workListItems[i].careManagers.push({
                            id: encounter.personnelNewRelationIds[careManagerId],
                            personnelId: careManagerId,
                            personnelNameFull: $("#personnelInput").val()
                        });
                    });
                    umaw.renderCareManagers(i);
                }
                for (var i in removePersonIds) {
                    umaw.updateAssignedCountForRemove(removePersonIds[i]);
                }
                for (var i in addPersonIds) {
                    umaw.updateAssignedCountForAdd(i);
                }
                umaw.resetSelection();
                $("#dialog-overlay").hide();
            });
        }
    },

    removeAssignments: function() {
        var updateMap = umaw.generateUpdateMap(3);
        var updateCount = 0;
        for (var i in updateMap) {
            updateCount++;
        }
        if (updateCount > 0) {
            $("#dialog-overlay").show();
            UMAssignmentWorklistDelegate.updateCareManagers(updateMap, function(encounterResults) {
                var removePersonIds = {};
                for (var i in updateMap) {
                    var encounter = encounterResults[umaw.worklistData.workListItems[i].encounterId];
                    umaw.worklistData.workListItems[i].version = encounter.version;
                    $.each(updateMap[i].removeRelationshipIds, function(index, relationshipId) {
                        umaw.worklistData.workListItems[i].careManagers = $.grep(umaw.worklistData.workListItems[i].careManagers, function(val) {
                            if (val.id != relationshipId) {
                                return true;
                            } else {
                                removePersonIds[val.personnelId] = val;
                            }
                        });
                    });
                    umaw.renderCareManagers(i);
                }
                for (var i in removePersonIds) {
                    umaw.updateAssignedCountForRemove(removePersonIds[i]);
                }
                umaw.resetSelection();
                $("#dialog-overlay").hide();
            });
        }
    },

    /**
     * mode values:
     * 		1 = ADD
     * 		2 = REPLACE
     * 		3 = REMOVE
     */
    generateUpdateMap: function(mode) {
        var updateMap = {};
        $(".care-manager-selected-div").each(function(i, val) {
            var index = $(this).closest("tr").prop("id").split("row-")[1];

            if (!updateMap[index]) {
                var rowData = umaw.worklistData.workListItems[index];
                updateMap[index] = {
                    patientId: rowData.patientId,
                    encounterId: rowData.encounterId,
                    version: rowData.version,
                    addCareManagerIds: [],
                    removeRelationshipIds: [],
                    assignedPersonIds: []
                };

                if (mode === 1 || mode === 2) {
                    updateMap[index].addCareManagerIds.push(umaw.providerSearchControl.getSelectedProviderId());
                    $.each(rowData.careManagers, function(i, val) {
                        updateMap[index].assignedPersonIds.push(val.personnelId);
                    });
                }
            }

            if (mode !== 1) {
                var classes = $(this).attr("class").split(/\s+/);
                $.each(classes, function(i, val) {
                    if (val.match(/relationship-/)) {
                        updateMap[index].removeRelationshipIds.push(parseInt(val.replace("relationship-", ""), 10));
                        return false;
                    }
                });
            }
        });

        $.each(updateMap, function(i, val) {
            val.addCareManagerIds = $.grep(val.addCareManagerIds, function(a) {
                if (a != 0)
                    return true;
            });
            val.removeRelationshipIds = $.grep(val.removeRelationshipIds, function(a) {
                if (a != 0)
                    return true;
            });
        });

        var validatedMap = {};
        if (mode === 1 || mode === 2) {
            for (var i in updateMap) {//Filter out encounters that are adding an assignment that already exists.
                var val = updateMap[i];
                $.each(val.addCareManagerIds, function(index, id) {
                    if ($.inArray(id, val.assignedPersonIds) === -1) {
                        validatedMap[i] = updateMap[i];
                        return false;
                    }
                });
            }
        } else if (mode === 3) {//Filter out encounters that are not removing anything
            for (var i in updateMap) {
                if (updateMap[i].removeRelationshipIds.length) {
                    validatedMap[i] = updateMap[i];
                }
            }
        }
        return validatedMap;
    },

    renderCareManagers: function(index) {
        var rowData = umaw.worklistData.workListItems[index];
        if (rowData.careManagers && rowData.careManagers.length > 0) {
            var $careManagersDiv = $("<div class='care-managers'></div>").append($("#careManagerTmpl").render(umaw.worklistData.workListItems[index].careManagers));
        } else {
            var $careManagersDiv = $("<div class='care-manager-div care-manager-unassigned'><label class='gray'>" + i18n.UMAW_ASSIGN + "</label></div>");
        }
        $("#row-" + index + " .care-managers-container").empty().append($careManagersDiv);
        umaw.manageHeader();
    },

    loadi18nValues: function() {
        //Assignment Row
        $("#personnelInputLabel").text(i18n.UMAW_PERSONNEL);
        $("#currentAssignmentLabel").text(i18n.UMAW_CURRENT_ASSIGNMENT);
        $("#currentSelectionOption").text(i18n.UMAW_CURRENT_SELECTION);
        $("#allOption").text(i18n.UMAW_ALL);
        $("#unassignedOption").text(i18n.UMAW_UNASSIGNED);
        $("#clearOption").text(i18n.UMAW_CLEAR_SELECTION);

        //Split Button Values
        $("#assignSplitButton").text(i18n.UMAW_ADD_ASSIGNMENT);
        $("#splitButtonRemoveData").text(i18n.UMAW_REMOVE_ASSIGNMENT);
        $("#splitButtonReplaceData").text(i18n.UMAW_REPLACE_ASSIGNMENT);

        //Table Headers
        $("#locationLabel").text(i18n.UMAW_LOCATION);
        $("#encounterTypeLabel").text(i18n.UMAW_ENCOUNTER_TYPE_P);
        $("#patientLabel").text(i18n.UMAW_PATIENT);
        $("#umStatusNextCRLabel").text(i18n.UMAW_UM_STATUS_NEXT_CLINICAL_REVIEW);
        $("#lastReviewLabel").text(i18n.UMAW_LAST_REVIEW_P);
        $("#careManagerLabel").text(i18n.UMAW_CARE_MANAGER);
        $("#payerLabel").text(i18n.UMAW_PAYER);
        $("#classLabel").text(i18n.UMAW_CLASS_P);
        $("#healthPlanLabel").text(i18n.UMAW_HEALTH_PLAN);
        $("#authStatusEndDtLabel").text(i18n.UMAW_AUTH_STATUS_END_DT);

        //No Patient List Message
        $(".no-patient-lists-primary-label").text(i18n.UMAW_NO_ACTIVE_LISTS);
        $(".no-patient-lists-secondary-label").text(i18n.UMAW_NO_ACTIVE_LISTS_LINE_2);
        $(".no-patient-lists-link").text(i18n.UMAW_LIST_MAINTENANCE);
    },

    resetSelection: function() {
        $(".care-manager-selected-div").removeClass("care-manager-selected-div");
        $("#currentAssignmentSelect").val("");
        umaw.updatePatientCountforAssignButton();
    },

    confirmReplaceDialog: function() {
        var relations = $(".care-manager-selected-div").length;
        if (relations > 0) {
            var string = i18n.UMAW_CONFIRM_REPLACE_MESSAGE.replace("{0}", relations).replace("{1}", $("#personnelInput").val());
            umaw.openDialog(i18n.UMAW_CONFIRM_REPLACE_TITLE, string, true, i18n.UMAW_REPLACE, umaw.replaceAssignments);
        } else {
            umaw.openDialog(i18n.UMAW_NO_RELATIONSHIPS_TITLE, i18n.UMAW_NO_RELATIONSHIPS_MESSAGE);
        }
    },

    confirmRemoveDialog: function() {
        var relations = $(".care-manager-selected-div:not(.care-manager-unassigned)").length;
        if (relations > 0) {
            var string = i18n.UMAW_CONFIRM_REMOVE_MESSAGE.replace("{0}", relations);
            umaw.openDialog(i18n.UMAW_CONFIRM_REMOVE_TITLE, string, true, i18n.UMAW_REMOVE, umaw.removeAssignments);
        } else {
            umaw.openDialog(i18n.UMAW_NO_RELATIONSHIPS_TITLE, i18n.UMAW_NO_RELATIONSHIPS_MESSAGE);
        }
    },

    openDialog: function(title, message, isConfirm, actionText, actionHandler) {

        $("#confirm-dialog-button").unbind("click");

        if (isConfirm) {
            $("#confirm-dialog-button").show();
            $("#confirm-dialog-button").val(actionText);
            $("#close-dialog-button").val(i18n.UMAW_CANCEL);
            $("#confirm-dialog-button").click(function() {
                umaw.closeDialog();
                actionHandler();
            });
        } else {
            $("#confirm-dialog-button").hide();
            $("#close-dialog-button").val(i18n.UMAW_OK);
        }

        $("#dialog-title").text(title);
        $("#dialog-message").text(message);
        $("#dialog-overlay").show();
        $("#dialog-container").css("margin-top", -($("#dialog-container").height() / 2));
        $("#dialog-container").show();
    },

    closeDialog: function() {
        $("#confirm-dialog-button").unbind("click");
        $("#dialog-overlay").hide();
        $("#dialog-container").hide();
    },

    checkSecurity: function() {
        $(".required").show();
        $("#splitButton-button-area-id").show();

        if (umaw.canDelete) {
            $("#dropdownSplitButton").show();
            $(".splitButton-button-area").width("195px");
        } else {
            $("#dropdownSplitButton").hide();
            $(".splitButton-button-area").width("170px");
        }
        if (umaw.canAdd) {
            $("#splitButton-button-area-id").show();
            $("#assignSplitButton").click(function() {
                umaw.addAssignments();
                umaw.closeSplitButtonDropdown();
            });
        } else if (umaw.canDelete) {
            $("#dropdownSplitButton").hide();
            $(".required").hide();
            $(".splitButton-button-area").width("170px");
            $("#splitButton-button-area-id").show();
            $("#assignSplitButton").click(function() {
                umaw.confirmRemoveDialog();
                umaw.closeSplitButtonDropdown();
            });
            umaw.updatePatientCountforAssignButton();
        } else {
            $("#splitButton-button-area-id").hide();
        }
        if (umaw.canAdd && umaw.canDelete) {
            $("#splitButtonRemoveRow").show();
            $("#splitButtonReplaceRow").show();
        }
    },

    updatePatientCountforAssignButton: function() {
        var numberSelected = $(".care-manager-selected-div").length;
        if (umaw.canAdd) {
            $("#assignSplitButton").text(i18n.UMAW_ADD_ASSIGNMENT + " (" + numberSelected + ")");
        } else if (umaw.canDelete) {
            $("#assignSplitButton").text(i18n.UMAW_REMOVE_ASSIGNMENT + " (" + numberSelected + ")");
        }
        if (numberSelected > 0) {
            if (!umaw.canAdd || umaw.providerSearchControl.isVerified()) {
                $("#assignSplitButton").prop("disabled", false);
                if (umaw.canAdd && umaw.canDelete) {
                    $("#splitButtonReplaceData").show();
                }
            }
            $("#dropdownSplitButton").prop("disabled", false);
        } else {
            $("#assignSplitButton").prop("disabled", true);
            $("#dropdownSplitButton").prop("disabled", true);
            umaw.closeSplitButtonDropdown();
        }
    },

    toggleSplitButtonDropdown: function() {
        if ($("#splitButton-dropdown-area-id").is(":hidden")) {

            var buttonPosition = $("#splitButton-button-area-id").offset();
            var buttonLeft = buttonPosition.left;
            var buttonTop = buttonPosition.top;
            $(".splitButton-dropdown-area").css("left", buttonLeft);
            $(".splitButton-dropdown-area").css("top", buttonTop + 23);
            $("#splitButton-dropdown-area-id").slideDown("fast");
        } else {
            $("#splitButton-dropdown-area-id").slideUp("fast");
        }
    },

    closeSplitButtonDropdown: function() {
        $("#splitButton-dropdown-area-id").slideUp("fast");
    },

    manageHeader: function() {
        if (umaw.resizeTimer) {
            clearTimeout(umaw.resizeTimer);
            umaw.resizeTimer = null;
        }
        umaw.resizeTimer = setTimeout(umaw.alignHeader, 10);
    },

    alignHeader: function() {
        var windowHeight = $(window).height() - 10;
        //extra space at the bottom
        var filterHeight = $(".filter-row-div").height();
        var assignmentHeight = $(".assignment-row-div").height();
        var headerHeight = $("#worklistTableHeader").height();
        $("#worklistTableContainer").height(windowHeight - filterHeight - assignmentHeight - headerHeight);

        $("#worklistTableHeader .col-1").width($("#worklistTable .col-1").width());
        $("#worklistTableHeader .col-2").width($("#worklistTable .col-2").width() - 1);
        $("#worklistTableHeader .col-3").width($("#worklistTable .col-3").width() - 1);
        $("#worklistTableHeader .col-4").width($("#worklistTable .col-4").width() - 1);
        $("#worklistTableHeader .col-5").width($("#worklistTable .col-5").width() - 1);
    },

    disableListSelectionAndFilter: function(disable) {
        $("#patientListDropdown").prop("disabled", disable);
        $("#filterBtn").prop("disabled", disable);
        $("#personnelInput").prop("disabled", disable);
        $("#currentAssignmentSelect").prop("disabled", disable);
    },

    openListMaintenance: function() {
        var maintenanceObj = window.external.DiscernObjectFactory("PMLISTMAINTENANCE");
        $("#dialog-overlay").show();
        if (maintenanceObj.OpenListMaintenanceDialog() === 0) {
            $("#dialog-overlay").hide();
            return;
        }
        $("#dialog-overlay").hide();
        $("#patientListDropdown").empty();
        umaw.selectedPatientList = null;
        if (umaw.hadPatientList) {
            if (umaw.loadPatientLists()) {
                umaw.disableListSelectionAndFilter(false);
                umaw.reloadPatientList();
            } else {
                umaw.removeWorklist();
                umaw.clearAssignmentDropdown();
                umaw.disableListSelectionAndFilter(true);
                $("#assignSplitButton").text(i18n.UMAW_ADD_ASSIGNMENT);
                $("#patientCountLabel").empty();
                $("#filterLabel").empty();
            }
        } else {
            umaw.removeWorklist();
            umaw.init();
        }
        //force a redraw of the patient list section for sizing purposes
        $(".patient-list-span").hide().show();
    },

    getDefaultPatientList: function(patientLists) {
        if(!patientLists || !patientLists.length) {
            return null;
        }

        var match = document.cookie.match(/rcm_umaw_pl=([^;]+)(;|\b|$)/);
        if (match && match[1]) {
            var patientListId = Number(match[1]);
            for(var i = 0; i < patientLists.length; i++) {
                if(patientListId === patientLists[i].patientList.id) {
                    return patientLists[i];
                }
            }
        }

        return patientLists[0];
    }
};