/**
 * Project: mp_med_availability_comps.js
 * Version: 1.0.0
 * Begin IP_SUMMARY_V2 Development
 * Released: 7/26/2010
 * @author Greg Howdeshell (GH7199)
 * Begin RXSTATION MED AVAILABILITY Development
 * Initial Development: 12/7/2010
 * @author Ryan Biller (RB015993)
 *   Note: A large portion of the java script and ccl middle layer were developed using
 *		   the inpatient summary version 2 code and specifically the medications component
 *		   within the ip_summary_v2.
 */

/**
 * Project: mp_demographics_o1.js
 * Version 1.0.0
 * Released 7/23/2010
 * @author Greg Howdeshell (GH7199)
 */
//TODO: Do we need to implement our own MP_GET_PATIENT_DEMO ccl? This all works fine now but if they make changes down the road to
//MP_GET_PATIENT_DEMO it could create issues with our front end javaScript code here.
var CERN_DEMO_BANNER_O1 = function() {
	return {
		GetPatientDemographics : function(demoBanner, criterion) {
			timerPatDemLoad = MP_Util.CreateTimer("USR:MPG.DEMO_BANNER.O1 - load component");
			if (timerPatDemLoad)
				timerPatDemLoad.Start();

			var info = new XMLCclRequest();

			info.onreadystatechange = function() {
				if (info.readyState == 4 && info.status == 200) {
					var timer = MP_Util.CreateTimer("ENG:MPG.DEMO_BANNER.O1 – render component");
					try {
						var jsHTML = new Array();
						var sHTML = "", birthDate = "", visitReason = "", mrnNbr, finNbr = "", age = "", isolation = "";

						var jsonText = JSON.parse(info.responseText);
						var codeArray = MP_Util.LoadCodeListJSON(jsonText.RECORD_DATA.CODES);
						var patInfo = jsonText.RECORD_DATA.DEMOGRAPHICS.PATIENT_INFO;
						var nameFull = patInfo.PATIENT_NAME.NAME_FULL;
						var enCodeArray = [];
						var formattedAliasArray = [];

						var dateTime = new Date();
						if (patInfo.BIRTH_DT_TM != "") {
							dateTime.setISO8601(patInfo.BIRTH_DT_TM);
							birthDate = dateTime.format("shortDate2");
							age = MP_Util.CalculateAge(dateTime);
						}

						var oSex = MP_Util.GetValueFromArray(patInfo.SEX_CD, codeArray);
						//codeObject.display - will give the display name associated with the code value
						var encntrInfo = jsonText.RECORD_DATA.DEMOGRAPHICS.ENCOUNTER_INFO;
						for (var j = 0, e = encntrInfo.length; j < e; j++) {
							visitReason = encntrInfo[j].REASON_VISIT;
							for (var i = 0, l = encntrInfo[j].ALIAS.length; i < l; i++) {
								enCodeArray[i] = MP_Util.GetValueFromArray(encntrInfo[j].ALIAS[i].ALIAS_TYPE_CD, codeArray);
								if (enCodeArray[i].meaning == "FIN NBR") {
									finNbr = encntrInfo[j].ALIAS[i].FORMATTED_ALIAS;
								}
								if (enCodeArray[i].meaning == "MRN") {
									mrnNbr = encntrInfo[j].ALIAS[i].FORMATTED_ALIAS;
								}
							}
							if (encntrInfo[j].ISOLATION_CD > 0)
								var isoObj = MP_Util.GetValueFromArray(encntrInfo[j].ISOLATION_CD, codeArray);
							if (isoObj)
								isolation = isoObj.display;
							if (encntrInfo[j].LOC_NURSE_UNIT_CD > 0)
								//criterion.setNurseUnit = MP_Util.GetValueFromArray(encntrInfo[j].LOC_NURSE_UNIT_CD, codeArray);
								criterion.svc_loc_cd = encntrInfo[j].LOC_NURSE_UNIT_CD;
						}

						var sexAbb = (oSex != null) ? oSex.display : i18n.UNKNOWN;

						jsHTML.push("<dl class='dmg-info'><dt class='dmg-pt-name-lbl'><span>", i18n.NAME, "</span></dt><dd class='dmg-pt-name'><span>", nameFull, "</span></dd><dt class='dmg-sex-age-lbl'><span>", i18n.SEX, " ", i18n.AGE, "</span></dt><dd class='dmg-sex-age'><span>", sexAbb, " ", age, "</span></dd><dt><span>", i18n.DOB, ":</span></dt><dd class='dmg-dob'><span>", birthDate, "</span></dd><dt><span>", i18n.MRN, ":</span></dt><dd class='dmg-mrn'><span>", mrnNbr, "</span></dd><dt><span>", i18n.FIN, ":</span></dt><dd class='dmg-fin'><span>", finNbr, "</span></dd><dt><span>", i18n.ISOLATION, ":</span></dt><dd class='dmg-isolation'><span>", isolation, "</span></dd><dt><span>", i18n.VISIT_REASON, ":</span></dt><dd class='dmg-rfv'><span>", visitReason, "</span></dd></dl>");

						demoBanner.innerHTML = jsHTML.join("");
					} finally {
						if (timer)
							timer.Stop();

						if (timerPatDemLoad)
							timerPatDemLoad.Stop();
					}
				}; //if
			}//function
			//  Call the ccl progam and send the parameter string
			info.open('GET', "MP_GET_PATIENT_DEMO", 0);
			var sendVal = "^MINE^, " + criterion.person_id + ".0, " + criterion.encntr_id + ".0";
			info.send(sendVal);
		}
	};
}();

/**
 * User Maintenance Component
 * Version: 1.1.0
 *
 * Begin Cerner/Care Fusion Integration User Maintenance Component Development
 * Initial Development: 01/21/2012
 * @author Ryan Biller (RB015993)
 */
function UserMaintComponentStyle() {
	this.initByNamespace("user-maint");
}

UserMaintComponentStyle.inherits(ComponentStyle);

function UserMaintComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new UserMaintComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.USER.MAINT.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.USER.MAINT.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(0);
	CERN_USER_MAINT_01.comp = this;
	this.m_isESMode = true;

	UserMaintComponent.method("InsertData", function() {
		CERN_USER_MAINT_01.AuthenticateCurrentUser(this, "");
	});
	UserMaintComponent.method("HandleSuccess", function(recordData) {
		CERN_USER_MAINT_01.RenderComponent(this, recordData);
	});
	UserMaintComponent.method("setESMode", function(value) {
		this.m_isESMode = value;
	});
	UserMaintComponent.method("isESMode", function() {
		return this.m_isESMode;
	});
}

UserMaintComponent.inherits(MPageComponent);

/**
 * User Maintenance methods
 * @namespace CERN_USER_MAINT_01
 * @static
 * @global
 */
var CERN_USER_MAINT_01 = function() {

	var comp = null;

	return {
		AuthenticateCurrentUser : function(component, admUserId) {
			this.comp = component;

			CERN_USER_MAINT_01.PrepareUserMaintRequest("", "", "", 0);
			//0=Authenticate
		},
		RenderComponent : function(component, recordData) {
			this.comp = component;

			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());

			try {
				var sHTML = "", countText = "";
				var replyData = recordData.REPLY_DATA;

				if (replyData != null && replyData.USER != null) {
					var admUser_statusInfo = replyData.USER.ADMUSER_STATUSINFO;
					if (admUser_statusInfo != null) {
						var adm_user_alias_exists = admUser_statusInfo.ADM_USER_ALIAS_EXISTS;
						if (adm_user_alias_exists != null && adm_user_alias_exists == 1) {
							//If the prsnl_alias_link_status is 0, we do not have a confirmed link to the ADM system so we will display a message letting the user
							//know that they need to confirm the registration at the ADM station.
							var prsnl_alias_link_status = admUser_statusInfo.PRSNL_ALIAS_LINK_STATUS;
							if (prsnl_alias_link_status != null) {
								switch (prsnl_alias_link_status) {
									case -1:
										CERN_USER_MAINT_01.ForeignUserAccountLocked(component);
										break;
									case 0:
										CERN_USER_MAINT_01.AwaitingRegistrationConfirmation(component);
										break;
									case 1:
										if (replyData.USER != null) {
											CERN_USER_MAINT_01.UserAuthenticationConfirmed(component, replyData.USER);
											CERN_MEDS_01.comp.setUser(replyData.USER);
											CERN_MEDS_WASTE_01.comp.setUser(replyData.USER);
										} else {
											//No user information was returned on the reply so we can't do much with this
											MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, countText);
										}
										break;
									default:
										MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, countText);
								}
							} else {
								MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, countText);
							}
						} else if (component.isESMode()){//(adm_user_alias_exists != null && adm_user_alias_exists == 0) { //this section is for loading the page in ES mode
							
							var sHTML = "";
							var jsHTML = [];
							var content = [];

							jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.CFN_ES_MODE, "</span></h3></div>");

							content.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", jsHTML.join(""), "</div>");
							sHTML = content.join("");

							MP_Util.Doc.FinalizeComponent(sHTML, component, "");
							CERN_MEDS_01.comp.setUser(replyData.USER);
							CERN_MEDS_WASTE_01.comp.setUser(replyData.USER);
						}else {
							CERN_MEDS_01.comp.setUser(null);
							CERN_MEDS_WASTE_01.comp.setUser(null);
							CERN_USER_MAINT_01.BuildADMUserRegistrationForm(component, replyData);
						}
					} else {
						MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, countText);
					}
				} else {
					MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, countText);
				}
			} catch (err) {
				if (timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				throw (err);
			} finally {
				if (timerRenderComponent)
					timerRenderComponent.Stop();
			}
		},
		ForeignUserAccountLocked : function(component) {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			var userAccountLocked = "";
			userAccountLocked = i18n.FOREIGN_USER_ACCOUNT_LOCKED.replace("{0}", user.FOREIGN_ID);

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", userAccountLocked, "</span></h3></div>");

			content.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, component, "");
		},
		AwaitingRegistrationConfirmation : function(component) {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.NEED_TO_CONFIRM_REGISTRATION, "</span></h3></div>");
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl><dd class='med_unregister_link'><span><A onClick=CERN_USER_MAINT_01.UnregistrationConfirmation()>", i18n.UNREGISTER, "</A></span></dd>")

			content.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, component, "");
		},
		UserAuthenticationConfirmed : function(component, user) {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			var userRegistrationConfirmed = "";
			userRegistrationConfirmed = i18n.USER_REGISTRATION_CONFIRMED.replace("{0}", user.NATIVE_ID);
			userRegistrationConfirmed = userRegistrationConfirmed.replace("{1}", user.FOREIGN_ID);

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", userRegistrationConfirmed, "</span></h3></div>");
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl><dd class='med_unregister_link'><span><A onClick=CERN_USER_MAINT_01.UnregistrationConfirmation()>", i18n.UNREGISTER, "</A></span></dd>")

			content.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, component, "");
		},
		UnregistrationConfirmation : function() {
			if (confirm(i18n.CONFIRM_UNREGISTER)) {
				CERN_USER_MAINT_01.UnregisterUser(CERN_USER_MAINT_01.comp);
			}
		},
		PrepareUserMaintRequest : function(native_id, foreign_id, user_pswd, transaction_ind) {
			//The user_maintenance call can take a couple seconds,
			//so display a "Loading..." message until it completes to let the user know the system is working
			var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.LOADING_DATA + "... </span><br/>";
			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

			var criterion = this.comp.getCriterion();
			var sendAr = [];

			var user_maintenance_request = new Object();
			var user = new Object();
			user.person_id = criterion.provider_id + ".0";
			user.native_id = native_id;
			user.foreign_id = foreign_id;
			user.user_pswd = user_pswd;
			user_maintenance_request.user = user;

			var witness_user = new Object();
			witness_user.person_id = "0.0";
			witness_user.native_id = "";
			witness_user.foreign_id = "";
			witness_user.user_pswd = "";
			user_maintenance_request.witness_user = witness_user;

			var indicators = new Object();
			indicators.transaction_ind = transaction_ind;
			user_maintenance_request.request_indicators = indicators;

			var patientContext = new Object();
			patientContext.person_id = criterion.person_id;
			patientContext.encounter_id = criterion.encntr_id;
			user_maintenance_request.patient_context = patientContext;

			var json_object = new Object();
			json_object.user_maintenance_request = user_maintenance_request;

			var json_request = JSON.stringify(json_object);

			//Iit is necessary the dates be wrapped in a carrot character (^) in order to be distinguished as strings
			sendAr.push("^MINE^", "^USER_MAINTENANCE^", "^" + json_request + "^");
			UserMaitenanceCCLRequestWrapper(this.comp, sendAr);
		},
		BuildADMUserRegistrationForm : function(component, replyData) {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.NEED_TO_REGISTER_USER, "</span><br/>");
			jsHTML.push("<input type='text' name='admUserIDInput' onkeydown='CERN_USER_MAINT_01.AdmUserIdInput_KeyDown()' value=''>");
			jsHTML.push("<input type='button' name='admUserIDButton' onClick='CERN_USER_MAINT_01.RegisterUser()' value='", i18n.REGISTER_BUTTON, "'>");
			jsHTML.push("<br/></h3></div>");

			content.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, component, "");
		},
		AdmUserIdInput_KeyDown : function() {
			if (event.keyCode == 13)
				document.getElementById('admUserIDButton').click();
		},
		RegisterUser : function() {
			var userIdTxt = document.getElementById('admUserIDInput').value;
			if (userIdTxt != "") {
				CERN_USER_MAINT_01.PrepareUserMaintRequest("", userIdTxt, "", 1);
				//1=Register Foreign User
			}
		},
		UnregisterUser : function() {
			CERN_USER_MAINT_01.PrepareUserMaintRequest("", "", "", 2);
			//2=Unregister Foreign User
		}
	};

	//A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER for User_Maintenance calls and examines the reply status before
	//determining how to handle the replyData.
	function UserMaitenanceCCLRequestWrapper(component, paramAr) {
		var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

		var info = new XMLCclRequest();
		info.onreadystatechange = function() {
			if (info.readyState == 4 && info.status == 200) {
				try {
					var jsonEval = JSON.parse(info.responseText);
					var recordData = jsonEval.RECORD_DATA;
					if (recordData.STATUS_DATA.STATUS == "Z") {
						//TODO: Create HandleZeroReply
					} else if (recordData.STATUS_DATA.STATUS == "S") {
						var userErrorMsg = "";
						
						for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
							if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME == "USER_ERROR_MESSAGE") {
								//The status block contained a message that needs to be displayed to the user.
								userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
								alert(userErrorMsg);
							}
						}
						component.HandleSuccess(recordData);
						component.setESMode(recordData.IS_ES_MODE);
					} else {
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
							userErrorMsg = i18n.ERROR_CONTACT_SYSTEM_ADMIN;
							alert(userErrorMsg);

							var sHTML = "";
							var jsHTML = [];
							var content = [];

							jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", userErrorMsg, "</span>");
							jsHTML.push("<br/></h3></div>");

							content.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", jsHTML.join(""), "</div>");
							sHTML = content.join("");

							MP_Util.Doc.FinalizeComponent(sHTML, component, "");
						}

					}
				} catch (err) {
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
						timerLoadComponent = null;
					}
				} finally {
					if (timerLoadComponent)
						timerLoadComponent.Stop();
				}
			} else if (info.readyState == 4 && info.status != 200) {
				MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
				if (timerLoadComponent)
					timerLoadComponent.Abort();
			}
		}
		info.open('GET', "ADM_ADAPTER_CCL_DRIVER", true);
		info.send(paramAr.join(","));
	}

}();

/**
 * Denotes the type of ADM.
 * @arg admTypeInd CFN:0, RXS:1
 * @throws Invalid ADM Type exception for any value other than CFN and RXS
 */
function AdmType(admType) {
	if (admType < 0 || admType >= 2)
		throw "Invalid ADM Type: " + admType;

	var admTypeIndicator = admType

	return {
		getTypeIndicator : function() {
			return admTypeIndicator;
		},
		isRxStation : function() {
			return admTypeIndicator == 1;
		},
		isCareFusion : function() {
			return admTypeIndicator == 0;
		}
	};

}

/**
 * Medications Component
 * Version: 1.1.0
 * Begin IP_SUMMARY_V2 Medications Component Development
 * Released: 7/26/2010
 * @author Greg Howdeshell (GH7199)
 * @author Subash Katageri (SK018948)
 * @author Mark Davenport (MD019066)
 *
 * Begin RXSTATION MED AVAILABILITY Medications Component Development
 * Note: A large portion of the java script and ccl middle layer were developed using
 *		 the inpatient summary version 2 code and specifically the medications component
 *		 within the ip_summary_v2.
 * Initial Development: 12/7/2010
 * @author Ryan Biller (RB015993)
 */
function MedicationsComponentStyle() {
	this.initByNamespace("med");
}

MedicationsComponentStyle.inherits(ComponentStyle);

function MedicationsComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new MedicationsComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.MEDS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.MEDS.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(2);
	this.setLookbackUnitTypeFlag(1);
	this.m_lookBackHours = 2;
	//Default look back will be 2 hours
	this.m_lookAheadHours = 6;
	//Default look ahead will be 6 hours
	CERN_MEDS_01.comp = this;
	this.m_queueTasksPending = 0;
	this.m_queueTaskOrderIds = [];
	this.m_user = null;
	this.m_admType = new AdmType(0);
	//Default is CFN
	this.m_order = null;
	this.m_alert = null;
	this.m_phaMedRequestList = null;
	this.m_phaPendingMedRequestsCnt = null;
	this.alertTypeCodeSet = MP_Util.GetCodeSet(4902, false);
	this.alertSevCodeSet = MP_Util.GetCodeSet(4903, false);
	this.alertStatusCodeSet = MP_Util.GetCodeSet(4904, false);
	this.MedReqReasonCodeSet = MP_Util.GetCodeSet(21609, false);
	this.MedReqPriorityCodeSet = MP_Util.GetCodeSet(4003306, false);
	this.m_displayDispenseLocation = true;
	this.m_displayQueueButton = true;
	this.m_allowPriorityAssignment = false;
	this.m_routeToPPM = 0;
	this.defaultPriorityCd = 0;
	this.m_hideMedRequest = false;

	MedicationsComponent.method("setUser", function(value) {
		this.m_user = value;
		if (value != null) {
			this.InsertData();
		} else {
			CERN_MEDS_01.WaitingForAuthentication();
		}
	});
	MedicationsComponent.method("getUser", function() {
		return this.m_user;
	});

	MedicationsComponent.method("InsertData", function() {
		if (this.getUser() == null) {
			CERN_MEDS_01.WaitingForAuthentication();
		} else {
			CERN_MEDS_01.GetMedications(this, "");
		}
	});
	MedicationsComponent.method("HandleSuccess", function(recordData) {
		CERN_MEDS_01.RenderComponent(this, recordData);
	});

	MedicationsComponent.method("setLookBackHours", function(value) {
		this.m_lookBackHours = value;
	});
	MedicationsComponent.method("getLookBackHours", function() {
		return this.m_lookBackHours;
	});
	
	MedicationsComponent.method("setHideMedRequest", function(value) {
		this.m_hideMedRequest = value;
	});
	MedicationsComponent.method("isHideMedRequest", function() {
		return this.m_hideMedRequest;
	});

	MedicationsComponent.method("setLookAheadHours", function(value) {
		this.m_lookAheadHours = value;
	});
	MedicationsComponent.method("getLookAheadHours", function() {
		return this.m_lookAheadHours;
	});
	MedicationsComponent.method("addQueueableTaskOrderId", function(value) {
		this.m_queueTaskOrderIds.push(value);
	});
	MedicationsComponent.method("clearQueueableTaskOrderIds", function() {
		this.m_queueTaskOrderIds = [];
	});
	MedicationsComponent.method("getQueueableTaskOrderIds", function() {
		return this.m_queueTaskOrderIds;
	});

	MedicationsComponent.method("setAdmType", function(value) {
		this.m_admType = value;
	});

	MedicationsComponent.method("getAdmType", function() {
		return this.m_admType;
	});

	MedicationsComponent.method("setOrders", function(value) {
		this.m_order = value;
	});

	MedicationsComponent.method("getOrders", function() {
		return this.m_order;
	});

	MedicationsComponent.method("setAlerts", function(value) {
		this.m_alert = value;
	});

	MedicationsComponent.method("getAlerts", function() {
		return this.m_alert;
	});

	MedicationsComponent.method("setPhaMedRequests", function(value) {
		this.m_phaMedRequestList = value;
	});

	MedicationsComponent.method("getPhaMedRequests", function() {
		return this.m_phaMedRequestList;
	});

	MedicationsComponent.method("setPhaPendingMedRequestsCnt", function(value) {
		this.m_phaPendingMedRequestsCnt = value;
	});

	MedicationsComponent.method("getPhaPendingMedRequestsCnt", function() {
		return this.m_phaPendingMedRequestsCnt;
	});

	MedicationsComponent.method("getDisplayDispenseLocation", function() {
		return this.m_displayDispenseLocation;
	});
	MedicationsComponent.method("setDisplayDispenseLocation", function(value) {
		this.m_displayDispenseLocation = value;
	});

	MedicationsComponent.method("getDisplayQueueButton", function() {
		return this.m_displayQueueButton;
	});

	MedicationsComponent.method("setDisplayQueueButton", function(value) {
		this.m_displayQueueButton = value;
	});

	MedicationsComponent.method("getAllowPriorityAssignment", function() {
		return this.m_allowPriorityAssignment;
	});

	MedicationsComponent.method("setAllowPriorityAssignment", function(value) {
		this.m_allowPriorityAssignment = value;
	});

	MedicationsComponent.method("getRouteToPPM", function() {
		return this.m_routeToPPM;
	});

	MedicationsComponent.method("setRouteToPPM", function(value) {
		this.m_routeToPPM = value;
	});

	MedicationsComponent.method("getDefaultPriorityCd", function() {
		if (this.defaultPriorityCd) {
			return this.defaultPriorityCd;
		}
		var codeSet = this.MedReqPriorityCodeSet;
		for (var i = 0; i < codeSet.length; i++) {
			var code = codeSet[i].value;
			if (code.meaning === 'MEDREQPRILOW') {
				this.defaultPriorityCd = code.codeValue;
				break;
			}
		}
		return this.defaultPriorityCd;
	});
}

MedicationsComponent.inherits(MPageComponent);

/**
 * Medication methods
 * @namespace CERN_MEDS_01
 * @static
 * @global
 */
var CERN_MEDS_01 = function() {

	var comp = null;

	return {
		WaitingForAuthentication : function() {
			//Display a waiting for authentication message until the component has a valid user
			var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.WAITING_FOR_USER_AUTH + "... </span><br/>";
			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		},
		GetRouteToPPMPref : function(component) {
			var sendAr = [];
			sendAr.push("^MINE^", "^GET_ROUTE_TO_PPM_PREF^");

			// call sync
			var call = new XMLCclRequest();
			call.open('GET', "ADM_ADAPTER_CCL_DRIVER", false);
			call.send(sendAr.join(","));

			// success
			if (call.status == 200) {
				var jsonEval = JSON.parse(call.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "S") {
					component.setRouteToPPM(recordData.ROUTE_TO_PPM);
				} else {
					alert(i18n.ERROR_CONTACT_SYSTEM_ADMIN);
				}
			} else {
				alert(i18n.ERROR_CONTACT_SYSTEM_ADMIN);
			}
		},
		GetMedications : function(component, admUserId) {
			//this.comp = component;
			var startDate = new Date();
			startDate.setTime(startDate.getTime() - (component.getLookBackHours() * 3600000.0));
			//look back is 2 hours by default
			var endDate = new Date();
			endDate.setTime(endDate.getTime() + (component.getLookAheadHours() * 3600000.0));
			//look ahead is 6 hours by default
			var criterion = component.getCriterion();
			var sendAr = [];

			//The get med availability can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
			var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.LOADING_DATA + "... </span><br/>";
			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

			var med_availability_request = new Object();
			med_availability_request.patient_id = criterion.person_id + ".0";
			med_availability_request.encounter_id = criterion.encntr_id + ".0";
			med_availability_request.start_date_time = startDate.format("dd-mmm-yyyy HH:MM:ss");
			med_availability_request.end_date_time = endDate.format("dd-mmm-yyyy HH:MM:ss");
			med_availability_request.provider_id = criterion.provider_id + ".0";
			med_availability_request.provider_foreign_id = admUserId;
			med_availability_request.adm_type_ind = component.getAdmType().getTypeIndicator();
			med_availability_request.position_cd = criterion.position_cd + ".0";
			med_availability_request.route_to_ppm = component.getRouteToPPM() + "";

			var json_object = new Object();
			json_object.med_availability_request = med_availability_request;

			var json_request = JSON.stringify(json_object);

			//Format dates nicely for easy conversion on ccl side using cnvtdatetime
			//Also, it is necessary the dates be wrapped in a carrot character (^) in order to be distinguished as strings
			sendAr.push("^MINE^", "^MED_AVAILABILITY^", "^" + json_request + "^");
			GetMedicationsCCLRequestWrapper(component, sendAr);
		},
		RenderComponent : function(component, recordData) {
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());

			try {
				var sHTML = "", countText = "";
				var replyData = recordData.REPLY_DATA;

				if (component.getOrders != null) {
					var orders = component.getOrders();
					if (orders && orders.length) {
						if (component.getRouteToPPM()) {
							retrievePhaMedRequest();
							retrievePhaPendingMedRequestCnt();
						} else {
							retrieveMedRequestAlert();
						}
					}
				}
				if (replyData != null) {
					sHTML = BuildMedAvailabilityDetails(component, replyData);
					MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
					if (component.getRouteToPPM()) {
						handleMedReqEvents();
						//init hovers
						phaInitHovers('pha-med-info', component.getRootComponentNode());
					}

				} else {
					MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, countText);
				}
			} catch (err) {
				if (timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				throw (err);
			} finally {
				if (timerRenderComponent)
					timerRenderComponent.Stop();
			}
		}
	};

	function BuildMedAvailabilityDetails(component, replyData) {

		var sHTML = "";
		var jsHTML = [];
		var jsScheduled = [];
		var jsContinuous = [];
		var jsPRN = [];
		var jsUnscheduled = [];
		var prnCount = 0;
		var continuousCount = 0;
		var scheduledCount = 0;
		var unscheduledCount = 0;
		var item = [];
		var jsonPRN = [];
		var jsonSched = [];
		var jsonCont = [];
		var jsonUnsched = [];
		var isRxStation = component.getAdmType().isRxStation();
		var setHvrStyle = "";
		var prioritySelectBox = "";
		var reasonSelectBox = "";

		//Spin through the orders and file them in the respective orderType category array
		var orderArrLength = replyData.ORDERS.length;
		for (var x = 0; x < orderArrLength; x++) {
			var order = replyData.ORDERS[x];
			var schedule = order.ORDERTYPE;

			if (schedule.toUpperCase() == "PRN") {
				jsonPRN.push(order);
			} else if (schedule.toUpperCase() == "CONTINUOUS") {
				jsonCont.push(order);
			} else if (schedule.toUpperCase() == "SCHEDULED") {
				jsonSched.push(order);
			} else if (schedule.toUpperCase() == "UNSCHEDULED") {
				jsonUnsched.push(order);
			}
		}

		//Sort the meds in each type category by the medication name
		jsonPRN.sort(SortByMedicationName);
		if (component.getRouteToPPM()) {
			setHvrStyle = " pha-med-onhvr";
			jsonSched.sort(SortByMedicationName);
			reasonSelectBox = BuildMultiMedRequestReason();
			if (component.getAllowPriorityAssignment()) {
				prioritySelectBox = BuildMultiMedRequestPriority();
			}
		} else {
			jsonSched.sort(SortByTaskDtTm);
		}
		jsonCont.sort(SortByMedicationName);
		jsonUnsched.sort(SortByMedicationName);

		//Now that each category has been sorted, smash them back into a single array
		//in order to iterate through all orders for building display
		var jsonFinal = [];
		jsonFinal = jsonFinal.concat(jsonPRN);
		jsonFinal = jsonFinal.concat(jsonSched);
		jsonFinal = jsonFinal.concat(jsonCont);
		jsonFinal = jsonFinal.concat(jsonUnsched);

		//Do the iterating in order to build out the display
		for (var j = 0 in jsonFinal) {
			item = [];
			var order = jsonFinal[j];
			var medTaskDtTm = "", startDtTm = "", lastDispenseDtTm = "";
			var medName = GetMedicationDisplayName(order);
			//Get the medication display line
			var orderedBy = order.ORDERENTEREDBY;
			//Who placed the order

			//Determine the order type category for this given order and set the indicator
			var isPrnInd = 0, isContinuousInd = 0, isScheduledInd = 0, isUnscheduledInd = 0, orderStatusInd = 0;
			//NOTE: orderStatusInd of 0 = verified, 1 = unverified, 2 = rejected
			var orderType = order.ORDERTYPE;

			if (order.ISVERIFIED == 0) {
				orderStatusInd = 1;
			}

			if (order.ISREJECTED == 1) {
				orderStatusInd = 2;
			}

			if (orderType.toUpperCase() == "PRN") {
				isPrnInd = 1;
			} else if (orderType.toUpperCase() == "CONTINUOUS") {
				isContinuousInd = 1;
			} else if (orderType.toUpperCase() == "SCHEDULED") {
				isScheduledInd = 1;
			} else if (orderType.toUpperCase() == "UNSCHEDULED") {
				isUnscheduledInd = 1;
			}

			var dateTime = new Date();
			var sDate = order.STARTDTTM;
			dateTime.setISO8601(sDate);
			//Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
			if (!dateTime.isZeroDate(sDate)) {
				//Order start date time for display within the med hover window
				startDtTm = dateTime.format("longDateTime2");
			}

			var jsSeverity = "res-normal";

			var orderAndTaskIds = order.PARENTORDERID + "|" + order.TASKID;
			var parentOrderIdAttr = " data-parent-order-id='" + order.PARENTORDERID + "'";

			//BEGIN: Building heads up medication row
			//Building display for medications table

			if (order.ISQUEUED == 1) {
				//If the order is already queued, apply the appropriate css to show the order row in the "queue indicator" color
				item.push("<dl class='med-info", setHvrStyle, " med-order-queued' id='medInfoRow", orderAndTaskIds, "'", parentOrderIdAttr, ">");
				
			} else {
				//Color the unverified and rejected rows with a gray background to illustrate the difference from verified orders (in addition to the relevent icon)
				if (orderStatusInd > 0) {
					item.push("<dl class='med-info", setHvrStyle, " med-order-unverified' id='medInfoRow", orderAndTaskIds, "'", parentOrderIdAttr, ">");
					//} else if (order.ORDERITEMS.length == 1) {
					//    item.push("<dl class='med-info med-order-dequeued' id='medInfoRow", orderAndTaskIds, "' >");
				} else {
					item.push("<dl class='med-info", setHvrStyle, " med-order-dequeued' id='medInfoRow", orderAndTaskIds, "'", parentOrderIdAttr, ">");
				}
			}

			//Medication task date time column... but only for scheduled orders
			var phaMedNameStyle = "med-name";
			if (component.getRouteToPPM()) {
				item.push("<dd class= 'pha-med-select-box'>", "<input type='checkbox' name='med-req-checkbox' class='med-req-checkbox'/>", " </dd>");
				phaMedNameStyle = "pha-med-info med-name pha-med-name";
			} else {
				if (isScheduledInd == 1) {
					dateTime = new Date();
					sDate = order.TASKDTTM;
					dateTime.setISO8601(sDate);
					//Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
					if (!dateTime.isZeroDate(sDate)) {
						//Medication task date time that will be displayed in heads up view in the med component
						medTaskDtTm = dateTime.format("longDateTime2");
					}
					item.push("<dd class= 'med-date'><span class='", jsSeverity, "'>", medTaskDtTm, "</span></dd>");
				} else {
					item.push("<dd class= 'med-date'><span class='", jsSeverity, "'></span></dd>");
				}
			}
			//Medication name column
			item.push("<dd class= '", phaMedNameStyle, "'>");
			item.push("<span class='", jsSeverity, "' >");
			//item.push("<dd class= 'med-name' onClick='showMedRequestModal(" + order.PARENTORDERID + ")'><span class='", jsSeverity, "' >");
			if (orderStatusInd == 1) {
				//Unverified order icon
				item.push("<img src='", component.getCriterion().static_content, "\\images\\5150_24.png'>");
			} else if (orderStatusInd == 2) {
				//Rejected order icon
				item.push("<img src='", component.getCriterion().static_content, "\\images\\6669_24.png'>");
			}
			item.push("<span>", medName, "</span></br>");
			/*If route to ppm is on enable med req link for orders without product*/

			if ((!component.isHideMedRequest()) && order.ORDERITEMS.length == 1) {
				item.push("<a onClick='showMedRequestModal(" + order.PARENTORDERID + ")'>", i18n.MED_REQ_TEXT, "</a>");
			}

			//Finding preferred location and building alternate location array
			var preferredLocation = null;
			var alternateLocations = new Array();
			var orderedItems = new Array();
			var altLocationCount = 0;
			for (var x = 0 in order.DISPENSEROUTINGLOCATIONS) {
				var location = order.DISPENSEROUTINGLOCATIONS[x];
				var dispenseLocation = null;
				if (location.BESTLOCATIONIND == 1) {
					preferredLocation = new DispenseLocation(location.LOCATIONDISP, location.ITEMAVAILABILITYIND, location.DISPENSELOCATIONTYPEIND);
					dispenseLocation = preferredLocation;
				} else {
					//If the best location indicator is not set then add this location to the alternate locations array
					alternateLocations[altLocationCount] = new DispenseLocation(location.LOCATIONDISP, location.ITEMAVAILABILITYIND, location.DISPENSELOCATIONTYPEIND);
					dispenseLocation = alternateLocations[altLocationCount];
					altLocationCount++;
				}

				// add pending tasks
				for (var taskIdx = 0 in location.PENDINGTASKS) {
					var pendingTask = location.PENDINGTASKS[taskIdx]
					dispenseLocation.addTask(new InventoryTask(pendingTask.TASKID, pendingTask.TASKTYPEDISP, pendingTask.LOCATIONCD, pendingTask.LOCATIONDISP));
				}
			}

			var medReqDet = null;
			var phaMedRequest = null;
			var phaPendingMedReqCnt = 0;
			var enableQueueButton = false;
			/*Whe route to PPM is on get latest med request and pending med request count*/
			if (component.getRouteToPPM()) {
				phaMedRequest = getPhaMedRequest(order.PARENTORDERID);
				phaPendingMedReqCnt = getPhaPendingMedRequestCnt(order.PARENTORDERID);
				var phaStatus = "";
				if (phaMedRequest) {
					phaStatus = i18n.MED_REQ_STATUS + " " + phaMedRequest.RX_STATUS_DISP;
					if (phaPendingMedReqCnt > 0) {
						phaStatus += "(" + phaPendingMedReqCnt + ")";
					}
				}
				item.push("<span class='pha-med-request-status med-request-status'data-order-id=", order.PARENTORDERID, ">", phaStatus, "</span>");
				// closing Medication name column.
				item.push("</span></dd>");
				item.push(getHoverView(order));

				item.push("<dd class='pha-med-action-form'><div class= 'pha-med-combo'><span>Reason</span><span>", reasonSelectBox, "</span>");
				if (component.getAllowPriorityAssignment()) {
					item.push("<span>", i18n.MED_REQ_PRIORITY, "</span><span>", prioritySelectBox, " </span>");
				}
				item.push("</div>");
				item.push("<div class='pha-med-comment'><span>Comment</span><span>", "<textarea class='med-req-comment' disabled></textarea>", " </span></div></dd>");
			} else {
				if (order.ORDERITEMS.length > 0) {
					medReqDet = getMedRequestDetailsByItem(order.ORDERITEMS[0].ITEMID);
				}
				if (!medReqDet) {
					// closing Medication name column.
					item.push("</span></dd>");
				}
				if (isRxStation || preferredLocation != null) {

					if (preferredLocation != null) {

						var style = preferredLocation.availability == 1 ? "med-alt-loc-in-stock" : "med-alt-loc-out-of-stock";

						if (medReqDet != null) {
							item.push("<span class='", style, " med-request-status'>", medReqDet.STATUS, "</span>");
							// closing Medication name column.
							item.push("</span></dd>");
						}

						//Show Preferred Dispense Location if the preference set to Yes.
						if (component.getDisplayDispenseLocation()) {
							var preferredLocationHTML = "<dd class= 'med-device'><span class='" + jsSeverity + "'>" + preferredLocation.location + "</span>";
							item.push(preferredLocationHTML);

							// new line
							switch (preferredLocation.availability) {
								case 0:
									//Insufficient quantity
									item.push("<br/><span class='", style, "'>", i18n.INSUFFICENT_QUANTITY, "</span>");
									break;
								case 1:
									//All items in stock
									item.push("<br/><span class='", style, "'>", i18n.IN_STOCK, "</span>");
									break;
								case 2:
									//Out of stock
									item.push("<br/><span class='", style, "'>", i18n.OUT_OF_STOCK, "</span>");
									break;
								case 3:
									//Unavailable
									item.push("<br/><span class='", style, "'>", i18n.MED_UNAVAILABLE, "</span>");
									break;
								case -1:
								//Unknown availability
								//Fall through to default case
								default:
									//Don't display the "unknown" message for Pharmacy locations (ie locationType == 0)
									if (preferredLocation.locationType != 0) {
										item.push("<br/><span class='", style, "'>", i18n.QUANTITY_UNKNOWN, "</span>");
									}
							}

							var pendingTask = preferredLocation.getPendingTask();
							if (pendingTask != null) {
								var pendingTaskDisplay = i18n.PENDING_INVENTORY_TASK_AT.replace("{0}", pendingTask.getTaskType());
								pendingTaskDisplay = pendingTaskDisplay.replace("{1}", pendingTask.getLocationDisplay());
								item.push("<br/><span class='", style, "'>", pendingTaskDisplay, "</span>");
							}

							// end the list
							item.push("</dd>");
						}
					} else if (component.getDisplayDispenseLocation()) {
						//No preferred location was returned
						item.push("<dd class= 'med-device'><span class='", jsSeverity, "'>", i18n.PREFERRED_LOC_UNKNOWN, "</span></dd>");
					}
					//Queue option should only be available for Med Station locations or ADMType is RxStation, if the order is actually queueable,
					//and user has can_queue indicator set
					if (order.ISQUEUEABLE == 1 && component.getUser().USER_INDICATORS.CAN_QUEUE_IND == 1 && orderStatusInd == 0) {
						enableQueueButton = true;
					}
				} else if (component.getDisplayDispenseLocation()) {
					//No preferred location was returned
					item.push("<dd class= 'med-device'><span class='", jsSeverity, "'>", i18n.PREFERRED_LOC_UNKNOWN, "</span></dd>");
				}

				//If the prsnl_alias_link_status is 0, we do not have a confirmed link to the ADM system so we can not complete the queueing process
				//so do not show the buttons.
				//If Show Queue Button preference is set to no, then hide submit button.
				if (component.getDisplayQueueButton()) {
					var admUser_statusInfo = component.getUser().ADMUSER_STATUSINFO;
					if (admUser_statusInfo != null) {
						var prsnl_alias_link_status = admUser_statusInfo.PRSNL_ALIAS_LINK_STATUS;
						if (prsnl_alias_link_status > 0) {
							item.push("<dd class= 'med-queue'><span class='", jsSeverity, "'>");
							var taskId = order.TASKID;
							if (enableQueueButton == true) {

								// RxStation supports enqueue/dequeue. CareFusion only supports enqueue
								var buttonName = "queueButton" + orderAndTaskIds;
								var value = isRxStation && order.ISQUEUED ? i18n.REMOVE_FROM_QUEUE : i18n.ADD_TO_QUEUE;
								item.push("<input type='button' name='", buttonName, "' value='", value, "' onClick='queueTask(", taskId, ")' >");

								//item.push("<input type='button' name='", buttonName, "' value='", value, "' onClick='showMedRequestModal(" + order.PARENTORDERID + ")' >");
								component.addQueueableTaskOrderId(orderAndTaskIds);
							}
							item.push("</span><br/>");
						}
					}
				}
			}
			item.push("</dl>");
			//END: Building heads up medication row

			//BEGIN: Building medication hover details

			if (!component.getRouteToPPM()) {
				item.push("<h4 class='med-det-hd'><span>", i18n.MED_DETAIL, "</span></h4>");

				//Ordered items
				var numOfOrderItems = order.ORDERITEMS.length;
				if (order.ORDERITEMS.length > 0) {
					medReqDet = getMedRequestDetailsByItem(order.ORDERITEMS[0].ITEMID);
				}
				item.push("<div class='hvr'><dl class='med-det'>");
				item.push("<dt><span>", i18n.MEDICATIONS, ":</span><br/></dt>");
				for (var k = 0; k < numOfOrderItems; k++) {
					var orderItem = order.ORDERITEMS[k];
					item.push("<dd class='med-alt-loc'><span>", orderItem.ITEMDESC, " </span><br/></dd>");
				}

				//When the Route Med Requests to PPM preference is Enabled and the Order has no product assigned, the Last Dispense Dt/Tm field will not display.
				dateTime = new Date(0);
				sDate = order.LASTDISPENSEDTTM;
				dateTime.setISO8601(sDate);
				//Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
				if (!dateTime.isZeroDate(sDate)) {
					//Order last dispensed date time for display within the med hover window
					lastDispenseDtTm = dateTime.format("longDateTime2");
				} else {
					//If last dispensed date is not available then display no dispense message within the med hover window
					lastDispenseDtTm = i18n.NO_DISPENSE;
				}
				item.push("<dt><span>", i18n.LAST_DISPENSE_DT_TM, ":</span></dt><dd class='med-det-dt'><span>", lastDispenseDtTm, "</span></dd>");

				//Hide Alternate Locations if Dispense location preference set to no.
				if (component.getDisplayDispenseLocation()) {
					item.push("<dt><span>", i18n.ALTERNATE_LOCATIONS, ":</span></dt>");

					//Add alternate locations list to hover
					for (var k = 0 in alternateLocations) {
						item.push("<dt><dd class='med-alt-loc'><span>", alternateLocations[k].location, " </span></dd>");

						var pendingTaskDisplay = null;
						var pendingTask = alternateLocations[k].getPendingTask();
						if (pendingTask != null) {
							pendingTaskDisplay = i18n.PENDING_INVENTORY_TASK.replace("{0}", pendingTask.getTaskType());
						}

						var style = null;
						var availability = null;

						switch (alternateLocations[k].availability) {
							case 0:
								//Insufficient quantity
								style = "med-alt-loc-out-of-stock";
								availability = i18n.INSUFFICENT_QUANTITY;
								break;
							case 1:
								//All items in stock
								style = "med-alt-loc-in-stock";
								availability = i18n.IN_STOCK;
								break;
							case 2:
								//Out of stock
								style = "med-alt-loc-out-of-stock";
								availability = i18n.OUT_OF_STOCK;
								break;
							case 3:
								//Unavailable
								style = "med-alt-loc-stock-unknown";
								availability = i18n.MED_UNAVAILABLE;
								break;
							case -1:
							//Unknown availability
							//Fall through to default case
							default:
								//Don't display the "unknown" message for Pharmacy locations (ie locationType == 0)
								if (alternateLocations[k].locationType != 0) {
									style = "med-alt-loc-stock-unknown";
									availability = i18n.QUANTITY_UNKNOWN;
								}
						}

						// display availability
						if (style != null && availability != null) {
							item.push("<dd class=", style, "><span>", availability, "</span>");
							if (pendingTaskDisplay != null) {
								item.push("<br/><span class=", style, ">", pendingTaskDisplay, "</span>");
							}
							item.push("</dd>");
						}

						item.push("<dt>");
					}
				}
				item.push("<dt><span>", i18n.ORDER_ID, ":</span></dt><dd class='med-det-dt'><span>", order.PARENTORDERID, "</span></dd>");

				if (medReqDet != null && medReqDet.MED_REQ != null) {
					item.push("<dt><span>", i18n.LAST_REQUESTED_BY, "</span></dt><dd class='med-det-dt'><span>", medReqDet.MED_REQ.MED_REQ_PRSNL_NAME, "</span>");
					var dateTime = new Date();
					var sDate = medReqDet.MED_REQ.MED_REQ_DT_TM;
					dateTime.setISO8601(sDate);
					var medReqDtTm;
					//Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
					if (!dateTime.isZeroDate(sDate)) {
						//Medication task date time that will be displayed in heads up view in the med component
						//medReqDtTm = dateTime.format("longDateTime2");
						medReqDtTm = dateTime.toLocaleString();
					}
					item.push("<span> ", i18n.ON, " </span><span>", medReqDtTm, "</span></dd>");
					item.push("<dt><span>", i18n.MED_REQ_REASON, "</span></dt><dd class='med-det-dt'><span>", GetDisplayByValue(medReqDet.MED_REQ.MED_REQ_REASON_CD, component.MedReqReasonCodeSet), "</span></dd>");
					if (component.getAllowPriorityAssignment()) {
						item.push("<dt><span>", i18n.MED_REQ_PRIORITY, "</span></dt><dd class='med-det-dt'><span>", GetDisplayByValue(medReqDet.MED_REQ.MED_REQ_PRIORITY_CD, component.MedReqPriorityCodeSet), "</span></dd>");
					}
					item.push("<dt><span>", i18n.MED_REQ_COMMENT, "</span></dt><dd class='med-det-dt'><span>", medReqDet.MED_REQ.MED_REQ_REASON_TEXT, "</span></dd>");
				}
				item.push("</dl></div>");
			}

			//END: Building medication hover details

			//Add the generaged JavaScript to the existing JavaScript for the given order type
			//Also, increment the counter for number of orders for the given type for display in the section heading
			if (isPrnInd == 1) {
				jsPRN = jsPRN.concat(item);
				prnCount++;
			} else if (isContinuousInd == 1) {
				jsContinuous = jsContinuous.concat(item);
				continuousCount++;
			} else if (isScheduledInd == 1) {
				jsScheduled = jsScheduled.concat(item);
				scheduledCount++;
			} else if (isUnscheduledInd == 1) {
				jsUnscheduled = jsUnscheduled.concat(item);
				unscheduledCount++;
			}
		}
		if (component.getRouteToPPM()) {
			var toolBarClass = 'medReqToolBarWithOutPriority';
			var priorityCombo = '';
			if (component.getAllowPriorityAssignment()) {
				toolBarClass = 'medReqToolBar';
				priorityCombo = "<dd class='medReqToolbarComboBox'><span>" + i18n.MED_REQ_PRIORITY + "</span></br>" + BuildMultiMedRequestPriority("medReqToolbarPriority") + "</dd>";
			}
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl class ='med-info'>");
			jsHTML.push("<fieldset class='", toolBarClass, "'><legend style='font-weight:bold;'>", i18n.MED_REQ_APPLY_TO_SELECT, "</legend>");
			jsHTML.push("<dd class='medReqToolbarBtnBox'><span></span></br>", "<span><input type='button' id='medReqApplyAll' onclick='applyToSelectedMedRequests()' value='", i18n.MED_REQ_APPLY, "' disabled='true'/></span>");
			jsHTML.push("<span><input type='button' id='medReqClearAll' onclick='clearMedRequestInputFields()' value='", i18n.MED_REQ_CLEAR, "' disabled='true'/></span>", "</dd>");
			jsHTML.push(priorityCombo);
			jsHTML.push("<dd class='medReqToolbarComboBox'><span>", i18n.MED_REQ_REASON, "</span></br>", BuildMultiMedRequestReason("medReqToolbarReason"), "</dd>");
			jsHTML.push("</fieldset></dl></h3></div>");
			jsHTML.push(getSectionView(i18n.SCHEDULED, scheduledCount, jsScheduled.join("")));
			jsHTML.push(getSectionView(i18n.UNSCHEDULED, unscheduledCount, jsUnscheduled.join("")));
			jsHTML.push(getSectionView(i18n.PRN, prnCount, jsPRN.join("")));
			jsHTML.push(getSectionView(i18n.CONTINUOUS, continuousCount, jsContinuous.join("")));
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl class ='med-info'>");
			jsHTML.push("<dd class='medReqSubmitBtnBox'>", "<input type='button' id='medRequestMultiSubmit' onclick='generateMultipleMedRequestAlerts()' value='", i18n.SUBMIT, "' disabled='true'></dd>");
			jsHTML.push("</dl></h3></div>");
		} else {
			//If Show Queue Button preference is set to no, then hide submit button.
			if (component.getDisplayQueueButton()) {
				var taskBtnValue = isRxStation ? i18n.SUBMIT : i18n.QUEUE_TASK_TO_DEVICE;
				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl class ='med-info'>");
				jsHTML.push("<dd class= 'med-submit-row'><span class='", jsSeverity, "'>.</span></dd>");
				jsHTML.push("<dd class= 'med-queue'><span class='", jsSeverity, "'><input type='button' disabled='true' name='setTaskButtonTop' value='", taskBtnValue, "' onClick='setTask()' ></span></dd>");
				jsHTML.push("</dl></h3></div>");
			}

			//Flex PREFERRED_DISPENSE_LOC label depending on preference set
			var prefDispLocationHeader = "";
			if (component.getDisplayDispenseLocation()) {
				prefDispLocationHeader = i18n.PREFERRED_DISPENSE_LOC;
			}
			//SCHEDULED section
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.SCHEDULED, " (", scheduledCount, ")</span></h3>");
			if (scheduledCount > 0) {
				//Column headers
				jsHTML.push("<div class='sub-title-disp'>");
				jsHTML.push("<dl class ='med-info-hdr'>");
				jsHTML.push("<dd class='med-date-hdr'><span>" + i18n.TASK_DT_TM + "</span></dd>");
				jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
				jsHTML.push("<dd class= 'med-device-hdr'><span>", prefDispLocationHeader, "</span></dd>");
				jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
				jsHTML.push("</div>");

				jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>", i18n.NEXT_DOSE, "</dd></dl></div><div class='content-body'", ">", jsScheduled.join(""), "</div></div>");
			}
			jsHTML.push("</div>");

			// Unscheduled section
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.UNSCHEDULED, " (", unscheduledCount, ")</span></h3>");
			if (unscheduledCount > 0) {
				jsHTML.push("<div class='sub-title-disp'>");
				jsHTML.push("<dl class ='med-info hdr'>");
				jsHTML.push("<dd class= 'med-date-hdr'><span> </span></dd>");
				jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
				jsHTML.push("<dd class= 'med-device-hdr'><span>", prefDispLocationHeader, "</span></dd>");
				jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
				jsHTML.push("</div>");

				jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>", i18n.LAST_GIVEN, "</dd></dl></div><div class='content-body'", ">", jsUnscheduled.join(""), "</div></div>");
			}
			jsHTML.push("</div>");

			//PRN section
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.PRN, " (", prnCount, ")</span></h3>");
			if (prnCount > 0) {
				jsHTML.push("<div class='sub-title-disp'>");
				jsHTML.push("<dl class ='med-info hdr'>");
				jsHTML.push("<dd class= 'med-date-hdr'><span> </span></dd>");
				jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
				jsHTML.push("<dd class= 'med-device-hdr'><span>", prefDispLocationHeader, "</span></dd>");
				jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
				jsHTML.push("</div>");

				jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>", i18n.LAST_GIVEN, "</dd></dl></div><div class='content-body'", ">", jsPRN.join(""), "</div></div>");
			}
			jsHTML.push("</div>");

			//CONTINUOUS section
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.CONTINUOUS, " (", continuousCount, ")</span></h3>");
			if (continuousCount > 0) {
				jsHTML.push("<div class='sub-title-disp'>");
				jsHTML.push("<dl class ='med-info hdr'>");
				jsHTML.push("<dd class= 'med-date-hdr'><span> </span></dd>");
				jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
				jsHTML.push("<dd class= 'med-device-hdr'><span>", prefDispLocationHeader, "</span></dd>");
				jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
				jsHTML.push("</div>");

				jsHTML.push("<div class='sub-sec-content'><div class='content-body'", ">", jsContinuous.join(""), "</div></div>");
			}
			jsHTML.push("</div>");

			//If the prsnl_alias_link_status is 0, we do not have a confirmed link to the ADM system so we will display a message letting the user
			//know that they need to confirm the registration at the ADM station.
			var admUser_statusInfo = component.getUser().ADMUSER_STATUSINFO;
			if (admUser_statusInfo != null) {
				var prsnl_alias_link_status = admUser_statusInfo.PRSNL_ALIAS_LINK_STATUS;
				if (prsnl_alias_link_status == 0) {
					jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.NEED_TO_CONFIRM_REGISTRATION, "</span></h3></div>");
				}
			}

			//If Show Queue Button preference is set to no, then hide submit button.
			if (component.getDisplayQueueButton()) {
				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl class ='med-info'>");
				jsHTML.push("<dd class= 'med-submit-row'><span class='", jsSeverity, "'>.</span></dd>");
				jsHTML.push("<dd class= 'med-queue'><span class='", jsSeverity, "'><input type='button' disabled='true' name='setTaskButtonBottom' value='", taskBtnValue, "' onClick='setTask()' ></span></dd>");
				jsHTML.push("</dl></h3></div>");
			}
		}

		var content = [];
		//if the results are zero then display no result found.
		if (jsonFinal.length == 0) {
			content.push("<div class='", MP_Util.GetContentClass(component, jsonFinal.length), "'>", MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), "</div>");
		} else {
			content.push("<div class='", MP_Util.GetContentClass(component, jsonFinal.length), "'>", jsHTML.join(""), "</div>");
		}
		sHTML = content.join("");

		return sHTML;
	}

	function SortByMedicationName(a, b) {
		var aName = GetMedicationDisplayName(a);
		var bName = GetMedicationDisplayName(b);
		var aUpper = (aName != null) ? aName.toUpperCase() : "";
		var bUpper = (bName != null) ? bName.toUpperCase() : "";

		if (aUpper > bUpper)
			return 1;
		else if (aUpper < bUpper)
			return -1;
		return 0
	}

	function SortByTaskDtTm(a, b) {
		var aDtTm = new Date();
		aDtTm.setISO8601(a.TASKDTTM);
		var bDtTm = new Date();
		bDtTm.setISO8601(b.TASKDTTM);

		var aDtTmInMillis = aDtTm.getTime()
		var bDtTmInMillis = bDtTm.getTime();

		if (aDtTmInMillis > bDtTmInMillis)
			return 1;
		else if (aDtTmInMillis < bDtTmInMillis)
			return -1;
		else
			return SortByMedicationName(a, b);
		//if times are equal, sort by med name
	}

	function GetMedicationDisplayName(order) {
		var medName = "";
		if (CERN_MEDS_01.comp.getRouteToPPM()) {
			if (order.ORDERDISPLAY != null) {
				medName = order.ORDERDISPLAY;
			}
		} else {
			if (order.POWERCHARTDISPLAY != null) {
				medName = order.POWERCHARTDISPLAY;
			}
		}

		return (medName);
	}

	//A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER and examines the reply status before
	//determining how to handle the reply.
	function GetMedicationsCCLRequestWrapper(component, paramAr) {
		var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());
		var info = new XMLCclRequest();
		info.onreadystatechange = function() {
			if (info.readyState == 4 && info.status == 200) {
				try {
					var jsonEval = JSON.parse(info.responseText);
					var recordData = jsonEval.RECORD_DATA;
					if (recordData.STATUS_DATA.STATUS == "Z") {
						component.HandleSuccess(recordData);
					} else if (recordData.STATUS_DATA.STATUS == "S") {
						var userErrorMsg = "";
						for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
							if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME == "USER_ERROR_MESSAGE") {
								//The status block contained a message that needs to be displayed to the user.
								userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
								alert(userErrorMsg);
							}
						}
						if (recordData.REPLY_DATA.ORDERS != null) {
							component.setOrders(recordData.REPLY_DATA.ORDERS);
						}
						component.HandleSuccess(recordData);
					} else {
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
							errorAr.push(statusData.STATUS, statusData.SUBEVENTSTATUS.OPERATIONNAME, statusData.SUBEVENTSTATUS.OPERSATIONSTATUS, statusData.SUBEVENTSTATUS.TARGETOBJECTNAME, statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
						}
						MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
					}
				} catch (err) {
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
						timerLoadComponent = null;
					}
				} finally {
					if (timerLoadComponent)
						timerLoadComponent.Stop();
				}
			} else if (info.readyState == 4 && info.status != 200) {
				MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
				if (timerLoadComponent)
					timerLoadComponent.Abort();
			}
		}
		info.open('GET', "ADM_ADAPTER_CCL_DRIVER", false);
		info.send(paramAr.join(","));
	}

	function DispenseLocation(location, availability, locationType) {
		this.location = location;
		this.availability = availability;
		//1==Enough in stock for order, 0==Not enough in stock for order, -1==Inventory availability unknown
		this.locationType = locationType;
		//0==Pharmacy, 1==RxStation, 2==ExternalADM
		this.pendingTasks = new Array();
		//list of pending tasks

		DispenseLocation.method("addTask", function(value) {
			if (value != null) {
				this.pendingTasks.push(value);
			}
		});

		DispenseLocation.method("getPendingTask", function() {
			return this.pendingTasks.length > 0 ? this.pendingTasks[0] : null;
		});
	}

	function InventoryTask(taskId, taskTypeDisplay, locationCD, locationDisplay) {
		this.taskId = taskId;
		this.taskTypeDisplay = taskTypeDisplay;
		this.locationCD = locationCD;
		this.locationDisplay = locationDisplay;

		InventoryTask.method("getTaskType", function() {
			return this.taskTypeDisplay;
		});

		InventoryTask.method("getLocationDisplay", function() {
			return this.locationDisplay;
		});

	}

}();

/*Function to update med request faceup and hover details.*/
function updatePhaMedReqDetails() {
	retrievePhaMedRequest();
	retrievePhaPendingMedRequestCnt();
	$(".pha-med-request-status").each(function() {
		var currentNode = $(this);
		var orderId = currentNode.attr("data-order-id");
		var phaMedRequest = getPhaMedRequest(orderId);
		phaPendingMedReqCnt = getPhaPendingMedRequestCnt(orderId);
		if (phaMedRequest) {
			var phaStatus = i18n.MED_REQ_STATUS + " " + phaMedRequest.RX_STATUS_DISP;
			if (phaPendingMedReqCnt > 0) {
				phaStatus += "(" + phaPendingMedReqCnt + ")";
			}
			currentNode.html(phaStatus);
		}
	});
	$(".pha-med-req-details").each(function() {
		var currentNode = $(this);
		var orderId = currentNode.attr("data-order-id");
		var phaMedRequest = getPhaMedRequest(orderId);
		if (phaMedRequest) {
			currentNode.html(BuildPhaMedReqHover(phaMedRequest));
		}
	});
	clearMedRequestInputFields();
}

function getHoverView(order) {
	//BEGIN: Building medication hover details
	var item = [];
	var lastDispenseDtTm = "";
	var phaMedRequest = null;
	item.push("<h4 class='med-det-hd'><span>", i18n.MED_DETAIL, "</span></h4>");

	//Ordered items
	var numOfOrderItems = order.ORDERITEMS.length;
	var component = CERN_MEDS_01.comp;
	phaMedRequest = getPhaMedRequest(order.PARENTORDERID);
	item.push("<div class='hvr pha-hvr'><dl class='med-det'>");
	item.push("<dt><span>", i18n.MEDICATIONS, ":</span></dt>");
	item.push("<div class='pha-hvr-med-display'>" + order.ORDEREDASMNEMONIC + "</div>");

	//When the Route Med Requests to PPM preference is Enabled and the Order has no product assigned, the Last Dispense Dt/Tm field will not display.
	if (numOfOrderItems > 0) {
		dateTime = new Date(0);
		sDate = order.LASTDISPENSEDTTM;
		dateTime.setISO8601(sDate);
		//Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
		if (!dateTime.isZeroDate(sDate)) {
			//Order last dispensed date time for display within the med hover window
			lastDispenseDtTm = dateTime.format("longDateTime2");
		} else {
			//If last dispensed date is not available then display no dispense message within the med hover window
			lastDispenseDtTm = i18n.NO_DISPENSE;
		}
		item.push("<dt><span>", i18n.LAST_DISPENSE_DT_TM, ":</span></dt><dd class='med-det-dt'><span>", lastDispenseDtTm, "</span></dd>");
	}
	item.push("<dt><span>", i18n.ORDER_ID, ":</span></dt><dd class='med-det-dt'><span>", order.PARENTORDERID, "</span></dd>");

	/*If pharmacy med request is there add details to hover. Else add placeholder*/
	var buildPhaMedReqHover = "";
	if (phaMedRequest) {
		buildPhaMedReqHover = BuildPhaMedReqHover(phaMedRequest);
	}
	item.push("<span class='pha-med-req-details' data-order-id='", order.PARENTORDERID, "'>");
	item.push(buildPhaMedReqHover);
	item.push("</span>");
	item.push("</dl></div>");
	return item.join("");
}
/* Function will initiate hovers for html tag "DD" */
function phaInitHovers(trg, par) {
	gen = Util.Style.g(trg, par, "DD")
	for (var i = 0, l = gen.length; i < l; i++) {
		var m = gen[i];
		if (m) {
			var nm = Util.gns(Util.gns(m));
			if (nm) {
				if (Util.Style.ccss(nm, "hvr")) {
					hs(m, nm);
				}
			}
		}
	}
}

/*Function to build HTML tags for med request response from PPM*/
function BuildPhaMedReqHover(phaMedRequest) {
	var aHTML = [];
	var lDate = phaMedRequest.REQUESTED_DT_TM;
	var lastMedReqDtTm;
	var reasonComment = phaMedRequest.REASON_COMMENT;
	reasonComment = reasonComment.replace(/\\n/g, ' ');
	var rxReasonComment = phaMedRequest.RX_REASON_COMMENT;
	var maxCommentLength = 130;

	if (reasonComment.length > maxCommentLength) {
		reasonComment = reasonComment.substring(0, maxCommentLength);
		reasonComment = reasonComment.concat("...");
	}

	if (rxReasonComment.length > maxCommentLength) {
		rxReasonComment = rxReasonComment.substring(0, maxCommentLength);
		rxReasonComment = rxReasonComment.concat("...");
	}

	//Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
	if (lDate && lDate !== "TZ") {
		var ldateTime = new Date();
		ldateTime.setISO8601(lDate);
		lastMedReqDtTm = ldateTime.toLocaleString();
	}
	aHTML.push("<dt><span>", i18n.LAST_REQUESTED_BY, "</span></dt><dd class='med-det-dt'><span>", phaMedRequest.REQUEST_PRSNL_NAME, "</span>");
	aHTML.push("<span> ", i18n.ON, " </span><span>", lastMedReqDtTm, "</span></dd>");
	aHTML.push("<dt><span>", i18n.MED_REQ_REASON, "</span></dt><dd class='med-det-dt'><span>", phaMedRequest.REASON_DISP, "</span></dd>");
	if (CERN_MEDS_01.comp.getAllowPriorityAssignment()) {
		aHTML.push("<dt><span>", i18n.MED_REQ_PRIORITY, "</span></dt><dd class='med-det-dt'><span>", phaMedRequest.PRIORITY_DISP, "</span></dd>");
	}
	aHTML.push("<dt><span>", i18n.MED_REQ_COMMENT, "</span><br/></dt><div class='pha-hvr-comment'>", reasonComment, "</div>");

	var displayOn = i18n.ON;
	var rxActionDate = phaMedRequest.RX_ACTION_DT_TM;
	var rxMedReqDtTm;
	//Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
	if (rxActionDate && rxActionDate !== 'TZ') {
		var rxDateTime = new Date();
		rxDateTime.setISO8601(rxActionDate)
		rxMedReqDtTm = rxDateTime.toLocaleString();
	} else {
		displayOn = "";
	}
	aHTML.push("</dl><dl><dt class='pha-med-det'><span>", i18n.PHARMACY_HEADER, "</span></dt>");
	aHTML.push("<dt><span>", i18n.PROCESSED_BY, "</span></dt><dd class='med-det-dt'><span>", phaMedRequest.RX_ACTION_PRSNL_NAME, "</span>");
	aHTML.push("<span> ", displayOn, " </span><span>", rxMedReqDtTm, "</span></dd>");
	aHTML.push("<dt><span>", i18n.RESPONSE, "</span></dt><dd class='med-det-dt'><span>", phaMedRequest.RX_STATUS_DISP, "</span></dd>");
	aHTML.push("<dt><span>", i18n.MED_REQ_REASON, "</span></dt><dd class='med-det-dt'><span>", phaMedRequest.RX_REASON_DISP, "</span></dd>");
	aHTML.push("<dt><span>", i18n.MED_REQ_COMMENT, "</span><br/></dt><div class='pha-hvr-comment'>", rxReasonComment, "</div>");
	return aHTML.join("");
}

function BuildMedRequestReason() {
	var selected_entry = 0;
	var aHTML = [];
	var codeSetCache = [];
	var code_set = codeSetCache['a21609'];
	if (!code_set) {
		code_set = MP_Util.GetCodeSet(21609, false);
		codeSetCache['a21609'] = code_set;
	}

	var codeCnt = code_set.length;
	aHTML.push("</br>", i18n.MED_REQ_REASON, "</br>");
	aHTML.push('<select name="med_request" class="med-req-reason"');

	aHTML.push("id='med_request_select'>");
	aHTML.push('<option ');
	aHTML.push('value=0 title=" " selected=selected></option>');
	for (var i = 0; i < codeCnt; i++) {
		code = code_set[i].value;

		aHTML.push('<option ');
		aHTML.push('value=' + code.codeValue + ' title="' + code.description + '">' + code.display + '</option>');
		code = null;
	}
	aHTML.push('</select>');

	return aHTML.join('');
}

function BuildMedRequestPriority() {
	var aHTML = [];
	var code_set = CERN_MEDS_01.comp.MedReqPriorityCodeSet;
	var defaultPriority_CDF = 'MEDREQPRILOW';
	// to set default priority "low".
	var codeCnt = code_set.length;
	aHTML.push("</br>", i18n.MED_REQ_PRIORITY, "</br>");
	aHTML.push('<select name="med_request_priority" class="med-request-combobox-priority med-req-priority" id="med_request_select_priority">');
	for (var i = 0; i < codeCnt; i++) {
		code = code_set[i].value;
		var selected = '';
		if (code.meaning == defaultPriority_CDF) {
			selected = 'selected=selected';
		}
		aHTML.push('<option value=' + code.codeValue + ' title="' + code.description + '" ' + selected + '>' + code.display + '</option>');
		code = null;
	}
	aHTML.push('</select>');

	return aHTML.join('');
}

function getSectionView(header, count, contentView) {
	var view = [];
	view.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", header, " (", count, ")</span></h3>");
	if (count > 0) {
		//Column headers
		view.push("<div class='sub-title-disp'>");
		view.push("<dl class ='med-info-hdr'>");
		view.push("<dd class= 'pha-med-select-box'><span> </span></dd>");
		view.push("<dd class= 'med-name-hdr pha-med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
		view.push("<dd class= 'pha-med-combo-hdr'><span>", "", " </span></dd>");
		view.push("<dd class= 'pha-med-comment-hdr'><span>", "", " </span></dd></dl>");
		view.push("</div>");
		view.push("<div class='sub-sec-content'><div class='content-body'", ">", contentView, "</div></div>");
	}
	view.push("</div>");
	return view.join("");
}

function BuildMultiMedRequestReason(id) {
	var selected_entry = 0;
	var aHTML = [];
	var codeSetCache = [];
	var code_set = codeSetCache['a21609'];
	if (!code_set) {
		code_set = MP_Util.GetCodeSet(21609, false);
		codeSetCache['a21609'] = code_set;
	}

	var codeCnt = code_set.length;
	if (id) {
		aHTML.push('<select name="med_request_reason" id="', id, '">');
	} else {
		aHTML.push('<select name="med_request_reason" class="med-req-reason" disabled>');
	}
	aHTML.push('<option value="" title=" " selected=selected></option>');
	for (var i = 0; i < codeCnt; i++) {
		code = code_set[i].value;

		aHTML.push('<option ');
		aHTML.push('value=' + code.codeValue + ' title="' + code.description + '">' + code.display + '</option>');
		code = null;
	}
	aHTML.push('</select>');

	return aHTML.join('');
}

function BuildMultiMedRequestPriority(id) {
	var aHTML = [];
	var code_set = CERN_MEDS_01.comp.MedReqPriorityCodeSet;
	var defaultPriority_CDF = 'MEDREQPRILOW';
	// to set default priority "low".
	var codeCnt = code_set.length;
	if (id) {
		aHTML.push('<select name="med_request_priority" id="', id, '">');
		aHTML.push('<option value="" title=" " selected=selected></option>');
		defaultPriority_CDF = 'BLANK';
	} else {
		aHTML.push('<select name="med_request_priority" class="med-req-priority" disabled>');
	}
	for (var i = 0; i < codeCnt; i++) {
		code = code_set[i].value;
		var selected = '';
		if (code.meaning == defaultPriority_CDF) {
			selected = 'selected=selected';
		}
		aHTML.push('<option value=' + code.codeValue + ' title="' + code.description + '" ' + selected + '>' + code.display + '</option>');
		code = null;
	}
	aHTML.push('</select>');

	return aHTML.join('');
}

// wrapper to gerate the med request alert
function generateMedRequestAlert(order) {
	var comment = "";
	var criterion = CERN_MEDS_01.comp.getCriterion();

	/*
	 [request]
	 1 encntr_id = f8
	 1 reason_cd = f8
	 1 text = vc
	 1 ord[*]
	 order_id = f8
	 */

	comment = $.trim($('#reasonTxt').val());
	var reasonCd = ($('#med_request_select').val() != null) ? $('#med_request_select').val() : 0;
	var priorityCd = "0";
	if (CERN_MEDS_01.comp.getAllowPriorityAssignment()) {
		priorityCd = ($('#med_request_select_priority').val() != null) ? $('#med_request_select_priority').val() : "0";
	}
	var nurseUnitCd = (criterion.svc_loc_cd != null) ? criterion.svc_loc_cd : 0;

	var med_request_alert = {};
	var admType = CERN_MEDS_01.comp.getAdmType();
	med_request_alert.adm_type_flag = admType.getTypeIndicator();

	var reqMeds = [];
	var reqMed = {};
	reqMed.order_id = order.PARENTORDERID + ".0";
	reqMed.item_id = (order.ORDERITEMS && order.ORDERITEMS.length == 1) ? order.ORDERITEMS[0].ITEMID + ".0" : "0.0";
	reqMed.requestor_prsnl_id = criterion.provider_id + ".0";
	reqMed.service_loc_cd = nurseUnitCd + ".0";
	var currentDate = new Date();
	reqMed.request_dt_tm = currentDate.format("dd-mmm-yyyy HH:MM:ss");
	reqMed.reason_cd = reasonCd + ".0";
	reqMed.priority_cd = priorityCd + ".0";
	reqMed.reason_text = comment;
	reqMed.encounter_id = criterion.encntr_id + ".0";
	reqMeds.push(reqMed);
	med_request_alert.requested_medications = reqMeds;

	var json_object = {};
	json_object.create_med_request_alert_request = med_request_alert;

	MP_ModalDialog.closeModalDialog("vwpMedRequest");
	createMedRequestAlert(json_object, false);
}

/*Function to set selected values in toolbar to med request */
function applyToSelectedMedRequests() {
	var toolBarPriorityNode = $("#medReqToolbarPriority");
	var toolBarReasonNode = $("#medReqToolbarReason");
	$("input[name='med-req-checkbox']:checked").each(function() {
		var self = $(this);
		var medicationRowNode = self.closest(".med-info");

		var reasonNode = medicationRowNode.find(".med-req-reason");
		if (toolBarReasonNode.val()) {
			reasonNode.val(toolBarReasonNode.val());
		}
		if (CERN_MEDS_01.comp.getAllowPriorityAssignment() && toolBarPriorityNode.val()) {
			var priorityNode = medicationRowNode.find(".med-req-priority");
			priorityNode.val(toolBarPriorityNode.val());
		}
	});
	toolBarReasonNode.find('option:first').attr('selected', 'selected');
	toolBarReasonNode.change();
	if (CERN_MEDS_01.comp.getAllowPriorityAssignment() && toolBarPriorityNode.val()) {
		toolBarPriorityNode.find('option:first').attr('selected', 'selected');
		toolBarPriorityNode.change();
	}
}

/*Function to add med request events*/
function handleMedReqEvents() {
	var toolBarPriorityNode = $("#medReqToolbarPriority");
	var toolBarReasonNode = $("#medReqToolbarReason");
	if (CERN_MEDS_01.comp.getAllowPriorityAssignment()) {
		$(".med-req-priority").attr('selectedIndex', -1);
	}
	var handleApplyToAllStatusFunc = function() {
		var medReqApplyAllBtn = $("#medReqApplyAll");
		if ((toolBarPriorityNode.val() || toolBarReasonNode.val()) && ($("input[name='med-req-checkbox']:checked").length)) {
			medReqApplyAllBtn.removeAttr('disabled');
		} else {
			medReqApplyAllBtn.attr('disabled', 'disabled');
		}
	};
	toolBarPriorityNode.change(handleApplyToAllStatusFunc);
	toolBarReasonNode.change(handleApplyToAllStatusFunc);
	$("input[name='med-req-checkbox']").change(function() {
		handleApplyToAllStatusFunc();
		var self = $(this);
		var medicationRowNode = self.closest(".med-info");
		var commentObj = medicationRowNode.find(".med-req-comment");
		var reasonObj = medicationRowNode.find(".med-req-reason");

		if (self.is(":checked")) {
			commentObj.removeAttr('disabled');
			reasonObj.removeAttr('disabled');
			if (CERN_MEDS_01.comp.getAllowPriorityAssignment()) {
				medicationRowNode.find(".med-req-priority").removeAttr('disabled').val(CERN_MEDS_01.comp.getDefaultPriorityCd());
			}
			medicationRowNode.addClass('med-req-checkbox-checked');
		} else {
			commentObj.attr('disabled', 'disabled').val('');
			reasonObj.attr('disabled', 'disabled').val('');
			if (CERN_MEDS_01.comp.getAllowPriorityAssignment()) {
				medicationRowNode.find(".med-req-priority").attr('disabled', 'disabled').attr('selectedIndex', -1);
			}
			medicationRowNode.removeClass('med-req-checkbox-checked');
		}

		if ($("input[name='med-req-checkbox']:checked").length) {
			$("#medRequestMultiSubmit").removeAttr('disabled');
			$("#medReqClearAll").removeAttr('disabled');
			setModifiedFlag(1);
		} else {
			$("#medRequestMultiSubmit").attr('disabled', 'disabled');
			$("#medReqClearAll").attr('disabled', 'disabled');
			setModifiedFlag(0);
		}
	});
}

function setModifiedFlag(bModified) {
	try {
		var fwObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
		fwObj.SetPendingData(bModified);
	} catch (err) {
		MP_Util.LogError("Error creating PVFRAMEWORKLINK window <br />Message: " + err.description + "<br />Name: " + err.name + "<br />Number: " + (err.number & 65535) + "<br />Description: " + err.description);
	}
};

// wrapper to clear med request input fields.
function clearMedRequestInputFields() {
	//Reset all the med request fields.
	$("input[name='med-req-checkbox']:checked").attr('checked', false).change();
}

// wrapper to generate the multiple med request alerts
function generateMultipleMedRequestAlerts() {
	var criterion = CERN_MEDS_01.comp.getCriterion();

	/*
	 [request]
	 1 encntr_id = f8
	 1 reason_cd = f8
	 1 text = vc
	 1 ord[*]
	 order_id = f8
	 */
	var nurseUnitCd = (criterion.svc_loc_cd != null) ? criterion.svc_loc_cd : 0;
	var currentDate = new Date();
	var requestedDateTime = currentDate.format("dd-mmm-yyyy HH:MM:ss");
	var admType = CERN_MEDS_01.comp.getAdmType();
	var reqMeds = [];
	
	//Disable submit button
	$("#medRequestMultiSubmit").attr('disabled', 'disabled');	
	$("input[name='med-req-checkbox']:checked").each(function() {
		var self = $(this);
		var medicationRowNode = self.closest(".med-info");
		var commentObj = medicationRowNode.find(".med-req-comment");
		var reasonObj = medicationRowNode.find(".med-req-reason");
		var comment = $.trim(commentObj.val());
		var reasonCd = (reasonObj.val() != null) ? reasonObj.val() : 0;
		var priorityCd = "0";
		if (CERN_MEDS_01.comp.getAllowPriorityAssignment()) {
			var priorityObj = medicationRowNode.find(".med-req-priority");
			priorityCd = (priorityObj.val() != null) ? priorityObj.val() : "0";
		}
		var reqMed = {};
		reqMed.order_id = medicationRowNode.attr("data-parent-order-id") + ".0";
		reqMed.item_id = "0.0";
		reqMed.requestor_prsnl_id = criterion.provider_id + ".0";
		reqMed.service_loc_cd = nurseUnitCd + ".0";

		reqMed.request_dt_tm = requestedDateTime;
		reqMed.reason_cd = reasonCd + ".0";
		reqMed.priority_cd = priorityCd + ".0";
		reqMed.reason_text = comment;
		reqMed.encounter_id = criterion.encntr_id + ".0";
		reqMeds.push(reqMed);
	});

	var med_request_alert = {};

	med_request_alert.adm_type_flag = admType.getTypeIndicator();

	med_request_alert.requested_medications = reqMeds;

	var json_object = {};
	json_object.create_med_request_alert_request = med_request_alert;
	createMedRequestAlert(json_object, true);
}

function createMedRequestAlert(medRequestAlertJsonObj, sendAsBlobIn) {
	var sendAr = [];
	var json_request = JSON.stringify(medRequestAlertJsonObj);
	//Format dates nicely for easy conversion on ccl side using cnvtdatetime
	//Also, it is necessary the dates be wrapped in a carrot character (^) in order to be distinguished as strings
	if (sendAsBlobIn) {
		sendAr.push("^MINE^", "^CREATE_MED_REQUEST_ALERT^", "^^");
		SetMedRequestALertWrapper(CERN_MEDS_01.comp, sendAr, json_request, false);
	} else {
		sendAr.push("^MINE^", "^CREATE_MED_REQUEST_ALERT^", "^" + json_request + "^");
		SetMedRequestALertWrapper(CERN_MEDS_01.comp, sendAr);
	}
}

function eliminateDuplicates(arr) {
	var i, len = arr.length, out = [], obj = {};

	for ( i = 0; i < len; i++) {
		obj[arr[i]] = 0;
	}
	for (i in obj) {
		out.push(i);
	}
	return out;
}

function SortByMedReqDtTm(a, b) {
	var aDtTm = new Date();
	aDtTm.setISO8601(a.MED_REQ_DT_TM);
	var bDtTm = new Date();
	bDtTm.setISO8601(b.MED_REQ_DT_TM);

	var aDtTmInMillis = aDtTm.getTime()
	var bDtTmInMillis = bDtTm.getTime();

	if (aDtTmInMillis < bDtTmInMillis)
		return 1;
	else if (aDtTmInMillis > bDtTmInMillis)
		return -1;
	return 0;
}

function SortByAlertUpdateDtTm(a, b) {
	var aDtTm = new Date();
	aDtTm.setISO8601(a.UPDATE_DT_TM);
	var bDtTm = new Date();
	bDtTm.setISO8601(b.UPDATE_DT_TM);

	var aDtTmInMillis = aDtTm.getTime()
	var bDtTmInMillis = bDtTm.getTime();

	if (aDtTmInMillis < bDtTmInMillis)
		return 1;
	else if (aDtTmInMillis > bDtTmInMillis)
		return -1;
	return 0;
}

function GetDisplayByValue(cd, code_ar) {
	for (var i = 0; i < code_ar.length; i++) {
		if (cd == code_ar[i].name) {
			return code_ar[i].value.display;
		}
	}

	return "Unknown";
}

function GetMedReqStatusDisplayByValue(cd, code_ar, ackHrs) {
	var display;
	for (var i = 0; i < code_ar.length; i++) {
		if (cd == code_ar[i].name) {
			switch(code_ar[i].value.meaning) {
				case "PENDING":
					display = i18n.MED_REQ_PENDING;
					break;
				case "INPROCESS":
					display = i18n.MED_REQ_INVESTIGATE;
					break;
				case "COMPLETE":
					display = (ackHrs < 1) ? i18n.MED_REQ_ACK : null;
					break;
				default:
					display = null;
			}
			break;
		}
	}

	return display;
}

function getMedRequestDetailsByItem(itemId) {
	var itemFound;
	var medReqDetail = new Object();

	var alerts = CERN_MEDS_01.comp.getAlerts();
	if (alerts != null) {
		alerts.sort(SortByAlertUpdateDtTm);

		for (var x = 0 in alerts) {
			itemFound = false;
			var alert = alerts[x];
			alert.MED_REQUEST.sort(SortByMedReqDtTm);
			for (var y = 0 in alert.ITEMS) {
				var item = alert.ITEMS[y];
				if (item.INV_ITEM_ID == itemId) {
					itemFound = true;
					break;
				}
			}
			if (itemFound) {
				//debugger;
				if (alert.MED_REQUEST.length > 0)
					medReqDetail.MED_REQ = alert.MED_REQUEST[0];
				medReqDetail.STATUS = GetMedReqStatusDisplayByValue(alert.ALERT_STATUS_CD, CERN_MEDS_01.comp.alertStatusCodeSet, alert.LAST_UPDT_HRS);
				if (medReqDetail.STATUS == null) {
					medReqDetail.MED_REQ = null;
				}
				//break;
				return medReqDetail;
			}
		}
	}
}

// wrapper to retrieve the med request alert
function retrieveMedRequestAlert() {
	var sendAr = [];
	var comment = "";
	var startDate = new Date();
	startDate.setTime(startDate.getTime() - (48 * 3600000.0));
	//look back is 48 hours by default
	var endDate = new Date();
	var criterion = CERN_MEDS_01.comp.getCriterion();
	var nurseUnitCd = (criterion.svc_loc_cd != null) ? criterion.svc_loc_cd : 0;
	var code = MP_Util.GetCodeByMeaning(CERN_MEDS_01.comp.alertTypeCodeSet, "MEDREQ");

	var medReqTypeCd = (code) ? code.codeValue : 0;

	var items = [];
	var alertStatus = [];

	var orders = CERN_MEDS_01.comp.getOrders();
	//Spin through the orders and get all the items
	for (var x = 0 in orders) {
		var order = orders[x];
		for (var k = 0 in order.ORDERITEMS) {
			var orderItem = order.ORDERITEMS[k];
			items.push(orderItem.ITEMID);
		}
	}
	items = eliminateDuplicates(items);

	var med_request_alert = new Object();
	var admType = CERN_MEDS_01.comp.getAdmType();
	med_request_alert.start_dt_tm = startDate.format("dd-mmm-yyyy HH:MM:ss");
	med_request_alert.end_dt_tm = endDate.format("dd-mmm-yyyy HH:MM:ss");
	med_request_alert.encounter_id = criterion.encntr_id + ".0";

	var locArray = [];
	var loc = new Object();
	loc.service_location_cd = nurseUnitCd + ".0";
	locArray.push(loc);
	med_request_alert.locations = locArray;

	var typeArray = [];
	var type = new Object();
	type.alert_type_cd = medReqTypeCd + ".0";
	typeArray.push(type);
	med_request_alert.alert_types = typeArray;

	var statusArray = [];
	for (var k = 0 in CERN_MEDS_01.comp.alertStatusCodeSet) {
		var status = new Object();
		status.alert_status_cd = CERN_MEDS_01.comp.alertStatusCodeSet[k].value.codeValue + ".0";
		statusArray.push(status);
	}
	med_request_alert.alert_statuses = statusArray;

	var sevArray = [];
	for (var k = 0 in CERN_MEDS_01.comp.alertSevCodeSet) {
		var sev = new Object();
		sev.alert_severity_cd = CERN_MEDS_01.comp.alertSevCodeSet[k].value.codeValue + ".0";
		sevArray.push(sev);
	}
	med_request_alert.alert_severities = sevArray;

	med_request_alert.return_all_critical_alerts_ind = 0;
	med_request_alert.return_audit_history_ind = 0;
	med_request_alert.return_activity_history_ind = 1;

	var itemArray = [];
	for (var k = 0 in items) {
		var item = new Object();
		item.inv_item_id = items[k] + ".0";
		itemArray.push(item);
	}
	med_request_alert.items = itemArray;

	var searchCriteria = new Object();
	searchCriteria.search_criteria = med_request_alert;
	var json_object = new Object();

	json_object.get_med_request_alert_request = searchCriteria;

	var json_request = JSON.stringify(json_object);

	//Format dates nicely for easy conversion on ccl side using cnvtdatetime
	//Also, it is necessary the dates be wrapped in a carrot character (^) in order to be distinguished as strings
	sendAr.push("^MINE^", "^GET_MED_REQUEST_ALERT^", "^" + json_request + "^");
	SetGetMedRequestALertWrapper(CERN_MEDS_01.comp, sendAr);
}

//Wrapper to retrieve med request routed to PPM from order id
function getPhaMedRequest(orderId) {
	var phaMedRequestList = CERN_MEDS_01.comp.getPhaMedRequests();
	var noOfMedRequest = (phaMedRequestList) ? phaMedRequestList.length : 0;
	for (var i = 0; i < noOfMedRequest; i++) {
		if (phaMedRequestList[i].ORDER_ID == orderId && phaMedRequestList[i].MED_REQUEST_LIST.length > 0) {
			return phaMedRequestList[i].MED_REQUEST_LIST[0];
		}
	}
	return null;
}

// wrapper to retrieve latest med request routed to PPM
function retrievePhaMedRequest() {
	var sendAr = [];

	var order_list = [];

	var orders = CERN_MEDS_01.comp.getOrders();
	var noOfOrders = (orders) ? orders.length : 0;
	//Spin through the orders and create order list
	for (var x = 0; x < noOfOrders; x++) {
		var order = {};
		order.order_id = orders[x].PARENTORDERID + ".0";
		order_list.push(order);
	}

	var json_object = {};

	json_object.get_pha_med_req_request = {};
	json_object.get_pha_med_req_request.order_list = order_list;
	json_object.get_pha_med_req_request.look_back_hours = 48;

	var json_request = JSON.stringify(json_object);

	sendAr.push("^MINE^", "^GET_PHA_MED_REQUEST^", "^" + json_request + "^");
	SetGetPhaMedRequestWrapper(CERN_MEDS_01.comp, sendAr);
}

function SetGetPhaMedRequestWrapper(component, paramAr) {
	var TimerName_GET_PHA_MED_REQ = "ENG:MPG.RXS.GET_PHA_MED_REQ - retrieve data";
	var timerGetPhaMedReqData = MP_Util.CreateTimer(TimerName_GET_PHA_MED_REQ);

	var info = new XMLCclRequest();
	info.onreadystatechange = function() {
		if (info.readyState == 4 && info.status == 200) {
			try {
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "S") {
					component.setPhaMedRequests(recordData.ORDER_LIST);
				} else {
					alert(recordData.transaction_status.debug_error_message);
				}
			} catch (err) {
				if (timerGetPhaMedReqData) {
					timerGetPhaMedReqData.Abort();
					timerGetPhaMedReqData = null;
				}
			} finally {
				if (timerGetPhaMedReqData)
					timerGetPhaMedReqData.Stop();
			}
		} else if (info.readyState == 4 && info.status != 200) {
			if (timerGetPhaMedReqData)
				timerGetPhaMedReqData.Abort();
		}
	}
	info.open('GET', "ADM_ADAPTER_CCL_DRIVER", false);
	info.send(paramAr.join(","));
}

function getPhaPendingMedRequestCnt(orderId) {
	var phaMedRequestsCntList = CERN_MEDS_01.comp.getPhaPendingMedRequestsCnt();
	for (var j = 0; j < phaMedRequestsCntList.length; j++) {
		if (orderId == phaMedRequestsCntList[j].ORDER_ID) {
			return phaMedRequestsCntList[j].PENDING_MED_REQUEST_CNT;
		}
	}
	return 0;
}

// wrapper to retrieve pha pending med request count
function retrievePhaPendingMedRequestCnt() {
	var sendAr = [];

	var order_list = [];

	var orders = CERN_MEDS_01.comp.getOrders();
	var noOfOrders = (orders) ? orders.length : 0;
	//Spin through the orders and create order list
	for (var x = 0; x < noOfOrders; x++) {
		var order = {};
		order.order_id = orders[x].PARENTORDERID + ".0";
		order_list.push(order);
	}

	var json_object = {};

	json_object.get_pha_med_req_cnt_request = {};
	json_object.get_pha_med_req_cnt_request.order_list = order_list;

	var json_request = JSON.stringify(json_object);

	sendAr.push("^MINE^", "^GET_PHA_PENDING_MED_REQ_CNT^", "^" + json_request + "^");
	SetGetPhaMPendingedRequestCntWrapper(CERN_MEDS_01.comp, sendAr);
}

function SetGetPhaMPendingedRequestCntWrapper(component, paramAr) {
	var TimerName_GET_PHA_MED_REQ_PENDING_COUNT = "ENG:MPG.RXS.GET_PHA_MED_REQ_PENDING_COUNT - retrieve count";
	var timerPendingCount = MP_Util.CreateTimer(TimerName_GET_PHA_MED_REQ_PENDING_COUNT);

	var info = new XMLCclRequest();
	info.onreadystatechange = function() {
		if (info.readyState == 4 && info.status == 200) {
			try {
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "S") {
					component.setPhaPendingMedRequestsCnt(recordData.ORDER_LIST);
				} else {
					alert(recordData.transaction_status.debug_error_message);
				}
			} catch (err) {
				if (timerPendingCount) {
					timerPendingCount.Abort();
					timerPendingCount = null;
				}
			} finally {
				if (timerPendingCount)
					timerPendingCount.Stop();
			}
		} else if (info.readyState == 4 && info.status != 200) {
			if (timerPendingCount)
				timerPendingCount.Abort();
		}
	}
	info.open('GET', "ADM_ADAPTER_CCL_DRIVER", false);
	info.send(paramAr.join(","));
}

//Modal window to create a med request for the current order selected
function showMedRequestModal(orderId) {
	var order;
	//Create the scratchPad Modal Dialog
	var orders = CERN_MEDS_01.comp.getOrders();
	for (var k in orders) {
		if (orders[k].PARENTORDERID == orderId) {
			order = orders[k];
			break;
		}
	}
	var medRequestObject = MP_ModalDialog.retrieveModalDialogObject("vwpMedRequest");
	if (medRequestObject) {
		MP_ModalDialog.deleteModalDialogObject("vwpMedRequest");
	}
	var mdUtil = new ModalDialog("vwpMedRequest");
	mdUtil.setIconClass("scratchpad-util-icon").setIconText(i18n.MED_REQ_TEXT).setIconHoverText(i18n.MED_REQ_TEXT).setIconElementId("vwpMedRequestIcon").setRightMarginPercentage(35).setLeftMarginPercentage(23).setIsBodySizeFixed(false).setHeaderTitle(i18n.MED_REQ_HEADER).setHeaderCloseFunction(function() {

		MP_ModalDialog.closeModalDialog("vwpMedRequest");
	});
	mdUtil.setBodyDataFunction(function(mdUtil) {
		var sHtml = "";
		var jsHTML = [];
		jsHTML.push("<div class='med-req-info' parent-order-id=" + order.PARENTORDERID + ">" + i18n.MEDICATION_NAME, ":<br/> ");
		jsHTML.push('<div class="med-request-name-container">' + order.ORDERDISPLAY + '</div>');
		jsHTML.push('<div class="med-request-container">');
		jsHTML.push('<div class="med-request-two-col1">');
		jsHTML.push(BuildMedRequestReason() + '</div>');
		if (CERN_MEDS_01.comp.getAllowPriorityAssignment()) {
			jsHTML.push('<div class="med-request-two-col2">' + BuildMedRequestPriority() + '</div>');
		}
		jsHTML.push('<div class="med-request-two-col"><br/><span>' + i18n.MED_REQ_COMMENT + "</span></div>");
		jsHTML.push('<div class="med-request-two-col med-request-reason">');
		jsHTML.push("<textarea  id='reasonTxt' class='med-request-textarea med-req-comment'  maxlength='255' rows='5' title='" + "' value='" + "todoModalI18n.ADD_NEW_TODO_value" + "'></textarea></div>");
		jsHTML.push('</div></div>');
		sHtml = jsHTML.join("");
		$("#" + mdUtil.getBodyElementId()).html(sHtml);
	});

	//Create the buttons for the modal dialog
	var buttonOk = new ModalButton("mrOkButton");
	buttonOk.setText("Ok").setIsDithered(false).setOnClickFunction(function() {
		generateMedRequestAlert(order);
	}).setCloseOnClick(false);
	mdUtil.addFooterButton(buttonOk);

	var buttonCancel = new ModalButton("spCancelButton");
	buttonCancel.setText("Cancel").setIsDithered(false)
	//.setOnClickFunction(function () { alert("Cancel Button") })
	.setCloseOnClick(true);
	mdUtil.addFooterButton(buttonCancel);

	MP_ModalDialog.addModalDialogObject(mdUtil);
	MP_ModalDialog.showModalDialog("vwpMedRequest");

}

//Event handling function for when a "Queue" button is pressed
function queueTask(orderTaskId) {
	/*
	 * Toggle the Queue button between
	 * a) "Queue" and "Queue Pending"
	 * b) "Remove from Queue" and "Remove from Queue Pending"
	 */
	if (event.srcElement.value == i18n.ADD_TO_QUEUE) {
		event.srcElement.value = i18n.QUEUED_TASK_PENDING;
		CERN_MEDS_01.comp.m_queueTasksPending++;
	} else if (event.srcElement.value == i18n.QUEUED_TASK_PENDING) {
		event.srcElement.value = i18n.ADD_TO_QUEUE;
		CERN_MEDS_01.comp.m_queueTasksPending--;
	} else if (event.srcElement.value == i18n.REMOVE_FROM_QUEUE) {
		event.srcElement.value = i18n.REMOVE_QUEUED_TASK_PENDING;
		CERN_MEDS_01.comp.m_queueTasksPending++;
	} else if (event.srcElement.value == i18n.REMOVE_QUEUED_TASK_PENDING) {
		event.srcElement.value = i18n.REMOVE_FROM_QUEUE;
		CERN_MEDS_01.comp.m_queueTasksPending--;
	}

	//Enable or disable the Submit Queued Task button based on whether there are any "Queue Pending" orders waiting to be submitted
	if (CERN_MEDS_01.comp.m_queueTasksPending > 0) {
		document.getElementById('setTaskButtonTop').disabled = false;
		document.getElementById('setTaskButtonBottom').disabled = false;
		Util.Style.acss(document.getElementById('setTaskButtonTop'), 'med-queue-button-enabled');
		Util.Style.acss(document.getElementById('setTaskButtonBottom'), 'med-queue-button-enabled');
	} else {
		document.getElementById('setTaskButtonTop').disabled = true;
		document.getElementById('setTaskButtonBottom').disabled = true;
		Util.Style.rcss(document.getElementById('setTaskButtonTop'), 'med-queue-button-enabled');
		Util.Style.rcss(document.getElementById('setTaskButtonBottom'), 'med-queue-button-enabled');
	}
}

//Event handling function for when the "Submit Queued Task" button is pressed
function setTask() {

	//Build the json_object in order to complete the Queue Task request
	var criterion = CERN_MEDS_01.comp.getCriterion();
	var json_object = new Object();
	var admType = CERN_MEDS_01.comp.getAdmType();
	var isRxStation = admType.isRxStation();

	// queue request
	json_object.queue_task_request = new Object();
	json_object.queue_task_request.user = new Object();
	json_object.queue_task_request.task = new Object();

	json_object.queue_task_request.user.person_id = criterion.provider_id + ".0";

	json_object.queue_task_request.task.patient_id = criterion.person_id + ".0";
	json_object.queue_task_request.task.encounter_id = criterion.encntr_id + ".0";
	json_object.queue_task_request.task.task_type_ind = 1;
	json_object.queue_task_request.adm_type_ind = admType.getTypeIndicator();
	json_object.queue_task_request.task.task_details = new Array();

	// dequeue request
	var json_dequeue_object = new Object();
	json_dequeue_object.dequeue_task_request = new Object();
	json_dequeue_object.dequeue_task_request.user = new Object();
	json_dequeue_object.dequeue_task_request.task = new Object();

	json_dequeue_object.dequeue_task_request.user.person_id = criterion.provider_id + ".0";
	json_dequeue_object.dequeue_task_request.adm_type_ind = admType.getTypeIndicator();

	json_dequeue_object.dequeue_task_request.task.task_details = new Array();

	var queue_task_num = 0;
	var dequeue_task_num = 0;
	var queueableTaskOrderIds = CERN_MEDS_01.comp.getQueueableTaskOrderIds();
	//Spin through all of the queueable order ids and if they are marked as pending
	for (var i = 0; i < queueableTaskOrderIds.length; i++) {
		var orderAndTask = queueableTaskOrderIds[i];
		var orderAndTaskIds = orderAndTask.split("|");
		var order_id = orderAndTaskIds[0];
		var task_id = orderAndTaskIds[1];
		var buttonName = "queueButton" + orderAndTask;
		var medInfoRowName = "medInfoRow" + orderAndTask;
		var button = document.getElementById(buttonName);
		if (button.value == i18n.QUEUED_TASK_PENDING) {
			//Order was pending queueing, reset the button and row, and fill out the relevent portion of the json_object
			button.value = isRxStation ? i18n.REMOVE_FROM_QUEUE : i18n.ADD_TO_QUEUE;
			//Call acss(add css) and rss(remove ass) to add the row to reflect the "queued item" indicator background coloring
			var medInfoRow = document.getElementById(medInfoRowName);
			Util.Style.rcss(medInfoRow, "med-order-dequeued");
			Util.Style.acss(medInfoRow, "med-order-queued");

			json_object.queue_task_request.task.task_details[queue_task_num] = new Object();
			json_object.queue_task_request.task.task_details[queue_task_num].task_detail_key_type_ind = 1;
			json_object.queue_task_request.task.task_details[queue_task_num].task_detail_key_value = order_id;
			json_object.queue_task_request.task.task_details[queue_task_num].order_id = order_id;
			json_object.queue_task_request.task.task_details[queue_task_num].task_id = task_id;

			queue_task_num++;
		} else if (button.value == i18n.REMOVE_QUEUED_TASK_PENDING) {
			//Order was pending remove from queue, reset the button and row, and fill out the relevent portion of the json_object
			button.value = i18n.ADD_TO_QUEUE;
			var medInfoRow = document.getElementById(medInfoRowName);
			//Call acss(add css) and rss(remove ass) to add the row to reflect the "dequeued item" indicator background coloring
			Util.Style.rcss(medInfoRow, "med-order-queued");
			Util.Style.acss(medInfoRow, "med-order-dequeued");

			json_dequeue_object.dequeue_task_request.task.task_details[dequeue_task_num] = new Object();
			json_dequeue_object.dequeue_task_request.task.task_details[dequeue_task_num].task_id = task_id;

			dequeue_task_num++;
		}
	}

	//Reset the pending task count and submit button
	CERN_MEDS_01.comp.m_queueTasksPending = 0;
	document.getElementById('setTaskButtonTop').disabled = true;
	document.getElementById('setTaskButtonBottom').disabled = true;
	Util.Style.rcss(document.getElementById('setTaskButtonTop'), 'med-queue-button-enabled');
	Util.Style.rcss(document.getElementById('setTaskButtonBottom'), 'med-queue-button-enabled');

	var sendAr = [];
	if (queue_task_num > 0) {
		var json_request = JSON.stringify(json_object);

		//It is to wrap string and date values in ^ characters so that they will be treated as strings in the ccl layer
		sendAr.push("^MINE^", "^QUEUE_TASK^", "^" + json_request + "^");

		SetTaskCCLRequestWrapper(CERN_MEDS_01.comp, sendAr);
	}

	var deqAr = [];
	if (dequeue_task_num > 0.0) {

		var json_request = JSON.stringify(json_dequeue_object);

		//It is to wrap string and date values in ^ characters so that they will be treated as strings in the ccl layer
		deqAr.push("^MINE^", "^DEQUEUE_TASK^", "^" + json_request + "^");
		SetTaskCCLRequestWrapper(CERN_MEDS_01.comp, deqAr);
	}
}

//A wrapper function that makes the XMLCclRequest call to adm_adapter_ccl_driver for QUEUE_TASK and examines the reply status before
//determining how to handle the reply.
function SetTaskCCLRequestWrapper(component, paramAr) {
	var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

	var info = new XMLCclRequest();
	info.onreadystatechange = function() {
		if (info.readyState == 4 && info.status == 200) {
			try {
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "S") {
					//TODO: Do we need to do anything?
				} else {
					var errorAr = [];
					var statusData = recordData.STATUS_DATA;
					errorAr.push(statusData.STATUS, statusData.SUBEVENTSTATUS.OPERATIONNAME, statusData.SUBEVENTSTATUS.OPERSATIONSTATUS, statusData.SUBEVENTSTATUS.TARGETOBJECTNAME, statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
					var countText = "";
					MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errorAr.join(", ")), component, countText);
				}
			} catch (err) {
				if (timerLoadComponent) {
					timerLoadComponent.Abort();
					timerLoadComponent = null;
				}
			} finally {
				if (timerLoadComponent)
					timerLoadComponent.Stop();
			}
		} else if (info.readyState == 4 && info.status != 200) {
			MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
			if (timerLoadComponent)
				timerLoadComponent.Abort();
		}
	}
	info.open('GET', "ADM_ADAPTER_CCL_DRIVER", true);
	info.send(paramAr.join(","));
}

//A wrapper function that makes the XMLCclRequest call to adm_adapter_ccl_driver for creating MED_REQUEST and examines the reply status before
//determining how to handle the reply.
function SetMedRequestALertWrapper(component, paramAr, blob, async) {
	var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());
	var asynchrounous = async ? async : true;

	var info = new XMLCclRequest();
	info.onreadystatechange = function() {
		if (info.readyState == 4 && info.status == 200) {
			try {
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "S") {
					//TODO: Do we need to do anything?

					//component.HandleSuccess(recordData);
					if (component.getRouteToPPM()) {
						updatePhaMedReqDetails();
					}

				} else {
					var errorAr = [];
					var statusData = recordData.STATUS_DATA;
					errorAr.push(statusData.STATUS, statusData.SUBEVENTSTATUS.OPERATIONNAME, statusData.SUBEVENTSTATUS.OPERSATIONSTATUS, statusData.SUBEVENTSTATUS.TARGETOBJECTNAME, statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
					var countText = "";
					//alert("script failed while creating med request");
					//MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errorAr.join(", ")), component, countText);
				}
			} catch (err) {
				if (timerLoadComponent) {
					timerLoadComponent.Abort();
					timerLoadComponent = null;
				}
			} finally {
				if (timerLoadComponent)
					timerLoadComponent.Stop();
			}
		} else if (info.readyState == 4 && info.status != 200) {
			//MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
			if (timerLoadComponent)
				timerLoadComponent.Abort();
		}
	}
	info.open('GET', "ADM_ADAPTER_CCL_DRIVER", asynchrounous);
	if (blob) {
		info.setBlobIn(blob);
	}
	info.send(paramAr.join(","));
}

//end button functions
//A wrapper function that makes the XMLCclRequest call to adm_adapter_ccl_driver for retrieving MED_REQUEST and examines the reply status before
//determining how to handle the reply.
function SetGetMedRequestALertWrapper(component, paramAr) {
	var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

	var info = new XMLCclRequest();
	info.onreadystatechange = function() {
		if (info.readyState == 4 && info.status == 200) {
			try {
				var jsonEval = JSON.parse(info.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "S") {
					//TODO: Do we need to do anything?
					//MP_ModalDialog.closeModalDialog("vwpMedRequest");
					//alert("request was retrieved successfully");

					component.setAlerts(recordData.ALERTS);
				} else {
					var errorAr = [];
					var statusData = recordData.STATUS_DATA;
					errorAr.push(statusData.STATUS, statusData.SUBEVENTSTATUS.OPERATIONNAME, statusData.SUBEVENTSTATUS.OPERSATIONSTATUS, statusData.SUBEVENTSTATUS.TARGETOBJECTNAME, statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
					var countText = "";
					//alert("error encountered while retrieving med request");
					//MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errorAr.join(", ")), component, countText);
				}
			} catch (err) {
				if (timerLoadComponent) {
					timerLoadComponent.Abort();
					timerLoadComponent = null;
				}
			} finally {
				if (timerLoadComponent)
					timerLoadComponent.Stop();
			}
		} else if (info.readyState == 4 && info.status != 200) {
			//MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
			if (timerLoadComponent)
				timerLoadComponent.Abort();
		}
	}
	info.open('GET', "ADM_ADAPTER_CCL_DRIVER", false);
	info.send(paramAr.join(","));
}

/**
 * Med Waste Component
 * Version: 1.0.0
 * Begin RXSTATION MED AVAILABILITY Med Waste Component Development
 * Note: The med waste component development for Phase III of the CareFusion integration project.
 * Initial Development: 9/9/2011
 * @author Ryan Biller (RB015993)
 */
function MedWasteComponentStyle() {
	this.initByNamespace("med_waste");
}

MedWasteComponentStyle.inherits(ComponentStyle);

function MedWasteComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new MedWasteComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.MEDS_WASTE.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.MEDS_WASTE.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(0);
	this.setLookbackUnitTypeFlag(1);
	//this.m_lookBackHours= 2;	//Default look back will be 2 hours
	//this.m_lookAheadHours = 6;	//Default look ahead will be 6 hours
	CERN_MEDS_WASTE_01.comp = this;
	this.m_user = null;
	this.m_txToWasteIsLoaded = false;

	MedWasteComponent.method("setUser", function(value) {
		this.m_user = value;
		if (value != null) {
			this.InsertData();
		} else {
			CERN_MEDS_WASTE_01.WaitingForAuthentication();
		}
	});
	MedWasteComponent.method("getUser", function() {
		return this.m_user;
	});

	MedWasteComponent.method("setTxToWasteIsLoaded", function(value) {
		this.m_txToWasteIsLoaded = value;
	});
	MedWasteComponent.method("getTxToWasteIsLoaded", function() {
		return this.m_txToWasteIsLoaded;
	});

	MedWasteComponent.method("InsertData", function() {
		//CERN_MEDS_WASTE_01.GetMedWaste(this, "");
		//Go right to rendercomponent for mock version
		var recordData = [];
		CERN_MEDS_WASTE_01.RenderComponent(this, recordData);
	});
	MedWasteComponent.method("HandleSuccess", function(recordData) {
		CERN_MEDS_WASTE_01.RenderComponent(this, recordData);
	});
}

MedWasteComponent.inherits(MPageComponent);

var CERN_MEDS_WASTE_01 = function() {

	var comp = null;

	var curMedTransactionsToWaste = null;
	var curMedTransactionIndex = -1;
	var curWasteTxType = -1;

	return {
		RenderComponent : function(component, recordData) {
			var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());

			try {
				if (component.getUser() == null) {
					CERN_MEDS_WASTE_01.WaitingForAuthentication();
				} else if (component.getUser().USER_INDICATORS.CAN_WASTE_IND == 0) {
					CERN_MEDS_WASTE_01.UserCanNotWaste();
				} else {
					CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions();
				}
			} catch (err) {
				if (timerRenderComponent) {
					timerRenderComponent.Abort();
					timerRenderComponent = null;
				}
				throw (err);
			} finally {
				if (timerRenderComponent)
					timerRenderComponent.Stop();
			}
		},
		WaitingForAuthentication : function() {
			//Display a waiting for authentication message until the component has a valid user
			var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.WAITING_FOR_USER_AUTH + "... </span><br/>";
			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		},
		UserCanNotWaste : function() {
			//Display a waiting for authentication message until the component has a valid user
			var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.USER_CAN_NOT_REMOTE_WASTE + "... </span><br/>";
			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		},
		ShowRetrieveWasteTxOptions : function() {
			var sHTML = "";
			var jsHTML = [];
			var content = [];
			
			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
			jsHTML.push("<input type='button' name='getAllWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetAllTxToWaste()' value='", i18n.RETRIEVE_WASTEABLE_TX, "'>");
			jsHTML.push("<input type='button' name='getUndocumentedWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetUndocumentedTxToWaste()' value='", i18n.RETRIEVE_UNDOCUMENTED_WASTE_TX, "'>");
			
			if(!CERN_USER_MAINT_01.comp.isESMode()){
				jsHTML.push("<br><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.SEARCH_FOR_WASTEABLE_MED, "</span><br/>");
				jsHTML.push("<input type='text' name='wasteableMedSearchText' value=''  onkeydown='CERN_MEDS_WASTE_01.SearchInput_KeyDown()'  > ");
				jsHTML.push("<input type='button' name='wasteableMedSearchButton' onClick='CERN_MEDS_WASTE_01.SearchForMedClicked()' value='", i18n.SEARCH, "'>");
				jsHTML.push("<br/></h3></div>");
			}

			content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		},
		SearchInput_KeyDown : function() {
			if (event.keyCode == 13) {
				document.getElementById('wasteableMedSearchButton').click();
			}
		},
		GetAllTxToWaste : function() {
			var med_id = "";
			var retrieval_type_filter = 2;
			this.curWasteTxType = 1;
			//1 - DFT_TX
			CERN_MEDS_WASTE_01.GetMedTxToWaste(retrieval_type_filter, med_id);
			// 2 - ALL_TX_FILTER_BY_PATIENT		(requires user and patient)
		},
		GetUndocumentedTxToWaste : function() {
			var med_id = "";
			var retrieval_type_filter = 4;
			this.curWasteTxType = 1;
			//1 - DFT_TX
			CERN_MEDS_WASTE_01.GetMedTxToWaste(retrieval_type_filter, med_id);
			// 4 - UNDOC_FILTER_BY_PATIENT		(requires user and patient)
		},
		GetTxToWasteByMed : function(med_id) {
			var retrieval_type_filter = 1;
			this.curWasteTxType = 0;
			//0 - AD_HOC_MED
			CERN_MEDS_WASTE_01.GetMedTxToWaste(retrieval_type_filter, med_id);
			// 1 - FILTER_BY_MED
		},
		GetMedTxToWaste : function(retrieval_type_filter, med_id) {
			//The get transactions to waste can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
			var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.LOADING_DATA + "... </span><br/>";
			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

			if (this.comp.getTxToWasteIsLoaded() == true) {
				//We have already made the call to retrieve the info so just display/filter it as needed.
				this.curMedTransactionIndex = -1;
				CERN_MEDS_WASTE_01.ShowWasteableMedTransactions(this.comp, retrieval_type_filter);
			} else {
				//allTxToWasteLoaded is false, so we need to get med tx to waste info by making retrieval call

				var criterion = this.comp.getCriterion();
				var sendAr = [];

				var retrieve_tx_to_waste_request = new Object();

				var user = new Object();
				user.person_id = criterion.provider_id + ".0";

				retrieve_tx_to_waste_request.user = user;
				retrieve_tx_to_waste_request.patient_id = criterion.person_id + ".0";
				retrieve_tx_to_waste_request.encounter_id = criterion.encntr_id + ".0";
				retrieve_tx_to_waste_request.item_id = med_id;
				retrieve_tx_to_waste_request.order_id = "";
				retrieve_tx_to_waste_request.remove_qty = 0;

				var retrieve_waste_tx_filer_ind = retrieval_type_filter;
				if (retrieve_waste_tx_filer_ind == 4) {
					//The retrieve undocumented waste call is not implemented on the exposed api, instead we  will
					//call the get all tx to waste by patient call and filter that list by the
					retrieve_waste_tx_filer_ind = 2;
				}

				retrieve_tx_to_waste_request.retrieve_waste_tx_filter_ind = retrieve_waste_tx_filer_ind;

				var json_object = new Object();
				json_object.retrieve_tx_to_waste_request = retrieve_tx_to_waste_request;

				var json_request = JSON.stringify(json_object);

				sendAr.push("^MINE^", "^RETRIEVE_TX_TO_WASTE^", "^" + json_request + "^");
				GetTransactionsToWaste(this.comp, sendAr, retrieval_type_filter);
			}
		},
		PrepareSearchForMedToWasteCall : function(searchText) {
			//The search can take a couple seconds, so display a "Searching..." message until it completes to let the user know the system is working
			//TODO: i18n this
			var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>Searching formulary for " + searchText + "... </span><br/>";
			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

			var criterion = this.comp.getCriterion();
			var paramAr = [];

			var user = new Object();
			user.person_id = criterion.provider_id + ".0";

			var search_criteria = new Object();
			search_criteria.patient_id = criterion.person_id + ".0";
			search_criteria.encounter_id = criterion.encntr_id + ".0";
			search_criteria.search_text = searchText;
			search_criteria.user = user;

			var search_item_request = new Object();
			search_item_request.search_criteria = search_criteria;

			var json_object = new Object();
			json_object.search_item_request = search_item_request;

			var json_request = JSON.stringify(json_object);

			paramAr.push("^MINE^", "^SEARCH_ITEM_TO_WASTE^", "^" + json_request + "^");
			SearchForMedToWaste(this.comp, paramAr);
		},
		ShowWasteableMedTransactions : function(component, retrieval_type_filter) {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			var wasteTransactions = this.curMedTransactionsToWaste;
			var numTxToDisplay = 0;

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
			if (wasteTransactions != undefined && wasteTransactions.length > 0) {
				//Sort by remove date/time (and then med name of remove date/time is same)
				wasteTransactions.sort(SortByRemoveDtTm);

				jsHTML.push("<form name=medToWasteRadioForm method='get' action='' onsubmit='return false;'>");
				for (var x = 0 in wasteTransactions) {
					jsHTML.push("<dl class='waste-info'>");
					var medId = wasteTransactions[x].MED_ID;
					//Build the display name if it has yet to be built
					BuildWasteMedDisplayName(wasteTransactions[x]);

					//If the retrieval_type_filter is 4, we want to only display transactions with the "UNDOCUMENTED_WASTE_IND" is set
					//If the current wasteTransaction does not have it set, continue on to the next transaction.
					if (retrieval_type_filter == 4) {
						if (wasteTransactions[x].UNDOCUMENTED_WASTE_IND == 0) {
							continue;
						}
					}

					var removeDateTime = "";
					if (retrieval_type_filter != 1) {
						var removedByAndWhen = i18n.REMOVED_BY_AND_WHEN.replace("{0}", wasteTransactions[x].REMOVED_BY_USER_NAME);
						removedByAndWhen = removedByAndWhen.replace("{1}", wasteTransactions[x].FORMAT_ORIG_RMVED_MED_TX_TIME);
					}

					numTxToDisplay++;

					if (wasteTransactions[x].UNDOCUMENTED_WASTE_IND == 1) {
						jsHTML.push("<dd class='waste-medtxtowaste-undocumented-radio'>");
					} else {
						jsHTML.push("<dd class='waste-medtxtowaste-radio'>");
					}
					var wasteTxIndex = "waste_tx_index|" + x;
					jsHTML.push("<input type='radio' name='medToWasteRadio' onkeydown='CERN_MEDS_WASTE_01.MedToWasteRadio_KeyDown()'  value='" + wasteTxIndex + "'>" + wasteTransactions[x].DISPLAY_NAME + " (" + removedByAndWhen + ")</dd><br>");
					jsHTML.push("</dl>");
				}
				if (numTxToDisplay > 0) {
					jsHTML.push("<input type='button' name='wasteSelectedMedButton' onClick='CERN_MEDS_WASTE_01.WasteSelectedMedication()' value='", i18n.WASTE_MED, "'>");
				} else {
					jsHTML.push(i18n.NO_WASTEABLE_TRANSACTIONS_QUALIFY_FOR_DISPLAY);
				}
				jsHTML.push("</form>");
			} else {
				jsHTML.push(i18n.NO_WASTEABLE_TRANSACTIONS_FOUND);
			}
			jsHTML.push("<br/></h3></div>");

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
			jsHTML.push("<input type='button' name='getAllWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetAllTxToWaste()' value='", i18n.RETRIEVE_WASTEABLE_TX, "'>");
			jsHTML.push("<input type='button' name='getUndocumentedWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetUndocumentedTxToWaste()' value='", i18n.RETRIEVE_UNDOCUMENTED_WASTE_TX, "'>");

			jsHTML.push("<br><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.SEARCH_FOR_WASTEABLE_MED, "</span><br/>");
			jsHTML.push("<input type='text' name='wasteableMedSearchText' value=''  onkeydown='CERN_MEDS_WASTE_01.SearchInput_KeyDown()'  > ");
			jsHTML.push("<input type='button' name='wasteableMedSearchButton' onClick='CERN_MEDS_WASTE_01.SearchForMedClicked()' value='", i18n.SEARCH, "'>");
			jsHTML.push("<br/></h3></div>");

			content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		},
		MedToWasteRadio_KeyDown : function() {
			if (event.keyCode == 13)
				document.getElementById('wasteSelectedMedButton').click();
		},
		ShowSearchResultsForm : function(searchResults) {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
			if (searchResults.length > 0) {
				jsHTML.push("<form name=searchResultsRadioForm method='get' action='' onsubmit='return false;'>");
				for (var x = 0 in searchResults) {
					jsHTML.push("<dl class='waste-info'>");
					var itemDescription = searchResults[x].DESCRIPTION;
					var itemBrandName = searchResults[x].BRAND_NAME;
					var itemIdentifier = searchResults[x].ITEM_IDENTIFIER;
					var searchResultDisplay = itemDescription + " (" + itemBrandName + ")";

					jsHTML.push("<dd class='waste-medtxtowaste-radio'><input type='radio' name='searchResultRadio' value='" + itemIdentifier + "'>" + searchResultDisplay + "</dd><br>");
					jsHTML.push("</dl>");
				}
				jsHTML.push("<input type='button' name='confirmSearchSelectionButton' onClick='CERN_MEDS_WASTE_01.WasteSelectedSearchResult()' value='", i18n.WASTE_MED, "'>");
				jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CLEAR_SEARCH_RESULTS, "'>");
				jsHTML.push("</form>");
			} else {
				jsHTML.push(i18n.NO_WASTEABLE_TRANSACTIONS_FOUND);
			}
			jsHTML.push("<br/></h3></div>");

			jsHTML.push("<br><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.SEARCH_FOR_WASTEABLE_MED, "</span><br/>");
			jsHTML.push("<input type='text' name='wasteableMedSearchText' value=''  onkeydown='CERN_MEDS_WASTE_01.SearchInput_KeyDown()'  > ");
			jsHTML.push("<input type='button' name='wasteableMedSearchButton' onClick='CERN_MEDS_WASTE_01.SearchForMedClicked()' value='", i18n.SEARCH, "'>");
			jsHTML.push("<br/></h3></div>");

			content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		},
		WasteSelectedSearchResult : function() {
			var length = document.searchResultsRadioForm.searchResultRadio.length;
			var medId = new String();
			for ( i = 0; i < length; i++) {
				if (document.searchResultsRadioForm.searchResultRadio[i].checked) {
					medId = document.searchResultsRadioForm.searchResultRadio[i].value;
					break;
				}
			}

			//Handle the case where the list of radio buttons was just a single radio button so is not stored in an array
			if (length == null) {
				if (document.searchResultsRadioForm.searchResultRadio != null) {
					if (document.searchResultsRadioForm.searchResultRadio.checked) {
						medId = document.searchResultsRadioForm.searchResultRadio.value;
					}
				}
			}
			if (medId.length > 0) {
				this.GetTxToWasteByMed(medId);
			}
		},
		SearchForMedClicked : function() {
			var searchText = new String(document.getElementById('wasteableMedSearchText').value);

			if (searchText.length > 0) {
				this.PrepareSearchForMedToWasteCall(searchText);
			}

		},
		WasteSelectedMedication : function() {
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
				for ( i = 0; i < length; i++) {
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
				var wasteTxIndex = new Number(radioValueArray[1]);
				//get the index value that was built into the id in the format "waste_tx_index|#" where # is the index value
				if (wasteTxIndex >= 0) {
					this.curMedTransactionIndex = wasteTxIndex;
				}

				//If the curMedTrnasactionIndex variable has been set, we have a valid selection and we can move on
				if (this.curMedTransactionIndex >= 0) {
					this.ShowAmountGivenForm();
				}
			}
		},
		ShowAmountRemovedForm : function() {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			var amountUnitsOfMeasure = this.curMedTransactionsToWaste[this.curMedTransactionIndex].AMOUNT_UNITS_OF_MEASURE;

			BuildWasteMedDisplayName(this.curMedTransactionsToWaste[this.curMedTransactionIndex]);

			jsHTML.push("<table id='WasteMedInfoDisplayTable' cellspacing='1' cellpadding='0' border='1'>");
			jsHTML.push("<tr><td><table><tr><td class='waste-med-info-title'>", i18n.WASTE_MEDICATION_NAME, "</td></tr>");
			jsHTML.push("<tr><td class='waste-med-info-data'>", this.curMedTransactionsToWaste[this.curMedTransactionIndex].DISPLAY_NAME, "</td></tr></table></td></tr></table>");

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><form name=amountGivenForm method='get' action='' onsubmit='return false;'>");
			jsHTML.push("<span class='sub-sec-title'>", i18n.PLEASE_ENTER_AMOUNT_REMOVED, "</span><br/>");
			jsHTML.push("<span class='sub-sec-title'>", i18n.AMOUNT_REMOVED, "</span><br/>");
			jsHTML.push("<input type='text' name='amntRemovedInput' value='' onkeydown='CERN_MEDS_WASTE_01.AmntRemovedInput_KeyDown()' onfocus=CERN_MEDS_WASTE_01.EnableRemoveButton()><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");

			if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].WITNESS_REQUIRED_IND == 1) {
				jsHTML.push("<span class='waste-warning-text'>", i18n.WITNESS_REQURED, "</span><br/>");
			}

			jsHTML.push("<input type='button' name='removeButton' disabled=true onClick='CERN_MEDS_WASTE_01.ProcessRemoveAmountInput()' value='", i18n.OK, "'>");
			jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
			jsHTML.push("</form><br/></h3></div>");

			content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

			//TODO: This is not actually setting focus like we want
			//document.getElementById('amntRemovedInput').focus();
		},
		AmntRemovedInput_KeyDown : function() {
			if (event.keyCode == 13) {
				document.getElementById('removeButton').click();
			}
		},
		EnableRemoveButton : function() {
			document.getElementById('removeButton').disabled = false;
		},
		ShowAmountGivenForm : function() {
			if (this.curMedTransactionIndex >= 0) {
				var sHTML = "";
				var jsHTML = [];
				var content = [];

				jsHTML = BuildWasteMedInfoDisplay(this.curMedTransactionsToWaste, this.curMedTransactionIndex, false);

				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><form name=amountGivenForm method='get' action='' onsubmit='return false;'>");
				jsHTML.push("<span class='sub-sec-title'>", i18n.PLEASE_ENTER_AMOUNT_GIVEN, "</span><br/>");
				jsHTML.push("<span class='sub-sec-title'>", i18n.AMOUNT_GIVEN, "</span><br/>");
				var amountUnitsOfMeasure = this.curMedTransactionsToWaste[this.curMedTransactionIndex].AMOUNT_UNITS_OF_MEASURE;
				//TODO: figure out how to limit amount input to numers only
				jsHTML.push("<input type='text' name='amntGivenInput' value='' onkeydown='CERN_MEDS_WASTE_01.AmntGivenInput_KeyDown()' onkeypress='return CERN_MEDS_WASTE_01.isNumberKey(event)' onfocus='CERN_MEDS_WASTE_01.EnableWasteButton()' onblur='CERN_MEDS_WASTE_01.CalculateWasteAmount(this.value)'><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");

				jsHTML.push("<span class='sub-sec-title'>", i18n.AMOUNT_WASTED, "</span><br/>");
				jsHTML.push("<input disabled type='text' name='amntToWasteInput' value='''><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");

				jsHTML.push(i18n.CREDIT_PATIENT, "<input type='checkbox' disabled=true name='creditPatientCheckbox' value=''><br>");

				if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].WITNESS_REQUIRED_IND == 1) {
					jsHTML.push("<span class='waste-warning-text'>", i18n.WITNESS_REQURED, "</span><br/>");
				}

				jsHTML.push("<input type='button' name='wasteButton' disabled=true onClick='CERN_MEDS_WASTE_01.ProcessWasteAmountInput()' value='", i18n.WASTE_BUTTON, "'>");
				jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
				jsHTML.push("</form><br/></h3></div>");

				content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
				sHTML = content.join("");

				MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

				//TODO: This is not actually setting focus like we want
				//document.getElementById('amntGivenInput').select();
			}
		},
		AmntGivenInput_KeyDown : function() {
			if (event.keyCode == 13) {
				CERN_MEDS_WASTE_01.CalculateWasteAmount(document.getElementById('amntGivenInput').value)
				document.getElementById('wasteButton').click();
			}
		},
		EnableWasteButton : function() {
			document.getElementById('wasteButton').disabled = false;
		},
		CalculateWasteAmount : function(amountGiven) {
			if (amountGiven != "") {
				var numberFormat = new NumberFormat();
				var roundedAmountGiven = numberFormat.format(amountGiven);
				document.getElementById('amntGivenInput').value = roundedAmountGiven

				//TODO: figure out how to limit amount input to numers only
				var curMedWasteTransaction = CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex];
				var wasteAmount = numberFormat.format(curMedWasteTransaction.REMAINING_AMOUNT - roundedAmountGiven);
				if (roundedAmountGiven < 0) {
					alert(i18n.AMOUNT_GIVEN_IS_NEGATIVE);
					this.ClearEnterAmountGivenScreen();
				} else if (wasteAmount > 0) {
					document.getElementById('amntToWasteInput').value = wasteAmount;
					document.getElementById('wasteButton').disabled = false;
					this.SetCreditPatientAvailability(wasteAmount);
				} else {
					var invalidGivenAmountMessage = i18n.AMOUNT_GIVEN_TOO_LARGE.replace("{0}", roundedAmountGiven);
					invalidGivenAmountMessage = invalidGivenAmountMessage.replace("{1}", numberFormat.format(curMedWasteTransaction.REMAINING_AMOUNT));
					alert(invalidGivenAmountMessage);
					this.ClearEnterAmountGivenScreen();
				}
			} else {
				this.ClearEnterAmountGivenScreen();
			}
		},
		isNumberKey : function(event) {
			var charCode = (event.which) ? event.which : event.keyCode;
			if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
				return false;
			}
			return true;
		},
		ClearEnterAmountGivenScreen : function() {
			document.getElementById('amntToWasteInput').value = "";
			document.getElementById('amntGivenInput').value = "";
			document.getElementById('wasteButton').disabled = true;
			document.getElementById('creditPatientCheckbox').disabled = true;
			document.getElementById('creditPatientCheckbox').checked = false;
		},
		SetCreditPatientAvailability : function(amountWasted) {
			var iNonAdminAmt = 0;

			//Check CareFusion can_credit_waste_ind for user
			if (CERN_MEDS_WASTE_01.comp.getUser().USER_INDICATORS.CAN_CREDIT_WASTE_IND == 1) {
				var wasteItem = CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex];
				if (wasteItem.STRENGTH > 0.0005) {
					iNonAdminAmt = Math.floor((amountWasted / wasteItem.STRENGTH) + 0.0000005);
					if ((amountWasted / wasteItem.STRENGTH) > (iNonAdminAmt + 0.0005))
						iNonAdminAmt = 0;
					// disallow partial credit
				} else if (wasteItem.VOLUME > 0.0005) {
					iNonAdminAmt = Math.floor(amountWasted / wasteItem.VOLUME);
					if ((amountWasted / wasteItem.VOLUME) > (iNonAdminAmt + 0.0005))
						iNonAdminAmt = 0;
					// disallow partial credit
				} else {
					iNonAdminAmt = Math.floor(amountWasted);
					if (amountWasted > (iNonAdminAmt + 0.0005))
						iNonAdminAmt = 0;
					// disallow partial credit
				}
			}

			if (iNonAdminAmt == 0) {
				document.getElementById('creditPatientCheckbox').disabled = true;
				document.getElementById('creditPatientCheckbox').checked = false;
			} else {
				document.getElementById('creditPatientCheckbox').disabled = false;
			}
		},
		ProcessRemoveAmountInput : function() {
			var removeAmount = document.getElementById('amntRemovedInput').value;
			if (removeAmount != "") {
				removeAmount = new Number(removeAmount);
				if (removeAmount > 0) {
					this.curMedTransactionsToWaste[this.curMedTransactionIndex].REMOVE_AMOUNT = removeAmount;
					this.curMedTransactionsToWaste[this.curMedTransactionIndex].REMAINING_AMOUNT = removeAmount;
					this.ShowAmountGivenForm();
				} else {
					this.ShowAmountRemovedForm();
				}
			} else {
				alert("Please enter the quantity removed in order to continue.");
				//TODO: i18n this
				document.getElementById('amntRemovedInput').value = "";
				document.getElementById('wasteButton').disabled = true;
			}
		},
		ProcessWasteAmountInput : function() {
			var wasteAmount = document.getElementById('amntToWasteInput').value;
			var giveAmount = document.getElementById('amntGivenInput').value;
			if (wasteAmount != "" && giveAmount != "") {
				if (wasteAmount > 0) {
					if (document.amountGivenForm.creditPatientCheckbox.checked) {
						this.curMedTransactionsToWaste[this.curMedTransactionIndex].PATIENT_CREDITED_IND = 1;
					} else {
						this.curMedTransactionsToWaste[this.curMedTransactionIndex].PATIENT_CREDITED_IND = 0;
					}
					this.curMedTransactionsToWaste[this.curMedTransactionIndex].GIVE_AMOUNT = new Number(giveAmount);
					this.AskCDCQuestions(0);
				} else {
					this.ShowAmountGivenForm();
				}
			} else {
				alert(i18n.PLEASE_ENTER_AMOUNT_GIVEN);
				document.getElementById('amntToWasteInput').value = "";
				document.getElementById('amntGivenInput').value = "";
				document.getElementById('wasteButton').disabled = true;
			}
		},
		AskCDCQuestions : function(index) {
			var curMedWasteTransaction = this.curMedTransactionsToWaste[this.curMedTransactionIndex];
			if (curMedWasteTransaction.CDC_INPUTS.length <= index) {
				this.ShowWitnessScreen();
			} else {
				var curCDCQuestion = curMedWasteTransaction.CDC_INPUTS[index];
				switch (curCDCQuestion.CDC_SELECT_CODE_IND) {
					case 0:
						this.AskFreeTextCDCQuestion(curCDCQuestion, index);
						break;
					case 1:
						this.AskSingleSelectCDCQuestion(curCDCQuestion, index);
						break;
					case 2:
						this.AskMultiSelectCDCQuestion(curCDCQuestion, index);
						break;
					default:
						//TODO: Something better than this
						var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>i18n.ERROR_CONTACT_SYSTEM_ADMIN</span><br/>";

						MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
				}
			}
		},
		AskFreeTextCDCQuestion : function(curCDCQuestion, index) {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.CDC_HEADER, "</span><br/>");
			jsHTML.push(curCDCQuestion.LIST_NAME, " <input type='text' name='wasteCDCAnswer' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value=''><br/>");

			if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].WITNESS_REQUIRED_IND == 1) {
				jsHTML.push("<span class='waste-warning-text'>", i18n.WITNESS_REQURED, "</span><br/>");
			}

			jsHTML.push("<input type='button' name='answerCDCQuestionButton' onClick='CERN_MEDS_WASTE_01.ProcessFreeTextAnswer(", index, ")' value='", i18n.OK, "'>");
			jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
			jsHTML.push("<br/></h3></div>");

			content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		},
		ProcessFreeTextAnswer : function(index) {
			var answerText = new String(document.getElementById('wasteCDCAnswer').value);
			if (answerText.length <= 0) {
				if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].REQUIRED == true) {
					this.AskCDCQuestions(index);
				} else {
					this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].SKIPPED = true;
					this.AskCDCQuestions(index++);
				}
			} else {
				this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].ANSWER_1 = answerText;
				this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].SKIPPED = false;
				this.AskCDCQuestions(++index);
			}
		},
		AskSingleSelectCDCQuestion : function(curCDCQuestion, index) {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.CDC_HEADER, "</span><br/>");
			jsHTML.push(curCDCQuestion.LIST_NAME, "<br/>");

			jsHTML.push("<form name=cdcAnswerRadioForm method='get' action='' onsubmit='return false;'>");
			cdcAnswers = curCDCQuestion.CDC_ANSWERS;
			for (var x = 0 in cdcAnswers) {
				jsHTML.push("<input type='radio' name='cdcAnswerRadio' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value='" + cdcAnswers[x].ANSWER_NAME + "'>" + cdcAnswers[x].ANSWER_NAME + "<br>");
			}
			if (curCDCQuestion.ENTER_IND == 1) {
				jsHTML.push("<input type='checkbox' name='cdcAnswerRadio' value='FreeTextAnswerRadio' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' onclick='if(this.checked){CERN_MEDS_WASTE_01.FreeTextOptionSelected()}'>")
				jsHTML.push("<input type='text' name='freeTextAnswer' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value='Other'><br>");
			}

			if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].WITNESS_REQUIRED_IND == 1) {
				jsHTML.push("<span class='waste-warning-text'>", i18n.WITNESS_REQURED, "</span><br/>");
			}

			jsHTML.push("<input type='button' name='answerCDCQuestionButton' onClick='CERN_MEDS_WASTE_01.ProcessSingleSelectCDCAnswer(" + index + ")' value='", i18n.OK, "'>");
			jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
			jsHTML.push("</form>");
			jsHTML.push("<br/></h3></div>");

			content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		},
		AnswerCDC_KeyDown : function() {
			if (event.keyCode == 13) {
				document.getElementById('answerCDCQuestionButton').click();
			}
		},
		ProcessSingleSelectCDCAnswer : function(index) {
			var answerText = new String();
			var length = document.cdcAnswerRadioForm.cdcAnswerRadio.length;

			//Handle the case where the list of radio buttons was just a single radio button so is not stored in an array
			if (length == null) {
				if (document.cdcAnswerRadioForm.cdcAnswerRadio != null) {
					if (document.cdcAnswerRadioForm.cdcAnswerRadio.checked) {
						answerText = document.cdcAnswerRadioForm.cdcAnswerRadio.value;
					}
				}
			} else {
				for ( i = 0; i < length; i++) {
					if (document.cdcAnswerRadioForm.cdcAnswerRadio[i].checked) {
						answerText = document.cdcAnswerRadioForm.cdcAnswerRadio[i].value;
						break;
					}
				}
			}

			if (answerText.length <= 0) {
				if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].REQUIRED == true) {
					this.AskCDCQuestions(index);
				} else {
					this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].SKIPPED = true;
					this.AskCDCQuestions(index++);
				}
			} else {
				if (answerText == "FreeTextAnswerRadio") {
					answerText = document.getElementById("freeTextAnswer").value;
				}
				this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].ANSWER_1 = answerText;
				this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].SKIPPED = false;
				this.AskCDCQuestions(++index);
			}
		},
		AskMultiSelectCDCQuestion : function(curCDCQuestion, index) {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.CDC_HEADER, "</span><br/>");
			jsHTML.push(curCDCQuestion.LIST_NAME, " (", i18n.PICK_UP_TO_THEE, ") ", "<br/>");

			jsHTML.push("<form name=cdcAnswerCheckboxForm method='get' action='' onsubmit='return false;'>");
			cdcAnswers = curCDCQuestion.CDC_ANSWERS;
			for (var x = 0 in cdcAnswers) {
				jsHTML.push("<input type='checkbox' name='cdcAnswerCheckbox' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value='" + cdcAnswers[x].ANSWER_NAME + "'>" + cdcAnswers[x].ANSWER_NAME + "<br>");
			}
			if (curCDCQuestion.ENTER_IND == 1) {
				jsHTML.push("<input type='checkbox' name='cdcAnswerCheckbox' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value='FreeTextAnswerCheckbox' onclick='if(this.checked){CERN_MEDS_WASTE_01.FreeTextOptionSelected()}'>")
				jsHTML.push("<input type='text' name='freeTextAnswer' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value='Other'><br>");
			}

			if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].WITNESS_REQUIRED_IND == 1) {
				jsHTML.push("<span class='waste-warning-text'>", i18n.WITNESS_REQURED, "</span><br/>");
			}

			jsHTML.push("<input type='button' name='answerCDCQuestionButton' onClick='CERN_MEDS_WASTE_01.ProcessMultiSelectCDCAnswer(" + index + ")' value='", i18n.OK, "'>");
			jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
			jsHTML.push("</form>");
			jsHTML.push("<br/></h3></div>");

			content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		},
		FreeTextOptionSelected : function() {
			document.getElementById("freeTextAnswer").select();
		},
		ProcessMultiSelectCDCAnswer : function(index) {
			var answerText = new String();
			var answerText2 = new String();
			var answerText3 = new String();

			var length = document.cdcAnswerCheckboxForm.cdcAnswerCheckbox.length;

			//Handle the case where the list of radio buttons was just a single radio button so is not stored in an array
			if (length == null) {
				if (document.cdcAnswerRadioForm.cdcAnswerRadio != null) {
					if (document.cdcAnswerCheckboxForm.cdcAnswerCheckbox.checked) {
						answerText = document.cdcAnswerCheckboxForm.cdcAnswerCheckbox.value;
					}
				}
			} else {
				for ( i = 0; i < length; i++) {
					if (document.cdcAnswerCheckboxForm.cdcAnswerCheckbox[i].checked) {
						var answerVal = document.cdcAnswerCheckboxForm.cdcAnswerCheckbox[i].value;
						//If the checkbox that was checked was for the freetext answer, get the free text
						//value that was entered in order to save it as the answerTextX
						if (answerVal == "FreeTextAnswerCheckbox") {
							answerVal = document.getElementById("freeTextAnswer").value;
						}
						if (answerText.length <= 0) {
							answerText = answerVal;
						} else if (answerText2.length <= 0) {
							answerText2 = answerVal;
						} else if (answerText3.length <= 0) {
							answerText3 = answerVal;
							break;
						}
						;
					}
				}
			}

			if (answerText.length <= 0) {
				if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].REQUIRED == true) {
					this.AskCDCQuestions(index);
				} else {
					this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].SKIPPED = true;
					this.AskCDCQuestions(index++);
				}
			} else {
				this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].ANSWER_1 = answerText;
				this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].ANSWER_2 = answerText2;
				this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].ANSWER_3 = answerText3;
				this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].SKIPPED = false;
				this.AskCDCQuestions(++index);
			}
		},
		ShowWitnessScreen : function() {
			if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].WITNESS_REQUIRED_IND == 1) {
				var sHTML = "";
				var jsHTML = [];
				var content = [];

				jsHTML = BuildWasteMedInfoDisplay(this.curMedTransactionsToWaste, this.curMedTransactionIndex, true);
				jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.WITNESS_REQURED, "</span><br/>");
				jsHTML.push(i18n.WITNESS, " <br/><input type='text' onkeydown='CERN_MEDS_WASTE_01.WitnessUserName_KeyDown()' name='wasteWitnessInput' value=''><br/>");
				jsHTML.push(i18n.WITNESS_PASSWORD, " <br/><input type='password' onkeydown='CERN_MEDS_WASTE_01.WitnessUserPassword_KeyDown()' name='wasteWitnessPasswordInput' value=''><br/>");
				jsHTML.push("<input type='button' name='submitWitnessInfoButton' onClick='CERN_MEDS_WASTE_01.EncryptPassword()' value='", i18n.OK, "'>");
				jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
				jsHTML.push("<br/></h3></div>");

				content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
				sHTML = content.join("");

				MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
			} else {
				CERN_MEDS_WASTE_01.PrepareRemoteWasteRequest();
			}
		},
		WitnessUserName_KeyDown : function() {
			if (event.keyCode == 13)
				document.getElementById('wasteWitnessPasswordInput').select();
		},
		WitnessUserPassword_KeyDown : function() {
			if (event.keyCode == 13)
				document.getElementById('submitWitnessInfoButton').focus();
		},
		EncryptPassword : function() {
			var user_pswd = document.getElementById('wasteWitnessPasswordInput').value
			if (user_pswd.length <= 0) {
				alert(i18n.ENTER_USER_NAME_AND_PASSWORD);
			}

			var user_id = new String(document.getElementById('wasteWitnessInput').value).toUpperCase();
			var curUser_id = new String(CERN_MEDS_WASTE_01.comp.getUser().NATIVE_ID).toUpperCase();

			if (trim(user_id) == trim(curUser_id)) {
				alert(i18n.CAN_NOT_WITNESS_OWN_WASTE);
			} else {
				doEncryption(user_pswd, function(result) {
					var base64 = rstr2b64(result.cipher);
					CERN_MEDS_WASTE_01.PrepareAuthenticateWitnessRequest(base64);
				});
			}
		},
		CancelWasteProcess : function() {
			this.curMedTransactionIndex = -1;

			CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions()
		},
		PrepareAuthenticateWitnessRequest : function(encryptedPswd) {
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
				request_indicators.transaction_ind = 3;
				//3 - Authenticate Witness

				user_maintenance_request.request_indicators = request_indicators;

				var patientContext = new Object();
				patientContext.person_id = criterion.person_id;
				patientContext.encounter_id = criterion.encntr_id;
				user_maintenance_request.patient_context = patientContext;

				var json_object = new Object();
				json_object.user_maintenance_request = user_maintenance_request;

				var json_request = JSON.stringify(json_object);

				sendAr.push("^MINE^", "^USER_MAINTENANCE^", "^" + json_request + "^");
				SendAuthenticateWitness(this.comp, sendAr);
			}
		},
		PrepareRemoteWasteRequest : function() {
			//The get transactions to waste can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
			var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.LOADING_DATA + "... </span><br/>";
			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

			var criterion = this.comp.getCriterion();
			var sendAr = [];

			var remote_waste_request = new Object();

			var user = new Object();
			user.person_id = criterion.provider_id + ".0";

			remote_waste_request.user = user;

			var patient_context = new Object();
			patient_context.person_id = criterion.person_id + ".0";
			patient_context.encounter_id = criterion.encntr_id + ".0";

			remote_waste_request.patient_context = patient_context;

			//Set the waste tx time before setting to the request
			dateTime = new Date();
			this.curMedTransactionsToWaste[this.curMedTransactionIndex].WASTE_TX_TIME = dateTime.format('isoDateTime');

			//Set the CareFusion user details onto the waste transaction
			var cfnUser = this.comp.getUser();
			this.curMedTransactionsToWaste[this.curMedTransactionIndex].WASTE_USER_ID = cfnUser.FOREIGN_ID
			this.curMedTransactionsToWaste[this.curMedTransactionIndex].WASTE_USER_NAME = cfnUser.USER_NAME
			remote_waste_request.waste = this.curMedTransactionsToWaste[this.curMedTransactionIndex];
			remote_waste_request.process_waste_type_ind = this.curWasteTxType;

			var json_object = new Object();
			json_object.remote_waste_request = remote_waste_request;

			var json_request = JSON.stringify(json_object);

			sendAr.push("^MINE^", "^REMOTE_WASTE^", "^" + json_request + "^");
			SendRemoteWaste(this.comp, sendAr);
		},
		WasteSubmitted : function() {
			var sHTML = "";
			var jsHTML = [];
			var content = [];

			this.comp.setTxToWasteIsLoaded(false);
			this.curMedTransactionsToWaste = null;
			this.curMedTransactionIndex = -1;
			this.curWasteTxType = -1;

			jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.WASTE_SUBMITTED, "</span><br/>");
			jsHTML.push("<input type='button' name='reloadWasteTxButton' onClick='CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions()' value='", i18n.OK, "'>");
			jsHTML.push("<br/></h3></div>");

			content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
			sHTML = content.join("");

			MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
		}
	}

	function BuildWasteMedDisplayName(curMedTransactionToWaste) {
		if (curMedTransactionToWaste.DISPLAY_NAME == null) {
			var amountUnitsOfMeasure = curMedTransactionToWaste.AMOUNT_UNITS_OF_MEASURE;
			var medNameDisplay = curMedTransactionToWaste.GENERIC_NAME;
			medNameDisplay = medNameDisplay + " (" + curMedTransactionToWaste.BRAND_NAME + ") ";

			if (curMedTransactionToWaste.UNITS_OF_MEASURE != undefined) {
				medNameDisplay = medNameDisplay + curMedTransactionToWaste.UNITS_OF_MEASURE;
			}

			if (curMedTransactionToWaste.DOSAGE != undefined) {
				medNameDisplay = medNameDisplay + " " + curMedTransactionToWaste.DOSAGE;
			}

			curMedTransactionToWaste.DISPLAY_NAME = medNameDisplay;
		}
	}

	function BuildWasteMedInfoDisplay(curMedTransactionsToWaste, curMedTransactionIndex, showAmountWasted) {
		//Build the display for the top of the waste screens showing name/dispense info
		var jsHTML = [];

		jsHTML.push("<table id='WasteMedInfoDisplayTable' cellspacing='1' cellpadding='0' border='1'>");
		jsHTML.push("<tr><td><table><tr><td class='waste-med-info-title'>", i18n.WASTE_MEDICATION_NAME, "</td></tr>");

		BuildWasteMedDisplayName(curMedTransactionsToWaste[curMedTransactionIndex]);

		jsHTML.push("<tr><td class='waste-med-info-data'>", curMedTransactionsToWaste[curMedTransactionIndex].DISPLAY_NAME, "</td></tr></table></td></tr>");

		jsHTML.push("<tr><td><table><tr><td class='waste-med-info-title'>", i18n.DATE_TIME_REMOVED, "</td></tr>");
		jsHTML.push("<tr><td class='waste-med-info-data'>", curMedTransactionsToWaste[curMedTransactionIndex].FORMAT_ORIG_RMVED_MED_TX_TIME, "</td></tr></table></td></tr>");

		var amountUnitsOfMeasure = curMedTransactionsToWaste[curMedTransactionIndex].AMOUNT_UNITS_OF_MEASURE;
		var numberFormat = new NumberFormat();

		jsHTML.push("<tr><td><table id='AmountsTable'><tr>");
		jsHTML.push("<td><table><tr><td class='waste-med-info-title'>", i18n.AMOUNT_REMOVED, "</td></tr>");
		jsHTML.push("<tr> <td class='waste-med-info-data'>", numberFormat.format(curMedTransactionsToWaste[curMedTransactionIndex].REMOVE_AMOUNT), " ", amountUnitsOfMeasure, "</td></tr></table></td>");
		jsHTML.push("<td><table><tr><td class='waste-med-info-title'>", i18n.AMOUNT_REMAINING, "</td></tr>");
		jsHTML.push("<tr><td class='waste-med-info-data'>", numberFormat.format(curMedTransactionsToWaste[curMedTransactionIndex].REMAINING_AMOUNT), " ", amountUnitsOfMeasure, "</td></tr></table></td>");
		jsHTML.push("<td><table><tr><td class='waste-med-info-title'>", i18n.AMOUNT_RETURNED, "</td></tr>");
		jsHTML.push("<tr><td class='waste-med-info-data'>", numberFormat.format(curMedTransactionsToWaste[curMedTransactionIndex].TOTAL_RETURN_AMOUNT), " ", amountUnitsOfMeasure, "</td></tr></table></td>");
		if (showAmountWasted == true) {
			jsHTML.push("<td><table><tr> <td class='sub-sec-title'>", i18n.AMOUNT_WASTED, "</td></tr>");
			var waste_amount = numberFormat.format(curMedTransactionsToWaste[curMedTransactionIndex].REMAINING_AMOUNT - curMedTransactionsToWaste[curMedTransactionIndex].GIVE_AMOUNT);
			jsHTML.push("<tr><td class='sub-sec-title'>", waste_amount, " ", amountUnitsOfMeasure, "</td></tr></table></td>");
		}
		jsHTML.push("</tr></table></td></tr></table>");

		return jsHTML;
	}

	//A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to USER_MAINTENANCE and examines the reply status before
	//determining how to handle the reply.
	function SendAuthenticateWitness(component, paramAr) {
		var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

		var info = new XMLCclRequest();
		info.onreadystatechange = function() {
			if (info.readyState == 4 && info.status == 200) {
				try {
					var jsonEval = JSON.parse(info.responseText);
					var recordData = jsonEval.RECORD_DATA;
					if (recordData.STATUS_DATA.STATUS == "Z") {
						//TODO: Handle zero reply
					} else if (recordData.STATUS_DATA.STATUS == "S") {
						var userErrorMsg = "";
						for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
							if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
								//The status block contained a message that needs to be displayed to the user.
								userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
								alert(userErrorMsg);
							}
						}
						CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex].WITNESS_USER_NAME = recordData.REPLY_DATA.USER.USER_NAME;
						CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex].WITNESS_ID = recordData.REPLY_DATA.USER.FOREIGN_ID;
						CERN_MEDS_WASTE_01.PrepareRemoteWasteRequest();
					} else {
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
						CERN_MEDS_WASTE_01.ShowWitnessScreen();
					}
				} catch (err) {
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
						timerLoadComponent = null;
					}
				} finally {
					if (timerLoadComponent)
						timerLoadComponent.Stop();
				}
			} else if (info.readyState == 4 && info.status != 200) {
				//Notify user there was an error with the witness authentication
				alert(i18n.ERROR_OCCURED_WHILE_AUTHENTICATING_WITNESS);

				//Failed to authenticate witness, reload the witness authentication screen
				CERN_MEDS_WASTE_01.ShowWitnessScreen();
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
		info.onreadystatechange = function() {
			if (info.readyState == 4 && info.status == 200) {
				try {
					var jsonEval = JSON.parse(info.responseText);
					var recordData = jsonEval.RECORD_DATA;
					if (recordData.STATUS_DATA.STATUS == "Z") {
						//TODO: Handle zero reply
						//component.HandleSuccess(recordData);
					} else if (recordData.STATUS_DATA.STATUS == "S") {
						var userErrorMsg = "";
						for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
							if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
								//The status block contained a message that needs to be displayed to the user.
								userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
								alert(userErrorMsg);
							}
						}
						CERN_MEDS_WASTE_01.WasteSubmitted();
					} else {
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
							errorAr.push(statusData.STATUS, statusData.SUBEVENTSTATUS.OPERATIONNAME, statusData.SUBEVENTSTATUS.OPERSATIONSTATUS, statusData.SUBEVENTSTATUS.TARGETOBJECTNAME, statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
						}
						//TODO: Error handling here
						MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
					}
				} catch (err) {
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
						timerLoadComponent = null;
					}
				} finally {
					if (timerLoadComponent)
						timerLoadComponent.Stop();
				}
			} else if (info.readyState == 4 && info.status != 200) {
				MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
				if (timerLoadComponent)
					timerLoadComponent.Abort();
			}
		}
		info.open('GET', "ADM_ADAPTER_CCL_DRIVER", true);
		info.send(paramAr.join(","));
	}

	//A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to RETRIEVE_TX_TO_WASTE and examines the reply status before
	//determining how to handle the reply.
	function GetTransactionsToWaste(component, paramAr, retrieval_type_filter) {
		var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

		var info = new XMLCclRequest();
		info.onreadystatechange = function() {
			if (info.readyState == 4 && info.status == 200) {
				try {
					var jsonEval = JSON.parse(info.responseText);
					var recordData = jsonEval.RECORD_DATA;
					if (recordData.STATUS_DATA.STATUS == "Z") {
						component.HandleSuccess(recordData);
					} else if (recordData.STATUS_DATA.STATUS == "S") {
						var userErrorMsg = "";
						for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
							if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
								//The status block contained a message that needs to be displayed to the user.
								userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
								alert(userErrorMsg);
							}
						}

						//If the get tx to waste was for a "searched med"
						if (retrieval_type_filter == 1) {
							component.setTxToWasteIsLoaded(false);
							CERN_MEDS_WASTE_01.curMedTransactionsToWaste = recordData.REPLY_DATA.WASTE_TXS;
							if (CERN_MEDS_WASTE_01.curMedTransactionsToWaste != null && CERN_MEDS_WASTE_01.curMedTransactionsToWaste != "") {
								CERN_MEDS_WASTE_01.curMedTransactionIndex = 0;
								CERN_MEDS_WASTE_01.curWasteTxType = 0;
								CERN_MEDS_WASTE_01.ShowAmountRemovedForm();
							}
						} else {
							CERN_MEDS_WASTE_01.curWasteTxType = 1;
							CERN_MEDS_WASTE_01.curMedTransactionsToWaste = recordData.REPLY_DATA.WASTE_TXS;

							if (CERN_MEDS_WASTE_01.curMedTransactionsToWaste == null || CERN_MEDS_WASTE_01.curMedTransactionsToWaste == "") {
								component.setTxToWasteIsLoaded(true);
							}

							CERN_MEDS_WASTE_01.ShowWasteableMedTransactions(component, retrieval_type_filter);
						}
					} else {
						var errorAr = [];
						var userErrorMsg = "";
						for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
							if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME == "USER_ERROR_MESSAGE") {
								//The status block contained a message that needs to be displayed to the user.
								userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
								alert(userErrorMsg);

								CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions();
							}
						}

						if (userErrorMsg == "") {
							var statusData = recordData.STATUS_DATA;
							errorAr.push(statusData.STATUS, statusData.SUBEVENTSTATUS.OPERATIONNAME, statusData.SUBEVENTSTATUS.OPERSATIONSTATUS, statusData.SUBEVENTSTATUS.TARGETOBJECTNAME, statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);

							MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
						}
					}
				} catch (err) {
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
						timerLoadComponent = null;
					}
				} finally {
					if (timerLoadComponent)
						timerLoadComponent.Stop();
				}
			} else if (info.readyState == 4 && info.status != 200) {
				MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
				if (timerLoadComponent)
					timerLoadComponent.Abort();
			}
		}
		info.open('GET', "ADM_ADAPTER_CCL_DRIVER", true);
		info.send(paramAr.join(","));
	}

	//A wrapper function that makes the XMLCclRequest call to RB_SEARCH_WASTE_MED and examines the reply status before
	//determining how to handle the reply.
	function SearchForMedToWaste(component, paramAr) {
		var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

		component.setTxToWasteIsLoaded(false);

		var info = new XMLCclRequest();
		info.onreadystatechange = function() {
			if (info.readyState == 4 && info.status == 200) {
				try {
					var jsonEval = JSON.parse(info.responseText);
					var recordData = jsonEval.RECORD_DATA;
					if (recordData.STATUS_DATA.STATUS == "Z") {
						var userErrorMsg = "";
						for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
							//TODO: i18n something here
							var statusType = new String(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME)
							if (trim(statusType) == "USER_ERROR_MESSAGE") {
								//The status block contained a message that needs to be displayed to the user.
								userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
								alert(userErrorMsg);
							}
						}
						//No results... so just reload the initial page for now
						//TODO: Display a "no results" message
						component.HandleSuccess(recordData);
					} else if (recordData.STATUS_DATA.STATUS == "S") {
						var userErrorMsg = "";
						for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
							if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
								//The status block contained a message that needs to be displayed to the user.
								userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
								alert(userErrorMsg);
							}
						}
						CERN_MEDS_WASTE_01.ShowSearchResultsForm(recordData.REPLY_DATA.ITEMS);
					} else {
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
							errorAr.push(statusData.STATUS, statusData.SUBEVENTSTATUS.OPERATIONNAME, statusData.SUBEVENTSTATUS.OPERSATIONSTATUS, statusData.SUBEVENTSTATUS.TARGETOBJECTNAME, statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
						}
						MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
					}
				} catch (err) {
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
						timerLoadComponent = null;
					}
				} finally {
					if (timerLoadComponent)
						timerLoadComponent.Stop();
				}
			} else if (info.readyState == 4 && info.status != 200) {
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
		var aName = a.DISPLAY_NAME;
		var bName = b.DISPLAY_NAME;
		var aUpper = (aName != null) ? aName.toUpperCase() : "";
		var bUpper = (bName != null) ? bName.toUpperCase() : "";

		if (aUpper > bUpper)
			return 1;
		else if (aUpper < bUpper)
			return -1;
		return 0
	}

	function SortByRemoveDtTm(a, b) {
		var aLongTime = a.ORIG_REMOVED_MED_TX_TIME;
		var bLongTime = b.ORIG_REMOVED_MED_TX_TIME;

		if (aLongTime < bLongTime)
			return 1;
		else if (aLongTime > bLongTime)
			return -1;
		else
			return SortByMedName(a, b);
		//if times are equal, sort by med name
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

}();
