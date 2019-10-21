
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

		htmlBody += DisplayMasterFolder(jsonObj)

 		
		// Insert the table into the patient information section;
		document.getElementById('tree').innerHTML  = htmlBody;
	
		var html2 =  "<li><a onclick = 'javascript:Show_Report(\"" + "test" +  "\");'>" +  "testing" + "</a></li>";
	
		
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
memuInfo.send("^MINE^, value($USR_PersonId$)");
		
	

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
		
	
function DisplayMasterFolder(DataSet) {
			var memulength= DataSet.EMEMU.MASTERFOLDER.length;
			
			var htmlBody = "";
	for(var i=0; i<memulength; i++)
		{
			var id = DataSet.EMEMU.MASTERFOLDER[i].ID;
			var pid = DataSet.EMEMU.MASTERFOLDER[i].PARENT_ID;
			var desc = DataSet.EMEMU.MASTERFOLDER[i].DESC;
			var item = DataSet.EMEMU.MASTERFOLDER[i].ITEM;
			var iType = DataSet.EMEMU.MASTERFOLDER[i].ITEM_TYPE;
		
				if (iType == 'M' && pid == 0)
				{
				htmlBody += Folder(desc)
				htmlBody += "<ul>" //must have ul if M
					htmlBody +=	display_child(DataSet, id);
				htmlBody += "</ul></li>"
				} //if
		
		} //for
	
			
	return htmlBody;
			} //function

function display_child(DataSet, parentID) {
			
			var memulength= DataSet.EMEMU.MASTERFOLDER.length;
			var htmlBody = "";
	for(var i=0; i<memulength; i++)
		{
			var id = DataSet.EMEMU.MASTERFOLDER[i].ID;
			var pid = DataSet.EMEMU.MASTERFOLDER[i].PARENT_ID;
			var desc = DataSet.EMEMU.MASTERFOLDER[i].DESC;
			var item = DataSet.EMEMU.MASTERFOLDER[i].ITEM;
			var iType = DataSet.EMEMU.MASTERFOLDER[i].ITEM_TYPE;
		
				
				if (parentID == pid)
				{
					if (iType == 'P') {
				htmlBody +=  "<li><a title = '" + item + "' onclick = 'javascript:Show_Report(\"" +  item+ "\");'>" + desc + "</a></li>";
									 }
									 
					if (iType == 'M') {
						htmlBody += Folder(desc)
						htmlBody += "<ul>" //must have ul if M
							htmlBody +=	display_child(DataSet, id);
						htmlBody += "</ul></li>"
										}
					
				}
			
		
		} //for
	
			
	return htmlBody;
			
	//return "<li><a onclick = 'javascript:Show_Report(\"" +  "test" +  "\");'>" +  "test1234" + "</a></li>";
			
					}
