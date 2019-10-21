/* Prescription Drug Monitoring (PMP) custom component start here */
if (pwx == undefined)
{
	var pwx = new Object();
}
pwx.Narxcheck = function ()  {};
pwx.Narxcheck.prototype = new MPage.Component();
pwx.Narxcheck.prototype.constructor = MPage.Component;
pwx.Narxcheck.prototype.base = MPage.Component.prototype;
pwx.Narxcheck.prototype.name = "pwx.Narxcheck";
pwx.Narxcheck.prototype.cclProgram = "AMB_MP_NARXCHECK";
pwx.Narxcheck.prototype.cclParams = [];
pwx.Narxcheck.prototype.cclDataType = "JSON";

pwx.Narxcheck.prototype.init = function (options)
{
	var params = [];
	//set params
	params.push("MINE");
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("positionCd"));
	params.push(0); //get basic bedrock setting
	params.push(0);
	params.push("");
	params.push("");
	this.cclParams = params;
};
//set the MinimumSpecVersion
pwx.Narxcheck.prototype.componentMinimumSpecVersion = 1.0;
//set render to display the component
pwx.Narxcheck.prototype.render = function ()
{
	var element = this.getTarget();
	var component = this.getOption("parentComp");
	var narxcheckCompId = this.getComponentUid();
	var PID = this.getProperty("personId") + ".0"
		var EID = this.getProperty("encounterId") + ".0"
		var UID = this.getProperty("userId") + ".0"
		var POID = this.getProperty("positionCd") + ".0"
		var narxcheckmainHTML = [];
	var narxcheckscoreHTML = [];
	var narxcheckscoreValue = [];
	var reportSendDEA = "";
	var reportSendLice = "";
	var reportHTML = [];
	var rolenameresponse = [];
	var Disclaimer = "";
	var reportPMP = [];
	var reportURL = "";
	var narxcheckscoreInd = 0;
	var medListInd = 0;
	var responseFail = [];
	var responsereportFail = [];
	var useralias = [];
	var errorFail = [];
	var responsefoundind = 0;
	var openeulacount = 0;
	var openeulahyperlinkcount = 0;
	var ambnarxcheckmainObj = this.data;

	//all hardcoded message variable here
	var loading_msg = "Please wait while we retrieve PMP records..."
		var recommended_review_primary_text = "Recommended Review"
		var recommended_review_secondary_text = "State Law requires viewing PMP data under certain circumstances, please refer to State Law for specific policy."
		var eula_term_text = "License Agreement Required: Please review and accept license to access PMP."
		var eula_term_modal_line1 = "State policy requires <a id='amb_narxcheck_eula_hyperlink" + narxcheckCompId + "'>review and acceptance of terms and conditions</a> of use to access state Prescription Drug Monitoring Program (PDMP) registry information."
		var eula_term_modal_line2 = "Access will not be provided until the end user license agreement is accepted and recorded by the state administrator."
		var eula_term_modal_line3 = "When complete, please refresh the PDMP or NARxCHECK view to access registry information."
		var multi_lice_text = "Multiple state license numbers found. Please choose appropriate for your state."
		var multi_dea_text = "Multiple DEA numbers found. Please choose appropriate."
		var pmp_score_save_text = "PMP drug information not saved for this visit/encounter."

		//build container to hold dynamic HTML
		narxcheckmainHTML.push("<div id='narxcheck_main_div_id" + narxcheckCompId + "' class='narxcheck_main_div_class'>")
		narxcheckmainHTML.push("<div id='narxcheck_review_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("<div id='narxcheck_storable_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("<div id='narxcheck_disclaimer_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("<div id='narxcheck_score_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("<div id='narxcheck_score_report_url_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("</div>")
		$(element).html(narxcheckmainHTML.join(""));
	var amb_narxcheck_header_display = '- Last 2 years';
	this.setProperty("headerSubTitle", amb_narxcheck_header_display);

	//build parameter to call narxcheck service
	var scoreParam = [];
	scoreParam.push("MINE");
	scoreParam.push(PID); //person ID
	scoreParam.push(EID); //encounter ID
	scoreParam.push(UID); //user ID
	scoreParam.push(POID); //Position code
	scoreParam.push(1) //indicator to narxcheck service call
	scoreParam.push(0) //service type(eula request,eula acceptance, patient request)
	scoreParam.push("^^") //Report URL if needed
	scoreParam.push("^^") //DEA number
	scoreParam.push("^^") //LICENSE number

	//display loading text before CCL call
	$('#narxcheck_review_id' + narxcheckCompId).html('<div id="amb_narcheck_loadingdiv' + narxcheckCompId + '" class="amb_narcheck_loadingdivclass"><span id="amb_narxcheck-spinner' + narxcheckCompId + '" class="amb_narcheck-spinner"></span>' + loading_msg + '</div>');

	/*
	 * @function to call script to get eula/score/report response
	 * @param {string} AMB_MP_NARXCHECK : service script name
	 * @param {Array} scoreParam : Array contain required promot varaible (patientID,encounter ID,user ID,score etc)
	 * @param {number} true : contain true boolean value
	 */

	AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", scoreParam, true, function ()
	{
		var sucessbody = this.RESPONSEBODY
			var rolename = this.ROLE_NAME
			//get user alias information (NPI,DEA and LICENSE number)
			for (i = 0; i < this.USER_ALIAS.length; i++)
			{
				useralias.push(this.USER_ALIAS[i].USER_ALIAS_NUMBER)
			}
			//if response service name is EULA request and response code is 200 that mean we need to release EULA sign layout screen.
			if (this.SERVICE_NAME === 'EULA Request' && this.RESPONSECODE === "200")
			{
				//making sure URL has http in it in case
				if (sucessbody.indexOf("http") > -1)
				{
					$("#amb_narcheck_loadingdiv" + narxcheckCompId).remove() //remove loading div
					//create advisory banner box for EULA Sign term
					amb_narxcheck_banner_box("narxcheck_review_id" + narxcheckCompId + "", "narxcheck_advisory-msg", eula_term_text, "Launch", "narxcheck-adv_btn_terms" + narxcheckCompId + "")
					$("#narxcheck_review_id" + narxcheckCompId).addClass("narxcheck_review_class")
					//open modal to release EULA form
					$("#narxcheck-adv_btn_terms" + narxcheckCompId).click("")
					$("#narxcheck-adv_btn_terms" + narxcheckCompId).click(function ()
					{
						//create EULA launch modal
						var consentHTML = "<dl class='eula_modal_line1'>" + eula_term_modal_line1 + "</dl><dl class='eula_modal_line1'>" + eula_term_modal_line2 + "</dl><dl class='eula_modal_line1'>" + eula_term_modal_line3 + "</dl>"
							var consentModalobj = new ModalDialog("consentmodal")
							.setHeaderTitle('<span>Terms of Use License Agreement</span>')
							.setTopMarginPercentage(20)
							.setRightMarginPercentage(25)
							.setBottomMarginPercentage(20)
							.setLeftMarginPercentage(25)
							.setIsBodySizeFixed(true)
							.setHasGrayBackground(true)
							.setIsFooterAlwaysShown(true);
						consentModalobj.setBodyDataFunction(
							function (modalObj)
						{
							modalObj.setBodyHTML(consentHTML);
						}
						);
						var okbtn = new ModalButton("consentmodal");
						//when review and accept terms click
						okbtn.setText("Review and Accept Terms").setCloseOnClick(false).setOnClickFunction(function ()
						{
							//counter in case user click more than one time as URL is one time viewed we need to get new URL on more clicks and load them
							openeulacount = openeulacount + 1
								if (openeulacount > 1)
								{
									//calling to get new URL
									AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", scoreParam, true, function ()
									{
										if (this.RESPONSEBODY.indexOf("http") > -1 && this.SERVICE_NAME === 'EULA Request' && this.RESPONSECODE === "200")
										{ //making sure it is success
											openwindowpopup(this.RESPONSEBODY, 800, 800)
										}
										else
										{
											MP_ModalDialog.closeModalDialog("consentmodal")
											var comp = MPage.getCustomComp(narxcheckCompId);
											comp.refresh();
										}
									}
									);
								}
								else
								{
									//open IE EULA sign form on top of the modal
									openwindowpopup(sucessbody, 800, 800)
								}
						}
						);
						var closebtn = new ModalButton("addCancel");
						closebtn.setText("Cancel").setCloseOnClick(true).setOnClickFunction(function ()
						{
							var comp = MPage.getCustomComp(narxcheckCompId);
							comp.refresh(); //upon closing refereh component
						}
						);
						consentModalobj.addFooterButton(okbtn)
						consentModalobj.addFooterButton(closebtn)
						MP_ModalDialog.addModalDialogObject(consentModalobj);
						MP_ModalDialog.showModalDialog("consentmodal")
						//same logic on hyperlink
						$("#amb_narxcheck_eula_hyperlink" + narxcheckCompId).click(function ()
						{
							openeulahyperlinkcount = openeulahyperlinkcount + 1
								if (openeulahyperlinkcount > 1)
								{
									AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", scoreParam, true, function ()
									{
										if (this.RESPONSEBODY.indexOf("http") > -1 && this.SERVICE_NAME === 'EULA Request' && this.RESPONSECODE === "200")
										{
											openwindowpopup(this.RESPONSEBODY, 800, 800)
										}
										else
										{
											MP_ModalDialog.closeModalDialog("consentmodal")
											var comp = MPage.getCustomComp(narxcheckCompId);
											comp.refresh();
										}
									}
									);
								}
								else
								{
									openwindowpopup(sucessbody, 800, 800)
								}
						}
						)
						//refersh component on close icon click
						$('.dyn-modal-hdr-close').click(function ()
						{
							var comp = MPage.getCustomComp(narxcheckCompId);
							comp.refresh();
						}
						);
					}
					)
					function openwindowpopup(url, width, height)
					{
						var leftPosition,
						topPosition;
						//Allow for borders.
						leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
						//Allow for title and status bars.
						if (window.screen.height < 800)
						{
							topPosition = window.screen.height;
						}
						else
						{
							topPosition = (window.screen.height / 2) - ((height / 2) + 50);
						}
						//Open the window.
						window.open(url, "EULA Agreement Form",
							"status=no,height=" + height + ",width=" + width + ",resizable=yes,left="
							 + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY="
							 + topPosition + ",toolbar=no,menubar=no,scrollbars=yes,location=no,directories=no");
					}
				}
			}
			else
			{
				//if EULA is not get in response that mean user already signed before and continue with score/report call
				RenderResponseHTML(sucessbody, rolename, useralias);
			}
	}
	);

	/*
	 * @function to display/capture eula/score/report response
	 * @param {string} data : hold eula/score/report response
	 * @param {string} rolename : contain name of role i.e physician role
	 * @param {number} useralias : contain user alias number if there is
	 */
	function RenderResponseHTML(data, rolename, useralias)
	{
		$("#amb_narcheck_loadingdiv" + narxcheckCompId).remove() //remove loading div
		try
		{
			xmlDoc = $.parseXML(data);
			xml = $(xmlDoc);
			/* detect is it narxcheck vs medlist */
			if ($(xml).find("NarxCheckScore").length === 0)
			{
				if ($(xml).find("ReportRequestURLs").length !== 0)
				{
					medListInd = 1
				}
			}
			else
			{
				narxcheckscoreInd = 1
			}
			/* found error receive from gateway and not from PMP*/
			$(xml).find("Error").each(function ()
			{
				errorFail.push($(this).find("Message").text())
				errorFail.push($(this).find("Details").text())
			}
			)
			/*If disclaimer found then extract */
			$(xml).find("Disclaimer").each(function ()
			{
				Disclaimer = $(xml).find("Disclaimer").text()
					$("#narxcheck_disclaimer_id" + narxcheckCompId).html('<span class="amb_narxcheck_disclaimer-style-class" id="amb_narxcheck_disclaimer-style-class' + narxcheckCompId + '">' + Disclaimer + '</span>')
					$("#narxcheck_disclaimer_id" + narxcheckCompId).addClass("narxcheck_disclaimer_class")
			}
			)
			/* If Report tag found then parse the xml (extract Report tag)*/
			$(xml).find("Report").each(function ()
			{
				$(this).find("ResponseDestinations").each(function ()
				{
					var pmplength = $(this).find("Pmp").length
						for (i = 0; i < pmplength; i++)
						{
							reportPMP.push($(this).find("Pmp").eq(i).text()) //store all PMP states
						}
				}
				)
				/*If MandatoryReview tag found */
				$(xml).find("MandatoryReview").each(function ()
				{
					var requiredind = $(this).find("Required").text()
						var rolelength = $(this).find("Role").length
						for (i = 0; i < rolelength; i++)
						{
							rolenameresponse.push($(this).find("Role").eq(i).text())
						}
						//if role name is find
						if ((requiredind = "true") && (rolenameresponse.indexOf(rolename) > -1))
						{
							amb_narxcheck_banner_box("narxcheck_review_id" + narxcheckCompId + "", "narxcheck_warning-msg", recommended_review_primary_text, recommended_review_secondary_text, "")
							$("#narxcheck_review_id" + narxcheckCompId).addClass("narxcheck_review_class")
						}
				}
				)
				/*If ReportRequestURLs tag found */
				$(this).find("ReportRequestURLs").each(function ()
				{
					$(this).find("StorableReport").each(function ()
					{
						//we are not stroing report so not creating store message banner untill narxschore found
						if (narxcheckscoreInd === 1 && ambnarxcheckmainObj.RECORD_DATA.PRSNL_NAME == "" && ambnarxcheckmainObj.RECORD_DATA.ACTION_DT === "--")
						{ 
							//if no bedrock event code mapping not found then don't display button
							if(ambnarxcheckmainObj.RECORD_DATA.NARCOTICS_SCORE != '0' || ambnarxcheckmainObj.RECORD_DATA.SEDATIVES_SCORE != '0' || ambnarxcheckmainObj.RECORD_DATA.STIMULANTS_SCORE != '0'){
							   amb_narxcheck_banner_box("narxcheck_storable_id" + narxcheckCompId + "", "narxcheck_advisory-msg", pmp_score_save_text, "Save to Chart", "narxcheck-adv_btn_save" + narxcheckCompId + "")
							   $("#narxcheck_storable_id" + narxcheckCompId).addClass("narxcheck_storable_class")
							}
						}
					}
					);
					reportURL = $(this).find("ViewableReport").text()
						if (reportURL != "")
						{
							amb_narxcheck_PDPM_Report_Link_HTML();
						}
				}
				)
				/*If NarxCheckScore tag found */
				$(this).find("NarxCheckScore").each(function ()
				{
					narxcheckscoreValue.push("'" + $(this).find("Narcotics").text() + "'", "'" + $(this).find("Sedatives").text() + "'", "'" + $(this).find("Stimulants").text() + "'")
					amb_narxcheck_PDMP_Score_HTML($(this).find("Narcotics").text(), $(this).find("Sedatives").text(), $(this).find("Stimulants").text())
				}
				)
			}
			)
			/* If response tag found then parse the xml (extract disallowed. error tag tag)*/
			$(xml).find("Response").each(function ()
			{
				responsefoundind = 1;
				len = responseFail.length
					responseFail[len] = new Array(5);
				$(this).find("ResponseDestinations").each(function ()
				{
					responseFail[len][0] = $(this).find("Pmp").text()
				}
				)
				$(this).find("Disallowed").each(function ()
				{
					responseFail[len][1] = 'Disallowed'
						responseFail[len][2] = $(this).find("Message").text()
						responseFail[len][3] = '' //for details but in disallowed we will not see details
						responseFail[len][4] = $(this).find("Source").text()
				}
				)
				$(this).find("Error").each(function ()
				{
					responseFail[len][1] = 'Error'
						responseFail[len][2] = $(this).find("Message").text()
						responseFail[len][3] = $(this).find("Details").text()
						responseFail[len][4] = $(this).find("Source").text()
				}
				)
			}
			)
		}
		catch (err)
		{
			//if response is not in XML that mean either of the below conditions
			if ("Multiple DEA number found on user account." === data)
			{
				amb_narxcheck_banner_box("narxcheck_review_id" + narxcheckCompId + "", "narxcheck_advisory-msg", multi_dea_text, "Select DEA", "narxcheck-adv_btn_dea" + narxcheckCompId + "")
				$("#narxcheck_review_id" + narxcheckCompId).addClass("narxcheck_review_class")
			}
			else if ("Multiple License number found on user account." === data)
			{
				amb_narxcheck_banner_box("narxcheck_review_id" + narxcheckCompId + "", "narxcheck_advisory-msg", multi_lice_text, "Select License", "narxcheck-adv_btn_ln" + narxcheckCompId + "")
				$("#narxcheck_review_id" + narxcheckCompId).addClass("narxcheck_review_class")
			}
			else
			{
				amb_narxcheck_banner_box("narxcheck_main_div_id" + narxcheckCompId + "", "narxcheck_error-msg", data, "", "")
			}
		}
		//add entire disclaimer title on title tag
		if (Disclaimer != "")
		{
			$(".amb_narxcheck_disclaimer-style-class").attr("title", Disclaimer)
		}
		//call narxcheck/PDMP report
		$("#amb_narxcheck_report_ID" + narxcheckCompId).click(function ()
		{
			//build parameter to call narxcheck/PDMP report
			var reportParam = [];
			reportParam.push("MINE");
			reportParam.push(PID); //person ID
			reportParam.push(EID); //encounter ID
			reportParam.push(UID); //user ID
			reportParam.push(POID); //Position code
			reportParam.push(1) //indicator to narxcheck service call
			reportParam.push(1) //service type (Report request)
			reportParam.push("^" + reportURL + "^") //Report URL if needed
			reportParam.push("^" + reportSendDEA + "^") //DEA number
			reportParam.push("^" + reportSendLice + "^") //LICENSE number
			AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", reportParam, true, function ()
			{
				amb_narxcheck_pdmp_report_open(this.RESPONSEBODY)
			}
			);
		}
		)
		//response fail modal check
		if ((medListInd === 1 || narxcheckscoreInd === 1) && (responseFail.length !== 0))
		{
			$("#amb_narxcheck_report_ID" + narxcheckCompId).after("<span class='amb_narxcheck_info-icon' title='PMP Connectivity Information' id='amb_narxcheck_info_id" + narxcheckCompId + "'></span>")
			$("#amb_narxcheck_info_id" + narxcheckCompId).click(function ()
			{
				amb_narxcheck_failed_response(responseFail)
			}
			)
		}
		else
		{
			if (responseFail.length > 0)
			{ //error banner with hyperlink to open modal
				var error_string = '<a id="amb_narxcheck_error_info_id' + narxcheckCompId + '">Click Here</a> to see more error information.'
					amb_narxcheck_banner_box("narxcheck_main_div_id" + narxcheckCompId + "", "narxcheck_error-msg", error_string, "", "")
					$("#narxcheck_disclaimer_id" + narxcheckCompId).hide();
				$("#amb_narxcheck_error_info_id" + narxcheckCompId).click(function ()
				{
					amb_narxcheck_failed_response(responseFail)
				}
				)
			}
		}
		//if error only found without response tag which mean gateway error
		if (responsefoundind === 0 && errorFail.length > 0)
		{
			amb_narxcheck_banner_box("narxcheck_main_div_id" + narxcheckCompId + "", "narxcheck_error-msg", errorFail.join(""), "", "")
		}
		//attach event to store score
		$("#narxcheck-adv_btn_save" + narxcheckCompId).click(function ()
		{
			var scoreArray = [];
			scoreArray.push(ambnarxcheckmainObj.RECORD_DATA.NARCOTICS_SCORE)
			scoreArray.push(ambnarxcheckmainObj.RECORD_DATA.SEDATIVES_SCORE)
			scoreArray.push(ambnarxcheckmainObj.RECORD_DATA.STIMULANTS_SCORE)
			if (ambnarxcheckmainObj.RECORD_DATA.NARCOTICS_SCORE != '0' || ambnarxcheckmainObj.RECORD_DATA.SEDATIVES_SCORE != '0' || ambnarxcheckmainObj.RECORD_DATA.STIMULANTS_SCORE != '0')
			{
				//kick off store event
				var cereultParam = [];
				cereultParam.push("MINE");
				cereultParam.push(PID);
				cereultParam.push(EID);
				cereultParam.push(UID);
				cereultParam.push(POID);
				cereultParam.push(CreateParamArray(scoreArray, 1))
				cereultParam.push(CreateParamArray(narxcheckscoreValue, 0))
				AMB_CCL_Insert_Score_Clinical_Event("AMB_MP_ADD_CE_RESULT", cereultParam, true, function ()
				{
					if ($('#narxcheck-adv_btn_save' + narxcheckCompId).text() === 'Save to Chart')
					{
						$('#narxcheck-adv_btn_save' + narxcheckCompId).html('Saved Chart');
						$('#narxcheck-adv_btn_save' + narxcheckCompId).attr("disabled", "disabled");
					}
				}
				)
			}		
		}
		)
		//attach event for multi dea
		$("#narxcheck-adv_btn_dea" + narxcheckCompId).click(function ()
		{
			amb_multi_DEA_State_License_info("DEA", useralias)
		}
		)
		//attach event for multi Lice
		$("#narxcheck-adv_btn_ln" + narxcheckCompId).click(function ()
		{
			amb_multi_DEA_State_License_info("State License", useralias)
		}
		)
	}

	/*
	 * @function to handle open report and if there is failed response upon HTTP POST on report service
	 * @param {string} reportdata : hold REPORT service response body text
	 */
	function amb_narxcheck_pdmp_report_open(reportdata)
	{
		try
		{
			xmlDoc = $.parseXML(reportdata);
			xml = $(xmlDoc);
			$(xml).find("ReportLink").each(function ()
			{
				window.open(xml.find("ReportLink").text(), "PMP Report", 'width=1024,scrollbars=yes,resizable=yes');
			}
			);
			/* If Disallowed/Error tag found then parse the xml (extract disallowed. error tag tag)*/
			$(xml).find("Disallowed").each(function ()
			{
				len = responsereportFail.length
					responsereportFail[len] = new Array(5);
				responsereportFail[len][0] = '--'
					responsereportFail[len][1] = 'Disallowed'
					responsereportFail[len][2] = $(this).find("Message").text()
					responsereportFail[len][3] = '' //for details but in disallowed we will not see details
					responsereportFail[len][4] = $(this).find("Source").text()
			}
			)
			$(xml).find("Error").each(function ()
			{
				len = responsereportFail.length
					responsereportFail[len] = new Array(5);
				responsereportFail[len][0] = '--'
					responsereportFail[len][1] = 'Error'
					responsereportFail[len][2] = $(this).find("Message").text()
					responsereportFail[len][3] = $(this).find("Details").text()
					responsereportFail[len][4] = $(this).find("Source").text()
			}
			)
			if (responsereportFail.length > 0)
			{
				amb_narxcheck_failed_response(responsereportFail)
			}
		}
		catch (err)
		{
			//create POST fail banner box on modal
			MP_ModalDialog.deleteModalDialogObject("failereportmodal")
			var failedReportModalobj = new ModalDialog("failereportmodal")
				.setHeaderTitle('<span>PMP Connectivity Information</span>')
				.setTopMarginPercentage(35)
				.setRightMarginPercentage(30)
				.setBottomMarginPercentage(35)
				.setLeftMarginPercentage(30)
				.setIsBodySizeFixed(true)
				.setHasGrayBackground(true)
				.setIsFooterAlwaysShown(true);
			failedReportModalobj.setBodyDataFunction(
				function (modalObj)
			{
				modalObj.setBodyHTML('<span class="amb_narxcheck_report_http_fail" id="amb_narxcheck_report_http_id' + narxcheckCompId + '">' + reportdata + '</span>');
			}
			);
			var okbtn = new ModalButton("failereportmodal");
			okbtn.setText("OK").setCloseOnClick(true);
			failedReportModalobj.addFooterButton(okbtn)
			MP_ModalDialog.addModalDialogObject(failedReportModalobj);
			MP_ModalDialog.showModalDialog("failereportmodal")
		}
	}

	/*
	 * @function to handle banner box (advisory ,mandatory review and error banner box)
	 * @param {string} messageHTMLID : index of HTML div ID which contain banner information
	 * @param {string} alertbannerType : index of div css id which seperate mandatory review vs advisory  vs error banner
	 * @param {string} primaryText : bold text primary text information
	 * @param {string} SecondaryText : secondary text information
	 * @param {string} buttonID : index for buttonID for advisory  banner
	 */
	function amb_narxcheck_banner_box(messageHTMLID, alertbannerType, primaryText, SecondaryText, buttonID)
	{
		//Grab a sample container
		var $container = $("#" + messageHTMLID);
		//Render the alert banner into the container
		var bannerHTML = "";
		bannerHTML = "<div id='" + messageHTMLID + "' class='narxcheck_alert-msg'>";
		bannerHTML += "<div class = '" + alertbannerType + "'>";
		if (alertbannerType === 'narxcheck_advisory-msg')
		{
			var buttonnarxcheck = "";
			buttonnarxcheck = "<button type='button' id=" + buttonID + " class='narxcheck_btn'>" + SecondaryText + "</button>"
				if (primaryText != "")
				{
					bannerHTML += "<div class='narxcheck_alert_advistory-info' title=" + primaryText + "><span class='narxcheck_alert-icon'>&nbsp;</span>" + primaryText + "</div>";
				}
				if (SecondaryText != "")
				{
					bannerHTML += "<div class='narxcheck_alert_advistory-sec-info'>" + buttonnarxcheck + "</div>";
				}
				bannerHTML += "<div style='clear: both;'></div>"
		}
		else
		{
			if (primaryText != "")
			{
				bannerHTML += "<div class='narxcheck_alert-info'><span class='narxcheck_alert-icon'>&nbsp;</span>" + primaryText
			}
			if (SecondaryText != "")
			{
				bannerHTML += "<span class='narxcheck_alert-msg-secondary-text'>&nbsp;" + SecondaryText + "</span></div>";
			}
		}
		bannerHTML += '</div></div>'
		$container.append(bannerHTML);
		//add tooltip to advistory layout
		$(".narxcheck_alert_advistory-info").attr("title", primaryText)
	}

	/*
	 * @function to handle score HTML render
	 * @param {string} Narcotics :value of Narcotics score
	 * @param {string} Sedatives :value of Sedatives score
	 * @param {string} Stimulants :value of Stimulants score
	 */
	function amb_narxcheck_PDMP_Score_HTML(Narcotics, Sedatives, Stimulants)
	{
		narxcheckscoreHTML.push('<div class="' + amb_narxcheck_score_class_check(Narcotics) + '_div amb_narxcheck_Narcotics_style" id="' + amb_narxcheck_score_class_check(Narcotics) + '_div_id' + narxcheckCompId + '">',
			'<dl class="' + amb_narxcheck_score_class_check(Narcotics) + '_number amb_narxcheck_score-number-style">' + Narcotics + '</dl>',
			'<dl class="' + amb_narxcheck_score_class_check(Narcotics) + '_score amb_narxcheck_score-style">Narcotics</dl>',
			'</div>')
		narxcheckscoreHTML.push('<div class="' + amb_narxcheck_score_class_check(Sedatives) + '_div amb_narxcheck_Sedatives_style" id="' + amb_narxcheck_score_class_check(Sedatives) + '_div_id' + narxcheckCompId + '">',
			'<dl class="' + amb_narxcheck_score_class_check(Sedatives) + '_number amb_narxcheck_score-number-style">' + Sedatives + '</dl>',
			'<dl class="' + amb_narxcheck_score_class_check(Sedatives) + '_score amb_narxcheck_score-style">Sedatives</dl>',
			'</div>')
		narxcheckscoreHTML.push('<div class="' + amb_narxcheck_score_class_check(Stimulants) + '_score_div amb_narxcheck_Stimulants_style" id="' + amb_narxcheck_score_class_check(Stimulants) + '_div_id' + narxcheckCompId + '">',
			'<dl class="' + amb_narxcheck_score_class_check(Stimulants) + '_number amb_narxcheck_score-number-style">' + Stimulants + '</dl>',
			'<dl class="' + amb_narxcheck_score_class_check(Stimulants) + '_score amb_narxcheck_score-style">Stimulants</dl>',
			'</div>')
		$("#narxcheck_score_id" + narxcheckCompId).html(narxcheckscoreHTML.join(""))
		$("#narxcheck_score_id" + narxcheckCompId).addClass("narxcheck_score_class")
	}

	/*
	 * @function to handle view drug report hyperlink HTML and saved to chart message
	 */
	function amb_narxcheck_PDPM_Report_Link_HTML()
	{
		//if med list view is not on
		if (medListInd !== 1)
		{
			var actiondate = new Date();
			if (ambnarxcheckmainObj.RECORD_DATA.ACTION_DT != '--')
			{
				actiondate.setISO8601(ambnarxcheckmainObj.RECORD_DATA.ACTION_DT);
				var actionUTCdate = actiondate.format("MM/dd/yy");
				var actionUTCtime = actiondate.format("h:MM TT");
			}
			else
			{
				var actionUTCdate = "--"
			}
		}
		reportHTML.push('<dl class="amb_narxcheck_report_row"><a title="View Report" id="amb_narxcheck_report_ID' + narxcheckCompId + '" class="amb_narxcheck_drug_report_link amb_narxcheck_drug_report_text">View Drug Report</a></dl>')
		//if action date is not there then no need for display
		if (ambnarxcheckmainObj.RECORD_DATA.PRSNL_NAME != "" && ambnarxcheckmainObj.RECORD_DATA.ACTION_DT != "--")
		{
			reportHTML.push('<dl class="amb_narxcheck_report_saved_msg"><span class="amb_narxcheck_report_saved_msg_text">Last saved to record',
				'</span>&nbsp;<span class="amb_narxcheck_report_saved_msg_text">by ' + ambnarxcheckmainObj.RECORD_DATA.PRSNL_NAME + ' on ' + actionUTCdate + ' at ' + actionUTCtime + '</span>&nbsp;&nbsp<a id="narxcheck-adv_btn_save' + narxcheckCompId + '" class="amb_narxcheck_saved_again">Save again</a></dl>')
		}
		$("#narxcheck_score_report_url_id" + narxcheckCompId).html(reportHTML)
		$("#narxcheck_score_report_url_id" + narxcheckCompId).addClass("narxcheck_score_report_url_class")
	}

	/*
	 * @function to create modal to handle fail response
	 * @param {string} responseFail :hold value of all failed response state information
	 */
	function amb_narxcheck_failed_response(responseFail)
	{
		MP_ModalDialog.deleteModalDialogObject("faileresponsemodal")
		var responseFailHTML = [];
		var amb_narxcheck_failed_stripe_class = "";
		var responsefailindex = 0;
		responseFailHTML.push('<dl class="amb_narxcheck_response_fail_header">',
			'<dt class="amb_narxcheck_response_fail_PMP amb_narxcheck_response_fail_header_font amb_narxcheck_border_right">PMP</dt>',
			'<dt class="amb_narxcheck_response_fail_Details amb_narxcheck_response_fail_header_font amb_narxcheck_border_right">Details</dt>',
			'<dt class="amb_narxcheck_response_fail_Source amb_narxcheck_response_fail_header_font">Source</dt>',
			'</dl>');
		//iterate through fail response array to make sure we display all PMP state fail information
		for (var i = 0; i < responseFail.length; i++)
		{
			responsefailindex = responsefailindex + 1;
			if (responsefailindex % 2 == 0)
			{
				amb_narxcheck_failed_stripe_class = "amb_narxcheck_failed_response_stripe_even_class";
			}
			else
			{
				amb_narxcheck_failed_stripe_class = "amb_narxcheck_failed_response_stripe_odd_class";
			}
			//check messagevsdetails text
			if (responseFail[i][3] != '')
			{
				var detailsInfo = ',&nbsp;<span class="amb_narxcheck_msg_style">Details:</span> ' + responseFail[i][3]
					var titledisp = 'Message:' + responseFail[i][2] + 'Details:' + responseFail[i][3]
			}
			else
			{
				var detailsInfo = ''
					var titledisp = 'Message:' + responseFail[i][2];
			}
			//create title to hold entire value
			responseFailHTML.push('<dl class="amb_narxcheck_response_fail_content ' + amb_narxcheck_failed_stripe_class + '">',
				'<dt class="amb_narxcheck_response_fail_PMP">' + responseFail[i][0] + '</dt>',
				'<dt class="amb_narxcheck_response_fail_Details" title="' + titledisp + '">' + responseFail[i][1] + ', &nbsp;<span class="amb_narxcheck_msg_style">Message:</span> ' + responseFail[i][2] + '' + detailsInfo + '</dt>',
				'<dt class="amb_narxcheck_response_fail_Source">' + responseFail[i][4] + '</dt>',
				'</dl>');
		}
		var failedModalobj = new ModalDialog("faileresponsemodal")
			.setHeaderTitle('<span>PMP Connectivity Information</span>')
			.setTopMarginPercentage(25)
			.setRightMarginPercentage(20)
			.setBottomMarginPercentage(25)
			.setLeftMarginPercentage(20)
			.setIsBodySizeFixed(true)
			.setHasGrayBackground(true)
			.setIsFooterAlwaysShown(true);
		failedModalobj.setBodyDataFunction(
			function (modalObj)
		{
			modalObj.setBodyHTML(responseFailHTML.join("")); //display all failed response in modal
		}
		);
		var okbtn = new ModalButton("faileresponsemodal");
		okbtn.setText("OK").setCloseOnClick(true);
		failedModalobj.addFooterButton(okbtn)
		MP_ModalDialog.addModalDialogObject(failedModalobj);
		MP_ModalDialog.showModalDialog("faileresponsemodal")
	}

	/*
	 * @function to handle css color changes base on ranges (low/high/moderate)
	 * @param {string} score :score value
	 */
	function amb_narxcheck_score_class_check(score)
	{
		var returnclass = ""
			switch (true)
			{
			case (score <= 200):
				returnclass = "amb_narxcheck_low_risk";
				break;
			case (score >= 200 && score <= 500):
				returnclass = "amb_narxcheck_moderate_risk";
				break;
			case (score >= 500):
				returnclass = "amb_narxcheck_higher_risk";
				break;
			}
			return returnclass
	}

	/*
	 * @function to handle CCL call for all service
	 * @param {string} program :contain value of program name
	 * @param {Array} ReqParam :Array contain required promot varaible (patientID,encounter ID,user ID etc)
	 * @param {string} async : contain true or false value
	 * @param {string} callback :callback function to render
	 */
	function AMB_CCL_Request_Reply(program, ReqParam, async, callback)
	{
		var info = new XMLCclRequest();
		info.onreadystatechange = function ()
		{
			if (info.readyState == 4 && info.status == 200)
			{
				var jsonEval = ambJSONParse(this.responseText, program);
				var recordData = jsonEval.RECORD_DATA;
			    callback.call(recordData);
				//log request and reply in blackbird
			    if (typeof BlackBirdLogger !== "undefined" && CERN_Platform.inMillenniumContext() == true) {
					//log request XML 					
	                var blackbirdRequest = '<textarea rows="26"  cols="60" style="font:11px/1.3 Consolas,Lucida Console,Monaco,monospace;overflow-y:auto;border:none;color:#DDD;background-color: transparent;">' + recordData.REQUEST_XML + '</textarea>';
				    BlackBirdLogger.prototype.logMessage(["Component: ", (component ? component.getLabel() : ""), "<br />ID: ", (component ? component.getComponentId() : ""), "<br />reqestXML: " + blackbirdRequest].join(""))
				    //log response code and other response body
				    var blackbirdResponse = '<textarea rows="26"  cols="60" style="font:11px/1.3 Consolas,Lucida Console,Monaco,monospace;border:none;color:#DDD;background-color: transparent;">' + recordData.RESPONSEBODY + '&#13;&#10;Credentials Info:'+recordData.CRED_INFO+'&#13;&#10;Request URI:'+recordData.REQUESTURI+'&#13;&#10;HTTP status code:'+recordData.RESPONSECODE+'</textarea>';			
					BlackBirdLogger.prototype.logMessage(["Component: ", (component ? component.getLabel() : ""), "<br />ID: ", (component ? component.getComponentId() : ""), "<br />Service Name: ",recordData.SERVICE_NAME, "<br />Reply XML: " + blackbirdResponse].join(""))								
				}
			}
		};
		info.open('GET', program, async);
		info.send(ReqParam.join(","));
	}

	/*
	 * @function to handle CCL call to insert clinical event results(Score) into millenium
	 * @param {string} program :contain value of program name
	 * @param {Array} ReqParam :Array contain required promot varaible (patientID,encounter ID,user ID,score etc)
	 * @param {string} async : contain true or false value
	 * @param {string} callback :callback function to render
	 */
	function AMB_CCL_Insert_Score_Clinical_Event(program, cereultParam, async, callback)
	{
		var info = new XMLCclRequest();
		info.onreadystatechange = function ()
		{
			if (info.readyState == 4 && info.status == 200)
			{
				var jsonEval = ambJSONParse(this.responseText, program);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS === "S")
				{
					callback.call(recordData);
				}
				else
				{
					var error_text = "Failed Status: " + this.status + " Request Text: " + this.requestText;
					MP_ModalDialog.deleteModalDialogObject("amberrormodal")
					var amberrorModalobj = new ModalDialog("amberrormodal")
						.setHeaderTitle('<span class="amb_narxcheck_alert">Failed Information</span>')
						.setTopMarginPercentage(20)
						.setRightMarginPercentage(35)
						.setBottomMarginPercentage(30)
						.setLeftMarginPercentage(35)
						.setIsBodySizeFixed(true)
						.setHasGrayBackground(true)
						.setIsFooterAlwaysShown(true);
					amberrorModalobj.setBodyDataFunction(
						function (modalObj)
					{
						modalObj.setBodyHTML('<div style="padding-top:10px;"><p class="pwx_small_text">Script failed to insert score Information. ' + error_text + '</p></div>');
					}
					);
					var closebtn = new ModalButton("addCancel");
					closebtn.setText("OK").setCloseOnClick(true);
					amberrorModalobj.addFooterButton(closebtn)
					MP_ModalDialog.addModalDialogObject(amberrorModalobj);
					MP_ModalDialog.showModalDialog("amberrormodal")
				}
			}
		};
		info.open('GET', program, async);
		info.send(cereultParam.join(","));
	}

	/*
	 * @function Create promt input for ccl script when there are multiple value possible in one parameter.
	 * @param {Array} ar : The ar array contains promt .
	 * @param {string} type : The type string contains 1 or o to identify when to append .00 at the end.
	 */
	function CreateParamArray(ar, type)
	{
		var returnVal = (type === 1) ? "0.0" : "0";
		if (ar && ar.length > 0)
		{
			if (ar.length > 1)
			{
				if (type === 1)
				{
					returnVal = "value(" + ar.join(".0,") + ".0)";
				}
				else
				{
					returnVal = "value(" + ar.join(",") + ")";
				}
			}
			else
			{
				returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
			}
		}
		return returnVal;
	}

	/*
	 * @function clean bad characters from JSON so it parses successfully
	 * @param {string} json_parse : json string to parse
	 * @param {string} program: program json came from
	 */
	function ambJSONParse(json_parse, program)
	{
		//preserve newlines, etc - use valid JSON
		json_parse = json_parse.replace(/\\n/g, "\\n")
			.replace(/\\'/g, "\\'")
			.replace(/\\"/g, '\\"')
			.replace(/\\&/g, "\\&")
			.replace(/\\r/g, "\\r")
			.replace(/\\t/g, "\\t")
			.replace(/\\b/g, "\\b")
			.replace(/\\f/g, "\\f");
		// remove non-printable and other non-valid JSON chars
		json_parse = json_parse.replace(/[\u0000-\u0019]+/g, "");
		try
		{
			json_parse = JSON.parse(json_parse)
				return json_parse;
		}
		catch (err)
		{
			alert(err.message + " in Program Name: " + program)
		}
	}

	/*
	 * @function This function call when Multiple state license/DEA  numbers found and NPI or DEA number are not on record.
	 * @param {string} displaystring : displaystring either DEA or License number
	 * @param {string} user_lnumber : contain alias information for dea or license number.
	 */
	function amb_multi_DEA_State_License_info(displaystring, user_lnumber)
	{
		var amb_narxcheck_prov_info_HTML = [];
		var amb_narcheck_lnumber_info_HTML = "";
		for (var i = 0; i < user_lnumber.length; i++)
		{
			if (i === 0)
			{
				amb_narcheck_lnumber_info_HTML += '<option selected>' + user_lnumber[i] + '</option>';
			}
			else
			{
				amb_narcheck_lnumber_info_HTML += '<option>' + user_lnumber[i] + '</option>';
			}
		}
		//create dropdown list for dea or license number list
		amb_narxcheck_prov_info_HTML.push("<div class='amb_narxcheck_prov_alias' id='amb_narxcheck_prov_alias_exiting" + narxcheckCompId + "'>",
			"<dt class='ambnarxcheckradiobuttonlbl'><input id='ambnarxcheckradioext" + narxcheckCompId + "'checked='true' type='radio' name='rxradiolbl' value='extradio'></input></dt>",
			"<label class='amb_narxcheck_lbl_statemodal'>Existing</label>",
			"<select class='amb_narxcheck_paliaexist_class' id='amb_narxcheck_paliaexist_id" + narxcheckCompId + "'>",
			amb_narcheck_lnumber_info_HTML,
			"</select></div>",
			"<div class='amb_narxcheck_prov_alias' id='amb_narxcheck_prov_alias_other" + narxcheckCompId + "'>",
			"<dt class='ambnarxcheckradiobuttonlbl'><input id='ambnarxcheckradioother" + narxcheckCompId + "' type='radio' name='rxradiolbl' value='otherradio'></input></dt>",
			"<label class='amb_narxcheck_lbl_statemodal'>Other</label>",
			"<input type='text' id='amb_narxcheck_palia_other" + narxcheckCompId + "' class='amb_narxcheck_palia_otherclass'></input>",
			"</div></div>");
		amb_narxcheck_prov_info_HTML.push("");
		MP_ModalDialog.deleteModalDialogObject("ambmultidealicemodal")
		var ambmultidealiceModalobj = new ModalDialog("ambmultidealicemodal")
			.setHeaderTitle('Provider Information Needed')
			.setTopMarginPercentage(30)
			.setRightMarginPercentage(32)
			.setBottomMarginPercentage(30)
			.setLeftMarginPercentage(32)
			.setIsBodySizeFixed(true)
			.setHasGrayBackground(true)
			.setIsFooterAlwaysShown(true);
		ambmultidealiceModalobj.setBodyDataFunction(
			function (modalObj)
		{
			modalObj.setBodyHTML(amb_narxcheck_prov_info_HTML.join(""));
			var ambnarxcheckradioext = $("#ambnarxcheckradioext" + narxcheckCompId);
			var amb_narxcheck_paliaexist_id = $("#amb_narxcheck_paliaexist_id" + narxcheckCompId);
			var ambnarxcheckradioother = $("#ambnarxcheckradioother" + narxcheckCompId);
			var amb_narxcheck_palia_other = $("#amb_narxcheck_palia_other" + narxcheckCompId);
			ambnarxcheckradioother.css('opacity', '.2');
			amb_narxcheck_palia_other.css('opacity', '.2');
			amb_narxcheck_palia_other.attr('readonly', true);
			//check for selection between existing and other box
			var checkboxes;
			checkboxes = $('input[name^=rxradiolbl]').change(function ()
				{
					if (this.checked)
					{
						checkboxes.not(this).prop('checked', false);
						if ($(this).val() === "extradio")
						{
							ambnarxcheckradioext.css('opacity', '')
							amb_narxcheck_paliaexist_id.css('opacity', '');
							amb_narxcheck_paliaexist_id.attr('disabled', false);
							ambnarxcheckradioother.css('opacity', '.2');
							amb_narxcheck_palia_other.css('opacity', '.2');
							amb_narxcheck_palia_other.attr('readonly', true);
						}
						else
						{
							ambnarxcheckradioother.css('opacity', '');
							amb_narxcheck_palia_other.css('opacity', '');
							amb_narxcheck_palia_other.attr('readonly', false);
							ambnarxcheckradioext.css('opacity', '.2')
							amb_narxcheck_paliaexist_id.css('opacity', '.2');
							amb_narxcheck_paliaexist_id.attr('readonly', true);
							amb_narxcheck_paliaexist_id.prop('disabled', 'disabled');
						}
					}
				}
				);
		}
		);
		var closebtn = new ModalButton("addCancel");
		closebtn.setText("Cancel").setCloseOnClick(true);
		var submitbtn = new ModalButton("addsubmitbutton");
		submitbtn.setText("Submit").setCloseOnClick(true).setOnClickFunction(function ()
		{
			var finalaliassend = "";
			var ambnarxcheckradioext = $("#ambnarxcheckradioext" + narxcheckCompId);
			var amb_narxcheck_paliaexist_id = $("#amb_narxcheck_paliaexist_id" + narxcheckCompId);
			var ambnarxcheckradioother = $("#ambnarxcheckradioother" + narxcheckCompId);
			var amb_narxcheck_palia_other = $("#amb_narxcheck_palia_other" + narxcheckCompId);
			if (ambnarxcheckradioext.is(":checked") == true)
			{
				var amb_narxcheck_existing_val = amb_narxcheck_paliaexist_id.val()
					finalaliassend = amb_narxcheck_existing_val
			}
			else
			{
				var amb_narxcheck_othermodal_val = amb_narxcheck_palia_other.val()
					if (amb_narxcheck_othermodal_val !== "")
					{
						var amb_narxcheck_othermodal_val = amb_narxcheck_palia_other.val()
							finalaliassend = amb_narxcheck_othermodal_val
					}
					else
					{
						MP_ModalDialog.deleteModalDialogObject("missingselectionmodal")
						var missingselectionModalobj = new ModalDialog("missingselectionmodal")
							.setHeaderTitle('<span>Provider Information Needed</span>')
							.setTopMarginPercentage(35)
							.setRightMarginPercentage(30)
							.setBottomMarginPercentage(35)
							.setLeftMarginPercentage(30)
							.setIsBodySizeFixed(true)
							.setHasGrayBackground(true)
							.setIsFooterAlwaysShown(true);
						missingselectionModalobj.setBodyDataFunction(
							function (modalObj)
						{
							modalObj.setBodyHTML("<span class='amb_narxcheck_report_http_fail'>Please provide " + displaystring + " number to access state's prescription monitoring program</span>");
						}
						);
						var okbtn = new ModalButton("missingselectionmodal");
						okbtn.setText("OK").setCloseOnClick(true);
						missingselectionModalobj.addFooterButton(okbtn)
						MP_ModalDialog.addModalDialogObject(missingselectionModalobj);
						MP_ModalDialog.showModalDialog("missingselectionmodal")
					}
			}
			if (finalaliassend != "")
			{
				if (displaystring === 'DEA')
				{
					scoreParam[8] = "^" + finalaliassend + "^"
						reportSendDEA = finalaliassend
				}
				else
				{
					scoreParam[9] = "^" + finalaliassend + "^"
						reportSendLice = finalaliassend
				}
				//call narxcheck service once dea or license number selected and modal is closed
				$('#narxcheck_review_id' + narxcheckCompId).html('<div id="amb_narcheck_loadingdiv' + narxcheckCompId + '" class="amb_narcheck_loadingdivclass"><span class="amb_narcheck-spinner"></span>' + loading_msg + '</div>');
				AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", scoreParam, true, function ()
				{
					var sucessbody = this.RESPONSEBODY
						var rolename = this.ROLE_NAME
						RenderResponseHTML(sucessbody, rolename, useralias);
				}
				);
			}
		}
		);
		ambmultidealiceModalobj.addFooterButton(submitbtn)
		ambmultidealiceModalobj.addFooterButton(closebtn)
		MP_ModalDialog.addModalDialogObject(ambmultidealiceModalobj);
		MP_ModalDialog.showModalDialog("ambmultidealicemodal")
	}
}

/* Prescription Drug Monitoring (PMP) custom component end here */
