function getEvents()
{

	Lab_Result();
}

function Lab_Result(){

// Initialize the request object
var cclInfo = new XMLCclRequest();
// Get the response
cclInfo.onreadystatechange = function () {
	if (cclInfo.readyState == 4 && cclInfo.status == 200) { //if 1
		var jsonStr = cclInfo.responseText;
		var jsonObj = eval('(' + jsonStr + ')');

			// Insert the table into the patient information section;
			var ccl_length = jsonObj.TEMP.REC.length
			
		
			var sTextCCL  = "<b> Lab Result for: ";
			sTextCCL +=  jsonObj.TEMP.PATIENT_NAME + "</b>";
			
			sTextCCL += "<form>"
			sTextCCL += "<input type='radio' name='optShowLab' value='optShowLab_ALL' checked = 'checked'>All Lab Results"
			sTextCCL += "<input type='radio' name='optShowLab' value='optShowLab_OUTREACH'>Outreach Only"
			sTextCCL += "<input type='radio' name='optShowLab' value='optShowLab_BAYCARE'>Baycare Only"
			sTextCCL +=	"</form>"
			
			sTextCCL += "<table cellpadding='0' cellspacing='0' border='0' class='display' id='tbl_result' width='100%'>"
			
		sTextCCL += "<thead><tr><th>OUTREACH</th><th>Event Date</th><th>Event</th><th>Result</th>";
		sTextCCL += "<th>Ref. Range</th><th>Status</th></tr></thead>"
		sTextCCL += "<tbody>"
				for(var i=0; i<ccl_length; i++)
			{	
				
				if (i%2 ==1)
				{
				
				sTextCCL += "<tr class='odd gradeA'>";
				}
				else
				{
				sTextCCL += "<tr class='even gradeA'>";
				
				}
				sTextCCL +=  "<td>"  + jsonObj.TEMP.REC[i].OUTREACH + "</td>";
				sTextCCL += "<td>" + jsonObj.TEMP.REC[i].EVENT_DT + "</td>";
				sTextCCL += "<td>" + jsonObj.TEMP.REC[i].EVENT_TYPE + "</td>" ; 
				sTextCCL +=  "<td>" + jsonObj.TEMP.REC[i].EVENT_RESULT +  "</td>";
				
				if (jsonObj.TEMP.REC[i].NORMAL_LOW > '')		
				{		
				sTextCCL +=  "<td>(" + jsonObj.TEMP.REC[i].NORMAL_LOW + ' - ' + jsonObj.TEMP.REC[i].NORMAL_HIGH + ")</td>";
				}
				else
				{
				sTextCCL +="<td></td>"
				}
				
				sTextCCL +=  "<td>"  + jsonObj.TEMP.REC[i].EVENT_STATUS + "</td>";
				sTextCCL += "</tr>";
			}
			
		
			sTextCCL += "</tbody></table>"
			document.getElementById('container').innerHTML  =  sTextCCL;
			
			$(document).ready(function() {
			
			/*------------- initilizing the table for data table------------------ */
					$('#tbl_result').dataTable( {
						"iDisplayLength": ccl_length, 
						"sScrollY": 480,
						"bJQueryUI": true,
						"sPaginationType": "full_numbers"
						
					} );
					
					
					
				/*-------------;radio option for lab result ----------------------------- */
					
					$("input:radio[name=optShowLab]").change(function(){
					var optShowLab_value = $('input:radio[name=optShowLab]:checked').val(); 
					
					if (optShowLab_value == 'optShowLab_BAYCARE')
					{
						$('#tbl_result').dataTable().fnFilter('0', 0, regexp = true ); 
					}
					else if	(optShowLab_value == 'optShowLab_OUTREACH')
					{
						$('#tbl_result').dataTable().fnFilter('1', 0, regexp = true ); 
					}
					else
					{
						$('#tbl_result').dataTable().fnFilter('', 0, regexp = true ); 
					}
					
					});	
				/*------------------------------------------------ */
			} );
			
			
			
	






		}   //if 1
		

} //

//  Call the ccl progam and send the parameter string
cclInfo.open('GET', "bc_mp_lab_result_vdo");
	cclInfo.send("^MINE^, value($PAT_Personid$)");
;;cclInfo.send("^MINE^, 7790716.00"); 

	return;
} //end explorer memu function




