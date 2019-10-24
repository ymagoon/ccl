/*
  Copyright 2011 Cerner Corporation
    
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    
  http://www.apache.org/licenses/LICENSE-2.0
    
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/*Script Statistics source code*/
MPage.namespace("baycarefl");

function launch_docView(temp_person, temp_event_id) {
var dPersonId = temp_person;
var dEventId = temp_event_id;

var objPVViewerMPage = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
objPVViewerMPage.CreateDocViewer(dPersonId);
objPVViewerMPage.AppendDocEvent(dEventId);
objPVViewerMPage.LaunchDocViewer();


						}

function reInitPopUps2(){  
    //add the class of hover to all elements with the class of sum_popup_row  
    $(".sum_popup_row").hover(  
        function(){  
            //copy and clear title attribute  
            if (this.title > " "){  
                this.tip = this.title;  
                this.title = "";  
            }  
            if (this.tip){  
                $('<div id="tooltip">' + this.tip+ '</div>').css({  
                    position: 'absolute',  
                    width: '400px',  
                    top: event.clientY+20,  
                    left: event.clientX+40,  
                    'font-weight': 'bold',  
                    border: '1px solid #BDBDBD',  
                    padding: '10px 10px 10px 10px',  
                    'background-color': '#FFFCE1',  
                    opacity: 1.00  
                }).appendTo("body").fadeIn(0);  
            }  
        },  
        function(){  
            //fires blind remove, doesn't do anything unless the tooltip exists   
            $("#tooltip").remove();            
        }  
    );  
}  
						
		
								
function reInitPopUps()
{
   //add the class of hover to all elements with the class of col2
   $(".col2").hover
   (
    function()
      {
      if (this.tip > " ")
        {
          $('<div id="tooltip">' + this.tip+ '</div>').css( {
            position: 'absolute',
            width: '400px',
            top: event.clientY+20,
            left: event.clientX+40,
            'font-weight': 'bold',
            border: '1px solid #000',
            padding: '10px 10px 10px 10px',
            'background-color': '#ffc',
            opacity: 1.00
            }).appendTo("body").fadeIn(0);
        }
      },
    function(){
	      $("#tooltip").remove();
       }
    
  )
}

//*=====06/15/2017 KLS ================- Baker Act Component Begins  ----------=====*/
baycarefl.baker_act = function(){};
baycarefl.baker_act.prototype = new MPage.Component();
baycarefl.baker_act.prototype.constructor = MPage.Component();
baycarefl.baker_act.prototype.base = MPage.Component.prototype;
baycarefl.baker_act.prototype.name = "baycarefl.baker_act";
baycarefl.baker_act.prototype.cclProgram = "bc_mp_baker_act";
baycarefl.baker_act.prototype.cclParams = [] ;
baycarefl.baker_act.prototype.cclDataType = "JSON";
baycarefl.baker_act.prototype.init = function(options){

	var params = [];
	params.push("mine");
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));


	this.cclParams = params;
	//this.data = ""
}

baycarefl.baker_act.prototype.render = function()
{
	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.TEMP;
	var sTitle = "";
	var output = ""

	var Cur_Person = this.getProperty("personId"); //the current person
	if(resJSON.BA.length === 0)
	{
		sTitle = "No Baker Act found - Selected Visit";
		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
		+ "<table class = 'bc_vte' style='font-size:11px;' width = 100%></table>";
	}
	else
	{
		sTitle = "Selected Visit";
//		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
		output += "<table width = '100%'>"
			+ "<tr class = 'sub-title-disp'>"
			+ "<td width = '33.0%' align = 'left'>Legal Status</td>"
			+ "<td width = '33.0%' align = 'left'>Type of Legal Status</td>"
			+ "<td width = '33.0%' align = 'left'>Expiration Date</td></tr></table>";
//		output += "<div style='max-height:500px;width:100%;overflow-y:scroll'>"
		output += "<div>"
			+ "<table width = 100%>"
		if (resJSON.BA.length > 0){
			$.each(resJSON.BA, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures'>"
				+ "<td width = '33.0%' align = 'left'>" + info.LEGAL_STATUS + "</td>"
				+ "<td width = '33.0%' align = 'left'><span style='color:red;'>" + info.TYPE + "</span></td>"
				+ "<td width = '33.0%' align = 'left'>" + info.EXPIRATION_DATE + "</td></tr>";
			})
		}
		output += "</table></div>";	
	}
	target.innerHTML = output;
}
//*=====05/22/2017 KLS ================- Baker Act Component End  ----------=====*/


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




//*===============-  Nursing Past Medical History starts ---------=============== */
/* **************************************************************************************************************
    Mod Date            Engineer                Description
    --- --------------- ----------------------- ------------------------------------------------
    1   04/04/2017      Roger Harris            Ticket 81664 - New mPage component for Nursing Past Medical History

****************************************************************************************************************/ 

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


/* **************************************************************************************************************
    Mod Date            Engineer                Description
    --- --------------- ----------------------- ------------------------------------------------
    1   05/06/2016      Roger Harris            Ticket 622180 - New mPage component for Cardiology Clinic

*************************************************************************************************************** */

//*=====-  Cardio Clinic Meds starts ---------=====*/
baycarefl.cardio_meds = function(){};
baycarefl.cardio_meds.prototype = new MPage.Component();
baycarefl.cardio_meds.prototype.constructor = MPage.Component();
baycarefl.cardio_meds.prototype.base = MPage.Component.prototype;
baycarefl.cardio_meds.prototype.name = "baycarefl.cardio_meds";
baycarefl.cardio_meds.prototype.cclProgram = "bc_pc_mp_cardio_meds";
baycarefl.cardio_meds.prototype.cclParams = [] ;
baycarefl.cardio_meds.prototype.cclDataType = "JSON";
baycarefl.cardio_meds.prototype.init = function(options)
{

/* Initialize the cclParams variable */

    var params = [];
    params.push("mine");
    params.push(this.getProperty("personId"));
    params.push(this.getProperty("userId"));
    params.push(this.getProperty("encounterId"));

    this.cclParams = params;
    this.data = "";

}

baycarefl.cardio_meds.prototype.render = function()
{
    //Takes the data in this.data and loads it into target

    var target = this.getTarget();
    var resJSON = this.data.RLIST;
    var output = "";

    if((resJSON.CCNT + resJSON.ACNT) === 0)
    {
        output += "<div class = 'ss-res-none' width = '100%'> No Cardiology Medications found </div>";
        target.innerHTML = output;
    }
    else
    {
        if(resJSON.CCNT > 0)
        {
            output += "<div style='max-height:300px; width:99%; overflow-y:scroll'>"
                + "<table id='tblCardMeds'>"
                + "<tr><td colspan='4' style='text-align:left; background-color: #cddcee; border: 1px solid #ededed'>Continuous</td></tr>"
                + "<tr>"
                + "<th width=10px'>&nbsp;</th>"
                + "<th style='width: 65%; font-size: 11px; font-weight: bold; color:black'>Medication</th>"
                + "<th style='width: 25%; font-size: 11px; font-weight: bold; color:black'>Details</th>"
                + "<th style='width: 10%; font-size: 11px; font-weight: bold; color:black'>Start Date/Time</th></tr>";

            for (i = 0; i < resJSON.CCNT; i++)
            {
                var med_name = resJSON.CONTINUOUS[i].MED_NAME;
                var admin_dtls = resJSON.CONTINUOUS[i].ADMIN_DTLS;
                var start_dt = resJSON.CONTINUOUS[i].START_DT;


                output += "<tr>"

                        + "<td width = '10px'>&nbsp;</td>"

                        + "<td align = 'left'>"
                        + med_name
                        + "</td>"

                        + "<td align = 'left'>"
                        + admin_dtls
                        + "</td>"

                        + "<td align = 'left'>"
                        + start_dt
                        + "</td>"

                        //+ "<td align = 'left'>"
                        //+ "NEXT"
                        //+ "</td>"

                        //+ "<td align = 'left'>"
                        //+ "NEXT"
                        //+ "</td>"

                        //+ "<td align = 'left'>"
                        //+ "NEXT"
                        //+ "</td>"

                        + "</tr>";
            }
            output += "</table>";
        }

        if(resJSON.ACNT > 0)
        {
            if(resJSON.CCNT > 0)
            {
                output += "<span>&nbsp;</span>";
            } else {
                output+= "<div style='max-height:200px; width:99%; overflow-y:scroll'>"
            }

            output += "<table id='tblCardMeds'>"
                + "<tr><td colspan='4' style='text-align:left; background-color: #cddcee; border: 1px solid #ededed'>Administered Last 24 hours</td></tr>"
                + "<tr>"
                + "<th width=10px'>&nbsp;</th>"
                + "<th style='width: 65%; font-size: 11px; font-weight: bold; color:black'>Medication</th>"
                + "<th style='width: 25%; font-size: 11px; font-weight: bold; color:black'>Details</th>"
                + "<th style='width: 10%; font-size: 11px; font-weight: bold; color:black'>Start Date/Time</th>";

            for (i = 0; i < resJSON.ACNT; i++)
            {
                var med_name = resJSON.ADMIN24[i].MED_NAME;
                var admin_dtls = resJSON.ADMIN24[i].ADMIN_DTLS;
                var last_admin_dt = resJSON.ADMIN24[i].LAST_ADMIN_DT;


                output += "<tr>"

                        + "<td width = '10px'>&nbsp;</td>"

                        + "<td align = 'left'>"
                        + med_name
                        + "</td>"

                        + "<td align = 'left'>"
                        + admin_dtls
                        + "</td>"

                        + "<td align = 'left'>"
                        + last_admin_dt
                        + "</td>"

                        + "</tr>";
            }
            output += "</table>";
        }

        output += "</div>";
    }
    target.innerHTML = output;

    //$("#tblCardMeds th").css("font-style", "bold");
    //$("#tblCardMeds tbody tr:even").css("background-color", "#E8EBF5");
    //$("#tblCardMeds tbody tr:odd").css("background-color", "#FFFFFF");
    //alert(aryDtls[0].catName);
}

//*====================================-  Cardio Clinic Meds ends ---------=====*/



/* **************************************************************************************************************
    Mod Date            Engineer                Description
    --- --------------- ----------------------- ------------------------------------------------
    1   05/06/2016      Roger Harris            Ticket 622180 - New mPage component for Cardiology Clinic

*************************************************************************************************************** */

//*=====-  Cardio Clinic Meds starts ---------=====*/
baycarefl.cardio_meds = function(){};
baycarefl.cardio_meds.prototype = new MPage.Component();
baycarefl.cardio_meds.prototype.constructor = MPage.Component();
baycarefl.cardio_meds.prototype.base = MPage.Component.prototype;
baycarefl.cardio_meds.prototype.name = "baycarefl.cardio_meds";
baycarefl.cardio_meds.prototype.cclProgram = "bc_pc_mp_cardio_meds";
baycarefl.cardio_meds.prototype.cclParams = [] ;
baycarefl.cardio_meds.prototype.cclDataType = "JSON";
baycarefl.cardio_meds.prototype.init = function(options)
{

/* Initialize the cclParams variable */

    var params = [];
    params.push("mine");
    params.push(this.getProperty("personId"));
    params.push(this.getProperty("userId"));
    params.push(this.getProperty("encounterId"));

    this.cclParams = params;
    this.data = "";

}

baycarefl.cardio_meds.prototype.render = function()
{
    //Takes the data in this.data and loads it into target

    var target = this.getTarget();
    var resJSON = this.data.RLIST;
    var output = "";

    if((resJSON.CCNT + resJSON.ACNT) === 0)
    {
        output += "<div class = 'ss-res-none' width = '100%'> No Cardiology Medications found </div>";
        target.innerHTML = output;
    }
    else
    {
        if(resJSON.CCNT > 0)
        {
            output += "<div style='max-height:300px; width:99%; overflow-y:scroll'>"
                + "<table id='tblCardMeds'>"
                + "<tr><td colspan='4' style='text-align:left; background-color: #cddcee; border: 1px solid #ededed'>Continuous</td></tr>"
                + "<tr>"
                + "<th width=10px'>&nbsp;</th>"
                + "<th style='width: 65%; font-size: 11px; font-weight: bold; color:black'>Medication</th>"
                + "<th style='width: 25%; font-size: 11px; font-weight: bold; color:black'>Details</th>"
                + "<th style='width: 10%; font-size: 11px; font-weight: bold; color:black'>Start Date/Time</th></tr>";

            for (i = 0; i < resJSON.CCNT; i++)
            {
                var med_name = resJSON.CONTINUOUS[i].MED_NAME;
                var admin_dtls = resJSON.CONTINUOUS[i].ADMIN_DTLS;
                var start_dt = resJSON.CONTINUOUS[i].START_DT;


                output += "<tr>"

                        + "<td width = '10px'>&nbsp;</td>"

                        + "<td align = 'left'>"
                        + med_name
                        + "</td>"

                        + "<td align = 'left'>"
                        + admin_dtls
                        + "</td>"

                        + "<td align = 'left'>"
                        + start_dt
                        + "</td>"

                        //+ "<td align = 'left'>"
                        //+ "NEXT"
                        //+ "</td>"

                        //+ "<td align = 'left'>"
                        //+ "NEXT"
                        //+ "</td>"

                        //+ "<td align = 'left'>"
                        //+ "NEXT"
                        //+ "</td>"

                        + "</tr>";
            }
            output += "</table>";
        }

        if(resJSON.ACNT > 0)
        {
            if(resJSON.CCNT > 0)
            {
                output += "<span>&nbsp;</span>";
            } else {
                output+= "<div style='max-height:200px; width:99%; overflow-y:scroll'>"
            }

            output += "<table id='tblCardMeds'>"
                + "<tr><td colspan='4' style='text-align:left; background-color: #cddcee; border: 1px solid #ededed'>Administered Last 24 hours</td></tr>"
                + "<tr>"
                + "<th width=10px'>&nbsp;</th>"
                + "<th style='width: 65%; font-size: 11px; font-weight: bold; color:black'>Medication</th>"
                + "<th style='width: 25%; font-size: 11px; font-weight: bold; color:black'>Details</th>"
                + "<th style='width: 10%; font-size: 11px; font-weight: bold; color:black'>Start Date/Time</th>";

            for (i = 0; i < resJSON.ACNT; i++)
            {
                var med_name = resJSON.ADMIN24[i].MED_NAME;
                var admin_dtls = resJSON.ADMIN24[i].ADMIN_DTLS;
                var last_admin_dt = resJSON.ADMIN24[i].LAST_ADMIN_DT;


                output += "<tr>"

                        + "<td width = '10px'>&nbsp;</td>"

                        + "<td align = 'left'>"
                        + med_name
                        + "</td>"

                        + "<td align = 'left'>"
                        + admin_dtls
                        + "</td>"

                        + "<td align = 'left'>"
                        + last_admin_dt
                        + "</td>"

                        + "</tr>";
            }
            output += "</table>";
        }

        output += "</div>";
    }
    target.innerHTML = output;

    //$("#tblCardMeds th").css("font-style", "bold");
    //$("#tblCardMeds tbody tr:even").css("background-color", "#E8EBF5");
    //$("#tblCardMeds tbody tr:odd").css("background-color", "#FFFFFF");
    //alert(aryDtls[0].catName);
}

//*====================================-  Cardio Clinic Meds ends ---------=====*/


//*====================================-  workflow_visits  starts---------=====*/
/*workflow_visits example*/
baycarefl.workflow_visits = function(){};
baycarefl.workflow_visits.prototype = new MPage.Component();
baycarefl.workflow_visits.prototype.constructor = MPage.Component();
baycarefl.workflow_visits.prototype.base = MPage.Component.prototype;
baycarefl.workflow_visits.prototype.name = "baycarefl.workflow_visits";
baycarefl.workflow_visits.prototype.cclProgram = "bc_pc_mp_visit_list";
baycarefl.workflow_visits.prototype.cclParams = [] ;
baycarefl.workflow_visits.prototype.cclDataType = "JSON";
baycarefl.workflow_visits.prototype.init = function(options){
//
//"MINE" ,
//"USERID" =0 ,
//"PERSONID" =0 ,
//"ENCNTRID" =0 ,
//"OPTIONS" =""
//

	var params = [];
	params.push("mine");
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	

	this.cclParams = params;
	//this.data = ""
}

baycarefl.workflow_visits.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.RLIST;
	var resCntAll  = resJSON.TODAY.length + resJSON.PREV_VISIT.length + resJSON.FUTURE_VISIT.length;
	//var resCnt = 1;
	//target.innerHTML = "Hello World";
	var sTitle = "Visits (" + resCntAll + ")"
	
	var Cur_Person = this.getProperty("personId"); //the current person
	if(resCntAll === 0)
	{	
		
		var output1 = "<table width = '99%'><tr><td class='sub-title-disp'>"+ sTitle +"</td></tr></table>"
		output1 += "<span class = 'ss-res-none'> No visits found </span>";
		target.innerHTML = output1;
	}
	else
	{	
		var output = ""
		output += "<div style='max-height:200px;width:99%;overflow-n:scroll'>"
			+ "<table width = 99%>"
			+ "<tr class = 'wf_visits_column_headers'>"
			+ "<td width = '10.0%' align = 'left'>Date</td>"
			+ "<td width = '10.0%' align = 'left'>Status</td>"
			+ "<td width = '20.0%' align = 'left'>Type</td>"
			+ "<td width = '30.0%' align = 'left'>Location</td>"
			+ "<td width = '40.0%' align = 'left'>Reason for Visit</td></tr></table>";

		if (resJSON.TODAY.length > 0){
			sTitle = "Today(" + resJSON.TODAY.length + ")"
			output += "<table width = '100%'><tr><td class='wf_visits_table_section'>"+ sTitle +"</td></tr></table>"
			$.each(resJSON.TODAY, function(idx, info){
				output += "<table width = 99%>"
				+ "<tr class = 'wf_visits_row'>"
				+ "<td width = '10.0%' align = 'left'>" + info.DATE + "</td>"
				+ "<td width = '10.0%' align = 'left'>" + info.STATUS + "</td>"
				+ "<td width = '20.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '30.0%' align = 'left'>" + info.LOCATION + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.DESCRIPTION + "</td></tr>";
			})
			output += "</table>"
		}

		if (resJSON.FUTURE_VISIT.length > 0){
			sTitle = "Future (" + resJSON.FUTURE_VISIT.length + ") - Next 10 Visits"
			output += "<table width = '100%'><tr><td class='wf_visits_table_section'>"+ sTitle +"</td></tr></table>"
			$.each(resJSON.FUTURE_VISIT, function(idx, info){
				output += "<table width = 99%>"
				+ "<tr class = 'wf_visits_row'>"
				+ "<td width = '10.0%' align = 'left'>" + info.DATE + "</td>"
				+ "<td width = '10.0%' align = 'left'>" + info.STATUS + "</td>"
				+ "<td width = '20.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '30.0%' align = 'left'>" + info.LOCATION + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.DESCRIPTION + "</td></tr>";
			})
			output += "</table>"
		}

		if (resJSON.PREV_VISIT.length > 0){
			sTitle = "Previous (" + resJSON.PREV_VISIT.length + ") - Last 10 Visits"
			output += "<table width = '100%'><tr><td class='wf_visits_table_section'>"+ sTitle +"</td></tr></table>"

			$.each(resJSON.PREV_VISIT, function(idx, info){
				output += "<table width = 99%>"
				+ "<tr class = 'wf_visits_row'>"
				+ "<td width = '10.0%' align = 'left'>" + info.DATE + "</td>"
				+ "<td width = '10.0%' align = 'left'>" + info.STATUS + "</td>"
				+ "<td width = '20.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '30.0%' align = 'left'>" + info.LOCATION + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.DESCRIPTION + "</td></tr>";
			})
			output += "</table>"
		}

		target.innerHTML = output;
	}
}
//*====================================-  workflow_visits  ends---------=====*/

//*====================================-  summary_visits  starts---------=====*/
/*workflow_visits example*/
baycarefl.summary_visits = function(){};
baycarefl.summary_visits.prototype = new MPage.Component();
baycarefl.summary_visits.prototype.constructor = MPage.Component();
baycarefl.summary_visits.prototype.base = MPage.Component.prototype;
baycarefl.summary_visits.prototype.name = "baycarefl.summary_visits";
baycarefl.summary_visits.prototype.cclProgram = "bc_pc_mp_visit_list";
baycarefl.summary_visits.prototype.cclParams = [] ;
baycarefl.summary_visits.prototype.cclDataType = "JSON";
baycarefl.summary_visits.prototype.init = function(options){
//
//"MINE" ,
//"USERID" =0 ,
//"PERSONID" =0 ,
//"ENCNTRID" =0 ,
//"OPTIONS" =""
//

	var params = [];
	params.push("mine");
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	

	this.cclParams = params;
	//this.data = ""
}

baycarefl.summary_visits.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.RLIST;
	var resCntAll  = resJSON.TODAY.length + resJSON.PREV_VISIT.length + resJSON.FUTURE_VISIT.length;
	//var resCnt = 1;
	//target.innerHTML = "Hello World";
	var sTitle = "Visits (" + resCntAll + ")"
	
	var Cur_Person = this.getProperty("personId"); //the current person
	if(resCntAll === 0)
	{	
		
		var output1 = "<table width = '99%'><tr><td class='sub-title-disp'>"+ sTitle +"</td></tr></table>"
		output1 += "<span class = 'ss-res-none'> No visits found </span>";
		target.innerHTML = output1;
	}
	else
	{	
		var output = ""
		output += "<div style='max-height:200px;width:99%;overflow-y:scroll'>"
			+ "<table width = 99%>"
			+ "<tr class = 'sum_visits_column_headers'>"
			+ "<td width = '25.0%' align = 'left'>Date</td>"
			+ "<td width = '35.0%' align = 'left'>Type</td>"
			+ "<td width = '40.0%' align = 'left'>Location</td></tr></table>";

		if (resJSON.TODAY.length > 0){
			sTitle = "Today(" + resJSON.TODAY.length + ")"
			output += "<table width = '100%'><tr><td class='sum_visits_table_section'>"+ sTitle +"</td></tr></table>"
			$.each(resJSON.TODAY, function(idx, info){
				var hoverDisplay = "";
				hoverDisplay = "Visit Reason: " + info.DESCRIPTION
                             + "\nStatus: " + info.STATUS  
				output += "<table width = 99%>"
				+ "<tr class = 'sum_popup_row' title ='" + hoverDisplay + "'>"
				+ "<td width = '25.0%' align = 'left'>" + info.DATE + "</td>"
				+ "<td width = '35.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.LOCATION + "</td></tr>";
			})
			output += "</table>"
		}

		if (resJSON.FUTURE_VISIT.length > 0){
			sTitle = "Future (" + resJSON.FUTURE_VISIT.length + ") - Next 10 Visits"
			output += "<table width = '100%'><tr><td class='sum_visits_table_section'>"+ sTitle +"</td></tr></table>"
			$.each(resJSON.FUTURE_VISIT, function(idx, info){
				var hoverDisplay = "";
				hoverDisplay = "Visit Reason: " + info.DESCRIPTION
                             + "\nStatus: " + info.STATUS  
				output += "<table width = 99%>"
				+ "<tr class = 'sum_popup_row' title ='" + hoverDisplay + "'>"
				+ "<td width = '25.0%' align = 'left'>" + info.DATE + "</td>"
				+ "<td width = '35.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.LOCATION + "</td></tr>";
			})
			output += "</table>"
		}

		if (resJSON.PREV_VISIT.length > 0){
			sTitle = "Previous (" + resJSON.PREV_VISIT.length + ") - Last 10 Visits"
			output += "<table width = '100%'><tr><td class='sum_visits_table_section'>"+ sTitle +"</td></tr></table>"

			$.each(resJSON.PREV_VISIT, function(idx, info){
				var hoverDisplay = "";
				hoverDisplay = "Visit Reason: " + info.DESCRIPTION
                             + "\nStatus: " + info.STATUS  
				output += "<table width = 99%>"
				+ "<tr class = 'sum_popup_row' title ='" + hoverDisplay + "'>"
				+ "<td width = '25.0%' align = 'left'>" + info.DATE + "</td>"
				+ "<td width = '35.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.LOCATION + "</td></tr>";

			})
			output += "</table>"
		}

		target.innerHTML = output;
	}
}
//*====================================-  summary_visits  ends---------=====*/


//*====================================-  radiology  starts---------=====*/
//**/
/*radiology example*/
baycarefl.radiology = function(){};
baycarefl.radiology.prototype = new MPage.Component();
baycarefl.radiology.prototype.constructor = MPage.Component();
baycarefl.radiology.prototype.base = MPage.Component.prototype;
baycarefl.radiology.prototype.name = "baycarefl.radiology";
baycarefl.radiology.prototype.cclProgram = "bc_mp_vdo_rad_v1";
baycarefl.radiology.prototype.cclParams = [] ;
baycarefl.radiology.prototype.cclDataType = "JSON";
baycarefl.radiology.prototype.init = function(options){
//
//"MINE" ,
//"USERID" =0 ,
//"PERSONID" =0 ,
//"ENCNTRID" =0 ,
//"OPTIONS" =""
//

	var params = [];
	params.push("mine");
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	

	this.cclParams = params;
	//this.data = ""
}

baycarefl.radiology.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.CATORDS;
	var resCnt  = resJSON.OLIST.length;
	//var resCnt = 1;
	//target.innerHTML = "Hello World";
	var sTitle = "Last 6 months for all visits"
	
	var Cur_Person = this.getProperty("personId"); //the current person
	if(resCnt === 0)
	{	
		
		var output1 = "<table width = '100%'><tr><td class='sub-title-disp'>"+ sTitle +"</td></tr></table>"
		output1 += "<span class = 'ss-res-none'> No Radiology Order found! </span>";
		target.innerHTML = output1;
	}
	else
	{ 
		var output = ""

	
		for ( i = 0; i < resCnt; i++)
	{ 
			var cat_disp = resJSON.OLIST[i].CAT_DISP 
			var innerCnt = resJSON.OLIST[i].QUAL.length
			
			output = output +   "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
			+  "<div style='max-height:150px;width:100%;overflow-y:scroll'>"
			+"<table class = 'sec-content'width = 100%>"
			+"<tr class = 'pri-sc-hdr' id='tooltipper'>"
			+"<td width = '50.0%' align = 'left'>Order</td>"
			+"<td width = '25.0%' align = 'left'>Date/Time</td>"
			+"<td width = '25.0%' align = 'center'>Status</td></tr>";
		
		inner = ""
		for (z = 0; z < innerCnt; z++)
		{ 
		
		var ord_display = resJSON.OLIST[i].QUAL[z].DISPLAY;
		var ord_date = resJSON.OLIST[i].QUAL[z].START_DATE;
		var ord_status = resJSON.OLIST[i].QUAL[z].ORD_STATUS;
		var event_id = resJSON.OLIST[i].QUAL[z].EVENT_ID;
		
	
		inner = inner +"<tr background = #000>"
		+"<td width = '50.0%' class = 'baycare_radiology_order'>"
		 + "<a OnClick = 'launch_docView(" + Cur_Person + "," + event_id + ")';>"  +  ord_display + "</a></td>"
		//   + "<a>"  +  ord_display + "</a></td>"
		 	+"<td width = '25.0%' align = 'left'  class = 'baycare_radiology_date_status'>"
		 + ord_date + "</td>"
		+"<td width = '25.0%' align = 'center' class = 'baycare_radiology_date_status'>" + ord_status + "</td>"
		+"</tr>"
		}
			output = output + inner + "</table></div>";
	}
	
 target.innerHTML = output
		
	}
}
//*====================================-  radiology  ends---------=====*/


//*============================ procedure_notes section ====================*/



baycarefl.procedure_notes = function(){};
baycarefl.procedure_notes.prototype = new MPage.Component();
baycarefl.procedure_notes.prototype.constructor = MPage.Component();
baycarefl.procedure_notes.prototype.base = MPage.Component.prototype;
baycarefl.procedure_notes.prototype.name = "baycarefl.procedure_notes";
baycarefl.procedure_notes.prototype.cclProgram = "bc_pc_vdo_proc_notes";
baycarefl.procedure_notes.prototype.cclParams = [] ;
baycarefl.procedure_notes.prototype.cclDataType = "JSON";
baycarefl.procedure_notes.prototype.init = function(options){
//
//"MINE" ,
//"USERID" =0 ,
//"PERSONID" =0 ,
//"ENCNTRID" =0 ,
//"OPTIONS" =""
//
	var params = [];
	params.push("mine");
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	

	this.cclParams = params;
	//this.data = ""
}

baycarefl.procedure_notes.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.PNOTES;
	var resCnt  = resJSON.PROCLIST.length;
	
	var Cur_Person = this.getProperty("personId"); //the current person
	
	if(resJSON.PROCLIST.length === 0)
	{
		target.innerHTML = "<span class = 'ss-res-none'> Zero (0) procedure note found! </span>";
	}
	else
	{ 
	 	var output =  "<div class='sub-title-disp'>Selected visit</div>";
	 		output +=  "<div style='max-height:150px;width:100%;overflow-y:scroll'>"
			output += "<table width = 100%>"
			+"<tr class = 'pri-sc-hdr' id='tooltipper'>"
			+"<td width = '45.0%' align = 'left'><span class='baycare_sub-title-disp'>Order</span></td>"
			+"<td width = '25.0%' align = 'left'><span class='baycare_sub-title-disp'>Author</span></td>"
			+"<td width = '25.0%' align = 'center'><span class='baycare_sub-title-disp'>Date/Time </span></td>"
			+"<td width = '5.0%' align = 'center'></td></tr>" 	
			//;CONTENT AREA
			for ( i = 0; i < resCnt; i++)
		{ 	
			var proc_notes = resJSON.PROCLIST[i].EVENT;
			var update_by = resJSON.PROCLIST[i].UPDATE_BY;
			var last_update = resJSON.PROCLIST[i].LAST_UPDATE;
			var result_status = resJSON.PROCLIST[i].RESULT_STATUS;
			var event_id = resJSON.PROCLIST[i].EVENT_ID;
			var display = resJSON.PROCLIST[i].DISPLAY;
			var popupID = "Popup" + i
		
			output = output + "<div id='" + popupID +  "' style='display: none;"
			+ "position: absolute; left: 100px; top: -35px;"
			+ "border: solid black 1px; padding: 10px;"
			+ "background-color: rgb(255,255,225);"
			+ "text-align: justify; font-size: 12px; width: 250px;'>"
			+"Name: 	" + proc_notes
			+ "<br\>"
			+"Subject:	"  + display
				+ "<br\>"
			+"Status:	" + result_status
				+ "<br\>"
			+"Last Updated:	" + last_update
					+ "<br\>"
			+"Author:	" + update_by
			+"</div>"
					
			
			output = output + "<span onmouseover=\"document.getElementById('" + popupID +  "').style.display = 'block' \" "
					+  "onmouseout=\"document.getElementById('" + popupID +  "').style.display = 'none' \" "
			+ ">" //close span
			+"<tr>"
			+"<td width = '45.0%' class = 'baycare_radiology_order'>"
			+ "<a OnClick = 'launch_docView(" + Cur_Person + "," + event_id + ")';>"  +  proc_notes + "</a></td>"
			+"<td width = '25.0%' align = 'left'>" + update_by + "</td>"
			+"<td width = '25.0%' align = 'center'><div class = 'baycare_result_status'>" + last_update + "</div></td>"
			+"<td width = '5.0%' align = 'center'></td></tr></span>"
		}

			
			output = output + "</table></div>"
	 	 
	 	
		target.innerHTML = output;
		
	}
}

//*               END PROCEDURE NOTES SECTION   */

//*============================ I & O Section section ====================*/
baycarefl.IandO = function(){};
baycarefl.IandO.prototype = new MPage.Component();
baycarefl.IandO.prototype.constructor = MPage.Component();
baycarefl.IandO.prototype.base = MPage.Component.prototype;
baycarefl.IandO.prototype.name = "baycarefl.IandO";
//baycarefl.IandO.prototype.cclProgram = "bc_mp_iando_cust_comp";
baycarefl.IandO.prototype.cclProgram = "bc_mp_pfs_iando";
baycarefl.IandO.prototype.cclParams = [] ;
baycarefl.IandO.prototype.cclDataType = "JSON";
baycarefl.IandO.prototype.init = function(options){


//OUTDEV, PERSON_ID, USER_ID, ENCNTR_ID,
	var params = [];
	params.push("mine");
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("encounterId"));

	this.cclParams = params;
	//this.data = ""
}

baycarefl.IandO.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.OUTPUT_MP;

	
	 target.innerHTML =resJSON.OUTPUTHTML;
	
}
//*============================ I & O Section Ends ====================*/
//*====================================-  Restraints  Starts---------=====*/

baycarefl.restraints = function(){};
baycarefl.restraints.prototype = new MPage.Component();
baycarefl.restraints.prototype.constructor = MPage.Component();
baycarefl.restraints.prototype.base = MPage.Component.prototype;
baycarefl.restraints.prototype.name = "baycarefl.restraints";
baycarefl.restraints.prototype.cclProgram = "bc_mp_restraints_get_data";
baycarefl.restraints.prototype.cclParams = [] ;
baycarefl.restraints.prototype.cclDataType = "JSON";

/* Initialize the cclParams variable */
baycarefl.restraints.prototype.init = function(options){
	var params = [];
	params.push("mine");
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("encounterId"));
	
	this.cclParams = params;
	this.data = "";
};

/* Render the basic layout of the component */
baycarefl.restraints.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	
	var target = this.getTarget();
	var restJSON = this.data.REC_ACT_RESTRAINT;
    var resData = restJSON;
	var restCnt = restJSON.RES_CNT;
	var restraintsHTML = [];
	
	if(restCnt === 0)
	{
	
		target.innerHTML = "<span class = 'baycarefl-ss-res-none'><span style='color:gray;'> No results found </span>";
	} 
	else
	
	{ 
		var order_set = resData.ORDER_SET;
		var order_status = resData.CURR_RES_STATUS;
		
		var order_id = resData.INIT_ORDER_ID;
		var init_order_name = resData.INIT_ORDER;
		
		var order_details = resData.ORDSET_DETAILS;
		  
		var ord_dt = resData.ORDSET_DTTM_DISP;
		var res_init = resData.INIT_DT_TM_DISP;
		var res_cont = resData.CONT_DT_TM_DISP;

		var pt_age = resData.PT_AGE;
		var exp_dt = resData.EXP_DT_TM;
		
		var init_dt = resData.INIT_DT_TM;
		var cont_dt = resData.CONT_DT_TM;
		
		var init_task_alert = resData.INIT_TASK_ALERT;
		var cont_task_alert = resData.CONT_TASK_ALERT;
		var cont_ord_alert  = resData.CONT_ORD_ALERT;
		  
		/*Calculate time for expiration order status display*/
		curdttm = new Date()  //Current date and time
		expdttm = new Date(exp_dt)
		  
		//Set 1 hour in milliseconds
		var one_hour = 3600000
		  
		//Set 1 minute in milliseconds
		var one_min = 60000
		  
		//Calculate difference btw the two times, and convert to hours and minutes
		hourdiff = Math.ceil((expdttm.getTime()- curdttm.getTime())/ (one_hour));
		mindiff = Math.ceil((expdttm.getTime()- curdttm.getTime())/ (one_min));
		
		target.innerHTML = "<div class='sub-title-disp'>Selected visit</div>";
		
		/*Set restraint order status alert colors*/
		if(mindiff <= 0){ //If expired display in white text with red background
		  	target.innerHTML += "<h1><p style='color:white;background-color:red;'>" + order_status + "</p></h1>";
		    }
		else if(mindiff <= 60){//If within 1 hour of expiring display status in red text
		  	target.innerHTML += "<span><h1><span style='color:red;'>" + order_status + "</h1></span>";
		  	}						
		else {
		  	target.innerHTML += "<span><h1>" + order_status + "</h1></span>";
		} //endif mindiff <= 0
		
		/*Display restraint order detail line*/  
		target.innerHTML += "<tr><td><span style='color:gray;'>Order: </span>"
				     	 + order_set + "<br />";
					
		/*Display dates based on restraint order and task status*/   
		if(order_status == "Ordered"){
			/*If Initiation Task is Overdue display Task Overdue in red*/
			if(init_task_alert == "Task Overdue") {
				target.innerHTML += "<tr><td><span style='color:gray;'>Restraint Initiated Date/Time:  </span>"
					 			 + "<span style='color:red;'>" + init_task_alert + "</span></td><td><br />";
			}
			/*If Initiation Task is Pending display Task Pending... in black*/
			else {
				target.innerHTML += "<tr><td><span style='color:gray;'>Restraint Initiated Date/Time:  </span>"
					 		     +  init_task_alert + "</td><td><br />";
			}
		}
		else if(order_status == "Initiated"){
			target.innerHTML += "<tr><td><span style='color:gray;'>Restraint Initiated Date/Time:  </span>"
					 		 + res_init +"</td><td><br />";
		}
		else if(order_status == "Continued") {
		
			/*If Initiation Task is Overdue display Task Overdue in red*/
			if(init_task_alert == "Task Overdue") {
				target.innerHTML += "<tr><td><span style='color:gray;'>Restraint Initiated Date/Time:  </span>"
					 			 + "<span style='color:red;'>" + init_task_alert + "</span></td><td><br />";
			}
			/*If Initiation Task is Pending display Task Pending... in black*/
			else if(init_task_alert == "Task Pending..."){
				target.innerHTML += "<tr><td><span style='color:gray;'>Restraint Initiated Date/Time:  </span>"
					 		     + init_task_alert + "</td><td><br />";
			}
			/*If Initiation Task is Complete display Initiation Date/Time*/
			else {
				target.innerHTML += "<tr><td><span style='color:gray;'>Restraint Initiated Date/Time:  </span>"
					 		     + res_init +"</td><td><br />"
			}
			
			/*If Continue Task is Overdue display Task Overdue in red*/
			if(cont_task_alert == "Task Overdue") {
				target.innerHTML += "<tr><td><span style='color:gray;'>Restraint Continued Date/Time:  </span>"
					 		     + "<span style='color:red;'>" + cont_task_alert + "</span></td><td><br />";
			}
			/*If Continue Task is Pending display Task Pending... in black*/
			else if(cont_task_alert == "Task Pending..."){
				target.innerHTML += "<tr><td><span style='color:gray;'>Restraint Continued Date/Time:  </span>"
					 		     + cont_task_alert + "</td><td><br />";
			}
			/*If Continue Task is Complete display Continued Date/Time*/
			else {
				target.innerHTML += "<tr><td><span style='color:gray;'>Restraint Continued Date/Time:  </span>"
					 	         + res_cont +"</td><td><br />";
			}

		 } 
		 /*Display Expiration Date/Time based on Order and Task statuses*/ 
		 target.innerHTML += "<tr><td><span style='color:gray;'>Expiration:  </span>"
					         + exp_dt +"</td><td><br />";
					         
		 /*Display Continue order Alert based on Init dt/tm and Cont dt/tm*/ 
		 if(cont_ord_alert != " "){
		 	target.innerHTML += "<tr><td><span style='color:red;'>"
					         + cont_ord_alert +"</span></td><td><br />";
		 }

	} //end if/else
}; //end function
//*====================================-  Restraints  Ends ----------=====*/

//*====================================-   Lab FishBone Starts----------=====*/
//** we'll be using Edwin's lab code from Anesthesia Summary bc_mp_mvs_lab_18 */
/*radiology example*/
baycarefl.labfishbone = function(){};
baycarefl.labfishbone.prototype = new MPage.Component();
baycarefl.labfishbone.prototype.constructor = MPage.Component();
baycarefl.labfishbone.prototype.base = MPage.Component.prototype;
baycarefl.labfishbone.prototype.name = "baycarefl.labfishbone";
baycarefl.labfishbone.prototype.cclProgram = "bc_mp_mvs_lab_18_cc";
baycarefl.labfishbone.prototype.cclParams = [] ;
baycarefl.labfishbone.prototype.cclDataType = "JSON";
baycarefl.labfishbone.prototype.init = function(options){
//
//"MINE" ,
//"USERID" =0 ,
//"PERSONID" =0 ,
//"ENCNTRID" =0 ,
//"OPTIONS" =""
//

	var params = [];
	params.push("mine");
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	

	this.cclParams = params;
	//this.data = ""
	
	

}

/*
    jQuery tooltip plugin is incompatible with 2015.01.19 code upgrade.
    Render function rewritten to add Title attribute to fishbone table cells
    to show last 5 results on hover. Old code saved to file labfishbone.prototype.render.OLD.js.
*/

baycarefl.labfishbone.prototype.render = function(){ //;begin render

	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.LAB_RESULT;
	var resCnt  = resJSON.CBC_CNT;
	//var resCnt = 1;
	//target.innerHTML = "Hello World";
	var sTitle = "Custom Labs - Selected Visit"

	var Cur_Person = this.getProperty("personId"); //the current person
	var max_lab_history = 5;

	var fishbone_link = "<a class = 'fishbone' href='#'>"
	var output = ""

	output += "<div class='sub-title-disp'>"+ sTitle +"</div>"
            + "<table class='anesthesia_lab_table _test' style='width:98%;'>";
    
    if (this.data.LAB_RESULT.CBC_CNT > 0){
        output += "<tr><td colspan='2' style='width:70%;text-align:right;'>" 
                + "<table class='_test' cellspacing='0' cellpadding='0' style='font-size:10px'><tr>" 
                + "<td rowspan='2' style='font-size:11px;width:25px;text-align:right; vertical-align: middle;";
				
        if (this.data.LAB_RESULT.CBC[0].WBC_CRIT){
            output += "color:red;font-weight:bold;";
        }else if (this.data.LAB_RESULT.CBC[0].WBC_HIGH_LOW){
            output += "color:blue;";
        }
        output += "'";
        
        if (this.data.LAB_RESULT.CBC_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='WBC_cell'>";

        output += "<div class = 'fish_bone_values'>"  + this.data.LAB_RESULT.CBC[0].WBC + "</a></div></td>"
                + "<td style='width: 10px; '><span  style='font-size:20px;vertical-align:top;position:relative;bottom:-4px;'>&#92;</span></td>"
                + "<td style='font-size:11px;border-bottom:1px black solid;width:45px;text-align:center;";

        if (this.data.LAB_RESULT.CBC[0].HGB_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.CBC[0].HGB_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.CBC_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='HGB_cell'>";

        output += this.data.LAB_RESULT.CBC[0].HGB + "</td>";

        output += "<td style='width: 10px; '><span  style='font-size:20px;text-align:left;vertical-align:top;position:relative;bottom:-4px;left:-4px'>&#47;</span></td>" 
                + "<td rowspan='2' style='font-size:11px;width:150px;text-align:left; vertical-align: middle;";
				
        if (this.data.LAB_RESULT.CBC[0].PLT_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.CBC[0].PLT_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.CBC_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='PLT_cell'>";

        output += "<div class = 'fish_bone_values'>" + this.data.LAB_RESULT.CBC[0].PLT + "</div></td></tr>" 
                + "<tr><td><span  style='font-size:20px;vertical-align:top;position:relative;top:-3px;'>&#47;</span></td>"
				+ "<td style='font-size:11px;border-top:1px black solid;width:45px;text-align:center;";

        if (this.data.LAB_RESULT.CBC[0].HCT_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.CBC[0].HCT_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.CBC_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='HCT_cell'>";

        output += this.data.LAB_RESULT.CBC[0].HCT + "</td>"
                + "<td><span  style='font-size:20px;vertical-align:top;position:relative;top:-4px;left:-4px;'>&#92;</span></td></tr></table>" 
                + "</td><td style='font-size:11px;'>" + "<div class = 'fish_bone_values'>" + this.data.LAB_RESULT.CBC[0].DATE_TIME + "</div></td></tr>";
    }


    if (this.data.LAB_RESULT.BMP_CNT > 0){
        
        if (this.data.LAB_RESULT.CBC_CNT > 0){
            output += "<tr><td style='height:5px;'>&nbsp;</td></tr>";
        }
        output += "<tr><td colspan='2' style='width:70%;text-align:left;'>" +
            "<table class='_test' cellspacing='0' cellpadding='0' style='font-size:10px;'><tr>";
        output += "<td style='font-size:11px;width:45px;text-align:center;border-right:1px solid black;border-bottom:1px solid black;";
        if (this.data.LAB_RESULT.BMP[0].SODIUM_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.BMP[0].SODIUM_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.BMP_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='SOD_cell'>";

        output += this.data.LAB_RESULT.BMP[0].SODIUM + "</td>"
                + "<td style='font-size:11px;width:45px;text-align:center;border-right:1px solid black;border-left:1px solid black;border-bottom:1px solid black;";

        if (this.data.LAB_RESULT.BMP[0].CHLORIDE_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.BMP[0].CHLORIDE_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.BMP_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='CHL_cell'>";

        output += this.data.LAB_RESULT.BMP[0].CHLORIDE + "</td>"
			    + "<td style='font-size:11px;width:45px;text-align:center;border-left:1px solid black;border-bottom:1px solid black;";
                
        if (this.data.LAB_RESULT.BMP[0].BUN_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.BMP[0].BUN_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.BMP_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='BUN_cell'>";

        output += this.data.LAB_RESULT.BMP[0].BUN + "</td>"
                + "<td style='width: 10px;' ><span style='font-size:20px;position:relative;bottom:-4px;'>&#47;</span></td>"
                + "<td rowspan='2' style='font-size:11px;width:150px;text-align:left; vertical-align: middle;"; 

        if (this.data.LAB_RESULT.BMP[0].GLUCOSE_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.BMP[0].GLUCOSE_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.BMP_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='GLU_cell'>";

        output += "<div class = 'fish_bone_values'>" + this.data.LAB_RESULT.BMP[0].GLUCOSE + "</div></td></tr>"
                + "<tr><td style='font-size:11px;width:45px;text-align:center;border-right:1px solid black;border-top:1px solid black;";

        if (this.data.LAB_RESULT.BMP[0].POTASSIUM_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.BMP[0].POTASSIUM_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.BMP_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='POT_cell'>";

        output += this.data.LAB_RESULT.BMP[0].POTASSIUM + "</td>"
                + "<td style='font-size:11px;width:45px;text-align:center;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;";

        if (this.data.LAB_RESULT.BMP[0].BICARBONATE_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.BMP[0].BICARBONATE_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.BMP_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='CO2_cell'>";

        output += this.data.LAB_RESULT.BMP[0].BICARBONATE + "</td>"
                + "<td style='font-size:11px;width:45px;text-align:center;border-left:1px solid black;border-top:1px solid black;";
                
        if (this.data.LAB_RESULT.BMP[0].CREATININE_CRIT){
            output += "color:red;font-weight:bold;'";
        }else if (this.data.LAB_RESULT.BMP[0].CREATININE_HIGH_LOW){
            output += "color:blue;'";
        }else{
            output += "'";
        }
        if (this.data.LAB_RESULT.BMP_CNT > 1){
            output += " class='anesthesia_lab_graph'";
        }
        output += " id='CRE_cell'>";

        output += this.data.LAB_RESULT.BMP[0].CREATININE + "</td>"
                + "<td style='width: 10px;' ><span style='font-size:20px;position:relative;top:-3px;'>&#92;</span></td></tr>"
                + "</table>" 
                + "</td><td style='font-size:11px;'><div class = 'fish_bone_values'>" + this.data.LAB_RESULT.BMP[0].DATE_TIME + "</div></td></tr>";
    }

    
    if (this.data.LAB_RESULT.LAB_CNT > 0){
        if (this.data.LAB_RESULT.CBC_CNT > 0 || this.data.LAB_RESULT.BMP_CNT){
            output += "<tr><td colspan='3' style='height:5px;'>&nbsp;</td></tr>";
        }
        $.each(this.data.LAB_RESULT.LAB, function(l_idx, lab){
            output += "<tr class='data_row' style='font-size:11px;'><td style='font-weight:bolder;'>" + lab.DESCRIPTION + "</td><td";
            if (lab.RESULT[0].CRIT){
                output += " style='color:red;font-weight:bold;'";
            }
            if (lab.RESULT[0].HIGH_LOW){
                output += " style='color:blue;'";
            }
            output += ">" +
                lab.RESULT[0].VAL + "</td><td style='font-size:11px;'>" +
                lab.RESULT[0].DATE_TIME + "</td></tr>";
        });
    }
    output += "</table>";
    target.innerHTML = output;
    

    
    /* Set the Title text for hover popup */
    if (this.data.LAB_RESULT.CBC_CNT > 1){
        var wbc_ttl_txt = "WBC";
        $.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
            if (idx < max_lab_history){
                wbc_ttl_txt += "\n" + cbc.DATE_TIME + "\t" + ("         " + cbc.WBC).slice(-10);
            }
        });
        $("#WBC_cell").attr("title", wbc_ttl_txt);
        
        var hgb_ttl_txt = "HGB";
        $.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
            if (idx < max_lab_history){
                hgb_ttl_txt += "\n" + cbc.DATE_TIME + "\t" + ("         " + cbc.HGB).slice(-10);
            }
        });
        $("#HGB_cell").attr("title", hgb_ttl_txt);
        
        var plt_ttl_txt = "PLT";
        $.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
            if (idx < max_lab_history){
                plt_ttl_txt += "\n" + cbc.DATE_TIME + "\t" + ("         " + cbc.PLT).slice(-10);
            }
        });
        $("#PLT_cell").attr("title", plt_ttl_txt);
        
        var hct_ttl_txt = "HCT";
        $.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
            if (idx < max_lab_history){
                hct_ttl_txt += "\n" + cbc.DATE_TIME + "\t" + ("         " + cbc.HCT).slice(-10);
            }
        });
        $("#HCT_cell").attr("title", hct_ttl_txt);
        
    }


    if (this.data.LAB_RESULT.BMP_CNT > 1){
        var sod_ttl_txt = "Sodium";
        $.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
            if (idx < max_lab_history){
                sod_ttl_txt += "\n" + bmp.DATE_TIME + "\t" + ("         " + bmp.SODIUM).slice(-10);
            }
        });
        $("#SOD_cell").attr("title", sod_ttl_txt);
        
        var chl_ttl_txt = "Chloride";
        $.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
            if (idx < max_lab_history){
                chl_ttl_txt += "\n" + bmp.DATE_TIME + "\t" + ("         " + bmp.CHLORIDE).slice(-10);
            }
        });
        $("#CHL_cell").attr("title", chl_ttl_txt);
        
        var bun_ttl_txt = "BUN";
        $.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
            if (idx < max_lab_history){
                bun_ttl_txt += "\n" + bmp.DATE_TIME + "\t" + ("         " + bmp.BUN).slice(-10);
            }
        });
        $("#BUN_cell").attr("title", bun_ttl_txt);
        
        var glu_ttl_txt = "Glucose";
        $.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
            if (idx < max_lab_history){
                glu_ttl_txt += "\n" + bmp.DATE_TIME + "\t" + ("         " + bmp.GLUCOSE).slice(-10);
            }
        });
        $("#GLU_cell").attr("title", glu_ttl_txt);
        
        var pot_ttl_txt = "Potassium";
        $.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
            if (idx < max_lab_history){
                pot_ttl_txt += "\n" + bmp.DATE_TIME + "\t" + ("         " + bmp.POTASSIUM).slice(-10);
            }
        });
        $("#POT_cell").attr("title", pot_ttl_txt);
        
        var co2_ttl_txt = "Carbon Dioxide";
        $.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
            if (idx < max_lab_history){
                co2_ttl_txt += "\n" + bmp.DATE_TIME + "\t" + ("         " + bmp.BICARBONATE).slice(-10);
            }
        });
        $("#CO2_cell").attr("title", co2_ttl_txt);
        
        var cre_ttl_txt = "Creatinine";
        $.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
            if (idx < max_lab_history){
                cre_ttl_txt += "\n" + bmp.DATE_TIME + "\t" + ("         " + bmp.CREATININE).slice(-10);
            }
        });
        $("#CRE_cell").attr("title", cre_ttl_txt);
        
        
    }
    
   


} //;end render

//*====================================-  Lab FishBone Ends---------=====*/


//*====================================- Quality Measure Compenent Begins  ----------=====*/


baycarefl.quality_measures_ks = function(){};
baycarefl.quality_measures_ks.prototype = new MPage.Component();
baycarefl.quality_measures_ks.prototype.constructor = MPage.Component();
baycarefl.quality_measures_ks.prototype.base = MPage.Component.prototype;
baycarefl.quality_measures_ks.prototype.name = "baycarefl.quality_measures_ks";
baycarefl.quality_measures_ks.prototype.cclProgram = "bc_mp_pt_quality_measures";
baycarefl.quality_measures_ks.prototype.cclParams = [] ;
baycarefl.quality_measures_ks.prototype.cclDataType = "JSON";
baycarefl.quality_measures_ks.prototype.init = function(options){
//
//"MINE" ,
//"USERID" =0 ,
//"PERSONID" =0 ,
//"ENCNTRID" =0 ,
//"OPTIONS" =""
//
	var params = [];
	params.push("mine");
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	

	this.cclParams = params;
	//this.data = ""
}

baycarefl.quality_measures_ks.prototype.render = function()
{
	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.QM;
	var sTitle = "";
	var output = "<div class = 'qual_measure_box'>"
	
	var Cur_Person = this.getProperty("personId"); //the current person
	if(resJSON.CENT.length === 0 && resJSON.DIAL.length === 0 && resJSON.FOLEY.length === 0 
	&& resJSON.PICC.length === 0 && resJSON.PORT.length === 0 &&  resJSON.VENT.length === 0 
	&& resJSON.INR.length === 0 && resJSON.MECHVTE.length === 0 && resJSON.MEDVTE.length === 0
	&& resJSON.TELEMETRY.length === 0)
	{	
		sTitle = "No Quality Measures found - Selected Visit";
		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
		+ "<table class = 'bc_vte' style='font-size:11px;' width = 100%></table>";
	}
	else if(resJSON.CENT.length === 0 && resJSON.DIAL.length === 0 && resJSON.FOLEY.length === 0 
	&& resJSON.PICC.length === 0 && resJSON.PORT.length === 0 &&  resJSON.VENT.length === 0
	&& resJSON.TELEMETRY.length === 0)
	{
		sTitle = "No Lines, Devices - Selected Visit";
		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>";	
	}
	if(resJSON.CENT.length > 0 || resJSON.DIAL.length > 0 || resJSON.FOLEY.length > 0
	|| resJSON.PICC.length > 0 || resJSON.PORT.length > 0 || resJSON.VENT.length > 0
	|| resJSON.TELEMETRY.length > 0)
	{ 
		sTitle = "Lines, Devices - Selected Visit";
		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
			+ "<table class = 'bc_qm' style='font-size:11px;' width = 100%>";
		if (resJSON.CENT.length > 0){
			$.each(resJSON.CENT, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures'>"
				+ "<td width = '45.0%' align = 'left'>" + info.DISPLAY + "</td>"
				+ "<td width = '25.0%' align = 'left'>" + info.START_DT_TM + "</td>"
				+ "<td width = '30.0%' align = 'center'>" + info.HRS_PRESENT_DISP + "</td></tr>";
			})
		}
		if (resJSON.DIAL.length > 0){
			$.each(resJSON.DIAL, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures'>"
				+ "<td width = '45.0%' align = 'left'>" + info.DISPLAY + "</td>"
				+ "<td width = '25.0%' align = 'left'>" + info.START_DT_TM + "</td>"
				+ "<td width = '30.0%' align = 'center'>" + info.HRS_PRESENT_DISP + "</td></tr>";
			})
		}
		if (resJSON.FOLEY.length > 0){
			$.each(resJSON.FOLEY, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures'>"
				+ "<td width = '45.0%' align = 'left'>" + info.DISPLAY + "</td>"
				+ "<td width = '25.0%' align = 'left'>" + info.START_DT_TM + "</td>"
				+ "<td width = '30.0%' align = 'center'>" + info.HRS_PRESENT_DISP + "</td></tr>";
			})
		}
		if (resJSON.PICC.length > 0){
			$.each(resJSON.PICC, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures'>"
				+ "<td width = '45.0%' align = 'left'>" + info.DISPLAY + "</td>"
				+ "<td width = '25.0%' align = 'left'>" + info.START_DT_TM + "</td>"
				+ "<td width = '30.0%' align = 'center'>" + info.HRS_PRESENT_DISP + "</td></tr>";
			})
		}
		if (resJSON.PORT.length > 0){
			$.each(resJSON.PORT, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures'>"
				+ "<td width = '45.0%' align = 'left'>" + info.DISPLAY + "</td>"
				+ "<td width = '25.0%' align = 'left'>" + info.START_DT_TM + "</td>"
				+ "<td width = '30.0%' align = 'center'>" + info.HRS_PRESENT_DISP + "</td></tr>";
			})
		}
		if (resJSON.VENT.length > 0){
			$.each(resJSON.VENT, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures'>"
				+ "<td width = '45.0%' align = 'left'>" + info.DISPLAY + "</td>"
				+ "<td width = '25.0%' align = 'left'>" + info.START_DT_TM + "</td>"
				+ "<td width = '30.0%' align = 'center'>" + info.HRS_PRESENT_DISP + "</td></tr>";
			})
		}
		if (resJSON.TELEMETRY.length > 0){
			$.each(resJSON.TELEMETRY, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures'>"
				+ "<td width = '45.0%' align = 'left'>" + info.DISPLAY + "</td>"
				+ "<td width = '25.0%' align = 'left'>" + info.START_DT_TM + "</td>"
				+ "<td width = '30.0%' align = 'center'>" + info.HRS_PRESENT_DISP + "</td></tr>";
			})
		}
		output += "</table>";
		if (resJSON.INR.length === 0 && resJSON.MECHVTE.length === 0 && resJSON.MEDVTE.length === 0)
		{
			sTitle = "No Prophylaxis - Selected Visit";
			output += "<table width = '100%'><tr><td class='sub-title-disp' style='color:" + this.data.QM.VTE_COLOR +";'>"+  sTitle +"</td></tr></table>"
				+ "<table class = 'bc_qm' style='font-size:11px;' width = 100%></table>";
		}
	}
	if (resJSON.INR.length > 0 || resJSON.MECHVTE.length > 0 || resJSON.MEDVTE.length > 0)
	{
		sTitle = this.data.QM.VTE_DISPLAY + " - Selected Visit";
		output += "<table width = '100%'><tr><td class='sub-title-disp' style='color:" + this.data.QM.VTE_COLOR +";'>"+  sTitle +"</td></tr></table>"
		+ "<table class = 'bc_vte' style='font-size:11px;' width = 100%>";
		if (resJSON.INR.length > 0){
			$.each(resJSON.INR, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures_inrvte'>"
				+ "<td width = '100.0%' align = 'left'>" + info.DISPLAY + ": " + info.RESULT_VAL + " - " + info.RESULT_DT_TM + "</td></tr>";
			})
		}
		if (resJSON.MECHVTE.length > 0){
			$.each(resJSON.MECHVTE, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures_mechvte'>"
				+ "<td width = '100.0%' align = 'left'>" + info.DISPLAY + "</td></tr>";
			})
		}
		if (resJSON.MEDVTE.length > 0){
			$.each(resJSON.MEDVTE, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures_medvte'>"
				+ "<td width = '100.0%' align = 'left'>" + info.DISPLAY + "</td></tr>";
				if (info.EVENT_TAG.length > 0){
					output += "<tr class = 'baycare_qaulity_measures'>"
					+ "<td width = '100.0%' align = 'center'>" + "     Last Given: " + info.EVENT_TAG + " at " + info.LAST_GIVEN_DT_TM + "</td></tr>";
				}
			})
		}
		output += "</table></div>";
	}
	target.innerHTML = output;
}
//*====================================- Quality Measure Compenent End   ----------=====*/
//*====================================- Wound Care Component Begins  ----------=====*/


baycarefl.wound_care_ks = function(){};
baycarefl.wound_care_ks.prototype = new MPage.Component();
baycarefl.wound_care_ks.prototype.constructor = MPage.Component();
baycarefl.wound_care_ks.prototype.base = MPage.Component.prototype;
baycarefl.wound_care_ks.prototype.name = "baycarefl.wound_care_ks";
baycarefl.wound_care_ks.prototype.cclProgram = "bc_mp_pt_wound_care_review";
baycarefl.wound_care_ks.prototype.cclParams = [] ;
baycarefl.wound_care_ks.prototype.cclDataType = "JSON";
baycarefl.wound_care_ks.prototype.init = function(options){
//
//"MINE" ,
//"USERID" =0 ,
//"PERSONID" =0 ,
//"ENCNTRID" =0 ,
//"OPTIONS" =""
//
	var params = [];
	params.push("mine");
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	

	this.cclParams = params;
	//this.data = ""
}

baycarefl.wound_care_ks.prototype.render = function()
{
	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.WC;
	var sTitle = "";
	var output = ""
	
	var Cur_Person = this.getProperty("personId"); //the current person
	if(resJSON.REVIEW.length === 0)
	{	
		sTitle = "No Wound Care Reviews found - Selected Visit";
		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
		+ "<table class = 'bc_vte' style='font-size:11px;' width = 100%></table>";
	}
	else 
	{ 
		sTitle = "Wound Care - Selected Visit";
		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
			+ "<table class = 'bc_qm' style='font-size:11px;' width = 100%>";
		if (resJSON.REVIEW.length > 0){
			$.each(resJSON.REVIEW, function(idx, info){
				output += "<tr class = 'baycare_qaulity_measures'>"
				+ "<td width = '45.0%' align = 'left'>" + info.REVIEW_DISP + "</td>"
				+ "<td width = '30.0%' align = 'left'>" + info.EVENT_TAG + "</td>"
				+ "<td width = '25.0%' align = 'center'>" + info.REVIEW_DT_TM + "</td></tr>";
			})
		}
	}
	output += "</table></div>";
	target.innerHTML = output;
}
//*====================================- Wound Care Component End   ----------=====*/
//*====================================- Cardiology Section Starts  ----------=====*/
baycarefl.cardiology = function(){};
baycarefl.cardiology.prototype = new MPage.Component();
baycarefl.cardiology.prototype.constructor = MPage.Component();
baycarefl.cardiology.prototype.base = MPage.Component.prototype;
baycarefl.cardiology.prototype.name = "baycarefl.cardiology";
baycarefl.cardiology.prototype.cclProgram = "bc_mp_vdo_cardiology";
baycarefl.cardiology.prototype.cclParams = [] ;
baycarefl.cardiology.prototype.cclDataType = "JSON";
baycarefl.cardiology.prototype.init = function(options){

//
//"MINE" ,
//"USERID" =0 ,
//"PERSONID" =0 ,
//"ENCNTRID" =0 ,
//"OPTIONS" =""
//

	var params = [];
	params.push("mine");
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	this.cclParams = params;
	//this.data = ""
}

baycarefl.cardiology.prototype.render = function()
{
	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.TEMP;
	var sTitle = "Last 18 months for all visits (Maximum 10 Documents)";
	var resCnt = resJSON.REC.length; //resJSON.REC.length;
	var output = ""
	
	var Cur_Person = this.getProperty("personId"); //the current person
	if(resCnt === 0)
	{	
		output  += "<table width = '100%'><tr><td class='sub-title-disp'>"+ sTitle +"</td></tr></table>"
		output += "<span class = 'ss-res-none'> No Cardiology Result found! </span>";
	}
	else 
	{ 
		output +=   "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
			+  "<div style='max-height:150px;width:100%;overflow-y:scroll'>"
			+ "<table class = 'sec-content'width = 100%>"
			+ "<tr class = 'pri-sc-hdr' id='tooltipper'>"
			+ "<td width = '50.0%' align = 'left'>Event</td>"
			+ "<td width = '25.0%' align = 'left'>Date/Time</td>"
			+ "<td width = '25.0%' align = 'center'>Status</td></tr>";
			
		for (i = 0; i < resCnt; i++)
		{
			var ord_display = resJSON.REC[i].EVENT;
			var ord_date = resJSON.REC[i].EVENT_DT;
			var ord_status = resJSON.REC[i].EVENT_STATUS;
			var event_id = resJSON.REC[i].EVENT_ID;
			
			output += "<tr background = #000>"
			+ "<td width = '50.0%' class = 'baycare_radiology_order'>"
			+ "<a OnClick = 'launch_docView(" + Cur_Person + "," + event_id + ")';>"  +  ord_display + "</a></td>"
			+ "<td width = '25.0%' align = 'left'  class = 'baycare_radiology_date_status'>"
			+ ord_date + "</td>"
			+ "<td width = '25.0%' align = 'center' class = 'baycare_radiology_date_status'>" + ord_status + "</td>"
			+ "</tr>"

		}	
	
		output += "</table>"
		
	}
	target.innerHTML = output;
}


//*===================================Cardiology Section Ends   ----------=====*/




//*====================================-  CIWA Score Starts---------=====*/

baycarefl.ciwa = function(){};
baycarefl.ciwa.prototype = new MPage.Component();
baycarefl.ciwa.prototype.constructor = MPage.Component();
baycarefl.ciwa.prototype.base = MPage.Component.prototype;
baycarefl.ciwa.prototype.name = "baycarefl.ciwa";
baycarefl.ciwa.prototype.cclProgram = "bc_pc_mp_ciwa";
baycarefl.ciwa.prototype.cclParams = [] ;
baycarefl.ciwa.prototype.cclDataType = "JSON";
baycarefl.ciwa.prototype.init = function(options){

/* Initialize the cclParams variable */

	var params = [];
	params.push("mine");
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("encounterId"));
	
	this.cclParams = params;
	this.data = "";
};

/* Render the basic layout of the component */
baycarefl.ciwa.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	
	var target = this.getTarget();
	var resJSON = this.data.CIWA;
    var resData = resJSON;
	var resCnt = resJSON.CLIST.length;
	var resCnt2 = resJSON.OCNT;
	var ciwaHTML = [];
	
	var sTitle = "Selected Visit"
	
	var Cur_Person = this.getProperty("personId"); //the current person
	if(resCnt === 0 && resCnt2 === 0  )
	{		
		var output1 = "<table width = '100%'><tr><td class='sub-title-disp'>"+ sTitle +"</td></tr></table>"
		output1 += "<span class = 'ss-res-none'> No CIWA Score found! </span>";
		target.innerHTML = output1;
	}
	else
	{ 
		var output = ""			
			output +=   "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
			+  "<div style='max-height:150px;width:100%;' >"
			+ "<table class = 'sec-content'width = 100%>"
			+ "<tr class = 'pri-sc-hdr' id='tooltipper'>"
			+"<td width = '50.0%' align = 'left'></td>"
			+"<td width = '25.0%' align = 'left'>Result</td>"
			+"<td width = '15.0%' align = 'center'>Date/Time</td></tr>";
			


		var event2 = resJSON.EVENT2 ;
		var result2 = resJSON.RESULT2 ;
		var ciwa_date2  = resJSON.CIWA_DT_TM2 ;	
		


		output = output +"<tr background = #000>" 

		
		output = output 
		
		output = output  +"<td width = '50.0%' class = 'baycare_ciwa_score2'>"
		+ event2 + "</td>"
		output = output +"<td width = '25.0%' align = 'left'  class = 'baycare_ciwa_score_date2'>"
		+ result2 + "</td>"
		output = output +"<td width = '15.0%' align = 'left'  class = 'baycare_ciwa_score_date2'>"
		+ "<span><span style='color:gray;'>"+ ciwa_date2 +   "</span>" +"</td>"
		+"</tr>"
	
			for ( i = 0; i < resCnt; i++)
	{ 
	
		var event = resJSON.CLIST[i].EVENT ;
		var result = resJSON.CLIST[i].RESULT2 ;
		var ciwa_score = resJSON.CLIST[i].CIWA_SCORE ;
		var ciwa_date  = resJSON.CLIST[i].CIWA_DT_TM ;	
		


		output = output +"<tr background = #000>" 

		
		output = output 
		
			
	if (ciwa_score >= 8) {
		output = output  +"<td width = '50.0%' class = 'baycare_ciwa_score'>"
		+ "<span><span style='color:red;'>" + "<b>" + event + "</b>"+ "</span>" + "</td>"
		}
	else {
		output = output  +"<td width = '50.0%' class = 'baycare_ciwa_score'>"
		+ event +  "</td>"
		}
if (event == "Risk of Alcohol Withdrawal") {
		output = output +"<td width = '25.0%' align = 'left'  class = 'baycare_ciwa_score_date'>"
		+ result + "</td>"
		}

else {	
	if (ciwa_score >= 8) {
		output = output +"<td width = '25.0%' align = 'left'  class = 'baycare_ciwa_score_date'>"
		+ "<span><span style='color:red;'>" + "<b>" + ciwa_score + "</b>"+  "</span>" + "</td>"
		}
	else  {
		output = output +"<td width = '25.0%' align = 'left'  class = 'baycare_ciwa_score_date'>"
		+ ciwa_score + "</td>"
		}
		}
		
	if (ciwa_score >= 8) {
		output = output +"<td width = '15.0%' align = 'left'  class = 'baycare_ciwa_score_date'>"
		+ "<span><span style='color:red;'>" + "<b>" + ciwa_date + "</b>"+  "</span>" + "</td>"
		+"</tr>"
		}
	else {
		output = output +"<td width = '15.0%' align = 'left'  class = 'baycare_ciwa_score_date'>"
		+ "<span><span style='color:gray;'>"+ ciwa_date +   "</span>" +"</td>"
		+"</tr>"
		}		
		

	}
	




			
		

			output = output + "</table>";

	

 target.innerHTML = output
		
	}
}

//*====================================-  CIWA Score Ends---------=====*/

//*============================ Secondary Review Placeholder starts ====================*/
MPage.namespace("baycarefl.secrev");
baycarefl.secrev = function(){};
baycarefl.secrev.prototype = new MPage.Component();
baycarefl.secrev.prototype.constructor = MPage.Component();
baycarefl.secrev.prototype.base = MPage.Component.prototype;
baycarefl.secrev.prototype.name = "baycarefl.secrev";

baycarefl.secrev.prototype.init = function(options)
{
	//code to perform before immediately rendering (usually updating params is needed)
	var component = this;
}

baycarefl.secrev.prototype.render = function(){
 
    var target = this.getTarget(); 
	var sTitle = "Secondary Review";
	var output = "";
	 
    output += "<table width = '100%'><tr><td class='sub-title-disp'>"+ sTitle +"</td></tr></table>"
    output += "<span class = 'ss-res-none'> This Secondary Review page is for Physician Advisor use only. </span>";
    target.innerHTML = output;
	
    
}
//*============================ Secondary Review Placeholder Ends ====================*/


//*====================================-  Consulting Physicians Starts---------=====*/
baycarefl.con_phys = function(){};
baycarefl.con_phys.prototype = new MPage.Component();
baycarefl.con_phys.prototype.constructor = MPage.Component();
baycarefl.con_phys.prototype.base = MPage.Component.prototype;
baycarefl.con_phys.prototype.name = "baycarefl.con_phys";
baycarefl.con_phys.prototype.cclProgram = "bc_pc_mp_con_physician";
baycarefl.con_phys.prototype.cclParams = [] ;
baycarefl.con_phys.prototype.cclDataType = "JSON";
baycarefl.con_phys.prototype.init = function(options)
{

/* Initialize the cclParams variable */

	var params = [];
	params.push("mine");
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("encounterId"));
	
	this.cclParams = params;
	this.data = "";
}

baycarefl.con_phys.prototype.render = function()
{
	//Takes the data in this.data and loads it into target
	
	var target = this.getTarget();
	var resJSON = this.data.RLIST;
    var resCnt = resJSON.CONSULTS.length;
	var sTitle = "Selected Visit";
	var output = "";
	
	if(resCnt === 0)
	{		
		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+ sTitle +"</td></tr></table>"
		output += "<span class = 'ss-res-none'> No Consulting Physicians found! </span>";
		target.innerHTML = output;
	}
	else
	{ 
		output +=   "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle +"</td></tr></table>"
			+  "<div style='max-height:150px;width:100%;overflow-y:scroll'>"
			+ "<table class = 'sec-content'width = 100%>"
			+ "<tr class = 'pri-sc-hdr' id='tooltipper'>"
			+ "<td width = '5.0%' align = 'left'></td>"
			+ "<td width = '45.0%' align = 'left'></td>"
			
			+ "<td width = '40.0%' align = 'center'>Date/Time</td></tr>";
			
		for (i = 0; i < resCnt; i++)
		{
			var phy_name = resJSON.CONSULTS[i].PER_NAME;
			var beg_eff_date = resJSON.CONSULTS[i].BEG_EFF;
						
			output += "<tr background = #000>"
			
			+ "<td width = '5.0%'></td>"
			+ "<td width = '45.0%' align = 'left'  class = 'baycare_con_phys_name'>"
			+ phy_name + "</td>"
			
			+ "<td width = '40.0%' align = 'center' class = 'baycare_con_phys_date'>" + beg_eff_date + "</td>"
			+ "</tr>"
		}	
		output += "</table>"
	}
	target.innerHTML = output;
}

//*====================================-  Consulting Physicians Ends ---------=====*/

//*====================================-  Scheduled Surgery Starts---------=====*/
baycarefl.sch_surg = function(){};
baycarefl.sch_surg.prototype = new MPage.Component();
baycarefl.sch_surg.prototype.constructor = MPage.Component();
baycarefl.sch_surg.prototype.base = MPage.Component.prototype;
baycarefl.sch_surg.prototype.name = "baycarefl.sch_surg";
baycarefl.sch_surg.prototype.cclProgram = "bc_mp_sch_surg";
baycarefl.sch_surg.prototype.cclParams = [] ;
baycarefl.sch_surg.prototype.cclDataType = "JSON";
baycarefl.sch_surg.prototype.init = function(options)
{

/* Initialize the cclParams variable */

	var params = [];
	params.push("mine");
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("encounterId"));
	
	this.cclParams = params;
	this.data = "";
}

baycarefl.sch_surg.prototype.render = function()
{
	//Takes the data in this.data and loads it into target
	
	var target = this.getTarget();
	var resJSON = this.data.RLIST;
    var resCnt = resJSON.QUAL.length;
	var sTitle = "Selected Visit";
	var output = "";
	
	if(resCnt === 0)
	{		
		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+ sTitle +"</td></tr></table>";
		output += "<span class = 'ss-res-none' style='color:gray' > No Scheduled Surgeries found </span>";
		target.innerHTML = output;
	}
	else
	{ 
		output += "<table width = '100%'><tr><td class='sub-title-disp'>"+ sTitle + "</td></tr></table>"
			+  "<div style='max-height:255px;width:100%;overflow-y:scroll'>"
			+ "<table class = 'sub-title-disp' width = 100%'>"
			+ "<tr id='tooltipper' ><td colspan = '2'>Found (" 
			+ resCnt + ") Procedure(s)</td></tr>"
			
			
		for (i = 0; i < resCnt; i++)
		{
			var sProcedure = "";
			var surg_desc = resJSON.QUAL[i].SURG_DESC;
			var or_room = resJSON.QUAL[i].OR_ROOM;
			var surg_start = resJSON.QUAL[i].SURG_START_DT_TM;
			var surg_stop = resJSON.QUAL[i].SURG_STOP_DT_TM;
			var surgeon = resJSON.QUAL[i].SURGEON_NM;
			var anes_type = resJSON.QUAL[i].ANES_TYPE;
			var sch_start = resJSON.QUAL[i].SCH_START_DT_TM;
			var proc_modi = resJSON.QUAL[i].MODIFIER;
			
			//Determine if pt has any completed surgeries
			if(resJSON.QUAL[i].SURG_CMPLT_QTY > 0)
			{
				//Determine if surg was canceled and then display cancel
				if(resJSON.QUAL[i].SURG_CANCEL > 0)
				{
					sProcedure = "Procedure (CANCELED):";
				}
				else
				{
					sProcedure = "Procedure:";
				}
				
				output += "<tr bgcolor = 'lightgray' style='line-height:10px;'><td colspan = '20'>&nbsp;</td></tr>";
				
				output += "<tr bgcolor='#cddcee'>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>" + sProcedure +"</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + surg_desc + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>OR Room:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + or_room + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Start dt/tm:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + surg_start + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Stop dt/tm:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + surg_stop + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Surgeon:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + surgeon + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Anes Type:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + anes_type + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Modifier:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + proc_modi + "</td>"
				+ "</tr>";
			}
			else
			//list the scheduled surgeries
			{
				//Determine if surg was canceled and then display cancel
				if(resJSON.QUAL[i].SURG_CANCEL > 0)
				{
					sProcedure = "Scheduled Procedure (CANCELED):";
				}
				else
				{
					sProcedure = "Scheduled Procedure:";
				}
				
				output += "<tr bgcolor = 'lightgray' style='line-height:10px;'><td colspan = '20'>&nbsp;</td></tr>";
				
				output += "<tr bgcolor='#cddcee'>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>" + sProcedure +"</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + surg_desc + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>OR Room:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + or_room + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Schedule dt/tm:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + sch_start + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Scheduled Surgeon:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + surgeon + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Anes Type:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + anes_type + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Modifier:</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + proc_modi + "</td>"
				+ "</tr>";				
			}
			
		}	
		output += "</table>";
	}
	target.innerHTML = output;
}

//*====================================-  Scheduled Surgery Ends ---------=====*/
/*Custom Component source code Core Measures*/
/*Updateing for 4.2 CCL script*/
MPage.namespace("cerner");

//sl014066:  These are options that are loaded into the components option structure and can be accessable through getOption() and setOption()
var customCompOptions1 = {
	encntrFilter: 2,
	lookbackNum: 2,
	lookbackUnit: 2,
	conditionId: 0.0
};

var Windowstorage = {
    cache: null,

    get: function(key){
        if (window.name.length > 0) {
            this.cache = ("(" + window.name + ")");
        }
        else {
            this.cache = {};
        }
        return unescape(this.cache[key]);
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

var strStoredIdx = Windowstorage.get("StoredIndex");


MPage.namespace("cerner");
cerner.lh_quality_measures_43 = function(){};
cerner.lh_quality_measures_43.prototype = new MPage.Component();
cerner.lh_quality_measures_43.prototype.constructor = MPage.Component;
cerner.lh_quality_measures_43.prototype.base = MPage.Component.prototype;
cerner.lh_quality_measures_43.prototype.name = "cerner.lh_quality_measures_43"; //Version 4.2
//sl014066:  This is where you can define the script to use when your component loads
cerner.lh_quality_measures_43.prototype.cclProgram = "lh_mp_get_quality_measures_42"; //4.2 ccl script
//sl014066;  You can have predefined parameters here, but most likely you will load the in the init() function
cerner.lh_quality_measures_43.prototype.cclParams = [];
//sl014066:  The custom component framework will create a JavaScript object automagically for you if you set this variable to JSON.  Same deal with XML.
cerner.lh_quality_measures_43.prototype.cclDataType = "JSON";
cerner.lh_quality_measures_43.prototype.init = function(options){
	var params = [];

	params.push("mine");
	//sl014066:  Use the getPorperty methods to get properties made accassable through the architecture
	//Those properties inclue; id, parentComp, personId, userId, encounterId, pprCd, staticContent, positionCd, categoryMean, viewableEncounters, headerTitle, headerOverflowState
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("positionCd"));
	params.push(this.getProperty("pprCd"));
	//sl014066:  These are the options defined in the customCompOptions1 variable above.
	//params.push(0);
	params.push(this.getOption("encntrFilter"));
	params.push(this.getOption("lookbackNum"));
	params.push(this.getOption("lookbackUnit"));
	//params.push(this.getOption("conditionId"));

	if (!isNaN(strStoredIdx))
	{
		params.push(strStoredIdx);
	}
	else
	{
		params.push(0.0);
	}

	this.cclParams = params;
//}

};

cerner.lh_quality_measures_43.prototype.render = function(){
	//Takes the data in this.data and loads it into target
	var element = this.getTarget();
	var ar=[];
	var comp = this;
	var compId = this.getComponentUid();

	try{
		//sl014066:  No need to parse any JSON since the architecture does it for us
		var jsonObj = this.data;
    	var recordData = jsonObj.RECORD_DATA;
		//sl014066:  If you want to show the total outcomes as a count in the subheader you can use component.setProperty("headerSubTitle", "("+totalOutcomes+")").  See three lines below
		var totalOutcomes=recordData.OUTCOMES_COMPLETE.length+recordData.OUTCOMES_INCOMPLETE.length;
		var custComp = this;
		custComp.setProperty("headerSubTitle", "("+totalOutcomes+")");
		ar.push("<div class='lh-content-body scrollable'>");

		//Show all Qualifying Conditions in drop down list
		ar.push("<div class='lh-qm-cbo'><form><span class='lh-qm-cond-lbl'>", recordData.FILTERDISPLAY, "</span><select id='qmTask",compId,"'>");

		//Debugging
		//ar.push("<option value='testing condition 1 id' selected='selected'>testing 1</option>");
		//ar.push("<option value='testing condition 2 id'>testing 2</option>");

		var strAlarmClock = "";
		var path = this.getProperty("compSourceLocation");
		
		//if path exists, this is Mpages 5.X, otherwise it is pre-5.X
		if (path && path != 'undefined')
		{
			var strAlarmIcon = "'" + path + "img/4798_16.png'";
		}
		else
		{
			path = this.getProperty("staticContent");
			var strAlarmIcon = "'" + path + "\\custom-components\\img\\4798_16.png'";
		}

		for(var i=0;i<recordData.CONDITIONS.length;i++){
			if(recordData.CONDITIONS[i].CONDITION_ID==recordData.SELECTED_CONDITION_ID)
			{
				ar.push("<option value="+recordData.CONDITIONS[i].CONDITION_ID
						+" selected='selected'>"+recordData.CONDITIONS[i].CONDITION_NAME+"</option>");
			}else{
			ar.push("<option value="+recordData.CONDITIONS[i].CONDITION_ID+">"
					+recordData.CONDITIONS[i].CONDITION_NAME+"</option>");
			}
		}

		ar.push("</select></form></div>");

		//DIV for Incomplete and Compelete
		ar.push("<div id='condID",compId,"'>");

		//Incomplete Section
		ar.push("<div id='incomp" + compId + "' class='lh-sub-sec'>");

			ar.push("<h3 class='lh-sub-sec-hd'><span class='lh-sub-sec-hd-tgl' title=",i18n.HIDE_SECTION,">-</span><span class='lh-sub-sec-title'>"
					,i18n.QM_INCOMPLETE," (",recordData.OUTCOMES_INCOMPLETE.length,")</span></h3>");

			ar.push("<div class='lh-sub-sec-content'>");

			if(recordData.OUTCOMES_INCOMPLETE.length>0)
			{
				for(var j=0;j<recordData.OUTCOMES_INCOMPLETE.length;j++){

					//*Create new section for each outcome (ex:VTE Overlap Therapy)
					ar.push("<div class='lh-sub-sub-sec-content'>"); //*001 New class

						var tip = "Tip" + j;

						var hoverDisplay = "";
						hoverDisplay = recordData.OUTCOMES_INCOMPLETE[j].HOVERDISPLAY;

							//Hover Div
							ar.push("<div id= ",tip," left='' top='' style='position:absolute; z-index:1000;background-color:#FFC;border:1px solid #000;padding:5px; visibility: hidden;'>"
							,hoverDisplay,"</div>");

						//*Create Outcome header with toggle

						strAlarmClock = "";
						if (recordData.OUTCOMES_INCOMPLETE[j].SHOWICONIND == '1')
						{
							strAlarmClock += "<span>&nbsp;&nbsp;&nbsp;";
							strAlarmClock += "<img src=" + strAlarmIcon + "/>" ;
							strAlarmClock += "</span>"
						}

						ar.push("<h3 class='lh-sub-sec-hd-test'><span class='lh-sub-sec-hd-tgl' title=",i18n.HIDE_SECTION
							,">-</span><span class='lh-sub-sec-title' onmouseover='cerner.lh_quality_measures_43.prototype.ShowHover(\"" + recordData.OUTCOMES_INCOMPLETE[j].HOVERDISPLAY + "\"," + j + "," + 0 + "," + -15 + ");' onmouseout='cerner.lh_quality_measures_43.prototype.HideHover(",j,");'>"
							,recordData.OUTCOMES_INCOMPLETE[j].OUTCOME_NAME,"</span>",strAlarmClock,"</h3>");
						ar.push("<div class='lh-sub-sec-content'>");

							//Loop through each Measure
							for(var k=0;k<recordData.OUTCOMES_INCOMPLETE[j].MEASURES.length;k++){

								//Reset for each Measure
								firstTaskFound = 0;

								//Create each Measures (ex:Warfarin)
								ar.push("<dl class='lh-qm-info'>");
								ar.push("<dt><span>measure</span></dt><dd class='lh-qm-ic-name'><span>"
								,recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].NAME,"</span></dd>");
								ar.push("</dl>");


								//Create each Measures Data (ex:Order Administer Reconcile)
								ar.push("<dl class='lh-qm-info'>");
								ar.push("<dt>");
								ar.push("<dd class='lh-qm-ic-name-grp'>"); //* New Class 001

								//If ORDERS is part of this Measure
								if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ORDERSETIND == 1){

									if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ORDERPRESENTIND == 1){
										ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInOrder'>" //* New Class 001
										,recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ORDERINCOMPLETEDISPLAY,"</span>");
									} else {
										if (recordData.OUTCOMES_INCOMPLETE[j].DITHERMEASUREIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DITHERMEASUREIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.ORDERDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ORDERTASKIND == 1){
											ar.push("<a id = 'openInOrder' onclick='cerner.lh_quality_measures_43.prototype.OpenQMOrderWindow(" + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.ORDERDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ORDERTASKIND == 2){
											ar.push("<a id = 'openInOrder' onclick='cerner.lh_quality_measures_43.prototype.OpenQMOrderProfileWindow(" + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.ORDERDISPLAY,"</a>");
										}

									}
									firstTaskFound = 1;

								}

								//If COLLECT is part of this Measure
								if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLSETIND == 1){

									if (firstTaskFound == 1){
										ar.push(" | ");
									}
 
									if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLPRESENTIND == 1){
										ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInCol'>" //* New Class 001
										,recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLINCOMPLETEDISPLAY,"</span>");
									} else {
										if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLTASKIND == 1){ //MOEW
											ar.push("<a id = 'openInPresOrder' onclick='cerner.lh_quality_measures_43.prototype.OpenQMOrderWindow("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.COLDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLTASKIND == 3){ // POWERFORM
											ar.push("<a id = 'openInColForm' onclick='cerner.lh_quality_measures_43.prototype.OpenQMForm("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + "," +recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLFORMID +")'>",recordData.COLDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLTASKIND == 4){ //IVIEW
											ar.push("<a id = 'openInDocView' onclick='cerner.lh_quality_measures_43.prototype.OpenChartTab(\"" + recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLTABNAME + "\" ," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.COLDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLTASKIND == 5){ //PowerNote
										
											//support old powernote as well
											if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLTABNAME.indexOf("!") > 0)
												{ar.push("<a id = 'openInDocNote' onclick='cerner.lh_quality_measures_43.prototype.OpenQMPowerNote(\"" + recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLTABNAME + "\"," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.COLDISPLAY,"</a>");}
											else
												{ar.push("<a id = 'openInDocNote' onclick='cerner.lh_quality_measures_43.prototype.AddEPByCKI(\"" + recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].COLTABNAME + "\"," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.COLDISPLAY,"</a>");}

										}

									}

									firstTaskFound = 1;
								}


								//If ADMINISTER is part of this Measure
								if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ADMINSETIND == 1){

									if (firstTaskFound == 1){
										ar.push(" | ");
									}

									if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ADMINPRESENTIND == 1){
										ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInAdmin'>" //* New Class 001
										,recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ADMININCOMPLETEDISPLAY,"</span>");
									} else{
										if (recordData.OUTCOMES_INCOMPLETE[j].DITHERMEASUREIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DITHERMEASUREIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.ADMINDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ADMINTASKIND == 2){ //MAR
											ar.push("<a id = 'openInAdminMAR' onclick='cerner.lh_quality_measures_43.prototype.OpenChartTab(\"" + recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ADMINTABNAME + "\" ," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.ADMINDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ADMINTASKIND == 3){ //PowerForm
											ar.push("<a id = 'openInAdminForm' onclick='cerner.lh_quality_measures_43.prototype.OpenQMForm("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + "," +recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ADMINFORMID +")'>",recordData.ADMINDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ADMINTASKIND == 4){ //IView
											ar.push("<a id = 'openInAdminView' onclick='cerner.lh_quality_measures_43.prototype.OpenChartTab(\"" + recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ADMINTABNAME + "\" ," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.ADMINDISPLAY,"</a>");
										}

									}

									firstTaskFound = 1;
								}


								//If PRESCRIBE is part of this Measure
								if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].PRESSETIND == 1){
									if (firstTaskFound == 1){
										ar.push(" | ");
									}

									if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].PRESPRESENTIND == 1){
										ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInPres'>" //* New Class 001
										,recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].PRESINCOMPLETEDISPLAY,"</span>");
									} else{
										if (recordData.OUTCOMES_INCOMPLETE[j].DITHERACEIPRESIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DITHERPRESAMIIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.PRESDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].DITHERARBPRESIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DITHERPRESAMIIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.PRESDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].DITHERMEASUREIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DITHERMEASUREIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.PRESDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].PRESTASKIND == 1){ //MOEW
											ar.push("<a id = 'openInPresOrder' onclick='cerner.lh_quality_measures_43.prototype.OpenQMOrderWindow("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.PRESDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].PRESTASKIND == 6){ //MedsRec
											ar.push("<a id = 'openInPresRec' onclick='cerner.lh_quality_measures_43.prototype.OpenQMMedsRec("+ recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.PRESDISPLAY,"</a>");
										}
									}

									firstTaskFound = 1;
								}


								//If DOCUMENT is part of this Measure
								if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCSETIND == 1){

									if (firstTaskFound == 1){
										ar.push(" | ");
									}
									if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCPRESENTIND == 1){

										if (recordData.OUTCOMES_INCOMPLETE[j].DITHERDOCIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DELAYDITHERIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].DITHERDOCIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].VANCOPRESIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										//PCI Delay = 2
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].DITHERDOCIND == 2 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DELAYDITHERIND == 2){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else {
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>" //* New Class 001
											,recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCINCOMPLETEDISPLAY,"</span>");
										}
									} else{

										if (recordData.OUTCOMES_INCOMPLETE[j].DITHERMEASUREIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DITHERMEASUREIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										} //VTE Oral Factor Xa
										else if (recordData.OUTCOMES_INCOMPLETE[j].DITHERDOCIND == 3 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].ORALFACTORDITHER == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].ADMINMETIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].CONTRAIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].PRESMETIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].CONTRAIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].DITHERDOCIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DELAYDITHERIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].DITHERDOCIND == 1 && recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].VANCOPRESIND == 1){
											ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayInDoc'>",recordData.DOCDISPLAY,"</span>");
										}

										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCTASKIND == 1){ //MOEW
											ar.push("<a id = 'openInDocOrder' onclick='cerner.lh_quality_measures_43.prototype.OpenQMOrderWindow(" + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.DOCDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCTASKIND == 3){ //PowerForm

											ar.push("<a id = 'openInDocForm' onclick='cerner.lh_quality_measures_43.prototype.OpenQMForm(" + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + "," + recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCFORMID +")'>",recordData.DOCDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCTASKIND == 4){ //IVIEW
											ar.push("<a id = 'openInDocView' onclick='cerner.lh_quality_measures_43.prototype.OpenChartTab(\"" + recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCTABNAME + "\" ," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.DOCDISPLAY,"</a>");
										}
										else if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCTASKIND == 5){ //PowerNote
												//support old powernote as well
												if (recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCTABNAME.indexOf("!") > 0)
													{ar.push("<a id = 'openInDocNote' onclick='cerner.lh_quality_measures_43.prototype.OpenQMPowerNote(\"" + recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCTABNAME + "\"," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.DOCDISPLAY,"</a>");}
												else
													{ar.push("<a id = 'openInDocNote' onclick='cerner.lh_quality_measures_43.prototype.AddEPByCKI(\"" + recordData.OUTCOMES_INCOMPLETE[j].MEASURES[k].DOCTABNAME + "\"," + recordData.PERSON_ID + "," +  recordData.ENCNTR_ID + ")'>",recordData.DOCDISPLAY,"</a>");}
											
										}

									}

									firstTaskFound = 1;
								}

								ar.push("</dd>");
								ar.push("</dt>");
								ar.push("</dl>");

							} //for(var k=0;k<recordData.OUTCOMES_INCOMPLETE[j].MEASURES.length;k++){ , Loop through each measure


						ar.push("</div>");//ar.push("<div class='lh-sub-sec-content'>");

						//*Close DIV for Outcome
						ar.push("</div>"); //ar.push("<div class='lh-sub-sub-sec-content'>"); //*001 New class

						//*Shows docuemnt icon on mouseover* ar.push("<dl class='lh-qm-info' onmouseover='CERN_QUALITY_MEASURES_O1.ShowIcon(this)' onmouseout='CERN_QUALITY_MEASURES_O1.HideIcon(this)'>");
						//*Prints outcome name* ar.push("<dt><span>measure</span></dt><dd class='lh-qm-ic-name'><span>"+recordData.OUTCOMES_INCOMPLETE[j].OUTCOME_NAME+"</span></dd>");
						//*Lauches specific Powerform for outcome* ar.push("<dt><span>measure</span></dt><dd class='qm-doc'><span class='cmp-doc' onclick='CERN_QUALITY_MEASURES_O1.OpenQMDoc("+recordData.OUTCOMES_INCOMPLETE[j].FORM_REF_ID+","+recordData.OUTCOMES_INCOMPLETE[j].FORM_ACT_ID+")'>&nbsp;</span></dd>");
						//*Close dl* ar.push("</dl>");

					} //for(var j=0;j<recordData.OUTCOMES_INCOMPLETE.length;j++){ , Loop through each outcome


				}else{ //(recordData.OUTCOMES_INCOMPLETE.length>0)
					ar.push("<span class='lh-res-none'>",i18n.NO_RESULTS_FOUND,"</span>");
				}

			ar.push("</div>"); //ar.push("<div class='lh-sub-sec-content'>");
		ar.push("</div>");	//ar.push("<div class='lh-sub-sec'>");, Incomplete Section

		//Complete Section
		ar.push("<div id='comp" + compId + "' class='lh-sub-sec'>");

			ar.push("<h3 class='lh-sub-sec-hd'><span class = 'lh-sub-sec-hd-tgl' title="+i18n.HIDE_SECTION+"></span><span class='lh-sub-sec-title'>"
				+i18n.QM_COMPLETE+" (",recordData.OUTCOMES_COMPLETE.length,")</span></h3>");

				ar.push("<div class='lh-sub-sec-content'>");

				if(recordData.OUTCOMES_COMPLETE.length>0){

					for(var j=0;j<recordData.OUTCOMES_COMPLETE.length;j++){

						//*Create new section for each outcome (ex:VTE Overlap Therapy)
						ar.push("<div class='lh-sub-sub-sec-content'>"); //*001 New class

						var tip2 = "TipA" + j;

						var hover2Display = "";
						hover2Display = recordData.OUTCOMES_COMPLETE[j].HOVERDISPLAY;

						//Hover Div
						ar.push("<div id= ",tip2," left='' top='' style='position:absolute; z-index:1000;background-color:#FFC;border:1px solid #000; visibility: hidden;'>"
							,hover2Display,"</div>");

						strAlarmClock = "";
						if (recordData.OUTCOMES_COMPLETE[j].SHOWICONIND == '1')
						{
							strAlarmClock += "<span>&nbsp;&nbsp;&nbsp;";
							strAlarmClock += "<img src=" + strAlarmIcon + "/>" ;
							strAlarmClock += "</span>"
						}

						//*Create Outcome header with toggle
						ar.push("<h3 class='lh-sub-sec-hd-test'><span class='lh-sub-sec-hd-tgl' title=",i18n.HIDE_SECTION
						,">-</span><span class='lh-sub-sec-title' onmouseover='cerner.lh_quality_measures_43.prototype.ShowHover(\"" + recordData.OUTCOMES_COMPLETE[j].HOVERDISPLAY + "\"," + j + "," + 0 + "," + -15 + ",\"TipA\");' onmouseout='cerner.lh_quality_measures_43.prototype.HideHover("+ j + ",\"TipA\");'>"
						,recordData.OUTCOMES_COMPLETE[j].OUTCOME_NAME,"</span>",strAlarmClock,"</h3>");

						ar.push("<div class='lh-sub-sec-content'>");

						//Loop through each Measure
						for(var k=0;k<recordData.OUTCOMES_COMPLETE[j].MEASURES.length;k++){

							//Reset for each Measure
							firstTaskFound = 0;

							//Create each Measures (ex:Warfarin)
							ar.push("<dl class='lh-qm-info'>");
							ar.push("<dt><span>measure</span></dt><dd class='lh-qm-ic-name'><span>"
								,recordData.OUTCOMES_COMPLETE[j].MEASURES[k].NAME,"</span></dd>");
							ar.push("</dl>");


							//Create each Measures Data (ex:Order Administer Reconcile)
							ar.push("<dl class='lh-qm-info'>");
							ar.push("<dt>");
							ar.push("<dd class='lh-qm-ic-name-grp'>"); //* New Class 001

							//If ORDERS is part of this Measure
							if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].ORDERSETIND == 1){

								if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].ORDERPRESENTIND == 1){
									ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayOrder'>" //* New Class 001
									,recordData.OUTCOMES_COMPLETE[j].MEASURES[k].ORDERCOMPLETEDISPLAY,"</span>");
								} else{
									ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayOrder'>",recordData.ORDERDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							//If Collect is part of this Measure
							if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].COLSETIND == 1){

								if (firstTaskFound == 1){
									ar.push(" | ");
								}

								if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].COLPRESENTIND == 1){
									ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayCol'>" //* New Class 001
									,recordData.OUTCOMES_COMPLETE[j].MEASURES[k].COLCOMPLETEDISPLAY,"</span>");
								} else{
									ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayCol'>",recordData.COLDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							//If ADMINISTER is part of this Measure
							if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].ADMINSETIND == 1){
								if (firstTaskFound == 1){
									ar.push(" | ");
								}
								if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].ADMINPRESENTIND == 1){
									ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayAdmin'>" //* New Class 001
									,recordData.OUTCOMES_COMPLETE[j].MEASURES[k].ADMINCOMPLETEDISPLAY,"</span>");
								} else {
									ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayAdmin'>",recordData.ADMINDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							//If PRESCRIBE is part of this Measure
							if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].PRESSETIND == 1){
								if (firstTaskFound == 1){
									ar.push(" | ");
								}
								if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].PRESPRESENTIND == 1){
									ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayPres'>" //* New Class 001
									,recordData.OUTCOMES_COMPLETE[j].MEASURES[k].PRESCOMPLETEDISPLAY,"</span>");
								} else{
									ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayPres'>",recordData.PRESDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							//If DOCUMENT is part of this Measure
							if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].DOCSETIND == 1){
								if (firstTaskFound == 1){
									ar.push(" | ");
								}
								if (recordData.OUTCOMES_COMPLETE[j].MEASURES[k].DOCPRESENTIND == 1){

									if (recordData.OUTCOMES_COMPLETE[j].DITHERDOCIND == 1 && recordData.OUTCOMES_COMPLETE[j].MEASURES[k].DELAYDITHERIND == 1){
										ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>" //* New Class 001
										,recordData.DOCDISPLAY,"</span>");
									}
									else if (recordData.OUTCOMES_COMPLETE[j].DITHERDOCIND == 2 && recordData.OUTCOMES_COMPLETE[j].MEASURES[k].DELAYDITHERIND == 2){
										ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>" //* New Class 001
										,recordData.DOCDISPLAY,"</span>");
									}
									else if (recordData.OUTCOMES_COMPLETE[j].DITHERDOCIND == 1 && recordData.OUTCOMES_COMPLETE[j].MEASURES[k].VANCOPRESIND == 1) {
										ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>" //* New Class 001
										,recordData.DOCDISPLAY,"</span>");
									}

									else{

										ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>" //* New Class 001
										,recordData.OUTCOMES_COMPLETE[j].MEASURES[k].DOCCOMPLETEDISPLAY,"</span>");
									}

								} else{
									ar.push("<span class = 'lh-qm-ic-name-display' id = 'displayDoc'>",recordData.DOCDISPLAY,"</span>");
								}

								firstTaskFound = 1;
							}

							ar.push("</dd>");
							ar.push("</dt>");
							ar.push("</dl>");


						} //for(var k=0;k<recordData.OUTCOMES_COMPLETE[j].MEASURES.length;k++){	, Loop through each measure

						ar.push("</div>"); //ar.push("<div class='lh-sub-sec-content'>");


						//*Close DIV for Outcome
						ar.push("</div>"); //ar.push("<div class='lh-sub-sub-sec-content'>");


					} //for(var j=0;j<recordData.OUTCOMES_COMPLETE.length;j++){, Loop through each outcome
				}else{
					if(recordData.OUTCOMES_COMPLETE.length===0){
						ar.push("<span class='lh-res-none'>",i18n.NO_RESULTS_FOUND,"</span>");
					}
				}

				ar.push("</div>"); //ar.push("<div class='lh-sub-sec-content'>");

		ar.push("</div>"); //ar.push("<div class='lh-sub-sec'>");, Complete Section

		ar.push("</div>"); //ar.push("<div id='condID",compId,"'>");, DIV for Incomplete and Compelete
		ar.push("</div>"); //ar.push("<div class='lh-content-body scrollable'>");


		}catch(err){

						alert("error in QM" + err);

		}
	element.innerHTML = ar.join("");

	//Add selection events to the drop down box
	//sl014066:  You have to add selection event after the HTML elements have been created because there is no way to pass objects otherwise.
	var dropDown = document.getElementById("qmTask"+compId);

	dropDown.onchange = function(element){
		Windowstorage.set("StoredIndex",this.value);
		comp.LoadCondition(this.options[this.selectedIndex], comp);
	};

	//Init subsection toggles
	//NOTE this will not work outside of Cerner's architecture

	MP_Util.Doc.InitSubToggles(element, 'lh-sub-sec-hd-tgl');

	//Util.Style.acss(element, 'closed');
};


//sl014066: Gloabl function needs to be added to the component's prototype
cerner.lh_quality_measures_43.prototype.ShowHover = function(strHoverText, idValue, xOffSet, yOffSet, idStr){

	idStr = idStr || "Tip"
	
	var x = "";
	var y = "";
	var tmpID = idStr + idValue;
	var tDIV = document.getElementById(tmpID);
	
	tDIV.style.left = '';
	tDIV.style.top = '';

	x = tDIV.offsetLeft;
	tDIV.setAttribute('left',x);
	y = tDIV.offsetTop;
	tDIV.setAttribute('top',y);

	x = parseInt(x) - parseInt(xOffSet);
	y = parseInt(y) - parseInt(yOffSet);

	tDIV.style.left = x;
	tDIV.style.top = y;

	tDIV.style.width = "250px";
	//tDIV.style.cursor = "hand";
	tDIV.style.visibility = "visible";

};


//sl014066: Gloabl function needs to be added to the component's prototype
cerner.lh_quality_measures_43.prototype.HideHover = function(valueHide,idHide){
	idHide = idHide || "Tip"
	var tmpID = idHide + valueHide;
	var tDIV = document.getElementById(tmpID);
	tDIV.style.visibility = "hidden";

};

//sl014066: Gloabl function needs to be added to the component's prototype
cerner.lh_quality_measures_43.prototype.OpenQMOrderWindow = function(qmpersonId, qmencntrID){

	var orderWindowString = qmpersonId + "|" + qmencntrID + "|";
	orderWindowString += "{ORDER|0|0|0|0|0}";
	orderWindowString += "|24|{2|127}{3|127}|8";
	MP_Util.LogMpagesEventInfo(null,"ORDERS",orderWindowString,"qualitymeasures.js","OpenQMOrderWindow");
	MPAGES_EVENT("Orders",orderWindowString);

};

cerner.lh_quality_measures_43.prototype.OpenQMOrderProfileWindow = function(qmpersonId, qmencntrID){

	var mrObject = {};
	mrObject = window.external.DiscernObjectFactory("ORDERS");
	mrObject.PersonId = qmpersonId;
 	mrObject.EncntrId = qmencntrID;
 	mrObject.reconciliationMode = 0;
	MP_Util.LogMpagesEventInfo(null,"ORDERS","OpenQMMedsRec","qualitymeasures.js","OpenQMMedsRec");
	mrObject.LaunchOrdersMode(0, 0, 0); //2 -  Meds Rec

};

//sl014066: Gloabl function needs to be added to the component's prototype
cerner.lh_quality_measures_43.prototype.OpenQMForm = function(qmpersonId, qmencntrID, formID){


	var dPersonId = qmpersonId;
	var dEncounterId = qmencntrID;
	var activityId = 0.0;
	var chartMode = 0;
	var mpObj = window.external.DiscernObjectFactory("POWERFORM");
	mpObj.OpenForm(dPersonId, dEncounterId, formID, activityId, chartMode);

};

//sl014066: Gloabl function needs to be added to the component's prototype
cerner.lh_quality_measures_43.prototype.OpenChartTab = function(tabName, qmpersonId, qmencntrID){

	var alink = "";
	var jlink = "";

	//jw014069: Changed applink from being hardcoded to powerchart.exe to instead use variable containing currently running clone
	alink = 'javascript:APPLINK(0,"$APP_AppName$","/PERSONID=' + qmpersonId + ' /ENCNTRID=' + qmencntrID + ' /FIRSTTAB=^' + tabName + '^");';

	if(document.getElementById("hrefLaunchTab"))
	{
		document.body.removeChild(document.getElementById("hrefLaunchTab"));
	}
	jlink =  document.createElement("a");
	jlink.id = "hrefLaunchTab";
	jlink.href = alink;
	document.body.appendChild(jlink);
	document.getElementById("hrefLaunchTab").click();
};

//sl014066: Gloabl function needs to be added to the component's prototype
cerner.lh_quality_measures_43.prototype.OpenQMPowerNote = function(noteName, qmpersonId, qmencntrID){

	var person_id = qmpersonId;
	var encounter_id = qmencntrID;
	var noteset = "";
	noteset = person_id + "|" + encounter_id + "|";

	noteset += noteName;
	noteset += "|0";

	var noteXmlStr = MPAGES_EVENT("POWERNOTE", noteset);
};

//sl014066: Gloabl function needs to be added to the component's prototype
cerner.lh_quality_measures_43.prototype.OpenQMMedsRec = function(qmpersonId, qmencntrID){

	var mrObject = {};
	var code = MP_Util.GetCodeValueByMeaning("DISCHARGEMED", 54732);
	mrObject = window.external.DiscernObjectFactory("ORDERS"); 
	mrObject.PersonId = qmpersonId; 
	mrObject.EncntrId = qmencntrID; 
	mrObject.reconciliationMode = 3;
	mrObject.defaultVenue = (code) ? code.codeValue : 0;
	MP_Util.LogMpagesEventInfo(null,"ORDERS","OpenQMMedsRec","qualitymeasures.js","OpenQMMedsRec");
	mrObject.LaunchOrdersMode(2, 0, 0); //2 -  Meds Rec
};

//sl014066: Gloabl function needs to be added to the component's prototype
cerner.lh_quality_measures_43.prototype.InitSubToggles = function(par, tog){
	 var i18nCore = i18n.discernabu;
		    var toggleArray = Util.Style.g(tog, par, "span");
		    for (var k=0; k<toggleArray.length; k++) {
		        Util.addEvent(toggleArray[k], "click", MP_Util.Doc.ExpandCollapse);
		        var checkClosed = Util.gp(Util.gp(toggleArray[k]));
		        if (Util.Style.ccss(checkClosed, "closed")) {
		            toggleArray[k].innerHTML = "+";
		            toggleArray[k].title = i18nCore.SHOW_SECTION;
		        }
		    }
};

cerner.lh_quality_measures_43.prototype.LoadCondition = function(element,comp){

	//Get the value selected in the drop down
	var selectedValue = element.value;
	var params = [];

	//Create the callback function
	var callback = function(compReference){
		compReference.render();
	}

	//Update the cclParams value
	params.push("mine");
	params.push(comp.getProperty("personId"));
	params.push(comp.getProperty("encounterId"));
	params.push(comp.getProperty("userId"));
	params.push(comp.getProperty("positionCd"));
	params.push(comp.getProperty("pprCd"));
	params.push(comp.getOption("encntrFilter"));
	params.push(comp.getOption("lookbackNum"));
	params.push(comp.getOption("lookbackUnit"));
	params.push(selectedValue);

	comp.cclParams = params;

	//Update the cclProgram value if needed
	//comp.cclProgram = "lh_mp_get_filtered_qual"

	comp.setProperty("headerSubTitle", "Loading...");

	//call the loadData function which will make the CCL call and load its response into the component.
	comp.loadData(callback);

};

MPage.namespace("cerner");

/*Initialize Cloud Outcomes Component*/
cerner.cloud_outcomes = function(){};
cerner.cloud_outcomes.prototype = new MPage.Component();
cerner.cloud_outcomes.prototype.constructor = MPage.Component;
cerner.cloud_outcomes.prototype.base = MPage.Component.prototype;
cerner.cloud_outcomes.prototype.name = "cerner.cloud_outcomes";
cerner.cloud_outcomes.prototype.cclProgram = "MP_GET_OUTCOMES";
cerner.cloud_outcomes.prototype.cclParams = [];
cerner.cloud_outcomes.prototype.cclDataType = "JSON";

/* Initialize the cclParams variable */
cerner.cloud_outcomes.prototype.init = function(options){
	var params = [];
	//Set the params for the component
	params.push("MINE");
	params.push(this.getProperty("personId"));
	this.cclParams = params;
	this.data = "";
};

/* Render the basic layout of the component */
cerner.cloud_outcomes.prototype.render = function(){
	var outcome;
	var detail;
	var factor;
	var fdetail;
	var num;
	var contentArea = this.getTarget();
	
	$(contentArea).addClass("cloud_outcomes");
	
	//Retrieve the outcomes
	outcomes = this.data.OUTCOMEINFO;

	var divElement = document.createElement("div");
	var trElement = null;
	var tableElement = document.createElement("table");
	var thElement = document.createElement('thead');
	var thRowElement = document.createElement('tr');
	var tableBodyElement = document.createElement("tbody");
	var och = document.createElement("th");
	var dth = document.createElement("th");
	var sch = document.createElement("th");
	och.innerHTML = "Outcome";
	och.className = 'cerner_outcomes_header';
	dth.innerHTML = "Date";
	dth.className = 'cerner_outcomes_header';
	sch.innerHTML = "Score";
	sch.className = 'cerner_outcomes_header';
	thRowElement.appendChild(och);
	thRowElement.appendChild(dth);
	thRowElement.appendChild(sch);
	thElement.appendChild(thRowElement);
	
	for(var x = 0; x < outcomes.OUTCOMES.length; x++){
	
		outcome = outcomes.OUTCOMES[x];
		var dateString;
		var outcomeDate = new Date(outcome.OUTCOME_DATE);
		var outcomeType;
		var score;
		var day = outcomeDate.getDate();
		var month = outcomeDate.getMonth()+1;
		var year = outcomeDate.getFullYear();
		var hour = outcomeDate.getHours();
		var minute = outcomeDate.getMinutes();
		dateString = (month<=9?'0'+month:month) + '/' + (day<=9?'0'+day:day) + '/' + year + " " + (hour<=9?'0'+hour:hour) + ":" + (minute<=9?'0'+minute:minute);

				num = outcome.RISK_SCORE;
				var trElement = document.createElement("tr");
				var oc = document.createElement("td");
				var dt = document.createElement("td");
				var sc = document.createElement("td");
				if (outcome.OUTCOME_NAME > "") {
					outcomeType = outcome.OUTCOME_NAME;
				} else {
					outcomeType = outcome.OUTCOME_TYPE
				}
				oc.innerHTML = outcomeType;
				oc.className = 'cerner_outcomes_row';
				dt.innerHTML = dateString;
				dt.className = 'cerner_outcomes_row';
				if (num > 0 && num < 21) {
					score = "Very Low";
				} else if (num > 20 && num < 40) {
					score = "Low";
				} else if (num > 39 && num < 60) {
					score = "Moderate";
				} else if (num > 59 && num < 81) {
					score = "High";
				} else if (num > 80 && num < 101) {
					score = "Very High";
				} else if (num == 0) {
					score = "Not Available";
				}
				sc.innerHTML = score;
				sc.className = 'cerner_outcomes_row';

				var ftrElement = null;
				var ftableElement = document.createElement("table");
				var ftableHElement = document.createElement("thead");
				var fthRowElement = document.createElement('tr');
				var fnameh = document.createElement("th");
				var finfoh = document.createElement("th");
				fnameh.innerHTML = "Contributing Risk Factors";
				fnameh.className = 'cerner_outcomes_detail_header';
				finfoh.innerHTML = "";
				finfoh.className = 'cerner_outcomes_detail_header';
				fthRowElement.appendChild(fnameh);
				fthRowElement.appendChild(finfoh);
				ftableHElement.appendChild(fthRowElement);
			
				var ftableBodyElement = document.createElement("tbody");
				for (var z = 0; z < outcome.OUTCOME_FACTORS.length; z++) {
					factor = outcome.OUTCOME_FACTORS[z];
					var ftrElement = document.createElement("tr");
					var fname = document.createElement("td");
					var finfo = document.createElement("td");
					fname.innerHTML = factor.NAME;
					fname.className = 'cerner_outcomes_detail_row';
					var infoStr = "";
					for (var j = 0; j < factor.DETAILS.length; j++) {
						fdetail = factor.DETAILS[j];
						if (fdetail.DETAIL_TYPE == "INTERPRETATION_STRING") {
							if (infoStr.length == 0) {
								infoStr = fdetail.DETAIL_INFO;
							} else {
								infoStr = infoStr + "; " + fdetail.DETAIL_INFO;
							}
						} else if (fdetail.DETAIL_TYPE == "INTERPRETATION_NUMERIC") {
							if (infoStr.length == 0) {
								infoStr = fdetail.DETAIL_INFO;
							} else {
								infoStr = infoStr + "; " + fdetail.DETAIL_INFO;
							}
						} else if (fdetail.DETAIL_TYPE == "UNIT") {
							if (infoStr.length == 0) {
								infoStr = fdetail.DETAIL_INFO;
							} else {
								infoStr = infoStr + "; " + fdetail.DETAIL_INFO;
							}
						} else if (fdetail.DETAIL_TYPE == "FACT_IDENTIFIER") {
							infoStr = infoStr;
						} else if (fdetail.DETAIL_TYPE == "INTERPRETATION_BOOLEAN") {
							var iInd;
							if (fdetail.DETAIL_INFO == "false") {
								iInd = "No";
							} else {
								iInd = "Yes";
							}
							if (infoStr.length == 0) {
								infoStr = iInd;
							} else {
								infoStr = infoStr + "; " + iInd;
							}
						}
					}
					finfo.innerHTML = infoStr;
					finfo.className = 'cerner_outcomes_detail_row';
					ftrElement.appendChild(fname);
					ftrElement.appendChild(finfo);
					ftableBodyElement.appendChild(ftrElement);
				}
				ftableElement.appendChild(ftableHElement);
				ftableElement.appendChild(ftableBodyElement);
			
				trElement.setAttribute('data-factorInfo', ftableElement.outerHTML);
				var title = "Risk Score: " + num;
				trElement.setAttribute('data-factorTitle', title);
				trElement.className = 'cerner_cloud_outcomes';
				trElement.appendChild(oc);
				trElement.appendChild(dt);
				trElement.appendChild(sc);

				var clickHandler = function (event) {
					var factorInfo = event.currentTarget.getAttribute("data-factorInfo");
					var factorTitle = event.currentTarget.getAttribute("data-factorTitle");
					
					// pop-up for alert details
					cerner.cloud_outcomes_factors(factorInfo, factorTitle);
				};
				$(trElement).click(clickHandler);

				tableBodyElement.appendChild(trElement);
	}

	tableElement.appendChild(thElement);
	tableElement.appendChild(tableBodyElement);
	divElement.appendChild(tableElement);
	divElement.className = 'cerner_outcomes_div';

	if(outcomes.OUTCOMES.length > 0){
		contentArea.appendChild(divElement);
	} else {
		contentArea.innerHTML = "No results found";
	}
};

// factor details pop up dialog
cerner.cloud_outcomes_factors = function(factorInfo ,title){

	var factorInfoUtil = new ModalDialog("factorDetails")
			.setHeaderTitle(title)
			.setShowCloseIcon(true)
			.setTopMarginPercentage(15)
			.setRightMarginPercentage(30)
			.setBottomMarginPercentage(15)
			.setLeftMarginPercentage(30)
			.setIsBodySizeFixed(false)
			.setIsFooterAlwaysShown(true);

	factorInfoUtil.setBodyDataFunction(
		function(modalObj){
			modalObj.setBodyHTML(factorInfo);
		}
	);

	MP_ModalDialog.updateModalDialogObject(factorInfoUtil);
	MP_ModalDialog.showModalDialog(factorInfoUtil.getId());
};

/* Put name of component here */

MPage.namespace("cerner");
cerner.lifeimage = function(){};

cerner.lifeimage.prototype = new MPage.Component();
cerner.lifeimage.prototype.constructor = MPage.Component;
cerner.lifeimage.prototype.base = MPage.Component.prototype;
cerner.lifeimage.prototype.name = "cerner.lifeimage";
cerner.lifeimage.prototype.cclProgram = "1cerner_lifeimage";
cerner.lifeimage.prototype.cclParams = [];
cerner.lifeimage.prototype.cclDataType = "JSON"; //possible values=> JSON, TEXT, XML

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
cerner.lifeimage.CryptoJS=cerner.lifeimage.CryptoJS||function(p,h){var i={},l=i.lib={},r=l.Base=function(){function a(){}return{extend:function(e){a.prototype=this;var c=new a;e&&c.mixIn(e);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),o=l.WordArray=r.extend({init:function(a,e){a=
this.words=a||[];this.sigBytes=e!=h?e:4*a.length},toString:function(a){return(a||s).stringify(this)},concat:function(a){var e=this.words,c=a.words,b=this.sigBytes,a=a.sigBytes;this.clamp();if(b%4)for(var d=0;d<a;d++)e[b+d>>>2]|=(c[d>>>2]>>>24-8*(d%4)&255)<<24-8*((b+d)%4);else if(65535<c.length)for(d=0;d<a;d+=4)e[b+d>>>2]=c[d>>>2];else e.push.apply(e,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,e=this.sigBytes;a[e>>>2]&=4294967295<<32-8*(e%4);a.length=p.ceil(e/4)},clone:function(){var a=
r.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var e=[],c=0;c<a;c+=4)e.push(4294967296*p.random()|0);return o.create(e,a)}}),m=i.enc={},s=m.Hex={stringify:function(a){for(var e=a.words,a=a.sigBytes,c=[],b=0;b<a;b++){var d=e[b>>>2]>>>24-8*(b%4)&255;c.push((d>>>4).toString(16));c.push((d&15).toString(16))}return c.join("")},parse:function(a){for(var e=a.length,c=[],b=0;b<e;b+=2)c[b>>>3]|=parseInt(a.substr(b,2),16)<<24-4*(b%8);return o.create(c,e/2)}},n=m.Latin1={stringify:function(a){for(var e=
a.words,a=a.sigBytes,c=[],b=0;b<a;b++)c.push(String.fromCharCode(e[b>>>2]>>>24-8*(b%4)&255));return c.join("")},parse:function(a){for(var e=a.length,c=[],b=0;b<e;b++)c[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return o.create(c,e)}},k=m.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(e){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},f=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=o.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=k.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var e=this._data,c=e.words,b=e.sigBytes,d=this.blockSize,q=b/(4*d),q=a?p.ceil(q):p.max((q|0)-this._minBufferSize,0),a=q*d,b=p.min(4*a,b);if(a){for(var j=0;j<a;j+=d)this._doProcessBlock(c,j);j=c.splice(0,a);e.sigBytes-=b}return o.create(j,b)},clone:function(){var a=r.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=f.extend({init:function(){this.reset()},
reset:function(){f.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=f.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(e,c){return a.create(c).finalize(e)}},_createHmacHelper:function(a){return function(e,c){return g.HMAC.create(a,c).finalize(e)}}});var g=i.algo={};return i}(Math);
(function(){var p=cerner.lifeimage.CryptoJS,h=p.lib.WordArray;p.enc.Base64={stringify:function(i){var l=i.words,h=i.sigBytes,o=this._map;i.clamp();for(var i=[],m=0;m<h;m+=3)for(var s=(l[m>>>2]>>>24-8*(m%4)&255)<<16|(l[m+1>>>2]>>>24-8*((m+1)%4)&255)<<8|l[m+2>>>2]>>>24-8*((m+2)%4)&255,n=0;4>n&&m+0.75*n<h;n++)i.push(o.charAt(s>>>6*(3-n)&63));if(l=o.charAt(64))for(;i.length%4;)i.push(l);return i.join("")},parse:function(i){var i=i.replace(/\s/g,""),l=i.length,r=this._map,o=r.charAt(64);o&&(o=i.indexOf(o),-1!=o&&(l=o));
for(var o=[],m=0,s=0;s<l;s++)if(s%4){var n=r.indexOf(i.charAt(s-1))<<2*(s%4),k=r.indexOf(i.charAt(s))>>>6-2*(s%4);o[m>>>2]|=(n|k)<<24-8*(m%4);m++}return h.create(o,m)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(p){function h(f,g,a,e,c,b,d){f=f+(g&a|~g&e)+c+d;return(f<<b|f>>>32-b)+g}function i(f,g,a,e,c,b,d){f=f+(g&e|a&~e)+c+d;return(f<<b|f>>>32-b)+g}function l(f,g,a,e,c,b,d){f=f+(g^a^e)+c+d;return(f<<b|f>>>32-b)+g}function r(f,g,a,e,c,b,d){f=f+(a^(g|~e))+c+d;return(f<<b|f>>>32-b)+g}var o=cerner.lifeimage.CryptoJS,m=o.lib,s=m.WordArray,m=m.Hasher,n=o.algo,k=[];(function(){for(var f=0;64>f;f++)k[f]=4294967296*p.abs(p.sin(f+1))|0})();n=n.MD5=m.extend({_doReset:function(){this._hash=s.create([1732584193,4023233417,
2562383102,271733878])},_doProcessBlock:function(f,g){for(var a=0;16>a;a++){var e=g+a,c=f[e];f[e]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360}for(var e=this._hash.words,c=e[0],b=e[1],d=e[2],q=e[3],a=0;64>a;a+=4)16>a?(c=h(c,b,d,q,f[g+a],7,k[a]),q=h(q,c,b,d,f[g+a+1],12,k[a+1]),d=h(d,q,c,b,f[g+a+2],17,k[a+2]),b=h(b,d,q,c,f[g+a+3],22,k[a+3])):32>a?(c=i(c,b,d,q,f[g+(a+1)%16],5,k[a]),q=i(q,c,b,d,f[g+(a+6)%16],9,k[a+1]),d=i(d,q,c,b,f[g+(a+11)%16],14,k[a+2]),b=i(b,d,q,c,f[g+a%16],20,k[a+3])):48>a?(c=
l(c,b,d,q,f[g+(3*a+5)%16],4,k[a]),q=l(q,c,b,d,f[g+(3*a+8)%16],11,k[a+1]),d=l(d,q,c,b,f[g+(3*a+11)%16],16,k[a+2]),b=l(b,d,q,c,f[g+(3*a+14)%16],23,k[a+3])):(c=r(c,b,d,q,f[g+3*a%16],6,k[a]),q=r(q,c,b,d,f[g+(3*a+7)%16],10,k[a+1]),d=r(d,q,c,b,f[g+(3*a+14)%16],15,k[a+2]),b=r(b,d,q,c,f[g+(3*a+5)%16],21,k[a+3]));e[0]=e[0]+c|0;e[1]=e[1]+b|0;e[2]=e[2]+d|0;e[3]=e[3]+q|0},_doFinalize:function(){var f=this._data,g=f.words,a=8*this._nDataBytes,e=8*f.sigBytes;g[e>>>5]|=128<<24-e%32;g[(e+64>>>9<<4)+14]=(a<<8|a>>>
24)&16711935|(a<<24|a>>>8)&4278255360;f.sigBytes=4*(g.length+1);this._process();f=this._hash.words;for(g=0;4>g;g++)a=f[g],f[g]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360}});o.MD5=m._createHelper(n);o.HmacMD5=m._createHmacHelper(n)})(Math);
(function(){var p=cerner.lifeimage.CryptoJS,h=p.lib,i=h.Base,l=h.WordArray,h=p.algo,r=h.EvpKDF=i.extend({cfg:i.extend({keySize:4,hasher:h.MD5,iterations:1}),init:function(i){this.cfg=this.cfg.extend(i)},compute:function(i,m){for(var h=this.cfg,n=h.hasher.create(),k=l.create(),f=k.words,g=h.keySize,h=h.iterations;f.length<g;){a&&n.update(a);var a=n.update(i).finalize(m);n.reset();for(var e=1;e<h;e++)a=n.finalize(a),n.reset();k.concat(a)}k.sigBytes=4*g;return k}});p.EvpKDF=function(i,l,h){return r.create(h).compute(i,
l)}})();
cerner.lifeimage.CryptoJS.lib.Cipher||function(p){var h=cerner.lifeimage.CryptoJS,i=h.lib,l=i.Base,r=i.WordArray,o=i.BufferedBlockAlgorithm,m=h.enc.Base64,s=h.algo.EvpKDF,n=i.Cipher=o.extend({cfg:l.extend(),createEncryptor:function(b,d){return this.create(this._ENC_XFORM_MODE,b,d)},createDecryptor:function(b,d){return this.create(this._DEC_XFORM_MODE,b,d)},init:function(b,d,a){this.cfg=this.cfg.extend(a);this._xformMode=b;this._key=d;this.reset()},reset:function(){o.reset.call(this);this._doReset()},process:function(b){this._append(b);return this._process()},
finalize:function(b){b&&this._append(b);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){return function(b){return{encrypt:function(a,q,j){return("string"==typeof q?c:e).encrypt(b,a,q,j)},decrypt:function(a,q,j){return("string"==typeof q?c:e).decrypt(b,a,q,j)}}}}()});i.StreamCipher=n.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var k=h.mode={},f=i.BlockCipherMode=l.extend({createEncryptor:function(b,a){return this.Encryptor.create(b,
a)},createDecryptor:function(b,a){return this.Decryptor.create(b,a)},init:function(b,a){this._cipher=b;this._iv=a}}),k=k.CBC=function(){function b(b,a,d){var c=this._iv;c?this._iv=p:c=this._prevBlock;for(var e=0;e<d;e++)b[a+e]^=c[e]}var a=f.extend();a.Encryptor=a.extend({processBlock:function(a,d){var c=this._cipher,e=c.blockSize;b.call(this,a,d,e);c.encryptBlock(a,d);this._prevBlock=a.slice(d,d+e)}});a.Decryptor=a.extend({processBlock:function(a,d){var c=this._cipher,e=c.blockSize,f=a.slice(d,d+
e);c.decryptBlock(a,d);b.call(this,a,d,e);this._prevBlock=f}});return a}(),g=(h.pad={}).Pkcs7={pad:function(b,a){for(var c=4*a,c=c-b.sigBytes%c,e=c<<24|c<<16|c<<8|c,f=[],g=0;g<c;g+=4)f.push(e);c=r.create(f,c);b.concat(c)},unpad:function(b){b.sigBytes-=b.words[b.sigBytes-1>>>2]&255}};i.BlockCipher=n.extend({cfg:n.cfg.extend({mode:k,padding:g}),reset:function(){n.reset.call(this);var b=this.cfg,a=b.iv,b=b.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=b.createEncryptor;else c=b.createDecryptor,
this._minBufferSize=1;this._mode=c.call(b,this,a&&a.words)},_doProcessBlock:function(b,a){this._mode.processBlock(b,a)},_doFinalize:function(){var b=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){b.pad(this._data,this.blockSize);var a=this._process(!0)}else a=this._process(!0),b.unpad(a);return a},blockSize:4});var a=i.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),k=(h.format={}).OpenSSL={stringify:function(a){var d=
a.ciphertext,a=a.salt,d=(a?r.create([1398893684,1701076831]).concat(a).concat(d):d).toString(m);return d=d.replace(/(.{64})/g,"$1\n")},parse:function(b){var b=m.parse(b),d=b.words;if(1398893684==d[0]&&1701076831==d[1]){var c=r.create(d.slice(2,4));d.splice(0,4);b.sigBytes-=16}return a.create({ciphertext:b,salt:c})}},e=i.SerializableCipher=l.extend({cfg:l.extend({format:k}),encrypt:function(b,d,c,e){var e=this.cfg.extend(e),f=b.createEncryptor(c,e),d=f.finalize(d),f=f.cfg;return a.create({ciphertext:d,
key:c,iv:f.iv,algorithm:b,mode:f.mode,padding:f.padding,blockSize:b.blockSize,formatter:e.format})},decrypt:function(a,c,e,f){f=this.cfg.extend(f);c=this._parse(c,f.format);return a.createDecryptor(e,f).finalize(c.ciphertext)},_parse:function(a,c){return"string"==typeof a?c.parse(a):a}}),h=(h.kdf={}).OpenSSL={compute:function(b,c,e,f){f||(f=r.random(8));b=s.create({keySize:c+e}).compute(b,f);e=r.create(b.words.slice(c),4*e);b.sigBytes=4*c;return a.create({key:b,iv:e,salt:f})}},c=i.PasswordBasedCipher=
e.extend({cfg:e.cfg.extend({kdf:h}),encrypt:function(a,c,f,j){j=this.cfg.extend(j);f=j.kdf.compute(f,a.keySize,a.ivSize);j.iv=f.iv;a=e.encrypt.call(this,a,c,f.key,j);a.mixIn(f);return a},decrypt:function(a,c,f,j){j=this.cfg.extend(j);c=this._parse(c,j.format);f=j.kdf.compute(f,a.keySize,a.ivSize,c.salt);j.iv=f.iv;return e.decrypt.call(this,a,c,f.key,j)}})}();
(function(){var p=cerner.lifeimage.CryptoJS,h=p.lib.BlockCipher,i=p.algo,l=[],r=[],o=[],m=[],s=[],n=[],k=[],f=[],g=[],a=[];(function(){for(var c=[],b=0;256>b;b++)c[b]=128>b?b<<1:b<<1^283;for(var d=0,e=0,b=0;256>b;b++){var j=e^e<<1^e<<2^e<<3^e<<4,j=j>>>8^j&255^99;l[d]=j;r[j]=d;var i=c[d],h=c[i],p=c[h],t=257*c[j]^16843008*j;o[d]=t<<24|t>>>8;m[d]=t<<16|t>>>16;s[d]=t<<8|t>>>24;n[d]=t;t=16843009*p^65537*h^257*i^16843008*d;k[j]=t<<24|t>>>8;f[j]=t<<16|t>>>16;g[j]=t<<8|t>>>24;a[j]=t;d?(d=i^c[c[c[p^i]]],e^=c[c[e]]):d=e=1}})();
var e=[0,1,2,4,8,16,32,64,128,27,54],i=i.AES=h.extend({_doReset:function(){for(var c=this._key,b=c.words,d=c.sigBytes/4,c=4*((this._nRounds=d+6)+1),i=this._keySchedule=[],j=0;j<c;j++)if(j<d)i[j]=b[j];else{var h=i[j-1];j%d?6<d&&4==j%d&&(h=l[h>>>24]<<24|l[h>>>16&255]<<16|l[h>>>8&255]<<8|l[h&255]):(h=h<<8|h>>>24,h=l[h>>>24]<<24|l[h>>>16&255]<<16|l[h>>>8&255]<<8|l[h&255],h^=e[j/d|0]<<24);i[j]=i[j-d]^h}b=this._invKeySchedule=[];for(d=0;d<c;d++)j=c-d,h=d%4?i[j]:i[j-4],b[d]=4>d||4>=j?h:k[l[h>>>24]]^f[l[h>>>
16&255]]^g[l[h>>>8&255]]^a[l[h&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,o,m,s,n,l)},decryptBlock:function(c,b){var d=c[b+1];c[b+1]=c[b+3];c[b+3]=d;this._doCryptBlock(c,b,this._invKeySchedule,k,f,g,a,r);d=c[b+1];c[b+1]=c[b+3];c[b+3]=d},_doCryptBlock:function(a,b,d,e,f,h,i,g){for(var l=this._nRounds,k=a[b]^d[0],m=a[b+1]^d[1],o=a[b+2]^d[2],n=a[b+3]^d[3],p=4,r=1;r<l;r++)var s=e[k>>>24]^f[m>>>16&255]^h[o>>>8&255]^i[n&255]^d[p++],u=e[m>>>24]^f[o>>>16&255]^h[n>>>8&255]^
i[k&255]^d[p++],v=e[o>>>24]^f[n>>>16&255]^h[k>>>8&255]^i[m&255]^d[p++],n=e[n>>>24]^f[k>>>16&255]^h[m>>>8&255]^i[o&255]^d[p++],k=s,m=u,o=v;s=(g[k>>>24]<<24|g[m>>>16&255]<<16|g[o>>>8&255]<<8|g[n&255])^d[p++];u=(g[m>>>24]<<24|g[o>>>16&255]<<16|g[n>>>8&255]<<8|g[k&255])^d[p++];v=(g[o>>>24]<<24|g[n>>>16&255]<<16|g[k>>>8&255]<<8|g[m&255])^d[p++];n=(g[n>>>24]<<24|g[k>>>16&255]<<16|g[m>>>8&255]<<8|g[o&255])^d[p++];a[b]=s;a[b+1]=u;a[b+2]=v;a[b+3]=n},keySize:8});p.AES=h._createHelper(i)})();

/*
CryptoJS v3.0.2
code.google.com/p/crypto-js
(c) 2009-2012 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
cerner.lifeimage.CryptoJS=cerner.lifeimage.CryptoJS||function(g,i){var f={},b=f.lib={},m=b.Base=function(){function a(){}return{extend:function(e){a.prototype=this;var c=new a;e&&c.mixIn(e);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),l=b.WordArray=m.extend({init:function(a,e){a=
this.words=a||[];this.sigBytes=e!=i?e:4*a.length},toString:function(a){return(a||d).stringify(this)},concat:function(a){var e=this.words,c=a.words,o=this.sigBytes,a=a.sigBytes;this.clamp();if(o%4)for(var b=0;b<a;b++)e[o+b>>>2]|=(c[b>>>2]>>>24-8*(b%4)&255)<<24-8*((o+b)%4);else if(65535<c.length)for(b=0;b<a;b+=4)e[o+b>>>2]=c[b>>>2];else e.push.apply(e,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,e=this.sigBytes;a[e>>>2]&=4294967295<<32-8*(e%4);a.length=g.ceil(e/4)},clone:function(){var a=
m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var e=[],c=0;c<a;c+=4)e.push(4294967296*g.random()|0);return l.create(e,a)}}),n=f.enc={},d=n.Hex={stringify:function(a){for(var e=a.words,a=a.sigBytes,c=[],b=0;b<a;b++){var d=e[b>>>2]>>>24-8*(b%4)&255;c.push((d>>>4).toString(16));c.push((d&15).toString(16))}return c.join("")},parse:function(a){for(var e=a.length,c=[],b=0;b<e;b+=2)c[b>>>3]|=parseInt(a.substr(b,2),16)<<24-4*(b%8);return l.create(c,e/2)}},j=n.Latin1={stringify:function(a){for(var e=
a.words,a=a.sigBytes,b=[],d=0;d<a;d++)b.push(String.fromCharCode(e[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return l.create(c,b)}},k=n.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},h=b.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=l.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=k.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,d=b.sigBytes,j=this.blockSize,h=d/(4*j),h=a?g.ceil(h):g.max((h|0)-this._minBufferSize,0),a=h*j,d=g.min(4*a,d);if(a){for(var f=0;f<a;f+=j)this._doProcessBlock(c,f);f=c.splice(0,a);b.sigBytes-=d}return l.create(f,d)},clone:function(){var a=m.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});b.Hasher=h.extend({init:function(){this.reset()},
reset:function(){h.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=h.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,c){return a.create(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return u.HMAC.create(a,c).finalize(b)}}});var u=f.algo={};return f}(Math);
(function(){var g=cerner.lifeimage.CryptoJS,i=g.lib,f=i.WordArray,i=i.Hasher,b=[],m=g.algo.SHA1=i.extend({_doReset:function(){this._hash=f.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var d=this._hash.words,j=d[0],k=d[1],h=d[2],g=d[3],a=d[4],e=0;80>e;e++){if(16>e)b[e]=f[n+e]|0;else{var c=b[e-3]^b[e-8]^b[e-14]^b[e-16];b[e]=c<<1|c>>>31}c=(j<<5|j>>>27)+a+b[e];c=20>e?c+((k&h|~k&g)+1518500249):40>e?c+((k^h^g)+1859775393):60>e?c+((k&h|k&g|h&g)-1894007588):c+((k^h^g)-
899497514);a=g;g=h;h=k<<30|k>>>2;k=j;j=c}d[0]=d[0]+j|0;d[1]=d[1]+k|0;d[2]=d[2]+h|0;d[3]=d[3]+g|0;d[4]=d[4]+a|0},_doFinalize:function(){var b=this._data,f=b.words,d=8*this._nDataBytes,j=8*b.sigBytes;f[j>>>5]|=128<<24-j%32;f[(j+64>>>9<<4)+15]=d;b.sigBytes=4*f.length;this._process()}});g.SHA1=i._createHelper(m);g.HmacSHA1=i._createHmacHelper(m)})();
(function(){var g=cerner.lifeimage.CryptoJS,i=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(f,b){f=this._hasher=f.create();"string"==typeof b&&(b=i.parse(b));var g=f.blockSize,l=4*g;b.sigBytes>l&&(b=f.finalize(b));for(var n=this._oKey=b.clone(),d=this._iKey=b.clone(),j=n.words,k=d.words,h=0;h<g;h++)j[h]^=1549556828,k[h]^=909522486;n.sigBytes=d.sigBytes=l;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var b=
this._hasher,f=b.finalize(f);b.reset();return b.finalize(this._oKey.clone().concat(f))}})})();
(function(){var g=cerner.lifeimage.CryptoJS,i=g.lib,f=i.Base,b=i.WordArray,i=g.algo,m=i.HMAC,l=i.PBKDF2=f.extend({cfg:f.extend({keySize:4,hasher:i.SHA1,iterations:1}),init:function(b){this.cfg=this.cfg.extend(b)},compute:function(f,d){for(var g=this.cfg,k=m.create(g.hasher,f),h=b.create(),i=b.create([1]),a=h.words,e=i.words,c=g.keySize,g=g.iterations;a.length<c;){var l=k.update(d).finalize(i);k.reset();for(var q=l.words,t=q.length,r=l,s=1;s<g;s++){r=k.finalize(r);k.reset();for(var v=r.words,p=0;p<t;p++)q[p]^=v[p]}h.concat(l);
e[0]++}h.sigBytes=4*c;return h}});g.PBKDF2=function(b,d,f){return l.create(f).compute(b,d)}})();

cerner.lifeimage.nonprod = {
		"APPNAME":"cernerpc",
		"APPPASSWORD":"TirfSG7CagSy2Rbr",
		"UPLOADURL":"https://lifeimagetest.baycare.org/inbox/launchinbox.html",
		"FINDEXAMSURL":"https://lifeimagetest.baycare.org/inbox/launchinbox.json",
		"VIEWEXAMURL":"https://lifeimagetest.baycare.org/inbox/launchinbox.html",
		"SINGLESESSION":"true",
		"AUTOLOGOUT":"2",
		"PASSPHRASE":"short",
		"ITERATIONS":1000,
		"SALT":"9986b1ff7cdf4e29bac202ab7f77b289",
		"IV":cerner.lifeimage.CryptoJS.enc.Hex.parse("cd1d1ef1e63b4d119c279ab602b3075c"),
	    "CSV_FILE_NAME":"ccluserdir:1lifeimage_key_data_file.csv"
}; 

cerner.lifeimage.prod = {		
		"APPNAME":"cernerpc",
		"APPPASSWORD":"TirfSG7CagSy2Rbr",
		"UPLOADURL":"https://lifeimage.baycare.org/inbox/launchinbox.html",
		"FINDEXAMSURL":"https://lifeimage.baycare.org/inbox/launchinbox.json",
		"VIEWEXAMURL":"https://lifeimage.baycare.org/inbox/launchinbox.html",
		"SINGLESESSION":"true",
		"AUTOLOGOUT":"2",
		"PASSPHRASE":"short",
		"ITERATIONS":1000,
		"SALT":"9986b1ff7cdf4e29bac202ab7f77b289",
		"IV":cerner.lifeimage.CryptoJS.enc.Hex.parse("cd1d1ef1e63b4d119c279ab602b3075c"),
	    "CSV_FILE_NAME":"ccluserdir:1lifeimage_key_data_file.csv"
};

cerner.lifeimage.prototype.init = function(options) {
	//code to perform before immediately rendering (usually updating params is needed)
	var component = this;
	comp_options = (component.options.APPNAME)?component.options:cerner.lifeimage.nonprod;
	var key_params = comp_options.PASSPHRASE+comp_options.ITERATIONS+comp_options.SALT+comp_options.IV;
	//clear cclParams in case of refresh
	component.cclParams = [];
	component.cclParams.push("MINE");
	//CAN USE ANY OR ALL OF THE FOLLOWING IN ORDER AS NEEDED:
	component.cclParams.push(this.getProperty("personId"));
	component.cclParams.push(this.getProperty("userId"));
	component.cclParams.push(key_params);
	component.cclParams.push(comp_options.CSV_FILE_NAME);
};


cerner.lifeimage.prototype.render = function() {

	var component = this;
	var comp_options = (component.options.APPNAME)?component.options:cerner.lifeimage.nonprod;
	var key_params = comp_options.PASSPHRASE+comp_options.ITERATIONS+comp_options.SALT+comp_options.IV;
	var compId = component.getComponentUid();
	var target = component.getTarget();
	var targetHTML = [];
	var recData = this.data;
	var lifeImageData = recData.LIFEIMAGE_REC;
	
	/*check the response from the ccl script and generate the key and csv file as needed.*/
	if(lifeImageData.KEY_VALUE == "need to generate key and create the csv file" || lifeImageData.KEY_VALUE == "need to re-generate key and update the csv"){

		var salt = cerner.lifeimage.CryptoJS.enc.Hex.parse(comp_options.SALT)
		var key = cerner.lifeimage.CryptoJS.PBKDF2(
		  comp_options.PASSPHRASE, 
		  salt,
		  { keySize: 4, iterations: comp_options.ITERATIONS });
		//Update the JSON response from the ccl script with the updated key value		
		lifeImageData.KEY_VALUE = JSON.stringify(key);
		var keyInfo = new XMLCclRequest();		
		//Call the ccl progam and send the latest generated key as a parameter to update the key in the csv file
		keyInfo.open('GET',"1bayc_fl_lifeimage");
		keyInfo.send("^MINE^, "+this.getProperty("personId")+","+this.getProperty("userId")+",^"+key_params+"^,^"+comp_options.CSV_FILE_NAME+"^,^"+JSON.stringify(key)+"^");		
	}
	
	/*push the place holder divs for the upload/claim button and also to view the results.*/

	targetHTML.push("<div id = 'cerner_lifeimage_upload_div'><button type='button' id='cerner_lifeimage_upload_button' class=''>Add Outside exams</button></div></br>");
	targetHTML.push("<div id = 'cerner_lifeimage_view_div'><span class = 'cerner_lifeimage_loading_div'></span></div>");
	target.innerHTML = targetHTML.join("");

	
	//get current utc date time to pass as a parameter to LifeImage.
	var curDatetime = new Date();	
	var curGMTdatetime = curDatetime.gmtDate();
	
	jQuery.support.cors = true;
	var findArguments = "apppassword="+comp_options.APPPASSWORD+"&userid="+lifeImageData.USERNAME+"&view=find&patientid="+lifeImageData.MRN+"&timestamp="+curGMTdatetime+"&singlesession="+comp_options.SINGLESESSION+"";
	var findCipherText = cerner.lifeimage.encrypt(findArguments,JSON.parse(lifeImageData.KEY_VALUE),comp_options.IV);
	var request = $.ajax({
			/*while uncommenting be sure to add the static patient data if sending un-encrpted data as the domain has live PHI.*/

			url: comp_options.FINDEXAMSURL+"?appname="+comp_options.APPNAME+"&args="+findCipherText, //chage appname at the top back to cernerpc			
			type: "POST",
			dataType: "json",
  			complete : function(){
			        
    		},
			success:function (data, status, xhr){//success function begins

					$("#"+compId+" .cerner_lifeimage_loading_div").remove();						
					var responseData = data;
					var exams = responseData.exams;
					var resultHTML = [];
					
					if(exams != undefined && exams.length > 0){	
														
						component.setProperty("headerSubTitle","("+exams.length+")");
						resultHTML.push("The images viewed in LifeImage may not be part of the patient's BayCare medical record.");
						resultHTML.push("<div class = 'cerner_lifeimage_content_hd'>");
						resultHTML.push("<dl class = 'cerner_lifeimage_header cerner_lifeimage_hdr'><dd class = 'cerner_lifeimage_name'><span>Description</span></dd><dd class = 'cerner_lifeimage_date'><span>Exam Date/Time</span></dd></dl>");
						resultHTML.push("<div class = 'cerner_lifeimage_content_body'>");
						/*create an array which will hold the arguments that have to be encrypted for each image/exam*/
						var viewArguments = [];
						for(var i=0;i<=exams.length-1;i++){
							viewArguments.push("singlesession=true&view=view&apppassword="+comp_options.APPPASSWORD+"&userid="+lifeImageData.USERNAME+"&examuuid="+exams[i].uuid+"&timestamp="+curGMTdatetime+"");
							var examURL = comp_options.VIEWEXAMURL+"?appname="+comp_options.APPNAME+"&apppassword="+comp_options.APPPASSWORD+"&userid="+lifeImageData.USERNAME+"&view=view&patientid="+lifeImageData.MRN+"&examuuid="+exams[i].uuid+"";
							//separate the datestring returned by lifeimage into individual strings
							var dateYear = exams[i].dateTime.substring(0,4);
							var dateMonth = exams[i].dateTime.substring(4,6);
							var dateDay = exams[i].dateTime.substring(6,8);
							var dateHour = exams[i].dateTime.substring(8,10);
							var dateMin = exams[i].dateTime.substring(10,12);
							var dateSec = exams[i].dateTime.substring(12,14);
							//create a new date object by passing these separate date strings as parameters
							var dateFull = new Date(dateYear, dateMonth-1, dateDay, dateHour, dateMin, dateSec);
							//finally format the date object to be displayed on the component
							var formattedDate = dateFull.custFormatString("%MM/%dd/%yyyy %HH:%mm");
							resultHTML.push("<dl class = 'cerner_lifeimage_info'><dd class = 'cerner_lifeimage_name'><span id = 'cerner_lifeimage_name_link_"+i+"' class = 'cerner_lifeimage_name_link'>",exams[i].description,"</span></dd><dd class = 'cerner_lifeimage_date'><span class = 'cerner_lifeimage_date_time'>",formattedDate,"</span></dd></dl>");	
						}
						resultHTML.push("</div></div>");
					}else{
						resultHTML.push("No exams found for the patient.");
					}
			document.getElementById("cerner_lifeimage_view_div").innerHTML = resultHTML.join("");
			/*Encrypt the view url only when the user clicks on the corresponding image/exam name*/
			$('.cerner_lifeimage_name_link').click(function() {					
				
				var id_attribute = this.getAttribute( "id" );	
				var i = id_attribute.substr(id_attribute.length - 1);	
				var viewCipherText = cerner.lifeimage.encrypt(viewArguments[i],JSON.parse(lifeImageData.KEY_VALUE),comp_options.IV);	
				var examURL = comp_options.VIEWEXAMURL+"?appname="+comp_options.APPNAME+"&args="+viewCipherText;
				APPLINK(100,encodeURI(examURL),"");
			});	

			},
			error:function (xhr, status, thrownError){//error function begins
					//if the request fails a simple error message for the user will be displayed
					var resultHTML = [];
					resultHTML.push("A find request has caused an "+thrownError+" error please contact the system administrator for assistance.");
					document.getElementById("cerner_lifeimage_view_div").innerHTML = resultHTML.join("");				
			}//error function ends  
});

	//Provide the callback function that is triggered when the button is clicked
	$('#cerner_lifeimage_upload_button').click(function(event){
//alert(lifeImageData.PATIENT_NAME);
		var curDatetime = new Date();	
		var curGMTdatetime = curDatetime.gmtDate();
		var uploadArguments = "apppassword="+comp_options.APPPASSWORD+"&userid="+lifeImageData.USERNAME+"&view=upload&patientname="+lifeImageData.PATIENT_NAME+"&patientid="+lifeImageData.MRN+"&patientbirthdate="+lifeImageData.DOB+"&patientsex="+lifeImageData.GENDER+"&singlesession="+comp_options.SINGLESESSION+"&alo="+comp_options.AUTOLOGOUT+"&timestamp="+curGMTdatetime+"";
		
		//encrypt the arguments
		var cipherText = cerner.lifeimage.encrypt(uploadArguments,JSON.parse(lifeImageData.KEY_VALUE),comp_options.IV).replace(/ /g,'');
		var plainText = cerner.lifeimage.decrypt(cipherText,JSON.parse(lifeImageData.KEY_VALUE),comp_options.IV).replace(/ /g,'');

		//construct the final url to launch the lifeImage upload/claim application
		
		var uploadURL = comp_options.UPLOADURL+"?appname="+comp_options.APPNAME+"&args="+cipherText;

		APPLINK(100,encodeURI(uploadURL),"");
	});	
}; 

/*Encrypt the plain string using the iv and generated key*/
cerner.lifeimage.encrypt = function(clearText,key,iv) {
	var encrypted = cerner.lifeimage.CryptoJS.AES.encrypt(
		clearText,
		key,
		{ iv: iv });
	/*Convert the encrypted object to a string and do a base64 encoding to make it url safe.*/
	var encrypted_base64 = encrypted.ciphertext.toString(cerner.lifeimage.CryptoJS.enc.Base64);
	/* remove/convert the special characters(+,\,=) that are not url safe before returning the encrypted string*/
	return encrypted_base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');

}

/*Decrypt the encrypted string using the iv and generated key*/
cerner.lifeimage.decrypt = function(cipherText,key,iv) {	
	/*convert the string back to having special characters.*/
	cipherText = (cipherText + '===').slice(0, cipherText.length + (cipherText.length % 4));
	var cipherText_decoded = cipherText.replace(/-/g, '+').replace(/_/g, '/');
	var cipherParams = cerner.lifeimage.CryptoJS.lib.CipherParams.create({
		ciphertext: cerner.lifeimage.CryptoJS.enc.Base64.parse(cipherText_decoded)
		});
	var decrypted = cerner.lifeimage.CryptoJS.AES.decrypt(
		cipherParams,
		key,
		{ iv: iv });		
	return decrypted.toString(cerner.lifeimage.CryptoJS.enc.Utf8);
}

/* Function which returns current gmt date in the format which needs to passed to LifeImage*/
Date.prototype.gmtDate = function(){
		var yyyy = this.getUTCFullYear().toString();
  		var mm = (this.getUTCMonth()+1).toString(); // getMonth() is zero-based
   		var dd  = this.getUTCDate().toString();
		var hh = this.getUTCHours().toString(); 
		var min = this.getUTCMinutes().toString();
		var ss = this.getUTCSeconds().toString();


		return (yyyy + (mm.length>1?mm:'0'+mm) + (dd.length>1?dd:'0'+dd) + (hh.length>1?hh:"0"+hh) + (min.length>1?min:"0"+min) + (ss.length>1?ss:'0'+ss)); // padding		
};


/**
*	Guide to formatting:
*	%MM => month w/ zero placeholder					%M => month w/o zero placeholder
*	%B => month full string								%b => month 3 letter string
*	%dd => day w/ zero placeholder						%d => day w/o zero placeholder
*	%yyyy => 4 digit year								%yy => 2 digit year
*	%HH => 24 hour-based hours w/ zero placeholder		%H => 24 hour-based hours w/o zero placeholder
*	%hh => 12 hour-based hours w/ zero placeholder		%h => 12 hour-based hours w/o zero placeholder
*	%mm => minutes w/ zero placeholder					%m => minutes w/o zero placeholder
*	%ss => seconds w/ zero placeholder					%s => seconds w/o zero placeholder	
*	%P => AM/PM											%p => am/pm
*/
Date.prototype.custFormatString = function( formatStr ) {
	var shortdatetime = "%MM/%dd/%yy %HH:%mm", 
		shortdate = "%MM/%dd/%yy",		
		longdate = "%MM/%dd/%yyyy",
		longdatetime = "%MM/%dd/%yyyy %HH:%mm";		
	
	var ret_str = formatStr;
	switch (ret_str)
	{
		case "shortdatetime":
			ret_str = shortdatetime;
			break;
		case "shortdate":
			ret_str = shortdate;
			break;
		case "longdatetime":
			ret_str = longdatetime;
			break;
		case "longdate":
			ret_str = longdate;
			break;
		default:
			break;
	};
	var SHORT_MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var LONG_MONTH = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var monStr=((this.getMonth()+1)<10)?"0"+(this.getMonth()+1):""+(this.getMonth()+1);
	var dateStr = (this.getDate()<10)?"0"+this.getDate():""+this.getDate();
	var yearStr = (this.getYear()+"").slice(2);
	var shortHours = (this.getHours()>=1 && this.getHours()<=12)?this.getHours():(this.getHours()%12);
	shortHours = (shortHours==0)?12:shortHours;
	var hourStr = (shortHours<10)?"0"+shortHours:""+shortHours;
	var HourStr = (this.getHours()<10)?"0"+this.getHours():""+this.getHours();
	var minuteStr = (this.getMinutes()<10)?"0"+this.getMinutes():""+this.getMinutes();
	var secStr = (this.getSeconds()<10)?"0"+this.getSeconds():""+this.getSeconds();
	var amPM = (this.getHours()>=12)?"pm":"am";
	var retVal = ret_str.replace(/%MM/,monStr).replace(/%M/,(this.getMonth()+1)).replace(/%dd/,dateStr).replace(/%d/,this.getDate()).replace(/%yyyy/,this.getFullYear()).replace(/%yy/,yearStr).replace(/%HH/,HourStr).replace(/%H/,this.getHours()).replace(/%hh/,hourStr).replace(/%h/,shortHours).replace(/%mm/,minuteStr).replace(/%m/,this.getMinutes()).replace(/%ss/,secStr).replace(/%s/,this.getSeconds()).replace(/%p/,amPM).replace(/%P/,amPM.toUpperCase()).replace(/%b/,SHORT_MONTH[this.getMonth()]).replace(/%B/,LONG_MONTH[this.getMonth()]);
	return (isNaN(this.getTime()))?"Invalid Date":retVal;
};


/** Ambulatory Device Custom Component JS Portion **/
jQuery.support.cors = true;
/*Custom Ambulatory Core source code*/
//define the PowerWorks namespace
if (pwx == undefined) {
	var pwx = new Object();
}
//create the form launch function
pwx_form_launch = function (persId, encntrId, formId, activityId, chartMode, compId) {
	//var pwxFormObj = window.external.DiscernObjectFactory('POWERFORM');
	//pwxFormObj.OpenForm(persId, encntrId, formId, activityId, chartMode);
	var paramString = persId + "|" + encntrId + "|" + formId + "|" + activityId + "|" + chartMode;
	MPAGES_EVENT("POWERFORM", paramString);
	if (compId != null) {
		var comp = MPage.getCustomComp(compId);
		if (comp != null) {
			comp.refresh();
		}
	}
}
// function to take a whole Javascript object and creat the grouping based on keyname
Array.prototype.pwxgroupBy = function (keyName) {
	var res = {};
	$.each(this, function (i, val) {
		var k = val[keyName];
		var v = res[k];
		if (!v)
			v = res[k] = [];
		v.push(val);
	});
	return res;
};
//create form menu function
pwx_form_menu = function (form_menu_id, compId) {
	var element;
	if (document.getElementById && (element = document.getElementById(form_menu_id))) {
		if (document.getElementById(form_menu_id).style.display == 'block') {
			document.getElementById(form_menu_id).style.display = 'none';
			$('#' + compId).css('z-index', '1')
		} else {
			document.getElementById(form_menu_id).style.display = 'block';
			$('#' + compId).css('z-index', '2')
		}
	}
}
//create expand collapse with scroll check function
pwx_expand_collapse_scroll = function (tbody_class, title_class, tgl_class, scroll_div_id, scroll_setting) {
	var element;
	if (document.getElementById && (element = document.getElementById(tbody_class))) {
		if (document.getElementById(tbody_class).style.display == 'block') {
			document.getElementById(tbody_class).style.display = 'none';
			document.getElementById(title_class).title = 'Expand';
			document.getElementById(tgl_class).className = 'pwx-sub-sec-hd-tgl-close';
			var pwxclientheightcheck = document.getElementById(scroll_div_id).clientHeight;
			var pwxscrollheightcheck = document.getElementById(scroll_div_id).scrollHeight;
			if (pwxscrollheightcheck <= pwxclientheightcheck) {
				document.getElementById(scroll_div_id).style.height = '';
			}
		} else {
			document.getElementById(tbody_class).style.display = 'block';
			document.getElementById(title_class).title = 'Collapse';
			document.getElementById(tgl_class).className = 'pwx-sub-sec-hd-tgl';
			document.getElementById(title_class).title
		}
	}
	var pwxdivh = document.getElementById(scroll_div_id).offsetHeight;
	if (pwxdivh > scroll_setting) {
		var div_height = scroll_setting + 'px';
		document.getElementById(scroll_div_id).style.height = div_height;
	}
}
/** clear the height based upon scrollbar height **/
pwxclearheight = function (pwx_id_scroll, scrollsetting) {
	var pwxclientheightcheck = document.getElementById(pwx_id_scroll).clientHeight;
	var pwxscrollheightcheck = document.getElementById(pwx_id_scroll).scrollHeight;
	if (pwxscrollheightcheck <= pwxclientheightcheck) {
		document.getElementById(pwx_id_scroll).style.height = '';
	}
	var pwxdivh = document.getElementById(pwx_id_scroll).offsetHeight;
	if (pwxdivh > scrollsetting) {
		var div_height = scrollsetting + 'px';
		document.getElementById(pwx_id_scroll).style.height = div_height;
	}
}
/*Device Component Javascript Code Start Here*/
var pwxdevicearrayCount = -1;
var pwxdevicelocationsglobal = new Array();
var pwxdeviceglobaldeviceslist = new Array();
var pwxglobaldeviceCount = -1;
var pwxdevicevendorglobalNamelist = new Array();
var pwxdeviceglobalcurrentVendorCnt = -1;
var pwxdeviceglobaldeviceIdPasslist;
var pwxdeviceglobalbusResults = [];
var pwxdeviceglobaldevIds;
var pwxdeviceresultsGlobal = [];
var pwxdevicelocationvalue = "";
var pwxdeviceUSER = "";
var pwxdevicePWORD = "";
var pwxdeviceLOCATION = "";
var pwx_device_person_id = "";
var pwx_device_enc_id = "";
var pwx_device_scrollsetting = "";
var deviceData;

pwx.Devices = function () {};
pwx.Devices.prototype = new MPage.Component();
pwx.Devices.prototype.constructor = MPage.Component;
pwx.Devices.prototype.base = MPage.Component.prototype;
pwx.Devices.prototype.name = "pwx.Devices";
pwx.Devices.prototype.cclProgram = "AMB_MP_DEVICE_COMP_41";
pwx.Devices.prototype.cclParams = [];
pwx.Devices.prototype.cclDataType = "JSON";

pwx.Devices.prototype.init = function (options) {
	var params = [];
	//set params
	params.push("MINE");
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("positionCd"));
	this.cclParams = params;
};
//set the MinimumSpecVersion
pwx.Devices.prototype.componentMinimumSpecVersion = 1.0;
//set render to display the component
pwx.Devices.prototype.render = function () {
	var element = this.getTarget();
	//store person id and encounter id in global variable so we don't have to worry about passing in different function
	pwx_device_person_id = this.getProperty("personId");
	pwx_device_enc_id = this.getProperty("encounterId");
	devicecompId = this.getComponentUid();
	var uid = this.getProperty("userId");
	var posid = this.getProperty("positionCd");
	var pwx_device_main_HTML = [];
	var pwx_device_refresh_HTML = [];	
	//Build a top header string with device name in it.
	PwxDeviceComponentRenderlocationListview("mpageinst");
	pwx_device_copy_main_obj = pwx_device_copy_obj_devicename(this);
	pwx_device_scrollsetting = (this.data.DEVICE_COMP.SCROLL_LINES * 18) + 6;
	pwx_device_main_HTML.push('<div id="pwx_devices_header_main"></div>',
		                      '<div style="padding-top:1%" id="pwx_devices_content_area">',
		                      '</div><div id="deviceEntryParametersDiv"></div>');
	$(element).html(pwx_device_main_HTML.join(""));
}
function pwxdevice_make_basic_auth(user, password) {
	// this function encodes the username and password for basic auth using base64.js
	var tok = user + ':' + password;
	var hash = PwxBase64.encode(tok);
	return "Basic " + hash;
}
/* This function will take a location alias and return a list of locations and child locations associated with the alias */
function PwxDeviceComponentRenderlocationListview(locAlias) {
	var locName = "";
	var jsonData;
	//start off by getting the URL for the rest service call
	var urlInfo = new XMLCclRequest();
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");

	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);
		var NURSE = "";
		var FACILITY = "";
		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");
		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "NURSEUNIT") {
				NURSE = pi_var2[1].text;
			} else if (pi_var2[0].text == "FACILITY") {
				FACILITY = pi_var2[1].text;
			} else if (pi_var2[0].text == "ORG") {
				pwxdeviceLOCATION = pi_var2[1].text
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		// build the url for the restful service call using the location alias passed to the load function
		var locationListUrl;
	    if(URL.toLowerCase().indexOf("/ibus") > -1){
		   if (NURSE == "0") {
			locationListUrl = URL + "cas/api/location?aliasId=" + FACILITY + ""
		   } else {
			locationListUrl = URL + "cas/api/location?aliasId=" + NURSE + ""
		   }
		}else{
		   if (NURSE == "0") {
			locationListUrl = URL + "/iBus/cas/api/location?aliasId=" + FACILITY + ""
		   } else {
			locationListUrl = URL + "/iBus/cas/api/location?aliasId=" + NURSE + ""
		   }
		}
		//do the ajax/rest call to get the locations
		$.ajax({
			type : 'GET',
			async : true,
			url : locationListUrl,
			dataType : 'json',
			data : {},
			beforeSend : function (xhr) {
				// add the basic authorization to the ajax request object header
				xhr.setRequestHeader("Authorization", auth);
				xhr.setRequestHeader("Accept", "application/json");
			},
			success : function (locationItem) {
				var pwx_device_location_name_HTML = [];
				var headerdevicename = document.getElementById('pwx_devices_header_main');
				// use eval to transform json string returned from restful service to json object
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					var jsonData = locationItem;
				} else {
					pwx_device_location_name_HTML.push('<div id="pwx_device_nolocation_div">',
						'<span id="pwx_device_no-device_id" class="pwx-warning-large-icon pwx_no_text_decor">&nbsp;</span>',
						'<p id="pwx-device_location_nofound_message"> Device view unable to load due to no ambulatory location defined <p style="text-indent:38%;font-size:15px;word-wrap:break-word;color: #909090;margin-bottom:2%;">on the encounter/visit.</p></p>',
						'</div>');
					$(headerdevicename).html(pwx_device_location_name_HTML.join(""));
				}
				//this is the jquery outer loop for the parent locations
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					$.each(jsonData, function (i) {
						pwxdevicearrayCount = pwxdevicearrayCount + 1;
						pwxdevicelocationsglobal[pwxdevicearrayCount] = jsonData[i].locationId;
						var loc = (jsonData[i].locationDisp);
						pwx_device_location_name_HTML.push('<div id="pwx_devices_header">',
							'<span style="float:left;"><label id="pwxdevice_devicelocation_label">Device Location: </label>',
							'<span id="pwx_devices_locName"></span>' + loc + '</span>');
						if (pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_HELPURL != "") {
							pwx_device_location_name_HTML.push('<a href=\'javascript: APPLINK(100,"', pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_HELPURL, '","")\' class="pwx_no_text_decor" title="Help Page" onClick="">',
								'<span class="pwx-help-icon" id="pwx-device-help-icon-id" title="Help"></span></a>');
						} else {
							pwx_device_location_name_HTML.push('<a class="pwx_no_text_decor" title="Help Page">',
								'<span class="pwx-help-icon" id="pwx-device-help-icon-id" title="Help"></span></a>');
						}
						pwx_device_location_name_HTML.push('<span id="pwx_device_info_icon" class="pwx-information-icon" title="Device Information"></span>',
							'</div>');
						$(headerdevicename).html(pwx_device_location_name_HTML.join(""));
						$("#pwx_device_info_icon").click(function () {
							if (pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_INFOTEXT != "") {
								MP_ModalDialog.deleteModalDialogObject("DeviceinfoObject")
								var Deviceinformationtext = new ModalDialog("DeviceinfoObject")
									.setHeaderTitle('<span>Device Information</span>')
									.setTopMarginPercentage(20)
									.setRightMarginPercentage(30)
									.setBottomMarginPercentage(20)
									.setLeftMarginPercentage(30)
									.setIsBodySizeFixed(true)
									.setHasGrayBackground(true)
									.setIsFooterAlwaysShown(true);
								Deviceinformationtext.setBodyDataFunction(
									function (modalObj) {
									modalObj.setBodyHTML('<span>' + pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_INFOTEXT + '</span>');
								});
								MP_ModalDialog.addModalDialogObject(Deviceinformationtext);
								MP_ModalDialog.showModalDialog("DeviceinfoObject");
							}
						});
					});
				} // end outer loop for parent locations
			}, // end success
			complete : function (locationItem) {
				// the 'complete' is entered when the ajax call is complete, regardless of whether the call was successful or not
				if (pwxdevicelocationsglobal.length != 0) {
					var locIds;
					for (loc_cnt = 0; loc_cnt < pwxdevicelocationsglobal.length; loc_cnt++) {
						if (loc_cnt == 0) {
							locIds = "locId=" + pwxdevicelocationsglobal[loc_cnt];
						} //end if
						else {
							locIds = locIds + "&locId=" + pwxdevicelocationsglobal[loc_cnt];
						} //end else
					} //end loc_cnt for loop
					//make the next rest call to get the devices associated with the locations
					PwxDeviceComponentRenderDeviceListView(locIds);
				}
			}, // end complete
			error : function (locationItem) {
				var pwx_device_location_name_HTML_error = [];
				var headerdevicenamelocationerror = document.getElementById('pwx_devices_content_area');
				// used for the ajax error handling if there was not a successful call to the restful service
				pwx_device_location_name_HTML_error.push('<div id="pwx_device_nolocation_div">',
					'<span class="pwx_single_dt_wpad"><span class="res-none">No ibus setting found. Please call support.</span></span>',
					'</div>');
				$(headerdevicenamelocationerror).html(pwx_device_location_name_HTML_error.join(""));
			} // end error
		}); // end $.ajax
	} //end ready state change
}
/* This function will take a list of locations and return a list of device Ids associated with it */
function PwxDeviceComponentRenderDeviceListView(locIds) {
	var urlInfo = new XMLCclRequest();
	//get the url for the REST call
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");
	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);
		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");
		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		// build the url for the restful service call using the location alias passed to the load function
		if(URL.toLowerCase().indexOf("/ibus") > -1){
		var deviceListUrl = URL + "cas/api/devlocassoc?" + locIds + "&retChildren=true&retConStatus=true"}
		else{
		var deviceListUrl = URL + "/iBus/cas/api/devlocassoc?" + locIds + "&retChildren=true&retConStatus=true"
		}
			deviceListUrl = encodeURI(deviceListUrl);
		//begin the ajax call which will perform the rest call to get the device ids
		$.ajax({
			type : 'GET',
			async : true,
			url : deviceListUrl,
			dataType : 'json',
			data : {},
			beforeSend : function (xhr) {
				//add the basic authorization to the ajax request object header
				xhr.setRequestHeader("Authorization", auth);
				xhr.setRequestHeader("Accept", "application/json");
			},
			success : function (locationItem) {
				//use eval to transform json string returned from restful service to json object
				pwxdevicelocationvalue = locationItem;
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					var jsonData = locationItem;
				} //end if
				else {
					var pwx_device_deviceidnotfound_HTML = [];
					var headerdevicenotfound = document.getElementById('pwx_devices_content_area');
					pwx_device_deviceidnotfound_HTML.push('<div id="pwx_device_nolocation_div">',
						'<span class="pwx_single_dt_wpad"><span class="res-none">No devices found</span></span>',
						'</div>');
					$(headerdevicenotfound).html(pwx_device_deviceidnotfound_HTML.join(""));
				}
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					$.each(jsonData, function (i) {
						//load the devices into the devices array as new objects and stores the device ID and the connection status
						pwxglobaldeviceCount = pwxglobaldeviceCount + 1;
						pwxdeviceglobaldeviceslist[pwxglobaldeviceCount] = new pwxdeviceStatus(jsonData[i].deviceId, jsonData[i].conState);
					});
				} // end outer loop for parent locations
			}, // end success
			complete : function (locationItem) {
				//once we have the device ID's the next rest call will be used to get the display name and the category type which will be used for display purposes
				if (pwxdevicelocationsglobal.length != 0 && pwxdevicelocationvalue != "") {
					var dev_cnt = 0;
					var i = 0;
					//the following for loop is used to concat all the device ids into one variable which will be used to make the rest service call
					for (dev_cnt = 0; dev_cnt < pwxdeviceglobaldeviceslist.length; dev_cnt++) {
						if (dev_cnt == 0) {
							pwxdeviceglobaldevIds = "id=" + pwxdeviceglobaldeviceslist[dev_cnt].deviceID;
						} //end if
						else {
							pwxdeviceglobaldevIds = pwxdeviceglobaldevIds + "&id=" + pwxdeviceglobaldeviceslist[dev_cnt].deviceID;
						} //end else
					} //end for
					//this call will call the function to perform the rest service call to get the display
					PwxDeviceComponentRenderDeviceDescriptListView(pwxdeviceglobaldevIds);
				}
			}, // end complete
			error : function (locationItem) {
				// used for the ajax error handling if there was not a successful call to the restful service
			} // end error
		}); // end $.ajax
	}
} // end load
/*  This function will peform the rest service call to get the most recent results on the device */
function PwxDeviceComponentRenderAcquireData(deviceID, PwxDeviceComponentRenderAcquireData) {
	// Update the time as system current date and time
	var acquireupdatedcurrentdateandtime = new Date().format("mm/dd/yy HH:MM tt");
	document.getElementById("pwx_device_modal_updated_current_time").innerHTML = acquireupdatedcurrentdateandtime;
	pwxdeviceglobalbusResults.length = 0;
	var urlInfo = new XMLCclRequest();
	//get the url for the REST call
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");
	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);
		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");
		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		//create the URL
		if(URL.toLowerCase().indexOf("/ibus") > -1){
		var deviceListUrl = URL + "cas/api/tdds/device/latest/" + deviceID + ""}
		else{
		var deviceListUrl = URL + "/iBus/cas/api/tdds/device/latest/" + deviceID + ""
		}
			//the ajax call that will perform the rest service
			$.ajax({
				type : 'GET',
				async : true,
				url : deviceListUrl,
				dataType : 'json',
				data : {},
				beforeSend : function (xhr) {
					// add the basic authorization to the ajax request object header
					xhr.setRequestHeader("Authorization", auth);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success : function (locationItem) {
					// use eval to transform json string returned from restful service to json object
					if (locationItem != undefined && locationItem != null && locationItem != "") {
						var jsonData = locationItem;
					}
					//each outer loop to get the latest data from the device
					if (jsonData) {
						for (x = 0; x < pwxdeviceglobalbusResults.length; x++) {
							delete pwxdeviceglobalbusResults[x];
						}
						$.each(jsonData, function (i) {
							//the inner loop contains the actual result rows
							$.each(jsonData[i].entries, function (j) {
								pwxdeviceglobalbusResults[pwxdeviceglobalbusResults.length] = new pwxdevicefillBusResults(jsonData[i].entries[j].value, jsonData[i].entries[j].context);
							}); // end inner loop
						}); // end outer loop for parent locations
					}

				}, // end success
				complete : function (locationItem) {
					//the 'complete' is entered when the ajax call is complete, regardless of whether the call was successful or not
					var checkSuccess = 0;
					checkSuccess = pwxdevice_display_acquired_data();
				}, // end complete
				error : function (locationItem) {
					// used for the ajax error handling if there was not a successful call to the restful service
				} // end error
			}); // end $.ajax
	}
}
/* This function will take the vendor and the model and return an xml structure that when parsed out will display the available values from the device
and any the user can enter as well. */
function PwxDeviceComponentRenderDeviceEntryParameters(vendor, model, deviceId, display, vendorname, modelname) {
	//set global variable so we know what device to process
	pwxdeviceglobaldeviceIdPasslist = deviceId;
	var element = this.element;
	var hoverdeviceentryhtml = document.getElementById("deviceEntryParametersDiv");
	//get the URL for the rest service call
	var urlInfo = new XMLCclRequest();
	//get the url for the REST call
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");

	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);

		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");

		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		// build the url for the restful service call using the location alias passed to the load function
		if(URL.toLowerCase().indexOf("/ibus") > -1){
		var deviceListUrl = URL + "cas/api/configuration/path/ChartDocumentation?path=" + vendor + "/" + model + "";}
		else{
		var deviceListUrl = URL + "/iBus/cas/api/configuration/path/ChartDocumentation?path=" + vendor + "/" + model + "";
		}

		$.ajax({
			type : 'GET',
			async : true,
			url : deviceListUrl,
			dataType : 'text',
			data : {},
			beforeSend : function (xhr) {
				// add the basic authorization to the ajax request object header
				xhr.setRequestHeader("Authorization", auth);
				xhr.setRequestHeader("Accept", "text/xml");
			},
			success : function (results) {
				// 'sucess' is entered only if the ajax call to the restful service was successful, including the return of valid
				// data in the format specified in the dataType value in the $.ajax values list.
				// really hokey method of stripping out the CDATA tag so that we can parse the xml in the CDATA
				var newResults = results.replace("<![CDATA[", "");
				var newResults2 = newResults.replace("]]>", "");
				var newResults3 = newResults2.replace("<![CDATA[", "");
				var newResults4 = newResults3.replace("]]>", "");
				//document.getElementById('deviceEntryParametersDiv').innerHTML = "";
				var displyInd = 0;
				var unitsInd = 0;
				var groupInd = 0;
				var groupDisplay = "";
				var units = [];
				var results = []; // main array
				var resultsOrdered = []; // main array
				var groups = [];
				// use loadXMLString to transform the xml from a string to an xml document object
				var xmlDoc = pwxdeviceloadXMLString(newResults4);
				// use jquery to drill down to the 'Configuration' node in the xml object.
				var configuration = $(xmlDoc).find("Configuration");

				var optionFound = 0;
				var aliasInd = 0;
				var contextInd = 0;
				var referenceDisp = 0;
				var referenceId = 0;
				var index = 0;
				var context = 0;
				var groupCnt = 0;
				var propertyLevel = 0;
				var ignoreCnt = 0;
				var processCnt = 0;
				var dontProcess = 0;
				var totalCount = 0;
				var unitCount = 0;
				var unitAlias = 0;
				var baseUnit = 0;
				var conUnit = 0;
				var groupFound = 0;

				// drill down to the <properties> nodes(s) of <Configuration>
				$(configuration).find("properties").each(function () {
					propertyLevel = propertyLevel + 1;
					$(this).find("properties").each(function () {
						//there are multiple property levels, we only care about the second
						//each additional property level are sub options
						//each new level two property is a new field to display
						if (propertyLevel == 1) {
							//this logic is used to tell how many extra property rows on level 3 were found
							//we don't care about them, we already processed them when looking at level 2
							if (ignoreCnt == 0 || ignoreCnt <= processCnt) {
								ignoreCnt = 0;
								processCnt = 0;
								unitCount = 0;
								totalCount = 0;
								dontProcess = 0;
								//there is a possibility that we could be looking at a units row and not an actual field or
								//box to display.  This checks to see which record we need.
								$(this).find("string").each(function () {
									totalCount = totalCount + 1;
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units") {
										unitCount = unitCount + 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units.alias") {
										unitCount = unitCount + 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units.display") {
										unitCount = unitCount + 1;
									}
								});
								//so if we find all 3 and there are six totals rows
								//this must be a unit row, so make a new record to hold the units
								if (unitCount == 3 && totalCount == 6) {
									units[units.length] = new pwxdeviceunitsFill();
									//else it is a results row
								} else {
									results[results.length] = new pwxdeviceresultsFill();
								}
							} //end ignore count check
							else if (ignoreCnt > processCnt) {
								processCnt = processCnt + 1;
								dontProcess = 1;
							}
						}
						//we are not in ignore mode (looping through level three properties) so process if there are level threes to ignore
						if (ignoreCnt == 0) {
							//this counts how many level 3 properities there are.  We need to ignore them since they are processed as options in the level 2
							$(this).find("properties").each(function () {
								ignoreCnt = ignoreCnt + 1;
							});
						} //end ignore count
						//so if we make it here, these are the fields we need to display the information on the right side of the
						//screen.  Heart rate/BP/etc
						//so if the property level is 1 (actually still on level 2) if don't process isn't set (spinnign through level 3
						//then process
						$(this).find("string").each(function () {
							if (propertyLevel == 1) {
								if (dontProcess == 0) {
									if (displyInd == 1) {
										results[results.length - 1].name = this.text;
										displyInd = 0;
									}
									if (conUnit == 1) {
										results[results.length - 1].units = this.text;
										conUnit = 0;
									}
									if (optionFound == 1) {
										results[results.length - 1].indicator = 1;
										results[results.length - 1].optionsDisplay.push(this.text);
										optionFound = 0;
									}
									if (aliasInd == 1) {
										results[results.length - 1].alias = this.text
											aliasInd = 0;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.display") {
										displyInd = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.alias") {
										aliasInd = 1;
									}
									if (this.text == "com.cerner.edc.datamodel.appliance.common.reference.display") {
										optionFound = 1;
									}
									if (unitsInd == 1) {
										//i wasn't sure if this tag could appear in both a units row
										//and a results row, but I coded it to handle just in case
										if (unitCount == 3 && totalCount == 6) {
											units[units.length - 1].display = this.text;
										} else {
											results[results.length - 1].unitsDisp = this.text;
										}
										unitsInd = 0;
									}
									if (baseUnit == 1) {
										//i wasn't sure if this tag could appear in both a units row
										//and a results row, but I coded it to handle just in case
										if (unitCount == 3 && totalCount == 6) {
											units[units.length - 1].units = this.text;
										} else {
											results[results.length - 1].units = this.text;
										}
										baseUnit = 0;
									}
									if (unitAlias == 1) {
										if (unitCount == 3 && totalCount == 6) {
											units[units.length - 1].alias = this.text;
										} else {
											results[results.length - 1].unitsAlias = this.text;
										}
										unitAlias = 0;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units.display") {
										unitsInd = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.displayorderindex") {
										//these are int fields so our parsing through the string fields would miss it
										$(this).find("int");
										var test = $(this).next();
										results[results.length - 1].displayOrder = test.text();
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units") {
										baseUnit = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units.alias") {
										unitAlias = 1;
									}
									if (contextInd == 1) {
										results[results.length - 1].context = this.text;
										contextInd = 0;
									}
									if (groupInd == 1) {
										results[results.length - 1].group = this.text;
										var length = results.length - 1;
										for (check = 0; check < length; check++) {
											if (results[check].group == this.text) {
												results[results.length - 1].displayInd = 0;
											}
										}
										groupInd = 0;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context") {
										contextInd = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.index") {
										//this is an int, parsing through the strings would skip over this
										$(this).find("int");
										var test = $(this).next();
										results[results.length - 1].index = test.text();
									}
									//the third besides a results box for the right of the screen or a units that relates to the box
									//is a group section. The only thing we currently need out of this is the index for ordering
									//on the right of the screen
									if (groupFound == 1) {
										groups[groups.length] = new pwxdevicefillGroups();
										groups[groups.length - 1].name = this.text;
										groupFound = 0;
									}
									if (referenceId == 1) {
										results[results.length - 1].optionsId.push(this.text);
										referenceId = 0;
									}
									if (context == 1) {
										results[results.length - 1].context = this.text;
										context = 0;
									}
									if ($(this).text() == "com.cerner.edc.datamodel.appliance.common.reference.disply") {
										referenceDisp = 1;
									}
									if ($(this).text() == "com.cerner.edc.datamodel.appliance.common.reference.id") {
										referenceId = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.index") {
										index = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context") {
										context = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.group") {
										groupInd = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.unit") {
										conUnit = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.chart.group.name") {
										groupFound = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.chart.group.displayorderindex") {
										$(this).find("int");
										var int_num = $(this).next();
										groups[groups.length - 1].displayOrder = int_num.text();
									}
								} //end dontProcess
							} //end property level
						}); //end string processing
					}); //end properties level 2
				}); //end properties level 1

				//there is probably an easier way to do this, but now for the displaying purposes and for pulling
				//the data off the bus these next several for loops move data around, copy data, and fill out blanks
				//set the units
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < units.length; y++) {
						if (results[x].units == units[y].units) {
							results[x].unitsDisp = units[y].display;
							results[x].unitsAlias = units[y].alias;
						}
					}
				}
				//if context is blank, set it to the name
				for (x = 0; x < results.length; x++) {
					if (results[x].context == "") {
						results[x].context = results[x].name;
						results[x].boxName = results[x].name; // additional context mapping goes here
					} else {
						results[x].boxName = results[x].context
					}
				}
				//determine if there are sub children
				//so for temperature, a sub child is where is the temperature taken
				//Also these sub children need the same units as the parent boxes
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < results.length; y++) {
						if (results[x].context == results[y].context && x != y) {
							if (results[x].indicator == 1) {
								results[x].subChild = 1
									results[x].unitsAlias = results[y].unitsAlias;
							} else if (results[y].indicator == 1) {
								results[y].subChild = 1
									results[y].unitsAlias = results[x].unitsAlias;
							}
						}
					}
				}
				//if th context is the same, update the box name
				//the box name is used to give each row a unique ID for
				//both pulling data from the bus and displaying in the correct spot
				//to also pushing the data to mill
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < results.length; y++) {
						if (results[x].context == results[y].context && x != y) {
							if (results[x].indicator == 1) {
								results[x].boxName = results[x].context + " Box";
							}
						}
					}
				}
				//so for sub child rows, they actually want the result in both places
				//so for temp, if the temp is 37 then temp location needs a result of 37 as
				//well.  This is to set that up for below
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < results.length; y++) {
						if (results[x].group == results[y].group && x != y) {
							if (results[x].displayInd == 1 && results[y].displayInd == 0) {
								if (results[x].subChild == 1 && results[y].subChild == 1) {
									results[y].boxName = results[x].boxName
								}
							}
						}
					}
				}
				//everything is set, expect the groups don't have there order set
				//spin through the groups record, and if there is a match grab the display order
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < groups.length; y++) {
						if (results[x].group == groups[y].name) {
							results[x].displayOrder = groups[y].displayOrder
						}
					}
				}
				//once the results are finally in order we copy to a new list where they are ordered
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < results.length; y++) {
						if (results[y].group > "") {
							if (results[y].displayOrder == x) {
								resultsOrdered[resultsOrdered.length] = new pwxdeviceresultsFill();
								resultsOrdered[resultsOrdered.length - 1] = results[y];
							}
						} else {
							if (results[y].displayOrder == x && results[y].name > "") {
								resultsOrdered[resultsOrdered.length] = new pwxdeviceresultsFill();
								resultsOrdered[resultsOrdered.length - 1] = results[y];
							}
						}
					}
				}
				//if the device is active we need one image, else another
				var pwxdeviceStatus = pwxdevicefindDeviceStatus(display);
				var pwx_device_modal_header_HTML = [];
				//Get current date and time with this formate (mm/dd/yy timeam/pm)
				var pwxdeviceupdatedfinalconnecteddatedisplay = new Date().format("mm/dd/yy HH:MM tt");

				pwx_device_modal_header_HTML.push('<div style="width:100%" id="pwx_device_modal_header_HTML">',
					                             '<span style="height:45px;float:left;" class="pwx_indicator_on_icon pwx_no_text_decor">&nbsp;</span>',
					                             '<dl id="pwx_device_modal_header_first">',
					                             '<span id="pwx_modal_header_device_name_id">' + display + '</span>',
					                             '<span class="pwx_grey">(' + vendorname + '' + modelname + ')</span></dl>',
					                             '<dl style="margin-top:1.0%;">',
					                             '<span id="pwx_device_modal_updated_current_time">' + pwxdeviceupdatedfinalconnecteddatedisplay + '</span>',
					                             '<a id="pwx_device_acquired_anchor" class="pwx_device_row_anchor" style="margin-left:0.5%;" title="Retrieve data">',
					                             '<span class="pwx-refresh-icon pwx_no_text_decor"></span></a>',
					                             '<a id="pwx_device_clear_all" class="pwx_blue_link" title="Clear all textboxes">',
					                             'Clear all</a>',
					                             '</dl></div>');

				var groupCnt = 0;
				var dispCnt = 0;
				var displayCurrent = 0;
				var pwxdevicesingcnt = 0;
				var DevicemodalHTML = [];
				DevicemodalHTML.push("<div style='overflow-x:hidden' class='pwx_device_modal_input' id='vitals-data'>");
				if (pwxdeviceStatus == 0) {
					var countinc = 0;
					groupCnt = 1;
					dispCnt = 0;
					var pwxdevicedisplayobject = resultsOrdered.pwxgroupBy('group');
					var count_group_ids = 0;
					var bpgroupcount = 0;
					for (var groupname in pwxdevicedisplayobject) {
						if (groupname != "") {
							var groupindicator = "";
							groupindicator = groupname.replace(" ", "_");
							DevicemodalHTML.push('<div id="' + count_group_ids + '" class="pwxdevicegroupdiv"><h3 class="pwx_grey">' + groupname + '</h3>');
							$.each(pwxdevicedisplayobject[groupname], function (i, val) {
								if (bpgroupcount != 1) {
									if (groupname == "BP") {
										DevicemodalHTML.push('<div id="groupbp' + i + '" onmouseout="pwxdevicemouseouthideclearbutton(this)" onmouseover="pwxdevicemousehovershowclearbutton(this)" class="pwxdevicebpgroup">',
											'<span title="' + val.name + '">' + val.name + '</span>',
											"<input type='text' size='10'  id ='" + pwxdevicedisplayobject[groupname][i].context + "'  ",
											"onKeyPress='return pwxdevicecheckIt(event);' class='groupbptextbox' name='heartRate' oncopy='return false;'",
											"onpaste='return false;' oncut='return false;'/> / ",
											"<input type='text' size='10' onKeyPress='return pwxdevicecheckIt(event);'",
											"id = '" + pwxdevicedisplayobject[groupname][i + 1].context + "'class='groupbptextbox'",
											"name='dBP' oncopy='return false;' onpaste='return false;' oncut='return false;'/>",
											"<span style='padding-left:1%;width:3%;' class='pwx_grey'>" + val.unitsDisp + "</span>",
											'<a id="pwxdevicebpgroupclearlink" class="pwx_blue_link pwxdevicegroupbpanchor" title="Clear">',
											'Clear</a>',
											'</div>');
										bpgroupcount = 1;
									}
								}
								var labelname = "";
								if ((val.name).length >= 25) {
									labelname += (val.name).substr(0, 25) + '...';
								} else {
									labelname += val.name;
								}
								if (groupname != "BP") {
									DevicemodalHTML.push('<div id="' + groupindicator + 'groupno' + i + '" onmouseout="pwxdevicemouseouthideclearbutton(this)" onmouseover="pwxdevicemousehovershowclearbutton(this)" class="pwxdevicenonbpgroupdiv">',
										'<span title="' + val.name + '" class="pwxdevicegrouplabel">' + labelname + '</span>',
										"<input style='margin-left:2%;' type='text' size='10' id ='" + val.context + "' onKeyPress='return pwxdevicecheckIt(event);' class='" + groupindicator + "" + i + "' oncopy='return false;' onpaste='return false;' oncut='return false;'/>",
										'<span style="padding-left:3%;width:3%;" class="pwx_grey" >' + val.unitsDisp + '</span>',
										'<a id="' + groupindicator + '' + i + '" class="pwx_blue_link pwxdevicegroupanchor" title="Clear">',
										'Clear</a>',
										'</div>');
								}
							});
							DevicemodalHTML.push('</div>');
							count_group_ids = count_group_ids + 1;
						} else {
							$.each(pwxdevicedisplayobject[groupname], function (i, val) {
								var labelname = "";
								if ((val.name).length >= 25) {
									labelname += (val.name).substr(0, 25) + '...';
								} else {
									labelname += val.name;
								}
								if (val.indicator == 0) {
									DevicemodalHTML.push('<div id="pwxdevicenongrouptextbox' + i + '" onmouseout="pwxdevicemouseouthideclearbutton(this)" onmouseover="pwxdevicemousehovershowclearbutton(this)" class="pwxdevicegroupdiv">',
										'<span title="' + val.name + '" class="pwxdevicenongrouplabel">' + labelname + '</span>&nbsp;&nbsp;',
										"<input type='text' size='10' id ='" + val.boxName + "' onKeyPress='return pwxdevicecheckIt(event);' class='pwxdevicenongrouptextbox" + i + "' oncopy='return false;' onpaste='return false;' oncut='return false;'/>",
										"&nbsp;&nbsp;&nbsp;&nbsp;",
										'<span class="pwx_grey" style="width:3%;">' + val.unitsDisp + '</span>',
										'<a id=' + i + ' class="pwx_blue_link pwxdevicenongroupanchor" title="Clear">',
										'Clear</a>',
										'</div>');
								}
								if (val.indicator == 1) {
									DevicemodalHTML.push('<div id="pwxdevicenongrouptextbox' + i + '" class="pwxdevicegroupdiv">',
										'<span title="' + val.name + '" class="pwxdevicenongrouplabel">' + labelname + '</span>&nbsp;&nbsp;',
										"<select style='text-align:center;' name = '" + val.name + "' class='pwxdevicenongroupdropdown' id = '" + val.boxName + "'>");
									for (y = 0; y < (val.optionsDisplay).length; y++) {
										DevicemodalHTML.push("<option size=20 value=" + val.optionsDisplay[y] + ">" + val.optionsDisplay[y] + "");
									}
									DevicemodalHTML.push("</select></span></dd></dl></div>");
								}
							});
						}
					}
					if (pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM.length > 0) {
						DevicemodalHTML.push('<div id="pwx_device_chart_from_section"> ');
						if (pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM.length == 1) {
							DevicemodalHTML.push('<a class="pwx_no_text_decor pwx_grey_link pwx_small_text" title="Add PowerForm" ',
								'onClick="pwx_form_launch(' + pwx_device_person_id + ',' + pwx_device_enc_id + ',' + pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM[0].FORM_ID + ',0.0,0)">',
								'<span class="pwx-add-icon pwx_no_text_decor">&nbsp;</span> Chart form</a>');
						} else {
							DevicemodalHTML.push('<a class="pwx_no_text_decor pwx_grey_link pwx_small_text"   title="Add PowerForm" ',
								'onClick="pwx_form_launch(' + pwx_device_person_id + ',' + pwx_device_enc_id + ',0.0,0.0,0)">',
								'<span class="pwx-add-icon-plus pwx_no_text_decor">&nbsp;</span></a>',
								'<a id="pwx_device-form-dpdown-menu" class="pwx_no_text_decor" title="Add Quick PowerForms" ',
								'onClick="pwx_form_menu(\'pwx_device_alert_form_div\')">',
								'<span class="pwx-add-icon-plus-arrow pwx_no_text_decor"></span><span>Chart form</span></a>',
								'<div class="pwx_device-form-dpdown-menu" id="pwx_device_alert_form_div" style="display:none;">');
							for (var i = 0; i < pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM.length; i++) {
								DevicemodalHTML.push('<a class="pwx_formmenu_link" style="font-weight:bold"',
									'onClick="pwx_form_launch(' + pwx_device_person_id + ',' + pwx_device_enc_id + ',' + pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM[i].FORM_ID + ',0.0,0)">',
									pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM[i].FORM_NAME + '</a></br>');
							}
							DevicemodalHTML.push('<a style="color:#3380E5;font-weight:normal;" ',
								'onClick="pwx_form_launch(' + pwx_device_person_id + ',' + pwx_device_enc_id + ',0.0,0.0,0)">',
								'All Forms...</a></div>');
						}
						DevicemodalHTML.push("</div>");
					}
					//clear out the global version
					pwxdeviceresultsGlobal = [];
					// Copy whole resule in globalobject and then used later on in sign on process
					for (x = 0; x < results.length; x++) {
						pwxdeviceresultsGlobal[x] = new pwxdeviceresultsFill();
						pwxdeviceresultsGlobal[x] = results[x];
					}
					DevicemodalHTML.push("</div>");
				}
				var width = $(window).width();
				var pwxdevicemodalfixedminwidthbefore = 712.32; // on width 1272 and width of original modal is 560
				var setMarginon = ((width - pwxdevicemodalfixedminwidthbefore) / 2) * 0.1
				if (width > 1272) {
					setMarginon = 28;
				}
				MP_ModalDialog.deleteModalDialogObject("DevicemodalObject")
				var Devicemodal = new ModalDialog("DevicemodalObject")
					.setHeaderTitle(pwx_device_modal_header_HTML.join(""))
					.setTopMarginPercentage(15)
					.setRightMarginPercentage(setMarginon)
					.setBottomMarginPercentage(15)
					.setLeftMarginPercentage(setMarginon)
					.setIsBodySizeFixed(false)
					.setHasGrayBackground(true)
					.setIsFooterAlwaysShown(true);
				Devicemodal.setBodyDataFunction(
					function (modalObj) {
					modalObj.setBodyHTML(DevicemodalHTML.join(""));
				});
				var signbtn = new ModalButton("signdata");
				signbtn.setText("Sign").setCloseOnClick(false).setIsDithered(true).setOnClickFunction(function () {
					pwxdevicesingcnt++; 
				    if(pwxdevicesingcnt == 1){ 
				    pwxdeviceSignData()}
				});
				var closebtn = new ModalButton("addCancel");
				closebtn.setText("Cancel").setCloseOnClick(true);
				Devicemodal.addFooterButton(signbtn)
				Devicemodal.addFooterButton(closebtn)
				Devicemodal.setShowCloseIcon(false);
				MP_ModalDialog.addModalDialogObject(Devicemodal);
				MP_ModalDialog.showModalDialog("DevicemodalObject");

				// display modal on appropriate place when window is resize
				$(window).resize(function () {
					var width = $(window).width();
					var pwxdevicemodalfixedminwidth = 712.32; // on width 1272 and width of original modal is 560
					var setMarginonwindowresize = ((width - pwxdevicemodalfixedminwidth) / 2) * 0.1
					if (width > 1272) {
						setMarginonwindowresize = 28;
					}
					Devicemodal.setRightMarginPercentage(setMarginonwindowresize)
					Devicemodal.setLeftMarginPercentage(setMarginonwindowresize)

				});
				//call this function for enable and disable sign button
				$('.pwx_device_modal_input input').keyup(function () {
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//call this function when drop down gets change
				$('.pwxdevicenongroupdropdown').change(function () {
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//Clear nongroup single textbox (this is dynamic anchor code
				$(".pwxdevicenongroupanchor").click(function () {
					var i = this.id;
					$('.pwxdevicenongrouptextbox' + i + '').val('');
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//Clear group single textbox (this is dynamic anchor code)
				$(".pwxdevicegroupanchor").click(function () {
					var i = this.id;
					$("." + i + "").val('');
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//clear all textboxes
				$("#pwx_device_clear_all").click(function () {
					$(".pwxdevicenongroupdropdown option[value='']").attr('selected', true)
					$('.pwx_device_modal_input').find('input:text').val('');
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//clear both textbox of blood pressure
				$(".pwxdevicegroupbpanchor").click(function () {
					$('.groupbptextbox').val('');
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				// call the acquire function
				$("#pwx_device_acquired_anchor").click(function () {
					PwxDeviceComponentRenderAcquireData(pwxdeviceglobaldeviceIdPasslist, pwxdeviceupdatedfinalconnecteddatedisplay);
					//setInterval(pwxdeviceenabledisablesignbutton(Devicemodal),3000);
					setInterval(function () {
						pwxdeviceenabledisablesignbutton(Devicemodal)
					}, 1000);
				});
				//display form drop down when it click
				$("#pwx_device-form-dpdown-menu").click(function (event) {
					var dt_pos = $(this).position();
					$('.pwx_device-form-dpdown-menu').css('top', dt_pos.top + 13);
					$('.pwx_device-form-dpdown-menu').css('left', dt_pos.left + 8);
				});
				$('#pwx_device_alert_form_div').bind('mouseleave', function () {
					pwx_form_menu('pwx_device_alert_form_div')
				});
				$('#pwx_device_acquired_anchor').click();
			}, // end success
			complete : function (locationItem) {
				// the 'complete' is entered when the ajax call is complete, regardless of whether the call was successful or not
			}, // end complete
			error : function (locationItem) {
				// used for the ajax error handling if there was not a successful call to the restful service
			}
		}); // end $.ajax
	}
}

// Variable to keep the barcode when scanned. When we scan each character is a keypress and hence we push it onto the array.
var chars = []; 
var pressed = false; 
$(window).keypress(function(e) {
	chars.push(String.fromCharCode(e.which));
	if (pressed === false) {
		// waits for input from the barcode scanner
		setTimeout(function(){
			// join the chars array to make a string of the barcode scanned
			var barcode = chars.join("");
			onScan(barcode);
			chars = [];
			pressed = false;
		},500);
	}
	// set press to true so we do not reenter the timeout function above
	pressed = true;
});
	
/* This function takes a list of devices and gets the display name to show to the user in the UI */
function PwxDeviceComponentRenderDeviceDescriptListView(deviceIds) {
	var deviceListFinalHTML = "";
	var deviceListOnlineHTML = "";
	var deviceListOfflineHTML = "";
	var contentelement = document.getElementById("pwx_devices_content_area");
	var urlInfo = new XMLCclRequest();
	//get the url for the REST call
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");

	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);

		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");

		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		// build the url for the restful service call using the location alias passed to the load function
		if(URL.toLowerCase().indexOf("/ibus") > -1){
		var deviceListUrl = URL + "gda/api/devices?" + deviceIds + "&retDiscon=true";}
		else{
		var deviceListUrl = URL + "/iBus/gda/api/devices?" + deviceIds + "&retDiscon=true";
		}
		var border_type = 'pwx_grey_border_top-info';

		$.ajax({
			type : 'GET',
			async : true,
			url : deviceListUrl,
			dataType : 'json',
			data : {},
			beforeSend : function (xhr) {
				//add the basic authorization to the ajax request object header
				xhr.setRequestHeader("Authorization", auth);
				xhr.setRequestHeader("Accept", "application/json");
			},
			success : function (locationItem) {
				var vitalsHTML;
				// 'success is entered only if the ajax call to the restful service was successful, including the return of valid
				// data in the format specified in the dataType value in the $.ajax values list.
				// use eval to transform json string returned from restful service to json object
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					var jsonData = locationItem;
					deviceData = locationItem;
				} else {
					var pwx_device_deviceidfail_HTML = [];
					var pwxdeviceidfail = document.getElementById('pwx_devices_content_area');
					pwx_device_deviceidfail_HTML.push('<div id="pwx_device_nolocation_div">',
						'<span class="pwx_single_dt_wpad"><span class="res-none">No devices found</span></span>',
						'</div>');
					$(pwxdeviceidfail).html(pwx_device_deviceidfail_HTML.join(""));
				}
				var found_vendor = 0;
				var process_flag = 0;

				if (pwxdevicevendorglobalNamelist.length == 0 && locationItem != "" && locationItem != null) {
					$.each(jsonData.devices, function (i) {
						//this is a 2d array.  The 0 positions hold the device type then all other positions hold the associated devices
						//so for [0][0] we will have the first device type.  Then pwxdevicevendorglobalNamelist[0][1], [0][2], etc. will have device names
						//that belong to that vendor.  Then pwxdevicevendorglobalNamelist[1][0] will have the next
						found_vendor = pwxdevicefindVendor(jsonData.devices[i].subcategories[0])
							process_flag = 0;
						for (x = 0; x < jsonData.devices[i].categories.length; x++) {
							if (jsonData.devices[i].categories[x] == "DISCRETE_DATA") {
								process_flag = 1;
							}
						}
						if (process_flag == 1) {
							if (found_vendor == -1) {
								// test 3
								pwxdeviceglobalcurrentVendorCnt = pwxdeviceglobalcurrentVendorCnt + 1;
								pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt] = new Array();
								pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt][0] = new pwxdevicefillSubCategories(jsonData.devices[i].subcategories[0])
									pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt][0].displayInd = 1;
								pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt][0].count = 1;
								pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt][1] = new pwxdevicesetVendorModel(jsonData.devices[i].displayName, jsonData.devices[i].connectedDateTime, jsonData.devices[i].disconnectedDateTime, jsonData.devices[i].model.modelName, jsonData.devices[i].model.vendor, jsonData.devices[i].deviceId, jsonData.devices[i].network.adptHostName, jsonData.devices[i].network.adptIP);
								pwxdevicefillDisplay(jsonData.devices[i].displayName, jsonData.devices[i].deviceId);
							} //end if found_vendor
							else {
								// Emory device
								pwxdevicevendorglobalNamelist[found_vendor][pwxdevicevendorglobalNamelist[found_vendor].length] = new pwxdevicesetVendorModel(jsonData.devices[i].displayName, jsonData.devices[i].connectedDateTime, jsonData.devices[i].disconnectedDateTime, jsonData.devices[i].model.modelName, jsonData.devices[i].model.vendor, jsonData.devices[i].deviceId, jsonData.devices[i].network.adptHostName, jsonData.devices[i].network.adptIP);
								pwxdevicevendorglobalNamelist[found_vendor][0].count = pwxdevicevendorglobalNamelist[found_vendor][0].count + 1;
								pwxdevicefillDisplay(jsonData.devices[i].displayName, jsonData.devices[i].deviceId);
							} //end else
						} //end if process_flag
					}); // end outer loop for parent locations
				}
				var pwxdeviceStatus = 0;
				var variableImage;
				var length = "";
				var dontPrint = 0;
				var color = "";
				var connectedDevicesCnt = 0;
				var disconnectedDevicesCnt = 0;
				var pwx_device_status_name_HTML = [];
				pwx_device_status_name_HTML.push('<h3 class="info-hd">Device</h3><div class="pwx_div_scroll" id="pwx_device_scroll_div">');
				var deviceHvrArray = [];
				var deviceindex = 0;
				for (ven = 0; ven < pwxdevicevendorglobalNamelist.length; ven++) {
				    if (pwxdevicevendorglobalNamelist[ven][0].displayInd == 1) {
						var vitalsCheck = pwxdevicevendorglobalNamelist[ven][0].subCategory;
						for (i = 0; i < pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST.length; i++) {
							if (vitalsCheck == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
								vitalsHTML = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY;
							}
						}
						// Build the expand collapse functionality based on device name and connectivity status
						pwx_device_status_name_HTML.push('<dl class="pwxnopad-info"><dt class="pwx_single_sub_sec_dt"><a id="pwx_devices_title" class="pwx_sub_sec_link" title="Collapse" ',
							'onclick="pwx_expand_collapse_scroll(\'pwx_devices_list\',\'pwx_devices_title\',\'pwx_devices_tgl\',\'pwx_device_scroll_div\',' + pwx_device_scrollsetting + ')">',
							'<h3 class="sub-sec-hd"><span id="pwx_devices_tgl" class="pwx-sub-sec-hd-tgl">-</span>',
							'<span id="pwx_devices_device_category" class="pwx_header_black">',
							vitalsHTML,
							'</span>',
							'<span id="pwx_devices_connection_info"> ',
							'</span><span id="pwx_devices_online_info"></span>',
							'<span id="pwx_devices_offline_info"></span></h3></a></dt></dl>',
							'<div id="pwx_devices_list" style="display:block">');

						var class_name;
						for (y = 1; y < pwxdevicevendorglobalNamelist[ven].length; y++) {
							if (pwxdevicevendorglobalNamelist[ven][y].displayInd == 1) {
								pwxdeviceStatus = pwxdevicefindDeviceStatus(pwxdevicevendorglobalNamelist[ven][y].display);
								if (pwxdeviceStatus == 0) {
									class_name = "device-list online";
									var pwx_device_status_text = "Connected";
									connectedDevicesCnt = connectedDevicesCnt + 1;
								} else if (pwxdeviceStatus == 1) {
									class_name = "device-list offline";
									var pwx_device_status_text = "Offline";
									disconnectedDevicesCnt = disconnectedDevicesCnt + 1;
								} else {
									class_name = "device-list offline";
									var pwx_device_status_text = "Offline";
									disconnectedDevicesCnt = disconnectedDevicesCnt + 1;
								}
								var vitals = "deviceEntryParametersDiv";
								var vend = pwxdevicevendorglobalNamelist[ven][y].display;
								var vendorCorrection = "";
								var vendorCorrectionhover = "";
								var vendormodal = "";
								for (i = 0; i < pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST.length; i++) {
									if (pwxdevicevendorglobalNamelist[ven][y].vendor == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
										vendorCorrection = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY + ", ";
										vendorCorrectionhover = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY;
									}
									if (pwxdevicevendorglobalNamelist[ven][y].model == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
										vendormodal = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY;
									}
								}
								//Will need to code for additional vendors in this area
								var addButton = ""
									//CONNECTED TIME
									if (pwxdeviceStatus == 0) {
										var now = new Date();
										var cndatespiltstring = pwxdevicevendorglobalNamelist[ven][y].connecteddatetime.split('T');
										var cndatepart1 = cndatespiltstring[0].replace(/\-/g, '/')
										var cndatepart2 = cndatespiltstring[1].split('.');
										var cndatefinalstring = cndatepart1 + " " + cndatepart2[0];
										var connectedateformat = Date.parse(cndatefinalstring);
										var difference = now - connectedateformat;
										var connectedateformathover = new Date(cndatefinalstring).format("mm/dd/yy HH:MM tt");
										var finalconnecteddatedisplay = pwxdevicedifferenceToString(difference) + '(' + connectedateformathover + ')';
									}
									// OFFLINE TIME
									if (pwxdeviceStatus == 1) {
										var now = new Date();
										var dndatespiltstring = pwxdevicevendorglobalNamelist[ven][y].disconnectedDateTime.split('T');
										var dndatepart1 = dndatespiltstring[0].replace(/\-/g, '/')
										var dndatepart2 = dndatespiltstring[1].split('.');
										var dndatefinalstring = dndatepart1 + " " + dndatepart2[0];
										var disconnectdateformat = Date.parse(dndatefinalstring);
										var disconnecteddifference = now - disconnectdateformat;
										var disconnectdateformat = new Date(dndatefinalstring).format("mm/dd/yy HH:MM tt");
										var finaldisconnecteddatedisplay = pwxdevicedifferenceToString(disconnecteddifference) + '(' + disconnectdateformat + ')';
									}
								var myHvr = new Array(8);
								myHvr[0] = new Array(2);
								if (pwxdeviceStatus == 0) {
									myHvr[0][0] = 'Status:';
									myHvr[0][1] = '<span id="pwx_device_connected_color">Connected </span><span class="pwx_grey">' + finalconnecteddatedisplay + '</span>';
								} else {
									myHvr[0][0] = 'Status:';
									myHvr[0][1] = '<span>Offline </span><span class="pwx_grey">' + finaldisconnecteddatedisplay + '</span>';
								}
								myHvr[1] = new Array(2);
								myHvr[1][0] = 'Device:';
								myHvr[1][1] = pwxdevicevendorglobalNamelist[ven][y].display;
								myHvr[2] = new Array(2);
								myHvr[2][0] = 'Manufacturer:';
								myHvr[2][1] = vendorCorrectionhover;
								myHvr[3] = new Array(2);
								myHvr[3][0] = 'Model:';
								myHvr[3][1] = vendormodal;
								myHvr[4] = new Array(2);
								myHvr[4][0] = 'Category:';
								myHvr[4][1] = vitalsHTML;
								myHvr[5] = new Array(2);
								myHvr[5][0] = 'Device ID:';
								myHvr[5][1] = pwxdevicevendorglobalNamelist[ven][y].deviceID;
								myHvr[6] = new Array(2);
								myHvr[6][0] = 'Adapter Host Name:';
								myHvr[6][1] = pwxdevicevendorglobalNamelist[ven][y].adptHost;
								myHvr[7] = new Array(2);
								myHvr[7][0] = 'Adapter IP:';
								myHvr[7][1] = pwxdevicevendorglobalNamelist[ven][y].adptIP;

								deviceHvrArray.push(myHvr);

								if (pwxdeviceStatus == 0) {
									pwx_device_status_name_HTML.push('<dl id="device_row_'+deviceindex+'" class="' + border_type + ' device-info">',
										'<a class="pwx_device_row_anchor" onclick="pwxdevicemodalopen(\'' + vitals + '\',\'' + ven + '\',' + y + ',\'' + vend + '\');">',
										'<dt id="pwx_devices_header_deviceindicator">',
										'<span style="height:45px;float:left;" class="pwx_indicator_on_icon"></span></dt>',
										'<dt id="pwx_devices_header_devicename"><span style="font-weight:bold;">' + pwxdevicevendorglobalNamelist[ven][y].display + '</span>',
										'<p style="font-size:11px;" class="pwx_grey">' + pwxdevicedifferenceToString(difference) + '</p></dt>',
										'<dt id="pwx_devices_header_devicemanufname"><span style="font-weight:bold;">' + vendorCorrection + '</span>',
										'<span id="pwx_device_mo" class="pwx_grey">' + vendormodal + '</span></dt>',
										'<dt id="pwx_devices_header_devicelaunchsection">',
										'<a id='+(pwxdevicevendorglobalNamelist[ven][y].deviceID).replace(/\s+/g, '')+' onclick="pwxdevicemodalopen(\'' + vitals + '\',\'' + ven + '\',' + y + ',\'' + vend + '\');" title="Add Vitals">',
										'<span class="pwx-add-icon-plus pwx_no_text_decor"></span></a>',
										'</dt></a></dl>');
									border_type = 'pwx_grey_border-info';
								} else if (pwxdeviceStatus == 1) {
									pwx_device_status_name_HTML.push('<dl id="device_row_'+deviceindex+'" class="' + border_type + ' device-info">',
										'<dt id="pwx_devices_header_deviceindicator">',
										'<span style="height:45px;float:left;" class="pwx_indicator_off_icon"></span></dt>',
										'<dt id="pwx_devices_header_devicename"><span style="font-weight:bold;">' + pwxdevicevendorglobalNamelist[ven][y].display + '</span>',
										'<p style="font-size:11px;" class="pwx_grey">' + pwxdevicedifferenceToString(disconnecteddifference) + '</p></dt>',
										'<dt id="pwx_devices_header_devicemanufname"><span style="font-weight:bold;">' + vendorCorrection + '</span>',
										'<span id="pwx_device_modal_name" class="pwx_grey">' + vendormodal + '</span></dt>',
										'<dt id="pwx_devices_header_devicelaunchsection">',
										'<span class="pwx-alert-red-icon"></span>',
										'</dt></dl>'); 
									border_type = 'pwx_grey_border-info';
								}
								deviceindex = deviceindex + 1;
								if (dontPrint == 0) {}
								else {
									dontPrint = 0;
								}
							}
						} //end for y
						pwx_device_status_name_HTML.push("</div>");
						pwx_device_status_name_HTML.push("</div>");
						$(contentelement).html(pwx_device_status_name_HTML.join(""));
						//hovers and check scrolling activate hovers
	                    var elementMap = {};
	                    // remove event if there is any
	                    $("#pwx_device_scroll_div").off("mouseenter", 'dl.device-info');
	                    $("#pwx_device_scroll_div").off("mouseleave", 'dl.device-info');
	                    // attach event
	                    $("#pwx_device_scroll_div").on("mouseenter", 'dl.device-info', function (event) {
	                    	var anchor = this;
	                    	$(this).css("background-color", "#FFC")
	                    	var anchorId = $(this).attr("id");
	                    	//If there is a hover class specified, add it to the element
	                    	$(this).addClass("mpage-tooltip-hover");
	                    	if (!elementMap[anchorId]) {
	                    		elementMap[anchorId] = {};
	                    	}
	                    	//Store of a flag that we're hovered inside this element
	                    	elementMap[anchorId].TIMEOUT = setTimeout(function () {
	                    			showdeviceHover(event,anchor);
	                    		}, 500);
	                    });
	                    $("#pwx_device_scroll_div").on("mouseleave", 'dl.device-info', function (event) {
	                    	$(this).css("background-color", "#FFF")
	                    	$(this).removeClass("mpage-tooltip-hover");
	                    	clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
	                    });
	                    function showdeviceHover(event,anchor) {
	                    	var jsonId = $(anchor).attr("id").split("_");
	                    	switch (jsonId[0]) {
	                    	case "device":
	                    		var deviceindexarray = deviceHvrArray[jsonId[2]];
	                    		showdeviceHoverHTML(event, anchor, deviceindexarray)
	                    	break;
	                    	}
	                    }
	                    function showdeviceHoverHTML(event, anchor, devicehoverarray) {
	                    	var devicehvr = [];
	                    	devicehvr.push('<div class="result-details">');
	                    	for (var i = 0; i < devicehoverarray.length; i++) {
	                    		devicehvr.push('<dl class="device-det">',
	                    			'<dt><span>' + devicehoverarray[i][0] + '</span></dt><dd><span>' + devicehoverarray[i][1] + '</span></dd></dl>');
	                    	}
	                    	//Create a new tooltip
	                    	devicehvr.push('</div>');
	                    	var devicehvrtooltip = new MPageTooltip();
	                    	devicehvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(devicehvr.join(""));
	                    	devicehvrtooltip.show();
	                    	if(typeof m_viewpointJSON != "undefined"){$('html').css('overflow', 'hidden');}
	                    }
						var pwxdivh = document.getElementById('pwx_device_scroll_div').offsetHeight;
						if (pwxdivh > pwx_device_scrollsetting) {
							var div_height = pwx_device_scrollsetting + 'px';
							document.getElementById('pwx_device_scroll_div').style.height = div_height;
						}
						pwxclearheight('pwx_device_scroll_div', pwx_device_scrollsetting);
						var connectionInfoBeg = " (";
						if (connectedDevicesCnt > 0) {
							var onlineInfo = +connectedDevicesCnt + " <span id='pwx_device_connected_color'>connected</span>";
							var offlineInfo = ", "
						} else {
							var offlineInfo = ""
						}
						offlineInfo += disconnectedDevicesCnt + " offline)";
						$('#pwx_devices_connection_info').html(connectionInfoBeg);
						$('#pwx_devices_online_info').html(onlineInfo);
						$('#pwx_devices_offline_info').html(offlineInfo);						
						
					} // end if displayInd
				} //end for ven
			}, // end success
			complete : function (locationItem) {}, // end complete
			error : function (locationItem) {}
			// end error
		}); // end $.ajax
	}
}

function onScan(barcodeVal) { 
	if(deviceData != null && deviceData != undefined) {
		$.each(deviceData.devices, function (i) {
			if ( barcodeVal != '' && barcodeVal.trim() === deviceData.devices[i].deviceId.trim()) {
				$('#'+(deviceData.devices[i].deviceId).replace(/\s+/g, '')).click();
			}
		});
	}
}
										
//enable and disable sign button when user hit clear button
function pwxdeviceenabledisablesignbutton(Devicemodal) {
	var pwx_device_drop_down = $(".pwxdevicenongroupdropdown").val();
	var pwx_device_input_value_change = $(".pwx_device_modal_input input").map(function () {
			var value = $.trim($(this).val());
			if (value != "")
				return value;
		}).length > 0;
	if (pwx_device_input_value_change == true || pwx_device_drop_down != '') {
		Devicemodal.setFooterButtonDither("signdata", false);
	} else {
		Devicemodal.setFooterButtonDither("signdata", true);
	}
}
function pwxdevicemousehovershowclearbutton(divid) {
	var showhideid = divid.id;
	$('#' + divid.id + ' a').show();
}
function pwxdevicemouseouthideclearbutton(divid) {
	var showhideid = divid.id;
	$('#' + divid.id + ' a').hide();
}
function pwxdeviceloadXMLString(txt) {
	//Internet Explorer
	//this creates the nex XML object
	xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	xmlDoc.async = "false";
	xmlDoc.loadXML(txt);
	return (xmlDoc);
}
/* The pwxdeviceStatus function creates a pwxdeviceStatus object.The status of the device, 0 for active, 1 for inactive, 2 for unknow */
function pwxdeviceStatus(deviceID, status) {
	//fill out the members of the pwxdeviceStatus object
	this.deviceID = deviceID;
	this.status = status;
	this.display = "";
} //end pwxdeviceStatus
/* The findVendor function checks to see if the vendor already exists  in the array.Returns a -1 if not found or the first position where it is found in the array */
function pwxdevicefindVendor(vendor_name) {
	var found_vendor = -1;
	//spin through the vendor array.  The vendor name is
	for (x = 0; x < pwxdevicevendorglobalNamelist.length; x++) {
		//check if the vendor is found.The vendor name is always stored in position in the 0 position of the second array under the .vendor of the object
		if (vendor_name == pwxdevicevendorglobalNamelist[x][0].subCategory) {
			found_vendor = x;
		}
	}
	//return the vendor position or -1 if not found
	return found_vendor;
} //end pwxdevicefindVendor
function pwxdevicefillSubCategories(subCategory) {
	this.subCategory = subCategory;
	this.displayInd = 1;
	this.count = 0;
}
function pwxdevicesetVendorModel(display, connecteddatetime, disconnectedDateTime, model, vendor, deviceID, adptHost, adptIP) {
	this.vendor = vendor;
	this.model = model;
	this.display = display;
	this.connecteddatetime = connecteddatetime;
	this.disconnectedDateTime = disconnectedDateTime;
	this.deviceID = deviceID;
	this.adptHost = adptHost;
	this.adptIP = adptIP;
	this.displayInd = 1;
} //end pwxdevicesetVendorModel
function pwxdevicefillDisplay(display, deviceID) {
	for (i = 0; i < pwxdeviceglobaldeviceslist.length; i++) {
		if (pwxdeviceglobaldeviceslist[i].deviceID == deviceID) {
			pwxdeviceglobaldeviceslist[i].display = display;
		}
	}
} //end pwxdevicefillDisplay
function pwxdevicefindDeviceStatus(display) {
	var device_status = -1;
	for (i = 0; i < pwxdeviceglobaldeviceslist.length; i++) {
		if (pwxdeviceglobaldeviceslist[i].display == display) {
			device_status = pwxdeviceglobaldeviceslist[i].status;
		}
	}
	return device_status;
} //end pwxdevicefindDeviceStatus
/* display_acquired_data is used to display the most recent results to the screen. */
function pwxdevice_display_acquired_data() {
	var context_string = "";
	for (resCnt = 0; resCnt < pwxdeviceglobalbusResults.length; resCnt++) {
		context_string = pwxdeviceglobalbusResults[resCnt].context;
		if (pwxdevicecheckobject(context_string)) {
			pwxdevicesetDocument(context_string, pwxdeviceglobalbusResults[resCnt].value);
		} // end if
	} //end for
} //end pwxdevice_display_acquired_data
function pwxdevicefillBusResults(value, context) {
	this.value = value;
	this.context = context;
} //end pwxdevicefillBusResults
function pwxdevicesetDocument(context_string, value, Devicemodal) {
	document.getElementById(context_string).value = value
} //end pwxdevicesetDocument
/* Returns true if the object exists, else returns false */
function pwxdevicecheckobject(obj) {
	if (document.getElementById(obj)) {
		return true;
	} //end if
	else {
		return false;
	} //end else
} //end pwxdevicecheckobject
function pwxdevicemodalopen(id, x, y, displayName) {
	//once the modal is open, figure out what needs to display on the right this will be another restful service call
	var vendorname = "";
	var modalname = "";
	for (i = 0; i < pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST.length; i++) {
		if (pwxdevicevendorglobalNamelist[x][y].vendor == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
			vendorname = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY + ", ";
		}
		if (pwxdevicevendorglobalNamelist[x][y].model == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
			modalname = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY;
		}
	}
	PwxDeviceComponentRenderDeviceEntryParameters(pwxdevicevendorglobalNamelist[x][y].vendor, pwxdevicevendorglobalNamelist[x][y].model, pwxdevicevendorglobalNamelist[x][y].deviceID, pwxdevicevendorglobalNamelist[x][y].display, vendorname, modalname);
} //end pwxdevicemodalopen
/*Creates an object that will hold results, both what comes off the bus and what is available from the device */
function pwxdeviceresultsFill() {
	//fill out the members of the pwxdeviceStatus object
	this.indicator = 0;
	this.boxName = "";
	this.name = "";
	this.units = "";
	this.unitsDisp = "";
	this.unitsAlias = "";
	this.alias = "";
	this.context = "";
	this.group = "";
	this.index = 0;
	this.displayOrder = 0;
	this.subChild = 0;
	this.displayInd = 1;
	this.value = "";
	this.optionsDisplay = [];
	this.optionsId = [];
}
function pwxdeviceunitsFill() {
	this.units = "";
	this.alias = "";
	this.display = "";
}
/* SignData performs the rest service call to push the data into mill.Finds the person id and MRN and then places
the data from the device and any manual entry fields into a JSON object which is then pushed into MILL */
function pwxdeviceSignData() {
	//disable the sign button
	/** ask shaun about getting id of button from modal **/
	//the first thing we need to do is get the patient data
	var patInfo = new XMLCclRequest();
	var sex = "";
	var PID = "";
	var MRN = "";
	var USERNAME = "";
	var dob = "";
	var dob2 = "";
	//Call the ccl progam and send the parameter string
	patInfo.open('GET', "device_mpage_patientinfo");
	patInfo.send("^MINE^, value($PAT_Personid$), value($VIS_Encntrid$), value($USR_PersonId$)");
	patInfo.onreadystatechange = function () {
		var xmlDoc = pwxdeviceloadXMLString(patInfo.responseText);
		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("patientInfo");
		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "name") {
				name = pi_var2[1].text;
			} else if (pi_var2[0].text == "gender") {
				if (pi_var2[1].text == "Male") {
					sex = "m";
				} else if (pi_var2[1].text == "Female") {
					sex = "f";
				} else {
					sex = "o";
				}
			} else if (pi_var2[0].text == "PID") {
				PID = pi_var2[1].text;
			} else if (pi_var2[0].text == "MRN") {
				MRN = pi_var2[1].text;
			} else if (pi_var2[0].text == "USERNAME") {
				USERNAME = pi_var2[1].text;
			} else if (pi_var2[0].text == "date") {
				dob = pi_var2[1].text;
			}
		}
		//results send holds what will finally be sent to the BUS. This gets all the junk out without trying to send it across the bus
		var resultsSend = [];
		//spin through the global record structure
		for (x = 0; x < pwxdeviceresultsGlobal.length; x++) {
			//check to see if the object exists if the object exists that means we have a box to pull data from (combo box or text area box)
			if (pwxdevicecheckobject(pwxdeviceresultsGlobal[x].boxName)) {
				//this is a sub child of an existing context, so we process slightly differently
				if (pwxdeviceresultsGlobal[x].subChild == 1) {
					//so we spin through the options and when we find the option that is selected we need to flop the alias of the box selected
					for (y = 0; y < pwxdeviceresultsGlobal[x].optionsDisplay.length; y++) {
						if (pwxdeviceresultsGlobal[x].optionsDisplay[y] == document.getElementById(pwxdeviceresultsGlobal[x].boxName).value) {
							pwxdeviceresultsGlobal[x].alias = pwxdeviceresultsGlobal[x].optionsId[y]
								pwxdeviceresultsGlobal[x].value = document.getElementById(pwxdeviceresultsGlobal[x].context).value
						}
					} //end for y
					//else it isn't a sub child, just grab the value from the box
				} else {
					pwxdeviceresultsGlobal[x].value = document.getElementById(pwxdeviceresultsGlobal[x].boxName).value
				}
			}
		} //end for x
		for (x = 0; x < pwxdeviceresultsGlobal.length; x++) {
			//this for loop copies the junk out. If there is no value or no alias we don't push this to the bus.Copy the good results inot the the resultsSend record
			if (pwxdeviceresultsGlobal[x].value > "" && pwxdeviceresultsGlobal[x].alias > "") {
				resultsSend[resultsSend.length] = new pwxdeviceresultsFill();
				resultsSend[resultsSend.length - 1] = pwxdeviceresultsGlobal[x]
			}
		} //end for x
		var tempNum = 0;
		//check for any trailing zeros
		for (x = 0; x < resultsSend.length; x++) {
			tempNum = parseFloat(resultsSend[x].value);
			resultsSend[x].value = tempNum.toString();
		}
		//discretedata_var is the json we will load on the put
		var discretedata_var = '{'
			 + '"discreteData" : {'
			 + '"ackRequired" : false,'
			 + '"deviceId" : "' + pwxdeviceglobaldeviceIdPasslist + '",'
			 + '"displayName" : "Bogus Device",'
			 + '"entries" : ['
			//each trip through the for loop will be a result
			for (x = 0; x < resultsSend.length; x++) {
				discretedata_var += '{'
				 + '"acqDtTm" : "2010-11-08T15:15:05.067-06:00",'
				 + '"autoVerInd" : false,'
				 + '"ckiContext" : "' + resultsSend[x].alias + '",'
				 + '"clinSigDtTm" : "2010-11-08T15:15:05.067-06:00",'
				 + '"codContext" : "' + resultsSend[x].alias + '",'
				 + '"codContextNM" : "CODIFIED_CONTEXT_NOMENCLAUTRE_UNKNOWN",'
				 + '"codUnit" : "' + resultsSend[x].unitsAlias + '",'
				 + '"codUnitNm" : "CODIFIED_UNIT_NOMENCLAUTRE_UNKNOWN",'
				 + '"contentSeq" : 0,'
				 + '"context" : "' + resultsSend[x].alias + '",'
				 + '"groupSeq" : "",'
				 + '"units" : "' + resultsSend[x].unitsAlias + '",'
				 + '"value" : "' + resultsSend[x].value + '"'
				//if we aren't at the end put a comma else we don't need a comma to close the section
				if (x + 1 == resultsSend.length) {
					discretedata_var += '}'
				} else {
					discretedata_var += '},'
				}
			}
			//fill out the patient information hard coded here, will be coming out of ccl
			discretedata_var += '],'
			 + '"msgToken" : "",'
			 + '"org" : "' + pwxdeviceLOCATION + '",'
			 + '"patConId" : "",'
			 + '"patConUpdtDtTm" : "2010-11-08T15:15:05.067-06:00",'
			 + '"performPrsnlId" : "' + USERNAME + '"'
			 + '},'
			 + '"patient" : {'
			 + '"dob" : "' + dob + '",'
			 + '"gender" : "' + sex + '",'
			 + '"idents" : ['
			 + '{"identContext" : "MRN", "identId" : "' + MRN + '", "identInternalId" : "", "identIssuer" : "CERNER_MILLENNIUM"},'
			 + '{"identContext" : "PID", "identId" : "' + PID + '", "identInternalId" : "", "identIssuer" : "CERNER_MILLENNIUM"}'
			 + '],'
			 + '"name" : "' + name + '"'
			 + '}'
			 + '}'
			var urlInfo = new XMLCclRequest();
		//get the url for the REST call
		urlInfo.open('GET', "device_mpage_url");
		urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");
		urlInfo.onreadystatechange = function () {
			var URL = "";
			var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);
			// Get all of the parent patientInfo nodes from the xml
			var pi_var = xmlDoc.getElementsByTagName("data");
			for (var i = 0; i < pi_var.length; i++) {
				var pi_var2 = pi_var[i].childNodes;
				if (pi_var2[0].text == "URL_PATH") {
					URL = pi_var2[1].text;
				} else if (pi_var2[0].text == "USER") {
					pwxdeviceUSER = pi_var2[1].text;
				} else if (pi_var2[0].text == "PWORD") {
					pwxdevicePWORD = pi_var2[1].text
				}
			}
			if(URL.toLowerCase().indexOf("/ibus") > -1){
			var epprUrl = URL + "cas/api/chartdoc/discretedata"}
			else{
			var epprUrl = URL + "/iBus/cas/api/chartdoc/discretedata"
			}
				var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
			//this ajax call pushes the data over which mill processes and inserts the results
			$.ajax({
				type : 'PUT',
				async : true,
				url : epprUrl,
				dataType : 'json',
				contentType : 'application/json',
				data : discretedata_var,
				beforeSend : function (xhr) {
					//add the basic authorization to the ajax request object header
					xhr.setRequestHeader("Authorization", auth);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success : function (discretedata) {},
				complete : function (discretedata) {
					if (discretedata.status == "201") {
						//alert("Data Successfully Signed");
						MP_ModalDialog.closeModalDialog("DevicemodalObject");
					}
				},
				error : function (discretedata) {
					if (discretedata.status != "201")
						alert(discretedata.status);
				}
			}); // .ajax
		}
	}
}
function pwxdevicefillGroups() {
	this.name = "";
	this.displayOrder = 0;
}
function pwxdevicecheckIt(evt) {
	evt = (evt) ? evt : window.event
	var charCode = (evt.which) ? evt.which : evt.keyCode
	if (charCode != 46) {
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			status = "This field accepts numbers only."
				return false;
		}
	}
	status = ""
		return true
		$('#Password').bind('cut copy paste', function (event) {
			event.preventDefault();
		});
}
function pwxdevicedifferenceToString(milliseconds) {
	var seconds = milliseconds / 1000;
	var numyears = Math.floor(seconds / 31536000);
	var numdays = Math.floor((seconds % 31536000) / 86400);
	var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
	var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	// var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
	if (numdays == 0) {
		return +numhours + " hr, " + numminutes + " min ";
	}
	if (numdays > 0) {
		return "> 24 hours";
	}
}
function pwx_device_copy_obj_devicename(o) {
	var pwx_device_copy_main_obj = new Object();
	for (var e in o) {
		pwx_device_copy_main_obj[e] = o[e];
	}
	return pwx_device_copy_main_obj;
}
// Encode the user id and password for the ibus
var PwxBase64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3,
		enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;
		input = PwxBase64._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}
		return output;
	},
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3;
		var enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;
		input = input.replace(/[A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}
		output = PwxBase64._utf8_decode(output);
		return output;
	},
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

MPage.namespace("cerner");

/*Script Stats example*/
cerner.hcmHealthPlans = cerner.hcmHealthPlans || function(){
  this.name = "cerner.hcmHealthPlans";
  this.cclProgram = "";
  this.cclParams = [];
  this.cclDataType = "JSON";
  this.componentNamespace = "hcmHealthPlans";
  this.mfaBanner = null;
  this.isHealthPlanActionSuccess = false;
  this.isHITableExpanded = false;
};
cerner.hcmHealthPlans.prototype = new MPage.Component();
cerner.hcmHealthPlans.prototype.constructor = MPage.Component;
cerner.hcmHealthPlans.prototype.base = MPage.Component.prototype;

/*
 There is no i18n for custom components. This is done so that the
 component could be easily migrated to standard component and if needed
 the clients can translate this object.
*/
cerner.hcmHealthPlans.i18n = {
  ADD_HEALTH_PLAN: "Add Health Plan",
  ADD_PLAN_ERROR_PRIMARY: "Error adding health plan.",
  BEGIN_DATE: "Begin Date",
  CLOSE: "Close",
  CONFIGURATION_ISSUE: "Configuration Issue",
  CONFIGURATION_ISSUE_MESSAGE: "There is an issue with the configuration of this health plan. Contact your system administrator.",
  CONFLICT: "Conflict",
  CONFLICT_BEGIN_DATE: "Review begin date",
  CONFLICT_END_DATE: "Review end date",
  CONFLICT_HOVER: "Updated health plan information is available.",
  CONFLICT_MEMBER_ID: "Review member ID",
  CONFLICT_MESSAGE: "Updated health plan information available",
  CONTACT_ADMIN: "Contact your system administrator for more information.",
  CONVERSATION_ERROR: "Error launching conversation.",
  EDIT_HEALTH_PLANS: "Edit Health Plans",
  END_DATE: "End Date",
  ERROR_OCCURRED: "Error Occurred",
  EXTERNAL_HEALTH_PLANS_AVAILABLE: "Unverified outside health plans are available for this component.",
  EXTERNAL_HEALTH_PLANS_ERROR: "Error in retrieving unverified health plans.",
  EXTERNAL_HEALTH_PLANS_LABEL: "Outside health plans (unverified)",
  HEALTH_PLAN: "Health Plan",
  HEALTH_PLAN_UPDATE_VERSION_FAILURE: "The health plan update may not have occurred as expected due to a simultaneous update made by another user. Refresh the component to view the updated health plan information.",
  IDENTICAL_MATCH: "Identically Matched",
  LINE_OF_BUSINESS: "Line of Business",
  LOCAL_HEALTH_PLAN: "Documented Health Plan",
  MEMBER_ID: "Member ID",
  MFA_RESTRICTION: "Information about health plans is not displayed.",
  MODIFY_PLAN_ERROR_PRIMARY: "Error updating health plan.",
  NEW: "New",
  NEW_HOVER: "A new health plan is available.",
  NO_DATA: "--",
  OUTSIDE_HEALTH_PLAN: "Outside Health Plan",
  PAYER: "Payer",
  STATUS: "Status",
  UNABLE_TO_COMPLETE_REQUEST: "Unable to Complete Request",
  UPDATE_HEALTH_PLAN: "Update Health Plan",
  UPDATE_PLAN_SECONDARY: "Try refreshing the component. If the problem persists, contact your system administrator.",
  VIEW_OUTSIDE_HEALTH_PLANS: "View Outside Health Plans"
};

/*
 * Bedrock options object that will be used to retrieve view settings.
*/
var hcmHealthPlanSettings = {
  demographicsUrl: "",
  taskNumber: 0.0
}

cerner.hcmHealthPlans.prototype.init = function() {
  var component = this;
  var optionsUrl = component.getOption("demographicsUrl");
  var demographicsUrl = optionsUrl !== "undefined" ? optionsUrl : "";
  var mfaAuthData = cerner.hcmHealthPlans.mfaAuthentication(component.getProperty("userId"));

  if (mfaAuthData.isAuthenticated) {
    component.cclProgram = "HCM_GET_HEALTH_PLANS";
    component.cclParams = ["MINE", component.getProperty("personId") + ".0", demographicsUrl];
  } else {
    component.createMfaBanner(mfaAuthData);
  }
};

cerner.hcmHealthPlans.prototype.render = function() {
  var component = this;
  var target = component.getTarget();
  var data = component.data;
  var externalDataStatus = data.RECORD_DATA.STATUS_DATA.SUBEVENTSTATUS[0].TARGETOBJECTNAME;
  var componentId = component.getProperty("compId");
  var compNamespace = component.componentNamespace;
  var currentHealthPlansId = "currentHealthPlans" + componentId;
  var sourceHealthPlansId = "sourceHealthPlans" + componentId;
  var currentHealthPlans = [];
  var sourceHealthPlans = [];

  if (data && data.RECORD_DATA && data.RECORD_DATA.CURRENT_HEALTH_PLANS && data.RECORD_DATA.SOURCE_HEALTH_PLANS) {
    currentHealthPlans = healthPlans(data.RECORD_DATA.CURRENT_HEALTH_PLANS);
    sourceHealthPlans = healthPlans(data.RECORD_DATA.SOURCE_HEALTH_PLANS, data.RECORD_DATA.CURRENT_HEALTH_PLANS);
  }

  if (component.mfaBanner) {
    target.innerHTML = component.mfaBanner.render();
  } else if (externalDataStatus === "ERR_GET_HI_HEALTHPLANS") {
      target.innerHTML =
          cerner.hcmHealthPlans.healtheIntentHealthPlanBanner.initializeExternalDataErrorBanner(componentId, compNamespace) + 
          "<div id='" + compNamespace + "MillTable" + componentId + "' class='" + compNamespace + "-mill-table'>" +
            cerner.hcmHealthPlans.millenniumHealthPlanTable(currentHealthPlans, compNamespace, currentHealthPlansId) +
          "</div>";
  } else if (sourceHealthPlans.length){
      target.innerHTML =
        cerner.hcmHealthPlans.healtheIntentHealthPlanBanner.initializeExternalDataBanner(componentId, compNamespace) + 
        "<div id='" + compNamespace + "HiTable" + componentId + "' class='" + compNamespace + "-hi-table'>" +
          cerner.hcmHealthPlans.healtheIntentHealthPlanTable.create(sourceHealthPlans, compNamespace, sourceHealthPlansId) +
        "</div>" +
        "<div id='" + compNamespace + "SidePanel" + componentId + "' class='" + compNamespace + "-side-panel'></div>";

      if (data.RECORD_DATA.MANAGE_HP_PRIVILEGE_IND) {
        target.innerHTML +=
          "<div class='" + compNamespace + "-edit-health-plan'>" +
            "<a id='" + compNamespace + "EditHealthPlanConvo" + componentId + "'>" + cerner.hcmHealthPlans.i18n.EDIT_HEALTH_PLANS + "</a>" +
          "</div>";
      }
        
      target.innerHTML +=
        "<div id='" + compNamespace + "MillTable" + componentId + "' class='" + compNamespace + "-mill-table'>" +
          cerner.hcmHealthPlans.millenniumHealthPlanTable(currentHealthPlans, compNamespace, currentHealthPlansId) +
        "</div>";

      $("#" + compNamespace + "HiTable" + componentId).hide();

      $("#" + compNamespace + "EditHealthPlanConvo" + componentId).on("click", function(e) {
        component.modifyLocalHealthPlans();
        e.stopImmediatePropagation();
      });

      cerner.hcmHealthPlans.healtheIntentHealthPlanBanner.finalize(component);
      cerner.hcmHealthPlans.healtheIntentHealthPlanTable.addCellClickExtension(sourceHealthPlansId, componentId);
      cerner.hcmHealthPlans.healtheIntentSidePanel.initialize(componentId, component, data.RECORD_DATA.MANAGE_HP_PRIVILEGE_IND);
      cerner.hcmHealthPlans.healtheIntentHealthPlanTable.finalize();

      if (component.isHealthPlanActionSuccess && component.isHITableExpanded) {
        cerner.hcmHealthPlans.healtheIntentHealthPlanBanner.showExternalData();
        component.isHealthPlanActionSuccess = false;
      }
  } else {
      target.innerHTML = 
        "<div id='" + compNamespace + "MillTable" + componentId + "' class='" + compNamespace + "-mill-table'>" +
          cerner.hcmHealthPlans.millenniumHealthPlanTable(currentHealthPlans, compNamespace, currentHealthPlansId) +
        "</div>";
  }


  /*
   * Returns a decorated health plans object.
   * @param {Object} healthPlans - Health plans object.
   * @param {Object} millHealthPlans - millennium Health plans object.
   * @returns {Object} formatted health plans object
   */
  function healthPlans(healthPlans, millHealthPlans) {
    var formattedHealthPlans = $.map(healthPlans, function(healthPlan) {
      return cerner.hcmHealthPlans.healthPlan(healthPlan, millHealthPlans);
    });

    formattedHealthPlans.sort(function(a, b) {
      return b.SORT_DATE - a.SORT_DATE;
    });

    return formattedHealthPlans;
  }
};

/* 
 * Returns the alert banner object
 * @param {object} mfaAuthData - the mfa authentication object containing the message, and messageType for the banner
 * @return {null} 
 */
cerner.hcmHealthPlans.prototype.createMfaBanner = function(mfaAuthData) {
  var component = this;

  component.mfaBanner = new MPageUI.AlertBanner();
  component.mfaBanner.setType(mfaAuthData.messageType);
  component.mfaBanner.setPrimaryText(mfaAuthData.message).setSecondaryText(cerner.hcmHealthPlans.i18n.MFA_RESTRICTION);
};

cerner.hcmHealthPlans.prototype.scriptRequest = function(settings) {
  var component = this;
  var settings = settings || {};
  var scriptRequest = new ScriptRequest();

  scriptRequest.setProgramName(settings.name);
  settings.params && scriptRequest.setParameterArray(["^MINE^"].concat(settings.params));

  if (settings.success) {
    scriptRequest.setResponseHandler(function(reply) {
      settings.success(reply.getResponse());
    });
  }

  scriptRequest.performRequest();
};

cerner.hcmHealthPlans.prototype.modifyLocalHealthPlans = function() {
  var component = this;
  var pmConversation = cerner.hcmHealthPlans.pmConversation;
  var i18n = cerner.hcmHealthPlans.i18n;
  var pmConvo = pmConversation.runConversation(pmConversation.actionNumbers.MODIFY_PERSON, component.getOption("taskNumber"), component.getProperty("personId"));

  if (pmConvo.success) {
    component.isHealthPlanActionSuccess = true;
    component.refresh();
  } else if (pmConvo.failure) {
    cerner.hcmHealthPlans.modal.create("error", component.getProperty("compId"), i18n.ERROR_OCCURRED, i18n.CONVERSATION_ERROR, i18n.CONTACT_ADMIN);
  }
};

cerner.hcmHealthPlans.healthPlan = (function() {

  function formattedDate(isoDateTime) {
    var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    var formattedDateReturnValue = cerner.hcmHealthPlans.i18n.NO_DATA;
    var dateFormat = mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR;

    if (isoDateTime) {
      formattedDateReturnValue = dateFormatter.formatISO8601(isoDateTime, dateFormat);
    }

    return formattedDateReturnValue;
  }

  function formattedDisplay(value) {
    return $.trim(value) || cerner.hcmHealthPlans.i18n.NO_DATA;
  }

  function reconcileHealthPlans(currentHealthPlan, millHealthPlans) {
    var currentMillPlanId = currentHealthPlan.MILL_HEALTH_PLAN_ID;
    var currentBeginDate = currentHealthPlan.FORMATTED_BEGIN_DATE;
    var currentEndDate = currentHealthPlan.FORMATTED_END_DATE;
    var currentMemberNumber = currentHealthPlan.MEMBER_NBR;
    var millHealthPlan;
    var status;

    if (currentMillPlanId <= 0) {
      return { status: cerner.hcmHealthPlans.i18n.CONFIGURATION_ISSUE };
    }

    status = cerner.hcmHealthPlans.i18n.NEW;

    for (var i = millHealthPlans.length - 1; i >= 0; i--) {
      millHealthPlan = $.extend(true, {}, millHealthPlans[i]);
      millHealthPlan.FORMATTED_BEGIN_DATE = formattedDate(millHealthPlans[i].BEGIN_ISO_DT_TM);
      millHealthPlan.FORMATTED_END_DATE = formattedDate(millHealthPlans[i].END_ISO_DT_TM);

      if (currentMillPlanId === millHealthPlan.MILL_HEALTH_PLAN_ID) {
        if (currentBeginDate === millHealthPlan.FORMATTED_BEGIN_DATE &&
          currentEndDate === millHealthPlan.FORMATTED_END_DATE &&
          currentMemberNumber === millHealthPlan.MEMBER_NBR) {

          status = cerner.hcmHealthPlans.i18n.IDENTICAL_MATCH;
        } else {
          if (currentBeginDate !== millHealthPlan.FORMATTED_BEGIN_DATE) {
            millHealthPlan.CONFLICTED_BEGIN_DATE = true;
          }
          if (currentEndDate !== millHealthPlan.FORMATTED_END_DATE) {
            millHealthPlan.CONFLICTED_END_DATE = true;
          }
          if (currentMemberNumber !== millHealthPlan.MEMBER_NBR) {
            millHealthPlan.CONFLICTED_MEMBER_NBR = true;
          }

          status = cerner.hcmHealthPlans.i18n.CONFLICT;
        }
        return { status: status, millHealthPlan: millHealthPlan };
      }
    }

    return { status: status };
  }

   //private api exposed for testing
  cerner.hcmHealthPlans.__currentHealthPlan = {
    formattedDate: formattedDate,
    reconcileHealthPlans: reconcileHealthPlans
  };

  /**
   * Returns decorated healthPlan object.dS
   * @param  {object} healthPlan
   * @param  {object} millHealthPlans
   * @return {object} decorated healthPlan object.
   */
  return function(rawCurrentHealthPlan, millHealthPlans) {
    var currentHealthPlan = $.extend(true, {}, rawCurrentHealthPlan);
    var reconciledHealthPlan;

    currentHealthPlan.SORT_DATE = currentHealthPlan.BEGIN_ISO_DT_TM ? new Date(currentHealthPlan.BEGIN_ISO_DT_TM) : null;
    currentHealthPlan.FORMATTED_BEGIN_DATE = formattedDate(currentHealthPlan.BEGIN_ISO_DT_TM);
    currentHealthPlan.FORMATTED_END_DATE = formattedDate(currentHealthPlan.END_ISO_DT_TM);
    currentHealthPlan.PAYER_NAME = formattedDisplay(currentHealthPlan.PAYER_NAME);
    currentHealthPlan.MEMBER_NBR = formattedDisplay(currentHealthPlan.MEMBER_NBR);
    currentHealthPlan.PLAN_TYPE = formattedDisplay(currentHealthPlan.PLAN_TYPE);
    currentHealthPlan.LINE_OF_BUSINESS = formattedDisplay(currentHealthPlan.LINE_OF_BUSINESS);

    if (millHealthPlans) {
      reconciledHealthPlan = reconcileHealthPlans(currentHealthPlan, millHealthPlans);
      currentHealthPlan.STATUS = reconciledHealthPlan.status;
      currentHealthPlan.millHealthPlan = reconciledHealthPlan.millHealthPlan;
    }

    return currentHealthPlan;
  };
})();

cerner.hcmHealthPlans.healtheIntentHealthPlanBanner = (function() {
  var componentI18n = cerner.hcmHealthPlans.i18n;
  var compNamespace;
  var compId;

  function initializeExternalDataBanner(componentId, componentNamespace) {
    compNamespace = componentNamespace;
    compId = componentId;
    var externalDataImgSpan = getExternalDataImageHtml();
    var externalDataTitleSpan = "<span class='" + compNamespace + "-hi-title'>" + componentI18n.EXTERNAL_HEALTH_PLANS_AVAILABLE + "</span>";
    var externalDataBtnSpan = "<button class='" + compNamespace + "-hi-ext-btn' id='" + compNamespace + "ExtButton" + compId + "'>" +
                                componentI18n.VIEW_OUTSIDE_HEALTH_PLANS +
                              "</button>";
    var showExternalDataContainer = "<div id='" + compNamespace + "HiBanner" + compId + "' class='" + compNamespace + "-initial-banner " + compNamespace + "-table-banner'>" +
                                      externalDataImgSpan + externalDataTitleSpan + externalDataBtnSpan +
                                    "</div>";

    return showExternalDataContainer;
  };

  function initializeExternalDataErrorBanner(componentId, componentNamespace) {
    compNamespace = componentNamespace;
    compId = componentId;
    var externalDataImgSpan = getExternalDataImageHtml();
    var externalDataTitleSpan = "<span class='" + compNamespace + "-hi-title'>" + componentI18n.EXTERNAL_HEALTH_PLANS_ERROR + "</span>";
    var showExternalDataContainer = "<div id='" + compNamespace + "HiErrorBanner" + compId + "' class='" + compNamespace + "-initial-banner " + compNamespace + "-table-banner'>" +
                                      externalDataImgSpan + externalDataTitleSpan +
                                    "</div>";

    return showExternalDataContainer;
  };

  function externalDataTableBanner() {
    var externalDataImgSpan = getExternalDataImageHtml();
    var externalDataTitleSpan = "<span class='" + compNamespace + "-hi-title'>" + componentI18n.EXTERNAL_HEALTH_PLANS_LABEL + "</span>";

    return externalDataImgSpan + externalDataTitleSpan;
  };

  function getExternalDataImageHtml() {
    var externalDataImgUrl = CERN_static_content + "/images/6965.png";
    var externalDataImgSpan = "<img class='" + compNamespace + "-external-data-image' src='" + externalDataImgUrl + "'>";

    return externalDataImgSpan;
  };

  function showExternalData() {
    var $hiDataButton = $("#" + compNamespace + "ExtButton" + compId);
    if ($hiDataButton.length) {
      $hiDataButton.click();
    }
  };

  function finalize(component) {
    var $hiDataButton = $("#" + compNamespace + "ExtButton" + compId);
    $hiDataButton.click(function() {
      $("#" + compNamespace + "HiTable" + compId).show();
      $("#" + compNamespace + "HiBanner" + compId).removeClass(compNamespace + "-initial-banner").html(externalDataTableBanner());
      component.isHITableExpanded = true;
    });
  };

  //private api exposed for testing
  cerner.hcmHealthPlans.__healtheIntentHealthPlanBanner = {
  };

  return {
    initializeExternalDataBanner: initializeExternalDataBanner,
    initializeExternalDataErrorBanner: initializeExternalDataErrorBanner,
    showExternalData: showExternalData,
    finalize: finalize
  }
})();

cerner.hcmHealthPlans.healtheIntentHealthPlanTable = (function() {

  var healtheIntentTable = {};
  var componentI18n = cerner.hcmHealthPlans.i18n;
  var compNamespace = "";

  /**
   * Create TableColumn object 
   * @param  {string} columnId
   * @param  {string} columnClass
   * @param  {string} display
   * @param  {string} template
   * @return {TableColumn} TableColumn created
   */
  function column(columnId, columnClass, display, template) {
    var column = new TableColumn();

    column.setColumnId(columnId);
    column.setCustomClass(columnClass);
    column.setColumnDisplay(display);
    column.setRenderTemplate(template);

    return column;
  };

  function finalize() {
    healtheIntentTable.finalize();
  };

  /**
   * Return table html string
   * @param  {object} sourceHealthPlans
   * @param  {string} componentNamespace
   * @param  {string} componentId
   * @return {string} html string
   */
  function create(sourceHealthPlans, componentNamespace, componentId) {
    compNamespace = componentNamespace;
    var table = new ComponentTable();
    var columnClass = compNamespace + '-hi-table-col';
    var planNameColumn = column('payername', compNamespace + "-payer-col", componentI18n.PAYER, '${FORMATTED_PAYER_NAME}');
    var hoverExtension = new TableCellHoverExtension();

    formatHealthPlanTableHtml(sourceHealthPlans);

    table.setNamespace(componentId);
    table.setZebraStripe(true);

    table.addColumn(planNameColumn);
    table.addColumn(column('planname', compNamespace + "-plan-col", componentI18n.HEALTH_PLAN, '${PLAN_NAME}'));
    table.addColumn(column('lineofbusiness', columnClass, componentI18n.LINE_OF_BUSINESS, '${LINE_OF_BUSINESS}'));
    table.addColumn(column('membernbr', columnClass, componentI18n.MEMBER_ID, '${MEMBER_NBR}'));
    table.addColumn(column('begindate', compNamespace + "-date-col", componentI18n.BEGIN_DATE, '${FORMATTED_BEGIN_DATE}'));
    table.addColumn(column('enddate', compNamespace + "-date-col", componentI18n.END_DATE, '${FORMATTED_END_DATE}'));

    hoverExtension.addHoverForColumn(planNameColumn, function(data){
      return data.RESULT_DATA.STATUS_TOOLTIP;
    });

    table.addExtension(hoverExtension);
    table.bindData(sourceHealthPlans);

    healtheIntentTable = table;

    return table.render();
  };

  function formatHealthPlanTableHtml(sourceHealthPlans) {
    for (var i = sourceHealthPlans.length - 1; i >= 0; i--) {
      switch (sourceHealthPlans[i].STATUS) {
        case componentI18n.NEW:
          sourceHealthPlans[i].FORMATTED_PAYER_NAME = 
            "<p class='" + compNamespace + "-new-icon " + compNamespace + "-payer-col-text'>" +
              sourceHealthPlans[i].PAYER_NAME +
            "</p>";
          sourceHealthPlans[i].STATUS_TOOLTIP = "<span class='" + compNamespace + "-hover'>" + componentI18n.NEW_HOVER + "</span>";
          break;
        case componentI18n.CONFLICT:
          sourceHealthPlans[i].FORMATTED_PAYER_NAME = 
            "<p class='" + compNamespace + "-conflict-icon " + compNamespace + "-payer-col-text'>" +
              sourceHealthPlans[i].PAYER_NAME +
            "</p>";
          sourceHealthPlans[i].STATUS_TOOLTIP = "<span class='" + compNamespace + "-hover'>" + componentI18n.CONFLICT_HOVER + "</span>";
          break;
        case componentI18n.CONFIGURATION_ISSUE:
          sourceHealthPlans[i].FORMATTED_PAYER_NAME = 
            "<p class='"+ compNamespace + "-new-icon " + compNamespace + "-payer-col-text'>" +
              sourceHealthPlans[i].PAYER_NAME +
            "</p>";
          sourceHealthPlans[i].STATUS_TOOLTIP = "<span class='" + compNamespace + "-hover'>" + componentI18n.NEW_HOVER + "</span>";
          break;
        default:
          sourceHealthPlans[i].FORMATTED_PAYER_NAME = "<p class='" + compNamespace + "-payer-col-text'>" + sourceHealthPlans[i].PAYER_NAME + "</p>";
      }
    }
  };

  function addCellClickExtension(sourceHealthPlansId, componentId) {
    var $selectedRow;
    var cellClickExtension = new TableCellClickCallbackExtension();

    cellClickExtension.setCellClickCallback(function(event, data) {
      $selectedRow = $(event.target).parents("#" + sourceHealthPlansId + "table dl.result-info");
      updateSelRowBgColor($selectedRow, sourceHealthPlansId);

      shrinkTable(componentId);
      cerner.hcmHealthPlans.healtheIntentSidePanel.display(data);
    });
    healtheIntentTable.addExtension(cellClickExtension);
  };

  function updateSelRowBgColor($selRowObj, sourceHealthPlansId) {
    var $prevRow = $("#" + sourceHealthPlansId + "table").find(".selected");

    // Remove the background color of previous selected row.
    if ($prevRow.length > 0) {
      $prevRow.removeClass("selected");
    }

    // Change the background color to indicate that its selected.
    if ($selRowObj) {
      $selRowObj.addClass("selected");
    }
  };

  function shrinkTable(componentId) {
    var compHiTableId = "#" + compNamespace + "HiTable" + componentId;

    $(compHiTableId).width("60%");
    $(compHiTableId + " ." + compNamespace + "-payer-col").addClass(compNamespace + "-shrunk-table-payer-col");
    $(compHiTableId + " ." + compNamespace + "-plan-col").addClass(compNamespace + "-shrunk-table-plan-col");
    $(compHiTableId + " ." + compNamespace + "-hi-table-col").addClass(compNamespace + "-shrunk-table-col");
    $(compHiTableId + " ." + compNamespace + "-date-col").hide();
  };

  function expandTable(componentId) {
    var compHiTableId = "#" + compNamespace + "HiTable" + componentId;

    $(compHiTableId).width("100%");
    $(compHiTableId + " ." + compNamespace + "-payer-col").removeClass(compNamespace + "-shrunk-table-payer-col");
    $(compHiTableId + " ." + compNamespace + "-plan-col").removeClass(compNamespace + "-shrunk-table-plan-col");
    $(compHiTableId + " ." + compNamespace + "-hi-table-col").removeClass(compNamespace + "-shrunk-table-col");
    $(compHiTableId + " ." + compNamespace + "-date-col").show();
  };

  //private api exposed for testing
  cerner.hcmHealthPlans.__healtheIntentHealthPlanTable = {
    formatHealthPlanTableHtml: formatHealthPlanTableHtml
  };

  return {
    create: create,
    finalize: finalize,
    addCellClickExtension: addCellClickExtension,
    expandTable: expandTable
  }
})();

cerner.hcmHealthPlans.healtheIntentSidePanel = (function() {

  var componentI18n = cerner.hcmHealthPlans.i18n;
  var selectedRowData = {};
  var sidePanel = {};
  var custCompId = "";
  var compId = "";
  var compNamespace = "";
  var failedToAddHealthPlanFlag = false;
  var hasPrivilege = false;
  var component;
  var isModifyAction;

  function initialize(componentId, componentObj, manageHpPrivilegeInd) {
    component = componentObj;
    custCompId = "custContent" + componentId;
    compId = componentId;
    compNamespace = component.componentNamespace;
    hasPrivilege = manageHpPrivilegeInd;

    var sidePanelId = compNamespace + "SidePanel" + compId;
    var actionButtonsHtml =
          "<input type='button' id='" + compId + "AddHealthPlanBtn' class='sp-button2' value='" + componentI18n.ADD_HEALTH_PLAN + "'>" +
          "<input type='button' id='" + compId + "ConfigIssueBtn' class='sp-button2' value='" + componentI18n.ADD_HEALTH_PLAN + "'>" +
          "<input type='button' id='" + compId + "UpdateHealthPlanBtn' class='sp-button2' value='" + componentI18n.UPDATE_HEALTH_PLAN + "'>";
    var scrollContainerHtml = "<div id='sidePanelScrollContainer" + compId + "'></div>";

    sidePanel = new CompSidePanel(compId, sidePanelId);
    sidePanel.setExpandOption(sidePanel.expandOption.EXPAND_DOWN);
    sidePanel.renderPreBuiltSidePanel();
    sidePanel.setContents(scrollContainerHtml, custCompId);

    if (hasPrivilege) {
      sidePanel.setActionsAsHTML(actionButtonsHtml);
      setClickHandlersForView();
    }

    sidePanel.isShowing = false;
    sidePanel.hidePanel();
  };

  function display(data) {
    selectedRowData = data.RESULT_DATA;
    sidePanel.setTitleText(selectedRowData.PLAN_NAME);
    sidePanel.showCornerCloseButton();

    sidePanel.setCornerCloseFunction(function () {
      closeSidePanel();
    });

    determineContents();

    if (sidePanel.isShowing) {
      sidePanel.resizePanel();
      sidePanel.expandSidePanel();
    } else {
      sidePanel.isShowing = true;
      sidePanel.showPanel();
      sidePanel.resizePanel();
      sidePanel.expandSidePanel();
    }

    removeErrorBanner();
  };

  function determineContents() {
    switch (selectedRowData.STATUS) {
      case componentI18n.NEW:
        setupNewHealthPlanContents();
        break;
      case componentI18n.CONFLICT:
        setupConflictContents();
        break;
      case componentI18n.CONFIGURATION_ISSUE:
        setupConfigIssueContents();
        break;
      default:
        setupMatchedContents();
    }
  };

  function setupNewHealthPlanContents() {
    var sidePanelContentHtml = getExternalHeathPlanHtml();

    if (hasPrivilege) {
      $("#" + compId + "AddHealthPlanBtn").show();
      $("#" + compId + "ConfigIssueBtn").hide();
      $("#" + compId + "UpdateHealthPlanBtn").hide();
    }
    $("#sidePanelScrollContainer" + compId).html(sidePanelContentHtml);
  };

  function setupConflictContents() {
    var conflictedBeginDate = selectedRowData.millHealthPlan.CONFLICTED_BEGIN_DATE ? "<li>" + componentI18n.CONFLICT_BEGIN_DATE + "</li>" : "";
    var conflictedEndDate = selectedRowData.millHealthPlan.CONFLICTED_END_DATE ? "<li>" + componentI18n.CONFLICT_END_DATE + "</li>" : "";
    var conflictedMemberID = selectedRowData.millHealthPlan.CONFLICTED_MEMBER_NBR ? "<li>" + componentI18n.CONFLICT_MEMBER_ID + "</li>" : "";

    var sidePanelContentHtml =
          "<div id='sidePanelConflict" + compId + "' class='warning-msg'>" +
            "<div class='" + compNamespace + "-conflict-banner " + compNamespace + "-conflict-icon'>" +
              componentI18n.CONFLICT_MESSAGE +
            "</div>" +
            "<div class='" + compNamespace + "-conflict-list'>" +
              "<ul>" + conflictedBeginDate + conflictedEndDate + conflictedMemberID + "</ul>" +
            "</div>" +
          "</div>" +
          getExternalHeathPlanHtml() +
          getLocalHealthPlanHtml();

    if (hasPrivilege) {
      $("#" + compId + "AddHealthPlanBtn").hide();
      $("#" + compId + "ConfigIssueBtn").hide();
      $("#" + compId + "UpdateHealthPlanBtn").show();
    }
    $("#sidePanelScrollContainer" + compId).html(sidePanelContentHtml);
  };

  function setupConfigIssueContents() {
    var sidePanelContentHtml = getExternalHeathPlanHtml();

    if (hasPrivilege) {
      $("#" + compId + "AddHealthPlanBtn").hide();
      $("#" + compId + "ConfigIssueBtn").show();
      $("#" + compId + "UpdateHealthPlanBtn").hide();
    }
    $("#sidePanelScrollContainer" + compId).html(sidePanelContentHtml);
  };

  function setupMatchedContents() {
    var sidePanelContentHtml = getExternalHeathPlanHtml() + getLocalHealthPlanHtml();

    $("#" + compId + "AddHealthPlanBtn").hide();
    $("#" + compId + "ConfigIssueBtn").hide();
    $("#" + compId + "UpdateHealthPlanBtn").hide();
    $("#sidePanelScrollContainer" + compId).html(sidePanelContentHtml);
  };

  function createErrorBanner(primaryText, secondaryText) {
    secondaryText = "&nbsp;" + secondaryText;

    var sidePanelError =
          "<div id='sidePanelError" + compId + "' class='error-msg alert-msg'>" +
            "<div class='" + compNamespace + "-error-banner'>" +
              primaryText +
              "<span class='alert-msg-secondary-text'>" +
                secondaryText +
              "</span>" +
            "</div>" +
          "</div>";

    if(!failedToAddHealthPlanFlag) {
      $("#sidePanelHeader" + compId).prepend(sidePanelError);
      failedToAddHealthPlanFlag = true;
    }
  };

  function removeErrorBanner() {
    var $sidePanelError = $("#sidePanelError" + compId);

    if ($sidePanelError.length) {
      failedToAddHealthPlanFlag = false;
      $sidePanelError.remove();
    }
  };

  function setClickHandlersForView() {
    var healthPlanData = {};
    $("#" + compId + "AddHealthPlanBtn").click(function() {
      healthPlanData = {
        member_nbr: selectedRowData.MEMBER_NBR || "",
        begin_iso_dt_tm: selectedRowData.BEGIN_ISO_DT_TM || "",
        end_iso_dt_tm: selectedRowData.END_ISO_DT_TM || "",
        health_plan_id: selectedRowData.MILL_HEALTH_PLAN_ID,
        action_flag: 1
      };
      MP_Util.LoadSpinner("sidePanel" + compId, 1);
      isModifyAction = false;
      ensHIHealthPlanToMillennium(healthPlanData);
    });

    $("#" + compId + "ConfigIssueBtn").click(function() {
      if(!failedToAddHealthPlanFlag){
        createErrorBanner(componentI18n.ADD_PLAN_ERROR_PRIMARY, componentI18n.CONFIGURATION_ISSUE_MESSAGE);
      }
    });

    $("#" + compId + "UpdateHealthPlanBtn").click(function() {
      healthPlanData = {
        member_nbr: selectedRowData.MEMBER_NBR || "",
        begin_iso_dt_tm: selectedRowData.BEGIN_ISO_DT_TM || "",
        end_iso_dt_tm: selectedRowData.END_ISO_DT_TM || "",
        person_plan_reltn_id: selectedRowData.millHealthPlan.PERSON_PLAN_RELTN_ID,
        action_flag: 2
      };
      MP_Util.LoadSpinner("sidePanel" + compId, 1);
      isModifyAction = true;
      ensHIHealthPlanToMillennium(healthPlanData);
    });
  };

  function getExternalHeathPlanHtml () {
    var externalHeathPlanHtml =
          "<div id='sidePanelOutsideRecord" + compId + "' class='" + compNamespace + "-outside-record " + compNamespace + "-health-plans-section'>" +
            "<span class='" + compNamespace + "-health-plan-section-title'>" + componentI18n.OUTSIDE_HEALTH_PLAN + "</span>" +
            "<div class='hp-payer'>" +
              "<span class='disabled'>" + componentI18n.PAYER + "</span>" +
              "<span>" + selectedRowData.PAYER_NAME + "</span>" +
            "</div>" +
            "<div class='line-of-business'>" +
              "<span class='disabled'>" + componentI18n.LINE_OF_BUSINESS + "</span>" +
              "<span>" + selectedRowData.LINE_OF_BUSINESS + "</span>" +
            "</div>" +
            "<div class='member-id'>" +
              "<span class='disabled'>" + componentI18n.MEMBER_ID + "</span>" +
              "<span>" + selectedRowData.MEMBER_NBR + "</span>" +
            "</div>" +
            "<div class='beginning-date'>" +
              "<span class='disabled'>" + componentI18n.BEGIN_DATE + "</span>" +
              "<span>" + selectedRowData.FORMATTED_BEGIN_DATE + "</span>" +
            "</div>" +
            "<div class='ending-date'>" +
              "<span class='disabled'>" + componentI18n.END_DATE + "</span>" +
              "<span>" + selectedRowData.FORMATTED_END_DATE + "</span>" +
            "</div>" +
          "</div>";

    return externalHeathPlanHtml;
  };

  function getLocalHealthPlanHtml () {
    var localHealthPlanHtml =
          "<div id='sidePanelLocalRecord" + compId + "' class='" + compNamespace + "-health-plans-section'>" +
            "<span class='" + compNamespace + "-health-plan-section-title'>" + componentI18n.LOCAL_HEALTH_PLAN + "</span>" +
            "<div class='hp-payer'>" +
              "<span class='disabled'>" + componentI18n.PAYER + "</span>" +
              "<span>" + selectedRowData.millHealthPlan.PAYER_NAME + "</span>" +
            "</div>" +
            "<div class='health-plan'>" +
              "<span class='disabled'>" + componentI18n.HEALTH_PLAN + "</span>" +
              "<span>" + selectedRowData.millHealthPlan.PLAN_NAME + "</span>" +
            "</div>" +
            "<div class='member-id'>" +
              "<span class='disabled'>" + componentI18n.MEMBER_ID + "</span>" +
              "<span>" + selectedRowData.millHealthPlan.MEMBER_NBR + "</span>" +
            "</div>" +
            "<div class='beginning-date'>" +
              "<span class='disabled'>" + componentI18n.BEGIN_DATE + "</span>" +
              "<span>" + selectedRowData.millHealthPlan.FORMATTED_BEGIN_DATE + "</span>" +
            "</div>" +
            "<div class='ending-date'>" +
              "<span class='disabled'>" + componentI18n.END_DATE + "</span>" +
              "<span>" + selectedRowData.millHealthPlan.FORMATTED_END_DATE + "</span>" +
            "</div>" +
          "</div>";

    return localHealthPlanHtml;
  };

  function ensHIHealthPlanToMillennium(healthPlanData) {
    var version = parseInt(component.data.RECORD_DATA.VERSION) || 0;
    var healthPlans = { source_health_plans: [healthPlanData] };

    component.scriptRequest({
      name: "HCM_CHG_HEALTH_PLAN_RELATIONS",
      params: [component.getProperty("personId"), version, "^" + JSON.stringify(healthPlans).replace(/"/g, "'") + "^"],
      success: function(response) { checkForFailedUpdate(response); }
    });
  };

  function checkForFailedUpdate(response) {
    var $container = $("#sidePanel" + compId);
    $container.find(".loading-screen").remove();

    var status = response.STATUS_DATA.SUBEVENTSTATUS[0].TARGETOBJECTNAME.toUpperCase().trim();

    if (response.STATUS_DATA.STATUS === "F") {
      if (status === "VERSION_ERROR"){
        closeSidePanel();
        cerner.hcmHealthPlans.modal.create("information" ,component.getProperty("compId"), componentI18n.UNABLE_TO_COMPLETE_REQUEST, componentI18n.HEALTH_PLAN_UPDATE_VERSION_FAILURE);
      } else if (isModifyAction) {
        createErrorBanner(componentI18n.MODIFY_PLAN_ERROR_PRIMARY, componentI18n.UPDATE_PLAN_SECONDARY);
      } else {
        createErrorBanner(componentI18n.ADD_PLAN_ERROR_PRIMARY, componentI18n.UPDATE_PLAN_SECONDARY);
      }
    } else {
      component.isHealthPlanActionSuccess = true;
      component.refresh();
    }
  };

  function closeSidePanel() {
    $("#sourceHealthPlans" + compId + "table").find(".selected").removeClass("selected");
    cerner.hcmHealthPlans.healtheIntentHealthPlanTable.expandTable(compId);

    sidePanel.hidePanel();
    sidePanel.isShowing = false;
  };

  //private api exposed for testing
  cerner.hcmHealthPlans.__healtheIntentSidePanel = {
    determineContents: determineContents,
    ensHIHealthPlanToMillennium: ensHIHealthPlanToMillennium,
    checkForFailedUpdate: checkForFailedUpdate,
    setClickHandlersForView: setClickHandlersForView
  };

  return {
    initialize: initialize,
    display: display
  }
})();

cerner.hcmHealthPlans.mfaAuthentication = (function() {
  /*
   * Submits the mfaAuth audit event
   * @param {number} status - status of the mfaAuth object
   * @param {number} providerId - the id of the logged in provider
   * @return {null}
   */
  function auditMfaAuth(status, providerId) {
    var mpEventAudit = new MP_EventAudit();
    var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    var dateTime = dateFormatter.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

    mpEventAudit.setAuditMode(0);
    mpEventAudit.setAuditEventName('HCM_HEALTH_PLAN_WORKFLOW_MFA_ATTEMPT');
    mpEventAudit.setAuditEventType('SECURITY');
    mpEventAudit.setAuditParticipantType('PERSON');
    mpEventAudit.setAuditParticipantRoleCd('PROVIDER');
    mpEventAudit.setAuditParticipantIDType('PROVIDER_NUMBER');
    mpEventAudit.setAuditParticipantID(providerId);
    mpEventAudit.setAuditParticipantName('STATUS=' + status + ';DATE=' + dateTime);
    mpEventAudit.addAuditEvent();
    mpEventAudit.submit();  
  }

  /*
   * Gets the mfa authStatusData object if the recource is available
   * @param {number} providerId - used for the auditMfaAuth
   * @return {object} mfaAuthData - object created containing the authentication information.
   */
  function authenticateExternalDataAccess(providerId) {
    var authStatus = new Mfa_Auth().RetrieveMfaAuthStatus();
    var authStatusData;
    var MFA_STATUSES = cerner.hcmHealthPlans.mfaAuthentication.MFA_STATUSES;
    var status = MFA_STATUSES.ERROR;
    var mfaAuthData = {
      isAuthenticated: true
    };

    if (authStatus.isResourceAvailable()) {
      authStatusData = authStatus.getResourceData();
      if (authStatusData) {
        status = authStatusData.status;
        mfaAuthData.message = authStatusData.message;
        if (status !== MFA_STATUSES.AUTHENTICATED && status !== MFA_STATUSES.AUTHENTICATION_NOT_REQUIRED) {
          mfaAuthData.isAuthenticated = false;
        }
      }
    } else {
      mfaAuthData.isAuthenticated = false;
      mfaAuthData.message = i18n.discernabu.mfa_auth.MFA_ERROR_MSG;
    }

    if (!mfaAuthData.isAuthenticated) {
      if (status === MFA_STATUSES.AUTHENTICATION_FAILED || status === MFA_STATUSES.AUTHENTICATION_CANCELLED) {
        mfaAuthData.messageType = MPageUI.ALERT_OPTIONS.TYPE.INFO;
      } else {
        mfaAuthData.messageType = MPageUI.ALERT_OPTIONS.TYPE.ERROR;
      }
    }

    auditMfaAuth(status, providerId);
    return mfaAuthData;
  }

  //private api exposed for testing
  cerner.hcmHealthPlans.__mfaAuth = {
    auditMfaAuth: auditMfaAuth,
    authenticateExternalDataAccess: authenticateExternalDataAccess
  };
  
  return function(providerId) {
    return authenticateExternalDataAccess(providerId);
  };
})();

cerner.hcmHealthPlans.mfaAuthentication.MFA_STATUSES = {
  AUTHENTICATED: 0,
  INVALID_CONFIG: 1,
  AUTHENTICATION_FAILED: 2,
  AUTHENTICATION_CANCELLED: 3,
  ERROR: 4,
  AUTHENTICATION_NOT_REQUIRED: 5
};

cerner.hcmHealthPlans.millenniumHealthPlanTable = (function() {

  /**
   * Create TableColumn object 
   * @param  {string} columnId
   * @param  {string} columnClass
   * @param  {string} display
   * @param  {string} template
   * @return {TableColumn} TableColumn created
   */
  function column(columnId, columnClass, display, template) {
    var column = new TableColumn();

    column.setColumnId(columnId);
    column.setCustomClass(columnClass);
    column.setColumnDisplay(display);
    column.setRenderTemplate(template);

    return column;
  }

  /**
   * Return table html string
   * @param  {object} healthPlan
   * @param  {string} componentNamespace
   * @param  {string} componentId
   * @return {string} html string
   */
  return function(currentHealthPlans, componentNamespace, componentId) {
    var table = new ComponentTable();
    var componentI18n = cerner.hcmHealthPlans.i18n;

    table.setNamespace(componentId);
    table.setZebraStripe(true);

    table.addColumn(column("payername", componentNamespace + "-mill-payer-col", componentI18n.PAYER, "${PAYER_NAME}"));
    table.addColumn(column("planname", componentNamespace + "-mill-plan-col", componentI18n.HEALTH_PLAN, "${PLAN_NAME}"));
    table.addColumn(column("membernbr", componentNamespace + "-mill-col", componentI18n.MEMBER_ID, "${MEMBER_NBR}"));
    table.addColumn(column("begindate", componentNamespace + "-mill-date-col", componentI18n.BEGIN_DATE, "${FORMATTED_BEGIN_DATE}"));
    table.addColumn(column("enddate", componentNamespace + "-mill-date-col", componentI18n.END_DATE, "${FORMATTED_END_DATE}"));

    table.bindData(currentHealthPlans);

    return table.render();
  };
})();

cerner.hcmHealthPlans.modal = (function() {

  function create(modalType, componentId, modalTitle, primaryText, secondaryText) {
    var modalId = componentId + "ModalDialog";

    var closeFunction = function() {
        MP_ModalDialog.closeModalDialog(modalId);
        MP_ModalDialog.deleteModalDialogObject(modalId);
    };

    var modalFooterButton = new ModalButton(componentId + "ModalButton")
          .setText(cerner.hcmHealthPlans.i18n.CLOSE)
          .setCloseOnClick(true)
          .setOnClickFunction(closeFunction);

    var modal = MP_Util.generateModalDialogBody(modalId, modalType, primaryText, secondaryText)
          .addFooterButton(modalFooterButton)
          .setHeaderCloseFunction(closeFunction)
          .setHeaderTitle(modalTitle);

    MP_ModalDialog.updateModalDialogObject(modal);
    MP_ModalDialog.showModalDialog(modalId);
  };

  return {
    create: create
  }
})();

cerner.hcmHealthPlans.pmConversation = (function() {


  function runConversation(action, taskNumber, patientId) {
    var component = this;
    var response = {
      failure: true
    };

    // PMAction API: https://wiki.ucern.com/pages/viewpageattachments.action?pageId=26116576
    function conversation(action, taskNumber, patientId) {
      var conversation;
      if (window.external.DiscernObjectFactory) {
        //PMCONVOVB is the DISPLAY_KEY for the VB based PMAction.dll and PMCONVO is the DISPLAY_KEY for the C# based PMAction.dll.
        conversation = window.external.DiscernObjectFactory("PMCONVO") || window.external.DiscernObjectFactory("PMCONVOVB" );
      }

      if (conversation) {
        conversation.action = action;
        conversation.Task = taskNumber; // Task number determines the conversation to launch
        conversation.Person_ID = patientId;
        conversation.ConversationHidden = 0;
        conversation.Run();
      }

      return conversation;
    };

    //Action 101- Modify Person
    var conversation = conversation(action, taskNumber, patientId);

    if (conversation) {
      if (conversation.CancelStatus) {
        response = {
          cancel: true
        };
      } else if (conversation.ConversationStatus === 0) {
        response = {
          success: true
        };
      }
    }

    return response;
  };
  //private api exposed for testing
  cerner.hcmHealthPlans.__pmConversation = {
  };

  return {
    runConversation: runConversation
  }
})();

cerner.hcmHealthPlans.pmConversation.actionNumbers = {
  MODIFY_PERSON: 101
};



/******************************************************************************************
 File: custom-components.js
 Use: Illumicare Smart Ribbon

 Objects:
 01) initial setup
 Control Log:

 Date    	Person		           	Comment
 ----------	------------------- 	---------------------------------------------
 08/30/2016 	TWEIS				Initial release
 09/12/2017     RWHITE              C30 Deploy Initial
 09/15/2017     RWHITE              C30 Deploy Final
 ******************************************************************************************/

if (typeof(illumicare) == "undefined") illumicare = {};
if (typeof(illumicare.config) == "undefined") illumicare.config = {};

//illumicarePopupLeft
illumicare.PopupLeft = function(){};
illumicare.PopupLeft.prototype = new MPage.Component();
illumicare.PopupLeft.prototype.constructor = MPage.Component;
illumicare.PopupLeft.prototype.base = MPage.Component.prototype;
illumicare.PopupLeft.prototype.componentMinimumSpecVersion = 1.0;
illumicare.PopupLeft.prototype.init = function(){
    //define data request

};
illumicare.PopupLeft.prototype.render = function(){
    var self = this;

    //determine code path
    var strCodeFile = "I:\\winintel\\static_content\\custom_mpage_content\\custom-components\\js\\illumicare\\illumicare.ribbon.js";


    //load js files
    self.getTarget().innerHTML = '<span title="'+strCodeFile+'">' + illumicare.config.loadingText + '...</span>';
    illumicare.resourceLoader.js([strCodeFile], function(){
        try {
            self.getTarget().innerHTML = '<span title="'+strCodeFile+'">' + illumicare.config.loadingText + '...</span>';
            $().illumicarePopupLeft(self, 1);
        } catch(err){
            var strError = err.description;
            self.getTarget().innerHTML = '<span title="'+strCodeFile+'\n\n'+strError+'">Error calling $().baycareCustomComponent(self)...</span>';
        }
    });
};

//illumicarePopupMiddle
illumicare.PopupMiddle = function(){};
illumicare.PopupMiddle.prototype = new MPage.Component();
illumicare.PopupMiddle.prototype.constructor = MPage.Component;
illumicare.PopupMiddle.prototype.base = MPage.Component.prototype;
illumicare.PopupMiddle.prototype.componentMinimumSpecVersion = 1.0;
illumicare.PopupMiddle.prototype.init = function(){
    //define data request

};
illumicare.PopupMiddle.prototype.render = function(){
    var self = this;

    //determine code path
    var strCodeFile = "I:\\winintel\\static_content\\custom_mpage_content\\custom-components\\js\\illumicare\\illumicare.ribbon.js";


    //load js files
    self.getTarget().innerHTML = '<span title="'+strCodeFile+'">' + illumicare.config.loadingText + '...</span>';
    illumicare.resourceLoader.js([strCodeFile], function(){
        try {
            self.getTarget().innerHTML = '<span title="'+strCodeFile+'">' + illumicare.config.loadingText + '...</span>';
            $().illumicarePopupMiddle(self, 1);
        } catch(err){
            var strError = err.description;
            self.getTarget().innerHTML = '<span title="'+strCodeFile+'\n\n'+strError+'">Error calling $().baycareCustomComponent(self)...</span>';
        }
    });
};

//illumicarePopupRight
illumicare.PopupRight = function(){};
illumicare.PopupRight.prototype = new MPage.Component();
illumicare.PopupRight.prototype.constructor = MPage.Component;
illumicare.PopupRight.prototype.base = MPage.Component.prototype;
illumicare.PopupRight.prototype.componentMinimumSpecVersion = 1.0;
illumicare.PopupRight.prototype.init = function(){
    //define data request
};
illumicare.PopupRight.prototype.render = function(){
    var self = this;

    //determine code path
    var strCodeFile = "I:\\winintel\\static_content\\custom_mpage_content\\custom-components\\js\\illumicare\\illumicare.ribbon.js";


    //load js files
    self.getTarget().innerHTML = '<span title="'+strCodeFile+'">' + illumicare.config.loadingText + '...</span>';
    illumicare.resourceLoader.js([strCodeFile], function(){
        try {
            self.getTarget().innerHTML = '<span title="'+strCodeFile+'">' + illumicare.config.loadingText + '...</span>';
            $().illumicarePopupRight(self, 1);
        } catch(err){
            var strError = err.description;
            self.getTarget().innerHTML = '<span title="'+strCodeFile+'\n\n'+strError+'">Error calling $().baycareCustomComponent(self)...</span>';
        }
    });
};

//illumicarePopupSingle
illumicare.PopupSingle = function(){};
illumicare.PopupSingle.prototype = new MPage.Component();
illumicare.PopupSingle.prototype.constructor = MPage.Component;
illumicare.PopupSingle.prototype.base = MPage.Component.prototype;
illumicare.PopupSingle.prototype.componentMinimumSpecVersion = 1.0;
illumicare.PopupSingle.prototype.init = function(){
    //define data request
};
illumicare.PopupSingle.prototype.render = function(){
    var self = this;

    //determine code path
    var strCodeFile = "I:\\winintel\\static_content\\custom_mpage_content\\custom-components\\js\\illumicare\\illumicare.ribbon.js";


    //load js files
    self.getTarget().innerHTML = '<span title="'+strCodeFile+'">' + illumicare.config.loadingText + '...</span>';
    illumicare.resourceLoader.js([strCodeFile], function(){
        try {
            self.getTarget().innerHTML = '<span title="'+strCodeFile+'">' + illumicare.config.loadingText + '...</span>';
            $().illumicarePopupSingle(self, 1);
        } catch(err){
            var strError = err.description;
            self.getTarget().innerHTML = '<span title="'+strCodeFile+'\n\n'+strError+'">Error calling $().baycareCustomComponent(self)...</span>';
        }
    });
};
/**
 LazyLoad makes it easy and painless to lazily load one or more external
 JavaScript or CSS files on demand either during or after the rendering of a web
 page.

 Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
 Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
 are not officially supported.

 Visit https://github.com/rgrove/lazyload/ for more info.

 Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
 All rights reserved.

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the 'Software'), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
//renamed illumicare.resourceLoader (instead of LazyLoad)
illumicare.resourceLoader=(function(doc){var env,head,pending={},pollCount=0,queue={css:[],js:[]},styleSheets=doc.styleSheets;function createNode(name,attrs){var node=doc.createElement(name),attr;for(attr in attrs){if(attrs.hasOwnProperty(attr)){node.setAttribute(attr,attrs[attr]);}}
    return node;}
    function finish(type){var p=pending[type],callback,urls;if(p){callback=p.callback;urls=p.urls;urls.shift();pollCount=0;if(!urls.length){callback&&callback.call(p.context,p.obj);pending[type]=null;queue[type].length&&load(type);}}}
    function getEnv(){var ua=navigator.userAgent;env={async:doc.createElement('script').async===true};(env.webkit=/AppleWebKit\//.test(ua))||(env.ie=/MSIE|Trident/.test(ua))||(env.opera=/Opera/.test(ua))||(env.gecko=/Gecko\//.test(ua))||(env.unknown=true);}
    function load(type,urls,callback,obj,context){var _finish=function(){finish(type);},isCSS=type==='css',nodes=[],i,len,node,p,pendingUrls,url;env||getEnv();if(urls){urls=typeof urls==='string'?[urls]:urls.concat();if(isCSS||env.async||env.gecko||env.opera){queue[type].push({urls:urls,callback:callback,obj:obj,context:context});}else{for(i=0,len=urls.length;i<len;++i){queue[type].push({urls:[urls[i]],callback:i===len-1?callback:null,obj:obj,context:context});}}}
        if(pending[type]||!(p=pending[type]=queue[type].shift())){return;}
        head||(head=doc.head||doc.getElementsByTagName('head')[0]);pendingUrls=p.urls;for(i=0,len=pendingUrls.length;i<len;++i){url=pendingUrls[i];if(isCSS){node=env.gecko?createNode('style'):createNode('link',{href:url,rel:'stylesheet'});}else{node=createNode('script',{src:url});node.async=false;}
            node.className='lazyload';node.setAttribute('charset','utf-8');if(env.ie&&!isCSS&&'onreadystatechange'in node&&!('draggable'in node)){node.onreadystatechange=function(){if(/loaded|complete/.test(node.readyState)){node.onreadystatechange=null;_finish();}};}else if(isCSS&&(env.gecko||env.webkit)){if(env.webkit){p.urls[i]=node.href;pollWebKit();}else{node.innerHTML='@import "'+url+'";';pollGecko(node);}}else{node.onload=node.onerror=_finish;}
            nodes.push(node);}
        for(i=0,len=nodes.length;i<len;++i){head.appendChild(nodes[i]);}}
    function pollGecko(node){var hasRules;try{hasRules=!!node.sheet.cssRules;}catch(ex){pollCount+=1;if(pollCount<200){setTimeout(function(){pollGecko(node);},50);}else{hasRules&&finish('css');}
        return;}
        finish('css');}
    function pollWebKit(){var css=pending.css,i;if(css){i=styleSheets.length;while(--i>=0){if(styleSheets[i].href===css.urls[0]){finish('css');break;}}
        pollCount+=1;if(css){if(pollCount<200){setTimeout(pollWebKit,50);}else{finish('css');}}}}
    return{css:function(urls,callback,obj,context){load('css',urls,callback,obj,context);},js:function(urls,callback,obj,context){load('js',urls,callback,obj,context);}};})(this.document);

/******************************************************************************
 ___ END Illumicare HHCGapValue COMPONENT ___
 ******************************************************************************/

/* Prescription Drug Monitoring (PMP) custom component start here */
if (pwx == undefined)
{
	var pwx = new Object();
}
pwx.Narxcheck = function ()  {};
pwx.Narxcheck.prototype = new MPage.Component();
pwx.Narxcheck.prototype.constructor = MPage.Component;
pwx.Narxcheck.prototype.base = MPage.Component.prototype;
pwx.Narxcheck.prototype.name = "pwx.Narxcheck";
pwx.Narxcheck.prototype.cclProgram = "AMB_MP_NARXCHECK";
pwx.Narxcheck.prototype.cclParams = [];
pwx.Narxcheck.prototype.cclDataType = "JSON";

pwx.Narxcheck.prototype.init = function (options)
{
	var params = [];
	//set params
	params.push("MINE");
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("positionCd"));
	params.push(0); //get basic bedrock setting
	params.push(0);
	params.push("");
	params.push("");
	this.cclParams = params;
};
//set the MinimumSpecVersion
pwx.Narxcheck.prototype.componentMinimumSpecVersion = 1.0;
//set render to display the component
pwx.Narxcheck.prototype.render = function ()
{
	var element = this.getTarget();
	var component = this.getOption("parentComp");
	var narxcheckCompId = this.getComponentUid();
	var PID = this.getProperty("personId") + ".0"
		var EID = this.getProperty("encounterId") + ".0"
		var UID = this.getProperty("userId") + ".0"
		var POID = this.getProperty("positionCd") + ".0"
		var narxcheckmainHTML = [];
	var narxcheckscoreHTML = [];
	var narxcheckscoreValue = [];
	var reportSendDEA = "";
	var reportSendLice = "";
	var reportHTML = [];
	var rolenameresponse = [];
	var Disclaimer = "";
	var reportPMP = [];
	var reportURL = "";
	var narxcheckscoreInd = 0;
	var medListInd = 0;
	var responseFail = [];
	var responsereportFail = [];
	var useralias = [];
	var errorFail = [];
	var responsefoundind = 0;
	var openeulacount = 0;
	var openeulahyperlinkcount = 0;
	var ambnarxcheckmainObj = this.data;

	//all hardcoded message variable here
	var loading_msg = "Please wait while we retrieve PMP records..."
		var recommended_review_primary_text = "Recommended Review"
		var recommended_review_secondary_text = "State Law requires viewing PMP data under certain circumstances, please refer to State Law for specific policy."
		var eula_term_text = "License Agreement Required: Please review and accept license to access PMP."
		var eula_term_modal_line1 = "State policy requires <a id='amb_narxcheck_eula_hyperlink" + narxcheckCompId + "'>review and acceptance of terms and conditions</a> of use to access state Prescription Drug Monitoring Program (PDMP) registry information."
		var eula_term_modal_line2 = "Access will not be provided until the end user license agreement is accepted and recorded by the state administrator."
		var eula_term_modal_line3 = "When complete, please refresh the PDMP or NARxCHECK view to access registry information."
		var multi_lice_text = "Multiple state license numbers found. Please choose appropriate for your state."
		var multi_dea_text = "Multiple DEA numbers found. Please choose appropriate."
		var pmp_score_save_text = "PMP drug information not saved for this visit/encounter."

		//build container to hold dynamic HTML
		narxcheckmainHTML.push("<div id='narxcheck_main_div_id" + narxcheckCompId + "' class='narxcheck_main_div_class'>")
		narxcheckmainHTML.push("<div id='narxcheck_review_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("<div id='narxcheck_storable_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("<div id='narxcheck_disclaimer_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("<div id='narxcheck_score_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("<div id='narxcheck_score_report_url_id" + narxcheckCompId + "'></div>")
		narxcheckmainHTML.push("</div>")
		$(element).html(narxcheckmainHTML.join(""));
	var amb_narxcheck_header_display = '- Last 2 years';
	this.setProperty("headerSubTitle", amb_narxcheck_header_display);

	//build parameter to call narxcheck service
	var scoreParam = [];
	scoreParam.push("MINE");
	scoreParam.push(PID); //person ID
	scoreParam.push(EID); //encounter ID
	scoreParam.push(UID); //user ID
	scoreParam.push(POID); //Position code
	scoreParam.push(1) //indicator to narxcheck service call
	scoreParam.push(0) //service type(eula request,eula acceptance, patient request)
	scoreParam.push("^^") //Report URL if needed
	scoreParam.push("^^") //DEA number
	scoreParam.push("^^") //LICENSE number

	//display loading text before CCL call
	$('#narxcheck_review_id' + narxcheckCompId).html('<div id="amb_narcheck_loadingdiv' + narxcheckCompId + '" class="amb_narcheck_loadingdivclass"><span id="amb_narxcheck-spinner' + narxcheckCompId + '" class="amb_narcheck-spinner"></span>' + loading_msg + '</div>');

	/*
	 * @function to call script to get eula/score/report response
	 * @param {string} AMB_MP_NARXCHECK : service script name
	 * @param {Array} scoreParam : Array contain required promot varaible (patientID,encounter ID,user ID,score etc)
	 * @param {number} true : contain true boolean value
	 */

	AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", scoreParam, true, function ()
	{
		var sucessbody = this.RESPONSEBODY
			var rolename = this.ROLE_NAME
			//get user alias information (NPI,DEA and LICENSE number)
			for (i = 0; i < this.USER_ALIAS.length; i++)
			{
				useralias.push(this.USER_ALIAS[i].USER_ALIAS_NUMBER)
			}
			//if response service name is EULA request and response code is 200 that mean we need to release EULA sign layout screen.
			if (this.SERVICE_NAME === 'EULA Request' && this.RESPONSECODE === "200")
			{
				//making sure URL has http in it in case
				if (sucessbody.indexOf("http") > -1)
				{
					$("#amb_narcheck_loadingdiv" + narxcheckCompId).remove() //remove loading div
					//create advisory banner box for EULA Sign term
					amb_narxcheck_banner_box("narxcheck_review_id" + narxcheckCompId + "", "narxcheck_advisory-msg", eula_term_text, "Launch", "narxcheck-adv_btn_terms" + narxcheckCompId + "")
					$("#narxcheck_review_id" + narxcheckCompId).addClass("narxcheck_review_class")
					//open modal to release EULA form
					$("#narxcheck-adv_btn_terms" + narxcheckCompId).click("")
					$("#narxcheck-adv_btn_terms" + narxcheckCompId).click(function ()
					{
						//create EULA launch modal
						var consentHTML = "<dl class='eula_modal_line1'>" + eula_term_modal_line1 + "</dl><dl class='eula_modal_line1'>" + eula_term_modal_line2 + "</dl><dl class='eula_modal_line1'>" + eula_term_modal_line3 + "</dl>"
							var consentModalobj = new ModalDialog("consentmodal")
							.setHeaderTitle('<span>Terms of Use License Agreement</span>')
							.setTopMarginPercentage(20)
							.setRightMarginPercentage(25)
							.setBottomMarginPercentage(20)
							.setLeftMarginPercentage(25)
							.setIsBodySizeFixed(true)
							.setHasGrayBackground(true)
							.setIsFooterAlwaysShown(true);
						consentModalobj.setBodyDataFunction(
							function (modalObj)
						{
							modalObj.setBodyHTML(consentHTML);
						}
						);
						var okbtn = new ModalButton("consentmodal");
						//when review and accept terms click
						okbtn.setText("Review and Accept Terms").setCloseOnClick(false).setOnClickFunction(function ()
						{
							//counter in case user click more than one time as URL is one time viewed we need to get new URL on more clicks and load them
							openeulacount = openeulacount + 1
								if (openeulacount > 1)
								{
									//calling to get new URL
									AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", scoreParam, true, function ()
									{
										if (this.RESPONSEBODY.indexOf("http") > -1 && this.SERVICE_NAME === 'EULA Request' && this.RESPONSECODE === "200")
										{ //making sure it is success
											openwindowpopup(this.RESPONSEBODY, 800, 800)
										}
										else
										{
											MP_ModalDialog.closeModalDialog("consentmodal")
											var comp = MPage.getCustomComp(narxcheckCompId);
											comp.refresh();
										}
									}
									);
								}
								else
								{
									//open IE EULA sign form on top of the modal
									openwindowpopup(sucessbody, 800, 800)
								}
						}
						);
						var closebtn = new ModalButton("addCancel");
						closebtn.setText("Cancel").setCloseOnClick(true).setOnClickFunction(function ()
						{
							var comp = MPage.getCustomComp(narxcheckCompId);
							comp.refresh(); //upon closing refereh component
						}
						);
						consentModalobj.addFooterButton(okbtn)
						consentModalobj.addFooterButton(closebtn)
						MP_ModalDialog.addModalDialogObject(consentModalobj);
						MP_ModalDialog.showModalDialog("consentmodal")
						//same logic on hyperlink
						$("#amb_narxcheck_eula_hyperlink" + narxcheckCompId).click(function ()
						{
							openeulahyperlinkcount = openeulahyperlinkcount + 1
								if (openeulahyperlinkcount > 1)
								{
									AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", scoreParam, true, function ()
									{
										if (this.RESPONSEBODY.indexOf("http") > -1 && this.SERVICE_NAME === 'EULA Request' && this.RESPONSECODE === "200")
										{
											openwindowpopup(this.RESPONSEBODY, 800, 800)
										}
										else
										{
											MP_ModalDialog.closeModalDialog("consentmodal")
											var comp = MPage.getCustomComp(narxcheckCompId);
											comp.refresh();
										}
									}
									);
								}
								else
								{
									openwindowpopup(sucessbody, 800, 800)
								}
						}
						)
						//refersh component on close icon click
						$('.dyn-modal-hdr-close').click(function ()
						{
							var comp = MPage.getCustomComp(narxcheckCompId);
							comp.refresh();
						}
						);
					}
					)
					function openwindowpopup(url, width, height)
					{
						var leftPosition,
						topPosition;
						//Allow for borders.
						leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
						//Allow for title and status bars.
						if (window.screen.height < 800)
						{
							topPosition = window.screen.height;
						}
						else
						{
							topPosition = (window.screen.height / 2) - ((height / 2) + 50);
						}
						//Open the window.
						window.open(url, "EULA Agreement Form",
							"status=no,height=" + height + ",width=" + width + ",resizable=yes,left="
							 + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY="
							 + topPosition + ",toolbar=no,menubar=no,scrollbars=yes,location=no,directories=no");
					}
				}
			}
			else
			{
				//if EULA is not get in response that mean user already signed before and continue with score/report call
				RenderResponseHTML(sucessbody, rolename, useralias);
			}
	}
	);

	/*
	 * @function to display/capture eula/score/report response
	 * @param {string} data : hold eula/score/report response
	 * @param {string} rolename : contain name of role i.e physician role
	 * @param {number} useralias : contain user alias number if there is
	 */
	function RenderResponseHTML(data, rolename, useralias)
	{
		$("#amb_narcheck_loadingdiv" + narxcheckCompId).remove() //remove loading div
		try
		{
			xmlDoc = $.parseXML(data);
			xml = $(xmlDoc);
			/* detect is it narxcheck vs medlist */
			if ($(xml).find("NarxCheckScore").length === 0)
			{
				if ($(xml).find("ReportRequestURLs").length !== 0)
				{
					medListInd = 1
				}
			}
			else
			{
				narxcheckscoreInd = 1
			}
			/* found error receive from gateway and not from PMP*/
			$(xml).find("Error").each(function ()
			{
				errorFail.push($(this).find("Message").text())
				errorFail.push($(this).find("Details").text())
			}
			)
			/*If disclaimer found then extract */
			$(xml).find("Disclaimer").each(function ()
			{
				Disclaimer = $(xml).find("Disclaimer").text()
					$("#narxcheck_disclaimer_id" + narxcheckCompId).html('<span class="amb_narxcheck_disclaimer-style-class" id="amb_narxcheck_disclaimer-style-class' + narxcheckCompId + '">' + Disclaimer + '</span>')
					$("#narxcheck_disclaimer_id" + narxcheckCompId).addClass("narxcheck_disclaimer_class")
			}
			)
			/* If Report tag found then parse the xml (extract Report tag)*/
			$(xml).find("Report").each(function ()
			{
				$(this).find("ResponseDestinations").each(function ()
				{
					var pmplength = $(this).find("Pmp").length
						for (i = 0; i < pmplength; i++)
						{
							reportPMP.push($(this).find("Pmp").eq(i).text()) //store all PMP states
						}
				}
				)
				/*If MandatoryReview tag found */
				$(xml).find("MandatoryReview").each(function ()
				{
					var requiredind = $(this).find("Required").text()
						var rolelength = $(this).find("Role").length
						for (i = 0; i < rolelength; i++)
						{
							rolenameresponse.push($(this).find("Role").eq(i).text())
						}
						//if role name is find
						if ((requiredind = "true") && (rolenameresponse.indexOf(rolename) > -1))
						{
							amb_narxcheck_banner_box("narxcheck_review_id" + narxcheckCompId + "", "narxcheck_warning-msg", recommended_review_primary_text, recommended_review_secondary_text, "")
							$("#narxcheck_review_id" + narxcheckCompId).addClass("narxcheck_review_class")
						}
				}
				)
				/*If ReportRequestURLs tag found */
				$(this).find("ReportRequestURLs").each(function ()
				{
					$(this).find("StorableReport").each(function ()
					{
						//we are not stroing report so not creating store message banner untill narxschore found
						if (narxcheckscoreInd === 1 && ambnarxcheckmainObj.RECORD_DATA.PRSNL_NAME == "" && ambnarxcheckmainObj.RECORD_DATA.ACTION_DT === "--")
						{ 
							//if no bedrock event code mapping not found then don't display button
							if(ambnarxcheckmainObj.RECORD_DATA.NARCOTICS_SCORE != '0' || ambnarxcheckmainObj.RECORD_DATA.SEDATIVES_SCORE != '0' || ambnarxcheckmainObj.RECORD_DATA.STIMULANTS_SCORE != '0'){
							   amb_narxcheck_banner_box("narxcheck_storable_id" + narxcheckCompId + "", "narxcheck_advisory-msg", pmp_score_save_text, "Save to Chart", "narxcheck-adv_btn_save" + narxcheckCompId + "")
							   $("#narxcheck_storable_id" + narxcheckCompId).addClass("narxcheck_storable_class")
							}
						}
					}
					);
					reportURL = $(this).find("ViewableReport").text()
						if (reportURL != "")
						{
							amb_narxcheck_PDPM_Report_Link_HTML();
						}
				}
				)
				/*If NarxCheckScore tag found */
				$(this).find("NarxCheckScore").each(function ()
				{
					narxcheckscoreValue.push("'" + $(this).find("Narcotics").text() + "'", "'" + $(this).find("Sedatives").text() + "'", "'" + $(this).find("Stimulants").text() + "'")
					amb_narxcheck_PDMP_Score_HTML($(this).find("Narcotics").text(), $(this).find("Sedatives").text(), $(this).find("Stimulants").text())
				}
				)
			}
			)
			/* If response tag found then parse the xml (extract disallowed. error tag tag)*/
			$(xml).find("Response").each(function ()
			{
				responsefoundind = 1;
				len = responseFail.length
					responseFail[len] = new Array(5);
				$(this).find("ResponseDestinations").each(function ()
				{
					responseFail[len][0] = $(this).find("Pmp").text()
				}
				)
				$(this).find("Disallowed").each(function ()
				{
					responseFail[len][1] = 'Disallowed'
						responseFail[len][2] = $(this).find("Message").text()
						responseFail[len][3] = '' //for details but in disallowed we will not see details
						responseFail[len][4] = $(this).find("Source").text()
				}
				)
				$(this).find("Error").each(function ()
				{
					responseFail[len][1] = 'Error'
						responseFail[len][2] = $(this).find("Message").text()
						responseFail[len][3] = $(this).find("Details").text()
						responseFail[len][4] = $(this).find("Source").text()
				}
				)
			}
			)
		}
		catch (err)
		{
			//if response is not in XML that mean either of the below conditions
			if ("Multiple DEA number found on user account." === data)
			{
				amb_narxcheck_banner_box("narxcheck_review_id" + narxcheckCompId + "", "narxcheck_advisory-msg", multi_dea_text, "Select DEA", "narxcheck-adv_btn_dea" + narxcheckCompId + "")
				$("#narxcheck_review_id" + narxcheckCompId).addClass("narxcheck_review_class")
			}
			else if ("Multiple License number found on user account." === data)
			{
				amb_narxcheck_banner_box("narxcheck_review_id" + narxcheckCompId + "", "narxcheck_advisory-msg", multi_lice_text, "Select License", "narxcheck-adv_btn_ln" + narxcheckCompId + "")
				$("#narxcheck_review_id" + narxcheckCompId).addClass("narxcheck_review_class")
			}
			else
			{
				amb_narxcheck_banner_box("narxcheck_main_div_id" + narxcheckCompId + "", "narxcheck_error-msg", data, "", "")
			}
		}
		//add entire disclaimer title on title tag
		if (Disclaimer != "")
		{
			$(".amb_narxcheck_disclaimer-style-class").attr("title", Disclaimer)
		}
		//call narxcheck/PDMP report
		$("#amb_narxcheck_report_ID" + narxcheckCompId).click(function ()
		{
			//build parameter to call narxcheck/PDMP report
			var reportParam = [];
			reportParam.push("MINE");
			reportParam.push(PID); //person ID
			reportParam.push(EID); //encounter ID
			reportParam.push(UID); //user ID
			reportParam.push(POID); //Position code
			reportParam.push(1) //indicator to narxcheck service call
			reportParam.push(1) //service type (Report request)
			reportParam.push("^" + reportURL + "^") //Report URL if needed
			reportParam.push("^" + reportSendDEA + "^") //DEA number
			reportParam.push("^" + reportSendLice + "^") //LICENSE number
			AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", reportParam, true, function ()
			{
				amb_narxcheck_pdmp_report_open(this.RESPONSEBODY)
			}
			);
		}
		)
		//response fail modal check
		if ((medListInd === 1 || narxcheckscoreInd === 1) && (responseFail.length !== 0))
		{
			$("#amb_narxcheck_report_ID" + narxcheckCompId).after("<span class='amb_narxcheck_info-icon' title='PMP Connectivity Information' id='amb_narxcheck_info_id" + narxcheckCompId + "'></span>")
			$("#amb_narxcheck_info_id" + narxcheckCompId).click(function ()
			{
				amb_narxcheck_failed_response(responseFail)
			}
			)
		}
		else
		{
			if (responseFail.length > 0)
			{ //error banner with hyperlink to open modal
				var error_string = '<a id="amb_narxcheck_error_info_id' + narxcheckCompId + '">Click Here</a> to see more error information.'
					amb_narxcheck_banner_box("narxcheck_main_div_id" + narxcheckCompId + "", "narxcheck_error-msg", error_string, "", "")
					$("#narxcheck_disclaimer_id" + narxcheckCompId).hide();
				$("#amb_narxcheck_error_info_id" + narxcheckCompId).click(function ()
				{
					amb_narxcheck_failed_response(responseFail)
				}
				)
			}
		}
		//if error only found without response tag which mean gateway error
		if (responsefoundind === 0 && errorFail.length > 0)
		{
			amb_narxcheck_banner_box("narxcheck_main_div_id" + narxcheckCompId + "", "narxcheck_error-msg", errorFail.join(""), "", "")
		}
		//attach event to store score
		$("#narxcheck-adv_btn_save" + narxcheckCompId).click(function ()
		{
			var scoreArray = [];
			scoreArray.push(ambnarxcheckmainObj.RECORD_DATA.NARCOTICS_SCORE)
			scoreArray.push(ambnarxcheckmainObj.RECORD_DATA.SEDATIVES_SCORE)
			scoreArray.push(ambnarxcheckmainObj.RECORD_DATA.STIMULANTS_SCORE)
			if (ambnarxcheckmainObj.RECORD_DATA.NARCOTICS_SCORE != '0' || ambnarxcheckmainObj.RECORD_DATA.SEDATIVES_SCORE != '0' || ambnarxcheckmainObj.RECORD_DATA.STIMULANTS_SCORE != '0')
			{
				//kick off store event
				var cereultParam = [];
				cereultParam.push("MINE");
				cereultParam.push(PID);
				cereultParam.push(EID);
				cereultParam.push(UID);
				cereultParam.push(POID);
				cereultParam.push(CreateParamArray(scoreArray, 1))
				cereultParam.push(CreateParamArray(narxcheckscoreValue, 0))
				AMB_CCL_Insert_Score_Clinical_Event("AMB_MP_ADD_CE_RESULT", cereultParam, true, function ()
				{
					if ($('#narxcheck-adv_btn_save' + narxcheckCompId).text() === 'Save to Chart')
					{
						$('#narxcheck-adv_btn_save' + narxcheckCompId).html('Saved Chart');
						$('#narxcheck-adv_btn_save' + narxcheckCompId).attr("disabled", "disabled");
					}
				}
				)
			}		
		}
		)
		//attach event for multi dea
		$("#narxcheck-adv_btn_dea" + narxcheckCompId).click(function ()
		{
			amb_multi_DEA_State_License_info("DEA", useralias)
		}
		)
		//attach event for multi Lice
		$("#narxcheck-adv_btn_ln" + narxcheckCompId).click(function ()
		{
			amb_multi_DEA_State_License_info("State License", useralias)
		}
		)
	}

	/*
	 * @function to handle open report and if there is failed response upon HTTP POST on report service
	 * @param {string} reportdata : hold REPORT service response body text
	 */
	function amb_narxcheck_pdmp_report_open(reportdata)
	{
		try
		{
			xmlDoc = $.parseXML(reportdata);
			xml = $(xmlDoc);
			$(xml).find("ReportLink").each(function ()
			{
				window.open(xml.find("ReportLink").text(), "PMP Report", 'width=1024,scrollbars=yes,resizable=yes');
			}
			);
			/* If Disallowed/Error tag found then parse the xml (extract disallowed. error tag tag)*/
			$(xml).find("Disallowed").each(function ()
			{
				len = responsereportFail.length
					responsereportFail[len] = new Array(5);
				responsereportFail[len][0] = '--'
					responsereportFail[len][1] = 'Disallowed'
					responsereportFail[len][2] = $(this).find("Message").text()
					responsereportFail[len][3] = '' //for details but in disallowed we will not see details
					responsereportFail[len][4] = $(this).find("Source").text()
			}
			)
			$(xml).find("Error").each(function ()
			{
				len = responsereportFail.length
					responsereportFail[len] = new Array(5);
				responsereportFail[len][0] = '--'
					responsereportFail[len][1] = 'Error'
					responsereportFail[len][2] = $(this).find("Message").text()
					responsereportFail[len][3] = $(this).find("Details").text()
					responsereportFail[len][4] = $(this).find("Source").text()
			}
			)
			if (responsereportFail.length > 0)
			{
				amb_narxcheck_failed_response(responsereportFail)
			}
		}
		catch (err)
		{
			//create POST fail banner box on modal
			MP_ModalDialog.deleteModalDialogObject("failereportmodal")
			var failedReportModalobj = new ModalDialog("failereportmodal")
				.setHeaderTitle('<span>PMP Connectivity Information</span>')
				.setTopMarginPercentage(35)
				.setRightMarginPercentage(30)
				.setBottomMarginPercentage(35)
				.setLeftMarginPercentage(30)
				.setIsBodySizeFixed(true)
				.setHasGrayBackground(true)
				.setIsFooterAlwaysShown(true);
			failedReportModalobj.setBodyDataFunction(
				function (modalObj)
			{
				modalObj.setBodyHTML('<span class="amb_narxcheck_report_http_fail" id="amb_narxcheck_report_http_id' + narxcheckCompId + '">' + reportdata + '</span>');
			}
			);
			var okbtn = new ModalButton("failereportmodal");
			okbtn.setText("OK").setCloseOnClick(true);
			failedReportModalobj.addFooterButton(okbtn)
			MP_ModalDialog.addModalDialogObject(failedReportModalobj);
			MP_ModalDialog.showModalDialog("failereportmodal")
		}
	}

	/*
	 * @function to handle banner box (advisory ,mandatory review and error banner box)
	 * @param {string} messageHTMLID : index of HTML div ID which contain banner information
	 * @param {string} alertbannerType : index of div css id which seperate mandatory review vs advisory  vs error banner
	 * @param {string} primaryText : bold text primary text information
	 * @param {string} SecondaryText : secondary text information
	 * @param {string} buttonID : index for buttonID for advisory  banner
	 */
	function amb_narxcheck_banner_box(messageHTMLID, alertbannerType, primaryText, SecondaryText, buttonID)
	{
		//Grab a sample container
		var $container = $("#" + messageHTMLID);
		//Render the alert banner into the container
		var bannerHTML = "";
		bannerHTML = "<div id='" + messageHTMLID + "' class='narxcheck_alert-msg'>";
		bannerHTML += "<div class = '" + alertbannerType + "'>";
		if (alertbannerType === 'narxcheck_advisory-msg')
		{
			var buttonnarxcheck = "";
			buttonnarxcheck = "<button type='button' id=" + buttonID + " class='narxcheck_btn'>" + SecondaryText + "</button>"
				if (primaryText != "")
				{
					bannerHTML += "<div class='narxcheck_alert_advistory-info' title=" + primaryText + "><span class='narxcheck_alert-icon'>&nbsp;</span>" + primaryText + "</div>";
				}
				if (SecondaryText != "")
				{
					bannerHTML += "<div class='narxcheck_alert_advistory-sec-info'>" + buttonnarxcheck + "</div>";
				}
				bannerHTML += "<div style='clear: both;'></div>"
		}
		else
		{
			if (primaryText != "")
			{
				bannerHTML += "<div class='narxcheck_alert-info'><span class='narxcheck_alert-icon'>&nbsp;</span>" + primaryText
			}
			if (SecondaryText != "")
			{
				bannerHTML += "<span class='narxcheck_alert-msg-secondary-text'>&nbsp;" + SecondaryText + "</span></div>";
			}
		}
		bannerHTML += '</div></div>'
		$container.append(bannerHTML);
		//add tooltip to advistory layout
		$(".narxcheck_alert_advistory-info").attr("title", primaryText)
	}

	/*
	 * @function to handle score HTML render
	 * @param {string} Narcotics :value of Narcotics score
	 * @param {string} Sedatives :value of Sedatives score
	 * @param {string} Stimulants :value of Stimulants score
	 */
	function amb_narxcheck_PDMP_Score_HTML(Narcotics, Sedatives, Stimulants)
	{
		narxcheckscoreHTML.push('<div class="' + amb_narxcheck_score_class_check(Narcotics) + '_div amb_narxcheck_Narcotics_style" id="' + amb_narxcheck_score_class_check(Narcotics) + '_div_id' + narxcheckCompId + '">',
			'<dl class="' + amb_narxcheck_score_class_check(Narcotics) + '_number amb_narxcheck_score-number-style">' + Narcotics + '</dl>',
			'<dl class="' + amb_narxcheck_score_class_check(Narcotics) + '_score amb_narxcheck_score-style">Narcotics</dl>',
			'</div>')
		narxcheckscoreHTML.push('<div class="' + amb_narxcheck_score_class_check(Sedatives) + '_div amb_narxcheck_Sedatives_style" id="' + amb_narxcheck_score_class_check(Sedatives) + '_div_id' + narxcheckCompId + '">',
			'<dl class="' + amb_narxcheck_score_class_check(Sedatives) + '_number amb_narxcheck_score-number-style">' + Sedatives + '</dl>',
			'<dl class="' + amb_narxcheck_score_class_check(Sedatives) + '_score amb_narxcheck_score-style">Sedatives</dl>',
			'</div>')
		narxcheckscoreHTML.push('<div class="' + amb_narxcheck_score_class_check(Stimulants) + '_score_div amb_narxcheck_Stimulants_style" id="' + amb_narxcheck_score_class_check(Stimulants) + '_div_id' + narxcheckCompId + '">',
			'<dl class="' + amb_narxcheck_score_class_check(Stimulants) + '_number amb_narxcheck_score-number-style">' + Stimulants + '</dl>',
			'<dl class="' + amb_narxcheck_score_class_check(Stimulants) + '_score amb_narxcheck_score-style">Stimulants</dl>',
			'</div>')
		$("#narxcheck_score_id" + narxcheckCompId).html(narxcheckscoreHTML.join(""))
		$("#narxcheck_score_id" + narxcheckCompId).addClass("narxcheck_score_class")
	}

	/*
	 * @function to handle view drug report hyperlink HTML and saved to chart message
	 */
	function amb_narxcheck_PDPM_Report_Link_HTML()
	{
		//if med list view is not on
		if (medListInd !== 1)
		{
			var actiondate = new Date();
			if (ambnarxcheckmainObj.RECORD_DATA.ACTION_DT != '--')
			{
				actiondate.setISO8601(ambnarxcheckmainObj.RECORD_DATA.ACTION_DT);
				var actionUTCdate = actiondate.format("MM/dd/yy");
				var actionUTCtime = actiondate.format("h:MM TT");
			}
			else
			{
				var actionUTCdate = "--"
			}
		}
		reportHTML.push('<dl class="amb_narxcheck_report_row"><a title="View Report" id="amb_narxcheck_report_ID' + narxcheckCompId + '" class="amb_narxcheck_drug_report_link amb_narxcheck_drug_report_text">View Drug Report</a></dl>')
		//if action date is not there then no need for display
		if (ambnarxcheckmainObj.RECORD_DATA.PRSNL_NAME != "" && ambnarxcheckmainObj.RECORD_DATA.ACTION_DT != "--")
		{
			reportHTML.push('<dl class="amb_narxcheck_report_saved_msg"><span class="amb_narxcheck_report_saved_msg_text">Last saved to record',
				'</span>&nbsp;<span class="amb_narxcheck_report_saved_msg_text">by ' + ambnarxcheckmainObj.RECORD_DATA.PRSNL_NAME + ' on ' + actionUTCdate + ' at ' + actionUTCtime + '</span>&nbsp;&nbsp<a id="narxcheck-adv_btn_save' + narxcheckCompId + '" class="amb_narxcheck_saved_again">Save again</a></dl>')
		}
		$("#narxcheck_score_report_url_id" + narxcheckCompId).html(reportHTML)
		$("#narxcheck_score_report_url_id" + narxcheckCompId).addClass("narxcheck_score_report_url_class")
	}

	/*
	 * @function to create modal to handle fail response
	 * @param {string} responseFail :hold value of all failed response state information
	 */
	function amb_narxcheck_failed_response(responseFail)
	{
		MP_ModalDialog.deleteModalDialogObject("faileresponsemodal")
		var responseFailHTML = [];
		var amb_narxcheck_failed_stripe_class = "";
		var responsefailindex = 0;
		responseFailHTML.push('<dl class="amb_narxcheck_response_fail_header">',
			'<dt class="amb_narxcheck_response_fail_PMP amb_narxcheck_response_fail_header_font amb_narxcheck_border_right">PMP</dt>',
			'<dt class="amb_narxcheck_response_fail_Details amb_narxcheck_response_fail_header_font amb_narxcheck_border_right">Details</dt>',
			'<dt class="amb_narxcheck_response_fail_Source amb_narxcheck_response_fail_header_font">Source</dt>',
			'</dl>');
		//iterate through fail response array to make sure we display all PMP state fail information
		for (var i = 0; i < responseFail.length; i++)
		{
			responsefailindex = responsefailindex + 1;
			if (responsefailindex % 2 == 0)
			{
				amb_narxcheck_failed_stripe_class = "amb_narxcheck_failed_response_stripe_even_class";
			}
			else
			{
				amb_narxcheck_failed_stripe_class = "amb_narxcheck_failed_response_stripe_odd_class";
			}
			//check messagevsdetails text
			if (responseFail[i][3] != '')
			{
				var detailsInfo = ',&nbsp;<span class="amb_narxcheck_msg_style">Details:</span> ' + responseFail[i][3]
					var titledisp = 'Message:' + responseFail[i][2] + 'Details:' + responseFail[i][3]
			}
			else
			{
				var detailsInfo = ''
					var titledisp = 'Message:' + responseFail[i][2];
			}
			//create title to hold entire value
			responseFailHTML.push('<dl class="amb_narxcheck_response_fail_content ' + amb_narxcheck_failed_stripe_class + '">',
				'<dt class="amb_narxcheck_response_fail_PMP">' + responseFail[i][0] + '</dt>',
				'<dt class="amb_narxcheck_response_fail_Details" title="' + titledisp + '">' + responseFail[i][1] + ', &nbsp;<span class="amb_narxcheck_msg_style">Message:</span> ' + responseFail[i][2] + '' + detailsInfo + '</dt>',
				'<dt class="amb_narxcheck_response_fail_Source">' + responseFail[i][4] + '</dt>',
				'</dl>');
		}
		var failedModalobj = new ModalDialog("faileresponsemodal")
			.setHeaderTitle('<span>PMP Connectivity Information</span>')
			.setTopMarginPercentage(25)
			.setRightMarginPercentage(20)
			.setBottomMarginPercentage(25)
			.setLeftMarginPercentage(20)
			.setIsBodySizeFixed(true)
			.setHasGrayBackground(true)
			.setIsFooterAlwaysShown(true);
		failedModalobj.setBodyDataFunction(
			function (modalObj)
		{
			modalObj.setBodyHTML(responseFailHTML.join("")); //display all failed response in modal
		}
		);
		var okbtn = new ModalButton("faileresponsemodal");
		okbtn.setText("OK").setCloseOnClick(true);
		failedModalobj.addFooterButton(okbtn)
		MP_ModalDialog.addModalDialogObject(failedModalobj);
		MP_ModalDialog.showModalDialog("faileresponsemodal")
	}

	/*
	 * @function to handle css color changes base on ranges (low/high/moderate)
	 * @param {string} score :score value
	 */
	function amb_narxcheck_score_class_check(score)
	{
		var returnclass = ""
			switch (true)
			{
			case (score <= 200):
				returnclass = "amb_narxcheck_low_risk";
				break;
			case (score >= 200 && score <= 500):
				returnclass = "amb_narxcheck_moderate_risk";
				break;
			case (score >= 500):
				returnclass = "amb_narxcheck_higher_risk";
				break;
			}
			return returnclass
	}

	/*
	 * @function to handle CCL call for all service
	 * @param {string} program :contain value of program name
	 * @param {Array} ReqParam :Array contain required promot varaible (patientID,encounter ID,user ID etc)
	 * @param {string} async : contain true or false value
	 * @param {string} callback :callback function to render
	 */
	function AMB_CCL_Request_Reply(program, ReqParam, async, callback)
	{
		var info = new XMLCclRequest();
		info.onreadystatechange = function ()
		{
			if (info.readyState == 4 && info.status == 200)
			{
				var jsonEval = ambJSONParse(this.responseText, program);
				var recordData = jsonEval.RECORD_DATA;
			    callback.call(recordData);
				//log request and reply in blackbird
			    if (typeof BlackBirdLogger !== "undefined" && CERN_Platform.inMillenniumContext() == true) {
					//log request XML 					
	                var blackbirdRequest = '<textarea rows="26"  cols="60" style="font:11px/1.3 Consolas,Lucida Console,Monaco,monospace;overflow-y:auto;border:none;color:#DDD;background-color: transparent;">' + recordData.REQUEST_XML + '</textarea>';
				    BlackBirdLogger.prototype.logMessage(["Component: ", (component ? component.getLabel() : ""), "<br />ID: ", (component ? component.getComponentId() : ""), "<br />reqestXML: " + blackbirdRequest].join(""))
				    //log response code and other response body
				    var blackbirdResponse = '<textarea rows="26"  cols="60" style="font:11px/1.3 Consolas,Lucida Console,Monaco,monospace;border:none;color:#DDD;background-color: transparent;">' + recordData.RESPONSEBODY + '&#13;&#10;Credentials Info:'+recordData.CRED_INFO+'&#13;&#10;Request URI:'+recordData.REQUESTURI+'&#13;&#10;HTTP status code:'+recordData.RESPONSECODE+'</textarea>';			
					BlackBirdLogger.prototype.logMessage(["Component: ", (component ? component.getLabel() : ""), "<br />ID: ", (component ? component.getComponentId() : ""), "<br />Service Name: ",recordData.SERVICE_NAME, "<br />Reply XML: " + blackbirdResponse].join(""))								
				}
			}
		};
		info.open('GET', program, async);
		info.send(ReqParam.join(","));
	}

	/*
	 * @function to handle CCL call to insert clinical event results(Score) into millenium
	 * @param {string} program :contain value of program name
	 * @param {Array} ReqParam :Array contain required promot varaible (patientID,encounter ID,user ID,score etc)
	 * @param {string} async : contain true or false value
	 * @param {string} callback :callback function to render
	 */
	function AMB_CCL_Insert_Score_Clinical_Event(program, cereultParam, async, callback)
	{
		var info = new XMLCclRequest();
		info.onreadystatechange = function ()
		{
			if (info.readyState == 4 && info.status == 200)
			{
				var jsonEval = ambJSONParse(this.responseText, program);
				var recordData = jsonEval.RECORD_DATA;
				if (recordData.STATUS_DATA.STATUS === "S")
				{
					callback.call(recordData);
				}
				else
				{
					var error_text = "Failed Status: " + this.status + " Request Text: " + this.requestText;
					MP_ModalDialog.deleteModalDialogObject("amberrormodal")
					var amberrorModalobj = new ModalDialog("amberrormodal")
						.setHeaderTitle('<span class="amb_narxcheck_alert">Failed Information</span>')
						.setTopMarginPercentage(20)
						.setRightMarginPercentage(35)
						.setBottomMarginPercentage(30)
						.setLeftMarginPercentage(35)
						.setIsBodySizeFixed(true)
						.setHasGrayBackground(true)
						.setIsFooterAlwaysShown(true);
					amberrorModalobj.setBodyDataFunction(
						function (modalObj)
					{
						modalObj.setBodyHTML('<div style="padding-top:10px;"><p class="pwx_small_text">Script failed to insert score Information. ' + error_text + '</p></div>');
					}
					);
					var closebtn = new ModalButton("addCancel");
					closebtn.setText("OK").setCloseOnClick(true);
					amberrorModalobj.addFooterButton(closebtn)
					MP_ModalDialog.addModalDialogObject(amberrorModalobj);
					MP_ModalDialog.showModalDialog("amberrormodal")
				}
			}
		};
		info.open('GET', program, async);
		info.send(cereultParam.join(","));
	}

	/*
	 * @function Create promt input for ccl script when there are multiple value possible in one parameter.
	 * @param {Array} ar : The ar array contains promt .
	 * @param {string} type : The type string contains 1 or o to identify when to append .00 at the end.
	 */
	function CreateParamArray(ar, type)
	{
		var returnVal = (type === 1) ? "0.0" : "0";
		if (ar && ar.length > 0)
		{
			if (ar.length > 1)
			{
				if (type === 1)
				{
					returnVal = "value(" + ar.join(".0,") + ".0)";
				}
				else
				{
					returnVal = "value(" + ar.join(",") + ")";
				}
			}
			else
			{
				returnVal = (type === 1) ? ar[0] + ".0" : ar[0];
			}
		}
		return returnVal;
	}

	/*
	 * @function clean bad characters from JSON so it parses successfully
	 * @param {string} json_parse : json string to parse
	 * @param {string} program: program json came from
	 */
	function ambJSONParse(json_parse, program)
	{
		//preserve newlines, etc - use valid JSON
		json_parse = json_parse.replace(/\\n/g, "\\n")
			.replace(/\\'/g, "\\'")
			.replace(/\\"/g, '\\"')
			.replace(/\\&/g, "\\&")
			.replace(/\\r/g, "\\r")
			.replace(/\\t/g, "\\t")
			.replace(/\\b/g, "\\b")
			.replace(/\\f/g, "\\f");
		// remove non-printable and other non-valid JSON chars
		json_parse = json_parse.replace(/[\u0000-\u0019]+/g, "");
		try
		{
			json_parse = JSON.parse(json_parse)
				return json_parse;
		}
		catch (err)
		{
			alert(err.message + " in Program Name: " + program)
		}
	}

	/*
	 * @function This function call when Multiple state license/DEA  numbers found and NPI or DEA number are not on record.
	 * @param {string} displaystring : displaystring either DEA or License number
	 * @param {string} user_lnumber : contain alias information for dea or license number.
	 */
	function amb_multi_DEA_State_License_info(displaystring, user_lnumber)
	{
		var amb_narxcheck_prov_info_HTML = [];
		var amb_narcheck_lnumber_info_HTML = "";
		for (var i = 0; i < user_lnumber.length; i++)
		{
			if (i === 0)
			{
				amb_narcheck_lnumber_info_HTML += '<option selected>' + user_lnumber[i] + '</option>';
			}
			else
			{
				amb_narcheck_lnumber_info_HTML += '<option>' + user_lnumber[i] + '</option>';
			}
		}
		//create dropdown list for dea or license number list
		amb_narxcheck_prov_info_HTML.push("<div class='amb_narxcheck_prov_alias' id='amb_narxcheck_prov_alias_exiting" + narxcheckCompId + "'>",
			"<dt class='ambnarxcheckradiobuttonlbl'><input id='ambnarxcheckradioext" + narxcheckCompId + "'checked='true' type='radio' name='rxradiolbl' value='extradio'></input></dt>",
			"<label class='amb_narxcheck_lbl_statemodal'>Existing</label>",
			"<select class='amb_narxcheck_paliaexist_class' id='amb_narxcheck_paliaexist_id" + narxcheckCompId + "'>",
			amb_narcheck_lnumber_info_HTML,
			"</select></div>",
			"<div class='amb_narxcheck_prov_alias' id='amb_narxcheck_prov_alias_other" + narxcheckCompId + "'>",
			"<dt class='ambnarxcheckradiobuttonlbl'><input id='ambnarxcheckradioother" + narxcheckCompId + "' type='radio' name='rxradiolbl' value='otherradio'></input></dt>",
			"<label class='amb_narxcheck_lbl_statemodal'>Other</label>",
			"<input type='text' id='amb_narxcheck_palia_other" + narxcheckCompId + "' class='amb_narxcheck_palia_otherclass'></input>",
			"</div></div>");
		amb_narxcheck_prov_info_HTML.push("");
		MP_ModalDialog.deleteModalDialogObject("ambmultidealicemodal")
		var ambmultidealiceModalobj = new ModalDialog("ambmultidealicemodal")
			.setHeaderTitle('Provider Information Needed')
			.setTopMarginPercentage(30)
			.setRightMarginPercentage(32)
			.setBottomMarginPercentage(30)
			.setLeftMarginPercentage(32)
			.setIsBodySizeFixed(true)
			.setHasGrayBackground(true)
			.setIsFooterAlwaysShown(true);
		ambmultidealiceModalobj.setBodyDataFunction(
			function (modalObj)
		{
			modalObj.setBodyHTML(amb_narxcheck_prov_info_HTML.join(""));
			var ambnarxcheckradioext = $("#ambnarxcheckradioext" + narxcheckCompId);
			var amb_narxcheck_paliaexist_id = $("#amb_narxcheck_paliaexist_id" + narxcheckCompId);
			var ambnarxcheckradioother = $("#ambnarxcheckradioother" + narxcheckCompId);
			var amb_narxcheck_palia_other = $("#amb_narxcheck_palia_other" + narxcheckCompId);
			ambnarxcheckradioother.css('opacity', '.2');
			amb_narxcheck_palia_other.css('opacity', '.2');
			amb_narxcheck_palia_other.attr('readonly', true);
			//check for selection between existing and other box
			var checkboxes;
			checkboxes = $('input[name^=rxradiolbl]').change(function ()
				{
					if (this.checked)
					{
						checkboxes.not(this).prop('checked', false);
						if ($(this).val() === "extradio")
						{
							ambnarxcheckradioext.css('opacity', '')
							amb_narxcheck_paliaexist_id.css('opacity', '');
							amb_narxcheck_paliaexist_id.attr('disabled', false);
							ambnarxcheckradioother.css('opacity', '.2');
							amb_narxcheck_palia_other.css('opacity', '.2');
							amb_narxcheck_palia_other.attr('readonly', true);
						}
						else
						{
							ambnarxcheckradioother.css('opacity', '');
							amb_narxcheck_palia_other.css('opacity', '');
							amb_narxcheck_palia_other.attr('readonly', false);
							ambnarxcheckradioext.css('opacity', '.2')
							amb_narxcheck_paliaexist_id.css('opacity', '.2');
							amb_narxcheck_paliaexist_id.attr('readonly', true);
							amb_narxcheck_paliaexist_id.prop('disabled', 'disabled');
						}
					}
				}
				);
		}
		);
		var closebtn = new ModalButton("addCancel");
		closebtn.setText("Cancel").setCloseOnClick(true);
		var submitbtn = new ModalButton("addsubmitbutton");
		submitbtn.setText("Submit").setCloseOnClick(true).setOnClickFunction(function ()
		{
			var finalaliassend = "";
			var ambnarxcheckradioext = $("#ambnarxcheckradioext" + narxcheckCompId);
			var amb_narxcheck_paliaexist_id = $("#amb_narxcheck_paliaexist_id" + narxcheckCompId);
			var ambnarxcheckradioother = $("#ambnarxcheckradioother" + narxcheckCompId);
			var amb_narxcheck_palia_other = $("#amb_narxcheck_palia_other" + narxcheckCompId);
			if (ambnarxcheckradioext.is(":checked") == true)
			{
				var amb_narxcheck_existing_val = amb_narxcheck_paliaexist_id.val()
					finalaliassend = amb_narxcheck_existing_val
			}
			else
			{
				var amb_narxcheck_othermodal_val = amb_narxcheck_palia_other.val()
					if (amb_narxcheck_othermodal_val !== "")
					{
						var amb_narxcheck_othermodal_val = amb_narxcheck_palia_other.val()
							finalaliassend = amb_narxcheck_othermodal_val
					}
					else
					{
						MP_ModalDialog.deleteModalDialogObject("missingselectionmodal")
						var missingselectionModalobj = new ModalDialog("missingselectionmodal")
							.setHeaderTitle('<span>Provider Information Needed</span>')
							.setTopMarginPercentage(35)
							.setRightMarginPercentage(30)
							.setBottomMarginPercentage(35)
							.setLeftMarginPercentage(30)
							.setIsBodySizeFixed(true)
							.setHasGrayBackground(true)
							.setIsFooterAlwaysShown(true);
						missingselectionModalobj.setBodyDataFunction(
							function (modalObj)
						{
							modalObj.setBodyHTML("<span class='amb_narxcheck_report_http_fail'>Please provide " + displaystring + " number to access state's prescription monitoring program</span>");
						}
						);
						var okbtn = new ModalButton("missingselectionmodal");
						okbtn.setText("OK").setCloseOnClick(true);
						missingselectionModalobj.addFooterButton(okbtn)
						MP_ModalDialog.addModalDialogObject(missingselectionModalobj);
						MP_ModalDialog.showModalDialog("missingselectionmodal")
					}
			}
			if (finalaliassend != "")
			{
				if (displaystring === 'DEA')
				{
					scoreParam[8] = "^" + finalaliassend + "^"
						reportSendDEA = finalaliassend
				}
				else
				{
					scoreParam[9] = "^" + finalaliassend + "^"
						reportSendLice = finalaliassend
				}
				//call narxcheck service once dea or license number selected and modal is closed
				$('#narxcheck_review_id' + narxcheckCompId).html('<div id="amb_narcheck_loadingdiv' + narxcheckCompId + '" class="amb_narcheck_loadingdivclass"><span class="amb_narcheck-spinner"></span>' + loading_msg + '</div>');
				AMB_CCL_Request_Reply("AMB_MP_NARXCHECK", scoreParam, true, function ()
				{
					var sucessbody = this.RESPONSEBODY
						var rolename = this.ROLE_NAME
						RenderResponseHTML(sucessbody, rolename, useralias);
				}
				);
			}
		}
		);
		ambmultidealiceModalobj.addFooterButton(submitbtn)
		ambmultidealiceModalobj.addFooterButton(closebtn)
		MP_ModalDialog.addModalDialogObject(ambmultidealiceModalobj);
		MP_ModalDialog.showModalDialog("ambmultidealicemodal")
	}
}

/* Prescription Drug Monitoring (PMP) custom component end here */
