/**
* Med Waste Component
* Begin RxStationMed Waste Component Development
* Note: The med waste component for RxStation.
* Initial Development: 02/16/2013
* @author Sachin Yadav(SY017308) 
*/
function RxsMedWasteComponentStyle() {
    this.initByNamespace("med_waste");
}
RxsMedWasteComponentStyle.inherits(ComponentStyle);

function RxsMedWasteComponent(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new RxsMedWasteComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.MEDS_WASTE.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.MEDS_WASTE.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(0);
    this.setLookbackUnitTypeFlag(1);
    this.m_lookBackHours = 2; //Default look back will be 2 hours
    RXS_CERN_MEDS_WASTE_01.comp = this;
    this.m_user = null;
    this.m_txToWasteIsLoaded = false;
    this.m_allTxToWaste = null;
    this.m_admType = new AdmType(1); //1 is RxStation
    this.m_wasteMode = null; // Default waste mode = 0 (Blank), 1 (Disprnse), 2(Predictive)

    RxsMedWasteComponent.method("setUser", function (value) {
        this.m_user = value;
        if (value != null) {
            this.InsertData();
        } else {
            RXS_CERN_MEDS_WASTE_01.WaitingForAuthentication();
        }
    });
    RxsMedWasteComponent.method("getUser", function () {
        return this.m_user;
    });

    RxsMedWasteComponent.method("setTxToWasteIsLoaded", function (value) {
        this.m_txToWasteIsLoaded = value;
    });
    RxsMedWasteComponent.method("getTxToWasteIsLoaded", function () {
        return this.m_txToWasteIsLoaded;
    });

    RxsMedWasteComponent.method("setAllTxToWaste", function (value) {
        this.m_allTxToWaste = value;
    });
    RxsMedWasteComponent.method("getAllTxToWaste", function () {
        return this.m_allTxToWaste;
    });

    RxsMedWasteComponent.method("InsertData", function () {
        var recordData = [];
        RXS_CERN_MEDS_WASTE_01.RenderComponent(this, recordData);
    });
    RxsMedWasteComponent.method("HandleSuccess", function (recordData) {
        RXS_CERN_MEDS_WASTE_01.RenderComponent(this, recordData);
    });

    RxsMedWasteComponent.method("setLookBackHours", function (value) {
        this.m_lookBackHours = value;
    });
    RxsMedWasteComponent.method("getLookBackHours", function () {
        return this.m_lookBackHours;
    });

    RxsMedWasteComponent.method("setAdmType", function (value) {
        this.m_admType = value;
    });

    RxsMedWasteComponent.method("getAdmType", function () {
        return this.m_admType;
    });

    RxsMedWasteComponent.method("setWasteMode", function (value) {
        this.m_wasteMode = value;
    });

    RxsMedWasteComponent.method("getWasteMode", function () {
        return this.m_wasteMode;
    });
}
RxsMedWasteComponent.inherits(MPageComponent);

var RXS_CERN_MEDS_WASTE_01 = function () {

    var comp = null;
	
    var curMedTransactionsToWaste = null;
    var curMedTransactionIndex = -1;
    var curWasteTxType = -1;
    var reasonCodesForWaste = null;
	
	var parentElement = [ {CODE:-1, DISPLAY: i18n.ALL, DESCRIPTION:"", CODE_SET:-1, SEQUENCE:-1, MEANING:""},
							{CODE:1, DISPLAY: i18n.CONTROLLED, DESCRIPTION:"", CODE_SET:-1, SEQUENCE:-1, MEANING:""},
							{CODE:0, DISPLAY: i18n.NOTCONTROLLED, DESCRIPTION:"", CODE_SET:-1, SEQUENCE:-1, MEANING:""}];
	var legal_status_filters = MP_Util.LoadCodeListJSON(parentElement);

    var userIndicators = null;
    var reasonCd = 0;
    var dispense_activities = [];
    var legalStatusFilter = 1;
    var CurrentFilterType = 0;
    var NUMBER_FORMAT = new NumberFormat();

    return {
        RenderComponent: function (component, recordData) {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());

            try {

                if (RXS_CERN_MEDS_WASTE_01.userIndicators != null && RXS_CERN_MEDS_WASTE_01.userIndicators.CAN_WASTE_IND == 1) {

                    RXS_CERN_MEDS_WASTE_01.PrepareGetReasonCodes();
                    RXS_CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions();
                }

            }
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally {
                if (timerRenderComponent)
                    timerRenderComponent.Stop();
            }
        },
        WaitingForAuthentication: function () {
            //Display a waiting for authentication message until the component has a valid user
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.WAITING_FOR_USER_AUTH + "... </span><br/>";
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        UserCanNotWaste: function () {
            //Display a waiting for authentication message until the component has a valid user
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.USER_CAN_NOT_REMOTE_WASTE + "... </span><br/>";
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        ShowRetrieveWasteTxOptions: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
            jsHTML.push("<input type='button' name='getAllWasteTxsButton' onClick='RXS_CERN_MEDS_WASTE_01.GetAllTxToWaste()' value='", i18n.WASTEABLE_TX, "'>");
            jsHTML.push("<input type='button' name='getUndocumentedWasteTxsButton' onClick='RXS_CERN_MEDS_WASTE_01.GetUndocumentedTxToWaste()' value='", i18n.UNDOCUMENTED_WASTE_TX, "'>");
            //jsHTML.push("LEGAL_STATUS:");
            jsHTML.push(RXS_CERN_MEDS_WASTE_01.BuildLegalStatus());
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        BuildLegalStatus: function () {
            var selected_entry = 0;
            var aHTML = [];
            var codeCnt = legal_status_filters.length;
            aHTML.push(i18n.LEGAL_STATUS);
            aHTML.push('<select name="' + "legal_status" + '" onchange="RXS_CERN_MEDS_WASTE_01.SetLegalStatusFilter(this.options[this.selectedIndex].value)"');

            aHTML.push("id=legal_status_select>");
            aHTML.push('<option ');
            if (selected_entry <= 0) {
                aHTML.push("selected=selected ");
            }
            for (var i = 0; i < codeCnt; i++) {
                code = legal_status_filters[i].value;

                aHTML.push('<option ');
                if ((legalStatusFilter == code.codeValue) || (codeCnt == 1)) {
                    legalStatusFilter = code.codeValue;
                    aHTML.push("selected=selected ");
                }
                aHTML.push('value=' + code.codeValue + '>' + code.display + '</option>');
                code = null;
            }
            aHTML.push('</select>');

            return aHTML.join('');
        },
        GetAllTxToWaste: function () {
            CurrentFilterType = 2;
            this.curWasteTxType = 1; 		//1 - DFT_TX
            RXS_CERN_MEDS_WASTE_01.GetMedTxToWaste(CurrentFilterType); // 2 - All transactions for waste 

        },
        GetUndocumentedTxToWaste: function () {
            CurrentFilterType = 4;
            this.curWasteTxType = 1; 		//1 - DFT_TX
            RXS_CERN_MEDS_WASTE_01.GetMedTxToWaste(CurrentFilterType); // only predictable transactions
        },
        PrepareGetReasonCodes: function () {
            var sendArReason = [];
            var GET_WASTE_REASON_CODES_REQUEST = new Object();
            var pharmacyEvents = [];
            var wasteEvent = new Object();
            wasteEvent.event_cd = RXS_CERN_MEDS_WASTE_01.GetWasteEventCode() + ".0";
            pharmacyEvents.push(wasteEvent);
            GET_WASTE_REASON_CODES_REQUEST.events = pharmacyEvents;

            var json_object = new Object();
            json_object.GET_WASTE_REASON_CODES_REQUEST = GET_WASTE_REASON_CODES_REQUEST;

            var json_request = JSON.stringify(json_object);

            sendArReason.push("^MINE^"
							, "^GET_WASTE_REASON_CODES^"
							, "^" + json_request + "^");
            GetReasonCodesForWaste(this.comp, sendArReason);
        },
        GetWasteEventCode: function () {
            var wasteEventCd = 0;
            var eventCodeSet = MP_Util.GetCodeSet(4032, false);
            var code = MP_Util.GetCodeByMeaning(eventCodeSet, "DEVICEWASTE");
            wasteEventCd = (code) ? code.codeValue : 0;

            return wasteEventCd;
        },
        GetPredictiveWaste: function () {
            var curPredictiveTransactionToWaste = [];
            //Spin through the orders and look for predictive orders
            var wasteTransactions = this.curMedTransactionsToWaste;
            for (var x = 0 in wasteTransactions) {
                var order = wasteTransactions[x];
                for (var y = 0 in order.PRODUCT_ACTIVITIES) {
                    var prediction = order.PRODUCT_ACTIVITIES[y].PREDICTION;
                    if ((prediction.STRENGTH_PREDICTION_IND == 1 && prediction.STRENGTH_PREDICTION.VALUE)
                    || (prediction.VOLUME_PREDICTION_IND == 1 && prediction.VOLUME_PREDICTION.VALUE)) {
                        curPredictiveTransactionToWaste.push(order);
                        break;
                    }
                }
            }
            this.curMedTransactionsToWaste = curPredictiveTransactionToWaste;
        },
        FilterTransactionsByLegalStatus: function (legal_status_filter) {
            var curTxToWasteByLegalStatus = [];
            //Spin through the orders and filter by selected legal status
            var wasteTransactions = this.curMedTransactionsToWaste;
            for (var x = 0 in wasteTransactions) {
                var order = wasteTransactions[x];
                for (var activity = 0 in order.PRODUCT_ACTIVITIES) {
                    var item = order.PRODUCT_ACTIVITIES[activity].ITEM;
                    if (item.LEGALSTATUS.CONTROLLED_IND == legal_status_filter) {
						curTxToWasteByLegalStatus.push(order);
						break;
					}
                }
            }
            this.curMedTransactionsToWaste = curTxToWasteByLegalStatus;
        },
        SetLegalStatusFilter: function (legal_status_filter) {
            legalStatusFilter = legal_status_filter;
            this.curMedTransactionsToWaste = this.comp.getAllTxToWaste();
            if (this.curMedTransactionsToWaste != null) {
                RXS_CERN_MEDS_WASTE_01.ShowWasteableMedTransactions(this.comp, CurrentFilterType);
            }
        },
        GetExceptionsForSelectedTransaction: function () {
            var exceptions = [], dupFound;
            var productActivities = this.curMedTransactionsToWaste[this.curMedTransactionIndex].PRODUCT_ACTIVITIES;
            if (productActivities != null) {
                for (var x = 0 in productActivities) {
                    dupFound = false;
                    var exception = new Object;
                    exception.exception_cd = productActivities[x].ITEM.LEGALSTATUS.LEGAL_STATUS_CD + ".0";  // legal staus codes from items
                    // do not add dups
                    for (var pIdx = 0 in exceptions) {
                        if (exceptions[pIdx].exception_cd == exception.exception_cd) {
                            dupFound = true;
                            break;
                        }
                    }
                    if (!dupFound) { // dup check
                        exceptions.push(exception);
                    }
                }
            }
            return exceptions;
        },
        GetMedTxToWaste: function (retrieval_type_filter) {
            //The get transactions to waste can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.LOADING_DATA + "... </span><br/>";
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

            if (this.comp.getTxToWasteIsLoaded() == true) {
                //We have already made the call to retrieve the info so just display/filter it as needed.
                this.curMedTransactionIndex = -1;
                this.curMedTransactionsToWaste = this.comp.getAllTxToWaste();
                RXS_CERN_MEDS_WASTE_01.ShowWasteableMedTransactions(this.comp, retrieval_type_filter);
            } else {
                //allTxToWasteLoaded is false, so we need to get med tx to waste info by making retrieval call

                var criterion = this.comp.getCriterion();
                var sendAr = [];
                var GET_RETRACTABLE_ORDERS_REQUEST = new Object();

                var user = new Object();
                user.person_id = criterion.provider_id + ".0";
                var encounters = [];
                var encounter = new Object();
                encounter.encounter_id = criterion.encntr_id + ".0";
                encounters.push(encounter);

                GET_RETRACTABLE_ORDERS_REQUEST.patient_id = criterion.person_id + ".0";
                GET_RETRACTABLE_ORDERS_REQUEST.encounters = encounters;
                GET_RETRACTABLE_ORDERS_REQUEST.personnel_id = criterion.provider_id + ".0";
                var startDate = new Date();
                startDate.setTime(startDate.getTime() - (this.comp.getLookBackHours() * 3600000.0)); //look back preference
                var endDate = new Date();

                GET_RETRACTABLE_ORDERS_REQUEST.dispense_start_dt_tm = startDate.format("dd-mmm-yyyy HH:MM:ss");
                GET_RETRACTABLE_ORDERS_REQUEST.dispense_end_dt_tm = endDate.format("dd-mmm-yyyy HH:MM:ss");

                var json_object = new Object();
                json_object.GET_RETRACTABLE_ORDERS_REQUEST = GET_RETRACTABLE_ORDERS_REQUEST;

                var json_request = JSON.stringify(json_object);

                sendAr.push("^MINE^"
							, "^GET_RETRACTABLE_ORDERS^"
							, "^" + json_request + "^");
                GetTransactionsToWaste(this.comp, sendAr, retrieval_type_filter);
            }
        },
        ShowWasteableMedTransactions: function (component, retrieval_type_filter) {
            var sHTML = "";
            var jsHTML = [];
            var content = [];

            if (retrieval_type_filter == 4) {  // predictive waste
                RXS_CERN_MEDS_WASTE_01.GetPredictiveWaste();
            }

            if (legalStatusFilter >= 0) {
                RXS_CERN_MEDS_WASTE_01.FilterTransactionsByLegalStatus(legalStatusFilter); // filter based on legal Status
            }
            var wasteTransactions = this.curMedTransactionsToWaste;
            var numTxToDisplay = 0;

            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
            if (wasteTransactions != undefined && wasteTransactions.length > 0) {
                //Sort by remove date/time 
                wasteTransactions.sort(SortByDispenseDtTm);

                jsHTML.push("<form name=medToWasteRadioForm method='get' action='' onsubmit='return false;'>");
                for (var x = 0 in wasteTransactions) {
                    jsHTML.push("<dl class='waste-info'>");
                    var medId = wasteTransactions[x].ORDER_ID;
                    //Build the display name if it has yet to be built
                    BuildWasteMedDisplayName(wasteTransactions[x]);

                    var removeDateTime = "";
                    var dateTime = new Date();
                    var sDate = wasteTransactions[x].DISPENSE_DT_TM;
                    dateTime.setISO8601(sDate);
                    //Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
                    if (!dateTime.isZeroDate(sDate)) {
                        //dispense date time that will be displayed in the waste component
                        removeDateTime = dateTime.format("longDateTime2");
                    }
                    if (retrieval_type_filter != 1) {
                        var removedByAndWhen = i18n.REMOVED_BY_AND_WHEN.replace("{0}", wasteTransactions[x].EXECUTOR.FORMATTED_NAME);
                        removedByAndWhen = removedByAndWhen.replace("{1}", removeDateTime);
                    }

                    numTxToDisplay++;

                    if (wasteTransactions[x].UNDOCUMENTED_WASTE_IND == 1) {
                        jsHTML.push("<dd class='waste-medtxtowaste-undocumented-radio'>");
                    } else {
                        jsHTML.push("<dd class='waste-medtxtowaste-radio'>");
                    }
                    var wasteTxIndex = "waste_tx_index|" + x;
                    if (wasteTransactions[x].ACCESSIBILITY.WASTEABLE_IND == 1) {
                        jsHTML.push("<input type='radio' name='medToWasteRadio' onkeydown='RXS_CERN_MEDS_WASTE_01.MedToWasteRadio_KeyDown()'  value='" + wasteTxIndex + "'>" + wasteTransactions[x].DESCRIPTION + " (" + removedByAndWhen + ")</dd><br>");
                    } else {
                        jsHTML.push("<input type='radio' disabled='disabled' name='medToWasteRadio' onkeydown='RXS_CERN_MEDS_WASTE_01.MedToWasteRadio_KeyDown()'  value='" + wasteTxIndex + "'>" + wasteTransactions[x].DESCRIPTION + " (" + removedByAndWhen + ")</dd><br>");
                    }

                    jsHTML.push("</dl>");
                }
                if (numTxToDisplay > 0) {
                    jsHTML.push("<input type='button' name='wasteSelectedMedButton' onClick='RXS_CERN_MEDS_WASTE_01.WasteSelectedMedication()' value='", i18n.WASTE_MED, "'>");
                } else {
                    jsHTML.push(i18n.NO_WASTEABLE_TRANSACTIONS_QUALIFY_FOR_DISPLAY);
                }
                jsHTML.push("</form>");
            } else {
                jsHTML.push(i18n.NO_WASTEABLE_TRANSACTIONS_FOUND);
            }
            jsHTML.push("<br/></h3></div>");

            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
            jsHTML.push("<input type='button' name='getAllWasteTxsButton' onClick='RXS_CERN_MEDS_WASTE_01.GetAllTxToWaste()' value='", i18n.WASTEABLE_TX, "'>");
            jsHTML.push("<input type='button' name='getUndocumentedWasteTxsButton' onClick='RXS_CERN_MEDS_WASTE_01.GetUndocumentedTxToWaste()' value='", i18n.UNDOCUMENTED_WASTE_TX, "'>");
            jsHTML.push(RXS_CERN_MEDS_WASTE_01.BuildLegalStatus());
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        MedToWasteRadio_KeyDown: function () {
            if (event.keyCode == 13)
                document.getElementById('wasteSelectedMedButton').click();
        },
        WasteSelectedMedication: function () {
            this.curMedTransactionIndex = -1;
            var length = document.medToWasteRadioForm.medToWasteRadio.length;
            var radioValue = "";
            //Handle the case where the list of radio buttons was just a single radio button so is not stored in an array
            if (length == null) {
                if (document.medToWasteRadioForm.medToWasteRadio != null) {
                    if (document.medToWasteRadioForm.medToWasteRadio.checked) {
                        radioValue = document.medToWasteRadioForm.medToWasteRadio.value;
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (document.medToWasteRadioForm.medToWasteRadio[i].checked) {
                        radioValue = document.medToWasteRadioForm.medToWasteRadio[i].value;
                        break;
                    }
                }
            }


            //Run through the list of transactions to find the one that matches the selected radio button (based
            //on the waste_tx_seq to radio button value attribute comparison)
            if (radioValue != "") {
                var radioValueArray = radioValue.split("|");
                var wasteTxIndex = new Number(radioValueArray[1]); //get the index value that was built into the id in the format "waste_tx_index|#" where # is the index value
                if (wasteTxIndex >= 0) {
                    this.curMedTransactionIndex = wasteTxIndex;
                }

                //If the curMedTrnasactionIndex variable has been set, we have a valid selection and we can move on
                if (this.curMedTransactionIndex >= 0) {
                    this.ShowAmountGivenForm();
                }
            } else {
                alert(i18n.SELECT_TRANSACTION);
            }
        },
        ShowAmountGivenForm: function () {
            if (this.curMedTransactionIndex >= 0) {
                var sHTML = "";
                var jsHTML = [];
                var content = [];
                var dummyIngredientPresent = false;
                jsHTML = BuildWasteMedInfoDisplay(this.curMedTransactionsToWaste, this.curMedTransactionIndex, false);

                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><form name=amountGivenForm method='get' action='' onsubmit='return false;'>");
                jsHTML.push("<span class='sub-sec-title'>", i18n.PLEASE_ENTER_AMOUNT_GIVEN, "</span><br/>");

                jsHTML.push("<table id='WasteAmountDisplayTable' cellspacing='1' cellpadding='0' border='1'>");
                jsHTML.push("<tr><th>", i18n.ITEM_DESCRIPTION, "</th>");
                jsHTML.push("<th>", i18n.DOSAGE_REMOVED, "</th>");
                jsHTML.push("<th>", i18n.DOSAGE_REMAINING, "</th>");
                jsHTML.push("<th>", i18n.DOSAGE_GIVEN, "</th>");
                jsHTML.push("<th>", i18n.DOSAGE_WASTED, "</th></tr>");

                if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].PRODUCT_ACTIVITIES != null) {
                    var productActivities = this.curMedTransactionsToWaste[this.curMedTransactionIndex].PRODUCT_ACTIVITIES;
                    for (var x = 0 in productActivities) {

                        var itemId = productActivities[x].ITEM.ITEM_ID;
                        var amtGiven = 0, amtWasted = 0;
                        var totalVolumeUOM = "", amtWastedUOM, amtRemaining, amtRemoved, amtUOM = "", strVolMul;
                        if (productActivities[x].ITEM.STRENGTH_IND == 1) {
                            amtUOM = productActivities[x].ITEM.STRENGTH.UOM_DISPLAY;
                        } else if (productActivities[x].ITEM.VOLUME_IND == 1) {
                            amtUOM = productActivities[x].ITEM.VOLUME.UOM_DISPLAY;
                            totalVolumeUOM = amtUOM;
                        }
                        // non multi-ingredient products

                        var amtRemovedQty = productActivities[x].DISPENSE_QTY;
                        var amtRemainingQty = productActivities[x].RETRACTABLE_QTY;
                        if (productActivities[x].ITEM.STRENGTH_IND == 1) {
                            strVolMul = productActivities[x].ITEM.STRENGTH.VALUE;
                            amtRemaining = amtRemainingQty * productActivities[x].ITEM.STRENGTH.VALUE;
                            amtRemoved = amtRemovedQty * productActivities[x].ITEM.STRENGTH.VALUE;
                        }
                        else if (productActivities[x].ITEM.VOLUME_IND == 1) {
                            strVolMul = productActivities[x].ITEM.VOLUME.VALUE;
                            amtRemaining = amtRemainingQty * productActivities[x].ITEM.VOLUME.VALUE;
                            amtRemoved = amtRemovedQty * productActivities[x].ITEM.VOLUME.VALUE;
                        }
                        if (productActivities[x].ITEM.DUMMY_IND == 1) {
                            dummyIngredientPresent = true;
                        }
                        var wasteMode = RXS_CERN_MEDS_WASTE_01.comp.getWasteMode();
                        switch (wasteMode) {
                            case "wasteNone":
                                // for Blank Preference
                                amtGiven = 0;
                                amtWasted = 0;
                                break;
                            case "wasteDispensed":
                                // for dispense quantity
                                amtGiven = 0;
                                amtWasted = amtRemaining;
                                break;
                            case "wastePredicted":
                                // for prediction waste
                                if (productActivities.length == 1) {
                                    if (productActivities[x].ITEM.STRENGTH_IND == 1) {
                                        amtWasted = productActivities[x].PREDICTION.STRENGTH_PREDICTION.VALUE;
                                        amtGiven = amtRemaining - amtWasted;
                                    } else if (productActivities[x].ITEM.VOLUME_IND == 1) {
                                        amtWasted = productActivities[x].PREDICTION.VOLUME_PREDICTION.VALUE;
                                        amtGiven = amtRemaining - amtWasted;
                                    }
                                }
                                break;
                            default:
                                amtGiven = 0;
                                amtWasted = 0;
                        }
                        jsHTML.push("<tr id=" + itemId + ">");
                        jsHTML.push("<td>", productActivities[x].ITEM.DESCRIPTION, "</td>");

                        jsHTML.push("<td>", displayQuantity(amtRemoved), " ", amtUOM, "</td>");
                        jsHTML.push("<td>", displayQuantity(amtRemaining), " ", amtUOM, "</td>");

                        if (amtRemaining == 0) {
                            jsHTML.push("<td><input type='text' disabled='true' name='amntGivenInput' id='amntGivenInput" + itemId + "' value=" + displayQuantity(amtGiven) + " onkeypress='return RXS_CERN_MEDS_WASTE_01.isNumberKey(event)' onkeydown='RXS_CERN_MEDS_WASTE_01.AmntGivenInput_KeyDown(" + itemId + "," + amtRemaining + ")' onChange='RXS_CERN_MEDS_WASTE_01.CalculateWasteAmount(this.value, " + itemId + "," + amtRemaining + ")'><span class='sub-sec-title'>" + amtUOM + "</span></td>");
                            jsHTML.push("<td><input type='text' disabled='true' name='amntToWasteInput' retractable = '" + amtRemainingQty + "' multiplier='" + strVolMul + "' id='amntToWasteInput" + itemId + "' value=" + displayQuantity(amtWasted) + " onkeypress='return RXS_CERN_MEDS_WASTE_01.isNumberKey(event)' onkeydown='RXS_CERN_MEDS_WASTE_01.AmntWasteInput_KeyDown(" + itemId + "," + amtRemaining + ")' onChange='RXS_CERN_MEDS_WASTE_01.CalculateGivenAmount(this.value, " + itemId + "," + amtRemaining + ")'><span class='sub-sec-title'>" + amtUOM + "</span></td>");

                        } else {
                            jsHTML.push("<td><input type='text' name='amntGivenInput' id='amntGivenInput" + itemId + "' value=" + displayQuantity(amtGiven) + " onkeypress='return RXS_CERN_MEDS_WASTE_01.isNumberKey(event)' onkeydown='RXS_CERN_MEDS_WASTE_01.AmntGivenInput_KeyDown(" + itemId + "," + amtRemaining + ")' onChange='RXS_CERN_MEDS_WASTE_01.CalculateWasteAmount(this.value, " + itemId + "," + amtRemaining + ")'><span class='sub-sec-title'>" + amtUOM + "</span></td>");
                            jsHTML.push("<td><input type='text' name='amntToWasteInput' multiplier='" + strVolMul + "' retractable = '" + amtRemainingQty + "' id='amntToWasteInput" + itemId + "' value=" + displayQuantity(amtWasted) + " onkeypress='return RXS_CERN_MEDS_WASTE_01.isNumberKey(event)' onkeydown='RXS_CERN_MEDS_WASTE_01.AmntWasteInput_KeyDown(" + itemId + "," + amtRemaining + ")' onChange='RXS_CERN_MEDS_WASTE_01.CalculateGivenAmount(this.value, " + itemId + "," + amtRemaining + ")'><span class='sub-sec-title'>" + amtUOM + "</span></td>");
                        }
                        jsHTML.push("</tr>");
                    } // end of for

                    //tr for multi-ingredient total volume display
                    if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].MULTI_INGREDIENT_ORDER_IND == 1
                         && this.curMedTransactionsToWaste[this.curMedTransactionIndex].RETRACTABLE_TOTAL_VOLUME > 0
                         && dummyIngredientPresent) {   //for multi ingredients products 

                        var amountTotalVolume = this.curMedTransactionsToWaste[this.curMedTransactionIndex].RETRACTABLE_TOTAL_VOLUME;
                        strVolMul = amtRemaining;
                        jsHTML.push("<tr>");
                        jsHTML.push("<td>", "", "</td>");

                        jsHTML.push("<td class='waste-med-info-title'>", i18n.TOTAL_VOLUME, "</td>");
                        jsHTML.push("<td>", displayQuantity(amountTotalVolume), " ", totalVolumeUOM, "</td>");
                        jsHTML.push("<td><input type='text' name='amntTotalGivenInput' id='amntTotalGivenInput' value='' onkeypress='return RXS_CERN_MEDS_WASTE_01.isNumberKey(event)' onChange='RXS_CERN_MEDS_WASTE_01.CalculateTotalWasteAmount(this.value ," + amountTotalVolume + ")' onkeydown='RXS_CERN_MEDS_WASTE_01.totalAmntGivenInput_KeyDown(" + amountTotalVolume + ")'><span class='sub-sec-title'>" + totalVolumeUOM + "</span></td>");
                        jsHTML.push("<td><input type='text' name='amntTotalToWasteInput' multiplier='" + amountTotalVolume + "' id='amntTotalToWasteInput' value='' onkeypress='return RXS_CERN_MEDS_WASTE_01.isNumberKey(event)' onChange='RXS_CERN_MEDS_WASTE_01.CalculateTotalGivenAmount(this.value," + amountTotalVolume + ")' onkeydown='RXS_CERN_MEDS_WASTE_01.totalAmntWasteInput_KeyDown(" + amountTotalVolume + ")'><span class='sub-sec-title'>" + totalVolumeUOM + "</span></td>");

                        jsHTML.push("</tr>");
                    }

                }

                jsHTML.push("</tr></table></td></tr></table>");
                jsHTML.push(RXS_CERN_MEDS_WASTE_01.build_reason_codes());
                jsHTML.push(i18n.CREDIT_PATIENT, "<input type='checkbox' disabled=true name='creditPatientCheckbox' value=''><br>");

                if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].ACCESSIBILITY.WASTE_WITNESS_IND == 1) {
                    jsHTML.push("<span class='waste-warning-text'>", i18n.WITNESS_REQURED, "</span><br/>");
                }

                jsHTML.push("<input type='button' name='wasteButton' disabled=true onClick='RXS_CERN_MEDS_WASTE_01.ProcessWasteAmountInput()' value='", i18n.WASTE_BUTTON, "'>");
                jsHTML.push("<input type='button' name='cancelButton' onClick='RXS_CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
                jsHTML.push("</form><br/></h3></div>");

                content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
                sHTML = content.join("");

                MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
                if (dummyIngredientPresent) {
                    RXS_CERN_MEDS_WASTE_01.disableAllIngredients();
                }
            }
        },
        disableAllIngredients: function () {
            var wasteQtyArr = document.getElementsByName('amntToWasteInput');
            for (var i = 0; i < wasteQtyArr.length; i++) {
                wasteQtyArr[i].disabled = true;
            }
            var givenQtyArr = document.getElementsByName('amntGivenInput');
            for (var i = 0; i < givenQtyArr.length; i++) {
                givenQtyArr[i].disabled = true;
            }
        },
        totalAmntGivenInput_KeyDown: function (amtTotal) {
            if (event.keyCode == 13) {
                RXS_CERN_MEDS_WASTE_01.CalculateTotalWasteAmount(document.getElementById('amntTotalGivenInput').value, amtTotal);
            }
        },
        totalAmntWasteInput_KeyDown: function (amtTotal) {
            if (event.keyCode == 13) {
                RXS_CERN_MEDS_WASTE_01.CalculateTotalGivenAmount(document.getElementById('amntTotalToWasteInput').value, amtTotal);
            }
        },
        isNumberKey: function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        },
        //Build HTML string for reason codes 
        build_reason_codes: function () {
            var selected_entry = 0;
            var aHTML = [];

            var codeCnt = RXS_CERN_MEDS_WASTE_01.reasonCodesForWaste.length;
            var code = {};

            aHTML.push("<div id='reason_div' class='sub-sec-title'>", i18n.REASON)
            aHTML.push('<br /><select name="REASONS" ');
            aHTML.push('id=reasons_select onchange="RXS_CERN_MEDS_WASTE_01.setCreditInd(this.options[this.selectedIndex].index)">');
            aHTML.push('<option ');
            if (selected_entry <= 0) {
                aHTML.push("selected=selected ");
            }
            aHTML.push('value=0 title=""></option>');
            for (var i = 0; i < codeCnt; i++) {
                reasonCode = RXS_CERN_MEDS_WASTE_01.reasonCodesForWaste[i];

                aHTML.push('<option ');
                aHTML.push('value=' + reasonCode.REASON_CD + ' title=' + reasonCode.CREDIT_IND + '>' + reasonCode.DISPLAY + '</option>');
                code = null;
            }
            aHTML.push('</select>');
            aHTML.push('</div>');

            return aHTML.join('');
        },
        setCreditInd: function (index) {
            if (index == 0) {
                document.getElementById('creditPatientCheckbox').checked = false;
                document.getElementById('wasteButton').disabled = true;
            }
            else {
                document.getElementById('creditPatientCheckbox').checked = RXS_CERN_MEDS_WASTE_01.reasonCodesForWaste[index - 1].CREDIT_IND;
                RXS_CERN_MEDS_WASTE_01.EnableWasteButton();
            }
        },
        AmntGivenInput_KeyDown: function (itemId, amtWasted) {
            if (event.keyCode == 13) {
                RXS_CERN_MEDS_WASTE_01.CalculateWasteAmount(document.getElementById('amntGivenInput' + itemId).value, itemId, amtWasted);
            }
        },
        AmntWasteInput_KeyDown: function (itemId, amtGiven) {
            if (event.keyCode == 13) {
                RXS_CERN_MEDS_WASTE_01.CalculateGivenAmount(document.getElementById('amntToWasteInput' + itemId).value, itemId, amtGiven);
            }
        },
        EnableWasteButton: function () {
            document.getElementById('wasteButton').disabled = true;
            var reasonSelect = document.getElementById('reasons_select');
            var wasteQtyArr = document.getElementsByName('amntToWasteInput');
            var wasteTotalInput = document.getElementById('amntTotalToWasteInput');
            var wasteAmtFlag = false;
            for (var i = 0; i < wasteQtyArr.length; i++) {
                if (wasteQtyArr[i].value > 0) {
                    wasteAmtFlag = true;
                    break;
                }
            }
            if (wasteTotalInput != null && wasteTotalInput.value > 0) {
                wasteAmtFlag = true;
            }
            if (reasonSelect.selectedIndex > 0 && wasteAmtFlag == true) {
                document.getElementById('wasteButton').disabled = false;
            }
        },
        CalculateWasteAmount: function (amountGiven, itemId, remainingAmount) {
            if (amountGiven != "") {
                var wasteAmount = remainingAmount - amountGiven;
                if (wasteAmount < 0) {
                    document.getElementById('amntToWasteInput' + itemId).value = displayQuantity(0);
                } else {
                    document.getElementById('amntToWasteInput' + itemId).value = displayQuantity(wasteAmount);

                }
                this.EnableWasteButton();
            }
        },
        CalculateGivenAmount: function (amountWaste, itemId, remainingAmount) {
            if (amountWaste != "") {
                var givenAmount = remainingAmount - amountWaste;
                if (givenAmount < 0) {
                    document.getElementById('amntToWasteInput' + itemId).value = displayQuantity(remainingAmount);
                    document.getElementById('amntGivenInput' + itemId).value = displayQuantity(0);
                } else {
                    document.getElementById('amntGivenInput' + itemId).value = displayQuantity(givenAmount);

                }
                this.EnableWasteButton();
            }
        },
        CalculateTotalGivenAmount: function (amountWaste, totalAmount) {
            if (amountWaste != "") {
                var givenAmount = totalAmount - amountWaste;
                if (givenAmount < 0) {
                    document.getElementById('amntTotalGivenInput').value = displayQuantity(0);
                    document.getElementById('amntTotalToWasteInput').value = displayQuantity(totalAmount);
                } else {
                    document.getElementById('amntTotalGivenInput').value = displayQuantity(givenAmount);
                }
                this.EnableWasteButton();
            }
        },
        CalculateTotalWasteAmount: function (amountGiven, totalAmount) {
            if (amountGiven != "") {
                var wasteAmount = totalAmount - amountGiven;
                if (wasteAmount < 0) {
                    document.getElementById('amntTotalToWasteInput').value = displayQuantity(0);
                } else {
                    document.getElementById('amntTotalToWasteInput').value = displayQuantity(wasteAmount);
                }
                this.EnableWasteButton();
            }
        },
        ClearEnterAmountGivenScreen: function (itemId) {
            document.getElementById('amntToWasteInput' + itemId).value = "";
            document.getElementById('amntGivenInput' + itemId).value = "";
            document.getElementById('wasteButton').disabled = true;
            document.getElementById('creditPatientCheckbox').disabled = true;
            document.getElementById('creditPatientCheckbox').checked = false;
        },
        ProcessWasteAmountInput: function () {
            dispense_activities = [];
            var multiIngredientWaste = 0;
            var reasonSelect = document.getElementById('reasons_select');
            reasonCd = reasonSelect.options[reasonSelect.selectedIndex].value;
            var totalWasteInput = document.getElementById('amntTotalToWasteInput');
            if (totalWasteInput != null && totalWasteInput.value > 0) {
                multiIngredientWaste = totalWasteInput.value;
            }

            var wasteQtyArr = document.getElementsByName('amntToWasteInput');
            for (var i = 0; i < wasteQtyArr.length; i++) {
                if (multiIngredientWaste > 0) {         // multi-ingredients Waste by total volume
                    var dispenseActivity = new Object();
                    var idString = wasteQtyArr[i].id;
                    var itemId = idString.replace("amntToWasteInput", "");
                    var dispenseQty = 0;
                    var item = new Object();
                    item.item_id = itemId + ".0";

                    if (totalWasteInput.multiplier > 0) {
                        dispenseQty = (multiIngredientWaste / totalWasteInput.multiplier) * wasteQtyArr[i].retractable;
                    }
                    dispenseActivity.item = item;
                    dispenseActivity.dispense_quantity = dispenseQty;
                    if (dispenseQty > 0) {
                        dispense_activities.push(dispenseActivity);
                    }
                } else if (wasteQtyArr[i].value > 0) {
                    var dispenseActivity = new Object();
                    var idString = wasteQtyArr[i].id;
                    var itemId = idString.replace("amntToWasteInput", "");
                    var dispenseQty = 0;
                    var item = new Object();
                    item.item_id = itemId + ".0";

                    if (wasteQtyArr[i].multiplier > 0) {
                        dispenseQty = wasteQtyArr[i].value / wasteQtyArr[i].multiplier;
                    }
                    dispenseActivity.item = item;
                    dispenseActivity.dispense_quantity = dispenseQty;
                    if (dispenseQty > 0) {
                        dispense_activities.push(dispenseActivity);
                    }
                }
            }
            document.getElementById('wasteButton').disabled = true;
            if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].ACCESSIBILITY.WASTE_WITNESS_IND == 1) {
                this.ShowWitnessScreen();
            } else {
                RXS_CERN_MEDS_WASTE_01.PrepareRemoteWasteRequest(0);
            }
        },
        ShowWitnessScreen: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];

            jsHTML = BuildWasteMedInfoDisplay(this.curMedTransactionsToWaste, this.curMedTransactionIndex, true);
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.WITNESS_REQURED, "</span><br/>");
            jsHTML.push(i18n.WITNESS, " <br/><input type='text' onkeydown='RXS_CERN_MEDS_WASTE_01.WitnessUserName_KeyDown()' name='wasteWitnessInput' value=''><br/>");
            jsHTML.push(i18n.WITNESS_PASSWORD, " <br/><input type='password' onkeydown='RXS_CERN_MEDS_WASTE_01.WitnessUserPassword_KeyDown()' name='wasteWitnessPasswordInput' value=''><br/>");
            jsHTML.push("<input type='button' name='submitWitnessInfoButton' onClick='RXS_CERN_MEDS_WASTE_01.EncryptPassword()' value='", i18n.OK, "'>");
            jsHTML.push("<input type='button' name='cancelButton' onClick='RXS_CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        WitnessUserName_KeyDown: function () {
            if (event.keyCode == 13)
                document.getElementById('wasteWitnessPasswordInput').select();
        },
        WitnessUserPassword_KeyDown: function () {
            if (event.keyCode == 13)
                document.getElementById('submitWitnessInfoButton').focus();
        },
        EncryptPassword: function () {
            var user_pswd = document.getElementById('wasteWitnessPasswordInput').value
            if (user_pswd.length <= 0) {
                alert(i18n.ENTER_USER_NAME_AND_PASSWORD);
            }

            //var user_id = new String(document.getElementById('wasteWitnessInput').value).toUpperCase();
            // var curUser_id = new String(RXS_CERN_MEDS_WASTE_01.comp.getUser().NATIVE_ID).toUpperCase();

            doEncryption(user_pswd, function (result) {
                var base64 = rstr2b64(result.cipher);
                RXS_CERN_MEDS_WASTE_01.PrepareAuthenticateWitnessRequest(base64);
            });
        },
        CancelWasteProcess: function () {
            this.curMedTransactionIndex = -1;
            dispense_activities = [];
            RXS_CERN_MEDS_WASTE_01.ShowWasteableMedTransactions(this.comp, CurrentFilterType);
        },
        PrepareAuthenticateWitnessRequest: function (encryptedPswd) {
            var criterion = this.comp.getCriterion();
            var sendAr = [];
            var user_id = new String(document.getElementById('wasteWitnessInput').value);

            if (user_id.length <= 0 || encryptedPswd.length <= 0) {
                alert(i18n.ENTER_USER_NAME_AND_PASSWORD);
            } else {
                //The get transactions to waste can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
                var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.LOADING_DATA + "... </span><br/>";
                MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

                var user_maintenance_request = new Object();

                var witness_user = new Object();
                witness_user.native_id = user_id;
                witness_user.foreign_id = "";
                witness_user.person_id = 0;
                witness_user.user_pswd = encryptedPswd;
                user_maintenance_request.witness_user = witness_user;

                var user = new Object();
                user.native_id = "";
                user.foreign_id = "";
                user.person_id = criterion.provider_id + ".0";
                user.user_pswd = "";
                user_maintenance_request.user = user;

                var request_indicators = new Object();
                request_indicators.transaction_ind = 3; 	//3 - Authenticate Witness

                var privilege_types = [];
                var privTypes = new Object();
                privTypes.privilege_type_identifier = "RXSWITNESS";

                var exceptions = RXS_CERN_MEDS_WASTE_01.GetExceptionsForSelectedTransaction();
                privTypes.exceptions = exceptions;
                privilege_types.push(privTypes);
                request_indicators.privilege_types = privilege_types;

                user_maintenance_request.request_indicators = request_indicators;

                user_maintenance_request.adm_type_ind = this.comp.getAdmType();

                var patient_context = new Object();
                patient_context.person_id = criterion.person_id + ".0";
                patient_context.encounter_id = criterion.encntr_id + ".0"; 
                user_maintenance_request.patient_context = patient_context;

                var json_object = new Object();
                json_object.user_maintenance_request = user_maintenance_request;

                var json_request = JSON.stringify(json_object);

                sendAr.push("^MINE^"
							, "^USER_MAINTENANCE^"
							, "^" + json_request + "^");
                SendAuthenticateWitness(this.comp, sendAr);
            }
        },
        PrepareGetUserPrivilegeRequest: function () {
            var criterion = this.comp.getCriterion();
            var sendAr = [];
            var user_maintenance_request = new Object();

            var witness_user = new Object();
            witness_user.native_id = "";
            witness_user.foreign_id = "";
            witness_user.person_id = 0;
            witness_user.user_pswd = "";
            user_maintenance_request.witness_user = witness_user;

            var user = new Object();
            user.native_id = "";
            user.foreign_id = "";
            user.person_id = criterion.provider_id + ".0";
            user.user_pswd = "";
            user_maintenance_request.user = user;

            var request_indicators = new Object();
            request_indicators.transaction_ind = 4; 	//4 - User Privilege

            var privilege_types = [];
            var privTypes = new Object();
            privTypes.privilege_type_identifier = "RXSWASTE"; //for waste privilege
            var exceptions = [];
            privTypes.exceptions = exceptions;
            privilege_types.push(privTypes);
            request_indicators.privilege_types = privilege_types;
            user_maintenance_request.request_indicators = request_indicators;
            user_maintenance_request.adm_type_ind = this.comp.getAdmType();

            var patient_context = new Object();
            patient_context.person_id = criterion.person_id + ".0";
            patient_context.encounter_id = criterion.encntr_id + ".0"; 
            user_maintenance_request.patient_context = patient_context;



            var json_object = new Object();
            json_object.user_maintenance_request = user_maintenance_request;
            var json_request = JSON.stringify(json_object);
            sendAr.push("^MINE^"
							, "^USER_MAINTENANCE^"
							, "^" + json_request + "^");
            SendUserPrivilege(this.comp, sendAr);

        },
        PrepareRemoteWasteRequest: function (witness_id) {
            //The PrepareRemoteWasteRequest can take a couple seconds, so display a "Saving..." message until it completes to let the user know the system is working
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.SAVING_DATA + "... </span><br/>";
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

            var criterion = this.comp.getCriterion();
            var sendAr = [];

            var dateTime = new Date();
            var SAVE_ORDER_DISPENSES_REQUEST = new Object();
            var orderDispenses = [];

            var orderDispense = new Object();
            orderDispense.order_id = this.curMedTransactionsToWaste[this.curMedTransactionIndex].ORDER_ID + ".0";
            orderDispense.encounter_id = criterion.encntr_id + ".0";
            orderDispense.dispense_hx_id = this.curMedTransactionsToWaste[this.curMedTransactionIndex].DISPENSE_HX_ID + ".0";
            orderDispense.patient_id = criterion.person_id + ".0";
            orderDispense.personnel_id = criterion.provider_id + ".0";
            orderDispense.witness_id = witness_id + ".0";
            orderDispense.dispense_dt_tm = dateTime.format("dd-mmm-yyyy HH:MM:ss");
            orderDispense.reason_cd = reasonCd + ".0";
            orderDispense.dispense_event_type_cd = RXS_CERN_MEDS_WASTE_01.GetWasteEventCode() + ".0";
            orderDispense.dispense_activities = dispense_activities;
            orderDispenses.push(orderDispense);
            SAVE_ORDER_DISPENSES_REQUEST.ORDER_DISPENSES = orderDispenses;

            var json_object = new Object();
            json_object.SAVE_ORDER_DISPENSES_REQUEST = SAVE_ORDER_DISPENSES_REQUEST;

            var json_request = JSON.stringify(json_object);

            sendAr.push("^MINE^"
						, "^SAVE_ORDER_DISPENSES^"
						, "^" + json_request + "^");
            SendRemoteWaste(this.comp, sendAr);
        },
        WasteSubmitted: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            dispense_activities = [];
            this.comp.setTxToWasteIsLoaded(false);
            this.curMedTransactionsToWaste = null;
            this.curMedTransactionIndex = -1;
            this.curWasteTxType = -1;
            RXS_CERN_MEDS_WASTE_01.GetMedTxToWaste(CurrentFilterType);

        }
    }

    function BuildWasteMedDisplayName(curMedTransactionToWaste) {
        if (curMedTransactionToWaste.DESCRIPTION != undefined) {
            var medNameDisplay = curMedTransactionToWaste.DESCRIPTION;
            curMedTransactionToWaste.DESCRIPTION = medNameDisplay;
        }
    }

    function BuildWasteMedInfoDisplay(curMedTransactionsToWaste, curMedTransactionIndex, showAmountWasted) {
        //Build the display for the top of the waste screens showing name/dispense info
        var jsHTML = [];
        var dispTaskDtTm = "";
        var dateTime = new Date();
        var sDate = curMedTransactionsToWaste[curMedTransactionIndex].DISPENSE_DT_TM;
        dateTime.setISO8601(sDate);
        //Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
        if (!dateTime.isZeroDate(sDate)) {
            //dispense date time that will be displayed in the waste component
            dispTaskDtTm = dateTime.format("longDateTime2");
        }
        jsHTML.push("<table id='WasteMedInfoDisplayTable' cellspacing='1' cellpadding='0' border='1'>");
        jsHTML.push("<tr><td><table><tr><td class='waste-med-info-title'>", i18n.WASTE_MEDICATION_NAME, "</td></tr>");

        BuildWasteMedDisplayName(curMedTransactionsToWaste[curMedTransactionIndex]);

        jsHTML.push("<tr><td class='waste-med-info-data'>", curMedTransactionsToWaste[curMedTransactionIndex].DESCRIPTION, "</td></tr></table></td></tr>");
        jsHTML.push("<tr><td><table><tr><td class='waste-med-info-title'>", i18n.DATE_TIME_REMOVED, "</td></tr>");
        jsHTML.push("<tr><td class='waste-med-info-data'>", dispTaskDtTm, "</td></tr></table></td></tr>");
        jsHTML.push("<tr><td><table><tr><td class='waste-med-info-title'>", i18n.REMOVED_BY, "</td></tr>");
        jsHTML.push("<tr><td class='waste-med-info-data'>", curMedTransactionsToWaste[curMedTransactionIndex].EXECUTOR.FORMATTED_NAME, "</td></tr></table></td></tr>");

        jsHTML.push("</tr></table></td></tr></table>");

        return jsHTML;
    }
    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to USER_MAINTENANCE and examines the reply status before
    //determining how to handle the reply.
    function SendUserPrivilege(component, paramAr) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
            if (info.readyState == 4 && info.status == 200) {
                try {
                    var jsonEval = JSON.parse(info.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    if (recordData.STATUS_DATA.STATUS == "Z") {
                        //TODO: Handle zero reply
                    }
                    else if (recordData.STATUS_DATA.STATUS == "S") {
                        var userErrorMsg = "";
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);
                            }
                        }
                        RXS_CERN_MEDS_WASTE_01.userIndicators =
							recordData.REPLY_DATA.USER.USER_INDICATORS;
                    }
                    else {
                        var errorAr = [];
                        var userErrorMsg = "";
                        var userAlerted = false;
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);
                                userAlerted = true;
                            }
                        }

                        //If no user error message was sent back for display, notify them with a generic error message
                        if (userAlerted == false) {
                            alert(i18n.ERROR_OCCURED_FOR_USER_PRIVILEGE);
                        }

                    }
                }
                catch (err) {
                    if (timerLoadComponent) {
                        timerLoadComponent.Abort();
                        timerLoadComponent = null;
                    }
                }
                finally {
                    if (timerLoadComponent)
                        timerLoadComponent.Stop();
                }
            }
            else if (info.readyState == 4 && info.status != 200) {
                //Notify user there was an error with the witness authentication
                alert(i18n.ERROR_OCCURED_FOR_USER_PRIVILEGE);
            }
        }
        info.open('GET', "ADM_ADAPTER_CCL_DRIVER", false);
        info.send(paramAr.join(","));
    }

    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to USER_MAINTENANCE and examines the reply status before
    //determining how to handle the reply.
    function SendAuthenticateWitness(component, paramAr) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());
        var curUser_id = component.getCriterion().provider_id;
        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
            if (info.readyState == 4 && info.status == 200) {
                try {
                    var jsonEval = JSON.parse(info.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    if (recordData.STATUS_DATA.STATUS == "Z") {
                        //TODO: Handle zero reply
                    }
                    else if (recordData.STATUS_DATA.STATUS == "S") {
                        var userErrorMsg = "";
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);
                            }
                        }
                        if (recordData.REPLY_DATA.USER.PERSON_ID == curUser_id) {
                            alert(i18n.CAN_NOT_WITNESS_OWN_WASTE);
                        } else if (recordData.REPLY_DATA.USER.USER_INDICATORS.CAN_WITNESS_IND == 1) {
                            RXS_CERN_MEDS_WASTE_01.PrepareRemoteWasteRequest(recordData.REPLY_DATA.USER.PERSON_ID);
                        } else {
                            alert(i18n.NO_WITNESS_PRIVILEGE);
                        }
                        RXS_CERN_MEDS_WASTE_01.ShowWitnessScreen();

                    }
                    else {
                        var errorAr = [];
                        var userErrorMsg = "";
                        var userAlerted = false;
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);
                                userAlerted = true;
                            }
                        }

                        //If no user error message was sent back for display, notify them with a generic error message
                        if (userAlerted == false) {
                            alert(i18n.ERROR_OCCURED_WHILE_AUTHENTICATING_WITNESS);
                        }

                        //Failed to authenticate witness, reload the witness authentication screen
                        RXS_CERN_MEDS_WASTE_01.ShowWitnessScreen();
                    }
                }
                catch (err) {
                    if (timerLoadComponent) {
                        timerLoadComponent.Abort();
                        timerLoadComponent = null;
                    }
                }
                finally {
                    if (timerLoadComponent)
                        timerLoadComponent.Stop();
                }
            }
            else if (info.readyState == 4 && info.status != 200) {
                //Notify user there was an error with the witness authentication
                alert(i18n.ERROR_OCCURED_WHILE_AUTHENTICATING_WITNESS);

                //Failed to authenticate witness, reload the witness authentication screen
                RXS_CERN_MEDS_WASTE_01.ShowWitnessScreen();
            }
        }
        info.open('GET', "ADM_ADAPTER_CCL_DRIVER", true);
        info.send(paramAr.join(","));
    }

    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to REMOTE_WASTE and examines the reply status before
    //determining how to handle the reply.
    function SendRemoteWaste(component, paramAr) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
            if (info.readyState == 4 && info.status == 200) {
                try {
                    var jsonEval = JSON.parse(info.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    if (recordData.STATUS_DATA.STATUS == "Z") {
                        //TODO: Handle zero reply
                        //component.HandleSuccess(recordData);
                    }
                    else if (recordData.STATUS_DATA.STATUS == "S") {
                        var userErrorMsg = "";
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);
                            }
                        }
                        RXS_CERN_MEDS_WASTE_01.WasteSubmitted();
                    }
                    else {
                        var errorAr = [];
                        var userErrorMsg = "";
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);
                            }
                        }

                        if (userErrorMsg == "") {
                            var statusData = recordData.STATUS_DATA;
                            errorAr.push(
									statusData.STATUS,
									statusData.SUBEVENTSTATUS.OPERATIONNAME,
									statusData.SUBEVENTSTATUS.OPERSATIONSTATUS,
									statusData.SUBEVENTSTATUS.TARGETOBJECTNAME,
									statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
                        }
                        //TODO: Error handling here
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
                    }
                }
                catch (err) {
                    if (timerLoadComponent) {
                        timerLoadComponent.Abort();
                        timerLoadComponent = null;
                    }
                }
                finally {
                    if (timerLoadComponent)
                        timerLoadComponent.Stop();
                }
            }
            else if (info.readyState == 4 && info.status != 200) {
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
                if (timerLoadComponent)
                    timerLoadComponent.Abort();
            }
        }
        info.open('GET', "ADM_ADAPTER_CCL_DRIVER", false);
        info.send(paramAr.join(","));
        //alert("remote waste");
    }

    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to RETRIEVE_TX_TO_WASTE and examines the reply status before
    //determining how to handle the reply.
    function GetTransactionsToWaste(component, paramAr, retrieval_type_filter) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
            if (info.readyState == 4 && info.status == 200) {
                try {

                    var jsonEval = JSON.parse(info.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    if (recordData.STATUS_DATA.STATUS == "Z") {
                        component.HandleSuccess(recordData);
                    }
                    else if (recordData.STATUS_DATA.STATUS == "S") {
                        var userErrorMsg = "";
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);
                            }
                        }
                        component.setAllTxToWaste(recordData.RETRACTABLE_ORDERS_REPLY_DATA.ORDERS);
                        RXS_CERN_MEDS_WASTE_01.curMedTransactionsToWaste = component.getAllTxToWaste();
                        RXS_CERN_MEDS_WASTE_01.curWasteTxType = 1;
                        if (RXS_CERN_MEDS_WASTE_01.curMedTransactionsToWaste != null || RXS_CERN_MEDS_WASTE_01.curMedTransactionsToWaste != "") {
                            component.setTxToWasteIsLoaded(true);
                        }
                        RXS_CERN_MEDS_WASTE_01.ShowWasteableMedTransactions(component, retrieval_type_filter);
                    }
                    else {
                        var errorAr = [];
                        var userErrorMsg = "";
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);

                                RXS_CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions();
                            }
                        }

                        if (userErrorMsg == "") {
                            var statusData = recordData.STATUS_DATA;
                            errorAr.push(
									statusData.STATUS,
									statusData.SUBEVENTSTATUS.OPERATIONNAME,
									statusData.SUBEVENTSTATUS.OPERSATIONSTATUS,
									statusData.SUBEVENTSTATUS.TARGETOBJECTNAME,
									statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);


                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
                        }
                    }
                }
                catch (err) {
                    if (timerLoadComponent) {
                        timerLoadComponent.Abort();
                        timerLoadComponent = null;
                    }
                }
                finally {
                    if (timerLoadComponent)
                        timerLoadComponent.Stop();
                }
            }
            else if (info.readyState == 4 && info.status != 200) {
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
                if (timerLoadComponent)
                    timerLoadComponent.Abort();
            }
        }
        info.open('GET', "ADM_ADAPTER_CCL_DRIVER", true);
        info.send(paramAr.join(","));
    }

    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to GET_WASTE_REASON_CODES and examines the reply status before
    //determining how to handle the reply.
    function GetReasonCodesForWaste(component, paramAr) {

        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
            if (info.readyState == 4 && info.status == 200) {
                try {
                    var jsonEval = JSON.parse(info.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    if (recordData.STATUS_DATA.STATUS == "Z") {
                        component.HandleSuccess(recordData);
                    }
                    else if (recordData.STATUS_DATA.STATUS == "S") {
                        var userErrorMsg = "";
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);
                            }
                        }
                        RXS_CERN_MEDS_WASTE_01.reasonCodesForWaste = recordData.EVENTS[0].REASONS;
                    }
                    else {
                        var errorAr = [];
                        var userErrorMsg = "";
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME == "USER_ERROR_MESSAGE") {
                                //The status block contained a message that needs to be displayed to the user.
                                userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                alert(userErrorMsg);

                            }
                        }

                        if (userErrorMsg == "") {
                            var statusData = recordData.STATUS_DATA;
                            errorAr.push(
									statusData.STATUS,
									statusData.SUBEVENTSTATUS.OPERATIONNAME,
									statusData.SUBEVENTSTATUS.OPERSATIONSTATUS,
									statusData.SUBEVENTSTATUS.TARGETOBJECTNAME,
									statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);


                            MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
                        }
                    }
                }
                catch (err) {
                    if (timerLoadComponent) {
                        timerLoadComponent.Abort();
                        timerLoadComponent = null;
                    }
                }
                finally {
                    if (timerLoadComponent)
                        timerLoadComponent.Stop();
                }
            }
            else if (info.readyState == 4 && info.status != 200) {
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
                if (timerLoadComponent)
                    timerLoadComponent.Abort();
            }
        }
        info.open('GET', "ADM_ADAPTER_CCL_DRIVER", true);
        info.send(paramAr.join(","));
    }


    function SortByMedName(a, b) {
        BuildWasteMedDisplayName(a)
        BuildWasteMedDisplayName(b)
        var aName = a.DESCRIPTION;
        var bName = b.DESCRIPTION;
        var aUpper = (aName != null) ? aName.toUpperCase() : "";
        var bUpper = (bName != null) ? bName.toUpperCase() : "";

        if (aUpper > bUpper)
            return 1;
        else if (aUpper < bUpper)
            return -1;
        return 0
    }

    function SortByDispenseDtTm(a, b) {
        var aLongTime = a.DISPENSE_DT_TM;
        var bLongTime = b.DISPENSE_DT_TM;

        if (aLongTime < bLongTime)
            return 1;
        else if (aLongTime > bLongTime)
            return -1;
        else
            return SortByMedName(a, b); //if times are equal, sort by med name
    }
    //utility function that accepts numbers or strings and returns the float formatted as a string
    function displayQuantity(n) {
        return NUMBER_FORMAT.format(n);
    }

    //Helper function for trimming white space from front and back of a string
    function trim(inString) {
        while (inString.substring(0, 1) == ' ') {
            inString = inString.substring(1, inString.length);
        }
        while (inString.substring(inString.length - 1, inString.length) == ' ') {
            inString = inString.substring(0, inString.length - 1);
        }
        return inString;
    }
} ();

