/**
* Project: facility_driver_comp.js
* Version 1.0.0
*/

function WizardComponentStyle()
{
    this.initByNamespace("wiz");
}

WizardComponentStyle.inherits(ComponentStyle);

var m_staticContent;
var datepicker;
var evaluationManagement = false;
var infusionInjection = false;
var additionalCharges = false; //later read from bedrock once component is completed
var m_iiSubmitCharges = false;
var m_iiMARModifyType = false;
var m_iiMARSite = false;
var m_iiMARDelete = false;
var m_StdVisitType = true;
var m_dispEMCompInd = true;
var m_allRefTextExpanded = true;
function WizardComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new WizardComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.FACILITY_CHARGE_WIZARD.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.FACILITY_CHARGE_WIZARD.O1 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);

    m_staticContent = criterion.static_content;

    WizardComponent.method("GetWizard", function ()
    {
        CERN_WIZARD_O1.RenderWizard(this);
    });
}

WizardComponent.inherits(MPageComponent);

var CERN_WIZARD_O1 = function ()
{
    var panelsToLoad = [];
    var panelHTML = "";
    var infusionPanel = "";
    var chargesPanel = "";
    var additionalChargesPanel = "";
    var loadingPolicy = new MP_Bedrock.LoadingPolicy();

    document.onkeydown = keydown;
    function keydown(evt)
    {
        if (!evt) evt = event;
        if (evt.shiftKey && evt.ctrlKey && evt.keyCode == 68)
        {
            if (m_debug_ind == 0)
            {
                m_debug_ind = 1;
                alert("Debug ON");
                var loadRenderWizardRest = (loadRenderWizard - (loadSavedData + loadBedRockWizard));
                var loadRenderPageRest = (loadRenderPage - (loadBedRockPage + loadRenderWizard));
                var loadBedRockWizardRest = (loadBedRockWizard - (loadComponentListPanel + loadBedrockII + loadBedrockSummary));
                wndDebugInfo = "Render Page:" + loadRenderPage + "\n" +
                               "--BedRockPage:" + loadBedRockPage + "\n" +
                               "--RenderWizard:" + loadRenderWizard + "\n" +
                               "----SavedData:" + loadSavedData + "\n" +
                               "----BedRockWizard:" + loadBedRockWizard + "\n" +
                               "------ComponentListPanel:" + loadComponentListPanel + "\n" +
                               "--------ComponentListPanelA:" + loadComponentListPanelA + "\n" +
                               "--------ComponentListPanelB:" + loadComponentListPanelB + "\n" +
                               "--------ComponentListPanelC:" + loadComponentListPanelC + "\n" +
                               "--------ComponentListPanelD:" + loadComponentListPanelD + "\n" +
                               "------II:" + loadBedrockII + "\n" +
                               "------Summary:" + loadBedrockSummary + "\n" +
                               "------BedRockWizardRest:" + loadBedRockWizardRest + "\n" +
                               "----WizardRest:" + loadRenderWizardRest + "\n" +
                               "--PageRest:" + loadRenderPageRest + "\n\n" + 
                               logBRPage + "\n\n" + 
                               logBRComp + "\n\n" +
                               logChargeDriver + "\n\n" +
                               logVT + "\n\n" +
                               logPP + "\n\n" +
                               logAM + "\n\n" +
                               logPM + "\n\n" +
                               logNA + "\n\n" +
                               logOM + "\n\n" +
                               logCC + "\n\n" +
                               logDP + "\n\n" +
                               logII + "\n\n" +
                               logCS;

                var wndDebug = window.open('', '', wndDebugSettings);
                wndDebug.document.title = m_MPageCatMean + ": Initial Load";
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
            else
            {
                m_debug_ind = 0;
                alert("Debug OFF");
            }
        }
    }

    function setPanelHeight()
    {
        $(window).resize(function ()
        {
            var windowh = $(window).height();
            var h = 0;
            var offset = 0;
            if (windowh < 400)
                offset = 125;
            else if (windowh < 600)
                offset = 85;
            else if (windowh < 900)
                offset = 120;
            else
                offset = 150;

            h = gvs();
            var hei = h[0] - offset;

            $(".jqw-panel-1").height(hei + "px");
            $(".jqw-panel-2").height(hei + "px");
            $(".jqw-panel-3").height(hei + "px");
            $(".jqw-panel-4").height(hei + "px");
            $(".jqw-panel-5").height(hei + "px");
        });
    }

    function documentEvents()
    {
        $(function ()
        {
            var d = $('#sampleWizard, #Div1').jQWizard();
        });
    }

    /* Facility Encoding Panel */
    function GetComponentsListPanel()
    {
        var timerA = new Date();
        
        var sHTML = "";
        var componentMapping = new Array(
            new MP_Core.MapObject("mp_fc_visit_types", VisitTypesComponent),
            new MP_Core.MapObject("mp_fc_present_prob", PresentingProblemsComponent),
            new MP_Core.MapObject("mp_fc_process_mgt", ProcessManagementComponent),
            new MP_Core.MapObject("mp_fc_order_mgt", OrderManagementComponent),
            new MP_Core.MapObject("mp_fc_nurse_assess", NursingAssessmentComponent),
            new MP_Core.MapObject("mp_fc_critical_care", CriticalCareComponent),
            new MP_Core.MapObject("mp_fc_disposition", DispositionComponent),
            new MP_Core.MapObject("mp_fc_arrival_mode", ArrivalModeComponent)
        );
        var pageFuncFilterMapping = new Array(
        );
        var compFuncFilterMapping = new Array(
            new MP_Core.MapObject('mp_fc_visit_types', '{"FUNCTIONS":[' +
            '{"FILTER_MEAN": "VT_READ_ONLY_IND", "NAME":"setReadOnlyInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
            '{"FILTER_MEAN": "VT_COMPONENT_IND", "NAME":"setDisplayComponentInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
            ']}'),
            new MP_Core.MapObject('mp_fc_present_prob', '{"FUNCTIONS":[' +
            '{"FILTER_MEAN": "PP_READ_ONLY_IND", "NAME":"setReadOnlyInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
            '{"FILTER_MEAN": "PP_COMPONENT_IND", "NAME":"setDisplayComponentInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
            '{"FILTER_MEAN": "PP_CONTAINS_IND", "NAME":"setContainsInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
            ']}'),
            new MP_Core.MapObject('mp_fc_arrival_mode', '{"FUNCTIONS":[' +
                '{"FILTER_MEAN": "AM_REF_EXPAND_IND", "NAME":"setReferenceTxtInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
                '{"FILTER_MEAN": "AM_READ_ONLY_IND", "NAME":"setReadOnlyInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
            ']}'),
            new MP_Core.MapObject('mp_fc_process_mgt', '{"FUNCTIONS":[' +
            '{"FILTER_MEAN": "PM_REF_EXPAND_IND", "NAME":"setReferenceTxtInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
            '{"FILTER_MEAN": "PM_READ_ONLY_IND", "NAME":"setReadOnlyInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
            ']}'),
            new MP_Core.MapObject('mp_fc_order_mgt', '{"FUNCTIONS":[' +
            '{"FILTER_MEAN": "OM_REF_EXPAND_IND", "NAME":"setReferenceTxtInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
            '{"FILTER_MEAN": "OM_READ_ONLY_IND", "NAME":"setReadOnlyInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
            ']}'),
            new MP_Core.MapObject('mp_fc_nurse_assess', '{"FUNCTIONS":[' +
            '{"FILTER_MEAN": "NA_REF_EXPAND_IND", "NAME":"setReferenceTxtInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
            '{"FILTER_MEAN": "NA_READ_ONLY_IND", "NAME":"setReadOnlyInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
            ']}'),
            new MP_Core.MapObject('mp_fc_critical_care', '{"FUNCTIONS":[' +
            '{"FILTER_MEAN": "CC_REF_EXPAND_IND", "NAME":"setReferenceTxtInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
            '{"FILTER_MEAN": "CC_READ_ONLY_IND", "NAME":"setReadOnlyInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
            ']}'),
            new MP_Core.MapObject('mp_fc_disposition', '{"FUNCTIONS":[' +
            '{"FILTER_MEAN": "DISP_REF_EXPAND_IND", "NAME":"setReferenceTxtInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
            '{"FILTER_MEAN": "DISP_READ_ONLY_IND", "NAME":"setReadOnlyInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
            ']}')
        );

        var timerB = new Date();
        loadComponentListPanelA = (timerB.getTime() - timerA.getTime()) / 1000;
        
        var timerC = new Date();
        var mPageComp = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, compFuncFilterMapping);
        var timerD = new Date();
        loadComponentListPanelB = (timerD.getTime() - timerC.getTime()) / 1000;

        var timerE = new Date();
        //Force Presenting Problem component to always be at top of page spanning full page
        var components = mPageComp.getComponents();
        for (var y = 0, yl = components.length; y < yl; y++)
        {
            components[y].setScope(-1);

            if (components[y] instanceof VisitTypesComponent)
            {
                components[y].setPageGroupSequence(1);
                if (components[y].isDisplayable())
                    m_dispEMCompInd = components[y].VisitTypesData();
            }
            else if (components[y] instanceof PresentingProblemsComponent)
            {
                components[y].setPageGroupSequence(2);
                evaluationManagement = components[y].getDisplayComponentInd();
            }
            else
            {
                components[y].setPageGroupSequence(3);
                if (components[y].isRefTxtExpanded() == false && m_allRefTextExpanded == true)
                {
                    m_allRefTextExpanded = false;
                }
            }
        }
        var timerF = new Date();
        loadComponentListPanelC = (timerF.getTime() - timerE.getTime()) / 1000;

        var timerG = new Date();
        if (evaluationManagement)
        {
            m_Mpage = mPageComp;
            sHTML = MP_Util.Doc.InitLayoutComponentWizard(mPageComp);
            var timerH = new Date();
            loadComponentListPanelD = (timerH.getTime() - timerG.getTime()) / 1000;
            return (sHTML);
        }
    }
    function GetInfusionInjection()
    {
        var sHTML = "";
        var componentMapping = new Array(
            new MP_Core.MapObject("mp_fc_inject_infuse", InjectionInfusionComponent)
        );
        var pageFuncFilterMapping = new Array(
        );
        var compFuncFilterMapping = new Array(
            new MP_Core.MapObject('mp_fc_inject_infuse', '{"FUNCTIONS":[' +
               '{"FILTER_MEAN": "INJECT_INFUSE_IND", "NAME":"setInjectInfuse", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
                '{"FILTER_MEAN": "AUTO_MED_MAR_IND", "NAME":"setMedfromMAR", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
                '{"FILTER_MEAN": "SITE_ADMIN_CDS", "NAME":"setSiteCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},' +
                '{"FILTER_MEAN": "MAR_MODIFY_TYPE_IND", "NAME":"setMARModifyTypeInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
                '{"FILTER_MEAN": "MAR_DELETE_IND", "NAME":"setMARDeleteInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
                '{"FILTER_MEAN": "MAR_SITE_IND", "NAME":"setMARSiteInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
                ']}')
        );

        var mPageComp = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, compFuncFilterMapping);
        if (infusionInjection)
        {
            var components = mPageComp.getComponents();
            for (var y = 0, yl = components.length; y < yl; y++)
            {
                if (components[y] instanceof InjectionInfusionComponent)
                {
                    components[y].setExpanded(true);
                    components[y].setScope(-1);
                }
            }
            m_InfusionComp = mPageComp;
            sHTML = MP_Util.Doc.InitLayoutComponentWizard(mPageComp);
        }
        return (sHTML);
    }

    function GetSummary()
    {
        var sHTML = "";
        var componentMapping = new Array(
            new MP_Core.MapObject("mp_fc_summary", FinalizeChargesComponent)
        );
        var pageFuncFilterMapping = new Array();
        var compFuncFilterMapping = new Array(
            new MP_Core.MapObject('mp_fc_summary', '{"FUNCTIONS":[' +
                '{"FILTER_MEAN": "EVAL_MGT_MOD_CDS", "NAME":"setEMModCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},' +
                '{"FILTER_MEAN": "INJECT_INFUSE_MOD_CDS", "NAME":"setIIModCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},' +
                '{"FILTER_MEAN": "SUBMIT_CHARGE_IND", "NAME":"setSubmitChargesInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
                ']}')
        );

        var mPageComp = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, compFuncFilterMapping);
        var components = mPageComp.getComponents();
        for (var y = 0, yl = components.length; y < yl; y++)
        {
            if (components[y] instanceof FinalizeChargesComponent)
            {
                components[y].setExpanded(true);
                components[y].setScope(-1);
            }
        }
        m_ChargesComp = mPageComp;
        sHTML = MP_Util.Doc.InitLayoutComponentWizard(mPageComp);

        return (sHTML);
    }

    function GetBedRockPrefs()
    {
        var sHTML = "";
        var xmlLoc = "file://" + m_staticContent + "\\" + m_xmlFile;
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.load(xmlLoc);
        var comp = xmlDoc.getElementsByTagName("Wizard");
        var panelList = comp[0].getElementsByTagName("PanelList");

        var js_criterion = JSON.parse(m_criterionJSON);
        var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);

        loadingPolicy.setLoadPageDetails(true);
        loadingPolicy.setLoadComponentBasics(true);
        loadingPolicy.setLoadComponentDetails(true);
        loadingPolicy.setCategoryMean(m_MPageCatMean);
        loadingPolicy.setCriterion(criterion);

        var timerA = new Date();
        sHTML = GetComponentsListPanel();
        var timerB = new Date();
        loadComponentListPanel = (timerB.getTime() - timerA.getTime()) / 1000;

        if (evaluationManagement)
        {
            panelsToLoad[panelsToLoad.length] = panelList[0].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
            panelHTML = "<div id='panel-fc' class='jqw-panel-" + panelsToLoad.length + "'>" + sHTML + "</div>";
        }

        var timerC = new Date();
        sHTML = GetInfusionInjection();
        var timerD = new Date();
        loadBedrockII = (timerD.getTime() - timerC.getTime()) / 1000;

        if (infusionInjection)
        {
            panelsToLoad[panelsToLoad.length] = panelList[0].getElementsByTagName("Name")[1].childNodes[0].nodeValue;
            infusionPanel = "<div id='panel-inf' class='jqw-panel-" + panelsToLoad.length + "'>" + sHTML + "</div>";
        }

        var timerE = new Date();
        sHTML = GetSummary();
        var timerF = new Date();
        loadBedrockSummary = (timerF.getTime() - timerE.getTime()) / 1000;

        panelsToLoad[panelsToLoad.length] = panelList[0].getElementsByTagName("Name")[2].childNodes[0].nodeValue;
        chargesPanel = "<div id='panel-charges' class='jqw-panel-" + panelsToLoad.length + "'>" + sHTML  + "</div>";

        if (additionalCharges)
        {
            panelsToLoad[panelsToLoad.length] = panelList[0].getElementsByTagName("Name")[3].childNodes[0].nodeValue;
            additionalChargesPanel = "<div id='panel-addtnl' class='jqw-panel-" + panelsToLoad.length + "'>" + CERN_ADDCHARGES_O1.CreateAddChargesPanel() + "</div>";
        }
        window.setTimeout("MP_Util.Doc.RenderLayout()", 0);
    }

    function GetSavedData(component)
    {
        var person_id = component.criterion.person_id;
        var enctr_id = component.criterion.encntr_id;
        var sendAr = [];
        sendAr.push("^MINE^," + person_id + ".0," + enctr_id + ".0");
        var req = new MP_Core.ScriptRequest(component, "");
        req.setProgramName("fnmp_charging_driver");
        req.setParameters(sendAr);
        req.setAsync(false);
        var timerA = new Date();
        MP_Core.XMLCCLRequestCallBack(component, req, function (reply)
        {
            var timerB = new Date();
            var loadChargeDriver = (timerB.getTime() - timerA.getTime()) / 1000;
            logChargeDriver = "fnmp_charging_driver:" + sendAr.join(",") + logSeperator + loadChargeDriver;
            var check1 = reply.getError();
            var recordData = reply.getResponse();
            if (check1 === "")
            {
                m_TrackingGroupCd = recordData.TRACKING_GROUP_CD;
                m_txtSavedXML = recordData.SAVED_XML;
                m_savedXML.loadXML(m_txtSavedXML);
                m_em_charge_ind = recordData.EM_CHARGE_IND;
                m_iv_charge_ind = recordData.IV_CHARGE_IND;

                if (m_txtSavedXML.length > 0)
                {
                    var item = m_savedXML.getElementsByTagName("Problem");
                    if (item.length > 0)
                    {
                        for (i = 0; i < item.length; i++)
                        {
                            m_arrSavedLynxIDs.push(item[i].getElementsByTagName("LynxID")[0].childNodes[0].nodeValue);
                        }
                    }
                }
            }
        });
    }
    return {
        RenderWizard: function (component)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [];

                document.documentElement.style.overflow = 'hidden';  // firefox, chrome
                document.body.scroll = "no"; // ie only 

                var timerF = new Date();
                GetSavedData(component);
                var timerG = new Date();
                loadSavedData = (timerG.getTime() - timerF.getTime()) / 1000;

                var timerD = new Date();
                GetBedRockPrefs();
                var timerE = new Date();
                loadBedRockWizard = (timerE.getTime() - timerD.getTime()) / 1000;

                jsHTML.push("<div id='sampleWizard' ><div id='wizHdr' class='wizHdr'><ul class='jqw-nav jqw-threeStep'>");

                if (panelsToLoad.length > 1)
                {
                    /*load the image for first panel*/
                    jsHTML.push("<li><span class='ind-left'>&#160;</span>"
                                + "<span class='ind-fc-center'>"
                                + "<span class='ind-text'>" + panelsToLoad[0] + "</span></span>"
                                + "<span class='ind-fsr-right'>&#160;&#160;</span></li>");

                    for (var i = 1; i < panelsToLoad.length - 1; i++)
                    {
                        jsHTML.push("<li><span class='ind-sc-center'>"
                                + "<span class='ind-center-text'>" + panelsToLoad[i] + "</span></span>"
                                + "<span class='ind-sr-right'>&#160;&#160;</span></li>");
                    }
                }

                /*load the image for last panel*/
                jsHTML.push("<li><span class='ind-sc-center'>"
                            + "<span class='ind-center-text'>" + panelsToLoad[panelsToLoad.length - 1] + "</span></span>"
                            + "<span class='ind-sre-right'>&#160;&#160;</span></li></ul></div><div class='wz-hdr' id='wz-hdr'></div>");
                //"<a id='expandSub' href='javascript:MP_Util.Doc.ExpandSubSectionCollapseAll();'>", i18n.EXPAND_SUB_SEC, "</a></div>");
                //"<input type='checkbox'  onclick='javascript:MP_Util.Doc.ExpandSubSectionCollapseAll();'/><span>&nbsp;</span><span id='expandSub'>"+i18n.EXPAND_SUB_SEC+"</span></div>" );

                jsHTML.push(panelHTML + infusionPanel + chargesPanel + additionalChargesPanel);
                jsHTML.push("<div class='jqw-buttons'> <button class='jqw-previous'><span>" + i18n.BACK + "</span></button> " +
                            "<button class='jqw-next'><span>" + i18n.NEXT + "</span></button>" +
                            "<button id='submitCharges' class='submitCharges'><span>" + i18n.SUBMIT_CHARGES + "</span>" +
                            "</button></div></div>");

                sHTML = jsHTML.join("");

                $("#disclaimer").after(sHTML);

                MP_Util.Doc.SetupExpandCollapseWizard();
                documentEvents();
                setPanelHeight();
                loadSubHeader(1);

                if (evaluationManagement || infusionInjection)
                    $('#wz-hdr').show();
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
