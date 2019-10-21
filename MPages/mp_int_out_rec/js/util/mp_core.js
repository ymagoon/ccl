/*
 The scope of an MPage object and Components are during rendering of the page.  However,
 once the page has been rendered these items are lost.  Because there is a need to refresh
 components, the components on a 'page' must be globally stored to allow for refreshing of data.
 */
var CERN_EventListener = null;
var CERN_MPageComponents = null;
//A global object which keeps a mapping of Report Means to the components which should be instantiated.
//Supporting functionality is located in the MP_Util namespace
var CERN_ObjectDefinitionMapping = {};
var CERN_TabManagers = null;
var CERN_MPages = null;
var CERN_BrowserDevInd = false;
var CERN_PersonalFav = null;
var CK_DATA = {};

var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

Array.prototype.addAll = function(v) {
	if(v && v.length > 0) {
		for(var x = 0, xl = v.length; x < xl; x++) {
			this.push(v[x]);
		}
	}
};

/*
 * Overriding the browsers ability to catch errors so we can handle them how we would like.
 */
window.onerror = function(message, file, lineNumber) {
	var errorModal = null;
	var refreshButton = null;
	var closeButton = null;

	//Log the error message to the JSLogger
	MP_Util.LogError(i18n.UNEXPECTED_ERROR_CAUGHT + "<br />" + i18n.discernabu.JS_ERROR + ": " + message + "<br />" + i18n.FILE + ": " + file + "<br />" + i18n.LINE_NUMBER + ": " + lineNumber);

	//Throw the error when we are developing in a browser
	if(CERN_BrowserDevInd) {
		throw (new Error(i18n.UNEXPECTED_ERROR_CAUGHT + "<br />" + i18n.discernabu.JS_ERROR + ": " + message + "<br />" + i18n.FILE + ": " + file + "<br />" + i18n.LINE_NUMBER + ": " + lineNumber));
	}
	else {
		//Create a modal dialog and ask the user if they would like to refresh or continue
		errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
		if(!errorModal) {
			errorModal = MP_Util.generateModalDialogBody("errorModal", "error", i18n.PAGE_ERROR, i18n.PAGE_ERROR_ACTION);
			errorModal.setHeaderTitle(i18n.ERROR_OCCURED);
			//Create and add the refresh button
			refreshButton = new ModalButton("refreshButton");
			refreshButton.setText(i18n.REFRESH).setCloseOnClick(true);
			refreshButton.setOnClickFunction(function() {
				//Refresh the page
				var cclParams = [];
				var criterion = JSON.parse(m_criterionJSON).CRITERION;
				if( typeof m_viewpointJSON == "undefined") {
					cclParams = ["^MINE^", criterion.PERSON_ID + ".0", criterion.ENCNTRS[0].ENCNTR_ID + ".0", criterion.PRSNL_ID + ".0", criterion.POSITION_CD + ".0", criterion.PPR_CD + ".0", "^" + criterion.EXECUTABLE + "^", "^^", "^" + criterion.STATIC_CONTENT.replace(/\\/g, "\\\\") + "^", "^" + criterion.CATEGORY_MEAN + "^", criterion.DEBUG_IND];
					CCLLINK("MP_DRIVER", cclParams.join(","), 1);
				}
				else {
					var viewpointJSON = JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
					cclParams = ["^MINE^", criterion.PERSON_ID + ".0", criterion.ENCNTRS[0].ENCNTR_ID + ".0", criterion.PRSNL_ID + ".0", criterion.POSITION_CD + ".0", criterion.PPR_CD + ".0", "^" + criterion.EXECUTABLE + "^", "^" + criterion.STATIC_CONTENT.replace(/\\/g, "\\\\") + "^", "^" + viewpointJSON.VIEWPOINT_NAME_KEY + "^", criterion.DEBUG_IND, "^^", 0, "^" + viewpointJSON.ACTIVE_VIEW_CAT_MEAN + "^"];
					CCLLINK(CERN_driver_script, cclParams.join(","), 1);
				}
			});


			errorModal.addFooterButton(refreshButton);
			//Create and add the close button
			closeButton = new ModalButton("closeButton");
			closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
			errorModal.addFooterButton(closeButton);
		}
		MP_ModalDialog.updateModalDialogObject(errorModal);
		MP_ModalDialog.showModalDialog("errorModal");

		//Returning true supresses the error in FireFox and IE but allows it to propegate in Chrome
		return true;
	}
};

/**
 * Core utility methods
 * @namespace
 */
var MP_Core = function() {
	return {
		/**
		 * The criterion object stores information about the request in context such as the patient/person, encounter/visit,
		 * provider/personnel, relationship etc.
		 */
		Criterion : function(jsCrit, static_content) {
			var m_patInfo = null;
			var m_prsnlInfo = null;
			var m_periop_cases = null;
			var m_encntrOverride = [];

			this.person_id = jsCrit.PERSON_ID;
			this.encntr_id = (jsCrit.ENCNTRS.length > 0) ? jsCrit.ENCNTRS[0].ENCNTR_ID : 0;
			this.provider_id = jsCrit.PRSNL_ID;
			this.executable = jsCrit.EXECUTABLE;
			this.static_content = static_content;
			this.position_cd = jsCrit.POSITION_CD;
			this.ppr_cd = jsCrit.PPR_CD;
			this.debug_ind = jsCrit.DEBUG_IND;
			CERN_BrowserDevInd = (parseInt(this.debug_ind, 10) & 0x01 === 1) ? true : false;
			this.help_file_local_ind = jsCrit.HELP_FILE_LOCAL_IND;
			this.category_mean = jsCrit.CATEGORY_MEAN;
			this.locale_id = (this.debug_ind) ? "en_us" : jsCrit.LOCALE_ID;
			//@deprecated as of 3.3.1 and should be removed as of greater than or equal to 3.4
			this.device_location = "";

			var encntrOR = jsCrit.ENCNTR_OVERRIDE;

			if(encntrOR) {
				for(var x = encntrOR.length; x--; ) {
					m_encntrOverride.push(encntrOR[x].ENCNTR_ID);
				}
			}
			else {
				m_encntrOverride.push(this.encntr_id);
			}

			this.setPatientInfo = function(value) {
				m_patInfo = value;
			};


			this.getPatientInfo = function() {
				return m_patInfo;
			};


			this.setPeriopCases = function(value) {
				m_periop_cases = value;
			};


			this.getPeriopCases = function() {
				return m_periop_cases;
			};


			this.getPersonnelInfo = function() {
				if(!m_prsnlInfo) {
					m_prsnlInfo = new MP_Core.PersonnelInformation(this.provider_id, this.person_id);
				}
				return m_prsnlInfo;
			};

			/**
			 * @return List of encounters that are considered 'ACTIVE'.
			 * In the rare case that encounter override is needed, this will return the encounter neccessary to pass
			 * to a service for retrieval of data.
			 */
			this.getEncounterOverride = function() {
				return m_encntrOverride;
			};

		},
		PatientInformation: function() {
			var m_dob = null;
			var m_sex = null;

			this.setSex = function(value) {
				m_sex = value;
			};
			this.getSex = function() {
				return m_sex;
			};
			this.setDOB = function(value) {
				m_dob = value;
			};
			this.getDOB = function() {
				return m_dob;
			};
		},

		PeriopCases: function() {
			var m_case_id = null;
			var m_prior_ind = null;
			var m_days = null;
			var m_hours = null;
			var m_mins = null;
			var m_cntdwn_desc_flag = null;

			this.setCaseID = function(value) {
				m_case_id = value;
			};
			this.getCaseID = function() {
				return m_case_id;
			};
			this.setDays = function(value) {
				m_days = value;
			};
			this.getDays = function() {
				return m_days;
			};
			this.setHours = function(value) {
				m_hours = value;
			};
			this.getHours = function() {
				return m_hours;
			};
			this.setMins = function(value) {
				m_mins = value;
			};
			this.getMins = function() {
				return m_mins;
			};
			this.setCntdwnDscFlg = function(value) {
				m_cntdwn_desc_flag = value;
			};
			this.getCntdwnDscFlg = function() {
				return m_cntdwn_desc_flag;
			};
		},

		ScriptRequest: function(component, loadTimerName) {
			var m_comp = component;
			var m_load = loadTimerName;
			var m_name = "";
			var m_programName = "";
			var m_params = null;
			var m_async = true;

			this.getComponent = function() {
				return m_comp;
			};
			this.getLoadTimer = function() {
				return m_load;
			};
			this.setName = function(value) {
				m_name = value;
			};
			this.getName = function() {
				return m_name;
			};
			this.setProgramName = function(value) {
				m_programName = value;
			};
			this.getProgramName = function() {
				return m_programName;
			};
			this.setParameters = function(value) {
				m_params = value;
			};
			this.getParameters = function() {
				return m_params;
			};
			this.setAsync = function(value) {
				m_async = value;
			};
			this.isAsync = function() {
				return m_async;
			};
		},
		ScriptReply: function(component) {
			//used to syne a request to a reply
			var m_name = "";
			//by default every script reply is 'f'ailed unless otherwise noted
			var m_status = "F";
			var m_err = "";
			var m_resp = null;
			var m_comp = component;

			this.setName = function(value) {
				m_name = value;
			};
			this.getName = function() {
				return m_name;
			};
			this.setStatus = function(value) {
				m_status = value;
			};
			this.getStatus = function() {
				return m_status;
			};
			this.setError = function(value) {
				m_err = value;
			};
			this.getError = function() {
				return m_err;
			};
			this.setResponse = function(value) {
				m_resp = value;
			};
			this.getResponse = function() {
				return m_resp;
			};
			this.getComponent = function() {
				return m_comp;
			};
		},
		PersonnelInformation: function(prsnlId, patientId) {
			var m_prsnlId = prsnlId;
			//if m_viewableEncntrs remains null, error in retrieval of viewable encntr
			var m_viewableEncntrs = null;
			//load valid encounter list from patcon wrapper
			var patConObj = null;
			try {
				patConObj = window.external.DiscernObjectFactory("PVCONTXTMPAGE");
				MP_Util.LogDiscernInfo(null, "PVCONTXTMPAGE", "mp_core.js", "PersonnelInformation");
				if (patConObj) {
					m_viewableEncntrs = patConObj.GetValidEncounters(patientId);
					MP_Util.LogDebug("Viewable Encounters: " + m_viewableEncntrs);
				}
			}
			catch (e) {
			}
			finally {
				//release used memory
				patConObj = null;
			}

			this.getPersonnelId = function() {
				return m_prsnlId;
			};
			/**
			 * Returns the associated encounter that the provide has the ability to see
			 */
			this.getViewableEncounters = function() {
				return m_viewableEncntrs;
			};
		},
		XMLCclRequestWrapper: function(component, program, paramAr, async) {
			var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName(), component.getCriterion().category_mean);
			var i18nCore = i18n.discernabu;
			var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();

			info.onreadystatechange = function() {
				var countText = "";
				var errMsg = null;
				if (this.readyState == 4 && this.status == 200) {
					try {
						MP_Util.LogScriptCallInfo(component, this, "mp_core.js", "XMLCclRequestWrapper");
						var jsonEval = JSON.parse(this.responseText);
						var recordData = jsonEval.RECORD_DATA;
						if (recordData.STATUS_DATA.STATUS == "Z") {
							countText = (component.isLineNumberIncluded() ? "(0)" : "");
							component.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), countText);
						}
						else if (recordData.STATUS_DATA.STATUS == "S") {
							var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
							try {
								var rootComponentNode = component.getRootComponentNode();
								var secTitle = Util.Style.g("sec-total", rootComponentNode, "span");
								secTitle[0].innerHTML = i18nCore.RENDERING_DATA + "...";
								//Call the generic component loading renderComponent function so the component can render its content.
								component.renderComponent(recordData);
							}
							catch (err) {
								MP_Util.LogJSError(err, component, "mp_core.js", "XMLCclRequestWrapper");
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
						}
						else {
							MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestWrapper");
							errMsg = [];
							var ss = null;
							errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li>");
							var statusData = recordData.STATUS_DATA;
							if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
								for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
									ss = statusData.SUBEVENTSTATUS[x];
									errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
								}
							}
							else if (statusData.SUBEVENTSTATUS.length === undefined) {
								ss = statusData.SUBEVENTSTATUS;
								errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
							}
							errMsg.push("</ul>");
							countText = (component.isLineNumberIncluded() ? "(0)" : "");
							component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), countText);
						}
					}
					catch (err) {
						MP_Util.LogJSError(err, component, "mp_core.js", "XMLCclRequestWrapper");
						errMsg = [];
						errMsg.push("<b>", i18nCore.JS_ERROR, "</b><br /><ul><li>", i18nCore.MESSAGE, ": ", err.message, "</li><li>", i18nCore.NAME, ": ", err.name, "</li><li>", i18nCore.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18nCore.DESCRIPTION, ": ", err.description, "</li></ul>");
						component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), "");

						if (timerLoadComponent) {
							timerLoadComponent.Abort();
							timerLoadComponent = null;
						}
					}
					finally {
						if (timerLoadComponent) {
							timerLoadComponent.Stop();
						}
						if(component && typeof component.postProcessing != "undefined"){
							//After the component has rendered call the postProcessing function to perform any additional actions
							component.postProcessing();
						}
					}
				}
				else if (this.readyState == 4 && this.status != 200) {
					MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestWrapper");
					errMsg = [];
					errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li></ul>");
					component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), "");
					if (timerLoadComponent) {
						timerLoadComponent.Abort();
					}
					if(component && typeof component.postProcessing != "undefined"){
						//After the component has rendered call the postProcessing function to perform any additional actions
						component.postProcessing();
					}
				}
				if (this.readyState == 4) {
					MP_Util.ReleaseRequestReference(this);
				}
			};

			if (CERN_BrowserDevInd) {
				var url = program + "?parameters=" + paramAr.join(",");
				info.open("GET", url, async);
				info.send(null);
			}
			else {
				info.open('GET', program, async);
				info.send(paramAr.join(","));
			}
		},
		/**
		 * As a means in which to provide the consumer to handle the response of the script request, this method
		 * provide an encapsulated means in which to call the XMLCCLRequest and return a ReplyObject with data
		 * about the response that can be utilized for evaluation.
		 * @param component [REQUIRED] The component in which is executing the request
		 * @param request [REQUIRED] The Request Object containing the information about the script being executed
		 * @param funcCallBack [REQUIRED] The function to execute once the execution of the request has been completed
		 */
		XMLCCLRequestCallBack: function(component, request, funcCallback) {
			var timerLoad = MP_Util.CreateTimer(request.getLoadTimer());
			var i18nCore = i18n.discernabu;
			var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
			var reply = new MP_Core.ScriptReply(component);
			reply.setName(request.getName());

			info.onreadystatechange = function() {
				var errMsg = null;
				if (this.readyState == 4 && this.status == 200) {
					try {
						MP_Util.LogScriptCallInfo(component, this, "mp_core.js", "XMLCclRequestCallBack");
						var jsonEval = JSON.parse(info.responseText);
						var recordData = jsonEval.RECORD_DATA;
						var status = recordData.STATUS_DATA.STATUS;
						reply.setStatus(status);
						if (status == "Z") {
							//Pass response anyways
							reply.setResponse(recordData);
							funcCallback(reply);
						}
						else if (status == "S") {
							reply.setResponse(recordData);
							funcCallback(reply);
						}
						else {
							MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestCallBack");
							errMsg = [];
							errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li>");
							var statusData = recordData.STATUS_DATA;
							if (statusData.SUBEVENTSTATUS.length && statusData.SUBEVENTSTATUS.length > 0) {
								for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
									var ss = statusData.SUBEVENTSTATUS[x];
									errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
								}
							}
							else if (statusData.SUBEVENTSTATUS.length == undefined) {
								var ss = statusData.SUBEVENTSTATUS;
								errMsg.push("<li>", i18nCore.ERROR_OPERATION, ": ", ss.OPERATIONNAME, "</li><li>", i18nCore.ERROR_OPERATION_STATUS, ": ", ss.OPERATIONSTATUS, "</li><li>", i18nCore.ERROR_TARGET_OBJECT, ": ", ss.TARGETOBJECTNAME, "</li><li>", i18nCore.ERROR_TARGET_OBJECT_VALUE, ": ", ss.TARGETOBJECTVALUE, "</li>");
							}
							errMsg.push("</ul>");
							reply.setError(errMsg.join(""));
							funcCallback(reply);
						}
					}
					catch (err) {
						MP_Util.LogJSError(err, component, "mp_core.js", "XMLCclRequestCallBack");
						errMsg = [];
						errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li></ul>");
						reply.setError(errMsg.join(""));
						if (timerLoad) {
							timerLoad.Abort();
							timerLoad = null;
						}
					}
					finally {
						if (timerLoad) {
							timerLoad.Stop();
						}
						if(component && typeof component.postProcessing != "undefined"){
							//After the component has rendered call the postProcessing function to perform any additional actions
							component.postProcessing();
						}
					}
				}
				else if (info.readyState == 4 && info.status != 200) {
					MP_Util.LogScriptCallError(component, this, "mp_core.js", "XMLCclRequestCallBack");
					errMsg = [];
					errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", i18nCore.STATUS, ": ", this.status, "</li><li>", i18nCore.REQUEST, ": ", this.requestText, "</li></ul>");
					reply.setError(errMsg.join(""));
					if (timerLoad) {
						timerLoad.Abort();
					}
					funcCallback(reply);
					if(component && typeof component.postProcessing != "undefined"){
						//After the component has rendered call the postProcessing function to perform any additional actions
						component.postProcessing();
					}
				}
				if (this.readyState == 4) {
					MP_Util.ReleaseRequestReference(this);
				}
			};

			if (CERN_BrowserDevInd) {
				var url = request.getProgramName() + "?parameters=" + request.getParameters().join(",");
				info.open("GET", url, request.isAsync());
				info.send(null);
			}
			else {
				info.open('GET', request.getProgramName(), request.isAsync());
				info.send(request.getParameters().join(","));
			}

		},
		XMLCCLRequestThread: function(name, component, request) {
			var m_name = name;
			var m_comp = component;

			var m_request = request;
			m_request.setName(name);

			this.getName = function() {
				return m_name;
			};
			this.getComponent = function() {
				return m_comp;
			};
			this.getRequest = function() {
				return m_request;
			};
		},
		XMLCCLRequestThreadManager: function(callbackFunction, component, handleFinalize) {
			var m_threads = null;
			var m_replyAr = null;

			var m_isData = false;
			var m_isError = false;

			this.addThread = function(thread) {
				if (!m_threads) {
					m_threads = [];
				}
				m_threads.push(thread);
			};

			this.begin = function() {
				if (m_threads && m_threads.length > 0) {
					for ( x = m_threads.length; x--; ) {
						//start each xmlcclrequest
						var thread = m_threads[x];
						MP_Core.XMLCCLRequestCallBack(thread.getComponent(), thread.getRequest(), this.completeThread);
					}
				}
				else {
					if (handleFinalize) {
						var countText = (component.isLineNumberIncluded() ? "(0)" : "");
						component.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), countText);
						//After the component has rendered call the postProcessing function to perform any additional actions
						component.postProcessing();
					}
					else {
						callbackFunction(null, component);
					}
				}
			};

			this.completeThread = function(reply) {
				if (!m_replyAr) {
					m_replyAr = [];
				}
				if (reply.getStatus() === "S") {
					m_isData = true;
				}
				else if (reply.getStatus() === "F") {
					m_isError = true;
				}

				m_replyAr.push(reply);
				if (m_replyAr.length === m_threads.length) {
					var countText = (component.isLineNumberIncluded() ? "(0)" : "");
					var errMsg = null;
					try {
						if (handleFinalize) {
							if (m_isError) {
								//handle error response
								errMsg = [];
								for (var x = m_replyAr.length; x--; ) {
									var rep = m_replyAr[x];
									if (rep.getStatus() === "F") {
										errMsg.push(rep.getError());
									}
								}
								component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("<br />")), "");
							}
							else if (!m_isData) {
								//handle no data
								countText = (component.isLineNumberIncluded() ? "(0)" : "");
								component.finalizeComponent(MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), countText);
							}
							else {
								callbackFunction(m_replyAr, component);
							}
						}
						else {
							callbackFunction(m_replyAr, component);
						}
					}
					catch(err) {
						MP_Util.LogJSError(err, component, "mp_core.js", "XMLCCLRequestThreadManager");
						var i18nCore = i18n.discernabu;
						errMsg = ["<b>", i18nCore.JS_ERROR, "</b><br /><ul><li>", i18nCore.MESSAGE, ": ", err.message, "</li><li>", i18nCore.NAME, ": ", err.name, "</li><li>", i18nCore.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18nCore.DESCRIPTION, ": ", err.description, "</li></ul>"];
						component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), "");
					}
					finally {
						if(component && typeof component.postProcessing != "undefined") {
							//After the component has rendered call the postProcessing function to perform any additional actions
							component.postProcessing();
						}
					}
				}
			};
		},
		MapObject: function(name, value) {
			this.name = name;
			this.value = value;
		},
		/**
		 * An object to store the attributes of a single tab.
		 * @param {Object} key The id associated to the tab.
		 * @param {Object} name The name to be displayed on the tab.
		 * @param {Object} components The components to be associated to the tab.
		 */
		TabItem: function(key, name, components, prefIdentifier) {
			this.key = key;
			this.name = name;
			this.components = components;
			this.prefIdentifier = prefIdentifier;
		},
		TabManager: function(tabItem) {
			var m_isLoaded = false;
			var m_tabItem = tabItem;
			//By default a tab and all it's components are not fully expanded
			var m_isExpandAll = false;
			var m_isSelected = false;
			this.toggleExpandAll = function() {
				m_isExpandAll = (!m_isExpandAll);
			};
			this.loadTab = function() {
				if (!m_isLoaded) {
					m_isLoaded = true;
					var components = m_tabItem.components;
					if (components) {
						for (var xl = 0; xl < components.length; xl++) {
							var component = components[xl];
							if (component.isDisplayable() && component.isExpanded()) {
								component.InsertData();
							}
						}
						for (var xl = 0; xl < components.length; xl++) {
							var component = components[xl];
							if (component.isDisplayable() && !component.isExpanded()) {
								component.InsertData();
							}
						}
					}
				}
			};
			this.getTabItem = function() {
				return m_tabItem;
			};
			this.getSelectedTab = function() {
				return m_isSelected;
			};
			this.setSelectedTab = function(value) {
				m_isSelected = value;
			};
		},
		ReferenceRangeResult: function() {
			//results
			var m_valNLow = -1, m_valNHigh = -1, m_valCLow = -1, m_valCHigh = -1;
			//units of measure
			var m_uomNLow = null, m_uomNHigh = null, m_uomCLow = null, m_uomCHigh = null;
			this.init = function(refRange, codeArray) {
				var nf = MP_Util.GetNumericFormatter();
				m_valCLow = nf.format(refRange.CRITICAL_LOW.NUMBER);
				if (refRange.CRITICAL_LOW.UNIT_CD != "") {
					m_uomCLow = MP_Util.GetValueFromArray(refRange.CRITICAL_LOW.UNIT_CD, codeArray);
				}
				m_valCHigh = nf.format(refRange.CRITICAL_HIGH.NUMBER);
				if (refRange.CRITICAL_HIGH.UNIT_CD != "") {
					m_uomCHigh = MP_Util.GetValueFromArray(refRange.CRITICAL_HIGH.UNIT_CD, codeArray);
				}
				m_valNLow = nf.format(refRange.NORMAL_LOW.NUMBER);
				if (refRange.NORMAL_LOW.UNIT_CD != "") {
					m_uomNLow = MP_Util.GetValueFromArray(refRange.NORMAL_LOW.UNIT_CD, codeArray);
				}
				m_valNHigh = nf.format(refRange.NORMAL_HIGH.NUMBER);
				if (refRange.NORMAL_HIGH.UNIT_CD != "") {
					m_uomNHigh = MP_Util.GetValueFromArray(refRange.NORMAL_HIGH.UNIT_CD, codeArray);
				}
			};
			this.getNormalLow = function() {
				return m_valNLow;
			};
			this.getNormalHigh = function() {
				return m_valNHigh;
			};
			this.getNormalLowUOM = function() {
				return m_uomNLow;
			};
			this.getNormalHighUOM = function() {
				return m_uomNHigh;
			};
			this.getCriticalLow = function() {
				return m_valCLow;
			};
			this.getCriticalHigh = function() {
				return m_valCHigh;
			};
			this.getCriticalLowUOM = function() {
				return m_uomCLow;
			};
			this.getCriticalHighUOM = function() {
				return m_uomCHigh;
			};
			this.toNormalInlineString = function() {
				var low = (m_uomNLow) ? m_uomNLow.display : "";
				var high = (m_uomNHigh) ? m_uomNHigh.display : "";
				if (m_valNLow != 0 || m_valNHigh != 0) {
					return (m_valNLow + "&nbsp;" + low + " - " + m_valNHigh + "&nbsp;" + high);
				}
				else {
					return "";
				}
			};
			this.toCriticalInlineString = function() {
				var low = (m_uomCLow) ? m_uomCLow.display : "";
				var high = (m_uomCHigh) ? m_uomCHigh.display : "";
				if (m_valCLow != 0 || m_valCHigh != 0) {
					return (m_valCLow + "&nbsp;" + low + " - " + m_valCHigh + "&nbsp;" + high);
				}
				else {
					return "";
				}
			};
		},

		QuantityValue: function() {
			var m_val, m_precision;
			var m_uom = null;
			var m_refRange = null;
			var m_rawValue = 0;
			var m_hasModifier = false;
			this.init = function(result, codeArray) {
				var quantityValue = result.QUANTITY_VALUE;
				var referenceRange = result.REFERENCE_RANGE;
				for (var l = 0, ll = quantityValue.length; l < ll; l++) {
					var numRes = quantityValue[l].NUMBER;
					m_precision = quantityValue[l].PRECISION;
					if (!isNaN(numRes)) {
						m_val = MP_Util.Measurement.SetPrecision(numRes, m_precision);
						m_rawValue = numRes;
					}
					if (quantityValue[l].MODIFIER_CD != "") {
						var modCode = MP_Util.GetValueFromArray(quantityValue[l].MODIFIER_CD, codeArray);
						if (modCode) {
							m_val = modCode.display + m_val;
							m_hasModifier = true;
						}
					}
					if (quantityValue[l].UNIT_CD != "") {
						m_uom = MP_Util.GetValueFromArray(quantityValue[l].UNIT_CD, codeArray);
					}
					for (var m = 0, ml = referenceRange.length; m < ml; m++) {
						m_refRange = new MP_Core.ReferenceRangeResult();
						m_refRange.init(referenceRange[m], codeArray);
					}
				}
			};

			this.getValue = function() {
				return m_val;
			};
			this.getRawValue = function() {
				return m_rawValue;
			};
			this.getUOM = function() {
				return m_uom;
			};
			this.getRefRange = function() {
				return m_refRange;
			};
			this.getPrecision = function() {
				return m_precision;
			};
			this.toString = function() {
				if (m_uom) {
					return (m_val + " " + m_uom.display);
				}
				return m_val;
			};
			this.hasModifier = function() {
				return m_hasModifier;
			};
		},
		//measurement.init(meas.EVENT_ID, meas.PERSON_ID, meas.ENCNTR_ID, eventCode, dateTime, MP_Util.Measurement.GetObject(meas.MEASUREMENTS[k], codeArray));
		Measurement: function() {
			var m_eventId = 0.0;
			var m_personId = 0.0;
			var m_encntrId = 0.0;
			var m_eventCode = null;
			var m_dateTime = null;
			var m_updateDateTime = null;
			var m_result = null;
			var m_normalcy = null;
			var m_status = null;
			var m_comment = "";

			this.init = function(eventId, personId, encntrId, eventCode, dateTime, resultObj, updateDateTime) {
				m_eventId = eventId;
				m_personId = personId;
				m_encntrId = encntrId;
				m_eventCode = eventCode;
				m_dateTime = dateTime;
				m_result = resultObj;
				m_updateDateTime = updateDateTime;
			};

			this.initFromRec = function(measObj, codeArray) {
				var effectiveDateTime = new Date();
				var updateDateTime = new Date();
				m_eventId = measObj.EVENT_ID;
				m_personId = measObj.PATIENT_ID;
				m_encntrId = measObj.ENCOUNTER_ID;
				m_eventCode = MP_Util.GetValueFromArray(measObj.EVENT_CD, codeArray);
				effectiveDateTime.setISO8601(measObj.EFFECTIVE_DATE);
				m_dateTime = effectiveDateTime;
				m_result = MP_Util.Measurement.GetObject(measObj, codeArray);
				updateDateTime.setISO8601(measObj.UPDATE_DATE);
				m_updateDateTime = updateDateTime;
				m_normalcy = MP_Util.GetValueFromArray(measObj.NORMALCY_CD, codeArray);
				m_status = MP_Util.GetValueFromArray(measObj.STATUS_CD, codeArray);
				m_comment = measObj.COMMENT;
			};

			this.getEventId = function() {
				return m_eventId;
			};
			this.getPersonId = function() {
				return m_personId;
			};
			this.getEncntrId = function() {
				return m_encntrId;
			};
			this.getEventCode = function() {
				return m_eventCode;
			};
			this.getDateTime = function() {
				return m_dateTime;
			};
			this.getUpdateDateTime = function() {
				return m_updateDateTime;
			};
			this.getResult = function() {
				return m_result;
			};
			this.setNormalcy = function(value) {
				m_normalcy = value;
			};
			this.getNormalcy = function() {
				return m_normalcy;
			};
			this.setStatus = function(value) {
				m_status = value;
			};
			this.getStatus = function() {
				return m_status;
			};
			this.isModified = function() {
				if (m_status) {
					var mean = m_status.meaning;
					if (mean === "MODIFIED" || mean === "ALTERED") {
						return true;
					}
				}
				return false;
			};
			this.getComment = function() {
				return m_comment;
			};
		},
		MenuItem: function() {
			var m_name = "";
			var m_desc = "";
			var m_id = 0.0;
			var m_meaning;
			var m_valSequence = 0;
			//This is used as the primary grouping value for IView bands
			var m_valTypeFlag = 0;
			//This is used to determine which is the band, section, or item

			this.setDescription = function(value) {
				m_desc = value;
			};
			this.getDescription = function() {
				return m_desc;
			};
			this.setName = function(value) {
				m_name = value;
			};
			this.getName = function() {
				return m_name;
			};
			this.setId = function(value) {
				m_id = value;
			};
			this.getId = function() {
				return m_id;
			};
			this.setMeaning = function(value) {
				m_meaning = value;
			};
			this.getMeaning = function() {
				return m_meaning;
			};
			this.setValSequence = function(value) {
				m_valSequence = value;
			};
			this.getValSequence = function() {
				return m_valSequence;
			};
			this.setValTypeFlag = function(value) {
				m_valTypeFlag = value;
			};
			this.getValTypeFlag = function() {
				return m_valTypeFlag;
			};
		},
		CriterionFilters: function(criterion) {
			var m_criterion = criterion;
			var m_evalAr = [];

			this.addFilter = function(type, value) {
				m_evalAr.push(new MP_Core.MapObject(type, value));
			};
			this.checkFilters = function() {
				var pass = false;
				var patInfo = m_criterion.getPatientInfo();
				for (var x = m_evalAr.length; x--; ) {
					var filter = m_evalAr[x];
					var dob = null;
					switch (filter.name) {
						case MP_Core.CriterionFilters.SEX_MEANING:
							var sex = patInfo.getSex();
							if (sex) {
								if (filter.value == sex.meaning) {
									continue;
								}
							}
							return false;
						case MP_Core.CriterionFilters.DOB_OLDER_THAN:
							dob = patInfo.getDOB();
							if (dob) {
								if (dob <= filter.value) {
									continue;
								}
							}
							return false;
						case MP_Core.CriterionFilters.DOB_YOUNGER_THAN:
							dob = patInfo.getDOB();
							if (dob) {
								if (dob >= filter.value) {
									continue;
								}
							}
							return false;
						default:
							alert("Unhandled criterion filter");
							return false;
					}
				}
				return true;
			};
		},
		CreateSimpleError: function(component, sMessage) {
			var errMsg = [];
			var i18nCore = i18n.discernabu;
			var countText = (component.isLineNumberIncluded() ? "(0)" : "");
			errMsg.push("<b>", i18nCore.DISCERN_ERROR, "</b><br /><ul><li>", sMessage, "</li></ul>");
			component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), countText);
			//After the component has rendered call the postProcessing function to perform any additional actions
			component.postProcessing();
		}
	};
}();
//Constants for CriterionFilter items
MP_Core.CriterionFilters.SEX_MEANING = 1;
MP_Core.CriterionFilters.DOB_OLDER_THAN = 2;
MP_Core.CriterionFilters.DOB_YOUNGER_THAN = 3;

MP_Core.AppUserPreferenceManager = function() {
	var m_criterion = null;
	var m_prefIdent = "";
	var m_jsonObject = null;

	return {
		/**
		 * Allows for the initialization of the manager to store what criterion and preference identifier to
		 * utilize for retrieval of preferences
		 * @param {Object} criterion
		 * @param {Object} preferenceIdentifier
		 */
		Initialize: function(criterion, preferenceIdentifier) {
			m_criterion = criterion;
			m_prefIdent = preferenceIdentifier;
			m_jsonObject = null;
		},
		SetPreferences: function(prefString) {
			var jsonEval = JSON.parse(prefString);
			m_jsonObject = jsonEval;
		},
		LoadPreferences: function() {
			if (!m_criterion) {
				alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
				return null;
			}
			if (m_jsonObject) {
				return;
			}
			else {
				var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
				info.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "LoadPreferences");
						var jsonEval = JSON.parse(this.responseText);
						var recordData = jsonEval.RECORD_DATA;
						if (recordData.STATUS_DATA.STATUS == "S") {
							m_jsonObject = JSON.parse(recordData.PREF_STRING);
						}
						else if (recordData.STATUS_DATA.STATUS == "Z") {
							return;
						}
						else {
							MP_Util.LogScriptCallError(null, this, "mp_core.js", "LoadPreferences");
							var errAr = [];
							var statusData = recordData.STATUS_DATA;
							errAr.push("STATUS: " + statusData.STATUS);
							for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
								var ss = statusData.SUBEVENTSTATUS[x];
								errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
							}
							window.status = "Error retrieving user preferences " + errAr.join(",");
							return;
						}
					}
					if (this.readyState == 4) {
						MP_Util.ReleaseRequestReference(this);
					}

				};

				var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^"];
				if (CERN_BrowserDevInd) {
					var url = "MP_GET_USER_PREFS?parameters=" + ar.join(",");
					info.open("GET", url, false);
					info.send(null);
				}
				else {
					info.open('GET', "MP_GET_USER_PREFS", false);
					info.send(ar.join(","));
				}

				return;
			}
		},
		/**
		 * GetPreferences will return the users preferences for the application currently logged into.
		 */
		GetPreferences: function() {
			if (!m_criterion) {
				alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
				return null;
			}
			if (!m_jsonObject) {
				this.LoadPreferences();
			}

			return m_jsonObject;
		},
		SavePreferences: function(reload) {
			var body = document.body;
			var groups = Util.Style.g("col-group", body, "div");
			var grpId = 0;
			var colId = 0;
			var rowId = 0;
			var compId = 0;

			var jsonObject = {};
			jsonObject.user_prefs = {};
			var userPrefs = jsonObject.user_prefs;
			userPrefs.page_prefs = {};
			var pagePrefs = userPrefs.page_prefs;
			pagePrefs.components = [];
			var components = pagePrefs.components;
			var cclParams = [];

			//alert("groups.length: " + groups.length)
			for (var x = 0, xl = groups.length; x < xl; x++) {
				//TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
				grpId = x + 1;
				//get liquid layout
				var liqLay = Util.Style.g("col-outer1", groups[x], "div");
				if (liqLay.length > 0) {
					//get each child column
					var cols = Util.gcs(liqLay[0]);
					for (var y = 0, yl = cols.length; y < yl; y++) {
						colId = y + 1;
						var rows = Util.gcs(cols[y]);
						for (var z = 0, zl = rows.length; z < zl; z++) {
							var component = {};
							rowId = z + 1;
							compId = jQuery(rows[z]).attr('id');
							var compObj = MP_Util.GetCompObjByStyleId(compId);
							component.id = compObj.getComponentId();
							component.group_seq = grpId;
							component.col_seq = colId;
							component.row_seq = rowId;
							component.preferencesObj = compObj.getPreferencesObj();
							//Since we are updating the toggle status for all components we will need to make sure all required
							//components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
							//Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
							//and not allow the user to toggle that component even though they should be able to.
							component.toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();
							component.grouperFilterLabel = compObj.getGrouperFilterLabel();
							component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
							component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
							component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
							component.selectedTimeFrame = compObj.getSelectedTimeFrame();
							component.selectedDataGroup = compObj.getSelectedDataGroup();
							if (jQuery(rows[z]).hasClass('closed')) {
								component.expanded = false;
							}
							else {
								component.expanded = true;
							}
							components.push(component);
						}
					}
				}
			}
			WritePreferences(jsonObject);

			if (reload !== undefined && reload === false) {
				return;
			}

			if ( typeof m_viewpointJSON == "undefined") {
				cclParams.push("^MINE^", m_criterion.person_id + ".0", m_criterion.encntr_id + ".0", m_criterion.provider_id + ".0", m_criterion.position_cd + ".0", m_criterion.ppr_cd + ".0", "^" + m_criterion.executable + "^", "^^", "^" + m_criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + m_criterion.category_mean + "^", m_criterion.debug_ind);
				CCLLINK("MP_DRIVER", cclParams.join(","), 1);
			}
			else {
				var viewpointJSON = JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
				m_jsonObject = jsonObject;
				cclParams.push("^MINE^", m_criterion.person_id + ".0", m_criterion.encntr_id + ".0", m_criterion.provider_id + ".0", m_criterion.position_cd + ".0", m_criterion.ppr_cd + ".0", "^" + m_criterion.executable + "^", "^" + m_criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + viewpointJSON.VIEWPOINT_NAME_KEY + "^", m_criterion.debug_ind, "^^", 0, "^" + viewpointJSON.ACTIVE_VIEW_CAT_MEAN + "^");
				CCLLINK(CERN_driver_script, cclParams.join(","), 1);
			}
		},
		ClearCompPreferences: function(componentId) {
			var compObj = MP_Util.GetCompObjById(componentId);
			var style = compObj.getStyles();
			var ns = style.getNameSpace();
			var prefObj = m_jsonObject;
			var filterArr = null;

			if (prefObj != null) {
				var strEval = JSON.parse(JSON.stringify(prefObj));
				var strObj = strEval.user_prefs.page_prefs.components;
				for (var x = strObj.length; x--; ) {
					if (strEval && strObj[x].id === componentId) {
						strObj[x].grouperFilterLabel = "";
						strObj[x].grouperFilterCatLabel = "";
						strObj[x].grouperFilterCriteria = filterArr;
						strObj[x].grouperFilterCatalogCodes = filterArr;

						strObj[x].selectedTimeFrame = "";
						strObj[x].selectedDataGroup = "";
					}
				}
				compObj.setLookbackUnits(compObj.getBrLookbackUnits());
				compObj.setLookbackUnitTypeFlag(compObj.getBrLookbackUnitTypeFlag());
				compObj.setGrouperFilterLabel("");
				compObj.setGrouperFilterCatLabel("");
				compObj.setGrouperFilterCriteria(filterArr);
				compObj.setGrouperFilterCatalogCodes(filterArr);
				compObj.setSelectedTimeFrame("");
				compObj.setSelectedDataGroup("");
				compObj.setPreferencesObj(null);
				m_jsonObject = strEval;
				WritePreferences(m_jsonObject);
				
				//Use the component's render strategy to update the view after clearing settings
				var renderStrategy = compObj.getRenderStrategy();
				if(renderStrategy) {
					var uniqueComponentId = renderStrategy.getComponentId();
					var componentLookbackMenu = $("#lookbackContainer" + uniqueComponentId);
					if(componentLookbackMenu.length) {
						componentLookbackMenu.replaceWith(renderStrategy.createComponentLookback());
					}
					
					var componentFilterMenu = $("#filterDropDownMenu" + uniqueComponentId);
					if(componentFilterMenu.length) {
						componentFilterMenu.replaceWith(renderStrategy.createComponentFilter());
					}
				}
				
				$(compObj.getSectionContentNode()).empty();
				if (compObj.isResourceRequired()) {
					compObj.RetrieveRequiredResources();
				}
				else {
					compObj.InsertData();
				}
			}
		},
		UpdatePrefsIdentifier: function(prefIdentifier) {
			if (prefIdentifier && typeof prefIdentifier === "string") {
				m_prefIdent = prefIdentifier;
			}
		},
		//Updates the component preferences from the components array passed into the function
		UpdateAllCompPreferences: function(componentArr, changePos, saveAsync) {
			var compId = 0;
			var compPrefs = null;
			var compPrefsCnt = 0;
			var compPrefsMap = {};
			var component = null;
			var componentDiv = null;
			var namespace = "";
			var newPrefsInd = false;
			var prefObj = null;
			var prefIndx = 0;
			var tempObj = {};
			var x = 0;
			
			//If saveAsync is anything other then true set it to false
			if(!saveAsync){
			saveAsync = false;
			}
			
			//Check the componentArr and make sure is is populated
			if (!componentArr || !componentArr.length) {
				return;
			}

			//Create the prefs object if it doesnt already exist
			prefObj = m_jsonObject || {
				user_prefs: {
					page_prefs: {
						components: []
					}
				}
			};
			
			//Check to make sure the structure exists so we can populate it
			prefObj.user_prefs = prefObj.user_prefs || {
				page_prefs : {
					components: []
				}
			};
			
			prefObj.user_prefs.page_prefs = prefObj.user_prefs.page_prefs || {
				components: []
			};
			
			prefObj.user_prefs.page_prefs.components = prefObj.user_prefs.page_prefs.components || [];
			compPrefs = prefObj.user_prefs.page_prefs.components;

			//Create a component map so we do not have to loop through the array for each component
			compPrefsCnt = compPrefs.length;
			for ( x = compPrefsCnt; x--; ) {
				compPrefsMap[compPrefs[x].id] = x;
			}

			//Loop through all of the components and update their preferences in the preferences object.
			compPrefsCnt = componentArr.length;
			for ( x = compPrefsCnt; x--; ) {
				component = componentArr[x];
				//Check to see if there is an existing preferences object
				if ( typeof compPrefsMap[component.getComponentId()] != 'undefined') {
					//Update exiting component preferences
					prefIndx = compPrefsMap[component.getComponentId()];
					tempObj = compPrefs[prefIndx];
					newPrefsInd = false;
				}
				else {
					tempObj = {};
					newPrefsInd = true;
				}
				//Save the components basic settings
				tempObj.id = component.getComponentId();
				tempObj.group_seq = component.getPageGroupSequence();
				tempObj.col_seq = component.getColumn();
				tempObj.row_seq = component.getSequence();
				tempObj.preferencesObj = component.getPreferencesObj();
				//Since we are updating the toggle status for all components we will need to make sure all required
				//components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
				//Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
				//and not allow the user to toggle that component even though they should be able to.
				tempObj.toggleStatus = (component.getToggleStatus() === 2) ? 1 : component.getToggleStatus();
				tempObj.expanded = component.isExpanded();

				if (component.getGrouperFilterLabel()) {
					tempObj.grouperFilterLabel = component.getGrouperFilterLabel();
				}
				if (component.getGrouperFilterCriteria()) {
					tempObj.grouperFilterCriteria = component.getGrouperFilterCriteria();
				}
				if (component.getGrouperFilterCatLabel()) {
					tempObj.grouperFilterCatLabel = component.getGrouperFilterCatLabel();
				}
				if (component.getGrouperFilterCatalogCodes()) {
					tempObj.grouperFilterCatalogCodes = component.getGrouperFilterCatalogCodes();
				}

				if (component.getSelectedTimeFrame()) {
					tempObj.selectedTimeFrame = component.getSelectedTimeFrame();
				}
				if (component.getSelectedDataGroup()) {
					tempObj.selectedDataGroup = component.getSelectedDataGroup();
				}

				//Push the new preferences object into the array
				if (newPrefsInd) {
					compPrefs.push(tempObj);
					//Update the mapping with the new element info
					compPrefsMap[tempObj.id] = compPrefs.length - 1;
				}
			}

			//If the changePos flag has been set we will need to update the positions of all components without blowing away existing
			// preferences.
			if (changePos) {
				for ( x = compPrefsCnt; x--; ) {
					component = componentArr[x];
					namespace = component.getStyles().getNameSpace();
					compId = component.getComponentId();
					//Get component div
					componentDiv = $("#" + namespace + compId);
					if (componentDiv.length) {
						//Get the preferences object
						prefIndx = compPrefsMap[component.getComponentId()];
						tempObj = compPrefs[prefIndx];
						//Get the parent of that component container and find out which index it is located at and use that as the sequence.
						tempObj.row_seq = $(componentDiv).index();
						//Save the new sequence back into the component
						component.setSequence(tempObj.row_seq);
					}
				}
			}

			//Save the preferences back to the preferences object.
			m_jsonObject = prefObj;
			WritePreferences(m_jsonObject,null,saveAsync);
		},
		UpdateSingleCompPreferences: function(componentObject, saveAsync){
			MP_Core.AppUserPreferenceManager.UpdateAllCompPreferences([componentObject],false,saveAsync)
		},
		SaveCompPreferences: function(componentId, theme, expCol, changePos) {
			var compObj = MP_Util.GetCompObjById(componentId);
			var prefObj = m_jsonObject;
			var noMatch = true;
			if (prefObj != null && !changePos) {
				var strEval = JSON.parse(JSON.stringify(prefObj));
				var strObj = strEval.user_prefs.page_prefs.components;

				for (var x = strObj.length; x--; ) {
					if (strEval && strObj[x].id === componentId) {
						noMatch = false;
						if (theme) {
							strObj[x].compThemeColor = theme;
						}
						if (expCol) {
							if (expCol == "1") {
								strObj[x].expanded = true;
							}
							else {
								strObj[x].expanded = false;
							}
						}

						if (compObj.getGrouperFilterLabel()) {
							strObj[x].grouperFilterLabel = compObj.getGrouperFilterLabel();
						}
						if (compObj.getGrouperFilterCatLabel()) {
							strObj[x].grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
						}
						if (compObj.getGrouperFilterCriteria()) {
							strObj[x].grouperFilterCriteria = compObj.getGrouperFilterCriteria();
						}
						if (compObj.getGrouperFilterCatalogCodes() || compObj.getGrouperFilterCatalogCodes() === null) {
							strObj[x].grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
						}
						else {
							strObj[x].grouperFilterCatalogCodes = [];
						}

						if (compObj.getSelectedTimeFrame()) {
							strObj[x].selectedTimeFrame = compObj.getSelectedTimeFrame();
						}
						if (compObj.getSelectedDataGroup()) {
							strObj[x].selectedDataGroup = compObj.getSelectedDataGroup();
						}
						//Save the components toggle status and the column and sequence information
						//Since we are updating the toggle status for all components we will need to make sure all required
						//components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
						//Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
						//and not allow the user to toggle that component even though they should be able to.
						strObj[x].toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();
						strObj[x].col_seq = compObj.getColumn();
						strObj[x].row_seq = compObj.getSequence();
						strObj[x].preferencesObj = compObj.getPreferencesObj();
					}
				}

				if (noMatch) {//single comp change but comp doesn't have user prefs
					var tempObj = {};
					tempObj.id = componentId;
					tempObj.group_seq = compObj.getPageGroupSequence();
					tempObj.col_seq = compObj.getColumn();
					tempObj.row_seq = compObj.getSequence();
					tempObj.preferencesObj = compObj.getPreferencesObj();
					tempObj.compThemeColor = theme;

					if (compObj.getGrouperFilterLabel()) {
						tempObj.grouperFilterLabel = compObj.getGrouperFilterLabel();
					}
					if (compObj.getGrouperFilterCriteria()) {
						tempObj.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
					}
					if (compObj.getGrouperFilterCatLabel()) {
						tempObj.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
					}
					if (compObj.getGrouperFilterCatalogCodes()) {
						tempObj.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
					}

					if (compObj.getSelectedTimeFrame()) {
						tempObj.selectedTimeFrame = compObj.getSelectedTimeFrame();
					}
					if (compObj.getSelectedDataGroup()) {
						tempObj.selectedDataGroup = compObj.getSelectedDataGroup();
					}
					//Save the components toggle status
					//Since we are updating the toggle status for all components we will need to make sure all required
					//components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
					//Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
					//and not allow the user to toggle that component even though they should be able to.
					tempObj.toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();

					tempObj.expanded = compObj.isExpanded();
					strObj.push(tempObj);
				}
				m_jsonObject = strEval;
				WritePreferences(m_jsonObject);
			}
			else {
				var body = document.body;
				var groups = Util.Style.g("col-group", body, "div");
				var grpId = 0;
				var colId = 0;
				var rowId = 0;
				var compId = 0;

				var jsonObject = {};
				jsonObject.user_prefs = {};
				var userPrefs = jsonObject.user_prefs;
				userPrefs.page_prefs = {};
				var pagePrefs = userPrefs.page_prefs;
				pagePrefs.components = [];
				var components = pagePrefs.components;
				var cclParams = [];

				//alert("groups.length: " + groups.length)
				for (var x = 0, xl = groups.length; x < xl; x++) {
					//TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
					grpId = x + 1;
					//get liquid layout
					var liqLay = Util.Style.g("col-outer1", groups[x], "div");
					if (liqLay.length > 0) {
						//get each child column
						var cols = Util.gcs(liqLay[0]);
						for (var y = 0, yl = cols.length; y < yl; y++) {
							colId = y + 1;
							var rows = Util.gcs(cols[y]);
							for (var z = 0, zl = rows.length; z < zl; z++) {
								var component = {};
								rowId = z + 1;
								compId = jQuery(rows[z]).attr('id');
								compObj = MP_Util.GetCompObjByStyleId(compId);
								component.id = compObj.getComponentId();

								if (compObj.getColumn() !== 99) {
									component.group_seq = 1;
									component.col_seq = colId;
									component.row_seq = rowId;
								}
								else {
									component.group_seq = 0;
									component.col_seq = 99;
									component.row_seq = rowId;
								}
								if (compObj.getCompColor()) {
									component.compThemeColor = compObj.getCompColor();
								}
								//Save the components toggle status
								//Since we are updating the toggle status for all components we will need to make sure all required
								//components get marked as On(1) and not required(2).  Because if the bedrock preferences change from
								//Required to On for a component the existing user prefs toggle status of Required will override the bedrock preference
								//and not allow the user to toggle that component even though they should be able to.
								component.toggleStatus = (compObj.getToggleStatus() === 2) ? 1 : compObj.getToggleStatus();
								compObj.setColumn(component.col_seq);
								compObj.setSequence(component.row_seq);
								//added preferences to component
								component.preferencesObj = compObj.getPreferencesObj();
								component.grouperFilterLabel = compObj.getGrouperFilterLabel();
								component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
								component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();

								component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();

								component.selectedTimeFrame = compObj.getSelectedTimeFrame();
								component.selectedDataGroup = compObj.getSelectedDataGroup();
								if (jQuery(rows[z]).hasClass('closed')) {
									component.expanded = false;
								}
								else {
									component.expanded = true;
								}
								components.push(component);
							}
						}
					}
				}
				WritePreferences(jsonObject);
				m_jsonObject = jsonObject;
			}
		},
		SaveQOCCompPreferences: function(componentId, theme, expCol, changePos, selectedViewId) {
			var QOCTabDiv = _g(selectedViewId);
			var groups = Util.Style.g("col-group", QOCTabDiv, "div");
			var grpId = 0;
			var colId = 0;
			var rowId = 0;
			var compId = 0;

			//there must be a last saved view in user prefs if they've got this far
			var jsonObj = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
			var userPrefs;
			var pagePrefs;
			var views;
			var lastSavedView;
			var saveAsync=false;
			if (jsonObj) {
				userPrefs = jsonObj.user_prefs;
				pagePrefs = userPrefs.page_prefs;
				views = pagePrefs.views;
				lastSavedView = pagePrefs.last_saved_view;
				var viewIndex = -1;
				var viewsLength = views.length;
				for (var j = viewsLength; j--; ) {
					var currentViewName = views[j].label;
					if (currentViewName === lastSavedView) {
						viewIndex = j;
						break;
					}
				}
			}

			if (lastSavedView && viewIndex >= 0) {
				views[viewIndex].components = [];
				for (var x = 0, xl = groups.length; x < xl; x++) {
					//TODO: be aware that when the organizer level component can be moved, this x+1 will need to be modified
					grpId = x + 1;
					//get liquid layout
					var liqLay = Util.Style.g("col-outer1", groups[x], "div");
					if (liqLay.length > 0) {
						//get each child column
						var cols = Util.gcs(liqLay[0]);
						for (var y = 0, yl = cols.length; y < yl; y++) {
							colId = y + 1;
							var rows = Util.gcs(cols[y]);
							for (var z = 0, zl = rows.length; z < zl; z++) {
								var component = {};
								rowId = z + 1;
								compId = jQuery(rows[z]).attr('id');
								compObj = MP_Util.GetCompObjByStyleId(compId);
								component.id = compObj.getComponentId();
								component.reportId = compObj.getReportId();
								component.label = compObj.getLabel();
								if (compObj.getColumn() !== 99) {
									component.group_seq = 1;
									component.col_seq = colId;
									component.row_seq = rowId;
								}
								else {
									component.group_seq = 0;
									component.col_seq = 99;
									component.row_seq = rowId;
								}
								if (compObj.getCompColor()) {
									component.compThemeColor = compObj.getCompColor();
								}
								component.grouperFilterLabel = compObj.getGrouperFilterLabel();
								component.grouperFilterCatLabel = compObj.getGrouperFilterCatLabel();
								component.grouperFilterCriteria = compObj.getGrouperFilterCriteria();
								component.grouperFilterCatalogCodes = compObj.getGrouperFilterCatalogCodes();
								component.selectedTimeFrame = compObj.getSelectedTimeFrame();
								component.selectedDataGroup = compObj.getSelectedDataGroup();
								if (jQuery(rows[z]).hasClass('closed')) {
									component.expanded = false;
								}
								else {
									component.expanded = true;
								}
								if (compObj.getPreferencesObj()) {
									component.preferencesObj = compObj.getPreferencesObj();
									saveAsync = true;
								}

								views[viewIndex].components.push(component);
							}
						}
					}
				}
			}
			WritePreferences(jsonObj,null,saveAsync);
			m_jsonObject = jsonObj;
		},
		SaveViewpointPreferences: function(vpNameKey, vwpObj) {
			WriteViewpointPreferences(vwpObj.VIEWS, vpNameKey);
		},
		SaveQOCPreferences: function(jsonObj) {
			m_prefIdent = "MP_COMMON_ORDERS_V4";
			m_criterion.category_mean = "MP_COMMON_ORDERS_V4";
			WritePreferences(jsonObj);
		},
		GetQOCPreferences: function() {
			if (!m_criterion) {
				alert("Validation Failed: the AppUserPreferenceManager must be initialized prior to usage.");
				return null;
			}
			//if this jsonObject is defined but is for a different view
			if (m_jsonObject) {
				if (!m_jsonObject.user_prefs.page_prefs.views) {
					m_jsonObject = null;
				}
			}
			if (!m_jsonObject) {
				m_prefIdent = "MP_COMMON_ORDERS_V4";
				m_criterion.category_mean = "MP_COMMON_ORDERS_V4";
				this.LoadPreferences();
			}

			return m_jsonObject;
		},
		ClearPreferences: function() {
			WritePreferences(null);
			var cclParams = [];
			if ( typeof m_viewpointJSON == "undefined") {
				cclParams = ["^MINE^", m_criterion.person_id + ".0", m_criterion.encntr_id + ".0", m_criterion.provider_id + ".0", m_criterion.position_cd + ".0", m_criterion.ppr_cd + ".0", "^" + m_criterion.executable + "^", "^^", "^" + m_criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + m_criterion.category_mean + "^", m_criterion.debug_ind];
				CCLLINK("MP_DRIVER", cclParams.join(","), 1);
			}
			else {
				var viewpointJSON = JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
				cclParams = ["^MINE^", m_criterion.person_id + ".0", m_criterion.encntr_id + ".0", m_criterion.provider_id + ".0", m_criterion.position_cd + ".0", m_criterion.ppr_cd + ".0", "^" + m_criterion.executable + "^", "^" + m_criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + viewpointJSON.VIEWPOINT_NAME_KEY + "^", m_criterion.debug_ind, "^^", 0, "^" + viewpointJSON.ACTIVE_VIEW_CAT_MEAN + "^"];
				CCLLINK(CERN_driver_script, cclParams.join(","), 1);
			}
		},
		RemoveFolder: function(thisId, activeDivId) {
			$("#" + thisId).remove();
			MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, activeDivId);
		},
		/**
		 * Returns the json object associated to the primary div id of the component.  It is assumed LoadPreferences has been called prior to
		 * execution
		 * @param {Object} id
		 */
		GetComponentById: function(id) {
			if (m_jsonObject) {
				var components = m_jsonObject.user_prefs.page_prefs.components;
				for (var x = components.length; x--; ) {
					var component = components[x];
					if (component.id == id) {
						return component;
					}
				}
			}
			return null;
		}
	};
	function WriteViewpointPreferences(jsonObject, viewpointNameKey, successMessage) {
		var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
		info.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "WriteViewpointPreferences");
				var jsonEval = JSON.parse(this.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "Z") {
					m_jsonObject = null;
				}
				else if (recordData.STATUS_DATA.STATUS == "S") {
					m_jsonObject = jsonObject;
					if (successMessage && successMessage.length > 0) {
						alert(successMessage);
					}
				}
				else {
					MP_Util.LogScriptCallError(null, this, "mp_core.js", "WriteViewpointPreferences");
					var errAr = [];
					var statusData = recordData.STATUS_DATA;
					errAr.push("STATUS: " + statusData.STATUS);
					for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
						var ss = statusData.SUBEVENTSTATUS[x];
						errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
					}
					window.status = "Error saving viewpoint user preferences: " + errAr.join(",");
				}
			}
			if (this.readyState == 4) {
				MP_Util.ReleaseRequestReference(this);
			}
		};

		var sJson = (jsonObject != null) ? JSON.stringify(jsonObject) : "";
		var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + viewpointNameKey + "^", "~" + sJson + "~"];
		if (CERN_BrowserDevInd) {
			var url = "MP_MAINTAIN_USER_PREFS?parameters=" + ar.join(",");
			info.open('GET', url, false);
			info.send(null);
		}
		else {
			info.open('GET', "MP_MAINTAIN_USER_PREFS", false);
			info.send(ar.join(","));
		}
	}

	function WritePreferences(jsonObject, successMessage, saveAsync) {
		var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
		//If SaveAync is anything but true, its set to false
		if(!saveAsync){
			saveAsync = false;
		}
		info.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "WritePreferences");
				var jsonEval = JSON.parse(this.responseText);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS == "Z") {
					m_jsonObject = null;
				}
				else if (recordData.STATUS_DATA.STATUS == "S") {
					m_jsonObject = jsonObject;
					if (successMessage && successMessage.length > 0) {
						alert(successMessage);
					}
				}
				else {
					MP_Util.LogScriptCallError(null, this, "mp_core.js", "WritePreferences");
					var errAr = [];
					var statusData = recordData.STATUS_DATA;
					errAr.push("STATUS: " + statusData.STATUS);
					for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
						var ss = statusData.SUBEVENTSTATUS[x];
						errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
					}
					window.status = "Error saving user preferences: " + errAr.join(",");
				}
			}
			if (this.readyState == 4) {
				MP_Util.ReleaseRequestReference(this);
			}
		};

		var sJson = (jsonObject != null) ? JSON.stringify(jsonObject) : "";
		var ar = ["^mine^", m_criterion.provider_id + ".0", "^" + m_prefIdent + "^", "~" + sJson + "~"];
		if (CERN_BrowserDevInd) {
			var url = "MP_MAINTAIN_USER_PREFS?parameters=" + ar.join(",");
			info.open('GET', url, saveAsync);
			info.send(null);
		}
		else {
			info.open('GET', "MP_MAINTAIN_USER_PREFS", saveAsync);
			info.send(ar.join(","));
		}
	}

}();

/**
 * @namespace
 */
var MP_Util = function() {
	var m_df = null;
	var m_nf = null;
	var m_codeSets = [];
	return {
		addComponentsToGlobalStorage: function(components) {
			//If you try to add nothing, just return
			if(!components || !components.length) {
				return;
			}
			//If for some reason the global component storage is null, new it up
			if(CERN_MPageComponents === null) {
				CERN_MPageComponents = [];
			}
			//Store this view's components in the global component list
			for(var x = 0, xl = components.length; x < xl; x++) {
				if(components[x]) {
					CERN_MPageComponents.push(components[x]);
				}
			}
		},
		GetComponentArray: function(components) {
			var grpAr = [];
			var colAr = [];
			var rowAr = [];
			var curCol = -1;
			var curGrp = -1;

			var sHTML = [];

			//first layout the group/columns/rows of components
			if (components != null) {
				components.sort(SortMPageComponents);

				for (var x = 0, xl = components.length; x < xl; x++) {
					var component = components[x];

					if (component.isDisplayable()) {//based on filter logic, only display if criteria is met
						var compGrp = component.getPageGroupSequence();
						var compCol = component.getColumn();

						if (compGrp != curGrp) {
							curCol = -1;
							colAr = [];
							grpAr.push(colAr);
							curGrp = compGrp;
						}

						if (compCol != curCol) {
							rowAr = [];
							colAr.push(rowAr);
							curCol = compCol;
						}
						rowAr.push(component);
					}
				}
			}
			return grpAr;
		},
		/**
		 * Helper utility to retrieve the <code>Criterion</code> Object generated from the provide JSON
		 * @param js_criterion [REQUIRED] The JSON associated to the criterion data that is to be loaded
		 * @param static_content [REQUIRED] The <code>String</code> location in which the static content resides
		 */
		GetCriterion: function(js_criterion, static_content) {
			MP_Util.LogDebug("Criterion: " + JSON.stringify(js_criterion));
			var jsCrit = js_criterion.CRITERION;
			var criterion = new MP_Core.Criterion(jsCrit, static_content);
			var codeArray = MP_Util.LoadCodeListJSON(jsCrit.CODES);
			var jsPatInfo = jsCrit.PATIENT_INFO;
			var patInfo = new MP_Core.PatientInformation();
			var jsPeriopCases = jsCrit.PERIOP_CASE;
			var oPeriopCases = new MP_Core.PeriopCases();
			patInfo.setSex(MP_Util.GetValueFromArray(jsPatInfo.SEX_CD, codeArray));
			if (jsPatInfo.DOB != "") {
				var dt = new Date();
				dt.setISO8601(jsPatInfo.DOB);
				patInfo.setDOB(dt);
			}
			criterion.setPatientInfo(patInfo);
			oPeriopCases.setCaseID(jsPeriopCases.CASE_ID);
			oPeriopCases.setDays(jsPeriopCases.DAYS);
			oPeriopCases.setHours(jsPeriopCases.HOURS);
			oPeriopCases.setMins(jsPeriopCases.MINS);
			oPeriopCases.setCntdwnDscFlg(jsPeriopCases.CNTDWN_DESC_FLAG);
			criterion.setPeriopCases(oPeriopCases);
			return criterion;
		},

		/**
		 * Calculates the lookback date based on the current date and time
		 * @param lookbackDays [REQUIRED] The number of days to look back in time
		 * @return <code>Date</code> Object representing the lookback date and time
		 */
		CalcLookbackDate: function(lookbackDays) {
			var retDate = new Date();
			var hrs = retDate.getHours();
			hrs -= (lookbackDays * 24);
			retDate.setHours(hrs);
			return retDate;
		},
		/**
		 * Calculates the within time from the provide date and time.
		 * @param dateTime [REQUIRED] The <code>Date</code> Object in which to calculate the within time
		 * @return <code>String</code> representing the time that has passed from the provided date and time
		 */
		CalcWithinTime: function(dateTime) {
			return (GetDateDiffString(dateTime, null, null, true));
		},
		/**
		 * Calculates the age of a patient from a given point in time.  If the point in time is not provided, the current date/time is
		 * utilized
		 * @param birthDt [REQUIRED] The <code>Date</code> Object in which to calculate the age of the patient
		 * @param fromDate [OPTIONAL] The <code>Date</code> Object in which to calculate the age of the patient from.  This is useful in
		 * cases
		 * where the patient is deceased and the date utilized is the deceased date.
		 * @return <code>String</code> representing the age of the patient
		 */
		CalcAge: function(birthDt, fromDate) {
			//If from Date is null (not passed in) then set to current Date
			fromDate = (fromDate) ? fromDate : new Date();
			return (GetDateDiffString(birthDt, fromDate, 1, false));
		},
		/**
		 * Display the date and time based on the configuration of the component
		 * @param component [REQUIRED] The component in which holds the configuration for the date formatting
		 * @param date [REQUIRED] The date in which to properly format
		 * @return <code>String</code> representing the date and time of the date provided
		 */
		DisplayDateByOption: function(component, date) {
			var df = MP_Util.GetDateFormatter();
			var dtFormatted = "";
			switch (component.getDateFormat()) {
				case 1:
					return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR));
				case 2:
					return (df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR));
				case 3:
					return (MP_Util.CalcWithinTime(date));
				case 4:
					//Display No Date.  Additional logic will need to be applied to hide column.
					return ("&nbsp");
				default:
					return df.format(date, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
			}
		},
		DisplaySelectedTab: function(showDiv, anchorId) {
			var i = 0;
			if (window.name == "a-tab0") {//first tab is default
				window.name = "";
			}
			else {
				window.name = showDiv + ',' + anchorId;
			}
			var body = document.body;
			var divs = Util.Style.g("div-tab-item", body);
			for ( i = divs.length; i--; ) {
				if (divs[i].id == showDiv) {
					divs[i].style.display = 'block';
				}
				else {
					divs[i].style.display = 'none';
				}
			}

			var anchors = Util.Style.g("anchor-tab-item", body);
			for ( i = anchors.length; i--; ) {
				if (anchors[i].id == anchorId) {
					anchors[i].className = "anchor-tab-item active";
				}
				else {
					anchors[i].className = "anchor-tab-item inactive";
				}
			}

			//remove initial Customize anchor href
			var custNode = _g("custView");
			if (custNode != null) {
				custNode.href = "";
				custNode.innerHTML = "";
			}

			for (var yl = CERN_TabManagers.length; yl--; ) {
				var tabManager = CERN_TabManagers[yl];
				var tabItem = tabManager.getTabItem();
				if (tabItem.key == showDiv) {
					tabManager.loadTab();
					tabManager.setSelectedTab(true);
					var components = tabItem.components;
					if (components != null && components.length > 0) {
						for (var xl = components.length; xl--; ) {
							var component = components[xl];
							MP_Util.Doc.AddCustomizeLink(component.getCriterion());
							break;
						}
					}
				}
				else {
					tabManager.setSelectedTab(false);
				}
			}
		},
		DisplaySelectedTabQOC: function(showDiv, anchorId, noViewSaved) {
			var i = 0;
			var firstTimeLoadingMPage = false;
			if (noViewSaved) {
				var dropDownList = _g("viewListSelectorID");
				if (dropDownList.options[dropDownList.options.length - 1].value == "Blank_Space") {
					dropDownList.remove(dropDownList.options.length - 1);
					firstTimeLoadingMPage = true;
					//sort of a quick fix, but desperate times call for desperate measures
					//on intitial load with no last saved view in user prefs, the noViewsSaved variable will always
					//be true until the user refreshes the page. The only time no view has been saved is the time we
					//delete the Blank_Space from the view selector.
				}

				var noSavedViewsStatement = _g("noSavedViews");
				if (!Util.Style.ccss(noSavedViewsStatement, "hidden")) {
					Util.Style.acss(noSavedViewsStatement, "hidden");
				}
			}

			if (window.name == "a-tab0")//first tab is default
			{
				window.name = "";
			}
			else {
				window.name = showDiv + ',' + anchorId;
			}
			var body = document.body;
			var divs = Util.Style.g("div-tab-item", body);
			for ( i = divs.length; i--; ) {
				if (divs[i].id == showDiv) {
					divs[i].style.display = 'block';
					if (Util.Style.ccss(divs[i], "div-tab-item-not-selected")) {
						Util.Style.rcss(divs[i], "div-tab-item-not-selected");
						Util.Style.acss(divs[i], "div-tab-item-selected");
					}
				}
				else {
					divs[i].style.display = 'none';
					if (Util.Style.ccss(divs[i], "div-tab-item-selected")) {
						Util.Style.rcss(divs[i], "div-tab-item-selected");
						Util.Style.acss(divs[i], "div-tab-item-not-selected");
					}
				}
			}

			var anchors = Util.Style.g("anchor-tab-item", body);
			for ( i = anchors.length; i--; ) {
				if (anchors[i].id == anchorId) {
					anchors[i].className = "anchor-tab-item active";
				}
				else {
					anchors[i].className = "anchor-tab-item inactive";
				}
			}

			//remove initial Customize anchor href
			var custNode = _g("custView");
			if (custNode) {
				custNode.href = "";
				custNode.innerHTML = "";
			}

			for (var yl = CERN_TabManagers.length; yl--; ) {
				var tabManager = CERN_TabManagers[yl];
				var tabItem = tabManager.getTabItem();
				if (tabItem.key == showDiv) {
					tabManager.loadTab();
					tabManager.setSelectedTab(true);

					//grab user preferences, and then save back preferences with updated last saved view
					var jsonObj = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
					var userPrefs, pagePrefs, views, lastSavedView;
					if (jsonObj) {
						userPrefs = jsonObj.user_prefs;
						pagePrefs = userPrefs.page_prefs;
						views = pagePrefs.views;
						pagePrefs.last_saved_view = tabItem.name;
					}
					else {
						jsonObj = {};
						userPrefs = jsonObj.user_prefs = {};
						pagePrefs = userPrefs.page_prefs = {};
						views = pagePrefs.views = [];
						lastSavedView = pagePrefs.last_saved_view = tabItem.name;
					}
					var viewsLength = views.length;
					var newView = {};
					newView.label = tabItem.name;
					newView.components = [];
					if (viewsLength === 0) {
						views.push(newView);
					}
					else {
						var alreadyAddedView = false;
						for (var j = viewsLength; j--; ) {
							var currentViewName = views[j].label;
							if (currentViewName === newView.label) {
								alreadyAddedView = true;
								break;
							}
						}
						if (!alreadyAddedView) {
							views.push(newView);
						}
					}

					MP_Core.AppUserPreferenceManager.SaveQOCPreferences(jsonObj);
					var criterion;
					var components = tabItem.components;
					if (components != null && components.length > 0) {
						for (var xl = components.length; xl--; ) {
							var component = components[xl];
							criterion = component.getCriterion();
							MP_Util.Doc.AddCustomizeLink(criterion);
							break;
						}
					}
					MP_Util.Doc.InitQOCDragAndDrop(tabItem.key);
					var categoryMeaning = "MP_COMMON_ORDERS_V4";
					var tabItemKey = tabItem.key;
					//Update the menu shown when the page menu is clicked
					$("#pageMenu" + categoryMeaning).unbind("click").click(function(){
						MP_MenuManager.showMenu("pageMenu" + tabItemKey);
					});
				}
				else {
					tabManager.setSelectedTab(false);
				}
			}
		},
		OpenTab: function(compId) {
			for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
				var comp = CERN_MPageComponents[x];
				var styles = comp.getStyles();
				if (styles.getId() == compId) {
					comp.openTab();
				}
			}
		},
		OpenIView: function(compId) {
			var comp = MP_Util.GetCompObjByStyleId(compId);
			comp.openIView();
		},
		LaunchMenuSelection: function(compId, menuItemId) {
			//get the exact component from global array
			for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
				var comp = CERN_MPageComponents[x];
				var crit = comp.getCriterion();
				var styles = comp.getStyles();
				if (styles.getId() == compId) {
					//found
					comp.openDropDown(menuItemId);
					break;
				}
			}

		},
		LaunchIViewMenuSelection: function(compId, bandName, sectionName, itemName) {
			var rootId = parseInt(compId, 10);
			var component = MP_Util.GetCompObjById(rootId);
			var criterion = component.getCriterion();
			var launchIViewApp = window.external.DiscernObjectFactory("TASKDOC");
			launchIViewApp.LaunchIView(bandName, sectionName, itemName, criterion.person_id, criterion.encntr_id);
		},
		LaunchMenu: function(menuId, componentId) {
			var menu = _g(menuId);
			MP_Util.closeMenuInit(menu, componentId);
			if (menu != null) {
				if (Util.Style.ccss(menu, "menu-hide")) {
					_g(componentId).style.zIndex = 2;
					Util.Style.rcss(menu, "menu-hide");
				}
				else {
					_g(componentId).style.zIndex = 1;
					Util.Style.acss(menu, "menu-hide");
				}
			}
		},
		LaunchLookBackSelection: function(compId, lookBackUnits, lookBackType) {
			var i18nCore = i18n.discernabu;
			var rootId = parseInt(compId, 10);
			var component = MP_Util.GetCompObjById(rootId);
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var scope = component.getScope();
			var displayText = "";
			var lbtVal = parseInt(lookBackType, 10);

			if (component.getLookbackUnits() !== lookBackUnits || component.getLookbackUnitTypeFlag() !== lbtVal) {
				component.setLookbackUnits(lookBackUnits);
				component.setLookbackUnitTypeFlag(lbtVal);

				if (scope > 0) {
					if (lookBackUnits > 0 && lbtVal > 0) {
						var newText = "";
						switch(lbtVal) {
							case 1:
								newText = i18nCore.LAST_N_HOURS.replace("{0}", lookBackUnits);
								break;
							case 2:
								newText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
								break;
							case 3:
								newText = i18nCore.LAST_N_WEEKS.replace("{0}", lookBackUnits);
								break;
							case 4:
								newText = i18nCore.LAST_N_MONTHS.replace("{0}", lookBackUnits);
								break;
							case 5:
								newText = i18nCore.LAST_N_YEARS.replace("{0}", lookBackUnits);
								break;
							default:
								newText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
								break;
						}
						switch(scope) {
							case 1:
								displayText = i18nCore.ALL_N_VISITS.replace("{0}", newText);
								break;
							case 2:
								displayText = i18nCore.SELECTED_N_VISIT.replace("{0}", newText);
								break;
						}
					}
					else {
						switch(scope) {
							case 1:
								displayText = i18nCore.All_VISITS;
								break;
							case 2:
								displayText = i18nCore.SELECTED_VISIT;
								break;
						}
					}
				}

				MP_Util.Doc.CreateLookBackMenu(component, 2, displayText);

				if (ns === "lab" || ns === "dg" || ns === "ohx" || ns === "ohx2") {
					component.getSectionContentNode().innerHTML = "";
				}
				if (component.isResourceRequired()) {
					component.RetrieveRequiredResources();
				}
				else {
					component.InsertData();
				}
			}
		},
				LaunchCompFilterSelection: function(compId, eventSetIndex, applyFilterInd) {
			var component = MP_Util.GetCompObjById(compId);
			var i18nCore = i18n.discernabu;
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var mnuDisplay;
			if (eventSetIndex === -1)
			{
			 mnuDisplay = i18nCore.FACILITY_DEFINED_VIEW;
			}
			else 
			{
				if (ns === "ohx" || ns === "ohx2") {
					 mnuDisplay = component.getGrouperCatLabel(eventSetIndex).toString();		
				}
				else {
					mnuDisplay = component.getGrouperLabel(eventSetIndex).toString();
				}		
			}
			var dispVar = i18nCore.FACILITY_DEFINED_VIEW;
			var styleId = style.getId();
			var loc = component.getCriterion().static_content;
			var mnuId = styleId + "TypeMenu";
			var z = 0;

			if (ns === "ohx" || ns === "ohx2") {
				var catCodeList = component.getGrouperCatalogCodes(eventSetIndex);
			}
			else {
				var eventSetList = component.getGrouperCriteria(eventSetIndex);
			}

			//Set component prefs variables with filter settings
			if (ns === "ohx" || ns === "ohx2") {
				component.setGrouperFilterCatLabel(mnuDisplay);
			}
			else {
				component.setGrouperFilterLabel(mnuDisplay);
			}
			if (mnuDisplay !== dispVar) {

				if (ns === "ohx" || ns === "ohx2") {
					component.setGrouperFilterCatalogCodes(catCodeList);
				}
				else {
					component.setGrouperFilterCriteria(eventSetList);
				}

			}
			else {
				component.setGrouperFilterCriteria(null);
				component.setGrouperFilterCatalogCodes(null);
			}

			//Find Filter Applied msg span and replace it only if the Facility defined view is not selected
			var filterAppliedSpan = _g("cf" + compId + "msg");
			if (filterAppliedSpan) {
				// Remove the old span element
				Util.de(filterAppliedSpan);
			}
			if (mnuDisplay !== dispVar) {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf", compId, "msg' class='filter-applied-msg' title='", mnuDisplay, "'>", i18nCore.FILTER_APPLIED, "</span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join('');
				var lbDropDownDiv = _g("lbMnuDisplay" + compId);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}
			else {
				var newFilterAppliedSpan = Util.ce('span');
				var filterAppliedArr = ["<span id='cf", compId, "msg' class='filter-applied-msg' title=''></span>"];
				newFilterAppliedSpan.innerHTML = filterAppliedArr.join('');
				var lbDropDownDiv = _g("lbMnuDisplay" + compId);
				Util.ia(newFilterAppliedSpan, lbDropDownDiv);
			}

			//Find the content div
			var contentDiv = _g("Accordion" + compId + "ContentDiv");
			contentDiv.innerHTML = "";

			//Create the new content div innerHTML with the select list
			var contentDivArr = [];
			contentDivArr.push("<div id='cf", mnuId, "' class='acc-mnu'>");
			contentDivArr.push("<span id='cflabel", compId, "' onclick='MP_Util.LaunchMenu(\"", mnuId, "\", \"", styleId, "\");'>", i18nCore.FILTER_LABEL, mnuDisplay, "<a id='compFilterDrop", compId, "'><img src='", loc, "/images/3943_16.gif'></a></span>");
			contentDivArr.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='", mnuId, "'><div class='acc-mnu-contentbox'>");
			contentDivArr.push("<div><span id='cf", styleId, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",-1,1);'>", i18nCore.FACILITY_DEFINED_VIEW, "</span></div>");

			var groupLen = component.m_grouper_arr.length;
			for ( z = 0; z < groupLen; z++) {
				if (component.getGrouperLabel(z)) {
					var esIndex = z;
					contentDivArr.push("<div><span id='cf", styleId, z, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",", esIndex, ",1);'>", component.getGrouperLabel(z).toString(), "</span></div>");
				}
				if (component.getGrouperCatLabel(z)) {
					var esIndex = z;
					contentDivArr.push("<div><span id='cf", styleId, z, "' class='cf-mnu' onclick='MP_Util.LaunchCompFilterSelection(", compId, ",", esIndex, ",1);'>", component.getGrouperCatLabel(z).toString(), "</span></div>");
				}
			}
			contentDivArr.push("</div></div></div>");
			contentDiv.innerHTML = contentDivArr.join('');

			if (applyFilterInd === 1) {
				if (mnuDisplay === i18nCore.FACILITY_DEFINED_VIEW) {
					if (component.isResourceRequired()) {
						component.RetrieveRequiredResources();
					}
					else {
						component.InsertData();
					}
				}
				else {

					if (ns === "ohx" || ns === "ohx2") {
						component.FilterRefresh(mnuDisplay, catCodeList);
					}
					else {
						component.FilterRefresh(mnuDisplay, eventSetList);
					}

				}
			}
		},
		LaunchViewMenu: function(menuId) {
			var menu = _g(menuId);
			MP_Util.closeViewMenuInit(menu);
			if (menu) {
				if (Util.Style.ccss(menu, "menu-hide")) {
					_g(menu.id).style.zIndex = 2;
					Util.Style.rcss(menu, "menu-hide");
				}
				else {
					_g(menu.id).style.zIndex = 1;
					Util.Style.acss(menu, "menu-hide");
				}

				//change position of viewpoint menu if chart search enabled
				var js_viewpoint = JSON.parse(m_viewpointJSON);
				if (parseInt(js_viewpoint.VIEWPOINTINFO_REC.CS_ENABLED, 10)) {
					var sec = _g("viewDrop");
					var ofs = Util.goff(sec);
					menu.style.left = (ofs[0] - 5) + "px";
					menu.style.top = (ofs[1] + 24) + "px";
				}
			}
		},
		closeViewMenuInit: function(inMenu) {
			var menuId = inMenu.id;
			var e = window.event;

			var menuLeave = function(e) {
				if (!e) {
					var e = window.event;
				}
				var relTarg = e.relatedTarget || e.toElement;
				if (e.relatedTarget.id == inMenu.id) {
					Util.Style.acss(inMenu, "menu-hide");
				}
				e.stopPropagation();
				Util.cancelBubble(e);
			};

			if (window.attachEvent) {
				Util.addEvent(inMenu, "mouseleave", function() {
					Util.Style.acss(inMenu, "menu-hide");
				});
			}
			else {
				Util.addEvent(inMenu, "mouseout", menuLeave);
			}
		},
		closeMenuInit: function(inMenu, compId) {
			var menuId;
			var docMenuId = compId + "Menu";
			var lbMenuId = compId + "Mnu";
			var cfMenuId = compId + "TypeMenu";

			var menuLeave = function(e) {
				if (!e) {
					var e = window.event;
				}
				var relTarg = e.relatedTarget || e.toElement;
				if (e.relatedTarget.id == inMenu.id) {
					Util.Style.acss(inMenu, "menu-hide");
				}
				e.stopPropagation();
				Util.cancelBubble(e);
			}
			if (inMenu.id == docMenuId || inMenu.id == lbMenuId || inMenu.id == cfMenuId) {//m2 'docMenu'
				menuId = compId;
			}
			if (!e)
				var e = window.event;
			if (window.attachEvent) {
				Util.addEvent(inMenu, "mouseleave", function() {
					Util.Style.acss(inMenu, "menu-hide");
					_g(menuId).style.zIndex = 1;
				});
			}
			else {
				Util.addEvent(inMenu, "mouseout", menuLeave);
			}
		},
		/**
		 * Provides the ability to construct the text that is to be placed after the label of the Component.
		 * Each component defines whether or not the number of items within the component should be displayed
		 * in the title of the component.  This is a requirements decision and will have to be answered upon creation
		 * of the component.  In addition, the lookback units and scope have been moved to the
		 * subtitle text line and are no longer necessary in the title text.
		 *
		 * The requirement is for each component to define whether or not the contract exists to display a number of items
		 * within the component header.  The reason for this contract is when 'no results found' is displayed, the count of zero
		 * must be displayed to indicate to the user if there are items within the component.  As for components who do not display
		 * a count, the user will still have to manually open the component to determine whether or not data exists.
		 *
		 * TODO: The future thought is that in the case of 'no results found' or 'error retrieving data', an additional indicator
		 * will be added to the component in some manner to indicate the status.  This is important with components such as Laboratory
		 * and Vitals for examples where the count of items is not displayed within the title text.
		 *
		 * @param component The {@see MPageComponent} in which to add the title text within.
		 * @param nbr The count of the list items displayed within the component
		 * @param optionalText Optional text to allow each consumer to place text within the header of the component.
		 */
		CreateTitleText: function(component, nbr, optionalText) {
			var ar = [];
			if (component.isLineNumberIncluded()) {
				ar.push("(", nbr, ")");
			}
			if (optionalText && optionalText !== "") {
				ar.push(" ", optionalText)
			}
			return ar.join("");
		},
		/**
		 * A helper utility to determine if a content body should be considered scrollable
		 * @param component [REQUIRED] The component in which is being evaluated
		 * @param nbr [REQUIRED] The number of items in which to consider scrolling enabled
		 */
		GetContentClass: function(component, nbr) {
			if (component.isScrollingEnabled()) {
				var scrollNbr = component.getScrollNumber();
				if (nbr > scrollNbr && scrollNbr > 0) {
					return "content-body scrollable";
				}
			}
			return "content-body";
		},
		/**
		 * CreateTimer will create a SLA timer and start the timer prior to returning.
		 * @param {String} timerName The timer name to start
		 * @param {String} subTimerName The subtimer name to start
		 * @param {String} metaData1
		 * @param {String} metaData2
		 * @param {String} metaData3
		 */
		CreateTimer: function(timerName, subTimerName, metaData1, metaData2, metaData3) {
			var rtmsTimer = new RTMSTimer(timerName, subTimerName).addMetaData("rtms.legacy.metadata.1", metaData1 || null).addMetaData("rtms.legacy.metadata.2", metaData2 || null).addMetaData("rtms.legacy.metadata.3", metaData3 || null);
			rtmsTimer.start();
			return rtmsTimer;
		},
		/**
		 * Retrieves the code values for a given code set
		 * @param codeSet [REQUIRED] The code set in which to retrieve
		 * @param async [REQUIRED] A <code>Boolean</code> value indicating to call async.  <code>TRUE</code> = yes, <code>FALSE</code> = no
		 * @return A list of code from the code set
		 */
		GetCodeSet: function(codeSet, async) {
			var codes = new Array();
			var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
			info.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "GetCodeSet");
					var jsonEval = JSON.parse(this.responseText);
					if (jsonEval.RECORD_DATA.STATUS_DATA.STATUS == "S") {
						codes = MP_Util.LoadCodeListJSON(jsonEval.RECORD_DATA.CODES);
					}
					return codes;
				}
				if (this.readyState == 4) {
					MP_Util.ReleaseRequestReference(this);
				}

			}
			//  Call the ccl progam and send the parameter string
			var sendVal = "^MINE^, " + codeSet + ".0";
			if (CERN_BrowserDevInd) {
				var url = "MP_GET_CODESET?parameters=" + sendVal;
				info.open('GET', url, async);
				info.send(null);
			}
			else {
				info.open('GET', "MP_GET_CODESET", async);
				info.send(sendVal);
			}

			return codes;
		},
		/**
		 * Will return a code object from the mapped list by the cdf_meaning
		 * @param mapCodes [REQUIRED] The map of code values to search
		 * @param meaning [REQUIRED] The cdf_meaning of the code value to search
		 * @return The code object associated to the cdf_meaning provides.  Else null
		 */
		GetCodeByMeaning: function(mapCodes, meaning) {
			for (var x = mapCodes.length; x--; ) {
				var code = mapCodes[x].value;
				if (code.meaning == meaning)
					return code;
			}
			return null;
		},
		GetCodeValueByMeaning: function(meaning, codeSet) {
			var codeValue = 0;
			var list = m_codeSets[codeSet];
			if (!list) {
				list = m_codeSets[codeSet] = MP_Util.GetCodeSet(codeSet, false);
			}
			if (list && list.length > 0) {
				for (var x = list.length; x--; ) {
					var code = list[x].value;
					if (code.meaning === meaning) {
						return code;
					}
				}
			}
			return null;
		},
		/**
		 * Will search for a value within the provided mapped array and return the value associated to the name/value pair
		 * @param mapItems [REQUIRED] The mapped array of items to search through
		 * @param item [REQUIRED] The item in which to search
		 * @return The value from the name/value pair
		 */
		GetItemFromMapArray: function(mapItems, item) {
			for (var x = 0; x < mapItems.length; x++) {
				if (mapItems[x].name == item)
					return mapItems[x].value;
			}
		},
		/**
		 * Add an item to the array of items associated to the map key
		 * @param mapItems [REQUIRED] The map array to search within
		 * @param key [REQUIRED] The primary key that will be searching for within the map array
		 * @param value [REQUIRED] The object that is to be added to the map array
		 */
		AddItemToMapArray: function(mapItems, key, value) {
			var ar = MP_Util.GetItemFromMapArray(mapItems, key);
			if (!ar) {
				ar = []
				mapItems.push(new MP_Core.MapObject(key, ar));
			}
			ar.push(value);
		},
		LookBackTime: function(component) {
			var i18nCore = i18n.discernabu;
			var remainder = 0;
			var lookbackDays = component.getLookbackDays();
			if (lookbackDays == 0) {
				return (i18nCore.SELECTED_VISIT);
			}
			else if (lookbackDays == 1) {
				return (i18nCore.LAST_N_HOURS.replace("{0}", lookbackDays * 24));
			}
			else {
				return (i18nCore.LAST_N_DAYS.replace("{0}", lookbackDays));
			}
		},
		CreateClinNoteLink: function(patient_id, encntr_id, event_id, display, docViewerType, pevent_id) {
			var docType = (docViewerType && docViewerType > "") ? docViewerType : 'STANDARD';
			var doclink = ""
			if (event_id > 0) {
				var ar = [];
				ar.push(patient_id, encntr_id, event_id, "\"" + docType + "\"", pevent_id);
				doclink = "<a onclick='javascript:MP_Util.LaunchClinNoteViewer(" + ar.join(",") + "); return false;' href='#'>" + display + "</a>"
			}
			else {
				doclink = display
			}
			return (doclink);
		},
		/**
		 * Retrieves a document for viewing via the MPages RTF viewer
		 * @param {Object} eventId The parent or child event id for retrieval
		 * @param {Object} docViewerType
		 * 0: Parent Event Id retrieval of child event blobs
		 * 1: Event Id blob retrieval
		 * 2: Long text retrieval
		 * 3: Micro Detail retrieval
		 * 4: Anatomic Pathology retrieval
		 */
		LaunchClinNoteViewer: function(patient_id, encntr_id, event_id, docViewerType, pevent_id) {
			var x = 0;
			var m_dPersonId = parseFloat(patient_id);
			var m_dEncntrId = parseFloat(encntr_id);
			var m_dPeventId = parseFloat(pevent_id);
			var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
			MP_Util.LogDiscernInfo(null, "PVVIEWERMPAGE", "mp_core.js", "LaunchClinNoteViewer");
			try {
				switch (docViewerType) {
					case 'AP':
						viewerObj.CreateAPViewer();
						viewerObj.AppendAPEvent(event_id, m_dPeventId);
						viewerObj.LaunchAPViewer();
						break;
					case 'DOC':
						viewerObj.CreateDocViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendDocEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendDocEvent(event_id);
						}
						viewerObj.LaunchDocViewer();
						break;
					case 'EVENT':
						viewerObj.CreateEventViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendEvent(event_id);
						}
						viewerObj.LaunchEventViewer();
						break;
					case 'MICRO':
						viewerObj.CreateMicroViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendMicroEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendMicroEvent(event_id);
						}
						viewerObj.LaunchMicroViewer();
						break;
					case 'GRP':
						viewerObj.CreateGroupViewer();
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendGroupEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendGroupEvent(event_id);
						}
						viewerObj.LaunchGroupViewer();
						break;
					case 'PROC':
						viewerObj.CreateProcViewer(m_dPersonId);
						if (MP_Util.IsArray(event_id)) {
							for (var x = event_id.length; x--; ) {
								viewerObj.AppendProcEvent(event_id[x]);
							}
						}
						else {
							viewerObj.AppendProcEvent(event_id);
						}
						viewerObj.LaunchProcViewer();
						break;
					case 'HLA':
						viewerObj.CreateAndLaunchHLAViewer(m_dPersonId, event_id);
						break;
					case 'NR':
						viewerObj.LaunchRemindersViewer(event_id);
						break;
					case 'STANDARD':
						alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS);
						break;
				}
			}
			catch (err) {
				MP_Util.LogJSError(err, null, "mp_core.js", "LaunchClinNoteViewer");
				alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS + "  " + i18n.discernabu.CONTACT_ADMINISTRATOR);
			}

		},
		IsArray: function(input) {
			return ( typeof (input) == 'object' && ( input instanceof Array));
		},
		IsString: function(input) {
			return ( typeof (input) == 'string');
		},
		HandleNoDataResponse: function(nameSpace) {
			var i18nCore = i18n.discernabu;
			return ("<h3 class='info-hd'><span class='res-normal'>" + i18nCore.NO_RESULTS_FOUND + "</span></h3><span class='res-none'>" + i18nCore.NO_RESULTS_FOUND + "</span>");
		},
		HandleErrorResponse: function(nameSpace, errorMessage) {
			var ar = [];
			var i18nCore = i18n.discernabu;
			//Create the HTML that will be returned to the component
			var ns = (nameSpace && nameSpace.length > 0) ? nameSpace + "-" : "";
			ar.push("<h3 class='info-hd'><span class='res-normal'>", i18nCore.ERROR_RETREIVING_DATA, "</span></h3>");
			ar.push("<dl class='", ns, "info error-message error-text'><dd><span>", i18nCore.ERROR_RETREIVING_DATA, "</span></dd></dl>");
			//log the error out to the JSLogger
			if (errorMessage && errorMessage.length) {
				MP_Util.LogError(i18n.COMPONENTS + ": " + nameSpace + "<br />" + errorMessage);
			}
			return ar.join("");
		},
		GetValueFromArray: function(name, array) {
			if (array != null) {
				for (var x = 0, xi = array.length; x < xi; x++) {
					if (array[x].name == name) {
						return (array[x].value);
					}
				}
			}
			return (null);
		},
		GetPrsnlObjByIdAndDate: function(name, date, personnelArray) {
			var prsnlObj;
			var latestPrsnlObj;
			try {
				if (personnelArray && personnelArray.length) {
					for (var x = 0, xi = personnelArray.length; x < xi; x++) {
						if (personnelArray[x].name == name) {
							prsnlObj = personnelArray[x].value;
							//If no personnel object found return the first/latest prsnl name
							if (!latestPrsnlObj) {
								latestPrsnlObj = prsnlObj;
							}
							if ( typeof date == "string") {
								//Convert to the correct date format for comparison
								if (/^\/Date\(/.exec(date)) {
									date = /[0-9]+-[0-9]+-[0-9]+/.exec(date) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(date) + "Z";
								}
								if ((date > prsnlObj.beg_dt_tm_string && date < prsnlObj.end_dt_tm_string) || date == prsnlObj.beg_dt_tm_string || date == prsnlObj.end_dt_tm_string) {
									return (prsnlObj);
								}
							}
							else {
								throw (new Error("Invalid date object passed into GetPrsnlObjByIdAndDate.  The date object must be a string."));
							}
						}
					}
					return (latestPrsnlObj);
				}
				return (null);
			}
			catch(err) {
				MP_Util.LogJSError(err, null, "mp_core.js", "GetPrsnlObjByIdAndDate");
				return (null);
			}
		},
		GetCompObjById: function(id) {
			var comps = CERN_MPageComponents;
			var cLen = comps.length;
			for (var i = cLen; i--; ) {
				var comp = comps[i];
				if (comp.m_componentId === id) {
					return comp;
				}
			}
			return (null);
		},
		GetCompObjByStyleId: function(id) {
			var cLen = CERN_MPageComponents.length;
			for (var i = cLen; i--; ) {
				var comp = CERN_MPageComponents[i];
				var styles = comp.getStyles();
				if (styles.getId() === id) {
					return comp;
				}
			}
			return (null);
		},
		LoadCodeListJSON: function(parentElement) {
			var codeArray = new Array();
			if (parentElement != null) {
				for (var x = 0; x < parentElement.length; x++) {
					var codeObject = new Object();
					codeElement = parentElement[x];
					codeObject.codeValue = codeElement.CODE;
					codeObject.display = codeElement.DISPLAY;
					codeObject.description = codeElement.DESCRIPTION;
					codeObject.codeSet = codeElement.CODE_SET;
					codeObject.sequence = codeElement.SEQUENCE;
					codeObject.meaning = codeElement.MEANING;
					var mapObj = new MP_Core.MapObject(codeObject.codeValue, codeObject);
					codeArray.push(mapObj);
				}
			}
			return (codeArray);
		},
		LoadPersonelListJSON: function(parentElement) {
			var personnelArray = [];
			var codeElement;
			if (parentElement != null) {
				for (var x = 0; x < parentElement.length; x++) {
					var prsnlObj = {};
					codeElement = parentElement[x];
					prsnlObj.id = codeElement.ID;
					//If available retrieve the beg and end date and time for a prsnl name
					if (codeElement.BEG_EFFECTIVE_DT_TM) {
						prsnlObj.beg_dt_tm = codeElement.BEG_EFFECTIVE_DT_TM;
						//create the string object for comparisons purposes
						prsnlObj.beg_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.BEG_EFFECTIVE_DT_TM) + "Z";
					}
					if (codeElement.END_EFFECTIVE_DT_TM) {
						prsnlObj.end_dt_tm = codeElement.END_EFFECTIVE_DT_TM;
						//create the string object for comparisons purposes
						prsnlObj.end_dt_tm_string = /[0-9]+-[0-9]+-[0-9]+/.exec(codeElement.END_EFFECTIVE_DT_TM) + "T" + /[0-9]+:[0-9]+:[0-9]+/.exec(codeElement.END_EFFECTIVE_DT_TM) + "Z";
					}
					prsnlObj.fullName = codeElement.PROVIDER_NAME.NAME_FULL;
					prsnlObj.firstName = codeElement.PROVIDER_NAME.NAME_FIRST;
					prsnlObj.middleName = codeElement.PROVIDER_NAME.NAME_MIDDLE;
					prsnlObj.lastName = codeElement.PROVIDER_NAME.NAME_LAST;
					prsnlObj.userName = codeElement.PROVIDER_NAME.USERNAME;
					prsnlObj.initials = codeElement.PROVIDER_NAME.INITIALS;
					prsnlObj.title = codeElement.PROVIDER_NAME.TITLE;
					var mapObj = new MP_Core.MapObject(prsnlObj.id, prsnlObj);
					personnelArray[x] = mapObj;
				}
			}
			return (personnelArray);
		},
		WriteToFile: function(sText) {
			try {
				var ForAppending = 8;
				var TriStateFalse = 0;
				var fso = new ActiveXObject("Scripting.FileSystemObject");
				var newFile = fso.OpenTextFile("c:\\temp\\test.txt", ForAppending, true, TriStateFalse);
				newFile.write(sText);
				newFile.close();
			}
			catch (err) {
				var strErr = 'Error:';
				strErr += '\nNumber:' + err.number;
				strErr += '\nDescription:' + err.description;
				document.write(strErr);
			}
		},
		CalculateAge: function(bdate) {
			var age;
			//typecasting string to date obj
			var bdate = new Date(bdate);
			var byear = bdate.getFullYear();
			var bmonth = bdate.getMonth();
			var bday = bdate.getDate();
			var bhours = bdate.getHours();
			today = new Date();
			year = today.getFullYear();
			month = today.getMonth();
			day = today.getDate();
			hours = today.getHours();

			if (year == byear && (day == bday)) {
				age = hours - bhours;
				age += " Hours";
				return age;
			}
			else if (year == byear && (month == bmonth)) {
				age = day - bday;
				age += " Days";
				return age;
			}
			if (year == byear) {
				age = month - bmonth;
				age += " Months";
				return age;
			}
			else {
				if (month < bmonth) {
					age = year - byear - 1;
				}
				else if (month > bmonth) {
					age = year - byear;
				}
				else if (month == bmonth) {
					if (day < bday) {
						age = year - byear - 1;
					}
					else if (day > bday) {
						age = year - byear;
					}
					else if (day == bday) {
						age = year - byear;
					}
				}
			}
			age += " Years"
			return age;
		},
		/**
		 *  Javascript string pad
		 *  @see http://www.webtoolkit.info/
		 **/
		pad: function(str, len, pad, dir) {
			if ( typeof (len) == "undefined") {
				var len = 0;
			}
			if ( typeof (pad) == "undefined") {
				var pad = ' ';
			}
			if ( typeof (dir) == "undefined") {
				var dir = STR_PAD_RIGHT;
			}

			if (len + 1 >= str.length) {

				switch (dir) {

					case STR_PAD_LEFT:
						str = Array(len + 1 - str.length).join(pad) + str;
						break;

					case STR_PAD_BOTH:
						var right = Math.ceil(( padlen = len - str.length) / 2);
						var left = padlen - right;
						str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
						break;

					default:
						str = str + Array(len + 1 - str.length).join(pad);
						break;

				} // switch
			}
			return str;
		},

		/**
		 * Launches graph in a modal window viewable in the Powerchart framework
		 * @param patientId The person ID for the patient selected
		 * @param encntrId The encounter ID of the visit selected
		 * @param eventCode Used to plot simple results for a given patient/encounter I.e. weight,height,BMI,BUN,WBC.
		 * @param staticContent location of the static content directory that contains the core JS / CSS files needed for the graph
		 * @param groupId If item is a grouped item pass the BR_DATAMART_FILTER_ID to pull all associated results I.e. BP,Temp,or HR.
		 * @param providerId Personnel ID of the user logged into the application
		 * @param positionCd Position <code>Code</code> of the user
		 * @param pprCD Person Personnel Relationship code value
		 * @param lookBackUnits
		 * @param lookBackType 1 = Hours, 2 = Days, 3 = Weeks, 4 = Months , 5 = Years
		 */
		GraphResults: function(eventCd, compID, groupID) {
			var component = MP_Util.GetCompObjById(compID);
			var lookBackUnits = (component.getLookbackUnits() != null && component.getLookbackUnits() > 0) ? component.getLookbackUnits() : "365";
			var lookBackType = (component.getLookbackUnitTypeFlag() != null && component.getLookbackUnitTypeFlag() > 0) ? component.getLookbackUnitTypeFlag() : "2";
			var i18nCore = i18n.discernabu;
			var subTitleText = "";
			var scope = component.getScope();
			var lookBackText = "";
			var criterion = component.getCriterion();
			component.setLookbackUnits(lookBackUnits);
			component.setLookbackUnitTypeFlag(lookBackType);

			if (scope > 0) {
				switch(lookBackType) {
					case 1:
						var replaceText = i18nCore.LAST_N_HOURS.replace("{0}", lookBackUnits);
						break;

					case 2:
						var replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
						break;

					case 3:
						var replaceText = i18nCore.LAST_N_WEEKS.replace("{0}", lookBackUnits);
						break;

					case 4:
						var replaceText = i18nCore.LAST_N_MONTHS.replace("{0}", lookBackUnits);
						break;

					case 5:
						var replaceText = i18nCore.LAST_N_YEARS.replace("{0}", lookBackUnits);
						break;

					default:
						var replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
						break;
				}

				switch(scope) {
					case 1:
						lookBackText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
						var encntrOption = "0.0";
						break;
					case 2:
						lookBackText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
						var encntrOption = criterion.encntr_id;
						break;
				}
			}

			var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
			var sParams = "^MINE^," + criterion.person_id + ".0," + encntrOption + "," + eventCd + ".0,^" + criterion.static_content + "\\discrete-graphing^," + groupID + ".0," + criterion.provider_id + ".0," + criterion.position_cd + ".0," + criterion.ppr_cd + ".0," + lookBackUnits + "," + lookBackType + ",200,^" + lookBackText + "^";
			var graphCall = "javascript:CCLLINK('mp_retrieve_graph_results', '" + sParams + "',1)";
			MP_Util.LogCclNewSessionWindowInfo(null, graphCall, "mp_core.js", "GraphResults");
			javascript: CCLNEWSESSIONWINDOW(graphCall, "_self", wParams, 0, 1);
			Util.preventDefault();
		},
		ReleaseRequestReference: function(reqObj) {
			if (!CERN_BrowserDevInd && XMLCCLREQUESTOBJECTPOINTER) {
				for (var id in XMLCCLREQUESTOBJECTPOINTER) {
					if (XMLCCLREQUESTOBJECTPOINTER[id] == reqObj) {
						delete (XMLCCLREQUESTOBJECTPOINTER[id])
					}
				}
			}
		},
		/**
		 * Message box similar to alert or confirm with customizable options.
		 * @param msg {string} String message or html to display in message box
		 * @param title {string} [OPTIONAL] Title of the message box
		 * @param btnTrueText {string} [OPTIONAL] Text value of the true option button, will default to 'OK' if omitted.
		 * @param btnFalseText {string} [OPTIONAL] Text value of the false option button.  No false button will be created if omitted.
		 * @param falseBtnFocus {boolean} [OPTIONAL] Sets the default focus to the false button.
		 * @param cb {object} [OPTIONAL] Callback function to fire on true button click.
		 */
		AlertConfirm: function(msg, title, btnTrueText, btnFalseText, falseBtnFocus, cb) {
			var btnTrue = "<button id='acTrueButton' data-val='1'>" + ((btnTrueText) ? btnTrueText : i18n.discernabu.CONFIRM_OK) + "</button>";
			var btnFalse = "";
			if (btnFalseText) {
				btnFalse = "<button id='acFalseButton' data-val='0'>" + btnFalseText + "</button>";
			}
			if (!title) {
				title = "&nbsp;";
			}

			var closeBox = function() {
				var btnVal = parseInt(this.getAttribute('data-val'), 10);
				$(".modal-div").remove();
				$(".modal-dialog").remove();
				$("html").css("overflow", "auto");
				//reset overflow
				if (btnVal && typeof cb === "function") {
					cb();
				}
			}
			var modalDiv = Util.cep("div", {
				"className": "modal-div"
			});
			var dialog = Util.cep("div", {
				"className": "modal-dialog"
			});

			dialog.innerHTML = "<div class='modal-dialog-hd'>" + title + "</div>" + "<div class='modal-dialog-content'>" + msg + "</div>" + "<div class='modal-dialog-ft'><div class='modal-dialog-btns'>" + btnTrue + btnFalse + "</div></div>";

			var docBody = document.body;
			Util.ac(modalDiv, docBody);
			Util.ac(dialog, docBody);

			Util.addEvent(_g('acTrueButton'), "click", closeBox);
			if (btnFalseText) {
				Util.addEvent(_g('acFalseButton'), "click", closeBox);
			}

			if (falseBtnFocus && btnFalseText) {
				_g('acFalseButton').focus();
			}
			else {
				_g('acTrueButton').focus();
			}

			$("html").css("overflow", "hidden");
			//disable page scrolling when modal is enabled
			$(modalDiv).height($(document).height());
		},
		/**
		 * Message box similar to alert or confirm with customizable options.
		 * @param msg {string} String message or html to display in message box
		 * @param title {string} [OPTIONAL] Title of the message box
		 * @param btnFalseText {string} [OPTIONAL] Text value of the false option button.  No false button will be created if omitted.
		 * @param falseBtnFocus {boolean} [OPTIONAL] Sets the default focus to the false button.
		 * @param cb {object} [OPTIONAL] Callback function to fire on closing message box.
		 */
		ActionableAlertConfirm: function(msg, title, btnFalseText, falseBtnFocus, cb) {
			var btnFalse = "";
			if (btnFalseText) {
				btnFalse = "<button id='acFalseButton' data-val='0'>" + btnFalseText + "</button>";
			}
			if (!title) {
				title = "&nbsp;";
			}

			var closeBox = function() {
				var btnVal = parseInt(this.getAttribute('data-val'), 10);
				$(".modal-div").remove();
				$(".modal-dialog-actionable").remove();
				$("html").css("overflow", "auto");
				//reset overflow
				if (cb && typeof cb === "function") {
					cb();
				}
			}
			var modalDiv = Util.cep("div", {
				"className": "modal-div"
			});
			var dialog = Util.cep("div", {
				"className": "modal-dialog-actionable"
			});

			dialog.innerHTML = "<div class='modal-dialog-hd'>" + title + "</div><div class='modal-dialog-content'>" + msg + "</div><div id='acActionableContent' class='modal-dialog-actionable-content'></div><div class='modal-dialog-ft'><div class='modal-dialog-btns'>" + btnFalse + "</div></div>";

			var docBody = document.body;
			Util.ac(modalDiv, docBody);
			Util.ac(dialog, docBody);

			if (btnFalseText) {
				Util.addEvent(_g('acFalseButton'), "click", closeBox);
			}

			if (falseBtnFocus && btnFalseText) {
				_g('acFalseButton').focus();
			}

			$("html").css("overflow", "hidden");
			//disable page scrolling when modal is enabled
			$(modalDiv).height($(document).height());
		},
		CreateAutoSuggestBoxHtml: function(component, elementId) {
			var searchBoxHTML = [];
			var txtBoxId = "";
			var compNs = component.getStyles().getNameSpace();
			var compId = component.getComponentId();
			if (elementId) {
				txtBoxId = compNs + elementId + compId;
			}
			else {
				txtBoxId = compNs + "ContentCtrl" + compId;
			}

			searchBoxHTML.push("<div class='search-box-div'><form name='contentForm' onSubmit='return false'><input type='text' id='", txtBoxId, "'", " class='search-box'></form></div>");
			return searchBoxHTML.join("");
		},
		AddAutoSuggestControl: function(component, queryHandler, selectionHandler, selectDisplayHandler, itemId) {
			new AutoSuggestControl(component, queryHandler, selectionHandler, selectDisplayHandler, itemId);
		},
		RetrieveAutoSuggestSearchBox: function(component) {
			var componentNamespace = component.getStyles().getNameSpace();
			var componentId = component.getComponentId();
			return _g(componentNamespace + "ContentCtrl" + componentId);
		},
		CreateParamArray: function(ar, type) {
			var returnVal = (type === 1) ? "0.0" : "0";
			if (ar && ar.length > 0) {
				if (ar.length > 1) {
					if (type === 1) {
						returnVal = "value(" + ar.join(".0,") + ".0)"
					}
					else {
						returnVal = "value(" + ar.join(",") + ")"
					}
				}
				else {
					returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
				}
			}
			return returnVal;
		},
		/**
		 * Will get the date formatter associate to the locale loaded by the driver
		 * @return The date formatter to utilize for the loaded locale
		 */
		GetDateFormatter: function() {
			if (!m_df) {
				m_df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			}
			return m_df;
		},
		/**
		 * Will get the numeric formatter associate to the locale loaded by the driver
		 * @return The numeric formatter to utilize for the loaded locale
		 */
		GetNumericFormatter: function() {
			if (!m_nf) {
				m_nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
			}
			return m_nf;
		},
		/**
		 * Replaces the current MPages view with the output of the reportName script
		 */
		PrintReport: function(reportName, person_id, encounter_id) {
			var paramString = "^MINE^,^" + reportName + "^," + person_id + "," + encounter_id;
			CCLLINK("pwx_rpt_driver_to_mpage", paramString, 1);
		},
		CalculatePrecision: function(valRes) {
			var precision = 0;
			var str = (MP_Util.IsString(valRes)) ? valRes : valRes.toString();
			var decLoc = str.search(/\.(\d)/);
			if (decLoc !== -1) {
				var strSize = str.length;
				precision = strSize - decLoc - 1;
			}
			return precision;
		},
		/**
		 * Will create a date/time in the format neccessary for passing as a prompt parameter
		 */
		CreateDateParameter: function(date) {
			var day = date.getDate();
			var month = ""
			var rest = date.format("yyyy HH:MM:ss");
			switch (date.getMonth()) {
				case (0):
					month = "JAN";
					break;
				case (1):
					month = "FEB";
					break;
				case (2):
					month = "MAR";
					break;
				case (3):
					month = "APR";
					break;
				case (4):
					month = "MAY";
					break;
				case (5):
					month = "JUN";
					break;
				case (6):
					month = "JUL";
					break;
				case (7):
					month = "AUG";
					break;
				case (8):
					month = "SEP";
					break;
				case (9):
					month = "OCT";
					break;
				case (10):
					month = "NOV";
					break;
				case (11):
					month = "DEC";
					break;
				default:
					alert("unknown month");
			}
			return (day + "-" + month + "-" + rest);
		},
		LogDebug: function(debugString) {
			if (debugString) {
				log.debug(debugString);
			}
		},
		LogWarn: function(warnString) {
			if (warnString) {
				log.warn(warnString);
			}
		},
		LogInfo: function(infoString) {
			if (infoString) {
				log.info(infoString);
			}
		},
		LogError: function(errorString) {
			if (errorString) {
				log.error(errorString);
			}
		},
		LogScriptCallInfo: function(component, request, file, funcName) {
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText].join(""));
		},
		LogScriptCallError: function(component, request, file, funcName) {
			log.error(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Script: ", request.url, "<br />Request: ", request.requestText, "<br />Reply: ", request.responseText, "<br />Status: ", request.status].join(""));
		},
		LogJSError: function(err, component, file, funcName) {
			log.error(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />JS Error", "<br />Message: ", err.message, "<br />Name: ", err.name, "<br />Number: ", (err.number & 0xFFFF), "<br />Description: ", err.description].join(""));
		},
		LogDiscernInfo: function(component, objectName, file, funcName) {
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Discern Object: ", objectName].join(""));
		},
		LogMpagesEventInfo: function(component, eventName, params, file, funcName) {
			log.debug(["Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />MPAGES_EVENT: ", eventName, "<br />Params: ", params].join(""));
		},
		LogCclNewSessionWindowInfo: function(component, params, file, funcName) {
			log.debug(["CCLNEWSESSIONWINDOW Creation", "Component: ", ( component ? component.getLabel() : ""), "<br />ID: ", ( component ? component.getComponentId() : ""), "<br />File: ", file, "<br />Function: ", funcName, "<br />Params: ", params].join(""));
		},
		LogTimerInfo: function(timerName, subTimerName, timerType, file, funcName) {
			log.debug(["Timer Name: ", timerName, "<br />Subtime Name:  ", subTimerName, "<br />Timer Type: ", timerType, "<br />File: ", file, "<br />Function: ", funcName].join(""));
		},
		AddCookieProperty: function(compId, propName, propValue) {
			var cookie = CK_DATA[compId];
			if (!cookie) {
				cookie = {};
			}
			cookie[propName] = propValue;
			CK_DATA[compId] = cookie;
		},
		GetCookieProperty: function(compId, propName) {
			var cookie = CK_DATA[compId];
			if (cookie && cookie[propName]) {
				return cookie[propName];
			}
			else {
				return null;
			}
		},
		WriteCookie: function() {
			var cookieJarJSON = JSON.stringify(CK_DATA);
			document.cookie = 'CookieJar=' + cookieJarJSON + ';';
		},
		RetrieveCookie: function() {
			var cookies = document.cookie;
			var match = cookies.match(/CookieJar=({[^;]+})(;|\b|$)/);
			if (match && match[1]) {
				CK_DATA = JSON.parse(match[1]);
			}
		},
		generateModalDialogBody: function(IDName,Type,Line1,Line2){
			var currModal = MP_ModalDialog.retrieveModalDialogObject(IDName);
			var modal;
			if(!currModal){
				modal = new ModalDialog(IDName);
			}
			else{
				modal = currModal;
			}
			var modalHTML;
			var typeToString = Type.toString().toLowerCase();
			modal.setLeftMarginPercentage(35).setRightMarginPercentage(35).setTopMarginPercentage(20).setIsBodySizeFixed(false).setIsBodySizeFixed(false).setIsFooterAlwaysShown(true);
			//Determine which HTML string to use based on the type
			switch(typeToString){
				case "error":
					modalHTML = "<div class='modal-error-container'><span class='error-text'>"+Line1+"</span> "+Line2+"</div>";			
					break;
				case "warning":
					modalHTML = "<div class='modal-warning-container'><span class='modal-text'>"+Line1+"</span> "+Line2+"</div>";
					break;
				/*
				 * KE020126: Commented out the information and default sections.  We don't have a current use for these
				 * but can easily be uncommented in the future.
				 
				case "information":
					modalHTML = "<div class='modal-information-container'><span class='modal-text'>"+Line1+"</span> "+Line2+"</div>";
					break;
				*/
				case "busy":
					modalHTML = "<div class='modal-busy-container'><span class='modal-text'>"+Line1+"</span> "+Line2+"</div>";
					break;
				/*
				default:
					modalHTML = "<div class='modal-default-container'><span class='modal-text'>"+Line1+"</span> "+Line2+"</div>";
					break;
				*/
			}
			
			if(modal.isActive()){
				modal.setBodyHTML(modalHTML);
			}
			else{
				modal.setBodyDataFunction(function(modalObj){
				 modalObj.setBodyHTML(modalHTML);
				});
			}
			return modal;
		},
		/**
		 * Creates a mapping between a string identifier and an object definition.  The object definition is only mapped
		 * when the objectDefinition parameter is an actual object and an existing object does not exist for that
		 * identifier.
		 * @param {string} mappingId : An id associated to the specific object definition that will be mapped.  This id is case
		 * insensitive.
		 * @param {function} objectDefinition : A reference to the definition of the object being mapped
		 * @return {boolean} True if the object mapping was added successfully, false otherwise.
		 */
		setObjectDefinitionMapping : function(mappingId, objectDefinition) {
			//Make sure the mappingID is a string
			if(typeof mappingId !== "string"){
				return false;
			}			
			mappingId = mappingId.toUpperCase();
			
			//Check to see if there is an existing mapping for that ID
			if( typeof CERN_ObjectDefinitionMapping[mappingId] !== "undefined") {
				MP_Util.LogInfo("Object mapping already exists for " + mappingId + "\nPlease select a different id or use the MP_Util.updateObjectDefinitionMApping function");
				return false;
			}
			//Make sure we are mapping an object definition which would be a function
			if( typeof objectDefinition === "function" ) {
				CERN_ObjectDefinitionMapping[mappingId] = objectDefinition;
				return true;
			}
			return false;
		},
		/**
		 * Retrieves the object mapped to a specific mappingId if it is defined in the CERN_ObjectDefinitionMapping object
		 * @param {string} mappingId : The id mapped to a specific object in the CERN_ObjectDefintionMapping object.   This id is case
		 * insensitive.
		 * @return {function} The object definition mapped to the mappingId passed into the function.
		 */
		getObjectDefinitionMapping : function(mappingId) {
			//Make sure the mappingID is a string
			if(typeof mappingId !== "string"){
				return null;
			}
			mappingId = mappingId.toUpperCase();
			//Attempt to retrieve the object definition
			if( typeof CERN_ObjectDefinitionMapping[mappingId] === "undefined") {
				return null;
			}
			return CERN_ObjectDefinitionMapping[mappingId];
		},
		/**
		 * Updates the object definition mapped to the identifier passed into the function.  If no object is mapped to the
		 * identifier then no updates are made to the CERN_ObjectDefinitionMapping object.
		 * @param {string} mappingId : An id associated to the specific object definition that will be mapped.  This id is case
		 * insensitive.
		 * @param {function} objectDefinition : A reference to the definition of the object being mapped
		 * @return {boolean} True if the object mapping was updated successfully, false otherwise.
		 */
		updateObjectDefinitionMapping : function(mappingId, objectDefinition) {
			//Make sure the mappingID is a string
			if(typeof mappingId !== "string"){
				return null;
			}
			mappingId = mappingId.toUpperCase();
			//Make sure an object definition already exists for this mappingId
			if( typeof CERN_ObjectDefinitionMapping[mappingId] === "undefined") {
				MP_Util.LogInfo("Object mapping does not exists for " + mappingId);
				return false;
			}
			//Make sure we are mapping an object definition which would be a function
			if( typeof objectDefinition === "function" ) {
				CERN_ObjectDefinitionMapping[mappingId] = objectDefinition;
				return true;
			}
			return false;
		},
		/**
		 * Removes the object definition mapped to the identifier passed into the function.
		 * @param {string} mappingId : An id associated to the specific object definition that will be removed.  This id is case
		 * insensitive.
		 * @return {boolean} True if the object mapping was removed successfully, false otherwise.
		 */
		removeObjectDefinitionMapping : function(mappingId) {
			//Make sure the mappingID is a string
			if(typeof mappingId !== "string"){
				return null;
			}
			mappingId = mappingId.toUpperCase();
			//Make sure the object definition exists before we attempt to delete it 
			if( typeof CERN_ObjectDefinitionMapping[mappingId] === "undefined") {
				MP_Util.LogInfo("Object mapping does not exists for " + mappingId);
				return false;
			}
			return delete CERN_ObjectDefinitionMapping[mappingId];
		}
	};
	/**
	 * Calculates difference between two dates given and returns string with appropriate units
	 * If no endDate is given it is assumed the endDate is the current date/time
	 *
	 * @param beginDate [REQUIRED] Begin <code>Date</code> for Calculation
	 * @param endDate [OPTIONAL] End <code>Date</code> for Calculation
	 * @param mathFlag [OPTIONAL] <code>Integer</code> Flag to determine if Math.Ceil or Math.Floor is used defaults to Math.floor 1 =
	 * Floor, 0 = Ceil
	 * @param abbreviateFlag [REQUIRED] <code>Boolean</code> to determine if shortened versions of Month,Year,Weeks,Days should be used
	 * such as in the case of a within string
	 */
	function GetDateDiffString(beginDate, endDate, mathFlag, abbreviateFlag) {
		var i18nCore = i18n.discernabu;
		var timeDiff = 0;
		var returnVal = "";
		//Set endDate to current time if it's not passed in
		endDate = (!endDate) ? new Date() : endDate;
		mathFlag = (!mathFlag) ? 0 : mathFlag;
		var one_minute = 1000 * 60;
		var one_hour = one_minute * 60;
		var one_day = one_hour * 24;
		var one_week = one_day * 7;

		var valMinutes = 0;
		var valHours = 0;
		var valDays = 0;
		var valWeeks = 0;
		var valMonths = 0;
		var valYears = 0;
		//time diff in milliseconds
		timeDiff = (endDate.getTime() - beginDate.getTime());

		//Choose if ceiling or floor should be applied
		var mathFunc = null;
		var comparisonFunc = null;
		if (mathFlag == 0) {
			mathFunc = function(val) {
				return Math.ceil(val);
			}
			comparisonFunc = function(lowerVal, upperVal) {
				return (lowerVal <= upperVal);
			}
		}
		else {
			mathFunc = function(val) {
				return Math.floor(val);
			}
			comparisonFunc = function(lowerVal, upperVal) {
				return (lowerVal < upperVal);
			}
		}

		var calcMonths = function() {
			var removeCurYr = 0;
			var removeCurMon = 0;
			var yearDiff = 0;
			var monthDiff = 0;
			var dayDiff = endDate.getDate();
			if (endDate.getMonth() > beginDate.getMonth()) {
				monthDiff = endDate.getMonth() - beginDate.getMonth();
				if (endDate.getDate() < beginDate.getDate()) {
					removeCurMon = 1;
				}
			}
			else if (endDate.getMonth() < beginDate.getMonth()) {
				monthDiff = 12 - beginDate.getMonth() + endDate.getMonth();
				removeCurYr = 1;
				if (endDate.getDate() < beginDate.getDate()) {
					removeCurMon = 1;
				}
			}
			else if (endDate.getDate() < beginDate.getDate()) {
				removeCurYr = 1;
				monthDiff = 11;
			}

			if (endDate.getDate() >= beginDate.getDate()) {
				dayDiff = endDate.getDate() - beginDate.getDate();
			}

			yearDiff = (endDate.getFullYear() - beginDate.getFullYear()) - removeCurYr;
			//days are divided by 32 to ensure the number will always be less than zero
			monthDiff += (yearDiff * 12) + (dayDiff / 32) - removeCurMon;

			return monthDiff;
		};

		valMinutes = mathFunc(timeDiff / one_minute);
		valHours = mathFunc(timeDiff / one_hour);
		valDays = mathFunc(timeDiff / one_day);
		valWeeks = mathFunc(timeDiff / one_week);
		valMonths = calcMonths();
		valMonths = mathFunc(valMonths);
		valYears = mathFunc(valMonths / 12);

		if (comparisonFunc(valHours, 2))//Less than 2 hours, display number of minutes. Use abbreviation of "mins".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_MINS.replace("{0}", valMinutes)) : (i18nCore.X_MINUTES.replace("{0}", valMinutes));
		else if (comparisonFunc(valDays, 2))//Less than 2 days, display number of hours. Use abbreviation of "hrs".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_HOURS.replace("{0}", valHours)) : (i18nCore.X_HOURS.replace("{0}", valHours));
		else if (comparisonFunc(valWeeks, 2))//Less than 2 weeks, display number of days. Use "days".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_DAYS.replace("{0}", valDays)) : (i18nCore.X_DAYS.replace("{0}", valDays));
		else if (comparisonFunc(valMonths, 2))//Less than 2 months, display number of weeks. Use abbreviation of "wks".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_WEEKS.replace("{0}", valWeeks)) : (i18nCore.X_WEEKS.replace("{0}", valWeeks));
		else if (comparisonFunc(valYears, 2))//Less than 2 years, display number of months. Use abbreviation of "mos".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_MONTHS.replace("{0}", valMonths)) : (i18nCore.X_MONTHS.replace("{0}", valMonths));
		else//Over 2 years, display number of years.  Use abbreviation of "yrs".
			returnVal = abbreviateFlag ? (i18nCore.WITHIN_YEARS.replace("{0}", valYears)) : (i18nCore.X_YEARS.replace("{0}", valYears));

		return (returnVal);
	}

}();

/**
* @namespace
*/

var CERN_Platform = {
	m_inMillenniumContext: null
};

CERN_Platform.inMillenniumContext = function() {
	if(this.m_inMillenniumContext === null) {
		this.m_inMillenniumContext = (window.external && (typeof window.external.DiscernObjectFactory !== "undefined")) ? true : false;
	}
	return this.m_inMillenniumContext;
};

/**
*Timer definition for Checkpoint timer and RTMS timer
*/

function CheckpointTimer() {
	this.m_checkpointObject = null;
	try {
		this.m_checkpointObject = window.external.DiscernObjectFactory('CHECKPOINT');
	}
	catch(exe) {
		MP_Util.logError("Unable to create checkpoint object via window.external.DiscernObjectFactory('CHECKPOINT')");
		return this;
	}
	return this;
}
CheckpointTimer.prototype.setClassName = function(className) {
	if(this.m_checkpointObject) {
		this.m_checkpointObject.ClassName = className;
	}
	return this;
};
CheckpointTimer.prototype.setProjectName = function(projectName) {
	if(this.m_checkpointObject) {
		this.m_checkpointObject.ProjectName = projectName;
	}
	return this;
};
CheckpointTimer.prototype.setEventName = function(eventName) {
	if(this.m_checkpointObject) {
		this.m_checkpointObject.EventName = eventName;
	}
	return this;
};
CheckpointTimer.prototype.setSubEventName = function(subEventName) {
	if(this.m_checkpointObject) { 
		this.m_checkpointObject.SubEventName = subEventName;
	}
	return this;
};
CheckpointTimer.prototype.publish = function() {
	if(this.m_checkpointObject) {
		this.m_checkpointObject.Publish();
	}
};
CheckpointTimer.prototype.addMetaData = function(key,value) {
	if(this.m_checkpointObject && key && value) {
		try {
			if(CERN_Platform.inMillenniumContext()) {
				this.m_checkpointObject.MetaData(key) = value;
			}
			else {
				this.m_checkpointObject.MetaData(key,value);
			}
		}
		catch(e) {
			MP_Util.logError("Error adding MetaData ["+key+"] = "+value+"; on CheckpointTimer");
			return this;
		}
	}
	return this;
};

function RTMSTimer(timerName,subTimerName) {
	this.m_checkpointTimer = new CheckpointTimer();
	this.m_checkpointTimer.setEventName(timerName);
	this.m_checkpointTimer.addMetaData("rtms.legacy.subtimerName",subTimerName);
	return this;
}
RTMSTimer.prototype.addMetaData = function(key,value) {
	this.m_checkpointTimer.addMetaData(key,value);
	return this;
};
RTMSTimer.prototype.start = function() {
	this.checkpoint("Start");
};
RTMSTimer.prototype.Start = function() {
	this.start();
};
RTMSTimer.prototype.stop = function() {
	this.checkpoint("Stop");
};
RTMSTimer.prototype.Stop = function() {
	this.stop();
};
RTMSTimer.prototype.fail = function() {
	this.checkpoint("Fail");
};
RTMSTimer.prototype.Abort = function() {
	this.fail();
};
RTMSTimer.prototype.checkpoint = function(subEventName) {
	this.m_checkpointTimer.setSubEventName(subEventName);
	this.m_checkpointTimer.publish();
};

/**
 * @namespace
 */
MP_Util.Doc = function() {
	var isExpandedAll = false;
	var openAccordion = '';

	return {		
		SetupExpandCollapse: function() {
			var i18nCore = i18n.discernabu;
			//set up expand collapse for all components
			var toggleArray = Util.Style.g("sec-hd-tgl");
			for (var k = 0; k < toggleArray.length; k++) {
				Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
				var checkClosed = Util.gp(Util.gp(toggleArray[k]));
				if (Util.Style.ccss(checkClosed, "closed")) {
					toggleArray[k].innerHTML = "+";
					toggleArray[k].title = i18nCore.SHOW_SECTION;
				}
			}
		},

		SetupCompFilters: function(compArray) {
			var comp = null;
			var compArrayLen = compArray.length;
			var hasFilters = false;
			for (var x = 0; x < compArrayLen; x++) {
				comp = compArray[x];
				hasFilters = false;
				for (var y = 0; y < 10; y++) {
					if (comp.getGrouperLabel(y) || comp.getGrouperCatLabel(y)) {
						hasFilters = true;
						break;
					}
				}
				comp.setCompFilters(hasFilters);
				if (comp.hasCompFilters() && comp.isDisplayable()) {
					comp.renderAccordion(comp);
				}
			}
		},
		
		/**
		 * Initialized the page based on a configuration of multiple MPage objects
		 * @param {Array} arMapObjects Array of the MPages to initialize the tab layout.
		 * @param {String} title The title to be associated to the page.
		 * @param {int} displayType How multiple MPages will be displayed.  Default is tab layout.
		 * @param {String} criterionGroup If InitSelectorLayout is called this is a parent group for multiple MPage Views.
		 */
		InitMPageTabLayout: function(arMapObjects, title, displayType, criterionGroup) {
			var arItems = [];
			var sc = "", helpFile = "", helpURL = "", debugInd = false;
			var bDisplayBanner = false;
			var criterion = null;
			var custInd = true;
			var anchorArray = null;

			for (var x = 0, xl = arMapObjects.length; x < xl; x++) {
				var key = arMapObjects[x].name;
				var page = arMapObjects[x].value;
				criterion = page.getCriterion();
				arItems.push(new MP_Core.TabItem(key, page.getName(), page.getComponents(), criterion.category_mean))
				sc = criterion.static_content;
				debugInd = criterion.debug_ind;
				helpFile = page.getHelpFileName();
				helpURL = page.getHelpFileURL();
				custInd = page.getCustomizeEnabled();
				anchorArray = page.getTitleAnchors();
				if (page.isBannerEnabled())
					bDisplayBanner = page.isBannerEnabled();
			}
			if (displayType === 1) {//Select Box
				MP_Util.Doc.InitSelectorLayout(arItems, title, sc, helpFile, helpURL, bDisplayBanner, 0, criterionGroup, custInd, anchorArray);
			}
			else {
				MP_Util.Doc.InitTabLayout(arItems, title, sc, helpFile, helpURL, bDisplayBanner, 0, criterion, custInd, anchorArray);
			}

		},
		/**
		 * Initialized the page based on a configuration of multiple TabItem objects
		 * @param {Array} arTabItems Array of the tab Objects to initialize the tab layout.
		 * @param {String} title The title to be associated to the page.
		 * @param {String} sc The static content file location.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 * @param {Boolean} debugInd A boolean indicator denoting if the MPage should be run in debug mode
		 */
		InitTabLayout: function(arTabItems, title, sc, helpFile, helpURL, includeBanner, debugInd, criterion, custInd, anchorArray) {
			var body = document.body;
			var i18nCore = i18n.discernabu;
			//create page title
			MP_Util.Doc.AddPageTitle(title, body, debugInd, custInd, anchorArray, helpFile, helpURL, criterion);

			//check if banner should be created
			if (includeBanner) {
				body.innerHTML += "<div id='banner' class='demo-banner'></div>";
			}
			body.innerHTML += "<div id='disclaimer' class='disclaimer'><span>" + i18nCore.DISCLAIMER + "</span></div>";

			//create unordered list for page level tabs
			//  a) need the id of the tabs to identify, b) the name of the tab, c) the components to add
			AddPageTabs(arTabItems, body);

			//create component placeholders for each tab
			CERN_TabManagers = [];
			for (var x = 0, xl = arTabItems.length; x < xl; x++) {
				var tabItem = arTabItems[x];
				var tabManager = new MP_Core.TabManager(tabItem);
				if (x == 0) {
					//the first tab will be selected upon initial loading of page.
					tabManager.setSelectedTab(true);
				}
				CERN_TabManagers.push(tabManager);
				CreateLiquidLayout(tabItem.components, _g(arTabItems[x].key), true);
				SetupCompFilters(tabItem.components);
				MP_Util.Doc.CreateCompMenus(tabItem.components, true);
			}
			MP_Util.Doc.AddCustomizeLink(criterion);
			SetupExpandCollapse();
		},
		/**
		 * Initialized the page based on a configuration of multiple MPage objects viewable through a select box
		 * @param {Array} arTabItems Array of the tab Objects to initialize the tab layout.
		 * @param {String} title The title to be associated to the page.
		 * @param {String} sc The static content file location.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 * @param {Boolean} debugInd A boolean indicator denoting if the MPage should be run in debug mode
		 * @param {Object} A different div to insert the tabbed page into
		 */
		InitSelectorLayout: function(arTabItems, title, sc, helpFile, helpURL, includeBanner, debugInd, criterion, custInd, anchorArray, buildDiv, MPageObj) {
			var body = {};
			if (buildDiv) {
				body = buildDiv;
			}
			else {
				body = document.body;
			}
			var i18nCore = i18n.discernabu;

			//first, check to see if they have a last saved view saved to User Prefs
			var jsonObject = MP_Core.AppUserPreferenceManager.GetQOCPreferences();
			var userPrefs, pagePrefs, views, lastSavedView;
			if (jsonObject) {
				userPrefs = jsonObject.user_prefs;
				pagePrefs = userPrefs.page_prefs;
				views = pagePrefs.views;

				var view = jsonObject.user_prefs.page_prefs.last_saved_view;

				if (view) {
					lastSavedView = view;
				}
				else {
					//if for some reason the view hasn't been defined for this page, set the last saved view to a blank string
					lastSavedView = "";
				}
				if (!views) {//if "views" does not exist, then the user still has the old user prefs, which gurantees a last saved view
					pagePrefs = userPrefs.page_prefs = {};
					views = pagePrefs.views = [];
					//since we know there is a last saved view, add it back to the JSON
					jsonObject.user_prefs.page_prefs.last_saved_view = lastSavedView;
					//add a new view object for the last saved view for use with Drag and Drop
					var newView = {};
					newView.label = lastSavedView;
					newView.components = [];
					views.push(newView);
					////overwrite old user prefs
					MP_Core.AppUserPreferenceManager.SaveQOCPreferences(jsonObject);
				}
			}
			else {
				lastSavedView = "";
			}

			//create page title if this is a single MPage
			if (!buildDiv) {
				MP_Util.Doc.AddPageTitle(title, body, debugInd, custInd, anchorArray, helpFile, helpURL, criterion, null);
			}
			else {//only MP_COMMON_ORDERS in a viewpoint is passing in a category_meaning and needs a title bar for the selector
				//MP_Util.Doc.AddPageTitle(title,body,debugInd,custInd,anchorArray,helpFile,helpURL,criterion,buildDiv.getAttribute("id"));
				var i18nCore = i18n.discernabu;
				var ar = [];
				var imgSource = criterion.static_content + "/images/3865_16.gif";
				title = "";
				buildDiv.innerHTML = "";
				ar.push("<div class='pg-hd'>");
				ar.push("<h1><span class='pg-title'>", title, "</span></h1><span id='pageCtrl", criterion.category_mean, "' class='page-ctrl'>");
				//'as of' date is always to the far left of items
				var df = MP_Util.GetDateFormatter();
				ar.push("<span class='other-anchors'>", i18nCore.AS_OF_TIME.replace("{0}", df.format(new Date(), mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)), "</span>");
				ar.push("</span></div>");
				buildDiv.innerHTML += ar.join("");
			}

			//check if banner should be created
			if (includeBanner) {
				body.innerHTML += "<div id='banner" + MPageObj.getCategoryMean() + "' class='demo-banner'>&nbsp;</div>";
			}
			else{
				//if the banner isn't included we need to add a placeholder that takes up space so the view layout will display
				body.innerHTML += "<div class='demo-banner'>&nbsp;</div>";
			}

			//create QOC selector
			LoadPageSelector(arTabItems, body, lastSavedView, criterion);

			var lastSavedTabKey = null;
			//create component placeholders for each tab
			CERN_TabManagers = [];
			for (var x = 0, xl = arTabItems.length; x < xl; x++) {
				var tabItem = arTabItems[x];
				var tabManager = new MP_Core.TabManager(tabItem);
				if (x == 0) {
					//the first tab will be selected upon initial loading of page.
					tabManager.setSelectedTab(true);
				}
				if (lastSavedView === tabItem.name) {
					lastSavedTabKey = tabItem.key;
				}
				CERN_TabManagers.push(tabManager);
				if (views) {
					var alreadyAddedView = false;
					var viewsLength = views.length;
					for (var j = viewsLength; j--; ) {
						var currentViewName = views[j].label;
						if (currentViewName === tabItem.name) {
							alreadyAddedView = true;
							if (views[j].components.length > 0) {
								var updatedQOCComponents = UpdateQOCComponentsWithUserPrefs(tabItem.components, views[j].components, criterion, MPageObj);
								//Must create dummy mpage in the case that MPageObj is null
								var dummyMpage = new CommonOrdersMPage();
								dummyMpage.renderComponents(updatedQOCComponents, $("#" + tabItem.key));
							}
							else {
								//Must create dummy mpage in the case that MPageObj is null
								var dummyMpage = new CommonOrdersMPage();
								dummyMpage.renderComponents(tabItem.components, $("#" + tabItem.key));
							}
							break;
						}
					}
					if (!alreadyAddedView) {
						//Must create dummy mpage in the case that MPageObj is null
						var dummyMpage = new CommonOrdersMPage();
						dummyMpage.renderComponents(tabItem.components, $("#" + tabItem.key));
					}
				}
				else {
					//Must create dummy mpage in the case that MPageObj is null
					var dummyMpage = new CommonOrdersMPage();
					dummyMpage.renderComponents(tabItem.components, $("#" + tabItem.key));
				}
				
				//Setup the categoryMean and the criterion info for future use
				dummyMpage.setCategoryMean(tabItem.key);
				dummyMpage.setCriterion(criterion);
				//Create the page menu for the specific CommonOrdersMPage
				dummyMpage.loadPageMenu();
				
				MP_Util.Doc.CreateQOCCompMenus(tabItem.components, false, tabItem.key);
			}
			SetupExpandCollapse();
			if (lastSavedTabKey) {
				MP_Util.Doc.InitQOCDragAndDrop(lastSavedTabKey);
			}
		},
		/**
		 * Initialize the mpage workflow view layout
		 * @param {object} navSubSecMPage object which holds the configuration for the components on the page.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 * @param {String} categoryMeaning The String name of the help file URL to associate to the page.
		 */
		InitWorkflowLayout: function(navSubSecMPage, helpFile, helpURL, categoryMeaning) {
			var i18nCore = i18n.discernabu;
			var criterion = navSubSecMPage.getCriterion();
			var mpComps = [];

			if (categoryMeaning) {
				var body = _g(categoryMeaning);
			}
			else {
				var body = document.body;
			}

			//GetComponentArray basically sorts the components into a 2-d array.  The first dimension is component groups and the second dimension is
			//columns within that group.  Since we are in a workflow view layout there is always one group and one column in that group.  That is why we
			//are using filteredComps[0][0] as our array of components in the view.
			var filteredComps = MP_Util.GetComponentArray(navSubSecMPage.getComponents());
			if (filteredComps[0] && filteredComps[0][0]) {
				mpComps = filteredComps[0][0];
			}

			var sHTML = [];
			sHTML.push("<div>");
			sHTML.push("<div class='col-group one-col'>");
			sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
			var colClassName = "col1";
			sHTML.push("<div class='", colClassName, "'>");

			for (var x = 0; x < mpComps.length; x++) {
				sHTML.push(CreateCompDiv(mpComps[x]));
			}
			sHTML.push("</div>");
			sHTML.push("</div></div></div></div>");
			body.innerHTML += sHTML.join("");

			SetupExpandCollapse();
			SetupCompFilters(mpComps);
			MP_Util.Doc.CreateCompMenus(mpComps, false);
		},
		/**
		 * Initialize the mpage layout
		 * @param {mPage}  mPage object which holds the configuration for the components on the page.
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} HelpURL The String name of the help file URL to associate to the page.
		 */
		InitLayout: function(mPage, helpFile, helpURL, categoryMeaning) {
			var i18nCore = i18n.discernabu;
			var criterion = mPage.getCriterion();
			if (categoryMeaning) {
				var body = _g(categoryMeaning);
			}
			else {
				var body = document.body;
			}

			//Ignore the page title since we are in a viewpoint
			if (!categoryMeaning) {
				MP_Util.Doc.AddPageTitle(mPage.getName(), body, criterion.debug_ind, mPage.getCustomizeEnabled(), mPage.getTitleAnchors(), helpFile, helpURL, criterion, categoryMeaning);
			}

			if (mPage.isBannerEnabled()) {
				body.innerHTML += "<div id='banner" + criterion.category_mean + "' class='demo-banner'></div>";
			}

			var mpComps = mPage.getComponents();
			CreateLiquidLayout(mpComps, body);
			MP_Util.Doc.AddCustomizeLink(criterion);
			SetupExpandCollapse();
			SetupCompFilters(mpComps);
			MP_Util.Doc.CreateCompMenus(mpComps, false);
			MP_Util.Doc.InitDragAndDrop(categoryMeaning);
			MP_Util.Doc.CreatePageMenu(categoryMeaning, criterion.category_mean);

		},

		InitDragAndDrop: function(categoryMeaning) {
			var parentElement = null;
			var self = this;
			var vpParent = "";
			if (categoryMeaning && typeof m_viewpointJSON == "string") {
				vpParent = "#" + categoryMeaning + " ";

			}
			$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable({
				connectWith: vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3 ",
				items: " .section",
				zIndex: 1005,
				appendTo: "body",
				handle: "h2",
				over: function(event, ui) {
					if ($(this).attr("class") !== ui.sender.attr("class")) {
						$(this).css("z-index", "1");
					}
				},
				start: function(event, ui) {
					$(this).css("z-index", "2");
					ui.item.css("z-index", "2");

					// get sortable containers, assuming connectWith is NOT optimized
					var containers = $(this).parent().children();

					var tallest = 0;
					// may not need height: auto
					$(containers).height('auto');
					$(containers).each(function() {
						if ($(this).height() > tallest) {
							tallest = $(this).height();
						}
					});

					$(containers).height(tallest + $(ui.item).height());

				},

				stop: function(event, ui) {
					ui.item.css("z-index", "1");
					$(this).css("z-index", "1");
					if (ui.sender) {
						ui.sender.css("z-index", "1");
					}
					CERN_EventListener.fireEvent(null, self, EventListener.EVENT_COMP_CUSTOMIZE, null);
					// get sortable containers, assuming connectWith is NOT optimized
					var containers = $(this).parent().children();
					// set height back to their natural height
					$(containers).height('auto');

				},
				update: function() {
					setTimeout(function() {
						MP_Core.AppUserPreferenceManager.SaveCompPreferences(null, "", null, true);
					}, 0);
				}
			});

			//Determine if the drag and drop should be active or not
			parentElement = (vpParent) ? $(vpParent) : $(document.body);
			if ($(parentElement).hasClass("dnd-enabled")) {
				$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable("enable");
				$(vpParent + " .col-outer1:last .sec-hd").css("cursor", "move");
			}
			else {
				$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3").sortable("disable");
				$(vpParent + " .col-outer1:last .sec-hd").css("cursor", "auto");
			}
		},
		InitQOCDragAndDrop: function(categoryMeaning) {
			var vpParent = "#" + categoryMeaning + " ";

			$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3," + vpParent + " .col-outer1:last .col4," + vpParent + " .col-outer1:last .col5").sortable({
				connectWith: vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3," + vpParent + " .col-outer1:last .col4," + vpParent + " .col-outer1:last .col5 ",
				items: " .section",
				zIndex: 1005,
				appendTo: "body",
				handle: "h2",
				over: function(event, ui) {
					if ($(this).attr("class") !== ui.sender.attr("class")) {
						$(this).css("z-index", "auto");
					}
				},
				start: function(event, ui) {
					$(this).css("z-index", "2");
					ui.item.css("z-index", "2");
				},
				stop: function(event, ui) {
					ui.item.css("z-index", "auto");
					$(this).css("z-index", "auto");
					if (ui.sender) {
						ui.sender.css("z-index", "auto");
					}
				},
				update: function() {
					setTimeout(function() {
						MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, categoryMeaning);
					}, 0);
				}
			});

			//Determine if the drag and drop should be active or not
			if ($(vpParent).hasClass("qoc-dnd-enabled")) {
				$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3," + vpParent + " .col-outer1:last .col4," + vpParent + " .col-outer1:last .col5").css("padding-bottom", "100px").sortable("enable");
				$(vpParent + " .col-outer1:last .sec-hd").css("cursor", "move");
			}
			else {
				$(vpParent + " .col-outer1:last .col1," + vpParent + " .col-outer1:last .col2," + vpParent + " .col-outer1:last .col3," + vpParent + " .col-outer1:last .col4," + vpParent + " .col-outer1:last .col5").css("padding-bottom", "100px").sortable("disable");
				$(vpParent + " .col-outer1:last .sec-hd").css("cursor", "auto");
			}
		},
		CreatePageMenu: function(categoryMeaning, critCatMean) {
			var pageMenuId = "pageMenu" + critCatMean;
			var setupPageMenu = function(menuId, initialColCnt) {
				if (_g(menuId)) {
					var optMenu = _g("moreOptMenu" + menuId);
					if (!optMenu) {
						optMenu = Util.cep("div", {
							className: "opts-menu-content menu-hide",
							id: "moreOptMenu" + menuId
						});

						var i18nCore = i18n.discernabu;
						optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + menuId + '"><div class="opts-menu-item opts-sub-menu" id="optsDefLayout' + menuId + '">' + i18nCore.VIEW_LAYOUT + '</div><div class="opts-menu-item" id="optsDefClearPrefs' + menuId + '">' + i18nCore.CLEAR_PREFERENCES + '</div></div>';
						Util.ac(optMenu, document.body);
					}
					InitPageOptMenu(optMenu, menuId, false);
					var layoutOut = function(e) {
						if (!e) {
							e = window.event;
						}
						var relTarg = e.relatedTarget || e.toElement;
						if (relTarg) {
							if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
								if (_g("optMenuConfig" + menuId)) {
									Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
								}
							}
						}
						else {
							if (_g("optMenuConfig" + menuId)) {
								Util.Style.acss(_g("optMenuConfig" + menuId), "menu-hide");
							}
							return;
						}
					};
					var secId = menuId.replace("mainCompMenu", "");

					$("#" + pageMenuId).click(function() {
						if (Util.Style.ccss(this, "page-menu-open")) {
							Util.Style.rcss(this, "page-menu-open")
						}
						else {
							Util.Style.acss(this, "page-menu-open")
						}

						OpenCompOptMenu(optMenu, menuId);
					});

					Util.addEvent(_g("optsDefLayout" + menuId), "mouseover", function() {
						launchSelectLayout(menuId, this, initialColCnt);
					});
					Util.addEvent(_g("optsDefLayout" + menuId), "mouseout", layoutOut);

					Util.addEvent(_g("optsDefClearPrefs" + menuId), "click", function() {
						var confirmMsg = i18nCore.CLEAR_ALL_PREFS + "<br />" + i18nCore.CLEAR_ALL_PREFS_CANCEL;
						MP_Util.AlertConfirm(confirmMsg, i18nCore.CLEAR_PREFERENCES, i18nCore.CONFIRM_CLEAR, i18nCore.CONFIRM_CANCEL, true, MP_Core.AppUserPreferenceManager.ClearPreferences);
					});
				}
			};
			var vpParent = ( typeof m_viewpointJSON == "string") ? "#" + categoryMeaning + " " : "";
			var initialColCnt;
			var curColGroupClass = $(vpParent + '.col-group:last').attr('class').replace("col-group ", "");
			switch (curColGroupClass) {
				case "three-col":
					initialColCnt = 3;
					break;
				case "two-col":
					initialColCnt = 2;
					break;
				case "one-col":
					initialColCnt = 1;
					break;
			}
			setupPageMenu(pageMenuId, initialColCnt);
		},
		GetFavFolders: function(folderId, critPersonId, critEncntrId, critProviderId, critPositionCd, critPprCd, venueType) {
			var record = null;
			var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
			info.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					MP_Util.LogScriptCallInfo(null, this, "mp_core.js", "GetNOEFavFolders");
					var jsonEval = JSON.parse(this.responseText);
					var recordData = jsonEval.RECORD_DATA;
					if (recordData.STATUS_DATA.STATUS == "Z") {
						record = recordData;
					}
					else if (recordData.STATUS_DATA.STATUS == "S") {
						record = recordData;
					}
					else {
						MP_Util.LogScriptCallError(null, this, "mp_core.js", "GetNOEFavFolders");
						var errAr = [];
						var statusData = recordData.STATUS_DATA;
						errAr.push("STATUS: " + statusData.STATUS);
						for (var x = 0, xl = statusData.SUBEVENTSTATUS.length; x < xl; x++) {
							var ss = statusData.SUBEVENTSTATUS[x];
							errAr.push(ss.OPERATIONNAME, ss.OPERATIONSTATUS, ss.TARGETOBJECTNAME, ss.TARGETOBJECTVALUE);
						}
						window.status = "Error getting user favorite folder structure: " + errAr.join(",");
					}
				}
				if (this.readyState == 4) {
					MP_Util.ReleaseRequestReference(this);
				}
			};

			var sendAr = ["^MINE^", critPersonId + ".0", critEncntrId + ".0", critProviderId + ".0", folderId + ".0", "^FAVORITES^", critPositionCd + ".0", critPprCd + ".0", "11", venueType];
			if (CERN_BrowserDevInd) {
				var url = "mp_get_powerorder_favs_json?parameters=" + sendAr.join(",");
				info.open('GET', url, false);
				info.send(null);
			}
			else {
				info.open('GET', "mp_get_powerorder_favs_json", false);
				info.send(sendAr.join(","));
			}
			return record;
		},
		RenderFavFolder: function(recordData, criterion) {
			if (recordData.STATUS_DATA.STATUS != "F") {
				var noeFavArr = recordData.USER_FAV;
				var venueTypeList = recordData.VENUE_TYPE_LIST;
			}
			var noei18n = i18n.discernabu.noe_o1;
			var pageId = "pageMenuAddFavorite1234";

			var mnuDisplay = "";
			//currently selected menu option display
			var mnuVenueType = 0;
			//currently selected menu option venue type
			var mnuNextDisplay = "";
			//next menu option display
			var mnuNextVenueType = 0;
			//next menu option venue type
			var x;
			var xl;
			var newVenue;
			var favSec = ["<div>"];
			if (venueTypeList) {
				for ( x = 0, xl = venueTypeList.length; x < xl; x++) {
					newVenue = venueTypeList[x];
					if (newVenue.SOURCE_COMPONENT_LIST[0].VALUE === 2) {
						//set next menu options
						mnuNextDisplay = newVenue.DISPLAY;
						mnuNextVenueType = 2;
					}
					else {
						//set currently selected menu option
						mnuDisplay = newVenue.DISPLAY;
						mnuVenueType = 1;
					}
				}
				var arr = [];
				arr.push("<div id='pgMnuFavFolderVenueBtns'><div><input class='page-menu-add-fav-venue' venue-val='1' type='radio' checked='checked' onclick='MP_Util.Doc.SwitchFavFolderVenue(this, \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")' /><span>", mnuDisplay, "</span></div><div><input class='page-menu-add-fav-venue' venue-val='2' type='radio' onclick='MP_Util.Doc.SwitchFavFolderVenue(this, \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")' /><span>", mnuNextDisplay, "</span></div></div>");
				favSec = favSec.concat(arr);
			}

			var noeItem;
			var noeRow;
			var noeType;
			var noeItemArr;
			var venueType = mnuVenueType;

			if (noeFavArr) {
				var favLength = noeFavArr.length;
				if (favLength === 0) {
					favSec.push("<span class='res-none'>", noei18n.NO_FAVORITES_FOUND, "</span>");
				}
				else {
					var favCnt = 0;
					var favChildFavFolder = [];
					var favSecondaryFavFolder = [];
					for ( i = 0; i < favLength; i++) {
						var noeFavsObj = noeFavArr[i];
						//account for multiple favorite folders per venue
						if (i === 0) {
							favSec.push("<div id='pgMnuFavFolderPath", pageId, "' class='noe-fav-path hdr'><dl id='pgMnuFolderPath", pageId, "' class='noe-folder-info'><dt>0</dt><dd class='noe-fav-folder'><span id='pgMnuFolderPathRoot", pageId, "'>", noeFavsObj.SHORT_DESCRIPTION, "</span></dd></dl></div>", "<div id='pgMnuFavFolderContents", pageId, "' class='page-menu-add-favorite-contents'>");

							//Create the rest of the folders/orders/caresets/PowerPlans
							noeItemArr = noeFavsObj.CHILD_LIST;
							for ( j = 0, k = noeItemArr.length; j < k; j++) {
								noeItem = noeItemArr[j];
								noeRow = [];
								noeType = noeItem.LIST_TYPE;
								if (noeType === 1) {//Favorite Folder
									favCnt++;
									noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", noeItem.SYNONYM, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", venueType, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
									favChildFavFolder = favChildFavFolder.concat(noeRow);
								}
							}
						}
						else {
							favCnt++;
							if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)) {
								folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}", i);
								favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", folderName, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", venueType, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
							else {
								favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", noeFavsObj.SHORT_DESCRIPTION, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", pageId, "\", \"", criterion.person_id, "\", \"", criterion.encntr_id, "\", \"", criterion.provider_id, "\", \"", criterion.position_cd, "\", \"", criterion.ppr_cd, "\", \"", venueType, "\", \"", criterion.executable, "\", \"", criterion.static_content, "\", \"", criterion.debug_ind, "\", \"", criterion.help_file_local_ind, "\", \"", criterion.category_mean, "\", \"", criterion.locale_id, "\", \"", criterion.device_location, "\")'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
							}
						}
					}
					if (!favCnt) {
						favSec.push("<span class='res-none'>", (noeFavArr) ? noei18n.NO_FAVORITES_FOUND : i18n.ERROR_RETREIVING_DATA, "</span>");
					}
					else {
						//add items in sorted order
						favSec = favSec.concat(favChildFavFolder, favSecondaryFavFolder);
					}
					favSec.push("</div>");
					//ends <div id='pgMnuFavFolderContents",pageId,"'>
				}
			}
			else if (!noeFavArr) {
				var i18nCore = i18n.discernabu;
				var errMsg = [];
				errMsg.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
				favSec = favSec.concat(errMsg);
			}
			favSec.push("</div>");
			var favSecHTML = favSec.join("");
			var actionableContDiv = _g("acActionableContent");
			if (actionableContDiv) {
				actionableContDiv.innerHTML = favSecHTML;
			}

			var folderPathId = 'pgMnuFolderPath' + pageId;
			var folderPath = _g(folderPathId);
			if (folderPath) {
				Util.addEvent(folderPath, "click", function(e) {
					var folder = e.target || e.srcElement;
					var folderId = Util.gps(Util.gp(folder));
					if (folderId.innerHTML != "-1") {
						var curVenueType = 1;
						//default to 1 just in case of an error with getting the buttons
						var inputButtons = Util.Style.g("page-menu-add-fav-venue", _g("pgMnuFavFolderVenueBtns"), "input");
						if (inputButtons) {
							for (var x = inputButtons.length; x--; ) {
								var curButton = inputButtons[x];
								if (curButton.checked) {
									curVenueType = curButton.getAttribute('venue-val');
									break;
								}
							}
						}
						MP_Util.Doc.DisplaySelectedFavFolder(folderId.innerHTML, pageId, criterion.person_id, criterion.encntr_id, criterion.provider_id, criterion.position_cd, criterion.ppr_cd, curVenueType, criterion.executable, criterion.static_content, criterion.debug_ind, criterion.help_file_local_ind, criterion.category_mean, criterion.locale_id, criterion.device_location);
					}
				});
			}
		},
		SwitchFavFolderVenue: function(button, pageId, personId, encntrId, providerId, positionCd, pprCd, executable, staticContent, debugInd, helpFileLocalInd, categoryMean, localeId, deviceLocation) {
			//toggle which buttons are checked
			var inputButtons = Util.Style.g("page-menu-add-fav-venue", Util.gp(Util.gp(button)), "input");
			if (inputButtons) {
				for (var x = inputButtons.length; x--; ) {
					var curButton = inputButtons[x];
					if (curButton.checked) {
						curButton.checked = "";
					}
					else {
						curButton.checked = "checked";
					}
				}
			}

			//delete al items in the folder path and folder id path as we are starting at the beginning when switching venues
			var i;
			var l;
			var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
			var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
			var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
			var curItemData = _gbt("DD", curList);
			var locatedIdIndex = 0;
			for ( i = curItem.length; i--; ) {
				if (i !== 0) {
					Util.de(curItem[i]);
				}
			}
			for ( i = curItemData.length; i--; ) {
				if (i !== 0) {
					Util.de(curItemData[i]);
				}
			}

			var venueType = button.getAttribute('venue-val');

			var recordData = MP_Util.Doc.GetFavFolders("0", personId, encntrId, providerId, positionCd, pprCd, venueType);
			MP_Util.Doc.LoadFavFolder(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd, helpFileLocalInd, categoryMean, localeId, deviceLocation);
		},
		DisplayNextFavFolder: function(folder, folderId, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd, helpFileLocalInd, categoryMean, localeId, deviceLocation) {
			var noei18n = i18n.discernabu.noe_o1;
			var curFolderData = _gbt("DD", Util.gp(folder));
			var curName = curFolderData[0];
			var curNameDisp = curName.innerHTML;

			//grab all folder names and ids in DOM of component
			var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
			var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
			var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
			var curItemData = _gbt("DD", curList);
			var lastId = curItem[curItem.length - 1];
			var lastFolder = curItemData[curItemData.length - 1];

			var pathLength = curItemData.length;
			var separator = "...";

			if (pathLength !== 1) {
				separator = ">";
			}

			if (pathLength > 4) {
				for (var j = pathLength - 1; j--; ) {
					if (j > 1) {
						if (curItem[j].innerHTML == "-1") {
							Util.Style.acss(curItemData[j], "hidden");
							Util.Style.rcss(curItemData[j], "noe-fav-separator");
						}
						else {
							Util.Style.acss(curItemData[j], "hidden");
							Util.Style.rcss(curItemData[j], "noe-fav-folder");
						}
					}
				}
			}

			//create four new nodes for the folder id, folder name, separator id, and separator
			var newFolderId = Util.cep("DT", {
				"className": "hidden",
				"innerHTML": folderId
			});
			var newFolder = Util.cep("DD", {
				"className": "noe-fav-folder",
				"innerHTML": "<span>" + curNameDisp + "</span>"
			});
			var newSeparatorId = Util.cep("DT", {
				"className": "hidden",
				"innerHTML": "-1"
			});
			var newSeparator = Util.cep("DD", {
				"className": "noe-fav-separator",
				"innerHTML": "<span>" + separator + "</span>"
			});
			//add four new nodes to DOM
			Util.ia(newSeparatorId, lastFolder);
			Util.ia(newSeparator, newSeparatorId);
			Util.ia(newFolderId, newSeparator);
			Util.ia(newFolder, newFolderId);

			var prevFolderContent = _g("pgMnuFavFolderContents" + pageId);
			if (prevFolderContent) {
				prevFolderContent.innerHTML = "";
				prevFolderContent.style.overflowY = "auto";
				Util.Style.acss(prevFolderContent, "noe-preloader-icon");
			}

			var recordData = MP_Util.Doc.GetFavFolders(folderId, personId, encntrId, providerId, positionCd, pprCd, venueType);
			MP_Util.Doc.LoadFavFolder(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd, helpFileLocalInd, categoryMean, localeId, deviceLocation);
		},
		LoadFavFolder: function(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd, helpFileLocalInd, categoryMean, localeId, deviceLocation) {
			var noei18n = i18n.discernabu.noe_o1;
			var noeFavArr = null;
			if (recordData.STATUS_DATA.STATUS != "F") {
				noeFavArr = recordData.USER_FAV;
			}

			var prevFolderContent = _g("pgMnuFavFolderContents" + pageId);
			if (prevFolderContent && noeFavArr) {
				Util.Style.rcss(prevFolderContent, "noe-preloader-icon");
				var favSec = ["<div>"];
				var favCnt = 0;
				var favChildFavFolder = [];
				var favSecondaryFavFolder = [];
				//grab all folder names and ids in DOM of component
				var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
				var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
				var curList = folderPath[0];
				var curItem = _gbt("DT", curList);
				for (var i = 0, l = noeFavArr.length; i < l; i++) {
					var noeFavsObj = noeFavArr[i];
					if (i === 0) {
						var noeItemArr = noeFavsObj.CHILD_LIST;

						for (var j = 0, k = noeItemArr.length; j < k; j++) {
							var noeItem = noeItemArr[j];
							var noeRow = [];
							var noeType = noeItem.LIST_TYPE;
							if (noeType === 1) {//Favorite Folder
								favCnt++;
								noeRow.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", noeItem.SYNONYM, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", executable, "\", \"", staticContent, "\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean, "\", \"", localeId, "\", \"", deviceLocation, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeItem.CHILD_ALT_SEL_CAT_ID, "\", \"", pageId, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", venueType, "\", \"", executable, "\", \"", staticContent, "\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean, "\", \"", localeId, "\", \"", deviceLocation, "\")'>", noeItem.SYNONYM, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'>", noeItem.SENTENCE, "</dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>", noeItem.SYN_ID, "|", venueType, "|", noeItem.SENT_ID, "</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeItem.ORDERABLE_TYPE_FLAG, "</dd></dl>");
								favChildFavFolder = favChildFavFolder.concat(noeRow);
							}
						}
					}
					else {
						favCnt++;
						if (noeFavsObj.LONG_DESCRIPTION_KEY_CAP === "FAVORITES" && (noeFavsObj.SOURCE_COMPONENT_FLAG === 2 || noeFavsObj.SOURCE_COMPONENT_FLAG === 3)) {
							folderName = noei18n.FOLDER_FAV_AMBULATORY.replace("{0}", i);
							favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", folderName, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", executable, "\", \"", staticContent, "\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean, "\", \"", localeId, "\", \"", deviceLocation, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", pageId, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", venueType, "\", \"", executable, "\", \"", staticContent, "\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean, "\", \"", localeId, "\", \"", deviceLocation, "\")'>", folderName, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
						}
						else {
							favSecondaryFavFolder.push("<h3 class='info-hd'>", noei18n.ORDER_FAVORITE, "</h3><dl class='noe-info page-menu-add-favorite-folder-dl'><button type='button' class='noe-fav-order-button' onmouseout='CERN_NEW_ORDER_ENTRY_O1.MouseOutButton(this)' onmouseover='CERN_NEW_ORDER_ENTRY_O1.MouseOverButton(this)' onclick='MP_Util.Doc.AddFavoriteComponent(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", noeFavsObj.SHORT_DESCRIPTION, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", executable, "\", \"", staticContent, "\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean, "\", \"", localeId, "\", \"", deviceLocation, "\")'>", i18n.SELECT, "</button><span class='noe-fav-folder-icon'>&nbsp;</span><dt>", noei18n.ORDER_NAME, ":</dt><dd class='noe-name page-menu-add-favorite-folder' onclick='MP_Util.Doc.DisplayNextFavFolder(this, \"", noeFavsObj.ALT_SEL_CATEGORY_ID, "\", \"", pageId, "\", \"", personId, "\", \"", encntrId, "\", \"", providerId, "\", \"", positionCd, "\", \"", pprCd, "\", \"", venueType, "\", \"", executable, "\", \"", staticContent, "\", \"", debugInd, "\", \"", helpFileLocalInd, "\", \"", categoryMean, "\", \"", localeId, "\", \"", deviceLocation, "\")'>", noeFavsObj.SHORT_DESCRIPTION, "</dd><dt>", noei18n.ORDER_DISPLAY_LINE, ":</dt><dd class='noe-disp'></dd><dt>", noei18n.ORDER_PARAMETERS, ":</dt><dd class='det-hd'>0|", venueType, "|0</dd><dt>", noei18n.ORDER_SET, ":</dt><dd class='det-hd'>", noeFavsObj.ORDERABLE_TYPE_FLAG, "</dd></dl>");
						}
					}
				}

				//add items in sorted order
				favSec = favSec.concat(favChildFavFolder, favSecondaryFavFolder);

				if (!favCnt) {
					favSec.push("<span class='res-none'>", noei18n.EMPTY_FOLDER, "</span>");
				}
				favSec.push("</div>");
				folderHTML = favSec.join("");
				prevFolderContent.innerHTML = folderHTML;
			}
			else if (prevFolderContent && !noeFavArr) {
				Util.Style.rcss(prevFolderContent, "noe-preloader-icon");
				var i18nCore = i18n.discernabu;
				var errMsg = [];
				errMsg.push("<span class='res-none'>", i18n.ERROR_RETREIVING_DATA, "</span>");
				folderHTML = errMsg.join("");
				prevFolderContent.innerHTML = folderHTML;
			}
		},
		DisplaySelectedFavFolder: function(folderId, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd, helpFileLocalInd, categoryMean, localeId, deviceLocation) {
			var noei18n = i18n.discernabu.noe_o1;
			var i, l;
			var folderPathObj = _g("pgMnuFavFolderPath" + pageId);
			var folderPath = Util.Style.g("noe-folder-info", folderPathObj, "DL");
			var curList = folderPath[0];
			var curItem = _gbt("DT", curList);
			var curItemData = _gbt("DD", curList);

			//find index of folder id
			var locatedIdIndex = null;
			for ( i = 0, l = curItem.length; i < l; i++) {
				if (curItem[i].innerHTML == folderId) {
					locatedIdIndex = i;
				}
			}

			//delete all folder names and ids that are after selected folder
			if (locatedIdIndex !== null) {
				for ( i = curItem.length; i--; ) {
					var deleteId = curItem[i];
					if (locatedIdIndex < i) {
						Util.de(deleteId);
					}
				}
				for ( i = curItemData.length; i--; ) {
					var deleteFolder = curItemData[i];
					if (locatedIdIndex < i) {
						Util.de(deleteFolder);
					}
				}
				if (locatedIdIndex > 3) {

					Util.Style.acss(curItemData[locatedIdIndex - 1], "noe-fav-separator");
					Util.Style.rcss(curItemData[locatedIdIndex - 1], "hidden");
					Util.Style.acss(curItemData[locatedIdIndex - 2], "noe-fav-folder");
					Util.Style.rcss(curItemData[locatedIdIndex - 2], "hidden");
				}

				var prevFolderContent = _g("pgMnuFavFolderContents" + pageId);
				if (prevFolderContent) {
					prevFolderContent.innerHTML = "";
					prevFolderContent.style.overflowY = "auto";
					Util.Style.acss(prevFolderContent, "noe-preloader-icon");
				}

				var recordData = MP_Util.Doc.GetFavFolders(folderId, personId, encntrId, providerId, positionCd, pprCd, venueType);
				MP_Util.Doc.LoadFavFolder(recordData, pageId, personId, encntrId, providerId, positionCd, pprCd, venueType, executable, staticContent, debugInd, helpFileLocalInd, categoryMean, localeId, deviceLocation);
			}
		},
		AddFavoriteComponent: function(button, folderId, folderName, personId, encntrId, providerId, positionCd, pprCd, executable, staticContent, debugInd, helpFileLocalInd, categoryMean, localeId, deviceLocation) {
			$(".modal-div").remove();
			$(".modal-dialog-actionable").remove();
			$("html").css("overflow", "auto");
			//reset overflow
			//Set the viewpoint indicator to true if this is a viewpoint, otherwise false
			var isViewpoint = ( typeof m_viewpointJSON == "undefined") ? false : true;
			var activeDiv = Util.Style.g("div-tab-item-selected", document.body, "DIV")[0];
			if (activeDiv) {
				//create criterion object to be used in component
				var criterion = {};
				criterion.person_id = personId;
				criterion.encntr_id = encntrId;
				criterion.provider_id = providerId;
				criterion.executable = executable;
				criterion.static_content = staticContent;
				criterion.position_cd = positionCd;
				criterion.ppr_cd = pprCd;
				criterion.debug_ind = debugInd;
				criterion.help_file_local_ind = helpFileLocalInd;
				criterion.category_mean = categoryMean;
				criterion.locale_id = localeId;
				criterion.device_location = deviceLocation;

				//create new order selection component
				var appendingComponentId = "-" + activeDiv.id;
				var componentId = folderId.concat(appendingComponentId);
				var component = new OrderSelectionComponent();
				component.setCriterion(criterion);
				component.setStyles(new OrderSelectionComponentStyle());
				component.setComponentId(componentId);
				component.setReportId(folderId);
				component.setFavFolderId(folderId);
				component.setCustomizeView(false);
				component.setExpanded(1);
				component.setColumn(1);
				component.setSequence(0);
				component.setPageGroupSequence(1);
				component.setLabel(folderName);
				if (isViewpoint) {
					component.setModalScratchPadEnabled(1);
				}

				var style = component.getStyles();
				style.setComponentId(componentId);

				var newCompNode = createDynCompDiv(component);

				//render component
				component.InsertData();
				//grab first column of components
				var columnOneNode = Util.Style.g("col1", activeDiv, "DIV")[0];
				//grab first component in column one
				var columnOneFirstComp = Util.Style.g("section", columnOneNode, "DIV")[0];
				//insert new order selection component in the first row on column one
				columnOneNode.insertBefore(newCompNode, columnOneFirstComp);

				//Update the cursor class of the newly created component based on the drag and drop toggle status
				if (!($(".div-tab-item-selected").hasClass("qoc-dnd-enabled"))) {
					//remove the cursor move class
					$("#" + style.getId() + " ." + style.getHeaderClass()).css("cursor", "auto");
				}

				//update CERN_MPageComponents so we can find component Id when saving preferences
				CERN_MPageComponents.push(component);

				//save user preferences immediately after adding component
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, activeDiv.id);

				//add expand/collapse functionality
				var componentToggle = Util.Style.g(style.getHeaderToggle(), newCompNode, "span")[0];
				Util.addEvent(componentToggle, "click", MP_Util.Doc.ExpandCollapse);

				//add component menu functionality
				var fullId = "mainCompMenu" + style.getNameSpace() + componentId;
				var optMenu = Util.cep("div", {
					className: "opts-menu-content menu-hide",
					id: "moreOptMenu" + componentId
				});
				var i18nCore = i18n.discernabu;
				var optMenuArr = ['<div class="opts-actions-sec" id="optsMenuActions', componentId, '"></div>', '<div class="opts-personalize-sec" id="optsMenupersonalize', componentId, '"><div class="opts-menu-item" id="optsDefTheme', componentId, '">', i18nCore.COLOR_THEME, '</div><div class="opts-menu-item" id="optsDefState', componentId, '">', i18nCore.DEFAULT_EXPANDED, '<span class="opts-menu-def-exp">&nbsp;</span></div><div class="opts-menu-item" id="optsRemoveFavComp', componentId, '">', i18nCore.REMOVE_FAVORITE, '</div></div>'];
				optMenu.innerHTML = optMenuArr.join("");
				Util.ac(optMenu, document.body);
				InitCompOptMenu(optMenu, componentId, false);

				var themeOut = function(e) {
					if (!e) {
						e = window.event;
					}
					var relTarg = e.relatedTarget || e.toElement;
					if (relTarg) {
						if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
							if (_g("optMenuConfig" + componentId)) {
								Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
							}
						}
					}
					else {
						if (_g("optMenuConfig" + componentId)) {
							Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
						}
						return;
					}
				};

				var secId = fullId.replace("mainCompMenu", "");
				Util.addEvent(_g("mainCompMenu" + secId), "click", function() {
					OpenCompOptMenu(optMenu, secId);
				});
				Util.addEvent(_g("optsDefTheme" + componentId), "mouseover", function() {
					launchQOCThemeMenu(componentId, fullId, secId, this, activeDiv.id);
				});
				Util.addEvent(_g("optsDefTheme" + componentId), "mouseout", themeOut);

				Util.addEvent(_g("optsDefState" + componentId), "click", function() {
					launchQOCSetState(componentId, this, activeDiv.id);
				});
				Util.addEvent(_g("optsRemoveFavComp" + componentId), "click", function() {
					var thisId = style.getId();
					var confirmMsg = i18nCore.REMOVE_FAV_DIALOG + "<br />";
					MP_Util.AlertConfirm(confirmMsg, i18nCore.REMOVE_PERSONAL_FAV_COMP, i18nCore.CONFIRM_REMOVE, i18nCore.CONFIRM_CANCEL, true, function() {
						MP_Core.AppUserPreferenceManager.RemoveFolder(thisId, activeDiv.id)
					});
				});
			}

			function createDynCompDiv(component) {
				var i18nCore = i18n.discernabu;
				var i18nConfigMPage = i18n.discernabu.covc_o1;
				var ar = [];
				var style = component.getStyles();
				var ns = style.getNameSpace();
				var compId = component.getComponentId();
				var secClass = style.getClassName();
				var tabLink = component.getLink();
				var loc = component.getCriterion().static_content;
				var sAnchor = component.getLabel();

				var compNode = Util.cep("div", {
					className: style.getClassName(),
					id: style.getId()
				});

				ar.push("<h2 class='", style.getHeaderClass(), "' style='cursor: move;'><span class='", style.getHeaderToggle(), "' title='", i18nCore.HIDE_SECTION, "'>-</span><span class='opts-menu menu-hide' id='mainCompMenu", ns, compId, "'>&nbsp;</span><span class='", style.getTitle(), "'><span>", sAnchor, "</span><span class='sec-total'></span></span></h2><div id='", style.getContentId(), "' class='", style.getContentClass(), "'></div>");
				var footerText = component.getFooterText();
				if (footerText && footerText !== "") {
					ar.push("<div class=sec-footer>", footerText, "</div>");
				}
				var arHtml = ar.join("");
				compNode.innerHTML = arHtml;
				return compNode;
			}

		},
		/**
		 * Create Component Menus
		 * @param {mpComps} mpage components for current view
		 * @param {bool} disablePrsnl boolean to disable personalize section
		 * @param
		 */
		CreateCompMenus: function(mpComps, disablePrsnl) {
			var setupCompMenu = function(componentId, fullId, isExp, infoInd, infoState) {
				if (_g(fullId)) {
					var optMenu = _g("moreOptMenu" + componentId);
					if (!optMenu) {
						optMenu = Util.cep("div", {
							className: "opts-menu-content menu-hide",
							id: "moreOptMenu" + componentId
						});
						var i18nCore = i18n.discernabu;
						var defExpClass = "";
						var infoBtnMsg = i18nCore.INFO_BUTTON;
						var infoClass = "";
						
						if (isExp) {
							defExpClass = "opts-menu-def-exp";
						}
						
						if (infoState) {
							infoClass = "opts-menu-info-en";
						}
						

						optMenu.innerHTML = '<div class="opts-actions-sec" id="optsMenuActions' + componentId + '"></div>';
						if (!disablePrsnl) {
							if (infoInd) {
								optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + componentId + '"><div class="opts-menu-item" id="optsDefTheme' + componentId + '">' + i18nCore.COLOR_THEME + '</div><div class="opts-menu-item" id="optsDefState' + componentId + '">' + i18nCore.DEFAULT_EXPANDED + '<span class="' + defExpClass + '">&nbsp;</span></div><div class="opts-menu-item opts-personalize-sec-divider" id="optsInfoState' + componentId + '">' + infoBtnMsg + '<span class="' + infoClass + '">&nbsp;</span></div></div>';
							}
							else {
								optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + componentId + '"><div class="opts-menu-item" id="optsDefTheme' + componentId + '">' + i18nCore.COLOR_THEME + '</div><div class="opts-menu-item" id="optsDefState' + componentId + '">' + i18nCore.DEFAULT_EXPANDED + '<span class="' + defExpClass + '">&nbsp;</span></div></div>';
							}
						}
						Util.ac(optMenu, document.body);
					}
					InitCompOptMenu(optMenu, componentId, false);

					var themeOut = function(e) {
						if (!e) {
							e = window.event;
						}
						var relTarg = e.relatedTarget || e.toElement;
						if (relTarg) {
							if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
								if (_g("optMenuConfig" + componentId)) {
									Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
								}
							}
						}
						else {
							if (_g("optMenuConfig" + componentId)) {
								Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
							}
							return;
						}
					};
					var secId = fullId.replace("mainCompMenu", "");
					Util.addEvent(_g("mainCompMenu" + secId), "click", function() {
						OpenCompOptMenu(optMenu, secId);
					});

					if (!disablePrsnl) {
						Util.addEvent(_g("optsDefTheme" + componentId), "mouseover", function() {
							launchThemeMenu(componentId, fullId, secId, this);
						});
						Util.addEvent(_g("optsDefTheme" + componentId), "mouseout", themeOut);
						Util.addEvent(_g("optsDefState" + componentId), "click", function() {
							launchSetState(componentId, this);
						});
						
						if (infoInd) {
							Util.addEvent(_g("optsInfoState" + componentId), "click", function() {
								launchInfoSetState(componentId, this);
							});
						}
					}
				}
			};
			var mns = mpComps;
			var mLen = mns.length
			for (var i = 0; i < mLen; i++) {
				var curComp = mns[i];
				var ns = curComp.m_styles.m_nameSpace;
				var compId = curComp.m_styles.m_componentId;
				var fullId = "mainCompMenu" + ns + compId;
				var isExp = curComp.isExpanded();
				var infoInd = curComp.hasInfoButton();
				var infoState = curComp.isInfoButtonEnabled();
				setupCompMenu(compId, fullId, isExp, infoInd, infoState);
			}
		},
		/**
		 * Create Quick Orders and Charges Component Menus
		 * @param {mpComps} mpage components for current view
		 * @param {bool} disablePrsnl boolean to disable personalize section
		 * @param {string} selectedViewId Id of view selected in QOC
		 * @param
		 */
		CreateQOCCompMenus: function(mpComps, disablePrsnl, selectedViewId) {
			var setupCompMenu = function(componentId, fullId, isExp) {
				if (_g(fullId)) {
					var optMenu = _g("moreOptMenu" + componentId);
					if (!optMenu) {
						optMenu = Util.cep("div", {
							className: "opts-menu-content menu-hide",
							id: "moreOptMenu" + componentId
						});
						var i18nCore = i18n.discernabu;
						var defExpClass = "";
						var isPersonalFav = false;
						var component = MP_Util.GetCompObjById(componentId);
						var style = component.getStyles();
						var thisId = style.getId();
						if (isExp) {
							defExpClass = "opts-menu-def-exp";
						}

						optMenu.innerHTML = '<div class="opts-actions-sec" id="optsMenuActions' + componentId + '"></div>';
						if (!disablePrsnl) {
							if (CERN_PersonalFav !== null && CERN_PersonalFav[prsnlCount] === thisId) {
								prsnlCount++;
								isPersonalFav = true;
								optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + componentId + '"><div class="opts-menu-item" id="optsDefTheme' + componentId + '">' + i18nCore.COLOR_THEME + '</div><div class="opts-menu-item" id="optsDefState' + componentId + '">' + i18nCore.DEFAULT_EXPANDED + '<span class="' + defExpClass + '">&nbsp;</span></div><div class="opts-menu-item" id="optsRemoveFavComp' + componentId + '">' + i18nCore.REMOVE_FAVORITE + '</div></div>';
							}
							else {
								isPersonalFav = false;
								optMenu.innerHTML += '<div class="opts-personalize-sec" id="optsMenupersonalize' + componentId + '"><div class="opts-menu-item" id="optsDefTheme' + componentId + '">' + i18nCore.COLOR_THEME + '</div><div class="opts-menu-item" id="optsDefState' + componentId + '">' + i18nCore.DEFAULT_EXPANDED + '<span class="' + defExpClass + '">&nbsp;</span></div></div>';
							}
						}
						Util.ac(optMenu, document.body);
					}
					InitCompOptMenu(optMenu, componentId, false);

					var themeOut = function(e) {
						if (!e) {
							e = window.event;
						}
						var relTarg = e.relatedTarget || e.toElement;
						if (relTarg) {
							if (!Util.Style.ccss(relTarg, "opts-menu-content")) {
								if (_g("optMenuConfig" + componentId)) {
									Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
								}
							}
						}
						else {
							if (_g("optMenuConfig" + componentId)) {
								Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
							}
							return;
						}
					};
					var secId = fullId.replace("mainCompMenu", "");
					Util.addEvent(_g("mainCompMenu" + secId), "click", function() {
						OpenCompOptMenu(optMenu, secId);
					});

					if (!disablePrsnl) {
						Util.addEvent(_g("optsDefTheme" + componentId), "mouseover", function() {
							launchQOCThemeMenu(componentId, fullId, secId, this, selectedViewId);
						});
						Util.addEvent(_g("optsDefTheme" + componentId), "mouseout", themeOut);
						Util.addEvent(_g("optsDefState" + componentId), "click", function() {
							launchQOCSetState(componentId, this, selectedViewId);
						});
						if (isPersonalFav) {
							Util.addEvent(_g("optsRemoveFavComp" + componentId), "click", function() {
								var activeDiv = $(".div-tab-item-selected", document.body, "DIV")[0];
								var confirmMsg = i18nCore.REMOVE_FAV_DIALOG + "<br />";
								MP_Util.AlertConfirm(confirmMsg, i18nCore.REMOVE_PERSONAL_FAV_COMP, i18nCore.CONFIRM_REMOVE, i18nCore.CONFIRM_CANCEL, true, function() {
									MP_Core.AppUserPreferenceManager.RemoveFolder(thisId, activeDiv.id)
								});
							});
						}
					}
				}
			};
			var mns = mpComps;
			var mLen = mns.length
			var prsnlCount = 0;
			for (var i = 0; i < mLen; i++) {
				var curComp = mns[i];
				var ns = curComp.m_styles.m_nameSpace;
				var compId = curComp.m_styles.m_componentId;
				var fullId = "mainCompMenu" + ns + compId;
				var isExp = curComp.isExpanded();
				setupCompMenu(compId, fullId, isExp);
			}
		},
		/**
		 * Hide all Component Menus
		 */
		HideAllCompMenus: function() {
			var mnus = Util.Style.g("opts-menu-content", null, "div");
			var mnLen = mnus.length;
			for (var m = mnLen; m--; ) {
				if (!Util.Style.ccss(mnus[m], "menu-hide")) {
					Util.Style.acss(mnus[m], "menu-hide");
				}
			}
		},
		/**
		 * Hide all Page Menus
		 */
		ResetPageMenus: function() {
			var pageMenuIcons = Util.Style.g('page-menu');
			var pl = pageMenuIcons.length;
			for (var i = pl; i--; ) {
				var pageMenu = pageMenuIcons[i];
				if (Util.Style.ccss(pageMenu, "page-menu-open")) {
					Util.Style.rcss(pageMenu, "page-menu-open")
				}
			}
		},
		/**
		 * Customize the mpage layout
		 * @param {String} title The title of the page to display
		 * @param {Object} components The list components to be associated.
		 */
		CustomizeLayout: function(title, components, criterion) {
			var body = document.body;
			var i18nCore = i18n.discernabu;
			MP_Util.Doc.AddPageTitle(title, body, 0, false, null, null, null, criterion);
			MP_Util.Doc.AddClearPreferences(body, criterion)
			MP_Util.Doc.AddSavePreferences(body, criterion)

			body.innerHTML += "<div id='disclaimer' class='disclaimer'><span>" + i18nCore.USER_CUST_DISCLAIMER + "</span></div>";

			var compAr = [];
			for (var x = components.length; x--; ) {
				var component = components[x];
				if (component.getColumn() != 99)
					compAr.push(component);
			}

			CreateCustomizeLiquidLayout(compAr, body)
			SetupExpandCollapse();
			SetupCompFilters(compAr);
		},
		GetComments: function(par, personnelArray) {
			var com = "", recDate = "";
			var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
			for (var j = 0, m = par.COMMENTS.length; j < m; j++) {
				if (personnelArray.length != null) {
					if (par.COMMENTS[j].RECORDED_DT_TM != "") {
						recDate = df.formatISO8601(par.COMMENTS[j].RECORDED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)
					}
					if (j > 0) {
						com += "<br />";
					}
					if (par.COMMENTS[j].RECORDED_BY > 0) {
						com += recDate + " - " + MP_Util.GetValueFromArray(par.COMMENTS[j].RECORDED_BY, personnelArray).fullName + "<br />" + par.COMMENTS[j].COMMENT_TEXT;
					}
					else {
						com += recDate + "<br />" + par.COMMENTS[j].COMMENT_TEXT;
					}
				}
			}
			return com;
		},
		FinalizeComponent: function(contentHTML, component, countText) {
			var styles = component.getStyles();

			//replace count text
			var rootComponentNode = component.getRootComponentNode();
			//There are certain circumstances where a components DOM element will have been removed.
			//ie. selecting a view from the viewpoint drop down and then selecting another.
			if (rootComponentNode) {
				var totalCount = Util.Style.g("sec-total", rootComponentNode, "span");
				if(countText){
					//Make sure the count text is not hidden.
					$(totalCount).removeClass("hidden");
					totalCount[0].innerHTML = countText;
				}
				else{
					//If there is no count text to show then hide the element so it doesn't take up space.
					$(totalCount).addClass("hidden");
				}

				//replace content with HTML
				var node = component.getSectionContentNode();
				node.innerHTML = contentHTML;

				//init hovers
				MP_Util.Doc.InitHovers(styles.getInfo(), node, component);

				//init subsection toggles
				MP_Util.Doc.InitSubToggles(node, "sub-sec-hd-tgl");

				//init scrolling
				MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), component.getScrollNumber(), "1.6")

				//Check to see if the component has an error message displayed
				var errorElement = $(rootComponentNode).find(".error-message");
				if (errorElement.length) {
					//Add an error icon to the component title
					$(rootComponentNode).find(".sec-title span:first-child").addClass("error-icon-component");
					//Ensure the bottom border on the error message is red and the padding is consistent
					$(errorElement).css("border", "1px solid #C00").css("padding", "2px 4px");
					//Fire and event to inform any listener that the component has errored
					CERN_EventListener.fireEvent(component, component, EventListener.EVENT_ERROR_UPDATE, {
								"error": true
							});
				}
				else{
					//Remove the error icon in the component title
					$(rootComponentNode).find(".sec-title span:first-child").removeClass("error-icon-component");
					//Fire and event to inform any listener that the component has not errored
					CERN_EventListener.fireEvent(component, component, EventListener.EVENT_ERROR_UPDATE, {
								"error": false
							});
				}
			}
		},
		/**
		 * Formats the content to the appropriate height and enables scrolling
		 * @param {node} content : The content to be formatted
		 * @param {int} num : The approximate number of items to display face up
		 * @param {float} ht : The total line height of an item
		 */
		InitScrolling: function(content, num, ht) {
			for (var k = 0; k < content.length; k++) {
				MP_Util.Doc.InitSectionScrolling(content[k], num, ht);
			}
		},
		/**
		 * Formats the section to the appropriate height and enables scrolling
		 * @param {node} sec : The section to be formatted
		 * @param {int} num : The approximate number of items to display face up
		 * @param {float} ht : The total line height of an item
		 */
		InitSectionScrolling: function(sec, num, ht) {
			var th = num * ht
			var totalHeight = th + "em";

			sec.style.maxHeight = totalHeight;
			sec.style.overflowY = 'auto';
			sec.style.overflowX = 'hidden';
		},
		InitHovers: function(trg, par, component) {
			gen = Util.Style.g(trg, par, "DL")

			for (var i = 0, l = gen.length; i < l; i++) {
				var m = gen[i];
				if (m) {
					var nm = Util.gns(Util.gns(m));
					if (nm) {
						if (Util.Style.ccss(nm, "hvr")) {
							hs(m, nm, component);
						}
					}
				}
			}
		},
		InitSubToggles: function(par, tog) {
			var i18nCore = i18n.discernabu;
			var toggleArray = Util.Style.g(tog, par, "span");
			for (var k = 0; k < toggleArray.length; k++) {
				Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
				var checkClosed = Util.gp(Util.gp(toggleArray[k]));
				if (Util.Style.ccss(checkClosed, "closed")) {
					toggleArray[k].innerHTML = "+";
					toggleArray[k].title = i18nCore.SHOW_SECTION;
				}
			}
		},
		/**
		 * Deprecated:  This function will not perform the correct expand all/collapse on the MPagesView.
		 *  This is now handled within the MPageView object definition and in the pageMenu
		 **/
		ExpandCollapseAll: function(ID) {
			var i18nCore = i18n.discernabu;
			var tabSection = _g(ID.replace("expAll", ""));
			var expNode = _g(ID);
			var allSections = Util.Style.g("section", tabSection);
			if (isExpandedAll) {
				for (var i = 0, asLen = allSections.length; i < asLen; i++) {
					var secHandle = Util.gc(Util.gc(allSections[i]));
					if (secHandle.innerHTML == "-" || secHandle.innerHTML == "+") {
						Util.Style.acss(allSections[i], "closed");
						secHandle.innerHTML = "+";
						secHandle.title = i18nCore.SHOW_SECTION;
					}
					else {
						var allSubSections = Util.Style.g("sub-sec", allSections[i], "div");
						for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {
							var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
							Util.Style.acss(allSubSections[j], "closed");
							subSecTgl.innerHTML = "+";
							subSecTgl.title = i18nCore.SHOW_SECTION;
						}
					}
				}
				expNode.innerHTML = i18nCore.EXPAND_ALL;
				isExpandedAll = false;
			}
			else {
				for (var i = 0, asLen = allSections.length; i < asLen; i++) {
					var secHandle = Util.gc(Util.gc(allSections[i]));
					if (secHandle.innerHTML == "-" || secHandle.innerHTML == "+") {
						Util.Style.rcss(allSections[i], "closed");
						secHandle.innerHTML = "-";
						secHandle.title = i18nCore.HIDE_SECTION;
					}
					else {
						var allSubSections = Util.Style.g("sub-sec", allSections[i], "div");
						for (var j = 0, aSubLen = allSubSections.length; j < aSubLen; j++) {
							var subSecTgl = Util.gc(Util.gc(allSubSections[j]));
							Util.Style.rcss(allSubSections[j], "closed");
							subSecTgl.innerHTML = "-";
							subSecTgl.title = i18nCore.HIDE_SECTION;
						}
					}
				}
				expNode.innerHTML = i18nCore.COLLAPSE_ALL;
				isExpandedAll = true;
			}
		},
		/**
		 * Adds chart search to the page.
		 * @param {Object} criterion The criterion object
		 * @param {Boolean} inViewPoint Indicator denoting if chart search is to be added in Viewpoint Framework.
		 */
		AddChartSearch: function(criterion, inViewPoint) {
			var csCallback = function(url) {
				try {
					if (url) {
						var fwObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
						fwObj.SetPopupStringProp("REPORT_NAME", "<url>" + url);
						fwObj.SetPopupDoubleProp("WIDTH", 1200);
						fwObj.SetPopupDoubleProp("HEIGHT", 700);
						fwObj.SetPopupBoolProp("SHOW_BUTTONS", 0);
						fwObj.LaunchPopup();
					}
					else {
						MP_Util.LogError("Error retriving URL from search");
					}
				}
				catch (err) {
					alert(i18n.discernabu.CODE_LEVEL);
					MP_Util.LogError("Error creating PVFRAMEWORKLINK window <br />Message: " + err.description + "<br />Name: " + err.name + "<br />Number: " + (err.number & 65535) + "<br />Description: " + err.description);
				}
			}
			//Check to see if the viewpoint already has a chart search available
			var csEle = _g("chrtSearchBox");
			if (!csEle) {
				//Add to viewpoint framework or single page
				var csDiv = Util.cep("div", {
					id: "chrtSearchBox"
				});
				csDiv.innerHTML = "<div id='chart-search-input-box'></div>";

				if (inViewPoint) {
					var vpTl = _g("vwpTabList");
					Util.ac(csDiv, vpTl);
				}
				else {
					var pgCtrl = _g("pageCtrl" + criterion.category_mean);
					pgCtrl.parentNode.insertBefore(csDiv, pgCtrl);
				}

				var csParams = {
					patientId: criterion.person_id,
					userId: criterion.provider_id,
					callback: csCallback
				};
				try {
					ChartSearchInput.embed('chart-search-input-box', csParams);
				}
				catch (err) {
					MP_Util.LogError("Error calling Chart Search embed <br />Message: " + err.description + "<br />Name: " + err.name + "<br />Number: " + (err.number & 65535) + "<br />Description: " + err.description);
				}
			}
		},
		/**
		 * Adds the title to the page.
		 * @param {String} title The title of the page to display
		 * @param {Object} bodyTag The body tag associated to the HTML document
		 * @param {Boolean} debugInd Indicator denoting if the mpage should run in debug mode.
		 * @param {Boolean} custInd Indicator denoting if the 'customize' option should be made available to the user for the given layout
		 * @param {String} helpFile The string name of the help file to associate to the page.
		 * @param {String} helpURL The String name of the help file URL to associate to the page.
		 * @param {Object} criterion The object associated to the criterion data
		 * @param {String} categoryMeaning The String name of the MPages View
		 */
		AddPageTitle: function(title, bodyTag, debugInd, custInd, anchorArray, helpFile, helpURL, criterion, categoryMeaning) {
			var i18nCore = i18n.discernabu;
			var ar = [];
			var imgSource = criterion.static_content + "/images/3865_16.gif";
			if (categoryMeaning) {
				title = "";
				bodyTag = _g(categoryMeaning);
				bodyTag.innerHTML = "";
			}
			else {
				if (bodyTag) {
					bodyTag = document.body;
				}
			}
			ar.push("<div class='pg-hd'>");
			ar.push("<h1><span class='pg-title'>", title, "</span></h1><span id='pageCtrl", criterion.category_mean, "' class='page-ctrl'>");

			//'as of' date is always to the far left of items
			if (categoryMeaning) {
				var df = MP_Util.GetDateFormatter();
				ar.push("<span class='other-anchors'>", i18nCore.AS_OF_TIME.replace("{0}", df.format(new Date(), mp_formatter.DateTimeFormatter.TIME_24HOUR_NO_SECONDS)), "</span>");
			}
			if (anchorArray) {
				for (var x = 0, xl = anchorArray.length; x < xl; x++) {
					ar.push("<span class='other-anchors'>" + anchorArray[x] + "</span>");
				}
			}

			if (custInd || categoryMeaning) {//customizable single view or in a view point
				var pageMenuId = "pageMenu" + criterion.category_mean;
				ar.push("<span id='", pageMenuId, "' class='page-menu'>&nbsp;</span>");
			}
			ar.push("</span></div>");
			bodyTag.innerHTML += ar.join("");
			return;
		},
		/**
		 * Launches the help file in a new modal window
		 * @param {String} HelpURL The String name of the help file  to associate to the page.
		 */
		LaunchHelpWindow: function(helpURL) {
			var wParams = "left=0,top=0,width=1200,height=700,toolbar=no";
			MP_Util.LogCclNewSessionWindowInfo(null, helpURL, "mp_core.js", "LaunchHelpWindow");
			CCLNEWSESSIONWINDOW(helpURL, "_self", wParams, 0, 1);
			Util.preventDefault();
		},
		AddClearPreferences: function(body, criterion) {
			var i18nCore = i18n.discernabu;
			var pageCtrl = _g("pageCtrl" + criterion.category_mean);
			var clearPrefNode = Util.cep("A", {
				"id": "clearPrefs",
				"onclick": "javascript:MP_Core.AppUserPreferenceManager.ClearPreferences();"
			});
			clearPrefNode.innerHTML = i18nCore.CLEAR_PREFERENCES;
			Util.ac(clearPrefNode, pageCtrl)
		},
		AddSavePreferences: function(body, criterion) {
			var i18nCore = i18n.discernabu;
			var pageCtrl = _g("pageCtrl" + criterion.category_mean);
			var savePrefNode = Util.cep("A", {
				"id": "savePrefs",
				"onclick": "javascript:MP_Core.AppUserPreferenceManager.SavePreferences();"
			});
			savePrefNode.innerHTML = i18nCore.SAVE_PREFERENCES;
			Util.ac(savePrefNode, pageCtrl)
		},
		AddCustomizeLink: function(criterion) {
			var i18nCore = i18n.discernabu;
			var custNode = _g("custView" + criterion.category_mean);
			if (custNode) {
				custNode.innerHTML = i18nCore.CUSTOMIZE;
				var compReportIds = GetPageReportIds();
				if ( typeof m_viewpointJSON == "undefined") {
					var cclParams = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", "^" + criterion.executable + "^", "^^", "^" + criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + criterion.category_mean + "^", criterion.debug_ind, "value(" + compReportIds.join(".0,") + ")", "1"];
					custNode.onclick = function() {
						CCLLINK("MP_DRIVER", cclParams.join(","), 1);
						Util.preventDefault();
					};
				}
				else {
					var js_viewpoint = JSON.parse(m_viewpointJSON).VIEWPOINTINFO_REC;
					var cclParams = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0", "^" + criterion.executable + "^", "^" + criterion.static_content.replace(/\\/g, "\\\\") + "^", "^" + js_viewpoint.VIEWPOINT_NAME_KEY + "^", criterion.debug_ind, "value(" + compReportIds.join(".0,") + ")", "1", "^" + criterion.category_mean + "^"];
					custNode.onclick = function() {
						CCLLINK(CERN_driver_script, cclParams.join(","), 1);
						Util.preventDefault();
					};
				}
			}
		},
		/**
		 * Allows the consumer of the architecture to render the components that exist either on the tab layout
		 * or the single driving MPage.  For tab based pages, the first tab is loaded by default.
		 */
		RenderLayout: function() {
			//determine if QOC is loading in a viewpoint
			var QOCFlag = 0;
			var CommonDiv = _g("MP_COMMON_ORDERS_V4");
			if (CommonDiv) {
				QOCFlag = ($(CommonDiv).css('display') === 'none') ? 1 : 0;
			}

			// Return to tab being viewed upon refresh
			if (CERN_TabManagers != null && QOCFlag === 0) {
				var tabManager = null;
				if (window.name.length > 0) {
					var paramList = window.name.split(",");
					MP_Util.DisplaySelectedTab(paramList[0], paramList[1]);
				}
				else {
					tabManager = CERN_TabManagers[0];
					tabManager.setSelectedTab(true);
					tabManager.loadTab();
				}
			}
			else if (CERN_MPageComponents != null) {
				for (var x = 0; x < CERN_MPageComponents.length; x++) {
					var comp = CERN_MPageComponents[x];
					if (comp.isDisplayable() && comp.isExpanded() && !comp.isLoaded()) {
						comp.setLoaded(true);
						if (comp.isResourceRequired()) {
							comp.RetrieveRequiredResources();
						}
						else {
							comp.InsertData();
						}
					}
				}
				for (var x = 0; x < CERN_MPageComponents.length; x++) {
					var comp = CERN_MPageComponents[x];
					if (comp.isDisplayable() && !comp.isExpanded() && !comp.isLoaded()) {
						comp.setLoaded(true);
						if (comp.isResourceRequired()) {
							comp.RetrieveRequiredResources();
						}
						else {
							comp.InsertData();
						}
					}
				}
			}
		},
		ExpandCollapse: function() {
			var i18nCore = i18n.discernabu;
			var gpp = Util.gp(Util.gp(this));
			if (Util.Style.ccss(gpp, "closed")) {
				Util.Style.rcss(gpp, "closed");
				this.innerHTML = "-";
				this.title = i18nCore.HIDE_SECTION;
			}
			else {
				Util.Style.acss(gpp, "closed");
				this.innerHTML = "+";
				this.title = i18nCore.SHOW_SECTION;
			}
		},
		HideHovers: function() {
			var hovers = Util.Style.g("hover", document.body, "DIV");
			for (var i = hovers.length; i--; ) {
				if (Util.gp(hovers[i]).nodeName == "BODY") {
					hovers[i].style.display = 'none';
					Util.de(hovers[i]);
				}
			}
		},
		ReplaceSubTitleText: function(component, text) {
			var lookbackDisplay = $("#lookbackDisplay" + component.getStyles().getId());
			if(lookbackDisplay.length) {
				lookbackDisplay.html(text);
			}
		},
		ReInitSubTitleText: function(component) {
			if (component.getScope() > 0) {
				var lookbackDisplay = $("#lookbackDisplay" + component.getStyles().getId());
				if(lookbackDisplay.length) {
					lookbackDisplay.html(CreateSubTitleText(component));
				}
			}
		},
		/*Copyright (c) 2006-2010 Paranoid Ferret Productions.  All rights reserved.

		 Developed by: Paranoid Ferret Productions
		 http://www.paranoidferret.com

		 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
		 CONTRIBUTORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
		 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
		 WITH THE SOFTWARE.*/

		RunAccordion: function(index) {
			var titleAr = [];
			var nID = "Accordion" + index + "Content";
			var TimeToSlide = 100.0;
			var titleDiv = _g("Accordion" + index + "Title");
			var containerDiv = _g("AccordionContainer" + index);
			var component = MP_Util.GetCompObjById(index);
			var location = component.getCriterion().static_content;

			//Adjust the pull tab image
			if (Util.Style.ccss(titleDiv, "Expanded")) {
				Util.Style.rcss(titleDiv, "Expanded");
				Util.Style.rcss(containerDiv, "Expanded");
			}
			else {
				Util.Style.acss(titleDiv, "Expanded");
				Util.Style.acss(containerDiv, "Expanded");
			}

			if (openAccordion == nID) {
				nID = '';
			}

			setTimeout("MP_Util.Doc.Animate(" + new Date().getTime() + "," + TimeToSlide + ",'" + openAccordion + "','" + nID + "'," + index + ")", 33);
			openAccordion = nID;
		},
		Animate: function(lastTick, timeLeft, closingId, openingId, compID) {
			var TimeToSlide = timeLeft;
			var curTick = new Date().getTime();
			var elapsedTicks = curTick - lastTick;
			var ContentHeight = 275.0;

			var opening = (openingId == '') ? null : _g(openingId);
			var closing = (closingId == '') ? null : _g(closingId);

			if (timeLeft <= elapsedTicks) {
				if (opening) {
					opening.style.display = 'block';
					opening.style.height = ContentHeight + 'px';
				}

				if (closing) {
					closing.style.display = 'none';
					closing.style.height = '0px';
					var filterListAr = Util.Style.g("acc-filter-list-item" + compID);
					var filtersSelected = MP_Util.Doc.GetSelected(filterListAr);
					//Loop through and get all the values, which are the event sets, and then refresh the component
				}
				return;
			}

			timeLeft -= elapsedTicks;
			var newClosedHeight = Math.round((timeLeft / TimeToSlide) * ContentHeight);

			if (opening) {
				if (opening.style.display != 'block') {
					opening.style.display = 'block';
					opening.style.height = (ContentHeight - newClosedHeight) + 'px';
				}
			}
			if (closing) {
				closing.style.height = newClosedHeight + 'px';
			}

			setTimeout("MP_Util.Doc.Animate(" + curTick + "," + timeLeft + ",'" + closingId + "','" + openingId + "'," + compID + ")", 33);
		},
		GetSelected: function(opt) {
			var selected = [];
			var index = 0;
			var optLen = opt.length;
			for (var intLoop = 0; intLoop < optLen; intLoop++) {
				if (opt[intLoop].selected) {
					index = selected.length;
					selected[index] = {};
					selected[index].value = opt[intLoop].value;
					selected[index].index = intLoop;
				}
			}
			return selected;
		},
		CreateLookBackMenu: function(component, loadInd, text) {
			var i18nCore = i18n.discernabu;
			var ar = [];
			var style = component.getStyles();
			var ns = style.getNameSpace();
			var compId = style.getId();
			var mnuCompId = component.getComponentId();
			var loc = component.getCriterion().static_content;
			var mnuItems = [];
			var mnuId = compId + "Mnu";
			var scope = component.getScope();
			var lookBackText = "";
			var lookBackUnits = "";
			var lookBackType = 0;
			var filterMsg = "";
			var filterMsgElementTitle = "";
			var hasFilters = false;

			if (component.m_grouper_arr.length === 0) {
				component.setCompFilters(false);
			}
			else {
				component.setCompFilters(true);
			}

			if (loadInd === 2) {
				var lbMenu = _g("lb" + mnuId);
				if (component.hasCompFilters()) {
					if (!text) {
						MP_Util.LaunchCompFilterSelection(mnuCompId, -1, 2);
					}
					else {
						var filterMsgElement = _g("cf" + mnuCompId + "msg");
						filterMsgElementTitle = filterMsgElement.title;
						filterMsg = filterMsgElement.innerHTML;
					}
				}

				if (lbMenu) {
					//Clear contents of the menu
					lbMenu.innerHTML = "";
				}
			}

			if (!text) {
				var mnuDisplay = CreateSubTitleText(component);
			}
			else {
				var mnuDisplay = text;
			}

			var menuItems = component.getLookbackMenuItems();
			if (menuItems) {
				for (var x = 0; x < menuItems.length; x++) {
					mnuItems[x] = new Array();
					lookBackUnits = parseInt(menuItems[x].getDescription(), 10);
					var tempTypeId = menuItems[x].getId();
					switch(tempTypeId) {
						case 1:
							lookBackType = 1;
							break;
						case 2:
							lookBackType = 2;
							break;
						case 3:
							lookBackType = 3;
							break;
						case 4:
							lookBackType = 4;
							break;
						case 5:
							lookBackType = 5;
							break;
						default:
							lookBackType = tempTypeId;
							break;
					}
					if (scope > 0) {
						if (lookBackUnits > 0 && lookBackType > 0) {
							var replaceText = "";
							switch(lookBackType) {
								case 1:
									replaceText = i18nCore.LAST_N_HOURS.replace("{0}", lookBackUnits);
									break;
								case 2:
									replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
									break;
								case 3:
									replaceText = i18nCore.LAST_N_WEEKS.replace("{0}", lookBackUnits);
									break;
								case 4:
									replaceText = i18nCore.LAST_N_MONTHS.replace("{0}", lookBackUnits);
									break;
								case 5:
									replaceText = i18nCore.LAST_N_YEARS.replace("{0}", lookBackUnits);
									break;
								default:
									replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookBackUnits);
									break;
							}
							switch(scope) {
								case 1:
									lookBackText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
									break;
								case 2:
									lookBackText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
									break;
							}
						}
						else {
							switch(scope) {
								case 1:
									lookBackText = i18nCore.All_VISITS;
									break;
								case 2:
									lookBackText = i18nCore.SELECTED_VISIT;
									break;
							}
						}
					}
					mnuItems[x][0] = lookBackText;
					mnuItems[x][1] = lookBackUnits;
					mnuItems[x][2] = lookBackType;
				}

				ar.push("<div id='lb", mnuId, "'><div id='stt", compId, "' class='sub-title-disp lb-drop-down'>");
				ar.push("<span id='lbMnuDisplay", mnuCompId, "' onclick='MP_Util.LaunchMenu(\"", mnuId, '", "', compId, "\");'>", mnuDisplay, "<a id='", ns, "Drop'><img src='", loc, "/images/3943_16.gif'></a></span><span id='cf", mnuCompId, "msg' class='filter-applied-msg' title='", filterMsgElementTitle, "'>", filterMsg, "</span></div>");
				ar.push("<div class='cvClassFilterSpan lb-mnu-selectWindow lb-menu2 menu-hide' id='", mnuId, "'><div class='mnu-labelbox'>", mnuDisplay, "</div><div class='mnu-contentbox'>");
				for (var x = 0, xl = mnuItems.length; x < xl; x++) {
					var item = mnuItems[x];
					ar.push("<div><span class='lb-mnu' id='lb", compId, x, "' onclick='MP_Util.LaunchLookBackSelection(\"", mnuCompId, '\",', item[1], ',\"', item[2], "\");'>", item[0], "</span></div>");
				}
				ar.push("</div></div></div>")
			}
			else {
				ar.push("<div id='lb", mnuId, "'><div id='stt", compId, "' class='sub-title-disp lb-drop-down'>");
				ar.push("<span id='lbMnuDisplay", mnuCompId, "'>", mnuDisplay, "</span><span id='cf", mnuCompId, "msg' class='filter-applied-msg' title='", filterMsgElementTitle, "'>", filterMsg, "</span></div></div>")
			}
			for (var y = 0; y < 10; y++) {
				if (component.getGrouperLabel(y) || component.getGrouperCatLabel(y)) {
					hasFilters = true;
					break;
				}
			}
			if (hasFilters === true && loadInd === 1) {
				ar.push("<div id='AccordionContainer", mnuCompId, "' class='accordion-container'>");
				ar.push("<div id='Accordion", mnuCompId, "Content' class='accordion-content'><div id='Accordion", mnuCompId, "ContentDiv' class='acc-content-div'></div><div class='lb-pg-hd lb-page-ctrl'><a class='setDefault' href='#' onclick='MP_Core.AppUserPreferenceManager.SaveCompPreferences(", mnuCompId, "); return false;'>", i18nCore.SET_AS_DEFAULT, "</a><a class='resetAll' href='#' onclick='MP_Core.AppUserPreferenceManager.ClearCompPreferences(", mnuCompId, "); return false;'>", i18nCore.RESET_ALL, "</a></div></div>");
				ar.push("<div id='Accordion", mnuCompId, "Title' class='accordion-title' onclick='MP_Util.Doc.RunAccordion(", mnuCompId, ");' onselectstart='return false;'></div></div>");
			}

			switch(loadInd) {
				case 2:
					lbMenu.innerHTML = ar.join('');
					break;

				default:
					var arHtml = ar.join("");
					return arHtml;
			}
		},
		/**
		 * This function is a passthrough to make the changeLayout function available outside of the MP_Util.Doc namespace since the layout menu items is now created
		 * at the MPagesView level.
		 */
		changeLayoutPassthrough : function(newColCnt, catMean){
			changeLayout(newColCnt, catMean)
		},
		/**
		 * This function is a passthrough to make the changeQocLayout function available outside of the MP_Util.Doc namespace since the layout menu items is now created
		 * at the MPagesView level.
		 */
		changeQOCLayoutPassthrough : function(newColCnt, catMean){
			changeQOCLayout(newColCnt, catMean);
		}
	};

	function launchSelectLayout(menuId, that, initialColCnt) {
		var i18nCore = i18n.discernabu;
		var optMenu = _g("optMenuConfig" + menuId);
		if (!optMenu) {
			optMenu = Util.cep("div", {
				className: "opts-menu-layout-content menu-hide",
				id: "optMenuConfig" + menuId
			});
			var optMenuJsHTML = [];
			var layoutClasses = ['view-layout1', 'view-layout2', 'view-layout3'];
			var i18nCore = i18n.discernabu;
			layoutClasses[initialColCnt - 1] += " view-layout-selected";
			optMenuJsHTML.push("<div class='" + layoutClasses[0] + "' data-cols='1'>" + i18nCore.COLUMN_ONE + "</div><div class='" + layoutClasses[1] + "' data-cols='2'>" + i18nCore.COLUMN_TWO + "</div><div class='" + layoutClasses[2] + "' data-cols='3'>" + i18nCore.COLUMN_THREE + "</div>");
			optMenu.innerHTML = optMenuJsHTML.join("");
			Util.ac(optMenu, document.body);

			Util.addEvent(_g("optMenuConfig" + menuId), "click", function(e) {
				var target = e.target || e.srcElement;
				var cols = target.getAttribute("data-cols");
				$("#optMenuConfig" + menuId + " div").removeClass("view-layout-selected");
				Util.Style.acss(target, "view-layout-selected");

				var catMean;
				if ( typeof m_viewpointJSON == "string") {
					MP_Util.RetrieveCookie();
					var vpCookieVal = MP_Util.GetCookieProperty("viewpoint", "viewCatMean")
					catMean = (vpCookieVal) ? vpCookieVal : $(".vwp-cached:first").attr("id");
				}
				changeLayout(parseInt(cols, 10), catMean);
			});
			InitPageOptMenu(optMenu, menuId, true);
		}
		OpenCompOptMenu(optMenu, menuId, that);
	}

	function launchQOCSelectLayout(menuId, that, initialColCnt) {
		var i18nCore = i18n.discernabu;
		var optMenu = _g("optMenuConfig" + menuId);
		if (!optMenu) {
			optMenu = Util.cep("div", {
				className: "opts-menu-layout-content menu-hide",
				id: "optMenuConfig" + menuId
			});
			var optMenuJsHTML = [];
			var layoutClasses = ['view-layout1', 'view-layout2', 'view-layout3', 'view-layout4', 'view-layout5'];
			var i18nCore = i18n.discernabu;
			layoutClasses[initialColCnt - 1] += " view-layout-selected";
			optMenuJsHTML.push("<div class='" + layoutClasses[0] + "' data-cols='1'>" + i18nCore.COLUMN_ONE + "</div><div class='" + layoutClasses[1] + "' data-cols='2'>" + i18nCore.COLUMN_TWO + "</div><div class='" + layoutClasses[2] + "' data-cols='3'>" + i18nCore.COLUMN_THREE + "</div><div class='" + layoutClasses[3] + "' data-cols='4'>" + i18nCore.COLUMN_FOUR + "</div><div class='" + layoutClasses[4] + "' data-cols='5'>" + i18nCore.COLUMN_FIVE + "</div>");
			optMenu.innerHTML = optMenuJsHTML.join("");
			Util.ac(optMenu, document.body);

			Util.addEvent(_g("optMenuConfig" + menuId), "click", function(e) {
				var target = e.target || e.srcElement;
				var cols = target.getAttribute("data-cols");
				$("#optMenuConfig" + menuId + " div").removeClass("view-layout-selected");
				Util.Style.acss(target, "view-layout-selected");
				var activeViewDiv = Util.Style.g("div-tab-item-selected", document.body, "DIV")[0];
				if (activeViewDiv) {
					var catMean = activeViewDiv.id;
					changeQOCLayout(parseInt(cols, 10), catMean);
				}
			});
			InitPageOptMenu(optMenu, menuId, true);
		}
		OpenCompOptMenu(optMenu, menuId, that);
	}

	function changeLayout(newColCnt, catMean) {
		var viewpointState = (catMean) ? "#" + catMean + " " : "";
		var colClasses = ["one-col", "two-col", "three-col"]
		var curColCnt;
		var curColGroupClass = $(viewpointState + '.col-group:last').attr('class').replace("col-group ", "");

		switch (curColGroupClass) {
			case "three-col":
				curColCnt = 3;
				break;
			case "two-col":
				curColCnt = 2;
				break;
			case "one-col":
				curColCnt = 1;
				break;
		}

		if (newColCnt < curColCnt) {//removing columns
			if (newColCnt === 1) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section');
				$(viewpointState + '.col-group:last .col1').append(comps);
				$(viewpointState + '.col-group:last .col2').remove();
				$(viewpointState + '.col-group:last .col3').remove();
			}
			else if (newColCnt === 2) {
				var comps = $(viewpointState + '.col-group:last .col3 .section');
				$(viewpointState + '.col-group:last .col2').append(comps);
				$(viewpointState + '.col-group:last .col3').remove();
			}
			//save new layout
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(null, "", null, true);
			}, 0);

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
		}
		else if (newColCnt > curColCnt) {//adding columns
			if ((newColCnt - curColCnt) === 1) {
				var colHTML = (curColCnt == 1) ? '<div class="col2"></div>' : '<div class="col3"></div>';
				$(viewpointState + '.col-outer1:last').append(colHTML);
			}
			else if ((newColCnt - curColCnt) === 2) {
				$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div>');
			}

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
			MP_Util.Doc.InitDragAndDrop(catMean);
		}
	}

	function changeQOCLayout(newColCnt, catMean) {
		var viewpointState = (catMean) ? "#" + catMean + " " : "";
		var colClasses = ["one-col", "two-col", "three-col", "four-col", "five-col"]
		var curColCnt;
		var curColGroupClass = $(viewpointState + '.col-group:last').attr('class').replace("col-group ", "");

		switch (curColGroupClass) {
			case "five-col":
				curColCnt = 5;
				break;
			case "four-col":
				curColCnt = 4;
				break;
			case "three-col":
				curColCnt = 3;
				break;
			case "two-col":
				curColCnt = 2;
				break;
			case "one-col":
				curColCnt = 1;
				break;
		}

		if (newColCnt < curColCnt) {//removing columns
			if (newColCnt === 1) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section');
				$(viewpointState + '.col-group:last .col1').append(comps);
				$(viewpointState + '.col-group:last .col2').remove();
				$(viewpointState + '.col-group:last .col3').remove();
				$(viewpointState + '.col-group:last .col4').remove();
				$(viewpointState + '.col-group:last .col5').remove();
			}
			else if (newColCnt === 2) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section').not(viewpointState + '.col2 .section');
				$(viewpointState + '.col-group:last .col2').append(comps);
				$(viewpointState + '.col-group:last .col3').remove();
				$(viewpointState + '.col-group:last .col4').remove();
				$(viewpointState + '.col-group:last .col5').remove();
			}
			else if (newColCnt === 3) {
				var comps = $(viewpointState + '.col-group:last .section').not(viewpointState + '.col1 .section').not(viewpointState + '.col2 .section').not(viewpointState + '.col3 .section');
				$(viewpointState + '.col-group:last .col3').append(comps);
				$(viewpointState + '.col-group:last .col4').remove();
				$(viewpointState + '.col-group:last .col5').remove();
			}
			else if (newColCnt === 4) {
				var comps = $(viewpointState + '.col-group:last .col5 .section');
				$(viewpointState + '.col-group:last .col4').append(comps);
				$(viewpointState + '.col-group:last .col5').remove();
			}
			//save new layout
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, catMean);
			}, 0);

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
		}
		else if (newColCnt > curColCnt) {//adding columns
			if ((newColCnt - curColCnt) === 1) {
				if (newColCnt === 2) {
					$(viewpointState + '.col-outer1:last').append('<div class="col2"></div>');
				}
				else if (newColCnt === 3) {
					$(viewpointState + '.col-outer1:last').append('<div class="col3"></div>');
				}
				else if (newColCnt === 4) {
					$(viewpointState + '.col-outer1:last').append('<div class="col4"></div>');
				}
				else if (newColCnt === 5) {
					$(viewpointState + '.col-outer1:last').append('<div class="col5"></div>');
				}
			}
			else if ((newColCnt - curColCnt) === 2) {
				if (newColCnt === 3) {
					$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div>');
				}
				else if (newColCnt === 4) {
					$(viewpointState + '.col-outer1:last').append('<div class="col3"></div><div class="col4"></div>');
				}
				else if (newColCnt === 5) {
					$(viewpointState + '.col-outer1:last').append('<div class="col4"></div><div class="col5"></div>');
				}
			}
			else if ((newColCnt - curColCnt) === 3) {
				if (newColCnt === 4) {
					$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div><div class="col4"></div>');
				}
				else if (newColCnt === 5) {
					$(viewpointState + '.col-outer1:last').append('<div class="col3"></div><div class="col4"></div><div class="col5"></div>');
				}
			}
			else if ((newColCnt - curColCnt) === 4) {
				$(viewpointState + '.col-outer1:last').append('<div class="col2"></div><div class="col3"></div><div class="col4"></div><div class="col5"></div>');
			}

			$(viewpointState + '.col-group:last').attr('class', 'col-group ' + colClasses[newColCnt - 1])
			MP_Util.Doc.InitQOCDragAndDrop(catMean);
		}
	}

	function launchThemeMenu(componentId, fullId, secId, that) {
		var i18nCore = i18n.discernabu;
		var optMenu = _g("optMenuConfig" + componentId);
		if (!optMenu) {
			optMenu = Util.cep("div", {
				"className": "opts-menu-config-content menu-hide",
				"id": "optMenuConfig" + componentId
			});
			var optMenuJsHTML = [];
			optMenuJsHTML.push("<div title = '", i18nCore.COLOR_STANDARD, "' class='opts-menu-config-item opt-config-mnu-lightgrey' data-color='lightgrey' id='optConfigMnuLightGrey", componentId, "'></div>", "<div title = '", i18nCore.COLOR_BROWN, "' class='opts-menu-config-item opt-config-mnu-brown' data-color='brown' id='optConfigMnuBrown", componentId, "'></div>", "<div title = '", i18nCore.COLOR_CERNER_BLUE, "' class='opts-menu-config-item opt-config-mnu-cernerblue' data-color='cernerblue' id='optConfigMnuCernerBlue", componentId, "'></div>", "<div title = '", i18nCore.COLOR_DARK_GREEN, "' class='opts-menu-config-item opt-config-mnu-darkgreen' data-color='darkgreen' id='optConfigMnuDarkGreen", componentId, "'></div>", "<div title = '", i18nCore.COLOR_GREEN, "' class='opts-menu-config-item opt-config-mnu-green' data-color='green' id='optConfigMnuGreen", componentId, "'></div>", "<div title = '", i18nCore.COLOR_GREY, "' class='opts-menu-config-item opt-config-mnu-grey' data-color='grey' id='optConfigMnuGrey", componentId, "'></div>", "<div title = '", i18nCore.COLOR_LIGHT_BLUE, "' class='opts-menu-config-item opt-config-mnu-lightblue' data-color='lightblue' id='optConfigMnuLightBlue", componentId, "'></div>", "<div title = '", i18nCore.COLOR_NAVY, "' class='opts-menu-config-item opt-config-mnu-navy' data-color='navy' id='optConfigMnuNavy", componentId, "'></div>", "<div title = '", i18nCore.COLOR_ORANGE, "' class='opts-menu-config-item opt-config-mnu-orange' data-color='orange' id='optConfigMnuOrange", componentId, "'></div>", "<div title = '", i18nCore.COLOR_PINK, "' class='opts-menu-config-item opt-config-mnu-pink' data-color='pink' id='optConfigMnuPink", componentId, "'></div>", "<div title = '", i18nCore.COLOR_PURPLE, "' class='opts-menu-config-item opt-config-mnu-purple' data-color='purple' id='optConfigMnuPurple", componentId, "'></div>", "<div title = '", i18nCore.COLOR_YELLOW, "' class='opts-menu-config-item opt-config-mnu-yellow' data-color='yellow' id='optConfigMnuYellow", componentId, "'></div>");

			optMenu.innerHTML = optMenuJsHTML.join("");

			Util.ac(optMenu, document.body);
			//actual contents of the menu are appended to body and positioned in launchOptMenu

			Util.addEvent(_g("optMenuConfig" + componentId), "click", function(e) {
				var target = e.target || e.srcElement;
				var color = target.getAttribute('data-color');
				changeThemeColor(componentId, color, secId);
			});

			InitCompOptMenu(optMenu, componentId, true);
		}

		OpenCompOptMenu(optMenu, fullId, that);
	}

	function launchQOCThemeMenu(componentId, fullId, secId, that, selectedViewId) {
		var i18nCore = i18n.discernabu;
		var optMenu = _g("optMenuConfig" + componentId);
		if (!optMenu) {
			optMenu = Util.cep("div", {
				"className": "opts-menu-config-content menu-hide",
				"id": "optMenuConfig" + componentId
			});
			var optMenuJsHTML = [];
			optMenuJsHTML.push("<div title = '", i18nCore.COLOR_STANDARD, "' class='opts-menu-config-item opt-config-mnu-lightgrey' data-color='lightgrey' id='optConfigMnuLightGrey", componentId, "'></div>", "<div title = '", i18nCore.COLOR_BROWN, "' class='opts-menu-config-item opt-config-mnu-brown' data-color='brown' id='optConfigMnuBrown", componentId, "'></div>", "<div title = '", i18nCore.COLOR_CERNER_BLUE, "' class='opts-menu-config-item opt-config-mnu-cernerblue' data-color='cernerblue' id='optConfigMnuCernerBlue", componentId, "'></div>", "<div title = '", i18nCore.COLOR_DARK_GREEN, "' class='opts-menu-config-item opt-config-mnu-darkgreen' data-color='darkgreen' id='optConfigMnuDarkGreen", componentId, "'></div>", "<div title = '", i18nCore.COLOR_GREEN, "' class='opts-menu-config-item opt-config-mnu-green' data-color='green' id='optConfigMnuGreen", componentId, "'></div>", "<div title = '", i18nCore.COLOR_GREY, "' class='opts-menu-config-item opt-config-mnu-grey' data-color='grey' id='optConfigMnuGrey", componentId, "'></div>", "<div title = '", i18nCore.COLOR_LIGHT_BLUE, "' class='opts-menu-config-item opt-config-mnu-lightblue' data-color='lightblue' id='optConfigMnuLightBlue", componentId, "'></div>", "<div title = '", i18nCore.COLOR_NAVY, "' class='opts-menu-config-item opt-config-mnu-navy' data-color='navy' id='optConfigMnuNavy", componentId, "'></div>", "<div title = '", i18nCore.COLOR_ORANGE, "' class='opts-menu-config-item opt-config-mnu-orange' data-color='orange' id='optConfigMnuOrange", componentId, "'></div>", "<div title = '", i18nCore.COLOR_PINK, "' class='opts-menu-config-item opt-config-mnu-pink' data-color='pink' id='optConfigMnuPink", componentId, "'></div>", "<div title = '", i18nCore.COLOR_PURPLE, "' class='opts-menu-config-item opt-config-mnu-purple' data-color='purple' id='optConfigMnuPurple", componentId, "'></div>", "<div title = '", i18nCore.COLOR_YELLOW, "' class='opts-menu-config-item opt-config-mnu-yellow' data-color='yellow' id='optConfigMnuYellow", componentId, "'></div>");

			optMenu.innerHTML = optMenuJsHTML.join("");

			Util.ac(optMenu, document.body);
			//actual contents of the menu are appended to body and positioned in launchOptMenu

			Util.addEvent(_g("optMenuConfig" + componentId), "click", function(e) {
				var target = e.target || e.srcElement;
				var color = target.getAttribute('data-color');
				changeQOCThemeColor(componentId, color, secId, selectedViewId);
			});

			InitCompOptMenu(optMenu, componentId, true);
		}

		OpenCompOptMenu(optMenu, fullId, that);
	}

	function changeThemeColor(componentId, color, styleId) {
		var section = _g(styleId);
		if (section) {
			var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
			//a color is found in the class name so replace it with ""
			if (colorString.indexOf(color) >= 0) {
				var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
				section.className = section.className.replace(colorRegExp, "");
			}

			//add the new color so it changes for the user
			Util.Style.acss(section, color);
			var component = MP_Util.GetCompObjById(componentId);
			component.setCompColor(color);
			//add the color to the component properties
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, color, null, false);
			}, 0);
		}
	}

	function changeQOCThemeColor(componentId, color, styleId, selectedViewId) {
		var section = _g(styleId);
		if (section) {
			var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
			//a color is found in the class name so replace it with ""
			if (colorString.indexOf(color) >= 0) {
				var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
				section.className = section.className.replace(colorRegExp, "");
			}

			//add the new color so it changes for the user
			Util.Style.acss(section, color);
			var component = MP_Util.GetCompObjById(componentId);
			component.setCompColor(color);
			//add the color to the component properties
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, selectedViewId);
			}, 0);
		}
	}

	function launchSetState(componentId, defStateEl) {
		var component = MP_Util.GetCompObjById(componentId);
		var curExpColState = component.isExpanded();
		component.setExpandCollapseState(!curExpColState);
		var checkSpan = _gbt("span", defStateEl)[0];

		if (!curExpColState) {
			if (checkSpan) {
				Util.Style.acss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "1", false);
			}, 0);
		}
		else {
			if (checkSpan) {
				Util.Style.rcss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "0", false);
			}, 0);
		}
	}

	function launchInfoSetState(componentId, infoStateEl) {
		//false = Disabled, true = Enabled
		var i18nCore = i18n.discernabu;
		var component = MP_Util.GetCompObjById(componentId);
		var curInfoState = component.isInfoButtonEnabled();
		var checkSpan = _gbt("span", infoStateEl)[0];
		//component.setIsInfoButtonEnabled(!curInfoState);
		if (curInfoState) {
			component.setIsInfoButtonEnabled(0);
		}
		else {
			component.setIsInfoButtonEnabled(1);
		}
		
		if (!curInfoState) { //Currently disabled, turning to enabled
			if (checkSpan) {
				Util.Style.acss(checkSpan, "opts-menu-info-en");
				//Call the component function to show info button and allow click event
				component.showInfoButton(component,true);
			}
		}
		else {
			if (checkSpan) {
				Util.Style.rcss(checkSpan, "opts-menu-info-en");
				//Call the component function to remove info button
				component.showInfoButton(component,false);
			}
		}
	}
	
	function launchQOCSetState(componentId, defStateEl, selectedViewId) {
		var component = MP_Util.GetCompObjById(componentId);
		var curExpColState = component.isExpanded();
		component.setExpandCollapseState(!curExpColState);
		var checkSpan = _gbt("span", defStateEl)[0];

		if (!curExpColState) {
			if (checkSpan) {
				Util.Style.acss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, selectedViewId);
			}, 0);
		}
		else {
			if (checkSpan) {
				Util.Style.rcss(checkSpan, "opts-menu-def-exp");
			}
			setTimeout(function() {
				MP_Core.AppUserPreferenceManager.SaveQOCCompPreferences(null, "", null, true, selectedViewId);
			}, 0);
		}
	}

	function InitPageOptMenu(inMenu, componentId, isSubMenu) {
		var closeMenu = function(e) {
			if (!e) {
				e = window.event;
			}

			var resetPageMenu = function() {
				var pageMenu = _g(componentId);
				if (Util.Style.ccss(pageMenu, "page-menu-open")) {
					Util.Style.rcss(pageMenu, "page-menu-open")
				}
			}
			var relTarg = e.relatedTarget || e.toElement;
			var mainMenu = _g("moreOptMenu" + componentId);

			if (isSubMenu) {
				var target = e.target || e.srcElement;
			}
			if (relTarg) {
				if (!Util.Style.ccss(relTarg, "opts-menu-layout-content")) {
					if (mainMenu) {
						Util.Style.acss(mainMenu, "menu-hide");
						resetPageMenu();
					}
					if (isSubMenu) {
						if (Util.Style.ccss(target, "opts-menu-layout-content") && !Util.Style.ccss(relTarg, "opts-menu-content")) {
							if (_g("moreOptMenu" + componentId)) {
								Util.Style.acss(_g("moreOptMenu" + componentId), "menu-hide");
							}
						}
					}
					if (_g("optMenuConfig" + componentId)) {
						Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
					}
				}
			}
			else {
				if (mainMenu) {
					Util.Style.acss(mainMenu, "menu-hide");
					resetPageMenu();
				}
			}
			Util.cancelBubble(e);
		};
		$(inMenu).mouseleave(closeMenu);
	}

	function InitCompOptMenu(inMenu, componentId, isSubMenu) {
		var closeMenu = function(e) {
			if (!e) {
				e = window.event;
			}
			var relTarg = e.relatedTarget || e.toElement;
			var mainMenu = _g("moreOptMenu" + componentId);
			if (isSubMenu) {
				var target = e.target || e.srcElement;
			}
			if (relTarg) {
				if (!Util.Style.ccss(relTarg, "opts-menu-config-content")) {
					if (mainMenu) {
						Util.Style.acss(mainMenu, "menu-hide");
					}
					if (isSubMenu) {
						Util.Style.acss(inMenu, "menu-hide");
						if (Util.Style.ccss(target, "opts-menu-config-content") && !Util.Style.ccss(relTarg, "opts-menu-content")) {
							if (_g("moreOptMenu" + componentId)) {
								Util.Style.acss(_g("moreOptMenu" + componentId), "menu-hide");
							}
						}
					}
					if (_g("optMenuConfig" + componentId)) {
						Util.Style.acss(_g("optMenuConfig" + componentId), "menu-hide");
					}

				}
			}
			else {
				if (mainMenu) {
					Util.Style.acss(mainMenu, "menu-hide");
				}
			}
			Util.cancelBubble(e);
		};
		$(inMenu).mouseleave(closeMenu);
	}

	/**
	 * Open the options menu within the new order entry component
	 * @param {node} menu : The menu node
	 * @param {string} sectionId : The html id of the section containing the menu
	 */
	function OpenCompOptMenu(menu, sectionId, that) {
		var verticalOffset = 30;
		if (Util.Style.ccss(menu, "menu-hide")) {
			Util.preventDefault();
			Util.Style.rcss(menu, "menu-hide");

			if (that) {
				var ofs = Util.goff(that);
				var moreMenu = Util.gns(that);
				var thisWidth = that.offsetWidth;
				var divOfs = menu.offsetWidth;

				var vpOfs = ofs[0] - divOfs;
				if (vpOfs > 0) {
					menu.style.left = (vpOfs - 2) + 'px';
					//  Util.Style.acss(mpDiv, 'hml-mpd-lt');
				}
				else {
					menu.style.left = (ofs[0] + thisWidth + 6) + 'px';
					//  Util.Style.acss(mpDiv, 'hml-mpd-rt');

				}
				menu.style.top = (ofs[1] - 5) + 'px';
			}
			else {
				var menuId = "#mainCompMenu" + sectionId;
				var menuElement = $(menuId);
				if (menuElement.length) {
					//Component menu logic
					menu.style.left = ($(menuElement).offset().left - 125) + "px";
					menu.style.top = ($(menuElement).offset().top + 18) + "px";
				}
				else {
					//Page level menu logic
					var vp = gvs();
					var sec = _g(sectionId);
					var ofs = Util.goff(sec);
					menu.style.left = (ofs[0] + sec.offsetWidth - menu.offsetWidth) + 'px';
					menu.style.top = (ofs[1] + verticalOffset) + 'px';
				}
			}
		}
		else {
			Util.Style.acss(menu, "menu-hide");
		}
	}

	function GetPreferenceIdentifier() {
		var prefIdentifier = "";
		if (CERN_TabManagers != null) {
			for (var x = CERN_TabManagers.length; x--; ) {
				var tabManager = CERN_TabManagers[x];
				if (tabManager.getSelectedTab()) {
					var tabItem = tabManager.getTabItem();
					return tabItem.prefIdentifier;
				}
			}
		}
		else if (CERN_MPageComponents != null) {
			for (var x = CERN_MPageComponents.length; x--; ) {
				var criterion = CERN_MPageComponents[x].getCriterion();
				return criterion.category_mean;
			}
		}
		return prefIdentifier;
	}

	function GetPageReportIds() {
		var ar = [];
		if (CERN_TabManagers != null) {
			for (var x = CERN_TabManagers.length; x--; ) {
				var tabManager = CERN_TabManagers[x];
				if (tabManager.getSelectedTab()) {
					var tabItem = tabManager.getTabItem();
					var components = tabItem.components;
					if (components != null && components.length > 0) {
						for (var y = components.length; y--; ) {
							ar.push(components[y].getReportId())
						}
					}
					break;
				}
			}
		}
		else if (CERN_MPageComponents != null) {
			for (var x = CERN_MPageComponents.length; x--; ) {
				ar.push(CERN_MPageComponents[x].getReportId());
			}
		}
		return ar;
	}

	function GetComponentArray(components) {
		var grpAr = [];
		var colAr = [];
		var rowAr = [];
		var curCol = -1;
		var curGrp = -1;

		var sHTML = [];

		//first layout the group/columns/rows of components
		if (components != null) {
			components.sort(SortMPageComponents);

			for (var x = 0, xl = components.length; x < xl; x++) {
				var component = components[x];
				if (CERN_MPageComponents == null)
					CERN_MPageComponents = [];
				CERN_MPageComponents.push(component);

				if (component.isDisplayable()) {//based on filter logic, only display if criteria is met
					var compGrp = component.getPageGroupSequence();
					var compCol = component.getColumn();

					if (compGrp != curGrp) {
						curCol = -1;
						colAr = [];
						grpAr.push(colAr);
						curGrp = compGrp;
					}

					if (compCol != curCol) {
						rowAr = [];
						colAr.push(rowAr);
						curCol = compCol;
					}
					rowAr.push(component);
				}
			}
		}
		return grpAr;
	}

	function CreateCustomizeLiquidLayout(components, parentNode) {
		var sHTML = [];
		var grpAr = MP_Util.GetComponentArray(components);
		sHTML.push("<div class=pref-columns>");
		for (var x = 0, xl = grpAr.length; x < xl; x++) {
			colAr = grpAr[x];
			sHTML.push("<div>");
			var colLen = colAr.length;
			//always allow for a 3 column custimization
			sHTML.push("<div class='col-group three-col'>");
			sHTML.push("<div class='col-outer2'><div class='col-outer1'>");

			for (var y = 0; y < colLen; y++) {
				var comps = colAr[y];
				var colClassName = "col" + (y + 1) + " cust-col";
				sHTML.push("<div class='", colClassName, "'>")
				for (var z = 0, zl = comps.length; z < zl; z++) {
					sHTML.push(CreateCompDiv(comps[z]));
				}
				sHTML.push("</div>");
			}
			for (var y = colLen + 1; y <= 3; y++) {
				var colClassName = "col" + (y) + " cust-col";
				sHTML.push("<div class='", colClassName, "'></div>")
			}
			sHTML.push("</div></div></div></div>");
		}
		sHTML.push("</div>");
		parentNode.innerHTML += sHTML.join("");
	}

	function CreateLiquidLayout(components, parentNode, disableMenu) {
		var grpAr = MP_Util.GetComponentArray(components);
		//Put the components in the global object
		MP_Util.addComponentsToGlobalStorage(components);
		var sHTML = [];
		for (var x = 0, xl = grpAr.length; x < xl; x++) {
			colAr = grpAr[x];
			sHTML.push("<div>");
			var colLen = colAr.length;
			switch(colLen) {
				case 1:
					sHTML.push("<div class='col-group one-col'>");
					break;
				case 2:
					sHTML.push("<div class='col-group two-col'>");
					break;
				case 3:
					sHTML.push("<div class='col-group three-col'>");
					break;
				case 4:
					sHTML.push("<div class='col-group four-col'>");
					break;
				default:
					sHTML.push("<div class='col-group five-col'>");
			}
			sHTML.push("<div class='col-outer2'><div class='col-outer1'>");
			for (var y = 0; y < colLen; y++) {
				var colClassName = "col" + (y + 1);
				var comps = colAr[y];
				sHTML.push("<div class='", colClassName, "'>");
				for (var z = 0, zl = comps.length; z < zl; z++) {
					sHTML.push(CreateCompDiv(comps[z], disableMenu));
				}
				sHTML.push("</div>");
			}
			sHTML.push("</div></div></div></div>");
		}
		parentNode.innerHTML += sHTML.join("");
	}

	function UpdateQOCComponentsWithUserPrefs(bedrockComponentArr, userPrefComponentArr, criterion, MPageObj) {
		var isViewPoint = null
		var colorString = "brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow";
        var colorRegExp = /brown|cernerblue|darkgreen|grey|green|lightblue|lightgrey|lowlight|navy|orange|pink|purple|yellow/;
        var style = null;
        var compClassName = null;
		if (MPageObj) {
			isViewPoint = MPageObj.getViewpointIndicator();
		}
		for (var x = 0, xl = userPrefComponentArr.length; x < xl; x++) {
			var userPrefComp = userPrefComponentArr[x];
			var isUserPrefPrsnlFavComp = true;
			for (var y = 0, yl = bedrockComponentArr.length; y < yl; y++) {
				var bedrockComp = bedrockComponentArr[y];
				var mnuCompId = bedrockComp.getComponentId();
				if (mnuCompId === userPrefComp.id) {
					isUserPrefPrsnlFavComp = false;
					bedrockComp.setColumn(userPrefComp.col_seq);
					bedrockComp.setSequence(userPrefComp.row_seq);
					bedrockComp.setPageGroupSequence(1);
					style = bedrockComp.getStyles();
                    compClassName = style.getClassName();
					if (userPrefComp.compThemeColor) {
						//If there is a userdefined color for QOC clear the organization defined color first.
                        style.setClassName(compClassName.replace(colorRegExp, ""));
                        //Add the userdefined color
						bedrockComp.setCompColor(userPrefComp.compThemeColor);
					}
					bedrockComp.setExpanded(userPrefComp.expanded);
					if (userPrefComp.preferencesObj) {
						bedrockComp.setPreferencesObj(userPrefComp.preferencesObj);
					}

				}
			}
			//if user preferences component does not exist in "bedrock" list, then it is a personal fav
			//component and a whole new component needs to be created
			if (isUserPrefPrsnlFavComp) {
				var component = new OrderSelectionComponent();
				component.setCriterion(criterion);
				component.setStyles(new OrderSelectionComponentStyle());
				component.setCustomizeView(false);
				component.setComponentId(userPrefComp.id);
				component.setReportId(userPrefComp.reportId);
				component.setFavFolderId(userPrefComp.reportId);
				component.setLabel(userPrefComp.label);
				component.setExpanded(userPrefComp.expanded);
				component.setColumn(userPrefComp.col_seq);
				component.setSequence(userPrefComp.row_seq);
				component.setPageGroupSequence(userPrefComp.group_seq);
				component.setDisplayEnabled(true);
				component.setPreferencesObj(userPrefComp.preferencesObj);
				if (isViewPoint) {
					component.setModalScratchPadEnabled(1);
				}
				var style = component.getStyles();
				style.setComponentId(userPrefComp.id);
				if (userPrefComp.compThemeColor) {
					component.setCompColor(userPrefComp.compThemeColor);
					style.setColor(userPrefComp.compThemeColor);
				}
				if (userPrefComp.lookbackunits) {
					component.setLookbackUnits(userPrefComp.lookbackunits);
				}
				if (userPrefComp.lookbacktypeflag) {
					component.setLookbackUnitTypeFlag(userPrefComp.lookbacktypeflag);
				}
				if (userPrefComp.grouperFilterLabel) {
					component.setGrouperFilterLabel(userPrefComp.grouperFilterLabel);
				}
				else {
					component.setGrouperFilterLabel("");
				}
				if (userPrefComp.grouperFilterCatLabel) {
					component.setGrouperFilterCatLabel(userPrefComp.grouperFilterCatLabel);
				}
				else {
					component.setGrouperFilterCatLabel("");
				}
				if (userPrefComp.grouperFilterCriteria) {
					component.setGrouperFilterCriteria(userPrefComp.grouperFilterCriteria);
				}
				else {
					component.setGrouperFilterCriteria(null);
				}

				if (userPrefComp.grouperFilterCatalogCodes) {
					component.setGrouperFilterCatalogCodes(userPrefComp.grouperFilterCatalogCodes);
				}
				else {
					component.setGrouperFilterCatalogCodes(null);
				}

				if (userPrefComp.selectedTimeFrame) {
					component.setSelectedTimeFrame(userPrefComp.selectedTimeFrame);
				}
				else {
					component.setSelectedTimeFrame(null);
				}
				if (userPrefComp.selectedDataGroup) {
					component.setSelectedDataGroup(userPrefComp.selectedDataGroup);
				}
				else {
					component.setSelectedDataGroup(null);
				}
				if (userPrefComp.preferencesObj) {
					bedrockComp.setPreferencesObj(userPrefComp.preferencesObj);
				}
				else {
					bedrockComp.setPreferencesObj(null);
				}


				//add comp id to "personal favorites" list
				if (CERN_PersonalFav === null) {
					CERN_PersonalFav = [];
				}
				CERN_PersonalFav.push(style.getId());
				//add component to updated "bedrock" list
				bedrockComponentArr.push(component);
			}
		}
		return bedrockComponentArr;
	}

	function SetupExpandCollapse() {
		var i18nCore = i18n.discernabu;
		//set up expand collapse for all components
		var toggleArray = Util.Style.g("sec-hd-tgl");
		for (var k = 0; k < toggleArray.length; k++) {
			Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
			var checkClosed = Util.gp(Util.gp(toggleArray[k]));
			if (Util.Style.ccss(checkClosed, "closed")) {
				toggleArray[k].innerHTML = "+";
				toggleArray[k].title = i18nCore.SHOW_SECTION;
			}
		}
	}

	function SetupCompFilters(compArray) {
		var compArrayLen = compArray.length;
		var hasFilters = false;
		for (var x = 0; x < compArrayLen; x++) {
			hasFilters = false;
			for (var y = 0; y < 10; y++) {
				if (compArray[x].getGrouperLabel(y) || compArray[x].getGrouperCatLabel(y)) {
					hasFilters = true;
					break;
				}
			}
			compArray[x].setCompFilters(hasFilters);
			if (compArray[x].hasCompFilters() && compArray[x].isDisplayable()) {
				compArray[x].renderAccordion(compArray[x]);
			}
		}
	}

	function CreateCompDiv(component, disableMenu) {
		var i18nCore = i18n.discernabu;
		var ar = [];
		var style = component.getStyles();
		var ns = style.getNameSpace();
		var compId = style.getId();
		var mnuCompId = component.getComponentId();
		var secClass = style.getClassName();
		var tabLink = component.getLink();
		var loc = component.getCriterion().static_content;
		var tglCode = (!component.isAlwaysExpanded()) ? ["<span class='", style.getHeaderToggle(), "' title='", i18nCore.HIDE_SECTION, "'>-</span>"].join("") : "";
		var menuHTML = "";
		var sDisplayName = "";
		var sSectionName = "";
		var sBandName = "";
		var sItemName = "";

		if (!component.isExpanded() && !component.isAlwaysExpanded())
			secClass += " closed";

		if (disableMenu) {
			if (component.getHasActionsMenu()) {
				menuHTML = ["<span class='opts-menu menu-hide' id='mainCompMenu", compId, "'>&nbsp;</span>"].join("");
			}
		}
		else {
			menuHTML = ["<span class='opts-menu menu-hide' id='mainCompMenu", compId, "'>&nbsp;</span>"].join("");
		}

		var sAnchor = (tabLink != "" && component.getCustomizeView() == false) ? CreateComponentAnchor(component) : component.getLabel();
		ar.push("<div id='", style.getId(), "' class='", secClass, "'>", "<h2 class='", style.getHeaderClass(), "'>", tglCode, menuHTML, "<span class='", style.getTitle(), "'><span>", sAnchor, "</span>");

		if (component.getCustomizeView() == false) {
			ar.push("<span class='", style.getTotal(), "'>", i18nCore.LOADING_DATA + "...", "</span></span>");
			if (component.isPlusAddEnabled()) {
				if (component.isIViewAdd() === false) {
					ar.push("<a id='", ns, "Add' class='add-plus' onclick='MP_Util.OpenIView(\"", compId, "\"); return false;' href='#'><span class='add-icon'>&nbsp;</span><span class='add-text'>", i18nCore.ADD, "</span></a>");
				}
				else {
					ar.push("<a id='", ns, "Add' class='add-plus' onclick='MP_Util.OpenTab(\"", compId, "\"); return false;' href='#'><span class='add-icon'>&nbsp;</span><span class='add-text'>", i18nCore.ADD, "</span></a>");
				}
				var menuItems = component.getMenuItems();
				var iViewItems = component.getIViewMenuItems();
				if (menuItems != null || menuItems > 0) {
					var menuId = compId + "Menu";
					ar.push("<a id='", ns, "Drop' class='drop-Down'><img src='", loc, "/images/3943_16.gif' onclick='javascript:MP_Util.LaunchMenu(\"", menuId, "\", \"", compId, "\");'></a>");
					ar.push("<div class='form-menu menu-hide' id='", menuId, "'><span>");
					for (var x = 0, xl = menuItems.length; x < xl; x++) {
						var item = menuItems[x];
						ar.push("<div>")
						ar.push("<a id='lnkID", x, "' href='#' onclick='javascript:MP_Util.LaunchMenuSelection(\"", compId, '\",', item.getId(), ");'>", item.getDescription(), "</a>")
						ar.push("</div>")
					}
					if (iViewItems) {
						ar.push("<hr class='opts-iview-sec-divider'></>");
						for (var x = 0, xl = iViewItems.length; x < xl; x++) {
							var item = iViewItems[x];
							//Check for value_type_flag of 1 to set band name
							var itemValTypeFlag = item.getValTypeFlag();
							if (itemValTypeFlag === 1) {
								sDisplayName = item.getDescription();
								sBandName = sDisplayName.toLowerCase();
								sDisplayName = sDisplayName.replace(/'/g, "");
								sSectionName = "";
								sItemName = "";
								//loop through again for match on value_seq
								for (var y = 0, yl = iViewItems.length; y < yl; y++) {
									var secItem = iViewItems[y];
									if (secItem.getValSequence() === item.getValSequence()) {
										//Check for value_type_flag of 2 to set section name
										if (secItem.getValTypeFlag() === 2) {
											sSectionName = secItem.getDescription();
											//Check for value_type_flag of 3 to set item name
										}
										else if (secItem.getValTypeFlag() === 3) {
											sItemName = secItem.getDescription();
										}
									}
								}
								ar.push("<div><a id='lnkID", x, "' href='#' onclick='MP_Util.LaunchIViewMenuSelection(\"", mnuCompId, '\",\"', sBandName, '\",\"', sSectionName, '\",\"', sItemName, "\");  return false;'>", sDisplayName, "</a></div>");
							}
						}
					}
					ar.push("</span></div>");
				}
				else if (iViewItems) {
					var menuId = compId + "Menu";
					ar.push("<a id='", ns, "Drop' class='drop-Down'><img src='", loc, "/images/3943_16.gif' onclick='javascript:MP_Util.LaunchMenu(\"", menuId, "\", \"", compId, "\");'></a>");
					ar.push("<div class='form-menu menu-hide' id='", menuId, "'><span>");
					for (var x = 0, xl = iViewItems.length; x < xl; x++) {
						var item = iViewItems[x];
						//Check for value_type_flag of 1 to set band name
						var itemValTypeFlag = item.getValTypeFlag();
						if (itemValTypeFlag === 1) {
							sDisplayName = item.getDescription();
							sBandName = sDisplayName.toLowerCase();
							sDisplayName = sDisplayName.replace(/'/g, "");
							sSectionName = "";
							sItemName = "";
							//loop through again for match on value_seq
							for (var y = 0, yl = iViewItems.length; y < yl; y++) {
								var secItem = iViewItems[y];
								if (secItem.getValSequence() === item.getValSequence()) {
									//Check for value_type_flag of 2 to set section name
									if (secItem.getValTypeFlag() === 2) {
										sSectionName = secItem.getDescription();
										//Check for value_type_flag of 3 to set item name
									}
									else if (secItem.getValTypeFlag() === 3) {
										sItemName = secItem.getDescription();
									}
								}
							}
							ar.push("<div><a id='lnkID", x, "' href='#' onclick='MP_Util.LaunchIViewMenuSelection(\"", mnuCompId, '\",\"', sBandName, '\",\"', sSectionName, '\",\"', sItemName, "\");  return false;'>", sDisplayName, "</a></div>");
						}
					}
					ar.push("</span></div>");
				}
			}
		}
		else {
			ar.push("</span>");
		}
		ar.push("</h2>")
		if (component.getCustomizeView() == false) {
			var scope = component.getScope();
			if (scope === 3) {//specifically to display a custom subheader
				ar.push(component.getScopeHTML());
			}
			else if (scope > 0) {
				var lbMenuItems = component.getLookbackMenuItems();
				if (lbMenuItems) {
					component.setLookBackDropDown(true);
				}
				else {
					component.setLookBackDropDown(false);
				}

				if (component.m_grouper_arr.length === 0) {
					component.setCompFilters(false);
				}
				else {
					component.setCompFilters(true);
				}

				ar.push(MP_Util.Doc.CreateLookBackMenu(component, 1, ""));
			}
		}
		ar.push("<div id='", style.getContentId(), "' class='", style.getContentClass(), "'></div>");
		var footerText = component.getFooterText();
		if (footerText && footerText !== "") {
			ar.push("<div class=sec-footer>", footerText, "</div>");
		}
		ar.push("</div>");
		var arHtml = ar.join("");
		return arHtml;
	}

	function CreateSubTitleText(component) {
		var i18nCore = i18n.discernabu;
		var subTitleText = "";
		var scope = component.getScope();
		var lookbackDays = component.getLookbackDays();
		var lookbackUnits = (lookbackDays > 0) ? lookbackDays : component.getLookbackUnits();
		var lookbackFlag = (lookbackDays > 0) ? 2 : component.getLookbackUnitTypeFlag();

		if (scope > 0) {
			if (lookbackFlag > 0 && lookbackUnits > 0) {
				var replaceText = "";
				switch(lookbackFlag) {
					case 1:
						replaceText = i18nCore.LAST_N_HOURS.replace("{0}", lookbackUnits);
						break;
					case 2:
						replaceText = i18nCore.LAST_N_DAYS.replace("{0}", lookbackUnits);
						break;
					case 3:
						replaceText = i18nCore.LAST_N_WEEKS.replace("{0}", lookbackUnits);
						break;
					case 4:
						replaceText = i18nCore.LAST_N_MONTHS.replace("{0}", lookbackUnits);
						break;
					case 5:
						replaceText = i18nCore.LAST_N_YEARS.replace("{0}", lookbackUnits);
						break;
				}

				switch(scope) {
					case 1:
						subTitleText = i18nCore.ALL_N_VISITS.replace("{0}", replaceText);
						break;
					case 2:
						subTitleText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
						break;
				}

			}
			else {
				switch(scope) {
					case 1:
						subTitleText = i18nCore.All_VISITS;
						break;
					case 2:
						subTitleText = i18nCore.SELECTED_VISIT;
						break;
				}
			}
		}
		return subTitleText;
	}

	function CreateComponentAnchor(component) {
		var i18nCore = i18n.discernabu;
		var style = component.getStyles();
		var criterion = component.getCriterion();
		var sParms = 'javascript:APPLINK(0,"' + criterion.executable + '","/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + component.getLink() + '^"); return false;';
		var sAnchor = "<a id=" + style.getLink() + " title='" + i18nCore.GO_TO_TAB.replace("{0}", component.getLink()) + "' href='#' onclick='" + sParms + "'>" + component.getLabel() + "</a>";
		return sAnchor;
	}

	function LoadPageSelector(items, bodyTag, lastSavedView, criterion) {
		var i18nCore = i18n.discernabu;
		var activeInd;
		var ar = [];
		var divAr = [];
		var pageKey = "-1";
		var pageCtrl = _g('pageCtrl' + criterion.category_mean);
		var isViewpoint = ( typeof m_viewpointJSON == "undefined") ? false : true;
		var selectorClass = "qoc-view-selector";
		if (lastSavedView) {
			var lastSavedViewFound = false;
			var i = items.length;
			while (i--) {
				if (items[i].name == lastSavedView) {
					window.name = items[i].key + ",'a-tab'" + i;
					pageKey = items[i].key;
					lastSavedViewFound = true;
					break;
				}
			}

			if (lastSavedViewFound) {
				if (!isViewpoint) {
					selectorClass = selectorClass + " no-viewpoint";
				}
					ar.push("<span class='", selectorClass, "'><span class='qoc-view-list-label'>", i18nCore.VIEW_SELECTOR, ":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,false)>");
				for (var x = 0, xl = items.length; x < xl; x++) {
					var item = items[x];
					if (item.key == pageKey) {
						activeInd = 1;
					}
					else {
						activeInd = 0;
					}
					ar.push("<option value='", item.key, "'", (activeInd == 1) ? " selected='selected'" : "", ">", item.name, "</option>");
					divAr.push("<div id='", item.key, "' class='div-tab-item", (activeInd == 1) ? " div-tab-item-selected" : " div-tab-item-not-selected", "'></div>");
				}
				ar.push("</select></span>");

				pageCtrl.innerHTML = ar.join("") + pageCtrl.innerHTML;
				bodyTag.innerHTML += divAr.join("");
			}
			else {
				if(!isViewpoint){
					selectorClass = selectorClass + " no-viewpoint";
				}
				ar.push("<span id='noSavedViews' class='qoc-no-saved-view'>", i18nCore.VIEW_NOT_SELECTED, "</span>");
				ar.push("<span class='", selectorClass, "'><span class='qoc-view-list-label'>", i18nCore.VIEW_SELECTOR, ":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)>");
				for (var x = 0, xl = items.length; x < xl; x++) {
					var item = items[x];
					ar.push("<option value='", item.key, "'>", item.name, "</option>");
					divAr.push("<div id='", item.key, "' class='div-tab-item div-tab-item-not-selected'></div>");
				}
				ar.push("<option value='Blank_Space' selected='selected'></option>");
				divAr.push("<div id='Blank_Space' class='div-tab-item div-tab-item-selected'></div>");
				ar.push("</select></span>");

				pageCtrl.innerHTML = ar.join("") + pageCtrl.innerHTML;
				bodyTag.innerHTML += divAr.join("");
				window.name = "QOC_PAGE_TAB_" + items.length + ",'a-tab'" + items.length;
			}
		}
		else {
			if(!isViewpoint){
				selectorClass = selectorClass + " no-viewpoint";
			}
			ar.push("<span id='noSavedViews' class='qoc-no-saved-view'>", i18nCore.VIEW_NOT_SELECTED, "</span>");
			ar.push("<span class='", selectorClass, "'><span class='qoc-view-list-label'>", i18nCore.VIEW_SELECTOR, ":</span><select id='viewListSelectorID' class='qoc-view-list' onchange=MP_Util.DisplaySelectedTabQOC(this.options[this.selectedIndex].value,'a-tab'+this.selectedIndex,true)>");
			for (var x = 0, xl = items.length; x < xl; x++) {
				var item = items[x];
				ar.push("<option value='", item.key, "'>", item.name, "</option>");
				divAr.push("<div id='", item.key, "' class='div-tab-item div-tab-item-not-selected'></div>");
			}
			ar.push("<option value='Blank_Space' selected='selected'></option>");
			divAr.push("<div id='Blank_Space' class='div-tab-item div-tab-item-selected'></div>");
			ar.push("</select></span>");

			pageCtrl.innerHTML = ar.join("") + pageCtrl.innerHTML;
			bodyTag.innerHTML += divAr.join("");
			window.name = "QOC_PAGE_TAB_" + items.length + ",'a-tab'" + items.length;
		}
	}

	function AddPageTabs(items, bodyTag) {
		var ar = [];
		var divAr = [];
		if (bodyTag == null)
			bodyTag = document.body;
		//first create unordered list for page level tabs
		ar.push("<ul class=tabmenu>")
		for (var x = 0, xl = items.length; x < xl; x++) {
			var item = items[x];
			var activeInd = (x == 0) ? 1 : 0;
			ar.push(CreateTabLi(item, activeInd, x))
			divAr.push("<div id='", item.key, "' class='div-tab-item'></div>");
		}
		ar.push("</ul>")
		bodyTag.innerHTML += (ar.join("") + divAr.join(""));
	}

	function CreateTabLi(item, activeInd, sequence) {
		var ar = [];
		var tabName = "";
		tabName = item.name;
		ar.push("<li>")
		var seqClass = "a-tab" + sequence;
		if (activeInd)
			ar.push("<a id='", seqClass, "' class='anchor-tab-item active' href='#' onclick='javascript:MP_Util.DisplaySelectedTab(\"", item.key, "\",\"", seqClass, "\");return false;'>", tabName, "</a>");
		else
			ar.push("<a id='", seqClass, "' class='anchor-tab-item inactive' href='#' onclick='javascript:MP_Util.DisplaySelectedTab(\"", item.key, "\",\"", seqClass, "\");return false;'>", tabName, "</a>");
		ar.push("</li>")
		return (ar.join(""));
	}

}();

/**
 * @namespace
 */
MP_Util.Measurement = function() {
	var m_nf = null;
	return {
		GetString: function(result, codeArray, dateMask, excludeUOM) {
			var obj = ( result instanceof MP_Core.Measurement) ? result.getResult() : MP_Util.Measurement.GetObject(result, codeArray);
			if ( obj instanceof MP_Core.QuantityValue) {
				if (excludeUOM) {
					return obj.getValue();
				}
				return obj.toString();
			}
			else if ( obj instanceof Date) {
				return obj.format(dateMask);
			}
			return obj;
		},
		GetObject: function(result, codeArray) {
			switch (result.CLASSIFICATION.toUpperCase()) {
				case "QUANTITY_VALUE":
					return GetQuantityValue(result, codeArray);
				case "STRING_VALUE":
					return (GetStringValue(result));
				case "DATE_VALUE":
					//we are currently not returning any date_value results. a common method shall be implemented if/when necessary
					return (GetDateValue(result));
				case "CODIFIED_VALUES":
				case "CODE_VALUE":
					return (GetCodedResult(result));
				case "ENCAPSULATED_VALUE":
					return (GetEncapsulatedValue(result));
			}
		},
		/**
		 * @param {Object} num Numeric to format
		 * @param {Object} dec Number of decimal places to retain.
		 * @deprecated Use mp_formatter.NumericFormatter.
		 */
		SetPrecision: function(num, dec) {
			var nf = MP_Util.GetNumericFormatter();
			//'^' to not comma seperate values, and '.' for defining the precision
			return nf.format(num, "^." + dec);
		},
		GetModifiedIcon: function(result) {
			return (result.isModified()) ? "<span class='res-modified'>&nbsp;</span>" : "";
		},
		GetNormalcyClass: function(oMeasurement) {
			var normalcy = "res-normal";
			var nc = oMeasurement.getNormalcy()
			if (nc != null) {
				var normalcyMeaning = nc.meaning;
				if (normalcyMeaning != null) {
					if (normalcyMeaning === "LOW") {
						normalcy = "res-low";
					}
					else if (normalcyMeaning === "HIGH") {
						normalcy = "res-high";
					}
					else if (normalcyMeaning === "CRITICAL" || normalcyMeaning === "EXTREMEHIGH" || normalcyMeaning === "PANICHIGH" || normalcyMeaning === "EXTREMELOW" || normalcyMeaning === "PANICLOW" || normalcyMeaning === "VABNORMAL" || normalcyMeaning === "POSITIVE") {
						normalcy = "res-severe";
					}
					else if (normalcyMeaning === "ABNORMAL") {
						normalcy = "res-abnormal";
					}
				}
			}
			return normalcy;
		},
		GetNormalcyResultDisplay: function(oMeasurement, excludeUOM) {
			var ar = ["<span class='", MP_Util.Measurement.GetNormalcyClass(oMeasurement), "'><span class='res-ind'>&nbsp;</span><span class='res-value'>", GetEventViewerLink(oMeasurement, MP_Util.Measurement.GetString(oMeasurement, null, "longDateTime2", excludeUOM)), "</span>", MP_Util.Measurement.GetModifiedIcon(oMeasurement), "</span>"];
			return ar.join("");
		}
	};
	function GetEventViewerLink(oMeasurement, sResultDisplay) {
		var params = [oMeasurement.getPersonId(), oMeasurement.getEncntrId(), oMeasurement.getEventId(), "\"EVENT\""];
		var ar = ["<a onclick='MP_Util.LaunchClinNoteViewer(", params.join(","), "); return false;' href='#'>", sResultDisplay, "</a>"];
		return ar.join("");
	}

	function GetEncapsulatedValue(result) {
		var ar = [];
		var encap = result.ENCAPSULATED_VALUE;
		if (encap && encap.length > 0) {
			for (var n = 0, nl = encap.length; n < nl; n++) {
				var txt = encap[n].TEXT_PLAIN;
				if (txt != null && txt.length > 0)
					ar.push(txt);
			}
		}
		return ar.join("");
	}

	function GetQuantityValue(result, codeArray) {
		var qv = new MP_Core.QuantityValue();
		qv.init(result, codeArray);
		return qv;
	}

	function GetDateValue(result) {
		for (var x = 0, xl = result.DATE_VALUE.length; x < xl; x++) {
			var date = result.DATE_VALUE[x];
			if (date.DATE != "") {
				var dateTime = new Date();
				dateTime.setISO8601(date.DATE);
				return dateTime;
			}
		}
		return null;
	}

	function GetCodedResult(result) {
		var cdValue = result.CODE_VALUE;
		var ar = [];
		for (var n = 0, nl = cdValue.length; n < nl; n++) {
			var values = cdValue[n].VALUES;
			for (var p = 0, pl = values.length; p < pl; p++) {
				ar.push(values[p].SOURCE_STRING)
			}
			var sOther = cdValue[n].OTHER_RESPONSE;
			if (sOther != "")
				ar.push(sOther)
		}
		return ar.join(", ");
	}

	function GetStringValue(result) {
		var strValue = result.STRING_VALUE;
		var ar = [];
		for (var n = 0, nl = strValue.length; n < nl; n++) {
			ar.push(strValue[n].VALUE);
		}
		return ar.join(", ");
	}

}();
/**
 * Returns an array of elements with the designated classname.
 * @param {Object} cl The CSS classname.
 * @param {Object} e The parent element to search within, defaults to document.
 * @return {Array} Returns an array of elements with the designated classname.
 * @deprecated
 */
document.getElementsByClassName = function(cl, e) {
	var retnode = [];
	var clssnm = new RegExp('\\b' + cl + '\\b');
	var elem = this.getElementsByTagName('*', e);
	for (var u = 0; u < elem.length; u++) {
		var classes = elem[u].className;
		if (clssnm.test(classes)) {
			retnode.push(elem[u]);
		}
	}
	return retnode;
};

/* Listener Event Class */
/*
* Copyright (c) 2007 	Josh Davis ( http://joshdavis.wordpress.com )
*
* Licensed under the MIT License ( http://www.opensource.org/licenses/mit-license.php ) as follows:
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
*/
/**
 * Binds a function to the given object's scope
 *
 * @param {Object} object The object to bind the function to.
 * @return {Function}	Returns the function bound to the object's scope.
 */
Function.prototype.bind = function(object) {
	var method = this;
	return function() {
		return method.apply(object, arguments);
	};
};

/**
 * Create a new instance of Event.
 *
 * @classDescription	This class creates a new Event.
 * @return {Object}	Returns a new Event object.
 * @constructor
 */
function EventListener() {
	this.events = [];
	this.builtinEvts = [];
}

/**
 * Gets the index of the given action for the element
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {Number} Returns an integer.
 */
EventListener.prototype.getActionIdx = function(obj, evt, action, binding) {
	if (obj && evt) {

		var curel = this.events[obj][evt];
		if (curel) {
			var len = curel.length;
			for (var i = len - 1; i >= 0; i--) {
				if (curel[i].action == action && curel[i].binding == binding) {
					return i;
				}
			}
		}
		else {
			return -1;
		}
	}
	return -1;
};

/**
 * Adds a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
EventListener.prototype.addListener = function(obj, evt, action, binding) {
	if (this.events[obj]) {
		if (this.events[obj][evt]) {
			if (this.getActionIdx(obj, evt, action, binding) == -1) {
				var curevt = this.events[obj][evt];
				curevt[curevt.length] = {
					action: action,
					binding: binding
				};
			}
		}
		else {
			this.events[obj][evt] = [];
			this.events[obj][evt][0] = {
				action: action,
				binding: binding
			};
		}
	}
	else {
		this.events[obj] = [];
		this.events[obj][evt] = [];
		this.events[obj][evt][0] = {
			action: action,
			binding: binding
		};
	}
};

/**
 * Removes a listener
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Function} action The action to execute upon the event firing.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
EventListener.prototype.removeListener = function(obj, evt, action, binding) {
	if (this.events[obj]) {
		if (this.events[obj][evt]) {
			var idx = this.getActionIdx(obj, evt, action, binding);
			if (idx >= 0) {
				this.events[obj][evt].splice(idx, 1);
			}
		}
	}
};
/**
 * Removes all listeners for a given object with given binding
 *
 * @memberOf Event
 * @param {Object} obj The element attached to the action.
 * @param {Object} binding The object to scope the action to.
 * @return {null} Returns null.
 */
EventListener.prototype.removeAllListeners = function(obj, binding) {
	if (this.events[obj]) {
		for (var el = this.events[obj].length; el--; ) {
			if (this.events[obj][el]) {
				for (var ev = this.events[obj][el].length; ev--; ) {
					if (this.events[obj][el][ev].binding == binding) {
						this.events[obj][el].splice(ev, 1);
					}
				}
			}
		}
	}
};

/**
 * Fires an event
 *
 * @memberOf Event
 * @param e [(event)] A builtin event passthrough
 * @param {Object} obj The element attached to the action.
 * @param {String} evt The name of the event.
 * @param {Object} args The argument attached to the event.
 * @return {null} Returns null.
 */
EventListener.prototype.fireEvent = function(e, obj, evt, args) {
	if (!e) {
		e = window.event;
	}

	if (obj && this.events) {
		var evtel = this.events[obj];
		if (evtel) {
			var curel = evtel[evt];
			if (curel) {
				for (var act = curel.length; act--; ) {
					var action = curel[act].action;
					if (curel[act].binding) {
						action = action.bind(curel[act].binding);
					}
					action(e, args);
				}
			}
		}
	}
};
CERN_EventListener = new EventListener();

//Constants for event Listener
EventListener.EVENT_CLINICAL_EVENT = 1;
EventListener.EVENT_ORDER_ACTION = 2;
EventListener.EVENT_ADD_DOC = 3;
EventListener.EVENT_PREGNANCY_EVENT = 4;
EventListener.EVENT_COMP_CUSTOMIZE = 5;
EventListener.EVENT_COUNT_UPDATE = 6;
EventListener.EVENT_CRITICAL_UPDATE = 7;
EventListener.EVENT_ERROR_UPDATE = 8;
EventListener.EVENT_SCRATCHPAD_COUNT_UPDATE = 9;
EventListener.EVENT_SCRATCHPAD_UPDATES_COMPONENT = 10; 
