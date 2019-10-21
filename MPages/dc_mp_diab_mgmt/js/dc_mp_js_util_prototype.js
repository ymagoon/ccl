/*~BB~*************************************************************************
      *                                                                       *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
      *                              Technology, Inc.                         *
      *       Revision      (c) 1984-2009 Cerner Corporation                  *
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
 
        Source file name:       dc_mp_js_util_prototype.js
 
        Product:                Discern Content
        Product Team:           Discern Content
 
        File purpose:           Provide prototype functions to various JavaScript data types.
 
        Special Notes:          <add any special notes here>
 
;~DB~**************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                    *
;******************************************************************************
;*                                                                            *
;*Mod Date     	Engineer             Feature      Comment                     *
;*--- -------- 	-------------------- ------------ ----------------------------*
;*000 01/31/10  RB018070             ######       Initial Release             *
;*                                                                            *
;~DE~**************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/

Array.prototype.push = function (element) {
    this[this.length] = element;
    return this.length;
};

Array.prototype.contains = function (element) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == element) {
            return true;
        }
    }
    return false;
};

Array.prototype.remove = function (element) {
	var result = false;
	var array = [];
	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			result = true;
		} else {
			array.push(this[i]);
		}
	}
	this.clear();
	for (var i = 0; i < array.length; i++) {
		this.push(array[i]);
	}
	array = null;
	return result;
};

Array.prototype.clear = function () {
    this.length = 0;
};

String.prototype.trim = function(){
    return this.replace(/^\s*/, "").replace(/\s*$/, "/");
}
String.prototype.padL = function(nLength, sChar){
    var sreturn = this;
    while (sreturn.length < nLength) {
        sreturn = String(sChar) + sreturn;
    }
    return sreturn;
}

