/** Ambulatory Device Custom Component JS Portion **/
jQuery.support.cors = true;
/*Custom Ambulatory Core source code*/
//define the PowerWorks namespace
if (pwx == undefined) {
	var pwx = new Object();
}
//create the form launch function
pwx_form_launch = function (persId, encntrId, formId, activityId, chartMode, compId) {
	//var pwxFormObj = window.external.DiscernObjectFactory('POWERFORM');
	//pwxFormObj.OpenForm(persId, encntrId, formId, activityId, chartMode);
	var paramString = persId + "|" + encntrId + "|" + formId + "|" + activityId + "|" + chartMode;
	MPAGES_EVENT("POWERFORM", paramString);
	if (compId != null) {
		var comp = MPage.getCustomComp(compId);
		if (comp != null) {
			comp.refresh();
		}
	}
}
// function to take a whole Javascript object and creat the grouping based on keyname
Array.prototype.pwxgroupBy = function (keyName) {
	var res = {};
	$.each(this, function (i, val) {
		var k = val[keyName];
		var v = res[k];
		if (!v)
			v = res[k] = [];
		v.push(val);
	});
	return res;
};
//create form menu function
pwx_form_menu = function (form_menu_id, compId) {
	var element;
	if (document.getElementById && (element = document.getElementById(form_menu_id))) {
		if (document.getElementById(form_menu_id).style.display == 'block') {
			document.getElementById(form_menu_id).style.display = 'none';
			$('#' + compId).css('z-index', '1')
		} else {
			document.getElementById(form_menu_id).style.display = 'block';
			$('#' + compId).css('z-index', '2')
		}
	}
}
//create expand collapse with scroll check function
pwx_expand_collapse_scroll = function (tbody_class, title_class, tgl_class, scroll_div_id, scroll_setting) {
	var element;
	if (document.getElementById && (element = document.getElementById(tbody_class))) {
		if (document.getElementById(tbody_class).style.display == 'block') {
			document.getElementById(tbody_class).style.display = 'none';
			document.getElementById(title_class).title = 'Expand';
			document.getElementById(tgl_class).className = 'pwx-sub-sec-hd-tgl-close';
			var pwxclientheightcheck = document.getElementById(scroll_div_id).clientHeight;
			var pwxscrollheightcheck = document.getElementById(scroll_div_id).scrollHeight;
			if (pwxscrollheightcheck <= pwxclientheightcheck) {
				document.getElementById(scroll_div_id).style.height = '';
			}
		} else {
			document.getElementById(tbody_class).style.display = 'block';
			document.getElementById(title_class).title = 'Collapse';
			document.getElementById(tgl_class).className = 'pwx-sub-sec-hd-tgl';
			document.getElementById(title_class).title
		}
	}
	var pwxdivh = document.getElementById(scroll_div_id).offsetHeight;
	if (pwxdivh > scroll_setting) {
		var div_height = scroll_setting + 'px';
		document.getElementById(scroll_div_id).style.height = div_height;
	}
}
/** clear the height based upon scrollbar height **/
pwxclearheight = function (pwx_id_scroll, scrollsetting) {
	var pwxclientheightcheck = document.getElementById(pwx_id_scroll).clientHeight;
	var pwxscrollheightcheck = document.getElementById(pwx_id_scroll).scrollHeight;
	if (pwxscrollheightcheck <= pwxclientheightcheck) {
		document.getElementById(pwx_id_scroll).style.height = '';
	}
	var pwxdivh = document.getElementById(pwx_id_scroll).offsetHeight;
	if (pwxdivh > scrollsetting) {
		var div_height = scrollsetting + 'px';
		document.getElementById(pwx_id_scroll).style.height = div_height;
	}
}
/*Device Component Javascript Code Start Here*/
var pwxdevicearrayCount = -1;
var pwxdevicelocationsglobal = new Array();
var pwxdeviceglobaldeviceslist = new Array();
var pwxglobaldeviceCount = -1;
var pwxdevicevendorglobalNamelist = new Array();
var pwxdeviceglobalcurrentVendorCnt = -1;
var pwxdeviceglobaldeviceIdPasslist;
var pwxdeviceglobalbusResults = [];
var pwxdeviceglobaldevIds;
var pwxdeviceresultsGlobal = [];
var pwxdevicelocationvalue = "";
var pwxdeviceUSER = "";
var pwxdevicePWORD = "";
var pwxdeviceLOCATION = "";
var pwx_device_person_id = "";
var pwx_device_enc_id = "";
var pwx_device_scrollsetting = "";
var deviceData;

pwx.Devices = function () {};
pwx.Devices.prototype = new MPage.Component();
pwx.Devices.prototype.constructor = MPage.Component;
pwx.Devices.prototype.base = MPage.Component.prototype;
pwx.Devices.prototype.name = "pwx.Devices";
pwx.Devices.prototype.cclProgram = "AMB_MP_DEVICE_COMP_41";
pwx.Devices.prototype.cclParams = [];
pwx.Devices.prototype.cclDataType = "JSON";

pwx.Devices.prototype.init = function (options) {
	var params = [];
	//set params
	params.push("MINE");
	params.push(this.getProperty("personId"));
	params.push(this.getProperty("encounterId"));
	params.push(this.getProperty("userId"));
	params.push(this.getProperty("positionCd"));
	this.cclParams = params;
};
//set the MinimumSpecVersion
pwx.Devices.prototype.componentMinimumSpecVersion = 1.0;
//set render to display the component
pwx.Devices.prototype.render = function () {
	var element = this.getTarget();
	//store person id and encounter id in global variable so we don't have to worry about passing in different function
	pwx_device_person_id = this.getProperty("personId");
	pwx_device_enc_id = this.getProperty("encounterId");
	devicecompId = this.getComponentUid();
	var uid = this.getProperty("userId");
	var posid = this.getProperty("positionCd");
	var pwx_device_main_HTML = [];
	var pwx_device_refresh_HTML = [];	
	//Build a top header string with device name in it.
	PwxDeviceComponentRenderlocationListview("mpageinst");
	pwx_device_copy_main_obj = pwx_device_copy_obj_devicename(this);
	pwx_device_scrollsetting = (this.data.DEVICE_COMP.SCROLL_LINES * 18) + 6;
	pwx_device_main_HTML.push('<div id="pwx_devices_header_main"></div>',
		                      '<div style="padding-top:1%" id="pwx_devices_content_area">',
		                      '</div><div id="deviceEntryParametersDiv"></div>');
	$(element).html(pwx_device_main_HTML.join(""));
}
function pwxdevice_make_basic_auth(user, password) {
	// this function encodes the username and password for basic auth using base64.js
	var tok = user + ':' + password;
	var hash = PwxBase64.encode(tok);
	return "Basic " + hash;
}
/* This function will take a location alias and return a list of locations and child locations associated with the alias */
function PwxDeviceComponentRenderlocationListview(locAlias) {
	var locName = "";
	var jsonData;
	//start off by getting the URL for the rest service call
	var urlInfo = new XMLCclRequest();
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");

	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);
		var NURSE = "";
		var FACILITY = "";
		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");
		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "NURSEUNIT") {
				NURSE = pi_var2[1].text;
			} else if (pi_var2[0].text == "FACILITY") {
				FACILITY = pi_var2[1].text;
			} else if (pi_var2[0].text == "ORG") {
				pwxdeviceLOCATION = pi_var2[1].text
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		// build the url for the restful service call using the location alias passed to the load function
		var locationListUrl;
	    if(URL.toLowerCase().indexOf("/ibus") > -1){
		   if (NURSE == "0") {
			locationListUrl = URL + "cas/api/location?aliasId=" + FACILITY + ""
		   } else {
			locationListUrl = URL + "cas/api/location?aliasId=" + NURSE + ""
		   }
		}else{
		   if (NURSE == "0") {
			locationListUrl = URL + "/iBus/cas/api/location?aliasId=" + FACILITY + ""
		   } else {
			locationListUrl = URL + "/iBus/cas/api/location?aliasId=" + NURSE + ""
		   }
		}
		//do the ajax/rest call to get the locations
		$.ajax({
			type : 'GET',
			async : true,
			url : locationListUrl,
			dataType : 'json',
			data : {},
			beforeSend : function (xhr) {
				// add the basic authorization to the ajax request object header
				xhr.setRequestHeader("Authorization", auth);
				xhr.setRequestHeader("Accept", "application/json");
			},
			success : function (locationItem) {
				var pwx_device_location_name_HTML = [];
				var headerdevicename = document.getElementById('pwx_devices_header_main');
				// use eval to transform json string returned from restful service to json object
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					var jsonData = locationItem;
				} else {
					pwx_device_location_name_HTML.push('<div id="pwx_device_nolocation_div">',
						'<span id="pwx_device_no-device_id" class="pwx-warning-large-icon pwx_no_text_decor">&nbsp;</span>',
						'<p id="pwx-device_location_nofound_message"> Device view unable to load due to no ambulatory location defined <p style="text-indent:38%;font-size:15px;word-wrap:break-word;color: #909090;margin-bottom:2%;">on the encounter/visit.</p></p>',
						'</div>');
					$(headerdevicename).html(pwx_device_location_name_HTML.join(""));
				}
				//this is the jquery outer loop for the parent locations
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					$.each(jsonData, function (i) {
						pwxdevicearrayCount = pwxdevicearrayCount + 1;
						pwxdevicelocationsglobal[pwxdevicearrayCount] = jsonData[i].locationId;
						var loc = (jsonData[i].locationDisp);
						pwx_device_location_name_HTML.push('<div id="pwx_devices_header">',
							'<span style="float:left;"><label id="pwxdevice_devicelocation_label">Device Location: </label>',
							'<span id="pwx_devices_locName"></span>' + loc + '</span>');
						if (pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_HELPURL != "") {
							pwx_device_location_name_HTML.push('<a href=\'javascript: APPLINK(100,"', pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_HELPURL, '","")\' class="pwx_no_text_decor" title="Help Page" onClick="">',
								'<span class="pwx-help-icon" id="pwx-device-help-icon-id" title="Help"></span></a>');
						} else {
							pwx_device_location_name_HTML.push('<a class="pwx_no_text_decor" title="Help Page">',
								'<span class="pwx-help-icon" id="pwx-device-help-icon-id" title="Help"></span></a>');
						}
						pwx_device_location_name_HTML.push('<span id="pwx_device_info_icon" class="pwx-information-icon" title="Device Information"></span>',
							'</div>');
						$(headerdevicename).html(pwx_device_location_name_HTML.join(""));
						$("#pwx_device_info_icon").click(function () {
							if (pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_INFOTEXT != "") {
								MP_ModalDialog.deleteModalDialogObject("DeviceinfoObject")
								var Deviceinformationtext = new ModalDialog("DeviceinfoObject")
									.setHeaderTitle('<span>Device Information</span>')
									.setTopMarginPercentage(20)
									.setRightMarginPercentage(30)
									.setBottomMarginPercentage(20)
									.setLeftMarginPercentage(30)
									.setIsBodySizeFixed(true)
									.setHasGrayBackground(true)
									.setIsFooterAlwaysShown(true);
								Deviceinformationtext.setBodyDataFunction(
									function (modalObj) {
									modalObj.setBodyHTML('<span>' + pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_INFOTEXT + '</span>');
								});
								MP_ModalDialog.addModalDialogObject(Deviceinformationtext);
								MP_ModalDialog.showModalDialog("DeviceinfoObject");
							}
						});
					});
				} // end outer loop for parent locations
			}, // end success
			complete : function (locationItem) {
				// the 'complete' is entered when the ajax call is complete, regardless of whether the call was successful or not
				if (pwxdevicelocationsglobal.length != 0) {
					var locIds;
					for (loc_cnt = 0; loc_cnt < pwxdevicelocationsglobal.length; loc_cnt++) {
						if (loc_cnt == 0) {
							locIds = "locId=" + pwxdevicelocationsglobal[loc_cnt];
						} //end if
						else {
							locIds = locIds + "&locId=" + pwxdevicelocationsglobal[loc_cnt];
						} //end else
					} //end loc_cnt for loop
					//make the next rest call to get the devices associated with the locations
					PwxDeviceComponentRenderDeviceListView(locIds);
				}
			}, // end complete
			error : function (locationItem) {
				var pwx_device_location_name_HTML_error = [];
				var headerdevicenamelocationerror = document.getElementById('pwx_devices_content_area');
				// used for the ajax error handling if there was not a successful call to the restful service
				pwx_device_location_name_HTML_error.push('<div id="pwx_device_nolocation_div">',
					'<span class="pwx_single_dt_wpad"><span class="res-none">No ibus setting found. Please call support.</span></span>',
					'</div>');
				$(headerdevicenamelocationerror).html(pwx_device_location_name_HTML_error.join(""));
			} // end error
		}); // end $.ajax
	} //end ready state change
}
/* This function will take a list of locations and return a list of device Ids associated with it */
function PwxDeviceComponentRenderDeviceListView(locIds) {
	var urlInfo = new XMLCclRequest();
	//get the url for the REST call
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");
	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);
		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");
		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		// build the url for the restful service call using the location alias passed to the load function
		if(URL.toLowerCase().indexOf("/ibus") > -1){
		var deviceListUrl = URL + "cas/api/devlocassoc?" + locIds + "&retChildren=true&retConStatus=true"}
		else{
		var deviceListUrl = URL + "/iBus/cas/api/devlocassoc?" + locIds + "&retChildren=true&retConStatus=true"
		}
			deviceListUrl = encodeURI(deviceListUrl);
		//begin the ajax call which will perform the rest call to get the device ids
		$.ajax({
			type : 'GET',
			async : true,
			url : deviceListUrl,
			dataType : 'json',
			data : {},
			beforeSend : function (xhr) {
				//add the basic authorization to the ajax request object header
				xhr.setRequestHeader("Authorization", auth);
				xhr.setRequestHeader("Accept", "application/json");
			},
			success : function (locationItem) {
				//use eval to transform json string returned from restful service to json object
				pwxdevicelocationvalue = locationItem;
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					var jsonData = locationItem;
				} //end if
				else {
					var pwx_device_deviceidnotfound_HTML = [];
					var headerdevicenotfound = document.getElementById('pwx_devices_content_area');
					pwx_device_deviceidnotfound_HTML.push('<div id="pwx_device_nolocation_div">',
						'<span class="pwx_single_dt_wpad"><span class="res-none">No devices found</span></span>',
						'</div>');
					$(headerdevicenotfound).html(pwx_device_deviceidnotfound_HTML.join(""));
				}
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					$.each(jsonData, function (i) {
						//load the devices into the devices array as new objects and stores the device ID and the connection status
						pwxglobaldeviceCount = pwxglobaldeviceCount + 1;
						pwxdeviceglobaldeviceslist[pwxglobaldeviceCount] = new pwxdeviceStatus(jsonData[i].deviceId, jsonData[i].conState);
					});
				} // end outer loop for parent locations
			}, // end success
			complete : function (locationItem) {
				//once we have the device ID's the next rest call will be used to get the display name and the category type which will be used for display purposes
				if (pwxdevicelocationsglobal.length != 0 && pwxdevicelocationvalue != "") {
					var dev_cnt = 0;
					var i = 0;
					//the following for loop is used to concat all the device ids into one variable which will be used to make the rest service call
					for (dev_cnt = 0; dev_cnt < pwxdeviceglobaldeviceslist.length; dev_cnt++) {
						if (dev_cnt == 0) {
							pwxdeviceglobaldevIds = "id=" + pwxdeviceglobaldeviceslist[dev_cnt].deviceID;
						} //end if
						else {
							pwxdeviceglobaldevIds = pwxdeviceglobaldevIds + "&id=" + pwxdeviceglobaldeviceslist[dev_cnt].deviceID;
						} //end else
					} //end for
					//this call will call the function to perform the rest service call to get the display
					PwxDeviceComponentRenderDeviceDescriptListView(pwxdeviceglobaldevIds);
				}
			}, // end complete
			error : function (locationItem) {
				// used for the ajax error handling if there was not a successful call to the restful service
			} // end error
		}); // end $.ajax
	}
} // end load
/*  This function will peform the rest service call to get the most recent results on the device */
function PwxDeviceComponentRenderAcquireData(deviceID, PwxDeviceComponentRenderAcquireData) {
	// Update the time as system current date and time
	var acquireupdatedcurrentdateandtime = new Date().format("mm/dd/yy HH:MM tt");
	document.getElementById("pwx_device_modal_updated_current_time").innerHTML = acquireupdatedcurrentdateandtime;
	pwxdeviceglobalbusResults.length = 0;
	var urlInfo = new XMLCclRequest();
	//get the url for the REST call
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");
	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);
		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");
		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		//create the URL
		if(URL.toLowerCase().indexOf("/ibus") > -1){
		var deviceListUrl = URL + "cas/api/tdds/device/latest/" + deviceID + ""}
		else{
		var deviceListUrl = URL + "/iBus/cas/api/tdds/device/latest/" + deviceID + ""
		}
			//the ajax call that will perform the rest service
			$.ajax({
				type : 'GET',
				async : true,
				url : deviceListUrl,
				dataType : 'json',
				data : {},
				beforeSend : function (xhr) {
					// add the basic authorization to the ajax request object header
					xhr.setRequestHeader("Authorization", auth);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success : function (locationItem) {
					// use eval to transform json string returned from restful service to json object
					if (locationItem != undefined && locationItem != null && locationItem != "") {
						var jsonData = locationItem;
					}
					//each outer loop to get the latest data from the device
					if (jsonData) {
						for (x = 0; x < pwxdeviceglobalbusResults.length; x++) {
							delete pwxdeviceglobalbusResults[x];
						}
						$.each(jsonData, function (i) {
							//the inner loop contains the actual result rows
							$.each(jsonData[i].entries, function (j) {
								pwxdeviceglobalbusResults[pwxdeviceglobalbusResults.length] = new pwxdevicefillBusResults(jsonData[i].entries[j].value, jsonData[i].entries[j].context);
							}); // end inner loop
						}); // end outer loop for parent locations
					}

				}, // end success
				complete : function (locationItem) {
					//the 'complete' is entered when the ajax call is complete, regardless of whether the call was successful or not
					var checkSuccess = 0;
					checkSuccess = pwxdevice_display_acquired_data();
				}, // end complete
				error : function (locationItem) {
					// used for the ajax error handling if there was not a successful call to the restful service
				} // end error
			}); // end $.ajax
	}
}
/* This function will take the vendor and the model and return an xml structure that when parsed out will display the available values from the device
and any the user can enter as well. */
function PwxDeviceComponentRenderDeviceEntryParameters(vendor, model, deviceId, display, vendorname, modelname) {
	//set global variable so we know what device to process
	pwxdeviceglobaldeviceIdPasslist = deviceId;
	var element = this.element;
	var hoverdeviceentryhtml = document.getElementById("deviceEntryParametersDiv");
	//get the URL for the rest service call
	var urlInfo = new XMLCclRequest();
	//get the url for the REST call
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");

	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);

		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");

		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		// build the url for the restful service call using the location alias passed to the load function
		if(URL.toLowerCase().indexOf("/ibus") > -1){
		var deviceListUrl = URL + "cas/api/configuration/path/ChartDocumentation?path=" + vendor + "/" + model + "";}
		else{
		var deviceListUrl = URL + "/iBus/cas/api/configuration/path/ChartDocumentation?path=" + vendor + "/" + model + "";
		}

		$.ajax({
			type : 'GET',
			async : true,
			url : deviceListUrl,
			dataType : 'text',
			data : {},
			beforeSend : function (xhr) {
				// add the basic authorization to the ajax request object header
				xhr.setRequestHeader("Authorization", auth);
				xhr.setRequestHeader("Accept", "text/xml");
			},
			success : function (results) {
				// 'sucess' is entered only if the ajax call to the restful service was successful, including the return of valid
				// data in the format specified in the dataType value in the $.ajax values list.
				// really hokey method of stripping out the CDATA tag so that we can parse the xml in the CDATA
				var newResults = results.replace("<![CDATA[", "");
				var newResults2 = newResults.replace("]]>", "");
				var newResults3 = newResults2.replace("<![CDATA[", "");
				var newResults4 = newResults3.replace("]]>", "");
				//document.getElementById('deviceEntryParametersDiv').innerHTML = "";
				var displyInd = 0;
				var unitsInd = 0;
				var groupInd = 0;
				var groupDisplay = "";
				var units = [];
				var results = []; // main array
				var resultsOrdered = []; // main array
				var groups = [];
				// use loadXMLString to transform the xml from a string to an xml document object
				var xmlDoc = pwxdeviceloadXMLString(newResults4);
				// use jquery to drill down to the 'Configuration' node in the xml object.
				var configuration = $(xmlDoc).find("Configuration");

				var optionFound = 0;
				var aliasInd = 0;
				var contextInd = 0;
				var referenceDisp = 0;
				var referenceId = 0;
				var index = 0;
				var context = 0;
				var groupCnt = 0;
				var propertyLevel = 0;
				var ignoreCnt = 0;
				var processCnt = 0;
				var dontProcess = 0;
				var totalCount = 0;
				var unitCount = 0;
				var unitAlias = 0;
				var baseUnit = 0;
				var conUnit = 0;
				var groupFound = 0;

				// drill down to the <properties> nodes(s) of <Configuration>
				$(configuration).find("properties").each(function () {
					propertyLevel = propertyLevel + 1;
					$(this).find("properties").each(function () {
						//there are multiple property levels, we only care about the second
						//each additional property level are sub options
						//each new level two property is a new field to display
						if (propertyLevel == 1) {
							//this logic is used to tell how many extra property rows on level 3 were found
							//we don't care about them, we already processed them when looking at level 2
							if (ignoreCnt == 0 || ignoreCnt <= processCnt) {
								ignoreCnt = 0;
								processCnt = 0;
								unitCount = 0;
								totalCount = 0;
								dontProcess = 0;
								//there is a possibility that we could be looking at a units row and not an actual field or
								//box to display.  This checks to see which record we need.
								$(this).find("string").each(function () {
									totalCount = totalCount + 1;
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units") {
										unitCount = unitCount + 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units.alias") {
										unitCount = unitCount + 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units.display") {
										unitCount = unitCount + 1;
									}
								});
								//so if we find all 3 and there are six totals rows
								//this must be a unit row, so make a new record to hold the units
								if (unitCount == 3 && totalCount == 6) {
									units[units.length] = new pwxdeviceunitsFill();
									//else it is a results row
								} else {
									results[results.length] = new pwxdeviceresultsFill();
								}
							} //end ignore count check
							else if (ignoreCnt > processCnt) {
								processCnt = processCnt + 1;
								dontProcess = 1;
							}
						}
						//we are not in ignore mode (looping through level three properties) so process if there are level threes to ignore
						if (ignoreCnt == 0) {
							//this counts how many level 3 properities there are.  We need to ignore them since they are processed as options in the level 2
							$(this).find("properties").each(function () {
								ignoreCnt = ignoreCnt + 1;
							});
						} //end ignore count
						//so if we make it here, these are the fields we need to display the information on the right side of the
						//screen.  Heart rate/BP/etc
						//so if the property level is 1 (actually still on level 2) if don't process isn't set (spinnign through level 3
						//then process
						$(this).find("string").each(function () {
							if (propertyLevel == 1) {
								if (dontProcess == 0) {
									if (displyInd == 1) {
										results[results.length - 1].name = this.text;
										displyInd = 0;
									}
									if (conUnit == 1) {
										results[results.length - 1].units = this.text;
										conUnit = 0;
									}
									if (optionFound == 1) {
										results[results.length - 1].indicator = 1;
										results[results.length - 1].optionsDisplay.push(this.text);
										optionFound = 0;
									}
									if (aliasInd == 1) {
										results[results.length - 1].alias = this.text
											aliasInd = 0;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.display") {
										displyInd = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.alias") {
										aliasInd = 1;
									}
									if (this.text == "com.cerner.edc.datamodel.appliance.common.reference.display") {
										optionFound = 1;
									}
									if (unitsInd == 1) {
										//i wasn't sure if this tag could appear in both a units row
										//and a results row, but I coded it to handle just in case
										if (unitCount == 3 && totalCount == 6) {
											units[units.length - 1].display = this.text;
										} else {
											results[results.length - 1].unitsDisp = this.text;
										}
										unitsInd = 0;
									}
									if (baseUnit == 1) {
										//i wasn't sure if this tag could appear in both a units row
										//and a results row, but I coded it to handle just in case
										if (unitCount == 3 && totalCount == 6) {
											units[units.length - 1].units = this.text;
										} else {
											results[results.length - 1].units = this.text;
										}
										baseUnit = 0;
									}
									if (unitAlias == 1) {
										if (unitCount == 3 && totalCount == 6) {
											units[units.length - 1].alias = this.text;
										} else {
											results[results.length - 1].unitsAlias = this.text;
										}
										unitAlias = 0;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units.display") {
										unitsInd = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.displayorderindex") {
										//these are int fields so our parsing through the string fields would miss it
										$(this).find("int");
										var test = $(this).next();
										results[results.length - 1].displayOrder = test.text();
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units") {
										baseUnit = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.units.alias") {
										unitAlias = 1;
									}
									if (contextInd == 1) {
										results[results.length - 1].context = this.text;
										contextInd = 0;
									}
									if (groupInd == 1) {
										results[results.length - 1].group = this.text;
										var length = results.length - 1;
										for (check = 0; check < length; check++) {
											if (results[check].group == this.text) {
												results[results.length - 1].displayInd = 0;
											}
										}
										groupInd = 0;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context") {
										contextInd = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.index") {
										//this is an int, parsing through the strings would skip over this
										$(this).find("int");
										var test = $(this).next();
										results[results.length - 1].index = test.text();
									}
									//the third besides a results box for the right of the screen or a units that relates to the box
									//is a group section. The only thing we currently need out of this is the index for ordering
									//on the right of the screen
									if (groupFound == 1) {
										groups[groups.length] = new pwxdevicefillGroups();
										groups[groups.length - 1].name = this.text;
										groupFound = 0;
									}
									if (referenceId == 1) {
										results[results.length - 1].optionsId.push(this.text);
										referenceId = 0;
									}
									if (context == 1) {
										results[results.length - 1].context = this.text;
										context = 0;
									}
									if ($(this).text() == "com.cerner.edc.datamodel.appliance.common.reference.disply") {
										referenceDisp = 1;
									}
									if ($(this).text() == "com.cerner.edc.datamodel.appliance.common.reference.id") {
										referenceId = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.index") {
										index = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context") {
										context = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.group") {
										groupInd = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.context.unit") {
										conUnit = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.chart.group.name") {
										groupFound = 1;
									}
									if ($(this).text() == "com.cerner.edc.appliance.ui.p2da.chart.group.displayorderindex") {
										$(this).find("int");
										var int_num = $(this).next();
										groups[groups.length - 1].displayOrder = int_num.text();
									}
								} //end dontProcess
							} //end property level
						}); //end string processing
					}); //end properties level 2
				}); //end properties level 1

				//there is probably an easier way to do this, but now for the displaying purposes and for pulling
				//the data off the bus these next several for loops move data around, copy data, and fill out blanks
				//set the units
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < units.length; y++) {
						if (results[x].units == units[y].units) {
							results[x].unitsDisp = units[y].display;
							results[x].unitsAlias = units[y].alias;
						}
					}
				}
				//if context is blank, set it to the name
				for (x = 0; x < results.length; x++) {
					if (results[x].context == "") {
						results[x].context = results[x].name;
						results[x].boxName = results[x].name; // additional context mapping goes here
					} else {
						results[x].boxName = results[x].context
					}
				}
				//determine if there are sub children
				//so for temperature, a sub child is where is the temperature taken
				//Also these sub children need the same units as the parent boxes
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < results.length; y++) {
						if (results[x].context == results[y].context && x != y) {
							if (results[x].indicator == 1) {
								results[x].subChild = 1
									results[x].unitsAlias = results[y].unitsAlias;
							} else if (results[y].indicator == 1) {
								results[y].subChild = 1
									results[y].unitsAlias = results[x].unitsAlias;
							}
						}
					}
				}
				//if th context is the same, update the box name
				//the box name is used to give each row a unique ID for
				//both pulling data from the bus and displaying in the correct spot
				//to also pushing the data to mill
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < results.length; y++) {
						if (results[x].context == results[y].context && x != y) {
							if (results[x].indicator == 1) {
								results[x].boxName = results[x].context + " Box";
							}
						}
					}
				}
				//so for sub child rows, they actually want the result in both places
				//so for temp, if the temp is 37 then temp location needs a result of 37 as
				//well.  This is to set that up for below
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < results.length; y++) {
						if (results[x].group == results[y].group && x != y) {
							if (results[x].displayInd == 1 && results[y].displayInd == 0) {
								if (results[x].subChild == 1 && results[y].subChild == 1) {
									results[y].boxName = results[x].boxName
								}
							}
						}
					}
				}
				//everything is set, expect the groups don't have there order set
				//spin through the groups record, and if there is a match grab the display order
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < groups.length; y++) {
						if (results[x].group == groups[y].name) {
							results[x].displayOrder = groups[y].displayOrder
						}
					}
				}
				//once the results are finally in order we copy to a new list where they are ordered
				for (x = 0; x < results.length; x++) {
					for (y = 0; y < results.length; y++) {
						if (results[y].group > "") {
							if (results[y].displayOrder == x) {
								resultsOrdered[resultsOrdered.length] = new pwxdeviceresultsFill();
								resultsOrdered[resultsOrdered.length - 1] = results[y];
							}
						} else {
							if (results[y].displayOrder == x && results[y].name > "") {
								resultsOrdered[resultsOrdered.length] = new pwxdeviceresultsFill();
								resultsOrdered[resultsOrdered.length - 1] = results[y];
							}
						}
					}
				}
				//if the device is active we need one image, else another
				var pwxdeviceStatus = pwxdevicefindDeviceStatus(display);
				var pwx_device_modal_header_HTML = [];
				//Get current date and time with this formate (mm/dd/yy timeam/pm)
				var pwxdeviceupdatedfinalconnecteddatedisplay = new Date().format("mm/dd/yy HH:MM tt");

				pwx_device_modal_header_HTML.push('<div style="width:100%" id="pwx_device_modal_header_HTML">',
					                             '<span style="height:45px;float:left;" class="pwx_indicator_on_icon pwx_no_text_decor">&nbsp;</span>',
					                             '<dl id="pwx_device_modal_header_first">',
					                             '<span id="pwx_modal_header_device_name_id">' + display + '</span>',
					                             '<span class="pwx_grey">(' + vendorname + '' + modelname + ')</span></dl>',
					                             '<dl style="margin-top:1.0%;">',
					                             '<span id="pwx_device_modal_updated_current_time">' + pwxdeviceupdatedfinalconnecteddatedisplay + '</span>',
					                             '<a id="pwx_device_acquired_anchor" class="pwx_device_row_anchor" style="margin-left:0.5%;" title="Retrieve data">',
					                             '<span class="pwx-refresh-icon pwx_no_text_decor"></span></a>',
					                             '<a id="pwx_device_clear_all" class="pwx_blue_link" title="Clear all textboxes">',
					                             'Clear all</a>',
					                             '</dl></div>');

				var groupCnt = 0;
				var dispCnt = 0;
				var displayCurrent = 0;
				var pwxdevicesingcnt = 0;
				var DevicemodalHTML = [];
				DevicemodalHTML.push("<div style='overflow-x:hidden' class='pwx_device_modal_input' id='vitals-data'>");
				if (pwxdeviceStatus == 0) {
					var countinc = 0;
					groupCnt = 1;
					dispCnt = 0;
					var pwxdevicedisplayobject = resultsOrdered.pwxgroupBy('group');
					var count_group_ids = 0;
					var bpgroupcount = 0;
					for (var groupname in pwxdevicedisplayobject) {
						if (groupname != "") {
							var groupindicator = "";
							groupindicator = groupname.replace(" ", "_");
							DevicemodalHTML.push('<div id="' + count_group_ids + '" class="pwxdevicegroupdiv"><h3 class="pwx_grey">' + groupname + '</h3>');
							$.each(pwxdevicedisplayobject[groupname], function (i, val) {
								if (bpgroupcount != 1) {
									if (groupname == "BP") {
										DevicemodalHTML.push('<div id="groupbp' + i + '" onmouseout="pwxdevicemouseouthideclearbutton(this)" onmouseover="pwxdevicemousehovershowclearbutton(this)" class="pwxdevicebpgroup">',
											'<span title="' + val.name + '">' + val.name + '</span>',
											"<input type='text' size='10'  id ='" + pwxdevicedisplayobject[groupname][i].context + "'  ",
											"onKeyPress='return pwxdevicecheckIt(event);' class='groupbptextbox' name='heartRate' oncopy='return false;'",
											"onpaste='return false;' oncut='return false;'/> / ",
											"<input type='text' size='10' onKeyPress='return pwxdevicecheckIt(event);'",
											"id = '" + pwxdevicedisplayobject[groupname][i + 1].context + "'class='groupbptextbox'",
											"name='dBP' oncopy='return false;' onpaste='return false;' oncut='return false;'/>",
											"<span style='padding-left:1%;width:3%;' class='pwx_grey'>" + val.unitsDisp + "</span>",
											'<a id="pwxdevicebpgroupclearlink" class="pwx_blue_link pwxdevicegroupbpanchor" title="Clear">',
											'Clear</a>',
											'</div>');
										bpgroupcount = 1;
									}
								}
								var labelname = "";
								if ((val.name).length >= 25) {
									labelname += (val.name).substr(0, 25) + '...';
								} else {
									labelname += val.name;
								}
								if (groupname != "BP") {
									DevicemodalHTML.push('<div id="' + groupindicator + 'groupno' + i + '" onmouseout="pwxdevicemouseouthideclearbutton(this)" onmouseover="pwxdevicemousehovershowclearbutton(this)" class="pwxdevicenonbpgroupdiv">',
										'<span title="' + val.name + '" class="pwxdevicegrouplabel">' + labelname + '</span>',
										"<input style='margin-left:2%;' type='text' size='10' id ='" + val.context + "' onKeyPress='return pwxdevicecheckIt(event);' class='" + groupindicator + "" + i + "' oncopy='return false;' onpaste='return false;' oncut='return false;'/>",
										'<span style="padding-left:3%;width:3%;" class="pwx_grey" >' + val.unitsDisp + '</span>',
										'<a id="' + groupindicator + '' + i + '" class="pwx_blue_link pwxdevicegroupanchor" title="Clear">',
										'Clear</a>',
										'</div>');
								}
							});
							DevicemodalHTML.push('</div>');
							count_group_ids = count_group_ids + 1;
						} else {
							$.each(pwxdevicedisplayobject[groupname], function (i, val) {
								var labelname = "";
								if ((val.name).length >= 25) {
									labelname += (val.name).substr(0, 25) + '...';
								} else {
									labelname += val.name;
								}
								if (val.indicator == 0) {
									DevicemodalHTML.push('<div id="pwxdevicenongrouptextbox' + i + '" onmouseout="pwxdevicemouseouthideclearbutton(this)" onmouseover="pwxdevicemousehovershowclearbutton(this)" class="pwxdevicegroupdiv">',
										'<span title="' + val.name + '" class="pwxdevicenongrouplabel">' + labelname + '</span>&nbsp;&nbsp;',
										"<input type='text' size='10' id ='" + val.boxName + "' onKeyPress='return pwxdevicecheckIt(event);' class='pwxdevicenongrouptextbox" + i + "' oncopy='return false;' onpaste='return false;' oncut='return false;'/>",
										"&nbsp;&nbsp;&nbsp;&nbsp;",
										'<span class="pwx_grey" style="width:3%;">' + val.unitsDisp + '</span>',
										'<a id=' + i + ' class="pwx_blue_link pwxdevicenongroupanchor" title="Clear">',
										'Clear</a>',
										'</div>');
								}
								if (val.indicator == 1) {
									DevicemodalHTML.push('<div id="pwxdevicenongrouptextbox' + i + '" class="pwxdevicegroupdiv">',
										'<span title="' + val.name + '" class="pwxdevicenongrouplabel">' + labelname + '</span>&nbsp;&nbsp;',
										"<select style='text-align:center;' name = '" + val.name + "' class='pwxdevicenongroupdropdown' id = '" + val.boxName + "'>");
									for (y = 0; y < (val.optionsDisplay).length; y++) {
										DevicemodalHTML.push("<option size=20 value=" + val.optionsDisplay[y] + ">" + val.optionsDisplay[y] + "");
									}
									DevicemodalHTML.push("</select></span></dd></dl></div>");
								}
							});
						}
					}
					if (pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM.length > 0) {
						DevicemodalHTML.push('<div id="pwx_device_chart_from_section"> ');
						if (pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM.length == 1) {
							DevicemodalHTML.push('<a class="pwx_no_text_decor pwx_grey_link pwx_small_text" title="Add PowerForm" ',
								'onClick="pwx_form_launch(' + pwx_device_person_id + ',' + pwx_device_enc_id + ',' + pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM[0].FORM_ID + ',0.0,0)">',
								'<span class="pwx-add-icon pwx_no_text_decor">&nbsp;</span> Chart form</a>');
						} else {
							DevicemodalHTML.push('<a class="pwx_no_text_decor pwx_grey_link pwx_small_text"   title="Add PowerForm" ',
								'onClick="pwx_form_launch(' + pwx_device_person_id + ',' + pwx_device_enc_id + ',0.0,0.0,0)">',
								'<span class="pwx-add-icon-plus pwx_no_text_decor">&nbsp;</span></a>',
								'<a id="pwx_device-form-dpdown-menu" class="pwx_no_text_decor" title="Add Quick PowerForms" ',
								'onClick="pwx_form_menu(\'pwx_device_alert_form_div\')">',
								'<span class="pwx-add-icon-plus-arrow pwx_no_text_decor"></span><span>Chart form</span></a>',
								'<div class="pwx_device-form-dpdown-menu" id="pwx_device_alert_form_div" style="display:none;">');
							for (var i = 0; i < pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM.length; i++) {
								DevicemodalHTML.push('<a class="pwx_formmenu_link" style="font-weight:bold"',
									'onClick="pwx_form_launch(' + pwx_device_person_id + ',' + pwx_device_enc_id + ',' + pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM[i].FORM_ID + ',0.0,0)">',
									pwx_device_copy_main_obj.data.DEVICE_COMP.ADD_PFORM[i].FORM_NAME + '</a></br>');
							}
							DevicemodalHTML.push('<a style="color:#3380E5;font-weight:normal;" ',
								'onClick="pwx_form_launch(' + pwx_device_person_id + ',' + pwx_device_enc_id + ',0.0,0.0,0)">',
								'All Forms...</a></div>');
						}
						DevicemodalHTML.push("</div>");
					}
					//clear out the global version
					pwxdeviceresultsGlobal = [];
					// Copy whole resule in globalobject and then used later on in sign on process
					for (x = 0; x < results.length; x++) {
						pwxdeviceresultsGlobal[x] = new pwxdeviceresultsFill();
						pwxdeviceresultsGlobal[x] = results[x];
					}
					DevicemodalHTML.push("</div>");
				}
				var width = $(window).width();
				var pwxdevicemodalfixedminwidthbefore = 712.32; // on width 1272 and width of original modal is 560
				var setMarginon = ((width - pwxdevicemodalfixedminwidthbefore) / 2) * 0.1
				if (width > 1272) {
					setMarginon = 28;
				}
				MP_ModalDialog.deleteModalDialogObject("DevicemodalObject")
				var Devicemodal = new ModalDialog("DevicemodalObject")
					.setHeaderTitle(pwx_device_modal_header_HTML.join(""))
					.setTopMarginPercentage(15)
					.setRightMarginPercentage(setMarginon)
					.setBottomMarginPercentage(15)
					.setLeftMarginPercentage(setMarginon)
					.setIsBodySizeFixed(false)
					.setHasGrayBackground(true)
					.setIsFooterAlwaysShown(true);
				Devicemodal.setBodyDataFunction(
					function (modalObj) {
					modalObj.setBodyHTML(DevicemodalHTML.join(""));
				});
				var signbtn = new ModalButton("signdata");
				signbtn.setText("Sign").setCloseOnClick(false).setIsDithered(true).setOnClickFunction(function () {
					pwxdevicesingcnt++; 
				    if(pwxdevicesingcnt == 1){ 
				    pwxdeviceSignData()}
				});
				var closebtn = new ModalButton("addCancel");
				closebtn.setText("Cancel").setCloseOnClick(true);
				Devicemodal.addFooterButton(signbtn)
				Devicemodal.addFooterButton(closebtn)
				Devicemodal.setShowCloseIcon(false);
				MP_ModalDialog.addModalDialogObject(Devicemodal);
				MP_ModalDialog.showModalDialog("DevicemodalObject");

				// display modal on appropriate place when window is resize
				$(window).resize(function () {
					var width = $(window).width();
					var pwxdevicemodalfixedminwidth = 712.32; // on width 1272 and width of original modal is 560
					var setMarginonwindowresize = ((width - pwxdevicemodalfixedminwidth) / 2) * 0.1
					if (width > 1272) {
						setMarginonwindowresize = 28;
					}
					Devicemodal.setRightMarginPercentage(setMarginonwindowresize)
					Devicemodal.setLeftMarginPercentage(setMarginonwindowresize)

				});
				//call this function for enable and disable sign button
				$('.pwx_device_modal_input input').keyup(function () {
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//call this function when drop down gets change
				$('.pwxdevicenongroupdropdown').change(function () {
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//Clear nongroup single textbox (this is dynamic anchor code
				$(".pwxdevicenongroupanchor").click(function () {
					var i = this.id;
					$('.pwxdevicenongrouptextbox' + i + '').val('');
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//Clear group single textbox (this is dynamic anchor code)
				$(".pwxdevicegroupanchor").click(function () {
					var i = this.id;
					$("." + i + "").val('');
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//clear all textboxes
				$("#pwx_device_clear_all").click(function () {
					$(".pwxdevicenongroupdropdown option[value='']").attr('selected', true)
					$('.pwx_device_modal_input').find('input:text').val('');
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				//clear both textbox of blood pressure
				$(".pwxdevicegroupbpanchor").click(function () {
					$('.groupbptextbox').val('');
					pwxdeviceenabledisablesignbutton(Devicemodal);
				});
				// call the acquire function
				$("#pwx_device_acquired_anchor").click(function () {
					PwxDeviceComponentRenderAcquireData(pwxdeviceglobaldeviceIdPasslist, pwxdeviceupdatedfinalconnecteddatedisplay);
					//setInterval(pwxdeviceenabledisablesignbutton(Devicemodal),3000);
					setInterval(function () {
						pwxdeviceenabledisablesignbutton(Devicemodal)
					}, 1000);
				});
				//display form drop down when it click
				$("#pwx_device-form-dpdown-menu").click(function (event) {
					var dt_pos = $(this).position();
					$('.pwx_device-form-dpdown-menu').css('top', dt_pos.top + 13);
					$('.pwx_device-form-dpdown-menu').css('left', dt_pos.left + 8);
				});
				$('#pwx_device_alert_form_div').bind('mouseleave', function () {
					pwx_form_menu('pwx_device_alert_form_div')
				});
				$('#pwx_device_acquired_anchor').click();
			}, // end success
			complete : function (locationItem) {
				// the 'complete' is entered when the ajax call is complete, regardless of whether the call was successful or not
			}, // end complete
			error : function (locationItem) {
				// used for the ajax error handling if there was not a successful call to the restful service
			}
		}); // end $.ajax
	}
}

// Variable to keep the barcode when scanned. When we scan each character is a keypress and hence we push it onto the array.
var chars = []; 
var pressed = false; 
$(window).keypress(function(e) {
	chars.push(String.fromCharCode(e.which));
	if (pressed === false) {
		// waits for input from the barcode scanner
		setTimeout(function(){
			// join the chars array to make a string of the barcode scanned
			var barcode = chars.join("");
			onScan(barcode);
			chars = [];
			pressed = false;
		},500);
	}
	// set press to true so we do not reenter the timeout function above
	pressed = true;
});
	
/* This function takes a list of devices and gets the display name to show to the user in the UI */
function PwxDeviceComponentRenderDeviceDescriptListView(deviceIds) {
	var deviceListFinalHTML = "";
	var deviceListOnlineHTML = "";
	var deviceListOfflineHTML = "";
	var contentelement = document.getElementById("pwx_devices_content_area");
	var urlInfo = new XMLCclRequest();
	//get the url for the REST call
	urlInfo.open('GET', "device_mpage_url");
	urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");

	urlInfo.onreadystatechange = function () {
		var URL = "";
		var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);

		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("data");

		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "URL_PATH") {
				URL = pi_var2[1].text;
			} else if (pi_var2[0].text == "USER") {
				pwxdeviceUSER = pi_var2[1].text;
			} else if (pi_var2[0].text == "PWORD") {
				pwxdevicePWORD = pi_var2[1].text
			}
		}
		// call the function to encode the username/password for basic authorization
		var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
		// build the url for the restful service call using the location alias passed to the load function
		if(URL.toLowerCase().indexOf("/ibus") > -1){
		var deviceListUrl = URL + "gda/api/devices?" + deviceIds + "&retDiscon=true";}
		else{
		var deviceListUrl = URL + "/iBus/gda/api/devices?" + deviceIds + "&retDiscon=true";
		}
		var border_type = 'pwx_grey_border_top-info';

		$.ajax({
			type : 'GET',
			async : true,
			url : deviceListUrl,
			dataType : 'json',
			data : {},
			beforeSend : function (xhr) {
				//add the basic authorization to the ajax request object header
				xhr.setRequestHeader("Authorization", auth);
				xhr.setRequestHeader("Accept", "application/json");
			},
			success : function (locationItem) {
				var vitalsHTML;
				// 'success is entered only if the ajax call to the restful service was successful, including the return of valid
				// data in the format specified in the dataType value in the $.ajax values list.
				// use eval to transform json string returned from restful service to json object
				if (locationItem != undefined && locationItem != null && locationItem != "") {
					var jsonData = locationItem;
					deviceData = locationItem;
				} else {
					var pwx_device_deviceidfail_HTML = [];
					var pwxdeviceidfail = document.getElementById('pwx_devices_content_area');
					pwx_device_deviceidfail_HTML.push('<div id="pwx_device_nolocation_div">',
						'<span class="pwx_single_dt_wpad"><span class="res-none">No devices found</span></span>',
						'</div>');
					$(pwxdeviceidfail).html(pwx_device_deviceidfail_HTML.join(""));
				}
				var found_vendor = 0;
				var process_flag = 0;

				if (pwxdevicevendorglobalNamelist.length == 0 && locationItem != "" && locationItem != null) {
					$.each(jsonData.devices, function (i) {
						//this is a 2d array.  The 0 positions hold the device type then all other positions hold the associated devices
						//so for [0][0] we will have the first device type.  Then pwxdevicevendorglobalNamelist[0][1], [0][2], etc. will have device names
						//that belong to that vendor.  Then pwxdevicevendorglobalNamelist[1][0] will have the next
						found_vendor = pwxdevicefindVendor(jsonData.devices[i].subcategories[0])
							process_flag = 0;
						for (x = 0; x < jsonData.devices[i].categories.length; x++) {
							if (jsonData.devices[i].categories[x] == "DISCRETE_DATA") {
								process_flag = 1;
							}
						}
						if (process_flag == 1) {
							if (found_vendor == -1) {
								// test 3
								pwxdeviceglobalcurrentVendorCnt = pwxdeviceglobalcurrentVendorCnt + 1;
								pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt] = new Array();
								pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt][0] = new pwxdevicefillSubCategories(jsonData.devices[i].subcategories[0])
									pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt][0].displayInd = 1;
								pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt][0].count = 1;
								pwxdevicevendorglobalNamelist[pwxdeviceglobalcurrentVendorCnt][1] = new pwxdevicesetVendorModel(jsonData.devices[i].displayName, jsonData.devices[i].connectedDateTime, jsonData.devices[i].disconnectedDateTime, jsonData.devices[i].model.modelName, jsonData.devices[i].model.vendor, jsonData.devices[i].deviceId, jsonData.devices[i].network.adptHostName, jsonData.devices[i].network.adptIP);
								pwxdevicefillDisplay(jsonData.devices[i].displayName, jsonData.devices[i].deviceId);
							} //end if found_vendor
							else {
								// Emory device
								pwxdevicevendorglobalNamelist[found_vendor][pwxdevicevendorglobalNamelist[found_vendor].length] = new pwxdevicesetVendorModel(jsonData.devices[i].displayName, jsonData.devices[i].connectedDateTime, jsonData.devices[i].disconnectedDateTime, jsonData.devices[i].model.modelName, jsonData.devices[i].model.vendor, jsonData.devices[i].deviceId, jsonData.devices[i].network.adptHostName, jsonData.devices[i].network.adptIP);
								pwxdevicevendorglobalNamelist[found_vendor][0].count = pwxdevicevendorglobalNamelist[found_vendor][0].count + 1;
								pwxdevicefillDisplay(jsonData.devices[i].displayName, jsonData.devices[i].deviceId);
							} //end else
						} //end if process_flag
					}); // end outer loop for parent locations
				}
				var pwxdeviceStatus = 0;
				var variableImage;
				var length = "";
				var dontPrint = 0;
				var color = "";
				var connectedDevicesCnt = 0;
				var disconnectedDevicesCnt = 0;
				var pwx_device_status_name_HTML = [];
				pwx_device_status_name_HTML.push('<h3 class="info-hd">Device</h3><div class="pwx_div_scroll" id="pwx_device_scroll_div">');
				var deviceHvrArray = [];
				var deviceindex = 0;
				for (ven = 0; ven < pwxdevicevendorglobalNamelist.length; ven++) {
				    if (pwxdevicevendorglobalNamelist[ven][0].displayInd == 1) {
						var vitalsCheck = pwxdevicevendorglobalNamelist[ven][0].subCategory;
						for (i = 0; i < pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST.length; i++) {
							if (vitalsCheck == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
								vitalsHTML = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY;
							}
						}
						// Build the expand collapse functionality based on device name and connectivity status
						pwx_device_status_name_HTML.push('<dl class="pwxnopad-info"><dt class="pwx_single_sub_sec_dt"><a id="pwx_devices_title" class="pwx_sub_sec_link" title="Collapse" ',
							'onclick="pwx_expand_collapse_scroll(\'pwx_devices_list\',\'pwx_devices_title\',\'pwx_devices_tgl\',\'pwx_device_scroll_div\',' + pwx_device_scrollsetting + ')">',
							'<h3 class="sub-sec-hd"><span id="pwx_devices_tgl" class="pwx-sub-sec-hd-tgl">-</span>',
							'<span id="pwx_devices_device_category" class="pwx_header_black">',
							vitalsHTML,
							'</span>',
							'<span id="pwx_devices_connection_info"> ',
							'</span><span id="pwx_devices_online_info"></span>',
							'<span id="pwx_devices_offline_info"></span></h3></a></dt></dl>',
							'<div id="pwx_devices_list" style="display:block">');

						var class_name;
						for (y = 1; y < pwxdevicevendorglobalNamelist[ven].length; y++) {
							if (pwxdevicevendorglobalNamelist[ven][y].displayInd == 1) {
								pwxdeviceStatus = pwxdevicefindDeviceStatus(pwxdevicevendorglobalNamelist[ven][y].display);
								if (pwxdeviceStatus == 0) {
									class_name = "device-list online";
									var pwx_device_status_text = "Connected";
									connectedDevicesCnt = connectedDevicesCnt + 1;
								} else if (pwxdeviceStatus == 1) {
									class_name = "device-list offline";
									var pwx_device_status_text = "Offline";
									disconnectedDevicesCnt = disconnectedDevicesCnt + 1;
								} else {
									class_name = "device-list offline";
									var pwx_device_status_text = "Offline";
									disconnectedDevicesCnt = disconnectedDevicesCnt + 1;
								}
								var vitals = "deviceEntryParametersDiv";
								var vend = pwxdevicevendorglobalNamelist[ven][y].display;
								var vendorCorrection = "";
								var vendorCorrectionhover = "";
								var vendormodal = "";
								for (i = 0; i < pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST.length; i++) {
									if (pwxdevicevendorglobalNamelist[ven][y].vendor == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
										vendorCorrection = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY + ", ";
										vendorCorrectionhover = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY;
									}
									if (pwxdevicevendorglobalNamelist[ven][y].model == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
										vendormodal = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY;
									}
								}
								//Will need to code for additional vendors in this area
								var addButton = ""
									//CONNECTED TIME
									if (pwxdeviceStatus == 0) {
										var now = new Date();
										var cndatespiltstring = pwxdevicevendorglobalNamelist[ven][y].connecteddatetime.split('T');
										var cndatepart1 = cndatespiltstring[0].replace(/\-/g, '/')
										var cndatepart2 = cndatespiltstring[1].split('.');
										var cndatefinalstring = cndatepart1 + " " + cndatepart2[0];
										var connectedateformat = Date.parse(cndatefinalstring);
										var difference = now - connectedateformat;
										var connectedateformathover = new Date(cndatefinalstring).format("mm/dd/yy HH:MM tt");
										var finalconnecteddatedisplay = pwxdevicedifferenceToString(difference) + '(' + connectedateformathover + ')';
									}
									// OFFLINE TIME
									if (pwxdeviceStatus == 1) {
										var now = new Date();
										var dndatespiltstring = pwxdevicevendorglobalNamelist[ven][y].disconnectedDateTime.split('T');
										var dndatepart1 = dndatespiltstring[0].replace(/\-/g, '/')
										var dndatepart2 = dndatespiltstring[1].split('.');
										var dndatefinalstring = dndatepart1 + " " + dndatepart2[0];
										var disconnectdateformat = Date.parse(dndatefinalstring);
										var disconnecteddifference = now - disconnectdateformat;
										var disconnectdateformat = new Date(dndatefinalstring).format("mm/dd/yy HH:MM tt");
										var finaldisconnecteddatedisplay = pwxdevicedifferenceToString(disconnecteddifference) + '(' + disconnectdateformat + ')';
									}
								var myHvr = new Array(8);
								myHvr[0] = new Array(2);
								if (pwxdeviceStatus == 0) {
									myHvr[0][0] = 'Status:';
									myHvr[0][1] = '<span id="pwx_device_connected_color">Connected </span><span class="pwx_grey">' + finalconnecteddatedisplay + '</span>';
								} else {
									myHvr[0][0] = 'Status:';
									myHvr[0][1] = '<span>Offline </span><span class="pwx_grey">' + finaldisconnecteddatedisplay + '</span>';
								}
								myHvr[1] = new Array(2);
								myHvr[1][0] = 'Device:';
								myHvr[1][1] = pwxdevicevendorglobalNamelist[ven][y].display;
								myHvr[2] = new Array(2);
								myHvr[2][0] = 'Manufacturer:';
								myHvr[2][1] = vendorCorrectionhover;
								myHvr[3] = new Array(2);
								myHvr[3][0] = 'Model:';
								myHvr[3][1] = vendormodal;
								myHvr[4] = new Array(2);
								myHvr[4][0] = 'Category:';
								myHvr[4][1] = vitalsHTML;
								myHvr[5] = new Array(2);
								myHvr[5][0] = 'Device ID:';
								myHvr[5][1] = pwxdevicevendorglobalNamelist[ven][y].deviceID;
								myHvr[6] = new Array(2);
								myHvr[6][0] = 'Adapter Host Name:';
								myHvr[6][1] = pwxdevicevendorglobalNamelist[ven][y].adptHost;
								myHvr[7] = new Array(2);
								myHvr[7][0] = 'Adapter IP:';
								myHvr[7][1] = pwxdevicevendorglobalNamelist[ven][y].adptIP;

								deviceHvrArray.push(myHvr);

								if (pwxdeviceStatus == 0) {
									pwx_device_status_name_HTML.push('<dl id="device_row_'+deviceindex+'" class="' + border_type + ' device-info">',
										'<a class="pwx_device_row_anchor" onclick="pwxdevicemodalopen(\'' + vitals + '\',\'' + ven + '\',' + y + ',\'' + vend + '\');">',
										'<dt id="pwx_devices_header_deviceindicator">',
										'<span style="height:45px;float:left;" class="pwx_indicator_on_icon"></span></dt>',
										'<dt id="pwx_devices_header_devicename"><span style="font-weight:bold;">' + pwxdevicevendorglobalNamelist[ven][y].display + '</span>',
										'<p style="font-size:11px;" class="pwx_grey">' + pwxdevicedifferenceToString(difference) + '</p></dt>',
										'<dt id="pwx_devices_header_devicemanufname"><span style="font-weight:bold;">' + vendorCorrection + '</span>',
										'<span id="pwx_device_mo" class="pwx_grey">' + vendormodal + '</span></dt>',
										'<dt id="pwx_devices_header_devicelaunchsection">',
										'<a id='+(pwxdevicevendorglobalNamelist[ven][y].deviceID).replace(/\s+/g, '')+' onclick="pwxdevicemodalopen(\'' + vitals + '\',\'' + ven + '\',' + y + ',\'' + vend + '\');" title="Add Vitals">',
										'<span class="pwx-add-icon-plus pwx_no_text_decor"></span></a>',
										'</dt></a></dl>');
									border_type = 'pwx_grey_border-info';
								} else if (pwxdeviceStatus == 1) {
									pwx_device_status_name_HTML.push('<dl id="device_row_'+deviceindex+'" class="' + border_type + ' device-info">',
										'<dt id="pwx_devices_header_deviceindicator">',
										'<span style="height:45px;float:left;" class="pwx_indicator_off_icon"></span></dt>',
										'<dt id="pwx_devices_header_devicename"><span style="font-weight:bold;">' + pwxdevicevendorglobalNamelist[ven][y].display + '</span>',
										'<p style="font-size:11px;" class="pwx_grey">' + pwxdevicedifferenceToString(disconnecteddifference) + '</p></dt>',
										'<dt id="pwx_devices_header_devicemanufname"><span style="font-weight:bold;">' + vendorCorrection + '</span>',
										'<span id="pwx_device_modal_name" class="pwx_grey">' + vendormodal + '</span></dt>',
										'<dt id="pwx_devices_header_devicelaunchsection">',
										'<span class="pwx-alert-red-icon"></span>',
										'</dt></dl>'); 
									border_type = 'pwx_grey_border-info';
								}
								deviceindex = deviceindex + 1;
								if (dontPrint == 0) {}
								else {
									dontPrint = 0;
								}
							}
						} //end for y
						pwx_device_status_name_HTML.push("</div>");
						pwx_device_status_name_HTML.push("</div>");
						$(contentelement).html(pwx_device_status_name_HTML.join(""));
						//hovers and check scrolling activate hovers
	                    var elementMap = {};
	                    // remove event if there is any
	                    $("#pwx_device_scroll_div").off("mouseenter", 'dl.device-info');
	                    $("#pwx_device_scroll_div").off("mouseleave", 'dl.device-info');
	                    // attach event
	                    $("#pwx_device_scroll_div").on("mouseenter", 'dl.device-info', function (event) {
	                    	var anchor = this;
	                    	$(this).css("background-color", "#FFC")
	                    	var anchorId = $(this).attr("id");
	                    	//If there is a hover class specified, add it to the element
	                    	$(this).addClass("mpage-tooltip-hover");
	                    	if (!elementMap[anchorId]) {
	                    		elementMap[anchorId] = {};
	                    	}
	                    	//Store of a flag that we're hovered inside this element
	                    	elementMap[anchorId].TIMEOUT = setTimeout(function () {
	                    			showdeviceHover(event,anchor);
	                    		}, 500);
	                    });
	                    $("#pwx_device_scroll_div").on("mouseleave", 'dl.device-info', function (event) {
	                    	$(this).css("background-color", "#FFF")
	                    	$(this).removeClass("mpage-tooltip-hover");
	                    	clearTimeout(elementMap[$(this).attr("id")].TIMEOUT);
	                    });
	                    function showdeviceHover(event,anchor) {
	                    	var jsonId = $(anchor).attr("id").split("_");
	                    	switch (jsonId[0]) {
	                    	case "device":
	                    		var deviceindexarray = deviceHvrArray[jsonId[2]];
	                    		showdeviceHoverHTML(event, anchor, deviceindexarray)
	                    	break;
	                    	}
	                    }
	                    function showdeviceHoverHTML(event, anchor, devicehoverarray) {
	                    	var devicehvr = [];
	                    	devicehvr.push('<div class="result-details">');
	                    	for (var i = 0; i < devicehoverarray.length; i++) {
	                    		devicehvr.push('<dl class="device-det">',
	                    			'<dt><span>' + devicehoverarray[i][0] + '</span></dt><dd><span>' + devicehoverarray[i][1] + '</span></dd></dl>');
	                    	}
	                    	//Create a new tooltip
	                    	devicehvr.push('</div>');
	                    	var devicehvrtooltip = new MPageTooltip();
	                    	devicehvrtooltip.setX(event.pageX).setY(event.pageY).setAnchor(anchor).setContent(devicehvr.join(""));
	                    	devicehvrtooltip.show();
	                    	if(typeof m_viewpointJSON != "undefined"){$('html').css('overflow', 'hidden');}
	                    }
						var pwxdivh = document.getElementById('pwx_device_scroll_div').offsetHeight;
						if (pwxdivh > pwx_device_scrollsetting) {
							var div_height = pwx_device_scrollsetting + 'px';
							document.getElementById('pwx_device_scroll_div').style.height = div_height;
						}
						pwxclearheight('pwx_device_scroll_div', pwx_device_scrollsetting);
						var connectionInfoBeg = " (";
						if (connectedDevicesCnt > 0) {
							var onlineInfo = +connectedDevicesCnt + " <span id='pwx_device_connected_color'>connected</span>";
							var offlineInfo = ", "
						} else {
							var offlineInfo = ""
						}
						offlineInfo += disconnectedDevicesCnt + " offline)";
						$('#pwx_devices_connection_info').html(connectionInfoBeg);
						$('#pwx_devices_online_info').html(onlineInfo);
						$('#pwx_devices_offline_info').html(offlineInfo);						
						
					} // end if displayInd
				} //end for ven
			}, // end success
			complete : function (locationItem) {}, // end complete
			error : function (locationItem) {}
			// end error
		}); // end $.ajax
	}
}

function onScan(barcodeVal) { 
	if(deviceData != null && deviceData != undefined) {
		$.each(deviceData.devices, function (i) {
			if ( barcodeVal != '' && barcodeVal.trim() === deviceData.devices[i].deviceId.trim()) {
				$('#'+(deviceData.devices[i].deviceId).replace(/\s+/g, '')).click();
			}
		});
	}
}
										
//enable and disable sign button when user hit clear button
function pwxdeviceenabledisablesignbutton(Devicemodal) {
	var pwx_device_drop_down = $(".pwxdevicenongroupdropdown").val();
	var pwx_device_input_value_change = $(".pwx_device_modal_input input").map(function () {
			var value = $.trim($(this).val());
			if (value != "")
				return value;
		}).length > 0;
	if (pwx_device_input_value_change == true || pwx_device_drop_down != '') {
		Devicemodal.setFooterButtonDither("signdata", false);
	} else {
		Devicemodal.setFooterButtonDither("signdata", true);
	}
}
function pwxdevicemousehovershowclearbutton(divid) {
	var showhideid = divid.id;
	$('#' + divid.id + ' a').show();
}
function pwxdevicemouseouthideclearbutton(divid) {
	var showhideid = divid.id;
	$('#' + divid.id + ' a').hide();
}
function pwxdeviceloadXMLString(txt) {
	//Internet Explorer
	//this creates the nex XML object
	xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	xmlDoc.async = "false";
	xmlDoc.loadXML(txt);
	return (xmlDoc);
}
/* The pwxdeviceStatus function creates a pwxdeviceStatus object.The status of the device, 0 for active, 1 for inactive, 2 for unknow */
function pwxdeviceStatus(deviceID, status) {
	//fill out the members of the pwxdeviceStatus object
	this.deviceID = deviceID;
	this.status = status;
	this.display = "";
} //end pwxdeviceStatus
/* The findVendor function checks to see if the vendor already exists  in the array.Returns a -1 if not found or the first position where it is found in the array */
function pwxdevicefindVendor(vendor_name) {
	var found_vendor = -1;
	//spin through the vendor array.  The vendor name is
	for (x = 0; x < pwxdevicevendorglobalNamelist.length; x++) {
		//check if the vendor is found.The vendor name is always stored in position in the 0 position of the second array under the .vendor of the object
		if (vendor_name == pwxdevicevendorglobalNamelist[x][0].subCategory) {
			found_vendor = x;
		}
	}
	//return the vendor position or -1 if not found
	return found_vendor;
} //end pwxdevicefindVendor
function pwxdevicefillSubCategories(subCategory) {
	this.subCategory = subCategory;
	this.displayInd = 1;
	this.count = 0;
}
function pwxdevicesetVendorModel(display, connecteddatetime, disconnectedDateTime, model, vendor, deviceID, adptHost, adptIP) {
	this.vendor = vendor;
	this.model = model;
	this.display = display;
	this.connecteddatetime = connecteddatetime;
	this.disconnectedDateTime = disconnectedDateTime;
	this.deviceID = deviceID;
	this.adptHost = adptHost;
	this.adptIP = adptIP;
	this.displayInd = 1;
} //end pwxdevicesetVendorModel
function pwxdevicefillDisplay(display, deviceID) {
	for (i = 0; i < pwxdeviceglobaldeviceslist.length; i++) {
		if (pwxdeviceglobaldeviceslist[i].deviceID == deviceID) {
			pwxdeviceglobaldeviceslist[i].display = display;
		}
	}
} //end pwxdevicefillDisplay
function pwxdevicefindDeviceStatus(display) {
	var device_status = -1;
	for (i = 0; i < pwxdeviceglobaldeviceslist.length; i++) {
		if (pwxdeviceglobaldeviceslist[i].display == display) {
			device_status = pwxdeviceglobaldeviceslist[i].status;
		}
	}
	return device_status;
} //end pwxdevicefindDeviceStatus
/* display_acquired_data is used to display the most recent results to the screen. */
function pwxdevice_display_acquired_data() {
	var context_string = "";
	for (resCnt = 0; resCnt < pwxdeviceglobalbusResults.length; resCnt++) {
		context_string = pwxdeviceglobalbusResults[resCnt].context;
		if (pwxdevicecheckobject(context_string)) {
			pwxdevicesetDocument(context_string, pwxdeviceglobalbusResults[resCnt].value);
		} // end if
	} //end for
} //end pwxdevice_display_acquired_data
function pwxdevicefillBusResults(value, context) {
	this.value = value;
	this.context = context;
} //end pwxdevicefillBusResults
function pwxdevicesetDocument(context_string, value, Devicemodal) {
	document.getElementById(context_string).value = value
} //end pwxdevicesetDocument
/* Returns true if the object exists, else returns false */
function pwxdevicecheckobject(obj) {
	if (document.getElementById(obj)) {
		return true;
	} //end if
	else {
		return false;
	} //end else
} //end pwxdevicecheckobject
function pwxdevicemodalopen(id, x, y, displayName) {
	//once the modal is open, figure out what needs to display on the right this will be another restful service call
	var vendorname = "";
	var modalname = "";
	for (i = 0; i < pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST.length; i++) {
		if (pwxdevicevendorglobalNamelist[x][y].vendor == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
			vendorname = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY + ", ";
		}
		if (pwxdevicevendorglobalNamelist[x][y].model == pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_LOOK_UP) {
			modalname = pwx_device_copy_main_obj.data.DEVICE_COMP.DEVICE_LIST[i].DEVICE_NAME_DISPLAY;
		}
	}
	PwxDeviceComponentRenderDeviceEntryParameters(pwxdevicevendorglobalNamelist[x][y].vendor, pwxdevicevendorglobalNamelist[x][y].model, pwxdevicevendorglobalNamelist[x][y].deviceID, pwxdevicevendorglobalNamelist[x][y].display, vendorname, modalname);
} //end pwxdevicemodalopen
/*Creates an object that will hold results, both what comes off the bus and what is available from the device */
function pwxdeviceresultsFill() {
	//fill out the members of the pwxdeviceStatus object
	this.indicator = 0;
	this.boxName = "";
	this.name = "";
	this.units = "";
	this.unitsDisp = "";
	this.unitsAlias = "";
	this.alias = "";
	this.context = "";
	this.group = "";
	this.index = 0;
	this.displayOrder = 0;
	this.subChild = 0;
	this.displayInd = 1;
	this.value = "";
	this.optionsDisplay = [];
	this.optionsId = [];
}
function pwxdeviceunitsFill() {
	this.units = "";
	this.alias = "";
	this.display = "";
}
/* SignData performs the rest service call to push the data into mill.Finds the person id and MRN and then places
the data from the device and any manual entry fields into a JSON object which is then pushed into MILL */
function pwxdeviceSignData() {
	//disable the sign button
	/** ask shaun about getting id of button from modal **/
	//the first thing we need to do is get the patient data
	var patInfo = new XMLCclRequest();
	var sex = "";
	var PID = "";
	var MRN = "";
	var USERNAME = "";
	var dob = "";
	var dob2 = "";
	//Call the ccl progam and send the parameter string
	patInfo.open('GET', "device_mpage_patientinfo");
	patInfo.send("^MINE^, value($PAT_Personid$), value($VIS_Encntrid$), value($USR_PersonId$)");
	patInfo.onreadystatechange = function () {
		var xmlDoc = pwxdeviceloadXMLString(patInfo.responseText);
		// Get all of the parent patientInfo nodes from the xml
		var pi_var = xmlDoc.getElementsByTagName("patientInfo");
		for (var i = 0; i < pi_var.length; i++) {
			var pi_var2 = pi_var[i].childNodes;
			if (pi_var2[0].text == "name") {
				name = pi_var2[1].text;
			} else if (pi_var2[0].text == "gender") {
				if (pi_var2[1].text == "Male") {
					sex = "m";
				} else if (pi_var2[1].text == "Female") {
					sex = "f";
				} else {
					sex = "o";
				}
			} else if (pi_var2[0].text == "PID") {
				PID = pi_var2[1].text;
			} else if (pi_var2[0].text == "MRN") {
				MRN = pi_var2[1].text;
			} else if (pi_var2[0].text == "USERNAME") {
				USERNAME = pi_var2[1].text;
			} else if (pi_var2[0].text == "date") {
				dob = pi_var2[1].text;
			}
		}
		//results send holds what will finally be sent to the BUS. This gets all the junk out without trying to send it across the bus
		var resultsSend = [];
		//spin through the global record structure
		for (x = 0; x < pwxdeviceresultsGlobal.length; x++) {
			//check to see if the object exists if the object exists that means we have a box to pull data from (combo box or text area box)
			if (pwxdevicecheckobject(pwxdeviceresultsGlobal[x].boxName)) {
				//this is a sub child of an existing context, so we process slightly differently
				if (pwxdeviceresultsGlobal[x].subChild == 1) {
					//so we spin through the options and when we find the option that is selected we need to flop the alias of the box selected
					for (y = 0; y < pwxdeviceresultsGlobal[x].optionsDisplay.length; y++) {
						if (pwxdeviceresultsGlobal[x].optionsDisplay[y] == document.getElementById(pwxdeviceresultsGlobal[x].boxName).value) {
							pwxdeviceresultsGlobal[x].alias = pwxdeviceresultsGlobal[x].optionsId[y]
								pwxdeviceresultsGlobal[x].value = document.getElementById(pwxdeviceresultsGlobal[x].context).value
						}
					} //end for y
					//else it isn't a sub child, just grab the value from the box
				} else {
					pwxdeviceresultsGlobal[x].value = document.getElementById(pwxdeviceresultsGlobal[x].boxName).value
				}
			}
		} //end for x
		for (x = 0; x < pwxdeviceresultsGlobal.length; x++) {
			//this for loop copies the junk out. If there is no value or no alias we don't push this to the bus.Copy the good results inot the the resultsSend record
			if (pwxdeviceresultsGlobal[x].value > "" && pwxdeviceresultsGlobal[x].alias > "") {
				resultsSend[resultsSend.length] = new pwxdeviceresultsFill();
				resultsSend[resultsSend.length - 1] = pwxdeviceresultsGlobal[x]
			}
		} //end for x
		var tempNum = 0;
		//check for any trailing zeros
		for (x = 0; x < resultsSend.length; x++) {
			tempNum = parseFloat(resultsSend[x].value);
			resultsSend[x].value = tempNum.toString();
		}
		//discretedata_var is the json we will load on the put
		var discretedata_var = '{'
			 + '"discreteData" : {'
			 + '"ackRequired" : false,'
			 + '"deviceId" : "' + pwxdeviceglobaldeviceIdPasslist + '",'
			 + '"displayName" : "Bogus Device",'
			 + '"entries" : ['
			//each trip through the for loop will be a result
			for (x = 0; x < resultsSend.length; x++) {
				discretedata_var += '{'
				 + '"acqDtTm" : "2010-11-08T15:15:05.067-06:00",'
				 + '"autoVerInd" : false,'
				 + '"ckiContext" : "' + resultsSend[x].alias + '",'
				 + '"clinSigDtTm" : "2010-11-08T15:15:05.067-06:00",'
				 + '"codContext" : "' + resultsSend[x].alias + '",'
				 + '"codContextNM" : "CODIFIED_CONTEXT_NOMENCLAUTRE_UNKNOWN",'
				 + '"codUnit" : "' + resultsSend[x].unitsAlias + '",'
				 + '"codUnitNm" : "CODIFIED_UNIT_NOMENCLAUTRE_UNKNOWN",'
				 + '"contentSeq" : 0,'
				 + '"context" : "' + resultsSend[x].alias + '",'
				 + '"groupSeq" : "",'
				 + '"units" : "' + resultsSend[x].unitsAlias + '",'
				 + '"value" : "' + resultsSend[x].value + '"'
				//if we aren't at the end put a comma else we don't need a comma to close the section
				if (x + 1 == resultsSend.length) {
					discretedata_var += '}'
				} else {
					discretedata_var += '},'
				}
			}
			//fill out the patient information hard coded here, will be coming out of ccl
			discretedata_var += '],'
			 + '"msgToken" : "",'
			 + '"org" : "' + pwxdeviceLOCATION + '",'
			 + '"patConId" : "",'
			 + '"patConUpdtDtTm" : "2010-11-08T15:15:05.067-06:00",'
			 + '"performPrsnlId" : "' + USERNAME + '"'
			 + '},'
			 + '"patient" : {'
			 + '"dob" : "' + dob + '",'
			 + '"gender" : "' + sex + '",'
			 + '"idents" : ['
			 + '{"identContext" : "MRN", "identId" : "' + MRN + '", "identInternalId" : "", "identIssuer" : "CERNER_MILLENNIUM"},'
			 + '{"identContext" : "PID", "identId" : "' + PID + '", "identInternalId" : "", "identIssuer" : "CERNER_MILLENNIUM"}'
			 + '],'
			 + '"name" : "' + name + '"'
			 + '}'
			 + '}'
			var urlInfo = new XMLCclRequest();
		//get the url for the REST call
		urlInfo.open('GET', "device_mpage_url");
		urlInfo.send("^MINE^, value($VIS_Encntrid$), value($USR_PersonId$)");
		urlInfo.onreadystatechange = function () {
			var URL = "";
			var xmlDoc = pwxdeviceloadXMLString(urlInfo.responseText);
			// Get all of the parent patientInfo nodes from the xml
			var pi_var = xmlDoc.getElementsByTagName("data");
			for (var i = 0; i < pi_var.length; i++) {
				var pi_var2 = pi_var[i].childNodes;
				if (pi_var2[0].text == "URL_PATH") {
					URL = pi_var2[1].text;
				} else if (pi_var2[0].text == "USER") {
					pwxdeviceUSER = pi_var2[1].text;
				} else if (pi_var2[0].text == "PWORD") {
					pwxdevicePWORD = pi_var2[1].text
				}
			}
			if(URL.toLowerCase().indexOf("/ibus") > -1){
			var epprUrl = URL + "cas/api/chartdoc/discretedata"}
			else{
			var epprUrl = URL + "/iBus/cas/api/chartdoc/discretedata"
			}
				var auth = pwxdevice_make_basic_auth(pwxdeviceUSER, pwxdevicePWORD);
			//this ajax call pushes the data over which mill processes and inserts the results
			$.ajax({
				type : 'PUT',
				async : true,
				url : epprUrl,
				dataType : 'json',
				contentType : 'application/json',
				data : discretedata_var,
				beforeSend : function (xhr) {
					//add the basic authorization to the ajax request object header
					xhr.setRequestHeader("Authorization", auth);
					xhr.setRequestHeader("Accept", "application/json");
				},
				success : function (discretedata) {},
				complete : function (discretedata) {
					if (discretedata.status == "201") {
						//alert("Data Successfully Signed");
						MP_ModalDialog.closeModalDialog("DevicemodalObject");
					}
				},
				error : function (discretedata) {
					if (discretedata.status != "201")
						alert(discretedata.status);
				}
			}); // .ajax
		}
	}
}
function pwxdevicefillGroups() {
	this.name = "";
	this.displayOrder = 0;
}
function pwxdevicecheckIt(evt) {
	evt = (evt) ? evt : window.event
	var charCode = (evt.which) ? evt.which : evt.keyCode
	if (charCode != 46) {
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			status = "This field accepts numbers only."
				return false;
		}
	}
	status = ""
		return true
		$('#Password').bind('cut copy paste', function (event) {
			event.preventDefault();
		});
}
function pwxdevicedifferenceToString(milliseconds) {
	var seconds = milliseconds / 1000;
	var numyears = Math.floor(seconds / 31536000);
	var numdays = Math.floor((seconds % 31536000) / 86400);
	var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
	var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	// var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
	if (numdays == 0) {
		return +numhours + " hr, " + numminutes + " min ";
	}
	if (numdays > 0) {
		return "> 24 hours";
	}
}
function pwx_device_copy_obj_devicename(o) {
	var pwx_device_copy_main_obj = new Object();
	for (var e in o) {
		pwx_device_copy_main_obj[e] = o[e];
	}
	return pwx_device_copy_main_obj;
}
// Encode the user id and password for the ibus
var PwxBase64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3,
		enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;
		input = PwxBase64._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}
		return output;
	},
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1,
		chr2,
		chr3;
		var enc1,
		enc2,
		enc3,
		enc4;
		var i = 0;
		input = input.replace(/[A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}
		output = PwxBase64._utf8_decode(output);
		return output;
	},
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

