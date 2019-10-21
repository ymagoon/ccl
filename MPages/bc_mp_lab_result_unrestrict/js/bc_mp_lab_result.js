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


			var sTextCCL = ""
			sTextCCL += "<div class = 'patient_info'>";
			sTextCCL +=  jsonObj.TEMP.PATIENT_NAME + "</div>";
			sTextCCL += "<form class = 'form_top'>"
			sTextCCL += "<input type='radio' name='optShowLab' value='optShowLab_ALL' checked = 'checked'>All Lab Results"
			sTextCCL += "<input type='radio' name='optShowLab' value='optShowLab_OUTREACH'>Outreach Labs Only"
			sTextCCL += "<input type='radio' name='optShowLab' value='optShowLab_BAYCARE'>Baycare Hospitals Only"
			sTextCCL +=	"</form>"
			
			//;chosing between list oor group view
			/*
			sTextCCL += "<div><form class = 'form_top'>"
			sTextCCL += "<input type='radio' name='optGroupListV' value='optGroupListV_Group' checked = 'checked'>Group View"
			sTextCCL += "<input type='radio' name='optGroupListV' value='optGroupListV_List'>List View"
			sTextCCL +=	"</form></div>" */
			
			
			sTextCCL += "<div class = 'form_top'>"
			sTextCCL += "<form class ='form_normalcy' name = 'form_normalcy'>"
			sTextCCL +=  "<input type='checkbox' name='chkNormalcy'id = 'chkNormalcy_ABN' value='ABN'/>  <font class = 'result_norm_abn'> Abnormal  </font>"
			sTextCCL +=  "<input type='checkbox' name='chkNormalcy' id = 'chkNormalcy_CRIT' value='CRIT'/>   <font class = 'result_crit'> Critical </font>"
			sTextCCL +=  "<input type='checkbox' name='chkNormalcy' id = 'chkNormalcy_HI'value='HI'/>  <font class = 'result_norm_hi'> High </font>"
			sTextCCL +=  "<input type='checkbox' name='chkNormalcy' id = 'chkNormalcy_LOW'value='LOW'/>  <font class = 'result_norm_low'> Low </font>"
			
			sTextCCL += "</form>"
			/*chosing between list oor group view*/
		/*	 sTextCCL += "<form class = 'form_view_type'>"

			sTextCCL += "<input type='radio' name='optGroupListV' value='optGroupListV_Group' >Group View"
			sTextCCL += "<input type='radio' name='optGroupListV' value='optGroupListV_List' checked = 'checked'>List View"
			sTextCCL +=	"</form>" */
			sTextCCL += "</div>"
			
			
	
			
			sTextCCL += "<table cellpadding='0' cellspacing='0' border='0' class='display' id='tbl_result' width='100%'>"
			
			sTextCCL += "<thead><tr><th>OUTREACH</th>"
			sTextCCL += "<<th>Group</th>"
			sTextCCL += "<<th>Normalcy</th>"
			sTextCCL += "<th>Event Date</th><th>Event</th><th>Result</th>";
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
				sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].OUTREACH + "</td>";
				sTextCCL += "<td>"  + jsonObj.TEMP.REC[i].FAMILY + "</td>";
				sTextCCL += "<td>" + jsonObj.TEMP.REC[i].NORMALCY + "</td>";
				sTextCCL += "<td>" + jsonObj.TEMP.REC[i].EVENT_DT + "</td>";
				sTextCCL += "<td>" + jsonObj.TEMP.REC[i].EVENT_TYPE + "</td>" ; 
				

				var result_class = "";
	
				
				if (jsonObj.TEMP.REC[i].NORMALCY == 'CRIT')
				{
					result_class = "result_crit"
				}
				else if (jsonObj.TEMP.REC[i].NORMALCY == 'HI')
				{
					result_class = "result_norm_hi"
				}
				else if (jsonObj.TEMP.REC[i].NORMALCY == 'LOW')
				{
					result_class = "result_norm_low"
				}
				else if (jsonObj.TEMP.REC[i].NORMALCY == 'ABN')
				{
					result_class = "result_norm_abn"
				}
				else
				{
					result_class = "result_normal"
				}



				sTextCCL +=  "<td><div class = '"  + result_class + "'>" + jsonObj.TEMP.REC[i].EVENT_RESULT +  "</div></td>";
				
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
						"iDisplayLength": 250, 
						"sScrollY": 480,
						"bJQueryUI": true,
						/*	"sDom": '<"H"Tfr>t<"F"ip>',	*/
						"sPaginationType": "full_numbers",
							"oLanguage": {       
						       "sLengthMenu": 'Display <select>'+            
						       '<option value="20">20</option>'+               
						       '<option value="50">50</option>'+                 
						       '<option value="100">100</option>'+  
						       '<option value="250">250</option>'+                   
						       '<option value="9999">All</option>'+                
						        '</select> records'
						        	} , 
						 "aoColumnDefs": [ 
						{ "bSearchable": false, "bVisible": false, "aTargets": [ 0, 2] }
						 /*cannot search column 0, 2 Outreach & 	Normalcy */
										 ]
										 
						
					
					} );
					
		   /*-------------;group the row by family, 2nd column, index 1 ----------------------------- *	   
					
			/*		$("#tbl_result").dataTable().rowGrouping({iGroupingColumnIndex:1}); */
					
				/*		var default_group_col = 1;
					
					 $("input:radio[name=optGroupListV]").change(function(){
						var optGroupListV_Value = $('input:radio[name=optGroupListV]:checked').val(); 
						if (optGroupListV_Value == 'optGroupListV_Group')
						{
							
								$("#tbl_result").dataTable().rowGrouping({    
									bExpandableGrouping: true,
					                iGroupingColumnIndex: default_group_col,
					                bHideGroupingColumn: false
								}); 
						}
						else
						{
				
						}
	
					});  */
				
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
				
				/*-------Normalacy Column Filter *-------------------------- */
			
				$("input:checkbox[name=chkNormalcy]").click(function(){
					/*var norm_filter_value = $('input:checkbox[name=chkNormalcy]:checked').val(); 
				/*	var norm_filter_value = $('input:checkbox[value=CRIT]:checked').val() */		
					
					
					var reg_exp = ''; 
					var checkboxs = document.getElementsByName('chkNormalcy');
					for(var i = 0, inp; inp = checkboxs[i]; i++)  {
						if (inp.type.toLowerCase() == 'checkbox'  && inp.checked) {
							reg_exp = reg_exp + inp.value + '|';
						}
					}
						
					$('#tbl_result').dataTable().fnFilter(reg_exp.slice(0, -1), 2, regexp = true ); 
							
					});	
				
			} );
		}   //if 1
		

} //

/*** finding the look back days **-----------* */
var nLookBackDays =  $("#cboLookBack").val() /* default nlook back day */
$("#cboLookBack").change(function() { 
	nLookBackDays = $("#cboLookBack").val()
	history.go(0); /*reload the page with the options selected */
	
	/* window.location.reload() //reload page w/ no options save */
});
/*===========================================*/

//  Call the ccl progam and send the parameter string
	cclInfo.open('GET', "bc_mp_lab_result_vdo"); 
/*	cclInfo.send("^MINE^, value($PAT_Personid$), ^14, D^");  */
	cclInfo.send('"MINE",value($PAT_Personid$), "' + nLookBackDays + '\"');
/*cclInfo.send("^MINE^, 7790716.00") */

	return;
} //end explorer memu function


