
function GetIsolation(){

// Initialize the request object
var cclInfo = new XMLCclRequest();
// Get the response
cclInfo.onreadystatechange = function () {
	if (cclInfo.readyState == 4 && cclInfo.status == 200) { //if 1
		var jsonStr = cclInfo.responseText;
		var jsonObj = eval('(' + jsonStr + ')');

			// Insert the table into the patient information section;
			
			var sTextCCL  = jsonObj.ISOLATION.ISOLATION;
	
			
			document.getElementById('isolation_notes').innerHTML  = "<div class = 'isolation'>" +  sTextCCL + "</div>";
		}   //if 1
		

} //

//  Call the ccl progam and send the parameter string
cclInfo.open('GET', "bc_mp_ed_gv_iso");
cclInfo.send("^MINE^, value($VIS_Encntrid$)");

	return;
} 


