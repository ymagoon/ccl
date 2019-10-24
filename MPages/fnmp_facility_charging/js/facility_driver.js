if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
{ //test for MSIE x.x;
    var ieVersion = new Number(RegExp.$1) // capture x.x portion and store as a number
}
else
{
    var ieVersion = 0;
}
var m_MPageCatMean = "MP_FACILITY_CHARGE";
var m_MPage;
var m_CodingMPageFlag = 1; //1 - Facility Coding MPage   2 - Urgent Care Coding MPage
var m_xmlFile = "FacilityCharging.xml";
var m_submitFlag = false;
var m_InfusionComp;
var m_ChargesComp;
var m_TrackingGroupCd;
var m_jsonTextPage;
var m_jsonTextComponent;

var m_xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
m_xmlDoc.async = "false";

var m_xmlPresentingProblem = new ActiveXObject("Microsoft.XMLDOM");
m_xmlPresentingProblem.async = "false";
m_xmlPresentingProblem.loadXML("<ComponentList><Component></Component></ComponentList>");

var m_txtSavedXML = "";
var m_txtChargesXML = ""
var tmpXMLTxt = "<Component></Component>";
var m_xmlIVs = new ActiveXObject("Microsoft.XMLDOM");
var m_xmlVisit = new ActiveXObject("Microsoft.XMLDOM");
var m_xmlDispCharges = new ActiveXObject("Microsoft.XMLDOM");
var m_xmlMods = new ActiveXObject("Microsoft.XMLDOM");
var m_savedXML = new ActiveXObject("Microsoft.XMLDOM");
var m_arrSavedLynxIDs = [];
var m_em_charge_ind = 0;
var m_iv_charge_ind = 0;
var m_lynxObject = null;

var loadRenderPage = 0;
var loadRenderWizard = 0;
var loadBedRockWizard = 0;
var loadSavedData = 0;
var loadBedRockPage = 0;
var loadBedrockII = 0;
var loadBedrockSummary = 0;
var loadComponentListPanel = 0;
var loadComponentListPanelA = 0;
var loadComponentListPanelB = 0;
var loadComponentListPanelC = 0;
var loadComponentListPanelD = 0;
var logSeperator = " ---- "
var logBRPage = "";
var logBRComp = "";
var logPP = "";
var logVT = "";
var logAM = "";
var logPM = "";
var logNA = "";
var logOM = "";
var logCC = "";
var logDP = "";
var logII = "";
var logCS = "";
var logChargeDriver = "";

var m_debug_ind = 0;
var wndDebugInfo = "";
var wndDebugSettings = "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=800, height=800";

//Begin Testing charges:
/*
m_txtSavedXML = "<Message><TransactionID>-123</TransactionID><EncID>126257</EncID><EncGuid>2040078f-27f9-44e0-80d1-bb2bf9f14b78</EncGuid>" +
"<Facility><ExternalCode>CERNERTEST1</ExternalCode><Name>Cerner Test Hospital</Name></Facility><Patient><Sex>M</Sex><DOB>01/01/1990</DOB>" +
"<AgeInDays>6574</AgeInDays><MedRecNum>-123</MedRecNum><LastName>-123</LastName></Patient><AccountNum>-123</AccountNum><AdmitDateTime>01/01/2008 14:00</AdmitDateTime>" +
"<DischargeDateTime>01/01/2008 20:00</DischargeDateTime><Visit><Type>ED</Type><CodeSet>TypeA</CodeSet><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime>01/01/2008 20:00</StopDateTime>" +
"<CalculatorItems>54110,54410,54510</CalculatorItems><CrCareMinutes>0</CrCareMinutes><CalculatedLevel>LVL2</CalculatedLevel><OverrideLevel>LVL0</OverrideLevel><Problem><LynxID>5429</LynxID><Name>Cardiac and/or Respiratory  Arrest</Name></Problem>" +
"</Visit><IVs><IV><IVSite>1</IVSite><IVType>Injection</IVType><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime>01/01/2008 17:00</StopDateTime><Medication><Name>Dilaudid</Name><Dosage></Dosage></Medication></IV>" +
"<IV><IVSite>1</IVSite><IVType>Injection</IVType><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime></StopDateTime><Medication><Name>Morphine</Name><Dosage></Dosage></Medication></IV></IVs>" +
"<Procedure><CPT>99282</CPT><CPTDescription>EMER DEPT LOW TO MODERATE SEVERITY</CPTDescription><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime>01/01/2008 20:00</StopDateTime><Units>1</Units><Source>ED</Source></Procedure>" +
"<Procedure><CPT>96374</CPT><CPTDescription>THER PROPH/DX NJX IV PUSH SINGLE/1ST SBST/DRUG</CPTDescription><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime></StopDateTime><Units>1</Units><Source>IV</Source></Procedure>" +
"<Procedure><CPT>96375</CPT><CPTDescription>THER PROPH/DX NJX EA SEQL IV PUSH SBST/DRUG</CPTDescription><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime></StopDateTime><Units>1</Units><Source>IV</Source></Procedure><Edits><Severity>0</Severity></Edits></Message>";
m_savedXML.loadXML(m_txtSavedXML);

m_txtChargesXML = "<Message><TransactionID>-123</TransactionID><EncID>126257</EncID><EncGuid>2040078f-27f9-44e0-80d1-bb2bf9f14b78</EncGuid>" +
"<Facility><ExternalCode>CERNERTEST1</ExternalCode><Name>Cerner Test Hospital</Name></Facility><Patient><Sex>M</Sex><DOB>01/01/1990</DOB>" +
"<AgeInDays>6574</AgeInDays><MedRecNum>-123</MedRecNum><LastName>-123</LastName></Patient><AccountNum>-123</AccountNum><AdmitDateTime>01/01/2008 14:00</AdmitDateTime>" +
"<DischargeDateTime>01/01/2008 20:00</DischargeDateTime><Visit><Type>ED</Type><CodeSet>TypeA</CodeSet><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime>01/01/2008 20:00</StopDateTime>" +
"<CalculatorItems>54110,54410,54510</CalculatorItems><CrCareMinutes>0</CrCareMinutes><CalculatedLevel>LVL2</CalculatedLevel><OverrideLevel>LVL0</OverrideLevel><Problem><LynxID>5429</LynxID><Name>Cardiac and/or Respiratory  Arrest</Name></Problem>" +
"</Visit><IVs><IV><IVSite>1</IVSite><IVType>Injection</IVType><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime>01/01/2008 17:00</StopDateTime><Medication><Name>Dilaudid</Name><Dosage></Dosage></Medication></IV>" +
"<IV><IVSite>1</IVSite><IVType>Injection</IVType><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime></StopDateTime><Medication><Name>Morphine</Name><Dosage></Dosage></Medication></IV></IVs>" +
"<Procedure><CPT>99282</CPT><CPTDescription>EMER DEPT LOW TO MODERATE SEVERITY</CPTDescription><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime>01/01/2008 20:00</StopDateTime><Units>1</Units><Source>ED</Source></Procedure>" +
"<Procedure><CPT>96374</CPT><CPTDescription>THER PROPH/DX NJX IV PUSH SINGLE/1ST SBST/DRUG</CPTDescription><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime></StopDateTime><Units>1</Units><Source>IV</Source></Procedure>" +
"<Procedure><CPT>96375</CPT><CPTDescription>THER PROPH/DX NJX EA SEQL IV PUSH SBST/DRUG</CPTDescription><StartDateTime>01/01/2008 14:00</StartDateTime><StopDateTime></StopDateTime><Units>1</Units><Source>IV</Source></Procedure><Edits><Severity>0</Severity></Edits></Message>";
m_xmlDispCharges.loadXML(m_txtChargesXML);
*/
//End testing charges

function RenderPage()
{
    var timerA = new Date();

    var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
    var timerMPage = MP_Util.CreateTimer("CAP: MPG Launch MPage");
    if (timerMPage)
        timerMPage.SubtimerName = m_MPageCatMean;

    var loc = criterion.static_content;
    var xmlLoc = "file://" + loc + "\\" + m_xmlFile;
    m_xmlDoc.load(xmlLoc);

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

    var loadingPolicy = new MP_Bedrock.LoadingPolicy();
    loadingPolicy.setLoadPageDetails(true);
    loadingPolicy.setLoadComponentBasics(true);
    loadingPolicy.setLoadComponentDetails(true);
    loadingPolicy.setCategoryMean(m_MPageCatMean)
    loadingPolicy.setCriterion(criterion);

    var timerW = new Date();
    var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, compFuncFilterMapping);
    m_Mpage = mPage;
    var timerX = new Date();
    loadBedRockPage = (timerX.getTime() - timerW.getTime()) / 1000;

    var fcInfo = new WizardComponent(criterion);
    fcInfo.setColumn(1);
    fcInfo.setLabel("Facility Charging");
    fcInfo.setExpanded(1);
    mPage.addComponent(fcInfo);
    mPage.setName(MPageName);
    mPage.setCustomizeEnabled(false);
    MP_Util.Doc.InitLayout(mPage);

    var timerB = new Date();
    mPage.components[0].GetWizard();
    var timerC = new Date();
    loadRenderWizard = (timerC.getTime() - timerB.getTime()) / 1000;

    var timerZ = new Date();
    loadRenderPage = (timerZ.getTime() - timerA.getTime()) / 1000;

    if (timerMPage)
        timerMPage.Stop();
}