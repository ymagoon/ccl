function Census_Result(opt){
	/* OUTDEV, PRSNL_ID, PERSON_ID, ENC_ID, query_opt, org, patient_type, begindate, enddate */
	/* , 0, 0, 0, ^3^, 589748.0,309308.0" */
	
	var org = 0.0
	var ptype = 0.0

	var begin_date = ""
	var end_date = ""
	var	fin = ""
	if (opt == "1")
		{
			
			org = cbo_fac_a.options[cbo_fac_a.selectedIndex].value
			ptype = cbo_ptype.options[cbo_ptype.selectedIndex].value
		}
		
	if (opt == "2")
		{
			org = cbo_fac_b.options[cbo_fac_b.selectedIndex].value
			ptype = cbo_ptype2.options[cbo_ptype2.selectedIndex].value
			
			begin_date = $.datepicker.formatDate("dd/M/yy",$("#dt_start").datepicker("getDate"))
			end_date = $.datepicker.formatDate("dd/M/yy",$("#dt_end").datepicker("getDate")) 
		
		}
	if (opt == "3")
		{
			fin = document.getElementById('fin').value
			
		}

	
	var param = ""
	param += "^MINE^,"  /* OUTDEV */
	param += "$USR_Personid$, "	 /* PRSNL_ID */
	param += "0.0, "	 /* PERSON_ID */
	param +=  "^" + opt + "^,"	 /* query_opt */
	param += org + ","  /* org */
	param += ptype + ","  /* patient_type */
	param += "^" + begin_date + "^,"  /* begin date */
	param += "^" + end_date + "^,"  /* end date */
	param += "^" + fin + "^"
	

	//alert(param)
	
// Initialize the request object
var cclInfo = new XMLCclRequest();
// Get the response
cclInfo.onreadystatechange = function () {
	if (cclInfo.readyState == 4 && cclInfo.status == 200) { //if 1
		var jsonStr = cclInfo.responseText;
		var jsonObj = eval('(' + jsonStr + ')');

			// Insert the table into the patient information section;
			var ccl_length = jsonObj.TEMP.REC.length


			var sTextCCL = ""
		
			sTextCCL += "<table cellpadding='0' cellspacing='0' border='0' class='display' id='tbl_census' width='100%'>"
	
			sTextCCL += "<thead><tr><th>Patient Name</th><th>Patient Type</th><th>FIN</th>"
			sTextCCL += "<th>DOB</th>"
			sTextCCL += "<th>Location</th>"
			sTextCCL += "<th>Room-Bed</th>"
			sTextCCL += "<<th>Sex</th><th>Registered DT</th>";
			sTextCCL += "<th>Discharged DT</th><th>Insurance</th>" 
			sTextCCL += "</tr></thead>"
			
					for(var i=0; i<ccl_length; i++)
			{	     ;//begin for i
			
					if (i%2 ==1)
					{
					
					sTextCCL += "<tr class='odd gradeA'>";
					}
					else
					{
					sTextCCL += "<tr class='even gradeA'>";
					}
					
					
					var patient_section = "<span><a href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID="  
								  + jsonObj.TEMP.REC[i].PERSON_ID + " /ENCNTRID=" + jsonObj.TEMP.REC[i].ENC_ID +"\");return false;'>" 
								  + jsonObj.TEMP.REC[i].PATIENT_NAME + "</a></span>"
						
					sTextCCL += "<td>"  + patient_section + "</td>";
					sTextCCL += "<td>"  +  jsonObj.TEMP.REC[i].PATIENT_TYPE + "</td>";
					/*sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].PATIENT_NAME + "</td>";*/
					sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].FIN + "</td>";
					sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].DOB  + "</td>";
					sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].NU + "</td>";
					sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].ROOM_BED  + "</td>";
					sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].GENDER  + "</td>";
					sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].REG_DT  + "</td>";
					sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].DISC_DT  + "</td>";
					sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].INSURANCE  + "</td>";
					sTextCCL += "</tr>";
			
			}; //end for i
			sTextCCL += "<tbody>"
				
					
			sTextCCL += "</tbody></table>"
			
			document.getElementById('census_content').innerHTML  =  sTextCCL;
			
			document.getElementById('hideshow_accordion').innerHTML = "<a href='#' id='btnhideShowAccordion' class='ui-state-default ui-corner\\-\all'>Hide/Show Inputs</a>"
			$( "#btnhideShowAccordion" ).click(function() {   
				   hideShowAccordion();     
				   return false;   
				    	 });
			
			
			
			$(document).ready(function() {
			
			/*------------- initilizing the table for data table------------------ */
					$('#tbl_census').dataTable( {
						"iDisplayLength": 50, 
					/*	"sScrollY": 480, */
						"bJQueryUI": true, 
						/*	"sDom": '<"H"Tfr>t<"F"ip>',	*/
						"sPaginationType": "full_numbers",
							"oLanguage": {       
						       "sLengthMenu": 'Display <select>'+         
						        '<option value="10">10</option>'+     
						       '<option value="20">20</option>'+     
						        '<option value="30">30</option>'+  
						         '<option value="40">40</option>'+              
						       '<option value="50">50</option>'+                 
						       '<option value="100">100</option>'+             
						       '<option value="9999">All</option>'+                
						        '</select> records'
						        	} 			
					} );
					
					
	

				
			} );
		}   //if 1
		

} //

/*** finding the look back days **-----------* */
var nLookBackDays =  $("#cboLookBack").val() /* default nlook back day */
$("#cboLookBack").change(function() { 
	nLookBackDays = $("#cboLookBack").val()
	history.go(0); /*reload the page with the options selected */
	
	/* window.location.reload() //reload page w/ no options save */
});
/*===========================================*/

//  Call the ccl progam and send the parameter string
	cclInfo.open('GET', "bc_mp_cencus_restricted_list"); 
/*	cclInfo.send("^MINE^, value($PAT_Personid$), ^14, D^");  */
	//;cclInfo.send("^MINE^, 0, 0, 0, ^3^, 589748.0,309308.0");
	cclInfo.send(param)
/*cclInfo.send("^MINE^, 7790716.00") */
//;OUTDEV, query_opt, org, patient_type, begindate, enddate
	return;
} //

function hideShowAccordion() {
 	 $( "#accordion" ).toggle("blind")
	  	 //	 $( "#accordion" ).toggle("highlight")
				}
