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
var pt_name = "";
var pt_fin = "";

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
	$(document.body).html("<img src='css/images/mediview_solutions_loading.gif' />");
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
		pt_name = data.INITIALIZE.PATIENT_NAME;
		pt_fin = data.INITIALIZE.FIN;
	});
	try{
		$.get("data/page_settings.json", function(data){
			var json = eval("(" + data + ")");
			if (json.INITIALIZE.PAGE_NAME == ""){
				showError("Page settings for page '" + pageName + "' not found. Please contact your system administrator.");
				return;
			}
		
			var f = new Array();
			f.push('js/jquery-ui-1.7.2-min.js');
			f.push('js/jquery.corners.min.js');
			f.push('js/jquery.tooltip.min.js');
			f.push('css/mPages.framework.css');
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
	$(document.body).html("<img class='loading' src='css/images/mediview_solutions_loading.gif' />");
	var json = eval("(" + data + ")");
		if (json.INITIALIZE.CHART_PAGE){
			document.title += json.INITIALIZE.PAGE_TITLE + " - Patient: " + pt_name + " [ FIN: " + pt_fin + " ]";
		}
		var output = "";
		if (json.INITIALIZE.PAGE_SHOW_BANNER){
			output += "<div id='page_banner'>" +
				"<span id='banner_patient_name'>" + json.INITIALIZE.PATIENT_NAME + "</span>" +
				"<span id='banner_patient_dob'>Age: " + json.INITIALIZE.PATIENT_AGE + 
				" [ DOB: "+ json.INITIALIZE.PATIENT_DOB + " ]</span>" +
				"<span id='banner_patient_location'>Location: " + json.INITIALIZE.PATIENT_LOC + "</span>" +
					"</div>";
		}
		if (json.INITIALIZE.PAGE_TABS.length > 0){
			if (json.INITIALIZE.SHOW_TAB){
			output += "<div id='tabs' class='ui-tabs ui-widget ui-widget-content ui-corner-all'>" +
					"<ul id='tab_list' class='ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all'>";
			$.each(json.INITIALIZE.PAGE_TABS, function(idx, tab){
				output += "<li class='ui-state-default ui-corner-top'><a href='#tab_" + tab.TAB_ID + "_" + idx + "'" +
					" id='tab_id_" + tab.TAB_ID + "_" + idx + "' class='tab_link'" +
					"'>" + tab.TAB_NAME + "</a></li>";
			});
			output += "</ul>";
			$.each(json.INITIALIZE.PAGE_TABS, function(idx, tab){
				output += "<div id='tab_" + tab.TAB_ID + "_" + idx + 
					"' class='ui-tabs-panel ui-widget-content ui-corner-bottom mp_tab_content tab_div'><span class='tab_name_print'>" + tab.TAB_NAME + "</span></div>";
			});
			$(document.body).html(output);
			$("#tabs").tabs({
				show:function(event, ui){
					var sparkline_found = false;
					$("span.sparkline").each(function(){sparkline_found = true;});
					if (sparkline_found){
						$.sparkline_display_visible();
					}
				}
			});
			}else{
				output += "<div id='tab__0'></div>";
				$(document.body).html(output);
			}
			
			var three_columns = false;
			try{
			$.each(json.INITIALIZE.PAGE_TABS, function(idx, tab){
				var top_drop_area = false;
				var left_drop_area = false;
				var right_drop_area = false;
				var center_drop_area = false; // Center column
				var bottom_drop_area = false;
				
				$.each(tab.DATA_AREA, function(d_idx, area){
					var drop_area = "";
					
					if (!top_drop_area && !left_drop_area && !right_drop_area && !center_drop_area && area.FULL_ROW)
					{
						$("#tab_" + tab.TAB_ID + "_" + idx).append("<div id='tab_" + tab.TAB_ID + "_" + idx + "_top' class='top_drop_area drop_area'></div>");
						top_drop_area = true;
						drop_area = "top";
					}
					if (!area.FULL_ROW && !left_drop_area && area.COLUMN == "L"){ 
						$("#tab_" + tab.TAB_ID + "_" + idx).append("<div id='tab_" + tab.TAB_ID + "_" + idx + "_left' class='left_drop_area drop_area'></div>");
						left_drop_area = true;
					}
					if (!area.FULL_ROW && !right_drop_area && area.COLUMN == "R"){
						$("#tab_" + tab.TAB_ID + "_" + idx).append("<div id='tab_" + tab.TAB_ID + "_" + idx + "_right' class='right_drop_area drop_area'></div>");
						right_drop_area = true;
					}
					if (!area.FULL_ROW && !center_drop_area && area.COLUMN == "C"){
						$("#tab_" + tab.TAB_ID + "_" + idx).append("<div id='tab_" + tab.TAB_ID + "_" + idx + "_center' class='center_drop_area_3c drop_area'></div>");
						center_drop_area = true;
						three_columns = true;
					}
					if (area.FULL_ROW && top_drop_area && !left_drop_area && !right_drop_area){
						drop_area = "top";
					}
					if (area.FULL_ROW && top_drop_area &&
							(left_drop_area || right_drop_area)){
						$("#tab_" + tab.TAB_ID + "_" + idx).append("<div id='tab_" + tab.TAB_ID + "_" + idx + "_bottom' class='bottom_drop_area drop_area'></div>");
						drop_area = "bottom";
					}
					
					switch(area.COLUMN){
					case "T":drop_area = "top";break;
					case "L":drop_area = "left";break;
					case "C":drop_area = "center";break;
					case "R":drop_area = "right";break;
					case "B":drop_area = "bottom";break;
					}
					var output = "<div id='" + tab.TAB_ID + "_" + area.AREA_ID + "' class='mp_data_area" +
							(area.FULL_ROW?" mp_data_area_full":" mp_data_area_half") + 
							"'><div class='mp_data_area_title'>";
					if (area.OPEN_TAB == 1){
						output += "<span class='mpages_open_tab'><span class='mpages_open_tab_name'>" +
							area.TAB_NAME + "</span><span class='mpages_open_tab_application'>" +
							area.APPLICATION + "</span>" + area.TITLE + "</span>";
					}else{
						output += area.TITLE;
					}
					var refresh_button_position_right = "2px";
					var hide_content_on_load = false;
					if (json.INITIALIZE.ALLOW_AREA_MINIMIZE && area.ALLOW_MINIMIZE){
						if (area.LOAD_MINIMIZED == 1){
							output += "<img class='minimize_data_area' title='Expand' src='css/images/icon_expand.png' />";
							hide_content_on_load = true;
						}else{
							output += "<img class='minimize_data_area' title='Collaps' src='css/images/icon_min.png' />";
						}
						refresh_button_position_right = "19px";
					}
					if (json.INITIALIZE.ALLOW_AREA_REFRESH){
						output += "<img class='refresh_data_area' title='Refresh Area' style='right:" + 
							refresh_button_position_right + ";";
						if (hide_content_on_load){
							output += "display:none;";
						}
						output += "' src='css/images/refresh_icon.png' />";
					}
					output += "</div><div class='mp_data_area_content'" + (hide_content_on_load?" style='display:none;'":"") + "></div></div>";
				$("#tab_" + tab.TAB_ID + "_" + idx + "_" + drop_area).append(output);
				});
			});
			}catch(exc){alert(exc.message);}
			$("div.mp_data_area").corners();
			if (json.INITIALIZE.PERSONALIZABLE){
				$("div.drop_area").sortable({
					connectWidth: "div.drop_area",
					items:"div.mp_data_area",
					opacity:0.7,
					containment:"window",
					cursor:"move"
				}).disableSelection();
				$("div.drop_area").bind("deactivate",function(e,u){
					alert("drop occurred");
					alert($(this).closest("div.drop_area").attr("id"));
				});
			}
			$.each(json.INITIALIZE.PAGE_TABS, function(idx, tab){
				$.each(tab.DATA_AREA, function(d_idx, area){
					var f_call = area.FUNCTION + "(\"" + tab.TAB_ID + "_" + area.AREA_ID +"\"";
					if (area.PARAMS.length){
						f_call += ", " + area.PARAMS;
					}
					f_call += ")";
					$("#" + tab.TAB_ID + "_" + area.AREA_ID).append("<span style='display:none;' class='data_area_function_call'>" + f_call + "</span>");
					
					try{
					eval(f_call);		
					}catch(exc){alert(exc.message);alert(f_call);}		
				});
			});


			
			var scroll_height = window.innerHeight;
			if (window.innertHeight == undefined){
				scroll_height = document.body.offsetHeight;
			}
			scroll_height = scroll_height - 87;
			if (json.INITIALIZE.PAGE_SHOW_BANNER){
				$("#page_banner").corners();
				scroll_height -= 52;
			}
			if (json.INITIALIZE.ALLOW_AREA_MINIMIZE){
				$("img.minimize_data_area").css("cursor","pointer");
				enableMinimizeDataArea();
			}
			if (json.INITIALIZE.ALLOW_AREA_REFRESH){
				$("img.refresh_data_area").css("cursor","pointer");
				$("img.refresh_data_area").click(function(){
					var f = $(this).parent().parent().parent().find("span.data_area_function_call").text();
					
					eval(f);
				});
			}
			if (three_columns){
				$("div.left_drop_area").addClass("left_drop_area_3c").removeClass("left_drop_area");
				$("div.right_drop_area").addClass("right_drop_area_3c").removeClass("right_drop_area");
			}

			$("div.tab_div").css("height", scroll_height);
			$("div.tab_div").css("max-height", scroll_height);
			$("div.tab_div").css("overflow-y", "auto");
			
			$("span.mpages_open_tab").click(function(){
				var t_name = $(this).find("span.mpages_open_tab_name").html();
				var t_app = $(this).find("span.mpages_open_tab_application").html();
				APPLINK(0,t_app,"/PERSONID=$PAT_PersonId$ /ENCNTRID=$VIS_EncntrId$ /FIRSTTAB=^" + t_name + "^");
			});

		}else{
			alert("no tabs");
			$(document.body).html(output);
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
