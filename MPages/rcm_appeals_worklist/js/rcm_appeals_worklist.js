function RCMAppealsWorklist(criterion){
        var loc = criterion.static_content;
		var serviceDelegate = new AppealsWorklistDelegate();
		var worklistItemCount = 0;

		/**
		 * Function to initialize the worklist
		 */
        this.initialize = function(criterion, defaultsObj){
			this.criterion = criterion;
			var worklistItems = serviceDelegate.getWorklistItems(makeWorklistCallObj(defaultsObj));
            var worklistHTMLArray = [];
			worklistHTMLArray.push(renderRCMTable(worklistItems));

			return worklistHTMLArray.join("");
        };

		/**
		* Creates hovers for the worklist
		*/
		this.setUpHovers = function(){
			var hoverParentElements = $(".awlworklist-hoverParent");
			hoverParentElements.each(function(){
				var hoverParent = $(this).get(0);
				var hoverChild = $(this).children(".awlworklist-hoverData").get(0);
				hs(hoverParent, hoverChild);
			});

			var alertHoverParents = $(".awlworklist-alertHoverParent");
			alertHoverParents.each(function(){
				var alertParent = $(this).get(0);
				var alertChild = $(this).children(".awlworklist-alertHoverData").get(0);
				hs(alertParent, alertChild);
			});

			var canceledHoverParents = $(".awlworklist-canceledHoverParent");
			canceledHoverParents.each(function(){
				var alertParent = $(this).get(0);
				var alertChild = $(this).children(".awlworklist-canceledHoverData").get(0);
				hs(alertParent, alertChild);
			});
		};

		this.getWorklistItemCount = function(){
			return worklistItemCount;
		};

		this.callDelegateReloadTable = function(defaultsObj){
			var worklistCallObj = makeWorklistCallObj(defaultsObj);
			loadTable(serviceDelegate.getWorklistItems(worklistCallObj));
		};

		function makeWorklistCallObj(defaultsObj){
			var worklistCallObj = {
                	primarySortColumn : defaultsObj.defaultPrimarySortColumn,
                	primarySortDir : defaultsObj.defaultPrimarySortDir,
                	secondarySortColumn : defaultsObj.defaultSecondarySortColumn,
               		secondarySortDir : defaultsObj. defaultSecondarySortDir,
					name : "PRSNL",
					value : defaultsObj.defaultAssignedTo
			   };
			   return worklistCallObj;
		};

		/**
		* Renders table for worklist
		*/
        function renderRCMTable(worklistItems){
            var worklistHTML = [];
            var tableString = loadTable(worklistItems);

            worklistHTML.push("<div id='tableDiv'>");
            if (tableString) {
                //first time around, this div isn't created due to it only
                //being in the array. Second time, it will exist and can be populated on the fly.
                worklistHTML.push(tableString);
            }
            worklistHTML.push("</div>");
            return worklistHTML.join("");
        };

		/**
		 * Creates the html for the worklist table
		 */
        function loadTable(worklistItems){
            zebraStriping = "";
            var html = [];
            html.push("<table id='appealsListTable'>");
            html.push("<tr id='floatingTableHeader'>");
            html.push("<th class='awlworklist-th' scope='col'>", rcm_awl_worklist_i18n.FACILITY, "</th>");
            html.push("<th class='awlworklist-th' scope='col'><span class='awlworklist-th-patient'>", rcm_awl_worklist_i18n.PATIENT_NAME, "</span></th>");
            html.push("<th class='awlworklist-th' scope='col'>", rcm_awl_worklist_i18n.EXPECTED_RESPONSE, "</th>");
            html.push("<th class='awlworklist-th' scope='col'>", rcm_awl_worklist_i18n.SENT, "<br />(", rcm_awl_worklist_i18n.APPEALS_MANAGER, ")</th>");
            html.push("<th class='awlworklist-th' scope='col'><center>", rcm_awl_worklist_i18n.LEVEL, "</center></th>");
            html.push("<th class='awlworklist-th' scope='col'>", rcm_awl_worklist_i18n.STATUS, "</th>");
            html.push("<th class='awlworklist-th' scope='col'>", rcm_awl_worklist_i18n.PAYER, "<br />(", rcm_awl_worklist_i18n.CLASS, ")</th>");
            html.push("</tr>");
            if (worklistItems === undefined) {
                html.push("<tr><td colspan='7'><b><center>", rcm_awl_worklist_i18n.ERROR_MESSAGE, "</center><b></td></tr>");
            }
            else
                if (worklistItems.length === 0) {
                    html.push("<tr><td colspan='7'><b><center>", rcm_awl_worklist_i18n.NO_RESULTS_FOUND, "</center><b></td></tr>");
                }

            else {
                //Fill table component with data
                for (var j = 0, x = worklistItems.length; j < x; j++) {
                    var person = worklistItems[j];
					if (j % 2 === 0) {
                        zebraStriping = "awlworklist-zebra-striping-white";
                    }
                    else {
                        zebraStriping = "awlworklist-zebra-striping-blue";
					}
                    var personId = person.patient_id;
                    html.push("<tr class='", zebraStriping, "'>");

                    //Facility
                    if (person.facility_org_name === undefined) {
                        html.push("<td class='awl-worklist-td-border'>", rcm_awl_worklist_i18n.ERROR_MESSAGE, "</td>");
                    }
                    else {
                        html.push("<td class='awl-worklist-td-border'>", person.facility_org_name, "</td>");
                    }

                    //Patient
                    html.push("<td  class='awlworklist-patientInfo'>");

					if(person.ext_appeal_agency_display !== null && person.ext_appeal_agency_display !== ""){
						html.push("<div class='awlworklist-alertHoverParent'>");
						html.push("<div class='awlDivSideBySide'>");
						var externalBusinessIcon = loc + "\\images\\3867_16.ico";
                        html.push("<img src='", externalBusinessIcon, "' alt=''/>");
						html.push("</div>");
						html.push("<div class='awlworklist-alertHoverData'>");
						html.push("<span>", rcm_awl_worklist_i18n.ALERT_MESSAGE, "</span>");
					html.push("</div>");
					html.push("</div>");

					}

					if(person.canceledDeniedDaysInd === 1){
						var canceledImage = loc + "\\images\\6047.ico";
						html.push("<div class='awlworklist-canceledHoverParent'>");
							html.push("<img class='awlworklist-canceled-image ' src='", canceledImage,"' title=''>");
							html.push("<div class='awlworklist-canceledHoverData'>");
								html.push("<span>", rcm_awl_worklist_i18n.CANCELED_MESSAGE, "</span>");
							html.push("</div>");
						html.push("</div>");
					}
					html.push("<div class='awlworklist-hoverParent'>");
					if((person.ext_appeal_agency_display === "" || person.ext_appeal_agency_display === null) && person.canceledDeniedDaysInd === 0){
						html.push("<span class='awlDivIndent'>");
					}
					else{
						html.push("<span class='awlDivSideBySide'>");
					}
					html.push("<div style='display:inline;'>");
					if (person.denied_days_link === null || person.denied_days_link === "") {
						html.push("<span class='awl-worklist-patientName'>", person.person_name, "</span><br/>");
					}
					else{
                		var appName = rcm_awl_worklist_i18n.POWERCHART;
						html.push("<a class='awl-worklist-patientName' style='text-decoration:none; border:none; color:#2400A5;' " +
                    	                "href='javascript:VIEWLINK(0, \"" + appName + "\", \"" + person.person_id + "\", \"" + person.encntr_id + "\", \"" + person.denied_days_link + "\", \"" + person.denied_days_view_link + "\", \"" + person.denied_days_viewpoint_link + "\");'>",
                    	                person.person_name, "</a>");
					}
					html.push("<div class='awlDivIndent'>");
                    if (person.age === undefined) {
                        html.push("<p class='awlworklist-indention'><span class='secondary-basic'>", rcm_awl_worklist_i18n.ERROR_MESSAGE, "</span>&nbsp;&nbsp;&nbsp;");
                    }
                    else {
                        html.push("<p class='awlworklist-indention'><span class='secondary-basic'>", person.age, "</span>&nbsp;&nbsp;&nbsp;");
                    }
                    if (person.gender_display === undefined) {
                        html.push("<span class='awlworklist-basicFont'>", rcm_awl_worklist_i18n.ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        html.push("<span class='awlworklist-basicFont'>", person.gender_display, "</span></p>");
                    }
                    html.push("<p class='awlworklist-indention'><span class='label-text'>", rcm_awl_worklist_i18n.FIN, "</span>&nbsp;<span class='header-basic'>");
                    if (person.finNumberAlias === undefined) {
                        html.push(rcm_awl_worklist_i18n.ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        html.push(person.finNumberAlias, "</span></p>");
                    }
					html.push("</div>");
					html.push("</div>");
					html.push("</span>");


            		html.push("<div class='awlworklist-hoverData'>");
            		html.push("<div>");
					html.push("<span class='awlworklist-hvr-info-lbl'>", rcm_awl_worklist_i18n.DIAGNOSIS,"</span>");
						if (((person.final_diagnosis !== null) && (person.final_diagnosis !== "")) || ((person.final_diagnosis_desc !== null) && (person.final_diagnosis_desc !== ""))) {
							html.push("<span class='awlworklist-hvr-info-val'>", person.final_diagnosis_desc);
							if((person.final_diagnosis !== null) && (person.final_diagnosis !== "")){
								html.push("&nbsp;(", person.final_diagnosis, ")<p class='awlworklist-hvr-info-val3'>", rcm_awl_worklist_i18n.FINAL,"</p></span>");
							}
							else{
								if (person.final_diagnosis_desc !== "" || person.final_diagnosis !== "") {
									html.push("<p class='awlworklist-hvr-info-val3'>", rcm_awl_worklist_i18n.FINAL, "</p></span>");
								}
							}
						}
            			else{
							html.push("<span class='awlworklist-hvr-info-val'>", person.working_diagnosis_desc);
							if((person.working_diagnosis !== null) && (person.working_diagnosis !== "")){
								html.push("&nbsp;(", person.working_diagnosis, ")<p class='awlworklist-hvr-info-val3'>", rcm_awl_worklist_i18n.WORKING,"</p></span>");
							}
							else{
								if (person.working_diagnosis_desc !== "" || person.working_diagnosis !== "") {
									html.push("<p class='awlworklist-hvr-info-val3'>", rcm_awl_worklist_i18n.WORKING, "</p></span>");
								}
							}
						}
						html.push("</div>");
						sortDRGs(person.drgs);
						html.push("<div>");
							html.push("<span class='awlworklist-hvr-info-lbl'>", rcm_awl_worklist_i18n.DRG, "</span>");
							for(var k = 0; k < person.drgs.length; k++) {
								var drg = person.drgs[k];
								html.push("<span class='", k > 0 ? "awlworklist-hvr-info-val2" : "awlworklist-hvr-info-val","'>");
									if(drg.isTransferRuleDRG){
										html.push("<img src='", loc, "\\images\\6405_16.png' alt=''/>&nbsp;");
									}
									html.push(drg.description, "&nbsp;(", drg.sourceIdentifier, ")");
									if(drg.severityOfIllnessDisplay || drg.riskOfMortalityDisplay || drg.drgWeight){
										html.push("<p class='awlworklist-hvr-info-val4 awlworklist-small-text'>");
											html.push(rcm_awl_worklist_i18n.SEVERITY_OF_ILLNESS, "&nbsp;", drg.severityOfIllnessDisplay, "&nbsp;&nbsp;&nbsp;");
											html.push(rcm_awl_worklist_i18n.RISK_OF_MORTALITY, "&nbsp;", drg.riskOfMortalityDisplay, "&nbsp;&nbsp;&nbsp;");
											html.push(rcm_awl_worklist_i18n.DRG_WEIGHT, "&nbsp;", drg.drgWeight);
										html.push("</p>");
									}
									html.push("<p class='awlworklist-hvr-info-val4'><span class='awlworklist-small-text'>", drg.isFinal ? rcm_awl_worklist_i18n.FINAL : rcm_awl_worklist_i18n.WORKING, "&nbsp;(", drg.contributorSystemName ,")</span></p>");
								html.push("</span>");
							}
						html.push("</div>");
						html.push("<div>");
						if(person.careManagers && person.careManagers.length > 0){
							for(var i = 0; i < person.careManagers.length; i++){
								var careManager = person.careManagers[i];
								html.push("<p><span class='awlworklist-hvr-info-lbl'>", careManager.display,":</span>");
								if((careManager.name !== null) && (careManager.name !== "")){
									html.push("<span class='awlworklist-hvr-info-val'>", careManager.name,"</span></p>");
								}
							}
						}
						html.push("</div>");
            		html.push("</div>");

                    html.push("</div></td>");

                    //Expected Response
                    html.push("<td class='awl-worklist-td-border'><div><p>");

                    if (person.appeal_expect_resp_dt_tm === undefined) {
                        html.push(rcm_awl_worklist_i18n.ERROR_MESSAGE);
                    }
                    else {
                        var recordDate = getComparisonDate(person.appeal_expect_resp_dt_tm);
                        if (recordDate === "") {
                            html.push("<span class='awlworklist-firstColumnItemFont'>", rcm_awl_worklist_i18n.NO_DATE, "</span>");
                        }

                        else {
                            var todaysDate = new Date();
                            todaysDate.setHours(0);
                            todaysDate.setMinutes(0);
                            todaysDate.setSeconds(0);
                            todaysDate.setMilliseconds(0);
                            var tomorrowDate = new Date();
                            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                            tomorrowDate.setHours(0);
                            tomorrowDate.setMinutes(0);
                            tomorrowDate.setSeconds(0);
                            tomorrowDate.setMilliseconds(0);
                            var yesterdayDate = new Date();
                            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                            yesterdayDate.setHours(0);
                            yesterdayDate.setMinutes(0);
                            yesterdayDate.setSeconds(0);
                            yesterdayDate.setMilliseconds(0);

                            if (recordDate.getTime() === todaysDate.getTime()) {
                                html.push("<span class='awlworklist-firstColumnItemFont'><b>", rcm_awl_worklist_i18n.TODAY, "</b></span>");
                            }
                            else
                                if (recordDate.getTime() === tomorrowDate.getTime()) {
                                    html.push("<span class='awlworklist-firstColumnItemFont'>", rcm_awl_worklist_i18n.TOMORROW, "</span>");
                                }
                                else
                                    if (recordDate.getTime() === yesterdayDate.getTime()) {
                                        html.push("<span class='awlworklist-firstColumnItemFontRed'><b>", rcm_awl_worklist_i18n.YESTERDAY, "</b></span>");
                                    }
                                    else
                                        if (recordDate < todaysDate) {//if the date came before todaysDate
                                            var tempDate = new Date();
                                            tempDate.setISO8601(person.appeal_expect_resp_dt_tm);
                                            var tempDate2 = new Date();
                                            var nrDate = new Date(tempDate);
                                            var nextReview = nrDate.getTime();
                                            var today = tempDate2.getTime();
                                            var days = Math.floor((Math.abs(today - nextReview)) / (1000 * 60 * 60 * 24));
                                            var dateString = days + " " + rcm_awl_worklist_i18n.DAYS_AGO;
                                            html.push("<span class='awlworklist-firstColumnItemFontRed'><b>", dateString, "</b></span>");
                                        }
                                        else {
                                            html.push("<span class='awlworklist-firstColumnItemFont'>", getDate(person.appeal_expect_resp_dt_tm), "</span>");
                                        }
                        }
                    }

					html.push("</p></div></td>");

                    //Sent
                    html.push("<td class='awl-worklist-td-border'>");
					if(person.appeal_sent_dt_tm === undefined){
						 html.push("<div class='awlworklist-hoverParent'><p class='awlworklist-firstColumnItemFont'>", rcm_awl_worklist_i18n.ERROR_MESSAGE, "</p>");
					}
					var recordDate = getComparisonDate(person.appeal_sent_dt_tm);
                   	if (recordDate === "") {
						html.push("<div class='awlworklist-hoverParent'><p class='awlworklist-firstColumnItemFont'>", rcm_awl_worklist_i18n.NO_DATE, "</p>");
					}
					else {
						html.push("<div class='awlworklist-hoverParent'><p class='awlworklist-firstColumnItemFont'>", RCM_Clinical_Util.formatJsonDateString(person.appeal_sent_dt_tm), "</p>");
					}
					if (person.appeal_prsnl_name === undefined) {
                        html.push("<p class='awlworklist-indention2'><span class='awlworklist-basicFont'>", rcm_awl_worklist_i18n.ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        html.push("<p class='awlworklist-indention2'><span class='awlworklist-basicFont'>", person.appeal_prsnl_name, "</span></p>");
                    }
                    html.push("<div class='awlworklist-hoverData'>");
					html.push("<div>");
                   	 html.push("<span class='awlworklist-hvr-info-lbl awlworklist-hvr-info-sentindentlbl'>", rcm_awl_worklist_i18n.SENT, ":</span>");
                        	html.push("<span class='awlworklist-hvr-info-val'>", RCM_Clinical_Util.formatJsonDateString(person.appeal_sent_dt_tm),"</span>");
					html.push("</div>");
					html.push("<div>");
                    	 html.push("<span class='awlworklist-hvr-info-lbl awlworklist-hvr-info-verifiedindentlbl'>", rcm_awl_worklist_i18n.VERIFIED, "</span>");
                        	html.push("<span class='awlworklist-hvr-info-val'>", RCM_Clinical_Util.formatJsonDateString(person.appeal_verified_dt_tm), "</span>");
                     html.push("</div>");
					html.push("<div>");
                   	 html.push("<span class='awlworklist-hvr-info-lbl'>", rcm_awl_worklist_i18n.COMMUNICATION_TYPE, "</span>");
                        	html.push("<span class='awlworklist-hvr-info-val'>", person.appeal_comm_type_display,"</span>");
					html.push("</div>");
					html.push("<div>");
                   	 html.push("<span class='awlworklist-hvr-info-lbl awlworklist-hvr-info-trackingindentlbl'>", rcm_awl_worklist_i18n.TRACKINGNUM, "</span>");
                        	html.push("<span class='awlworklist-hvr-info-val'>", person.tracking_nbr_text,"</span>");
					html.push("</div>");
                    html.push("</div></div></div>");
                    html.push("</td>");

                    //Level
                    html.push("<td class='awl-worklist-td-border'>");
                   	html.push("<p class='awlworklist-firstColumnItemFont'><center>", person.appeal_level_display, "</center></p>");
					html.push("</td>");

                    //Status
                    if (person.appeal_status_display === undefined) {
                        html.push("<td class='awl-worklist-td-border'><div><p><span class='awlworklist-firstColumnItemFont'>", rcm_awl_worklist_i18n.ERROR_MESSAGE, "</span>");
                    }
                    else {
						if (person.appeal_status_display === "") {
							html.push("<td class='awl-worklist-td-border'><div><p><span class='awlworklist-firstColumnItemFont'></span><br/>");
						}
						else {
							html.push("<td class='awl-worklist-td-border'><div><p><span class='awlworklist-firstColumnItemFont'>", person.appeal_status_display, "</span>");
						}
					}
					if(person.concurrentDenials && person.concurrentDenials.length > 0 && person.concurrentDenials[0].meaning === "CONCURRENT"){
						html.push("<p class='awlworklist-indention2'><span class='awlworklist-basicFontRed awlworklist-boldFont'>", person.concurrentDenials[0].display, "</span></p>");
					}

					var claimCnt = person.claim_numbers.length;
					if(claimCnt > 0){
						if(claimCnt === 1){
							if (person.claim_numbers[0].CLAIM_NUMBER){
								html.push("<p ><span class='ddworklist-firstColumnItemFont'>", rcm_awl_worklist_i18n.CLAIM_NUMBER," ",person.claim_numbers[0].CLAIM_NUMBER,"</span></p>");
							}
						}
						else{
							html.push("<p ><span class='ddworklist-firstColumnItemFont'>", rcm_awl_worklist_i18n.CLAIM_NUMBER," ", rcm_awl_worklist_i18n.MULTIPLE,"</span></p>");
						}
					}
                    html.push("</div></td>");


                    //Payer
                    if (person.payer_org_name === undefined) {
                        html.push("<td class='awl-worklist-td-border'><div><p><span class='awlworklist-firstColumnItemFont'>", rcm_awl_worklist_i18n.ERROR_MESSAGE, "</span>");
                    }
                    else {
                        if (person.payer_org_name == "") {
                            html.push("<td class='awl-worklist-td-border'><div><p><span class='awlworklist-firstColumnItemFont'></span><br/>");
                        }
                        else {
                            html.push("<td class='awl-worklist-td-border'><div><p><span class='awlworklist-firstColumnItemFont'>", person.payer_org_name, "</span>");
                        }
                    }

                    if (person.financial_class_display === undefined) {
                        html.push("<p class='awlworklist-indention2'><span class='awlworklist-basicFont'>", rcm_awl_worklist_i18n.ERROR_MESSAGE, "</span></p></p></div>");
                    }
                    else {
                        html.push("<p class='awlworklist-indention2'><span class='awlworklist-basicFont'>", person.financial_class_display, "</span></p></p></div>");
                    }
                    html.push("</td>");
                    html.push("</tr>");
                 }
            }
            html.push("</table>");
			worklistItemCount = worklistItems.length;
            var tableString = html.join("");
            var tableDiv = document.getElementById('tableDiv');
            if (tableDiv) {
                //already rendered.  Show the new table.
                document.getElementById('tableDiv').innerHTML = "asdf";
                document.getElementById('tableDiv').innerHTML = tableString;
                return null;
            }
            //used on first load, when table isn't rendered yet due to the way the html is built.
            return tableString;
        };

        function getDate(date){
            var nrDate;
            if (date === "") {
                nrDate = "";
            }
            else {
                var tempDate = new Date();
                tempDate.setISO8601(date);
                nrDate = new Date(tempDate).format('shortDate2');
            }
            return nrDate;
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
                nrDate.setHours(0);
                nrDate.setMinutes(0);
                nrDate.setSeconds(0);
                nrDate.setMilliseconds(0);
            }
            return nrDate;
        };

		function getTodaysDate(){
            var tempDate = new Date();
            tempDate.setHours(0);
            tempDate.setMinutes(0);
            tempDate.setSeconds(0);
            tempDate.setMilliseconds(0);
            return tempDate;
		};

        /**
         * Sorts the list of DRGs so that CM working DRGs are first.
         * @param drgs The list of DRGs.
         */
        function sortDRGs(drgs) {
        	drgs.sort(function(drg1, drg2) {
        		// Return  0 when they are the same.
        		// Return  1 when drg1 is CM and drg2 is not CM.
        		// Return -1 when drg1 is not CM and drg2 is CM.
        		var result = (drg2.isCMWorkingDRG ? 1 : 0) - (drg1.isCMWorkingDRG ? 1 : 0);
        		return result;
        	});
        }
};
