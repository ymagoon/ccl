
function GetNursesNote(){

// Initialize the request object
var cclInfo = new XMLCclRequest();
// Get the response
cclInfo.onreadystatechange = function () {
	if (cclInfo.readyState == 4 && cclInfo.status == 200) { //if 1
		var jsonStr = cclInfo.responseText;
		var jsonObj = eval('(' + jsonStr + ')');


			// Insert the table into the patient information section;

		var ccl_length = jsonObj.TEMP.REC.length
		var sTextCCL = "";
		
		if (ccl_length == 0)
		{
		
			sTextCCL = "<div class = 'none_notes'>" + "No Result Found!" + "</div>";

		} 
		else
		{
			for(var i=0; i<ccl_length; i++)
			{
				//alert(jsonObj.TEMP.REC[i].NOTE_TYPE)
				sTextCCL += "<div  class = 'isolation'>" + jsonObj.TEMP.REC[i].NOTE_TYPE + "</div>";
				var z_length = jsonObj.TEMP.REC[i].NOTE.length
					for(var z=0; z<z_length; z++) 
					{
						var desc = jsonObj.TEMP.REC[i].NOTE[z].DESC;
				
						sTextCCL += "<div  class = 'none_notes'>" + desc;
						sTextCCL += "&nbspby&nbsp" + jsonObj.TEMP.REC[i].NOTE[z].AUTHOR;
						sTextCCL += "&nbsp@&nbsp" + jsonObj.TEMP.REC[i].NOTE[z].DT	 + "</div>";
					}
				
				
			}
		}
			
			
		document.getElementById('nurse_notes').innerHTML  =   sTextCCL
	}   //if 1
		

} //

//  Call the ccl progam and send the parameter string
cclInfo.open('GET', "bc_mp_ed_gv_notes");
;cclInfo.send("^MINE^, 50349186.00");
cclInfo.send("^MINE^, value($VIS_Encntrid$)");
	return;
} 


