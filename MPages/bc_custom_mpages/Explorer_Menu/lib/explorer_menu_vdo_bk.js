
function getEvents()
{
	ExplorerMemu();
}

function ExplorerMemu(){

// Initialize the request object
var memuInfo = new XMLCclRequest();
// Get the response
memuInfo.onreadystatechange = function () {
	if (memuInfo.readyState == 4 && memuInfo.status == 200) {
		var jsonStr = memuInfo.responseText;
		var jsonObj = eval('(' + jsonStr + ')');
		
		var htmlBody = "";
		var memulength= jsonObj.EMEMU.MASTERFOLDER.length
		for(var i=0; i<memulength; i++)
		{
		
			var desc = jsonObj.EMEMU.MASTERFOLDER[i].DESC;
			var iType = 	jsonObj.EMEMU.MASTERFOLDER[i].ITEM_TYPE;
			var child_cnt = 	jsonObj.EMEMU.MASTERFOLDER[i].CHILD_CNT;
			  //htmlBody += "<li><span><strong>" + desc + Folder(" abcdefg") + "</strong></span>";
				htmlBody += Folder(desc)
			htmlBody += "<ul>"
			
				for (var j=0; j<child_cnt; j++) {
				var child_id = jsonObj.EMEMU.MASTERFOLDER[i].CHILDREC[j].CHILD_ID;
				var child_item = jsonObj.EMEMU.MASTERFOLDER[i].CHILDREC[j].CHILD_ITEM;
				var child_desc = jsonObj.EMEMU.MASTERFOLDER[i].CHILDREC[j].CHILD_DESC;
				var child_type = jsonObj.EMEMU.MASTERFOLDER[i].CHILDREC[j].CHILD_TYPE;
				
				
				if (child_type == 'M')
				{
				htmlBody += Folder(child_desc + " | " + child_id)
				
				
				htmlBody += "</li>"
				
				}
				if (child_type == 'P')
				{
				htmlBody += "<li><a onclick = 'javascript:Show_Report(\"" + child_item +  "\");'>" +  child_desc + "</a></li>"
				
				}
				
				 } //for j
								                 
			htmlBody += "</ul></li>"
					
		}	//for i				

 		
		// Insert the table into the patient information section;
		document.getElementById('tree').innerHTML  = htmlBody;
	
		$(function() {
			$("#tree").treeview({
				collapsed: true,
				animated: "medium",
				control:"#sidetreecontrol",
				persist: "location"
			});
		})
		

		}   //if
		

} //

//  Call the ccl progam and send the parameter string
memuInfo.open('GET', "bc_vdo_ExploreMenu_MP");
memuInfo.send("^MINE^");
		
	

	return;
} //end explorer memu function



function Folder (FolderName) 
{

return "<li><span><strong>" + FolderName + "</strong></span>";
}
	
	

function function_item (item_Name, item_Desc){
//return  "<li><a href='javascript:APPLINK(0,'discernreportviewer.exe','/PROGRAM=" + item_Name + "')'>" + item_Desc + "</a></li>"

//return "<li><a onclick = " + "Show_Report();>" +  item_Desc + "</a></li>"	

return "<li><a>" +  item_Desc + "</a></li>"	
} //function_item ||| not in use

function Show_Report(item_Name) {
			//javascript:APPLINK(0, 'discernreportviewer.exe',' /PROGRAM= CCLPROT');
	
		APPLINK(0, 'discernreportviewer.exe','/PROGRAM=' + item_Name);
		
		} //show_report
		
	

