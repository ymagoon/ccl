function Anesthesia_loadVitals(spanName)
{
	$MP.getJSON("bc_mp_mvs_vitals_21", function(data){
		var output = "<table class='anesthesia_vitals_table' style='width:99%;'><tr>";
		output += "<td><span class='anesthesia_vitals_bold'>BP:</span> " + 
			"<span class='anesthesia_vitals_value'>" +
			data.VITALS.BP_SYS + "/" + data.VITALS.BP_DIA + " (" +
			data.VITALS.BP_MEAN + ")</span><br />" +
			"<span class='anesthesia_vitals_dt_tm'>" +
			data.VITALS.BP_DT_TM + "</span></td>";
		output += "<td><span class='anesthesia_vitals_bold'>HR:</span> " + 
			"<span class='anesthesia_vitals_value'>" +
			data.VITALS.HR + "</span><br />" +
			"<span class='anesthesia_vitals_dt_tm'>" +
			data.VITALS.HR_DT_TM + "</span></td>";
		output += "<td><span class='anesthesia_vitals_bold'>RR:</span> " + 
			"<span class='anesthesia_vitals_value'>" +
			data.VITALS.RR + "</span><br />" +
			"<span class='anesthesia_vitals_dt_tm'>" +
			data.VITALS.RR_DT_TM + "</span></td>";
		output += "<td><span class='anesthesia_vitals_bold'>SpO2:</span> " + 
			"<span class='anesthesia_vitals_value'>" +
			data.VITALS.SPO2 + "</span><br />" +
			"<span class='anesthesia_vitals_dt_tm'>" +
			data.VITALS.SPO2_DT_TM + "</span></td>";
		output += "<td><span class='anesthesia_vitals_bold'>Temp:</span> " + 
			"<span class='anesthesia_vitals_value'>" +
			data.VITALS.TEMP + "</span><br />" +
			"<span class='anesthesia_vitals_dt_tm'>" +
			data.VITALS.TEMP_DT_TM + "</span></td>";
		output += "<td><span class='anesthesia_vitals_bold'>Wt (kg):</span> " + 
			"<span class='anesthesia_vitals_value'>" +
			data.VITALS.WT + "</span><br />" +
			"<span class='anesthesia_vitals_dt_tm'>" +
			data.VITALS.WT_DT_TM + "</span>" + 
			(data.VITALS.WT_ESTIMATED?" <span class='anesthesia_vitals_est_wt'>[Est.]</span>":
			" <span class='anesthesia_vitals_act_wt'>[Act.]</span>") + 
			"</td>";
		output += "<td><span class='anesthesia_vitals_bold'>Ht (in):</span> " + 
			"<span class='anesthesia_vitals_value'>" +
			data.VITALS.HT + "</span><br />" +
			"<span class='anesthesia_vitals_dt_tm'>" +
			data.VITALS.HT_DT_TM + "</span></td>";
		output += "<td><span class='anesthesia_vitals_bold'>BMI:</span> " + 
			"<span class='anesthesia_vitals_value'>" +
			data.VITALS.BMI + "</span><br />" +
			"<span class='anesthesia_vitals_dt_tm'>" +
			data.VITALS.BMI_DT_TM + "</span></td>";
		output += "</tr></table>";
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}
function Anesthesia_loadMedications(spanName)
{
	$MP.getJSON("bc_mp_mvs_meds_23", function(data){
		var output = "<table class='anesthesia_medications_table' style='width:99%;'>";
		if (data.MEDS.CNT > 0)
		{
			$.each(data.MEDS.GROUP, function(g_idx, group){
				if (g_idx > 0){
					output += "<tr><td colspan='2'>&nbsp;</td></tr>";
				}
				output += "<tr class='meds_group'><td colspan='100%'>" + group.DESCRIPTION + "</td></tr>";
				$.each(group.DETAILS, function(d_idx, detail){
//					output += "<tr class='meds_row'><td><span class='meds_tooltip'>" + detail.DETAILS + "</span>" + 
//						detail.NMEMONIC + "</td><td style='font-size:8px;vertical-align:top;' nowrap>";
//					if (detail.DATE_TIME.length > 0){
//						output += detail.DATE_TIME;
//					}else{
//						output += "Ordered";
//					}
//					output += "</td></tr>";
					var slash_needed = false;
					var orderdetail = ""
					if (detail.STRENGTH > ""){
						orderdetail += detail.STRENGTH;
						slash_needed = true;
					}
					if (detail.VOLUME > ""){
						if (slash_needed)
							orderdetail += "/";
							
						orderdetail += detail.VOLUME;
						slash_needed = true;
					}
					if (detail.FREQUENCY > ""){
						if (slash_needed)
							orderdetail += "/";
							
						orderdetail += detail.FREQUENCY;
						slash_needed = true;
					}					
					if (detail.ROUTE > ""){
						if (slash_needed)
							orderdetail += "/";
							
						orderdetail += detail.ROUTE;
					}
					output += "<tr class='meds_row'" + (detail.NMEMONIC.length + orderdetail.length > 45?" style='height:27px;'":"") +
						"><td style='font-weight:bold;' colspan='100%'><span class='meds_tooltip'>" + detail.DETAILS + "</span>" +
						detail.NMEMONIC + "<span class='meds_date'>" + orderdetail;
					output += "</span></td></tr>";
					if (detail.DATE_TIME.length > 0 || detail.LAST_ADMINISTERED){
					output += "<tr class='meds_details_row'><td colspan='100%'>";
					
					if (detail.DATE_TIME.length > 0){
						output += "Administered: " + detail.DATE_TIME;
					}else{
						if (detail.LAST_ADMINISTERED){
							if (group.DESCRIPTION=="Home Medications"){
								output += "Last Dose: " + detail.LAST_ADMINISTERED;
							}else {
								output += "Last Administered: " + detail.LAST_ADMINISTERED;								
							}
//						}else{
//							output += "Status: Ordered";
						}
					}
					
					output += "</td></tr>";
					}
					
//					output += "<tr class='meds_details_row'><td>" + detail.STRENGTH + "</td><td>" + detail.VOLUME + "</td><td>" +
//						detail.FREQUENCY + "</td><td>" + detail.ROUTE + "</td></tr>";
				});
			});
		}
		output += "</table>";
		showDataArea(spanName, output, false);
		$("table.anesthesia_medications_table tr.meds_row:odd").css("background-color","#F0F0F0");
		$("table.anesthesia_medications_table tr.meds_details_row:odd").css("background-color","#F0F0F0");
//		$("table.anesthesia_medications_table tr.meds_row").tooltip({
//			delay:0,
//			showURL:false,
//			bodyHandler: function(){
//				return "<span style='font-size:10px;'>" + $(this).find("span.meds_tooltip").html() +"</span>";
//			}
//		});
	},{seeJSON:0});
}
function Anesthesia_loadStudies(spanName)
{
	$MP.getJSON("bc_mp_mvs_studies_17", function(data){
		var output = "<span class='encntr_id' style='display:none;'>" + data.STUDIES.ENCNTR_ID +
			"</span><span class='person_id' style='display:none;'>" + data.STUDIES.PERSON_ID +
			"</span><table style='width:99%;' class='anesthesia_studies_table'>";
		if (data.STUDIES.RAD_CNT > 0){
			output += "<tr class='anesthesia_studies_group'><td colspan='100%'>Radiology</td></tr>";
			$.each(data.STUDIES.RAD_STUDY, function(idx, study){
				output += "<tr class='anesthesia_study'><td><span class='event_id' style='display:none;'>" + study.EVENT_ID + "</span>" +
					"<span class='event_description' style='display:none;'>" + study.DESCRIPTION + "</span>" +
					study.DESCRIPTION + "</td><td>" + study.DATE_TIME + "</td></tr>";
			});
		}
		if (data.STUDIES.CARD_CNT > 0){
			$.each(data.STUDIES.GROUP, function(idx, group){
				if (group.CARD_STUDY.length > 0){
				output += "<tr class='anesthesia_studies_group'><td colspan='100%'>" + group.DESCRIPTION + "</td></tr>";
				$.each(group.CARD_STUDY, function(idx2, study){
					output += "<tr class='anesthesia_study'><td><span class='event_id' style='display:none;'>" + study.EVENT_ID + "</span>" + 
						"<span class='event_description' style='display:none;'>" + study.DESCRIPTION + "</span>" +
						study.DESCRIPTION + "</td><td>" + study.DATE_TIME + "</td></tr>";
				});
				}
			});
		}
		if (data.STUDIES.RAD_CNT == 0 && data.STUDIES.CARD_CNT == 0){
			output += "<tr><td>No studies found</td></tr>";
		}
		output += "</table>";
		showDataArea(spanName, output, false);
		$("tr.anesthesia_study").css("cursor","pointer");
		$("tr.anesthesia_study").click(function(){
			var p_id = $(this).parent().parent().parent().find("span.person_id").html();
			var e_id = $(this).parent().parent().parent().find("span.encntr_id").html();
			var evt_id = $(this).find("span.event_id").html();
			var t = $(this).find("span.event_description").html();
			openDocument(t, p_id, e_id, evt_id);
		});
	},{seeJSON:0});
}
function Anesthesia_loadLabResults(spanName)
{
	var max_lab_history = 5;
	$MP.getJSON("bc_mp_mvs_lab_18", function(data){
		var output = "<table class='anesthesia_lab_table' style='width:98%;'>";
		if (data.LAB_RESULT.CBC_CNT > 0){
			output += "<tr><td colspan='2' style='width:70%;text-align:center;'>" +
				"<table cellspacing='0' cellpadding='0' style='font-size:10px;'><tr>" +
				"<td rowspan='2' style='font-size:16px;width:45px;text-align:right;";
				if (data.LAB_RESULT.CBC[0].WBC_CRIT){
					output += "color:red;font-weight:bold;";
				}else if (data.LAB_RESULT.CBC[0].WBC_HIGH_LOW){
					output += "color:blue;";
				}
				output += "'"; 
				if (data.LAB_RESULT.CBC_CNT > 1){
					output += " class='anesthesia_lab_graph'";
				}
				output += ">"; 
				
				/*
				if (data.LAB_RESULT.CBC[0].WBC_CRIT || data.LAB_RESULT.CBC[0].WBC_HIGH_LOW){
					if (data.LAB_RESULT.CBC_CNT > 1){
						if (data.LAB_RESULT.CBC[0].WBC > data.LAB_RESULT.CBC[1].WBC){
							output += "&uarr;&nbsp;";
						}else if (data.LAB_RESULT.CBC[0].WBC < data.LAB_RESULT.CBC[1].WBC){
							output += "&darr;&nbsp;";
						}
					}
				}*/
				if (data.LAB_RESULT.CBC_CNT > 1){
					output += "<span class='anesthesia_lab_description'>WBC</span>";
					output += "<span class='anesthesia_lab_values'>";
					$.each(data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.WBC;
						}
					});
					output += "</span><span class='anesthesia_lab_dates'>";
					$.each(data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.DATE_TIME;
						}
					});
					output += "</span>";
				}
				output += data.LAB_RESULT.CBC[0].WBC + "</td>" +
				"<td><span  style='font-size:20px;vertical-align:top;position:relative;bottom:-4px;'>&#92;</span></td>";

				output += "<td style='font-size:16px;border-bottom:1px black solid;width:45px;text-align:center;";
				
				if (data.LAB_RESULT.CBC[0].HGB_CRIT){
					output += "color:red;font-weight:bold;'";
				}else if (data.LAB_RESULT.CBC[0].HGB_HIGH_LOW){
					output += "color:blue;'";
				}else{
					output += "'"; 
				}
				if (data.LAB_RESULT.CBC_CNT > 1){
					output += " class='anesthesia_lab_graph'";
				}
				output += ">";
				/*
				if (data.LAB_RESULT.CBC[0].HGB_CRIT || data.LAB_RESULT.CBC[0].HGB_HIGH_LOW){
					if (data.LAB_RESULT.CBC_CNT > 1){
						if (data.LAB_RESULT.CBC[0].HGB > data.LAB_RESULT.CBC[1].HGB){
							output += "&uarr;&nbsp;";
						}else if (data.LAB_RESULT.CBC[0].HGB < data.LAB_RESULT.CBC[1].HGB){
							output += "&darr;&nbsp;";
						}
					}
				}
				*/
				
				if (data.LAB_RESULT.CBC_CNT > 1){
					output += "<span class='anesthesia_lab_description'>HGB</span>";
					output += "<span class='anesthesia_lab_values'>";
					$.each(data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.HGB;
						}
					});
					output += "</span><span class='anesthesia_lab_dates'>";
					$.each(data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.DATE_TIME;
						}
					});
					output += "</span>";
				}
				output += data.LAB_RESULT.CBC[0].HGB + "</td>";
				
				output += "<td><span  style='font-size:20px;vertical-align:top;position:relative;bottom:-4px;'>&#47;</span></td>" +
				"<td rowspan='2' style='font-size:16px;width:45px;text-align:left;";
				if (data.LAB_RESULT.CBC[0].PLT_CRIT){
					output += "color:red;font-weight:bold;'";
				}else if (data.LAB_RESULT.CBC[0].PLT_HIGH_LOW){
					output += "color:blue;'";
				}else{
					output += "'"; 
				}
				if (data.LAB_RESULT.CBC_CNT > 1){
					output += " class='anesthesia_lab_graph'";
				}
				output += ">";
				/*
				if (data.LAB_RESULT.CBC[0].PLT_CRIT || data.LAB_RESULT.CBC[0].PLT_HIGH_LOW){
					if (data.LAB_RESULT.CBC_CNT > 1){
						if (data.LAB_RESULT.CBC[0].PLT > data.LAB_RESULT.CBC[1].PLT){
							output += "&uarr;&nbsp;";
						}else if (data.LAB_RESULT.CBC[0].PLT < data.LAB_RESULT.CBC[1].PLT){
							output += "&darr;&nbsp;";
						}
					}
				}
				*/
				if (data.LAB_RESULT.CBC_CNT > 1){
					output += "<span class='anesthesia_lab_description'>PLT</span>";
					output += "<span class='anesthesia_lab_values'>";
					$.each(data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.PLT;
						}
					});
					output += "</span><span class='anesthesia_lab_dates'>";
					$.each(data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.DATE_TIME;
						}
					});
					output += "</span>";
				}
				output += data.LAB_RESULT.CBC[0].PLT + "</td></tr>" +
				"<tr><td><span  style='font-size:20px;vertical-align:top;position:relative;top:-3px;'>&#47;</span></td>";
				output += "<td style='font-size:16px;border-top:1px black solid;width:45px;text-align:center;";
				
				if (data.LAB_RESULT.CBC[0].HCT_CRIT){
					output += "color:red;font-weight:bold;'";
				}else if (data.LAB_RESULT.CBC[0].HCT_HIGH_LOW){
					output += "color:blue;'";
				}else{
					output += "'"; 
				}
				if (data.LAB_RESULT.CBC_CNT > 1){
					output += " class='anesthesia_lab_graph'";
				}
				output += ">";
				/*
				if (data.LAB_RESULT.CBC[0].HCT_CRIT || data.LAB_RESULT.CBC[0].HCT_HIGH_LOW){
					if (data.LAB_RESULT.CBC_CNT > 1){
						if (data.LAB_RESULT.CBC[0].HCT > data.LAB_RESULT.CBC[1].HCT){
							output += "&uarr;&nbsp;";
						}else if (data.LAB_RESULT.CBC[0].HCT < data.LAB_RESULT.CBC[1].HCT){
							output += "&darr;&nbsp;";
						}
					}
				}
				*/
				if (data.LAB_RESULT.CBC_CNT > 1){
					output += "<span class='anesthesia_lab_description'>HCT</span>";
					output += "<span class='anesthesia_lab_values'>";
					$.each(data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.HCT;
						}
					});
					output += "</span><span class='anesthesia_lab_dates'>";
					$.each(data.LAB_RESULT.CBC, function(idx, cbc){
						if (idx < max_lab_history){
						if (idx > 0){
							output += ";";
						}
						output += cbc.DATE_TIME;
						}
					});
					output += "</span>";
				}
				output += data.LAB_RESULT.CBC[0].HCT + "</td>";
				
				

				output += "<td><span  style='font-size:20px;vertical-align:top;position:relative;top:-3px;'>&#92;</span></td></tr></table>" +
					"</td><td style='font-size:12px;'>" + data.LAB_RESULT.CBC[0].DATE_TIME + "</td></tr>";
		}
		
		
		if (data.LAB_RESULT.BMP_CNT > 0){
			if (data.LAB_RESULT.CBC_CNT > 0){
				output += "<tr><td colspan='3' style='height:5px;'>&nbsp;</td></tr>";
			}
			output += "<tr><td colspan='2' style='width:70%;text-align:center;'>" +
				"<table cellspacing='0' cellpadding='0' style='font-size:10px;'><tr>";
			output += "<td style='font-size:16px;width:45px;text-align:center;border-right:1px solid black;border-bottom:1px solid black;";
			if (data.LAB_RESULT.BMP[0].SODIUM_CRIT){
				output += "color:red;font-weight:bold;'";
			}else if (data.LAB_RESULT.BMP[0].SODIUM_HIGH_LOW){
				output += "color:blue;'";
			}else{
				output += "'"; 
			}
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += " class='anesthesia_lab_graph'";
			}
			output += ">";
			/*
			if (data.LAB_RESULT.BMP[0].SODIUM_CRIT || data.LAB_RESULT.BMP[0].SODIUM_HIGH_LOW){
				if (data.LAB_RESULT.BMP_CNT > 1){
					if (data.LAB_RESULT.BMP[0].SODIUM > data.LAB_RESULT.BMP[1].SODIUM){
						output += "&uarr;&nbsp;";
					}else if (data.LAB_RESULT.BMP[0].SODIUM < data.LAB_RESULT.BMP[1].SODIUM){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Sodium</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.SODIUM;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += data.LAB_RESULT.BMP[0].SODIUM + "</td>";

			output += "<td style='font-size:16px;width:45px;text-align:center;border-right:1px solid black;border-left:1px solid black;border-bottom:1px solid black;";
			if (data.LAB_RESULT.BMP[0].CHLORIDE_CRIT){
				output += "color:red;font-weight:bold;'";
			}else if (data.LAB_RESULT.BMP[0].CHLORIDE_HIGH_LOW){
				output += "color:blue;'";
			}else{
				output += "'"; 
			}
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += " class='anesthesia_lab_graph'";
			}
			output += ">";
			/*
			if (data.LAB_RESULT.BMP[0].CHLORIDE_CRIT || data.LAB_RESULT.BMP[0].CHLORIDE_HIGH_LOW){
				if (data.LAB_RESULT.BMP_CNT > 1){
					if (data.LAB_RESULT.BMP[0].CHLORIDE > data.LAB_RESULT.BMP[1].CHLORIDE){
						output += "&uarr;&nbsp;";
					}else if (data.LAB_RESULT.BMP[0].CHLORIDE < data.LAB_RESULT.BMP[1].CHLORIDE){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Chloride</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.CHLORIDE;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += data.LAB_RESULT.BMP[0].CHLORIDE + "</td>";				

			output += "<td style='font-size:16px;width:45px;text-align:center;border-left:1px solid black;border-bottom:1px solid black;";
			if (data.LAB_RESULT.BMP[0].BUN_CRIT){
				output += "color:red;font-weight:bold;'";
			}else if (data.LAB_RESULT.BMP[0].BUN_HIGH_LOW){
				output += "color:blue;'";
			}else{
				output += "'"; 
			}
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += " class='anesthesia_lab_graph'";
			}
			output += ">";
			/*
			if (data.LAB_RESULT.BMP[0].BUN_CRIT || data.LAB_RESULT.BMP[0].BUN_HIGH_LOW){
				if (data.LAB_RESULT.BMP_CNT > 1){
					if (data.LAB_RESULT.BMP[0].BUN > data.LAB_RESULT.BMP[1].BUN){
						output += "&uarr;&nbsp;";
					}else if (data.LAB_RESULT.BMP[0].BUN < data.LAB_RESULT.BMP[1].BUN){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>BUN</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.BUN;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += data.LAB_RESULT.BMP[0].BUN + "</td>";
			
			output += "<td><span style='font-size:20px;position:relative;bottom:-4px;'>&#47;</span></td>";

			output += "<td rowspan='2' style='font-size:16px;width:45px;text-align:left;";
			if (data.LAB_RESULT.BMP[0].GLUCOSE_CRIT){
				output += "color:red;font-weight:bold;'";
			}else if (data.LAB_RESULT.BMP[0].GLUCOSE_HIGH_LOW){
				output += "color:blue;'";
			}else{
				output += "'"; 
			}
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += " class='anesthesia_lab_graph'";
			}
			output += ">";
			/*
			if (data.LAB_RESULT.BMP[0].GLUCOSE_CRIT || data.LAB_RESULT.BMP[0].GLUCOSE_HIGH_LOW){
				if (data.LAB_RESULT.BMP_CNT > 1){
					if (data.LAB_RESULT.BMP[0].GLUCOSE > data.LAB_RESULT.BMP[1].GLUCOSE){
						output += "&uarr;&nbsp;";
					}else if (data.LAB_RESULT.BMP[0].GLUCOSE < data.LAB_RESULT.BMP[1].GLUCOSE){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Glucose</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.GLUCOSE;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += data.LAB_RESULT.BMP[0].GLUCOSE + "</td></tr>";

			output += "<tr><td style='font-size:16px;width:45px;text-align:center;border-right:1px solid black;border-top:1px solid black;";
			if (data.LAB_RESULT.BMP[0].POTASSIUM_CRIT){
				output += "color:red;font-weight:bold;'";
			}else if (data.LAB_RESULT.BMP[0].POTASSIUM_HIGH_LOW){
				output += "color:blue;'";
			}else{
				output += "'"; 
			}
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += " class='anesthesia_lab_graph'";
			}
			output += ">";
			/*
			if (data.LAB_RESULT.BMP[0].POTASSIUM_CRIT || data.LAB_RESULT.BMP[0].POTASSIUM_HIGH_LOW){
				if (data.LAB_RESULT.BMP_CNT > 1){
					if (data.LAB_RESULT.BMP[0].POTASSIUM > data.LAB_RESULT.BMP[1].POTASSIUM){
						output += "&uarr;&nbsp;";
					}else if (data.LAB_RESULT.BMP[0].POTASSIUM < data.LAB_RESULT.BMP[1].POTASSIUM){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Potassium</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.POTASSIUM;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += data.LAB_RESULT.BMP[0].POTASSIUM + "</td>";

			output += "<td style='font-size:16px;width:45px;text-align:center;border-right:1px solid black;border-left:1px solid black;border-top:1px solid black;";
			if (data.LAB_RESULT.BMP[0].BICARBONATE_CRIT){
				output += "color:red;font-weight:bold;'";
			}else if (data.LAB_RESULT.BMP[0].BICARBONATE_HIGH_LOW){
				output += "color:blue;'";
			}else{
				output += "'"; 
			}
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += " class='anesthesia_lab_graph'";
			}
			output += ">";
			/*
			if (data.LAB_RESULT.BMP[0].BICARBONATE_CRIT || data.LAB_RESULT.BMP[0].BICARBONATE_HIGH_LOW){
				if (data.LAB_RESULT.BMP_CNT > 1){
					if (data.LAB_RESULT.BMP[0].BICARBONATE > data.LAB_RESULT.BMP[1].BICARBONATE){
						output += "&uarr;&nbsp;";
					}else if (data.LAB_RESULT.BMP[0].BICARBONATE < data.LAB_RESULT.BMP[1].BICARBONATE){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Carbon Dioxide</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.BICARBONATE;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += data.LAB_RESULT.BMP[0].BICARBONATE + "</td>";				

			output += "<td style='font-size:16px;width:45px;text-align:center;border-left:1px solid black;border-top:1px solid black;";
			if (data.LAB_RESULT.BMP[0].CREATININE_CRIT){
				output += "color:red;font-weight:bold;'";
			}else if (data.LAB_RESULT.BMP[0].CREATININE_HIGH_LOW){
				output += "color:blue;'";
			}else{
				output += "'"; 
			}
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += " class='anesthesia_lab_graph'";
			}
			output += ">";
			/*
			if (data.LAB_RESULT.BMP[0].CREATININE_CRIT || data.LAB_RESULT.BMP[0].CREATININE_HIGH_LOW){
				if (data.LAB_RESULT.BMP_CNT > 1){
					if (data.LAB_RESULT.BMP[0].CREATININE > data.LAB_RESULT.BMP[1].CREATININE){
						output += "&uarr;&nbsp;";
					}else if (data.LAB_RESULT.BMP[0].CREATININE < data.LAB_RESULT.BMP[1].CREATININE){
						output += "&darr;&nbsp;";
					}
				}
			}
			*/
			if (data.LAB_RESULT.BMP_CNT > 1){
				output += "<span class='anesthesia_lab_description'>Creatinine</span>";
				output += "<span class='anesthesia_lab_values'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.CREATININE;
					}
				});
				output += "</span><span class='anesthesia_lab_dates'>";
				$.each(data.LAB_RESULT.BMP, function(idx, bmp){
					if (idx < max_lab_history){
					if (idx > 0){
						output += ";";
					}
					output += bmp.DATE_TIME;
					}
				});
				output += "</span>";
			}
			output += data.LAB_RESULT.BMP[0].CREATININE + "</td>";
			
			output += "<td><span style='font-size:20px;position:relative;top:-3px;'>&#92;</span></td></tr>";
						
			output += "</table>" +
			"</td><td style='font-size:12px;'>" + data.LAB_RESULT.BMP[0].DATE_TIME + "</td></tr>";
		}
		if (data.LAB_RESULT.LAB_CNT > 0){
			if (data.LAB_RESULT.CBC_CNT > 0 || data.LAB_RESULT.BMP_CNT){
				output += "<tr><td colspan='3' style='height:5px;'>&nbsp;</td></tr>";
			}
			$.each(data.LAB_RESULT.LAB, function(l_idx, lab){
				output += "<tr class='data_row' style='font-size:12px;'><td style='font-weight:bolder;'>" + lab.DESCRIPTION + "</td><td";
				if (lab.RESULT[0].CRIT){
					output += " style='color:red;font-weight:bold;'";
				}
				if (lab.RESULT[0].HIGH_LOW){
					output += " style='color:blue;'";
				}
				output += ">" +
					lab.RESULT[0].VAL + "</td><td style='font-size:12px;'>" +
					lab.RESULT[0].DATE_TIME + "</td></tr>";
			});
		}
		output += "</table>";
		
		showDataArea(spanName, output, false);
		
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
	},{seeJSON:0});
}
function Anesthesia_loadProcedure(spanName)
{
	$MP.getJSON("bc_mp_mvs_procedure_24", function(data){
		var output = "<table class='anesthesia_procedure_table' style='width:100%;'>";
		if (data.PROCEDURE.CNT > 0){
			output += "<tr class='header_row'><td>Procedure</td><td>Surgeon</td><td>Surgery Date</td>" +
				"<td>Anesthesia Type</td></tr>";
			$.each(data.PROCEDURE.PROC, function(idx, proc){
				output += "<tr><td>" + proc.PROCEDURE + (proc.PRIMARY?" [Primary]":"") +
					"</td><td>" + proc.SURGEON + "</td><td>" + proc.SURG_DATE + 
					"</td><td>" + proc.ANESTHESIA + "</td></tr>";
			});
			output += "</table>";
		}else{
			output += "<tr><td>No scheduled procedures found.</td></tr>";
		}
		output += "</table>";
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}
function Anesthesia_loadDemographics(spanName)
{
	$MP.getJSON("bc_mp_mvs_demographics_25", function(data){
		var output = "<table class='anesthesia_demographics_table' style='width:100%;'>";
		output += "<tr><td>Reason for Visit: " + data.DEMOGRAPHICS.REASON_FOR_VISIT + "</td></tr>";
		output += "<tr><td>ASA Class: " + data.DEMOGRAPHICS.ASA_CLASS + "</td></tr>";
		output += "<tr><td>Arrival Date: " + data.DEMOGRAPHICS.ARRIVAL_DATE + "</td></tr>";
		if (data.DEMOGRAPHICS.ADMITTING){
			output += "<tr><td>Admitting: " + data.DEMOGRAPHICS.ATTENDING + "</td></tr>";
		}else{
			output += "<tr><td>Attending: " + data.DEMOGRAPHICS.ATTENDING + "</td></tr>";
		}
		output += "<tr><td>Primary Care: " + data.DEMOGRAPHICS.PCP + "</td></tr>";
		output += "<tr><td>Consultant(s): " + data.DEMOGRAPHICS.CONSULTANT_1 + 
			(data.DEMOGRAPHICS.CONSULTANT_2.length > 0?"<br />" +
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
			data.DEMOGRAPHICS.CONSULTANT_2:"") + "</td></tr>";
		output += "<tr><td>Isolation Status: " + data.DEMOGRAPHICS.ISOLATION + "</td></tr>";
		output += "<tr><td>Code Status: " + data.DEMOGRAPHICS.CODE_STATUS + "</td></tr>";
		output += "<tr><td>Home Phone: " + data.DEMOGRAPHICS.HOME_PHONE + "</td></tr>";
		output += "<tr><td><table><tr><td>Emergency Contact(s):</td><td><table>";
		if (data.DEMOGRAPHICS.CONTACT_CNT > 0){
			$.each(data.DEMOGRAPHICS.CONTACT, function(idx, contact){
				output += "<tr><td>" + contact.NAME + (contact.RELATIONSHIP.length>0?" (" + contact.RELATIONSHIP + ")":"") + 
					"<br />" + contact.PHONE + "</td></tr>";
			});
		}
		output += "</table></td></tr></table></td></tr>";
		if (data.DEMOGRAPHICS.PREFERRED_LANGUAGE != ""){
			output += "<tr><td>Preferred Language: " + data.DEMOGRAPHICS.PREFERRED_LANGUAGE + "</td></tr>";
		}
		if (data.DEMOGRAPHICS.SENSORY_DEFICITS != ""){
			output += "<tr><td>Sensory Deficits: " + data.DEMOGRAPHICS.SENSORY_DEFICITS + "</td></tr>";
		}
		if (data.DEMOGRAPHICS.RELIGION != ""){
			output += "<tr><td>Religion: " + data.DEMOGRAPHICS.RELIGION + "</td></tr>";
		}
		output += "</table>";
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}
function Anesthesia_loadVitalsAndIO(spanName)
{
	$MP.getJSON("bc_mp_mvs_vit_io_26",function(data){
		var i_alldays = 0;
		var o_alldays = 0;
		var output = "<table class='anesthesia_vit_io_table' style='width:98%;'>";
		output += "<tr><td><table style='width:100%;'>" +
			"<tr style='font-weight:bold;'><td style='width:80px;'>&nbsp;</td><td style='width:80px;'>" +
			"Shift</td><td>Intake</td><td>Output</td><td>Balance</td></tr></table></td></tr>";
		$.each(data.VIT_IO.IO[0].THE_DAY, function(d_idx, day){
			var i_day_total = 0;
			var o_day_total = 0;
			output += "<tr><td>";
			output += "<table style='width:100%;'>";
			$.each(day.THE_SHIFT, function(s_idx, shift){
				output += "<tr><td style='width:80px;'>";
				if (s_idx == 0){
					output += day.DATE;
				}
				output += "</td><td style='width:80px;'>";
				switch(s_idx){
					case 0: output += " 7a-3p";break;
					case 1: output += "3p-11p";break;
					case 2: output += "11p-7a";break;
				}
				output += "</td><td>" + shift.INPUT_AMT + "</td><td>" + shift.OUTPUT_AMT + "</td><td>" +
					(shift.INPUT_AMT - shift.OUTPUT_AMT) + "</td></tr>";
				i_day_total += shift.INPUT_AMT;
				o_day_total += shift.OUTPUT_AMT;
				i_alldays += shift.INPUT_AMT;
				o_alldays += shift.OUTPUT_AMT;
			});
			output += "<tr><td></td><td style='font-weight:bold;'>Totals</td><td style='font-weight:bold;'>" + i_day_total + 
				"</td><td style='font-weight:bold;'>" + o_day_total + 
				"</td><td style='font-weight:bold;'>" + (i_day_total - o_day_total) + "</td></tr>";
			output += "</table></td></tr>";
		});
		output += "<tr><td><table style='width:100%;'><tr style='font-weight:bold;'><td style='width:163px;'>3 Day Total" +
			"</td><td>" + i_alldays + "</td><td>" + o_alldays + "</td><td>" + (i_alldays - o_alldays) + "</td></tr>" +
			"</table></td></tr>";
		output += "</table>";
		showDataArea(spanName, output, false);
		$("table.anesthesia_vit_io_table table tr:odd").css("background-color","#DFDFDF");
		$("table.anesthesia_vit_io_table table:last tr").css("background-color","#DFDFDF");
	});
}
function Anesthesia_loadSCIP(spanName)
{
	$MP.getJSON("bc_mp_mvs_scip_22", function(data){
		var output = "<table class='anesthesia_scip_table' style='width:98%;'>";
//		output += "<tr><td colspan='2'>Patient Location/Status: " +
//			data.SCIP.PT_LOCATION_STATUS + "</td></tr>";
		output += "<tr><td>";
		if (data.SCIP.INFORMED_CONSENT){
			output += "<img src='css/images/green_checkmark.png' style='width:20px;' />";
		}else{
			output += "<img src='css/images/red_x.png' style='width:20px;' />";
		}
		output += " <span>Informed Consent</span></td><td>";
		if (data.SCIP.SITE_MARKED){
			output += "<img src='css/images/green_checkmark.png' style='width:20px;' />";
		}else{
			output += "<img src='css/images/red_x.png' style='width:20px;' />";
		}
		output += " <span>Site Marked</span></td></tr>";
		output += "<tr><td>";
		if (data.SCIP.ANTIBIOTIC_GIVEN){
			output += "<img src='css/images/green_checkmark.png' style='width:20px;' />";
		}else{
			output += "<img src='css/images/red_x.png' style='width:20px;' />";
		}
		output += " <span>Antibiotic Given</span></td><td>";
		if (data.SCIP.NPO){
			output += "<img src='css/images/green_checkmark.png' style='width:20px;' />";
		}else{
			output += "<img src='css/images/red_x.png' style='width:20px;' />";
		}
		output += " <span>NPO after Midnight</span></td></tr>";
		output += "<tr><td>";
		if (data.SCIP.BETA_BLOCKER){
			output += "<img src='css/images/green_checkmark.png' style='width:20px;' />";
		}else{
			if (data.SCIP.BETA_BLOCKER_NA){
				output += "<img src='css/images/green_na_35percent.png' style='width:20px;' />";
			}else{
				output += "<img src='css/images/red_x.png' style='width:20px;' />";
			}
		}
		output += " <span>Beta Blocker</span></td><td>";
		if (data.SCIP.VTE_PROPHYLAXIS_DONE){
			output += "<img src='css/images/green_checkmark.png' style='width:20px;' />";
		}else{
			if (data.SCIP.VTE_PROPHYLAXIS_DONE_NA){
				output += "<img src='css/images/green_na_35percent.png' style='width:20px;' />";
			}else{
				output += "<img src='css/images/red_x.png' style='width:20px;' />";
			}
		}
		output += " <span>VTE Prophylaxis Done</span></td></tr>";
		output += "</table>";
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}
function Anesthesia_loadProblemList(spanName)
{
	$MP.getJSON("bc_mp_mvs_problems_21", function(data){
		var output = "<table class='anesthesia_problem_table' style='width:98%;'>";
		if (data.PROBLEM.REC.length == 0){
			output += "<tr><td>No Problems found.</td></tr>";
		}else{
			$.each(data.PROBLEM.REC, function(idx, rec){
				output += "<tr><td>" + rec.DESC;
				if (rec.START_DT_TM != ""){
					output += "&nbsp;<span class='onset_dt_tm'>[ Onset: " + rec.START_DT_TM + " ]</span>";
				}
				output += "</td></tr>";
			});
		}
		output += "</table>";
		showDataArea(spanName, output, false);
		$("table.anesthesia_problem_table tr:odd").css("background-color","#F0F0F0");
	},{seeJSON:0});
}
function Anesthesia_loadHistory(spanName)
{
	$MP.getJSON("bc_mp_mvs_med_surg_hx_19", function(data){
		var output = "<table class='anesthesia_med_surg_table' style='width:98%;'>" +
			"<tr class='anesthesia_med_surg_group_0'><td colspan='100%'>Medical History</td></tr>";
// Ticket 83705
		if (data.HISTORY.MED_HX[0].TYPE[0].NAME.length == 0 && data.HISTORY.MED_HX[0].TYPE[1].NAME.length == 0){
			output += "<tr><td colspan='100%'>No Medical History Found</td></tr>";
		}else{
		$.each(data.HISTORY.MED_HX[0].TYPE, function(g_idx, group){
				if (g_idx > 0 && group.REC_CNT > 0) {
					output += "<tr><td colspan='100%'>&nbsp;</td></tr>";
				}
				if (group.REC_CNT > 0) {
                    output += "<tr class='anesthesia_med_surg_group_0'><td colspan='100%'>" +
                        group.HX_TYPE + "</td></tr>";
                }
				$.each(group.NAME, function(d_idx, detail){
					output += "<tr class='anesthesia_med_surg_data_row'><td>" + detail.HX_NAME + 
						"</td><td>" + detail.HX_LINE + "</td></tr>";
				});
			});
//			$.each(data.HISTORY.MED_HX[0].TYPE, function(g_idx, group){
////				output += "<tr class='anesthesia_med_surg_group_1'><td colspan='100%'>" +
////					group.HX_TYPE + "</td></tr>";
//				$.each(group.NAME, function(d_idx, detail){
//					output += "<tr class='anesthesia_med_surg_data_row'><td>" + detail.HX_NAME + 
//						"</td><td>" + detail.HX_LINE + "</td></tr>";
//				});
//			});
// Ticket 83705
		}
		try{
		output += "<tr class='anesthesia_med_surg_group_0'><td colspan='100%'>Surgical History</td></tr>";
		if (data.HISTORY.SURG_HX[0].SURG_LIST.length == 0 && data.HISTORY.SURG_HX[0].ACTUAL_SURG_LIST.length == 0){
			output += "<tr><td colspan='100%'>No Surgical History Found</td>";
		}else{
			if (data.HISTORY.SURG_HX[0].SURG_LIST.length > 0){
				output += "<tr class='anesthesia_med_surg_group_2'><td colspan='100%'>Documented Surgeries</td></tr>";
				$.each(data.HISTORY.SURG_HX[0].SURG_LIST, function(g_idx, group){
//					output += "<tr class='anesthesia_med_surg_group_1'><td>" +
//						group.SURG_TYPE + "</td></tr>";
					$.each(group.SURGERY, function(d_idx, detail){
						output += "<tr class='anesthesia_med_surg_data_row'><td>" + detail.SURG_NAME + "</td><td>" + detail.SURG_DT + "</td></tr>";
					});
				});
			}
			if (data.HISTORY.SURG_HX[0].ACTUAL_SURG_LIST.length > 0){
				output += "<tr class='anesthesia_med_surg_group_2'><td colspan='100%'>SurgiNet Surgeries</td></tr>";
				$.each(data.HISTORY.SURG_HX[0].ACTUAL_SURG_LIST, function(idx, surg){
					output += "<tr class='anesthesia_med_surg_data_row'><td>" + surg.SURG_NAME + "</td><td>" + surg.SURG_DT + "</td></tr>";
				});
			}
		}
		}catch(exc){alert(exc.message);}
		
		output += "<tr class='anesthesia_med_surg_group_0'><td colspan='100%'>Admission Information </td></tr>";
		if (data.HISTORY.ADMISSIONDB[0].HX.length == 0){
			output += "<tr><td colspan='100%'>No Information Found in the Admission Database</td></tr>";
		}else{
			$.each(data.HISTORY.ADMISSIONDB[0].HX, function(h_idx, hx){
				if (hx.IS_FULL_ROW == 1){
					output += "<tr class='anesthesia_med_surg_data_row'><td colspan='100%'>" + hx.DESCRIPTION + "</td></tr>";
				}else{
					output += "<tr class='anesthesia_med_surg_data_row'><td>" + hx.DESCRIPTION + "</td><td>" + hx.VALUE + "</td></tr>";
				}
			});
		}
		output += "</table>";
		
		showDataArea(spanName, output, false);
		$("tr.anesthesia_med_surg_data_row:odd").css("background-color","#F0F0F0");
	},{seeJSON:0});
}
function Anesthesia_loadSocialHistory(spanName)
{
	$MP.getJSON("bc_mp_mvs_socialhx_20", function(data){
		var output = "<table class='anesthesia_social_hx_table' style='width:99%;'>";
		if (data.SOCIALHX.EVENTS.length == 0){
			output += "<tr><td>No Social History found.</td></tr>";
		}else{
			$.each(data.SOCIALHX.EVENTS, function(e_idx, event){
				output += "<tr><td>" + event.EVENT_NAME + "</td><td>" + event.EVENT_DT;
				if (event.RESULT.length > 0){
					output += "&nbsp;-&nbsp;"
					$.each(event.RESULT, function(r_idx, result){
						if (r_idx > 0){
							output += ";&nbsp;";
						}
						output += result.RESULT_VAL;
					});
				}
				output += "</td></tr>";
			});
		}
		output += "</table>";
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}
function Anesthesia_loadDocuments(spanName)
{
	$MP.getJSON("bc_mp_mvs_doc_25", function(data){
		var output = "<span class='encntr_id' style='display:none;'>" + data.DOCUMENTS.ENCNTR_ID +
			"</span><span class='person_id' style='display:none;'>" + data.DOCUMENTS.PERSON_ID +
			"</span><table class='anesthesia_docs_table' style='width:99%;'>";
		//print_r(data.DOCUMENTS);
        if (data.DOCUMENTS.CNT > 0){
			$.each(data.DOCUMENTS.GROUP, function(g_idx, group){
				output += "<tr><td colspan='100%'>" + group.DESCRIPTION + "</td></tr>";
				$.each(group.DOC, function(d_idx, doc){
					output += "<tr class='doc_row'><td><span class='event_id' style='display:none;'>" + doc.EVENT_ID + 
						"</span><span class='event_description' style='display:none;'>" + doc.TITLE + "</span>" + 
						doc.DATE + "</td><td>" +
						doc.TITLE + "</td></tr>";
				});
			});
		}else{
			output += "<tr><td>No documents found</td></tr>";
		}
		output += "</table>";
		showDataArea(spanName, output, false);
		$("table.anesthesia_docs_table tr.doc_row").css("cursor","pointer");
		$("table.anesthesia_docs_table tr.doc_row").click(function(){
			var p_id = $(this).parent().parent().parent().find("span.person_id").html();
			var e_id = $(this).parent().parent().parent().find("span.encntr_id").html();
			var evt_id = $(this).find("span.event_id").html();
			var t = $(this).find("span.event_description").html();
			openDocument(t, p_id, e_id, evt_id);
		});
	});
}

function print_r(printthis, returnoutput) {
    var output = '';

    if($.isArray(printthis) || typeof(printthis) == 'object') {
        for(var i in printthis) {
            output += i + ' : ' + print_r(printthis[i], true) + '\n';
        }
    }else {
        output += printthis;
    }
    if(returnoutput && returnoutput == true) {
        return output;
    }else {
        alert(output);
    }
}
