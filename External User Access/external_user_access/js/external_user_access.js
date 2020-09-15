var jsonData = {};

function getEvents(){
	// Call functions to format html and populate sections
	getEUAPatients(false);
//	test();
}

function tabLink(personId, encntrId, firstTab) {
  var mode = 0;
  var appName = "Powerchart.exe";
  var params = "/PERSONID=" + personId + " /ENCNTRID=" + encntrId + " /FIRSTTAB=" + firstTab;
  
  APPLINK(mode, appName, params);
}

function getEUAPatients(checked){
	// Initialize the request object
	var request = new XMLCclRequest();

	// Get the response
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			var msgRequest = request.responseText;

 			if (msgRequest != undefined && msgRequest != null && msgRequest > " ") {
				jsonData = JSON.parse(msgRequest);
			}
			if (jsonData){		  
			  buildPatients(jsonData, checked);
			}
		};
	} //function

	//  Call the ccl progam and send the parameter string
	// request.open('GET', "avh_external_access_view");
	// request.send("mine");
	
	var params = ["^mine^", context.userId].join(",");

	request.open('GET', "avh_ext_usr_access");
	request.send(params);
	return;
}

function buildPatients(patients, checked) {
    var tableBody = [];
	tableBody.push(
		"<table id='patientTable' class='dataTable display'>",
			"<thead>",
				"<tr>",
//					"<th class='align-left'>Hide</th>",
					"<th class='align-left'>Name</th>",
					"<th class='align-left'>MRN</th>",
					"<th class='align-left'>FIN</th>",
					"<th class='align-left'>Admit Date</th>",
					"<th class='align-left'>Discharge Date</th>",
				"</tr>",
			"</thead>",
			"<tbody>"
	);
				
	for (var i = 0,aLen = patients.patList.length; i < aLen; i++) {
		var euiObj = patients.patList[i];

				// 1 = hidden
		if (checked || euiObj.hideFlag !== 1 ) {
			var params = [euiObj.personId, euiObj.encntrId, context.userId, 1].join(",");
						
			tableBody.push(
			  "<tr class='allergyRow'>",
//				"<td><input type='checkbox' class='hide' onclick=hidePatient(", params, ")>",
				"<td class='col1'><span class='menulink anteca_nowrap' onclick='tabLink(",euiObj.personId,",",euiObj.encntrId,",\"Documentation\")'>", euiObj.name, "</span></td>",
				"<td class='col1'>", euiObj.mrn,"</td>",
				"<td class='col2'>", euiObj.fin,"</td>",
				"<td class='col2'>", euiObj.admitDtTm,"</td>",
				"<td class='col2'>", euiObj.dischDtTm,"</td>",
			  "</tr>");
		}
	}  // end for
    
	// Close the table
	tableBody.push("</tbody></table><div class='hideCtrl'></div>");
    
	// Insert the table
	$("#bodyDiv").html(tableBody.join(""));
	
	$('#patientTable').DataTable({
		dom:'flrtip'
	});
} // end buildPatients




