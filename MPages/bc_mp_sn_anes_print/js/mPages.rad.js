function Rad_loadRadiology(spanName)
{
	$MP.getJSON("bc_mp_mvs_rad_9",function(data){
		var output = "<table class='radiology_table' style='width:99%;'>";
		if (data.CATORDS.OCNT > 0){
			$.each(data.CATORDS.OLIST, function(idx, order){
				output += "<tr class='section_header'><td colspan='100%'>" +
					order.CAT_DISP + "</td></tr>";
				$.each(order.QUAL, function(q_idx, qual){
					output += "<tr class='data_row'><td><table style='width:100%;'>" +
						"<tr class='section_sub_header'><td colspan='2'>" +
						qual.ACTIVITY_TYPE + "</td></tr><tr><td colspan='2'>";
					if (qual.EVENT_ID > 0){
						output += "<span class='open_document'><span class='person_id'>" +
							data.CATORDS.PERSON_ID + "</span><span class='encntr_id'>" +
							data.CATORDS.ENCNTR_ID + "</span><span class='event_id'>" +
							qual.EVENT_ID + "</span>" + qual.DISPLAY + "</span>";
					}else{
						output += qual.DISPLAY;
					}
					output += "</td></tr><tr class='data_details'><td>" +
						qual.ORD_STATUS + "</td><td>" +
						qual.START_DATE + "</td></tr></table></td></tr>";
				});
			});
		}else{
			output += "<tr><td>No Radiology Results Found</td></tr>";
		}
		output += "</table>";
		showDataArea(spanName, output, false);
		$("#" + spanName + " span.open_document").click(function(){
			var enc_id = $(this).find("span.encntr_id").text();
			var p_id = $(this).find("span.person_id").text();
			var evt_id = $(this).find("span.event_id").text();
			openDocument("Radiology", p_id, enc_id, evt_id);
		});
	});
}
