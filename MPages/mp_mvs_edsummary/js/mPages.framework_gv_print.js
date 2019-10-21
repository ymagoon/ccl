/**
 * @File: mPages.framework.js
 * @Author: Edwin Hartman
 * @Company: MediView Solutions
 * @Created: 10/28/2010
 */

//Storage of variables commonly used 
var current_page = "";
var person_id = -1;
var encntr_id = -1;
var user_id = -1;
var patient_name = "";
var mrn = "";

$(document).ready(function(){ buildBasePage(); });

/**
 * @type Function
 * @param None
 * @returns None
 * Description: buildBasePage() builds the base page. It will first call the CCL initialize program 
 * which will return the settings for the current page, including the JS & CSS files that need to be loaded
 * Once all the files have been loaded, it will continue building the base page in function
 * continueLoadingBasePage()
 */
function buildBasePage(){
	var pageName = location.href;
	pageName = pageName.substring(pageName.lastIndexOf("/") + 1);
	if (pageName.indexOf("?") > -1){
		pageName = pageName.substring(0,pageName.indexOf("?"));
	}
	current_page = pageName;
	$MP.getJSON("bc_mp_mvs_init_0",function(data){
		person_id = data.INITIALIZE.PERSON_ID;
		encntr_id = data.INITIALIZE.ENCNTR_ID;
		user_id = data.INITIALIZE.USER_ID;
		patient_name = data.INITIALIZE.PATIENT_NAME;
		mrn = data.INITIALIZE.MRN;
	});
	try{
		$.get("data/page_settings_gv_print.json", function(data){
			var json = eval("(" + data + ")");
			if (json.INITIALIZE.PAGE_NAME == ""){
				showError("Page settings for page '" + pageName + "' not found. Please contact your system administrator.");
				return;
			}
		
			var f = new Array();
			f.push('js/jquery-ui-1.7.2-min.js');
			f.push('js/jquery.corners.min.js');
			f.push('js/jquery.tooltip.min.js');
			f.push('css/mPages.framework_gv.css');
			f.push('css/jquery-ui.css');
			f.push('css/jquery-ui-tab.css');
			f.push('css/jquery.tooltip.css');
						
			if (json.INITIALIZE.FILES.length > 0){
				
				$.each(json.INITIALIZE.FILES, function(f_idx, file){
					f.push(file.FILE_NAME);
				});
			}
			$.include(f, function(){continueLoadingBasePage(data);});
		});
	}catch(exc){
		showError("An error occurred while loading settings for page '" + pageName + "'. Please contact your administrator.<br /><br />" + exc.message);
	}
}

/**
 * @type Function
 * @param data
 * @returns None
 * Description: continueLoadingBasePage will load the skeleton of the page based on the return JSON
 * from the CCL initialize program.
 */
function continueLoadingBasePage(data){
	var json = eval("(" + data + ")");
		if (json.INITIALIZE.CHART_PAGE){
//			document.title = json.INITIALIZE.PAGE_TITLE + " - " +
//				json.INITIALIZE.PATIENT_NAME + " [ MRN:" + 
//				json.INITIALIZE.MRN + " ]";
			document.title = json.INITIALIZE.PAGE_TITLE + " - " +
				patient_name + " [ MRN:" + 
				mrn + " ]";
		}
		
}

/**
 * @type function
 * @param id
 * @param output
 * @param dataFound
 * @returns none
 * Description: function showDataArea should be used to populate the data areas on the screen with the actual data. The dataFound
 * parameter will populate the 'information' icon on the tab to indicate that data is available on the tab.
 */
function showDataArea(id, output, dataFound)
{

	id.innerHTML = output
	/*
	$("#" + id).find("div.mp_data_area_content").html(output);
	if (dataFound)
	{
		var tab_id = $("#" + id).parents("div.tab_div").attr("id");
		var tab_no = tab_id.substr(tab_id.lastIndexOf("_")+1);
		var tab_name = tab_id.substr(tab_id.indexOf("_")+1);
		$("#tabs").tabs("enable",tab_no);
		var current_tab_label = $("#tab_id_" + tab_name).html();
		if ($("#tab_id_" + tab_name).find("img.data_indicator").length == 0)
		{
			$("#tab_id_" + tab_name).html(current_tab_label + 
					" <img class='data_indicator' src='css/images/icon_info.gif' style='width:12px;' alt='Tab contains data'/>");
		}
	}
	$("#" + id + " div.mp_data_area_content table tr.data_row:even").css("background-color","#FFFFFF");
	$("#" + id + " div.mp_data_area_content table tr.data_row:odd").css("background-color","#E8E8E8");
	$("#" + id + " div.mp_data_area_content table tr.navigation_row td.prev_data_button").css("cursor","pointer");
	$("#" + id + " div.mp_data_area_content table tr.navigation_row td.next_data_button").css("cursor","pointer");
	*/
	
	
	
}

function showLoadingDataArea(id){
	$("#" + id).find("div.mp_data_area_content").html("Loading...");
}

function showErrorLoadingDataArea(id){
	$("#" + id).find("div.mp_data_area_content").html("Error loading data");
}

function generateNavigationRow(more_data, index, skip_col){
	var output = "";
	if (more_data || index > 0){
		output += "<tr style='height:2px;'><td colspan='100%'></td></tr>";
		output += "<tr class='navigation_row'><td colspan='" + skip_col + "'>&nbsp;</td>";
		if (index > 0){
			output += "<td colspan='2' class='prev_data_button'><-- Previous</td>";
		}else{
			output += "<td colspan='2'>&nbsp;</td>";
		}
		output += "<td>&nbsp;</td>";
		if (more_data){
			output += "<td colspan='2' class='next_data_button'>Next --></td>";
		}else{
			output += "<td colspan='2'>&nbsp;</td>";
		}
		output += "</tr>";
	}
	return output;
}

function enableMinimizeDataArea(){
	$("img.minimize_data_area").click(function(){
		var t = $(this).attr("title");
		if (t != "Expand"){
			$(this).attr("title","Expand");
			$(this).parent().parent().find("div.mp_data_area_content").each(function(){
				$(this).css("display","none");
			});
			$(this).parent().find("img.refresh_data_area").css("display","none");
			$(this).attr("src","css/images/icon_expand.png");
		}else{
			$(this).attr("title","Collaps");
			var h = 50;
			$(this).parent().parent().find("div.mp_data_area_content").each(function(){
				$(this).css("display","block");
				h = $(this).height();
			});
			$(this).parent().find("img.refresh_data_area").css("display","block");
			$(this).attr("src","css/images/icon_min.png");
		}
	});
}
function showError(errorMessage){
	if (document.getElementById("popup_error_message") == null)
	{
		$(document.body).prepend("<div id='popup_error_message'></div>");
	}else {
		output = $("#popup_error_message").html();
	}
	output += "<br /><input id='err_msg_close_button' type='button' value='Close'></input>";
	$("#popup_error_message").html(output);
	$("#err_msg_close_button").click(function(){
		$("#backgroundPopup").fadeOut("slow");
		$("#popup_error_message").css("display","none");
		$("#popup_error_message").html("");
	});
	fadeBackground();
	$("#popup_error_message").css("display","block");
	$("#popup_error_message").css("left", "50px");
	$("#popup_error_message").css("top", (document.documentElement.scrollTop + 50) + "px");	
}
function generateStandardTrending(event_cd){
	$.get("data/trending_" + event_cd + ".json",function(d1){
		var data = eval("(" + d1 + ")");
		if (document.getElementById("trending_div") == null){
			$(document.body).prepend("<div id='trending_div' style='width:600px;height:400px;position:absolute;"+
				"top:100px;left:100px;z-index:999;background-color:silver;border:1px black solid;spacing:3px;display:none;'>" +
				"<span id='trending_title_span' style='width:600px;text-align:center;font-size:1.4em;'>" + data.TRENDING.DESCRIPTION + "</span>" +
				"<div id='trending_details_div' style='width:600px;height:370px;background-color:white;'></div></div>");
		}else{
			$("#trending_div").html("<div id='trending_details_div'></div>");
			$("#trending_div").css("display","none");
		}
		var data_array = new Array();
		
		$.each(data.TRENDING.VALUES, function(idx, value){
			var d = new Date(value.DT_TM.substr(6,4),value.DT_TM.substr(0,2),value.DT_TM.substr(3,2),
				value.DT_TM.substr(11,2),value.DT_TM.substr(14,2),0,0);
			data_array.push([d.getTime() + (60*60*1000*getTimezoneDifference()), value.VALUE]);
		});
		
		$("#trending_div").css("display","block");
		try{
		var plot = $.plot($("#trending_details_div"),[data_array],{
				xaxis:{
					mode:"time"
				}
			});
		}catch(ex){alert(ex.message);}
	});
}
function getTimezoneDifference(){
	var rightNow = new Date();
	var jan1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);
	var temp = jan1.toGMTString();
	var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
	var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
	return(std_time_offset);
}
function openDocument(desc, p_id, e_id, evt_id){
	MPAGES_EVENT("CLINICALNOTE", p_id + "|" + e_id + "|[" + evt_id + "]|" + desc + "|0||||");
}
