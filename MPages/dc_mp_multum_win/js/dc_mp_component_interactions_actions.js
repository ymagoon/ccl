// Specify Component Methods
var InteractionsActionsComp = function(meaning){
    /**
     * NOTE: self.meaning, self.load, self.loadJsonData are REQUIRED for the component to load properly.
     * 		 Additional methods may be declared  to fill out the content inside the component
     * 		 self.dataListener is required if this component is expected to be called from another component
     */
    // self preserves the reference to the component instance
    var m_jsonUtil = new UtilJsonXml();
    var m_overrideReasons = [];
    var self = this;
    self.meaning = meaning;
    self.defaultLoad = true;
    
    var eInteractionCheckingFailure = 0
    var eInteractionCheckingFailureButUserContinues = 1
    var eInteractionCheckingSuccessNoAlerts = 2
    var eInteractionCheckingSuccessAlertsWithInterrupt = 3
    var eInteractionCheckingSuccessAlertsWithNoInterrupt = 4
    var eRemoveNewOrder = 5
    var eStopOrderAction = 6
    
    var m_RequiredOverrides = 0;
    var m_alertData = null;
    self.load = function(criterion){
        self.setCriterion(criterion);
        //Page will have m_AlertData ready for use	
        var jsonAlertData = m_jsonUtil.parse_json(m_AlertDataJSON);
        self.loadJsonData(jsonAlertData);
    };
    
    self.loadJsonData = function(jsonData){
    
        var alertData = jsonData.ALERTDATA;
		var m_alertData = jsonData.ALERTDATA;
        var contentHTML = [];
        var contDisabled = "";
        m_overrideReasons = alertData.OVERRIDE_ALL;
        m_RequiredOverrides = getRequiredOverrideCount(alertData);
        
        if (m_RequiredOverrides > 0) {
            //text for attribute of continue button
            contDisabled = "disabled = disabled";
        }
        
        // finishedLoading called to clear out any existing loading indicators..rft
        self.finishedLoading();
        // clear any existing content
        self.clearContentHTML();
        
		// append content HTML
		if (alertData.IS_DISPLAY_ONLY == 1) {
			contentHTML.push("<div class='inter-simple-box'><div class='inter-continue'>", "<input id='inter-continue' type='submit' value='Continue' /></div>"
							,"<span class='inter-pat-info'>", jsonData.ALERTDATA.PERSON_NAME, " - ", jsonData.ALERTDATA.PERSON_MRN, "</span></div>")
		}
		else {
			contentHTML.push("<div class='inter-apply-box'>", "<div class='inter-apply-or'><span>Override Reason</span>", buildOverrideDropDown(), "</div>", "<div class='inter-apply-opt'>", "<div><input id='applyToAll' checked='checked' type='radio' value='apply-to-all' name='apply-to-all' /> <label for='apply-to-all'>Apply to all interactions</label></div>", "<div><input id='applyToReq' type='radio' value='apply-to-req' name='apply-to-all' /> <label for='apply-to-all'>Apply only to required interactions</label></div>", "<div><input id='applytoSel' type='radio' value='apply-to-sel' name='apply-to-all' /> <label for='apply-to-all'>Apply only to selected</label></div>", "</div>", "</div>", "<div style='clear:both;'></div>", "<div class='inter-continue'>", "<div class='inter-continue'>", "<input id='inter-continue' type='submit' value='Continue' ", contDisabled, " />", "<input id='removeNewOrder' type='submit' value='Remove New Order' /><br/>", "</div>", "<span class='inter-pat-info'>", jsonData.ALERTDATA.PERSON_NAME, " - ", jsonData.ALERTDATA.PERSON_MRN, "</span>", "</div>");
		}
        self.appendContentHTML(contentHTML.join(""));
        
        
        self.onDOMLoad.push(setupHighlightRows);
		if (alertData.IS_DISPLAY_ONLY != 1) {
			self.onDOMLoad.push(adjustOverrideCounts);
		}
        self.onDOMLoad.push(setupButtonLinks);
        self.onDOMLoad.push(attachInteractionInformation);
        self.onDOMLoad.push(attachHovers);
		self.onDOMLoad.push(hideConfidentialInfo);
        
        
    }
    
    var setupButtonLinks = function(){
        var contButton = _g("inter-continue");
        var removeOrderButton = _g("removeNewOrder");
        
        var applyToAllRadio = _g("applyToAll");
        var applyToReqRadio = _g("applyToReq");
        var applyToSelRadio = _g("applyToSel");
        
        var masterOrSelect = _g('masterOr');
        
        if (contButton) {
            contButton.onclick = function(){
                continueNormally(this);
            };
        }
        
        if (removeOrderButton) {
            removeOrderButton.onclick = function(){
                continueWithRemove(this);
            };
        }
        
        
        if (masterOrSelect) {
            masterOrSelect.onchange = function(){
                applyOverrideReasons(this);
            }
        }
        
        
        //Setup Reference links
        var refTags = Util.Style.g("inter-ref", document.body, "a");
        if (refTags) {
            for (var i = refTags.length; i--;) {
                var dataSib = Util.gc(refTags[i]);
                var params = dataSib.innerHTML;
                var paramsArry = params.split("|");
                var orderCki = paramsArry[0];
                var orderId = parseInt(paramsArry[1], 10)
                var orderName = paramsArry[2];
				var catalogCd = parseInt(paramsArry[3], 10);
				var personId = parseInt(paramsArry[4], 10);
				var encounterId = parseInt(paramsArry[5], 10);
                refTags[i].href = "javascript:CCLNEWSESSIONWINDOW('" + m_StaticContentLoc + "\\html\\dc_mp_multum_ref.html?" + orderCki + "," + orderId + "," + orderName + "," + catalogCd + "," + personId + ","+ encounterId + "','_blank','height=700,width=800',1,1);";
            }
        }
        
        //Setup Allergy links
        var algSpans = Util.Style.g("int-alg-ref", document.body, "a");
        if (algSpans) {
            var criterion = self.getCriterion();
            for (var i = algSpans.length; i--;) {
                var dataSib = Util.gc(algSpans[i]);
                var allergyId = parseInt(dataSib.innerHTML, 10) + ".0";
                algSpans[i].href = "javascript:MPAGES_EVENT('ALLERGY', '" + criterion.person_id + "|" + criterion.encounter_id + "|" + allergyId + "|0|||0||69|1');";
            }
        }
        
        //Setup action to keep track of overrides
        var overrideSelects = Util.Style.g("inter-or-reason", document.body, "select");
        if (overrideSelects) {
            for (var i = overrideSelects.length; i--;) {
                if (Util.Style.ccss(overrideSelects[i], "inter-or-required")) {
                    overrideSelects[i].onchange = function(){
                        handleRequiredOverrideCount(this);
                    }
                }
            }
        }
        
        
        
    }
    
    var setupHighlightRows = function(){
    
        $(".sec-content .inter-sev-res").click(function(){
            if (!$(this).parent().hasClass('hdr')) {
                $(this).parent().toggleClass("highlight");
				if($(this).hasClass('alg')){
					$(this).parent().next().toggleClass("highlight");
				}
            }
        })
        
    }
    
    var adjustOverrideCounts = function(){
    
        var overrideSelects = Util.Style.g("inter-or-reason", document.body, "select");
        
        for (var i = overrideSelects.length; i--;) {
            if (overrideSelects[i].selectedIndex > 0 ) {
                //Add or-checked class and adjust count
                Util.Style.acss(overrideSelects[i], "or-checked");
                m_RequiredOverrides--;
                if (m_RequiredOverrides == 0) {
                    _g("inter-continue").disabled = "";
                }
            }
        }
        
    }
    
    var handleRequiredOverrideCount = function(selectElem){
        if (Util.Style.ccss(selectElem, "inter-or-required")) {
            if (selectElem.selectedIndex > 0) {
                if (!Util.Style.ccss(selectElem, "or-checked")) {
                    m_RequiredOverrides = m_RequiredOverrides - 1;
                    if (m_RequiredOverrides == 0) {
                        _g("inter-continue").disabled = "";
                        _g("inter-continue").focus();
                    }
                    Util.Style.acss(selectElem, "or-checked");
                }
            }
            else 
                if (selectElem.selectedIndex == 0) {
                    if (Util.Style.ccss(selectElem, "or-checked")) {
                        Util.Style.rcss(selectElem, "or-checked");
                        if (m_RequiredOverrides == 0) {
                            _g("inter-continue").disabled = "disabled";
                        }
                        m_RequiredOverrides++;
                    }
                }
        }
        
    }
    
    function continueNormally(buttonElem){
        updateOverrideReasons();
        var formObject = window.external.DiscernObjectFactory("DISCERNMULTUMCOM");
        formObject.DiscernCloseViewerWithStatus(eInteractionCheckingSuccessAlertsWithInterrupt);
        
    }
    
    function continueWithRemove(buttonElem){
        updateOverrideReasons();
        var formObject = window.external.DiscernObjectFactory("DISCERNMULTUMCOM");
        formObject.DiscernCloseViewerWithStatus(eRemoveNewOrder);
    }
    
    function applyOverrideReasons(masterOrSelect){
        var applyToAllRadio = _g("applyToAll").checked;
        var applyToReqRadio = _g("applyToReq").checked;
        var applyToSelRadio = _g("applyToSel").checked;
        //First grab selected reason
        //var masterOrSelect = _g('masterOr');
        if (masterOrSelect) {
            var selectedIdx = masterOrSelect.selectedIndex;
            var selectedCd = masterOrSelect.options[selectedIdx].value;
            if (applyToAllRadio) {
                var overrideSelects = Util.Style.g("inter-or-reason", document.body, "select");
                for (var i = overrideSelects.length; i--;) {
                    for (var j = overrideSelects[i].options.length; j--;) {
                        if (overrideSelects[i].options[j].value.split("|")[2] == selectedCd) {
                            overrideSelects[i].options[j].selected = "selected"
                            handleRequiredOverrideCount(overrideSelects[i]);
                        }
                    }
                }
            }
            else 
                if (applyToReqRadio) {
                    var overrideSelects = Util.Style.g("inter-or-reason", document.body, "select");
                    for (var i = overrideSelects.length; i--;) {
                        if (Util.Style.ccss(overrideSelects[i], "inter-or-required")) {
                            for (var j = overrideSelects[i].options.length; j--;) {
                                if (overrideSelects[i].options[j].value.split("|")[2] == selectedCd) {
                                    overrideSelects[i].options[j].selected = "selected"
                                    handleRequiredOverrideCount(overrideSelects[i]);
                                }
                            }
                        }
                    }
                }
                else 
                
                
                if (applyToSelRadio) {
                    var interactionDLs = Util.Style.g("highlight", document.body, "DL");
                    for (var i = interactionDLs.length; i--;) {
                        var overrideSelects = Util.Style.g("inter-or-reason", interactionDLs[i], "select");
						for (var k = overrideSelects.length; k--;) {
							if (overrideSelects[k].length > 0) {
								for (var j = overrideSelects[k].options.length; j--;) {
									if (overrideSelects[k].options[j].value.split("|")[2] == selectedCd) {
										overrideSelects[k].options[j].selected = "selected"
										handleRequiredOverrideCount(overrideSelects[k]);
									}
								}
							}
						}
                    }
                }
        }
        
    }
    
    function buildOverrideDropDown(qualifier){
    
        var orHtml = ["<select id='masterOr' class='inter-or-reason '>"]
        //Add blank one
        orHtml.push("<option>&nbsp;</option>");
        for (var i = 0, il = m_overrideReasons.length; i < il; i++) {
            orHtml.push("<option value='",m_overrideReasons[i].REASON_CD,"' >", m_overrideReasons[i].REASON_DISP, "</option>");
        }
        orHtml.push("</select>");
        
        return orHtml.join("");
    }
    
    function getRequiredOverrideCount(alertData){
        var interactions = alertData.INTERACTIONS;
        var requiredIntCount = 0;
        for (var i = interactions.length; i--;) {
            if (interactions[i].IS_OVERRIDE_REQUIRED && (interactions[i].ADDITIONAL_INFO != "INTFILTERED")) {
                requiredIntCount++;
            }
        }
        return (requiredIntCount);
    }
    
    function attachInteractionInformation(){
        // var interactionInfo = "<p>CONTRAINDICATED:  Quinolones such as ciprofloxacin, gatifloxacin, gemifloxacin, levofloxacin, lomefloxacin, moxifloxacin, norfloxacin, ofloxacin, and sparfloxacin may cause dose-related prolongation of the QT interval in some patients.  Coadministration with other agents that can prolong the QT interval may result in elevated risk of ventricular arrhythmias, including ventricular tachycardia and torsade de pointes, because of additive arrhythmogenic potential related to their effects on cardiac conduction.  Torsade de pointes have been reported in a few patients receiving sparfloxacin alone and with antiarrhythmic agents like amiodarone and disopyramide.  There have also been isolated case reports of clinically significant interactions with sotalol, a class III antiarrhythmic agent, for both gatifloxacin and moxifloxacin.  Ciprofloxacin, levofloxacin, lomefloxacin, norfloxacin, and ofloxacin alone have been associated with extremely rare cases of torsade de pointes and ventricular tachycardia. </p><br/><p>MANAGEMENT:  Product labeling for certain quinolones recommends avoiding concomitant therapy with class IA (e.g., disopyramide, quinidine, procainamide) and class III (e.g., amiodarone, dofetilide, ibutilide, sotalol) antiarrhythmic agents, as well as bepridil.</p>"
        var interactionDiv = null;
        var interactionText = "";
        var interactionInfoSpans = Util.Style.g("inter-info", document.body, "a");
        for (var i = interactionInfoSpans.length; i--;) {
            interactionDiv = null;
            interactionText = "";
            interactionDiv = Util.gns(interactionInfoSpans[i]);
            if (interactionDiv) {
                interactionText = interactionDiv.innerHTML;
            }
            
            UtilPopup.attachModalPopup({
                "elementDOM": interactionInfoSpans[i],
                "event": "click",
                "width": "60.00%",	
                "exit": "x",
                "header": "Interaction Information",
                "content": interactionText
            });
        }
    }
    
    function attachHovers(){
        var detailSpans = Util.Style.g("inter-order-dets", document.body, "span");
        for (var i = detailSpans.length; i--;) {
			detailSpans[i].onmouseover = function(){
				attachOrderDetails(this);
			};
			
        }
    }
	
    function hideConfidentialInfo(){
		//Grab button and setup unhide if found
		var unhideConf = _g('overridePrivacy');
		if(unhideConf){
			unhideConf.onclick = function(){
				var confSpans = Util.Style.g("inter-conf-info", document.body, "span");
				for(var i = confSpans.length; i--;){
					var confSpan = Util.gns(confSpans[i]);
					if (confSpan) {
						Util.de(confSpan);
					}
					confSpans[i].style.display = "block";
				}
			}
		}
		
        var confSpans = Util.Style.g("inter-conf-info", document.body, "span");
        for (var i = confSpans.length; i--;) {
            //Insert node next to current node stating confident
            var confSpan = Util.ce("span");
            confSpan.innerHTML = "Confidential Patient Information."
            Util.ia(confSpan, confSpans[i]);
        }
        
    }
	function attachOrderDetails(detElem){

		if (!Util.Style.ccss(detElem, "det-checked")) {
			var orderId = 0.0;
			var orderingPhys = "";
			var orderInfo = "";
			var orderInfoArry = [];
			var orderDiv = Util.gns(detElem);
			if (orderDiv) {
				orderInfo = orderDiv.innerHTML;
				orderInfoArry = orderInfo.split("|");
				var orderId = parseInt(orderInfoArry[0], 10);
				if(orderInfoArry.length > 1){
					var orderingPhys = orderInfoArry[1];
				}
				
			}
			var orderDetsHTML = [];
			var info = new XMLCclRequest();
			info.onreadystatechange = function(){
				var errMsg = null;

				if (this.readyState == 4 && this.status == 200) {
					try {
						var jsonParser = new UtilJsonXml();
						var recordData = jsonParser.parse_json(this.responseText).REPORT_DATA;
						if (recordData.STATUS_DATA.STATUS == "Z") {
							orderDetsHTML.push("No Order Details found");
						}
						else 
							if (recordData.STATUS_DATA.STATUS == "S") {
								if(orderingPhys.length > 0){
									orderDetsHTML.push("<span class='inter-add-info-label'> Ordering Personnel: </span>", "<span class='inter-add-info-text'>", orderingPhys, "</span><br/>");
								}
								var detQual = recordData.DETQUAL
								for (var i = 0, il = recordData.DETQUAL_CNT; i < il; i++) {
									orderDetsHTML.push("<span class='inter-add-info-label'>", detQual[i].LABEL_TEXT, ":</span>", "<span class='inter-add-info-text'>", detQual[i].OE_FIELD_DISPLAY_VALUE, "</span><br/>");
								}
								
							}
							else {
								orderDetsHTML.push("Error Retrieving Order Details");
							}
					} 
					catch (err) {
						orderDetsHTML.push("Error OrderDetails");
					}
				}
				else 
					if (this.readyState == 4 && this.status != 200) {
						orderDetsHTML.push("Error Retrieving Reference Text");
					}
			};
			
			info.open('GET', 'inn_get_order_details_json', false);
			info.send("^MINE^," + orderId);
			UtilPopup.attachHover({
				"elementDOM": detElem,
				"event": "mousemove",
				"content": orderDetsHTML.join("")
			});
			//Give class det-checked so this is only done once. 
			Util.Style.acss(detElem, "det-checked");
		}
        
    }
    
    
    
    function updateOverrideReasons(){
        //Grab all the selects
        var overrideSelects = null
        var selectedIdx = 0;
        var orValues = "";
        var orValArry = [];
        var formObject = window.external.DiscernObjectFactory("DISCERNMULTUMCOM");
        var dSubjectId, dCausingId, dReasonCd, sReasonDisp;
        if (null != formObject) {
        	overrideSelects = Util.Style.g("inter-or-reason", document.body, "select");
            for (var i = overrideSelects.length; i--;) {
                if (overrideSelects[i].id != "masterOr") {
                    selectedIdx = overrideSelects[i].selectedIndex;
                    //check if one is selcted 0 is blank
                    if (selectedIdx > 0) {
                        orValue = overrideSelects[i].options[selectedIdx].value;
                        orValArry = orValue.split("|");
                        
                        var dSubjectId = orValArry[0];
                        var dCausingId = orValArry[1];
                        var dReasonCd = orValArry[2];
                        var sReasonDisp = overrideSelects[i].options[selectedIdx].text;
                        formObject.DiscernUpdateOverrideReason(dCausingId, dSubjectId, dReasonCd, sReasonDisp);
                    }
                }
            }
			//Check for hidden/ Blocked
			/*var jsonUtil = new UtilJsonXml();
			var jsonAlertData = jsonUtil.parse_json(m_AlertDataJSON);
			var interactions = jsonAlertData.ALERTDATA.INTERACTIONS;
			for(var i = interactions.length; i--;){
				if(interactions[i].IS_ORDER_HIDDEN && interactions[i].OVERRIDE_REASON_CD > 0){
					var dSubjectId = interactions[i].SUBJECT_ENTITY_ID;
                    var dCausingId = interactions[i].CAUSING_ENTITY_ID;
                    var dReasonCd = interactions[i].OVERRIDE_REASON_CD
                    var sReasonDisp = interactions[i].OVERRIDE_REASON
                    formObject.DiscernUpdateOverrideReason(dCausingId, dSubjectId, dReasonCd, sReasonDisp);
				}
			}*/
			
        }
        else {
            alert("Failed to initialize DISCERNMULTUMCOM!");
        }
    }
    
    
};
// inherit properties of MpageComponent
InteractionsActionsComp.inherits(MpageComponent);
// Register the component to the layout
var InteractionsActions = new InteractionsActionsComp("Interaction-Actions");

MpageDriver.register([{
    "component": InteractionsActions,
    "componentType": "FOOTER"
}]);


