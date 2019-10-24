function Medication_loadActiveHomeMeds(spanName)
{
	$MP.getJSON("bc_mp_mvs_homemed_15",function(data){
		var output = "<table class='homemed_table' style='width:99%;'>";
		
		if (data.HOMEMED.HXMEDS.length > 0){
			var donePrescriptionsFlag = false;
			var doneDocMedFlag = false;
			$.each(data.HOMEMED.HXMEDS, function(idx, hxmed){
				if (hxmed.TYPE_FLAG == 1 && donePrescriptionsFlag == false){
					output += "<tr><td colspan='100%'><strong>Prescriptions</strong></td></tr>";
					donePrescriptionsFlag = true;
				}else{
					if(hxmed.TYPE_FLAG == 2 && doneDocMedFlag == false){
						output += "<tr><td colspan='100%'><strong>Documented Medications by Hx</strong></td></tr>";
						doneDocMedFlag = true;
					}
				}
				output += "<tr class='data_row'><td><table><tr><td><strong>" + hxmed.ORDER_AS_MNEM + "</strong></td><td>" +
					hxmed.ORIG_DT_TM + "</td></tr><tr><td>" + (hxmed.STRNGTH_DOSE != ""?hxmed.STRNGTH_DOSE:hxmed.VOLUME_DOSE) +
					"</td><td>" + hxmed.FREQ + "</td></tr><tr><td>" + 
					(hxmed.PRN == 1?"PRN: " + hxmed.PRN_INSTRUC:"") + "</td><td>" +
					(hxmed.TYPE_FLAG == 1?hxmed.DISP_QTY:"") + "</td></tr></table></td></tr>";
			});
		}else{
			output += "<tr><td>No Home Meds Documented</td></tr>";
		}
		output += "</table>";
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}
