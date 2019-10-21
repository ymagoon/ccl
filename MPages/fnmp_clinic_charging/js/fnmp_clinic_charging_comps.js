/**
* Project: fnmp_critical_care_o1.js
* Version 1.0.0
*/

function CriticalCareComponentStyle()
{
    this.initByNamespace("cc");
}

CriticalCareComponentStyle.inherits(ComponentStyle);

function CriticalCareComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new CriticalCareComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.CRITICALCARE.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.CRITICALCARE.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.m_ccReadOnly = false;

    CriticalCareComponent.method("InsertData", function ()
    {
        CERN_CRITICALCARE_O1.GetCriticalCareTable(this);
    });
    CriticalCareComponent.method("HandleSuccess", function (recordData)
    {
        CERN_CRITICALCARE_O1.RenderComponent(this, recordData);
    });
    CriticalCareComponent.method("GetSelected", function ()
    {
        return CERN_CRITICALCARE_O1.GetSelectedOption(this);
    });
    CriticalCareComponent.method("setReferenceTxtInd", function (value)
    {
        this.setRefTxtExpanded(value);
    });
    CriticalCareComponent.method("setReadOnlyInd", function (value)
    {
        this.m_ccReadOnly = value;
    });
    CriticalCareComponent.method("getReadOnlyInd", function ()
    {
        return this.m_ccReadOnly;
    });
    CriticalCareComponent.method("GetCrCareMinutes", function ()
    {
        return CERN_CRITICALCARE_O1.GetCrCareMinutesValue(this);
    });
}

CriticalCareComponent.inherits(MPageComponent);

var CERN_CRITICALCARE_O1 = function ()
{
    return {
        GetCriticalCareTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", m_CodingMPageFlag);
            logCC = "fnmp_get_critical_care:" + sendAr.join(",");
            MP_Core.XMLCclRequestWrapper(component, "fnmp_get_critical_care", sendAr, true);
        },

        RenderComponent: function (component, recordData)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [], calItems = [], systemAlias = recordData.ALIAS, systemMinutes = recordData.MINUTES;
                var displayMinutes = systemMinutes;
                var c = 0, ch = 0;
                if (systemAlias.length == 0)
                {
                    systemAlias = "0";
                }

                jsHTML.push("<div class='cc-info'>");

                var comp = m_xmlDoc.getElementsByTagName("Component");
                var style = component.getStyles().getNameSpace();
                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "CRITICAL_CARE")
                    {
                        var helpText = comp[c].getElementsByTagName("Help")[0].childNodes[0].nodeValue;
                        if (helpText.length > 0)
                        {
                            jsHTML.push("<div class='fc-sub-sec' id='fc-sub-sec-" + style + "'><h3 class='fc-sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.HELP_SECTION, "</span></h3><div class='sub-sec-content fc-sub-sec-content'>");
                            jsHTML.push(helpText);
                            jsHTML.push("</div></div>");
                            jsHTML.push("</div>");
                        }
                    }
                }

                var display = "", id = "", savedMinutes = "";
                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue === "CRITICAL_CARE")
                    {
                        var item = comp[c].getElementsByTagName("Item");
                        for (ch = 0; ch < item.length; ch++)
                        {
                            display = item[ch].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                            id = item[ch].getElementsByTagName("ValueId")[0].childNodes[0].nodeValue;
                            calItems[ch] = id;
                        }
                    }
                }

                if ((m_em_charge_ind == 1) && (m_txtSavedXML.length > 0))
                {
                    var comp = m_savedXML.getElementsByTagName("CrCareMinutes");
                    savedMinutes = comp[0].firstChild ? comp[0].childNodes[0].nodeValue : "0";
                }
                if (systemMinutes || savedMinutes >= 30)
                {
                    if (systemMinutes && (id == systemAlias))
                    {
                        if (savedMinutes && (systemMinutes != savedMinutes))
                        {
                            display += i18n.SYSTEM_DEFAULT + systemMinutes;
                            displayMinutes = savedMinutes;
                        }
                        else
                        {
                            display += i18n.SYSTEM_DEFAULT;
                        }
                    }
                    else if (savedMinutes)
                    {
                        displayMinutes = savedMinutes;
                    }

                    jsHTML.push("<input type='checkbox' name='critCare' id=" + id + " value=" + id + " checked=true; onclick='javascript:CERN_CRITICALCARE_O1.DisplayMinTxt();'/>" + display +
							"&nbsp;<input type = 'text' id='cc-min'  value=" + displayMinutes + " size='4' maxlength='5' onkeypress='return isNumberKey(event);' onkeyup='javascript:CERN_CRITICALCARE_O1.ValidateCrMinutes();'/><br />");
                }
                else
                {
                    jsHTML.push("<input type='checkbox' name='critCare' id=" + id + " value=" + id + " onclick='javascript:CERN_CRITICALCARE_O1.DisplayMinTxt();'/>" + display +
							"&nbsp;<input type = 'text' id='cc-min' class='cc-min' size='4' maxlength='5' onkeypress='return isNumberKey(event);' onkeyup='javascript:CERN_CRITICALCARE_O1.ValidateCrMinutes();'/><br />");
                }

                var suggestedList = recordData.SUGGESTED;
                if (suggestedList.length > 0)
                {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.DOCUMENTED_SECTION, "</span></h3>")
                    for (var s = 0; s < suggestedList.length; s++)
                    {
                        jsHTML.push("<div class='sub-sec-content'>");
                        jsHTML.push(suggestedList[s].DISPLAY);
                        jsHTML.push("</div>");
                    }
                    jsHTML.push("</div></div>");
                }
                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

                if (component.getReadOnlyInd())
                {
                    CERN_CRITICALCARE_O1.SetDisabled();
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
        },

        GetSelectedOption: function ()
        {
            var retValue;
            var options = document.getElementsByName('CritCare');

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    retValue = options[i].value;
                    return retValue;
                } else
                    return '0';
            }
        },

        SetDisabled: function ()
        {
            var options = document.getElementsByName('CritCare');

            for (var i = 0; i < options.length; i++)
            {
                options[i].disabled = "disabled";
            }
            _g('cc-min').disabled = "disabled";
        },
        DisplayMinTxt: function ()
        {
            var options = document.getElementsByName('CritCare');

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    _g('cc-min').style.display = "inline";
                    _g('cc-min').value = '';
                    _g('cc-min').style.background = "#E77471";
                    _g('cc-min').focus();
                } else
                {
                    _g('cc-min').style.display = "none";
                }
            }
        },
        GetCrCareMinutesValue: function ()
        {
            var retValue;
            var options = document.getElementsByName('CritCare');

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    return _g('cc-min').value;
                } else
                    return;
            }
        },
        ValidateCrMinutes: function ()
        {
            var crmin = _g('cc-min').value;
            if (crmin != "")
            {
                if (parseInt(crmin) < 30)
                {
                    _g('cc-min').style.background = "#E77471";
                    return false;
                } else
                {
                    _g('cc-min').style.background = "";
                    return true;
                }
            }
        }
    };
} ();
function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}/**
* Project: fnmp_disposition_o1.js
* Version 1.0.0
*/

function DispositionComponentStyle()
{
    this.initByNamespace("disp");
}

DispositionComponentStyle.inherits(ComponentStyle);

function DispositionComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new DispositionComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.DISPOSITION.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.DISPOSITION.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.m_dispReadOnly = false;

    DispositionComponent.method("InsertData", function ()
    {
        CERN_DISPOSITION_O1.GetDispositionTable(this);
    });
    DispositionComponent.method("HandleSuccess", function (recordData)
    {
        CERN_DISPOSITION_O1.RenderComponent(this, recordData);
    });
    DispositionComponent.method("GetSelected", function ()
    {
        return CERN_DISPOSITION_O1.GetSelectedOption(this);
    });
    DispositionComponent.method("setReferenceTxtInd", function (value)
    {
        this.setRefTxtExpanded(value);
    });
    DispositionComponent.method("setReadOnlyInd", function (value)
    {
        this.m_dispReadOnly = value;
    });
    DispositionComponent.method("getReadOnlyInd", function ()
    {
        return this.m_dispReadOnly;
    });
}

DispositionComponent.inherits(MPageComponent);

var CERN_DISPOSITION_O1 = function ()
{
    return {
        GetDispositionTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", m_CodingMPageFlag);
            logDP = "fnmp_get_disposition:" + sendAr.join(",");
            MP_Core.XMLCclRequestWrapper(component, "fnmp_get_disposition", sendAr, true);
        },

        RenderComponent: function (component, recordData)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [], calItems = [], systemValue = recordData.ALIAS;
                var c = 0, ch = 0;
                if (systemValue.length == 0)
                {
                    systemValue = "0";
                }
                jsHTML.push("<div class='disp-info'>");

                var comp = m_xmlDoc.getElementsByTagName("Component");
                var style = component.getStyles().getNameSpace();
                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "DISPOSITION")
                    {
                        var helpText = comp[c].getElementsByTagName("Help")[0].childNodes[0].nodeValue;
                        if (helpText.length > 0)
                        {
                            jsHTML.push("<div class='fc-sub-sec' id='fc-sub-sec-" + style + "'><h3 class='fc-sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.HELP_SECTION, "</span></h3><div class='sub-sec-content fc-sub-sec-content'>");
                            jsHTML.push(helpText);
                            jsHTML.push("</div></div>");
                            jsHTML.push("</div>");
                        }
                    }
                }

                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "DISPOSITION")
                    {
                        var item = comp[c].getElementsByTagName("Item");
                        for (ch = 0; ch < item.length; ch++)
                        {
                            var display = item[ch].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                            var id = item[ch].getElementsByTagName("ValueId")[0].childNodes[0].nodeValue;
                            calItems[ch] = id;
                            if (id == systemValue)
                            {
                                display += i18n.SYSTEM_DEFAULT;
                            }
                            jsHTML.push("<input type='radio' name='disposition' id=" + id + " value=" + id + " />" + display + "<br />");
                        }
                    }
                }

                var suggestedList = recordData.SUGGESTED;
                if (suggestedList.length > 0)
                {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.DOCUMENTED_SECTION, "</span></h3>")
                    for (var s = 0; s < suggestedList.length; s++)
                    {
                        jsHTML.push("<div class='sub-sec-content'>");
                        jsHTML.push(suggestedList[s].DISPLAY);
                        jsHTML.push("</div>");
                    }
                    jsHTML.push("</div></div>");
                }
                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

                if (component.getReadOnlyInd())
                {
                    CERN_DISPOSITION_O1.SetDisabled();
                }
                CERN_DISPOSITION_O1.SelectOption(systemValue);
                if ((m_em_charge_ind == 1) && (m_txtSavedXML.length > 0))
                {
                    var savedData = MP_Util.GetSavedXMLData(calItems);
                    if (savedData.length > 0)
                    {
                        CERN_DISPOSITION_O1.SelectOption(savedData);
                    } else
                    {
                        CERN_DISPOSITION_O1.SelectOption(0);
                    }
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
        },

        GetSelectedOption: function ()
        {
            var retValue;
            var options = document.getElementsByName('disposition');

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    retValue = options[i].value;
                    return retValue;
                }
            }
        },

        SelectOption: function (_value)
        {
            var options = document.getElementsByName('disposition');
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].value == _value)
                {
                    options[i].checked = true;
                }
            }
        },

        SetDisabled: function ()
        {
            var options = document.getElementsByName('disposition');

            for (var i = 0; i < options.length; i++)
            {
                options[i].disabled = "disabled";
            }
        }
    };
} ();
/**
* Project: finalize_charges.js
* Version 1.0.0
*/
function FinalizeChargesComponentStyle()
{
    this.initByNamespace("sc");
}

FinalizeChargesComponentStyle.inherits(ComponentStyle);

function FinalizeChargesComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new FinalizeChargesComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.FinalizeCharges.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.FinalizeCharges.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.setDisplay(true);
    this.m_emModInd = false;
    this.m_iiModInd = false;

    FinalizeChargesComponent.method("InsertData", function ()
    {
        CERN_FINALIZECHARGES_O1.GetFinalizeChargesTable(this);
    });

    FinalizeChargesComponent.method("HandleSuccess", function (recordData)
    {
        CERN_FINALIZECHARGES_O1.CreateFinalizeChargesPanel(this, recordData);
    });
    FinalizeChargesComponent.method("setEMModCodes", function (value)
    {
        this.m_emModCodes = value;
    });
    FinalizeChargesComponent.method("getEMModCodes", function ()
    {
        if (this.m_emModCodes != null)
            return this.m_emModCodes;
    });
    FinalizeChargesComponent.method("setEMModInd", function (value)
    {
        this.m_emModInd = value;
    });
    FinalizeChargesComponent.method("getEMModInd", function ()
    {
        return this.m_emModInd;
    });
    FinalizeChargesComponent.method("setIIModCodes", function (value)
    {
        this.m_iiModCodes = value;
    });
    FinalizeChargesComponent.method("getIIModCodes", function ()
    {
        if (this.m_iiModCodes != null)
            return this.m_iiModCodes;
    });
    FinalizeChargesComponent.method("setIIModInd", function (value)
    {
        this.m_iiModInd = value;
    });
    FinalizeChargesComponent.method("getIIModInd", function ()
    {
        return this.m_iiModInd;
    });
    FinalizeChargesComponent.method("setSubmitChargesInd", function (value)
    {
        m_iiSubmitCharges = value;
    });
    FinalizeChargesComponent.method("getSubmitChargesInd", function ()
    {
        if (m_iiSubmitCharges != null)
            return m_iiSubmitCharges;
    });

}
FinalizeChargesComponent.inherits(MPageComponent);
var hmap = new Array();
var iihmap = new Array();
var CERN_FINALIZECHARGES_O1 = function ()
{
    return {
        GetFinalizeChargesTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            var emModcodes = component.getEMModCodes();
            var emMod_cds = MP_Util.CreateParamArray(emModcodes, 1);
            var iiModcodes = component.getIIModCodes();
            var iiMod_cds = MP_Util.CreateParamArray(iiModcodes, 1);
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", emMod_cds, iiMod_cds);

            MP_Core.XMLCclRequestWrapper(component, "fnmp_get_charge_summary", sendAr, true);
            logCS = "fnmp_get_charge_summary:" + sendAr.join(",");
        },
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
                if (evaluationManagement && m_StdVisitType && (proc.length > -1))
                {
                    if (recordData.EM_MOD.length)
                    {
                        component.setEMModInd(true);
                        jsHTML.push("<div id='sc-charges-div'><TABLE id='tblSC'>" +
						"<thead id='theadSC' class='ch-sub-sec'>" +
						"<tr><th colspan='4' class='tbl_header'><h3 class='txt_header'>" + panelList[0].getElementsByTagName("Name")[0].childNodes[0].nodeValue + "</h3></th></tr>" +
						"<tr><th id='fc_cpt' class='fc_cpt_withModifiers'>" + i18n.CPT + "</th> <th id='fc_units' class='fc_units_withModifiers'>" + i18n.UNITS + "</th>" +
						"<th id='fc_modifiers' class='fc_modifiers' style='border:1px solid #F6F6F6;'>" + i18n.MODIFIERS + "</th>" +
						"</tr></thead></TABLE><div id='em_fc_tbody'><table id='em_table'>");
                        for (var i = 0, il = proc.length; i < il; i++)
                        {
                            if (proc[i].getElementsByTagName("Source")[0].childNodes[0].nodeValue !== "IV")
                            {
                                var zebraStripping = count % 2 === 0 ? "odd" : "even";
                                jsHTML.push("<tr id = 'row_" + count + "' class='row_" + zebraStripping + "'>" +
													"<td class='fc_cpt_withModifiers'>" + proc[i].getElementsByTagName("CPT")[0].childNodes[0].nodeValue + " - " + proc[i].getElementsByTagName("CPTDescription")[0].childNodes[0].nodeValue +
													"</td><td class='fc_units_withModifiers'>" + proc[i].getElementsByTagName("Units")[0].childNodes[0].nodeValue + "</td>" +
													"<td class='fc_modifiers' id='em_fc_modifiers" + count + "'><span id='em_modvalues" + count + "' style='font-size:1em;'></span>" +
													"<div class='fc_modifiers_parentdiv'><div class='fc_modifiers_outerdiv' id='em_fc_modifiers_outerdiv" + count + "' onclick='EMModifersList(" + count + ");'> </div>" +
													"<div class='fc_modifiers_innerdiv' id='em_fc_modifiers_innerdiv" + count + "' style='background-color:#ffffff;font-size:1em;'>" +
													"<select multiple='multiple' size='3' id='em_list-" + count + "' class='em_fc_modifiersList' onchange='enableBtn();'>");
                                for (var j = 0, jl = recordData.EM_MOD.length; j < jl; j++)
                                {
                                    jsHTML.push("<option class='lt' value='" + recordData.EM_MOD[j].CD + "'>" + recordData.EM_MOD[j].DISP + "</option>");
                                    hmap[recordData.EM_MOD[j].CD] = recordData.EM_MOD[j].DISP;
                                }
                                jsHTML.push("</select></div></div></td>");
                                jsHTML.push("</tr>");
                                count++;
                            }
                        }
                        jsHTML.push("</table></div></div>");
                    }
                    else
                    {
                        component.setEMModInd(false);
                        jsHTML.push("<div id='sc-charges-div'><TABLE id='tblSC'>" +
						"<thead id='theadSC' class='ch-sub-sec'>" +
						"<tr><th colspan='2' class='tbl_header'><h3 class='txt_header'>" + panelList[0].getElementsByTagName("Name")[0].childNodes[0].nodeValue + "</h3></th></tr>" +
						"<tr><th id='fc_cpt' class='fc_cpt_withoutModifiers'>" + i18n.CPT + "</th> <th id='fc_units' class='fc_units_withoutModifiers'>" + i18n.UNITS + "</th>" +
						"</tr></thead></TABLE><div id='em_fc_tbody'><table id='em_table'>");
                        for (var i = 0, il = proc.length; i < il; i++)
                        {
                            if (proc[i].getElementsByTagName("Source")[0].childNodes[0].nodeValue !== "IV")
                            {
                                var zebraStripping = count % 2 === 0 ? "odd" : "even";
                                jsHTML.push("<tr id = 'row_" + count + "' class='row_" + zebraStripping + "'>" +
									        "<td class='fc_cpt_withoutModifiers'>" + proc[i].getElementsByTagName("CPT")[0].childNodes[0].nodeValue + " - " + proc[i].getElementsByTagName("CPTDescription")[0].childNodes[0].nodeValue +
											"</td><td class='fc_units_withoutModifiers'>" + proc[i].getElementsByTagName("Units")[0].childNodes[0].nodeValue + "</td></tr>");
                                count++;
                            }
                        }
                        jsHTML.push("</table></div></div>");
                    }
                }
                if (evaluationManagement && !m_StdVisitType)
                {
                    if (CERN_VISITTYPES_O1.GetSelectedOptions() != -1)
                    {
                        if (recordData.EM_MOD.length)
                        {
                            component.setEMModInd(true);
                            jsHTML.push("<div id='sc-charges-div'><TABLE id='tblSC'>" +
						    "<thead id='theadSC' class='ch-sub-sec'>" +
						    "<tr><th colspan='4' class='tbl_header'><h3 class='txt_header'>" + panelList[0].getElementsByTagName("Name")[0].childNodes[0].nodeValue + "</h3></th></tr>" +
						    "<tr><th id='fc_cpt' class='fc_cpt_withModifiers'>" + i18n.CPT + "</th> <th id='fc_units' class='fc_units_withModifiers'>" + i18n.UNITS + "</th>" +
						    "<th id='fc_modifiers' class='fc_modifiers' style='border:1px solid #F6F6F6;'>" + i18n.MODIFIERS + "</th>" +
						    "</tr></thead></TABLE><div id='em_fc_tbody'><table id='em_table'>");
                            var count = 0;
                            var zebraStripping = count % 2 === 0 ? "odd" : "even";
                            jsHTML.push("<tr id = 'row_" + count + "' class='row_" + zebraStripping + "'>" +
                        			    "<td class='fc_cpt_withModifiers'>" + CERN_VISITTYPES_O1.GetSelectedOptions() +
                        			    "</td><td class='fc_units_withModifiers'>1</td>" +
                        			    "<td class='fc_modifiers' id='em_fc_modifiers" + count + "'><span id='em_modvalues" + count + "' style='font-size:1em;'></span>" +
                        			    "<div class='fc_modifiers_parentdiv'><div class='fc_modifiers_outerdiv' id='em_fc_modifiers_outerdiv" + count + "' onclick='EMModifersList(" + count + ");'> </div>" +
                        			    "<div class='fc_modifiers_innerdiv' id='em_fc_modifiers_innerdiv" + count + "' style='background-color:#ffffff;font-size:1em;'>" +
                        			    "<select multiple='multiple' size='3' id='em_list-" + count + "' class='em_fc_modifiersList' onchange='enableBtn();'>");
                            for (var j = 0, jl = recordData.EM_MOD.length; j < jl; j++)
                            {
                                jsHTML.push("<option class='lt' value='" + recordData.EM_MOD[j].CD + "'>" + recordData.EM_MOD[j].DISP + "</option>");
                                hmap[recordData.EM_MOD[j].CD] = recordData.EM_MOD[j].DISP;
                            }
                            jsHTML.push("</select></div></div></td>");
                            jsHTML.push("</tr>");
                            count++;
                            jsHTML.push("</table></div></div>");
                        }
                        else
                        {
                            component.setEMModInd(false);
                            jsHTML.push("<div id='sc-charges-div'><TABLE id='tblSC'>" +
						    "<thead id='theadSC' class='ch-sub-sec'>" +
						    "<tr><th colspan='2' class='tbl_header'><h3 class='txt_header'>" + panelList[0].getElementsByTagName("Name")[0].childNodes[0].nodeValue + "</h3></th></tr>" +
						    "<tr><th id='fc_cpt' class='fc_cpt_withoutModifiers'>" + i18n.CPT + "</th> <th id='fc_units' class='fc_units_withoutModifiers'>" + i18n.UNITS + "</th>" +
						    "</tr></thead></TABLE><div id='em_fc_tbody'><table id='em_table'>");
                            var count = 0;
                            var zebraStripping = count % 2 === 0 ? "odd" : "even";
                            jsHTML.push("<tr id = 'row_" + count + "' class='row_" + zebraStripping + "'>" +
                        		    "<td class='fc_cpt_withoutModifiers'>" + CERN_VISITTYPES_O1.GetSelectedOptions() +
                        		    "</td><td class='fc_units_withoutModifiers'>1</td></tr>");
                            count++;
                            jsHTML.push("</table></div></div>");
                        }
                    }
                }
                if (infusionInjection && (proc.length > -1))
                {
                    if (recordData.II_MOD.length)
                    {
                        component.setIIModInd(true);
                        jsHTML.push("<div id='sc_infusion_div'><TABLE id='tblSC'>" +
								"<thead id='theadSC' class='ch-sub-sec'>" +
								"<tr><th colspan='4' class='tbl_header'><h3 class='txt_header'>" + panelList[0].getElementsByTagName("Name")[1].childNodes[0].nodeValue + "</h3></th></tr>" +
								"<tr><th id='fc_cpt' class='fc_cpt_withModifiers'>" + i18n.CPT + "</th> <th id='fc_units' class='fc_units_withModifiers' >" + i18n.UNITS + "</th>");
                        jsHTML.push("<th id='fc_modifiers' class='fc_modifiers' style='border:1px solid #F6F6F6;'>" + i18n.MODIFIERS + "</th>");
                        jsHTML.push("</tr></thead></TABLE><div id='ii_fc_tbody'><table id='ii_table'>");
                        var count = 0;
                        for (var i = 0, il = proc.length; i < il; i++)
                        {
                            var zebraStripping = count % 2 === 0 ? "odd" : "even";
                            if (proc[i].getElementsByTagName("Source")[0].childNodes[0].nodeValue === "IV")
                            {
                                jsHTML.push("<tr id = 'row_" + count + "' class='row_" + zebraStripping + "'>" +
											  "<td class='fc_cpt_withModifiers'>" + proc[i].getElementsByTagName("CPT")[0].childNodes[0].nodeValue + " - " + proc[i].getElementsByTagName("CPTDescription")[0].childNodes[0].nodeValue +
											  "</td><td class='fc_units_withModifiers'>" + proc[i].getElementsByTagName("Units")[0].childNodes[0].nodeValue + "</td>");
                                jsHTML.push("<td class='fc_modifiers' id='ii_fc_modifiers" + count + "'><span id='ii_modvalues" + count + "' style='font-size:1em;'></span>" +
													"<div class='fc_modifiers_parentdiv'><div class='fc_modifiers_outerdiv' id='ii_fc_modifiers_outerdiv" + count + "' onclick='IIModifersList(" + count + ");'> </div>" +
													"<div class='fc_modifiers_innerdiv' id='ii_fc_modifiers_innerdiv" + count + "' style='background-color:#ffffff;font-size:1em;'>" +
													"<select multiple='multiple' size='3' id='ii_list-" + count + "' class='ii_fc_modifiersList' onchange='enableBtn();'>");
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
								"<tr><th colspan='2' class='tbl_header'><h3 class='txt_header'>" + panelList[0].getElementsByTagName("Name")[1].childNodes[0].nodeValue + "</h3></th></tr>" +
								"<tr><th id='fc_cpt' class='fc_cpt_withoutModifiers'>" + i18n.CPT + "</th> <th id='fc_units' class='fc_units_withoutModifiers' >" + i18n.UNITS + "</th>");
                        jsHTML.push("</tr></thead></TABLE><div id='ii_fc_tbody'><table id='ii_table'>");
                        var count = 0;
                        for (var i = 0, il = proc.length; i < il; i++)
                        {
                            if (proc[i].getElementsByTagName("Source")[0].childNodes[0].nodeValue === "IV")
                            {
                                var zebraStripping = count % 2 === 0 ? "odd" : "even";
                                jsHTML.push("<tr id = 'row_" + count + "' class='row_" + zebraStripping + "'>" +
											"<td class='fc_cpt_withoutModifiers'>" + proc[i].getElementsByTagName("CPT")[0].childNodes[0].nodeValue + " - " + proc[i].getElementsByTagName("CPTDescription")[0].childNodes[0].nodeValue +
											"</td><td class='fc_units_withoutModifiers'>" + proc[i].getElementsByTagName("Units")[0].childNodes[0].nodeValue + "</td></tr>");
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

/******************************************Modifiers E&M***********************************************/
var j;
$('#em_table tbody tr td').live('mouseover', function ()
{
    var i = (this.id).substr(15);
    j = parseInt(i);
    $('#em_fc_modifiers_outerdiv' + j).show();
    $('#em_modvalues' + j).css('display', 'none');
});

function EMModifersList(k)
{
    var e = jQuery.Event("click");
    e.preventDefault();
    $('.em_fc_modifiersList').css('z-index', '10000');
    $('#em_fc_modifiers_innerdiv' + k).slideToggle('fast');
}

$('#em_table tbody tr td').live('mouseleave', function ()
{
    var i = (this.id).substr(15);
    j = parseInt(i);
    $('#em_fc_modifiers_innerdiv' + j).hide();
    $('#em_fc_modifiers_outerdiv' + j).hide();
    $('#em_modvalues' + j).css('display', 'inline-block');
});

$('.em_fc_modifiersList').live('mouseleave', function ()
{
    $('#em_fc_modifiers_innerdiv' + j).hide();
    $('#em_fc_modifiers_outerdiv' + j).hide();
    flag = false;
});

$('.em_fc_modifiersList').live('mouseover', function ()
{

    $('#em_fc_modifiers_outerdiv' + j).show();
    $('#em_fc_modifiers_innerdiv' + j).show();
});
$('.em_fc_modifiersList').live('mouseover', function ()
{
    $('#em_list-' + j).click(function ()
    {
        if (!$('#em_list-' + j).val())
        {
            $('#em_fc_modifiers_outerdiv' + j).html('');
            $('#em_modvalues' + j).html('');
        }
        else
        {
            var codeValue = $('#em_list-' + j).val().toString().split(',');
            var dispValue = "";
            var retValue = "";
            for (var i = 0; i < codeValue.length; i++)
            {
                for (var key in hmap)
                {
                    /* do something with key and hmap[key] */
                    retValue = hmap[codeValue[i]];
                }
                dispValue = dispValue + retValue;
                if (i < codeValue.length - 1)
                    dispValue = dispValue + ",";
            }
            $('#em_modvalues' + j).html("" + dispValue + "");
            $('#em_fc_modifiers_outerdiv' + j).html("" + dispValue + "");
        }
    });
});

/**********************************************Modifiers I&I*********************************************************/

var m;
$('#ii_table tbody tr td').live('mouseover', function ()
{
    var m = (this.id).substr(15);
    n = parseInt(m);
    $('#ii_fc_modifiers_outerdiv' + n).show();
    $('#ii_modvalues' + n).css('display', 'none');
});

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

$('#ii_table tbody tr td').live('mouseleave', function ()
{
    var m = (this.id).substr(15);
    n = parseInt(m);
    $('#ii_fc_modifiers_innerdiv' + n).hide();
    $('#ii_fc_modifiers_outerdiv' + n).hide();
    $('#ii_modvalues' + n).css('display', 'inline-block');
});

$('.ii_fc_modifiersList').live('mouseleave', function ()
{
    $('#ii_fc_modifiers_innerdiv' + n).hide();
    $('#ii_fc_modifiers_outerdiv' + n).hide();
    flag = false;
});

$('.ii_fc_modifiersList').live('mouseover', function ()
{
    $('#ii_fc_modifiers_outerdiv' + n).show();
    $('#ii_fc_modifiers_innerdiv' + n).show();
});
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

/**********************************************************************************************/
function enableBtn()
{
    if (m_iiSubmitCharges)
        $('#submitCharges').attr("disabled", false);
}/**
* Project: infusion_injection.js
* Version 1.0.0
*/
function InjectionInfusionComponentStyle()
{
    this.initByNamespace("ii");
}

InjectionInfusionComponentStyle.inherits(ComponentStyle);

function InjectionInfusionComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new InjectionInfusionComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.INJECTIONINFUSION.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.INJECTIONINFUSION.O1 - render component");
    this.setIncludeLineNumber(false);
    this.setScope(2);
    this.setDisplay(true);
    this.automateMedication = false;

    InjectionInfusionComponent.method("InsertData", function ()
    {
        CERN_INFUSIONINJECTION_O1.GetInjectionInfusionTable(this);
    });
    InjectionInfusionComponent.method("HandleSuccess", function (recordData)
    {

        CERN_INFUSIONINJECTION_O1.CreateInfusionPanel(this, recordData);
    });

    InjectionInfusionComponent.method("setInjectInfuse", function (value)
    {
        infusionInjection = value;
    });

    InjectionInfusionComponent.method("setMedfromMAR", function (value)
    {
        this.automateMedication = value;
    });

    InjectionInfusionComponent.method("getMedfromMAR", function ()
    {
        return (this.automateMedication);
    });
    InjectionInfusionComponent.method("setSiteCodes", function (value)
    {
        this.m_siteCodes = value;
    });
    InjectionInfusionComponent.method("getSiteCodes", function ()
    {
        if (this.m_siteCodes != null)
            return this.m_siteCodes;
    });
    InjectionInfusionComponent.method("setMARModifyTypeInd", function (value)
    {
        m_iiMARModifyType = value;
    });
    InjectionInfusionComponent.method("setMARDeleteInd", function (value)
    {
        m_iiMARDelete = value;
    });
    InjectionInfusionComponent.method("setMARSiteInd", function (value)
    {
        m_iiMARSite = value;
    });
}

InjectionInfusionComponent.inherits(MPageComponent);
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
    var hmap = new Array();
    var marInd = false;
    var tableCellID = 0;

    function PopulateTypeDialog(tHTML)
    {
        /* Populate Type combo*/
        var dispName = "", valueId = "", nodDisp = "", nodValue = "";
        var comp = m_xmlDoc.getElementsByTagName("Component");
        var typeHTML = "<div id='comboType'><select name='medType' class='comboTypeOpt'><option value='ChooseType'>" + i18n.CHOOSE_TYPE + "</option>";
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
                                typeHTML = typeHTML + "<option value='" + nodValue + "'>" + nodValue + "</option>"
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
    
    function PopulateSiteDialog(recordData)
    {
        var sites = recordData.SITE,
            numOfSites = sites.length,
            currSite = 0;
        var typeHTML = "<div id='comboSite'><select name='medType1' class='comboSiteOpt'><option value='ChooseSite'>" + i18n.CHOOSE_SITE + "</option>";
        for (; currSite < numOfSites; currSite++) {
            typeHTML = typeHTML + "<option value='" + sites[currSite].CD + "'>" + sites[currSite].DISP + "</option>";
        }
        
        typeHTML += "</select></div>";
        $(typeHTML).appendTo('body');
    }

    function validateSave()
    {
        var bReturn = true;
        var theSel, the, vtime, vidx;
        theSel = this.document.getElementById('combodiv');
        the = theSel.selectedIndex;
        if (the == 0)
        {
            alert(i18n.SELECT_SITE);
            this.document.getElementById('combodiv').focus();
            return (false);
        }

        if (document.getElementsByName('inf_type')[0].checked == false &&
		document.getElementsByName('inf_type')[1].checked == false &&
		document.getElementsByName('inf_type')[2].checked == false &&
		document.getElementsByName('inf_type')[3].checked == false &&
		document.getElementsByName('inf_type')[4].checked == false)
        {
            alert(i18n.SELECT_TYPE);
            document.getElementsByName('inf_type')[0].focus();
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
                alert(i18n.FILL_OUT_STOP_DATE);
                this.document.getElementById('fc_stop_date_cal').focus();
                return (false);
            }
        }
        if (document.getElementById('fc_stop_time').disabled == false)
        {
            vtime = document.getElementById('fc_stop_time').value;
            vidx = vtime.indexOf('*');
            if (vidx > -1)
            {
                alert(i18n.FILL_OUT_STOP_TIME);
                this.document.getElementById('fc_stop_time').focus();
                return (false);
            }
        }

        var dtArrive = new Date(adt + " " + atm);
        var dtDischarge = new Date(cdt + " " + ctm);
        var dtStart = new Date(document.getElementById('fc_date_cal').value + " " + document.getElementById('fc_time').value);
        var dtStop = new Date(document.getElementById('fc_stop_date_cal').value + " " + document.getElementById('fc_stop_time').value);
        var dtCurrent = new Date();

        if (document.getElementsByName('inf_type')[0].checked || document.getElementsByName('inf_type')[1].checked)
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
    *	to initilize all the events,
    */


    $(document).ready(function ()
    {
        var eventflag = false;
        var overlayActive_ind = false,
            $overlay = $("<div class='fn-clear-overlay'></div>");


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
        function closeSelects (){
            $(".comboTypeOpt,.comboSiteOpt").css('visibility', 'hidden');
            removeOverlay();
        }

        function addOverlay (){
            if (!overlayActive_ind) {
            $("body").append($overlay);
            $(".fn-clear-overlay").live("click", function (){
                closeSelects();
            });
            overlayActive_ind = true;
            }
        }

        function removeOverlay(){
            if (overlayActive_ind) {
                $overlay.die();
                $overlay = $overlay.detach();
                overlayActive_ind = false;
            }
        }
        $('td').live('mouseenter', function ()
        {
            if (this.className === 'fc_type' || this.className === 'fc_number')
            {
                var offset = $(this).offset(),
                    $comboObj = this.className === 'fc_type' ? $(".comboTypeOpt") : $(".comboSiteOpt");

                if ($comboObj.length) {
                    tableCellID = this.id;
                    $comboObj.css({
                        "top": offset.top,
                        "left": offset.left,
                        "height": this.clientHeight,
                        "width": this.clientWidth,
                        "position": "absolute",
                        "visibility": "visible",
                        "font-size": '12px',
                        "z-index": 10
                    });
                }
            }
            else
            {
                closeSelects();
            }
        });

	    $('#fc_infusion_area').live('mouseleave', closeSelects);

        $('.comboTypeOpt, .comboSiteOpt').live('mouseenter', function () {
            $(this).css('visibility', 'visible');
        });
        $('.comboTypeOpt, .comboSiteOpt').live('focus', addOverlay);

        $('.comboTypeOpt,.comboSiteOpt').live("change", function ()
        {
            var $comboObj = $(this);
            var dispValue = $comboObj.hasClass('comboTypeOpt') ? 'ChooseType' : 'ChooseSite';
            var dispVal = $comboObj.find("option:selected").val();
            var dispText = $comboObj.find("option:selected").text();
            if (dispVal !== dispValue) {
                $("#" + tableCellID).text(dispText);
                $comboObj.val(dispValue);
                tableCellID = 0;
                closeSelects();
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
        GetInjectionInfusionTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            var siteCodes = component.getSiteCodes();
            var site_cds = MP_Util.CreateParamArray(siteCodes, 1);
            var marIndicator = component.getMedfromMAR() === true ? 1 : 0;
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", marIndicator, site_cds, m_CodingMPageFlag);
            MP_Core.XMLCclRequestWrapper(component, "fnmp_get_infusion_injection", sendAr, true);
            logII = "fnmp_get_infusion_injection:" + sendAr.join(",");
        },
        /* Infusion and Injection Panel */
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
                    jsHTML.push("<div id='infusionDiv'>");
                    jsHTML.push("<div id='infusionLeftDiv'>");
                    jsHTML.push("<dl><dt><span class='fc_site'>" + i18n.SITE + "</span></dt><dd></dd>" +
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
                                        jsHTML.push("</select></dd></dl></div>" +
														"<div id='infusionCenterDiv'><span class='inf_label'>" + i18n.TYPE + "</span>");
                                        Disp = item[ch].getElementsByTagName("Disp");
                                        Value = item[ch].getElementsByTagName("ValueId");

                                        for (id = 0; id < Disp.length; id++)
                                        {
                                            nodDisp = Disp[id].childNodes[0].nodeValue;
                                            nodValue = Value[id].childNodes[0].nodeValue;
                                            if (id == 0)
                                            {
                                                jsHTML.push("<dl><dt></dt>" +
																"<dd><input type='radio' name='inf_type' checked='true' value='" + nodDisp + "' id='" + nodValue + "'>" + nodDisp + "</input></dd></dl>");
                                                radioType = nodDisp;
                                            }
                                            else
                                                jsHTML.push("<dl><dt></dt>" +
																"<dd><input type='radio' name='inf_type' value='" + nodDisp + "' id='" + nodValue + "'>" + nodDisp + "</input></dd></dl>");
                                        }
                                        break;
                                    default:
                                        //do nothing
                                }
                            }
                        }
                    }
                    jsHTML.push("</div><div id='infusionRightDiv'>" +
								"<dl class = 'fc-med'><dt><span>" + i18n.MEDICATION + "</span></dt><dd></dd>" +
								"<dt><input type='text' class='search-box' id='" + compNs + "contentCtrl" + compId + "'/></dt><dd></dd></dl>" +
								"<dl class='fc-result'><dt></dt><dd class='fc-start'><span>" + i18n.INFUSION_START_TIME + "</span></dd>" +
								"<dt></dt><dd class='fc-stop'><span >" + i18n.INFUSION_STOP_TIME + "</span></dd></dl>" +

								"<dl class='fc-result'><dt></dt><dd class='fc-start'><input title='" + i18n.INFUSION_START_TIME + "' id='fc_date_cal' value='**/**/****' onkeydown='javascript:validate_date(this);' />" +
								"<span class='spR'>&nbsp;</span>" +
								"<span><img src='" + imgCal + "' class='fc_img' id='fc_date_cal_id' onClick = " + par + "></span> <span id='fcOSdate' class='spR'></span>" +
								"<input type='text' maxlength='5' id='fc_time' value='**:**' onkeydown='javascript:validate_time(this);' /></dd>" +

								"<dd class='fc-stop'><input title='" + i18n.INFUSION_STOP_TIME + "' id='fc_stop_date_cal' value='**/**/****' onkeydown='javascript:validate_date(this);' /><span class='spR'>&nbsp;</span>" +
								"<span><img src='" + imgCal + "'  class='fc_img' id='fc_stop_date_cal_id' onclick=" + par1 + "></span> <span id='fcStopdate' class='spR'></span>" +
								"<input type='text' maxlength='5' id='fc_stop_time' value='**:**' onkeydown='javascript:validate_time(this);'/></dd<dl>");

                    jsHTML.push("<div class='fc-button'><button  class='ii_button' id='addButton' onclick='javascript:CERN_INFUSIONINJECTION_O1.Save();'>" +
								"<span id='saveId'>" + i18n.ADD + "</span></button>" +
								"<span>&nbsp;</span>" +
								"<button  class='ii_button' id='cancelButton'><span id='cancelId'>" + i18n.CANCEL + "</span></button></div>");
                    jsHTML.push("</div></div>");
                }

                jsHTML.push("<div id='fc_infusion_area'>" +
				"<table id ='infusion_tbl_th'><thead><tr> ");
                if (component.getMedfromMAR() && m_iiMARDelete)
                {
                    jsHTML.push("<th class='fc_del_opt' style='border-right:none;'>&nbsp;</th>");
                }
                jsHTML.push("<th class='fc_number' >" + i18n.SITE + "</th> <th class='fc_medication'>" + i18n.MEDICATION + "</th>" +
							"<th class='fc_type'>" + i18n.TYPE + "</th><th class='fc_duration'>" + i18n.DURATION + "</th>" +
							"<th class='fc_start_date'>" + i18n.CHARGES_START + "</th>" +
							"<th class='fc_stop_date' style='border-right:1px solid #F6F6F6;'>" + i18n.CHARGES_STOP + "</th></tr></thead></table>");
                jsHTML.push("<div id='fc_infusion_tbody'><table id='infusion_tbl'>");

                jsHTML.push("</table></div></div>");

                seHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(seHTML, component, countText);


                CERN_INFUSIONINJECTION_O1.SetMARInd(component);

                if (component.getMedfromMAR())
                {
                    CERN_INFUSIONINJECTION_O1.GetInfusionData(recordData);
                    $('#fc_infusion_area').css({ 'height': '97%' });
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

                }
                //return (seHTML);
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
        },

        CancelAddNew: function ()
        {
            var globalNumber = JsDatePick.getGlobalNumber();
            if (globalNumber)
            {
                var gRef = JsDatePick.getCalInstanceById(globalNumber);
                gRef.closeCalendar();
            }
            CERN_INFUSIONINJECTION_O1.Reset();
        },

        /*Calender object is created with following parameter passed*/
        DateTimePicker: function (fieldId)
        {
            var showField = fieldId + "_id";
            var zIndex = 110017

            if (showField === "fc_stop_date_cal_id")
                zIndex = 110015;

            new JsDatePick({ useMode: 2, target: fieldId, dateFormat: "%m/%d/%Y", cellColorScheme: "armygreen", imgPath: m_staticContent + "\\images\\", showpopfield: showField, index: zIndex });
        },

        DeleteRow: function (thisId)
        {
            $("#" + thisId).remove();
            CERN_INFUSIONINJECTION_O1.ResetZibraStripping();
            prevRowId = "";
        },

        /*Adding the details enetered in the Add New section to I&I table*/
        Save: function ()
        {
            if (validateSave() == false)
            {
                return;
            }
            else
            {
                if (saveFlag == 1)
                {
                    var zebraStripping = totalRowsCount % 2 === 0 ? "odd" : "even";
                    var radios = document.getElementsByTagName('input');
                    var typeValue;
                    for (var i = 0; i < radios.length; i++)
                    {
                        if (radios[i].type === 'radio' && radios[i].checked)
                        {
                            // get value, set checked flag or do whatever you need to
                            typeValue = radios[i].id;
                        }
                    }
                    var startDate = _g('fc_date_cal').value;
                    var stopDate = _g('fc_stop_date_cal').value;
                    var startTime = _g('fc_time').value;
                    var stopTime = _g('fc_stop_time').value;
		    var med = _g(compNs + "contentCtrl" + compId).value;
		    var alias = med;
                    var site = "";
                    for (var key in hmap)
                    {
                        /* do something with key and hmap[key] */
                        site = hmap[_g('combodiv').value];
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
                                       "<td class='fc_number'>" + site + "</td>" +
                                       "<td class='fc_medication'>" + med + "</td>" +
                                       "<td class='fc_type'>" + typeValue + "</td>" +
                                       "<td class='fc_duration'>" + CERN_INFUSIONINJECTION_O1.GetDuration() + "</td>" +
                                       "<td class='fc_start_date'>" + startDate + " " + startTime + "</td>" +
                                       "<td class='fc_stop_date'>" + stopDate + " " + stopTime + "</td>" +
                                       "<td style='display:none;'>" + _g('combodiv').value + "</td>" +
                                       "<td style='display:none;'>" + alias + "</td>" +
                                   "</tr>");

                    $("#infusion_tbl").append(newRow);

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

        ResetZibraStripping: function ()
        {
            $("#infusion_tbl tbody tr").removeClass("row_even");
            $("#infusion_tbl tbody tr").removeClass("row_odd");
            $("#infusion_tbl tbody tr:even").addClass("row_even");
            $("#infusion_tbl tbody tr:odd").addClass("row_odd");
        },

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

        /* To reset the fields Once the Cancel button is clicked in the Add New section of I&I*/
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
            _g(compNs + "contentCtrl" + compId).value = "";
            _g('fc_date_cal').value = "**/**/****";
            _g('fc_stop_date_cal').value = "**/**/****";
            _g('fc_time').value = "**:**";
            _g('fc_stop_time').value = "**:**";

            var radios = document.getElementsByTagName('input');
            for (var i = 0; i < radios.length; i++)
            {
                if (radios[i].type === 'radio' && radios[i].value === radioType)
                {
                    radios[i].checked = true;
                    break;
                }
            }
        },

        GetDuration: function ()
        {
            var s1 = document.getElementById('fc_date_cal').value + " " + document.getElementById('fc_time').value;
            var s2 = document.getElementById('fc_stop_date_cal').value + " " + document.getElementById('fc_stop_time').value;
            var d1 = new Date(s1);
            var d2 = new Date(s2);
            var diff = Math.ceil((d2.getTime() - d1.getTime()) / (mins));
            return (diff);
        },

        /*Once the row is selected in the I&I table, row details are populated in the Add New section*/
        PopulateValues: function (rowId)
        {
            var currowindex = rowId;
            var tObj = document.getElementById('infusion_tbl');
            if (tObj.rows[currowindex].cells[0].innerHTML === "" || tObj.rows[currowindex].cells[0].innerHTML === undefined)
            {
                document.getElementById('combodiv').selectedIndex = 0;
            } else
            {
                document.getElementById('combodiv').selectedIndex = setSite(tObj.rows[currowindex].cells[0].innerHTML);
            }

            switch (tObj.rows[currowindex].cells[2].innerHTML)
            {
                case "HYDRATION":
                    document.getElementById('HYDRATION').checked = true;
                    break;
                case "INFUSION":
                    document.getElementById('INFUSION').checked = true;
                    break;
                case "INJECTION":
                    document.getElementById('INJECTION').checked = true;
                    break;
                case "IMSQ":
                    document.getElementById('IMSQ').checked = true;
                    break;
                case "INTRAARTERIALINJECTION":
                    document.getElementById('INTRAARTERIALINJECTION').checked = true;
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
                document.getElementById('fc_time').value = "**/**";
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
                document.getElementById('fc_stop_time').value = "**/**";
            }


            var s = tObj.rows[currowindex].cells[1].innerHTML;
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

        /*Updating the row selected in the I&I table*/
        UpdateRow: function (tbody, idx)
        {
            var tObj = document.getElementById(tbody);
            var row = tObj.rows[idx];
            var myType = "n/a";
            var myType = "n/a";
            var myStart = document.getElementById('fc_date_cal').value + " " + document.getElementById('fc_time').value;
            var myEnd = document.getElementById('fc_stop_date_cal').value + " " + document.getElementById('fc_stop_time').value;
            var myMed = document.getElementById(compNs + "contentCtrl" + compId).value;
            var myAlias = myMed;
            var myDur = CERN_INFUSIONINJECTION_O1.GetDuration();
            var mySite = document.getElementById('combodiv').value;
            var site = "";
            for (var key in hmap)
            {
                /* do something with key and hmap[key] */
                site = hmap[mySite];
            }
            row.idx = document.getElementById('combodiv').selectedIndex;
            if (document.getElementById('HYDRATION').checked == true)
            {
                myType = "HYDRATION";
            }
            else if (document.getElementById('INFUSION').checked == true)
            {
                myType = "INFUSION";
            }
            else if (document.getElementById('INJECTION').checked == true)
            {
                myType = "INJECTION";
            }
            else if (document.getElementById('IMSQ').checked == true)
            {
                myType = "IMSQ";
            }
            else if (document.getElementById('INTRAARTERIALINJECTION').checked == true)
            {
                myType = "INTRAARTERIALINJECTION";
            }
            row.cells[0].innerHTML = site;
            row.cells[1].innerHTML = myMed;
            row.cells[2].innerHTML = myType;
            row.cells[3].innerHTML = myDur;
            row.cells[4].innerHTML = myStart;
            row.cells[5].innerHTML = myEnd;
            row.cells[6].innerHTML = mySite;
            row.cells[7].innerHTML = myAlias;
        },

        /*Script call to return the medications based on the text entered in the med search text box */
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

            sPrgNam = "fnmp_search_ii_meds";
            sPara = "^MINE^, ^" + searchPhrase + "*^," + limit;

            xhr.open('GET', sPrgNam);
            xhr.send(sPara);
        },
        HandleSelection: function (suggestionObj, textBox, component)
        {
            textBox.value = suggestionObj.DRUGNAME;
            //Here add the logic to add Medication to the row in the medication table
        },
        CreateSuggestionLine: function (suggestionObj, searchVal)
        {
            return CERN_INFUSIONINJECTION_O1.HighlightValue(suggestionObj.DRUGNAME, searchVal);
        },
        /**
        * Highlight specific portions of a string for display purposes
        * @param {string} inString : The string to be highlighted
        * @param {string] term : The string to highlight
        * @return {string} outString : The string highlighted using HTML tags
        */
        HighlightValue: function (inString, term)
        {
            return "<strong class='highlight'>" + inString.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong class='highlight'>") + "</strong>";
        },

        /* To refresh the Infustion and Injection table */
        Refresh: function ()
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
            var marIndicator = component.getMedfromMAR() === true ? 1 : 0;
            sendAr.push("^MINE^", component.criterion.person_id + ".0", component.criterion.encntr_id + ".0", marIndicator, site_cds, m_CodingMPageFlag);
            logII = "fnmp_get_infusion_injection:" + sendAr.join(",");
            var req = new MP_Core.ScriptRequest(component, "");
            req.setProgramName("fnmp_get_infusion_injection");
            req.setParameters(sendAr);
            req.setAsync(true);
            MP_Core.XMLCCLRequestCallBack(component, req, function (reply)
            {
                var check1 = reply.getError();
                var recordData = reply.getResponse();
                if (check1 === "")
                {
                    CERN_INFUSIONINJECTION_O1.GetInfusionData(recordData);
                }
            });

        },
        GetInfusionData: function (recordData)
        {
            var dtStart = new Date();
            var dtStop = new Date();
            var startDisplay = "";
            var stopDisplay = "";
            var startValue = "";
            var stopValue = "";
            var start_iso = "";
            var stop_iso = "";
            var deleteOpt = "";
            var diff = "";
            var alias = "";
            if (CERN_INFUSIONINJECTION_O1.GetMARInd() && m_iiMARModifyType)
            {
                PopulateTypeDialog();
            }
            if (CERN_INFUSIONINJECTION_O1.GetMARInd() && m_iiMARSite)
            {
                PopulateSiteDialog(recordData);
            }
            for (var j = 0, jl = recordData.MEDICATIONS.length; j < jl; j++)
            {
                startDisplay = "";
                stopDisplay = "";
                startValue = "";
                stopValue = "";
                start_iso = "";
                stop_iso = "";
                diff = "";
                deleteOpt = "";

                if (recordData.MEDICATIONS[j].STARTDATETIME !== "")
                {
                    startValue = recordData.MEDICATIONS[j].STARTDATETIME;
                    dtStart.setISO8601(startValue);
                    startDisplay = dtStart.format("longDateTime3");

                    start_iso = recordData.MEDICATIONS[j].START_ISO;
                    if (start_iso.length === 0) //the service layer is not utilizing iso format
                    {
                        startValue = startDisplay;
                    }
                }

                if (recordData.MEDICATIONS[j].STOPDATETIME !== "")
                {
                    stopValue = recordData.MEDICATIONS[j].STOPDATETIME;
                    dtStop.setISO8601(stopValue);
                    stopDisplay = dtStop.format("longDateTime3");

                    stop_iso = recordData.MEDICATIONS[j].STOP_ISO;
                    if (stop_iso.length === 0) //the service layer is not utilizing iso format
                    {
                        stopValue = stopDisplay;
                    }
                }
			
                if (stopDisplay !== "" && startDisplay !== "")
                {
                    diff = Math.ceil(((new Date(stopDisplay).getTime()) - (new Date(startDisplay).getTime())) / (mins));
                }
                if (recordData.MEDICATIONS[j].ALIAS != undefined)
                {
                    alias = recordData.MEDICATIONS[j].ALIAS;
                }
				
                var zebraStripping = j % 2 === 0 ? "odd" : "even";
                if (CERN_INFUSIONINJECTION_O1.GetMARInd() && m_iiMARDelete)
                {
                    deleteOpt = "<td class='fc-del'><SPAN class='fc-info-del'>&nbsp;</SPAN></td>";
                }

                var newRow = $("<tr id = 'row_" + j + "' class='row_" + zebraStripping + "'>" + deleteOpt +
                                    "<td class='fc_number' id='comboSite" + j + "'>" + recordData.MEDICATIONS[j].SITE + "</td>" +
                                    "<td class='fc_medication'>" + recordData.MEDICATIONS[j].NAME  + "</td>" +
                                    "<td class='fc_type' id='comboType" + j + "'>" + recordData.MEDICATIONS[j].TYPE + "</td>" +
                                    "<td class='fc_duration'>" + diff + "</td>" +
                                    "<td class='fc_start_date'>" + startDisplay + "</td>" +
                                    "<td class='fc_stop_date'>" + stopDisplay + "</td>" +
                                    "<td style='display:none;'>" + 0 + "</td>" +
                                    "<td style='display:none;'>" + alias + "</td>" +
                                    "<td style='display:none;'>" + startValue + "</td>" +
                                    "<td style='display:none;'>" + stopValue + "</td>" +
                               "</tr>");
                $("#infusion_tbl").append(newRow);
                totalRowsCount = totalRowsCount + 1;
            }

        },
        SetMARInd: function (component)
        {
            marInd = component.getMedfromMAR();
        },
        GetMARInd: function ()
        {
            return marInd;
        },
        GetInfusionDataFromXML: function ()
        {
            var injectionData = m_savedXML.getElementsByTagName('IV');
            if (injectionData.length > 0)
            {
                for (i = 0; i < injectionData.length; i++)
                {
                    var disp = injectionData[i];
                    var dtStart = new Date();
                    var dtStop = new Date();
                    var startDisplay = "";
                    var stopDisplay = "";
                    var startValue = "";
                    var stopValue = "";
                    var alias = "";
                    var diff = 0;
                    					
                    if (disp.getElementsByTagName('StartDateTime')[0].firstChild)
                    {
                        startValue = disp.getElementsByTagName('StartDateTime')[0].childNodes[0].nodeValue;
                        if (startValue.length === 20) //this is an ISO value
                        {
                            dtStart.setISO8601(startValue);
                            startDisplay = dtStart.format("longDateTime3");
                        }
                        else //regular format
                        {
                            startDisplay = startValue;
                        }
                    }
                    if (disp.getElementsByTagName('StopDateTime')[0].firstChild)
                    {
                        stopValue = disp.getElementsByTagName('StopDateTime')[0].childNodes[0].nodeValue;
                        if (stopValue.length === 20) //this is an ISO value
                        {
                            dtStop.setISO8601(stopValue);
                            stopDisplay = dtStop.format("longDateTime3");
                        }
                        else //regular format
                        {
                            stopDisplay = stopValue;
                        }
                    }
					
                    if (stopDisplay !== "" && startDisplay !== "")
                    {
                        diff = Math.ceil(((new Date(stopDisplay).getTime()) - (new Date(startDisplay).getTime())) / (mins));
                    }
					
                    var aliasXml = disp.getElementsByTagName('Medication')[0].getElementsByTagName('Alias');
                    if ((aliasXml.length != 0) && (aliasXml[0].firstChild))
                            alias = aliasXml[0].childNodes[0].nodeValue;

                    var zebraStripping = i % 2 === 0 ? "odd" : "even";
                    var newRow = $("<tr id = 'row_" + i + "' class='row_" + zebraStripping + "'>" +
                                       "<td class='fc_number'>" + disp.getElementsByTagName('IVSite')[0].childNodes[0].nodeValue + "</td>" +
                                       "<td class='fc_medication'>" + disp.getElementsByTagName('Medication')[0].getElementsByTagName('Name')[0].childNodes[0].nodeValue + "</td>" +
                                       "<td class='fc_type'>" + disp.getElementsByTagName('IVType')[0].childNodes[0].nodeValue + "</td>" +
                                       "<td class='fc_duration'>" + diff + "</td>" +
                                       "<td class='fc_start_date'>" + startDisplay + "</td>" +
                                       "<td class='fc_stop_date'>" + stopDisplay + "</td>" +
                                       "<td style='display:none;'>" + 0 + "</td>" +
                                       "<td style='display:none;'>" + alias + "</td>" +
                                       "<td style='display:none;'>" + startValue + "</td>" +
                                       "<td style='display:none;'>" + stopValue + "</td>" +
                                   "</tr>");
                    $("#infusion_tbl").append(newRow);
                    totalRowsCount = totalRowsCount + 1;
                }
            }
        },
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

                if (evaluationManagement && m_StdVisitType && (property.current === 1))
                {
                    var components = m_Mpage.getComponents();
                    for (var y = 0, yl = components.length; y < yl; y++)
                    {
                        if (components[y] instanceof PresentingProblemsComponent)
                        {
                            var ppRequired = m_xmlPresentingProblem.getElementsByTagName('Item');
                            var compNs = components[y].getStyles().getNameSpace();
                            var compId = components[y].getComponentId();
                            if (ppRequired.length == 0)
                            {
                                alert(i18n.PRESENTING_PROBLEM_ALERT);
                                if (_g(compNs + "contentCtrl" + compId).visible)
                                {
                                    _g(compNs + "contentCtrl" + compId).focus();
                                }
                                return false;
                            }
                        }
                        if ((components[y] instanceof CriticalCareComponent) && _g(CERN_CRITICALCARE_O1.GetSelectedOption()))
                        {
                            if ((_g('cc-min').value === '') && (CERN_CRITICALCARE_O1.GetSelectedOption() > 0))
                            {
                                _g('cc-min').style.background = "#E77471";
                                _g('cc-min').focus();
                                return false;
                            } else if (_g('cc-min').value != '')
                            {
                                if (!CERN_CRITICALCARE_O1.ValidateCrMinutes())
                                {
                                    return false;
                                }
                            }

                        }
                    }
                }
                if ($('.jqw-next').hasClass('cal-charges'))
                {
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
                            if (additionalCharges)
                            {
                                $('.jqw-next', item).text(i18n.ADDITIONAL_CHARGES);
                                if (m_iiSubmitCharges)
                                    $('.submitCharges', item).show();
                                $('.jqw-previous', item).show();
                                loadnext(property.current, property.current + 1, item, property);
                            }
                            else
                            {
                                $('.jqw-next', item).hide();
                                $('.submitCharges', item).hide();
                                $('.jqw-previous', item).show();
                                loadnext(property.current, property.current + 1, item, property);
                            }
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
                        if (additionalCharges)
                        {
                            $('.jqw-next', item).text(i18n.ADDITIONAL_CHARGES);
                            if (m_iiSubmitCharges)
                                $('.submitCharges', item).show();
                            $('.jqw-previous', item).show();
                            loadnext(property.current, property.current + 1, item, property);
                        }
                        else
                        {
                            $('.jqw-next', item).hide();
                            $('.submitCharges', item).hide();
                            $('.jqw-previous', item).show();
                            loadnext(property.current, property.current + 1, item, property);
                        }
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
                case "panel-fc": /*Facility Charging */
                    if (infusionInjection == false)
                    {
                        $('.jqw-next', item).text(i18n.CALCULATE_CHARGES);
                        $('.jqw-next', item).addClass('cal-charges');
                    }
                    else
                    {
                        $('.jqw-next', item).text(i18n.NEXT);
                    }
                    $('.jqw-next', item).show();
                    $('.jqw-previous', item).hide();
                    $('.submitCharges', item).hide();
                    break;
                case "panel-inf":  /*Infusion and Injection */
                    $('.jqw-next', item).text(i18n.CALCULATE_CHARGES);
                    $('.jqw-next', item).addClass('cal-charges');
                    $('.jqw-next', item).show();
                    $('.submitCharges', item).hide();
                    if (evaluationManagement == false)
                        $('.jqw-previous', item).hide();
                    else
                        $('.jqw-previous', item).show();
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

                    if (additionalCharges)
                    {
                        $('.jqw-next', item).text(i18n.ADDITIONAL_CHARGES);

                        $('.jqw-next', item).show();
                        $('.jqw-previous', item).show();
                    } else
                    {
                        $('.jqw-next', item).hide();
                        $('.jqw-previous', item).show();
                    }
                    break;
                case "panel-addtnl":  /*Additional Charges*/
                    $('.jqw-next', item).hide();
                    $('.submitCharges', item).hide();
                    //}
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

function SubmitCharges()
{
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
                emModFlag = components[y].getEMModInd();
                iiModFlag = components[y].getIIModInd();
            }
        }
        if (emModFlag || !m_StdVisitType)
        {
            var tObj = _g('em_table');
            var rowCount = tObj.rows.length;
            var root, newel, newtext;
            var comp = m_xmlMods.getElementsByTagName("CPTs");
            for (var currowindex = 0; currowindex < rowCount; currowindex++)
            {
                newel = m_xmlMods.createElement('CPT');
                root = m_xmlMods.getElementsByTagName('CPTs');
                root[root.length - 1].appendChild(newel);

                for (c = 0; c < comp.length; c++)
                {
                    newel = m_xmlMods.createElement('Source');
                    newtext = m_xmlMods.createTextNode('EM');
                    newel.appendChild(newtext);
                    root = comp[c].getElementsByTagName('CPT');
                    root[root.length - 1].appendChild(newel);

                    var cptValue = tObj.rows[currowindex].cells[0].innerHTML;
                    if (cptValue)
                    {
                        cptValue = cptValue.split(' -');
                    }
                    newel = m_xmlMods.createElement('Value');
                    newtext = m_xmlMods.createTextNode(cptValue[0]);
                    newel.appendChild(newtext);
                    root = comp[c].getElementsByTagName('CPT');
                    root[root.length - 1].appendChild(newel);

                    if ($('#em_modvalues' + currowindex).text() !== "")
                    {
                        var modValues = $('#em_list-' + currowindex).val().toString().split(',');
                        for (i = 0; i < modValues.length; i++)
                        {
                            newel = m_xmlMods.createElement('Mod');
                            root = m_xmlMods.getElementsByTagName('CPT');
                            root[root.length - 1].appendChild(newel);

                            newel = m_xmlMods.createElement('Value');
                            newtext = m_xmlMods.createTextNode(modValues[i]);
                            newel.appendChild(newtext);
                            root = comp[c].getElementsByTagName("Mod");
                            root[root.length - 1].appendChild(newel);
                        }
                    } else
                        continue;
                }
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

                    if ($('#ii_modvalues' + currindex).text() !== "")
                    {
                        var modValues1 = $('#ii_list-' + currindex).val().toString().split(',');
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
                        }
                    } else
                        continue;
                }
            }
        }

        var txtModXML = GetStringFromXML(m_xmlMods);
        m_lynxObject.ModifierXML = txtModXML;
        m_lynxObject.SubmitCharges();

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

function CalculateCharges()
{
    var timerMPage = MP_Util.CreateTimer("CAP:FRN Lynx EPoint Integration");
    if (infusionInjection)
    {
        var m_xmltxtIVs = "<IVs></IVs>";
        m_xmlIVs.loadXML(m_xmltxtIVs);
        var updateInd = 0;
        var root, newel, newtext;
        var comp = m_xmlIVs.getElementsByTagName("IVs");

        var tObj = _g('infusion_tbl');
        var rowCount = tObj.rows.length;
        if (CERN_INFUSIONINJECTION_O1.GetMARInd() && m_iiMARDelete)
        {
            updateInd = 1;
        }

        for (var currowindex = 0; currowindex < rowCount; currowindex++)
        {
            newel = m_xmlIVs.createElement('IV');
            root = m_xmlIVs.getElementsByTagName('IVs');
            root[root.length - 1].appendChild(newel);
            //Add I&I values 
            comp = m_xmlIVs.getElementsByTagName("IVs");
            for (c = 0; c < comp.length; c++)
            {
                newel = m_xmlIVs.createElement('IVSite');
                newtext = m_xmlIVs.createTextNode(tObj.rows[currowindex].cells[(0 + updateInd)].innerHTML);
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
                newtext = m_xmlIVs.createTextNode(tObj.rows[currowindex].cells[(8 + updateInd)].innerHTML);
                newel.appendChild(newtext);
                root = comp[c].getElementsByTagName("IV");
                root[root.length - 1].appendChild(newel);

                newel = m_xmlIVs.createElement('StopDateTime');
                newtext = m_xmlIVs.createTextNode(tObj.rows[currowindex].cells[(9 + updateInd)].innerHTML);
                newel.appendChild(newtext);
                root = comp[c].getElementsByTagName("IV");
                root[root.length - 1].appendChild(newel);

                newel = m_xmlIVs.createElement('Medication');
                root = m_xmlIVs.getElementsByTagName('IV');
                root[root.length - 1].appendChild(newel);

                newel = m_xmlIVs.createElement('Name');
                newtext = m_xmlIVs.createTextNode(tObj.rows[currowindex].cells[(1 + updateInd)].innerHTML);
                newel.appendChild(newtext);
                root = comp[c].getElementsByTagName("Medication");
                root[root.length - 1].appendChild(newel);

                newel = m_xmlIVs.createElement('Alias');
                newtext = m_xmlIVs.createTextNode(tObj.rows[currowindex].cells[(7 + updateInd)].innerHTML);
                newel.appendChild(newtext);
                root = comp[c].getElementsByTagName("Medication");
                root[root.length - 1].appendChild(newel);
            }

        }
    }

    if (evaluationManagement)
    {
        var m_xmltxtVisit = "<Visit></Visit>";
        m_xmlVisit.loadXML(m_xmltxtVisit);

        if (m_StdVisitType)
        {
            var root, newel, newtext;
            var naValue;
            var amValue;
            var ccValue;
            var dValue;
            var pedValue;
            var neValue;
            var omValue = [];
            var pmValue = [];
            var type;
            var minutes;
            var coding;
            switch (m_MPageCatMean)
            {
                case "MP_CLINIC_CHARGE":
                case "MP_FACILITY_CHARGE": coding = 'F';
                    break;
                default: coding = '';
                    break;
            }
            switch (m_CodingMPageFlag)
            {
                case 1: type = 'ED';
                    break;
                case 2: type = 'OOOS';
                    break;
                default: type = '';
                    break;
            }
            var comp = m_xmlVisit.getElementsByTagName("Visit");

            var bstrVisitTxt = [];
            omValue.length = 0;
            pmValue.length = 0;

            var showPatEd;
            var showNewEstablished;
            var showArrivalMode;

            var components = m_Mpage.getComponents();
            for (var y = 0, yl = components.length; y < yl; y++)
            {
                if (components[y] instanceof NursingAssessmentComponent)
                {
                    naValue = components[y].GetSelected();
                }
                if (components[y] instanceof CriticalCareComponent)
                {
                    ccValue = components[y].GetSelected();
                    minutes = components[y].GetCrCareMinutes();
                }
                if (components[y] instanceof DispositionComponent)
                {
                    dValue = components[y].GetSelected();
                }
                if (components[y] instanceof OrderManagementComponent)
                {
                    omValue.push(components[y].GetSelected());
                }
                if (components[y] instanceof ProcessManagementComponent)
                {
                    pmValue.push(components[y].GetSelected());
                }
                try
                {
                    if (components[y] instanceof ArrivalModeComponent)
                    {
                        amValue = components[y].GetSelected();
                        showArrivalMode = 1;
                    }
                }
                catch (err)
                {
                    showArrivalMode = 0;
                }
                try
                {
                    if (components[y] instanceof PatEdComponent)
                    {
                        pedValue = components[y].GetSelected();
                        showPatEd = 1;
                    }
                }
                catch (err)
                {
                    showPatEd = 0
                }
                try
                {
                    if (components[y] instanceof NewEstablishedComponent)
                    {
                        neValue = components[y].GetSelected();
                        showNewEstablished = 1;
                    }
                }
                catch (err)
                {
                    showNewEstablished = 0
                }
            }

            if (naValue != "" && naValue > 0.0)
                bstrVisitTxt.push(naValue);
            if (omValue != "" && omValue.length > 0)
            {
                for (var x = 0; x < omValue.length; x++)
                {
                    bstrVisitTxt.push(omValue[x])
                }
            }
            if (dValue != "" && dValue > 0.0)
                bstrVisitTxt.push(dValue);
            if (pmValue != "" && pmValue.length > 0)
            {
                for (var x = 0; x < pmValue.length; x++)
                {
                    bstrVisitTxt.push(pmValue[x])
                }
            }
            if (showArrivalMode == 1 && amValue != "" && amValue > 0.0)
                bstrVisitTxt.push(amValue);
            if (showPatEd == 1 && pedValue != "" && pedValue > 0.0)
                bstrVisitTxt.push(pedValue);
            if (ccValue != "" && ccValue > 0.0)
                bstrVisitTxt.push(ccValue);

            root = m_xmlVisit.getElementsByTagName('Visit');
            var ppValue;
            for (c = 0; c < comp.length; c++)
            {
                //Add Type Value
                newel = m_xmlVisit.createElement('Coding');
                newtext = m_xmlVisit.createTextNode(coding);
                newel.appendChild(newtext);
                root[root.length - 1].appendChild(newel);

                //Add Type Value
                newel = m_xmlVisit.createElement('Type');
                newtext = m_xmlVisit.createTextNode(type);
                newel.appendChild(newtext);
                root[root.length - 1].appendChild(newel);

                if (type === 'OOOS')
                {
                    //Add CodeSet Value
                    newel = m_xmlVisit.createElement('CodeSet');
                    newtext = m_xmlVisit.createTextNode(neValue);
                    newel.appendChild(newtext);
                    root[root.length - 1].appendChild(newel);
                }

                ppValue = m_xmlPresentingProblem.getElementsByTagName('Item');
                var bDuplicate = 0;
                var LynxId = 0;
                var tmpLynxArray = new Array();
                for (i = 0; i < ppValue.length; i++)
                {
                    //Do not add duplicate lynx IDs
                    bDuplicate = 0;
                    LynxId = m_xmlPresentingProblem.getElementsByTagName('LynxID')[i].childNodes[0].nodeValue;
                    for (var j = 0; j < tmpLynxArray.length; j++)
                    {
                        if (tmpLynxArray[j] == LynxId)
                        {
                            bDuplicate = 1;
                            break;
                        }
                    }
                    if (bDuplicate == 0)
                    {
                        root = m_xmlVisit.getElementsByTagName('Visit');
                        newel = m_xmlVisit.createElement('Problem');
                        root[root.length - 1].appendChild(newel);

                        oldNode = m_xmlPresentingProblem.getElementsByTagName('LynxID')[i];
                        newNode = oldNode.cloneNode(true);
                        root = comp[0].getElementsByTagName('Problem');
                        root[root.length - 1].appendChild(newNode);
                        tmpLynxArray[tmpLynxArray.length] = LynxId;
                    }
                }
                //Add 'CalculatorItems' element if does not exist
                newel = m_xmlVisit.createElement('CalculatorItems');
                newtext = m_xmlVisit.createTextNode(bstrVisitTxt.join(','));
                newel.appendChild(newtext);
                root = comp;
                root[root.length - 1].appendChild(newel);

                //Add 'CrCareMinutes' element if does not exist
                newel = m_xmlVisit.createElement('CrCareMinutes');
                newtext = m_xmlVisit.createTextNode(minutes);
                newel.appendChild(newtext);
                root[root.length - 1].appendChild(newel);
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

    if (m_lynxObject === null) 
    {
        m_lynxObject = window.external.DiscernObjectFactory("LYNXEPOINT");
    }

    if (m_lynxObject != null) 
    {
        m_lynxObject.PersonId = criterion.person_id;
        m_lynxObject.EncounterId = criterion.encntr_id;
        m_lynxObject.TrackingGroupCd = m_TrackingGroupCd;
    }
    else 
    {
        alert(i18n.LYNXEPOINT_OBJECT_NULL);
    }

    if (infusionInjection || m_StdVisitType)
    {
        m_lynxObject.VisitXML = GetStringFromXML(m_xmlVisit);
        m_lynxObject.IVsXML = GetStringFromXML(m_xmlIVs);
        var timerSendEPointMessage = MP_Util.CreateTimer("ENG:FNMP.SendMessageToEPoint");
        var lSuccessInd = m_lynxObject.SendMessageToEPoint();
        if (timerSendEPointMessage)
            timerSendEPointMessage.Stop();

        switch (lSuccessInd)
        {
            case 1:
                var txtChargesXML = m_lynxObject.GetMessageFromEPoint();
                m_xmlDispCharges.loadXML(txtChargesXML);
                if (m_debug_ind == 1)
                    wndDebugInfo += "GetMessageFromEPoint: \n" + GetStringFromXML(m_xmlDispCharges);
                break;
            case 2:
                alert(i18n.INITIAL_PARAMETERS_INVALID);
                break;
            case 4:
                alert(i18n.INVALID_OPERATION_EXCEPTION);
                break;
            case 5:
                alert(i18n.WEB_SERVICE_PARAMETERS_INVALID);
                break;
            default:
                //do nothing
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
    ChargeComponent[0].InsertData();

    $('#submitCharges').attr("disabled", false);
    m_submitFlag = true;
}

function loadSubHeader(divin)
{
    if (evaluationManagement && divin === 1)
    {
        if (m_StdVisitType)
            $('#wz-hdr').show();
        else
            $('#wz-hdr').hide();
        if (m_allRefTextExpanded)
        {
            $('#wz-hdr').html("<a onclick='javascript:MP_Util.Doc.ExpandSubSectionCollapseAll()'><span id='expandSub'>" + i18n.COLLAPSE_SUB_SEC + "</span></a>");
        }
        else
        {
            $('#wz-hdr').html("<a onclick='javascript:MP_Util.Doc.ExpandSubSectionCollapseAll()'><span id='expandSub'>" + i18n.EXPAND_SUB_SEC + "</span></a>");
        }
    }
    else if ((infusionInjection && CERN_INFUSIONINJECTION_O1.GetMARInd()) && ((divin === 1 && !evaluationManagement) || (divin === 2 && evaluationManagement)))
    {
        var iiRefreshInfo = 'javascript:CERN_INFUSIONINJECTION_O1.Refresh();';
        $('#wz-hdr').show();
        $('#wz-hdr').html("<a id='marRefresh' href=" + iiRefreshInfo + " tabindex='-1'>" + i18n.REFRESH + "</a>");
    }
    else
        $('#wz-hdr').hide();
}
function GetStringFromXML(xmlNode)
{
    if (typeof window.XMLSerializer != "undefined")
    {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined")
    {
        return xmlNode.xml;
    }
    return "";
}/**
* Project: fnmp_new_established_o1.js
* Version 1.0.0
*/

function NewEstablishedComponentStyle()
{
    this.initByNamespace("ne");
}

NewEstablishedComponentStyle.inherits(ComponentStyle);

function NewEstablishedComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new NewEstablishedComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.NEWESTABLISHED.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.NEWESTABLISHED.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.m_neReadOnly = false;

    NewEstablishedComponent.method("InsertData", function ()
    {
        CERN_NEWESTABLISHED_01.GetNewEstablishedTable(this);
    });
    NewEstablishedComponent.method("HandleSuccess", function (recordData)
    {
        CERN_NEWESTABLISHED_01.RenderComponent(this, recordData);
    });
    NewEstablishedComponent.method("GetSelected", function ()
    {
        return CERN_NEWESTABLISHED_01.GetSelectedOption(this);
    });
    NewEstablishedComponent.method("setReferenceTxtInd", function (value)
    {
        this.setRefTxtExpanded(value);
    });
    NewEstablishedComponent.method("setReadOnlyInd", function (value)
    {
        this.m_neReadOnly = value;
    });
    NewEstablishedComponent.method("getReadOnlyInd", function ()
    {
        return this.m_neReadOnly;
    });
}

NewEstablishedComponent.inherits(MPageComponent);

var CERN_NEWESTABLISHED_01 = function ()
{
    return {
        GetNewEstablishedTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];            
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0");
            logNE = "fnmp_get_new_or_established:" + sendAr.join(",");
            MP_Core.XMLCclRequestWrapper(component, "fnmp_get_new_or_established", sendAr, true);
        },

        RenderComponent: function (component, recordData)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = []; calItems = [], systemValue = recordData.ALIAS;
                var c = 0, ch = 0;

                jsHTML.push("<div class='cc-info'>");

                var comp = m_xmlDoc.getElementsByTagName("Component");
                var style = component.getStyles().getNameSpace();
                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "NEW_ESTABLISHED")
                    {
                        var helpText = comp[c].getElementsByTagName("Help")[0].childNodes[0].nodeValue;
                        if (helpText.length > 0)
                        {
                            jsHTML.push("<div class='fc-sub-sec' id='fc-sub-sec-" + style + "'><h3 class='fc-sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.HELP_SECTION, "</span></h3><div class='sub-sec-content fc-sub-sec-content'>")
                            jsHTML.push(helpText);
                            jsHTML.push("</div></div>");
                            jsHTML.push("</div>");
                        }
                    }
                }

                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "NEW_ESTABLISHED")
                    {
                        var item = comp[c].getElementsByTagName("Item");
                        for (ch = 0; ch < item.length; ch++)
                        {
                            var display = item[ch].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                            var id = item[ch].getElementsByTagName("ValueId")[0].childNodes[0].nodeValue;
                            calItems[ch] = id;
                            if (id == systemValue)
                            {
                                display += i18n.SYSTEM_DEFAULT;
                            }
                            jsHTML.push("<input type='radio' name='newEst' id=" + id + " value=" + id + " />" + display + "<br />");
                        }
                    }
                }

                var suggestedList = recordData.SUGGESTED;
                if (suggestedList.length > 0)
                {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.DOCUMENTED_SECTION, "</span></h3>")
                    for (var s = 0; s < suggestedList.length; s++)
                    {
                        jsHTML.push("<div class='sub-sec-content'>");
                        jsHTML.push(suggestedList[s].DISPLAY);
                        jsHTML.push("</div>");
                    }
                    jsHTML.push("</div></div>");
                }
                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

                if (component.getReadOnlyInd())
                {
                    CERN_NEWESTABLISHED_01.SetDisabled();
                }
                CERN_NEWESTABLISHED_01.SelectOption(systemValue);
                if ((m_em_charge_ind == 1) && (m_txtSavedXML.length > 0))
                {
                    var savedData = MP_Util.GetSavedXMLData(calItems);
                    if (savedData.length > 0)
                    {
                        CERN_NEWESTABLISHED_01.SelectOption(savedData);
                    }
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
        },

        GetSelectedOption: function ()
        {
            var retValue;
            var options = document.getElementsByName('newEst');

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    retValue = options[i].value;
                    return retValue;
                }
            }
        },

        SelectOption: function (_value)
        {
            var options = document.getElementsByName('newEst');
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].value == _value)
                {
                    options[i].checked = true;
                }
            }
        },

        SetDisabled: function ()
        {
            var options = document.getElementsByName('newEst');
            for (var i = 0; i < options.length; i++)
            {
                options[i].disabled = "disabled";
            }
        }
    };
} ();
/**
* Project: fnmp_nursing_assess_o1.js
* Version 1.0.0
*/

function NursingAssessmentComponentStyle()
{
    this.initByNamespace("na");
}

NursingAssessmentComponentStyle.inherits(ComponentStyle);

function NursingAssessmentComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new NursingAssessmentComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.NURSINGASSESSMENT.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.NURSINGASSESSMENT.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.m_naReadOnly = false;

    NursingAssessmentComponent.method("InsertData", function ()
    {
        CERN_NURSINGASSESSMENT_O1.GetNursingAssessmentTable(this);
    });
    NursingAssessmentComponent.method("HandleSuccess", function (recordData)
    {
        CERN_NURSINGASSESSMENT_O1.RenderComponent(this, recordData);
    });
    NursingAssessmentComponent.method("GetSelected", function ()
    {
        return CERN_NURSINGASSESSMENT_O1.GetSelectedOption(this);
    });
    NursingAssessmentComponent.method("setReferenceTxtInd", function (value)
    {
        this.setRefTxtExpanded(value);
    });
    NursingAssessmentComponent.method("setReadOnlyInd", function (value)
    {
        this.m_naReadOnly = value;
    });
    NursingAssessmentComponent.method("getReadOnlyInd", function ()
    {
        return this.m_naReadOnly;
    });
}

NursingAssessmentComponent.inherits(MPageComponent);

var CERN_NURSINGASSESSMENT_O1 = function ()
{
    return {
        GetNursingAssessmentTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", m_CodingMPageFlag);
            logNA = "fnmp_get_nursing_notes:" + sendAr.join(",");
            MP_Core.XMLCclRequestWrapper(component, "fnmp_get_nursing_notes", sendAr, true);
        },

        RenderComponent: function (component, recordData)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [], calItems = [], systemValue = recordData.ALIAS;
                var c = 0, ch = 0;
                if (systemValue.length == 0)
                {
                    systemValue = "0";
                }

                jsHTML.push("<div class='disp-info'>");

                var comp = m_xmlDoc.getElementsByTagName("Component");
                var style = component.getStyles().getNameSpace();
                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "NURSING_ASSESSMENT")
                    {
                        var helpText = comp[c].getElementsByTagName("Help")[0].childNodes[0].nodeValue;
                        if (helpText.length > 0)
                        {
                            jsHTML.push("<div class='fc-sub-sec' id='fc-sub-sec-" + style + "'><h3 class='fc-sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.HELP_SECTION, "</span></h3><div class='sub-sec-content fc-sub-sec-content'>");
                            jsHTML.push(helpText);
                            jsHTML.push("</div></div>");
                            jsHTML.push("</div>");
                        }
                    }
                }

                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "NURSING_ASSESSMENT")
                    {
                        var item = comp[c].getElementsByTagName("Item");
                        for (ch = 0; ch < item.length; ch++)
                        {
                            var display = item[ch].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                            var id = item[ch].getElementsByTagName("ValueId")[0].childNodes[0].nodeValue;
                            calItems[ch] = id;
                            if (id == systemValue)
                            {
                                display += i18n.SYSTEM_DEFAULT;
                            }
                            jsHTML.push("<input type='radio' name='nurseAssess' id=" + id + " value=" + id + " />" + display + "<br />");
                        }
                    }
                }

                var suggestedList = recordData.SUGGESTED;
                if (suggestedList.length > 0)
                {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.DOCUMENTED_SECTION, "</span></h3>")
                    for (var s = 0; s < suggestedList.length; s++)
                    {
                        jsHTML.push("<div class='sub-sec-content'>");
                        jsHTML.push(suggestedList[s].DISPLAY);
                        jsHTML.push("</div>");
                    }
                    jsHTML.push("</div></div>");
                }

                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

                if (component.getReadOnlyInd())
                {
                    CERN_NURSINGASSESSMENT_O1.SetDisabled();
                }
                CERN_NURSINGASSESSMENT_O1.SelectOption(systemValue);
                if ((m_em_charge_ind == 1) && (m_txtSavedXML.length > 0))
                {
                    var savedData = MP_Util.GetSavedXMLData(calItems);
                    if (savedData.length > 0)
                    {
                        CERN_NURSINGASSESSMENT_O1.SelectOption(savedData);
                    } else
                    {
                        CERN_NURSINGASSESSMENT_O1.SelectOption(0);
                    }
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
        },

        GetSelectedOption: function ()
        {
            var retNurseAssess;
            var options = document.getElementsByName('nurseAssess');

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    retNurseAssess = options[i].value;
                    return retNurseAssess;
                }
            }
        },

        ExpandRefText: function ()
        {
            var parent = Util.gp(Util.gp(this));
            var spans = Util.Style.g("sub-ref-sec-hd-tgl", parent, "span");
            for (var i = 0; i < spans.length; i++)
            {
                var span = spans[i];
                Util.Style.rcss(span, "collapsed");
                Util.Style.acss(span, "expanded");
            }
        },

        CollapseRefText: function ()
        {
            var gpp = Util.gp(Util.gp(this));

            Util.Style.rcss(gpp, "closed");
            this.innerHTML = "-";
            this.title = i18n.HIDE_SECTION;
        },

        SelectOption: function (_value)
        {
            var options = document.getElementsByName('nurseAssess');
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].value == _value)
                {
                    options[i].checked = true;
                }
            }
        },

        SetDisabled: function ()
        {
            var options = document.getElementsByName('nurseAssess');

            for (var i = 0; i < options.length; i++)
            {
                options[i].disabled = "disabled";
            }
        }
    };
} ();
/**
* Project: fnmp_order_mgmt_o1.js
* Version 1.0.0
*/

function OrderManagementComponentStyle()
{
    this.initByNamespace("om");
}

OrderManagementComponentStyle.inherits(ComponentStyle);

function OrderManagementComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new OrderManagementComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.ORDERMANAGEMENT.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.ORDERMANAGEMENT.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.m_omReadOnly = false;

    OrderManagementComponent.method("InsertData", function ()
    {
        CERN_ORDERMANAGEMENT_O1.GetOrderManagementTable(this);
    });
    OrderManagementComponent.method("HandleSuccess", function (recordData)
    {
        CERN_ORDERMANAGEMENT_O1.RenderComponent(this, recordData);
    });
    OrderManagementComponent.method("GetSelected", function ()
    {
        return CERN_ORDERMANAGEMENT_O1.GetSelectedOptions(this);
    });
    OrderManagementComponent.method("setReferenceTxtInd", function (value)
    {
        this.setRefTxtExpanded(value);
    });
    OrderManagementComponent.method("setReadOnlyInd", function (value)
    {
        this.m_omReadOnly = value;
    });
    OrderManagementComponent.method("getReadOnlyInd", function ()
    {
        return this.m_omReadOnly;
    });
}

OrderManagementComponent.inherits(MPageComponent);

var CERN_ORDERMANAGEMENT_O1 = function ()
{
    return {
        GetOrderManagementTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", m_CodingMPageFlag);
            logOM = "fnmp_get_order_management:" + sendAr.join(",");
            MP_Core.XMLCclRequestWrapper(component, "fnmp_get_order_management", sendAr, true);
        },

        RenderComponent: function (component, recordData)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [], systemValue = [], calItems = [];
                var c = 0, ch = 0;
                for (var j = 0, jl = recordData.ALIASES.length; j < jl; j++)
                {
                    systemValue.push(recordData.ALIASES[j].ALIAS);
                }

                jsHTML.push("<div class='om-info'>");

                var comp = m_xmlDoc.getElementsByTagName("Component");
                var style = component.getStyles().getNameSpace();
                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "ORDER_MANAGEMENT")
                    {
                        var helpText = comp[c].getElementsByTagName("Help")[0].childNodes[0].nodeValue;
                        if (helpText.length > 0)
                        {
                            jsHTML.push("<div class='fc-sub-sec' id='fc-sub-sec-" + style + "'><h3 class='fc-sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.HELP_SECTION, "</span></h3><div class='sub-sec-content fc-sub-sec-content'>");
                            jsHTML.push(helpText);
                            jsHTML.push("</div></div>");
                            jsHTML.push("</div>");
                        }
                    }
                }

                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "ORDER_MANAGEMENT")
                    {
                        var item = comp[c].getElementsByTagName("Item");
                        for (ch = 0; ch < item.length; ch++)
                        {
                            var display = item[ch].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                            var id = item[ch].getElementsByTagName("ValueId")[0].childNodes[0].nodeValue;
                            calItems[ch] = id;
                            for (var x = 0; x < systemValue.length; x++)
                            {
                                if (id == systemValue[x])
                                {
                                    display += i18n.SYSTEM_DEFAULT;
                                    break;
                                }
                            }
                            jsHTML.push("<input type='checkbox' name='orderMgmt' id=" + id + " value=" + id + " />" + display + "<br />");
                        }
                    }
                }

                var suggestedList = recordData.SUGGESTED;
                if (suggestedList.length > 0)
                {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.DOCUMENTED_SECTION, "</span></h3>")
                    for (var s = 0; s < suggestedList.length; s++)
                    {
                        jsHTML.push("<div class='sub-sec-content'>");
                        jsHTML.push(suggestedList[s].DISPLAY);
                        jsHTML.push("</div>");
                    }
                    jsHTML.push("</div></div>");
                }

                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

                if (component.getReadOnlyInd())
                {
                    CERN_ORDERMANAGEMENT_O1.SetDisabled();
                }
                if (systemValue.length > 0)
                {
                    CERN_ORDERMANAGEMENT_O1.SelectCheckbox(systemValue);
                }
                if ((m_em_charge_ind == 1) && (m_txtSavedXML.length > 0))
                {
                    var savedData = MP_Util.GetSavedXMLData(calItems);
                    if (savedData.length > 0)
                    {
                        CERN_ORDERMANAGEMENT_O1.SelectCheckbox(savedData);
                    }
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
        },

        GetSelectedOptions: function ()
        {
            var retValue = [];
            retValue.length = 0;
            var options = document.getElementsByName('orderMgmt');

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    retValue.push(options[i].value);
                }
            }
            return retValue;
        },

        SelectCheckbox: function (_value)
        {
            var paramValue = [];
            paramValue = _value;
            var options = document.getElementsByName('orderMgmt');
            for (var i = 0; i < options.length; i++)
            {
                options[i].checked = false;
                for (var x = 0; x < paramValue.length; x++)
                {
                    if (options[i].value == paramValue[x])
                    {
                        options[i].checked = true;
                    }
                }
            }
        },

        SetDisabled: function ()
        {
            var options = document.getElementsByName('orderMgmt');

            for (var i = 0; i < options.length; i++)
            {
                options[i].disabled = "disabled";
            }
        }
    };
} ();
/**
* Project: fnmp_patient_education_o1.js
* Version 1.0.0
*/

function PatEdComponentStyle()
{
    this.initByNamespace("ped");
}

PatEdComponentStyle.inherits(ComponentStyle);

function PatEdComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new PatEdComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.PATED.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PATED.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.m_peReadOnly = false;

    PatEdComponent.method("InsertData", function ()
    {
        CERN_PATED_O1.GetPatEdTable(this);
    });
    PatEdComponent.method("HandleSuccess", function (recordData)
    {
        CERN_PATED_O1.RenderComponent(this, recordData);
    });
    PatEdComponent.method("GetSelected", function ()
    {
        return CERN_PATED_O1.GetSelectedOption(this);
    });
    PatEdComponent.method("setReferenceTxtInd", function (value)
    {
        this.setRefTxtExpanded(value);
    });
    PatEdComponent.method("setReadOnlyInd", function (value)
    {
        this.m_peReadOnly = value;
    });
    PatEdComponent.method("getReadOnlyInd", function ()
    {
        return this.m_peReadOnly;
    });
}

PatEdComponent.inherits(MPageComponent);

var CERN_PATED_O1 = function ()
{
    return {
        GetPatEdTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0")
            logPE = "fnmp_get_patient_education:" + sendAr.join(",");
            MP_Core.XMLCclRequestWrapper(component, "fnmp_get_patient_education", sendAr, true);

        },

        RenderComponent: function (component, recordData)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [], calItems = [], systemValue = recordData.ALIAS;
                var c = 0, ch = 0;

                if (systemValue.length == 0)
                {
                    systemValue = "0";
                }
                jsHTML.push("<div class='ped-info'>");

                var comp = m_xmlDoc.getElementsByTagName("Component");
                var style = component.getStyles().getNameSpace();
                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "PATIENT_EDUCATION")
                    {
                        var helpText = comp[c].getElementsByTagName("Help")[0].childNodes[0].nodeValue;
                        if (helpText.length > 0)
                        {
                            jsHTML.push("<div class='fc-sub-sec' id='fc-sub-sec-" + style + "'><h3 class='fc-sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.HELP_SECTION, "</span></h3><div class='sub-sec-content fc-sub-sec-content'>")
                            jsHTML.push(helpText);
                            jsHTML.push("</div></div>");
                            jsHTML.push("</div>");
                        }
                    }
                }

                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "PATIENT_EDUCATION")
                    {
                        var item = comp[c].getElementsByTagName("Item");
                        for (ch = 0; ch < item.length; ch++)
                        {
                            var display = item[ch].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                            var id = item[ch].getElementsByTagName("ValueId")[0].childNodes[0].nodeValue;
                            calItems[ch] = id;
                            if (id == systemValue)
                            {
                                display += i18n.SYSTEM_DEFAULT;
                            }
                            jsHTML.push("<input type='radio' name='PED' id=" + id + " value=" + id + " />" + display + "<br />");
                        }
                    }
                }

                var suggestedList = recordData.SUGGESTED;
                if (suggestedList.length > 0)
                {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.DOCUMENTED_SECTION, "</span></h3>")
                    for (var s = 0; s < suggestedList.length; s++)
                    {
                        jsHTML.push("<div class='sub-sec-content'>");
                        jsHTML.push(suggestedList[s].DISPLAY);
                        jsHTML.push("</div>");
                    }
                    jsHTML.push("</div></div>");
                }

                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

                if (component.getReadOnlyInd())
                {
                    CERN_PATED_O1.SetDisabled();
                }
                CERN_PATED_O1.SelectOption(systemValue);
                if ((m_em_charge_ind == 1) && (m_txtSavedXML.length > 0))
                {
                    var savedData = MP_Util.GetSavedXMLData(calItems);
                    if (savedData.length > 0)
                    {
                        CERN_PATED_O1.SelectOption(savedData);
                    } else
                    {
                        CERN_PATED_O1.SelectOption(0);
                    }
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
        },

        GetSelectedOption: function ()
        {
            var retValue;
            var options = document.getElementsByName('PED');

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    retValue = options[i].value;
                    return retValue;
                }
            }
        },

        SelectOption: function (_value)
        {
            var options = document.getElementsByName('PED');
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].value == _value)
                {
                    options[i].checked = true;
                }
            }
        },

        SetDisabled: function ()
        {
            var options = document.getElementsByName('PED');

            for (var i = 0; i < options.length; i++)
            {
                options[i].disabled = "disabled";
            }
        }
    };
} ();
/**
* Project: fnmp_presenting_problem.js
* Version 1.0.0
*/

function PresentingProblemsComponentStyle()
{
    this.initByNamespace("pl");
}
var insertCnt = 0;

PresentingProblemsComponentStyle.inherits(ComponentStyle);

function PresentingProblemsComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new PresentingProblemsComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.PRESENTING_PROBLEMS.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PRESENTING_PROBLEMS.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(1);
    this.m_plReadOnly = false;
    this.m_plDisplayComponent = true;
    this.m_plContains = false;

    PresentingProblemsComponent.method("InsertData", function ()
    {
        CERN_PRESENTING_PROBLEMS_O1.GetProblemsTable(this);
    });
    PresentingProblemsComponent.method("HandleSuccess", function (recordData)
    {
        CERN_PRESENTING_PROBLEMS_O1.RenderComponent(this, recordData);
    });
    PresentingProblemsComponent.method("GetSelected", function ()
    {
        return CERN_PRESENTING_PROBLEMS_O1.GetSelectedOption(this);
    });
    PresentingProblemsComponent.method("setReadOnlyInd", function (value)
    {
        this.m_plReadOnly = value;
    });
    PresentingProblemsComponent.method("getReadOnlyInd", function ()
    {
        return this.m_plReadOnly;
    });
    PresentingProblemsComponent.method("setDisplayComponentInd", function (value)
    {
        this.m_plDisplayComponent = value;
    });
    PresentingProblemsComponent.method("getDisplayComponentInd", function ()
    {
        return this.m_plDisplayComponent;
    });
    PresentingProblemsComponent.method("setContainsInd", function (value)
    {
        this.m_plContains = value;
    });
    PresentingProblemsComponent.method("getContainsInd", function ()
    {
        return this.m_plContains;
    });
}

PresentingProblemsComponent.inherits(MPageComponent);

var CERN_PRESENTING_PROBLEMS_O1 = function ()
{

    var searchTypeFlag = 1;
    var searchInd = true;
    var initialLoad = true;

    return {

        GetProblemsTable: function (component)
        {
            var sendAr = [];
            var criterion = component.getCriterion();
            var lynx_ids = MP_Util.CreateParamArray(m_arrSavedLynxIDs, 2);
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", m_CodingMPageFlag, lynx_ids);
            logPP = "fnmp_get_presenting_problem:" + sendAr.join(",");
            var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
            request.setProgramName("FNMP_GET_PRESENTING_PROBLEM");
            request.setParameters(sendAr);
            request.setAsync(true);
            MP_Core.XMLCCLRequestCallBack(component, request, CERN_PRESENTING_PROBLEMS_O1.RenderComponent);
        },
        RenderComponent: function (reply)
        {
            countText = "";
            component = reply.getComponent();
            try
            {
                var componentId = component.getComponentId();
                var compHeaderId = component.getStyles().getNameSpace() + componentId;
                var plCompSec = _g(compHeaderId);
                var recordData = reply.getResponse();
                var comp;
                jsPlHTML = [];
                plHTML = "";
                var probLen = 0;
                var count = 0;
                var delOpt = "";
                if (reply.getStatus() !== "F")
                {
                    if (initialLoad === true)
                    {
                        if (component.getContainsInd() === true)
                        {
                            searchTypeFlag = 2;
                            searchInd = false;
                            initialLoad = false;
                        }
                    }
                    if (component.getReadOnlyInd() === false)
                    {
                        jsPlHTML.push("<div class='search-box-div'><div class='searchTypediv'><select class='searchType' name='searchType' id='searchType' onchange='CERN_PRESENTING_PROBLEMS_O1.SetSearchFlag();'><option value='1'>" + i18n.STARTWITH + "</option>");
                        if (!searchInd)
                        {
                            jsPlHTML.push("<option  selected='selected'  value='2'>" + i18n.CONTAINS + "</option></select></div>");
                        }
                        else
                        {
                            jsPlHTML.push("<option value='2'>" + i18n.CONTAINS + "</option></select></div>");
                        }
                        jsPlHTML.push(MP_Util.CreateAutoSuggestBoxHtml(component) + "</div>");
                    }

                    if (reply.getStatus() === "S")
                    {
                        jsPlHTML.push("<div class='", MP_Util.GetContentClass(component, probLen), "'><dl id='pp-list'>");

                        comp = m_xmlPresentingProblem.getElementsByTagName("PresentingProblem");
                        if (comp.length == 0)
                        {
                            var problemArray = recordData.PROBLEM;
                            if (problemArray.length > 0)
                            {
                                for (var i = 0, l = problemArray.length; i < l; i++)
                                {
                                    var probDesc = m_arrSavedLynxIDs.length > 0 ? problemArray[i].DESC : problemArray[i].DESC + i18n.SYSTEM_DEFAULT;
                                    CERN_PRESENTING_PROBLEMS_O1.AddToXML(probDesc, problemArray[i].LYNX);
                                }
                            }
                        }

                        comp = m_xmlPresentingProblem.getElementsByTagName("PresentingProblem");
                        for (c = 0; c < comp.length; c++)
                        {
                            var item = comp[c].getElementsByTagName("Item");
                            for (ch = 0; ch < item.length; ch++)
                            {
                                probLen = probLen + 1;
                                var txtDesc = item[ch].getElementsByTagName("Desc")[0].childNodes[0].nodeValue;
                                var txtLynxID = item[ch].getElementsByTagName("LynxID")[0].childNodes[0].nodeValue;
                                if (component.getReadOnlyInd() === false)
                                {
                                    delOpt = "<span class='pl-info-del' onclick ='CERN_PRESENTING_PROBLEMS_O1.DeleteOption(this)'>&nbsp;</span>";
                                }
                                jsPlHTML.push("<dt id='pl-info-" + count + "' pl-info-Id='pl-info-" + count + "' class='pl-info'>" + delOpt +
											  "<span class='pl-info-txt' id='" + txtLynxID + "'>" + txtDesc + "</span></dt>");
                                count = count + 1;
                            }
                        }

                        plHTML = jsPlHTML.join("");
                        countText = MP_Util.CreateTitleText(component, probLen);
                        jsPlHTML.push("</dl></div>");
                    }
                    else
                    {
                        if ((reply.getStatus() === "Z"))
                        {
                            plHTML = jsPlHTML.join("");
                            plHTML += MP_Util.HandleNoDataResponse(component.getStyles().getNameSpace());
                        }
                    }



                    MP_Util.Doc.FinalizeComponent(plHTML, component, countText);
                    var compNs = component.getStyles().getNameSpace();
                    var compId = component.getComponentId();
                    m_PrProblemId = compNs + "contentCtrl" + compId;

                    if (component.getReadOnlyInd() === false)
                    {
                        var eventflag = false;
                        $(".pl-info").live("mouseenter", function ()
                        {
                            if (!eventflag)
                                $(this).addClass("pl-info-hover");
                        });

                        $(".pl-info").live("mouseleave", function ()
                        {
                            $(this).removeClass("pl-info-hover");
                        });

                        $(".pl-info-del").live("mouseenter", function ()
                        {
                            $(".pl-info").removeClass("pl-info-hover");
                            $(this).addClass("pl-info-del-hover");
                            eventflag = true;
                        });

                        $(".pl-info-del").live("mouseleave", function ()
                        {
                            $(this).removeClass("pl-info-del-hover");
                            eventflag = false;
                        });

                        MP_Util.AddAutoSuggestControl(component, CERN_PRESENTING_PROBLEMS_O1.SearchNomenclature, CERN_PRESENTING_PROBLEMS_O1.HandleSelection, CERN_PRESENTING_PROBLEMS_O1.CreateSuggestionLine);
                    }
                }
                else
                {
                    countText = MP_Util.CreateTitleText(component, 0);
                    MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), reply.getError()), component, countText);
                }
            }
            catch (err)
            {
                countText = MP_Util.CreateTitleText(component, 0);
                var errMsg = [];
                errMsg.push("<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>");
                MP_Util.Doc.FinalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), component, countText);
                throw (err);
            }
            finally
            {
                component.setEditMode(false);
            }
        },
        /**
        * Call the mp_search_nomenclatures script with the text entered into the textBox
        * @param {function} callback : The callback function used when the CCL script returns.
        * @param {node} textBox : The text box node which the user enters in search strings
        * @param {component} component : The new order entry component
        */
        SearchNomenclature: function (callback, textBox, component)
        {
            var xhr = new XMLCclRequest();
            var returnData;

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
                        if (textBox.value !== "")
                        {
                            returnData = jsonMsg.RECORD_DATA.NOMENCLATURE;
                            callback.autosuggest(returnData);
                        }
                    }
                }
            };
            xhr.open('GET', "fnmp_search_presenting_problem");
            xhr.send("^MINE^," + component.getCriterion().person_id + ".0, " + component.getCriterion().encntr_id + ".0, " + "^" + textBox.value + "^," + searchTypeFlag + "," + m_CodingMPageFlag);
        },
        /**
        * Retrieve the data from the selected object and call the AutoSuggestAddScript script.
        * @param {json} suggestionObj : The json object that was selected from the suggestions drop down
        * @param {node} textBox : The text box node which the user enters in search strings
        * @param {node} component : The new order entry component
        */
        HandleSelection: function (suggestionObj, textBox, component)
        {
            CERN_PRESENTING_PROBLEMS_O1.AddToXML(suggestionObj.DESC, suggestionObj.LYNX);
            component.InsertData();
        },
        AddToXML: function (_desc, _lynx)
        {
            var root, newel, newtext;

            //Add PresentingProblem element if does not exist
            var comp = m_xmlPresentingProblem.getElementsByTagName('PresentingProblem');
            if (comp.length == 0)
            {
                newel = m_xmlPresentingProblem.createElement('PresentingProblem');
                root = m_xmlPresentingProblem.getElementsByTagName('Component');
                root[0].appendChild(newel);
            }

            //Never add duplicate lynx IDs or names
            comp = m_xmlPresentingProblem.getElementsByTagName('Item');
            if (comp.length > 0)
            {
                for (c = 0; c < comp.length; c++)
                {
                    if ((comp[c].getElementsByTagName("LynxID")[0].childNodes[0].nodeValue == _lynx) || (comp[c].getElementsByTagName("Desc")[0].childNodes[0].nodeValue == _desc))
                        return;
                }
            }

            //Add 'Item' element if does not exist
            newel = m_xmlPresentingProblem.createElement('Item');
            root = m_xmlPresentingProblem.getElementsByTagName('PresentingProblem');
            root[0].appendChild(newel);

            //Add 'Desc' and 'LynxID' elements and text values to 'Item' element
            comp = m_xmlPresentingProblem.getElementsByTagName("PresentingProblem");
            for (c = 0; c < comp.length; c++)
            {
                newel = m_xmlPresentingProblem.createElement('Desc');
                newtext = m_xmlPresentingProblem.createTextNode(_desc);
                newel.appendChild(newtext);
                root = comp[c].getElementsByTagName("Item");
                root[root.length - 1].appendChild(newel);

                newel = m_xmlPresentingProblem.createElement('LynxID');
                newtext = m_xmlPresentingProblem.createTextNode(_lynx);
                newel.appendChild(newtext);
                root = comp[c].getElementsByTagName("Item");
                root[root.length - 1].appendChild(newel);
            }

            //alert(CERN_PRESENTING_PROBLEMS_O1.GetStringFromXML(m_xmlPresentingProblem));
        },
        RemoveFromXML: function (_listItem, rowId)
        {
            var comp = m_xmlPresentingProblem.getElementsByTagName("PresentingProblem");
            for (c = 0; c < comp.length; c++)
            {
                var remItem = comp[c].getElementsByTagName("Item")[_listItem];
                remItem.parentNode.removeChild(remItem);
            }
            if (m_savedXML)
            {
                comp = m_savedXML.getElementsByTagName("Problem");
                var selectedVal = $("#" + rowId).children().first().attr('id');
                if (comp.length > 0)
                {
                    for (i = 0; i < comp.length; i++)
                    {
                        if (selectedVal === comp[i].getElementsByTagName("LynxID")[0].childNodes[0].nodeValue)
                        {
                            comp[i].parentNode.removeChild(comp[i]);
                        }
                    }
                }
            }
            component.InsertData();
        },
        GetStringFromXML: function (xmlNode)
        {
            if (typeof window.XMLSerializer != "undefined")
            {
                return (new window.XMLSerializer()).serializeToString(xmlNode);
            } else if (typeof xmlNode.xml != "undefined")
            {
                return xmlNode.xml;
            }
            return "";
        },
        GetSelectedOption: function ()
        {
            var retValue = [];
            var comp = m_xmlPresentingProblem.getElementsByTagName('PresentingProblem');
            if (comp.length > 0)
            {
                for (c = 0; c < comp.length; c++)
                {
                    var lynxId = comp[c].getElementsByTagName("LynxID");
                    for (var i = 0; i < lynxId.length; i++)
                    {
                        retValue[i] = lynxId[i].text;
                    }
                }
                return retValue;
            }
        },
        /**
        * Return the html needed to display each suggestion in the suggestions drop down.
        * @param {json} suggestionObj : The json object which contains the data to show in the suggetion drop down
        * @param {string} searchVal : The value entered in the search box
        */
        CreateSuggestionLine: function (suggestionObj, searchVal)
        {
            //Need to check and see if there is a sentence to display
            return CERN_PRESENTING_PROBLEMS_O1.HighlightValue(suggestionObj.DESC, suggestionObj.HINT, searchVal);
        },
        /**
        * Highlight specific portions of a string for display purposes
        * @param {string} inString : The string to be highlighted
        * @param {string] term : The string to highlight
        * @return {string} outString : The string highlighted using HTML tags
        */
        HighlightValue: function (inString, hintString, term)
        {
            return "<strong>" + inString.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong class='highlight'>") + "</strong><br/><span class='pl-hintTxt'>" + hintString + "</span>";
        },
        SetSearchFlag: function ()
        {
            searchTypeFlag = _g('searchType').value;
            if (searchTypeFlag === '1')
            {
                searchInd = true;
            } else
            {
                searchInd = false;
            }
        },
        DeleteOption: function (delObj)
        {
            var delID = $(delObj).parent().attr("pl-info-Id");
            if (delID)
                CERN_PRESENTING_PROBLEMS_O1.RemoveFromXML(delID.substr(8), delID);
        }
    };
} ();/**
* Project: fnmp_process_mgmt_o1.js
* Version 1.0.0
*/

function ProcessManagementComponentStyle()
{
    this.initByNamespace("pm");
}

ProcessManagementComponentStyle.inherits(ComponentStyle);

function ProcessManagementComponent(criterion)
{
    this.disablePref = 0;
    this.setCriterion(criterion);
    this.setStyles(new ProcessManagementComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.PROCESSMANAGEMENT.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.PROCESSMANAGEMENT.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.m_pmReadOnly = false;

    ProcessManagementComponent.method("InsertData", function ()
    {
        CERN_PROCESSMANAGEMENT_O1.GetProcessManagementTable(this);
    });
    ProcessManagementComponent.method("HandleSuccess", function (recordData)
    {
        CERN_PROCESSMANAGEMENT_O1.RenderComponent(this, recordData);
    });
    ProcessManagementComponent.method("GetSelected", function ()
    {
        return CERN_PROCESSMANAGEMENT_O1.GetSelectedOptions(this);
    });
    ProcessManagementComponent.method("setReferenceTxtInd", function (value)
    {
        this.setRefTxtExpanded(value);
    });
    ProcessManagementComponent.method("setReadOnlyInd", function (value)
    {
        this.m_pmReadOnly = value;
    });
    ProcessManagementComponent.method("getReadOnlyInd", function ()
    {
        return this.m_pmReadOnly;
    });
}

ProcessManagementComponent.inherits(MPageComponent);

var CERN_PROCESSMANAGEMENT_O1 = function ()
{
    return {
        GetProcessManagementTable: function (component)
        {
            var criterion = component.getCriterion();
            var sendAr = [];
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", m_CodingMPageFlag)
            logPM = "fnmp_get_process_management:" + sendAr.join(",");
            MP_Core.XMLCclRequestWrapper(component, "fnmp_get_process_management", sendAr, true);
        },

        RenderComponent: function (component, recordData)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [], systemValue = [], calItems = [];
                var c = 0, ch = 0;
                for (var j = 0, jl = recordData.ALIASES.length; j < jl; j++)
                {
                    systemValue.push(recordData.ALIASES[j].ALIAS);
                }

                jsHTML.push("<div class='pm-info'>");

                var comp = m_xmlDoc.getElementsByTagName("Component");
                var style = component.getStyles().getNameSpace();
                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "PROCESS_MANAGEMENT")
                    {
                        var helpText = comp[c].getElementsByTagName("Help")[0].childNodes[0].nodeValue;
                        if (helpText.length > 0)
                        {
                            jsHTML.push("<div class='fc-sub-sec' id='fc-sub-sec-" + style + "'><h3 class='fc-sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.HELP_SECTION, "</span></h3><div class='sub-sec-content fc-sub-sec-content'>");
                            jsHTML.push(helpText);
                            jsHTML.push("</div></div>");
                            jsHTML.push("</div>");
                        }
                    }
                }

                for (c = 0; c < comp.length; c++)
                {
                    if (comp[c].getElementsByTagName("Meaning")[0].childNodes[0].nodeValue == "PROCESS_MANAGEMENT")
                    {
                        var item = comp[c].getElementsByTagName("Item");
                        for (ch = 0; ch < item.length; ch++)
                        {
                            var display = item[ch].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
                            var id = item[ch].getElementsByTagName("ValueId")[0].childNodes[0].nodeValue;
                            calItems[ch] = id;
                            for (x = 0; x < systemValue.length; x++)
                            {
                                if (id == systemValue[x])
                                {
                                    display += i18n.SYSTEM_DEFAULT;
                                    break;
                                }
                            }
                            jsHTML.push("<input type='checkbox' name='ProcessMgmt' id=" + id + " value=" + id + " />" + display + "<br />");
                        }
                    }
                }

                var suggestedList = recordData.SUGGESTED;
                if (suggestedList.length > 0)
                {
                    jsHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='sub-sec-title'>", i18n.DOCUMENTED_SECTION, "</span></h3>")
                    for (var s = 0; s < suggestedList.length; s++)
                    {
                        jsHTML.push("<div class='sub-sec-content'>");
                        jsHTML.push(suggestedList[s].DISPLAY);
                        jsHTML.push("</div>");
                    }
                    jsHTML.push("</div></div>");
                }

                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

                if (component.getReadOnlyInd())
                {
                    CERN_PROCESSMANAGEMENT_O1.SetDisabled();
                }
                if (systemValue.length > 0)
                {
                    CERN_PROCESSMANAGEMENT_O1.SelectCheckbox(systemValue);
                }
                if ((m_em_charge_ind == 1) && (m_txtSavedXML.length > 0))
                {
                    var savedData = MP_Util.GetSavedXMLData(calItems);
                    if (savedData.length > 0)
                    {
                        CERN_PROCESSMANAGEMENT_O1.SelectCheckbox(savedData);
                    }
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
        },

        GetSelectedOptions: function ()
        {
            var retValue = [];
            retValue.length = 0;
            var options = document.getElementsByName('ProcessMgmt');

            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    retValue.push(options[i].value);
                }
            }
            return retValue;
        },

        SelectCheckbox: function (_value)
        {
            var paramValue = [];
            paramValue = _value;
            var options = document.getElementsByName('ProcessMgmt');
            for (var i = 0; i < options.length; i++)
            {
                options[i].checked = false;
                for (var x = 0; x < paramValue.length; x++)
                {
                    if (options[i].value == paramValue[x])
                    {
                        options[i].checked = true;
                    }
                }
            }
        },

        SetDisabled: function ()
        {
            var options = document.getElementsByName('ProcessMgmt');

            for (var i = 0; i < options.length; i++)
            {
                options[i].disabled = "disabled";
            }
        }
    };
} ();

/*
* Project: fnmp_visit_types_o1.js
* Version 1.0.0
*/
function VisitTypesComponentStyle()
{
    this.initByNamespace("vth");
}

VisitTypesComponentStyle.inherits(ComponentStyle);

function VisitTypesComponent(criterion)
{
    this.disablePref = 0;
    this.setCriterion(criterion);
    this.setStyles(new VisitTypesComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.VISITTYPES.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.VISITTYPES.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);
    this.setDisplay(true);
    this.m_vthReadOnly = false;
    this.m_EMComponentDispInd = true;

    VisitTypesComponent.method("InsertData", function ()
    {
        CERN_VISITTYPES_O1.RenderComponent(this, this.getRecordData());
    });
    VisitTypesComponent.method("VisitTypesData", function ()
    {
        return CERN_VISITTYPES_O1.GetVisitTypesData(this);
    });
    VisitTypesComponent.method("setReadOnlyInd", function (value)
    {
        this.m_vthReadOnly = value;
    });
    VisitTypesComponent.method("getReadOnlyInd", function ()
    {
        return this.m_vthReadOnly;
    });
    VisitTypesComponent.method("setDisplayComponentInd", function (value)
    {
        this.setCompDisplayInd(value);
    });
}

VisitTypesComponent.inherits(MPageComponent);

var CERN_VISITTYPES_O1 = function ()
{
    return {
        GetVisitTypesData: function (component)
        {
            var timerA = new Date();
            var criterion = component.getCriterion();
            var sendAr = [], dispInd = false;
            sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", m_CodingMPageFlag);

            var req = new MP_Core.ScriptRequest(component, "");
            req.setProgramName("fnmp_get_visit_types");
            req.setParameters(sendAr);
            req.setAsync(false);
            MP_Core.XMLCCLRequestCallBack(component, req, function (reply)
            {
                dispInd = CERN_VISITTYPES_O1.GetComponentsDispInd(component, reply);
            });
            var timerB = new Date();
            var loadVisitTypeComponent = (timerB.getTime() - timerA.getTime()) / 1000;
            logVT = "fnmp_get_visit_types:" + sendAr.join(",") + logSeperator + loadVisitTypeComponent;
            
            return (dispInd);
        },
        GetComponentsDispInd: function (component, reply)
        {
            var systemValue = "", recLen;
            var recordData = reply.getResponse();

            component.setRecordData(recordData);
            recLen = recordData.VISIT_INFO.length;
            if (recordData.AUTOMATED_ID)
            {
                systemValue = recordData.AUTOMATED_ID;
            }
            for (var j = 0, jl = recLen; j < jl; j++)
            {
                if (recordData.VISIT_INFO[j].UNIQUE_ID == systemValue && systemValue > 0)
                {
                    return false;
                }
            }
            return true;
        },
        RenderComponent: function (component, recordData)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [], systemValue = "", recLength;
                recLength = recordData.VISIT_INFO.length;
                if (recordData.AUTOMATED_ID)
                {
                    systemValue = recordData.AUTOMATED_ID;
                }
                jsHTML.push("<div class='vth-info'>");
                var helpText = i18n.VISIT_TYPES_ALERT;
                if (helpText.length > 0)
                {
                    jsHTML.push("<div style='display:none;' id='vth-sub-sec' class='vth-div'><div class='vth-comments'>"
									+ "<span class='vth-alert-icon'>&nbsp;</span><span class='vth-alert'>"
									+ helpText + "</span></div></div></div>");
                }

                jsHTML.push("<input type='radio' name='VisitTypes'  id='charges0' value='0' onclick='CERN_VISITTYPES_O1.GetSelectedOptions();'/>"
								+ i18n.STANDARD_ED_ENCOUNTER + "&nbsp;");
                for (var j = 0, jl = recLength; j < jl; j++)
                {
                    var cpt = recordData.VISIT_INFO[j].CPT;
                    if (cpt == "")
                    {
                        cpt = "-1";
                    }
                    var display = recordData.VISIT_INFO[j].DISPLAY;
                    var id = 'charges' + (j + 1);
                    if (recordData.VISIT_INFO[j].UNIQUE_ID == systemValue)
                    {
                        display += i18n.SYSTEM_DEFAULT;
                        jsHTML.push("<input type='radio' name='VisitTypes' id="
										+ id
										+ " value="
										+ cpt
										+ " checked='true' onclick='CERN_VISITTYPES_O1.GetSelectedOptions();'/>"
										+ display + "&nbsp;");
                        m_StdVisitType = false;

                    } else
                    {
                        jsHTML.push("<input type='radio' name='VisitTypes' id="
										+ id
										+ " value="
										+ cpt
										+ " onclick='CERN_VISITTYPES_O1.GetSelectedOptions();'/>"
										+ display + "&nbsp;");
                    }
                }
                jsHTML.push("</div>");

                sHTML = jsHTML.join("");
                MP_Util.Doc.FinalizeComponent(sHTML, component, countText);
                if (m_StdVisitType)
                {
                    $('input:radio[name=VisitTypes]')[0].checked = true;
                } else
                {
                    CERN_VISITTYPES_O1.GetSelectedOptions();
                }
                if (component.getReadOnlyInd())
                {
                    CERN_VISITTYPES_O1.SetDisabled();
                }

            } catch (err)
            {
                if (timerRenderComponent)
                {
                    timerRenderComponent.Abort();
                    timerRenderComponent = null;
                }
                throw (err);
            } finally
            {
                if (timerRenderComponent)
                    timerRenderComponent.Stop();
            }
        },

        GetSelectedOptions: function ()
        {
            var options = document.getElementsByName('VisitTypes');
            for (var i = 0; i < options.length; i++)
            {
                if (options[i].checked == true)
                {
                    if (options[i].value === "0")
                    {
                        $('#vth-sub-sec').css("display", "none");
                        MP_Util.Doc.EnableComponents();
                        m_StdVisitType = true;
                        return options[i].value;
                    } else
                    {
                        $('#vth-sub-sec').css("display", "block");
                        MP_Util.Doc.DitherComponents();
                        m_StdVisitType = false;
                        return options[i].value;
                    }
                }
            }

        },
        SetDisabled: function ()
        {
            var options = document.getElementsByName('VisitTypes');

            for (var i = 0; i < options.length; i++)
            {
                options[i].disabled = "disabled";
            }
        }
    };
} ();