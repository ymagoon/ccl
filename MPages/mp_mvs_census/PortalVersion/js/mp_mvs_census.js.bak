var special_counter = 0;
var last_encounter = 0;
var timeout_id = -1;

$(document).ready(function(){
	loadBaycareCensus(0,0,0,false,false,0);
});

function PowerPlan_Orders(id, enc, fname) {
	
	
	
// Initialize the request object
var cclInfo = new XMLCclRequest();

cclInfo.open('GET', "bc_mp_census_powerplan");
cclInfo.send("^MINE^," + enc );

// Get the response
cclInfo.onreadystatechange = function () {
	
	var sTextCCL  = "<div class = 'pop_header'>PowerPlan Orders Details | " + fname  + "</div><div class = 'pop_container'>";
	if (cclInfo.readyState == 4 && cclInfo.status == 200) { //if 1
		var jsonStr = cclInfo.responseText;
		var jsonObj = eval('(' + jsonStr + ')');

			// Insert the table into the patient information section;
			var ccl_length = jsonObj.TEMP.REC.length

			
			
			sTextCCL += "<table class = 'gridtable'><tr><th>PowerPlan Name</th><th>Order DT</th><th>PowerPlan State</th></tr>"
				
		
			for(var i=0; i<ccl_length; i++)
				
			{	
				var td_type = "<td>"
				if (jsonObj.TEMP.REC[i].ORDER_STATUS == 'Planned')
				{
					td_type = "<td class = 'gridtable_planned'>"
				}
				sTextCCL += "<tr class = 'header_row_one'>" + td_type  + jsonObj.TEMP.REC[i].ORDER_NAME + "</td>"
				sTextCCL +=  td_type + jsonObj.TEMP.REC[i].ORDER_DT + "</td>"
				sTextCCL +=  td_type + jsonObj.TEMP.REC[i].ORDER_STATUS +  "</td>"
				sTextCCL += "</tr>"
				
				
			}
			
				sTextCCL += "</table>" //;headd container
		}   //if 1	
		/* callling the popup */
		
	
			var the_id = "a#" + id;
		/*	$(the_id).click(function(e){
				modal.open({content: sTextCCL});
				e.preventDefault();		
				});
			*/
				sTextCCL +="</div>";
				showModal(the_id, sTextCCL);
	} //
	

} //end popup					
					
function showModal(the_id, sText)
{		
		modal.open({content: sText});
;		$(the_id).click(function(e){
;				modal.open({content: sText});
;				e.preventDefault();		
;		 });
		
}

function generateBaycareCensusHeader(){
	var output = "<tr class='header_row_one'>"+
      "<th colspan='2'>Location</th>"+
      "<th colspan='6'>Patient Demographics</th>"+
      "<th colspan='6'>Physician</th>"+
      "</tr>"+
      "<tr class='header_row_two'>"+
      "<th style='width:65px;'>Location</th>"+
      "<th style='width:55px;'>Room<br />Bed</th>"+
      "<th style='width:180px;'>Pt Name</th>"+
      "<th style='width:40px;'>&nbsp;</th>" +
      "<th style='width:70px;'>DOB</th>"+
      "<th style='width:45px;'>Sex</th>"+
      "<th style='width:110px;'>Admit<br />Date-Time</th>"+
      "<th style='width:115px;' class='discharge_column'>Discharge<br />Date-Time</th>"+
      "<th style='width:130px;'>Attending<br />Physician</th>"+
//      "<th style='width:143px;'>Physician<br />Relationship</th>"+
      "<th style='width:125px;'>Physician<br />Service</th>"+
      "<th style='width:125px;'>Insurance</th><th style='width:55px;'>PP Ind</th><th style='width:55px;'>Portal</th>"+
      "</tr>";
    if ($("#view_selection").val() == "option2"){
		output = "<tr class='header_row_one'>"+
	      "<th colspan='5'>Physician</th>"+
	      "<th colspan='6'>Patient Demographics</th>"+
	      "<th colspan='2'>Location</th>"+
	      "</tr>"+
	      "<tr class='header_row_two'>"+
	      "<th style='width:130px;'>Attending<br />Physician</th>"+
//	      "<th style='width:143px;'>Physician<br />Relationship</th>"+
	      "<th style='width:125px;'>Physician<br />Service</th>"+
	      "<th>Insurance</th>"+
	      "<th style='width:180px;'>Pt Name</th>"+
	      "<th style='width:40px;'>&nbsp;</th>" +
	      "<th style='width:70px;'>DOB</th>"+
	      "<th style='width:45px;'>Sex</th>"+
	      "<th style='width:110px;'>Admit<br />Date-Time</th>"+
	      "<th style='width:115px;' class='discharge_column'>Discharge<br />Date-Time</th>"+
	      "<th style='width:65px;'>Location</th>"+
	      "<th style='width:55px;'>Room<br />Bed</th><th>PP Ind</th><th>Portal</th>"+
	      "</tr>";
	}
	$("#census_table thead").html(output);
/*
	if ($("#show_discharged").val() == "-1"){
		$("th.discharge_column").css("display","none");
	}else{
		$("th.discharge_column").css("display","block");
	}
*/
	
	$("#census_table").addClass("tablesorter");
	$("#census_table").tablesorter(
		{
			headers: { 
            	0: { sorter: false },
            	1: { sorter: false },
            	2: { sorter: false },
            	6: { sorter: false }
            }
    	});
	$("#census_table").bind("sortStart", function(){
		$("tr.patient_details_row").remove();
	});
	$("#census_table").bind("sortEnd", function(){
		$("tr.patient_row:visible:odd").css("background-color","#E0E0E0");
		$("tr.patient_row:visible:even").css("background-color","white");
	});
	$("#view_selection").change(function(){
		$(this).blur();
		if (timeout_id){
			clearTimeout(timeout_id);
		}
		timeout_id = setTimeout(function(){
			loadBaycareCensus($("#facility_selection").val(),
									$("#unit_selection").val(), //0,
									$("#phys_group_selection").val(),
									$("#show_discharged").val(),false,
									$("#physician_selection").val(), false,
									($("#include_outpatient").val()=="YES"?true:false));
		},1);
	});
	$("#show_discharged").change(function(){
		$(this).blur();
/*
		if ($("#show_discharged").val() == "-1"){
			$("th.discharge_column").css("display","none");
		}else{
			$("th.discharge_column").css("display","block");
		}
*/
		if (timeout_id){
			clearTimeout(timeout_id);
		}
		timeout_id = setTimeout(function(){
			loadBaycareCensus($("#facility_selection").val(),
									$("#unit_selection").val(), //0,
									$("#phys_group_selection").val(),
									$("#show_discharged").val(),false,
									$("#physician_selection").val(),
									($("#include_outpatient").val()=="YES"?true:false),false);
		},1);
	});
	$("#refresh_census").click(function(){
		if (timeout_id){
			clearTimeout(timeout_id);
		}
		timeout_id = setTimeout(function(){
			loadBaycareCensus($("#facility_selection").val(),
									$("#unit_selection").val(), //0,
									$("#phys_group_selection").val(),
									$("#show_discharged").val(),false,
									$("#physician_selection").val(),
									($("#include_outpatient").val()=="YES"?true:false),false);
		},1);
	});
	$("#load_census_data").css("cursor","pointer");
	$("#load_census_data").click(function(){
		if (timeout_id){
			clearTimeout(timeout_id);
		}
		timeout_id = setTimeout(function(){
			loadBaycareCensus($("#facility_selection").val(),
									$("#unit_selection").val(), //0,
									$("#phys_group_selection").val(),
									$("#show_discharged").val(),false,
									$("#physician_selection").val(),
									($("#include_outpatient").val()=="YES"?true:false),true);
		},1);
	});
}
function loadBaycareCensus(fac_cd, loc_cd, phys_gr_cd, show_discharge,debug, phys_cd, show_outpatient, load_data,
	start_unit, start_room, start_bed, start_last_initial)
{
	var selected_physician_group = "-1";
	var error_found = false;
	generateBaycareCensusHeader();
	$("#unit_selection").css("background-color","");
	$("#physician_selection").css("background-color","");
	$("#phys_group_selection").css("background-color","");
	if (load_data){
		if (loc_cd < 1 && phys_cd < 1 && phys_gr_cd < 1){
			load_data = false;
			$("#census_table tbody").html("<tr><td colspan='100%' style='font-size:2.0em;color:red;'>Please select one of the filters above.</td></tr>");
			$("#census_table").trigger("update");
			error_found = true;
			$("#unit_selection").css("background-color","yellow");
			$("#physician_selection").css("background-color","yellow");
			$("#phys_group_selection").css("background-color","yellow");
		}
	}
	
			if (load_data){
	if (phys_cd == null){
			load_data = false;
			error_found = true;
			$("#census_table tbody").html("<tr><td  colspan='100%' style='font-size:2.0em;color:red;'>No Data Found.</td></tr>");

	}
	}
	
	
	var params = $MP.options.organizer_params;
	params += "," + fac_cd;
	params += "," + loc_cd;
	
	params += "," + show_discharge;
	if (load_data)
		params += ",1";
	else
		params += ",0";
		
	params += "," + phys_cd;
	params += "," + phys_gr_cd;
	var incremental_load = false;
	if (start_unit){
		incremental_load = true;
		params += ",^" + start_unit + "^";
		if (start_room){
			params += ",^" + start_room + "^";
		}else{
			params += ",^^";
		}
		if (start_last_initial){
			params += ",^" + start_last_initial + "^";
		}else{
			params += ",^^";
		}
	}else{
		start_unit = "";
		start_room = "";
		start_bed = -1;
		params += ",^^,^^,^^";
	}
	
	if (show_outpatient){
		params += ",1";
	}else{
		params += ",0";
	}
	
//		if (load_data)	alert(params);
//	if (phys_cd > 0 && load_data)
//		debug = 1;

	if (!incremental_load && !error_found){
		$("#census_table tbody").html("<tr><td colspan='100%'>Loading Selected Data...</td></tr>");
		$("#census_table").trigger("update");
	}

//	alert(params);
	$MP.getJSON("bc_mp_mvs_1", function(data){
		if (!incremental_load){
			if (!error_found){
				$("#census_table tbody").html("<tr><td colspan='100%'></td></tr>");
			}
			if (data.CENSUS.FACILITY_CNT_I > 0){
				var facility_list = "<option value='-1'>Select Facility</option>";
				$.each(data.CENSUS.FACILITY, function(idx, facility){
					facility_list += "<option value='" + facility.LOCATION_CD_F + "'" +
						(fac_cd == facility.LOCATION_CD_F?" selected":"") + ">" +
						facility.DISPLAY_VC + "</option>";
				});
				$("#facility_selection").html(facility_list);
				$("#facility_selection").unbind("change");
				$("#facility_selection").change(function(){
					$(this).blur();
					$("#unit_selection").val("-1");
					if (timeout_id){
						clearTimeout(timeout_id);
					}
					timeout_id = setTimeout(function(){
						loadBaycareCensus($("#facility_selection").val(),0,0,$("#show_discharged").val(),false,0,false);
					},1);
				});
			}
			if (data.CENSUS.NURSE_UNIT_CNT_I > 0){
				var nurse_unit_list = "<option value='-1'>Select Nurse Unit</option>";
				$.each(data.CENSUS.NURSE_UNIT, function(idx, nurse_unit){
					nurse_unit_list += "<option value='" + nurse_unit.LOCATION_CD_F + "'" + 
						(loc_cd == nurse_unit.LOCATION_CD_F?" selected":"") + ">" +
						nurse_unit.DISPLAY_VC + "</option>";
				});
				nurse_unit_list += "<option value='999999'" +
					(loc_cd == 999999?" selected":"") + ">All Units**</option>";
				$("#unit_selection").html(nurse_unit_list);
				$("#unit_selection").unbind("change");
				$("#unit_selection").change(function(){
					$(this).blur();
					if (timeout_id){
						clearTimeout(timeout_id);
					}
					timeout_id = setTimeout(function(){
						loadBaycareCensus($("#facility_selection").val(),
										$("#unit_selection").val(),0,$("#show_discharged").val(),false,0,false);
					},1);
				});
				$("#unit_selection").removeAttr('disabled');
			}else{
				$("#unit_selection").attr("disabled","true");
			}
			if (phys_cd == null || phys_cd < 1){
				$("#physician_selection").html("");
				$("#physician_selection").attr("disabled","true");
				if (data.CENSUS.PHYSICIAN_CNT_I > 0){
					var physician_list = "<option value='-1'>Select Physician To Filter</option>";
					$.each(data.CENSUS.PHYSICIAN, function(idx, physician){
						physician_list += "<option value='" + physician.PRSNL_ID + "'>" +
							physician.PHYSICIAN_NAME + "</option>";
					});
					$("#physician_selection").html(physician_list);
					$("#physician_selection").removeAttr("disabled");
		/*
					$("#physician_selection").change(function(){
						$(this).blur();
						if ($(this).val() == "-1"){
							$("#phys_group_selection").removeAttr("disabled");
							$("tr.patient_row").css("display","table-row");
						}else{
							$("#phys_group_selection").attr("disabled","true");
							$("tr.patient_row").css("display","none");
							$("tr.physician_" + $(this).val()).css("display","table-row");
							setTimeout(function(){
								$("tr.patient_row:hidden").each(function(){
									$("#" + $(this).attr("id") + " span.expand_patient_details").html("[+]");
									$("#" + $(this).attr("id") + "_details").css("display","none");
								});
							},1);
						}
						$("tr.patient_row:visible:odd").css("background-color","#E0E0E0");
						$("tr.patient_row:visible:even").css("background-color","white");
					});
		*/
					$("#physician_selection").unbind("change");
					$("#physician_selection").change(function(){
						$("#phys_group_selection").attr("disabled","true");
						$(this).blur();
						if (timeout_id){
							clearTimeout(timeout_id);
						}
						timeout_id = setTimeout(function(){
							loadBaycareCensus($("#facility_selection").val(),
											$("#unit_selection").val(), //0,
											$("#phys_group_selection").val(),
											$("#show_discharged").val(),false,
											$("#physician_selection").val(),
											($("#include_outpatient").val()=="YES"?true:false),false);
						},1);
					});
				}
			}
			if ($("#phys_group_selection").val() != "-1"){
				selected_physician_group = $("#phys_group_selection").val();
			}
			$("#phys_group_selection").html("");
			$("#phys_group_selection").attr("disabled","true");
			if (data.CENSUS.PHYSICIAN_GROUP_CNT_I > 0){			
				var ph_group_list = "<option value='-1'>Select Physician Group to Filter</option>";
				$.each(data.CENSUS.PHYSICIAN_GROUP, function(idx, ph_group){
					ph_group_list += "<option value='" + ph_group.GROUP_ID + "' sortval='" +
						ph_group.GROUP_NAME + "'" + 
						(selected_physician_group > -1 && selected_physician_group == ph_group.GROUP_ID?" selected":"") + ">" +
						ph_group.GROUP_NAME + "</option>";
				});
				$("#phys_group_selection").html(ph_group_list);
				soptions = $("#phys_group_selection option:not(:first)").qsort({attr:"sortval",ignoreCase:true});
				$("#phys_group_selection").removeAttr("disabled");
				$("#phys_group_selection").unbind("change");
				$("#phys_group_selection").change(function(){
					$(this).blur();
/*
					if ($(this).val() == "-1"){
						//$("#physician_selection").removeAttr("disabled");
						$("tr.patient_row").css("display","table-row");
					}else{
						//$("#physician_selection").attr("disabled","true");
						if ($("#unit_selection").val()==-1){
							$("#unit_selection").val(999999);
						}
						if ($("#physician_selection").val() > -1){
							$("#physician_selection").val("-1");
							$(this).blur();
							if (timeout_id){
								clearTimeout(timeout_id);
							}
							timeout_id = setTimeout(function(){
								loadBaycareCensus($("#facility_selection").val(),
												$("#unit_selection").val(), //0,
												$("#phys_group_selection").val(),
												$("#show_discharged").val(),false,
												$("#physician_selection").val(),
												($("#include_outpatient").val()=="YES"?true:false),false);
							},1);
						}
						$("tr.patient_row").css("display","none");
						$("tr.physiciangroup_" + $(this).val()).css("display","table-row");
						if (timeout_id){
							clearTimeout(timeout_id);
						}
						timeout_id = setTimeout(function(){
							$("tr.patient_row:hidden").each(function(){
								$("#" + $(this).attr("id") + " span.expand_patient_details").html("[+]");
								$("#" + $(this).attr("id") + "_details").css("display","none");
							});
						},1);

					}
					$("tr.patient_row:visible:odd").css("background-color","#E0E0E0");
					$("tr.patient_row:visible:even").css("background-color","white");
*/
					if (timeout_id){
						clearTimeout(timeout_id);
					}
					timeout_id = setTimeout(function(){
						loadBaycareCensus($("#facility_selection").val(),
										$("#unit_selection").val(), //0,
										$("#phys_group_selection").val(),
										$("#show_discharged").val(),false,
										$("#physician_selection").val(),
										($("#include_outpatient").val()=="YES"?true:false),false);
					},1);
				});
				
			}else{
				$("#phys_group_selection").html("<option value='-2'>No Group</option>");
				$("#phys_group_selection").css("disabled","true");
			}
		}else{
			if (phys_cd == null || phys_cd < 1){
				if (data.CENSUS.PHYSICIAN_CNT_I > 0){
					var physician_list = "";
					$.each(data.CENSUS.PHYSICIAN, function(idx, physician){
						var exists = 0 != $("#physician_selection option[value=" + physician.PRSNL_ID +"]").length;
						if (!exists){
							physician_list += "<option value='" + physician.PRSNL_ID + "'>" +
								physician.PHYSICIAN_NAME + "</option>";
						}
					});
					var sel_ph_tmp = $("#physician_selection").val();
					$("#physician_selection").append(physician_list);
					soptions = $("#physician_selection option:not(:first)").qsort();
    				$("#physician_selection").html(soptions).prepend("<option value='-1'>Select Physician To Filter</option>");  
    				$("#physician_selection").val (sel_ph_tmp);  
					$("#physician_selection").unbind("change");
					$("#physician_selection").change(function(){
						$(this).blur();
						if (timeout_id){
							clearTimeout(timeout_id);
						}
						timeout_id = setTimeout(function(){
							loadBaycareCensus($("#facility_selection").val(),
											$("#unit_selection").val(), //0,
											$("#phys_group_selection").val(),
											$("#show_discharged").val(),false,
											$("#physician_selection").val(),
											($("#include_outpatient").val()=="YES"?true:false),false);
						},1);
					});
				}
			}
			if (data.CENSUS.PHYSICIAN_GROUP_CNT_I > 0){
				var ph_group_list = "";
								
				$.each(data.CENSUS.PHYSICIAN_GROUP, function(idx, ph_group){
					var exists = 0 != $("#phys_group_selection option[value=" + ph_group.GROUP_ID +"]").length;
					if (!exists){
						ph_group_list += "<option value='" + ph_group.GROUP_ID + "' sortval='" +
						ph_group.GROUP_NAME + "'>" +
							ph_group.GROUP_NAME + "</option>";
					}
				});
				var sel_ph_tmp = $("#phys_group_selection").val();
				$("#phys_group_selection").append(ph_group_list);
				soptions = $("#phys_group_selection option:not(:first)").qsort({attr:"sortval",ignoreCase:true});
				$("#phys_group_selection").html(ph_group_list).prepend("<option value='-1'>Select Physician Group to Filter</option>");
				$("#phys_group_selection").val(sel_ph_tmp);
				$("#phys_group_selection").unbind("change");
				$("#phys_group_selection").change(function(){
					$(this).blur();
/*
					if ($(this).val() == "-1"){
						//$("#physician_selection").removeAttr("disabled");
						$("tr.patient_row").css("display","table-row");
					}else{
						//$("#physician_selection").attr("disabled","true");
						if ($("#physician_selection").val() > -1){
							$("#physician_selection").val("-1");
							$(this).blur();
							if (timeout_id){
								clearTimeout(timeout_id);
							}
							timeout_id = setTimeout(function(){
								loadBaycareCensus($("#facility_selection").val(),
												$("#unit_selection").val(), //0,
												$("#phys_group_selection").val(),
												$("#show_discharged").val(),false,
												$("#physician_selection").val(),
												($("#include_outpatient").val()=="YES"?true:false),false);
							},1);
						}else{
						$("tr.patient_row").css("display","none");
						$("tr.physiciangroup_" + $(this).val()).css("display","table-row");
						if (timeout_id){
							clearTimeout(timeout_id);
						}
						timeout_id = setTimeout(function(){
							$("tr.patient_row:hidden").each(function(){
								$("#" + $(this).attr("id") + " span.expand_patient_details").html("[+]");
								$("#" + $(this).attr("id") + "_details").css("display","none");
							});
						},1);
						}
					}
					$("tr.patient_row:visible:odd").css("background-color","#E0E0E0");
					$("tr.patient_row:visible:even").css("background-color","white");
*/
					if (timeout_id){
						clearTimeout(timeout_id);
					}
					timeout_id = setTimeout(function(){
						loadBaycareCensus($("#facility_selection").val(),
										$("#unit_selection").val(), //0,
										$("#phys_group_selection").val(),
										$("#show_discharged").val(),false,
										$("#physician_selection").val(),
										($("#include_outpatient").val()=="YES"?true:false),false);
					},1);
				});
			}else{
				$("#phys_group_selection").html("<option value='-2'>No Group</option>");
				$("#phys_group_selection").css("disabled","true");
			}
		}
		if (data.CENSUS.PATIENT_CNT_I > 0 && load_data){
			var patient_list = "";
			$.each(data.CENSUS.PATIENT, function(idx, patient){
				if (patient.DISPLAY == 1){
					if (!incremental_load || (incremental_load &&
						(start_unit != patient.UNIT_KEY ||
						 start_room != patient.ROOM_KEY ||
						 (start_unit == patient.UNIT_KEY &&
						  start_room == patient.ROOM_KEY &&
						  start_bed < patient.BED_ID)))){
						var rec_idx = idx;
						if (incremental_load){
							rec_idx = idx + (special_counter * 150);
						}
						patient_list += "<tr id='pt_row_" + rec_idx + "' class='patient_row"
						if (patient.ATTENDING_PHYSICIAN_PRSNL_ID > 0){
							patient_list += " physician_" + patient.ATTENDING_PHYSICIAN_PRSNL_ID;
						}
//						if (patient.PHYSICIAN_GROUP_CNT_I > 0){
//							$.each(patient.PHYSICIAN_GROUP, function(pg_idx, physician_group){
//								patient_list += " physiciangroup_" + physician_group.GROUP_ID;
//							});
//						}
						patient_list += "'>";
						//;added by V. Do
						var the_id = "x_o_" + rec_idx
						var pname = 	 patient.FIRST_NAME_VC + " " + patient.LAST_NAME_VC 
						var enc_id = patient.ENCNTR_ID
						var pp_color	= "-"
						pp_color_link = "<a id= '" + the_id + "' onClick = 'Javascript:PowerPlan_Orders(\"" + the_id +  "\",\"" + enc_id +  "\", \"" + pname +  "\" );'" 
						var pp_sort = "zero none"
						var pp_init =patient.PP_INIT;
						var pp_planned = patient.PP_PLANNED;
						
						if (pp_planned > 0)
							{	
								pp_color = pp_color_link + " href = '#'><img src='../images/red_bullet.gif' width = '10' height='10'  /></a>";//red
								pp_sort = "Planned Red"
							};
						if (pp_planned < 1 && pp_init > 0)
							{	
								pp_color = pp_color_link + " href = '#'><img src='../images/green-bullet.gif' width = '10' height='10'  /></a>";//red
								pp_sort = "Initiated Green"
							};
						//;added by b101839		
						var ps_color	= "-"					
						var ps_sort = "zero none"
						var ppis = patient.PPIS;	
						var ppic = patient.PPIC;
							
						if (ppis > 0 && ppic < 1)
								{	
								ps_color =  "<img src='../images/orange_bullet.gif' width = '10' height='10'  />"
								ps_sort = "Sent"
							};
						if (ppis > 0 && ppic > 0)
								{	
								ps_color =  "<img src='../images/green-bullet.gif' width = '10' height='10'  />"
								ps_sort = "Received"
							};

											
						var physician_section = "<td>" + patient.ATTENDING_PHYSICIAN_VC + "</td>" +
//									"<td>" + patient.RELATIONSHIP_VC + "</td>" +
									"<td>" + patient.PHYSICIAN_SERVICE_VC + "</td>" +
									"<td>" + patient.INSURANCE_VC + "</td>" +
									"<td align = 'center'><span><span style='display:none;'>" + pp_sort + "</span>" + pp_color + "</span></td>" +
									"<td align = 'center'><span><span style='display:none;'>" + ps_sort + "</span>" + ps_color + "</span></td>"												
						var patient_section = "<td><span  style='display:none;'>" + patient.LAST_NAME_VC + patient.FIRST_NAME_VC +  "</span>" +
									"<span class='expand_patient_details'>[+]</span> " +
									"<span class='open_chart'>" +
									"<span class='person_id' style='display:none;'>" + patient.PERSON_ID + "</span>" +
									"<span class='encntr_id' style='display:none;'>" + patient.ENCNTR_ID + "</span>" + 
									"<a href='javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=" + 
									patient.PERSON_ID + " /ENCNTRID=" + patient.ENCNTR_ID +"\");return false;'>" +
									patient.LAST_NAME_VC + ", <span class='nowrap'>" + patient.FIRST_NAME_VC + 
									(patient.INITIAL_VC!= ""?" " + patient.INITIAL_VC:"") + "</span></a></span></td>" +
									"<td>";
						if (patient.PRIVACY_I){
							patient_section += "<img src='../images/privacy_icon.png' style='width:20px;' alt='No Information' />";
						}
						if (patient.ISOLATION_VC != ""){
							patient_section += "<span class='isolation'><span class='isolation_details' style='display:none;'>" + 
								"<strong>Isolation Details:</strong><br />" +
								patient.ISOLATION_VC + "</span><img src='../images/isolation_icon.png' style='width:20px;' /></span>";
						}
						patient_section += "</td><td>" + patient.DATE_OF_BIRTH_VC + "</td>" +
							"<td>" + patient.SEX_VC  + "</td>" +
							"<td>" + patient.ADMIT_DT_TM_VC + "</td>";
	//					if ($("#show_discharged").val() != "-1"){
							if (patient.DISCHARGE_DT_TM_VC == ""){
								patient_section += "<td style='text-align:center;'>---</td>";
							}else{
								patient_section += "<td>" + patient.DISCHARGE_DT_TM_VC + "</td>";
							}
	//					}
						var location_section = "<td>" + patient.LOCATION_VC + "</td>" +
									"<td>" + patient.ROOM_BED_VC + "</td>";
						
						var selected_view = $("#view_selection").val();
						switch(selected_view){
							case "option2":
								patient_list += physician_section + patient_section + location_section;
	
								break;
							default:
								patient_list += location_section + patient_section + physician_section;
								break;
						}
						patient_list += "</tr>";
					}
				}
			});
			
			if (!incremental_load){
				if (!error_found){
					$("#census_table tbody").html(patient_list);
				}
			}else{
				$("#census_table tbody").append(patient_list);
			}
			/*
			if (selected_physician_group > 0 ){
				$("#phys_group_selection").val(selected_physician_group);
				$("tr.patient_row").css("display","none");
				$("tr.physiciangroup_" + selected_physician_group).css("display","table-row");
				if (timeout_id){
					clearTimeout(timeout_id);
				}
				timeout_id = setTimeout(function(){
					$("tr.patient_row:hidden").each(function(){
						$("#" + $(this).attr("id") + " span.expand_patient_details").html("[+]");
						$("#" + $(this).attr("id") + "_details").css("display","none");
					});
				},1);
				$("tr.patient_row").css("background-color","white");
				$("tr.patient_row:visible:odd").css("background-color","#E0E0E0");
				$("tr.patient_row:visible:even").css("background-color","white");
			}
			*/
			
//			alert(data.CENSUS.PATIENT_CNT_I);
			if (loc_cd == 999999 && data.CENSUS.PATIENT_CNT_I == 150){
				special_counter++;
				if (special_counter < 10){
//				alert(data.CENSUS.PATIENT[149].UNIT_KEY + " - " + data.CENSUS.PATIENT[149].ROOM_KEY +
//					" - " + data.CENSUS.PATIENT[149].BED_ID + " - " + data.CENSUS.PATIENT[149].LAST_INITIAL_VC);
				loadBaycareCensus(fac_cd, loc_cd, phys_gr_cd, show_discharge,debug, phys_cd, show_outpatient,
					data.CENSUS.PATIENT[149].UNIT_KEY,data.CENSUS.PATIENT[149].ROOM_KEY,
					data.CENSUS.PATIENT[149].BED_ID, data.CENSUS.PATIENT[149].LAST_INITIAL_VC, true);
				}
			}
			$("#census_table").trigger("update");
			$("#expand_collaps_all").css("display","block");
			$("tr.patient_row:visible:odd").css("background-color","#E0E0E0");
			$("span.expand_patient_details").css("cursor","pointer");			

			$("span.expand_patient_details").unbind("click");
			$("span.expand_patient_details").click(function(){
				var row_id = $(this).parent().parent("tr").attr("id");
				var bg_color = $(this).parent().parent("tr").css("background-color");
				var txt = $(this).html();
				if (txt == "[+]"){
					var p = $MP.options.organizer_params + ",";
					p += $("#" + row_id).find("span.person_id").html();
					p += "," + $("#" + row_id).find("span.encntr_id").html();
					
					$MP.getJSON("bc_mp_mvs_2", function(data){
						var output = "<tr id='" + row_id + "_details' class='patient_details_row' " +
							"style='border:solid 1px silver;background-color:" + bg_color + ";'>" +
							"<td colspan='" + ($("#show_discharged").val()!="-1"?"12":"12") + "'>" +
							"<table border='0' cellspacing='0' cellpadding='0'><tr>" +
								"<td style='width:150px;'>&nbsp;</td>" +
								"<td><table class='pt_details_table' style='width:100%;' border='0' cellspacing='0' cellpadding='0'>" +
								"<tr><td style='width:200px;'>FIN #:  " + data.PATIENT.FIN_VC + "</td>" +
								"<td style='width:15px;'>&nbsp;</td>" +
								"<td>Length of Stay:  " + data.PATIENT.LOS_VC + "</td></tr>" +
								"<tr><td>MRN #:  " + data.PATIENT.MRN_VC + "</td>" +
								"<td>&nbsp;</td>" +
								"<td style='width:300px;'>Patient Type:  " + data.PATIENT.PATIENT_TYPE_VC + "</td></tr>" +
								"<tr><td>CPI #:  " + data.PATIENT.CPI_VC + "</td>" +
								"<td>&nbsp;</td>" +
								"<td>Hospital Service:  " + data.PATIENT.HOSPITAL_SERVICE_VC + "</td></tr>" +
								"<tr><td>&nbsp;</td>" +
								"<td>&nbsp;</td>" +
								"<td>Religion: " + data.PATIENT.RELIGION_VC + "</td></tr>" +
							"</table></td><td style='width:220px;'>&nbsp;</td>" +
							"<td><table class='pt_details_table' border='0' cellspacing='0' cellpadding='0'>" +
								"<tr><td>Attending Physician:  " + data.PATIENT.ATTENDING_PHYSICIAN_VC + "</td></tr>" +
								"<tr><td>Admitting Physician:  " + data.PATIENT.ADMITTING_PHYSICIAN_VC + "</td></tr>" +
								"<tr><td>Consulting Physician:  ";
						if (data.PATIENT.CONSULTING_PHYS_CNT_I > 0){
							output += "<span class='consulting_physician'>Hover to View" +
								"<span class='consulting_physician_details' style='display:none;'>" +
								"<strong>Consulting Physician" + (data.PATIENT.CONSULTING_PHYS_CNT_I>1?"s":"") + ":</strong><br />";
							$.each(data.PATIENT.CONSULTING_PHYS, function(cp_idx, phys){
								if (cp_idx>0){
									output += "<br />";
								}
								output += phys.PHYS_NAME_VC;
							});
						}
						output += "</td></tr>" +
							"</table></td></tr></table></td></tr>";
						$("#" + row_id).after(output);
						$("#" + row_id).find("span.expand_patient_details").html("[-]");
						$("span.consulting_physician").tooltip({delay:0,showURL:false,bodyHandler:function(){
							return $(this).find("span.consulting_physician_details").html();
						}});
					},{seeJSON:0},null,p);
				}else{
					$("#" + row_id + "_details").remove();
					$(this).html("[+]");
				}
			});
			$("span.isolation").tooltip({delay:0,showURL:false,bodyHandler:function(){
				return $(this).find("span.isolation_details").html();
			}});
/*
			$("span.open_chart").unbind("click");
			$("span.open_chart").click(function(){
				var person_id = $(this).find("span.person_id").html();
				var encntr_id = $(this).find("span.encntr_id").html();
				APPLINK(0,"powerchart.exe","/PERSONID=" + person_id + " /ENCNTRID=" + encntr_id);
			});
*/
		}
	},{seeJSON:debug},null,params);
}
