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
				+ "<td width = '20.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '30.0%' align = 'left'>" + info.LOCATION + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.DESCRIPTION + "</td></tr>";
			})
			output += "</table>"
		}

		if (resJSON.FUTURE_VISIT.length > 0){
			sTitle = "Future (" + resJSON.FUTURE_VISIT.length + ") - Next 5 Visits"
			output += "<table width = '100%'><tr><td class='wf_visits_table_section'>"+ sTitle +"</td></tr></table>"
			$.each(resJSON.FUTURE_VISIT, function(idx, info){
				output += "<table width = 99%>"
				+ "<tr class = 'wf_visits_row'>"
				+ "<td width = '10.0%' align = 'left'>" + info.DATE + "</td>"
				+ "<td width = '20.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '30.0%' align = 'left'>" + info.LOCATION + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.DESCRIPTION + "</td></tr>";
			})
			output += "</table>"
		}

		if (resJSON.PREV_VISIT.length > 0){
			sTitle = "Previous (" + resJSON.PREV_VISIT.length + ") - Last 5 Visits"
			output += "<table width = '100%'><tr><td class='wf_visits_table_section'>"+ sTitle +"</td></tr></table>"

			$.each(resJSON.PREV_VISIT, function(idx, info){
				output += "<table width = 99%>"
				+ "<tr class = 'wf_visits_row'>"
				+ "<td width = '10.0%' align = 'left'>" + info.DATE + "</td>"
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
				output += "<table width = 99%>"
				+ "<tr class = 'sum_popup_row' title ='" + hoverDisplay + "'>"
				+ "<td width = '25.0%' align = 'left'>" + info.DATE + "</td>"
				+ "<td width = '35.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.LOCATION + "</td></tr>";
			})
			output += "</table>"
		}

		if (resJSON.FUTURE_VISIT.length > 0){
			sTitle = "Future (" + resJSON.FUTURE_VISIT.length + ") - Next 5 Visits"
			output += "<table width = '100%'><tr><td class='sum_visits_table_section'>"+ sTitle +"</td></tr></table>"
			$.each(resJSON.FUTURE_VISIT, function(idx, info){
				var hoverDisplay = "";
				hoverDisplay = "Visit Reason: " + info.DESCRIPTION
				output += "<table width = 99%>"
				+ "<tr class = 'sum_popup_row' title ='" + hoverDisplay + "'>"
				+ "<td width = '25.0%' align = 'left'>" + info.DATE + "</td>"
				+ "<td width = '35.0%' align = 'left'>" + info.TYPE + "</td>"
				+ "<td width = '40.0%' align = 'left'>" + info.LOCATION + "</td></tr>";
			})
			output += "</table>"
		}

		if (resJSON.PREV_VISIT.length > 0){
			sTitle = "Previous (" + resJSON.PREV_VISIT.length + ") - Last 5 Visits"
			output += "<table width = '100%'><tr><td class='sum_visits_table_section'>"+ sTitle +"</td></tr></table>"

			$.each(resJSON.PREV_VISIT, function(idx, info){
				var hoverDisplay = "";
				hoverDisplay = "Visit Reason: " + info.DESCRIPTION
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

baycarefl.labfishbone.prototype.render = function(){ //;begin render

	//Takes the data in this.data and loads it into target
	var target = this.getTarget();
	var resJSON = this.data.LAB_RESULT;
	var resCnt  = resJSON.CBC_CNT;
	//var resCnt = 1;
	//target.innerHTML = "Hello World";
	var sTitle = "Custom Labs (k7) - Selected Visit"

	var Cur_Person = this.getProperty("personId"); //the current person
	var max_lab_history = 5;

	var fishbone_link = "<a class = 'fishbone' href='#'>"
	var output = ""


	 output += "<div class='sub-title-disp'>"+ sTitle +"</div>"

		 output += "<table class='anesthesia_lab_table' style='width:98%;'>";
		if (this.data.LAB_RESULT.CBC_CNT > 0){
			output += "<tr><td colspan='2' style='width:70%;text-align:right;'>" +
				"<table cellspacing='0' cellpadding='0' style='font-size:10px;'><tr>" +
				"<td rowspan='2' style='font-size:11px;width:45px;text-align:right;";
				if (this.data.LAB_RESULT.CBC[0].WBC_CRIT){
					output += "color:red;font-weight:bold;";
				}else if (this.data.LAB_RESULT.CBC[0].WBC_HIGH_LOW){
					output += "color:blue;";
				}
				output += "'";
				if (this.data.LAB_RESULT.CBC_CNT > 1){
					output += " class='anesthesia_lab_graph'";
				}
				output += ">";

				/*
				if (this.data.LAB_RESULT.CBC[0].WBC_CRIT || this.data.LAB_RESULT.CBC[0].WBC_HIGH_LOW){
					if (this.data.LAB_RESULT.CBC_CNT > 1){
						if (this.data.LAB_RESULT.CBC[0].WBC > this.data.LAB_RESULT.CBC[1].WBC){
							output += "&uarr;&nbsp;";
						}else if (this.data.LAB_RESULT.CBC[0].WBC < this.data.LAB_RESULT.CBC[1].WBC){
							output += "&darr;&nbsp;";
						}
					}
				}*/
				if (this.data.LAB_RESULT.CBC_CNT > 1){
					output += "<span class='anesthesia_lab_description'>WBC</span>";
					output += "<span class='anesthesia_lab_values'>";
					$.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.WBC;
						}
					});
					output += "</span><span class='anesthesia_lab_dates'>";
					$.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.DATE_TIME;
						}
					});
					output += "</span>";
				}

				output += "<div class = 'fish_bone_values'>"  + this.data.LAB_RESULT.CBC[0].WBC + "</a></div></td>"; //;v. do
				output += "<td><span  style='font-size:20px;vertical-align:top;position:relative;bottom:-4px;'>|</span></td>";
				output += "<td style='font-size:11px;border-bottom:1px black solid;width:45px;text-align:center;";

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
				output += ">";
				/*
				if (this.data.LAB_RESULT.CBC[0].HGB_CRIT || this.data.LAB_RESULT.CBC[0].HGB_HIGH_LOW){
					if (this.data.LAB_RESULT.CBC_CNT > 1){
						if (this.data.LAB_RESULT.CBC[0].HGB > this.data.LAB_RESULT.CBC[1].HGB){
							output += "&uarr;&nbsp;";
						}else if (this.data.LAB_RESULT.CBC[0].HGB < this.data.LAB_RESULT.CBC[1].HGB){
							output += "&darr;&nbsp;";
						}
					}
				}
				*/

				if (this.data.LAB_RESULT.CBC_CNT > 1){
					output += "<span class='anesthesia_lab_description'>HGB</span>";
					output += "<span class='anesthesia_lab_values'>";
					$.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.HGB;
						}
					});
					output += "</span><span class='anesthesia_lab_dates'>";
					$.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.DATE_TIME;
						}
					});
					output += "</span>";
				}
				output += this.data.LAB_RESULT.CBC[0].HGB + "</td>";

				output += "<td><span  style='font-size:20px;vertical-align:top;position:relative;bottom:-4px;'>|</span></td>" +
				"<td rowspan='2' style='font-size:11px;width:150px;text-align:left;";
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
				output += ">";
				/*
				if (this.data.LAB_RESULT.CBC[0].PLT_CRIT || this.data.LAB_RESULT.CBC[0].PLT_HIGH_LOW){
					if (this.data.LAB_RESULT.CBC_CNT > 1){
						if (this.data.LAB_RESULT.CBC[0].PLT > this.data.LAB_RESULT.CBC[1].PLT){
							output += "&uarr;&nbsp;";
						}else if (this.data.LAB_RESULT.CBC[0].PLT < this.data.LAB_RESULT.CBC[1].PLT){
							output += "&darr;&nbsp;";
						}
					}
				}
				*/
				if (this.data.LAB_RESULT.CBC_CNT > 1){
					output += "<span class='anesthesia_lab_description'>PLT</span>";
					output += "<span class='anesthesia_lab_values'>";
					$.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.PLT;
						}
					});
					output += "</span><span class='anesthesia_lab_dates'>";
					$.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.DATE_TIME;
						}
					});
					output += "</span>";
				}

				output += "<div class = 'fish_bone_values'>" + this.data.LAB_RESULT.CBC[0].PLT + "</div></td></tr>" + //;v. do
				"<tr><td><span  style='font-size:20px;vertical-align:top;position:relative;top:-3px;'>|</span></td>";
				output += "<td style='font-size:11px;border-top:1px black solid;width:45px;text-align:center;";

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
				output += ">";
				/*
				if (this.data.LAB_RESULT.CBC[0].HCT_CRIT || this.data.LAB_RESULT.CBC[0].HCT_HIGH_LOW){
					if (this.data.LAB_RESULT.CBC_CNT > 1){
						if (this.data.LAB_RESULT.CBC[0].HCT > this.data.LAB_RESULT.CBC[1].HCT){
							output += "&uarr;&nbsp;";
						}else if (this.data.LAB_RESULT.CBC[0].HCT < this.data.LAB_RESULT.CBC[1].HCT){
							output += "&darr;&nbsp;";
						}
					}
				}
				*/
				if (this.data.LAB_RESULT.CBC_CNT > 1){
					output += "<span class='anesthesia_lab_description'>HCT</span>";
					output += "<span class='anesthesia_lab_values'>";
					$.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.HCT;
						}
					});
					output += "</span><span class='anesthesia_lab_dates'>";
					$.each(this.data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.DATE_TIME;
						}
					});
					output += "</span>";
				}
				output += this.data.LAB_RESULT.CBC[0].HCT + "</td>";



				output += "<td><span  style='font-size:20px;vertical-align:top;position:relative;top:-3px;'>|</span></td></tr></table>" +
					"</td><td style='font-size:11px;'>" + "<div class = 'fish_bone_values'>" + this.data.LAB_RESULT.CBC[0].DATE_TIME + "</div></td></tr>";
		}


		if (this.data.LAB_RESULT.BMP_CNT > 0){
			if (this.data.LAB_RESULT.CBC_CNT > 0){
				output += "<tr><td colspan='3' style='height:5px;'>&nbsp;</td></tr>";
			}
			output += "<tr><td colspan='2' style='width:70%;text-align:left;'>" +
				"<table cellspacing='0' cellpadding='0' style='font-size:10px;'><tr>";
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
			output += ">";
			/*
			if (this.data.LAB_RESULT.BMP[0].SODIUM_CRIT || this.data.LAB_RESULT.BMP[0].SODIUM_HIGH_LOW){
				if (this.data.LAB_RESULT.BMP_CNT > 1){
					if (this.data.LAB_RESULT.BMP[0].SODIUM > this.data.LAB_RESULT.BMP[1].SODIUM){
						output += "&uarr;&nbsp;";
					}else if (this.data.LAB_RESULT.BMP[0].SODIUM < this.data.LAB_RESULT.BMP[1].SODIUM){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (this.data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Sodium</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.SODIUM;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += this.data.LAB_RESULT.BMP[0].SODIUM + "</td>";

			output += "<td style='font-size:11px;width:45px;text-align:center;border-right:1px solid black;border-left:1px solid black;border-bottom:1px solid black;";
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
			output += ">";
			/*
			if (this.data.LAB_RESULT.BMP[0].CHLORIDE_CRIT || this.data.LAB_RESULT.BMP[0].CHLORIDE_HIGH_LOW){
				if (this.data.LAB_RESULT.BMP_CNT > 1){
					if (this.data.LAB_RESULT.BMP[0].CHLORIDE > this.data.LAB_RESULT.BMP[1].CHLORIDE){
						output += "&uarr;&nbsp;";
					}else if (this.data.LAB_RESULT.BMP[0].CHLORIDE < this.data.LAB_RESULT.BMP[1].CHLORIDE){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (this.data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Chloride</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.CHLORIDE;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += this.data.LAB_RESULT.BMP[0].CHLORIDE + "</td>";

			output += "<td style='font-size:11px;width:45px;text-align:center;border-left:1px solid black;border-bottom:1px solid black;";
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
			output += ">";
			/*
			if (this.data.LAB_RESULT.BMP[0].BUN_CRIT || this.data.LAB_RESULT.BMP[0].BUN_HIGH_LOW){
				if (this.data.LAB_RESULT.BMP_CNT > 1){
					if (this.data.LAB_RESULT.BMP[0].BUN > this.data.LAB_RESULT.BMP[1].BUN){
						output += "&uarr;&nbsp;";
					}else if (this.data.LAB_RESULT.BMP[0].BUN < this.data.LAB_RESULT.BMP[1].BUN){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (this.data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>BUN</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.BUN;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += this.data.LAB_RESULT.BMP[0].BUN + "</td>";

			output += "<td><span style='font-size:20px;position:relative;bottom:-4px;'>|</span></td>";

			output += "<td rowspan='2' style='font-size:11px;width:150px;text-align:left;"; /*push to the left v. do*/
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
			output += ">";
			/*
			if (this.data.LAB_RESULT.BMP[0].GLUCOSE_CRIT || this.data.LAB_RESULT.BMP[0].GLUCOSE_HIGH_LOW){
				if (this.data.LAB_RESULT.BMP_CNT > 1){
					if (this.data.LAB_RESULT.BMP[0].GLUCOSE > this.data.LAB_RESULT.BMP[1].GLUCOSE){
						output += "&uarr;&nbsp;";
					}else if (this.data.LAB_RESULT.BMP[0].GLUCOSE < this.data.LAB_RESULT.BMP[1].GLUCOSE){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (this.data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Glucose</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.GLUCOSE;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += "<div class = 'fish_bone_values'>" + this.data.LAB_RESULT.BMP[0].GLUCOSE + "</div></td></tr>";

			output += "<tr><td style='font-size:11px;width:45px;text-align:center;border-right:1px solid black;border-top:1px solid black;";
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
			output += ">";
			/*
			if (this.data.LAB_RESULT.BMP[0].POTASSIUM_CRIT || this.data.LAB_RESULT.BMP[0].POTASSIUM_HIGH_LOW){
				if (this.data.LAB_RESULT.BMP_CNT > 1){
					if (this.data.LAB_RESULT.BMP[0].POTASSIUM > this.data.LAB_RESULT.BMP[1].POTASSIUM){
						output += "&uarr;&nbsp;";
					}else if (this.data.LAB_RESULT.BMP[0].POTASSIUM < this.data.LAB_RESULT.BMP[1].POTASSIUM){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (this.data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Potassium</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.POTASSIUM;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += this.data.LAB_RESULT.BMP[0].POTASSIUM + "</td>";

			output += "<td style='font-size:11px;width:45px;text-align:center;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;";
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
			output += ">";
			/*
			if (this.data.LAB_RESULT.BMP[0].BICARBONATE_CRIT || this.data.LAB_RESULT.BMP[0].BICARBONATE_HIGH_LOW){
				if (this.data.LAB_RESULT.BMP_CNT > 1){
					if (this.data.LAB_RESULT.BMP[0].BICARBONATE > this.data.LAB_RESULT.BMP[1].BICARBONATE){
						output += "&uarr;&nbsp;";
					}else if (this.data.LAB_RESULT.BMP[0].BICARBONATE < this.data.LAB_RESULT.BMP[1].BICARBONATE){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (this.data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Carbon Dioxide</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.BICARBONATE;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += this.data.LAB_RESULT.BMP[0].BICARBONATE + "</td>";

			output += "<td style='font-size:11px;width:45px;text-align:center;border-left:1px solid black;border-top:1px solid black;";
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
			output += ">";
			/*
			if (this.data.LAB_RESULT.BMP[0].CREATININE_CRIT || this.data.LAB_RESULT.BMP[0].CREATININE_HIGH_LOW){
				if (this.data.LAB_RESULT.BMP_CNT > 1){
					if (this.data.LAB_RESULT.BMP[0].CREATININE > this.data.LAB_RESULT.BMP[1].CREATININE){
						output += "&uarr;&nbsp;";
					}else if (this.data.LAB_RESULT.BMP[0].CREATININE < this.data.LAB_RESULT.BMP[1].CREATININE){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (this.data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Creatinine</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.CREATININE;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(this.data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += this.data.LAB_RESULT.BMP[0].CREATININE + "</td>";

				output += "<td><span style='font-size:20px;position:relative;top:-3px;'>|</span></td></tr>";
			output += "</table>" +
			"</td><td style='font-size:11px;'><div class = 'fish_bone_values'>" + this.data.LAB_RESULT.BMP[0].DATE_TIME + "</div></td></tr>";
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

	//	showDataArea(spanName, output, false);

		/* v. do /* ==================== */

	//$.getScript('I:/winintel/static_content/mp_mvs_anesthesia/js/jquery.tooltip.min.js', function(){
	$.getScript('jquery.tooltip.min.js', function(){
		// alert("Script loaded and executed.");    // here you can use anything you defined in the loaded script



	});


	 	 	$("td.anesthesia_lab_graph").tooltip({
			delay:0,
			showURL:false,
			bodyHandler: function(){
				var val = $(this).find("span.anesthesia_lab_values").html();
				var dates = $(this).find("span.anesthesia_lab_dates").html().split(";");
				var values = val.split(";");
				var title = $(this).find("span.anesthesia_lab_description").html();
				var o = "<table><tr><td style='text-align:center;font-weight:bold;font-size:10px;'>" + title + "</td></tr><tr><td><table cellspacing='0' cellpadding='0'>";
				$.each(values, function(idx, value){
					o += "<tr style='font-size:10px;border:1px solid black;'><td>" + dates[idx] + "</td><td style='width:5px;'>&nbsp;</td><td>" + value + "</td></tr>";
				});
				o += "</table></td><td></td></tr></table>";
				return o;
			}
		});

	/* ==================== */



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
		output +=   "<table width = '100%'><tr><td class='sub-title-disp'>"+  sTitle + "</td></tr></table>"
			+  "<div style='max-height:255px;width:100%;overflow-y:scroll'>"
			+ "<table class = 'sec-content' width = 100%'>"
			+ "<tr id='tooltipper' ><td colspan = '2'><b>Found ("
			+ resCnt + ") procedure(s)</b></td></tr>"


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
				} else if (num > 20 && num < 41) {
					score = "Low";
				} else if (num > 40 && num < 61) {
					score = "Moderate";
				} else if (num > 60 && num < 81) {
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
