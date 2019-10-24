function ACM_Expanded_View(controller,personId,reltnCode) {
	var m_controller = controller;
	var staticContentPath = m_controller.staticContentPath;
	var m_personId = personId;
	var m_encntrId = m_controller.getEncounterId(m_personId);
	var m_reltnCode = reltnCode;
	var pvFrameworkLinkObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
	var criterionOb = controller.getCriterion().CRITERION;
	var m_bUTCOn = criterionOb.UTC_ON;
	var communicationPrefs = { canSendMessage:false,
								canSendReminder:false };
	var m_dropdown;
	var summaryPopUpPrefs = { summaryDriver:"",
								parameters:"" };
	var isValidConfiguration = true;

	checkPreferences();
	function checkPreferences() {
		var communicatePrefValue = pvFrameworkLinkObj.GetPrefValue(0,"COMMUNICATE");
		if(communicatePrefValue > 0) {
			var msgPrefValue = pvFrameworkLinkObj.GetPrefValue(0,"COMM_PHONEMSG");
			if(msgPrefValue > 0) {
				communicationPrefs.canSendMessage = true;
			} 
			
			var reminderPrefValue = pvFrameworkLinkObj.GetPrefValue(0,"COMM_REMINDER");
			if(reminderPrefValue > 0) {
				communicationPrefs.canSendReminder = true;
			} 
		}  
	}
	this.enableButton = function(buttonName){
		m_dropdown.enableButton(buttonName,false);
	};
	this.buildWklExpandedView = function() {
		buildExpandedViewSummaryPopUpConfiguration();
		$wklExpandedView = $('<div class="wklExpandedViewBody">')
								.append($('<div id ="wklExpandedViewButtonDiv" class ="overflowVisible">').prepend(buildButtons()),buildCommentAndTodoSection());
		return $wklExpandedView;
	};
	function buildButtons()
	{
		var bedrockPrefs = m_controller.getBedrockPrefs();
		var name = bedrockPrefs.POWERFORM_TITLE || i18n.rwl.ASSESSMENTS;
		var forms = bedrockPrefs.POWERFORM_FORMS;
		m_dropdown = new RWToolbar(staticContentPath, m_controller);
		var powerforms = [];
		if(forms)
		{
			for(var f = 0, length = forms.length; f < length; f++) {
				powerforms.push({
					title: forms[f].NAME,
					name: forms[f].NAME,
					dcallback: loadPowerform,
					id: forms[f].ID
				});
			}
		}
		m_dropdown.addButton([
			{name:"patientRowUp",label:"",icon:staticContentPath+"/images/3900_16.png",callback:m_controller.expandViewPatientCellScroll, param:[m_personId,"up"],dropdown:[]},     
			{name:"patientRowDown",label:"",icon:staticContentPath+"/images/3897_16.png",callback:m_controller.expandViewPatientCellScroll, param:[m_personId,"down"],dropdown:[]},     
			{name:"openSummary",label:i18n.rwl.SUMMARYBUTTON,callback:loadExpandedViewSummaryPopUp,dropdown:[]},
			{name:"msgButton",label:i18n.rwl.MSGBUTTON,callback:sendMessage,dropdown:[]},
			{name:"reminderButton",label:i18n.rwl.REMINDERBUTTON,callback:createReminder,dropdown:[]}
		]);
		m_dropdown.enableButton("patientRowUp");
		m_dropdown.enableButton("patientRowDown");
		if(powerforms.length == 1) {
			m_dropdown.addButton([{name:"powerforms",label:name,callback:loadPowerform, param:powerforms[0].id}])
				.enableButton("powerforms");
		}
		else if(powerforms.length > 1) {
			m_dropdown.addButton([{name:"powerformsDropdown",label:name,callback:"",dropdown:powerforms,dropdownArrow:true}])
				.enableButton("powerformsDropdown");
		}

		if(isValidConfiguration)
			m_dropdown.enableButton("openSummary");
		if(communicationPrefs.canSendMessage)
			m_dropdown.enableButton("msgButton");
		if(communicationPrefs.canSendReminder)
			m_dropdown.enableButton("reminderButton");

		return m_dropdown.getToolbar().css("margin-left", "0");
	}
	function loadPowerform(formId)
	{
		if(m_encntrId === undefined || m_encntrId === 0)
		{
			alert(i18n.rwl.NOENCOUNTER);
		}
		else
		{
			var paramString = m_personId + '|' + m_encntrId + '|' + formId + '|0|0';
			MPAGES_EVENT('POWERFORM',paramString);
		}
	}
	function sendMessage() {
		var GENERAL_MESSAGE_TYPE = 0;
		try {
			pvFrameworkLinkObj.inboxCommunicate(GENERAL_MESSAGE_TYPE,personId,m_encntrId);
		} catch (err) {
			var errorMessage = i18n.rwl.ERRORCODE.replace("{0}",JSON.stringify(err));
			alert(errorMessage);	
			m_controller.logErrorMessages("",errorMessage,"sendMessage");
		}	
	}
	function createReminder() {
		var REMINDER_MESSAGE_TYPE = 1;
		try {
			pvFrameworkLinkObj.inboxCommunicate(REMINDER_MESSAGE_TYPE,personId,m_encntrId);
		}  catch (err) {
			var errorMessage = i18n.rwl.ERRORCODE.replace("{0}",JSON.stringify(err));
			alert(errorMessage);	
			m_controller.logErrorMessages("",errorMessage,"createReminder");
		}
	}
	function loadExpandedViewSummaryPopUp() {
		pvFrameworkLinkObj.SetPopupStringProp('REPORT_NAME', summaryPopUpPrefs.summaryDriver);
		pvFrameworkLinkObj.SetPopupStringProp('REPORT_PARAM', summaryPopUpPrefs.parameters);
		pvFrameworkLinkObj.SetPopupBoolProp('MODELESS', 1);
		pvFrameworkLinkObj.SetPopupBoolProp('MODAL', 1);
		pvFrameworkLinkObj.SetPopupBoolProp('SHOW_BUTTONS', 0);
		pvFrameworkLinkObj.SetPopupBoolProp('SHOW_DEMOG_BAR', 1);
		pvFrameworkLinkObj.SetPopupStringProp('DLG_TITLE', i18n.rwl.EXPANDEDVIEWSUMMARYDLGTITLE);
		pvFrameworkLinkObj.SetPopupStringProp('VIEW_CAPTION', i18n.rwl.EXPANDEDVIEWSUMMARYDLGTITLE);
		pvFrameworkLinkObj.LaunchPopup();
	}
	function buildExpandedViewSummaryPopUpConfiguration() {
		var bedrockPrefs = m_controller.getBedrockPrefs(),
			mpDrivers = [
				{driver: 'mp_driver', version: 4},
				{driver: 'mp_unified_driver', version: 5}
			],
			mpVersion = 0,
			summaryId = bedrockPrefs.SUMMARY_MPAGE_IDENTIFIER,
			summaryPath = bedrockPrefs.SUMMARY_MPAGE_PATH;
		summaryPopUpPrefs.summaryDriver = bedrockPrefs.SUMMARY_MPAGE_DRIVER;

		if (!summaryPopUpPrefs.summaryDriver && isValidContentPath(summaryPath, 4)) {	// Don't require a driver script for MPages 4.X passive upgrade from RWL 1.0 to DWL 1.1.
			summaryPopUpPrefs.summaryDriver = 'mp_driver';
			mpVersion = 4;
		} else if (summaryPopUpPrefs.summaryDriver) {
			mpVersion = getDriverByName(summaryPopUpPrefs.summaryDriver).version;
		}
		if (!isValidConfig(summaryPopUpPrefs.summaryDriver, summaryPath, summaryId, mpVersion)) {	// The Expanded View configuration is not valid.
			m_controller.addDisplayMessage('info', i18n.rwl.SUMMARYMPAGESMSG, 'summary', m_controller.staticContentPath + "/images/5104_16.png", 'auto'); 
			isValidConfiguration = false;
			return;
		}

		if (!summaryPopUpPrefs.parameters) {
			var staticContentPath = "^" + summaryPath.replace(/[\\]/gi,"\\\\") + "^, ",
				viewIdentifier = "^" + summaryId + "^";
			summaryPopUpPrefs.parameters = buildParamString(staticContentPath, viewIdentifier, mpVersion);
		}
		function buildParamString(staticContentPath, viewIdentifier, version) {
			var paramString = "";

			switch(version){
				case 4:
					paramString = buildMpage4ParamString(staticContentPath, viewIdentifier);
					break;
				case 5:
					paramString = buildMpage5ParamString(staticContentPath, viewIdentifier);
					break;
				default:
					m_controller.logErrorMessages("", "An unsupported version of MPages was detected.  Please check the Bedrock configuration.", "buildParamString");
					break;
			}

			return paramString;
			function buildMpage4ParamString(staticContentPath, viewIdentifier) {
				var paramStr = '';

				paramStr += '^MINE^, ';
				paramStr += m_personId + '.0, ';				// Patient ID
				paramStr += m_encntrId + '.0, '; 				// Encounter ID
				paramStr += criterionOb.PRSNL_ID + '.0, ';		// User ID
				paramStr += criterionOb.POSITION_CD + '.0, ';	// User position code
				paramStr += m_reltnCode + '.0, ';				// PPR
				paramStr += '^powerchart.exe^, ';				// Executable
				paramStr += '^^, ';
				paramStr += staticContentPath;                  // Static Content Path
				paramStr += viewIdentifier + ', '; 				// Summary MPage ID
				paramStr += '4';                                // DEBUGIND

				return paramStr;
			}
			function buildMpage5ParamString(staticContentPath, viewIdentifier) {
				var paramStr = "";

				paramStr = '^MINE^, ';
				paramStr += m_personId + '.0, ';				// Patient ID
				paramStr += m_encntrId + '.0, '; 				// Encounter ID
				paramStr += criterionOb.PRSNL_ID + '.0, ';		// User ID
				paramStr += criterionOb.POSITION_CD + '.0, ';	// User position code
				paramStr += m_reltnCode + '.0, ';				// PPR
				paramStr += '^powerchart.exe^, ';				// Executable
				paramStr += staticContentPath;                  // Static Content Path
				paramStr += viewIdentifier;                     // Summary MPage ID

				return paramStr;
			}
		}
		function getDriverByName(driver) {
			var tempDriver = {};

			if (driver) {
				for (var i=0, numMpDrivers=mpDrivers.length; i<numMpDrivers; i++) {
					if (driver === mpDrivers[i].driver) {
						tempDriver = mpDrivers[i];
						break;
					}
				}
			}

			return tempDriver;
		}
		function isValidConfig(driver, path, summary, version) {
			return isValidVersion(version) && isValidDriver(driver) && isValidContentPath(path, version) && isValidSummaryId(summary);
		}
		function isValidDriver(inDriver) {
			var isValid = getDriverByName(inDriver).driver ? true : false;

			if (!isValid) {
				m_controller.logErrorMessages("", "A valid summary driver was not specified.", "isValidDriver");
			}

			return isValid;
		}
		function isValidContentPath(inPath, version) {
			var isValid = (!inPath && version === 4) ? false : true;

			if (!isValid) {
				m_controller.logErrorMessages("", "A valid static content path was not specified.", "isValidContentPath");
			}

			return isValid;
		}
		function isValidSummaryId(inSummaryId) {
			var isValid = inSummaryId ? true : false;

			if (!isValid) {
				m_controller.logErrorMessages("", "A valid summary id was not specified.", "isValidSummaryId");
			}

			return isValid;
		}
		function isValidVersion(version) {
			var isValid = false;

			for (var i=0, numMpDrivers=mpDrivers.length; i<numMpDrivers; i++) {
				if (mpDrivers[i].version === version) {
					isValid = true;
					break;
				}
			}
			if (!isValid) {
				m_controller.logErrorMessages("", "A valid MPages version could not be determined.", "isValidVersion");
			}

			return isValid;
		}
	}

	function buildCommentAndTodoSection() {
		var $commentSection = $()
			.add($("<div id='evCommentDiv' class='expandedViewContentDiv'>")
				.append($("<div id='evCommentHdrDiv' class='expandedViewHeaderText'><span>" + i18n.rwl.COMMENTS + "</span></div>"),
						$("<div id='evCommentTxtDiv' class='evTxtDiv'>")
							.append($("<textarea rows=3 cols=50/>")
										.bind("keydown paste propertychange",handleTextChange),
									$("<div>")
										.append($("<span class='evCommLimit'>0" + i18n.rwl.COMMENTLIMIT + "</span>"),
												$("<span class='evCommSave'>" + i18n.rwl.COMMENTSAVE + "</span>")
													.click(saveComment))),																		
						$("<div id='evCommentListDiv' class='evListDiv'>")))
			.add($("<div id='evTodoDiv' class='expandedViewContentDiv'>")
				.append($("<div id='evTodoHdrDiv' class='expandedViewHeaderText'><span>" + i18n.rwl.TODOS + "</span></div>"),
						$("<div id='evTodoTxtDiv' class='evTxtDiv'>")
							.append($("<textarea rows=3 cols=50/>")
										.bind("keydown paste propertychange",handleTextChange),
									$("<div>")
										.append($("<span class='evCommLimit'>0" + i18n.rwl.COMMENTLIMIT + "</span>"),
												$("<span class='evCommSave'>" + i18n.rwl.TODOSAVE + "</span>")
													.click(saveTodo))),																		
						$("<div id='evTodoListDiv' class='evListDiv'>")
							.append("<div class='evTodoIncomp'></div>",
									"<div class='evTodoComp'></div>")));
		
		setTimeout(function(){
			var patient = m_controller.getPatientById(m_personId);
			var patComments = patient.COMMENTS || [];
			var comments = [];
			for(var i=0,len=patComments.length; i<len; i++){
				var curComment = patComments[i];	
				var dateUTC = convertSQLDateStringToJS(curComment.UPDT_DT_TM);			
				comments.push({
					id: curComment.COMMENT_ID,
					text: curComment.COMMENT_TEXT,
					type: curComment.COMMENT_TYPE,
					date: dateUTC,
					prsnl_id: curComment.UPDT_ID,
					prsnl_name: $.trim(curComment.UPDT_NAME)
				});
			}
			appendComments(comments);
		},0);		
		return $commentSection;
		function addComment(personId,text,type) {
			var request = {
				noterequest:{
					operation: "ADD",
					parent_entity_name: "PERSON",
					parent_entity_id: personId,
					sticky_note_type: type,
					sticky_note_text: text
				}
			};
			
			m_controller.makeCall("mp_dcp_sticky_note_wrapper",request,false,function(reply){
				var commentCCL = {
					COMMENT_ID: reply.STICKY_NOTE_ID,
					COMMENT_TEXT: text,
					COMMENT_TYPE: type,
					UPDT_DT_TM: reply.UPDT_DT_TM,
					UPDT_ID: criterionOb.PRSNL_ID,
					UPDT_NAME: criterionOb.PRSNL_NAME
				};
				var oPatientComments = m_controller.getPatientById(personId).COMMENTS || [];
				oPatientComments.splice(0,0,commentCCL);
				m_controller.setPatientProperty(personId,"COMMENTS",oPatientComments);
				
				var dateUTC = convertSQLDateStringToJS(reply.UPDT_DT_TM);		
				var comment = {
					id: reply.STICKY_NOTE_ID,
					text: text,
					type: type,
					date: dateUTC,
					prsnl_id: criterionOb.PRSNL_ID,
					prsnl_name: criterionOb.PRSNL_NAME
				};
				var oWLPatientComments = m_controller.getCommentsById(personId);
				oWLPatientComments.splice(0,0,comment);
				m_controller.updateCommentInd(personId,oWLPatientComments);
				appendComments(comment);
			},null,null,null,"action");	
		}
		function deleteComment(personId, commentId, $commItem) {
			var request = {
				noterequest:{
					operation: "DELETE",
					sticky_note_id: commentId
				}
			};
			m_controller.makeCall("mp_dcp_sticky_note_wrapper",request,true,function() {
				var oPatientComments = m_controller.getPatientById(personId).COMMENTS || [];
				for(var i=0,len=oPatientComments.length; i<len; i++){
					if(oPatientComments[i].COMMENT_ID==commentId){
						oPatientComments.splice(i,1);
						break;
					}
				}
				m_controller.setPatientProperty(personId,"COMMENTS",oPatientComments);
				
				var oWLPatientComments = m_controller.getCommentsById(personId);
				for(var j=0,length=oWLPatientComments.length; j<length; j++){
					if(oWLPatientComments[j].id==commentId){
						oWLPatientComments.splice(j,1);
						break;
					}
				}
				$commItem.remove();
				if($commItem.hasClass('evCommentItem')) {
					$commentSection.find('div.evCommentItem').removeClass('evZebBlue').filter(':odd').addClass('evZebBlue');
				} else {
					$commentSection.find('div.evTodoItem').removeClass('evZebBlue').filter(':odd').addClass('evZebBlue');
				}

				m_controller.updateCommentInd(personId,oWLPatientComments);
			},null,null,null,"action");
		}
		function completeAction(personId,event){	
			
			var $todoItem = $(event.target).closest("div.evTodoItem");
			var todoId = $todoItem.data("id");
			var actionInfo = {};
			$commentSection.find("div.evTodoItem").removeClass("evZebBlue").filter(":odd").addClass("evZebBlue");
			
			var request = {
				noterequest:{
					operation: "COMPLETE",
					sticky_note_id: todoId
				}
			};	
			
			
			
			m_controller.makeCall("mp_dcp_sticky_note_wrapper",request,false,function(reply) {
				
				$todoItem.attr("disabled","true").detach();
				var oPatientComments = m_controller.getPatientById(personId).COMMENTS || [];
				for(var i=0,len=oPatientComments.length; i<len; i++){
					if(oPatientComments[i].COMMENT_ID==todoId){
						oPatientComments[i].COMMENT_TYPE = 2; // complete todo
						oPatientComments[i].UPDT_DT_TM = reply.UPDT_DT_TM;
						oPatientComments[i].UPDT_ID = criterionOb.PRSNL_ID;
						oPatientComments[i].UPDT_NAME = criterionOb.PRSNL_NAME;
						break;
					}
				}
				m_controller.setPatientProperty(personId,"COMMENTS",oPatientComments);		
				
				var dateUTC = convertSQLDateStringToJS(reply.UPDT_DT_TM);
				var oWLPatientComments = m_controller.getCommentsById(personId);
				var comment = {};
				for(var j=0,length=oWLPatientComments.length; j<length; j++){
					if(oWLPatientComments[j].id==todoId){
						oWLPatientComments[j].type = 2; // complete todo
						oWLPatientComments[j].date = dateUTC;
						oWLPatientComments[j].prsnl_id = criterionOb.PRSNL_ID;
						oWLPatientComments[j].prsnl_name = criterionOb.PRSNL_NAME;
						comment = $.extend(true,{},oWLPatientComments[j]);
						actionInfo = oWLPatientComments[j];
						break;
					}
				}
				m_controller.updateCommentInd(personId,oWLPatientComments);
				appendComments(comment);
				
			},null,null,null,"action");
			
			m_controller.lastActionCellUpdate(personId, [actionInfo]);
		}
		function saveComment(event) {
			var $button = $(event.target);
			if(!$button.hasClass("enabled")){
				return;
			}
			var $commentTxtDivTextArea = $("#evCommentTxtDiv").find("textarea");
			var text = $commentTxtDivTextArea.val();
			addComment(m_personId,text,0);
			$commentTxtDivTextArea.val("");
		}
		function saveTodo(event){
			var $button = $(event.target);
			if(!$button.hasClass("enabled")){
				return;
			}
			var $toDoTxtDivTextArea = $("#evTodoTxtDiv").find("textarea");
			var text = $toDoTxtDivTextArea.val();
			addComment(m_personId,text,1);
			$toDoTxtDivTextArea.val("");		
		}
		function completeTodo(event){
			if(!$(event.target).attr("checked")) { 
				return;
			}
	
			completeAction(m_personId,event);
		}
		function launchDeleteDialog(event) {
			var $commItem = $(event.target).closest("div.evCommentItem");
			var bTodo = false;
			if(!$commItem.length){
				$commItem = $(event.target).closest("div.evTodoItem");
				bTodo = true;
			}
			var commId = $commItem.data("id");
			
			var htmlString = "<div id='dialog'>";
			htmlString += "<div id = 'rwSearchDlgHeader'class='dlgHeader'><span>" + (bTodo ? i18n.rwl.TODODELETE : i18n.rwl.COMMENTDELETE) + "</span></div>";
			htmlString += "<div id = 'dialogMiddle'>" + (bTodo ? i18n.rwl.TODODELCONF : i18n.rwl.COMMENTDELCONF) + "</div>";
			htmlString += "<div id = 'dialogButtons'><input id = 'dialogCancelBut' class = 'rwSearchDlgBtn shareButton' type = 'button' value = '" + i18n.rwl.CANCEL + "'/>";
			htmlString += "<input id = 'commentDelDialogOkBut' class = 'rwSearchDlgBtn shareButton' type ='button' value='" + i18n.rwl.DELETE + "'/></div>";
			htmlString += "</div>";
			$("body").prepend("<div id = 'divSaveBackground' class='overlayDimmed'>", htmlString);
			
			$("#commentDelDialogOkBut").click(function(){
				deleteComment(m_personId,commId, $commItem);
				
				$("#divSaveBackground").remove();
				$("#dialog").remove();
			});
			
			$("#dialogCancelBut").click(function() {
				$("#divSaveBackground").remove();
				$("#dialog").remove();
			});
		}
		function appendComments(comments) {
			if(!comments) {
				return;
			}
			var commentAr = [].concat(comments).reverse();
			var $commListDiv = $("#evCommentListDiv");
			var $todoListDiv = $("#evTodoListDiv");
			var prsnlId = parseFloat(m_controller.criterion.CRITERION.PRSNL_ID);
			var curListOwnerId = m_controller.getActiveList().OWNER_ID;

			for(var i=0,len=commentAr.length; i<len; i++) {
				var dateLoc = new Date();
				dateLoc.setTime(commentAr[i].date.getTime() );
				var dateString = DWL_Utils.fnGetDateString(dateLoc, m_bUTCOn);
				var dateDisp = dateString.replace("{2}", i18n.discernabu.MONTHNAMES[dateLoc.getMonth()]);
				
				if(!commentAr[i].type || commentAr[i].type==0){ // comment
					$commListDiv.prepend(
						$("<div class='evCommentItem'>")
							.data({id:commentAr[i].id,prsnl_id:commentAr[i].prsnl_id})
							.append($("<div class='evCommItemDel'><div title='" + i18n.rwl.COMMENTDELETE + "'></div></div>")
										.click(launchDeleteDialog),
									("<span class='evCommItemHdr'>" + commentAr[i].prsnl_name +
										" (" + dateDisp + ")</span>"),
									("<span class='evCommItemTxt'>" + commentAr[i].text + "</span>"))
							.hover(function(){
										if($(this).data("prsnl_id")==prsnlId){
											$(this).find(".evCommItemDel").show();
										}									
									}, function(event){
										$(this).find(".evCommItemDel").hide();
									}
							));
				} else { // todo
					var $todoDiv = $(),
						sChkProp = "";
						
					if(commentAr[i].type==2){
						$todoDiv = $todoListDiv.children("div.evTodoComp");
						sChkProp = " checked='checked' disabled='true'";
					} else {
						$todoDiv = $todoListDiv.children("div.evTodoIncomp");
						if(commentAr[i].prsnl_id!=prsnlId && commentAr[i].prsnl_id!=curListOwnerId){
							sChkProp = " disabled='true'";
						}
					}
					$todoDiv.prepend(
						$("<div class='evTodoItem'>")
							.data({id:commentAr[i].id,prsnl_id:commentAr[i].prsnl_id})
							.append($("<div class='evCommItemDel'><div title='" + i18n.rwl.TODODELETE + "'></div></div>")
										.click(launchDeleteDialog),
									$("<div class='evTodoItemComp'>")
										.append($("<input type='checkbox' value='1'" + sChkProp + "/>")
												.change(completeTodo)),
									$("<div>").append(
									("<span class='evCommItemHdr'>" + commentAr[i].prsnl_name +
										" (" + dateDisp + ")</span>"),
									("<span class='evCommItemTxt'>" + commentAr[i].text + "</span>")))
							.hover(function(){
									if($(this).data("prsnl_id")==prsnlId){
											$(this).find(".evCommItemDel").show();
										}									
									}, function(event){
										$(this).find(".evCommItemDel").hide();
									}
							));
				}
				if (!commentAr[i].type || commentAr[i].type == 0) {
				    $commentSection.find("div.evCommentItem").removeClass("evZebBlue").filter(":odd").addClass("evZebBlue");
				}
				else {
				    $commentSection.find("div.evTodoItem").removeClass("evZebBlue").filter(":odd").addClass("evZebBlue");
				}

			}
			
		}
		function handleTextChange(event) {
			var $input = $(this);
			setTimeout(function(){
				var newVal = $input.val().replace(/[\^\n]/g,"").slice(0,255);
				if(newVal != $input.val()){
					$input.val(newVal);
				}
				var $btnSave = $input.parent().find("span.evCommSave");
				var $txtLimit = $btnSave.siblings("span.evCommLimit");
				(newVal.length > 0) ? $btnSave.addClass("enabled") : $btnSave.removeClass("enabled");
				$txtLimit.text(newVal.length + i18n.rwl.COMMENTLIMIT);
				if(event.which==13) { // enter key
					$btnSave.click();
				}
			},0);
		}
	}	
}
