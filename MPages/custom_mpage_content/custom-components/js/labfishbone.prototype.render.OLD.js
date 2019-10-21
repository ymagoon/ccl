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

	//$.getScript('I:/WININTEL/static_content/mp_mvs_anesthesia/js/jquery.tooltip.min.js', function(){     
	//	// alert("Script loaded and executed.");    // here you can use anything you defined in the loaded script 
	//	 
	//
	//	  
	//	
	// });  
	// 
	// 	 	$("td.anesthesia_lab_graph").tooltip({
	//		delay:0,
	//		showURL:false,
	//		bodyHandler: function(){
	//			var val = $(this).find("span.anesthesia_lab_values").html();
	//			var dates = $(this).find("span.anesthesia_lab_dates").html().split(";");
	//			var values = val.split(";");
	//			var title = $(this).find("span.anesthesia_lab_description").html();
	//			var o = "<table><tr><td style='text-align:center;font-weight:bold;font-size:10px;'>" + title + "</td></tr><tr><td><table cellspacing='0' cellpadding='0'>";
	//			$.each(values, function(idx, value){
	//				o += "<tr style='font-size:10px;border:1px solid black;'><td>" + dates[idx] + "</td><td style='width:5px;'>&nbsp;</td><td>" + value + "</td></tr>";
	//			});
	//			o += "</table></td><td></td></tr></table>";
	//			return o;
	//		}
	//	});  
	
	/* ==================== */
		
	

} //;end render
