//global mpage object to store values used in subroutines
var mpObj = {
	personId : "",
	userId : "",
	encntrId : "",
	expClicks: 0,
	ipath : "",
	prefs:"",
	sexCd: "",
	vitPrefSet: 0,
	labPrefSet: 0,
	appName: "",
	posCode: "",
	pprCode: ""
};

objPrefs = {}	
objPrefs.arr = []

////Ajax function to load CCL scripts having a callback function with parameters
function loadWithCBParameters(url, callback, sec, hasPlus, scrollNum, parameters) {
    var xhr = new XMLCclRequest ();

    xhr.onreadystatechange = checkReady;
	//send demo and prefs sync for now for bedrock prefs. 
	if (url === 'mp_pe_get_demographics' || url === 'mp_pe_get_prefs'){
		//alert('url true');
		xhr.open('GET', url,false);
	}
	else {
		xhr.open('GET', url,true);
	}
	
	if (parameters) {
		xhr.send(parameters);
	}
	else {
		xhr.send("^MINE^, value($PAT_Personid$), value($USR_Personid$), value($VIS_Encntrid$), 1");
	}

    function checkReady() { //check to see if request is ready
        if (xhr.readyState === 4) {// 4 = "loaded"
            if (xhr.status === 200) {// 200 = OK
                // ...callback function
                callback(xhr, sec, hasPlus, scrollNum);
            }
            else {
                alert("Problem retrieving XML data");
            }
        }
    }
}
//////end load CB params function

function demographicLoad(demoInput) {
	// var msgDemo = demoInput.responseText;
	// var jsonDemo = JSON.parse(msgDemo);
	var jsonDemo = JSON.parse(demoInput);

	mpObj.personId = jsonDemo.ids.person_id;
	mpObj.userId = jsonDemo.ids.user_id;
	mpObj.encntrId = jsonDemo.ids.encntr_id;
	mpObj.sexCd = jsonDemo.ids.sex;
	mpObj.appName = jsonDemo.ids.app_name;
	mpObj.posCode = jsonDemo.ids.pos_code;
	mpObj.pprCode = jsonDemo.ids.ppr_code;

} //end demographicLoad

//set up section header links	
function setPrefs(p) {
	
	var secHref = "";
	var inHTML = "";
	var outHTML = "";
	var prefMsg = p.responseText;
	var element;
	var parElement;
	var link = "";
	var height = "";
		
	try{
		var prefJSON = JSON.parse(prefMsg);
	}
	catch (err){
		alert(err.description);
	}
	
	for(var i = 0; i < prefJSON.Prefs.length; i++){
	
		/*Set the section link and label*/
		element = document.getElementById(prefJSON.Prefs[i].pref.link_id);
		
		if(element != null){
			/*Set the label*/
			if(prefJSON.Prefs[i].pref.label !== null){
				element.innerHTML = prefJSON.Prefs[i].pref.label;
			}
			
			if(prefJSON.Prefs[i].pref.link.search(/Yes/) > -1){
				/*Set the link*/
				link = (prefJSON.Prefs[i].pref.link).replace("Yes - ", "");
				secHREF = 'javascript:APPLINK(0,"powerchart.exe","/PERSONID=' + mpObj.personId +   //TODO: change APP so it is dynamic
						  ' /ENCNTRID=' + mpObj.encntrId + 
						  ' /FIRSTTAB=^' + link + '^")';
				element.href = secHREF;
				element.title = "Go to " + link + " tab";
			}
			else{
				/*remove the link*/
				inHTML = element.firstChild.data;
				var parElement = $(element).parent();
				$(parElement).html(inHTML);

			}
		}

	}
	
}  //end setprefs

//init function
$(function() {
	var vsParams = '', labParams = '';
	var vitDelInd = 0; labDelInd = 0;
	//demographic load
	//loadWithCBParameters('mp_pe_get_demographics', demographicLoad);
	demographicLoad(demoString);
	// end demo load


	//Header Links load
	//loadWithCBParameters('mp_pe_get_prefs', setPrefs);
	// end header links load	
//////////////////////////////////////////////////////////////////	
	//add edit to vitals
	// $('#vitLink ').after('<a href="#" id="vitEdt" class="vit-edt">(Edit Range)</a>');
	// $('#vitdiv1').append('<form id="vitForm" class="form"> '
// + '<fieldset> <legend></legend> '
// + '<p class="vs-p"><label><span class="lbl-lft">Unit:</span><input type="text" id="vsUnit"/></label></p>'
// + '<p class="vs-p"><label><span class="lbl-lft">Unit of Measure:</span><select id="vsUOM">'
// + '<option value="s">Seconds</option><option value="min">Minutes</option><option value="h">Hours</option>'
// + '<option value="d">Days</option><option value="w">Weeks</option><option value="m">Months</option>'
// + '<option value="y">Years</option></select></label></p>'
// + '<p class="vs-p"><label><span class="lbl-lft"><input type="checkbox" id="vsReset" class="reset-chk"/></span><span class="">Reset to Default</span></label></p>'
// + '<p class="btn-p"><input id="btnSave" type="button" name="Save" value="Save" >'
// + '<input id="btnCancel" type="button" name="Cancel" value="Cancel" ></p>'
// + '</fieldset></form>');

// $('#vitForm').hide();
// $('#vitEdt').toggle(function() {
		// $('#vitdiv1').show();
	  // $('#vitForm').show();
	// }, function() {
	  // $('#vitForm').hide();
// });

// $('#vsReset').click(function() {
	// if ($(this).attr('checked')) {
		// //alert('check');
		// vitDelInd = 1;
		// $("#vsUnit").attr("disabled","disabled");
		// $("#vsUOM").attr("disabled","disabled");
		// $('#vsUnit').val('');
		// $('#vsUOM').val('s');
		// $('#vsState').remove();
	// }
	// else {
		// //alert('else');
		// vitDelInd = 0;
		// $("#vsUnit").removeAttr("disabled");
		// $("#vsUOM").removeAttr("disabled");
		// $('#vsState').remove();
	// }		
// });

// $('#btnSave').click(function(){
	// mpObj.vitPrefSet = 1;
	// var uom = $('#vsUOM').val();
	// var unitNum = $('#vsUnit').val();
		// if (isNaN(unitNum) || unitNum == "") {
			// if (vitDelInd != 1) {
			// alert('Please enter a valid number for the unit');
			// }
			// else {
			// vsParams = '';
			// $('#vsState').remove();
			// $(this).before('<span class="pref-state" id="vsState">Preference Reset</span>');
			// }
		// }
		// else {		
			// vsParams = unitNum + ',' + uom ;
			// $('#vsState').remove();
			// $(this).before('<span class="pref-state" id="vsState">Preference Saved</span>');
		// }
			
// });

// $('#btnCancel').click(function() {
		// mpObj.vitPrefSet = 0;
		// vitDelInd = 0;
		// vsParams = '';
		// $('#vsUnit').val('');
		// $('#vsUOM').val('s');
		// $("#vsUnit").removeAttr("disabled");
		// $("#vsUOM").removeAttr("disabled");
		// $("#vsReset").removeAttr("checked");
		// $('#vsState').remove();
		// $('#btnSave').before('<span class="pref-state" id="vsState">Preference Cleared</span>');
// });

// //add edit to labs
	// $('#labLink ').after('<a href="#" id="labEdt" class="lab-edt">(Edit Range)</a>');
	// $('#vitdiv2').append('<form id="labForm" class="form"> '
// + '<fieldset> <legend></legend> '
// + '<p class="vs-p"><label><span class="lbl-lft">Unit:</span><input type="text" id="labUnit"/></label></p>'
// + '<p class="vs-p"><label><span class="lbl-lft">Unit of Measure:</span><select id="labUOM">'
// + '<option value="s">Seconds</option><option value="min">Minutes</option><option value="h">Hours</option>'
// + '<option value="d">Days</option><option value="w">Weeks</option><option value="m">Months</option>'
// + '<option value="y">Years</option></select></label></p>'
// + '<p class="vs-p"><label><span class="lbl-lft"><input type="checkbox" id="labReset" class="reset-chk"/></span><span class="">Reset to Default</span></label></p>'
// + '<p class="btn-p"><input id="labBtnSave" type="button" name="Save" value="Save" >'
// + '<input id="labBtnCancel" type="button" name="Cancel" value="Cancel" ></p>'
// + '</fieldset></form>');

// $('#labForm').hide();
// $('#labEdt').toggle(function() {
		 // $('#vitdiv2').show();
	  // $('#labForm').show();
	// }, function() {
	  // $('#labForm').hide();
// });

// $('#labReset').click(function() {
	// if ($(this).attr('checked')) {
		// //alert('check');
		// labDelInd = 1;
		// $("#labUnit").attr("disabled","disabled");
		// $("#labUOM").attr("disabled","disabled");
		// $('#labUnit').val('');
		// $('#labUOM').val('s');
		// $('#labState').remove();
	// }
	// else {
		// //alert('else');
		// labDelInd = 0;
		// $("#labUnit").removeAttr("disabled");
		// $("#labUOM").removeAttr("disabled");
		// $('#labState').remove();
	// }		
// });

// $('#labBtnSave').click(function(){
	// mpObj.labPrefSet = 1;
	// var uomLab = $('#labUOM').val();
	// var unitLab = $('#labUnit').val();

		// if (isNaN(unitLab) || unitLab == "") {
			// if (labDelInd != 1) {
				// alert('Please enter a valid number for the unit');
			// }
			// else {
			// labParams = '';
			// $('#labState').remove();
			// $(this).before('<span class="pref-state" id="labState">Preference Reset</span>');
			// }
		// }
		// else { 
		// labParams = unitLab + ',' + uomLab ;
		// $('#labState').remove();
		// $(this).before('<span class="pref-state" id="labState">Preference Saved</span>');
		// }
// });

// $('#labBtnCancel').click(function() {
		// mpObj.labPrefSet = 0;
		// labDelInd = 0;
		// vsParams = '';
		// $('#labUnit').val('');
		// $('#labUOM').val('s');
		// $("#labUnit").removeAttr("disabled");
		// $("#labUOM").removeAttr("disabled");
		// $("#labReset").removeAttr("checked");
		// $('#labState').remove();
		// $('#labBtnSave').before('<span class="pref-state" id="labState">Preference Cleared</span>');
//});

////////////////////////////////////////////////////////////
 
    $(".column").sortable({connectWith: '.column'}, {zIndex: 1005}, {appendTo: 'body'});
    $(".column").disableSelection();

		
	//Make sure column is available
	$(".column").each(
		function() {
			if (!$(this).children().hasClass('section')) {
			$(this).append('&nbsp');
			}
		}
	);
	
	//set up expand collapse
    $(".sec-hd-tgl").each(
		function() {
			if ($(this).parent().parent().hasClass('closed')) {
				$(this).text('+');
				$(this).attr({ title: "Show Section" });
			}
		}
	);
	
	$(".sec-hd-tgl").click(
		function() {

			if ($(this).parent().parent().hasClass('closed')) {
				$(this).parent().parent().removeClass('closed');
				$(this).text('-');
				$(this).attr({ title: "Hide Section" });

			}
			else {
				$(this).parent().parent().addClass('closed');
				$(this).text('+');
				$(this).attr({ title: "Show Section" });

			}
		}
	);
	//end expand collapse set up
     
      
      
	$('#savePref').click(
		function(e) {
			var totalColumns = 0;
			var colArray = [];

			if ($('#sectionOne .section').length > 0) {
				totalColumns += 1;
				colArray.push('sectionOne');
			}
			if ($('#sectionTwo .section').length > 0) {
				totalColumns += 1;
				colArray.push('sectionTwo');
			}
			if ($('#sectionThree .section').length > 0) {
				totalColumns += 1;
				colArray.push('sectionThree');
			}

			var col1 = '';
			var colLen = colArray.length;
			for (var i=0;i<colLen; i++){
				var curCol = i + 1;
				$('#'+ colArray[i] + ' .section').each(
					function() {
						if ($(this).hasClass('closed')) {
							col1 += $(this).attr('id') + ',' + curCol +',0,|';
						}
						else {
							col1 += $(this).attr('id') + ',' + curCol +',1,|';
						}
					}
				);
			}


			// var personId = $('#person_id').text();
			// var userId = $('#user_id').text();
			// var encntrId = $('#encntr_id').text();
			//set pref array
			/*Removed the ablility to pass JSON to the backend due to CCl code requirements
			objPrefs.arr.push({pvc_name: 'MP_POS', pvc_value: col1, delete_ind: '0'});
			var pCount = 1;
			if (mpObj.vitPrefSet >  0) {
				objPrefs.arr.push({pvc_name: 'MP_PE_VIT_LOOKBEHIND', pvc_value: vsParams, delete_ind: vitDelInd});
			}
			if (mpObj.labPrefSet >  0) {
				objPrefs.arr.push({pvc_name: 'MP_PE_LAB_LOOKBEHIND', pvc_value: labParams, delete_ind: labDelInd});
			}
			//build pref json
			var arrPrefs = objPrefs.arr;
			var len = arrPrefs.length
			var jsonPref = "{'prefs': {'pref_cnt': '" + len + "','sec_prefs': ["
			var jsonEOL = ',';
			for (var i=0; i< len; i++) {
				if (i+1 == len || len == 1){
					jsonEOL = '';
				}

				jsonPref += " {'pvc_name': '" + arrPrefs[i].pvc_name + "','pvc_value': '" + arrPrefs[i].pvc_value +
							"','delete_ind': '" + arrPrefs[i].delete_ind + "'}" + jsonEOL;
			}
		
			jsonPref += "]}}";
			//end build pref json
			*/

			//working//		
			/*
	 		var lookbackJSON = "{'prefs': {'pref_cnt': '" + pCount + "','sec_prefs': [{'pvc_name': 'MP_PE_VIT_LOOKBEHIND','pvc_value': '" + vsParams + 
						 "','delete_ind': '" + vitDelInd + "'},{'pvc_name': 'MP_PE_LAB_LOOKBEHIND','pvc_value': '" + labParams +
						 "','delete_ind': '" + labDelInd + "'},{'pvc_name': 'MP_POS','pvc_value': '" + col1 +
						 "','delete_ind': '0'}]}}";
	//		paramString = "^MINE^," + "^" + col1 + "^," + "^" + personId + "^," + "^" + userId + "^," + "^" + encntrId + "^," + "^" + jsonPref + "^";
			paramString = "^MINE^,"+ personId + "," + userId + "," + encntrId + "," + "^" + jsonPref + "^";
			*/
			paramString = "^MINE^,"+ mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.appName + "^," +mpObj.posCode +"," + mpObj.pprCode + ",^" + col1 + "^";
			javascript:CCLLINK('mp_pe_clin_smry_save', paramString ,1)

		}
	);
	
    $('#clearPref').click(
		function(e) {
	
			var personId = $('#person_id').text();
			var userId = $('#user_id').text();
			var encntrId = $('#encntr_id').text();
			/*Removed the ablility to pass JSON to the backend due to CCl code requirements
			//var jsonPrefDel = "{'prefs': {'pref_cnt': '3','sec_prefs': [ {'pvc_name': 'MP_POS','pvc_value': '','delete_ind': '1'}, {'pvc_name': 'MP_PE_VIT_LOOKBEHIND','pvc_value': '','delete_ind': '1'}, {'pvc_name': 'MP_PE_LAB_LOOKBEHIND','pvc_value': '','delete_ind': '1'}]}}"
			//paramString = "^MINE^," + personId + "," + userId + "," + encntrId + "," + "^" + jsonPrefDel + "^";
			*/
			paramString = "^MINE^,"+ mpObj.personId + "," + mpObj.userId + "," + mpObj.encntrId + ",^" + mpObj.appName + "^," +mpObj.posCode +"," + mpObj.pprCode + ",^^";
			javascript:CCLLINK('mp_pe_clin_smry_save', paramString ,1)

		}
	);
//hmi border
$('#hmiContent').css('display', 'none');
	//end init function

});