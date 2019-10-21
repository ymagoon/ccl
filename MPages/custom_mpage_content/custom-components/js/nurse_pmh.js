/* **************************************************************************************************************
    Mod Date            Engineer                Description
    --- --------------- ----------------------- ------------------------------------------------
    1   04/04/2017      Roger Harris            Ticket 81664 - New mPage component for Nursing Past Medical History

****************************************************************************************************************/ 


//*===============-  Nursing Past Medical History starts ---------=============== */
baycarefl.nursing_pmh = function(){};
baycarefl.nursing_pmh.prototype = new MPage.Component();
baycarefl.nursing_pmh.prototype.constructor = MPage.Component();
baycarefl.nursing_pmh.prototype.base = MPage.Component.prototype;
baycarefl.nursing_pmh.prototype.name = "baycarefl.nursing_pmh";
baycarefl.nursing_pmh.prototype.cclProgram = "bc_pc_mp_nursing_pmh";
baycarefl.nursing_pmh.prototype.cclParams = [] ;
baycarefl.nursing_pmh.prototype.cclDataType = "JSON";
baycarefl.nursing_pmh.prototype.init = function(options)
{

/* Initialize the cclParams variable */

    var params = [];
    params.push("mine");
    params.push(this.getProperty("userId"));
    params.push(this.getProperty("personId"));
    params.push(this.getProperty("encounterId"));

    this.cclParams = params;
    this.data = "";

}

baycarefl.nursing_pmh.prototype.render = function()
{
    //Takes the data in this.data and loads it into target

    var target = this.getTarget();
    var resJSON = this.data.RLIST;
    var output = "";

    if (resJSON.REC_CNT == 0) { 
        output += "<table><tr><td>No Past Medical History documented.</td></tr></table>";
    }
    else
    {
        output += "<div style='max-height:300px; width:99%; overflow-y:scroll'>"
                + "<table id='tblNursePMH' style='width: 99%'>"

        $.each(resJSON.RESULTS, function(idx, info) {
            output += "<tr style='border: 1px solid #ededed; padding: 5px'><td style='padding-left: 5px'>" 
                    + info.EVNT_TITLE + "</td><td style='padding-left: 5px'>" + info.NOTES + "</td></tr>"
        })
        
        output += "</table></div>";
    }
    
    target.innerHTML = output;
}

//*====================-  Nursing Past Medical History ends ---------=====================*/

