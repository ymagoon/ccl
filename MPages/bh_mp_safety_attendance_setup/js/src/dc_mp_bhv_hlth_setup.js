var validateForm = function()
	{

		function validateNumber(ctrl, min, max){
			var ctrlValue = ctrl.val();
			var valid = true;
			if(!ctrlValue.match(/^0*?[1-9]\d*$/)){
				if(!ctrlValue.match(/^\s*$/)){

				alert("Please enter a valid number");
				valid = false;
			} }
			else{
				var number = parseInt(ctrlValue);
				if(!inRange(number, min, max)) {
					max == 720 ? 
						alert("Please enter a valid number ranging between "+ min + " min and 12 hours") : 
						alert("Please enter a valid number ranging between "+ min + " and " + max);
					valid = false;
				}
			}
			if (valid == false){
				ctrl.focus();
			} 
			return	valid;
		}
		function inRange(value, min, max){
			var retval = true;
			if(min === undefined){}
			else{
				if(value < min){
					retval = false;
				}
			}
			
			if(max === undefined){}
			else{
				if(value > max){
					retval = false;
					}
			}
			return retval;
			
		}

		var validate = true;
		
		validate = validateNumber($('#sendRequestBatchInput'),10,100);
		if (validate == false) return false;
		
		validate = validateNumber($('#loadRequestBatchInput'),1);
		if (validate == false) return false;
		
		validate = validateNumber($('#RetrieveDefaultTime'), 1,720);
		if (validate == false) return false;
		
		return validate;
	};


var setup = (function(){

	var nomenList = [];
	var nomenDefaultList = [];
	var nomenResponse = [];
	var defaultNom = [];
	var nuResponse = [];
	var locTypeSelected = [];
	var ceLabel=[];
	var nomenResponseCnt = 0;
	var nomenResponseCollection = [];
	var json_handler = new UtilJsonXml({
		"debug_mode_ind" : 0,
		"disable_firebug" : true
	});

	/*
	 * event handler
	 */
	//Radio button event
	$(document).on('change', 'input:radio', function() {
		$(this).closest('table').find('input:text').attr('disabled', 'disabled');
		$(this).closest('tr').find('input:text').removeAttr('disabled');
	});

	$(document).on('change', '.ptpopRadio', function(){
		if($(this).attr("value")==="1"){
			$('#wtsDiv').slideDown("slow");
			$('#defaultPopDiv').slideDown("slow");
			$('#locTypeDiv').slideUp("slow");
			$('#defaultPopRadio1').prop("disabled", false);
			$('#defaultPopRadio2').prop("disabled", true);
			$('#defaultPopRadio2').prop("checked", false);
		}
		else if($(this).attr("value")==="2"){
			$('#wtsDiv').slideDown("slow");
			$('#defaultPopDiv').slideDown("slow");
			$('#locTypeDiv').slideDown("slow");
			$('#defaultPopRadio1').prop("disabled", true);
			$('#defaultPopRadio2').prop("disabled", false);
			$('#defaultPopRadio1').prop("checked", false);
		}
		else if($(this).attr("value")==="3"){
			$('#locTypeDiv').slideDown("slow");
			$('#wtsDiv').slideDown("slow");
			$('#defaultPopDiv').slideDown("slow");
			$('#defaultPopRadio1').prop("disabled", false);
			$('#defaultPopRadio2').prop("disabled", false);
		}
		if($("#wtsRadioN").attr("checked")==="checked"){
			$('#defaultPopRadio2').attr("disabled", true);
		}
	});

	//Wts location section event
	$(document).on('change', '#wtsDiv input:radio', function(event){
		if($(event.target).attr("id")==="wtsRadioN"){
			$('#defaultPopRadio2').attr("disabled", true);
		}
		else if($(event.target).attr("id")==="wtsRadioY"){
			if(!$('#ptpopRadioList').attr("checked")){
				$('#defaultPopRadio2').attr("disabled", false);
			}
		}
	});

	//Location Type Selection event
	$(document).on('change', '#locTypeCheck', function(){
		$('#locTypeDiv select[name=\'locTypeSelectedlList\']').html("");
		var html="";
		var list = [];
		if(!$(this).prop("checked")){
			list = _.filter(nuResponse, function(nu){
				return nu.ACTIVE_IND===1;
			});
		}
		else{
			list = nuResponse;
		}
		$.each(list,  function(i, e){
			var ind="";
			if(e.ACTIVE_IND===1){
				ind="active";
			}
			else{
				ind="inactive";
			}
			html+="<option value='"+e.CODE_VALUE+"' title='"+e.DISPLAY+"' class='"+ind+"'>"+e.DISPLAY+"</option>";
		});
		$('#locTypeDiv select[name=\'locTypeAvailList\']').html(html);
		setLocType();
	});

	$(document).on('click', '#locTypeAddButton', function(){
		$(this).closest('tr').find('select[name=\'locTypeAvailList\']').find("option:selected").each(function(i, v){
			var newOpt = "<option value='"+ $(v).val()+"'>"+$(v).html()+"</option>";
			$(v).closest('tr').find('select[name=\'locTypeSelectedlList\']').append(newOpt);
			$(v).remove();
		});
	});

	$(document).on('click', '#locTypeRemoveButton', function(){
		$(this).closest('tr').find('select[name=\'locTypeSelectedlList\']').find("option:selected").each(function(i, v){
			if($(v).attr("class")&&!$('#locTypeCheck').prop("checked")){
				$(v).remove();
			}
			else{
				var newOpt = "<option value='"+ $(v).val()+"'>"+$(v).html()+"</option>";
				$(v).closest('tr').find('select[name=\'locTypeAvailList\']').append(newOpt);
				$(v).remove();
			}
		});
	});

	//nurse unit drop down event
	$(document).on('change', 'select[name=\'interval\']', function(){
		$(this).siblings('select[name=\'unit\']').remove();
		$(this).parent().append("<select class='itemDrop' name='unit'></select>");
		requestUnit($(this).val(), $(this));
	});

	//Suicide Risk Response Event
	$(document).on('click', '#sRiskNew', function(){
		var del = "<button class='sRiskDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var input = "<input class='itemInputShort' type='text'></input>";
		var dropDown = "<select class='itemDrop' name='icon'><option value='0'>No Icon</option><option value='1'>Medium Risk Icon</option><option value='2'>Critical Risk Icon</option></select>";
		var button = "<img class='sRiskUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='sRiskDown' src='"+staticContentLocation +"/img/6364_down.png'/>";
		$('#suicideTable').append("<tr><td>"+button+"</td><td>"+input+"</td><td>"+dropDown+"</td><td>"+del+"</td></tr>");
	});

	$(document).on('click', '.sRiskDel', function(){
		$(this).closest('tr').remove();
	});

	$(document).on('click', '.sRiskUp', function(){
		var row = $(this).closest('tr');
		row.insertBefore(row.prev());
	});

	$(document).on('click', '.sRiskDown', function(){
		var row = $(this).closest('tr');
		row.insertAfter(row.next());
	});

	$(document).on('click', '#updateButton',function(){
		if (validateForm() == false ) return false;
		requstUpdate();
	});

	//Default Time Interval Event
	$(document).on('click', '#defaultIntervalNew', function(){
		var html="<tr><td><select class='itemDrop' disabled='disabled'><option>ALL</option></select></td>"
			+"<td><input class='itemInputShort' type='text'></input></td>"
			+"<td><button class='defaultIntervalDel' type='button'><img src='"+staticContentLocation +"/img/4984_16.png'/></button></td></tr>";
			$('#defaultIntervalTable').append(html);
	});

	$(document).on('click', '.defaultIntervalDel', function(){
		$(this).closest('tr').remove();
	});
	
	$(document).on('click', '#intervalNew', function(){
		var html="<tr><td><select class='itemDrop' name='interval'>"+loadLocationList()+"</select></td>"
		+"<td><input class='itemInputShort' type='text'></input></td>"
		+"<td><button class='intervalDel' type='button'><img src='"+staticContentLocation +"/img/4984_16.png'/></button></td></tr>"
		$('#intervalTable').append(html);
		$('#intervalTable').find('select[name=\'interval\']').last().trigger('change');
	});
			
	$(document).on('click', '.intervalDel', function(){
		$(this).closest('tr').remove();
	});
	
	//Patient Status/Acitivty
	$(document).on('click', '#newEventButton', function(){
		var ind=$('.statusListNomenNew').length;
		//if( ind<3){
			var url = staticContentLocation+"/html/clinical_event_selection_template.html";
			var html = $.get(url, function(data){
				$(data).appendTo('#eventDiv');
			});
			var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
			$('.statusNomenDeleteNew').last().find('img').attr('src', deleteImageUrl);
			$('.statusListNomenNew').last().find('input:radio').attr('name', 'statusNomenNew'+ind);
		//}
		var codeSearch93 = new CodeSearch({
			"element": $(".typeahead93")
			,"codeSet": 93
			,"prim_ind" : 1
		});
		var codeSearch72 = new CodeSearch({
			"element": $(".typeahead72")
			,"codeSet": 72
		});
		$('.label_DISPLAY_93').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 93)');
		$('.label_DISPLAY_72').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 72)');
	});
	
	$(document).on('click', '.statusNomenDeleteNew', function(){
		$(this).closest('div').remove();
	});
	
	//Location Available Nomen Responses Section Event
	$(document).on('click', '#newNomenButton', function(){
		var html ="<div class='nomenItemDiv'><div><button class='deleteButton'><img src='"+staticContentLocation +"/img/4984_16.png'/></button><select class='itemDrop' name='interval'>"+loadLocationList()+"</select></div>";
		$.each(nomenList, function(i, e){
			html+=e.html;
		});
		html+="</div>";
		$('#nomenDiv').append(html);
		$('#nomenDiv').find('select[name=\'interval\']').last().trigger('change');
	});
	
	$(document).on('click', '.addButton', function(){
		addNomen(this);
	});
	
	$(document).on('click', '.removeButton', function(){
		removeNomen(this);
	});
	
	$(document).on('click', '.upButton', function(){
		upNomen(this);
	});
	
	$(document).on('click', '.downButton', function(){
		downNomen(this);
	});
	
	$(document).on('click', '.deleteButton', function(){
		$(this).closest('.nomenItemDiv').remove();
	});
	
	//Default Nomenclatures available for other locations/undefined locations Event
	$(document).on('click', '#defaultNomenNew', function(){
		var del = "<button class='defaultNomenDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var remove = "<button class='defaultNomenRemove'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var button = "<img class='defaultNomenUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='defaultNomenDown' src='"+staticContentLocation +"/img/6364_down.png'/>"
		var add = "<img src='"+	staticContentLocation+"/img/3941_16.png"+"' class='defaultNomenAdd'/>";
		var table = "<table class='defaultNomenWrapper'><tr>	<th></th><th>Display</th><th><button type='button' class='defaultNomenAdd'>"+add+remove+"</button></th></tr><tbody class='defaultNomenTable'>";
		$.each(nomenDefaultList, function(i, e){
			$('#defaultDiv').append(table+"<tr><td>"+button+"</td><td>"+e+"</td><td>"+del+"</td></tr></tbody></table>");
		})
		$('#defaultNomenNew').attr('disabled', true);
	});
	
	$(document).on('click', '.defaultNomenDel', function(){
		$(this).closest('tr').remove();
	});
	
	$(document).on('click', '.defaultNomenRemove', function(){
		$(this).closest('.defaultNomenWrapper').remove();
		if($(".defaultNomenTable").length===0){
			$('#defaultNomenNew').attr('disabled', false);
		}
	});
	
	$(document).on('click', '.defaultNomenAdd', function(){
		var del = "<button class='defaultNomenDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var button = "<img class='defaultNomenUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='defaultNomenDown' src='"+staticContentLocation +"/img/6364_down.png'/>";
		var index = $('.defaultNomenAdd').index( $(this));
		var dropdown = nomenDefaultList[index/2];
		$(this).closest('table').find('.defaultNomenTable').append("<tr><td>"+button+"</td><td>"+dropdown+"</td><td>"+del+"</td></tr>");
	});
	
	$(document).on('click', '.defaultNomenUp', function(){
		var row = $(this).closest('tr');
		row.insertBefore(row.prev());
	});
	
	$(document).on('click', '.defaultNomenDown', function(){
		var row = $(this).closest('tr');
		row.insertAfter(row.next());
	});
	
	//render html of the page
	function render () {
		$('body').load(staticContentLocation+"/html/main.html");
		$('#modalDiv').load(staticContentLocation+"/html/modal-template.html");
		var addImageUrl=staticContentLocation+"/img/3941_16.png";
		var rightImageUrl = staticContentLocation+"/img/6364_right.png";
		var leftImageUrl = staticContentLocation+"/img/6364_left.png";
		var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
		//setup add icon
		$('#sRiskNew').find('img').attr('src', addImageUrl);
		$('#defaultIntervalNew').find('img').attr('src', addImageUrl);
		$('#intervalNew').find('img').attr('src', addImageUrl);
		$('#newNomenButton').find('img').attr('src', addImageUrl);
		$('#defaultNomenNew').find('img').attr('src', addImageUrl);
		$('#newEventButton').find('img').attr('src', addImageUrl);
		//setup loctype icon
		$('#locTypeAddButton').attr('src', rightImageUrl);
		$('#locTypeRemoveButton').attr('src', leftImageUrl);
		//setup clinical event icon
		$('.statusNomenDelete').find('img').attr('src', deleteImageUrl);

		//setup label
		//General Clinical Event
		$('.label_EVENT_CD_DISPLAY').attr('title', 'value taken from:  V500_EVENT_CODE.EVENT_CD_DISP');
		$('.label_CONCEPT_CKI_72').attr('title', 'value taken from:  CODE_VALUE.CONCEPT_CKI (CODE_SET = 72)');
		$('.label_EVENT_SET_NAME').attr('title', 'value taken from:  V500_EVENT_SET_CODE.EVENT_SET_NAME');
		$('.label_CONCEPT_CKI_93').attr('title', 'value taken from:  CODE_VALUE.CONCEPT_CKI (CODE_SET = 93)');
		//General Code Value
		$('.label_DESCRIPTION').attr('title', 'value taken from:  CODE_VALUE.DESCRIPTION');
		$('.label_DISPLAY_KEY').attr('title', 'value taken from:  CODE_VALUE.DISLAY_KEY');
		$('.label_DISPLAY').attr('title', 'value taken from:  CODE_VALUE.DISLAY');
		$('.label_CDF_MEANING').attr('title', 'value taken from:  CODE_VALUE.CDF_MEANING');
		//General Orderable
		$('.label_order_Cki').attr('title', 'value taken from:  ORDER_CATALOG.CKI');
		$('.label_order_ccki').attr('title', 'value taken from:  ORDER_CATALOG.CONCEPT_CKI');
		$('.label_order_PRIMARY_MNEMONIC').attr('title', 'value taken from:  ORDER_CATALOG.PRIMARY_MNEMONIC');
		//Xtra
		$('.label_xtra_meaning').attr('title', 'value taken from: ORDER_DETAIL:OE_FIELD_MEANING');
		$('.label_xtra_id').attr('title', 'value taken from: ORDER_DETAIL:OE_FIELD_ID');
		//CODE_VALUE
		$('.label_DISPLAY_4').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 4)');
		$('.label_DISPLAY_319').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 319)');
		$('.label_DISPLAY_93').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 93)');
		$('.label_DISPLAY_72').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 72)');	
		$('.label_DISPLAY_200').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 200)');			
		populateInstructions();

		//initialize code search components
		var codeSearch4 = new CodeSearch({
			"element": $(".typeahead4")
			,"codeSet": 4
		});
		var codeSearch319 = new CodeSearch({
			"element": $(".typeahead319")
			,"codeSet": 319
		});
		var codeSearch93 = new CodeSearch({
			"element": $(".typeahead93")
			,"codeSet": 93
			,"prim_ind" : 1
		});
		var codeSearch72 = new CodeSearch({
			"element": $(".typeahead72")
			,"codeSet": 72
		});
		var codeSearch200 = new CodeSearch({
			"element": $(".typeahead200")
			,"codeSet": 200
		});
	}
	
	//render instruction sections
	function populateInstructions(){
		$('#pageText').append("This is the setup page for the Behavioral Health MPage.  For the sections requiring input database fields, hover over the label beside the input box to find more information.  When finished, select the UPDATE button at the bottom of the page.  This will update the cust_cond_summary_data table, and the changes will be reflected on the Behavioral Health MPage.  Refresh the page to make further changes if needed.");
		$('#titleText').append("Enter the name you want to be displayed for the title of the Behavioral Health MPage.  If no text is entered, Safety and Attendance MPage will display.");
       	$('#sendRequestBatchText').append("Specify number of clinical events which will save in batches.");
		$('#loadRequestBatchText').append("Specify number of patients that will be added to the batch to retrieve the patient’s clinical events");
		$('#RetrieveDefaultTimeText').append("Assign a default value for the time interval to be displayed in the Safety and Attendance page whenever the Safety and Attendance page is being refreshed, reloaded or patient list is changed. Default time can be entered in numeric values only and no special characters");
		$('#ptpopText').append("Define the method(s) for the user to choose the patient population used to generate this MPage. The subset of patients in the defined population that meet the qualifying criteria for this MPage will display on the MPage. It is recommended that both Patient List functionality and Facility/Nurse Unit selections are used to provide the user with additional flexibility when selecting a patient population.");
		$('#wtsText').append("Indicate whether you would like to utilize WTS to default the Facility and Nurse Unit selections for the user.");
		$('#defaultPopText').append("Indicate the default patient poplation to display for this MPage.");
		$('#locTypeText').append("Select the locations types that mean nurse unit.");
		$('#linkText').append("The patient's name is a hyperlink which will open a specific tab in the patient chart.  Enter the display name of the tab within PowerChart that you want to be available as a hyperlink from the patient's name in the Patient column.");
		$('#imageText').append("This setting determines if the patients' images will attempt to be loaded from the CAMM system.");
		$('#mrnText').append("Select a code_value that indicates MRN.");
		$('#finText').append("Select a code_value that indicates FIN.");
		$('#navText').append("This setting determines if the user wants to utilize the tab navigation functionality.");
		$('#fallText').append("Select a clinical event that indicates Fall Risk.  If no event is selected the MPage will use the Fall Risk Scale Morse event.  The qualifier for the response is defined in the next section.  Note: Only one of the below identifiers needs to be filled out for the event.");
		$('#fallQuaText').append("The default qualifier to determine if the patient is at risk for a fall is a Morse Fall Risk Score of 45 or greater. This row provides the ability to define the desired value or response.");
		$('#suicideText').append("Select a clinical event that indicates Suicide Risk.  If no event is selected the MPage will use Suicidal Ideation.  The responses and icons are defined in the next section.  Note: Only one of the below identifiers needs to be filled out for the event.");
		$('#suicideIconText').append("There is a row below for each possible response that corresponds with the clinical event defined in Suicide Risk Level Event.  The possible responses display below.  Select an icon for each given response as desired. Select from: Critical Risk Icon (red triangle with exclamation mark in the middle), Medium Risk Icon (yellow triangle with exclamation mark in the middle), and No Icon (no icon displays). Use the up and down arrows to sequence the risk responses.  Sequence the risk responses according to priority based on suicide risk.  For example, the highest suicide risk response should be displayed at the top.");
		$('#obsText').append("Select a clinical event that indicates Observation Level.  Note: Only one of the below identifiers needs to be filled out for the event.");
		$('#statusText').append("Select clinical event(s) for Patient Status/Activity.  Select one event for both coded alpha responses and free text alpha responses. Label will be displayed as the tab text in MPage Dialog. NOTE: This event cd will be used in the \"Available Nomenclature Responses by Location\" and \"Available Nomenclature Responses for Other/Undefined Locations\" section. After changing the value please update before configuring those sections.");
		$('#offText').append("Select a clinical event that indicates Off Unit. Note: Only one of the below identifiers needs to be filled out for the event.");
		$('#obsOrderText').append("Select an orderable that indicates Observation Level. Note: Only one of the below identifiers needs to be filled out for the orderable.");
		$('#obsQuaText').append("Select an order detail from the order detail table that corresponds to the observation level orderable defined above.  The order detail will display as the text for Level of Observation.  Note: Only one of the below identifiers needs to be filled out for the order detail.");
		$('#defaultIntervalText').append("Define the default time interval options (in minutes) for all nurse units that will display in the drop down in the top right hand corner of the page.  The MPage will convert minutes to hours if the number entered is greater than 59 minutes.   The shortest time interval will default as the time interval for any nurse unit that is not specifically defined in the next section.");
		$('#intervalText').append("Assign a default time interval (in minutes) for each nurse unit. The MPage will convert minutes to hours if the number entered is greater than 59 minutes.");
		$('#nomenText').append("Each nurse unit can be assigned specific responses based on what activities are available in that unit. On the MPage, when the user selects Chart the Activity, the responses defined below will display.  Select from the list on the left and use the arrows between the list to add or remove responses to the list on the right. Use the up and down arrows to sequence the responses in the selected list.");
		$('#defaultNomenText').append("Select the set of responses that should display in the other or undefined locations.  Use the up and down arrows to sequence the responses.");
	}
	
	//load returned data to the page
	function loadData(){
		var mrnId = "0", mrnSet="0", finId="0", fRiskId="0", fRiskSet="0", sRiskId="0", sRiskSet="0", obsId="0", obsSet="0", ptActivityNomenId=[], orderable="0", offId = "0", offSet = "0";
		var sRiskResp = [], timeInterval = [], nomen = [], defaultNomen = [], defaultTime = [], locType=[];
		
		var list = AjaxHandler.parse_json(preLoadedLocationCodes);
		var AliasCodeList = list.CUST_REC;
		$.each(AliasCodeList.DATA, function(i, v) {
	    if (v.SECTION_NAME === "TITLE") {
	        $('#titleInput').val(v.LONG_DESC);
	    }
        if (v.SECTION_NAME === "RETRIEVE_ACT_BATCHSIZE") {
		
	        $('#loadRequestBatchInput').val(v.LONG_DESC);
			
	    }
        if (v.SECTION_NAME === "POST_ACT_BATCHSIZE") {
	        $('#sendRequestBatchInput').val(v.LONG_DESC);
	    }
		
		if (v.SECTION_NAME === "RETRIEVE_DEFAULT_TIME_INTERVAL") {
	        $('#RetrieveDefaultTime').val(v.LONG_DESC);
	    }
		
	    else if(v.SECTION_NAME === "PTPOP") {
	        if(v.ALT_NOT_FOUND_NAME==="1"){
	         	$('#ptpopRadioList').prop('checked', true); 
				$('#wtsDiv').slideDown("slow");
				$('#defaultPopDiv').slideDown("slow");
				$('#locTypeDiv').slideUp("slow");
				$('#defaultPopRadio1').prop("disabled", false);
				$('#defaultPopRadio2').prop("disabled", true);
				$('#defaultPopRadio2').prop("checked", false);
	        }
	        else if(v.ALT_NOT_FOUND_NAME==="2"){
	         	$('#ptpopRadioUnit').prop('checked', true); 
				$('#wtsDiv').slideDown("slow");
				$('#defaultPopDiv').slideDown("slow");
				$('#locTypeDiv').slideDown("slow");
				$('#defaultPopRadio1').prop("disabled", true);
				$('#defaultPopRadio2').prop("disabled", false);
				$('#defaultPopRadio1').prop("checked", false);
	        }
	        else if(v.ALT_NOT_FOUND_NAME==="3"){
	        	$('#ptpopRadioAll').prop('checked', true);
	        }
	    }
	    else if(v.DISP_NAME==="LOCTYPE"){
	    	locType.push(v.PARENT_ENTITY_ID);
	    }
	    else if(v.SECTION_NAME === "WTS") {
	        if(v.ALT_NOT_FOUND_NAME==="0"){
	        	$('#wtsRadioN').prop('checked', true);
	        	$('defaultPopRadio2').prop('disabled', true);
	        }
	        else if(v.ALT_NOT_FOUND_NAME==="1"){
	         	$('#wtsRadioY').prop('checked', true); 
	        	$('defaultPopRadio2').prop('disabled', false);
	        }
	    }
	    else if(v.SECTION_NAME==="DEFAULTPOP"){
	        if(v.ALT_NOT_FOUND_NAME==="1")
	        	$('#defaultPopRadio1').prop('checked', true);
	        else if(v.ALT_NOT_FOUND_NAME==="2")
	         	$('#defaultPopRadio2').prop('checked', true); 
	        else if(v.ALT_NOT_FOUND_NAME==="3")
	         	$('#defaultPopRadio3').prop('checked', true); 
	    }
	    else if (v.SECTION_NAME === "PCTABNM") {
	        $('#linkInput').val(v.DISP_NAME);
	    }
	    else if (v.SECTION_NAME === "IMAGE") {
	        if(v.ALT_NOT_FOUND_NAME==="0")
	        	$('#imageRadioN').prop('checked', true);
	        else if(v.ALT_NOT_FOUND_NAME==="1")
	         	$('#imageRadioY').prop('checked', true);     
	    }
	    else if(v.DISP_NAME==="MRN"){
	    	if(v.SECTION_NAME==="4"){
	    		$('#mrnRadioPerson').attr("checked", true);
	       		$('#mrnInputPerson').attr("code_value", v.PARENT_ENTITY_ID);
	       		$('#mrnInputPerson').attr("title", v.PARENT_ENTITY_ID);
	       		$('#mrnInputPerson').attr("disabled", false);
	       		$('#mrnInputEncntr').attr("disabled", true);
	    	}
	    	else if(v.SECTION_NAME==="319"){
	    		$('#mrnRadioEncntr').attr("checked", true);
	       		$('#mrnInputEncntr').attr("code_value", v.PARENT_ENTITY_ID);
	       		$('#mrnInputEncntr').attr("title", v.PARENT_ENTITY_ID);
	       		$('#mrnInputEncntr').attr("disabled", false);	       		
	       		$('#mrnInputPerson').attr("disabled", true);
	    	}
    		mrnId=v.PARENT_ENTITY_ID;
       		mrnSet=v.SECTION_NAME;
	    }
	    else if(v.DISP_NAME==="FIN"){
       		$('#finInput').attr("code_value", v.PARENT_ENTITY_ID);
       		$('#finInput').attr("title", v.PARENT_ENTITY_ID);
	        finId = v.PARENT_ENTITY_ID;
	    }
	    else if (v.SECTION_NAME === "NAV") {
	        if(v.ALT_NOT_FOUND_NAME==="0")
	        	$('#navRadioN').prop('checked', true);
	        else if(v.ALT_NOT_FOUND_NAME==="1")
	         	$('#navRadioY').prop('checked', true);     
	    }
	    else if(v.SECTION_NAME==="RISK"&&v.DISP_NAME==="FALLRISK"){
	    	fRiskId=v.PARENT_ENTITY_ID;
	    	if(v.COND_FLAG===93){
	    		$('#fallRadioSet').attr("checked", true);
	       		fRiskSet=93;
	       		$('#fallInputSet').attr("disabled", false);
	       		$('#fallInputCode').attr("disabled", true);	    		
	    	}
	    	else if(v.COND_FLAG===72){
	    		$('#fallRadioCode').attr("checked", true);
	       		fRiskSet=72;
	       		$('#fallInputCode').attr("disabled", false);
	       		$('#fallInputSet').attr("disabled", true);	
	    	}
	    }
	    else if(v.SECTION_NAME==="RISK" && v.LONG_DESC==="FALLRISK"){
	    	$('#fallSignDrop').val(v.COND_FLAG.toString());
	    	$('#fallTypeDrop').val(v.ALT_FOUND_NAME);
	    	$('#fallScoreInput').val(v.ALT_NOT_FOUND_NAME);
	    }
	    else if(v.SECTION_NAME==="RISK"&&v.DISP_NAME==="SUICIDERISK"){
	    	sRiskId=v.PARENT_ENTITY_ID;
	    	if(v.COND_FLAG===93){
	    		$('#suicideRadioSet').attr("checked", true);
	       		sRiskSet=93;
	       		$('#suicideInputSet').attr("disabled", false);
	       		$('#suicideInputCode').attr("disabled", true);	    		
	    	}
	    	else if(v.COND_FLAG===72){
	    		$('#suicideRadioCode').attr("checked", true);
	       		sRiskSet=72;
	       		$('#suicideInputCode').attr("disabled", false);
	       		$('#suicideInputSet').attr("disabled", true);	
	    	}
	    }
	    else if(v.SECTION_NAME==="SUICIDERISK"){
	    	sRiskResp.push(new Array(v.COND_FLAG, v.LONG_DESC, v.ALT_FOUND_NAME));
	    }
	    else if(v.SECTION_NAME==="RISK"&&v.DISP_NAME==="OBSERVLEVEL"&&v.DATA_TYPE!="ORD"){
	    	obsId=v.PARENT_ENTITY_ID;
	    	if(v.COND_FLAG===93){
	    		$('#obsRadioSet').attr("checked", true);
	       		obsSet=93;
	       		$('#obsInputSet').attr("disabled", false);
	       		$('#obsInputCode').attr("disabled", true);	    		
	    	}
	    	else if(v.COND_FLAG===72){
	    		$('#obsRadioCode').attr("checked", true);
	       		obsSet=72;
	       		$('#obsInputCode').attr("disabled", false);
	       		$('#obsInputSet').attr("disabled", true);	
	    	}
	    }
	    else if(v.SECTION_NAME==="OBSERVATION"&&v.DISP_NAME==="NOMENCD"){
	    	ptActivityNomenId.push([v.PARENT_ENTITY_ID, v.COND_FLAG]);
	    	ceLabel.push([v.PARENT_ENTITY_ID, v.ALT_NOT_FOUND_NAME]);
	    }
	    else if(v.SECTION_NAME==="RISK"&&v.DISP_NAME==="OBSERVLEVEL"&&v.DATA_TYPE==="ORD"){
	    	orderable = v.PARENT_ENTITY_ID;
	    	$('#obsOrderInput').attr("title", v.PARENT_ENTITY_ID);
	    	$('#obsOrderInput').attr("code_value", v.PARENT_ENTITY_ID);
	    }
	    else if(v.SECTION_NAME==="ORDER_DETAIL"){
	    	$('#obsQua').val(v.LONG_DESC.toString());
	    }
	    else if(v.SECTION_NAME==="ORDER_DETAIL_ID"){
	    	$('#obsQua2').val(v.LONG_DESC.toString());
	    }
	    else if(v.DISP_NAME==="LOCTIME"){
			timeInterval.push(v.PARENT_ENTITY_ID);
	 	}
	    else if(v.SECTION_NAME==="DEFAULTTIME"){
	    	defaultTime.push(new Array(v.COND_FLAG, v.LONG_DESC));
	    }
	    else if(v.DISP_NAME==="NOMEN" && v.ALT_FOUND_NAME!="DEFAULT"){
	 		nomen.push(v.PARENT_ENTITY_ID);
	 	}
	    else if(v.SECTION_NAME==="NOMEN" && v.ALT_FOUND_NAME==="DEFAULT"){
	 		defaultNomen.push([v.ALT_NOT_FOUND_NAME, v.LONG_DESC]);
		}
	    else if(v.SECTION_NAME==="OFFUNIT"&&v.DISP_NAME==="OFFUNIT"){
	    	offId=v.PARENT_ENTITY_ID;
	    	if(v.COND_FLAG===93){
	    		$('#offRadioSet').attr("checked", true);
	       		offSet=93;
	       		$('#offInputSet').attr("disabled", false);
	       		$('#offInputCode').attr("disabled", true);	    		
	    	}
	    	else if(v.COND_FLAG===72){
	    		$('#offRadioCode').attr("checked", true);
	       		offSet=72;
	       		$('#offInputCode').attr("disabled", false);
	       		$('#offInputSet').attr("disabled", true);	
	    	}
	    }
	    else if(v.SECTION_NAME==="FALLLABEL"){
	    	$('.fallLabel').val(v.LONG_DESC);
	    }
	    else if(v.SECTION_NAME==="SUICIDELABEL"){
			$('.suicideLabel').val(v.LONG_DESC);
	    }
	    return;
		});
		
		$('#obsQuaList :input:text').attr('disabled', 'disabled');
		if($('#obsQua2').val()===""&&$('#obsQua').val()!==""){
			$('#obsQua').removeAttr('disabled');
			$('#obsQuaRadioMeaning').prop('checked', true);
		}
		else{
			$('#obsQua2').removeAttr('disabled');
			$('#obsQuaRadioId').prop('checked', true);		
		}
			
		sRiskResp.sort(function(a,b){
	    return a[0] - b[0];
		});
		
		defaultTime.sort(function(a, b){
			return a[0]-b[0];
		});

		loadDefaultInterval(defaultTime);
		loadSRiskResponse(sRiskResp);
		defaultNom=defaultNomen;
		locTypeSelected=locType;
		requestNu();
		requestData(mrnId, mrnSet, finId, fRiskId, fRiskSet, sRiskId, sRiskSet, obsId, obsSet, ptActivityNomenId, orderable, timeInterval, _.uniq(nomen), offId, offSet);
	}
	
	/*
	 * Ajax Request
	 */
	// get data by passing out code_value returned from cust_cond_summary_data table
	function requestData(mrnId, mrnSet, finId, fRiskId, fRiskSet, sRiskId, sRiskSet, obsId, obsSet, ptActivityNomenId, orderable, timeInterval, nomen, offId, offSet){
			var	REQ = {
					MRNID: JSON.setCCLFloatNumber(parseFloat(mrnId)),
					MRNSET: JSON.setCCLFloatNumber(parseInt(mrnSet)),
					FINID: JSON.setCCLFloatNumber(parseFloat(finId)),
					FRISKID : JSON.setCCLFloatNumber(parseFloat(fRiskId)),
					FRISKSET: JSON.setCCLFloatNumber(parseInt(fRiskSet)),
					SRISKID: JSON.setCCLFloatNumber(parseFloat(sRiskId)),
					SRISKSET: JSON.setCCLFloatNumber(parseInt(sRiskSet)),
					OBSID : JSON.setCCLFloatNumber(parseFloat(obsId)),
					OBSSET: JSON.setCCLFloatNumber(parseInt(obsSet)),
					PTACTIVITYNOMENID: [],
					CATALOG_CD: JSON.setCCLFloatNumber(parseFloat(orderable)),
					INTERVAL: [],
					NOMEN: [],
					OFFID : JSON.setCCLFloatNumber(parseFloat(offId)),
					OFFSET : JSON.setCCLFloatNumber(parseInt(offSet))
				};
			for(var i=0; i<timeInterval.length; i++){
				REQ.INTERVAL[i]={
					CODE_VALUE: JSON.setCCLFloatNumber(parseFloat(timeInterval[i]))
				}
			}
			for(var i=0; i<nomen.length; i++){
				REQ.NOMEN[i]={
					CODE_VALUE: JSON.setCCLFloatNumber(parseFloat(nomen[i]))
				}
			}
			
			for(var i=0; i<ptActivityNomenId.length; i++){
				REQ.PTACTIVITYNOMENID[i]={
						CODE_VALUE: JSON.setCCLFloatNumber(parseFloat(ptActivityNomenId[i][0])),
						CODE_SET: JSON.setCCLFloatNumber(parseInt(ptActivityNomenId[i][1]))
					}
			}
	
			var mpreq = JSON.stringify(REQ);
					
			var path = "dc_mp_bhv_hlth_setup_get_data", params = "^MINE^," + "^{\"MPREQ\":" + mpreq + "}^";
			json_handler.ajax_request({
				request : {
					type : "XMLCCLREQUEST",
					target : path,
					parameters : params
				},
	
				response : {
					type : "JSON",
					target : receiveReply,
					parameters : ["t", 1]
				}
			});
	}
	
	//get nurse unit
	function requestNu(){
		var path = "dc_mp_bhv_hlth_setup_get_nu", params = "^MINE^";
		json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params
			},
			response : {
				type : "JSON",
				target : receiveReply,
				parameters : ["t", 1]
			}
		});
	}
	
	//get nomen options
	function requestNomen(param){
			var	REQ = {
					PARAM:JSON.setCCLFloatNumber(parseFloat(param))
				};
	
			var mpreq = JSON.stringify(REQ);
					
			var path = "dc_mp_bhv_hlth_setup_get_nomen", params = "^MINE^," + "^{\"MPREQ\":" + mpreq + "}^";
			json_handler.ajax_request({
				request : {
					type : "XMLCCLREQUEST",
					target : path,
					parameters : params
				},
				response : {
					type : "JSON",
					target : receiveReply,
					parameters : ["t", 1]
				}
			});
	}
	
	//request to update the cust_cond_summary_data table
	function requstUpdate(){
		var mpreq = getUpdateReuqest();
		var path = "dc_mp_bhv_hlth_setup_post_data", params = "^MINE^", blobIn="{\"CSV\":" + mpreq + "}";
		$('#updateButton').html("UPDATING......");
		json_handler.ajax_request({
			request : {
				type : "XMLCCLREQUEST",
				target : path,
				parameters : params,
				blobIn : blobIn
			},
			response : {
				type : "JSON",
				target : receiveReply,
				parameters : ["t", 1]
			}
		});
	}
	
	//request nurse unit in facility
	function requestUnit(code_value, element){
		var AliasCodeList = AjaxHandler.parse_json(locationCodesToAssign);
		var NeedAssignmentList = AliasCodeList.TABLE_LOCATION_CODES;
		var options = "";
		var dropdown = element.siblings('select[name=\'unit\']');
		_.find(NeedAssignmentList.LOCATION, function(location){
			if(location.CODE_VALUE==code_value){
				$.each(location.UNIT, function(i, e){
					if(i===0){
						options+="<optgroup label='"+e.LOCATIONCDFMEANING+"'>";
					}
					else if(e.LOCATIONCDFMEANING!=location.UNIT[i-1].LOCATIONCDFMEANING){
						options+="<optgroup label='"+e.LOCATIONCDFMEANING+"'>";
					}
					options+=("<option value='"+e.LOCATIONCD+"' title='"+e.LOCATIONDISP+"'>"+e.LOCATIONDISP+"</option>");
				});
			}
		})
		dropdown.append(options);
	}
	
	//get Update Request JSON object
	function getUpdateReuqest(){
		var projectCnt = 2;
		var xtraCnt = 6;
		var hypCnt = 7;
		var ceCnt = 9;
		var codeCnt = 9;
		var ordCnt = 9;
		
		var csv = {
			rowCnt : 0,
			row : []
		};
		//project name
		csv.row[csv.rowCnt] = {
			fieldCnt: projectCnt,
			field: [{"value": "PROJECT"}
			,{"value":"BHSAFETY"}]
		};
		csv.rowCnt++;
		//Page Title
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"TITLE"}
			,{"value": $('#titleInput').val()}
			,{"value": ""}
			,{"value": ""}]
		};
		csv.rowCnt++;
// send batch size
	csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"POST_ACT_BATCHSIZE"}
			,{"value": $('#sendRequestBatchInput').val()}
			,{"value": ""}
			,{"value": "100"}
			]
		};
		csv.rowCnt++;	
// load batch size
csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"RETRIEVE_ACT_BATCHSIZE"}
			,{"value": $('#loadRequestBatchInput').val()}
			,{"value": ""}
			,{"value": ""}]
		};
		csv.rowCnt++;	
		
	//default time interval
	csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"RETRIEVE_DEFAULT_TIME_INTERVAL"}
			,{"value": $('#RetrieveDefaultTime').val()}
			,{"value": ""}
			,{"value": ""}]
		};
		csv.rowCnt++;
		
		//Patient Population
		var ptpopInd = "3";
		if($("#ptpopRadioList").attr("checked")==="checked")
			ptpopInd = "1";
		else if($("#ptpopRadioUnit").attr("checked")==="checked")
			ptpopInd = "2";
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"PTPOP"}
			,{"value": "PTPOP"}
			,{"value": "NUMERIC"}
			,{"value": ptpopInd}]
		};
		csv.rowCnt++;
		
		var option = $('.ptpopRadio:checked').attr("value");
		
		//Patient List Option
		if(option==="1"){
			//WTS Location
			var wtsInd = "1";
			if($("#wtsRadioN").attr("checked")==="checked")
				wtsInd = "0";
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value":"1"}
				,{"value":"WTS"}
				,{"value": "WTSLOCATION"}
				,{"value": "NUMERIC"}
				,{"value": wtsInd}]
			};
			csv.rowCnt++;
			//Default Population
			var defaultPopInd = "3";
			if($("#defaultPopRadio1").attr("checked")==="checked")
				defaultPopInd = "1";
			else if($("#defaultPopRadio2").attr("checked")==="checked")
				defaultPopInd = "2";
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value":"1"}
				,{"value":"DEFAULTPOP"}
				,{"value": "DEFAULTPOP"}
				,{"value": "NUMERIC"}
				,{"value": defaultPopInd}]
			};
			csv.rowCnt++;
		}
		//Facility Nurse Unit Option
		else if(option==="2"||option==="3"){
			//WTS Location
			var wtsInd = "1";
			if($("#wtsRadioN").attr("checked")==="checked")
				wtsInd = "0";
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value":"1"}
				,{"value":"WTS"}
				,{"value": "WTSLOCATION"}
				,{"value": "NUMERIC"}
				,{"value": wtsInd}]
			};
			csv.rowCnt++;
			//Default Population
			var defaultPopInd = "3";
			if($("#defaultPopRadio1").attr("checked")==="checked")
				defaultPopInd = "1";
			else if($("#defaultPopRadio2").attr("checked")==="checked")
				defaultPopInd = "2";
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value":"1"}
				,{"value":"DEFAULTPOP"}
				,{"value": "DEFAULTPOP"}
				,{"value": "NUMERIC"}
				,{"value": defaultPopInd}]
			};
			csv.rowCnt++;
			//Location Type Selection
			$('#locTypeDiv').find('select[name=\'locTypeSelectedlList\'] option').each(function(m, n){
				csv.row[csv.rowCnt] = {
				fieldCnt: codeCnt,
				field:[{"value": "CODE"}
				,{"value": "LOCTYPE"}
				,{"value": "CODE_VALUE"}
				,{"value": "222"}
				,{"value": $(n).attr("value")+".0"}
				,{"value": (m+1).toString()}
				,{"value": ""}
				,{"value": $(n).text()}
				,{"value": $(n).attr("value")+".0"}
				]
			}
			csv.rowCnt++;
			});
		}

		//Patient Link
		csv.row[csv.rowCnt] = {
			fieldCnt: hypCnt,
			field: [{"value": "HYP"}
			,{"value":"7"}
			,{"value":"PCTABNM"}
			,{"value": "11"}
			,{"value": $('#linkInput').val()}
			,{"value": "UU"}
			,{"value": "YY"}]
		};
		csv.rowCnt++;
		//Patient Image
		var imageInd = "0";
		if($("#imageRadioY").attr("checked")==="checked")
			imageInd = "1";
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"IMAGE"}
			,{"value": "SHOWPATIENT"}
			,{"value": "NUMERIC"}
			,{"value": imageInd}]
		};
		csv.rowCnt++;
		
		//MRN
		csv.row[csv.rowCnt] = {
				fieldCnt: codeCnt,
				field:[{"value": "CODE"}
				,{"value": "MRN"}
				,{"value": "CODE_VALUE"}
				,{"value": $("#mrnList :input:radio:checked").attr("value")}
				,{"value": $("#mrnList :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
				,{"value": "1"}
				,{"value": ""}
				,{"value": "MRN"}
				,{"value": $("#mrnList :input:radio:checked").attr("value")}
				]
			}
			csv.rowCnt++;
		//FIN
		csv.row[csv.rowCnt] = {
				fieldCnt: codeCnt,
				field:[{"value": "CODE"}
				,{"value": "FIN"}
				,{"value": "CODE_VALUE"}
				,{"value": "319"}
				,{"value": $('#finInput').attr("code_value")+".0"}
				,{"value": "1"}
				,{"value": ""}
				,{"value": "FIN"}
				,{"value": $('#finInput').attr("code_value")+".0"}
				]
			}
			csv.rowCnt++;
		//Tab navigation
		var navInd = "0";
		if($("#navRadioY").attr("checked")==="checked")
			navInd = "1";
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"NAV"}
			,{"value": "TABNAVIGATION"}
			,{"value": "NUMERIC"}
			,{"value": navInd}]
		};
		csv.rowCnt++;
		//Fall Risk Label
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"FALLLABEL"}
			,{"value": $('.fallLabel').val()}
			,{"value": ""}
			,{"value": ""}]
		};
		csv.rowCnt++;
		//Fall Risk Event
		csv.row[csv.rowCnt] = {
			fieldCnt: ceCnt,
			field: [{"value": "CECD"+$("#fallList :input:radio:checked").attr("value")}
			,{"value": $("#fallList :input:radio:checked").attr("value")}
			,{"value":"RISK"}
			,{"value":$("#fallList :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
			,{"value": "1"}
			,{"value": "FALLRISK"}
			,{"value": "1"}
			,{"value": "XX"}
			,{"value": "Fall Risk Documented"}]
		};
		csv.rowCnt++;
		//Fall Risk Qualifier Response
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value": $("#fallSignDrop option:selected").attr("value")}
			,{"value": "RISK"}
			,{"value": "FALLRISK"}
			,{"value": $("#fallTypeDrop option:selected").attr("value")}
			,{"value": $("#fallScoreInput").attr("value")}]
		}
		csv.rowCnt++;
		//Suicide Risk Label
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"1"}
			,{"value":"SUICIDELABEL"}
			,{"value": $('.suicideLabel').val()}
			,{"value": ""}
			,{"value": ""}]
		};
		csv.rowCnt++;
		//Suicide Risk Level Event
		csv.row[csv.rowCnt] = {
				fieldCnt: ceCnt,
				field: [{"value": "CECD"+$("#suicideList :input:radio:checked").attr("value")}
				,{"value": $("#suicideList :input:radio:checked").attr("value")}
				,{"value":"RISK"}
				,{"value":$("#suicideList :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
				,{"value": "3"}
				,{"value": "SUICIDERISK"}
				,{"value": "1"}
				,{"value": "XX"}
				,{"value": "Suicide Risk Documented"}]
			};
		csv.rowCnt++;
		//Suicide Risk Response
		$('#suicideTable tr').each(function(i, v){
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value": (i+1).toString()}
				,{"value": "SUICIDERISK"}
				,{"value": $(v).find('input').attr("value")}
				,{"value": $(v).find('select').attr("value")}
				,{"value": "not documented"}
				]
			}
			csv.rowCnt++;
		});
		//Observation Level Event
		csv.row[csv.rowCnt] = {
			fieldCnt: ceCnt,
			field: [{"value": "CECD"+$("#obsList :input:radio:checked").attr("value")}
			,{"value": $("#obsList :input:radio:checked").attr("value")}
			,{"value": "RISK"}
			,{"value": $("#obsList :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
			,{"value": "2"}
			,{"value": "OBSERVLEVEL"}
			,{"value": "1"}
			,{"value": "XX"}
			,{"value": "Observation Level"}]
		};
		csv.rowCnt++;
		//Patient Status/Activity NOMENCLATURE
		$.each($('.eventListDiv'), function(i, v){
			csv.row[csv.rowCnt] = {
					fieldCnt: ceCnt,
					field: [{"value": "CECD"+$(v).find(".statusListNomenNew :input:radio:checked").attr("value")}
					,{"value": $(v).find(".statusListNomenNew :input:radio:checked").attr("value")}
					,{"value":"OBSERVATION"}
					,{"value":$(v).find(".statusListNomenNew :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
					,{"value": "4"}
					,{"value": "NOMENCD"}
					,{"value": "1"}
					,{"value": "XX"}
					,{"value": $(v).find('.statusLabelNew').val()}]
				};
				csv.rowCnt++;
		});

		//Observation Level Orderable
		csv.row[csv.rowCnt] = {
			fieldCnt: ordCnt,
			field: [{"value": "ORDCD"}
			,{"value":"1"}
			,{"value":"RISK"}
			,{"value":$("#obsOrderInput").attr("code_value")}
			,{"value": "1"}
			,{"value": "OBSERVLEVEL"}
			,{"value": "1"}
			,{"value": "XX"}
			,{"value": "Observation Level orderable"}]
		};
		csv.rowCnt++;

		//Off Unit Event
		csv.row[csv.rowCnt] = {
			fieldCnt: ceCnt,
			field: [{"value": "CECD"+$("#offList :input:radio:checked").attr("value")}
			,{"value": $("#offList :input:radio:checked").attr("value")}
			,{"value":"OFFUNIT"}
			,{"value":$("#offList :input:radio:checked").closest('tr').find("input:text").attr("code_value")+".0"}
			,{"value": "1"}
			,{"value": "OFFUNIT"}
			,{"value": "1"}
			,{"value": "XX"}
			,{"value": "Off Unit Event"}]
		};
		csv.rowCnt++;

		//Observation Level Order Detail qualifier
		csv.row[csv.rowCnt] = {
			fieldCnt: xtraCnt,
			field: [{"value": "XTRA"}
			,{"value":"0"}
			,{"value": $("#obsQuaList :input:radio:checked").attr("value")}
			,{"value": $("#obsQuaList :input:radio:checked").closest('tr').find("input:text").val()}
			,{"value": "order entry field"}
			,{"value": "Observation Level order detail"}]
		};
		csv.rowCnt++;
		//Default Time Interval
		$('#defaultIntervalTable tr').each(function(i, v){
			csv.row[csv.rowCnt] = {
			fieldCnt: codeCnt,
			field:[{"value": "XTRA"}
			,{"value": (i+1).toString()}
			,{"value": "DEFAULTTIME"}
			,{"value": $(v).find('input').attr("value")}
			,{"value": "default time interval"}
			,{"value": "Default Time Interval Documented "}
			]
		}
		csv.rowCnt++;
		});
		
		$('#intervalTable tr').each(function(i, v){
			csv.row[csv.rowCnt] = {
			fieldCnt: codeCnt,
			field:[{"value": "CODE"}
			,{"value": "LOCTIME"}
			,{"value": "CODE_VALUE"}
			,{"value": "220"}
			,{"value": $(v).find('select[name=\'unit\']').attr("value")+".0"}
			,{"value": (i+1).toString()}
			,{"value": ""}
			,{"value": $(v).find('select[name=\'unit\']').attr("value")+".0"}
			,{"value": $(v).find('input').attr("value")}
			]
		}
		csv.rowCnt++;
		});
		//Location Available Nomen Responses Section
		$('#nomenDiv div').each(function(i, v){
			$(v).find('select[name=\'selectedNomen\'] option').each(function(m, n){
				csv.row[csv.rowCnt] = {
				fieldCnt: codeCnt,
				field:[{"value": "CODE"}
				,{"value": "NOMEN"}
				,{"value": "CODE_VALUE"}
				,{"value": "220"}
				,{"value": $(v).find('select[name=\'unit\']').attr("value").replace(/\s$/,"")+".0"}
				,{"value": (m+1).toString()}
				,{"value": $(n).attr("code_value")+".0"}
				,{"value": $(n).text()}
				,{"value": $(n).attr("value").replace(/\s$/,"")+".0"}
				]
			}
			csv.rowCnt++;
			});
		});
	
		//Default Nomenclatures available for other locations/undefined locations
		$('.defaultNomenTable tr').each(function(i, v){
			csv.row[csv.rowCnt] = {
				fieldCnt: xtraCnt,
				field: [{"value": "XTRA"}
				,{"value": (i+1).toString()}
				,{"value": "NOMEN"}
				,{"value": $(v).find('select option:selected').attr("code_value")}
				,{"value": "DEFAULT"}
				,{"value": $(v).find('select').attr("value")}
				]
			}
			csv.rowCnt++;
		});
		
		return JSON.stringify(csv);
	}
	
	//render default time interval section
	function loadDefaultInterval(list){
		$.each(list, function(i, e){
			var html="<tr><td><select class='itemDrop' disabled='disabled'><option>ALL</option></select></td>"
			+"<td><input class='itemInputShort' type='text' value="+e[1]+"></input></td>"
			+"<td><button class='defaultIntervalDel' type='button'><img src='"+staticContentLocation +"/img/4984_16.png'/></button></td></tr>";
			$('#defaultIntervalTable').append(html);
		});
	}
	
	//render default nomen section
	function loadDefaultNomen(list, ce_id){
		list = _.filter(list, function(e){
			return e[1]===ce_id.toString();
		});
		
		var del = "<button class='defaultNomenDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var remove = "<button class='defaultNomenRemove'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>";
		var button = "<img class='defaultNomenUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='defaultNomenDown' src='"+staticContentLocation +"/img/6364_down.png'/>"
		var add = "<img src='"+	staticContentLocation+"/img/3941_16.png"+"' class='defaultNomenAdd'/>";
		var table = "<table class='defaultNomenWrapper'><tr>	<th></th><th>Display</th><th><button type='button' class='defaultNomenAdd'>"+add+remove+"</button></th></tr><tbody class='defaultNomenTable'></tbody></table>";
		$('#defaultDiv').append(table);
		$.each(list, function(i, e){
					var row ="<tr><td>"+button+"</td><td>"+_.last(nomenDefaultList)+"</td><td>"+del+"</td></tr>";
					$('.defaultNomenTable').last().append(row);
					$('.defaultNomenTable select[name=\'nomenDefault\']').last().val(e[0]);
		})
		$('#defaultNomenNew').attr('disabled', true);
	}
	
	//load location drop down list
	function loadLocationList(){
		var AliasCodeList = AjaxHandler.parse_json(locationCodesToAssign);
		var NeedAssignmentList = AliasCodeList.TABLE_LOCATION_CODES;
		var html="";
		for(var i=0; i<NeedAssignmentList.LOCATION_CNT; i++){
			try{
				if(NeedAssignmentList.LOCATION[i].UNIT.length!==0){
					var disp = NeedAssignmentList.LOCATION[i].PARENT_ENTITY_ID_DISP;
					var dispkey=NeedAssignmentList.LOCATION[i].DISP_KEY;
					var dispname=NeedAssignmentList.LOCATION[i].DISP_NAME;
					var code_value = NeedAssignmentList.LOCATION[i].CODE_VALUE;
					if(i===0){
						html+="<optgroup label='"+dispname+"'>";
					}
					else if(NeedAssignmentList.LOCATION[i].DISP_NAME!=NeedAssignmentList.LOCATION[i-1].DISP_NAME){
						html+="<optgroup label='"+dispname+"'>";
					}
					html+="<option value='"+code_value+"' title='"+disp+"'>"+disp+"</option>"
				}
			}
			catch( err ){
			}
		}
		return html;
	}
	
	//render risk response section
	function loadSRiskResponse(sRiskResp){
		for(var i=0; i<sRiskResp.length; i++){
			var del = "<button class='sRiskDel'><img src='"+staticContentLocation +"/img/4984_16.png'/></button>"
			var input = "<input class='itemInputShort' type='text' value='"+sRiskResp[i][1]+"'></input>"
			var dropDown = "<select class='itemDrop' name='icon'><option value='0'>No Icon</option><option value='1'>Medium Risk Icon</option><option value='2'>Critical Risk Icon</option></select>"
			var button = "<img class='sRiskUp' src='"+staticContentLocation +"/img/6364_up.png'/><br /><img class='sRiskDown' src='"+staticContentLocation +"/img/6364_down.png'/>"
			$('#suicideTable').append("<tr><td>"+button+"</td><td>"+input+"</td><td>"+dropDown+"</td><td>"+del+"</td></tr>");
			$('#suicideTable select[name=\'icon\']').last().val(sRiskResp[i][2]);
		}
	}
	
	//ajax request reply handler
	function receiveReply(json_response) {
		//reply from requestData
		if(json_response.response.CVREPLY){
			var responseText = json_response.response.CVREPLY;
			//MRN
			$("#mrnList :input:radio:checked").closest('tr').find("input:text").val(responseText.MRN_DISPLAY);
			//FIN
			$('#finInput').val(responseText.FIN_DISPLAY);

			//fall risk event
			$("#fallList :input:radio:checked").closest('tr').find("input:text").val(responseText.FRISKEVT.EVENT_CD_DISPLAY);
			$("#fallList :input:radio:checked").closest('tr').find("input:text").attr("code_value", responseText.FRISKEVT.CODE_VALUE);
       		$("#fallList :input:radio:checked").closest('tr').find("input:text").attr("title", responseText.FRISKEVT.CODE_VALUE);
			
			//Suicide Risk Level Event
			$("#suicideList :input:radio:checked").closest('tr').find("input:text").val(responseText.SRISKEVT.EVENT_CD_DISPLAY);
			$("#suicideList :input:radio:checked").closest('tr').find("input:text").attr("code_value", responseText.SRISKEVT.CODE_VALUE);
       		$("#suicideList :input:radio:checked").closest('tr').find("input:text").attr("title", responseText.SRISKEVT.CODE_VALUE);
			
			//Observation Level Event
			$("#obsList :input:radio:checked").closest('tr').find("input:text").val(responseText.OBSEVT.EVENT_CD_DISPLAY);
			$("#obsList :input:radio:checked").closest('tr').find("input:text").attr("code_value", responseText.OBSEVT.CODE_VALUE);
       		$("#obsList :input:radio:checked").closest('tr').find("input:text").attr("title", responseText.OBSEVT.CODE_VALUE);

			//Off Unit Event
			$("#offList :input:radio:checked").closest('tr').find("input:text").val(responseText.OFFEVT.EVENT_CD_DISPLAY);
			$("#offList :input:radio:checked").closest('tr').find("input:text").attr("code_value", responseText.OFFEVT.CODE_VALUE);
       		$("#offList :input:radio:checked").closest('tr').find("input:text").attr("title", responseText.OFFEVT.CODE_VALUE);

			//Patient Status/Activity NOMENCLATURE
			var deleteImageUrl = staticContentLocation+"/img/4984_16.png";
			$.each(responseText.PTACTIVITYNOMEN, function(i, e){
				var ind=$('.statusListNomenNew').length;
					var url = staticContentLocation+"/html/clinical_event_selection_template.html";
					var html = $.get(url, function(data){
						$(data).appendTo('#eventDiv');
					});
					$('.statusNomenDeleteNew').last().find('img').attr('src', deleteImageUrl);
					$('.statusListNomenNew').last().find('input:radio').attr('name', 'statusNomenNew'+ind);
					_.each(ceLabel, function(ce){
						if(ce[0]===e.EVENT_CD){
							$('.statusLabelNew').last().val(ce[1]);
						}
					})
		    	if(e.CODE_SET===93){
		    		$('.statusRadioNomenSetNew').last().attr("checked", true);
		       		$('.statusInputNomenSetNew').last().attr("code_value", e.CODE_VALUE);
		       		$('.statusInputNomenSetNew').last().attr("title", e.CODE_VALUE);
		       		$('.statusInputNomenSetNew').last().attr("disabled", false);
		       		$('.statusInputNomenCodeNew').last().attr("disabled", true);	    		
		    	}
		    	else if(e.CODE_SET===72){
		    		$('.statusRadioNomenCodeNew').last().attr("checked", true);
		       		$('.statusInputNomenCodeNew').last().attr("code_value", e.CODE_VALUE);
		       		$('.statusInputNomenCodeNew').last().attr("title", e.CODE_VALUE);
		       		$('.statusInputNomenCodeNew').last().attr("disabled", false);
		       		$('.statusInputNomenSetNew').last().attr("disabled", true);	
		    	}
				$(".statusListNomenNew").last().find(":input:radio:checked").closest('tr').find("input:text").val(e.EVENT_CD_DISPLAY);
				var param = e.EVENT_CD;
				requestNomen(param);
			});	
			var codeSearch93 = new CodeSearch({
				"element": $(".typeahead93")
				,"codeSet": 93
				,"prim_ind" : 1
			});
			var codeSearch72 = new CodeSearch({
				"element": $(".typeahead72")
				,"codeSet": 72
			});
			$('.label_DISPLAY_93').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 93)');
			$('.label_DISPLAY_72').attr('title', 'value taken from CODE_VALUE:CODE_VALUE.DISPLAY(CODE_SET 72)');

			//Observation Level Orderable
			$('#obsOrderInput').val(responseText.OBSORDDISPLAY);
			
			//nomen location
			nomenResponse=responseText.NOMEN;
	
			var interval = _.uniq(_.collect(responseText.INTERVAL, function(interval){
				return JSON.stringify(interval);
			}));
			interval=$.parseJSON("["+interval+"]");
	
			//time interval
			for(var i=0; i<interval.length; i++){
				var html="<tr><td><select class='itemDrop' name='interval'>"+loadLocationList()+"</select></td>"
				+"<td><input class='itemInputShort' type='text' value="+interval[i].MIN+"></input></td>"
				+"<td><button class='intervalDel' type='button'><img src='"+staticContentLocation +"/img/4984_16.png'/></button></td></tr>"
				$('#intervalTable').append(html);
				$('#intervalTable select[name=\'interval\']').last().val(interval[i].FACILITY_CV);
				$('#intervalTable').find('select[name=\'interval\']').last().trigger('change');
				$('#intervalTable select[name=\'unit\']').last().val(interval[i].CODE_VALUE);
			}	
		}
		//reply from requestNomen
		else if(json_response.response.NOMENREPLY){
			var responseText = json_response.response.NOMENREPLY;
			var list = AjaxHandler.parse_json(preLoadedLocationCodes);
			var row=_.find(list.CUST_REC.DATA, function(row){
				return (row.PARENT_ENTITY_ID===responseText.CE_CODE_VALUE&&row.SECTION_NAME==="OBSERVATION");
			})
			var labelName="";
			if(responseText.LIST.length){
				labelName=row.ALT_NOT_FOUND_NAME;
			}
			else{
				labelName="No nomenclature found";
			}
			var html="<p code_value='"+responseText.CE_CODE_VALUE+"'>"+labelName+"</p><table border='0' cellpadding='4' cellspacing='0'><tr><td>"
			+"<select class='itemDrop' name='nomen' size='10' MULTIPLE>";
			var html2= "<p code_value='"+responseText.CE_CODE_VALUE+"'>"+labelName+"</p><select class='itemDrop' name='nomenDefault'>";
			for(var i=0; i<responseText.LIST.length; i++){
				html+="<option value='"+responseText.LIST[i].NOMENID+"' code_value='"+responseText.CE_CODE_VALUE+"'>"+responseText.LIST[i].DISPLAY+"</option>";
				html2+="<option value='"+responseText.LIST[i].NOMENID+"' code_value='"+responseText.CE_CODE_VALUE+"'>"+responseText.LIST[i].DISPLAY+"</option>";
			}
			html+="</select></td><td align='center' valign='middle'><img class='addButton' src='"+staticContentLocation +"/img/6364_right.png'></img><br><br><img class='removeButton' src='"+staticContentLocation +"/img/6364_left.png'></img></td><td><select name='selectedNomen' size='10'></select>";
			html+="</td><td align='center' valign='middle'><img class='upButton' src='"+staticContentLocation +"/img/6364_up.png'/><br><br><img class='downButton' src='"+staticContentLocation +"/img/6364_down.png'/><br></td></tr></table>";
			html2+="</select>";
			nomenDefaultList.push(html2);
			nomenList.push({html:html, cv:responseText.CE_CODE_VALUE});
			setNomenLocation(responseText.CE_CODE_VALUE);
			loadDefaultNomen(defaultNom, responseText.CE_CODE_VALUE);
		}
		//reply from update
		else if(json_response.response.CSV){
		$('#updateButton').html("UPDATE");
			alert("Cust_cond_summary_data table has been successfully updated");
		}
		//reply from requestNu
		else if(json_response.response.NUREPLY){
			nuResponse = json_response.response.NUREPLY.LIST;
			$('#locTypeCheck').trigger('change');
			setLocType();
		}
	}
	
	//set location type section
	function setLocType(){
		$.each(locTypeSelected, function(i, e){
			$('#locTypeDiv select[name=\'locTypeAvailList\']').find('option').each(function(index, v){
				if(e.toString()===$(v).val()){
					$('#locTypeDiv select[name=\'locTypeSelectedlList\']').append("<option value='"+$(v).val()+"' title='"+$(v).text()+"'>"+$(v).text()+"</option>");
					$(v).remove();
					return;
				}
			})
		});
	}

	//set nomen location section
	function setNomenLocation(ce_id){
		var dk = [];
		var length=nomenResponse.length;
		for(var i=0; i<length; i++) {
		    if ($.inArray(nomenResponse[i].DISPLAY_KEY, dk)==-1) {
		        dk.push(nomenResponse[i].DISPLAY_KEY);
		    }else{
		    	nomenResponse.splice(i, 1);
		    	length--;
		    	i--;
		    }
		};

		nomenResponseCollection.push({
			CE_ID: ce_id,
			LOCATIONS: []
		});
		
		for(var i=0; i<nomenResponse.length; i++){
			var selected = getSelectedNomenLocation(nomenResponse[i].CODE_VALUE, ce_id);	
			nomenResponseCollection[nomenResponseCnt].LOCATIONS.push({
				FAC_ID : nomenResponse[i].FACILITY_CV,
				LOC_ID: nomenResponse[i].CODE_VALUE,
				NOMEN: []
			});
			for(var m=0; m<selected.length; m++){
				nomenResponseCollection[nomenResponseCnt].LOCATIONS[i].NOMEN.push(selected[m]);
			}
		}
		var newCollection = rearrangeCollection(nomenResponseCollection);

		$('#nomenDiv').html("");
		_.each(newCollection, function(loc){
			var html ="<div class='nomenItemDiv'><div><button class='deleteButton'><img src='"+staticContentLocation +"/img/4984_16.png'/></button><select class='itemDrop' name='interval'>"+loadLocationList()+"</select></div></div>";
			$('#nomenDiv').append(html);
			$.each(nomenList, function(i, e){
				html=e.html;
				$('.nomenItemDiv').last().append(html);
				_.each(loc.CE, function(ce){
				
					if(splitApart(ce.CE_ID) == splitApart(e.cv.toString())){
						_.each(ce.NOMEN, function(nomen){
							$('#nomenDiv select[name=\'nomen\']').last().find('option').each(function(index, v) {
							
								if(splitApart($(v).val()) == splitApart(nomen.NOMEN_ID)){
								
										$(v).remove();
										var row = "<option code_value='"+$(v).attr("code_value")+"' value='"+$(v).val()+"'>"+$(v).html()+"</option>"
									$('#nomenDiv select[name=\'selectedNomen\']').last().append(row);
								}
								return;
							});
						});
					}
				});
			});
      		$('#nomenDiv select[name=\'interval\']').last().val(loc.FACILITY_ID);
			$('#nomenDiv').find('select[name=\'interval\']').last().trigger('change');
			$('#nomenDiv select[name=\'unit\']').last().val(loc.LOC_ID);
		})
		nomenResponseCnt++;
	}
	
	//rearrange the collection to have the hierarchy of location-clinical event
	function rearrangeCollection(collection){
		var location=[];
		var returnCollection = [];
		_.each(collection, function(coll){
			_.each(coll.LOCATIONS, function(loc){
				location.push({fac_id: loc.FAC_ID, loc_id: loc.LOC_ID});
			})
		})

		location =  _.uniq(_.collect(location, function(x){
			return JSON.stringify(x);
		}));
		location=$.parseJSON("["+location+"]");

		_.each(location, function(locat){
			returnCollection.push({
				FACILITY_ID: locat.fac_id,
				LOC_ID: locat.loc_id,
				CE: []
			})
			_.each(collection, function(coll){
				_.each(coll.LOCATIONS, function(loc){
					if(loc.LOC_ID===locat.loc_id&&loc.NOMEN.length){
						_.last(returnCollection).CE.push({
							CE_ID: _.last(loc.NOMEN).CE_ID,
							NOMEN:loc.NOMEN
						})
					}
				})
			})
		})
		return returnCollection;
	}
	
	function splitApart(value, separator)
    {
		
        if(separator === undefined) separator = ".";
		var strValue = typeof value == "number" ? value.toString() : value;
        var sepIndex = strValue.indexOf(separator);
				
        if(sepIndex > 0)
		{
	        return strValue.substring(0,sepIndex).trim();
		}
        else 
		{

            return strValue.trim();
		}
    }
	//get available nomen location
	function getSelectedNomenLocation(loc_id, ce_id){
		var list = AjaxHandler.parse_json(preLoadedLocationCodes);
		var AliasCodeList = list.CUST_REC;
		var list = [];
		$.each(AliasCodeList.DATA, function(i, v) {
            
	 		if(v.DISP_NAME==="NOMEN" && v.ALT_FOUND_NAME!="DEFAULT" && splitApart(v.PARENT_ENTITY_ID) == loc_id && splitApart(v.SCRIPT_NAME) == ce_id.toString()){
			
	 			list.push(
	 			{
	 				LOCATION_ID: loc_id,
	 				CE_ID: v.SCRIPT_NAME,
	 				DISP_SEQ: v.DISP_SEQ,
	 				NOMEN_ID: v.SECTION_NAME,
	 				DISPLAY_KEY: v.LONG_DESC
	 			}
	 			);
	 		}
	    return;
		});
		return list;
	}
	
	//right arrow to add nomen location
	function addNomen(dom){
		$(dom).closest('tr').find('select[name=\'nomen\']').find("option:selected").each(function(i, v){
			var newOpt = "<option value='"+ $(v).val()+" ' code_value='"+$(v).attr("code_value")+"'>"+$(v).html()+"</option>";
			$(v).closest('tr').find('select[name=\'selectedNomen\']').append(newOpt);
			$(v).remove();
		});
	}
	
	//left arrow to remove nomen location
	function removeNomen(dom){
		$(dom).closest('tr').find('select[name=\'selectedNomen\']').find("option:selected").each(function(i, v){
			var newOpt = "<option value='"+ $(v).val()+"' ' code_value='"+$(v).attr("code_value")+"'>"+$(v).html()+"</option>";
			$(v).closest('tr').find('select[name=\'nomen\']').append(newOpt);
			$(v).remove();
		});	
	}
	
	//up arrow to move nomen location up
	function upNomen(dom){
		$(dom).closest('tr').find('select[name=\'selectedNomen\']').find("option:selected").each(function(i, v){
			var row = $(v);
			row.insertBefore(row.prev());
		});	
	}
	
	//down arrow to move nomen location down
	function downNomen(dom){
		$(dom).closest('tr').find('select[name=\'selectedNomen\']').find("option:selected").each(function(i, v){
			var row = $(v);
			row.insertAfter(row.next());
		});		
	}
	
	return({
		init : function(){
			render();
			loadData();
		}
	})
}());
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/gm, '');
  };
}

//document ready, load the page
$(document).ready(function() {
	setup.init();
});
