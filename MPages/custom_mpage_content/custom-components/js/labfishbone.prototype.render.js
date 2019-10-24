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
