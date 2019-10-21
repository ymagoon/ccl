/**
 * Med Override Component
 * Version: 1.0.0
 * Begin RXSTATION MED AVAILABILITY Med Override Component Development
 * Note: The med override component development for Phase III of the CareFusion integration project.
 * Initial Development: 12/23/2013
 * @author Naina Vegunta (NV030509)
 */
function MedOverrideComponentStyle() {
    this.initByNamespace("med_override");
}
MedOverrideComponentStyle.inherits(ComponentStyle);

function MedOverrideComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new MedOverrideComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.MEDS_OVERRIDE.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.MEDS_OVERRIDE.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(0);
    this.setLookbackUnitTypeFlag(1);
    CERN_MEDS_OVERRIDE_01.comp = this;
    this.m_user = Session.get("user");
    this.m_itemToOverrideIsLoaded = false;
     
    MedOverrideComponent.method("setUser", function(value) {
        this.m_user = value;
        if(value != null) {
            this.InsertData();
        } else {
            CERN_MEDS_OVERRIDE_01.WaitingForAuthentication();
        }
    });
    MedOverrideComponent.method("getUser", function() {
        return this.m_user;
    });
    MedOverrideComponent.method("setItemToOverrideIsLoaded", function(value) {
        this.m_itemToOverrideIsLoaded = value;
    });
    MedOverrideComponent.method("getItemToOverrideIsLoaded", function() {
        return this.m_itemToOverrideIsLoaded;
    });
    MedOverrideComponent.method("InsertData", function(){
        var recordData = [];
        CERN_MEDS_OVERRIDE_01.RenderComponent(this, recordData);
    });
    MedOverrideComponent.method("HandleSuccess", function(recordData){
        CERN_MEDS_OVERRIDE_01.RenderComponent(this, recordData);
    });
}
MedOverrideComponent.inherits(MPageComponent);

var CERN_MEDS_OVERRIDE_01 = function () {
    var comp = null;
    
    var curMedItemsToOverride = null;
    var curMedItemIndex = -1;
    var curPhysicianInfo = null;
    var curOverrideReasonsInfo = null;
    var curAdminSitesInfo = null;
    var curDefaultPhysicianName=null;
    var curOverrideReasonsRequiredIndicator = false;

	var curRemoteOverride = null;
	var curRemoteOverrideItemIndex = -1;
	
	var intendedDose = null;
	var physicianSelected= null;
	var adminSiteSelected = null;
	var overrideReasonSelected = null;
	
    return {
        RenderComponent: function (component, recordData) {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());

            try {
                if (component.getUser() == null) {
                    CERN_MEDS_OVERRIDE_01.WaitingForAuthentication();
                } else if (component.getUser().USER_INDICATORS.CAN_OVERRIDE_IND == 0) {
                    CERN_MEDS_OVERRIDE_01.UserCanNotOverride();
                } else {
                    CERN_MEDS_OVERRIDE_01.ShowRetrieveOverrideItemsOptions();
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
        DisplayAlerts: function (medId) {
            var hoverId = "hover_" + medId;
            var alertsId = "alerts_" + medId;
            document.getElementById(hoverId).style.visibility = "visible";
            document.getElementById(alertsId).style.display = "inline";
        },
	DisplayNoHover: function (medId) {
            var hoverId = "hover_" + medId;
            document.getElementById(hoverId).style.visibility = "hidden";
        },
        WaitingForAuthentication: function () {
            //Display a waiting for authentication message until the component has a valid user
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.WAITING_FOR_USER_AUTH + "... </span><br/>";
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        UserCanNotOverride: function () {
            //Display a waiting for authentication message until the component has a valid user
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.USER_CAN_NOT_REMOTE_OVERRIDE + "... </span><br/>";
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        ShowRetrieveOverrideItemsOptions: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];

            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.SEARCH_FOR_OVERRIDABLE_MED, "</span><br/>");
            jsHTML.push("<input type='text' name='overridableMedSearchText' value='' onClick='this.select();' onkeydown='CERN_MEDS_OVERRIDE_01.SearchInput_KeyDown()'> ");
            jsHTML.push("<input type='button' name='overridableMedSearchButton' onClick='CERN_MEDS_OVERRIDE_01.SearchForMedClicked()' value='", i18n.SEARCH, "'>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        SearchInput_KeyDown: function () {
            if (event.keyCode == 13) {
                document.getElementById('overridableMedSearchButton').click();
            }
        },
        GetMedItemToOverride: function (med_id) {
            //The get medication to override can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
            var sHTML = buildInitLoadingPage(this.comp);
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
            
            //we need to get med item to override info by making retrieval call

            var criterion = this.comp.getCriterion();
            var sendAr = [];

            var retrieve_items_to_override_request = new Object();

            var user = new Object();
            user.person_id = criterion.provider_id + ".0";
            
            var patient_info = new Object();
            patient_info.person_id=criterion.person_id + ".0";
            patient_info.encounter_id = criterion.encntr_id + ".0";
            
            retrieve_items_to_override_request.user = user;
            retrieve_items_to_override_request.patient_info = patient_info;
            retrieve_items_to_override_request.item_id = med_id;
			
			var json_object = new Object();
            json_object.retrieve_items_to_override_request = retrieve_items_to_override_request;

            var json_request = JSON.stringify(json_object);
			sendAr.push("^MINE^", "^RETRIEVE_ITEMS_TO_OVERRIDE^", "^" + json_request + "^");
            GetItemsToOverrideCCLRequestWrapper(this.comp, sendAr);
        },
        PrepareSearchForMedToOverrideCall: function (searchText) {
            //The search can take a couple seconds, so display a "Searching..." message until it completes to let the user know the system is working
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>"+ i18n.SEARCHING_FORMULARY.replace("{0}", searchText) +"</span><br/>";
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
            SearchForMedToOverrideCCLRequestWrapper(this.comp, paramAr);
        },
                
        ShowOverrideSearchResultsForm: function (component,searchResults) {
            var sHTML = "";
            var jsHTML = [];
            var content = [];

            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
            if (searchResults.length > 0) {
                jsHTML.push("<form name=searchOverrideResultsRadioForm method='get' action='' onsubmit='return false;'>");
                for (var x = 0 in searchResults) {
                    jsHTML.push("<dl class='override-info'>");
                    var itemDescription = searchResults[x].DESCRIPTION;
                    var itemBrandName = searchResults[x].BRAND_NAME;
                    var itemIdentifier = searchResults[x].ITEM_IDENTIFIER;
                    var searchResultDisplay = itemDescription + " (" + itemBrandName + ")";
                    
                    jsHTML.push("<dl class='override-info'>");
                    jsHTML.push("<dd class='waste-medtxtowaste-radio'><input type='radio' name='searchResultRadio' value='" + itemIdentifier + "'>" + searchResultDisplay + "</dd><br>");
                    jsHTML.push("</dl>");
                }
                jsHTML.push("<input type='button' name='confirmSearchSelectionButton' onClick='CERN_MEDS_OVERRIDE_01.OverrideSelectedSearchResult()' value='", i18n.OVERRIDE_SELECTED_MEDICATIONS, "'>");
                jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_OVERRIDE_01.CancelOverrideProcess()' value='", i18n.CANCEL, "'>");
                jsHTML.push("</form>");
            } else {
                jsHTML.push(i18n.NO_OVERRIDABLE_ITEMS_FOUND);
            }
            jsHTML.push("<br/></h3></div>");
            
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.SEARCH_FOR_OVERRIDABLE_MED, "</span><br/>");
            jsHTML.push("<input type='text' name='overridableMedSearchText' value='' onClick='this.select();' onkeydown='CERN_MEDS_OVERRIDE_01.SearchInput_KeyDown()'  > ");
            jsHTML.push("<input type='button' name='overridableMedSearchButton' onClick='CERN_MEDS_OVERRIDE_01.SearchForMedClicked()' value='", i18n.SEARCH, "'>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        
        OverrideSelectedSearchResult: function () {
            var length = document.searchOverrideResultsRadioForm.searchResultRadio.length;
            var medId = new String();
            for (i = 0; i < length; i++) {
                if (document.searchOverrideResultsRadioForm.searchResultRadio[i].checked) {
                    medId = document.searchOverrideResultsRadioForm.searchResultRadio[i].value;
                    break;
                }
            }
			
            //Handle the case where the list of radio buttons was just a single radio button so is not stored in an array
            if (length == null) {
                if (document.searchOverrideResultsRadioForm.searchResultRadio != null) {
                    if (document.searchOverrideResultsRadioForm.searchResultRadio.checked) {
                        medId = document.searchOverrideResultsRadioForm.searchResultRadio.value;
                    }
                }
            }
            
            if (medId.length > 0) {
                this.GetMedItemToOverride(medId);
            }
        }, 
        
        SearchForMedClicked: function () {
            var searchText = new String(document.getElementById('overridableMedSearchText').value);
            
            if (searchText.length > 2) {
                this.PrepareSearchForMedToOverrideCall(searchText);
            } else {
                alert(i18n.PLEASE_ENTER_THREE_CHARACTERS);
            }
        },
        ShowIntendedDoseForm: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];

            var amountUnitsOfMeasure = this.curMedItemsToOverride[this.curMedItemIndex].AMOUNT_UNITS_OF_MEASURE;
            var warningList = this.curMedItemsToOverride[this.curMedItemIndex].WARNINGS;
			var medId = this.curMedItemsToOverride[this.curMedItemIndex].MED_ID;
			
            BuildOverrideMedDisplayName(this.curMedItemsToOverride[this.curMedItemIndex]);
			
            jsHTML.push("<table id='OverrideMedInfoDisplayTableMedInfoDisplayTable' cellspacing='1' cellpadding='0' border='1'>");
            jsHTML.push("<tr><td class='override-med-info-title'><b>", i18n.WASTE_MEDICATION_NAME, "</b></td></tr></table>");      
            jsHTML.push("<dl class='med_override-info' id='",medId, "'>");
	    jsHTML.push("<dd class='override-med-info-data'><span>");			

	    if(this.curMedItemsToOverride[this.curMedItemIndex].WITNESS_REQUIRED_IND == 1) {
		jsHTML.push("<img src='", this.comp.getCriterion().static_content, "\\images\\omni-witness.png' height='24' width='24' title='", i18n.WITNESS_REQURED_ICON, "'/>&nbsp;");
            }
            if(warningList != undefined && warningList.length > 0) {
		jsHTML.push("<img src='", this.comp.getCriterion().static_content, "\\images\\omni-alert.png' height='24' width='24' onmouseover='CERN_MEDS_OVERRIDE_01.DisplayAlerts(\"",  medId, "\")' onmouseout='CERN_MEDS_OVERRIDE_01.DisplayNoHover(\"",  medId, "\")'/>&nbsp;");
            }
            jsHTML.push(this.curMedItemsToOverride[this.curMedItemIndex].DISPLAY_NAME, "</span></dd></dl>");
    
            //BEGIN: Building warning hover details
	    jsHTML.push("<h4 class='med-det-hd'><span>", "Warnings", "</span></h4>");
	    jsHTML.push("<div class='hvr' id='hover_", medId, "' style='visibility:hidden'>");
            // Warnings
	    jsHTML.push("<dl class='med-det' id='alerts_", medId, "' style='display:none'>");         
	    jsHTML.push("<dt><span><u><b>", i18n.WARNING, "</b></u></span><br/></dt>");
	    for (var k = 0 in warningList) {
		var warning = warningList[k];
		jsHTML.push("<dd class='med-name-desc'><span><b>~</b> ", warning.VALUE, "</span><br/></dd>");
	    }
	    jsHTML.push("</dl>");
          
	    jsHTML.push("</div>");
	    //END: Building warning hover details
			
	    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><form name=intendedDoseForm method='get' action='' onsubmit='return false;'>");
            jsHTML.push("<span class='sub-sec-title'>", i18n.PLEASE_ENTER_INTENDED_DOSE, "</span><br/>");
            jsHTML.push("<input type='text' name='intendedDosageInput' value='' onkeyup='CERN_MEDS_OVERRIDE_01.IntendedDosageInput_KeyDown();' onKeyPress='return CERN_MEDS_OVERRIDE_01.isNumberKey(event);' onBlur='CERN_MEDS_OVERRIDE_01.ValidateIntendedDosage();'><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");

            jsHTML.push("<input type='button' name='intendedDosageButton' disabled=true onClick='CERN_MEDS_OVERRIDE_01.ProcessIntendedDosageInput()' value='", i18n.NEXT, "'>&nbsp;");
            jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_OVERRIDE_01.CancelOverrideProcess()' value='", i18n.CANCEL, "'>");
            jsHTML.push("</form><br/></h3></div>");
			
	    content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        IntendedDosageInput_KeyDown: function () {
            if(document.getElementById('intendedDosageInput').value){
            	document.getElementById('intendedDosageButton').disabled = false;
		    if (event.keyCode == 13) {
			document.getElementById('intendedDosageButton').click();
		}
            } else {
		    document.getElementById('intendedDosageButton').disabled = true;
	    }
        },
        ValidateIntendedDosage: function () {
            var intendedDosage = document.getElementById('intendedDosageInput').value;
            
            if (intendedDosage != "") {
                var numberFormat = new NumberFormat();
                var roundedIntendedDosage = numberFormat.truncate(intendedDosage, 4);
                
                if (roundedIntendedDosage <= 0) {
                    alert(i18n.INTENDED_DOSE_IS_NEGATIVE);
                    document.getElementById('intendedDosageInput').value = "";
                    document.getElementById('intendedDosageButton').disabled = true;
                } else {
                    document.getElementById('intendedDosageInput').value = roundedIntendedDosage;
                    document.getElementById('intendedDosageButton').disabled = false;
                }
            } else {
                document.getElementById('intendedDosageButton').disabled = true;
            }
        },
                        
        isNumberKey: function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            } else {
		//if dot sign entered more than once then don't allow to enter dot sign again. 46 is the code for dot sign
		var number = event.srcElement.value.split('.');
		if (number.length > 1 && charCode == 46)
		    return false;
		return true;
	    }
            return true;
        },
        
        ProcessIntendedDosageInput: function () {
            CERN_MEDS_OVERRIDE_01.ValidateIntendedDosage();
            
            var intendedDosage = document.getElementById('intendedDosageInput').value;
            if (intendedDosage != "") {
                var numberFormat = new NumberFormat();
                intendedDosage = numberFormat.truncate(new Number(intendedDosage), 4);
                
                if (intendedDosage > 0) {
                  	this.intendedDose = intendedDosage;
                    if (this.curMedItemsToOverride[this.curMedItemIndex].PHYSICIAN_REQUIRED_IND == true) {
                        CERN_MEDS_OVERRIDE_01.AskPhysicianName();
                    } else if (this.curMedItemsToOverride[this.curMedItemIndex].ADMIN_SITES_REQUIRED_IND == true) {
						CERN_MEDS_OVERRIDE_01.AskAdministrationSite();                    	
                	} else if (this.curOverrideReasonsRequiredIndicator == true) {
						CERN_MEDS_OVERRIDE_01.AskOverrideReason();
                    } else {
                    	CERN_MEDS_OVERRIDE_01.RemoteOverrideConfirmation();
                	}
                }
            } else {
                alert(i18n.PLEASE_ENTER_INTENDED_DOSE_TO_CONTINUE); 
                document.getElementById('intendedDosageInput').value = "";
                document.getElementById('intendedDosageButton').disabled = true;
            }
        }, 
        // Physician Selection Page
        AskPhysicianName: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><b>", i18n.PHYSICIAN_SELECTION_SCREEN, "</b><br/>");
            
            jsHTML.push("<form name=physicianSelectRadioForm method='get' action='' onsubmit='return false;'>");
            var physicianNames = this.curPhysicianInfo;
            for (var x = 0 in physicianNames) {
  				if(physicianNames[x].PHYSICIAN_NAME === this.curDefaultPhysicianName)
  				{
                	jsHTML.push("<input type='radio' name='physicianSelectRadio' onkeydown='CERN_MEDS_OVERRIDE_01.SelectPhysician_KeyDown()' onclick='if(this.checked){CERN_MEDS_OVERRIDE_01.DisableFreeTextInput()}' value='" + physicianNames[x].PHYSICIAN_NAME + "' checked>" + physicianNames[x].PHYSICIAN_NAME + "<br>");
 				}
 				else 
 				{
 					jsHTML.push("<input type='radio' name='physicianSelectRadio' onkeydown='CERN_MEDS_OVERRIDE_01.SelectPhysician_KeyDown()' onclick='if(this.checked){CERN_MEDS_OVERRIDE_01.DisableFreeTextInput()}' value='" + physicianNames[x].PHYSICIAN_NAME + "'>" + physicianNames[x].PHYSICIAN_NAME + "<br>");
 				}          
            }
            jsHTML.push("<input type='radio' name='physicianSelectRadio' value='FreeTextAnswerRadio' onkeydown='CERN_MEDS_OVERRIDE_01.SelectPhysician_KeyDown()' onclick='if(this.checked){CERN_MEDS_OVERRIDE_01.FreeTextOptionSelected()}'>")
            jsHTML.push("<input type='text' id='freeTextAnswer' onClick='this.select();' onkeydown='CERN_MEDS_OVERRIDE_01.SelectPhysician_KeyDown()' value='Other' disabled><br>");
            
            jsHTML.push("<input type='button' name='SelectPhysicianButton' onClick='CERN_MEDS_OVERRIDE_01.ProcessPhysicianSelected()' value='", i18n.NEXT, "'>&nbsp;");
            jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_OVERRIDE_01.CancelOverrideProcess()' value='", i18n.CANCEL, "'>");
            jsHTML.push("</form>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        SelectPhysician_KeyDown: function () {
            if (event.keyCode == 13) {
                document.getElementById('selectPhysicianButton').click();
            }
        },
        ProcessPhysicianSelected: function () {
            var answerText = new String();
            var length = document.physicianSelectRadioForm.physicianSelectRadio.length;

            //Handle the case where the list of radio buttons was just a single radio button so is not stored in an array
            if (length == null) {
                if (document.physicianSelectRadioForm.physicianSelectRadio != null) {
                    if (document.physicianSelectRadioForm.physicianSelectRadio.checked) {
                        answerText = document.physicianSelectRadioForm.physicianSelectRadio.value;
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (document.physicianSelectRadioForm.physicianSelectRadio[i].checked) {
                        answerText = document.physicianSelectRadioForm.physicianSelectRadio[i].value;
                        break;
                    }
                }
            }
            if (answerText.length <= 0) {
                if (this.curMedItemsToOverride[this.curMedItemIndex].PHYSICIAN_REQUIRED_IND == true) {
                    CERN_MEDS_OVERRIDE_01.AskPhysicianName();
                } else if (this.curMedItemsToOverride[this.curMedItemIndex].ADMIN_SITES_REQUIRED_IND == true) {
                    CERN_MEDS_OVERRIDE_01.AskAdministrationSite();
                } else if (this.curOverrideReasonsRequiredIndicator == true) {
                    CERN_MEDS_OVERRIDE_01.AskOverrideReason();
                } else {
                    CERN_MEDS_OVERRIDE_01.RemoteOverrideConfirmation();
                }
            } else {
                if (answerText == "FreeTextAnswerRadio") {
                    answerText = document.getElementById("freeTextAnswer").value;
                }
                this.physicianSelected = answerText;
                if (this.curMedItemsToOverride[this.curMedItemIndex].ADMIN_SITES_REQUIRED_IND == true) {
                    CERN_MEDS_OVERRIDE_01.AskAdministrationSite();
                } else if (this.curOverrideReasonsRequiredIndicator == true) {
                    CERN_MEDS_OVERRIDE_01.AskOverrideReason();
                } else {
                    CERN_MEDS_OVERRIDE_01.RemoteOverrideConfirmation();
                }
            }
        },
        // Administration Site Selection Page
        AskAdministrationSite: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            var freeTextSelected = true;
            
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><b>", i18n.ADMINISTARTION_SITE_SCREEN, "</b><br/>");
            
            jsHTML.push("<form name=administrationSiteRadioForm method='get' action='' onsubmit='return false;'>");
            
            var administrationSites = CERN_MEDS_OVERRIDE_01.curAdminSitesInfo;
            for (var x = 0 in administrationSites) {
                jsHTML.push("<input type='radio' name='administrationSiteRadio' onkeydown='CERN_MEDS_OVERRIDE_01.SelectAdministrationSite_KeyDown()' onclick='if(this.checked){CERN_MEDS_OVERRIDE_01.DisableFreeTextInput()}' value='" + administrationSites[x].ADMIN_SITE + "'>" + administrationSites[x].ADMIN_SITE + "<br>");
            }

            jsHTML.push("<input type='radio' name='administrationSiteRadio' value='FreeTextAnswerRadio' onkeydown='CERN_MEDS_OVERRIDE_01.SelectAdministrationSite_KeyDown()' onclick='if(this.checked){CERN_MEDS_OVERRIDE_01.FreeTextOptionSelected()}'>")
            jsHTML.push("<input type='text' id='freeTextAnswer' onClick='this.select();' onkeydown='CERN_MEDS_OVERRIDE_01.SelectAdministrationSite_KeyDown()' value='Other' disabled><br>");
                
            jsHTML.push("<input type='button' name='selectAdministrationSiteButton' onClick='CERN_MEDS_OVERRIDE_01.ProcessAdministrationSiteSelected()' value='", i18n.NEXT, "'>&nbsp;");
            jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_OVERRIDE_01.CancelOverrideProcess()' value='", i18n.CANCEL, "'>");
            jsHTML.push("</form>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        SelectAdministrationSite_KeyDown: function () {
            if (event.keyCode == 13) {
                document.getElementById('selectAdministrationSiteButton').click();
            }
        },
        ProcessAdministrationSiteSelected: function () {
            var answerText = new String();
            var length = document.administrationSiteRadioForm.administrationSiteRadio.length;

            //Handle the case where the list of radio buttons was just a single radio button so is not stored in an array
            if (length == null) {
                if (document.administrationSiteRadioForm.administrationSiteRadio != null) {
                    if (document.administrationSiteRadioForm.administrationSiteRadio.checked) {
                        answerText = document.administrationSiteRadioForm.administrationSiteRadio.value;
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (document.administrationSiteRadioForm.administrationSiteRadio[i].checked) {
                        answerText = document.administrationSiteRadioForm.administrationSiteRadio[i].value;
                        break;
                    }
                }
            }
            if (answerText.length <= 0) {
               if (this.curMedItemsToOverride[this.curMedItemIndex].ADMIN_SITES_REQUIRED_IND == true) {
                    CERN_MEDS_OVERRIDE_01.AskAdministrationSite();
               } else if (this.curOverrideReasonsRequiredIndicator == true) {
                    CERN_MEDS_OVERRIDE_01.AskOverrideReason();
               } else {
                    CERN_MEDS_OVERRIDE_01.RemoteOverrideConfirmation();
               }
            } else {
                if (answerText == "FreeTextAnswerRadio") {
                    answerText = document.getElementById("freeTextAnswer").value;
               }
 				this.adminSiteSelected = answerText;
               if (this.curOverrideReasonsRequiredIndicator == true) {
                    CERN_MEDS_OVERRIDE_01.AskOverrideReason();
               } else {
                    CERN_MEDS_OVERRIDE_01.RemoteOverrideConfirmation();
               }
            }
        },
        // Override Reason Selection Page
        AskOverrideReason: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            var freeTextSelected = true;
            
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><b>", i18n.OVERRIDE_REASON_SCREEN, "</b><br/>");
            
            jsHTML.push("<form name=overrideReasonSelectRadioForm method='get' action='' onsubmit='return false;'>");
            var overrideReasons = CERN_MEDS_OVERRIDE_01.curOverrideReasonsInfo;
            for (var x = 0 in overrideReasons) {
                jsHTML.push("<input type='radio' name='overrideReasonSelectRadio' onkeydown='CERN_MEDS_OVERRIDE_01.SelectOverrideReason_KeyDown()' onclick='if(this.checked){CERN_MEDS_OVERRIDE_01.DisableFreeTextInput()}' value='" + overrideReasons[x].OVERRIDE_REASON + "'>" + overrideReasons[x].OVERRIDE_REASON + "<br>");
            }
            jsHTML.push("<input type='radio' name='overrideReasonSelectRadio' value='FreeTextAnswerRadio' onkeydown='CERN_MEDS_OVERRIDE_01.SelectOverrideReason_KeyDown()' onclick='if(this.checked){CERN_MEDS_OVERRIDE_01.FreeTextOptionSelected()}'>")
            jsHTML.push("<input type='text' id='freeTextAnswer' onClick='this.select();' onkeydown='CERN_MEDS_OVERRIDE_01.SelectOverrideReason_KeyDown()' value='Other' disabled><br>");
            
            jsHTML.push("<input type='button' name='selectOverrideReasonButton' onClick='CERN_MEDS_OVERRIDE_01.ProcessOverrideReasonSelected()' value='", i18n.NEXT, "'>&nbsp;");
            jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_OVERRIDE_01.CancelOverrideProcess()' value='", i18n.CANCEL, "'>");
            jsHTML.push("</form>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        SelectOverrideReason_KeyDown: function () {
            if (event.keyCode == 13) {
                document.getElementById('selectOverrideReasonButton').click();
            }
        },
        ProcessOverrideReasonSelected: function () {
            var answerText = new String();
            var length = document.overrideReasonSelectRadioForm.overrideReasonSelectRadio.length;

            //Handle the case where the list of radio buttons was just a single radio button so is not stored in an array
            if (length == null) {
                if (document.overrideReasonSelectRadioForm.overrideReasonSelectRadio != null) {
                    if (document.overrideReasonSelectRadioForm.overrideReasonSelectRadio.checked) {
                        answerText = document.overrideReasonSelectRadioForm.overrideReasonSelectRadio.value;
                    }
                }
            } else {
                for (i = 0; i < length; i++) {
                    if (document.overrideReasonSelectRadioForm.overrideReasonSelectRadio[i].checked) {
                        answerText = document.overrideReasonSelectRadioForm.overrideReasonSelectRadio[i].value;
                        break;
                    }
                }
            }
            if (answerText.length <= 0) {
                if (this.curOverrideReasonsRequiredIndicator == true) {
                    CERN_MEDS_OVERRIDE_01.AskOverrideReason();
                } else {
                    CERN_MEDS_OVERRIDE_01.RemoteOverrideConfirmation();
                }
            } else {
                if (answerText == "FreeTextAnswerRadio") {
                    answerText = document.getElementById("freeTextAnswer").value;
                }
                this.overrideReasonSelected = answerText;
                CERN_MEDS_OVERRIDE_01.RemoteOverrideConfirmation();
            }
        },
        DisableFreeTextInput: function () {
            var freeTextAnswerElement = document.getElementById("freeTextAnswer");
            if (freeTextAnswerElement != null) {
                freeTextAnswerElement.disabled = true;
            }
        },
        FreeTextOptionSelected: function () {
            var freeTextAnswerElement = document.getElementById("freeTextAnswer");
            freeTextAnswerElement.disabled = false;
            freeTextAnswerElement.select();
        },
        CancelOverrideProcess: function () {
            this.curMedItemIndex = -1;
            this.curMedItemsToOverride = null;
            this.curPhysicianInfo = null;
    		this.curOverrideReasonsInfo = null;
    		this.curAdminSitesInfo = null;
   		 	this.curDefaultPhysicianName=null;
    		this.curOverrideReasonsRequiredIndicator = false;

			this.curRemoteOverride = null;
			this.curRemoteOverrideItemIndex = -1;
			this.overrideReasonSelected= null;
			this.intendedDose = null;
			this.physicianSelected= null;
			this.adminSiteSelected = null;
            
            CERN_MEDS_OVERRIDE_01.ShowRetrieveOverrideItemsOptions()
        },
        RemoteOverrideConfirmation: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            
            jsHTML = jsHTML.concat(BuildOverrideMedInfoDisplay(this.curMedItemsToOverride, this.curMedItemIndex,this.comp));
            
            jsHTML.push("<div class='sub-sec'>");
            jsHTML.push("<input type='button' name='remoteOverrideRequestButton' onClick='CERN_MEDS_OVERRIDE_01.PrepareRemoteOverrideRequest()' value='", i18n.SUBMIT, "'>&nbsp;");
            jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_OVERRIDE_01.CancelOverrideProcess()' value='", i18n.CANCEL, "'>");
            jsHTML.push("</div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        PrepareRemoteOverrideRequest: function () {
            //The get Items to override can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
            var sHTML = buildInitLoadingPage(this.comp);
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
            var criterion = this.comp.getCriterion();
            var sendAr = [];

            var remote_override_request = new Object();

            var user = new Object();
            user.person_id = criterion.provider_id + ".0";

            remote_override_request.user = user;

			var patient_info = new Object();
            patient_info.person_id=criterion.person_id + ".0";
            patient_info.encounter_id = criterion.encntr_id + ".0";
            
            var overriden_item = new Object();
            overriden_item.item_id = this.curMedItemsToOverride[this.curMedItemIndex].MED_ID;
            overriden_item.intended_dose = this.intendedDose;
            if(CERN_MEDS_OVERRIDE_01.isInteger(this.intendedDose)){
            	overriden_item.intended_dose = overriden_item.intended_dose + ".0";
            }
            overriden_item.amount_units_of_measure = this.curMedItemsToOverride[this.curMedItemIndex].AMOUNT_UNITS_OF_MEASURE;
	    this.physicianSelected = (typeof this.physicianSelected === 'undefined' || this.physicianSelected === null) ? "" : this.physicianSelected;
            overriden_item.physician_name = this.physicianSelected;
	    this.adminSiteSelected = (typeof this.adminSiteSelected === 'undefined' || this.adminSiteSelected === null) ? "" : this.adminSiteSelected;
	    overriden_item.admin_site = this.adminSiteSelected;			
            var overriden_items= new Array();
            overriden_items.push(overriden_item);
            
            remote_override_request.user = user;
            remote_override_request.patient_info = patient_info;
            remote_override_request.overriden_items = overriden_items;
	    this.overrideReasonSelected = (typeof this.overrideReasonSelected === 'undefined' || this.overrideReasonSelected === null) ? "" : this.overrideReasonSelected;
            remote_override_request.override_reason=this.overrideReasonSelected;

            var json_object = new Object();
            json_object.remote_override_request = remote_override_request;
			
            var json_request = JSON.stringify(json_object);
            sendAr.push("^MINE^", "^REMOTE_OVERRIDE^", "^" + json_request + "^");
            SendRemoteOverrideCCLRequestWrapper(this.comp, sendAr);
        },
        isInteger: function (number) {
   			return number % 1 === 0;
		},
        RemoteOverrideSummary: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            
            jsHTML = jsHTML.concat(BuildOverrideMedInfoDisplay(this.curMedItemsToOverride, this.curMedItemIndex,this.comp));
            jsHTML = jsHTML.concat(BuildItemAvailabityAndLocationDisplay(this.curRemoteOverride,this.curRemoteOverrideItemIndex,this.comp));
                        
            this.curMedItemsToOverride = null;
            this.curMedItemIndex = -1;
            this.curPhysicianInfo = null;
    		this.curOverrideReasonsInfo = null;
    		this.curAdminSitesInfo = null;
   		 	this.curDefaultPhysicianName=null;
    		this.curOverrideReasonsRequiredIndicator = false;

			this.curRemoteOverride = null;
			this.curRemoteOverrideItemIndex = -1;
			this.overrideReasonSelected=null;
			this.intendedDose = null;
			this.physicianSelected= null;
			this.adminSiteSelected = null;
			
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.OVERRIDE_SUCCESS, "</span><br/>");
            jsHTML.push("<input type='button' name='reloadOverrideItemButton' onClick='CERN_MEDS_OVERRIDE_01.ShowRetrieveOverrideItemsOptions()' value='", i18n.OK, "'>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        }
    }
    function BuildOverrideMedDisplayName(curMedItemToOverride) {
        if (curMedItemToOverride.DISPLAY_NAME == null) {
            var medNameDisplay = curMedItemToOverride.GENERIC_NAME;
            medNameDisplay = medNameDisplay + " (" + curMedItemToOverride.BRAND_NAME + ") ";
            curMedItemToOverride.DISPLAY_NAME = medNameDisplay;
        }
    }
    function BuildOverrideMedInfoDisplay(curMedItemsToOverride, curMedItemIndex, comp) {
        //Build the display for the top of the override screens showing name/dispense info
        var jsHTML = [];
		var warningList = curMedItemsToOverride[curMedItemIndex].WARNINGS;
		var medId = curMedItemsToOverride[curMedItemIndex].MED_ID;
			
		BuildOverrideMedDisplayName(curMedItemsToOverride[curMedItemIndex]);
			
        jsHTML.push("<table id='OverrideMedInfoDisplayTable' cellspacing='1' cellpadding='0' border='1'>");
        jsHTML.push("<tr><td><table><tr><td class='waste-med-info-title'><b>", i18n.WASTE_MEDICATION_NAME, "</b></td></tr>");
        jsHTML.push("<tr><td><dl class='med_override-info' id='",medId, "'>");
	jsHTML.push("<dd class='override-med-info-data'><span>");
	if(curMedItemsToOverride[curMedItemIndex].WITNESS_REQUIRED_IND == 1) {
           jsHTML.push("<img src='", comp.getCriterion().static_content, "\\images\\omni-witness.png' height='24' width='24' title='", i18n.WITNESS_REQURED_ICON, "'/>&nbsp;");    
	}
        if(warningList != undefined && warningList.length > 0) {
			jsHTML.push("<img src='", comp.getCriterion().static_content, "\\images\\omni-alert.png' height='24' width='24' onmouseover='CERN_MEDS_OVERRIDE_01.DisplayAlerts(\"",  medId, "\")' onmouseout='CERN_MEDS_OVERRIDE_01.DisplayNoHover(\"",  medId, "\")'/>&nbsp;");
        }
	jsHTML.push("<b>",curMedItemsToOverride[curMedItemIndex].DISPLAY_NAME, "</b></span></dd></dl>");

	//BEGIN: Building warning hover details
        jsHTML.push("<h4 class='med-det-hd'><span>", "Warnings", "</span></h4>");
        jsHTML.push("<div class='hvr' id='hover_", medId, "' style='visibility:hidden'>");
            
        // Warnings
	jsHTML.push("<dl class='med-det' id='alerts_", medId, "' style='display:none'>");         
        jsHTML.push("<dt><span><u><b>", i18n.WARNING, "</b></u></span><br/></dt>");
        for (var k = 0 in warningList) {
            var warning = warningList[k];
            jsHTML.push("<dd class='med-name-desc'><span><b>~</b> ", warning.VALUE, "</span><br/></dd>");
        }
        jsHTML.push("</dl>");
          
	jsHTML.push("</div>");
        //END: Building warning hover details
			
	jsHTML.push("</td></tr>");
    	jsHTML.push("<tr><td><table><tr><td class='waste-med-info-title'><b>", i18n.LAST_ISSUED, "<b></td></tr>");
	var lastDispensed = "";
	if (curMedItemsToOverride[curMedItemIndex].FORMAT_ORIG_RMVED_MED_TX_TIME) {
	    if(!curMedItemsToOverride[curMedItemIndex].REMOVED_BY_USER_NAME) {
		lastDispensed = curMedItemsToOverride[curMedItemIndex].FORMAT_ORIG_RMVED_MED_TX_TIME;
	    } else {
		lastDispensed = i18n.LAST_DISPENSED_DATE_TIME_AND_BY.replace("{0}", curMedItemsToOverride[curMedItemIndex].FORMAT_ORIG_RMVED_MED_TX_TIME);
		lastDispensed = lastDispensed.replace("{1}", curMedItemsToOverride[curMedItemIndex].REMOVED_BY_USER_NAME);
	    }
        }
	jsHTML.push("<tr><td class='override-med-info-data'>", lastDispensed, "</td></tr></table></td></tr>");

        var amountUnitsOfMeasure = curMedItemsToOverride[curMedItemIndex].AMOUNT_UNITS_OF_MEASURE;
        var numberFormat = new NumberFormat();
        
        jsHTML.push("<tr><td><table id='OverrideMedInfoTable'><tr>");
        jsHTML.push("<td><table><tr><td class='waste-med-info-title'><b>", i18n.INTENDED_DOSE, "</b></td></tr>");
        jsHTML.push("<tr><td class='override-med-info-data'><b>", CERN_MEDS_OVERRIDE_01.intendedDose, " ", amountUnitsOfMeasure, "</b></td></tr></table></td>");
        jsHTML.push("<td><table><tr><td class='waste-med-info-title'><b>", i18n.PHYSICIAN_SELECTED, "</b></td></tr>");
        jsHTML.push("<tr><td class='override-med-info-data'>", CERN_MEDS_OVERRIDE_01.physicianSelected, "</td></tr></table></td>");
        jsHTML.push("<td><table><tr><td class='waste-med-info-title'><b>", i18n.ADMINISTARTION_SITE_SELECTED, "</b></td></tr>");
        jsHTML.push("<tr><td class='override-med-info-data'>", CERN_MEDS_OVERRIDE_01.adminSiteSelected, "</td></tr></table></td>");
        jsHTML.push("<td><table><tr><td class='waste-med-info-title'><b>", i18n.OVERRIDE_REASON_SELECTED, "</b></td></tr>");
        jsHTML.push("<tr><td class='override-med-info-data'>", CERN_MEDS_OVERRIDE_01.overrideReasonSelected, "</td></tr></table></td>");
        jsHTML.push("</tr></table></td></tr></table>");

        return jsHTML;
    }
    function BuildItemAvailabityAndLocationDisplay(curRemoteOverride, curRemoteOverrideItemIndex, comp) {
    //Build the display for the top of the override screens showing medication location info
        var jsHTML = [];
		jsHTML.push("<table class='override-process-table'id='OverrideMedLocationDisplayTable'>");
        
        dispenseLocations = curRemoteOverride[curRemoteOverrideItemIndex].DISPENSE_LOCATIONS;
        jsHTML.push("<tr><td class='waste-med-info-title'><b>", i18n.LOCATION ,"</b></td>");
        jsHTML.push("<td class='waste-med-info-title'><b>", i18n.MED_AVAILABILITY ,"</b></td>");
        jsHTML.push("<td class='waste-med-info-title'><b>", i18n.AVAILABLE_QUANTITY ,"</b></td></tr>");
		
        if(dispenseLocations.length>0)
        {
            for (var x = 0 in dispenseLocations) {
        	var dispenseLocation = dispenseLocations[x];
		jsHTML.push("<tr><td class='override-med-info-data'>");
		// Indicate the user if the med order is available in patient specific bin.
		if(dispenseLocation.PATIENT_SPECIFIC_CABINET_IND == 1){
		    jsHTML.push("<img src='", comp.getCriterion().static_content, "\\images\\omni-psb.png' height='24' width='24' title='", i18n.PATIENT_SPECIFIC_BIN, "'/>&nbsp;");
		}
                jsHTML.push("<b>", dispenseLocation.LOCATION_DISP,"</b>&nbsp;</td>");
                var admMedAvailability = new AdmMedAvailability(dispenseLocation.AVAILABILITY_IND);
                jsHTML.push("<td><span class=", admMedAvailability.getMedAvailabilityStyle(), "><b>", admMedAvailability.getMedAvailabilityText(), "</b></span>&nbsp;</td>");  
		jsHTML.push("<td class='override-med-info-data'>", dispenseLocation.AVAILABLE_QUANTITY, "</td></tr>");
            }	
        }
        jsHTML.push("</table>");
		
        return jsHTML;
    }

    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to REMOTE_OVERRIDE and examines the reply status before
    //determining how to handle the reply.
    function SendRemoteOverrideCCLRequestWrapper(component, paramAr) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());
        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
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
                        
                        CERN_MEDS_OVERRIDE_01.curRemoteOverride =recordData.REPLY_DATA.OVERRIDE_ITEMS;
                        
                        if (CERN_MEDS_OVERRIDE_01.curRemoteOverride != null && CERN_MEDS_OVERRIDE_01.curRemoteOverride != "") {
                            CERN_MEDS_OVERRIDE_01.curRemoteOverrideItemIndex = 0;
                            CERN_MEDS_OVERRIDE_01.RemoteOverrideSummary();
                        }
                        if (recordData.REPLY_DATA.STATUS_INFO.OPERATION_STATUS_FLAG == -1) {
                            displayAlertMessage(i18n.UNABLE_TO_PROCESS, recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL);
                            CERN_MEDS_OVERRIDE_01.ShowRetrieveOverrideItemsOptions();    
                        } 
                       
                        /* TODO: when reply is success but no override items are found
                        else {
                        	CERN_MEDS_OVERRIDE_01.RemoteOverrideSummary();
                        }
                        */
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
                            errorAr.push(
                                    statusData.STATUS,
                                    statusData.SUBEVENTSTATUS.OPERATIONNAME,
                                    statusData.SUBEVENTSTATUS.OPERSATIONSTATUS,
                                    statusData.SUBEVENTSTATUS.TARGETOBJECTNAME,
                                    statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
                        }
                        //TODO: Error handling here
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
                    }
                }
                catch (err) {
                    if (timerLoadComponent) {
                        timerLoadComponent.Abort();
                        timerLoadComponent = null;
                    }
                }
                finally {
                    if (timerLoadComponent)
                        timerLoadComponent.Stop();
                }
            }
            else if (info.readyState == 4 && info.status != 200) {
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
                if (timerLoadComponent)
                    timerLoadComponent.Abort();
            }
        }
        info.open('GET', "ADM_ADAPTER_CCL_DRIVER", true);
        info.send(paramAr.join(","));
    }

    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to RETRIEVE_ITEMS_TO_OVERRIDE and examines the reply status before
    //determining how to handle the reply.
    function GetItemsToOverrideCCLRequestWrapper(component, paramAr) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
            if (info.readyState == 4 && info.status == 200) {
                try {
                    var jsonEval = JSON.parse(info.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    
                    if (recordData.STATUS_DATA.STATUS == "Z") {
                        component.HandleSuccess(recordData);
                    } else if (recordData.STATUS_DATA.STATUS == "S") {
                        var userErrorMsg = "";
                        
                        // TODO: Clean up this logic
                        for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                            if (trim(recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME) == "USER_ERROR_MESSAGE") {
                                if (!recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL) {
                                    //The status block contained a message that needs to be displayed to the user.
                                    userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                } else {
                                    userErrorMsg = recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL;
                                }
                                
                                displayAlertMessage(i18n.ERROR_RETREIVING_OVERRIDE_INFO, userErrorMsg);
                            }
                        }

                        //If the get item to override was for a "searched med"
                        CERN_MEDS_OVERRIDE_01.curMedItemsToOverride=recordData.REPLY_DATA.OVERRIDE_ITEMS;
                        CERN_MEDS_OVERRIDE_01.curPhysicianInfo = recordData.REPLY_DATA.PHYSICIAN_INFO;
                        CERN_MEDS_OVERRIDE_01.curAdminSitesInfo = recordData.REPLY_DATA.ADMIN_SITES_INFO;
                        CERN_MEDS_OVERRIDE_01.curOverrideReasonsInfo = recordData.REPLY_DATA.OVERRIDE_REASONS_INFO;
                        CERN_MEDS_OVERRIDE_01.curOverrideReasonsRequiredIndicator = recordData.REPLY_DATA.OVERRIDE_REASONS_REQUIRED_IND;
                        CERN_MEDS_OVERRIDE_01.curDefaultPhysicianName = recordData.REPLY_DATA.DEFAULT_PHYSICIAN_NAME;
                            
                        if (CERN_MEDS_OVERRIDE_01.curMedItemsToOverride != null && CERN_MEDS_OVERRIDE_01.curMedItemsToOverride != "") {
                            CERN_MEDS_OVERRIDE_01.curMedItemIndex = 0;
                            CERN_MEDS_OVERRIDE_01.ShowIntendedDoseForm();
                        } else {
                            CERN_MEDS_OVERRIDE_01.ShowRetrieveOverrideItemsOptions();
                        }
                    } else {
                        var errorAr = [];
                        var userErrorMsg = "";
                        
                        if (!recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL) {
                            for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                                if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME == "USER_ERROR_MESSAGE") {
                                    //The status block contained a message that needs to be displayed to the user.
                                    userErrorMsg = recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE;
                                    displayAlertMessage(i18n.UNABLE_TO_FIND, userErrorMsg);
                                    CERN_MEDS_OVERRIDE_01.ShowRetrieveOverrideItemsOptions();
                                }
                            }
                            
                            if (userErrorMsg == "") {
                                alert(i18n.ERROR_CONTACT_SYSTEM_ADMIN);
                                
                                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
                            }
                        } else {
                            userErrorMsg = recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL;
                            displayAlertMessage(i18n.UNABLE_TO_FIND, userErrorMsg);
                            CERN_MEDS_OVERRIDE_01.ShowRetrieveOverrideItemsOptions();
                        }

                        if (userErrorMsg == "") {
                            var statusData = recordData.STATUS_DATA;
                            errorAr.push(
                                    statusData.STATUS,
                                    statusData.SUBEVENTSTATUS.OPERATIONNAME,
                                    statusData.SUBEVENTSTATUS.OPERSATIONSTATUS,
                                    statusData.SUBEVENTSTATUS.TARGETOBJECTNAME,
                                    statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
                            
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
    function SearchForMedToOverrideCCLRequestWrapper(component, paramAr) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
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
                        CERN_MEDS_OVERRIDE_01.ShowOverrideSearchResultsForm(component,recordData.REPLY_DATA.ITEMS);
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
                            errorAr.push(
                                    statusData.STATUS,
                                    statusData.SUBEVENTSTATUS.OPERATIONNAME,
                                    statusData.SUBEVENTSTATUS.OPERSATIONSTATUS,
                                    statusData.SUBEVENTSTATUS.TARGETOBJECTNAME,
                                    statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
                        }
                        MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
                    }
                }
                catch (err) {
                    if (timerLoadComponent) {
                        timerLoadComponent.Abort();
                        timerLoadComponent = null;
                    }
                }
                finally {
                    if (timerLoadComponent)
                        timerLoadComponent.Stop();
                }
            }
            else if (info.readyState == 4 && info.status != 200) {
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace()), component, "");
                if (timerLoadComponent)
                    timerLoadComponent.Abort();
            }
        }
        info.open('GET', "ADM_ADAPTER_CCL_DRIVER", true);
        info.send(paramAr.join(","));
    }

    function SortByMedName(a, b) {
        BuildOverrideMedDisplayName(a)
        BuildOverrideMedDisplayName(b)
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
} ();
