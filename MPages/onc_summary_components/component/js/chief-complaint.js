/**
 * Chief Complaint component
 * =========================
 *
 * A component in the Acute Workflow  that displays  the chief complaint for the
 * current visit. It has an �Add� button  that will either display a chart or an
 * iView band, per bedrock configuration. A drop down menu is provided where the
 * client can specify forms to be accessed from the component.
 *
 * @author Leonardo Sa
 * 
 */

// ============================================================================
// Class definitions
// ============================================================================

function ChiefComplaintComponentStyle() {
	this.initByNamespace("chief");
}

ChiefComplaintComponentStyle.inherits(ComponentStyle);

// ____________________________________________________________________________

function ChiefComplaintComponent(criterion) {
	// ------------------------------------------------------------------------
	// Public Member variables
	// ------------------------------------------------------------------------

	/**
	 * the name of the iview band to be displayed when openIview is called.
	 * Is set through a bedrock filter mapping
	 */
	ChiefComplaintComponent.createAttribute("IviewBand", "");

	/**
	 * the name of the iview section to be displayed when openIview is called.
	 * Is set through a bedrock filter mapping
	 */
	ChiefComplaintComponent.createAttribute("IviewSection", "");

	/**
	 * the name of the iview item to be displayed when openIview is called.
	 * Is set through a bedrock filter mapping
	 */
	ChiefComplaintComponent.createAttribute("IviewItem", "");

	/**
	 * the array of clinical event sets which the component will use to get
	 * the complaint.
	 */
	ChiefComplaintComponent.createAttribute("ClinicalEventSets", []);

	/**
	 * the array of clinical event codes which the component will use to get
	 * the complaint.
	 */
	ChiefComplaintComponent.createAttribute("ClinicalEventCodes", []);

	/**
	 * Whether the add button will show an iView or ad-hoc charting
	 */
	ChiefComplaintComponent.method("setIViewAdd", function(value) {
		this.m_iViewAdd = value;
	});

	ChiefComplaintComponent.method("isIViewAdd", function() {
		return (this.m_iViewAdd);
	});

	// ------------------------------------------------------------------------
	// Component settings
	// ------------------------------------------------------------------------
	this.setHasActionsMenu(true);
	this.setCriterion(criterion);
	this.setStyles(new ChiefComplaintComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.CHIEF_COMPLAINT.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.CHIEF_COMPLAINT.O1 - render component");
	this.setLookBackDropDown(true);
	this.setScope(2);
	
	// ---------------- Privleges settings -------------------------------------
	this.m_isCompViewable = true;
	this.m_isCompAddable= true;
	this.m_isCompSignable = true;
	this.m_isCompModifiable = true;

	// Capability timers
	window.cc_mpage=criterion.category_mean;

	// ------------------------------------------------------------------------
	// Methods
	// ------------------------------------------------------------------------
	ChiefComplaintComponent.method("HandleSuccess", function(data) {
		CERN_CHIEF_COMPLAINT_O1.RenderComponent(this, data);
	});

	ChiefComplaintComponent.method("InsertData", function() {
		CERN_CHIEF_COMPLAINT_O1.LaunchCompThreads(this);
	});

	ChiefComplaintComponent.method("openDropDown", function(formID) {
		CERN_CHIEF_COMPLAINT_O1.openDropDown(this, formID);
	});

	ChiefComplaintComponent.method("openTab", function() {
		CERN_CHIEF_COMPLAINT_O1.openTab(this);
	});

	ChiefComplaintComponent.method("openIView", function() {
		CERN_CHIEF_COMPLAINT_O1.openIView(this);
	});

	ChiefComplaintComponent.method("setModifyInd",function(value){this.m_modifyInd=(value==1?true:false);
	});
	
	ChiefComplaintComponent.method("getModifyInd",function(){return this.m_modifyInd;
	});
}

ChiefComplaintComponent.inherits(MPageComponentInteractive);


// ============================================================================
// Implementation
// ============================================================================

/**
 * @namespace
 */
var CERN_CHIEF_COMPLAINT_O1 = (function($) {

	// ============================================================================
	// Utility - shortcut - private functions
	// ============================================================================

	/**
	 * Shortcut for MP_Util.LogMpagesEventInfo
	 */
	function mpLog(eventName, params, method) {
		MP_Util.LogMpagesEventInfo(null, eventName, params, "chief-complaint.js", method);
	}

	// ____________________________________________________________________________

	/**
	 * Shortcut for the MPAGES_EVENT function. It also does logging for us.
	 */
	function mpEvent(eventName, params, method) {
		MPAGES_EVENT(eventName, params);
		mpLog(eventName, params, method);
	}

	// ____________________________________________________________________________

	/**
	 * Shortcut
	 */
	function mpError(error, method) {
		MP_Util.LogJSError(error, null, "chief-complaint.js", method);
	}

	// ============================================================================
	// Private functions
	// ============================================================================

	/**
	 * Makes a "value()" list of params for CCL
	 */
	function makeParams(list) {
		if(!list.length) {
			return "0.0";
		}

		if(list.length == 1) {
			return list[0] + ".0";
		}

		var parms = MP_Util.CreateParamArray(list);
		$.each(parms, function(i, v) {
			parms[i] = parms[i] + ".0";
		});
		return parms;
	}

	// ____________________________________________________________________________

	/**
	 * Returns an object with two attributes - date and text -, that represents
	 * the document provided through the json parameter.
	 */
	function makeDocument(jsonDoc, prsnlList) {
		var doc = {
			date: new Date(),
			text: jsonDoc.TITLE,
			fullName: fullName(prsnlList, jsonDoc.ACTION_PROVIDERS[0].PRSNL_ID)
		};

		doc.date.setISO8601(jsonDoc.EFFECTIVE_DATE);

		return doc;
	}

	// ____________________________________________________________________________

	/**
	 * Returns an object with two attributes - date and text -, that represents
	 * the measurement provided through the json parameter.
	 */
	function makeMeasurement(jsonDoc, jsonCodes, prsnlList) {
		var mpMeasurement = new MP_Core.Measurement();
		mpMeasurement.initFromRec(jsonDoc, jsonCodes);

		var mes = {
			date: new Date(mpMeasurement.getDateTime()),
			text: mpMeasurement.getResult().toString() + " " + mpMeasurement.getComment(),
			fullName: fullName(prsnlList, jsonDoc.PRSNL_ID)
		};

		return mes;
	}
	
	function fullName(prsnlList, prsnlId) {
		var result = "";
		
		// finds the personnel inside the list, and sets
		// result with its full name
		$.each(prsnlList, function() {
		   if (this.ID == prsnlId) {
			   result = this.PROVIDER_NAME.NAME_FULL;
			   return;
		   } 
		});
		
		return result;
	}

	// ____________________________________________________________________________

	/**
	 * Makes either a Document or a Measurement object based on the provided
	 * recordData. Will select the record with the most recent date.
	 */
	function getMostRecentChiefComplaint(recordData) {  

		var documents = [];
		var chiefComplaint;

		// cycle through each result
		$.each(recordData.RESULTS, function(k, result) {
			// cycle through each clinical event
			$.each(result.CLINICAL_EVENTS, function(k, clinicalEvent) {

				// cycle through each document
				$.each(clinicalEvent.DOCUMENTS, function(k, doc) {
					chiefComplaint = makeDocument(doc, recordData.PRSNL);
					if (chiefComplaint) {
						documents.push(chiefComplaint);
					}
				});

				// cycle through each measurement
				$.each(clinicalEvent.MEASUREMENTS, function(k, measurement) {
					chiefComplaint = makeMeasurement(measurement, recordData.CODES, recordData.PRSNL);
					if(chiefComplaint) {
						documents.push(chiefComplaint);
					}
				});
			});
		});

		var selectedDoc = false;

		// cycles through all the records, comparing their dates
		$.each(documents, function(index, doc) {
			if(!selectedDoc || doc.date > selectedDoc.date) {
				selectedDoc = doc;
			}
		});

		return selectedDoc;
	}
	// ============================================================================
	// Member Methods
	// ============================================================================

	return {
		
		/**
		 * Launch Threads
		 */
		LaunchCompThreads: function(component) {
			var mgr = new MP_Core.XMLCCLRequestThreadManager(CERN_CHIEF_COMPLAINT_O1.RenderComponent, component, false);
			var thread = null;
			 
			// ----------------- create the privs thread
			var cc_eventSetCode = component.getClinicalEventSets();
			var ccEventSetCdArr = [cc_eventSetCode];
			var criterion = component.getCriterion();
			var paramEventSetCd = MP_Util.CreateParamArray(cc_eventSetCode, 1);
			var paramPrivMask = component.getCompPrivMask();
			var sendAr = ["^MINE^", criterion.provider_id + ".0", "0.0", paramEventSetCd,paramPrivMask, criterion.ppr_cd + ".0"];
			var request = new MP_Core.ScriptRequest(component, "ENG:MPG.MPCINTERACTIVE - Get Doc prefs");
			request.setParameters(sendAr);
			request.setName("getCompPrivs");
			request.setProgramName("MP_GET_PRIVS_WRAPPER");  
			request.setAsync(true);
			thread = new MP_Core.XMLCCLRequestThread("GetEventCodePrivs", component, request);
			mgr.addThread(thread);
			
			// ---------------- create the data retrieval thread
			var paramsDict = {
				"Output": "^MINE^",
				"Person Id": criterion.person_id + ".0",
				"Encounter Id": criterion.encntr_id + ".0",
				"Personnel id": criterion.provider_id + ".0",
				"Provider patient rel": criterion.ppr_cd + ".0",
				"Number of Results": 1,
				"Event set names": "^^",
				"Event set codes": makeParams(component.getClinicalEventSets()),
				"Event codes": makeParams(component.getClinicalEventCodes()),
				"Lookback units": 0,
				"Lookback unit type": 1,
				"Include Event Set Info:": 0,
				"Begin Date/Time:": "^^",
				"End Date/Time:": "^^",
				"Include Comments:": 0,
				"Ignore Group Ind:": 0, 
				"Include Measurement Personnel": 1,
				"isChiefComplaint": 1
			};

			// put the params into a sequential array
			var paramsArray = [];
			$.each(paramsDict, function(key, value) {
				paramsArray.push(value);
			});            

			sendAr=[];
			sendAr.push("^MINE^",criterion.person_id + ".0",criterion.encntr_id + ".0", criterion.provider_id + ".0",criterion.ppr_cd + ".0", 1, "^^", makeParams(component.getClinicalEventSets()),makeParams(component.getClinicalEventCodes()), 0 ,1 , 0, "^^" , "^^" , 0 , 0, 1, 1);
			request=new MP_Core.ScriptRequest(component,component.getComponentLoadTimerName());
			request.setProgramName("MP_RETRIEVE_N_RESULTS_JSON");   
			request.setParameters(paramsArray);
			request.setAsync(true);
			thread = new MP_Core.XMLCCLRequestThread("GetRecentChiefComplaint", component, request);
			mgr.addThread(thread);
			
			// Launch threads 
			mgr.begin();
		},
		
		/**
		 * Creates the HTML of the component
		 *
		 * @param ChiefComplaintComponent.Document the document to be rendered
		 */
		RenderComponent: function(replyAr) {
			var privsReply;
			var recordDataChiefComplaint;
			var recordDataPrivs;
			var component = replyAr[0].getComponent();
			var privsLoaded = false;
			var resultsLoaded = false;
			var compId = component.m_componentId;
			var chiefcomplaintI18N = i18n.discernabu.chief_complaint;

			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
			try {

				for (var repCnt = replyAr.length; repCnt--; ) {
					var reply = replyAr[repCnt];
					var repStatus = reply.getStatus();
					switch (reply.getName()) {
						case "GetEventCodePrivs" :
							privsLoaded = true;
							recordDataPrivs = reply.getResponse();
							break;
						case "GetRecentChiefComplaint":
							resultsLoaded = true;
							recordDataChiefComplaint = reply.getResponse();
							break;
					}

				}

				if (!(privsLoaded && resultsLoaded)) {
					return;
				}

				if (recordDataChiefComplaint && recordDataChiefComplaint.STATUS_DATA.STATUS != "Z") {
					var doc = getMostRecentChiefComplaint(recordDataChiefComplaint);
				}

				var target = $("<div></div>");
				var nullDoc = false;

				// If no primitive events set are added then show error retrieving results
				if (recordDataChiefComplaint && recordDataChiefComplaint.STATUS_DATA.STATUS === "F") {
					nullDoc = true;
					var errMsg = [];
					errMsg.push(i18n.ERROR_RETREIVING_DATA);
					MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), component, "(0)");
					return;
				}
				else {
					// Check for view privs; if no view privs then show no results found and return
					if (recordDataPrivs.ISVIEWABLE === 0) {
						MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
						return;
					}
					else {
						if (recordDataChiefComplaint.STATUS_DATA.STATUS === "Z") {
							// If no chief complaint has been added and the user does not have add,modify,sign privs then show No results found else enable add
							if (recordDataPrivs.ISADDABLE === 1 && recordDataPrivs.ISEDITABLE === 1 && component.m_modifyInd) {
								var spanElement = $("<span id='complaintSpan" + compId + "' class='chief_compl_enter_text chief_compl_textonly'></span>").html(chiefcomplaintI18N.ENTER_CHIEF_COMPLAINT);
							}
							else {
								MP_Util.Doc.FinalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), component, countText);
								return;
							}
						}
						else {
							//generates the span with the text
							var spanElement = $("<span id = 'complaintSpan" + compId + "' class='chief_compl_textonly'></span>").html(doc.text);
							var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
							var dateStr = dateFormatter.format(doc.date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
						}
					} // end of privs check

				}// end of primitive event set added check

				var outerDivElement = $("<div id='outerDiv" + compId + "' class='chief_compl_outer_div'></div>");
				$(target).append(outerDivElement);

				//Generates the element body and appends the span with the text
				var textElement = $("<div id='textDiv" + compId + "'></div>").addClass("chief_compl_text").append(spanElement);
				$(outerDivElement).append(textElement);

				var errorElement = $("<span id='errorID" + compId + "' class='chief_compl_hidden chief_compl_error'></span>");
				textElement.append(errorElement);

				//Add author and date/time
				if (recordDataChiefComplaint && recordDataChiefComplaint.STATUS_DATA.STATUS != "Z") {
					var result_status_cd = recordDataChiefComplaint.RESULTS[0].CLINICAL_EVENTS[0].MEASUREMENTS[0].STATUS_CD;
					var codeArray = MP_Util.LoadCodeListJSON(recordDataChiefComplaint.CODES);
					var m_status = MP_Util.GetValueFromArray(result_status_cd, codeArray);

					// status code 34 indicates MODIFIED and 35 indicates ALTERED, in both these cases append Modified by text.
					if (m_status.meaning == "ALTERED" || m_status.meaning == "MODIFIED") {
						$(textElement).append('<span id="AuthorID' + compId + '" class="chief_compl_author_info">' + chiefcomplaintI18N.MODIFIED + ': ' + doc.fullName + '&nbsp;' + '&nbsp;' + dateStr + ' </span>');
					}
					else {
						$(textElement).append('<span id="AuthorID' + compId + '" class="chief_compl_author_info">' + doc.fullName + '&nbsp;' + '&nbsp;' + dateStr + ' </span>');
					}
				}

				// Add a textarea
				var textArea = $('<div id="textareaDiv' + compId + '" class="chief_compl_hidden"><textarea id="newText' + compId + '" class="chief_compl_textarea" /></div>');
				$(outerDivElement).append(textArea);

				// Add char count text
				var countText = $('<div id="countDiv' + compId + '" class="chief_compl_hidden"><span class="chief_compl_countText"><span id="countSpan' + compId + '" ></span></span></div>');
				$(outerDivElement).append(countText);

				// Add save and cancel butons
				var cancelButton = $('<div id="cancelDiv' + compId + '" class="chief_compl_hidden"><input type="button" id="cancelBtn' + compId + '" name="Cancel" value=' + i18n.CANCEL + ' class="chief_compl_button"/></div>');
				$(outerDivElement).append(cancelButton);

				var signButton = $('<div id="signDiv' + compId + '" class="chief_compl_hidden"><input type="button" id="signBtn' + compId + '" name="Sign" value=' + i18n.SIGN + ' class="chief_compl_button"/></div>');
				$(outerDivElement).append(signButton);

				MP_Util.Doc.FinalizeComponent(target.html(), component, "");

				// make the component editable if all three privileges: add, modify and sign are true else the component is read-only
				if (recordDataPrivs.ISEDITABLE === 1 && component.m_modifyInd) {
					var complaintSpanDOM = $('#complaintSpan' + compId);
					complaintSpanDOM.hover(function(e) {
						$(this).addClass("chief_compl_editable_inside_box");
						$('#outerDiv' + compId).addClass("chief_compl_outer_block");
						$('#AuthorID' + compId).addClass('chief_compl_author_adjustment');

						if (complaintSpanDOM.text() === chiefcomplaintI18N.ENTER_CHIEF_COMPLAINT) {
							$('#outerDiv' + compId).addClass("chief_compl_one_line");
						}
						else {
							$('#outerDiv' + compId).addClass("chief_compl_two_line");
						}

					}, function(e) {
						$(this).removeClass("chief_compl_editable_inside_box");
						$('#outerDiv' + compId).removeClass("chief_compl_outer_block");
						$('#AuthorID' + compId).removeClass('chief_compl_author_adjustment');

						if (complaintSpanDOM.text() === chiefcomplaintI18N.ENTER_CHIEF_COMPLAINT) {
							$('#outerDiv' + compId).removeClass("chief_compl_one_line");
						}
						else {
							$('#outerDiv' + compId).removeClass("chief_compl_two_line");
						}
					});

					// Click Event for complain text span
					complaintSpanDOM.click(function() {
						var oldText = "";
						oldText = $(this).text();

						// query all DOM elements here
						var textareaDivDOM = $("#textareaDiv" + compId);
						var textDivDOM = $("#textDiv" + compId);
						var signDivDOM = $("#signDiv" + compId);
						var cancelDivDOM = $("#cancelDiv" + compId);
						var outerDivDOM = $("#outerDiv" + compId);
						var countDivDOM = $('#countDiv' + compId);
						var newTextDOM = $("#newText" + compId);
						var countSpanDOM = $('#countSpan' + compId);
						var signBtnDOM = $("#signBtn" + compId);
						var cancelBtnDOM = $('#cancelBtn' + compId);
						var authorDOM = $('#AuthorID' + compId);
						var dateDOM = $('#dateID' + compId);

						textareaDivDOM.removeClass('chief_compl_hidden');
						textDivDOM.addClass('chief_compl_hidden');

						// Show the Sign and Cancel buttons
						signDivDOM.removeClass('chief_compl_hidden');
						cancelDivDOM.removeClass('chief_compl_hidden');

						// Adjust the height to avoid flickering
						textareaDivDOM.addClass('chief_compl_textarea_position');
						outerDivDOM.addClass('chief_compl_editable_outside_box');
						// Remove this class to avoid overlapping
						outerDivDOM.removeClass("chief_compl_outer_block");

						// Show the character count
						countDivDOM.removeClass('chief_compl_hidden');
						countSpanDOM.removeClass('res-severe');

						// Set the focus on textarea
						if (recordDataChiefComplaint.STATUS_DATA.STATUS != "Z") {
							newTextDOM.val(oldText);
						}
						else {
							newTextDOM.val(" ");
						}

						// Show the remaining chars as soon as you click the span
						var max = 255;
						newTextDOM.focus();
						var cleanString = newTextDOM.val().replace(/^\s+|\s+$/g, "");
						newTextDOM.val('');
						newTextDOM.focus();
						newTextDOM.val(cleanString);

						var len = cleanString.length;
						var chars = max - len;

						chiefcomplaintI18N.CHARACTERS_LEFT = " " + chiefcomplaintI18N.CHARACTERS_LEFT;
						if (len >= max) {
							countSpanDOM.addClass('res-severe');
							countSpanDOM.text('0' + chiefcomplaintI18N.CHARACTERS_LEFT);
							signBtnDOM.attr("disabled", "disabled");
						}
						else {
							countSpanDOM.text(chars + chiefcomplaintI18N.CHARACTERS_LEFT);
							if (len === 0) {
								signBtnDOM.attr("disabled", "disabled");
							}
							else {
								signBtnDOM.removeAttr("disabled");
							}
						}

						newTextDOM.on("cut paste input propertychange mousedown onchange", function (event) {
							// Trim the string to remove extra spaces , do not save empty complaint
							var max = 255;
							var cleanString = newTextDOM.val().replace(/^\s+|\s+$/g, "");
							// trim all spaces
							var len = cleanString.length;
							if (event.type !== "") {
								if (len === 0) {
									signBtnDOM.attr("disabled", "disabled");
									var chars = max - len;
									countSpanDOM.text(chars + chiefcomplaintI18N.CHARACTERS_LEFT);
									countSpanDOM.removeClass("res-severe");
								}
								else {
									if (len === max) {
										signBtnDOM.removeAttr("disabled");
										countSpanDOM.addClass('res-severe');
										countSpanDOM.text('0' + chiefcomplaintI18N.CHARACTERS_LEFT);
									}
									else if (len > max - 1) {
										//Disable the save button once max limit is reached, make bold red and user should not be able to write anything
										this.value = this.value.substring(0, max);
										countSpanDOM.addClass('res-severe');
										countSpanDOM.text('0' + chiefcomplaintI18N.CHARACTERS_LEFT);
										signBtnDOM.attr("disabled", "disabled");
									}
									else {
										var chars = max - len;
										countSpanDOM.removeClass('res-severe');
										countSpanDOM.text(chars + chiefcomplaintI18N.CHARACTERS_LEFT);
										signBtnDOM.removeAttr("disabled");
									}
								}
							}
						});

						cancelBtnDOM.click(function() {
							var newText = newTextDOM.val();
							signDivDOM.addClass('chief_compl_hidden');
							cancelDivDOM.addClass('chief_compl_hidden');
							textDivDOM.removeClass('chief_compl_hidden');
							textareaDivDOM.addClass('chief_compl_hidden');
							textareaDivDOM.addClass('chief_compl_textarea_position');
							$(this).removeClass('chief_compl_editable_inside_box');
							outerDivDOM.removeClass('chief_compl_editable_outside_box');

							// Remove the count
							countDivDOM.addClass('chief_compl_hidden');

							if (oldText === chiefcomplaintI18N.ENTER_CHIEF_COMPLAINT) {
								authorDOM.addClass('chief_compl_hidden');
								dateDOM.addClass('chief_compl_hidden');
								complaintSpanDOM.addClass("chief_compl_enter_text");
							}
						});

						signBtnDOM.click(function() {
							// Start timers
							var slaTimer = MP_Util.CreateTimer("CAP:MPG Sign Chief Complaint");
							if (slaTimer) {
								slaTimer.SubtimerName = cc_mpage;
								slaTimer.Start();
								slaTimer.Stop();
							}

							var newText = newTextDOM.val();
							outerDivDOM.removeClass('chief_compl_editable_outside_box');
							signDivDOM.addClass('chief_compl_hidden');
							cancelDivDOM.addClass('chief_compl_hidden');
							textDivDOM.removeClass('chief_compl_hidden');
							textareaDivDOM.addClass('chief_compl_hidden');

							// Hide the doc author and date/time span too
							authorDOM.addClass('chief_compl_hidden');
							dateDOM.addClass('chief_compl_hidden');
							countDivDOM.addClass('chief_compl_hidden');

							// Remove the grey color
							complaintSpanDOM.removeClass('chief_compl_enter_text');

							if (newText.length > 0) {
								complaintSpanDOM.html(newText);
							}
							else {
								complaintSpanDOM.html(chiefcomplaintI18N.ENTER_CHIEF_COMPLAINT);
								complaintSpanDOM.addClass('chief_compl_enter_text');
							}

							// If its the first time then event_id is not defined, in that case pass the event_id as 0.0 and change the script to ensure_type = 1 so that new record will be added
							if (recordDataChiefComplaint.STATUS_DATA.STATUS === "Z") {
								event_id = 0;
							}
							else {
								var event_id = recordDataChiefComplaint.RESULTS[0].CLINICAL_EVENTS[0].MEASUREMENTS[0].EVENT_ID;
							}

							// Send the text in @len:String@ format where len is the length of string and String is the actual string
							newText = "@" + newText.length + ":" + newText + "@";

							// Save the chief complaint text;
							var event_set_code = makeParams(component.getClinicalEventSets());
							var value_cnt = 1;
							var ar = ["^mine^", component.criterion.person_id, component.criterion.encntr_id, component.criterion.provider_id, event_set_code, event_id.toString() + ".00", newText, "^POWERCHART^", value_cnt];
							var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
							if (CERN_BrowserDevInd) {
								var url = "mp_add_edit_chief_complaint?parameters=" + ar.join(",");
								info.open("GET", url, false);
								info.send(null);
							}
							else {
								info.open('GET', "mp_add_edit_chief_complaint", false);
								info.send(ar.join(","));
							}

							// Check if the insert was successful
							var jsonEval = JSON.parse(info.responseText);
							var status = jsonEval.RECORD_DATA.STATUS_DATA.STATUS;
							if (status === "F") {
								$('#errorID' + compId).removeClass('chief_compl_hidden');
								$('#errorID' + compId).addClass('res-severe').html(chiefcomplaintI18N.ERROR_SAVING_CHIEF_COMPLAINT);
								authorDOM.addClass('chief_compl_hidden');
								dateDOM.addClass('chief_compl_hidden');
								complaintSpanDOM.html(oldText);
								if (oldText === chiefcomplaintI18N.ENTER_CHIEF_COMPLAINT)
									complaintSpanDOM.addClass('chief_compl_enter_text');
								return;
							}
							else {
								$('#errorID' + compId).removeClass('chief_compl_hidden');
								CERN_CHIEF_COMPLAINT_O1.LaunchCompThreads(component);
							}

						});

					});

				} // ------------------------------- end of else for status check -------------------------------
			}
			catch(err) {
				if (timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				throw (err);
			}
			finally {
				if (timerRenderComponent) {
					timerRenderComponent.Stop();
				}
			}
		},

		// ============================================================================
		// Events inherited from MPageComponent
		// ============================================================================

		/**
		 * Called when the component is initialized
		 */
		InsertData: function(component) {
			// if we don't have event sets or codes, show error retrieving results
			if (component.getClinicalEventSets().length === 0 && component.getClinicalEventCodes().length === 0) {
				var errMsg= [];
				errMsg.push(i18n.ERROR_RETREIVING_DATA);
				MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), component, "(0)");
				return;
				
			}
			else{
				component.updateData();
			}
			
			
		},

		// ____________________________________________________________________________

		/**
		 * Called when the client clicks on a powerform item on the drop down
		 */

		openDropDown: function(component, formID) {
			var criterion = component.getCriterion();
			var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";

			mpEvent("POWERFORM", paramString, "openDropDown");
		},

		// ____________________________________________________________________________

		/**
		 * Called when the client clicks the plus button, and bedrock tells us to
		 * use a powerform.
		 */
		openTab: function(component) {
			var criterion = component.getCriterion();
			var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + 0 + "|0|0";
			mpEvent("POWERFORM", paramString, "openTab");
			component.InsertData();
		},

		// ____________________________________________________________________________

		/**
		 * Called when the client clicks the plus button, and bedrock tells us to
		 * use an iView
		 */
		openIView: function(component) {
			var criterion = component.getCriterion();
			var params = ["'" + component.m_IviewBand + "'", "'" + component.m_IviewSection + "'", "'" + component.m_IviewItem + "'", criterion.person_id + ".0", criterion.encntr_id + ".0"];

			params = params.join(",");

			mpLog("IVIEW", params, "openIView");

			try {
				var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
				launchIViewApp.LaunchIView(component.m_IviewBand, component.m_IviewSection, component.m_IviewItem, criterion.person_id + ".0", criterion.encntr_id + ".0");
			}
			catch (e) {
				mpError(e, "openIView");
			}
		}
	};
})(jQuery);
