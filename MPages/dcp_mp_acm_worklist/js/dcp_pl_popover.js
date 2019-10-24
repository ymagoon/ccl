(function(){
	'use strict';
	var global = this;
	function Popover(oProps) {
		var oPopover = this;
		var oDialog;
		var oHeader;
		var oBody;
		var oFooter;
		var oPatientData;
		var oElementStrings = {
				content: 'popoverContentDiv',
				header: 'popoverHeader',
				body: 'popoverBody',
				bodyFullHeight: 'popoverBodyFullHeight',
				bodyShortHeight: 'popoverBodyShortHeight',
				footer: 'popoverFooter',
				arrow: 'popoverArrow'
		};
		var oController = global.m_controller;
		var iUTCOn = oController.getCriterion().CRITERION.UTC_ON;
		var aCompletedCommPatientIds = [];
		var aCompletedJQObjects = [];
		var aPhoneCallSubjects = [];
		 var oRemoval = $.Deferred();
		function fnBuildHeader() {
			oHeader = new Header(oElementStrings.header, oElementStrings.content, [oElementStrings.header]);
			oHeader.fnRender();
		}
		function fnBuildBody() {
		 var heightClass = oProps.bShowFull === true ? oElementStrings.bodyFullHeight : oElementStrings.bodyShortHeight;
			oBody = new Body(oElementStrings.body, oElementStrings.content, oPatientData, [oElementStrings.body, heightClass]);
			oBody.fnRender();
		}
		function fnBuildFooter() {
			oFooter = new Footer(oElementStrings.footer, oElementStrings.content, oPatientData, [oElementStrings.footer]);
			oFooter.fnRender();
		}
		function fnBuildArrows() {
			var iImageHeight = 12;
			if(oProps.sDisplayPosition === 'up') {
				oPopover.fnGetPopover().append($('<div class="' + oElementStrings.arrow + ' popoverArrowDown"/>'));
				oProps.iYCord -= (oPopover.fnGetPopover().outerHeight() + iImageHeight);
			}
			else {
				oPopover.fnGetPopover().prepend($('<div class="' + oElementStrings.arrow + ' popoverArrowUp"/>'));
			}
		}
		function fnAttachEventHandlers() {
			oPopover.fnGetPopover().click(fnClickHandlers)
			                       .on('keydown paste','#commentsBox',fnKeydownHandlers);
		}
		function fnKeydownHandlers(event) {
			var $target = $(event.target);
			if($target.attr('id') === 'commentsBox') {
				setTimeout(function(){
					var iNumMaxChar = 1000;
					var sInputVal = $target.val();
					var iInputLength = sInputVal.length;
					var sNewVal = '';
					if(iInputLength <= iNumMaxChar) {
						return;
					}
					sNewVal = sInputVal.slice(0, iNumMaxChar);
					$target.val(sNewVal);
				},0);
			}
		}
		function fnClickHandlers(event) {
			var $target = $(event.target);
			if($target.hasClass('popoverCallCheck')) {
				fnHandlePhoneCallChanges($target);
			}
			if($target.attr('id') === 'ptPhoneCancel' && $target.prop('disabled') === false) {
				oPopover.fnRemove();
			}
			if($target.attr('id') === 'ptPhoneSave' && $target.prop('disabled') === false)  {
				fnCompletePhoneCalls();
				oPopover.fnRemove();
			}
		}
		function fnHandlePhoneCallChanges($target) {
			var sPhoneId = $target.val();
			var iPhoneIdIndex = $.inArray(sPhoneId,aCompletedCommPatientIds);
			var $parent = $target.parents('.popoverCall');
			var $saveBtn = $('#ptPhoneSave');
			
			if($parent.hasClass('completedCall') === true) {
				$parent.removeClass('completedCall');
				aCompletedCommPatientIds.splice(iPhoneIdIndex,1);
				aCompletedJQObjects.splice(iPhoneIdIndex,1);
				aPhoneCallSubjects.splice(iPhoneIdIndex,1);
				if(aCompletedCommPatientIds.length === 0) {
					$saveBtn.prop('disabled',true);
				}
			} else {
				$parent.addClass('completedCall');
				aCompletedCommPatientIds.push(sPhoneId);
				aCompletedJQObjects.push($parent);
				aPhoneCallSubjects.push($parent.find('label').text());
				$saveBtn.prop('disabled',false);
			}  
		}
		function fnCompletePhoneCalls() {
		 var sMessageText = (aPhoneCallSubjects || []).join(' ') + ' ' + $('#commentsBox').text();
			var oUpdateCommReq = {
				update_comm_request: {
					person_id: oProps.iPatientId,
					communications: [],
					prsnl_id: oController.getCriterion().CRITERION.PRSNL_ID,
					update_type_flag: 0,
					message_text: sMessageText,
					note_type_cd: oController.getBedrockPrefs().GENERATE_COMMUNICATION.PHONE_NOTE_TYPE
				}
			};
			var iLen = aCompletedCommPatientIds.length;
			var iIndex = 0;
			
			for(iIndex = 0; iIndex < iLen; iIndex++) {
				oUpdateCommReq.update_comm_request.communications.push({comm_patient_id: aCompletedCommPatientIds[iIndex]});
			}
			oController.makeCall('mp_dcp_update_communication',oUpdateCommReq,true);

			for(iIndex = 0; iIndex < iLen; iIndex++) {
				fnMoveCallToComplete(parseInt(aCompletedCommPatientIds[iIndex], 10), aCompletedJQObjects[iIndex]);
			}
		}
		function fnMoveCallToComplete(iCallId, $callJQObject) {
			var aPendingCalls = oPatientData.aPendingCalls;
			var iPendingCallIndex = -1;
			var aPendingCall = [];
			var oCurDate = new Date();
			var sSQLDate = '';

			for(var p = 0, plen = aPendingCalls.length; p < plen; p++) {
				if(aPendingCalls[p].COMM_PATIENT_ID === iCallId) {
					iPendingCallIndex = p;
					break;
				}
			}
			aPendingCall = oPatientData.aPendingCalls.splice(iPendingCallIndex,1);
			aPendingCall[0].COMM_PRSNL_NAME = oController.getCriterion().CRITERION.PRSNL_NAME;
			$callJQObject.find('.prsnlName').text(aPendingCall[0].COMM_PRSNL_NAME);

			sSQLDate = DWL_Utils.fnConvertJSDateToSQLString(oCurDate);
			aPendingCall[0].COMM_STATUS_DT_TM = sSQLDate;
			$callJQObject.find('.updateTime').text(DWL_Utils.fnGetDateDisplay(sSQLDate, iUTCOn));

			if($.isArray(oPatientData.aCompletedCalls) === false) {
				oPatientData.aCompletedCalls = aPendingCall;
			}
			else {
				oPatientData.aCompletedCalls.unshift(aPendingCall[0]);
			}

			oController.fnUpdatePatientPhoneCalls(oPatientData);
		}
		function fnHandleOverflow(iIndex, oElement) {
			if(DWL_Utils.fnIsTextOverflowed(oElement) === true) {
				$(oElement).attr('title',$(oElement).text()).tooltip({ show: false, hide: false, tooltipClass: 'popoverTooltip'});
		    }
		}
		this.fnRender = function() {
			oDialog = new DWL_Utils.Dialog(oProps.sId, ['popoverOuterDiv'], oProps.sParentId);
			oPatientData = oController.getPatientById(oProps.iPatientId);
			oPopover.fnGetPopover().append($('<div id="'+ oElementStrings.content + '" class="'+ oElementStrings.content + '"/>'));
			fnBuildHeader();
			fnBuildBody();
			fnBuildFooter();
			fnBuildArrows();
			fnAttachEventHandlers();
			oPopover.fnGetPopover().css({top: oProps.iYCord, left: oProps.iXCord}).find('.overflowableText').each(fnHandleOverflow);
			return this;
		};
		this.fnShow = function(oOptions) {
			oDialog.show(oOptions);
		};
		this.fnRemove = function() {
			if(DWL_Utils.isNullOrUndefined(oDialog) === false) {
				oDialog.remove();
			}
			oDialog = null;
			oHeader = null;
			oBody = null;
			oFooter = null;
			oPatientData = null;
			oRemoval.resolve();
		};
		this.fnOnRemoval = oRemoval.promise().done;
		this.fnGetPopover = function() {
			return oDialog.getDialog();
		};
		this.fnGetPatientId = function() {
			return oProps.iPatientId;
		};
		function Header(sId, sParentId, aCssArr) {
			this.fnRender = function() {
				var $header = $('<div/>').attr('id', sId);
				var sHeaderHtml = '<span>' + i18n.genComm.PENDINGCALLS + '</span>';
				var $target = DWL_Utils.isNullOrUndefined(sParentId) ? $('body') : $('#'+sParentId);
				
				if(DWL_Utils.isNullOrUndefined(aCssArr) === false && aCssArr.length > 0) {
					$header.addClass(aCssArr.join(' '));
				}
				
				$header.append(sHeaderHtml).appendTo($target);
				
				$target = null;
			};
		}
		function Footer(sId, sParentId, oPatientData, aCssArr) {
			this.fnRender = function() {
				var $footer = $('<div/>').attr('id', sId);
				var $target = DWL_Utils.isNullOrUndefined(sParentId) ? $('body') : $('#'+sParentId);
				var sHomePhone = oPatientData.HOME_PHONE || '';
				var sHomeExt = oPatientData.HOME_EXT || '';
				var sMobilePhone = oPatientData.MOBILE_PHONE || '';
				var sMobileExt = oPatientData.MOBILE_EXT || '';
				var sWorkPhone = oPatientData.WORK_PHONE || '';
				var sWorkExt = oPatientData.WORK_EXT || '';
				var $innerHtml = $('<div id="popoverFooterPhoneNumbers"/>');
				
				if(DWL_Utils.isNullOrUndefined(aCssArr) === false && aCssArr.length > 0) {
					$footer.addClass(aCssArr.join(' '));
				}
				
				if(sHomePhone.length === 0 && sMobilePhone.length === 0 && sWorkPhone.length === 0) {
					$innerHtml.append($('<div class="ptPhoneNum"><span class="phoneNum overflowableText">' + i18n.rwl.NOPHONEFOUND + '</span></div>'));
				}
				else {
					if(sHomePhone.length > 0) {
						if(sHomeExt.length > 0) {
							sHomeExt = ' ' + i18n.rwl.EXTENSION + ' ' + sHomeExt;
						}
						$innerHtml.append($('<div class="ptPhoneNum"><span class="phoneDispText">' + i18n.rwl.HOMEPHONE + '</span><span class="phoneNum overflowableText"> ' + sHomePhone + sHomeExt + '</span></div>'));
					}
					if(sMobilePhone.length > 0) {
						if(sMobileExt.length > 0) {
							sMobileExt =  ' ' + i18n.rwl.EXTENSION + ' ' + sMobileExt;
						}
						$innerHtml.append($('<div class="ptPhoneNum"><span class="phoneDispText">' + i18n.rwl.MOBILEPHONE + '</span><span class="phoneNum overflowableText"> ' + sMobilePhone + sMobileExt + '</span></div>'));
					}
					if(sWorkPhone.length > 0) {
						if(sWorkExt.length > 0) {
							sWorkExt =  ' ' + i18n.rwl.EXTENSION + ' ' + sWorkExt;
						}
						$innerHtml.append($('<div class="ptPhoneNum"><span class="phoneDispText">' + i18n.rwl.WORKPHONE + '</span><span class="phoneNum overflowableText"> ' + sWorkPhone + sWorkExt + '</span></div>'));
					}
				}
				var sImgPath = oController.staticContentPath + '/images/5104_16.png';
				var iNoteTypePrefVal = oController.getBedrockPrefs().GENERATE_COMMUNICATION.PHONE_NOTE_TYPE;
				var $noteTypeContainer = $('');
				if(iNoteTypePrefVal === 0) {
				 $noteTypeContainer = $('<div class="popoverNoteTypeMsg">' + 
				                          '<img src="' + sImgPath + '"/>' + 
				                          '<span> ' + i18n.rwl.NOTETYPENOTCONFIGURED + '</span>' +
				                        '</div>');
				}  
				
				$innerHtml.append($noteTypeContainer);
				
				var oCancelBtn = new DWL_Utils.Button('ptPhoneCancel',['popOverBtn'], i18n.rwl.CANCEL, false);
				var oSaveBtn = new DWL_Utils.Button('ptPhoneSave',['popOverBtn'], i18n.rwl.SAVE, true);
				$footer.append($innerHtml,oCancelBtn.fnInit().getButton(),oSaveBtn.fnInit().getButton())
				       .appendTo($target);
				$target = null;
			};
		}
		function Body(sId, sParentId, oPatientData, aCssArr) {
			this.fnRender = function() {
				var $body = $('<div/>').attr('id', sId);
				var $target = DWL_Utils.isNullOrUndefined(sParentId) ? $('body') : $('#'+sParentId);
				var aPendingCalls = oPatientData.aPendingCalls || [];
				var aCompletedCalls = oPatientData.aCompletedCalls || [];
				var $commentsHeader = $('<div class="popoverHeader"><span>' + i18n.rwl.COMMENTS + '</span></div>');
				var iMaxNumRows = 3;
				var iMinNumRows = 1;
				var sCommentsBoxRows = oProps.bShowFull === true ? iMaxNumRows : iMinNumRows;
				var $textareaContainer = $('<div id = "textareaDiv"><textarea id="commentsBox" rows="' + sCommentsBoxRows + '" cols="35" class="popoverTextarea" /></div>');
				
				if(DWL_Utils.isNullOrUndefined(aCssArr) === false && aCssArr.length > 0) {
					$body.addClass(aCssArr.join(' '));
				}
				
				for(var p = 0, plen = aPendingCalls.length; p < plen; p++) {
					fnDrawPhoneCallSection(aPendingCalls[p], '', $body);
				}
				for(var c = 0, clen = aCompletedCalls.length; c < clen; c++) {
					fnDrawPhoneCallSection(aCompletedCalls[c], 'completedCall', $body);
				}
				
				$body.find('label').addClass('overflowableText').end().appendTo($target);
				$commentsHeader.add($textareaContainer).appendTo($target);
    
				$target = null;
			};
			function fnDrawPhoneCallSection(oPhoneCallData, sCssClass, $parent) {
				var sDivId = 'call' + oPhoneCallData.COMM_PATIENT_ID;	
				var sDateDisp = DWL_Utils.fnGetDateDisplay(oPhoneCallData.COMM_STATUS_DT_TM, iUTCOn);
				var $phoneCall = $('<div class="popoverCall" id="' + sDivId + '">').addClass(sCssClass); 
				var oCheckbox = new DWL_Utils.Checkbox('check' + sDivId, ['popoverCallCheck'], null, oPhoneCallData.COMM_PATIENT_ID, oPhoneCallData.COMM_SUBJECT_TEXT);
				var $updatedHtml = '<div class="updateInfo"><span class="overflowableText prsnlName">' + oPhoneCallData.COMM_PRSNL_NAME + '</span>' +
							'<span class="overflowableText updateTime">' + sDateDisp + '</span></div>';
				
				oCheckbox.init();
				if($phoneCall.hasClass('completedCall') === true) {
					oCheckbox.getCheckbox().prop({
						disabled: true,
						checked: true
					});
				}
				$phoneCall.append(oCheckbox.getCheckbox().parent(), $updatedHtml).appendTo($parent);
				
				$phoneCall = null;
				oCheckbox = null;
			}
		}
	}
	
	global.DWL_Utils = global.DWL_Utils || {};
	global.DWL_Utils.Component = global.DWL_Utils.Component || {};
	global.DWL_Utils.Component.Popover = Popover;
}.call(this));

(function() {
	'use strict';
	var oGlobal = this;
	function OverlayingPopover(oProps) {
		var underlyingPopoverProps = $.extend({}, oProps.oPopover, {
				sParentId: oProps.oOverlay.sId
			});
		var oSelf = this,
			oPopover = new DWL_Utils.Component.Popover(underlyingPopoverProps)
				.fnOnRemoval(function() {
					$overlay.remove();
				}),
			$overlay = $();
		return $.extend(oSelf, {
			fnRender: function() {
				$overlay = $('<div></div>', {
				attr: {
						id: oProps.oOverlay.sId
					},
					addClass: oProps.oOverlay.sClasses
				}).appendTo('body');
				oPopover.fnRender();
				return oSelf;
			},
			fnOnRemoval: oPopover.fnOnRemoval,
			fnGetUnderlyingPopoverElement: oPopover.fnGetPopover,
			fnRemove: function() {
				oPopover.fnRemove();
				return oSelf;
			}
		});
	}
	oGlobal.DWL_Utils = oGlobal.DWL_Utils || {};
	oGlobal.DWL_Utils.Component = oGlobal.DWL_Utils.Component || {};
	oGlobal.DWL_Utils.Component.OverlayingPopover = OverlayingPopover;
}.call(this));