if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
{ //test for MSIE x.x;
    var ieVersion = new Number(RegExp.$1) // capture x.x portion and store as a number
}
else
{
    var ieVersion = 0;
}

/**
*  variables to hold page load information.
*   m_MPageCatMean         : Initialized with catagory mean for the component.
*   m_CodingMPageFlag      : value to indicate TYpe of the coding flag.
*                               1 - Facility Coding MPage
*                               2 - Urgent Care Coding MPage
*   m_xmlFile              :name of the XML file used to define initial setting of the Page. 
**/
var m_MPageCatMean = "MP_ONC_INFUSION";//
var m_CodingMPageFlag = 2; 
var m_xmlFile = "ClinicCharging.xml";

var m_InfusionComp;
var m_ChargesComp;
var m_TrackingGroupCd;
var m_TransactionId;
var m_NameFirst;
var m_NameLast;
var m_Dob;
var m_AdmitDtTm;
var m_BegDtTm;
var m_FinClsCd;
var m_SexCd;
var m_EncounterId;
var m_component;
var m_FacilityCd;
var m_LynxWebUrl;
var m_delOptionIndex;
var m_localeName;

/**
*   XML DOM objects to perform XML read and write operations
*   m_xmlDoc                : XML object for billing module layout. 
*   m_xmlIVs                : XML object used for constructing IV information XML file. 
*   m_xmlVisit              : XML object used for constructing Visit tag in IV XML. 
*   m_xmlDispCharges        : XML object holding CPT data returned from LYNX service.
*   m_xmlMods               : XML object containing information regarding MOdifier values for Summary page. 
*   m_txtSavedXML           : XML object holding saved XML data.
*   m_xmlSubmitedOrders     : XML object holding information of submitted orders.
*   m_xmlLoadSubmitedOrders : XML object containing information regarding orders need to be submitted.
**/
var m_xmlDoc                = new ActiveXObject("Msxml2.DOMDocument.6.0");
var m_xmlIVs                = new ActiveXObject("Msxml2.DOMDocument.6.0");
var m_xmlVisit              = new ActiveXObject("Msxml2.DOMDocument.6.0");
var m_xmlDispCharges        = new ActiveXObject("Msxml2.DOMDocument.6.0");
var m_xmlMods               = new ActiveXObject("Msxml2.DOMDocument.6.0");
var m_txtSavedXML           = new ActiveXObject("Msxml2.DOMDocument.6.0");
var m_xmlSubmitedOrders     = new ActiveXObject("Msxml2.DOMDocument.6.0");
var m_xmlDeletedOrders      = new ActiveXObject("Msxml2.DOMDocument.6.0");
var m_xmlLoadSubmitedOrders = new ActiveXObject("Msxml2.DOMDocument.6.0");
var m_xmlLoaddeletedOrders  = new ActiveXObject("Msxml2.DOMDocument.6.0");
m_xmlDoc.async              = "false";

/**
*   global variales to hold data common accross the classes.
*   m_submitFlag            : holds status of submit button.
*   m_redrawInfusionPanel   : holds status orefresh action.
*   m_txtSavedXML           : holds XML string containing CPT codes saved in older sessions.
*   m_ChargingXml           : holds XML string defining billing module layout.
*   m_debug_ind             : flag value to indicate , mode of the script call.
*   m_PersonId              : person id for the opened encounter.
*   m_em_charge_ind         : flag to inidicate type of charge.
*   m_iv_charge_ind         : flag to inidicate type of charge.
*   m_submitedorderscount   : holds number of orders already sumbitted in previous sessions.
*   m_lynxObject            : activex object used to hold handle of the LYNX service call.
**/
var m_submitFlag            = false;
var m_redrawInfusionPanel   = false;
var m_txtSavedXML           = "";
var m_ChargingXml           = "";
var m_debug_ind 	        = 0;
var m_PersonId 		        = 0.00;
var m_em_charge_ind         = 0;
var m_iv_charge_ind         = 0;
var m_AutomateIvInd         = 0;
var m_submitedorderscount   = 0;
var m_numberofMedications   = 0;
var m_isOneOrderSubmitted	= false;
var m_lynxObject 	        = null;
var wndDebugInfo 	        = "";
var m_sortOrder				= "2";
var m_sortFlexer1			= false;
var m_sortFlexer2			= false;
var m_sortFlexer3			= false;
var m_bShowSubmittedOrders  = false;
var m_IsPageRefreshed       = false;
var m_bHideSubOrdersPref	= false;
var wndDebugSettings        = "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=800, height=800";

/**
*   arrays to hold multiple informations for the module.
*   m_DeletedRows               : holds id of deleteed row.
*   m_arrSavedLynxIDs           : holds CPT codes read from saved XML file. 
*   m_existingSubmitedorder     : holds submitted order ids if any exists for patient.
*   m_Medications_Orderid_Name  : holds name of the medication which is already submitted.
**/
var m_DeletedRows 	            = [];
var m_arrSavedLynxIDs           = [];
var m_existingSubmitedorder     = [];
var m_Medications_Orderid_Name  = [];
var m_deletedOrderIdsFromTable  = [];
var m_existingDeletedOrders     = [];
var m_statusofOrders            = [];
var m_SubmittedOrders           = [];
var m_SubmittedOrdersStatus     = [];
var m_SubmittedOrdersIds	    = [];
var m_ServiceDateTime		    = [];
var m_OrderAdminRoutes		    = [];
var m_deletedOrder 				= [];
var m_dServiceDates 			= [];
var m_startTzArr 				= [];
var m_stopTzArr		 			= [];

var m_ambiguousMsg				= i18n.AMBGUOUS_MSG
var m_dayLightBtn				= i18n.DAY_LIGHT
var m_StandardBtn				= i18n.STANDARD
var m_AmbTitle					= i18n.AMB_TITLE
var m_SubmitString				= i18n.STATUS_SUBMIT;
var m_NotSubmitString			= i18n.STATUS_NOT_SUBMIT;
var m_SelectedServiceDate 		= i18n.SELECT_ALL;
var m_startDateTimeSwitchValue	= "";
var m_stopDateTimeSwitchValue	= "";
var m_prevStDateTimeSwitchValue	= "";
var m_prevSpDateTimeSwitchValue	= "";
var m_utcOnOffInd				= 0;
var m_springFallStart			= "";
var m_curTimeZoneName			= "";

/**
*   XML file defining layout for th billing module
**/
m_ChargingXml               =   "<ComponentList><Component><Name>Infusion and Injection</Name><Meaning>INFUSION_INJECTION</Meaning>"+
                                "<Help>Infusion Injection help</Help><ItemList><Item><Name>Site</Name>"+
                                "<ValueId>IV1</ValueId><ValueId>IV2</ValueId><ValueId>IV3</ValueId>"+
                                "<ValueId>IV4</ValueId><ValueId>IM</ValueId><ValueId>SQ</ValueId>"+
                                "<ValueId>IA1</ValueId><ValueId>IA2</ValueId></Item>"+
                                "<Item><Name>Type</Name><Disp>Hydration</Disp><ValueId>HYDRATION</ValueId>"+
                                "<Disp>Infusion/Intraperitoneal</Disp><ValueId>INFUSION</ValueId>"+
                                "<Disp>IV Push/Intrathecal</Disp><ValueId>INJECTION</ValueId>"+
                                "<Disp>IM/SQ Injection</Disp><ValueId>IMSQ</ValueId>"+
                                "<Disp>Intra-Arterial Injection</Disp><ValueId>INTRAARTERIALINJECTION</ValueId>"+
								"<Disp>ChemoIVPump</Disp><ValueId>CHEMOIVPUMP</ValueId>"+
								"<Disp>ChemoArtPump</Disp><ValueId>CHEMOARTPUMP</ValueId>"+
                                "</Item></ItemList><IVInd><AutomateIV>false</AutomateIV></IVInd></Component>"+
                                "<Wizard><MPageName>Oncology Billing and Coding</MPageName>"+
                                "<PanelList><Name>Infusion &amp; Injections</Name><Name>Summary</Name>"+
                                "</PanelList></Wizard></ComponentList>";

/**
*   Initial function called from onc_charge_driver.prg to load the Billing module.
*   this function intern invokes Functions to featch initial configuration of page.
*   It gives call to fetch filters defined in BEDROCK for billing module.
*   Also a CAP timer will be calle to ensure page is loaded for user functionality.
**/
function RenderPage()
{
	var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
    var timerMPage = MP_Util.CreateTimer("CAP:MPG Launch Oncology Billing");
    
    if (timerMPage)
        timerMPage.Stop();

    m_xmlDoc.loadXML(m_ChargingXml);
    var pref = m_xmlDoc.getElementsByTagName("Wizard");
	
    var MPageName;
    for (var c = 0; c < pref.length; c++)
    {
        MPageName = pref[c].getElementsByTagName("MPageName")[0].childNodes[0].nodeValue;
    }

    // in order to retrieve the common styles for components, each consumer will have to create
    // a mapping of the potential bedrock component names to a common component name.
    var componentMapping = new Array(
    );

    //define function calls to filter means
    var pageFuncFilterMapping = new Array(
    );
    //define bedrock component filters
    var compFuncFilterMapping = new Array(
    );

    //Call Bedrock functions to fetch filter settings for Billing module.
    var loadingPolicy = new MP_Bedrock.LoadingPolicy();
    loadingPolicy.setLoadPageDetails(true);
    loadingPolicy.setLoadComponentBasics(true);
    loadingPolicy.setLoadComponentDetails(true);
    loadingPolicy.setCategoryMean(m_MPageCatMean)
    loadingPolicy.setCriterion(criterion);

    var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, compFuncFilterMapping);
    m_Mpage = mPage;

    var ccInfo = new WizardComponent(criterion);
    ccInfo.setColumn(1);
    ccInfo.setLabel("Oncology Charging");
    ccInfo.setExpanded(1);
    mPage.addComponent(ccInfo);
    mPage.setName(MPageName);
    mPage.setCustomizeEnabled(false);

    // Once after all the settiungs are loaded , render the component in given discern tab.
    MP_Util.Doc.InitLayout(mPage);
    mPage.components[0].GetWizard();
}