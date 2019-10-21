/**
* Project: mp_clin_sum_comp.js
* Version 1.0.0.0
*/
var restAPIClient = new XMLHttpRequest();
function ClinicalSummaryComponentStyle() {
    this.initByNamespace("cs");
}

ClinicalSummaryComponentStyle.inherits(ComponentStyle);

function ClinicalSummaryComponent(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new ClinicalSummaryComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.CLINICALSUMMARY.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.CLINICALSUMMARY.O1 - render component");
    this.m_apptId = 0.0;
    this.m_templateID = [];
    this.m_DocType = 0.0;
    this.m_PublishButtonLabel = "";
    this.m_DisplaySaveButton = true;

    ClinicalSummaryComponent.method("InsertData", function () {
        //if there are multiple appointment associated for the encounter
        if (criterion.encntrs.length > 0) {
            if (criterion.encntrs[0].APPOINTMENT.length > 1) {
                CLINICAL_SUMMARY_O1.AppointmentDialog(this);
            }
            else {
                if (criterion.encntrs[0].APPOINTMENT.length === 1)
                    this.m_apptId = criterion.encntrs[0].APPOINTMENT[0].SCH_EVENT_ID;

                CLINICAL_SUMMARY_O1.GetData(this);
            }
        }
        else {
            CLINICAL_SUMMARY_O1.GetData(this);
        }

    });
    ClinicalSummaryComponent.method("HandleSuccess", function (recordData) {
        CLINICAL_SUMMARY_O1.RenderComponent(this, recordData);
    });
    ClinicalSummaryComponent.method("SetAppointmentID", function (value) {
        this.m_apptId = value;
    });
    ClinicalSummaryComponent.method("GetAppointmentID", function () {
        return (this.m_apptId)
    });
    ClinicalSummaryComponent.method("setTemplateIds", function (value) {
        this.m_templateID = value;
    });
    ClinicalSummaryComponent.method("GetTemplateIds", function () {
        return (this.m_templateID)
    });
    ClinicalSummaryComponent.method("setDocType", function (value) {
        this.m_DocType = value;
    });
    ClinicalSummaryComponent.method("GetDocType", function () {
        return (this.m_DocType)
    });
    ClinicalSummaryComponent.method("setPublishButtonLabel", function (value) {
        this.m_PublishButtonLabel = value;
    });
    ClinicalSummaryComponent.method("getPublishButtonLabel", function () {
        return (this.m_PublishButtonLabel)
    });
    ClinicalSummaryComponent.method("setDisplaySaveButton", function (value) {
        this.m_DisplaySaveButton = value;
    });
    ClinicalSummaryComponent.method("getDisplaySaveButton", function () {
        return (this.m_DisplaySaveButton)
    });
}

ClinicalSummaryComponent.inherits(MPageComponent);

var CLINICAL_SUMMARY_O1 = function () {
    /*Theses are unique code given to section, these values are coming within CDA*/
    var ALLERGY_CODE = "48765-2";
    var PROBLEM_CODE = "11450-4";
    var MEDICATION_CODE = "10160-0";
    var IMMUN_CODE = "11369-6";
    var PROC_CODE = "47519-4";
    var RESULT_CODE = "30954-2";
    var VITAL_CODE = "8716-3";
    var SOCIAL_HIST_CODE = "29762-2";
    var MED_ADMIN_CODE = "29549-3";
    var INST_CODE = "69730-0";

    // Using this to store the saved XML we get back from CAMM
    var savedXmlDoc = new ActiveXObject("Microsoft.XMLDOM");

    // Using this to store the newly create XML
    var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");

    // Using this to store the XSL
    var xslDoc = new ActiveXObject("Microsoft.XMLDOM");
    
    // This object will be used in the entire file to store the updated/merged XML elements.  
    var $objXMLElements;
    var objTR = {};
    var objTRContentID = {};
    var sectionToBeDeselected = [];
    var deselectedItems = [];
    var deselectedGroups = [];
    var deselectedRowIds = [];
    var mediaIdentifier = "";
    var mediaVersion = 1;
    var id = [];
    var strXML = "";
    var tempComp;
    var CCDTitle = "";
    var reportId = 0.0;
    var CAMM_URL = "";
    var SERVICE_DIR_URL = "";
    var addDocpriv = 1;
    var instSectionChanged = false;
    var instructionsUpdated = false;
    var editorInstance = null;
    var ownershipKeyValue = "";
    var bAppointmentCancel = false;
    var displaySaveAs = 1;
    var publishButtonLabel = "";
    var displaySaveButton = true;
    var saveCCD = false;
    var appointmentID = 0.0;
    var unselectedSectionSavedInCCD = [];
    var staticContentPath = "";
    var docExistsInCamm = false;
    var loadingIndicator = {
        show: function () {
            if ($('#loading-indicator').length === 0) { //if loading indicator doesn't already exist
                $('body').append('<div id="loading-indicator"></div>');
            }
            $('#loading-indicator').show();
        },
        hide: function () {
            setTimeout(function () {
                $('#loading-indicator').hide();
            }, 100); //wait to hide the loading-indicator to absorb all the clicks on the page
        }
    };
    var identifiers = { // These are the unique identifier's for each section and rather checking with section name we can use these.
        Encounter: ['2.16.840.1.113883.10.20.22.2.22.1', '2.16.840.1.113883.10.20.22.2.22'],
        ReasonForVisit: ['2.16.840.1.113883.10.20.22.2.12'],
        VitalSigns: ['2.16.840.1.113883.10.20.22.2.4', '2.16.840.1.113883.10.20.22.2.4.1'],
        ProblemList: ['2.16.840.1.113883.10.20.22.2.5', '2.16.840.1.113883.10.20.22.2.5.1'],
        Allergies: ['2.16.840.1.113883.10.20.22.2.6.1'],
        Medications: ['2.16.840.1.113883.10.20.22.2.1', '2.16.840.1.113883.10.20.22.2.1.1'],
        Results: ['2.16.840.1.113883.10.20.22.2.3', '2.16.840.1.113883.10.20.22.2.3.1'],
        MedicationsAdministered: ['2.16.840.1.113883.10.20.22.2.38'],
        Immunizations: ['2.16.840.1.113883.10.20.22.2.2', '2.16.840.1.113883.10.20.22.2.2.1'],
        EncounterProcedures: ['2.16.840.1.113883.10.20.22.2.7.1'],
        SocialHistory: ['2.16.840.1.113883.10.20.22.2.17'],
        AssessmentPlan: ['2.16.840.1.113883.10.20.22.2.9'],
        Instructions: ['2.16.840.1.113883.10.20.22.2.45']
    };
    var startTime = new Date();
    var timers = {
        xmlToHtml: { timerName: "Xml to Html Time : ", startTime: "", endTime: "" },
        ccdFromFsi: { timerName: "CCD Creation Time : ", startTime: "", endTime: "" },
        xmlFromCamm: { timerName: "Xml From Camm Time : ", startTime: "", endTime: "" },
        mpageLoadTime: { timerName: "MPage Total Load Time :", startTime: "", endTime: "" },
        spinnerTimeInRenderComponent: { timerName: "Spinner Display Time while Rendering Component :", startTime: "", endTime: "" },
        checkCcdExist: { timerName: "Check CCD Exist Time :", startTime: "", endTime: "" },
        createNewCcd: { timerName: "New CCD Creation Time :", startTime: "", endTime: "" },
        spinnerTimeInCreateNewCcd: { timerName: "Spinner Display Time while Creation of New CCD :", startTime: "", endTime: "" }
    };

    var bModifiedFlag = true;
    var instructionsBuild = {
        showPatientEducation: false,
        showFollowUp: false
    };
    var newFsiMediaId;
    var bPrintPatEdViaFirstNet = false;
    var PRINTCCD = 1;
    var PRINTPREVIEW = 2;
    function setPanelHeight() {
        $(window).resize(function () {
            var h = gvs();
            var hei = h[0];
            var width = h[1];
            var maxWidth = 260; // Maximum width of window upto which TOC is seen completely without horizontal scroll bar
            var maxHeight = 537; // Maximum height of window upto which TOC is seen completely without vertical scroll bar
            var minHeight = 290; // Minimum height of window upto which TOC down-arrow is seen for the vertical scroll bar. 
            // Couldn't see the all sections in the TOC if the window height is below "290" so reduced the TOC height to 30%

            $("#mainDiv").height(hei + "px");
            $("#toc").hover(function () {
                $toc = $(this);
                if (hei < maxHeight && width < maxWidth) {
                    if (hei < minHeight) {
                        $toc.css({ "height": "30%", "width": "45%", "overflow": "auto" });
                    } else {
                        $toc.css({ "height": "45%", "width": "45%", "overflow": "auto" });
                    }
                }
                else if (hei < maxHeight && width > maxWidth) {
                    if (hei < minHeight) {
                        $toc.css({ "height": "30%", "width": "180px", "overflow": "auto" });
                    } else {
                        $toc.css({ "height": "45%", "width": "180px", "overflow": "auto" });
                    }
                }
                else if (hei > maxHeight && width > maxWidth) {
                    $toc.css({ "height": "400px", "width": "180px", "overflow": "auto" });
                }
                else if (hei > maxHeight && width < maxWidth) {
                    $toc.css({ "height": "400px", "width": "45%", "overflow": "auto" });
                }
            }, function () {
                if ($toc.scrollTop() !== 0) {
                    $toc.scrollTop(0);
                }
                $toc.css({ "height": "40px", "width": "40px", "overflow": "hidden" });
            });
        });
    }

    function resetAllValues() {
        //reset all values
        SetModifiedFlag(false);
        objTR = {};
        objTRContentID = {};
        sectionToBeDeselected = [];
        deselectedRowIds = [];
        mediaIdentifier = "";
        mediaVersion = 1;
        id = [];
        strXML = "";
        CCDTitle = "";
        reportId = 0.0;
        instSectionChanged = false;
        instructionsUpdated = false;
        ownershipKeyValue = "";
        bAppointmentCancel = false;
        docExistsInCamm = false;
        displaySaveAs = 1;
        publishButtonLabel = "";
        saveCCD = false;
        appointmentID = 0.0;
        unselectedSectionSavedInCCD = [];
        deselectedItems = [];
        deselectedGroups = [];
        bPrintPatEdViaFirstNet = false;

        if (editorInstance) {
            editorInstance.destroy();
        }
        editorInstance = null;
    }

    function documentEvents() {

        /**
        * NOTE: function names are tightly coupled to buttons' IDs (eg: click handler for #xyz is xyzClickHandler)
        */
        var criterion = tempComp.getCriterion();
        var metaData = [{ key: "User ID", value: criterion.provider_id },
                        { key: "Patient ID", value: criterion.person_id },
                        { key: "Encounter ID", value: criterion.encntr_id}];
        var clickHandlers = {
            cmdSaveAsClickHandler: function () {
	            createCheckpoint("USR:MPG.CS.SAVE VISIT SUMMARY LOCALLY", "Start", metaData);
                var $self = $(this);
                setTimeout(function () {
                    CLINICAL_SUMMARY_O1.SaveAsFile();
                    $self.prop('disabled', false);
                    loadingIndicator.hide();
                }, 10);
            },
            cmdSubmitClickHandler: function () {
	            createCheckpoint("USR:MPG.CS.SIGN VISIT SUMMARY", "Start", metaData);
                saveCCD = false;
                SetModifiedFlag(false);
                setTimeout(CLINICAL_SUMMARY_O1.SubmitCCD, 10); //artificial delay to give wait cursor enough time to show
            },
            cmdSaveClickHandler: function () {
	            createCheckpoint("USR:MPG.CS.SAVE VISIT SUMMARY", "Start", metaData);
                saveCCD = true;
                SetModifiedFlag(false);
                setTimeout(CLINICAL_SUMMARY_O1.SaveCCD, 10); //artificial delay to give wait cursor enough time to show
            },
            cmdCreateNewClickHandler: function () {
                createCheckpoint("USR:MPG.CS.CREATE NEW VISIT SUMMARY", "Start", metaData);
                var summaryI18n = i18n.discernabu.clinical_summary_o1;
                createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
                var isConfirmed = confirm(summaryI18n.CREATE_NEW_CONFIRM_MSG);
	            createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop",[{ key: "VS Dialog", value: "CREATE NEW CONFIRM MSG"}]);
                if (isConfirmed) {
                    resetAllValues();

                    EnableSignDisablePrint();
                    $("div#clin-sum").html("<div class='loadingSpan'></div>");
                    $("div.loadingSpan").show();
                    timers.spinnerTimeInCreateNewCcd.startTime = GetCurrentDate() / 1000;

                    var sendAr = [];
                    var reportTemplateId = tempComp.GetTemplateIds();

                    appointmentID = tempComp.GetAppointmentID() > 0.0 ? tempComp.GetAppointmentID() : 0.0;

                    if (reportTemplateId.length > 0) {
                        var templateId = "value(" + reportTemplateId.join(".0,") + ".0)";
                    } else {
                        var templateId = "value(0.0)";
                    }

                    //getting the new CCD
                    sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.ppr_cd + ".0", templateId, appointmentID + ".0", criterion.provider_id + ".0", true);
                    var request = new MP_Core.ScriptRequest(tempComp, tempComp.getComponentLoadTimerName());
                    request.setProgramName("mp_clinical_ccd");
                    request.setParameters(sendAr);
                    request.setAsync(true);
                    timers.createNewCcd.startTime = GetCurrentDate() / 1000;
                    MP_Core.XMLCCLRequestCallBack(tempComp, request, CLINICAL_SUMMARY_O1.CreateNewCCD);
                }
                loadingIndicator.hide();
                $(this).prop('disabled', false);
            },
            cmdPrintClickHandler: function () {
	            createCheckpoint("USR:MPG.CS.PRINT VISIT SUMMARY", "Start", metaData);
                var $self = $(this);
                setTimeout(function () { //giving enough time for wait cursor to show and button to disable
                    PrintCCD(PRINTCCD); // This is the option to print the hard copy of the CCD directly
                    loadingIndicator.hide();
                    $self.prop('disabled', false);
                }, 10);
            }
        };
        $('#cmdPrintOption').click(function (e) {
            e.stopPropagation();
            $("#printOptionDropDownDiv").toggleClass("show");
            $(this).prop('disabled', false);
        });

        $("#patEduChk").click(function () {
            EnableSignDisablePrint();
            SetModifiedFlag(true);
        });

        $("#trPrint").add("#trPrintPreview").click(function () {
	        var criterion = tempComp.getCriterion();
	        var metaData = [{ key: "User ID", value: criterion.provider_id },
                            { key: "Patient ID", value: criterion.person_id },
                            { key: "Encounter ID", value: criterion.encntr_id }];
	        createCheckpoint("USR:MPG.CS.PRINT VISIT SUMMARY", "Start", metaData);
            var selfId = $(this).attr('id'),
                printCcdOptions = { //tightly coupled to the id of the tr that's clicked
                    'trPrint': PRINTCCD,   // This is the option to print the hard copy of the CCD
                    'trPrintPreview': PRINTPREVIEW   // this option is just for seeing the preview of Visit summary
                };

            $("#printOptionDropDownDiv").toggleClass("show");
            loadingIndicator.show();
            setTimeout(function () { //giving enough time for wait cursor to show and button to disable
                 PrintCCD(printCcdOptions[selfId]); 
                loadingIndicator.hide();
            }, 10);
        });

        $("body").click(function () {
            $("#printOptionDropDownDiv").removeClass("show");
        });

        $("#footerButtonDiv .divButtonStyle").mouseover(function () {
            if (!$(this).prop("disabled")) {
                $(this).css("background-color", "#D0D0D0");
            }
        }).mouseout(function () {
            $(this).css("background-color", "#E1E3E5");
        }).click(function (e) {
            var $self = $(this),
                selfId = $self.attr('id'),
                clickHandlerFunctionName = selfId + "ClickHandler";

            if ($self.prop('disabled')) { return false; } //click has no effect if button is disabled

            if (typeof clickHandlers[clickHandlerFunctionName] === "function") { //if a clickhandler exists for the button that was clicked
                $self.prop('disabled', true).trigger('mouseout'); //triggering mouseout to un-hover the button (so that its highlighting goes away)
                loadingIndicator.show(); //hiding of the loadingIndicator is handled in the clickHandlers uniquely for each button
                clickHandlers[clickHandlerFunctionName].call($self, e);
            }
        });
    }

    function EnableSignDisablePrint() {
        $("#cmdSave").prop('disabled', false);
        $("#cmdSubmit").prop('disabled', false);
        $("#cmdPrint").prop('disabled', true);
        $("#cmdSaveAs").prop('disabled', true);

        $("#cmdPrintOption").prop('disabled', true);
    }

    function DisableSignDisablePrint() {
        $("#cmdSave").prop('disabled', true);
        $("#cmdSubmit").prop('disabled', true);
        $("#cmdPrint").prop('disabled', true);
        $("#cmdSaveAs").prop('disabled', true);

        $("#cmdPrintOption").prop('disabled', true);
    }

    // Function to merge the existing 
    function mergeXmls() {
        // We'll use xmlDoc and savedXmlDoc here
        var summaryI18n = i18n.discernabu.clinical_summary_o1;

        var removableContentIdArray = [], removableHeaderTextArray = [], removableParagraphIdArray = [], removableTableIdArray = [], removableTableGroupArray = [];

        // Newly created XML
        var strXML = $.parseXML(xmlDoc.xml);

        //Saved XML
        var savedXMLString = $.parseXML(savedXmlDoc.xml);
        $savedXMLElements = $(savedXMLString);

        // Search for all the deselected checkboxes within section headers
        $savedXMLElements.find("title").each(function () {
            var sectionTitleText = $(this).text();
            if (sectionTitleText.indexOf("DEL_") > -1) {
                removableHeaderTextArray.push(sectionTitleText.slice(4));
            }
        });

        // Replace all the section header titles and add DEL_
        $(strXML).find("section").each(function () {
            var titleText = $(this).find("title").text();
            for (var i = 0; i < removableHeaderTextArray.length; i++) {
                if (titleText === removableHeaderTextArray[i]) {
                    titleText = "DEL_" + titleText;
                }
            }
            $(this).find("title").text(titleText);
        });

        // Search for all the deselected checkboxes within sections
        $savedXMLElements.find("section").each(function () {
            $(this).find("content").each(function () {
                var contentId = $(this).attr("ID");
                if (contentId) {
                    if (contentId.indexOf("DEL_") > -1) {
                        removableContentIdArray.push(contentId.slice(4));
                    }
                }
            });
        });

        // Replace all the content IDs in the new XML and add DEL_
        $(strXML).find("section").each(function () {
            for (var i = 0; i < removableContentIdArray.length; i++) {
                $(this).find('content').each(function () {
                    var contentId = $(this).attr("ID");
                    if (contentId === removableContentIdArray[i]) {
                        $(this).attr("ID", "DEL_" + contentId);
                    }
                });
            }
        });

        // Search for all the deselected checkboxes within paragrahs in sections
        $savedXMLElements.find("section").each(function () {
            $(this).find("paragraph").each(function () {
                var paragraphId = $(this).attr("ID");
                if (paragraphId) {
                    if (paragraphId.indexOf("DEL_") > -1) {
                        removableParagraphIdArray.push(paragraphId.slice(4));
                    }
                }
            });
        });

        // Replace all the paragraph IDs in the new XML and add DEL_
        $(strXML).find("section").each(function () {
            for (var i = 0; i < removableParagraphIdArray.length; i++) {
                $(this).find('paragraph').each(function () {
                    var paragraphId = $(this).attr("ID");
                    if (paragraphId === removableParagraphIdArray[i]) {
                        $(this).attr("ID", "DEL_" + paragraphId);
                    }
                });
            }
        });

        // Search for all the deselected checkboxes within table in sections
        $savedXMLElements.find("section").find("tr").each(function () {
            var trId = $(this).attr("ID");
            if (trId && trId.indexOf("DEL_") > -1) {
                removableTableIdArray.push(trId.slice(4));
            }
        });
        var removableTableLength = removableTableIdArray.length;
        // Replace all the tr IDs in the new XML and add DEL_
        $(strXML).find("section").each(function () {
            for (var i = 0; i < removableTableLength; i++) {
                $(this).find('tr').each(function () {
                    var trId = $(this).attr("ID");
                    if (trId === removableTableIdArray[i]) {
                        $(this).attr("ID", "DEL_" + trId);
                    }
                });
            }
        });
        // Search for all the Group tags within table in sections
        $savedXMLElements.find("section").find("table").each(function () {
            var tableId = $(this).attr("ID");
            if (tableId && tableId.indexOf("DEL_") > -1) {
                removableTableGroupArray.push(tableId.slice(4));
            }
        });
        var removableTableGroupLength = removableTableGroupArray.length;
        // Replace all the table IDs in the new XML and add DEL_
        $(strXML).find("section").find("table").each(function () {
            var trId = $(this).attr("ID");
            for (var i = 0; i < removableTableGroupLength; i++) {
                if (trId === removableTableGroupArray[i]) {
                    $(this).attr("ID", "DEL_" + trId);
                }
            }
        });


        // Replace all the comments in the new XML from the previous XML
        $savedXMLElements.find("section").each(function () {
            var templateId = $(this).find("templateId").attr('root');
            if ($.inArray(templateId, identifiers.Instructions) > -1) {
                var ns = $(this).get(0).namespaceURI;
                var commentExists = false;
                var commentsPara = xmlDoc.createNode(1, "paragraph", ns);
                var headerContent = xmlDoc.createNode(1, "content", ns);

                $(headerContent).attr("styleCode", "Bold").text(summaryI18n.COMMENTS);

                $(commentsPara).append(headerContent);

                $(this).find("paragraph").each(function () {
                    $(this).find("content").each(function () {
                        var contentID = $(this).attr("ID");

                        if (contentID !== undefined && contentID.indexOf("FREETEXT_") > -1) {
                            commentExists = true;
                            var commentsContent = xmlDoc.createNode(1, "content", ns);
                            $(commentsContent).attr("ID", contentID);
                            var data = xmlDoc.createTextNode($(this).text());
                            $(commentsContent).append(data);
                            $(commentsContent).append(xmlDoc.createNode(1, "br", ns));
                            $(commentsPara).append(commentsContent);
                        }
                    });
                });

                // Find the instructions section in the new XML and append the comments
                $(strXML).find("section").each(function () {
                    var templateId = $(this).find("templateId").attr('root');
                    if ($.inArray(templateId, identifiers.Instructions) > -1) {
                        var parentText = $(this).find("text");
                        if (commentExists) {
                            $(parentText).append($(commentsPara));
                        }
                    }
                });
            }
        });

        //  This function is to remove the text from the pat edu  
        //when titles and text is configured in clinical view manager
        $(strXML).find("section").each(function () {
            var flagForTitle = "";
            var templateId = $(this).find("templateId").attr('root');
            if ($.inArray(templateId, identifiers.Instructions) > -1) {
                $(this).find("content").each(function () {
                    var contentID = $(this).attr("ID");
                    switch (contentID) {
                        case "SCRIPT.XR_CUST_DISCH_INFO":
                            flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO";
                            break;
                        case "SCRIPT.XR_CUST_DISCH_INFO_TITLE":
                            flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO_TITLE";
                            break;
                        case "SCRIPT.XR_CUST_FOLLOWUP_TXT":
                            pushFollowUp = true;
                            break;
                    }
                });
                if (flagForTitle === "SCRIPT.XR_CUST_DISCH_INFO") {
                    $(this).find("paragraph").each(function () {
                        var $paragraph = $(this);
                        if ($paragraph.find("content").attr("styleCode") === "Bold") {
                            //If condition is to identify the paragraphs which has titles inside content tag having attribute bold so that it should not qualify for remove.
                            //This is to differentiate between between normal text and title in paragraph. We have to remove normal text in the paragraph
                        }
                        else if ($paragraph.text() !== "No data available for this section") {
                            //This is an exception case where normal text = "No data available for this section" needs to be retained while remove others
                            $paragraph.remove();
                        }
                    });
                }
            }
        });

        // Copy the modified XML string and use it everywhere when applying checkboxes and doing other operations.
        $objXMLElements = $(strXML);

        // If document existed in CAMM we need to
        if (docExistsInCamm) {
            // Copy the merged xml string to write it off to CAMM
            var ccdXML = new ActiveXObject("Microsoft.XMLDOM");
            ccdXML.async = false;
            ccdXML = strXML;

            mediaIdentifier = "";
            mediaVersion = 1;
            saveCCD = true;
            CLINICAL_SUMMARY_O1.SaveToCAMMArchive(ccdXML);

            // Get the media ID of the last saved document from CAMM and update document_info with that.
            GetMediaOfLastDoc();

            $("#cmdSave").prop('disabled', false);
        }

    }
    function GetMediaOfLastDoc() {

        var criterion = tempComp.getCriterion();
        var person_id = criterion.person_id;
        var encntr_id = criterion.encntr_id;
        var url = CAMM_URL;
        var mediaAPI = "media?";

        /*Get the Media  */
        var getURL = url + mediaAPI + "personId=" + person_id + "&encounterId=" + encntr_id;

        restAPIClient.open("GET", getURL, false);
        window.location = "javascript:MPAGES_SVC_AUTH(restAPIClient)";
        restAPIClient.send(null);

        if (restAPIClient.readyState === 4 && restAPIClient.status === 200) {
            var mediaReply = json_parse(restAPIClient.responseText);
            if (mediaReply.length === 0) {
                return;
            }

            var mediaObj = mediaReply[0];
            for (var i = 1, il = mediaReply.length; i < il; i++) {
                var mediaTestObj = mediaReply[i];
                var serviceDate = new Date(mediaObj.serviceDate * 1000);
                var serviceTestDate = new Date(mediaTestObj.serviceDate * 1000);
                if (serviceDate < serviceTestDate) {
                    mediaObj = mediaTestObj;
                }
            }

            for (var cr = 0, crl = mediaObj.crossReference.length; cr < crl; cr++) {
                if (mediaObj.crossReference[cr].parentEntityName === "DOCUMENT_ID" || mediaObj.crossReference[cr].parentEntityName === "ClinicalSummaryPub") {
                    return;
                } else if (mediaObj.crossReference[cr].parentEntityName === "APPOINTMENT") { //This means CCD is saved once, as APPOINTMENT cross ref is added only on save

                    // Getting the Media ID from CAMM - this is the media ID of the document on top which is the merged XML
                    var mediaIdentifier = mediaObj.identifier;
                    var mediaVersion = mediaObj.version;

                    //Update the media ID in FSI doc_info tables
                    UpdateDocumentInfo(mediaIdentifier, newFsiMediaId);
                    return;
                }
            }
        } else if (restAPIClient.readyState === 4 && restAPIClient.status !== 200) {
            alert(summaryI18n.CREATE_ERROR);
        }
    };
    // Replace the prevMediaId in FSI which is the media ID of the newly created ccd with the new media ID which is saved in CAMM
    // @newMediaId - media ID from CAMM
    // @prevMediaId - media ID of the generated doc in doc_info which will be replaced by the media ID of merged XML from CAMM
    function UpdateDocumentInfo(newMediaId, prevMediaId) {
        var sendAr = [];
        var criterion = tempComp.getCriterion();
        sendAr.push("^MINE^", "^" + prevMediaId + "^", "^" + newMediaId + "^");
        var request = new MP_Core.ScriptRequest(tempComp, tempComp.getComponentLoadTimerName());
        request.setProgramName("upd_document_wrapper");
        request.setParameters(sendAr);
        request.setAsync(true);
        MP_Core.XMLCCLRequestCallBack(tempComp, request, function (reply) {
            var replyStatus = reply.getStatus();
            if (replyStatus === "S" || replyStatus === "Z") {
                MP_Util.LogInfo("CLINICAL SUMMARY : Updated the document info table successfully.");
            }
        });
    }
    function DisableSignEnablePrint() {
        $("#cmdSave").prop('disabled', true);
        $("#cmdSubmit").prop('disabled', true);
        $("#cmdPrint").prop('disabled', false);
        $("#cmdSaveAs").prop('disabled', false);

        $("#cmdPrintOption").prop('disabled', false);
    }

    /*  Replaces existing IE8 and appends IE 9 Tag to the head sections
    @html The html content for print preview
    */
    function appendHeadTagForIE9(html) {
        var head = html.indexOf("<head>");
        html = html.replace(/<meta http-equiv="x-ua-compatible" content="IE=8">/i, '');
        html = html.substring(0, head)
                                + '<head>'
                                + '<meta http-equiv="x-ua-compatible" content="IE=9">'
                                + html.substring(head + "<head>".length);
        return html;
    }

    /* Checks if the current rendering browser is IE9 or above
    navigator.appVersion would return something like this
    "4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; 
    Media Center PC 6.0; InfoPath.3; MS-RTC LM 8; .NET CLR 1.1.4322; .NET4.0C; .NET4.0E)"

    index #2 gets the browser version 
    */
    function isIE9() {
        var browserDetails = navigator.appVersion.split(";");
        return browserDetails.length > 1 ? parseInt(browserDetails[1].split(" ")[2], 10) >= 9 : 0;
    }

    /*  Add the footer content to the table footer
    @footerString Footer details of the patient
    */
    function addFooterContent(footerString) {
        return '<tfoot>'
                    + '<tr><td>&nbsp;</td></tr>' /* to leave space above the footer */
                    + '<tr><td>' + footerString + '</td></tr>'
               + '</tfoot>';
    }

    /*  Wraps the HTML in header, body, footer format to print the header and footer on every page.
    Splits the sections into rows whenever there is a page-break.
    IE-8 ignores the header & footer when there is a force page-break. (For ex: the Medications section) Splitting it into multiple rows wraps it again
    @html The html content for print preview
    @footerString Footer details of the patient
    */
    function addTableElements(html, footerString) {
        var indexOfBody = html.indexOf("<body>");
        html = html.substring(0, indexOfBody)
                            + '<body>'
                            + '<table>'
                            + addFooterContent(footerString)
                            + '<tbody>'
                            + '<tr><td>'
                            + html.substring(indexOfBody + "<body>".length);

        var indexOfEndBody = html.indexOf("</body>");
        html = html.substring(0, indexOfEndBody)
                                + '</td></tr>'
                                + '</tbody>'
                                + '</table>'
                                + html.substring(indexOfEndBody);

        html = html.split('<div class="page-break">').join('</td></tr><tr><td>' + '<div class="page-break">');

        return html;
    }

    /*  Removes the Wrap and Document divs as the sections (with a page-break) should be split into multiple rows.
    @html The html content for print preview
    */
    function removeWrapAndDocumentDivs(html) {
        var lastIndexOfDiv;
        var div = '</div>';
        var divLength = '</div>'.length;

        html = html.replace('<div class="wrap">', '');
        lastIndexOfDiv = html.lastIndexOf(div);
        html = html.substring(0, lastIndexOfDiv) + html.substring(lastIndexOfDiv + divLength);

        html = html.replace('<div class="document">', '');
        lastIndexOfDiv = html.lastIndexOf(div);
        html = html.substring(0, lastIndexOfDiv) + html.substring(lastIndexOfDiv + divLength);

        return html;
    }

    /*  Prevents the footer overlap by wrapping the entire content into tables. 
    @html The html content for print preview
    @footerString Footer details of the patient
    */
    function preventFooterOverlap(html, footerString) {
        html = removeWrapAndDocumentDivs(html);
        html = addTableElements(html, footerString);
        return isIE9() ? appendHeadTagForIE9(html) : html;
    }

    function PrintCCD(printOption) {
        try {
            var modifiedCCDHTML = CLINICAL_SUMMARY_O1.xmlToHTML();
            var footerString = '';
            var completeCCDHTML;
            var summaryI18n = i18n.discernabu.clinical_summary_o1;
            
            if (modifiedCCDHTML !== "") {
                var dateDOB = '';
                var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                var criterion = tempComp.getCriterion();
                var patName = criterion.getPatientInfo().getName() !== "" ? criterion.getPatientInfo().getName() : "";

                if (criterion.getPatientInfo().getDOB() !== "") {
                    dateDOB = criterion.getPatientInfo().getDOB();
                }

                var DOB = summaryI18n.DOB + ": " + dateDOB;

                var sex = summaryI18n.SEX + ": ";
                if (criterion.getPatientInfo().getSex() !== null) {
                    sex = sex.concat(criterion.getPatientInfo().getSex().display !== "" ? criterion.getPatientInfo().getSex().display : "");
                }


                var MRN = criterion.getPatientInfo().getMRN() !== "" ? criterion.getPatientInfo().getMRN() : "";
                MRN = summaryI18n.MRN + ": " + MRN;

                footerString = "<table id='footer'><tr><td class='comp-td-left'>" + patName + "</td><td class='comp-td-right'>" + DOB + "</td>"
							+ "<td class='comp-td-left'>" + sex + "</td><td class='comp-td-right'>" + MRN + "</td></tr></table>"; //This is the variable which contains footer string.

                completeCCDHTML = preventFooterOverlap(modifiedCCDHTML, footerString);

                var personId = criterion.person_id;
                var encntrId = criterion.encntr_id;

                // when "Instructions Title and Text" is configured in the ClinicalViewManager.exe 
                // On print the API  PVFRAMEWORKLINK prints the Patient Education titles via Visit Summary component and title with text shall be printed via the FirstNet component
                if (printOption === PRINTCCD) { // This is the option to print the hard copy of the CCD
                    var fwObj1 = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");

                    fwObj1.PrintCCD2(bPrintPatEdViaFirstNet, personId, encntrId, completeCCDHTML);

                    setTimeout(function () {  // Reset the default printer (must be done once this function finishes, hence the Timeout)
                        fwObj1.FinishPrinting();
                    }, 100);
                }
                else if (printOption === PRINTPREVIEW) {// this option is just for seeing the preview of Visit summary
                    var fwObj = window.external.DiscernObjectFactory("PVCCD");
                    fwObj.PrintOption = printOption; 
                    fwObj.HTMLString = completeCCDHTML;
                    fwObj.PrintCCD();
                }

                /*SI DOC Info loggings*/
                CLINICAL_SUMMARY_O1.SiLoggingAndAuditEvent(1);
                createCheckpoint("USR:MPG.CS.PRINT VISIT SUMMARY", "Stop", [{ key: "Media ID", value: mediaIdentifier }]);
            }
        }
        catch (err) {
            MP_Util.LogInfo("CLINICAL SUMMARY :" + err.message);
        }
    }

    function SelectDeselectCheckbox(secTitle, select, elementClass) {
        var classMatcher = 'span[class="' + secTitle + '"]';
        var oParent = $(classMatcher).closest("div");

        /*Deselecting rows*/
        if (select === false) {
            switch (elementClass) {
                case "comp_td_checkbox":
                    var tempArr = [];
                    $(oParent).find("table td").each(function () {
                        //de select the rows for the component
                        $(this).find("input.comp_td_checkbox").attr("checked", false);
                        var tableContentID = $(this).find("span:first").attr("ID");
                        if (tableContentID != null && $.inArray(tableContentID, deselectedRowIds) === -1) {
                            deselectedRowIds.push(tableContentID);
                        }
                    });
                    break;
                case "comp_para_checkbox":
                    $(oParent).find("input.comp_para_checkbox").each(function () {
                        $(this).attr("checked", false);
                        var paragraphContentId = $(this).closest("p").find("span:first").attr("ID");
                        if (paragraphContentId != null && $.inArray(paragraphContentId, deselectedRowIds) === -1) {
                            deselectedRowIds.push(paragraphContentId);
                        }
                    });
                    break;
            }
        }
        /*Selecting rows*/
        else {
            switch (elementClass) {
                case "comp_td_checkbox":
                    {
                        $(oParent).find("table td").each(function () {
                            $(this).find("input.comp_td_checkbox").attr("checked", true);
                            var tableContentID = $(this).find("span:first").attr("ID");
                            if (tableContentID != null) {
                                var tableIDPosition = $.inArray(tableContentID, deselectedRowIds);
                                if (tableIDPosition > -1) {
                                    deselectedRowIds.splice(tableIDPosition, 1);
                                }
                            }
                        });
                        break;
                    }
                case "comp_para_checkbox":
                    {
                        $(oParent).find("input.comp_para_checkbox").each(function () {
                            $(this).attr("checked", true);
                            var paragraphContentId = $(this).closest("p").find("span:first").attr("ID");
                            if (paragraphContentId != null) {
                                var paragraphIdPosition = $.inArray(paragraphContentId, deselectedRowIds);
                                if (paragraphIdPosition > -1) {
                                    deselectedRowIds.splice(paragraphIdPosition, 1);
                                }
                            }
                        });
                        break;
                    }
            }
        }
    }


    //This function is to deselect the check boxes that has ITEM_ tag while rendering.

    function deselectCheckBoxes() {
        $(".section_title").find("a").each(function () {
            $(this).closest("div").each(function () {
                $(this).find('[id^=ITEM_]').each(function () {
                    var itemId = $(this).attr("ID");
                    if ($.inArray(itemId, deselectedItems) > -1) {
                        if ($(this).find("input.comp_item_checkbox").is(':checked') != false) {
                            $(this).find("input.comp_item_checkbox").attr("checked", false);
                        }

                        if ($(this).find("input.comp_itemParagraph_checkbox").is(':checked') != false) {
                            $(this).find("input.comp_itemParagraph_checkbox").attr("checked", false);
                        }
                        if ($(this).find("input.comp_itemTr_checkbox").is(':checked') != false) {
                            $(this).find("input.comp_itemTr_checkbox").attr("checked", false);
                        }
                        if ($(this).find("input.comp_itemList_checkbox").is(':checked') != false) {
                            $(this).find("input.comp_itemList_checkbox").attr("checked", false);
                        }
                    }

                });


            });
        });
    }

    // This Function is to apply check boxes based on Item_ and Group_ tags
    function ApplyItemCheckBoxes() {

        var arrSectionName = [];
        var checkboxValue = "checked";
        var sectionUnChecked = [];

        $objXMLElements.find("section").each(function () {
            var title = $(this).find("title").text();
            $(this).find("content").each(function () {
                var contentId = $(this).attr("ID");

                if (contentId != null) {

                    var itemFound = contentId.search(/ITEM_/);

                    if (itemFound > -1) {
                        if ($.inArray(title, arrSectionName) === -1) {
                            if (title.indexOf("DEL_") > -1) {
                                if ($.inArray(title.slice(4), arrSectionName) === -1) {
                                    arrSectionName.push(title.slice(4));
                                }
                            }
                            else
                                arrSectionName.push(title);
                        }
                    }

                }
            });

            $(this).find("paragraph").each(function () {
                var paragraphId = $(this).attr("ID");

                if (paragraphId != null) {

                    var itemFound = paragraphId.search(/ITEM_/);

                    if (itemFound > -1) {
                        if ($.inArray(title, arrSectionName) === -1) {
                            if (title.indexOf("DEL_") > -1) {
                                if ($.inArray(title.slice(4), arrSectionName) === -1) {
                                    arrSectionName.push(title.slice(4));
                                }
                            }
                            else
                                arrSectionName.push(title);

                        }
                    }

                }
            });

            //Don't delete this code this is TO-DO in Future.

            // This is useful when we have items with Item_ tags
            /*  $(this).find("item").each(function () {
            var itemId = $(this).attr("ID");
  
            if (itemId != undefined || itemId != null) {
  
            var itemFound = itemId.search(/ITEM_/);
  
            if (itemFound > -1) {
            if ($.inArray(title, arrSectionName) == -1) {
            arrSectionName.push(title);
            }
            }
  
            }
            }); */

            $(this).find("tr").each(function () {
                var trId = $(this).attr("ID");

                if (trId != null) {

                    var itemFound = trId.search(/ITEM_/);

                    if (itemFound > -1) {
                        if ($.inArray(title, arrSectionName) === -1) {
                            arrSectionName.push(title);
                        }
                    }

                }
            });
        });
        for (var cnt = 0, secLen = arrSectionName.length; cnt < secLen; cnt++) {
            var classMatcher = 'span[class="' + arrSectionName[cnt] + '"]';
            var oParent = $(classMatcher).closest("div");
            var sectionTitleUnchecked = arrSectionName[cnt];
            var sectionUnCheckedFlag = false;
            $(oParent).find('[id^=DEL_ITEM_]').each(function () {
                var tempid = $(this).attr("ID");
                $(this).attr("ID", tempid.slice(4));
            });

            $(oParent).find('[id^=DEL_GROUP_]').each(function () {
                var tempid2 = $(this).attr("ID");
                $(this).attr("ID", tempid2.slice(4));
            });
            $(oParent).find('[id^=ITEM_]').each(function () {
                var contentId = $(this).attr("ID");
                if ($.inArray(contentId, deselectedItems) > -1) //This checks if already the content id is in that array 
                {
                    if ($.inArray(sectionTitleUnchecked, sectionUnChecked) === -1) {
                        sectionUnChecked.push(sectionTitleUnchecked); //we are pushing this to uncheck the section header if any item under it is unchecked.
                    }

                }
                else {
                    sectionUnCheckedFlag = true; //we are using this flag to push the section title if all the items under it are unchecked.
                }
                var elementName = $(this).prop("tagName");
                switch (elementName.toUpperCase()) {

                    case "P":
                        if (contentId != null) {
                            $(this).prepend("<input type= 'checkbox' class='comp_itemParagraph_checkbox sectionItem' value='CHECKBOX' " + checkboxValue + "/>");
                        }
                        break;
                    case "SPAN":
                        if (contentId != null) {
                            $(this).prepend("<input type= 'checkbox' class='comp_item_checkbox sectionItem' value='CHECKBOX' " + checkboxValue + "/>");
                        }
                        break;
                    //Don't delete this code this is TO-DO in Future.  
                    /* case "LI":
                    if (contentId != undefined || contentId != null) {
                    $(this).prepend("<input type= 'checkbox' class='comp_itemList_checkbox' value='CHECKBOX' " + checkboxValue + "/>");
                    }
                    break; */ 
                    case "TR":
                        if (contentId != null) {
                            $(this).prepend("<td class='comp-checkbox'><input type= 'checkbox' class='comp_itemTr_checkbox sectionItem' value='CHECKBOX' " + checkboxValue + "/></td>");
                        }
                        $(this).closest('table').find("tr:has(th)").each(function () {
                            $(this).addClass("comp-th");
                            $(this).prepend("<th class='comp-checkbox'></th>");
                        });
                        break;
                }

            });
            if (!sectionUnCheckedFlag) {
                if ($.inArray(arrSectionName[cnt], sectionToBeDeselected) === -1) {
                    sectionToBeDeselected.push(arrSectionName[cnt]);
                }
            }
            // }
        }
        $(".section_title").find("a").each(function () {
            if ($.inArray($(this).text(), sectionUnChecked) > -1) {
                if ($.inArray($(this).text(), sectionToBeDeselected) > -1) {
                    $(this).find("input.comp_toc_checkbox").prop("indeterminate", false).attr("checked", false);
                }
                else {
                    $(this).find("input.comp_toc_checkbox").prop("indeterminate", true);
                }
            }
        });
        return arrSectionName;
    }
    // to deselect section header check box when all the items are deselected while rendering
    function deselectSectionHeaderCheckboxWhileRendering(sectionToBeDeselected, sectionTitle) {
        $(".section_title").find("a").each(function () {
            if ($(this).text() === sectionTitle) {
                if ($.inArray(sectionTitle, sectionToBeDeselected) > -1) {
                    $(this).children("input.comp_toc_checkbox").attr("checked", false);
                }
                else {
                    $(this).children("input.comp_toc_checkbox").prop("indeterminate", true);
                }
            }
        });
    }

    // to deselect section header check box when all the items are deselected
    function deselectSectionHeaderCheckbox(isSectionCheckboxChecked, sectionTitle) {
        $(".section_title").find("a").each(function () {
            if ($(this).text() === sectionTitle) {
                if (isSectionCheckboxChecked === false) {
                    $(this).find("input.comp_toc_checkbox").prop("indeterminate", false).attr("checked", false);
                }
                else {
                    $(this).find("input.comp_toc_checkbox").prop("indeterminate", true);
                }
            }
        });
    }

    // to select section header when all the items are selected
    function selectSectionHeaderCheckbox(isSectionCheckboxChecked, sectionTitle) {
        $(".section_title").find("a").each(function () {
            if ($(this).text() === sectionTitle) {
                if (isSectionCheckboxChecked === true) {
                    $(this).find("input.comp_toc_checkbox").prop("indeterminate", false).attr("checked", true);
                }
                else {
                    $(this).find("input.comp_toc_checkbox").prop("indeterminate", true);
                }
            }
        });
    }
    function ApplyCheckBoxes() {
        var summaryI18n = i18n.discernabu.clinical_summary_o1;
        var title;
        var childTagName;
        var arrSectionAsTable = [];
        var arrSectionAsParagraph = [];


        /*Apply check box at toc header/ section  level */
        //	$("h3").find("a").each (function(){

        $(".section_title").find("a").each(function () {

            var checkboxValue = "checked";
            if ($.inArray($(this).text(), unselectedSectionSavedInCCD) > -1) {
                checkboxValue = "";
                //mark it unselected
            }

            if ($(this).text() !== "Details") {//Do not add checkbox to the Details section header
                var classMatcher = 'span[class="' + $(this).text() + '"]';
                var oParent = $(classMatcher).closest("div");
                if (oParent.get(0) !== undefined) {
                    var sectionId = $(oParent).find("span:first").attr("ID");
                    if ($.inArray(sectionId, identifiers.Instructions) > -1) {
                        $(this).append("<span class='comp-inst'></span>");
                    }
                }

                $(this).prepend("<input type= 'checkbox' class='comp_toc_checkbox' value='CHECKBOX' " + checkboxValue + "/>");
            }
        });

        // These functions need to be placed here as we need to call them after we add check boxes to section headers.
        var sectionsWithItem = ApplyItemCheckBoxes();
        deselectCheckBoxes(); //This is to deselect the items that are retrieved from save ccd with unselected check boxes

        /*Find which section has data in table format and which section has in paragraph format*/
        $objXMLElements.find("section").each(function () {
            title = $(this).find("title").text();
            if (title.indexOf("DEL_") !== -1) {
                title = title.slice(4);
            }
            // If sections does not contain ITEM_ prefixes
            if ($.inArray(title, sectionsWithItem) === -1) {
                $(this).find("text:first").each(function () {
                    childTagName = "paragraph";
                    var childrenLength = $(this).children().length;
                    for (var j = 0; j < childrenLength; j++) {
                        childTagName = $(this).children().get(j).tagName;
                        if (childTagName === "table")
                            break;
                    }
                    switch (childTagName) {
                        case "table":
                            if ($.inArray(title, arrSectionAsTable) === -1)
                                arrSectionAsTable.push(title);
                            break;
                        case "paragraph":
                            var oPara = $(this).children("paragraph");
                            if ($(oPara).find("content:first").attr("ID") !== undefined && $(oPara).find("content:first").text() !== "No data available for this section") {
                                if ($.inArray(title, arrSectionAsParagraph) === -1)
                                    arrSectionAsParagraph.push(title);
                            }
                            break;
                        default:
                    }
                });
            }
        });


        /*Add checkbox for data in table format*/
        for (var cnt = 0, secLen = arrSectionAsTable.length; cnt < secLen; cnt++) {
            var tableClassMatcher = 'span[class="' + arrSectionAsTable[cnt] + '"]';
            var oParentDiv = $(tableClassMatcher).closest("div");
            var selectSectionTitle = true;
            var sectionTitle = arrSectionAsTable[cnt];
            var oTable = $(oParentDiv).children("table:first");
            oParentDiv.children("table").each(function () {

                var checkboxAddedInTR = false;
                var includeSectionInCCD = false;

                $(this).find("tr").each(function () {
                    if ($(this).children().length > 0) {
                        tagName = $(this).children().get(0).tagName;
                        if ($(this).children().find("content").size() > 0 || $(this).attr('class') === 'narr_tr') {
                            if (tagName.toUpperCase() === "TD") {
                                //mark each row selected/unselecetd based on saved CCD
                                var colText = $(this).children("td:first").text().replace(/\s/g, '');
                                var contentId = $(this).children().find("span").attr("ID");
                                var checkboxValue = "checked";
                                if (contentId !== undefined && contentId !== null) {
                                    if ($.inArray(contentId, deselectedRowIds) > -1) { //means the contentId is found and it has to be unselected
                                        checkboxValue = "";
                                        //If any row in the section is unselected scetion title is also unselected
                                        selectSectionTitle = false;
                                    }
                                    $(this).addClass("comp-td");
                                    //If any checkbox value is checked in the row, section is included in CCD based on saved ccd
                                    if (checkboxValue === "checked")
                                        includeSectionInCCD = true;
                                    $(this).prepend("<td class='comp-checkbox'><input type= 'checkbox' class='comp_td_checkbox sectionComp' value='CHECKBOX' " + checkboxValue + "/></td>");
                                    checkboxAddedInTR = true;
                                }
                            }
                        }
                    }
                });

                /* component header*/
                if (checkboxAddedInTR) {
                    //check and add this title in array sectionToBeDeselected if all rows are deselected
                    if (includeSectionInCCD === false) {
                        if ($.inArray(sectionTitle, sectionToBeDeselected) === -1)
                            sectionToBeDeselected.push(sectionTitle);
                    }

                    $(this).find("tr:has(th)").each(function () {
                        if ($(this).closest('table').find("tr:has(td)").hasClass('comp-td')) {
                            $(this).addClass("comp-th");
                            $(this).prepend("<th class='comp-checkbox'></th>");
                        }
                    });
                    //	break;  ?? Figure out why
                }

            }); // End for initial table selection - Devendra




            //select/deselect section title based on saved CCD
            if (selectSectionTitle === false) {
                deselectSectionHeaderCheckboxWhileRendering(sectionToBeDeselected, sectionTitle);
            }
        }

        /*Add checkbox for data in paragraph format*/
        for (var cnt = 0, secLen = arrSectionAsParagraph.length; cnt < secLen; cnt++) {
            var paragraphClassMatcher = 'span[class="' + arrSectionAsParagraph[cnt] + '"]';
            var oParent = $(paragraphClassMatcher).closest("div");
            var selectSectionTitle = true;
            var checkboxAdded = false;
            var sectionTitle = arrSectionAsParagraph[cnt];
            var paragraphCount = 0;
            var includeSectionInCCD = false;
            //Find the number of paragraphs in this section
            $(oParent).find("p").each(function () {
                if ($(this).parent().find("span:first").attr("class") === arrSectionAsParagraph[cnt]) {
                    paragraphCount = paragraphCount + 1;
                }
            });
            $(oParent).find("p").each(function () {
                if ($(this).parent().find("span:first").attr("class") === arrSectionAsParagraph[cnt]) {
                    var oParentDiv = $(this).parent();
                    //Get the text from paragraph
                    var paraText = "";
                    var htmlArray = $(this).html().split('<BR>');
                    for (i = 0, j = htmlArray.length; i < j; i++) {
                        $("#dummyDiv").html(htmlArray[i]);
                        var text = $.trim($("#dummyDiv").text());
                        paraText = paraText.concat(text);
                    }
                    paraText = paraText.replace(/\s/g, '');
                    //match the pararaph text against rowTextCCD
                    var checkboxValue = "checked";
                    var contentID = $(this).find("span:first").attr("ID");
                    if (contentID !== undefined && contentID !== null) {
                        if ($.inArray(contentID, deselectedRowIds) > -1) { //means the contentid is found and it has to be unselected
                            checkboxValue = "";
                            selectSectionTitle = false;
                        }
                        //If any checkbox value is checked in the row, section is included in CCD based on saved ccd
                        if (checkboxValue === "checked") {
                            includeSectionInCCD = true;
                        }
                        // Only add a checkbox if there are more than one paragraphs in this section.
                        if (paragraphCount > 1) {
                            $(this).prepend("<input type= 'checkbox'  class='comp_para_checkbox sectionComp' value='CHECKBOX' " + checkboxValue + "/>");
                        }

                        checkboxAdded = true;
                    }
                }
            });

            //check and add this title in array sectionToBeDeselected
            if (includeSectionInCCD === false && checkboxAdded) {
                if ($.inArray(sectionTitle, sectionToBeDeselected) === -1)
                    sectionToBeDeselected.push(sectionTitle);
            }
            if (checkboxAdded) {
                break;
            }


            //select/deselect section title based on saved CCD
            if (selectSectionTitle === false) {
                deselectSectionHeaderCheckboxWhileRendering(sectionToBeDeselected, sectionTitle);
            }
        }

        // Event handler for content with Item_ checkboxes adn paragraph with Item_ check box.
        $(".comp_item_checkbox").add(".comp_itemParagraph_checkbox").add(".comp_itemTr_checkbox").click(function () {
            EnableSignDisablePrint();
            SetModifiedFlag(true);

            var sectionTitle = $(this).closest('div').children('span').attr('class');
            var oParentDiv = $(this).closest('div');
            var itemUnChecked = false;
            var itemChecked = true;
            var sectionDeleted = false;
            var sectionRetained = true;

            if ($(this).is(':checked') === false) {

                switch ($(this).attr("class")) {

                    case "comp_item_checkbox sectionItem":
                        var contentId = $(this).closest('span').attr("ID");
                        if ($.inArray(contentId, deselectedItems) === -1)
                            deselectedItems.push(contentId);

                        //if all the rows are unseleced then add this section to array to be deleted
                        $(this).closest('div').find('.sectionItem').each(function () {
                            if ($(this).is(':checked') === true) {
                                sectionDeleted = true;
                            }
                        });

                        if (sectionDeleted == false) {
                            if ($.inArray(sectionTitle, sectionToBeDeselected) === -1) {
                                sectionToBeDeselected.push(sectionTitle);
                            }

                        }

                        //Uncheck Group_ for the corresponding ITEM_ checkboxes
                        $(this).closest('[id^=GROUP_]').each(function () {
                            $(this).find('[id^=ITEM_]').each(function () {
                                if ($(this).find("input.comp_item_checkbox").is(':checked') === true) {
                                    itemUnChecked = true;
                                    return;
                                }
                            });
                            if (!itemUnChecked) {
                                deselectedGroups.push($(this).attr("ID"));
                            }
                        });
                        break;

                    case "comp_itemParagraph_checkbox sectionItem":
                        var paragraphId = $(this).closest("p").attr("ID");
                        if ($.inArray(paragraphId, deselectedItems) === -1)
                            deselectedItems.push(paragraphId);

                        //if all the rows are unseleced then add this section to array to be deleted
                        $(this).closest('div').find('.sectionItem').each(function () {
                            if ($(this).is(':checked') === true) {
                                sectionDeleted = true;
                            }
                        });

                        if (sectionDeleted == false) {
                            if ($.inArray(sectionTitle, sectionToBeDeselected) === -1) {
                                sectionToBeDeselected.push(sectionTitle);
                            }

                        }

                        //Uncheck Group_ for the corresponding ITEM_ checkboxes
                        $(this).closest('[id^=GROUP_]').each(function () {
                            $(this).find('[id^=ITEM_]').each(function () {
                                if ($(this).find("input.comp_itemParagraph_checkbox").is(':checked') === true) {
                                    itemUnChecked = true;
                                    return;
                                }
                            });
                            if (!itemUnChecked) {
                                deselectedGroups.push($(this).attr("ID"));
                            }
                        });
                        break;
                    case "comp_itemTr_checkbox sectionItem":
                        var trId = $(this).closest("tr").attr("ID");
                        if ($.inArray(trId, deselectedItems) === -1) {
                            deselectedItems.push(trId);
                        }
                        //if all the rows are unseleced then add this section to array to be deleted
                        $(this).closest('div').find('.sectionItem').each(function () {
                            if ($(this).is(':checked') === true) {
                                sectionDeleted = true;
                            }
                        });
                        if (sectionDeleted == false) {
                            if ($.inArray(sectionTitle, sectionToBeDeselected) === -1) {
                                sectionToBeDeselected.push(sectionTitle);
                            }

                        }

                        //Uncheck Group_ for the corresponding ITEM_ checkboxes
                        $(this).closest('[id^=GROUP_]').each(function () {
                            $(this).find('[id^=ITEM_]').each(function () {
                                if ($(this).find("input.comp_itemTr_checkbox").is(':checked') === true) {
                                    itemUnChecked = true;
                                    return;
                                }
                            });
                            if (!itemUnChecked) {
                                deselectedGroups.push($(this).attr('ID'));
                            }
                        });
                        break;
                }
                deselectSectionHeaderCheckbox(sectionDeleted, sectionTitle);
            }
            else {
                $(this).closest('[id^=GROUP_]').each(function () {
                    var groupPosition = $.inArray($(this).attr('ID'), deselectedGroups);
                    if (groupPosition > -1) {
                        deselectedGroups.splice(groupPosition, 1);
                    }
                });

                switch ($(this).attr("class")) {

                    case "comp_item_checkbox sectionItem":

                        var itemPosition = $.inArray($(this).closest('span').attr('ID'), deselectedItems);
                        if (itemPosition > -1) {
                            deselectedItems.splice(itemPosition, 1);
                        }
                        $(this).closest('div').find('.sectionItem').each(function () {
                            if ($(this).is(':checked') === false) {
                                itemChecked = false;
                            }
                            if ($(this).is(':checked') === true) {
                                sectionRetained = false;
                            }
                        });

                        if (sectionRetained === false) {
                            var sectionPos = $.inArray(sectionTitle, sectionToBeDeselected);
                            if (~sectionPos) {
                                sectionToBeDeselected.splice(sectionPos, 1);
                            }
                        }

                        if (itemChecked === true) {
                            var pos = $.inArray(sectionTitle, unselectedSectionSavedInCCD);
                            if (~pos) {
                                unselectedSectionSavedInCCD.splice(pos, 1);
                            }
                        }

                        break;

                    case "comp_itemParagraph_checkbox sectionItem":
                        var itemPosition = $.inArray($(this).closest('p').attr('ID'), deselectedItems);
                        if (itemPosition > -1) {
                            deselectedItems.splice(itemPosition, 1);
                        }
                        $(this).closest('div').find('.sectionItem').each(function () {
                            if ($(this).is(':checked') === false) {
                                itemChecked = false;
                            }
                            if ($(this).is(':checked') === true) {
                                sectionRetained = false;
                            }
                        });

                        if (sectionRetained === false) {
                            var sectionPos = $.inArray(sectionTitle, sectionToBeDeselected);
                            if (~sectionPos) {
                                sectionToBeDeselected.splice(sectionPos, 1);
                            }
                        }

                        if (itemChecked === true) {
                            var pos = $.inArray(sectionTitle, unselectedSectionSavedInCCD);
                            if (~pos) {
                                unselectedSectionSavedInCCD.splice(pos, 1);
                            }
                        }

                        break;
                    case "comp_itemTr_checkbox sectionItem":
                        var itemPosition = $.inArray($(this).closest('tr').attr('ID'), deselectedItems);
                        if (itemPosition > -1) {
                            deselectedItems.splice(itemPosition, 1);
                        }
                        $(this).closest('div').find('.sectionItem').each(function () {
                            if ($(this).is(':checked') === false) {
                                itemChecked = false;
                            }
                            if ($(this).is(':checked') === true) {
                                sectionRetained = false;
                            }
                        });

                        if (sectionRetained === false) {
                            var sectionPos = $.inArray(sectionTitle, sectionToBeDeselected);
                            if (~sectionPos) {
                                sectionToBeDeselected.splice(sectionPos, 1);
                            }
                        }

                        if (itemChecked === true) {
                            var pos = $.inArray(sectionTitle, unselectedSectionSavedInCCD);
                            if (~pos) {
                                unselectedSectionSavedInCCD.splice(pos, 1);
                            }
                        }
                        break;
                }
                selectSectionHeaderCheckbox(itemChecked, sectionTitle);
            }
        });



        //Don't delete this code this is TO-DO in Future.


        // These are the event handlers for other two cases where items with Item_ has checkboxes and tr with Item_ has checkboxes

        //we can include these cases as above in a switch statement and in a single function

        //// Event Handler for item list checkboxes
        /*	$('.comp_itemList_checkbox').click(function () {
        $("#cmdSave").prop('disabled', false);
        $("#cmdSubmit").prop('disabled', false);
        $("#cmdSaveAs").prop('disabled', true);
        $("#cmdPrint").prop('disabled', true);
        disablePrintOption();
        SetModifiedFlag(true);
    
        var sectionTitle = $(this).closest('div').children('span').attr('class');
        var oParentDiv = $(this).closest('div');
        var itemUnChecked = false;
        var itemChecked = true;
        var sectionDeleted = false;
        var sectionRetained = true;
    
        // uncheck section headers once you uncheck an ITEM_ one
        if ($(this).is(':checked') === false) {
        deselectedItems.push($(this).closest("li").attr("ID"));
    
        // if any row in the section is unselected, unselect the section heading
        $(".section_title").find("a").each(function () {
        if ($(this).text() === sectionTitle) {
        $(this).find("input.comp_toc_checkbox").attr("checked", false);
        if ($.inArray(sectionTitle, unselectedSectionSavedInCCD) == -1) {
        unselectedSectionSavedInCCD.push(sectionTitle);
        }
        }
        });
    
        //if all the rows are unseleced then add this section to array to be deleted
        $(this).closest('div').find('[id^=ITEM_]').each(function () {
        if ($(this).find("input.comp_itemList_checkbox").is(':checked') === true) {
        sectionDeleted = true;
        }
        });
    
        if (sectionDeleted == false) {
        if ($.inArray(sectionTitle, sectionToBeDeselected) == -1) {
        sectionToBeDeselected.push(sectionTitle);
        }
    
        }
    
        //Uncheck Group_ for the corresponding ITEM_ checkboxes
        $(this).closest('[id^=GROUP_]').each(function () {
        $(this).find('[id^=ITEM_]').each(function () {
        if ($(this).find("input.comp_itemList_checkbox").is(':checked') === true) {
        itemUnChecked = true;
        return;
        }
        });
        if (!itemUnChecked) {
        deselectedGroups.push($(this).attr("ID"));
        }
        });
    
        }
        else {
        var itemPosition = $.inArray($(this).closest("li").attr("ID"), deselectedItems);
        if (itemPosition != -1) {
        deselectedItems.splice(itemPosition, 1);
        }
    
        $(this).closest('[id^=GROUP_]').each(function () {
        var groupPosition = $.inArray($(this).attr("ID"), deselectedGroups);
        if (groupPosition != -1) {
        deselectedGroups.splice(groupPosition, 1);
        }
        });
    
        $(this).closest('div').find('[id^=ITEM_]').each(function () {
        if ($(this).find("input.comp_itemList_checkbox").is(':checked') === false) {
        itemChecked = false;
        }
        });
    
        $(this).closest('div').find('[id^=ITEM_]').each(function () {
        if ($(this).find("input.comp_itemList_checkbox").is(':checked') === true) {
        sectionRetained = false;
        }
        });
    
        if (sectionRetained == false) {
        var sectionPos = $.inArray(sectionTitle, sectionToBeDeselected);
        if (~sectionPos) {
        sectionToBeDeselected.splice(sectionPos, 1);
        }
        }
    
        if (itemChecked == true) {
        $(".section_title").find("a").each(function () {
        if ($(this).text() === sectionTitle) {
        $(this).find("input.comp_toc_checkbox").attr("checked", true);
        }
        });
        var pos = $.inArray(sectionTitle, unselectedSectionSavedInCCD);
        if (~pos) {
        unselectedSectionSavedInCCD.splice(pos, 1);
        }
        }
        }
        }); */


        //Don't delete this code this is TO-DO in Future.
        // Event Handler for item tr checkboxes
        /* $('.comp_itemTr_checkbox').click(function () {
        $("#cmdSave").prop('disabled', false);
        $("#cmdSubmit").prop('disabled', false);
        $("#cmdSaveAs").prop('disabled', true);
        $("#cmdPrint").prop('disabled', true);
        disablePrintOption();
        SetModifiedFlag(true);

        var sectionTitle = $(this).closest('div').children('span').attr('class');
        var oParentDiv = $(this).closest('div');
        var itemUnChecked = false;
        var itemChecked = true;
        var sectionDeleted = false;
        var sectionRetained = true;

        // uncheck section headers once you uncheck an ITEM_ one
        if ($(this).is(':checked') === false) {
        deselectedItems.push($(this).closest("tr").attr("ID"));

        // if any row in the section is unselected, unselect the section heading
        $(".section_title").find("a").each(function () {
        if ($(this).text() === sectionTitle) {
        $(this).find("input.comp_toc_checkbox").attr("checked", false);
        if ($.inArray(sectionTitle, unselectedSectionSavedInCCD) == -1) {
        unselectedSectionSavedInCCD.push(sectionTitle);
        }
        }
        });

        //if all the rows are unseleced then add this section to array to be deleted
        $(this).closest('div').find('[id^=ITEM_]').each(function () {
        if ($(this).find("input.comp_itemTr_checkbox").is(':checked') === true) {
        sectionDeleted = true;
        }
        });

        if (sectionDeleted == false) {
        if ($.inArray(sectionTitle, sectionToBeDeselected) == -1) {
        sectionToBeDeselected.push(sectionTitle);
        }

        }

        //Uncheck Group_ for the corresponding ITEM_ checkboxes
        $(this).closest('[id^=GROUP_]').each(function () {
        $(this).find('[id^=ITEM_]').each(function () {
        if ($(this).find("input.comp_itemTr_checkbox").is(':checked') === true) {
        itemUnChecked = true;
        return;
        }
        });
        if (!itemUnChecked) {
        deselectedGroups.push($(this).attr("ID"));
        }
        });

        }
        else {
        var itemPosition = $.inArray($(this).closest("tr").attr("ID"), deselectedItems);
        if (itemPosition != -1) {
        deselectedItems.splice(itemPosition, 1);
        }

        $(this).closest('[id^=GROUP_]').each(function () {
        var groupPosition = $.inArray($(this).attr("ID"), deselectedGroups);
        if (groupPosition != -1) {
        deselectedGroups.splice(groupPosition, 1);
        }
        });

        $(this).closest('div').find('[id^=ITEM_]').each(function () {
        if ($(this).find("input.comp_itemTr_checkbox").is(':checked') === false) {
        itemChecked = false;
        }
        });

        $(this).closest('div').find('[id^=ITEM_]').each(function () {
        if ($(this).find("input.comp_itemTr_checkbox").is(':checked') === true) {
        sectionRetained = false;
        }
        });

        if (sectionRetained == false) {
        var sectionPos = $.inArray(sectionTitle, sectionToBeDeselected);
        if (~sectionPos) {
        sectionToBeDeselected.splice(sectionPos, 1);
        }
        }

        if (itemChecked == true) {
        $(".section_title").find("a").each(function () {
        if ($(this).text() === sectionTitle) {
        $(this).find("input.comp_toc_checkbox").attr("checked", true);
        }
        });
        var pos = $.inArray(sectionTitle, unselectedSectionSavedInCCD);
        if (~pos) {
        unselectedSectionSavedInCCD.splice(pos, 1);
        }
        }
        }
        }); */

        //adding events

        $('.comp_td_checkbox, .comp_para_checkbox').click(function () {
            EnableSignDisablePrint();
            SetModifiedFlag(true);

            var compTitle = $(this).closest('div').children('span').attr('class');
            var oParentDiv = $(this).closest('div');
            var includeSectionInCCD = false;

            /*When any checkbox is unselected*/
            if ($(this).is(':checked') === false) {
                var tempArr = [];
                switch ($(this).attr("class")) {
                    case "comp_td_checkbox sectionComp":
                        /*if any row in the section remains selected then that section needs to be retained in CCD. hence keep includeSectionInCCD = true*/
                        //Specifically look for second td because when we add a checkbox we add it inside as td so the first td will be the one with checkbox. In case of Visit section we have to look for third td.
                       var tableContentId = $(this).closest('tr').find('td:nth-child(2)').find('span').attr("id");
                       if (tableContentId === undefined || tableContentId === null) {
                            tableContentId = $(this).closest('tr').find('td:nth-child(3)').find('span').attr("id");
                        }
                        if ($.inArray(tableContentId, deselectedRowIds) === -1) {
                            deselectedRowIds.push(tableContentId);
                        }
                        includeSectionInCCD = $(oParentDiv).find(".sectionComp").is(':checked');
                        break;

                    case "comp_para_checkbox sectionComp":
                        var paragraphContentId = $(this).closest("p").find("span:first").attr("ID");
                        if ($.inArray(paragraphContentId, deselectedRowIds) === -1) {
                            deselectedRowIds.push(paragraphContentId);
                        }
                        /*if any row in the section remains selected then that section needs to be retained in CCD. hence keep includeSectionInCCD = true*/
                        includeSectionInCCD = $(oParentDiv).find(".sectionComp").is(':checked');
                        break;
                };

                if (includeSectionInCCD === false) {
                    sectionToBeDeselected.push(compTitle);
                    if ($.inArray(compTitle, unselectedSectionSavedInCCD) === -1) {
                        unselectedSectionSavedInCCD.push(compTitle);
                    }
                }
                deselectSectionHeaderCheckbox(includeSectionInCCD, compTitle);
            }
            /* when a row is checked, selected row is removed from the array which contains rows to be deselected from CCD*/
            else {
                var isSectionCheckboxChecked = true;
                //when all the rows in a section are unselected then only isSectionCheckboxChecked = false
                switch ($(this).attr("class")) {
                    case "comp_td_checkbox sectionComp":
                        //Specifically look for second td because when we add a checkbox we add it inside as td so the first td will be the one with checkbox. In case of Visit section we have to look for third td.
                        var tableContentId = $(this).closest('tr').find('td:nth-child(2)').find('span').attr('id'); 
                        if (tableContentId === undefined || tableContentId === null) {
                            tableContentId = $(this).closest('tr').find('td:nth-child(3)').find('span').attr("id");
                        }
                        var rowIdPosition = $.inArray(tableContentId, deselectedRowIds);
                        if (rowIdPosition > -1) {
                            deselectedRowIds.splice(rowIdPosition, 1);
                        }
                        $(oParentDiv).find('table').each(function () {
                            $(this).find('tr').each(function () {
                                $(this).find('td').each(function () {
                                    if ($(this).hasClass('comp-checkbox')) {
                                        if ($(this).find('.sectionComp').is(':checked') === false) {
                                            isSectionCheckboxChecked = false;
                                        }
                                    }
                                });
                            });
                        });
                        break;
                    case "comp_para_checkbox sectionComp":
                        var paragraphContentId = $(this).closest('p').find('span:first').attr('ID');
                        var paragraphIDPosition = $.inArray(paragraphContentId, deselectedRowIds);
                        if (paragraphIDPosition > -1) {
                            deselectedRowIds.splice(paragraphIDPosition, 1);
                        }
                        $(oParentDiv).find('.sectionComp').each(function () {
                            if ($(this).is(':checked') === false)
                                isSectionCheckboxChecked = false;
                        });
                        break;
                }

                selectSectionHeaderCheckbox(isSectionCheckboxChecked, compTitle);

                //if any row of a section is checked, that section is retained, hence remove that section from array sectionToBeDeselected
                var position = $.inArray(compTitle, sectionToBeDeselected);
                if (position > -1) {
                    sectionToBeDeselected.splice(position, 1);
                }

                var pos = $.inArray(compTitle, unselectedSectionSavedInCCD);
                if (pos > -1) {
                    unselectedSectionSavedInCCD.splice(pos, 1);
                }
            }
        });

        // This function is to select/deselect individual items when section header check box is selected/deselected
        // sectitile indicates section title name
        // select indicates if the check box is selected / deselected by true/false
        // These parameters are passed in from onclick event on section header checkbox.
        function deselectItemCheckBox(sectitle, select) {
            // This exclusively matches all class names 
            var classMatcher = 'span[class="' + sectitle + '"]';
            var oParent = $(classMatcher).closest("div");
            if (select == false) {
                $(".section_title").find("a").each(function () {
                    var sectionTitle = $(this).text();
                    if (sectionTitle === sectitle) {
                        $(oParent).find('[id^=ITEM_]').each(function () {
                            var itemId = $(this).attr("ID");
                            var $this;
                            $this = $(this);
                            if ($.inArray(itemId, deselectedItems) == -1) {
                                deselectedItems.push(itemId);
                            }
                            if ($this.find("input.comp_item_checkbox").is(':checked') != select) {
                                $this.find("input.comp_item_checkbox").attr("checked", select);
                            }

                            if ($this.find("input.comp_itemParagraph_checkbox").is(':checked') != select) {
                                $this.find("input.comp_itemParagraph_checkbox").attr("checked", select);
                            }
                            if ($this.find("input.comp_itemTr_checkbox").is(':checked') != select) {
                                $this.find("input.comp_itemTr_checkbox").attr("checked", select);
                            }
                            if ($this.find("input.comp_itemList_checkbox").is(':checked') != select) {
                                $this.find("input.comp_itemList_checkbox").attr("checked", select);
                            }

                            $(this).closest('[id^=GROUP_]').each(function () {
                                var groupId = $(this).attr("ID");
                                if ($.inArray(groupId, deselectedGroups) == -1) {
                                    deselectedGroups.push(groupId);
                                }
                            });

                        });
                    }
                });
            }
            else {
                $(".section_title").find("a").each(function () {
                    var sectionTitle = $(this).text();
                    if (sectionTitle === sectitle) {
                        $(oParent).find('[id^=ITEM_]').each(function () {
                            var itemId = $(this).attr("ID");
                            var $this = $(this);
                            if ($.inArray(itemId, deselectedItems) > -1) {
                                var pos = $.inArray(itemId, deselectedItems);
                                deselectedItems.splice(pos, 1);
                            }
                            if ($this.find("input.comp_item_checkbox").is(':checked') != select) {
                                $this.find("input.comp_item_checkbox").attr("checked", select);
                            }

                            if ($this.find("input.comp_itemParagraph_checkbox").is(':checked') != select) {
                                $this.find("input.comp_itemParagraph_checkbox").attr("checked", select);
                            }
                            if ($this.find("input.comp_itemTr_checkbox").is(':checked') != select) {
                                $this.find("input.comp_itemTr_checkbox").attr("checked", select);
                            }
                            if ($this.find("input.comp_itemList_checkbox").is(':checked') != select) {
                                $this.find("input.comp_itemList_checkbox").attr("checked", select);
                            }

                            $(this).closest('[id^=GROUP_]').each(function () {
                                var groupId = $(this).attr("ID");
                                var position = $.inArray(groupId, deselectedGroups);
                                if (position > -1) {
                                    deselectedGroups.splice(position, 1);
                                }
                            });
                        });
                    }
                });
            }
        }

        $('.comp_toc_checkbox').click(function () {

            EnableSignDisablePrint();
            SetModifiedFlag(true);

            var childTagName, elementClass;
            var oPara;
            var secTitle = $(this).closest('a').text();
            var isChecked = $(this).is(':checked');

            //The array unselectedSectionSavedInCCD stores those unselected section which do not have any row in it or does not have
            //content id or section which does not have any data
            $objXMLElements.find("section").each(function () {
                var title = $(this).find("title").text();
                var sectionId = $(this).find("templateId").attr('root');
                if (title.indexOf("DEL_") > -1) {
                    title = title.slice(4);
                }
                if (title === secTitle) {
                    if ($.inArray(sectionId, identifiers.Instructions) > -1) {
                        instSectionChanged = true;
                    }
                    $(this).find("text:first").each(function () {
                        childTagName = "paragraph";
                        var childrenLength = $(this).children().length;
                        for (var j = 0; j < childrenLength; j++) {
                            childTagName = $(this).children().get(j).tagName;
                            if (childTagName === "table")
                                break;
                        }
                        if (childTagName !== "table")
                            childTagName = "paragraph"; // this is to handle case where we have list is section
                        if (childTagName === "paragraph") {
                            oPara = $(this).children("paragraph");
                            if ($(oPara) !== undefined) {
                                if ($(oPara).find("content:first").attr("ID") !== undefined || $(oPara).find("content:first").text() !== "No data available for this section") {
                                    if (isChecked === false) {
                                        unselectedSectionSavedInCCD.push(secTitle);
                                    }
                                    else {
                                        var position = $.inArray(secTitle, unselectedSectionSavedInCCD);
                                        if (position > -1) {
                                            unselectedSectionSavedInCCD.splice(position, 1);
                                        }
                                    }
                                }
                            }
                        }

                    });
                }
            });

            //some sections are in table format and some are in paragraph format. accordingly passing class of input tag to function SelectDeselectCheckbox
            if (childTagName === "table") {
                elementClass = "comp_td_checkbox";
                var classMatcher = 'span[class="' + secTitle + '"]';
                var $oParent = $(classMatcher).closest("div");
                $(".section_title").find("a").each(function () {
                    var sectionTitle = $(this).text();
                    if (sectionTitle === secTitle) {
                        $oParent.find('[id^=ITEM_]').each(function () {
                            elementClass = "comp_itemTr_checkbox";
                            return false;
                        });                      
                        if ($oParent.find("table td span:first").attr("ID") === undefined) {
                            if (isChecked === false) {
                                unselectedSectionSavedInCCD.push(secTitle);
                            }
                            else {
                                var position = $.inArray(secTitle, unselectedSectionSavedInCCD);
                                if (position > -1) {
                                    unselectedSectionSavedInCCD.splice(position, 1);
                                }
                            }
                        }
                    }
                });
            }
            else if (childTagName === "paragraph") {
                elementClass = "comp_para_checkbox";
            }
            else
                elementClass = "";

            if ($(this).is(':checked') === false) {
                sectionToBeDeselected.push(secTitle);
                SelectDeselectCheckbox(secTitle, false, elementClass);
                deselectItemCheckBox(secTitle, false);
            }

            else {
                var position = $.inArray(secTitle, sectionToBeDeselected);
                if (position > -1) {
                    sectionToBeDeselected.splice(position, 1);
                }
                SelectDeselectCheckbox(secTitle, true, elementClass);
                deselectItemCheckBox(secTitle, true);
            }
        });

        $('.comp-inst').click(function () {
		    var criterion = tempComp.getCriterion();
		    var metaData = [{ key: "User ID", value: criterion.provider_id },
                            { key: "Patient ID", value: criterion.person_id },
                            { key: "Encounter ID", value: criterion.encntr_id }];
		    createCheckpoint("USR:MPG.CS.ADD INSTRUCTIONS", "Start", metaData);
            EnableSignDisablePrint();

            var fuObject = {};
            fuObject = window.external.DiscernObjectFactory("PATIENTEDUCATION");
            var personId = criterion.person_id;
            var encntrId = criterion.encntr_id;
            fuObject.SetPatient(personId, encntrId);
            fuObject.SetDefaultTab(0);

            var ret = 1;
			createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
            // Check to see if COM object with new method is available.  If not use old method.
            if (typeof (fuObject.DoModalWithReturn) !== "undefined") {
                // Sign/save - 1
                // Cancelled - 2
                ret = fuObject.DoModalWithReturn();

            } else {
                fuObject.DoModal();
            }
			createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop", [{ key: "VS Dialog", value: "Patient Education Dialog" }]);

            // Don't set pending flag if dialog was cancelled.
            if (ret === 1) {

                // The XML will have a content tag inside "Instructions" section. We will search for those IDs and pass them on to the get_patient_inst script
                // <content ID="SCRIPT.XR_CUST_DISCH_INFO"/>
                // <content ID="SCRIPT.XR_CUST_DISCH_INFO_TITLE"/>

                //The mpage will display pat ed/follow up sections only if the flags are specified in the XML
                //If no flag is specified, even though user adds any inst/follow up, mpage will not show it
                var flagForTitle = "";

                // Search for the content ID within the Instructions section
                $objXMLElements.find("section").each(function (index) {
                    var templateId = $(this).find("templateId").attr('root');
                    if ($.inArray(templateId, identifiers.Instructions) > -1) {
                        $(this).find("content").each(function (index) {
                            var contentID = $(this).attr("ID");
                            switch (contentID) {
                                case "SCRIPT.XR_CUST_DISCH_INFO":
                                    //  calling the script "SCRIPT.XR_CUST_DISCH_INFO_TITLE" since needs to display only Titles in Visit Summary
                                case "SCRIPT.XR_CUST_DISCH_INFO_TITLE":
                                    flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO_TITLE";
                                    instructionsBuild.showPatientEducation = true;
                                    break;
                                case "SCRIPT.XR_CUST_FOLLOWUP_TXT":
                                    instructionsBuild.showFollowUp = true;
                                    break;
                            }
                        });
                    }
                });

                //Call the service to get the latest Patient Instruction and pass in the title flag
                if (instructionsBuild.showPatientEducation || instructionsBuild.showFollowUp) {
                    CLINICAL_SUMMARY_O1.GetPatientInstructions(tempComp, flagForTitle, instructionsBuild.showFollowUp);
                }
            }
        });


    }

    // This function is used to inactivate the newly created and the last saved XML from CAMM
    // mediaID - Media Identifier passed in for the newly created CCD
    function DisableDocumentInCamm(mediaID) {
        var url = CAMM_URL;
        var mediaAPI = "inactivate/";
        var identifier = mediaIdentifier + "?";
        var version = "version=" + mediaVersion;
        var encoding = "&encoding=UTF-8";
        var timeExec = "&ms=" + new Date().getTime(); //to by pass the cache

        if (mediaID) {
            identifier = mediaID + "?";
        }

        var getURL = url + mediaAPI + identifier + version + encoding + timeExec;

        // Call to the rest api
        restAPIClient.open('POST', getURL, false);
        window.location = "javascript:MPAGES_SVC_AUTH(restAPIClient)";
        restAPIClient.send(null);


        if (restAPIClient.readyState === 4 && restAPIClient.status === 200) {
            // Succeeds
            var responseText = restAPIClient.responseText;
        } else if (restAPIClient.readyState === 4 && restAPIClient.status !== 200) {
            // Fails
            alert(summaryI18n.RETRIEVE_ERROR);
        }
    }

    function AddInstructionSubSection() {
        var jsHTML = [];
        var sectionName;
        var flagForTitle = "";
        $objXMLElements.find("section").each(function () {
            var templateId = $(this).find("templateId").attr('root');
            if ($.inArray(templateId, identifiers.Instructions) > -1) {
                sectionName = $(this).find("title").text();
                $(this).find("content").each(function (index) {
                    var contentID = $(this).attr("ID");
                    switch (contentID) {
                        case "SCRIPT.XR_CUST_DISCH_INFO":
                            flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO";
                            break;
                        case "SCRIPT.XR_CUST_DISCH_INFO_TITLE":
                            flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO_TITLE";
                            break;
                        case "SCRIPT.XR_CUST_FOLLOWUP_TXT":
                            pushFollowUp = true;
                            break;
                    }
                });
            }
        });
        var classMatcher = 'span[class="' + sectionName + '"]';
        var $sectionDiv = $(classMatcher).parent("div");
        // hiding the text in the pat edu if instructions section is not modified within visit summary 
               //when titles and text is configured in clinical view manager
        if (flagForTitle === "SCRIPT.XR_CUST_DISCH_INFO") {
            $sectionDiv.find("p").each(function () {
                var $paragraph = $(this);
                if ($paragraph.find("span").attr("class") === "Bold") {
                    //If condition is to identify the paragraphs which has titles inside content tag having attribute bold so that it should not qualify for hide.
                    //This is to differentiate between between normal text and title in paragraph. We have to hide normal text in the paragraph
                }
                else if ($paragraph.text() !== "No data available for this section") {
                    //This is an exception case where normal text = "No data available for this section" needs to be retained while hide others
                    $paragraph.hide();
                }
            });
        } 
        var instHTML = $sectionDiv.html();

        jsHTML.push("<div id='instructionsDiv'></div>");
        jsHTML.push("<div id='commentsDiv>' >");
        jsHTML.push("<p class='comments-hd'><b>Comments</b></p>");
        jsHTML.push("<textarea id='commentsTextArea' name='commentsTextArea' rows='6.2' cols='62'> </textarea>");
        jsHTML.push("</div>");

        $sectionDiv.html(jsHTML.join(""));
        $("#instructionsDiv").html(instHTML);
    }
    // Returns current date time in milliseconds
    function GetCurrentDate() {
        return new Date();
    }
    // logs Timers to BlackBird
    function LogTimerToConsole(timer) {
        var timeElapsed = timer.endTime - timer.startTime;
        var logMessage = "Timer Name : " + timer.timerName + " |Run Time : " + timeElapsed;
        if (docExistsInCamm && timer.timerName === "CCD Creation Time : ") {
            MP_Util.LogWarn(logMessage + " |Saved CCD is retrieved from CAMM");
        }
        else {
            MP_Util.LogWarn(logMessage);
        }
    }
    function createCheckpoint(eventName, subeventName, metadata) {
        var checkpoint = window.external.DiscernObjectFactory("CHECKPOINT");
        checkpoint.EventName = eventName;
        checkpoint.SubeventName = subeventName;
        metadata = metadata || [];
        for (var m = 0, len = metadata.length; m < len; m++) {
            var data = metadata[m];
            checkpoint.Metadata(data.key) = data.value;
        }
        checkpoint.Publish();
    }

    function CreateTextEditor(element, criterian) {
        var basePath = criterian.static_content + '/js/ckeditor/';
        var rightClickMenuOpened = false;
        var commentsBeforeRightClick = "";

        // validate element being passed in
        // 1 = element node
        if (!element || (typeof element.nodeType === 'undefined') || element.nodeType !== 1)
            return;

        if ((typeof CKEDITOR !== 'undefined') && CKEDITOR) {

            var configObj = {};

            // update base path and update the paths for skins
            CKEDITOR.basePath = basePath;
            CKEDITOR.skins.updatePaths('kama');

            // bring default config settings from MPagesDynDocConfig.js to configObj
            CKEDITOR.editorConfig(configObj);

            // convert locale to lowercase and then set language
            criterionLocale = criterian.locale_id.toLowerCase();
            switch (criterionLocale) {
                case 'fr_fr':
                    criterionLocale = "fr";
                    break;
                case 'en_us':
                    criterionLocale = "en";
                    break;
                case 'en_au':
                    criterionLocale = "en-au";
                    break;
                case 'es_es':
                    criterionLocale = "es";
                    break;
                case 'de_de':
                    criterionLocale = "de";
                    break;
                case 'en_gb':
                    criterionLocale = "en-gb";
                    break;
                default:
                    criterionLocale = "en";
                    break;
            }
            configObj.language = criterionLocale;
            configObj.baseHref = basePath;
            configObj.skin = 'kama,' + basePath + 'skins/kama/';
            configObj.uiColor = "#f0f2ee";
            // ensure that the editor starts without focus, to prevent the page from jumping
            configObj.startupFocus = false;
            configObj.loadPluginJsFiles = false;

            // Prevent ckeditor from loading any additional configs, by setting the it to empty string
            CKEDITOR.config.customConfig = '';

            // save the editor instance to be referenced later
            editorInstance = CKEDITOR.replace(element, configObj);

            var container = editorInstance.container.$;
            window.setTimeout(function () {
                // have to attach to the document because the body occupies a small area... on the the area with text in it.
                $($('#' + container.id + ' iframe')[0].contentWindow.document).keyup(function () {
                    EnableSignDisablePrint();
                    SetModifiedFlag(true);
                    instSectionChanged = true;
                })
				.mousedown(function (e) {
				    if (e.which === 3) {  //3 is for right click event
				        rightClickMenuOpened = true;
				        commentsBeforeRightClick = editorInstance.getData();
				    }
				})
				.mouseenter(function (e) {
				    if (rightClickMenuOpened) {
				        rightClickMenuOpened = false;
				        if (commentsBeforeRightClick !== editorInstance.getData()) {
				            EnableSignDisablePrint();
				        }
				    }
				});
            }
			, 1000);

        }
    }

    function SetModifiedFlag(bModified) {
        if (bModified !== bModifiedFlag) {
            bModifiedFlag = bModified;

            var fwObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
            if (bModified) {
                fwObj.SetPendingData(1);
            }
            else {
                fwObj.SetPendingData(0);
            }
        }
    };

    return {
        AppointmentDialog: function (component) {
            var criterion = component.getCriterion();

            /* prompt for appointment selection*/
            var mpDialog = MP_ModalDialog.retrieveModalDialogObject("mp_cs_appointment");
            var summaryI18n = i18n.discernabu.clinical_summary_o1;

            if (mpDialog) {
                MP_ModalDialog.deleteModalDialogObject("mp_cs_appointment");
            }
            var appointmentDlg = new ModalDialog("mp_cs_appointment");

            //Continue button
            var modalContinue = new ModalButton("modalContinue");
            modalContinue.setText(summaryI18n.APPOINTMENT_CONTINUE);
            appointmentDlg.addFooterButton(modalContinue);
            appointmentDlg.setFooterButtonOnClickFunction("modalContinue", function () {
                CLINICAL_SUMMARY_O1.GetData(component);
            });

            ////Cancel button
            var modalCancel = new ModalButton("modalCancel");
            modalCancel.setText(summaryI18n.APPOINTMENT_CANCEL);
            appointmentDlg.addFooterButton(modalCancel);
            appointmentDlg.setFooterButtonOnClickFunction("modalCancel", function () {
                bAppointmentCancel = true;
                var reply = new MP_Core.ScriptReply(component);
                CLINICAL_SUMMARY_O1.RenderComponent(reply);
            });

            appointmentDlg.setHasGrayBackground(true);

            //Set the width and height attribute
            appointmentDlg.setTopMarginPercentage(10)
						  .setRightMarginPercentage(6)
						  .setBottomMarginPercentage(10)
						  .setLeftMarginPercentage(6)
						  .setIsBodySizeFixed(true)
						  .setIsFooterAlwaysShown(true);

            //Header title
            appointmentDlg.setHeaderTitle(summaryI18n.APPOINTMENT_TITLE).setHeaderCloseFunction(function () {
            });

            //Populae the Dialog with apppointment details
            appointmentDlg.setBodyDataFunction(function (appointmentDlg) {
                var jHTML = [];
                var mpDialog = MP_ModalDialog.retrieveModalDialogObject("mp_cs_appointment");
                var mpBodyId = mpDialog.getBodyElementId();
                var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                var dateBeg = new Date();
                var dateEnd = new Date();
                var defualtChecked = "";

                jHTML.push("<div><div id='mp-cs-appt-title'><span>" + summaryI18n.APPOINTMENT_SUMMARY + "</span></div>" +
							"<table id='mp-cs-appt'><thead><tr><th class = 'mp-cs-appt-opt'></th>" +
							"<th class = 'mp-cs-appt-date'>" + summaryI18n.APPOINTMENT_DATE + "</th>" +
							"<th class = 'mp-cs-appt-loc'>" + summaryI18n.APPOINTMENT_LOCATION + "</th>" +
						    "<th class = 'mp-cs-appt-prsnl'>" + summaryI18n.APPOINTMENT_PROVIDER + "</th>" +
						    "<th class = 'mp-cs-appt-res-visit'>" + summaryI18n.REASON_FOR_VISIT + "</th>" +
						    "</tr></thead><tbody>");

                for (var k = 0, k1 = criterion.encntrs.length; k < k1; k++) {
                    var encntrObj = criterion.encntrs[k];
                    for (var j = 0, j1 = encntrObj.APPOINTMENT.length; j < j1; j++) {
                        var zebraStripping = j % 2 === 0 ? "odd" : "even";
                        var apptObj = encntrObj.APPOINTMENT[j];

                        var dateBeg = apptObj.BEGIN_DT_TM != "" ? df.formatISO8601(apptObj.BEGIN_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR) : "";
                        var dateEnd = apptObj.END_DT_TM != "" ? df.formatISO8601(apptObj.END_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR) : "";

                        jHTML.push(" <tr class='row_" + zebraStripping + "'>"
									 + "<td class = 'mp-cs-appt-opt'><input class = 'appt-selector' type='radio' name='appt' value='" + apptObj.SCH_EVENT_ID + "'/></td>"
									 + "<td class = 'mp-cs-appt-date'>" + dateBeg + "</td>"
									 + "<td class = 'mp-cs-appt-loc'>" + apptObj.APPT_LOCATION + "</td>"
									 + "<td class = 'mp-cs-appt-prsnl'>" + apptObj.ALLOCATED_PROVIDER + "</td>"
									 + "<td class = 'mp-cs-appt-res-visit'>" + apptObj.REASON_FOR_VISIT + "</td>"
									 + "</tr>");
                    }
                }

                jHTML.push("</tbody></table></div>");

                $('#' + mpBodyId).html(jHTML.join(""));


                //add event for radio button
                $('.appt-selector').click(function () {
                    component.SetAppointmentID($(this).get(0).value);
                });
            });

            var mpBodyId = appointmentDlg.getBodyElementId();
            MP_ModalDialog.addModalDialogObject(appointmentDlg);
            MP_ModalDialog.showModalDialog("mp_cs_appointment");
        },
        SiLoggingAndAuditEvent: function (actionType) {
            var sendAr = [];
            var criterion = tempComp.getCriterion();
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.ppr_cd + ".0", criterion.provider_id + ".0", reportId + ".0", actionType, "^" + mediaIdentifier + "^", mediaVersion);
            var request = new MP_Core.ScriptRequest(tempComp, tempComp.getComponentLoadTimerName());
            request.setProgramName("mp_clinical_phi_audit");
            request.setParameters(sendAr);
            request.setAsync(true);
            MP_Core.XMLCCLRequestCallBack(tempComp, request, function (reply) {

                var replyStatus = reply.getStatus();
                if (replyStatus === "S") {
                    MP_Util.LogInfo("CLINICAL SUMMARY : Create PHI audit events logged successfully.");
                }
            });
        },
        GetOwnershipKey: function () {
            var sendAr = [];
            var criterion = tempComp.getCriterion();
            var docType = tempComp.GetDocType();

            if (docType > 0.0 && ownershipKeyValue == "") {

                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", "^" + mediaIdentifier + "^", docType + ".0", "^" + CCDTitle + "^", criterion.ppr_cd + ".0", 1);

                var request = new MP_Core.ScriptRequest(tempComp, tempComp.getComponentLoadTimerName());
                request.setProgramName("mp_clinical_note");
                request.setParameters(sendAr);
                request.setAsync(true);
                MP_Core.XMLCCLRequestCallBack(tempComp, request, function (reply) {
                    var response = reply.getResponse();
                    if (response.STATUS_DATA.STATUS === "S") {
                        ownershipKeyValue = response.OWNERSHIPKEY;
                    }
                });
            }
        },
        CreateClinicalNote: function () {
		    createCheckpoint("CAP:MPG.CS.CREATE CLINICAL NOTE", "Start");
            var summaryI18n = i18n.discernabu.clinical_summary_o1;
            var sendAr = [];
            var criterion = tempComp.getCriterion();
            var docType = tempComp.GetDocType();

            if (docType > 0.0) {
                sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", "^" + mediaIdentifier + "^", docType + ".0", "^" + CCDTitle + "^", criterion.ppr_cd + ".0", 0);

                var request = new MP_Core.ScriptRequest(tempComp, tempComp.getComponentLoadTimerName());
                request.setProgramName("mp_clinical_note");
                request.setParameters(sendAr);
                request.setAsync(true);
                MP_Core.XMLCCLRequestCallBack(tempComp, request, function (reply) {

                    var replyStatus = reply.getStatus();
                    if (replyStatus === "S") {
                        var response = reply.getResponse();
                        ownershipKeyValue = response.OWNERSHIPKEY;

                        DisableSignEnablePrint();
                        MP_Util.LogInfo("CLINICAL SUMMARY : Clinical Note created successfully.");
						createCheckpoint("CAP:MPG.CS.CREATE CLINICAL NOTE", "Stop");
                    }
                    else if (replyStatus === "F") {
                        EnableSignDisablePrint();
					    createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
                        alert(summaryI18n.CLINICAL_NOTE_ERROR);
					    createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop", [{ key: "VS Dialog", value: "Document failed to save as a Clinical Note" }]);
                    }
                    loadingIndicator.hide();
                });
            }
            else {
                DisableSignEnablePrint();
                MP_Util.LogInfo("CLINICAL SUMMARY : Clinical Note can not be created as Document Type is not set.");
                loadingIndicator.hide();
            }
        },
        LogCAMMURLerror: function () {
            var sendAr = [];
            sendAr.push("^MINE^", 1);
            var request = new MP_Core.ScriptRequest(tempComp, tempComp.getComponentLoadTimerName());
            request.setProgramName("mp_clinical_get_url");
            request.setParameters(sendAr);
            request.setAsync(true);
            MP_Core.XMLCCLRequestCallBack(tempComp, request, function (reply) {

                var replyStatus = reply.getStatus();
                //error logged successfully
                if (replyStatus === "S") {
                    MP_Util.LogInfo("CLINICAL SUMMARY : Failed to retrieve the CAMM URL from Service Directory:");
                }
            });
        },
        GetPatientInstructions: function (component, flagForTitle, showFollowUp) {
            var sendAr = [];
            var criterion = component.getCriterion();
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", '"' + flagForTitle + '"', showFollowUp);
            var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
            request.setProgramName("mp_clinical_get_pat_inst");
            request.setParameters(sendAr);
            request.setAsync(true);
            MP_Core.XMLCCLRequestCallBack(component, request, CLINICAL_SUMMARY_O1.UpdateInstruction);
        },
        SavePatientEducation: function (patEdAck) {
            var sendAr = [];
            var criterion = tempComp.getCriterion();
            sendAr.push("^MINE^", criterion.encntr_id + ".0", patEdAck);
            var request = new MP_Core.ScriptRequest(tempComp, tempComp.getComponentLoadTimerName());
            request.setProgramName("mp_clinical_pat_edu_ack");
            request.setParameters(sendAr);
            request.setAsync(true);
            MP_Core.XMLCCLRequestCallBack(tempComp, request, function (reply) {
                var replyStatus = reply.getStatus();
                //error logged successfully
                if (replyStatus !== "S") {
                    MP_Util.LogInfo("CLINICAL SUMMARY : Failed to set the patient education acknowledged indicator");
                }
            });
        },
        GetData: function (component) {
            tempComp = component;
            var sendAr = [];
            var criterion = component.getCriterion();
			var metaData = [{ key: "User ID", value: criterion.provider_id },
                                { key: "Patient ID", value: criterion.person_id },
                                { key: "Encounter ID", value: criterion.encntr_id }];
			createCheckpoint("USR:MPG.CS.LAUNCH VISIT SUMMARY", "Start", metaData);
            var reportTemplateId = component.GetTemplateIds();

            if (component.getPublishButtonLabel() !== "")
                publishButtonLabel = component.getPublishButtonLabel();
            else
                publishButtonLabel = i18n.discernabu.clinical_summary_o1.SIGN;

            displaySaveButton = component.getDisplaySaveButton();

            appointmentID = component.GetAppointmentID() > 0.0 ? component.GetAppointmentID() : 0.0;

            if (reportTemplateId.length > 0)
                var templateId = "value(" + reportTemplateId.join(".0,") + ".0)";
            else
                var templateId = "value(0.0)";


            CLINICAL_SUMMARY_O1.CheckCAMMURL(criterion);
            CLINICAL_SUMMARY_O1.CheckIfCcdExistInCAMM(criterion);

            $('body').append("<div class='largeLoadingSpan'></div>");

            // Always generate a new CCD
            var generateCCD = true;
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.ppr_cd + ".0", templateId, appointmentID + ".0", criterion.provider_id + ".0", generateCCD);
            var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
            request.setProgramName("mp_clinical_ccd");
            request.setParameters(sendAr);
            request.setAsync(true);
            timers.ccdFromFsi.startTime = GetCurrentDate() / 1000;
            MP_Core.XMLCCLRequestCallBack(component, request, CLINICAL_SUMMARY_O1.RenderComponent);
        },
        CheckCAMMURL: function (criterion) {
            var summaryI18n = i18n.discernabu.clinical_summary_o1;
            CAMM_URL = criterion.url;
            SERVICE_DIR_URL = criterion.serviceDirectoryURL;

            if (CAMM_URL === "" && SERVICE_DIR_URL === "") {
			    createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
                alert(summaryI18n.ERROR_RETRIEVE);
				createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop", [{ key: "VS Dialog", value: "CAMM URL is not configured and unable to find SERVICE DIRECTORY URL" }]);
                MP_Util.LogInfo("CLINICAL SUMMARY : CAMM URL is not configured and unable to find SERVICE DIRECTORY URL.");
            }
            else if (CAMM_URL === "") {
                CLINICAL_SUMMARY_O1.GetURL(SERVICE_DIR_URL);

                /*This condition is to check if CAMM URL is retrieved properly from Service Directory*/
                if (CAMM_URL === "") {
				    createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
                    alert(summaryI18n.ERROR_RETRIEVE);
					createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop", [{ key: "VS Dialog", value: "Unable to retrieve CAMM URL from SERVICE DIRECTORY" }]);
                    MP_Util.LogInfo("CLINICAL SUMMARY : Unable to retrieve CAMM URL from SERVICE DIRECTORY.");
                }
            }

        },
        CheckIfCcdExistInCAMM: function (criterion) {
            timers.checkCcdExist.startTime = GetCurrentDate() / 1000;
            var person_id = criterion.person_id;
            var encntr_id = criterion.encntr_id;
            var cammUrl = CAMM_URL;
            var mediaAPI = "media?";
            var PersonID = "personId=" + person_id;
            var encntrId = "&encounterId=" + encntr_id;
            var entityName = "&entityName=ClinicalSummaryPub";
            var entityIdString = "&entityIdString=YES";
            var summaryI18n = i18n.discernabu.clinical_summary_o1;
            var getURL;


            if (appointmentID > 0)
                getURL = cammUrl + mediaAPI + "personId=" + person_id + "&encounterId=" + encntr_id + "&contentType=CLIN_SUM" + "&entityName=APPOINTMENT&entityId=" + appointmentID;
            else
                getURL = cammUrl + mediaAPI + "personId=" + person_id + "&encounterId=" + encntr_id + "&contentType=CLIN_SUM";

            restAPIClient.open("GET", getURL, false);
            window.location = "javascript:MPAGES_SVC_AUTH(restAPIClient)";
            restAPIClient.send(null);

            if (restAPIClient.readyState === 4 && restAPIClient.status === 200) {
                var mediaReply = json_parse(restAPIClient.responseText);
                if (mediaReply.length == 0) {
                    timers.checkCcdExist.endTime = GetCurrentDate() / 1000;
                    LogTimerToConsole(timers.checkCcdExist);
                    return;
                }

                var mediaObj = mediaReply[0];
                for (var i = 1, il = mediaReply.length; i < il; i++) {
                    var mediaTestObj = mediaReply[i];
                    var serviceDate = new Date(mediaObj.serviceDate * 1000);
                    var serviceTestDate = new Date(mediaTestObj.serviceDate * 1000);
                    if (serviceDate < serviceTestDate) {
                        mediaObj = mediaTestObj;
                    }
                }

                for (var cr = 0, crl = mediaObj.crossReference.length; cr < crl; cr++) {
                    if (mediaObj.crossReference[cr].parentEntityName === "DOCUMENT_ID") {
                        docExistsInCamm = false;
                        timers.checkCcdExist.endTime = GetCurrentDate() / 1000;
                        LogTimerToConsole(timers.checkCcdExist);
                        return;
                    }
                    else if (mediaObj.crossReference[cr].parentEntityName === "APPOINTMENT") { //This means CCD is saved once, as APPOINTMENT cross ref is added only on save
                        docExistsInCamm = true;
                        mediaIdentifier = mediaObj.identifier;
                        mediaVersion = mediaObj.version;
                        MP_Util.LogInfo("CLINICAL SUMMARY : Media Identifier of the saved document: " + mediaIdentifier + " " + mediaVersion);
                        var xmlString = CLINICAL_SUMMARY_O1.RetrieveMediaContent();
                        savedXmlDoc.loadXML(xmlString);
                        timers.checkCcdExist.endTime = GetCurrentDate() / 1000;
                        LogTimerToConsole(timers.checkCcdExist);
                        return;
                    }
                    else if (mediaObj.crossReference[cr].parentEntityName === "ClinicalSummaryPub") {
                        docExistsInCamm = false;
                        timers.checkCcdExist.endTime = GetCurrentDate() / 1000;
                        LogTimerToConsole(timers.checkCcdExist);
                        return;
                    }

                }
            } else {
			    createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
                alert(summaryI18n.ERROR_RETRIEVE);
				createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop", [{ key: "VS Dialog", value: "Error while checking if CCD exist in CAMM" }]);
                MP_Util.LogInfo("CLINICAL SUMMARY : Error while checking if CCD exist in CAMM.");
            }
            timers.checkCcdExist.endTime = GetCurrentDate() / 1000;
            LogTimerToConsole(timers.checkCcdExist);
        },
        CreateNewCCD: function (reply) {
            timers.createNewCcd.endTime = GetCurrentDate() / 1000;
            EnableSignDisablePrint(); //Enable back the sign and save button.
            LogTimerToConsole(timers.createNewCcd);
            var count = 0, rowCount = 0, objXMLElements, tagName = "", htmlStr = "";
            var replyStatus = reply.getStatus();
            if (replyStatus === "S") {
                var recordData = reply.getResponse();
                reportId = recordData.REPORT_TEMPLATE_ID;

                if (window.ActiveXObject) {
                    if (recordData.MEDIA_IDENTIFIER !== "")
                        mediaIdentifier = recordData.MEDIA_IDENTIFIER;

                    if (CAMM_URL !== "") {
                        var xmlString = CLINICAL_SUMMARY_O1.RetrieveMediaContent();
                        xmlDoc.loadXML(xmlString);                        
                        htmlStr = xmlDoc.transformNode(xslDoc); // xml to html conversion
                    }
                }

                if (htmlStr !== "") {
                    $("div.loadingSpan").hide();
                    timers.spinnerTimeInCreateNewCcd.endTime = GetCurrentDate() / 1000;
                    LogTimerToConsole(timers.spinnerTimeInCreateNewCcd);
                    $("div#clin-sum").html($(htmlStr));
                }

                var strXML = $.parseXML(xmlDoc.xml);
                $objXMLElements = $(strXML);

                $objXMLElements.find("section").each(function () {
                    $(this).find("text:first").each(function () {
                        var nextTagName = "paragraph";
                        var childrenLength = $(this).children().length;
                        for (var j = 0; j < childrenLength; j++) {
                            nextTagName = $(this).children().get(j).tagName;
                            if (nextTagName === "table")
                                break;
                        }

                        //var nextTagName = $(this).children().get(0).tagName;
                        switch (nextTagName) {
                            case "table":
                                {
                                    $(this).find('tr').each(function () {
                                        $(this).text();
                                        if ($(this).parent().length > 0)
                                            tagName = $(this).parent().get(0).tagName;

                                        if (tagName.toUpperCase() === "TBODY") {
                                            var objTD = [];
                                            var objContentID = [];

                                            rowCount = rowCount + 1;
                                            id.push("ROW_" + rowCount);

                                            /* store the column details in objTR */
                                            $(this).find('td').each(function () {
                                                if ($(this).text() != "") {
                                                    objTD.push($(this).text());
                                                }
                                            });

                                            /* store the Content ID's  in objTRContentID */
                                            $(this).find('content').each(function () {
                                                objContentID.push($(this).attr('ID'));
                                            });
                                            if (objTD.length > 0) {
                                                objTR[id[count]] = objTD;
                                                objTRContentID[id[count]] = objContentID;
                                                count = count + 1;
                                            }
                                        }
                                    }); //tr
                                    break;
                                }
                            case "paragraph":
                                {
                                    $(this).find("paragraph").each(function () {
                                        if ($(this).find("content:first").attr("ID") !== undefined && $(this).find("content:first").text() !== "No data available for this section") {

                                            var objTD = [];
                                            var objContentID = [];

                                            rowCount = rowCount + 1;
                                            id.push("ROW_" + rowCount);

                                            /*Store paragraph details i.e. text in objTD*/
                                            if ($(this).text() != "") {
                                                objTD.push($(this).text());
                                            }
                                            /* store the Content ID's  in objTRContentID */
                                            $(this).find('content').each(function () {
                                                objContentID.push($(this).attr('ID'));
                                            });

                                            if (objTD.length > 0) {
                                                objTR[id[count]] = objTD;
                                                objTRContentID[id[count]] = objContentID;
                                                count = count + 1;
                                            }
                                        }

                                    });
                                    break;
                                }
                        } //switch ends
                    });

                });

                AddInstructionSubSection();
                ApplyCheckBoxes();
                CreateTextEditor(document.getElementById("commentsTextArea"), tempComp.getCriterion());
				createCheckpoint("USR:MPG.CS.CREATE NEW VISIT SUMMARY", "Stop", [{ key: "Media ID", value: mediaIdentifier }]);
            }
        },
        RenderComponent: function (reply) {
            timers.ccdFromFsi.endTime = GetCurrentDate() / 1000;
            LogTimerToConsole(timers.ccdFromFsi);
            $("div.largeLoadingSpan").show();
            timers.spinnerTimeInRenderComponent.startTime = GetCurrentDate() / 1000;
            document.documentElement.style.overflow = 'hidden';  // firefox, chrome
            document.body.scroll = "no"; // ie only

            var component = reply.getComponent();
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            var summaryI18n = i18n.discernabu.clinical_summary_o1;
            var patEduAck = 0;

            SetModifiedFlag(false);

            try {
                var sHTML = "", countText = "", jsHTML = [], calItems = [], count = 0, rowCount = 0, objXMLElements, tagName = "", htmlStr = "";

                var criterion = component.getCriterion();
                displaySaveAs = SAVE_AS_PREF;
                staticContentPath = CERN_static_content;

                var replyStatus = reply.getStatus();
                if (bAppointmentCancel === true) {
                    jsHTML.push("<div><span class='errSpan'>" + summaryI18n.APPOINTMENT_CANCEL_MESSAGE + "</span></div>");
                    bAppointmentCancel = false;
                }
                else if (replyStatus !== "S") {
                    //If there is failure returned or 'Z' status returned , show the inline message
                    jsHTML.push("<div><span class='errSpan'>" + summaryI18n.ERROR_RETRIEVE + "</span></div>");
                }
                else if (CAMM_URL === "" && SERVICE_DIR_URL === "") {
                    //If there is failure returned or 'Z' status returned , show the inline message
                    jsHTML.push("<div><span class='errSpan'>" + summaryI18n.ERROR_RETRIEVE + "</span></div>");
                    MP_Util.LogInfo("CLINICAL SUMMARY : CAMM URL is not configured");
                }
                else {
                    var newMediaId = "";
                    var recordData = reply.getResponse();
                    reportId = recordData.REPORT_TEMPLATE_ID;
                    addDocpriv = recordData.ADD_DOC_PRIV;

                    if (window.ActiveXObject) {
                        if (recordData.MEDIA_IDENTIFIER !== "") {
                            if (mediaIdentifier === "") {
                                mediaIdentifier = recordData.MEDIA_IDENTIFIER;

                            } else {
                                newMediaId = recordData.MEDIA_IDENTIFIER;
                            }

                        }


                        if (CAMM_URL !== "") {
                            mediaVersion = 1;
                            var xmlString = CLINICAL_SUMMARY_O1.RetrieveMediaContent(newMediaId);

                            xmlDoc.loadXML(xmlString);
                            var styleSheetLocation = CERN_static_content.concat("\\xsl\\cscda.xsl");
                            xslDoc.load(styleSheetLocation);
                            htmlStr = xmlDoc.transformNode(xslDoc); // xml to html conversion

                            // Disable the newly created document if a document already exists, as it was previously saved
                            if (docExistsInCamm) {
                                DisableDocumentInCamm(newMediaId);
                                newFsiMediaId = newMediaId;
                            }
                        }

                    }

                    if (recordData.ADD_MEDIA_PRIV) {
                        var setDithered = "";
                    } else {
                        var setDithered = "disabled";
                    }

                    patEduAck = recordData.PAT_EDU_ACK_IND;

                    if (htmlStr !== "") {
                        jsHTML.push("<div id='mainDiv'>"
								+ "<div id ='clin-sum'></div>"
								+ "<div id = 'dummyDiv'></div>"
								+ "<div id ='footerButtonDiv'>"
								+ "<div id='patEduDiv'><input type= 'checkbox' id='patEduChk'>&nbsp<span id='patEduTextSpan'>" + summaryI18n.PATIENT_EDUCATION + "</span></div>");


                        if (displaySaveAs === "1") {
                            jsHTML.push("<div id='cmdSaveAs' class='divButtonStyle' disabled>" + summaryI18n.SAVE_AS + "</div>");
                        }
                        jsHTML.push("<div id='cmdPrintOption' class='divButtonStyle' disabled></div>"
                                + "<div id='cmdPrint' class='divButtonStyle' disabled>" + summaryI18n.PRINT + "</div>"
								+ "<div id='cmdSubmit' class='divButtonStyle'>" + publishButtonLabel + "</div>");

                        if (displaySaveButton) {
                            jsHTML.push("<div id='cmdSave' class='divButtonStyle'>" + summaryI18n.SAVE + "</div>");
                        }

                        jsHTML.push("<div id='cmdCreateNew' class='divButtonStyle'>" + summaryI18n.CREATE_NEW + "</div>"
								+ "</div>" //close div#footerButtonDiv
                                + "</div>"); //close div#clin-sum 


                        jsHTML.push("<div id='printOptionDropDownDiv'><table>"
								+ "<tr id='trPrint'><td>" + summaryI18n.PRINT + "</td></tr>"
								+ "<tr id='trPrintPreview'><td>" + summaryI18n.PRINT_PREVIEW + "</td></tr>"
								+ "</table>"
                                + "</div>"); //close div#mainDiv
                    }
                    else {
                        //If there is failure returned or 'Z' status returned , show the inline message
                        jsHTML.push("<div><span class='errSpan' >" + summaryI18n.ERROR_RETRIEVE + "</span></div>");
                    }
                }

                sHTML = jsHTML.join("");
                $(sHTML).appendTo('body');

                $("#dummyDiv").css("display", "none");
                if (displaySaveAs === "1")
                    $("#printOptionDropDownDiv").css("right", "141px");
                else
                    $("#printOptionDropDownDiv").css("right", "29px");

                var toc = $(htmlStr).find("#toc");
                $(toc).find("a").each(function () {
                    if ($(this).text().indexOf("DEL_") > -1) {
                        var tempTitle = $(this).text();
                        var correctTitle = $(this).text().slice(4);
                        htmlStr = htmlStr.replace(new RegExp(tempTitle, 'g'), correctTitle);
                    }
                });
                var endIndex = htmlStr.search("<b>Comments</b>");
                var startIndex = htmlStr.indexOf("</p>", endIndex);

                if (endIndex !== -1 && startIndex !== -1) {
                    var newHtmlStr = htmlStr.slice(0, endIndex) + htmlStr.slice(startIndex);
                    $("div#clin-sum").append($(newHtmlStr));
                }
                else
                    $("div#clin-sum").append($(htmlStr));

                if (patEduAck == 1)
                    $("#patEduChk").attr("checked", "checked");

                // Get the checkboxes and comments from the savedXml to the newly displayed XML
                mergeXmls();
                var freeTextComments = "";

                $objXMLElements.find("section").each(function () {
                    var templateId = $(this).find("templateId").attr('root');
                    //Find the saved unselected sections (which do not have rows) and store in array 
                    var tempSectionTitle = $(this).find("title").text();
                    if (tempSectionTitle.indexOf("DEL_") !== -1) {
                        var sectionTitle = tempSectionTitle.slice(4);
                        unselectedSectionSavedInCCD.push(sectionTitle);
                        sectionToBeDeselected.push(sectionTitle);
                        $(this).find("title").text(sectionTitle);
                    }

                    //If any free text is saved, get it so that it can be displayed in the text area
                    if ($.inArray(templateId, identifiers.Instructions) > -1) {
                        $(this).find("paragraph").each(function () {
                            $(this).find("content").each(function () {
                                if ($(this).attr("ID") !== undefined && $(this).attr("ID").indexOf("FREETEXT_") > -1) {
                                    if ($(this).text() !== "")
                                        freeTextComments = freeTextComments + $(this).text() + "</br>";
                                    else
                                        freeTextComments = freeTextComments + "</br>";
                                }
                            });
                        });
                    }

                    //Find the id's with DEL_ in content, paragraph and save them in the array

                    //This is to find the id's in content with DEL_
                    $(this).find("content").each(function () {
                        var groupFound;
                        var itemFound;
                        var contentId = $(this).attr("ID");
                        if (contentId != null) {
                            itemFound = contentId.search(/ITEM_/);
                            groupFound = contentId.search(/GROUP_/);
                        }
                        if (groupFound > -1) {
                            if (contentId.indexOf("DEL_") > -1) {
                                var tempContentId2 = contentId.slice(4);
                                if ($.inArray(tempContentId2, deselectedGroups) == -1) {
                                    deselectedGroups.push(tempContentId2);
                                }
                            }
                        }
                        if (itemFound > -1) {
                            if (contentId.indexOf("DEL_") > -1) {
                                var tempContentId = contentId.slice(4);
                                $(this).attr("ID", tempContentId);
                                if ($.inArray(tempContentId, deselectedItems) == -1) {
                                    deselectedItems.push(tempContentId);
                                }
                                var newId = $(this).attr("ID");
                            }
                        }
                    });

                    //This is to find the id's in paragraph with DEL_
                    $(this).find("paragraph").each(function () {
                        var itemParagraph;
                        var groupParagraph;
                        var paragraphId = $(this).attr("ID");
                        if (paragraphId != null) {
                            groupParagraph = paragraphId.search(/GROUP_/);
                            itemParagraph = paragraphId.search(/ITEM_/);
                        }
                        if (groupParagraph > -1) {
                            if (paragraphId.indexOf("DEL_") > -1) {
                                var tempParagraphId2 = paragraphId.slice(4);
                                if ($.inArray(tempParagraphId2, deselectedGroups) == -1) {
                                    deselectedGroups.push(tempParagraphId2);
                                }
                            }

                        }
                        if (itemParagraph > -1) {
                            $(this).find("content:first").each(function () {
                                var tempParagraphId;
                                var paragraphContentId = $(this).attr("ID");
                                if (paragraphContentId != null) {
                                    if (paragraphContentId.indexOf("DEL_") > -1) {
                                        tempParagraphId = paragraphContentId.slice(4);
                                        if ($.inArray(paragraphId, deselectedItems) === -1) {
                                            deselectedItems.push(paragraphId);
                                        }
                                    }
                                }
                            });
                        }
                    });


                    //This is to find the id's in table with DEL_
                    $(this).find("table").each(function () {
                        var groupTable;
                        var tableId = $(this).attr("ID");
                        if (tableId != null) {
                            groupTable = tableId.search(/GROUP_/);
                        }
                        if (groupTable > -1) {
                            if (tableId.indexOf("DEL_") > -1) {
                                var tempTable = tableId.slice(4);
                                if ($.inArray(tempTable, deselectedGroups) === -1) {
                                    deselectedGroups.push(tempTable);
                                }
                            }
                        }

                    });

                    //Don't delete this code this is TO-DO in Future.
                    //This is to find the id's in list with DEL_
                    /* $(this).find("list").each(function () {
                    var listId = $(this).attr("ID");
                    if (listId != undefined || listId != null) {
                    var groupList = listId.search(/GROUP_/);
                    }
                    if (groupList > -1) {
                    if (listId.indexOf("DEL_") !== -1) {
                    var tempList = listId.slice(4);
                    if ($.inArray(tempList, deselectedGroups) == -1) {
                    deselectedGroups.push(tempList);
                    }
                    }
                    }

                    }); */

                    //Don't delete this code this is TO-DO in Future.
                    //This is to find the id's in tr with DEL_
                    /* $(this).find("tr").each(function () {
                    var trId = $(this).attr("ID");
                    if (trId != undefined || trId != null) {
                    var itemTr = trId.search(/ITEM_/);
                    }
                    if (itemTr > -1) {
                    $(this).find("content:first").each(function () {
                    var tempTrId;
                    var trContentId = $(this).attr("ID");
                    if (trContentId != undefined) {
                    if (trContentId.indexOf("DEL_") !== -1)
                    tempTrId = trContentId.slice(4);
                    if ($.inArray(trId, deselectedItems) == -1) {
                    deselectedItems.push(trId);
                    }

                    }
                    });
                    }
                    }); */

                    $(this).find("tr").each(function () {
                        var itemTr;
                        var trId = $(this).attr("ID");
                        if (trId != null) {
                            itemTr = trId.search(/ITEM_/);
                        }

                        if (itemTr > -1) {
                            if (trId.indexOf("DEL_") > -1) {
                                var tempTrId = trId.slice(4);
                                $(this).attr("ID", tempTrId);
                                if ($.inArray(tempTrId, deselectedItems) === -1) {
                                    deselectedItems.push(tempTrId);
                                }

                            }
                        }
                    });


                    //Don't delete this code this is TO-DO in Future.

                    //This is to find the id's in item with DEL_
                    /* $(this).find("item").each(function () {
                    var itemId = $(this).attr("ID");
                    if (itemId != undefined || itemId != null) {
                    var itemList = itemId.search(/ITEM_/);
                    }
                    if (itemList > -1) {
                    $(this).find("content:first").each(function () {
                    var tempItemId;
                    var itemContentId = $(this).attr("ID");
                    if (itemContentId != undefined) {
                    if (itemContentId.indexOf("DEL_") !== -1)
                    tempItemId = itemContentId.slice(4);
                    if ($.inArray(itemId, deselectedItems) == -1) {
                    deselectedItems.push(itemId);
                    }
                    }
                    });
                    }
                    }); */




                    //find the column details and content id of each row of data displayed in table format
                    //also find paragraph text and its content id for data displayed in paragraph format
                    $(this).find("text:first").each(function () {
                        //var nextTagName = $(this).children().get(0).tagName;
                        var nextTagName = "paragraph";
                        var childrenLength = $(this).children().length;
                        for (var j = 0; j < childrenLength; j++) {
                            nextTagName = $(this).children().get(j).tagName;
                            if (nextTagName === "table")
                                break;
                        }
                        switch (nextTagName) {
                            case "table":
                                {
                                    $(this).find('tr').each(function () {
                                        $(this).text();
                                        if ($(this).parent().length > 0)
                                            tagName = $(this).parent().get(0).tagName;

                                        if (tagName.toUpperCase() === "TBODY") {
                                            var objTD = [];
                                            var objContentID = [];

                                            rowCount = rowCount + 1;
                                            id.push("ROW_" + rowCount);

                                            /* store the column details in objTR */
                                            $(this).find('td').each(function () {
                                                if ($(this).text() != "") {
                                                    objTD.push($(this).text());
                                                }
                                            });

                                            /* store the Content ID's  in objTRContentID */
                                            $(this).find('content').each(function () {
                                                var contentID = $(this).attr('ID');
                                                var xmlContentID;
                                                //remove the DEL_ prefix from the content IDs before storing in the array.
                                                if (contentID !== undefined) {
                                                    if (contentID.indexOf("DEL_") > -1) {
                                                        xmlContentID = contentID.slice(4);
                                                        deselectedRowIds.push(xmlContentID);
                                                    }
                                                    else
                                                        xmlContentID = contentID;
                                                }

                                                objContentID.push(xmlContentID);

                                            });
                                            if (objTD.length > 0) {
                                                objTR[id[count]] = objTD;
                                                objTRContentID[id[count]] = objContentID;
                                                count = count + 1;
                                            }
                                        }
                                    }); //tr
                                    break;
                                }
                            case "paragraph":
                                {
                                    var itemPrefixFound = false;
                                    $(this).find('paragraph').each(function (index) {
                                        var paraID = $(this).attr("ID");
                                        if (paraID) {
                                            var itemPara = paraID.search(/ITEM_/);
                                            if (itemPara > -1) {
                                                itemPrefixFound = true;
                                                return false;
                                            } else {
                                                $(this).find('content').each(function () {
                                                    var contentID = $(this).attr("ID");
                                                    if (contentID) {
                                                        var itemContent = contentID.search(/ITEM_/);
                                                        if (itemContent > -1) {
                                                            itemPrefixFound = true;
                                                            return false;
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    if (!itemPrefixFound) {
                                        $(this).find("paragraph").each(function () {
                                            if ($(this).find("content:first").attr("ID") !== undefined && $(this).find("content:first").text() !== "No data available for this section") {

                                                var objTD = [];
                                                var objContentID = [];

                                                rowCount = rowCount + 1;
                                                id.push("ROW_" + rowCount);

                                                /*Store paragraph details i.e. text in objTD*/
                                                if ($(this).text() != "") {
                                                    objTD.push($(this).text());
                                                }
                                                /* store the Content ID's  in objTRContentID */
                                                $(this).find('content').each(function () {
                                                    var contentID = $(this).attr('ID');
                                                    var xmlContentID;
                                                    //remove the DEL_ prefix from the content IDs before storing in the array.
                                                    if (contentID !== undefined) {
                                                        if (contentID.indexOf("DEL_") > -1) {
                                                            xmlContentID = contentID.slice(4);
                                                            deselectedRowIds.push(xmlContentID);
                                                        }
                                                        else
                                                            xmlContentID = contentID;
                                                    }

                                                    objContentID.push(xmlContentID);
                                                });

                                                if (objTD.length > 0) {
                                                    objTR[id[count]] = objTD;
                                                    objTRContentID[id[count]] = objContentID;
                                                    count = count + 1;
                                                }
                                            }

                                        });
                                    }

                                    break;
                                }
                        }

                    });

                });

                AddInstructionSubSection();
                ApplyCheckBoxes();
                CreateTextEditor(document.getElementById("commentsTextArea"), criterion);
                if (freeTextComments !== "") {
                    editorInstance.setData(freeTextComments);
                    instSectionChanged = true;
                }

                documentEvents();
                setPanelHeight();
                $("div.largeLoadingSpan").hide();
                timers.spinnerTimeInRenderComponent.endTime = GetCurrentDate() / 1000;
                LogTimerToConsole(timers.spinnerTimeInRenderComponent);

                //Check and retrieve ownershipkey
                CLINICAL_SUMMARY_O1.GetOwnershipKey();
                timers.mpageLoadTime.startTime = startTime / 1000;
                timers.mpageLoadTime.endTime = GetCurrentDate() / 1000;
                LogTimerToConsole(timers.mpageLoadTime);
				createCheckpoint("USR:MPG.CS.LAUNCH VISIT SUMMARY", "Stop", [{ key: "Media ID", value: recordData.MEDIA_IDENTIFIER }]);
            }
            catch (err) {
                if (timerRenderComponent) {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                MP_Util.LogInfo("CLINICAL SUMMARY :" + err.message);
            }
            finally {
                if (timerRenderComponent)
                    timerRenderComponent.Stop();
            }
        },

        GetURL: function (url) {
            try {
                getURL = url + "/keys/urn:cerner:api:mmf-camm-mpage-app-service-1.0.json";

                restAPIClient.open("GET", getURL, false);
                window.location = "javascript:MPAGES_SVC_AUTH(restAPIClient)";
                restAPIClient.send(null);

                if (restAPIClient.readyState === 4 && restAPIClient.status === 200) {
                    var Links = json_parse(restAPIClient.responseText);
                    CAMM_URL = Links.link;
                    MP_Util.LogInfo("CLINICAL SUMMARY : " + CAMM_URL);
                }
                else {
                    CLINICAL_SUMMARY_O1.LogCAMMURLerror();
                }
            }
            catch (err) {
                // on error or on unsuccessful log error
                CLINICAL_SUMMARY_O1.LogCAMMURLerror();
            }
        },

        /*Implemented to save the updated CCD to CAMM Archive */
        SaveToCAMMArchive: function (ccdXML) {
            var criterion = tempComp.getCriterion();
            var person_id = criterion.person_id;
            var encntr_id = criterion.encntr_id;
            var url = CAMM_URL;
            var storeAPI = "CLIN_SUM/store?";
            var mediaAPI = "media?";
            var PersonID = "personId=" + person_id;
            var encntrId = "&encounterId=" + encntr_id;
            var mimeType = "&mimeType=application/xml; charset=UTF-8";
            var name = "&name=" + CCDTitle;
            var identifier = "&identifier=" + mediaIdentifier;
            var version = "&version=" + mediaVersion;
            var entityName = "&entityName=ClinicalSummaryPub";
            var entityIdString = "&entityIdString=YES";
            var ownershipKey = "&ownershipKey=" + ownershipKeyValue;
            var mediaAlreadyExistsInCAMM = false;
            var timeExec = "&ms=" + new Date().getTime(); //to by pass the cache
            var summaryI18n = i18n.discernabu.clinical_summary_o1;

            GetMedia = function () {

                /*Get the Media  */
                var getURL = url + mediaAPI + "personId=" + person_id + "&encounterId=" + encntr_id;

                restAPIClient.open("GET", getURL, false);
                window.location = "javascript:MPAGES_SVC_AUTH(restAPIClient)";
                restAPIClient.send(null);

                if (restAPIClient.readyState === 4 && restAPIClient.status === 200) {
                    var mediaReply = json_parse(restAPIClient.responseText);

                    //Retrieve the version number for the media
                    for (var i = 0, il = mediaReply.length; i < il; i++) {
                        var mediaObj = mediaReply[i];

                        if (mediaObj.identifier === mediaIdentifier) {
                            mediaVersion = mediaObj.version;
                            version = "&version=" + mediaVersion;
                            mediaAlreadyExistsInCAMM = true;
                            break;
                        }
                    }
                    SaveMedia();
                }
                else if (restAPIClient.readyState === 4 && restAPIClient.status !== 200) {
				    createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
                    alert(summaryI18n.CREATE_ERROR);
					createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop", [{ key: "VS Dialog", value: summaryI18n.CREATE_ERROR }]);
                    loadingIndicator.hide();
                }
            };

            SaveMedia = function () {
                /*Store the CCD to CAMM using rest STORE API  */
                var postURL = "";
                var xRefString;
                if (mediaAlreadyExistsInCAMM === true) {
                    if (saveCCD === true) {
                        xRefString = "&entityName=APPOINTMENT&entityId=" + appointmentID;
                        if (ownershipKeyValue == "") //Ownershipkey will exist if once document is signed
                            postURL = url + storeAPI + PersonID + encntrId + mimeType + name + identifier + version + xRefString + timeExec;
                        else
                            postURL = url + storeAPI + PersonID + encntrId + mimeType + name + identifier + version + xRefString + timeExec + ownershipKey;
                    } else { //publish
                        if (ownershipKeyValue == "")
                            postURL = url + storeAPI + PersonID + encntrId + mimeType + name + identifier + version + entityName + entityIdString + timeExec;
                        else
                            postURL = url + storeAPI + PersonID + encntrId + mimeType + name + identifier + version + entityName + entityIdString + timeExec + ownershipKey;
                    }
                    restAPIClient.open('POST', postURL, false);
                    window.location = "javascript:MPAGES_SVC_AUTH(restAPIClient)";
                    restAPIClient.send(ccdXML.xml);
                }
                else {
                    if (saveCCD === true) {
                        var xRefString = "&entityName=APPOINTMENT&entityId=" + appointmentID;
                        postURL = url + storeAPI + PersonID + encntrId + mimeType + name + xRefString + timeExec;
                    }
                    else
                        postURL = url + storeAPI + PersonID + encntrId + mimeType + name + entityName + entityIdString + timeExec;

                    restAPIClient.open('POST', postURL, false);
                    window.location = "javascript:MPAGES_SVC_AUTH(restAPIClient)";
                    restAPIClient.send(ccdXML.xml);
                }

                if (restAPIClient.readyState === 4 && restAPIClient.status === 200) {

                    mediaIdentifier = restAPIClient.responseText;

                    if (mediaAlreadyExistsInCAMM)
                        mediaVersion = mediaVersion + 1;

                    if (saveCCD === false) { //means CCD is published
                        /*Call the PHI audit Event and SI DOC Info loggings*/
                        CLINICAL_SUMMARY_O1.SiLoggingAndAuditEvent(0);
                        if (addDocpriv === 1) {
                            /*Create Clinical Note */
                            CLINICAL_SUMMARY_O1.CreateClinicalNote();
                        }
                        else {
                            DisableSignEnablePrint();
                            loadingIndicator.hide();
                        }
							createCheckpoint("USR:MPG.CS.SIGN VISIT SUMMARY", "Stop", [{ key: "Media ID", value: mediaIdentifier }]);
                    }
                    else { //when CCD is saved
                        $("#cmdSave").prop('disabled', true);
                        saveCCD = false; //reset it
                        loadingIndicator.hide();
							createCheckpoint("USR:MPG.CS.SAVE VISIT SUMMARY", "Stop", [{ key: "Media ID", value: mediaIdentifier }]);
                    }
                }
                else if (restAPIClient.readyState === 4 && restAPIClient.status !== 200) {
				        createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
                    alert(summaryI18n.CREATE_ERROR);
				        createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop", [{ key: "VS Dialog", value: summaryI18n.CREATE_ERROR }]);
                    loadingIndicator.hide();
                }
            };

            GetMedia();
        }
		,
        /*Function: To retrieve the HTML for the modified CCD from CAMM , for Printing  */
        xmlToHTML: function (newMediaId) {
            timers.xmlToHtml.startTime = GetCurrentDate() / 1000;
            var url = CAMM_URL;
            var mediaAPI = "xmlToHTML/";
            var identifier = mediaIdentifier + "?";
            var version = "version=" + mediaVersion;
            var encoding = "&encoding=UTF-8";
            var timeExec = "&ms=" + new Date().getTime(); //to by pass the cache
            var modifiedCCD = "";
            var summaryI18n = i18n.discernabu.clinical_summary_o1;
            if (newMediaId) {
                identifier = newMediaId + "?";
            }
            /*Get the MediaContent  */
            var getURL = url + mediaAPI + identifier + version + encoding + timeExec;
            restAPIClient.open('GET', getURL, false);
            window.location = "javascript:MPAGES_SVC_AUTH(restAPIClient)";
            restAPIClient.send(null);

            if (restAPIClient.readyState === 4 && restAPIClient.status === 200) {
                modifiedCCD = restAPIClient.responseText;
            }
            else if (restAPIClient.readyState === 4 && restAPIClient.status !== 200) {
			    createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
                alert(summaryI18n.RETRIEVE_ERROR);
				createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop", [{ key: "VS Dialog", value: "Error while converting Xml to Html" }]);
                modifiedCCD = "";
                $("#cmdPrint").prop('disabled', true);
                $("#cmdPrintOption").prop('disabled', true);
            }
            timers.xmlToHtml.endTime = GetCurrentDate() / 1000;
            LogTimerToConsole(timers.xmlToHtml);
            return (modifiedCCD);
        },

        /*Function: To retrieve the modified CCD from CAMM , for SAVE AS */
        RetrieveMediaContent: function (newMediaId) {
            timers.xmlFromCamm.startTime = GetCurrentDate() / 1000;
            var url = CAMM_URL;
            var mediaAPI = "mediaContent/";
            var identifier = mediaIdentifier + "?";
            var version = "version=" + mediaVersion;
            var timeExec = "&ms=" + new Date().getTime(); //to by pass the cache
            var modifiedCCD = "";
            var summaryI18n = i18n.discernabu.clinical_summary_o1;

            if (newMediaId) {
                identifier = newMediaId + "?";
            }
            /*Get the MediaContent  */
            var getURL = url + mediaAPI + identifier + version + timeExec;
            restAPIClient.open('GET', getURL, false);
            window.location = "javascript:MPAGES_SVC_AUTH(restAPIClient)";
            restAPIClient.send(null);

            if (restAPIClient.readyState === 4 && restAPIClient.status === 200) {
                modifiedCCD = restAPIClient.responseText;
            }
            else if (restAPIClient.readyState === 4 && restAPIClient.status !== 200) {
			    createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Start");
                alert(summaryI18n.RETRIEVE_ERROR);
				createCheckpoint("DLG:MPG.CS.VISIT SUMMARY", "Stop", [{ key: "VS Dialog", value: "Error while retrieving media content" }]);
                modifiedCCD = "";
                $("#cmdSaveAs").prop('disabled', true);
            }
            timers.xmlFromCamm.endTime = GetCurrentDate() / 1000;
            LogTimerToConsole(timers.xmlFromCamm);
            return (modifiedCCD);
        }
		,
        /*Function: To Save the modified CCD and style sheet to jump drive */
        SaveAsFile: function () {
            var criterion = tempComp.getCriterion();
            var personnelArray = MP_Util.LoadPersonelListJSON(criterion.PRSNL);
            userName = MP_Util.GetValueFromArray(criterion.provider_id, personnelArray).userName;
            domainName = criterion.current_domain;

            var modifiedCCD = CLINICAL_SUMMARY_O1.RetrieveMediaContent();

            if (modifiedCCD !== "") {
                try {
                    var fwObj = window.external.DiscernObjectFactory("PVCCD");
                    fwObj.XMLDoc = modifiedCCD;
                    fwObj.MediaIdentifier = mediaIdentifier;
                    fwObj.MediaVersion = mediaVersion;
                    fwObj.UserName = userName;
                    fwObj.DomainName = domainName;
                    fwObj.SaveFileToDrive();

                    /*SI DOC Info loggings*/
                    CLINICAL_SUMMARY_O1.SiLoggingAndAuditEvent(2);
					createCheckpoint("USR:MPG.CS.SAVE VISIT SUMMARY LOCALLY", "Stop", [{ key: "Media ID", value: mediaIdentifier }]);
                }
                catch (err) {
                    MP_Util.LogInfo("CLINICAL SUMMARY :" + err.message);
                }
            }
        },
        SaveCCD: function () {
            var lenOfSectionToBeDeselected = sectionToBeDeselected.length;
            var summaryI18n = i18n.discernabu.clinical_summary_o1;
            var xmlContentID;
            var ccdXML = new ActiveXObject("Microsoft.XMLDOM");
            ccdXML.async = false;
            ccdXML = $.parseXML(xmlDoc.xml);

            $(ccdXML).find("section").each(function () {
                //this is to mark only those unselected section which does not have any rows in it
                var sectionTitle = $(this).find("title").text();
                if (sectionTitle.indexOf("DEL_") > -1) {
                    sectionTitle = sectionTitle.slice(4);
                    $(this).find("title").text(sectionTitle); //reset it
                }
                if ($.inArray(sectionTitle, unselectedSectionSavedInCCD) > -1) {
                    var newTitle = "DEL_" + sectionTitle;
                    $(this).find("title").text(newTitle);
                }

                //Get the instruction section saved in xml file before saving it in CAMM
                var templateId = $(this).find("templateId").attr('root');
                if ($.inArray(templateId, identifiers.Instructions) > -1) {
                    var flagForTitle = "";
                    var pushFollowUp = false;
                    $(this).find("content").each(function (index) {
                        var contentID = $(this).attr("ID");
                        switch (contentID) {
                            case "SCRIPT.XR_CUST_DISCH_INFO":
                                flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO";
                                break;
                            case "SCRIPT.XR_CUST_DISCH_INFO_TITLE":
                                flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO_TITLE";
                                break;
                            case "SCRIPT.XR_CUST_FOLLOWUP_TXT":
                                pushFollowUp = true;
                                break;
                        }
                    });

                    var ns = $(this).get(0).namespaceURI;
                    var instDiv = $("#instructionsDiv");
                    var parentText = $(this).find("text");

                    if (instructionsUpdated === true) {
                        $(parentText).children().remove();

                        $(instDiv).find('p').each(function () {
                            var className = $(this).attr("class");

                            switch (className) {
                                case 'fl-hd':
                                    var paraFUTitle = xmlDoc.createNode(1, "paragraph", ns);
                                    var hdContent = xmlDoc.createNode(1, "content", ns);
                                    var contentIDTag = xmlDoc.createNode(1, "content", ns);
                                    $(hdContent).attr("styleCode", "Bold").text($(this).text());
                                    $(paraFUTitle).append(hdContent);

                                    // follow up flag
                                    $(contentIDTag).attr("ID", "SCRIPT.XR_CUST_FOLLOWUP_TXT");
                                    // Add follow up flag back to xml only if it came in the first place
                                    if (pushFollowUp) { $(paraFUTitle).append(contentIDTag); }

                                    $(parentText).append(paraFUTitle);
                                    break;
                                case 'fl-data':
                                    var addLineBreak = false;
                                    var pFollowUp = xmlDoc.createNode(1, "paragraph", ns);
                                    $(parentText).append(pFollowUp);

                                    $(this).find('span').each(function () {
                                        if ($(this).attr('class') === 'styleBold') {
                                            var content = xmlDoc.createNode(1, "content", ns);
                                            $(content).attr("styleCode", "Bold").text($(this).text());
                                            $(pFollowUp).append(content);
                                        }
                                        else {
                                            var fLArray = $(this).html().split('<BR>');
                                            var len = fLArray.length;
                                            if (len > 1) {
                                                for (var k = 0, kl = len; k < kl; k++) {
                                                    var data = xmlDoc.createTextNode(fLArray[k]);
                                                    $(pFollowUp).append(data);

                                                    var br = xmlDoc.createNode(1, "br", ns);
                                                    $(pFollowUp).append(br);
                                                }
                                            }
                                            else {
                                                var data = xmlDoc.createTextNode($(this).html().replace(/\&nbsp;/g, " "));
                                                $(pFollowUp).append(data);

                                                var br = xmlDoc.createNode(1, "br", ns);
                                                $(pFollowUp).append(br);
                                            }
                                        }
                                    });

                                    break;
                                case 'di-hd':
                                    var paraDI = xmlDoc.createNode(1, "paragraph", ns);
                                    var hdContent = xmlDoc.createNode(1, "content", ns);
                                    var contentIDTag = xmlDoc.createNode(1, "content", ns);
                                    $(hdContent).attr("styleCode", "Bold").text($(this).text());
                                    $(contentIDTag).attr("ID", flagForTitle);
                                    $(paraDI).append(hdContent);
                                    $(paraDI).append(contentIDTag);
                                    $(parentText).append(paraDI);
                                    break;
                                case 'di-data-bold':
                                    var paraDataTitle = xmlDoc.createNode(1, "paragraph", ns);
                                    var diConten = xmlDoc.createNode(1, "content", ns);
                                    $(diConten).attr("styleCode", "Bold").text($(this).text());
                                    $(paraDataTitle).append(diConten);
                                    $(parentText).append(paraDataTitle);
                                    break;
                                case 'di-data':
                                    var br = xmlDoc.createNode(1, "br", ns);
                                    var paraData = xmlDoc.createNode(1, "paragraph", ns);
                                    var instArray = $(this).html().split('<BR>');
                                    var len = instArray.length;
                                    for (var k = 0, kl = len; k < kl; k++) {
                                        if (instArray[k] !== "") {
                                            var data = xmlDoc.createTextNode(instArray[k]);

                                            $(paraData).append(data);

                                            var br = xmlDoc.createNode(1, "br", ns);
                                            $(paraData).append(br);
                                        }
                                        else {
                                            var br = xmlDoc.createNode(1, "br", ns);
                                            $(paraData).append(br);
                                        }
                                    }

                                    $(parentText).append(paraData);
                                    break;
                                case 'no-data':
                                    var paraFUTitle = xmlDoc.createNode(1, "paragraph", ns);
                                    $(paraFUTitle).text($(this).text());
                                    $(parentText).append(paraFUTitle);
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                    else {
                        // remove the text from the pat edu if instructions section is not modified within visit summary when titles and text is configured in clinical view manager
                        if (flagForTitle === "SCRIPT.XR_CUST_DISCH_INFO") {
                            $(this).find("paragraph").each(function () {
                                var $paragraph = $(this);
                                if ($paragraph.find("content").attr("styleCode") === "Bold") {
                                    //If condition is to identify the paragraphs which has titles inside content tag having attribute bold so that it should not qualify for remove.
                                    //This is to differentiate between between normal text and title in paragraph. We have to remove normal text in the paragraph
                                }
                                else if ($paragraph.text() !== "No data available for this section") {
                                    //This is an exception case where normal text = "No data available for this section" needs to be retained while remove others
                                    $paragraph.remove();
                                }
                            });
                        }
                    }
                //First clear the freetext comment section from the xml and then add again.
                var paraFound = false;
                $(this).find("paragraph").each(function () {
                    $(this).find("content").each(function () {
                        if ($(this).attr("ID") !== undefined && $(this).attr("ID").indexOf("FREETEXT_") > -1)
                            paraFound = true;
                    });
                    if (paraFound === true)
                        $(this).remove();
                });
                //update comments
                var textComments = "";
                if (editorInstance !== undefined && editorInstance !== null)
                    textComments = editorInstance.getData();
                if (textComments.length > 0) {
                    var arrayComments = textComments.split('\n');
                    var commentsPara = xmlDoc.createNode(1, "paragraph", ns);
                    var headerContent = xmlDoc.createNode(1, "content", ns);
                    $(headerContent).attr("styleCode", "Bold").text(summaryI18n.COMMENTS);
                    $(commentsPara).append(headerContent);
                    $(commentsPara).append(xmlDoc.createNode(1, "br", ns));
                    var len = arrayComments.length;
                    for (var c = 0, cl = len; c < cl; c++) {
                        //create content node for each line of free text comment
                        var commentsContent = xmlDoc.createNode(1, "content", ns);
                        $(commentsContent).attr("ID", "FREETEXT_" + (c + 1));
                        if (arrayComments[c] !== "") {
                            $("#dummyDiv").html(arrayComments[c]);
                            var data = xmlDoc.createTextNode($("#dummyDiv").text());
                            $(commentsContent).append(data);
                            $(commentsContent).append(xmlDoc.createNode(1, "br", ns));
                        }
                        else {
                            var data = xmlDoc.createTextNode("");
                            $(commentsContent).append(data);
                            $(commentsContent).append(xmlDoc.createNode(1, "br", ns));
                        }
                        $(commentsPara).append(commentsContent);
                    }
                    $(parentText).append(commentsPara);
                }
            }

                //check for rows in table format
                $(this).find("tr").each(function () {
                    $(this).find("content:first").each(function () {
                        var prefixedXmlContentID = $(this).attr("ID");
                        if (prefixedXmlContentID !== undefined) {
                            if (prefixedXmlContentID.indexOf("DEL_") > -1)  //remove DEL_ prefix from the content ID
                                xmlContentID = prefixedXmlContentID.slice(4);
                            else
                                xmlContentID = prefixedXmlContentID;

                            //reset the content ID to the original
                            $(this).attr("ID", xmlContentID);
                            if ($.inArray(xmlContentID, deselectedRowIds) > -1) {
                                //if match is found prefix the content id with DEL_ hence marking for unselection
                                var newContentID = "DEL_" + xmlContentID;
                                $(this).attr("ID", newContentID);
                            }
                        }
                    });
                });
                //check for rows in paragraph format
                $(this).find("paragraph").each(function () {
                    $(this).find("content:first").each(function () {
                        var prefixedXmlContentID = $(this).attr("ID");
                        if (prefixedXmlContentID !== undefined) {
                            if (prefixedXmlContentID.indexOf("DEL_") > -1)  //remove DEL_ prefix from the content ID
                                xmlContentID = prefixedXmlContentID.slice(4);
                            else
                                xmlContentID = prefixedXmlContentID;

                            //reset the content ID to the original
                            $(this).attr("ID", xmlContentID);
                            if ($.inArray(xmlContentID, deselectedRowIds) > -1) {
                                //if match is found prefix the content id with DEL_ hence marking for unselection
                                var newContentID = "DEL_" + xmlContentID;
                                $(this).attr("ID", newContentID);
                            }
                        }
                    });
                });

                //Make sure that DEL_ is added to each ITEM_ and GROUP_ in the deselecteditems and deselectedgroups array.
                $(this).find("content").each(function () {
                    var tempContentId;
                    var itemId = $(this).attr("ID");
                    if (itemId != null) {
                        if (itemId.indexOf("DEL_") > -1)
                            tempContentId = itemId.slice(4);
                        else
                            tempContentId = itemId;

                    }
                    if (tempContentId != null) {
                        var itemFound = tempContentId.search(/ITEM_/);
                        var groupFound = tempContentId.search(/GROUP_/);
                    }
                    if (groupFound > -1) {
                        if ($.inArray(tempContentId, deselectedGroups) > -1) {
                            var newId = "DEL_" + tempContentId;
                            $(this).attr("ID", newId);
                            MP_Util.LogInfo("This shows Group with DEL prefix in Content" + JSON.stringify(($(this).attr("ID"))));
                        }

                    }
                    if (itemFound > -1) {
                        //reset the content ID to the original
                        $(this).attr("ID", tempContentId);
                        if ($.inArray(tempContentId, deselectedItems) > -1) {
                            var newId = "DEL_" + tempContentId;
                            $(this).attr("ID", newId);
                            MP_Util.LogInfo("This shows Item with DEL prefix in Content" + JSON.stringify(($(this).attr("ID"))));

                        }
                    }
                });

                $(this).find("paragraph").each(function () {
                    var paragraphId = $(this).attr("ID");
                    var tempParagraphId2;
                    if (paragraphId != null) {
                        if (paragraphId.indexOf("DEL_") > -1)
                            tempParagraphId2 = paragraphId.slice(4);
                        else
                            tempParagraphId2 = paragraphId;

                    }
                    if (paragraphId != null) {
                        var groupParagraph = tempParagraphId2.search(/GROUP_/);
                        var itemParagraph = paragraphId.search(/ITEM_/);
                    }
                    if (groupParagraph > -1) {
                        //reset the content ID to the original
                        $(this).attr("ID", tempParagraphId2);
                        if ($.inArray(tempParagraphId2, deselectedGroups) > -1) {
                            var newId = "DEL_" + tempParagraphId2;
                            $(this).attr("ID", newId);
                            MP_Util.LogInfo("This shows Group with DEL prefix in paragraph" + JSON.stringify(($(this).attr("ID"))));
                        }

                    }
                    if (itemParagraph > -1) {
                        //reset the content ID to the original
                        $(this).attr("ID", tempParagraphId2);

                        $(this).find("content:first").each(function () {
                            var tempParagraphId;
                            var paragraphContentId = $(this).attr("ID");
                            if (paragraphContentId != null) {
                                if (paragraphContentId.indexOf("DEL_") > -1)
                                    tempParagraphId = paragraphContentId.slice(4);
                                else
                                    tempParagraphId = paragraphContentId;
                                //reset the content ID to the original
                                $(this).attr("ID", tempParagraphId);
                                if ($.inArray(paragraphId, deselectedItems) > -1) {
                                    var newId = "DEL_" + tempParagraphId;
                                    $(this).attr("ID", newId);
                                    MP_Util.LogInfo("This shows Item with DEL prefix in paragraph" + JSON.stringify(($(this).attr("ID"))));
                                }
                            }
                        });

                    }
                });


                // This function adds DEL_ for tables with GROUP_ tags
                $(this).find("table").each(function () {
                    var tableId = $(this).attr("ID");
                    var tempTableId;
                    if (tableId != undefined) {
                        if (tableId.indexOf("DEL_") > -1)
                            tempTableId = tableId.slice(4);
                        else
                            tempTableId = tableId;
                        //reset the content ID to the original
                        $(this).attr("ID", tempTableId);
                    }
                    if (tempTableId != null) {
                        var groupTable = tempTableId.search(/GROUP_/);
                    }
                    if (groupTable > -1) {
                        if ($.inArray(tempTableId, deselectedGroups) > -1) {
                            var newId = "DEL_" + tempTableId;
                            $(this).attr("ID", newId);
                        }

                    }
                });

                //Don't delete this code this is TO-DO in Future.
                //This function can be useful when we have list with GROUP_ tags
                /*$(this).find("list").each(function (){
                var tempListId;
                var listId = $(this).attr("ID");
                if (listId != undefined) {
                if (listId.indexOf("DEL_") !== -1)
                tempListId = listId.slice(4);
                else
                tempListId = listId;
                //reset the content ID to the original
                $(this).attr("ID", tempListId);
                }
                if (tempListId != undefined || tempListId != null) {
                var groupList = tempListId.search(/GROUP_/);
                }
                if (groupList > -1) {
                if ($.inArray(tempListId, deselectedGroups) != -1) {
                var newId = "DEL_" + tempListId;
                $(this).attr("ID", newId);
                }

                }
                });*/

                //Don't delete this code this is TO-DO in Future.
                // This function can be useful when we have tr's with ITEM_ tags
                /* $(this).find("tr").each(function () {
                var trId = $(this).attr("ID");
                if (trId != undefined || trId != null) {
                //var groupParagraph = trId.search(/GROUP_/);
                var itemTr = trId.search(/ITEM_/);
                }
                if(itemTr > -1){
                if ($.inArray(trId, deselectedItems) != -1) {
                $(this).find("content:first").each(function () {
                var tempTrId;
                var trContentId = $(this).attr("ID");
                if (trContentId != undefined) {
                if (trContentId.indexOf("DEL_") !== -1)
                tempTrId = trContentId.slice(4);
                else
                tempTrId = trContentId;
                //reset the content ID to the original
                $(this).attr("ID", tempTrId);

                //var XmlContentID = $(this).attr("ID");
                var newId = "DEL_" + tempTrId;
                $(this).attr("ID", newId);
                }
                });
                }
                }
                }); */

                $(this).find("tr").each(function () {
                    var trId = $(this).attr("ID");
                    var tempTrId;
                    if (trId != null) {
                        if (trId.indexOf("DEL") > -1)
                            tempTrId = trId.slice(4);
                        else
                            tempTrId = trId
                        var itemTr = trId.search(/ITEM_/);
                    }
                    if (itemTr > -1) {
                        $(this).attr("ID", tempTrId);
                        if ($.inArray(tempTrId, deselectedItems) > -1) {
                            var newId = "DEL_" + tempTrId;
                            $(this).attr("ID", newId);
                        }
                    }
                });


                //Don't delete this code this is TO-DO in Future.

                // This funciton can be useful when we have items with ITEM_ tags
                /*$(this).find("item").each(function () {
                var itemId = $(this).attr("ID");
                if (itemId != undefined || itemId != null) {
                //var groupParagraph = trId.search(/GROUP_/);
                var itemList = itemId.search(/ITEM_/);
                }
                if(itemList > -1){
                if ($.inArray(itemId, deselectedItems) != -1) {
                $(this).find("content:first").each(function () {
                var tempItemId;
                var itemContentId = $(this).attr("ID");
                if (itemContentId != undefined) {
                if (itemContentId.indexOf("DEL_") !== -1)
                tempItemId = itemContentId.slice(4);
                else
                tempItemId = itemContentId;
                //reset the content ID to the original
                $(this).attr("ID", tempItemId);
                //var XmlContentID = $(this).attr("ID");
                var newId = "DEL_" + tempItemId;
                $(this).attr("ID", newId);
                }
                });
                }
                }
                });*/

                $(this).find(/GROUP_/).each(function () {
                    var groupId = $(this).attr("ID");
                    if (groupId != null) {
                        if ($.inArray(groupId, deselectedGroups) > -1) {
                            var newGroupId = "DEL_" + groupId;
                            $(this).attr("ID", newGroupId);
                        }
                    }
                });

            });
            //Save patient education
            var patEdAck = 0;
            if ($('#patEduChk').is(":checked")) {
                patEdAck = 1;
            }
            CLINICAL_SUMMARY_O1.SavePatientEducation(patEdAck);

            //Now Save the CCD
            CLINICAL_SUMMARY_O1.SaveToCAMMArchive(ccdXML);
        },

        /*modify the CCD xml */
        SubmitCCD: function () {
            var summaryI18n = i18n.discernabu.clinical_summary_o1;
            var sectionLength = sectionToBeDeselected.length;
            var itemLength = deselectedItems.length;
            var criterion = tempComp.getCriterion();
            var person_id = criterion.person_id;
            var encntr_id = criterion.encntr_id;
            var timerPublishCCD = MP_Util.CreateTimer("CAP:MPG.CLINICALSUMMARY.O1 - Publish CCD to CAMM archive", person_id, encntr_id);
            var rowContentIdLength = deselectedRowIds.length;
            var contentParagraph = [];
            var deselectedCommentsSupId = [];

            try {
                var ccdXML = new ActiveXObject("Microsoft.XMLDOM");
                ccdXML.async = false;
                ccdXML = $.parseXML(xmlDoc.xml);

                //remove DEL_ before publishing
                $(ccdXML).find("section").each(function () {
                    $(this).find("title").each(function () {
                        if ($(this).text().indexOf("DEL_") > -1) {
                            var correctTitle = $(this).text().slice(4);
                            $(this).text(correctTitle);
                        }
                    });
                });

                $(ccdXML).find("title:first").each(function () {
                    CCDTitle = $(this).text();
                });

                // Check for sections, rows within sections, rows with item_ prefixes and if instructions section got modified
                if (sectionLength > 0 || itemLength > 0 || rowContentIdLength > 0 || instSectionChanged === true) {
                    /*Section deselection*/
                    $(ccdXML).find("section").each(function () {
                        var secToBeRemoved = false;
                        var entryTag = null;
                        var componentCode = "";
                        var flagForTitle = "";
                        var pushFollowUp = false;
                        $(this).find("content").each(function (index) {
                            var contentID = $(this).attr("ID");
                            switch (contentID) {
                                case "SCRIPT.XR_CUST_DISCH_INFO":
                                    flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO";
                                    bPrintPatEdViaFirstNet = true;
                                    break;
                                case "SCRIPT.XR_CUST_DISCH_INFO_TITLE":
                                    flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO_TITLE";
                                    bPrintPatEdViaFirstNet = false;
                                    break;
                                case "SCRIPT.XR_CUST_FOLLOWUP_TXT":
                                    pushFollowUp = true;
                                    break;
                            }
                        });
                        var fpText = $(this).find("paragraph:first").text();
                        if (fpText === "No data available for this section") {
                            bPrintPatEdViaFirstNet = false;
                        }
                        else if (fpText === "Follow Up Care ") {      //when Instruction section has only follow up care data
                            bPrintPatEdViaFirstNet = false;
                        }

                        $(this).find("code:first").each(function () {
                            componentCode = $(this).attr("code");
                        });

                        if (sectionLength > 0) {
                            $(this).find("title").each(function () {
                                if (secToBeRemoved === false) {
                                    for (var i = 0, il = sectionToBeDeselected.length; i < il; i++) {
                                        if ($(this).text() === sectionToBeDeselected[i]) {
                                            secToBeRemoved = true;
                                            break;
                                        }
                                    }
                                }

                            });
                        }
                        if (secToBeRemoved === true) {
                            /*Nerrative block updating */
                            $(this).find("text:first").each(function () {
                                var ns = $(this).get(0).namespaceURI;
                                $(this).children().remove();

                                var para = xmlDoc.createNode(1, "paragraph", ns);
                                $(para).attr('ID', 'NODATAAVAILABLE'); //ID is intentionally uppercase
                                $(para).text(summaryI18n.NO_DATA_AVAILABLE);
                                $(this).append(para);
                            });

                            /*Update Entry tag*/
                            $(this).find("entry").each(function () {
                                if ($(this).closest("section").children("entry").length > 1)
                                    $(this).remove();
                                else {
                                    var probflag = true;
                                    var allergyflag = true;
                                    var flag = true;
                                    entryTag = this;
                                    switch (componentCode) {
                                        case PROBLEM_CODE:
                                            $(entryTag).find('act').attr('nullFlavor', "NI");

                                            $(entryTag).find("low").each(function () {
                                                $(this).removeAttr("value");
                                                $(this).attr("nullFlavor", "UNK");
                                            });
                                            $(entryTag).find("high").each(function () {
                                                $(this).removeAttr("value");
                                                $(this).attr("nullFlavor", "UNK");
                                            });
                                            $(entryTag).find("entryRelationship").each(function () {
                                                if (!probflag)
                                                    $(this).remove();
                                                else {
                                                    $(this).attr("nullFlavor", "NI");
                                                    probflag = false;
                                                }
                                            });
                                            $(entryTag).find("translation").remove();
                                            $(entryTag).find("reference").each(function () {
                                                $(this).parent("originalText").remove();
                                                $(this).parent("text").remove();
                                            });
                                            $(entryTag).find("author").each(function () {
                                                $(this).remove();
                                            });
                                            $(entryTag).find("value").each(function () {
                                                $(this).attr('nullFlavor', 'NI');
                                                $(this).removeAttr("code");
                                                $(this).removeAttr("codeSystem");
                                                $(this).removeAttr("codeSystemName");
                                                $(this).removeAttr("displayName");
                                            });

                                            break;
                                        case MED_ADMIN_CODE:
                                        case MEDICATION_CODE:
                                            //Medication
                                            $(entryTag).find('substanceAdministration').attr("nullFlavor", "NI");
                                            $(entryTag).find("entryRelationship").each(function () {
                                                $(this).remove();
                                            });
                                            $(entryTag).find("low").removeAttr("value").attr("nullFlavor", "NI");
                                            $(entryTag).find("high").removeAttr("value").attr("nullFlavor", "NI");
                                            $(entryTag).find("translation").remove();
                                            $(entryTag).find("author").each(function () {
                                                $(this).remove();
                                            });
                                            $(entryTag).find("manufacturedMaterial").children('code').attr("nullFlavor", "NI");
                                            $(entryTag).find("routeCode").remove();
                                            $(entryTag).find("administrationUnitCode").remove();
                                            $(entryTag).find("reference").each(function () {
                                                $(this).parent("originalText").remove();
                                                $(this).parent("text").remove();
                                            });
                                            break;
                                        case IMMUN_CODE:
                                            $(entryTag).find('substanceAdministration').attr("nullFlavor", "NI");
                                            $(entryTag).find("reference").each(function () {
                                                $(this).parent("originalText").remove();
                                                $(this).parent("text").remove();
                                            });
                                            $(this).removeAttr("value").attr("nullFlavor", "NI");
                                            $(entryTag).find("low").each(function () {
                                                $(this).removeAttr("value");
                                                $(this).attr("nullFlavor", "UNK");
                                            });
                                            $(entryTag).find("high").each(function () {
                                                $(this).removeAttr("value");
                                                $(this).attr("nullFlavor", "UNK");
                                            });
                                            $(entryTag).find("originalText").remove();
                                            $(entryTag).find("routeCode").remove();
                                            $(entryTag).find("approachSiteCode").remove();
                                            $(entryTag).find("doseQuantity").remove();
                                            $(entryTag).find("performer").remove();
                                            $(entryTag).find("author").remove();
                                            $(entryTag).find("manufacturerOrganization").remove();
                                            $(entryTag).find("code").each(function () {
                                                $(this).attr('nullFlavor', 'NI');
                                                $(this).removeAttr("code");
                                                $(this).removeAttr("codeSystem");
                                                $(this).removeAttr("codeSystemName");
                                                $(this).removeAttr("displayName");
                                            });
                                            break;
                                        case ALLERGY_CODE:
                                            $(entryTag).find('act').attr("nullFlavor", "NI");
                                            $(entryTag).find("entryRelationship").each(function () {
                                                if (!allergyflag)
                                                    $(this).remove();
                                                else {
                                                    allergyflag = false;
                                                }
                                            });
                                            $(entryTag).find("effectiveTime").each(function () {
                                                if (flag) {
                                                    $(this).find('low').remove();
                                                    $(this).attr("nullFlavor", "NI");
                                                }
                                                else {
                                                    flag = false;
                                                }
                                            });
                                            $(entryTag).find("observation").attr("nullFlavor", "NI");
                                            $(entryTag).find("participant").remove();
                                            $(entryTag).find("author").remove();
                                            break;
                                        case PROC_CODE:
                                            $(entryTag).find("author").remove();
                                            $(entryTag).find("entryRelationship").remove();
                                            $(entryTag).find("effectiveTime").each(function () {
                                                $(this).removeAttr("value").attr("nullFlavor", "NI");
                                            });
                                            $(entryTag).find("originalText").remove();
                                            $(entryTag).find("code").each(function () {
                                                $(this).attr('nullFlavor', 'NI');
                                                $(this).removeAttr("code");
                                                $(this).removeAttr("codeSystem");
                                                $(this).removeAttr("codeSystemName");
                                                $(this).removeAttr("displayName");
                                            });
                                            break;
                                        case SOCIAL_HIST_CODE:
                                            $(entryTag).find("author").remove();
                                            $(entryTag).find("originalText").remove();
                                            $(entryTag).find("reference").remove();
                                            $(entryTag).find("effectiveTime").each(function () {
                                                $(this).removeAttr("value").attr("nullFlavor", "NI");
                                            });
                                            $(entryTag).find("value").attr("nullFlavor", "NI");

                                            break;
                                        case RESULT_CODE:
                                            $(entryTag).find("code").each(function () {
                                                $(this).attr("nullFlavor", "NI");
                                            });
                                            $(entryTag).find('text').each(function () {
                                                $(this).remove();
                                            });
                                            $(entryTag).find('interpretationCode').remove();
                                            $(entryTag).find('author').each(function () {
                                                $(this).remove();
                                            });
                                            $(entryTag).find('author').each(function () {
                                                $(this).remove();
                                            });
                                            $(entryTag).find('entryRelationship').each(function () {
                                                $(this).remove();
                                            });
                                            $(entryTag).find("effectiveTime").each(function () {
                                                $(this).removeAttr("value").attr("nullFlavor", "NI");
                                            });
                                            $(entryTag).find("value").removeAttr("value").removeAttr("unit").attr("nullFlavor", "NI");
                                            $(entryTag).find("originalText").remove();
                                            $(entryTag).find("referenceRange").remove();
                                            break;

                                        default:
                                            $(this).remove();
                                            break;
                                    }
                                }

                            });

                        }
                        else {
                            if (componentCode === INST_CODE) {
                                var ns = $(this).get(0).namespaceURI;
                                var instDiv = $("#instructionsDiv");
                                var parentText = $(this).find("text");

                                if (instructionsUpdated === true) {
                                    $(parentText).children().remove();

                                    $(instDiv).find('p').each(function () {
                                        var className = $(this).attr("class");

                                        switch (className) {
                                            case 'fl-hd':
                                                var paraFUTitle = xmlDoc.createNode(1, "paragraph", ns);
                                                var hdContent = xmlDoc.createNode(1, "content", ns);
                                                var contentIDTag = xmlDoc.createNode(1, "content", ns);
                                                $(hdContent).attr("styleCode", "Bold").text($(this).text());
                                                $(paraFUTitle).append(hdContent);

                                                //follow up flag
                                                $(contentIDTag).attr("ID", "SCRIPT.XR_CUST_FOLLOWUP_TXT");
                                                // Add follow up flag back to xml only if it came in the first place
                                                if (pushFollowUp) { $(paraFUTitle).append(contentIDTag); }

                                                $(parentText).append(paraFUTitle);
                                                break;
                                            case 'fl-data':
                                                var addLineBreak = false;
                                                var pFollowUp = xmlDoc.createNode(1, "paragraph", ns);
                                                $(parentText).append(pFollowUp);

                                                $(this).find('span').each(function () {
                                                    if ($(this).attr('class') === 'styleBold') {
                                                        var content = xmlDoc.createNode(1, "content", ns);
                                                        $(content).attr("styleCode", "Bold").text($(this).text());
                                                        $(pFollowUp).append(content);
                                                    }
                                                    else {
                                                        var fLArray = $(this).html().split('<BR>');
                                                        var len = fLArray.length;
                                                        if (len > 1) {
                                                            for (var k = 0, kl = len; k < kl; k++) {
                                                                var data = xmlDoc.createTextNode(fLArray[k]);
                                                                $(pFollowUp).append(data)

                                                                var br = xmlDoc.createNode(1, "br", ns);
                                                                $(pFollowUp).append(br)
                                                            }
                                                        }
                                                        else {
                                                            /*In the script mp_clinical_get_followup.prg when we retrieve the “within” data we are adding a blank space “&nbsp;” in between the string “within” and days range. It is rendered correctly in the html but the same string is getting saved in xml as it is which is used for printing. Hence before saving replace "&nbsp" with " ".*/
                                                            var data = xmlDoc.createTextNode($(this).html().replace(/\&nbsp;/g," "));
                                                            $(pFollowUp).append(data)

                                                            var br = xmlDoc.createNode(1, "br", ns);
                                                            $(pFollowUp).append(br)
                                                        }
                                                    }
                                                });

                                                break;
                                            case 'di-hd':
                                                var paraDI = xmlDoc.createNode(1, "paragraph", ns);
                                                var hdContent = xmlDoc.createNode(1, "content", ns);
                                                var contentIDTag = xmlDoc.createNode(1, "content", ns);
                                                $(hdContent).attr("styleCode", "Bold").text($(this).text());
                                                $(contentIDTag).attr("ID", flagForTitle);
                                                $(paraDI).append(hdContent);
                                                $(paraDI).append(contentIDTag);
                                                $(parentText).append(paraDI);
                                                break;
                                            case 'di-data-bold':
                                                var paraDataTitle = xmlDoc.createNode(1, "paragraph", ns);
                                                var diConten = xmlDoc.createNode(1, "content", ns);
                                                $(diConten).attr("styleCode", "Bold").text($(this).text());
                                                $(paraDataTitle).append(diConten);
                                                $(parentText).append(paraDataTitle);
                                                break;
                                            case 'di-data':
                                                var br = xmlDoc.createNode(1, "br", ns);
                                                var paraData = xmlDoc.createNode(1, "paragraph", ns)
                                                var instArray = $(this).html().split('<BR>');
                                                var len = instArray.length;
                                                for (var k = 0, kl = len; k < kl; k++) {
                                                    if (instArray[k] !== "") {
                                                        var data = xmlDoc.createTextNode(instArray[k]);

                                                        $(paraData).append(data)

                                                        var br = xmlDoc.createNode(1, "br", ns);
                                                        $(paraData).append(br)
                                                    }
                                                    else {
                                                        var br = xmlDoc.createNode(1, "br", ns);
                                                        $(paraData).append(br)
                                                    }
                                                }

                                                $(parentText).append(paraData);
                                                break;
                                            case 'no-data':
                                                var paraFUTitle = xmlDoc.createNode(1, "paragraph", ns);
                                                $(paraFUTitle).text($(this).text());
                                                $(parentText).append(paraFUTitle);
                                                break;
                                            default:
                                                break;
                                        }
                                    });
                                }
                                var paraFound = false;
                                $(this).find("paragraph").each(function () {
                                    $(this).find("content").each(function () {
                                        var contentId = $(this).attr("ID");
                                        if (contentId !== undefined && contentId.indexOf("FREETEXT_") > -1)
                                            paraFound = true;
                                    });
                                    if (paraFound === true)
                                        $(this).remove();
                                });

                                //update comments
                                var textComments = editorInstance.getData();
                                if (textComments.length > 0) {
                                    var arrayComments = textComments.split('\n');
                                    var commentsPara = xmlDoc.createNode(1, "paragraph", ns);
                                    var headerContent = xmlDoc.createNode(1, "content", ns);
                                    $(headerContent).attr("styleCode", "Bold").text(summaryI18n.COMMENTS);
                                    $(commentsPara).append(headerContent);
                                    $(commentsPara).append(xmlDoc.createNode(1, "br", ns));

                                    var len = arrayComments.length;
                                    for (var c = 0, cl = len; c < cl; c++) {
                                        if (arrayComments[c] !== "") {
                                            $("#dummyDiv").html(arrayComments[c]);
                                            var data = xmlDoc.createTextNode($("#dummyDiv").text());
                                            $(commentsPara).append(data);
                                            $(commentsPara).append(xmlDoc.createNode(1, "br", ns));
                                        }
                                        else {
                                            $(commentsPara).append(xmlDoc.createNode(1, "br", ns));
                                        }
                                    }
                                    $(parentText).append(commentsPara);
                                }
                            }
                            else if (rowContentIdLength > 0) {
                                var contentIdRemoved = [];

                                $(this).find("tr").each(function () {
                                    $(this).find("content:first").each(function () {
                                        var xmlContentID = "";
                                        var commentNo;
                                        var tempXmlContentID = $(this).attr("ID");
                                        if (tempXmlContentID !== undefined) {
                                            if (tempXmlContentID.indexOf("DEL_") > -1)
                                                xmlContentID = tempXmlContentID.slice(4);
                                            else
                                                xmlContentID = tempXmlContentID;
                                        }


                                        if ($.inArray(xmlContentID, deselectedRowIds) > -1) {
                                            contentIdRemoved.push(xmlContentID);

                                            var objTableParent = $(this).closest('table').parent();
                                            var objTable = $(this).closest('table');
                                            var objTbody = $(this).closest('tr').parent();

                                            $(this).closest('tr').find("sup").each(function () {
                                                commentNo = $(this).text();
                                                if (commentNo.indexOf(',') !== -1) {
                                                    commentNo = commentNo.replace(',', "");
                                                }
                                                $(objTableParent).find("paragraph").each(function () {
                                                    if ($(this).find('sup').text() === $.trim(commentNo)) {
                                                        $(this).find('sup').closest('paragraph').remove();
                                                    }
                                                });
                                            });

                                            $(this).closest('tr').remove();

                                        }
                                    });
                                });

                                /*removing rows which has paragraph format*/
                                $(this).find("text:first").each(function () {
                                    $(this).find("paragraph").each(function () {
                                        $(this).find("content:first").each(function () {
                                            var xmlContentID = "";
                                            var tempXmlContentID = $(this).attr("ID");
                                            if (tempXmlContentID !== undefined) {
                                                if (tempXmlContentID.indexOf("DEL_") > -1)
                                                    xmlContentID = tempXmlContentID.slice(4);
                                                else
                                                    xmlContentID = tempXmlContentID;


                                                if ($.inArray(xmlContentID, deselectedRowIds) > -1) {
                                                    contentIdRemoved.push(xmlContentID);
                                                    $(this).closest('paragraph').remove();
                                                }
                                            }
                                        });
                                    });
                                });

                                $(this).find("reference").each(function () {
                                    for (var j = 0, jl = contentIdRemoved.length; j < jl; j++) {
                                        var entryTag = $(this).closest('entry');
                                        var contentId = contentIdRemoved[j];
                                        if ($(this).attr("value") === ('#' + contentId)) {
                                            $(this).closest('entry').remove();
                                            break;
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
                //  This function is to remove the text from the pat edu if instructions section is not modified within visit summary 
                //when titles and text is configured in clinical view manager
                $(ccdXML).find("section").each(function () {
                    var flagForTitle = "";
                    var templateId = $(this).find("templateId").attr('root');
                    if ($.inArray(templateId, identifiers.Instructions) > -1) {
                        $(this).find("content").each(function () {
                            var contentID = $(this).attr("ID");
                            switch (contentID) {
                                case "SCRIPT.XR_CUST_DISCH_INFO":
                                    flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO";
                                    bPrintPatEdViaFirstNet = true;
                                    break;
                                case "SCRIPT.XR_CUST_DISCH_INFO_TITLE":
                                    flagForTitle = "SCRIPT.XR_CUST_DISCH_INFO_TITLE";
                                    bPrintPatEdViaFirstNet = false;
                                    break;
                                case "SCRIPT.XR_CUST_FOLLOWUP_TXT":
                                    pushFollowUp = true;
                                    break;
                            }
                        });
                        var fpText = $(this).find("paragraph:first").text();
                        if (fpText === "No data available for this section") {
                            bPrintPatEdViaFirstNet = false;
                        }
                        else if (fpText === "Follow Up Care ") {     //when Instruction section has only follow up care data
                            bPrintPatEdViaFirstNet = false;
                        }
                        if (flagForTitle === "SCRIPT.XR_CUST_DISCH_INFO") {

                            $(this).find("paragraph").each(function () {
                                var $paragraph = $(this);
                                if ($paragraph.find("content").attr("styleCode") === "Bold") {
                                    //If condition is to identify the paragraphs which has titles inside content tag having attribute bold so that it should not qualify for remove.
                                    //This is to differentiate between between normal text and title in paragraph. We have to remove normal text in the paragraph
                                }
                                else if ($paragraph.text() !== "No data available for this section") {
                                    //This is an exception case where normal text = "No data available for this section" needs to be retained while remove others
                                    $paragraph.remove();
                                }
                            });
                        }
                    }
                });

                // This function is to delete the sections with ITEM_ and GROUP_ tags
                $(ccdXML).find("section").each(function () {

                    $(this).find("content").each(function () {
                        var contentId = $(this).attr("ID");
                        if (contentId !== null && contentId !== undefined) {
                            if (contentId.indexOf("DEL_") > -1) {
                                tempContentId = contentId.slice(4);
                            }
                            else {
                                tempContentId = contentId;
                            }

                            //reset the content ID to the original
                            $(this).attr("ID", tempContentId);

                            if ($.inArray(tempContentId, deselectedItems) > -1) {
                                //if the selected item has superscript/subscript, the sup tag is nested inside a content tag with content id = LINK_ prefix
                                //search for the LINK_ ids in the nested content tags and store in array deselectedCommentsSupId
                                $(this).find("content").each(function (ind) {
                                    var nestedContentId = $(this).attr("ID");
                                    if (nestedContentId !== null && nestedContentId !== undefined) {
                                        if (nestedContentId.indexOf("LINK_") > -1) {
                                            //slicing the prefix LINK_ before storing in the array to match the content id of the related comment
                                            deselectedCommentsSupId.push(nestedContentId.slice(5));
                                        }
                                    }
                                });
                                $(this).remove();
                                contentParagraph.push(tempContentId.slice(5)); // This is 5 because we slice ITEM_ to use it to remove references
                            }

                            if ($.inArray(tempContentId, deselectedGroups) > -1) {
                                $(this).remove();
                            }
                        }
                    });



                    //Remove items and Groups inside paragraph
                    $(this).find("paragraph").each(function () {
                        var paragraphId = $(this).attr("ID");
                        if (paragraphId !== null && paragraphId !== undefined) {
                            if (paragraphId.indexOf("DEL_") > -1) {
                                tempParagraphId = paragraphId.slice(4);
                            }
                            else {
                                tempParagraphId = paragraphId;
                            }
                            //reset the content ID to the original
                            $(this).attr("ID", tempParagraphId);
                            $(this).find("content:first").each(function () {
                                var tempParagraphContentID = "";
                                var tempXmlParagraphContentID = $(this).attr("ID");
                                if (tempXmlParagraphContentID !== null && tempXmlParagraphContentID !== undefined) {
                                    if (tempXmlParagraphContentID.indexOf("DEL_") > -1) {
                                        tempParagraphContentID = tempXmlParagraphContentID.slice(4);
                                    }
                                    else {
                                        tempParagraphContentID = tempXmlParagraphContentID;
                                    }
                                }
                                if ($.inArray(tempParagraphId, deselectedItems) > -1) {
                                    contentParagraph.push(tempParagraphContentID);
                                }
                            });
                            if ($.inArray(tempParagraphId, deselectedItems) > -1) {
                                $(this).remove();
                            }
                            if ($.inArray(tempParagraphId, deselectedGroups) > -1) {
                                $(this).remove();
                            }
                        }
                    });



                    //Remove items inside tr and Groups inside table
                    $(this).find("table").each(function () {
                        var tempTableId;
                        var tableId = $(this).attr("ID");
                        if (tableId !== null && tableId !== undefined) {
                            if (tableId.indexOf("DEL_") > -1) {
                                tempTableId = tableId.slice(4);
                            }
                            else {
                                tempTableId = tableId;
                            }
                            //reset the content ID to the original
                            $(this).attr("ID", tempTableId);
                            $(this).find("tr").each(function () {
                                var tempTrId;
                                var trId = $(this).attr("ID");
                                if (trId !== null && trId !== undefined) {
                                    if (trId.indexOf("DEL_") > -1) {
                                        tempTrId = trId.slice(4);
                                    }
                                    else {
                                        tempTrId = trId;
                                    }
                                    //reset the content ID to the original
                                    $(this).attr("ID", tempTrId);
                                    if ($.inArray(tempTrId, deselectedItems) > -1) {
                                        //if the selected item has superscript/subscript, the sup tag is nested inside a content tag with content id = LINK_ prefix
                                        //search for the LINK_ ids in the nested content tags and store in array deselectedCommentsSupId
                                        $(this).find("content").each(function () {
                                            var nestedContentId = $(this).attr("ID");
                                            if (nestedContentId !== null && nestedContentId !== undefined) {
                                                if (nestedContentId.indexOf("LINK_") > -1) {
                                                    //slicing the prefix LINK_ before storing in the array to match the content id of the related comment
                                                    deselectedCommentsSupId.push(nestedContentId.slice(5));
                                                }
                                            }
                                        });
                                        $(this).remove();
                                        contentParagraph.push(tempTrId.slice(5)); // This is 5 because we slice ITEM_ to use it to remove references
                                    }
                                }
                            });

                            if ($.inArray(tempTableId, deselectedGroups) > -1) {
                                $(this).remove();
                            }
                        }
                    });

                    //Remove superscript/subscript comments
                    $(this).find("content").each(function () {
                        var commentsContentId = $(this).attr("ID");
                        if ($.inArray(commentsContentId, deselectedCommentsSupId) > -1) {
                            $(this).remove();
                        }
                    });

                    //Don't delete this code this is TO-DO in Future.
                    // This section of code helps when we use Item_ tag inside items and tr and group_ in list
                    /*Remove items inside list
                    $(this).find("item").each(function (index) {
                    var itemId = $(this).attr("ID");
                    // debugger;
                    if (itemId != undefined || itemId != null) {
                    if (itemId.indexOf("DEL_") !== -1)
                    tempItemId = itemId.slice(4);
                    else
                    tempItemId = itemId;
                    //reset the content ID to the original
                    $(this).attr("ID", tempItemId);
                    $(this).find("content:first").each(function () {
                    var tempItemContentID = "";
                    var tempXmlItemContentID = $(this).attr("ID");
                    if (tempXmlItemContentID !== undefined) {
                    if (tempXmlItemContentID.indexOf("DEL_") > -1)
                    tempItemContentID = tempXmlItemContentID.slice(4);
                    else
                    tempItemContentID = tempXmlItemContentID;
                    }
                    if ($.inArray(tempItemId, deselectedItems) > -1) {
                    //debugger;
                    contentParagraph.push(tempItemContentID);
                    $(this).remove();
                    }
                    });
                    }
                    });*/

                    //Don't delete this code this is TO-DO in Future.
                    /* Remove tr inside list
                    $(this).find("tr").each(function (index) {
                    var trId = $(this).attr("ID");
                    //debugger;
                    if (trId != undefined || trId != null) {
                    if (trId.indexOf("DEL_") !== -1)
                    tempTrId = trId.slice(4);
                    else
                    tempTrId = trId;
                    //reset the content ID to the original
                    $(this).attr("ID", tempTrId);
                    $(this).find("content:first").each(function () {
                    var tempTrContentID = "";
                    var tempXmlTrContentID = $(this).attr("ID");
                    if (tempXmlTrContentID !== undefined) {
                    if (tempXmlTrContentID.indexOf("DEL_") > -1)
                    tempTrContentID = tempXmlTrContentID.slice(4);
                    else
                    tempTrContentID = tempXmlTrContentID;
                    }
                    if ($.inArray(tempTrId, deselectedItems) > -1) {
                    // debugger;
                    contentParagraph.push(tempTrContentID);
                    $(this).remove();
                    }
                    });
                    }
                    });*/

                    //Don't delete this code this is TO-DO in Future.
                    /*   Remove Groups inside table
                    $(this).find("table").each(function (index) {
                    var tableId = $(this).attr("ID");
                    //debugger;
                    if (tableId != undefined || tableId != null) {
                    if (tableId.indexOf("DEL_") !== -1)
                    tempTableId = tableId.slice(4);
                    else
                    tempTableId = tableId;
                    //reset the content ID to the original
                    $(this).attr("ID", tempTableId);
                    if ($.inArray(tempTableId, deselectedGroups) > -1) {
                    $(this).remove();
                    }
                    }

                    });*/

                    //Don't delete this code this is TO-DO in Future.
                    /*  Remove Groups inside list
                    $(this).find("list").each(function (index) {
                    var listId = $(this).attr("ID");
                    //debugger;
                    if (listId != undefined || listId != null) {
                    if (listId.indexOf("DEL_") !== -1)
                    tempListId = listId.slice(4);
                    else
                    tempListId = listId;
                    //reset the content ID to the original
                    $(this).attr("ID", tempListId);
                    if ($.inArray(tempListId, deselectedGroups) > -1) {
                    $(this).remove();
                    }
                    }
                    });*/

                    //}
                    $(this).find("reference").each(function () {
                        for (var j = 0, jl = contentParagraph.length; j < jl; j++) {
                            var entryTag = $(this).closest('entry');
                            var contentId = contentParagraph[j];
                            if ($(this).attr("value") === ('#' + contentId)) {
                                $(this).closest('entry').remove();
                                break;
                            }
                        }
                    });

                });

                instSectionChanged = false;
                instructionsUpdated = false;
                MP_Util.LogInfo("CLINICAL SUMMARY : Completed updating CCD");

                //save the updated CCD back to CAMM
                CLINICAL_SUMMARY_O1.SaveToCAMMArchive(ccdXML);

                //save patient education acknowledge value
                var patEdAck = 0;
                if ($('#patEduChk').is(":checked"))
                    patEdAck = 1;
                CLINICAL_SUMMARY_O1.SavePatientEducation(patEdAck);
            }
            catch (err) {
                MP_Util.LogInfo("CLINICAL SUMMARY :" + err.message);
                if (timerPublishCCD) {
                    timerPublishCCD.Abort();
                    timerPublishCCD = null;
                }
            }
            finally {
                if (timerPublishCCD)
                    timerPublishCCD.Stop();
            }

        },
        UpdateInstruction: function (reply) {
            $('body').css('cursor', 'wait');
            var jsHTML = [];
            //Generate the tags for Description and text
            var replyStatus = reply.getStatus();
            var summaryI18n = i18n.discernabu.clinical_summary_o1;

            if (replyStatus === "S") {
                var recordData = reply.getResponse();
                jsHTML.push("<span class= 'Instructions'></span>");

                var ptCount = recordData.QAUL.length;

                if (ptCount > 0 && instructionsBuild.showPatientEducation) {
                    /*Patient Education */
                    jsHTML.push("<p class='di-hd'><b> Discharge Instructions [Education and Patient Visual Aids] </b></p><br />");
                    for (var i = 0, il = ptCount; i < il; i++) {
                        var instructionObj = recordData.QAUL[i];
                        jsHTML.push("<p style='font-weight: bold' class ='di-data-bold'>" + instructionObj.DISPLAY + "</p><br />"
									+ "<p class='di-data'>" + instructionObj.BLOB + "</p><br />");

                    }
                }

                var fpCount = recordData.FOLLOW_UP.length;
                if (fpCount > 0 && instructionsBuild.showFollowUp) {
                    /*Follow Up */
                    jsHTML.push("<p class='fl-hd'><b>Follow Up Care </b></p><br />");
                    for (var k = 0, kl = fpCount; k < kl; k++) {
                        var followUpObj = recordData.FOLLOW_UP[k];


                        jsHTML.push("<p class='fl-data'><span class ='styleBold'><b> " + summaryI18n.WITH + ": </b></span><span>" + followUpObj.PROVIDERNAME + "</span><br>"
								   + "<span class ='styleBold'><b> " + summaryI18n.ADDRESS + ": </b></span><span>" + followUpObj.PROVIDERADDRESS + "</span><br>"
								   + "<span class ='styleBold'><b> " + summaryI18n.WHEN + ":  </b></span><span>" + followUpObj.FOLLOWUPRANGE + "</span><br>"
								   + "<span class ='styleBold'><b> " + summaryI18n.COMMENTS + ":  </b></span><span>" + followUpObj.COMMENT + "</span></p><br />"
								);
                    }
                }

                if (fpCount > 0 || ptCount > 0) {
                    $("#instructionsDiv").html(jsHTML.join(""));
                    instSectionChanged = true;
                    instructionsUpdated = true;
                }
                else {
                    $("#instructionsDiv").html("<p class = 'no-data' style = 'padding-left:5px;'> No data available for this section</p><br>");
                    instSectionChanged = true;
                    instructionsUpdated = true;
                }
                $('body').css('cursor', 'auto');
				createCheckpoint("USR:MPG.CS.ADD INSTRUCTIONS", "Stop", [{ key: "Media ID", value: mediaIdentifier }]);
            }
        }
    };
} ();
/**
* Implementation of the Clinical Summary MPageView object
*/

/**
* A constructor used to create a new ClinicalSummaryMPage object and initialize page level variables.
* @constructor
*/
ClinicalSummaryMPage = function () {
    //Log info for debugger
    MP_Util.LogInfo("Rendering Clinical Summary MPages View");

    //Set page level information
    this.setCategoryMean("MP_CLIN_SUM");
    this.setName("CLINICAL SUMMARY MPAGE");
};
/**
* Setup the prototype and constructor to inherit from the base MPagesView
*/
ClinicalSummaryMPage.prototype = new MPageView();
ClinicalSummaryMPage.prototype.constructor = MPageView;

/**
* Initializes the MPageComponent objects that will be a part of the MPages View.  This function first calls the base initializeComponents
* function to setup all MPageComponent objects.  Once those objects are available the MPage name is set in each component.
* @return null
*/
ClinicalSummaryMPage.prototype.initializeComponents = function () {
    var component = null;
    var components = [];
    var mpageCategoryMean = "";
    var x = 0;

    //Call the base function to handle the basic component setup
    MPageView.prototype.InitClinSummaryComponents.call(this, null);

};

ClinicalSummaryMPage.prototype.InitClinSummaryComponents = function () {
    var component;
    var componentsArr = [];
    var componentCnt = 0;
    var criterion = null;
    var dateCheck = null;
    var dateFilter = null;
    var groupArr = null;
    var group = null;
    var loadingPolicy = null;
    var pageSettings = null;
    var sexFilter = null;
    var x = 0;
    var y = 0;
    var z = 0;

    try {
        //Create a Loading policy for use in the Bedrock functions
        loadingPolicy = new MP_Bedrock.LoadingPolicy();
        loadingPolicy.setLoadPageDetails(true);
        loadingPolicy.setLoadComponentBasics(true);
        loadingPolicy.setLoadComponentDetails(true);
        loadingPolicy.setCategoryMean(this.getCategoryMean());
        loadingPolicy.setCriterion(this.getCriterion());

        //Load the component ids
        pageSettings = this.getPageSettings();
        if (!pageSettings) {
            throw new Error(i18n.VIEW_SETTINGS_UNAVAILABLE);
        }
        componentsArr = pageSettings.COMPONENT;
        componentCnt = componentsArr.length;
        for (x = 0; x < componentCnt; x++) {
            this.addComponentId(componentsArr[x].BR_DATAMART_REPORT_ID);
        }

        //Call the bedrock functions to load the components.
        //Want to eventually move this into the component architecture to simplify.
        this.setComponents(MP_Bedrock.MPage.Component.LoadBedrockComponents(loadingPolicy, this.getComponentIds()));

        return true;
    }
    catch (err) {
        MP_Util.LogJSError(err, null, "mp_component_defs.js", "initializeComponents");
        throw err;
    }
};

ClinicalSummaryMPage.prototype.RenderComponent = function (mPage, helpFile, helpURL, categoryMeaning) {

    var i18nCore = i18n.discernabu;
    var criterion = mPage.getCriterion();
    if (categoryMeaning) {
        var body = _g(categoryMeaning);
    }
    else {
        var body = document.body;
    }
    var mpComps = mPage.getComponents();

    for (var x = 0; x < mpComps.length; x++) {
        var comp = mpComps[x];
        comp.InsertData();
    }
};
if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
    var ieVersion = new Number(RegExp.$1); // capture x.x portion and store as a number
}
else {
    var ieVersion = 0;
}

/**
* Create a new instance of an MPageView or WorkflowView object based on a category mean.
* @param {String} mPageCategoryMean The category mean of the MPageView to initialize
* @return {MPageView|WorkfowView} An object which is either an MPageView/WorkflowView object or an extension of that.
*/
function createViewObject(categoryMean, layoutType) {
    var viewObj;

    try {
        if (!categoryMean || typeof categoryMean != "string") {
            MP_Util.LogError("categoryMean parameter must be a string and not null");
            return null;
        }

        viewObj = new ClinicalSummaryMPage();
        viewObj.setCategoryMean(categoryMean);
        return viewObj;
    }
    catch (err) {
        if (err.type == "not_defined") {
            MP_Util.LogError("No object type defined for " + categoryMean + ": " + err.message);
        }
        else {
            MP_Util.LogJSError(err, null, "mpage-driver.js", "createViewObject");
        }
        return null;
    }
}

/**
* A function which loads MPages generically regardless of the page construct.  This function calls standard functions which are implemented
* in the MPageView base object, but can be overwritten by an object which uses the MPageView prototype.
* @param {String} mPageCategoryMean The category mean of the MPageView to render
* @return {MPageView} An object which is either an MPageView object or an extension of that.
*/
function renderMPagesView(mPageCategoryMean) {
    MP_Util.LogInfo("MPages Content Version: 4.3");
    var newMPage = null;
    newMPage = createViewObject(mPageCategoryMean);
    if (MPageView.prototype.isPrototypeOf(newMPage)) {
        newMPage.initializeMPageView();
        newMPage.loadPageSettings();
        newMPage.initializeComponents();
        newMPage.renderMPage();
        newMPage.postProcessing();
        return newMPage;
    }
    return null;
}

function RenderClinicalSummary() {
    CLINICAL_SUMMARY_O1.startTime = new Date();
    var mCriterion = json_parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(mCriterion, CERN_static_content);

    //Register events for the Custom Components Standard
    //MPage.registerUnloadEvent();
    //MPage.registerResizeEvent();

    /* Create a custom view for Clinical Summary MPages*/
    newMPage = createViewObject("MP_CLIN_SUM");

    //Load the filter mappings
    newMPage.loadFilterMappings();

    newMPage.setCapTimerName("CAP:MPG Launch MPage");
    newMPage.setSubTimerName(newMPage.getCategoryMean());

    //Create the MPage timers based on names set in the MPageView object
    newMPage.createMPageTimerObject();


    newMPage.setCriterion(criterion);
    newMPage.setViewpointIndicator((typeof m_viewpointJSON == "undefined") ? false : true);

    newMPage.loadPageSettings();

    newMPage.InitClinSummaryComponents();
    newMPage.setName("CLINICAL SUMMARY MPAGE");
    newMPage.RenderComponent(newMPage);
}

function retrieveMPage(criterion, mpageCategoryMean) {
    // Loading Policy
    var loadingPolicy = new MP_Bedrock.LoadingPolicy();
    loadingPolicy.setLoadPageDetails(true);
    loadingPolicy.setLoadComponentBasics(true);
    loadingPolicy.setLoadComponentDetails(true);
    loadingPolicy.setCategoryMean(mpageCategoryMean);
    loadingPolicy.setCriterion(criterion);
    var mpage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy);

    return mpage;
}

function setupSingleMPage(criterion, mpage, helpURL, helpLink) {
    MP_Util.LogInfo("MPages Content Version: 4.3");
    //Register events for the Custom Components Standard
    MPage.registerUnloadEvent();
    MPage.registerResizeEvent();
    MP_Util.Doc.InitLayout(mpage, helpLink, helpURL);

    if (mpage.isChartSearchEnabled()) {
        MP_Util.Doc.AddChartSearch(criterion, false);
    }

    if (mpage.isBannerEnabled()) {
        var patDemo = _g("banner" + criterion.category_mean);
        CERN_DEMO_BANNER_O1.GetPatientDemographics(patDemo, criterion);
    }

    window.setTimeout("MP_Util.Doc.RenderLayout()", 0);
}

function createPageCriterion(categoryMean) {
    var js_criterion = json_parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
    criterion.category_mean = categoryMean;
    return criterion;
}

