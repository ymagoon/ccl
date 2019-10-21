/*~BB~*************************************************************************
 *                                                                       *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
 *                              Technology, Inc.                         *
 *       Revision      (c) 1984-2011 Cerner Corporation                  *
 *                                                                       *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.          *
 *  This material contains the valuable properties and trade secrets of  *
 *  Cerner Corporation of Kansas City, Missouri, United States of        *
 *  America (Cerner), embodying substantial creative efforts and         *
 *  confidential information, ideas and expressions, no part of which    *
 *  may be reproduced or transmitted in any form or by any means, or     *
 *  retained in any storage or retrieval system without the express      *
 *  written permission of Cerner.                                        *
 *                                                                       *
 *  Cerner is a registered mark of Cerner Corporation.                   *
 *                                                                       *
 * 1. Scope of Restrictions                                              *
 *  A.  Us of this Script Source Code shall include the right to:        *
 *  (1) copy the Script Source Code for internal purposes;               *
 *  (2) modify the Script Source Code;                                   *
 *  (3) install the Script Source Code in Client?s environment.          *
 *  B. Use of the Script Source Code is for Client?s internal purposes   *
 *     only. Client shall not, and shall not cause or permit others, to  *
 *     sell, redistribute, loan, rent, retransmit, publish, exchange,    *
 *     sublicense or otherwise transfer the Script Source Code, in       *
 *     whole or part.                                                    *
 * 2. Protection of Script Source Code                                   *
 *  A. Script Source Code is a product proprietary to Cerner based upon  *
 *     and containing trade secrets and other confidential information   *
 *     not known to the public. Client shall protect the Script Source   *
 *     Code with security measures adequate to prevent disclosures and   *
 *     uses of the Script Source Code.                                   *
 *  B. Client agrees that Client shall not share the Script Source Code  *
 *     with any person or business outside of Client.                    *
 * 3. Client Obligations                                                 *
 *  A. Client shall make a copy of the Script Source Code before         *
 *     modifying any of the scripts.                                     *
 *  B. Client assumes all responsibility for support and maintenance of  *
 *     modified Script Source Code.                                      *
 *  C. Client assumes all responsibility for any future modifications to *
 *     the modified Script Source Code.                                  *
 *  D. Client assumes all responsibility for testing the modified Script *
 *     Source Code prior to moving such code into Client?s production    *
 *     environment.                                                      *
 *  E. Prior to making first productive use of the Script Source Code,   *
 *     Client shall perform whatever tests it deems necessary to verify  *
 *     and certify that the Script Source Code, as used by Client,       *
 *     complies with all FDA and other governmental, accrediting, and    *
 *     professional regulatory requirements which are applicable to use  *
 *     of the scripts in Client's environment.                           *
 *  F. In the event Client requests that Cerner make further             *
 *     modifications to the Script Source Code after such code has been  *
 *     modified by Client, Client shall notify Cerner of any             *
 *     modifications to the code and will provide Cerner with the        *
 *     modified Script Source Code. If Client fails to provide Cerner    *
 *     with notice and a copy of the modified Script Source Code, Cerner *
 *     shall have no liability or responsibility for costs, expenses,    *
 *     claims or damages for failure of the scripts to function properly *
 *     and/or without interruption.                                      *
 * 4. Limitations                                                        *
 *  A. Client acknowledges and agrees that once the Script Source Code is*
 *     modified, any warranties set forth in the Agreement between Cerner*
 *     and Client shall not apply.                                       *
 *  B. Cerner assumes no responsibility for any adverse impacts which the*
 *     modified Script Source Code may cause to the functionality or     *
 *     performance of Client?s System.                                   *
 *  C. Client waives, releases, relinquishes, and discharges Cerner from *
 *     any and all claims, liabilities, suits, damages, actions, or      *
 *     manner of actions, whether in contract, tort, or otherwise which  *
 *     Client may have against Cerner, whether the same be in            *
 *     administrative proceedings, in arbitration, at law, in equity, or *
 *     mixed, arising from or relating to Client?s use of Script Source  *
 *     Code.                                                             *
 * 5. Retention of Ownership                                             *
 *    Cerner retains ownership of all software and source code in this   *
 *    service package. Client agrees that Cerner owns the derivative     *
 *    works to the modified source code. Furthermore, Client agrees to   *
 *    deliver the derivative works to Cerner.                            *
 ~BE~************************************************************************/
/******************************************************************************

 Source file name:       dc_mp_qual_meas.js

 Product:                Discern Content
 Product Team:           Discern Content

 File purpose:           Provides data to the MPage Quality Measures.

 Special Notes:          <add any special notes here>
 ;~DB~************************************************************************************************
 ;*                      GENERATED MODIFICATION CONTROL LOG                                         *
 ;****************************************************************************************************
 ;*                                                                                                 *
 ;*Mod  Date        Engineer                    Feature         Comment                             *
 ;*---  ----------  ------------------------    ------------    ----------------------------------- *
 ;*000  03/05/2009  Ramkumar Bommireddipalli                    Initial Release.                    *
 ;*001      06/03/2009  Ramkumar Bommireddipalli                    NHIQM 2.0 Updates.                  *
 ;*002      06/12/2009  Ramkumar Bommireddipalli                    Assigning relationships to          *
 ;                                                              patients with qualifying data.      *
 ;*003  07/30/2009  Ramkumar Bommireddipalli                    NHIQM 3.0 Updates.                  *
 ;*004  08/26/2009  Ramkumar Bommireddipalli                    Added Pediatric Falls column.       *
 ;*005  09/22/2009  Ramkumar Bommireddipalli                    Fixed Issue with FIN/MRN display.   *
 ;*006  10/05/2009  Ramkumar Bommireddipalli                    Fixed Expanded row display issue.   *
 ;*007  10/28/2009  Ramkumar Bommireddipalli                    Updates to Falls Section Hovers.    *
 ;*008  02/01/2010  Niklas Forsberg                             Replaced XML with JSON.             *
 ;*009  04/16/2010  Niklas Forsberg                             Fixed FIN/MRN column.               *
 ;*010  07/07/2010  Niklas Forsberg                             NHIQM 3.2 Updates                   *
 ;*011  10/01/2010  Niklas Forsberg                             Pressure Ulcer Updates              *
 ;*012  11/30/2010  Niklas Forsberg                             Pediatric Pain                      *                                                                                   *
 ;*014* 12/10/2010  Christopher Canida                          Pediatric Skin *skipped to 14       *
 ;*015  01/07/2011  Christopher Canida                          Enhancements for version 3.3        *
 ;*016  08/31/2011  Allison Wynn                                Enhancements 4.0 - Adding Bedrock   *
 ;                                                              filter/Preference to determine      *
 ;                                                              # of columns to open on page load   *
 ;*017  09/01/2011  Allison Wynn                                Adding tab name from ccl script     *
 ;                                                              dc_mp_get_patients2.prg             *
 ;*018  06/27/2012  Bill Dean                                   CRI Modifications                    *
 ;~DE~************************************************************************************************
 ;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *******************************************/
//Global Variables
var pageCNT = 0;
var tabNameSTRG = " "; //017 adding variable for tab name
//var colNum = 0; //016 hold value for number of columns

//used when looping over all display indicators and creating the html tables for display
//should be at least as big as the total number of conditions the organizer is capable of supporting
var numberOfConditions = 26

var oColHdrs = [];
var patData = [];

var sixColHdrs = [i18n.condHdr.AMI,i18n.condHdr.HEART_FAILURE,i18n.condHdr.PNEUMONIA,i18n.condHdr.CHILDRENS_ASTHMA,i18n.condHdr.VTE,i18n.condHdr.STROKE,i18n.condHdr.SCIP,i18n.condHdr.IMM,i18n.condHdr.TOB,i18n.condHdr.SUB,i18n.condHdr.PC,i18n.condHdr.HBIPS,i18n.condHdr.SEPSIS,i18n.condHdr.HS];
var threeColHdrs = ['PressureUlcers','CRI','Falls','FallsPediatric','Pain','PedPain'];
var fourColHdrs = ['pSkin'];


var amiSecNm = "AMI";
var hfSecNm = "HF";
var pnSecNm = "PN";
var cacSecNm = "CAC";
var vteSecNm = "VTE";
var stkSecNm = "STK";
var scipSecNm = "SCIP";
var immSecNm = "IMM";
var tobSecNm = "TOB";
var subSecNm = "SUB";
var pcSecNm = "PC";
var hbipsSecNm = "HBIPS";
var sepsisSecNm = "SEPSIS";
var hsSecNm = "HS";

var condName = [amiSecNm, cacSecNm, hbipsSecNm, hfSecNm, hsSecNm, immSecNm, pcSecNm, pnSecNm, scipSecNm, sepsisSecNm, stkSecNm, subSecNm, tobSecNm, vteSecNm]; // The order is alphabetic
var sixColAbbr = [amiSecNm, hfSecNm, pnSecNm, cacSecNm, vteSecNm, stkSecNm, scipSecNm, immSecNm, tobSecNm, subSecNm, pcSecNm, hbipsSecNm, sepsisSecNm, hsSecNm];
var amiSbHdrDispArray = ['patientED','patientIn','patientDischarge','patientPreOp','patientPostOp','patientStatus'];
var hrtFailSbHdrDispArray = ['cellHeartFailureRowSpan','patientInHeartFailure','patientDischargeHeartFailure','patientPreOpHeartFailure','patientPostOpHeartFailure','patientStatusHeartFailure'];
var pneuSbHdrDispArray = ['cellPneumoniaRowSpan','patientInPneumonia','patientDischargePneumonia','patientPreOpPneumonia','patientPostOpPneumonia','patientStatusPneumonia'];
var cacSbHdrDispArray = ['cellChildrenAsthmaRowSpan','patientInChildrensAsthma','patientDischargeChildrensAsthma','patientPreOpChildrensAsthma','patientPostOpChildrensAsthma','patientStatusChildrensAsthma'];
var vteSbHdrDispArray = ['cellVTERowSpan','patientInVTE','patientDischargeVTE','patientPreOpVTE','patientPostOpVTE','patientStatusVTE'];
var strokeSbHdrDispArray = ['cellStrokeRowSpan','patientInStroke','patientDischargeStroke','patientPreOpStroke','patientPostOpStroke','patientStatusStroke'];
var scipSbHdrDispArray = ['cellSCIPRowSpan','patientInSCIP','patientDischargeSCIP','patientPreOpSCIP','patientPostOpSCIP','patientStatusSCIP'];
var pressUlcrSbHdrDispArray = ['cellPressureUlcersRowSpan','patientInterventionPressureUlcers','patientFallsPressureUlcers'];
var criSbHdrDispArray = ['cellCRIRowSpan','patientInterventionCRI','patientFallsCRI'];
var fallsSbHdrDispArray = ['cellFallsRowSpan','patientInterventionFalls','patientFallsFalls'];
var pedFallsSbHdrDispArray = ['cellFallsPediatricRowSpan','patientInterventionPediatric','patientFallsFallsPediatric'];
var painSbHdrDispArray = ['cellPainRowSpan','patientInterventionPain','patientPainPain'];
var pedPainSbHdrDispArray = ['cellPedPainRowSpan','patientInterventionPedPain','patientPainPedPain'];
var pSkinSbHdrDispArray = ['cellpSkinRowSpan','patientIAssessmentpSkin','patientInterventionpSkin','patientImpairmentpSkin'];
var immSbHdrDispArray = ['cellImmRowSpan','patientInImm','patientDischargeImm','patientPreOpImm','patientPostOpImm','patientStatusImm'];
var tobSbHdrDispArray = ['cellTobRowSpan','patientInTob','patientDischargeTob','patientPreOpTob','patientPostOpTob','patientStatusTob'];
var subSbHdrDispArray = ['cellSubRowSpan','patientInSub','patientDischargeSub','patientPreOpSub','patientPostOpSub','patientStatusSub'];
var pcSbHdrDispArray = ['cellPcRowSpan','patientInPc','patientDischargePc','patientPreOpPc','patientPostOpPc','patientStatusPc'];
var hbipsSbHdrDispArray = ['cellHbipsRowSpan','patientInHbips','patientDischargeHbips','patientPreOpHbips','patientPostOpHbips','patientStatusHbips'];
var sepsisSbHdrDispArray = ['cellSepsisRowSpan','patientInSepsis','patientDischargeSepsis','patientPreOpSepsis','patientPostOpSepsis','patientStatusSepsis'];
var hsSbHdrDispArray = ['cellHSRowSpan','patientInHS','patientDischargeHS','patientPreOpHS','patientPostOpHS','patientStatusHS'];

var conditionLists = [] // contains list of conditions that was set to turn on
var statusLists = [i18n.Assess, i18n.Incomplete, i18n.Complete];
var json_listOfPatients = "";
var hfJSONObj;

var rowTotal = 25;

var areHiddenRows = false;
var justUnHidRows = false;
var blnCRIDisplayed = false;
var blnFallsDisplayed = false;
var blnFallsPedDisplayed = false;
var blnPainDisplayed = false;
var blnPressUlcersDisplayed = false
var blnPedPainDisplayed = false;
var blnpSkinDisplayed = false;

var strPatientDemog = "";

var lastSortField = "";

var noPatient = i18n.NO_PATIENTS_IN_LIST;
var noQualPatient = i18n.NO_QUALIFYING_PATIENTS;

/**
 * Initializes the web page
 */
function initPage(){
    //Get Patient Lists.
    getPrefParam();
    getPatientLists();
}

function getConditionLists(lists) {
    //conditionLists = [amiDisplayIndicator
    //                            , cacDisplayIndicator
    //                            , hbipsDisplayIndicator
    //                            , heartFailureDisplayIndicator
    //                            , immDisplayIndicator
    //                            , pcDisplayIndicator
    //                            , pneumoniaDisplayIndicator
    //                            , scipDisplayIndicator
    //                            , strokeDisplayIndicator
    //                            , subDisplayIndicator
    //                            , tobDisplayIndicator
    //                            , vteDisplayIndicator
    //]
    if (lists && lists.length > 0) {
        var optn = "";
        try {
            for (var intCounter = 0; intCounter < lists.length; intCounter++) {
                //Add values to the condition dropdown list.
                if (lists[intCounter] !== '0') {
                    optn = document.createElement("option");
                    optn.text = condName[intCounter];
                    optn.value = condName[intCounter];
                    document.frmQualityMeasure.conLists.options.add(optn);
                }
            }
        }
        catch (error) {
            showErrorMessage(error.message, "getConditionLists", "","");
        }
    }
}
function verifyMyCondList(dropdownList) {
    try {
        var validCond = false;
        for (var i = 0; i < condName.length && !validCond; i++) {
            if (condName[i] === dropdownList.value) {
                validCond = true;
            }
        } 
        if (validCond || dropdownList.value === "All") {  
            Windowstorage.set("selectedCond", dropdownList.value);
        }
        Windowstorage.set("selectedStat", "All");
        if (dropdownList.value === "All") {
            // Remove statuses except All
            getStatusLists();
            window.location.reload(true);
        }
        else {
            resetVariables();
            noPatient = i18n.NO_COND_QUALIFYING_PATIENTS;
            noQualPatient = i18n.NO_COND_QUALIFYING_PATIENTS;
            // Add value to Status drop down list, only add once
            if (document.getElementById("statLists").length === 1) {
                getStatusLists(statusLists);
            }
            // Force status select back to All
            document.getElementById("statLists").options[0].selected = true;
            getPrefParam();
            getPatientLists();
        }
    }
    catch (error) {
        showErrorMessage(error.message, "verifyMyCondList", "", "");
    }
}

function getStatusLists(lists) {
    try{
        if (lists) {
            var optn = "";
            for (var i = 0; i < lists.length; i++) {
                optn = document.createElement("option");
                optn.text = lists[i];
                optn.value = lists[i];
                document.frmQualityMeasure.statLists.options.add(optn);
            }
        }
        else {
            // Remove option in status list
            for (var i = 1; i < document.getElementById("statLists").length; i++) {
                document.frmQualityMeasure.statLists.options.remove(i);
            }
        }
    }
    catch (error) {
        showErrorMessage(error.message, "getStatusLists", "", "");
    }
}
function verifyMyStatList(dropdownList) {
    try {
        var validCond = false;
        for (var i = 0; i < statusLists.length && !validCond; i++) {
            if (statusLists[i] === dropdownList.value) {
                validCond = true;
            }
        } 
        if (validCond || dropdownList.value === "All") {
            Windowstorage.set("selectedStat", dropdownList.value);
        }
        resetVariables();
        noPatient = i18n.NO_STAT_QUALIFYING_PATIENTS;
        noQualPatient = i18n.NO_STAT_QUALIFYING_PATIENTS;
        getPrefParam();
        getPatientLists();
    }
    catch (error) {
        showErrorMessage(error.message, "verifyMyStatList", "", "");
    }
}

function resetVariables() {
    try {
        //Clear Time Outs.
        clearTimeout(intTimeOutID);
        clearTimeout(intTimeOutID2);

        ////reset div.
        document.getElementById("divMainTable").innerHTML = "";
        //Reset HIDDEN values.
        hiddenExpandCollapse                = 1;
        hiddenHeartFailureExpandCollapse    = 1;
        hiddenPneumoniaExpandCollapse       = 1;
        hiddenChildrensAsthmaExpandCollapse = 1;
        hiddenVTEExpandCollapse             = 1;
        hiddenStrokeExpandCollapse          = 1;
        hiddenSCIPExpandCollapse            = 1;
        hiddenPressureUlcersExpandCollapse  = 1;
        hiddenCRIExpandCollapse             = 1;
        hiddenFallsExpandCollapse           = 1;
        hiddenFallsPediatricExpandCollapse  = 1;
        hiddenPainExpandCollapse            = 1;
        hiddenPedPainExpandCollapse         = 1;
        hiddenImmExpandCollapse             = 1;
        hiddenTobExpandCollapse             = 1;
        hiddenSubExpandCollapse             = 1;
        hiddenPCExpandCollapse              = 1;
        hiddenHBIPSExpandCollapse           = 1;
        hiddenSEPSISExpandCollapse          = 1;
        hiddenHSExpandCollapse              = 1;// Reset hidden indicator in Windowstorage
        //ami
        Windowstorage.set("AmiHidden", '0');
        //hf
        Windowstorage.set("HfHidden", '0');
        //pneumonia
        Windowstorage.set("PnHidden", '0');
        //cac
        Windowstorage.set("CacHidden", '0');
        //vte
        Windowstorage.set("VteHidden", '0');
        //stroke
        Windowstorage.set("StrokeHidden", '0');
        //scip
        Windowstorage.set("ScipHidden", '0');
        //pressure ulcers
        Windowstorage.set("PuHidden", '0');
        //cri
        Windowstorage.set("CriHidden", '0');
        //falls
        Windowstorage.set("FallsHidden", '0');
        //peds falls
        Windowstorage.set("PfallHidden", '0');
        //pain
        Windowstorage.set("PainHidden", '0');
        //peds pain
        Windowstorage.set("PpainHidden", '0');
        //peds skin
        Windowstorage.set("PskinHidden", '0');
        //imm
        Windowstorage.set("immHidden", '0');
        //tob
        Windowstorage.set("tobHidden", '0');
        //sub
        Windowstorage.set("subHidden", '0');
        //PC
        Windowstorage.set("pcHidden", '0');
        //HBIPS
        Windowstorage.set("hbipsHidden", '0');
        //SEPSIS
        Windowstorage.set("sepsisHidden", '0');
        //HS
        Windowstorage.set("hsHidden", '0');
        // ;;014 addition of Pediatric Skin condition
        hiddenpSkinExpandCollapse = 1;
        //Reset variables.
        currentPage = 1;
        pageCNT = 0;
        pageNum = 1;
        PgRecTotal = 0;
        tableAMIWidth = 500;
        tableHeartFailureWidth = 500;
        tablePneumoniaWidth = 500;
        tableChildrensAsthmaWidth = 500;
        tableVTEWidth = 500;
        tableStrokeWidth = 500;
        tableSCIPWidth = 500;
        tableAMIColSpan = 6;
        tableHeartFailureColSpan = 6;
        tablePneumoniaColSpan = 6;
        tableChildrensAsthmaColSpan = 6;
        tableVTEColSpan = 6;
        tableStrokeColSpan = 6;
        tableSCIPColSpan = 6;
        rowSpanCounter = 0;
        strPatientDemographic = "";
        blnAmiCalled = false; //015
        blnHeartFailureCalled = false;
        blnPneumoniaCalled = false;
        blnChildrensAsthmaCalled = false;
        blnVTECalled = false;
        blnStrokeCalled = false;
        blnSCIPCalled = false;
        blnPressureUlcersCalled = false;
        blnCRICalled = false;
        blnFallsCalled = false;
        blnFallsPediatricCalled = false;
        blnPainCalled = false;
        blnPedPainCalled = false;
        blnpSkinCalled = false; // ;;014 addition of Pediatric Skin condition
        blnImmCalled = false;
        blnTobCalled = false;
        blnSubCalled = false;
        blnPcCalled = false;
        blnHbipsCalled = false;
        blnSepsisCalled = false;
        blnHSCalled = false;
        hdrTableWidth = 1240; // 015 changed from 1520 for new column;;014 changed from 1480 for Pediatric Skin condition
        hdrTable2Width = 1240; // 015 changed from 1520 for new column;;014 changed from 1480 for Pediatric Skin condition
        blnFirstAmi = true; //015
        blnFirstTimeHeartFailure = true;
        blnFirstTimePneumonia = true;
        blnFirstTimeChildrensAsthma = true;
        blnFirstTimeVTE = true;
        blnFirstTimeStroke = true;
        blnFirstTimeSCIP = true;
        blnFirstTimePressureUlcers = true;
        blnFirstTimeCRI = true;
        blnFirstTimeFalls = true;
        blnFirstTimeFallsPediatric = true;
        blnFirstTimePain = true;
        blnFirstTimePedPain = true;
        blnFirstTimeImm = true;
        blnFirstTimeTob = true;
        blnFirstTimeSub = true;
        blnFirstTimePc = true;
        blnFirstTimeHbips = true;
        blnFirstTimeSepsis = true;
        blnFirstTimeHS = true;
        blnFirstTimepSkin = true; // ;;014 addition of Pediatric Skin condition
        intTimeOutID = 0;
        intTimeOutID2 = 0;
        intDefaultExpanded = 0;
        oColHdrs = [];
        amiDisplayIndicator = '0';
        heartFailureDisplayIndicator = '0';
        pneumoniaDisplayIndicator = '0';
        cacDisplayIndicator = '0';
        vteDisplayIndicator = '0';
        strokeDisplayIndicator = '0';
        scipDisplayIndicator = '0';
        pressureUlcerDisplayIndicator = '0';
        criDisplayIndicator = '0';
        fallsDisplayIndicator = '0';
        pediatricFallsDisplayIndicator = '0';
        painIndicator = '0';
        pedPainIndicator = '0';
        pSkinIndicator = '0'; // ;;014 addition of Pediatric Skin condition
        immDisplayIndicator = '0';
        tobDisplayIndicator = '0';
        subDisplayIndicator = '0';
        pcDisplayIndicator = '0';
        hbipsDisplayIndicator = '0';
        sepsisDisplayIndicator = '0';
        hsDisplayIndicator = '0';
    }
    catch (error){
        showErrorMessage(error.message, "resetVariables", "", "");
    }
}
        //Get parameters from the URL.
function getPrefParam() {
    var cur_params = "";
    try {
        cur_params = window.location.search.replace(/%20/g, " ").split("?").join("").split(",");

        var len = cur_params.length; //allison

        strFileLocation = cur_params[0];
        personnelEncounterRelationCode = cur_params[1];
        strMrnFin = cur_params[2];
        strPtQualind = cur_params[3];

        userPersonID = cur_params[4];
        patientListNumber = cur_params[5];
        devLocation = cur_params[6];
        applicationID = cur_params[7];
        strRmBd = cur_params[8]; // 015 new column have to add one to all the others.
        rmBedDemoDisplayInd = cur_params[9];

        ageDemoDisplayInd = cur_params[10];
        locDemoDisplayInd = cur_params[11];
        phyDemoDisplayInd = cur_params[12];
        admitDemoDisplayInd = cur_params[13];
        nurseDemoDisplayInd = cur_params[14];
        surgDtDemoDisplayInd = cur_params[15];
        losDemoDisplayInd = cur_params[16];
        visitDemoDisplayInd = cur_params[17];
        colNum = cur_params[32]; //016 addition of bedrock filter/pref to determin #of columns to open

        // Store initially the condition setting from bedrock to global variables
        conditionLists = [cur_params[18]
                        , cur_params[21]
                        , cur_params[37]
                        , cur_params[19]
                        , cur_params[39]
                        , cur_params[33]
                        , cur_params[36]
                        , cur_params[20]
                        , cur_params[24]
                        , cur_params[38]
                        , cur_params[23]
                        , cur_params[35]
                        , cur_params[34]
                        , cur_params[22]
        ];
        if (Windowstorage.get("selectedCond") === 'undefined' || Windowstorage.get("selectedCond") === "All") {
            amiDisplayIndicator = cur_params[18];
            heartFailureDisplayIndicator = cur_params[19];
            pneumoniaDisplayIndicator = cur_params[20];
            cacDisplayIndicator = cur_params[21];
            vteDisplayIndicator = cur_params[22];
            strokeDisplayIndicator = cur_params[23];
            scipDisplayIndicator = cur_params[24];
            pressureUlcerDisplayIndicator = cur_params[25];
            criDisplayIndicator = cur_params[26];
            fallsDisplayIndicator = cur_params[27];
            pediatricFallsDisplayIndicator = cur_params[28];
            painIndicator = cur_params[29];
            pedPainIndicator = cur_params[30];
            pSkinIndicator = cur_params[31]; // ;;014 addition of Pediatric Skin condition
            immDisplayIndicator = cur_params[33];
            tobDisplayIndicator = cur_params[34];
            subDisplayIndicator = cur_params[35];
            pcDisplayIndicator = cur_params[36];
            hbipsDisplayIndicator = cur_params[37];
            sepsisDisplayIndicator = cur_params[38]
            hsDisplayIndicator = cur_params[39]
        }
        else {
            switch (Windowstorage.get("selectedCond")) {
                case amiSecNm:
                    amiDisplayIndicator = '1';
                    break;
                case cacSecNm:
                    cacDisplayIndicator = '1';
                    break;
                case hbipsSecNm:
                    hbipsDisplayIndicator = '1';
                    break;
                case hfSecNm:
                    heartFailureDisplayIndicator = '1';
                    break;
                case immSecNm:
                    immDisplayIndicator = '1';
                    break;
                case pcSecNm:
                    pcDisplayIndicator = '1';
                    break;
                case pnSecNm:
                    pneumoniaDisplayIndicator = '1';
                    break;
                case scipSecNm:
                    scipDisplayIndicator = '1';
                    break;
                case sepsisSecNm:
                    sepsisDisplayIndicator = '1';
                    break;
                case hsSecNm:
                    hsDisplayIndicator = '1';
                    break;
                case stkSecNm:
                    strokeDisplayIndicator = '1';
                    break;
                case subSecNm:
                    subDisplayIndicator = '1';
                    break;
                case tobSecNm:
                    tobDisplayIndicator = '1';
                    break;
                case vteSecNm:
                    vteDisplayIndicator = '1';
                    break;
                default: // go back to All option
                    showErrorMessage("Unsupported string", "getPrefParam", "", Windowstorage.get("selectedCond"));
                    break;
            }
        }
    }
    catch (error) {
        showErrorMessage(error.message, "getPrefParam", "", "");
}
    finally {
        //validate additional params for passive changes 015
        if (amiDisplayIndicator == null || amiDisplayIndicator == "" || isNaN(amiDisplayIndicator)) {
            amiDisplayIndicator = "0";
        }
        if (heartFailureDisplayIndicator == null || heartFailureDisplayIndicator == "" ||  isNaN(heartFailureDisplayIndicator)) {
            heartFailureDisplayIndicator = "0";
        }
        if (pneumoniaDisplayIndicator == null || pneumoniaDisplayIndicator == "" ||  isNaN(pneumoniaDisplayIndicator)) {
            pneumoniaDisplayIndicator = "0";
        }
        if (cacDisplayIndicator == null || cacDisplayIndicator == "" ||  isNaN(cacDisplayIndicator)) {
            cacDisplayIndicator = "0";
        }
        if (vteDisplayIndicator == null || vteDisplayIndicator == "" ||  isNaN(vteDisplayIndicator)) {
            vteDisplayIndicator = "0";
        }
        if (strokeDisplayIndicator == null || strokeDisplayIndicator == "" ||  isNaN(strokeDisplayIndicator)) {
            strokeDisplayIndicator = "0";
        }
        if (scipDisplayIndicator == null || scipDisplayIndicator == "" ||  isNaN(scipDisplayIndicator)) {
            scipDisplayIndicator = "0";
        }
        if (pressureUlcerDisplayIndicator == null || pressureUlcerDisplayIndicator == "" ||  isNaN(pressureUlcerDisplayIndicator)) {
            pressureUlcerDisplayIndicator = "0";
        }
        if (criDisplayIndicator == null || criDisplayIndicator == "" ||  isNaN(criDisplayIndicator)) {
            criDisplayIndicator = "0";
        }
        if (fallsDisplayIndicator == null || fallsDisplayIndicator == "" ||  isNaN(fallsDisplayIndicator)) {
            fallsDisplayIndicator = "0";
        }
        if (pediatricFallsDisplayIndicator == null || pediatricFallsDisplayIndicator == "" ||  isNaN(pediatricFallsDisplayIndicator)) {
            pediatricFallsDisplayIndicator = "0"
        }
        if (painIndicator == null || painIndicator == "" ||  isNaN(painIndicator)) {
            painIndicator = "0";
        }
        if (pedPainIndicator == null || pedPainIndicator == "" ||  isNaN(pedPainIndicator)) {
            pedPainIndicator = "0";
        }
        if (pSkinIndicator == null || pSkinIndicator == "" ||  isNaN(pSkinIndicator)) {
            pSkinIndicator = "0";
        }
        if (immDisplayIndicator == null || immDisplayIndicator == "" ||  isNaN(immDisplayIndicator)) {
            immDisplayIndicator = "0";
        }
        if (tobDisplayIndicator == null || tobDisplayIndicator == "" ||  isNaN(tobDisplayIndicator)) {
            tobDisplayIndicator = "0";
        }
        if (subDisplayIndicator == null || subDisplayIndicator == "" ||  isNaN(subDisplayIndicator)) {
            subDisplayIndicator = "0";
        }
        if (pcDisplayIndicator == null || pcDisplayIndicator == "" ||  isNaN(pcDisplayIndicator)) {
            pcDisplayIndicator = "0";
        }
        if (hbipsDisplayIndicator == null || hbipsDisplayIndicator == "" ||  isNaN(hbipsDisplayIndicator)) {
            hbipsDisplayIndicator = "0";
        }
        if (sepsisDisplayIndicator == null || sepsisDisplayIndicator == "" ||  isNaN(sepsisDisplayIndicator)) {
            sepsisDisplayIndicator = "0";
        }
        if (hsDisplayIndicator == null || hsDisplayIndicator == "" ||  isNaN(hsDisplayIndicator)) {
            hsDisplayIndicator = "0";
        }
    }
}

/**
 * Gets the Patient Lists JSON structure.
 */
function getPatientLists(){
    var qmReqObject = "";
    var blnLoadPatientList = true;
    var blnPatient = true;
    var cclParam = "";
    var strErrorMessage = "An error has occurred when getting data for Patient Lists.";
    var cclProg = "lh_mp_get_ptlist";
    try {
        //rmBedDemoDisplayInd
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(rmBedDemoDisplayInd);
        oColHdr.strSecNm = 'rmBedDemoDisplayInd';
        oColHdr.sbSecInd = 1;
        oColHdrs.push(oColHdr);
        //ageDemoDisplayInd
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(ageDemoDisplayInd);
        oColHdr.strSecNm = 'ageDemoDisplayInd';
        oColHdr.sbSecInd = 1;
        oColHdrs.push(oColHdr);
        //locDemoDisplayInd
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(locDemoDisplayInd);
        oColHdr.strSecNm = 'locDemoDisplayInd';
        oColHdr.sbSecInd = 1;
        oColHdrs.push(oColHdr);
        //phyDemoDisplayInd
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(phyDemoDisplayInd);
        oColHdr.strSecNm = 'phyDemoDisplayInd';
        oColHdr.sbSecInd = 1;
        oColHdrs.push(oColHdr);
        //admitDemoDisplayInd
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(admitDemoDisplayInd);
        oColHdr.strSecNm = 'admitDemoDisplayInd';
        oColHdr.sbSecInd = 1;
        oColHdrs.push(oColHdr);
        //nurseDemoDisplayInd
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(nurseDemoDisplayInd);
        oColHdr.strSecNm = 'nurseDemoDisplayInd';
        oColHdr.sbSecInd = 1;
        oColHdrs.push(oColHdr);
        //surgDtDemoDisplayInd
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(surgDtDemoDisplayInd);
        oColHdr.strSecNm = 'surgDtDemoDisplayInd';
        oColHdr.sbSecInd = 1;
        oColHdrs.push(oColHdr);
        //losDemoDisplayInd
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(losDemoDisplayInd);
        oColHdr.strSecNm = 'losDemoDisplayInd';
        oColHdr.sbSecInd = 1;
        oColHdrs.push(oColHdr);
        //visitDemoDisplayInd
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(visitDemoDisplayInd);
        oColHdr.strSecNm = 'visitDemoDisplayInd';
        oColHdr.sbSecInd = 1;
        oColHdrs.push(oColHdr);
        //AMI
        var oColHdr = new Object();
        oColHdr.dispInd = parseInt(amiDisplayIndicator);
        oColHdr.strSecNm = 'AMI';
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //HeartFailure
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(heartFailureDisplayIndicator);
        oColHdr.strSecNm = 'HeartFailure';
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //Pneumonia
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(pneumoniaDisplayIndicator);
        oColHdr.strSecNm = "Pneumonia";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //ChildrensAsthma
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(cacDisplayIndicator);
        oColHdr.strSecNm = "ChildrensAsthma";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //VTE
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(vteDisplayIndicator);
        oColHdr.strSecNm = "VTE";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //Stroke
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(strokeDisplayIndicator);
        oColHdr.strSecNm = "Stroke";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //SCIP
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(scipDisplayIndicator);
        oColHdr.strSecNm = "SCIP";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //PressureUlcers
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(pressureUlcerDisplayIndicator);
        oColHdr.strSecNm = "PressureUlcers";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //CRI
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(criDisplayIndicator);
        oColHdr.strSecNm = "CRI";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //Falls
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(fallsDisplayIndicator);
        oColHdr.strSecNm = "Falls";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //FallsPediatric
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(pediatricFallsDisplayIndicator);
        oColHdr.strSecNm = "FallsPediatric";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //Pain
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(painIndicator);
        oColHdr.strSecNm = "Pain";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //PedPain
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(pedPainIndicator);
        oColHdr.strSecNm = "PedPain";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //pSkin
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(pSkinIndicator);
        oColHdr.strSecNm = "pSkin";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //imm
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(immDisplayIndicator);
        oColHdr.strSecNm = "Imm";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //tob
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(tobDisplayIndicator);
        oColHdr.strSecNm = "Tob";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //sub
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(subDisplayIndicator);
        oColHdr.strSecNm = "Sub";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //PC
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(pcDisplayIndicator);
        oColHdr.strSecNm = "PC";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //HBIPS
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(hbipsDisplayIndicator);
        oColHdr.strSecNm = "HBIPS";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //SEPSIS
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(sepsisDisplayIndicator);
        oColHdr.strSecNm = "SEPSIS";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);
        //HS
        oColHdr = new Object();
        oColHdr.dispInd = parseInt(hsDisplayIndicator);
        oColHdr.strSecNm = "HS";
        oColHdr.sbSecInd = 0;
        oColHdrs.push(oColHdr);

        oColHdrs.sort(function(a, b){
            return sortbyDispInd("dispInd", a, b)
        })
        var strAlrt = "";
        for (i=0;l=oColHdrs.length,i<l;i++)
        {
            oColHdr = oColHdrs[i];
            strAlrt += oColHdr.strSecNm + "\n " +oColHdr.dispInd + "\n \n"
        }


        // Calculate dynamic cell count
        condDisplaySort();
        //Verify if a component is not activated. If that is the case change the width for the tables.
        //0 = not activated.
        //1 = activated.

        for (i=0;l=oColHdrs.length,i<l;i++)
        {
            oColHdr = oColHdrs[i];
            if (oColHdr.dispInd == 0 && oColHdr.sbSecInd == 0)
            {
                hdrTableWidth = parseInt(hdrTableWidth) - parseInt(40);
                hdrTable2Width = hdrTableWidth;
            }
            else {
                intActiveComponentCounter = parseInt(intActiveComponentCounter) + 1;
            }
        }

        //Set devLocation to allways 0.
        devLocation = 0

        //Build JSON String.
        qmReqObject += '{"QMREQ":{"PRSNLID":';
        qmReqObject += userPersonID;
        qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
        qmReqObject += devLocation;
        qmReqObject += ',"APPID":';
        qmReqObject += applicationID;
        qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":0,"PTLISTTYPE":0,"PTLISTLOCCD":0,"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
        qmReqObject += ',"LIST":[]}}';

        //Build the parameters for getting the Patient Lists.
        cclParam = "'MINE'" + ",'" + qmReqObject + "'";
        //prompt("Copy to clipboard: Ctrl+C, Enter",cclParam)

        requestAsync = getXMLCclRequest();
        requestAsync.onreadystatechange = function(){
            if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                if (requestAsync.responseText > " ") {
                    try {
                        //Load responses text into object.
                        json_data = JSON.parse(requestAsync.responseText);
                    }
                    catch (error) {
                        //Set Error Message.
                        showErrorMessage(error.message, "getPatientLists", requestAsync.status, cclParam);
                        return false;
                    }
                    //Load Patient Lists.
                    blnLoadPatientList = loadPatientLists();
                }
                requestAsync = null;
                //Verify if everything went well.
                if (blnLoadPatientList == true) {
                    //Load patients.
                    blnPatient = getPatients();
                }
            }
            else
                if (requestAsync.readyState == 4 && requestAsync.readyState != 200) {
                    //Set Error Message.
                    showErrorMessage(strErrorMessage, "getPatientLists", requestAsync.status, cclParam);
                    return false;
                }
        };
        //Sends the request to the CCL server.
        if (location.protocol.substr(0, 4) == "http") {
            var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
            requestAsync.open("POST", url);
            requestAsync.send(cclParam);
        }
        else {
            requestAsync.open("POST", cclProg);
            requestAsync.send(cclParam);
        }
    }
    catch (error) {
        showErrorMessage(error.message, "getPatientLists", "", cclParam);
    }
}

/**
 * Loads the dropdown list with patient lists. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function loadPatientLists(){
    var blnStatus = true;
    var intListCNT = 0;
    var strHTMLTable = "";
    var optn = "";
    var ddlList = "";
    var intIndex = 0;
    var strStoredIndexString = "";
    var strStoredIndex = "";
    var strSelectedCond = '';
    var strSelectedStat = '';

    try {
        //Get LIST_CNT.
        intListCNT = json_data.LISTREPLY.LIST_CNT
        //Verify if there are any lists.
        if (intListCNT == 0) {
            strHTMLTable += '<table cellspacing="0" cellpadding="0" border="0">';
            strHTMLTable += '<tr>';
            strHTMLTable += '<td colspan="2">&nbsp</td>';
            strHTMLTable += '</tr>';
            strHTMLTable += '<tr>';
            strHTMLTable += '<td>&nbsp</td>';
            strHTMLTable += '<td><b>'+i18n.NO_PATIENT_LIST_FOUND+'</b></td>';
            strHTMLTable += '</tr>';
            strHTMLTable += '</table>';

            //Set error message.
            document.getElementById("divMainTable").innerHTML = strHTMLTable;

            //Change flag.
            blnStatus = false;
        }
        else {
            //Get APPXE (This is a global variable).
            strAppXe = json_data.LISTREPLY.APPXE;

            json_data.LISTREPLY.PTLIST.sort(function(a, b){
                return sortbyseq("LISTSEQ", a, b)
            })
            //Loop through the record structure for the Patient List.
            // Only Add values to the patient drop down list initially and dont do it again
            if (document.getElementById("ptlists").length == 0) {
            for (var intCounter = 0; intCounter < json_data.LISTREPLY.PTLIST.length; intCounter++) {
                //Add vaules to the dropdown list.
                optn = document.createElement("option");
                optn.text = json_data.LISTREPLY.PTLIST[intCounter].LISTNM;
                optn.value = json_data.LISTREPLY.PTLIST[intCounter].LISTID;
                document.frmQualityMeasure.ptlists.options.add(optn);
                }
            }
            // Only Add values to the condition drop down list initially and dont do it again
            if (document.getElementById("conLists").length == 1) {
                getConditionLists(conditionLists);
            }
            //Get stored "window.name" value.
            strStoredIndex = Windowstorage.get("StoredIndex");

            //Verify if the stored value is not undefined.
            if (strStoredIndex != 'undefined') {
                // Loop through all the items in drop down list
                for (intCounter = 0; intCounter < document.getElementById("ptlists").options.length; intCounter++) {
                    if (document.getElementById("ptlists").options[intCounter].value == strStoredIndex) {
                        //Item is found. Set its property and exit
                        document.getElementById("ptlists").options[intCounter].selected = true;
                        break;
                    }
                }
            }
            else {
                //Set selected index.
                intIndex = parseInt(patientListNumber) - parseInt(1);
                document.frmQualityMeasure.ptlists.options[intIndex].selected = true;
            }
            strSelectedCond = Windowstorage.get("selectedCond");
            if (strSelectedCond != 'undefined') {
                // Loop through all the items in drop down list
                for (intCounter = 0; intCounter < document.getElementById("conLists").options.length; intCounter++) {
                    if (document.getElementById("conLists").options[intCounter].value == strSelectedCond) {
                        //Item is found. Set its property and exit
                        document.getElementById("conLists").options[intCounter].selected = true;
                        break;
                    }
                }
                // Add value to Status drop down list, only add once if selected condition is not All
                if (document.getElementById("statLists").length === 1 && strSelectedCond !== "All") {
                    getStatusLists(statusLists);
                }
            }
            strSelectedStat = Windowstorage.get("selectedStat");
            if (strSelectedStat != 'underfined' && document.getElementById("statLists").options.length >1) {
                // Loop through all the items in drop down list
                for (intCounter = 0; intCounter < document.getElementById("statLists").options.length; intCounter++) {
                    if (document.getElementById("statLists").options[intCounter].value == strSelectedStat) {
                        //Item is found. Set its property and exit
                        document.getElementById("statLists").options[intCounter].selected = true;
                        break;
                    }
                }
            }

            //Show Elements.
            document.getElementById("locationhdr").style.display = "";
        }
    }
    catch (error) {
        showErrorMessage(error.message, "loadPatientLists", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Gets the patients. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function getPatients(){
    var blnStatus = true;
    var qmReqObject = "";
    var blnLoadPatient = true;
    var cclParam = "";
    var strErrorMessage = "An error has occurred when getting data for Patient Demographics.";
    var cclProg = "";

    try {
        //Display Load Text.
        displayLoadText("pd");

        //Get LISTID from selected value in Patient DropDown List.
        selectedID = document.frmQualityMeasure.ptlists.options[document.frmQualityMeasure.ptlists.selectedIndex].value;



        //Loop through the record structure for the Patient List.
        for (var intCounter = 0; intCounter < json_data.LISTREPLY.PTLIST.length; intCounter++) {
            //Verify selected LISTID.
            if (selectedID == json_data.LISTREPLY.PTLIST[intCounter].LISTID) {
                ptListType = json_data.LISTREPLY.PTLIST[intCounter].LISTTYPECD;
                ptListLoccd = json_data.LISTREPLY.PTLIST[intCounter].DEFAULTLOCCD;
                break;
            }
        }
        //Build JSON String.
        qmReqObject += '{"QMREQ":{"PRSNLID":';
        qmReqObject += userPersonID;
        qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
        qmReqObject += devLocation;
        qmReqObject += ',"APPID":';
        qmReqObject += applicationID;
        qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":';
        qmReqObject += selectedID;
        qmReqObject += ',"PTLISTTYPE":';
        qmReqObject += ptListType;
        qmReqObject += ',"PTLISTLOCCD":';
        qmReqObject += ptListLoccd;
        qmReqObject += ',"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
        qmReqObject += ',"LIST":[]}}';

        //Verify which value the patient indicator has.
        //0 = Both qualifying and non qualifying patients.
        //1 = Only qualifying patients.

        if (strPtQualind == 1) {
            //Set CCL script.
            cclProg = "dc_mp_get_allqm";

            //Build the parameters for getting the Patients.
            cclParam += "'MINE'";
            cclParam += ",'";
            cclParam += qmReqObject;
            cclParam += "',";
            cclParam += amiDisplayIndicator;
            cclParam += ",";
            cclParam += heartFailureDisplayIndicator;
            cclParam += ",";
            cclParam += pneumoniaDisplayIndicator;
            cclParam += ",";
            cclParam += cacDisplayIndicator;
            cclParam += ",";
            cclParam += vteDisplayIndicator;
            cclParam += ",";
            cclParam += strokeDisplayIndicator;
            cclParam += ",";
            cclParam += scipDisplayIndicator;
            cclParam += ",";
            cclParam += pressureUlcerDisplayIndicator;
            cclParam += ",";
            cclParam += criDisplayIndicator;
            cclParam += ",";
            cclParam += fallsDisplayIndicator;
            cclParam += ",";
            cclParam += pediatricFallsDisplayIndicator;
            cclParam += ",";
            cclParam += painIndicator;
            cclParam += ",";
            cclParam += pedPainIndicator
            // ;;014 addition of Pediatric Skin condition
            cclParam += ",";
            cclParam += pSkinIndicator
            cclParam += ",";
            //addition of three new sections
            cclParam += immDisplayIndicator
            cclParam += ",";
            cclParam += tobDisplayIndicator
            cclParam += ",";
            cclParam += subDisplayIndicator
            cclParam += ",";
            //addition of two new sections
            cclParam += pcDisplayIndicator
            cclParam += ",";
            cclParam += hbipsDisplayIndicator
            cclParam += ",";
            cclParam += sepsisDisplayIndicator
            cclParam += ",";
            cclParam += hsDisplayIndicator
        }
        else {
            //Set CCL script.
            cclProg = "dc_mp_get_patients2";
            //Build the parameters for getting the Patients.
            cclParam = "'MINE'" + ",'" + qmReqObject + "'";
        }

        requestAsync = getXMLCclRequest();
        requestAsync.onreadystatechange = function(){
            if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                if (requestAsync.responseText > " ") {
                    try {
                        //Load response into object.
                        json_data2 = JSON.parse(requestAsync.responseText);
                        json_listOfPatients = JSON.parse(requestAsync.responseText);
                        //LoadPatDataObj(json_data2);
                    }
                    catch (error) {
                        //Hide Load Text.
                        setTimeout("hideLoadText()",hideLoadTextDelay);
                        //Set Error Message.
                        showErrorMessage(strErrorMessage, "getPatients1", requestAsync.status, cclParam);
                        return false;
                    }
                    //Load Patients.
                    blnLoadPatient = loadPatients(json_data2);
                    //Hide Load Text.
                    setTimeout("hideLoadText()",hideLoadTextDelay);
                }
                requestAsync = null;

                //Verify if everything went well.
                if (blnLoadPatient == true) {
                    setEncntrReltn();
                }
            }
            else
                if (requestAsync.readyState == 4 && requestAsync.readyState != 200) {
                    //Hide Load Text.
                    setTimeout("hideLoadText()",hideLoadTextDelay);
                    //Set Error Message.
                    showErrorMessage(strErrorMessage, "getPatients2", requestAsync.status, cclParam);
                    return false;
                }
        };
        //Sends the request to the CCL server.
        if (location.protocol.substr(0, 4) == "http") {
            var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
            requestAsync.open("POST", url);
            requestAsync.send(cclParam);
        }
        else {
            requestAsync.open("POST", cclProg);
            requestAsync.send(cclParam);
        }
    }
    catch (error) {
        //Hide Load Text.
        setTimeout("hideLoadText()",hideLoadTextDelay);
        showErrorMessage(error.message, "getPatients3", "", cclParam);
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Loads patients. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function loadPatients(json_patients) {
    var blnStatus = true;
    var intPTCNT = 0;
    var intPageCNT = 0;
    var strHTMLTable = "";

    try {

        patData = [];
        strPatientDemog = "";
        LoadPatDataObj(json_patients);

        //Get PT_CNT and PAGE_CNT.
        intPTCNT = json_patients.PTREPLY.PT_CNT;
        intPageCNT = json_patients.PTREPLY.PAGE_CNT;
        tabNameSTRG = json_patients.PTREPLY.TABNAME; //017

        //Verify if the patient list has any patients.
        if ((intPTCNT == 0) || (intPageCNT == 0)) {
            strHTMLTable += '<table cellspacing="0" cellpadding="0" border="0">';
            strHTMLTable += '<tr>';
            strHTMLTable += '<td colspan="2">&nbsp</td>';
            strHTMLTable += '</tr>';
            strHTMLTable += '<tr>';
            strHTMLTable += '<td>&nbsp</td>';

            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1) {
                strHTMLTable += '<td><b>'+noQualPatient+'</b></td>';
            }
            else {
                strHTMLTable += '<td><b>'+noPatient+'</b></td>';
            }

            strHTMLTable += '</tr>';
            strHTMLTable += '</table>';

            //Show DIV Element.
            document.getElementById("locationhdr").style.display = "";

            //Hide Previous and Next.
            document.getElementById("spanPageOf").style.display = "none";
            document.getElementById("spanPreviousNext").style.display = "none";
            //Hide Expand All and Collapse All.
            document.getElementById("locheadexpcoll").style.display = "none";

            //Set error message.
            document.getElementById("divMainTable").innerHTML = strHTMLTable;
            //Change flag.
            blnStatus = false;

        }
        else {
            //Show Previous and Next.
            document.getElementById("spanPageOf").style.display = "";
            document.getElementById("spanPreviousNext").style.display = "";
            //Show Expand All and Collapse All.
            document.getElementById("locheadexpcoll").style.display = "";
            //Load Patient Demographics.
            blnStatus = fillDemographics();
            PopulatePatientInfo();
        }

    }
    catch (error) {
        showErrorMessage(error.message, "loadPatients", "", "");
        blnStatus = false;
    }

    return blnStatus;
}

function reloadPatients(json_patients) {
    var blnStatus = true;
    var intPTCNT = 0;
    var intPageCNT = 0;
    var strHTMLTable = "";
    try {
        patData = [];
        strPatientDemog = "";
        LoadPatDataObj(json_patients);
        //Get PT_CNT and PAGE_CNT.
        intPTCNT = json_patients.PTREPLY.PT_CNT;
        intPageCNT = json_patients.PTREPLY.PAGE_CNT;
        tabNameSTRG = json_patients.PTREPLY.TABNAME; //017
        //Verify if the patient list has any patients.
        if ((intPTCNT == 0) || (intPageCNT == 0)) {
            strHTMLTable += '<table cellspacing="0" cellpadding="0" border="0">';
            strHTMLTable += '<tr>';
            strHTMLTable += '<td colspan="2">&nbsp</td>';
            strHTMLTable += '</tr>';
            strHTMLTable += '<tr>';
            strHTMLTable += '<td>&nbsp</td>';
            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1) {
                strHTMLTable += '<td><b>' + noQualPatient + '</b></td>';
            }
            else {
                strHTMLTable += '<td><b>' + noPatient + '</b></td>';
            }
            strHTMLTable += '</tr>';
            strHTMLTable += '</table>';
            //Show DIV Element.
            document.getElementById("locationhdr").style.display = "";
            //Hide Previous and Next.
            document.getElementById("spanPageOf").style.display = "none";
            document.getElementById("spanPreviousNext").style.display = "none";
            //Hide Expand All and Collapse All.
            document.getElementById("locheadexpcoll").style.display = "none";
            //Set error message.
            document.getElementById("divMainTable").innerHTML = strHTMLTable;
            //Change flag.
            blnStatus = false;
        }
        else {
            //Show Previous and Next.
            document.getElementById("spanPageOf").style.display = "";
            document.getElementById("spanPreviousNext").style.display = "";
            //Show Expand All and Collapse All.
            document.getElementById("locheadexpcoll").style.display = "";
            //Load Patient Demographics.
            blnStatus = refillDemographics(json_listOfPatients);
        }
    }
    catch (error) {
        showErrorMessage(error.message, "loadPatients", "", "");
        blnStatus = false;
    }
    return blnStatus;
}
/**
 * Set Encounter Relationship.
 */
function setEncntrReltn(){
    var qmReqObject = "";
    var blnLoadEncntrReltn = true;
    var cclParam = "";
    var cclProg = "dc_mp_encntr_reltn";

    try {
        //Display Load Text.
        displayLoadText("all");

        if (personnelEncounterRelationCode > 0) { // Valid Encounter Relation Code
            //Build JSON String.
            qmReqObject += '{"QMREQ":{"PRSNLID":';
            qmReqObject += userPersonID;
            qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
            qmReqObject += devLocation;
            qmReqObject += ',"APPID":';
            qmReqObject += applicationID;
            qmReqObject += ',"CLIENTNM":"0","RELTNCD":';
            qmReqObject += personnelEncounterRelationCode;
            qmReqObject += ',"PTLISTID":';
            qmReqObject += selectedID;
            qmReqObject += ',"PTLISTTYPE":';
            qmReqObject += ptListType;
            qmReqObject += ',"PTLISTLOCCD":';
            qmReqObject += ptListLoccd;
            qmReqObject += ',"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
            qmReqObject += ',"LIST":['
            qmReqObject += strPatientDemog;
            qmReqObject += ']}}';

            //Build the parameters for getting the Patients.
            cclParam = "'MINE'" + ",'" + qmReqObject + "'";

            requestAsync = getXMLCclRequest();
            requestAsync.onreadystatechange = function(){
                if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                    //Encounter Relation codes set successfully
                    requestAsync = null;


                    getExpandedTimer();
                    // click this element if the innerText is currently collapse, its innerText contains '+'
                    if (document.getElementById("conLists").value !== "All" && document.getElementById("div" + document.getElementById("conLists").value + "text") &&
                        document.getElementById("div" + document.getElementById("conLists").value + "text").innerText === "+") {
                        document.getElementById("div" + document.getElementById("conLists").value + "text").click();
                    }
                    //Hide Load Text.
                    setTimeout("hideLoadText()",hideLoadTextDelay);
                }
            };
            //Sends the request to the CCL server.
            if (location.protocol.substr(0, 4) == "http") {
                var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
                requestAsync.open("POST", url);
                requestAsync.send(cclParam);
            }
            else {
                requestAsync.open("POST", cclProg);
                requestAsync.send(cclParam);
            }
        }
        else {
            //Encounter Relation codes set successfully
            requestAsync = null;

            getExpandedTimer();
            // click this element if the innerText is currently collapse, its innerText contains '+'
            if (document.getElementById("conLists").value !== "All" && document.getElementById("div" + document.getElementById("conLists").value + "text") &&
                document.getElementById("div" + document.getElementById("conLists").value + "text").innerText === "+") {
                document.getElementById("div" + document.getElementById("conLists").value + "text").click();
            }
            //Hide Load Text.
            setTimeout("hideLoadText()",hideLoadTextDelay);
        }
    }
    catch (error) {
        //Hide Load Text.
        setTimeout("hideLoadText()",hideLoadTextDelay);
        showErrorMessage(error.message, "setEncntrReltn", "", "");
    }
}

/**
 * This function will be executed when the user selects a Patient List from the dropdown list. HTML elements and global variables are reset before a new
 * Patient List is loaded.
 */

function verifyMyList(dropdownList){
    try {
        //Clear Time Outs.
        clearTimeout(intTimeOutID);
        clearTimeout(intTimeOutID2);

        //Reset DIV.
        document.getElementById("divMainTable").innerHTML = "";
        //Reset status drop down list
        Windowstorage.set("selectedStat", "All");
        document.getElementById("statLists").options[0].selected = true;
        //Save the list
        selectedID = dropdownList.value;
        if(!isNaN(selectedID)) {
            Windowstorage.set("StoredIndex", selectedID);
        }

        //Reset HIDDEN values.
        hiddenExpandCollapse                = 1;
        hiddenHeartFailureExpandCollapse    = 1;
        hiddenPneumoniaExpandCollapse       = 1;
        hiddenChildrensAsthmaExpandCollapse = 1;
        hiddenVTEExpandCollapse             = 1;
        hiddenStrokeExpandCollapse          = 1;
        hiddenSCIPExpandCollapse            = 1;
        hiddenPressureUlcersExpandCollapse  = 1;
        hiddenCRIExpandCollapse             = 1;
        hiddenFallsExpandCollapse           = 1;
        hiddenFallsPediatricExpandCollapse  = 1;
        hiddenPainExpandCollapse            = 1;
        hiddenPedPainExpandCollapse         = 1;
        hiddenImmExpandCollapse             = 1;
        hiddenTobExpandCollapse             = 1;
        hiddenSubExpandCollapse             = 1;
        hiddenPCExpandCollapse              = 1;
        hiddenHBIPSExpandCollapse           = 1;
        hiddenSEPSISExpandCollapse          = 1;
        hiddenHSExpandCollapse              = 1;
        
        // ;;014 addition of Pediatric Skin condition
        hiddenpSkinExpandCollapse = 1;
        //Reset variables.
        currentPage = 1;
        pageCNT = 0;
        pageNum = 1;
        PgRecTotal = 0;
        tableAMIWidth = 500;
        tableHeartFailureWidth = 500;
        tablePneumoniaWidth = 500;
        tableChildrensAsthmaWidth = 500;
        tableVTEWidth = 500;
        tableStrokeWidth = 500;
        tableSCIPWidth = 500;
        tableAMIColSpan = 6;
        tableHeartFailureColSpan = 6;
        tablePneumoniaColSpan = 6;
        tableChildrensAsthmaColSpan = 6;
        tableVTEColSpan = 6;
        tableStrokeColSpan = 6;
        tableSCIPColSpan = 6;
        rowSpanCounter = 0;
        strPatientDemographic = "";
        blnAmiCalled = false; //015
        blnHeartFailureCalled = false;
        blnPneumoniaCalled = false;
        blnChildrensAsthmaCalled = false;
        blnVTECalled = false;
        blnStrokeCalled = false;
        blnSCIPCalled = false;
        blnPressureUlcersCalled = false;
        blnCRICalled = false;
        blnFallsCalled = false;
        blnFallsPediatricCalled = false;
        blnPainCalled = false;
        blnPedPainCalled = false;
        blnpSkinCalled = false; // ;;014 addition of Pediatric Skin condition
        blnImmCalled = false;
        blnTobCalled = false;
        blnSubCalled = false;
        blnPcCalled = false;
        blnHbipsCalled = false;
        blnSepsisCalled = false;
        blnHSCalled = false;
        hdrTableWidth = 1240; // 015 changed from 1520 for new column;;014 changed from 1480 for Pediatric Skin condition
        hdrTable2Width = 1240; // 015 changed from 1520 for new column;;014 changed from 1480 for Pediatric Skin condition
        blnFirstAmi = true; //015
        blnFirstTimeHeartFailure = true;
        blnFirstTimePneumonia = true;
        blnFirstTimeChildrensAsthma = true;
        blnFirstTimeVTE = true;
        blnFirstTimeStroke = true;
        blnFirstTimeSCIP = true;
        blnFirstTimePressureUlcers = true;
        blnFirstTimeCRI = true;
        blnFirstTimeFalls = true;
        blnFirstTimeFallsPediatric = true;
        blnFirstTimePain = true;
        blnFirstTimePedPain = true;
        blnFirstTimeImm = true;
        blnFirstTimeTob = true;
        blnFirstTimeSub = true;
        blnFirstTimePc = true;
        blnFirstTimeHbips = true;
        blnFirstTimeSepsis = true;
        blnFirstTimeHS = true;

        blnFirstTimepSkin = true; // ;;014 addition of Pediatric Skin condition
        intTimeOutID = 0;
        intTimeOutID2 = 0;
        intDefaultExpanded = 0;

        //Verify if a component is not activated. If that is the case change the width for the tables.
        //0 = not activated.
        //1 = activated.

        for (i=0;l=oColHdrs.length,i<l;i++)
        {
            oColHdr = oColHdrs[i];
            if (oColHdr.dispInd == 0 && oColHdr.sbSecInd == 0)
            {
                hdrTableWidth = parseInt(hdrTableWidth) - parseInt(40);
                hdrTable2Width = hdrTableWidth;
            }
        }

        //Load patients.
        getPatients();
    }
    catch (error) {
        showErrorMessage(error.message, "verifyMyList", "", "");
    }
}

function refillDemographics(json_patients) {

    var alink = "";
    var blnStatus = true;
    var intNumber = 0;
    var tempCell = 0;
    var tempstr = "";
    var htmlTable = "";
    var hideRow = "";
    var strPageOf = "";
    var strPreviousNextLinks = "";
    var tempPageNum = 0;
    var uniqueRowNumber = "";
    var tempEncounterID = "";
    var strPatientName = "";
    var isItHidden = "";
    try {
        //Get number of pages.
        if (pageCNT > 1) {
            strPageOf += i18n.PAGE_1_OF;
            strPageOf += pageCNT;
            strPageOf += '&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;';
        }
        else {
            strPageOf = i18n.PAGE_1_OF + ' 1&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;';
        }
        //Assign HTML.
        document.getElementById("spanPageOf").innerHTML = strPageOf;
        //Set Previous and Next Links.
        strPreviousNextLinks = '<a href="javascript:displayPreviousPage();" class="LinkText" title="' + i18n.PREVIOUS_PAGE + '">' + i18n.PREVIOUS + '</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="javascript:displayNextPage();" class="LinkText" title="' + i18n.NEXT_PAGE + '">' + i18n.NEXT + '</a>';
        //Assign HTML.
        document.getElementById("spanPreviousNext").innerHTML = strPreviousNextLinks;
        //room bed column 015
        if (strRmBd != 0) // 15 3.3 enhancements
        {
            hdrTableWidth = parseInt(hdrTableWidth) + parseInt(120);
            hdrTable2Width = hdrTableWidth;
        }
        htmlTable += '<table id="hdrtable" style="display:none;" border="0" width="';
        htmlTable += hdrTableWidth;
        htmlTable += '" cellspacing="0" cellpadding="0">';
        //Main Headers Row.
        //Patient Demographics
        htmlTable += '<tr id="sechdrs">';
        //015 larger table htmlTable += '<td id="secpatlisthdr" colspan="3" class="tabhdrs CellWidth500">';
        if (strRmBd == 1) //015 larger table
        {
            htmlTable += '<td id="secpatlisthdr" colspan="4" class="tabhdrs CellWidth600">';
        }
        else {
            htmlTable += '<td id="secpatlisthdr" colspan="3" class="tabhdrs CellWidth500">';
        }
        htmlTable += '<div id="secpathdrtxt">' + i18n.demog.PATIENT_DEMOGRAPHICS + '</div>';
        htmlTable += '</td>';
        //015 3.3 enhancements
        /**015
         * @author CC009905
         * Loads the nhiqm headers in thier respective places.
         */
        for (i = 0; l = oColHdrs.length, i < l; i++) {
            oColHdr = oColHdrs[i];
            if (oColHdr.dispInd > 0 && oColHdr.sbSecInd == 0) {
                switch (oColHdr.strSecNm) {
                    case sixColHdrs[0]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[0]);
                        break;
                    case sixColHdrs[1]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[1]);
                        break;
                    case sixColHdrs[2]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[2]);
                        break;
                    case sixColHdrs[3]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[3]);
                        break;
                    case sixColHdrs[4]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[4]);
                        break;
                    case sixColHdrs[5]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[5]);
                        break;
                    case sixColHdrs[6]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[6]);
                        break;
                    case sixColHdrs[7]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[7]);
                        break;
                    case sixColHdrs[8]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[8]);
                        break;
                    case sixColHdrs[9]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[9]);
                        break;
                    case sixColHdrs[10]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[10]);
                        break;
                    case sixColHdrs[11]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm, sixColAbbr[11]);
                        break;
                    case sixColHdrs[12]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm,sixColAbbr[12]);
                        break;
                    case sixColHdrs[13]:
                        htmlTable = CreateColHtml(htmlTable, oColHdr.strSecNm,sixColAbbr[13]);
                        break;
                    default:
                        //htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,"");
                        break;
                }
            }
        }
        htmlTable += '</tr>';
        //Sub Headers Row
        htmlTable += '<tr id="secsubhdrs">';
        //Patient Demographics
        //Name
        htmlTable += '<td id="secsubcol1" class="subhdrs CellWidth250">';
        htmlTable += '<span onclick="javascript:this.blur(); SortPatData('; //"name");"';
        htmlTable += "'name');";
        htmlTable += '" title="' + i18n.SORT_BY_NAME_HVR + '" class="LinkText">' + i18n.NAME + '</span>';
        htmlTable += '</td>';
        //Date Of Birth
        htmlTable += '<td id="secsubcol2" class="subhdrs CellWidth100">';
        htmlTable += '<span onclick="javascript:this.blur();return SortPatData(';
        htmlTable += "'dob');";
        htmlTable += '" title="' + i18n.SORT_BY_DOB_HVR + '" class="LinkText">' + i18n.DOB + '</span>';
        htmlTable += '</td>';
        //FIN or MRN
        //Verify if it is going to be FIN or MRN.
        if (strMrnFin.toLowerCase() == "f") {
            htmlTable += '<td id="secsubcol3" class="subhdrs CellWidth150">';
            htmlTable += '<span onclick="javascript:this.blur();return SortPatData(';
            htmlTable += "'fin');";
            htmlTable += '" title="' + i18n.SORT_BY_FIN_HVR + '" class="LinkText">' + i18n.FIN + '</span>';
            htmlTable += '</td>';
        }
        else {
            htmlTable += '<td id="secsubcol3" class="subhdrs CellWidth150">';
            htmlTable += '<span onclick="javascript:this.blur();return SortPatData(';
            htmlTable += "'mrn');";
            htmlTable += '" title="' + i18n.SORT_BY_MRN_HVR + '" class="LinkText">' + i18n.MRN + '</span>';
            htmlTable += '</td>';
        }
        if (strRmBd == 1) //015 new column
        {
            //room/bed   015 new column
            htmlTable += '<td id="secsubcol4" class="subhdrs CellWidth100">';
            htmlTable += '<span onclick="javascript:this.blur();return SortPatData(';
            htmlTable += "'roomBed');";
            htmlTable += '" title="' + i18n.SORT_BY_ROOM_BED_HVR + '" class="LinkText">' + i18n.ROOM_BED + '</span>';
            htmlTable += '</td>';
        }
        //015 sort subhdrs
        /**
         * @author CC009905
         * Load the sub headers next
         */
        htmlTable = CreateHtmlSubHdrs(htmlTable);
        htmlTable += '</tr>';
        htmlTable += '</table>';
        htmlTable += '<table id="hdrtable2" border="0" width="';
        htmlTable += hdrTable2Width;
        htmlTable += '" cellspacing="0" cellpadding="0">';
        htmlTable += '<tbody id="offTblBdy">';
        for (var i = 0; i < json_patients.PTREPLY.PATIENTS.length; i++) {
            //Verify if this is the first page.
            tempPageNum = json_patients.PTREPLY.PATIENTS[i].PAGENUM;
            //Patient Name.
            strPatientName = json_patients.PTREPLY.PATIENTS[i].NAME;
            //Verify if the patient name consist of " or ' characters.
            //^^ = "
            //^ = '
            if (strPatientName.indexOf("^^") > -1) {
                strPatientName = strPatientName.replace("^^", "&#34;");
            }
            if (strPatientName.indexOf("^") > -1) {
                strPatientName = strPatientName.replace("^", "&#39;");
            }
            if (parseInt(pageNum) == parseInt(tempPageNum)) {
                //Set unique values.
                intNumber = 0;
                intNumber = parseInt(i) + parseInt(1);
                uniqueRowNumber = 0;
                uniqueRowNumber = json_patients.PTREPLY.PATIENTS[i].ENCNTR_ID;
                uniqueRowNumber = intNumber;
                //tempstr = "";
                //tempstr = "patient" + intNumber;
                tempEncounterID = "";
                tempEncounterID = "patEncounter" + uniqueRowNumber;
                //Keep track on value for rowspan.
                rowSpanCounter = parseInt(rowSpanCounter) + parseInt(2);
                var oHtmlObj = HideRow(htmlTable, tempEncounterID, intNumber);
                hideRow = oHtmlObj.hideRow;
                htmlTable = oHtmlObj.htmlTable;
                //Link to Patient Information Tab.
                //017 alink = '<a href="' + "javascript:launchTab('" + 'Patient Information' + "'," + json_patients.PTREPLY.PATIENTS[i].PT_ID + "," + json_patients.PTREPLY.PATIENTS[i].ENCNTR_ID + ');"' +
                //017 adding tab name from users position
                alink = '<a href=`' + "javascript:launchTab(/" + tabNameSTRG + "/," + json_patients.PTREPLY.PATIENTS[i].PT_ID + "," + json_patients.PTREPLY.PATIENTS[i].ENCNTR_ID + ');`' +  //017
                ' title="Open the ' +
                //017 'Patient Information' +
                tabNameSTRG + //017 adding tab name from users position to the hover
                ' tab." class="LinkText">';
                //Patient Demographics
                //Name
                htmlTable += '<td id="';
                htmlTable += 'patientname';
                htmlTable += intNumber;
                htmlTable += '" class="demnamecell2 CellWidth250">';
                htmlTable += '<span id="ec|rowbtn';
                htmlTable += intNumber;
                htmlTable += '" title="' + i18n.demog.CLICK_TO_EXP_PAT_INFO_HVR + '" onclick="javascript:expandCollapseTable(';
                htmlTable += "'rowbtn";
                htmlTable += intNumber;
                htmlTable += "');";
                htmlTable += '" class="spanCursor2g">[+] ';
                htmlTable += '</span>';
                htmlTable += alink;
                //Verify if the patient name consist of " or ' characters.
                //^^ = "
                //^ = '
                if (strPatientName.indexOf("^^") > -1) {
                    strPatientName = strPatientName.replace("^^", "&#34;");
                }
                if (strPatientName.indexOf("^") > -1) {
                    strPatientName = strPatientName.replace("^", "&#39;");
                }
                htmlTable += strPatientName;
                htmlTable += '</a>';
                htmlTable += '</td>';
                //Date of Birth
                htmlTable += '<td id="';
                htmlTable += 'patientbdttm';
                htmlTable += intNumber;
                htmlTable += '" class="demnamecell CellWidth100">';
                htmlTable += json_patients.PTREPLY.PATIENTS[i].BIRTHDTJS;
                htmlTable += '</td>';
                //FIN or MRN
                //Verify if it is going to be FIN or MRN.
                if (strMrnFin.toLowerCase() == "f") {
                    htmlTable += '<td id="';
                    htmlTable += 'patientfin';
                    htmlTable += intNumber;
                    htmlTable += '" class="demcell CellWidth150">';
                    htmlTable += json_patients.PTREPLY.PATIENTS[i].FIN;
                    htmlTable += '</td>';
                }
                else {
                    htmlTable += '<td id="';
                    htmlTable += 'patientmrn';
                    htmlTable += intNumber;
                    htmlTable += '" class="demcell CellWidth150">';
                    htmlTable += json_patients.PTREPLY.PATIENTS[i].MRN;
                    htmlTable += '</td>';
                }
                if (strRmBd == 1) //room/bed   015 new column
                {
                    //room/bed   015 new column
                    htmlTable += '<td id="';
                    htmlTable += 'roombed';
                    htmlTable += intNumber;
                    htmlTable += '" class="demnamecell CellWidth100">';
                    htmlTable += json_patients.PTREPLY.PATIENTS[i].ROOM;
                    htmlTable += '/';
                    htmlTable += json_patients.PTREPLY.PATIENTS[i].BED;
                    htmlTable += '</td>';
                }
                for (m = 1; m < numberOfConditions; m++) {
                    switch (m) {
                        case parseInt(amiDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.AMI, amiSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(heartFailureDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.HEART_FAILURE, hrtFailSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(pneumoniaDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.PNEUMONIA, pneuSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(cacDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.CHILDRENS_ASTHMA, cacSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(vteDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.VTE, vteSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(strokeDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.STROKE, strokeSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(scipDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.SCIP, scipSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(immDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.IMM, immSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(tobDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.TOB, tobSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(subDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.SUB, subSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(pcDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.PC, pcSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(hbipsDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.HBIPS, hbipsSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(sepsisDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.SEPSIS, sepsisSbHdrDispArray, intNumber, i)
                            break;
                        case parseInt(hsDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable, i18n.condDisp.HS, hsSbHdrDispArray, intNumber, i)
                            break;
                    }
                }
                //ENCNTR_ID
                var oPatData = patData[getPatObjIdxByEnctr(json_patients.PTREPLY.PATIENTS[i].ENCNTR_ID)];
                htmlTable += buildPatDemogTable(oPatData, intNumber, hideRow, uniqueRowNumber);
            }
            //Verify if this is the first record.
            //Note: this code is used for building a JSON string for the function getAMI.
            if (i == 0) {
                strPatientDemog += '{"PID":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].PT_ID;
                strPatientDemog += ',"EID":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].ENCNTR_ID;
                strPatientDemog += ',"NAME":"';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].NAME;
                strPatientDemog += '","BIRTHDT":"';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].BIRTH_DT;
                strPatientDemog += '","EIDTYPE":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].ENCNTR_TYPECD;
                strPatientDemog += ',"ADMITDT":"';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].ADMIT_DT;
                strPatientDemog += '","FACILITYCD":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].FACILITYCD;
                strPatientDemog += ',"ORGID":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].ORG_ID;
                strPatientDemog += '}';
            }
            else {
                strPatientDemog += ',{"PID":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].PT_ID;
                strPatientDemog += ',"EID":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].ENCNTR_ID;
                strPatientDemog += ',"NAME":"';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].NAME;
                strPatientDemog += '","BIRTHDT":"';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].BIRTH_DT;
                strPatientDemog += '","EIDTYPE":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].ENCNTR_TYPECD;
                strPatientDemog += ',"ADMITDT":"';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].ADMIT_DT;
                strPatientDemog += '","FACILITYCD":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].FACILITYCD;
                strPatientDemog += ',"ORGID":';
                strPatientDemog += json_patients.PTREPLY.PATIENTS[i].ORG_ID;
                strPatientDemog += '}';
            }
        }
        htmlTable += '</tbody>';
        htmlTable += '</table>';
        //Assign HTML.
        document.getElementById("divMainTable").innerHTML = htmlTable;
        //Verify if need to adjust the RowSpan.
        if (rowSpanCounter < 50) {
            if (amiDisplayIndicator > 0) {
                //ami
                document.getElementById("patientED").rowSpan = rowSpanCounter;
            }
            if (heartFailureDisplayIndicator > 0)//015
            {
                //Heart Failure
                document.getElementById("cellHeartFailureRowSpan").rowSpan = rowSpanCounter;
            }
            if (pneumoniaDisplayIndicator > 0) //015
            {
                //Pneumonia
                document.getElementById("cellPneumoniaRowSpan").rowSpan = rowSpanCounter;
            }
            if (cacDisplayIndicator > 0) //015
            {
                //Childrenâ€™s Asthma
                document.getElementById("cellChildrenAsthmaRowSpan").rowSpan = rowSpanCounter;
            }
            if (vteDisplayIndicator > 0) //015
            {
                //VTE
                document.getElementById("cellVTERowSpan").rowSpan = rowSpanCounter;
            }
            if (strokeDisplayIndicator > 0) //015
            {
                //Stroke
                document.getElementById("cellStrokeRowSpan").rowSpan = rowSpanCounter;
            }
            if (scipDisplayIndicator > 0) //015
            {
                //SCIP
                document.getElementById("cellSCIPRowSpan").rowSpan = rowSpanCounter;
            }
            if (pressureUlcerDisplayIndicator > 0) //015
            {
                //Pressure Ulcers
                document.getElementById("cellPressureUlcersRowSpan").rowSpan = rowSpanCounter;
            }
            if (criDisplayIndicator > 0) //015
            {
                //CRI
                document.getElementById("cellCRIRowSpan").rowSpan = rowSpanCounter;
            }
            if (fallsDisplayIndicator > 0) //015
            {
                //Falls
                document.getElementById("cellFallsRowSpan").rowSpan = rowSpanCounter;
            }
            if (pediatricFallsDisplayIndicator > 0) //015
            {
                //Falls â€“ Pediatric
                document.getElementById("cellFallsPediatricRowSpan").rowSpan = rowSpanCounter;
            }
            if (painIndicator > 0) //015
            {
                //Pain
                document.getElementById("cellPainRowSpan").rowSpan = rowSpanCounter;
            }
            if (pedPainIndicator > 0) //015
            {
                //Pain â€“ Pediatric
                document.getElementById("cellPedPainRowSpan").rowSpan = rowSpanCounter;
            }
            if (pSkinIndicator > 0) //015
            {
                //Skin Pediatric // ;;014 addition of Pediatric Skin condition
                document.getElementById("cellpSkinRowSpan").rowSpan = rowSpanCounter;
            }
            if (immDisplayIndicator > 0) {
                //Imm
                document.getElementById("cellImmRowSpan").rowSpan = rowSpanCounter;
            }
            if (tobDisplayIndicator > 0) {
                //Tob
                document.getElementById("cellTobRowSpan").rowSpan = rowSpanCounter;
            }
            if (subDisplayIndicator > 0) {
                //Sub
                document.getElementById("cellSubRowSpan").rowSpan = rowSpanCounter;
            }
            if (pcDisplayIndicator > 0) {
                //PC
                document.getElementById("cellPcRowSpan").rowSpan = rowSpanCounter;
            }
            if (hbipsDisplayIndicator > 0) {
                //HBIPS
                document.getElementById("cellHbipsRowSpan").rowSpan = rowSpanCounter;
            }
            if (sepsisDisplayIndicator > 0) {
                document.getElementById("cellSepsisRowSpan").rowSpan = rowSpanCounter;
            }
            if (hsDisplayIndicator > 0) {
                document.getElementById("cellHSRowSpan").rowSpan = rowSpanCounter;
            }
        }
        //Set attribute for the headline Patient Demographics.
        document.getElementById("secpathdrtxt").onmousedown = function (e) {
            //Verify it the value is True or False.
            //True = Right Mouse Button.
            //False = Not Right Mouse Button.
            if (verifyMouseButton(e)) {
                displayVersionText();
            }
        }
        //Verify which value the patient indicator has.
        //0 = Both qualifying and non qualifying patients.
        //1 = Only qualifying patients.
        if (strPtQualind == 1) {
            //Note: this variable is used in every expandCollapse function.
            PgRecTotal = intNumber;
        }
        else {
            //Note: this variable is used in every expandCollapse function.
            PgRecTotal = intNumber;
        }
        //Show Table
        document.getElementById("hdrtable").style.display = "";
    }
    catch (error) {
        showErrorMessage(error.message, "refillDemographics", "", "");
        blnStatus = false;
    }
    return blnStatus;
}
/**
 * Fills the section Patient Demographics with values and creates the two main HTML tables. Returns True if everything went well else it returns False.
 * @return{Boolean}
 */
function fillDemographics(){
    var alink = "";
    var blnStatus = true;
    var intNumber = 0;
    var tempCell = 0;
    var tempstr = "";
    var htmlTable = "";
    var hideRow = "";
    var strPageOf = "";
    var strPreviousNextLinks = "";
    var tempPageNum = 0;
    var uniqueRowNumber = "";
    var tempEncounterID = "";
    var strPatientName = "";
    var isItHidden = "";

    try {
        //Get number of pages.
        if (pageCNT > 1) {
            strPageOf += i18n.PAGE_1_OF;
            strPageOf += pageCNT;
            strPageOf += '&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;';
        }
        else {
            strPageOf = i18n.PAGE_1_OF + ' 1&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;';
        }
        //Assign HTML.
        document.getElementById("spanPageOf").innerHTML = strPageOf;

        //Set Previous and Next Links.
        strPreviousNextLinks = '<a href="javascript:displayPreviousPage();" class="LinkText" title="'+i18n.PREVIOUS_PAGE+'">'+i18n.PREVIOUS+'</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="javascript:displayNextPage();" class="LinkText" title="'+i18n.NEXT_PAGE+'">'+i18n.NEXT+'</a>';
        //Assign HTML.
        document.getElementById("spanPreviousNext").innerHTML = strPreviousNextLinks;

        //room bed column 015
        if (strRmBd != 0) // 15 3.3 enhancements
        {
            hdrTableWidth = parseInt(hdrTableWidth) + parseInt(120);
            hdrTable2Width = hdrTableWidth;
        }

        htmlTable += '<table id="hdrtable" style="display:none;" border="0" width="';

        htmlTable += hdrTableWidth;
        htmlTable += '" cellspacing="0" cellpadding="0">';

        //Main Headers Row.
        //Patient Demographics
        htmlTable += '<tr id="sechdrs">';
        //015 larger table htmlTable += '<td id="secpatlisthdr" colspan="3" class="tabhdrs CellWidth500">';
        if (strRmBd == 1) //015 larger table
        {
            htmlTable += '<td id="secpatlisthdr" colspan="4" class="tabhdrs CellWidth600">';
        }
        else {
            htmlTable += '<td id="secpatlisthdr" colspan="3" class="tabhdrs CellWidth500">';
        }
        htmlTable += '<div id="secpathdrtxt">'+i18n.demog.PATIENT_DEMOGRAPHICS+'</div>';
        htmlTable += '</td>';
        //015 3.3 enhancements

        /**015
         * @author CC009905
         * Loads the nhiqm headers in thier respective places.
         */

         for (i=0;l=oColHdrs.length,i<l;i++)
        {
            oColHdr = oColHdrs[i];
            if (oColHdr.dispInd > 0 && oColHdr.sbSecInd == 0)
            {
                switch(oColHdr.strSecNm)
                {
                    case sixColHdrs[0]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[0]);
                        break;
                    case sixColHdrs[1]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[1]);
                        break;
                    case sixColHdrs[2]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[2]);
                        break;
                    case sixColHdrs[3]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[3]);
                        break;
                    case sixColHdrs[4]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[4]);
                        break;
                    case sixColHdrs[5]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[5]);
                        break;
                    case sixColHdrs[6]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[6]);
                        break;
                    case sixColHdrs[7]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[7]);
                        break;
                    case sixColHdrs[8]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[8]);
                        break;
                    case sixColHdrs[9]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[9]);
                        break;
                    case sixColHdrs[10]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[10]);
                        break;
                    case sixColHdrs[11]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[11]);
                        break;
                    case sixColHdrs[12]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[12]);
                        break;
                    case sixColHdrs[13]:
                        htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,sixColAbbr[13]);
                        break;
                    case threeColHdrs[0]:
                        htmlTable += '<td id="secpatlisthdrPressureUlcers" class="tabhdrs2g CellWidth40">';
                        htmlTable += '<div id="divPressureUlcerstext" title="'+i18n.condDisp.EXP_ULCERS_HVR+'" class="mainColumn2g" onclick="expandCollapsePressureUlcers();">+</div>';
                        htmlTable += '</td>';
                        break;
                    case threeColHdrs[1]:
                        htmlTable += '<td id="secpatlisthdrCRI" class="tabhdrs2g CellWidth40">';
                        htmlTable += '<div id="divCRItext" title="'+i18n.condDisp.EXP_CRI_HVR+'" class="mainColumn2g" onclick="expandCollapseCRI();">+</div>';
                        htmlTable += '</td>';
                        break;
                    case threeColHdrs[2]:
                        htmlTable += '<td id="secpatlisthdrFalls" class="tabhdrs2g CellWidth40">';
                        htmlTable += '<div id="divFallstext" title="'+i18n.condDisp.EXP_FALLS_HVR+'" class="mainColumn2g" onclick="expandCollapseFalls();">+</div>';
                        htmlTable += '</td>';
                        break;
                    case threeColHdrs[3]:
                        htmlTable += '<td id="secpatlisthdrFallsPediatric" class="tabhdrs2g CellWidth40">';
                        htmlTable += '<div id="divFallsPediatrictext" title="'+i18n.condDisp.EXP_PED_FALLS_HVR+'" class="mainColumn2g" onclick="expandCollapseFallsPediatric();">+</div>';
                        htmlTable += '</td>';
                        break;
                    case threeColHdrs[4]:
                        htmlTable += '<td id="secpatlisthdrPain" class="tabhdrs2g CellWidth40">';
                        htmlTable += '<div id="divPaintext" title="'+i18n.condDisp.EXP_PAIN_HVR+'" class="mainColumn2g" onclick="expandCollapsePain();">+</div>';
                        htmlTable += '</td>';
                        break;
                    case threeColHdrs[5]:
                        htmlTable += '<td id="secpatlisthdrPedPain" class="tabhdrs2g CellWidth40">';
                        htmlTable += '<div id="divPedPaintext" title="'+i18n.condDisp.EXP_PED_PAIN_HVR+'" class="mainColumn2g" onclick="expandCollapsePedPain();">+</div>';
                        htmlTable += '</td>';
                        break;
                    case fourColHdrs[0]:
                        htmlTable += '<td id="secpatlisthdrpSkin" class="tabhdrs2g CellWidth40">';
                        htmlTable += '<div id="divpSkintext" title="'+i18n.condDisp.EXP_PED_SKIN_HVR+'" class="mainColumn2g" onclick="expandCollapsepSkin();">+</div>';
                        htmlTable += '</td>';
                    default:
                        //htmlTable = CreateColHtml(htmlTable,oColHdr.strSecNm,"");
                        break;
                }

            }
        }

        htmlTable += '</tr>';

        //Sub Headers Row
        htmlTable += '<tr id="secsubhdrs">';

        //Patient Demographics


        //Name
        htmlTable += '<td id="secsubcol1" class="subhdrs CellWidth250">';
        htmlTable += '<span onclick="javascript:this.blur(); SortPatData('; //"name");"';
        htmlTable += "'name');";
        htmlTable += '" title="'+i18n.SORT_BY_NAME_HVR+'" class="LinkText">'+i18n.NAME+'</span>';
        htmlTable += '</td>';


        //Date Of Birth
        htmlTable += '<td id="secsubcol2" class="subhdrs CellWidth100">';
        htmlTable += '<span onclick="javascript:this.blur();return SortPatData(';
        htmlTable += "'dob');";
        htmlTable += '" title="'+i18n.SORT_BY_DOB_HVR+'" class="LinkText">'+i18n.DOB+'</span>';
        htmlTable += '</td>';
        //FIN or MRN
        //Verify if it is going to be FIN or MRN.
        if (strMrnFin.toLowerCase() == "f") {
            htmlTable += '<td id="secsubcol3" class="subhdrs CellWidth150">';
            htmlTable += '<span onclick="javascript:this.blur();return SortPatData(';
            htmlTable += "'fin');";
            htmlTable += '" title="'+i18n.SORT_BY_FIN_HVR+'" class="LinkText">'+i18n.FIN+'</span>';
            htmlTable += '</td>';
        }
        else {
            htmlTable += '<td id="secsubcol3" class="subhdrs CellWidth150">';
            htmlTable += '<span onclick="javascript:this.blur();return SortPatData(';
            htmlTable += "'mrn');";
            htmlTable += '" title="'+i18n.SORT_BY_MRN_HVR+'" class="LinkText">'+i18n.MRN+'</span>';
            htmlTable += '</td>';
        }
        if (strRmBd == 1) //015 new column
        {
            //room/bed   015 new column
            htmlTable += '<td id="secsubcol4" class="subhdrs CellWidth100">';
            htmlTable += '<span onclick="javascript:this.blur();return SortPatData(';
            htmlTable += "'roomBed');";
            htmlTable += '" title="'+i18n.SORT_BY_ROOM_BED_HVR+'" class="LinkText">'+i18n.ROOM_BED+'</span>';
            htmlTable += '</td>';
        }


        //015 sort subhdrs
        /**
         * @author CC009905
         * Load the sub headers next
         */


        htmlTable = CreateHtmlSubHdrs(htmlTable);


        htmlTable += '</tr>';

        htmlTable += '</table>';

        htmlTable += '<table id="hdrtable2" border="0" width="';
        htmlTable += hdrTable2Width;
        htmlTable += '" cellspacing="0" cellpadding="0">';

        htmlTable += '<tbody id="offTblBdy">';


        tabNameSTRG2 = encodeURIComponent(tabNameSTRG);
        tabNameSTRG2 = encodeURIComponent(tabNameSTRG2);
        for (var i = 0; i < json_data2.PTREPLY.PATIENTS.length; i++) {
            //Verify if this is the first page.
            tempPageNum = json_data2.PTREPLY.PATIENTS[i].PAGENUM;
            //Patient Name.
            strPatientName = json_data2.PTREPLY.PATIENTS[i].NAME;

            //Verify if the patient name consist of " or ' characters.
            //^^ = "
            //^ = '
            if (strPatientName.indexOf("^^") > -1) {
                strPatientName = strPatientName.replace("^^", "&#34;");
            }
            if (strPatientName.indexOf("^") > -1) {
                strPatientName = strPatientName.replace("^", "&#39;");
            }
            if (parseInt(pageNum) == parseInt(tempPageNum)) {

                //Set unique values.
                intNumber = 0;
                intNumber = parseInt(i) + parseInt(1);
                uniqueRowNumber = 0;
                uniqueRowNumber = json_data2.PTREPLY.PATIENTS[i].ENCNTR_ID;

                uniqueRowNumber = intNumber;

                //tempstr = "";
                //tempstr = "patient" + intNumber;
                tempEncounterID = "";
                tempEncounterID = "patEncounter" + uniqueRowNumber;

                //Keep track on value for rowspan.
                rowSpanCounter = parseInt(rowSpanCounter) + parseInt(2);

                var oHtmlObj = HideRow(htmlTable,tempEncounterID,intNumber);
                hideRow = oHtmlObj.hideRow;
                htmlTable = oHtmlObj.htmlTable;

                //Link to Patient Information Tab.
                //017 alink = '<a href="' + "javascript:launchTab('" + 'Patient Information' + "'," + json_data2.PTREPLY.PATIENTS[i].PT_ID + "," + json_data2.PTREPLY.PATIENTS[i].ENCNTR_ID + ');"' +
                //017 adding tab name from users position
                alink = '<a href=`' + "javascript:launchTab(/" + tabNameSTRG2 + "/," + json_data2.PTREPLY.PATIENTS[i].PT_ID + "," + json_data2.PTREPLY.PATIENTS[i].ENCNTR_ID + ');`' +  //017
                ' title="Open the ' +
                //017 'Patient Information' +
                tabNameSTRG + //017 adding tab name from users position to the hover
                ' tab." class="LinkText">';

                //Patient Demographics
                //Name
                htmlTable += '<td id="';
                htmlTable += 'patientname';
                htmlTable += intNumber;
                htmlTable += '" class="demnamecell2 CellWidth250">';
                htmlTable += '<span id="ec|rowbtn';
                htmlTable += intNumber;
                htmlTable += '" title="'+i18n.demog.CLICK_TO_EXP_PAT_INFO_HVR+'" onclick="javascript:expandCollapseTable(';
                htmlTable += "'rowbtn";
                htmlTable += intNumber;
                htmlTable += "');";
                htmlTable += '" class="spanCursor2g">[+] ';
                htmlTable += '</span>';
                htmlTable += alink;

                //Verify if the patient name consist of " or ' characters.
                //^^ = "
                //^ = '
                if (strPatientName.indexOf("^^") > -1) {
                    strPatientName = strPatientName.replace("^^", "&#34;");
                }
                if (strPatientName.indexOf("^") > -1) {
                    strPatientName = strPatientName.replace("^", "&#39;");
                }

                htmlTable += strPatientName;
                htmlTable += '</a>';
                htmlTable += '</td>';
                //Date of Birth
                htmlTable += '<td id="';
                htmlTable += 'patientbdttm';
                htmlTable += intNumber;
                htmlTable += '" class="demnamecell CellWidth100">';
                htmlTable += json_data2.PTREPLY.PATIENTS[i].BIRTHDTJS;
                htmlTable += '</td>';
                //FIN or MRN
                //Verify if it is going to be FIN or MRN.
                if (strMrnFin.toLowerCase() == "f") {
                    htmlTable += '<td id="';
                    htmlTable += 'patientfin';
                    htmlTable += intNumber;
                    htmlTable += '" class="demcell CellWidth150">';
                    htmlTable += json_data2.PTREPLY.PATIENTS[i].FIN;
                    htmlTable += '</td>';
                }
                else {
                    htmlTable += '<td id="';
                    htmlTable += 'patientmrn';
                    htmlTable += intNumber;
                    htmlTable += '" class="demcell CellWidth150">';
                    htmlTable += json_data2.PTREPLY.PATIENTS[i].MRN;
                    htmlTable += '</td>';
                }
                if (strRmBd == 1) //room/bed   015 new column
                {
                    //room/bed   015 new column
                    htmlTable += '<td id="';
                    htmlTable += 'roombed';
                    htmlTable += intNumber;
                    htmlTable += '" class="demnamecell CellWidth100">';
                    htmlTable += json_data2.PTREPLY.PATIENTS[i].ROOM;
                    htmlTable += '/';
                    htmlTable += json_data2.PTREPLY.PATIENTS[i].BED;
                    htmlTable += '</td>';
                }

                for (m=1; m < numberOfConditions; m++)
                {
                    switch (m)
                    {
                        case parseInt(amiDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.AMI,amiSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(heartFailureDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.HEART_FAILURE,hrtFailSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(pneumoniaDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.PNEUMONIA,pneuSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(cacDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.CHILDRENS_ASTHMA,cacSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(vteDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.VTE,vteSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(strokeDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.STROKE,strokeSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(scipDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.SCIP,scipSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(pressureUlcerDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.PRESSURE_ULCERS,pressUlcrSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(criDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.CRI,criSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(fallsDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.FALLS,fallsSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(pediatricFallsDisplayIndicator):
                            tempStr = i18n.condDisp.FALL_PEDIATRIC.replace("-", "&#45;")
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,tempStr,pedFallsSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(painIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.PAIN,painSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(pedPainIndicator):
                            tempStr = i18n.condDisp.PED_PAIN.replace("-","&#45;");
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,tempStr,pedPainSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(pSkinIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.PED_SKIN,pSkinSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(immDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.IMM,immSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(tobDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.TOB,tobSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(subDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.SUB,subSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(pcDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.PC,pcSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(hbipsDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.HBIPS,hbipsSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(sepsisDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.SEPSIS,sepsisSbHdrDispArray,intNumber,i)
                            break;
                        case parseInt(hsDisplayIndicator):
                            htmlTable = CreateHtmlSubHdrsVert(htmlTable,i18n.condDisp.HS,hsSbHdrDispArray,intNumber,i)
                            break;
                    }
                }
                //ENCNTR_ID
                var oPatData = patData[getPatObjIdxByEnctr(json_data2.PTREPLY.PATIENTS[i].ENCNTR_ID)];
                htmlTable += buildPatDemogTable(oPatData,intNumber,hideRow,uniqueRowNumber);

            }

            //Verify if this is the first record.
            //Note: this code is used for building a JSON string for the function getAMI.
            if (i == 0) {
                strPatientDemog += '{"PID":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].PT_ID;
                strPatientDemog += ',"EID":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].ENCNTR_ID;
                strPatientDemog += ',"NAME":"';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].NAME;
                strPatientDemog += '","BIRTHDT":"';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].BIRTH_DT;
                strPatientDemog += '","EIDTYPE":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].ENCNTR_TYPECD;
                strPatientDemog += ',"ADMITDT":"';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].ADMIT_DT;
                strPatientDemog += '","FACILITYCD":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].FACILITYCD;
                strPatientDemog += ',"ORGID":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].ORG_ID;
                strPatientDemog += '}';
            }
            else {
                strPatientDemog += ',{"PID":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].PT_ID;
                strPatientDemog += ',"EID":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].ENCNTR_ID;
                strPatientDemog += ',"NAME":"';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].NAME;
                strPatientDemog += '","BIRTHDT":"';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].BIRTH_DT;
                strPatientDemog += '","EIDTYPE":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].ENCNTR_TYPECD;
                strPatientDemog += ',"ADMITDT":"';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].ADMIT_DT;
                strPatientDemog += '","FACILITYCD":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].FACILITYCD;
                strPatientDemog += ',"ORGID":';
                strPatientDemog += json_data2.PTREPLY.PATIENTS[i].ORG_ID;
                strPatientDemog += '}';
            }

        }

        htmlTable += '</tbody>';
        htmlTable += '</table>';

        //Assign HTML.
        document.getElementById("divMainTable").innerHTML = htmlTable;

        //Verify if need to adjust the RowSpan.
        if (rowSpanCounter < 50) {
            if (amiDisplayIndicator > 0)
            {
                //ami
                document.getElementById("patientED").rowSpan = rowSpanCounter;
            }
            if (heartFailureDisplayIndicator > 0)//015
            {
                //Heart Failure
                document.getElementById("cellHeartFailureRowSpan").rowSpan = rowSpanCounter;
            }
            if (pneumoniaDisplayIndicator > 0) //015
            {
                //Pneumonia
                document.getElementById("cellPneumoniaRowSpan").rowSpan = rowSpanCounter;
            }
            if (cacDisplayIndicator > 0) //015
            {
                //Children’s Asthma
                document.getElementById("cellChildrenAsthmaRowSpan").rowSpan = rowSpanCounter;
            }
            if (vteDisplayIndicator > 0) //015
            {
                //VTE
                document.getElementById("cellVTERowSpan").rowSpan = rowSpanCounter;
            }
            if (strokeDisplayIndicator > 0) //015
            {
                //Stroke
                document.getElementById("cellStrokeRowSpan").rowSpan = rowSpanCounter;
            }
            if (scipDisplayIndicator > 0) //015
            {
                //SCIP
                document.getElementById("cellSCIPRowSpan").rowSpan = rowSpanCounter;
            }
            if (pressureUlcerDisplayIndicator > 0) //015
            {
                //Pressure Ulcers
                document.getElementById("cellPressureUlcersRowSpan").rowSpan = rowSpanCounter;
            }
            if (criDisplayIndicator > 0) //015
            {
                //CRI
                document.getElementById("cellCRIRowSpan").rowSpan = rowSpanCounter;
            }
            if (fallsDisplayIndicator > 0) //015
            {
                //Falls
                document.getElementById("cellFallsRowSpan").rowSpan = rowSpanCounter;
            }
            if (pediatricFallsDisplayIndicator > 0) //015
            {
                //Falls – Pediatric
                document.getElementById("cellFallsPediatricRowSpan").rowSpan = rowSpanCounter;
            }
            if (painIndicator > 0) //015
            {
                //Pain
                document.getElementById("cellPainRowSpan").rowSpan = rowSpanCounter;
            }
            if (pedPainIndicator > 0) //015
            {
                //Pain – Pediatric
                document.getElementById("cellPedPainRowSpan").rowSpan = rowSpanCounter;
            }
            if (pSkinIndicator > 0) //015
            {
                //Skin Pediatric // ;;014 addition of Pediatric Skin condition
                document.getElementById("cellpSkinRowSpan").rowSpan = rowSpanCounter;
            }
            if (immDisplayIndicator > 0)
            {
                //Imm
                document.getElementById("cellImmRowSpan").rowSpan = rowSpanCounter;
            }
            if (tobDisplayIndicator > 0)
            {
                //Tob
                document.getElementById("cellTobRowSpan").rowSpan = rowSpanCounter;
            }
            if (subDisplayIndicator > 0)
            {
                //Sub
                document.getElementById("cellSubRowSpan").rowSpan = rowSpanCounter;
            }
            if (pcDisplayIndicator > 0)
            {
                //PC
                document.getElementById("cellPcRowSpan").rowSpan = rowSpanCounter;
            }
            if (hbipsDisplayIndicator > 0)
            {
                //HBIPS
                document.getElementById("cellHbipsRowSpan").rowSpan = rowSpanCounter;
            }
            if (sepsisDisplayIndicator > 0)
            {
                document.getElementById("cellSepsisRowSpan").rowSpan = rowSpanCounter;
            }
            if (hsDisplayIndicator > 0){
                document.getElementById("cellHSRowSpan").rowSpan = rowSpanCounter;
            }
        }

        //Set attribute for the headline Patient Demographics.
        document.getElementById("secpathdrtxt").onmousedown = function(e){
            //Verify it the value is True or False.
            //True = Right Mouse Button.
            //False = Not Right Mouse Button.
            if (verifyMouseButton(e)) {
                displayVersionText();
            }
        }

        //Verify which value the patient indicator has.
        //0 = Both qualifying and non qualifying patients.
        //1 = Only qualifying patients.
        if (strPtQualind == 1) {
            //Note: this variable is used in every expandCollapse function.
            PgRecTotal = intNumber;
        }
        else {
            //Note: this variable is used in every expandCollapse function.
            PgRecTotal = intNumber;
        }

        //Show Table
        document.getElementById("hdrtable").style.display = "";
    }

    catch (error) {
        showErrorMessage(error.message, "fillDemographics", "", "");
        blnStatus = false;
    }

    return blnStatus;
}

/**
 * Converts date/time text to date object.
 * @param {String} input Date and Time text.
 * @param {Object} tempdate Date object.
 */
function convertdate(input, tempdate){
    var date1 = "";
    var year1 = "";
    var time1 = "";

    try {
        date1 = input.split("/");
        year1 = date1[2].split(" ");
        time1 = year1[1].split(":");

        tempdate.setFullYear(year1[0], date1[0] - 1, date1[1]);
        tempdate.setMinutes(time1[1]);
        tempdate.setHours(time1[0]);
    }
    catch (error) {
        showErrorMessage(error.message, "convertdate", "", "");
    }
}

/**
 * Expands or collapses a row in the HTML table.
 * @param {String} id Element ID.
 */
function expandCollapseTable(id){
    var content = "";
    var ec = "";

    try {
        content = document.getElementById(id);
        ec = document.getElementById("ec|" + id);

        if (content.style.display == "none") {
            //content.style.display = "block";
            content.style.display = "";
            ec.innerHTML = "[-] ";
            ec.title = i18n.demog.CLICK_TO_COLLAPSE_PAT_INFO_HVR;
        }
        else {
            content.style.display = "none";
            ec.innerHTML = "[+] ";
            ec.title = i18n.demog.CLICK_TO_EXP_PAT_INFO_HVR;
        }
    }
    catch (error) {
        showErrorMessage(error.message, "expandCollapseTable", "", "");
    }
}

/**
 * Expands or collapses the section Pressure Ulcers. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function expandCollapsePressureUlcers(){
    var intHiddenValue = 0;
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0; //015
    var content = "";
    var tempTotalValue = 0;
    var blnStatus = true;
    var intCurrentTableWidth = 0;
    var columnNumber = 0;
    var intSubtractWidth = 0;
    var tempTotalHiddenRows = 0;
    var table = "";
    var intCounter = 0;
    var rowsPageOne = 0;
    var rowsToBuild = 0;

    try {

        if (currentPage == pageCNT && !bExpLastPage)
        {
            displayPreviousPage();
            bExpLastPage = true;
            //return blnStatus;
        }
        //Verify if the Stroke JSON structure has been built.
        //True = has already been called.
        //False = has not been called.
        if (blnPressureUlcersCalled == false) {
            //Change Hidden Value.
            hiddenPressureUlcersExpandCollapse = 1;
            getPressureUlcers();
        }
        else {
            //Calculate how many rows we are going to hide and add 1 extra to inlcude the last row.
            tempTotalValue = parseInt(PgRecTotal) + parseInt(1);
            //Get hidden value.
            intHiddenValue = hiddenPressureUlcersExpandCollapse;
            //Get name of table.
            table = document.getElementById("hdrtable2");

            //0 = make the section collapsed.
            //1 = make the section expanded.
            if (intHiddenValue == 0) {
                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Change Hidden Value.
                hiddenPressureUlcersExpandCollapse = 1;

                //Change size of Table 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120)) + hdrtableWdthAdj;
                intCurrentTableWidth = parseInt(intCurrentTableWidth) - parseInt(intSubtractWidth) + parseInt(40);

                document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth);
                document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth);

                //Main Header
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[pressureUlcerDisplayIndicator].colSpan = 1;
                document.getElementById('secpatlisthdrPressureUlcers').style.width = "40px";
                document.getElementById('secpatlisthdrPressureUlcers').className = "tabhdrs2g";
                document.getElementById('secpatlisthdrPressureUlcers').innerHTML = '<div id="divPressureUlcerstext" title="'+i18n.condDisp.EXP_ULCERS_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">+</div>';

                //Sub Headers
                //Assessment
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[1].cells;
                tempValue[puCell].colSpan = "1";
                document.getElementById('secsubcolPressureUlcers1').style.width = "40px";
                document.getElementById('secsubcolPressureUlcers1').className = "tabhdrs2g";
                document.getElementById('secsubcolPressureUlcers1').style.display = "";
                document.getElementById('secsubcolPressureUlcers1').innerHTML = "";
                //Interventions
                content = "";
                tempValue = "";
                tempValue = "secsubcolPressureUlcers2";
                content = document.getElementById(tempValue);
                content.style.width = "0px";
                content.style.display = "none";
                content.innerHTML = "";
                //Pressure Ulcers
                content = "";
                tempValue = "";
                tempValue = "secsubcolPressureUlcers3";
                content = document.getElementById(tempValue);
                content.style.width = "0px";
                content.style.display = "none";
                content.innerHTML = "";

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        table.rows[intCounter].cells[puCell].style.width = "40px";
                        table.rows[intCounter].cells[puCell].className = "tabhdrsVertical";
                        table.rows[intCounter].cells[puCell].style.display = "";
                        table.rows[intCounter].cells[puCell].innerHTML = "Pressure Ulcers";
                    }
                    else {
                        //Assessment
                        table.rows[intCounter].cells[puCell].style.width = "0px";
                        table.rows[intCounter].cells[puCell].style.display = "none";
                        table.rows[intCounter].cells[puCell].innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue = "patientInterventionPressureUlcers" + i;
                    document.getElementById(tempValue).style.width = "0px";
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";
                    //Pressure Ulcers
                    tempValue = "";
                    tempValue = "patientFallsPressureUlcers" + i;
                    document.getElementById(tempValue).style.width = "0px";
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";

                    //Add 2 to the counter.
                    intCounter = intCounter + 2;
                }
                //Add the rowspan.
                table.rows[0].cells[puCell].rowSpan = rowSpanCounter;
            }
            else {
                displayLoadText("pulcer");
                //Change Hidden Value.
                hiddenPressureUlcersExpandCollapse = 0;

                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Calculate size of Tables 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120));
                intCurrentTableWidth = parseInt(intCurrentTableWidth) + parseInt(intSubtractWidth) - parseInt(40);

                //Reset global variables.
                hdrTableWidth = intCurrentTableWidth;
                hdrTable2Width = intCurrentTableWidth;

                //Set size of Tables 1 and 2.
                document.getElementById("hdrtable").width = parseInt(hdrTableWidth) + hdrtableWdthAdj;
                document.getElementById("hdrtable2").width = parseInt(hdrTable2Width) + hdrtableWdthAdj;

                //Main Header.
                tempValue = "";
                tempValue = "secpatlisthdrPressureUlcers";
                document.getElementById(tempValue).style.width = "360px";
                document.getElementById(tempValue).className = "tabhdrs";
                document.getElementById(tempValue).style.display = "";
                document.getElementById(tempValue).innerHTML = '<div id="divPressureUlcerstext" title="'+i18n.condDisp.COLLAPSE_ULCERS_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapsePressureUlcers();">- '+i18n.condDisp.PRESSURE_ULCERS+'</div>';

                //Change colspan and rowspan
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[pressureUlcerDisplayIndicator].colSpan = 3;
                table.rows[0].cells[puCell].rowSpan = 1;
                table.rows[0].cells[puCell].className = "demcell";
                table.rows[0].cells[puCell].style.display = "";
                table.rows[0].cells[puCell].innerHTML = "";

                //Sub Headers
                //Assessment
                document.getElementById('secsubcolPressureUlcers1').style.width = "120px";
                document.getElementById('secsubcolPressureUlcers1').className = "subhdrs";
                document.getElementById('secsubcolPressureUlcers1').style.display = "";
                document.getElementById('secsubcolPressureUlcers1').innerHTML = "Assessment";
                //Interventions
                document.getElementById('secsubcolPressureUlcers2').style.width = "120px";
                document.getElementById('secsubcolPressureUlcers2').className = "subhdrs";
                document.getElementById('secsubcolPressureUlcers2').style.display = "";
                document.getElementById('secsubcolPressureUlcers2').innerHTML = "Interventions";
                //Pressure Ulcer
                document.getElementById('secsubcolPressureUlcers3').style.width = "120px";
                document.getElementById('secsubcolPressureUlcers3').className = "subhdrs";
                document.getElementById('secsubcolPressureUlcers3').style.display = "";
                document.getElementById('secsubcolPressureUlcers3').innerHTML = "Pressure Ulcer";

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellPressureUlcersRowSpan";
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellPressureUlcersRowSpan" + i;
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue = "patientInterventionPressureUlcers" + i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                    //Pressure Ulcer
                    tempValue = "";
                    tempValue = "patientFallsPressureUlcers" + i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                }
                //Verify if this is the first time the section is called.
                if (blnFirstTimePressureUlcers == true) {
                    //Change flag.
                    blnFirstTimePressureUlcers = false;
                }

                //Verify which value the patient indicator has.
                //0 = Both qualifying and non qualifying patients.
                //1 = Only qualifying patients.
                if (strPtQualind == 1) {
                    //Get values for the section.
                    blnStatus = fillPressureUlcersQualifying();
                }
                else {
                    //Get values for the section.
                    blnStatus = fillPressureUlcers();
                }
            }
        }
        if (bExpLastPage)
        {
            displayNextPage();
            bExpLastPage = false;
        }
    }
    catch (error) {
        showErrorMessage(error.message, "expandCollapsePressureUlcers", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Pressure Ulcers with only qualifying values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillPressureUlcersQualifying(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strPULCERHoverText = "";
    var strPULCERHoverSPANID = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strPULCERCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intPULCERCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var tempPageNum = 0;
    var strPtQualEncounterID = 0;
    var strPtQualPatientID = 0;
    var intSectionIndicator = 0;
    var strUlcer1 = "";
    var strUlcer2 = "";
    var strType = "";
    var nUniqueRowId = 0;

    try {
        //Get Indicator.
        intSectionIndicator = json_data2.PTREPLY.PULCERIND;

        //Verify the indicator.
        //0 = The JSON object is NOT complete.
        //1 = The JSON object is complete.
        if (intSectionIndicator == 0) {
            for (var i=0;j=patData.length,i<j; i++)
            {
                var oPatData = patData[i];

                nUniqueRowId++;

                //Reset variables.
                tempString = "";
                tempString += 'patEncounter';
                tempString += nUniqueRowId;

                //Assessment
                oPatData = PopulateSection('PressureUlcers',"N/A",tempString,oPatData,pressUlcrSbHdrDispArray[0]);

                //LineDays
                oPatData = PopulateSection('PressureUlcers',"N/A",tempString,oPatData,pressUlcrSbHdrDispArray[1]);

                //CRI
                oPatData = PopulateSection('PressureUlcers',"N/A",tempString,oPatData,pressUlcrSbHdrDispArray[2]);
            }
        }
        else {
            nUniqueRowId = 0;

            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < json_data10.PULCERREPLY.PATIENTS.length; intCounter++)
            {
                //Reset variables.
                patientEncounterID = 0;
                ptQual = 0;
                tempValueX = "";
                tempValueY = "";
                tempString = "";
                strAssessmentHoverText = "";
                strAssessmentHoverSPANID = "";
                strInterventionsHoverText = "";
                strInterventionsHoverSPANID = "";
                strPULCERHoverText = "";
                strPULCERHoverSPANID = "";
                patientName = "";
                patientID = "";
                strAssessmentCircle = "";
                strInterventionsCircle = "";
                strPULCERCircle = "";
                intAssessmentCircle = 0;
                intInterventionsCircle = 0;
                intPULCERCircle = 0;
                tempValue = "";
                alink = "";
                strUlcer1 = "";
                strUlcer2 = "";
                strType = "";

                patientEncounterID = json_data10.PULCERREPLY.PATIENTS[intCounter].ENCNTR_ID;
                patientID = json_data10.PULCERREPLY.PATIENTS[intCounter].PT_ID;

                lastPatId = patientID;
                var oPatData = null;
                var objIdx = getPatObjIdxByEnctr(patientEncounterID);

                if (objIdx != null)
                {
                    oPatData = patData[objIdx];

                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                    ptQual = json_data10.PULCERREPLY.PATIENTS[intCounter].PULCER_PTQUAL;
                    patientName = json_data10.PULCERREPLY.PATIENTS[intCounter].NAME;

                    //Verify if the patient name consist of " or ' characters.
                    //^^ = "
                    //^ = '
                    if (patientName.indexOf("^^") > -1) {
                        patientName = patientName.replace("^^", "&#34;");
                    }
                    if (patientName.indexOf("^") > -1) {
                        patientName = patientName.replace("^", "&#39;");
                    }

                    //Verify PULCER_PTQUAL.
                    //0 = A value of 0 means not qualified all columns display N/A.
                    //1 = A value of 1 means the patient qualifies and needs to be evaluated.
                    if (ptQual == 1) {
                        intAssessmentCircle = json_data10.PULCERREPLY.PATIENTS[intCounter].ASSESSSTAT;
                        intInterventionsCircle = json_data10.PULCERREPLY.PATIENTS[intCounter].INTERVENTSTAT;
                        intPULCERCircle = json_data10.PULCERREPLY.PATIENTS[intCounter].PUSTAT;
                        //intAssessmentCircle = json_data10.PULCERREPLY.PATIENTS[intCounter].PULCER[0].STATUS
                        //intInterventionsCircle = json_data10.PULCERREPLY.PATIENTS[intCounter].PULCER[1].STATUS;
                        //intPULCERCircle = json_data10.PULCERREPLY.PATIENTS[intCounter].PULCER[2].STATUS;

                        //Build Hovers and Icons.
                        strAssessmentHoverSPANID += '<table>';
                        strInterventionsHoverSPANID += '<table>';
                        strPULCERHoverSPANID += '<table>';

                        //Verify which icon/icons that is/are going to be displayed in the column.
                        //Assessment
                        tempValue = "";
                        switch (intAssessmentCircle) {
                            case 0:
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strAssessmentCircle = tempValue;
                                break;
                            case 1:
                                //Set link
                                alink = "";
                                alink += "<a href='";
                                alink += "javascript:launchTab2(";
                                alink += patientID;
                                alink += ",";
                                alink += patientEncounterID;
                                alink += ");' title='="+i18n.OPEN_PAT_INFO_TAB
                                alink += " class='LinkText'>";
                                //Half Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5971_16;
                                tempValue += "' />";
                                //Alarm Clock
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img4798_16;
                                tempValue += "'/>";
                                strAssessmentHoverSPANID += '<tr><td>'+i18n.PRES_ULCER_ASSESS_NOT_COMPLETE_1+';<br>'+i18n.PRES_ULCER_ASSESS_NOT_COMPLETE_1+'</td></tr>';
                                strAssessmentHoverSPANID += "<tr><td>&nbsp</td></tr>";
                                strAssessmentHoverSPANID += '<tr><td>'
                                strAssessmentHoverSPANID += alink;
                                strAssessmentHoverSPANID += patientName;
                                strAssessmentHoverSPANID += '</a>';
                                strAssessmentHoverSPANID += '</td></tr>';
                                strAssessmentCircle = tempValue;
                                break;
                            case 2:
                                //Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                strAssessmentCircle = tempValue;
                                strAssessmentHoverSPANID += '<tr><td>'+i18n.PRES_ULCER_ASSESS_COMPLETE_1+'<br>'+i18n.PRES_ULCER_ASSESS_COMPLETE_1+'</td></tr>';
                                break
                            case 3:
                                //Green Checkmark
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img4022_16;
                                tempValue += "' />";
                                strAssessmentCircle = tempValue;
                                ;                                            strAssessmentHoverSPANID += '<tr><td>'+i18n.PRES_ULCER_NO_ASSESS_NEEDED+'</td></tr>';
                                break
                        }
                        //Interventions
                        tempValue = "";
                        switch (intInterventionsCircle) {
                            case 1:
                                //Set link
                                alink = "";
                                alink += "<a href='";
                                alink += 'javascript:launchOrders(';
                                alink += patientID;
                                alink += ',';
                                alink += patientEncounterID;
                                alink += ");' title='"+i18n.OPEN_ORDERS_PAGE_OF_CHART+"";
                                alink += patientName;
                                alink += ".' class='LinkText'>";
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                strInterventionsHoverSPANID += '<tr><td>'+i18n.PATIENT_AT_RISK_FOR_PRES_ULCER_NO_PLAN+'</td></tr>';
                                strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                                strInterventionsHoverSPANID += '<tr><td>';
                                strInterventionsHoverSPANID += alink;
                                strInterventionsHoverSPANID += patientName;
                                strInterventionsHoverSPANID += '</a>';
                                strInterventionsHoverSPANID += '</td></tr>';
                                strInterventionsCircle = tempValue;
                                break;
                            case 2:
                                //Set link
                                alink = "";
                                alink += "<a href='";
                                alink += 'javascript:launchOrders(';
                                alink += patientID;
                                alink += ',';
                                alink += patientEncounterID;
                                alink += ");' title='"+i18n.OPEN_ORDERS_PAGE_OF_CHART;
                                alink += patientName;
                                alink += ".' class='LinkText'>";
                                //Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                strInterventionsHoverSPANID += '<tr><td>'+i18n.INTERVENTIONS+': </td></tr>';
                                strInterventionsHoverSPANID += '<tr><td>';

                                for (var e = 0; e < json_data10.PULCERREPLY.PATIENTS[intCounter].EVENTS.length; e++) {
                                    strType = json_data10.PULCERREPLY.PATIENTS[intCounter].EVENTS[e].TYPE;

                                    //Verify if the type is INTERVENTIONS
                                    if (strType.toUpperCase() == 'INTERVENTIONS') {
                                        strInterventionsHoverSPANID += json_data10.PULCERREPLY.PATIENTS[intCounter].EVENTS[e].EVENT_DISP;
                                        strInterventionsHoverSPANID += "<br>";
                                    }
                                }

                                strInterventionsHoverSPANID += '</td></tr>';
                                strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                                strInterventionsHoverSPANID += '<tr><td>';
                                strInterventionsHoverSPANID += alink;
                                strInterventionsHoverSPANID += patientName;
                                strInterventionsHoverSPANID += '</a>';
                                strInterventionsHoverSPANID += '</td></tr>';
                                strInterventionsCircle = tempValue;
                                break;
                            default:
                                tempValue += "N/A";
                                strInterventionsCircle = tempValue;
                                strInterventionsHoverSPANID += '';
                                break;
                        }
                        //PULCER
                        tempValue = "";
                        switch (intPULCERCircle) {
                            case 2:
                                //Triangle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img6047_16;
                                tempValue += "' />";
                                strPULCERHoverSPANID += '<tr><td>';

                                strUlcer1 = json_data10.PULCERREPLY.PATIENTS[intCounter].ULCER1;
                                //Verify if Pressure Ulcer # 1 exists.
                                if (trim(strUlcer1) != '') {
                                    strPULCERHoverSPANID += i18n.POST_PRES_ULCER;
                                    strPULCERHoverSPANID += "<br>"+i18n.PRES_ULCER_1;
                                    strPULCERHoverSPANID += "<br>&nbsp;&nbsp;";
                                    strPULCERHoverSPANID += strUlcer1;
                                    strPULCERHoverSPANID += "<br>&nbsp;&nbsp;";
                                    strPULCERHoverSPANID += json_data10.PULCERREPLY.PATIENTS[intCounter].PUSTAGE1;
                                }

                                strUlcer2 = json_data10.PULCERREPLY.PATIENTS[intCounter].ULCER2;
                                //Verify if Pressure Ulcer # 2 exists.
                                if (trim(strUlcer2) != '') {
                                    strPULCERHoverSPANID += "<br>"+i18n.PRES_ULCER_2;
                                    strPULCERHoverSPANID += "<br>&nbsp;&nbsp;";
                                    strPULCERHoverSPANID += strUlcer2;
                                    strPULCERHoverSPANID += "<br>&nbsp;&nbsp;";
                                    strPULCERHoverSPANID += json_data10.PULCERREPLY.PATIENTS[intCounter].PUSTAGE2;
                                }

                                strPULCERHoverSPANID += '</td></tr>';
                                //Half Filled Circle
                                strPULCERCircle = tempValue;
                                break;
                            default:
                                tempValue += "N/A";
                                strPULCERCircle = tempValue;
                                strPULCERHoverSPANID += '';
                                break;
                        }
                        //Build Hovers.
                        //Assessment
                        strAssessmentHoverSPANID += '</table>';
                        strAssessmentHoverText += '<span id="'
                        strAssessmentHoverText += strAssessmentHoverSPANID;
                        strAssessmentHoverText += '"';
                        strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                        strAssessmentHoverText += '">';
                        strAssessmentHoverText += strAssessmentCircle;
                        strAssessmentHoverText += '</span>';
                        //Interventions
                        strInterventionsHoverSPANID += '</table>';
                        strInterventionsHoverText += '<span id="'
                        strInterventionsHoverText += strInterventionsHoverSPANID;
                        strInterventionsHoverText += '"';
                        strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                        strInterventionsHoverText += '">';
                        strInterventionsHoverText += strInterventionsCircle;
                        strInterventionsHoverText += '</span>';
                        //PULCER
                        strPULCERHoverSPANID += '</table>';
                        strPULCERHoverText += '<span id="'
                        strPULCERHoverText += strPULCERHoverSPANID;
                        strPULCERHoverText += '"';
                        strPULCERHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strPULCERHoverText += "'gentooltip',this.id,0,0);";
                        strPULCERHoverText += '">';
                        strPULCERHoverText += strPULCERCircle;
                        strPULCERHoverText += '</span>';

                        //Build Cells.
                        //Reset variables.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += patientEncounterID;

                        //Assessment
                        oPatData = PopulateSection('PressureUlcers',strAssessmentHoverText,tempString,oPatData,pressUlcrSbHdrDispArray[0]);

                        //Interventions
                        oPatData = PopulateSection('PressureUlcers',strInterventionsHoverText,tempString,oPatData,pressUlcrSbHdrDispArray[1]);

                        //Pressure Ulcer
                        oPatData = PopulateSection('PressureUlcers',strPULCERHoverText,tempString,oPatData,pressUlcrSbHdrDispArray[2]);
                    }
                    else {
                        //Reset variables.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Assessment
                        oPatData = PopulateSection('PressureUlcers',"N/A",tempString,oPatData,pressUlcrSbHdrDispArray[0]);

                        //LineDays
                        oPatData = PopulateSection('PressureUlcers',"N/A",tempString,oPatData,pressUlcrSbHdrDispArray[1]);

                        //CRI
                        oPatData = PopulateSection('PressureUlcers',"N/A",tempString,oPatData,pressUlcrSbHdrDispArray[2]);
                    }
                }//oPatData check
            }
        } //intSectionIndicator
        SortPatData(lastSortField);
    }
    catch (error) {
        showErrorMessage(error.message, "fillPressureUlcersQualifying", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Pressure Ulcers with values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillPressureUlcers(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strPULCERHoverText = "";
    var strPULCERHoverSPANID = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strPULCERCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intPULCERCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var strUlcer1 = "";
    var strUlcer2 = "";
    var strType = "";
    var nUniqueRowId = 0;

    try {
        if (blnPressUlcersDisplayed)
        {
            displayLoadText("pulcer");
            PopulatePatientInfo();
            return;
        }
        //Loop through the JSON structure.
        for (var intCounter = 0; intCounter < json_data10.PULCERREPLY.PATIENTS.length; intCounter++)
        {
            //Reset variables.
            patientEncounterID = 0;
            ptQual = 0;
            tempValueX = "";
            tempValueY = "";
            tempString = "";
            strAssessmentHoverText = "";
            strAssessmentHoverSPANID = "";
            strInterventionsHoverText = "";
            strInterventionsHoverSPANID = "";
            strPULCERHoverText = "";
            strPULCERHoverSPANID = "";
            patientName = "";
            patientID = "";
            strAssessmentCircle = "";
            strInterventionsCircle = "";
            strPULCERCircle = "";
            intAssessmentCircle = 0;
            intInterventionsCircle = 0;
            intPULCERCircle = 0;
            tempValue = "";
            alink = "";
            strUlcer1 = "";
            strUlcer2 = "";
            strType = "";

            patientEncounterID = json_data10.PULCERREPLY.PATIENTS[intCounter].ENCNTR_ID;
            ptQual = json_data10.PULCERREPLY.PATIENTS[intCounter].PULCER_PTQUAL;
            patientName = json_data10.PULCERREPLY.PATIENTS[intCounter].NAME;
            patientID = json_data10.PULCERREPLY.PATIENTS[intCounter].PT_ID;

            var oPatData = null;
            var objIdx = getPatObjIdxByEnctr(patientEncounterID);

            if (objIdx != null)
            {
                oPatData = patData[objIdx];

                if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                //Verify if the patient name consist of " or ' characters.
                //^^ = "
                //^ = '
                if (patientName.indexOf("^^") > -1) {
                    patientName = patientName.replace("^^", "&#34;");
                }
                if (patientName.indexOf("^") > -1) {
                    patientName = patientName.replace("^", "&#39;");
                }

                //Verify PULCER_PTQUAL.
                //0 = A value of 0 means not qualified all columns display N/A.
                //1 = A value of 1 means the patient qualifies and needs to be evaluated.
                if (ptQual == 1) {
                    intAssessmentCircle = json_data10.PULCERREPLY.PATIENTS[intCounter].ASSESSSTAT;
                    intInterventionsCircle = json_data10.PULCERREPLY.PATIENTS[intCounter].INTERVENTSTAT;
                    intPULCERCircle = json_data10.PULCERREPLY.PATIENTS[intCounter].PUSTAT;

                    //Build Hovers and Icons.
                    strAssessmentHoverSPANID += '<table>';
                    strInterventionsHoverSPANID += '<table>';
                    strPULCERHoverSPANID += '<table>';

                    //Verify which icon/icons that is/are going to be displayed in the column.
                    //Assessment
                    tempValue = "";
                    switch (intAssessmentCircle) {
                        case 0:
                            //Empty Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            strAssessmentCircle = tempValue;
                            break;
                        case 1:
                            //Set link
                            alink = "";
                            alink += "<a href='";
                            alink += "javascript:launchTab2(";
                            alink += patientID;
                            alink += ",";
                            alink += patientEncounterID;
                            alink += ");' title='"+i18n.OPEN_PAT_INFO_TAB+"' class='LinkText'>";
                            //Half Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5971_16;
                            tempValue += "' />";
                            //Alarm Clock
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img4798_16;
                            tempValue += "'/>";
                            strAssessmentHoverSPANID += '<tr><td>'+i18n.PRES_ULCER_ASSESS_NOT_COMPLETE_1+'<br> '+i18n.PRES_ULCER_ASSESS_NOT_COMPLETE_2+'</td></tr>';
                            strAssessmentHoverSPANID += "<tr><td>&nbsp</td></tr>";
                            strAssessmentHoverSPANID += '<tr><td>'
                            strAssessmentHoverSPANID += alink;
                            strAssessmentHoverSPANID += patientName;
                            strAssessmentHoverSPANID += '</a>';
                            strAssessmentHoverSPANID += '</td></tr>';
                            strAssessmentCircle = tempValue;
                            break;
                        case 2:
                            //Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            strAssessmentCircle = tempValue;
                            strAssessmentHoverSPANID += '<tr><td>'+i18n.PRES_ULCER_ASSESS_COMPLETE_1+' <br> '+i18n.PRES_ULCER_ASSESS_COMPLETE_2+'</td></tr>';
                            break
                        case 3:
                            //Green Checkmark
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img4022_16;
                            tempValue += "' />";
                            strAssessmentCircle = tempValue;
                            strAssessmentHoverSPANID += '<tr><td>'+i18n.PRES_ULCER_NO_ASSESS_NEEDED+'</td></tr>';
                            break
                    }
                    //Interventions
                    tempValue = "";
                    switch (intInterventionsCircle) {
                        case 1:
                            //Set link
                            alink = "";
                            alink += "<a href='";
                            alink += 'javascript:launchOrders(';
                            alink += patientID;
                            alink += ',';
                            alink += patientEncounterID;
                            alink += ");' title='"+i18n.OPEN_ORDERS_PAGE_OF_CHART;
                            alink += patientName;
                            alink += ".' class='LinkText'>";
                            //Empty Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            strInterventionsHoverSPANID += '<tr><td>'+i18n.PATIENT_AT_RISK_FOR_PRES_ULCER_NO_PLAN+'</td></tr>';
                            strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                            strInterventionsHoverSPANID += '<tr><td>';
                            strInterventionsHoverSPANID += alink;
                            strInterventionsHoverSPANID += patientName;
                            strInterventionsHoverSPANID += '</a>';
                            strInterventionsHoverSPANID += '</td></tr>';
                            strInterventionsCircle = tempValue;
                            break;
                        case 2:
                            //Set link
                            alink = "";
                            alink += "<a href='";
                            alink += 'javascript:launchOrders(';
                            alink += patientID;
                            alink += ',';
                            alink += patientEncounterID;
                            alink += ");' title='"+i18n.OPEN_ORDERS_PAGE_OF_CHART;
                            alink += patientName;
                            alink += ".' class='LinkText'>";
                            //Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            strInterventionsHoverSPANID += '<tr><td>'+i18n.INTERVENTIONS+': </td></tr>';
                            strInterventionsHoverSPANID += '<tr><td>';

                            for (var e = 0; e < json_data10.PULCERREPLY.PATIENTS[intCounter].EVENTS.length; e++) {
                                strType = json_data10.PULCERREPLY.PATIENTS[intCounter].EVENTS[e].TYPE;

                                //Verify if the type is INTERVENTIONS
                                if (strType.toUpperCase() == 'INTERVENTIONS') {
                                    strInterventionsHoverSPANID += json_data10.PULCERREPLY.PATIENTS[intCounter].EVENTS[e].EVENT_DISP;
                                    strInterventionsHoverSPANID += "<br>";
                                }
                            }

                            strInterventionsHoverSPANID += '</td></tr>';
                            strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                            strInterventionsHoverSPANID += '<tr><td>';
                            strInterventionsHoverSPANID += alink;
                            strInterventionsHoverSPANID += patientName;
                            strInterventionsHoverSPANID += '</a>';
                            strInterventionsHoverSPANID += '</td></tr>';

                            strInterventionsCircle = tempValue;
                            break;
                        default:
                            tempValue += "N/A";
                            strInterventionsCircle = tempValue;
                            strInterventionsHoverSPANID += '';
                            break;
                    }
                    //PULCER
                    tempValue = "";
                    switch (intPULCERCircle) {
                        case 2:
                            //Triangle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img6047_16;
                            tempValue += "' />";
                            strPULCERHoverSPANID += '<tr><td>';

                            strUlcer1 = json_data10.PULCERREPLY.PATIENTS[intCounter].ULCER1;
                            //Verify if Pressure Ulcer # 1 exists.
                            if (trim(strUlcer1) != '') {
                                strPULCERHoverSPANID += i18n.POST_PRES_ULCER;
                                strPULCERHoverSPANID += "<br>"+i18n.PRES_ULCER_1;
                                strPULCERHoverSPANID += "<br>&nbsp;&nbsp;";
                                strPULCERHoverSPANID += strUlcer1;
                                strPULCERHoverSPANID += "<br>&nbsp;&nbsp;";
                                strPULCERHoverSPANID += json_data10.PULCERREPLY.PATIENTS[intCounter].PUSTAGE1;
                            }

                            strUlcer2 = json_data10.PULCERREPLY.PATIENTS[intCounter].ULCER2;
                            //Verify if Pressure Ulcer # 2 exists.
                            if (trim(strUlcer2) != '') {
                                strPULCERHoverSPANID += "<br>"+i18n.PRES_ULCER_2;
                                strPULCERHoverSPANID += "<br>&nbsp;&nbsp;";
                                strPULCERHoverSPANID += strUlcer2;
                                strPULCERHoverSPANID += "<br>&nbsp;&nbsp;";
                                strPULCERHoverSPANID += json_data10.PULCERREPLY.PATIENTS[intCounter].PUSTAGE2;
                            }

                            strPULCERHoverSPANID += '</td></tr>';
                            strPULCERCircle = tempValue;
                            break;
                        default:
                            tempValue += "N/A";
                            strPULCERCircle = tempValue;
                            strPULCERHoverSPANID += '';
                            break;
                    }
                    //Build Hovers.
                    //Assessment
                    strAssessmentHoverSPANID += '</table>';
                    strAssessmentHoverText += '<span id="'
                    strAssessmentHoverText += strAssessmentHoverSPANID;
                    strAssessmentHoverText += '"';
                    strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                    strAssessmentHoverText += '">';
                    strAssessmentHoverText += strAssessmentCircle;
                    strAssessmentHoverText += '</span>';
                    //Interventions
                    strInterventionsHoverSPANID += '</table>';
                    strInterventionsHoverText += '<span id="'
                    strInterventionsHoverText += strInterventionsHoverSPANID;
                    strInterventionsHoverText += '"';
                    strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                    strInterventionsHoverText += '">';
                    strInterventionsHoverText += strInterventionsCircle;
                    strInterventionsHoverText += '</span>';
                    //PULCER
                    strPULCERHoverSPANID += '</table>';
                    strPULCERHoverText += '<span id="'
                    strPULCERHoverText += strPULCERHoverSPANID;
                    strPULCERHoverText += '"';
                    strPULCERHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strPULCERHoverText += "'gentooltip',this.id,0,0);";
                    strPULCERHoverText += '">';
                    strPULCERHoverText += strPULCERCircle;
                    strPULCERHoverText += '</span>';

                    //Build Cells.
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[puCell];
                        tempValueX.innerHTML = strAssessmentHoverText;
                    }
                    oPatData = AddToOPatData(strAssessmentHoverText,oPatData,'PressureUlcers',pressUlcrSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(puCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strInterventionsHoverText;
                    }
                    oPatData = AddToOPatData(strInterventionsHoverText,oPatData,'PressureUlcers',pressUlcrSbHdrDispArray[1]);
                    //Pressure Ulcer
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(puCell) + parseInt(2);
                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strPULCERHoverText;
                    }
                    oPatData = AddToOPatData(strPULCERHoverText,oPatData,'PressureUlcers',pressUlcrSbHdrDispArray[2]);
                }
                else {
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[puCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'PressureUlcers',pressUlcrSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(puCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'PressureUlcers',pressUlcrSbHdrDispArray[1]);
                    //Pressure Ulcer
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(puCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'PressureUlcers',pressUlcrSbHdrDispArray[2]);
                }
            }//oPatData check
        }
        blnPressUlcersDisplayed = true;
    }
    catch (error) {
        showErrorMessage(error.message, "fillPressureUlcers", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Gets the Pressure Ulcers JSON structure.
 */
function getPressureUlcers(){
    var qmReqObject = "";
    var blnLoadPressureUlcers = true;
    var cclParam = "";
    var strErrorMessage = "An error has occurred when getting data for Pressure Ulcers.";
    var strPressureUlcers = "";
    var intSectionIndicator = 0;
    var cclProg = "dc_mp_get_lh_pulcer";

    try {
        if (requestAsync) {
            //A request is in progress, so don't make another one.
        }
        else {
            //Display Load Text.
            displayLoadText("pulcer");

            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1) {
                intSectionIndicator = json_data2.PTREPLY.PULCERIND;
                //Verify the indicator.
                //0 = The JSON object is NOT complete.
                //1 = The JSON object is complete.
                if (intSectionIndicator == 1) {
                    //Load responses text into object.
                    strPressureUlcers = json_data2.PTREPLY.PULCERJSON;
                    json_data10 = JSON.parse(strPressureUlcers);
                }
                //Load Pressure Ulcers JSON.
                blnPressureUlcersCalled = true;
                blnPressureUlcers = expandCollapsePressureUlcers();
                //Hide Load Text.
                setTimeout("hideLoadText()",hideLoadTextDelay);
                //This flag is used in the function getExpandedTimer.
                intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
            }
            else {
                //Build JSON String.
                qmReqObject += '{"QMREQ":{"PRSNLID":';
                qmReqObject += userPersonID;
                qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
                qmReqObject += devLocation;
                qmReqObject += ',"APPID":';
                qmReqObject += applicationID;
                qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":';
                qmReqObject += selectedID;
                qmReqObject += ',"PTLISTTYPE":';
                qmReqObject += ptListType;
                qmReqObject += ',"PTLISTLOCCD":';
                qmReqObject += ptListLoccd;
                qmReqObject += ',"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
                qmReqObject += ',"LIST":['
                qmReqObject += strPatientDemog;
                qmReqObject += ']}}';

                //Build the parameters for getting the Patients.
                cclParam = "'MINE'" + ",'" + qmReqObject + "'";

                requestAsync = getXMLCclRequest();
                requestAsync.onreadystatechange = function(){
                    if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                        if (requestAsync.responseText > " ") {
                            try {
                                //Load responses text into object.
                                json_data10 = JSON.parse(requestAsync.responseText);
                            }
                            catch (error) {
                                //Hide Load Text.
                                setTimeout("hideLoadText()",hideLoadTextDelay);
                                showErrorMessage(error.message, "getPressureUlcers", requestAsync.status, cclParam);
                                return false;
                            }
                            //Load Pressure Ulcers JSON.
                            blnPressureUlcersCalled = true;
                            blnPressureUlcers = expandCollapsePressureUlcers();
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //This flag is used in the function getExpandedTimer.
                            intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
                        }
                        requestAsync = null;
                    }
                    else
                        if (requestAsync.readyState == 4 && requestAsync.readyState != 200) {
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //Set Error Message.
                            showErrorMessage(strErrorMessage, "getPressureUlcers", requestAsync.status, cclParam);
                            return false;
                        }
                };
                //Sends the request to the CCL server.
                if (location.protocol.substr(0, 4) == "http") {
                    var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
                    requestAsync.open("POST", url);
                    requestAsync.send(cclParam);
                }
                else {
                    requestAsync.open("POST", cclProg);
                    requestAsync.send(cclParam);
                }
            }
        }
    }
    catch (error) {
        //Hide Load Text.
        setTimeout("hideLoadText()",hideLoadTextDelay);
        showErrorMessage(error.message, "getPressureUlcers", "", cclParam);
    }
}

/**
 * Expands or collapses the section CRI. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function expandCollapseCRI(){
    var intHiddenValue = 0;
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0; //015
    var content = "";
    var tempTotalValue = 0;
    var blnStatus = true;
    var intCurrentTableWidth = 0;
    var columnNumber = 0;
    var intSubtractWidth = 0;
    var tempTotalHiddenRows = 0;
    var table = "";
    var intCounter = 0;
    var rowsPageOne = 0;
    var rowsToBuild = 0;

    try {

        if (currentPage == pageCNT && !bExpLastPage)
        {
            displayPreviousPage();
            bExpLastPage = true;
            //return blnStatus;
        }
        //Verify if the CRI JSON structure has been built.
        //True = has already been called.
        //False = has not been called.
        if (blnCRICalled == false) {
            //Change Hidden Value.
            hiddenCRIExpandCollapse = 1;
            getCRI();
        }
        else {
            //Calculate how many rows we are going to hide and add 1 extra to inlcude the last row.
            tempTotalValue = parseInt(PgRecTotal) + parseInt(1);
            //Get hidden value.
            intHiddenValue = hiddenCRIExpandCollapse;
            //Get name of table.
            table = document.getElementById("hdrtable2");

            //0 = make the section collapsed.
            //1 = make the section expanded.
            if (intHiddenValue == 0) {
                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Change Hidden Value.
                hiddenCRIExpandCollapse = 1;

                //Change size of Table 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120)) + hdrtableWdthAdj;
                intCurrentTableWidth = parseInt(intCurrentTableWidth) - parseInt(intSubtractWidth) + parseInt(40);

                document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth);
                document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth);

                //Main Header
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[criDisplayIndicator].colSpan = 1;
                document.getElementById('secpatlisthdrCRI').style.width = "40px";
                document.getElementById('secpatlisthdrCRI').className = "tabhdrs2g";
                document.getElementById('secpatlisthdrCRI').innerHTML = '<div id="divCRItext" title="'+i18n.condDisp.EXP_CRI_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">+</div>';

                //Sub Headers
                //Assessment
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[1].cells;
                tempValue[criCell].colSpan = "1";
                document.getElementById('secsubcolCRI1').style.width = "40px";
                document.getElementById('secsubcolCRI1').className = "tabhdrs2g";
                document.getElementById('secsubcolCRI1').style.display = "";
                document.getElementById('secsubcolCRI1').innerHTML = "";
                //Line Days
                content = "";
                tempValue = "";
                tempValue = "secsubcolCRI2";
                content = document.getElementById(tempValue);
                content.style.display = "none";
                content.innerHTML = "";
                //Signs & Symptoms of Infection
                content = "";
                tempValue = "";
                tempValue = "secsubcolCRI3";
                content = document.getElementById(tempValue);
                content.style.display = "none";
                content.innerHTML = "";

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        table.rows[intCounter].cells[criCell].style.width = "40px";
                        table.rows[intCounter].cells[criCell].className = "tabhdrsVertical";
                        table.rows[intCounter].cells[criCell].style.display = "";
                        table.rows[intCounter].cells[criCell].innerHTML = "CRI";
                    }
                    else {
                        //Assessment
                        table.rows[intCounter].cells[criCell].style.width = "0px";
                        table.rows[intCounter].cells[criCell].style.display = "none";
                        table.rows[intCounter].cells[criCell].innerHTML = "";
                    }
                    //Line Days
                    tempValue = "";
                    tempValue += "patientInterventionCRI";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";
                    //Signs & Symptoms of Infection
                    tempValue = "";
                    tempValue += "patientFallsCRI";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";

                    //Add 2 to the counter.
                    intCounter = intCounter + 2;
                }
                //Add the rowspan.
                table.rows[0].cells[criCell].rowSpan = rowSpanCounter;
            }
            else {
                displayLoadText("cri");
                //Change Hidden Value.
                hiddenCRIExpandCollapse = 0;

                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Calculate size of Tables 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120));
                intCurrentTableWidth = parseInt(intCurrentTableWidth) + parseInt(intSubtractWidth) - parseInt(40);

                //Reset global variables.
                hdrTableWidth = intCurrentTableWidth;
                hdrTable2Width = intCurrentTableWidth;

                //Set size of Tables 1 and 2.
                document.getElementById("hdrtable").width = parseInt(hdrTableWidth) + hdrtableWdthAdj;
                document.getElementById("hdrtable2").width = parseInt(hdrTable2Width) + hdrtableWdthAdj;

                //Main Header.
                tempValue = "";
                tempValue = "secpatlisthdrCRI";
                document.getElementById(tempValue).style.width = "360px";
                document.getElementById(tempValue).className = "tabhdrs";
                document.getElementById(tempValue).style.display = "";
                document.getElementById(tempValue).innerHTML = '<div id="divCRItext" title="'+i18n.condDisp.COLLAPSE_CRI_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapseCRI();">- CRI</div>';

                //Change colspan and rowspan
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[criDisplayIndicator].colSpan = 3;
                table.rows[0].cells[criCell].rowSpan = 1;
                table.rows[0].cells[criCell].className = "demcell";
                table.rows[0].cells[criCell].style.display = "";
                table.rows[0].cells[criCell].innerHTML = "";

                //Sub Headers
                //Assessment
                document.getElementById('secsubcolCRI1').style.width = "120px";
                document.getElementById('secsubcolCRI1').className = "subhdrs";
                document.getElementById('secsubcolCRI1').style.display = "";

                document.getElementById('secsubcolCRI1').innerHTML = i18n.INDICATIONS+" <br>Central IV/UR Cath";  //018
                //Line Days
                document.getElementById('secsubcolCRI2').style.width = "120px";
                document.getElementById('secsubcolCRI2').className = "subhdrs";
                document.getElementById('secsubcolCRI2').style.display = "";
                document.getElementById('secsubcolCRI2').innerHTML = "Line Days";
                //Signs & Symptoms of Infection
                document.getElementById('secsubcolCRI3').style.width = "120px";
                document.getElementById('secsubcolCRI3').className = "subhdrs";
                document.getElementById('secsubcolCRI3').style.display = "";
                document.getElementById('secsubcolCRI3').innerHTML = i18n.SIGNS_SYMPTOMS_INFECTION;

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellCRIRowSpan";
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellCRIRowSpan" + i;
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue += "patientInterventionCRI";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                    //Signs & Symptoms of Infection
                    tempValue = "";
                    tempValue += "patientFallsCRI";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    //document.getElementById(tempValue).style.width = "128px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                }
                //Verify if this is the first time the section is called.
                if (blnFirstTimeCRI == true) {
                    //Change flag.
                    blnFirstTimeCRI = false;
                }
                //Verify which value the patient indicator has.
                //0 = Both qualifying and non qualifying patients.
                //1 = Only qualifying patients.
                if (strPtQualind == 1) {
                    //Get values for the section.
                    blnStatus = fillCRIQualifying();
                }
                else {
                    //Get values for the section.
                    blnStatus = fillNonNhiqmSection('CRI',json_data11.CRIREPLY);
                }
            }
        }
        if (bExpLastPage)
        {
            displayNextPage();
            bExpLastPage = false;
        }
    }
    catch (error) {
        showErrorMessage(error.message, "expandCollapseCRI", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section CRI with only qualifying values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillCRIQualifying(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strAssessmentHoverText = "";
    var strAssessmentCVHoverText = "";   //018
    var strAssessmentUCHoverText = "";   //018
    var strAssessmentHoverSPANID = "";
    var strAssessmentCVHoverSPANID = "";  //018
    var strAssessmentUCHoverSPANID = "";  //018
    var strLineDaysHoverText = "";
    var strLineDaysHoverSPANID = "";
    var strCRIHoverText = "";
    var strCRIHoverSPANID = "";
    var strLineDaysAlarmClock = "";
    var strAssessmentCircle = "";
    var strAssessmentCVCircle = "";  //018
    var strAssessmentUCCircle = "";  //018
    var strLineDaysCircle = "";
    var strCRICircle = "";
    var intAssessmentCircle = 0;
    var intAssessmentCVCircle = 0;  //018
    var intAssessmentUCCircle = 0;  //018
    var intLineDaysCircle = 0;
    var intCRICircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var tempDate = new Date();
    var curDate = new Date();
    var timeDiff;
    var tempPageNum = 0;
    var strPtQualEncounterID = 0;
    var strPtQualPatientID = 0;
    var intSectionIndicator = 0;
    var nUniqueRowId = 0;

    try {
        //Get Indicator.
        intSectionIndicator = json_data2.PTREPLY.CRIIND;

        //Verify the indicator.
        //0 = The JSON object is NOT complete.
        //1 = The JSON object is complete.
        if (intSectionIndicator == 0) {
            for (var i=0;j=patData.length,i<j; i++)
            {
                var oPatData = patData[i];

                nUniqueRowId++;

                //Reset variables.
                tempString = "";
                tempString += 'patEncounter';
                tempString += nUniqueRowId;

                //Assessment
                oPatData = PopulateSection('CRI',"N/A",tempString,oPatData,criSbHdrDispArray[0]);

                //LineDays
                oPatData = PopulateSection('CRI',"N/A",tempString,oPatData,criSbHdrDispArray[1]);

                //CRI
                oPatData = PopulateSection('CRI',"N/A",tempString,oPatData,criSbHdrDispArray[2]);
            }
        }
        else {
            nUniqueRowId = 0;
            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < json_data11.CRIREPLY.PATIENTS.length; intCounter++) {
                //Reset variables.
                patientEncounterID = 0;
                ptQual = 0;
                tempValueX = "";
                tempValueY = "";
                tempString = "";
                strAssessmentHoverText = "";
                strAssessmentCVHoverText = "";  //018
                strAssessmentUCHoverText = "";  //018
                strAssessmentHoverSPANID = "";
                strAssessmentCVHoverSPANID = "";  //018
                strAssessmentUCHoverSPANID = "";  //018
                strLineDaysHoverText = "";
                strLineDaysHoverSPANID = "";
                strCRIHoverText = "";
                strCRIHoverSPANID = "";
                patientName = "";
                patientID = "";
                strAssessmentCircle = "";
                strAssessmentCVCircle = "";  //018
                strAssessmentUCCircle = "";  //018
                strLineDaysCircle = "";
                strCRICircle = "";
                intAssessmentCircle = 0;
                intAssessmentCVCircle = 0;  //018
                intAssessmentUCCircle = 0;  //018
                intLineDaysCircle = 0;
                intCRICircle = 0;

                patientEncounterID = json_data11.CRIREPLY.PATIENTS[intCounter].ENCNTR_ID;
                patientID = json_data11.CRIREPLY.PATIENTS[intCounter].PT_ID;

                var oPatData = null;
                var objIdx = getPatObjIdxByEnctr(patientEncounterID);

                if (objIdx != null)
                {
                    oPatData = patData[objIdx];

                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                    ptQual = json_data11.CRIREPLY.PATIENTS[intCounter].PTQUALIND;
                    patientName = json_data11.CRIREPLY.PATIENTS[intCounter].NAME;

                    //Verify if the patient name consist of " or ' characters.
                    //^^ = "
                    //^ = '
                    if (patientName.indexOf("^^") > -1) {
                        patientName = patientName.replace("^^", "&#34;");
                    }
                    if (patientName.indexOf("^") > -1) {
                        patientName = patientName.replace("^", "&#39;");
                    }

                    //Verify if PTQUAL is greater than 0.
                    if (ptQual > 0) {
                        intAssessmentCVCircle = json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].STATUS  //018
                        intAssessmentUCCircle = json_data11.CRIREPLY.PATIENTS[intCounter].CRI[1].STATUS  //018
                        intLineDaysCircle = json_data11.CRIREPLY.PATIENTS[intCounter].CRI[2].STATUS;     //018
                        intCRICircle = json_data11.CRIREPLY.PATIENTS[intCounter].CRI[3].STATUS;          //018
                        //Verify which icon that is going to be displayed in the column.
                        //0 = Not Done
                        //1 = Not Met
                        //2 = Met
                        //Assessment
                        //Reset variable.
                        tempValue = "";

                        //Build Hovers and Icons.

                        strAssessmentCVHoverSPANID += '<table>';  //018
                        strAssessmentUCHoverSPANID += '<table>';  //018
                        strLineDaysHoverSPANID += '<table>';
                        strCRIHoverSPANID += '<table>';
//018 switch statement redone specifically for Central IV
                        switch (intAssessmentCVCircle) {
                            case 1:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";

                                strAssessmentCVCircle = tempValue;
                                strAssessmentCVHoverSPANID += '<tr><td>'+i18n.LINE_ASSESSMENT+' ';
                                for (var e = 0; e < json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].EVENTS.length; e++) {
                                    strAssessmentCVHoverSPANID += "<br>";
                                    strAssessmentCVHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].EVENTS[e].EVENT_DISP;
                                    strAssessmentCVHoverSPANID += "<br>"
                                    strAssessmentCVHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].EVENTS[e].EVENT_RESULT;
                                    strAssessmentCVHoverSPANID += "<br>";
                                }
                                strAssessmentCVHoverSPANID += '</td></tr>';
                                break;
                            case 2:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                strAssessmentCVCircle = tempValue;
                                strAssessmentCVHoverSPANID += '<tr><td>'+i18n.LINE_ASSESSMENT;
                                for (var e = 0; e < json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].EVENTS.length; e++) {
                                    strAssessmentCVHoverSPANID += "<br>";
                                    strAssessmentCVHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].EVENTS[e].EVENT_DISP;
                                    strAssessmentCVHoverSPANID += "<br>"
                                    strAssessmentCVHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].EVENTS[e].EVENT_RESULT;
                                    strAssessmentCVHoverSPANID += "<br>";
                                }
                                strAssessmentCVHoverSPANID += '</td></tr>';
                                break;
                            case 3:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3927;
                                tempValue += "' />";

                                strAssessmentCVCircle = tempValue;
                                strAssessmentCVHoverSPANID += '<tr><td>'+i18n.LINE_ASSESSMENT;
                                for (var e = 0; e < json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].EVENTS.length; e++) {
                                    strAssessmentCVHoverSPANID += "<br>";
                                    strAssessmentCVHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].EVENTS[e].EVENT_DISP;
                                    strAssessmentCVHoverSPANID += "<br>"
                                    strAssessmentCVHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[0].EVENTS[e].EVENT_RESULT;
                                    strAssessmentCVHoverSPANID += "<br>";
                                }
                                strAssessmentCVHoverSPANID += '</td></tr>';
                                break;
                            default:
                                tempValue += "N/A";
                                strAssessmentCVCircle = tempValue;
                                strAssessmentCVHoverSPANID += '';

                                break;
                        }
                        tempValue = "";
//018 switch statement redone specifically for Urinary Cath
                        switch (intAssessmentUCCircle) {
                            case 1:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";

                                strAssessmentUCCircle = tempValue;
                                strAssessmentUCHoverSPANID += '<tr><td>'+i18n.CATH_ASSESSMENT;
                                for (var e = 0; e < json_data11.CRIREPLY.PATIENTS[intCounter].CRI[1].EVENTS.length; e++) {
                                    strAssessmentUCHoverSPANID += "<br>";
                                    strAssessmentUCHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[1].EVENTS[e].EVENT_DISP;
                                    strAssessmentUCHoverSPANID += "<br>"
                                    strAssessmentUCHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[1].EVENTS[e].EVENT_RESULT;
                                    strAssessmentUCHoverSPANID += "<br>";
                                }
                                strAssessmentUCHoverSPANID += '</td></tr>';
                                break;
                            case 2:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strAssessmentUCCircle = tempValue;
                                strAssessmentUCHoverSPANID += '<tr><td>'+i18n.CATH_ASSESSMENT;
                                for (var e = 0; e < json_data11.CRIREPLY.PATIENTS[intCounter].CRI[1].EVENTS.length; e++) {
                                    strAssessmentUCHoverSPANID += "<br>";
                                    strAssessmentUCHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[1].EVENTS[e].EVENT_DISP;
                                    strAssessmentUCHoverSPANID += "<br>"
                                    strAssessmentUCHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[1].EVENTS[e].EVENT_RESULT;
                                    strAssessmentUCHoverSPANID += "<br>";
                                }
                                strAssessmentUCHoverSPANID += '</td></tr>';
                                break;
                            default:
                                tempValue += "N/A";
                                strAssessmentUCCircle = tempValue;
                                strAssessmentUCHoverSPANID += '';
                                break;
                        }
                        //Line Days
                        tempValue = "";
                        switch (intLineDaysCircle) {
                            case 1:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                //Filled Circle
                                strLineDaysHoverSPANID += '<tr><td>'+i18n.LINE_DAYS+'</td></tr>';
                                strLineDaysHoverSPANID += '<tr><td>';
                                for (var e = 0; e < json_data11.CRIREPLY.PATIENTS[intCounter].CRI[2].EVENTS.length; e++) {
                                    strLineDaysHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[2].EVENTS[e].EVENT_DISP;
                                    strLineDaysHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[2].EVENTS[e].EVENT_RESULT;
                                    strLineDaysHoverSPANID += "<br>@";
                                    strLineDaysHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[2].EVENTS[e].EVENTDTDISP;
                                    convertdate(json_data11.CRIREPLY.PATIENTS[intCounter].CRI[2].EVENTS[e].EVENTDTDISP, tempDate)
                                    timeDiff = curDate.getTime() - tempDate.getTime();
                                    if (timeDiff / (1000 * 60 * 60) < 24) {
                                        strLineDaysHoverSPANID += " @" + (Math.round(timeDiff / (1000 * 60 * 60) * 10) / 10) + " Hours";
                                    }
                                    else {
                                        strLineDaysHoverSPANID += " @" + (Math.round(timeDiff / (1000 * 60 * 60 * 24) * 10) / 10) + " Days";
                                    }
                                    strLineDaysHoverSPANID += "<br>";
                                }
                                strLineDaysHoverSPANID += '</td></tr>';

                                strLineDaysCircle = tempValue;
                                break;
                            default:
                                tempValue += "N/A";
                                strLineDaysCircle = tempValue;
                                strLineDaysHoverSPANID += '';
                                break;
                        }
                        // SIGNS & SYMPTOMS OF INFECTION
                        tempValue = "";
                        switch (intCRICircle) {
                            case 1:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img6047_16;
                                tempValue += "' />";

                                strCRIHoverSPANID += '<tr><td>';
                                for (var e = 0; e < json_data11.CRIREPLY.PATIENTS[intCounter].CRI[3].EVENTS.length; e++) {
                                    strCRIHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[3].EVENTS[e].EVENT_DISP;
                                    strCRIHoverSPANID += "<br>"
                                    strCRIHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[3].EVENTS[e].EVENT_RESULT;
                                    strCRIHoverSPANID += "<br>"
                                    strCRIHoverSPANID += json_data11.CRIREPLY.PATIENTS[intCounter].CRI[3].EVENTS[e].EVENTDTDISP;
                                    strCRIHoverSPANID += "<br>";
                                }
                                strCRIHoverSPANID += '</td></tr>';
                                //Half Filled Circle
                                strCRICircle = tempValue;
                                break;
                            default:
                                tempValue += "N/A";
                                strCRICircle = tempValue;
                                strCRIHoverSPANID += '';
                                break;
                        }
                        //Build Hovers.
                        //Assessment
                        strAssessmentCVHoverSPANID += '</table>';
                        strAssessmentCVHoverText += '<span id="'
                        strAssessmentCVHoverText += strAssessmentCVHoverSPANID;
                        strAssessmentCVHoverText += '"';
                        strAssessmentCVHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strAssessmentCVHoverText += "'gentooltip',this.id,0,0);";
                        strAssessmentCVHoverText += '">';
                        strAssessmentCVHoverText += strAssessmentCVCircle;
                        strAssessmentCVHoverText += '</span>';

                        strAssessmentUCHoverSPANID += '</table>';
                        strAssessmentUCHoverText += '<span id="'
                        strAssessmentUCHoverText += strAssessmentUCHoverSPANID;
                        strAssessmentUCHoverText += '"';
                        strAssessmentUCHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strAssessmentUCHoverText += "'gentooltip',this.id,0,0);";
                        strAssessmentUCHoverText += '">';
                        strAssessmentUCHoverText += strAssessmentUCCircle;
                        strAssessmentUCHoverText += '</span>';
//018 load both CV and UC into the Assessment Hover below
                        strAssessmentHoverText =  strAssessmentCVHoverText + '&nbsp &nbsp' + strAssessmentUCHoverText;
                        //LineDays
                        strLineDaysHoverSPANID += '</table>';
                        strLineDaysHoverText += '<span id="'
                        strLineDaysHoverText += strLineDaysHoverSPANID;
                        strLineDaysHoverText += '"';
                        strLineDaysHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strLineDaysHoverText += "'gentooltip',this.id,0,0);";
                        strLineDaysHoverText += '">';
                        strLineDaysHoverText += strLineDaysCircle;
                        strLineDaysHoverText += '</span>';
                        //CRI
                        strCRIHoverSPANID += '</table>';
                        strCRIHoverText += '<span id="'
                        strCRIHoverText += strCRIHoverSPANID;
                        strCRIHoverText += '"';
                        strCRIHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strCRIHoverText += "'gentooltip',this.id,0,0);";
                        strCRIHoverText += '">';
                        strCRIHoverText += strCRICircle;
                        strCRIHoverText += '</span>';

                        //Reset variables.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Assessment
                        oPatData = PopulateSection('CRI',strAssessmentHoverText,tempString,oPatData,criSbHdrDispArray[0]);

                        //Line Days
                        oPatData = PopulateSection('CRI',strLineDaysHoverText,tempString,oPatData,criSbHdrDispArray[1]);

                        //CRI
                        oPatData = PopulateSection('CRI',strCRIHoverText,tempString,oPatData,criSbHdrDispArray[2]);
                    }
                    else {

                        //Reset variables.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Assessment
                        oPatData = PopulateSection('CRI',"N/A",tempString,oPatData,criSbHdrDispArray[0]);

                        //LineDays
                        oPatData = PopulateSection('CRI',"N/A",tempString,oPatData,criSbHdrDispArray[1]);

                        //CRI
                        oPatData = PopulateSection('CRI',"N/A",tempString,oPatData,criSbHdrDispArray[2]);
                    }
                }//oPatData check
            }
        } //intSectionIndicator

        SortPatData(lastSortField);
    }
    catch (error) {
        showErrorMessage(error.message, "fillCRIQualifying", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section CRI with values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillNonNhiqmSection(strSectionName, objJson){
    var blnStatus = true;
    var tempValueX = "";
    var tempValueY = "";
    var tempString = "";
    var tempValue = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strAssessmentHoverText = "";
    var strAssessmentCVHoverText = "";   //018
    var strAssessmentUCHoverText = "";   //018
    var strAssessmentHoverSPANID = "";
    var strAssessmentCVHoverSPANID = "";  //018
    var strAssessmentUCHoverSPANID = "";  //018
    var strLineDaysHoverText = "";
    var strLineDaysHoverSPANID = "";
    var strCRIHoverText = "";
    var strCRIHoverSPANID = "";
    var strLineDaysAlarmClock = "";
    var strAssessmentCircle = "";
    var strAssessmentCVCircle = "";  //018
    var strAssessmentUCCircle = "";  //018
    var strLineDaysCircle = "";
    var strCRICircle = "";
    var intAssessmentCircle = 0;
    var intAssessmentCVCircle = 0;  //018
    var intAssessmentUCCircle = 0;  //018
    var intLineDaysCircle = 0;
    var intCRICircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var tempDate = new Date();
    var curDate = new Date();
    var timeDiff;
    var nUniqueRowId = 0;
    var oSecObj;

    try {
        if (blnCRIDisplayed)
        {
            displayLoadText("cri");
            PopulatePatientInfo();
            return;
        }
        //Loop through the JSON structure.
        for (var intCounter = 0; intCounter < objJson.PATIENTS.length; intCounter++)
        {
            //Reset variables.
            patientEncounterID = 0;
            ptQual = 0;
            tempValueX = "";
            tempValueY = "";
            tempString = "";
            strAssessmentHoverText = "";
            strAssessmentCVHoverText = "";  //018
            strAssessmentUCHoverText = "";  //018
            strAssessmentHoverSPANID = "";
            strAssessmentCVHoverSPANID = "";  //018
            strAssessmentUCHoverSPANID = "";  //018
            strLineDaysHoverText = "";
            strLineDaysHoverSPANID = "";
            strCRIHoverText = "";
            strCRIHoverSPANID = "";
            patientName = "";
            patientID = "";
            strAssessmentCircle = "";
            strAssessmentCVCircle = "";  //018
            strAssessmentUCCircle = "";  //018
            strLineDaysCircle = "";
            strCRICircle = "";
            intAssessmentCircle = 0;
            intAssessmentCVCircle = 0;  //018
            intAssessmentUCCircle = 0;  //018
            intLineDaysCircle = 0;
            intCRICircle = 0;

            patientEncounterID = objJson.PATIENTS[intCounter].ENCNTR_ID;
            ptQual = objJson.PATIENTS[intCounter].PTQUALIND;
            patientName = objJson.PATIENTS[intCounter].NAME;
            patientID = objJson.PATIENTS[intCounter].PT_ID;

            var oPatData = null;
            var objIdx = getPatObjIdxByEnctr(patientEncounterID);

            if (objIdx != null)
            {
                oPatData = patData[objIdx];

                if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                        {nUniqueRowId++;}

                var oSecObj = new Object();
                //oSecObj.intEDColumn = intEDColumn;
                oSecObj.strSectionName = strSectionName;
                oSecObj.secColumns = 2;
                secObjAr.push(oSecObj);


                //Verify if the patient name consist of " or ' characters.
                //^^ = "
                //^ = '
                if (patientName.indexOf("^^") > -1) {
                    patientName = patientName.replace("^^", "&#34;");
                }
                if (patientName.indexOf("^") > -1) {
                    patientName = patientName.replace("^", "&#39;");
                }
                switch(strSectionName)
                {
                    case 'CRI':
                        var oSecObj = objJson.PATIENTS[intCounter].CRI;
                        break;
                    case 'Falls':
                        var oSecObj = objJson.PATIENTS[intCounter].FALLS;
                        break;
                }
                //Verify if PTQUAL is greater than 0.
                if (ptQual > 0) {
//018 changed index of the oSecObj
                    intAssessmentCVCircle = oSecObj[0].STATUS
                    intAssessmentUCCircle = oSecObj[1].STATUS
                    intLineDaysCircle = oSecObj[2].STATUS;
                    intCRICircle = oSecObj[3].STATUS;

                    //Verify which icon that is going to be displayed in the column.
                    //0 = Not Done
                    //1 = Not Met
                    //2 = Met
                    //Assessment
                    //Reset variable.
                    tempValue = "";

                    //Build Hovers and Icons.
                    strAssessmentCVHoverSPANID += '<table>';
                    strAssessmentUCHoverSPANID += '<table>';
                    strLineDaysHoverSPANID += '<table>';
                    strCRIHoverSPANID += '<table>';
//018 switch statement redone specifically for Central IV
                    switch (intAssessmentCVCircle) {
                        case 1:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";

                            strAssessmentCVCircle = tempValue;
                            strAssessmentCVHoverSPANID += '<tr><td>'+i18n.LINE_ASSESSMENT;

                            for (var e = 0; e < oSecObj[0].EVENTS.length; e++) {
                                strAssessmentCVHoverSPANID += "<br>";
                                strAssessmentCVHoverSPANID += oSecObj[0].EVENTS[e].EVENT_DISP;
                                strAssessmentCVHoverSPANID += "<br>"
                                strAssessmentCVHoverSPANID += oSecObj[0].EVENTS[e].EVENT_RESULT;
                                strAssessmentCVHoverSPANID += "<br>";
                            }
                            strAssessmentCVHoverSPANID += '</td></tr>';
                            break;
                        case 2:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            strAssessmentCVCircle = tempValue;
                            strAssessmentCVHoverSPANID += '<tr><td>'+i18n.LINE_ASSESSMENT;
                            for (var e = 0; e < oSecObj[0].EVENTS.length; e++) {
                                strAssessmentCVHoverSPANID += "<br>";
                                strAssessmentCVHoverSPANID += oSecObj[0].EVENTS[e].EVENT_DISP;
                                strAssessmentCVHoverSPANID += "<br>"
                                strAssessmentCVHoverSPANID += oSecObj[0].EVENTS[e].EVENT_RESULT;
                                strAssessmentCVHoverSPANID += "<br>";
                            }
                            strAssessmentCVHoverSPANID += '</td></tr>';
                            break;
                        case 3:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3927;
                            tempValue += "' />";

                            strAssessmentCVCircle = tempValue;
                            strAssessmentCVHoverSPANID += '<tr><td>'+i18n.LINE_ASSESSMENT;
                            for (var e = 0; e < oSecObj[0].EVENTS.length; e++) {
                                strAssessmentCVHoverSPANID += "<br>";
                                strAssessmentCVHoverSPANID += oSecObj[0].EVENTS[e].EVENT_DISP;
                                strAssessmentCVHoverSPANID += "<br>"
                                strAssessmentCVHoverSPANID += oSecObj[0].EVENTS[e].EVENT_RESULT;
                                strAssessmentCVHoverSPANID += "<br>";
                            }
                            strAssessmentCVHoverSPANID += '</td></tr>';
                            break;
                        default:
                            tempValue += "N/A";
                            strAssessmentCVCircle = tempValue;
                            strAssessmentCVHoverSPANID += '';
                            break;
                    }
                    tempValue = "";
//018 switch statement below redone specifically for Urinary Cath
                    switch (intAssessmentUCCircle) {
                        case 1:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";

                            strAssessmentUCCircle = tempValue;
                            strAssessmentUCHoverSPANID += '<tr><td>'+i18n.CATH_ASSESSMENT;
                            for (var e = 0; e < oSecObj[1].EVENTS.length; e++) {
                                strAssessmentUCHoverSPANID += "<br>";
                                strAssessmentUCHoverSPANID += oSecObj[1].EVENTS[e].EVENT_DISP;
                                strAssessmentUCHoverSPANID += "<br>"
                                strAssessmentUCHoverSPANID += oSecObj[1].EVENTS[e].EVENT_RESULT;
                                strAssessmentUCHoverSPANID += "<br>";
                            }
                            strAssessmentUCHoverSPANID += '</td></tr>';
                            break;
                        case 2:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            strAssessmentUCCircle = tempValue;
                            strAssessmentUCHoverSPANID += '<tr><td>'+i18n.CATH_ASSESSMENT;
                            for (var e = 0; e < oSecObj[1].EVENTS.length; e++) {
                                strAssessmentUCHoverSPANID += "<br>";
                                strAssessmentUCHoverSPANID += oSecObj[1].EVENTS[e].EVENT_DISP;
                                strAssessmentUCHoverSPANID += "<br>"
                                strAssessmentUCHoverSPANID += oSecObj[1].EVENTS[e].EVENT_RESULT;
                                strAssessmentUCHoverSPANID += "<br>";
                            }

                            strAssessmentUCHoverSPANID += '</td></tr>';
                            break;
                        default:
                            tempValue += "N/A";
                            strAssessmentUCCircle = tempValue;
                            strAssessmentUCHoverSPANID += '';
                            break;
                    }

                    //Line Days
                    tempValue = "";
                    switch (intLineDaysCircle) {
                        case 1:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            //Filled Circle
                            strLineDaysHoverSPANID += '<tr><td>'+i18n.LINE_DAYS+' </td></tr>';
                            strLineDaysHoverSPANID += '<tr><td>';
                            for (var e = 0; e < oSecObj[2].EVENTS.length; e++) {
                                strLineDaysHoverSPANID += oSecObj[2].EVENTS[e].EVENT_DISP;
                                strLineDaysHoverSPANID += oSecObj[2].EVENTS[e].EVENT_RESULT;
                                strLineDaysHoverSPANID += "<br>@";
                                strLineDaysHoverSPANID += oSecObj[2].EVENTS[e].EVENTDTDISP;
                                convertdate(oSecObj[2].EVENTS[e].EVENTDTDISP, tempDate)
                                timeDiff = curDate.getTime() - tempDate.getTime();
                                if (timeDiff / (1000 * 60 * 60) < 24) {
                                    strLineDaysHoverSPANID += " @" + (Math.round(timeDiff / (1000 * 60 * 60) * 10) / 10) + " Hours";
                                }
                                else {
                                    strLineDaysHoverSPANID += " @" + (Math.round(timeDiff / (1000 * 60 * 60 * 24) * 10) / 10) + " Days";
                                }
                                strLineDaysHoverSPANID += "<br>";
                            }
                            strLineDaysHoverSPANID += '</td></tr>';

                            strLineDaysCircle = tempValue;
                            break;
                        default:
                            tempValue += "N/A";
                            strLineDaysCircle = tempValue;
                            strLineDaysHoverSPANID += '';
                            break;
                    }
                    // SIGNS & SYMPTOMS OF INFECTION
                    tempValue = "";
                    switch (intCRICircle) {
                        case 1:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img6047_16;
                            tempValue += "' />";

                            strCRIHoverSPANID += '<tr><td>';
                            for (var e = 0; e < oSecObj[3].EVENTS.length; e++) {
                                strCRIHoverSPANID += oSecObj[3].EVENTS[e].EVENT_DISP;
                                strCRIHoverSPANID += "<br>"
                                strCRIHoverSPANID += oSecObj[3].EVENTS[e].EVENT_RESULT;
                                strCRIHoverSPANID += "<br>"
                                strCRIHoverSPANID += oSecObj[3].EVENTS[e].EVENTDTDISP;
                                strCRIHoverSPANID += "<br>";
                            }
                            strCRIHoverSPANID += '</td></tr>';
                            //Half Filled Circle
                            strCRICircle = tempValue;
                            break;
                        default:
                            tempValue += "N/A";
                            strCRICircle = tempValue;
                            strCRIHoverSPANID += '';
                            break;
                    }
                    //Build Hovers.
                    //Assessment
                    strAssessmentCVHoverSPANID += '</table>';
                    strAssessmentCVHoverText += '<span id="'
                    strAssessmentCVHoverText += strAssessmentCVHoverSPANID;
                    strAssessmentCVHoverText += '"';
                    strAssessmentCVHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strAssessmentCVHoverText += "'gentooltip',this.id,0,0);";
                    strAssessmentCVHoverText += '">';
                    strAssessmentCVHoverText += strAssessmentCVCircle;
                    strAssessmentCVHoverText += '</span>';

                    strAssessmentUCHoverSPANID += '</table>';
                    strAssessmentUCHoverText += '<span id="'
                    strAssessmentUCHoverText += strAssessmentUCHoverSPANID;
                    strAssessmentUCHoverText += '"';
                    strAssessmentUCHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strAssessmentUCHoverText += "'gentooltip',this.id,0,0);";
                    strAssessmentUCHoverText += '">';
                    strAssessmentUCHoverText += strAssessmentUCCircle;
                    strAssessmentUCHoverText += '</span>';

                    //LineDays
                    strLineDaysHoverSPANID += '</table>';
                    strLineDaysHoverText += '<span id="'
                    strLineDaysHoverText += strLineDaysHoverSPANID;
                    strLineDaysHoverText += '"';
                    strLineDaysHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strLineDaysHoverText += "'gentooltip',this.id,0,0);";
                    strLineDaysHoverText += '">';
                    strLineDaysHoverText += strLineDaysCircle;
                    strLineDaysHoverText += '</span>';
                    //CRI
                    strCRIHoverSPANID += '</table>';
                    strCRIHoverText += '<span id="'
                    strCRIHoverText += strCRIHoverSPANID;
                    strCRIHoverText += '"';
                    strCRIHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strCRIHoverText += "'gentooltip',this.id,0,0);";
                    strCRIHoverText += '">';
                    strCRIHoverText += strCRICircle;
                    strCRIHoverText += '</span>';

                    //Build Cells.
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;

                   strAssessmentHoverText =  strAssessmentCVHoverText + '&nbsp &nbsp' + strAssessmentUCHoverText;
                    if ((parseInt(oPatData.pageNum) == parseInt(currentPage)) && (parseInt(nUniqueRowId) <= rowTotal))
                    {
                        tempValueX = document.getElementById(tempString).cells[criCell];
                        tempValueX.innerHTML = strAssessmentHoverText;
                    }

                    oPatData = AddToOPatData(strAssessmentHoverText,oPatData,'CRI',criSbHdrDispArray[0]);

                    //Line Days
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(criCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;

                    if ((parseInt(oPatData.pageNum) == parseInt(currentPage)) && (parseInt(nUniqueRowId) <= rowTotal))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strLineDaysHoverText;
                    }
                    //convertdate

                    oPatData = AddToOPatData(strLineDaysHoverText,oPatData,'CRI',criSbHdrDispArray[1]);

                    //CRI
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(criCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if ((parseInt(oPatData.pageNum) == parseInt(currentPage)) && (parseInt(nUniqueRowId) <= rowTotal))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strCRIHoverText;
                    }

                    oPatData = AddToOPatData(strCRIHoverText,oPatData,'CRI',criSbHdrDispArray[2]);
                }
                else {

                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    //criCell = 24;

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;  //patientEncounterID;
                    if ((parseInt(oPatData.pageNum) == parseInt(currentPage)) && (parseInt(nUniqueRowId) <= rowTotal))
                    {
                        tempValueX = document.getElementById(tempString).cells[criCell];
                        tempValueX.innerHTML = "N/A" + '&nbsp &nbsp' + "N/A";
                    }

                    oPatData = AddToOPatData("N/A",oPatData,'CRI',criSbHdrDispArray[0]);

                    //LineDays
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(criCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if ((parseInt(oPatData.pageNum) == parseInt(currentPage)) && (parseInt(nUniqueRowId) <= rowTotal))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'CRI',criSbHdrDispArray[1]);

                    //CRI
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(criCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;  //patientEncounterID;
                    if ((parseInt(oPatData.pageNum) == parseInt(currentPage)) && (parseInt(nUniqueRowId) <= rowTotal))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'CRI',criSbHdrDispArray[2]);

                }
            }//oPatData check
        }
        blnCRIDisplayed = true;
    }
    catch (error) {
        showErrorMessage(error.message, "fillNonNhiqmSection", "", "oPatData.name = "+oPatData.name+"\n oPatData.pageNum = "+oPatData.pageNum+'\n ptQual = '+ptQual+"\n nUniqueRowId"+nUniqueRowId);
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Gets the CRI JSON structure.
 */
function getCRI()
{
    var qmReqObject = "";
    var blnLoadCRI = true;
    var cclParam = "";
    var strErrorMessage = "An error has occurred when getting data for CRI.";
    var strCRI = "";
    var intSectionIndicator = 0;
    var cclProg = "dc_mp_get_lh_cri";  //changed object name for testing


    try {
        if (requestAsync) {
            //A request is in progress, so don't make another one.
        }
        else {
            //Display Load Text.
            displayLoadText("cri");

            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1) {
                intSectionIndicator = json_data2.PTREPLY.CRIIND;
                //Verify the indicator.
                //0 = The JSON object is NOT complete.
                //1 = The JSON object is complete.
                if (intSectionIndicator == 1) {
                    //Load responses text into object.
                    strCRI = json_data2.PTREPLY.CRIJSON;
                    json_data11 = JSON.parse(strCRI);
                }
                //Load CRI JSON.
                blnCRICalled = true;
                blnLoadCRI = expandCollapseCRI();
                //Hide Load Text.
                setTimeout("hideLoadText()",hideLoadTextDelay);
                //This flag is used in the function getExpandedTimer.
                intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
            }
            else {
                //Build JSON String.
                qmReqObject += '{"QMREQ":{"PRSNLID":';
                qmReqObject += userPersonID;
                qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
                qmReqObject += devLocation;
                qmReqObject += ',"APPID":';
                qmReqObject += applicationID;
                qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":';
                qmReqObject += selectedID;
                qmReqObject += ',"PTLISTTYPE":';
                qmReqObject += ptListType;
                qmReqObject += ',"PTLISTLOCCD":';
                qmReqObject += ptListLoccd;
                qmReqObject += ',"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
                qmReqObject += ',"LIST":['
                qmReqObject += strPatientDemog;
                qmReqObject += ']}}';

                //Build the parameters for getting the Patients.
                cclParam = "'MINE'" + ",'" + qmReqObject + "'";

                requestAsync = getXMLCclRequest();
                requestAsync.onreadystatechange = function(){
                    if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                        if (requestAsync.responseText > " ") {
                            try {
                                //Load responses text into object.
                                json_data11 = JSON.parse(requestAsync.responseText);
                            }
                            catch (error) {
                                //Hide Load Text.
                                setTimeout("hideLoadText()",hideLoadTextDelay);
                                showErrorMessage(error.message, "getCRI", requestAsync.status, cclParam);
                                return false;
                            }
                            //Load CRI JSON.
                            blnCRICalled = true;
                            blnLoadCRI = expandCollapseCRI();
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //This flag is used in the function getExpandedTimer.
                            intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
                        }
                        requestAsync = null;
                    }
                    else
                        if (requestAsync.readyState == 4 && requestAsync.readyState != 200) {
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //Set Error Message.
                            showErrorMessage(strErrorMessage, "getCRI", requestAsync.status, cclParam);
                            return false;
                        }
                };
                //Sends the request to the CCL server.
                if (location.protocol.substr(0, 4) == "http") {
                    var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
                    requestAsync.open("POST", url);
                    requestAsync.send(cclParam);
                }
                else {
                    requestAsync.open("POST", cclProg);
                    requestAsync.send(cclParam);
                }
            }
        }
    }
    catch (error) {
        //Hide Load Text.
        setTimeout("hideLoadText()",hideLoadTextDelay);
        showErrorMessage(error.message, "getCRI", "", cclParam);
    }
}

/**
 * Expands or collapses the section Falls. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function expandCollapseFalls(){
    var intHiddenValue = 0;
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var content = "";
    var tempTotalValue = 0;
    var blnStatus = true;
    var tempTotalHiddenRows = 0;
    var table = "";
    var intCounter = 0;
    var rowsPageOne = 0;
    var rowsToBuild = 0;

    try {

        if (currentPage == pageCNT && !bExpLastPage)
        {
            displayPreviousPage();
            bExpLastPage = true;
            //return blnStatus;
        }
        //Verify if the Falls JSON structure has been built.
        //True = has already been called.
        //False = has not been called.
        if (blnFallsCalled == false) {
            //Change Hidden Value.
            hiddenFallsExpandCollapse = 1;
            getFalls();
        }
        else {

            //Calculate how many rows we are going to hide and add 1 extra to inlcude the last row.
            tempTotalValue = parseInt(PgRecTotal) + parseInt(1);
            //Get hidden value.
            intHiddenValue = hiddenFallsExpandCollapse;
            //Get name of table.
            table = document.getElementById("hdrtable2");

            //0 = make the section collapsed.
            //1 = make the section expanded.

            if (intHiddenValue == 0) {
                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Change Hidden Value.
                hiddenFallsExpandCollapse = 1;

                //Change size of Table 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120)) + hdrtableWdthAdj;
                intCurrentTableWidth = parseInt(intCurrentTableWidth) - parseInt(intSubtractWidth) + parseInt(40);

                document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth);
                document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth);

                //Main Header
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[fallsDisplayIndicator].colSpan = 1;
                document.getElementById('secpatlisthdrFalls').style.width = "40px";
                document.getElementById('secpatlisthdrFalls').className = "tabhdrs2g";
                document.getElementById('secpatlisthdrFalls').innerHTML = '<div id="divFallstext" title="'+i18n.condDisp.EXP_FALLS_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">+</div>';

                //Sub Headers
                //Assessment
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[1].cells;
                tempValue[fallCell].colSpan = "1";
                document.getElementById('secsubcolFalls1').style.width = "40px";
                document.getElementById('secsubcolFalls1').className = "tabhdrs2g";
                document.getElementById('secsubcolFalls1').style.display = "";
                document.getElementById('secsubcolFalls1').innerHTML = "";
                //Interventions
                content = "";
                tempValue = "";
                tempValue = "secsubcolFalls2";
                content = document.getElementById(tempValue);
                content.style.width = "0px";
                content.style.display = "none";
                content.innerHTML = "";
                //Falls
                content = "";
                tempValue = "";
                tempValue = "secsubcolFalls3";
                content = document.getElementById(tempValue);
                content.style.width = "0px";
                content.style.display = "none";
                content.innerHTML = "";

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        table.rows[intCounter].cells[fallCell].style.width = "40px";
                        table.rows[intCounter].cells[fallCell].className = "tabhdrsVertical";
                        table.rows[intCounter].cells[fallCell].style.display = "";
                        table.rows[intCounter].cells[fallCell].innerHTML = "Falls";
                    }
                    else {
                        //Assessment
                        table.rows[intCounter].cells[fallCell].style.width = "0px";
                        table.rows[intCounter].cells[fallCell].style.display = "none";
                        table.rows[intCounter].cells[fallCell].innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue = "patientInterventionFalls" + i;
                    document.getElementById(tempValue).style.width = "0px";
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";
                    //Falls
                    tempValue = "";
                    tempValue = "patientFallsFalls" + i;
                    document.getElementById(tempValue).style.width = "0px";
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";

                    //Add 2 to the counter.
                    intCounter = intCounter + 2;
                }
                //Add the rowspan.
                table.rows[0].cells[fallCell].rowSpan = rowSpanCounter;
            }
            else {
                displayLoadText("fall");
                //Change Hidden Value.
                hiddenFallsExpandCollapse = 0;

                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Calculate size of Tables 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120));
                intCurrentTableWidth = parseInt(intCurrentTableWidth) + parseInt(intSubtractWidth) - parseInt(40);

                //Reset variables.
                hdrTableWidth = intCurrentTableWidth;
                hdrTable2Width = intCurrentTableWidth;

                //Set size of Tables 1 and 2.
                document.getElementById("hdrtable").width = parseInt(hdrTableWidth) + hdrtableWdthAdj;
                document.getElementById("hdrtable2").width = parseInt(hdrTable2Width) + hdrtableWdthAdj;

                //Main Header.
                tempValue = "";
                tempValue = "secpatlisthdrFalls";
                document.getElementById(tempValue).style.width = "360px";
                document.getElementById(tempValue).className = "tabhdrs";
                document.getElementById(tempValue).style.display = "";
                document.getElementById(tempValue).innerHTML = '<div id="divFallstext" title="'+i18n.condDisp.COLLAPSE_FALLS_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapseFalls();">- '+i18n.condDisp.FALLS+'</div>';

                //Change colspan and rowspan
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[fallsDisplayIndicator].colSpan = 3;
                table.rows[0].cells[fallCell].rowSpan = 1;
                table.rows[0].cells[fallCell].className = "demcell";
                table.rows[0].cells[fallCell].style.display = "";
                table.rows[0].cells[fallCell].innerHTML = "";

                //Sub Headers
                //Assessment
                document.getElementById('secsubcolFalls1').style.width = "120px";
                document.getElementById('secsubcolFalls1').className = "subhdrs";
                document.getElementById('secsubcolFalls1').style.display = "";
                document.getElementById('secsubcolFalls1').innerHTML = i18n.ASSESSMENT;
                //Interventions
                document.getElementById('secsubcolFalls2').style.width = "120px";
                document.getElementById('secsubcolFalls2').className = "subhdrs";
                document.getElementById('secsubcolFalls2').style.display = "";
                document.getElementById('secsubcolFalls2').innerHTML = i18n.INTERVENTIONS + ":";
                //Falls
                document.getElementById('secsubcolFalls3').style.width = "120px";
                document.getElementById('secsubcolFalls3').className = "subhdrs";
                document.getElementById('secsubcolFalls3').style.display = "";
                document.getElementById('secsubcolFalls3').innerHTML = i18n.condDisp.FALLS;

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellFallsRowSpan";
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellFallsRowSpan" + i;
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue = "patientInterventionFalls" + i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                    //Falls
                    tempValue = "";
                    tempValue = "patientFallsFalls" + i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                }
                //Verify if this is the first time the section is called.
                if (blnFirstTimeFalls == true) {
                    //Change flag.
                    blnFirstTimeFalls = false;
                }

                //Verify which value the patient indicator has.
                //0 = Both qualifying and non qualifying patients.
                //1 = Only qualifying patients.
                if (strPtQualind == 1) {
                    //Get values for the section.
                    blnStatus = fillFallsQualifying();
                }
                else {
                    //Get values for the section.
                    //blnStatus = fillNonNhiqmSection('Falls', json_data12.FALLSREPLY);
                    blnStatus = fillFalls();
                }
            }
        }
        if (bExpLastPage)
        {
            displayNextPage();
            bExpLastPage = false;
        }
    }
    catch (error) {
        showErrorMessage(error.message, "expandCollapseFalls", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Falls with only qualifying values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillFallsQualifying(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strFallsHoverText = "";
    var strFallsHoverSPANID = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strFallsCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intFallsCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var tempPageNum = 0;
    var strPtQualEncounterID = 0;
    var strPtQualPatientID = 0;
    var intSectionIndicator = 0;
    var nUniqueRowId = 0;

    try {
        //Get Indicator.
        intSectionIndicator = json_data2.PTREPLY.FALLSIND;
        //Verify the indicator.
        //0 = The JSON object is NOT complete.
        //1 = The JSON object is complete.
        if (intSectionIndicator == 0) {

            for (var i=0;j=patData.length,i<j; i++)
            {
                var oPatData = patData[i];

                nUniqueRowId++;

                //Reset variables.
                tempString = "";
                tempString += 'patEncounter';
                tempString += nUniqueRowId;

                //Assessment
                oPatData = PopulateSection('Falls',"N/A",tempString,oPatData,fallsSbHdrDispArray[0]);

                //Interventions
                oPatData = PopulateSection('Falls',"N/A",tempString,oPatData,fallsSbHdrDispArray[1]);

                //Falls
                oPatData = PopulateSection('Falls',"N/A",tempString,oPatData,fallsSbHdrDispArray[2]);
            }
        }
        else {

            nUniqueRowId = 0;
            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < json_data12.FALLSREPLY.PATIENTS.length; intCounter++)
            {
                //Reset variables.
                patientEncounterID = 0;
                ptQual = 0;
                tempValueX = "";
                tempValueY = "";
                tempString = "";
                strAssessmentHoverText = "";
                strAssessmentHoverSPANID = "";
                strInterventionsHoverText = "";
                strInterventionsHoverSPANID = "";
                strFallsHoverText = "";
                strFallsHoverSPANID = "";
                patientName = "";
                patientID = "";
                strAssessmentCircle = "";
                strInterventionsCircle = "";
                strFallsCircle = "";
                intAssessmentCircle = 0;
                intInterventionsCircle = 0;
                intFallsCircle = 0;

                patientEncounterID = json_data12.FALLSREPLY.PATIENTS[intCounter].ENCNTR_ID;
                patientID = json_data12.FALLSREPLY.PATIENTS[intCounter].PT_ID;

                var oPatData = null;
                var objIdx = getPatObjIdxByEnctr(patientEncounterID);

                if (objIdx != null)
                {
                    oPatData = patData[objIdx];

                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                    ptQual = json_data12.FALLSREPLY.PATIENTS[intCounter].PTQUALIND;
                    patientName = json_data12.FALLSREPLY.PATIENTS[intCounter].NAME;

                    //Verify if the patient name consist of " or ' characters.
                    //^^ = "
                    //^ = '
                    if (patientName.indexOf("^^") > -1) {
                        patientName = patientName.replace("^^", "&#34;");
                    }
                    if (patientName.indexOf("^") > -1) {
                        patientName = patientName.replace("^", "&#39;");
                    }

                    //Verify if PTQUAL is greater than 0.
                    if (json_data12.FALLSREPLY.PATIENTS[intCounter].FALL_PTQUAL > 0) {
                        intAssessmentCircle = json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[0].STATUS
                        intInterventionsCircle = json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[1].STATUS;
                        intFallsCircle = json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[2].STATUS;

                        //Verify which icon that is going to be displayed in the column.
                        //0 = Not Done
                        //1 = Not Met
                        //2 = Met
                        //Assessment
                        //Reset variable.
                        tempValue = "";

                        //Build Hovers and Icons.
                        strAssessmentHoverSPANID += '<table>';
                        strInterventionsHoverSPANID += '<table>';
                        strFallsHoverSPANID += '<table>';
                        switch (intAssessmentCircle) {

                            case 0:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                //Empty Circle
                                strAssessmentCircle = tempValue;
                                strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_NOT_DOCUMENTED_1+'.</td></tr>';

                                break;
                            case 1:
                                alink = "";
                                alink = "<a href='" + "javascript:launchTab2(" + patientID + "," + patientEncounterID + ");'" +
                                " title='"+i18n.OPEN_PAT_INFO_TAB +"' class='LinkText'>";

                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5971_16;
                                tempValue += "' />";

                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img4798_16;
                                tempValue += "'/>";

                                strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_NOT_DOCUMENTED_1+'<br> '+i18n.FALLS_ASSESS_NOT_DOCUMENTED_2+'</td></tr>';
                                strAssessmentHoverSPANID += "<tr><td>&nbsp</td></tr>";
                                strAssessmentHoverSPANID += '<tr><td>';
                                strAssessmentHoverSPANID += alink;
                                strAssessmentHoverSPANID += patientName;
                                strAssessmentHoverSPANID += '</a>';
                                strAssessmentHoverSPANID += '</td></tr>';

                                //Half Filled Circle with Alarm clock
                                strAssessmentCircle = tempValue;
                                break;
                            case 2:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                //Filled Circle
                                strAssessmentCircle = tempValue;
                                strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_DOCUMENTED_1+' <br> '+i18n.FALLS_ASSESS_DOCUMENTED_2+'</td></tr>';
                                break
                            default:
                                tempValue += "N/A";
                                strAssessmentCircle = tempValue;
                                strAssessmentHoverSPANID += '';
                                break;
                        }
                        //Interventions
                        tempValue = "";
                        switch (intInterventionsCircle) {
                            case 1:
                                alink = "";
                                //Set link
                                alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                                " title='"+i18n.OPEN_ORDERS_PAGE_OF_CHART +
                                patientName +
                                ".' class='LinkText'>";

                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                //Half Filled Circle
                                strInterventionsHoverSPANID += '<tr><td>'+i18n.PATIENT_AT_RISK_FOR_FALLS_NO_PLAN+'</td></tr>';
                                strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                                strInterventionsHoverSPANID += '<tr><td>'
                                strInterventionsHoverSPANID += alink;
                                strInterventionsHoverSPANID += patientName;
                                strInterventionsHoverSPANID += '</a>';
                                strInterventionsHoverSPANID += '</td></tr>'

                                strInterventionsCircle = tempValue;
                                break;
                            case 2:
                                alink = "";
                                //Set link
                                alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                                " title='Open orders page of chart: " +
                                patientName +
                                ".' class='LinkText'>";

                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                //Filled Circle

                                strInterventionsHoverSPANID += '<tr><td>Interventions: </td></tr>';
                                strInterventionsHoverSPANID += '<tr><td>';
                                for (var e = 0; e < json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[1].EVENTS.length; e++) {
                                    strInterventionsHoverSPANID += json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[1].EVENTS[e].EVENT_DISP;
                                    strInterventionsHoverSPANID += "<br>";
                                }
                                strInterventionsHoverSPANID += '</td></tr>';
                                strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                                strInterventionsHoverSPANID += '<tr><td>';
                                strInterventionsHoverSPANID += alink;
                                strInterventionsHoverSPANID += patientName;
                                strInterventionsHoverSPANID += '</a>';
                                strInterventionsHoverSPANID += '</td></tr>';

                                strInterventionsCircle = tempValue;
                                break;
                            default:
                                tempValue += "N/A";
                                strInterventionsCircle = tempValue;
                                strInterventionsHoverSPANID += '';
                                break;
                        }
                        //Falls
                        tempValue = "";
                        switch (intFallsCircle) {
                            case 1:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img6047_16;
                                tempValue += "' />";
                                strFallsHoverSPANID += '<tr><td>'+i18n.POST_FALLS+': </td></tr>';
                                strFallsHoverSPANID += '<tr><td>';
                                for (var e = 0; e < json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[2].EVENTS.length; e++) {
                                    strFallsHoverSPANID += i18n.FALL +" #";
                                    strFallsHoverSPANID += (e + 1);
                                    strFallsHoverSPANID += "<br> &nbsp;&nbsp;";
                                    strFallsHoverSPANID += json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[2].EVENTS[e].EVENT_DISP;
                                    strFallsHoverSPANID += "<br> &nbsp;&nbsp ";
                                    strFallsHoverSPANID += json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[2].EVENTS[e].EVENT_RESULT;
                                    strFallsHoverSPANID += "<br>";
                                }
                                strFallsHoverSPANID += '</td></tr>';
                                //Half Filled Circle
                                strFallsCircle = tempValue;
                                break;
                            default:
                                tempValue += "N/A";
                                strFallsCircle = tempValue;
                                strFallsHoverSPANID += '';
                                break;
                        }
                        //Build Hovers.
                        //Assessment
                        strAssessmentHoverSPANID += '</table>';
                        strAssessmentHoverText += '<span id="'
                        strAssessmentHoverText += strAssessmentHoverSPANID;
                        strAssessmentHoverText += '"';
                        strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                        strAssessmentHoverText += '">';
                        strAssessmentHoverText += strAssessmentCircle;
                        strAssessmentHoverText += '</span>';
                        //Interventions
                        strInterventionsHoverSPANID += '</table>';
                        strInterventionsHoverText += '<span id="'
                        strInterventionsHoverText += strInterventionsHoverSPANID;
                        strInterventionsHoverText += '"';
                        strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                        strInterventionsHoverText += '">';
                        strInterventionsHoverText += strInterventionsCircle;
                        strInterventionsHoverText += '</span>';
                        //Falls
                        strFallsHoverSPANID += '</table>';
                        strFallsHoverText += '<span id="'
                        strFallsHoverText += strFallsHoverSPANID;
                        strFallsHoverText += '"';
                        strFallsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strFallsHoverText += "'gentooltip',this.id,0,0);";
                        strFallsHoverText += '">';
                        strFallsHoverText += strFallsCircle;
                        strFallsHoverText += '</span>';

                        //Build Cells.
                        //Reset variables.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Assessment
                        oPatData = PopulateSection('Falls',strAssessmentHoverText,tempString,oPatData,fallsSbHdrDispArray[0]);

                        //Interventions
                        oPatData = PopulateSection('Falls',strInterventionsHoverText,tempString,oPatData,fallsSbHdrDispArray[1]);

                        //Falls
                        oPatData = PopulateSection('Falls',strFallsHoverText,tempString,oPatData,fallsSbHdrDispArray[2]);

                    }
                    else {
                        //Reset variables.
                        //tempValueX = "";
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Assessment
                        oPatData = PopulateSection('Falls',"N/A",tempString,oPatData,fallsSbHdrDispArray[0]);

                        //Interventions
                        oPatData = PopulateSection('Falls',"N/A",tempString,oPatData,fallsSbHdrDispArray[1]);

                        //Falls
                        oPatData = PopulateSection('Falls',"N/A",tempString,oPatData,fallsSbHdrDispArray[2]);
                    }
                }//oPatData check
            }
        }//intSectionIndicator
        SortPatData(lastSortField);
    }
    catch (error) {
        showErrorMessage(error.message, "fillFallsQualifying", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Falls with values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */

function fillFalls(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strFallsHoverText = "";
    var strFallsHoverSPANID = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strFallsCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intFallsCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var nUniqueRowId = 0;

    try {
        if (blnFallsDisplayed)
        {
            displayLoadText("fall");
            PopulatePatientInfo();
            return;
        }
        //Total number of FALLS values.
        totalFALLSValues = json_data12.FALLSREPLY.PATIENTSCNT;

        //Loop through the JSON structure.
        for (var intCounter = 0; intCounter < json_data12.FALLSREPLY.PATIENTS.length; intCounter++)
        {
            //Reset variables.
            patientEncounterID = 0;
            ptQual = 0;
            tempValueX = "";
            tempValueY = "";
            tempString = "";
            strAssessmentHoverText = "";
            strAssessmentHoverSPANID = "";
            strInterventionsHoverText = "";
            strInterventionsHoverSPANID = "";
            strFallsHoverText = "";
            strFallsHoverSPANID = "";
            patientName = "";
            patientID = "";
            strAssessmentCircle = "";
            strInterventionsCircle = "";
            strFallsCircle = "";
            intAssessmentCircle = 0;
            intInterventionsCircle = 0;
            intFallsCircle = 0;

            patientEncounterID = json_data12.FALLSREPLY.PATIENTS[intCounter].ENCNTR_ID;
            ptQual = json_data12.FALLSREPLY.PATIENTS[intCounter].PTQUALIND;
            patientName = json_data12.FALLSREPLY.PATIENTS[intCounter].NAME;
            patientID = json_data12.FALLSREPLY.PATIENTS[intCounter].PT_ID;

            var oPatData = null;
            var objIdx = getPatObjIdxByEnctr(patientEncounterID);

            if (objIdx != null)
            {
                oPatData = patData[objIdx];

                if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                //Verify if the patient name consist of " or ' characters.
                //^^ = "
                //^ = '
                if (patientName.indexOf("^^") > -1) {
                    patientName = patientName.replace("^^", "&#34;");
                }
                if (patientName.indexOf("^") > -1) {
                    patientName = patientName.replace("^", "&#39;");
                }
                //Verify if PTQUAL is greater than 0.
                if (json_data12.FALLSREPLY.PATIENTS[intCounter].FALL_PTQUAL > 0) {
                    intAssessmentCircle = json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[0].STATUS
                    intInterventionsCircle = json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[1].STATUS;
                    intFallsCircle = json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[2].STATUS;

                    //Verify which icon that is going to be displayed in the column.
                    //0 = Not Done
                    //1 = Not Met
                    //2 = Met
                    //Assessment
                    //Reset variable.
                    tempValue = "";

                    //Build Hovers and Icons.
                    strAssessmentHoverSPANID += '<table>';
                    strInterventionsHoverSPANID += '<table>';
                    strFallsHoverSPANID += '<table>';
                    switch (intAssessmentCircle) {

                        case 0:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            //Empty Circle
                            strAssessmentCircle = tempValue;
                            strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_NOT_DOCUMENTED_1+'.</td></tr>';

                            break;
                        case 1:
                            alink = "";
                            alink = "<a href='" + "javascript:launchTab2(" + patientID + "," + patientEncounterID + ");'" +
                            " title='Open the " +
                            'Patient Information' +
                            " tab.' class='LinkText'>";

                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5971_16;
                            tempValue += "' />";

                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img4798_16;
                            tempValue += "'/>";

                            strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_NOT_DOCUMENTED_1+'<br> '+i18n.FALLS_ASSESS_NOT_DOCUMENTED_2+'</td></tr>';
                            strAssessmentHoverSPANID += "<tr><td>&nbsp</td></tr>";
                            strAssessmentHoverSPANID += '<tr><td>';
                            strAssessmentHoverSPANID += alink;
                            strAssessmentHoverSPANID += patientName;
                            strAssessmentHoverSPANID += '</a>';
                            strAssessmentHoverSPANID += '</td></tr>';

                            //Half Filled Circle with Alarm clock
                            strAssessmentCircle = tempValue;
                            break;
                        case 2:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            //Filled Circle
                            strAssessmentCircle = tempValue;
                            strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_DOCUMENTED_1+' <br> '+i18n.FALLS_ASSESS_DOCUMENTED_2+'</td></tr>';
                            break
                        default:
                            tempValue += "N/A";
                            strAssessmentCircle = tempValue;
                            strAssessmentHoverSPANID += '';
                            break;
                    }
                    //Interventions
                    tempValue = "";
                    switch (intInterventionsCircle) {
                        case 1:
                            alink = "";
                            //Set link
                            alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                            " title='Open orders page of chart: " +
                            patientName +
                            ".' class='LinkText'>";

                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            //Half Filled Circle
                            strInterventionsHoverSPANID += '<tr><td>'+i18n.PATIENT_AT_RISK_FOR_FALLS_NO_PLAN+'</td></tr>';
                            strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                            strInterventionsHoverSPANID += '<tr><td>'
                            strInterventionsHoverSPANID += alink;
                            strInterventionsHoverSPANID += patientName;
                            strInterventionsHoverSPANID += '</a>';
                            strInterventionsHoverSPANID += '</td></tr>'

                            strInterventionsCircle = tempValue;
                            break;
                        case 2:
                            alink = "";
                            //Set link
                            alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                            " title='"+i18n.OPEN_ORDERS_PAGE_OF_CHART +
                            patientName +
                            ".' class='LinkText'>";

                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            //Filled Circle

                            strInterventionsHoverSPANID += '<tr><td>'+i18n.INTERVENTIONS+': </td></tr>';
                            strInterventionsHoverSPANID += '<tr><td>';
                            for (var e = 0; e < json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[1].EVENTS.length; e++) {
                                strInterventionsHoverSPANID += json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[1].EVENTS[e].EVENT_DISP;
                                strInterventionsHoverSPANID += "<br>";
                            }
                            strInterventionsHoverSPANID += '</td></tr>';
                            strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                            strInterventionsHoverSPANID += '<tr><td>';
                            strInterventionsHoverSPANID += alink;
                            strInterventionsHoverSPANID += patientName;
                            strInterventionsHoverSPANID += '</a>';
                            strInterventionsHoverSPANID += '</td></tr>';

                            strInterventionsCircle = tempValue;
                            break;
                        default:
                            tempValue += "N/A";
                            strInterventionsCircle = tempValue;
                            strInterventionsHoverSPANID += '';
                            break;
                    }
                    //Falls
                    tempValue = "";
                    switch (intFallsCircle) {
                        case 1:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img6047_16;
                            tempValue += "' />";
                            strFallsHoverSPANID += '<tr><td>'+i18n.POST_FALLS+': </td></tr>';
                            strFallsHoverSPANID += '<tr><td>';
                            for (var e = 0; e < json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[2].EVENTS.length; e++) {
                                strFallsHoverSPANID += i18n.FALL+" #";
                                strFallsHoverSPANID += (e + 1);
                                strFallsHoverSPANID += "<br> &nbsp;&nbsp;";
                                strFallsHoverSPANID += json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[2].EVENTS[e].EVENT_DISP;
                                strFallsHoverSPANID += "<br> &nbsp;&nbsp ";
                                strFallsHoverSPANID += json_data12.FALLSREPLY.PATIENTS[intCounter].FALLS[2].EVENTS[e].EVENT_RESULT;
                                strFallsHoverSPANID += "<br>";
                            }
                            strFallsHoverSPANID += '</td></tr>';
                            //Half Filled Circle
                            strFallsCircle = tempValue;
                            break;
                        default:
                            tempValue += "N/A";
                            strFallsCircle = tempValue;
                            strFallsHoverSPANID += '';
                            break;
                    }
                    //Build Hovers.
                    //Assessment
                    strAssessmentHoverSPANID += '</table>';
                    strAssessmentHoverText += '<span id="'
                    strAssessmentHoverText += strAssessmentHoverSPANID;
                    strAssessmentHoverText += '"';
                    strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                    strAssessmentHoverText += '">';
                    strAssessmentHoverText += strAssessmentCircle;
                    strAssessmentHoverText += '</span>';
                    //Interventions
                    strInterventionsHoverSPANID += '</table>';
                    strInterventionsHoverText += '<span id="'
                    strInterventionsHoverText += strInterventionsHoverSPANID;
                    strInterventionsHoverText += '"';
                    strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                    strInterventionsHoverText += '">';
                    strInterventionsHoverText += strInterventionsCircle;
                    strInterventionsHoverText += '</span>';
                    //Falls
                    strFallsHoverSPANID += '</table>';
                    strFallsHoverText += '<span id="'
                    strFallsHoverText += strFallsHoverSPANID;
                    strFallsHoverText += '"';
                    strFallsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strFallsHoverText += "'gentooltip',this.id,0,0);";
                    strFallsHoverText += '">';
                    strFallsHoverText += strFallsCircle;
                    strFallsHoverText += '</span>';

                    //Build Cells.
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[fallCell];
                        tempValueX.innerHTML = strAssessmentHoverText;
                    }
                    oPatData = AddToOPatData(strAssessmentHoverText,oPatData,'Falls',fallsSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(fallCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strInterventionsHoverText;
                    }
                    oPatData = AddToOPatData(strInterventionsHoverText,oPatData,'Falls',fallsSbHdrDispArray[1]);
                    //Falls
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(fallCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strFallsHoverText;
                    }
                    oPatData = AddToOPatData(strFallsHoverText,oPatData,'Falls',fallsSbHdrDispArray[2]);
                }
                else {
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[fallCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'Falls',fallsSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(fallCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'Falls',fallsSbHdrDispArray[1]);
                    //Falls
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(fallCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'Falls',fallsSbHdrDispArray[2]);
                }
            }//oPatDat check
        }
        blnFallsDisplayed = true;
    }
    catch (error) {
        showErrorMessage(error.message, "fillFalls", "", "patientName = "+patientName+"\n patientID = "+patientID+"\n patientEncounterID = "+patientEncounterID+'\n ptQual = '+ptQual+"\n nUniqueRowId"+nUniqueRowId);
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Gets the Falls JSON structure.
 */
function getFalls(){
    var qmReqObject = "";
    var blnLoadFalls = true;
    var cclParam = "";
    var strErrorMessage = "An error has occurred when getting data for Falls.";
    var strFalls = "";
    var intSectionIndicator = 0;
    var cclProg = "dc_mp_get_lh_falls";

    try {
        if (requestAsync) {
            //A request is in progress, so don't make another one.
        }
        else {
            //Display Load Text.
            displayLoadText("fall");

            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1) {
                intSectionIndicator = json_data2.PTREPLY.FALLSIND;
                //Verify the indicator.
                //0 = The JSON object is NOT complete.
                //1 = The JSON object is complete.
                if (intSectionIndicator == 1) {
                    //Load responses text into object.
                    strFalls = json_data2.PTREPLY.FALLSJSON;
                    json_data12 = JSON.parse(strFalls);
                }
                //Load Falls JSON.
                blnFallsCalled = true;
                blnLoadFalls = expandCollapseFalls();
                //Hide Load Text.
                setTimeout("hideLoadText()",hideLoadTextDelay);
                //This flag is used in the function getExpandedTimer.
                intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
            }
            else {
                //Build JSON String.
                qmReqObject += '{"QMREQ":{"PRSNLID":';
                qmReqObject += userPersonID;
                qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
                qmReqObject += devLocation;
                qmReqObject += ',"APPID":';
                qmReqObject += applicationID;
                qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":';
                qmReqObject += selectedID;
                qmReqObject += ',"PTLISTTYPE":';
                qmReqObject += ptListType;
                qmReqObject += ',"PTLISTLOCCD":';
                qmReqObject += ptListLoccd;
                qmReqObject += ',"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
                qmReqObject += ',"LIST":['
                qmReqObject += strPatientDemog;
                qmReqObject += ']}}';

                //Build the parameters for getting the Patients.
                cclParam = "'MINE'" + ",'" + qmReqObject + "'";

                requestAsync = getXMLCclRequest();
                requestAsync.onreadystatechange = function(){
                    if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                        if (requestAsync.responseText > " ") {
                            try {
                                //Load responses text into object.
                                json_data12 = JSON.parse(requestAsync.responseText);
                            }
                            catch (error) {
                                //Hide Load Text.
                                setTimeout("hideLoadText()",hideLoadTextDelay);
                                showErrorMessage(error.message, "getFalls", requestAsync.status, cclParam);
                                return false;
                            }
                            //Load Falls JSON.
                            blnFallsCalled = true;
                            blnLoadFalls = expandCollapseFalls();
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //This flag is used in the function getExpandedTimer.
                            intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
                        }
                        requestAsync = null;
                    }
                    else
                        if (requestAsync.readyState == 4 && requestAsync.readyState != 200) {
                            //Hide Load Text.


                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            showErrorMessage(strErrorMessage, "getFalls", requestAsync.status, cclParam);
                            return false;
                        }
                };
                //Sends the request to the CCL server.
                if (location.protocol.substr(0, 4) == "http") {
                    var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
                    requestAsync.open("POST", url);
                    requestAsync.send(cclParam);
                }
                else {
                    requestAsync.open("POST", cclProg);
                    requestAsync.send(cclParam);
                }
            }
        }
    }
    catch (error) {
        //Hide Load Text.
        setTimeout("hideLoadText()",hideLoadTextDelay);
        showErrorMessage(error.message, "getFalls", "", cclParam);
    }
}

/**
 * Expands or collapses the section Falls Pediatric. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function expandCollapseFallsPediatric(){
    var intHiddenValue = 0;
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var content = "";
    var tempTotalValue = 0;
    var blnStatus = true;
    var tempTotalHiddenRows = 0;
    var table = "";
    var intCounter = 0;
    var rowsPageOne = 0;
    var rowsToBuild = 0;

    try {

        if (currentPage == pageCNT && !bExpLastPage)
        {
            displayPreviousPage();
            bExpLastPage = true;
            //return blnStatus;
        }
        //Verify if the Falls Pediatric JSON structure has been built.
        //True = has already been called.
        //False = has not been called.

        if (blnFallsPediatricCalled == false) {
            //Change Hidden Value.
            hiddenFallsPediatricExpandCollapse = 1;
            getFallsPediatric();
        }
        else {
            //Calculate how many rows we are going to hide and add 1 extra to inlcude the last row.
            tempTotalValue = parseInt(PgRecTotal) + parseInt(1);
            //Get hidden value.
            intHiddenValue = hiddenFallsPediatricExpandCollapse;
            //Get name of table.
            table = document.getElementById("hdrtable2");

            //0 = make the section collapsed.
            //1 = make the section expanded.
            if (intHiddenValue == 0) {
                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Change Hidden Value.
                hiddenFallsPediatricExpandCollapse = 1;

                //Change size of Table 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120)) + hdrtableWdthAdj;
                intCurrentTableWidth = parseInt(intCurrentTableWidth) - parseInt(intSubtractWidth) + parseInt(40);

                document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth);
                document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth);

                //Main Header

                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[pediatricFallsDisplayIndicator].colSpan = 1;
                document.getElementById('secpatlisthdrFallsPediatric').style.width = "40px";
                document.getElementById('secpatlisthdrFallsPediatric').className = "tabhdrs2g";
                tempStr = i18n.condDisp.EXP_FALLS_HVR.replace("-", "&#45;")
                document.getElementById('secpatlisthdrFallsPediatric').innerHTML = '<div id="divFallsPediatrictext" title="'+tempStr+'" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">+</div>';




                //Sub Headers
                //Assessment
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[1].cells;
                tempValue[pfallCell].colSpan = "1";
                document.getElementById('secsubcolFallsPediatric1').style.width = "40px";
                document.getElementById('secsubcolFallsPediatric1').className = "tabhdrs2g";
                document.getElementById('secsubcolFallsPediatric1').style.display = "";
                document.getElementById('secsubcolFallsPediatric1').innerHTML = "";
                //Interventions
                content = "";
                tempValue = "";
                tempValue = "secsubcolFallsPediatric2";
                content = document.getElementById(tempValue);
                content.style.display = "none";
                content.innerHTML = "";
                //Falls
                content = "";
                tempValue = "";
                tempValue = "secsubcolFallsPediatric3";
                content = document.getElementById(tempValue);
                content.style.display = "none";
                content.innerHTML = "";

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        table.rows[intCounter].cells[pfallCell].style.width = "40px";
                        table.rows[intCounter].cells[pfallCell].className = "tabhdrsVertical";
                        table.rows[intCounter].cells[pfallCell].style.display = "";
                        tempStr = i18n.condDisp.FALL_PEDIATRIC.replace("-", "&#45;")
                        table.rows[intCounter].cells[pfallCell].innerHTML = tempStr;
                    }
                    else {
                        //Assessment
                        table.rows[intCounter].cells[pfallCell].style.width = "0px";
                        table.rows[intCounter].cells[pfallCell].style.display = "none";
                        table.rows[intCounter].cells[pfallCell].innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue += "patientInterventionPediatric";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";
                    //Falls
                    tempValue = "";
                    tempValue += "patientFallsFallsPediatric";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";

                    //Add 2 to the counter.
                    intCounter = intCounter + 2;
                }
                //Add the rowspan.
                table.rows[0].cells[pfallCell].rowSpan = rowSpanCounter;
            }
            else {
                displayLoadText("pfall");
                //Change Hidden Value.
                hiddenFallsPediatricExpandCollapse = 0;

                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Calculate size of Tables 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120));
                intCurrentTableWidth = parseInt(intCurrentTableWidth) + parseInt(intSubtractWidth) - parseInt(40);

                //Reset global variables.
                hdrTableWidth = intCurrentTableWidth;
                hdrTable2Width = intCurrentTableWidth;

                //Set size of Tables 1 and 2.
                document.getElementById("hdrtable").width = parseInt(hdrTableWidth) + hdrtableWdthAdj;
                document.getElementById("hdrtable2").width = parseInt(hdrTable2Width) + hdrtableWdthAdj;

                //Main Header.
                tempValue = "";
                tempValue = "secpatlisthdrFallsPediatric";
                document.getElementById(tempValue).style.width = "360px";
                document.getElementById(tempValue).className = "tabhdrs";
                document.getElementById(tempValue).style.display = "";
                 tempStr = i18n.condDisp.COLLAPSE_PED_FALLS_HVR.replace("-", "&#45;");
                document.getElementById(tempValue).innerHTML = '<div id="divFallsPediatrictext" title="'+tempStr+'" class="mainColumn2g" onclick="javascript:expandCollapseFallsPediatric();">- Falls &#45; Pediatric</div>';

                //Change colspan and rowspan
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[pediatricFallsDisplayIndicator].colSpan = 3;
                table.rows[0].cells[pfallCell].rowSpan = 1;
                table.rows[0].cells[pfallCell].className = "demcell";
                table.rows[0].cells[pfallCell].style.display = "";
                table.rows[0].cells[pfallCell].innerHTML = "";

                //Sub Headers
                //Assessment
                document.getElementById('secsubcolFallsPediatric1').style.width = "120px";
                document.getElementById('secsubcolFallsPediatric1').className = "subhdrs";
                document.getElementById('secsubcolFallsPediatric1').style.display = "";
                document.getElementById('secsubcolFallsPediatric1').innerHTML = i18n.ASSESSMENT;
                //Interventions
                document.getElementById('secsubcolFallsPediatric2').style.width = "120px";
                document.getElementById('secsubcolFallsPediatric2').className = "subhdrs";
                document.getElementById('secsubcolFallsPediatric2').style.display = "";
                document.getElementById('secsubcolFallsPediatric2').innerHTML = i18n.INTERVENTIONS;
                //Falls
                document.getElementById('secsubcolFallsPediatric3').style.width = "120px";
                document.getElementById('secsubcolFallsPediatric3').className = "subhdrs";
                document.getElementById('secsubcolFallsPediatric3').style.display = "";
                document.getElementById('secsubcolFallsPediatric3').innerHTML = i18n.condDisp.FALLS;

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellFallsPediatricRowSpan";
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellFallsPediatricRowSpan" + i;
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue += "patientInterventionPediatric";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                    //Pressure Ulcer
                    tempValue = "";
                    tempValue += "patientFallsFallsPediatric";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                }

                //Verify if this is the first time the section is called.
                if (blnFirstTimeFallsPediatric == true) {
                    //Change flag.
                    blnFirstTimeFallsPediatric = false;
                }

                //Verify which value the patient indicator has.
                //0 = Both qualifying and non qualifying patients.
                //1 = Only qualifying patients.
                if (strPtQualind == 1) {
                    //Get values for the section.
                    blnStatus = fillFallsPediatricQualifying();
                }
                else {
                    //Get values for the section.
                    blnStatus = fillFallsPediatric();
                }
            }
        }
        if (bExpLastPage)
        {
            displayNextPage();
            bExpLastPage = false;
        }
    }
    catch (error) {
        showErrorMessage(error.message, "expandCollapseFallsPediatric", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Falls - Pediatric with only qualifying values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillFallsPediatricQualifying(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strPFALLHoverText = "";
    var strPFALLHoverSPANID = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strPFALLCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intPFALLCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var tempPageNum = 0;
    var strPtQualEncounterID = 0;
    var strPtQualPatientID = 0;
    var intSectionIndicator = 0;
    var nUniqueRowId = 0;

    try {
        //Get Indicator.
        intSectionIndicator = json_data2.PTREPLY.PFALLIND;

        //Verify the indicator.
        //0 = The JSON object is NOT complete.
        //1 = The JSON object is complete.
        if (intSectionIndicator == 0) {
            for (var i=0;j=patData.length,i<j; i++)
            {
                var oPatData = patData[i];

                nUniqueRowId++;

                //Reset variables.
                tempString = "";
                tempString += 'patEncounter';
                tempString += nUniqueRowId;

                //Assessment
                oPatData = PopulateSection('FallsPediatric',"N/A",tempString,oPatData,pedFallsSbHdrDispArray[0]);

                //LineDays
                oPatData = PopulateSection('FallsPediatric',"N/A",tempString,oPatData,pedFallsSbHdrDispArray[1]);

                //CRI
                oPatData = PopulateSection('FallsPediatric',"N/A",tempString,oPatData,pedFallsSbHdrDispArray[2]);
            }
        }
        else {
            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < json_data13.PFALLREPLY.PATIENTS.length; intCounter++)
            {
                //Reset variables.
                patientEncounterID = 0;
                ptQual = 0;
                tempValueX = "";
                tempValueY = "";
                tempString = "";
                strAssessmentHoverText = "";
                strAssessmentHoverSPANID = "";
                strInterventionsHoverText = "";
                strInterventionsHoverSPANID = "";
                strPFALLHoverText = "";
                strPFALLHoverSPANID = "";
                patientName = "";
                patientID = "";
                strAssessmentCircle = "";
                strInterventionsCircle = "";
                strPFALLCircle = "";
                intAssessmentCircle = 0;
                intInterventionsCircle = 0;
                intPFALLCircle = 0;

                patientEncounterID = json_data13.PFALLREPLY.PATIENTS[intCounter].ENCNTR_ID;
                patientID = json_data13.PFALLREPLY.PATIENTS[intCounter].PT_ID;

                var oPatData = null;
                var objIdx = getPatObjIdxByEnctr(patientEncounterID);

                if (objIdx != null)
                {
                    oPatData = patData[objIdx];

                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                    ptQual = json_data13.PFALLREPLY.PATIENTS[intCounter].PTQUALIND;
                    patientName = json_data13.PFALLREPLY.PATIENTS[intCounter].NAME;

                    //Verify if the patient name consist of " or ' characters.
                    //^^ = "
                    //^ = '
                    if (patientName.indexOf("^^") > -1) {
                        patientName = patientName.replace("^^", "&#34;");
                    }
                    if (patientName.indexOf("^") > -1) {
                        patientName = patientName.replace("^", "&#39;");
                    }

                    //Verify if PTQUAL is greater than 0.
                    if (json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL_PTQUAL > 0) {
                        intAssessmentCircle = json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[0].STATUS
                        intInterventionsCircle = json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[1].STATUS;
                        intPFALLCircle = json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[2].STATUS;

                        //Verify which icon that is going to be displayed in the column.
                        //0 = Not Done
                        //1 = Not Met
                        //2 = Met
                        //Assessment
                        //Reset variable.
                        tempValue = "";

                        //Build Hovers and Icons.
                        strAssessmentHoverSPANID += '<table>';
                        strInterventionsHoverSPANID += '<table>';
                        strPFALLHoverSPANID += '<table>';
                        switch (intAssessmentCircle) {
                            case 0:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                //Empty Circle
                                strAssessmentCircle = tempValue;
                                strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_NOT_DOCUMENTED_1+'.</td></tr>';
                                break;
                            case 1:
                                alink = "";
                                alink = "<a href='" + "javascript:launchTab2(" + patientID + "," + patientEncounterID + ");'" +
                                " title='"+i18n.OPEN_PAT_INFO_TAB+"' class='LinkText'>";

                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5971_16;
                                tempValue += "' />";

                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img4798_16;
                                tempValue += "'/>";
                                strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_NOT_COMPLETED_1+'; '+i18n.FALLS_ASSESS_NOT_COMPLETED_2+'.</td></tr>';
                                strAssessmentHoverSPANID += "<tr><td>&nbsp</td></tr>";
                                strAssessmentHoverSPANID += '<tr><td>';
                                strAssessmentHoverSPANID += alink;
                                strAssessmentHoverSPANID += patientName;
                                strAssessmentHoverSPANID += '</a>';
                                strAssessmentHoverSPANID += '</td></tr>'

                                //Half Filled Circle with Alarm clock
                                strAssessmentCircle = tempValue;
                                break;
                            case 2:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                //Filled Circle
                                strAssessmentCircle = tempValue;
                                strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_DOCUMENTED_1+ ' ' + i18n.FALLS_ASSESS_DOCUMENTED_2+'.</td></tr>';
                                break
                            default:
                                tempValue += "N/A";
                                strAssessmentCircle = tempValue;
                                strAssessmentHoverSPANID += '';
                                break;
                        }
                        //Interventions
                        tempValue = "";
                        switch (intInterventionsCircle) {
                            case 1:
                                alink = "";
                                //Set link
                                alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                                " title='Open orders page of chart: " +
                                patientName +
                                ".' class='LinkText'>";

                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                //Half Filled Circle
                                strInterventionsHoverSPANID += '<tr><td>'+i18n.PATIENT_AT_RISK_FOR_FALLS_NO_PLAN+'.</td></tr>';
                                strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                                strInterventionsHoverSPANID += '<tr><td>';
                                strInterventionsHoverSPANID += alink;
                                strInterventionsHoverSPANID += patientName;
                                strInterventionsHoverSPANID += '</a>';
                                strInterventionsHoverSPANID += '</td></tr>';

                                strInterventionsCircle = tempValue;
                                break;
                            case 2:
                                alink = "";
                                //Set link
                                alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                                " title='"+i18n.OPEN_ORDERS_PAGE_OF_CHART +
                                patientName +
                                ".' class='LinkText'>";

                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                //Filled Circle
                                strInterventionsHoverSPANID += '<tr><td>Interventions: </td></tr>';
                                strInterventionsHoverSPANID += '<tr><td>';
                                for (var e = 0; e < json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[1].EVENTS.length; e++) {
                                    strInterventionsHoverSPANID += json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[1].EVENTS[e].EVENT_DISP;
                                    strInterventionsHoverSPANID += "<br>";
                                }
                                strInterventionsHoverSPANID += '</td></tr>';
                                strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                                strInterventionsHoverSPANID += '<tr><td>';
                                strInterventionsHoverSPANID += alink;
                                strInterventionsHoverSPANID += patientName;
                                strInterventionsHoverSPANID += '</a>';
                                strInterventionsHoverSPANID += '</td></tr>';

                                strInterventionsCircle = tempValue;
                                break;
                            default:
                                tempValue += "N/A";
                                strInterventionsCircle = tempValue;
                                strInterventionsHoverSPANID += '';
                                break;
                        }
                        //PFALL
                        tempValue = "";
                        switch (intPFALLCircle) {
                            case 1:
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img6047_16;
                                tempValue += "' />";
                                strPFALLHoverSPANID += '<tr><td>'+i18n.POST_FALL+': </td></tr>';
                                strPFALLHoverSPANID += '<tr><td>';
                                for (var e = 0; e < json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[2].EVENTS.length; e++) {
                                    strPFALLHoverSPANID += i18n.FALL+" #";
                                    strPFALLHoverSPANID += (e + 1);
                                    strPFALLHoverSPANID += "<br> &nbsp;&nbsp;";
                                    strPFALLHoverSPANID += json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[2].EVENTS[e].EVENT_DISP;
                                    strPFALLHoverSPANID += "<br> &nbsp;&nbsp ";
                                    strPFALLHoverSPANID += json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[2].EVENTS[e].EVENT_RESULT;
                                    strPFALLHoverSPANID += "<br>";
                                }
                                strPFALLHoverSPANID += '</td></tr>';
                                //Half Filled Circle
                                strPFALLCircle = tempValue;
                                break;
                            default:
                                tempValue += "N/A";
                                strPFALLCircle = tempValue;
                                strPFALLHoverSPANID += '';
                                break;
                        }
                        //Build Hovers.
                        //Assessment
                        strAssessmentHoverSPANID += '</table>';
                        strAssessmentHoverText += '<span id="'
                        strAssessmentHoverText += strAssessmentHoverSPANID;
                        strAssessmentHoverText += '"';
                        strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                        strAssessmentHoverText += '">';
                        strAssessmentHoverText += strAssessmentCircle;
                        strAssessmentHoverText += '</span>';
                        //Interventions
                        strInterventionsHoverSPANID += '</table>';
                        strInterventionsHoverText += '<span id="'
                        strInterventionsHoverText += strInterventionsHoverSPANID;
                        strInterventionsHoverText += '"';
                        strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                        strInterventionsHoverText += '">';
                        strInterventionsHoverText += strInterventionsCircle;
                        strInterventionsHoverText += '</span>';
                        //PFALL
                        strPFALLHoverSPANID += '</table>';
                        strPFALLHoverText += '<span id="'
                        strPFALLHoverText += strPFALLHoverSPANID;
                        strPFALLHoverText += '"';
                        strPFALLHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strPFALLHoverText += "'gentooltip',this.id,0,0);";
                        strPFALLHoverText += '">';
                        strPFALLHoverText += strPFALLCircle;
                        strPFALLHoverText += '</span>';

                        //Build Cells.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Assessment
                        oPatData = PopulateSection('FallsPediatric',strAssessmentHoverText,tempString,oPatData,pedFallsSbHdrDispArray[0]);

                        //Interventions
                        oPatData = PopulateSection('FallsPediatric',strInterventionsHoverText,tempString,oPatData,pedFallsSbHdrDispArray[1]);

                        //PFALL
                        oPatData = PopulateSection('FallsPediatric',strPFALLHoverText,tempString,oPatData,pedFallsSbHdrDispArray[2]);
                    }
                    else {
                        //Reset variables.
                        tempValueX = "";
                        tempString = "";

                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Assessment
                        oPatData = PopulateSection('FallsPediatric',"N/A",tempString,oPatData,pedFallsSbHdrDispArray[0]);

                        //Interventions
                        oPatData = PopulateSection('FallsPediatric',"N/A",tempString,oPatData,pedFallsSbHdrDispArray[1]);

                        //PFALL
                        oPatData = PopulateSection('FallsPediatric',"N/A",tempString,oPatData,pedFallsSbHdrDispArray[2]);
                    }
                }//oPatData check
            }
        } //intSectionIndicator
        SortPatData(lastSortField);
    }
    catch (error) {
        showErrorMessage(error.message, "fillFallsPediatricQualifying", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Falls - Pediatric with values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillFallsPediatric(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strPFALLHoverText = "";
    var strPFALLHoverSPANID = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strPFALLCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intPFALLCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var nUniqueRowId = 0;

    try {
        if (blnFallsPedDisplayed)
        {
            displayLoadText("pfall");
            PopulatePatientInfo();
            return;
        }
        //Loop through the JSON structure.
        for (var intCounter = 0; intCounter < json_data13.PFALLREPLY.PATIENTS.length; intCounter++)
        {
            //Reset variables.
            patientEncounterID = 0;
            ptQual = 0;
            tempValueX = "";
            tempValueY = "";
            tempString = "";
            strAssessmentHoverText = "";
            strAssessmentHoverSPANID = "";
            strInterventionsHoverText = "";
            strInterventionsHoverSPANID = "";
            strPFALLHoverText = "";
            strPFALLHoverSPANID = "";
            patientName = "";
            patientID = "";
            strAssessmentCircle = "";
            strInterventionsCircle = "";
            strPFALLCircle = "";
            intAssessmentCircle = 0;
            intInterventionsCircle = 0;
            intPFALLCircle = 0;

            patientEncounterID = json_data13.PFALLREPLY.PATIENTS[intCounter].ENCNTR_ID;
            ptQual = json_data13.PFALLREPLY.PATIENTS[intCounter].PTQUALIND;
            patientName = json_data13.PFALLREPLY.PATIENTS[intCounter].NAME;
            patientID = json_data13.PFALLREPLY.PATIENTS[intCounter].PT_ID;

            var oPatData = null;
            var objIdx = getPatObjIdxByEnctr(patientEncounterID);

            if (objIdx != null)
            {
                oPatData = patData[objIdx];
                if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}
                //Verify if the patient name consist of " or ' characters.
                //^^ = "
                //^ = '
                if (patientName.indexOf("^^") > -1) {
                    patientName = patientName.replace("^^", "&#34;");
                }
                if (patientName.indexOf("^") > -1) {
                    patientName = patientName.replace("^", "&#39;");
                }

                //Verify if PTQUAL is greater than 0.
                if (json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL_PTQUAL > 0) {
                    intAssessmentCircle = json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[0].STATUS
                    intInterventionsCircle = json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[1].STATUS;
                    intPFALLCircle = json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[2].STATUS;

                    //Verify which icon that is going to be displayed in the column.
                    //0 = Not Done
                    //1 = Not Met
                    //2 = Met
                    //Assessment
                    //Reset variable.
                    tempValue = "";

                    //Build Hovers and Icons.
                    strAssessmentHoverSPANID += '<table>';
                    strInterventionsHoverSPANID += '<table>';
                    strPFALLHoverSPANID += '<table>';
                    switch (intAssessmentCircle) {
                        case 0:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            //Empty Circle
                            strAssessmentCircle = tempValue;
                            strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_NOT_DOCUMENTED_1+'.</td></tr>';
                            break;
                        case 1:
                            alink = "";
                            alink = "<a href='" + "javascript:launchTab2(" + patientID + "," + patientEncounterID + ");'" +
                            " title='"+i18n.OPEN_PAT_INFO_TAB+"' class='LinkText'>";

                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5971_16;
                            tempValue += "' />";

                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img4798_16;
                            tempValue += "'/>";
                            strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_NOT_COMPLETED_1+'; '+i18n.FALLS_ASSESS_NOT_COMPLETED_2+'.</td></tr>';
                            strAssessmentHoverSPANID += "<tr><td>&nbsp</td></tr>";
                            strAssessmentHoverSPANID += '<tr><td>';
                            strAssessmentHoverSPANID += alink;
                            strAssessmentHoverSPANID += patientName;
                            strAssessmentHoverSPANID += '</a>';
                            strAssessmentHoverSPANID += '</td></tr>'

                            //Half Filled Circle with Alarm clock
                            strAssessmentCircle = tempValue;
                            break;
                        case 2:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            //Filled Circle
                            strAssessmentCircle = tempValue;
                            strAssessmentHoverSPANID += '<tr><td>'+i18n.FALLS_ASSESS_DOCUMENTED_1 + ' ' + i18n.FALLS_ASSESS_DOCUMENTED_2 +'.</td></tr>';
                            break
                        default:
                            tempValue += "N/A";
                            strAssessmentCircle = tempValue;
                            strAssessmentHoverSPANID += '';
                            break;
                    }
                    //Interventions
                    tempValue = "";
                    switch (intInterventionsCircle) {
                        case 1:
                            alink = "";
                            //Set link
                            alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                            " title='"+i18n.OPEN_ORDERS_PAGE_OF_CHART +
                            patientName +
                            ".' class='LinkText'>";

                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            //Half Filled Circle
                            strInterventionsHoverSPANID += '<tr><td>'+i18n.PATIENT_AT_RISK_FOR_FALLS_NO_PLAN+'.</td></tr>';
                            strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                            strInterventionsHoverSPANID += '<tr><td>';
                            strInterventionsHoverSPANID += alink;
                            strInterventionsHoverSPANID += patientName;
                            strInterventionsHoverSPANID += '</a>';
                            strInterventionsHoverSPANID += '</td></tr>';

                            strInterventionsCircle = tempValue;
                            break;
                        case 2:
                            alink = "";
                            //Set link
                            alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                            i18n.OPEN_ORDERS_PAGE_OF_CHART+
                            patientName +
                            ".' class='LinkText'>";

                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            //Filled Circle
                            strInterventionsHoverSPANID += '<tr><td>'+i18n.INTERVENTIONS+': </td></tr>';
                            strInterventionsHoverSPANID += '<tr><td>';
                            for (var e = 0; e < json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[1].EVENTS.length; e++) {
                                strInterventionsHoverSPANID += json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[1].EVENTS[e].EVENT_DISP;
                                strInterventionsHoverSPANID += "<br>";
                            }
                            strInterventionsHoverSPANID += '</td></tr>';
                            strInterventionsHoverSPANID += "<tr><td>&nbsp</td></tr>";
                            strInterventionsHoverSPANID += '<tr><td>';
                            strInterventionsHoverSPANID += alink;
                            strInterventionsHoverSPANID += patientName;
                            strInterventionsHoverSPANID += '</a>';
                            strInterventionsHoverSPANID += '</td></tr>';

                            strInterventionsCircle = tempValue;
                            break;
                        default:
                            tempValue += "N/A";
                            strInterventionsCircle = tempValue;
                            strInterventionsHoverSPANID += '';
                            break;
                    }
                    //PFALL
                    tempValue = "";
                    switch (intPFALLCircle) {
                        case 1:
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img6047_16;
                            tempValue += "' />";
                            strPFALLHoverSPANID += '<tr><td>'+i18n.POST_FALL+': </td></tr>';
                            strPFALLHoverSPANID += '<tr><td>';
                            for (var e = 0; e < json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[2].EVENTS.length; e++) {
                                strPFALLHoverSPANID += i18n.FALL+" #";
                                strPFALLHoverSPANID += (e + 1);
                                strPFALLHoverSPANID += "<br> &nbsp;&nbsp;";
                                strPFALLHoverSPANID += json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[2].EVENTS[e].EVENT_DISP;
                                strPFALLHoverSPANID += "<br> &nbsp;&nbsp ";
                                strPFALLHoverSPANID += json_data13.PFALLREPLY.PATIENTS[intCounter].PFALL[2].EVENTS[e].EVENT_RESULT;
                                strPFALLHoverSPANID += "<br>";
                            }
                            strPFALLHoverSPANID += '</td></tr>';
                            //Half Filled Circle
                            strPFALLCircle = tempValue;
                            break;
                        default:
                            tempValue += "N/A";
                            strPFALLCircle = tempValue;
                            strPFALLHoverSPANID += '';
                            break;
                    }
                    //Build Hovers.
                    //Assessment
                    strAssessmentHoverSPANID += '</table>';
                    strAssessmentHoverText += '<span id="'
                    strAssessmentHoverText += strAssessmentHoverSPANID;
                    strAssessmentHoverText += '"';
                    strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                    strAssessmentHoverText += '">';
                    strAssessmentHoverText += strAssessmentCircle;
                    strAssessmentHoverText += '</span>';
                    //Interventions
                    strInterventionsHoverSPANID += '</table>';
                    strInterventionsHoverText += '<span id="'
                    strInterventionsHoverText += strInterventionsHoverSPANID;
                    strInterventionsHoverText += '"';
                    strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                    strInterventionsHoverText += '">';
                    strInterventionsHoverText += strInterventionsCircle;
                    strInterventionsHoverText += '</span>';
                    //PFALL
                    strPFALLHoverSPANID += '</table>';
                    strPFALLHoverText += '<span id="'
                    strPFALLHoverText += strPFALLHoverSPANID;
                    strPFALLHoverText += '"';
                    strPFALLHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strPFALLHoverText += "'gentooltip',this.id,0,0);";
                    strPFALLHoverText += '">';
                    strPFALLHoverText += strPFALLCircle;
                    strPFALLHoverText += '</span>';

                    //Build Cells.
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;

                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[pfallCell];
                        tempValueX.innerHTML = strAssessmentHoverText;
                    }
                    oPatData = AddToOPatData(strAssessmentHoverText,oPatData,'FallsPediatric',pedFallsSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(pfallCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strInterventionsHoverText;
                    }
                    oPatData = AddToOPatData(strInterventionsHoverText,oPatData,'FallsPediatric',pedFallsSbHdrDispArray[1]);
                    //PFALL
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(pfallCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strPFALLHoverText;
                    }
                    oPatData = AddToOPatData(strPFALLHoverText,oPatData,'FallsPediatric',pedFallsSbHdrDispArray[2]);
                }
                else {
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[pfallCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'FallsPediatric',pedFallsSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(pfallCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'FallsPediatric',pedFallsSbHdrDispArray[1]);
                    //PFALL
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(pfallCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'FallsPediatric',pedFallsSbHdrDispArray[2]);
                }
            }//oPatData check
        }
        blnFallsPedDisplayed = true;
    }
    catch (error) {
        showErrorMessage(error.message, "fillFallsPediatric", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Gets the Falls Pediatric JSON structure.
 */
function getFallsPediatric(){
    var qmReqObject = "";
    var blnLoadFallsPediatric = true;
    var cclParam = "";
    var strErrorMessage = "An error has occurred when getting data for Falls - Pediatric.";
    var strFallsPediatric = "";
    var intSectionIndicator = 0;
    var cclProg = "dc_mp_lh_fall_ped";

    try {
        if (requestAsync) {
            //A request is in progress, so don't make another one.
        }
        else {
            //Display Load Text.
            displayLoadText("pfall");

            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1) {
                intSectionIndicator = json_data2.PTREPLY.PFALLIND;
                //Verify the indicator.
                //0 = The JSON object is NOT complete.
                //1 = The JSON object is complete.
                if (intSectionIndicator == 1) {
                    //Load responses text into object.
                    strFallsPediatric = json_data2.PTREPLY.PFALLJSON;
                    json_data13 = JSON.parse(strFallsPediatric);
                }
                //Load Falls Pediatric JSON.
                blnFallsPediatricCalled = true;
                blnLoadFallsPediatric = expandCollapseFallsPediatric();
                //Hide Load Text.
                setTimeout("hideLoadText()",hideLoadTextDelay);
                //This flag is used in the function getExpandedTimer.
                intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
            }
            else {
                //Build JSON String.
                qmReqObject += '{"QMREQ":{"PRSNLID":';
                qmReqObject += userPersonID;
                qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
                qmReqObject += devLocation;
                qmReqObject += ',"APPID":';
                qmReqObject += applicationID;
                qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":';
                qmReqObject += selectedID;
                qmReqObject += ',"PTLISTTYPE":';
                qmReqObject += ptListType;
                qmReqObject += ',"PTLISTLOCCD":';
                qmReqObject += ptListLoccd;
                qmReqObject += ',"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
                qmReqObject += ',"LIST":['
                qmReqObject += strPatientDemog;
                qmReqObject += ']}}';

                //Build the parameters for getting the Patients.
                cclParam = "'MINE'" + ",'" + qmReqObject + "'";

                requestAsync = getXMLCclRequest();
                requestAsync.onreadystatechange = function(){
                    if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                        if (requestAsync.responseText > " ") {
                            try {
                                //Load responses text into object.
                                json_data13 = JSON.parse(requestAsync.responseText);
                            }
                            catch (error) {
                                //Hide Load Text.
                                setTimeout("hideLoadText()",hideLoadTextDelay);
                                showErrorMessage(error.message, "getFallsPediatric", requestAsync.status, cclParam);
                                return false;
                            }
                            //Load Falls Pediatric JSON.
                            blnFallsPediatricCalled = true;
                            blnLoadFallsPediatric = expandCollapseFallsPediatric();
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //This flag is used in the function getExpandedTimer.
                            intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
                        }
                        requestAsync = null;
                    }
                    else
                        if (requestAsync.readyState == 4 && requestAsync.readyState != 200) {
                        //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //Set Error Message.
                            showErrorMessage(strErrorMessage, "getFallsPediatric", requestAsync.status, cclParam);
                            return false;
                        }
                };
                //Sends the request to the CCL server.
                if (location.protocol.substr(0, 4) == "http") {
                    var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
                    requestAsync.open("POST", url);
                    requestAsync.send(cclParam);
                }
                else {
                    requestAsync.open("POST", cclProg);
                    requestAsync.send(cclParam);
                }
            }
        }
    }
    catch (error) {
        //Hide Load Text.
        setTimeout("hideLoadText()",hideLoadTextDelay);
        showErrorMessage(error.message, "getFallsPediatric", "", cclParam);
    }
}

/**
 * Gets the Pain JSON structure.
 */
function getPain(){
    var qmReqObject = "";
    var blnLoadPain = true;
    var cclParam = "";
    var strErrorMessage = "An error has occurred when getting data for Pain.";
    var strPain = "";
    var intSectionIndicator = 0;
    var cclProg = "dc_mp_get_lh_pain";

    try {
        if (requestAsync) {
            //A request is in progress, so don't make another one.
        }
        else {
            //Display Load Text.
            displayLoadText("pain");

            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1) {
                intSectionIndicator = json_data2.PTREPLY.PAININD;
                //Verify the indicator.
                //0 = The JSON object is NOT complete.
                //1 = The JSON object is complete.
                if (intSectionIndicator == 1) {
                    //Load responses text into object.
                    strPain = json_data2.PTREPLY.PAINJSON;
                    json_data15 = JSON.parse(strPain);
                }
                //Load Pain JSON.
                blnPainCalled = true;
                blnLoadPain = expandCollapsePain();
                //Hide Load Text.
                setTimeout("hideLoadText()",hideLoadTextDelay);
                //This flag is used in the function getExpandedTimer.
                intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
            }
            else {
                //Build JSON String.
                qmReqObject += '{"QMREQ":{"PRSNLID":';
                qmReqObject += userPersonID;
                qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
                qmReqObject += devLocation;
                qmReqObject += ',"APPID":';
                qmReqObject += applicationID;
                qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":';
                qmReqObject += selectedID;
                qmReqObject += ',"PTLISTTYPE":';
                qmReqObject += ptListType;
                qmReqObject += ',"PTLISTLOCCD":';
                qmReqObject += ptListLoccd;
                qmReqObject += ',"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
                qmReqObject += ',"LIST":['
                qmReqObject += strPatientDemog;
                qmReqObject += ']}}';

                //Build the parameters for getting the Patients.
                cclParam = "'MINE'" + ",'" + qmReqObject + "'";

                requestAsync = getXMLCclRequest();
                requestAsync.onreadystatechange = function(){
                    if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                        if (requestAsync.responseText > " ") {
                            try {
                                //Load responses text into object.
                                json_data15 = JSON.parse(requestAsync.responseText);
                            }
                            catch (error) {
                                //Hide Load Text.
                                setTimeout("hideLoadText()",hideLoadTextDelay);
                                showErrorMessage(error.message, "getPain", requestAsync.status, cclParam);
                                return false;
                            }
                            //Load Pain JSON.
                            blnPainCalled = true;
                            blnLoadPain = expandCollapsePain();
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //This flag is used in the function getExpandedTimer.
                            intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
                        }
                        requestAsync = null;
                    }
                    else
                        if (requestAsync.readyState == 4 && requestAsync.readyState != 200) {
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //Set Error Message.
                            showErrorMessage(strErrorMessage, "getPain", requestAsync.status, cclParam);
                            return false;
                        }
                };
                //Sends the request to the CCL server.
                if (location.protocol.substr(0, 4) == "http") {
                    var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
                    requestAsync.open("POST", url);
                    requestAsync.send(cclParam);
                }
                else {
                    requestAsync.open("POST", cclProg);
                    requestAsync.send(cclParam);
                }
            }
        }
    }
    catch (error) {
        //Hide Load Text.
        setTimeout("hideLoadText()",hideLoadTextDelay);
        showErrorMessage(error.message, "getPain", "", cclParam);
    }
}

/**
 * Expands or collapses the section Pain. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function expandCollapsePain(){
    var intHiddenValue = 0;
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var content = "";
    var tempTotalValue = 0;
    var blnStatus = true;
    var tempTotalHiddenRows = 0;
    var table = "";
    var intCounter = 0;
    var rowsPageOne = 0;
    var rowsToBuild = 0;

    try {

        if (currentPage == pageCNT && !bExpLastPage)
        {
            displayPreviousPage();
            bExpLastPage = true;
            //return blnStatus;
        }
        //Verify if the Pain JSON structure has been built.
        //True = has already been called.
        //False = has not been called.
        if (blnPainCalled == false) {
            //Change Hidden Value.
            hiddenPainExpandCollapse = 1;
            getPain();
        }
        else {
            if (pageCNT == 1)
            {
                //currentPage = pageCNT;
                rowsPageOne = parseInt(GetNumPgRecords());
                //currentPage = 0;
                if (rowsPageOne < rowTotal)
                {rowsToBuild = rowsPageOne;}
                else{rowsToBuild = rowTotal;}
            }
            else
            {
                rowsToBuild = parseInt(GetNumPgRecords());
            }

            //Calculate how many rows we are going to hide and add 1 extra to inlcude the last row.
            tempTotalValue = parseInt(PgRecTotal) + parseInt(1);
            //Get hidden value.
            intHiddenValue = hiddenPainExpandCollapse;
            //Get name of table.
            table = document.getElementById("hdrtable2");

            //0 = make the section collapsed.
            //1 = make the section expanded.
            if (intHiddenValue == 0) {
                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Change Hidden Value.
                hiddenPainExpandCollapse = 1;

                //Change size of Table 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120)) + hdrtableWdthAdj;
                intCurrentTableWidth = parseInt(intCurrentTableWidth) - parseInt(intSubtractWidth) + parseInt(40);

                document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth);
                document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth);

                //Main Header
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[painIndicator].colSpan = 1;
                document.getElementById('secpatlisthdrPain').style.width = "40px";
                document.getElementById('secpatlisthdrPain').className = "tabhdrs2g";
                document.getElementById('secpatlisthdrPain').innerHTML = '<div id="divPaintext" title="'+i18n.condDisp.EXP_PAIN_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapsePain();">+</div>';

                //Sub Headers
                //Assessment
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[1].cells;
                tempValue[painCell].colSpan = "1";
                document.getElementById('secsubcolPain1').style.width = "40px";
                document.getElementById('secsubcolPain1').className = "tabhdrs2g";
                document.getElementById('secsubcolPain1').style.display = "";
                document.getElementById('secsubcolPain1').innerHTML = "";
                //Interventions
                content = "";
                tempValue = "";
                tempValue = "secsubcolPain2";
                content = document.getElementById(tempValue);
                content.style.width = "0px";
                content.style.display = "none";
                content.innerHTML = "";

                //Pain
                content = "";
                tempValue = "";
                tempValue = "secsubcolPain3";
                content = document.getElementById(tempValue);
                content.style.width = "0px";
                content.style.display = "none";
                content.innerHTML = "";


                //Table 2 rows.
                for (var i = 1; i < (rowsToBuild+1); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        table.rows[intCounter].cells[painCell].style.width = "40px";
                        table.rows[intCounter].cells[painCell].className = "tabhdrsVertical";
                        table.rows[intCounter].cells[painCell].style.display = "";
                        table.rows[intCounter].cells[painCell].innerHTML = "Pain";
                    }
                    else {
                        //Assessment
                        table.rows[intCounter].cells[painCell].style.width = "0px";
                        table.rows[intCounter].cells[painCell].style.display = "none";
                        table.rows[intCounter].cells[painCell].innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue += "patientInterventionPain";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";

                    //Pain
                    tempValue = "";
                    tempValue += "patientPainPain";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";


                    //Add 2 to the counter.
                    intCounter = intCounter + 2;
                }
                //Add the rowspan.
                table.rows[0].cells[painCell].rowSpan = rowSpanCounter;
            }
            else {
                displayLoadText("pain");
                //Change Hidden Value.
                hiddenPainExpandCollapse = 0;

                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Calculate size of Tables 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120));
                intCurrentTableWidth = parseInt(intCurrentTableWidth) + parseInt(intSubtractWidth) - parseInt(40);

                //Reset global variables.
                hdrTableWidth = intCurrentTableWidth;
                hdrTable2Width = intCurrentTableWidth;

                //Set size of Tables 1 and 2.
                document.getElementById("hdrtable").width = parseInt(hdrTableWidth) + hdrtableWdthAdj;
                document.getElementById("hdrtable2").width = parseInt(hdrTable2Width) + hdrtableWdthAdj;

                //Main Header.
                tempValue = "";
                tempValue = "secpatlisthdrPain";
                document.getElementById(tempValue).style.width = "360px";
                document.getElementById(tempValue).className = "tabhdrs";
                document.getElementById(tempValue).style.display = "";
                document.getElementById(tempValue).innerHTML = '<div id="divPaintext" title="'+i18n.condDisp.COLLAPSE_PAIN_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapsePain();">- Pain</div>';

                //Change colspan and rowspan
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[painIndicator].colSpan = 3;
                table.rows[0].cells[painCell].rowSpan = 1;
                table.rows[0].cells[painCell].className = "demcell";
                table.rows[0].cells[painCell].style.display = "";
                table.rows[0].cells[painCell].innerHTML = "";

                //Sub Headers
                //Assessment
                document.getElementById('secsubcolPain1').style.width = "120px";
                document.getElementById('secsubcolPain1').className = "subhdrs";
                document.getElementById('secsubcolPain1').style.display = "";
                document.getElementById('secsubcolPain1').innerHTML = "Assessment";
                //Interventions
                document.getElementById('secsubcolPain2').style.width = "120px";
                document.getElementById('secsubcolPain2').className = "subhdrs";
                document.getElementById('secsubcolPain2').style.display = "";
                document.getElementById('secsubcolPain2').innerHTML = "Interventions";
                //Pain
                document.getElementById('secsubcolPain3').style.width = "120px";
                document.getElementById('secsubcolPain3').className = "subhdrs";
                document.getElementById('secsubcolPain3').style.display = "";
                document.getElementById('secsubcolPain3').innerHTML = "Pain";

                //Table 2 rows.
                for (var i = 1; i < (rowsToBuild+1); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellPainRowSpan";
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellPainRowSpan" + i;
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue += "patientInterventionPain";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                    //Pain
                    tempValue = "";
                    tempValue += "patientPainPain";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                }

                //Verify if this is the first time the section is called.
                if (blnFirstTimePain == true) {
                    //Change flag.
                    blnFirstTimePain = false;
                }

                //Verify which value the patient indicator has.
                //0 = Both qualifying and non qualifying patients.
                //1 = Only qualifying patients.
                if (strPtQualind == 1) {
                    //Fill the cells with values.
                    blnStatus = fillPainQualifying();
                }
                else {
                    //Fill the cells with values.
                    blnStatus = fillPain();
                }
            }
        }
        if (bExpLastPage)
        {
            displayNextPage();
            bExpLastPage = false;
        }
    }
    catch (error) {
        showErrorMessage(error.message, "expandCollapsePain", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Pain with only qualifying values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillPainQualifying(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strEventType = "";
    var strEventName = "";
    var strEventStatus = "";
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strPainHoverText = "";
    var strPainHoverSPANID = "";
    var strTMIND = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strPainCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intPainCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var strEventDTDisp = "";
    var tempPageNum = 0;
    var strPtQualEncounterID = 0;
    var strPtQualPatientID = 0;
    var intSectionIndicator = 0;
    var nUniqueRowId = 0;
    var lastPatId = "";

    try {
        //Get Indicator.
        intSectionIndicator = json_data2.PTREPLY.PAININD;

        //Verify the indicator.
        //0 = The JSON object is NOT complete.
        //1 = The JSON object is complete.
        if (intSectionIndicator == 0) {
            for (var i=0;j=patData.length,i<j; i++)
            {
                var oPatData = patData[i];

                nUniqueRowId++;

                //Reset variables.
                tempString = "";
                tempString += 'patEncounter';
                tempString += nUniqueRowId;

                //Assessment
                oPatData = PopulateSection('Pain',"N/A",tempString,oPatData,painSbHdrDispArray[0]);

                //LineDays
                oPatData = PopulateSection('Pain',"N/A",tempString,oPatData,painSbHdrDispArray[1]);

                //CRI
                oPatData = PopulateSection('Pain',"N/A",tempString,oPatData,painSbHdrDispArray[2]);
            }
        }
        else {
            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < json_data15.APMREPLY.LIST.length; intCounter++) {
                //Reset variables.
                patientEncounterID = 0;
                ptQual = 0;
                tempValueX = "";
                tempValueY = "";
                tempString = "";
                pwStatus = "";
                pwName = "";
                strAssessmentHoverText = "";
                strAssessmentHoverSPANID = "";
                strInterventionsHoverText = "";
                strInterventionsHoverSPANID = "";
                strPainHoverText = "";
                strPainHoverSPANID = "";
                patientName = "";
                patientID = "";
                strAssessmentCircle = "";
                strInterventionsCircle = "";
                strPainCircle = "";
                intAssessmentCircle = 0;
                intInterventionsCircle = 0;
                intPainCircle = 0;

                patientEncounterID = json_data15.APMREPLY.LIST[intCounter].EID;
                patientID = json_data15.APMREPLY.LIST[intCounter].PID;

                lastPatId = patientID;
                var oPatData = null;
                var objIdx = getPatObjIdxByEnctr(patientEncounterID)

                if (objIdx != null)//meaning the encounter was found
                {
                    oPatData = patData[objIdx];

                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                    ptQual = json_data15.APMREPLY.LIST[intCounter].PTQUAL;
                    patientName = json_data15.APMREPLY.LIST[intCounter].NAME;
                    pwStatus = json_data15.APMREPLY.LIST[intCounter].PWSTATUS;
                    pwName = json_data15.APMREPLY.LIST[intCounter].PWNAME;
                    intAssessmentCircle = json_data15.APMREPLY.LIST[intCounter].ASSESSSTAT;
                    intInterventionsCircle = json_data15.APMREPLY.LIST[intCounter].INTERVSTAT;
                    intPainCircle = json_data15.APMREPLY.LIST[intCounter].PAINSTAT;

                    //Verify if the patient name consist of " or ' characters.
                    //^^ = "
                    //^ = '
                    if (patientName.indexOf("^^") > -1) {
                        patientName = patientName.replace("^^", "&#34;");
                    }
                    if (patientName.indexOf("^") > -1) {
                        patientName = patientName.replace("^", "&#39;");
                    }

                    //Set link
                    alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                    " title='"+i18n.OPEN_CHART +
                    patientName + i18n.TO_DOCUMENT_INFO +"' class='LinkText'>";

                    //Verify if PTQUAL is greater than 0.
                    if (ptQual > 0) {
                        //Verify which icon that is going to be displayed in the column.
                        //Assessment
                        //0 = Not Done
                        //1 = Not done 24timed
                        //2 = Met
                        //4 = Not done timed 4hr
                        //Reset variables.
                        tempValue = "";
                        tempValue2 = "";
                        switch (intAssessmentCircle) {
                            case 0:
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strAssessmentCircle = tempValue;
                                break;
                            case 1:
                                //Empty Circle and Alarm Clock
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                tempValue2 += "<img src='";
                                tempValue2 += imagepath;
                                tempValue2 += img4798_16;
                                tempValue2 += "'/>";

                                strAssessmentCircle += tempValue;
                                strAssessmentCircle += tempValue2;
                                break;
                            case 2:
                                //Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                strAssessmentCircle = tempValue;
                                break;
                            case 4:
                                //Empty Circle and Alarm Clock
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                tempValue2 += "<img src='";
                                tempValue2 += imagepath;
                                tempValue2 += img4798_16;
                                tempValue2 += "'/>";

                                strAssessmentCircle += tempValue;
                                strAssessmentCircle += tempValue2;
                                break;
                        }
                        //Interventions
                        //0 = NA
                        //1 = Not done
                        //2 = Complete
                        //Reset variable
                        tempValue = "";
                        switch (intInterventionsCircle) {
                            case 0:
                                strInterventionsCircle = "N/A";
                                break;
                            case 1:
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strInterventionsCircle = tempValue;
                                break;
                            case 2:
                                //Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                strInterventionsCircle = tempValue;
                                break;
                        }
                        //Pain
                        //0 = NA
                        //1 = Incident icon
                        //Reset variable
                        tempValue = "";
                        switch (intPainCircle) {
                            case 0:
                                strPainCircle = "N/A";
                                break;
                            case 1:
                                //Red Triangle with White Exclamation Mark
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img6047_16;
                                tempValue += "' />";
                                strPainCircle = tempValue;
                                break;
                        }

                        //Build Hovers.
                        //Assessment
                        strAssessmentHoverSPANID += '<table>';
                        //Interventions
                        if (intInterventionsCircle > 0) {
                            strInterventionsHoverSPANID += '<table>';
                        }
                        //Pain
                        if (intPainCircle > 0) {
                            strPainHoverSPANID += '<table>';
                            strPainHoverSPANID += "<tr><td colspan='2'><b><u>Outcome</u></b></td></tr>";
                        }

                        //Reset variables.
                        strEventType = "";
                        strEventName = "";
                        strTMIND = "";
                        strEventStatus = "";
                        tempValue = "";
                        tempValue2 = "";

                        //Assessment
                        //0 = Not Done
                        //1 = Not done 24timed
                        //2 = Met
                        //4 = Not done timed 4hr
                        //switch (strEventStatus)
                        switch (intAssessmentCircle) {
                            case 0:
                                strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED;
                                break;
                            case 1:
                                strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED_WITHIN_24;
                                break;
                            case 2:
                                strEventName = i18n.PAIN_ASSESS_DOCUMENTED;
                                break;
                            case 4:
                                strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED_WITHIN_4;
                                break;
                        }
                        //Build Hover
                        strAssessmentHoverSPANID += '<tr>';
                        strAssessmentHoverSPANID += '<td>';
                        strAssessmentHoverSPANID += strEventName;
                        strAssessmentHoverSPANID += '</td>';
                        strAssessmentHoverSPANID += '</tr>';

                        //Reset variables.
                        strEventType = "";
                        strEventName = "";
                        strTMIND = "";
                        strEventStatus = "";
                        tempValue = "";
                        tempValue2 = "";

                        //Interventions
                        //0 = NA
                        //1 = Not done
                        //2 = Complete
                        switch (intInterventionsCircle) {
                            case 0:
                                strEventName = "";
                                break;
                            case 1:
                                strEventName = i18n.PATIENT_AT_RISK_FOR_PAIN_NO_PLAN;
                                break;
                            case 2:
                                strEventName = i18n.PATIENT_AT_RISK_FOR_PAIN_WITH_PLAN;
                                break;
                        }
                        //Build Hover
                        strInterventionsHoverSPANID += '<tr>';
                        strInterventionsHoverSPANID += '<td>';
                        strInterventionsHoverSPANID += strEventName;
                        strInterventionsHoverSPANID += '</td>';
                        strInterventionsHoverSPANID += '</tr>';

                        //Loop through the EVENTS.
                        for (var intCounter2 = 0; intCounter2 < json_data15.APMREPLY.LIST[intCounter].EVENTS.length; intCounter2++) {
                            //Reset variables.
                            strEventType = "";
                            strEventName = "";
                            strTMIND = "";
                            strEventStatus = "";
                            tempValue = "";
                            tempValue2 = "";
                            strEventDTDisp = "";

                            strEventType = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].TYPE;
                            strEventName = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].NAME;
                            strTMIND = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].TMIND;
                            strEventStatus = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].EVENT_STATUS;
                            strStatusDisp = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].STATUSDISP;
                            strEventDTDisp = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].EVENTDTDISP;

                            //Verify TYPE.
                            switch (strEventType.toUpperCase()) {
                                case "PAIN":
                                    //Build Hover
                                    strPainHoverSPANID += '<tr>';
                                    strPainHoverSPANID += '<td>';
                                    strPainHoverSPANID += strEventName;
                                    strPainHoverSPANID += ' ';
                                    strPainHoverSPANID += strEventDTDisp;
                                    strPainHoverSPANID += '</td>';
                                    strPainHoverSPANID += '</tr>';
                                    break;
                            }
                        }

                        //Build Hovers.
                        //Assessment
                        strAssessmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strAssessmentHoverSPANID += "<tr><td colspan='2'>";
                        strAssessmentHoverSPANID += alink;
                        strAssessmentHoverSPANID += patientName;
                        strAssessmentHoverSPANID += '</a>';
                        strAssessmentHoverSPANID += '</td></tr>';
                        strAssessmentHoverSPANID += '</table>';
                        strAssessmentHoverText += '<span id="'
                        strAssessmentHoverText += strAssessmentHoverSPANID;
                        strAssessmentHoverText += '"';
                        strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                        strAssessmentHoverText += '">';
                        strAssessmentHoverText += strAssessmentCircle;
                        strAssessmentHoverText += '</span>';
                        //Interventions
                        if (intInterventionsCircle > 0) {
                            strInterventionsHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                            strInterventionsHoverSPANID += "<tr><td colspan='2'>"
                            strInterventionsHoverSPANID += alink;
                            strInterventionsHoverSPANID += patientName;
                            strInterventionsHoverSPANID += '</a>';
                            strInterventionsHoverSPANID += '</td></tr>';
                            strInterventionsHoverSPANID += '</table>';
                            strInterventionsHoverText += '<span id="'
                            strInterventionsHoverText += strInterventionsHoverSPANID;
                            strInterventionsHoverText += '"';
                            strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                            strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                            strInterventionsHoverText += '">';
                            strInterventionsHoverText += strInterventionsCircle;
                            strInterventionsHoverText += '</span>';
                        }
                        else {
                            strInterventionsHoverText += '<span id="'
                            strInterventionsHoverText += strInterventionsHoverSPANID;
                            strInterventionsHoverText += '">';
                            strInterventionsHoverText += strInterventionsCircle;
                            strInterventionsHoverText += '</span>';
                        }
                        //Pain
                        if (intPainCircle > 0) {
                            strPainHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                            strPainHoverSPANID += "<tr><td colspan='2'>"
                            strPainHoverSPANID += alink;
                            strPainHoverSPANID += patientName;
                            strPainHoverSPANID += '</a>';
                            strPainHoverSPANID += '</td></tr>';
                            strPainHoverSPANID += '</table>';
                            strPainHoverText += '<span id="'
                            strPainHoverText += strPainHoverSPANID;
                            strPainHoverText += '"';
                            strPainHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                            strPainHoverText += "'gentooltip',this.id,0,0);";
                            strPainHoverText += '">';
                            strPainHoverText += strPainCircle;
                            strPainHoverText += '</span>';
                        }
                        else {
                            strPainHoverText += '<span id="'
                            strPainHoverText += strPainHoverSPANID;
                            strPainHoverText += '">';
                            strPainHoverText += strPainCircle;
                            strPainHoverText += '</span>';
                        }

                        //Build Cells.

                        //Reset variables.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += patientEncounterID;

                        //Assessment
                        oPatData = PopulateSection('Pain',strAssessmentHoverText,tempString,oPatData,painSbHdrDispArray[0]);

                        //Interventions
                        oPatData = PopulateSection('Pain',strInterventionsHoverText,tempString,oPatData,painSbHdrDispArray[1]);

                        //Pain
                        oPatData = PopulateSection('Pain',strPainHoverText,tempString,oPatData,painSbHdrDispArray[2]);
                    }
                    else {
                        //Reset variables.
                        tempValueX = "";
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Assessment
                        oPatData = PopulateSection('Pain',"N/A",tempString,oPatData,painSbHdrDispArray[0]);

                        //Interventions
                        oPatData = PopulateSection('Pain',"N/A",tempString,oPatData,painSbHdrDispArray[1]);

                        //Pain
                        oPatData = PopulateSection('Pain',"N/A",tempString,oPatData,painSbHdrDispArray[2]);

                    }
                }//oPatData check
            }
        } //intSectionIndicator
        SortPatData(lastSortField);
    }
    catch (error) {
        showErrorMessage(error.message, "fillPainQualifying", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Pain with values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillPain(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strEventType = "";
    var strEventName = "";
    var strEventStatus = "";
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strPainHoverText = "";
    var strPainHoverSPANID = "";
    var strTMIND = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strPainCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intPainCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var strEventDTDisp = "";
    var nUniqueRowId = 0;

    try {
        if (blnPainDisplayed)
        {
            PopulatePatientInfo();
            return;
        }
        //Loop through the JSON structure.
        for (var intCounter = 0; intCounter < json_data15.APMREPLY.LIST.length; intCounter++)
        {
            //Reset variables.
            patientEncounterID = 0;
            ptQual = 0;
            tempValueX = "";
            tempValueY = "";
            tempString = "";
            pwStatus = "";
            pwName = "";
            strAssessmentHoverText = "";
            strAssessmentHoverSPANID = "";
            strInterventionsHoverText = "";
            strInterventionsHoverSPANID = "";
            strPainHoverText = "";
            strPainHoverSPANID = "";
            patientName = "";
            patientID = "";
            strAssessmentCircle = "";
            strInterventionsCircle = "";
            strPainCircle = "";
            intAssessmentCircle = 0;
            intInterventionsCircle = 0;
            intPainCircle = 0;

            patientEncounterID = json_data15.APMREPLY.LIST[intCounter].EID;
            ptQual = json_data15.APMREPLY.LIST[intCounter].PTQUAL;
            patientName = json_data15.APMREPLY.LIST[intCounter].NAME;
            patientID = json_data15.APMREPLY.LIST[intCounter].PID;
            pwStatus = json_data15.APMREPLY.LIST[intCounter].PWSTATUS;
            pwName = json_data15.APMREPLY.LIST[intCounter].PWNAME;
            intAssessmentCircle = json_data15.APMREPLY.LIST[intCounter].ASSESSSTAT;
            intInterventionsCircle = json_data15.APMREPLY.LIST[intCounter].INTERVSTAT;
            intPainCircle = json_data15.APMREPLY.LIST[intCounter].PAINSTAT;

            var oPatData = null;
            var objIdx = getPatObjIdxByEnctr(patientEncounterID);

            if (objIdx != null)
            {
                oPatData = patData[objIdx];

                if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                //Verify if the patient name consist of " or ' characters.
                //^^ = "
                //^ = '
                if (patientName.indexOf("^^") > -1) {
                    patientName = patientName.replace("^^", "&#34;");
                }
                if (patientName.indexOf("^") > -1) {
                    patientName = patientName.replace("^", "&#39;");
                }

                //Set link
                alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                " title='"+i18n.OPEN_CHART +
                patientName + i18n.TO_DOCUMENT_INFO + "' class='LinkText'>";

                //Verify if PTQUAL is greater than 0.
                if (ptQual > 0) {
                    //Verify which icon that is going to be displayed in the column.
                    //Assessment
                    //0 = Not Done
                    //1 = Not done 24timed
                    //2 = Met
                    //4 = Not done timed 4hr
                    //Reset variables.
                    tempValue = "";
                    tempValue2 = "";
                    switch (intAssessmentCircle) {
                        case 0:
                            //Empty Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            strAssessmentCircle = tempValue;
                            break;
                        case 1:
                            //Empty Circle and Alarm Clock
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            tempValue2 += "<img src='";
                            tempValue2 += imagepath;
                            tempValue2 += img4798_16;
                            tempValue2 += "'/>";

                            strAssessmentCircle += tempValue;
                            strAssessmentCircle += tempValue2;
                            break;
                        case 2:
                            //Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            strAssessmentCircle = tempValue;
                            break;
                        case 4:
                            //Empty Circle and Alarm Clock
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            tempValue2 += "<img src='";
                            tempValue2 += imagepath;
                            tempValue2 += img4798_16;
                            tempValue2 += "'/>";

                            strAssessmentCircle += tempValue;
                            strAssessmentCircle += tempValue2;
                            break;
                    }
                    //Interventions
                    //0 = NA
                    //1 = Not done
                    //2 = Complete
                    //Reset variable
                    tempValue = "";
                    switch (intInterventionsCircle) {
                        case 0:
                            strInterventionsCircle = "N/A";
                            break;
                        case 1:
                            //Empty Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            strInterventionsCircle = tempValue;
                            break;
                        case 2:
                            //Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            strInterventionsCircle = tempValue;
                            break;
                    }
                    //Pain
                    //0 = NA
                    //1 = Incident icon
                    //Reset variable
                    tempValue = "";
                    switch (intPainCircle) {
                        case 0:
                            strPainCircle = "N/A";
                            break;
                        case 1:
                            //Red Triangle with White Exclamation Mark
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img6047_16;
                            tempValue += "' />";
                            strPainCircle = tempValue;
                            break;
                    }

                    //Build Hovers.
                    //Assessment
                    strAssessmentHoverSPANID += '<table>';
                    //Interventions
                    if (intInterventionsCircle > 0) {
                        strInterventionsHoverSPANID += '<table>';
                    }
                    //Pain
                    if (intPainCircle > 0) {
                        strPainHoverSPANID += '<table>';
                        strPainHoverSPANID += "<tr><td colspan='2'><b><u>Outcome</u></b></td></tr>";
                    }

                    //Reset variables.
                    strEventType = "";
                    strEventName = "";
                    strTMIND = "";
                    strEventStatus = "";
                    tempValue = "";
                    tempValue2 = "";

                    //Assessment
                    //0 = Not Done
                    //1 = Not done 24timed
                    //2 = Met
                    //4 = Not done timed 4hr
                    //switch (strEventStatus)
                    switch (intAssessmentCircle) {
                        case 0:
                            strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED;
                            break;
                        case 1:
                            strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED_WITHIN_24;
                            break;
                        case 2:
                            strEventName = i18n.PAIN_ASSESS_DOCUMENTED;
                            break;
                        case 4:
                            strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED_WITHIN_4;
                            break;
                    }
                    //Build Hover
                    strAssessmentHoverSPANID += '<tr>';
                    strAssessmentHoverSPANID += '<td>';
                    strAssessmentHoverSPANID += strEventName;
                    strAssessmentHoverSPANID += '</td>';
                    strAssessmentHoverSPANID += '</tr>';

                    //Reset variables.
                    strEventType = "";
                    strEventName = "";
                    strTMIND = "";
                    strEventStatus = "";
                    tempValue = "";
                    tempValue2 = "";

                    //Interventions
                    //0 = NA
                    //1 = Not done
                    //2 = Complete
                    switch (intInterventionsCircle) {
                        case 0:
                            strEventName = "";
                            break;
                        case 1:
                            strEventName = i18n.PATIENT_AT_RISK_FOR_PAIN_NO_PLAN;
                            break;
                        case 2:
                            strEventName = i18n.PATIENT_AT_RISK_FOR_PAIN_WITH_PLAN;
                            break;
                    }
                    //Build Hover
                    strInterventionsHoverSPANID += '<tr>';
                    strInterventionsHoverSPANID += '<td>';
                    strInterventionsHoverSPANID += strEventName;
                    strInterventionsHoverSPANID += '</td>';
                    strInterventionsHoverSPANID += '</tr>';

                    //Loop through the EVENTS.
                    for (var intCounter2 = 0; intCounter2 < json_data15.APMREPLY.LIST[intCounter].EVENTS.length; intCounter2++) {
                        //Reset variables.
                        strEventType = "";
                        strEventName = "";
                        strTMIND = "";
                        strEventStatus = "";
                        tempValue = "";
                        tempValue2 = "";
                        strEventDTDisp = "";

                        strEventType = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].TYPE;
                        strEventName = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].NAME;
                        strTMIND = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].TMIND;
                        strEventStatus = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].EVENT_STATUS;
                        strStatusDisp = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].STATUSDISP;
                        strEventDTDisp = json_data15.APMREPLY.LIST[intCounter].EVENTS[intCounter2].EVENTDTDISP;

                        //Verify TYPE.
                        switch (strEventType.toUpperCase()) {
                            case "PAIN":
                                //Build Hover
                                strPainHoverSPANID += '<tr>';
                                strPainHoverSPANID += '<td>';
                                strPainHoverSPANID += strEventName;
                                strPainHoverSPANID += ' ';
                                strPainHoverSPANID += strEventDTDisp;
                                strPainHoverSPANID += '</td>';
                                strPainHoverSPANID += '</tr>';
                                break;
                        }
                    }

                    //Build Hovers.
                    //Assessment
                    strAssessmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                    strAssessmentHoverSPANID += "<tr><td colspan='2'>";
                    strAssessmentHoverSPANID += alink;
                    strAssessmentHoverSPANID += patientName;
                    strAssessmentHoverSPANID += '</a>';
                    strAssessmentHoverSPANID += '</td></tr>';
                    strAssessmentHoverSPANID += '</table>';
                    strAssessmentHoverText += '<span id="'
                    strAssessmentHoverText += strAssessmentHoverSPANID;
                    strAssessmentHoverText += '"';
                    strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                    strAssessmentHoverText += '">';
                    strAssessmentHoverText += strAssessmentCircle;
                    strAssessmentHoverText += '</span>';
                    //Interventions
                    if (intInterventionsCircle > 0) {
                        strInterventionsHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strInterventionsHoverSPANID += "<tr><td colspan='2'>"
                        strInterventionsHoverSPANID += alink;
                        strInterventionsHoverSPANID += patientName;
                        strInterventionsHoverSPANID += '</a>';
                        strInterventionsHoverSPANID += '</td></tr>';
                        strInterventionsHoverSPANID += '</table>';
                        strInterventionsHoverText += '<span id="'
                        strInterventionsHoverText += strInterventionsHoverSPANID;
                        strInterventionsHoverText += '"';
                        strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                        strInterventionsHoverText += '">';
                        strInterventionsHoverText += strInterventionsCircle;
                        strInterventionsHoverText += '</span>';
                    }
                    else {
                        strInterventionsHoverText += '<span id="'
                        strInterventionsHoverText += strInterventionsHoverSPANID;
                        strInterventionsHoverText += '">';
                        strInterventionsHoverText += strInterventionsCircle;
                        strInterventionsHoverText += '</span>';
                    }
                    //Pain
                    if (intPainCircle > 0) {
                        strPainHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strPainHoverSPANID += "<tr><td colspan='2'>"
                        strPainHoverSPANID += alink;
                        strPainHoverSPANID += patientName;
                        strPainHoverSPANID += '</a>';
                        strPainHoverSPANID += '</td></tr>';
                        strPainHoverSPANID += '</table>';
                        strPainHoverText += '<span id="'
                        strPainHoverText += strPainHoverSPANID;
                        strPainHoverText += '"';
                        strPainHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strPainHoverText += "'gentooltip',this.id,0,0);";
                        strPainHoverText += '">';
                        strPainHoverText += strPainCircle;
                        strPainHoverText += '</span>';
                    }
                    else {
                        strPainHoverText += '<span id="'
                        strPainHoverText += strPainHoverSPANID;
                        strPainHoverText += '">';
                        strPainHoverText += strPainCircle;
                        strPainHoverText += '</span>';
                    }

                    //Build Cells.
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[painCell];
                        tempValueX.innerHTML = strAssessmentHoverText;
                    }
                    oPatData = AddToOPatData(strAssessmentHoverText,oPatData,'Pain',painSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(painCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strInterventionsHoverText;
                    }
                    oPatData = AddToOPatData(strInterventionsHoverText,oPatData,'Pain',painSbHdrDispArray[1]);
                    //Pain
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(painCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strPainHoverText;
                    }
                    oPatData = AddToOPatData(strPainHoverText,oPatData,'Pain',painSbHdrDispArray[2]);
                }
                else {
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[painCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'Pain',painSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(painCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'Pain',painSbHdrDispArray[1]);
                    //Pain
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(painCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'Pain',painSbHdrDispArray[2]);
                }
            }//oPatData check
        }
        blnPainDisplayed = true;
    }
    catch (error) {
        showErrorMessage(error.message, "fillPain", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Gets the Pain - Pediatric JSON structure.
 */
function getPedPain(){
    var qmReqObject = "";
    var blnLoadPedPain = true;
    var cclParam = "";
    var strErrorMessage = "An error has occurred when getting data for Pain - Pediatric.";
    var strPedPain = "";
    var intSectionIndicator = 0;
    var cclProg = "dc_mp_get_lh_ped_pain";

    try {
        if (requestAsync) {
            //A request is in progress, so don't make another one.
        }
        else {
            //Display Load Text.
            displayLoadText("pedpain");

            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1) {

                intSectionIndicator = json_data2.PTREPLY.PPAININD;
                //Verify the indicator.
                //0 = The JSON object is NOT complete.
                //1 = The JSON object is complete.
                if (intSectionIndicator == 1) {
                    //Load responses text into object.
                    strPedPain = json_data2.PTREPLY.PPAINJSON;
                    json_data16 = JSON.parse(strPedPain);
                }
                //Load Pain - Pediatric JSON.
                blnPedPainCalled = true;
                blnLoadPedPain = expandCollapsePedPain();
                //Hide Load Text.
                setTimeout("hideLoadText()",hideLoadTextDelay);
                //This flag is used in the function getExpandedTimer.
                intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
            }
            else {
                //Build JSON String.
                qmReqObject += '{"QMREQ":{"PRSNLID":';
                qmReqObject += userPersonID;
                qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
                qmReqObject += devLocation;
                qmReqObject += ',"APPID":';
                qmReqObject += applicationID;
                qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":';
                qmReqObject += selectedID;
                qmReqObject += ',"PTLISTTYPE":';
                qmReqObject += ptListType;
                qmReqObject += ',"PTLISTLOCCD":';
                qmReqObject += ptListLoccd;
                qmReqObject += ',"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
                qmReqObject += ',"LIST":['
                qmReqObject += strPatientDemog;
                qmReqObject += ']}}';

                //Build the parameters for getting the Patients.
                cclParam = "'MINE'" + ",'" + qmReqObject + "'";

                requestAsync = getXMLCclRequest();
                requestAsync.onreadystatechange = function(){
                    if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                        if (requestAsync.responseText > " ") {
                            try {
                                //Load responses text into object.
                                json_data16 = JSON.parse(requestAsync.responseText);
                            }
                            catch (error) {
                                //Hide Load Text.
                                setTimeout("hideLoadText()",hideLoadTextDelay);
                                showErrorMessage(error.message, "getPedPain", requestAsync.status, cclParam);
                                return false;
                            }
                            //Load Pain - Pediatric JSON.
                            blnPedPainCalled = true;
                            blnLoadPedPain = expandCollapsePedPain();
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //This flag is used in the function getExpandedTimer.
                            intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
                        }
                        requestAsync = null;
                    }
                    else
                        if (requestAsync.readyState == 4 && requestAsync.readyState != 200) {
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //Set Error Message.
                            showErrorMessage(strErrorMessage, "getPedPain", requestAsync.status, cclParam);
                            return false;
                        }
                };
                //Sends the request to the CCL server.
                if (location.protocol.substr(0, 4) == "http") {
                    var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
                    requestAsync.open("POST", url);
                    requestAsync.send(cclParam);
                }
                else {
                    requestAsync.open("POST", cclProg);
                    requestAsync.send(cclParam);
                }
            }
        }
    }
    catch (error) {
        //Hide Load Text.
        setTimeout("hideLoadText()",hideLoadTextDelay);
        showErrorMessage(error.message, "getPedPain", "", cclParam);
    }
}

/**
 * Expands or collapses the section Pain - Pediatric. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function expandCollapsePedPain(){
    var intHiddenValue = 0;
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var content = "";
    var tempTotalValue = 0;
    var blnStatus = true;
    var tempTotalHiddenRows = 0;
    var table = "";
    var intCounter = 0;
    var rowsPageOne = 0;
    var rowsToBuild = 0;

    try {

        if (currentPage == pageCNT && !bExpLastPage)
        {
            displayPreviousPage();
            bExpLastPage = true;
            //return blnStatus;
        }
        //Verify if the Pain - Pediatric JSON structure has been built.
        //True = has already been called.
        //False = has not been called.
        if (blnPedPainCalled == false) {
            //Change Hidden Value.
            hiddenPedPainExpandCollapse = 1;
            getPedPain();
        }
        else {
            displayLoadText("pedpain");
            //Calculate how many rows we are going to hide and add 1 extra to inlcude the last row.
            tempTotalValue = parseInt(PgRecTotal) + parseInt(1);
            //Get hidden value.
            intHiddenValue = hiddenPedPainExpandCollapse;
            //Get name of table.
            table = document.getElementById("hdrtable2");
            //0 = make the section collapsed.
            //1 = make the section expanded.
            if (intHiddenValue == 0) {

                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Change Hidden Value.
                hiddenPedPainExpandCollapse = 1;

                //Change size of Table 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120)) + hdrtableWdthAdj;
                intCurrentTableWidth = parseInt(intCurrentTableWidth) - parseInt(intSubtractWidth) + parseInt(40);

                document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth);
                document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth);

                //Main Header
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[pedPainIndicator].colSpan = 1;
                document.getElementById('secpatlisthdrPedPain').style.width = "40px";
                document.getElementById('secpatlisthdrPedPain').className = "tabhdrs2g";
                tempStr = i18n.condDisp.EXP_PED_PAIN_HVR.replace("-","&#45;");
                document.getElementById('secpatlisthdrPedPain').innerHTML = '<div id="divPedPaintext" title="'+tempStr+'" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">+</div>';

                //Sub Headers
                //Assessment
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[1].cells;
                tempValue[ppainCell].colSpan = "1";
                document.getElementById('secsubcolPedPain1').style.width = "40px";
                document.getElementById('secsubcolPedPain1').className = "tabhdrs2g";
                document.getElementById('secsubcolPedPain1').style.display = "";
                document.getElementById('secsubcolPedPain1').innerHTML = "";
                //Interventions
                content = "";
                tempValue = "";
                tempValue = "secsubcolPedPain2";
                content = document.getElementById(tempValue);
                content.style.display = "none";
                content.innerHTML = "";
                //Pain
                content = "";
                tempValue = "";
                tempValue = "secsubcolPedPain3";
                content = document.getElementById(tempValue);
                content.style.display = "none";
                content.innerHTML = "";

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        table.rows[intCounter].cells[ppainCell].style.width = "40px";
                        table.rows[intCounter].cells[ppainCell].className = "tabhdrsVertical";
                        table.rows[intCounter].cells[ppainCell].style.display = "";
                        tempStr = i18n.condDisp.PED_PAIN.replace("-","&#45;");
                        table.rows[intCounter].cells[ppainCell].innerHTML = tempStr;
                    }
                    else {
                        //Assessment
                        table.rows[intCounter].cells[ppainCell].style.width = "0px";
                        table.rows[intCounter].cells[ppainCell].style.display = "none";
                        table.rows[intCounter].cells[ppainCell].innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue += "patientInterventionPedPain";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";
                    //Pain
                    tempValue = "";
                    tempValue += "patientPainPedPain";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";

                    //Add 2 to the counter.
                    intCounter = intCounter + 2;
                }
                //Add the rowspan.
                table.rows[0].cells[ppainCell].rowSpan = rowSpanCounter;
            }
            else {
                displayLoadText("pedpain");
                //Change Hidden Value.
                hiddenPedPainExpandCollapse = 0;

                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Calculate size of Tables 1 and 2.
                intSubtractWidth = (parseInt(3) * parseInt(120));
                intCurrentTableWidth = parseInt(intCurrentTableWidth) + parseInt(intSubtractWidth) - parseInt(40);

                //Reset global variables.
                hdrTableWidth = intCurrentTableWidth;
                hdrTable2Width = intCurrentTableWidth;

                //Set size of Tables 1 and 2.
                document.getElementById("hdrtable").width = parseInt(hdrTableWidth) + hdrtableWdthAdj;
                document.getElementById("hdrtable2").width = parseInt(hdrTable2Width) + hdrtableWdthAdj;

                //Main Header.
                tempValue = "";
                tempValue = "secpatlisthdrPedPain";
                document.getElementById(tempValue).style.width = "360px";
                document.getElementById(tempValue).className = "tabhdrs";
                document.getElementById(tempValue).style.display = "";
                tempStr = i18n.condDisp.COLLAPSE_PAIN_PED_HVR.replace("-","&#45;");
                document.getElementById(tempValue).innerHTML = '<div id="divPedPaintext" title="'+tempStr+'" class="mainColumn2g" onclick="javascript:expandCollapsePedPain();">- Pain &#45; Pediatric</div>';

                //Change colspan and rowspan
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[pedPainIndicator].colSpan = 3;
                table.rows[0].cells[ppainCell].rowSpan = 1;
                table.rows[0].cells[ppainCell].className = "demcell";
                table.rows[0].cells[ppainCell].style.display = "";
                table.rows[0].cells[ppainCell].innerHTML = "";

                //Sub Headers
                //Assessment
                document.getElementById('secsubcolPedPain1').style.width = "120px";
                document.getElementById('secsubcolPedPain1').className = "subhdrs";
                document.getElementById('secsubcolPedPain1').style.display = "";
                document.getElementById('secsubcolPedPain1').innerHTML = i18n.ASSESSMENT;
                //Interventions
                document.getElementById('secsubcolPedPain2').style.width = "120px";
                document.getElementById('secsubcolPedPain2').className = "subhdrs";
                document.getElementById('secsubcolPedPain2').style.display = "";
                document.getElementById('secsubcolPedPain2').innerHTML = i18n.INTERVENTIONS;
                //Pain
                document.getElementById('secsubcolPedPain3').style.width = "120px";
                document.getElementById('secsubcolPedPain3').className = "subhdrs";
                document.getElementById('secsubcolPedPain3').style.display = "";
                document.getElementById('secsubcolPedPain3').innerHTML = i18n.condDisp.PAIN;

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellPedPainRowSpan";
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "";
                        tempValue = "cellPedPainRowSpan" + i;
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "";
                    tempValue += "patientInterventionPedPain";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                    //Pain
                    tempValue = "";
                    tempValue += "patientPainPedPain";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                }

                //Verify if this is the first time the section is called.
                if (blnFirstTimePedPain == true) {
                    //Change flag.
                    blnFirstTimePedPain = false;
                }

                //Verify which value the patient indicator has.
                //0 = Both qualifying and non qualifying patients.
                //1 = Only qualifying patients.
                if (strPtQualind == 1) {
                    //Fill the cells with values.
                    blnStatus = fillPedPainQualifying();
                }
                else {
                    //Fill the cells with values.
                    blnStatus = fillPedPain();
                }
            }
        }
        if (bExpLastPage)
        {
            displayNextPage();
            bExpLastPage = false;
        }
    }
    catch (error) {
        showErrorMessage(error.message, "expandCollapsePedPain", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Pain - Pediatric with values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillPedPain(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strEventName = "";
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strPainHoverText = "";
    var strPainHoverSPANID = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strPainCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intPainCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var strAcceptPain = "";
    var strAcceptRSLT = "";
    var strAcceptDT = "";
    var nUniqueRowId = 0;

    try
    {
        if (blnPedPainDisplayed)
        {
            PopulatePatientInfo();
            return;
        }
        //Loop through the JSON structure.
        for (var intCounter = 0; intCounter < json_data16.PPMREPLY.LIST.length; intCounter++)
        {
            //Reset variables.
            patientEncounterID = 0;
            ptQual = 0;
            tempValueX = "";
            tempValueY = "";
            tempString = "";
            pwStatus = "";
            pwName = "";
            strAssessmentHoverText = "";
            strAssessmentHoverSPANID = "";
            strInterventionsHoverText = "";
            strInterventionsHoverSPANID = "";
            strPainHoverText = "";
            strPainHoverSPANID = "";
            patientName = "";
            patientID = "";
            strAssessmentCircle = "";
            strInterventionsCircle = "";
            strPainCircle = "";
            intAssessmentCircle = 0;
            intInterventionsCircle = 0;
            intPainCircle = 0;
            strAcceptPain = "";
            strAcceptRSLT = "";
            strAcceptDT = "";

            patientEncounterID = json_data16.PPMREPLY.LIST[intCounter].EID;
            ptQual = json_data16.PPMREPLY.LIST[intCounter].PTQUAL;
            patientName = json_data16.PPMREPLY.LIST[intCounter].NAME;
            patientID = json_data16.PPMREPLY.LIST[intCounter].PID;
            pwStatus = json_data16.PPMREPLY.LIST[intCounter].PWSTATUS;
            pwName = json_data16.PPMREPLY.LIST[intCounter].PWNAME;
            intAssessmentCircle = json_data16.PPMREPLY.LIST[intCounter].ASSESSSTAT;
            intInterventionsCircle = json_data16.PPMREPLY.LIST[intCounter].INTERVSTAT;
            intPainCircle = json_data16.PPMREPLY.LIST[intCounter].PAINSTAT;
            strAcceptPain = json_data16.PPMREPLY.LIST[intCounter].ACCEPTPAIN;
            strAcceptRSLT = json_data16.PPMREPLY.LIST[intCounter].ACCEPTRSLT;
            strAcceptDT = json_data16.PPMREPLY.LIST[intCounter].ACCEPTDT;

            var oPatData = null;
            var objIdx = getPatObjIdxByEnctr(patientEncounterID);

            if (objIdx != null)
            {
                oPatData = patData[objIdx];

                if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                //Verify if the patient name consist of " or ' characters.
                //^^ = "
                //^ = '
                if (patientName.indexOf("^^") > -1) {
                    patientName = patientName.replace("^^", "&#34;");
                }
                if (patientName.indexOf("^") > -1) {
                    patientName = patientName.replace("^", "&#39;");
                }

                //Set link
                alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                " title='"+i18n.OPEN_CHART +
                patientName + i18n.TO_DOCUMENT_INFO+"' class='LinkText'>";

                //Verify if PTQUAL is greater than 0.
                if (ptQual > 0)
                {
                    //Verify which icon that is going to be displayed in the column.
                    //Assessment
                    //0 = Not Done
                    //1 = Not done 12timed
                    //2 = Met
                    //4 = Not done timed 4hr
                    //Reset variables.
                    tempValue = "";
                    tempValue2 = "";
                    switch (intAssessmentCircle) {
                        case 0:
                            //Empty Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            strAssessmentCircle = tempValue;
                            break;
                        case 1:
                            //Empty Circle and Alarm Clock
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            tempValue2 += "<img src='";
                            tempValue2 += imagepath;
                            tempValue2 += img4798_16;
                            tempValue2 += "'/>";

                            strAssessmentCircle += tempValue;
                            strAssessmentCircle += tempValue2;
                            break;
                        case 2:
                            //Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            strAssessmentCircle = tempValue;
                            break;
                        case 4:
                            //Empty Circle and Alarm Clock
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            tempValue2 += "<img src='";
                            tempValue2 += imagepath;
                            tempValue2 += img4798_16;
                            tempValue2 += "'/>";

                            strAssessmentCircle += tempValue;
                            strAssessmentCircle += tempValue2;
                            break;
                    }
                    //Interventions
                    //0 = NA
                    //1 = Not done
                    //2 = Complete
                    //Reset variable
                    tempValue = "";
                    switch (intInterventionsCircle) {
                        case 0:
                            strInterventionsCircle = "N/A";
                            break;
                        case 1:
                            //Empty Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            strInterventionsCircle = tempValue;
                            break;
                        case 2:
                            //Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            strInterventionsCircle = tempValue;
                            break;
                    }
                    //Pain
                    //0 = NA
                    //1 = Incident icon
                    //Reset variable
                    tempValue = "";
                    switch (intPainCircle) {
                        case 0:
                            strPainCircle = "N/A";
                            break;
                        case 1:
                            //Red Triangle with White Exclamation Mark
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img6047_16;
                            tempValue += "' />";
                            strPainCircle = tempValue;
                            break;
                    }

                    //Build Hovers.
                    //Assessment
                    strAssessmentHoverSPANID += '<table>';
                    //Interventions
                    if (intInterventionsCircle > 0) {
                        strInterventionsHoverSPANID += '<table>';
                    }
                    //Pain
                    if (intPainCircle > 0) {
                        strPainHoverSPANID += '<table>';
                        strPainHoverSPANID += "<tr><td colspan='2'><b><u>Outcome</u></b></td></tr>";
                        strPainHoverSPANID += '<tr>';
                        strPainHoverSPANID += '<td><b>';
                        strPainHoverSPANID += strAcceptPain;
                        strPainHoverSPANID += '</b> ';
                        strPainHoverSPANID += strAcceptRSLT;
                        strPainHoverSPANID += ' ';
                        strPainHoverSPANID += strAcceptDT;
                        strPainHoverSPANID += '</td>';
                        strPainHoverSPANID += '</tr>';
                    }

                    //Reset variables.
                    strEventName = "";
                    tempValue = "";
                    tempValue2 = "";

                    //Assessment
                    //0 = Not Done
                    //1 = Not done 12timed
                    //2 = Met
                    //4 = Not done timed 4hr
                    switch (intAssessmentCircle) {
                        case 0:
                            strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED;
                            break;
                        case 1:
                            strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED_WITHIN_12;
                            break;
                        case 2:
                            strEventName = i18n.PAIN_ASSESS_DOCUMENTED;
                            break;
                        case 4:
                            strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED_WITHIN_4;
                            break;
                    }
                    //Build Hover
                    strAssessmentHoverSPANID += '<tr>';
                    strAssessmentHoverSPANID += '<td>';
                    strAssessmentHoverSPANID += strEventName;
                    strAssessmentHoverSPANID += '</td>';
                    strAssessmentHoverSPANID += '</tr>';

                    //Reset variables.
                    strEventName = "";
                    tempValue = "";
                    tempValue2 = "";

                    //Interventions
                    //0 = NA
                    //1 = Not done
                    //2 = Complete
                    switch (intInterventionsCircle) {
                        case 0:
                            strEventName = "";
                            break;
                        case 1:
                            strEventName = i18n.PATIENT_AT_RISK_FOR_PAIN_NO_PLAN;
                            break;
                        case 2:
                            strEventName = i18n.PATIENT_AT_RISK_FOR_PAIN_WITH_PLAN;
                            break;
                    }
                    //Build Hover
                    strInterventionsHoverSPANID += '<tr>';
                    strInterventionsHoverSPANID += '<td>';
                    strInterventionsHoverSPANID += strEventName;
                    strInterventionsHoverSPANID += '</td>';
                    strInterventionsHoverSPANID += '</tr>';

                    //Build Hovers.
                    //Assessment
                    strAssessmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                    strAssessmentHoverSPANID += "<tr><td colspan='2'>";
                    strAssessmentHoverSPANID += alink;
                    strAssessmentHoverSPANID += patientName;
                    strAssessmentHoverSPANID += '</a>';
                    strAssessmentHoverSPANID += '</td></tr>';
                    strAssessmentHoverSPANID += '</table>';
                    strAssessmentHoverText += '<span id="'
                    strAssessmentHoverText += strAssessmentHoverSPANID;
                    strAssessmentHoverText += '"';
                    strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                    strAssessmentHoverText += '">';
                    strAssessmentHoverText += strAssessmentCircle;
                    strAssessmentHoverText += '</span>';
                    //Interventions
                    if (intInterventionsCircle > 0) {
                        strInterventionsHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strInterventionsHoverSPANID += "<tr><td colspan='2'>"
                        strInterventionsHoverSPANID += alink;
                        strInterventionsHoverSPANID += patientName;
                        strInterventionsHoverSPANID += '</a>';
                        strInterventionsHoverSPANID += '</td></tr>';
                        strInterventionsHoverSPANID += '</table>';
                        strInterventionsHoverText += '<span id="'
                        strInterventionsHoverText += strInterventionsHoverSPANID;
                        strInterventionsHoverText += '"';
                        strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                        strInterventionsHoverText += '">';
                        strInterventionsHoverText += strInterventionsCircle;
                        strInterventionsHoverText += '</span>';
                    }
                    else {
                        strInterventionsHoverText += '<span id="'
                        strInterventionsHoverText += strInterventionsHoverSPANID;
                        strInterventionsHoverText += '">';
                        strInterventionsHoverText += strInterventionsCircle;
                        strInterventionsHoverText += '</span>';
                    }
                    //Pain
                    if (intPainCircle > 0) {
                        strPainHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strPainHoverSPANID += "<tr><td colspan='2'>"
                        strPainHoverSPANID += alink;
                        strPainHoverSPANID += patientName;
                        strPainHoverSPANID += '</a>';
                        strPainHoverSPANID += '</td></tr>';
                        strPainHoverSPANID += '</table>';
                        strPainHoverText += '<span id="'
                        strPainHoverText += strPainHoverSPANID;
                        strPainHoverText += '"';
                        strPainHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strPainHoverText += "'gentooltip',this.id,0,0);";
                        strPainHoverText += '">';
                        strPainHoverText += strPainCircle;
                        strPainHoverText += '</span>';
                    }
                    else {
                        strPainHoverText += '<span id="'
                        strPainHoverText += strPainHoverSPANID;
                        strPainHoverText += '">';
                        strPainHoverText += strPainCircle;
                        strPainHoverText += '</span>';
                    }

                    //Build Cells.
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[ppainCell];
                        tempValueX.innerHTML = strAssessmentHoverText;
                    }
                    oPatData = AddToOPatData(strAssessmentHoverText,oPatData,'PedPain',pedPainSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(ppainCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strInterventionsHoverText;
                    }
                    oPatData = AddToOPatData(strInterventionsHoverText,oPatData,'PedPain',pedPainSbHdrDispArray[1]);
                    //Pain
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(ppainCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strPainHoverText;
                    }
                    oPatData = AddToOPatData(strPainHoverText,oPatData,'PedPain',pedPainSbHdrDispArray[2]);
                }
                else
                {
                    //Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[ppainCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'PedPain',pedPainSbHdrDispArray[0]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(ppainCell) + parseInt(1);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'PedPain',pedPainSbHdrDispArray[1]);
                    //Pain
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0; //015
                    tempCell = parseInt(ppainCell) + parseInt(2);

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'PedPain',pedPainSbHdrDispArray[2]);
                }//PTQual check
            }//oPatData check
        }
        blnPedPainDisplayed = true;
    }
    catch (error) {
        showErrorMessage(error.message, "fillPedPain", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Pediatric Pain with only qualifying values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillPedPainQualifying(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strEventType = "";
    var strEventName = "";
    var strEventStatus = "";
    var strAssessmentHoverText = "";
    var strAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strPainHoverText = "";
    var strPainHoverSPANID = "";
    var strTMIND = "";
    var strAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strPainCircle = "";
    var intAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intPainCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var strEventDTDisp = "";
    var tempPageNum = 0;
    var strPtQualEncounterID = 0;
    var strPtQualPatientID = 0;
    var intSectionIndicator = 0;
    var strAcceptPain = "";
    var strAcceptRSLT = "";
    var strAcceptDT = "";
    var nUniqueRowId = 0;

    try {
        //Get Indicator.
        intSectionIndicator = json_data2.PTREPLY.PPAININD;

        //Verify the indicator.
        //0 = The JSON object is NOT complete.
        //1 = The JSON object is complete.
        if (intSectionIndicator == 0) {
            for (var i=0;j=patData.length,i<j; i++)
            {
                var oPatData = patData[i];

                nUniqueRowId++;

                //Reset variables.
                tempString = "";
                tempString += 'patEncounter';
                tempString += nUniqueRowId;

                //Assessment
                oPatData = PopulateSection('pedPain',"N/A",tempString,oPatData,pedPainSbHdrDispArray[0]);

                //LineDays
                oPatData = PopulateSection('pedPain',"N/A",tempString,oPatData,pedPainSbHdrDispArray[1]);

                //CRI
                oPatData = PopulateSection('pedPain',"N/A",tempString,oPatData,pedPainSbHdrDispArray[2]);
            }
        }
        else {
            nUniqueRowId = 0;

            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < json_data16.PPMREPLY.LIST.length; intCounter++)
            {
                //Reset variables.
                patientEncounterID = 0;
                ptQual = 0;
                tempValueX = "";
                tempValueY = "";
                tempString = "";
                pwStatus = "";
                pwName = "";
                strAssessmentHoverText = "";
                strAssessmentHoverSPANID = "";
                strInterventionsHoverText = "";
                strInterventionsHoverSPANID = "";
                strPainHoverText = "";
                strPainHoverSPANID = "";
                patientName = "";
                patientID = "";
                strAssessmentCircle = "";
                strInterventionsCircle = "";
                strPainCircle = "";
                intAssessmentCircle = 0;
                intInterventionsCircle = 0;
                intPainCircle = 0;

                patientEncounterID = json_data16.PPMREPLY.LIST[intCounter].EID;
                patientID = json_data16.PPMREPLY.LIST[intCounter].PID;

                var oPatData = null;
                var objIdx = getPatObjIdxByEnctr(patientEncounterID);

                if (objIdx != null)//meaning encounter was found
                {
                    oPatData = patData[objIdx];

                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                    ptQual = json_data16.PPMREPLY.LIST[intCounter].PTQUAL;
                    patientName = json_data16.PPMREPLY.LIST[intCounter].NAME;
                    pwStatus = json_data16.PPMREPLY.LIST[intCounter].PWSTATUS;
                    pwName = json_data16.PPMREPLY.LIST[intCounter].PWNAME;
                    intAssessmentCircle = json_data16.PPMREPLY.LIST[intCounter].ASSESSSTAT;
                    intInterventionsCircle = json_data16.PPMREPLY.LIST[intCounter].INTERVSTAT;
                    intPainCircle = json_data16.PPMREPLY.LIST[intCounter].PAINSTAT;
                    strAcceptPain = json_data16.PPMREPLY.LIST[intCounter].ACCEPTPAIN;
                    strAcceptRSLT = json_data16.PPMREPLY.LIST[intCounter].ACCEPTRSLT;
                    strAcceptDT = json_data16.PPMREPLY.LIST[intCounter].ACCEPTDT;

                    //Verify if the patient name consist of " or ' characters.
                    //^^ = "
                    //^ = '
                    if (patientName.indexOf("^^") > -1) {
                        patientName = patientName.replace("^^", "&#34;");
                    }
                    if (patientName.indexOf("^") > -1) {
                        patientName = patientName.replace("^", "&#39;");
                    }

                    //Set link
                    alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                    i18n.OPEN_CHART +
                    patientName + i18n.TO_DOCUMENT_INFO + "' class='LinkText'>";

                    //Verify if PTQUAL is greater than 0.
                    if (ptQual > 0) {
                        //Verify which icon that is going to be displayed in the column.
                        //Assessment
                        //0 = Not Done
                        //1 = Not done 12timed
                        //2 = Met
                        //4 = Not done timed 4hr
                        //Reset variables.
                        tempValue = "";
                        tempValue2 = "";
                        switch (intAssessmentCircle) {
                            case 0:
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strAssessmentCircle = tempValue;
                                break;
                            case 1:
                                //Empty Circle and Alarm Clock
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                tempValue2 += "<img src='";
                                tempValue2 += imagepath;
                                tempValue2 += img4798_16;
                                tempValue2 += "'/>";

                                strAssessmentCircle += tempValue;
                                strAssessmentCircle += tempValue2;
                                break;
                            case 2:
                                //Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                strAssessmentCircle = tempValue;
                                break;
                            case 4:
                                //Empty Circle and Alarm Clock
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                tempValue2 += "<img src='";
                                tempValue2 += imagepath;
                                tempValue2 += img4798_16;
                                tempValue2 += "'/>";

                                strAssessmentCircle += tempValue;
                                strAssessmentCircle += tempValue2;
                                break;
                        }
                        //Interventions
                        //0 = NA
                        //1 = Not done
                        //2 = Complete
                        //Reset variable
                        tempValue = "";
                        switch (intInterventionsCircle) {
                            case 0:
                                strInterventionsCircle = "N/A";
                                break;
                            case 1:
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strInterventionsCircle = tempValue;
                                break;
                            case 2:
                                //Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                strInterventionsCircle = tempValue;
                                break;
                        }
                        //Pain
                        //0 = NA
                        //1 = Incident icon
                        //Reset variable
                        tempValue = "";
                        switch (intPainCircle) {
                            case 0:
                                strPainCircle = "N/A";
                                break;
                            case 1:
                                //Red Triangle with White Exclamation Mark
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img6047_16;
                                tempValue += "' />";
                                strPainCircle = tempValue;
                                break;
                        }

                        //Build Hovers.
                        //Assessment
                        strAssessmentHoverSPANID += '<table>';
                        //Interventions
                        if (intInterventionsCircle > 0) {
                            strInterventionsHoverSPANID += '<table>';
                        }
                        //Pain
                        if (intPainCircle > 0) {
                            strPainHoverSPANID += '<table>';
                            strPainHoverSPANID += "<tr><td colspan='2'><b><u>Outcome</u></b></td></tr>";
                            strPainHoverSPANID += '<tr>';
                            strPainHoverSPANID += '<td><b>';
                            strPainHoverSPANID += strAcceptPain;
                            strPainHoverSPANID += '</b> ';
                            strPainHoverSPANID += strAcceptRSLT;
                            strPainHoverSPANID += ' ';
                            strPainHoverSPANID += strAcceptDT;
                            strPainHoverSPANID += '</td>';
                            strPainHoverSPANID += '</tr>';
                        }

                        //Reset variables.
                        strEventType = "";
                        strEventName = "";
                        strTMIND = "";
                        strEventStatus = "";
                        tempValue = "";
                        tempValue2 = "";

                        //Assessment
                        //0 = Not Done
                        //1 = Not done 12timed
                        //2 = Met
                        //4 = Not done timed 4hr
                        //switch (strEventStatus)
                        switch (intAssessmentCircle) {
                            case 0:
                                strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED;
                                break;
                            case 1:
                                strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED_WITHIN_12;
                                break;
                            case 2:
                                strEventName = i18n.PAIN_ASSESS_DOCUMENTED;
                                break;
                            case 4:
                                strEventName = i18n.PAIN_ASSESS_NOT_DOCUMENTED_WITHIN_4;
                                break;
                        }
                        //Build Hover
                        strAssessmentHoverSPANID += '<tr>';
                        strAssessmentHoverSPANID += '<td>';
                        strAssessmentHoverSPANID += strEventName;
                        strAssessmentHoverSPANID += '</td>';
                        strAssessmentHoverSPANID += '</tr>';

                        //Reset variables.
                        strEventType = "";
                        strEventName = "";
                        strTMIND = "";
                        strEventStatus = "";
                        tempValue = "";
                        tempValue2 = "";

                        //Interventions
                        //0 = NA
                        //1 = Not done
                        //2 = Complete
                        switch (intInterventionsCircle) {
                            case 0:
                                strEventName = "";
                                break;
                            case 1:
                                strEventName = i18n.PATIENT_AT_RISK_FOR_PAIN_NO_PLAN;
                                break;
                            case 2:
                                strEventName = i18n.PATIENT_AT_RISK_FOR_PAIN_WITH_PLAN;
                                break;
                        }
                        //Build Hover
                        strInterventionsHoverSPANID += '<tr>';
                        strInterventionsHoverSPANID += '<td>';
                        strInterventionsHoverSPANID += strEventName;
                        strInterventionsHoverSPANID += '</td>';
                        strInterventionsHoverSPANID += '</tr>';

                        //Build Hovers.
                        //Assessment
                        strAssessmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strAssessmentHoverSPANID += "<tr><td colspan='2'>";
                        strAssessmentHoverSPANID += alink;
                        strAssessmentHoverSPANID += patientName;
                        strAssessmentHoverSPANID += '</a>';
                        strAssessmentHoverSPANID += '</td></tr>';
                        strAssessmentHoverSPANID += '</table>';
                        strAssessmentHoverText += '<span id="'
                        strAssessmentHoverText += strAssessmentHoverSPANID;
                        strAssessmentHoverText += '"';
                        strAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strAssessmentHoverText += "'gentooltip',this.id,0,0);";
                        strAssessmentHoverText += '">';
                        strAssessmentHoverText += strAssessmentCircle;
                        strAssessmentHoverText += '</span>';
                        //Interventions
                        if (intInterventionsCircle > 0) {
                            strInterventionsHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                            strInterventionsHoverSPANID += "<tr><td colspan='2'>"
                            strInterventionsHoverSPANID += alink;
                            strInterventionsHoverSPANID += patientName;
                            strInterventionsHoverSPANID += '</a>';
                            strInterventionsHoverSPANID += '</td></tr>';
                            strInterventionsHoverSPANID += '</table>';
                            strInterventionsHoverText += '<span id="'
                            strInterventionsHoverText += strInterventionsHoverSPANID;
                            strInterventionsHoverText += '"';
                            strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                            strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                            strInterventionsHoverText += '">';
                            strInterventionsHoverText += strInterventionsCircle;
                            strInterventionsHoverText += '</span>';
                        }
                        else {
                            strInterventionsHoverText += '<span id="'
                            strInterventionsHoverText += strInterventionsHoverSPANID;
                            strInterventionsHoverText += '">';
                            strInterventionsHoverText += strInterventionsCircle;
                            strInterventionsHoverText += '</span>';
                        }
                        //Pain
                        if (intPainCircle > 0) {
                            strPainHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                            strPainHoverSPANID += "<tr><td colspan='2'>"
                            strPainHoverSPANID += alink;
                            strPainHoverSPANID += patientName;
                            strPainHoverSPANID += '</a>';
                            strPainHoverSPANID += '</td></tr>';
                            strPainHoverSPANID += '</table>';
                            strPainHoverText += '<span id="'
                            strPainHoverText += strPainHoverSPANID;
                            strPainHoverText += '"';
                            strPainHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                            strPainHoverText += "'gentooltip',this.id,0,0);";
                            strPainHoverText += '">';
                            strPainHoverText += strPainCircle;
                            strPainHoverText += '</span>';
                        }
                        else {
                            strPainHoverText += '<span id="'
                            strPainHoverText += strPainHoverSPANID;
                            strPainHoverText += '">';
                            strPainHoverText += strPainCircle;
                            strPainHoverText += '</span>';
                        }

                        //Build Cells.
                        //Reset variables.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += patientEncounterID;
                        //Assessment
                        oPatData = PopulateSection('pedPain',strAssessmentHoverText,tempString,oPatData,pedPainSbHdrDispArray[0]);

                        //Interventions
                        oPatData = PopulateSection('pedPain',strInterventionsHoverText,tempString,oPatData,pedPainSbHdrDispArray[1]);

                        //Pain
                        oPatData = PopulateSection('pedPain',strPainHoverText,tempString,oPatData,pedPainSbHdrDispArray[2]);
                    }
                    else {
                        //Reset variables.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Assessment
                        oPatData = PopulateSection('pedPain',"N/A",tempString,oPatData,pedPainSbHdrDispArray[0]);

                        //LineDays
                        oPatData = PopulateSection('pedPain',"N/A",tempString,oPatData,pedPainSbHdrDispArray[1]);

                        //CRI
                        oPatData = PopulateSection('pedPain',"N/A",tempString,oPatData,pedPainSbHdrDispArray[2]);
                    }
                }//oPatData check
            }
        } //intSectionIndicator
        SortPatData(lastSortField);
    }
    catch (error) {
        showErrorMessage(error.message, "fillPedPainQualifying", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

// ;;014 addition of Pediatric Skin condition
/**
 * Gets the Skin - Pediatric JSON structure.
 */
function getpSkin(){
    var qmReqObject = "";
    var blnLoadpSkin = true;
    var cclParam = "";
    var strErrorMessage = "An error has occurred when getting data for Pediatric Skin .";
    var strpSkin = "";
    var intSectionIndicator = 0;
    var cclProg = "dc_mp_get_lh_pskin";

    try {
        if (requestAsync) {
            //A request is in progress, so don't make another one.
        }
        else {
            //Display Load Text.
            displayLoadText("pSkin");

            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1) {

                intSectionIndicator = json_data2.PTREPLY.PSKININD;
                //Verify the indicator.
                //0 = The JSON object is NOT complete.
                //1 = The JSON object is complete.
                if (intSectionIndicator == 1) {
                    //Load responses text into object.
                    strpSkin = json_data2.PTREPLY.PSKINJSON;
                    json_data17 = JSON.parse(strpSkin);
                }
                //Load Skin - Pediatric JSON.
                blnpSkinCalled = true;
                blnLoadpSkin = expandCollapsepSkin();
                //Hide Load Text.
                setTimeout("hideLoadText()",hideLoadTextDelay);
                //This flag is used in the function getExpandedTimer.
                intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
            }
            else {
                //Build JSON String.
                qmReqObject += '{"QMREQ":{"PRSNLID":';
                qmReqObject += userPersonID;
                qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
                qmReqObject += devLocation;
                qmReqObject += ',"APPID":';
                qmReqObject += applicationID;
                qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":';
                qmReqObject += selectedID;
                qmReqObject += ',"PTLISTTYPE":';
                qmReqObject += ptListType;
                qmReqObject += ',"PTLISTLOCCD":';
                qmReqObject += ptListLoccd;
                qmReqObject += ',"ALLERGYIND":0,"DIAGIND":0,"PROBIND":0';
                qmReqObject += ',"LIST":['
                qmReqObject += strPatientDemog;
                qmReqObject += ']}}';

                //Build the parameters for getting the Patients.
                cclParam = "'MINE'" + ",'" + qmReqObject + "'";

                requestAsync = getXMLCclRequest();
                requestAsync.onreadystatechange = function(){
                    if (requestAsync.readyState == 4 && requestAsync.status == 200) {
                        if (requestAsync.responseText > " ") {
                            try {
                                //Load responses text into object.
                                json_data17 = JSON.parse(requestAsync.responseText);
                            }
                            catch (error) {
                                //Hide Load Text.
                                setTimeout("hideLoadText()",hideLoadTextDelay);
                                showErrorMessage(error.message, "getpSkin", requestAsync.status, cclParam);
                                return false;
                            }
                            //Load Pediatric Skin JSON.
                            blnpSkinCalled = true;
                            blnLoadpSkin = expandCollapsepSkin();
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //This flag is used in the function getExpandedTimer.
                            intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
                        }
                        requestAsync = null;
                    }
                    else
                        if (requestAsync.readyState == 4 && requestAsync.readyState != 200) {
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //Set Error Message.
                            showErrorMessage(strErrorMessage, "getpSkin", requestAsync.status, cclParam);
                            return false;
                        }
                };
                //Sends the request to the CCL server.
                if (location.protocol.substr(0, 4) == "http") {
                    var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg;
                    requestAsync.open("POST", url);
                    requestAsync.send(cclParam);
                }
                else {
                    requestAsync.open("POST", cclProg);
                    requestAsync.send(cclParam);
                }
            }
        }
    }
    catch (error) {
        //Hide Load Text.
        setTimeout("hideLoadText()",hideLoadTextDelay);
        showErrorMessage(error.message, "getpSkin", "", cclParam);
    }
}

/**
 * Expands or collapses the section Skin Pediatric. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function expandCollapsepSkin(){
    var intHiddenValue = 0;
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var content = "";
    var tempTotalValue = 0;
    var blnStatus = true;
    var tempTotalHiddenRows = 0;
    var table = "";
    var intCounter = 0;
    var tempCell = 0;
    var rowsPageOne = 0;
    var rowsToBuild = 0;

    try {

        if (currentPage == pageCNT && !bExpLastPage)
        {
            displayPreviousPage();
            bExpLastPage = true;
            //return blnStatus;
        }
        //Verify if the Skin Pediatric JSON structure has been built.
        //True = has already been called.
        //False = has not been called.
        if (blnpSkinCalled == false) {
            //Change Hidden Value.
            hiddenpSkinExpandCollapse = 1;
            getpSkin();
        }
        else {
            //Calculate how many rows we are going to hide and add 1 extra to inlcude the last row.
            tempTotalValue = parseInt(PgRecTotal) + parseInt(1);
            //Get hidden value.
            intHiddenValue = hiddenpSkinExpandCollapse;
            //Get name of table.
            table = document.getElementById("hdrtable2");
            //0 = make the section collapsed.
            //1 = make the section expanded.
            if (intHiddenValue == 0) {

                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Change Hidden Value.
                hiddenpSkinExpandCollapse = 1;

                //Change size of Table 1 and 2.
                intSubtractWidth = (parseInt(4) * parseInt(120)) + hdrtableWdthAdj;
                intCurrentTableWidth = parseInt(intCurrentTableWidth) - parseInt(intSubtractWidth) + parseInt(40);

                document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth);
                document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth);

                //Main Header
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[pSkinIndicator].colSpan = 1;
                document.getElementById('secpatlisthdrpSkin').style.width = "40px";
                document.getElementById('secpatlisthdrpSkin').className = "tabhdrs2g";
                document.getElementById('secpatlisthdrpSkin').innerHTML = '<div id="divpSkintext" title="'+i18n.condDisp.EXP_PED_SKIN_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">+</div>';

                //Sub Headers
                //Risk Assessment
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[1].cells;
                tempValue[pskinCell].colSpan = "1";
                document.getElementById('secsubcolpSkin1').style.width = "40px";
                document.getElementById('secsubcolpSkin1').className = "tabhdrs2g";
                document.getElementById('secsubcolpSkin1').style.display = "";
                document.getElementById('secsubcolpSkin1').innerHTML = "";
                //Integrity Assessment
                content = "";
                tempValue = "";
                tempValue = "secsubcolpSkin2";
                content = document.getElementById(tempValue);
                content.style.display = "none";
                content.innerHTML = "";
                //Interventions
                content = "";
                tempValue = "";
                tempValue = "secsubcolpSkin3";
                content = document.getElementById(tempValue);
                content.style.display = "none";
                content.innerHTML = "";
                //Impairment Skin
                content = "";
                tempValue = "";
                tempValue = "secsubcolpSkin4";
                content = document.getElementById(tempValue);
                content.style.display = "none";
                content.innerHTML = "";

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Risk Assessment
                        table.rows[intCounter].cells[pskinCell].style.width = "40px";
                        table.rows[intCounter].cells[pskinCell].className = "tabhdrsVertical";
                        table.rows[intCounter].cells[pskinCell].style.display = "";
                        table.rows[intCounter].cells[pskinCell].innerHTML = "Pediatric Skin";
                    }
                    else {
                        //Risk Assessment
                        table.rows[intCounter].cells[pskinCell].style.width = "0px";
                        table.rows[intCounter].cells[pskinCell].style.display = "none";
                        table.rows[intCounter].cells[pskinCell].innerHTML = "";
                    }
                    //Integrity Assessment
                    tempValue = "";
                    tempValue += "patientIAssessmentpSkin";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";
                    //Interventions
                    tempValue = "";
                    tempValue += "patientInterventionpSkin";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";
                    //Skin Impairment
                    tempValue = "";
                    tempValue += "patientImpairmentpSkin";
                    tempValue += i;
                    document.getElementById(tempValue).style.display = "none";
                    document.getElementById(tempValue).innerHTML = "";

                    //Add 2 to the counter.
                    intCounter = intCounter + 2;
                }
                //Add the rowspan.
                table.rows[0].cells[pskinCell].rowSpan = rowSpanCounter;
            }
            else {
                displayLoadText("pSkin");
                //Change Hidden Value.
                hiddenpSkinExpandCollapse = 0;

                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Calculate size of Tables 1 and 2.
                intSubtractWidth = (parseInt(4) * parseInt(120));
                intCurrentTableWidth = parseInt(intCurrentTableWidth) + parseInt(intSubtractWidth) - parseInt(40);

                //Reset global variables.
                hdrTableWidth = intCurrentTableWidth;
                hdrTable2Width = intCurrentTableWidth;

                //Set size of Tables 1 and 2.
                document.getElementById("hdrtable").width = parseInt(hdrTableWidth) + hdrtableWdthAdj;
                document.getElementById("hdrtable2").width = parseInt(hdrTable2Width) + hdrtableWdthAdj;

                //Main Header.
                tempValue = "";
                tempValue = "secpatlisthdrpSkin";
                document.getElementById(tempValue).style.width = "480px";
                document.getElementById(tempValue).className = "tabhdrs";
                document.getElementById(tempValue).style.display = "";
                document.getElementById(tempValue).innerHTML = '<div id="divpSkintext" title="'+i18n.condDisp.COLLAPSE_PED_SKIN_HVR+'" class="mainColumn2g" onclick="javascript:expandCollapsepSkin();">- Pediatric Skin</div>';

                //Change colspan and rowspan
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[pSkinIndicator].colSpan = 4;
                table.rows[0].cells[pskinCell].rowSpan = 1;
                table.rows[0].cells[pskinCell].className = "demcell";
                table.rows[0].cells[pskinCell].style.display = "";
                table.rows[0].cells[pskinCell].innerHTML = "";

                //Sub Headers
                //Risk Assessment
                document.getElementById('secsubcolpSkin1').style.width = "120px";
                document.getElementById('secsubcolpSkin1').className = "subhdrs";
                document.getElementById('secsubcolpSkin1').style.display = "";
                document.getElementById('secsubcolpSkin1').innerHTML = i18n.RISK_ASSESSMENT;
                //Integrity Assessment
                document.getElementById('secsubcolpSkin2').style.width = "120px";
                document.getElementById('secsubcolpSkin2').className = "subhdrs";
                document.getElementById('secsubcolpSkin2').style.display = "";
                document.getElementById('secsubcolpSkin2').innerHTML = i18n.INTEGRITY_ASSESSMENT;
                //Interventions
                document.getElementById('secsubcolpSkin3').style.width = "120px";
                document.getElementById('secsubcolpSkin3').className = "subhdrs";
                document.getElementById('secsubcolpSkin3').style.display = "";
                document.getElementById('secsubcolpSkin3').innerHTML = i18n.INTERVENTIONS;
                //Pain
                document.getElementById('secsubcolpSkin4').style.width = "120px";
                document.getElementById('secsubcolpSkin4').className = "subhdrs";
                document.getElementById('secsubcolpSkin4').style.display = "";
                document.getElementById('secsubcolpSkin4').innerHTML = i18n.SKIN_IMPAIRMENT;

                //Table 2 rows.
                for (var i = 1; i < (tempTotalValue); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Risk Assessment
                        tempValue = "";
                        tempValue = "cellpSkinRowSpan";
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Riks Assessment
                        tempValue = "";
                        tempValue = "cellpSkinRowSpan" + i;
                        document.getElementById(tempValue).style.width = "120px";
                        document.getElementById(tempValue).className = "demcell";
                        document.getElementById(tempValue).style.display = "";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Integrity Assessment
                    tempValue = "";
                    tempValue += "patientIAssessmentpSkin";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                    //Interventions
                    tempValue = "";
                    tempValue += "patientInterventionpSkin";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                    //Skin Impairment
                    tempValue = "";
                    tempValue += "patientImpairmentpSkin";
                    tempValue += i;
                    document.getElementById(tempValue).style.width = "120px";
                    document.getElementById(tempValue).className = "demcell";
                    document.getElementById(tempValue).style.display = "";
                    document.getElementById(tempValue).innerHTML = "";
                }

                //Verify if this is the first time the section is called.
                if (blnFirstTimepSkin == true) {
                    //Change flag.
                    blnFirstTimepSkin = false;
                }

                //Verify which value the patient indicator has.
                //0 = Both qualifying and non qualifying patients.
                //1 = Only qualifying patients.
                if (strPtQualind == 1) {
                    //Fill the cells with values.
                    blnStatus = fillpSkinQualifying();
                }
                else {
                    //Fill the cells with values.
                    blnStatus = fillpSkin();
                }
            }
        }
        if (bExpLastPage)
        {
            displayNextPage();
            bExpLastPage = false;
        }
    }
    catch (error) {
        showErrorMessage(error.message, "expandCollapsepSkin", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Skin Pediatric with values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillpSkin(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strEventName = "";
    var strRiskAssessmentHoverText = "";
    var strRiskAssessmentHoverSPANID = "";
    var strIntegrityAssessmentHoverText = "";
    var strIntegrityAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strImpairmentHoverText = "";
    var strImpairmentSPANID = "";
    var strRiskAssessmentCircle = "";
    var strIntegrityAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strImpairmentCircle = "";
    var intRiskAssessmentCircle = 0;
    var intIntegrityAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intImpairmentCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var strpSkinTitle1 = "";
    var strpSkinRSLT1 = "";
    var strpskinDT1 = "";
    var strpSkinTitle2 = "";
    var strpSkinRSLT2 = "";
    var strpskinDT2 = "";
    var nUniqueRowId = 0;
    try {
        if (blnpSkinDisplayed)
        {
            PopulatePatientInfo();
            return;
        }
        //Loop through the JSON structure.
        for (var intCounter = 0; intCounter < json_data17.PSREPLY.LIST.length; intCounter++)
        {
            //Reset variables.
            patientEncounterID = 0;
            ptQual = 0;
            tempValueX = "";
            tempValueY = "";
            tempString = "";
            pwStatus = "";
            pwName = "";
            strRiskAssessmentHoverText = "";
            strRiskAssessmentHoverSPANID = "";
            strIntegrityAssessmentHoverText = "";
            strIntegrityAssessmentHoverSPANID = "";
            strInterventionsHoverText = "";
            strInterventionsHoverSPANID = "";
            strImpairmentHoverText = "";
            strImpairmentHoverSPANID = "";
            patientName = "";
            patientID = "";
            strRiskAssessmentCircle = "";
            strIntegrityAssessmentCircle = "";
            strInterventionsCircle = "";
            strImpairmentCircle = "";
            intRiskAssessmentCircle = 0;
            intIntegrityAssessmentCircle = 0;
            intInterventionsCircle = 0;
            intImpairmentCircle = 0;
            strpSkinTitle1 = "";
            strpSkinRSLT1 = "";
            strpskinDT1 = "";
            strpSkinTitle2 = "";
            strpSkinRSLT2 = "";
            strpskinDT2 = "";

            patientEncounterID = json_data17.PSREPLY.LIST[intCounter].EID;
            ptQual = json_data17.PSREPLY.LIST[intCounter].PTQUAL;
            patientName = json_data17.PSREPLY.LIST[intCounter].NAME;
            patientID = json_data17.PSREPLY.LIST[intCounter].PID;
            pwStatus = json_data17.PSREPLY.LIST[intCounter].PWSTATUS;
            pwName = json_data17.PSREPLY.LIST[intCounter].PWNAME;
            intRiskAssessmentCircle = json_data17.PSREPLY.LIST[intCounter].RISKASSESSSTAT;
            intIntegrityAssessmentCircle = json_data17.PSREPLY.LIST[intCounter].INTEGRITYSTAT;
            intInterventionsCircle = json_data17.PSREPLY.LIST[intCounter].INTERVSTAT;
            intImpairmentCircle = json_data17.PSREPLY.LIST[intCounter].IMPAIRMENTSTAT;
            strpSkinTitle1 = "Skin Integrity Impairment #1 ";
            strpSkinRSLT1 = json_data17.PSREPLY.LIST[intCounter].PSKINIMPAIRMENT1;
            strpskinDT1 = json_data17.PSREPLY.LIST[intCounter].PSKINIMPAIRMENTDT1;
            strpSkinTitle2 = "Skin Integrity Impairment #2 ";
            strpSkinRSLT2 = json_data17.PSREPLY.LIST[intCounter].PSKINIMPAIRMENT2;
            strpskinDT2 = json_data17.PSREPLY.LIST[intCounter].PSKINIMPAIRMENTDT2;

            var oPatData = null;
            var objIdx = getPatObjIdxByEnctr(patientEncounterID);

            if (objIdx != null)//meaning encounter found
            {
                oPatData = patData[objIdx];

                if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                //Verify if the patient name consist of " or ' characters.
                //^^ = "
                //^ = '
                if (patientName.indexOf("^^") > -1) {
                    patientName = patientName.replace("^^", "&#34;");
                }
                if (patientName.indexOf("^") > -1) {
                    patientName = patientName.replace("^", "&#39;");
                }

                //Set link
                alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                " title='"+i18n.OPEN_CHART +
                patientName + i18n.TO_DOCUMENT_INFO+"' class='LinkText'>";

                //Verify if PTQUAL is greater than 0.
                if (ptQual > 0) {
                    //Verify which icon that is going to be displayed in the column.
                    //Risk Assessment
                    //0 = Not Done
                    //1 = Not done 12timed
                    //2 = Met
                    //4 = Not done timed 4hr
                    //Reset variables.
                    tempValue = "";
                    tempValue2 = "";
                    switch (intRiskAssessmentCircle) {
                        case 0:
                            //Empty Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            strRiskAssessmentCircle = tempValue;
                            break;
                        case 1:
                            //Empty Circle and Alarm Clock
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            tempValue2 += "<img src='";
                            tempValue2 += imagepath;
                            tempValue2 += img4798_16;
                            tempValue2 += "'/>";

                            strRiskAssessmentCircle += tempValue;
                            strRiskAssessmentCircle += tempValue2;
                            break;
                        case 2:
                            //Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            strRiskAssessmentCircle = tempValue;
                            break;
                        case 4:
                            //Empty Circle and Alarm Clock
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            tempValue2 += "<img src='";
                            tempValue2 += imagepath;
                            tempValue2 += img4798_16;
                            tempValue2 += "'/>";

                            strRiskAssessmentCircle += tempValue;
                            strRiskAssessmentCircle += tempValue2;
                            break;
                    }

                    //Verify which icon that is going to be displayed in the column.
                    //Integrity Assessment
                    //0 = Not Done
                    //1 = Not done 12timed
                    //2 = Met
                    //4 = Not done timed 4hr
                    //Reset variables.
                    tempValue = "";
                    tempValue2 = "";
                    switch (intIntegrityAssessmentCircle) {
                        case 0:
                            //Empty Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            strIntegrityAssessmentCircle = tempValue;
                            break;
                        case 1:
                            //Empty Circle and Alarm Clock
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            tempValue2 += "<img src='";
                            tempValue2 += imagepath;
                            tempValue2 += img4798_16;
                            tempValue2 += "'/>";

                            strIntegrityAssessmentCircle += tempValue;
                            strIntegrityAssessmentCircle += tempValue2;
                            break;
                        case 2:
                            //Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            strIntegrityAssessmentCircle = tempValue;
                            break;
                        case 4:
                            //Empty Circle and Alarm Clock
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";

                            tempValue2 += "<img src='";
                            tempValue2 += imagepath;
                            tempValue2 += img4798_16;
                            tempValue2 += "'/>";

                            strIntegrityAssessmentCircle += tempValue;
                            strIntegrityAssessmentCircle += tempValue2;
                            break;
                    }
                    //Interventions
                    //0 = NA
                    //1 = Not done
                    //2 = Complete
                    //Reset variable
                    tempValue = "";
                    switch (intInterventionsCircle) {
                        case 0:
                            strInterventionsCircle = "N/A";
                            break;
                        case 1:
                            //Empty Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img5970_16;
                            tempValue += "' />";
                            strInterventionsCircle = tempValue;
                            break;
                        case 2:
                            //Filled Circle
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img3918_16;
                            tempValue += "' />";
                            strInterventionsCircle = tempValue;
                            break;
                    }
                    //Skin Impairment
                    //0 = NA
                    //1 = Incident icon
                    //2 = 2 Incidents
                    //Reset variable
                    tempValue = "";
                    switch (intImpairmentCircle) {
                        case 0:
                            strImpairmentCircle = "N/A";
                            break;
                        case 1:
                            //Red Triangle with White Exclamation Mark
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img6047_16;
                            tempValue += "' />";
                            strImpairmentCircle = tempValue;
                            break;
                        case 2:
                            //Red Triangle with White Exclamation Mark
                            tempValue += "<img src='";
                            tempValue += imagepath;
                            tempValue += img6047_16;
                            tempValue += "' />";
                            strImpairmentCircle = tempValue;
                            break;

                    }

                    //Build Hovers.
                    //Risk Assessment
                    strRiskAssessmentHoverSPANID += '<table>';
                    //Integrity Assessment
                    if (intIntegrityAssessmentCircle > 0) {
                        strIntegrityAssessmentHoverSPANID += '<table>';
                    }

                    //Interventions
                    if (intInterventionsCircle > 0) {
                        strInterventionsHoverSPANID += '<table>';
                    }
                    //Skin Impairment
                    if (intImpairmentCircle == 1) {
                        strImpairmentHoverSPANID += '<table>';
                        strImpairmentHoverSPANID += '<tr>';
                        strImpairmentHoverSPANID += '<td>';
                        strImpairmentHoverSPANID += strpSkinTitle1;
                        strImpairmentHoverSPANID += strpskinDT1;
                        strImpairmentHoverSPANID += ' ';
                        strImpairmentHoverSPANID += strpSkinRSLT1;
                        strImpairmentHoverSPANID += '</td>';
                        strImpairmentHoverSPANID += '</tr>';
                    }
                    if (intImpairmentCircle == 2) {
                        strImpairmentHoverSPANID += '<table>';
                        strImpairmentHoverSPANID += '<tr>';
                        strImpairmentHoverSPANID += '<td>';
                        strImpairmentHoverSPANID += strpSkinTitle1;
                        strImpairmentHoverSPANID += strpskinDT1;
                        strImpairmentHoverSPANID += ' ';
                        strImpairmentHoverSPANID += strpSkinRSLT1;
                        strImpairmentHoverSPANID += '</td>';
                        strImpairmentHoverSPANID += '</tr>';
                        strImpairmentHoverSPANID += '<tr>';
                        strImpairmentHoverSPANID += '<td>';
                        strImpairmentHoverSPANID += strpSkinTitle2;
                        strImpairmentHoverSPANID += strpskinDT2;
                        strImpairmentHoverSPANID += ' ';
                        strImpairmentHoverSPANID += strpSkinRSLT2;
                        strImpairmentHoverSPANID += '</td>';
                        strImpairmentHoverSPANID += '</tr>';
                    }
                    //Reset variables.
                    strEventName = "";
                    tempValue = "";
                    tempValue2 = "";

                    //Risk Assessment
                    //0 = Not Done
                    //1 = Not done 12timed
                    //2 = Met
                    //4 = Not done timed 4hr
                    switch (intRiskAssessmentCircle) {
                        case 0:
                            strEventName = i18n.SKIN_RISK_ASSESS_NOT_COMPLETED_WITHIN_24+".";
                            break;
                        case 1:
                            strEventName = i18n.SKIN_RISK_ASSESS_NOT_COMPLETED_SINCE_ADMISSION+".";
                            break;
                        case 2:
                            strEventName = i18n.SKIN_RISK_ASSESS_DOCUMENTED;
                            break;
                        case 4:
                            strEventName = i18n.SKIN_RISK_ASSESS_NOT_COMPLETED_FOR_SHIFT+".";
                            break;
                    }
                    //Build Hover
                    strRiskAssessmentHoverSPANID += '<tr>';
                    strRiskAssessmentHoverSPANID += '<td>';
                    strRiskAssessmentHoverSPANID += strEventName;
                    strRiskAssessmentHoverSPANID += '</td>';
                    strRiskAssessmentHoverSPANID += '</tr>';
                    //Reset variables.
                    strEventName = "";
                    tempValue = "";
                    tempValue2 = "";

                    //Integrity Assessment
                    //0 = Not Done
                    //1 = Not done 12timed
                    //2 = Met
                    //4 = Not done timed 4hr
                    switch (intIntegrityAssessmentCircle) {
                        case 0:
                            strEventName = i18n.SKIN_INTEGRITY_ASSESS_NOT_COMPLETED_WITHIN_24+".";
                            break;
                        case 1:
                            strEventName = i18n.SKIN_INTEGRITY_ASSESS_NOT_COMPLETED_SINCE_ADMISSION+".";
                            break;
                        case 2:
                            strEventName = i18n.SKIN_INTEGRITY_ASSESS_DOCUMENTED;
                            break;
                        case 4:
                            strEventName = i18n.SKIN_INTEGRITY_ASSESS_NOT_COMPLETED_FOR_SHIFT+".";
                            break;
                    }
                    //Build Hover
                    strIntegrityAssessmentHoverSPANID += '<tr>';
                    strIntegrityAssessmentHoverSPANID += '<td>';
                    strIntegrityAssessmentHoverSPANID += strEventName;
                    strIntegrityAssessmentHoverSPANID += '</td>';
                    strIntegrityAssessmentHoverSPANID += '</tr>';

                    //Reset variables.
                    strEventName = "";
                    tempValue = "";
                    tempValue2 = "";

                    //Interventions
                    //0 = NA
                    //1 = Not done
                    //2 = Complete
                    switch (intInterventionsCircle) {
                        case 0:
                            strEventName = "";
                            break;
                        case 1:
                            strEventName = i18n.PATIENT_AT_RISK_NO_PLAN+".";
                            break;
                        case 2:
                            strEventName = i18n.PATIENT_AT_RISK_WITH_PLAN+".";
                            break;
                    }
                    //Build Hover
                    strInterventionsHoverSPANID += '<tr>';
                    strInterventionsHoverSPANID += '<td>';
                    strInterventionsHoverSPANID += strEventName;
                    strInterventionsHoverSPANID += '</td>';
                    strInterventionsHoverSPANID += '</tr>';

                    //Build Hovers.
                    //Risk Assessment
                    strRiskAssessmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                    strRiskAssessmentHoverSPANID += "<tr><td colspan='2'>";
                    strRiskAssessmentHoverSPANID += alink;
                    strRiskAssessmentHoverSPANID += patientName;
                    strRiskAssessmentHoverSPANID += '</a>';
                    strRiskAssessmentHoverSPANID += '</td></tr>';
                    strRiskAssessmentHoverSPANID += '</table>';
                    strRiskAssessmentHoverText += '<span id="'
                    strRiskAssessmentHoverText += strRiskAssessmentHoverSPANID;
                    strRiskAssessmentHoverText += '"';
                    strRiskAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strRiskAssessmentHoverText += "'gentooltip',this.id,0,0);";
                    strRiskAssessmentHoverText += '">';
                    strRiskAssessmentHoverText += strRiskAssessmentCircle;
                    strRiskAssessmentHoverText += '</span>';

                    //Integrity Assessment
                    //if (intIntegrityAssessmentCircle > 0)
                    //{
                    strIntegrityAssessmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                    strIntegrityAssessmentHoverSPANID += "<tr><td colspan='2'>"
                    strIntegrityAssessmentHoverSPANID += alink;
                    strIntegrityAssessmentHoverSPANID += patientName;
                    strIntegrityAssessmentHoverSPANID += '</a>';
                    strIntegrityAssessmentHoverSPANID += '</td></tr>';
                    strIntegrityAssessmentHoverSPANID += '</table>';
                    strIntegrityAssessmentHoverText += '<span id="'
                    strIntegrityAssessmentHoverText += strIntegrityAssessmentHoverSPANID;
                    strIntegrityAssessmentHoverText += '"';
                    strIntegrityAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                    strIntegrityAssessmentHoverText += "'gentooltip',this.id,0,0);";
                    strIntegrityAssessmentHoverText += '">';
                    strIntegrityAssessmentHoverText += strIntegrityAssessmentCircle;
                    strIntegrityAssessmentHoverText += '</span>';
                    //}
                    //else
                    //{
                    //  strIntegrityAssessmentHoverText += '<span id="'
                    //  strIntegrityAssessmentHoverText += strIntegrityAssessmentHoverSPANID;
                    //  strIntegrityAssessmentHoverText += '">';
                    //  strIntegrityAssessmentHoverText += strIntegrityAssessmentCircle;
                    //  strIntegrityAssessmentHoverText += '</span>';
                    //}


                    //Interventions
                    if (intInterventionsCircle > 0) {
                        strInterventionsHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strInterventionsHoverSPANID += "<tr><td colspan='2'>"
                        strInterventionsHoverSPANID += alink;
                        strInterventionsHoverSPANID += patientName;
                        strInterventionsHoverSPANID += '</a>';
                        strInterventionsHoverSPANID += '</td></tr>';
                        strInterventionsHoverSPANID += '</table>';
                        strInterventionsHoverText += '<span id="'
                        strInterventionsHoverText += strInterventionsHoverSPANID;
                        strInterventionsHoverText += '"';
                        strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                        strInterventionsHoverText += '">';
                        strInterventionsHoverText += strInterventionsCircle;
                        strInterventionsHoverText += '</span>';
                    }
                    else {
                        strInterventionsHoverText += '<span id="'
                        strInterventionsHoverText += strInterventionsHoverSPANID;
                        strInterventionsHoverText += '">';
                        strInterventionsHoverText += strInterventionsCircle;
                        strInterventionsHoverText += '</span>';
                    }
                    //Skin Impairment
                    if (intImpairmentCircle > 0) {
                        strImpairmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strImpairmentHoverSPANID += "<tr><td colspan='2'>"
                        strImpairmentHoverSPANID += alink;
                        strImpairmentHoverSPANID += patientName;
                        strImpairmentHoverSPANID += '</a>';
                        strImpairmentHoverSPANID += '</td></tr>';
                        strImpairmentHoverSPANID += '</table>';
                        strImpairmentHoverText += '<span id="'
                        strImpairmentHoverText += strImpairmentHoverSPANID;
                        strImpairmentHoverText += '"';
                        strImpairmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strImpairmentHoverText += "'gentooltip',this.id,0,0);";
                        strImpairmentHoverText += '">';
                        strImpairmentHoverText += strImpairmentCircle;
                        strImpairmentHoverText += '</span>';
                    }
                    else {
                        strImpairmentHoverText += '<span id="'
                        strImpairmentHoverText += strImpairmentHoverSPANID;
                        strImpairmentHoverText += '">';
                        strImpairmentHoverText += strImpairmentCircle;
                        strImpairmentHoverText += '</span>';
                    }

                    //Build Cells.
                    //Risk Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[pskinCell];
                        tempValueX.innerHTML = strRiskAssessmentHoverText;
                    }
                    oPatData = AddToOPatData(strRiskAssessmentHoverText,oPatData,'pSkin',pSkinSbHdrDispArray[0]);
                    //Integrity Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0;

                    tempCell = parseInt(pskinCell) + parseInt(1);
                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strIntegrityAssessmentHoverText;
                    }
                    oPatData = AddToOPatData(strIntegrityAssessmentHoverText,oPatData,'pSkin',pSkinSbHdrDispArray[1]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0;

                    tempCell = parseInt(pskinCell) + parseInt(2);
                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strInterventionsHoverText;
                    }
                    oPatData = AddToOPatData(strInterventionsHoverText,oPatData,'pSkin',pSkinSbHdrDispArray[2]);
                    //Skin Impairment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0;

                    tempCell = parseInt(pskinCell) + parseInt(3);
                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = strImpairmentHoverText;
                    }
                    oPatData = AddToOPatData(strImpairmentHoverText,oPatData,'pSkin',pSkinSbHdrDispArray[3]);
                }
                else {
                    //Risk Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";

                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[pskinCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'pSkin',pSkinSbHdrDispArray[0]);
                    //Integrity Assessment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0;

                    tempCell = parseInt(pskinCell) + parseInt(1);
                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'pSkin',pSkinSbHdrDispArray[1]);
                    //Interventions
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0;

                    tempCell = parseInt(pskinCell) + parseInt(2);
                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'pSkin',pSkinSbHdrDispArray[2]);
                    //Skin Impairment
                    //Reset variables.
                    tempValueX = "";
                    tempString = "";
                    tempCell = 0;

                    tempCell = parseInt(pskinCell) + parseInt(3);
                    tempString += 'patEncounter';
                    tempString += nUniqueRowId;
                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {
                        tempValueX = document.getElementById(tempString).cells[tempCell];
                        tempValueX.innerHTML = "N/A";
                    }
                    oPatData = AddToOPatData("N/A",oPatData,'pSkin',pSkinSbHdrDispArray[3]);
                }
            }//oPatData check
        }
        blnpSkinDisplayed = true;
    }
    catch (error) {
        showErrorMessage(error.message, "fillpSkin", "", "");
        blnStatus = false;
    }
    return blnStatus;
}

/**
 * Fills the section Pediatric Skin with only qualifying values. Returns True if everything went well else it returns False.
 * @return {Boolean}
 */
function fillpSkinQualifying(){
    var blnStatus = true;
    var tempValueX = ""
    var tempValueY = ""
    var tempString = "";
    var tempValue = "";
    var tempValue2 = "";
    var tempCell = 0;
    var patientEncounterID = 0;
    var ptQual = 0;
    var strEventType = "";
    var strEventName = "";
    var strEventStatus = "";
    var strRiskAssessmentHoverText = "";
    var strRiskAssessmentHoverSPANID = "";
    var strIntegrityAssessmentHoverText = "";
    var strIntegrityAssessmentHoverSPANID = "";
    var strInterventionsHoverText = "";
    var strInterventionsHoverSPANID = "";
    var strImpairmentHoverText = "";
    var strImpairmentHoverSPANID = "";
    var strTMIND = "";
    var strRiskAssessmentCircle = "";
    var strIntegrityAssessmentCircle = "";
    var strInterventionsCircle = "";
    var strImpairmentCircle = "";
    var intRiskAssessmentCircle = 0;
    var intIntegrityAssessmentCircle = 0;
    var intInterventionsCircle = 0;
    var intImpairmentCircle = 0;
    var patientName = "";
    var alink = "";
    var patientID = "";
    var strEventDTDisp = "";
    var tempPageNum = 0;
    var strPtQualEncounterID = 0;
    var strPtQualPatientID = 0;
    var intSectionIndicator = 0;
    var strpSkinTitle1 = "";
    var strpSkinRSLT1 = "";
    var strpskinDT1 = "";
    var strpSkinTitle2 = "";
    var strpSkinRSLT2 = "";
    var strpskinDT2 = "";
    var nUniqueRowId = 0;
    var lastPatId = "";

    try {
        //Get Indicator.
        intSectionIndicator = json_data2.PTREPLY.PSKININD;

        //Verify the indicator.
        //0 = The JSON object is NOT complete.
        //1 = The JSON object is complete.
        if (intSectionIndicator == 0) {
            for (var i=0;j=patData.length,i<j; i++)
            {
                var oPatData = patData[i];

                nUniqueRowId++;

                //Reset variables.
                tempString = "";
                tempString += 'patEncounter';
                tempString += nUniqueRowId;

                //Risk Assessment
                oPatData = PopulateSection('pSkin',"N/A",tempString,oPatData,pSkinSbHdrDispArray[0]);

                //Integrity Assessment
                oPatData = PopulateSection('pSkin',"N/A",tempString,oPatData,pSkinSbHdrDispArray[1]);

                //Interventions
                oPatData = PopulateSection('pSkin',"N/A",tempString,oPatData,pSkinSbHdrDispArray[2]);

                //Skin Impairment
                oPatData = PopulateSection('pSkin',"N/A",tempString,oPatData,pSkinSbHdrDispArray[3]);
            }
        }
        else {
            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < json_data17.PSREPLY.LIST.length; intCounter++) {
                //Reset variables.
                patientEncounterID = 0;
                ptQual = 0;
                tempValueX = "";
                tempValueY = "";
                tempString = "";
                tempCell = 0;
                pwStatus = "";
                pwName = "";
                strRiskAssessmentHoverText = "";
                strRiskAssessmentHoverSPANID = "";
                strIntegrityAssessmentHoverText = "";
                strIntegrityAssessmentHoverSPANID = "";
                strInterventionsHoverText = "";
                strInterventionsHoverSPANID = "";
                strImpairmentHoverText = "";
                strImpairmentHoverSPANID = "";
                patientName = "";
                patientID = "";
                strRiskAssessmentCircle = "";
                strIntegrityAssessmentCircle = "";
                strInterventionsCircle = "";
                strImpairmentCircle = "";
                intRiskAssessmentCircle = 0;
                intIntegrityAssessmentCircle = 0;
                intInterventionsCircle = 0;
                intImpairmentCircle = 0;

                patientEncounterID = json_data17.PSREPLY.LIST[intCounter].EID;
                patientID = json_data17.PSREPLY.LIST[intCounter].PID;

                lastPatId = patientID;
                var oPatData = null;
                var objIdx = getPatObjIdxByEnctr(patientEncounterID);

                if (objIdx != null)
                {
                    oPatData = patData[objIdx];

                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                    {nUniqueRowId++;}

                    ptQual = json_data17.PSREPLY.LIST[intCounter].PTQUAL;
                    patientName = json_data17.PSREPLY.LIST[intCounter].NAME;
                    pwStatus = json_data17.PSREPLY.LIST[intCounter].PWSTATUS;
                    pwName = json_data17.PSREPLY.LIST[intCounter].PWNAME;
                    intRiskAssessmentCircle = json_data17.PSREPLY.LIST[intCounter].RISKASSESSSTAT;
                    intIntegrityAssessmentCircle = json_data17.PSREPLY.LIST[intCounter].INTEGRITYSTAT;
                    intInterventionsCircle = json_data17.PSREPLY.LIST[intCounter].INTERVSTAT;
                    intImpairmentCircle = json_data17.PSREPLY.LIST[intCounter].IMPAIRMENTSTAT;
                    strpSkinTitle1 = i18n.SKIN_INTEGRITY_IMPAIRMENT_1+" ";
                    strpSkinRSLT1 = json_data17.PSREPLY.LIST[intCounter].PSKINIMPAIRMENT1;
                    strpskinDT1 = json_data17.PSREPLY.LIST[intCounter].PSKINIMPAIRMENTDT1;
                    strpSkinTitle2 = i18n.SKIN_INTEGRITY_IMPAIRMENT_2+" ";
                    strpSkinRSLT2 = json_data17.PSREPLY.LIST[intCounter].PSKINIMPAIRMENT2;
                    strpskinDT2 = json_data17.PSREPLY.LIST[intCounter].PSKINIMPAIRMENTDT2;

                    //Verify if the patient name consist of " or ' characters.
                    //^^ = "
                    //^ = '
                    if (patientName.indexOf("^^") > -1) {
                        patientName = patientName.replace("^^", "&#34;");
                    }
                    if (patientName.indexOf("^") > -1) {
                        patientName = patientName.replace("^", "&#39;");
                    }

                    //Set link
                    alink = "<a href='" + 'javascript:launchOrders(' + patientID + ',' + patientEncounterID + ");'" +
                    " title='Open chart " +
                    patientName +
                    " to document or view specific information about the measure(s).' class='LinkText'>";

                    //Verify if PTQUAL is greater than 0.
                    if (ptQual > 0) {
                        //Verify which icon that is going to be displayed in the column.
                        //Risk Assessment
                        //0 = Not Done
                        //1 = Not done 12timed
                        //2 = Met
                        //4 = Not done timed 4hr
                        //Reset variables.
                        tempValue = "";
                        tempValue2 = "";
                        switch (intRiskAssessmentCircle) {
                            case 0:
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strRiskAssessmentCircle = tempValue;
                                break;
                            case 1:
                                //Empty Circle and Alarm Clock
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                tempValue2 += "<img src='";
                                tempValue2 += imagepath;
                                tempValue2 += img4798_16;
                                tempValue2 += "'/>";

                                strRiskAssessmentCircle += tempValue;
                                strRiskAssessmentCircle += tempValue2;
                                break;
                            case 2:
                                //Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                strRiskAssessmentCircle = tempValue;
                                break;
                            case 4:
                                //Empty Circle and Alarm Clock
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                tempValue2 += "<img src='";
                                tempValue2 += imagepath;
                                tempValue2 += img4798_16;
                                tempValue2 += "'/>";

                                strRiskAssessmentCircle += tempValue;
                                strRiskAssessmentCircle += tempValue2;
                                break;
                        }
                        //Integrity Assessment
                        //0 = Not Done
                        //1 = Not done 12timed
                        //2 = Met
                        //4 = Not done timed 4hr
                        //Reset variables.
                        tempValue = "";
                        tempValue2 = "";
                        switch (intIntegrityAssessmentCircle) {
                            case 0:
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strIntegrityAssessmentCircle = tempValue;
                                break;
                            case 1:
                                //Empty Circle and Alarm Clock
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                tempValue2 += "<img src='";
                                tempValue2 += imagepath;
                                tempValue2 += img4798_16;
                                tempValue2 += "'/>";

                                strIntegrityAssessmentCircle += tempValue;
                                strIntegrityAssessmentCircle += tempValue2;
                                break;
                            case 2:
                                //Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                strIntegrityAssessmentCircle = tempValue;
                                break;
                            case 4:
                                //Empty Circle and Alarm Clock
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";

                                tempValue2 += "<img src='";
                                tempValue2 += imagepath;
                                tempValue2 += img4798_16;
                                tempValue2 += "'/>";

                                strIntegrityAssessmentCircle += tempValue;
                                strIntegrityAssessmentCircle += tempValue2;
                                break;
                        }


                        //Interventions
                        //0 = NA
                        //1 = Not done
                        //2 = Complete
                        //Reset variable
                        tempValue = "";
                        switch (intInterventionsCircle) {
                            case 0:
                                strInterventionsCircle = "N/A";
                                break;
                            case 1:
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strInterventionsCircle = tempValue;
                                break;
                            case 2:
                                //Filled Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img3918_16;
                                tempValue += "' />";
                                strInterventionsCircle = tempValue;
                                break;
                        }
                        //Skin Impairment
                        //0 = NA
                        //1 = Incident icon
                        //Reset variable
                        tempValue = "";
                        switch (intImpairmentCircle) {
                            case 0:
                                strImpairmentCircle = "N/A";
                                break;
                            case 1:
                                //Red Triangle with White Exclamation Mark
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img6047_16;
                                tempValue += "' />";
                                strImpairmentCircle = tempValue;
                                break;
                            case 2:
                                //Red Triangle with White Exclamation Mark
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img6047_16;
                                tempValue += "' />";
                                strImpairmentCircle = tempValue;
                                break;
                        }

                        //Build Hovers.
                        // Risk Assessment
                        strRiskAssessmentHoverSPANID += '<table>';
                        //Integrity Assessment

                        if (intIntegrityAssessmentCircle > 0) {
                            strIntegrityAssessmentHoverSPANID += '<table>';
                        }
                        //Interventions
                        if (intInterventionsCircle > 0) {
                            strInterventionsHoverSPANID += '<table>';
                        }
                        //Skin Impairment
                        if (intImpairmentCircle == 1) {
                            strImpairmentHoverSPANID += '<table>';
                            strImpairmentHoverSPANID += '<tr>';
                            strImpairmentHoverSPANID += '<td>';
                            strImpairmentHoverSPANID += strpSkinTitle1;
                            strImpairmentHoverSPANID += strpskinDT1;
                            strImpairmentHoverSPANID += ' ';
                            strImpairmentHoverSPANID += strpSkinRSLT1;
                            strImpairmentHoverSPANID += '</td>';
                            strImpairmentHoverSPANID += '</tr>';
                        }
                        if (intImpairmentCircle == 2) {
                            strImpairmentHoverSPANID += '<table>';
                            strImpairmentHoverSPANID += '<tr>';
                            strImpairmentHoverSPANID += '<td>';
                            strImpairmentHoverSPANID += strpSkinTitle1;
                            strImpairmentHoverSPANID += strpskinDT1;
                            strImpairmentHoverSPANID += ' ';
                            strImpairmentHoverSPANID += strpSkinRSLT1;
                            strImpairmentHoverSPANID += '</td>';
                            strImpairmentHoverSPANID += '</tr>';
                            strImpairmentHoverSPANID += '<tr>';
                            strImpairmentHoverSPANID += '<td>';
                            strImpairmentHoverSPANID += strpSkinTitle2;
                            strImpairmentHoverSPANID += strpskinDT2;
                            strImpairmentHoverSPANID += ' ';
                            strImpairmentHoverSPANID += strpSkinRSLT2;
                            strImpairmentHoverSPANID += '</td>';
                            strImpairmentHoverSPANID += '</tr>';
                        }
                        //Reset variables.
                        strEventType = "";
                        strEventName = "";
                        strTMIND = "";
                        strEventStatus = "";
                        tempValue = "";
                        tempValue2 = "";

                        //Risk Assessment
                        //0 = Not Done
                        //1 = Not done 12timed
                        //2 = Met
                        //4 = Not done timed 4hr
                        //switch (strEventStatus)
                        switch (intRiskAssessmentCircle) {
                            case 0:
                                strEventName = i18n.SKIN_RISK_ASSESS_NOT_COMPLETED_WITHIN_24;
                                break;
                            case 1:
                                strEventName = i18n.SKIN_RISK_ASSESS_NOT_COMPLETED_SINCE_ADMISSION+".";
                                break;
                            case 2:
                                strEventName = i18n.SKIN_RISK_ASSESS_DOCUMENTED;
                                break;
                            case 4:
                                strEventName = i18n.SKIN_RISK_ASSESS_NOT_COMPLETED_FOR_SHIFT;
                                break;
                        }
                        //Build Hover
                        strRiskAssessmentHoverSPANID += '<tr>';
                        strRiskAssessmentHoverSPANID += '<td>';
                        strRiskAssessmentHoverSPANID += strEventName;
                        strRiskAssessmentHoverSPANID += '</td>';
                        strRiskAssessmentHoverSPANID += '</tr>';

                        //Reset variables.
                        strEventType = "";
                        strEventName = "";
                        strTMIND = "";
                        strEventStatus = "";
                        tempValue = "";
                        tempValue2 = "";

                        //Integrity Assessment
                        //0 = Not Done
                        //1 = Not done 12timed
                        //2 = Met
                        //4 = Not done timed 4hr
                        //switch (strEventStatus)
                        switch (intIntegrityAssessmentCircle) {
                            case 0:
                                strEventName = i18n.SKIN_INTEGRITY_ASSESS_NOT_COMPLETED_WITHIN_24;
                                break;
                            case 1:
                                strEventName = i18n.SKIN_INTEGRITY_ASSESS_NOT_COMPLETED_SINCE_ADMISSION+".";
                                break;
                            case 2:
                                strEventName = i18n.SKIN_INTEGRITY_ASSESS_DOCUMENTED;
                                break;
                            case 4:
                                strEventName = i18n.SKIN_INTEGRITY_ASSESS_NOT_COMPLETED_FOR_SHIFT+".";
                                break;
                        }
                        //Build Hover
                        strIntegrityAssessmentHoverSPANID += '<tr>';
                        strIntegrityAssessmentHoverSPANID += '<td>';
                        strIntegrityAssessmentHoverSPANID += strEventName;
                        strIntegrityAssessmentHoverSPANID += '</td>';
                        strIntegrityAssessmentHoverSPANID += '</tr>';
                        //Reset variables.
                        strEventType = "";
                        strEventName = "";
                        strTMIND = "";
                        strEventStatus = "";
                        tempValue = "";
                        tempValue2 = "";

                        //Interventions
                        //0 = NA
                        //1 = Not done
                        //2 = Complete
                        switch (intInterventionsCircle) {
                            case 0:
                                strEventName = "";
                                break;
                            case 1:
                                strEventName = i18n.PATIENT_AT_RISK_NO_PLAN+".";
                                break;
                            case 2:
                                strEventName = i18n.PATIENT_AT_RISK_WITH_PLAN+".";
                                break;
                        }
                        //Build Hover
                        strInterventionsHoverSPANID += '<tr>';
                        strInterventionsHoverSPANID += '<td>';
                        strInterventionsHoverSPANID += strEventName;
                        strInterventionsHoverSPANID += '</td>';
                        strInterventionsHoverSPANID += '</tr>';

                        //Build Hovers.
                        //Risk Assessment
                        strRiskAssessmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strRiskAssessmentHoverSPANID += "<tr><td colspan='2'>";
                        strRiskAssessmentHoverSPANID += alink;
                        strRiskAssessmentHoverSPANID += patientName;
                        strRiskAssessmentHoverSPANID += '</a>';
                        strRiskAssessmentHoverSPANID += '</td></tr>';
                        strRiskAssessmentHoverSPANID += '</table>';
                        strRiskAssessmentHoverText += '<span id="'
                        strRiskAssessmentHoverText += strRiskAssessmentHoverSPANID;
                        strRiskAssessmentHoverText += '"';
                        strRiskAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strRiskAssessmentHoverText += "'gentooltip',this.id,0,0);";
                        strRiskAssessmentHoverText += '">';
                        strRiskAssessmentHoverText += strRiskAssessmentCircle;
                        strRiskAssessmentHoverText += '</span>';

                        //Integrity Assessment

                        strIntegrityAssessmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                        strIntegrityAssessmentHoverSPANID += "<tr><td colspan='2'>"
                        strIntegrityAssessmentHoverSPANID += alink;
                        strIntegrityAssessmentHoverSPANID += patientName;
                        strIntegrityAssessmentHoverSPANID += '</a>';
                        strIntegrityAssessmentHoverSPANID += '</td></tr>';
                        strIntegrityAssessmentHoverSPANID += '</table>';
                        strIntegrityAssessmentHoverText += '<span id="'
                        strIntegrityAssessmentHoverText += strIntegrityAssessmentHoverSPANID;
                        strIntegrityAssessmentHoverText += '"';
                        strIntegrityAssessmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                        strIntegrityAssessmentHoverText += "'gentooltip',this.id,0,0);";
                        strIntegrityAssessmentHoverText += '">';
                        strIntegrityAssessmentHoverText += strIntegrityAssessmentCircle;
                        strIntegrityAssessmentHoverText += '</span>';

                        //Interventions
                        if (intInterventionsCircle > 0) {
                            strInterventionsHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                            strInterventionsHoverSPANID += "<tr><td colspan='2'>"
                            strInterventionsHoverSPANID += alink;
                            strInterventionsHoverSPANID += patientName;
                            strInterventionsHoverSPANID += '</a>';
                            strInterventionsHoverSPANID += '</td></tr>';
                            strInterventionsHoverSPANID += '</table>';
                            strInterventionsHoverText += '<span id="'
                            strInterventionsHoverText += strInterventionsHoverSPANID;
                            strInterventionsHoverText += '"';
                            strInterventionsHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                            strInterventionsHoverText += "'gentooltip',this.id,0,0);";
                            strInterventionsHoverText += '">';
                            strInterventionsHoverText += strInterventionsCircle;
                            strInterventionsHoverText += '</span>';
                        }
                        else {
                            strInterventionsHoverText += '<span id="'
                            strInterventionsHoverText += strInterventionsHoverSPANID;
                            strInterventionsHoverText += '">';
                            strInterventionsHoverText += strInterventionsCircle;
                            strInterventionsHoverText += '</span>';
                        }
                        //Skin Impairment
                        if (intImpairmentCircle > 0) {
                            strImpairmentHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                            strImpairmentHoverSPANID += "<tr><td colspan='2'>"
                            strImpairmentHoverSPANID += alink;
                            strImpairmentHoverSPANID += patientName;
                            strImpairmentHoverSPANID += '</a>';
                            strImpairmentHoverSPANID += '</td></tr>';
                            strImpairmentHoverSPANID += '</table>';
                            strImpairmentHoverText += '<span id="'
                            strImpairmentHoverText += strImpairmentHoverSPANID;
                            strImpairmentHoverText += '"';
                            strImpairmentHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                            strImpairmentHoverText += "'gentooltip',this.id,0,0);";
                            strImpairmentHoverText += '">';
                            strImpairmentHoverText += strImpairmentCircle;
                            strImpairmentHoverText += '</span>';
                        }
                        else {
                            strImpairmentHoverText += '<span id="'
                            strImpairmentHoverText += strImpairmentHoverSPANID;
                            strImpairmentHoverText += '">';
                            strImpairmentHoverText += strImpairmentCircle;
                            strImpairmentHoverText += '</span>';
                        }

                        //Build Cells.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Risk Assessment
                        oPatData = PopulateSection('pSkin',strRiskAssessmentHoverText,tempString,oPatData,pSkinSbHdrDispArray[0]);

                        //Integrity Assessment
                        oPatData = PopulateSection('pSkin',strIntegrityAssessmentHoverText,tempString,oPatData,pSkinSbHdrDispArray[1]);

                        //Interventions
                        oPatData = PopulateSection('pSkin',strInterventionsHoverText,tempString,oPatData,pSkinSbHdrDispArray[2]);

                        //Skin Impairment
                        oPatData = PopulateSection('pSkin',strImpairmentHoverText,tempString,oPatData,pSkinSbHdrDispArray[3]);
                    }
                    else {

                        //Reset variables.
                        tempString = "";
                        tempString += 'patEncounter';
                        tempString += nUniqueRowId;

                        //Risk Assessment
                        oPatData = PopulateSection('pSkin',"N/A",tempString,oPatData,pSkinSbHdrDispArray[0]);

                        //Integrity Assessment
                        oPatData = PopulateSection('pSkin',"N/A",tempString,oPatData,pSkinSbHdrDispArray[1]);

                        //Interventions
                        oPatData = PopulateSection('pSkin',"N/A",tempString,oPatData,pSkinSbHdrDispArray[2]);

                        //Skin Impairment
                        oPatData = PopulateSection('pSkin',"N/A",tempString,oPatData,pSkinSbHdrDispArray[3]);
                    }
                }
            }
        } //intSectionIndicator
        SortPatData(lastSortField);
    }
    catch (error) {
        showErrorMessage(error.message, "fillpSkinQualifying", "", "");
        blnStatus = false;
    }
    return blnStatus;
}


/**
 * Gets displayed value.
 * @param {String} str String value.
 * @return {String}
 */
function get_dispval(str){
    var returnValue = "";

    try {
        if (!str) {
            returnValue = " ";
        }
        else {
            returnValue = str;
        }
    }
    catch (error) {
        showErrorMessage(error.message, "get_dispval", "", "");
    }
    return returnValue;
}

/**
 * Gets the value Day or Days or a empty string.
 * @param {String} str String value.
 * @return {String}
 */
function get_dayword(str){
    var returnValue = "";

    try {
        if (str == " ") {
            returnValue = " ";
        }
        else
            if (parseInt(str) == 1) {
                returnValue = " Day";
            }
            else
                if (parseInt(str) > 1) {
                    returnValue = " Days";
                }
                else {
                    returnValue = " ";
                }
    }
    catch (error) {
        showErrorMessage(error.message, "get_dayword", "", "");
    }
    return returnValue;
}

function sortbyseq(seq, a, b){
    return ((a[seq] < b[seq]) ? -1 : ((a[seq] > b[seq]) ? 1 : 0));
}

function sortbyDispInd(dispInd, a, b){
    return ((a.dispInd < b.dispInd) ? -1 : ((a.dispInd > b.dispInd) ? 1 : 0));
}

function CreateColHtml(htmlTable,strSecNm,strSecId)
{
    try
    {
        var secId = "secpatlisthdr" + strSecNm;
        var divId = "div" + strSecId + "text";
        var strDivTtl = i18n.condDisp.CLICK_TO_EXPAND + strSecNm + i18n.condDisp.INFORMATION;

        htmlTable += '<td id="' + secId + '" class="tabhdrs2g CellWidth40">';
        htmlTable += '<div id="' + divId + '" title="' + strDivTtl + '" class="mainColumn2g" onclick=\'expandCollapseSection("' + strSecId.toUpperCase() + '");\'>+</div>';
        htmlTable += '</td>';

        return htmlTable;
    }
    catch (error)
    {
        showErrorMessage(error.message,"CreateColHtml","Section Name" + " = "+strSecNm,"\n htmlTable = \n"+htmlTable);
    }
}

function CreateHtmlSubHdrs(htmlTable)
{
    try
    {
        for (f=0;l=oColHdrs.length,f<l;f++)
        {
            oColHdr = oColHdrs[f];
            if (oColHdr.dispInd > 0)
            {
                var numCols = null;
                if (IsValInArray(sixColHdrs,oColHdr.strSecNm))
                {numCols = 6;}
                else if (IsValInArray(threeColHdrs,oColHdr.strSecNm))
                {numCols = 3;}
                else if (IsValInArray(fourColHdrs,oColHdr.strSecNm))
                {numCols = 4;}
                if (numCols != null)
                {
                    htmlTable = CreateHtmlSubHdr(htmlTable,oColHdr.strSecNm,numCols);
                }
            }
        }
        return htmlTable;
    }
    catch (error)
    {
        showErrorMessage(error.message,"CreateHtmlSubHdrs","htmlTable = \n"+htmlTable,"");
    }
}

function CreateHtmlSubHdr(htmlTable,strSecNm,numCols)
{
    try
    {
        var tdId = "secsubcol" + strSecNm;

        htmlTable += '<td id="' + tdId + 1 + '" class="tabhdrs2g CellWidth40"></td>';

        for (i=2;j=numCols+1,i<j;i++)
        {
            htmlTable += '<td id="' + tdId + i + '" style="display:none;" class="CellWidth0"></td>';
        }
        return htmlTable;
    }
    catch (error)
    {
        showErrorMessage(error.message,"CreateHtmlSubHdr","Section Name" + " = "+strSecNm,"Number Columns = "+numCols);
    }
}

function IsValInArray(array,val)
{
    try
    {
        for(k=0;k<array.length;k++)
        {
            var tempVal = array[k];
            if (tempVal === val)
            {
                return true;
            }
        }
    }
    catch (error)
    {
        showErrorMessage(error.message,"IsValInArray","Array = "+array,"val = "+val);
    }
}

function CreateHtmlSubHdrsVert(htmlTable,strSecNm,hdrDispArray,intNumber,tempCounter)
{
    try
    {
        var tdId = hdrDispArray[0];

        if (tempCounter == 0)
        {
            htmlTable += '<td id="' + tdId + '" class="tabhdrsVertical CellWidth40" rowspan="50" valign="bottom">' + strSecNm + '</td>';
        }
        else
        {
            htmlTable += '<td id="';
            htmlTable += tdId;
            htmlTable += intNumber;
            htmlTable += '" style="display:none;" class="CellWidth0"></td>';
        }
        for (i=1;j=hdrDispArray.length,i<j;i++)
        {
            tdId = hdrDispArray[i];

            htmlTable += '<td id="';
            htmlTable += tdId;
            htmlTable += intNumber;
            htmlTable += '" style="display:none;" class="CellWidth0"></td>';
        }
        return htmlTable;
    }
    catch (error)
    {
        showErrorMessage(error.message,"CreateHtmlSubHdrsVert","Display Array = "+hdrDispArray,"intNumber = "+intNumber+"\n tempCounter = "+tempCounter);
    }
}

function getPatObjIdxByEnctr(patEnctr)
{
    try
    {
        var oPatData;
        for (g=0;h=patData.length,g<h;g++)
        {
            oPatData = patData[g];

            if (parseFloat(oPatData.enctr_id) == parseFloat(patEnctr))
            {
                return g;
            }
        }
        return null;
    }
    catch (error)
    {
        showErrorMessage(error.message,"getPatObjIdxByEnctr","Patient Encounter = "+patEnctr,"");
    }
}

function getPatObjIdx(patientID)
{
    try
    {
        var oPatData;
        for (g=0;h=patData.length,g<h;g++)
        {
            oPatData = patData[g];

            if (parseFloat(oPatData.patId) == parseFloat(patientID))
            {
                return g;
            }
        }
        return null;
    }
    catch (error)
    {
        showErrorMessage(error.message,"getPatObjIdx","Patient ID = "+patientID,"");
    }
}

function LoadPatDataObj(json_patients)
{
    try
    {
        for (i = 0; j = json_patients.PTREPLY.PATIENTS.length, i < j; i++)
        {
            var oDob = new Date();
            var oPatData = new Object();

            oPatData.ENCNTR_ID = json_patients.PTREPLY.PATIENTS[i].ENCNTR_ID;
            oPatData.patId = json_patients.PTREPLY.PATIENTS[i].PT_ID;
            var resp = getPatObjIdxByEnctr(oPatData.ENCNTR_ID);

            if (resp == null)
            {
                oPatData.name = json_patients.PTREPLY.PATIENTS[i].NAME;
                oPatData.enctr_id = json_patients.PTREPLY.PATIENTS[i].ENCNTR_ID;
                oPatData.dob = json_patients.PTREPLY.PATIENTS[i].BIRTH_DT;
                oPatData.dobJs = json_patients.PTREPLY.PATIENTS[i].BIRTHDTJS;
                oPatData.oDob = oPatData.dobJs.slice(7,10) + oPatData.dobJs.slice(4,5) + oPatData.dobJs.slice(1,2)

                oPatData.EID = json_patients.PTREPLY.PATIENTS[i].EID;
                oPatData.ptQual = json_patients.PTREPLY.PATIENTS[i].ptQual;
                oPatData.patientNameAssess = json_patients.PTREPLY.PATIENTS[i].NAME;
                oPatData.pwStatus = json_patients.PTREPLY.PATIENTS[i].pwStatus;
                oPatData.pwName = json_patients.PTREPLY.PATIENTS[i].pwName;
                oPatData.intEDCircle = json_patients.PTREPLY.PATIENTS[i].intEDCircle;
                oPatData.intInpatientCircle = json_patients.PTREPLY.PATIENTS[i].intInpatientCircle;
                oPatData.intDischargeCircle = json_patients.PTREPLY.PATIENTS[i].intDischargeCircle;
                oPatData.intPreOpCircle = json_patients.PTREPLY.PATIENTS[i].intPreOpCircle;
                oPatData.intPostOpCircle = json_patients.PTREPLY.PATIENTS[i].intPostOpCircle;

                if (oPatData.dobJs)
                {
                    oPatData.oDob = oPatData.dobJs.slice(6,10) + oPatData.dobJs.slice(0,2) + oPatData.dobJs.slice(3,5)
                }
                else {oPatData.oDob = null;}

                oPatData.enctrTypeCd = json_patients.PTREPLY.PATIENTS[i].ENCNTR_TYPECD;
                oPatData.admitDt = json_patients.PTREPLY.PATIENTS[i].ADMIT_DT;
                oPatData.admitDtJs = json_patients.PTREPLY.PATIENTS[i].ADMITDTJS
                oPatData.facCd = json_patients.PTREPLY.PATIENTS[i].FACILITYCD;
                oPatData.orgId = json_patients.PTREPLY.PATIENTS[i].ORG_ID;
                oPatData.pageNum = json_patients.PTREPLY.PATIENTS[i].PAGENUM;
                oPatData.dobJs = json_patients.PTREPLY.PATIENTS[i].BIRTHDTJS;
                oPatData.mrn = json_patients.PTREPLY.PATIENTS[i].MRN;
                oPatData.fin = json_patients.PTREPLY.PATIENTS[i].FIN;
                if (oPatData.fin)
                {oPatData.intFin = parseInt(oPatData.fin,10);}
                else
                {oPatData.intFin = 0;}
                if (oPatData.mrn)
                {oPatData.mrn = parseInt(oPatData.mrn,10);}
                else
                {oPatData.mrn = 0;}
                oPatData.room = json_patients.PTREPLY.PATIENTS[i].ROOM;
                oPatData.bed = json_patients.PTREPLY.PATIENTS[i].BED;
                oPatData.roomBed = oPatData.room + "/" + oPatData.bed;
                oPatData.nurseUnit = json_patients.PTREPLY.PATIENTS[i].NURSE_UNIT;
                oPatData.surgDtJs = json_patients.PTREPLY.PATIENTS[i].SURGDTJS;
                oPatData.age = json_patients.PTREPLY.PATIENTS[i].AGE;
                oPatData.nurse = json_patients.PTREPLY.PATIENTS[i].NURSE;
                oPatData.atndPhys = json_patients.PTREPLY.PATIENTS[i].ATTEND_PHY;
                oPatData.los = parseInt(json_patients.PTREPLY.PATIENTS[i].LOS) + get_dayword(json_patients.PTREPLY.PATIENTS[i].LOS);
                oPatData.visitReason = json_patients.PTREPLY.PATIENTS[i].VISITREASON;

                patData.push(oPatData);

                var alrtStr = "";

                alrtStr += "\n name = " + oPatData.name;
                alrtStr += "\n patId = " + oPatData.patId;
                alrtStr += "\n enctr_id = " + oPatData.enctr_id;
                alrtStr += "\n dob = " + oPatData.dob;
                alrtStr += "\n oDob = " + oPatData.oDob;
                alrtStr += "\n enctrTypeCd = " + oPatData.enctrTypeCd;
                alrtStr += "\n admitDt = " + oPatData.admitDt;
                alrtStr += "\n admitDtJs = " + oPatData.admitDtJs;
                alrtStr += "\n facCd = " + oPatData.facCd;
                alrtStr += "\n orgId = " + oPatData.orgId;
                alrtStr += "\n pageNum = " + oPatData.pageNum;
                alrtStr += "\n dobJs = " + oPatData.dobJs;
                alrtStr += "\n mrn = " + oPatData.mrn;
                alrtStr += "\n fin = " + oPatData.fin;
                alrtStr += "\n room = " + oPatData.room;
                alrtStr += "\n bed = " + oPatData.bed;
                alrtStr += "\n room/bed = " + oPatData.roomBed;
                alrtStr += "\n nurseUnit = " + oPatData.nurseUnit;
                alrtStr += "\n age = " + oPatData.age;
                alrtStr += "\n atndPhys = " + oPatData.atndPhys;
                alrtStr += "\n los = " + oPatData.los;
                alrtStr += "\n surgDtJs = " + oPatData.surgDtJs;
                alrtStr += "\n visitReason = " + oPatData.visitReason;
            }
        }

        pageCNT = Math.ceil(patData.length/rowTotal);
        ReAssignPageNumbers(rowTotal);
    }
    catch (error)
    {
        showErrorMessage(error.message,"LoadPatDataObj","Patient Demographics: \n"+alrtStr,"");
    }
}

function DisplayInd(strSecName)
{
    var oColHdr = null;
    for(s=0;t=oColHdrs.length,s<t;s++)
    {
        oColHdr = oColHdrs[s];
        if (oColHdr.strSecNm == strSecName)
        {
            return oColHdr.dispInd;
        }
    }
    oColHdr = null;
    return null;
}

function buildPatDemogTable(oPatData,rowNum,hideRow,uniqueRowNumber)
{
    try
    {
        var htmlTable = "";

        htmlTable += '</tr>';

        //Hide Row.
        htmlTable += hideRow;
        htmlTable += uniqueRowNumber;
        htmlTable += '">';
        htmlTable += '<td id="ja'+ uniqueRowNumber + '" colspan="3" width="350px">'; //015 remove/add expanded demographics info was colspan 3 and width 345px
        htmlTable += '<span id="rowbtn';
        htmlTable += rowNum;
        htmlTable += '" style="display:none">';
        htmlTable += '<table>'

        htmlTable += '<tr>';

        //Age
        if (DisplayInd('ageDemoDisplayInd') == '1') //015 remove/add expanded demographics added if() statements
        {
            htmlTable += '<td class="disptxt" valign="top">'+i18n.demog.AGE+':<br><span id="demogAge' + rowNum + '" class="valtxt">';
            htmlTable += oPatData.age;
            htmlTable += "</span></td>";
        }
        //Room/Bed
        if (DisplayInd('rmBedDemoDisplayInd') == '1') //015 remove/add expanded demographics added if() statements
        {
            htmlTable += '<td class="disptxt" valign="top">'+i18n.demog.ROOM_BED+':<br><span id="demogRoomBed' + rowNum + '" class="valtxt">';
            htmlTable += oPatData.roomBed;
            htmlTable += "</span></td>";
        }
        //Location
        if (DisplayInd('locDemoDisplayInd') == '1') //015 remove/add expanded demographics added if() statements
        {
            htmlTable += '<td class="disptxt" valign="top">'+i18n.demog.LOCATION+':<br><span id="demogNurseUnit' + rowNum + '" class="valtxt">'
            htmlTable += oPatData.nurseUnit;
            htmlTable += "</span></td>";
        }
        //Attending Physician
        if (DisplayInd('phyDemoDisplayInd') == '1') //015 remove/add expanded demographics added if() statements
        {
            htmlTable += '<td class="disptxt" valign="top">'+i18n.demog.ATTENDING_PHYSICIAN+':<br><span id="demogAttendPhys' + rowNum + '" class="valtxt">';
            htmlTable += oPatData.atndPhys;
            htmlTable += "</span></td>";
            //htmlTable += '</tr>'; 0015
            //htmlTable += '<tr>'; 0015
        }

        //Patient Arrival Date/Time
        if (DisplayInd('admitDemoDisplayInd') == '1')//015 remove/add expanded demographics added if() statements
        {
            htmlTable += '<td class="disptxt" valign="top">'+i18n.demog.PATIENT_ARRIVAL_DTTM+':<br><span id="demogAdmitDtJs' + rowNum + '" class="valtxt">';
            htmlTable += oPatData.admitDtJs;
            htmlTable += "</span></td>";
        }
        //Nurse Assigned:
        if (DisplayInd('nurseDemoDisplayInd') == '1') //015 remove/add expanded demographics added if() statements
        {
            htmlTable += '<td class="disptxt" valign="top">'+i18n.demog.NURSE_ASSIGNED+':<br><span id="demogNurse' + rowNum + '" class="valtxt">';
            htmlTable += oPatData.nurse;
            htmlTable += "</span></td>";
        }
        //Surgical Date/Time
        if (DisplayInd('surgDtDemoDisplayInd') == '1') //015 remove/add expanded demographics added if() statements
        {
            htmlTable += '<td class="disptxt" valign="top">'+i18n.demog.SURGICAL_DTTM+':<br><span id="demogSurgDtJs' + rowNum + '" class="valtxt">';
            htmlTable += oPatData.surgDtJs;
            htmlTable += "</span></td>";
        }
        //Length Of Stay
        if (DisplayInd('losDemoDisplayInd') == '1') //015 remove/add expanded demographics added if() statements
        {
            htmlTable += '<td class="disptxt" valign="top">'+i18n.demog.LENGTH_OF_STAY+':<br><span id="demogLos' + rowNum + '" class="valtxt">';
            htmlTable += parseInt(oPatData.los);
            htmlTable += get_dayword(oPatData.los);
            htmlTable += "</span></td>";
        }
        htmlTable += '</tr>';
        //htmlTable += '<tr>';

        //Reason for Visit
        if (DisplayInd('visitDemoDisplayInd') == '1')//015 remove/add expanded demographics added if() statements
        {
            htmlTable += '<tr>';
            htmlTable += '<td class="disptxt" valign="top" colspan="4">'+i18n.demog.REASON_FOR_VISIT+':<br><span id="demogVisitReason' + rowNum + '" class="valtxt">';
            htmlTable += oPatData.visitReason;
            htmlTable += "</span></td>";
            htmlTable += '</tr>';
        }
        //015 split out from above
        htmlTable += '</table>'; //End Hide Row.
        htmlTable += '</span></td>';
        htmlTable += '</tr>';

        oPatData.demogHtml = htmlTable;

        return htmlTable;
    }
    catch (error)
    {
        showErrorMessage(error.message,"buildPatDemogTable","Patient Name = "+oPatData.name,"Row = "+rowNum);
    }
}

function HideRow(htmlTable,tempEncounterID,rowNum)
{
    try
    {
        var hideRow = "";
        var oHtmlObj = new Object();
        if (rowNum % 2 == 0) {
            htmlTable += '<tr class="RowTypeBlue mainRow2g" id="';
            htmlTable += tempEncounterID;
            htmlTable += '">';

            hideRow = "";
            hideRow += '<tr class="RowTypeBlue" id="trrowbtn';
        }
        else {
            htmlTable += '<tr class="RowTypeWhite mainRow2g" id="';
            htmlTable += tempEncounterID;
            htmlTable += '">';

            hideRow = "";
            hideRow += '<tr class="RowTypeWhite" id="trrowbtn';
        }

        oHtmlObj.hideRow = hideRow;
        oHtmlObj.htmlTable = htmlTable;
        return oHtmlObj;
    }
    catch (error)
    {
        showErrorMessage(error.message,"HideRow","Encounter ID = "+tempEncounterID,"Row = "+rowNum+"\n hideRow = "+hideRow+"\n htmlTable = "+htmlTable);
    }
}

function CollapseAllDemog()
{
    try
    {
        var totRows = 0;

        if (patData.length < rowTotal)
        {totRows = patData.length;}
        else
        {totRows = rowTotal;}

        for (rowNum=1;rowNum<totRows+1;rowNum++)
        {
            var rowId = "rowbtn" + rowNum;
            if (trim(document.getElementById("ec|rowbtn"+rowNum).innerHTML) == '[-]')
            {
                expandCollapseTable(rowId);
            }
        }
    }
    catch (error)
    {
        showErrorMessage(error.message,"CollapseAllDemog","","Row = "+rowNum);
    }
}

function PopulatePatientInfo()
{
    try
    {
        var oPatData = null;
        var rowCntr = 0;
        var strPatientName = "";
        var htmlTable = "";
        tabNameSTRG1 = encodeURIComponent(tabNameSTRG);
        tabNameSTRG1 = encodeURIComponent(tabNameSTRG1);
        for(patIdx=0;patCnt=patData.length,patIdx<patCnt;patIdx++)
        {
            oPatData = patData[patIdx];
            if (oPatData)
            {
                if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                {
                    rowCntr++;
                    CollapseAllDemog();

                    var alink = '<a href=`' + "javascript:launchTab(/" + tabNameSTRG1 + "/," + oPatData.patId + "," + oPatData.enctr_id + ');`' +  //017
                    ' title="'+i18n.OPEN_THE+' ' +
                    //017 'Patient Information' +
                    tabNameSTRG + //017 adding tab name from users position to the hover
                    ' tab." class="LinkText">';

                    strPatientName = oPatData.name;

                    htmlTable = '<span id="ec|rowbtn';
                    htmlTable += rowCntr;
                    htmlTable += '" title="'+i18n.demog.CLICK_TO_EXP_PAT_INFO_HVR+'" onclick="javascript:expandCollapseTable(';
                    htmlTable += "'rowbtn";
                    htmlTable += rowCntr;
                    htmlTable += "');";
                    htmlTable += '" class="spanCursor2g">[+] ';
                    htmlTable += '</span>';
                    htmlTable += alink;

                    //Verify if the patient name consist of " or ' characters.
                    //^^ = "
                    //^ = '
                    if (strPatientName.indexOf("^^") > -1) {
                        strPatientName = strPatientName.replace("^^", "&#34;");
                    }
                    if (strPatientName.indexOf("^") > -1) {
                        strPatientName = strPatientName.replace("^", "&#39;");
                    }

                    htmlTable += strPatientName;
                    htmlTable += '</a>';
                    document.getElementById('patientname' + rowCntr).innerHTML = htmlTable;
                    document.getElementById('patientbdttm' + rowCntr).innerHTML = oPatData.dobJs;
                if (strMrnFin.toLowerCase() == "f") {
                    document.getElementById('patientfin' + rowCntr).innerHTML = oPatData.fin;
                }
                else {
                    document.getElementById('patientmrn' + rowCntr).innerHTML = oPatData.mrn;
                }
                    if (strRmBd == 1)
                    {document.getElementById('roombed' + rowCntr).innerHTML = oPatData.roomBed;}
                    //demog section
                    if (DisplayInd('ageDemoDisplayInd') == '1')
                    {document.getElementById('demogAge' + rowCntr).innerHTML = oPatData.age;}

                    if (DisplayInd('rmBedDemoDisplayInd') == '1')
                    {document.getElementById('demogRoomBed' + rowCntr).innerHTML = oPatData.roomBed;}

                    if (DisplayInd('locDemoDisplayInd') == '1')
                    {document.getElementById('demogNurseUnit' + rowCntr).innerHTML = oPatData.nurseUnit;}

                    if (DisplayInd('phyDemoDisplayInd') == '1')
                    {document.getElementById('demogAttendPhys' + rowCntr).innerHTML = oPatData.atndPhys;}

                    if (DisplayInd('admitDemoDisplayInd') == '1')
                    {document.getElementById('demogAdmitDtJs' + rowCntr).innerHTML = oPatData.admitDtJs;}

                    if (DisplayInd('nurseDemoDisplayInd') == '1')
                    {document.getElementById('demogNurse' + rowCntr).innerHTML = oPatData.nurse;}

                    if (DisplayInd('surgDtDemoDisplayInd') == '1')
                    {document.getElementById('demogSurgDtJs' + rowCntr).innerHTML = oPatData.surgDtJs;}

                    if (DisplayInd('losDemoDisplayInd') == '1')
                    {document.getElementById('demogLos' + rowCntr).innerHTML = oPatData.los;}

                    if (DisplayInd('visitDemoDisplayInd') == '1')
                    {document.getElementById('demogVisitReason' + rowCntr).innerHTML = oPatData.visitReason;}

                    InsertOPatData(oPatData,rowCntr);
                    if (rowCntr == rowTotal){patIdx=patCnt;}
                }
            }
        }
        totalPatients = GetNumPgRecords();
        if (totalPatients < rowTotal)
        {
            HideRows(totalPatients + 1);
        }

        setTimeout("hideLoadText()",hideLoadTextDelay);
    }
    catch (error)
    {
        showErrorMessage(error.message,"PopulatePatientInfo","name = "+oPatData.name,"\n rowCntr = "+rowCntr+"\n currentPage = "+currentPage);
        setTimeout("hideLoadText()",hideLoadTextDelay);
    }

}


function SortPatData(sortField)
{
    try
    {
        var oPatDataA = patData[0];
        var oPatDataB = patData[patData.length-1];
        switch (sortField)
        {
            case 'name':
                if (oPatDataA.name<oPatDataB.name)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('name', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('name', a, b, 0)
                    })
                }
                break;
            case 'dob':
                if (oPatDataA.oDob<oPatDataB.oDob)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('oDob', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('oDob', a, b, 0)
                    })
                }
                break;
            case 'fin':
                if (oPatDataA.intFin<oPatDataB.intFin)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('intFin', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('intFin', a, b, 0)
                    })
                }
                break;
            case 'mrn':
                if (oPatDataA.mrn<oPatDataB.mrn)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('mrn', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('mrn', a, b, 0)
                    })
                }
                break;
            case 'roomBed':
                if (oPatDataA.roomBed<oPatDataB.roomBed)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('roomBed', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('roomBed', a, b, 0)
                    })
                }
                break;
            case 'patientStatus':
                if (oPatDataA.patientStatus<oPatDataB.patientStatus)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatus', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatus', a, b, 0)
                    })
                }
                break;
            case 'patientStatusHeartFailure':
                if (oPatDataA.patientStatusHeartFailure<oPatDataB.patientStatusHeartFailure)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusHeartFailure', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusHeartFailure', a, b, 0)
                    })
                }
                break;
            case 'patientStatusPneumonia':
                if (oPatDataA.patientStatusPneumonia<oPatDataB.patientStatusPneumonia)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusPneumonia', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusPneumonia', a, b, 0)
                    })
                }
                break;
            case 'patientStatusChildrensAsthma':
                if (oPatDataA.patientStatusChildrensAsthma<oPatDataB.patientStatusChildrensAsthma)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusChildrensAsthma', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusChildrensAsthma', a, b, 0)
                    })
                }
                break;
            case 'patientStatusVTE':
                if (oPatDataA.patientStatusVTE<oPatDataB.patientStatusVTE)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusVTE', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusVTE', a, b, 0)
                    })
                }
                break;
            case 'patientStatusStroke':
                if (oPatDataA.patientStatusStroke<oPatDataB.patientStatusStroke)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusStroke', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusStroke', a, b, 0)
                    })
                }
                break;
            case 'patientStatusSCIP':
                if (oPatDataA.patientStatusSCIP<oPatDataB.patientStatusSCIP)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusSCIP', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusSCIP', a, b, 0)
                    })
                }
                break;

            case 'patientStatusImm':
                if (oPatDataA.patientStatusImm<oPatDataB.patientStatusImm)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusImm', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusImm', a, b, 0)
                    })
                }
                break;

            case 'patientStatusTob':
                if (oPatDataA.patientStatusTob<oPatDataB.patientStatusTob)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusTob', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusTob', a, b, 0)
                    })
                }
                break;
            case 'patientStatusSub':
                if (oPatDataA.patientStatusSub<oPatDataB.patientStatusSub)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusSub', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusSub', a, b, 0)
                    })
                }
                break;
            case 'patientStatusPc':
                if (oPatDataA.patientStatusPc<oPatDataB.patientStatusPc)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusPc', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusPc', a, b, 0)
                    })
                }
                break;
            case 'patientStatusHbips':
                if (oPatDataA.patientStatusHbips<oPatDataB.patientStatusHbips)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusHbips', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusHbips', a, b, 0)
                    })
                }
                break;
            case 'patientStatusSepsis':
                if (oPatDataA.patientStatusSepsis<oPatDataB.patientStatusSepsis)
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusSepsis', a, b, 1)
                    })
                }
                else
                {
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusSepsis', a, b, 0)
                    })
                }
                break;
            case 'patientStatusHS':
                if (oPatDataA.patientStatusHS<oPatDataB.patientStatusHS){
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusHS', a, b, 1)
                    })
                }
                else{
                    patData.sort(function(a, b){
                        return sortbyObjField('patientStatusHS', a, b, 0)
                    })
                }
                break;
        }
        lastSortField = sortField;
        patData = ReAssignPageNumbers(rowTotal);
        ReorderStrPatientDemog();
        PopulatePatientInfo();
    }
    catch (error)
    {
        showErrorMessage(error.message,"SortPatData","sortField = "+sortField,"a = "+a+"\n b = "+b);
    }
}

function sortbyObjField(sortField, a, b, dir){
    try
    {
        if (parseInt(dir)===parseInt(0))
        {return ((a[sortField] < b[sortField]) ? -1 : ((a[sortField] > b[sortField]) ? 1 : 0));}
        else
        {return ((a[sortField] < b[sortField]) ? 1 : ((a[sortField] > b[sortField]) ? -1 : 0));}
    }
    catch (error)
    {
        showErrorMessage(error.message,"sortbyObjField","sortField = "+sortField,"sort direction = "+dir+"\n a = "+a+"\n b = "+b);
    }
}

function ReAssignPageNumbers(recsPerPg)
{
    try
    {
        var pgCntr = 1;
        var rowCntr = 1;
        var oPatData = null;
        for (a=0;b=patData.length,a<b;a++)
        {
            if (rowCntr % (parseInt(recsPerPg)+parseInt(1)) == 0)
            {
                pgCntr++;
                rowCntr = 1;
            }
            rowCntr++;
            oPatData = patData[a];
            oPatData.pageNum = pgCntr;

            var alrtStr = "\n name = " + oPatData.name;
            alrtStr += "\n patId = " + oPatData.patId;
            alrtStr += "\n enctr_id = " + oPatData.enctr_id;
            alrtStr += "\n dob = " + oPatData.dob;
            alrtStr += "\n enctrTypeCd = " + oPatData.enctrTypeCd;
            alrtStr += "\n admitDt = " + oPatData.admitDt;
            alrtStr += "\n admitDtJs = " + oPatData.admitDtJs;
            alrtStr += "\n facCd = " + oPatData.facCd;
            alrtStr += "\n orgId = " + oPatData.orgId;
            alrtStr += "\n pageNum = " + oPatData.pageNum;
            alrtStr += "\n dobJs = " + oPatData.dobJs;
            alrtStr += "\n mrn = " + oPatData.mrn;
            alrtStr += "\n fin = " + oPatData.fin;
            alrtStr += "\n room = " + oPatData.room;
            alrtStr += "\n bed = " + oPatData.bed;
            alrtStr += "\n room/bed = " + oPatData.roomBed;
            alrtStr += "\n nurseUnit = " + oPatData.nurseUnit;
            alrtStr += "\n age = " + oPatData.age;
            alrtStr += "\n atndPhys = " + oPatData.atndPhys;
            alrtStr += "\n los = " + oPatData.los;
            alrtStr += "\n surgDtJs = " + oPatData.surgDtJs;
            alrtStr += "\n visitReason = " + oPatData.visitReason;

        }
        return patData;
    }
    catch (error)
    {
        showErrorMessage(error.message,"ReAssignPageNumbers","patient demographics: \n"+alrtStr,"page = "+pgCntr+"\n row = "+rowCntr);
    }
}

function ReorderStrPatientDemog()
{
    try
    {
        strPatientDemog = "";
        for (var i=0;j=patData.length,i<j;i++)
        {
            var oPatData = patData[i];

            if (i == 0)
            {
                strPatientDemog += '{"PID":';
                strPatientDemog += oPatData.patId;
                strPatientDemog += ',"EID":';
                strPatientDemog += oPatData.enctr_id;
                strPatientDemog += ',"NAME":"';
                strPatientDemog += oPatData.name;
                strPatientDemog += '","BIRTHDT":"';
                strPatientDemog += oPatData.dob;
                strPatientDemog += '","EIDTYPE":';
                strPatientDemog += oPatData.enctrTypeCd;
                strPatientDemog += ',"ADMITDT":"';
                strPatientDemog += oPatData.admitDt;
                strPatientDemog += '","FACILITYCD":';
                strPatientDemog += oPatData.facCd;
                strPatientDemog += ',"ORGID":';
                strPatientDemog += oPatData.orgId;
                strPatientDemog += '}';
            }
            else
            {
                strPatientDemog += ',{"PID":';
                strPatientDemog += oPatData.patId;
                strPatientDemog += ',"EID":';
                strPatientDemog += oPatData.enctr_id;
                strPatientDemog += ',"NAME":"';
                strPatientDemog += oPatData.name;
                strPatientDemog += '","BIRTHDT":"';
                strPatientDemog += oPatData.dob;
                strPatientDemog += '","EIDTYPE":';
                strPatientDemog += oPatData.enctrTypeCd;
                strPatientDemog += ',"ADMITDT":"';
                strPatientDemog += oPatData.admitDt;
                strPatientDemog += '","FACILITYCD":';
                strPatientDemog += oPatData.facCd;
                strPatientDemog += ',"ORGID":';
                strPatientDemog += oPatData.orgId;
                strPatientDemog += '}';
            }
        }
    }
    catch (error)
    {
        showErrorMessage(error.message,"ReorderStrPatientDemog","","");
    }
}


/**
 * This function is called when the web page is "on unload". It will store a value in "window.name" that is used
 * to determine which value that has been selected in the dropdown list Patient List.
 */
function refreshPage(){
var isHidden = "";

var blnRefreshed = true;
    try {      
        if(!isNaN(selectedID)) {
            Windowstorage.set("StoredIndex", selectedID);
        }
        //ami
        isHidden = hiddenExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("AmiHidden", isHidden);

        //hf
        isHidden = "";
        isHidden = hiddenHeartFailureExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("HfHidden", isHidden);

        //pneumonia
        isHidden = "";
        isHidden = hiddenPneumoniaExpandCollapse;
        if (isHidden == '0')
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("PnHidden", isHidden);

        //cac
        isHidden = "";
        isHidden = hiddenChildrensAsthmaExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("CacHidden", isHidden);

        //vte
        isHidden = "";
        isHidden = hiddenVTEExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("VteHidden", isHidden);

        //stroke
        isHidden = "";
        isHidden = hiddenStrokeExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("StrokeHidden", isHidden);

        //scip
        isHidden = "";
        isHidden = hiddenSCIPExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("ScipHidden", isHidden);

        //pressure ulcers
        isHidden = "";
        isHidden = hiddenPressureUlcersExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("PuHidden", isHidden);

        //cri
        isHidden = "";
        isHidden = hiddenCRIExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("CriHidden", isHidden);

        //falls
        isHidden = "";
        isHidden = hiddenFallsExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("FallsHidden", isHidden);

        //peds falls
        isHidden = "";
        isHidden = hiddenFallsPediatricExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("PfallHidden", isHidden);

        //pain
        isHidden = "";
        isHidden = hiddenPainExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("PainHidden", isHidden);

        //peds pain
        isHidden = "";
        isHidden = hiddenPedPainExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("PpainHidden", isHidden);

        //peds skin
        isHidden = "";
        isHidden = hiddenpSkinExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("PskinHidden", isHidden);

        //imm
        isHidden = "";
        isHidden = hiddenImmExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("immHidden", isHidden);

        //tob
        isHidden = "";
        isHidden = hiddenTobExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("tobHidden", isHidden);

        //sub
        isHidden = "";
        isHidden = hiddenSubExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("subHidden", isHidden);

        //PC
        isHidden = "";
        isHidden = hiddenPCExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("pcHidden", isHidden);

        //HBIPS
        isHidden = "";
        isHidden = hiddenHBIPSExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("hbipsHidden", isHidden);

        //SEPSIS
        isHidden = "";
        isHidden = hiddenSEPSISExpandCollapse;
        if (isHidden == 0)
        {
            isHidden = 1;
        }
        else
        {
            isHidden = 0;
        }
        Windowstorage.set("sepsisHidden", isHidden);

        //HS
        isHidden = "";
        isHidden = hiddenHSExpandCollapse;
        if (isHidden == 0){
            isHidden = 1;
        }
        else{
            isHidden = 0;
        }
        Windowstorage.set("hsHidden", isHidden);

        window.location.reload(true);

    }
    catch (error) {
        showErrorMessage(error.message, "refreshPage", "", "");
        blnRefreshed = false;
    }
    return blnRefreshed ;
}




var Windowstorage = {
    cache: null,

    get: function(key){
        if (window.name.length > 0) {
            this.cache = eval("(" + window.name + ")");
        }
        else {
            this.cache = {};
        }
        return decodeURIComponent(this.cache[key]);
    },

    encodeString: function(value){
        return encodeURIComponent(value).replace(/'/g, "'");
    },
    set: function(key, value){
        this.get();
        if (typeof key != "undefined" && typeof value != "undefined") {
            this.cache[key] = value;
        }
        var jsonString = "{";
        var itemCount = 0;
        for (var item in this.cache) {
            if (itemCount > 0) {
                jsonString += ", ";
            }
            jsonString += "'" + this.encodeString(item) + "':'" + this.encodeString(this.cache[item]) + "'";
            itemCount++;
        }
        jsonString += "}";
        window.name = jsonString;
    },
    del: function(key){
        this.get();
        delete this.cache[key];
        this.serialize(this.cache);
    },
    clear: function(){
        window.name = "";
    }
};

//Initialize the web page.
window.onload = initPage;

window.onunload = refreshPage;
