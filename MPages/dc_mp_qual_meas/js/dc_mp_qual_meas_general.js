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
	  *  (3) install the Script Source Code in Client’s environment.        *
	  *  B. Use of the Script Source Code is for Client’s internal purposes *
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

        Source file name:       dc_mp_qual_meas_general.js

        Product:                Discern Content
        Product Team:           Discern Content

        File purpose:           Provides general functions to the
        						MPage Quality Measures.

        Special Notes:          <add any special notes here>

;~DB~****************************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    	   			*
;********************************************************************************************
;*                                                                            	   			*
;*Mod	Date     	Engineer            	Feature			Comment                      	*
;*--- 	---------- 	-------------------- 	------------ 	-----------------------------	*
;*000 	02/01/2010	Niklas Forsberg      			   		Initial Release          		*
;*001   07/07/2010 	Niklas Forsberg			 				NHIQM 3.2 Updates				*
;*002   11/30/2010 	Niklas Forsberg			 				Pediatric Pain					*
;*004*  12/10/2010  Christopher Canida						Pediatric Skin *skipped to 004  *                                                                            	   			*
;*005   01/07/2011  Christopher Canida					 	Enhancements for 3.3    	    *
;*006	08/31/2011  Allison Wynn							Enhancements 4.0 - Adding Bedrock
;															filter/Preference to determine	*
;															# of columns to open on page load
;*007   04/10/2012  Allison Wynn							Version 4.1
;*008   07/03/2012  Bill Dean                               Added new Image for CRI         *
;~DE~****************************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ***********************************/

//General Global Variables.
var uniqueInt = 0;
var popupWindowHandle;
var json_data = "";
var json_data2 = "";
var json_data3 = "";
var json_data4 = "";
var json_data5 = "";
var json_data6 = "";
var json_data7 = "";
var json_data8 = "";
var json_data9 = "";
var json_data10 = "";
var json_data11 = "";
var json_data12 = "";
var json_data13 = "";
var json_data15 = "";
var json_data16 = "";
var json_data17 = "";  // ;;004 addition of Pediatric Skin condition
var json_dataImm = "";
var json_dataTob = "";
var json_dataSub = "";
var json_dataPc = "";
var json_dataHbips = "";
var json_dataSepsis = "";
var json_dataHS = "";
var imagepath = "..\\img\\";
var selectedID = 0;
var ptListType = "";
var ptListLoccd = "";
var rowSpanCounter = 0;
var hdrTableWidth = 1240;  // 005 changed from 1520 for new column;;004 changed from 1480 for Pediatric Skin condition
var hdrTable2Width = 1240; // 005 changed from 1520 for new column;;004 changed from 1480 for Pediatric Skin condition
var requestAsync = "";
var intDefaultExpanded = 0;
var intActiveComponentCounter = 0;
var pageNum = 1;
var currentPage = 1;
var hideLoadTextDelay = 1500
//Images
var img4798_16 = "4798_16.png";	//Alarm Clock
var img3727_16 = "3727_16.png"; //Red X
var img4022_16 = "4022_16.gif"; //Green Check Mark
var img5970_16 = "5970_16.gif"; //Empty Circle
var img5971_16 = "5971_16.gif"; //Half Filled Circle
var img3918_16 = "3918_16.gif"; //Filled Circle
var img6047_16 = "6047_16.png"; //Red Triangle with White Exclamation Mark.
var img3927    = "3927.gif";  //Filled Red Circle //008

var totalPatients = 0;
//AMI
var tableAMIWidth = 500;
var tableAMIColSpan = 6;
var blnFirstAmi = true;
var PgRecTotal = 0;
var blnAmiCalled = false;
//Heart Failure
var tableHeartFailureWidth = 500;
var tableHeartFailureColSpan = 6;
var blnHeartFailureCalled = false;
var blnFirstTimeHeartFailure = true;
//Pneumonia
var tablePneumoniaWidth = 500;
var tablePneumoniaColSpan = 6;
var blnPneumoniaCalled = false;
var blnFirstTimePneumonia = true;
//Children's Asthma
var tableChildrensAsthmaWidth = 500;
var tableChildrensAsthmaColSpan = 6;
var blnChildrensAsthmaCalled = false;
var blnFirstTimeChildrensAsthma = true;
//VTE
var tableVTEWidth = 500;
var tableVTEColSpan = 6;
var blnVTECalled = false;
var blnFirstTimeVTE = true;
//Stroke
var tableStrokeWidth = 500;
var tableStrokeColSpan = 6;
var blnStrokeCalled = false;
var blnFirstTimeStroke = true;
//SCIP
var tableSCIPWidth = 500;
var tableSCIPColSpan = 6;
var blnSCIPCalled = false;
var blnFirstTimeSCIP = true;
//Imm
var tableImmWidth = 500;
var tableImmColSpan = 6;
var blnImmCalled = false;
var blnFirstTimeImm = true;
//Tob
var tableTobWidth = 500;
var tableTobColSpan = 6;
var blnTobCalled = false;
var blnFirstTimeTob = true;
//Sub
var tableSubWidth = 500;
var tableSubColSpan = 6;
var blnSubCalled = false;
var blnFirstTimeSub = true;
//PC
var tablePcWidth = 500;
var tablePcColSpan = 6;
var blnPcCalled = false;
var blnFirstTimePc = true;
//HBIPS
var tableHbipsWidth = 500;
var tableHbipsColSpan = 6;
var blnHbipsCalled = false;
var blnFirstTimeHbips = true;
//SEPSIS
var tableSepsisWidth = 500;
var tableSepsisColSpan = 6;
var blnSepsisCalled = false;
var blnFirstTimeSepsis = true;
//HS
var tableHSWidth = 500;
var tableHSColSpan = 6;
var blnHSCalled = false;
var blnFirstTimeHS = true;
//Pressure Ulcers
var blnPressureUlcersCalled = false;
var blnFirstTimePressureUlcers = true;
//CRI
var blnCRICalled = false;
var blnFirstTimeCRI = true;
//Falls
var blnFallsCalled = false;
var blnFirstTimeFalls = true;
//Falls - Pediatric
var tableFallsPediatricColSpan = 3;
var blnFallsPediatricCalled = false;
var blnFirstTimeFallsPediatric = true;
//Pain
var blnPainCalled = false;
var blnFirstTimePain = true;
//Pain - Pediatric
var blnPedPainCalled = false;
var blnFirstTimePedPain = true;
//Skin Pediatric  // ;;004 addition of Pediatric Skin condition
var blnpSkinCalled = false;
var blnFirstTimepSkin = true;
//Regular expressions for normalizing white space (Sort Function).
var whtSpEnds = new RegExp("^\\s*|\\s*$", "g");
var whtSpMult = new RegExp("\\s\\s+", "g");
//Timers
var intTimeOutID = 0;
var intTimeOutID2 = 0;
//Input parameters from PrefMaint.
var patientListNumber = "";
var amiDisplayIndicator = "";
var	heartFailureDisplayIndicator = "";
var	pneumoniaDisplayIndicator = "";
var	cacDisplayIndicator = "";
var	vteDisplayIndicator = "";
var	strokeDisplayIndicator = "";
var	scipDisplayIndicator = "";
var	pressureUlcerDisplayIndicator = "";
var	criDisplayIndicator = "";
var	fallsDisplayIndicator = "";
var	pediatricFallsDisplayIndicator = "";
var	immDisplayIndicator = "";
var	tobDisplayIndicator = "";
var	subDisplayIndicator = "";
var	pcDisplayIndicator = "";
var	hbipsDisplayIndicator = "";
var	sepsisDisplayIndicator = "";
var	hsDisplayIndicator = "";
var personnelEncounterRelationCode = "";
var userPersonID = "";
var devLocation = "";
var applicationID = "";
var strFileLocation = "";
var strOutputDevice = "";
var strMrnFin = "";
var strRmBd = "";
var strPtQualind = "";
var painIndicator = "";
var pedPainIndicator = "";
var pSkinIndicator = ""; // ;;004 addition of Pediatric Skin condition
var colNum = 0; //006

//Sorting
var blnSort = false;
var strSortID = "";
var strSortCol = "";
var strSortRev = "";
//condition display sorting
var startCell 	= 0;
var nextCell	= 0;
var amiCell 	= 0;
var hfCell		= 0;
var pnCell 		= 0;
var cacCell		= 0;
var vteCell 	= 0;
var strokeCell	= 0;
var scipCell 	= 0;
var criCell		= 0;
var puCell		= 0;
var fallCell 	= 0;
var pfallCell	= 0;
var painCell 	= 0;
var ppainCell	= 0;
var pskinCell 	= 0;
var immCell		= 0;
var tobCell		= 0;
var subCell		= 0;
var pcCell		= 0;
var hbipsCell	= 0;
var sepsisCell	= 0;
var hsCell		= 0;
var statusAmiCell  = 0;
var statusHfCell  = 0;
var statusPnCell  = 0;
var statusCacCell  = 0;
var statusStkCell  = 0;
var statusScipCell  = 0;
var statusVteCell  = 0;
var hdrtableWdthAdj = 20;

var secObjAr = [];

var hiddenExpandCollapse                = 1;
var hiddenHeartFailureExpandCollapse    = 1;
var hiddenPneumoniaExpandCollapse       = 1;
var hiddenChildrensAsthmaExpandCollapse = 1;
var hiddenVTEExpandCollapse             = 1;
var hiddenStrokeExpandCollapse          = 1;
var hiddenSCIPExpandCollapse            = 1;
var hiddenPressureUlcersExpandCollapse  = 1;
var hiddenCRIExpandCollapse             = 1;
var hiddenFallsExpandCollapse           = 1;
var hiddenFallsPediatricExpandCollapse  = 1;
var hiddenPainExpandCollapse            = 1;
var hiddenPedPainExpandCollapse         = 1;
var hiddenpSkinExpandCollapse           = 1;
var hiddenImmExpandCollapse             = 1;
var hiddenTobExpandCollapse             = 1;
var hiddenSubExpandCollapse             = 1;
var hiddenPCExpandCollapse              = 1;
var hiddenHBIPSExpandCollapse           = 1;
var hiddenSEPSISExpandCollapse          = 1;
var hiddenHSExpandCollapse              = 1;

var tempStr = ""; //used for replacing special characters in i18n strings

function setExpandCollapse(sectionName,value){
    switch (sectionName) {
      case "AMI":
          hiddenExpandCollapse = value;
          return hiddenExpandCollapse;
          break;
      case "HF":
          hiddenHeartFailureExpandCollapse = value;
          return hiddenHeartFailureExpandCollapse;
          break;
      case "PN":
          hiddenPNExpandCollapse = value;
          return hiddenPNExpandCollapse;
          break;
      case "CAC":
          hiddenChildrensAsthmaExpandCollapse = value;
          return hiddenChildrensAsthmaExpandCollapse;
          break;
      case "VTE":
          hiddenVTEExpandCollapse = value;
          return hiddenVTEExpandCollapse;
          break;
      case "STK":
          hiddenStrokeExpandCollapse = value;
          return hiddenStrokeExpandCollapse;
          break;
      case "SCIP":
          hiddenSCIPExpandCollapse = value;
          return hiddenSCIPExpandCollapse;
          break;
      case "IMM":
          hiddenImmExpandCollapse = value;
          return hiddenImmExpandCollapse;
          break;
      case "Tob":
          hiddenTobExpandCollapse = value;
          return hiddenTobExpandCollapse;
          break;
      case "Sub":
          hiddenSubExpandCollapse = value;
          return hiddenSubExpandCollapse;
          break;
      case "PC":
          hiddenPCExpandCollapse = value;
          return hiddenPCExpandCollapse;
          break;
      case "HBIPS":
          hiddenHBIPSExpandCollapse = value;
          return hiddenHBIPSExpandCollapse;
          break;
      case "SEPSIS":
          hiddenSEPSISExpandCollapse = value;
          return hiddenSEPSISExpandCollapse;
          break;
      case "HS":
          hiddenHSExpandCollapse = value;
          return hiddenHSExpandCollapse;
          break;
    }    
}
/**
 * @author CC009905
 * Assigns a cell number to condtions for default display location
 */
function condDisplaySort()
{
	if(strRmBd ==1)
	{
		startCell = parseInt(4);
	}
	else
	{
		startCell = parseInt(3);
	}
	//which condition is first
	if(amiDisplayIndicator == 1)
	{
		amiCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));//number of columns plus one
	}
	else if(heartFailureDisplayIndicator == 1)
	{
		hfCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(pneumoniaDisplayIndicator == 1)
	{
		pnCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(cacDisplayIndicator == 1)
	{
		cacCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(vteDisplayIndicator == 1)
	{
		vteCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(strokeDisplayIndicator == 1)
	{
		strokeCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(scipDisplayIndicator == 1)
	{
		scipCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(pressureUlcerDisplayIndicator == 1)
	{
		puCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(3));
	}
	else if(criDisplayIndicator == 1)
	{
		criCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(3));
	}
	else if(fallsDisplayIndicator == 1)
	{
		fallCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(3));
	}
	else if(pediatricFallsDisplayIndicator == 1)
	{
		pfallCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(3));
	}
	else if(painIndicator == 1)
	{
		painCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(3));
	}
	else if(pedPainIndicator == 1)
	{
		ppainCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(3));
	}
	else if(pSkinIndicator == 1)
	{
		pskinCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(4));
	}
	else if(immDisplayIndicator == 1)
	{
		immCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(tobDisplayIndicator == 1)
	{
		tobCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(subDisplayIndicator == 1)
	{
		subCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(pcDisplayIndicator == 1)
	{
		pcCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(hbipsDisplayIndicator == 1)
	{
		hbipsCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(sepsisDisplayIndicator == 1)
	{
		sepsisCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}
	else if(hsDisplayIndicator == 1){
		hsCell = parseInt(startCell);
		nextCell+= (parseInt(startCell)+parseInt(6));
	}

	for(i = 2; i <= numberOfConditions; i++)
	{
		if(amiDisplayIndicator == i)
		{
			amiCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(heartFailureDisplayIndicator == i)
		{
			hfCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(pneumoniaDisplayIndicator == i)
		{
			pnCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(cacDisplayIndicator == i)
		{
			cacCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(vteDisplayIndicator == i)
		{
			vteCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(strokeDisplayIndicator == i)
		{
			strokeCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(scipDisplayIndicator == i)
		{
			scipCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(pressureUlcerDisplayIndicator == i)
		{
			puCell = parseInt(nextCell);
			nextCell += parseInt(3);
		}
		else if(criDisplayIndicator == i)
		{
			criCell = parseInt(nextCell);
			nextCell += parseInt(3);
		}
		else if(fallsDisplayIndicator == i)
		{
			fallCell = parseInt(nextCell);
			nextCell += parseInt(3);
		}
		else if(pediatricFallsDisplayIndicator == i)
		{
			pfallCell = parseInt(nextCell);
			nextCell += parseInt(3);
		}
		else if(painIndicator == i)
		{
			painCell = parseInt(nextCell);
			nextCell += parseInt(3);
		}
		else if(pedPainIndicator == i)
		{
			ppainCell = parseInt(nextCell);
			nextCell += parseInt(3);
		}
		else if(pSkinIndicator == i)
		{
			pskinCell = parseInt(nextCell);
			nextCell += parseInt(4);
		}
		else if(immDisplayIndicator == i)
		{
			immCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(tobDisplayIndicator == i)
		{
			tobCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(subDisplayIndicator == i)
		{
			subCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(pcDisplayIndicator == i)
		{
			pcCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(hbipsDisplayIndicator == i)
		{
			hbipsCell = parseInt(nextCell);
			nextCell += parseInt(6);
		}
		else if(sepsisDisplayIndicator == i)
		{
			sepsisCell = parseInt(nextCell);
			nextCell+= parseInt(6);
		}
		else if(hsDisplayIndicator == i){
			hsCell = parseInt(nextCell);
			nextCell+= parseInt(6);
		}
	}

	//validate that all conditions are set appropriately
	if(amiDisplayIndicator > 0 && amiCell == 0)
	{
		amiDisplayIndicator = 0 ;
	}
	if(heartFailureDisplayIndicator > 0 && hfCell == 0)
	{
		heartFailureDisplayIndicator = 0;
	}
	if(pneumoniaDisplayIndicator > 0 && pnCell == 0)
	{
		pneumoniaDisplayIndicator = 0;
	}
	if(cacDisplayIndicator > 0 && cacCell == 0)
	{
		cacDisplayIndicator = 0;
	}
	if(vteDisplayIndicator > 0 && vteCell == 0)
	{
		vteDisplayIndicator = 0;
	}
	if(strokeDisplayIndicator > 0 && strokeCell == 0)
	{
		strokeDisplayIndicator  = 0;
	}
	if(scipDisplayIndicator > 0 && scipCell == 0)
	{
		scipDisplayIndicator = 0;
	}
	if(pressureUlcerDisplayIndicator > 0 && puCell == 0)
	{
		pressureUlcerDisplayIndicator = 0;
	}
	if(criDisplayIndicator > 0 && criCell == 0)
	{
		criDisplayIndicator = 0;
	}
	if(fallsDisplayIndicator > 0 && fallCell == 0)
	{
		fallsDisplayIndicator = 0;
	}
	if(pediatricFallsDisplayIndicator > 0 && pfallCell == 0)
	{
		pediatricFallsDisplayIndicator = 0;
	}
	if(painIndicator > 0 && painCell == 0)
	{
		painIndicator = 0;
	}
	if(pedPainIndicator > 0 && ppainCell == 0)
	{
		pedPainIndicator = 0;
	}
	if(pSkinIndicator > 0 && pskinCell == 0 )
	{
		pSkinIndicator = 0;
	}
	if(immDisplayIndicator > 0 && immCell == 0 )
	{
		immDisplayIndicator = 0;
	}
	if(tobDisplayIndicator > 0 && tobCell == 0 )
	{
		tobDisplayIndicator = 0;
	}
	if(subDisplayIndicator > 0 && subCell == 0 )
	{
		subDisplayIndicator = 0;
	}
	if(pcDisplayIndicator > 0 && pcCell == 0 )
	{
		pcDisplayIndicator = 0;
	}
	if(hbipsDisplayIndicator > 0 && hbipsCell == 0 )
	{
		hbipsDisplayIndicator = 0;
	}
	if(sepsisDisplayIndicator > 0 && sepsisCell == 0 )
	{
		sepsisDisplayIndicator = 0;
	}
	if(hsDisplayIndicator > 0 && hsCell == 0 ){
		hsDisplayIndicator = 0;
	}
}
/**
* Displays tool tip when hovering over an icon.
* @param {String} tooltipId Contains the value "gentooltip".
* @param {String} txt Contains id (this.id) for the element.
* @param {String} val Not used.
* @param {String} posX Not used.
* @param {String} posY Not used.
*/
function txtToolTip_reveal(tooltipId,txt,val,posX,rowId)
{
	var browserName = "";
	var x = "";
	var y = "";
	var curmousex = "";
	var curmousey = "";

	try
	{
		if (txt > " " && txt.toLowerCase() != "<table></table>") {
			browserName = getBrowserName();

			it = document.getElementById(tooltipId);
			it.style.left = '';
			it.style.right = '';
			it.style.top = '';
			it.style.bottom = '';

			it.innerHTML = txt;

			switch (browserName.toLowerCase()) {
				case "firefox":
					x = event.pageX + document.body.scrollLeft + document.documentElement.scrollLeft;
					y = event.pageY + document.body.scrollTop + document.documentElement.scrollTop;
					curmousex = event.pageX;
					curmousey = event.pageY;
					break;
				case "msie":
					x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					x = parseInt(x) - parseInt(235);
					y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
					if (rowId > 4)
					{
						y = y - 150;
					}
					curmousex = event.clientX;
					curmousey = event.clientY;

					break;
			}

			it.style.top = y;
			it.style.left = x;

			//set the width to accomodate a vertical scroll bar if needed
			it.style.width = "225px";

			//set the hover height to ensure a scroll bar appears if data to display could go off screen
			it.style.height = "150px";

			it.style.visibility = "visible";
		}
	}
	catch (error)
	{
		showErrorMessage(error.message,"txtToolTip_reveal","","");
	}
}
/**
* Hides tool tip.
* @param {String} id Contains the value "gentooltip".
*/
function txtToolTip_hide(id)
{
	try
	{
		it = document.getElementById(id);
		it.style.visibility= "hidden";
	}
	catch (error)
	{
		showErrorMessage(error.message,"txtToolTip_hide","","");
	}
}
/**
* Validates which web browser that is used. Returns MSIE or Firefox.
* @return{String}
*/
function getBrowserName()
{
	try
	{
		//Validate Browser Name.
		if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0)
		{
			return "MSIE";
		}
		if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent))
		{
			return "Firefox";
		}
	}
	catch (error)
	{
		showErrorMessage(error.message,"getBrowserName","","");
	}
}
/**
* This function will be executed when the user clicks on the links Expand all or Collapse all. All sections will be expanded or collapsed.
* @param {Integer} intExpandCollapse Contains 0 or 1. 0 means that the user has clicked on the link Collapse All. 1 means that the user has
* clicked on the link Expand All.
*/
function verifyExpandCollapse(intExpandCollapse)
{
	try
	{
		//0 = Collapse All.
		//1 = Expand All.
		//Expand or collapse components.
		if (intExpandCollapse == 1)
		{
			//Display Load Text.
			displayLoadText("expand");
			//Expand all sections.
			setTimeout(expandSections,0);
		}
		else
		{
			//Display Load Text.
			displayLoadText("collapse");
			//Collapse all sections.
			setTimeout(collapseSections,0);
		}
	}
	catch (error)
	{
		showErrorMessage(error.message,"verifyExpandCollapse","","");
	}
}
/**
* Expands the sections unless they are already expanded.
*/
function expandSections()
{
	var intAMIHiddenValue = 0;
	var intHeartFailureHiddenValue = 0;
	var intPneumoniaHiddenValue = 0;
	var intChildrensAsthmaHiddenValue = 0;
	var intVTEHiddenValue = 0;
	var intStrokeHiddenValue = 0;
	var intSCIPHiddenValue = 0;
	var intPressureUlcersHiddenValue = 0;
	var	intCRIHiddenValue = 0;
	var	intFallsHiddenValue = 0;
	var	intFallsPediatricHiddenValue = 0;
	var	intPainHiddenValue = 0;
	var	intPedPainHiddenValue = 0;
	var	intpSkinHiddenValue = 0;	// ;;004 addition of Pediatric Skin condition
	var	intImmHiddenValue = 0;
	var	intTobHiddenValue = 0;
	var	intSubHiddenValue = 0;
	var	intPcHiddenValue = 0;
	var	intHbipsHiddenValue = 0;
	var	intSepsisHiddenValue = 0;
	var	intHSHiddenValue = 0;

	try
	{
		//Get hidden values.
		intAMIHiddenValue = hiddenExpandCollapse;
		intHeartFailureHiddenValue       = hiddenHeartFailureExpandCollapse;
		intPneumoniaHiddenValue          = hiddenPneumoniaExpandCollapse;
		intChildrensAsthmaHiddenValue    = hiddenChildrensAsthmaExpandCollapse;
		intVTEHiddenValue                = hiddenVTEExpandCollapse;
		intStrokeHiddenValue             = hiddenStrokeExpandCollapse;
		intSCIPHiddenValue               = hiddenSCIPExpandCollapse;
		intPressureUlcersHiddenValue     = hiddenPressureUlcersExpandCollapse;
		intCRIHiddenValue                = hiddenCRIExpandCollapse;
		intFallsHiddenValue              = hiddenFallsExpandCollapse;
		intFallsPediatricHiddenValue     = hiddenFallsPediatricExpandCollapse;
		intPainHiddenValue               = hiddenPainExpandCollapse;
		intPedPainHiddenValue            = hiddenPedPainExpandCollapse;
		intpSkinHiddenValue              = hiddenpSkinExpandCollapse; // ;;004 addition of Pediatric Skin condition
		intImmHiddenValue                = hiddenImmExpandCollapse;
		intTobHiddenValue                = hiddenTobExpandCollapse;
		intSubHiddenValue                = hiddenSubExpandCollapse;
		intPcHiddenValue                 = hiddenPCExpandCollapse;
		intHbipsHiddenValue              = hiddenHBIPSExpandCollapse;
		intSepsisHiddenValue             = hiddenSEPSISExpandCollapse;
		intHSHiddenValue                 = hiddenHSExpandCollapse;

		//Verify if the sections are collapsed. If that is the case expand them.
		//AMI
		if (intAMIHiddenValue == 1)
		{
			if (amiDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnAmiCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('AMI');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('AMI');
				}
			}
		}


		//Heart Failure
		if (intHeartFailureHiddenValue == 1)
		{
			if (heartFailureDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnHeartFailureCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('HF');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('HF');
				}
			}
		}
		//Pneumonia
		if (intPneumoniaHiddenValue == 1)
		{
			if (pneumoniaDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnPneumoniaCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('PN');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('PN');
				}
			}
		}
		//Children's Asthma
		if (intChildrensAsthmaHiddenValue == 1)
		{
			if (cacDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnChildrensAsthmaCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('CAC');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('CAC');
				}
			}
		}
		//VTE
		if (intVTEHiddenValue == 1)
		{
			if (vteDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnVTECalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('VTE');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("VTE");
				}
			}
		}
		//Stroke
		if (intStrokeHiddenValue == 1)
		{
			if (strokeDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnStrokeCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection("STK");
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("STK");
				}
			}
		}
		//SCIP
		if (intSCIPHiddenValue == 1)
		{
			if (scipDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnSCIPCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('SCIP');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('SCIP');
				}
			}
		}
		//Pressure Ulcers
		if (intPressureUlcersHiddenValue == 1)
		{
			if (pressureUlcerDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnPressureUlcersCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapsePressureUlcers();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapsePressureUlcers();
				}
			}
		}
		//CRI
		if (intCRIHiddenValue == 1)
		{
			if (criDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnCRICalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseCRI();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseCRI();
				}
			}
		}
		//Falls
		if (intFallsHiddenValue == 1)
		{
			if (fallsDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnFallsCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseFalls();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseFalls();
				}
			}
		}
		//Falls - Pediatric
		if (intFallsPediatricHiddenValue == 1)
		{
			if (pediatricFallsDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnFallsPediatricCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseFallsPediatric();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseFallsPediatric();
				}
			}
		}
		//Pain
		if (intPainHiddenValue == 1)
		{
			if (painIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnPainCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapsePain();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapsePain();
				}
			}
		}
		//Pain - Pediatric
		if (intPedPainHiddenValue == 1)
		{
			if (pedPainIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnPedPainCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapsePedPain();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapsePedPain();
				}
			}
		}
		//Skin Pediatric  // ;;004 addition of Pediatric Skin condition
		if (intpSkinHiddenValue == 1)
		{
			if (pSkinIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnpSkinCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapsepSkin();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapsepSkin();
				}
			}
		}
		//Imm
		if (intImmHiddenValue == 1)
		{
			if (immDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnImmCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('Imm');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('Imm');
				}
			}
		}
		//Tob
		if (intTobHiddenValue == 1)
		{
			if (tobDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnTobCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('Tob');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('Tob');
				}
			}
		}
		//Sub
		if (intSubHiddenValue == 1)
		{
			if (subDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnSubCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('Sub');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('Sub');
				}
			}
		}

		//PC
		if (intPcHiddenValue == 1)
		{
			if (pcDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnPcCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('PC');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('PC');
				}
			}
		}
		//HBIPS
		if (intHbipsHiddenValue == 1)
		{
			if (hbipsDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnHbipsCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('HBIPS');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('HBIPS');
				}
			}
		}

		//SEPSIS
		if (intSepsisHiddenValue == 1)
		{
			if (sepsisDisplayIndicator > 0) // ==1) 005 3.3 enhancements
			{
				if (blnSepsisCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('SEPSIS');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('SEPSIS');
				}
			}
		}

		//HS
		if (intHSHiddenValue == 1){
			if (hsDisplayIndicator > 0) {
				if (blnHSCalled == false){
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1){
						expandCollapseSection('HS');
					}
					else{
						getTimer();
					}
				}
				else{
					expandCollapseSection('HS');
				}
			}
		}

		//Hide Load Text.
		setTimeout("hideLoadText()",hideLoadTextDelay);
	}
	catch (error)
	{
		showErrorMessage(error.message,"expandSections","","");
	}
}
/**
* Collapses the sections unless they are already collapsed.
*/
function collapseSections()
{
	var intAMIHiddenValue = 0;
	var intHeartFailureHiddenValue = 0;
	var intPneumoniaHiddenValue = 0;
	var intChildrensAsthmaHiddenValue = 0;
	var intVTEHiddenValue = 0;
	var intStrokeHiddenValue = 0;
	var intSCIPHiddenValue = 0;
	var intPressureUlcersHiddenValue = 0;
	var	intCRIHiddenValue = 0;
	var	intFallsHiddenValue = 0;
	var	intFallsPediatricHiddenValue = 0;
	var	intPainHiddenValue = 0;
	var	intPedPainHiddenValue = 0;
	var	intpSkinHiddenValue = 0;	// ;;004 addition of Pediatric Skin condition
	var	intImmHiddenValue = 0;
	var	intTobHiddenValue = 0;
	var	intSubHiddenValue = 0;
	var	intPcHiddenValue = 0;
	var	intHbipsHiddenValue = 0;
	var	intSepsisHiddenValue = 0;
	var	intHSHiddenValue = 0;

	try
	{
		//Get hidden values.
		intAMIHiddenValue              = hiddenExpandCollapse;
		intHeartFailureHiddenValue     = hiddenHeartFailureExpandCollapse;
		intPneumoniaHiddenValue        = hiddenPneumoniaExpandCollapse;
		intChildrensAsthmaHiddenValue  = hiddenChildrensAsthmaExpandCollapse;
		intVTEHiddenValue              = hiddenVTEExpandCollapse;
		intStrokeHiddenValue           = hiddenStrokeExpandCollapse;
		intSCIPHiddenValue             = hiddenSCIPExpandCollapse;
		intPressureUlcersHiddenValue   = hiddenPressureUlcersExpandCollapse;
		intCRIHiddenValue              = hiddenCRIExpandCollapse;
		intFallsHiddenValue            = hiddenFallsExpandCollapse;
		intFallsPediatricHiddenValue   = hiddenFallsPediatricExpandCollapse;
		intPainHiddenValue             = hiddenPainExpandCollapse;
		intPedPainHiddenValue          = hiddenPedPainExpandCollapse;
		intpSkinHiddenValue            = hiddenpSkinExpandCollapse; // ;;004 addition of Pediatric Skin condition
		intImmHiddenValue              = hiddenImmExpandCollapse;
		intTobHiddenValue              = hiddenTobExpandCollapse;
		intSubHiddenValue              = hiddenSubExpandCollapse;
		intPcHiddenValue               = hiddenPCExpandCollapse;
		intHbipsHiddenValue            = hiddenHBIPSExpandCollapse;
		intSepsisHiddenValue           = hiddenSEPSISExpandCollapse;
		intHSHiddenValue               = hiddenHSExpandCollapse;


		//Verify if the section is already collapsed.
		//AMI
		if (intAMIHiddenValue == 0)
		{
			if (amiDisplayIndicator > 0) // 005 ==1)
			{
				if (blnAmiCalled == false)
				{
				//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('AMI');
					}
					else
					{
						getTimer();
					}

				}
				else {
					expandCollapseSection('AMI');
					}
			}
		}
		//Heart Failure
		if (intHeartFailureHiddenValue == 0)
		{
			if (heartFailureDisplayIndicator >0) // 005 ==1)
			{
				if (blnHeartFailureCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('HF');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('HF');
				}
			}
		}
		//Pneumonia
		if (intPneumoniaHiddenValue == 0)
		{
			if (pneumoniaDisplayIndicator >0) // 005 ==1)
			{
				if (blnPneumoniaCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('PN');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('PN');
				}
			}
		}
		//Children's Asthma
		if (intChildrensAsthmaHiddenValue == 0)
		{
			if (cacDisplayIndicator >0) // 005 ==1)
			{
				if (blnChildrensAsthmaCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('CAC');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('CAC');
				}
			}
		}
		//VTE
		if (intVTEHiddenValue == 0)
		{
			if (vteDisplayIndicator >0) // 005 ==1)
			{
				if (blnVTECalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection("VTE");
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("VTE");
				}
			}
		}
		//Stroke
		if (intStrokeHiddenValue == 0)
		{
			if (strokeDisplayIndicator >0) // 005 ==1)
			{
				if (blnStrokeCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection("STK");
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("STK");
				}
			}
		}
		//SCIP
		if (intSCIPHiddenValue == 0)
		{
			if (scipDisplayIndicator >0) // 005 ==1)
			{
				if (blnSCIPCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection('SCIP');
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection('SCIP');
				}
			}
		}
		//Pressure Ulcers
		if (intPressureUlcersHiddenValue == 0)
		{
			if (pressureUlcerDisplayIndicator >0) // 005 ==1)
			{
				if (blnPressureUlcersCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapsePressureUlcers();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapsePressureUlcers();
				}
			}
		}
		//CRI
		if (intCRIHiddenValue == 0)
		{
			if (criDisplayIndicator >0) // 005 ==1)
			{
				if (blnCRICalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseCRI();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseCRI();
				}
			}
		}
		//Falls
		if (intFallsHiddenValue == 0)
		{
			if (fallsDisplayIndicator >0) // 005 ==1)
			{
				if (blnFallsCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseFalls();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseFalls();
				}
			}
		}
		//Falls - Pediatric
		if (intFallsPediatricHiddenValue == 0)
		{
			if (pediatricFallsDisplayIndicator >0) // 005 ==1)
			{
				if (blnFallsPediatricCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseFallsPediatric();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseFallsPediatric();
				}
			}
		}
		//Pain
		if (intPainHiddenValue == 0)
		{
			if (painIndicator >0) // 005 ==1)
			{
				if (blnPainCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapsePain();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapsePain();
				}
			}
		}
		//Pain - Pediatric
		if (intPedPainHiddenValue == 0)
		{
			if (pedPainIndicator >0) // 005 ==1)
			{
				if (blnPedPainCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapsePedPain();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapsePedPain();
				}
			}
		}
		//Skin Pediatric  // ;;004 addition of Pediatric Skin condition
		if (intpSkinHiddenValue == 0)
		{
			if (pSkinIndicator >0) // 005 ==1)
			{
				if (blnpSkinCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapsepSkin();
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapsepSkin();
				}
			}
		}
		//Imm
		if (intImmHiddenValue == 0)
		{
			if (immDisplayIndicator >0) // 005 ==1)
			{
				if (blnImmCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection("Imm");
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("Imm");
				}
			}
		}
		//Tob
		if (intTobHiddenValue == 0)
		{
			if (tobDisplayIndicator >0) // 005 ==1)
			{
				if (blnTobCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection("Tob");
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("Tob");
				}
			}
		}
		//Sub
		if (intSubHiddenValue == 0)
		{
			if (subDisplayIndicator >0) // 005 ==1)
			{
				if (blnSubCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection("Sub");
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("Sub");
				}
			}
		}
		//PC
		if (intPcHiddenValue == 0)
		{
			if (pcDisplayIndicator >0) // 005 ==1)
			{
				if (blnPcCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection("PC");
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("PC");
				}
			}
		}
		//HBIPS
		if (intHbipsHiddenValue == 0)
		{
			if (hbipsDisplayIndicator >0) // 005 ==1)
			{
				if (blnHbipsCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection("HBIPS");
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("HBIPS");
				}
			}
		}
		//SEPSIS
		if (intSepsisHiddenValue == 0)
		{
			if (sepsisDisplayIndicator >0) // 005 ==1)
			{
				if (blnSepsisCalled == false)
				{
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1)
					{
						expandCollapseSection("SEPSIS");
					}
					else
					{
						getTimer();
					}
				}
				else
				{
					expandCollapseSection("SEPSIS");
				}
			}
		}
		//HS
		if (intHSHiddenValue == 0){
			if (hsDisplayIndicator >0){
				if (blnHSCalled == false){
					//Verify which value the patient indicator has.
					//0 = Both qualifying and non qualifying patients.
					//1 = Only qualifying patients.
					if (strPtQualind == 1){
						expandCollapseSection("HS");
					}
					else{
						getTimer();
					}
				}
				else{
					expandCollapseSection("HS");
				}
			}
		}
		//Hide Load Text.
		setTimeout("hideLoadText()",hideLoadTextDelay);
	}
	catch (error)
	{
		showErrorMessage(error.message,"collapseSections","","");
	}
}
/**
* Launches the Modal Order Entry Window in PowerChart.
* @param {String} patientID Patient ID.
* @param {String} encounterID Encounter ID.
*/
function launchModalOrderEntryWindow(patientID,encounterID)
{
	var alink = "";
	var jlink = "";

	try
	{
		//alink = 'javascript:MPAGES_EVENT("ORDERS","' + patientID + '|' + encounterID + '|{ORDER|0|0|0|0|0}|0|{2|127}{3|127}|8|0")';
		alink = 'javascript:MPAGES_EVENT("ORDERS","' + patientID + '|' + encounterID + '|{ORDER|0|0|0|0|0}|24|{2|127}{3|127}|8|0");'+'refreshParentWindow();';

		if(document.getElementById("hrefLaunchTab"))
		{
			document.body.removeChild(document.getElementById("hrefLaunchTab"));
		}
		jlink =  document.createElement("<a>");
		jlink.id = "hrefLaunchTab";
		jlink.href = alink;
		document.body.appendChild(jlink);
		document.getElementById("hrefLaunchTab").click();

	}
	catch (error)
	{
		showErrorMessage(error.message,"launchModalOrderEntryWindow","","");
	}
}
/**
* Launches the Modal Order Entry Window in PowerChart.
* @param {String} patientID Patient ID.
* @param {String} encounterID Encounter ID.
*/
function launchAseessModalOrderEntryWindow(patientID,encounterID)
{
	var alink = "";
	var jlink = "";

	try
	{
		//alink = 'javascript:MPAGES_EVENT("ORDERS","' + patientID + '|' + encounterID + '|{ORDER|0|0|0|0|0}|0|{2|127}{3|127}|8|0")';
		alink = 'javascript:MPAGES_EVENT("ORDERS","' + patientID + '|' + encounterID + '|{ORDER|0|0|0|0|0}|24|{2|127}{3|127}|8|0");'+'refreshParentWindow();';

		if(document.getElementById("hrefLaunchTab"))
		{
			document.body.removeChild(document.getElementById("hrefLaunchTab"));
		}
		jlink =  document.createElement("<a>");
		jlink.id = "hrefLaunchTab";
		jlink.href = alink;
		document.body.appendChild(jlink);
		document.getElementById("hrefLaunchTab").click();
		//Refreshes the Parent Window.
		refreshParentWindow();
		//Close Window.
		window.close();
	}
	catch (error)
	{
		showErrorMessage(error.message,"launchAssessModalOrderEntryWindow","","");
	}
}
/**
* Launches the tab Orders in PowerChart.
* @param {String} patientID Patient ID.
* @param {String} encounterID Encounter ID.
*/
function launchOrders(patientID,encounterID)
{
	var alink = "";
	var tabNameOrders = "Orders";
	var jlink = "";

	try
	{

		//jw014069: Changed applink from being hardcoded to powerchart.exe to instead use variable containing currently running clone
		alink = 'javascript:APPLINK(0,"$APP_AppName$","/PERSONID=' + patientID + ' /ENCNTRID=' + encounterID + ' /FIRSTTAB=^' + tabNameOrders + '^");';

		if(document.getElementById("hrefLaunchTab"))
		{
			document.body.removeChild(document.getElementById("hrefLaunchTab"));
		}
		jlink =  document.createElement("<a>");
		jlink.id = "hrefLaunchTab";
		jlink.href = alink;
		document.body.appendChild(jlink);
		document.getElementById("hrefLaunchTab").click();
	}
	catch (error)
	{
		showErrorMessage(error.message,"launchOrders","","");
	}
}
/**
* Launches the tab Orders in PowerChart.
* @param {String} patientID Patient ID.
* @param {String} encounterID Encounter ID.
* @param {String} triggerName Name of the Trigger.
* @param {String} freeTextParam Free text parameter.
*/
function launchRule(patientID,encounterID,triggerName,freeTextParam)
{
	var alink = "";
	var jlink = "";

	try
	{
		alink = 'javascript:CCLLINK("eks_call_synch_event"' + ',"^COMMITRULE^,^' + patientID + '^,^' + encounterID + '^,^0.0^,^' + triggerName
	          + "^,^" + freeTextParam + "^" + '",1)';

		if(document.getElementById("hrefLaunchAdvisor"))
		{
			document.body.removeChild(document.getElementById("hrefLaunchAdvisor"));
		}
		jlink =  document.createElement("<a>");
		jlink.id = "hrefLaunchAdvisor";
		jlink.href = '#';
		jlink.onclick = function(){
			window.open(alink);
		}
		document.body.appendChild(jlink);
		document.getElementById("hrefLaunchAdvisor").click();
		//Refreshes the Parent Window.
		refreshParentWindow();
		//Close Window.
		window.close();
	}
	catch (error)
	{
		showErrorMessage(error.message,"launchRule","","");
	}
}

/**
* Refreshes the parent window.
*/
function refreshParentWindow()
{
	var jlink = "";

	try
	{
		if(document.getElementById("hrefRefreshParentWindow"))
		{
			document.body.removeChild(document.getElementById("hrefRefreshParentWindow"));
		}
		jlink =  document.createElement("<a>");
		jlink.id = "hrefRefreshParentWindow";
		jlink.href = '#';
		jlink.onclick = function(){
			top.opener.location.reload(true);
		}
		document.body.appendChild(jlink);
		document.getElementById("hrefRefreshParentWindow").click();
	}
	catch(error)
	{
		showErrorMessage(error.message,"refreshParentWindow","","");
	}
}
/**
* Launches a new instance of PowerForm. Since it is a new instance of PowerForm the call is a little bit different
* compared to if the PowerForm already exists.
* @param {String} patientID Patient ID.
* @param {String} encounterID Encounter ID.
* @param {String} formID The Form ID for the PowerForm to be viewed or modified.
*/
function launchPowerForm(patientID,encounterID,formID)
{
	var alink = "";
	var jlink = "";

	try
	{
		alink = 'javascript:MPAGES_EVENT("POWERFORM","' + patientID + "|" + encounterID + "|" + formID + "|0|0" + '");';

		if(document.getElementById("hrefLaunchPowerForm"))
		{
			document.body.removeChild(document.getElementById("hrefLaunchPowerForm"));
		}
		jlink =  document.createElement("<a>");
		jlink.id = "hrefLaunchPowerForm";
		jlink.href = alink;
		document.body.appendChild(jlink);
		document.getElementById("hrefLaunchPowerForm").click();
	}
	catch (error)
	{
		showErrorMessage(error.message,"launchPowerForm","","");
	}
}
/**
* Launches tab in PowerChart.
* @param {String} tabName Tab Name.
* @param {String} patientID Patient ID.
* @param {String} encounterID Encounter ID.
*/
function launchTab(tabName,patientID,encounterID)
{
	var tName = "";
	tName = tabName.toString();
	tName = tName.replace(/\//g,'');

        tName = decodeURIComponent(tName);
	var alink = "";
	var jlink = "";

	try
	{
		//jw014069: Changed applink from being hardcoded to powerchart.exe to instead use variable containing currently running clone
		alink = 'javascript:APPLINK(0,"$APP_AppName$","/PERSONID=' + patientID + ' /ENCNTRID=' + encounterID + ' /FIRSTTAB=^' + tName + '^");';

		if(document.getElementById("hrefLaunchTab"))
		{
			document.body.removeChild(document.getElementById("hrefLaunchTab"));
		}
		jlink =  document.createElement("<a>");
		jlink.id = "hrefLaunchTab";
		jlink.href = alink;
		document.body.appendChild(jlink);
		document.getElementById("hrefLaunchTab").click();
	}
	catch (error)
	{
		showErrorMessage(error.message,"launchTab","","");
	}
}

/**
* Launches the tab Patient Information in PowerChart.
* @param {String} patientID Patient ID.
* @param {String} encounterID Encounter ID.
*/
function launchTab2(patientID,encounterID)
{
	var alink = "";
	var tabName = "Patient Information";
	var jlink = "";

	try
	{
		//jw014069: Changed applink from being hardcoded to powerchart.exe to instead use variable containing currently running clone
		alink = 'javascript:APPLINK(0,"$APP_AppName$","/PERSONID=' + patientID + ' /ENCNTRID=' + encounterID + ' /FIRSTTAB=^' + tabName + '^");';

		if(document.getElementById("hrefLaunchTab"))
		{
			document.body.removeChild(document.getElementById("hrefLaunchTab"));
		}
		jlink =  document.createElement("<a>");
		jlink.id = "hrefLaunchTab";
		jlink.href = alink;
		document.body.appendChild(jlink);
		document.getElementById("hrefLaunchTab").click();
	}
	catch (error)
	{
		showErrorMessage(error.message,"launchTab2","","");
	}
}

/**
* Clears and sets a timer that is used when the section AMI or the section Heart Failure are not activated.
*/
function getExpandedTimer()
{
	var intTotal 		= 0;
	var isItHidden 		= "";
	var strStoredAMI 	= "";
	var strStoredHF 	= "";
	var strStoredPN 	= "";
	var strStoredCAC 	= "";
	var strStoredSTK 	= "";
	var strStoredSCIP 	= "";
	var strStoredVTE 	= "";
	var strStoredFalls 	= "";
	var strStoredPfall 	= "";
	var strStoredCRI 	= "";
	var strStoredPain 	= "";
	var strStoredPpain 	= "";
	var strStoredPU 	= "";
	var strStoredPskin 	= "";
	var strStoredImm 	= "";
	var strStoredTob 	= "";
	var strStoredSub 	= "";
	var strStoredPc 	= "";
	var strStoredHbips 	= "";
	var strStoredSepsis	= "";
	var strStoredHS		= "";

	var ruNext			= 0;
	try
	{
		//Clear Time Out.
		clearTimeout(intTimeOutID2);
		//Verify how many number of times we need to loop.

		intTotal = parseInt(intActiveComponentCounter) //total # of columns


		//Verify if two sections have already been collapsed.
		if (intDefaultExpanded < intTotal)
		{

			//Do this again in 2 seconds.
			intTimeOutID2 = setTimeout("getExpandedTimer()",2000);
			ruNext = (parseInt(intDefaultExpanded)+ parseInt(1) );
			if (requestAsync) {
			// A request is in progress, so don't make another one.
			}
			else {
				//First default section to open
				//AMI

				if (amiDisplayIndicator == ruNext) //005 3.3 enhancements
				{
					if (blnAmiCalled == false) {
						strStoredAMI = Windowstorage.get("AmiHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredAMI == 0) {
							//Change Hidden Value.
							hiddenExpandCollapse = 1;
							//blnAmiCalled = false;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}

						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredAMI == 1  || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredAMI == 1  || ruNext <= colNum) //006
						{
							var oSecObj = new Object();
		 					oSecObj.cclProg = "dc_mp_get_ami";
							oSecObj.strSectionName = 'AMI'
							oSecObj.secDisplayNm = i18n.condDisp.AMI;
							hiddenExpandCollapse = 1;
		 					getSection(oSecObj);
		 					blnAmiCalled == true;
						}

					}
				}

				//Heart Failure
				else if (heartFailureDisplayIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnHeartFailureCalled == false) {
						strStoredHF = Windowstorage.get("HfHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredHF == 0) {
							//Change Hidden Value.
							hiddenHeartFailureExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredHF == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredHF == 1 || ruNext <= colNum)	//006
						{
							var oSecObj = new Object();
		 					oSecObj.cclProg = "dc_mp_get_hf";
							oSecObj.strSectionName = "hf"
							oSecObj.secDisplayNm = i18n.condDisp.HEART_FAILURE;
							hiddenHeartFailureExpandCollapse = 1;
		 					getSection(oSecObj);
		 					blnHeartFailureCalled == true;
						}

					}
				}

			//Pneumonia
			else if (pneumoniaDisplayIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnPneumoniaCalled == false) {
						strStoredPN = Windowstorage.get("PnHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredPN == 0) {
							//Change Hidden Value.
							hiddenPneumoniaExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredPN == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredPN == 1 || ruNext <= colNum) //006
						{
							var oSecObj = new Object();
		 					oSecObj.cclProg = "dc_mp_get_pn";
							oSecObj.strSectionName = "pn"
							oSecObj.secDisplayNm = i18n.condDisp.PNEUMONIA;
							hiddenPneumoniaExpandCollapse = 1;
		 					getSection(oSecObj);
		 					blnPneumoniaCalled == true;
						}
					}
				}

				//Children's Asthma
				else if (cacDisplayIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnChildrensAsthmaCalled == false) {
						strStoredCAC = Windowstorage.get("CacHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredCAC == 0) {
							//Change Hidden Value.
							hiddenChildrensAsthmaExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredCAC == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredCAC == 1 || ruNext <= colNum) //006
						{
							var oSecObj = new Object();
		 					oSecObj.cclProg = "dc_mp_get_cac";
							oSecObj.strSectionName = "cac"
							oSecObj.secDisplayNm = i18n.condDisp.CHILDRENS_ASTHMA;
							hiddenChildrensAsthmaExpandCollapse = 1;
		 					getSection(oSecObj);
		 					blnChildrensAsthmaCalled == true;
						}

					}
				}
				//VTE
				else if (vteDisplayIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnVTECalled == false) {
						strStoredVTE = Windowstorage.get("VteHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredVTE == 0) {
							//Change Hidden Value.
							hiddenVTEExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if (strStoredVTE == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
							else if (strStoredVTE == 1 || ruNext <= colNum) //006
							{
								var oSecObj = new Object();
			 					oSecObj.cclProg = "dc_mp_get_vte";
								oSecObj.strSectionName = "vte"
								oSecObj.secDisplayNm = i18n.condDisp.VTE;
								hiddenVTEExpandCollapse = 1;
			 					getSection(oSecObj);
			 					blnVTECalled == true;
							}
					}
				}
				//Stroke
				else if (strokeDisplayIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnStrokeCalled == false) {
						strStoredSTK = Windowstorage.get("StrokeHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredSTK == 0) {
							//Change Hidden Value.
							hiddenStrokeExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredSTK == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredSTK == 1 || ruNext <= colNum)
						{
							var oSecObj = new Object();
		 					oSecObj.cclProg = "dc_mp_get_stroke";
							oSecObj.strSectionName = "stk"
							oSecObj.secDisplayNm = i18n.condDisp.STROKE;
							hiddenStrokeExpandCollapse = 1;
		 					getSection(oSecObj);
		 					blnStrokeCalled == true;
						}

					}
				}
				//SCIP
				else if (scipDisplayIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnSCIPCalled == false) {
						strStoredSCIP = Windowstorage.get("ScipHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredSCIP == 0) {
							//Change Hidden Value.
							hiddenSCIPExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredSCIP == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredSCIP == 1 || ruNext <= colNum) //006
						{
							var oSecObj = new Object();
		 					oSecObj.cclProg = "dc_mp_get_scip";
							oSecObj.strSectionName = "SCIP"
							oSecObj.secDisplayNm = i18n.condDisp.SCIP;
							hiddenSCIPExpandCollapse = 1;
		 					getSection(oSecObj);
		 					blnSCIPCalled == true;
						}
					}
				}
				//Pressure Ulcers
				else if (pressureUlcerDisplayIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnPressureUlcersCalled == false) {
						strStoredPU = Windowstorage.get("PuHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredPU == 0) {
							//Change Hidden Value.
							hiddenPressureUlcersExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredPU == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredPU == 1 || ruNext <= colNum) //006
						{
							getPressureUlcers();
						}
					}
				}
				//CRI
				else if (criDisplayIndicator == ruNext) // 005 3.3 enhancements
				{

					if (blnCRICalled == false) {
						strStoredCRI = Windowstorage.get("CriHidden");

						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredCRI == 0) {
							//Change Hidden Value.
							hiddenPneumoniaExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredCRI == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredCRI == 1 || ruNext <= colNum) //006
						{
							getCRI();
						}
					}
				}
				//Falls
				else if (fallsDisplayIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnFallsCalled == false) {
						strStoredFalls = Windowstorage.get("FallsHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredFalls == 0) {
							//Change Hidden Value.
							hiddenFallsExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredFalls == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredFalls == 1 || ruNext <= colNum) //006
						{
							getFalls();
						}
					}
				}
				//Falls - Pediatric
				else if (pediatricFallsDisplayIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnFallsPediatricCalled == false) {
						strStoredPfall = Windowstorage.get("PfallHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredPfall == 0) {
							//Change Hidden Value.
							hiddenFallsPediatricExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredPfall == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredPfall == 1 || ruNext <= colNum) //006
						{
							getFallsPediatric();
						}
					}
				}
				//Pain
				else if (painIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnPainCalled == false) {
						strStoredPain = Windowstorage.get("PainHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredPain == 0) {
							//Change Hidden Value.
							hiddenPainExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredPain == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredPain == 1 || ruNext <= colNum) //006
						{
							getPain();
						}
					}
				}
				//Pain - Pediatric
				else if (pedPainIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnPedPainCalled == false) {
						strStoredPpain = Windowstorage.get("PpainHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredPpain == 0) {
							//Change Hidden Value.
							hiddenPedPainExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredPpain == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredPpain == 1 || ruNext <= colNum) //006
						{
							getPedPain();
						}
					}
				}
				//Skin Pediatric // ;;004 addition of Pediatric Skin condition
				else if (pSkinIndicator == ruNext) // 005 3.3 enhancements
				{
					if (blnpSkinCalled == false) {
						strStoredPskin = Windowstorage.get("PskinHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredPskin == 0) {
							//Change Hidden Value.
							hiddenpSkinExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}
						// expanded on refresh or one of first two conditions to default open
						//006 else if(strStoredPskin == 1 || ruNext < 3)

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredPskin == 1 || ruNext <= colNum) //006
						{
							getpSkin();
						}
					}
				}
				else if (immDisplayIndicator == ruNext)
				{
					if (blnImmCalled == false) {
						strStoredImm = Windowstorage.get("immHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredImm == 0) {
							//Change Hidden Value.
							hiddenImmExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredImm == 1 || ruNext <= colNum) //006
						{
							var oSecObject = new Object();
		 					oSecObject.cclProg = "dc_mp_get_imm";
							oSecObject.strSectionName = "Imm"
							oSecObject.secDisplayNm = i18n.condDisp.IMM;
							getSection(oSecObject);
						}
					}
				}
				else if (tobDisplayIndicator == ruNext)
				{
					if (blnTobCalled == false) {
						strStoredTob = Windowstorage.get("tobHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredTob == 0) {
							//Change Hidden Value.
							hiddenTobExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredTob == 1 || ruNext <= colNum) //006
						{
							var oSecObject = new Object();
		 					oSecObject.cclProg = "dc_mp_get_tob";
							oSecObject.strSectionName = "Tob"
							oSecObject.secDisplayNm = i18n.condDisp.TOB;
							getSection(oSecObject);
						}
					}
				}
				else if (subDisplayIndicator == ruNext)
				{
					if (blnSubCalled == false) {
						strStoredSub = Windowstorage.get("subHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredSub == 0) {
							//Change Hidden Value.
							hiddenSubExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredSub == 1 || ruNext <= colNum) //006
						{
							var oSecObject = new Object();
		 					oSecObject.cclProg = "dc_mp_get_sub";
							oSecObject.strSectionName = "Sub"
							oSecObject.secDisplayNm = i18n.condDisp.SUB;
							getSection(oSecObject);
						}
					}
				}
				else if (pcDisplayIndicator == ruNext)
				{
					if (blnPcCalled == false) {
						strStoredPc = Windowstorage.get("pcHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredPc == 0) {
							//Change Hidden Value.
							hiddenPCExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredPc == 1 || ruNext <= colNum) //006
						{
							var oSecObject = new Object();
		 					oSecObject.cclProg = "dc_mp_get_pc";
							oSecObject.strSectionName = "PC"
							oSecObject.secDisplayNm = i18n.condDisp.PC;
							getSection(oSecObject);
						}
					}
				}
				else if (hbipsDisplayIndicator == ruNext)
				{
					if (blnHbipsCalled == false) {
						strStoredHbips = Windowstorage.get("hbipsHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredHbips == 0) {
							//Change Hidden Value.
							hiddenHBIPSExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredHbips == 1 || ruNext <= colNum) //006
						{
							var oSecObject = new Object();
		 					oSecObject.cclProg = "dc_mp_get_hbips";
							oSecObject.strSectionName = "HBIPS"
							oSecObject.secDisplayNm = i18n.condDisp.HBIPS;
							getSection(oSecObject);
						}
					}
				}
				else if (sepsisDisplayIndicator == ruNext)
				{
					if (blnSepsisCalled == false) {
						strStoredSepsis = Windowstorage.get("sepsisHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredSepsis == 0) {
							//Change Hidden Value.
							hiddenSEPSISExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredSepsis == 1 || ruNext <= colNum) //006
						{
							var oSecObject = new Object();
		 					oSecObject.cclProg = "dc_mp_get_sepsis";
							oSecObject.strSectionName = "SEPSIS"
							oSecObject.secDisplayNm = i18n.condDisp.SEPSIS;
							getSection(oSecObject);
						}
					}
				}
				else if (hsDisplayIndicator == ruNext){
					if (blnHSCalled == false) {
						strStoredHS = Windowstorage.get("hsHidden");
						//0 = Was collapsed.
						//1 = Was expanded.
						if (strStoredHS == 0) {
							//Change Hidden Value.
							hiddenHSExpandCollapse = 1;
							intDefaultExpanded = parseInt(intDefaultExpanded) + 1;
						}

						//expanded on refresh or less than or equal two default value 006
						else if(strStoredHS == 1 || ruNext <= colNum){
							var oSecObject = new Object();
		 					oSecObject.cclProg = "dc_mp_get_hs";
							oSecObject.strSectionName = "HS"
							oSecObject.secDisplayNm = i18n.condDisp.HS;
							getSection(oSecObject);
						}
					}
				}
			}
		}
	}
	catch (error)
	{
		showErrorMessage(error.message,"getExpandedTimer","","");
	}
}
/**
* Clears and sets a timer.
*/
function getTimer()
{
	var intSectionCounter = 0;
	try
	{
			//Clear Time Out.
		    clearTimeout(intTimeOutID);
			intSectionCounter = parseInt(intActiveComponentCounter)
			if(blnSort == true)
			{
				intSectionCounter += parseInt(1)
			}

		if ( intDefaultExpanded < intSectionCounter ) {


			//Do this again in 2 seconds.
			intTimeOutID = setTimeout("getTimer()", 2000);

			if (requestAsync) {
			// A request is in progress, so don't make another one.
			}
			else {
				//Start a new asynchronous request.

				if (blnAmiCalled == false) {
					if (amiDisplayIndicator > 0) //005 3.3 enhancements
					{
						var oSecObj = new Object();
	 					oSecObj.cclProg = "dc_mp_get_ami";
						oSecObj.strSectionName = 'AMI'
						oSecObj.secDisplayNm = i18n.condHdr.AMI;
						hiddenExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnAmiCalled == true;
					}
					else {
						blnAmiCalled = true;
					}
				}
				else if (blnHeartFailureCalled == false) {
					if (heartFailureDisplayIndicator > 0) // ==1) 005 3.3 enhancements
					{
						var oSecObj = new Object();
	 					oSecObj.cclProg = "dc_mp_get_hf";
						oSecObj.strSectionName = "hf"
						oSecObj.secDisplayNm = i18n.condDisp.HEART_FAILURE;
						hiddenHeartFailureExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnHeartFailureCalled == true;
					}
					else {
						blnHeartFailureCalled = true;
					}
				}
				else if (blnPneumoniaCalled == false) {
					if (pneumoniaDisplayIndicator > 0) {
						var oSecObj = new Object();
	 					oSecObj.cclProg = "dc_mp_get_pn";
						oSecObj.strSectionName = "pn"
						oSecObj.secDisplayNm = i18n.condDisp.PNEUMONIA;
						hiddenPneumoniaExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnPneumoniaCalled == true;
					}
					else {
						blnPneumoniaCalled = true;
					}
				}
				else if (blnChildrensAsthmaCalled == false) {
					if (cacDisplayIndicator > 0) // ==1) 005 3.3 enhancements
					{
						var oSecObj = new Object();
			 			oSecObj.cclProg = "dc_mp_get_cac";
						oSecObj.strSectionName = "cac"
						oSecObj.secDisplayNm = i18n.condDisp.CHILDRENS_ASTHMA;
						hiddenChildrensAsthmaExpandCollapse = 1;
			 			getSection(oSecObj);
			 			blnChildrensAsthmaCalled == true;
					}
					else {
						blnChildrensAsthmaCalled = true;
					}
				}
				else if (blnVTECalled == false) {
					if (vteDisplayIndicator > 0) // ==1) 005 3.3 enhancements
					{
						var oSecObj = new Object();
				 		oSecObj.cclProg = "dc_mp_get_vte";
						oSecObj.strSectionName = "vte"
						oSecObj.secDisplayNm = i18n.condDisp.VTE;
						hiddenVTEExpandCollapse = 1;
				 		getSection(oSecObj);
				 		blnVTECalled == true;
					}
					else {
						blnVTECalled = true;
					}
				}
				else if (blnStrokeCalled == false) {
					if (strokeDisplayIndicator > 0) // ==1) 005 3.3 enhancements
					{
						var oSecObj = new Object();
					 	oSecObj.cclProg = "dc_mp_get_stroke";
						oSecObj.strSectionName = "stk"
						oSecObj.secDisplayNm = i18n.condDisp.STROKE;
						hiddenStrokeExpandCollapse = 1;
					 	getSection(oSecObj);
					 	blnStrokeCalled == true;
					}
					else {
						blnStrokeCalled = true;
					}
				}
				else if (blnSCIPCalled == false) {
					if (scipDisplayIndicator > 0) // ==1) 005 3.3 enhancements
					{
						var oSecObj = new Object();
						oSecObj.cclProg = "dc_mp_get_scip";
						oSecObj.strSectionName = "SCIP"
						oSecObj.secDisplayNm = i18n.condDisp.SCIP;
						hiddenSCIPExpandCollapse = 1;
						getSection(oSecObj);
						blnSCIPCalled == true;
					}
					else {
						blnSCIPCalled = true;
					}
				}
				else if (blnPressureUlcersCalled == false) {
					if (pressureUlcerDisplayIndicator > 0) // ==1) 005 3.3 enhancements
					{
						getPressureUlcers();
					}
					else {
						blnPressureUlcersCalled = true;
					}
				}
				else if (blnCRICalled == false) {

					if (criDisplayIndicator > 0) // ==1) 005 3.3 enhancements
					{
						getCRI();
					}
					else {
						blnCRICalled = true;
					}
				}
				else if (blnFallsCalled == false) {
					if (fallsDisplayIndicator > 0) // ==1) 005 3.3 enhancements
					{
						getFalls();
					}
					else {
						blnFallsCalled = true;
					}
				}
				else if (blnFallsPediatricCalled == false) {
					if (pediatricFallsDisplayIndicator > 0) // ==1) 005 3.3 enhancements
					{
						getFallsPediatric();
					}
					else {
						blnFallsPediatricCalled = true;
					}
				}
				else if (blnPainCalled == false) {
					if (painIndicator > 0) // ==1) 005 3.3 enhancements
					{
						getPain();
					}
					else {
						blnPainCalled = true;
					}
				}
				else if (blnPedPainCalled == false) {
					if (pedPainIndicator > 0) // ==1) 005 3.3 enhancements
					{
						getPedPain();
					}
					else {
						blnPedPainCalled = true;
					}
				}
				else if (blnpSkinCalled == false) {
					if (pSkinIndicator > 0) // ==1) 005 3.3 enhancements
					{
						getpSkin();
					}
					else {
						blnpSkinCalled = true;
					}
				}
				else if (blnImmCalled == false) {
					if (immDisplayIndicator > 0)
					{
						var oSecObj = new Object();
	 					oSecObj.cclProg = "dc_mp_get_imm";
						oSecObj.strSectionName = "Imm"
						oSecObj.secDisplayNm = i18n.condDisp.IMM;
						hiddenImmExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnImmCalled == true;
					}
					else {
						blnImmCalled = true;
					}
				}
				else if (blnTobCalled == false) {
					if (tobDisplayIndicator > 0)
					{
						var oSecObj = new Object();
	 					oSecObj.cclProg = "dc_mp_get_tob";
						oSecObj.strSectionName = "Tob"
						oSecObj.secDisplayNm = i18n.condDisp.TOB;
						hiddenTobExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnTobCalled == true;
					}
					else {
						blnTobCalled = true;
					}
				}
				else if (blnSubCalled == false) {
					if (subDisplayIndicator > 0)
					{
						var oSecObj = new Object();
	 					oSecObj.cclProg = "dc_mp_get_sub";
						oSecObj.strSectionName = "Sub"
						oSecObj.secDisplayNm = i18n.condDisp.SUB;
						hiddenSubExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnSubCalled == true;
					}
					else {
						blnSubCalled = true;
					}
				}
				else if (blnPcCalled == false) {
					if (pcDisplayIndicator > 0)
					{
						var oSecObj = new Object();																	 					oSecObj.cclProg = "dc_mp_get_pc";
	 					oSecObj.cclProg = "dc_mp_get_pc";
						oSecObj.strSectionName = "PC";
						oSecObj.secDisplayNm = i18n.condDisp.PC;
						hiddenPCExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnPcCalled == true;
					}
					else {
						blnPcCalled = true;
					}
				}
				else if (blnHbipsCalled == false) {
					if (hbipsDisplayIndicator > 0)
					{
						var oSecObj = new Object();
	 					oSecObj.cclProg = "dc_mp_get_hbips";
						oSecObj.strSectionName = "HBIPS"
						oSecObj.secDisplayNm = i18n.condDisp.HBIPS;
						hiddenHBIPSExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnHbipsCalled == true;
					}
					else {
						blnHbipsCalled = true;
					}
				}
				else if (blnSepsisCalled == false) {
					if (sepsisDisplayIndicator > 0)
					{
						var oSecObj = new Object();
	 					oSecObj.cclProg = "dc_mp_get_sepsis";
						oSecObj.strSectionName = "SEPSIS"
						oSecObj.secDisplayNm = i18n.condDisp.SEPSIS;
						hiddenSEPSISExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnSepsisCalled == true;
					}
					else {
						blnSepsisCalled = true;
					}
				}
				else if (blnHSCalled == false) {
					if (hsDisplayIndicator > 0){
						var oSecObj = new Object();
	 					oSecObj.cclProg = "dc_mp_get_hs";
						oSecObj.strSectionName = "HS"
						oSecObj.secDisplayNm = i18n.condDisp.HS;
						hiddenHSExpandCollapse = 1;
	 					getSection(oSecObj);
	 					blnHSCalled == true;
					}
					else {
						blnHSCalled = true;
					}
				}
			}//requestAsync
		}
	}
	catch (error)
	{
		showErrorMessage(error.message,"getTimer","","");
	}
}
/**
* Removes leading whitespaces from a string and then returns it.
* @param {String} value Contains a String value.
* @return {String}
*/
function LTrim(value)
{
	var re = /\s*((\S+\s*)*)/;
	return value.replace(re, "$1");
}
/**
* Removes ending whitespaces from a string and then returns it.
* @param {String} value Contains a String value.
* @return {String}
*/
function RTrim(value)
{
	var re = /((\s*\S+)*)\s*/;
	return value.replace(re, "$1");
}
/**
* Removes leading and ending whitespaces from a string and then returns it.
* @param {String} value Contains a String value.
* @return {String}
*/
function trim(value)
{
	return LTrim(RTrim(value));
}
/**
* Displays loading text.
* @param {String} strSectionName Contains section name.
*/
function displayLoadText(strSectionName)
{
	var strLoadingText = "";
	var ajaxLoader = "url(..\\img\\ajax-loader.gif)";
	try
	{
		//Verify which section it is.
		switch (strSectionName.toLowerCase())
		{
		case "pd":
			strLoadingText = "<b>"+i18n.LOADING_PATIENT_DEMOGRAPHICS+"</b>";
			break;
		case "ami":
			strLoadingText = "<b>"+i18n.LOADING_AMI+"</b>";
			break;
		case "hf":
			strLoadingText = "<b>"+i18n.LOADING_HF+"</b>";
			break;
		case "pn":
			strLoadingText = "<b>"+i18n.LOADING_PN+"</b>";
			break;
		case "cac":
			tempStr = i18n.LOADING_CAC.replace("-", "&#39;")
			strLoadingText = "<b>"+i18n.LOADING_CAC+"</b>";
			break;
		case "vte":
			strLoadingText = "<b>"+i18n.LOADING_VTE+"</b>";
			break;
		case "stk":
			strLoadingText = "<b>"+i18n.LOADING_STK+"</b>";
			break;
		case "scip":
			strLoadingText = "<b>"+i18n.LOADING_SCIP+"</b>";
			break;
		case "pulcer":
			strLoadingText = "<b>"+i18n.LOADING_PRES_ULCERS+"</b>";
			break;
		case "cri":
			strLoadingText = "<b>"+i18n.LOADING_CRI+"</b>";
			break;
		case "fall":
			strLoadingText = "<b>"+i18n.LOADING_FALLS+"</b>";
			break;
		case "pfall":
			strLoadingText = "<b>"+i18n.LOADING_FALLS_PED+"</b>";
			break;
		case "pain":
			strLoadingText = "<b>"+i18n.LOADING_PAIN+"</b>";
			break;
		case "pedpain":
			strLoadingText = "<b>"+i18n.LOADING_PAIN_PED+"</b>";
			break;
		case "pskin":
			strLoadingText = "<b>Loading Pediatric Skin...</b>";
			break;
		case "collapse":
			strLoadingText = "<b>"+i18n.COLLAPSING_ALL+"</b>";
			break;
		case "expand":
			strLoadingText = "<b>"+i18n.EXPANDING_ALL+"</b>";
			break;
		case "sortname":
			strLoadingText = "<b>"+i18n.SORT_BY_NAME+"</b>";
			break;
		case "sortbirth":
			strLoadingText = "<b>"+i18n.SORT_BY_DOB+"</b>";
			break;
		case "sortfin":
			strLoadingText = "<b>"+i18n.SORT_BY_FIN+"</b>";
			break;
		case "sortmrn":
			strLoadingText = "<b>"+i18n.SORT_BY_MRN+"</b>";
			break;
		case "sortroombed":
			strLoadingText = "<b>"+i18n.SORT_BY_ROOM_BED+"</b>";
			break;
		case "sortstatus":
			strLoadingText = "<b>"+i18n.SORT_BY_STATUS+"</b>";
			break;
		case "nextpage":
			strLoadingText = "<b>"+i18n.LOADING_NEXT_PAGE+"</b>";
			break;
		case "previouspage":
			strLoadingText = "<b>"+i18n.LOADING_PREV_PAGE+"</b>";
			break;
		case "all":
			strLoadingText = "<b>"+i18n.LOADING_ALL_COLS+"</b>";
			break;
		case "imm":
			strLoadingText = "<b>"+i18n.LOADING_IMM+"</b>";
			break;
		case "tob":
			strLoadingText = "<b>"+i18n.LOADING_TOB+"</b>";
			break;
		case "sub":
			strLoadingText = "<b>"+i18n.LOADING_SUB+"</b>";
			break;
		case "pc":
			strLoadingText = "<b>"+i18n.LOADING_PC+"</b>";
			break;
		case "hbips":
			strLoadingText = "<b>"+i18n.LOADING_HBIPS+"</b>";
			break;
		case "sepsis":
			strLoadingText = "<b>"+i18n.LOADING_SEPSIS+"</b>";
			break;
		case "hs":
			strLoadingText = "<b>"+i18n.LOADING_HS+"</b>";
			break;
		}
		//Display Load Text.
		document.getElementById("divHelpText").innerHTML = strLoadingText;
		document.getElementById("divHelpTextImage").style.backgroundImage = ajaxLoader;
		document.getElementById("divHelpTextImage").style.backgroundRepeat = "no-repeat";
	}
	catch (error)
	{
		showErrorMessage(error.message,"displayLoadText","","");
	}
}

/**
* This function displays the previous page.
*/
function displayPreviousPage()
{
	var strPageOf = "";
	var blnPreviousDemographics = false;

	try
	{
		if (currentPage>1)
		{
			//Change current page.
			currentPage -= 1;
			PopulatePatientInfo(currentPage);

					if (strPtQualind == 0)
					{
						getExpandedTimer();
					}

				//Get number of pages.
				strPageOf += i18n.PAGE;
				strPageOf += currentPage;
				strPageOf += ' of ';
				strPageOf += pageCNT;
				strPageOf += '&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;';
				//Assign HTML.
				document.getElementById("spanPageOf").innerHTML = strPageOf;
		}
	}
	catch (error)
	{
		showErrorMessage(error.message,"displayPreviousPage","","");
	}
}
/**
* This function displays the next page.
*/
function displayNextPage()
{
	var strPageOf = "";
	var blnNextDemographics = false;

	try
	{
		//currentPage += 1;
		if (currentPage < pageCNT)
		{
			currentPage += 1;
			PopulatePatientInfo();
				if (strPtQualind == 0)
				{
					getExpandedTimer();
				}

			strPageOf += i18n.PAGE;
			strPageOf += currentPage;
			strPageOf += ' of ';
			strPageOf += pageCNT;
			strPageOf += '&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;';

			//Assign HTML.
			document.getElementById("spanPageOf").innerHTML = strPageOf;
		}
		//}
	}
	catch (error)
	{
		showErrorMessage(error.message,"displayNextPage","","");
	}

}
/**
* Displays version text.
*/
function displayVersionText()
{
	var strVersionText = "Version 4.2";  // 007 version 4.1
	try
	{
		//Display Load Text.
		document.getElementById("divHelpText").innerHTML = strVersionText;
	}
	catch (error)
	{
		showErrorMessage(error.message,"displayVersionText","","");
	}
}
/**
* Verifies which mouse button the user has clicked on. Returns True if the user has clicked on the right mouse button else it returns False.
* @param {Object} e The mouse event.
* @return {Boolean}
*/
function verifyMouseButton(e)
{
	var rightclick = false;

	try
	{
		if (!e)
		{
			var e = window.event;
		}
		if (e.which)
		{
			rightclick = (e.which == 3);
		}
		else if (e.button)
		{
			rightclick = (e.button == 2);
		}
	}
	catch (error)
	{
		showErrorMessage(error.message,"verifyMouseButton","","");
		rightclick = false
	}
	return rightclick;
}
/**
* Hides loading text.
*/
function hideLoadText()
{
	//Hide Load Text.
	document.getElementById("divHelpText").innerHTML = "";
	document.getElementById("divHelpTextImage").style.backgroundImage = "none";
}

/**
* Sorts the HTML table. Some of the column headers are links and when the user clicks on one of these links the table will be sorted after that column. For example if the
* user clicks on the column header "Date Of Birth" the HTML table will be sorted after Date Of Birth. Note: the name column (index 1) is used as a secondary sort column and
* always sorted in ascending order. Returns True if everything went well else it returns False.
* @return {Boolean}
*/
/*
function getSortedTable()
{

	var blnStatus = true;
	var tblEl = "";
	var oldDsply = "";
	var tmpEl;
	var i;
	var j;
	var minVal;
	var minIdx;
	var testVal;
	var cmp;
	var tempValue = "";
	var blnDateBirthType = false;
	var id = "";
	var col = "";
	var rev = "";

	try
	{
		//Get values from global variables.
		//id = ID of the TABLE, TBODY, THEAD or TFOOT element to be sorted.
		//col = Index of the column to sort, 0 = first column, 1 = second column, etc.
		//rev = If true, the column is sorted in reverse (descending) order.
		id = strSortID;
		col = strSortCol;
		rev = strSortRev;
		//Verify if the sort call comes from the column Date of Birth.
		if (col == 1)
		{
			blnDateBirthType = true;
		}
		else
		{
			blnDateBirthType = false;
		}

		//Get the table or table section to sort.
		tblEl = document.getElementById(id);

	  	//The first time this function is called for a given table, set up an
	  	//array of reverse sort flags.
	  	if (tblEl.reverseSort == null)
		{
	    	tblEl.reverseSort = new Array();
	    	// Also, assume the name column is initially sorted.
	    	tblEl.lastColumn = 1;
	  	}

	  	//If this column has not been sorted before, set the initial sort direction.
	  	if (tblEl.reverseSort[col] == null)
		{
			tblEl.reverseSort[col] = rev;
		}

	  	//If this column was the last one sorted, reverse its sort direction.
	  	if (col == tblEl.lastColumn)
		{
			tblEl.reverseSort[col] = !tblEl.reverseSort[col];
		}

	  	//Remember this column as the last one sorted.
	  	tblEl.lastColumn = col;

	  	//Set the table display style to "none" - necessary for Netscape 6 browsers.
	  	oldDsply = tblEl.style.display;
	  	tblEl.style.display = "none";

	  	//Sort the rows based on the content of the specified column using a selection sort.
	  	//for (i = 0; i < tblEl.rows.length - 1; i++)
		for (i = 0; i < tblEl.rows.length - 1; i = (parseInt(i) + parseInt(2)))
		{
		    //Assume the current row has the minimum value.
		    minIdx = i;

		    minVal = getTextValue(tblEl.rows[i].cells[col]);

			//Loop through the index. Replace [+] with blank.
			while (minVal.indexOf("[+]") > -1)
			{
				minVal = minVal.replace("[+]","");
			}
 			//Loop through the index. Replace [+] with blank.
			while (minVal.indexOf("[-]") > -1)
			{
				minVal = minVal.replace("[-]","");
			}

		    //Search the rows that follow the current one for a smaller value.
		    for (j = i + 2; j < tblEl.rows.length; j = (parseInt(j) + parseInt(2)))
			//for (j = i + 2; j < tblEl.rows.length - 1; j = (parseInt(j) + parseInt(2)))
			{
			  	testVal = getTextValue(tblEl.rows[j].cells[col]);

				//Loop through the index. Replace [+] with blank.
				while (testVal.indexOf("[+]") > -1)
				{
					testVal = testVal.replace("[+]","");
				}
	 			//Loop through the index. Replace [+] with blank.
				while (testVal.indexOf("[-]") > -1)
				{
					testVal = testVal.replace("[-]","");
				}

				cmp = compareValues(minVal,testVal,blnDateBirthType);

			  	//Negate the comparison result if the reverse sort flag is set.
		      	if (tblEl.reverseSort[col])
			  	{
			  		cmp = -cmp;
			  	}

		      	//Sort by the second column (team name) if those values are equal.
		      	if (cmp == 0 && col != 1)
			  	{
					cmp = compareValues(getTextValue(tblEl.rows[minIdx].cells[1]),getTextValue(tblEl.rows[j].cells[1]),blnDateBirthType);
			  	}

		      	//If this row has a smaller value than the current minimum, remember its position and update the current minimum value.
		      	if (cmp > 0)
			  	{
		        	minIdx = j;
		        	minVal = testVal;
		    	}
		    }
		    //By now, we have the row with the smallest value. Remove it from the table and insert it before the current row.
			if (minIdx > i)
			{
		    	tmpEl = tblEl.removeChild(tblEl.rows[minIdx]);
		      	tblEl.insertBefore(tmpEl, tblEl.rows[i]);
			  	tmpEl = tblEl.removeChild(tblEl.rows[minIdx + 1]);
				tblEl.insertBefore(tmpEl, tblEl.rows[i + 1]);
		    }
	  	}
	  	//Format Rows.
		formatRows2g(tblEl);

	  	//Restore the table's display style.
	  	tblEl.style.display = oldDsply;

		//Hide Load Text.
		setTimeout("hideLoadText()",hideLoadTextDelay);
	}
	catch (error)
	{
		showErrorMessage(error.message,"getSortedTable","","");
		blnStatus = false;
	}
	return blnStatus;
}

*/
// This code is necessary for browsers that don't reflect the DOM constants
// (like IE).
if (document.ELEMENT_NODE == null)
{
  document.ELEMENT_NODE = 1;
  document.TEXT_NODE = 3;
}
/**
* Gets text value during a sort.
* @param {String} el ID for the element.
* @return{String}
*/
/*
function getTextValue(el)
{
	var i;
  	var s;

	try
	{
  		//Find and concatenate the values of all text nodes contained within the element.
  		s = "";

		for (i = 0; i < el.childNodes.length; i++)
		{
			if (el.childNodes[i].nodeType == document.TEXT_NODE)
			{
				s += el.childNodes[i].nodeValue;
			}
    		else if (el.childNodes[i].nodeType == document.ELEMENT_NODE && el.childNodes[i].tagName == "BR")
			{
				s += " ";
			}
    		else
			{
				 // Userecursion to get text within sub-elements.
      			s += getTextValue(el.childNodes[i]);
			}
		}
	}
	catch (error)
	{
		showErrorMessage(error.message,"getTextValue","","");
	}
  	return normalizeString(s);
}
*/
/**
* Collapses any multiple whites space and removes leading or trailing white space.
* @param {String} s Text string.
* @return{String}
*/
function normalizeString(s)
{
  s = s.replace(whtSpMult, " ");  // Collapse any multiple whites space.
  s = s.replace(whtSpEnds, "");   // Remove leading or trailing white space.
  return s;
}
/**
* Compares values during a sort.
* @param {String} v1
* @param {String} v2
* @param {Boolean} blnDateBirthType
* @return {Integer}
*/
/*
function compareValues(v1,v2,blnDateBirthType)
{
	var f1;
	var f2;
	var date1;
	var date2;
	var tempdate1;
	var tempdate2;
	var dttmdiff;

	try
  	{
  		//If the values are numeric, convert them to floats.
  		f1 = parseFloat(v1);
  		f2 = parseFloat(v2);


		if (blnDateBirthType == true)
		{
			date1 = v1.split("/");
			date2 = v2.split("/");
			tempdate1 = new Date();
			tempdate2 = new Date();
			dttmdiff = new Date();

			tempdate1.setFullYear(date1[2], date1[0] - 1, date1[1]);
			tempdate2.setFullYear(date2[2], date2[0] - 1, date2[1]);
			dttmdiff.setTime(tempdate1.getTime() - tempdate2.getTime());
			timediff = dttmdiff.getTime();
			days = Math.floor(timediff / (1000 * 60 * 60 * 24));

			if (days > 0)
			{
				return 1;
			}
		 	else
			{
				if (days == 0)
				{
					return 0;
				}
			}
		}
		else
		{
			if (!isNaN(f1) && !isNaN(f2))
			{
	    		v1 = f1;
	    		v2 = f2;
	  		}
	  		//Compare the two values.
	  		if (v1 == v2)
			{
				return 0;
			}
	  		if (v1 > v2)
			{
				return 1;
			}
		}
		return -1;
  	}
  	catch (error)
	{
		showErrorMessage(error.message,"compareValues","","");
	}
}
*/
/**
* Updates the HTML table appearance after a sort.
* @param {Object} tblEl Contains the table object.
*/
/*
function formatRows2g(tblEl)
{
	var i;
  	var rowEl;
	var rowEl2;
	var intNumber = 0;

	try
	{
		for (i = 0; i < tblEl.rows.length - 1; i =(parseInt(i) + parseInt(2)))
		{
			//Add 1 to the counter (Allways start with "white row").
			intNumber = intNumber + 1;

			rowEl = tblEl.rows[i];
		   	rowEl2 = tblEl.rows[i + 1];

		   	if (intNumber % 2 == 0)
		   	{
		   		rowEl.className = "RowTypeBlue mainRow2g";
				rowEl2.className = "RowTypeBlue";
		   	}
		   	else
		   	{
				rowEl.className = "RowTypeWhite mainRow2g";
				rowEl2.className = "RowTypeWhite";
			}
		}
	}
	catch (error)
	{
		showErrorMessage(error.message,"formatRows2g","","");
	}
}
*/
/**
* Displays Error Message.
* @param {String} errorMessage Error Message.
* @param {String} functionName Name of the function where the error occurred.
* @param {String} strStatus The requestAsync status.
* @param {String} strParameters Input parameters that are used to call the CCL script.
*/
function showErrorMessage(errorMessage,functionName,strStatus,strParameters)
{
	var completeErrorMessage = "";
	//Set Error Message.
	completeErrorMessage += "Error Message: ";
	completeErrorMessage += errorMessage;
	completeErrorMessage += "\nFunction: ";
	completeErrorMessage += functionName;
	completeErrorMessage += "\nStatus: ";
	completeErrorMessage += strStatus;
	completeErrorMessage += "\nParameters: ";
	completeErrorMessage += strParameters;
	alert (completeErrorMessage);
}
/**
* This function is needed for using AJAX when a CCL script is called.
*/
function getXMLCclRequest()
{
    var xmlHttp = null;
    if (location.protocol.substr(0, 4) == "http")
	{
		try
		{
			//Firefox, Opera 8.0+, Safari
            xmlHttp = new XMLHttpRequest();
        }
        catch (e)
		{
			//Internet Explorer
            try
			{
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e)
			{
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
    }
    else
	{
        xmlHttp = new XMLCclRequest();
    }
    return xmlHttp;
}
/**
* This function is needed for using AJAX when a CCL script is called.
*/
function getPopupWindowHandle()
{
    return popupWindowHandle;
}
XMLCclRequest = function(options)
				{
	            	/************ Attributes *************/
	                this.onreadystatechange = function() {return null;};
	                this.options = options || {};
	                this.readyState = 0;
	                this.responseText = "";
	                this.status = 0;
	                this.statusText = "";
	                this.sendFlag = false;
	                this.errorFlag = false;
	                this.responseBody = this.responseXML = this.async = true;
	                this.requestBinding = null;
	                this.requestText = null;
	                /************** Events ***************/
	                //Raised when there is an error.
	                this.onerror = /************** Methods **************/
	                //Cancels the current CCL request.
					this.abort =
	             	//Returns the complete list of response headers.
					this.getAllResponseHeaders =
	             	//Returns the specified response header.
					this.getResponseHeader = function(){return null;};

	                //Assigns method, destination URL, and other optional attributes of a pending request.
	                this.open = function(method, url, async)
								{
	                    			if (method.toLowerCase() != "get" && method.toLowerCase() != "post")
									{
	                        			this.errorFlag = true;
	                        			this.status = 405;
	                        			this.statusText = "Method not Allowed";
	                        			return false;
	                    			}
	                    			this.method = method.toUpperCase();
	                    			this.url = url;
	                    			this.async = async != null ? (async ? true : false) : true;
	                    			this.requestHeaders = null;
	                    			this.responseText = "";
	                    			this.responseBody = this.responseXML = null;
	                    			this.readyState = 1;
	                    			this.sendFlag = false;
	                    			this.requestText = "";
	                    			this.onreadystatechange();
	                			};

	                //Sends a CCL request to the server and receives a response.
	                this.send = function(param)
								{
	                    			if (this.readyState != 1)
									{
	                        			this.errorFlag = true;
	                        			this.status = 409;
	                        			this.statusText = "Invalid State";
	                        			return false;
	                    			}
	                    			if (this.sendFlag)
									{
	                        			this.errorFlag = true;
	                        			this.status = 409;
	                        			this.statusText = "Invalid State";
	                        			return false;
	                    			}
	                    			this.sendFlag = true;
	                    			this.requestLen = param.length;
	                    			this.requestText = param;
                                    if(uniqueInt < 99999)
                                    {
                                        uniqueInt = uniqueInt + 1;
                                    }
                                    else
                                    {
                                        uniqueInt = 1;
                                    }
                                    var uniqueId = this.url + "-" + (new Date()).getTime() + "-" + uniqueInt;

	                    			XMLCCLREQUESTOBJECTPOINTER[uniqueId] = this;

	                    			var el = document.getElementById("__ID_CCLLINKHref_11360__");
	                    			el.href = "javascript:XMLCCLREQUEST_Send(\"" + uniqueId + "\"" + ")";
	                    			el.click();
	                			};
	                //Adds custom HTTP headers to the request.
	                this.setRequestHeader = function(name, value)
											{
	                    						if (this.readyState != 1)
												{
	                        						this.errorFlag = true;
	                        						this.status = 409;
	                        						this.statusText = "Invalid State";
	                        						return false;
	                    						}
	                    						if (this.sendFlag)
												{
	                        						this.errorFlag = true;
	                        						this.status = 409;
	                        						this.statusText = "Invalid State";
	                        						return false;
	                    						}
	                    						if (!value)
												{
	                        						return false;
	                    						}
	                    						if (!this.requestHeaders)
												{
	                        						this.requestHeaders = [];
	                    						}
	                    						this.requestHeaders[name] = value;
	                						};
				}
XMLCCLREQUESTOBJECTPOINTER = [];
/**
* This function is needed for using AJAX when a CCL script is called.
*/
function evaluate(x)
{
    return eval(x)
}
/**
* This function is needed for using AJAX when a CCL script is called.
*/
function CCLLINK__(program, param, nViewerType ){}
function CCLLINK(program, param, nViewerType)
{
    if (nViewerType == 0)
	{
        window.open(location.protocol + '//' + location.host + '/discern/mpages/reports/' + program + "?parameters=" + param);
    }
    else
	{
        window.location.href = location.protocol + '//' + location.host + '/discern/mpages/reports/' + program + "?parameters=" + param;
    }
}
/**
* This function is needed for using AJAX when a CCL script is called.
*/
function APPLINK(mode, appname, param)
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
/**
* This function is needed for using AJAX when a CCL script is called.
*/
function MPAGES_EVENT__(eventType, eventParams)
{
}
/**
* This function is needed for using AJAX when a CCL script is called.
*/
function MPAGES_EVENT(eventType, eventParams)
{
    var paramLength = eventParams.length;
    if (paramLength > 2000)
	{
        document.getElementById("__ID_CCLPostParams_32504__").value = '"' + eventParams + '"';
        eventParams = eventParams.substring(0, 2000);
    }
    window.location.href = "javascript:MPAGES_EVENT__('" + eventType + "','" + eventParams + "'," + paramLength + ")";
}
/**
* This function is needed for using AJAX when a CCL script is called.
*/
function ArgumentURL()
{
    this.getArgument = _getArg;
    this.setArgument = _setArg;
    this.removeArgument = _removeArg;
    this.toString = _toString;
    //Allows the object to be printed.
	this.arguments = new Array();

    //Initiation
    var separator = ",";
    var equalsign = "=";
    var str = window.location.search.replace(/%20/g, " ");
    var index = str.indexOf("?");
    var sInfo;
    var infoArray = new Array();
    var tmp;

    if (index != -1)
	{
        sInfo = str.substring(index + 1, str.length);
        infoArray = sInfo.split(separator);
    }
    for (var i = 0; i < infoArray.length; i++)
	{
    	tmp = infoArray[i].split(equalsign);
        if (tmp[0] != "")
		{
        	var t = tmp[0];
            this.arguments[tmp[0]] = new Object();
            this.arguments[tmp[0]].value = tmp[1];
            this.arguments[tmp[0]].name = tmp[0];
        }
    }
    function _toString()
	{
    	var s = "";
        var once = true;
        for (i in this.arguments)
		{
        	if (once)
			{
            	s += "?";
            	once = false;
            }
            s += this.arguments[i].name;
            s += equalsign;
            s += this.arguments[i].value;
            s += separator;
        }
        return s.replace(/ /g, "%20");
    }
    function _getArg(name)
	{
    	if (typeof(this.arguments[name].name) != "string")
        	return null;
        else
            return this.arguments[name].value;
    }
    function _setArg(name, value)
	{
        this.arguments[name] = new Object()
        this.arguments[name].name = name;
        this.arguments[name].value = value;
    }
    function _removeArg(name)
	{
        this.arguments[name] = null;
    }
    return this;
}
