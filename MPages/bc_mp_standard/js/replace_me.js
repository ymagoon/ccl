function getEvents()
{
	test();
	SuspendedCharges();
}

function SuspendedCharges(){

// Initialize the request object
var cclInfo = new XMLCclRequest();
// Get the response
cclInfo.onreadystatechange = function () {
	if (cclInfo.readyState == 4 && cclInfo.status == 200) { //if 1
		var jsonStr = cclInfo.responseText;
		var jsonObj = eval('(' + jsonStr + ')');

			// Insert the table into the patient information section;
			var ccl_length = jsonObj.TEMP.TEST.length
			
		
			var sTextCCL  = "";
	
	
		
			for(var i=0; i<ccl_length; i++)
			{	
				
				if(i == 0)
				{
				sTextCCL += "<b>" + jsonObj.TEMP.TEST[i].TEST_HELLO + "</b>"
			
				}
				else
				{
				sTextCCL += jsonObj.TEMP.TEST[i].TEST_HELLO; 
				}
				sTextCCL += "<div></div>"
			}
			
			document.getElementById('display_text2').innerHTML  = sTextCCL;
		}   //if 1
		

} //

//  Call the ccl progam and send the parameter string
cclInfo.open('GET', "bc_mpage_test_vdo");
cclInfo.send("^MINE^");
		
	
	return;
} //end explorer memu function



function test() {
	document.getElementById('display_text').innerHTML  = "This text comes from the Javascript file";
	return;
			}
