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
          *  (3) install the Script Source Code in Client’s environment.          *
          *  B. Use of the Script Source Code is for Client’s internal purposes   *
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
          *     Source Code prior to moving such code into Client’s production    *
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
          *     performance of Client’s System.                                   *
          *  C. Client waives, releases, relinquishes, and discharges Cerner from *
          *     any and all claims, liabilities, suits, damages, actions, or      *
          *     manner of actions, whether in contract, tort, or otherwise which  *
          *     Client may have against Cerner, whether the same be in            *
          *     administrative proceedings, in arbitration, at law, in equity, or *
          *     mixed, arising from or relating to Client’s use of Script Source  *
          *     Code.                                                             *
          * 5. Retention of Ownership                                             *
          *    Cerner retains ownership of all software and source code in this   *
          *    service package. Client agrees that Cerner owns the derivative     *
          *    works to the modified source code. Furthermore, Client agrees to   *
          *    deliver the derivative works to Cerner.                            *
      ~BE~************************************************************************/
    /******************************************************************************

            Source file name:       dc_mp_qual_nhiqm.js

            Product:                Discern Content
            Product Team:           Discern Content

            File purpose:           Provides data that is specific to the NHIQM
                                    part of the MPage.

            Special Notes:          <add any special notes here>

    ;~DB~****************************************************************************************
    ;*                      GENERATED MODIFICATION CONTROL LOG                                  *
    ;********************************************************************************************
    ;*                                                                                          *
    ;*Mod   Date        Engineer                Feature         Comment                         *
    ;*---   ----------  --------------------    ------------    -----------------------------   *
    ;*000   07/07/2010  Niklas Forsberg                         Initial Release                 *
    ;*001   11/30/2010  Niklas Forsberg                         Pediatric Pain                  *
    ;*002   01/07/2010  Christopher Canida                      3.3 enhancements                *
    ;*003   08/31/2011  Allison Wynn                            Enhancements 4.0 - Adding Bedrock
    ;                                                           filter/Preference to determine  *
    ;                                                           # of columns to open on page load
    ;                                                           -Removing the loading of all    *
    ;                                                           Columns when qualified patients *
    ;                                                           is set                          *
    ;*004   09/26/2011  Allison Wynn                            Unofficial change to resolve issue
    ;                                                           of html/javascript code appearing in
    ;                                                           mpage, resolution, to add replace
    ;                                                           when accepting strings from javascript
    ;                                                           to bad quotes are not passes
    ;                                                           Additional fix is to add Avinash's
    ;                                                           function to replace any bad characters
    ;                                                           see email for function
    ;*005   03/27/2012 Allison Wynn                             4.1 Adjusting text for PowerPlan vs Order
    ;*006   09/26/2012 Allison Wynn                             Adding Alarm clock at the measure level
    ;                                                           and at the venue level if alarm clock exists
    ;                                                           at the measure level within that venue
    ;*009   02/02/2015  James Barron                            CR 1-9183215171 fixed missing   *
    ;                           order links when removing patients without qualifying data      *
    ;*010   09/06/2017  Sudhaker V Manikonda                    CMM-2233 Sepsis Expand Fix      *
    ;~DE~****************************************************************************************
    ;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ***********************************/


    //Global Variables
    var tabName = "";
    var bExpLastPage = false;
    var lastSectionName = "";
    var hdrTblWidth = 200;

    function expandCollapseSection(strSectionName)
    {
        var content = "";
        var ec = "";
        var tempValue = "";
        var tempValue2 = "";
        var tempValueX = "";
        var tempValueY = ""; //002 dynamic column count
        var blnHideAMIRows = true;
        var blnStatus = true;
        var intCurrentTableWidth = 0;
        var columnNumber = 0;
        var intSubtractWidth = 0;
        var tempTotalHiddenRows = 0;
        var table = "";

        try
        {
            lastSectionName = strSectionName;
            if (currentPage == pageCNT && !bExpLastPage)
            {
                displayPreviousPage();
                bExpLastPage = true;
                //return blnStatus;
            }
            switch (strSectionName.toLowerCase())
            {
                case 'ami':
                    if (blnAmiCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_ami";
                        oSecObj.strSectionName = "AMI"
                        oSecObj.secDisplayNm = i18n.condDisp.AMI;
                        hiddenExpandCollapse = 1;
                        getSection(oSecObj);
                        blnAmiCalled == true;
                    }
                    else
                    {
                        if (hiddenExpandCollapse == '1')
                        {displayLoadText(strSectionName);}

                        var oSecObj = GetOsecObjFromArray('AMI');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'AMI';
                        oSecObj.strHdr = i18n.condHdr.AMI;
                        oSecObj.secPatLstHdr = i18n.condDisp.AMI;
                        oSecObj.columnNumber = json_data3.AMIREPLY.COLMNCNT;
                        oSecObj.secCell = amiCell;
                        oSecObj.displayIndicator = amiDisplayIndicator;
                        oSecObj.tableWidth = tableAMIWidth
                        oSecObj.tableColSpan = tableAMIColSpan
                        oSecObj.hiddenExpandCollapse = hiddenExpandCollapse;
                        oSecObj.cellRowSpan = "patientED";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_data3.AMIREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableAMIWidth = oSecObj.tableWidth;
                                tableAMIColSpan = oSecObj.tableColSpan;
                                statusAmiCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableAMIWidth = oSecObj.tableWidth;
                            tableAMIColSpan = oSecObj.tableColSpan;
                            statusAmiCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'hf':
                    if (blnHeartFailureCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_hf";
                        oSecObj.strSectionName = "HF"
                        oSecObj.secDisplayNm = i18n.condDisp.HEART_FAILURE;
                        hiddenHeartFailureExpandCollapse = 1;
                        getSection(oSecObj);
                        blnHeartFailureCalled == true;
                    }
                    else
                    {
                        if (hiddenHeartFailureExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('HF');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'HF';
                        oSecObj.strHdr = i18n.condHdr.HEART_FAILURE;
                        oSecObj.secPatLstHdr = i18n.condDisp.HEART_FAILURE;
                        oSecObj.columnNumber = json_data4.HFREPLY.COLMNCNT;
                        oSecObj.secCell = hfCell;
                        oSecObj.displayIndicator = heartFailureDisplayIndicator;
                        oSecObj.tableWidth = tableHeartFailureWidth
                        oSecObj.tableColSpan = tableHeartFailureColSpan
                        oSecObj.hiddenExpandCollapse = hiddenHeartFailureExpandCollapse;
                        oSecObj.cellRowSpan = "cellHeartFailureRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_data4.HFREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableHeartFailureWidth = oSecObj.tableWidth;
                                tableHeartFailureColSpan = oSecObj.tableColSpan;
                                statusHfCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableHeartFailureWidth = oSecObj.tableWidth;
                            tableHeartFailureColSpan = oSecObj.tableColSpan;
                            statusHfCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'pn':
                    if (blnPneumoniaCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_pn";
                        oSecObj.strSectionName = "PN"
                        oSecObj.secDisplayNm = i18n.condDisp.PNEUMONIA;
                        hiddenPneumoniaExpandCollapse = 1;
                        getSection(oSecObj);
                        blnPneumoniaCalled == true;
                    }
                    else
                    {
                        if (hiddenPneumoniaExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('PN');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'PN';
                        oSecObj.strHdr = i18n.condHdr.PNEUMONIA;
                        oSecObj.secPatLstHdr = i18n.condDisp.PNEUMONIA;
                        oSecObj.columnNumber = json_data5.PNREPLY.COLMNCNT;
                        oSecObj.secCell = pnCell;
                        oSecObj.displayIndicator = pneumoniaDisplayIndicator;
                        oSecObj.tableWidth = tablePneumoniaWidth
                        oSecObj.tableColSpan = tablePneumoniaColSpan
                        oSecObj.hiddenExpandCollapse = hiddenPneumoniaExpandCollapse;
                        oSecObj.cellRowSpan = "cellPneumoniaRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_data5.PNREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tablePneumoniaWidth = oSecObj.tableWidth;
                                tablePneumoniaColSpan = oSecObj.tableColSpan;
                                statusPnCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tablePneumoniaWidth = oSecObj.tableWidth;
                            tablePneumoniaColSpan = oSecObj.tableColSpan;
                            statusPnCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'cac':
                    if (blnChildrensAsthmaCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_cac";
                        oSecObj.strSectionName = "CAC"
                        oSecObj.secDisplayNm = i18n.condDisp.CHILDRENS_ASTHMA;
                        hiddenChildrensAsthmaExpandCollapse = 1;
                        getSection(oSecObj);
                        blnChildrensAsthmaCalled == true;
                    }
                    else
                    {
                        if (hiddenChildrensAsthmaExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('CAC');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'CAC';
                        oSecObj.strHdr = i18n.condHdr.CHILDRENS_ASTHMA;
                        oSecObj.secPatLstHdr = i18n.condDisp.CHILDRENS_ASTHMA;
                        oSecObj.columnNumber = json_data6.CACREPLY.COLMNCNT;
                        oSecObj.secCell = cacCell;
                        oSecObj.displayIndicator = cacDisplayIndicator;
                        oSecObj.tableWidth = tableChildrensAsthmaWidth
                        oSecObj.tableColSpan = tableChildrensAsthmaColSpan
                        oSecObj.hiddenExpandCollapse = hiddenChildrensAsthmaExpandCollapse;
                        oSecObj.cellRowSpan = "cellChildrenAsthmaRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_data6.CACREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableChildrensAsthmaWidth = oSecObj.tableWidth;
                                tableChildrensAsthmaColSpan = oSecObj.tableColSpan;
                                statusCacCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableChildrensAsthmaWidth = oSecObj.tableWidth;
                            tableChildrensAsthmaColSpan = oSecObj.tableColSpan;
                            statusCacCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'vte':
                    if (blnVTECalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_vte";
                        oSecObj.strSectionName = "VTE"
                        oSecObj.secDisplayNm = i18n.condDisp.VTE;
                        hiddenVTEExpandCollapse = 1;
                        getSection(oSecObj);
                        blnVTECalled == true;
                    }
                    else
                    {
                        if (hiddenVTEExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('VTE');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'VTE';
                        oSecObj.strHdr = i18n.condHdr.VTE;
                        oSecObj.secPatLstHdr = i18n.condDisp.VTE;
                        oSecObj.columnNumber = json_data7.VTEREPLY.COLMNCNT;
                        oSecObj.secCell = vteCell;
                        oSecObj.displayIndicator = vteDisplayIndicator;
                        oSecObj.tableWidth = tableVTEWidth
                        oSecObj.tableColSpan = tableVTEColSpan
                        oSecObj.hiddenExpandCollapse = hiddenVTEExpandCollapse;
                        oSecObj.cellRowSpan = "cellVTERowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_data7.VTEREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableVTEWidth = oSecObj.tableWidth;
                                tableVTEColSpan = oSecObj.tableColSpan;
                                statusVTECell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableVTEWidth = oSecObj.tableWidth;
                            tableVTEColSpan = oSecObj.tableColSpan;
                            statusVTECell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'stk':
                    if (blnStrokeCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_stroke";
                        oSecObj.strSectionName = "STK"
                        oSecObj.secDisplayNm = i18n.condDisp.STROKE;
                        hiddenStrokeExpandCollapse = 1;
                        getSection(oSecObj);
                        blnStrokeCalled == true;
                    }
                    else
                    {
                        if (hiddenStrokeExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('STK');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        //var oSecObj = new Object();
                        oSecObj.strSectionName = 'STK';
                        oSecObj.strHdr = i18n.condHdr.STROKE;
                        oSecObj.secPatLstHdr = i18n.condDisp.STROKE;
                        oSecObj.columnNumber = json_data8.STKREPLY.COLMNCNT;
                        oSecObj.secCell = strokeCell;
                        oSecObj.displayIndicator = strokeDisplayIndicator;
                        oSecObj.tableWidth = tableStrokeWidth
                        oSecObj.tableColSpan = tableStrokeColSpan
                        oSecObj.hiddenExpandCollapse = hiddenStrokeExpandCollapse;
                        oSecObj.cellRowSpan = "cellStrokeRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_data8.STKREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableStrokeWidth = oSecObj.tableWidth;
                                tableStrokeColSpan = oSecObj.tableColSpan;
                                statusStkCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableStrokeWidth = oSecObj.tableWidth;
                            tableStrokeColSpan = oSecObj.tableColSpan;
                            statusStkCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'scip':
                    if (blnSCIPCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_scip";
                        oSecObj.strSectionName = "SCIP"
                        oSecObj.secDisplayNm = i18n.condDisp.SCIP;
                        hiddenSCIPExpandCollapse = 1;
                        getSection(oSecObj);
                        blnSCIPCalled == true;
                    }
                    else
                    {
                        if (hiddenSCIPExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('SCIP');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'SCIP';
                        oSecObj.strHdr = i18n.condHdr.SCIP;
                        oSecObj.secPatLstHdr = i18n.condDisp.SCIP;
                        oSecObj.columnNumber = json_data9.SCIPREPLY.COLMNCNT;
                        oSecObj.secCell = scipCell;
                        oSecObj.displayIndicator = scipDisplayIndicator;
                        oSecObj.tableWidth = tableSCIPWidth
                        oSecObj.tableColSpan = tableSCIPColSpan
                        oSecObj.hiddenExpandCollapse = hiddenSCIPExpandCollapse;
                        oSecObj.cellRowSpan = "cellSCIPRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_data9.SCIPREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableSCIPWidth = oSecObj.tableWidth;
                                tableSCIPColSpan = oSecObj.tableColSpan;
                                statusScipCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableSCIPWidth = oSecObj.tableWidth;
                            tableSCIPColSpan = oSecObj.tableColSpan;
                            statusScipCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'imm':
                    if (blnImmCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_imm";
                        oSecObj.strSectionName = "IMM"
                        oSecObj.secDisplayNm = i18n.condDisp.IMM;
                        hiddenImmExpandCollapse = 1;
                        getSection(oSecObj);
                        blnImmCalled == true;
                    }
                    else
                    {
                        if (hiddenImmExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('Imm');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'IMM';
                        oSecObj.strHdr = i18n.condHdr.IMM;
                        oSecObj.secPatLstHdr = i18n.condDisp.IMM;
                        oSecObj.columnNumber = json_dataImm.IMMREPLY.COLMNCNT;
                        oSecObj.secCell = immCell;
                        oSecObj.displayIndicator = immDisplayIndicator;
                        oSecObj.tableWidth = tableImmWidth
                        oSecObj.tableColSpan = tableImmColSpan
                        oSecObj.hiddenExpandCollapse = hiddenImmExpandCollapse;
                        oSecObj.cellRowSpan = "cellImmRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_dataImm.IMMREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableImmWidth = oSecObj.tableWidth;
                                tableImmColSpan = oSecObj.tableColSpan;
                                statusImmCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableImmWidth = oSecObj.tableWidth;
                            tableImmColSpan = oSecObj.tableColSpan;
                            statusImmCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'tob':
                    if (blnTobCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_tob";
                        oSecObj.strSectionName = "TOB"
                        oSecObj.secDisplayNm = i18n.condDisp.TOB;
                        hiddenTobExpandCollapse = 1;
                        getSection(oSecObj);
                        blnTobCalled == true;
                    }
                    else
                    {
                        if (hiddenTobExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('Tob');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'Tob';
                        oSecObj.strHdr = i18n.condHdr.TOB;
                        oSecObj.secPatLstHdr = i18n.condDisp.TOB;
                        oSecObj.columnNumber = json_dataTob.TOBREPLY.COLMNCNT;
                        oSecObj.secCell = tobCell;
                        oSecObj.displayIndicator = tobDisplayIndicator;
                        oSecObj.tableWidth = tableTobWidth;
                        oSecObj.tableColSpan = tableTobColSpan;
                        oSecObj.hiddenExpandCollapse = hiddenTobExpandCollapse;
                        oSecObj.cellRowSpan = "cellTobRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_dataTob.TOBREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableTobWidth = oSecObj.tableWidth;
                                tableTobColSpan = oSecObj.tableColSpan;
                                statusTobCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableTobWidth = oSecObj.tableWidth;
                            tableTobColSpan = oSecObj.tableColSpan;
                            statusTobCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'sub':
                    if (blnSubCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_sub";
                        oSecObj.strSectionName = "SUB"
                        oSecObj.secDisplayNm = i18n.condDisp.SUB;
                        hiddenSubExpandCollapse = 1;
                        getSection(oSecObj);
                        blnSubCalled == true;
                    }
                    else
                    {
                        if (hiddenSubExpandCollapse == '1')
                          {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('Sub');
                        if(!oSecObj)
                          {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'Sub';
                        oSecObj.strHdr = i18n.condHdr.SUB;
                        oSecObj.secPatLstHdr = i18n.condDisp.SUB;
                        oSecObj.columnNumber = json_dataSub.SUBREPLY.COLMNCNT;
                        oSecObj.secCell = subCell;
                        oSecObj.displayIndicator = subDisplayIndicator;
                        oSecObj.tableWidth = tableSubWidth;
                        oSecObj.tableColSpan = tableSubColSpan;
                        oSecObj.hiddenExpandCollapse = hiddenSubExpandCollapse;
                        oSecObj.cellRowSpan = "cellSubRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_dataSub.SUBREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableSubWidth = oSecObj.tableWidth;
                                tableSubColSpan = oSecObj.tableColSpan;
                                statusSubCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableSubWidth = oSecObj.tableWidth;
                            tableSubColSpan = oSecObj.tableColSpan;
                            statusSubCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'pc':
                    if (blnPcCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_pc";
                        oSecObj.strSectionName = "PC"
                        oSecObj.secDisplayNm = i18n.condDisp.PC;
                        hiddenPCExpandCollapse = 1;
                        getSection(oSecObj);
                        blnPcCalled == true;
                    }
                    else
                    {
                        if (hiddenPCExpandCollapse == '1')
                            {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('PC');
                        if(!oSecObj)
                            {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'PC';
                        oSecObj.strHdr = i18n.condHdr.PC;
                        oSecObj.secPatLstHdr = i18n.condDisp.PC;
                        oSecObj.columnNumber = json_dataPc.PCREPLY.COLMNCNT;
                        oSecObj.secCell = pcCell;
                        oSecObj.displayIndicator = pcDisplayIndicator;
                        oSecObj.tableWidth = tablePcWidth;
                        oSecObj.tableColSpan = tablePcColSpan;
                        oSecObj.hiddenExpandCollapse = hiddenPCExpandCollapse;
                        oSecObj.cellRowSpan = "cellPCRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_dataPc.PCREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tablePcWidth = oSecObj.tableWidth;
                                tablePcColSpan = oSecObj.tableColSpan;
                                statusPcCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tablePcWidth = oSecObj.tableWidth;
                            tablePcColSpan = oSecObj.tableColSpan;
                            statusPcCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'hbips':
                    if (blnHbipsCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_hbips";
                        oSecObj.strSectionName = "HBIPS"
                        oSecObj.secDisplayNm = i18n.condDisp.HBIPS;
                        hiddenHBIPSExpandCollapse = 1;
                        getSection(oSecObj);
                        blnHbipsCalled == true;
                    }
                    else
                    {
                        if (hiddenHBIPSExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('HBIPS');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'HBIPS';
                        oSecObj.strHdr = i18n.condHdr.HBIPS;
                        oSecObj.secPatLstHdr = i18n.condDisp.HBIPS;
                        oSecObj.columnNumber = json_dataHbips.HBIPSREPLY.COLMNCNT;
                        oSecObj.secCell = hbipsCell;
                        oSecObj.displayIndicator = hbipsDisplayIndicator;
                        oSecObj.tableWidth = tableHbipsWidth;
                        oSecObj.tableColSpan = tableHbipsColSpan;
                        oSecObj.hiddenExpandCollapse = hiddenHBIPSExpandCollapse;
                        oSecObj.cellRowSpan = "cellHBIPSRowSpan";

                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_dataHbips.HBIPSREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableHbipsWidth = oSecObj.tableWidth;
                                tableHbipsColSpan = oSecObj.tableColSpan;
                                statusHbipsCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableHbipsWidth = oSecObj.tableWidth;
                            tableHbipsColSpan = oSecObj.tableColSpan;
                            statusHbipsCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'sepsis':
                    if (blnSepsisCalled == false)
                    {
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_sepsis";
                        oSecObj.strSectionName = "SEPSIS"
                        oSecObj.secDisplayNm = i18n.condDisp.SEPSIS;
                        hiddenSEPSISExpandCollapse = 1;
                        getSection(oSecObj);
                        blnSepsisCalled == true;
                    }
                    else
                    {
                        if (hiddenSEPSISExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('SEPSIS');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'SEPSIS';
                        oSecObj.strHdr = i18n.condHdr.SEPSIS;
                        oSecObj.secPatLstHdr = i18n.condDisp.SEPSIS;
                        oSecObj.columnNumber = json_dataSepsis.SEPSISREPLY.COLMNCNT;
                        oSecObj.secCell = sepsisCell;
                        oSecObj.displayIndicator = sepsisDisplayIndicator;
                        oSecObj.tableWidth = tableSepsisWidth;
                        oSecObj.tableColSpan = tableSepsisColSpan;
                        oSecObj.hiddenExpandCollapse = hiddenSEPSISExpandCollapse;
                        oSecObj.cellRowSpan = "cellSEPSISRowSpan";
                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_dataSepsis.SEPSISREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableSepsisWidth = oSecObj.tableWidth;
                                tableSepsisColSpan = oSecObj.tableColSpan;
                                statusSepsisCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableSepsisWidth = oSecObj.tableWidth;
                            tableSepsisColSpan = oSecObj.tableColSpan;
                            statusSepsisCell = oSecObj.statusCell;
                        }
                    }
                    break;
                case 'hs':
                    if (blnHSCalled == false){
                        var oSecObj = new Object();
                        oSecObj.cclProg = "dc_mp_get_hs";
                        oSecObj.strSectionName = "HS"
                        oSecObj.secDisplayNm = i18n.condDisp.HS;
                        hiddenHSExpandCollapse = 1;
                        getSection(oSecObj);
                        blnHSCalled == true;
                    }
                    else{
                        if (hiddenHSExpandCollapse == '1')
                        {displayLoadText(strSectionName);}
                        var oSecObj = GetOsecObjFromArray('HS');
                        if(!oSecObj)
                        {var oSecObj = new Object();}

                        oSecObj.strSectionName = 'HS';
                        oSecObj.strHdr = i18n.condHdr.HS;
                        oSecObj.secPatLstHdr = i18n.condDisp.HS;
                        oSecObj.columnNumber = json_dataHS.HSREPLY.COLMNCNT;
                        oSecObj.secCell = hsCell;
                        oSecObj.displayIndicator = hsDisplayIndicator;
                        oSecObj.tableWidth = tableHSWidth;
                        oSecObj.tableColSpan = tableHSColSpan;
                        oSecObj.hiddenExpandCollapse = hiddenHSExpandCollapse;
                        oSecObj.cellRowSpan = "cellHSRowSpan";
                        if (document.getElementById("conLists").value !== "All") {
                            RemoveUnqualifiedPt(json_listOfPatients.PTREPLY, json_dataHS.HSREPLY, document.getElementById("statLists").value);
                            json_data2 = json_listOfPatients;
                            if (reloadPatients(json_listOfPatients)) {
                                oSecObj = SetSectionParams(oSecObj);
                                tableHSWidth = oSecObj.tableWidth;
                                tableHSColSpan = oSecObj.tableColSpan;
                                statusHsCell = oSecObj.statusCell;
                            }
                        }
                        else {
                            oSecObj = SetSectionParams(oSecObj);
                            tableHSWidth = oSecObj.tableWidth;
                            tableHSColSpan = oSecObj.tableColSpan;
                            statusHsCell = oSecObj.statusCell;
                        }
                    }
                    break;
            }
            PopulatePatientInfo();
            if (bExpLastPage)
            {
                displayNextPage();
                bExpLastPage = false;
            }

        }
        catch (error)
        {
            showErrorMessage(error.message,"expandCollapseSection","","");
            blnStatus = false;
        }
        return blnStatus;
    }

    function SetSectionParams(oSecObj)
    {
        try
        {
            var intCurrentTableWidth = 0;
            var tempValue = "";
            var intCounter = 0;
            var strSectionName = oSecObj.strSectionName;
            var isThreeColSec = false;
            var isFourColSec = false;
            var tempTotalValue = 0;
            var strStatus = "";
            var rowsPageOne = 0;
            var rowsToBuild = 0;
            var intExpandWidth = 0;
            var intSubtractWidth = 0;
            var wdthAdj = 0;

            var numSecsClosed = parseInt(NumSectionsClosed());
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

            var isNhiqmColSec = IsValInArray(sixColHdrs,oSecObj.strHdr);
            if (!isNhiqmColSec)
                {isThreeColSec = IsValInArray(threeColHdrs,oSecObj.strHdr);}
            else if (!isThreeColSec)
                {isFourColSec = IsValInArray(fourColHdrs,oSecObj.strHdr);}
            if (oSecObj.columnNumber == 5)
                {wdthAdj = 120;}

            //Calculate how many rows we are going to hide and add 1 extra to inlcude the last row.
            tempTotalValue = parseInt(totalPatients) + parseInt(1);

            //Get hidden value.
            intHiddenValue = oSecObj.hiddenExpandCollapse;

            //Get name of table.
            table = document.getElementById("hdrtable2");
            //0 = make the section collapsed.
            //1 = make the section expanded.
            if (intHiddenValue == 0) {
                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;

                //Change Hidden Value.
                //oSecObj.hiddenExpandCollapse = 1;
                oSecObj.hiddenExpandCollapse = setExpandCollapse(oSecObj.strSectionName, 1);

                //Change size of Table 1 and 2.
                intSubtractWidth = (parseInt(oSecObj.columnNumber) * parseInt(80)) + parseInt(100) + hdrtableWdthAdj;
                intCurrentTableWidth = parseInt(intCurrentTableWidth) - parseInt(intSubtractWidth) + parseInt(40);

                document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth);
                document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth);
                //Main Header
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[oSecObj.displayIndicator].colSpan = "1";
                document.getElementById('secpatlisthdr' + oSecObj.strHdr).style.width = "40px";
                document.getElementById('secpatlisthdr' + oSecObj.strHdr).className = "tabhdrs2g";
                document.getElementById('secpatlisthdr' + oSecObj.strHdr).innerHTML = '<div id="div' + oSecObj.strHdr + 'text" title="' +i18n.condDisp.CLICK_TO_EXPAND + oSecObj.secPatLstHdr + i18n.condDisp.INFORMATION + '" class="mainColumn2g" onclick=expandCollapseSection("' + strSectionName + '");>+</div>';
                switch (true)
                {
                    case isNhiqmColSec:
                        //ED
                        tempValue = "";
                        tempValue = document.getElementById('hdrtable').rows[1].cells;
                        tempValue[oSecObj.secCell].colSpan = "1";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '1').style.width = "40px";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '1').className = "tabhdrs2g";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '1').style.display = "";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '1').innerHTML = "";
                        //Inpatient
                        content = "";
                        tempValue = "";
                        tempValue = "secsubcol" + oSecObj.strHdr + "2";
                        content = document.getElementById(tempValue);
                        content.style.width = "0px";
                        content.style.display = "none";
                        content.innerHTML = "";

                        //Discharge
                        content = "";
                        tempValue = "";
                        tempValue = "secsubcol" + oSecObj.strHdr + "3";
                        content = document.getElementById(tempValue);
                        content.style.width = "0px";
                        content.style.display = "none";
                        content.innerHTML = "";
                        //PreOp
                        content = "";
                        tempValue = "";
                        tempValue = "secsubcol" + oSecObj.strHdr + "4";
                        content = document.getElementById(tempValue);
                        content.style.width = "0px";
                        content.style.display = "none";
                        content.innerHTML = "";
                        //PostOp
                        content = "";
                        tempValue = "";
                        tempValue = "secsubcol" + oSecObj.strHdr + "5";
                        content = document.getElementById(tempValue);
                        content.style.width = "0px";
                        content.style.display = "none";
                        content.innerHTML = "";
                        //Status
                        content = "";
                        tempValue = "";
                        tempValue = "secsubcol" + oSecObj.strHdr + "6";
                        content = document.getElementById(tempValue);
                        content.style.width = "0px";
                        content.style.display = "none";
                        content.innerHTML = "";

                        var secNm = ""
                        if (oSecObj.strHdr != i18n.condHdr.AMI)
                        {secNm = oSecObj.strHdr;}
                        for (var i = 1; i < (rowsToBuild+1); i++) {
                            //Verify if this is the first row.
                            if (i == 1) {
                                //ED //002 dynamic cell count was 3
                                table.rows[intCounter].cells[oSecObj.secCell].style.width = "40px"; //width of vertical section
                                table.rows[intCounter].cells[oSecObj.secCell].className = "tabhdrsVertical";
                                table.rows[intCounter].cells[oSecObj.secCell].style.display = "";
                                table.rows[intCounter].cells[oSecObj.secCell].innerHTML = oSecObj.secPatLstHdr;
                            }
                            else {
                                //ED //002 dynamic cell count was 3
                                table.rows[intCounter].cells[oSecObj.secCell].style.width = "0px";
                                table.rows[intCounter].cells[oSecObj.secCell].style.display = "none";
                                table.rows[intCounter].cells[oSecObj.secCell].innerHTML = "";
                            }
                            //Inpatient
                            tempValue = "";
                            tempValue = "patientIn" + secNm + i;
                            document.getElementById(tempValue).style.width = "0px";
                            document.getElementById(tempValue).style.display = "none";
                            document.getElementById(tempValue).innerHTML = "";
                            //Discharge
                            tempValue = "";
                            tempValue = "patientDischarge" + secNm + i;
                            document.getElementById(tempValue).style.width = "0px";
                            document.getElementById(tempValue).style.display = "none";
                            document.getElementById(tempValue).innerHTML = "";
                            //PreOp
                            tempValue = "";
                            tempValue = "patientPreOp" + secNm + i;
                            document.getElementById(tempValue).style.width = "0px";
                            document.getElementById(tempValue).style.display = "none";
                            document.getElementById(tempValue).innerHTML = "";
                            //PostOp
                            tempValue = "";
                            tempValue = "patientPostOp" + secNm + i;
                            document.getElementById(tempValue).style.width = "0px";
                            document.getElementById(tempValue).style.display = "none";
                            document.getElementById(tempValue).innerHTML = "";
                            //Status
                            tempValue = "";
                            tempValue = "patientStatus" + secNm + i;
                            document.getElementById(tempValue).style.width = "0px";
                            document.getElementById(tempValue).style.display = "none";
                            document.getElementById(tempValue).innerHTML = "";

                            //Add 2 to the counter.
                            intCounter = intCounter + 2;
                        }

                        break;
                    case isThreeColSec:
                        break;
                    case isFourColSec:
                        break;
                }
                //Add the rowspan. //002 add dynamic count to all cells count was 3
                table.rows[0].cells[oSecObj.secCell].rowSpan = rowSpanCounter;
            }
            else {
                //Change Hidden Value.
                //oSecObj.hiddenExpandCollapse = 0;
                oSecObj.hiddenExpandCollapse = setExpandCollapse(oSecObj.strSectionName,0);
                //Get current table width.
                intCurrentTableWidth = document.getElementById('hdrtable').width;
                //alert("hdrtableWdthAdj = "+hdrtableWdthAdj+"\n wdthAdj = "+wdthAdj+"\n intCurrentTableWidth = "+intCurrentTableWidth);
                //Calculate size of Tables 1 and 2.
                intExpandWidth = (parseInt(5) * parseInt(80)) + parseInt(100) - parseInt(40);
                intCurrentTableWidth = parseInt(intCurrentTableWidth) + parseInt(intExpandWidth);
                document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth) + hdrtableWdthAdj;
                document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth) + wdthAdj;
                //Reset variables.
                oSecObj.tableWidth = 500;
                oSecObj.tableColSpan = 6;
                hdrTableWidth = intCurrentTableWidth;
                hdrTable2Width = intCurrentTableWidth;
                //Main Header.
                tempValue = "";
                tempValue = "secpatlisthdr" + oSecObj.strHdr;
                document.getElementById(tempValue).style.width = "500px";
                document.getElementById(tempValue).className = "tabhdrs";
                document.getElementById(tempValue).style.display = "";
                document.getElementById(tempValue).innerHTML = '<div id="div' + oSecObj.strHdr + 'text" title="' + i18n.condDisp.CLICK_TO_COLLAPSE + oSecObj.secPatLstHdr + i18n.condDisp.INFORMATION + '" class="mainColumn2g" onclick=expandCollapseSection("' + strSectionName + '");>- ' + oSecObj.secPatLstHdr + '</div>';
                //Change colspan and rowspan
                tempValue = "";
                tempValue = document.getElementById('hdrtable').rows[0].cells;
                tempValue[oSecObj.displayIndicator].colSpan = 6;
                //Reset Rowspan. //002 add dynamic count to all cells count was 3
                table.rows[0].cells[oSecObj.secCell].rowSpan = 1;
                table.rows[0].cells[oSecObj.secCell].className = "demcell";
                table.rows[0].cells[oSecObj.secCell].style.display = "";
                table.rows[0].cells[oSecObj.secCell].innerHTML = "";
                switch (oSecObj.strSectionName.toLowerCase())
                {
                    //strStatus
                    case "ami":
                        strStatus = 'patientStatus';
                        break;
                    case "hf":
                        strStatus = 'patientStatusHeartFailure';
                        break;
                    case "pn":
                        strStatus = 'patientStatusPneumonia';
                        break;
                    case "cac":
                        strStatus = 'patientStatusChildrensAsthma';
                        break;
                    case "vte":
                        strStatus = 'patientStatusVTE';
                        break;
                    case "stk":
                        strStatus = 'patientStatusStroke';
                        break;
                    case "scip":
                        strStatus = 'patientStatusSCIP';
                        break;
                    case "imm":
                        strStatus = 'patientStatusImm';
                        break;
                    case "tob":
                        strStatus = 'patientStatusTob';
                        break;
                    case "sub":
                        strStatus = 'patientStatusSub';
                        break;
                    case "pc":
                        strStatus = 'patientStatusPc';
                        break;
                    case "hbips":
                        strStatus = 'patientStatusHbips';
                        break;
                    case "sepsis":
                        strStatus = 'patientStatusSepsis';
                        break;
                    case "hs":
                        strStatus = 'patientStatusHS';
                        break;
                }
                switch (true)
                {
                    case isNhiqmColSec:
                        //Sub Headers
                        //ED
                        document.getElementById('secsubcol' + oSecObj.strHdr + '1').style.width = "80px";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '1').className = "subhdrs";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '1').style.display = "";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '1').innerHTML = i18n.venues.ED;
                        //Inpatient
                        document.getElementById('secsubcol' + oSecObj.strHdr + '2').style.width = "80px";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '2').className = "subhdrs";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '2').style.display = "";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '2').innerHTML = i18n.venues.INPATIENT;
                        //Discharge
                        document.getElementById('secsubcol' + oSecObj.strHdr + '3').style.width = "80px";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '3').className = "subhdrs";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '3').style.display = "";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '3').innerHTML = i18n.venues.DISCHARGE;
                        //PreOp
                        document.getElementById('secsubcol' + oSecObj.strHdr + '4').style.width = "80px";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '4').className = "subhdrs";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '4').style.display = "";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '4').innerHTML = i18n.venues.PREOP;
                        //PostOp
                        document.getElementById('secsubcol' + oSecObj.strHdr + '5').style.width = "80px";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '5').className = "subhdrs";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '5').style.display = "";
                        document.getElementById('secsubcol' + oSecObj.strHdr + '5').innerHTML = i18n.venues.POSTOP;
                        //Status
                        oSecObj.statusCell = parseInt(oSecObj.secCell) + parseInt(5);
                        content = "";
                        tempValue = "";
                        tempValue2 = "";
                        tempValue = "secsubcol" + oSecObj.strHdr + "6";

                        tempValue2 += '<a onclick="javascript:this.blur();return SortPatData(';
                        tempValue2 += "'" + strStatus + "');";
                        tempValue2 += '" title="Sort by Status" class="LinkText">'+i18n.STATUS+'</a>';
                        content = document.getElementById(tempValue);
                        content.style.display = "";
                        content.style.width = "100px";
                        content.className = "subhdrs";
                        content.innerHTML = tempValue2;
                        //Table 2 rows.
                        var secNm = "";
                        if (oSecObj.strHdr != i18n.condHdr.AMI)
                        {secNm = oSecObj.strHdr;}
                        for (var i = 1; i < (rowsToBuild + 1); i++) {
                            if (i == 1) {
                                //Verify if this is the first row.
                                //ED
                                tempValue = "";
                                tempValue = oSecObj.cellRowSpan;
                                document.getElementById(tempValue).style.width = "80px";
                                document.getElementById(tempValue).className = "demcell";
                                document.getElementById(tempValue).style.display = "";
                                document.getElementById(tempValue).innerHTML = "";
                            }
                            else {
                                //ED
                                tempValue = "";
                                tempValue = oSecObj.cellRowSpan + i;
                                document.getElementById(tempValue).style.width = "80px";
                                document.getElementById(tempValue).className = "demcell";
                                document.getElementById(tempValue).style.display = "";
                                document.getElementById(tempValue).innerHTML = "";
                            }
                            secNm = "";
                            if (oSecObj.strHdr != i18n.condHdr.AMI)
                            {secNm = oSecObj.strHdr;}
                            //Inpatient
                            tempValue = "";
                            tempValue = "patientIn" + secNm + i;
                            document.getElementById(tempValue).style.width = "80px";
                            document.getElementById(tempValue).className = "demcell";
                            document.getElementById(tempValue).style.display = "";
                            document.getElementById(tempValue).innerHTML = "";
                            //Discharge
                            tempValue = "";
                            tempValue = "patientDischarge" + secNm + i;
                            document.getElementById(tempValue).style.width = "80px";
                            document.getElementById(tempValue).className = "demcell";
                            document.getElementById(tempValue).style.display = "";
                            document.getElementById(tempValue).innerHTML = "";
                            //PreOp
                            tempValue = "";
                            tempValue = "patientPreOp" + secNm + i;
                            document.getElementById(tempValue).style.width = "80px";
                            document.getElementById(tempValue).className = "demcell";
                            document.getElementById(tempValue).style.display = "";
                            document.getElementById(tempValue).innerHTML = "";
                            //PostOp
                            tempValue = "";
                            tempValue = "patientPostOp" + secNm + i;
                            document.getElementById(tempValue).style.width = "80px";
                            document.getElementById(tempValue).className = "demcell";
                            document.getElementById(tempValue).style.display = "";
                            document.getElementById(tempValue).innerHTML = "";
                            //Status
                            tempValue = "";
                            tempValue = "patientStatus" + secNm + i;
                            document.getElementById(tempValue).style.width = "100px";
                            document.getElementById(tempValue).className = "demcell";
                            document.getElementById(tempValue).style.display = "";
                            document.getElementById(tempValue).innerHTML = "";
                        }
                        break;
                    case isThreeColSec:
                        break;
                    case isFourColSec:
                        break;
                }
                switch (strSectionName.toLowerCase())
                {
                    case 'ami':
                        statusAmiCell = parseInt(oSecObj.secCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'AMI';
                        oSecObject.secReply = json_data3.AMIREPLY;

                        if (blnFirstAmi == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);

                            //Change flag.
                            blnFirstAmi = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'hf':
                        statusHfCell = parseInt(hfCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'HF';
                        oSecObject.secReply = json_data4.HFREPLY;

                        if (blnFirstTimeHeartFailure == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimeHeartFailure = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'pn':
                        statusPnCell = parseInt(hfCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'PN';
                        oSecObject.secReply = json_data5.PNREPLY;

                        if (blnFirstTimePneumonia == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimePneumonia = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'cac':
                        statusCacCell = parseInt(vteCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'CAC';
                        oSecObject.secReply = json_data6.CACREPLY;

                        if (blnFirstTimeChildrensAsthma == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimeChildrensAsthma = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'vte':
                        statusVTECell = parseInt(vteCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'VTE';
                        oSecObject.secReply = json_data7.VTEREPLY;

                        if (blnFirstTimeVTE == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimeVTE = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'stk':
                        statusStkCell = parseInt(strokeCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'STK';
                        oSecObject.secReply = json_data8.STKREPLY;

                        if (blnFirstTimeStroke == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimeStroke = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'scip':
                        statusScipCell = parseInt(scipCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'SCIP';
                        oSecObject.secReply = json_data9.SCIPREPLY;

                        if (blnFirstTimeSCIP == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimeSCIP = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'imm':
                        statusImmCell = parseInt(immCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'Imm';
                        oSecObject.secReply = json_dataImm.IMMREPLY;

                        if (blnFirstTimeImm == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimeImm = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'tob':
                        statusTobCell = parseInt(tobCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'Tob';
                        oSecObject.secReply = json_dataTob.TOBREPLY;

                        if (blnFirstTimeTob == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimeTob = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'sub':
                        statusSubCell = parseInt(subCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'Sub';
                        oSecObject.secReply = json_dataSub.SUBREPLY;

                        if (blnFirstTimeSub == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimeSub = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'pc':
                        statusPcCell = parseInt(pcCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'PC';
                        oSecObject.secReply = json_dataPc.PCREPLY;

                        if (blnFirstTimePc == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimePc = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'hbips':
                        statusHbipsCell = parseInt(hbipsCell) + parseInt(5);

                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'HBIPS';
                        oSecObject.secReply = json_dataHbips.HBIPSREPLY;

                        if (blnFirstTimeHbips == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);

                            //Change flag.
                            blnFirstTimeHbips = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'sepsis':
                        statusSepsisCell = parseInt(sepsisCell) + parseInt(5);
                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'Sepsis';
                        oSecObject.secReply = json_dataSepsis.SEPSISREPLY;
                        if (blnFirstTimeSepsis == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimePc = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                    case 'hs':
                        statusHsCell = parseInt(hsCell) + parseInt(5);
                        var oSecObject = new Object();
                        oSecObject.strSectionName = 'hs';
                        oSecObject.secReply = json_dataHS.HSREPLY;
                        if (blnFirstTimeHS == true) {
                            //Fill the cells with values.
                            oSecObject.blnAddHiddenCells = true;
                            FillSection(oSecObject);
                            //Change flag.
                            blnFirstTimePc = false;
                        }
                        else {
                            //Fill the cells with values.
                            oSecObj.blnAddHiddenCells = false;
                            FillSection(oSecObject);
                        }
                        break;
                }
            }
            return oSecObj;
        }
        catch (error)
        {
            showErrorMessage(error.message,"SetSectionParams","","");
            //blnStatus = false;
            oSecObj.blnStatus = false;
            return oSecObj;
        }
    }

    function TimeOut()
    {
        return;
    }

    function HideRows(FirstHiddenRow)
    {
        try
        {
            var tempValue = "";  //'patientED';
            var tempValFrstRow = "";
            var cellRowSpan = '';
            var strHdr = ''
            var errMsg = "";

            //if there are less patients than can be displayed on the first page
            //get out of this function
            if (currentPage == 1)
            if (parseInt(GetNumPgRecords()) < parseInt(rowTotal))
            {
                return;
            }

            for (j=0;k=sixColAbbr.length,j<k;j++)
            {
                var cellRowSpan = '';
                var strHdr = sixColAbbr[j];
                var hiddenExpandCollapse = "";

                switch(strHdr.toLowerCase())
                {
                    case 'ami':
                        cellRowSpan = 'patientED';
                        strHdr = 'AMI'
                        hiddenExpandCollapse = hiddenExpandCollapse;
                        break;
                    case 'hf':
                        cellRowSpan = 'cellHeartFailureRowSpan';
                        strHdr = 'HeartFailure'
                        hiddenExpandCollapse = hiddenHeartFailureExpandCollapse;
                        break;
                    case 'pn':
                        cellRowSpan = 'cellPneumoniaRowSpan';
                        strHdr = 'Pneumonia'
                        hiddenExpandCollapse = hiddenPneumoniaExpandCollapse;
                        break;
                    case 'cac':
                        cellRowSpan = 'cellChildrensAsthmaRowSpan';
                        strHdr = 'ChildrensAsthma'
                        hiddenExpandCollapse = hiddenChildrensAsthmaExpandCollapse;
                        break;
                    case 'vte':
                        cellRowSpan = 'cellVTERowSpan';
                        strHdr = 'VTE'
                        hiddenExpandCollapse = hiddenVTEExpandCollapse;
                        break;
                    case 'stk':
                        cellRowSpan = 'cellStrokeRowSpan';
                        strHdr = 'Stroke'
                        hiddenExpandCollapse = hiddenStrokeExpandCollapse;
                        break;
                    case 'scip':
                        cellRowSpan = 'cellSCIPRowSpan';
                        strHdr = 'SCIP'
                        hiddenExpandCollapse = hiddenSCIPExpandCollapse;
                        break;
                    case 'imm':
                        cellRowSpan = 'cellImmRowSpan';
                        strHdr = 'Imm'
                        hiddenExpandCollapse = hiddenImmExpandCollapse;
                        break;
                    case 'tob':
                        cellRowSpan = 'cellTobRowSpan';
                        strHdr = 'Tob'
                        hiddenExpandCollapse = hiddenTobExpandCollapse;
                        break;
                    case 'sub':
                        cellRowSpan = 'cellSubRowSpan';
                        strHdr = 'Sub'
                        hiddenExpandCollapse = hiddenSubExpandCollapse;
                        break;
                    case 'pc':
                        cellRowSpan = 'cellPcRowSpan';
                        strHdr = 'PC'
                        hiddenExpandCollapse = hiddenPCExpandCollapse;
                        break;
                    case 'hbips':
                        cellRowSpan = 'cellHbipsRowSpan';
                        strHdr = 'HBIPS'
                        hiddenExpandCollapse = hiddenHBIPSExpandCollapse;
                        break;
                    case 'sepsis':
                        cellRowSpan = 'cellSepsisRowSpan';
                        strHdr = 'Sepsis'
                        hiddenExpandCollapse = hiddenSEPSISExpandCollapse;
                        break;
                    case 'hs':
                        cellRowSpan = 'cellHSRowSpan';
                        strHdr = 'HS'
                        hiddenExpandCollapse = hiddenHSExpandCollapse;
                        break;
                }


                intHiddenValue = hiddenExpandCollapse;

                if (!intHiddenValue){errMsg = "intHiddenValue not found"}

                    for (var i = FirstHiddenRow; i < (rowTotal + 1); i++) {

                        var htmlTable = '<span id="ec|rowbtn';
                        htmlTable += i;
                        htmlTable += '" class="spanCursor2g">&nbsp';
                        htmlTable += '</span>';

                        htmlTable += "&nbsp";
                        document.getElementById('patientname' + i).innerHTML = htmlTable;  //"&nbsp";

                        document.getElementById('patientbdttm' + i).innerHTML = "&nbsp";

                        if (!document.getElementById('patientfin' + i))
                        {document.getElementById('patientmrn' + i).innerHTML = "&nbsp";}
                        else
                        {document.getElementById('patientfin' + i).innerHTML = "&nbsp";}

                        if (strRmBd == 1)
                        {document.getElementById('roombed' + i).innerHTML = "&nbsp";}

                        if (parseInt(intHiddenValue) == 0)  //the section is open
                        {
                            if (i == 1) {
                                //Verify if this is the first row.
                                //ED
                                tempValue = "";
                                tempValue = cellRowSpan;
                                var edHtml = document.getElementById(tempValue);
                                if (edHtml)
                                {
                                    document.getElementById(tempValue).innerHTML = "&nbsp";
                                }

                            }
                            else {
                                //ED
                                tempValue = "";
                                tempValue = cellRowSpan + i;
                                //tempValFrstRow = cellRowSpan + (FirstHiddenRow - 1);
                                var edHtml = document.getElementById(tempValue);
                                if (edHtml)
                                {
                                    document.getElementById(tempValue).innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
                                }
                            }

                            var secNm = "";
                            if (strHdr != 'AMI')
                            {secNm = strHdr;}
                            //Inpatient
                            tempValue = "";
                            tempValue = "patientIn" + secNm + i;
                            document.getElementById(tempValue).innerHTML = "&nbsp";
                            //Discharge
                            tempValue = "";
                            tempValue = "patientDischarge" + secNm + i;
                            document.getElementById(tempValue).innerHTML = "&nbsp";
                            //PreOp
                            tempValue = "";
                            tempValue = "patientPreOp" + secNm + i;
                            document.getElementById(tempValue).innerHTML = "&nbsp";
                            //PostOp
                            tempValue = "";
                            tempValue = "patientPostOp" + secNm + i;
                            document.getElementById(tempValue).innerHTML = "&nbsp";
                            //Status
                            tempValue = "";
                            tempValue = "patientStatus" + secNm + i;
                            document.getElementById(tempValue).innerHTML = "&nbsp";

                        }
                }
            }

            //cri
            if ((parseInt(criDisplayIndicator) > 0) && !blnFirstTimeCRI)
            {
                for (var i = FirstHiddenRow; i < (rowTotal + 1); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "cellCRIRowSpan";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "cellCRIRowSpan" + i;
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "patientInterventionCRI";
                    tempValue += i;
                    document.getElementById(tempValue).innerHTML = "";
                    //Signs & Symptoms of Infection
                    tempValue = "patientFallsCRI";
                    tempValue += i;
                    document.getElementById(tempValue).innerHTML = "";
                }
            }

            //falls
            if ((parseInt(fallsDisplayIndicator) > 0) && !blnFirstTimeFalls)
            {
                for (var i = FirstHiddenRow; i < (rowTotal + 1); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "cellFallsRowSpan";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "cellFallsRowSpan" + i;
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "patientInterventionFalls" + i;
                    document.getElementById(tempValue).innerHTML = "";
                    //Falls
                    tempValue = "patientFallsFalls" + i;
                    document.getElementById(tempValue).innerHTML = "";
                }
            }

            //Ped falls
            if ((parseInt(pediatricFallsDisplayIndicator) > 0) && !blnFirstTimeFallsPediatric)
            {
                for (var i = FirstHiddenRow; i < (rowTotal + 1); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "cellFallsRowSpan";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "cellFallsPediatricRowSpan" + i;
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "patientInterventionPediatric" + i;
                    document.getElementById(tempValue).innerHTML = "";
                    //Falls
                    tempValue = "patientFallsFallsPediatric" + i;
                    document.getElementById(tempValue).innerHTML = "";
                }
            }



            //Pain
            if ((parseInt(painIndicator) > 0) && !blnFirstTimePain)
            {
                for (var i = FirstHiddenRow; i < (rowTotal + 1); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "cellPainRowSpan";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "cellPainRowSpan" + i;
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "patientInterventionPain" + i;
                    document.getElementById(tempValue).innerHTML = "";
                    //Falls
                    tempValue = "patientPainPain" + i;
                    document.getElementById(tempValue).innerHTML = "";
                }
            }


            //Pressure Ulcers
            if ((parseInt(pressureUlcerDisplayIndicator) > 0) && !blnFirstTimePressureUlcers)
            {
                for (var i = FirstHiddenRow; i < (rowTotal + 1); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "cellPressureUlcersRowSpan";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "cellPressureUlcersRowSpan" + i;
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "patientInterventionPressureUlcers" + i;
                    document.getElementById(tempValue).innerHTML = "";
                    //Pressure Ulcers
                    tempValue = "patientFallsPressureUlcers" + i;
                    document.getElementById(tempValue).innerHTML = "";
                }
            }

            //Ped Pain
            if ((parseInt(pedPainIndicator) > 0) && !blnFirstTimePedPain)
            {
                for (var i = FirstHiddenRow; i < (rowTotal + 1); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "cellPedPainRowSpan";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "cellPedPainRowSpan" + i;
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //Interventions
                    tempValue = "patientInterventionPedPain" + i;
                    document.getElementById(tempValue).innerHTML = "";
                    //Pressure Ulcers
                    tempValue = "patientPainPedPain" + i;
                    document.getElementById(tempValue).innerHTML = "";
                }
            }
            //pSkin
            if ((parseInt(pSkinIndicator) > 0) && !blnFirstTimepSkin)
            {
                for (var i = FirstHiddenRow; i < (rowTotal + 1); i++) {
                    //Verify if this is the first row.
                    if (i == 1) {
                        //Assessment
                        tempValue = "cellpSkinRowSpan";
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    else {
                        //Assessment
                        tempValue = "cellpSkinRowSpan" + i;
                        document.getElementById(tempValue).innerHTML = "";
                    }
                    //integrity
                    tempValue = "patientIAssessmentpSkin" + i;
                    document.getElementById(tempValue).innerHTML = "";
                    //Interventions
                    tempValue = "patientInterventionpSkin" + i;
                    document.getElementById(tempValue).innerHTML = "";
                    //skin impairments
                    tempValue = "patientImpairmentpSkin" + i;
                    document.getElementById(tempValue).innerHTML = "";
                }
            }

            areHiddenRows = true;
        }
        catch (error)
        {
            showErrorMessage(error.message,"HideRows","","row = "+i+"\n strHdr = "+strHdr+"\n more info: "+errMsg);

        }
    }

    function NumSectionsClosed()
    {
        var errSection = 'AMI';
        try
        {
            var numSecsClosed = 0;
            intAMIHiddenValue = hiddenExpandCollapse;
            if (intAMIHiddenValue == '1'){numSecsClosed++;errSection = "HF";}
            intHeartFailureHiddenValue = hiddenHeartFailureExpandCollapse;
            if (intHeartFailureHiddenValue == '1'){numSecsClosed++;errSection = "PN";}
            intPneumoniaHiddenValue = hiddenPneumoniaExpandCollapse;
            if (intPneumoniaHiddenValue == '1'){numSecsClosed++;errSection = "CAC";}
            intChildrensAsthmaHiddenValue = hiddenChildrensAsthmaExpandCollapse;
            if (intChildrensAsthmaHiddenValue == '1'){numSecsClosed++;errSection = "VTE";}
            intVTEHiddenValue = hiddenVTEExpandCollapse;
            if (intVTEHiddenValue == '1'){numSecsClosed++;errSection = "STK";}
            intStrokeHiddenValue = hiddenStrokeExpandCollapse;
            if (intStrokeHiddenValue == '1'){numSecsClosed++;errSection = "SCIP";}
            intSCIPHiddenValue = hiddenSCIPExpandCollapse;
            if (intSCIPHiddenValue == '1'){numSecsClosed++;errSection = "PU";}
            intPressureUlcersHiddenValue = hiddenPressureUlcersExpandCollapse;
            if (intPressureUlcersHiddenValue == '1'){numSecsClosed++;errSection = "CRI";}
            intCRIHiddenValue = hiddenCRIExpandCollapse;
            if (intCRIHiddenValue == '1'){numSecsClosed++;errSection = "FALLS";}
            intFallsHiddenValue = hiddenFallsExpandCollapse;
            if (intFallsHiddenValue == '1'){numSecsClosed++;errSection = "FALLSPED";}
            intFallsPediatricHiddenValue = hiddenFallsPediatricExpandCollapse;
            if (intFallsPediatricHiddenValue == '1'){numSecsClosed++;errSection = "PAIN";}
            intPainHiddenValue = hiddenPainExpandCollapse;
            if (intPainHiddenValue == '1'){numSecsClosed++;errSection = "PEDPAIN";}
            intPedPainHiddenValue = hiddenPedPainExpandCollapse;
            if (intPedPainHiddenValue == '1'){numSecsClosed++;errSection = "pSKIN";}
            intpSkinHiddenValue = hiddenpSkinExpandCollapse;
            if (intpSkinHiddenValue == '1'){numSecsClosed++;errSection = "IMM";}
            intImmHiddenValue = hiddenImmExpandCollapse;
            if (intImmHiddenValue == '1'){numSecsClosed++;errSection = "TOB";}
            intTobHiddenValue = hiddenTobExpandCollapse;
            if (intTobHiddenValue == '1'){numSecsClosed++;errSection = "SUB";}
            intSubHiddenValue = hiddenSubExpandCollapse;
            if (intSubHiddenValue == '1'){numSecsClosed++;errSection = "PC";}
            intPcHiddenValue = hiddenPCExpandCollapse;
            if (intPcHiddenValue == '1'){numSecsClosed++;errSection = "HBIPS";}
            intHbipsHiddenValue = hiddenHBIPSExpandCollapse;
            if (intHbipsHiddenValue == '1'){numSecsClosed++;}
            intSepsisHiddenValue = hiddenSEPSISExpandCollapse
            if (intSepsisHiddenValue == '1'){numSecsClosed++;errSection = "SEPSIS";}
            intHSHiddenValue = hiddenHSExpandCollapse;
            if (intHSHiddenValue == '1'){numSecsClosed++;errSection = "HS";}

            return numSecsClosed;
        }
        catch (error)
        {
            showErrorMessage(error.message,"NumSectionsClosed, Section--->"+errSection,"","");
            return numSecsClosed;
        }
    }

    /**
    * Fills the section with values. Returns True if everything went well else it returns False.
    * @return{Boolean}
    */
    function FillSection(oSecObj)
    {
        var blnStatus = true;
        try
        {
            //Verify which value the patient indicator has.
            //0 = Both qualifying and non qualifying patients.
            //1 = Only qualifying patients.
            if (strPtQualind == 1)
            {
                //Get values for the section.
                blnStatus = getQualifyingNHIQMSections(oSecObj.blnAddHiddenCells,oSecObj.strSectionName,oSecObj.secReply);
            }
            else
            {
                //Get values for the section.
                blnStatus = getNHIQMSections(oSecObj.blnAddHiddenCells,oSecObj.strSectionName,oSecObj.secReply);
            }
        }
        catch (error)
        {
            showErrorMessage(error.message,"FillSection","","");
            blnStatus = false;
        }
        return blnStatus;
    }

    function getSection(oSecObj)
    {
        /*
        oSecObj.cclProg
        oSecObj.strSectionName
        oSecObj.secDisplayNm
        oSecObj.json_data<-----returned from getSection
         */
        var qmReqObject = "";
        var blnLoadSection = true;
        var cclParam = "";
        var strErrorMessage = "An error has occurred when getting data for " + oSecObj.secDisplayNm;
        var strSecJSON = "";
        var cclProg = oSecObj.cclProg;
        try
        {
            if (requestAsync)
            {
                //A request is in progress, so don't make another one.
            }
            else
            {
                //Display Load Text.
                displayLoadText(oSecObj.strSectionName);
                //Verify which value the patient indicator has.
                //0 = Both qualifying and non qualifying patients.
                //1 = Only qualifying patients.
                if (strPtQualind == 1)
                {
                    //Load responses text into object.
                    switch (oSecObj.strSectionName.toLowerCase())
                    {
                        case 'ami':
                            strSecJSON = json_data2.PTREPLY.AMIJSON;
                            json_data3 = JSON.parse(strSecJSON);
                            blnAmiCalled = true;
                            break;
                        case 'hf':
                            strSecJSON = json_data2.PTREPLY.HFJSON;
                            json_data4 = JSON.parse(strSecJSON);
                            blnHeartFailureCalled = true;
                            break;
                        case 'pn':
                            strSecJSON = json_data2.PTREPLY.PNJSON;
                            json_data5 = JSON.parse(strSecJSON);
                            blnPneumoniaCalled = true;
                            break;
                        case 'cac':
                            strSecJSON = json_data2.PTREPLY.CACJSON;
                            json_data6 = JSON.parse(strSecJSON);
                            blnChildrensAsthmaCalled = true;
                            break;
                        case 'vte':
                            strSecJSON = json_data2.PTREPLY.VTEJSON;
                            json_data7 = JSON.parse(strSecJSON);
                            blnVTECalled = true;
                            break;
                        case 'stk':
                            strSecJSON = json_data2.PTREPLY.STKJSON;
                            json_data8 = JSON.parse(strSecJSON);
                            blnStrokeCalled = true;
                            break;
                        case 'scip':
                            strSecJSON = json_data2.PTREPLY.SCIPJSON;
                            json_data9 = JSON.parse(strSecJSON);
                            blnSCIPCalled = true;
                            break;
                        case 'imm':
                            strSecJSON = json_data2.PTREPLY.IMMJSON;
                            json_dataImm = JSON.parse(strSecJSON);
                            blnImmCalled = true;
                            break;
                        case 'tob':
                            strSecJSON = json_data2.PTREPLY.TOBJSON;
                            json_dataTob = JSON.parse(strSecJSON);
                            blnTobCalled = true;
                            break;
                        case 'sub':
                            strSecJSON = json_data2.PTREPLY.SUBJSON;
                            json_dataSub = JSON.parse(strSecJSON);
                            blnSubCalled = true;
                            break;
                        case 'pc':
                            strSecJSON = json_data2.PTREPLY.PCJSON;
                            json_dataPc = JSON.parse(strSecJSON);
                            blnPcCalled = true;
                            break;
                        case 'hbips':
                            strSecJSON = json_data2.PTREPLY.HBIPSJSON;
                            json_dataHbips = JSON.parse(strSecJSON);
                            blnHbipsCalled = true;
                            break;
                        case 'sepsis':
                            strSecJSON = json_data2.PTREPLY.SEPSISJSON;
                            json_dataSepsis = JSON.parse(strSecJSON);
                            blnSepsisCalled = true;
                            break;
                        case 'hs':
                            strSecJSON = json_data2.PTREPLY.HSJSON;
                            json_dataHS = JSON.parse(strSecJSON);
                            blnHSCalled = true;
                            break;
                    }
                    expandCollapseSection(oSecObj.strSectionName);

                    //Hide Load Text.
                    setTimeout("hideLoadText()",hideLoadTextDelay);
                    //This flag is used in the function getExpandedTimer.  002
                    intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
                }
                else
                {
                    //Build JSON String.
                    qmReqObject += '{"QMREQ":{"PRSNLID":';
                    qmReqObject += userPersonID;
                    qmReqObject += ',"DOMAINID":0,"DOMAINGRPID":0,"APPCNTXID":0,"DEVLOCCD":'
                    qmReqObject += devLocation;
                    qmReqObject += ',"APPID":';
                    qmReqObject += applicationID;
                    qmReqObject += ',"CLIENTNM":"0","RELTNCD":0,"PTLISTID":';
                    qmReqObject +=  selectedID;
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
                    //prompt("Parameters sent to CCL",cclParam)
                    requestAsync = getXMLCclRequest();
                    requestAsync.onreadystatechange = function()
                    {
                        if (requestAsync.readyState == 4 && requestAsync.status == 200)
                        {
                            if (requestAsync.responseText > " ")
                            {
                                try
                                {
                                    //Load responses text into object.
                                    json_data2 = JSON.parse(requestAsync.responseText);
                                    //Hide Load Text.
                                    setTimeout("hideLoadText()",hideLoadTextDelay);
                                    //This flag is used in the function getExpandedTimer. 002
                                    intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
                                    oSecObj.blnCalled = true;
                                    switch (oSecObj.strSectionName.toLowerCase())
                                    {
                                        case 'ami':
                                            json_data3 = json_data2;
                                            blnAmiCalled = true;
                                            break;
                                        case 'hf':
                                            json_data4 = json_data2;
                                            blnHeartFailureCalled = true;
                                            break;
                                        case 'pn':
                                            json_data5 = json_data2;
                                            blnPneumoniaCalled = true;
                                            break;
                                        case 'cac':
                                            json_data6 = json_data2;
                                            blnChildrensAsthmaCalled = true;
                                            break;
                                        case 'vte':
                                            json_data7 = json_data2;
                                            blnVTECalled = true;
                                            break;
                                        case 'stk':
                                            json_data8 = json_data2;
                                            blnStrokeCalled = true;
                                            break;
                                        case 'scip':
                                            json_data9 = json_data2;
                                            blnSCIPCalled = true;
                                            break;
                                        case 'imm':
                                            json_dataImm = json_data2;
                                            blnImmCalled = true;
                                            break;
                                        case 'tob':
                                            json_dataTob = json_data2;
                                            blnTobCalled = true;
                                            break;
                                        case 'sub':
                                            json_dataSub = json_data2;
                                            blnSubCalled = true;
                                            break;
                                        case 'pc':
                                            json_dataPc = json_data2;
                                            blnPcCalled = true;
                                            break;
                                        case 'hbips':
                                            json_dataHbips = json_data2;
                                            blnHbipsCalled = true;
                                            break;
                                        case 'sepsis':
                                            json_dataSepsis = json_data2;
                                            blnSepsisCalled = true;
                                            break;
                                        case 'hs':
                                            json_dataHS = json_data2;
                                            blnHSCalled = true;
                                            break;
                                    }
                                    expandCollapseSection(oSecObj.strSectionName);
                                }
                                catch (error)
                                {
                                    //Hide Load Text.
                                    setTimeout("hideLoadText()",hideLoadTextDelay);
                                    //Set Error Message.
                                    showErrorMessage(error.message,"getSection(), section name: " + oSecObj.strSectionName +"\n cclProg = "+oSecObj.cclProg,requestAsync.status+"\n readyState = "+requestAsync.readyState+"\n Returned JSON = "+requestAsync.responseText,cclParam);
                                }
                            }
                            requestAsync = null;
                        }
                        else if (requestAsync.readyState == 4 && requestAsync.readyState != 200)
                        {
                            //Hide Load Text.
                            setTimeout("hideLoadText()",hideLoadTextDelay);
                            //Set Error Message.
                            showErrorMessage(strErrorMessage,"getSection(), section name: " + oSecObj.strSectionName,requestAsync.status,cclParam);
                        }
                    };
                    //Sends the request to the CCL server.
                    if (location.protocol.substr(0, 4) == "http")
                    {
                        var url = location.protocol + "//" + location.host + "/discern/mpages/reports/" + cclProg ;
                        requestAsync.open("POST", url);
                        requestAsync.send(cclParam);
                    }
                    else
                    {
                        requestAsync.open("POST", cclProg);
                        requestAsync.send(cclParam);
                    }
                }
            }
        }
        catch (error)
        {
            //Hide Load Text.
            setTimeout("hideLoadText()",hideLoadTextDelay);
            showErrorMessage(error.message,"getSection(), section name: " + oSecObj.strSectionName,"",cclParam);
        }
    }

    /**
    * Gets values for the NHIQM sections. Returns True if everything went well else it returns False.
    * @param {Boolean} blnAddHiddenCells Contains True if hidden cells are going to be created else it contains False.
    * @param {String} strSectionName Section NHIQM abbreviation.
    * @param {Object} objJSON The JSON structure object.
    * @return {Boolean}
    */
    function getNHIQMSections(blnAddHiddenCells,strSectionName,objJSON)
    {
        var blnStatus = true;
        var tempValueX = ""
        var tempValueY = ""; //002 for dynamic column
        var tempString = "";
        var tempValue = "";
        var colmnCNT = 0;
        var patientEncounterID = 0;
        var ptQual = 0;
        var intEDColumn = 0;
        var intInpatientColumn = 0;
        var inteDischargeColumn = 0;
        var intPreOpColumn = 0;
        var intePostOpColumn = 0;
        var pwStatus = "";
        var pwName = "";
        var strEventType = "";
        var strEventName = "";
        var strEDHoverText = "";
        var strEDHoverSPANID = "";
        var strInpatientHoverText = "";
        var strInpatientHoverSPANID = "";
        var strDischargeHoverText = "";
        var strDischargeHoverSPANID = "";
        var strPreOpHoverText = "";
        var strPreOpHoverSPANID = "";
        var strPostOpHoverText = "";
        var strPostOpHoverSPANID = "";
        var strImageSource = "";
        var strEDAlarmClock = "";
        var strInpatientAlarmClock = "";
        var strDischargeAlarmClock = "";
        var strPreOpAlarmClock = "";
        var strPostOpAlarmClock = "";
        var strEDCircle = "";
        var strInpatientCircle = "";
        var strDischargeCircle = "";
        var strPreOpCircle = "";
        var strPostOpCircle = "";
        var intEDCircle = 0;
        var intInpatientCircle = 0;
        var intDischargeCircle = 0;
        var intPreOpCircle = 0;
        var intPostOpCircle = 0;
        var patientName = "";
        var patientNameAssess = "";
        var alink = "";
        var patientID = "";
        var endLinkTag = "</a>";
        var tempTableWidth = "";
        var blnHideAMIRows = true;
        var strSubColumn1 = "";
        var strSubColumn2 = "";
        var strSubColumn3 = "";
        var strSubColumn4 = "";
        var strSubColumn5 = "";
        var strMainColumn = "";
        var strHoverHeadLine = "";
        var rowEDName = "";
        var rowInpatientName = "";
        var rowDischargeName = "";
        var rowPreOpName = "";
        var rowPostOpName = "";
        var blnEDRowSpan = false;
        var strStatusDisp = "";
        var strAssessLink = "";
        var strAssessEvents = "";
        var strAssessRmvDisp = "";
        var strAssessNomenDisp = "";
        var intAssessNomenDispTotal = 0;
        var intOutcomeFrmId = 0;
        var strOutcomeLink = "";
        var strModalOrderEntryWindowLink = "";
        var strModalOrderEntryWindowLinkName = "Order";
        var tabLinkName = "";
        var uniqueRowID = 0;
        var sbHdrDispArray;

        //006 Varibles to check if Venue has at least one measure that is time sensitive
        var edVenueAlarmClock = 0;
        var inpVenueAlarmClock = 0;
        var postopVenueAlarmClock = 0;
        var preopVenueAlarmClock = 0;
        var dischVenueAlarmClock = 0;

        try {
            //Verify how many columns that are displayed and adjust the colspan for the Header Row.
            colmnCNT = objJSON.COLMNCNT;
            //Hide/Show column indicators
            intEDColumn = objJSON.EDIND;
            intInpatientColumn = objJSON.IPIND;
            inteDischargeColumn = objJSON.DISCHIND;
            intPreOpColumn = objJSON.PREOPIND;
            intePostOpColumn = objJSON.POSTOPIND;
            strAssessRmvDisp = objJSON.RMVDISP;

            if (objJSON.TABNAME > ""){
                tabName = objJSON.TABNAME;
            } else {
                tabName = "Orders";
            }

            PgRecTotal = GetNumPgRecords();

            //Verify which section it is.
            switch (strSectionName.toLowerCase()) {
            case "ami":
                strSubColumn1 = "secsubcolAMI1";
                strSubColumn2 = "secsubcolAMI2";
                strSubColumn3 = "secsubcolAMI3";
                strSubColumn4 = "secsubcolAMI4";
                strSubColumn5 = "secsubcolAMI5";
                strMainColumn = "secpatlisthdrAMI";
                strHoverHeadLine = i18n.condDisp.AMI_HVR;
                rowEDName = "patientED";
                rowInpatientName = "patientIn";
                rowDischargeName = "patientDischarge";
                rowPreOpName = "patientPreOp";
                rowPostOpName = "patientPostOp";
                blnEDRowSpan = false;
                sbHdrDispArray = amiSbHdrDispArray;
                break;
            case "hf":
                strSubColumn1 = "secsubcolHeartFailure1";
                strSubColumn2 = "secsubcolHeartFailure2";
                strSubColumn3 = "secsubcolHeartFailure3";
                strSubColumn4 = "secsubcolHeartFailure4";
                strSubColumn5 = "secsubcolHeartFailure5";
                strMainColumn = "secpatlisthdrHeartFailure";
                strHoverHeadLine = i18n.condDisp.HEART_FAILURE_HVR;
                rowEDName = "cellHeartFailureRowSpan";
                rowInpatientName = "patientInHeartFailure";
                rowDischargeName = "patientDischargeHeartFailure";
                rowPreOpName = "patientPreOpHeartFailure";
                rowPostOpName = "patientPostOpHeartFailure";
                blnEDRowSpan = true;
                sbHdrDispArray = hrtFailSbHdrDispArray;
                break;
            case "pn":
                strSubColumn1 = "secsubcolPneumonia1";
                strSubColumn2 = "secsubcolPneumonia2";
                strSubColumn3 = "secsubcolPneumonia3";
                strSubColumn4 = "secsubcolPneumonia4";
                strSubColumn5 = "secsubcolPneumonia5";
                strMainColumn = "secpatlisthdrPneumonia";
                strHoverHeadLine = i18n.condDisp.PNEUMONIA_HVR;
                rowEDName = "cellPneumoniaRowSpan";
                rowInpatientName = "patientInPneumonia";
                rowDischargeName = "patientDischargePneumonia";
                rowPreOpName = "patientPreOpPneumonia";
                rowPostOpName = "patientPostOpPneumonia";
                blnEDRowSpan = true;
                sbHdrDispArray = pneuSbHdrDispArray;
                break;
            case "cac":
                strSubColumn1 = "secsubcolChildrensAsthma1";
                strSubColumn2 = "secsubcolChildrensAsthma2";
                strSubColumn3 = "secsubcolChildrensAsthma3";
                strSubColumn4 = "secsubcolChildrensAsthma4";
                strSubColumn5 = "secsubcolChildrensAsthma5";
                strMainColumn = "secpatlisthdrChildrensAsthma";
                strHoverHeadLine = i18n.condDisp.CHILDRENS_ASTHMA_HVR;
                rowEDName = "cellChildrenAsthmaRowSpan";
                rowInpatientName = "patientInChildrensAsthma";
                rowDischargeName = "patientDischargeChildrensAsthma";
                rowPreOpName = "patientPreOpChildrensAsthma";
                rowPostOpName = "patientPostOpChildrensAsthma";
                blnEDRowSpan = true;
                sbHdrDispArray = cacSbHdrDispArray;
                break;
            case "vte":
                strSubColumn1 = "secsubcolVTE1";
                strSubColumn2 = "secsubcolVTE2";
                strSubColumn3 = "secsubcolVTE3";
                strSubColumn4 = "secsubcolVTE4";
                strSubColumn5 = "secsubcolVTE5";
                strMainColumn = "secpatlisthdrVTE";
                strHoverHeadLine = i18n.condDisp.VTE_HVR;
                rowEDName = "cellVTERowSpan";
                rowInpatientName = "patientInVTE";
                rowDischargeName = "patientDischargeVTE";
                rowPreOpName = "patientPreOpVTE";
                rowPostOpName = "patientPostOpVTE";
                blnEDRowSpan = true;
                sbHdrDispArray = vteSbHdrDispArray;
                break;
            case "stk":
                strSubColumn1 = "secsubcolStroke1";
                strSubColumn2 = "secsubcolStroke2";
                strSubColumn3 = "secsubcolStroke3";
                strSubColumn4 = "secsubcolStroke4";
                strSubColumn5 = "secsubcolStroke5";
                strMainColumn = "secpatlisthdrStroke";
                strHoverHeadLine = i18n.condDisp.STROKE_HVR;
                rowEDName = "cellStrokeRowSpan";
                rowInpatientName = "patientInStroke";
                rowDischargeName = "patientDischargeStroke";
                rowPreOpName = "patientPreOpStroke";
                rowPostOpName = "patientPostOpStroke";
                blnEDRowSpan = true;
                sbHdrDispArray = strokeSbHdrDispArray;
                break;
            case "scip":
                //Total number of SCIP values.
                totalSCIP = GetNumPgRecords();
                strSubColumn1 = "secsubcolSCIP1";
                strSubColumn2 = "secsubcolSCIP2";
                strSubColumn3 = "secsubcolSCIP3";
                strSubColumn4 = "secsubcolSCIP4";
                strSubColumn5 = "secsubcolSCIP5";
                strMainColumn = "secpatlisthdrSCIP";
                strHoverHeadLine = i18n.condDisp.SCIP_HVR;
                rowEDName = "cellSCIPRowSpan";
                rowInpatientName = "patientInSCIP";
                rowDischargeName = "patientDischargeSCIP";
                rowPreOpName = "patientPreOpSCIP";
                rowPostOpName = "patientPostOpSCIP";
                blnEDRowSpan = true;
                sbHdrDispArray = scipSbHdrDispArray;
                break;
            case "imm":
                strSubColumn1 = "secsubcolImm1";
                strSubColumn2 = "secsubcolImm2";
                strSubColumn3 = "secsubcolImm3";
                strSubColumn4 = "secsubcolImm4";
                strSubColumn5 = "secsubcolImm5";
                strMainColumn = "secpatlisthdrImm";
                strHoverHeadLine = i18n.condDisp.IMM_HVR;
                rowEDName = "cellImmRowSpan";
                rowInpatientName = "patientInImm";
                rowDischargeName = "patientDischargeImm";
                rowPreOpName = "patientPreOpImm";
                rowPostOpName = "patientPostOpImm";
                blnEDRowSpan = true;
                sbHdrDispArray = immSbHdrDispArray;
                break;
            case "tob":
                strSubColumn1 = "secsubcolTob1";
                strSubColumn2 = "secsubcolTob2";
                strSubColumn3 = "secsubcolTob3";
                strSubColumn4 = "secsubcolTob4";
                strSubColumn5 = "secsubcolTob5";
                strMainColumn = "secpatlisthdrTob";
                strHoverHeadLine = i18n.condDisp.TOB_HVR;
                rowEDName = "cellTobRowSpan";
                rowInpatientName = "patientInTob";
                rowDischargeName = "patientDischargeTob";
                rowPreOpName = "patientPreOpTob";
                rowPostOpName = "patientPostOpTob";
                blnEDRowSpan = true;
                sbHdrDispArray = tobSbHdrDispArray;
                break;
            case "sub":
                strSubColumn1 = "secsubcolSub1";
                strSubColumn2 = "secsubcolSub2";
                strSubColumn3 = "secsubcolSub3";
                strSubColumn4 = "secsubcolSub4";
                strSubColumn5 = "secsubcolSub5";
                strMainColumn = "secpatlisthdrSub";
                strHoverHeadLine = i18n.condDisp.SUB_HVR;
                rowEDName = "cellSubRowSpan";
                rowInpatientName = "patientInSub";
                rowDischargeName = "patientDischargeSub";
                rowPreOpName = "patientPreOpSub";
                rowPostOpName = "patientPostOpSub";
                blnEDRowSpan = true;
                sbHdrDispArray = subSbHdrDispArray;
                break;
            case "pc":
                strSubColumn1 = "secsubcolPC1";
                strSubColumn2 = "secsubcolPC2";
                strSubColumn3 = "secsubcolPC3";
                strSubColumn4 = "secsubcolPC4";
                strSubColumn5 = "secsubcolPC5";
                strMainColumn = "secpatlisthdrPC";
                strHoverHeadLine = i18n.condDisp.PC_HVR;
                rowEDName = "cellPCRowSpan";
                rowInpatientName = "patientInPC";
                rowDischargeName = "patientDischargePC";
                rowPreOpName = "patientPreOpPC";
                rowPostOpName = "patientPostOpPC";
                blnEDRowSpan = true;
                sbHdrDispArray = pcSbHdrDispArray;
                break;
            case "hbips":
                strSubColumn1 = "secsubcolHBIPS1";
                strSubColumn2 = "secsubcolHBIPS2";
                strSubColumn3 = "secsubcolHBIPS3";
                strSubColumn4 = "secsubcolHBIPS4";
                strSubColumn5 = "secsubcolHBIPS5";
                strMainColumn = "secpatlisthdrHBIPS";
                strHoverHeadLine = i18n.condDisp.HBIPS_HVR;
                rowEDName = "cellHBIPSRowSpan";
                rowInpatientName = "patientInHBIPS";
                rowDischargeName = "patientDischargeHBIPS";
                rowPreOpName = "patientPreOpHBIPS";
                rowPostOpName = "patientPostOpHBIPS";
                blnEDRowSpan = true;
                sbHdrDispArray = hbipsSbHdrDispArray;
                break;
            case "sepsis":
                strSubColumn1 = "secsubcolSEPSIS1";
                strSubColumn2 = "secsubcolSEPSIS2";
                strSubColumn3 = "secsubcolSEPSIS3";
                strSubColumn4 = "secsubcolSEPSIS4";
                strSubColumn5 = "secsubcolSEPSIS5";
                strMainColumn = "secpatlisthdrSEPSIS";
                strHoverHeadLine = i18n.condDisp.SEPSIS_HVR;
                rowEDName = "cellSEPSISRowSpan";
                rowInpatientName = "patientInSEPSIS";
                rowDischargeName = "patientDischargeSEPSIS";
                rowPreOpName = "patientPreOpSEPSIS";
                rowPostOpName = "patientPostOpSEPSIS";
                blnEDRowSpan = true;
                sbHdrDispArray = sepsisSbHdrDispArray;
                break;
            case "hs":
                strSubColumn1 = "secsubcolHS1";
                strSubColumn2 = "secsubcolHS2";
                strSubColumn3 = "secsubcolHS3";
                strSubColumn4 = "secsubcolHS4";
                strSubColumn5 = "secsubcolHS5";
                strMainColumn = "secpatlisthdrHS";
                strHoverHeadLine = i18n.condDisp.HS_HVR;
                rowEDName = "cellHSRowSpan";
                rowInpatientName = "patientInHS";
                rowDischargeName = "patientDischargeHS";
                rowPreOpName = "patientPreOpHS";
                rowPostOpName = "patientPostOpHS";
                blnEDRowSpan = true;
                sbHdrDispArray = hsSbHdrDispArray;
                break;
            }
            var secColumns = 6;
            //***********************hide columns that are not to be displayed****************************
            //ED
            if (intEDColumn == 0) {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn1,rowEDName,strSectionName,strMainColumn);
            }
            //Inpatient
            if (intInpatientColumn == 0) {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn2,rowInpatientName,strSectionName,strMainColumn);
            }
            //Discharge
            if (inteDischargeColumn == 0) {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn3,rowDischargeName,strSectionName,strMainColumn);
            }
            //PreOp
            if (intPreOpColumn == 0) {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn4,rowPreOpName,strSectionName,strMainColumn);
            }
            //PostOp
            if (intePostOpColumn == 0) {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn5,rowPostOpName,strSectionName,strMainColumn);
            }

            var oSecObj = new Object();
            oSecObj.intEDColumn = intEDColumn;
            oSecObj.strSectionName = strSectionName;
            oSecObj.secColumns = secColumns;
            secObjAr.push(oSecObj);

            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < objJSON.NOMENLIST.length; intCounter++) {
                //Verify if this is the first record in the loop.
                if (intCounter == 0) {
                    strAssessNomenDisp += objJSON.NOMENLIST[intCounter].NOMENDISP;
                }
                else {
                    strAssessNomenDisp += '|';
                    strAssessNomenDisp += objJSON.NOMENLIST[intCounter].NOMENDISP;
                }
            }

            //Get the total number of NOMENDISP.
            intAssessNomenDispTotal = objJSON.NOMENLIST.length;
            tabName1= encodeURIComponent(tabName);
            tabName1= encodeURIComponent(tabName1);
            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < objJSON.LIST.length; intCounter++) {
                if (patientEncounterID != objJSON.LIST[intCounter].EID) {

                    //Reset variables.
                    patientEncounterID = 0;
                    ptQual = 0;
                    tempValueX = "";
                    tempValueY = ""; //002 for dynamic column
                    tempString = "";
                    pwStatus = "";
                    pwName = "";
                    strEDHoverText = "";
                    strEDHoverSPANID = "";
                    strInpatientHoverText = "";
                    strInpatientHoverSPANID = "";
                    strDischargeHoverText = "";
                    strDischargeHoverSPANID = "";
                    strPreOpHoverText = "";
                    strPreOpHoverSPANID = "";
                    strPostOpHoverText = "";
                    strPostOpHoverSPANID = "";
                    strEDAlarmClock = "";
                    strInpatientAlarmClock = "";
                    strDischargeAlarmClock = "";
                    strPreOpAlarmClock = "";
                    strPostOpAlarmClock = "";
                    patientName = "";
                    patientNameAssess = "";
                    patientID = "";
                    strEDCircle = "";
                    strInpatientCircle = "";
                    strDischargeCircle = "";
                    strPreOpCircle = "";
                    strPostOpCircle = "";
                    intEDCircle = 0;
                    intInpatientCircle = 0;
                    intDischargeCircle = 0;
                    intPreOpCircle = 0;
                    intPostOpCircle = 0;
                    strAssessLink = "";
                    strAssessEvents = "";
                    strModalOrderEntryWindowLink = "";

                    //006
                    edVenueAlarmClock = 0;//reset for each person
                    inpVenueAlarmClock = 0 //reset for each person
                    postopVenueAlarmClock = 0; //reset for each person
                    preopVenueAlarmClock = 0; //reset for each person
                    dischVenueAlarmClock = 0; //reset for each person

                    patientEncounterID = objJSON.LIST[intCounter].EID;
                    ptQual = objJSON.LIST[intCounter].PTQUAL;
                    patientName = objJSON.LIST[intCounter].NAME;
                    patientNameAssess = patientName;
                    patientID = objJSON.LIST[intCounter].PID;
                    pwStatus = objJSON.LIST[intCounter].PWSTATUS;
                    pwName = objJSON.LIST[intCounter].PWNAME;
                    intEDCircle = objJSON.LIST[intCounter].EDSTAT;
                    intInpatientCircle = objJSON.LIST[intCounter].IPSTAT;
                    intDischargeCircle = objJSON.LIST[intCounter].DISCHSTAT;
                    intPreOpCircle = objJSON.LIST[intCounter].PREOPSTAT;
                    intPostOpCircle = objJSON.LIST[intCounter].POSTOPSTAT;

                    var oPatData = null;
                    var objIdx = getPatObjIdxByEnctr(patientEncounterID)

                    if (objIdx != null) //meaning the encounter was found
                    {
                        oPatData = patData[objIdx];

                        if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                        {uniqueRowID++;}

                        tempString = 'patEncounter' + uniqueRowID;

                        if (oPatData != null) {

                        //Verify if the patient name consist of " or ' characters.
                        //^^ = "
                        //^ = '
                            if (patientName.indexOf("^^") > -1) {
                            patientName = patientName.replace("^^","&#34;");
                        }
                            if (patientName.indexOf("^") > -1) {
                            patientName = patientName.replace("^","&#39;");
                        }

                        var strAppXe = "powerchart.exe";

                        alink = "<a href=`" + 'javascript:launchTab(/' + tabName1 + '/,' + patientID + ',' + patientEncounterID + ");`"  //006
                                        + " title='" + i18n.OPEN_CHART + patientName + i18n.TO_DOCUMENT_INFO + "' class='LinkText'>"; //006

                        strModalOrderEntryWindowLink = "<a href='javascript:launchModalOrderEntryWindow(" + patientID + ',' + patientEncounterID + ");'"
                            + "title='Open Modal Order Entry Window.' class='LinkText'>";

                        //Verify if PTQUAL is greater than 0.
                        if (ptQual > 0) {
                            //1 = BASIC REQ
                            //2 = HAS PLAN
                            //3 = EXCLUDED
                            //4 = NEEDS PLAN
                            switch (ptQual) {
                            //1 = BASIC REQ
                            case 1:
                                //ED
                                        if (intEDColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[0]);
                                    if (!oPatData){return;}

                                }
                                //Inpatient
                                        if (intInpatientColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[1]);
                                    if (!oPatData){return;}
                                }
                                //Discharge
                                        if (inteDischargeColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[2]);
                                    if (!oPatData){return;}
                                }
                                //PreOp
                                        if (intPreOpColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[3]);
                                    if (!oPatData){return;}
                                }
                                //PostOp
                                        if (intePostOpColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[4]);
                                    if (!oPatData){return;}
                                }
                                //Status (Note: this column will always be displayed).
                                oPatData = PopulateSection(strSectionName,pwStatus,tempString,oPatData,sbHdrDispArray[5]);
                                if (!oPatData){return;}
                                break;

                            //2 = HAS PLAN
                            case 2:
                                //Verify which icon that is going to be displayed in the column.
                                //0 = Not Done
                                //1 = Not Met
                                //2 = Met
                                //ED
                                //Reset variable.


                                strEDCircle = GetCircle(intEDCircle);
                                strInpatientCircle = GetCircle(intInpatientCircle);
                                strDischargeCircle = GetCircle(intDischargeCircle);
                                strPreOpCircle = GetCircle(intPreOpCircle);
                                strPostOpCircle = GetCircle(intPostOpCircle);

                                //Build Hovers.
                                //ED
                                strEDHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strEDHoverSPANID += '<tr><td><b>';
                                strEDHoverSPANID += strHoverHeadLine;
                                strEDHoverSPANID += i18n.condDisp.ED_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                //Inpatient
                                strInpatientHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strInpatientHoverSPANID += '<tr><td><b>';
                                strInpatientHoverSPANID += strHoverHeadLine;
                                strInpatientHoverSPANID += i18n.condDisp.INPATIENT_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                //Discharge
                                strDischargeHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strDischargeHoverSPANID += '<tr><td><b>';
                                strDischargeHoverSPANID += strHoverHeadLine;
                                strDischargeHoverSPANID += i18n.condDisp.DISCHARGE_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                //PreOp
                                strPreOpHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strPreOpHoverSPANID += '<tr><td><b>';
                                strPreOpHoverSPANID += strHoverHeadLine;
                                strPreOpHoverSPANID += i18n.condDisp.PREOP_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                //PostOp
                                strPostOpHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strPostOpHoverSPANID += '<tr><td><b>';
                                strPostOpHoverSPANID += strHoverHeadLine;
                                strPostOpHoverSPANID += i18n.condDisp.POSTOP_MEASURES + '</b></td><td><b>Status</b></td></tr>';

                                //Loop through the EVENTS.
                                for (var intCounter2 = 0; intCounter2 < objJSON.LIST[intCounter].EVENTS.length; intCounter2++) {
                                    //Reset variables.
                                    strEventType = "";
                                    strImageSource = "";
                                    tempValue = "";
                                    intOutcomeFrmId = 0;
                                    strOutcomeLink = "";

                                    strTMIND = "";
                                    strEventStatus = "";


                                    strEventType = objJSON.LIST[intCounter].EVENTS[intCounter2].TYPE;
                                    strStatusDisp = objJSON.LIST[intCounter].EVENTS[intCounter2].STATUSDISP;

                                    intOutcomeFrmId = objJSON.LIST[intCounter].EVENTS[intCounter2].OUTCOMEFRMID;

                                    var evntObj = objJSON.LIST[intCounter].EVENTS[intCounter2]
                                    evntObj.patientID = patientID;
                                    evntObj.patientEncounterID = patientEncounterID;
                                    strOutcomeLink = CreateOutComeLink(evntObj);

                                    //Verify TYPE.
                                    switch (strEventType.toUpperCase()) {
                                    case "ED":
                                        var imgInfo = GetImageInfo(intEDCircle,evntObj);
                                        //006 strEDAlarmClock = imgInfo.strAlarmClock;
                                        strImageSource = imgInfo.strImageSource;
                                        strEDHoverSPANID += imgInfo.strHoverSPANID;
                                        //006
                                                    if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1) {
                                            edVenueAlarmClock = 1;
                                        }
                                        break;
                                    case "INP":
                                        var imgInfo = GetImageInfo(intInpatientCircle,evntObj);
                                        //006 strInpatientAlarmClock = imgInfo.strAlarmClock;
                                        strImageSource = imgInfo.strImageSource;
                                        strInpatientHoverSPANID += imgInfo.strHoverSPANID;
                                        //006
                                                    if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1) {
                                            inpVenueAlarmClock = 1;
                                        }
                                        break;
                                    case "DISCH":
                                        var imgInfo = GetImageInfo(intDischargeCircle,evntObj);
                                        //006 strDischargeAlarmClock = imgInfo.strAlarmClock;
                                        strImageSource = imgInfo.strImageSource;
                                        strDischargeHoverSPANID += imgInfo.strHoverSPANID;
                                        //006
                                                    if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1) {
                                            dischVenueAlarmClock = 1;
                                        }
                                        break;
                                    case "PREOP":
                                        var imgInfo = GetImageInfo(intPreOpCircle,evntObj);
                                        //006 strPreOpAlarmClock = imgInfo.strAlarmClock;
                                        strImageSource = imgInfo.strImageSource;
                                        strPreOpHoverSPANID += imgInfo.strHoverSPANID;
                                        //006
                                                    if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1) {
                                            preopVenueAlarmClock = 1;
                                        }
                                        break;
                                    case "POSTOP":
                                        var imgInfo = GetImageInfo(intPostOpCircle,evntObj);
                                        //006 strPostOpAlarmClock = imgInfo.strAlarmClock;
                                        strImageSource = imgInfo.strImageSource;
                                        strPostOpHoverSPANID += imgInfo.strHoverSPANID;
                                        //006
                                                    if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1) {
                                            postopVenueAlarmClock = 1;
                                        }
                                        break;
                                    }
                                }

                                //006
                                if (edVenueAlarmClock == 1) {
                                    var imgInfo2 = GetVenueAlarmClock(); //call new function at the venue level
                                    strEDAlarmClock = imgInfo2.strAlarmClock;
                                }
                                //006
                                if (inpVenueAlarmClock == 1) {
                                    var imgInfo2 = GetVenueAlarmClock();//call new function at the venue level
                                    strInpatientAlarmClock = imgInfo2.strAlarmClock;
                                }
                                //006
                                if (dischVenueAlarmClock == 1) {
                                    var imgInfo2 = GetVenueAlarmClock();//call new function at the venue level
                                    strDischargeAlarmClock = imgInfo2.strAlarmClock;
                                }
                                //006
                                if (preopVenueAlarmClock == 1) {
                                    var imgInfo2 = GetVenueAlarmClock();//call new function at the venue level
                                    strPreOpAlarmClock = imgInfo2.strAlarmClock;
                                }
                                //006
                                if (postopVenueAlarmClock == 1) {
                                    var imgInfo2 = GetVenueAlarmClock();//call new function at the venue level
                                    strPostOpAlarmClock = imgInfo2.strAlarmClock;

                                }
                                //Build Hovers.
                                //ED
                                strEDHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strEDHoverSPANID += "<tr><td colspan='2'>";
                                strEDHoverSPANID += alink;
                                strEDHoverSPANID += patientName;
                                strEDHoverSPANID += endLinkTag;
                                strEDHoverSPANID += '</td></tr>';
                                strEDHoverSPANID += "<tr><td colspan='2'>";
                                strEDHoverSPANID += strModalOrderEntryWindowLink;
                                strEDHoverSPANID += strModalOrderEntryWindowLinkName;
                                strEDHoverSPANID += endLinkTag;
                                strEDHoverSPANID += '</td></tr></table>';
                                strEDHoverText += '<span id="'
                                strEDHoverText += strEDHoverSPANID;
                                strEDHoverText += '"';
                                strEDHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strEDHoverText += "'gentooltip',this.id,0,0);";
                                strEDHoverText += '">';
                                strEDHoverText += strEDAlarmClock;
                                strEDHoverText += strEDCircle;
                                strEDHoverText += '</span>';

                                //Inpatient
                                strInpatientHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strInpatientHoverSPANID += "<tr><td colspan='2'>"
                                strInpatientHoverSPANID += alink;
                                strInpatientHoverSPANID += patientName;
                                strInpatientHoverSPANID += endLinkTag;
                                strInpatientHoverSPANID += '</td></tr>';
                                strInpatientHoverSPANID += "<tr><td colspan='2'>";
                                strInpatientHoverSPANID += strModalOrderEntryWindowLink;
                                strInpatientHoverSPANID += strModalOrderEntryWindowLinkName;
                                strInpatientHoverSPANID += endLinkTag;
                                strInpatientHoverSPANID += '</td></tr></table>';
                                strInpatientHoverText += '<span id="'
                                strInpatientHoverText += strInpatientHoverSPANID;
                                strInpatientHoverText += '"';
                                strInpatientHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strInpatientHoverText += "'gentooltip',this.id,0,0);";
                                strInpatientHoverText += '">';
                                strInpatientHoverText += strInpatientAlarmClock;
                                strInpatientHoverText += strInpatientCircle;
                                strInpatientHoverText += '</span>';
                                //Discharge
                                strDischargeHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strDischargeHoverSPANID += "<tr><td colspan='2'>"
                                strDischargeHoverSPANID += alink;
                                strDischargeHoverSPANID += patientName;
                                strDischargeHoverSPANID += endLinkTag;
                                strDischargeHoverSPANID += '</td></tr>';
                                strDischargeHoverSPANID += "<tr><td colspan='2'>";
                                strDischargeHoverSPANID += strModalOrderEntryWindowLink;
                                strDischargeHoverSPANID += strModalOrderEntryWindowLinkName;
                                strDischargeHoverSPANID += endLinkTag;
                                strDischargeHoverSPANID += '</td></tr></table>';
                                strDischargeHoverText += '<span id="'
                                strDischargeHoverText += strDischargeHoverSPANID;
                                strDischargeHoverText += '"';
                                strDischargeHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strDischargeHoverText += "'gentooltip',this.id,0,0);";
                                strDischargeHoverText += '">';
                                strDischargeHoverText += strDischargeAlarmClock;
                                strDischargeHoverText += strDischargeCircle;
                                strDischargeHoverText += '</span>';
                                //PreOp
                                strPreOpHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strPreOpHoverSPANID += "<tr><td colspan='2'>"
                                strPreOpHoverSPANID += alink;
                                strPreOpHoverSPANID += patientName;
                                strPreOpHoverSPANID += endLinkTag;
                                strPreOpHoverSPANID += '</td></tr>';
                                strPreOpHoverSPANID += "<tr><td colspan='2'>";
                                strPreOpHoverSPANID += strModalOrderEntryWindowLink;
                                strPreOpHoverSPANID += strModalOrderEntryWindowLinkName;
                                strPreOpHoverSPANID += endLinkTag;
                                strPreOpHoverSPANID += '</td></tr></table>';
                                strPreOpHoverText += '<span id="'
                                strPreOpHoverText += strPreOpHoverSPANID;
                                strPreOpHoverText += '"';
                                strPreOpHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strPreOpHoverText += "'gentooltip',this.id,0,0);";
                                strPreOpHoverText += '">';
                                strPreOpHoverText += strPreOpAlarmClock;
                                strPreOpHoverText += strPreOpCircle;
                                strPreOpHoverText += '</span>';
                                //PostOp
                                strPostOpHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strPostOpHoverSPANID += "<tr><td colspan='2'>"
                                strPostOpHoverSPANID += alink;
                                strPostOpHoverSPANID += patientName;
                                strPostOpHoverSPANID += endLinkTag;
                                strPostOpHoverSPANID += '</td></tr>';
                                strPostOpHoverSPANID += "<tr><td colspan='2'>";
                                strPostOpHoverSPANID += strModalOrderEntryWindowLink;
                                strPostOpHoverSPANID += strModalOrderEntryWindowLinkName;
                                strPostOpHoverSPANID += endLinkTag;
                                strPostOpHoverSPANID += '</td></tr></table>';
                                strPostOpHoverText += '<span id="'
                                strPostOpHoverText += strPostOpHoverSPANID;
                                strPostOpHoverText += '"';
                                strPostOpHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strPostOpHoverText += "'gentooltip',this.id,0,0);";
                                strPostOpHoverText += '">';
                                strPostOpHoverText += strPostOpAlarmClock;
                                strPostOpHoverText += strPostOpCircle;
                                strPostOpHoverText += '</span>';

                                //Build Cells.
                                //ED
                                if (intEDColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strEDHoverText,tempString,oPatData,sbHdrDispArray[0]);
                                    if (!oPatData){return;}
                                }
                                //Inpatient
                                if (intInpatientColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strInpatientHoverText,tempString,oPatData,sbHdrDispArray[1]);
                                    if (!oPatData){return;}
                                }
                                //Discharge
                                if (inteDischargeColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strDischargeHoverText,tempString,oPatData,sbHdrDispArray[2]);
                                    if (!oPatData){return;}
                                }
                                //PreOp
                                if (intPreOpColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strPreOpHoverText,tempString,oPatData,sbHdrDispArray[3]);
                                    if (!oPatData){return;}
                                }
                                //PostOp
                                if (intePostOpColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strPostOpHoverText,tempString,oPatData,sbHdrDispArray[4]);
                                    if (!oPatData){return;}
                                }
                                //Status (Note: this column will always be displayed).
                                oPatData = PopulateSection(strSectionName,pwStatus,tempString,oPatData,sbHdrDispArray[5]);
                                if (!oPatData){return;}
                                break;

                            //3 = EXCLUDED
                            case 3:
                                //ED
                                if (intEDColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[0]);
                                    if (!oPatData){return;}
                                }
                                //Inpatient
                                if (intInpatientColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[1]);
                                    if (!oPatData){return;}
                                }
                                //Discharge
                                if (inteDischargeColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[2]);
                                    if (!oPatData){return;}
                                }
                                //PreOp
                                if (intPreOpColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[3]);
                                    if (!oPatData){return;}
                                }
                                //PostOp
                                if (intePostOpColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[4]);
                                    if (!oPatData){return;}
                                }
                                //Status (Note: this column will always be displayed).
                                oPatData = PopulateSection(strSectionName,pwStatus,tempString,oPatData,sbHdrDispArray[5]);
                                if (!oPatData){return;}
                                break;

                            //4 = NEEDS PLAN
                            case 4:
                                //Reset variable.
                                tempValue = "";
                                //Empty Circle
                                tempValue += "<img src='";
                                tempValue += imagepath;
                                tempValue += img5970_16;
                                tempValue += "' />";
                                strEDCircle = tempValue;
                                strInpatientCircle = tempValue;
                                strDischargeCircle = tempValue;
                                strPreOpCircle = tempValue;
                                strPostOpCircle = tempValue;

                                //Build Hovers.
                                //ED
                                strEDHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strEDHoverSPANID += '<tr><td><b>';
                                strEDHoverSPANID += strHoverHeadLine;
                                strEDHoverSPANID += i18n.condDisp.ED_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                strEDHoverSPANID += '<tr><td>';
                                strEDHoverSPANID += pwName;
                                strEDHoverSPANID += '</td><td>&nbsp;</td></tr>';
                                //Inpatient
                                strInpatientHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strInpatientHoverSPANID += '<tr><td><b>';
                                strInpatientHoverSPANID += strHoverHeadLine;
                                strInpatientHoverSPANID += i18n.condDisp.INPATIENT_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                strInpatientHoverSPANID += '<tr><td>';
                                strInpatientHoverSPANID += pwName;
                                strInpatientHoverSPANID += '</td><td>&nbsp;</td></tr>';
                                //Discharge
                                strDischargeHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strDischargeHoverSPANID += '<tr><td><b>';
                                strDischargeHoverSPANID += strHoverHeadLine;
                                strDischargeHoverSPANID += i18n.condDisp.DISCHARGE_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                strDischargeHoverSPANID += '<tr><td>';
                                strDischargeHoverSPANID += pwName;
                                strDischargeHoverSPANID += '</td><td>&nbsp;</td></tr>';
                                //PreOp
                                strPreOpHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strPreOpHoverSPANID += '<tr><td><b>';
                                strPreOpHoverSPANID += strHoverHeadLine;
                                strPreOpHoverSPANID += i18n.condDisp.PREOP_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                strPreOpHoverSPANID += '<tr><td>';
                                strPreOpHoverSPANID += pwName;
                                strPreOpHoverSPANID += '</td><td>&nbsp;</td></tr>';
                                //PostOp
                                strPostOpHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                strPostOpHoverSPANID += '<tr><td><b>';
                                strPostOpHoverSPANID += strHoverHeadLine;
                                strPostOpHoverSPANID += i18n.condDisp.POSTOP_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                strPostOpHoverSPANID += '<tr><td>';
                                strPostOpHoverSPANID += pwName;
                                strPostOpHoverSPANID += '</td><td>&nbsp;</td></tr>';

                                //Loop through the EVENTS.
                                for (var intCounter2 = 0; intCounter2 < objJSON.LIST[intCounter].EVENTS.length; intCounter2++) {
                                    //Reset variables.
                                    strEventType = "";
                                    strEventName = "";
                                    strImageSource = "";
                                    strTMIND = "";
                                    tempValue = "";
                                    intOutcomeFrmId = 0;
                                    strOutcomeLink = "";

                                    strEventType = objJSON.LIST[intCounter].EVENTS[intCounter2].TYPE;
                                    strEventName = objJSON.LIST[intCounter].EVENTS[intCounter2].NAME.replace(/"/g,'%22'); //004
                                    strTMIND = objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND;
                                    intOutcomeFrmId = objJSON.LIST[intCounter].EVENTS[intCounter2].OUTCOMEFRMID;
                                    var evntObj = objJSON.LIST[intCounter].EVENTS[intCounter2]
                                    strOutcomeLink = CreateOutComeLink(evntObj);

                                    //Build Hovers
                                    //ED
                                    strEDHoverSPANID += '<tr>';
                                    strEDHoverSPANID += '<td>';
                                    strEDHoverSPANID += strOutcomeLink;
                                    strEDHoverSPANID += '</td>';
                                    strEDHoverSPANID += '<td></td>';
                                    strEDHoverSPANID += '</tr>';
                                    //Inpatient
                                    strInpatientHoverSPANID += '<tr>';
                                    strInpatientHoverSPANID += '<td>';
                                    strInpatientHoverSPANID += strOutcomeLink;
                                    strInpatientHoverSPANID += '</td>';
                                    strInpatientHoverSPANID += '<td></td>';
                                    strInpatientHoverSPANID += '</tr>';
                                    //Discharge
                                    strDischargeHoverSPANID += '<tr>';
                                    strDischargeHoverSPANID += '<td>';
                                    strDischargeHoverSPANID += strOutcomeLink;
                                    strDischargeHoverSPANID += '</td>';
                                    strDischargeHoverSPANID += '<td></td>';
                                    strDischargeHoverSPANID += '</tr>';
                                    //PreOp
                                    strPreOpHoverSPANID += '<tr>';
                                    strPreOpHoverSPANID += '<td>';
                                    strPreOpHoverSPANID += strOutcomeLink;
                                    strPreOpHoverSPANID += '</td>';
                                    strPreOpHoverSPANID += '<td></td>';
                                    strPreOpHoverSPANID += '</tr>';
                                    //PostOp
                                    strPostOpHoverSPANID += '<tr>';
                                    strPostOpHoverSPANID += '<td>';
                                    strPostOpHoverSPANID += strOutcomeLink;
                                    strPostOpHoverSPANID += '</td>';
                                    strPostOpHoverSPANID += '<td></td>';
                                    strPostOpHoverSPANID += '</tr>';

                                    //Verify if the PWSTATUS contains the value Assess.
                                    if (pwStatus.toLowerCase() == "assess") {
                                        //Verify if this is the first record in the loop.
                                        if (intCounter2 == 0) {
                                            strAssessEvents += strEventName;
                                        }
                                        else {
                                            strAssessEvents += "<br><br>";
                                            strAssessEvents += strEventName;
                                        }
                                    }
                                }
                                //Build Hovers.
                                //ED
                                strEDHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strEDHoverSPANID += "<tr><td colspan='2'>"
                                strEDHoverSPANID += alink;
                                strEDHoverSPANID += patientName;
                                strEDHoverSPANID += endLinkTag;
                                strEDHoverSPANID += '</td></tr>';
                                strEDHoverSPANID += "<tr><td colspan='2'>";
                                strEDHoverSPANID += strModalOrderEntryWindowLink;
                                strEDHoverSPANID += strModalOrderEntryWindowLinkName;
                                strEDHoverSPANID += endLinkTag;
                                strEDHoverSPANID += '</td></tr></table>';
                                strEDHoverText += '<span id="'
                                strEDHoverText += strEDHoverSPANID;
                                strEDHoverText += '"';
                                strEDHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strEDHoverText += "'gentooltip',this.id,0,0);";
                                strEDHoverText += '">';
                                strEDHoverText += strEDAlarmClock;
                                strEDHoverText += strEDCircle;
                                strEDHoverText += '</span>';
                                //Inpatient
                                strInpatientHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strInpatientHoverSPANID += "<tr><td colspan='2'>"
                                strInpatientHoverSPANID += alink;
                                strInpatientHoverSPANID += patientName;
                                strInpatientHoverSPANID += endLinkTag;
                                strInpatientHoverSPANID += '</td></tr>';
                                strInpatientHoverSPANID += "<tr><td colspan='2'>";
                                strInpatientHoverSPANID += strModalOrderEntryWindowLink;
                                strInpatientHoverSPANID += strModalOrderEntryWindowLinkName;
                                strInpatientHoverSPANID += endLinkTag;
                                strInpatientHoverSPANID += '</td></tr></table>';
                                strInpatientHoverText += '<span id="'
                                strInpatientHoverText += strInpatientHoverSPANID;
                                strInpatientHoverText += '"';
                                strInpatientHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strInpatientHoverText += "'gentooltip',this.id,0,0);";
                                strInpatientHoverText += '">';
                                strInpatientHoverText += strInpatientAlarmClock;
                                strInpatientHoverText += strInpatientCircle;
                                strInpatientHoverText += '</span>';
                                //Discharge
                                strDischargeHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strDischargeHoverSPANID += "<tr><td colspan='2'>"
                                strDischargeHoverSPANID += alink;
                                strDischargeHoverSPANID += patientName;
                                strDischargeHoverSPANID += endLinkTag;
                                strDischargeHoverSPANID += '</td></tr>';
                                strDischargeHoverSPANID += "<tr><td colspan='2'>";
                                strDischargeHoverSPANID += strModalOrderEntryWindowLink;
                                strDischargeHoverSPANID += strModalOrderEntryWindowLinkName;
                                strDischargeHoverSPANID += endLinkTag;
                                strDischargeHoverSPANID += '</td></tr></table>';
                                strDischargeHoverText += '<span id="'
                                strDischargeHoverText += strDischargeHoverSPANID;
                                strDischargeHoverText += '"';
                                strDischargeHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strDischargeHoverText += "'gentooltip',this.id,0,0);";
                                strDischargeHoverText += '">';
                                strDischargeHoverText += strDischargeAlarmClock;
                                strDischargeHoverText += strDischargeCircle;
                                strDischargeHoverText += '</span>';
                                //PreOp
                                strPreOpHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strPreOpHoverSPANID += "<tr><td colspan='2'>"
                                strPreOpHoverSPANID += alink;
                                strPreOpHoverSPANID += patientName;
                                strPreOpHoverSPANID += endLinkTag;
                                strPreOpHoverSPANID += '</td></tr>';
                                strPreOpHoverSPANID += "<tr><td colspan='2'>";
                                strPreOpHoverSPANID += strModalOrderEntryWindowLink;
                                strPreOpHoverSPANID += strModalOrderEntryWindowLinkName;
                                strPreOpHoverSPANID += endLinkTag;
                                strPreOpHoverSPANID += '</td></tr></table>';
                                strPreOpHoverText += '<span id="'
                                strPreOpHoverText += strPreOpHoverSPANID;
                                strPreOpHoverText += '"';
                                strPreOpHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strPreOpHoverText += "'gentooltip',this.id,0,0);";
                                strPreOpHoverText += '">';
                                strPreOpHoverText += strPreOpAlarmClock;
                                strPreOpHoverText += strPreOpCircle;
                                strPreOpHoverText += '</span>';
                                //PostOp
                                strPostOpHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                strPostOpHoverSPANID += "<tr><td colspan='2'>"
                                strPostOpHoverSPANID += alink;
                                strPostOpHoverSPANID += patientName;
                                strPostOpHoverSPANID += endLinkTag;
                                strPostOpHoverSPANID += '</td></tr>';
                                strPostOpHoverSPANID += "<tr><td colspan='2'>";
                                strPostOpHoverSPANID += strModalOrderEntryWindowLink;
                                strPostOpHoverSPANID += strModalOrderEntryWindowLinkName;
                                strPostOpHoverSPANID += endLinkTag;
                                strPostOpHoverSPANID += '</td></tr></table>';
                                strPostOpHoverText += '<span id="'
                                strPostOpHoverText += strPostOpHoverSPANID;
                                strPostOpHoverText += '"';
                                strPostOpHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                strPostOpHoverText += "'gentooltip',this.id,0,0);";
                                strPostOpHoverText += '">';
                                strPostOpHoverText += strPostOpAlarmClock;
                                strPostOpHoverText += strPostOpCircle;
                                strPostOpHoverText += '</span>';

                                //Build Cells.
                                //ED
                                if (intEDColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strEDHoverText,tempString,oPatData,sbHdrDispArray[0]);
                                    if (!oPatData){return;}
                                }
                                //Inpatient
                                if (intInpatientColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strInpatientHoverText,tempString,oPatData,sbHdrDispArray[1]);
                                    if (!oPatData){return;}
                                }
                                //Discharge
                                if (inteDischargeColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strDischargeHoverText,tempString,oPatData,sbHdrDispArray[2]);
                                    if (!oPatData){return;}
                                }
                                //PreOp
                                if (intPreOpColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strPreOpHoverText,tempString,oPatData,sbHdrDispArray[3]);
                                    if (!oPatData){return;}
                                }
                                //PostOp
                                if (intePostOpColumn > 0) {
                                    oPatData = PopulateSection(strSectionName,strPostOpHoverText,tempString,oPatData,sbHdrDispArray[4]);
                                    if (!oPatData){return;}
                                }

                                //Status (Note: this column will always be displayed).

                                //Verify if the PWSTATUS contains the value Assess.
                                if (pwStatus.toLowerCase() == "assess") {
                                    //Verify if the ' sign exists.
                                    while (pwName.indexOf("'") > -1) {
                                        pwName = pwName.replace("'","Sverige");
                                    }
                                    while (strAssessRmvDisp.indexOf("'") > -1) {
                                        strAssessRmvDisp = strAssessRmvDisp.replace("'","Sverige");
                                    }
                                    while (strAssessEvents.indexOf("'") > -1) {
                                        strAssessEvents = strAssessEvents.replace("'","Sverige");
                                    }
                                    //Build Link
                                    strAssessLink += '<a href="';
                                    strAssessLink += "javascript:launchAssessWindow('";
                                    strAssessLink += strSectionName;
                                    strAssessLink += "','";
                                    strAssessLink += pwName;
                                    strAssessLink += "','";
                                    strAssessLink += strAssessEvents;
                                    strAssessLink += "','"
                                    strAssessLink += patientID;
                                    strAssessLink += "','";
                                    strAssessLink += patientEncounterID
                                    strAssessLink += "','";
                                    strAssessLink += strAssessRmvDisp;
                                    strAssessLink += "','";
                                    strAssessLink += strAssessNomenDisp;
                                    strAssessLink += "','";
                                    strAssessLink += intAssessNomenDispTotal;
                                    strAssessLink += "','";
                                    strAssessLink += patientNameAssess;
                                    strAssessLink += "');";
                                    strAssessLink += '" title="Open Assess Window." class="LinkText">';
                                    strAssessLink +=  pwStatus;
                                    strAssessLink += endLinkTag;
                                }
                                else {
                                    strAssessLink = pwStatus;
                                }
                                oPatData = PopulateSection(strSectionName,strAssessLink,tempString,oPatData,sbHdrDispArray[5]);
                                if (!oPatData){return;}
                                break;
                            }
                        }
                        else {
                            //ED
                            if (intEDColumn > 0) {
                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[0]);
                                if (!oPatData){return;}
                            }
                            //Inpatient
                            if (intInpatientColumn > 0) {
                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[1]);
                                if (!oPatData){return;}
                            }
                            //Discharge
                            if (inteDischargeColumn > 0) {
                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[2]);
                                if (!oPatData){return;}
                            }
                            //PreOp
                            if (intPreOpColumn > 0) {
                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[3]);
                                if (!oPatData){return;}
                            }
                            //PostOp
                            if (intePostOpColumn > 0) {
                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[4]);
                                if (!oPatData){return;}
                            }
                            //Status (Note: this column will always be displayed).
                            oPatData = PopulateSection(strSectionName,pwStatus,tempString,oPatData,sbHdrDispArray[5]);
                            if (!oPatData){return;}
                        }
                    }
                //} //person_id check
                }//oPatData check
            }
        }

        }
        catch (error)
        {
            showErrorMessage(error.message,"getNHIQMSections","","");
            blnStatus = false;
        }
        return blnStatus;
    }
    /**
    * Gets values for the NHIQM sections that contain qualifying patients. Returns True if everything went well else it returns False.
    * @param {Boolean} blnAddHiddenCells Contains True if hidden cells are going to be created else it contains False.
    * @param {String} strSectionName Section NHIQM abbreviation.
    * @param {Object} objJSON The JSON structure object.
    * @return {Boolean}
    */
    function getQualifyingNHIQMSections(blnAddHiddenCells,strSectionName,objJSON)
    {
        var blnStatus = true;
        var tempValueX = ""
        var tempValueY = ""; //002 for dynamic column
        var tempString = "";
        var tempValue = "";
        var colmnCNT = 0;
        var patientEncounterID = 0;
        var ptQual = 0;
        var intEDColumn = 0;
        var intInpatientColumn = 0;
        var inteDischargeColumn = 0;
        var intPreOpColumn = 0;
        var intePostOpColumn = 0;
        var pwStatus = "";
        var pwName = "";
        var strEventType = "";
        var strEventName = "";
        var strEDHoverText = "";
        var strEDHoverSPANID = "";
        var strInpatientHoverText = "";
        var strInpatientHoverSPANID = "";
        var strDischargeHoverText = "";
        var strDischargeHoverSPANID = "";
        var strPreOpHoverText = "";
        var strPreOpHoverSPANID = "";
        var strPostOpHoverText = "";
        var strPostOpHoverSPANID = "";
        var strImageSource = "";
        var strTMIND = "";
        var strEDAlarmClock = "";
        var strInpatientAlarmClock = "";
        var strDischargeAlarmClock = "";
        var strPreOpAlarmClock = "";
        var strPostOpAlarmClock = "";
        var strEDCircle = "";
        var strInpatientCircle = "";
        var strDischargeCircle = "";
        var strPreOpCircle = "";
        var strPostOpCircle = "";
        var intEDCircle = 0;
        var intInpatientCircle = 0;
        var intDischargeCircle = 0;
        var intPreOpCircle = 0;
        var intPostOpCircle = 0;
        var patientName = "";
        var patientNameAssess = "";
        var alink = "";
        var patientID = "";
        var endLinkTag = "</a>";
        var tempTableWidth = "";
        var blnHideAMIRows = true;
        var strSubColumn1 = "";
        var strSubColumn2 = "";
        var strSubColumn3 = "";
        var strSubColumn4 = "";
        var strSubColumn5 = "";
        var strMainColumn = "";
        var strHoverHeadLine = "";
        var rowEDName = "";
        var rowInpatientName = "";
        var rowDischargeName = "";
        var rowPreOpName = "";
        var rowPostOpName = "";
        var blnEDRowSpan = false;
        var strStatusDisp = "";
        var strAssessLink = "";
        var strAssessEvents = "";
        var strAssessRmvDisp = "";
        var strAssessNomenDisp = "";
        var intAssessNomenDispTotal = 0;
        var intOutcomeFrmId = 0;
        var strOutcomeLink = "";
        var strModalOrderEntryWindowLink = "";
        var strModalOrderEntryWindowLinkName = "Order";
        var tempPageNum = 0;
        var strPtQualEncounterID = 0;
        var strPtQualPatientID = 0;
        var intSectionIndicator = 0;
        var uniqueRowID = 0;

        //006 Varibles to check if Venue has at least one measure that is time sensitive
        var edVenueAlarmClock = 0;
        var inpVenueAlarmClock = 0;
        var postopVenueAlarmClock = 0;
        var preopVenueAlarmClock = 0;
        var dischVenueAlarmClock = 0;

        try
        {
            //Verify how many columns that are displayed and adjust the colspan for the Header Row.
            colmnCNT = objJSON.COLMNCNT;
            //Hide/Show column indicators
            intEDColumn = objJSON.EDIND;
            intInpatientColumn = objJSON.IPIND;
            inteDischargeColumn = objJSON.DISCHIND;
            intPreOpColumn = objJSON.PREOPIND;
            intePostOpColumn = objJSON.POSTOPIND;
            strAssessRmvDisp = objJSON.RMVDISP;

            if (objJSON.TABNAME > ""){
                tabName = objJSON.TABNAME;
            } else {
                tabName = "Orders";
            }

            //Loop through the JSON structure.
            for (var intCounter = 0; intCounter < objJSON.NOMENLIST.length; intCounter++)
            {
                //Verify if this is the first record in the loop.
                if (intCounter == 0)
                {
                    strAssessNomenDisp += objJSON.NOMENLIST[intCounter].NOMENDISP;
                }
                else
                {
                    strAssessNomenDisp += '|';
                    strAssessNomenDisp += objJSON.NOMENLIST[intCounter].NOMENDISP;
                }
            }

            //Get the total number of NOMENDISP.
            intAssessNomenDispTotal = objJSON.NOMENLIST.length;

            PgRecTotal = GetNumPgRecords();

            //Verify which section it is.
            switch (strSectionName.toLowerCase())
            {
            case "ami":
                strSubColumn1 = "secsubcolAMI1";
                strSubColumn2 = "secsubcolAMI2";
                strSubColumn3 = "secsubcolAMI3";
                strSubColumn4 = "secsubcolAMI4";
                strSubColumn5 = "secsubcolAMI5";
                strMainColumn = "secpatlisthdrAMI";
                strHoverHeadLine = i18n.condDisp.AMI_HVR;
                rowEDName = "patientED";
                rowInpatientName = "patientIn";
                rowDischargeName = "patientDischarge";
                rowPreOpName = "patientPreOp";
                rowPostOpName = "patientPostOp";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.AMIIND;
                sbHdrDispArray = amiSbHdrDispArray;
                break;
            case "hf":
                strSubColumn1 = "secsubcolHeartFailure1";
                strSubColumn2 = "secsubcolHeartFailure2";
                strSubColumn3 = "secsubcolHeartFailure3";
                strSubColumn4 = "secsubcolHeartFailure4";
                strSubColumn5 = "secsubcolHeartFailure5";
                strMainColumn = "secpatlisthdrHeartFailure";
                strHoverHeadLine = i18n.condDisp.HEART_FAILURE_HVR;
                rowEDName = "cellHeartFailureRowSpan";
                rowInpatientName = "patientInHeartFailure";
                rowDischargeName = "patientDischargeHeartFailure";
                rowPreOpName = "patientPreOpHeartFailure";
                rowPostOpName = "patientPostOpHeartFailure";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.HFIND;
                sbHdrDispArray = hrtFailSbHdrDispArray;
                break;
            case "pn":
                strSubColumn1 = "secsubcolPneumonia1";
                strSubColumn2 = "secsubcolPneumonia2";
                strSubColumn3 = "secsubcolPneumonia3";
                strSubColumn4 = "secsubcolPneumonia4";
                strSubColumn5 = "secsubcolPneumonia5";
                strMainColumn = "secpatlisthdrPneumonia";
                strHoverHeadLine = i18n.condDisp.PNEUMONIA_HVR;
                rowEDName = "cellPneumoniaRowSpan";
                rowInpatientName = "patientInPneumonia";
                rowDischargeName = "patientDischargePneumonia";
                rowPreOpName = "patientPreOpPneumonia";
                rowPostOpName = "patientPostOpPneumonia";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.PNIND;
                sbHdrDispArray = pneuSbHdrDispArray;
                break;
            case "cac":
                strSubColumn1 = "secsubcolChildrensAsthma1";
                strSubColumn2 = "secsubcolChildrensAsthma2";
                strSubColumn3 = "secsubcolChildrensAsthma3";
                strSubColumn4 = "secsubcolChildrensAsthma4";
                strSubColumn5 = "secsubcolChildrensAsthma5";
                strMainColumn = "secpatlisthdrChildrensAsthma";
                strHoverHeadLine = i18n.condDisp.CHILDRENS_ASTHMA_HVR;
                rowEDName = "cellChildrenAsthmaRowSpan";
                rowInpatientName = "patientInChildrensAsthma";
                rowDischargeName = "patientDischargeChildrensAsthma";
                rowPreOpName = "patientPreOpChildrensAsthma";
                rowPostOpName = "patientPostOpChildrensAsthma";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.CACIND;
                sbHdrDispArray = cacSbHdrDispArray;
                break;
            case "vte":
                strSubColumn1 = "secsubcolVTE1";
                strSubColumn2 = "secsubcolVTE2";
                strSubColumn3 = "secsubcolVTE3";
                strSubColumn4 = "secsubcolVTE4";
                strSubColumn5 = "secsubcolVTE5";
                strMainColumn = "secpatlisthdrVTE";
                strHoverHeadLine = i18n.condDisp.VTE_HVR;
                rowEDName = "cellVTERowSpan";
                rowInpatientName = "patientInVTE";
                rowDischargeName = "patientDischargeVTE";
                rowPreOpName = "patientPreOpVTE";
                rowPostOpName = "patientPostOpVTE";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.VTEIND;
                sbHdrDispArray = vteSbHdrDispArray;
                break;
            case "stk":
                strSubColumn1 = "secsubcolStroke1";
                strSubColumn2 = "secsubcolStroke2";
                strSubColumn3 = "secsubcolStroke3";
                strSubColumn4 = "secsubcolStroke4";
                strSubColumn5 = "secsubcolStroke5";
                strMainColumn = "secpatlisthdrStroke";
                strHoverHeadLine = i18n.condDisp.STROKE_HVR;
                rowEDName = "cellStrokeRowSpan";
                rowInpatientName = "patientInStroke";
                rowDischargeName = "patientDischargeStroke";
                rowPreOpName = "patientPreOpStroke";
                rowPostOpName = "patientPostOpStroke";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.STKIND;
                sbHdrDispArray = strokeSbHdrDispArray;
                break;
            case "scip":
                strSubColumn1 = "secsubcolSCIP1";
                strSubColumn2 = "secsubcolSCIP2";
                strSubColumn3 = "secsubcolSCIP3";
                strSubColumn4 = "secsubcolSCIP4";
                strSubColumn5 = "secsubcolSCIP5";
                strMainColumn = "secpatlisthdrSCIP";
                strHoverHeadLine = i18n.condDisp.SCIP_HVR;
                rowEDName = "cellSCIPRowSpan";
                rowInpatientName = "patientInSCIP";
                rowDischargeName = "patientDischargeSCIP";
                rowPreOpName = "patientPreOpSCIP";
                rowPostOpName = "patientPostOpSCIP";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.SCIPIND;
                sbHdrDispArray = scipSbHdrDispArray;
                break;

            case "imm":
                strSubColumn1 = "secsubcolImm1";
                strSubColumn2 = "secsubcolImm2";
                strSubColumn3 = "secsubcolImm3";
                strSubColumn4 = "secsubcolImm4";
                strSubColumn5 = "secsubcolImm5";
                strMainColumn = "secpatlisthdrImm";
                strHoverHeadLine = i18n.condDisp.IMM_HVR;
                rowEDName = "cellImmRowSpan";
                rowInpatientName = "patientInImm";
                rowDischargeName = "patientDischargeImm";
                rowPreOpName = "patientPreOpImm";
                rowPostOpName = "patientPostOpImm";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.IMMIND;
                sbHdrDispArray = immSbHdrDispArray;
                break;
            case "tob":
                strSubColumn1 = "secsubcolTob1";
                strSubColumn2 = "secsubcolTob2";
                strSubColumn3 = "secsubcolTob3";
                strSubColumn4 = "secsubcolTob4";
                strSubColumn5 = "secsubcolTob5";
                strMainColumn = "secpatlisthdrTob";
                strHoverHeadLine = i18n.condDisp.TOB_HVR;
                rowEDName = "cellTobRowSpan";
                rowInpatientName = "patientInTob";
                rowDischargeName = "patientDischargeTob";
                rowPreOpName = "patientPreOpTob";
                rowPostOpName = "patientPostOpTob";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.TOBIND;
                sbHdrDispArray = tobSbHdrDispArray;
                break;
            case "sub":
                strSubColumn1 = "secsubcolSub1";
                strSubColumn2 = "secsubcolSub2";
                strSubColumn3 = "secsubcolSub3";
                strSubColumn4 = "secsubcolSub4";
                strSubColumn5 = "secsubcolSub5";
                strMainColumn = "secpatlisthdrSub";
                strHoverHeadLine = i18n.condDisp.SUB_HVR;
                rowEDName = "cellSubRowSpan";
                rowInpatientName = "patientInSub";
                rowDischargeName = "patientDischargeSub";
                rowPreOpName = "patientPreOpSub";
                rowPostOpName = "patientPostOpSub";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.SUBIND;
                sbHdrDispArray = subSbHdrDispArray;
                break;
            case "pc":
                strSubColumn1 = "secsubcolPC1";
                strSubColumn2 = "secsubcolPC2";
                strSubColumn3 = "secsubcolPC3";
                strSubColumn4 = "secsubcolPC4";
                strSubColumn5 = "secsubcolPC5";
                strMainColumn = "secpatlisthdrPC";
                strHoverHeadLine = i18n.condDisp.PC_HVR;
                rowEDName = "cellPCRowSpan";
                rowInpatientName = "patientInPC";
                rowDischargeName = "patientDischargePC";
                rowPreOpName = "patientPreOpPC";
                rowPostOpName = "patientPostOpPC";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.PCIND;
                sbHdrDispArray = pcSbHdrDispArray;
                break;
            case "hbips":
                strSubColumn1 = "secsubcolHBIPS1";
                strSubColumn2 = "secsubcolHBIPS2";
                strSubColumn3 = "secsubcolHBIPS3";
                strSubColumn4 = "secsubcolHBIPS4";
                strSubColumn5 = "secsubcolHBIPS5";
                strMainColumn = "secpatlisthdrHBIPS";
                strHoverHeadLine = i18n.condDisp.HBIPS_HVR;
                rowEDName = "cellHBIPSRowSpan";
                rowInpatientName = "patientInHBIPS";
                rowDischargeName = "patientDischargeHBIPS";
                rowPreOpName = "patientPreOpHBIPS";
                rowPostOpName = "patientPostOpHBIPS";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.HBIPSIND;
                sbHdrDispArray = hbipsSbHdrDispArray;
                break;
            case "sepsis":
                strSubColumn1 = "secsubcolSEPSIS1";
                strSubColumn2 = "secsubcolSEPSIS2";
                strSubColumn3 = "secsubcolSEPSIS3";
                strSubColumn4 = "secsubcolSEPSIS4";
                strSubColumn5 = "secsubcolSEPSIS5";
                strMainColumn = "secpatlisthdrSEPSIS";
                strHoverHeadLine = i18n.condDisp.SEPSIS_HVR;
                rowEDName = "cellSEPSISRowSpan";
                rowInpatientName = "patientInSEPSIS";
                rowDischargeName = "patientDischargeSEPSIS";
                rowPreOpName = "patientPreOpSEPSIS";
                rowPostOpName = "patientPostOpSEPSIS";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.SEPSISIND;
                sbHdrDispArray = sepsisSbHdrDispArray;
                break;
            case "hs":
                strSubColumn1 = "secsubcolHS1";
                strSubColumn2 = "secsubcolHS2";
                strSubColumn3 = "secsubcolHS3";
                strSubColumn4 = "secsubcolHS4";
                strSubColumn5 = "secsubcolHS5";
                strMainColumn = "secpatlisthdrHS";
                strHoverHeadLine = i18n.condDisp.HS_HVR;
                rowEDName = "cellHSRowSpan";
                rowInpatientName = "patientInHS";
                rowDischargeName = "patientDischargeHS";
                rowPreOpName = "patientPreOpHS";
                rowPostOpName = "patientPostOpHS";
                blnEDRowSpan = true;
                intSectionIndicator = json_data2.PTREPLY.HSIND;
                sbHdrDispArray = hsSbHdrDispArray;
                break;
            }

            var secColumns = 6;
            //ED
            if (intEDColumn == 0)
            {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn1,rowEDName,strSectionName,strMainColumn);
            }
            //Inpatient
            if (intInpatientColumn == 0)
            {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn2,rowInpatientName,strSectionName,strMainColumn);
            }
            //Discharge
            if (inteDischargeColumn == 0)
            {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn3,rowDischargeName,strSectionName,strMainColumn);
            }
            //PreOp
            if (intPreOpColumn == 0)
            {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn4,rowPreOpName,strSectionName,strMainColumn);
            }
            //PostOp
            if (intePostOpColumn == 0)
            {
                secColumns--;
                HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn5,rowPostOpName,strSectionName,strMainColumn);
            }

            var oSecObj = new Object();
            oSecObj.intEDColumn = intEDColumn;
            oSecObj.strSectionName = strSectionName;
            oSecObj.secColumns = secColumns;
            secObjAr.push(oSecObj);

            for (var i = 0; i < json_data2.PTREPLY.PATIENTS.length; i++)
            {
                //Verify if this is the first page.
                tempPageNum = json_data2.PTREPLY.PATIENTS[i].PAGENUM;

                    patientID = json_data2.PTREPLY.PATIENTS[i].PT_ID;
                    patientEncounterID = json_data2.PTREPLY.PATIENTS[i].ENCNTR_ID;

                    var oPatData = null;
                    var objIdx = getPatObjIdxByEnctr(patientEncounterID);

                    if (objIdx != null)
                    {
                        oPatData = patData[objIdx];
                    }

                    if (parseInt(oPatData.pageNum) == parseInt(currentPage))
                        {uniqueRowID++;}

                    //Verify the Indicator.
                    //0 = The JSON structure is not Complete.
                    //1 = The JSON structure is Complete.
                    if (intSectionIndicator == 0)
                    {
                        tempString = 'patEncounter' + uniqueRowID;

                        //ED
                        if (intEDColumn > 0)
                        {
                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[0]);
                            if (!oPatData){return;}
                        }
                        //Inpatient
                        if (intInpatientColumn > 0)
                        {
                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[1]);
                            if (!oPatData){return;}
                        }
                        //Discharge
                        if (inteDischargeColumn > 0)
                        {
                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[2]);
                            if (!oPatData){return;}
                        }
                        //PreOp
                        if (intPreOpColumn > 0)
                        {
                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[3]);
                            if (!oPatData){return;}
                        }
                        //PostOp
                        if (intePostOpColumn > 0)
                        {
                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[4]);
                            if (!oPatData){return;}
                        }
                        //Status (Note: this column will always be displayed).
                        oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[5]);
                        if (!oPatData){return;}
                    }
                    else
                    {
                        strPtQualEncounterID = json_data2.PTREPLY.PATIENTS[i].ENCNTR_ID;
                        strPtQualPatientID = json_data2.PTREPLY.PATIENTS[i].PT_ID;

                        //Loop through the JSON structure.
                        for (var intCounter = 0; intCounter < objJSON.LIST.length; intCounter++)
                        //for (var i = 0; i < json_data2.PTREPLY.PATIENTS.length; i++)
                        {
                            //Reset variables.
                            patientEncounterID = 0;
                            ptQual = 0;
                            tempValueX = "";
                            tempValueY = "";
                            tempString = "";
                            pwStatus = "";
                            pwName = "";
                            strEDHoverText = "";
                            strEDHoverSPANID = "";
                            strInpatientHoverText = "";
                            strInpatientHoverSPANID = "";
                            strDischargeHoverText = "";
                            strDischargeHoverSPANID = "";
                            strPreOpHoverText = "";
                            strPreOpHoverSPANID = "";
                            strPostOpHoverText = "";
                            strPostOpHoverSPANID = "";
                            strEDAlarmClock = "";
                            strInpatientAlarmClock = "";
                            strDischargeAlarmClock = "";
                            strPreOpAlarmClock = "";
                            strPostOpAlarmClock = "";
                            patientName = "";
                            patientNameAssess = "";
                            patientID = "";
                            strEDCircle = "";
                            strInpatientCircle = "";
                            strDischargeCircle = "";
                            strPreOpCircle = "";
                            strPostOpCircle = "";
                            intEDCircle = 0;
                            intInpatientCircle = 0;
                            intDischargeCircle = 0;
                            intPreOpCircle = 0;
                            intPostOpCircle = 0;
                            strAssessLink = "";
                            strAssessEvents = "";
                            strModalOrderEntryWindowLink = "";

                            //006
                            edVenueAlarmClock = 0; //reset per patient
                            inpVenueAlarmClock = 0; //reset per patient
                            postopVenueAlarmClock = 0; //reset per patient
                            preopVenueAlarmClock = 0; //reset per patient
                            dischVenueAlarmClock = 0; //reset per patient


                            patientEncounterID = objJSON.LIST[intCounter].EID;
                            patientID = objJSON.LIST[intCounter].PID;

                            var oPatData = null;
                            var objIdx = getPatObjIdxByEnctr(patientEncounterID);
                            if (objIdx != null)
                            {
                                oPatData = patData[objIdx];

                            if (oPatData)
                            {
                                //Verify if the Encounter ID is correct.
                                if (strPtQualEncounterID == patientEncounterID)
                                {
                                    ptQual = objJSON.LIST[intCounter].PTQUAL;
                                        patientName = objJSON.LIST[intCounter].NAME;
                                    patientNameAssess = patientName;
                                    pwStatus = objJSON.LIST[intCounter].PWSTATUS;
                                    pwName = objJSON.LIST[intCounter].PWNAME;
                                    intEDCircle = objJSON.LIST[intCounter].EDSTAT;
                                    intInpatientCircle = objJSON.LIST[intCounter].IPSTAT;
                                    intDischargeCircle = objJSON.LIST[intCounter].DISCHSTAT;
                                    intPreOpCircle = objJSON.LIST[intCounter].PREOPSTAT;
                                    intPostOpCircle = objJSON.LIST[intCounter].POSTOPSTAT;

                                    if (oPatData){
                                        switch (strSectionName.toLowerCase())
                                        {
                                            case 'ami':
                                                oPatData.amiStatus = pwStatus;
                                                break;
                                            case 'hf':
                                                oPatData.hrtFailStatus = pwStatus;
                                                break;
                                            case 'pn':
                                                oPatData.pneumoniaStatus = pwStatus;
                                                break;
                                            case 'cac':
                                                oPatData.chldAsthmaStatus = pwStatus;
                                                break;
                                            case 'vte':
                                                oPatData.vteStatus = pwStatus;
                                                break;
                                            case 'stk':
                                                oPatData.strokeStatus = pwStatus;
                                                break;
                                            case 'scip':
                                                oPatData.scipStatus = pwStatus;
                                                break;
                                        }
                                        var alrtStr = "";

                                        alrtStr += "\n name = " + oPatData.name;
                                        alrtStr += "\n patId = " + oPatData.patId;
                                        alrtStr += "\n enctr_id = " + oPatData.enctr_id;
                                        alrtStr += "\n dob = " + oPatData.dob;
                                        alrtStr += "\n enctrTypeCd = " + oPatData.enctrTypeCd;
                                        alrtStr += "\n admitDt = " + oPatData.admitDt;
                                        alrtStr += "\n facCd = " + oPatData.facCd;
                                        alrtStr += "\n orgId = " + oPatData.orgId;
                                        alrtStr += "\n pageNum = " + oPatData.pageNum;
                                        alrtStr += "\n dobJs = " + oPatData.dobJs;
                                        alrtStr += "\n mrn = " + oPatData.mrn;
                                        alrtStr += "\n fin = " + oPatData.fin;
                                        alrtStr += "\n room = " + oPatData.room;
                                        alrtStr += "\n bed = " + oPatData.bed;
                                        alrtStr += "\n room/bed = " + oPatData.roomBed;

                                        alrtStr += "\n amiStatus = " + oPatData.amiStatus;
                                        alrtStr += "\n hrtFailStatus = " + oPatData.hrtFailStatus;
                                        alrtStr += "\n pneumoniaStatus = " + oPatData.pneumoniaStatus;
                                        alrtStr += "\n chldAsthmaStatus = " + oPatData.chldAsthmaStatus;
                                        alrtStr += "\n vteStatus = " + oPatData.vteStatus;
                                        alrtStr += "\n strokeStatus = " + oPatData.strokeStatus;
                                        alrtStr += "\n scipStatus = " + oPatData.scipStatus;
                                    }


                                    //Verify if the patient name consist of " or ' characters.
                                    //^^ = "
                                    //^ = '
                                    if (patientName.indexOf("^^") > -1)
                                    {
                                        patientName = patientName.replace("^^","&#34;");
                                    }
                                    if (patientName.indexOf("^") > -1)
                                    {
                                        patientName = patientName.replace("^","&#39;");
                                    }

                                    //Set links
                                    alink = "<a href=`" + 'javascript:launchTab(/' + tabName + '/,' + patientID + ',' + patientEncounterID + ");`" //006
                                    + " title='" + i18n.OPEN_CHART + patientName + i18n.TO_DOCUMENT_INFO + "' class='LinkText'>"; //006

                                    strModalOrderEntryWindowLink = "<a href='javascript:launchModalOrderEntryWindow(" + patientID + ',' + patientEncounterID + ");'"
                                        + "title='Open Modal Order Entry Window.' class='LinkText'>";

                                    tempString = 'patEncounter' + uniqueRowID;

                                    //Verify if PTQUAL is greater than 0.
                                    if (ptQual > 0)
                                    {
                                        //1 = BASIC REQ
                                        //2 = HAS PLAN
                                        //3 = EXCLUDED
                                        //4 = NEEDS PLAN
                                        switch(ptQual)
                                        {
                                        //1 = BASIC REQ
                                        case 1:
                                            //ED
                                            if (intEDColumn > 0)
                                            {
                                                //Reset variables.
                                                tempString = "";
                                                tempString += 'patEncounter';
                                                tempString += uniqueRowID;

                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[0]);
                                                if (!oPatData){return;}
                                            }
                                            //Inpatient
                                            if (intInpatientColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[1]);
                                                if (!oPatData){return;}
                                            }
                                            //Discharge
                                            if (inteDischargeColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[2]);
                                                if (!oPatData){return;}
                                            }
                                            //PreOp
                                            if (intPreOpColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[3]);
                                                if (!oPatData){return;}
                                            }
                                            //PostOp
                                            if (intePostOpColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[4]);
                                                if (!oPatData){return;}
                                            }
                                            //Status (Note: this column will always be displayed).
                                            oPatData = PopulateSection(strSectionName,pwStatus,tempString,oPatData,sbHdrDispArray[5]);
                                            if (!oPatData){return;}
                                            break;
                                        //2 = HAS PLAN
                                        case 2:
                                            //Verify which icon that is going to be displayed in the column.
                                            //0 = Not Done
                                            //1 = Not Met
                                            //2 = Met


                                            //Get appropriate circle images
                                            strEDCircle = GetCircle(intEDCircle);
                                            strInpatientCircle = GetCircle(intInpatientCircle);
                                            strDischargeCircle = GetCircle(intDischargeCircle);
                                            strPreOpCircle = GetCircle(intPreOpCircle);
                                            strPostOpCircle = GetCircle(intPostOpCircle);

                                            //Build Hovers.
                                            //ED
                                            strEDHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strEDHoverSPANID += '<tr><td><b>';
                                            strEDHoverSPANID += strHoverHeadLine;
                                            strEDHoverSPANID += i18n.condDisp.ED_MEASURES + '</b></td><td><b>'+i18n.STATUS+'</b></td></tr>';
                                            //Inpatient
                                            strInpatientHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strInpatientHoverSPANID += '<tr><td><b>';
                                            strInpatientHoverSPANID += strHoverHeadLine;
                                            strInpatientHoverSPANID += i18n.condDisp.INPATIENT_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                            //Discharge
                                            strDischargeHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strDischargeHoverSPANID += '<tr><td><b>';
                                            strDischargeHoverSPANID += strHoverHeadLine;
                                            strDischargeHoverSPANID += i18n.condDisp.DISCHARGE_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                            //PreOp
                                            strPreOpHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strPreOpHoverSPANID += '<tr><td><b>';
                                            strPreOpHoverSPANID += strHoverHeadLine;
                                            strPreOpHoverSPANID += i18n.condDisp.PREOP_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                            //PostOp
                                            strPostOpHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strPostOpHoverSPANID += '<tr><td><b>';
                                            strPostOpHoverSPANID += strHoverHeadLine;
                                            strPostOpHoverSPANID += i18n.condDisp.POSTOP_MEASURES + '</b></td><td><b>Status</b></td></tr>';

                                            //Loop through the EVENTS.
                                            for (var intCounter2 = 0; intCounter2 < objJSON.LIST[intCounter].EVENTS.length; intCounter2++)
                                            {
                                                //Reset variables.
                                                strEventType = "";
                                                strEventName = "";
                                                strImageSource = "";
                                                strTMIND = "";
                                                tempValue = "";
                                                intOutcomeFrmId = 0;
                                                strOutcomeLink = "";

                                                strEventType = objJSON.LIST[intCounter].EVENTS[intCounter2].TYPE;

                                                strEventName = objJSON.LIST[intCounter].EVENTS[intCounter2].NAME.replace(/"/g,'%22'); //004
                                                strTMIND = objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND;
                                                strStatusDisp = objJSON.LIST[intCounter].EVENTS[intCounter2].STATUSDISP;

                                                intOutcomeFrmId = objJSON.LIST[intCounter].EVENTS[intCounter2].OUTCOMEFRMID;


                                                var evntObj = objJSON.LIST[intCounter].EVENTS[intCounter2]
                                                evntObj.patientID = patientID;
                                                evntObj.patientEncounterID = patientEncounterID;
                                                strOutcomeLink = CreateOutComeLink(evntObj);

                                                //Verify TYPE.
                                                switch (strEventType.toUpperCase())
                                                {
                                                case "ED":
                                                    var imgInfo = GetImageInfo(intEDCircle,evntObj);
                                                    //006 strEDAlarmClock = imgInfo.strAlarmClock;
                                                    strImageSource = imgInfo.strImageSource;
                                                    strEDHoverSPANID += imgInfo.strHoverSPANID;
                                                    //006
                                                        if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1) {
                                                        edVenueAlarmClock = 1;
                                                    }
                                                        break;
                                                case "INP":
                                                    var imgInfo = GetImageInfo(intInpatientCircle,evntObj);
                                                    //006 strInpatientAlarmClock = imgInfo.strAlarmClock;
                                                    strImageSource = imgInfo.strImageSource;
                                                    strInpatientHoverSPANID += imgInfo.strHoverSPANID;
                                                    //006
                                                        if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1) {
                                                        inpVenueAlarmClock = 1;
                                                    }
                                                        break;
                                                case "DISCH":
                                                    var imgInfo = GetImageInfo(intDischargeCircle,evntObj);
                                                    //006 strDischargeAlarmClock = imgInfo.strAlarmClock;
                                                    strImageSource = imgInfo.strImageSource;
                                                    strDischargeHoverSPANID += imgInfo.strHoverSPANID;
                                                    //006
                                                        if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1) {
                                                        dischVenueAlarmClock = 1;
                                                    }
                                                        break;
                                                case "PREOP":
                                                    var imgInfo = GetImageInfo(intPreOpCircle,evntObj);
                                                    //006 strPreOpAlarmClock = imgInfo.strAlarmClock;
                                                    strImageSource = imgInfo.strImageSource;
                                                    strPreOpHoverSPANID += imgInfo.strHoverSPANID;
                                                    //006
                                                        if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1) {
                                                        preopVenueAlarmClock = 1;
                                                    }
                                                        break;
                                                case "POSTOP":
                                                    var imgInfo = GetImageInfo(intPostOpCircle,evntObj);
                                                    //006 strPostOpAlarmClock = imgInfo.strAlarmClock;
                                                    strImageSource = imgInfo.strImageSource;
                                                    strPostOpHoverSPANID += imgInfo.strHoverSPANID;
                                                    //006
                                                    if (objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND == 1)
                                                    {
                                                        postopVenueAlarmClock = 1;
                                                    }
                                                    break;
                                                }

                                            }


                                            //006
                                            if (edVenueAlarmClock == 1)
                                            {
                                                var imgInfo2 = GetVenueAlarmClock(); //call new function at the venue level
                                                strEDAlarmClock = imgInfo2.strAlarmClock;

                                            }
                                            //006
                                            if (inpVenueAlarmClock == 1)
                                            {
                                                var imgInfo2 = GetVenueAlarmClock(); //call new function at the venue level
                                                strInpatientAlarmClock = imgInfo2.strAlarmClock;

                                            }
                                            //006
                                            if (dischVenueAlarmClock == 1)
                                            {
                                                var imgInfo2 = GetVenueAlarmClock(); //call new function at the venue level
                                                strDischargeAlarmClock = imgInfo2.strAlarmClock;

                                            }
                                            //006
                                            if (preopVenueAlarmClock == 1)
                                            {
                                                var imgInfo2 = GetVenueAlarmClock(); //call new function at the venue level
                                                strPreOpAlarmClock = imgInfo2.strAlarmClock;

                                            }
                                            //006
                                            if (postopVenueAlarmClock == 1)
                                            {
                                                var imgInfo2 = GetVenueAlarmClock(); //call new function at the venue level
                                                strPostOpAlarmClock = imgInfo2.strAlarmClock;

                                            }


                                            //Build Hovers.
                                            //ED
                                            strEDHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strEDHoverSPANID += "<tr><td colspan='2'>";
                                            strEDHoverSPANID += alink;
                                            strEDHoverSPANID += patientName;
                                            strEDHoverSPANID += endLinkTag;
                                            strEDHoverSPANID += '</td></tr>';
                                            strEDHoverSPANID += "<tr><td colspan='2'>";
                                            strEDHoverSPANID += strModalOrderEntryWindowLink;
                                            strEDHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strEDHoverSPANID += endLinkTag;
                                            strEDHoverSPANID += '</td></tr></table>';
                                            strEDHoverText += '<span id="'
                                            strEDHoverText += strEDHoverSPANID;
                                            strEDHoverText += '"';
                                            strEDHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strEDHoverText += "'gentooltip',this.id,0,0);";
                                            strEDHoverText += '">';
                                            strEDHoverText += strEDAlarmClock;
                                            strEDHoverText += strEDCircle;
                                            strEDHoverText += '</span>';
                                            //Inpatient
                                            strInpatientHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strInpatientHoverSPANID += "<tr><td colspan='2'>"
                                            strInpatientHoverSPANID += alink;
                                            strInpatientHoverSPANID += patientName;
                                            strInpatientHoverSPANID += endLinkTag;
                                            strInpatientHoverSPANID += '</td></tr>';
                                            strInpatientHoverSPANID += "<tr><td colspan='2'>";
                                            strInpatientHoverSPANID += strModalOrderEntryWindowLink;
                                            strInpatientHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strInpatientHoverSPANID += endLinkTag;
                                            strInpatientHoverSPANID += '</td></tr></table>';
                                            strInpatientHoverText += '<span id="'
                                            strInpatientHoverText += strInpatientHoverSPANID;
                                            strInpatientHoverText += '"';
                                            strInpatientHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strInpatientHoverText += "'gentooltip',this.id,0,0);";
                                            strInpatientHoverText += '">';
                                            strInpatientHoverText += strInpatientAlarmClock;
                                            strInpatientHoverText += strInpatientCircle;
                                            strInpatientHoverText += '</span>';
                                            //Discharge
                                            strDischargeHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strDischargeHoverSPANID += "<tr><td colspan='2'>"
                                            strDischargeHoverSPANID += alink;
                                            strDischargeHoverSPANID += patientName;
                                            strDischargeHoverSPANID += endLinkTag;
                                            strDischargeHoverSPANID += '</td></tr>';
                                            strDischargeHoverSPANID += "<tr><td colspan='2'>";
                                            strDischargeHoverSPANID += strModalOrderEntryWindowLink;
                                            strDischargeHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strDischargeHoverSPANID += endLinkTag;
                                            strDischargeHoverSPANID += '</td></tr></table>';
                                            strDischargeHoverText += '<span id="'
                                            strDischargeHoverText += strDischargeHoverSPANID;
                                            strDischargeHoverText += '"';
                                            strDischargeHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strDischargeHoverText += "'gentooltip',this.id,0,0);";
                                            strDischargeHoverText += '">';
                                            strDischargeHoverText += strDischargeAlarmClock;
                                            strDischargeHoverText += strDischargeCircle;
                                            strDischargeHoverText += '</span>';
                                            //PreOp
                                            strPreOpHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strPreOpHoverSPANID += "<tr><td colspan='2'>"
                                            strPreOpHoverSPANID += alink;
                                            strPreOpHoverSPANID += patientName;
                                            strPreOpHoverSPANID += endLinkTag;
                                            strPreOpHoverSPANID += '</td></tr>';
                                            strPreOpHoverSPANID += "<tr><td colspan='2'>";
                                            strPreOpHoverSPANID += strModalOrderEntryWindowLink;
                                            strPreOpHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strPreOpHoverSPANID += endLinkTag;
                                            strPreOpHoverSPANID += '</td></tr></table>';
                                            strPreOpHoverText += '<span id="'
                                            strPreOpHoverText += strPreOpHoverSPANID;
                                            strPreOpHoverText += '"';
                                            strPreOpHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strPreOpHoverText += "'gentooltip',this.id,0,0);";
                                            strPreOpHoverText += '">';
                                            strPreOpHoverText += strPreOpAlarmClock;
                                            strPreOpHoverText += strPreOpCircle;
                                            strPreOpHoverText += '</span>';
                                            //PostOp
                                            strPostOpHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strPostOpHoverSPANID += "<tr><td colspan='2'>"
                                            strPostOpHoverSPANID += alink;
                                            strPostOpHoverSPANID += patientName;
                                            strPostOpHoverSPANID += endLinkTag;
                                            strPostOpHoverSPANID += '</td></tr>';
                                            strPostOpHoverSPANID += "<tr><td colspan='2'>";
                                            strPostOpHoverSPANID += strModalOrderEntryWindowLink;
                                            strPostOpHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strPostOpHoverSPANID += endLinkTag;
                                            strPostOpHoverSPANID += '</td></tr></table>';
                                            strPostOpHoverText += '<span id="'
                                            strPostOpHoverText += strPostOpHoverSPANID;
                                            strPostOpHoverText += '"';
                                            strPostOpHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strPostOpHoverText += "'gentooltip',this.id,0,0);";
                                            strPostOpHoverText += '">';
                                            strPostOpHoverText += strPostOpAlarmClock;
                                            strPostOpHoverText += strPostOpCircle;
                                            strPostOpHoverText += '</span>';

                                            //Build Cells.
                                            //ED
                                            if (intEDColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strEDHoverText,tempString,oPatData,sbHdrDispArray[0]);
                                                if (!oPatData){return;}
                                            }
                                            //Inpatient
                                            if (intInpatientColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strInpatientHoverText,tempString,oPatData,sbHdrDispArray[1]);
                                                if (!oPatData){return;}
                                            }
                                            //Discharge
                                            if (inteDischargeColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strDischargeHoverText,tempString,oPatData,sbHdrDispArray[2]);
                                                if (!oPatData){return;}
                                            }
                                            //PreOp
                                            if (intPreOpColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strPreOpHoverText,tempString,oPatData,sbHdrDispArray[3]);
                                                if (!oPatData){return;}
                                            }
                                            //PostOp
                                            if (intePostOpColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strPostOpHoverText,tempString,oPatData,sbHdrDispArray[4]);
                                                if (!oPatData){return;}
                                            }
                                            //Status (Note: this column will always be displayed).
                                            oPatData = PopulateSection(strSectionName,pwStatus,tempString,oPatData,sbHdrDispArray[5]);
                                            if (!oPatData){return;}
                                            break;
                                        //3 = EXCLUDED
                                        case 3:

                                            //ED
                                            if (intEDColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[0]);
                                                if (!oPatData){return;}
                                            }
                                            //Inpatient
                                            if (intInpatientColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[1]);
                                                if (!oPatData){return;}
                                            }
                                            //Discharge
                                            if (inteDischargeColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[2]);
                                                if (!oPatData){return;}
                                            }
                                            //PreOp
                                            if (intPreOpColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[3]);
                                                if (!oPatData){return;}
                                            }
                                            //PostOp
                                            if (intePostOpColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[4]);
                                                if (!oPatData){return;}
                                            }
                                            //Status (Note: this column will always be displayed).
                                            //Reset variables.
                                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[5]);
                                            if (!oPatData){return;}

                                            break;
                                        //4 = NEEDS PLAN
                                        case 4:
                                            //Reset variable.
                                            tempValue = "";
                                            //Empty Circle
                                            tempValue += "<img src='";
                                            tempValue += imagepath;
                                            tempValue += img5970_16;
                                            tempValue += "' />";
                                            strEDCircle = tempValue;
                                            strInpatientCircle = tempValue;
                                            strDischargeCircle = tempValue;
                                            strPreOpCircle = tempValue;
                                            strPostOpCircle = tempValue;

                                            //Build Hovers.
                                            //ED
                                            strEDHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strEDHoverSPANID += '<tr><td><b>';
                                            strEDHoverSPANID += strHoverHeadLine;
                                            strEDHoverSPANID += i18n.condDisp.ED_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                            strEDHoverSPANID += '<tr><td>';
                                            strEDHoverSPANID += pwName;
                                            strEDHoverSPANID += '</td><td>&nbsp;</td></tr>';
                                            //Inpatient
                                            strInpatientHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strInpatientHoverSPANID += '<tr><td><b>';
                                            strInpatientHoverSPANID += strHoverHeadLine;
                                            strInpatientHoverSPANID += i18n.condDisp.INPATIENT_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                            strInpatientHoverSPANID += '<tr><td>';
                                            strInpatientHoverSPANID += pwName;
                                            strInpatientHoverSPANID += '</td><td>&nbsp;</td></tr>';
                                            //Discharge
                                            strDischargeHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strDischargeHoverSPANID += '<tr><td><b>';
                                            strDischargeHoverSPANID += strHoverHeadLine;
                                            strDischargeHoverSPANID += i18n.condDisp.DISCHARGE_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                            strDischargeHoverSPANID += '<tr><td>';
                                            strDischargeHoverSPANID += pwName;
                                            strDischargeHoverSPANID += '</td><td>&nbsp;</td></tr>';
                                            //PreOp
                                            strPreOpHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strPreOpHoverSPANID += '<tr><td><b>';
                                            strPreOpHoverSPANID += strHoverHeadLine;
                                            strPreOpHoverSPANID += i18n.condDisp.PREOP_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                            strPreOpHoverSPANID += '<tr><td>';
                                            strPreOpHoverSPANID += pwName;
                                            strPreOpHoverSPANID += '</td><td>&nbsp;</td></tr>';
                                            //PostOp
                                            strPostOpHoverSPANID += '<table style='+ "'" + 'width=' + hdrTblWidth + 'px' + "'" + '>';
                                            strPostOpHoverSPANID += '<tr><td><b>';
                                            strPostOpHoverSPANID += strHoverHeadLine;
                                            strPostOpHoverSPANID += i18n.condDisp.POSTOP_MEASURES + '</b></td><td><b>Status</b></td></tr>';
                                            strPostOpHoverSPANID += '<tr><td>';
                                            strPostOpHoverSPANID += pwName;
                                            strPostOpHoverSPANID += '</td><td>&nbsp;</td></tr>';

                                            //Loop through the EVENTS.
                                            for (var intCounter2 = 0; intCounter2 < objJSON.LIST[intCounter].EVENTS.length; intCounter2++)
                                            {
                                                //Reset variables.
                                                strEventType = "";
                                                strEventName = "";
                                                strImageSource = "";
                                                strTMIND = "";
                                                tempValue = "";
                                                intOutcomeFrmId = 0;
                                                strOutcomeLink = "";

                                                strEventType = objJSON.LIST[intCounter].EVENTS[intCounter2].TYPE;

                                                strEventName = objJSON.LIST[intCounter].EVENTS[intCounter2].NAME.replace(/"/g,"&quot;");
                                                strTMIND = objJSON.LIST[intCounter].EVENTS[intCounter2].TMIND;
                                                intOutcomeFrmId = objJSON.LIST[intCounter].EVENTS[intCounter2].OUTCOMEFRMID;


                                                var evntObj = objJSON.LIST[intCounter].EVENTS[intCounter2]

                                                strOutcomeLink = CreateOutComeLink(evntObj);

                                                //Build Hovers
                                                //ED
                                                strEDHoverSPANID += '<tr>';
                                                strEDHoverSPANID += '<td>';
                                                strEDHoverSPANID += strOutcomeLink;
                                                strEDHoverSPANID += '</td>';
                                                strEDHoverSPANID += '<td></td>';
                                                strEDHoverSPANID += '</tr>';
                                                //Inpatient
                                                strInpatientHoverSPANID += '<tr>';
                                                strInpatientHoverSPANID += '<td>';
                                                strInpatientHoverSPANID += strOutcomeLink;
                                                strInpatientHoverSPANID += '</td>';
                                                strInpatientHoverSPANID += '<td></td>';
                                                strInpatientHoverSPANID += '</tr>';
                                                //Discharge
                                                strDischargeHoverSPANID += '<tr>';
                                                strDischargeHoverSPANID += '<td>';
                                                strDischargeHoverSPANID += strOutcomeLink;
                                                strDischargeHoverSPANID += '</td>';
                                                strDischargeHoverSPANID += '<td></td>';
                                                strDischargeHoverSPANID += '</tr>';
                                                //PreOp
                                                strPreOpHoverSPANID += '<tr>';
                                                strPreOpHoverSPANID += '<td>';
                                                strPreOpHoverSPANID += strOutcomeLink;
                                                strPreOpHoverSPANID += '</td>';
                                                strPreOpHoverSPANID += '<td></td>';
                                                strPreOpHoverSPANID += '</tr>';
                                                //PostOp
                                                strPostOpHoverSPANID += '<tr>';
                                                strPostOpHoverSPANID += '<td>';
                                                strPostOpHoverSPANID += strOutcomeLink;
                                                strPostOpHoverSPANID += '</td>';
                                                strPostOpHoverSPANID += '<td></td>';
                                                strPostOpHoverSPANID += '</tr>';

                                                //Verify if the PWSTATUS contains the value Assess.
                                                if (pwStatus.toLowerCase() == "assess")
                                                {
                                                    //Verify if this is the first record in the loop.
                                                    if (intCounter2 == 0)
                                                    {
                                                        strAssessEvents += strEventName;
                                                    }
                                                    else
                                                    {
                                                        strAssessEvents += "<br><br>";
                                                        strAssessEvents += strEventName;
                                                    }
                                                }
                                            }
                                            //Build Hovers.
                                            //ED
                                            strEDHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strEDHoverSPANID += "<tr><td colspan='2'>"
                                            strEDHoverSPANID += alink;
                                            strEDHoverSPANID += patientName;
                                            strEDHoverSPANID += endLinkTag;
                                            strEDHoverSPANID += '</td></tr>';
                                            strEDHoverSPANID += "<tr><td colspan='2'>";
                                            strEDHoverSPANID += strModalOrderEntryWindowLink;
                                            strEDHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strEDHoverSPANID += endLinkTag;
                                            strEDHoverSPANID += '</td></tr></table>';
                                            strEDHoverText += '<span id="'
                                            strEDHoverText += strEDHoverSPANID;
                                            strEDHoverText += '"';
                                            strEDHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strEDHoverText += "'gentooltip',this.id,0,0);";
                                            strEDHoverText += '">';
                                            strEDHoverText += strEDAlarmClock;
                                            strEDHoverText += strEDCircle;
                                            strEDHoverText += '</span>';
                                            //Inpatient
                                            strInpatientHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strInpatientHoverSPANID += "<tr><td colspan='2'>"
                                            strInpatientHoverSPANID += alink;
                                            strInpatientHoverSPANID += patientName;
                                            strInpatientHoverSPANID += endLinkTag;
                                            strInpatientHoverSPANID += '</td></tr>';
                                            strInpatientHoverSPANID += "<tr><td colspan='2'>";
                                            strInpatientHoverSPANID += strModalOrderEntryWindowLink;
                                            strInpatientHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strInpatientHoverSPANID += endLinkTag;
                                            strInpatientHoverSPANID += '</td></tr></table>';
                                            strInpatientHoverText += '<span id="'
                                            strInpatientHoverText += strInpatientHoverSPANID;
                                            strInpatientHoverText += '"';
                                            strInpatientHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strInpatientHoverText += "'gentooltip',this.id,0,0);";
                                            strInpatientHoverText += '">';
                                            strInpatientHoverText += strInpatientAlarmClock;
                                            strInpatientHoverText += strInpatientCircle;
                                            strInpatientHoverText += '</span>';
                                            //Discharge
                                            strDischargeHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strDischargeHoverSPANID += "<tr><td colspan='2'>"
                                            strDischargeHoverSPANID += alink;
                                            strDischargeHoverSPANID += patientName;
                                            strDischargeHoverSPANID += endLinkTag;
                                            strDischargeHoverSPANID += '</td></tr>';
                                            strDischargeHoverSPANID += "<tr><td colspan='2'>";
                                            strDischargeHoverSPANID += strModalOrderEntryWindowLink;
                                            strDischargeHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strDischargeHoverSPANID += endLinkTag;
                                            strDischargeHoverSPANID += '</td></tr></table>';
                                            strDischargeHoverText += '<span id="'
                                            strDischargeHoverText += strDischargeHoverSPANID;
                                            strDischargeHoverText += '"';
                                            strDischargeHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strDischargeHoverText += "'gentooltip',this.id,0,0);";
                                            strDischargeHoverText += '">';
                                            strDischargeHoverText += strDischargeAlarmClock;
                                            strDischargeHoverText += strDischargeCircle;
                                            strDischargeHoverText += '</span>';
                                            //PreOp
                                            strPreOpHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strPreOpHoverSPANID += "<tr><td colspan='2'>"
                                            strPreOpHoverSPANID += alink;
                                            strPreOpHoverSPANID += patientName;
                                            strPreOpHoverSPANID += endLinkTag;
                                            strPreOpHoverSPANID += '</td></tr>';
                                            strPreOpHoverSPANID += "<tr><td colspan='2'>";
                                            strPreOpHoverSPANID += strModalOrderEntryWindowLink;
                                            strPreOpHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strPreOpHoverSPANID += endLinkTag;
                                            strPreOpHoverSPANID += '</td></tr></table>';
                                            strPreOpHoverText += '<span id="'
                                            strPreOpHoverText += strPreOpHoverSPANID;
                                            strPreOpHoverText += '"';
                                            strPreOpHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strPreOpHoverText += "'gentooltip',this.id,0,0);";
                                            strPreOpHoverText += '">';
                                            strPreOpHoverText += strPreOpAlarmClock;
                                            strPreOpHoverText += strPreOpCircle;
                                            strPreOpHoverText += '</span>';
                                            //PostOp
                                            strPostOpHoverSPANID += "<tr><td colspan='2'>&nbsp</td></tr>";
                                            strPostOpHoverSPANID += "<tr><td colspan='2'>"
                                            strPostOpHoverSPANID += alink;
                                            strPostOpHoverSPANID += patientName;
                                            strPostOpHoverSPANID += endLinkTag;
                                            strPostOpHoverSPANID += '</td></tr>';
                                            strPostOpHoverSPANID += "<tr><td colspan='2'>";
                                            strPostOpHoverSPANID += strModalOrderEntryWindowLink;
                                            strPostOpHoverSPANID += strModalOrderEntryWindowLinkName;
                                            strPostOpHoverSPANID += endLinkTag;
                                            strPostOpHoverSPANID += '</td></tr></table>';
                                            strPostOpHoverText += '<span id="'
                                            strPostOpHoverText += strPostOpHoverSPANID;
                                            strPostOpHoverText += '"';
                                            strPostOpHoverText += ' onmousemove="javascript:txtToolTip_reveal(';
                                            strPostOpHoverText += "'gentooltip',this.id,0,0);";
                                            strPostOpHoverText += '">';
                                            strPostOpHoverText += strPostOpAlarmClock;
                                            strPostOpHoverText += strPostOpCircle;
                                            strPostOpHoverText += '</span>';

                                            //Build Cells.
                                            //Reset variables.
                                            tempString = "";
                                            tempString += 'patEncounter';
                                            tempString += uniqueRowID;
                                            //ED
                                            if (intEDColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strEDHoverText,tempString,oPatData,sbHdrDispArray[0]);
                                                if (!oPatData){return;}
                                            }
                                            //Inpatient
                                            if (intInpatientColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strInpatientHoverText,tempString,oPatData,sbHdrDispArray[1]);
                                                if (!oPatData){return;}
                                            }
                                            //Discharge
                                            if (inteDischargeColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strDischargeHoverText,tempString,oPatData,sbHdrDispArray[2]);
                                                if (!oPatData){return;}
                                            }
                                            //PreOp
                                            if (intPreOpColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strPreOpHoverText,tempString,oPatData,sbHdrDispArray[3]);
                                                if (!oPatData){return;}
                                            }
                                            //PostOp
                                            if (intePostOpColumn > 0)
                                            {
                                                oPatData = PopulateSection(strSectionName,strPostOpHoverText,tempString,oPatData,sbHdrDispArray[4]);
                                                if (!oPatData){return;}
                                            }
                                            //Status (Note: this column will always be displayed).

                                            oPatData = PopulateSection(strSectionName,strPostOpHoverText,tempString,oPatData,sbHdrDispArray[5]);
                                            if (!oPatData){return;}

                                            //Verify if the PWSTATUS contains the value Assess.
                                            if (pwStatus.toLowerCase() == "assess")
                                            {
                                                //Verify if the ' sign exists.
                                                while (pwName.indexOf("'") > -1)
                                                {
                                                    pwName = pwName.replace("'","Sverige");
                                                }
                                                while (strAssessRmvDisp.indexOf("'") > -1)
                                                {
                                                    strAssessRmvDisp = strAssessRmvDisp.replace("'","Sverige");
                                                }
                                                while (strAssessEvents.indexOf("'") > -1)
                                                {
                                                    strAssessEvents = strAssessEvents.replace("'","Sverige");
                                                }
                                                //Build Link
                                                strAssessLink += '<a href="';
                                                strAssessLink += "javascript:launchAssessWindow('";
                                                strAssessLink += strSectionName;
                                                strAssessLink += "','";
                                                strAssessLink += pwName;
                                                strAssessLink += "','";
                                                strAssessLink += strAssessEvents;
                                                strAssessLink += "','"
                                                strAssessLink += patientID;
                                                strAssessLink += "','";
                                                strAssessLink += patientEncounterID
                                                strAssessLink += "','";
                                                strAssessLink += strAssessRmvDisp;
                                                strAssessLink += "','";
                                                strAssessLink += strAssessNomenDisp;
                                                strAssessLink += "','";
                                                strAssessLink += intAssessNomenDispTotal;
                                                strAssessLink += "','";
                                                strAssessLink += patientNameAssess;
                                                strAssessLink += "');";
                                                strAssessLink += '" title="'+i18n.OPEN_ASSESS_WINDOW+'" class="LinkText">';
                                                strAssessLink +=  pwStatus;
                                                strAssessLink += endLinkTag;
                                            }
                                            else
                                            {
                                                strAssessLink = pwStatus;
                                            }
                                            oPatData = PopulateSection(strSectionName,strAssessLink,tempString,oPatData,sbHdrDispArray[5]);
                                            if (!oPatData){return;}
                                            break;
                                        }
                                    }
                                    else
                                    {
                                        //Reset variables.
                                        tempString = "";
                                        tempString += 'patEncounter';
                                        tempString += uniqueRowID;
                                        //ED
                                        if (intEDColumn > 0)
                                        {
                                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[0]);
                                            if (!oPatData){return;}
                                        }
                                        //Inpatient
                                        if (intInpatientColumn > 0)
                                        {
                                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[1]);
                                            if (!oPatData){return;}
                                        }
                                        //Discharge
                                        if (inteDischargeColumn > 0)
                                        {
                                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[2]);
                                            if (!oPatData){return;}
                                        }
                                        //PreOp
                                        if (intPreOpColumn > 0)
                                        {
                                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[3]);
                                            if (!oPatData){return;}
                                        }
                                        //PostOp
                                        if (intePostOpColumn > 0)
                                        {
                                            oPatData = PopulateSection(strSectionName,"N/A",tempString,oPatData,sbHdrDispArray[4]);
                                            if (!oPatData){return;}
                                        }
                                        //Status (Note: this column will always be displayed).
                                        oPatData = PopulateSection(strSectionName,pwStatus,tempString,oPatData,sbHdrDispArray[5]);
                                        if (!oPatData){return;}
                                    }//PTQual check
                                } //strPtQualEncounterID
                            }//if (oPatData)
                        } //oPatData check
                    } //intCounter for loop
                }//intSectionIndicator
            }//loop--->json_data2.PTREPLY.PATIENTS




        }
        catch (error)
        {
            showErrorMessage(error.message,"getQualifyingNHIQMSections","","");
            blnStatus = false;
        }
        return blnStatus;
    }
    /**
    * Launches the Assessment window.
    * @param {String} strSectionName Abbreviation of the section name.
    * @param {String} pwName Contains the value of the element PWNAME in the record structure.
    * @param {String} strAssessEvents Contains the value of the element NAME (EVENTS) in the record structure.
    * @param {String} patientID Patient Identifier.
    * @param {String} patientEncounterID Encounter Identifier.
    * @param {String} strAssessRmvDisp Contains the value of the element RMVDISP in the record structure.
    * @param {String} strAssessNomenDisp Contains values from the element NOMENDISP in the record structure that is separated by the | (pipe) sign.
    * @param {String} strNomenDispTotal Contains the total number of records from the element NOMENDISP in the record structure.
    * @param {String} patientName Contains the patient name.
    */
    function launchAssessWindow(strSectionName,pwName,strAssessEvents,patientID,patientEncounterID,strAssessRmvDisp,strAssessNomenDisp,intAssessNomenDispTotal,patientName)
    {

        var win = "";
        var strWindowHTML = "";
        var strHeadLine = "";
        var strOrderLink = "";
        //005 var strOrderLinkName = "Assessed, initiate PowerPlan";
        var strOrderLinkName = "Assessed, Order"; //005
        //005 var strOrderLinkTitle = "Open Assessed, initiate PowerPlan.";
        var strOrderLinkTitle = "Open Assessed, initiate."; //005
        var strRuleHeadLine = "";
        var strRuleLink = "";
        var strAssessNomenDispSplit = "";
        var strTriggerName = "";
        var tempValue = "";
        var strFreeTextParam = "";

        try
        {
            //Verify if the flag Sverige exists.
            while (pwName.indexOf("Sverige") > -1)
            {
                pwName = pwName.replace("Sverige","'");
            }
            while (strAssessRmvDisp.indexOf("Sverige") > -1)
            {
                strAssessRmvDisp = strAssessRmvDisp.replace("Sverige","'");
            }
            while (strAssessEvents.indexOf("Sverige") > -1)
            {
                strAssessEvents = strAssessEvents.replace("Sverige","'");
            }
            //Verify which section it is.
            switch (strSectionName.toLowerCase())
            {
            case "ami":
                strHeadLine = i18n.condDisp.AMI + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = 'AMI';
                break;
            case "hf":
                strHeadLine = i18n.condDisp.HEART_FAILURE + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "HF";
                break;
            case "pn":
                strHeadLine = i18n.condDisp.PNEUMONIA + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "PN";
                break;
            case "cac":
                strHeadLine = i18n.condDisp.CHILDRENS_ASTHMA + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "CAC";
                break;
            case "vte":
                strHeadLine = i18n.condDisp.VTE + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "VTE";
                break;
            case "stk":
                strHeadLine = i18n.condDisp.STROKE + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "STROKE";
                break;
            case "scip":
                strHeadLine = i18n.condDisp.SCIP + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "SCIP";
                break;
            case "imm":
                strHeadLine = i18n.condDisp.IMM + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "IMM";
                break;
            case "tob":
                strHeadLine = i18n.condDisp.TOB + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "TOB";
                break;
            case "sub":
                strHeadLine = i18n.condDisp.SUB + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "SUB";
                break;
            case "pc":
                strHeadLine = i18n.condDisp.PC + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "PC";
                break;
            case "hbips":
                strHeadLine = i18n.condDisp.HBIPS + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "HBIPS";
                break;
            case "sepsis":
                strHeadLine = i18n.condDisp.SEPSIS + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "SEPSIS";
                break;
            case "hs":
                strHeadLine = i18n.condDisp.HS + i18n.condDisp.INPATIENT_MEASURES;
                strTriggerName = "HS";
                break;
            }

            //Order Link.
            strOrderLink += '<a href="';
            strOrderLink += "javascript:launchAseessModalOrderEntryWindow('";
            strOrderLink += patientID;
            strOrderLink += "','";
            strOrderLink += patientEncounterID;
            strOrderLink += "');";
            strOrderLink += '" title="'
            strOrderLink += strOrderLinkTitle;
            strOrderLink += '" class="LinkText">';
            strOrderLink += strOrderLinkName;
            strOrderLink += "</a>";


            //Rule Headline.
            //Verify if the Rule Headline is going to be displayed.
            if (strAssessRmvDisp != '')
            {
                strRuleHeadLine += "Assessed for ";
                strRuleHeadLine += strAssessRmvDisp;
                //005 strRuleHeadLine += ", do not initiate PowerPlan"
                strRuleHeadLine += ", do not initiate"; //005
            }

            //Rule Links.
            if (intAssessNomenDispTotal > 0)
            {
                strAssessNomenDispSplit = strAssessNomenDisp.split("|");

                //Loop through the records.
                for (var intCounter = 0; intCounter < intAssessNomenDispTotal; intCounter++)
                {
                    //Reset variable.
                    strFreeTextParam = "";

                    //Assign Free Text Param.
                    strFreeTextParam = strAssessNomenDispSplit[intCounter];

                    //Verify if this is NOT the first record in the loop.
                    if (intCounter > 0)
                    {
                        strRuleLink += '<br>';
                    }

                    strRuleLink += '<a href="';
                    strRuleLink += "javascript:launchRule('";
                    strRuleLink += patientID;
                    strRuleLink += "','";
                    strRuleLink += patientEncounterID;
                    strRuleLink += "','";
                    strRuleLink += strTriggerName;
                    strRuleLink += "','";
                    strRuleLink += strFreeTextParam;
                    strRuleLink += "');";
                    strRuleLink += '" title="Create '
                    strRuleLink += strFreeTextParam;
                    strRuleLink += '." class="LinkText">';
                    strRuleLink += strFreeTextParam;
                    strRuleLink += "</a>";
                }
            }

            //Build HTML page.
            strWindowHTML += '<html>';
            strWindowHTML += '<head>';
            strWindowHTML += '<META content="APPLINK,MPAGES_EVENT,CCLLINK,CCLEVENT,CCLNEWWINDOW,CCLNEWSESSIONWINDOW,CCLEKSREPLYOBJECT,CCLPOPUP,CCLOVERRIDEPOPUPWINDOW" name="discern">';
            strWindowHTML += '<title>Quality Measures Assessment - ';

            //Verify if the patient name consist of " or ' characters.
            //^^ = "
            //^ = '
            if (patientName.indexOf("^^") > -1)
            {
                patientName = patientName.replace("^^","&#34;");
            }
            if (patientName.indexOf("^") > -1)
            {
                patientName = patientName.replace("^","&#39;");
            }

            strWindowHTML += patientName;
            strWindowHTML += '</title>';
            strWindowHTML += '<link rel="stylesheet" href="..\\css\\dc_mp_qual_meas.css">';
            strWindowHTML += '<script language="JavaScript" src="..\\js\\dc_mp_qual_meas_general.js"></script>';
            strWindowHTML += '</head>';
            strWindowHTML += '<body>';
            strWindowHTML += '<table cellpadding="0" cellspacing="0" border="0" width="99%">';

            strWindowHTML += '<tr>';
            strWindowHTML += '<td width="1%">&nbsp</td>';
            strWindowHTML += '<td class="AssessmentHeadline">';
            strWindowHTML += strHeadLine;
            strWindowHTML += '</td>';
            strWindowHTML += '</tr>';

            strWindowHTML += '<tr>';
            strWindowHTML += '<td width="1%">&nbsp</td>';
            strWindowHTML += '<td class="AssessmentText">';
            strWindowHTML += pwName;
            strWindowHTML += '</td>';
            strWindowHTML += '</tr>';

            strWindowHTML += '<tr>';
            strWindowHTML += '<td width="1%">&nbsp</td>';
            strWindowHTML += '<td class="AssessmentText">&nbsp</td>';
            strWindowHTML += '</tr>';

            strWindowHTML += '<tr>';
            strWindowHTML += '<td width="1%">&nbsp</td>';
            strWindowHTML += '<td class="AssessmentText">';
            strWindowHTML += strAssessEvents;
            strWindowHTML += '</td>';
            strWindowHTML += '</tr>';

            strWindowHTML += '<tr>';
            strWindowHTML += '<td width="1%">&nbsp</td>';
            strWindowHTML += '<td class="AssessmentText">&nbsp</td>';
            strWindowHTML += '</tr>';

            strWindowHTML += '<tr>';
            strWindowHTML += '<td width="1%">&nbsp</td>';
            strWindowHTML += '<td class="AssessmentText">';
            strWindowHTML += strOrderLink;
            strWindowHTML += '</td>';
            strWindowHTML += '</tr>';

            strWindowHTML += '<tr>';
            strWindowHTML += '<td width="1%">&nbsp</td>';
            strWindowHTML += '<td class="AssessmentText">&nbsp</td>';
            strWindowHTML += '</tr>';

            strWindowHTML += '<tr>';
            strWindowHTML += '<td width="1%">&nbsp</td>';
            strWindowHTML += '<td class="AssessmentText">';
            strWindowHTML += strRuleHeadLine;
            strWindowHTML += '</td>';
            strWindowHTML += '</tr>';

            strWindowHTML += '<tr>';
            strWindowHTML += '<td width="1%">&nbsp</td>';
            strWindowHTML += '<td class="AssessmentText">';
            strWindowHTML += strRuleLink;
            strWindowHTML += '</td>';
            strWindowHTML += '</tr>';

            strWindowHTML += '</table>'
            strWindowHTML += '</body>';
            strWindowHTML += '</html>';

            //Window object.
            win = window.open("", "win", "width=600,height=400,resizable=1,scrollbars=1");
            win.document.open("text/html", "replace");
            win.document.write(strWindowHTML);
            win.document.close();
        }
        catch (error)
        {
            showErrorMessage(error.message,"launchAssessWindow","","");
        }
    }
    /**
    * Hides NHIQM rows. Returns True if everything went well else it returns False.
    * @param {String} elementName Name of Element
    * @param {String} strSectionName Section Abbreviation.
    * @param {Boolean} blnRowSpan True indicates it is a RowSpan else it is False.
    * @return {Boolean}
    */
    function hideNHIQMRows(elementName,strSectionName,blnRowSpan)
    {

        var content = "";
        var tempValue = "";
        var tempTotalValue = 0;
        var blnStatus = true;
        var strErrorParameters = "";
        var errMsg = "";

        try
        {
            //Calculate how many rows we are going to hide and add 1 extra to inlcude the last row.
            tempTotalValue=GetNumPgRecords() + parseInt(1);

            for (var i = 1; i < (tempTotalValue); i++)
            {
                //Reset variables
                content = "";
                tempValue = "";
                //Verify if this is the first row and the column is ED.
                if (blnRowSpan == true)
                {
                    if (i == 1)
                    {
                        tempValue = elementName;
                    }
                    else
                    {
                        tempValue += elementName;
                        tempValue += i;
                    }
                }
                else
                {
                    tempValue += elementName;
                    tempValue += i;
                }

                content = document.getElementById(tempValue);
                if (!content)
                {
                    errMsg  = "Content ID not found!!!! id = "+tempValue;
                }
                content.style.display = "none";
                content.innerHTML = "";

            }
            return blnStatus;
        }
        catch (error)
        {
            strErrorParameters = "elementName  = "+elementName+"\n strSectionName = "+strSectionName+"\n blnRowSpan = "+blnRowSpan;
            showErrorMessage(error.message,"hideNHIQMRows","Additional Info: "+errMsg,strErrorParameters);
            blnStatus = false;
        }
    }

    /**
    * This function is needed for using AJAX when a CCL script is called.
    */
    function APPLINK(mode, appname, param) //005
    {
        if (mode == 0)
        {
            window.open("file:///" + appname + " " + param);
        }
        else
        {
            window.location = "file:///" + appname + " " + param;
        }
    }



    function GetCircle(intCircle)
    {
        try
        {
            var strCircle = "";
            var tempValue = "";
            switch (intCircle)
            {
            case 0:
                tempValue += "<img src='";
                tempValue += imagepath;
                tempValue += img5970_16;
                tempValue += "' />";
                //Empty Circle
                strCircle = tempValue;
                return strCircle;
            case 1:
                tempValue += "<img src='";
                tempValue += imagepath;
                tempValue += img5971_16;
                tempValue += "' />";
                //Half Filled Circle
                strCircle = tempValue;
                return strCircle;
            case 2:
                tempValue += "<img src='";
                tempValue += imagepath;
                tempValue += img3918_16;
                tempValue += "' />";
                //Filled Circle
                strCircle = tempValue;
                return strCircle;
            }
        }
        catch (error)
        {
            showErrorMessage(error.message,"GetCircle","intCircle = "+intCircle,"");
        }
    }



    //006 new function
    function GetVenueAlarmClock()
    {
        try{
            var tempValue = "";
            var htmlObj1 = new Object();

            tempValue += "<img src='";
            tempValue += imagepath;
            tempValue += img4798_16;
            tempValue += "'/>";
            //Alarm Clock.
            htmlObj1.strAlarmClock = tempValue;
            return htmlObj1;

        }
        catch (error)
        {
            showErrorMessage(error.message,"GetVenueAlarmClock",tempValue);
        }

    }



    function GetImageInfo(intCircle,evntObj)
    {
        try
        {
            var strStatusDisp = evntObj.STATUSDISP;
            var strEventStatus = evntObj.EVENT_STATUS;
            var strTMIND = evntObj.TMIND;
            var strHoverSPANID = "";
            var tempValue = "";

            var htmlObj = new Object();
            var strImageSource = "";

            //Verify if "Alarm Clock Image" is going to be displayed in the cell.
            //006 remove the venue level check and moved to new function GetVenueAlarmClock
            /*if ((intCircle == 0) || (intCircle == 1))
            {

                if (strTMIND > 0)
                {
                    tempValue += "<img src='";
                    tempValue += imagepath;
                    tempValue += img4798_16;
                    tempValue += "'/>";
                    //Alarm Clock.
                    htmlObj.strAlarmClock = tempValue;
                }
                else
                {
                    htmlObj.strAlarmClock = "";
                }
            }
            else
            {
                htmlObj.strAlarmClock = "";
            }
            */

            //0 = Not Done
            //1 = Not Met
            //2 = Met
            //3 = Canceled
            switch (parseInt(strEventStatus))
            {
            case 0:
                if (strTMIND <= 0)
                {
                    strImageSource = "";
                }
                else
                {
                    //Alarm Clock.
                    strImageSource += "<img src='";
                    strImageSource += imagepath;
                    strImageSource += img4798_16;
                    strImageSource += "' />";
                }
                break;
            case 1:
                //Red X.
                strImageSource += "<img src='";
                strImageSource += imagepath;
                strImageSource += img3727_16;
                strImageSource += "' />";
                break;
            case 2:
                //Green Check Mark.
                strImageSource += "<img src='";
                strImageSource += imagepath;
                strImageSource += img4022_16;
                strImageSource += "' />";
                break;
            case 3:
                //006 changed, looking at updating the alarm clock at the measure level
                if (strTMIND > 0)
                {
                    strImageSource = strStatusDisp;
                    //Alarm Clock.
                    strImageSource += "<img src='";
                    strImageSource += imagepath;
                    strImageSource += img4798_16;
                    strImageSource += "' />";


                } else{
                    strImageSource = strStatusDisp;
                }

                break;
            }
            htmlObj.strImageSource = strImageSource;

            //Build Hover
            strHoverSPANID += '<tr>';
            strHoverSPANID += '<td>';
            strHoverSPANID += CreateOutComeLink(evntObj);
            strHoverSPANID += '</td>';
            strHoverSPANID += '<td><span>';
            strHoverSPANID += strImageSource;
            strHoverSPANID += '</span></td>';
            strHoverSPANID += '</tr>';
            htmlObj.strHoverSPANID = strHoverSPANID;
            return htmlObj;
        }
        catch (error)
        {
            showErrorMessage(error.message,"GetImageInfo","intCircle = "+intCircle+"\n strStatusDisp = "+strStatusDisp,"strEventStatus = "+strEventStatus+"\n strTMIND = "+strTMIND);
        }
    }

    function CreateOutComeLink(evntObj)
    {
        try
        {
            var patientEncounterID = evntObj.patientEncounterID;
            var patientID = evntObj.patientID;
            //var strEventName = evntObj.NAME.replace(/"/g,'%22');  //004
            var strEventName = evntObj.NAME.replace(/"/g,"&quot;");
            var intOutcomeFrmId = evntObj.OUTCOMEFRMID;

            var endLinkTag = "</a>";
            var strOutcomeLink = "";

            if (intOutcomeFrmId > 0)
            {
                //Build Link.
                strOutcomeLink += "<a href='";
                strOutcomeLink += "javascript:launchPowerForm(";
                strOutcomeLink += patientID;
                strOutcomeLink += ",";
                strOutcomeLink += patientEncounterID;
                strOutcomeLink += ",";
                strOutcomeLink += intOutcomeFrmId;
                strOutcomeLink += ");";
                strOutcomeLink += "' title='"+i18n.OPEN_POWER_FORM+"' class='LinkText'>";
                strOutcomeLink += strEventName;
                strOutcomeLink += endLinkTag;
            }
            else
            {
                strOutcomeLink = strEventName;
            }
            return strOutcomeLink;
        }
        catch (error)
        {
            showErrorMessage(error.message,"CreateOutComeLink","patientEncounterID = "+patientEncounterID+"\n intOutcomeFrmId = "+intOutcomeFrmId,"patientID = "+patientID+"\n strEventName = "+strEventName);
        }
    }

    function AddToOPatData(innerHtml,oPatData,strSectionName,strSubSecName)
    {
        try
        {
            var oSecData = new Object();
            oSecData.strSectionName = strSectionName;
            oSecData.strSubSecName = strSubSecName;
            oSecData.innrHtml = innerHtml
            if(!oPatData.secDataAr)
                {oPatData.secDataAr = new Array();}
            oPatData.secDataAr.push(oSecData);

            switch (strSectionName.toLowerCase())
            {
                case "ami":
                    oPatData.patientStatus = innerHtml;
                    break;
                case "hf":
                    oPatData.patientStatusHeartFailure = innerHtml;
                    break;
                case "pn":
                    oPatData.patientStatusPneumonia = innerHtml;
                    break;
                case "cac":
                    oPatData.patientStatusChildrensAsthma = innerHtml;
                    break;
                case "vte":
                    oPatData.patientStatusVTE = innerHtml;
                    break;
                case "stk":
                    oPatData.patientStatusStroke = innerHtml;
                    break;
                case "scip":
                    oPatData.patientStatusSCIP = innerHtml;
                    break;
                case "imm":
                    oPatData.patientStatusImm = innerHtml;
                    break;
                case "tob":
                    oPatData.patientStatusTob = innerHtml;
                    break;
                case "sub":
                    oPatData.patientStatusSub = innerHtml;
                    break;
                case "pc":
                    oPatData.patientStatusPc = innerHtml;
                    break;
                case "hbips":
                    oPatData.patientStatusHbips = innerHtml;
                    break;
                case "sepsis":
                    oPatData.patientStatusSepsis = innerHtml;
                    break;
                case "hs":
                    oPatData.patientStatusHS = innerHtml;
                    break;
            }
            return oPatData;
        }
        catch (error)
        {
            showErrorMessage(error.message,"AddToOPatData","strSectionName = "+strSectionName+"\n oPatData = "+oPatData,"strSubSecName = "+strSubSecName+"\n innerHtml = "+innerHtml);
        }
    }

    function InsertOPatData(oPatData,rowId)
    {
        try
        {
            if (oPatData.secDataAr)
            {
                for(dtIdx=0;dtMax=oPatData.secDataAr.length,dtIdx<dtMax;dtIdx++)
                {
                    var oSecData = oPatData.secDataAr[dtIdx];
                    var intHiddenValue = GetHiddenExpandCollapse(oSecData.strSectionName);

                    if (parseInt(intHiddenValue) == parseInt(0))
                    {
                        tempValueY = GetTempValueY(oSecData.strSectionName,oSecData.strSubSecName);
                        if (tempValueY)
                        {
                            var elId = 'patEncounter' + parseInt(rowId);
                            var tempValueX = document.getElementById(elId).cells[tempValueY];

                            oSecData.innrHtml = SetHvrParams(oSecData.innrHtml,rowId);

                            tempValueX.innerHTML = oSecData.innrHtml;


                        }
                    }
                }
            }
        }
        catch (error)
        {
            showErrorMessage(error.message,"InsertOPatData","tempValueY = "+tempValueY,"elId = "+elId+"\n rowId = "+rowId);
        }
    }

    function GetHiddenExpandCollapse(strSectionName)
    {
        try
        {

            switch(strSectionName.toLowerCase())
            {
                case 'ami':
                    return hiddenExpandCollapse;
                case 'hf':
                    return hiddenHeartFailureExpandCollapse;
                case 'pn':
                    return hiddenPneumoniaExpandCollapse;
                case 'cac':
                    return hiddenChildrensAsthmaExpandCollapse;
                case 'vte':
                    return hiddenVTEExpandCollapse;
                case 'stk':
                    return hiddenStrokeExpandCollapse;
                case 'scip':
                    return hiddenSCIPExpandCollapse;
                case 'pressureulcers':
                    return hiddenPressureUlcersExpandCollapse;
                case 'cri':
                    return hiddenCRIExpandCollapse;
                case 'falls':
                    return hiddenFallsExpandCollapse;
                case 'fallspediatric':
                    return hiddenFallsPediatricExpandCollapse;
                case 'pain':
                    return hiddenPainExpandCollapse;
                case 'pedpain':
                    return hiddenPedPainExpandCollapse;
                case 'pskin':
                    return hiddenpSkinExpandCollapse;
                case 'imm':
                    return hiddenImmExpandCollapse;
                case 'tob':
                    return hiddenTobExpandCollapse;
                case 'sub':
                    return hiddenSubExpandCollapse;
                case 'pc':
                    return hiddenPCExpandCollapse;
                case 'hbips':
                    return hiddenHBIPSExpandCollapse;
                case 'sepsis':
                    return hiddenSEPSISExpandCollapse;
                case 'hs':
                    return hiddenHSExpandCollapse;
                default:
                    return -1;
            }
        }
        catch (error)
        {
            showErrorMessage(error.message,"GetHiddenExpandCollapse","","");
            blnStatus = false;
        }
    }

    function PopulateSection(strSectionName,innerHtml,tempString,oPatData,strSubSecName)
    {
        try
        {
            var tempValueX = "";
            var tempValueY = ""; //002 dynamic cell count
            var errMsg = "";
            oPatData = AddToOPatData(innerHtml,oPatData,strSectionName,strSubSecName);
            if (parseInt(oPatData.pageNum) == parseInt(currentPage) && (IdWithinLimit(tempString)))
            {
                tempValueY = GetTempValueY(strSectionName,strSubSecName);
                if (!tempValueY){errMsg = "Failed to acquire tempValueY.";}
                tempValueX = document.getElementById(tempString).cells[tempValueY];
                tempValueX.innerHTML = innerHtml;
            }

            return oPatData;
        }
        catch (error)
        {
            showErrorMessage(error.message,"PopulateSection","strSectionName = "+strSectionName,"strSubSecName = "+strSubSecName+"\n tempString = "+tempString+"\n Additional Info: "+errMsg);
        }
    }

    function SetHvrParams(innrHTML,rowId)
    {
        try
        {
            var innerHTML = "";
            var nStrtIdx = 0;
            var nEndIdx = 0;
            var newParams = "";
            var oldParams = "";
            var tmpParams = "";

            nStrtIdx = innrHTML.indexOf("txtToolTip_reveal");
            if (nStrtIdx > 0){nStrtIdx += 17;}

            nEndIdx = innrHTML.indexOf("this.id,0,0");



            if (nEndIdx > 0)
                {
                    //get a 20 character string starting at the just acquired nEndIdx to find the closing parantheses
                    tmpParams = innrHTML.substring(nEndIdx,nEndIdx + 20);
                    //
                    nEndIdx = tmpParams.indexOf(")") + nEndIdx + 1;
                }

            oldParams = innrHTML.substring(nStrtIdx,nEndIdx);

            newParams = "('gentooltip',this.id,0,0,"+rowId+")";

            if (nStrtIdx > 0)
            {
                innerHTML = innrHTML.replace(oldParams,newParams);
            }
            else
            {
                innerHTML = innrHTML;
            }

            return innerHTML;
        }
        catch (error)
        {
            showErrorMessage(error.message,"SetHvrParams",""+errMsg);
        }
    }

    function IdWithinLimit(tempString)
    {
        try
        {
            var tempAr = tempString.split('r')
            if (parseInt(tempAr[tempAr.length-1]) > parseInt(rowTotal))
            {
                return false;
            }
            return true;
        }
        catch (error)
        {
            showErrorMessage(error.message,"IdWithinLimit","","tempString = "+tempString);
        }
    }

    function GetSbHdrDispArrayAndIdx(strSectionName,strSubSecName)
    {
        try
        {
            var oSbHdr = new Object();

            switch (strSectionName.toLowerCase())
            {
            case "ami":
                oSbHdr.sbHdrDispArray = amiSbHdrDispArray;
                break;
            case "hf":
                oSbHdr.sbHdrDispArray = hrtFailSbHdrDispArray;
                break;
            case "pn":
                oSbHdr.sbHdrDispArray = pneuSbHdrDispArray;
                break;
            case "cac":
                oSbHdr.sbHdrDispArray = cacSbHdrDispArray;
                break;
            case "vte":
                oSbHdr.sbHdrDispArray = vteSbHdrDispArray;
                break;
            case "stk":
                oSbHdr.sbHdrDispArray = strokeSbHdrDispArray;
                break;
            case "scip":
                oSbHdr.sbHdrDispArray = scipSbHdrDispArray;
                break;
            case "cri":
                oSbHdr.sbHdrDispArray = criSbHdrDispArray;
                break;
            case "fallspediatric":
                oSbHdr.sbHdrDispArray = pedFallsSbHdrDispArray;
                break;
            case "falls":
                oSbHdr.sbHdrDispArray = fallsSbHdrDispArray;
                break;
            case "pain":
                oSbHdr.sbHdrDispArray = painSbHdrDispArray;
                break;
            case "pedpain":
                oSbHdr.sbHdrDispArray = pedPainSbHdrDispArray;
                break;
            case "pressureulcers":
                oSbHdr.sbHdrDispArray = pressUlcrSbHdrDispArray;
                break;
            case "pskin":
                oSbHdr.sbHdrDispArray = pSkinSbHdrDispArray;
                break;
            case "imm":
                oSbHdr.sbHdrDispArray = immSbHdrDispArray;
                break;
            case "tob":
                oSbHdr.sbHdrDispArray = tobSbHdrDispArray;
                break;
            case "sub":
                oSbHdr.sbHdrDispArray = subSbHdrDispArray;
                break;
            case "pc":
                oSbHdr.sbHdrDispArray = pcSbHdrDispArray;
                break;
            case "hbips":
                oSbHdr.sbHdrDispArray = hbipsSbHdrDispArray;
                break;
            case "sepsis":
                oSbHdr.sbHdrDispArray = sepsisSbHdrDispArray;
                break;
            case "hs":
                oSbHdr.sbHdrDispArray = hsSbHdrDispArray;
                break;
            default:
                return null;
            }

            var sbHdrIdx = -1;
            for (arIdx=0;arMax=oSbHdr.sbHdrDispArray.length,arIdx<arMax;arIdx++)
            {
                if (oSbHdr.sbHdrDispArray[arIdx].toLowerCase() == strSubSecName.toLowerCase())
                {
                    sbHdrIdx = arIdx;
                    arIdx = arMax;
                }
            }
            oSbHdr.sbHdrIdx = sbHdrIdx;
            if (oSbHdr.sbHdrIdx < 0)
            {
                return null;
            }

            return oSbHdr;
        }
        catch (error)
        {
            showErrorMessage(error.message,"GetSbHdrDispArrayAndIdx","strSectionName = "+strSectionName,"strSubSecName = "+strSubSecName);
        }
    }

    function GetTempValueY(strSectionName,strSubSecName)
    {
        try
        {
            var tempValueY = ""; //002 dynamic cell count
            var strCellCntr = "";
            var intVal = 0;

            var sbHdrObj = GetSbHdrDispArrayAndIdx(strSectionName,strSubSecName);
            //if (!sbHdrObj){alert("sbHdrObj = "+sbHdrObj);return null;}

            intVal = sbHdrObj.sbHdrIdx;
            if (intVal >= 0)
            {
                strCellCntr = parseInt(intVal);
            }
            else
            {
                return null;
            }
            //Verify which section it is.
            switch (strSectionName.toLowerCase())
            {
            case "ami":
                tempValueY = parseInt(amiCell)+ strCellCntr;
                break;
            case "hf":
                tempValueY = parseInt(hfCell)+ strCellCntr;
                break;
            case "pn":
                tempValueY = parseInt(pnCell)+ strCellCntr;
                break;
            case "cac":
                tempValueY = parseInt(cacCell)+ strCellCntr;
                break;
            case "vte":
                tempValueY = parseInt(vteCell)+ strCellCntr;
                break;
            case "stk":
                tempValueY = parseInt(strokeCell)+ strCellCntr;
                break;
            case "scip":
                tempValueY = parseInt(scipCell) + strCellCntr;
                break;
            case "cri":
                tempValueY = parseInt(criCell) + strCellCntr;
                break;
            case "fallspediatric":
                tempValueY = parseInt(pfallCell) + strCellCntr;
                break;
            case "falls":
                tempValueY = parseInt(fallCell) + strCellCntr;
                break;
            case "pain":
                tempValueY = parseInt(painCell) + strCellCntr;
                break;
            case "pedpain":
                tempValueY = parseInt(ppainCell) + strCellCntr;
                break;
            case "pressureulcers":
                tempValueY = parseInt(puCell) + strCellCntr;
                break;
            case "pskin":
                tempValueY = parseInt(pskinCell) + strCellCntr;
                break;
            case "imm":
                tempValueY = parseInt(immCell) + strCellCntr;
                break;
            case "tob":
                tempValueY = parseInt(tobCell) + strCellCntr;
                break;
            case "sub":
                tempValueY = parseInt(subCell) + strCellCntr;
                break;
            case "pc":
                tempValueY = parseInt(pcCell) + strCellCntr;
                break;
            case "hbips":
                tempValueY = parseInt(hbipsCell) + strCellCntr;
                break;
            case "sepsis":
                tempValueY = parseInt(sepsisCell) + strCellCntr;
                break;
            case "hs":
                tempValueY = parseInt(hsCell) + strCellCntr;
                break;
            }

            return tempValueY;
        }
        catch (error)
        {
            showErrorMessage(error.message,"GetTempValueY","strSectionName = "+strSectionName,"strSubSecName = "+strSubSecName);
            return null;
        }
    }

    function GetNumPgRecords()
    {
        try
        {
            var nPgNum = 0;
            nPgNum = currentPage;
            var totPgRecs = 0;
            for (ptIdx=0;ptMax=patData.length,ptIdx<ptMax;ptIdx++)
            {
                var oPatData = patData[ptIdx];
                if (parseInt(oPatData.pageNum) == parseInt(nPgNum))
                {
                    totPgRecs++;
                }
            }
            return totPgRecs;
        }
        catch (error)
        {
            showErrorMessage(error.message,"GetNumPgRecords","patData.length = "+patData.length,"oPatData.pageNum = "+oPatData.pageNum+"\n currentPage = "+currentPage);
        }
    }

    function HideColumn(hdrTableWidth,hdrTable2Width,strSubColumn,rowName,strSectionName,strMainColumn)
    {
        try
        {
            //get current table width
            var intCurrentTableWidth = document.getElementById('hdrtable').width;
            intCurrentTableWidth -= parseInt(80);
            hdrTableWidth = parseInt(hdrTableWidth) - parseInt(80);
            hdrTable2Width = parseInt(hdrTable2Width) - parseInt(80);
            document.getElementById("hdrtable").width = parseInt(intCurrentTableWidth);
            document.getElementById("hdrtable2").width = parseInt(intCurrentTableWidth);
            //Hide Sub Column and change its width.
            document.getElementById(strSubColumn).style.display = "none";
            document.getElementById(strSubColumn).innerHTML = "";
            //Hide Rows.
            if (strSubColumn.indexOf('1',1) < 0)    //ED
            {blnHideAMIRows = hideNHIQMRows(rowName,strSectionName,false);}
            else {blnHideAMIRows = hideNHIQMRows(rowName,strSectionName,true);}
            //Verify if an error occured.
            if (blnHideAMIRows == false)
            {
                blnStatus = false;
                return blnStatus;
            }

            //Change Main Headers colspan and its width.
            tempValueX = ""
            tempValueX = document.getElementById('hdrtable').rows[0].cells;

            //Verify which section it is.
            switch (strSectionName.toLowerCase())
            {
            case "ami":
                tableAMIColSpan = parseInt(tableAMIColSpan) - parseInt(1);
                tempValueX[amiDisplayIndicator].colSpan = tableAMIColSpan;
                break;
            case "hf":
                tableHeartFailureColSpan = parseInt(tableHeartFailureColSpan) - parseInt(1);
                tempValueX[heartFailureDisplayIndicator].colSpan = tableHeartFailureColSpan;
                break;
            case "pn":
                tablePneumoniaColSpan = parseInt(tablePneumoniaColSpan) - parseInt(1);
                tempValueX[pneumoniaDisplayIndicator].colSpan = tablePneumoniaColSpan;
                break;
            case "cac":
                tableChildrensAsthmaColSpan = parseInt(tableChildrensAsthmaColSpan) - parseInt(1);
                tempValueX[cacDisplayIndicator].colSpan = tableChildrensAsthmaColSpan;
                break;
            case "vte":
                tableVTEColSpan = parseInt(tableVTEColSpan) - parseInt(1);
                tempValueX[vteDisplayIndicator].colSpan = tableVTEColSpan;
                break;
            case "stk":
                tableStrokeColSpan = parseInt(tableStrokeColSpan) - parseInt(1);
                tempValueX[strokeDisplayIndicator].colSpan = tableStrokeColSpan;
                break;
            case "scip":
                tableSCIPColSpan = parseInt(tableSCIPColSpan) - parseInt(1);
                tempValueX[scipDisplayIndicator].colSpan = tableSCIPColSpan;
                break;
            case "imm":
                tableImmColSpan = parseInt(tableImmColSpan) - parseInt(1);
                tempValueX[immDisplayIndicator].colSpan = tableImmColSpan;

                break;
            case "tob":
                tableTobColSpan = parseInt(tableTobColSpan) - parseInt(1);
                tempValueX[tobDisplayIndicator].colSpan = tableTobColSpan;
                break;
            case "sub":
                tableSubColSpan = parseInt(tableSubColSpan) - parseInt(1);
                tempValueX[subDisplayIndicator].colSpan = tableSubColSpan;
                break;
            case "pc":
                tablePcColSpan = parseInt(tablePcColSpan) - parseInt(1);
                tempValueX[pcDisplayIndicator].colSpan = tablePcColSpan;
                break;
            case "hbips":
                tableHbipsColSpan = parseInt(tableHbipsColSpan) - parseInt(1);
                tempValueX[hbipsDisplayIndicator].colSpan = tableHbipsColSpan;
                break;
            case "sepsis":
                tableSepsisColSpan = parseInt(tableSepsisColSpan) - parseInt(1);
                tempValueX[sepsisDisplayIndicator].colSpan = tableSepsisColSpan;
                break;
            case "hs":
                tableHSColSpan = parseInt(tableHSColSpan) - parseInt(1);
                tempValueX[hsDisplayIndicator].colSpan = tableHSColSpan;
                break;
            }
            tempValueX = "";
            tempTableWidth = "";

            tempValueX = document.getElementById(strMainColumn);
            //Verify which section it is.
            switch (strSectionName.toLowerCase())
            {
            case "ami":
                tableAMIWidth = parseInt(tableAMIWidth) - parseInt(80);
                tempTableWidth = tableAMIWidth + 'px';
                break;
            case "hf":
                tableHeartFailureWidth = parseInt(tableHeartFailureWidth) - parseInt(80);
                tempTableWidth = tableHeartFailureWidth + 'px';
                break;
            case "pn":
                tablePneumoniaWidth = parseInt(tablePneumoniaWidth) - parseInt(80);
                tempTableWidth = tablePneumoniaWidth + 'px';
                break;
            case "cac":
                tableChildrensAsthmaWidth = parseInt(tableChildrensAsthmaWidth) - parseInt(80);
                tempTableWidth = tableChildrensAsthmaWidth + 'px';
                break;
            case "vte":
                tableVTEWidth = parseInt(tableVTEWidth) - parseInt(80);
                tempTableWidth = tableVTEWidth + 'px';
                break;
            case "stk":
                tableStrokeWidth = parseInt(tableStrokeWidth) - parseInt(80);
                tempTableWidth = tableStrokeWidth + 'px';
                break;
            case "scip":
                tableSCIPWidth = parseInt(tableSCIPWidth) - parseInt(80);
                tempTableWidth = tableSCIPWidth + 'px';
                break;
            case "imm":
                tableImmWidth = parseInt(tableImmWidth) - parseInt(80);
                tempTableWidth = tableImmWidth + 'px';
                break;
            case "tob":
                tableTobWidth = parseInt(tableTobWidth) - parseInt(80);
                tempTableWidth = tableTobWidth + 'px';
                break;
            case "sub":
                tableSubWidth = parseInt(tableSubWidth) - parseInt(80);
                tempTableWidth = tableSubWidth + 'px';
                break;
            case "pc":
                tablePcWidth = parseInt(tablePcWidth) - parseInt(80);
                tempTableWidth = tablePcWidth + 'px';
                break;
            case "hbips":
                tableHbipsWidth = parseInt(tableHbipsWidth) - parseInt(80);
                tempTableWidth = tableHbipsWidth + 'px';
                break;
            case "sepsis":
                tableSepsisWidth = parseInt(tableSepsisWidth) - parseInt(80);
                tempTableWidth = tableSepsisWidth + 'px';
                break;
            case "hs":
                tableHSWidth = parseInt(tableHSWidth) - parseInt(80);
                tempTableWidth = tableHSWidth + 'px';
                break;
            }
            tempValueX.style.width = tempTableWidth;
        }
        catch (error)
        {
            showErrorMessage(error.message,"HideColumn","","strSectionName = "+strSectionName + "\n strSubColumn = "+strSubColumn+"\n strMainColumn = "+strMainColumn+"\n strSectionName = "+strSectionName+"\n rowName = "+rowName);
        }
    }

    function GetOsecObjFromArray(strSectionName)
    {
        try
        {
            for (f=0;g=secObjAr.length,f<g;f++)
            {
                var oSecObj = secObjAr[f];
                if (oSecObj.strSectionName.toLowerCase() == strSectionName.toLowerCase())
                {
                    return oSecObj;
                }
            }
            return null;
        }
        catch (error)
        {
            showErrorMessage(error.message,"GetOsecObjFromArray","","strSectionName = "+strSectionName+"\n oSecObj.strSectionName = "+oSecObj.strSectionName+"\n secObjAr.length = "+secObjAr.length);
            return null;
        }
    }
    function RemoveUnqualifiedPt(objPtReply, objCondReply, stat) {
        if (objCondReply && objPtReply) {
            try {
                stat = typeof stat !== 'undefined' ? stat.toLowerCase() : '';
                //// merge data back before looping
                //if (objTempCondReply instanceof Array && objTempPtReply instanceof Array && objTempCondReply.length > 0 && objTempPtReply.length > 0) {
                //    objPtReply.concat(objTempPtReply);
                //    objCondReply.concat(objTempCondReply);
                //    objTempCondReply = [];
                //    objTempPtReply = [];
                //}
                if (objCondReply.LIST && objPtReply.PATIENTS) {
                    for (var patient = 0; patient < objCondReply.LIST.length; patient++) {
                        /* N/A status does not need to be saved */
                        if (objCondReply.LIST[patient].PWSTATUS.toLowerCase() === "n/a") {
                            for (var member = 0; member < objPtReply.PATIENTS.length; member++) {
                                if (objPtReply.PATIENTS[member].ENCNTR_ID == objCondReply.LIST[patient].EID) {
                                    objPtReply.PATIENTS.splice(member, 1);
                                    break;
                                }
                            }
                            objCondReply.LIST.splice(patient, 1);
                            patient--;
                            continue;
                        }
                        /* Assess */
                        if (stat=== "assess" && objCondReply.LIST[patient].PWSTATUS.toLowerCase() !== stat) {
                            for (var member = 0; member < objPtReply.PATIENTS.length; member++) {
                                if (objPtReply.PATIENTS[member].ENCNTR_ID == objCondReply.LIST[patient].EID) {
                                    //objTempCondReply.push(objPtReply.PATIENTS[member]);
                                    objPtReply.PATIENTS.splice(member, 1);
                                    break;
                                }
                            }
                            //objTempPtReply.push(objCondReply.LIST[patient]);
                            objCondReply.LIST.splice(patient, 1);
                            patient--;
                            continue;
                        }
                        /* Complete */
                        if (stat === "complete" &&
                            (objCondReply.LIST[patient].PWSTATUS.toLowerCase() === "assess" ||
                            (objCondReply.EDIND > 0 && objCondReply.LIST[patient].EDSTAT < 2) ||
                            (objCondReply.IPIND > 0 && objCondReply.LIST[patient].IPSTAT < 2) ||
                            (objCondReply.DISCHIND > 0 && objCondReply.LIST[patient].DISCHSTAT < 2) ||
                            (objCondReply.PREOPIND > 0 && objCondReply.LIST[patient].PREOPSTAT < 2) ||
                            (objCondReply.POSTOPIND > 0 && objCondReply.LIST[patient].POSTOPSTAT < 2))) {
                            for (var member = 0; member < objPtReply.PATIENTS.length; member++) {
                                if (objPtReply.PATIENTS[member].ENCNTR_ID == objCondReply.LIST[patient].EID) {
                                    objPtReply.PATIENTS.splice(member, 1);
                                    break;
                                }
                            }
                            objCondReply.LIST.splice(patient, 1);
                            patient--;
                            continue;
                        }
                        /* Incomplete */
                        if (stat === "incomplete" && (objCondReply.LIST[patient].PWSTATUS.toLowerCase() === "assess" ||
                            !((objCondReply.EDIND > 0 && objCondReply.LIST[patient].EDSTAT < 2) ||
                            (objCondReply.IPIND > 0 && objCondReply.LIST[patient].IPSTAT < 2) ||
                            (objCondReply.DISCHIND > 0 && objCondReply.LIST[patient].DISCHSTAT < 2) ||
                            (objCondReply.PREOPIND > 0 && objCondReply.LIST[patient].PREOPSTAT < 2) ||
                            (objCondReply.POSTOPIND > 0 && objCondReply.LIST[patient].POSTOPSTAT < 2)))) {
                            for (var member = 0; member < objPtReply.PATIENTS.length; member++) {
                                if (objPtReply.PATIENTS[member].ENCNTR_ID == objCondReply.LIST[patient].EID) {
                                    objPtReply.PATIENTS.splice(member, 1);
                                    break;
                                }
                            }
                            objCondReply.LIST.splice(patient, 1);
                            patient--;
                            continue;
                        }
                    }
                    // Reset some data inside these json
                    objCondReply.LISTCNT = objCondReply.LIST.length;
                    objPtReply.PT_CNT = objPtReply.PATIENTS.length;
                    objPtReply.PAGE_CNT = Math.ceil(objPtReply.PATIENTS.length / rowTotal);
                    var pageNum = 1;
                    for (var member = 0; member < objPtReply.PATIENTS.length; member++) {
                        if ((member + 1) % (rowTotal + 1) == 0) {
                            pageNum++;
                        }
                        objPtReply.PATIENTS[member].PAGENUM = pageNum;
                    }
                }
            }
            catch (error) {
                showErrorMessage(error.message, "RemoveUnqualifiedPt", "", "");
            }
        }
    }
