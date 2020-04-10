window.onerror = function (msg, url, line, col, error) {
    ConfirmOrder();
};

var configurations = {};
var sessionJson = {};
var dsn = "0";
var synonymId = "0";
var baseUrl = "";
var index = 0;
var basePortalUrl = "";

function LaunchHTML(sessionInfo, triggeringOrderId) {

    sessionJson = sessionInfo;
    var patientMRN = "MRN: " + sessionInfo.patient_info.patientmrn;

    $("#patientName").text(sessionInfo.patient_info.patientname);
    $("#patientGender").text(sessionInfo.patient_info.patientgender);
    $("#patientBirthdate").text(sessionInfo.patient_info.patientbirthdate);
    $("#patientAge").text(sessionInfo.patient_info.patientage);
    $("#patientMRN").text(patientMRN);

    for (var i = 0; i < sessionJson.orders.length; i++) {
        if (sessionJson.orders[i].orderid == triggeringOrderId) {
            index = i;
            synonymId = sessionJson.orders[i].examid;
            dsn = sessionJson.orders[i].dsn;
            break;
        }
    }
    if (dsn == 0) {
        ConfirmOrder();
    }

    baseUrl = sessionJson.baseurl;

    GetRecommendation(sessionInfo, function (data) {
        if (data !== null && data.Recommendation !== null && data.Recommendation.DisplayInfo !== null && data.Recommendation.DisplayInfo.ShowFeedback == true && data.Recommendation.DisplayInfo.FeedbackUrl !== null && data.Recommendation.DisplayInfo.FeedbackUrl !== "") {
            $("#loadingMessage").hide();
            $("#acrSelectFrame").show();
            $("#acrSelectFrame").attr("src", data.Recommendation.DisplayInfo.FeedbackUrl);

            GetConfigs(sessionInfo, data, function (configData, data) {
                configurations = configData;
                basePortalUrl = configData.Configuration.CernerBasePortalUrl;
            });
        }
        else {
            GetConfigs(sessionInfo, data, function (configData, data) {
                var results = {};
                results.synonym_id = synonymId;
                results.DSN = dsn;

                results.IndicationText = "";
                if (data.Recommendation.Indications !== null) {
                    for (var i = 0; i < data.Recommendation.Indications.length; i++) {
                        if (i == 0) {
                            results.IndicationText = data.Recommendation.Indications[i].Name;
                        }
                        else {
                            results.IndicationText = results.IndicationText + " ; " + data.Recommendation.Indications[i].Name;
                        }
                    }
                }
                results.AckReason = "";
                results.AckReasonComment = "";

                results.Score = "";
                if (data.Recommendation.Results !== null) {
                    for (var j = 0; j < data.Recommendation.Results.length; j++) {
                        if (data.Recommendation.Results[j].IsRequested === true) {
                            results.Score = data.Recommendation.Results[j].RecommendationText;
                            break;
                        }
                    }
                }

                var sucessCallback = function (examInfo, results, configs) {
                    var newOrder = FormatOrder(JSON.parse(examInfo), results, configs);
                    CloseWindow(newOrder);
                };
                var failCallback = function () {
                    ConfirmOrder();
                };
                GetExamInfo(configData, results, sucessCallback, failCallback);
            });
        }
    });

};

function CloseWindow(reply) {
    CCLEVENT("EVENT_EKS_REPLY", reply.toXML());
    CCLEVENT("EVENT_EKS_OK", "");
};

function viewXMLRecord(reply) {
    return reply.toXML();
};

function CancelOrder() {

    var reply = new EksReply();
    reply.setScratchPadChangeInd(1);
    reply.setCancelOrder(99);
    var sp = reply.getScratchPad();
    sp.setActionFlag(1);
    CloseWindow(reply);
};


function ConfirmOrder() {
    var reply = new EksReply();
    reply.setScratchPadChangeInd(1);
    reply.setCancelOrder(99);
    var sp = reply.getScratchPad();
    sp.setActionFlag(0);

    CloseWindow(reply);
};

function GetRecommendation(sessionInfo, callback) {
    $.ajax({
        type: "GET",
        url: baseUrl + "integration/cerner/session/" + dsn + "/currentrecommendations",
        headers: { 'Authentication': sessionInfo.token },
        async: false,
        contentType: "application/json",
        success: function (data, status, req) {
            callback(data);
        },
        error: function (req, status, error) {
            ConfirmOrder();
        }
    });
};


function GetResults(configs, callback) {

    $.ajax({
        type: "GET",
        url: baseUrl + "api/Integration/CernerOrder/GetOrderData?ids=" + dsn + "&siteId=" + sessionJson.siteid + "&isDsn=true",
        headers: { 'authentication': sessionJson.token },
        async: false,
        success: function (data, status, req) {
            var results = {};
            results.synonym_id = data.Responses[0].CustomerExamId;
            results.DSN = dsn;
            results.IndicationText = data.Responses[0].IndicationText;
            results.Score = data.Responses[0].RecommendationText;
            results.Status = data.Responses[0].OrderStatus;
            if (data.Responses[0].AcknowledgementReason == null) {
                results.AckReason = "";
                results.AckReasonComment = "";
            }
            else {
                results.AckReason = data.Responses[0].AcknowledgementReason.Reason;
                results.AckReasonComment = data.Responses[0].AcknowledgementReason.Comments;
            }
            callback(results, configs);
        },
        error: function (req, status, error) {
            ///TODO Change this logic
            ConfirmOrder();
        }
    });

};

function GetConfigs(sessionInfo, results, callback) {
    $.ajax({
        type: "GET",
        url: baseUrl + "integration/cerner/configurations/",
        headers: { 'Authentication': sessionInfo.token },
        async: false,
        contentType: "application/json",
        success: function (data, status, req) {
            callback(data, results);
        },
        error: function (req, status, error) {
            ConfirmOrder();
        }
    });
};

function GetExamInfo(configs, results, sucessCallback, failCallback) {
    var examRequest = new XMLCclRequest();
    //  Call the ccl progam and send the parameter string
    examRequest.open('GET', "NDSC_GET_EXAM_INFO");
    var parms = "^MINE^,^" + results.synonym_id + "^";
    examRequest.send(parms);

    examRequest.onreadystatechange = function () {
        if (examRequest.readyState == 4 && examRequest.status == 200) {
            if (examRequest.responseText != undefined && examRequest.responseText != null) {
                if (examRequest.responseText == "No Results") {
                    failCallback();
                }
                else {
                    // format the data from the selected orders into the
                    sucessCallback(examRequest.responseText, results, configs);
                }
            }
            else {
                failCallback();
            }

        };   //if (examRequest.readyState == 4 && examInfo.status == 200)

    } //function
};


function FormatOrder(examInfo, results, configs) {
    var newOrderData = "";

    // add the order info to the newOrderData string
    newOrderData += examInfo.mnemonic;
    newOrderData += '%%';
    newOrderData += examInfo.catalog_code;
    newOrderData += '%%';
    newOrderData += examInfo.synonym_code;
    newOrderData += '%%';
    newOrderData += examInfo.oe_format_id;
    newOrderData += '%%';

    var rfeFieldFound = false;
    var rfeFieldConfig = false;
    if (configs.Configuration.CernerRfeQuestionId) {
        rfeFieldConfig = true;
    }

    var detailCounter = 0;
    for (i = 0; i < sessionJson.orders[index].answeredquestions.length; i++) {
        if (detailCounter > 0) {
            newOrderData += '@@';
        }

        newOrderData += sessionJson.orders[index].answeredquestions[detailCounter].oefieldid;
        newOrderData += '~~';
        newOrderData += sessionJson.orders[index].answeredquestions[detailCounter].oefieldmeaning;
        newOrderData += '~~';
        newOrderData += '0.00'; // newOrderData+=newOrderDataObj.NEWORDER.ORDERLIST[0].detaillist[j].oefieldmeaningid;
        newOrderData += '~~';
        if (rfeFieldConfig & sessionJson.orders[index].answeredquestions[detailCounter].oefieldid.toString() === configs.Configuration.CernerRfeQuestionId && results.IndicationText) {
            rfeFieldFound = true;
            newOrderData += results.IndicationText;

        }
        else {
            newOrderData += sessionJson.orders[index].answeredquestions[detailCounter].oefielddisplayvalue;
        }
        newOrderData += '~~';
        newOrderData += sessionJson.orders[index].answeredquestions[detailCounter].oefieldvalue;
        newOrderData += '~~';
        newOrderData += sessionJson.orders[index].answeredquestions[detailCounter].oefielddttmvalue;

        detailCounter++;
    }

    //alert(configs.Configuration.CernerDsnQuestionId);
    if (configs.Configuration.CernerDsnQuestionId) {
        if (detailCounter > 0) {
            newOrderData += '@@';
        }
        detailCounter++;
        newOrderData += configs.Configuration.CernerDsnQuestionId;
        newOrderData += '~~';
        newOrderData += 'OTHER';
        newOrderData += '~~';
        newOrderData += '0.00'; // newOrderData+=newOrderDataObj.NEWORDER.ORDERLIST[0].detaillist[j].oefieldmeaningid;
        newOrderData += '~~';
        newOrderData += dsn;
        newOrderData += '~~';
        newOrderData += '0.00';
        newOrderData += '~~';
        newOrderData += '';
    }
    if (configs.Configuration.CernerScoreQuestionId && results.Score != "") {
        if (detailCounter > 0) {
            newOrderData += '@@';
        }
        detailCounter++;
        newOrderData += configs.Configuration.CernerScoreQuestionId;
        newOrderData += '~~';
        newOrderData += 'OTHER';
        newOrderData += '~~';
        newOrderData += '0.00'; // newOrderData+=newOrderDataObj.NEWORDER.ORDERLIST[0].detaillist[j].oefieldmeaningid;
        newOrderData += '~~';
        newOrderData += results.Score;
        newOrderData += '~~';
        newOrderData += '0.00';
        newOrderData += '~~';
        newOrderData += '';
    }
    if (configs.Configuration.CernerIndicationQuestionId && results.IndicationText) {
        if (detailCounter > 0) {
            newOrderData += '@@';
        }
        detailCounter++;
        newOrderData += configs.Configuration.CernerIndicationQuestionId;
        newOrderData += '~~';
        newOrderData += 'OTHER';
        newOrderData += '~~';
        newOrderData += '0.00'; // newOrderData+=newOrderDataObj.NEWORDER.ORDERLIST[0].detaillist[j].oefieldmeaningid;
        newOrderData += '~~';
        newOrderData += results.IndicationText;
        newOrderData += '~~';
        newOrderData += '0.00';
        newOrderData += '~~';
        newOrderData += '';
    }
    if (configs.Configuration.CernerAckReasonsOEFID && results.AckReason != "") {
        if (detailCounter > 0) {
            newOrderData += '@@';
        }
        detailCounter++;
        newOrderData += configs.Configuration.CernerAckReasonsOEFID;
        newOrderData += '~~';
        newOrderData += 'OTHER';
        newOrderData += '~~';
        newOrderData += '0.00'; // newOrderData+=newOrderDataObj.NEWORDER.ORDERLIST[0].detaillist[j].oefieldmeaningid;
        newOrderData += '~~';
        newOrderData += results.AckReason;
        newOrderData += '~~';
        newOrderData += '0.00';
        newOrderData += '~~';
        newOrderData += '';
    }
    if (configs.Configuration.CernerAckReasonsCommentOEFID && results.AckReasonComment != "") {
        if (detailCounter > 0) {
            newOrderData += '@@';
        }
        detailCounter++;
        newOrderData += configs.Configuration.CernerAckReasonsCommentOEFID;
        newOrderData += '~~';
        newOrderData += 'OTHER';
        newOrderData += '~~';
        newOrderData += '0.00'; // newOrderData+=newOrderDataObj.NEWORDER.ORDERLIST[0].detaillist[j].oefieldmeaningid;
        newOrderData += '~~';
        newOrderData += results.AckReasonComment;
        newOrderData += '~~';
        newOrderData += '0.00';
        newOrderData += '~~';
        newOrderData += '';
    }
    if (!rfeFieldFound && rfeFieldConfig && results.IndicationText) {
        if (detailCounter > 0) {
            newOrderData += '@@';
        }
        detailCounter++;
        newOrderData += configs.Configuration.CernerRfeQuestionId;
        newOrderData += '~~';
        newOrderData += 'REASONFOREXAM';
        newOrderData += '~~';
        newOrderData += '0.00'; // newOrderData+=newOrderDataObj.NEWORDER.ORDERLIST[0].detaillist[j].oefieldmeaningid;
        newOrderData += '~~';
        newOrderData += results.IndicationText;
        newOrderData += '~~';
        newOrderData += '0.00'
        newOrderData += '~~';
        newOrderData += '';
    }

    if (configs.Configuration.CernerRfeDropdownQuestionId && configs.Configuration.CernerRfeDropdownFieldValue && configs.Configuration.CernerRfeDropdownDisplayValue && configs.Configuration.ForceShowFeedbackWhenNoRfeGiven == "True" && results.IndicationText) {
        if (detailCounter > 0) {
            newOrderData += '@@';
        }
        detailCounter++;
        newOrderData += configs.Configuration.CernerRfeDropdownQuestionId;
        newOrderData += '~~';
        newOrderData += 'REASONFOREXAM';
        newOrderData += '~~';
        newOrderData += '0.00'; // newOrderData+=newOrderDataObj.NEWORDER.ORDERLIST[0].detaillist[j].oefieldmeaningid;
        newOrderData += '~~';
        newOrderData += configs.Configuration.CernerRfeDropdownDisplayValue;
        newOrderData += '~~';
        newOrderData += configs.Configuration.CernerRfeDropdownFieldValue
        newOrderData += '~~';
        newOrderData += '';
    }

    // add things to the EksReply
    var newOrderReply = new EksReply();
    newOrderReply.setScratchPadChangeInd(1);
    newOrderReply.setCancelOrder(99);

    var sp = newOrderReply.getScratchPad();
    sp.setActionFlag(1);  // remove the original order from the scratchpad
    var newOrderList = eksCreateOrderables(newOrderData);

    // Add the order back to the scratchpad with updated order details
    for (i = 0; i < newOrderList.length; i++) {
        var orderable = newOrderList[i];
        newOrderReply.appendOrderable(orderable);
    }
    return (newOrderReply);

};


function receiveMessage(event) {

    var acrSelect = ".acrselect.org";
    var careSelect = ".careselect.org";
    var esriGuide = ".esriguide.org";
    if (((event.origin.indexOf(careSelect, (event.origin.length - careSelect.length)) !== -1)
        || (event.origin.indexOf(acrSelect, (event.origin.length - acrSelect.length)) !== -1)
        || (event.origin.indexOf(esriGuide, (event.origin.length - esriGuide.length)) !== -1))
        && event.data === dsn) {

        GetResults(configurations, function (results, configs) {
            if (results.Status === 0) {
                CancelOrder();
            }
            else if (results.Status === 1 && configs.Configuration.ForceShowFeedbackWhenNoRfeGiven == "False") {
                ConfirmOrder();
            }
            else {
                GetExamInfo(configs, results, function (examInfo, results, configs) {
                    var newOrder = FormatOrder(JSON.parse(examInfo), results, configs);
                    CloseWindow(newOrder);
                }, function () {
                    ConfirmOrder();
                });
            }
        });
        return;
    }
    else {
        ConfirmOrder();
    }
};

window.addEventListener("message", receiveMessage, false);