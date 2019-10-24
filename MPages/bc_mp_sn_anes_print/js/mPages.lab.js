function Lab_loadResults(spanName)
{
	$MP.getJSON("bc_mp_mvs_lab_7", function(data){
		var results_found = false;
		var output = "<table class='lab_results_table' style='width:99%;'>";
		
		try{
		if (data.LAB_RESULT.ORD_CNT > 0){
			results_found = true;
			output += "<tr><td colspan='100%'>General Lab Results</td></tr>";
			$.each(data.LAB_RESULT.ORDER_INFO, function(idx, order_info){
				output += "<tr><td colspan='100%'>" + order_info.ORD_MNEM + "</td></tr>";
				$.each(order_info.RESULT, function(r_idx, result){
					output += "<tr><td colspan='100%'><span style='font-weight:bold;'>" + result.EVENT_DESC + "</span> - " +
						"<span style='color:" + result.COLOR + ";'>" +
						result.RESULT_VAL + " " + result.NORM_VAL + "</span> [" +
						result.RESLT_DT_TM + "]</td></tr>";
				});
			});
		}
		
		
		if (data.LAB_RESULT.MICRO_CNT > 0){
			results_found = true;
			var act_type = "";
			$.each(data.LAB_RESULT.MICRO_ORDER, function(cat_idx, cat){
				output += "<tr><td colspan='100%' style='font-weight:bold'>" +
					cat.CAT_DISP + "</td></tr>";
					
				$.each(cat.ORDERS, function(o_idx, order){
					if (order.ACTIVITY_TYPE != act_type){
						output += "<tr><td colspan='100%' style='text-align:center;font-weight:bold;'>" +
							order.ACTIVITY_TYPE + "</td></tr>";
						act_type = order.ACTIVITY_TYPE;
					}
					output += "<tr><td>" + order.START_DATE +
						"</td><td>" + order.DISPLAY + "</td></tr>";
				});
			});
		}
		}catch(exc){alert(exc.message);}
		
		if (!results_found){
			output += "<tr><td>No Results Found</td></tr>";
		}
		output += "</table>";
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}
