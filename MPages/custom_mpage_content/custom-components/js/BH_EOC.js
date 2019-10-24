/* **************************************************************************************************************
    Mod Date            Engineer                Description
    --- --------------- ----------------------- ------------------------------------------------
    1   06/06/2017      Roger Harris            Ticket 119849 - New mPage component for Behavioral Health Episode of Care

****************************************************************************************************************/ 


//*===============-  Behavioral Health Episode of Care starts ---------=============== */
baycarefl.bh_eoc = function(){};
baycarefl.bh_eoc.prototype = new MPage.Component();
baycarefl.bh_eoc.prototype.constructor = MPage.Component();
baycarefl.bh_eoc.prototype.base = MPage.Component.prototype;
baycarefl.bh_eoc.prototype.name = "baycarefl.bh_eoc";
baycarefl.bh_eoc.prototype.cclProgram = "bc_mp_bh_eoc";
baycarefl.bh_eoc.prototype.cclParams = [] ;
baycarefl.bh_eoc.prototype.cclDataType = "JSON";
baycarefl.bh_eoc.prototype.init = function(options)
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

baycarefl.bh_eoc.prototype.render = function()
{
    //Takes the data in this.data and loads it into target
    //alert("In render function");

    var target = this.getTarget();
    var resJSON = this.data.RLIST;
    var output = "<span style='width:98%; text-align: right'>Last 18 months</span>";
    //var output = "<table style='width:98%; '><tr><td style='text-align: right'>Last 18 months</td></tr></table>";

    if (resJSON.REC_CNT === 0) { 
        output += "<table><tr class='bh_eoc_column_headers'><td>No Behavioral Health Episode of Care documented.</td></tr></table>";
    }
    else
    {
        output += "<table style='width: 99%'>"
                + "<tr class='bh_eoc_column_headers' style='height:25px; border:1px solid #dddddd; '>" 
                + "<td class='eoc_agency_col'>Agency</td>"
                + "<td class='eoc_program_col'>Program</td>"
                + "<td class='eoc_author_col'>Author</td>"
                + "<td class='eoc_admit_col'>Admission Date/Time</td>"
                + "<td class='eoc_discharge_col'>Discharge Date/Time</td>"
                + "</tr></table>";
        
        output += "<span class='bh_eoc_section_label'>Open (" + resJSON.OPEN_CNT + ")</span>";
        if (resJSON.OPEN_CNT > 0) {
            output += "<table id='eoc_open' style='width: 99%; border:1px solid #dddddd;'>";
            $.each(resJSON.REC, function(idx, info) {
                var d_dt = new Date(info.DISCH_DT);
                if (info.DISCH_DT == "" || d_dt > Date.now()) {
                    output += "<tr class='bh_eoc_row' "
                            + "title='Encounter Information"
                            + "\n Patient Type:     \t" + info.PT_TYPE
                            + "\n Hospital Service: \t" + info.HOSP_SRVC
                            + "\n Nurse Unit:       \t" + info.NURS_UNIT
                            + "\n\n";
                    
                    $.each(info.INSUR_INFO, function(idy, infoy) {
                        if (idy === 0) {
                            output += "Insurance Information";
                        }
                        output += "\n Plan Name:  \t" + infoy.PLAN_NAME
                                + "\n Insur Name: \t" + infoy.INS_NAME
                                + "\n\n";
                    })
                            
                    output += "'>"
                            + "<td class='eoc_agency_col'>"     + info.AGENCY   + "</td>"
                            + "<td class='eoc_program_col'>"    + info.PROGRAM  + "</td>"
                            + "<td class='eoc_author_col'>"     + info.AUTHOR   + "</td>"
                            + "<td class='eoc_admit_col'>"      + info.ADMIT_DT + "</td>"
                            + "<td class='eoc_discharge_col'>"  + info.DISCH_DT + "</td>";
                }
            })
            output += "</table>";
        } else {
            output += "<br />";
        }


        output += "<span class='bh_eoc_section_label'>Closed (" + resJSON.CLOSED_CNT + ")</span>";
        if (resJSON.CLOSED_CNT > 0) {
            output += "<table id='eoc_closed' style='width: 99%; border:1px solid #dddddd;'>";
            $.each(resJSON.REC, function(idx, info) {
                var d_dt = new Date(info.DISCH_DT);
                if (info.DISCH_DT > "" && d_dt < Date.now()) {
                    output += "<tr class='bh_eoc_row'>"
                            + "<td class='eoc_agency_col'>"     + info.AGENCY   + "</td>"
                            + "<td class='eoc_program_col'>"    + info.PROGRAM  + "</td>"
                            + "<td class='eoc_author_col'>"     + info.AUTHOR   + "</td>"
                            + "<td class='eoc_admit_col'>"      + info.ADMIT_DT + "</td>"
                            + "<td class='eoc_discharge_col'>"  + info.DISCH_DT + "</td>"
                            + "</tr>";
                }
            })
            output += "</table>";
        }
        

        }


    //output = "Episode of Care";
    target.innerHTML = output;

    $("#eoc_open tbody tr:even").css("background-color", "#FFFFFF");
    $("#eoc_open tbody tr:odd").css("background-color", "#E8EBF5");
    $("#eoc_closed tbody tr:even").css("background-color", "#FFFFFF");
    $("#eoc_closed tbody tr:odd").css("background-color", "#E8EBF5");
}

//*===============-  Behavioral Health Episode of Care ends ---------=============== */

