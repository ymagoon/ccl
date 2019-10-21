/*******************************************************************************
 Name           : uhspa.bannerbar.js
 Author:        : Eric Smith
 Date           : 04/29/2014
 Location       : cust_code
 
 Purpose        : Gets a static list of patient follow up and education
 
 Executed From  : The Followup MPage component
 
********************************************************************************
 History
********************************************************************************
 Ver  By   Date        Ticket   Description
 ---  ---  ----------  -------  ------------
 001  ets  04/29/2014           genesis
 
 End History
*******************************************************************************/

/** @namespace The DC Orders Component */
uhspa.bannerbar = function(){};

/*Standard uhspa component initialization*/
uhspa.bannerbar.prototype = new MPage.Component();
uhspa.bannerbar.prototype.constructor = MPage.Component;
uhspa.bannerbar.prototype.base = MPage.Component.prototype;
uhspa.bannerbar.prototype.name = "uhspa.bannerbar";
uhspa.bannerbar.prototype.cclProgram = "UHS_MPG_GET_PAT_DEMOGRAPH";
uhspa.bannerbar.prototype.cclParams = [];
uhspa.bannerbar.prototype.cclDataType = "JSON";

/**
 * Called when the component is initialized from the framework
 * Sets the default parameters to be sent to the ccl program
 *
 * @author Eric Smith
 */
uhspa.bannerbar.prototype.init = function() {
    this.cclParams[0] = "MINE";
    this.cclParams[1] = this.getProperty("personId");
    this.cclParams[2] = this.getProperty("encounterId");
    insertLinkTag(uhspa.rootPath + "css/uhspa.bannerbar.css");
}

/**
 * Render takes the results of the call to CCL and loads the data
 * into a grid.
 *
 * @author Eric Smith
 */
uhspa.bannerbar.prototype.render = function() {
    var comp = this;
    var target = $(comp.getTarget());
    var sHTML = [];
    target.css('overflow','hidden');
    
    sHTML.push("<div class='uhspa-bannerbar'>");
    
    sHTML.push("<div class='uhspa-bannerbar-col1'>");
    sHTML.push("<div class='uhspa-bannerbar-name'>",comp.data.RREC.NAME_FULL_FORMATTED,"</div>");
    sHTML.push("<div><span class='uhspa-bannerbar-label'>EMR:</span><span class='uhspa-bannerbar-value'>",comp.data.RREC.MRN,"</span></div>");
    sHTML.push("<div><span class='uhspa-bannerbar-label'>FIN:</span><span class='uhspa-bannerbar-value'>",comp.data.RREC.FIN,"</span></div>");
    sHTML.push("</div>");
    
    sHTML.push("<div class='uhspa-bannerbar-col2'>");
    sHTML.push("<div><span class='uhspa-bannerbar-label'>DOB:</span><span class='uhspa-bannerbar-value'>",comp.data.RREC.DOB,"&nbsp;(",comp.data.RREC.AGE,")</span></div>");
    sHTML.push("<div><span class='uhspa-bannerbar-label'>Sex:</span><span class='uhspa-bannerbar-value'>",comp.data.RREC.GENDER,"</span></div>");
    sHTML.push("</div>");
    
    sHTML.push("<div class='uhspa-bannerbar-col3'>");
    sHTML.push("<div><span class='uhspa-bannerbar-label'>Visit Type:</span><span class='uhspa-bannerbar-value'>",comp.data.RREC.ENCOUNTER_TYPE,"</span></div>");
    sHTML.push("<div><span class='uhspa-bannerbar-label'>Location:</span><span class='uhspa-bannerbar-value'>",comp.data.RREC.LOCATION,"</span></div>");
    sHTML.push("<div><span class='uhspa-bannerbar-label'>Attending:</span><span class='uhspa-bannerbar-value'>",comp.data.RREC.ATTENDING,"</span></div>");
    sHTML.push("</div>");
    
    sHTML.push("</div>");
    target.html(sHTML.join(""));
};