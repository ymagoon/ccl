define(['services/datacontext', 'mpages/script_request', 'jquery'], function (dataContext, ScriptRequest, $) {

    /**
    *   Cache the Deferred executor for patient population. This prevents calling script
    *   thrice.
    */
    var patientPopulationExecutor = null;

    /**
    * Sorts by the element LISTSEQ in numerical order. Returns less than 0 or greater than 0.
    * @param {Integer} seq Value from the element LISTSEQ.
    * @param {Integer} a Sort variable called a.
    * @param {Integer} b Sort variable called b.
    * @return {Integer}
    */
    function sortBySequence(patientListA, patientListB) {
        return (patientListA.LISTSEQ < patientListB.LISTSEQ) ? -1 : ((patientListA.LISTSEQ > patientListB.LISTSEQ) ? 1 : 0);
    }

    /**
    *   Replaces special characters when the HTML code for them is stored
    *   @method replaceSpecialCharacters
    *   @param {Array} list
    *   @param {Object} item - The property of the object that contains characters to replace
    */
    function replaceSpecialCharacters(list, item) {
        var strValue = "";
        for (var i = list.length; i--; ) {
            strValue = list[i][item];
            //Carriage return / New Line
            strValue = strValue.replace(/&#13;/gi, '\n\r');
            //Whitespace
            strValue = strValue.replace(/&#32;/gi, ' ');
            //!
            strValue = strValue.replace(/&#33;/gi, '!');
            //"
            strValue = strValue.replace(/&#34;/gi, '"');
            //#
            strValue = strValue.replace(/&#35;/gi, '#');
            //$
            strValue = strValue.replace(/&#36;/gi, '$');
            //%
            strValue = strValue.replace(/&#37;/gi, '%');
            //&
            strValue = strValue.replace(/&#38;/gi, '&');
            //'
            strValue = strValue.replace(/&#39;/gi, "'");
            //(
            strValue = strValue.replace(/&#40;/gi, '(');
            //)
            strValue = strValue.replace(/&#41;/gi, ')');
            //*
            strValue = strValue.replace(/&#42;/gi, '*');
            //+
            strValue = strValue.replace(/&#43;/gi, '+');
            //,
            strValue = strValue.replace(/&#44;/gi, ',');
            //-
            strValue = strValue.replace(/&#45;/gi, '-');
            //.
            strValue = strValue.replace(/&#46;/gi, '.');
            //
            strValue = strValue.replace(/&#47;/gi, '/');
            //:
            strValue = strValue.replace(/&#58;/gi, ':');
            //;
            strValue = strValue.replace(/&#59;/gi, ';');
            //<
            strValue = strValue.replace(/&#60;/gi, '<');
            //=
            strValue = strValue.replace(/&#61;/gi, '=');
            //>
            strValue = strValue.replace(/&#62;/gi, '>');
            //?
            strValue = strValue.replace(/&#63;/gi, '?');
            //@
            strValue = strValue.replace(/&#64;/gi, '@');
            //[
            strValue = strValue.replace(/&#91;/gi, '[');
            //\
            strValue = strValue.replace(/&#92;/gi, '\\');
            //]
            strValue = strValue.replace(/&#93;/gi, ']');
            //^
            strValue = strValue.replace(/&#94;/gi, '^');
            //_
            strValue = strValue.replace(/&#95;/gi, '_');
            //`
            strValue = strValue.replace(/&#96;/gi, '`');
            //{
            strValue = strValue.replace(/&#123;/gi, '{');
            //|
            strValue = strValue.replace(/&#124;/gi, '|');
            //}
            strValue = strValue.replace(/&#125;/gi, '}');
            //~
            strValue = strValue.replace(/&#126;/gi, '~');
            list[i][item] = strValue;
        }

        strValue = null;
    }

    /***
    *   Retrieves the MyPopulation views for a particular person
    */
    function getMyPopulations() {
        var sendAr = ["^MINE^," + CERN_params.personnelId + ".0,^RX_WLIST^"];
        var request = new ScriptRequest("ENG:MPG.MY_POPULATIONS - load data");
        request.setProgramName("inn_mp_getMyPopulations");
        request.setParameters(sendAr);
        request.setAsync(true);
        return dataContext.executeScript(request);
    }

    function getHighRiskCategeoryDescriptions() {
        var sendAr = ["^MINE^"];
        var request = new ScriptRequest("ENG:MPG.HIGH_RISK_CATEGORIES_LIST - load data");
        request.setProgramName("rx_mp_get_high_risk_cat_desc");
        request.setParameters(sendAr);
        request.setAsync(true);
        request.cacheResult(true);
        return dataContext.executeScript(request);
    }

    function getPatientPopulationInfo() {
        //Note: the topic mean is specific for each project. In this example the topic mean
        //is MP_RPH_WORKLIST which is used by the Mpage Clinical Pharmacist Worklist.

        var topicMean = "^MP_RPH_WORKLIST^";
        var sendAr = ["^MINE^", topicMean, "0", CERN_params.personnelId + ".0"];

        if (patientPopulationExecutor && patientPopulationExecutor.state() === "pending")
            return patientPopulationExecutor;

        var request = new ScriptRequest("ENG:MPG.PATIENT_POPULATION - load data");
        request.setProgramName("inn_mp_get_wrklist");
        request.setParameters(sendAr);
        request.setAsync(true);
        request.cacheResult(true);
        patientPopulationExecutor = dataContext.executeScript(request);
        return patientPopulationExecutor;
    }

    function isPatientQualifiedForHRC(patientQualifierJSON) {
        var sendAr = ["^MINE^"];
        var deferred = $.Deferred();
        if (patientQualifierJSON) {
            var request = new ScriptRequest("ENG:MPG.QUALIFIED_PATIENTS - load data");
            request.setProgramName("dc_mp_getHighRiskCategories");
            request.setParameters(sendAr);
            request.setRequestBlobIn(patientQualifierJSON);
            request.setAsync(true);
            dataContext.executeScript(request)
            .done(function (reply) {
                if (reply.RECORD_DATA.STATUS_DATA.STATUS === "S") {
                    deferred.resolve(reply.RECORD_DATA);
                } else {
                    deferred.reject({ error: reply.RECORD_DATA.STATUS_DATA, data: reply });
                }
            })
            .fail(function (response) {
                deferred.reject({ error: response, data: request });
            });
        } else {
            deferred.reject({ error: patientQualifierJSON, data: patientQualifierJSON });
        }

        return deferred;
    }

    function getHRCDetailsForPatients(qualifiedPatientInformation) {
        var sendAr = ["^MINE^"];
        var deferred = $.Deferred();
        if (qualifiedPatientInformation) {
            var request = new ScriptRequest("ENG:MPG.QUALIFIED_PATIENT_DATA - load data");
            request.setProgramName("dc_mp_getHighRiskCatRes");
            request.setParameters(sendAr);
            request.setRequestBlobIn(qualifiedPatientInformation);
            request.setAsync(true);
            dataContext.executeScript(request)
            .done(function (reply) {
                if (reply.RECORD_DATA.STATUS_DATA.STATUS === "S") {
                    deferred.resolve(reply.RECORD_DATA);
                } else {
                    deferred.reject({ error: reply.RECORD_DATA.STATUS_DATA, data: reply });
                }
            })
            .fail(function (response) {
                deferred.reject({ error: response, data: request });
            });

        } else {
            deferred.reject({ error: patientQualifierJSON, data: patientQualifierJSON });
        }

        return deferred;
    }

    function callSaveMyPopulationView(cclParams, viewJSON) {
        var request = new ScriptRequest("ENG:MPG.SAVE_MYPOPULATION - load data");
        request.setProgramName("eks_add_advsr_event");
        request.setParameters(cclParams);
        request.setAsync(false);
        request.setRequestBlobIn(viewJSON);
        return dataContext.executeScript(request);
    }

    var getPatientsList = function () {
        var deferred = $.Deferred();

        getPatientPopulationInfo().done(function (data) {
            var isFirstListDefault = false;
            var listReply = data.LISTREPLY;

            try {
                if (listReply && listReply.STATUS_DATA.STATUS === "S") {
                    var ptLIST = JSON.parse(JSON.stringify(listReply.PTLIST)); // create a deep copy
                    var patientList = null;
                    //Verify patient population. If BWPTPOP is
                    // 1 = use only Powerchart Patient List
                    // 3 = Utilize both Powerchart Patient List Functionality and Facility and Nurse Unit selections.
                    if (listReply.PTCNT > 0 && listReply.BWPTPOP != 2) {
                        // get the patient list and sort it by LISTSEQ
                        replaceSpecialCharacters(ptLIST, "LISTNM");
                        patientList = ptLIST.sort(function (a, b) { return sortBySequence(a, b); });

                        // check if the first element must be set as the default list
                        isFirstListDefault = (listReply.BWDEFPOP == 1);
                    }
                    // resolve the request
                    deferred.resolve(patientList, isFirstListDefault);
                } else {
                    if (listReply)
                        deferred.reject({ error: listReply.STATUS_DATA, data: data });
                    else
                        deferred.reject({ error: data });
                }
            } catch (error) {
                deferred.reject({ error: error, data: data });
            }
        })
            .fail(function (response) {
                deferred.reject({ error: response });
            });

        return deferred;
    };


    var getFacilitiesList = function () {
        var deferred = $.Deferred();

        getPatientPopulationInfo().done(function (data) {
            var autoLoadFacilitySearchResults = false;
            var facilitiesList = null;
            var listReply = data.LISTREPLY;

            try {

                if (listReply && listReply.STATUS_DATA.STATUS === "S") {
                    var fuQual = JSON.parse(JSON.stringify(listReply.FUQUAL));  // create a deep copy, as this data is cached and we don't want to impact the master list
                    //Verify patient population. If BWPTPOP is
                    //2 = Only utilize Facility and Nurse Unit selections.
                    //3 = Utilize both Powerchart Patient List Functionality and Facility and Nurse Unit selections.
                    if (listReply.FUCNT > 0 && listReply.BWPTPOP != 1) {
                        // get the facilities list
                        replaceSpecialCharacters(fuQual, "ORGNAME");
                        facilitiesList = fuQual;

                        //Verify WTS location.
                        //1 = WTS location is active.

                        //Verify if there is a default population.
                        //2 = Utilize the WTS location for the user.
                        if (listReply.BWWTS == 1 && listReply.BWDEFPOP == 2) {
                            autoLoadFacilitySearchResults = true;
                        }
                    }
                    // resolve the request
                    deferred.resolve(facilitiesList, autoLoadFacilitySearchResults);
                } else {
                    if (listReply)
                        deferred.reject({ error: listReply.STATUS_DATA, data: data });
                    else
                        deferred.reject({ error: data });
                }
            } catch (error) {
                deferred.reject({ error: error, data: data });
            }
        })
            .fail(function (response) {
                deferred.reject({ error: response });
            });


        return deferred;
    };

    var getMyViews = function () {
        var deferred = $.Deferred();

        getMyPopulations().done(function (data) {
            var autoLoadFacilitySearchResults = false;
            var listReply = data.MYPOPLIST;
            try {
                if (listReply && listReply.STATUS_DATA.STATUS === "S") {
                    var popQual = listReply.MYPOPQUAL;
                    var myPopReply = {};
                    var defaultView = null;
                    var myViewList = null;
                    if (listReply.MYPOPCNT > 0) {
                        // get the facilities list
                        for (var i = listReply.MYPOPCNT; i--; ) {
                            popQual[i].MYPOPJSON = popQual[i].MYPOPJSON.replace(/\^/gi, '"');
                            popQual[i].MYPOPJSON = JSON.parse(popQual[i].MYPOPJSON);
                            myPopReply = popQual[i].MYPOPJSON.LISTREPLY;
                            for (var j = myPopReply.PTCNT; j--; ) {
                                replaceSpecialCharacters(myPopReply.PTLIST, "LISTNM");
                            }

                            if (myPopReply.DISPLAYDEFAULT !== 0) {
                                defaultView = popQual[i];
                            }
                        }
                    }
                    myViewList = popQual;
                    // resolve the request
                    deferred.resolve(myViewList, defaultView);
                } else {
                    if (listReply)
                        deferred.reject({ error: listReply.STATUS_DATA, data: data });
                    else
                        deferred.reject({ error: data });
                }
            } catch (error) {
                deferred.reject({ error: error, data: data });
            }
        })
            .fail(function (response) {
                deferred.reject({ error: response });
            });


        return deferred;
    };

    var saveMyPopulationView = function (cclParams, viewJSON) {
        var deferred = $.Deferred();
        callSaveMyPopulationView(cclParams, viewJSON).done(function (data) {
            try {
                if (data.REPLY.STATUS_DATA.STATUS === "S") {
                    deferred.resolve(data);
                } else {
                    deferred.reject({ error: data.REPLY.STATUS_DATA, data: data });
                }
            } catch (err) {
                deferred.reject({ error: err });
            }

        })
        .fail(function (response) {
            deferred.reject({ error: response });
        });

        return deferred;
    };

    var getHighRiskCatDescriptions = function () {
        var deferred = $.Deferred();

        getHighRiskCategeoryDescriptions().done(function (data) {

            var highRiskCatDescList = data.HIGHRISKCATDESCLIST;
            try {
                if (highRiskCatDescList.STATUS_DATA.STATUS === "S") {
                    var hrcDescQual = highRiskCatDescList.HRCDESCQUAL;
                    // resolve the request
                    deferred.resolve(hrcDescQual);
                } else {
                    deferred.reject({ error: highRiskCatDescList.STATUS_DATA, data: data });
                }
            } catch (err) {
                deferred.reject({ error: err, data: data });
            }
        })
            .fail(function (response) {
                deferred.reject({ error: response });
            });

        return deferred;
    };

    var getPatientQualifierSettings = function () {
        var deferred = $.Deferred();

        getPatientPopulationInfo().done(function (data) {
            var qualifierSettings = null;
            var listReply = data.LISTREPLY;
            try {
                if (listReply.STATUS_DATA.STATUS === "S") {
                    qualifierSettings = { ORGSEC: data.LISTREPLY.ORGSEC, BWTOPICMEAN: data.LISTREPLY.BWTOPICMEAN, BWPTPOP: data.LISTREPLY.BWPTPOP, BWWTS: data.LISTREPLY.BWWTS };
                    deferred.resolve(qualifierSettings);
                } else {
                    deferred.reject({ error: listReply.STATUS_DATA, data: data });
                }
            } catch (error) {
                deferred.reject({ error: error, data: data });
            }
        })
            .fail(function (response) {
                deferred.reject({ error: response });
            });

        return deferred;
    };


    function saveStickyNote(stickyNote, personId) {
        var uFlag = 1;
        var strSNID = "0.0";
        var deferred = $.Deferred();
        // If SNID > 0, it means that the note already exists and a modified version is being saved
        if (stickyNote) {
            if (stickyNote.SNID > 0) {
                uFlag = 2;
                strSNID = stickyNote.SNID + ".0";
            }

            var sendAr = ["^MINE^", uFlag, strSNID, stickyNote.SNTYPEMEAN, stickyNote.SNTYPECV + ".0", personId + ".0", "^PERSON^", "^" + stickyNote.SNTEXT + "^"];

            var request = new ScriptRequest("ENG:MPG.SAVE_STICKY_NOTE - load data");
            request.setProgramName("dc_mp_upd_sticky_note");
            request.setParameters(sendAr);
            request.setAsync(true);
            request.cacheResult(false);
            var scriptExecution = dataContext.executeScript(request);
            scriptExecution.done(function (reply) {
                if (reply.REPLY.STATUS_DATA.STATUS === "S") {
                    deferred.resolve(reply.REPLY);
                } else {
                    deferred.reject({ error: reply.REPLY.STATUS_DATA, data: reply });
                }
            })
            .fail(function (response) {
                deferred.reject({ error: response, data: request });
            });
        } else {
            deferred.reject({ error: stickyNote, data: stickyNote });
        }

        return deferred;
    }

    function deleteStickyNote(stickyNote, personId) {
        var uFlag = 0;
        var strSNID = "0.0";
        var deferred = $.Deferred();

        if (stickyNote) {
            if (stickyNote.SNID > 0) {
                strSNID = stickyNote.SNID + ".0";
                var sendAr = ["^MINE^", uFlag, strSNID, stickyNote.SNTYPEMEAN, stickyNote.SNTYPECV + ".0", personId + ".0", "^PERSON^", "^" + stickyNote.SNTEXT + "^"];
                var request = new ScriptRequest("ENG:MPG.SAVE_STICKY_NOTE - load data");
                request.setProgramName("dc_mp_upd_sticky_note");
                request.setParameters(sendAr);
                request.setAsync(true);
                request.cacheResult(false);
                var scriptExecution = dataContext.executeScript(request);
                scriptExecution.done(function (reply) {
                    if (reply.REPLY.STATUS_DATA.STATUS === "S") {
                        deferred.resolve(reply.REPLY);
                    } else {
                        deferred.reject({ error: reply.REPLY.STATUS_DATA, data: reply });
                    }
                })
                .fail(function (response) {
                    deferred.reject({ error: response, data: request });
                });
            } else {
                deferred.reject({ error: stickyNote.SNID, data: stickyNote });
            }
        } else {
            deferred.reject({ error: stickyNote, data: stickyNote });
        }

        return deferred;
    }

    var dataService =
    {
        // List all exposed service functions here
        getQualifiedPatients: isPatientQualifiedForHRC,
        getHRCDetailsForPatients: getHRCDetailsForPatients,
        getMyViews: getMyViews,
        getHighRiskCatDescriptions: getHighRiskCatDescriptions,
        getPatientsList: getPatientsList,
        getFacilitiesList: getFacilitiesList,
        saveMyPopulationView: saveMyPopulationView,
        getPatientQualifierSettings: getPatientQualifierSettings,
        saveStickyNote: saveStickyNote,
        deleteStickyNote: deleteStickyNote
    };

    return dataService;
});