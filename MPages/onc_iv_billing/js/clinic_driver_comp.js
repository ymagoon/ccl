/**
* Project: clinic_driver_comp.js
* Version 1.0.0
*/
/**
*   Function to initialize wizard style.
*   Inherit the basic functionality of resize and scroll options from parent component.
**/
function WizardComponentStyle()
{
    this.initByNamespace("wiz");
}

WizardComponentStyle.inherits(ComponentStyle);

/**
*   Variables to hold values corresponding to respective file.
*   m_staticContent             : location where javascript file for the modules are stored.
*   datepicker                  : object to hold calender items.
*   evaluationManagement        : holds the display status for evaluation management tab. 
*   infusionInjection           : holds the display status for infusion and injection tab.
*   additionalCharges           : holds the display status for summary tab.
*   m_iiSubmitCharges           : flag holding filter value for "Submit charges BUtton".
*   m_iiMARModifyType           : flag holding filter value for "Modify Automated MAR Indicator".
*   m_iiMARDelete               : flag holding filter value for "Delete Automated MAR type Indicator".
*   m_StdVisitType              : flag inidcating visit type.
*   m_dispEMCompInd             : flag to indicate display of component.
*   m_allRefTextExpanded        : falg to inidicate status of reference information.
**/
var m_staticContent;
var datepicker;
var evaluationManagement = false;
var infusionInjection = true;
var additionalCharges = false; 
var m_iiSubmitCharges = false;
var m_iiMARModifyType = false;
var m_iiMARDelete = false;
var m_StdVisitType = true;
var m_dispEMCompInd = true;
var m_allRefTextExpanded = true;

/**
*   contsructor function for the component.
*   Also include ENG and USR timer information for the component.
*   This functiona is reponsible for constructing HTML layout of the page.
*   This function acts as entry and exit point for the component.
**/
function WizardComponent(criterion)
{
    this.setCriterion(criterion);
    this.setStyles(new WizardComponentStyle());
   	this.setComponentLoadTimerName("USR:MPG.ONC_CHARGE_WIZARD.01 - load component");
    this.setComponentRenderTimerName("ENG:MPG.ONC_CHARGE_WIZARD.01 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(2);

    m_staticContent = criterion.static_content;
	//alert(m_criterionJSON);
	var dateFormatObject = JSON.parse(m_criterionJSON);
	//alert(dateFormatObject.CRITERION.LOCALE_NAME);
	m_localeName = dateFormatObject.CRITERION.LOCALE_NAME;
	
	m_startDateTimeSwitchValue	= dateFormatObject.CRITERION.CURTZ_NAME;
	
	m_stopDateTimeSwitchValue	= dateFormatObject.CRITERION.CURTZ_NAME;
	
	m_utcOnOffInd =  dateFormatObject.CRITERION.UTCON_IND;
	
	m_curTimeZoneName = dateFormatObject.CRITERION.CURTZ_NAME;
	
	m_prevStDateTimeSwitchValue	= m_curTimeZoneName;
	
	m_prevSpDateTimeSwitchValue	= m_curTimeZoneName;

    WizardComponent.method("GetWizard", function ()
    {
        CERN_WIZARD_O1.RenderWizard(this);
    });
}

WizardComponent.inherits(MPageComponent);

/**
*   Name space under which all the functions are configured.
*   Below are the list of functions available under this name-space.
*   keydown()               : handles debug option for module.(Shift+Ctrl+Alt+D).
*   setPanelHeight()        : handles sizing of page content on user actions.
*   GetInfusionInjection()  : handles fetching of bedrock setting for infusion and injection panel.
*   GetSummary()            : handles fetching of bedrock setting for summary panel.
*   GetBedRockPrefs()       : retrives general settings for Module.
*   GetSavedData()          :retrives saved XML file having submitted orders, if exists for the encounter.
**/
var CERN_WIZARD_O1 = function ()
{
    var panelsToLoad = [];
    var panelHTML = "";
    var infusionPanel = "";
    var chargesPanel = "";
    var additionalChargesPanel = "";
    var loadingPolicy = new MP_Bedrock.LoadingPolicy();

    document.onkeydown = keydown;
    /**
    *   This function is used for turning debug indicator ON/OFF.
    *   After all the values are fetched corresponding setter functions will be called.
    *   Shift+Ctrl+Alt+D : ON/OFF.
    **/
    function keydown(evt)
    {
        if (!evt) evt = event;
        if (evt.shiftKey && evt.ctrlKey && evt.altKey && evt.keyCode == 68)
        {
            if (m_debug_ind == 0)
            {
                m_debug_ind = 1;
                alert("Debug ON");
            }
            else
            {
                m_debug_ind = 0;
                alert("Debug OFF");
            }
        }
    }
    /**
    *   This function is used for overiding browsewr resize functionality.
    **/
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
    /**
    *   This function is used handling DOM events triggered from Module.
    **/
    function documentEvents()
    {
        $(function ()
        {
            var d = $('#sampleWizard, #Div1').jQWizard();
        });
    }
    /**
    *   This function will featch the filter values for the Infusion and injection panel.
    *   After all the values are fetched corresponding setter functions will be called.
    *   AUTO_MED_MAR_IND    : Filetr to indicate fetch value in automate mode.
    *   SITE_ADMIN_CDS      : Filetr for "Medication Site of Administarion".
    *   MAR_MODIFY_TYPE_IND : Filetr for "Modify automated MAR type Indicator".
    *   MAR_DELETE_IND      : Filetr for "Delete automated MAR type Indicator".
    **/
    function GetInfusionInjection()
    {
        var sHTML = "";
        var componentMapping = new Array(
            new MP_Core.MapObject("mp_cc_inject_infuse", InjectionInfusionComponent)
        );
        var pageFuncFilterMapping = new Array(
        );
        var compFuncFilterMapping = new Array(
            new MP_Core.MapObject('mp_cc_inject_infuse', '{"FUNCTIONS":[' +
               '{"FILTER_MEAN": "INJECT_INFUSE_IND", "NAME":"setInjectInfuse", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
                '{"FILTER_MEAN": "AUTO_MED_MAR_IND", "NAME":"setMedfromMAR", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
                '{"FILTER_MEAN": "SITE_ADMIN_CDS", "NAME":"setSiteCodes", "TYPE":"Array", "FIELD": "PARENT_ENTITY_ID"},' +
                '{"FILTER_MEAN": "MAR_MODIFY_TYPE_IND", "NAME":"setMARModifyTypeInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"},' +
                '{"FILTER_MEAN": "MAR_DELETE_IND", "NAME":"setMARDeleteInd", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}' +
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
    /**
    *   This function will featch the filter values for the summary panel.
    *   After all the values are fetched corresponding setter functions will be called.
    *   INJECT_INFUSE_MOD_CDS  :  Filetr for "Modifier Values".
    *   SUBMIT_CHARGE_IND      :  Filetr for "Submit" button indicator.
    **/
    function GetSummary()
    {
        var sHTML = "";
        var componentMapping = new Array(
            new MP_Core.MapObject("mp_cc_summary", FinalizeChargesComponent)
        );
        var pageFuncFilterMapping = new Array();
        var compFuncFilterMapping = new Array(
            new MP_Core.MapObject('mp_cc_summary', '{"FUNCTIONS":[' +
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

    /**
    *   This function will fetch the filter values billing module.
    *   THis function intern gives call to GetInfusionInjection() to fetch 
    *   filters for initial load of the componet.
    *   once all th efilters are loaded. Function will next reads chargingXML file
    *   which contains page layout for module.
    **/
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
       
        sHTML = "";

        sHTML = GetInfusionInjection();

        if (infusionInjection)
        {
            panelsToLoad[panelsToLoad.length] = panelList[0].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
            infusionPanel = "<div id='panel-inf' class='jqw-panel-" + panelsToLoad.length + "'>" + sHTML + "</div>";
        }
        panelsToLoad[panelsToLoad.length] = panelList[0].getElementsByTagName("Name")[1].childNodes[0].nodeValue;
        chargesPanel = "<div id='panel-charges' class='jqw-panel-" + panelsToLoad.length + "'>" + GetSummary() + "</div>";
		
        window.setTimeout("MP_Util.Doc.RenderLayout()", 0);
    }

    /**
    *   This function is used to get the initial display data for the selected encounter.
    *   this function invokes "onc_charging_driver.prg" to fetch the data for encounter.
    **/
    function GetSavedData(component)
    {
        var person_id = component.criterion.person_id;
        var enctr_id = component.criterion.encntr_id;
		var position_cd = component.criterion.position_cd;
		m_EncounterId = enctr_id;
		m_PersonId = person_id;
        var sendAr = [];
        sendAr.push("^MINE^," + person_id + ".00," + enctr_id + ".00",position_cd+".00");
        var req = new MP_Core.ScriptRequest(component, "");			
		req.setProgramName("onc_charging_driver");
        req.setParameters(sendAr);									
        req.setAsync(false);
        MP_Core.XMLCCLRequestCallBack(component, req, function (reply)
        {
            var check1 = reply.getError();
            var recordData = reply.getResponse();
            if (check1 === "")
            {
				if(recordData.HIDE_SUB_ORD == 1){
					m_bHideSubOrdersPref = true;					
				}
				m_TrackingGroupCd = recordData.TRACKING_GROUP_CD;
                m_txtSavedXML = recordData.SAVED_XML;
				m_TransactionId = recordData.TRANSACTION_ID;
				m_NameFirst = recordData.NAMEFIRST;
				m_NameLast = recordData.NAMELAST;
				m_Dob = recordData.DOB;
				m_AdmitDtTm = recordData.ADMITDTTM;
				m_BegDtTm = recordData.BEGDTTM;
				m_FinClsCd = recordData.FINCLSCD;
				m_SexCd = recordData.SEX; 
				m_FacilityCd = recordData.FACILITY_CODE;				
				m_LynxWebUrl = recordData.WEB_SRV_URL;				
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
        /**
        *   This is the first function which will be called from onc_iv_driver.
        *   this function intern give call to below functions which are avaible in CERN_WIZARD_O1 namespace.
        *   this fucntion reeturns the complete HTML file which needs to be rendered in called DiscernTab for user action.
        *   Also this function loads basic expand and collapse setting of the component.
        **/
        RenderWizard: function (component)
        {
            var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName());
            try
            {
                var sHTML = "", countText = "", jsHTML = [];

                document.documentElement.style.overflow = 'hidden';  // firefox, chrome
                document.body.scroll = "no"; // ie only 
                GetSavedData(component);
                GetBedRockPrefs();

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
               
                jsHTML.push(/*panelHTML + */infusionPanel + chargesPanel /*+ additionalChargesPanel*/);
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

                if (infusionInjection)
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
