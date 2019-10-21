function General_loadChiefComplaint(spanName)
{
	$MP.getJSON("bc_mp_mvs_chief_5", function(data){
		var output = "<table class='chief_complaint_table' style='width:99%;'>";
		output += "<tr class='data_row'><td><span class='highlight'>Chief Complaint:</span> " + data.CHIEF.CHIEF_COMPLAINT + "</td></tr>";
		output += "<tr class='data_row'><td><span class='highlight'>Visit Reason:</span> " + data.CHIEF.REASONVISIT + "</td></tr>";
		output += "<tr class='data_row'><td><span class='highlight'>ED Arrival:</span> " + data.CHIEF.ED_ARRIVAL + "</td></tr>";
		output += "<tr class='data_row'><td><span class='highlight'>LOS:</span> " + data.CHIEF.LOS + "</td></tr>";
		output += "<tr class='data_row'><td><span class='highlight'>Arrival Mode:</span> " + data.CHIEF.MODEOFARRIVAL + "</td></tr>";
		if (data.CHIEF.PHY_CNT > 0){
			$.each(data.CHIEF.PHYSLIST, function(idx, physician){
				output += "<tr class='data_row'><td><span class='highlight'>" + physician.PHYS_TYPE + ":</span> " + physician.PHYS_NAME + "</td></tr>";
			});
		}
		output += "</table>";
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}
function General_loadAllergies(spanName)
{
	$MP.getJSON("bc_mp_mvs_allergy_13",function(data){
		var output = "<table class='allergy_table' style='width:99%;'>";
		if (data.ALLERGY.REC.length > 0){
			$.each(data.ALLERGY.REC, function(idx, allergy){
				output += "<tr class='data_row'><td><table style='width:100%;'>";
				if (allergy.ALLERGY_NAME != ""){
					output += "<tr class='allergy_name'><td>" + allergy.ALLERGY_NAME + "</td></tr>";
				}
				if (allergy.FREETEXT != ""){
					output += "<tr><td>" + allergy.FREETEXT + "</td></tr>";
				}
				if (allergy.ALLERGY_DETAILS.length > 0){
					output += "<tr><td>Reaction(s): ";
					$.each(allergy.ALLERGY_DETAILS, function(d_idx, detail){
						if (d_idx > 0){
							output += " g ";
						}
						output += detail.REACTION;
					});
					output += "</td></tr>";
				}
				output += "</table></td></tr>";
			});
		}else{
			output += "<tr class='data_row'><td>No Allergies Recorded</td></tr>";
		}
		output += "</table>";
		showDataArea(spanName, output, false);
	},{seeJSON:0});
}
function General_loadOrders(spanName)
{
	$MP.getJSON("bc_mp_mvs_orders_14",function(data){
		var titlePrinted = false;
		var activeOrdersExist = false;
		var completedOrdersExist = false;
		var output = "<table class='orders_table' style='width:99%;'>" +
			"<tr class='order_group_header'><td>Active Orders</td></tr>";
		$.each(data.ORDERS.CLIN_CAT, function(idx, order){
			titlePrinted = false;
			$.each(order.O_QUAL, function(d_idx, detail){
				if (!(detail.ORDER_STATUS == "Completed" || detail.ORDER_STATUS == "Discontinued")){
					if (!(titlePrinted)){
						titlePrinted = true;
						activeOrdersExist = true;
						output += "<tr class='data_row'><td><table style='width:100%;'>" +
							"<tr class='order_name'><td colspan='100%'>" + order.C_LINE + "</td></tr>";
					}
					output += "<tr><td><span style='color:" + detail.COLOR + ";'>" +
						"<strong>" + detail.MNEM + "</strong>: " + detail.D_LINE + "</td><td>" +
						detail.COMMENT + "</td><td>" + detail.O_DATE + "</td><td>" + 
						detail.ORD_PROV + "</td></tr>";
				}
			});
			if (titlePrinted){
				output += "</td></tr></table>";
			}
		});
		if (!(activeOrdersExist)){
			output += "<tr><td>No Active Orders</td></tr>";
		}
		
		output += "<tr><td>&nbsp;</td></tr><tr class='order_group_header'><td>Completed/DC'd Orders</td></tr>";
		$.each(data.ORDERS.CLIN_CAT, function(idx, order){
			titlePrinted = false;
			$.each(order.O_QUAL, function(d_idx, detail){
				if (!(detail.ORDER_STATUS == "Completed" || detail.ORDER_STATUS == "Discontinued")){
					if (!(titlePrinted)){
						titlePrinted = true;
						completedOrdersExist = true;
						output += "<tr class='data_row'><td><table style='width:100%;'>" +
							"<tr class='order_name'><td colspan='100%'>" + order.C_LINE + "</td></tr>";
					}
					output += "<tr><td><span style='color:" + detail.COLOR + ";'>" +
						"<strong>" + detail.MNEM + "</strong>: " + detail.D_LINE + "</td><td>" +
						detail.COMMENT + "</td><td>" + detail.O_DATE + "</td><td>" + 
						detail.ORD_PROV + "</td></tr>";
				}
			});
			if (titlePrinted){
				output += "</td></tr></table>";
			}
		});
		
		if (!(completedOrdersExist)){
			output += "<tr><td>No Completed/DC'd Orders</td></tr>";
		}

		output += "</table>";
		showDataArea(spanName, output, false);
	});
}
function General_loadNursingDocumentation(spanName)
{
	$MP.getJSON("bc_mp_mvs_doc_8", function(data){
		var output = "<table class='nursing_docs_table' style='width:99%;'>";
		if (data.DOCUMENTS.CNT > 0){
			$.each(data.DOCUMENTS.GROUP, function(idx, group){
				if (idx > 0){
					output += "<tr><td colspan='100%'>&nbsp;</td></tr>";
				}
				output += "<tr class='section_header'><td colspan='100%'>" + group.DESCRIPTION + "</td></tr>";
				$.each(group.DOC, function(d_idx, doc){
					output += "<tr class='data_row'><td><table style='width:100%;'><tr><td colspan='2'>" + 
						"<span class='open_document'><span class='encntr_id'>" + data.DOCUMENTS.ENCNTR_ID +
						"</span><span class='person_id'>" + data.DOCUMENTS.PERSON_ID +
						"</span><span class='event_id'>" + doc.EVENT_ID +"</span>" +
						doc.TITLE + "</span>" +
						"</td></tr><tr class='detailed_row'><td>" + doc.DATE +
						"</td><td>" + doc.AUTHOR + "</td></tr></table></td></tr>";
				});
			});
		}else{
			output += "<tr><td>No Nursing Documentation Found</td></tr>";
		}
		output += "</table>";
		showDataArea(spanName, output, false);
		
		$("#" + spanName + " span.open_document").click(function(){
			var enc_id = $(this).find("span.encntr_id").text();
			var p_id = $(this).find("span.person_id").text();
			var evt_id = $(this).find("span.event_id").text();
			openDocument("Nursing Documentation", p_id, enc_id, evt_id);
		});
	},{seeJSON:0});
}
