/** Create the component style object which will be used to style various aspects of our component */
function PregDeliverySummaryComponentStyle() {
    //pd - Pregnancy Delivery
    this.initByNamespace("pd");
}

PregDeliverySummaryComponentStyle.inherits(ComponentStyle);

/**
 * @constructor
 * Initialize the Pregnancy Delivery component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function PregDeliverySummaryComponent(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new PregDeliverySummaryComponentStyle());
    //Set the timer names so the architecture will create the correct timers for our use
    this.setComponentLoadTimerName("USR:MPG.PregDeliverySummaryComponent.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PregDeliverySummaryComponent.O1 - render component");

    //Includes the count in the components title bar
    this.setIncludeLineNumber(true);

    //Add a listener so we can refresh the component if pregnancy info updates
    CERN_EventListener.addListener(this, "pregnancyInfoAvailable", this.retrieveComponentData, this);
}

/** Setup the prototype and constructor to inherit from the base MPageComponent object */
PregDeliverySummaryComponent.prototype = new MPageComponent();
PregDeliverySummaryComponent.prototype.constructor = MPageComponent;

/* Supporting functions (get/set functions) */
PregDeliverySummaryComponent.prototype.setAnesthOB = function (anesthOB) {
    this.m_anesthOB = anesthOB;
};
PregDeliverySummaryComponent.prototype.getAnesthOB = function () {
    return this.m_anesthOB;
};
PregDeliverySummaryComponent.prototype.setAnesthType = function (anesthType) {
    this.m_anesthType = anesthType;
};
PregDeliverySummaryComponent.prototype.getAnesthType = function () {
    return this.m_anesthType;
};
PregDeliverySummaryComponent.prototype.setApgar1 = function (apgar1) {
    this.m_apgar1 = apgar1;
};
PregDeliverySummaryComponent.prototype.getApgar1 = function () {
    return this.m_apgar1;
};
PregDeliverySummaryComponent.prototype.setApgar10 = function (apgar10) {
    this.m_apgar10 = apgar10;
};
PregDeliverySummaryComponent.prototype.getApgar10 = function () {
    return this.m_apgar10;
};
PregDeliverySummaryComponent.prototype.setApgar5 = function (apgar5) {
    this.m_apgar5 = apgar5;
};
PregDeliverySummaryComponent.prototype.getApgar5 = function () {
    return this.m_apgar5;
};
PregDeliverySummaryComponent.prototype.setBirthDtTm = function (birthDtTm) {
    this.m_birthDtTm = birthDtTm;
};
PregDeliverySummaryComponent.prototype.getBirthDtTm = function () {
    return this.m_birthDtTm;
};
PregDeliverySummaryComponent.prototype.setBirthWeight = function (birthWeight) {
    this.m_birthWeight = birthWeight;
};
PregDeliverySummaryComponent.prototype.getBirthWeight = function () {
    return this.m_birthWeight;
};
PregDeliverySummaryComponent.prototype.setCervicalLac = function (cervicalLac) {
    this.m_cervicalLac = cervicalLac;
};
PregDeliverySummaryComponent.prototype.getCervicalLac = function () {
    return this.m_cervicalLac;
};
PregDeliverySummaryComponent.prototype.setDeliveryType = function (deliveryType) {
    this.m_deliveryType = deliveryType;
};
PregDeliverySummaryComponent.prototype.getDeliveryType = function () {
    return this.m_deliveryType;
};
PregDeliverySummaryComponent.prototype.setEpiDegree = function (epiDegree) {
    this.m_epiDegree = epiDegree;
};
PregDeliverySummaryComponent.prototype.getEpiDegree = function () {
    return this.m_epiDegree;
};
PregDeliverySummaryComponent.prototype.setEpiMedio = function (epiMedio) {
    this.m_epiMedio = epiMedio;
};
PregDeliverySummaryComponent.prototype.getEpiMedio = function () {
    return this.m_epiMedio;
};
PregDeliverySummaryComponent.prototype.setEpiMidline = function (epiMidline) {
    this.m_epiMidline = epiMidline;
};
PregDeliverySummaryComponent.prototype.getEpiMidline = function () {
    return this.m_epiMidline;
};
PregDeliverySummaryComponent.prototype.setEpiOther = function (epiOther) {
    this.m_epiOther = epiOther;
};
PregDeliverySummaryComponent.prototype.getEpiOther = function () {
    return this.m_epiOther;
};
PregDeliverySummaryComponent.prototype.setEpiPerformed = function (epiPerformed) {
    this.m_epiPerformed = epiPerformed;
};
PregDeliverySummaryComponent.prototype.getEpiPerformed = function () {
    return this.m_epiPerformed;
};
PregDeliverySummaryComponent.prototype.setFeeding = function (feeding) {
    this.m_feeding = feeding;
};
PregDeliverySummaryComponent.prototype.getFeeding = function () {
    return this.m_feeding;
};
PregDeliverySummaryComponent.prototype.setGender = function (gender) {
    this.m_gender = gender;
};
PregDeliverySummaryComponent.prototype.getGender = function () {
    return this.m_gender;
};
PregDeliverySummaryComponent.prototype.setLabialLac = function (labialLac) {
    this.m_labialLac = labialLac;
};
PregDeliverySummaryComponent.prototype.getLabialLac = function () {
    return this.m_labialLac;
};
PregDeliverySummaryComponent.prototype.setNeoComps = function (neoComps) {
    this.m_neoComps = neoComps;
};
PregDeliverySummaryComponent.prototype.getNeoComps = function () {
    return this.m_neoComps;
};
PregDeliverySummaryComponent.prototype.setNeoOutcome = function (neoOutcome) {
    this.m_neoOutcome = neoOutcome;
};
PregDeliverySummaryComponent.prototype.getNeoOutcome = function () {
    return this.m_neoOutcome;
};
PregDeliverySummaryComponent.prototype.setPerinealLac = function (perinealLac) {
    this.m_perinealLac = perinealLac;
};
PregDeliverySummaryComponent.prototype.getPerinealLac = function () {
    return this.m_perinealLac;
};
PregDeliverySummaryComponent.prototype.setPerineumIntact = function (perineumIntact) {
    this.m_perineumIntact = perineumIntact;
};
PregDeliverySummaryComponent.prototype.getPerineumIntact = function () {
    return this.m_perineumIntact;
};
PregDeliverySummaryComponent.prototype.setPeriurethralLac = function (periurethralLac) {
    this.m_periurethralLac = periurethralLac;
};
PregDeliverySummaryComponent.prototype.getPeriurethralLac = function () {
    return this.m_periurethralLac;
};
PregDeliverySummaryComponent.prototype.setSuperficialLac = function (superficialLac) {
    this.m_superficialLac = superficialLac;
};
PregDeliverySummaryComponent.prototype.getSuperficialLac = function () {
    return this.m_superficialLac;
};
PregDeliverySummaryComponent.prototype.setVaginalLac = function (vaginalLac) {
    this.m_vaginalLac = vaginalLac;
};
PregDeliverySummaryComponent.prototype.getVaginalLac = function () {
    return this.m_vaginalLac;
};

/** Removes empty pieces from the array, to be passed as parameter */
PregDeliverySummaryComponent.prototype.RemoveUndefinedFilters = function (array) {
    var events = [];
    for (var i = 0; i < array.length; i++) {
        if (!array[i]) {
            continue;
        }
        events.push(array[i]);
    }
    return events;
};

/* Main rendering functions */
/** Creates the filterMappings that will be used when loading the component's bedrock settings */
PregDeliverySummaryComponent.prototype.loadFilterMappings = function () {
    this.addFilterMappingObject("PREG_DEL_ANESTH_OB_TYPE", {
        setFunction : this.setAnesthOB,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_ANESTH_TYPE", {
        setFunction : this.setAnesthType,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_APGAR_1_MIN", {
        setFunction : this.setApgar1,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_APGAR_10_MIN", {
        setFunction : this.setApgar10,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_APGAR_5_MIN", {
        setFunction : this.setApgar5,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_DT_TM_BIRTH", {
        setFunction : this.setBirthDtTm,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_BIRTH_WT", {
        setFunction : this.setBirthWeight,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_CX_LAC", {
        setFunction : this.setCervicalLac,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_DELIVERY_TYPE", {
        setFunction : this.setDeliveryType,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_EPI_DEGREE", {
        setFunction : this.setEpiDegree,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_EPI_MEDIO", {
        setFunction : this.setEpiMedio,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_EPI_MIDLINE", {
        setFunction : this.setEpiMidline,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_EPI_OTHER", {
        setFunction : this.setEpiOther,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_EPI_PERF", {
        setFunction : this.setEpiPerformed,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_NB_INTAKE_TYPE", {
        setFunction : this.setFeeding,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_GENDER", {
        setFunction : this.setGender,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_LABIAL_LAC", {
        setFunction : this.setLabialLac,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_NEO_COMP", {
        setFunction : this.setNeoComps,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_NEO_OUTCOME", {
        setFunction : this.setNeoOutcome,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_PERINEIAL_LAC", {
        setFunction : this.setPerinealLac,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_PERI_INTACT", {
        setFunction : this.setPerineumIntact,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_PERIURETHRAL_LAC", {
        setFunction : this.setPeriurethralLac,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_SUPER_LAC", {
        setFunction : this.setSuperficialLac,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("PREG_DEL_VAG_LAC", {
        setFunction : this.setVaginalLac,
        type : "ARRAY",
        field : "PARENT_ENTITY_ID"
    });
};

/** This is the PregDeliverySummaryComponent implementation of the retrieveComponentData function. */
PregDeliverySummaryComponent.prototype.retrieveComponentData = function () {
    var criterion = null;
    var messageHTML = "";
    var component = this;
    var pdi18n = i18n.discernabu.pregnancydeliverysummary_o1;
    var pregInfoSR = MP_Resources.getSharedResource("pregnancyInfo");
    var pregInfoObj = null;
    var pregnancyId = 0.0;
    var sendAr = [];
    var request = null;

    // Create the parameter array for our script call
    criterion = this.getCriterion();

    var patientGenderInfo = criterion.getPatientInfo().getSex();
    if (patientGenderInfo === null) {
        messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + pdi18n.GENDER_UNDEFINED + "</span></h3><span class='res-none'>" + pdi18n.GENDER_UNDEFINED + "</span>";
        MP_Util.Doc.FinalizeComponent(messageHTML, this, "(0)");
        return;
    }

    // Check to make sure the patient is a female with an active pregnancy
    if (criterion.getPatientInfo().getSex().meaning !== "FEMALE") {
        // Male patient so just show a disclaimer
        messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + pdi18n.NOT_FEMALE + "</span></h3><span class='res-none'>" + pdi18n.NOT_FEMALE + "</span>";
        MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
        return;
    } else if (pregInfoSR && pregInfoSR.isResourceAvailable()) {
        pregInfoObj = pregInfoSR.getResourceData();
        pregnancyId = pregInfoObj.getPregnancyId();
        if (pregnancyId === -1) {
            // Error occurred while retrieving pregnancy information
            messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + pdi18n.PREG_DATA_ERROR + "</span></h3><span class='res-none'>" + pdi18n.PREG_DATA_ERROR + "</span>";
            MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
            return;
        } else if (!pregnancyId) {
            // Female patient with no active pregnancy.
            messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + pdi18n.NO_ACTIVE_PREG + "</span></h3><span class='res-none'>" + pdi18n.NO_ACTIVE_PREG + "</span>";
            MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
            return;
        } else {
            //Create parameters (sendAr) to send to script
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", pregInfoObj.getLookBack());

            var epiEvents = [];
            var lacEvents = [];
            var anesthEvents = [];
            var otherEvents = [];
            var epiDegree = [];
            var epiMidline = [];
            var epiMedio = [];
            var epiPerformed = [];
            var epiOther = [];
            var perineumIntact = [];
            var cervicalLac = [];
            var perinealLac = [];
            var periurethralLac = [];
            var superficialLac = [];
            var vaginalLac = [];
            var labialLac = [];
            var anesthType = [];
            var anesthOB = [];
            var i;

            epiDegree = component.getEpiDegree();
            if (epiDegree) {
                var epiDegreeLength = epiDegree.length;
                for (i = 0; i < epiDegreeLength; i++) {
                    epiEvents.push(epiDegree[i]);
                }
            }

            epiMidline = component.getEpiMidline();
            if (epiMidline) {
                var epiMidlineLength = epiMidline.length;
                for (i = 0; i < epiMidlineLength; i++) {
                    epiEvents.push(epiMidline[i]);
                }
            }

            epiMedio = component.getEpiMedio();
            if (epiMedio) {
                var epiMedioLength = epiMedio.length;
                for (i = 0; i < epiMedioLength; i++) {
                    epiEvents.push(epiMedio[i]);
                }
            }

            epiPerformed = component.getEpiPerformed();
            if (epiPerformed) {
                var epiPerformedLength = epiPerformed.length;
                for (i = 0; i < epiPerformedLength; i++) {
                    epiEvents.push(epiPerformed[i]);
                }
            }

            epiOther = component.getEpiOther();
            if (epiOther) {
                var epiOtherLength = epiOther.length;
                for (i = 0; i < epiOtherLength; i++) {
                    epiEvents.push(epiOther[i]);
                }
            }

            perineumIntact = component.getPerineumIntact();
            if (perineumIntact) {
                var perineumIntactLength = perineumIntact.length;
                for (i = 0; i < perineumIntactLength; i++) {
                    epiEvents.push(perineumIntact[i]);
                }
            }

            sendAr.push(MP_Util.CreateParamArray(component.RemoveUndefinedFilters(epiEvents), 1));

            cervicalLac = component.getCervicalLac();
            if (cervicalLac) {
                var cervicalLacLength = cervicalLac.length;
                for (i = 0; i < cervicalLacLength; i++) {
                    lacEvents.push(cervicalLac[i]);
                }
            }

            perinealLac = component.getPerinealLac();
            if (perinealLac) {
                var perinealLacLength = perinealLac.length;
                for (i = 0; i < perinealLacLength; i++) {
                    lacEvents.push(perinealLac[i]);
                }
            }

            periurethralLac = component.getPeriurethralLac();
            if (periurethralLac) {
                var periurethralLacLength = periurethralLac.length;
                for (i = 0; i < periurethralLacLength; i++) {
                    lacEvents.push(periurethralLac[i]);
                }
            }

            superficialLac = component.getSuperficialLac();
            if (superficialLac) {
                var superficialLacLength = superficialLac.length;
                for (i = 0; i < superficialLacLength; i++) {
                    lacEvents.push(superficialLac[i]);
                }
            }

            vaginalLac = component.getVaginalLac();
            if (vaginalLac) {
                var vaginalLacLength = vaginalLac.length;
                for (i = 0; i < vaginalLacLength; i++) {
                    lacEvents.push(vaginalLac[i]);
                }
            }

            labialLac = component.getLabialLac();
            if (labialLac) {
                var labialLacLength = labialLac.length;
                for (i = 0; i < labialLacLength; i++) {
                    lacEvents.push(labialLac[i]);
                }
            }

            sendAr.push(MP_Util.CreateParamArray(component.RemoveUndefinedFilters(lacEvents), 1));

            anesthType = component.getAnesthType();
            if (anesthType) {
                var anesthTypeLength = anesthType.length;
                for (i = 0; i < anesthTypeLength; i++) {
                    anesthEvents.push(anesthType[i]);
                }
            }

            anesthOB = component.getAnesthOB();
            if (anesthOB) {
                var anesthOBLength = anesthOB.length;
                for (i = 0; i < anesthOBLength; i++) {
                    anesthEvents.push(anesthOB[i]);
                }
            }

            sendAr.push(MP_Util.CreateParamArray(component.RemoveUndefinedFilters(anesthEvents), 1));

            otherEvents = [component.getBirthDtTm(), component.getGender(), component.getBirthWeight(), component.getNeoOutcome(), component.getNeoComps(), component.getApgar1(), component.getApgar5(), component.getApgar10(), component.getFeeding(), component.getDeliveryType()];
            var otherEventsLength = otherEvents.length;
            for (i = 0; i < otherEventsLength; i++) {
                sendAr.push(MP_Util.CreateParamArray(otherEvents[i], 1));
            }

            request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
            request.setProgramName("MP_GET_DELIVERY_SUMMARY");
            request.setParameters(sendAr);
            request.setAsync(true);

            MP_Core.XMLCCLRequestCallBack(this, request, function (reply) {
                component.renderComponent(reply);
            });
        }
    }
};

/** Attempt to format number passed */
PregDeliverySummaryComponent.prototype.formatNumber = function (num) {
    var resultDisplay;
    var nf = MP_Util.GetNumericFormatter();

    try {
        resultDisplay = nf.format(num);
    } catch (err) {
        resultDisplay = num;
    }
    return resultDisplay;
};

/**
 * Checks if the result string is empty. If so, returns '--', if not, returns the result string.
 */
PregDeliverySummaryComponent.prototype.checkForResults = function (result) {
    return result || "--";
};

/**
 * Takes in the JSON data the CCL script returns, formats it and checks for empty fields, then returns the edited JSON data.
 */
PregDeliverySummaryComponent.prototype.processResultsForRender = function (recordData) {
    var resultLength = recordData.BABIES.length;
    var df = MP_Util.GetDateFormatter();
    var dI18n = i18n.discernabu.pregnancydeliverysummary_o1;

    // Uses the JSON data to create the row above the component table
    recordData.ANESTHESIA = "<span class='pd-label'>" + dI18n.ANESTHESIA + ":</span> " + "<span class='pd-content'>" + this.checkForResults(recordData.ANESTHESIA) + "</span>";
    recordData.EPISIOTOMY = "<span class='pd-label'>" + dI18n.EPISIOTOMY + ":</span> " + "<span class='pd-content'>" + this.checkForResults(recordData.EPISIOTOMY) + "/" + this.checkForResults(recordData.LACERATION) + "</span>";

    // Goes through each baby's delivery information and formats as necessary
    for (var result = 0; result < resultLength; result++) {
        
        var baby = recordData.BABIES[result];
        
        if (baby) {
            // Goes through each piece of information of the current baby
            for (var property in baby) {
                if (baby.hasOwnProperty(property)) {
                    switch (property)
                    {
                        case "DELIVERY_DT_TM":
                            // DateTime gets formatted to DD/MM/YY HH:MM, with the time as a gray color
                            baby[property] = (baby[property]) ? df.formatISO8601(baby[property], mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR) : "--";
                            if (baby[property] != "--")
                            {
                                var dateArray = baby[property].split(" ", 2);
                                dateArray[1] = "<span class='pd-label'>" + dateArray[1] + "</span>";
                                baby[property] = dateArray.join(" ");
                            }
                            break;
                        case "EGA_AT_DELIVERY":
                            // EGA gets formatted as "--w --d"
                            var ega_weeks = Math.floor(baby[property] / 7);
                            var ega_days = (baby[property] % 7);
                            baby[property] = (baby[property] > 0) ? (ega_weeks + dI18n.WEEK + " " + ega_days + dI18n.DAY) : "--";
                            break;
                        case "WEIGHT":
                            // Weight gets formatted with proper unit label
                            baby[property] = (baby[property] > 0) ? this.formatNumber(baby[property]) + baby.WEIGHT_UNITS : "--";
                            break;
                        default:
                            // Everything else gets checked for empty results
                            baby[property] = this.checkForResults(baby[property]);
                    }
                }
            }
        }
    }
    return recordData;
};

/**
 * This is the Delivery Summary implementation of the renderComponent function.
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 */
PregDeliverySummaryComponent.prototype.renderComponent = function (reply) {
    var compId = this.getComponentId();
    var component = this;
    var timerRenderComponent = null;
    var recordData = null;
    var babyTable = null;
    var replyStatus = "";
    var messageHTML = "";
    var dI18n = i18n.discernabu.pregnancydeliverysummary_o1;
    var errMsg = [];
    var numberResults = null;
    var decimalConst = 10;
        
    try {
        timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());
        replyStatus = reply.getStatus();
        if (replyStatus !== "S") {
            if (replyStatus === "F") {
                errMsg.push(reply.getError());
                this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("<br />")), "");
            } else {
                messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + dI18n.NO_DELIVERIES + "</span></h3><span class='res-none'>" + dI18n.NO_DELIVERIES + "</span>";
                MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
            }
            CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
                count : 0
            });
            return;
        }

        recordData = this.processResultsForRender(reply.getResponse());

        if (!recordData) {
            return;
        }
        if (recordData.BABIES.length <= 0) {
            messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + dI18n.NO_DELIVERIES + "</span></h3><span class='res-none'>" + dI18n.NO_DELIVERIES + "</span>";
            MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
            return;
        }

        numberResults = recordData.BABIES.length;

        // Creates the component table to use for displaying the delivery summary information
        babyTable = new ComponentTable();
        babyTable.setNamespace(this.getStyles().getId());
        babyTable.setCustomClass("pd-delivery-table");

        // Set up the baby label column that uses recordData.BABIES.LABEL_NAME as the data source
        var labelColumn = new TableColumn();
        labelColumn.setColumnId("LABEL_NAME");
        labelColumn.setCustomClass("pd-cells pd-small");
        labelColumn.setColumnDisplay(dI18n.BABY_LABEL);
        labelColumn.setRenderTemplate('${LABEL_NAME}');
        labelColumn.setIsSortable(true);
        labelColumn.setPrimarySortField("LABEL_NAME");

        // Set up the delivery date/time column that uses recordData.BABIES.DELIVERY_DT_TM as the data source
        var deliveryDateColumn = new TableColumn();
        deliveryDateColumn.setColumnId("DELIVERY_DATE");
        deliveryDateColumn.setCustomClass("pd-cells pd-med");
        deliveryDateColumn.setColumnDisplay(dI18n.DELIVERY_DATE);
        deliveryDateColumn.setRenderTemplate('${DELIVERY_DT_TM}');

        // Set up the pregnancy outcome column that uses recordData.BABIES.OUTCOME as the data source
        var outcomeColumn = new TableColumn();
        outcomeColumn.setColumnId("PREG_OUTCOME");
        outcomeColumn.setCustomClass("pd-cells pd-large");
        outcomeColumn.setColumnDisplay(dI18n.PREG_OUTCOME);
        outcomeColumn.setRenderTemplate('${OUTCOME}');

        // Set up the gender column that uses recordData.BABIES.GENDER as the data source
        var genderColumn = new TableColumn();
        genderColumn.setColumnId("GENDER");
        genderColumn.setCustomClass("pd-cells pd-small");
        genderColumn.setColumnDisplay(dI18n.SEX);
        genderColumn.setRenderTemplate('${GENDER}');

        // Set up the delivery EGA column that uses recordData.BABIES.EGA_AT_DELIVERY as the data source
        var egaColumn = new TableColumn();
        egaColumn.setColumnId("EGA_AT_DELIVERY");
        egaColumn.setCustomClass("pd-cells pd-small");
        egaColumn.setColumnDisplay(dI18n.EGA_AT_DELILVERY);
        egaColumn.setRenderTemplate('${EGA_AT_DELIVERY}');

        // Set up the neonate outcome column that uses recordData.BABIES.NEONATE_OUTCOME as the data source
        var neoColumn = new TableColumn();
        neoColumn.setColumnId("NEONATE_OUTCOME");
        neoColumn.setCustomClass("pd-cells pd-small");
        neoColumn.setColumnDisplay(dI18n.NEONATE_OUTCOME);
        neoColumn.setRenderTemplate('${NEONATE_OUTCOME}');

        // Set up the weight column that uses recordData.BABIES.WEIGHT as the data source
        var weightColumn = new TableColumn();
        weightColumn.setColumnId("WEIGHT");
        weightColumn.setCustomClass("pd-cells pd-small");
        weightColumn.setColumnDisplay(dI18n.WEIGHT);
        weightColumn.setRenderTemplate('${WEIGHT}');

        // Set up the APGAR score column that uses recordData.BABIES.APGAR1 & APGAR5 & APGAR10 as the data sources
        var apgarColumn = new TableColumn();
        apgarColumn.setColumnId("APGAR_SCORE");
        apgarColumn.setCustomClass("pd-cells pd-small");
        apgarColumn.setColumnDisplay(dI18n.APGAR_SCORE);
        apgarColumn.setRenderTemplate('${APGAR1}/${APGAR5}/${APGAR10}');

        // Set up the complications column that uses recordData.BABIES.COMPLICATIONS as the data source
        var compliColumn = new TableColumn();
        compliColumn.setColumnId("FETAL_COMPS");
        compliColumn.setCustomClass("pd-cells pd-xlarge");
        compliColumn.setColumnDisplay(dI18n.FETAL_COMPS);
        compliColumn.setRenderTemplate('${COMPLICATIONS}');

        // Set up the feeding column that uses recordData.BABIES.FEEDING as the data source
        var feedingColumn = new TableColumn();
        feedingColumn.setColumnId("FEEDING");
        feedingColumn.setCustomClass("pd-cells pd-med");
        feedingColumn.setColumnDisplay(dI18n.FEEDING);
        feedingColumn.setRenderTemplate('${FEEDING}');

        // Add all of the columns to the table
        babyTable.addColumn(labelColumn);
        babyTable.addColumn(deliveryDateColumn);
        babyTable.addColumn(outcomeColumn);
        babyTable.addColumn(genderColumn);
        babyTable.addColumn(egaColumn);
        babyTable.addColumn(neoColumn);
        babyTable.addColumn(weightColumn);
        babyTable.addColumn(apgarColumn);
        babyTable.addColumn(compliColumn);
        babyTable.addColumn(feedingColumn);

        // Bind the JSON data to the table, add in the number of results to the component title, and finalize the HMTL
        babyTable.bindData(recordData.BABIES);
        babyTable.sortByColumnInDirection("LABEL_NAME", TableColumn.SORT.ASCENDING);
        var countText = MP_Util.CreateTitleText(component, numberResults);
        MP_Util.Doc.FinalizeComponent(recordData.ANESTHESIA + recordData.EPISIOTOMY + babyTable.render(), component, countText);

        // Adds CSS class to deal with scrolling when the table is wider than the window
        $('#pdContent' + compId).addClass('pd-scrollable');
        
        // A slight jQuery hack to make all of the column divider lines of a row the same height if some cells word-wrap
        $("#" + babyTable.getNamespace() + "table").find('dl').each(function () {
            var maxHeight = 0;
            $(this).children('dd').each(function () {
                var currentHeight = parseInt($(this).outerHeight(true), decimalConst);
                if (currentHeight > maxHeight) {
                    maxHeight = currentHeight; // since it is changed to use border-box we dont need to remove padding from height
                }
            });
            $(this).children('dd').css('height', maxHeight);
        });
        
    } catch (err) {
        if (timerRenderComponent) {
            timerRenderComponent.Abort();
            timerRenderComponent = null;
        }
        MP_Util.LogJSError(this, err, "pregnancydeliverysummary.js", "renderComponent");
        //Throw the error to the architecture
        throw err;
    } finally {
        if (timerRenderComponent) {
            timerRenderComponent.Stop();
        }
    }
};

/**
 * Map the object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "PREG_DELIVERY" filter
 */
MP_Util.setObjectDefinitionMapping("PREG_DELIVERY", PregDeliverySummaryComponent);
