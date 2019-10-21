function DischargeIndicatorComponentStyle(){
    this.initByNamespace("disch");
}

DischargeIndicatorComponentStyle.inherits(ComponentStyle);

function DischargeIndicatorComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new DischargeIndicatorComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.DISCHARGEINDICATOR.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.DISCHARGEINDICATOR.O1 - render component");
    DischargeIndicatorComponent.method("InsertData", function(){
        CERN_DISCH_INDICATOR_O1.GetDischargeIndicatorComponentTable(this);
    });
    DischargeIndicatorComponent.method("HandleSuccess", function(recordData){
        CERN_DISCH_INDICATOR_O1.RenderComponent(this, recordData);
    });
}

DischargeIndicatorComponent.inherits(MPageComponent);

var CERN_DISCH_INDICATOR_O1 = function(){
    var filePath = "";
    
    return {
        GetDischargeIndicatorComponentTable: function(component){
            var criterion = component.getCriterion();
            var sendAr = [];
            var mpageName = component.getMPageName();
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", "^" + criterion.category_mean + "^", + criterion.provider_id + ".0", + criterion.position_cd + ".0", criterion.ppr_cd, 1);
            MP_Core.XMLCclRequestWrapper(component, "MP_GET_DISCH_IND_JSON", sendAr, true);
        },
        
        RenderComponent: function(component, recordData){
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try {
                var compId = component.getComponentId();
                var criterion = component.getCriterion();
                var encntrId = criterion.encntr_id;
                var personId = criterion.person_id;
                var providerId = criterion.provider_id;
                var ar = [], sHTML = "", countText = "", headerString = [], dataRow = [];
                var loc = criterion.static_content;
                filePath = loc;
                var widthClass = 0;
				var imgID = "";
				var comp = null;
				var newIndVal = 0;
				var updtInd = false;
				var compName = "";
				var compContentType = "";
				var compMeaning = "";
				var flg = 0;
				var tdClass = "";
				var icnStr = "";
                var sectionLen = recordData.COMPONENTS.length;
                if (sectionLen > 0) {
                    var numOfCOl = sectionLen + 1;
                    widthClass = 100 / numOfCOl;
                }
                else {
                    widthClass = 100 / 1;
                }
                var dateTime = new Date();
                var estDate = "";
                
                for (var i = 0; i< sectionLen; i++)
                {
	                if (recordData.COMPONENTS[i].CONTENT_TYPE === "disch-readiness") 
	                {
	                	if (recordData.COMPONENTS[i].ESTIMATED_DISCH_DATE)
	                	{
	                		estDate = recordData.COMPONENTS[i].ESTIMATED_DISCH_DATE;
	                    	dateTime.setISO8601(estDate);
	                    	estDate = dateTime.format("shortDate2");
	                	} else {
							estDate = "--";
						}
					}
				}
				
                ar.push("<div class='", MP_Util.GetContentClass(component, "1"), "'>");
                headerString.push("<table class='disch-table-hdr' ><tr class ='disch-tbl-hdr'><td class='pat-los' style='width: ", widthClass, "%'><span>", i18n.LOS, "</span></td><td class='pat-est-dc' style='width: ", widthClass, "%'><span>", i18n.ESTIMATED_DISCHARGE_DATE, "</span></td>");
                dataRow.push("<table class='disch-table' ><tr class ='test'>");
                dataRow.push("<td class='pat-los 'style='width: ", widthClass, "%'><span>", recordData.LOS, "</span></td><td class='pat-est-dc' style='width: ", widthClass, "%'><span>", estDate, "</span></td>");

                for (var c = 0; c < sectionLen; c++) {
                    imgID = "img" + component.getComponentId() + "-" + c;
                    comp = recordData.COMPONENTS[c];
                    newIndVal = -1;
                    updtInd = false;
                    flg = comp.STATUS_FLAG;
                    
                    //STATUS_FLAG values:
                    //  Manual:
                    //    0 - Not Started (not possible to have Not Started manual status)
                    //    1 - In Progress
                    //    2 - Complete
                    //  System:
                    //    3 - Not Started
                    //    4 - In Progress
                    //    5 - Complete

                    compName = comp.NAME;
					compContentType = comp.CONTENT_TYPE;
					compMeaning = comp.MEANING;
                    if ("orders|diagnosis|pat-edu|follow-up|med-rec|documents|activities|social|care-mgmt|quality-meas|results".indexOf(compContentType) >= 0) {
                        tdClass = "disch-ind";
                    }
                    else {
                        tdClass = "disch-pointer";
                    }
                    if ("diagnosis|pat-edu|follow-up|documents|activities|social".indexOf(compContentType) >= 0) {
                        switch(flg) {
                        	case 0:
                        		updtInd = true;
                            	newIndVal = 1;
                            	break;
                        	case 1:
                        		updtInd = true;
                            	newIndVal = 1;
                            	break;
                            case 2:
                            	updtInd = true;
                            	newIndVal = 2;
                            	break;
                            case 3:
                            	updtInd = true;
                            	newIndVal = 1;
                            	break;
                            case 4:
                            	updtInd = true;
                            	newIndVal = 1;
                            	break;
                            case 5:
                            	updtInd = false;
                            	newIndVal = -1;
                            	break;
                        }
                        
                        headerString.push("<td class='", tdClass, "' style='width: " + widthClass + "%'><span>" + compName + "</span></td>");
                        icnStr = CERN_DISCH_INDICATOR_O1.GetIcon(flg, loc, imgID, newIndVal, compMeaning, updtInd, encntrId, providerId, compId);	
                        dataRow.push("<td class='", tdClass, "' style='width: " + widthClass + "%'><span class= 'disch-img-span'>", icnStr, "</span></td>");
                    }
					if ("orders|med-rec|care-mgmt|quality-meas".indexOf(compContentType) >= 0) {
                        headerString.push("<td class='", tdClass, "' style='width: " + widthClass + "%'><span>" + compName + "</span></td>");
                        icnStr = CERN_DISCH_INDICATOR_O1.GetIcon(flg, loc, imgID, newIndVal, compMeaning, updtInd, encntrId, providerId, compId);	
                        dataRow.push("<td class='", tdClass, "' style='width: " + widthClass + "%'><span class= 'disch-img-span'>", icnStr, "</span></td>");
                    }
                }
				
				//Force the results column to the end
				for (var d = 0; d < sectionLen; d++) {
					comp = recordData.COMPONENTS[d];
					if (comp.CONTENT_TYPE == "results") {
						imgID = "img" + component.getComponentId() + "-" + d;
						comp = recordData.COMPONENTS[d];
						newIndVal = -1;
						updtInd = false;
						//If there is no result set flg to -1 so that the '--' is displayed
						if (comp.STATUS_FLAG === 0 || comp.STATUS_FLAG === 3) {
							flg = -1;
						}
						else {
							flg = comp.RESULT_FLAG;
						}
						compName = comp.NAME;
						compContentType = comp.CONTENT_TYPE;
						headerString.push("<td class='", tdClass, "' style='width: " + widthClass + "%'><span>" + compName + "</span></td>");
						icnStr = CERN_DISCH_INDICATOR_O1.GetResultIcon(flg, loc, imgID);
						dataRow.push("<td class='", tdClass, "' style='width: " + widthClass + "%'><span class= 'disch-img-span'>", icnStr, "</span></td>");
					}
				}
                var hdrstring = "", dRow = "";
                headerString.push("</tr></table>");
                dataRow.push("</tr></table>");
				var rRow = "<div class='disch-sgn-button'><button type='button' onclick = 'CERN_DISCH_INDICATOR_O1.OpenDischargeProcess(" + encntrId + "," + personId + "," + providerId + ")'>" + i18n.DC_REVIEWSIGN + "</button></div>";
                hdrstring = headerString.join("");
                dRow = dataRow.join("");
                
                //The rRow: the Review and Sign button should be outside the content body div of the component
                ar.push(hdrstring, dRow, "</div>", rRow);
                sHTML = ar.join("");

                MP_Util.Doc.FinalizeComponent(sHTML, component, "");
            } 
            catch (err) {
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
        
        SetScript: function(newIndVal, compMeaning, updtInd, encntrId, providerId, imgID, compId){
            if (updtInd) {
                var info = (CERN_BrowserDevInd) ? new XMLHttpRequest() : new XMLCclRequest();
                info.onreadystatechange = function(){
                    var resetIndVal;
                    var img;
                    if (this.readyState == 4 && this.status == 200) {
                        MP_Util.LogScriptCallInfo(null, this, "dischargeindicator.js", "SetScript");
                        var comp = filePath + "/images/3918_16.gif";
                        var ntStarted = filePath + "/images/5970_16.gif";
                        var inProg = filePath + "/images/5971_16.gif";
                        if (newIndVal == 2) {
                            resetIndVal = 1;
                            img = document.getElementById(imgID);
                            img.onclick = function(){
                                CERN_DISCH_INDICATOR_O1.SetScript(resetIndVal, compMeaning, updtInd, encntrId, providerId, imgID, compId);
                            };
                        }
                        if (newIndVal == 1) {
                            resetIndVal = 2;
                            document[imgID].src = comp;
                            document[imgID].title = i18n.DC_COMPLETE;
                            img = document.getElementById(imgID);
                            img.onclick = function(){
                                CERN_DISCH_INDICATOR_O1.SetScript(resetIndVal, compMeaning, updtInd, encntrId, providerId, imgID, compId);
                            };
                        }
                    }
                    if (this.readyState == 4) {
                        MP_Util.GetCompObjById(compId).InsertData();
                        MP_Util.ReleaseRequestReference(this);
                    }
                    
                };
                
                var sendVal = ["^MINE^", encntrId + ".0", providerId + ".0", "^" + compMeaning + "^", newIndVal];
				if(CERN_BrowserDevInd){
					var url = "mp_drd_set_status_ind?parameters=" + sendVal.join(",");
					info.open("GET", url, true);
					info.send(null); 
				}
				else{
					info.open('GET', "mp_drd_set_status_ind", true);
                	info.send(sendVal.join(","));
				}
                return;
            }
        },
        GetResultIcon: function(stat, loc, imgID){
			var imgLnk = "";
			var comp = loc + "/images/5278.gif";
			var crit = loc + "/images/6272_16.gif";
			if (stat === 0) {
				imgLnk = "<img id='" + imgID + "' src='" + comp + "' />";
				return imgLnk;
			}
			else if (stat === 1) {
				imgLnk = "<img id='" + imgID + "' src='" + crit + "' />";
				return imgLnk
			}
			else {
				imgLnk = "--";
				return imgLnk;
			}
		},
        GetIcon: function(stat, loc, imgID, newIndVal, compMeaning, updtInd, encntrId, providerId, compId){
            var comp = loc + "/images/3918_16.gif";
            var ntStarted = loc + "/images/5970_16.gif";
            var inProg = loc + "/images/5971_16.gif";
            var imgLnk = "";
            
            if (stat === 0 || stat === 3) {
                imgLnk = "<img id='" + imgID + "' onClick ='CERN_DISCH_INDICATOR_O1.SetScript(" + newIndVal + ",\"" + compMeaning + "\"," + updtInd + "," + encntrId + "," + providerId + ",\"" + imgID + "\", " + compId + ");' name='" + imgID + "' title='" + i18n.DC_NOT_STARTED + "' src='" + ntStarted + "' />";
                return imgLnk;
            }
            else if (stat === 2 || stat === 5) {
                imgLnk = "<img id='" + imgID + "'  onClick ='CERN_DISCH_INDICATOR_O1.SetScript(" + newIndVal + ",\"" + compMeaning + "\"," + updtInd + "," + encntrId + "," + providerId + ",\"" + imgID + "\", " + compId + ");'  name = '" + imgID + "' title='" + i18n.DC_COMPLETE + "' src='" + comp + "' />";
                return imgLnk;
            }
            else if (stat === 1 || stat === 4) {
                imgLnk = "<img id='" + imgID + "'  onClick ='CERN_DISCH_INDICATOR_O1.SetScript(" + newIndVal + ",\"" + compMeaning + "\"," + updtInd + "," + encntrId + "," + providerId + ",\"" + imgID + "\", " + compId + ");' name = '" + imgID + "' title='" + i18n.DC_IN_PROGRESS + "' src='" + inProg + "' />";
                return imgLnk;
            }
            else {
                imgLnk = "<img id='" + imgID + "'  onClick ='CERN_DISCH_INDICATOR_O1.SetScript(" + newIndVal + ",\"" + compMeaning + "\"," + updtInd + "," + encntrId + "," + providerId + ",\"" + imgID + "\", " + compId + ");' name = '" + imgID + "' title='" + i18n.DC_NOT_STARTED + "' src='" + ntStarted + "' />";
                return imgLnk;
            }
        },
        OpenDischargeProcess: function(encntrId, personId, userId){
            var dpObject = window.external.DiscernObjectFactory("DISCHARGEPROCESS");
            MP_Util.LogDiscernInfo(null, "DISCHARGEPROCESS", "dischargeindicator.js", "OpenDischargeProcess");
            dpObject.person_id = personId;
            dpObject.encounter_id = encntrId;
            dpObject.user_id = userId;
            dpObject.LaunchDischargeDialog();
        }
    };
}();