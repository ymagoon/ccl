/**
 * Project: omni_mp_remote_services_comps.js
 * Version: 1.0.0
 * Released: 8/2/2013
 * Begin Omnicell MPage component (Med Availability, Waste Documentation, User Maintenance) Development
 * @author Greg Howdeshell (GH7199)
 * @author Ryan Biller (RB015993)
 * @author Woncheul Kim (WK026081)
 *   Note: A large portion of the java script and ccl middle layer were developed using
 *           the inpatient summary version 2 code and specifically the medications component
 *           within the ip_summary_v2.
 */


/**
 * Project: mp_demographics_o1.js
 * Version 1.0.0
 * Released 7/23/2010
 * @author Greg Howdeshell (GH7199)
 */
//TODO: Do we need to implement our own MP_GET_PATIENT_DEMO ccl? This all works fine now but if they make changes down the road to
//MP_GET_PATIENT_DEMO it could create issues with our front end javaScript code here.
var CERN_DEMO_BANNER_O1 = function(){
    return {
        GetPatientDemographics: function(demoBanner, criterion){
            timerPatDemLoad = MP_Util.CreateTimer("USR:MPG.DEMO_BANNER.O1 - load component");
            if (timerPatDemLoad) 
                timerPatDemLoad.Start();
            
            var info = new XMLCclRequest();
            
            info.onreadystatechange = function(){
                if (info.readyState == 4 && info.status == 200) {
                    var timer = MP_Util.CreateTimer("ENG:MPG.DEMO_BANNER.O1 Ð render component");
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
                        
                        var oSex = MP_Util.GetValueFromArray(patInfo.SEX_CD, codeArray); //codeObject.display - will give the display name associated with the code value
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
                                isolation = isoObj.display
                        }
                        
                        var sexAbb = (oSex != null) ? oSex.display : i18n.UNKNOWN;
                        
                        jsHTML.push("<dl class='dmg-info'><dt class='dmg-pt-name-lbl'><span>", i18n.NAME, "</span></dt><dd class='dmg-pt-name'><span>", nameFull, "</span></dd><dt class='dmg-sex-age-lbl'><span>", i18n.SEX, " ", i18n.AGE, "</span></dt><dd class='dmg-sex-age'><span>", sexAbb, " ", age, "</span></dd><dt><span>", i18n.DOB, ":</span></dt><dd class='dmg-dob'><span>", birthDate, "</span></dd><dt><span>", i18n.MRN, ":</span></dt><dd class='dmg-mrn'><span>", mrnNbr, "</span></dd><dt><span>", i18n.FIN, ":</span></dt><dd class='dmg-fin'><span>", finNbr, "</span></dd><dt><span>", i18n.ISOLATION, ":</span></dt><dd class='dmg-isolation'><span>", isolation, "</span></dd><dt><span>", i18n.VISIT_REASON, ":</span></dt><dd class='dmg-rfv'><span>", visitReason, "</span></dd></dl>");
                        
                        demoBanner.innerHTML = jsHTML.join("");
                    }
                    finally {
                        if (timer) 
                            timer.Stop();
                        
                        if (timerPatDemLoad) 
                            timerPatDemLoad.Stop();
                    }
                }; //if
                            } //function
            //  Call the ccl progam and send the parameter string
            info.open('GET', "MP_GET_PATIENT_DEMO", 0);
            var sendVal = "^MINE^, " + criterion.person_id + ".0, " + criterion.encntr_id + ".0";
            info.send(sendVal);
        }
    };
}();

function displayAlertMessage(desc, detail) {
    alert(desc + '\n' + detail);
}

/**
 * Denotes the type of ADM.
 * @arg admTypeInd CFN:0, RXS:1, OMNI:2
 * @throws Invalid ADM Type exception for any value other than CFN, RXS, OMNI
*/
function AdmType(admType) {
    if(admType < 0 ||  admType > 2)
        throw "Invalid ADM Type: " + admType;
    
    var admTypeIndicator = admType;
    
    return {
        getTypeIndicator: function() { return admTypeIndicator; },
        isRxStation: function() { return admTypeIndicator == 1; },
        isCareFusion: function() { return admTypeIndicator == 0; },
        isOmnicell: function() { return admTypeIndicator == 2; }
    };
}

/**
 * Denotes the area type.
 * @arg areaTypeInd ISSUE_BASED:0, ADMIN_BASED:1
 * @throws Invalid Area Type exception for any value other than ISSUE_BASED, ADMIN_BASED
*/
function AreaType(areaType) {
    if(areaType < 0 ||  areaType > 1)
        throw "Invalid Area Type: " + areaType;
    
    var areaTypeIndicator = areaType;
    
    return {
        getTypeIndicator: function() { return areaTypeIndicator; },
        isIssueBased: function() { return areaTypeIndicator == 0; },
        isAdminBased: function() { return areaTypeIndicator == 1; }
    };
}


/**
 * Denotes the med availability of ADM.
 * @arg admTypeInd CFN:0, RXS:1, OMNI:2
 * @throws Invalid ADM Type exception for any value other than CFN, RXS, OMNI
*/
function AdmMedAvailability(admMedAvailability) {
    if(admMedAvailability < -1 ||  admMedAvailability > 5)
        throw "Invalid ADM Type: " + admType;
    
    var admMedAvailabilityIndicator = admMedAvailability;
    var medAvailabilityText = '';
    var medAvailabilityStyle = '';
    
    switch (admMedAvailabilityIndicator) {
        case 0:
            // NOT_AVAILABLE
            medAvailabilityText = i18n.MED_UNAVAILABLE;
            medAvailabilityStyle = "omni-med-alt-loc-stock-unknown";
            break;
        case 1:
            // AVAILABLE
            medAvailabilityText = i18n.IN_STOCK;
            medAvailabilityStyle = "med-alt-loc-in-stock";
            break;
        case 2:
            // STOCK_OUT
            medAvailabilityText = i18n.OUT_OF_STOCK;
            medAvailabilityStyle = "omni-med-alt-loc-out-of-stock";
            break;
        case 3:
            // INSUFFICIENT_QTY
            medAvailabilityText = i18n.INSUFFICENT_QUANTITY;
            medAvailabilityStyle = "omni-med-alt-loc-out-of-stock";
            break;
        case 4:
            // NOT_LOADED
            medAvailabilityText = i18n.MED_UNAVAILABLE;
            medAvailabilityStyle = "omni-med-alt-loc-stock-unknown";
            break;
        case 5:
            // USER_NO_ACCESS
            medAvailabilityText = i18n.USER_NO_ACCESS;
            medAvailabilityStyle = "omni-med-alt-loc-stock-unknown";
            break;
        default:
            medAvailabilityText = i18n.QUANTITY_UNKNOWN;
            medAvailabilityStyle = "omni-med-alt-loc-unknown";
    }
    
    return {
        getTypeIndicator: function() { return admMedAvailabilityIndicator; },
        getMedAvailabilityText: function() { return medAvailabilityText; },
        getMedAvailabilityStyle: function() { return medAvailabilityStyle; }
    };
}

function buildInitLoadingPage(component) {
    var sHTML = "<div class='sub-sec' style='vertical-align:middle;'><h3 class='sub-sec-hd' style='position:relative;height:200px;line-height:180px;text-align:center;'>" + i18n.LOADING_DATA + "</h3><div style='position:absolute;display:block;top:0;left:0;width:100%;height:100%;'><img src='" + component.getCriterion().static_content + "\\images\\loading.gif' style='margin:0 auto;height:100%;display:block;'/></div></div>";
    
    return sHTML;
}

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
    
    UserMaintComponent.method("InsertData", function(){
        var user = Session.get("user");
        
        if (user == undefined) {
            CERN_USER_MAINT_01.AuthenticateCurrentUser(this, "");
        } else {
            CERN_USER_MAINT_01.UserAuthenticationConfirmed(this, user);
        }
    });
    UserMaintComponent.method("HandleSuccess", function(recordData){
        CERN_USER_MAINT_01.RenderComponent(this, recordData);
    });
}
UserMaintComponent.inherits(MPageComponent);

/**
  * User Maintenance methods
  * @namespace CERN_USER_MAINT_01
  * @static
  * @global
  */
var CERN_USER_MAINT_01 = function () {
    var comp = null;

    return {
        AuthenticateCurrentUser: function (component, admUserId) {
            this.comp = component;
            CERN_USER_MAINT_01.PrepareUserMaintRequest("", "", "", 0);  //0=Authenticate
        },
        RenderComponent: function (component, recordData) {
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
                                    if (!confirm(i18n.CONFIRM_REGISTER.replace("{0}", replyData.USER.NATIVE_ID).replace("{1}", replyData.USER.USER_NAME))) {
                                        CERN_USER_MAINT_01.PrepareUserMaintRequest("", "", "", 2); //2=Unregister Foreign User
                                    } else {
                                        CERN_USER_MAINT_01.PrepareUserMaintRequest("", "", "", 0);
                                        CERN_MEDS_01.comp.InsertData();
                                    }
                                    //CERN_USER_MAINT_01.AwaitingRegistrationConfirmation(component);
                                    break;
                                case 1:
                                    if (replyData.USER != null) {
                                        CERN_USER_MAINT_01.UserAuthenticationConfirmed(component, replyData.USER);
                                        CERN_MEDS_01.comp.setUser(replyData.USER);
                                        CERN_MEDS_WASTE_01.comp.setUser(replyData.USER);
                                        CERN_MEDS_OVERRIDE_01.comp.setUser(replyData.USER);
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
                        } else {
                            CERN_MEDS_01.comp.setUser(null);
                            CERN_MEDS_WASTE_01.comp.setUser(null);
                            CERN_USER_MAINT_01.BuildADMUserRegistrationForm(component, replyData);
                            CERN_MEDS_OVERRIDE_01.comp.setUser(null);
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
        ForeignUserAccountLocked: function (component) {
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
        AwaitingRegistrationConfirmation: function (component) {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.NEED_TO_CONFIRM_REGISTRATION, "</span></h3></div>");
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl><dd class='med_unregister_link'><span><A onClick=CERN_USER_MAINT_01.UnregistrationConfirmation()>", i18n.UNREGISTER, "</A></span></dd>")

            content.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, component, "");
        },
        UserAuthenticationConfirmed: function (component, user) {
            Session.set("user", user);
            
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            
            var userRegistrationConfirmed = "";
            userRegistrationConfirmed = i18n.MED_LINK_ESTABLISHED.replace("{0}", user.NATIVE_ID).replace("{1}", user.USER_NAME);
            
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", userRegistrationConfirmed, "</span></h3></div>");
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl><dd class='med_unregister_link'><span><A onClick=CERN_USER_MAINT_01.UnregistrationConfirmation()>", i18n.UNREGISTER, "</A></span></dd>")

            content.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, component, "");
        },
        UnregistrationConfirmation: function () {
            if (confirm(i18n.CONFIRM_UNREGISTER)) {
				Session.set("user", null);
				CERN_MEDS_01.comp.setUser(null);
                CERN_USER_MAINT_01.UnregisterUser(CERN_USER_MAINT_01.comp);
            }
        },
        PrepareUserMaintRequest: function (native_id, foreign_id, user_pswd, transaction_ind) {
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
            UserMaitenanceCCLRequestWrapper(this.comp, sendAr, transaction_ind);
        },
        BuildADMUserRegistrationForm: function (component, replyData) {
            var sHTML = "";
            var jsHTML = [];
            var content = [];

            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.NEED_TO_REGISTER_USER, "</span><br/>");
            jsHTML.push("<input type='text' name='admUserIDInput' onClick='this.select();' onkeydown='CERN_USER_MAINT_01.AdmUserIdInput_KeyDown()' value=''>");
            jsHTML.push("<input type='button' name='admUserIDButton' onClick='CERN_USER_MAINT_01.RegisterUser()' value='", i18n.REGISTER_BUTTON, "'>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, component, "");
        },
        AdmUserIdInput_KeyDown: function () {
            if (event.keyCode == 13)
                document.getElementById('admUserIDButton').click();
        },
        RegisterUser: function () {
            var userIdTxt = document.getElementById('admUserIDInput').value;
            if (userIdTxt != "") {
                CERN_USER_MAINT_01.PrepareUserMaintRequest("", userIdTxt, "", 1);  //1=Register Foreign User
            }
            // TODO show the exception message that tells the user text cannot be empty.
        },  
        UnregisterUser: function () {
            CERN_USER_MAINT_01.PrepareUserMaintRequest("","","",2);    //2=Unregister Foreign User
        }
    };
    
    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER for User_Maintenance calls and examines the reply status before
    //determining how to handle the replyData.
    function UserMaitenanceCCLRequestWrapper(component, paramAr, transactionInd) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
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
                        
                        CERN_USER_MAINT_01.RenderComponent(component, recordData);
                    } else {
                        var alertDisplayed = false;
                        
                        if (!recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL) {
                            for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                                if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME.indexOf("UserMaintenanceManager") != -1) {
                                    //The status block contained a message that needs to be displayed to the user.
                                    alertDisplayed = true;
                                    displayAlertMessage(i18n.UNABLE_TO_PROCESS, recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE);
                                }
                            }
                            
                            if (!alertDisplayed) {
                                alert(i18n.ERROR_CONTACT_SYSTEM_ADMIN);
                            }
                        } else {
                            displayAlertMessage(i18n.UNABLE_TO_PROCESS, recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL);
                        }
                        
                        if (transactionInd != 0) {
                            CERN_USER_MAINT_01.RenderComponent(component, recordData);
                        } else {
                            var sHTML = "";
                            var jsHTML = [];
                            var content = [];
                            
                            if (!recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL) {
                                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.ERROR_CONTACT_SYSTEM_ADMIN, "</span>");
                            } else {
                                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.ERROR_CONTACT_SYSTEM_ADMIN, "<br>", recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL, "</span>");
                            }
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
} ();

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
 *         the inpatient summary version 2 code and specifically the medications component
 *         within the ip_summary_v2.
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
    this.m_lookBackHours = 2;  //Default look back will be 2 hours
    this.m_lookAheadHours = 6;  //Default look ahead will be 6 hours
    CERN_MEDS_01.comp = this;
    this.m_queueTasksPending = 0;
    this.m_queueTaskOrderIds = [];
    this.m_intendedDose = [];
    this.m_user = Session.get("user");
    this.m_admType = new AdmType(m_adm_type);
    this.m_queueTasksDTTMs = new Object();
    this.m_queueTaskDTTMs = new Object();
    this.m_isQueueStatus= new Object();
    this.m_loading = false;
    this.m_error = false;
    
    MedicationsComponent.method("setUser", function(value) {
    	this.m_user = value;
    	
        if (this.m_loading == false && this.m_error == false) {
            CERN_MEDS_01.RenderCache();
        }
    });
    MedicationsComponent.method("getUser", function() {
        return this.m_user;
    });
    MedicationsComponent.method("InsertData", function() {
        this.m_loading = true;
        
        if (this.getUser() == undefined) {
            CERN_MEDS_01.GetMedications(this, null);
        } else {
            CERN_MEDS_01.GetMedications(this, this.getUser());
        }
    });
    MedicationsComponent.method("HandleSuccess", function(recordData) {
        this.m_error = false;
        CERN_MEDS_01.RenderComponent(this, recordData);
        this.m_loading = false;
    });
    MedicationsComponent.method("HandleError", function() {
        this.m_error = true;
    });
    MedicationsComponent.method("setLookBackHours", function(value) {
        this.m_lookBackHours = value; 
    });
    MedicationsComponent.method("getLookBackHours", function() { 
        return this.m_lookBackHours; 
    });
    MedicationsComponent.method("setLookAheadHours", function(value) {
        this.m_lookAheadHours = value;
    });
    MedicationsComponent.method("getLookAheadHours", function() { 
        return this.m_lookAheadHours;
    });
    MedicationsComponent.method("addQueueableTaskOrderId", function (value) {
        this.m_queueTaskOrderIds.push(value);
    });
    MedicationsComponent.method("clearQueueableTaskOrderIds", function () {
        this.m_queueTaskOrderIds = [];
    });
    MedicationsComponent.method("getQueueableTaskOrderIds", function () {
        return this.m_queueTaskOrderIds;
    });
    MedicationsComponent.method("addIntendedDose", function (value) {
        this.m_intendedDose.push(value);
    });
    MedicationsComponent.method("clearIntendedDose", function () {
        this.m_intendedDose = [];
    });
    MedicationsComponent.method("getIntendedDose", function () {
        return this.m_intendedDose;
    });
    MedicationsComponent.method("setAdmType", function(value) {
        this.m_admType = value;
    });
    MedicationsComponent.method("getAdmType", function() {
        return this.m_admType;
    });
    MedicationsComponent.method("addQueueableTasksDTTM", function (key, value) {
        if (this.m_queueTasksDTTMs[key] == undefined) {
            this.m_queueTasksDTTMs[key] = [];
        }
        this.m_queueTasksDTTMs[key].push(value);
    });
    MedicationsComponent.method("clearQueueableTasksDTTMs", function (key) {
        this.m_queueTasksDTTMs[key] = [];
    });
    MedicationsComponent.method("getQueueableTasksDTTMs", function (key) {
        if (this.m_queueTasksDTTMs[key] == undefined) {
            return [];
        }
        return this.m_queueTasksDTTMs[key];
    });
    MedicationsComponent.method("addQueueableTaskDTTM", function (key, value) {
        this.m_queueTaskDTTMs[key] = value;
    });
    MedicationsComponent.method("clearQueueableTaskDTTM", function (key) {
        this.m_queueTaskDTTMs[key] = null;
    });
    MedicationsComponent.method("getQueueableTaskDTTM", function (key) {
        return this.m_queueTaskDTTMs[key];
    });
    MedicationsComponent.method("addIsQueueStatus", function (key, value) {
        this.m_isQueueStatus[key] = value;
    });
    MedicationsComponent.method("clearIsQueueStatus", function (key) {
        this.m_isQueueStatus[key] = null;
    });
    MedicationsComponent.method("getIsQueueStatus", function (key) {
		return this.m_isQueueStatus[key];
    });
}
MedicationsComponent.inherits(MPageComponent);

 /**
  * Medication methods
  * @namespace CERN_MEDS_01
  * @static
  * @global
  */
var CERN_MEDS_01 = function () {
    var comp = null;
    var unable_to_queue_reason = null;

    return {
        WaitingForAuthentication: function() {
            //Display a waiting for authentication message until the component has a valid user
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.WAITING_FOR_USER_AUTH + "... </span><br/>";
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        GetMedications: function (component, admUser) {
            this.comp = component;
            var startDate = new Date();
            startDate.setTime(startDate.getTime() - (component.getLookBackHours() * 3600000.0)); //look back is 2 hours by default
            var endDate = new Date();
            endDate.setTime(endDate.getTime() + (component.getLookAheadHours() * 3600000.0)); //look ahead is 6 hours by default
            var criterion = component.getCriterion();
            var sendAr = [];
	    this.comp.clearIntendedDose();
            
            var med_availability_request = new Object();
            med_availability_request.patient_id = criterion.person_id + ".0";
            med_availability_request.encounter_id = criterion.encntr_id + ".0";
            med_availability_request.start_date_time = startDate.format("dd-mmm-yyyy HH:MM:ss");
            med_availability_request.end_date_time = endDate.format("dd-mmm-yyyy HH:MM:ss");
            med_availability_request.provider_id = criterion.provider_id + ".0";
            if (admUser == null) {
                med_availability_request.provider_foreign_id = "";
            } else {
                med_availability_request.provider_foreign_id = admUser.NATIVE_ID;
            }
            med_availability_request.adm_type_ind = component.getAdmType().getTypeIndicator();
            med_availability_request.position_cd = criterion.position_cd + ".0";
            
            var json_object = new Object();
            json_object.med_availability_request = med_availability_request;

            var json_request = JSON.stringify(json_object);

            //Format dates nicely for easy conversion on ccl side using cnvtdatetime
            //Also, it is necessary the dates be wrapped in a carrot character (^) in order to be distinguished as strings
            sendAr.push("^MINE^", "^MED_AVAILABILITY^", "^" + json_request + "^");
            GetMedicationsCCLRequestWrapper(component, sendAr);
            
            //The get med availability can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
            var sHTML = BuildLoadingMedAvailabilityDetails(this.comp);
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        RenderComponent: function (component, recordData) {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
 
            try {
                var sHTML = "", countText = "";
                var replyData = recordData.REPLY_DATA;

                if (replyData != null) {
                    var warning = [];
                    
                    if (!replyData.CASERVICE_STATUSINFO.OPERATION_DETAIL) {
			sHTML = BuildMedAvailabilityDetails(component, replyData.ORDERS);
                    } else {
                        warning.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'><b>", i18n.WARNING, "</b> ", recordData.REPLY_DATA.CASERVICE_STATUSINFO.OPERATION_DETAIL, "</span><br/></h3></div>", "</div>");
                        sHTML = BuildMedAvailabilityDetails(component, replyData.ORDERS).concat(warning.join(""));
                    }
                    
                    MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
                    
                    Session.set("med_avail", replyData.ORDERS);
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
        RenderCache: function () {
            var cache = Session.get("med_avail");
            
            if (cache == undefined) {
                sHTML = "<div class='" + MP_Util.GetContentClass(this.comp, 0) + "'>" + MP_Util.HandleNoDataResponse(this.comp.getStyles().getNameSpace()) + "</div>";
            } else {
                sHTML = BuildMedAvailabilityDetails(this.comp, cache);
            }
            
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        DisplayGeneralInfo: function (orderAndTaskIds) {
            var hoverId = "hover_" + orderAndTaskIds;
            var contentId = "content_" + orderAndTaskIds;
            var alertsId = "alerts_" + orderAndTaskIds;
            var extraId = "extra_" + orderAndTaskIds;
            document.getElementById(hoverId).style.visibility = "visible";
            document.getElementById(contentId).style.display = "inline";
            document.getElementById(alertsId).style.display = "none";
            document.getElementById(extraId).style.display = "none";
        },
        DisplayAlerts: function (orderAndTaskIds) {
            var hoverId = "hover_" + orderAndTaskIds;
            var contentId = "content_" + orderAndTaskIds;
            var alertsId = "alerts_" + orderAndTaskIds;
            var extraId = "extra_" + orderAndTaskIds;
            document.getElementById(hoverId).style.visibility = "visible";
            document.getElementById(contentId).style.display = "none";
            document.getElementById(alertsId).style.display = "inline";
            document.getElementById(extraId).style.display = "none";
        },
        DisplayAdditionalInfo: function (orderAndTaskIds, message) {
            var hoverId = "hover_" + orderAndTaskIds;
            var contentId = "content_" + orderAndTaskIds;
            var alertsId = "alerts_" + orderAndTaskIds;
            var extraId = "extra_" + orderAndTaskIds;
            document.getElementById(extraId).innerHTML = message;
            document.getElementById(hoverId).style.visibility = "visible";
            document.getElementById(contentId).style.display = "none";
            document.getElementById(alertsId).style.display = "none";
            document.getElementById(extraId).style.display = "inline";
        },
        DisplayNoHover: function (orderAndTaskIds) {
            var hoverId = "hover_" + orderAndTaskIds;
            document.getElementById(hoverId).style.visibility = "hidden";
        },

	isNumberKey: function (event) {
            var charCode = (event.which) ? event.which : event.keyCode;
            if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            } else {
		//if dot sign entered more than once then don't allow to enter dot sign again. 46 is the code for dot sign
		var parts = event.srcElement.value.split('.');
		if (parts.length > 1 && charCode == 46)
		    return false;
		return true;
	    }
            return true;
        },
		
	isInteger: function (number) {
	    return number % 1 === 0;
	},

	ValidateIntendedDosage: function (orderAndTaskId,minimumDose,maximumDose) {
            var intendedTextName= "intendedDosageText" + orderAndTaskId;
	    var intendedDoseImageId = "imageId" + orderAndTaskId;
			
	    var intendedDosage = document.getElementById(intendedTextName).value;
            var imageVisibility = "none";
	    document.getElementById(intendedTextName).style.border = '1pxs solid #E0E1E1';
	    if (intendedDosage != "") {
		var numberFormat = new NumberFormat();
                var roundedIntendedDosage = numberFormat.truncate(intendedDosage, 4);
				
		var a = (parseFloat(roundedIntendedDosage) - parseFloat(minimumDose));
		var b = (parseFloat(roundedIntendedDosage) - parseFloat(maximumDose));
					
		if (a < 0 || b > 0){
		    document.getElementById(intendedTextName).style.border = '1pxs solid #F7730E';
		    imageVisibility="inline";	
		} else {
		    document.getElementById(intendedTextName).value = roundedIntendedDosage;
		}
            } else {
		    document.getElementById(intendedTextName).style.border = '1pxs solid #F7730E';
		    imageVisibility="inline";
		}
	    document.getElementById(intendedDoseImageId).style.display = imageVisibility;
        },

	UnableToQueueReason: function (component, reason) {
	    var warning = [];
	    var sHTML = "", countText = "";
	    var cache = Session.get("med_avail");

	    if(reason != null)
	    {
		warning.push("<div class='", MP_Util.GetContentClass(component, 0), "'>", "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'><b>", i18n.WARNING, "</b> ",i18n.UNABLE_TO_QUEUE, reason, "</span><br/></h3></div>", "</div>");
		if (cache == undefined) {
		    sHTML = "<div class='" + MP_Util.GetContentClass(component, 0) + "'>" + MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()) + "</div>";
		} else {
		    sHTML = BuildMedAvailabilityDetails(component, cache).concat(warning.join(""));
		}
	    } else {
		sHTML = BuildMedAvailabilityDetails(component, cache);
	    }
	    MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
	},
		
	LoadingMedAvailability: function(component) {
	    var sHTML = BuildLoadingMedAvailabilityDetails(this.comp);
	    return sHTML;
	}
    };

    function BuildMedAvailabilityDetails(component, orders) {
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
        var alerts = [];
        var jsonPRN = [];
        var jsonSched = [];
        var jsonCont = [];
        var jsonUnsched = [];
        var isRxStation = component.getAdmType().isRxStation();

        //Spin through the orders and file them in the respective orderType category array
        for (var x = 0 in orders) {
            var order = orders[x];
            var schedule = order.ORDERTYPE;
            
            if (schedule.toUpperCase() == "PRN") {
                jsonPRN.push(order);
            } else if (schedule.toUpperCase() == "CONTINUOUS") {
                jsonCont.push(order);
            } else if (schedule.toUpperCase() == "SCHEDULED") {
                jsonSched.push(order);
            }else if (schedule.toUpperCase() == "UNSCHEDULED"){
                jsonUnsched.push(order);
            }
        }

        //Sort the meds in each type category by the medication name
        jsonPRN.sort(SortByMedicationName);
        jsonSched.sort(SortByTaskDtTm);
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
            alerts = [];
            var order = jsonFinal[j];
            var medTaskDtTm = "", startDtTm = "", lastDispenseDtTm = "";
            var medName = GetMedicationDisplayName(order); //Get the medication display line
            var orderedBy = order.ORDERENTEREDBY; //Who placed the order
            var alertsExist = false;

            //Determine the order type category for this given order and set the indicator
            var isPrnInd = 0, isContinuousInd = 0, isScheduledInd = 0, isUnscheduledInd = 0, orderStatusInd = 0;//NOTE: orderStatusInd of 0 = verified, 1 = unverified, 2 = rejected
            var orderType = order.ORDERTYPE;
            
            if( order.ISVERIFIED == 0 ){
                orderStatusInd = 1;
            }
            
            if( order.ISREJECTED == 1 ){
                orderStatusInd = 2;
            }
            
            if (orderType.toUpperCase() == "PRN") {
                isPrnInd = 1;
            } else if (orderType.toUpperCase() == "CONTINUOUS") {
                isContinuousInd = 1;
            } else if (orderType.toUpperCase() == "SCHEDULED") {
                isScheduledInd = 1;
            }else if (orderType.toUpperCase() == "UNSCHEDULED"){
                isUnscheduledInd = 1;
            }

            var dateTime = new Date();
            var sDate = order.TASKDTTM;
            dateTime.setISO8601(sDate);
            //Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
            if (!dateTime.isZeroDate(sDate)) {
                //Medication task date time that will be displayed in heads up view in the med component
                medTaskDtTm = dateTime.format("longDateTime2");
                component.addQueueableTaskDTTM(order.TASKID, dateTime.format('isoDateTime'));
            }

            dateTime = new Date();
            sDate = order.STARTDTTM;
            dateTime.setISO8601(sDate);
            //Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
            if (!dateTime.isZeroDate(sDate)) {
                //Order start date time for display within the med hover window
                startDtTm = dateTime.format("longDateTime2");
            }

            dateTime = new Date(0);
            sDate = order.LASTDISPENSEDTTM;
            dateTime.setISO8601(sDate);
            //Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
            if (!dateTime.isZeroDate(sDate)) {
                //Order last dispensed date time for display within the med hover window
                lastDispenseDtTm = dateTime.format("longDateTime2");
            }

            var jsSeverity = "res-normal";
            
            var orderAndTaskIds = order.PARENTORDERID + "|" + order.TASKID;
	    // If the status is not defined yet assign it to isQueued parameter of the reply,
	    // Else leave the value undisturbed
	    if((component.getIsQueueStatus(order.PARENTORDERID)) == undefined){
		component.addIsQueueStatus(order.PARENTORDERID, order.ISQUEUED);
	    }
				
	    //BEGIN: Building heads up medication row
            //Building display for medications table
	    if(component.getIsQueueStatus(order.PARENTORDERID) == 1) {
                //If the order is already queued, apply the appropriate css to show the order row in the "queue indicator" color
                item.push("<dl class='med-info med-order-queued' id='medInfoRow", orderAndTaskIds, "'>");
            } else {
                //Color the unverified and rejected rows with a gray background to illustrate the difference from verified orders (in addition to the relevent icon)
                if(orderStatusInd > 0) {
                    item.push("<dl class='med-info med-order-unverified' id='medInfoRow", orderAndTaskIds, "'>");
                } else {
                    item.push("<dl class='med-info med-order-dequeued' id='medInfoRow", orderAndTaskIds, "'>");
                }
            }

            //Medication task date time column... but only for scheduled orders
            if (isScheduledInd == 1) {
                item.push("<dd class= 'med-date'><span class='", jsSeverity, "'>", medTaskDtTm, "</span></dd>");
            } else {
                item.push("<dd class= 'med-date'><span class='", jsSeverity, "'></span></dd>");
            }

            //Medication name column
            item.push("<dd class= 'med-name'><span class='", jsSeverity, "'>");
            if(orderStatusInd == 1) {
                //Unverified order icon
                item.push("<img src='", component.getCriterion().static_content, "\\images\\5150_24.png' title='", i18n.UNVERIFIED_ICON, "' onmouseover='CERN_MEDS_01.DisplayNoHover(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")'/>&nbsp;");
            } else if(orderStatusInd == 2) {
                //Rejected order icon
                item.push("<img src='", component.getCriterion().static_content, "\\images\\6669_24.png' title='", i18n.REJECTED_ICON, "' onmouseover='CERN_MEDS_01.DisplayNoHover(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")'/>&nbsp;");
            }
            
            // Witness Required Icon
            for (var k = 0 in order.ORDERITEMS) {
                var orderItem = order.ORDERITEMS[k];
                if(orderItem.WITNESSREQUIREDIND == 1) {
                    item.push("<img src='", component.getCriterion().static_content, "\\images\\omni-witness.png' height='24' width='24' title='", i18n.WITNESS_REQURED_ICON, "' onmouseover='CERN_MEDS_01.DisplayNoHover(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")'/>&nbsp;");
                    break;
                }
            }
            
            // Alerts Information
            alerts.push("<dl class='med-det' id='alerts_", orderAndTaskIds, "' style='display:none'>");
            
            for (var i = 0 in order.ORDERITEMS) {
                var orderItem = order.ORDERITEMS[i];
                
                for (var j = 0 in orderItem.DISPENSEALERTS) {
                    if (j == 0) {
                        alerts.push("<dt><span><u><b>", orderItem.ITEMDESC, ":</b></u></span><br/></dt>");
                        alertsExist = true;
                    }
                    
                    var dispenseAlert = orderItem.DISPENSEALERTS[j];
                    
                    alerts.push("<dd class='med-name-desc'><span><b>~</b> ", dispenseAlert.ALERTVALUE, "</span><br/></dd>");
                }
            }
            
            alerts.push("</dl>");
            
            if (alertsExist) {
                item.push("<img src='", component.getCriterion().static_content, "\\images\\omni-alert.png' height='23' width='23' onmouseover='CERN_MEDS_01.DisplayAlerts(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")'/>&nbsp;");
            }
            
            item.push( medName, "</span></dd>");
            
            //Finding preferred location and building alternate location array
            var preferredLocation = null;
	    var tempLocation = null;
            var alternateLocations = new Array();
            var orderedItems = new Array();
            var altLocationCount = 0;
            for (var x = 0 in order.DISPENSEROUTINGLOCATIONS) {
                var location = order.DISPENSEROUTINGLOCATIONS[x];
                var dispenseLocation = null;
		if (location.BESTLOCATIONIND == 1) {
                    tempLocation = new DispenseLocation(location.LOCATIONDISP, location.ITEMAVAILABILITYIND, location.DISPENSELOCATIONTYPEIND, location.PATIENT_SPECIFIC_CABINET_IND);
		    dispenseLocation = tempLocation;
                } else if (location.PATIENT_SPECIFIC_CABINET_IND == 1 && preferredLocation == null) {
		    preferredLocation = new DispenseLocation(location.LOCATIONDISP, location.ITEMAVAILABILITYIND, location.DISPENSELOCATIONTYPEIND, location.PATIENT_SPECIFIC_CABINET_IND);
		    dispenseLocation = preferredLocation;
		} else {
                    //If the best location indicator is not set then add this location to the alternate locations array
                    alternateLocations[altLocationCount] = new DispenseLocation(location.LOCATIONDISP, location.ITEMAVAILABILITYIND, location.DISPENSELOCATIONTYPEIND, location.PATIENT_SPECIFIC_CABINET_IND);
                    dispenseLocation = alternateLocations[altLocationCount];
                    altLocationCount++;
                }
                
                // add pending tasks
                for(var taskIdx=0 in location.PENDINGTASKS){
                    var pendingTask = location.PENDINGTASKS[taskIdx]
                    dispenseLocation.addTask(new InventoryTask(pendingTask.TASKID, pendingTask.TASKTYPEDISP, pendingTask.LOCATIONCD, pendingTask.LOCATIONDISP));
                }
            } 
			
	    if(preferredLocation == null) {
		preferredLocation = tempLocation;
	    } else {
		alternateLocations[altLocationCount] = tempLocation;
	    }

            var enableQueueButton = false;
            if (isRxStation || preferredLocation != null) {
                if (preferredLocation != null) {
                    item.push("<dd class= 'med-device'><span class='"+jsSeverity+"'>");
                    // If the medicine is in patient specific bin of a location indicate the nurse with patient specific image.
                    if(preferredLocation.patientSpecificBinInd == 1) {
			item.push("<img src='", component.getCriterion().static_content, "\\images\\omni-psb.png' height='24' width='24' title='", i18n.PATIENT_SPECIFIC_BIN, "' onmouseover='CERN_MEDS_01.DisplayNoHover(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")'/>&nbsp;");
		    }
		    item.push(preferredLocation.location+"</span>");
					
					
                    //Don't display any message for Pharmacy locations (ie locationType == 0)
                    if(preferredLocation.locationType != 0) {
                        var admMedAvailability = new AdmMedAvailability(preferredLocation.availability);
                        item.push("<br/><span class=", admMedAvailability.getMedAvailabilityStyle(), ">", admMedAvailability.getMedAvailabilityText(), "</span>");
                    }
                    
                    var pendingTask = preferredLocation.getPendingTask();
                    if (pendingTask != null ) {
                        var pendingTaskDisplay = i18n.PENDING_INVENTORY_TASK_AT.replace("{0}", pendingTask.getTaskType());
                        pendingTaskDisplay = pendingTaskDisplay.replace("{1}", pendingTask.getLocationDisplay());
                        item.push("<br/><span class=", style, ">", pendingTaskDisplay, "</span>");
                    }
                    
                    // end the list
                    item.push("</dd>");
                } else {
                     //No preferred location was returned
                    item.push("<dd class= 'med-device'><span class='", jsSeverity, "'>", i18n.PREFERRED_LOC_UNKNOWN, "</span></dd>");
                }
                
                //Queue option should only be available for Med Station locations or ADMType is RxStation, if the order is actually queueable,
                //and user has can_queue indicator set
                if (order.ISQUEUEABLE == 1 && orderStatusInd == 0 && component.getUser() != null && component.getUser().USER_INDICATORS.CAN_QUEUE_IND == 1) {
                    enableQueueButton = true;
                }
            } else {
                //No preferred location was returned
                item.push("<dd class= 'med-device'><span class='", jsSeverity, "'>", i18n.PREFERRED_LOC_UNKNOWN, "</span></dd>");
            }
            
	    //If the prsnl_alias_link_status is 0, we do not have a confirmed link to the ADM system so we can not complete the queueing process
            //so do not show range dose, intended dose and buttons.
            var admUser_statusInfo = (component.getUser() == null ? null : component.getUser().ADMUSER_STATUSINFO);
            
            if (admUser_statusInfo != null) {
                var prsnl_alias_link_status = admUser_statusInfo.PRSNL_ALIAS_LINK_STATUS;
                
                if (prsnl_alias_link_status > 0) {
					
		    // Range Dose
		    item.push("<dd class= 'med-range-dose'>");
		    var maximumDose = 0;
		    // If the medication is a range dose medication show the minimum and maximum dose.
		    if(order.RANGE_DOSE_IND != undefined) {
			maximumDose = order.MAXIMUM_RANGE_DOSE;
			var minimumDose = order.MINIMUM_RANGE_DOSE;
			var measureUnits = order.AMOUNT_UNITS_OF_MEASURE;
			if(order.RANGE_DOSE_IND != 0) {
			    rangeDoseDisplay = i18n.DOSE_RANGE.replace("{0}", minimumDose);
			    rangeDoseDisplay = rangeDoseDisplay.replace("{1}", maximumDose);
			    item.push("<span >", rangeDoseDisplay, "</span>");
			}
		    }
		    item.push("</dd>");
                
		    // Intended Dose
		    var intendedTextName= "intendedDosageText" + orderAndTaskIds;
		    var intendedDoseImageId = "imageId" + orderAndTaskIds;
		    // Shows an exclamation image if the intended dose is out of range.
		    item.push("<dd class= 'med-intended-dose-image'><img id='",intendedDoseImageId,"' src='", component.getCriterion().static_content, "\\images\\omni-exclamation.png' height='15' width='15' title='", i18n.INVALID_INTENDED_DOSE, "' onmouseover='CERN_MEDS_01.DisplayNoHover(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")' style='display: none;' /></dd>");
			
		    // Enable the text box to get the intended dose only when the medication is range dose 
		    // If not a range dose the text box is readOnly (the value in the text box cants be changed)
		    if(order.RANGE_DOSE_IND != 0 && order.RANGE_DOSE_IND != undefined){
			item.push("<dd class= 'med-intended-dose-content'><input type='text' id='", intendedTextName, "' style='width:50%;' onClick='this.select();' onKeyPress='return CERN_MEDS_01.isNumberKey(event);' onBlur='CERN_MEDS_01.ValidateIntendedDosage(\"",orderAndTaskIds,"\",\"",minimumDose,"\",\"",maximumDose,"\");' >&nbsp;");
			item.push("<span class='sub-sec-title'>" + measureUnits + "</span></dd>");
		    } else {
			item.push("<dd class= 'med-intended-dose-content'><input type='text' id='", intendedTextName, "' value='", maximumDose, "' style='width:50%; background-color:#CCCCCC; color=#000000;' readOnly onmouseover='CERN_MEDS_01.DisplayNoHover(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")'></dd>");
		    }
			
		    // Queuing Buttons
                    item.push("<dd class= 'med-queue'><span class='", jsSeverity, "'>");
                    var taskId = order.TASKID;
                    if (enableQueueButton == true) {
                        // RxStation supports enqueue/dequeue. CareFusion only supports enqueue
                        var buttonName = "queueButton" + orderAndTaskIds;
                        var value = isRxStation && order.ISQUEUED ? i18n.REMOVE_FROM_QUEUE : i18n.ADD_TO_QUEUE;
                        item.push("<input type='button' name='", buttonName, "' value='", value, "' onmousedown='CERN_MEDS_01.ValidateIntendedDosage(\"",orderAndTaskIds,"\",\"",minimumDose,"\",\"",maximumDose,"\");' onClick='queueTask(\"",  orderAndTaskIds, "\")' >");
                        component.addQueueableTaskOrderId(orderAndTaskIds);
			component.addIntendedDose(maximumDose);

		    } else {
                        // RxStation supports enqueue/dequeue. CareFusion only supports enqueue
                        var buttonName = "queueButton" + orderAndTaskIds;
                        var value = isRxStation && order.ISQUEUED ? i18n.REMOVE_FROM_QUEUE : i18n.ADD_TO_QUEUE;
                        var reason = order.UNABLETOQUEUEREASON;
                        item.push("<span><input type='button' name='", buttonName, "' value='", value, "' title='", reason, "' disabled onmouseover='CERN_MEDS_01.DisplayNoHover(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")'></span>");
                        component.addQueueableTaskOrderId(orderAndTaskIds);
						component.addIntendedDose(maximumDose);
		    }
		    item.push("</span></dd>");
                }
            }
            
            // end the list
	    item.push("</dl>");
            //END: Building heads up medication row

            //BEGIN: Building medication hover details
            item.push("<h4 class='med-det-hd'><span>", i18n.MED_DETAIL, "</span></h4>");
            item.push("<div class='hvr' id='hover_", orderAndTaskIds, "'>");
            
            // General Information
            item.push("<dl class='med-det' id='content_", orderAndTaskIds, "'>");

            // Ordered items
            item.push("<dt><span><u><b>", i18n.MEDICATIONS, ":</b></u></span><br/></dt>");
            for (var k = 0 in order.ORDERITEMS) {
                var orderItem = order.ORDERITEMS[k];
                
                if (!orderItem.LASTISSUEDATA.ISSUEDTTMDISP) {
                    item.push("<dd class='med-name-desc'><span><b>~</b> ", orderItem.ITEMDESC, "</span><br/></dd>");
                } else {
		    if (!orderItem.LASTISSUEDATA.USERNAME) {
			item.push("<dd class='med-name-desc'><span><b>~</b> ", orderItem.ITEMDESC, " (", i18n.LAST_ISSUED ," ", orderItem.LASTISSUEDATA.ISSUEDTTMDISP,")</span><br/></dd>");
		    } else {
			var lastDispensed = i18n.LAST_DISPENSED_DATE_TIME_AND_BY.replace("{0}", orderItem.LASTISSUEDATA.ISSUEDTTMDISP);
			lastDispensed = lastDispensed.replace("{1}", orderItem.LASTISSUEDATA.USERNAME);
			item.push("<dd class='med-name-desc'><span><b>~</b> ", orderItem.ITEMDESC, " (", i18n.LAST_ISSUED ," ", lastDispensed,")</span><br/></dd>");
		    }		
                }
            }
            
            // Pending Request
            if (order.PENDINGREQUESTS != null) {
                item.push("<dt><span> <u><b>", i18n.PENDING_REQUEST, ":</b></u></span></dt><br/>");
                
                for (var k = 0 in order.PENDINGREQUESTS) {
                    var pendingRequest = order.PENDINGREQUESTS[k];
                    item.push("<dd class='med-det-dt'><span> ", pendingRequest.QUANTITY, " dose(s) queued by ", pendingRequest.USERNAME, " at ", pendingRequest.REQUESTDTTMDISP, "</span></dd><br/>");
                }
            }
            
            item.push("<dt><span> <u><b>", i18n.ALTERNATE_LOCATIONS, ":</b></u></span></dt>");
            
            // Add alternate locations list to hover
            for (var k = 0 in alternateLocations) {
                item.push("<dt><dd class='med-alt-loc'><span>");
                if(alternateLocations[k].patientSpecificBinInd == 1) {
			item.push("<img src='", component.getCriterion().static_content, "\\images\\omni-psb.png' height='24' width='24' title='", i18n.PATIENT_SPECIFIC_BIN, "' onmouseover='CERN_MEDS_01.DisplayNoHover(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")'/>&nbsp;");
		}
		item.push(alternateLocations[k].location, " </span></dd>");
		
                //Don't display any message for Pharmacy locations (ie locationType == 0)
                if(alternateLocations[k].locationType != 0) {
                    var admMedAvailability = new AdmMedAvailability(alternateLocations[k].availability);
                    var pendingTask = alternateLocations[k].getPendingTask();
                    
                    item.push("<dd class=", admMedAvailability.getMedAvailabilityStyle(), "><span>", admMedAvailability.getMedAvailabilityText(), "</span>");
                    if(pendingTask != null){
                        item.push("<br/><span class=", admMedAvailability.getMedAvailabilityStyle(), ">", i18n.PENDING_INVENTORY_TASK.replace("{0}", pendingTask.getTaskType()), "</span>");
                    }
                    item.push("</dd>");
                }
                
                item.push("<dt>");
            }
            
            item.push("<dt><span>", i18n.ORDER_ID, ":</span></dt><dd class='med-det-dt'><span>", order.PARENTORDERID, "</span></dd>");
            
            item.push("</dl>");
            
            // Add alerts
            item = item.concat(alerts);
            
            // Additional Information
            item.push("<dl class='med-det' id='extra_", orderAndTaskIds, "' style='display:none'></dl>");
            
            item.push("</div>");
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
        
        var taskBtnValue = i18n.SUBMIT;
        jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl class ='med-info'>");
        jsHTML.push("<dd class= 'med-submit-row'><span class='", jsSeverity, "'>.</span></dd>");
        jsHTML.push("<dd class= 'med-queue'><span class='", jsSeverity, "'><input type='button' disabled='true' name='setTaskButtonTop' value='", taskBtnValue, "' onClick='setTask()' ></span></dd>");
        jsHTML.push("</dl></h3></div>");

        //SCHEDULED section
        jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.SCHEDULED, " (", scheduledCount, ")</span></h3>");
        if (scheduledCount > 0) {
            //Column headers
            jsHTML.push("<div class='sub-title-disp'>");
            jsHTML.push("<dl class ='med-info hdr'>");
            jsHTML.push("<dd class= 'med-date-hdr'><span>", i18n.TASK_DT_TM, "</span></dd>");
            jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
            jsHTML.push("<dd class= 'med-device-hdr'><span>", i18n.PREFERRED_DISPENSE_LOC, "</span></dd>");
            jsHTML.push("<dd class= 'med-range-dose-hdr'><span>", i18n.RANGE_DOSE, "</span></dd>");
	    jsHTML.push("<dd class= 'med-intended-dose-image-hdr'></dd>");
	    jsHTML.push("<dd class= 'med-intended-dose-content-hdr'><span>", i18n.INTENDED_DOSE_RANGE, "</span></dd>");
	    jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
            jsHTML.push("</div>");
        
            jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>",
                    i18n.NEXT_DOSE, "</dd></dl></div><div class='content-body'", ">", jsScheduled.join(""), "</div></div>");
        }
        jsHTML.push("</div>");

        // Unscheduled section
        jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.UNSCHEDULED, " (", unscheduledCount, ")</span></h3>");
        if (unscheduledCount > 0) {
            jsHTML.push("<div class='sub-title-disp'>");
            jsHTML.push("<dl class ='med-info hdr'>");
            jsHTML.push("<dd class= 'med-date-hdr'><span> </span></dd>");
            jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
            jsHTML.push("<dd class= 'med-device-hdr'><span>", i18n.PREFERRED_DISPENSE_LOC, "</span></dd>");
            jsHTML.push("<dd class= 'med-range-dose-hdr'><span>", i18n.RANGE_DOSE, "</span></dd>");
            jsHTML.push("<dd class= 'med-intended-dose-image-hdr'></dd>");
	    jsHTML.push("<dd class= 'med-intended-dose-content-hdr'><span>", i18n.INTENDED_DOSE_RANGE, "</span></dd>");
            jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
            jsHTML.push("</div>");
            
            jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>",
                    i18n.LAST_GIVEN, "</dd></dl></div><div class='content-body'", ">", jsUnscheduled.join(""), "</div></div>");
        }
        jsHTML.push("</div>");

        //PRN section
        jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.PRN, " (", prnCount, ")</span></h3>");
        if (prnCount > 0) {
            jsHTML.push("<div class='sub-title-disp'>");
            jsHTML.push("<dl class ='med-info hdr'>");
            jsHTML.push("<dd class= 'med-date-hdr'><span> </span></dd>");
            jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
            jsHTML.push("<dd class= 'med-device-hdr'><span>", i18n.PREFERRED_DISPENSE_LOC, "</span></dd>");
            jsHTML.push("<dd class= 'med-range-dose-hdr'><span>", i18n.RANGE_DOSE, "</span></dd>");
            jsHTML.push("<dd class= 'med-intended-dose-image-hdr'></dd>");
	    jsHTML.push("<dd class= 'med-intended-dose-content-hdr'><span>", i18n.INTENDED_DOSE_RANGE, "</span></dd>");
            jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
            jsHTML.push("</div>");
            
            jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>",
                i18n.LAST_GIVEN, "</dd></dl></div><div class='content-body'", ">", jsPRN.join(""), "</div></div>");
        }
        jsHTML.push("</div>");

        //CONTINUOUS section
        jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.CONTINUOUS, " (", continuousCount, ")</span></h3>");
        if (continuousCount > 0) {
            jsHTML.push("<div class='sub-title-disp'>");
            jsHTML.push("<dl class ='med-info hdr'>");
            jsHTML.push("<dd class= 'med-date-hdr'><span> </span></dd>");
            jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
            jsHTML.push("<dd class= 'med-device-hdr'><span>", i18n.PREFERRED_DISPENSE_LOC, "</span></dd>");
            jsHTML.push("<dd class= 'med-range-dose-hdr'><span>", i18n.RANGE_DOSE, "</span></dd>");
            jsHTML.push("<dd class= 'med-intended-dose-image-hdr'></dd>");
	    jsHTML.push("<dd class= 'med-intended-dose-content-hdr'><span>", i18n.INTENDED_DOSE_RANGE, "</span></dd>");
            jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
            jsHTML.push("</div>");
            
            jsHTML.push("<div class='sub-sec-content'><div class='content-body'", ">", jsContinuous.join(""), "</div></div>");
        }
        jsHTML.push("</div>");
		
        //If the prsnl_alias_link_status is 0, we do not have a confirmed link to the ADM system so we will display a message letting the user
        //know that they need to confirm the registration at the ADM station.
        var admUser_statusInfo = (component.getUser() == null ? null : component.getUser().ADMUSER_STATUSINFO);
        if (admUser_statusInfo != null) {
            var prsnl_alias_link_status = admUser_statusInfo.PRSNL_ALIAS_LINK_STATUS;
            if (prsnl_alias_link_status == 0) {
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.NEED_TO_CONFIRM_REGISTRATION, "</span></h3></div>");
            }
        }
        
        jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl class ='med-info'>");
        jsHTML.push("<dd class= 'med-submit-row'><span class='", jsSeverity, "'>.</span></dd>");
        jsHTML.push("<dd class= 'med-queue'><span class='", jsSeverity, "'><input type='button' disabled='true' name='setTaskButtonBottom' value='", taskBtnValue, "' onClick='setTask()' ></span></dd>");
        jsHTML.push("</dl></h3></div>");
        
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
    
    function BuildLoadingMedAvailabilityDetails(component) {
        var sHTML = "";
        var cache = Session.get("med_avail");
        
        if (cache == undefined) {
            sHTML = buildInitLoadingPage(component);
        } else {
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
            var alerts = [];
            var jsonPRN = [];
            var jsonSched = [];
            var jsonCont = [];
            var jsonUnsched = [];
            var isRxStation = component.getAdmType().isRxStation();
    
            //Spin through the orders and file them in the respective orderType category array
            for (var x = 0 in cache) {
                var order = cache[x];
 		var schedule = order.ORDERTYPE;
                
                if (schedule.toUpperCase() == "PRN") {
                    jsonPRN.push(order);
                } else if (schedule.toUpperCase() == "CONTINUOUS") {
                    jsonCont.push(order);
                } else if (schedule.toUpperCase() == "SCHEDULED") {
                    jsonSched.push(order);
                }else if (schedule.toUpperCase() == "UNSCHEDULED"){
                    jsonUnsched.push(order);
                }
            }
    
            //Sort the meds in each type category by the medication name
            jsonPRN.sort(SortByMedicationName);
            jsonSched.sort(SortByTaskDtTm);
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
                alerts = [];
                var order = jsonFinal[j];
		var medTaskDtTm = "", startDtTm = "", lastDispenseDtTm = "";
                var medName = GetMedicationDisplayName(order); //Get the medication display line
                var orderedBy = order.ORDERENTEREDBY; //Who placed the order
                var alertsExist = false;
    
                //Determine the order type category for this given order and set the indicator
                var isPrnInd = 0, isContinuousInd = 0, isScheduledInd = 0, isUnscheduledInd = 0, orderStatusInd = 0;//NOTE: orderStatusInd of 0 = verified, 1 = unverified, 2 = rejected
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
                } else if (orderType.toUpperCase() == "UNSCHEDULED"){
                    isUnscheduledInd = 1;
                }
    
                var dateTime = new Date();
                var sDate = order.TASKDTTM;
                dateTime.setISO8601(sDate);
                //Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
                if (!dateTime.isZeroDate(sDate)) {
                    //Medication task date time that will be displayed in heads up view in the med component
                    medTaskDtTm = dateTime.format("longDateTime2");
                    component.addQueueableTaskDTTM(order.TASKID, dateTime.format('isoDateTime'));
                }
    
                dateTime = new Date();
                sDate = order.STARTDTTM;
                dateTime.setISO8601(sDate);
                //Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
                if (!dateTime.isZeroDate(sDate)) {
                    //Order start date time for display within the med hover window
                    startDtTm = dateTime.format("longDateTime2");
                }
    
                dateTime = new Date(0);
                sDate = order.LASTDISPENSEDTTM;
                dateTime.setISO8601(sDate);
                //Make sure the date was not empty/null but calling isZeroDate to inspect the json string for zero date
                if (!dateTime.isZeroDate(sDate)) {
                    //Order last dispensed date time for display within the med hover window
                    lastDispenseDtTm = dateTime.format("longDateTime2");
                }
    
                var jsSeverity = "res-normal";
                
                var orderAndTaskIds = order.PARENTORDERID + "|" + order.TASKID;
            
		//BEGIN: Building heads up medication row
                //Building display for medications table
				
		var isQueueStatus = (component.getIsQueueStatus(order.PARENTORDERID) == undefined ? order.ISQUEUED : component.getIsQueueStatus(order.PARENTORDERID));
				
		if (isQueueStatus == 1) {
		    //If the order is already queued, apply the appropriate css to show the order row in the "queue indicator" color
		    item.push("<dl class='med-info med-order-queued' id='medInfoRow", orderAndTaskIds, "'>");
		} else {
		    //Color the unverified and rejected rows with a gray background to illustrate the difference from verified orders (in addition to the relevent icon)
		    if(orderStatusInd > 0) {
			item.push("<dl class='med-info med-order-unverified' id='medInfoRow", orderAndTaskIds, "'>");
		    } else {
                       item.push("<dl class='med-info med-order-dequeued' id='medInfoRow", orderAndTaskIds, "'>");
		    }
		}
    
                //Medication task date time column... but only for scheduled orders
                if (isScheduledInd == 1) {
                    item.push("<dd class= 'med-date'><span class='", jsSeverity, "'>", medTaskDtTm, "</span></dd>");
                } else {
                    item.push("<dd class= 'med-date'><span class='", jsSeverity, "'></span></dd>");
                }
    
                //Medication name column
                item.push("<dd class= 'med-name'><span class='", jsSeverity, "'>");
                if(orderStatusInd == 1) {
                    //Unverified order icon
                    item.push("<img src='", component.getCriterion().static_content, "\\images\\5150_24.png' title='", i18n.UNVERIFIED_ICON, "'/>&nbsp;");
                } else if(orderStatusInd == 2) {
                    //Rejected order icon
                    item.push("<img src='", component.getCriterion().static_content, "\\images\\6669_24.png' title='", i18n.REJECTED_ICON, "'/>&nbsp;");
                }
                
                // Witness Required Icon
                for (var k = 0 in order.ORDERITEMS) {
                    var orderItem = order.ORDERITEMS[k];
                    if(orderItem.WITNESSREQUIREDIND == 1) {
                        item.push("<img src='", component.getCriterion().static_content, "\\images\\omni-witness.png' height='24' width='24' title='", i18n.WITNESS_REQURED_ICON, "'/>&nbsp;");
                        break;
                    }
                }
                
                // Alerts Information
                alerts.push("<dl class='med-det' id='alerts_", orderAndTaskIds, "' style='display:none'>");
                
                for (var i = 0 in order.ORDERITEMS) {
                    var orderItem = order.ORDERITEMS[i];
                    
                    for (var j = 0 in orderItem.DISPENSEALERTS) {
                        if (j == 0) {
                            alerts.push("<dt><span><u><b>", orderItem.ITEMDESC, ":</b></u></span><br/></dt>");
                            alertsExist = true;
                        }
                        
                        var dispenseAlert = orderItem.DISPENSEALERTS[j];
                        
                        alerts.push("<dd class='med-name-desc'><span><b>~</b> ", dispenseAlert.ALERTVALUE, "</span><br/></dd>");
                    }
                }
                
                alerts.push("</dl>");
                
                if (alertsExist) {
                    item.push("<img src='", component.getCriterion().static_content, "\\images\\omni-alert.png' height='23' width='23'/>&nbsp;");
                }
                
                item.push( medName, "</span></dd>");
                
                //Finding preferred location and building alternate location array
                var preferredLocation = null;
		var tempLocation = null;
                var alternateLocations = new Array();
                var orderedItems = new Array();
                var altLocationCount = 0;
                for (var x = 0 in order.DISPENSEROUTINGLOCATIONS) {
		    var location = order.DISPENSEROUTINGLOCATIONS[x];
		    var dispenseLocation = null;
		    if (location.BESTLOCATIONIND == 1) {
                	tempLocation = new DispenseLocation(location.LOCATIONDISP, location.ITEMAVAILABILITYIND, location.DISPENSELOCATIONTYPEIND, location.PATIENT_SPECIFIC_CABINET_IND);
			dispenseLocation = tempLocation;
		    } else if (location.PATIENT_SPECIFIC_CABINET_IND == 1 && preferredLocation == null) {
			preferredLocation = new DispenseLocation(location.LOCATIONDISP, location.ITEMAVAILABILITYIND, location.DISPENSELOCATIONTYPEIND, location.PATIENT_SPECIFIC_CABINET_IND);
			dispenseLocation = preferredLocation;
		    } else {
			//If the best location indicator is not set then add this location to the alternate locations array
			alternateLocations[altLocationCount] = new DispenseLocation(location.LOCATIONDISP, location.ITEMAVAILABILITYIND, location.DISPENSELOCATIONTYPEIND, location.PATIENT_SPECIFIC_CABINET_IND);
			dispenseLocation = alternateLocations[altLocationCount];
			altLocationCount++;
		    }
		    // add pending tasks
		    for(var taskIdx=0 in location.PENDINGTASKS){
			var pendingTask = location.PENDINGTASKS[taskIdx]
			dispenseLocation.addTask(new InventoryTask(pendingTask.TASKID, pendingTask.TASKTYPEDISP, pendingTask.LOCATIONCD, pendingTask.LOCATIONDISP));
		    }
		}
		if(preferredLocation == null) {
		    preferredLocation = tempLocation;
		} else {
		    alternateLocations[altLocationCount] = tempLocation;
		}
    
                var enableQueueButton = false;
                if (isRxStation || preferredLocation != null) {
                    if (preferredLocation != null) {
                        item.push("<dd class= 'med-device'><span class='"+jsSeverity+"'>");
			if(preferredLocation.patientSpecificBinInd == 1) {
			    item.push("<img src='", component.getCriterion().static_content, "\\images\\omni-psb.png' height='24' width='24' title='", i18n.PATIENT_SPECIFIC_BIN, "' onmouseover='CERN_MEDS_01.DisplayNoHover(\"",  orderAndTaskIds, "\")' onmouseout='CERN_MEDS_01.DisplayGeneralInfo(\"",  orderAndTaskIds, "\")'/>&nbsp;");
			}
			item.push(preferredLocation.location+"</span>");
                        
                        //Don't display any message for Pharmacy locations (ie locationType == 0)
                        if(preferredLocation.locationType != 0) {
                            var admMedAvailability = new AdmMedAvailability(preferredLocation.availability);
                            item.push("<br/><span class=", admMedAvailability.getMedAvailabilityStyle(), ">", admMedAvailability.getMedAvailabilityText(), "</span>");
                        }
                        
                        var pendingTask = preferredLocation.getPendingTask();
                        if (pendingTask != null ) {
                            var pendingTaskDisplay = i18n.PENDING_INVENTORY_TASK_AT.replace("{0}", pendingTask.getTaskType());
                            pendingTaskDisplay = pendingTaskDisplay.replace("{1}", pendingTask.getLocationDisplay());
                            item.push("<br/><span class=", style, ">", pendingTaskDisplay, "</span>");
                        }
                        
                        // end the list
                        item.push("</dd>");
                    } else {
                         //No preferred location was returned
                        item.push("<dd class= 'med-device'><span class='", jsSeverity, "'>", i18n.PREFERRED_LOC_UNKNOWN, "</span></dd>");
                    }
                    
                    //Queue option should only be available for Med Station locations or ADMType is RxStation, if the order is actually queueable,
                    //and user has can_queue indicator set
                    if (order.ISQUEUEABLE == 1 && orderStatusInd == 0 && component.getUser() != null && component.getUser().USER_INDICATORS.CAN_QUEUE_IND == 1) {
                        enableQueueButton = true;
                    }
                } else {
                    //No preferred location was returned
                    item.push("<dd class= 'med-device'><span class='", jsSeverity, "'>", i18n.PREFERRED_LOC_UNKNOWN, "</span></dd>");
                }
                
		//If the prsnl_alias_link_status is 0, we do not have a confirmed link to the ADM system so we can not complete the queueing process
		//so do not show range dose, intended dose and buttons.
		var admUser_statusInfo = (component.getUser() == null ? null : component.getUser().ADMUSER_STATUSINFO);
            
		if (admUser_statusInfo != null) {
		    var prsnl_alias_link_status = admUser_statusInfo.PRSNL_ALIAS_LINK_STATUS;
                
		    if (prsnl_alias_link_status > 0) {
			
			// Range Dose
			item.push("<dd class= 'med-range-dose'>");
			var maximumDose = 0;
			if(order.RANGE_DOSE_IND != undefined ) {
			    maximumDose = order.MAXIMUM_RANGE_DOSE;
			    var minimumDose = order.MINIMUM_RANGE_DOSE;
			    if(order.RANGE_DOSE_IND != 0) {
				var rangeDoseDisplay = i18n.DOSE_RANGE.replace("{0}", minimumDose);
				rangeDoseDisplay = rangeDoseDisplay.replace("{1}", maximumDose);
				item.push("<span >", rangeDoseDisplay, "</span>");
			    }
			}
			item.push("</dd>");
		    }
		}

 		// end the list
                item.push("</dl>");
                //END: Building heads up medication row
                
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
            
            var taskBtnValue = i18n.SUBMIT;
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl class ='med-info'>");
            jsHTML.push("<dd class= 'med-submit-row'><span class='", jsSeverity, "'>.</span></dd>");
            jsHTML.push("<dd class= 'med-queue'><span class='", jsSeverity, "'><input type='button' disabled='true' name='setTaskButtonTop' value='", taskBtnValue, "' onClick='setTask()' ></span></dd>");
            jsHTML.push("</dl></h3></div>");
    
            //SCHEDULED section
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.SCHEDULED, " (", scheduledCount, ")</span></h3>");
            if (scheduledCount > 0) {
                //Column headers
                jsHTML.push("<div class='sub-title-disp'>");
                jsHTML.push("<dl class ='med-info hdr'>");
                jsHTML.push("<dd class= 'med-date-hdr'><span>", i18n.TASK_DT_TM, "</span></dd>");
                jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
                jsHTML.push("<dd class= 'med-device-hdr'><span>", i18n.PREFERRED_DISPENSE_LOC, "</span></dd>");
                jsHTML.push("<dd class= 'med-range-dose-hdr'><span>", i18n.RANGE_DOSE, "</span></dd>");
                jsHTML.push("<dd class= 'med-intended-dose-image-hdr'></dd>");
		jsHTML.push("<dd class= 'med-intended-dose-content-hdr'><span>", i18n.INTENDED_DOSE_RANGE, "</span></dd>");
		jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
                jsHTML.push("</div>");
            
                jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>",
                        i18n.NEXT_DOSE, "</dd></dl></div><div class='content-body'", ">", jsScheduled.join(""), "</div></div>");
            }
            jsHTML.push("</div>");
    
            // Unscheduled section
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.UNSCHEDULED, " (", unscheduledCount, ")</span></h3>");
            if (unscheduledCount > 0) {
                jsHTML.push("<div class='sub-title-disp'>");
                jsHTML.push("<dl class ='med-info hdr'>");
                jsHTML.push("<dd class= 'med-date-hdr'><span> </span></dd>");
                jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
                jsHTML.push("<dd class= 'med-device-hdr'><span>", i18n.PREFERRED_DISPENSE_LOC, "</span></dd>");
                jsHTML.push("<dd class= 'med-range-dose-hdr'><span>", i18n.RANGE_DOSE, "</span></dd>");
            	jsHTML.push("<dd class= 'med-intended-dose-image-hdr'></dd>");
		jsHTML.push("<dd class= 'med-intended-dose-content-hdr'><span>", i18n.INTENDED_DOSE_RANGE, "</span></dd>");
		jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
                jsHTML.push("</div>");
                
                jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>",
                        i18n.LAST_GIVEN, "</dd></dl></div><div class='content-body'", ">", jsUnscheduled.join(""), "</div></div>");
            }
            jsHTML.push("</div>");
    
            //PRN section
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.PRN, " (", prnCount, ")</span></h3>");
            if (prnCount > 0) {
                jsHTML.push("<div class='sub-title-disp'>");
                jsHTML.push("<dl class ='med-info hdr'>");
                jsHTML.push("<dd class= 'med-date-hdr'><span> </span></dd>");
                jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
                jsHTML.push("<dd class= 'med-device-hdr'><span>", i18n.PREFERRED_DISPENSE_LOC, "</span></dd>");
                jsHTML.push("<dd class= 'med-range-dose-hdr'><span>", i18n.RANGE_DOSE, "</span></dd>");
            	jsHTML.push("<dd class= 'med-intended-dose-image-hdr'></dd>");
		jsHTML.push("<dd class= 'med-intended-dose-content-hdr'><span>", i18n.INTENDED_DOSE_RANGE, "</span></dd>");
		jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
                jsHTML.push("</div>");
                
                jsHTML.push("<div class='sub-sec-content'><div class='content-hdr'><dl class='med-info-hdr'><dd class='med-name'></dd><dd class='med-date'>",
                    i18n.LAST_GIVEN, "</dd></dl></div><div class='content-body'", ">", jsPRN.join(""), "</div></div>");
            }
            jsHTML.push("</div>");
    
            //CONTINUOUS section
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.CONTINUOUS, " (", continuousCount, ")</span></h3>");
            if (continuousCount > 0) {
                jsHTML.push("<div class='sub-title-disp'>");
                jsHTML.push("<dl class ='med-info hdr'>");
                jsHTML.push("<dd class= 'med-date-hdr'><span> </span></dd>");
                jsHTML.push("<dd class= 'med-name-hdr'><span>", i18n.MEDICATIONS, "</span></dd>");
                jsHTML.push("<dd class= 'med-device-hdr'><span>", i18n.PREFERRED_DISPENSE_LOC, "</span></dd>");
                jsHTML.push("<dd class= 'med-range-dose-hdr'><span>", i18n.RANGE_DOSE, "</span></dd>");
            	jsHTML.push("<dd class= 'med-intended-dose-image-hdr'></dd>");
		jsHTML.push("<dd class= 'med-intended-dose-content-hdr'><span>", i18n.INTENDED_DOSE_RANGE, "</span></dd>");
		jsHTML.push("<dd class= 'med-queue'><span> </span></dd></dl>");
                jsHTML.push("</div>");
                
                jsHTML.push("<div class='sub-sec-content'><div class='content-body'", ">", jsContinuous.join(""), "</div></div>");
            }
            jsHTML.push("</div>");
            
            //If the prsnl_alias_link_status is 0, we do not have a confirmed link to the ADM system so we will display a message letting the user
            //know that they need to confirm the registration at the ADM station.
            var admUser_statusInfo = (component.getUser() == null ? null : component.getUser().ADMUSER_STATUSINFO);
            if (admUser_statusInfo != null) {
                var prsnl_alias_link_status = admUser_statusInfo.PRSNL_ALIAS_LINK_STATUS;
                if (prsnl_alias_link_status == 0) {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.NEED_TO_CONFIRM_REGISTRATION, "</span></h3></div>");
                }
            }
            
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><dl class ='med-info'>");
            jsHTML.push("<dd class= 'med-submit-row'><span class='", jsSeverity, "'>.</span></dd>");
            jsHTML.push("<dd class= 'med-queue'><span class='", jsSeverity, "'><input type='button' disabled='true' name='setTaskButtonBottom' value='", taskBtnValue, "'></span></dd>");
            jsHTML.push("</dl></h3></div>");
            
            var content = [];
            //if the results are zero then display no result found.
            if (jsonFinal.length == 0) {
                content.push("<div class='", MP_Util.GetContentClass(component, jsonFinal.length), "'>", MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace()), "</div>");
            } else {
                jsHTML.push("<div style='position:absolute;display:block;top:0;left:0;width:100%;height:100%;'><img src='", component.getCriterion().static_content, "\\images\\loading.gif' style='margin:0 auto;height:100%;display:block;'/></div>");
                content.push("<div class='", MP_Util.GetContentClass(component, jsonFinal.length), "' style='position:relative;'>", jsHTML.join(""), "</div>");
            }
            sHTML = content.join("");
        }
        
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
        return 0;
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
            return SortByMedicationName(a,b);  //if times are equal, sort by med name
    }

    function GetMedicationDisplayName(order) {
        var medName = "";
        if (order.POWERCHARTDISPLAY != null)
            medName = order.POWERCHARTDISPLAY;

        return (medName);
    }

    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER and examines the reply status before
    //determining how to handle the reply.
    function GetMedicationsCCLRequestWrapper(component, paramAr) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
            if (info.readyState == 4 && info.status == 200) {
                try {
                    var jsonEval = JSON.parse(info.responseText);
                    var recordData = jsonEval.RECORD_DATA;
                    
                    if (recordData.STATUS_DATA.STATUS == "Z") {
                        component.HandleSuccess(recordData);
                    } else {
                        var alertDisplayed = false;
                        
                        if (!recordData.REPLY_DATA.CASERVICE_STATUSINFO.OPERATION_DETAIL) {
                            for (var curSubEvent = 0 in recordData.STATUS_DATA.SUBEVENTSTATUS) {
                                if (recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTNAME.indexOf("UserMaintenanceManager") != -1) {
                                    //The status block contained a message that needs to be displayed to the user.
                                    alertDisplayed = true;
                                    displayAlertMessage(i18n.UNABLE_TO_PROCESS, recordData.STATUS_DATA.SUBEVENTSTATUS[curSubEvent].TARGETOBJECTVALUE);
                                }
                            }
                            
                            if (recordData.STATUS_DATA.STATUS == "S") {
                                component.HandleSuccess(recordData);
                            } else {
                                if (!alertDisplayed) {
                                    alert(i18n.ERROR_CONTACT_SYSTEM_ADMIN);
                                }
                                
                                component.HandleError();
                                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
                            }
                        } else {
                            displayAlertMessage(i18n.WARNING, recordData.REPLY_DATA.CASERVICE_STATUSINFO.OPERATION_DETAIL);
                            
                            component.HandleSuccess(recordData);
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

    function DispenseLocation(location, availability, locationType, patientSpecificBinInd) {
        this.location = location;
        this.availability = availability; //1==Enough in stock for order, 0==Not enough in stock for order, -1==Inventory availability unknown
        this.locationType = locationType; //0==Pharmacy, 1==RxStation, 2==ExternalADM
	this.patientSpecificBinInd = patientSpecificBinInd; // 1==Patient specific bin, 0==Not a patient specific bin
        this.pendingTasks = new Array(); //list of pending tasks
        
        DispenseLocation.method("addTask", function(value) {
            if(value != null) {
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
} ();

//Event handling function for when a "Queue" button is pressed
function queueTask(orderAndTaskId) {
    /*
     * Toggle the Queue button between
     * a) "Queue" and "Queue Pending"
     * b) "Remove from Queue" and "Remove from Queue Pending"
    */
    var intendedDoseImageId = "imageId" +  orderAndTaskId;
    var intendedTextName= "intendedDosageText" + orderAndTaskId;
    var imageVisibility = document.getElementById(intendedDoseImageId).style.display;
	
    // Allow queuing only when the intended dose is valid 
    // Intended Dose cant be changed when med order is in pending to queue state.
    if(event.srcElement.value == i18n.ADD_TO_QUEUE && imageVisibility == "none") {
        event.srcElement.value = i18n.QUEUED_TASK_PENDING;
	document.getElementById(intendedTextName).readOnly = true;
	CERN_MEDS_01.comp.m_queueTasksPending++;
    } else if(event.srcElement.value == i18n.QUEUED_TASK_PENDING) {
	event.srcElement.value = i18n.ADD_TO_QUEUE;
	document.getElementById(intendedTextName).readOnly = false;
	CERN_MEDS_01.comp.m_queueTasksPending--;
    }else if(event.srcElement.value == i18n.REMOVE_FROM_QUEUE) {
        event.srcElement.value = i18n.REMOVE_QUEUED_TASK_PENDING;
	CERN_MEDS_01.comp.m_queueTasksPending++;
    } else if(event.srcElement.value == i18n.REMOVE_QUEUED_TASK_PENDING) {
	event.srcElement.value = i18n.REMOVE_FROM_QUEUE;
	CERN_MEDS_01.comp.m_queueTasksPending--;
    }
    
    //Enable or disable the Submit Queued Task button based on whether there are any "Queue Pending" orders waiting to be submitted
    if(CERN_MEDS_01.comp.m_queueTasksPending > 0){
        document.getElementById('setTaskButtonTop').disabled = false;
	document.getElementById('setTaskButtonBottom').disabled = false;
	Util.Style.acss(document.getElementById('setTaskButtonTop'),'med-queue-button-enabled');
	Util.Style.acss(document.getElementById('setTaskButtonBottom'),'med-queue-button-enabled');
    } else {
	document.getElementById('setTaskButtonTop').disabled = true;
	document.getElementById('setTaskButtonBottom').disabled = true;
	Util.Style.rcss(document.getElementById('setTaskButtonTop'),'med-queue-button-enabled');
	Util.Style.rcss(document.getElementById('setTaskButtonBottom'),'med-queue-button-enabled');
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
    var intendedDoses = CERN_MEDS_01.comp.getIntendedDose();
    var addedOrderIds = new Object();
   
    //Spin through all of the queueable order ids and if they are marked as pending
    for (var i = 0; i < queueableTaskOrderIds.length; i++) {
	var orderAndTask = queueableTaskOrderIds[i];
	var orderAndTaskIds = orderAndTask.split("|");
	var order_id = orderAndTaskIds[0];
	var task_id = orderAndTaskIds[1];
	var intended_dose = intendedDoses[i];
	var intendedTextName= "intendedDosageText" + orderAndTask;
	var task_detail_events = new Array();
	var buttonName = "queueButton" + orderAndTask;
	var medInfoRowName = "medInfoRow" + orderAndTask;
	var button = document.getElementById(buttonName);
	if (button.value == i18n.QUEUED_TASK_PENDING) {
	    //Order was pending queueing, reset the button and row, and fill out the relevent portion of the json_object
	    button.value = isRxStation ? i18n.REMOVE_FROM_QUEUE : i18n.ADD_TO_QUEUE;
	    document.getElementById(intendedTextName).readOnly = false;
	    CERN_MEDS_01.comp.addIsQueueStatus(order_id, 1);
	
	    //Call acss(add css) and rss(remove ass) to add the row to reflect the "queued item" indicator background coloring
	    var medInfoRow = document.getElementById(medInfoRowName);
	    Util.Style.rcss(medInfoRow, "med-order-dequeued");
	    Util.Style.acss(medInfoRow, "med-order-queued");
           
	    if (addedOrderIds[order_id] == undefined) {
		json_object.queue_task_request.task.task_details[queue_task_num] = new Object();
		json_object.queue_task_request.task.task_details[queue_task_num].task_detail_key_type_ind = 1;
		json_object.queue_task_request.task.task_details[queue_task_num].task_detail_key_value = order_id;
		json_object.queue_task_request.task.task_details[queue_task_num].order_id = order_id;
		json_object.queue_task_request.task.task_details[queue_task_num].task_detail_events = new Array();
              
		var taskDTTM = CERN_MEDS_01.comp.getQueueableTaskDTTM(task_id);
               
		if (taskDTTM != undefined && taskDTTM != null) {
		    json_object.queue_task_request.task.task_details[queue_task_num].task_detail_events[0] = new Object();
		    json_object.queue_task_request.task.task_details[queue_task_num].task_detail_events[0].due_time = taskDTTM;
		} 
				
		// If there is value in intended dose use it or default it to maximum range dose value.
		var finalIntendedDose = document.getElementById(intendedTextName).value ? document.getElementById(intendedTextName).value : intended_dose;
		if (finalIntendedDose) {
		    if(CERN_MEDS_01.isInteger(finalIntendedDose)){
			json_object.queue_task_request.task.task_details[queue_task_num].intended_dose = finalIntendedDose + ".0";
		    } else {
			json_object.queue_task_request.task.task_details[queue_task_num].intended_dose = finalIntendedDose;
		}
	    } 
				
	    addedOrderIds[order_id] = queue_task_num;
	    queue_task_num++;
	} else {
	    var queuedTaskNum = addedOrderIds[order_id];
	    var l = json_object.queue_task_request.task.task_details[queuedTaskNum].task_detail_events.length;
	    var taskDTTM = CERN_MEDS_01.comp.getQueueableTaskDTTM(task_id);
               
	    if (taskDTTM != undefined && taskDTTM != null) {
		json_object.queue_task_request.task.task_details[queuedTaskNum].task_detail_events[l] = new Object();
		json_object.queue_task_request.task.task_details[queuedTaskNum].task_detail_events[l].due_time = taskDTTM;
	    }
	}
    } else if (button.value == i18n.REMOVE_QUEUED_TASK_PENDING){
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
//end button functions

//A wrapper function that makes the XMLCclRequest call to adm_adapter_ccl_driver for QUEUE_TASK and examines the reply status before
//determining how to handle the reply.
function SetTaskCCLRequestWrapper(component, paramAr) {
    var sHTML=CERN_MEDS_01.LoadingMedAvailability();
    MP_Util.Doc.FinalizeComponent(sHTML, component, "");
    
    var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());
    CERN_MEDS_01.unable_to_queue_reason = null;
    var unable_to_queue_reason = null;
    var info = new XMLCclRequest();

    info.onreadystatechange = function () {
        if (info.readyState == 4 && info.status == 200) {
            try {
                var jsonEval = JSON.parse(info.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS == "S") {
                    // If one or more medorders were not queued change the background color of the medorder row to white.
                    // And alert the error reason.
                    if (recordData.REPLY_DATA.STATUS_INFO.OPERATION_STATUS_FLAG == -1) {
			displayAlertMessage(i18n.WARNING, recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL);
			unable_to_queue_reason = recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL;
			var newTxt = unable_to_queue_reason.split('\[');
			for (var i = 1; i < newTxt.length; i++) {
			    var orderId=newTxt[i].split(':')[0];
			    CERN_MEDS_01.comp.addIsQueueStatus(orderId, 0);
			}
		    }
		    // Give the warning message on the bottom of medavailability component.
		    CERN_MEDS_01.UnableToQueueReason(component, unable_to_queue_reason);
                } else {
                    var errorAr = [];
                    var statusData = recordData.STATUS_DATA;
                    errorAr.push(
                            statusData.STATUS,
                            statusData.SUBEVENTSTATUS.OPERATIONNAME,
                            statusData.SUBEVENTSTATUS.OPERSATIONSTATUS,
                            statusData.SUBEVENTSTATUS.TARGETOBJECTNAME,
                            statusData.SUBEVENTSTATUS.TARGETOBJECTVALUE);
                    MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errorAr.join(", ")), component, countText);
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

function MedWasteComponent(criterion){
    this.setCriterion(criterion);
    this.setStyles(new MedWasteComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.MEDS_WASTE.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.MEDS_WASTE.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(0);
    this.setLookbackUnitTypeFlag(1);
    //this.m_lookBackHours= 2;  //Default look back will be 2 hours
    //this.m_lookAheadHours = 6;  //Default look ahead will be 6 hours
    CERN_MEDS_WASTE_01.comp = this;
    this.m_user = Session.get("user");
    this.m_txToWasteIsLoaded = false;
     
    MedWasteComponent.method("setUser", function(value) {
        this.m_user = value;
        if(value != null) {
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
    MedWasteComponent.method("InsertData", function(){
        //CERN_MEDS_WASTE_01.GetMedWaste(this, "");
        //Go right to rendercomponent for mock version
        var recordData = [];
        CERN_MEDS_WASTE_01.RenderComponent(this, recordData);
    });
    MedWasteComponent.method("HandleSuccess", function(recordData){
        CERN_MEDS_WASTE_01.RenderComponent(this, recordData);
    });
}
MedWasteComponent.inherits(MPageComponent);

var CERN_MEDS_WASTE_01 = function () {
    var comp = null;

    var curMedTransactionsToWaste = null;
    var curMedTransactionIndex = -1;
    var curWasteTxType = -1;
    var curWastePreferences = null;
    var curWitnessUserID = null;

    return {
        RenderComponent: function (component, recordData) {
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
        WaitingForAuthentication: function () {
            //Display a waiting for authentication message until the component has a valid user
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.WAITING_FOR_USER_AUTH + "... </span><br/>";
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        UserCanNotWaste: function () {
            //Display a waiting for authentication message until the component has a valid user
            var sHTML = "<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>" + i18n.USER_CAN_NOT_REMOTE_WASTE + "... </span><br/>";
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        ShowRetrieveWasteTxOptions: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];

            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
            jsHTML.push("<input type='button' name='getFilteredWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetFilteredTxToWaste()' value='", i18n.LOAD_FILTERED_DISPENSE_HISTORY, "'>");
            jsHTML.push("<input type='button' name='getFullWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetAllTxToWaste()' value='", i18n.LOAD_FULL_DISPENSE_HISTORY, "'>");

            jsHTML.push("<br><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.SEARCH_FOR_WASTEABLE_MED, "</span><br/>");
            jsHTML.push("<input type='text' name='wasteableMedSearchText' value='' onClick='this.select();' onkeydown='CERN_MEDS_WASTE_01.SearchInput_KeyDown()'> ");
            jsHTML.push("<input type='button' name='wasteableMedSearchButton' onClick='CERN_MEDS_WASTE_01.SearchForMedClicked()' value='", i18n.SEARCH, "'>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        SearchInput_KeyDown: function () {
            if (event.keyCode == 13) {
                document.getElementById('wasteableMedSearchButton').click();
            }
        },
        GetAllTxToWaste: function () {
            var med_id = "";
            var retrieval_type_filter = 2;
            this.curWasteTxType = 1;  //1 - DFT_TX
            CERN_MEDS_WASTE_01.GetMedTxToWaste(retrieval_type_filter, med_id); // 2 - ALL_TX_FILTER_BY_PATIENT        (requires user and patient)
        },
        GetFilteredTxToWaste: function () {
            var med_id = "";
            var retrieval_type_filter = 4;
            this.curWasteTxType = 1;  //1 - DFT_TX
            CERN_MEDS_WASTE_01.GetMedTxToWaste(retrieval_type_filter, med_id); // 4 - UNDOC_FILTER_BY_PATIENT        (requires user and patient)
        },
        GetTxToWasteByMed: function (med_id) {
            var retrieval_type_filter = 1;
            this.curWasteTxType = 0; //0 - AD_HOC_MED
            CERN_MEDS_WASTE_01.GetMedTxToWaste(retrieval_type_filter, med_id);  // 1 - FILTER_BY_MED
        },
        GetMedTxToWaste: function (retrieval_type_filter, med_id) {
            //The get transactions to waste can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
            var sHTML = buildInitLoadingPage(this.comp);
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
            
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

            retrieve_tx_to_waste_request.retrieve_waste_tx_filter_ind = retrieval_type_filter;

            var json_object = new Object();
            json_object.retrieve_tx_to_waste_request = retrieve_tx_to_waste_request;

            var json_request = JSON.stringify(json_object);

            sendAr.push("^MINE^", "^RETRIEVE_TX_TO_WASTE^", "^" + json_request + "^");
            GetTransactionsToWasteCCLRequestWrapper(this.comp, sendAr, retrieval_type_filter);
        },
        PrepareSearchForMedToWasteCall: function (searchText) {
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
            SearchForMedToWasteCCLRequestWrapper(this.comp, paramAr);
        },
        ShowWasteableMedTransactions: function (component, retrieval_type_filter) {
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
            jsHTML.push("<input type='button' name='getFilteredWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetFilteredTxToWaste()' value='", i18n.LOAD_FILTERED_DISPENSE_HISTORY, "'>");
            jsHTML.push("<input type='button' name='getFullWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetAllTxToWaste()' value='", i18n.LOAD_FULL_DISPENSE_HISTORY, "'>");
            
            jsHTML.push("<br><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.SEARCH_FOR_WASTEABLE_MED, "</span><br/>");
            jsHTML.push("<input type='text' name='wasteableMedSearchText' value='' onClick='this.select();' onkeydown='CERN_MEDS_WASTE_01.SearchInput_KeyDown()'  > ");
            jsHTML.push("<input type='button' name='wasteableMedSearchButton' onClick='CERN_MEDS_WASTE_01.SearchForMedClicked()' value='", i18n.SEARCH, "'>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        MedToWasteRadio_KeyDown: function () {
            if (event.keyCode == 13)
                document.getElementById('wasteSelectedMedButton').click();
        },
        ShowSearchResultsForm: function (searchResults) {
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
            
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'>");
            jsHTML.push("<input type='button' name='getFilteredWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetFilteredTxToWaste()' value='", i18n.LOAD_FILTERED_DISPENSE_HISTORY, "'>");
            jsHTML.push("<input type='button' name='getFullWasteTxsButton' onClick='CERN_MEDS_WASTE_01.GetAllTxToWaste()' value='", i18n.LOAD_FULL_DISPENSE_HISTORY, "'>");
            
            jsHTML.push("<br><div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.SEARCH_FOR_WASTEABLE_MED, "</span><br/>");
            jsHTML.push("<input type='text' name='wasteableMedSearchText' value='' onClick='this.select();' onkeydown='CERN_MEDS_WASTE_01.SearchInput_KeyDown()'  > ");
            jsHTML.push("<input type='button' name='wasteableMedSearchButton' onClick='CERN_MEDS_WASTE_01.SearchForMedClicked()' value='", i18n.SEARCH, "'>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        WasteSelectedSearchResult: function () {
            var length = document.searchResultsRadioForm.searchResultRadio.length;
            var medId = new String();
            for (i = 0; i < length; i++) {
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
        SearchForMedClicked: function () {
            var searchText = new String(document.getElementById('wasteableMedSearchText').value);
            
            if (searchText.length > 2) {
                this.PrepareSearchForMedToWasteCall(searchText);
            } else {
                alert(i18n.PLEASE_ENTER_THREE_CHARACTERS);
            }
        },
        WasteSelectedMedication: function () {
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
                for (i = 0; i < length; i++) {
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
                var wasteTxIndex = new Number(radioValueArray[1]); //get the index value that was built into the id in the format "waste_tx_index|#" where # is the index value
                if (wasteTxIndex >= 0) {
                    this.curMedTransactionIndex = wasteTxIndex;
                }

                //If the curMedTrnasactionIndex variable has been set, we have a valid selection and we can move on
                if (this.curMedTransactionIndex >= 0) {
                    this.ShowAmountGivenForm();
                }
            }
        },
        ShowAmountRemovedForm: function () {
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
            jsHTML.push("<input type='text' name='amntRemovedInput' value='' onKeyUp='CERN_MEDS_WASTE_01.AmntRemovedInput_KeyUp();' onKeyPress='return CERN_MEDS_WASTE_01.isNumberKey(event);' onBlur='CERN_MEDS_WASTE_01.ValidateAmountRemoved();'><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");
            
            if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].WITNESS_REQUIRED_IND == 1) {
                jsHTML.push("<span class='waste-warning-text'>", i18n.WITNESS_REQURED, "</span><br/>");
            }

            jsHTML.push("<input type='button' name='removeButton' disabled=true onClick='CERN_MEDS_WASTE_01.ProcessRemoveAmountInput()' value='", i18n.OK, "'>&nbsp;");
            jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
            jsHTML.push("</form><br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        
	AmntRemovedInput_KeyUp: function () {
            if(document.getElementById('amntRemovedInput').value){
            	CERN_MEDS_WASTE_01.EnableRemoveButton();
		if (event.keyCode == 13) {
		    document.getElementById('removeButton').click();
		}
            } else {
		document.getElementById('removeButton').disabled = true;
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
		
        ValidateAmountRemoved: function () {
            var amount = document.getElementById('amntRemovedInput').value;
            
            if (amount != "") {
                var numberFormat = new NumberFormat();
                var roundedAmount = numberFormat.truncate(amount, 4);
                
                if (roundedAmount <= 0) {
                    alert(i18n.AMOUNT_REMOVED_IS_NEGATIVE);
                    document.getElementById('amntRemovedInput').value = "";
                    document.getElementById('removeButton').disabled = true;
                } else {
                    document.getElementById('amntRemovedInput').value = roundedAmount;
                    CERN_MEDS_WASTE_01.EnableRemoveButton();
                }
            } else {
                document.getElementById('removeButton').disabled = true;
            }
        },
		
	EnableRemoveButton: function () {
            document.getElementById('removeButton').disabled = false;
        },

        ShowAmountGivenForm: function () {
            if (this.curMedTransactionIndex >= 0) {
                var numberFormat = new NumberFormat();
                
                var sHTML = "";
                var jsHTML = [];
                var content = [];
                var areaType = new AreaType(this.curWastePreferences.AREA_TYPE_IND);

                jsHTML = BuildWasteMedInfoDisplay(this.curMedTransactionsToWaste, this.curMedTransactionIndex, false);
                
                var remainingAmount = numberFormat.truncate(this.curMedTransactionsToWaste[this.curMedTransactionIndex].REMAINING_AMOUNT, 4);
                var defaultWasteAmount = '';
                var defaultGiveAmount = '';
                
                if (defaultWasteAmount != undefined) {
                    defaultWasteAmount = numberFormat.truncate(this.curMedTransactionsToWaste[this.curMedTransactionIndex].WASTE_AMOUNT, 4);
                    
                    if (remainingAmount < defaultWasteAmount || 0 > defaultWasteAmount) {
                        defaultWasteAmount = '';
                    }    
                }
                
                if (defaultGiveAmount != undefined) {
                    defaultGiveAmount = numberFormat.truncate(this.curMedTransactionsToWaste[this.curMedTransactionIndex].GIVE_AMOUNT, 4);
                    
                    if (remainingAmount < defaultGiveAmount || 0 > defaultGiveAmount) {
                        defaultGiveAmount = '';
                    }
                }
                
                if (defaultWasteAmount == 0 && defaultGiveAmount == 0) {
                    defaultWasteAmount = '';
                    defaultGiveAmount = '';
                }
                
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><form name=amountGivenForm method='get' action='' onsubmit='return false;'>");
                
                var amountUnitsOfMeasure = this.curMedTransactionsToWaste[this.curMedTransactionIndex].AMOUNT_UNITS_OF_MEASURE;
                
                if (areaType.isAdminBased()) {
                    jsHTML.push("<span class='sub-sec-title'>", i18n.PLEASE_ENTER_AMOUNT_WASTED, "</span><br/>");
                    
                    jsHTML.push("<span class='sub-sec-title'>", i18n.AMOUNT_GIVEN, "</span><br/>");
                    jsHTML.push("<input disabled type='text' id='amntGivenInput' value='" + defaultGiveAmount + "'><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");
                    
                    jsHTML.push("<span class='sub-sec-title'>", i18n.AMOUNT_WASTED, "</span><br/>");
                    jsHTML.push("<input type='text' id='amntWastedInput' value='" + defaultWasteAmount + "' style='background-color:#ffffcc;' onClick='this.select();' onkeyup='CERN_MEDS_WASTE_01.AmntWastedInput_KeyDown()' onkeypress='return CERN_MEDS_WASTE_01.isNumberKey(event)'><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");
                } else {
                    if (this.curWastePreferences.FORCE_WASTE_DOSE_BALANCE_IND == 1) {
                        jsHTML.push("<span class='sub-sec-title'>", i18n.PLEASE_ENTER_AMOUNT_GIVEN, "</span><br/>");
                        
                        jsHTML.push("<span class='sub-sec-title'>", i18n.AMOUNT_GIVEN, "</span><br/>");
                        jsHTML.push("<input type='text' id='amntGivenInput' value='" + defaultGiveAmount + "' style='background-color:#ffffcc;' onClick='this.select();' onkeyup='CERN_MEDS_WASTE_01.AmntGivenInput_KeyDown()' onkeypress='return CERN_MEDS_WASTE_01.isNumberKey(event)'><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");
                        
                        jsHTML.push("<span class='sub-sec-title'>", i18n.AMOUNT_WASTED, "</span><br/>");
                        jsHTML.push("<input disabled type='text' id='amntWastedInput' value='" + defaultWasteAmount + "'><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");
                    } else {
                        jsHTML.push("<span class='sub-sec-title'>", i18n.PLEASE_ENTER_AMOUNT_GIVEN, "</span><br/>");
                        
                        jsHTML.push("<span class='sub-sec-title'>", i18n.AMOUNT_GIVEN, "</span><br/>");
                        jsHTML.push("<input type='text' id='amntGivenInput' value='" + defaultGiveAmount + "' onClick='this.select();' onkeypress='return CERN_MEDS_WASTE_01.isNumberKey(event)' onkeyup='CERN_MEDS_WASTE_01.ValidateAmount(this)'><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");
                        
                        jsHTML.push("<span class='sub-sec-title'>", i18n.AMOUNT_WASTED, "</span><br/>");
                        jsHTML.push("<input type='text' id='amntWastedInput' value='" + defaultWasteAmount + "' onClick='this.select();' onkeypress='return CERN_MEDS_WASTE_01.isNumberKey(event)' onkeyup='CERN_MEDS_WASTE_01.ValidateAmount(this)'><span class='sub-sec-title'>" + amountUnitsOfMeasure + "</span><br/>");
                    }
                }
                
                //TODO: Get rid of these lines.
                //jsHTML.push(i18n.CREDIT_PATIENT, "<input type='checkbox' disabled=true name='creditPatientCheckbox' value=''><br>");
                jsHTML.push("<input type='checkbox' disabled=true name='creditPatientCheckbox' value='' style='display:none'><br>");

                if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].WITNESS_REQUIRED_IND == 1) {
                    jsHTML.push("<span class='waste-warning-text'>", i18n.WITNESS_REQURED, "</span><br/>");
                }
                
                if (defaultGiveAmount === '' || defaultWasteAmount === '') {
                    jsHTML.push("<input type='button' name='wasteButton' disabled onClick='CERN_MEDS_WASTE_01.ProcessWasteAmountInput()' value='", i18n.WASTE_BUTTON, "'>");
                } else {
                    jsHTML.push("<input type='button' name='wasteButton' onClick='CERN_MEDS_WASTE_01.ProcessWasteAmountInput()' value='", i18n.WASTE_BUTTON, "'>");
                }
                jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
                jsHTML.push("</form><br/></h3></div>");

                content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
                sHTML = content.join("");

                MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

                //TODO: This is not actually setting focus like we want
                //document.getElementById('amntGivenInput').select();
            }
        },
        AmntGivenInput_KeyDown: function () {
            var numberFormat = new NumberFormat();
            document.getElementById('amntGivenInput').value = numberFormat.formatNumberString(document.getElementById('amntGivenInput').value, 4);
            CERN_MEDS_WASTE_01.CalculateWastedAmount(document.getElementById('amntGivenInput').value);
            
            if (event.keyCode == 13) {
                document.getElementById('wasteButton').click();
            }
        },
        AmntWastedInput_KeyDown: function () {
            var numberFormat = new NumberFormat();
            document.getElementById('amntWastedInput').value = numberFormat.formatNumberString(document.getElementById('amntWastedInput').value, 4);
            CERN_MEDS_WASTE_01.CalculateGivenAmount(document.getElementById('amntWastedInput').value);
            
            if (event.keyCode == 13) {
                document.getElementById('wasteButton').click();
            }
        },
        EnableWasteButton: function () {
            document.getElementById('wasteButton').disabled = false;
        },
        CalculateWastedAmount: function (amountGiven) {
            if (amountGiven != "") {
                var numberFormat = new NumberFormat();
                var curMedWasteTransaction = CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex];
                var wasteTxRemainingAmount = curMedWasteTransaction.REMAINING_AMOUNT;
                var wasteAmount = numberFormat.format(wasteTxRemainingAmount - amountGiven, 4);

                if (amountGiven < 0) {
                    alert(i18n.AMOUNT_GIVEN_IS_NEGATIVE);
                    this.ClearEnteredAmountScreen();
                } else if (wasteAmount >= 0) {
                    document.getElementById('amntWastedInput').value = wasteAmount;
                    document.getElementById('wasteButton').disabled = false;
                    this.SetCreditPatientAvailability(wasteAmount);
                } else {
                    var invalidGivenAmountMessage = i18n.AMOUNT_GIVEN_TOO_LARGE.replace("{0}", amountGiven).replace("{1}", wasteTxRemainingAmount);
                    alert(invalidGivenAmountMessage);
                    this.ClearEnteredAmountScreen();
                }
            } else {
                this.ClearEnteredAmountScreen();
            }
        },
        CalculateGivenAmount: function (amountWasted) {
            if (amountWasted != "") {
                var numberFormat = new NumberFormat();
                var curMedWasteTransaction = CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex];
                var wasteTxRemainingAmount = curMedWasteTransaction.REMAINING_AMOUNT;
                var givenAmount = numberFormat.format(wasteTxRemainingAmount - amountWasted, 4);
                
                if (amountWasted < 0) {
                    alert(i18n.AMOUNT_WASTED_IS_NEGATIVE);
                    this.ClearEnteredAmountScreen();
                } else if (givenAmount >= 0) {
                    document.getElementById('amntGivenInput').value = givenAmount;
                    document.getElementById('wasteButton').disabled = false;
                    this.SetCreditPatientAvailability(amountWasted);
                } else {
                    var invalidWastedAmountMessage = i18n.AMOUNT_WASTED_TOO_LARGE.replace("{0}", amountWasted).replace("{1}", wasteTxRemainingAmount);
                    alert(invalidWastedAmountMessage);
                    this.ClearEnteredAmountScreen();
                }
            } else {
                this.ClearEnteredAmountScreen();
            }
        },
        ValidateAmount: function (amountObj) {
            var amount = amountObj.value;
            
            document.getElementById('wasteButton').disabled = true;
            
            if (amount != "") {
                var numberFormat = new NumberFormat();
                var roundedAmount = numberFormat.formatNumberString(amount, 4);
                amountObj.value = roundedAmount;
                
                var curMedWasteTransaction = CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex];
                
                if (roundedAmount < 0) {
                    alert(i18n.AMOUNT_ENTERED_IS_NEGATIVE);
                    this.ClearEnteredAmountScreen();
                } else {
                    if (document.getElementById('amntGivenInput').value == '') {
                        document.getElementById('amntGivenInput').value = 0;
                    }

                    if (document.getElementById('amntWastedInput').value == '') {
                        document.getElementById('amntWastedInput').value = 0;
                    }

                    var givenAmount = Number(document.getElementById('amntGivenInput').value);
                    var wastedAmount = Number(document.getElementById('amntWastedInput').value);
                    var wasteTxRemainingAmount = Number(curMedWasteTransaction.REMAINING_AMOUNT);

                    if ((givenAmount + wastedAmount) > wasteTxRemainingAmount) {
                        var invalidAmountMessage = i18n.AMOUNT_ENTERED_TOO_LARGE.replace("{0}", givenAmount).replace("{1}", wastedAmount).replace("{2}", wasteTxRemainingAmount);
                        alert(invalidAmountMessage);
                        this.ClearEnteredAmountScreen();
                    }
                    
                    document.getElementById('wasteButton').disabled = false;
                }
            } else {
                this.ClearEnteredAmountScreen();
            }
        },
        ClearEnteredAmountScreen: function () {
            document.getElementById('amntWastedInput').value = "";
            document.getElementById('amntGivenInput').value = "";
            document.getElementById('wasteButton').disabled = true;
        },
        SetCreditPatientAvailability: function (amountWasted) {
            var iNonAdminAmt = 0;

            //Check CareFusion can_credit_waste_ind for user
            if (CERN_MEDS_WASTE_01.comp.getUser().USER_INDICATORS.CAN_CREDIT_WASTE_IND == 1) {
                var wasteItem = CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex];
                if (wasteItem.STRENGTH > 0.0005) {
                    iNonAdminAmt = Math.floor((amountWasted / wasteItem.STRENGTH) + 0.0000005);
                    if ((amountWasted / wasteItem.STRENGTH) > (iNonAdminAmt + 0.0005))
                        iNonAdminAmt = 0; // disallow partial credit
                }
                else if (wasteItem.VOLUME > 0.0005) {
                    iNonAdminAmt = Math.floor(amountWasted / wasteItem.VOLUME);
                    if ((amountWasted / wasteItem.VOLUME) > (iNonAdminAmt + 0.0005))
                        iNonAdminAmt = 0; // disallow partial credit
                }
                else {
                    iNonAdminAmt = Math.floor(amountWasted);
                    if (amountWasted > (iNonAdminAmt + 0.0005))
                        iNonAdminAmt = 0; // disallow partial credit
                }
            }

            if (iNonAdminAmt == 0) {
                document.getElementById('creditPatientCheckbox').disabled = true;
                document.getElementById('creditPatientCheckbox').checked = false;
            } else {
                document.getElementById('creditPatientCheckbox').disabled = false;
            }
        },
        ProcessRemoveAmountInput: function () {
            CERN_MEDS_WASTE_01.ValidateAmountRemoved();
            
            var removeAmount = document.getElementById('amntRemovedInput').value;
            if (removeAmount != "") {
                var numberFormat = new NumberFormat();
                removeAmount = numberFormat.truncate(new Number(removeAmount), 4);
                
                if (removeAmount > 0) {
                    this.curMedTransactionsToWaste[this.curMedTransactionIndex].REMOVE_AMOUNT = removeAmount;
                    this.curMedTransactionsToWaste[this.curMedTransactionIndex].REMAINING_AMOUNT = removeAmount;
                    this.ShowAmountGivenForm();
                }
            } else {
                alert(i18n.PLEASE_ENTER_AMOUNT_REMOVED_TO_CONTINUE); 
                document.getElementById('amntRemovedInput').value = "";
                document.getElementById('removeButton').disabled = true;
            }
        },
        ProcessWasteAmountInput: function () {
            var giveAmount = document.getElementById('amntGivenInput').value;
            var wasteAmount = document.getElementById('amntWastedInput').value;
            
            if (wasteAmount != "" && giveAmount != "") {
                this.curMedTransactionsToWaste[this.curMedTransactionIndex].GIVE_AMOUNT = new Number(giveAmount);
                this.curMedTransactionsToWaste[this.curMedTransactionIndex].WASTE_AMOUNT = new Number(wasteAmount);
                this.AskCDCQuestions(0);
            } else {
                alert(i18n.PLEASE_ENTER_AMOUNT_GIVEN_TO_CONTINUE);
                document.getElementById('amntWastedInput').value = "";
                document.getElementById('amntGivenInput').value = "";
                document.getElementById('wasteButton').disabled = true;
            }
        },
        AskCDCQuestions: function (index) {
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
                        this.AskGeneralCDCQuestion(curCDCQuestion, index);
                }
            }
        },
        AskFreeTextCDCQuestion: function (curCDCQuestion, index) {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            var indexText = "&nbsp;&nbsp;&nbsp;(" + (index + 1) + " of " + this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS.length + ")";
            
            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.CDC_HEADER, indexText, "</span><br/>");
            jsHTML.push(curCDCQuestion.LIST_NAME, " <input type='text' name='wasteCDCAnswer' onClick='this.select();' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value=''><br/>");

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
        ProcessFreeTextAnswer: function (index) {
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
        AskSingleSelectCDCQuestion: function (curCDCQuestion, index) {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            var indexText = "&nbsp;&nbsp;&nbsp;(" + (index + 1) + " of " + this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS.length + ")";

            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.CDC_HEADER, indexText, "</span><br/>");
            jsHTML.push(curCDCQuestion.LIST_NAME, "<br/>");

            jsHTML.push("<form name=cdcAnswerRadioForm method='get' action='' onsubmit='return false;'>");
            cdcAnswers = curCDCQuestion.CDC_ANSWERS;
            for (var x = 0 in cdcAnswers) {
                jsHTML.push("<input type='radio' name='cdcAnswerRadio' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' onclick='if(this.checked){CERN_MEDS_WASTE_01.DisableFreeTextInput()}' value='" + cdcAnswers[x].ANSWER_NAME + "'>" + cdcAnswers[x].ANSWER_NAME + "<br>");
            }
            if (curCDCQuestion.ENTER_IND == 1) {
                jsHTML.push("<input type='radio' name='cdcAnswerRadio' value='FreeTextAnswerRadio' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' onclick='if(this.checked){CERN_MEDS_WASTE_01.FreeTextOptionSelected()}'>")
                jsHTML.push("<input type='text' id='freeTextAnswer' onClick='this.select();' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value='Other' disabled><br>");
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
        AnswerCDC_KeyDown: function () {
            if (event.keyCode == 13) {
                document.getElementById('answerCDCQuestionButton').click();
            }
        },
        ProcessSingleSelectCDCAnswer: function (index) {
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
                for (i = 0; i < length; i++) {
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
        AskMultiSelectCDCQuestion: function (curCDCQuestion, index) {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            var indexText = "&nbsp;&nbsp;&nbsp;(" + (index + 1) + " of " + this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS.length + ")";

            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.CDC_HEADER, indexText, "</span><br/>");
            jsHTML.push(curCDCQuestion.LIST_NAME, " (", i18n.PICK_UP_TO_THREE, ") ", "<br/>");

            jsHTML.push("<form name=cdcAnswerCheckboxForm method='get' action='' onsubmit='return false;'>");
            cdcAnswers = curCDCQuestion.CDC_ANSWERS;
            for (var x = 0 in cdcAnswers) {
                jsHTML.push("<input type='checkbox' name='cdcAnswerCheckbox' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' onclick='if(this.checked){CERN_MEDS_WASTE_01.DisableFreeTextInput()}' value='" + cdcAnswers[x].ANSWER_NAME + "'>" + cdcAnswers[x].ANSWER_NAME + "<br>");
            }
            if (curCDCQuestion.ENTER_IND == 1) {
                jsHTML.push("<input type='checkbox' name='cdcAnswerCheckbox' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value='FreeTextAnswerCheckbox' onclick='CERN_MEDS_WASTE_01.ToggleFreeTextOption(this)'>")
                jsHTML.push("<input type='text' id='freeTextAnswer' onClick='this.select();' onkeydown='CERN_MEDS_WASTE_01.AnswerCDC_KeyDown()' value='Other' disabled><br>");
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
        ToggleFreeTextOption: function (freeTextCheckbox) {
            var freeTextAnswerElement = document.getElementById("freeTextAnswer");
            
            if(freeTextCheckbox.checked) {
                freeTextAnswerElement.disabled = false;
                freeTextAnswerElement.select();
            } else {
                freeTextAnswerElement.disabled = true;
            }
        },
        ProcessMultiSelectCDCAnswer: function (index) {
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
                for (i = 0; i < length; i++) {
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
                        };
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
        AskGeneralCDCQuestion: function (curCDCQuestion, index) {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            var indexText = "&nbsp;&nbsp;&nbsp;(" + (index + 1) + " of " + this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS.length + ")";

            jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.CDC_HEADER, indexText, "</span><br/>");
            jsHTML.push(curCDCQuestion.LIST_NAME, "<br/>");

            jsHTML.push("<input type='button' name='answerCDCQuestionButton' onClick='CERN_MEDS_WASTE_01.ProcessGeneralAnswer(", index, ")' value='", i18n.OK, "'>");
            jsHTML.push("<input type='button' name='cancelButton' onClick='CERN_MEDS_WASTE_01.CancelWasteProcess()' value='", i18n.CANCEL, "'>");
            jsHTML.push("<br/></h3></div>");

            content.push("<div class='", MP_Util.GetContentClass(this.comp, 0), "'>", jsHTML.join(""), "</div>");
            sHTML = content.join("");

            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");
        },
        ProcessGeneralAnswer: function (index) {
            this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].ANSWER_1 = '';
            this.curMedTransactionsToWaste[this.curMedTransactionIndex].CDC_INPUTS[index].SKIPPED = false;
            this.AskCDCQuestions(++index);
        },
        ShowWitnessScreen: function () {
            if (this.curMedTransactionsToWaste[this.curMedTransactionIndex].WITNESS_REQUIRED_IND == 1) {
                var sHTML = "";
                var jsHTML = [];
                var content = [];

                jsHTML = BuildWasteMedInfoDisplay(this.curMedTransactionsToWaste, this.curMedTransactionIndex, true);
                jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-title'>", i18n.WITNESS_REQURED, "</span><br/>");
                jsHTML.push(i18n.WITNESS, " <br/><input type='text' onClick='this.select();' onkeydown='CERN_MEDS_WASTE_01.WitnessUserName_KeyDown()' name='wasteWitnessInput' value=''><br/>");
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
        WitnessUserName_KeyDown: function () {
            if (event.keyCode == 13)
                document.getElementById('wasteWitnessPasswordInput').select();
        },
        WitnessUserPassword_KeyDown: function () {
            if (event.keyCode == 13)
                document.getElementById('submitWitnessInfoButton').focus();
        },
        EncryptPassword: function () {
            var user_pswd = document.getElementById('wasteWitnessPasswordInput').value
            if (user_pswd.length <= 0) {
                alert(i18n.ENTER_USER_NAME_AND_PASSWORD);
            } else {
                var user_id = new String(document.getElementById('wasteWitnessInput').value).toUpperCase();
                var curUser_id = new String(CERN_MEDS_WASTE_01.comp.getUser().NATIVE_ID).toUpperCase();
    
                if (trim(user_id) == trim(curUser_id)) {
                    alert(i18n.CAN_NOT_WITNESS_OWN_WASTE);
                } else {
                    doEncryption(user_pswd, function (result) {
                        var base64 = rstr2b64(result.cipher);
                        CERN_MEDS_WASTE_01.PrepareAuthenticateWitnessRequest(base64);
                    });
                }
            }
        },
        CancelWasteProcess: function () {
            this.curMedTransactionIndex = -1;

            CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions()
        },
        PrepareAuthenticateWitnessRequest: function (encryptedPswd) {
            var criterion = this.comp.getCriterion();
            var sendAr = [];

            var user_id = new String(document.getElementById('wasteWitnessInput').value);

            if (user_id.length <= 0 || encryptedPswd.length <= 0) {
                alert(i18n.ENTER_USER_NAME_AND_PASSWORD);
            } else {
                //The get transactions to waste can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
                var sHTML = buildInitLoadingPage(this.comp);
                MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

                var user_maintenance_request = new Object();

                var witness_user = new Object();
                witness_user.native_id = user_id;
                witness_user.foreign_id = "";
                witness_user.person_id = 0;
                witness_user.user_pswd = encryptedPswd;
                user_maintenance_request.witness_user = witness_user;
                
                CERN_MEDS_WASTE_01.curWitnessUserID = user_id;

                var user = new Object();
                user.native_id = "";
                user.foreign_id = "";
                user.person_id = criterion.provider_id + ".0";
                user.user_pswd = "";
                user_maintenance_request.user = user;

                var request_indicators = new Object();
                request_indicators.transaction_ind = 3;  //3 - Authenticate Witness

                user_maintenance_request.request_indicators = request_indicators;
               
                var patientContext = new Object();
            	patientContext.person_id = criterion.person_id;
            	patientContext.encounter_id = criterion.encntr_id;
            	user_maintenance_request.patient_context = patientContext;

                var json_object = new Object();
                json_object.user_maintenance_request = user_maintenance_request;

                var json_request = JSON.stringify(json_object);

                sendAr.push("^MINE^", "^USER_MAINTENANCE^", "^" + json_request + "^");
                SendAuthenticateWitnessCCLRequestWrapper(this.comp, sendAr);
            }
        },
        PrepareRemoteWasteRequest: function () {
            //The get transactions to waste can take a couple seconds, so display a "Loading..." message until it completes to let the user know the system is working
            var sHTML = buildInitLoadingPage(this.comp);
            MP_Util.Doc.FinalizeComponent(sHTML, this.comp, "");

            var criterion = this.comp.getCriterion();
            var sendAr = [];

            var remote_waste_request = new Object();

            var user = new Object();
            user.person_id = criterion.provider_id + ".0";

            remote_waste_request.user = user;
            
            var patient_context = new Object();
	    patient_context.person_id=criterion.person_id + ".0";
	    patient_context.encounter_id = criterion.encntr_id + ".0";
			
	    remote_waste_request.patient_context = patient_context;

            //Set the waste tx time before setting to the request
            dateTime = new Date();
            this.curMedTransactionsToWaste[this.curMedTransactionIndex].WASTE_TX_TIME = dateTime.format('isoDateTime');

            //Set the CareFusion user details onto the waste transaction
            var cfnUser = this.comp.getUser();
            this.curMedTransactionsToWaste[this.curMedTransactionIndex].WASTE_USER_ID = cfnUser.NATIVE_ID;
            this.curMedTransactionsToWaste[this.curMedTransactionIndex].WASTE_USER_NAME = cfnUser.USER_NAME;
            remote_waste_request.waste = this.curMedTransactionsToWaste[this.curMedTransactionIndex];
            remote_waste_request.process_waste_type_ind = this.curWasteTxType;

            var json_object = new Object();
            json_object.remote_waste_request = remote_waste_request;

            var json_request = JSON.stringify(json_object);

            sendAr.push("^MINE^", "^REMOTE_WASTE^", "^" + json_request + "^");
            SendRemoteWasteCCLRequestWrapper(this.comp, sendAr);
        },
        WasteSubmitted: function () {
            var sHTML = "";
            var jsHTML = [];
            var content = [];
            
            jsHTML = BuildWasteMedInfoDisplay(this.curMedTransactionsToWaste, this.curMedTransactionIndex, true);
            
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
        jsHTML.push("<tr> <td class='waste-med-info-data'>", curMedTransactionsToWaste[curMedTransactionIndex].REMOVE_AMOUNT, " ", amountUnitsOfMeasure, "</td></tr></table></td>");
        jsHTML.push("<td><table><tr><td class='waste-med-info-title'>", i18n.AMOUNT_REMAINING, "</td></tr>");
        jsHTML.push("<tr><td class='waste-med-info-data'>", curMedTransactionsToWaste[curMedTransactionIndex].REMAINING_AMOUNT, " ", amountUnitsOfMeasure, "</td></tr></table></td>");
        jsHTML.push("<td><table><tr><td class='waste-med-info-title'>", i18n.TOTAL_AMOUNT_RETURNED, "</td></tr>");
        jsHTML.push("<tr><td class='waste-med-info-data'>", curMedTransactionsToWaste[curMedTransactionIndex].TOTAL_RETURN_AMOUNT, " ", amountUnitsOfMeasure, "</td></tr></table></td>");
        jsHTML.push("<td><table><tr><td class='waste-med-info-title'>", i18n.TOTAL_AMOUNT_WASTED, "</td></tr>");
        jsHTML.push("<tr><td class='waste-med-info-data'>", curMedTransactionsToWaste[curMedTransactionIndex].TOTAL_WASTE_AMOUNT, " ", amountUnitsOfMeasure, "</td></tr></table></td>");
        if (showAmountWasted == true) {
            jsHTML.push("<td><table><tr> <td class='sub-sec-title'><b>", i18n.AMOUNT_GIVEN, "</b></td></tr>");
            jsHTML.push("<tr><td class='sub-sec-title'><b>", curMedTransactionsToWaste[curMedTransactionIndex].GIVE_AMOUNT, " ", amountUnitsOfMeasure, "</b></td></tr></table></td>");
            jsHTML.push("<td><table><tr> <td class='sub-sec-title'><b>", i18n.AMOUNT_WASTED, "</b></td></tr>");
            jsHTML.push("<tr><td class='sub-sec-title'><b>", curMedTransactionsToWaste[curMedTransactionIndex].WASTE_AMOUNT, " ", amountUnitsOfMeasure, "</b></td></tr></table></td>");
        }
        jsHTML.push("</tr></table></td></tr></table>");

        return jsHTML;
    }

    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to USER_MAINTENANCE and examines the reply status before
    //determining how to handle the reply.
    function SendAuthenticateWitnessCCLRequestWrapper(component, paramAr) {
        var timerLoadComponent = MP_Util.CreateTimer(component.getComponentLoadTimerName());

        var info = new XMLCclRequest();
        info.onreadystatechange = function () {
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
                        
                        if (recordData.REPLY_DATA.USER.USER_INDICATORS.CAN_WITNESS_IND == 0) {
                            alert(i18n.WITNESS_NO_PRIVILEGE);
                            
                            CERN_MEDS_WASTE_01.ShowWitnessScreen();
                        } else {
                            CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex].WITNESS_USER_NAME =
                                recordData.REPLY_DATA.USER.USER_NAME;
                            CERN_MEDS_WASTE_01.curMedTransactionsToWaste[CERN_MEDS_WASTE_01.curMedTransactionIndex].WITNESS_ID =
                                CERN_MEDS_WASTE_01.curWitnessUserID;
                            
                            CERN_MEDS_WASTE_01.PrepareRemoteWasteRequest();
                        }
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
    function SendRemoteWasteCCLRequestWrapper(component, paramAr) {
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
                        
                        if (recordData.REPLY_DATA.STATUS_INFO.OPERATION_STATUS_FLAG == -1) {
                            displayAlertMessage(i18n.UNABLE_TO_PROCESS, recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL);
                            CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions();
                        } else {
                            CERN_MEDS_WASTE_01.WasteSubmitted();
                        }
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

    //A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to RETRIEVE_TX_TO_WASTE and examines the reply status before
    //determining how to handle the reply.
    function GetTransactionsToWasteCCLRequestWrapper(component, paramAr, retrieval_type_filter) {
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
                                
                                displayAlertMessage(i18n.ERROR_RETREIVING_WASTE_INFO, userErrorMsg);
                            }
                        }

                        //If the get tx to waste was for a "searched med"
                        if (retrieval_type_filter == 1) {
                            CERN_MEDS_WASTE_01.curMedTransactionsToWaste = recordData.REPLY_DATA.WASTE_TXS;
                            CERN_MEDS_WASTE_01.curWastePreferences = recordData.REPLY_DATA.WASTE_PREFERENCES;
                            
                            if (CERN_MEDS_WASTE_01.curMedTransactionsToWaste != null && CERN_MEDS_WASTE_01.curMedTransactionsToWaste != "") {
                                CERN_MEDS_WASTE_01.curMedTransactionIndex = 0;
                                CERN_MEDS_WASTE_01.curWasteTxType = 0;
                                CERN_MEDS_WASTE_01.ShowAmountRemovedForm();
                            } else {
                                CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions();
                            }
                        } else {
                            CERN_MEDS_WASTE_01.curWasteTxType = 1;
                            CERN_MEDS_WASTE_01.curMedTransactionsToWaste = recordData.REPLY_DATA.WASTE_TXS;
                            CERN_MEDS_WASTE_01.curWastePreferences = recordData.REPLY_DATA.WASTE_PREFERENCES;

                            CERN_MEDS_WASTE_01.ShowWasteableMedTransactions(component, retrieval_type_filter);
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
                                    
                                    CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions();
                                }
                            }
                            
                            if (userErrorMsg == "") {
                                alert(i18n.ERROR_CONTACT_SYSTEM_ADMIN);
                                
                                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), i18n.ERROR_CONTACT_SYSTEM_ADMIN), component, "");
                            }
                        } else {
                            userErrorMsg = recordData.REPLY_DATA.STATUS_INFO.OPERATION_DETAIL;
                            displayAlertMessage(i18n.UNABLE_TO_FIND, userErrorMsg);
                            
                            CERN_MEDS_WASTE_01.ShowRetrieveWasteTxOptions();
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
    function SearchForMedToWasteCCLRequestWrapper(component, paramAr) {
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
            return SortByMedName(a, b); //if times are equal, sort by med name
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
