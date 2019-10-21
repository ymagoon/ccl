var DSWL_Worklist;

function RCM_DSWL_Worklist(component){
    var serviceDelegate = new DocumentationSpecialistWorklistDelegate();
    var worklistItems;
	var dswlWorklistChangeDialog = null;
	var dswlWorklistNoteHover = null;
	var dswlWorklistNoteExtra = null;
	var providerSearchControl;
	var documentationSpecialistsArray = [];
	var canModifyDateAndStatus;
	var canAddRel;
	var canUnassignRel;
	var statusCodes = [];
	var nuanceStatusCodes = [];
	var docSpecialistRelationshipTypeCd = "";
	var docSpecialistRelationshipTypeDisplay = "";
	var imageLocFlag;
	var imageLocDeleteUp;
	var imageLocDeleteOver;
	var imageLocEditOver;
	var imageLocEditUp;
	var noteImage;
	var newNoteImage;
	var notesToShow = 2;
	var noteTypes = {};
	var noteTaskAccess = 0;
	DSWL_Worklist = this;
	this.hovered = false;
	var documentReviewDueDateLink;
	var documentReviewDueDateViewpointLink;
	var documentReviewDueDateViewLink;
    var loc;
    var ribbonSettings;
    var isDueDateTimeEnabled = false;

	function getNoteSpliceIndex(note, notes){

		var i = notes.length;
		while(i--){
			//note.ID can either be in the form X.XXXXXXXE7 or XXXXXXXX
			if(notes[i].ID === note.ID || notes[i].ID == parseInt(note.ID, 10)){
				return i;
			}
		}
		return -1;
	};

	/**
	* creates HTML for table
	*/
	this.getWorklistHTML = function(){
		var worklistHTML = [];
		worklistHTML.push("<div id='dswlTableDiv'>");
		worklistHTML.push("<table id='dswlTable'>");
		worklistHTML.push("<tr id='floatingTableHeader'>");
		worklistHTML.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_LOCATION_SHORT, "</th>");
		worklistHTML.push("<th class='dswlworklist-th' scope='col'><span class='dswlworklist-IndicatorIndent'>", rcm_documentation_specialist_worklist_i18n.DSWL_PATIENT, "</span></th>");
		worklistHTML.push("<th id ='reasonHeader' class='dswlworklist-th' scope='col'><span class='dswlworklist-IndicatorIndent'>", rcm_documentation_specialist_worklist_i18n.DSWL_VISIT_REASON, "<br/>(",
		        rcm_documentation_specialist_worklist_i18n.DSWL_TYPE, rcm_documentation_specialist_worklist_i18n.DSWL_PIPE, rcm_documentation_specialist_worklist_i18n.DSWL_MED_SERVICE,
		        " / ", rcm_documentation_specialist_worklist_i18n.DSWL_ATTENDING, ")</span></th>");
		worklistHTML.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_DRG, "</th>");
		worklistHTML.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_VISIT_LENGTH, "<br/>(", rcm_documentation_specialist_worklist_i18n.DSWL_ACTUAL_LOS, "/", rcm_documentation_specialist_worklist_i18n.DSWL_EXPECTED_LOS, ")</th>");
		worklistHTML.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_NEXT_DOCUMENT_REVIEW, "<br/>(", rcm_documentation_specialist_worklist_i18n.DSWL_LAST_REVIEW, ")</th>");
		worklistHTML.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_DOCUMENTATION_SPECIALIST, "</th>");
		worklistHTML.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_PAYER, "<br/>(", rcm_documentation_specialist_worklist_i18n.DSWL_CLASS, ")</th>");
		worklistHTML.push("</tr>");
		worklistHTML.push("</table>");
		worklistHTML.push("</div>");
		return worklistHTML.join("");
	};

	function getNoteDeleteDialogHTML(){

		var html = [];
		html.push("<div id='dswlWorklistNoteDeleteDialog' class='dswlworklist-dialog'>");
			html.push("<div class='dswlworklist-dialog-title-bar'>");
				html.push("<label id='dswlworklistNoteDeleteDialogTitle'>", rcm_documentation_specialist_worklist_i18n.DSWL_REMOVE, "</label>");
			html.push("</div>");
			html.push("<div class='dswlworklist-dialog-message-area'>");
				html.push("<label id='dswlworklistNoteDeleteDialogMessage'>", rcm_documentation_specialist_worklist_i18n.DSWL_REMOVE_NOTE, "</label>");
			html.push("</div>");
			html.push("<div class='dswlWorklist-note-delete-buttons'>");
				html.push("<input id='dswlWorklistNoteDeleteBtnCancel' type='button' value='",rcm_documentation_specialist_worklist_i18n.DSWL_CANCEL,"' />");
				html.push("<input id='dswlWorklistNoteDeleteBtnOk' type='button' value='",rcm_documentation_specialist_worklist_i18n.DSWL_OK,"' />");
			html.push("</div>");
		html.push("</div>");

		return html.join("");
	};

	/**
	* function to initialize the worklist
	*/
	this.initialize = function(){
		var hoverParentElements = $(".dswlworklist-HoverParent");
		hoverParentElements.each(function(){
            var hoverParent = $(this).get(0);
            var hoverChild = $(this).children(".dswlworklist-Hover");
            if (hoverChild.children(".dswlworklist-AlertsHover").length && hoverChild.children(".dswlworklist-AlertsHover").text().length) {
                hs(hoverParent, hoverChild.get(0));
            } else if (!hoverChild.children(".dswlworklist-AlertsHover").length) {
                //Initializes all the non-alert icon hovers (drg, health plan, etc)
                hs(hoverParent, hoverChild.get(0));
            }
        });

		if(worklistItems && worklistItems.length > 0 && worklistItems[0].documentationSpecialist && worklistItems[0].documentationSpecialist.length > 0){
			$("#dswlworklistDocumentationSpecialistLabel").html(worklistItems[0].documentationSpecialist[0].typeDisplay);
		}
		else{
			$(".dswlDocumentationSpecialistColumn").hide();
		}
		var statusDisplays = $(".dswlworklistStatusDisplay");
		if(canModifyDateAndStatus){
			statusDisplays.each(function(){
				$(this).mouseover(function(){
					showDashedLine(this);
				});

				$(this).mouseout(function(){
					removeDashedLine(this);
				});

				$(this).click(function(){
					var $rowParent = $(this).closest("tr");
					var selectedEncounterId = getEncounterId($rowParent);
					var selectedVersionNum = getVersionNum($rowParent);
					var selectedPatientId = getPatientId($rowParent);
					openWorklistModifyDialog(selectedPatientId, selectedEncounterId, this, event);
				});
			});
		}

		var nextReviewDateContainers = $(".dswlworklist-assessment-date-col");
		nextReviewDateContainers.each(function(){
			$(this).mouseover(function(){
				showModifyDateImg(this);
			});

			$(this).mouseout(function(){
				hideModifyDateImg(this);
			});
		});

		if(canModifyDateAndStatus){
			var nextReviewDateDisplays = $(".dswlworklist-next-review-date-label");
			nextReviewDateDisplays.each(function(){
				$(this).mouseover(function(){
					showDashedLine(this);
				});

				$(this).mouseout(function(){
					removeDashedLine(this);
				});

				$(this).click(function(){
					var $rowParent = $(this).closest("tr");
					var selectedEncounterId = getEncounterId($rowParent);
					var selectedVersionNum = getVersionNum($rowParent);
					var selectedPatientId = getPatientId($rowParent);
					openWorklistModifyDialog(selectedPatientId, selectedEncounterId, this, event);
				});
			});
		}

		var nextReviewDateLinks = $(".dswlworklist-next-review-date-link");
		nextReviewDateLinks.each(function(){
			$(this).click(function(){
				removeDialogandLine();
			});
		});

		var documentationSpecialistNames = $(".dswlworklistDSRelationship");
		documentationSpecialistNames.each(function(){
			if((canAddRel===1 || canUnassignRel===1) || $(this).text() !== rcm_documentation_specialist_worklist_i18n.DSWL_UNASSIGNED){
				if(canAddRel===0 && canUnassignRel===1 && $(this).text() === rcm_documentation_specialist_worklist_i18n.DSWL_UNASSIGNED){
					//Do nothing
				}
				else{
					$(this).mouseover(function(){
						showDashedLine(this);
					});

					$(this).mouseout(function(){
						removeDashedLine(this);
					});

					$(this).click(function(){
						var $rowParent = $(this).closest("tr");
						var selectedEncounterId = getEncounterId($rowParent);
						var selectedVersionNum = getVersionNum($rowParent);
						var selectedPatientId = getPatientId($rowParent);
						openWorklistModifyDialog(selectedPatientId, selectedEncounterId, this, event);
					});
				}
			}
		});

		$("#dswlWorklistBtnOk").click(function(){
			$("#dswlWorklistOkDialog").hide();
			$("#listBlockingDiv").hide();
		});
    };

	/**
	 * loads the worklist table
	 */
	this.loadTable = function(criterion, items){
		if(!$("#listBlockingDiv").length){
			$("body").append("<div id='listBlockingDiv' class='transDiv'></div>");
		}
        loc = criterion.static_content;
		var html = [];
		html.push("<table id='dswlTable'>");
		html.push("<tr id='floatingTableHeader'>");
		html.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_LOCATION_SHORT, "</th>");
		html.push("<th class='dswlworklist-th' scope='col'><span class='dswlworklist-IndicatorIndent'>", rcm_documentation_specialist_worklist_i18n.DSWL_PATIENT, "</span></th>");
        var pat_rltn_type_string = '';
        var pat_rltn_type_Array = [];
        if (items && items.patReltTypeConfig && items.patReltTypeConfig.length > 0) {
            for (var x = 0; x < items.patReltTypeConfig.length; x++) {
                pat_rltn_type_Array.push(items.patReltTypeConfig[x].DISPLAY);
            }
            pat_rltn_type_string = rcm_documentation_specialist_worklist_i18n.DSWL_SLASH;
            pat_rltn_type_string += pat_rltn_type_Array.join(rcm_documentation_specialist_worklist_i18n.DSWL_PIPE);
            html.push("<th id ='reasonHeader' class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_VISIT_REASON, "<br/>(",
                rcm_documentation_specialist_worklist_i18n.DSWL_TYPE, rcm_documentation_specialist_worklist_i18n.DSWL_PIPE, rcm_documentation_specialist_worklist_i18n.DSWL_MED_SERVICE,
                " / ", rcm_documentation_specialist_worklist_i18n.DSWL_ATTENDING.replace('{0}', pat_rltn_type_string), ")</th>");
        }
        else
        {
            html.push("<th id ='reasonHeader' class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_VISIT_REASON, "<br/>(", 
                rcm_documentation_specialist_worklist_i18n.DSWL_TYPE, rcm_documentation_specialist_worklist_i18n.DSWL_PIPE, rcm_documentation_specialist_worklist_i18n.DSWL_MED_SERVICE,
                " / ", rcm_documentation_specialist_worklist_i18n.DSWL_ATTENDING.replace('{0}',"") ,")</th>");
		}
		html.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_DRG, "</th>");
		html.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_VISIT_LENGTH, "<br/>(", rcm_documentation_specialist_worklist_i18n.DSWL_ACTUAL_LOS, "/", rcm_documentation_specialist_worklist_i18n.DSWL_EXPECTED_LOS, ")</th>");
		html.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_NEXT_DOCUMENT_REVIEW, "<br/>(", rcm_documentation_specialist_worklist_i18n.DSWL_LAST_REVIEW, ")</th>");
		html.push("<th class='dswlworklist-th dswlDocumentationSpecialistColumn' scope='col'><span id='dswlworklistDocumentationSpecialistLabel'></span></th>");
		html.push("<th class='dswlworklist-th' scope='col'>", rcm_documentation_specialist_worklist_i18n.DSWL_PAYER, "<br/>(", rcm_documentation_specialist_worklist_i18n.DSWL_CLASS, ")</th>");
		html.push("</tr>");
        var zebraStriping = "";

		//Service failed
		if(items && !items.patients){
			html.push("<tr><td colspan='8'><b><center>", rcm_documentation_specialist_worklist_i18n.DSWL_ERROR_MESSAGE, "</center></b></td></tr>");
		}
		//Service succeeded but had no patient information
		else if(items && items.patients.length === 0){
			html.push("<tr><td colspan='8'><b><center>", rcm_documentation_specialist_worklist_i18n.DSWL_NO_RESULTS_FOUND, "</center></b></td></tr>");
		}
		//There are no patient lists
		else if(!items){
			html.push("<tr><td colspan='8' class='noWorklistContainer'>");
                html.push('<div class="no-patient-lists-image"><img src="', loc, '\\images\\search-large.png"></div>');
                html.push('<div class="no-patient-lists-primary-label">' + rcm_documentation_specialist_worklist_i18n.DSWL_NO_ACTIVE_LISTS + '</div>');
                html.push('<span class="no-patient-lists-secondary-label">' + rcm_documentation_specialist_worklist_i18n.DSWL_NO_ACTIVE_LISTS_LINE_2 + ' </span>');
                html.push('<span id="dswlMaintenanceLink" class="no-patient-lists-link">' + rcm_documentation_specialist_worklist_i18n.DSWL_LIST_MAINTENANCE + '</span>');
            html.push("</td></tr>");
		}
		else{
			statusCodes = items.statusCodes;
			nuanceStatusCodes = items.nuanceStatusCodes;
			noteTypes = items.noteTypes;
			worklistItems = items.patients;
			canModifyDateAndStatus = items.canAddStatusAndDate;
			canAddRel = items.canAddRel;
			canUnassignRel = items.canUnassignRel;
			noteTaskAccess = items.noteTaskAccess;
			documentReviewDueDateLink = items.documentReviewDueDateLink;
			documentReviewDueDateViewpointLink = items.documentReviewDueDateViewpointLink;
			documentReviewDueDateViewLink = items.documentReviewDueDateViewLink;
			isDueDateTimeEnabled = items.dueDateTimeInd;
            ribbonSettings = {
                isEddOn: items.isEddOn,
                eddAlertInd: items.eddAlertInd,
                eddWarnThreshold: items.eddWarnThreshold ? parseInt(items.eddWarnThreshold) : null,
                isAuthOn: items.isAuthOn,
                authAlertInd: items.authAlertInd,
                authWarnThreshold: items.authWarnThreshold ? parseInt(items.authWarnThreshold) : null,
                isElosOn: items.isElosOn,
                elosAlertInd: items.elosAlertInd,
                elosWarnThreshold: items.elosWarnThreshold ? parseInt(items.elosWarnThreshold) : null
            };
			for(var i = 0; i < worklistItems.length; i++){
				var person = worklistItems[i];
				if(i % 2 === 0){
					zebraStriping = "dswlworklist-zebra-striping-white";
				}
				else{
					zebraStriping = "dswlworklist-zebra-striping-blue";
				}
				html.push("<tr class='", zebraStriping, "'>");

				//Location
				html.push("<td class='dswlworklist-td-border'><div>");
				if(person.nurseUnit || person.roomNumber || person.bedNumber){
					html.push("<p><span class='dswlworklist-firstColumnItemFont'>", person.nurseUnit + ' ' + person.roomNumber + ' ' + person.bedNumber, "</span></p>");
				}
				html.push("</div></td>");

				//Get drg
				sortDRGS(person.drgs);
				var displayDRG = getDRGToDisplay(person.drgs, 0);
				var losElosPercentage = 0;
				var losHours = person.lengthOfStayHours;
				var elosHours = 0;
				if(displayDRG){
					elosHours = displayDRG.elosHours;
					if(elosHours){
						var width = (losHours / elosHours) * 100;
						losElosPercentage = Math.floor(width);
					}
				}


				//Patient
				html.push("<td onMouseOver='DSWL_Worklist.showNoteImg(this);' onMouseOut='DSWL_Worklist.hideNoteImg(this);' class='dswlworklist-td-border'>");
					var hasAlert = false;
					var alertImage = "";
					var alertsInfo = {
						losAlert : "",
						readmissionAlert : "",
						concurrentDenialAlert : "",
						differingWorkingDRGAlert : "",
						expectedResponsePastDueAlert : "",
                        authAlert: ""
					};

					if(displayDRG && (losElosPercentage > 100 || ((losElosPercentage === 0) && (elosHours === 0)))){
						hasAlert = true;
						alertsInfo.losAlert = rcm_documentation_specialist_worklist_i18n.DSWL_ALERT_LOS_ELOS;
					}

					if(person.readmissionFlag === 2){
						hasAlert = true;
						alertsInfo.readmissionAlert = rcm_documentation_specialist_worklist_i18n.DSWL_ALERT_READMIT;
					}

					if(person.concurrentDenialInd === 1){
						hasAlert = true;
						alertsInfo.concurrentDenialAlert = rcm_documentation_specialist_worklist_i18n.DSWL_ALERT_CONCURRENT_DENIAL;
					}

					if(person.differingWorkingDrgInd === 1){
						hasAlert = true;
						alertsInfo.differingWorkingDRGAlert = rcm_documentation_specialist_worklist_i18n.DSWL_ALERT_DIFFERING_WORKING_DRGS;
					}

					if(person.followUpResponsePastDueInd === 1){
						hasAlert = true;
						alertsInfo.expectedResponsePastDueAlert = rcm_documentation_specialist_worklist_i18n.DSWL_ALERT_FOLLOW_UP_RESPONSE_PAST_DUE;
					}
                    if (person.authorizationHours < losHours && person.healthPlanAuthorizations.length > 0){
                        hasAlert = true;
                        alertsInfo.authAlert = rcm_documentation_specialist_worklist_i18n.DSWL_ALERT_AUTH;
                    }
					imageLocFlag = loc + "\\images\\4948_flat16.png";
		        	imageLocDeleteUp = loc + "\\images\\6457_up_16.png";
		        	imageLocDeleteOver = loc + "\\images\\6457_over_16.png";
		        	imageLocEditOver = loc + "\\images\\6250_16.png";
		        	imageLocEditUp = loc + "\\images\\6250_grayscale_16.png";
		        	noteImage = loc + "\\images\\4972.gif";
		        	newNoteImage = loc + "\\images\\5153.ico";

					if(hasAlert){
						alertImage = loc + "\\images\\6047.ico";
					}
					var patientNameLink = createHRefString(person, items.patientNameLink, items.patientNameViewLink, items.patientNameViewpointLink);

					if(alertImage !== ""){
						html.push("<div>");
							html.push("<div class='dswlworklist-HoverParent dswlworklist-alert-image'><img src='",alertImage,"' class='dswlworklist-alert-image' alt='' />&nbsp;");
								html.push("<div class='dswlworklist-Hover'>");
									html.push("<div id='dswlAlertHover", Math.abs(person.encounterId),"' class='dswlworklist-AlertsHover'>");

										var isFirstLine = true;
										if(alertsInfo.losAlert !== ""){
											isFirstLine = false;
											html.push(alertsInfo.losAlert);
										}

                                        if (alertsInfo.authAlert !== "") {
                                            if (!isFirstLine) {
                                                html.push("<br />");
                                            }
                                            else {
                                                isFirstLine = false;
                                            }
                                            html.push(alertsInfo.authAlert);
                                        }

										if(alertsInfo.readmissionAlert !== ""){
											if(!isFirstLine){
												html.push("<br/>");
											}
											else{
												isFirstLine = false;
											}
											html.push(alertsInfo.readmissionAlert);
										}

										if(alertsInfo.concurrentDenialAlert !== ""){
											if(!isFirstLine){
												html.push("<br/>");
											}
											else{
												isFirstLine = false;
											}
											html.push(alertsInfo.concurrentDenialAlert);
										}

										if(alertsInfo.differingWorkingDRGAlert !== ""){
											if(!isFirstLine){
												html.push("<br/>");
											}
											else{
												isFirstLine = false;
											}
											html.push(alertsInfo.differingWorkingDRGAlert);
										}

										if(alertsInfo.expectedResponsePastDueAlert !== ""){
											if(!isFirstLine){
												html.push("<br/>");
											}
											html.push(alertsInfo.expectedResponsePastDueAlert);
										}
									html.push("</div>");
								html.push("</div>");
							html.push("</div>");
						html.push("</div>");
					}
                    else{
                        html.push("<div>");
                            html.push("<div  id='dswlImageParent", Math.abs(person.encounterId), "' class='dswlworklist-HoverParent dswlworklist-alert-image'>");
                                html.push("<div class='dswlworklist-Hover'>");
                                html.push("<div id='dswlAlertHover", Math.abs(person.encounterId), "' class='dswlworklist-AlertsHover'>");
                                html.push("</div>");
                                html.push("</div>");
                            html.push("</div>");
                        html.push("</div>");
                    }
					html.push("<div class='dswlworklist-IndicatorIndent'>");
					html.push("<div class='dswlworklist-HoverParent'>");
						if(person.patientName){
						html.push("<a style='font-size:12px; font-weight:bold; color:#2400A5; text-decoration:none; border:none;'", patientNameLink, ">", person.patientName, "</a>");
						}
						else{
						html.push("<br/>");
						}
						html.push("<div class='dswlworklist-Hover'>");
							html.push("<div>");
								html.push("<span class='dswlworklist-HoverLabel'>", rcm_documentation_specialist_worklist_i18n.DSWL_MRN, ":</span>");
								html.push("<span class='dswlworklist-HoverValue'>", person.mrn, "</span>");
							html.push("</div>");
							html.push("<div>");
								html.push("<span class='dswlworklist-HoverLabel'>", rcm_documentation_specialist_worklist_i18n.DSWL_DOB, ":</span>");
								html.push("<span class='dswlworklist-HoverValue'>", person.birthDate, "</span>");
							html.push("</div>");
						html.push("</div>");
					html.push("</div>");
					html.push("</div>");
					html.push("<div style='clear:both;'>");

					html.push("<div class='dswl-note-image-div'><img name='dswlWorklistNoteImg_", person.encounterId, "' onMouseOver='DSWL_Worklist.showNoteHover(",person.patientId,",",person.encounterId,", this, event)' onMouseOut='DSWL_Worklist.hovered=false; DSWL_Worklist.hideNoteHover(this)' " +
							"onClick='DSWL_Worklist.noteImgClickEvent(",person.patientId,",",person.encounterId,", this, event); DSWL_Worklist.keepNoteImgVisible(this);' ");
					if(person.careNoteInd == 0){
						html.push("class='dswl-note-image-hidden dswlworklist-transparent-line' src='", newNoteImage, "'></div>");
					}
					else{
						html.push("class='dswl-note-image dswlworklist-transparent-line' src='", noteImage, "'></div>");
					}

						html.push("<p class='dswlworklist-Indentation-small'><span class='dswlworklist-SecondaryBasic'>",person.age, "</span>&nbsp;&nbsp;&nbsp;");
						html.push("<span class='dswlworklist-SecondaryBasic'>", person.gender, "</span></p>");
						html.push("<p class='dswlworklist-Indentation-small'><span class='dswlworklist-LabelText'>",rcm_documentation_specialist_worklist_i18n.DSWL_FIN, ":</span>&nbsp;");
						html.push("<span class='dswlworklist-HeaderBasic'>",person.finNumber,"</span></p>");
						var statusCdString = "dswlStatus" + person.documentReviewStatusCd;
						if((person.documentReviewStatusMean === "COMPLETE") || (person.documentReviewStatusMean === "NOTSTARTED")){
							html.push("<p class='dswlworklist-Indentation'><div id='",statusCdString,"' class='dswlworklist-Indentation'><span id='dswlworklistStatusDisplay' class='dswlworklist-plain-bold-font dswlworklistStatusDisplay dswlworklist-transparent-line'>", person.documentReviewStatus, "</span></div></p>");
						}
						else if(person.documentReviewStatusMean === ""){
							html.push("<p class='dswlworklist-Indentation'><div id='",statusCdString,"' class='dswlworklist-Indentation'><span id='dswlworklistStatusDisplay' class='dswlworklist-plain-font dswlworklistStatusDisplay dswlworklist-transparent-line'>", rcm_documentation_specialist_worklist_i18n.DSWL_NOT_AVAILABLE, "</span></div></p>");
						}
						else{
							html.push("<p class='dswlworklist-Indentation'><div id='",statusCdString,"' class='dswlworklist-Indentation'><span id='dswlworklistStatusDisplay' class='dswlworklist-plain-font dswlworklistStatusDisplay dswlworklist-transparent-line'>", person.documentReviewStatus, "</span></div></p>");
						}
					html.push("</div>");
				html.push("</td>");

				//Visit Reason
				html.push("<td class='dswlworklist-td-border visitReasonWidth'><div><p>");
					if(person.visitReason){
						html.push("<span class='dswlworklist-HeaderBasic'>", person.visitReason, "</span>");
					}
					else{
						html.push("<br/>");
					}
					html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-SecondaryBasic'>", person.encounterType, " | ",
					    person.medicalService || "--", "</p>");
                    if (person.attendingPhysician) {
                       html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-SecondaryBasic'>", person.attendingPhysician, "</p>");
                    } else {
                      html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-SecondaryBasic'>",rcm_documentation_specialist_worklist_i18n.DSWL_MISSING_DATA, "</p>");
                    }
                    var nameArry = [];
                    var pat_rltn_name_string = '';
                    if (person.patPrsnReltns && items.patReltTypeConfig) {
                        for(var y = 0; y < items.patReltTypeConfig.length; y++) {
                            pat_rltn_name_string = rcm_documentation_specialist_worklist_i18n.DSWL_MISSING_DATA;
                            for(var k = 0; k < person.patPrsnReltns.length; k++){
                                if(items.patReltTypeConfig[y].TYPE_CD == person.patPrsnReltns[k].TYPE_CD){
                                    if(person.patPrsnReltns[k].FULL_PERSONNEL_NAME) {
                                    pat_rltn_name_string = person.patPrsnReltns[k].FULL_PERSONNEL_NAME;
                                    }
                                    break;
                                }
                            }
                            nameArry.push(pat_rltn_name_string);
                        }
                        pat_rltn_name_string = nameArry.join(rcm_documentation_specialist_worklist_i18n.DSWL_PIPE);
                    }
                    html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-SecondaryBasic'>", pat_rltn_name_string, "</span></p></p></div></td>");

				//Invisible EncounterId
				html.push("<td id='dswl-Col", person.encounterId, "' class='dswlworklist-encounterCol'></td>");

				//Invisible Version
				html.push("<td id='dswl-Col", person.version, "' class='dswlworklist-versionCol'></td>");

				//Invisible PatientId
				html.push("<td id='dswl-Col", person.patientId, "' class='dswlworklist-patientIdCol'></td>");

				//DRG
				html.push("<td class='dswlworklist-td-border nowrap'>");
					if(!displayDRG){
						html.push("<div><p></p></div>");
					}
					else{
						var transferImageLoc = loc + "\\images\\6405_16.png";

						if(displayDRG.transferRuleInd === 1){
							html.push("<div style='float:left' class='dswlworklist-transfer-image'><img src='", transferImageLoc, "' alt=''/></div>");
						}
						html.push("<div class='dswlworklist-HoverParent'>");

								html.push("<span class='dswlworklist-HeaderBasic'");
								if(person.differingWorkingDrgInd){
									html.push(" style='color:red; font-weight:bold;'>");
								}else if (displayDRG.finalInd){
									html.push(" style='color:black; font-weight:bold;'>");
								}else{
									html.push(">");
								}
	                            	html.push(displayDRG.sourceIdentifier);
	                            html.push("</span>");
	                            html.push("<div class='dswlworklist-UnitsText'>");
									html.push(displayDRG.sourceVocabularyDisplay);
								html.push("</div>");
	                        html.push("<div class='dswlworklist-Hover'>");
	                            for(var k = 0; k < person.drgs.length; k++) {
	                            	var drg = person.drgs[k];
	                            	html.push("<span>");
		                            if (drg.transferRuleInd === 1){
		                            	html.push("<div style='float:left' class='dswlworklist-transfer-image'><img src='", transferImageLoc, "' alt=''/></div>");
		                            }
	                            	html.push(drg.description, "&nbsp;(", drg.sourceIdentifier, ")");
	                            	html.push("</span>");
									if(drg.severityOfIllnessDisplay || drg.riskOfMortalityDisplay || drg.drgWeight){
										html.push("<p class='dswlworklist-Indentation2 dswlworklist-UnitsText'>");
											html.push(rcm_documentation_specialist_worklist_i18n.DSWL_SEVERITY_OF_ILLNESS, "&nbsp;", drg.severityOfIllnessDisplay, "&nbsp;&nbsp;&nbsp;");
											html.push(rcm_documentation_specialist_worklist_i18n.DSWL_RISK_OF_MORTALITY, "&nbsp;", drg.riskOfMortalityDisplay, "&nbsp;&nbsp;&nbsp;");
											html.push(rcm_documentation_specialist_worklist_i18n.DSWL_DRG_WEIGHT, "&nbsp;", drg.drgWeight);
										html.push("</p>");
									}
	                            	html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'>", drg.finalInd ? rcm_documentation_specialist_worklist_i18n.DSWL_DRG_FINAL_HOVER : rcm_documentation_specialist_worklist_i18n.DSWL_DRG_WORKING_HOVER, "&nbsp;(", drg.contributerSystem, ")</span></p>");
	                            }
	                        html.push("</div>");
                        html.push("</div>");
					}
				html.push("</td>");

				//Visit Length
				html.push("<td class='dswlworklist-td-border'>");
                        RcmAuthRibbonHelper.setImagePath(loc + "\\images\\");
                        if(ribbonSettings.isEddOn){
                        html.push("<div id='losRibbon", Math.abs(person.encounterId),"' class='dswlworklist-ribbon-spacing'>");
                            html.push(RcmAuthRibbonHelper.createLosDisplay(losHours));
                            html.push(RcmAuthRibbonHelper.createLoadingRibbon());
                            html.push(RcmAuthRibbonHelper.createEmptyDayTypes(ribbonSettings));
                        html.push("</div>");
                        }
                        else{
                            var authHours = person.authorizationHours;
                            var personRibbonInfo = {
                                ENCOUNTER_ID: person.encounterId,
                                AUTHORIZATION_DT_TM: person.authorizationDate,
                                HEALTH_PLAN_AUTHORIZATIONS: person.healthPlanAuthorizations,
                                ELOS_DATE: RcmAuthRibbonHelper.calculateDateFromAdmit(person.admitDate, elosHours)
                            };
                            var authRibbon = new RcmAuthRibbon(losHours, elosHours, 0, authHours, personRibbonInfo, ribbonSettings, loc);
                            html.push("<div class='dswlworklist-ribbon-spacing'>");
                                html.push(authRibbon.getAllRibbonHtml());
                            html.push("</div>");
                        }
                        html.push("<div><p class='dswlworklist-Indentation2'>");

                        var readmissionLink = createHRefString(person, items.readmissionLink, items.readmissionViewLink, items.readmissionViewpointLink);
                        if (person.readmissionFlag > 0) {
                            if (person.readmissionFlag === 1) {
                            	html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'><a style='color:#999999; text-decoration:none;'", readmissionLink,">", rcm_documentation_specialist_worklist_i18n.DSWL_READMITTED, ":</a>&nbsp;");
                            }
                            else
                                if (person.readmissionFlag === 2) {
                                	html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'><a style='color:red; text-decoration:none; font-weight:bold;'", readmissionLink,">", rcm_documentation_specialist_worklist_i18n.DSWL_READMITTED, ":</a>&nbsp;");
                                }
                        }
                        else {
                            html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'>", rcm_documentation_specialist_worklist_i18n.DSWL_ADMITTED, ":&nbsp;");
                        }

                        html.push(RCM_Clinical_Util.formatJsonDateString(person.admitDate), "</span></p>");
                        if (person.dischargeDate != "") {
                            html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'><b>", rcm_documentation_specialist_worklist_i18n.DSWL_DISCHARGED, ":</b>&nbsp;");
                            html.push(RCM_Clinical_Util.formatJsonDateString(person.dischargeDate), "</span></p>");
                        }
                        html.push("</p></div></td>");

				//Next Documentation Review Date
				html.push("<td class='dswlworklist-td-border dswlworklist-assessment-date-col'>");
				//html.push("<div class='dswlworklist-HoverParent'>");
						var nextDocumentationReview = createHRefString(person, documentReviewDueDateLink, documentReviewDueDateViewLink, documentReviewDueDateViewpointLink);

						html.push("<div id='dswlworklistDateDisplayParent' class='dswlworklist-next-review-date-container'>");
							var nextDocumentationReviewDate = getComparisonDate((person.documentReviewDueDT));
							if (!nextDocumentationReviewDate) {
								html.push("<div id='dswlworklistDateDisplay' class='dswlworklist-plain-font dswlworklist-HeaderBasic dswlworklist-next-review-date-label dswlworklist-transparent-line'>", rcm_documentation_specialist_worklist_i18n.DSWL_NO_DATE, "</div>");
							}

							else {
								var todaysDate = getTodaysDate();
								var tomorrowDate = getTomorrowsDate();
								var yesterdayDate = getYesterdaysDate();
								var twoDaysFromNowDate = getTwoDaysFromNowDate();
								var nextDocumentationReviewDateDisplay;

                                if (nextDocumentationReviewDate.getTime() < yesterdayDate.getTime()) {
                                    nextDocumentationReviewDateDisplay = getNumOfDaysAgo(person.documentReviewDueDT);
                                    html.push("<div id='dswlworklistDateDisplay' class='dswlworklist-alert-font dswlworklist-next-review-date-label dswlworklist-transparent-line'>", nextDocumentationReviewDateDisplay, "</div>");
                                } else if (nextDocumentationReviewDate.getTime() < todaysDate.getTime()) {
                                    nextDocumentationReviewDateDisplay = rcm_documentation_specialist_worklist_i18n.DSWL_YESTERDAY;
                                    nextDocumentationReviewDateDisplay += isDueDateTimeEnabled ? " " + RCM_Clinical_Util.formatJsonTimeString(person.documentReviewDueDT, "militaryTime") : "";
                                    html.push("<div id='dswlworklistDateDisplay' class='dswlworklist-alert-font dswlworklist-next-review-date-label dswlworklist-transparent-line'>", nextDocumentationReviewDateDisplay, "</div>");
                                } else if (nextDocumentationReviewDate.getTime() < tomorrowDate.getTime()) {
                                    nextDocumentationReviewDateDisplay = rcm_documentation_specialist_worklist_i18n.DSWL_TODAY;
                                    nextDocumentationReviewDateDisplay += isDueDateTimeEnabled ? " " + RCM_Clinical_Util.formatJsonTimeString(person.documentReviewDueDT, "militaryTime") : "";
                                    html.push("<div id='dswlworklistDateDisplay' class='dswlworklist-plain-bold-font  dswlworklist-next-review-date-label dswlworklist-transparent-line'>", nextDocumentationReviewDateDisplay, "</div>");
                                } else if (nextDocumentationReviewDate.getTime() < twoDaysFromNowDate.getTime()) {
                                    nextDocumentationReviewDateDisplay = rcm_documentation_specialist_worklist_i18n.DSWL_TOMORROW;
                                    nextDocumentationReviewDateDisplay += isDueDateTimeEnabled ? " " + RCM_Clinical_Util.formatJsonTimeString(person.documentReviewDueDT, "militaryTime") : "";
                                    html.push("<div id='dswlworklistDateDisplay' class='dswlworklist-plain-font dswlworklist-next-review-date-label dswlworklist-transparent-line'>", nextDocumentationReviewDateDisplay, "</div>");
                                } else {
                                    nextDocumentationReviewDateDisplay = isDueDateTimeEnabled ? RCM_Clinical_Util.formatJsonDateAndTimeString(person.documentReviewDueDT, "longDateTime3") : RCM_Clinical_Util.formatJsonDateString(person.documentReviewDueDT);
                                    html.push("<div id='dswlworklistDateDisplay' class='dswlworklist-plain-font dswlworklist-next-review-date-label dswlworklist-transparent-line'>", nextDocumentationReviewDateDisplay, "</div>");
                                }
							}
							html.push("<div id='dswlworklistNextReviewDateLink' class='dswlworklist-next-review-date-img-container'>");
							html.push("<a ",nextDocumentationReview,"><img class='dswlworklist-next-review-date-link' src='", loc, "\\images\\3738.ico' alt=''/></a>");
							html.push("</div>");
						html.push("</div>");

						var lastDocumentReviewDate = getComparisonDate((person.lastDocumentReviewDT));
						if(!lastDocumentReviewDate){
							html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'></span></p>");
						}
						else{
							var todaysDate = getTodaysDate();
                            var tomorrowDate = getTomorrowsDate();
                            var yesterdayDate = getYesterdaysDate();
							if(lastDocumentReviewDate.getTime() === todaysDate.getTime()){
								html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'>", rcm_documentation_specialist_worklist_i18n.DSWL_TODAY,"</span></p>");
							}
							else if(lastDocumentReviewDate.getTime() === tomorrowDate.getTime()){
								html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'>", rcm_documentation_specialist_worklist_i18n.DSWL_TOMORROW,"</span></p>");
							}
							else if(lastDocumentReviewDate.getTime() === yesterdayDate.getTime()){
								html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'>", rcm_documentation_specialist_worklist_i18n.DSWL_YESTERDAY,"</span></p>");
							}
							else if(lastDocumentReviewDate.getTime() < todaysDate.getTime()){
								var lastClinicalReviewDateDisplay = getNumOfDaysAgo(person.lastDocumentReviewDT);
								html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'>", lastClinicalReviewDateDisplay,"</span></p>");
							}
							else{
								html.push("<p class='dswlworklist-Indentation2'><span class='dswlworklist-UnitsText'>", RCM_Clinical_Util.formatJsonDateString(person.lastDocumentReviewDT),"</span></p>");
							}
						}

					/*html.push("<div class='dswlworklist-Hover'>");
						html.push("<div>");
                   	 		html.push("<span class='dswlworklist-HoverLabel'>", rcm_documentation_specialist_worklist_i18n.DSWL_NEXT_REVIEW, ":</span>");
                        	html.push("<span class='dswlworklist-HoverValue'>");
                        		html.push(RCM_Clinical_Util.formatJsonDateString(person.documentReviewDueDT));
							html.push("</span>");
						html.push("</div>");
						html.push("<div>");
							html.push("<span class='dswlworklist-HoverLabel'>",rcm_documentation_specialist_worklist_i18n.DSWL_LAST_REVIEW,":</span>");
							html.push("<span class='dswlworklist-HoverValue'>");
                        		html.push(RCM_Clinical_Util.formatJsonDateString(person.lastDocumentReviewDT));
							html.push("</span>");
						html.push("</div>");
					html.push("</div>");
                    html.push("</div>");*/
					html.push("</td>");

				//Documentation Specialist
				html.push("<td class='dswlworklist-td-border dswlDocumentationSpecialistColumn'>");
				html.push("<div>");
				if(docSpecialistRelationshipTypeCd === "" && docSpecialistRelationshipTypeDisplay === "" && person.documentationSpecialist.length > 0){
					docSpecialistRelationshipTypeCd = person.documentationSpecialist[0].typeCd;
					docSpecialistRelationshipTypeDisplay = person.documentationSpecialist[0].typeDisplay;
				}
				if(person.documentationSpecialist.length > 0 && person.documentationSpecialist[0].name !== ""){
					html.push("<span id='dswlworklistDSRelationshipDisplay' class='dswlworklistDSRelationship dswlworklist-plain-font dswlworklist-docSpecIndent dswlworklist-transparent-line'>", person.documentationSpecialist[0].name,"</span>");
				}
				else{
					if(person.documentationSpecialist.length > 0){
						html.push("<span id='dswlworklistDSRelationshipDisplay' class='dswlworklistDSRelationship dswlworklist-plain-font dswlworklist-docSpecIndent dswlworklist-transparent-line'>",rcm_documentation_specialist_worklist_i18n.DSWL_UNASSIGNED,"</span>");
					}
					else{
						html.push("<span class='dswlworklist-docSpecIndent'>",rcm_documentation_specialist_worklist_i18n.DSWL_ERROR_MESSAGE,"</span>");
					}
				}
				html.push("</div>");
				html.push("</td>");


				//Payer
				html.push("<td class='dswlworklist-td-border'>");
					if (!person.payer && !person.finClass) {
						html.push("<div><p></p></div>");
					}
					else {
						html.push("<div class='dswlworklist-HoverParent'>");
							if (person.payer) {
								html.push("<span>", person.payer, "</span>");
							}
							html.push("<br/>");
							html.push("<span class='dswlworklist-SecondaryBasic' style='margin-left:0.968em;'>", person.finClass, "</span>");
							html.push("<div class='dswlworklist-Hover'>");
								html.push("<div>");
									html.push("<span class='dswlworklist-HoverLabel'>", rcm_documentation_specialist_worklist_i18n.DSWL_PLAN, ":&nbsp;</span>");
									html.push("<span class='dswlworklist-HoverValue'>", person.healthPlan, "</span>");
								html.push("</div>");
							html.push("</div>");
						html.push("</div>");
					}
					html.push("</td>");
				html.push("</tr>");
			}
		}
		html.push("</table>");
		html.push(createWorklistModifyDialog());
		createNoteHover();
        createRibbonPopOut();
		html.push(getOkDialogHTML());
		var tableString = html.join("");
        var tableDiv = document.getElementById('dswlTableDiv');
        if (tableDiv) {
            //already rendered.  Show the new table.
            document.getElementById('dswlTableDiv').innerHTML = tableString;
            return null;
        }
        //used on first load, when table isn't rendered yet due to the way the html is built.
        return tableString;
	};

    this.openListMaintenance = function(){
        var maintenanceObj = window.external.DiscernObjectFactory("PMLISTMAINTENANCE");
        $("#listBlockingDiv").show();
        if (maintenanceObj.OpenListMaintenanceDialog() === 0){
            $("#listBlockingDiv").hide();
            return;
        }
        $("#listBlockingDiv").hide();
        component.initialize();
    }

	function createWorklistModifyDialog(){
			var modifyDiv = document.createElement("div");
			modifyDiv.id = "dswlworklistModifyDialog";
			modifyDiv.className = "dswlworklist-modify-dialog";
			document.body.appendChild(modifyDiv);
		};

	function createNoteHover(){
		var hoverDiv = document.createElement("div");
		hoverDiv.id = "dswlWorklistNoteHover";
		hoverDiv.className = "dswlWorklist-note-hover";
		document.body.appendChild(hoverDiv);

		var extraDiv = document.createElement("div");
		extraDiv.id = "dswlWorklistNoteExtra";
		extraDiv.className = "dswlWorklist-note-extra";
		document.body.appendChild(extraDiv);
	};

    function createRibbonPopOut(){
        document.body.appendChild(RcmAuthRibbonHelper.createPopOutShell());
    }
	/**
     * Returns the DRG to display based on the mode.
     * @param drgs The list of DRG records.
     * @param mode The mode.  0 = Return either working or final DRG. 1 = Return only final DRG. 2 = Return only working DRG.
     * @returns
     */
	function getDRGToDisplay(drgs, mode){
		switch(drgs.length){
		case 0:
			return null;
		case 1:
			var drg = drgs[0];
			switch(mode){
			case 0:
				return drg;
			case 1:
				return drg.finalInd ? drg : null;
			case 2:
				return !drg.finalInd ? drg : null;
			}
		default:
    		// Final is not returned when there are multiple DRGs.
    		if(mode === 1) {
    			return null;
    		}
    		for(var i = 0; i < drgs.length; i++) {
    			var drg = drgs[i];
    			if(drg.finalInd) {
    				return drg;
    			}
    		}
    		// There are no Care Management Working DRGs so return the first one.
    		return drgs[0];
		}
	};

	/**
     * Sorts the list of DRGs so that CM working DRGs are first.
     * @param drgs The list of DRGs.
     */
	function sortDRGS(drgs){
		drgs.sort(function(drg1, drg2) {
    		// Return  0 when they are the same.
    		// Return  1 when drg1 is CM and drg2 is not CM.
    		// Return -1 when drg1 is not CM and drg2 is CM.
    		return drg2.cmWorkingDrgInd - drg1.cmWorkingDrgInd;
        });
	};

	function createHRefString(person, linkTab, linkView, linkViewpoint){
	    linkTab = linkTab || "";
		linkView = linkView || "";
		linkViewpoint = linkViewpoint || "";
		var appName = rcm_documentation_specialist_worklist_i18n.DSWL_POWERCHART;
		return "href='javascript:VIEWLINK(0, \"" + appName + "\", \"" + person.patientId + "\", \"" + person.encounterId + "\", \"" + linkTab + "\", \"" + linkView + "\", \"" + linkViewpoint + "\");'";
	};

   function getComparisonDate(date){
        var nrDate;
        if (date === "") {
            nrDate = "";
        }
        else {
            var tempDate = new Date();
            tempDate.setISO8601(date);
            nrDate = new Date(tempDate);
			nrDate = zeroOutDate(nrDate);
        }
        return nrDate;
    };

    function getTodaysDate(){
        var tempDate = new Date();
		tempDate = zeroOutDate(tempDate);
        return tempDate;
    };

	function getTomorrowsDate(){
		var tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
		tomorrowDate = zeroOutDate(tomorrowDate);
		return tomorrowDate;
	};

	function getTwoDaysFromNowDate() {
	    var twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
        twoDaysFromNow = zeroOutDate(twoDaysFromNow);
        return twoDaysFromNow;
	};

	function getYesterdaysDate(){
    	var yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
		yesterdayDate = zeroOutDate(yesterdayDate);
		return yesterdayDate;
	};

	function getNumOfDaysAgo(nextReviewDate){
		var tempDate = new Date();
		tempDate.setISO8601(nextReviewDate);
		var nrDate = new Date(tempDate);
		var nextReview = nrDate.getTime();
		var tempDate2 = new Date();
		var today = tempDate2.getTime();
		var days = Math.floor((Math.abs(today - nextReview)) / (1000 * 60 * 60 * 24));
		var dateString = days + " " + rcm_documentation_specialist_worklist_i18n.DSWL_DAYS_AGO;
		return dateString;
	};

	function zeroOutDate(date){
		date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
		return date;
	};

	var getEncounterId = function($row){
		var encounterColumnId = $row.find(".dswlworklist-encounterCol").attr("id");
		var encounterId = encounterColumnId.substring(8);
		return Number(encounterId);
	};

	var getVersionNum = function($row){
		var versionColumnId = $row.find(".dswlworklist-versionCol").attr("id");
		var versionId = versionColumnId.substring(8);
		return parseInt(versionId);
	};

	var setVersionNum = function($row, num){
		var newVersionString = "dswl-Col" + num
		$row.find(".dswlworklist-versionCol").attr("id", newVersionString);
	};

	var getPatientId = function($row){
		var patientIdColumnId = $row.find(".dswlworklist-patientIdCol").attr("id");
		var patientId = patientIdColumnId.substring(8);
		return Number(patientId);
	};

	function showDashedLine(name){
		if(!($(name).hasClass("dswlworklist-solid-line"))){
			$(name).removeClass("dswlworklist-transparent-line");
			$(name).addClass("dswlworklist-dashed-line");
		}
	};

	function removeDashedLine(name){
		if(!($(name).hasClass("dswlworklist-solid-line"))){
			$(name).removeClass("dswlworklist-dashed-line");
			$(name).addClass("dswlworklist-transparent-line");
		}
	};

	function showModifyDateImg(name){
		if(!($(name).find("#dswlworklistDateDisplay").hasClass("dswlworklist-solid-line"))){
			var modifyImg = $(name).find("#dswlworklistNextReviewDateLink");
			$(modifyImg).css("visibility", "visible");
		}
	};

	function hideModifyDateImg(name){
		var modifyImg = $(name).find("#dswlworklistNextReviewDateLink");
		$(modifyImg).css("visibility", "hidden");
	};

	this.showNoteImg = function(name){
		if(noteTaskAccess && !$.isEmptyObject(noteTypes)){
			$(name).find(".dswl-note-image-hidden").css("visibility","visible");
		}
	};

	this.hideNoteImg = function(name){
		$(name).find(".dswl-note-image-hidden").css("visibility","hidden");
	};

	this.keepNoteImgVisible = function(name){
		$(name).addClass("dswl-note-image-show");
	};

	this.noteImgClickEvent = function(personId, encounterId, img, event){
		$(img).removeClass("dswlworklist-dashed-line");
		removeDialogandLine();
		DSWL_Worklist.showNoteHover(personId, encounterId, img, event);
	};

	this.showNoteHover = function(personId, encounterId, img, event){
		if(dswlWorklistChangeDialog != null){
			$(img).removeClass("dswlworklist-transparent-line");
			$(img).addClass("dswlworklist-dashed-line");
			return false;
		} else if ($(img).hasClass("dswl-note-image-edit")){
			return false;
		}
		DSWL_Worklist.hovered = true;

		$(".dswlworklist-solid-line").removeClass("dswlworklist-solid-line");
		$(".dswl-note-image-show").removeClass("dswl-note-image-show");
		clearNoteHover();

		$(img).removeClass("dswlworklist-transparent-line");
		$(img).addClass("dswlworklist-solid-line");
		if($(img).hasClass("dswl-note-image-hidden")){
			$(img).addClass("dswl-note-image-show");
		}

		dswlWorklistNoteHover = document.getElementById("dswlWorklistNoteHover");
		dswlWorklistNoteExtra = document.getElementById("dswlWorklistNoteExtra");

		dswlWorklistNoteHover.innerHTML = "";
		createNoteHoverHTML(personId, encounterId);
		dswlWorklistNoteExtra.innerHTML = "<div class='dswlWorklist-note-extra-inner'></div>"; //width = Hover width + border - icon width

		var pos = getMousePosition(img, event);
		dswlWorklistNoteHover.style.top = pos.y + 'px';
		dswlWorklistNoteHover.style.left = pos.x + 'px';
		dswlWorklistNoteHover.style.display = 'block';

		var topRightPos = getMousePositionTopRight(img, event);
		dswlWorklistNoteExtra.style.top = topRightPos.y + 'px';
		dswlWorklistNoteExtra.style.left = topRightPos.x + 'px';
		dswlWorklistNoteExtra.style.display = 'block';

		$("#dswlWorklistNoteHover, #dswlWorklistNoteExtra").hover(function(){
			DSWL_Worklist.hovered = true;
		}, function(){
			DSWL_Worklist.hovered = false;
			DSWL_Worklist.hideNoteHover(img);
		});

		$("div[id^='noteDiv']").hover(function(){
			$(this).find(".dswlWorklist-note-hover-menu").css("visibility", "visible");
		}, function(){
			$(this).find(".dswlWorklist-note-hover-menu").css("visibility", "hidden");
		});

		$(".dswlWorklist-note-delete-image").hover(function(){
			$(this).attr('src', imageLocDeleteOver);
		}, function(){
			$(this).attr('src', imageLocDeleteUp);
		}).click(function(){
			var noteToDelete = $(this).parents("div[id^='noteDiv']:first").data('note');
			$("body").append(getNoteDeleteDialogHTML());
			$("#dswlWorklistNoteDeleteDialog").css("top", $("#floatingTableHeader").offset().top + 250);
			$("#dswlWorklistNoteDeleteDialog").show();
			$("#listBlockingDiv").show();
			RCM_Clinical_Util.setFocus("dswlWorklistNoteDeleteBtnOk");

			$("#dswlWorklistNoteDeleteBtnOk").click(function(){
				deleteNote(noteToDelete);
			});

			$("#dswlWorklistNoteDeleteBtnCancel").click(function(){
				$("#listBlockingDiv").hide();
				$("#dswlWorklistNoteDeleteDialog").remove();
			});
		});

		$(".dswlWorklist-note-edit-image").hover(function(){
			$(this).attr('src', imageLocEditOver);
		}, function(){
			$(this).attr('src', imageLocEditUp);
		}).click(function(){
			var modifyDiv = $(this).parents("div[id^='noteDiv']:first");
			var modifyNote = modifyDiv.data('note');
			convertNoteHoverToDialog(personId, encounterId, "MODIFY", modifyNote, modifyDiv.attr('id'));
		});
	};

	this.hideNoteHover = function(img){
		setTimeout(function(){
			if(!DSWL_Worklist.hovered){
                if(document.selection) {
                    document.selection.empty();
                }
				$(img).removeClass("dswlworklist-solid-line dswlworklist-dashed-line");
				$(".dswl-note-image-show").removeClass("dswl-note-image-show");
				if(dswlWorklistNoteHover){
					dswlWorklistNoteHover.innerHTML = '';
					dswlWorklistNoteHover.style.display = 'none';
					dswlWorklistNoteHover = null;
				}
				if(dswlWorklistNoteExtra){
					dswlWorklistNoteExtra.innerHTML = '';
					dswlWorklistNoteExtra.style.display = 'none';
					dswlWorklistNoteExtra = null;
				}
				$(window).resize();
			}
		}, 5);
	};

	function deleteNote(note){
		var jsonRequest = {
			"delete_note_request":{
				"note_id": note.ID,
				"update_cnt": note.VERSION
			}
		};
		serviceDelegate.deleteCareNote(jsonRequest,function(status, recordData){
			$("#listBlockingDiv").hide();
			$("#dswlWorklistNoteDeleteDialog").remove();
			if (status === 'S'){
				$.each(worklistItems, function(i, item){
					if((note.PARENTENTITYNAME === "PERSON" && note.PARENTENTITYID === item.patientId) ||
							(note.PARENTENTITYNAME === "ENCOUNTER" && note.PARENTENTITYID === item.encounterId)){
						var spliceIndex = getNoteSpliceIndex(note, item.notes);
						if(spliceIndex > -1){ //spliceIndex should never be -1 on a delete
							item.notes.splice(spliceIndex, 1);
							if(item.notes.length === 0){
								$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").css('visibility', 'hidden');
								$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").removeClass("dswl-note-image").addClass("dswl-note-image-hidden");
								$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").attr("src", newNoteImage);
							}
						}
						if(note.PARENTENTITYNAME === "ENCOUNTER"){
							return false;
						}
					}
				});
			}
			else{
				var exception = recordData.EXCEPTIONINFORMATION[0];
				if (exception.EXCEPTIONTYPE === "STALE_DATA"){
					openStaleDataDialog();
				}
				else{
					openSaveFailedDialog();
				}
			}
		},true);
	};

	function convertNoteHoverToDialog(personId, encounterId, type, note, divId){

		var $notesDiv = $("#notesDiv").clone(true);
		var $noteCountDiv = $("#noteCountDiv").clone(true);
		$noteCountDiv.css("padding-left", "31%");
		clearNoteHover();
		dswlWorklistChangeDialog = document.getElementById("dswlworklistModifyDialog");
		dswlWorklistChangeDialog.innerHTML = showNoteDialog();

		var hvrParent = $("#docNotePersistCheckLabel").get(0);
		var hvrChild = $("#persistHover").get(0);
		hs(hvrParent, hvrChild);

		$("#docNoteType").change(function(){
			var noteTypeObj = noteTypes[$(this).val()];
			if(noteTypeObj && noteTypeObj.onlyImportant){
				if(!$("#docNoteImportantCheck").prop("checked")){
					$("#docNoteImportantCheck").prop("checked", true);
					$("#docNoteImportantCheck").data('defaultChecked', true);
				}
				$("#docNoteImportantCheck").prop("disabled", true);
			} else {
				if($("#docNoteImportantCheck").data('defaultChecked')){
					$("#docNoteImportantCheck").prop("checked", false);
					$("#docNoteImportantCheck").data('defaultChecked', false);
				}
				$("#docNoteImportantCheck").prop("disabled", false);
			}
		});

		$("#docNoteTextArea").bind('keyup drop', function(){
			if(this.value.length > 500){
				$(this).val(this.value.substring(0, 500));
			}
		});

		$("#docNoteTextArea").bind('paste', function(){
			var newText = this.value;
			newText += window.clipboardData.getData("Text");
			newText = newText.substring(0, 500);
			$("#docNoteTextArea").val(newText);
			return false;
		});

		$("#dswlworklistModifyDialog").append("<div class='dswlWorklist-note-separator'></div>")
				.append($("<div class='dswlWorklist-note-dialog'></div>")
						.append("<div class='dswlWorklist-note-edit-clear'></div>")
						.append($notesDiv)
						.append($noteCountDiv));
		$(".dswlWorklist-note-hover-menu").css("visibility", "hidden");

		$("#noteCountDiv").hide();
		$(".dswlWorklist-note-separator").hide();
		$("#notesDiv").hide();

		var img = $(".dswlworklist-solid-line");
		$(img).addClass("dswl-note-image-edit");
		var pos = getMousePosition(img, event);
		dswlWorklistChangeDialog.style.top = pos.y + 'px';
		dswlWorklistChangeDialog.style.left = pos.x + 'px';
		dswlWorklistChangeDialog.style.display = 'block';

		$("#docNoteCancel").click(function(){
			removeDialogandLine();
		});

		if(type === "ADD"){
			$("#docNoteSave").click(function(){
				var prntEntityName;
				var prntEntityid;
				var noteTypeCode;
				var noteText;
				var notePriorityMeaning;

				$("#docNoteSave").prop("disabled", true);
				if($('#docNotePersistCheck').prop("checked")){
					prntEntityName = "PERSON";
					prntEntityid = String(personId);
				} else {
					prntEntityName = "ENCOUNTER";
					prntEntityid = String(encounterId);
				}
				noteTypeCode = $("#docNoteType").val()
				noteText = RCM_Clinical_Util.encodeString($('#docNoteTextArea').val());

				if($('#docNoteImportantCheck').prop("checked")){
					notePriorityMeaning = "HIGH";
				} else {
					notePriorityMeaning = "NORMAL";
				}

				var jsonRequest = {
					"add_note_request":{
						"parent_entity_name": prntEntityName,
						"parent_entity_id": prntEntityid,
						"note_type_cd":noteTypeCode,
						"note_text":noteText,
						"note_priority_meaning": notePriorityMeaning
					}
				};
				serviceDelegate.addCareNote(jsonRequest,function(status, recordData){
					$("#docNoteSave").prop("disabled", false);
					if (status === 'S'){
						var addedNote = {
							"ID" : recordData.NOTE_ID,
							"TYPECD" : noteTypeCode,
							"TYPEDISP" : noteTypes[noteTypeCode].display,
							"TEXT" : noteText,
							"PRIORITYMEANING" : notePriorityMeaning,
							"PARENTENTITYNAME" : prntEntityName,
							"PERSONNELNAMEFULL" : recordData.PERSONNEL_NAME,
							"UPDATEDTTM" : recordData.UPDATE_DT_TM,
							"VERSION" : 0
						};
						//personId is a number, item.patientId is a string in the standard form X.XXXXXXXE7
						$.each(worklistItems, function(i, item){
							if((prntEntityName === "PERSON" && personId == item.patientId) || (personId == item.patientId && encounterId == item.encounterId)){
								if(item.notes.length === 0){
									$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").css('visibility', 'visible');
									$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").removeClass("dswl-note-image-hidden").addClass("dswl-note-image");
									$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").attr("src", noteImage);
								}
								if(prntEntityName ==="PERSON"){
									addedNote.PARENTENTITYID = item.patientId;
								} else {
									addedNote.PARENTENTITYID = item.encounterId;
								}
								item.notes = [addedNote].concat(item.notes);

								if(prntEntityName !== "PERSON"){
									return false;
								}
							}
						});

						$("#docNotePersistCheckLabel").get(0).onmouseleave();
						removeDialogandLine();
					} else {
						alert("Error Saving Note");
					}
				},true);
			});

			$("#noteDiv" + (notesToShow - 1)).remove();
			if($("div[id^='noteDiv']").length){
				var ofIndex = $("#noteCountLabel").text().indexOf(" " + rcm_documentation_specialist_worklist_i18n.DSWL_OF);
				if(ofIndex){
					var noteCountText = $("div[id^='noteDiv']").length + $("#noteCountLabel").text().substring(ofIndex);
					$("#noteCountLabel").text(noteCountText);
				}
			}

		} else if(type === "MODIFY"){
			$("#docNoteSave").click(function(){
				var prntEntityName;
				var prntEntityid;
				var noteTypeCode;
				var noteText;
				var notePriorityMeaning;

				$("#docNoteSave").prop("disabled", true);
				if($('#docNotePersistCheck').prop("checked")){
					prntEntityName = "PERSON";
					prntEntityid = String(personId);
				} else {
					prntEntityName = "ENCOUNTER";
					prntEntityid = String(encounterId);
				}
				noteTypeCode = $("#docNoteType").val()
				noteText = RCM_Clinical_Util.encodeString($('#docNoteTextArea').val());

				if($('#docNoteImportantCheck').prop("checked")){
					notePriorityMeaning = "HIGH";
				} else {
					notePriorityMeaning = "NORMAL";
				}

				var jsonRequest = {
					"modify_note_request":{
						"note_id": note.ID,
						"parent_entity_name": prntEntityName,
						"parent_entity_id": prntEntityid,
						"note_type_cd":noteTypeCode,
						"note_text":noteText,
						"note_priority_meaning": notePriorityMeaning,
						"update_cnt": note.VERSION
					}
				};
				serviceDelegate.modifyCareNote(jsonRequest,function(status, recordData){
					$("#docNoteSave").prop("disabled", false);
					if (status === 'S'){
						var modifiedNote = {
							"ID" : note.ID,
							"TYPECD" : noteTypeCode,
							"TYPEDISP" : noteTypes[noteTypeCode].display,
							"TEXT" : noteText,
							"PRIORITYMEANING" : notePriorityMeaning,
							"PARENTENTITYNAME" : prntEntityName,
							"PERSONNELNAMEFULL" : recordData.PERSONNEL_NAME,
							"UPDATEDTTM" : recordData.UPDATE_DT_TM,
							"VERSION" : note.VERSION + 1
						};
						$.each(worklistItems, function(i, item){
							var spliceIndex = getNoteSpliceIndex(note, item.notes);
							if(spliceIndex > -1){
								item.notes.splice(spliceIndex, 1);
							}
							if((prntEntityName === "PERSON" && personId == item.patientId) || (personId == item.patientId && encounterId == item.encounterId)){
								if(spliceIndex === -1){
									$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").css('visibility', 'visible');
									$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").removeClass("dswl-note-image-hidden").addClass("dswl-note-image");
									$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").attr("src", noteImage);
								}
								if(prntEntityName ==="PERSON"){
									modifiedNote.PARENTENTITYID = item.patientId;
								} else {
									modifiedNote.PARENTENTITYID = item.encounterId;
								}
								item.notes = [modifiedNote].concat(item.notes);
							} else if(spliceIndex > -1 && item.notes.length === 0){
								$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").css('visibility', 'hidden');
								$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").removeClass("dswl-note-image").addClass("dswl-note-image-hidden");
								$("img[name='dswlWorklistNoteImg_" + item.encounterId + "']").attr("src", newNoteImage);
							}
						});

						$("#docNotePersistCheckLabel").get(0).onmouseleave();
						removeDialogandLine();

					} else {
						var exception = recordData.EXCEPTIONINFORMATION[0];
						if (exception.EXCEPTIONTYPE === "STALE_DATA"){
							openStaleDataDialog();
						}
						else{
							openSaveFailedDialog();
						}
					}
				},true);
			});

			$("#docNoteType").val(note.TYPECD);
			$('#docNoteTextArea').val(RCM_Clinical_Util.decodeString(note.TEXT));
			$('#docNoteImportantCheck').prop('checked', note.PRIORITYMEANING === "HIGH");
			$("#docNoteType").change();
			$('#docNotePersistCheck').prop('checked', note.PARENTENTITYNAME === "PERSON");

			$("#" + divId).remove();
			$(".dswlWorklist-note-odd").removeClass("dswlWorklist-note-odd");
			$(".dswlWorklist-note").filter(":odd").addClass("dswlWorklist-note-odd");

		}

		$.each($("div[id^='noteDiv']"), function(i, val){
			$("#noteCountDiv").show();
			$(".dswlWorklist-note-separator").show();
			$("#notesDiv").show();
			$(this).unbind('mouseenter mouseleave');
		});

		var formObject = {};
		RCM_Clinical_Util.addRequiredField(formObject, "docNoteType", "select", ["docNoteSave"]);
		RCM_Clinical_Util.addRequiredField(formObject, "docNoteTextArea", "textarea", ["docNoteSave"]);

	};

	function openWorklistModifyDialog(personId, encounterId, name, event){
		//Removes any open modify dialog in worklist
		if(dswlWorklistChangeDialog){
			dswlWorklistChangeDialog.innerHTML = '';
			dswlWorklistChangeDialog.style.display = 'none';
			dswlWorklistChangeDialog = null;
		}

		//Removes any open note hover
		clearNoteHover();

		//Removes the solid border and background color around any other element
		//on the worklist so that the element clicked is the only one with the solid
		//line and background color
		if($("#dswlTableDiv").find("span, div, img").hasClass("dswlworklist-solid-line") && !($(name).hasClass("dswlworklist-solid-line"))){
			$(".dswlworklist-solid-line").addClass("dswlworklist-transparent-line");
			$(".dswlworklist-solid-line").removeClass("dswlworklist-solid-line");
		}
		//Hide note icons that were previously showing due to edit mode
		$(".dswl-note-image-show").removeClass("dswl-note-image-show");
		$(".dswl-note-image-edit").removeClass("dswl-note-image-edit");

		if($(name).attr("id") === "dswlworklistDateDisplay"){
			$(name).parent().find("div.dswlworklist-next-review-date-img-container").css("visibility", "hidden");
		}

		//Removes the dashed border around the label hovered over,
		//adds a solid border and background color, creates the modify
		//dialog and opens it
		$(".dswlworklist-dashed-line").removeClass("dswlworklist-dashed-line");
		$(name).addClass("dswlworklist-solid-line");

		dswlWorklistChangeDialog = document.getElementById("dswlworklistModifyDialog");
		dswlWorklistChangeDialog.innerHTML = createModifyDialog(name, personId, encounterId);

		var pos = getMousePosition(name, event);
		dswlWorklistChangeDialog.style.top = pos.y + 'px';
		dswlWorklistChangeDialog.style.left = pos.x + 'px';

		dswlWorklistChangeDialog.style.display = 'block';

		//If dialog is for the doc review status, select the previously
		//save status in the dropdown
		if($(name).attr("id") === "dswlworklistStatusDisplay"){
			var divId = $(name).closest("div").attr("id");
			var valueCd = divId.substring(10);
			var $drModifyDropdown = $("#dswl-modify-drStatus");
			if($drModifyDropdown.length > 0){
				var $optionsDRS = $('option', $drModifyDropdown);
				$optionsDRS.each(function(){
					if($(this).val() === valueCd){
						$(this).prop('selected', true);
					}
				});
			}
		}

		if($(name).attr("id") === "dswlworklistDateDisplay"){
			var date;
			if($(name).hasClass("dswlworklist-date")){ //This class is assigned when a due date is edited
				var temp = $("div.dswlworklist-solid-line").text();
				if(temp === rcm_documentation_specialist_worklist_i18n.DSWL_NO_DATE){
					date = "";
				}
				else{
					var presetDate = temp;
				}
			}
			else{
			    //This value is never updated so it can only be used for the first edit
				date = $("#dswlworklistNextReviewDatePicker").val();
			}

			RCM_Clinical_Util.addDatePicker(component, "dswlworklistNextReviewDatePicker");
			if (isDueDateTimeEnabled) {
    			RCM_Clinical_Util.addTimePicker("dswlworklistNextReviewTimePicker");
			}

            if (presetDate) { //Value has already been changed, so can't rely on date from .val()
                if (isDueDateTimeEnabled) {
                    // presetDate is expected to already be in the form "mm/dd/yyyy HH:MM". Set in saveNewReviewDate.
                    $("#dswlworklistNextReviewDatePicker").val(new Date(presetDate).format("shortDate2")); // mm/dd/yyyy
                    $("#dswlworklistNextReviewTimePicker").val(new Date(presetDate).format("militaryTime")); //HH:MM
                } else {
                    $("#dswlworklistNextReviewDatePicker").val(presetDate);
                }
            } else {
                RCM_Clinical_Util.setDateString("dswlworklistNextReviewDatePicker", date);
                if (isDueDateTimeEnabled) {
                    RCM_Clinical_Util.setTimeString("dswlworklistNextReviewTimePicker", date);
                }
            }
		}

		if($(name).attr("id") === "dswlworklistDSRelationshipDisplay"){
			var tableDiv = document.getElementById("documentationManagersTableDiv");
			var $row = $("span.dswlworklist-solid-line").closest("tr");
			var personId = getPatientId($row);
			var encounterId = getEncounterId($row);
			tableDiv.innerHTML = populateTable(personId, encounterId);
			if(canAddRel){
				providerSearchControl = new ProviderSearchControl(document.getElementById("dswlworklistProviderSearch"));
				personnelSearchControlListener = function(){
					//Add id to documentationSpecialistsArray
					newPersonnelIdToBeAdded = String(providerSearchControl.getSelectedProviderId());
					var newPersonnelNameToBeAdded = $("#dswlworklistProviderSearch").val();
					if(newPersonnelIdToBeAdded !== "" && newPersonnelNameToBeAdded !== ""){
						var newPersonnelToBeAdded = {
							id: "",
							personnelId: newPersonnelIdToBeAdded,
							typeCd: docSpecialistRelationshipTypeCd,
							typeDisplay: docSpecialistRelationshipTypeDisplay,
							name: newPersonnelNameToBeAdded
						};
						var newArray = [];
						var isAlreadyInList = false;
						for(var i = 0; i < documentationSpecialistsArray.length; i++){
							if(Number(documentationSpecialistsArray[i].personnelId) === Number(newPersonnelToBeAdded.personnelId) && documentationSpecialistsArray[i].name === newPersonnelToBeAdded.name){
								isAlreadyInList = true;
								break;
							}
						}
						if(!isAlreadyInList){
							if(documentationSpecialistsArray && documentationSpecialistsArray.length > 0){
								newArray = documentationSpecialistsArray.reverse();
							}
							newArray.push(newPersonnelToBeAdded);
							documentationSpecialistsArray = newArray.reverse();
							//Add new personnel row to table in dialog
							var tableRowHTML = [];
							tableRowHTML.push("<tr id='",newPersonnelIdToBeAdded,"' class='dswlworklistDocumentationSpecialistRow'><td><div class='dswlworklist-float-left'><span id='dswlworklistDocumentationSpecialistsNumbering' class='dswlworklist-documentation-specialists-numbers'></span><span>",newPersonnelNameToBeAdded,"</span></div><div id='dswlworklistRemoveX' class='dswlworklist-X-float-right dswlworklist-remove-x'></div></td></tr>");
							$("#documentationSpecialistsFirstEmptyRow").after(tableRowHTML.join(""));
							//Renumber rows
							renumberDSRows();
							addEventsToNewRow(newPersonnelIdToBeAdded);
						}
						//Reset providerSearchControl
						providerSearchControl.setSelectedProvider("","");
					}
				};
				providerSearchControl.addVerifyStateChangeListener(personnelSearchControlListener);
			}
			renumberDSRows();
		}
		addEventsToEditDialog();
	};

	function createModifyDialog(name, personId, encounterId){
		var html = [];
		if($(name).attr("id") === "dswlworklistStatusDisplay"){
			html.push("<div>");
			html.push("<select id='dswl-modify-drStatus' class='dswlworklist-input-select'>");
			html.push("<option value=''></option>");
			var statusCodesArray = getPersonData(personId, encounterId).nuanceFilterEnabledInd ? nuanceStatusCodes : statusCodes;
			for(var i = 0; i < statusCodesArray.length; i++){
				html.push("<option value='", statusCodesArray[i].value, "'>", statusCodesArray[i].display, "</option>");
			}
			html.push("</select>");
			html.push("<span class='dswlworklist-modify-action-buttons'>");
			html.push("<input type='button' id='dswlworklistStatusSaveButton' value='",rcm_documentation_specialist_worklist_i18n.DSWL_SAVE,"'/>");
			html.push("<input type='button' id='dswlworklistModifyDialogCancelButton' value='",rcm_documentation_specialist_worklist_i18n.DSWL_CANCEL,"'/>");
			html.push("</span>");
			html.push("</div>");
		}
		if($(name).attr("id") === "dswlworklistDateDisplay"){
			var selectedPerson = getPersonData(personId, encounterId);
			html.push("<div>");
			html.push("<input type='text' name='dswlworklistNextReviewDatePicker' id='dswlworklistNextReviewDatePicker' value='", selectedPerson.documentReviewDueDT,"'/>");
			if(isDueDateTimeEnabled) {
                html.push("<input type='text' class='' id='dswlworklistNextReviewTimePicker' value='", selectedPerson.documentReviewDueDT,"'/>");
			}
			html.push("<span class='dswlworklist-modify-action-buttons'>");
			html.push("<input type='button' id='dswlworklistReviewDateSaveButton' value='",rcm_documentation_specialist_worklist_i18n.DSWL_SAVE,"'/>");
			html.push("<input type='button' id='dswlworklistModifyDialogCancelButton' value='",rcm_documentation_specialist_worklist_i18n.DSWL_CANCEL,"'/>");
			html.push("</span>");
			html.push("</div>");
		}
		if($(name).attr("id") === "dswlworklistDSRelationshipDisplay"){
			html.push("<div>");
			if(canAddRel === 1){
				html.push("<input type='text' class='searchText searchTextSpacing' id='dswlworklistProviderSearch' name='dswlworklistProviderSearch'/>");
				html.push("<br/>");
			}
			html.push("<div id='documentationManagersTableDiv'></div>");
			html.push("<span class='dswlworklist-modify-relationship-action-buttons'>");
			if(canAddRel===1 || canUnassignRel===1){
				html.push("<input type='button' id='dswlworklistRelationshipSaveButton' value='",rcm_documentation_specialist_worklist_i18n.DSWL_SAVE,"'/>");
			}
			html.push("<input type='button' id='dswlworklistModifyDialogCancelButton' value='",rcm_documentation_specialist_worklist_i18n.DSWL_CANCEL,"'/>");
			html.push("</span>");
			html.push("</div>");
		}
		return html.join("");
	};

	function createNoteHoverHTML(personId, encounterId){

		var notes = [];
		$.each(worklistItems, function(i, item){
			if(personId == item.patientId && encounterId == item.encounterId){
				notes = item.notes;
				return false;
			}
		});

		var html = [];
		html.push("<div class='dswlWorklist-note-dialog'>");
			html.push("<div id='addNoteDiv'>");
				html.push("<label id='addNoteLabel' class='simulate-anchor'>", rcm_documentation_specialist_worklist_i18n.DSWL_ADD_NOTE, "</label>");
			html.push("</div>");
			html.push("<div class='dswlWorklist-note-edit-clear'></div>");
			html.push("<div id='notesDiv' class='dswlWorklist-note-container'></div>");
			html.push("<div id='noteCountDiv'>");
				html.push("<label id='noteCountLabel' class='simulate-anchor'></label>");
			html.push("</div>");
		html.push("</div>");

		$("#dswlWorklistNoteHover").append(html.join(""));

		$("#addNoteLabel").click(function(){
			convertNoteHoverToDialog(personId, encounterId, "ADD");
		});

		var mode = 0;
		var app = rcm_documentation_specialist_worklist_i18n.DSWL_POWERCHART;
		$("#noteCountLabel").click(function(){
			VIEWLINK(mode, app, personId, encounterId, documentReviewDueDateLink, documentReviewDueDateViewLink, documentReviewDueDateViewpointLink);
		});

		if(notes.length > 0){
			var noteCountText = (notes.length > notesToShow ? notesToShow : notes.length) + " " + rcm_documentation_specialist_worklist_i18n.DSWL_OF + " " + notes.length;
			$("#noteCountLabel").text(noteCountText);
			$("#noteCountDiv").show();
			$.each(notes, function(i, val){
				if(i >= notesToShow){
					return false;
				}
				createNote(i, val);
			});
		} else {
			$("#notesDiv").append("<div class='dswlWorklist-no-notes'>" + rcm_documentation_specialist_worklist_i18n.DSWL_NO_NOTES + "</div>");
		}
	};

	function createNote(i, note){

		var html = [];

		html.push("<div id='noteDiv", i,"' class='dswlWorklist-note ", i % 2 === 0 ? "" : "dswlWorklist-note-odd", "'>");
			html.push("<div class='dswlWorklist-note-hover-menu'>");
				html.push("<a> <img src='", imageLocDeleteUp,"' alt='' class='dswlWorklist-note-delete-image' /></a><br/>");
				html.push("<a> <img src='", imageLocEditUp,"' alt='' class ='dswlWorklist-note-edit-image' /></a>");
			html.push("</div>");

			html.push("<img class='dswlWorklist-flag ", note.PRIORITYMEANING === "HIGH" ? "" : "dswlWorklist-FlagHidden", "' src='", imageLocFlag,"' alt = '' />");
			html.push("<div class='dswlWorklist-note-text'>");
                var noteText = RCM_Clinical_Util.decodeString(note.TEXT);
				html.push(RCM_Clinical_Util.loggingHtmlToText(noteText));
			html.push("</div>");

			html.push("<div class='dswlWorklist-note-type'>");
				html.push(noteTypes[note.TYPECD].display);
			html.push("</div>");

			html.push("<div class='dswlWorklist-note-prsnl'>");
				html.push(note.PERSONNELNAMEFULL);
			html.push("</div>");

			html.push("<div class='dswlWorklist-save-date'>");
				var dateString = getDateString(note.UPDATEDTTM);
				html.push(dateString);
			html.push("</div>");
		html.push("</div>");

		$("#notesDiv").append($(html.join("")).data('note', note));

	};

	function getDateString(date){
		var today = new Date();
		var d1 = new Date();
		d1.setISO8601(date);
		var yesterdayDate = new Date();
		var twoDaysAgo = new Date();
		var tempDate = new Date();
		var dateString;
		var hours = d1.getHours();
		var minutes = d1.getMinutes();
		if (minutes < 10){
			minutes = "0" + minutes;
		}

		today = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0,0);
		dateString = hours + ":" + minutes;

		yesterdayDate.setDate(yesterdayDate.getDate() - 1);
		yesterdayDate = new Date(yesterdayDate.getFullYear(),yesterdayDate.getMonth(),yesterdayDate.getDate(),0,0,0,0);
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
		twoDaysAgo = new Date(twoDaysAgo.getFullYear(),twoDaysAgo.getMonth(),twoDaysAgo.getDate(),0,0,0,0);
		tempDate = new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),0,0,0,0);

		if( tempDate.getTime() === today.getTime()){
			return dateString + " " + rcm_documentation_specialist_worklist_i18n.DSWL_TODAY;
		}
		if( tempDate.getTime() === yesterdayDate.getTime()){
			return dateString + " " + rcm_documentation_specialist_worklist_i18n.DSWL_YESTERDAY;
		}
		if( tempDate.getTime() === twoDaysAgo.getTime()){
			return dateString + " 2 " + rcm_documentation_specialist_worklist_i18n.DSWL_DAYS_AGO;
		}
		else{
			return d1.format('longDateTime2');
		}
	};

	function showNoteDialog(){

		var html = [];
		html.push("<div class='dswlWorklist-note-dialog'>");
			html.push("<div class='dswlWorklist-note-edit-container'>");
				html.push("<div>");
					html.push("<label for='docNoteType'>", rcm_documentation_specialist_worklist_i18n.DSWL_TYPE, "</label><br />");
					html.push("<select id='docNoteType'>");
						html.push("<option value=''></option>");
						var noteTypeCD;
						for(noteTypeCD in noteTypes){
							html.push("<option value='", noteTypeCD,"'>", noteTypes[noteTypeCD].display,"</option>");
						}
					html.push("</select>");
				html.push("</div>");

				html.push("<div>");
					html.push("<label for='docNoteTextArea'>", rcm_documentation_specialist_worklist_i18n.DSWL_NOTE, "</label><br />");
					html.push("<textarea id='docNoteTextArea' class='dswlWorklist-note-edit-textarea'></textarea>");
				html.push("</div>");

				html.push("<div class='dswlWorklist-note-edit-checkbox-container'>");
					html.push("<div class='dswlWorklist-note-edit-important-container'>");
						html.push("<input type='checkbox'  id='docNoteImportantCheck'/>");
						html.push("<label id='docNoteImportantCheckLabel' class='dswlWorklist-note-edit-checkbox-label' for='docNoteImportantCheck'>", rcm_documentation_specialist_worklist_i18n.DSWL_IMPORTANT, "</label>");
					html.push("</div>");
					html.push("<div class='dswlWorklist-note-edit-persist-container'>");
						html.push("<input type='checkbox' id='docNotePersistCheck'/>");
						html.push("<label id='docNotePersistCheckLabel' class='dswlWorklist-note-edit-checkbox-label' for='docNotePersistCheck'>", rcm_documentation_specialist_worklist_i18n.DSWL_PERSIST, "</label>");
						html.push("<div class='dswlWorklist-persist-hover hvr' id='persistHover'><dl>");
							html.push(rcm_documentation_specialist_worklist_i18n.DSWL_PERSIST_MESSAGE);
						html.push("</dl></div>");
					html.push("</div>");
				html.push("</div>");
				html.push("<div class='dswlWorklist-note-edit-clear'></div>");

				html.push("<div class='dswlWorklist-note-edit-button-container'>");
					html.push("<input type='button' class='dswlWorklist-note-edit-button' id='docNoteSave' value='", rcm_documentation_specialist_worklist_i18n.DSWL_SAVE, "'/>");
					html.push("<input type='button' class='dswlWorklist-note-edit-button' id='docNoteCancel' value='", rcm_documentation_specialist_worklist_i18n.DSWL_CANCEL, "'/>");
				html.push("</div>");
			html.push("</div>");
		html.push("</div>");

		return html.join("");
	};

	/**
	* fills table with names
	*/
	function populateTable(personId, encounterId){
		var html = [];
		documentationSpecialistsArray = [];
		var selectedPersonData = getPersonData(personId, encounterId);
		html.push("<table id='documentationSpecialistsTable' class='dswlworklist-documentation-specialists-table'>");
			html.push("<tr id='documentationSpecialistsFirstEmptyRow'><td>&nbsp;</td></tr>");
			//Add managers to list with the id equal to the managers id
			if(selectedPersonData.allDocSpecialists.length > 0){
				for(var i = 0; i < selectedPersonData.allDocSpecialists.length; i++){
					var id = selectedPersonData.allDocSpecialists[i].personnelId;
					var name = selectedPersonData.allDocSpecialists[i].name;
					html.push("<tr id='",id,"' class='dswlworklistDocumentationSpecialistRow'><td><div class='dswlworklist-float-left'><span id='dswlworklistDocumentationSpecialistsNumbering' class='dswlworklist-documentation-specialists-numbers'></span><span>",name,"</span></div><div id='dswlworklistRemoveX' class='dswlworklist-X-float-right dswlworklist-remove-x'></div></td></tr>");
					documentationSpecialistsArray.push(selectedPersonData.allDocSpecialists[i]);
				}
			}
			html.push("<tr id='documentationSpecialistsLastEmptyRow'><td>&nbsp;</td></tr>");
		html.push("</table>");
		return html.join("");
	};

	/**
	* gets current x and y position of the mouse for bottom-left corner of element
	*/
	function getMousePosition(name, e){
		var position = $(name).offset();
		var cursor = { x: 0, y: 0 };
		cursor.x = position.left;
		cursor.y = position.top + $(name).height() + 3;
		return cursor;
	};

	/**
	* gets x and y position of mouse for top-right corner of element
	*/
	function getMousePositionTopRight(name, e){
		var position = $(name).offset();
		var cursor = { x: 0, y: 0 };
		cursor.x = position.left + $(name).width() + 3;
		cursor.y = position.top;
		return cursor;
	};

	function cancelModifyDialog(){
		$("#dswlworklistModifyDialogCancelButton").prop("disabled", true);
		removeDialogandLine();
	};

	function renumberDSRows(){
		var sequence = 1;
		$(".dswlworklistDocumentationSpecialistRow").find("#dswlworklistDocumentationSpecialistsNumbering").each(function(){
			$(this).html(sequence++);
		});
	};

	/**
	* shows X hover over
	*/
	function highlightAndShowX(name){
		$(name).addClass("dswlworklist-dsNameHoverOver");
		var hoverRemoveX = $(name).find(".dswlworklist-X-float-right");
		$(hoverRemoveX).css("visibility", "visible");
	};

	/**
	* Hides x hover over
	*/
	function removeHighlightAndHideX(name){
		$(name).removeClass("dswlworklist-dsNameHoverOver");
		var hoverRemoveX = $(name).find(".dswlworklist-X-float-right");
		$(hoverRemoveX).css("visibility", "hidden");
	};

	/**
	* Switches hover over to other image
	*/
	function switchXToOtherXImage(name){
		if($(name).hasClass("dswlworklist-remove-x")){
			$(name).removeClass("dswlworklist-remove-x");
			$(name).addClass("dswlworklist-hover-over-remove-x");
		}
		else{
			$(name).removeClass("dswlworklist-hover-over-remove-x");
			$(name).addClass("dswlworklist-remove-x");
		}
	};


	function removeRowFromDocumentationSpecialistTable(name){
		if(canUnassignRel===1){
			var personIdToRemove = $(name).closest("tr").attr("id");
			for(var i = 0; i < documentationSpecialistsArray.length; i++){
				if(Number(documentationSpecialistsArray[i].personnelId) === Number(personIdToRemove)){
					documentationSpecialistsArray.splice(i, 1);
				}
			}
			$(name).closest("tr").remove();

			if(documentationSpecialistsArray.length > 0){
				renumberDSRows();
			}
		}
	};

	function removeFromRowAndListById(personnelId){
		var $docSpecialistModifyTable = $("#documentationSpecialistsTable");
		if($docSpecialistModifyTable.length > 0){
			var $rows = $('tr', $docSpecialistModifyTable);
			$rows.each(function(){
				var rowIdNum = Number($(this).attr("id"));
				if(rowIdNum === Number(personnelId)){
					removeRowFromDocumentationSpecialistTable(this);
				}
			});
		}
	};

	function removeDialogandLine(){
		$(".dswlworklist-solid-line").addClass("dswlworklist-transparent-line");
		$(".dswlworklist-solid-line").removeClass("dswlworklist-solid-line");
		$(".dswl-note-image-show").removeClass("dswl-note-image-show");
		$(".dswl-note-image-edit").removeClass("dswl-note-image-edit");
		if(dswlWorklistChangeDialog){
			dswlWorklistChangeDialog.innerHTML = '';
			dswlWorklistChangeDialog.style.display = 'none';
			dswlWorklistChangeDialog = null;
		}
		$(window).resize();
	};

	function clearNoteHover(){
		if(dswlWorklistNoteHover){
			dswlWorklistNoteHover.innerHTML = '';
			dswlWorklistNoteHover.style.display = 'none';
			dswlWorklistNoteHover = null;
		}
		if(dswlWorklistNoteExtra){
			dswlWorklistNoteExtra.innerHTML = '';
			dswlWorklistNoteExtra.style.display = 'none';
			dswlWorklistNoteExtra = null;
		}
	};

	/**
	* gets person information for worklist
	*/
	function getPersonData(personId, encounterId){
		for(var i = 0; i < worklistItems.length; i++){
			var record = worklistItems[i];
			//Ensure that both numbers being compared are in the same format
			//to get rid of the possibility that one number may be a whole number
			//and the other may be a whole number shown as a decimal
			//e.g. 100234 and 1.00234E5
			var selectedPersonId = Number(personId);
			var modifiedPersonId = Number(record.patientId);
			var selectedEncounter = Number(encounterId);
			var modifiedEncounterId = Number(record.encounterId);
			if(selectedPersonId === modifiedPersonId && selectedEncounter === modifiedEncounterId){
				return record;
			}
		}
	};

	function addEventsToEditDialog(){
		$("#dswlworklistModifyDialogCancelButton").click(function(){
			cancelModifyDialog();
		});

		if(canUnassignRel){
			var listOfCurrentDS = $(".dswlworklistDocumentationSpecialistRow");
			listOfCurrentDS.each(function(){
				$(this).mouseover(function(){
					highlightAndShowX(this);
				});

				$(this).mouseout(function(){
					removeHighlightAndHideX(this);
				});
			});

			var removeButtons = $(".dswlworklist-X-float-right");
			removeButtons.each(function(){
				$(this).mouseover(function(){
					switchXToOtherXImage(this);
				});

				$(this).mouseout(function(){
					switchXToOtherXImage(this);
				});

				$(this).click(function(){
					removeRowFromDocumentationSpecialistTable(this);
				});
			});
		}

		$("#dswlworklistStatusSaveButton").click(function(){
			$("#dswlworklistModifyDialogCancelButton").prop("disabled", true)
			$("#dswlworklistStatusSaveButton").prop("disabled", true);
			saveNewStatus();
		});

		$("#dswlworklistReviewDateSaveButton").click(function(){
			$("#dswlworklistModifyDialogCancelButton").prop("disabled", true)
			$("#dswlworklistReviewDateSaveButton").prop("disabled", true);
			saveNewReviewDate();
		});

		$("#dswlworklistRelationshipSaveButton").click(function(){
			$("#dswlworklistModifyDialogCancelButton").prop("disabled", true)
			$("#dswlworklistRelationshipSaveButton").prop("disabled", true);
			saveDeleteNewRelationships();
		});
	};

	function addEventsToNewRow(rowId){
		var rowIdString = "#" + rowId;

		if(canUnassignRel){
			$(rowIdString).mouseover(function(){
				highlightAndShowX(rowIdString);
			});

			$(rowIdString).mouseout(function(){
				removeHighlightAndHideX(rowIdString);
			});

			var removeButton = $(rowIdString).find(".dswlworklist-X-float-right");
			$(removeButton).mouseover(function(){
				switchXToOtherXImage(removeButton);
			});

			$(removeButton).mouseout(function(){
				switchXToOtherXImage(removeButton);
			});

			$(removeButton).click(function(){
				removeRowFromDocumentationSpecialistTable(removeButton);
			});
		}

	};

	function getAddListItems(personId, encounterId){
		var personData = getPersonData(personId, encounterId);

		var differenceArray = [];
		for(var i = 0; i < documentationSpecialistsArray.length; i++){
			differenceArray.push(documentationSpecialistsArray[i]);
		}
		for(var i = 0; i < personData.allDocSpecialists.length; i++){
			for(var j = differenceArray.length - 1; j >=0; j--){
				if(Number(personData.allDocSpecialists[i].personnelId) === Number(differenceArray[j].personnelId)){
					differenceArray.splice(j, 1);
				}
			}
		}
		return differenceArray;
	};

	function getRemoveListItems(personId, encounterId){
		var personData = getPersonData(personId, encounterId);

		var differenceArray = [];
		for(var i = 0; i < personData.allDocSpecialists.length; i++){
			differenceArray.push(personData.allDocSpecialists[i]);
		}
		for(var i = 0; i < documentationSpecialistsArray.length; i++){
			for(var j = differenceArray.length - 1; j >= 0; j--){
				if(Number(documentationSpecialistsArray[i].personnelId) === Number(differenceArray[j].personnelId)){
					differenceArray.splice(j, 1);
				}
			}
		}
		return differenceArray;
	};

	/**
	* Gets HTML for okay dialog
	*/
	function getOkDialogHTML() {
		var boxDiv = document.createElement("div");
            boxDiv.id = "dswlWorklistOkDialog";
            boxDiv.className = "dswlworklist-dialog";
		var html = [];
			html.push("<div class='dswlworklist-dialog-title-bar'>");
				html.push("<label id='dswlWorklistOkDialogTitle'></label>");
			html.push("</div>");
			html.push("<div class='dswlworklist-dialog-message-area'>");
				html.push("<label id='dswlWorklistOkDialogMessage'></label>");
			html.push("</div>");
			html.push("<div class='dswlworklist-dialog-buttons'>");
				html.push("<input id='dswlWorklistBtnOk' type='button' value='",rcm_documentation_specialist_worklist_i18n.DSWL_OK,"'/>");
			html.push("</div>");
		 boxDiv.innerHTML = html.join("");
		 document.body.appendChild(boxDiv);
	};

	/**
	* Opens relationship error dialog
	*/
	function openRelationshipErrorDialog(personnelName, relationship){
		$("#dswlWorklistOkDialogTitle").html(rcm_documentation_specialist_worklist_i18n.DSWL_RELATIONSHIP_ERROR_TITLE);
		var htmlString = personnelName + rcm_documentation_specialist_worklist_i18n.DSWL_RELATIONSHIP_ERROR_MESSAGE_PART_ONE + relationship + rcm_documentation_specialist_worklist_i18n.DSWL_RELATIONSHIP_ERROR_MESSAGE_PART_TWO;
		$("#dswlWorklistOkDialogMessage").html(htmlString);
		getFloatingHeaderRowPosition();
		$("#dswlWorklistOkDialog").show();
		RCM_Clinical_Util.setFocus("dswlWorklistOkDialog");
	};

	/**
	*Opens stale data dialog
	*/
	function openStaleDataDialog(){
		$("#dswlWorklistOkDialogTitle").html(rcm_documentation_specialist_worklist_i18n.DSWL_STALE_DATA_TITLE);
		$("#dswlWorklistOkDialogMessage").html(rcm_documentation_specialist_worklist_i18n.DSWL_STALE_DATA_MESSAGE);
		getFloatingHeaderRowPosition();
		$("#dswlWorklistOkDialog").show();
		$("#listBlockingDiv").show();
		RCM_Clinical_Util.setFocus("dswlWorklistOkDialog");
	};

	/**
	*Opens save failed dialog
	*/
	function openSaveFailedDialog(){
		$("#dswlWorklistOkDialogTitle").html(rcm_documentation_specialist_worklist_i18n.DSWL_SAVE_FAILED);
		$("#dswlWorklistOkDialogMessage").html(rcm_documentation_specialist_worklist_i18n.DSWL_SAVE_FAILED_MESSAGE);
		getFloatingHeaderRowPosition();
		$("#dswlWorklistOkDialog").show();
		$("#listBlockingDiv").show();
		RCM_Clinical_Util.setFocus("dswlWorklistOkDialog");
	};

	function getFloatingHeaderRowPosition(){
		var position = $("#floatingTableHeader").offset();
		$("#dswlWorklistOkDialog").css("top", position.top + 250);
	};

	function saveNewStatus(){
			var $row = $("span.dswlworklist-solid-line").closest("tr");
			var currentVersion = getVersionNum($row);
			var encounterId = getEncounterId($row);
			var patientId = getPatientId($row);
			var newStatus = $("#dswl-modify-drStatus").val();
			var jsonRequest = {
				"UM_REQUEST" : {
					"ENCOUNTERID" : String(encounterId),
					"VERSION" : currentVersion,
					"PATIENTID" : String(patientId),
					"_CLINICALREVIEWDUEDATETIME" : 0,
					"CLINICALREVIEWDUEDATETIME" : "",
					"_UTILIZATIONMGMTSTATUSCD" : 0,
					"UTILIZATIONMGMTSTATUSCD" : "",
					"_DISCHARGEPLANSTATUSCD" : 0,
					"DISCHARGEPLANSTATUSCD" : "",
					"_DISCHARGEPLANDUEDATETIME" : 0,
					"DISCHARGEPLANDUEDATETIME" : "",
					"DIAGNOSISRELATEDGROUP" : [],
					"_DOCUMENTREVIEWSTATUSCD" : 1,
					"DOCUMENTREVIEWSTATUSCD" : newStatus,
					"_DOCUMENTREVIEWDUEDATETIME" : 0,
					"DOCUMENTREVIEWDUEDATETIME" : "",
					"PERSONNELRELATIONSHIPS" : {
						"SOURCETYPE" : "DOCUMENT_REVIEW_WL",
						"ADDPERSONNELRELATIONSHIPS" : [],
						"REMOVEPERSONNELRELATIONSHIPS" : []
					}
				}
			};
			var modifyReply = serviceDelegate.modifyEncounterInformation(jsonRequest);
			if(modifyReply.status === 0){
				//Update version number
				var newVersion = currentVersion + 1;
				setVersionNum($row, newVersion);
				var newDisplay = $("#dswl-modify-drStatus :selected").text();
				var statusIdString = "dswlStatus" + newStatus;
				$("span.dswlworklist-solid-line").closest("div").attr("id", statusIdString);
				if(newDisplay){
					$("span.dswlworklist-solid-line").text(newDisplay);
				}
				else{
					$("span.dswlworklist-solid-line").text(rcm_documentation_specialist_worklist_i18n.DSWL_NOT_AVAILABLE);
				}
				if($("span.dswlworklist-solid-line").hasClass("dswlworklist-plain-bold-font")){
					$("span.dswlworklist-solid-line").removeClass("dswlworklist-plain-bold-font");
				}
				if(!($("span.dswlworklist-solid-line").hasClass("dswlworklist-plain-font"))){
					$("span.dswlworklist-solid-line").addClass("dswlworklist-plain-font");
				}
				removeDialogandLine();
			}

			if(modifyReply.status === 2){
				openStaleDataDialog();
				removeDialogandLine();
			}
			if(modifyReply.status === -1){
				openSaveFailedDialog();
				removeDialogandLine();
			}
		};

		function saveNewReviewDate(){
			var $row = $("div.dswlworklist-solid-line").closest("tr");
			var currentVersion = getVersionNum($row);
			var encounterId = getEncounterId($row);
			var patientId = getPatientId($row);
			var newDate, newTime;
			if($("#dswlworklistNextReviewDatePicker").val() === ""){
				newDate = "";
			} else {
				newDate = RCM_Clinical_Util.getDate("dswlworklistNextReviewDatePicker");
				if(isDueDateTimeEnabled) {
				    newTime = RCM_Clinical_Util.getTime("dswlworklistNextReviewTimePicker");
                    if (newTime) {
                        newDate.setHours(newTime.getHours());
                        newDate.setMinutes(newTime.getMinutes());
                    }
				}
				newDate = newDate.format("isoUtcDateTime");
			}
			var jsonRequest = {
				"UM_REQUEST" : {
					"ENCOUNTERID" : String(encounterId),
					"VERSION" : currentVersion,
					"PATIENTID" : String(patientId),
					"_CLINICALREVIEWDUEDATETIME" : 0,
					"CLINICALREVIEWDUEDATETIME" : "",
					"_UTILIZATIONMGMTSTATUSCD" : 0,
					"UTILIZATIONMGMTSTATUSCD" : "",
					"_DISCHARGEPLANSTATUSCD" : 0,
					"DISCHARGEPLANSTATUSCD" : "",
					"_DISCHARGEPLANDUEDATETIME" : 0,
					"DISCHARGEPLANDUEDATETIME" : "",
					"DIAGNOSISRELATEDGROUP" : [],
					"_DOCUMENTREVIEWSTATUSCD" : 0,
					"DOCUMENTREVIEWSTATUSCD" : "",
					"_DOCUMENTREVIEWDUEDATETIME" : 1,
					"DOCUMENTREVIEWDUEDATETIME" : RCM_Clinical_Util.formatDateAndTimeStringForSave(newDate),
					"PERSONNELRELATIONSHIPS" : {
						"SOURCETYPE" : "DOCUMENT_REVIEW_WL",
						"ADDPERSONNELRELATIONSHIPS" : [],
						"REMOVEPERSONNELRELATIONSHIPS" : []
					}
				}
			};
			var modifyReply = serviceDelegate.modifyEncounterInformation(jsonRequest);
			if(modifyReply.status === 0){
				//Update version number
				var newVersion = currentVersion + 1;
				setVersionNum($row, newVersion);
                if (newDate) {
                    var newDateDisplay = isDueDateTimeEnabled ? RCM_Clinical_Util.formatJsonDateAndTimeString(newDate, "longDateTime3")
                        : RCM_Clinical_Util.formatJsonDateString(newDate);
                    $("div.dswlworklist-solid-line").text(newDateDisplay);
                } else {
                    $("div.dswlworklist-solid-line").text(rcm_documentation_specialist_worklist_i18n.DSWL_NO_DATE);
                }
				$("div.dswlworklist-solid-line").addClass("dswlworklist-date");
				if($("div.dswlworklist-solid-line").hasClass("dswlworklist-alert-font")){
					$("div.dswlworklist-solid-line").removeClass("dswlworklist-alert-font");
				}
				if($("div.dswlworklist-solid-line").hasClass("dswlworklist-plain-bold-font")){
					$("div.dswlworklist-solid-line").removeClass("dswlworklist-plain-bold-font");
				}
				if(!($("div.dswlworklist-solid-line").hasClass("dswlworklist-plain-font"))){
					$("div.dswlworklist-solid-line").addClass("dswlworklist-plain-font");
				}
				removeDialogandLine();
			}
			if(modifyReply.status === 2){
				openStaleDataDialog();
				removeDialogandLine();
			}

			if(modifyReply.status === -1){
				openSaveFailedDialog();
				removeDialogandLine();
			}
		};

		function saveDeleteNewRelationships(){
			var $row = $("span.dswlworklist-solid-line").closest("tr");
			var currentVersion = getVersionNum($row);
			var encounterId = getEncounterId($row);
			var patientId = getPatientId($row);

			var personnelToAdd = getAddListItems(patientId, encounterId);
			var addArray = [];
			for(var i = 0; i < personnelToAdd.length; i++){
				addArray.push({
					"PRSNLID" : String(personnelToAdd[i].personnelId),
					"TYPECD" : docSpecialistRelationshipTypeCd
				});
			}
			var personnelToRemove = getRemoveListItems(patientId, encounterId);
			var removeArray = [];
			for(var i = 0; i < personnelToRemove.length; i++){
				removeArray.push({
					"ID" : String(personnelToRemove[i].id)
				});
			}
			var jsonRequest = {
				"UM_REQUEST" : {
					"ENCOUNTERID" : String(encounterId),
					"VERSION" : currentVersion,
					"PATIENTID" : String(patientId),
					"_CLINICALREVIEWDUEDATETIME" : 0,
					"CLINICALREVIEWDUEDATETIME" : "",
					"_UTILIZATIONMGMTSTATUSCD" : 0,
					"UTILIZATIONMGMTSTATUSCD" : "",
					"_DISCHARGEPLANSTATUSCD" : 0,
					"DISCHARGEPLANSTATUSCD" : "",
					"_DISCHARGEPLANDUEDATETIME" : 0,
					"DISCHARGEPLANDUEDATETIME" : "",
					"DIAGNOSISRELATEDGROUP" : [],
					"_DOCUMENTREVIEWSTATUSCD" : 0,
					"DOCUMENTREVIEWSTATUSCD" : "",
					"_DOCUMENTREVIEWDUEDATETIME" : 0,
					"DOCUMENTREVIEWDUEDATETIME" : "",
					"PERSONNELRELATIONSHIPS" : {
						"SOURCETYPE" : "DOCUMENT_REVIEW_WL",
						"ADDPERSONNELRELATIONSHIPS" : addArray,
						"REMOVEPERSONNELRELATIONSHIPS" : removeArray
					}
				}
			};
			var modifyReply = serviceDelegate.modifyEncounterInformation(jsonRequest);
			if(modifyReply.status === 0){
				var newVersion = currentVersion + 1;
				setVersionNum($row, newVersion);
				var newIdArray = modifyReply.newPersonnelIds;
				for(var i = 0; i < documentationSpecialistsArray.length; i++){
					for(var j = 0; j < newIdArray.length; j++){
						if(Number(documentationSpecialistsArray[i].personnelId) === Number(newIdArray[j].personnelId)){
							documentationSpecialistsArray[i].id = newIdArray[j].id;
						}
					}
				}
				var personRecord = getPersonData(patientId, encounterId);
				personRecord.allDocSpecialists = documentationSpecialistsArray;
				if(documentationSpecialistsArray.length > 0){
					$("span.dswlworklist-solid-line").text(documentationSpecialistsArray[0].name);
				}
				else{
					$("span.dswlworklist-solid-line").text(rcm_documentation_specialist_worklist_i18n.DSWL_UNASSIGNED);
				}
				documentationSpecialistsArray = [];
				removeDialogandLine();
			}

			if(modifyReply.status === 1){
				openRelationshipErrorDialog(modifyReply.entityName, docSpecialistRelationshipTypeDisplay);
				removeFromRowAndListById(modifyReply.entityId);
				$("#dswlworklistModifyDialogCancelButton").prop("disabled", false)
				$("#dswlworklistRelationshipSaveButton").prop("disabled", false);
			}
			else if(modifyReply.status === 2){
				openStaleDataDialog();
				removeDialogandLine();
			}
			if(modifyReply.status === -1){
				openSaveFailedDialog();
				removeDialogandLine();
			}
		};

        this.loadAuthRibbons = function(){
            if(worklistItems && ribbonSettings.isEddOn){
				var getEdds = serviceDelegate.getEddsByEncounterIds;
				var findEdd = this.findEddByEncounter;
				var personInfo = worklistItems;
				var lastBatch = false;
				var nextStart = 0;
				var endPlace;
				if(personInfo.length <= nextStart + 20){
					lastBatch = true;
					endPlace = personInfo.length;
				}
				else{
					endPlace = nextStart + 20;
				}
				var personBatch = personInfo.slice(0, endPlace);

				var handler = function(status, eddList){
					var callSuccess = status === "S";
					for(var i=0; i < personBatch.length; i++){
						var person = personBatch[i];
						var encounterId = Math.abs(person.encounterId);
						var authHours = person.authorizationHours;
						var eddInfo = callSuccess ? findEdd(encounterId, eddList) : null;
						var pddHours = eddInfo ? eddInfo.pddHours : 0;
						var displayDRG = getDRGToDisplay(person.drgs, 0);
						var losHours = person.lengthOfStayHours;
						var elosHours = 0;
						if(displayDRG) {
							elosHours = displayDRG.elosHours;
						}
                        if (pddHours && losHours > pddHours) {
                            var $imageParent = $("#dswlImageParent" + encounterId);
                            if ($imageParent.length !== 0) {
                                $imageParent.prepend("<img class='dswlworklist-alert-image' src='" + loc + "\\images\\6047.ico" + "'>");
                                var imageChild = $imageParent.children(".dswlworklist-Hover");
                                hs($imageParent.get(0), imageChild.get(0));
                            } else {
                                $("#dswlAlertHover" + encounterId).append("<br />");
                            }
                            $("#dswlAlertHover" + encounterId).append(rcm_documentation_specialist_worklist_i18n.DSWL_ALERT_PDD);
                        }
						var personRibbonInfo = {
							ENCOUNTER_ID: encounterId,
							AUTHORIZATION_DT_TM: person.authorizationDate,
							HEALTH_PLAN_AUTHORIZATIONS: person.healthPlanAuthorizations,
							EDD_DATE: callSuccess ? eddInfo.pddDisplay : "",
							EDD_TIME_INTERVAL: callSuccess ? eddInfo.pddTimeSlot : "",
							ELOS_DATE: RcmAuthRibbonHelper.calculateDateFromAdmit(person.admitDate, elosHours)
						};

						var authRibbon = new RcmAuthRibbon(losHours, elosHours, pddHours, authHours, personRibbonInfo, ribbonSettings, loc);
						$("#losRibbon" + encounterId).html(authRibbon.getAllRibbonHtml());
					}

					if(!lastBatch){
						nextStart += 20;
						lastBatch = personInfo.length <= nextStart + 20;
						endPlace = lastBatch ? personInfo.length : nextStart + 20;
						personBatch = personInfo.slice(nextStart, endPlace);
						getEdds(personBatch, handler);
					}
				};
				getEdds(personBatch, handler);
            }
        };

        this.findEddByEncounter= function(encounterId, eddList){
            for(var i=0; i < eddList.length; i++){
                if(eddList[i].encounterId === encounterId){
                    return eddList[i];
                }
            }
            return 0;
        };
};
