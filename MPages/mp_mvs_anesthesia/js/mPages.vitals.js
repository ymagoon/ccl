function Vitals_loadVitalSigns(spanName)
{
	$MP.getJSON("bc_mp_mvs_vitals_16",function(data){
		var output = "<table class='vitals_table' style='width:99%;'>";
		if (data.VITALS.LMP){
			output += "<tr class='data_row'><td><table style='width:100%;'>" +
				"<tr><td colspan='100%'><strong>Last Menstrual Period</strong></td></tr>" +
				"<tr><td>" + jsonPatinfo.VITALS.LMP +
	  			"</td></tr></table></td></tr>";
		}
		output += writeVitalLine('SPO2', data.VITALS.SPO2, data.VITALS.SPO2_DT_TM, data.VITALS.SPO22, data.VITALS.SPO22_DT_TM)
		output += writeVitalLine('Temperature Oral', data.VITALS.TEMP1_PO_F, data.VITALS.TEMP1_PO_DT_TM, data.VITALS.TEMP2_PO_F, data.VITALS.TEMP2_PO_DT_TM)
		output += writeVitalLine('Temperature Axillary', data.VITALS.TEMP1_AX_F, data.VITALS.TEMP1_AX_DT_TM, data.VITALS.TEMP2_AX_F, data.VITALS.TEMP2_AX_DT_TM)
		output += writeVitalLine('Temperature Rectal', 	data.VITALS.TEMP1_RC_F, data.VITALS.TEMP1_RC_DT_TM, data.VITALS.TEMP2_RC_F, data.VITALS.TEMP2_RC_DT_TM)
		output += writeVitalLine('Temperature Temporal Artery', data.VITALS.TEMP1_TO_F, data.VITALS.TEMP1_TO_DT_TM, data.VITALS.TEMP2_TO_F, data.VITALS.TEMP2_TO_DT_TM)
		output += writeVitalLine('Heart Rate Monitored', data.VITALS.HR1_MON, data.VITALS.HR1_MON_DT_TM, data.VITALS.HR2_MON, data.VITALS.HR2_MON_DT_TM)
		output += writeVitalLine('Apical Heart Rate', 	data.VITALS.AP_HR1, data.VITALS.AP_HR1_DT_TM, data.VITALS.AP_HR2, data.VITALS.AP_HR2_DT_TM)
		output += writeVitalLine('Pulse Rate', 	data.VITALS.PRMON1, data.PRMON1_DT_TM, data.VITALS.PRMON2, data.VITALS.PRMON2_DT_TM)
		output += writeVitalLine('Peripheral Pulse Rate', data.VITALS.PPR1, data.VITALS.PPR1_DT_TM, data.VITALS.PPR2, data.VITALS.PPR2_DT_TM)
		output += writeVitalLine('Brachial Pulse', 		data.VITALS.BRACH1, data.VITALS.BRACH1_DT_TM, data.VITALS.BRACH2, data.VITALS.BRACH2_DT_TM)
		output += writeVitalLine('Femoral Pulse Rate', 	data.VITALS.FEMPR1, data.VITALS.FEMPR1_DT_TM, data.VITALS.FEMPR2, data.VITALS.FEMPR2_DT_TM)
		output += writeVitalLine('Respiratory Rate', 	data.VITALS.RESPRT1 + ' br/min', 
			data.VITALS.RESPRT1_DT_TM, data.VITALS.RESPRT2 + ' br/min', data.VITALS.RESPRT2_DT_TM)
		output += writeVitalLine('Mean Arterial Pressure', 	data.VITALS.MAP1, 
			data.VITALS.MAP1_DT_TM, data.VITALS.MAP2, data.VITALS.MAP2_DT_TM)
		output += writeVitalLine('Blood Pressure', 		data.VITALS.SYSBP1 + '/' + data.VITALS.DIABP1 + ' mmHg', 
			data.VITALS.DIABP1_DT_TM, data.VITALS.SYSBP2 + '/' + data.VITALS.DIABP2 + ' mmHg', data.VITALS.DIABP2_DT_TM)
		output += writeVitalLine('Blood Pressure Supine', data.VITALS.SBPSUP1 + '/' + data.VITALS.DBPSUP1 + ' mmHg', 
			data.VITALS.SBPSUP1_DT_TM, data.VITALS.SBPSUP2 + '/' + data.VITALS.DBPSUP2 + ' mmHg', data.VITALS.SBPSTNG2_DT_TM)
		output += writeVitalLine('Pulse Supine', 	data.VITALS.PULSUP1, 
			data.VITALS.PULSUP1_DT_TM, data.VITALS.PULSUP2, data.VITALS.PULSUP2_DT_TM)
		output += writeVitalLine('Blood Pressure Sitting', data.VITALS.SBPSIT1 + '/' + data.VITALS.DBPSIT1 + ' mmHg', 
			data.VITALS.SBPSIT1_DT_TM, data.VITALS.SBPSIT2 + '/' + data.VITALS.DBPSIT2 + ' mmHg', data.VITALS.SBPSIT2_DT_TM)
		output += writeVitalLine('Pulse Sitting', 	data.VITALS.PULSIT1, 
			data.VITALS.PULSIT1_DT_TM, data.VITALS.PULSIT2, data.VITALS.PULSIT2_DT_TM)
		output += writeVitalLine('Blood Pressure Standing', data.VITALS.SBPSTNG1 + '/' + data.VITALS.DBPSTNG1 + ' mmHg', 
			data.VITALS.SBPSTNG1_DT_TM, data.VITALS.SBPSTNG2 + '/' + data.VITALS.DBPSTNG2 + ' mmHg', data.VITALS.SBPSTNG2_DT_TM)
		output += writeVitalLine('Pulse Standing', 	data.VITALS.PULSTNG1, 
			data.VITALS.PULSTNG1_DT_TM, data.VITALS.PULSTNG2, data.VITALS.PULSTNG2_DT_TM)
		output += writeVitalLine('Intracranial Pressure', 	data.VITALS.ICP1, 
			data.VITALS.ICP1_DT_TM, data.VITALS.ICP2, data.VITALS.ICP2_DT_TM)
		output += writeVitalLine('Cerebral Perfusion Pressure', 	data.VITALS.CCP1 + ' mmHg', 
			data.VITALS.CCP1_DT_TM, data.VITALS.CCP2 + ' mmHg', data.VITALS.CCP2_DT_TM)
		output += writeVitalLine('Intra Abdominal Pressure', 	data.VITALS.IAP1, 
			data.VITALS.IAP1_DT_TM, data.VITALS.IAP2, data.VITALS.IAP2_DT_TM)

		if(data.VITALS.PAIN1_DT_TM){
			output += "<tr class='data_row'><td><table style='width:100%;'>" +
				"<tr><td colspan='100%'><strong>Pain Assessment</strong></td></tr>" +
				"<tr><td>" + data.VITALS.PAIN1_DT_TM + "</td><td style='width:10px;'>&nbsp;</td>" +
				"<td style='width:100px;min-width:100px;text-align:left;'>Pain Score: " + data.VITALS.PAIN1 +
				"<br />Scale Used: " + data.VITALS.PAIN1_SCALE + (data.VITALS.PAIN1_LOCATION!=""?" " + data.VITALS.PAIN1_LOCATION:"") +
	  			"</td></tr>";
			if (data.VITALS.PAIN2_DT_TM){
				output += "<tr><td>" + data.VITALS.PAIN2_DT_TM + "</td><td style='width:10px;'>&nbsp;</td>" +
					"<td style='width:100px;min-width:100px;text-align:left;'>Pain Score: " + data.VITALS.PAIN2 +
					"<br />Scale Used: " + data.VITALS.PAIN2_SCALE + (data.VITALS.PAIN2_LOCATION!=""?" " + data.VITALS.PAIN2_LOCATION:"") +
		  			"</td></tr>";
			}
			output += "</table></td></tr>";
		}
		
		output += writeVitalLine('Weight', 	data.VITALS.DLY_WGT1, 
			data.VITALS.DLY_WGT1_DT_TM, data.VITALS.DLY_WGT2, data.VITALS.DLY_WGT2_DT_TM)
		output += writeVitalLine('Weight Estimated', 	data.VITALS.EST_WGHT1, 
			data.VITALS.EST_WGHT1_DT_TM, data.VITALS.EST_WGHT2, data.EST_WGHT2_DT_TM)

		if (data.VITALS.TETANUS_STATUS){
			output += "<tr class='data_row'><td><table style='width:100%;'>" +
				"<tr><td colspan='100%'><strong>Tetanus Status</strong></td></tr>" +
				"<tr><td>" + data.VITALS.TETANUS_STATUS +
	  			"</td></tr></table></td></tr>";
		}
				
		output += "</table>";
		
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}

function writeVitalLine(VS_Name, RecentValue, RecentDate, PreviousValue, PreviousDate){
	var s = "";
	if(RecentDate){
		s += "<tr class='data_row'><td><table style='width:100%;'>" +
			"<tr><td colspan='100%'><strong>" + VS_Name + "</strong></td></tr>" +
			"<tr><td>" + RecentDate + "</td><td style='width:10px;'>&nbsp;</td>" +
			"<td style='width:100px;min-width:100px;text-align:left;'>" + RecentValue +
			"</td></tr>";
		if (PreviousDate){
			s += "<tr><td>" + PreviousDate + "</td><td style='width:10px;'>&nbsp;</td>" +
			"<td style='width:100px;min-width:100px;text-align:left;'>" + PreviousValue +
			"</td></tr>";
		}
		s += "</table></td></tr>";
	}
	return s;
}
