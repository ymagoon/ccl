/** extern healthe-widget-library-1.3.2-min **/

/**~BB~************************************************************************
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
 *  (3) install the Script Source Code in Client's environment.          *
 *  B. Use of the Script Source Code is for Client's internal purposes   *
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
 *     Source Code prior to moving such code into Client's production    *
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
 *     performance of Client's System.                                   *
 *  C. Client waives, releases, relinquishes, and discharges Cerner from *
 *     any and all claims, liabilities, suits, damages, actions, or      *
 *     manner of actions, whether in contract, tort, or otherwise which  *
 *     Client may have against Cerner, whether the same be in            *
 *     administrative proceedings, in arbitration, at law, in equity, or *
 *     mixed, arising from or relating to Client's use of Script Source  *
 *     Code.                                                             *
 * 5. Retention of Ownership                                             *
 *    Cerner retains ownership of all software and source code in this   *
 *    service package. Client agrees that Cerner owns the derivative     *
 *    works to the modified source code. Furthermore, Client agrees to   *
 *    deliver the derivative works to Cerner.                            *
 ~BE~************************************************************************/
/******************************************************************************
 
 Source file name:       dc_mp_js_layout_tab.js
 
 Product:                Discern Content
 Product Team:           Discern Content
 
 File purpose:           Provides the TabLayout class with methods
 to build/load Tab DOM fragments.
 
 Special Notes:          <add any special notes here>
 
 ;~DB~**********************************************************************************
 ;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
 ;**************************************************************************************
 ;*                                                                            		  *
 ;*Mod Date     Engineer             		Feature      Comment                      *
 ;*--- -------- -------------------- 		------------ -----------------------------*
 ;*000 		   RB018070				    	######       Initial Release              *
 ;~DE~**********************************************************************************
 ;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/
/**
 * @author RB018070
 * Reference
 *
 Preference value list:
 
 defaultTab  	 	(Number) 	-	Default tab index to show first ( set to 0 if not specified )
 tabsContainerCSS	(String)	- 	CSS classname for the tabs container
 tabsHeader	  		(Array) 	-	List of display for tabs
 tabsContentDOM  	(Array) 	-	List of DOM nodes to be inserted as tab content
 tabsContentLoad	(Array) 	-	List of functions to call when a tab is opened
 
 
 <UL class=tab-layout-nav>
	 <LI class=tab-layout-active>
	 	<A  href="javascript:void(null);" tab-layout-Index="0"></A>
	 </LI>
	 <LI>
	 	<A href="javascript:void(null);" tab-layout-Index="1"></A>
	 </LI>
	 <LI>
	 	<A href="javascript:void(null);" tab-layout-Index="2"></A>
	 </LI>
 </UL>
 <DIV class="tab-layout-tab " title="">
 
 </DIV>
 <DIV class="tab-layout-tab tab-layout-tabhide" title="">
 
 </DIV>
 <DIV class="tab-layout-tab tab-layout-tabhide" title="">
 
 </DIV>
 
 **/
var TabLayout = function(){

    return {
        activeTabHeader: "",
        activeTabContent: "",
        attachClickEvent: function(tabHdrDOM, tabContentDOM,tabsContentLoad){
            var that = this;
            Util.addEvent(tabHdrDOM, "click", function(){
                // Hide previously active content
                Util.Style.rcss(that.activeTabHeader, "tab-layout-active");
                if (!Util.Style.ccss(that.activeTabContent, "tab-layout-tabhide")) {
                    Util.Style.acss(that.activeTabContent, "tab-layout-tabhide");
                }
                // Show new active content
                if (!Util.Style.ccss(tabHdrDOM, "tab-layout-active")) {
                    Util.Style.acss(tabHdrDOM, "tab-layout-active");
                }
                Util.Style.rcss(tabContentDOM, "tab-layout-tabhide");
				if(tabsContentLoad){
					tabsContentLoad(tabContentDOM);
				}
                that.activeTabHeader = tabHdrDOM;
                that.activeTabContent = tabContentDOM;
            });
        },
        generateLayout: function(prefs){
            var curNode, tabContentLoad,tabsHeader = prefs.tabsHeader, tabsContentDOM = prefs.tabsContentDOM, tabsContainerCSS = prefs.tabsContainerCSS, tabsContentLoad = prefs.tabsContentLoad, defaultTab = prefs.defaultTab ? prefs.defaultTab : 0, tabsWrapperDOM = Util.cep("div", {
                "className": "tab-layout-wrapper"
            }), tabHdrsWrapperDOM = Util.cep("ul", {
                "className": "tab-layout-nav"
            }), tabHdrDOM, tabHdrLinkDOM, tabContentDOM, idx = 0, len, that = this;
            defaultTab = parseInt(defaultTab, 10);
            if (tabsContainerCSS) {
                tabsWrapperDOM.className = tabsContainerCSS;
            }
            Util.ac(tabHdrsWrapperDOM, tabsWrapperDOM);
            if (tabsHeader && tabsHeader.length > 0) {
                for (idx = 0, len = tabsHeader.length; idx < len; idx += 1) {
					// Create Header & Content elements
					tabHdrDOM = Util.cep("li", {
                            "className": "tab-layout-tabhide"
                        });
					tabHdrLinkDOM = Util.cep("a", {
                        "href": "javascript:void(0);",
                        "tab-layout-Index": idx
                    });
                    tabContentDOM = Util.cep("div", {
                        "className": "tab-layout-tab tab-layout-tabhide"
                    });
					
                    // Insert Content element to wrapper				
                    if ((tabsContentDOM && tabsContentDOM[idx]) ||
                    (tabsContentLoad && tabsContentLoad[idx])) {
                        if (tabsContentDOM && tabsContentDOM[idx]) {
                            Util.ac(tabsContentDOM[idx], tabContentDOM);
                        }
                        if (tabsContentLoad && tabsContentLoad[idx]) {
                           tabContentLoad = tabsContentLoad[idx];
                      	}
                        tabContentDOM = Util.ac(tabContentDOM, tabsWrapperDOM);
                    }
                    
					//Handle default selected tab
					if (idx === defaultTab) {
                        Util.Style.acss(tabHdrDOM, "tab-layout-active");
                        Util.Style.rcss(tabContentDOM, "tab-layout-tabhide");
						if(tabContentLoad){
							tabContentLoad(tabContentDOM);
						}						
                        this.activeTabHeader = tabHdrDOM;
                        this.activeTabContent = tabContentDOM;
                    }   
					
					//Build Tab Headers                 
                    tabHdrLinkDOM.innerHTML = tabsHeader[idx];
                    tabHdrLinkDOM = Util.ac(tabHdrLinkDOM, tabHdrDOM);
                    tabHdrDOM = Util.ac(tabHdrDOM, tabHdrsWrapperDOM);
                    this.attachClickEvent(tabHdrDOM, tabContentDOM,tabContentLoad);
                }
            }
            return (tabsWrapperDOM);
        }
    };
};