function RCMDeniedDaysWorklist(criterion){
        var loc = criterion.static_content;
		var serviceDelegate = new DeniedDaysWorklistDelegate();
		var worklistItemCount = 0;
		var ddWorklistChangeDialog = null;
		var providerSearchControl;
		var newPersonnelIdToBeAdded = "";
		var newPersonnelNameToBeAdded = "";
		var canAddRel;

		/**
		*Function to initialize the worklist
		*/
        this.initialize = function(criterion, defaultsObj){
			this.criterion = criterion;
			var worklistData = serviceDelegate.getWorklistItems(makeWorklistCallObj(defaultsObj));
			var worklistItems = worklistData.worklistItems;
			canAddRel = worklistData.can_modify_denied_days_ind === 1;
			var worklistHTMLArray = [];
			worklistHTMLArray.push(renderRCMTable(worklistItems));

			return worklistHTMLArray.join("");
        };

		/**
		*sets up hovers for the worklist
		*/
		this.setUpHovers = function(){
			var hoverParentElements = $(".ddworklist-hoverParent");
			hoverParentElements.each(function(){
				var hoverParent = $(this).get(0);
				var hoverChild = $(this).children(".ddworklist-hoverData").get(0);
				hs(hoverParent, hoverChild);
			});

			var canceledHoverParents = $(".ddworklist-canceledHoverParent");
			canceledHoverParents.each(function(){
				var alertParent = $(this).get(0);
				var alertChild = $(this).children(".ddworklist-canceledHoverData").get(0);
				hs(alertParent, alertChild);
			});
		};

		this.setUpManagerModify = function(){
			if(canAddRel){
				var documentationSpecialistNames = $(".ddwPrsnlName");
				documentationSpecialistNames.each(function(){

					$(this).mouseover(function(){
						showDashedLine(this);
					});

					$(this).mouseout(function(){
						removeDashedLine(this);
					});

					$(this).click(function(){
						openWorklistModifyDialog(this);
					});
				});
			}

			$("#ddWorklistBtnOk").click(function(){
				$("#ddWorklistOkDialog").hide();
				$("#listBlockingDiv").hide();
			});
		}

		this.getWorklistItemCount = function(){
			return worklistItemCount;
		};

		this.callDelegateReloadTable = function(defaultsObj){
			var worklistCallObj = makeWorklistCallObj(defaultsObj);
			loadTable(serviceDelegate.getWorklistItems(worklistCallObj).worklistItems);
		};

		function makeWorklistCallObj(defaultsObj){
			var worklistCallObj = {
                	primarySortColumn : defaultsObj.defaultPrimarySortColumn,
                	primarySortDir : defaultsObj.defaultPrimarySortDir,
                	secondarySortColumn : defaultsObj.defaultSecondarySortColumn,
               		secondarySortDir : defaultsObj. defaultSecondarySortDir,
					name : "PRSNL",
					value : defaultsObj.defaultAssignedTo,
					showDenialsWithAppealsInd : defaultsObj.showDenialsWithAppealsInd
			   };
			return worklistCallObj;
		};

		/**
		* Function to render table
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
            if(!$("#listBlockingDiv").length){
				$("body").append("<div id='listBlockingDiv' class='transDiv'></div>");
			}
			zebraStriping = "";
            var html = [];
            html.push("<table id='deniedDayListTable'>");
            html.push("<tr id='floatingTableHeader'>");
            html.push("<th class='ddworklist-th' scope='col'>", rcm_ddw_worklist_i18n.FACILITY, "</th>");
            html.push("<th class='ddworklist-th' scope='col'>", rcm_ddw_worklist_i18n.PATIENT_NAME, "</th>");
            html.push("<th class='ddworklist-th' scope='col'>", rcm_ddw_worklist_i18n.APPEAL_DEADLINE, "<br />(", rcm_ddw_worklist_i18n.DENIAL_MANAGER, ")</th>");
            html.push("<th class='ddworklist-th' scope='col'>", rcm_ddw_worklist_i18n.RISK_AMOUNT, "</th>");
            html.push("<th class='ddworklist-th' scope='col'>", rcm_ddw_worklist_i18n.DENIED_DAYS, "</th>");
            html.push("<th class='ddworklist-th' scope='col'>", rcm_ddw_worklist_i18n.REASON, "<br />(", rcm_ddw_worklist_i18n.TYPE, ")</th>");
			html.push("<th class='ddworklist-th' scope='col'>", rcm_ddw_worklist_i18n.LETTER_DATE, "</th>");
            html.push("<th class='ddworklist-th' scope='col'>", rcm_ddw_worklist_i18n.PAYER, "<br />(", rcm_ddw_worklist_i18n.CLASS, ")</th>");
            html.push("</tr>");
            if (worklistItems === undefined) {
                html.push("<tr><td colspan='8'><b><center>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</center><b></td></tr>");
            }
            else
                if (worklistItems.length === 0) {
                    html.push("<tr><td colspan='8'><b><center>", rcm_ddw_worklist_i18n.NO_RESULTS_FOUND, "</center><b></td></tr>");
                }

            else {
                //Fill table component with data
                for (var j = 0, x = worklistItems.length; j < x; j++) {
                    var person = worklistItems[j];
					var hasPatientAcct = true;
					if (j % 2 === 0) {
                        zebraStriping = "ddworklist-zebra-striping-white";
                    }
                    else {
                        zebraStriping = "ddworklist-zebra-striping-blue";
					}
                    var personId = person.patient_id;
                    html.push("<tr class='", zebraStriping, "'>");

                    //Facility
                    if (person.facility_org_name === undefined) {
                        html.push("<td class='dd-worklist-td-border'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</td>");
                    }
                    else {
                        html.push("<td class='dd-worklist-td-border'>", person.facility_org_name, "</td>");
                    }

                    //Patient
                    html.push("<td  class='ddworklist-patientInfo'> ");
					//image code
					if(person.canceled_denied_day_ind === 1){
						var canceledImage = loc + "\\images\\6047.ico";
						html.push("<div class='ddworklist-canceledHoverParent'>");
							html.push("<img class='ddworklist-alert-image' src='", canceledImage,"'>");
							html.push("<div class='ddworklist-canceledHoverData'>");
								html.push("<span>", rcm_ddw_worklist_i18n.CANCELED_MESSAGE, "</span>");
							html.push("</div>");
						html.push("</div>");
					}
					html.push("<span class='ddworklist-hoverParent'>");
					if (person.denied_days_link === null || person.denied_days_link === "") {
						html.push("<p class='dd-worklist-patientName'>", person.person_name, "</p><br/>");
					}
					else{
                		var appName = rcm_ddw_worklist_i18n.POWERCHART;
						html.push("<a class='dd-worklist-patientName' style='text-decoration:none; border:none; color:#2400A5;' " +
                    	                "href='javascript:VIEWLINK(0, \"" + appName + "\", \"" + person.person_id + "\", \"" + person.encntr_id + "\", \"" + person.denied_days_link + "\", \"" + person.denied_days_view_link + "\", \"" + person.denied_days_viewpoint_link + "\");'>",
                    	                person.person_name, "</a>");
					}
					if (person.age === undefined) {
                        html.push("<p class='ddworklist-indention'><span class='secondary-basic'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</span>&nbsp;&nbsp;&nbsp;");
                    }
                    else {
                        html.push("<p class='ddworklist-indention'><span class='secondary-basic'>", person.age, "</span>&nbsp;&nbsp;&nbsp;");
                    }
                    if (person.gender_display === undefined) {
                        html.push("<span class='ddworklist-basicFont'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        html.push("<span class='ddworklist-basicFont'>", person.gender_display, "</span></p>");
                    }
                    html.push("<p class='ddworklist-indention'><span class='label-text'>", rcm_ddw_worklist_i18n.FIN, "</span>&nbsp;<span class='header-basic'>");
                    if (person.finNumberAlias === undefined) {
                        html.push(rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        html.push(person.finNumberAlias, "</span></p>");
                    }
                    if (person.appeal_created_ind === undefined) {
                        html.push("<p class='ddworklist-indention'><span style='font-size:12px; font-weight:bold'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</span></p>");
                    }
                    else {
						if (person.appeal_created_ind === 0) {
							html.push("<p class='ddworklist-indention'><span style='font-size:12px; font-weight:bold; color:#CC0000;'>", rcm_ddw_worklist_i18n.NO_APPEAL_IN_PROCESS, "</span></p>");
						}
                    }

            		html.push("<div class='ddworklist-hoverData'>");
            		html.push("<div>");
					html.push("<span class='ddworklist-hvr-info-lbl'>", rcm_ddw_worklist_i18n.DIAGNOSIS,"</span>");
						if (((person.final_diagnosis !== null) && (person.final_diagnosis !== "")) || ((person.final_diagnosis_desc !== null) && (person.final_diagnosis_desc !== ""))) {
							html.push("<span class='ddworklist-hvr-info-val'>", person.final_diagnosis_desc);
							if((person.final_diagnosis !== null) && (person.final_diagnosis !== "")){
								html.push("&nbsp;(", person.final_diagnosis, ")<p class='ddworklist-hvr-info-val3'>", rcm_ddw_worklist_i18n.FINAL,"</p></span>");
							}
							else{
								if (person.final_diagnosis_desc !== "" || person.final_diagnosis !== "") {
									html.push("<p class='ddworklist-hvr-info-val3'>", rcm_ddw_worklist_i18n.FINAL, "</p></span>");
								}
							}
						}
            			else{
							html.push("<span class='ddworklist-hvr-info-val'>", person.working_diagnosis_desc);
							if((person.working_diagnosis !== null) && (person.working_diagnosis !== "")){
								html.push("&nbsp;(", person.working_diagnosis, ")<p class='ddworklist-hvr-info-val3'>", rcm_ddw_worklist_i18n.WORKING,"</p></span>");
							}
							else{
								if (person.working_diagnosis_desc !== "" || person.working_diagnosis !== "") {
									html.push("<p class='ddworklist-hvr-info-val3'>", rcm_ddw_worklist_i18n.WORKING, "</p></span>");
								}
							}
						}
						html.push("</div>");

						sortDRGs(person.drgs);
						html.push("<div>");
	            		 	html.push("<span class='ddworklist-hvr-info-lbl'>", rcm_ddw_worklist_i18n.DRG, "</span>");
							for(var k = 0; k < person.drgs.length; k++) {
								var drg = person.drgs[k];
								html.push("<span class='", k > 0 ? "ddworklist-hvr-info-val2" : "ddworklist-hvr-info-val","'>");
									if(drg.isTransferRuleDRG){
										html.push("<img src='", loc, "\\images\\6405_16.png' alt=''/>&nbsp;");
									}
									html.push(drg.description, "&nbsp;(", drg.sourceIdentifier, ")");
									if(drg.severityOfIllnessDisplay || drg.riskOfMortalityDisplay || drg.drgWeight){
										html.push("<p class='ddworklist-hvr-info-val4 ddworklist-small-text'>");
											html.push(rcm_ddw_worklist_i18n.SEVERITY_OF_ILLNESS, "&nbsp;", drg.severityOfIllnessDisplay, "&nbsp;&nbsp;&nbsp;");
											html.push(rcm_ddw_worklist_i18n.RISK_OF_MORTALITY, "&nbsp;", drg.riskOfMortalityDisplay, "&nbsp;&nbsp;&nbsp;");
											html.push(rcm_ddw_worklist_i18n.DRG_WEIGHT, "&nbsp;", drg.drgWeight);
										html.push("</p>");
									}
									html.push("<p class='ddworklist-hvr-info-val4'><span class='ddworklist-small-text'>", drg.isFinal ? rcm_ddw_worklist_i18n.FINAL : rcm_ddw_worklist_i18n.WORKING, "&nbsp;(", drg.contributorSystemName ,")</span></p>");
								html.push("</span>");
							}
						html.push("</div>");
						html.push("<div>");
						if(person.careManagers && person.careManagers.length > 0){
							for(var i = 0; i < person.careManagers.length; i++){
								var careManager = person.careManagers[i];
								html.push("<p><span class='ddworklist-hvr-info-lbl'>", careManager.display,":</span>");
								if((careManager.name !== null) && (careManager.name !== "")){
									html.push("<span class='ddworklist-hvr-info-val'>", careManager.name,"</span></p>");
								}
							}
						}
						html.push("</div>");
            		html.push("</div>");

                    html.push("</span></td>");

                    //Appeal Deadline
                    html.push("<td class='dd-worklist-td-border'><div><p>");

                    if (person.appeal_by_dt_tm === undefined) {
                        html.push(rcm_ddw_worklist_i18n.ERROR_MESSAGE);
                    }
                    else {
                        var recordDate = getComparisonDate(person.appeal_by_dt_tm);
                        if (recordDate === "") {
                            html.push("<span class='ddworklist-firstColumnItemFont'>", rcm_ddw_worklist_i18n.NO_DATE, "</span>");
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
                                html.push("<span class='ddworklist-firstColumnItemFont'><b>", rcm_ddw_worklist_i18n.TODAY, "</b></span>");
                            }
                            else
                                if (recordDate.getTime() === tomorrowDate.getTime()) {
                                    html.push("<span class='ddworklist-firstColumnItemFont'>", rcm_ddw_worklist_i18n.TOMORROW, "</span>");
                                }
                                else
                                    if (recordDate.getTime() === yesterdayDate.getTime()) {
                                        html.push("<span class='ddworklist-firstColumnItemFontRed'><b>", rcm_ddw_worklist_i18n.YESTERDAY, "</b></span>");
                                    }
                                    else
                                        if (recordDate < todaysDate) {//if the date came before todaysDate
                                            var tempDate = new Date();
                                            tempDate.setISO8601(person.appeal_by_dt_tm);
                                            var tempDate2 = new Date();
                                            var nrDate = new Date(tempDate);
                                            var nextReview = nrDate.getTime();
                                            var today = tempDate2.getTime();
                                            var days = Math.floor((Math.abs(today - nextReview)) / (1000 * 60 * 60 * 24));
                                            var dateString = days + " " + rcm_ddw_worklist_i18n.DAYS_AGO;
                                            html.push("<span class='ddworklist-firstColumnItemFontRed'><b>", dateString, "</b></span>");
                                        }
                                        else {
                                            html.push("<span class='ddworklist-firstColumnItemFont'>", getDate(person.appeal_by_dt_tm), "</span>");
                                        }
                        }
                    }
					if (person.denial_prsnl_name === undefined) {
                        html.push("<p class='ddworklist-indention2'><span id='ddwDenialManager' class='ddworklist-basicFont ddwPrsnlName'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</span></p>");
                    }
                    else {
						if(person.denial_prsnl_name === ""){
							html.push("<p class='ddworklist-indention2'><span id='ddwDenialManager' class='ddworklist-basicFont ddwPrsnlName'>", rcm_ddw_worklist_i18n.UNASSIGNED, "</span></p>");
						}
						else{
							html.push("<p class='ddworklist-indention2'><span id='ddwDenialManager' class='ddworklist-basicFont ddwPrsnlName'>", person.denial_prsnl_name, "</span></p>");
						}
                    }
					html.push("</p></div></td>");

                    //Risk Amount
                    html.push("<td class='dd-worklist-td-border'>");
                    html.push("<div><p id='ddworklist-riskAmount' class='indention2'>");

                    if (person.denial_risk_amount === undefined) {
                        html.push(rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</p>");
                    }
                    else {
                        html.push($.fn.autoNumeric.Format('', Number(person.denial_risk_amount), getAutoNumericOptions()), "</p>");
                    }
                    html.push("</div></td>");

                    //Denied Days
                    html.push("<td class='dd-worklist-td-border'>");
                   	html.push("<p class='ddworklist-firstColumnItemFont'>", getDeniedDayFormattedDateString(person), "</p>");
					html.push("</td>");

                    //Reason
                    if (person.denial_reason_display === undefined) {
                        html.push("<td class='dd-worklist-td-border'><div><p><span class='ddworklist-firstColumnItemFont'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</span>");
                    }
                    else {
						if (person.denial_reason_display === "") {
							html.push("<td class='dd-worklist-td-border'><div><p><span class='ddworklist-firstColumnItemFont'></span><br/>");
						}
						else {
							html.push("<td class='dd-worklist-td-border'><div><p><span class='ddworklist-firstColumnItemFont'>", person.denial_reason_display, "</span>");
						}
					}
                    if (person.denial_type_display === undefined) {
                        html.push("<p class='ddworklist-indention2'><span class='ddworklist-basicFont'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</span></p>");
                    }
                    else {
                        html.push("<p class='ddworklist-indention2'><span class='ddworklist-basicFont'>", person.denial_type_display, "</span></p>");
                    }
					if(person.denial_category_display === undefined){
						html.push("<p class='ddworklist-indention2'><span class='ddworklist-basicFont'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE,"</span></p>");
					}
					else{
						if(person.denial_category_meaning === rcm_ddw_worklist_i18n.CONCURRENT){
							html.push("<p class='ddworklist-indention2'><span class='ddworklist-basicFontRed'><b>", person.denial_category_display,"</b></span></p>");
						}
					}

					if(person.claim_number){
						html.push("<p ><span class='ddworklist-firstColumnItemFont'>", rcm_ddw_worklist_i18n.CLAIM_ID," ", person.claim_number,"</span></p>");
					}
                    html.push("</p></div></td>");

                    //Letter Date
                    html.push("<td class='dd-worklist-td-border'>");
					if(person.letter_dt_tm === undefined){
						 html.push("<div class='ddworklist-hoverParent'><p class='ddworklist-firstColumnItemFont'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</p>");
					}
					var recordDate = getComparisonDate(person.letter_dt_tm);
                   	if (recordDate === "") {
						html.push("<div class='ddworklist-hoverParent'><p class='ddworklist-firstColumnItemFont'>", rcm_ddw_worklist_i18n.NO_DATE, "</p>");
					}
					else {
						html.push("<div class='ddworklist-hoverParent'><p class='ddworklist-firstColumnItemFont'>", RCM_Clinical_Util.formatJsonDateString(person.letter_dt_tm), "</p>");
					}
                    html.push("<div class='ddworklist-hoverData'>");
					html.push("<div>");
                   	 html.push("<span class='ddworklist-hvr-info-lbl ddworklist-hvr-info-smallindentlbl'>", rcm_ddw_worklist_i18n.LETTER_CREATED, "</span>");
                        	html.push("<span class='ddworklist-hvr-info-val'>", RCM_Clinical_Util.formatJsonDateString(person.letter_dt_tm),"</span>");
					html.push("</div>");
					html.push("<div>");
                    	 html.push("<span class='ddworklist-hvr-info-lbl'>", rcm_ddw_worklist_i18n.LETTER_RECEIVED, "</span>");
                        	html.push("<span class='ddworklist-hvr-info-val'>", RCM_Clinical_Util.formatJsonDateString(person.notice_received_dt_tm), "</span>");
                     html.push("</div>");
                    html.push("</div></div></div>");
                    html.push("</td>");


                    //Payer
                    if (person.payer_org_name === undefined) {
                        html.push("<td class='dd-worklist-td-border'><div><p><span class='ddworklist-firstColumnItemFont'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</span>");
                    }
                    else {
                        if (person.payer_org_name == "") {
                            html.push("<td class='dd-worklist-td-border'><div><p><span class='ddworklist-firstColumnItemFont'></span><br/>");
                        }
                        else {
                            html.push("<td class='dd-worklist-td-border'><div><p><span class='ddworklist-firstColumnItemFont'>", person.payer_org_name, "</span>");
                        }
                    }

                    if (person.financial_class_display === undefined) {
                        html.push("<p class='ddworklist-indention2'><span class='ddworklist-basicFont'>", rcm_ddw_worklist_i18n.ERROR_MESSAGE, "</span></p></p></div>");
                    }
                    else {
                        html.push("<p class='ddworklist-indention2'><span class='ddworklist-basicFont'>", person.financial_class_display, "</span></p></p></div>");
                    }
                    html.push("</td>");
					//Invisible Encounter Denied Days Id
					html.push("<td id='ddDeniedDaysIdCol' class='ddworklist-invisible-info ddDeniedDaysIdCol'>",person.encntr_denied_days_id,"</td>");

					//Invisible Update Count
					html.push("<td id='dswlUpdtCntCol' class='ddworklist-invisible-info dswlUpdtCntCol'>",person.updt_cnt,"</td>");

					//Invisible Personnel Id
					html.push("<td id='dswlPrsnlIdCol' class='ddworklist-invisible-info dswlPrsnlIdCol'>",person.denial_prsnl_id,"</td>");

					html.push("</tr>");
                 }
            }
            html.push("</table>");
			worklistItemCount = worklistItems.length;
			html.push(createWorklistModifyDialog());
			html.push(getOkDialogHTML());
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

	  /**
		* i18n options for worklist. https://github.com/BobKnothe/autoNumeric
		*/
        var getAutoNumericOptions = function(){
            return {
                aSep: rcm_ddw_worklist_i18n.CURRENCY_THOUSAND_SEPARATOR,
                aDec: rcm_ddw_worklist_i18n.CURRENCY_DECIMAL_SEPARATOR,
                aSign: rcm_ddw_worklist_i18n.CURRENCY_SYMBOL,
                pSign: rcm_ddw_worklist_i18n.CURRENCY_SYMBOL_PLACEMENT,
                mDec: rcm_ddw_worklist_i18n.CURRENCY_MAX_DECIMAL,
                dGroup: rcm_ddw_worklist_i18n.CURRENCY_THOUSAND_GROUPING,
                vMax: rcm_ddw_worklist_i18n.CURRENCY_MAX_NUMBER_VALUE,
                vMin: rcm_ddw_worklist_i18n.CURRENCY_MIN_NUMBER_VALUE
            };
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
         * Returns a string containing the formatted date (or date range) for the specified
         * <code>worklistItems</code>. If the <code>worklistItems</code> contains a begin and
         * end date for the same calendar day (i.e, the dates are equal excluding their time
         * components), the returned string will be in the format 'mm/dd/yyyy'. Otherwise, the formatted
         * string will be in the format 'mm/dd/yyyy - mm/dd/yyyy', where the first date is the begin
         * date and the second date is the end date.
         *
         * @return {String} A string containing the formatted date (or date range) for the specified
         *         <code>worklistItems</code>.
         */
        function getDeniedDayFormattedDateString(person){
			if (person.beg_dt_tm !== ""){
				var beginDate = new Date();
				beginDate.setISO8601(person.beg_dt_tm);

				if (person.end_dt_tm !== ""){
					var endDate = new Date();
					endDate.setISO8601(person.end_dt_tm);

					if ((beginDate.getMonth() === endDate.getMonth()) &&
					(beginDate.getDate() === endDate.getDate()) &&
					(beginDate.getFullYear() === endDate.getFullYear())) {
						return RCM_Clinical_Util.formatJsonDateString(person.beg_dt_tm);
					}
				}
			}
			else if (person.end_dt_tm === ""){
				return rcm_ddw_worklist_i18n.NO_DATE;
			}

            return RCM_Clinical_Util.formatJsonDateString(person.beg_dt_tm) + " - " +
            RCM_Clinical_Util.formatJsonDateString(person.end_dt_tm);
        };

        function checkPersonData(personData){
            if (personData == undefined) {
                return i18n.RCM_ERROR_MESSAGE;
            }
            else {
                return personData;
            }
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

		function showDashedLine(name){
			if(!($(name).hasClass("ddworklist-solid-line"))){
				$(name).removeClass("ddworklist-transparent-line");
				$(name).addClass("ddworklist-dashed-line");
			}
		};


		function removeDashedLine(name){
			if(!($(name).hasClass("ddworklist-solid-line"))){
				$(name).removeClass("ddworklist-dashed-line");
				$(name).addClass("ddworklist-transparent-line");
			}
		};

		function createWorklistModifyDialog(){
			var modifyDiv = document.createElement("div");
			modifyDiv.id = "ddworklistModifyDialog";
			modifyDiv.className = "ddworklist-modify-dialog";
			document.body.appendChild(modifyDiv);
		};

		function getMousePosition(name){
			var position = $(name).offset();
			var cursor = { x: 0, y: 0 };
			cursor.x = position.left;
			cursor.y = position.top + $(name).height() + 3;
			return cursor;
		};

		function openWorklistModifyDialog(name){
			newPersonnelIdToBeAdded = "";
			newPersonnelNameToBeAdded = "";

		//Removes any open modify dialog in worklist
			if(ddWorklistChangeDialog){
				ddWorklistChangeDialog.innerHTML = '';
				ddWorklistChangeDialog.style.display = 'none';
				ddWorklistChangeDialog = null;
			}


			//Removes the solid border and background color around any other element
			//on the worklist so that the element clicked is the only one with the solid
			//line and background color
			if($("#tableDiv").find("span, div, img").hasClass("ddworklist-solid-line") && !($(name).hasClass("ddworklist-solid-line"))){
				$(".ddworklist-solid-line").addClass("ddworklist-transparent-line");
				$(".ddworklist-solid-line").removeClass("ddworklist-solid-line");
			}


			//Removes the dashed border around the label hovered over,
			//adds a solid border and background color, creates the modify
			//dialog and opens it
			$(".ddworklist-dashed-line").removeClass("ddworklist-dashed-line");
			$(name).addClass("ddworklist-solid-line");

			ddWorklistChangeDialog = document.getElementById("ddworklistModifyDialog");
			ddWorklistChangeDialog.innerHTML = createModifyDialog(name);

			var pos = getMousePosition(name);
			ddWorklistChangeDialog.style.top = pos.y + 'px';
			ddWorklistChangeDialog.style.left = pos.x + 'px';

			ddWorklistChangeDialog.style.display = 'block';

			providerSearchControl = new ProviderSearchControl(document.getElementById("ddworklistProviderSearch"));
			RCM_Clinical_Util.setFocus("ddworklistProviderSearch");
			personnelSearchControlListener = function(){
				newPersonnelIdToBeAdded = String(providerSearchControl.getSelectedProviderId());
				newPersonnelNameToBeAdded = $("#ddworklistProviderSearch").val();
			};
			providerSearchControl.addVerifyStateChangeListener(personnelSearchControlListener);

			addEventsToEditDialog(name);
		};

		function createModifyDialog(name){
			var html = [];

			html.push("<div>");
			html.push("<input type='text' class='searchText searchTextSpacing' id='ddworklistProviderSearch' name='ddworklistProviderSearch'/>");
			html.push("<br/>");
			html.push("<span class='ddworklist-modify-relationship-action-buttons'>");
			html.push("<input type='button' id='ddworklistRelationshipSaveButton' value='",rcm_ddw_worklist_i18n.SAVE,"'/>");
			html.push("<input type='button' id='ddworklistModifyDialogCancelButton' value='",rcm_ddw_worklist_i18n.CANCEL,"'/>");
			html.push("</span>");
			html.push("</div>");

			return html.join("");
		};

		function addEventsToEditDialog(name){
			$("#ddworklistModifyDialogCancelButton").click(function(){
				removeDialogandLine();
			});

			$("#ddworklistRelationshipSaveButton").click(function(){
				$("#ddworklistModifyDialogCancelButton").prop("disabled", true)
				$("#ddworklistRelationshipSaveButton").prop("disabled", true);
				if (newPersonnelNameToBeAdded === "" || newPersonnelNameToBeAdded === $(name).html()){
					removeDialogandLine();

				}
				else{
					saveNewRelationship(name);
				}
			});
		};

		function removeDialogandLine(){
			$("#ddworklistModifyDialogCancelButton").prop("disabled", true);
			$(".ddworklist-solid-line").addClass("ddworklist-transparent-line");
			$(".ddworklist-solid-line").removeClass("ddworklist-solid-line");
			if(ddWorklistChangeDialog){
				ddWorklistChangeDialog.innerHTML = '';
				ddWorklistChangeDialog.style.display = 'none';
				ddWorklistChangeDialog = null;
			}
			$(window).resize();
			newPersonnelNameToBeAdded = "";
			newPersonnelIdToBeAdded = "";
		};

		function saveNewRelationship(name){
			var $row = $(name).closest("tr");
			var ddEncounterId = $row.find(".ddDeniedDaysIdCol").html();
			var ddUpdtCnt = $row.find(".dswlUpdtCntCol").html();

			var jsonRequest = {
				"MODIFY_DENIAL_MANAGER_REQUEST" : {
					"ENCNTR_DENIED_DAYS_ID" : String(ddEncounterId),
					"DENIAL_PRSNL_ID": String(newPersonnelIdToBeAdded),
					"UPDT_CNT" : Number(ddUpdtCnt)
				}
			};
			var modifyReply = serviceDelegate.modifyEncounterInformation(jsonRequest);
			if(modifyReply.status === 0){
				$row.find(".dswlUpdtCntCol").html(modifyReply.updt_cnt);
				$(name).html(newPersonnelNameToBeAdded);
				$row.find(".dswlPrsnlIdCol").html(newPersonnelIdToBeAdded);
				removeDialogandLine();
			}

			if(modifyReply.status === 1){
				removeDialogandLine();
				openStaleDataDialog();
			}

			if(modifyReply.status === -1){
				removeDialogandLine();
				openSaveFailedDialog();
			}
		};

		/**
		* Gets HTML for okay dialog
		*/
		function getOkDialogHTML() {
			var boxDiv = document.createElement("div");
				boxDiv.id = "ddWorklistOkDialog";
				boxDiv.className = "ddworklist-dialog";
			var html = [];
				html.push("<div class='ddworklist-dialog-title-bar'>");
					html.push("<label id='ddWorklistOkDialogTitle'></label>");
				html.push("</div>");
				html.push("<div class='ddworklist-dialog-message-area'>");
					html.push("<label id='ddWorklistOkDialogMessage'></label>");
				html.push("</div>");
				html.push("<div class='ddworklist-dialog-buttons'>");
					html.push("<input id='ddWorklistBtnOk' type='button' value='",rcm_ddw_worklist_i18n.OK,"'/>");
				html.push("</div>");
			boxDiv.innerHTML = html.join("");
			document.body.appendChild(boxDiv);
		};

		/**
		*Opens stale data dialog
		*/
		function openStaleDataDialog(){
			$("#ddWorklistOkDialogTitle").html(rcm_ddw_worklist_i18n.STALE_DATA_TITLE);
			$("#ddWorklistOkDialogMessage").html(rcm_ddw_worklist_i18n.STALE_DATA_MESSAGE);
			getFloatingHeaderRowPosition();
			$("#ddWorklistOkDialog").show();
			$("#listBlockingDiv").show();
			RCM_Clinical_Util.setFocus("ddWorklistOkDialog");
		};

		/**
		*Opens save failed dialog
		*/
		function openSaveFailedDialog(){
			$("#ddWorklistOkDialogTitle").html(rcm_ddw_worklist_i18n.SAVE_FAILED);
			$("#ddWorklistOkDialogMessage").html(rcm_ddw_worklist_i18n.SAVE_FAILED_MESSAGE);
			getFloatingHeaderRowPosition();
			$("#ddWorklistOkDialog").show();
			$("#listBlockingDiv").show();
			RCM_Clinical_Util.setFocus("ddWorklistOkDialog");
		};

		function getFloatingHeaderRowPosition(){
			var position = $("#floatingTableHeader").offset();
			$("#dswlWorklistOkDialog").css("top", position.top + 250);
		};
};
