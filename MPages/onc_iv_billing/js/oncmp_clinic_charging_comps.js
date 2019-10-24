/*********************************************************************/
/**
* Project: oncmp_clinical_charging_comps.js
* Version 1.0.0
*/
/*********************************************************************/
/**
*   this function is used to prevent special key action on loaded module.
*   key code  more than 31 to 47 are space to  help keys. 
*   key code  more than 48 and less than 57 are  equal brace-right to parenright bracket-right.
*   Ref : https://gist.github.com/lbj96347/2567917.
**/
function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

/**
*   create modules styling object.
*/
function FinalizeChargesComponentStyle()
{
    this.initByNamespace("onc_iv");
}
FinalizeChargesComponentStyle.inherits(ComponentStyle);

/**
*   Function is used to initialize the component filters of charges panel. 
*   This function will be invoked by GetSummary() of Clinical_driver_comp.js.
*   when bedrock filters are fetched from BEDROCK tables.
*   Also this function contains set and get methods for all the filters set for charges panel.
*   Also Contains the initial function called to load the fetched data.
*   Once after "onc_charging_driver" is successful render function will be called to render the initial page,
*   render function intern invokes CreateFinalizeChargesPanel() to get the HTML code for rendering.
*/
function FinalizeChargesComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new FinalizeChargesComponentStyle());
    this.setComponentRenderTimerName("ENG:MPG.ONC_FINALIZE_CHARGES.01 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.setDisplay(true);
    this.m_emModInd = false;
    this.m_iiModInd = false;

    // Insert data will be called once "onc_charging_driver" is succeeded.
    FinalizeChargesComponent.method("InsertData", function ()
    {
		CERN_FINALIZECHARGES_O1.GetFinalizeChargesTable(this);
    });

    // handle success will be invoked when onc_charge_driver script is successfully loaded.
    FinalizeChargesComponent.method("HandleSuccess", function (recordData)
    {
        CERN_FINALIZECHARGES_O1.CreateFinalizeChargesPanel(this, recordData);
    });

    // setEMModCodes called to set Modifier codes form EM charges.
    FinalizeChargesComponent.method("setEMModCodes", function (value)
    {
        this.m_emModCodes = value;
    });

    // getEMModCodes called to get Modifier codes form EM charges.
    FinalizeChargesComponent.method("getEMModCodes", function ()
    {
        if (this.m_emModCodes != null)
            return this.m_emModCodes;
    });

    // setEMModInd called to set MAR type modifier indicator.
    FinalizeChargesComponent.method("setEMModInd", function (value)
    {
        this.m_emModInd = value;
    });

    // getEMModInd called to get MAR type modifier indicator.
    FinalizeChargesComponent.method("getEMModInd", function ()
    {
        return this.m_emModInd;
    });

    // setIIModCodes called to set Modifier codes form II charges.
    FinalizeChargesComponent.method("setIIModCodes", function (value)
    {
        this.m_iiModCodes = value;
    });

    // getIIModCodes called to get Modifier codes form II charges.
    FinalizeChargesComponent.method("getIIModCodes", function ()
    {
        if (this.m_iiModCodes != null)
            return this.m_iiModCodes;
    });

    // setIIModInd called to set MAR type modifier indicator.
    FinalizeChargesComponent.method("setIIModInd", function (value)
    {
        this.m_iiModInd = value;
    });

    // getIIModInd called to get MAR type modifier indicator.
    FinalizeChargesComponent.method("getIIModInd", function ()
    {
        return this.m_iiModInd;
    });

    // setSubmitChargesInd to set flag to display/not display submit button. 
    FinalizeChargesComponent.method("setSubmitChargesInd", function (value)
    {
        m_iiSubmitCharges = value;
    });

    // getSubmitChargesInd to get flag status to display/not display submit button. 
    FinalizeChargesComponent.method("getSubmitChargesInd", function ()
    {
        if (m_iiSubmitCharges != null)
            return m_iiSubmitCharges;
    });
}

/**
*   Inherit the basic properties of MPage Base component to charges component. 
*/
FinalizeChargesComponent.inherits(MPageComponent);
var hmap = new Array();
var iihmap = new Array();

/**
*   Name space under which all the functions for generalized charges panel is configured.
*   Below are the list of functions available under this name-space.
*   GetFinalizeChargesTable()     : handles display of charges if anythings are saved in previous session.
*   CreateFinalizeChargesPanel()  : handles creation of charges panel.
**/
var CERN_FINALIZECHARGES_O1 = function ()
{
    return {
        /**
        *   this function is used to fetch any of the stored charges for encounter 
        *   this function invokes onc_get_charge_summary to get the stored charges.
        *   reply from onc_get_charge_summary will contains a XML file having charging information.
        *   component   : pointer to the current DOM object.
        **/
        GetFinalizeChargesTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            var emModcodes = component.getEMModCodes();
            var emMod_cds = MP_Util.CreateParamArray(emModcodes, 1);
            var iiModcodes = component.getIIModCodes();
            var iiMod_cds = MP_Util.CreateParamArray(iiModcodes, 1);
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", emMod_cds, iiMod_cds);
			MP_Core.XMLCclRequestWrapper(component, "onc_get_charge_summary", sendAr, true);
        },
		
        /**
        *   this function is used create charges panel. 
        *   this function will be invoked once onc_get_charge_summary script successful.
        *   component   : pointer to the current DOM object.
        *   recordData  : reply from script onc_get_charge_summary
        **/
        CreateFinalizeChargesPanel: function (component, recordData)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [], count = 0;
                var comp = m_xmlDoc.getElementsByTagName("Wizard");
                var panelList = comp[0].getElementsByTagName("PanelList");
                jsHTML.push("<div>");
                var proc = m_xmlDispCharges.getElementsByTagName("Procedure");
				var edits = m_xmlDispCharges.getElementsByTagName("Edit");
                if (infusionInjection && (proc.length > -1))
                {
                    if (recordData.II_MOD.length)
                    {
                        component.setIIModInd(true);
                        jsHTML.push("<div id='sc_infusion_div'><TABLE id='tblSC'>" +
								    "<thead id='theadSC' class='ch-sub-sec'>" +
								    "<tr><th colspan='4' class='tbl_header'>"+"<h3 class='txt_header'>" + 
                                    panelList[0].getElementsByTagName("Name")[0].childNodes[0].nodeValue + 
                                    "</h3></th></tr><tr><th id='fc_cpt' class='fc_cpt_withModifiers'>" + i18n.CPT + 
                                    "</th> <th id='fc_units' class='fc_units_withModifiers' >" + i18n.UNITS + "</th>" +
                                    "<th id='fc_modifiers' class='fc_modifiers' style='border:1px solid #F6F6F6;'>" + 
                                    i18n.MODIFIERS + "</th></tr></thead></TABLE>");
						
						if(proc.length == 0){
							jsHTML.push("<div style='text-align:center;margin-top:50px'>"+i18n.CPT_SUBMITTED+"<div>");							
							$('#submitCharges').attr("disabled", true);
						}
						if(edits.length > 0){
							
							$('#submitCharges').attr("disabled", true);
						}

                        jsHTML.push("<div id='ii_fc_tbody'><table id='ii_table'>");
                        
                        var count = 0;
                        for (var i = 0, il = proc.length; i < il; i++)
                        {                           
                            var zebraStripping = count % 2 === 0 ? "odd" : "even";
                            if (proc[i].getElementsByTagName("Source")[0].childNodes[0].nodeValue === "IV")
                            {
                                jsHTML.push("<tr id = 'row_" + count + "' class='row_" + zebraStripping + "'>" +
                                            "<td class='fc_cpt_withModifiers'>" + 
                                            proc[i].getElementsByTagName("CPT")[0].childNodes[0].nodeValue + " - " +
                                            proc[i].getElementsByTagName("CPTDescription")[0].childNodes[0].nodeValue +
											"</td><td class='fc_units_withModifiers'>" +
                                            proc[i].getElementsByTagName("Units")[0].childNodes[0].nodeValue +
                                            "</td><td class='fc_modifiers' id='ii_fc_modifiers" + count + "'>"+
                                            "<span id='ii_modvalues" + count +"' style='font-size:1em;'>"+
                                            "</span><div class='fc_modifiers_parentdiv'>"+
                                            "<div class='fc_modifiers_outerdiv' id='ii_fc_modifiers_outerdiv" + count + 
                                            "' onclick='IIModifersList(" + count + ");'> </div>" +
											"<div class='fc_modifiers_innerdiv' id='ii_fc_modifiers_innerdiv" + count + 
                                            "' style='background-color:#ffffff;font-size:1em;'>" +
											"<select multiple='multiple' size='3' id='ii_list-" + count + 
                                            "' class='ii_fc_modifiersList' onchange='enableBtn();'>");
                                
                                for (var j = 0, jl = recordData.II_MOD.length; j < jl; j++)
                                {
                                    jsHTML.push("<option value='" + recordData.II_MOD[j].CD + "'>" + recordData.II_MOD[j].DISP + "</option>");
                                    iihmap[recordData.II_MOD[j].CD] = recordData.II_MOD[j].DISP;
                                }
                                jsHTML.push("</select></div></div></td></tr>");
                                count++;
                            }
                        }
                        jsHTML.push("</table></div></div>");
                    }
                    else
                    {
                        component.setIIModInd(false);
                        jsHTML.push("<div id='sc_infusion_div'><TABLE id='tblSC'>" +
								    "<thead id='theadSC' class='ch-sub-sec'>" +
								    "<tr><th colspan='2' class='tbl_header'>"+
                                    "<h3 class='txt_header'>" + 
                                    panelList[0].getElementsByTagName("Name")[0].childNodes[0].nodeValue + 
                                    "</h3></th></tr><tr><th id='fc_cpt' class='fc_cpt_withoutModifiers'>" + 
                                    i18n.CPT +"</th> <th id='fc_units' class='fc_units_withoutModifiers' >" + 
                                    i18n.UNITS + "</th>"+"</tr></thead></TABLE><div id='ii_fc_tbody'>"+
                                    "<table id='ii_table'>");
                        
                        var count = 0;
                        for (var i = 0, il = proc.length; i < il; i++)
                        {
                            if (proc[i].getElementsByTagName("Source")[0].childNodes[0].nodeValue === "IV")
                            {
                                var zebraStripping = count % 2 === 0 ? "odd" : "even";
                                jsHTML.push("<tr id = 'row_" + count + "' class='row_" + zebraStripping + "'>" +
											"<td class='fc_cpt_withoutModifiers'>" + 
                                            proc[i].getElementsByTagName("CPT")[0].childNodes[0].nodeValue + " - " + 
                                            proc[i].getElementsByTagName("CPTDescription")[0].childNodes[0].nodeValue +
											"</td><td class='fc_units_withoutModifiers'>" + 
                                            proc[i].getElementsByTagName("Units")[0].childNodes[0].nodeValue +"</td></tr>");
                                count++;
                            }
                        }
                        jsHTML.push("</table></div></div>");
                    }
                }
                jsHTML.push("</div>");
                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

                if (evaluationManagement && !infusionInjection)
                {
                    _g('sc-charges-div').style.height = "100%";
                }
                else if (!evaluationManagement && infusionInjection)
                {
                    _g('sc_infusion_div').style.height = "98%";
                    _g('sc_infusion_div').style.padding = "0.5%";
                }
									
            }
            catch (err)
            {
                if (timerRenderComponent)
                {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally
            {
                if (timerRenderComponent)
                    timerRenderComponent.Stop();
            }
        }
    };
} ();

/**
*   This function is used to display modifier combo-box on over on summary table row. 
**/
var m;
$('#ii_table tbody tr td').live('mouseover', function ()
{
    var m = (this.id).substr(15);
    n = parseInt(m);
    $('#ii_fc_modifiers_outerdiv' + n).show();
    $('#ii_modvalues' + n).css('display', 'none');
});

/**
*   This function is used display data inside modifier combo-box. 
**/
function IIModifersList(k)
{
    var e = jQuery.Event("click");
    e.preventDefault();
    $('#ii_fc_modifiers_innerdiv' + k).slideToggle('fast', function ()
    {
        var fc_tbody_height1 = $('#ii_fc_tbody').height();
        var tc_tbody_offset1 = $('#ii_fc_tbody').offset().top;
        var totalrows1 = $('#ii_table').attr('rows').length;
        var offset1 = $('#ii_fc_modifiers_outerdiv' + k).offset();
        var topOffset1 = offset1.top;
        if ($(this).is(':visible'))
        {
            if ((n >= totalrows1 / 2) || (topOffset1 >= 450))
            {
                scrollposition1 = $('#ii_fc_tbody').scrollTop();
                $('#ii_fc_tbody').scrollTop(scrollposition1 + 50);
            }
        }
    });

    $('#ii_fc_modifiers_innerdiv' + k).css('position', 'absolute');
    $('.ii_fc_modifiersList').css('display', 'inline-block');
    $('.ii_fc_modifiersList').css('z-index', '4500');
}

/**
*   This function is used hide column on which combo-box is displayed. 
**/
$('#ii_table tbody tr td').live('mouseleave', function ()
{
    var m = (this.id).substr(15);
    n = parseInt(m);
    $('#ii_fc_modifiers_innerdiv' + n).hide();
    $('#ii_fc_modifiers_outerdiv' + n).hide();
    $('#ii_modvalues' + n).css('display', 'inline-block');
});

/**
*   This function is used hide modifier list when row is out of scope.
**/
$('.ii_fc_modifiersList').live('mouseleave', function ()
{
    $('#ii_fc_modifiers_innerdiv' + n).hide();
    $('#ii_fc_modifiers_outerdiv' + n).hide();
    flag = false;
});

/**
*   This function is used show modifier list when hovered on row.
**/
$('.ii_fc_modifiersList').live('mouseover', function ()
{
    $('#ii_fc_modifiers_outerdiv' + n).show();
    $('#ii_fc_modifiers_innerdiv' + n).show();
});

/**
*   This function is used handle selection of modifier in combo-box.
*   This function helps to retrieve the user selected data from combo-box.
**/
$('.ii_fc_modifiersList').live('mouseover', function ()
{
    $('#ii_list-' + n).click(function ()
    {
        if (!$('#ii_list-' + n).val())
        {
            $('#ii_fc_modifiers_outerdiv' + n).html('');
            $('#ii_modvalues' + n).html('');
        }
        else
        {
            var codeValue = $('#ii_list-' + n).val().toString().split(',');
            var dispValue = "";
            var retValue = "";
            for (var i = 0; i < codeValue.length; i++)
            {
                for (var key in iihmap)
                {
                    /* do something with key and hmap[key] */
                    retValue = iihmap[codeValue[i]];
                }
                dispValue = dispValue + retValue;
                if (i < codeValue.length - 1)
                    dispValue = dispValue + ",";
            }
            $('#ii_modvalues' + n).html("" + dispValue + "");
            $('#ii_fc_modifiers_outerdiv' + n).html("" + dispValue + "");
        }
    });
});

/**
*   This function is used handle enable/disable of submit button.
*   if user is already submitted the charges then navigating from
*   previous page and summary will keep button status disabled
**/
function enableBtn()
{
    if (m_iiSubmitCharges)
        $('#submitCharges').attr("disabled", false);
}

/*********************************************************************/
/**
* Project: infusion_injection.js
* Version 1.0.0
*/
/*********************************************************************/
/**
*   create modules styling object for infusion and injection panel.
*/
function InjectionInfusionComponentStyle()
{
    this.initByNamespace("ii");
}

InjectionInfusionComponentStyle.inherits(ComponentStyle);

/**
*   Function is used to initialize the component filters of infusion and injection panel. 
*   This function will be invoked by GetInfusionInjection() of Clinical_driver_comp.js.
*   when bedrock filters are fetched from BEDROCK tables.
*   Also this function contains set and get methods for all the filters set for infusion and injection panel.
*   Also Contains the initial function called to load the fetched data.
*   Once after "onc_get_infusion_injection" is successful render function will be called to render the initial page,
*   render function intern invokes CreateInfusionPanel() to get the HTML code for rendering.
*/
function InjectionInfusionComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new InjectionInfusionComponentStyle());
    this.setComponentRenderTimerName("ENG:MPG.ONC_INJECTION_INFUSION.01 - render component");
    this.setIncludeLineNumber(false);
    this.setScope(2);
    this.setDisplay(true);
    this.automateMedication = false;

    // InsertData : used to get HTML code of infusion and injection table. 
    InjectionInfusionComponent.method("InsertData", function ()
    {		
        CERN_INFUSIONINJECTION_O1.GetInjectionInfusionTable(this);
    });

    // HandleSuccess : used to create HTML code using reply from onc_get_infusion_injection.prg
    InjectionInfusionComponent.method("HandleSuccess", function (recordData)
    {		
        CERN_INFUSIONINJECTION_O1.CreateInfusionPanel(this, recordData);
    });

    // setInjectInfuse : used to set filter value whether to display infusion tab or not.
    InjectionInfusionComponent.method("setInjectInfuse", function (value)
    {
        infusionInjection = true;
    });

    // setMedfromMAR : used to set filter value which represents the automation or Manual IV mode.
    // value 1  : for automation mode, medication will be fetched from MAR.
    // value 2  : for manual mode.
    InjectionInfusionComponent.method("setMedfromMAR", function (value)
    {	
		m_AutomateIvInd	= value;
        this.automateMedication = value;				
    });

    // getMedfromMAR : used to get filter value which represents the automation or Manual IV mode.
    // value 1  : for automation mode, medication will be fetched from MAR.
    // value 2  : for manual mode.
    InjectionInfusionComponent.method("getMedfromMAR", function ()
    {
		javascript:CERN_INFUSIONINJECTION_O1.CallReadAutoPrefs();
		if(m_AutomateIvInd)
		{		
			this.automateMedication = true;
			return (this.automateMedication);
		}
		else
		{
			this.automateMedication = false;
			return (this.automateMedication);
		}
		
    });

    // setSiteCodes : filter values for site combo-box control in manual mode.
    InjectionInfusionComponent.method("setSiteCodes", function (value)
    {
        this.m_siteCodes = value;
    });

     // getSiteCodes : filter values for site combo-box control in manual mode.
    InjectionInfusionComponent.method("getSiteCodes", function ()
    {
        if (this.m_siteCodes != null)
            return this.m_siteCodes;
    });

    // setMARModifyTypeInd : function to set MAR type change combo-box option in automation mode.
    InjectionInfusionComponent.method("setMARModifyTypeInd", function (value)
    {
        m_iiMARModifyType = value;
    });

    // getMARModifyTypeInd : function to get MAR type change combo-box option in automation mode.
    InjectionInfusionComponent.method("setMARDeleteInd", function (value)
    {
        m_iiMARDelete = value;
    });
}

/**
*   Inherit the basic properties of MPage Base component to infusion and injection component. 
*/
InjectionInfusionComponent.inherits(MPageComponent);

/**
*   Name space under which all the functions for infusion and injection panel is configured.
*   Below are the list of functions available under this name-space.
*   PopulateTypeDialog()        : function used to handle display of type combo-box when modify MAR type indicator is ON.
*   validateSave()              : function used to validate the field values for a order when added in Manual mode.
*   setSite()                   : function used to set the site value to table when user selects.
*   setRoutes()                 : function used to set the site value to table when user selects.
*   selectRow()                 : function used to select the row in II table in manual mode.
*   highLightRow()              : function to highlight selected row for modification in manual mode.
*   GetInjectionInfusionTable() : function used to fetch all the II result for the selected encounter.
*   CreateInfusionPanel()       : function used to create II table after GetInjectionInfusionTable() returns success.
*   CancelAddNew()              : function added to switch the button for add and cancel , when user do some action on created row.
*   DateTimePicker()            : function used to display calender.
*   DeleteRow ()                : function used to delete the selected row in II table.
*   AutomateIv()                : function used to set flags for automation/manual mode.
*   Save()                      : function used to save data from selection boxes to II table in manual mode.
*   ResetZibraStripping()       : function used to reset the zebra-stripping when user removes or ads any new row.
*   GetSelectedOption()         : function used to get selected option for site combo-box.
*   GetSelectedOptionRoutes()   : function used to get selected option for routes combo-box.
*   SelectOption()              : function used to high light the selected option in route and site combo-box.
*   Reset()                     : function used to reset fields once cancel button is pressed in manual mode.
*   GetDuration()               : function used to calculate duration of the medication.
*   PopulateValues()            : function used to populate values in selection boxes when user selects a row in manual mode.
*   UpdateRow()                 : function used to update rows of II table when user selects ADD/MODIFY in manual mode.
*   GetMedsList()               : function used to fetch medication in search box when user start entering characters.
*   HandleSelection()           : function used to handle selection of medication from search box.
*   CreateSuggestionLine()      : function used to create suggestion box when user enters medication name in search box.
*   HighlightValue()            : function used to highlight specific portion of the string in search-box.
*   Refresh()                   : function used to only refresh II table.
*   CallAutoPrefs()             : function used to set auto-preference value to name_value_preference table.
*   CallReadAutoPrefs()         : function used to get value of auto-preference from name_value_preference table.
*   GetInfusionData()           : function used to get II data for selected encounter by calling  onc_get_infusion_injection.
*   SetMARInd()                 : function used to get MAR type indicator (this indicator tell whether to fetch data from MAR table or NOT).
*   GetMARInd()                 : function used to get MAR  type indicator.
*   GetInfusionDataFromXML()    : function used to display II table from saved XML.
*   DeleteOption()              : function used to handle delete operation of II table row.
*	checkForSubmittedOrders()	: function used to check the submitted orders.
**/
var CERN_INFUSIONINJECTION_O1 = function ()
{
    var totalRowsCount = 0;
    var radioType = "";
    var adt = "";
    var atm = "";
    var cdt = "";
    var ctm = "";
    var mins = 1000 * 60;
    var KEY_UP = 38;
    var KEY_DOWN = 40;
    var KEY_TAB = 9;
    var KEY_ENTER = 13;
    var KEY_SPACE = 32;
    var prevRowId = "";
    var saveFlag = 1;
    var compNs = "";
    var compId = "";
    var siteValues = [];
	var RouteValues = [];
	var RouteDispValues = [];
    var hmap = new Array();
    var marInd = false;
	var hmapAdminRoutes = new Array();
    var tableCellID = 0;

    /**
    *   This function is used to create and append administered route 
    *   type selection option in automation mode.
    *   This combo-box will appear when user hovers on Route column rows in automateIVmode.
    **/
    function PopulateTypeDialog(tHTML)
    {
        /* Populate Type combo*/

        var dispName = "", valueId = "", nodDisp = "", nodValue = "";
        var comp = m_xmlDoc.getElementsByTagName("Component");
        var typeHTML = "<div id = 'comboType'><select name='medType' class ='comboOpt'><option value='ChooseType'>" + i18n.CHOOSE_TYPE + "</option>";
        for (var c = 0; c < comp.length; c++)
        {
            if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "INFUSION_INJECTION")
            {
                var item = comp[c].getElementsByTagName("Item");
                for (var ch = 0; ch < item.length; ch++)
                {
                    var display = item[ch].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                    switch (display)
                    {
                        case "Type":
                            dispName = item[ch].getElementsByTagName("Disp");
                            valueId = item[ch].getElementsByTagName("ValueId");

                            for (var id = 0; id < dispName.length; id++)
                            {
                                nodDisp = dispName[id].childNodes[0].nodeValue;
                                nodValue = valueId[id].childNodes[0].nodeValue;
                                typeHTML = typeHTML + "<option  value='" + nodValue + "'>" + nodValue + "</option>"
                            }
                            break;
                        default:
                            //do nothing
                    }
                }
            }
        }
        typeHTML = typeHTML + "</select></div>";
        $(typeHTML).appendTo('body');
    }

    /**
    *   This function is used to validate the values selected in controls before appending them to II table in manual mode.
    *   This function validates below options:
    *   Site                        : combo-box.
    *   Type                        : Combo-box.
    *   Medication                  : search-box.
    *   Start/Stop Date and Time    : edit box
    **/
    function validateSave()
    {
        var bReturn = true;
        var theSel,theSelR, theR,the, vtime, vidx;
        theSel = this.document.getElementById('combodiv');
        the = theSel.selectedIndex;
        if (the == 0)
        {
            alert(i18n.SELECT_SITE);
            this.document.getElementById('combodiv').focus();
            return (false);
        }
		theSelR = this.document.getElementById('combodivAdminRoutes');
        theR = theSelR.selectedIndex;
        if (theR == 0)
        {
            alert(i18n.SELECT_TYPE);
            this.document.getElementById('combodivAdminRoutes').focus();
            return (false);
        }

        if (document.getElementById(compNs + "contentCtrl" + compId).disabled == false)
        {
            theSel = this.document.getElementById(compNs + "contentCtrl" + compId);

            var t11 = trim11(theSel.value);

            if (t11 === "")
            {
                alert(i18n.SELECT_MEDICATION);
                this.document.getElementById(compNs + "contentCtrl" + compId).value = '';
                this.document.getElementById(compNs + "contentCtrl" + compId).focus();
                return (false);
            }
        }

        if (document.getElementById('fc_date_cal').disabled == false)
        {
            vtime = document.getElementById('fc_date_cal').value;
            vidx = vtime.indexOf('*');
            if (vidx > -1)
            {
                alert(i18n.FILL_OUT_START_DATE);
                this.document.getElementById('fc_date_cal').focus();
                return (false);
            }
        }
        if (document.getElementById('fc_time').disabled == false)
        {
            vtime = document.getElementById('fc_time').value;
            vidx = vtime.indexOf('*');
            if (vidx > -1)
            {
                alert(i18n.FILL_OUT_START_TIME);
                this.document.getElementById('fc_time').focus();
                return (false);
            }
        }

        if (document.getElementById('fc_stop_date_cal').disabled == false)
        {
            vtime = document.getElementById('fc_stop_date_cal').value;
            vidx = vtime.indexOf('*');
            if (vidx > -1)
            {
				if(theR == 6 || theR == 7){
					
				}
				else{
					alert(i18n.FILL_OUT_STOP_DATE);
					this.document.getElementById('fc_stop_date_cal').focus();
					return (false);
				}
            }
        }
        if (document.getElementById('fc_stop_time').disabled == false)
        {
            vtime = document.getElementById('fc_stop_time').value;
            vidx = vtime.indexOf('*');
            if (vidx > -1)
            {
                if(theR == 6 || theR == 7){
				}
				else{
					alert(i18n.FILL_OUT_STOP_TIME);
					this.document.getElementById('fc_stop_time').focus();
					return (false);
				}
            }
        }

        var dtArrive = new Date(adt + " " + atm);
        var dtDischarge = new Date(cdt + " " + ctm);
		var dtStart;
		var dtStart;
		var strStartDate = getLocalisedDate(document.getElementById('fc_date_cal').value);
		var strStopDate = getLocalisedDate(document.getElementById('fc_stop_date_cal').value);
        if(m_localeName == "en_US"){
			dtStart = new Date(document.getElementById('fc_date_cal').value + " " + document.getElementById('fc_time').value);
			dtStop = new Date(document.getElementById('fc_stop_date_cal').value + " " + document.getElementById('fc_stop_time').value);
			if((m_startDateTimeSwitchValue.indexOf("D") > -1) && (m_stopDateTimeSwitchValue.indexOf("S")> -1)){
				
				dtStart = new Date(document.getElementById('fc_date_cal').value+ " " + document.getElementById('fc_time').value);
				//dtStart = new Date(document.getElementById('fc_date_cal').value+ " " + document.getElementById('fc_stop_time').value);
				if(dtStart.getHours() === 1){
					dtStart.setHours(2);
				}
				dtStop = new Date(document.getElementById('fc_stop_date_cal').value+ " " + document.getElementById('fc_stop_time').value);
				//dtStop = new Date(document.getElementById('fc_stop_date_cal').value+ " " + document.getElementById('fc_time').value);
				if(dtStop.getHours() === 1){
					dtStop.setHours(3);
				}
				//alert("Start::"+dtStart+"\n Stop::"+dtStop);
			}
		}
		else{
			dtStart = new Date(strStartDate+ " " + document.getElementById('fc_time').value);
			dtStop = new Date(strStopDate+ " " + document.getElementById('fc_stop_time').value);
			if((m_startDateTimeSwitchValue.indexOf("D") > -1) && (m_stopDateTimeSwitchValue.indexOf("S")> -1)){
				
				dtStart = new Date(strStartDate+ " " + document.getElementById('fc_time').value);
				if(dtStart.getHours() === 1){
					dtStart.setHours(2);
				}
				dtStop = new Date(strStopDate+ " " + document.getElementById('fc_stop_time').value);
				if(dtStop.getHours() === 1){
					dtStop.setHours(3);
				}
			}
		}
		
        var dtCurrent = new Date();
		
		if(theR == 1 || theR == 2)
        {
            if (dtStart > dtStop)
            {				
                alert(i18n.START_DATE_PRIOR_STOP_DATE);
                this.document.getElementById('fc_stop_date_cal').focus();
                return (false);
            }
            if (dtStart < dtArrive)
            {
                alert(i18n.START_DATE_AFTER_ARRIVAL + "(" + adt + " " + atm + ")" + i18n.IN_SYSTEM);
                return (false);
            }
            if (dtStop < dtArrive)
            {
                alert(i18n.STOP_DATE_AFTER_ARRIVAL + "(" + adt + " " + atm + ")" + i18n.IN_SYSTEM);
                return (false);
            }
            if (adt != cdt && atm != ctm)
            {
                if (dtStart > dtDischarge)
                {
                    alert(i18n.START_DATE_PRIOR_CHECKOUT + "(" + cdt + " " + ctm + ")" + i18n.IN_SYSTEM);
                    return (false);
                }
                else if (dtStart > dtCurrent)
                {
                    alert(i18n.START_DATE_PRIOR_CURRENT);
                    return (false);
                }

                if (dtStop > dtDischarge)
                {
                    alert(i18n.STOP_DATE_PRIOR_CHECKOUT + "(" + cdt + " " + ctm + ")" + i18n.IN_SYSTEM);
                    return (false);
                }
                else if (dtStop > dtCurrent)
                {
                    alert(i18n.STOP_DATE_PRIOR_CURRENT);
                    return (false);
                }
            }
        }
        else
        {
            if (dtStart > dtStop)
            {
                alert(i18n.START_DATE_PRIOR_STOP_DATE);
                this.document.getElementById('fc_stop_date_cal').focus();
                return (false);
            }
            if (dtStart < dtArrive)
            {
                alert(i18n.START_DATE_AFTER_ARRIVAL + "(" + adt + " " + atm + ")" + i18n.IN_SYSTEM);
                return (false);
            }
            if (adt != cdt && atm != ctm)
            {
                if (dtStart > dtDischarge)
                {
                    alert(i18n.START_DATE_PRIOR_CHECKOUT + "(" + cdt + " " + ctm + ")" + i18n.IN_SYSTEM);
                    return (false);
                }
            }
        }
        return (true);
    }

    /**
    *   This function is used set the value selected from site selection combo-box to II table.
    *   id : index of the selected display value
    **/
    function setSite(id)
    {
        for (var i = 0; i < siteValues.length; i++)
        {
            if (siteValues[i].toUpperCase() === id.toUpperCase())
            {
                return i + 1;
            }
        }
    }
	
    /**
    *   This function is used set the value selected from route selection combo-box to II table.
    *   id : index of the selected display value
    **/
	function setRoutes(id)
    {
        for (var i = 0; i < RouteValues.length; i++)
        {
            if (RouteValues[i].toUpperCase() === id.toUpperCase())
            {
                return i + 1;
            }
        }
    }

    /**
    *   This function is used change  name of ADD and Cancel button when user selects a row in manual mode .
    *   prevRowId : id of selected row.
    **/
    function selectRow(prevRowId)
    {
        if (prevRowId != "")
        {
            saveFlag = 2;
            _g('saveId').innerHTML = i18n.MODIFY;
            _g('cancelId').innerHTML = i18n.DELETE;
            CERN_INFUSIONINJECTION_O1.PopulateValues(prevRowId);
        }
    }

    /**
    *   This function is used to high-light selected row in II table in manual mode.
    *   keyCode : mouse event (left_btn_down). 
    **/
    function highLightRow(keyCode)
    {
        var newVal = "";
        var navigate = false;
        var tempPrevId = prevRowId;

        if ((keyCode == KEY_UP) && ($('#' + prevRowId).prev().attr("id") != undefined))
        {
            navigate = true;
        }
        else if ((keyCode == KEY_DOWN) && ($('#' + prevRowId).next().attr("id") != undefined))
        {
            navigate = true;
        }

        if (navigate == true)
        {
            //change the class name for the current row selected
            newVal = $('#' + prevRowId).attr("class");
            $('#' + prevRowId).attr("class", newVal.replace('ii_highlight', 'row'));

            ////Get the previous or next row and change the class name 
            if (keyCode == KEY_UP)
            {
                prevRowId = $('#' + prevRowId).prev().attr("id");
            }
            else if (keyCode == KEY_DOWN)
            {
                prevRowId = $('#' + prevRowId).next().attr("id");
            }
            newVal = $('#' + prevRowId).attr("class");
            $('#' + prevRowId).attr("class", newVal.replace('row', 'ii_highlight'));

            if (!CERN_INFUSIONINJECTION_O1.GetMARInd())
            {
                selectRow(prevRowId);
            }
        }
    }

    /**
    *	This will be executed only when .js is loaded, 
    *	to initialize all the events,
    **/
    $(document).ready(function ()
    {
        var eventflag = false;
        $(".row_even").live("mouseenter", function ()
        {
            if (!eventflag)
                $(this).find('.fc-info-del').addClass("fc-info-hover");
        });

        $(".row_even").live("mouseleave", function ()
        {
            $(this).find('.fc-info-del').removeClass("fc-info-hover");
        });

        $(".row_odd").live("mouseenter", function ()
        {
            if (!eventflag)
                $(this).find('.fc-info-del').addClass("fc-info-hover");
        });

        $(".row_odd").live("mouseleave", function ()
        {
            $(this).find('.fc-info-del').removeClass("fc-info-hover");
        });

        $(".fc-del").live("mouseenter", function ()
        {
            $(this).find('.fc-info-del').removeClass("fc-info-hover");
            $(this).find('.fc-info-del').addClass("fc-info-del-hover");
            eventflag = true;
        });
        $(".fc-del").live("mouseleave", function ()
        {
            $(this).find('.fc-info-del').removeClass("fc-info-del-hover");
            eventflag = false;
        });
        $(".fc-del").live("click", function ()
        {
            CERN_INFUSIONINJECTION_O1.DeleteOption(this);
        });
        $('#infusion_tbl tbody tr').live('click', function ()
        {
            if (!CERN_INFUSIONINJECTION_O1.GetMARInd())
            {
                var newVal = "";
                if (prevRowId != this.id)
                {
                    if (prevRowId != "")
                    {
                        newVal = $('#' + prevRowId).attr("class");
                        $('#' + prevRowId).attr("class", newVal.replace('ii_highlight', 'row'));
                    }
                    prevRowId = this.id;
                    newVal = this.className;
                    $(this).attr("class", newVal.replace('row', 'ii_highlight'));

                    if (prevRowId != "")
                    {
                        saveFlag = 2;
                        _g('saveId').innerHTML = i18n.MODIFY;
                        _g('cancelId').innerHTML = i18n.DELETE;
                        CERN_INFUSIONINJECTION_O1.PopulateValues(prevRowId);
                    }
                }
                else
                {
                    if (prevRowId != "")
                    {
                        newVal = $('#' + prevRowId).attr("class");
                        $('#' + prevRowId).attr("class", newVal.replace('ii_highlight', 'row'));
                        CERN_INFUSIONINJECTION_O1.CancelAddNew();
                    }
                }
            }
        });
        $('td').live('mouseenter', function ()
        {
            if (this.className === 'fc_type')
            {
				var offset = $(this).offset();
                tableCellID = this.id;
				$("#comboType").css("top", offset.top);
                $("#comboType").css("left", offset.left);
                $("#comboType").css("height", this.clientheight);
                $("#comboType").css('width', this.clientWidth);
				$("#comboType").css('position', 'absolute');	
                $("#comboType").css('visibility', 'visible');
				$(".comboOpt").css('visibility', 'visible');
            }
            else
            {
                $("#comboType").css('visibility', 'hidden');
                $(".comboOpt").css('visibility', 'hidden');
            }
        });

        $('#fc_infusion_area').live("mouseleave", function ()
        {
			$("#comboType").css('visibility', 'hidden');
            $(".comboOpt").css('visibility', 'hidden');
        });
        $('.comboOpt').live('mouseenter', function ()
        {
			$("#comboType").css('visibility', 'visible');
			$(".comboOpt").css('visibility', 'visible');
        });
        $('#comboType').live('mouseenter', function ()
        {			
			$("#comboType").css('visibility', 'visible');
			$(".comboOpt").css('visibility', 'visible');	
        });

        $('.comboOpt').live("change", function ()
        {
            var dispVal = $(".comboOpt option:selected").val();
			
            if (dispVal !== 'ChooseType')
            {
                $("#" + tableCellID).text(dispVal);
                $("#comboType").css('visibility', 'hidden');
                $(".comboOpt").css('visibility', 'hidden');
                $(".comboOpt").val('ChooseType').change();
                tableCellID = 0;
            }
        });

    });
    
    function trim11(str)
    {
        str = str.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i--)
        {
            if (/\S/.test(str.charAt(i)))
            {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    }
    return {
        /**
        *   This function is used to fetch Medication information for the selected encounter.
        *   Medications will be fetched in two modes:
        *   if getMedFromMar is true : all medications will be fetched from MAR (AutomateIVMode).
        *   else : manual mode will be enabled for user to enter medication manually.  
        **/
        GetInjectionInfusionTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            var siteCodes = component.getSiteCodes();
            var site_cds = MP_Util.CreateParamArray(siteCodes, 1);
            var marIndicator = component.getMedfromMAR() === true ? 1 : 0;
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", marIndicator, site_cds, m_CodingMPageFlag, "0");           
			MP_Core.XMLCclRequestWrapper(component, "onc_get_infusion_injection", sendAr, true);
        },

        /**
        *   This function is used to create HTML code for II table
        *   also this function will add controls which are specific 
        *   to manual and automation modes depending on user selection.
        *   components : object pointing to current DOM. 
        *   recordData : reply from onc_get_infusion_injection
        **/
        CreateInfusionPanel: function (component, recordData)
        {

            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var jsHTML = [];
                var seHTML = "";
                var display = "";
                var Disp = "";
                var Value = "";
                var imgCal = m_staticContent + "\\images\\cal.gif";
                var nodDisp = "";
                var nodValue = "";
                var par = 'javascript:CERN_INFUSIONINJECTION_O1.DateTimePicker("fc_date_cal");';
                var par1 = 'javascript:CERN_INFUSIONINJECTION_O1.DateTimePicker("fc_stop_date_cal");';
                var countText = "";
                var savedValue = "";
                compNs = component.getStyles().getNameSpace();
                compId = component.getComponentId();
                var compHeaderId = component.getStyles().getNameSpace() + compId;
                var iiCompSec = _g(compHeaderId);

                var comp = m_xmlDoc.getElementsByTagName("Component");

                if (!component.getMedfromMAR())
                {
                    jsHTML.push("<div id='infusionDiv' >");					
					jsHTML.push("<div class = 'fc-AutoIvbutton'><a  href='javascript:CERN_INFUSIONINJECTION_O1.AutomateIv();'><font size='25'>"+ i18n.AUTOMATE_IV +"</font></a></div>");
                    jsHTML.push("<div id='infusionRightDiv' >");	
					jsHTML.push("<dl><dt><span class='fc_site' style = 'color:#004666; font-size:14px; font-style:Tahoma;'>" + i18n.SITE + "</span></dt><dd></dd>" +
								"<dt><span class='fc_site'></span></dt>" +
								"<dd><select class='site-name' name='siteName' id='combodiv'><option value=''>" + i18n.CHOOSE_SITE + "</option>");
                    for (var j = 0, jl = recordData.SITE.length; j < jl; j++)
                    {
                        jsHTML.push("<option value='" + recordData.SITE[j].CD + "'>" + recordData.SITE[j].DISP + "</option>");
                        siteValues[j] = recordData.SITE[j].DISP;
                        hmap[recordData.SITE[j].CD] = recordData.SITE[j].DISP;						
                    }
									                   
                    for (c = 0; c < comp.length; c++)
                    {
                        if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "INFUSION_INJECTION")
                        {
                            var item = comp[c].getElementsByTagName("Item");
                            for (ch = 0; ch < item.length; ch++)
                            {
                                display = item[ch].getElementsByTagName("Name")[0].childNodes[0].nodeValue;

                                switch (display)
                                {
                                    case "Type":
                                       										
										jsHTML.push("</select></dd></dl><div>"+"<dl class='inf_label'><dt><span class='fc-routes' style = 'color:#004666; font-size:14px; font-style:Tahoma;'>" + i18n.TYPES_ADD + "</span></dt><dd></dd>" +
													"<dt><span class='fc-routes'></span></dt>" +
													"<dd><select class='routes-name' name='routeName' id='combodivAdminRoutes'><option value=''>" + i18n.CHOOSE_ADMIN_ROUTE + "</option>");
										Disp = item[ch].getElementsByTagName("Disp");
										Value = item[ch].getElementsByTagName("ValueId");
                                        for (id = 0; id < Disp.length; id++)
                                        {
											nodDisp = Disp[id].childNodes[0].nodeValue;
                                            nodValue = Value[id].childNodes[0].nodeValue;
                                            jsHTML.push("<option value='" + nodValue+ "'>" + nodDisp + "</option>");
											
											RouteValues[id] =nodDisp;
											RouteDispValues[id] = nodValue;	
											hmapAdminRoutes[id+1] = nodValue;										
										}
										
										jsHTML.push("</select></dd></div>");
                                        break;
										
                                    default:
                                        //do nothing
                                }
                            }
                        }
                    }
					var dateformat =  "javascript:validate_date(this);";
					if(m_localeName == "en_US"){
						 dateformat =  "javascript:validate_date(this);";
					}
					else{
						dateformat =  "javascript:validate_non_us_date(this);";
					}
                    jsHTML.push("<dl class = 'fc-med'><dt><span style = 'color:#004666; font-size:14px; font-style:Tahoma;'>" + i18n.MEDICATION + "</span></dt><dd></dd>" +
								"<dt><input type='text' class='search-box' id='" + compNs + "contentCtrl" + compId + "'/></dt><dd></dd></dl>" +
								
								"<dl class='fc-result'><dl class='fc-start'><dd><span style = 'color:#004666; font-size:14px; font-style:Tahoma;'>" + i18n.INFUSION_START_TIME + 
								"</span></dd></dl></dl>" +						
								"<dl class='fc-result'><dd class='fc-start'><input title='" + i18n.INFUSION_START_TIME + 
								"' id='fc_date_cal' value='**/**/****' onkeydown='"+dateformat+"'/>" +
								"<span class='spR'>&nbsp;</span>" +
								"<span><img src='" + imgCal + "' class='fc_img' id='fc_date_cal_id' onClick = " + par + "></span> <span id='fcOSdate' class='spR'></span>" +
								"<input type='text' maxlength='5' id='fc_time' value='**:**' onkeydown='javascript:validate_time(this);' /></dd></dl>" +
								
								"<dl class='fc-result'><dl class='fc-stop'><dd><span style = 'color:#004666; font-size:14px; font-style:Tahoma;'>" + i18n.INFUSION_STOP_TIME + "</span></dd></dl>" +
								"<dl class='fc-result'><dd class='fc-stop'><input title='" + i18n.INFUSION_STOP_TIME + "' id='fc_stop_date_cal' value='**/**/****' onkeydown='"+dateformat+"' />"+
								"<span class='spR'>&nbsp;</span>" +
								"<span><img src='" + imgCal + "'  class='fc_img' id='fc_stop_date_cal_id' onclick=" + par1 + "></span> <span id='fcStopdate' class='spR'></span>" +
								"<input type='text' maxlength='5' id='fc_stop_time' value='**:**' onkeydown='javascript:validate_time(this);'/></dd></dl>");

                    jsHTML.push("<dl class='fc-button'><dd><button  class='ii_button' id='addButton' onclick='javascript:CERN_INFUSIONINJECTION_O1.Save();'>" +
								"<span id='saveId'>" + i18n.ADD + "</span></button>" +
								"<span>&nbsp;</span>" +
								"<button  class='ii_button' id='cancelButton'><span id='cancelId'>" + i18n.CANCEL + "</span></button>"+"</dd></dl>");
					jsHTML.push("</div></div>");
                }
	
                jsHTML.push("<div id='fc_infusion_area'>" );				
				if (component.getMedfromMAR())
                {	
					var iiRefreshInfo = 'javascript:CERN_INFUSIONINJECTION_O1.Refresh(false,false);';				
					var iiHideSubmittedOrders = 'javascript:CERN_INFUSIONINJECTION_O1.HideSubmittedOrders();';	
					jsHTML.push("<dl class = 'fc-manualbutton'><dt><a href='javascript:CERN_INFUSIONINJECTION_O1.AutomateIv();'>" +
								"<span id='ManualIvId'>" + i18n.MANUAL_IV + "</span></a>" + "<a id = 'hidePipe1'>&nbsp;&nbsp;|&nbsp;&nbsp;</a>"+
								"<a id='hideOrders' href=" + iiHideSubmittedOrders + " tabindex='-1' seq = '1'>" + i18n.HIDE_SUB_ORDRS + "</a>"+"<a id = 'hidePipe2'>&nbsp;&nbsp;|&nbsp;&nbsp;</a>"+
								"<a id='marRefresh' href=" + iiRefreshInfo + " tabindex='-1'>" + i18n.REFRESH + "</a><span>&nbsp;</span>" + 
								"<span id='ServiceDtTxtId' class='serviceDate'>&nbsp;&nbsp;|&nbsp;&nbsp; Service Date "+
								"<select class='service-date' id='ServiceDatesId' onchange= 'javascript:CERN_INFUSIONINJECTION_O1.ServiceDateSelect();'>" +
								"<option value='SelectDate' selected> i18n.SELECT_ALL </option> </select></span> </dt></dl>");
											}
				
				jsHTML.push("<table id ='infusion_tbl_th'><thead><tr> ");
				
                if (component.getMedfromMAR() && m_iiMARDelete)
                {
                    jsHTML.push("<th class='fc_del_opt' style='border-right:none;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>");
                }
				
                jsHTML.push("<th class='fc_number' >" +i18n.MEDICATION + "</th> <th class='fc_medication'>" + i18n.SITE  + "</th>" +
							"<th class='fc_type'>" + i18n.ADMIN_TYPE + "</th><th class='fc_duration'>" + i18n.DURATION + "</th>" );
							
				if (component.getMedfromMAR())
                {	
					jsHTML.push("<th class='fc_start_date'><a href='javascript:CERN_INFUSIONINJECTION_O1.sortByColumn(1);' style='color:#484848'>" + i18n.CHARGES_START + "</a></th>" );
                    jsHTML.push("<th class='fc_stop_date'><a href='javascript:CERN_INFUSIONINJECTION_O1.sortByColumn(2);' style='color:#484848' >" + i18n.CHARGES_STOP + "</a></th>");
					jsHTML.push("<th class='fc_status' style='border-right:1px solid #F6F6F6;'><a href='javascript:CERN_INFUSIONINJECTION_O1.sortByColumn(3);' style='color:#484848'>" + i18n.STATUS_COL+ "</a></th></tr></thead></table>");
				}
				else{
                    jsHTML.push("<th class='fc_start_date'>" + i18n.CHARGES_START + "</th>" );
					jsHTML.push("<th class='fc_stop_date' style='border-right:1px solid #F6F6F6;'>" + i18n.CHARGES_STOP + "</th>");
				}
                jsHTML.push("<div id='fc_infusion_tbody'><table id='infusion_tbl'>");
				
				
                jsHTML.push("</table></div></div>");
				
                seHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(seHTML, component, countText);

                CERN_INFUSIONINJECTION_O1.SetMARInd(component);

                if (component.getMedfromMAR())
                {					
                    CERN_INFUSIONINJECTION_O1.GetInfusionData(recordData,false);
                    $('#fc_infusion_area').css({ 'height': '73%' });
					$('#fc_infusion_area').css({ 'width': '98%' });					
                }
                if (!component.getMedfromMAR())
                {
                    $(document).ready(function ()
                    {
                        $("#infusion_tbl").keydown(function (e)
                        {
                            if (prevRowId != "")
                            {
                                var rowIndex = $('#' + prevRowId).attr('rowIndex');
                                switch (e.keyCode)
                                {
                                    case KEY_DOWN:
                                        highLightRow(KEY_DOWN);
                                        break;
                                    case KEY_UP:
                                        highLightRow(KEY_UP);
                                        break;
                                    case KEY_ENTER:
                                        break;
                                }
                            }
                        });
                    });
                    if ((m_iv_charge_ind == 1) && (m_txtSavedXML.length > 0))
                    {
                        CERN_INFUSIONINJECTION_O1.GetInfusionDataFromXML();
                    }
					
                    if (recordData.ARRIVEDATETIME != "")
                    {
                        var dtm = [];
                        var dateTime = new Date();
                        dateTime.setISO8601(recordData.ARRIVEDATETIME);
                        var adtm = dateTime.format("longDateTime3");
                        dtm = adtm.split(" ");
                        adt = dtm[0];
                        atm = dtm[1];						
                    }
                    if (recordData.DISCHDATETIME != "")
                    {
                        var dctm = [];
                        var dateTime = new Date();
                        dateTime.setISO8601(recordData.DISCHDATETIME);
                        var dcdtm = dateTime.format("longDateTime3");
                        dctm = dcdtm.split(" ");
                        cdt = dctm[0];
                        ctm = dctm[1];						
                    }
                    new AutoSuggestControl(component, CERN_INFUSIONINJECTION_O1.GetMedsList, CERN_INFUSIONINJECTION_O1.HandleSelection, CERN_INFUSIONINJECTION_O1.CreateSuggestionLine);

                    $("#cancelButton").click(function (event)
                    {
                        event.preventDefault();
                        if (saveFlag === 2 && prevRowId != "")
                        {
                            CERN_INFUSIONINJECTION_O1.DeleteRow(prevRowId);
                            CERN_INFUSIONINJECTION_O1.CancelAddNew();
                            prevRowId = "";
                        } else if (saveFlag === 1)
                        {
                            CERN_INFUSIONINJECTION_O1.CancelAddNew();
                        }
                    });
					
					$(".cal-charges").attr('disabled',true);
                }
				
				if(m_bHideSubOrdersPref){
					$('#hidePipe2').hide();
					$('#hideOrders').hide();							
				}
            }
            catch (err)
            {
                if (timerRenderComponent)
                {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            }
            finally
            {
                if (timerRenderComponent)
                    timerRenderComponent.Stop();
            }
			if(m_AutomateIvInd){
				CERN_INFUSIONINJECTION_O1.HideSubmittedOrders();
			}
        },

        /**
        *   function used to clear all calender items data when user selects clear.
        **/
        CancelAddNew: function ()
        {
            var tObj = _g('infusion_tbl');
			var rowCount = tObj.rows.length;		
			if(rowCount > 0){
				$(".cal-charges").attr('disabled',false);
			}
			
			var globalNumber = JsDatePick.getGlobalNumber();
            if (globalNumber)
            {
                var gRef = JsDatePick.getCalInstanceById(globalNumber);
                gRef.closeCalendar();
            }
            CERN_INFUSIONINJECTION_O1.Reset();
        },

        /**
        *   function used to load calender when user selects calender ICON in manual mode.
        *   Calender object is created with following parameter passed.
        **/
        DateTimePicker: function (fieldId)
        {
            var showField = fieldId + "_id";
            var zIndex = 110017

            if (showField === "fc_stop_date_cal_id")
                zIndex = 110015;
			if(m_localeName == "en_US"){				
				new JsDatePick({ useMode: 2, target: fieldId, dateFormat: "%m/%d/%Y", cellColorScheme: "armygreen", imgPath: m_staticContent + "\\images\\", showpopfield: showField, index: zIndex });
            }
			else{
				new JsDatePick({ useMode: 2, target: fieldId, dateFormat: "%d/%m/%Y", cellColorScheme: "armygreen", imgPath: m_staticContent + "\\images\\", showpopfield: showField, index: zIndex });
			}
		},

        /**
        *   This function will be called when user selects delete row in manual/ automation mode.
        **/
        DeleteRow: function (thisId)
        {  
			var str = thisId.split("_");
            m_DeletedRows.push(str[1]);
           
			$("#" + thisId).remove();
            CERN_INFUSIONINJECTION_O1.ResetZibraStripping();
            prevRowId = "";
            
			if(m_statusofOrders[parseInt(str[1])] === m_SubmitString)
            {
                m_deletedOrderIdsFromTable.push(m_Medications_Orderid_Name[parseInt(str[1])]);
                var components = m_InfusionComp.getComponents();
                var component;
                for (var y = 0, yl = components.length; y < yl; y++)
                {
                    if (components[y] instanceof InjectionInfusionComponent)
                    {
                        component = components[y];
                    }					
                }
				StoreDeletedOrdersToTable(m_Medications_Orderid_Name[parseInt(str[1])],component);
				var tObj = _g('infusion_tbl');
				var rowCount = tObj.rows.length;			
				if(m_AutomateIvInd){		
					var iCount = false;
					if(!rowCount){
						$(".cal-charges").attr('disabled',true);
						iCount = false;					
					}
					for (var currowindex = 0; currowindex < rowCount; currowindex++){
						
						//if(tObj.rows[currowindex].cells[8].innerHTML == "Submitted"){;m_SubmitString
						if(tObj.rows[currowindex].cells[8].innerHTML == m_SubmitString){
								iCount = true;
						}
					}
					if(!iCount){
						$("#hideOrders").html(i18n.SHOW_SUB_ORDRS);
						$("#hideOrders").attr('seq','0');
						m_bShowSubmittedOrders = false;
						$('#hideOrders').attr("disabled", true);
					}					
				}
				else{
					if(!rowCount){
						$(".cal-charges").attr('disabled',true);					
					}
				}
			}
            else{
				var tObj = _g('infusion_tbl');
				var rowCount = tObj.rows.length;
				if(!rowCount){
					$(".cal-charges").attr('disabled',true);					
				}
			}
        },

        /**
        *   this function is used to set the automate-iv-mode flag.
        *   This function will be called when user switch from manual to automation or vice-versa.
        *   when switching is done function will call refresh to reload the selected mode.
        **/
		AutomateIv:function()
		{	
            if(m_AutomateIvInd)
			{
				CERN_INFUSIONINJECTION_O1.CallAutoPrefs(1);
			}
			else
			{
				CERN_INFUSIONINJECTION_O1.CallAutoPrefs(0);
			}
			location.reload(true);
			loadSubHeader(1);
		},
		
        /**
        *   This function is called when when user selects ADD or ADDNEW option in Manual mode.
        *   Before adding any selected data to II table, this function validates populated data by calling VlidateSave().
        **/
        Save: function ()
        {
            if (validateSave() == false)
            {
                $(".cal-charges").attr('disabled',true);
				return;
            }
            else
            {				
                if (saveFlag == 1)
                {
                    var zebraStripping = totalRowsCount % 2 === 0 ? "odd" : "even";                    
                    var typeValue;					
                    var startDate = _g('fc_date_cal').value;
                    var stopDate = _g('fc_stop_date_cal').value;
                    var startTime = _g('fc_time').value;
                    var stopTime = _g('fc_stop_time').value;
                    var site = "";
                    for (var key in hmap)
                    {
                        /* do something with key and hmap[key] */
                        site = hmap[_g('combodiv').value];
                    }
					for (var key in hmapAdminRoutes)
                    {
                        /* do something with key and hmap[key] */
                        typeValue = hmapAdminRoutes[_g('combodivAdminRoutes').selectedIndex];
                    }
					
                    if (startDate === "**/**/****")
                        startDate = "";
                    if (stopDate === "**/**/****")
                        stopDate = "";
                    if (startTime === "**:**")
                        startTime = "";
                    if (stopTime === "**:**")
                        stopTime = "";
                    var newRow = $("<tr id = 'row_" + totalRowsCount + "' class='row_" + zebraStripping + "'>" +
									"<td class='fc_number'>" + _g(compNs + "contentCtrl" + compId).value + "</td><td class='fc_medication'>" +site  + "</td>" +
									"<td class='fc_type'>" + typeValue + "</td>" +
									"<td class='fc_duration'>" + CERN_INFUSIONINJECTION_O1.GetDuration() + "</td>" +
									"<td class='fc_start_date' id = 'startDate_"+totalRowsCount+"' startDate ='"+getLocalisedDate(startDate)+" "+startTime+"' startTz = '"+m_startDateTimeSwitchValue+"'>" + startDate + " " + startTime +" "+m_startDateTimeSwitchValue+"</td>" +
									"<td class='fc_stop_date' id = 'stopDate_"+totalRowsCount+"' stopDate = '"+getLocalisedDate(stopDate)+" "+stopTime+"' stopTz = '"+m_stopDateTimeSwitchValue+"'>" + stopDate + " " + stopTime +" "+m_stopDateTimeSwitchValue+"</td>" +
									"<td style='display:none;'>" + _g('combodiv').value + "</td>" +
									"</tr>");
					m_startTzArr[totalRowsCount] = m_startDateTimeSwitchValue;
					m_stopTzArr[totalRowsCount] = m_stopDateTimeSwitchValue;
                    $("#infusion_tbl").append(newRow);
					$(".cal-charges").attr('disabled',false);
                    totalRowsCount = totalRowsCount + 1;					
                    CERN_INFUSIONINJECTION_O1.ResetZibraStripping();
                    CERN_INFUSIONINJECTION_O1.CancelAddNew();
                }
                else if (saveFlag == 2)
                {
                    if (prevRowId != "")
                    {
                        CERN_INFUSIONINJECTION_O1.UpdateRow('infusion_tbl', prevRowId);
                        CERN_INFUSIONINJECTION_O1.CancelAddNew();
                    }
                }
            }
        },

        /**
        *   This function is used to reset the zebra stripping, 
        *   when any rows in II table is deleted or removed 
        **/
        ResetZibraStripping: function ()
        {
            $("#infusion_tbl tbody tr").removeClass("row_even");
            $("#infusion_tbl tbody tr").removeClass("row_odd");
            $("#infusion_tbl tbody tr:even").addClass("row_even");
            $("#infusion_tbl tbody tr:odd").addClass("row_odd");
        },

        /**
        *   This function will be used to get the selected option for Site combo-box.
        **/
        GetSelectedOption: function ()
        {
            var retValue;
            var options = document.getElementsByClassName('combodiv');
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    retValue = options[i].value;
                    return retValue;
                }
            }
        },
		
        /**
        *   This function will be used to get the selected option for Routes/Type combo-box.
        **/
		GetSelectedOptionRoutes: function ()
        {
            var retValue;
            var options = document.getElementsByClassName('combodivAdminRoutes');
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    retValue = options[i].value;
                    return retValue;
                }
            }
        },

        /**
        *   this function is used to fetch the selected option from Site combo-box.
        **/
        SelectOption: function (_value)
        {
            var options = document.getElementsByClassName('combodiv');
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].value == _value)
                {
                    options[i].checked = true;
                }
            }
        },
		
        /**
        *   this function is used clear all the controls in manual mode when user selects delete.
        **/
        Reset: function ()
        {
			if (prevRowId != "")
            {
                newVal = $('#' + prevRowId).attr("class");

                $('#' + prevRowId).attr("class", newVal.replace('ii_highlight', 'row'));
                prevRowId = "";
            }
            _g('saveId').innerHTML = i18n.ADD_NEW;
            _g('cancelId').innerHTML = i18n.CANCEL;

            saveFlag = 1;
            _g('combodiv').selectedIndex = 0;
			_g('combodivAdminRoutes').selectedIndex = 0;
            _g(compNs + "contentCtrl" + compId).value = "";
            _g('fc_date_cal').value = "**/**/****";
            _g('fc_stop_date_cal').value = "**/**/****";
            _g('fc_time').value = "**:**";
            _g('fc_stop_time').value = "**:**";
        },

        /**
        *   this function is used calculate duration for the added medication.
        *   in both manual and automation mode.
        **/
        GetDuration: function ()
        {
			var s1;
			var s2;
			
			var strStartDate = getLocalisedDate(document.getElementById('fc_date_cal').value);
			var strStopDate = getLocalisedDate(document.getElementById('fc_stop_date_cal').value);
			if(m_localeName == "en_US"){
				s1 = new Date(document.getElementById('fc_date_cal').value + " " + document.getElementById('fc_time').value);
				s2 = new Date(document.getElementById('fc_stop_date_cal').value + " " + document.getElementById('fc_stop_time').value);
				
				if((m_startDateTimeSwitchValue.indexOf("D") > -1) && (m_stopDateTimeSwitchValue.indexOf("S")> -1)){
				
					s1 = new Date(document.getElementById('fc_date_cal').value + " " + document.getElementById('fc_time').value);
					if(s1.getHours() === 1 || s1.getHours() === 0){
						s1.setHours(s1.getHours() + 1);
					}
					s2 = new Date(document.getElementById('fc_stop_date_cal').value + " " + document.getElementById('fc_stop_time').value);
					if( s2.getHours() >= 1 && s2.getHours() < 12){
						s2.setHours(s2.getHours() + 2);						
					}
				}
			}
			else{
				s1 = new Date(strStartDate+ " " + document.getElementById('fc_time').value);
				s2 = new Date(strStopDate+ " " + document.getElementById('fc_stop_time').value);
				
				if((m_startDateTimeSwitchValue.indexOf("D") > -1) && (m_stopDateTimeSwitchValue.indexOf("S")> -1)){
				
					s1 = new Date(strStartDate + " " + document.getElementById('fc_time').value);
					if(s1.getHours() === 1 || s1.getHours() == 0){
						s1.setHours(s1.getHours() + 1);
					}
					s2 = new Date(strStopDate + " " + document.getElementById('fc_stop_time').value);
					if(s2.getHours() >= 1 && s2.getHours() < 12){
						s2.setHours(s2.getHours() + 2);
					}
				}
			}	
            var d1 = new Date(s1);
            var d2 = new Date(s2);
            var diff = Math.ceil((d2.getTime() - d1.getTime()) / (mins));			
			if(isNaN(diff)){
				return ("--");
			}
			else{
				/*if(diff < 0){
					diff = diff * (-1);
				}*/
				return (diff);
			}            
        },

        /**
        *   this function is used repopulate the value back from II table to respective controls in manual mode.
        *   this functionality happens when user selects row II table in manual mode. 
        **/
        PopulateValues: function (rowId)
        {
            var tzIndx = rowId.slice(4,6);
			m_startDateTimeSwitchValue = m_startTzArr[tzIndx];
 			m_stopDateTimeSwitchValue = m_stopTzArr[tzIndx];
			
			m_prevStDateTimeSwitchValue	= m_startDateTimeSwitchValue;
			m_prevSpDateTimeSwitchValue	= m_stopDateTimeSwitchValue;
			
			var currowindex = rowId;
            var tObj = document.getElementById('infusion_tbl');
            if (tObj.rows[currowindex].cells[1].innerHTML === "" || tObj.rows[currowindex].cells[1].innerHTML === undefined)
            {
                document.getElementById('combodiv').selectedIndex = 0;
            } else
            {
                document.getElementById('combodiv').selectedIndex = setSite(tObj.rows[currowindex].cells[1].innerHTML);
            }

            switch (tObj.rows[currowindex].cells[2].innerHTML)
            {
                case "HYDRATION":
                    document.getElementById('combodivAdminRoutes').selectedIndex = 1;
                    break;
                case "INFUSION":
                    document.getElementById('combodivAdminRoutes').selectedIndex = 2;
                    break;
                case "INJECTION":
                     document.getElementById('combodivAdminRoutes').selectedIndex = 3;
                    break;
                case "IMSQ":
                    document.getElementById('combodivAdminRoutes').selectedIndex = 4;
                    break;
                case "INTRAARTERIALINJECTION":
                    document.getElementById('combodivAdminRoutes').selectedIndex = 5;
                    break;
				case "CHEMOIVPUMP":
                    document.getElementById('combodivAdminRoutes').selectedIndex = 6;
                    break;
				case "CHEMOARTPUMP":
                    document.getElementById('combodivAdminRoutes').selectedIndex = 7;
                    break;
				default:
                    //do nothing
            }

            var sDataSplit = tObj.rows[currowindex].cells[4].innerHTML;
            if (sDataSplit.length > 0)
            {
                var sData = sDataSplit.split(" ");
                var sdt = sData[0];
                var stm = sData[1];
                document.getElementById('fc_date_cal').value = sdt;
                document.getElementById('fc_time').value = stm;
            } else
            {
                document.getElementById('fc_date_cal').value = "**/**/****";
                document.getElementById('fc_time').value = "**:**";
            }


            var eDataSplit = tObj.rows[currowindex].cells[5].innerHTML;
            if (eDataSplit.length > 0)
            {
                var eData = eDataSplit.split(" ");
                var edt = eData[0];
                var etm = eData[1];
                document.getElementById('fc_stop_date_cal').value = edt;
                document.getElementById('fc_stop_time').value = etm;
            } else
            {
                document.getElementById('fc_stop_date_cal').value = "**/**/****";
                document.getElementById('fc_stop_time').value = "**:**";
            }


            var s = tObj.rows[currowindex].cells[0].innerHTML;
            if (s.length > 0)
            {
                var oMed = document.getElementById(compNs + "contentCtrl" + compId);
                oMed.value = s;
            }
            else
            {
                document.getElementById(compNs + "contentCtrl" + compId).value = '';
            }

        },

        /**
        *   this function is used to select aDministered Routes from combo-box.
        **/
        SelectOption: function (_value)
        {
            var options = document.getElementsByClassName('combodivAdminRoutes');
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].value == _value)
                {
                    options[i].checked = true;
                }
            }
        },

        /**
        *   this function is used to update the row selected II table.
        *   this function will be required when user selects a row for modification.
        *   this function will be invoked by Save().
        **/
        UpdateRow: function (tbody, idx)
        {
            var tObj = document.getElementById(tbody);
            var row = tObj.rows[idx];
            var myType = "n/a";
            var myType = "n/a";
			var startDate = document.getElementById('fc_date_cal').value;
            var stopDate = document.getElementById('fc_stop_date_cal').value;
            var startTime = document.getElementById('fc_time').value;
            var stopTime = document.getElementById('fc_stop_time').value;
			if (startDate === "**/**/****")
                startDate = "";
            if (stopDate === "**/**/****")
                stopDate = "";
            if (startTime === "**:**")
                startTime = "";
            if (stopTime === "**:**")
                stopTime = "";
            var myStart = startDate + " " + startTime;
            var myEnd = stopDate + " " + stopTime ;
            var myMed = document.getElementById(compNs + "contentCtrl" + compId).value;
            var myDur = CERN_INFUSIONINJECTION_O1.GetDuration();
            var mySite = document.getElementById('combodiv').value;
            var site = "";
            for (var key in hmap)
            {
                /* do something with key and hmap[key] */
                site = hmap[mySite];
            }
			
            row.idx = document.getElementById('combodiv').selectedIndex;
			
		    for (var key in hmapAdminRoutes)
            {
                /* do something with key and hmap[key] */
                myType = hmapAdminRoutes[_g('combodivAdminRoutes').selectedIndex];
            }
			//alert(m_startDateTimeSwitchValue +"::"+m_stopDateTimeSwitchValue);
            row.cells[0].innerHTML = myMed;
            row.cells[1].innerHTML = site;
            row.cells[2].innerHTML = myType;
            row.cells[3].innerHTML = myDur;
            row.cells[4].innerHTML = myStart +" "+ m_startDateTimeSwitchValue;
            row.cells[5].innerHTML = myEnd +" "+ m_stopDateTimeSwitchValue;
            row.cells[6].innerHTML = mySite;
        },

        /**
        *   this function is used display medication list in search box.
        *   this function invoked when onc_search_ii_meds is called with user entered text.
        **/
        GetMedsList: function (callback, textBox, component)
        {
            // Initialize the request object
            var xhr = new XMLCclRequest();
            var returnData;
            var searchPhrase = textBox.value;
            var limit = 10;
            xhr.onreadystatechange = function ()
            {
                if (xhr.readyState == 4 && xhr.status == 200)
                {
                    var msg = xhr.responseText;
                    var jsonMsg = "";
                    if (msg)
                    {
                        jsonMsg = JSON.parse(msg);
                    }

                    if (jsonMsg)
                    {
                        if (textBox.value != "")
                        {
                            returnData = jsonMsg.RECORD_DATA.MEDS;
                            callback.autosuggest(returnData);
                        }
                    }
                }
            }
            var sPara = "";
            var sPrgNam = "";
           
			sPrgNam = "onc_search_ii_meds";
            sPara = "^MINE^, ^" + searchPhrase + "*^," + limit;

            xhr.open('GET', sPrgNam);
            xhr.send(sPara);
        },

        /**
        *   this function is used handle user selection in search medication box.
        **/
        HandleSelection: function (suggestionObj, textBox, component)
        {
            textBox.value = suggestionObj.DRUGNAME;
        },

        /**
        *   this function will create suggestions depending on user entered text.
        **/
        CreateSuggestionLine: function (suggestionObj, searchVal)
        {
            return CERN_INFUSIONINJECTION_O1.HighlightValue(suggestionObj.DRUGNAME, searchVal);
        },

        /**
        *   Highlight specific portions of a string for display purposes
        *   inString : The string to be highlighted
        *   term : The string to highlight
        *   outString : The string highlighted using HTML tags
        */
        HighlightValue: function (inString, term)
        {
            return "<strong class='highlight'>" + inString.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong class='highlight'>") + "</strong>";
        },

        /**
        *   this function is used to refresh only II table content in automation mode.
        **/
        Refresh: function (isShowSubmittedOrders,indFlag)
        {
			m_Medications_Orderid_Name.length = 0;
            m_existingDeletedOrders.length = 0;
            m_deletedOrderIdsFromTable.length = 0;
			m_DeletedRows.length = 0;
            var components = m_InfusionComp.getComponents();
            var component;
            for (var y = 0, yl = components.length; y < yl; y++)
            {
                if (components[y] instanceof InjectionInfusionComponent)
                {
                    component = components[y];
                }
            }
            var table = _g('infusion_tbl');
            var rowCount = table.rows.length;
            for (var i = rowCount - 1; i > -1; i--)
            {
                table.deleteRow(i);
                totalRowsCount = totalRowsCount - 1;			
            }

            var sendAr = [];
            var siteCodes = component.getSiteCodes();
            var site_cds = MP_Util.CreateParamArray(siteCodes, 1);
			
			var timerMPage = MP_Util.CreateTimer("USR:MPG.ONC_INJECTION_INFUSION.01 - load component");
    			
            var marIndicator = component.getMedfromMAR() === true ? 1 : 0;
            sendAr.push("^MINE^", component.criterion.person_id + ".0", component.criterion.encntr_id + ".0", marIndicator, site_cds, m_CodingMPageFlag);
            var req = new MP_Core.ScriptRequest(component, "");           
			req.setProgramName("onc_get_infusion_injection");
						
            req.setParameters(sendAr);
            req.setAsync(true);
            MP_Core.XMLCCLRequestCallBack(component, req, function (reply)
            {
                var check1 = reply.getError();
                var recordData = reply.getResponse();
                if (check1 === "")
                {
                    if (timerMPage){
						timerMPage.Stop();
					}
					CERN_INFUSIONINJECTION_O1.GetInfusionData(recordData,isShowSubmittedOrders);
					if(!indFlag){
						$("#hideOrders").html(i18n.SHOW_SUB_ORDRS);
						$("#hideOrders").attr('seq','0');
						m_bShowSubmittedOrders = false;
					}	
					var tObj = _g('infusion_tbl');
					var rowCount = tObj.rows.length;					
					if(!rowCount){
						$(".cal-charges").attr('disabled',true);
					}
					else{
						$(".cal-charges").attr('disabled',false);
					}
                }				
            });
			
        },
		
		ServiceDateSelect: function ()
		{
			//Onchange event hits twice on selection, the below if condition avoids the 2nd hit
			if(m_SelectedServiceDate == $('#ServiceDatesId option:selected').val())	
					return;
				
			m_SelectedServiceDate =  $('#ServiceDatesId option:selected').val();
			//set the  #hideorders hyperlink to forcefully show both submitted and non-submitted orders
			// only if the hidesubmittedorders preferenec is set to '0'
			if(!m_bHideSubOrdersPref)
			{
				if(parseInt($("#hideOrders").attr('seq')) == 0){
							$("#hideOrders").html(i18n.HIDE_SUB_ORDRS);
							$("#hideOrders").attr('seq','1');
							m_bShowSubmittedOrders = true;
				}
			}

			// refresh the table
			CERN_INFUSIONINJECTION_O1.Refresh(m_bShowSubmittedOrders,true);
		},
		
		
		HideSubmittedOrders: function ()
        {	
			if(!m_SubmittedOrders.length){
				$("#hideOrders").html(i18n.SHOW_SUB_ORDRS);
				$("#hideOrders").attr('seq','0');
				m_bShowSubmittedOrders = false;
				$('#hideOrders').attr("disabled", true);	
			}
			else{	
				if($('#hideOrders').attr("disabled") == "disabled"){
					$("#hideOrders").html(i18n.SHOW_SUB_ORDRS);
					$("#hideOrders").attr('seq','0');
					m_bShowSubmittedOrders = false;
				}
				else{
					if(parseInt($("#hideOrders").attr('seq')) == 1){
						$("#hideOrders").html(i18n.SHOW_SUB_ORDRS);
						$("#hideOrders").attr('seq','0');
						m_bShowSubmittedOrders = false;
						CERN_INFUSIONINJECTION_O1.Refresh(m_bShowSubmittedOrders,true);
						var tObj = _g('infusion_tbl');
						var rowCount = tObj.rows.length;		
						if(!rowCount)
							$(".cal-charges").attr('disabled',true);
						else
							$(".cal-charges").attr('disabled',false);
					}
					else{
						$("#hideOrders").html(i18n.HIDE_SUB_ORDRS);
						$("#hideOrders").attr('seq','1');
						m_bShowSubmittedOrders = true;
						CERN_INFUSIONINJECTION_O1.Refresh(m_bShowSubmittedOrders,true);
						$(".cal-charges").attr('disabled',false);	
					}
				}
			}			
		},
        /**
        *   This function is used to set automate-IV-Mode flag.
        *   this function invokes onc_ii_save_autoiv_status to save flag in name_value_pref table.
        **/
		CallAutoPrefs: function (value)
        {
			var components = m_InfusionComp.getComponents();
            var component;
			for (var y = 0, yl = components.length; y < yl; y++)
            {
                if (components[y] instanceof InjectionInfusionComponent)
                {
                    component = components[y];
                }
            }
			var sendAr = [];
			sendAr.push("^MINE^",m_PersonId+ ".0", m_EncounterId+ ".0",value+".00");
			
			var req = new MP_Core.ScriptRequest(component, "");						
			req.setProgramName("onc_ii_save_autoiv_status");
			req.setParameters(sendAr);									
			req.setAsync(false);
			MP_Core.XMLCCLRequestCallBack(component, req, function (reply)
			{
				var check1 = reply.getError();
				var recordData = reply.getResponse();
				if (check1 === "")
				{			
				}
			});
		},

        /**
        *   This function is used to get automate-IV-Mode flag.
        *   this function invokes onc_get_iv_indicator to get flag value from name_value_pref table.
        **/
		CallReadAutoPrefs: function ()
        {
			var components = m_InfusionComp.getComponents();
            var component;
			for (var y = 0, yl = components.length; y < yl; y++)
            {
                if (components[y] instanceof InjectionInfusionComponent)
                {
                    component = components[y];
                }
            }
			var sendAr = [];
				sendAr.push("^MINE^",m_PersonId+ ".0", m_EncounterId+ ".0");
			
			var req = new MP_Core.ScriptRequest(component, "");						
			req.setProgramName("onc_get_iv_indicator");
			req.setParameters(sendAr);									
			req.setAsync(false);
			MP_Core.XMLCCLRequestCallBack(component, req, function (reply)
			{
				var check1 = reply.getError();
				var recordData = reply.getResponse();
				if (check1 === "")
				{
					m_AutomateIvInd = 1- recordData.AUTOMATE_IV;
					component.setMedfromMAR(m_AutomateIvInd);							
				}
			});
		},

        /**
        *   this function is used to construct II table from recordData got from onc_infusion_injection.prg
        **/
        GetInfusionData: function (jsonRecordData,isShowSubmittedOrder)
        {           
            var recordData = jsonRecordData;
            if(jsonRecordData.MEDICATIONS.length != 0)
            {
                recordData.length = 0;
				if( jsonRecordData.SORT_ORDER == "1" ||
					jsonRecordData.SORT_ORDER == "2" ||
					jsonRecordData.SORT_ORDER == "3")	
				{
					m_sortOrder = jsonRecordData.SORT_ORDER;
				}								
                recordData = formatRecordStructure(jsonRecordData,m_sortOrder);
            }
			m_isOneOrderSubmitted = false;			
            m_statusofOrders.length = 0;
			var orderIdsSubmited = [];
            orderIdsSubmited = getSubmittedOrders(recordData);
            m_numberofMedications = jsonRecordData.MEDICATIONS.length;
            var deletedOrder = [];
			
			for(var t=0;t< recordData.DELETED_EVENTS.length;t++)
            {               
               deletedOrder.push(recordData.DELETED_EVENTS[t].EVENT_ID);
			   m_deletedOrder.push(recordData.DELETED_EVENTS[t].EVENT_ID);
            }
            
            m_existingDeletedOrders = deletedOrder;
			m_submitedorderscount = 0.00;
			m_submitedorderscount = orderIdsSubmited.length;
			m_Medications_Orderid_Name.length = 0;
			m_existingSubmitedorder.length = 0;
			var dateTime = new Date();
            var startDate = "";
            var stopDate = "";
			var startDateLong = "";
            var stopDateLong = "";
            var deleteOpt = "";
            var diff = "";
			var oneSubOrder = 0;
			
			var serviceDate = "";
            if (CERN_INFUSIONINJECTION_O1.GetMARInd() && m_iiMARModifyType)
            {
                PopulateTypeDialog();
            }
			var nuberOfrowsAdded = 0;
			var nuberOfrowsDeleted = 0;
			
			//clean the m_dServiceDates array
			m_dServiceDates = [];
			
            for (var j = 0, jl = recordData.MEDICATIONS.length; j < jl; j++)
            {
				var submited = m_NotSubmitString;//"Not Submitted";
				var orderStatus = "NO";
				var ordrColStatus = m_NotSubmitString;//"Not Submitted";
				var orderEventId = 0.00;
				var zebraStripping = j % 2 === 0 ? "odd" : "even";
				var orderStatusForCol = m_NotSubmitString;//"Not Submitted";

				startDate = "";
                stopDate = "";
				startDateLong = "";
                stopDateLong = "";
				startDateCal = "";
                stopDateCal = "";
                diff = "";
                deleteOpt = "";				
                var index = searcOrderID(orderIdsSubmited,recordData.MEDICATIONS[j].EVENT_ID); 				
                if(index != -1){
					submited = m_SubmitString;
                    orderEventId = orderIdsSubmited[index];
                    orderStatus = "YES";
					ordrColStatus = m_SubmitString;
                }
				m_existingSubmitedorder.push(orderEventId);

				var formatString = getLocaleInfo(m_localeName);
				window.MPAGE_LOCALE = new mp_formatter.Locale(formatString);
				var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				
                if (recordData.MEDICATIONS[j].STARTDATETIME !== "")
                {
                    dateTime.setISO8601(recordData.MEDICATIONS[j].STARTDATETIME);
                    startDateLong = dateTime.format("longDateTime3");
					startDate = df.formatISO8601(recordData.MEDICATIONS[j].STARTDATETIME, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
                    serviceDate = df.formatISO8601(recordData.MEDICATIONS[j].STARTDATETIME, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
                }
				
				// check if any sesrvice date selected, filtering the record for the selected service date 
				if(m_SelectedServiceDate !== i18n.SELECT_ALL &&
						serviceDate !== m_SelectedServiceDate)
				{
						//checkling for duplicates before pushing it to array
						if($.inArray(serviceDate, m_dServiceDates, 0) == -1){
							// filtering the submitted orders, when the hidesubmittedorders preference is set to '1'
							if(!(m_bHideSubOrdersPref && (orderStatus === 'YES'))){
								m_dServiceDates.push(serviceDate);
							}
						}
							continue;
				}
						
				
                if (recordData.MEDICATIONS[j].STOPDATETIME !== "")
                {
                    dateTime.setISO8601(recordData.MEDICATIONS[j].STOPDATETIME);
                    stopDateLong = dateTime.format("longDateTime3");					
					stopDate = df.formatISO8601(recordData.MEDICATIONS[j].STOPDATETIME, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR); 
                }
                if (stopDate !== "" && startDate !== "")
                {
                    diff = Math.ceil(((new Date(stopDate).getTime()) - (new Date(startDate).getTime())) / (mins));
                }   
				if (startDate !== "")
                {
					if(m_utcOnOffInd){
						startDate = startDate+" "+recordData.MEDICATIONS[j].STARTTZNAME;
					}				
                }  
				if (stopDate !== "")
                {
					if(m_utcOnOffInd){
						stopDate = stopDate+" "+recordData.MEDICATIONS[j].STOPTZNAME;
					}					
                }   				
               
                if (CERN_INFUSIONINJECTION_O1.GetMARInd() && m_iiMARDelete)
                {
                    deleteOpt = "<td class='fc-del'><SPAN class='fc-info-del'>&nbsp;&nbsp;&nbsp;</SPAN></td>";
                }
				m_Medications_Orderid_Name.push(recordData.MEDICATIONS[j].EVENT_ID);
				m_SubmittedOrdersStatus[recordData.MEDICATIONS[j].EVENT_ID] = ordrColStatus;
				m_SubmittedOrdersIds[recordData.MEDICATIONS[j].EVENT_ID] = recordData.MEDICATIONS[j].ORDER_ID;
				m_ServiceDateTime[recordData.MEDICATIONS[j].EVENT_ID] = recordData.MEDICATIONS[j].STARTDATETIME;
				m_OrderAdminRoutes[recordData.MEDICATIONS[j].EVENT_ID] = recordData.MEDICATIONS[j].TYPE;
                m_statusofOrders.push(ordrColStatus);
				//checking for duplicates before pushing it to array
				if($.inArray(serviceDate, m_dServiceDates, 0) == -1){
					// filtering the submitted orders, when the hidesubmittedorders preference is set to '1'
					if(!(m_bHideSubOrdersPref && (orderStatus === 'YES'))){
						m_dServiceDates.push(serviceDate);
					}
				}					
				
				if(orderStatus === 'YES'){
					orderStatusForCol = m_SubmitString;
					m_isOneOrderSubmitted = true;
				}				
				var newRow = $("<tr id = 'row_" +j+"' class='row_" + zebraStripping + " 'status='"+ordrColStatus+"' rownum = '"+j+"'>" + deleteOpt +
							   "<td class='fc_number'  id= 'name" + j + "'  name='"+recordData.MEDICATIONS[j].NAME+"'>" + recordData.MEDICATIONS[j].NAME  + "</td>"+
                               "<td class='fc_medication' id= 'site" + j + "'  site='"+recordData.MEDICATIONS[j].SITE+"'>" +recordData.MEDICATIONS[j].SITE + "</td>" +
							   "<td class='fc_type' id= 'comboType" + j + "'  type='"+recordData.MEDICATIONS[j].TYPE+"' sts='"+orderStatus+"'>" + recordData.MEDICATIONS[j].TYPE + "</td>" +
							   "<td class='fc_duration' id= 'diff" + j + "'  diff='"+diff+"'>" + diff + "</td>" +
							   "<td class='fc_start_date' id= 'startDate" + j + "'  startDate='"+startDateLong+"'>" + startDate+"</td>" +
							   "<td class='fc_stop_date' id= 'stopDate" + j + "'  stopDate='"+stopDateLong+"'>" + stopDate + "</td>"+
                               "<td style='display:none;'>" + 0 + "</td>"+
							   "<td class='fc_status' id= 'ordStatus" + j + "' sts='"+ordrColStatus+"'>"+orderStatusForCol+"</td>"+
							   "<td style='display:none;'>" + 0 + "</td></tr>");
              
				if(!isShowSubmittedOrder && orderStatus === 'NO'){					
					$("#infusion_tbl").append(newRow);
				}
				else if(isShowSubmittedOrder){					
					$("#infusion_tbl").append(newRow);
					
				}
                totalRowsCount = totalRowsCount + 1;
				nuberOfrowsAdded++;				
            } 
			
			// populating service Date drop down
			var serviceDateoptions = '';
			for (var i=0 ;i < m_dServiceDates.length; i++)
			{
				if(m_dServiceDates[i]){
					if (m_dServiceDates[i] == m_SelectedServiceDate)
						serviceDateoptions += '<option value="'+ m_dServiceDates[i] + '" selected>' + m_dServiceDates[i] + '</option>';
					else
						serviceDateoptions += '<option value="'+ m_dServiceDates[i] + '">' + m_dServiceDates[i] + '</option>';
				}
			}
			if (i18n.SELECT_ALL == m_SelectedServiceDate)
				serviceDateoptions += '<option value="'+ i18n.SELECT_ALL + '" selected>' + i18n.SELECT_ALL + '</option>';
			else 
				serviceDateoptions += '<option value="'+ i18n.SELECT_ALL + '">' + i18n.SELECT_ALL + '</option>';
			
			$('#ServiceDatesId').empty();
			$('#ServiceDatesId').append(serviceDateoptions);
			$('#ServiceDatesId').addClass("service-date");
			
			//Setting the Service Date drop down disabled when there are no data available
			if(m_dServiceDates.length == 0)
			{
				$('#ServiceDatesId').prop('disabled', 'disabled')
			}
			m_SubmittedOrders = [];
            for(var r =0;r<m_Medications_Orderid_Name.length;r++){                
                var index = searcOrderID(m_existingDeletedOrders,m_Medications_Orderid_Name[r]);
                if(index != -1){                     
					$('#row_'+r).remove();                    
					CERN_INFUSIONINJECTION_O1.ResetZibraStripping();
					nuberOfrowsDeleted++;
                }
				else{					
					if(m_SubmittedOrdersStatus[m_Medications_Orderid_Name[r]] == m_SubmitString){
						m_SubmittedOrders.push(m_Medications_Orderid_Name[r]);
					}					
				}
            }
			var tObjAuto = _g('infusion_tbl');
			var rowCountAuto = tObjAuto.rows.length;
			if(m_AutomateIvInd){				
				if(m_SubmittedOrders.length){
					m_isOneOrderSubmitted = true;
					//Enabling the #hideorders hyperlink, if the submit order count is > 0 
					if($('#hideOrders').attr("disabled") == "disabled"){
						$('#hideOrders').attr("disabled", false);
					}
				}
				else{
					m_isOneOrderSubmitted = false;
					// setting back the hyperlink set from service filter call
					// disable #hideorders hyperlink if the submit orders = 0 for no service date selection 
					$("#hideOrders").html(i18n.SHOW_SUB_ORDRS);
					$("#hideOrders").attr('seq','0');
					m_bShowSubmittedOrders = false;
					if(!(m_SelectedServiceDate == i18n.SELECT_DATE)){
						$('#hideOrders').attr("disabled", true);
					}					
				}
				if(!rowCountAuto){
					$(".cal-charges").attr('disabled',true);
				}
			}
        },

        sortByColumn:function (sortBy)
        {
			switch(sortBy){
				case 1: 
					m_sortOrder = "1";
					m_sortFlexer1 =~m_sortFlexer1;
					break;
				case 2: 
					m_sortOrder = "2";
					m_sortFlexer2 =~m_sortFlexer2;
					break;
				case 3: 
					m_sortOrder = "3";
					m_sortFlexer3 =~m_sortFlexer3;
					break;
				default:
					//D.N
			}
            var components = m_InfusionComp.getComponents();
            var component;
            for (var y = 0, yl = components.length; y < yl; y++)
            {
                if (components[y] instanceof InjectionInfusionComponent)
                {
                    component = components[y];
                }
            }
            var sendAr = [];
            sendAr.push("^MINE^",m_PersonId+ ".0", m_EncounterId+ ".0",sortBy+".00");
            
            var req = new MP_Core.ScriptRequest(component, "");                     
            req.setProgramName("onc_save_sort_order");
            req.setParameters(sendAr);                                  
            req.setAsync(false);
            MP_Core.XMLCCLRequestCallBack(component, req, function (reply)
            {
                var check = reply.getError();
                var recordData = reply.getResponse();
                if (check === ""){ //N.D
				}
            });
            javascript:CERN_INFUSIONINJECTION_O1.Refresh(m_bShowSubmittedOrders,true);  
        },
        
		/**
        *   this function is used to set MAR type indicator.
        **/
        SetMARInd: function (component)
        {
            marInd = component.getMedfromMAR();
        },

        /**
        *   this function is used to get MAR type indicator.
        **/
        GetMARInd: function ()
        {
            return marInd;
        },

        /**
        *   this function is used to construct II table from stored XML file.
        **/
        GetInfusionDataFromXML: function ()
        {
			m_Medications_Orderid_Name.length = 0;
			
            var injectionData = m_savedXML.getElementsByTagName('IV');
            if (injectionData.length > 0)
            {
                for (i = 0; i < injectionData.length; i++)
                {
                    var disp = injectionData[i];
                    var startDtm = "";
                    var stopDtm = "";
                    var d1, d2, diff = 0;
                    if (disp.getElementsByTagName('StartDateTime')[0].firstChild)
                    {
                        startDtm = disp.getElementsByTagName('StartDateTime')[0].childNodes[0].nodeValue;
                        d1 = new Date(startDtm);
                    }
                    if (disp.getElementsByTagName('StopDateTime')[0].firstChild)
                    {
                        stopDtm = disp.getElementsByTagName('StopDateTime')[0].childNodes[0].nodeValue;
                        d2 = new Date(stopDtm);
                    }
                    if (startDtm && stopDtm)
                        diff = Math.ceil((d2.getTime() - d1.getTime()) / (mins));

                    var zebraStripping = i % 2 === 0 ? "odd" : "even";
                    var newRow = $("<tr id = 'row_" + i + "' class='row_" + zebraStripping + "'>" +
										"<td class='fc_number'>" + disp.getElementsByTagName('Medication')[0].getElementsByTagName('Name')[0].childNodes[0].nodeValue + "</td><td class='fc_medication'>" +disp.getElementsByTagName('IVSite')[0].childNodes[0].nodeValue  + "</td>" +
										  "<td class='fc_type' id= 'comboType" + i + "'>" + disp.getElementsByTagName('IVType')[0].childNodes[0].nodeValue + "</td>" +
										  "<td class='fc_duration' id= 'diff" + i + "'>" + diff + "</td>" +
										  "<td class='fc_start_date' id= 'startDate" + i + "'>" + startDtm + "</td>" +
										  "<td class='fc_stop_date' id= 'stopDate" + i + "'>" + stopDtm + "</td>" +
										  "<td class='fc_status' colstatus = '"+m_SubmitString+"'>"+m_SubmitString+"</td>" +
										  "<td style='display:none;'>" + 0 + "</td>" +
										"</tr>");
                    $("#infusion_tbl").append(newRow);
                    totalRowsCount = totalRowsCount + 1;					
                }
            }
        },

        /**
        *   this function is used delete a row from II table.
        **/
        DeleteOption: function (delObj)
        {
            var delID = $(delObj).parent().closest('tr').attr('id');
            CERN_INFUSIONINJECTION_O1.DeleteRow(delID);
        }
    };
} ();
/**
* Project: jqwizard.js
* Version 1.0.0
*/
(function ($)
{
    $.fn.jQWizard = function (type)
    {
        function init(item)
        {
            var property = { current: 1, totalSteps: $('.jqw-nav li', item).length }

            $('.jqw-nav li', item).first().addClass('jqw-current');
            $('.jqw-nav li', item).last().addClass('jqw-navLast');
            $('.jqw-next').removeClass('cal-charges');
            $('.jqw-previous', item).hide();
            $('.submitCharges', item).hide();

            if (evaluationManagement == false || infusionInjection == false)
            {
                $('.jqw-next', item).text(i18n.CALCULATE_CHARGES);
                $('.jqw-next', item).addClass('cal-charges');
            }
            else
            {
                $('.jqw-next', item).text(i18n.NEXT);
            }

            $('.jqw-next', item).click(function ()
            {
                if ($('.jqw-next').hasClass('cal-charges'))
                {
					ValidateInfusiontabledata();
					if(m_redrawInfusionPanel == true)
					{
						m_redrawInfusionPanel = false;
						return false;
					}
                    //Delay moving to next page until CalculateCharges completes
                    document.body.style.cursor = "wait";
                    $("div.largeLoadingSpan").show();
                    $('.jqw-next', item).attr("disabled", true);
					
                    setTimeout(function ()
                    {						
                        CalculateCharges();						
                        document.body.style.cursor = "auto";
                        $("div.largeLoadingSpan").hide();
                        $('.jqw-next', item).attr("disabled", false);

                        if ((property.current < property.totalSteps - 1))
                        {
                            loadnext(property.current, property.current + 1, item, property);
                            return false;
                        }
                        else if (property.current == property.totalSteps - 1)
                        {
                            $('.jqw-next', item).hide();
                            $('.submitCharges', item).hide();
                            $('.jqw-previous', item).show();
                            loadnext(property.current, property.current + 1, item, property);
                        }
						else if (property.current == property.totalSteps)
                        {
                            $('.jqw-next', item).hide();
                            $('.jqw-previous', item).show();
                        }
                    });				
                }
                else
                {
                    if ((property.current < property.totalSteps - 1))
                    {
                        loadnext(property.current, property.current + 1, item, property);
                        return false;
                    }
                    else if (property.current == property.totalSteps - 1)
                    {
                        $('.jqw-next', item).hide();
                        $('.submitCharges', item).hide();
                        $('.jqw-previous', item).show();
                        loadnext(property.current, property.current + 1, item, property);   
											
                    }
                    else if (property.current == property.totalSteps)
                    {
                        $('.jqw-next', item).hide();
                        $('.jqw-previous', item).show();
                    }
                }
            });

            $('.jqw-previous', item).click(function ()
            {
                if (property.current > 1) loadnext(property.current, property.current - 1, item, property);
				if(m_AutomateIvInd){
					location.reload(true);
				}					
                return false;
            });
        }

        function loadnext(divout, divin, item, property)
        {
            var divid = "";
            loadSubHeader(divin);
            property.current = divin;
            $('.jqw-nav li', item).removeClass('jqw-current jqw-done jqw-lastDone');
            $('.jqw-next').removeClass('cal-charges');

            $('.jqw-nav li', item).each(function (index)
            {
                var currentIndex = index + 1;
                if (divin > divout)
                {
                    if (currentIndex < divout) $(this).addClass('jqw-done');
                    if (currentIndex == divout) $(this).addClass('jqw-lastDone');
                }
                if (divin < divout)
                {
                    if (currentIndex == divout) $(this).addClass('jqw-lastDone');
                }
                if (currentIndex == divin) $(this).addClass('jqw-current');
            });

            if (m_CodingMPageFlag == 1)
            {
                var codingPage = i18n.FACILITY_CODING;
            }
            else
            {
                var codingPage = i18n.URGENT_CARE_CODING;
            }
            if (divin > divout)
            {
                $('.jqw-current span', item).each(function (index)
                {
                    $(this).attr("class", this.className.replace('ind', 'ind-selected'));
                    $(this).attr("class", this.className.replace('ind-selected-sr-right', 'ind-fsr-right'));
                    $(this).attr("class", this.className.replace('ind-selected-sre-right', 'ind-f-right'));
                });
                $('.jqw-lastDone span', item).each(function (index)
                {
                    $(this).attr("class", this.className.replace('ind-fsr', 'ind-fr'));
                });
            }
            if (divin < divout)
            {
                $('.jqw-lastDone span', item).each(function (index)
                {
                    $(this).attr("class", this.className.replace('ind-selected', 'ind'));
                    $(this).attr("class", this.className.replace('ind-f-right', 'ind-sre-right'));
                    $(this).attr("class", this.className.replace('ind-fsr-right', 'ind-sr-right'));
                });
                $('.jqw-current span', item).each(function (index)
                {
                    $(this).attr("class", this.className.replace('ind-fr', 'ind-fsr'));
                });
            }

            divid = $('.jqw-panel-' + divin).attr('id');
            switch (divid)
            {               
                case "panel-inf":  /*Infusion and Injection */
                    $('.jqw-next', item).text(i18n.CALCULATE_CHARGES);
                    $('.jqw-next', item).addClass('cal-charges');
                    $('.jqw-next', item).show();
                    $('.submitCharges', item).hide();
                    $('.jqw-previous', item).hide();
					
                    break;
                case "panel-charges":  /* Finalize charges*/
                    if (m_iiSubmitCharges)
                        $('.submitCharges', item).show();
                    if (m_submitFlag)
                    {
                        $('#submitCharges').unbind("click").click(function ()
                        {
                            $('#submitCharges').attr("disabled", true);
                            SubmitCharges();
                        });
                    }
					$('.jqw-next', item).hide();
                    $('.jqw-previous', item).show();
					
                    break;
                
                default:
                    //do nothing
            }
            $('.jqw-previous', item).prop('disabled', divin == 1);
            $(".jqw-panel-" + divout, item).hide();
            $(".jqw-panel-" + divin, item).fadeIn("fast");
        }

        return this.each(function ()
        {
            init(this);
        });

    };
})(jQuery);

/**
*   This function is used to submit charges.
*   Before submitting charges this function performs certain set of operation:
*   1. Converting all available CPT codes to XML file format and saves in long-text table.
*   2. writes all CPT codes along with orderIds into XML file and saves it in Long-text file
*      for identification of submitted orders.
**/
function SubmitCharges()
{ 	
	m_DeletedRows.sort();
    var m_SubmitedMedications = [];
	var arrEventStatus = [];
	var arrOrderIds = [];
	var arrServiceDtTm = []; 
	var arrAdminRoutes = [];	
	for(var i = 0; i<m_Medications_Orderid_Name.length;i++)
	{	
		var NonDeletedItem = false;		
        for(var j = 0;j<m_DeletedRows.length;j++)
        {
            if(i == m_DeletedRows[j])
            {
                NonDeletedItem = true;
            }
        }
		if(NonDeletedItem == false){
			var index = searcOrderID(m_deletedOrder,m_Medications_Orderid_Name[i]); 				
            if(index == -1){
				m_SubmitedMedications.push(m_Medications_Orderid_Name[i]);
				arrEventStatus.push('"'+m_SubmittedOrdersStatus[m_Medications_Orderid_Name[i]]+'"');
				arrOrderIds.push(m_SubmittedOrdersIds[m_Medications_Orderid_Name[i]]);
				arrServiceDtTm.push('"'+m_ServiceDateTime[m_Medications_Orderid_Name[i]]+'"');
				arrAdminRoutes.push('"'+m_OrderAdminRoutes[m_Medications_Orderid_Name[i]]+'"');
			}			
		}
	}
	
	var CtpUnits = new Array();
	var CtpStartDates = new Array();
	var CtpServiceDates = new Array();
	CtpStartDates.push(0.00);
	var proc = m_xmlDispCharges.getElementsByTagName("Procedure");
	for (var i = 0, il = proc.length; i < il; i++)
    {
        if (proc[i].getElementsByTagName("Source")[0].childNodes[0].nodeValue === "IV")
        {
             CtpUnits.push(proc[i].getElementsByTagName("Units")[0].childNodes[0].nodeValue);
			
			 var str = proc[i].getElementsByTagName("StartDateTime")[0].childNodes[0].nodeValue; 
			
			 var res1 = str.slice(0,5);
			 var res2 = str.slice(6,10);
			 var res3 = str.slice(10,16);
			 var res = '"'+res2+"/"+res1+res3+'"';
			 CtpStartDates.push(res);
			 CtpServiceDates.push(res);
		}				 
    }
		
	var cptValues = new Array();
	cptValues.push(0.00)
	var cptCodeValues = new Array();
	var cptModifierValues = new Array();
	var ModifierCnt = new Array();
    var components = m_ChargesComp.getComponents();
    var emModFlag = false;
    var iiModFlag = false;
    m_submitFlag = false;

    m_xmlMods.loadXML("<CPTs></CPTs>");
    try
    {
        for (var y = 0, yl = components.length; y < yl; y++)
        {
            if (components[y] instanceof FinalizeChargesComponent)
            {
                iiModFlag = true;
            }
        }
        if (iiModFlag)
        {
            var tblObj = _g('ii_table');
            var rCount = tblObj.rows.length;
            var root, newel, newtext;
            var comp = m_xmlMods.getElementsByTagName("CPTs");
            for (var currindex = 0; currindex < rCount; currindex++)
            {
                newel = m_xmlMods.createElement('CPT');
                root = m_xmlMods.getElementsByTagName('CPTs');
                root[root.length - 1].appendChild(newel);

                for (c = 0; c < comp.length; c++)
                {
                    newel = m_xmlMods.createElement('Source');
                    newtext = m_xmlMods.createTextNode('IV');
                    newel.appendChild(newtext);
                    root = comp[c].getElementsByTagName('CPT');
                    root[root.length - 1].appendChild(newel);

                    var cptValue = tblObj.rows[currindex].cells[0].innerHTML;
                    if (cptValue)
                    {
                        cptValue = cptValue.split(' -');
						
                    }
                    newel = m_xmlMods.createElement('Value');
                    newtext = m_xmlMods.createTextNode(cptValue[0]);
                    newel.appendChild(newtext);
                    root = comp[c].getElementsByTagName('CPT');
                    root[root.length - 1].appendChild(newel);
					cptValues.push(cptValue[0]);
					cptValues.push(0);

					cptCodeValues.push(cptValue[0]);
					
                    if ($('#ii_modvalues' + currindex).text() !== "")
                    {
                        var modValues1 = $('#ii_list-' + currindex).val().toString().split(',');
                       
						ModifierCnt.push(modValues1.length+1);
						for (i = 0; i < modValues1.length; i++)
                        {
                            newel = m_xmlMods.createElement('Mod');
                            root = m_xmlMods.getElementsByTagName('CPT');
                            root[root.length - 1].appendChild(newel);

                            newel = m_xmlMods.createElement('Value');
                            newtext = m_xmlMods.createTextNode(modValues1[i]);
                            newel.appendChild(newtext);
                            root = comp[c].getElementsByTagName("Mod");
                            root[root.length - 1].appendChild(newel);
							cptValues.pop();
							cptValues.push(modValues1.length);
							cptValues.push(CtpUnits[c]);							
							cptValues.push(modValues1[i]);
							
							cptModifierValues.push(modValues1[i]);
                        }
                    } 
					else
					{
						ModifierCnt.push(1);
						cptModifierValues.push(1);
						cptValues.push(CtpUnits[currindex]);	
                        continue;
					}
                }
            }
        }
		var site_cds1 = MP_Util.CreateParamArray(cptValues, 1);
		
		var site_Cptsunits = MP_Util.CreateParamArray(CtpUnits, 1);
		
		var site_CptsDates = MP_Util.CreateParamArray(CtpStartDates, 1);
		
		var txtModXML = GetStringFromXML(m_xmlMods);		
		   
	    var components = m_InfusionComp.getComponents();
		var component;
        for (var y = 0, yl = components.length; y < yl; y++)
        {
            if (components[y] instanceof InjectionInfusionComponent)
            {
                component = components[y];
            }
        }
		
		var sendAr = [];
		sendAr.push("^MINE^,"+m_PersonId+".00,"+ m_EncounterId + ".00,value("+cptCodeValues+"),value("+CtpUnits+"),value("+CtpServiceDates+"),value("+ModifierCnt+"),value("+cptModifierValues+")");
		var req = new MP_Core.ScriptRequest(component, "");
		req.setProgramName("onc_ii_drop_charges");
		req.setParameters(sendAr);									
		req.setAsync(false);       
		MP_Core.XMLCCLRequestCallBack(component, req, function (reply)
        {
			var recordData = reply.getResponse();
			if(m_AutomateIvInd){				
				StoreSubmitedOrdersToTable(m_SubmitedMedications,arrOrderIds,arrEventStatus,arrAdminRoutes, arrServiceDtTm,component)
			}
        });
		
		var sendAr = [];
		sendAr.push("^MINE^," + m_EncounterId + ".00,"+"^"+GetStringFromXML(m_xmlDispCharges)+"^");
		var req = new MP_Core.ScriptRequest(component, "");
		req.setProgramName("onc_save_charging_xml");
		req.setParameters(sendAr);									
		req.setAsync(false);       
		MP_Core.XMLCCLRequestCallBack(component, req, function (reply){
        });
		
        if (m_debug_ind == 1)
        {
            wndDebugInfo = "[SubmitCharges] \n";
            wndDebugInfo += "emModFlag: " + emModFlag + "\n" + "iiModFlag: " + iiModFlag + "\n" + "txtModXML: \n" + txtModXML;

            var wndDebug = window.open('', '', wndDebugSettings);
            wndDebug.document.title = m_MPageCatMean + ": SubmitCharges()";
            if (wndDebug.document.body.textContent) //Firefox
            {
                wndDebug.document.body.textContent = wndDebugInfo;
            }
            else
            {
                wndDebug.document.body.innerText = wndDebugInfo;
            }
            wndDebug.focus();
        }
    }
    catch (err)
    {
        //Error pops up when the charges are not calculated properly
    }
}

/**
*   This function is used to get the CPT codes for the orders.
*   This function establishes a connection between LYNX server and billing application.
*   After connection is established a XML file file containing all orders information from II table,
*   will be sent to LYNX sandbox.
*   After service is executed , LYNX server will send a reply with XML having CPT codes for orders. 
**/
function CalculateCharges()
{
	var submitOrders = true;
	var increment = 0;
	if(m_AutomateIvInd && m_bShowSubmittedOrders == true){	
		increment = 7;
		if(m_iiMARDelete){
			increment = 8;
		}
		if (confirm(i18n.WARING_MSG) == true) {
			submitOrders = false;
		} else {
			submitOrders = true;
		}
	}
	
	if (infusionInjection)
    {
		var m_xmltxtIVs = "<Message></Message>";
        m_xmlIVs.loadXML(m_xmltxtIVs);
        var updateInd = 0;
        var root, newel, newtext;
        var comp = m_xmlIVs.getElementsByTagName("Message");
		
		newel = m_xmlIVs.createElement('TransactionID');
        newtext = m_xmlIVs.createTextNode(m_TransactionId);
        newel.appendChild(newtext);		
        root = m_xmlIVs.getElementsByTagName("Message");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('Facility');
        root = m_xmlIVs.getElementsByTagName('Message');
        root[root.length - 1].appendChild(newel);

        newel = m_xmlIVs.createElement('ExternalCode');
		newtext = m_xmlIVs.createTextNode(m_FacilityCd);         
        newel.appendChild(newtext);
        root = m_xmlIVs.getElementsByTagName("Facility");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('AdmitDateTime');
        newtext = m_xmlIVs.createTextNode(m_BegDtTm);//m_AdmitDtTm
        newel.appendChild(newtext);		
        root = m_xmlIVs.getElementsByTagName("Message");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('FinancialClass');
        root = m_xmlIVs.getElementsByTagName('Message');
        root[root.length - 1].appendChild(newel);

        newel = m_xmlIVs.createElement('Code');
        newtext = m_xmlIVs.createTextNode(m_FinClsCd);
        newel.appendChild(newtext);
        root = m_xmlIVs.getElementsByTagName("FinancialClass");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('Patient');
        root = m_xmlIVs.getElementsByTagName('Message');
        root[root.length - 1].appendChild(newel);

        newel = m_xmlIVs.createElement('Sex');
        newtext = m_xmlIVs.createTextNode(m_SexCd);
        newel.appendChild(newtext);
        root = m_xmlIVs.getElementsByTagName("Patient");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('DOB');
		newtext = m_xmlIVs.createTextNode(m_Dob);
        newel.appendChild(newtext);
        root = m_xmlIVs.getElementsByTagName("Patient");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('LastName');
        newtext = m_xmlIVs.createTextNode(m_NameLast);
        newel.appendChild(newtext);
        root = m_xmlIVs.getElementsByTagName("Patient");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('FirstName');
        newtext = m_xmlIVs.createTextNode(m_NameFirst);
        newel.appendChild(newtext);
        root = m_xmlIVs.getElementsByTagName("Patient");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('Visit');
        root = m_xmlIVs.getElementsByTagName('Message');
        root[root.length - 1].appendChild(newel);

        newel = m_xmlIVs.createElement('Coding');
        newtext = m_xmlIVs.createTextNode('F');
        newel.appendChild(newtext);
        root = m_xmlIVs.getElementsByTagName("Visit");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('Type');
        newtext = m_xmlIVs.createTextNode('OOOS');
        newel.appendChild(newtext);
        root = m_xmlIVs.getElementsByTagName("Visit");
        root[root.length - 1].appendChild(newel);
		
		newel = m_xmlIVs.createElement('CodeSet');
        newtext = m_xmlIVs.createTextNode('New');
        newel.appendChild(newtext);
        root = m_xmlIVs.getElementsByTagName("Visit");
        root[root.length - 1].appendChild(newel);
		
		var tObj = _g('infusion_tbl');
        var rowCount = tObj.rows.length;
		
        if (CERN_INFUSIONINJECTION_O1.GetMARInd() && m_iiMARDelete)
        {
            updateInd = 1;
        }
		for (var currowindex = 0; currowindex < rowCount; currowindex++)
        { 
			if(tObj.rows[currowindex].cells[increment].innerHTML == m_SubmitString && submitOrders == true){
				// TBD
			}
			else{
				newel = m_xmlIVs.createElement('IV');
				root = m_xmlIVs.getElementsByTagName('Message');
				root[root.length - 1].appendChild(newel);
				//Add I&I values 
				comp = m_xmlIVs.getElementsByTagName("Message");
				for (c = 0; c < comp.length; c++)
				{
					newel = m_xmlIVs.createElement('IVSite');
					newtext = m_xmlIVs.createTextNode(tObj.rows[currowindex].cells[(1 + updateInd)].innerHTML);
					newel.appendChild(newtext);
					root = comp[c].getElementsByTagName("IV");
					root[root.length - 1].appendChild(newel);
	
					newel = m_xmlIVs.createElement('IVType');
					if (CERN_INFUSIONINJECTION_O1.GetMARInd() == 1)
					{
						newtext = m_xmlIVs.createTextNode(tObj.rows[currowindex].cells[(2 + updateInd)].innerHTML);
					}
					else
					{
						//Get IVType ValueId from Display                               
						var item, typeDisp, typeValue, nodDisp, nodValue;
						var tmpNewText = "";
						var compXmlDoc = m_xmlDoc.getElementsByTagName("Component");
						for (c1 = 0; c1 < compXmlDoc.length; c1++)
						{
							if (compXmlDoc[c1].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "INFUSION_INJECTION")
							{
								item = compXmlDoc[c1].getElementsByTagName("Item");
								for (ch1 = 0; ch1 < item.length; ch1++)
								{
									if (item[ch1].getElementsByTagName("Name")[0].childNodes[0].nodeValue === "Type")
									{
										typeDisp = item[ch1].getElementsByTagName("Disp");
										typeValue = item[ch1].getElementsByTagName("ValueId");
										for (id1 = 0; id1 < typeValue.length; id1++)
										{
											nodDisp = typeDisp[id1].childNodes[0].nodeValue;
											nodVal = typeValue[id1].childNodes[0].nodeValue;
											if (nodVal === tObj.rows[currowindex].cells[(2 + updateInd)].innerHTML)
											{
												tmpNewText = nodVal;
												break;
											}
										}
									}
								}
							}
						}
						newtext = m_xmlIVs.createTextNode(tmpNewText);
					}
				
					newel.appendChild(newtext);
					root = comp[c].getElementsByTagName("IV");
					root[root.length - 1].appendChild(newel);
	
					newel = m_xmlIVs.createElement('StartDateTime');
					if(m_AutomateIvInd){
						newtext = m_xmlIVs.createTextNode($("#"+tObj.rows[currowindex].cells[(4 + updateInd)].id).attr("startDate"));
					}
					else{
						var datestr = getLocalisedDate((tObj.rows[currowindex].cells[(4 + updateInd)].innerHTML).substr(0,10))
						newtext = m_xmlIVs.createTextNode(datestr+" "+((tObj.rows[currowindex].cells[(4 + updateInd)].innerHTML).substr(11,5)));
					}
					newel.appendChild(newtext);
					root = comp[c].getElementsByTagName("IV");
					root[root.length - 1].appendChild(newel);
	
					newel = m_xmlIVs.createElement('StopDateTime');
					if(m_AutomateIvInd){
						newtext = m_xmlIVs.createTextNode($("#"+tObj.rows[currowindex].cells[(5 + updateInd)].id).attr("stopDate"));
					}
					else{
						var datestr = getLocalisedDate((tObj.rows[currowindex].cells[(5 + updateInd)].innerHTML).substr(0,10))
						newtext = m_xmlIVs.createTextNode(datestr+" "+((tObj.rows[currowindex].cells[(5 + updateInd)].innerHTML).substr(11,5)));
					}					
					newel.appendChild(newtext);
					root = comp[c].getElementsByTagName("IV");
					root[root.length - 1].appendChild(newel);
	
					newel = m_xmlIVs.createElement('Medication');
					root = m_xmlIVs.getElementsByTagName('IV');
					root[root.length - 1].appendChild(newel);
	
					newel = m_xmlIVs.createElement('Name');
					newtext = m_xmlIVs.createTextNode(tObj.rows[currowindex].cells[(0 + updateInd)].innerHTML);
					newel.appendChild(newtext);
					root = comp[c].getElementsByTagName("Medication");
					root[root.length - 1].appendChild(newel);
				}
			}
        }
	}
    var criterion = m_ChargesComp.getCriterion();

    if (m_debug_ind == 1)
    {
        wndDebugInfo = "[GetSavedData] \n";
        wndDebugInfo += "m_em_charge_ind: " + m_em_charge_ind + "\n" + "m_iv_charge_ind: " + m_iv_charge_ind + "\n" + "m_txtSavedXML: \n" + GetStringFromXML(m_txtSavedXML) + "\n";
        wndDebugInfo += "[CalculateCharges] \n";
        wndDebugInfo += "PersonID: " + criterion.person_id + "\n" + "EncounterID: " + criterion.encntr_id + "\n" + "TrackingGroupCD: " + m_TrackingGroupCd + "\n\n";
        wndDebugInfo += "m_xmlVisit: \n" + GetStringFromXML(m_xmlVisit) + "\n";
        wndDebugInfo += "m_xmlIVs: \n" + GetStringFromXML(m_xmlIVs) + "\n";
    }
    if (infusionInjection)
    {	
        if (m_lynxObject === null)
        {
			m_lynxObject = new ActiveXObject("EP73Connect.EPConnect");
        }
        if (m_lynxObject != null)
        {	
			var timerMPage = MP_Util.CreateTimer("USR:MPG.ONC_FINALIZE_CHARGES.01 - load component");
			var timerSendEPointMessage = MP_Util.CreateTimer("ENG:ONC.SENDMSGTOIPOINT");
            m_xmlDispCharges.loadXML(m_lynxObject.XmlRequest(m_LynxWebUrl,GetStringFromXML(m_xmlIVs)));
			if (timerSendEPointMessage)
				timerSendEPointMessage.Stop();
			if (timerMPage)
				timerMPage.Stop();
			if (m_debug_ind == 1)
                wndDebugInfo += "GetMessageFromEPoint: \n" + GetStringFromXML(m_xmlDispCharges);			
        }
        else
        {
            alert(i18n.LYNXEPOINT_OBJECT_NULL)
        }
    }

    if (m_debug_ind == 1)
    {
        var wndDebug = window.open('', '', wndDebugSettings);
        wndDebug.document.title = m_MPageCatMean + ": CalculateCharges()";
        if (wndDebug.document.body.textContent) //Firefox
        {
            wndDebug.document.body.textContent = wndDebugInfo;
        }
        else
        {
            wndDebug.document.body.innerText = wndDebugInfo;
        }
        wndDebug.focus();
    }
    var ChargeComponent = m_ChargesComp.getComponents();
	var proc = m_xmlDispCharges.getElementsByTagName("Edits");
	var edits = proc[0].getElementsByTagName("Edit");
	
	if(edits.length > 0)
	{
		var warningstring = "";
		for (var i = 0, il = edits.length; i < il; i++)
        {           
			warningstring = warningstring + edits[i].getElementsByTagName("Message")[0].childNodes[0].nodeValue + "\n";            
        }		
		alert(i18n.MISSING_DETAILS+ "\n" + warningstring);
	}
	ChargeComponent[0].InsertData();
    $('#submitCharges').attr("disabled", false);
    m_submitFlag = true;
}

/**
*   call this function to ensure blank sub-header is loaded.
**/
function loadSubHeader(divin)
{
}

/**
*   this function is used to retrieve string format of an XML file.
**/
function GetStringFromXML(xmlNode)
{
    if (typeof window.XMLSerializer != "undefined"){
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } 
    else if (typeof xmlNode.xml != "undefined"){
        return xmlNode.xml;
    }
    return "";
}

/**
*   this function is used to validate missing data information for II table orders in automate-IV-Mode.
**/
function ValidateInfusiontabledata()
{
	var tObj1 = _g('infusion_tbl');
	var rowCount1 = tObj1.rows.length;
	var updateInd = 0;
	var temp = "";
	var med_name = "";
    if (CERN_INFUSIONINJECTION_O1.GetMARInd() && m_iiMARDelete)
	{
		updateInd = 1;
	}
	
	for (var currowindex = 0; currowindex < rowCount1; currowindex++)
	{		
        temp = tObj1.rows[currowindex].cells[(5 + updateInd)].innerHTML;		
		var temp1 = temp.length;
		if(temp1 == 0)
		{
			if(tObj1.rows[currowindex].cells[(0 + 2 + updateInd)].innerHTML == "CHEMOIVPUMP" ||
			   tObj1.rows[currowindex].cells[(0 + 2 + updateInd)].innerHTML == "CHEMOARTPUMP"){
				//Don't do anything
			}
			else{			   
				m_redrawInfusionPanel = true;
				med_name = med_name + tObj1.rows[currowindex].cells[(0 + updateInd)].innerHTML + "\n";
			}
		}				
	}
	if(m_redrawInfusionPanel == true)
	{
		alert(i18n.MISSING_STOP_DATE_TM + "\n" + med_name );
	}
}

function StoreSubmitedOrdersToTable(arrEventId,arrOrderId,arrEventStatus,arrAdminRoutes, arrServiceDtTm,component)
{
	var sendAr = [];
	sendAr.push("^MINE^," + m_PersonId + ".00," + m_EncounterId + ".00,"+
				"value("+arrEventId+"),"+"value("+arrOrderId+"),"+"value("+arrEventStatus+"),"+
				"value("+arrAdminRoutes+"),"+"value("+arrServiceDtTm+")");
	//sendAr.push("^MINE^," + m_EncounterId + ".00,"+"^Msg^");
	var req = new MP_Core.ScriptRequest(component, "");
	req.setProgramName("onc_store_submitted_events");
	req.setParameters(sendAr);									
	req.setAsync(false);       
	MP_Core.XMLCCLRequestCallBack(component, req, function (reply){});
}

function StoreDeletedOrdersToTable(delEventId,component)
{
	var sendAr = [];
	sendAr.push("^MINE^," + m_PersonId + ".00," + m_EncounterId + ".00,"+delEventId);
	var req = new MP_Core.ScriptRequest(component, "");
	req.setProgramName("onc_delete_event");
	req.setParameters(sendAr);									
	req.setAsync(false);       
	MP_Core.XMLCCLRequestCallBack(component, req, function (reply){});
}
/**
*   this function is used to create submitted orders XML file.
*   After xml file is created this function will save XML file in Long-text table. 
**/
function StoreSubmitedOrders(OrdersArray,component)
{
	if(m_existingSubmitedorder.length > 0)
	{
		for(var i =0;i<m_existingSubmitedorder.length;i++)
		{
			OrdersArray.push(m_existingSubmitedorder[i]);
		}
	}
	OrdersArray.sort();
	var m_xmlSubOrd = "<Message></Message>";
    m_xmlSubmitedOrders.loadXML(m_xmlSubOrd);
	var root, newel, newtext;
    var comp = m_xmlSubmitedOrders.getElementsByTagName("Message");
	var temp =0;
	for(var i =0;i<OrdersArray.length;i++)	
	{
		if(temp != OrdersArray[i])
		{
			newel = m_xmlSubmitedOrders.createElement('OrderId');
			newtext = m_xmlSubmitedOrders.createTextNode(OrdersArray[i]);
			newel.appendChild(newtext);		
			root = m_xmlSubmitedOrders.getElementsByTagName("Message");
			root[root.length - 1].appendChild(newel);
		
			newel = m_xmlSubmitedOrders.createElement('Status');
			newtext = m_xmlSubmitedOrders.createTextNode(1);
			newel.appendChild(newtext);		
			root = m_xmlSubmitedOrders.getElementsByTagName("Message");
			root[root.length - 1].appendChild(newel);
		}
		temp = OrdersArray[i];
	}
	var sendAr = [];
	sendAr.push("^MINE^," + m_EncounterId + ".00,"+"^"+GetStringFromXML(m_xmlSubmitedOrders)+"^");
	var req = new MP_Core.ScriptRequest(component, "");
	req.setProgramName("onc_save_submit_orders_xml");
	req.setParameters(sendAr);									
	req.setAsync(false);       
	MP_Core.XMLCCLRequestCallBack(component, req, function (reply){});
}

/**
*   this function is used to create deleted orders XML file.
*   After xml file is created this function will save XML file in Long-text table. 
**/
function StoreDeletedOrders(deletedOrdersArray,component)
{
    if(m_existingDeletedOrders.length > 0)
    {
        for(var i =0;i<m_existingDeletedOrders.length;i++)
        {
            deletedOrdersArray.push(m_existingDeletedOrders[i]);
        }
    }
    deletedOrdersArray.sort();
    var m_xmlSubOrd = "<Message></Message>";
    m_xmlDeletedOrders.loadXML(m_xmlSubOrd);
    var root, newel, newtext;
    var comp = m_xmlDeletedOrders.getElementsByTagName("Message");
    var temp =0;
    for(var i =0;i<deletedOrdersArray.length;i++)  
    {
        if(temp != deletedOrdersArray[i])
        {
            newel = m_xmlDeletedOrders.createElement('deletedOrderId');
            newtext = m_xmlDeletedOrders.createTextNode(deletedOrdersArray[i]);
            newel.appendChild(newtext);     
            root = m_xmlDeletedOrders.getElementsByTagName("Message");
            root[root.length - 1].appendChild(newel);
        
            newel = m_xmlDeletedOrders.createElement('Status');
            newtext = m_xmlDeletedOrders.createTextNode(1);
            newel.appendChild(newtext);     
            root = m_xmlDeletedOrders.getElementsByTagName("Message");
            root[root.length - 1].appendChild(newel);
        }
        temp = deletedOrdersArray[i];
    }
    var sendAr = [];
    sendAr.push("^MINE^," + m_EncounterId + ".00,"+"^"+GetStringFromXML(m_xmlDeletedOrders)+"^");
    var req = new MP_Core.ScriptRequest(component, "");
    req.setProgramName("onc_save_deleted_orders_xml");
    req.setParameters(sendAr);                                  
    req.setAsync(false);       
    MP_Core.XMLCCLRequestCallBack(component, req, function (reply){});
}
/**
*   search algorithm for order search.
*   This function implements Binary search algorithm.
**/
function searcOrderID(OrdersArray,itemsToSearch)
{      
    var index = -1; 
	for(var i = 0;i < OrdersArray.length ;i++){
		if(parseFloat(OrdersArray[i]) === parseFloat(itemsToSearch)){
			index = i;
			break;	
		}
	}
    return index;
}

/**
* create array of stop-date-time.
* this is used to sort the data in automate mode in stop-date time order
*/
function formatRecordData(recordData)
{
    var zeroArr = [];
    var nonZeroArr = [];
    var returnArr = [];
    var dataArr = [];
    var dataIndex = [];
    var basicRecordData = recordData;
    var dateTime = new Date();
    for (var j = 0, jl = basicRecordData.MEDICATIONS.length; j < jl; j++)
    {
        var stopDate = "";
        var diff = "";
       
        if (basicRecordData.MEDICATIONS[j].STOPDATETIME !== "")
        {
            dateTime.setISO8601(basicRecordData.MEDICATIONS[j].STOPDATETIME);
            stopDate = dateTime.format("longDateTime3");
        }
        if (stopDate !== "")
        {
            nonZeroArr.push(j);
            dataArr.push(Math.ceil(new Date(stopDate)));
            dataIndex.push(Math.ceil(new Date(stopDate)));
            dataIndex.push(j);
        }
        else
        {
            zeroArr.push(j);
        }
    }
	
    var tempArr = filterZeroStopDateData(dataArr);
    returnArr.push(zeroArr);
    returnArr.push(tempArr);
    returnArr.push(dataIndex);
	
    return returnArr;
}
/**
* this function is used to sort the recordData with respect to stop date time.
* THis function uses insertion sort algorithm
**/
function filterZeroStopDateData(unSortedData)
{
    var i;
    var j;
    var key;
    var index;
    var a = unSortedData;
    for(i=1;i<a.length;i++)
    {
        key = a[i];
        j = i-1;
        while(j >= 0 && key<a[j])
        {
            a[j+1] =  a[j];
            j = j-1;
        }
        a[j+1] = key;
    }	
    return a;
}

/**
* This function is used to sort the recordData with respect to stop date time.
* This function uses bubble sort algorithm
**/
function formatRecordStructure(recordData, sortOrder)
{  
	var temprecordData = recordData;
    var i;
    var j;
    var temp;
	var tempFlag= false;
    var dateTime1 = new Date();
    for(i =0;i<temprecordData.MEDICATIONS.length;i++)
    {
        var flag = 0;
        for(j=0;j<temprecordData.MEDICATIONS.length-i-1;j++)
        {				
			flag = 0;
            var firstDate = "";
            var secondDate = "";
            var minTime, maxTime;
            var presDateTime;
            var nextDateTime;
            if(parseInt(sortOrder) == 1)
            {
				if(m_sortFlexer1){
					presDateTime = temprecordData.MEDICATIONS[j].STARTDATETIME;
					nextDateTime = temprecordData.MEDICATIONS[j+1].STARTDATETIME;
				}
				else{
					nextDateTime = temprecordData.MEDICATIONS[j].STARTDATETIME;
					presDateTime = temprecordData.MEDICATIONS[j+1].STARTDATETIME;
				}
            }
            if(parseInt(sortOrder) == 2)
            {
				if(m_sortFlexer2){
						presDateTime = temprecordData.MEDICATIONS[j].STOPDATETIME;
						nextDateTime = temprecordData.MEDICATIONS[j+1].STOPDATETIME;
				}
				else{
						nextDateTime = temprecordData.MEDICATIONS[j].STOPDATETIME;
						presDateTime = temprecordData.MEDICATIONS[j+1].STOPDATETIME;
				}
            }

			if(parseInt(sortOrder) == 3)
            {			
				presDateTime = temprecordData.MEDICATIONS[j].STOPDATETIME;
				nextDateTime = temprecordData.MEDICATIONS[j+1].STOPDATETIME;					
            }
				
            if(presDateTime !== "")
            {
                dateTime1.setISO8601(presDateTime);
                firstDate = dateTime1.format("longDateTime3");
                maxTime = new Date(firstDate).getTime();
            }
            else
			{
                maxTime = 0; 
            }
            if(nextDateTime !== "")
            {
                secondDate = dateTime1.setISO8601(nextDateTime);
                secondDate = dateTime1.format("longDateTime3");
                minTime = new Date(secondDate).getTime();
            }
            else
            {
                minTime = 0;
            }
                 
            if(maxTime > minTime)
            {
                temp = temprecordData.MEDICATIONS[j];
                temprecordData.MEDICATIONS[j] = temprecordData.MEDICATIONS[j+1];
                temprecordData.MEDICATIONS[j+1] = temp;
                flag =1;
				tempFlag = true;
            }                                
        }
    }
	if(parseInt(sortOrder) != 3)
	{
		return temprecordData;
	}
	else
	{
		var orderIdsSubmited = []; 
		var orderIdsNotSubmited = []; 
		var reversedRecord = temprecordData;		
		orderIdsSubmited = getSubmittedOrders(reversedRecord);
		if(orderIdsSubmited.length > 0)
		{		
			for (var j = 0, jl = reversedRecord.MEDICATIONS.length; j < jl; j++)
			{
				var index = searcOrderID(orderIdsSubmited,reversedRecord.MEDICATIONS[j].EVENT_ID);                
				if(index != -1){
					orderEventId = orderIdsSubmited.push(j);            
				}
				else{
					orderIdsNotSubmited.push(j);
				}
			}
		}
		
		if(orderIdsNotSubmited.length > 0)
		{	
			var startIndex = 0;
			for(var i =0;i<orderIdsNotSubmited.length;i++)
			{
				var zeroArr = orderIdsNotSubmited;
				var index = zeroArr[i];
				var localData = reversedRecord.MEDICATIONS[i];
				reversedRecord.MEDICATIONS[i] = reversedRecord.MEDICATIONS[index];
				reversedRecord.MEDICATIONS[index] = localData;
				startIndex = startIndex+1;        
			}		 
		}
		
		if(m_sortFlexer3)
		{			
			if(orderIdsNotSubmited.length > 0)
			{	
				var startIndex = reversedRecord.MEDICATIONS.length;
				for(var i =0;i<orderIdsNotSubmited.length;i++)
				{
					startIndex = startIndex-1; 
					var localData = reversedRecord.MEDICATIONS[i];
					reversedRecord.MEDICATIONS[i] = reversedRecord.MEDICATIONS[startIndex];
					reversedRecord.MEDICATIONS[startIndex] = localData;					       
				}		 
			}
		}
		return reversedRecord;
	}
}
/**
* this function is used to get the submitted orders for the encounter
* this function loops through submitted order xml and fetches the stored submitted orders.
**/
function getSubmittedOrders(recordData)
{    
	var iSubOrdCnt = recordData.SUBMITTED_EVENTS.length;
	var orderIdsSubmited = [];   
	/*var xmldata = recordData.LONG_TEXT;
    m_xmlLoadSubmitedOrders.loadXML(xmldata);
     
    var xmlsubmitedOrders = m_xmlLoadSubmitedOrders.getElementsByTagName('OrderId');
    for(var i = 0;i< xmlsubmitedOrders.length;i++)
    {
        orderIdsSubmited.push(xmlsubmitedOrders[i].childNodes[0].nodeValue)
    }*/
	for(var i = 0;i< iSubOrdCnt;i++)
    {
        orderIdsSubmited.push(recordData.SUBMITTED_EVENTS[i].EVENT_ID)
    }
    return orderIdsSubmited;
}

function checkForSubmittedOrders(){
	var isTableHasSubmittedOrders = false;
	var tObj = _g('infusion_tbl');
    var rowCount = tObj.rows.length;
	for (var currowindex = 0; currowindex < rowCount; currowindex++)
    {  
		if(m_AutomateIvInd){
			if(tObj.rows[currowindex].cells[8].innerHTML == m_SubmitString){
				isTableHasSubmittedOrders = true;
			}
			else{
				isTableHasSubmittedOrders = false;
			}
		}
	}
	return isTableHasSubmittedOrders;
}

function getLocaleInfo(localeOption){
	var localeValue = MPAGE_LC.en_US;
	switch (localeOption)
    {
        case "de_DE":
            return MPAGE_LC.de_DE;
            break;
        case "en_AU":
            return MPAGE_LC.en_AU;
            break;
		case "en_ES":
            return MPAGE_LC.en_ES;
            break;
		case "fr_FR":
            return MPAGE_LC.fr_FR;
            break;
        default:
            return MPAGE_LC.en_US;
    }
}

function getLocalisedDate(datestring){
	var dtday = datestring;
	var dtmonth = datestring;
	var dtyear = datestring;
	var convertedDate ;
	convertedDate = dtday.substr(3,2)+"/"+dtmonth.substr(0,2)+"/"+dtyear.substr(6,4);
	if(m_localeName == "en_US"){
		return datestring;		
	}
	else{
		return convertedDate;
	}
}

//*******************************END OF FILE**********************************************//
