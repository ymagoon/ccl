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
	var sTitle = "Custom Labs - Selected Visit"
	
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

				output += "<div class = 'Fish_bone_values'>"  + this.data.LAB_RESULT.CBC[0].WBC + "</a></div></td>"; //;v. do
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
				
				output += "<div class = 'Fish_bone_values'>" + this.data.LAB_RESULT.CBC[0].PLT + "</div></td></tr>" + //;v. do
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
					"</td><td style='font-size:11px;'>" + "<div class = 'Fish_bone_values'>" + this.data.LAB_RESULT.CBC[0].DATE_TIME + "</div></td></tr>";
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
			output += "<div class = 'Fish_bone_values'>" + this.data.LAB_RESULT.BMP[0].GLUCOSE + "</div></td></tr>";

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
			"</td><td style='font-size:11px;'><div class = 'Fish_bone_values'>" + this.data.LAB_RESULT.BMP[0].DATE_TIME + "</div></td></tr>";
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

	$.getScript('I:/WININTEL/static_content/mp_mvs_anesthesia/js/jquery.tooltip.min.js', function(){     
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
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Surgeon</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + surgeon + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Anes Type</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + anes_type + "</td>"
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
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Scheduled Surgeon</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + surgeon + "</td>"
				+ "</tr>";
				
				output += "<tr>"
				+ "<td width = '30.0%' align = 'left'  class = 'baycare_sch_surg_name'><b>Anes Type</b> </td>"
				+ "<td width = '70.0%' align = 'left' class = 'baycare_sch_surg_date'>" + anes_type + "</td>"
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

MPage.namespace('cerner');

/* Person Registries Summary source code */
cerner.personRegistriesSummary = function () {};
cerner.personRegistriesSummary.prototype = new MPage.Component();
cerner.personRegistriesSummary.prototype.constructor = MPage.Component;
cerner.personRegistriesSummary.prototype.base = MPage.Component.prototype;
cerner.personRegistriesSummary.prototype.name = 'cerner.personRegistriesSummary';
cerner.personRegistriesSummary.prototype.cclProgram = 'HI_ALIAS_LOOKUP_HTTP_PROXY_GET';
cerner.personRegistriesSummary.prototype.init = function () {
  // Set the params for the HI_ALIAS_LOOKUP_HTTP_PROXY_GET script
  this.cclParams = [
                     'mine',
                     cerner.personRegistriesCommon.getLookupKey(this),
                     'HI_REGISTRIES_PERSON_REGISTRIES',
                     'JSON',
                     this.getProperty('personId'),
                     cerner.personRegistriesCommon.getAliasType(this),
                     cerner.personRegistriesCommon.getAliasPoolCode(this),
                     this.getProperty('encounterId'),
                     this.getProperty('userId'),
                     cerner.personRegistriesCommon.getTestURI(this)
                   ];
  this.data = '';
};
cerner.personRegistriesSummary.prototype.render = function () {
  new cerner.personRegistriesCommon('summary', this);
};

/* Person Registries Workflow source code */
cerner.personRegistriesWorkflow = function () {};
cerner.personRegistriesWorkflow.prototype = new MPage.Component();
cerner.personRegistriesWorkflow.prototype.constructor = MPage.Component;
cerner.personRegistriesWorkflow.prototype.base = MPage.Component.prototype;
cerner.personRegistriesWorkflow.prototype.name = 'cerner.personRegistriesWorkflow';
cerner.personRegistriesWorkflow.prototype.cclProgram = 'HI_ALIAS_LOOKUP_HTTP_PROXY_GET';
cerner.personRegistriesWorkflow.prototype.init = function () {
  // Set the params for the HI_ALIAS_LOOKUP_HTTP_PROXY_GET script
  this.cclParams = [
                     'mine',
                     cerner.personRegistriesCommon.getLookupKey(this),
                     'HI_REGISTRIES_PERSON_REGISTRIES',
                     'JSON',
                     this.getProperty('personId'),
                     cerner.personRegistriesCommon.getAliasType(this),
                     cerner.personRegistriesCommon.getAliasPoolCode(this),
                     this.getProperty('encounterId'),
                     this.getProperty('userId'),
                     cerner.personRegistriesCommon.getTestURI(this)
                   ];
  this.data = '';
};
cerner.personRegistriesWorkflow.prototype.render = function () {
  new cerner.personRegistriesCommon('workflow', this);
};

/*
 * Common code shared by person registries components.
 *
 * @param {String} componentType - The string to indicate the type of current component.
 * @param {Selector} component - The selector for current component.
 *
 */
cerner.personRegistriesCommon = function (componentType, component) {

  /*
   * buildQualityScore - Builds the layout to display quality score.
   *
   * @param {String} score - The string for quality score.
   *
   * @return Layout of quality score section.
   */
  function buildQualityScore(score) {
    // Build the markup for the quality score header
    var qualityScore = '--';

    if (score !== undefined && score !== null) {
      qualityScore = score;
    }

    return '<div class="person-registries-component-score ' +
              componentType +
              ' sub-title-disp">Quality Score: <span class="bold-text">' +
              qualityScore +
           '</span></div>';
  }

  /*
   * buildRegistryEventBody - Builds layout of event group with the required info (performed date, providers).
   *
   * @param {Object} event - The event object.
   *
   * @return Layout for the body of the event group.
   */
  function buildRegistryEventBody(event) {
    var body,
        performedDate = dateFormatter(event.date),
        providerNames = getProviderNames(event.responsible_providers);

    body = '<div class="event-group">' +
            '<div class="sub-sec-hd">' +
              '<span class="sub-sec-title">' +
                performedDate + ' - Event performed by ' + providerNames +
              '</span>' +
            '</div>';

    // Build the event content when there is at least one measure for this event.
    if (event.measures !== undefined && event.measures !== null && event.measures.length > 0) {
      body += '<div class="event-content">';

      for (var i = 0; i < event.measures.length; i++) {
        var measure = event.measures[i];
        body += buildRegistryListBody(measure);
      }

      body += '</div>';
    }

    body += '</div>';

    return body;
  }

  /*
   * buildRegistryListBody - Builds layout of measure row with the required info (measure name, measure status...).
   *
   * @param {Object} measure - The measure object.
   *
   * @return Layout for the body of the registry list.
   */
  function buildRegistryListBody(measure) {
    // Build the markup for each measure.
    var nameDisplay = measure.name,
        supportingFacts = measure.supporting_facts,
        measureClass = getMeasureClass(measure.outcome),
        measureStatus = getMeasureStatus(measure.outcome),
        measureIconClass = getMeasureIconClass(measure.outcome, measure.measure_due),
        date;

    // Find the most recent non-null date from supporting facts
    if (supportingFacts.length > 0) {
      for (var i = 0; i < supportingFacts.length; i++) {
        date = supportingFacts[i].date;
        break;
      }
    }

    return '<dl class="sr-info ' + measureClass +'-outcome">' +
              '<dd class="sr-name">' +
                '<div class="wrapper">' +
                  '<div class="' + measureIconClass + '" title="' + measureStatus +'"></div>' +
                  '<span title="' + nameDisplay + '">' + nameDisplay + '</span>' +
                '</div>' +
                '<div class="icon-info-sprite" data-id=' + measure.fqn + '></div>' +
              '</dd>' +
              '<dd class="sr-stat">' +
                displayDueDate(measure.due_date, measure.outcome) +
              '</dd>' +
              '<dd class="sr-stat">' + measure.value_unit + '</dd>' +
              '<dd class="sr-within pull-right">' + dateFormatter(date) + '</dd>' +
            '</dl>';
  }

  /*
   * buildRegistryListHeader - Builds the layout for the header of registry list with required info.
   *
   * @param {Object} program - The program object.
   *
   * @return Layout for the header of the registry list.
   */
  function buildRegistryListHeader(program) {
    return '<h3 class="sub-sec-hd">' +
              '<span class="sub-sec-hd-tgl">-</span> ' +
              '<span class="sub-sec-title bold-text">' + program.name + '</span> ' +
              '<div class="sub-sec-title met-count">' +
                '(' + program.met_measure_count + ' out of ' + program.total_measure_count + ' met)' +
                '<div class="icon-info-sprite" data-type="Registry" data-id=' + program.id + '></div>' +
              '</div>' +
           '</h3>';
  }

  /*
   * buildRegistryList - Builds the layout for the entire registry list with header and body.
   *
   * @param {Object} program - The program object.
   *
   * @return Layout for the list of registries.
   */
  function buildRegistryList(program) {
    var list,
        i;

    list = '<div class="sub-sec">' +
              buildRegistryListHeader(program) +
           '<div class="sub-sec-content">';

    // Build the body part for standard measures
    if (program.measures) {
      for (i = 0; i < program.measures.length; i++) {
        var measure = program.measures[i];
        list += buildRegistryListBody(measure);
      }
    }

    // Build the body part for event_based measures
    if (program.events) {
      for (i = 0; i < program.events.length; i++) {
        var event = program.events[i];
        list += buildRegistryEventBody(event);
      }
    }

    list += '</div></div>';
    return list;
  }

  /*
   * renderPersonRegistriesComponent - Renders the template for the registry component.
   *
   * @param {Array} programs - Array of program objects.
   *
   * @return Template for registry component with detailed registry data.
   */
  function renderPersonRegistriesComponent(programs) {
    var output = '';

    for (var i in programs) {
      if (programs.hasOwnProperty(i)) {
        output += buildRegistryList(programs[i]);
      }
    }

    return output;
  }

  /*
   * buildSupportingFactsDialog - Renders the modal dialog for supporting facts data.
   *
   * @param {Object}  programs  - The programs object.
   * @param {String}  type - The type of the instance the supporting facts belongs to.
   *                         It could be 'Registry' or undefined.
   * @param {String}  supportingId - The string to identify a certain program/measure.
   */
  function buildSupportingFactsDialog(programs, type, supportingId) {
    var supportingFacts,
        modalHeaderTitle,
        noSupportingFactsMsg,
        tableContent,
        i;

    if (type === 'Registry') {
      for (i = 0; i < programs.length; i++) {
        if (programs[i].id === supportingId) {
          modalHeaderTitle = programs[i].name + ' Registry Supporting Facts';
          supportingFacts = programs[i].supporting_facts;
        }
      }
      noSupportingFactsMsg = 'No registry supporting facts found.';
    } else {
      // Get the supporting facts for either standard measures or event-based measures.
      for (i = 0; i < programs.length; i++) {
        var measures = getMeasures(programs[i]);

        // Retrieve an array of supporting facts for one particular measure
        for (var j = 0; j < measures.length; j++) {
          if (measures[j].fqn === supportingId) {
            var name = measures[j].name;
            modalHeaderTitle = name + ' Supporting Facts';

            supportingFacts = measures[j].supporting_facts;
            break;
          }
        }
      }
      noSupportingFactsMsg = 'No data available.';
    }

    if (supportingFacts && supportingFacts.length > 0) {
      var tableRows = '';

      for (i = 0; i < supportingFacts.length; i++) {
        var supportingFact = supportingFacts[i],
            factsName = supportingFact.name || '',
            factsCode = supportingFact.formatted_code || '',
            factsSource = supportingFact.formatted_source || '',
            factsDateTime = dateFormatter(supportingFact.date);

        tableRows += '<tr class="supporting-facts-content">' +
          '<td class="fact-description">' +
            '<div>' +
              factsName +
            '</div>' +
            '<div class="meta">' +
              factsCode +
            '</div>' +
            '<div class="meta">' +
              factsSource +
            '</div>' +
          '</td>' +
          '<td>' +
            '<div class="pull-right meta">' +
              factsDateTime +
            '</div>' +
          '</td>' +
          '</tr>';
      }

      tableContent = '<table class="supporting-facts">' +
          '<tbody>' + tableRows + '</tbody>' +
          '</table>';
    } else {
      tableContent = '<p>' + noSupportingFactsMsg + '</p>';
    }

    var supportDataModal = new ModalDialog('supportDataModal').setHeaderTitle(modalHeaderTitle);
    supportDataModal.setIsBodySizeFixed(false);
    supportDataModal.setLeftMarginPercentage(35).setRightMarginPercentage(35).setTopMarginPercentage(20);

    supportDataModal.setBodyDataFunction(function (modalObj) {
      modalObj.setBodyHTML(tableContent);
    });

    var closeButton = new ModalButton('closeButton');
    closeButton.setText('Close').setCloseOnClick(true);
    supportDataModal.addFooterButton(closeButton);

    MP_ModalDialog.updateModalDialogObject(supportDataModal);
    MP_ModalDialog.showModalDialog('supportDataModal');
  }

  /*
   * getMeasures - Retrieve either event-based measures or standard measures from one particular program.
   *
   * @param {Object} program - The program object.
   *
   * @return An array of measures.
   */
  function getMeasures(program) {
    var measures = [],
        rawMeasures = [];

    if (program.measures) {
      // Standard measures
      measures = program.measures;
    } else if (program.events) {
      // Retrieve the arrays of measures from events.
      for (var j = 0; j < program.events.length; j++) {
        var eventBasedMeasures = program.events[j].measures;

        if (eventBasedMeasures !== null && eventBasedMeasures.length > 0) {
          rawMeasures.push(eventBasedMeasures);  // Build an array which contains multiple arrays of measures.
        }
      }

      // Flatten the nested array
      measures = measures.concat.apply(measures, rawMeasures);
    }

    return measures;
  }

  /*
   * getProviderNames - Retrieve the names of the providers who performed the event.
   *
   * @param {Array} providers - Array of provider objects.
   *
   * @return String for multiple providers' names separated by comma.
   */
  function getProviderNames(providers) {
    var providerNames = [];

    if (providers !== undefined && providers !== null && providers.length > 0) {
      for (var i = 0; i < providers.length; i++) {
        var name = providers[i].full_name;
        if (name !== null && name !== '') {
          providerNames.push(name);
        }
      }
    }

    return providerNames.join(', ');
  }

  /*
   * dateFormatter - Parses the datetime and converts to short date format.
   *
   * @param {String} date - The datetime string.
   *
   * @return The Date object.
   *         If the input date is not a date which has complete year, month and day, returns whatever got from API.
   *         If the input is undefined or null, returns ''.
   */
  function dateFormatter(date) {
    if (date !== undefined && date !== null) {
      try{
        return $.datepicker.parseDate('yy-mm-dd', date.split('T')[0]).format('mediumDate');
      }
      catch(error){
        return date;
      }
    } else {
      return '--';
    }
  }

  /*
   * getMeasureClass - Determine the type of measure class based on outcome status.
   *
   * @param {String} outcome - The string for outcome status which can be 'EXCLUDED',
   *                           'ACHIEVED', 'MISSING_DATA' or 'NOT_ACHIEVED'.
   *
   * @return The string for measure class.
   */
  function getMeasureClass(outcome) {
    switch (outcome) {
      case 'EXCLUDED':
        return 'excluded';
      case 'ACHIEVED':
        return 'positive';
      case 'MISSING_DATA':
        return 'missing-data';
      case 'NOT_ACHIEVED':
        return 'negative';
    }
  }

  /*
   * getMeasureStatus - Determine the type of measure status based on outcome status.
   *
   * @param {String} outcome - The string for outcome status which can be 'EXCLUDED',
   *                           'ACHIEVED', 'MISSING_DATA' or 'NOT_ACHIEVED'.
   *
   * @return The string for measure status.
   */
  function getMeasureStatus(outcome) {
    switch (outcome) {
      case 'EXCLUDED':
        return 'Excluded from Measure';
      case 'ACHIEVED':
        return 'Achieved';
      case 'MISSING_DATA':
        return 'Missing Data';
      case 'NOT_ACHIEVED':
        return 'Not Achieved';
    }
  }

  /*
   * displayDueDate - Build the layout for displaying due date based on
   *                  outcome status and the existence of the due date.
   *
   * @param {String} dueDate      - The string of the due date.
   * @param {String} outcome      - The string for outcome status which can be 'EXCLUDED',
   *                                'ACHIEVED', 'MISSING_DATA' or 'NOT_ACHIEVED'.
   *
   * @return Layout for displaying due date. Display '--' when no due date or the measure is excluded.
   */
  function displayDueDate(dueDate, outcome) {
    if (dueDate && outcome !== 'EXCLUDED') {
      var dueDateIcon = outcome === 'ACHIEVED' ? 'icon-time-positive-sprite' : 'icon-time-negative-sprite';

      return '<div class="wrapper">' +
               '<div class="' + dueDateIcon + '"></div>' +
               '<span>' + dateFormatter(dueDate) + '</span>' +
             '</div>';
    } else {
      return '--';
    }
  }

  /*
   * getMeasureIconClass - Determine the outcome icon class for the measure row based on outcome status and due date.
   *
   * @param {String} outcome     - The string for outcome status which can be 'EXCLUDED',
   *                               'ACHIEVED', 'MISSING_DATA' or 'NOT_ACHIEVED'.
   * @param {Boolean} measureDue - The boolean indicating whether the measure is due which
   *                               can be true when measure is due, false otherwise.
   *
   * @return The string of the outcome icon class.
   */
  function getMeasureIconClass(outcome, measureDue) {
    switch (outcome) {
      case 'EXCLUDED':
        return 'icon-excluded-sprite';
      case 'ACHIEVED':
        return 'icon-positive-sprite';
      case 'MISSING_DATA':
        return measureDue ? 'icon-time-negative-sprite' : 'icon-missing-data-sprite';
      case 'NOT_ACHIEVED':
        return measureDue ? 'icon-time-negative-sprite' : 'icon-negative-sprite';
      default:
        return null;
    }
  }

  /*
   * initCollapsibleSections - Collapses the newly created sections and adds a click event handler to perform
   *                           the expand and collapse actions. This function should only be called after
   *                           the sections have been added to the DOM.
   */
  function initCollapsibleSections() {
    // Section expand/collapse
    $('.person-registries-component.' + componentType + ' .sub-sec').addClass('closed'); // Default to closed.
    $('.person-registries-component.' + componentType + ' .sub-sec-hd-tgl').on('click', function () {
      $(this).closest('.sub-sec').toggleClass('closed');
    });
  }

  /*
   * initSupportingFacts - Adds a click event handler to each supporting facts icon to launch the
   *                       supporting facts dialog. This function should only be called after the
   *                       sections have been added to the DOM.
   *
   * @param {Object} programs - The programs object.
   */
  function initSupportingFacts(programs) {
    // Build modal dialog when clicking icon-info-sprite
    $('.person-registries-component.' + componentType + ' .icon-info-sprite').on('click', function () {
      var $infoIcon = $(this);

      buildSupportingFactsDialog(programs, $infoIcon.data('type'), $infoIcon.data('id'));
    });
  }

  /*
   * createComponent - Handles the service reply and inititates the markup construction.
   */
  function createComponent() {
    var targetDiv = component.getTarget(),
        success   = component.data.PROXYREPLY.TRANSACTIONSTATUS.SUCCESSIND,
        programs,
        response,
        status    = 0;

    if (success === 1) {
      status = component.data.PROXYREPLY.HTTPREPLY.STATUS;
    }

    // Display component body
    var html = '<div class="sub-sec-hd exception-msg">Registry record not found.</div>',
        disclaimerBox = '<div class="person-registries-component-info ' + componentType + ' sub-sec-hd">' +
                        '<span class="sub-sec-title">' +
                        'Registries information is updated regularly but may not reflect the latest data available.' +
                        '</span>' +
                        '</div>';  // Disclaimer text box

    targetDiv.innerHTML='<div class="person-registries-component ' + componentType +
      ' content-body">Placeholder</div>' + disclaimerBox;

    // Services error handling
    switch (status) {
    case 200:
      response = JSON.parse(component.data.PROXYREPLY.HTTPREPLY.BODY);
      programs = response.programs;

      if (programs === undefined || programs === null || programs.length === 0) {
        html = '<div class="sub-sec-hd exception-msg">This person does not qualify for any registries.</div>';
      } else {
        // Display registries count
        component.setProperty('headerSubTitle', '(' + programs.length + ')');

        // Display quality score
        $('.person-registries-component.' + componentType).parent().before(buildQualityScore(response.quality_score));

        // Display registries detail
        html = renderPersonRegistriesComponent(programs);
      }
      break;
    case 401:
    case 403:
      html = '<div class="sub-sec-hd exception-msg">Access denied.</div>';
      break;
    case 400:
      html = '<div class="sub-sec-hd exception-msg">Bad request.</div>';
      break;
    case 404:
      break;
    default:
      html = '<div class="sub-sec-hd exception-msg">A system error occurred.</div>';
    }

    // Insert the generated markup into the page.
    $('.person-registries-component.' + componentType).html(html);

    if (status === 200) {
      initCollapsibleSections();
      initSupportingFacts(programs);
    }
  }

  // Begin building the component.
  createComponent();
};

// Note: component.getOption will return the STRING 'undefined' if the option is not found, not the type undefined
cerner.personRegistriesCommon.getTestURI = function(component) {
  return component.getOption('testURI') === 'undefined' ? '' : component.getOption('testURI');
};
cerner.personRegistriesCommon.getLookupKey = function(component) {
  return component.getOption('lookupKey') === 'undefined' ?
   'HI_RECORD_PERSON_EMPI_LOOKUP' : component.getOption('lookupKey');
};
cerner.personRegistriesCommon.getAliasPoolCode = function(component) {
  return component.getOption('aliasPoolCode') === 'undefined' ? '' : component.getOption('aliasPoolCode');
};
cerner.personRegistriesCommon.getAliasType = function(component) {
  return component.getOption('aliasType') === 'undefined' ? '' : component.getOption('aliasType');
};
