(function(){function amrDispenseQuantityTable(it
/**/) {
var out='<div class="amr2-hover-container" id="'+(it.tableId)+'"> <div class="amr2-hover-header"> <span>'+(it.quantity)+' '+(it.unit)+'</span> </div> <div class="amr2-hover-content"> <span class="amr2-hover-input"> <input type="text" class="amr2-qty-txt" id="tb'+(it.tableId)+'" value="'+(it.quantity)+'" tabindex="'+(it.tabIndex)+'"/> </span> <span>'+(it.unit)+'</span> </div></div>';return out;
}var itself=amrDispenseQuantityTable, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['amrDispenseQuantityTable']=itself;}}());(function(){function amrDocumentNote(it
/**/) {
var out='<div> ';var arr1=it;if(arr1){var orderGroup,i1=-1,l1=arr1.length-1;while(i1<l1){orderGroup=arr1[i1+=1];out+=' <div> <span>'+(orderGroup.title)+'</span> ';var arr2=orderGroup.orders;if(arr2){var order,i2=-1,l2=arr2.length-1;while(i2<l2){order=arr2[i2+=1];out+=' <div> <span>'+(order.name)+' '+(order.detail)+'</span> </div> ';} } out+=' </div> <br/> ';} } out+='</div>';return out;
}var itself=amrDocumentNote, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['amrDocumentNote']=itself;}}());(function(){function amrOrderDetailEditView(it) {
var out='<div class=\'top-details\'> <table> <tr class=\'detail-labels\'> <td>Dose</td> <td>Route of Administration</td> <td>Frequency</td> <td>Duration</td> </tr> <tr class=\'detail-values\'> <td>'+(it.DETQUAL[0].OE_FIELD_DISPLAY_VALUE)+' &nbsp; '+(it.DETQUAL[1].OE_FIELD_DISPLAY_VALUE)+'</td> <td>'+(it.DETQUAL[2].OE_FIELD_DISPLAY_VALUE)+'</td> <td>'+(it.DETQUAL[3].OE_FIELD_DISPLAY_VALUE)+'</td> <td style=\'padding:0px;\'><input type="text" style="width:99.99%;height:100%;" disabled=true/></td> </tr> </table></div><div class=\'other-details\'> <div class="column-details"> <table> <!-- PRN --> <tr><td class=\'detail-label\'>'+(it.DETQUAL[4].DESCRIPTION)+':&nbsp;</td><td class=\'detail-text\'><select><option>Yes</option><option>No</option></select></td></tr> <!-- Dispense Quantity --> <tr><td class=\'detail-label\'>'+(it.DETQUAL[5].DESCRIPTION)+':&nbsp;</td><td class=\'detail-text\'><input type=\'text\' value=\''+(it.DETQUAL[5].OE_FIELD_DISPLAY_VALUE)+'\'/></td></tr> <!-- Dispense Quantity Unit--> <tr><td class=\'detail-label\'>'+(it.DETQUAL[6].DESCRIPTION)+':&nbsp;</td><td class=\'detail-text\'><select><option>tabs</option><option>caps</option></select></td></tr> </table> </div> <div class="column-details"> <table> <!-- Requested Start date/time --> <tr><td class=\'detail-label\'>'+(it.DETQUAL[9].DESCRIPTION)+':&nbsp;</td><td class=\'detail-text\'><input type=\'text\' disabled=true value=\''+(it.DETQUAL[9].OE_FIELD_DISPLAY_VALUE)+'\'/></td></tr> <!-- Stop type --> <tr><td class=\'detail-label\'>'+(it.DETQUAL[11].DESCRIPTION)+':&nbsp;</td><td class=\'detail-text\'><select><option>Soft Stop</option><option>Hard Stop</option><option>Physician Stop</option></select></td></tr> </table> </div></div>';return out;
}var itself=amrOrderDetailEditView;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['amrOrderDetailEditView']=itself;}}());(function(){function amrOrderSentencesList(it
/**/) {
var out='';if(it.SNTCNT > 0){out+='<span>'+(i18n.innov.ambmedsrec_o2.ORDER_SENTENCES)+' :&nbsp;</span><select><option value="0">'+(i18n.innov.ambmedsrec_o2.SELECT_ORDER_SENTENCE)+'</option><option value="0">'+(i18n.innov.ambmedsrec_o2.NONE)+'</option>';var arr1=it.SNTS;if(arr1){var orderSentence,i1=-1,l1=arr1.length-1;while(i1<l1){orderSentence=arr1[i1+=1];out+='<option value="'+(orderSentence.SENTENCE_ID)+'" oe_format_id="'+(orderSentence.OE_FORMAT_ID)+'">'+(orderSentence.SENTENCE_DISP)+'</option>';} } out+='<select>';}else{out+='<span>'+(i18n.innov.ambmedsrec_o2.NO_ORDER_SENTENCES_FOUND)+'</span>';}out+='<div class=\'amr2-oe-sent-detail-container\'></div>';return out;
}var itself=amrOrderSentencesList, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['amrOrderSentencesList']=itself;}}());(function(){function amrOrderDisplay(it
/**/) {
var out='<dl class="amr2-info"><dd><input type="checkbox" checked="checked" class="order" /></dd><dd class="amr2-name"><span class="clinical-name">'+(order.ORDER_NAME)+'</span><span class="amr2-print-detail-line">'+(order.ORDER_DETAIL_LINE)+'</span></dd></dl>';return out;
}function amrPrintSetup(it
/**/) {
var out='<div class="amr2-preview-body"><div class="amr2-final-meds-list"><input type="checkbox" checked="checked" class="group" /><span class="amr2-group-heading">'+(i18n.innov.ambmedsrec_o2.CURRENT_MEDS)+'</span><div class="dl-container">';var arr1=it.NEW;if(arr1){var order,i1=-1,l1=arr1.length-1;while(i1<l1){order=arr1[i1+=1];out+='<dl class="amr2-info"><dd><input type="checkbox" checked="checked" class="order" /></dd><dd class="amr2-name"><span class="clinical-name">'+(order.ORDER_NAME)+'</span><span class="amr2-print-detail-line">'+(order.ORDER_DETAIL_LINE)+'</span></dd></dl>';} } var arr2=it.CONTINUE;if(arr2){var order,i2=-1,l2=arr2.length-1;while(i2<l2){order=arr2[i2+=1];out+='<dl class="amr2-info"><dd><input type="checkbox" checked="checked" class="order" /></dd><dd class="amr2-name"><span class="clinical-name">'+(order.ORDER_NAME)+'</span><span class="amr2-print-detail-line">'+(order.ORDER_DETAIL_LINE)+'</span></dd></dl>';} } var arr3=it.CONTINUE_WITH_CHANGES;if(arr3){var change,i3=-1,l3=arr3.length-1;while(i3<l3){change=arr3[i3+=1];var arr4=change.CURRENT;if(arr4){var order,i4=-1,l4=arr4.length-1;while(i4<l4){order=arr4[i4+=1];out+='<dl class="amr2-info"><dd><input type="checkbox" checked="checked" class="order" /></dd><dd class="amr2-name"><span class="clinical-name">'+(order.ORDER_NAME)+'</span><span class="amr2-print-detail-line">'+(order.ORDER_DETAIL_LINE)+'</span></dd></dl>';} } } } out+='</div><br/></div><div class="amr2-simple-meds-list">';if(it.NEW.length > 0){out+='<div><input type="checkbox" checked="checked" class="group" /><span class="amr2-group-heading">'+(i18n.innov.ambmedsrec_o2.NEW_MEDS)+'</span><div class="dl-container">';var arr5=it.NEW;if(arr5){var order,i5=-1,l5=arr5.length-1;while(i5<l5){order=arr5[i5+=1];out+='<dl class="amr2-info"><dd><input type="checkbox" checked="checked" class="order" /></dd><dd class="amr2-name"><span class="clinical-name">'+(order.ORDER_NAME)+'</span><span class="amr2-print-detail-line">'+(order.ORDER_DETAIL_LINE)+'</span></dd></dl>';} } out+='</div><br/></div>';}if(it.CONTINUE.length > 0){out+='<div><input type="checkbox" checked="checked" class="group" /><span class="amr2-group-heading">'+(i18n.innov.ambmedsrec_o2.UNCHANGED_MEDS)+'</span><div class="dl-container">';var arr6=it.CONTINUE;if(arr6){var order,i6=-1,l6=arr6.length-1;while(i6<l6){order=arr6[i6+=1];out+='<dl class="amr2-info"><dd><input type="checkbox" checked="checked" class="order" /></dd><dd class="amr2-name"><span class="clinical-name">'+(order.ORDER_NAME)+'</span><span class="amr2-print-detail-line">'+(order.ORDER_DETAIL_LINE)+'</span></dd></dl>';} } out+='</div><br/></div>';}if(it.CONTINUE_WITH_CHANGES.length > 0){out+='<div><input type="checkbox" checked="checked" class="group" /><span class="amr2-group-heading">'+(i18n.innov.ambmedsrec_o2.CHANGED_MEDS)+'</span><div class="dl-container">';var arr7=it.CONTINUE_WITH_CHANGES;if(arr7){var change,i7=-1,l7=arr7.length-1;while(i7<l7){change=arr7[i7+=1];var arr8=change.CURRENT;if(arr8){var order,i8=-1,l8=arr8.length-1;while(i8<l8){order=arr8[i8+=1];out+='<dl class="amr2-info"><dd><input type="checkbox" checked="checked" class="order" /></dd><dd class="amr2-name"><span class="clinical-name">'+(order.ORDER_NAME)+'</span><span class="amr2-print-detail-line">'+(order.ORDER_DETAIL_LINE)+'</span></dd></dl>';} } } } out+='</div><br/></div>';}if(it.DISCONTINUED.length > 0){out+='<div><input type="checkbox" checked="checked" class="group" /><span class="amr2-group-heading">'+(i18n.innov.ambmedsrec_o2.STOPPED_MEDS)+'</span><div class="dl-container">';var arr9=it.DISCONTINUED;if(arr9){var order,i9=-1,l9=arr9.length-1;while(i9<l9){order=arr9[i9+=1];out+='<dl class="amr2-info"><dd><input type="checkbox" checked="checked" class="order" /></dd><dd class="amr2-name"><span class="clinical-name">'+(order.ORDER_NAME)+'</span><span class="amr2-print-detail-line">'+(order.ORDER_DETAIL_LINE)+'</span></dd></dl>';} } out+='</div><br/></div>';}out+='</div></div>';return out;
}var itself=amrPrintSetup, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.amrOrderDisplay=amrOrderDisplay;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['amrPrintSetup']=itself;}}());(function(){function amrPrintSetupContainer(it
/**/) {
var out='<div class="amr2-modal-shade"></div><div class="amr2-modal-container"><div class="amr2-print-preview-container"><div class="amr2-heading">'+(i18n.innov.ambmedsrec_o2.MEDS_LIST)+'<br/><hr/></div><div class="amr2-nav-buttons"><div><span id="amr2-final-meds-list-select-'+(it.componentId)+'" class="amr2-print-unselected">'+(i18n.innov.ambmedsrec_o2.FINAL_MEDS_LIST)+'</span><span> / </span><span id="amr2-simple-meds-list-select-'+(it.componentId)+'">'+(i18n.innov.ambmedsrec_o2.SIMPLIFIED_MEDS_LIST)+'</span></div><div><input type="button" value="'+(i18n.innov.ambmedsrec_o2.CREATE)+'" id="create'+(it.componentId)+'" style="display:none;" /><input type="button" value="'+(i18n.innov.ambmedsrec_o2.PRINT_PREVIEW)+'" id="print-preview'+(it.componentId)+'" /><input type="button" value="'+(i18n.innov.ambmedsrec_o2.CANCEL)+'" id="cancel'+(it.componentId)+'" /></div></div><div id="patient-banner">'+(it.demobanner)+'</div><br/></div></div>';return out;
}var itself=amrPrintSetupContainer, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['amrPrintSetupContainer']=itself;}}());(function(){function amrReconciliationStatusBar(it
/**/) {
var out='<div class=\'amr2-status-container\' id=\'medStatusContainer'+(it.componentId)+'\'> <dl class=\'amr2-status\'> <dd>'+(i18n.innov.ambmedsrec_o2.STATUS)+':</dd> </dl> <!-- Medication History status --> <h3 class=\'info-hd\'>'+(i18n.innov.ambmedsrec_o2.STATUS)+'</h3> <dl class=\'amr2-status result-info\'> <dd class=\'amr2-status-img '+(it.history.css)+'\'>&nbsp;</dd> <dd><a id=\'medsHistory'+(it.componentId)+'\'>'+(i18n.innov.ambmedsrec_o2.MEDS_HISTORY)+'</a></dd> </dl> <div class=\'result-details hover\'> <h4 class=\'det-hd\'><span>'+(i18n.innov.ambmedsrec_o2.STATUS)+'</span></h4> <dl class=\'amr2-det\'> <dt><span>'+(i18n.innov.ambmedsrec_o2.STATUS)+'</span></dt> <dd><span>'+(it.history.status)+'</span></dd> <dt><span>'+(i18n.innov.ambmedsrec_o2.LAST_DOCUMENTED)+'</span></dt> <dd><span>'+(it.history.performedDate)+'</span></dd> <dt><span>'+(i18n.innov.ambmedsrec_o2.LAST_DOC_BY)+'</span></dt> <dd><span>'+(it.history.performedBy)+'</span></dd> </dl> </div> <!-- Discharge Reconciliation status --> <h3 class=\'info-hd\'>'+(i18n.innov.ambmedsrec_o2.STATUS)+'</h3> <dl class=\'amr2-status result-info\'> <dd class=\'amr2-status-img '+(it.discharge.css)+'\'>&nbsp;</dd> <dd> <a id=\'medRecDischarge'+(it.componentId)+'\'> ';if(it.encounter.type_mean === "OUTPATIENT"){out+=' '+(i18n.innov.ambmedsrec_o2.OUTPATIENT_MEDREC)+' ';}else{out+=' '+(i18n.innov.ambmedsrec_o2.DISCHARGE_MEDREC)+' ';}out+=' </a> </dd> </dl> <div class=\'result-details hover\'> <h4 class=\'det-hd\'><span>'+(i18n.innov.ambmedsrec_o2.STATUS)+'</span></h4> <dl class=\'amr2-det\'> <dt><span>'+(i18n.innov.ambmedsrec_o2.STATUS)+'</span></dt> <dd><span>'+(it.discharge.status)+' </span></dd> <dt><span>'+(i18n.innov.ambmedsrec_o2.LAST_RECON)+'</span></dt> <dd><span>'+(it.discharge.performedDate)+'></span></dd> <dt><span>'+(i18n.innov.ambmedsrec_o2.LAST_RECON_BY)+'</span></dt> <dd><span>'+(it.discharge.performedBy)+' </span></dd> </dl> </div></div>';return out;
}var itself=amrReconciliationStatusBar, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['amrReconciliationStatusBar']=itself;}}());(function(){function amrRefillTable(it
/**/) {
var out='<div class="amr2-hover-container" id="'+(it.tableId)+'"> <div class="amr2-hover-header"> <span>'+(it.refillsDisplay)+'</span> </div> <div class="amr2-hover-content"> <span class="amr2-hover-input"> <input type="text" class="amr2-qty-txt" id="tb'+(it.tableId)+'" value="'+(it.quantity)+'" tabindex="'+(it.tabIndex)+'"/> </span> <span>'+(i18n.innov.ambmedsrec_o2.REFILLS)+'</span> <div> <span class="amr2-hover-input"> <input type="checkbox" class="amr2-rfl-all" id="rflAll'+(it.medCompId)+'" value="'+(i18n.innov.ambmedsrec_o2.MED_APPLY_TO_ALL)+'" /> </span> <span>'+(i18n.innov.ambmedsrec_o2.MED_APPLY_TO_ALL)+'</span> </div> </div></div>';return out;
}var itself=amrRefillTable, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['amrRefillTable']=itself;}}());(function(){function EnhancedOrderDetailRow(it
/**/) {
var out='<span class=\'oe-edit-en-other-details-wrapper\'> <span class=\'oe-edit-en-detail-label '+(CUR_DETAIL.ACCEPT_CLASS)+'\' label-oe-field-meaning=\''+(CUR_DETAIL.OE_FIELD_MEANING)+'\'> '+(CUR_DETAIL.DESCRIPTION);if(CUR_DETAIL.ACCEPT_CLASS === 'oe-format-required'){out+='*';}out+=':&nbsp; </span> <span class=\'oe-edit-en-detail-text\' oe-field-meaning=\''+(CUR_DETAIL.OE_FIELD_MEANING)+'\' view-type="EMBEDDED"> <!-- Alpha, Integer, Decimal -->     ';if(CUR_DETAIL.FIELD_TYPE_FLAG === 0 || CUR_DETAIL.FIELD_TYPE_FLAG === 1 || CUR_DETAIL.FIELD_TYPE_FLAG === 2){out+='         <input tabIndex=\''+(CUR_DETAIL.TAB_INDEX)+'\' ';if(CUR_DETAIL.ACCEPT_FLAG === 3){out+='disabled=true';}out+=' class=\'oe-detail-display oe-edit-value\' type=\'text\' value=\''+(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE)+'\'/>     <!-- Codeset -->     ';}else if(CUR_DETAIL.FIELD_TYPE_FLAG === 6){out+='         <select tabIndex=\''+(CUR_DETAIL.TAB_INDEX)+'\' ';if(CUR_DETAIL.ACCEPT_FLAG === 3){out+='disabled=true';}out+=' class=\'oe-detail-display oe-edit-value\'> <option>'+(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE)+'</option> <option>Loading .... </option> </select>     <!-- Yes/No -->     ';}else if(CUR_DETAIL.FIELD_TYPE_FLAG === 7){out+='         <select tabIndex=\''+(CUR_DETAIL.TAB_INDEX)+'\' ';if(CUR_DETAIL.ACCEPT_FLAG === 3){out+='disabled=true';}out+='  class=\'oe-detail-display oe-edit-value\'> <option>'+(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE)+'</option> <option>Loading .... </option> </select>     <!-- Everything else disabled -->     ';}else{out+='         <input tabIndex=\''+(CUR_DETAIL.TAB_INDEX)+'\' ';if(CUR_DETAIL.ACCEPT_FLAG === 3){out+='disabled=true';}out+='  class=\'oe-detail-display oe-edit-value\' type=\'text\' disabled=true value=\''+(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE)+'\'/>     ';}out+=' </span> </span>';return out;
}function OrderDetailEditEnhancedView(it
/**/) {
var out='<div class=\'oe-edit-en-top-details\'> <table class=\'oe-edit-details-table\'> <tr class=\'oe-edit-en-detail-labels\'> <td class="oe-format-required"> <span label-oe-field-meaning="oe-dose-virtual-field"> Dose * </span> </td> ';var arr1=it.TOP_DETAILS;if(arr1){var CUR_DETAIL,i1=-1,l1=arr1.length-1;while(i1<l1){CUR_DETAIL=arr1[i1+=1];out+=' <td class=\''+(CUR_DETAIL.ACCEPT_CLASS)+'\'> <span label-oe-field-meaning=\''+(CUR_DETAIL.OE_FIELD_MEANING)+'\'> '+(CUR_DETAIL.DESCRIPTION);if(CUR_DETAIL.ACCEPT_CLASS == 'oe-format-required'){out+='*';}out+=' </span> </td> ';} } out+=' </tr> <tr class=\'oe-edit-en-detail-values\'> <td> <span class="oe-detail oe-format-required" oe-field-meaning="oe-dose-virtual-field"> <input class="oe-dose-virtual-field" type="text" tabIndex="99" /> </span> </td> ';var arr2=it.TOP_DETAILS;if(arr2){var CUR_DETAIL,i2=-1,l2=arr2.length-1;while(i2<l2){CUR_DETAIL=arr2[i2+=1];out+=' <td ';if(CUR_DETAIL.ACCEPT_FLAG === 3){out+='class=\'oe-edit-en-disabled-detail\'';}out+='> <span class=\'oe-detail '+(CUR_DETAIL.ACCEPT_CLASS)+'\' oe-field-meaning=\''+(CUR_DETAIL.OE_FIELD_MEANING)+'\' view-type="DEFAULT"> <span class=\'oe-detail-display\' tabIndex=\''+(CUR_DETAIL.TAB_INDEX)+'\'> ';if(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE > " "){out+=' '+(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE)+' ';}else{out+=' &lt;'+(CUR_DETAIL.DESCRIPTION)+'&gt; ';}out+=' </span> </span> </td> ';} } out+=' </tr> </table></div>';if(it.OTHER_DETAILS.length > 0){out+=' <div class=\'oe-edit-en-other-details\'> <div class=\'oe-edit-en-column-details\'> ';var arr3=it.OTHER_DETAILS;if(arr3){var CUR_DETAIL,i3=-1,l3=arr3.length-1;while(i3<l3){CUR_DETAIL=arr3[i3+=1];out+=' <span class=\'oe-edit-en-other-details-wrapper\'> <span class=\'oe-edit-en-detail-label '+(CUR_DETAIL.ACCEPT_CLASS)+'\' label-oe-field-meaning=\''+(CUR_DETAIL.OE_FIELD_MEANING)+'\'> '+(CUR_DETAIL.DESCRIPTION);if(CUR_DETAIL.ACCEPT_CLASS === 'oe-format-required'){out+='*';}out+=':&nbsp; </span> <span class=\'oe-edit-en-detail-text\' oe-field-meaning=\''+(CUR_DETAIL.OE_FIELD_MEANING)+'\' view-type="EMBEDDED"> <!-- Alpha, Integer, Decimal -->     ';if(CUR_DETAIL.FIELD_TYPE_FLAG === 0 || CUR_DETAIL.FIELD_TYPE_FLAG === 1 || CUR_DETAIL.FIELD_TYPE_FLAG === 2){out+='         <input tabIndex=\''+(CUR_DETAIL.TAB_INDEX)+'\' ';if(CUR_DETAIL.ACCEPT_FLAG === 3){out+='disabled=true';}out+=' class=\'oe-detail-display oe-edit-value\' type=\'text\' value=\''+(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE)+'\'/>     <!-- Codeset -->     ';}else if(CUR_DETAIL.FIELD_TYPE_FLAG === 6){out+='         <select tabIndex=\''+(CUR_DETAIL.TAB_INDEX)+'\' ';if(CUR_DETAIL.ACCEPT_FLAG === 3){out+='disabled=true';}out+=' class=\'oe-detail-display oe-edit-value\'> <option>'+(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE)+'</option> <option>Loading .... </option> </select>     <!-- Yes/No -->     ';}else if(CUR_DETAIL.FIELD_TYPE_FLAG === 7){out+='         <select tabIndex=\''+(CUR_DETAIL.TAB_INDEX)+'\' ';if(CUR_DETAIL.ACCEPT_FLAG === 3){out+='disabled=true';}out+='  class=\'oe-detail-display oe-edit-value\'> <option>'+(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE)+'</option> <option>Loading .... </option> </select>     <!-- Everything else disabled -->     ';}else{out+='         <input tabIndex=\''+(CUR_DETAIL.TAB_INDEX)+'\' ';if(CUR_DETAIL.ACCEPT_FLAG === 3){out+='disabled=true';}out+='  class=\'oe-detail-display oe-edit-value\' type=\'text\' disabled=true value=\''+(CUR_DETAIL.OE_FIELD_DISPLAY_VALUE)+'\'/>     ';}out+=' </span> </span> ';} } out+=' </div> </div>';}return out;
}var itself=OrderDetailEditEnhancedView, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.EnhancedOrderDetailRow=EnhancedOrderDetailRow;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['OrderDetailEditEnhancedView']=itself;}}());(function(){function modifyOrderDetails(it
/**/) {
var out='<Order id="'+(it.ORDER_ID)+'"><OrderableTypeFlag type="short">'+(it.ORDERABLE_TYPE_FLAG)+'</OrderableTypeFlag><OrderId type="double">'+(it.ORDER_ID)+'</OrderId><LastUpdtCnt type="short">'+(it.LAST_UPDT_CNT)+'</LastUpdtCnt><DetailList>';var arr1=it.DETQUAL;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='<'+( value.OE_FIELD_MEANING_ENCODE)+'><FieldValueList><ListValues><FieldValue type="double">'+( value.OE_FIELD_VALUE)+'</FieldValue><FieldDisplayValue type="string">'+( value.OE_FIELD_DISPLAY_VALUE)+'</FieldDisplayValue><FieldDtTmValue type="Calendar">'+( value.OE_FIELD_DT_TM)+'</FieldDtTmValue></ListValues></FieldValueList><OeFieldId type="double">'+( value.OE_FIELD_ID)+'</OeFieldId><OeFieldMeaning type="string">'+( value.OE_FIELD_MEANING)+'</OeFieldMeaning><OeFieldMeaningId type="double">'+( value.OE_FIELD_MEANING_ID)+'</OeFieldMeaningId><GroupSeq type="long">'+( value.GROUP_SEQ)+'</GroupSeq><FieldSeq type="long">'+( value.FIELD_SEQ)+'</FieldSeq><ModifiedInd type="short">1</ModifiedInd></'+( value.OE_FIELD_MEANING_ENCODE)+'>';} } out+='<DetailListCount type="int">'+( it.DETQUAL_CNT)+'</DetailListCount></DetailList></Order>';return out;
}var itself=modifyOrderDetails, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['modifyOrderDetails']=itself;}}());(function(){function modifyOrders(it
/**/) {
var out='<?xml version="1.0" encoding="UTF-8" ?><?xml-stylesheet type=\'text/xml\' href=\'dom.xsl\'?><Orders><OrderVersion>1</OrderVersion>'+(it.ORDERS_XML)+'</Orders>';return out;
}var itself=modifyOrders, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['modifyOrders']=itself;}}());function DoseVirtualField(strengthDoseDetails, volumeDoseDetails, freetextDoseDetails, $fieldElement) {
    this.strength_dose_ind = 0;
    this.volume_dose_ind = 0;
    this.freetext_dose_ind = 0;
    this.strength_dose_details = strengthDoseDetails || [];
    this.volume_dose_details = volumeDoseDetails || [];
    this.freetext_dose_details = freetextDoseDetails || [];
    this.pendingDetails = "";

    if (strengthDoseDetails && this.verifyStrengthDoseDetails(strengthDoseDetails)) {
        this.strength_dose_ind = 1;
        this.strength_dose_details = strengthDoseDetails;
        $fieldElement.val(this.buildDoseDisplay(this.strength_dose_details));
    } else if (volumeDoseDetails && this.verifyVolumeDoseDetails(volumeDoseDetails)) {
        this.volume_dose_ind = 1;
        this.volume_dose_details = volumeDoseDetails;
        $fieldElement.val(this.buildDoseDisplay(this.volume_dose_details));
    } else if (freetextDoseDetails && this.verifyFreetextDoseDetails(freetextDoseDetails)) {
        this.freetext_dose_ind = 1;
        this.freetext_dose_details = freetextDoseDetails;
        $fieldElement.val(this.buildDoseDisplay(this.freetext_dose_details));
    }

    var virtualField = this;
    $fieldElement.on("blur", function (event) {
        virtualField.parseDoseInput($fieldElement.val());
        virtualField.pendingDetails = "";
        event.stopPropagation();
        event.preventDefault();
    });

    $fieldElement.on("change", function (event) {
        virtualField.pendingDetails = $fieldElement.val();
    });
}

DoseVirtualField.prototype.buildDoseDisplay = function (details) {
    var display = "";
    for (var i = 0; i < details.length; i++) {
        display += details[i].getAttribute("OE_FIELD_DISPLAY_VALUE") + " ";
    }

    return display.trim();
};

DoseVirtualField.prototype.verifyStrengthDoseDetails = function (details) {
    var hasDose = false,
        hasUnit = false,
        index;

    for (index = details.length; index--; ) {
        if (!details[index]) {
            return false;
        }

        if (details[index].getAttribute("OE_FIELD_MEANING") === "STRENGTHDOSE") {
            hasDose = details[index].getAttribute("OE_FIELD_DISPLAY_VALUE").length > 0 ? true : false;
        } else if (details[index].getAttribute("OE_FIELD_MEANING") === "STRENGTHDOSEUNIT") {
            hasUnit = details[index].getAttribute("OE_FIELD_DISPLAY_VALUE").length > 0 ? true : false;
        }
    }

    return hasDose && hasUnit;
};

DoseVirtualField.prototype.verifyVolumeDoseDetails = function (details) {
    var hasDose = false,
        hasUnit = false,
        index;

    for (index = details.length; index--; ) {
        if (!details[index]) {
            return false;
        }

        if (details[index].getAttribute("OE_FIELD_MEANING") === "VOLUMEDOSE") {
            hasDose = details[index].getAttribute("OE_FIELD_DISPLAY_VALUE").length > 0 ? true : false;
        } else if (details[index].getAttribute("OE_FIELD_MEANING") === "VOLUMEDOSEUNIT") {
            hasUnit = details[index].getAttribute("OE_FIELD_DISPLAY_VALUE").length > 0 ? true : false;
        }
    }

    return hasDose && hasUnit;
};

DoseVirtualField.prototype.verifyFreetextDoseDetails = function (details) {
    var hasDose = false,
        index;

    for (index = details.length; index--; ) {
        if (!details[index]) {
            return false;
        }

        if (details[index].getAttribute("OE_FIELD_MEANING") === "FREETXTDOSE") {
            hasDose = details[index].getAttribute("OE_FIELD_DISPLAY_VALUE").length > 0 ? true : false;
        }
    }

    return hasDose;
};

DoseVirtualField.prototype.getOrderEntryDetails = function () {
    if (this.pendingDetails.length > 0) {
        this.parseDoseInput(this.pendingDetails);
        this.pendingDetails = "";
    }

    if (this.strength_dose_ind) {
        this.clearVolumeDetails();
        return this.strength_dose_details.concat(this.volume_dose_details);
    } else if (this.volume_dose_ind) {
        this.clearStrengthDetails();
        return this.strength_dose_details.concat(this.volume_dose_details);
    } else if (this.freetext_dose_ind) {
        this.clearStrengthDetails();
        this.clearVolumeDetails();
        return this.strength_dose_details.concat(this.volume_dose_details.concat(this.freetext_dose_details));
    } else {
        return [];
    }
};

DoseVirtualField.prototype.clearStrengthDetails = function () {
    if (this.strength_dose_details[0] != undefined && this.strength_dose_details[1] != undefined) {
        this.strength_dose_details[0].setAttribute("OE_FIELD_DISPLAY_VALUE", "");
        this.strength_dose_details[0].setAttribute("OE_FIELD_VALUE", 0);
        this.strength_dose_details[0].setChanged(true);
        this.strength_dose_details[1].setAttribute("OE_FIELD_DISPLAY_VALUE", "");
        this.strength_dose_details[1].setAttribute("OE_FIELD_VALUE", 0);
        this.strength_dose_details[1].setChanged(true);
    }
};

DoseVirtualField.prototype.clearVolumeDetails = function () {
    if (this.volume_dose_details[0] != undefined && this.volume_dose_details[1] != undefined) {
        this.volume_dose_details[0].setAttribute("OE_FIELD_DISPLAY_VALUE", "");
        this.volume_dose_details[0].setAttribute("OE_FIELD_VALUE", 0);
        this.volume_dose_details[0].setChanged(true);
        this.volume_dose_details[1].setAttribute("OE_FIELD_DISPLAY_VALUE", "");
        this.volume_dose_details[1].setAttribute("OE_FIELD_VALUE", "");
        this.volume_dose_details[1].setChanged(true);
    }
};

DoseVirtualField.prototype.parseDoseInput = function (value) {
    var doseInput = value.split(" ");
    var self = this;

    if (doseInput.length != 2) {
        self.setFreeTextDetails(doseInput.join(" "));
    } else {
        if (this.strength_dose_details[0] != undefined && this.strength_dose_details[1] != undefined) {
            this.checkStrengthDoseUnit(doseInput);
        } else {
            this.checkVolumeDoseUnit(doseInput);
        }
    }
};

DoseVirtualField.prototype.checkStrengthDoseUnit = function (doseInput) {
    var self = this;
    OrderEntryFields.getOeField(self.strength_dose_details[1], function (strengthUnitEntryDetail) {
        OrderEntryFields.getCodeSet(strengthUnitEntryDetail, 54, function (doseUnit, code, strCodeSet) {
            var strengthDoseUnit = self.checkDoseUnit(doseInput[1], strCodeSet);
            if (strengthDoseUnit) {
                self.setStrengthDetails(doseInput[0], strengthDoseUnit);
            } else {
                self.checkVolumeDoseUnit(doseInput);
            }
        });
    });
};

DoseVirtualField.prototype.checkVolumeDoseUnit = function (doseInput) {
    var self = this;
    if (this.volume_dose_details[0] != undefined && this.volume_dose_details[1] != undefined) {
        OrderEntryFields.getOeField(self.volume_dose_details[1], function (volumeUnitEntryDetails) {
            OrderEntryFields.getCodeSet(volumeUnitEntryDetails, 54, function (doseUnit, code, volCodeSet) {
                var volumeDoseUnit = self.checkDoseUnit(doseInput[1], volCodeSet);
                if (volumeDoseUnit) {
                    self.setVolumeDetails(doseInput[0], volumeDoseUnit);
                } else {
                    self.setFreeTextDetails(doseInput.join(" "));
                }
            });
        });
    } else {
        self.setFreeTextDetails(doseInput.join(" "));
    }
};

DoseVirtualField.prototype.checkDoseUnit = function (doseUnit, codeSet) {
    doseUnit = doseUnit || "";
    codeSet = codeSet || [];

    if (doseUnit.length === 0 || codeSet.length === 0) {
        return false;
    }

    doseUnit = doseUnit.toUpperCase().replace("(", "").replace(")", "");
    for (var i = codeSet.length; i--; ) {
        if (doseUnit === codeSet[i].DISPLAY.toUpperCase()) {
            return codeSet[i];
        }
    }

    return false;
};

DoseVirtualField.prototype.resetIndicators = function () {
    this.strength_dose_ind = 0;
    this.volume_dose_ind = 0;
    this.freetext_dose_ind = 0;
};

DoseVirtualField.prototype.setFreeTextDetails = function (freeTextDose) {
    alert("The dose will be treated as a freetext dose.");
    this.resetIndicators();
    this.freetext_dose_ind = 1;
    this.freetext_dose_details[0].setAttribute("OE_FIELD_DISPLAY_VALUE", freeTextDose);
    this.freetext_dose_details[0].setAttribute("OE_FIELD_VALUE", 0);
    this.freetext_dose_details[0].setChanged(true);
};

DoseVirtualField.prototype.setStrengthDetails = function (strengthDose, strengthDoseCode) {
    this.resetIndicators();
    this.strength_dose_ind = 1;
    this.strength_dose_details[0].setAttribute("OE_FIELD_DISPLAY_VALUE", strengthDose);
    this.strength_dose_details[0].setAttribute("OE_FIELD_VALUE", 0);
    this.strength_dose_details[0].setChanged(true);
    this.strength_dose_details[1].setAttribute("OE_FIELD_DISPLAY_VALUE", strengthDoseCode.DISPLAY);
    this.strength_dose_details[1].setAttribute("OE_FIELD_VALUE", strengthDoseCode.CODE);
    this.strength_dose_details[1].setChanged(true);
};

DoseVirtualField.prototype.setVolumeDetails = function (volumeDose, volumeDoseCode) {
    this.resetIndicators();
    this.volume_dose_ind = 1;
    this.volume_dose_details[0].setAttribute("OE_FIELD_DISPLAY_VALUE", volumeDose);
    this.volume_dose_details[0].setAttribute("OE_FIELD_VALUE", 0);
    this.volume_dose_details[0].setChanged(true);
    this.volume_dose_details[1].setAttribute("OE_FIELD_DISPLAY_VALUE", volumeDoseCode.DISPLAY);
    this.volume_dose_details[1].setAttribute("OE_FIELD_VALUE", volumeDoseCode.CODE);
    this.volume_dose_details[1].setChanged(true);
};
/* Modified from Original to:
	- handle numeric pad decimal
	- handle numeric pad negative
*/
var InputFieldValidation = (function () {
	function getCaretPosition(ctrl) {
		var CaretPos = 0; // IE Support
		if (document.selection) {
			ctrl.focus();
			var Sel = document.selection.createRange();
			Sel.moveStart('character', -ctrl.value.length);
			CaretPos = Sel.text.length;
		}
		// Firefox support
		else if (ctrl.selectionStart || ctrl.selectionStart == '0')
			CaretPos = ctrl.selectionStart;
		return (CaretPos);
	}

	function validateInteger(e) {
		var isInteger = false,
			negativeSignIndex = -1,
			caretPosition = getCaretPosition(this),
			key = e.charCode || e.keyCode || 0;


		negativeSignIndex = $(this).attr("value").indexOf("-");

		// allow backspace, tab, home, end, delete, arrows, first negative sign, ctrl+ (a, c, x, v),numbers and keypad numbers ONLY
		return (
			key === 8 || //backspace
			key === 9 || //tab
			key === 36 || //home
			key === 35 || //end
			key === 46 || //delete
			(key >= 37 && key <= 40) || // arrows
			(key === 189 && negativeSignIndex === -1 && caretPosition === 0) || // negative sign allowed only if it is first and position at beginning
			(
				e.ctrlKey // control +
				&& (
					key === 65 || // a
					key === 67 || // c
					key === 88 || //x
					key === 86 // v
				)
			) ||
			// Keypad number
			(key >= 48 && key <= 57) ||
			(key >= 96 && key <= 105));
	}

	function validateIntegerPaste(e) {
		var clipBoardText = getClipBoardText(),
			isInteger = false;
		if (clipBoardText > " ") {
			isInteger = /^[-+]?[0-9]+$/.test(clipBoardText);
		}
		if (!isInteger) {
			clearClipBoardText();
		}
	}

	function validateDecimal(e) {
		var isInteger = false,
			negativeSignIndex = -1,
			decimalIndex = -1,
			caretPosition = getCaretPosition(this),
			key = e.charCode || e.keyCode || 0;


		negativeSignIndex = $(this).attr("value").indexOf("-");
		decimalIndex = $(this).attr("value").indexOf(".");

		// allow backspace, tab, home, end, delete, arrows, first negative sign, single decmial point and ctrl+ (a, c, x, v),numbers and keypad numbers ONLY
		return (
			key === 8 || //backspace
			key === 9 || //tab
			key === 36 || //home
			key === 35 || //end
			key === 46 || //delete
			(key >= 37 && key <= 40) || // arrows
			((key === 189 || key == 109) && negativeSignIndex === -1 && caretPosition === 0) || // negative sign allowed only if it is first and position at beginning
			((key === 190 || key == 110) && decimalIndex === -1) || // single decmial sign allowed only
			(
				e.ctrlKey // control +
				&& (
					key === 65 || // a
					key === 67 || // c
					key === 88 || //x
					key === 86 // v
				)
			) ||
			// Keypad number
			(key >= 48 && key <= 57) ||
			(key >= 96 && key <= 105));
	}

	function validateDecimalPaste(e) {
		var clipBoardText = getClipBoardText(),
			isInteger = false;
		if (clipBoardText > " ") {
			isInteger = /^[-+]?[0-9]+\.[0-9]+$/.test(clipBoardText);
		}
		if (!isInteger) {
			clearClipBoardText();
		}
	}

	function getClipBoardText() {
		var clipBoardText = "";
		if (window.clipboardData) {
			clipBoardText = window.clipboardData.getData('Text');
		}
		return (clipBoardText);
	}

	function clearClipBoardText() {
		if (window.clipboardData) {
			window.clipboardData.clearData("Text")
		}
	}

	return ({
		"integer": function (inputElement) {
			$(inputElement).keydown(validateInteger);
			$(inputElement).bind('paste', validateIntegerPaste);
		},
		"decimal": function (inputElement) {
			$(inputElement).keydown(validateDecimal);
			$(inputElement).bind('paste', validateDecimalPaste);
		}
	});

})();
/*
 * Filling for Java Script forEach
 */
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun,thisArg)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisArg, t[i], i, t);
    }
  };
}

if (!Function.prototype.method) {
	Function.prototype.method = function(name, func) {
		this.prototype[name] = func;
		return this;
	};
}

if (!Function.prototype.inherits) {
	Function.method('inherits', function(Parent) {
		var d = {}, p = (this.prototype = new Parent());
		this.method('uber', function uber(name) {
			if(!( name in d)) {
				d[name] = 0;
			}
			var f, r, t = d[name], v = Parent.prototype;
			if(t) {
				while(t) {
					v = v.constructor.prototype;
					t -= 1;
				}
				f = v[name];
			} else {
				f = p[name];
				if(f == this[name]) {
					f = v[name];
				}
			}
			d[name] += 1;
			r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
			d[name] -= 1;
			return r;
		});
		return this;
	});
}

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}var OrderDetailsEdit = function () {
	this._editDetailsElement = null;
	this.onCreatedEditView = null;
	this.onFocusIn = null;
	this.onFocusOut = null;
	this.onChangedDetail = null;
	this.virtualFields = [];

	OrderDetailsEdit.method("getElement", function () {
		return (this._editDetailsElement);
	});

	OrderDetailsEdit.method("setAttribute", function (attribute, value) {
		this.attributes[attribute] = value;
		// add attribute to each order entry detail
		var orderEntryDetails = this.orderEntryDetails;
		if (orderEntryDetails != undefined) {
			orderEntryDetails.forEach(function (orderEntryDetail) {
				orderEntryDetail.setParentAttribute(attribute, value);
			});
		}
	});

	OrderDetailsEdit.method("setAttributes", function (attributes) {
		this.attributes = attributes;
		// add attribute to each order entry detail
		var orderEntryDetails = this.orderEntryDetails;
		if (orderEntryDetails != undefined) {
			orderEntryDetails.forEach(function (orderEntryDetail) {
				orderEntryDetail.setParentAttributes(attributes);
			});
		}
	});

	OrderDetailsEdit.method("getAttribute", function (attribute) {
		return (this.attributes[attribute]);
	});

	OrderDetailsEdit.method("getAttributes", function () {
		return (this.attributes);
	});

	OrderDetailsEdit.method("setOrderEntryDetails", function (orderEntryDetails) {
		this.orderEntryDetails = orderEntryDetails;
	});

	OrderDetailsEdit.method("getOrderEntryDetails", function () {
		return this.orderEntryDetails;
	});

	OrderDetailsEdit.method("getVirtualAndOrderEntryDetails", function () {
		var virtualOrderEntryDetails = [];

		if (this.virtualFields.length > 0) {
			this.virtualFields.forEach(function (virtualField) {
				var virtualDetails = virtualField.getOrderEntryDetails();
				if (virtualDetails.length > 0) {
					virtualDetails.forEach(function (virtualDetail) {
						virtualOrderEntryDetails.push(virtualDetail);
					});
				}
			});
		}

		return virtualOrderEntryDetails.concat(this.orderEntryDetails);
	});

	OrderDetailsEdit.method("getOrderEntryDetail", function (attribute, value) {
		var orderEntryDetail = null;
		var orderEntryDetails = this.orderEntryDetails;

		if (attribute > " " && orderEntryDetails) {
			orderEntryDetails.forEach(function (oeDetail, index) {
				if (oeDetail.getAttribute(attribute) === value) {
					orderEntryDetail = oeDetail;
					return;
				}
			});
		}
		return (orderEntryDetail);
	});

	OrderDetailsEdit.method("preProcessDetailsToDisplay", function (oeDetails, currentSequence) {
		var self = this;

		self._editDetailsElement = $("<span></span>");
		var editDetailsElement = self._editDetailsElement;

		/* ACCEPT_FLAG
		0.00	REQUIRED
		1.00	OPTIONAL
		2.00	NO DISPLAY
		3.00	DISPLAY ONLY
		*/

		// Sort Order Entry Details by Group_seq and Field_seq
		oeDetails.sort(self.sortOeDetails);

		var prnOeFields = $.grep(oeDetails, function (oeDetail, index) {
			var isPRN = false,
				isPRNReason = false,
				oeFieldMeaning = oeDetail["OE_FIELD_MEANING"];
			isPRN = (oeFieldMeaning === "SCH/PRN");
			isPRNReason = (oeFieldMeaning === "PRNREASON" || oeFieldMeaning == "PRNINSTRUCTIONS");
			return (isPRN || isPRNReason);
		});
		// If only a single prn field is found, remove it from details since it doesn't qualify'
		if (prnOeFields.length == 1) {
			oeDetails = $(oeDetails).not(prnOeFields).get();
		}

		return oeDetails;
	});
	// Method to build a detail Line
	OrderDetailsEdit.method("buildLine", function (oeDetails, currentSequence) {
		var self = this;
		var orderEntryDetails = self.orderEntryDetails;

		self._editDetailsElement = $("<span></span>");
		var editDetailsElement = self._editDetailsElement;

		// pre-process details
		oeDetails = this.preProcessDetailsToDisplay(oeDetails, currentSequence);

		//Create list of Order Entry Details and Build HTML element for details
		if (oeDetails != undefined) {
			oeDetails.forEach(function (oeDetail, index) {

				oeDetail["SENTENCE_SEQ"] = currentSequence + 1;
				oeDetail["DETAIL_SEQ"] = index + 1;

				var orderEntryDetail = new OrderEntryDetail(oeDetail),
					delimiter = "",
					previousOrderEntryDetail, previousOeFieldMeaning, currentOeFieldMeaning, orderEntryDetailElement;
				// set the detail parent attributes
				orderEntryDetail.setParentAttributes(self.getAttributes());
				orderEntryDetails[orderEntryDetails.length] = orderEntryDetail;
				currentOeFieldMeaning = orderEntryDetail.getAttribute("OE_FIELD_MEANING");
				// append commas before details
				if (index > 0) {
					previousOrderEntryDetail = orderEntryDetails[orderEntryDetails.length - 2];
					previousOeFieldMeaning = previousOrderEntryDetail.getAttribute("OE_FIELD_MEANING");

					// no comma between strength and strength unit
					if (previousOeFieldMeaning == "STRENGTHDOSE" && currentOeFieldMeaning == "STRENGTHDOSEUNIT") {
						delimiter = "&nbsp;";
					}
					// no comma between volume and volume unit
					else if (previousOeFieldMeaning == "VOLUMEDOSE" && currentOeFieldMeaning == "VOLUMEDOSEUNIT") {
						delimiter = "&nbsp;";
					}
					// no comma between dispense quantity and dispense quantity unit
					else if (previousOeFieldMeaning == "DISPENSEQTY" && currentOeFieldMeaning == "DISPENSEQTYUNIT") {
						delimiter = "&nbsp;";
					}
					// no comma between duration and duration unit
					else if (previousOeFieldMeaning == "DURATION" && currentOeFieldMeaning == "DURATIONUNIT") {
						delimiter = "&nbsp;";
					}
					// include comma otherwise
					else {
						delimiter = ",&nbsp;";
					}
					editDetailsElement.append("<span class='oe-detail-delimiter'>" + delimiter + "</span>");
				}
				orderEntryDetailElement = orderEntryDetail.getElement();

				if ($.isFunction(self.onFocusOut)) {
					orderEntryDetail.listenFocusOut(self.onFocusOut);
				}

				if ($.isFunction(self.onFocusIn)) {
					orderEntryDetail.listenFocusIn(self.onFocusIn);
				}

				if ($.isFunction(self.onCreatedEditView)) {
					orderEntryDetail.listenCreatedEditView(self.onCreatedEditView);
				}

				if ($.isFunction(self.onChangedDetail)) {
					orderEntryDetail.listenChangedDetail(self.onChangedDetail);
				}

				// Attach handlers for field specific logic
				switch (currentOeFieldMeaning) {
					case "SCH/PRN":
						$(orderEntryDetailElement).bind("change-value", self.handlePRNChange.bind(self));
						break;
					case "PRNREASON":
					case "PRNINSTRUCTIONS":
						$(orderEntryDetailElement).bind("change-value", self.handlePRNReasonChange.bind(self));
						break;
					case "FREQ":
						$(orderEntryDetailElement).bind("change-value", self.handleFrequencyChange.bind(self));
						break;
					case "STRENGTHDOSE":
						$(orderEntryDetailElement).bind("full-change-value", self.handleStrengthChange.bind(self));
						break;
					case "STRENGTHDOSEUNIT":
						$(orderEntryDetailElement).bind("full-change-value", self.handleStrengthUnitChange.bind(self));
						break;
					case "VOLUMEDOSE":
						$(orderEntryDetailElement).bind("full-change-value", self.handleVolumeChange.bind(self));
						break;
					case "VOLUMEDOSEUNIT":
						$(orderEntryDetailElement).bind("full-change-value", self.handleVolumeUnitChange.bind(self));
						break;
				}

				// append detail element
				editDetailsElement.append(orderEntryDetailElement);
			});
		}

		self._editDetailsElement = editDetailsElement;
		this.setOrderEntryDetails(orderEntryDetails);
	});

	// Method to build enhanced edit
	OrderDetailsEdit.method("buildEnhancedView", function (oeFormatFields, currentSequence, tabIndexOffset) {
		var self = this;
		var orderEntryDetails = self.orderEntryDetails;
		var oeEditTemplate = window.render.OrderDetailEditEnhancedView;
		var strengthDetails = [];
		var volumeDetails = [];
		var freetextDetails = [];
		// var prnInstructionsDetail = null;
		// var prnReasonDetail = null;
		// var schPrnDetail = null;
		var topDetails = [];
		var bottomDetails = [];
		var oeDetailElements = [];
		var newVirtualFields = [];
		var viewContainer;
		var topDetailsLength;

		strengthDetails.length = 2;
		volumeDetails.length = 2;
		freetextDetails.length = 1;
		// setup the edit container element
		self._editDetailsElement = $("<div></div>");
		var editDetailsElement = self._editDetailsElement;

		// pre-process details
		oeFormatFields = self.preProcessDetailsToDisplay(oeFormatFields, currentSequence);

		if (oeFormatFields != undefined) {
			//Build the list of top and bottom details
			oeFormatFields.forEach(function (oeField, index) {
				var currentOeFieldMeaning = oeField["OE_FIELD_MEANING"];
				// oe Detail attributes
				oeField["SENTENCE_SEQ"] = currentSequence + 1;
				oeField["DETAIL_SEQ"] = index + 1;
				oeField["ACCEPT_CLASS"] = OrderEntryFields.getAcceptClassByFlag(oeField["ACCEPT_FLAG"]);
				//define description
				if (!oeField["DESCRIPTION"]) {
					oeField["DESCRIPTION"] = oeField["OE_FIELD_DESCRIPTION"];
				}

				switch (currentOeFieldMeaning) {
					// move specific details into the top details list
					case "STRENGTHDOSE":
						strengthDetails[0] = new OrderEntryDetail(oeField);
						strengthDetails[0].setParentAttributes(self.getAttributes());
						break;
					case "STRENGTHDOSEUNIT":
						strengthDetails[1] = new OrderEntryDetail(oeField);
						strengthDetails[1].setParentAttributes(self.getAttributes());
						break;
					case "VOLUMEDOSE":
						volumeDetails[0] = new OrderEntryDetail(oeField);
						volumeDetails[0].setParentAttributes(self.getAttributes());
						break;
					case "VOLUMEDOSEUNIT":
						volumeDetails[1] = new OrderEntryDetail(oeField);
						volumeDetails[1].setParentAttributes(self.getAttributes());
						break;
					case "FREETXTDOSE":
						freetextDetails[0] = new OrderEntryDetail(oeField);
						freetextDetails[0].setParentAttributes(self.getAttributes());
						break;
					case "RXROUTE":
					case "FREQ":
					case "DURATION":
					case "DURATIONUNIT":
					case "DISPENSEQTY":
					case "DISPENSEQTYUNIT":
					case "REFILLQTY":
						topDetails.push(oeField);
						break;
						// default everything else into other details list
					// catch SCHPRN, PRNREASON, PRNINSTRUCTIONS, add them to an object for later
					// case "SCH/PRN":
					// 	schPrnDetail = new OrderEntryDetail(oeField);
					// 	schPrnDetail.setParentAttributes(self.getAttributes());
					// 	break;
					// case "PRNREASON":
					// 	prnReasonDetail = new OrderEntryDetail(oeField);
					// 	prnReasonDetail.setParentAttributes(self.getAttributes());
					// 	break;
					// case "PRNINSTRUCTIONS":
					// 	prnInstructionsDetail = new OrderEntryDetail(oeField);
					// 	prnInstructionsDetail.setParentAttributes(self.getAttributes());
					// 	break;
					default:
						bottomDetails.push(oeField);
						break;
				}
			});

			//set the tab index for top details
			topDetails.forEach(function (oeField, index) {
				oeField["TAB_INDEX"] = (index + parseInt(oeField["SENTENCE_SEQ"], 10) * 100);
			});
			topDetailsLength = topDetails.length;

			// if (schPrnDetail) {
			// 	var sentence_seq = schPrnDetail.getAttribute("SENTENCE_SEQ");
			// 	var detail_seq = schPrnDetail.getAttribute("DETAIL_SEQ");
			// 	bottomDetails.push({
			// 		"GROUP_SEQ": 15,
			// 		"FIELD_SEQ": 0,
			// 		"ACCEPT_FLAG": 0,
			// 		"OE_FIELD_ID": 12715,
			// 		"OE_FIELD_VALUE": 0,
			// 		"OE_FIELD_DISPLAY_VALUE": "",
			// 		"OE_FIELD_MEANING_ID": 0,
			// 		"OE_FIELD_MEANING": "PRNVIRTUALFIELD",
			// 		"FIELD_TYPE_FLAG": 0,
			// 		"OE_FIELD_DESCRIPTION": "PRN",
			// 		"CODESET": 0,
			// 		"LABEL_TEXT": "PRN",
			// 		"SENTENCE_SEQ": sentence_seq,
			// 		"DETAIL_SEQ": detail_seq,
			// 		"ACCEPT_CLASS": "oe-prn-virtual-field",
			// 		"DESCRIPTION": "PRN",
			// 		"TAB_INDEX": topDetailsLength + tabIndexOffset + sentence_seq * 100
			// 	})
			// }

			//set the tab index for bottom details
			bottomDetails.forEach(function (oeField, index) {
				oeField["TAB_INDEX"] = (tabIndexOffset + topDetailsLength + index + parseInt(oeField["SENTENCE_SEQ"], 10) * 100);
			});
			// sort by sentence_seq
			bottomDetails.sort(function (a, b) {
				return b.DETAIL_SEQ - a.SENTENCE_SEQ;
			});

			//build view from template
			viewContainer = $(oeEditTemplate({
				"TOP_DETAILS": topDetails,
				"OTHER_DETAILS": bottomDetails
			}));

			//Initialize Order Entry Detail Instances on each element
			oeDetailElements = $(".oe-detail", viewContainer);
			oeFormatFields.forEach(function (oeField, index) {
				var orderEntryDetail;
				var currentOeFieldMeaning = oeField["OE_FIELD_MEANING"];
				var orderEntryDetailElement = $("span[oe-field-meaning='" + currentOeFieldMeaning + "']", viewContainer);
				var options = {};

				// verify it's not a virtual field, else skip
				// call is virtual field function
				switch (currentOeFieldMeaning) {
					case "STRENGTHDOSE":
					case "STRENGTHDOSEUNIT":
					case "VOLUMEDOSE":
					case "VOLUMEDOSEUNIT":
					case "FREETXTDOSE":
					// case "SCH/PRN":
					// case "PRNREASON":
					// case "PRNINSTRUCTIONS":
						return;
				}

				// valid element
				if (orderEntryDetailElement.length === 1) {
					options.PREBUILT_VIEW = $(orderEntryDetailElement[0]);
					options.DETAIL_DISPLAY_TYPE = options.PREBUILT_VIEW.attr("view-type");
					// Generate order entry detail
					orderEntryDetail = new OrderEntryDetail(oeField, null, options);
					orderEntryDetail.setParentAttributes(self.getAttributes());
					orderEntryDetails.push(orderEntryDetail);

					// if the field is required and empty -> set it to required
					if (oeField["ACCEPT_FLAG"] === 0 && oeField["OE_FIELD_DISPLAY_VALUE"] === "") {
						orderEntryDetail.setRequired(true);
					}

					// Assign events
					if ($.isFunction(self.onFocusOut)) {
						orderEntryDetail.listenFocusOut(self.onFocusOut);
					}

					if ($.isFunction(self.onFocusIn)) {
						orderEntryDetail.listenFocusIn(self.onFocusIn);
					}

					if ($.isFunction(self.onCreatedEditView)) {
						orderEntryDetail.listenCreatedEditView(self.onCreatedEditView);
					}

					if ($.isFunction(self.onChangedDetail)) {
						orderEntryDetail.listenChangedDetail(self.onChangedDetail);
					}

					// Attach handlers for field specific logic
					switch (currentOeFieldMeaning) {
						case "SCH/PRN":
							$(orderEntryDetailElement).bind("change-value", self.handlePRNChange.bind(self));
							break;
						case "PRNREASON":
						case "PRNINSTRUCTIONS":
							$(orderEntryDetailElement).bind("change-value", self.handlePRNReasonChange.bind(self));
							break;
						case "FREQ":
							$(orderEntryDetailElement).bind("change-value", self.handleFrequencyChange.bind(self));
							break;
						case "STRENGTHDOSE":
							$(orderEntryDetailElement).bind("full-change-value", self.handleStrengthChange.bind(self));
							break;
						case "STRENGTHDOSEUNIT":
							$(orderEntryDetailElement).bind("full-change-value", self.handleStrengthUnitChange.bind(self));
							break;
						case "VOLUMEDOSE":
							$(orderEntryDetailElement).bind("full-change-value", self.handleVolumeChange.bind(self));
							break;
						case "VOLUMEDOSEUNIT":
							$(orderEntryDetailElement).bind("full-change-value", self.handleVolumeUnitChange.bind(self));
							break;
					}
				}
			});

			// create dose virtual field object
			newVirtualFields.push(new DoseVirtualField(strengthDetails, volumeDetails, freetextDetails, $(".oe-dose-virtual-field", viewContainer)));

			// create a prn virtual field object
			// newVirtualFields.push(new PrnVirtualField(schPrnDetail, prnInstructionsDetail, prnReasonDetail, $(".oe-prn-virtual-field", viewContainer).parent().find("input")));

			//Append the view container to the main element
			editDetailsElement.append(viewContainer);
		}

		self.virtualFields = newVirtualFields;
		self._editDetailsElement = editDetailsElement;
		this.setOrderEntryDetails(orderEntryDetails);
	});
	// End Public methods

	// reset volume dose if strength dose was changed
	OrderDetailsEdit.method("handleStrengthChange", function (event, oeDetail) {
		this.checkRequiredField.bind(this)("STRENGTHDOSE", oeDetail);
		this.resetDoseFields("VOLUMEDOSE", "VOLUMEDOSEUNIT");
	});
	// reset volume dose if strength dose unit was changed
	OrderDetailsEdit.method("handleStrengthUnitChange", function (event, oeDetail) {
		this.checkRequiredField("STRENGTHDOSEUNIT", oeDetail);
		this.resetDoseFields("VOLUMEDOSE", "VOLUMEDOSEUNIT");
	});
	// reset strength dose if volume dose was changed
	OrderDetailsEdit.method("handleVolumeChange", function (event, oeDetail) {
		this.checkRequiredField("VOLUMEDOSE", oeDetail);
		this.resetDoseFields("STRENGTHDOSE", "STRENGTHDOSEUNIT");
	});
	// reset strength dose if volume dose unit was changed
	OrderDetailsEdit.method("handleVolumeUnitChange", function (event, oeDetail) {
		this.checkRequiredField("VOLUMEDOSEUNIT", oeDetail);
		this.resetDoseFields("STRENGTHDOSE", "STRENGTHDOSEUNIT");
	});

	OrderDetailsEdit.method("checkRequiredField", function (fieldMeaning, oeDetail) {
		var changedField = this.getOrderEntryDetail("OE_FIELD_MEANING", fieldMeaning);
		var changedFieldValue = oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");

		// set changed field as required if it was set to 0
		changedField.setRequired(changedFieldValue === "0");
	});

	OrderDetailsEdit.method("resetDoseFields", function (resetDoseMeaning, resetDoseUnitMeaning) {
		var resetDose = this.getOrderEntryDetail("OE_FIELD_MEANING", resetDoseMeaning);
		var resetDoseUnit = this.getOrderEntryDetail("OE_FIELD_MEANING", resetDoseUnitMeaning);

		// reset linked fields
		if (resetDose) {
			this.resetField(resetDose);
		}

		if (resetDoseUnit) {
			this.resetField(resetDoseUnit);
		}
	});
	// reset a field
	OrderDetailsEdit.method("resetField", function (linkedField) {
		linkedField.setAttribute("OE_FIELD_VALUE", 0);
		linkedField.setAttribute("OE_FIELD_DISPLAY_VALUE", "");
		linkedField.updateDisplay({
			"silent": true
		});
		// is a required field -> set the display to required
		if (linkedField.getAttribute("ACCEPT_FLAG") === 0) {
			linkedField.setRequired(true);
		}
	});
	// Handling PRN and PRN Reason
	OrderDetailsEdit.method("handlePRNChange", function (event, oeDetail) {
		var PRNReasonOeDetail, PRNValue = oeDetail.getAttribute("OE_FIELD_VALUE");
		var PRNReasonValue;
		PRNReasonOeDetail = this.getOrderEntryDetail("OE_FIELD_MEANING", "PRNREASON");
		// if prn reason not found => try to use prn instructions
		if (!PRNReasonOeDetail) {
			PRNReasonOeDetail = this.getOrderEntryDetail("OE_FIELD_MEANING", "PRNINSTRUCTIONS");
		}
		if (PRNReasonOeDetail) {
			PRNReasonValue = parseFloat(PRNReasonOeDetail.getAttribute("OE_FIELD_VALUE"));
			if (PRNValue > 0) {
				if (PRNReasonValue === 0) { // set to required only if the PRN reason is empty
					PRNReasonOeDetail.setRequired(true);
				}
			} else {
				PRNReasonOeDetail.setAttribute("OE_FIELD_VALUE", 0);
				PRNReasonOeDetail.updateDisplay({
					"silent": true
				});
				PRNReasonOeDetail.setRequired(false);
			}
		}
	});

	OrderDetailsEdit.method("handlePRNReasonChange", function (event, oeDetail) {
		var PRNOeDetail;
		var PRNReasonValue = oeDetail.getAttribute("OE_FIELD_VALUE");
		var PRNReasonDisplayValue = oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");
		PRNOeDetail = this.getOrderEntryDetail("OE_FIELD_MEANING", "SCH/PRN");
		if (PRNOeDetail) {
			if (PRNReasonValue > 0 || PRNReasonDisplayValue.length > 0) {
				PRNOeDetail.setAttribute("OE_FIELD_VALUE", 1);
			} else {
				PRNOeDetail.setAttribute("OE_FIELD_VALUE", 0);
			}
			PRNOeDetail.updateDisplay({
				"silent": true
			});
		}
	});

	OrderDetailsEdit.method("handleFrequencyChange", function (event, orderEntryDetail) {
		var PRNOeDetail = this.getOrderEntryDetail("OE_FIELD_MEANING", "SCH/PRN");
		// If PRN field is present
		if (PRNOeDetail) {
			var nurseUnitCd = orderEntryDetail.getParentAttribute("NURSE_UNIT_CD") || 0;
			var orderId = orderEntryDetail.getParentAttribute("ORDER_ID") || 0;
			var catalogCd = 0;
			var activityTypeCd = 0;
			var oeFieldCache = OrderEntryFields.getCachedOeFieldData(orderEntryDetail);
			if (oeFieldCache) {
				var oeCatalogData = oeFieldCache.ORDER_CATALOG_DATA;
				if (oeCatalogData) {
					catalogCd = oeCatalogData.CATALOG_CD;
					activityTypeCd = oeCatalogData.ACTIVITY_TYPE_CD;
				}
			}
			var jsonParams = '{ "FREQUENCY_REQUEST":' + '{"FREQUENCY_CD": ' + parseFloat(orderEntryDetail.getAttribute("OE_FIELD_VALUE")).toFixed(2) + ', "ORDER_ID" : ' + parseFloat(orderId).toFixed(2) + ', "ORDER_PROVIDER_ID" : 0.00' + ', "CATALOG_CD" : ' + parseFloat(catalogCd).toFixed(2) + ', "MED_CLASS_CD" : 0.00' + ', "NURSE_UNIT_CD" : ' + parseFloat(nurseUnitCd).toFixed(2) + ', "ACTIVITY_TYPE_CD" : ' + parseFloat(activityTypeCd).toFixed(2) + ', "EXCLUDE_INACTIVE_SCHED_IND" : 1' + "}}";

			var parameters = ["^MINE^","@" + jsonParams.length + ":" + jsonParams + "@"];
			var scriptRequest = new ScriptRequest();
			scriptRequest.setProgramName("INN_RX_GET_FREQ_ID");
			scriptRequest.setParameterArray(parameters);
			scriptRequest.setResponseHandler(function(reply){
				var frequencyDetails = reply.getResponse();
				//if prn is default => set the prn field to Yes
				if (frequencyDetails.PRN_DEFAULT_IND == 1) {
					PRNOeDetail.setAttribute("OE_FIELD_VALUE", 1);
					PRNOeDetail.updateDisplay();
				}
			});
			scriptRequest.performRequest();
		}
	});

	OrderDetailsEdit.method("sortOeDetails", function (oeDetail_1, oeDetail_2) {
		var group_seq_1 = parseInt(oeDetail_1.GROUP_SEQ, 10);
		var group_seq_2 = parseInt(oeDetail_2.GROUP_SEQ, 10);
		var field_seq_1 = parseInt(oeDetail_1.FIELD_SEQ, 10);
		var field_seq_2 = parseInt(oeDetail_2.FIELD_SEQ, 10);

		if (group_seq_1 > group_seq_2) {
			return (1);
		} else if (group_seq_1 < group_seq_2) {
			return (-1)
		} else {
			if (field_seq_1 > field_seq_2) {
				return (1);
			} else if (field_seq_1 < field_seq_2) {
				return (-1);
			} else {
				return (0);
			}
		}
	});

	OrderDetailsEdit.method("hasMissingRequiredDetails", function (oeDetail_1, oeDetail_2) {
		var hasMissingRequired = false;
		var orderEntryDetails = this.orderEntryDetails;
		orderEntryDetails.forEach(function (orderEntryDetail) {
			if (orderEntryDetail.isRequired()) {
				hasMissingRequired = true;
			}
		});
		return (hasMissingRequired);
	});

}
var OrderModifyManager = (function(){
	var orders = [];
	var currentOrderModifySequence = -1;
	var pendingOrderModifyCnt = 0;
	var maxAcceptFlag = 3; // default to accept all
	var editableOnly = false;// default to display all fields
	var actionType = "MODIFY"; // default modify action
	var additionalDetailsToModify = "''"; // default to have no additional details
	var MPAGES_API_ROOT = window.external;
	var attributes = [];
	var _allowDuplicateOrders = false;
	var _buildOrderModifiesSynchronously = false;
	var self = this;
	var modifyViewType = "EOL";
	var tabIndexOffset = 0;

    function setAttribute(attribute, value) {
		attributes[attribute] = value;
		// add attribute to each order
		if(orders != undefined) {
			orders.forEach(function(order) {
				order.setAttribute(attribute,value);
			});
		}
	}

	function getAttribute(attribute) {
		return (attributes[attribute]);
	}

	function handleError (methodName, statusObject) {
		var errorMessage = "";
		if(statusObject.SUBEVENTSTATUS.length > 0) {
			errorMessage = JSON.stringify(statusObject.SUBEVENTSTATUS);
		}
		alert("ERROR - OrderManager." + methodName + "() -> " + errorMessage);
	}

	function applyModifyAction(modifyOrdersXML,callBackFunction){
		var successInd = false;
		var moewXml = "";
		// Any orders to modify
		if(modifyOrdersXML > " ") {
			var m_hMOEW = 0;
			var PowerOrdersMPageUtils = MPAGES_API_ROOT.DiscernObjectFactory("POWERORDERS");
			var m_dPersonId = attributes["PERSON_ID"];
			var m_dEncounterId = attributes["ENCNTR_ID"];
			var do_not_reset_ind = attributes["DO_NOT_RESET_ON_SIGN"];
			//Call power orders API for Modify
			m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(m_dPersonId, m_dEncounterId, 24, 2, 127);
			PowerOrdersMPageUtils.CustomizeTabMOEW(m_hMOEW, 2, 127);
			PowerOrdersMPageUtils.CustomizeTabMOEW(m_hMOEW, 3, 127);

			var retVal = PowerOrdersMPageUtils.InvokeModifyActionMOEW(m_hMOEW, modifyOrdersXML);
			if(retVal){
				moewXml=PowerOrdersMPageUtils.GetXMLOrdersMOEW(m_hMOEW);
				successInd = true;
			}
			else{
				successInd = false;
			}
			// clean up API call
			PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);

			// reset data on order modify manager if do not reset on sign indicator is false
			if(!do_not_reset_ind){
				self.reset();
			}

			// do call back indicating success/ failure
			callBackFunction(successInd, moewXml);

		} else {
			// No modify actions => pass through to call back
			callBackFunction(true, "");
		}
	}

	 OrderModifyManager.method("setAttribute",setAttribute);
	 OrderModifyManager.method("getAttribute",getAttribute);


	 OrderModifyManager.method("setMpagesAPIRoot", function(api_root){
		MPAGES_API_ROOT = api_root;
	});

	 OrderModifyManager.method("reset", function(){
		if(orders != undefined) {
			orders.forEach(function(order){
				order.reset();
			});
		}
		orders = [];
		currentOrderModifySequence = -1;
		pendingOrderModifyCnt = 0;
	});

	 OrderModifyManager.method("isUniqueOrder", function(OrderModifyInstance) {
		var existingOrder;
		orders.forEach(function(order,index){
			if(order.getAttribute("ORDER_ID") == OrderModifyInstance.getAttribute("ORDER_ID")) {
				existingOrder = order;
				return;
			}
		});
		if(existingOrder) {
			return false;
		} else {
			return true;
		}
	});


	 OrderModifyManager.method("getCurrentOrderModifyseq", function(){
		return (currentOrderModifySequence);
	});

	 OrderModifyManager.method("setAllowDuplicateOrders", function (value) {
		_allowDuplicateOrders = value ? true : false;
	});

	 OrderModifyManager.method("getAllowDuplicateOrders", function () {
		return _allowDuplicateOrders;
	});

	 OrderModifyManager.method("addOrderModify", function(OrderModifyInstance){
		var orderAdded = false;

		if(self.isUniqueOrder(OrderModifyInstance)){
			orders[orders.length] = OrderModifyInstance;
			currentOrderModifySequence += 1;
			orderAdded = true;
		}
		return (orderAdded);
	});

	 OrderModifyManager.method("removeOrderModify", function(OrderModifyInstance){
		orders.forEach(function(order,index){
			if(order === OrderModifyInstance)
				orders.splice(index);
		});
	});

	 OrderModifyManager.method("removeOrderModifyWithOrderId", function (OrderId) {
		var orderModifyInstance;
		orders.forEach(function(order){
			if(order.getAttribute("ORDER_ID") === OrderId)	{
				orderModifyInstance = order;
				return;
			}
		});
		self.removeOrderModify(orderModifyInstance);
	});

	 OrderModifyManager.method("getOrdersModify", function(){
		return (orders);
	});

	 OrderModifyManager.method("setPendingOrderModifyCnt", function(cnt){
		pendingOrderModifyCnt=cnt;
	});

 	OrderModifyManager.method("setMaxAcceptFlag", function(flag){
		maxAcceptFlag=flag;
	});

	OrderModifyManager.method("getMaxAcceptFlag", function(){
		return(maxAcceptFlag);
	});

	OrderModifyManager.method("setDisplayEditableOnly", function(displayInd){
		editableOnly=displayInd;
	});

	OrderModifyManager.method("getDisplayEditableOnly", function(){
		return(editableOnly);
	});

	OrderModifyManager.method("setActionTypeMeaning", function(typeMeaning){
		actionType=typeMeaning;
	});

	OrderModifyManager.method("getActionTypeMeaning", function(){
		return(actionType);
	});

	OrderModifyManager.method("setAdditionalDetailsToModify", function(detailsToModify){
		additionalDetailsToModify=detailsToModify;
	});

	OrderModifyManager.method("getAdditionalDetailsToModify", function(){
		return(additionalDetailsToModify);
	});

	 OrderModifyManager.method("getPendingOrderModifyCnt", function(){
		return (pendingOrderModifyCnt);
	});

	 OrderModifyManager.method("decreasePendingOrderModifyCnt", function(){
		pendingOrderModifyCnt = pendingOrderModifyCnt-1;
	});

	OrderModifyManager.method("buildModifyXML", function(callBackFunction) {
		try {
			var modifyOrdersXML = "";
			// Any orders to modify
			if(currentOrderModifySequence > -1) {
				// Build xml for orders modified
				if(orders != undefined) {
					orders.forEach(function(order){
						modifyOrdersXML += order.buildModifyXML();
					});
				}
				// any order modified
				if(modifyOrdersXML > " "){
					// get template xml
					//var OrderModifyXMLTemplate = Handlebars.templates.modifyOrders;
					var OrderModifyXMLTemplate = window.render['modifyOrders'];

					// Build complete xml for order
					modifyOrdersXML = OrderModifyXMLTemplate({
						"ORDERS_XML" : modifyOrdersXML
					});
				}
			}
			return(modifyOrdersXML);
		} catch(e) {
			alert("Error - >" + e.message + "OrderModifyManager.buildModifyXML()");
			return (modifyOrdersXML);
		}
	});


	 OrderModifyManager.method("modifyOrders", function(criterion, callBackFunction) {
		try {
			// set attributes if they aren't already populated
			attributes["PERSON_ID"] = attributes["PERSON_ID"] ? attributes["PERSON_ID"] : criterion.person_id;
			attributes["ENCNTR_ID"] = attributes["ENCNTR_ID"] ? attributes["ENCNTR_ID"] : criterion.encntr_id;
			// Build xml for orders modified
			var modifyOrdersXML = self.buildModifyXML();
			// apply modify action on all orders
			applyModifyAction(modifyOrdersXML,callBackFunction);

		} catch(e) {
			alert("Error - >" + e.message + "OrderModifyManager.modifyOrders()");
			callBackFunction(false, "");
		}
	});

	 OrderModifyManager.method("modifySingleOrder", function(orderId,callBackFunction) {
		try {
			//find the matching orderable object
			var currentOrder;
			orders.forEach(function(order){
				if(order.getAttribute("ORDER_ID") === orderId)	{
					currentOrder = order;
					return;
				}
			});
			// get template xml
			//var OrderModifyXMLTemplate = Handlebars.templates.modifyOrders;
			var OrderModifyXMLTemplate = window.render.modifyOrders;
			if(!currentOrder || currentOrder == undefined){
				return false;
				callBackFunction(false, "");
			}

			// Build xml for the current order
			var modifyOrderXML = currentOrder.buildModifyXML();

			// Build complete xml for order
			modifyOrderXML = OrderModifyXMLTemplate({
				"ORDERS_XML" : modifyOrderXML
			});
			// apply modify action on the current order
			applyModifyAction(modifyOrderXML,callBackFunction);

		} catch(e) {
			alert("Error - >" + e.message + "OrderModifyManager.modifySingleOrder()");
			callBackFunction(false, "");
		}
	});

	 OrderModifyManager.method("setBuildOrderModifiesSynchronously", function (val) {
		_buildOrderModifiesSynchronously = val ? true : false;
	});

	 OrderModifyManager.method("getBuildOrderModifiesSynchronously", function () {
		return _buildOrderModifiesSynchronously;
	});

	OrderModifyManager.method("getModifyViewType", function() {
		return modifyViewType;
    });

	OrderModifyManager.method("setModifyViewType", function(viewType) {
		modifyViewType = viewType;
    });

	OrderModifyManager.method("getTabIndexOffset", function () {
		return tabIndexOffset;
	});

    OrderModifyManager.method("setTabIndexOffset", function (value) {
    	tabIndexOffset = parseInt(value, 10);
    });

	OrderModifyManager.method("getOrdersWithMissingRequiredDetails",function(){
		var missingRequired = [];
		orders.forEach(function(order){
			if(order.hasMissingRequiredDetails()){
				missingRequired.push(order);
			}
		});
		return(missingRequired);
	});

	OrderModifyManager.method("onRender", function() {
		// place-holder method, can be over-ridden by the consumer
	});
});var OrderModify = (function(){
    OrderModify.method("reset", function() {
        var orderModifyElement = this.getElement();
        var orderEntryDetails = this.getOrderEntryDetails();
        delete orderEntryDetails;
        orderModifyElement.remove();
    });

    OrderModify.method("remove", function(curModifyManager) {
        this.reset();
        curModifyManager.removeOrderModify(this);
    });
    OrderModify.method("buildModifyXML", function() {
        var xml = "";
        var changedOrderEntryDetails = [];
        var orderEntryDetails = this.getVirtualAndOrderEntryDetails();
        // get template xml
        var OrderModifyXMLTemplate = window.render.modifyOrderDetails;

        // build JSON for filling out template with changed and un-excluded details only
        if(orderEntryDetails != undefined) {
        	orderEntryDetails.forEach(function(oeDetail){
        		if(oeDetail.hasChanged() && !oeDetail.getAttribute("EXCLUDED_IND"))	{
                	oeDetail.setAttribute("OE_FIELD_MEANING_ENCODE",oeDetail.encodeAttributeValue("OE_FIELD_MEANING"));
                	changedOrderEntryDetails[changedOrderEntryDetails.length] = oeDetail.getAttributes();
            	}
        	});
        }
        // Any changed order entry details
        if(changedOrderEntryDetails.length > 0) {
            var orderJSON = this.getAttributes();
            orderJSON.DETQUAL = changedOrderEntryDetails;
            orderJSON.DETQUAL_CNT = orderJSON.DETQUAL.length;
            // Get xml for order
            xml = OrderModifyXMLTemplate(orderJSON);
        }
        return xml;

    });
    //initialize function
    OrderModify.method("initialize", function(orderData,parentElement,curModifyManager) {
        try {
            var self = this;
            var orderid = orderData;
            var filterDetails = [];
            var excludeDetails = [];
            var modifyViewType = curModifyManager.getModifyViewType();

            if(orderData && orderData.ORDER_ID){
                orderid = orderData.ORDER_ID;
                filterDetails = orderData.FILTER_DETAILS || [];
                excludeDetails = orderData.EXCLUDE_DETAILS || [];
            }
            // initialize attributes
            self.setAttributes({
                "ORDER_ID" : 0.00,
                "SYNONYM_ID" : 0.0,
                "LAST_UPDT_CNT":0,
                "ACTION_TYPE":"MODIFY"
            });
            self.setOrderEntryDetails([]);
			var scriptParameters = ["MINE", orderid + ".0","0",
                                curModifyManager.getMaxAcceptFlag(),
                                "^"+curModifyManager.getActionTypeMeaning()+"^",
                                curModifyManager.getAdditionalDetailsToModify()];
			var scriptRequest = new ScriptRequest();
			scriptRequest.setProgramName("INN_GET_ORDER_DETAILS_FIELD");
			scriptRequest.setParameterArray(scriptParameters);
			scriptRequest.setAsyncIndicator(curModifyManager.getBuildOrderModifiesSynchronously());
			scriptRequest.setResponseHandler(function(reply){
				var orderData = reply.getResponse();
				var statusData = reply.getStatus();
				var status = statusData.STATUS;
				var currentSequence;
				var oeDetails = orderData.DETQUAL;
				var qualOeDetails = [];
				var fieldTypeFlag;
				var displayDetail;

				// any details being filtered
				if(filterDetails && filterDetails.length > 0){
					// clear out qualified details
					qualOeDetails = [];
					oeDetails.forEach(function(curOeDetail){
						var isQualifying = false;
						filterDetails.forEach(function(curDetail){
							if(curOeDetail.OE_FIELD_ID === curDetail.OE_FIELD_ID){
								isQualifying = true;
							}
						});
						// add qualifying detail to qualified list
						if(isQualifying){
							qualOeDetails.push(curOeDetail);
						}
					});
					// set the oe details back to qualified only
					oeDetails = qualOeDetails.slice(0)
				}
				 // any details being excluded
				if(excludeDetails && excludeDetails.length > 0){
					// clear out qualified details
					qualOeDetails = [];
					oeDetails.forEach(function(curOeDetail){
						var isExcluded = false;
						excludeDetails.forEach(function(curDetail){
							if(curOeDetail.OE_FIELD_MEANING === curDetail.OE_FIELD_MEANING){
								isExcluded = true;
							}
						});
						// add not excluded detail to qualified list
						if(!isExcluded){
							qualOeDetails.push(curOeDetail);
						}
					});
					// set the oe details back to qualified only
					oeDetails = qualOeDetails.slice(0)
				}
				//only displaying editable fields
				if(curModifyManager.getDisplayEditableOnly()){
					// clear out qualified details
					qualOeDetails = [];
					// check if the detail is edtiable by the field type flag
					oeDetails.forEach(function(curOeDetail){
						if(OrderEntryFields.isFieldEditable(curOeDetail)){
							qualOeDetails.push(curOeDetail);
						}
					});
					// set the oe details back to qualified only
					oeDetails = qualOeDetails.slice(0)
				}

				// set qualified details to all order entry details
				qualOeDetails = oeDetails;


				if(status === "F") {
					self.handleError("OrderModify.initialize()", statusData);
				} else {
					self.setAttribute("ORDER_ID", orderid);
					self.setAttribute("SYNONYM_ID", orderData.SYNONYM_ID);
					self.setAttribute("OE_FORMAT_ID", orderData.OE_FORMAT_ID);
					self.setAttribute("LAST_UPDT_CNT", orderData.UPDT_CNT);
					self.setAttribute("ORDERABLE_TYPE_FLAG", orderData.ORDERABLE_TYPE_FLAG);

					// Successfully added to order modify manager
					if(curModifyManager.addOrderModify(self)){
						currentSequence = curModifyManager.getCurrentOrderModifyseq();
						switch(modifyViewType){
							case "ENHANCED": // build the enhanced edit view
								self.buildEnhancedView(qualOeDetails, currentSequence, curModifyManager.getTabIndexOffset());
								break;
							default:
								// build the detail line
								self.buildLine(qualOeDetails, currentSequence);
								break;
						}

						// if duplicate orders are supported
						// -> loop through the details and bind the change display event on each detail
						var allowDuplicateOrders = curModifyManager.getAllowDuplicateOrders();
						if(allowDuplicateOrders){
							var orderEntryDetails = self.getOrderEntryDetails();
							if(orderEntryDetails != undefined) {
								orderEntryDetails.forEach(function(oeDetail){
									$("body").bind(orderid+"_"+oeDetail.getAttribute("OE_FIELD_ID")+"_CHANGE_DISPLAY" ,function(event, orderEntryElement, newDisplay){
										oeDetail.changeDisplay(newDisplay, orderEntryElement);
									});
								});
							}
						}

						if (parentElement) {
							$(parentElement).empty().append(self.getElement());
						}
						// call on render event handler
						curModifyManager.onRender(self);
					}
					// reset invalid Order Modify
					else{
						alert("Order failed - could not add to order ("+orderid+") modify manager");
					}
				}
			});
			scriptRequest.performRequest();

        } catch(e) {
            alert("Error - >" + e.message + "OrderModify.initialize()");
        }
    });
    OrderModify.method("handleError", function(methodName, statusObject) {
        var errorMessage = "";
        if(statusObject.SUBEVENTSTATUS.length > 0) {
            errorMessage = JSON.stringify(statusObject.SUBEVENTSTATUS);
        }
        alert("ERROR - OrderModify." + methodName + "() -> " + errorMessage);
    });

    OrderModify.method("toggleOptionalDetails", function(showInd) {
        var parentElement = this.getElement();
        var optionalElements = $(".oe-format-optional",parentElement);
        var prevDelimiterElements = optionalElements.prev();
        var nextDelimiterElements = optionalElements.next();
        if(showInd){
            prevDelimiterElements.show();
            optionalElements.show();
            nextDelimiterElements.show();
        }
        else{
            prevDelimiterElements.hide();
            optionalElements.hide();
            nextDelimiterElements.hide();
        }
    });

    OrderModify.method("toggleExclusionDetails", function(showInd,excludeDetails) {
        var orderEntryDetails = this.getOrderEntryDetails();
        var viewContainer = this._editDetailsElement;

        orderEntryDetails.forEach(function(curOeDetail){
            var qualInd = false;
            var curOeElement;
            var curOeLabelElement;
            var curOeFieldMeaning = curOeDetail.getAttribute("OE_FIELD_MEANING");
            excludeDetails.forEach(function(excludeDetail){
                if(curOeFieldMeaning === excludeDetail.OE_FIELD_MEANING){
                    qualInd = true;
                }
            });
            // Is an excluded detail
            if(qualInd){
                curOeElement = $("span[oe-field-meaning='"+curOeFieldMeaning+"']",viewContainer);
                curOeLabelElement = $("span[label-oe-field-meaning='"+curOeFieldMeaning+"']",viewContainer);
                 // valid element
                if(curOeElement.length === 1){
                    curOeElement = $(curOeElement[0]).parent();
                    curOeLabelElement = $(curOeLabelElement[0]).parent();
                 // showing the detail
                    if(showInd){
                        curOeLabelElement.show();
                        curOeElement.show();
                        curOeDetail.setAttribute("EXCLUDED_IND",false);
                    }
                    // hide the detail
                    else{
                        curOeLabelElement.hide();
                        curOeElement.hide();
                        curOeDetail.setAttribute("EXCLUDED_IND",true);
                    }
                }
            }
        });
    });


    // Initialize the order modify control
	this.initialize.apply(this,arguments);
});

// Inherit Order Details Edit control
OrderModify.inherits(OrderDetailsEdit);
var OrderSentenceManager = (function(){
	var orderSentences = [];
	var currentOrderSentenceSequence = -1;
	var createdOrderSentences = [];
	var attributes = [];
	var editViewType = "EOL";
	var tabIndexOffset = 0;

   	function setAttribute(attribute, value) {
		attributes[attribute] = value;
		// add attribute to each order sentence
		if(orderSentences != undefined) {
			orderSentences.forEach(function(orderSentence){
				orderSentence.setAttribute(attribute,value);
			})
		}
	}

	function getAttribute(attribute) {
		return (attributes[attribute]);
	}

   function handleError (methodName, statusObject) {
		if(statusObject.SUBEVENTSTATUS.length > 0) {
			var errorMessage = JSON.stringify(statusObject.SUBEVENTSTATUS)
		}
		alert("ERROR - OrderSentenceManager." + methodName + "() -> " + errorMessage);
	}

	OrderSentenceManager.method("setAttribute", setAttribute);

	OrderSentenceManager.method("getAttribute", getAttribute);

	OrderSentenceManager.method("reset", function(){
		orderSentences = [];
		currentOrderSentenceSequence = -1;
		createdOrderSentences = [];
	});

	OrderSentenceManager.method("getCurrentOrderSentenceSeq", function(){
		return (currentOrderSentenceSequence);
	});

	OrderSentenceManager.method("addOrderSentence", function(OrderSentenceInstance){
		orderSentences[orderSentences.length] = OrderSentenceInstance;
		currentOrderSentenceSequence += 1;
	});

	OrderSentenceManager.method("getOrderSentences", function(){
		return (orderSentences);
	});

	OrderSentenceManager.method("removeOrderSentence", function (OrderSentenceInstance) {
		orderSentences.forEach(function (orderSentence, index) {
			if (orderSentence === OrderSentenceInstance) {
				orderSentences.splice(index)
			}
		});
	});


	OrderSentenceManager.method("findNewOrderSentences", function () {
		var newOrderSentences = $.grep(orderSentences, function (orderSentence) {
			var order_sentence_id = orderSentence.getAttribute("ORDER_SENTENCE_ID");
			var hasDetailsToAdd = orderSentence.anyDetailsToAdd();
			// has no order sentence id and has details to add
			return (order_sentence_id === 0.0 && hasDetailsToAdd);
		});
		return (newOrderSentences);
	});

	OrderSentenceManager.method("createOrderSentences", function(callBackFunction) {
		try {
			var self = this, addOrderSentences = function(newOrderSentences) {
				// Ajax request for retrieving code value
				var scriptParameters = [], requestJSON = "", orderSentencesRequest = "";
				if(newOrderSentences.length > 0){
					// Build script parameters
					if(newOrderSentences != undefined) {
						newOrderSentences.forEach(function(curOrderSentence, index){
							if(index > 0) {
								orderSentencesRequest += ",";
							}
							orderSentencesRequest += curOrderSentence.buildScriptRequestJSON();
						});
					}
					requestJSON = '{ "order_sentence_request":{  "cnt":' + newOrderSentences.length + ',   "list": [' + orderSentencesRequest + ']}}'
					scriptParameters.push("^MINE^", "^^");
				}
				 // No new order sentences to add with details
				else{
					callBackFunction(true);
					return true;
				}

				// AjaxHandler.append_text("INN_ORM_ADD_ORD_SENTENCES blobIn -- > "+requestJSON);
				var scriptRequest = new ScriptRequest();
				scriptRequest.setProgramName("INN_ORM_ADD_ORD_SENTENCES");
				scriptRequest.setParameterArray(scriptParameters);
				scriptRequest.setDataBlob(requestJSON);
				scriptRequest.setResponseHandler(function (reply) {
					var statusData = reply.getStatus(), status = statusData.STATUS, successInd;
					if(status === "F") {
						successInd = false;
						handleError("createOrderSentences()", statusData);
					} else {
						successInd = true;
						var orderSentenceIds = reply.getResponse().ORDER_SENTENCE_LIST;
						// Set the order sentence id value for new sentences
						if(orderSentenceIds != undefined) {
							orderSentenceIds.forEach(function(orderSentenceObject, index){
								var orderSentenceId = orderSentenceObject.ORDER_SENTENCE_ID, successInd = orderSentenceObject.SUCCESS_IND, failedOrderSentence;
								// If order sentence creating failed => clear out the order_sentence_id attribute
								if(successInd === 0) {
									newOrderSentences.forEach(function(curOrderSentence){
										if(curOrderSentence.getAttribute("ORDER_SENTENCE_ID") === orderSentenceId){
											failedOrderSentence = curOrderSentence;
											return;
										}
									});
									// found a matching failed order_sentence => reset the id to 0
									if(!(failedOrderSentence === null) && !(failedOrderSentence === void 0)) {
										failedOrderSentence.setAttribute("ORDER_SENTENCE_ID", 0.0);
									}
								} else {
									createdOrderSentences[createdOrderSentences.length] = {
										"order_sentence_id" : orderSentenceId,
										"ord_comment_long_text_id" : 0.0
									};
								}
							});
						}
					}
					callBackFunction(successInd);
				});
				scriptRequest.performRequest();

			}
			this.createOrderSentenceIds(addOrderSentences);
		} catch(e) {
			alert("Error - >" + e.message + "OrderSentenceManager.createOrderSentences()")
		}
	});

	OrderSentenceManager.method("createOrderSentenceIds", function(callBack) {
		try {
			// Ajax request for retrieving order sentence ids
			var newOrderSentences = this.findNewOrderSentences();
			var scriptParameters, requestJSON = "";

			if(newOrderSentences && $.isArray(newOrderSentences)  && newOrderSentences.length > 0) {
				requestJSON = '{ "pw_comp_id_request":{  "id_count":' + newOrderSentences.length + ',   "comp_type_meaning":"REF_SEQ" }}'
				scriptParameters = "^MINE^,^^";
			} else {
				callBack([]);
				return false;
			}
			var scriptRequest = new ScriptRequest();
			scriptRequest.setProgramName("INN_DCP_GET_PW_COMP_ID");
			scriptRequest.setParameterArray(scriptParameters);
			scriptRequest.setDataBlob(requestJSON);
			scriptRequest.setResponseHandler(function(reply){
				var statusData = reply.getStatus(), status = statusData.STATUS;
				if(status === "F") {
					handleError("createOrderSentenceIds()", statusData);
				} else {
					var orderSentenceIds = reply.getResponse().ID_LIST;
					// Set the order sentence id value for new sentences
					if(orderSentenceIds != undefined) {
						orderSentenceIds.forEach(function(idObject, index){
							var orderSentenceId = idObject.ID;
							if(newOrderSentences.length > index) {
								newOrderSentences[index].setAttribute("ORDER_SENTENCE_ID", orderSentenceId);
							}
						});
					}
					callBack(newOrderSentences);
				}
			});
			scriptRequest.performRequest();
			
		} catch(e) {
			alert("Error - >" + e.message + "OrderSentenceManager.createOrderSentenceIds()")
		}
	});

	OrderSentenceManager.method("destroyOrderSentences", function(callBackFunction) {
		try {
			var scriptParameters;
			var orderSentencesRequest = {};
			var requestJSON = "";

			orderSentencesRequest.cnt = createdOrderSentences.length;
			orderSentencesRequest.list = createdOrderSentences;

			if(orderSentencesRequest.cnt === 0){ // return if now new order sentences created
				callBackFunction(true);
				return true;
			}
			// Build script paramters
			scriptParameters = ["^MINE^","^^"];
			// Build the request JSON
			requestJSON = '{ "order_sentence_request": {'
			requestJSON += '"cnt" : '+parseInt(orderSentencesRequest.cnt)+" ,"
			requestJSON += '"list" : [';
			if(orderSentencesRequest.list != undefined) {
				orderSentencesRequest.list.forEach(function(osItem,index){
					if(index > 0){
						requestJSON += ",";
					}
					requestJSON += '{';
						requestJSON += '"order_sentence_id" : '+parseFloat(osItem.order_sentence_id).toFixed(2)+" ,"
						requestJSON += '"ord_comment_long_text_id" : '+parseFloat(osItem.ord_comment_long_text_id).toFixed(2);
					requestJSON += '}';
				});
			}
			requestJSON +=' ]}}';

			// Reset Order Sentence Ids
			if(createdOrderSentences != undefined) {
				createdOrderSentences.forEach(function(createdOrderSentence, index){
					var orderSentenceId = createdOrderSentence.order_sentence_id, orderSentenceObject;
					orderSentences.forEach(function(curOrderSentence){
						if(curOrderSentence.getAttribute("ORDER_SENTENCE_ID") === orderSentenceId) {
							orderSentenceObject = curOrderSentence
							return;
						}
					});
					if(!(orderSentenceObject === void 0) && !(orderSentenceObject === null)) {
						orderSentenceObject.setAttribute("ORDER_SENTENCE_ID", 0.0);
					}
				});
			}
			
			// Delete Order Sentence Ids
			var scriptRequest = new ScriptRequest();
			scriptRequest.setProgramName("INN_ORM_DEL_ORD_SENTENCES");
			scriptRequest.setParameterArray(scriptParameters);
			scriptRequest.setDataBlob(requestJSON);
			scriptRequest.setResponseHandler(function(reply){
				var statusData = reply.getStatus(), status = statusData.STATUS, successInd = true;
						if(status === "F") {
							successInd = false;
							handleError("destroyOrderSentences()", statusData);
						}
						callBackFunction(successInd);
			});
			scriptRequest.performRequest();
			
		} catch(e) {
			alert("Error - >" + e.message + "OrderSentenceManager.destroyOrderSentences()")
		}
	});

	OrderSentenceManager.method("getEditViewType", function() {
		return editViewType;
    });

	OrderSentenceManager.method("setEditViewType", function(viewType) {
		editViewType = viewType;
    });

    OrderSentenceManager.method("getTabIndexOffset", function () {
    	return tabIndexOffset;
    });

    OrderSentenceManager.method("setTabIndexOffset", function (value) {
    	tabIndexOffset = parseInt(value, 10);
    });

	OrderSentenceManager.method("getOrdersWithMissingRequiredDetails",function(){
		var missingRequired = [];
		orders.forEach(function(order){
			if(order.hasMissingRequiredDetails()){
				missingRequired.push(order);
			}
		});
		return(missingRequired);
	});

});
var OrderSentence = (function(){
	OrderSentence.method("reset", function() {
		delete orderEntryDetails;
		$(this.editDetailsElement).remove();
	});

	OrderSentence.method("remove", function(curSentenceManager) {
		this.reset();
		curSentenceManager.removeOrderSentence(this);
	});

	OrderSentence.method("anyDetailsToAdd", function(){
		var orderEntryDetails = this.getVirtualAndOrderEntryDetails();
		var anyDetailsInd = false;

		// build detail list and display line
		if(orderEntryDetails != undefined) {
			orderEntryDetails.forEach(function(oeDetail, index){
				if(oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE") > " ") {
					anyDetailsInd = true;
				}
			});
		}
		return(anyDetailsInd);
	});

	OrderSentence.method("buildScriptRequestJSON", function () {
		var Request = {},
			detail_list = [],
			displayLine = "";
		var orderEntryDetails = this.getVirtualAndOrderEntryDetails();
		var attributes = this.getAttributes();
		var displayDetailCnt = 0;
		var validDetailCnt = 0;
		var detailDisplay = "";

		// build detail list and display line
		if (orderEntryDetails != undefined) {
			orderEntryDetails.forEach(function (oeDetail, index) {
				var clinLineLabel = oeDetail.getAttribute("CLIN_LINE_LABEL");
				// valid display defined
				if (oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE") > " ") {

					//for PRN
					if (oeDetail.getAttribute("OE_FIELD_MEANING") == "SCH/PRN") {
						//the display value is PRN for yes
						//the display value is empty for no
						detailDisplay = oeDetail.getAttribute("OE_FIELD_VALUE") == 1 ? "PRN" : "";
					} else {
						detailDisplay = oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");
					}


					// apply the clinical display line prefix/suffix to the detailDisplay
					if (parseInt(oeDetail.getAttribute("CLIN_LINE_IND"), 10) == 1 && clinLineLabel > " ") {
						// has a prefix label
						if (parseInt(oeDetail.getAttribute("CLIN_SUFFIX_IND"), 10) == 0) {
							detailDisplay = clinLineLabel + " " + detailDisplay;
						}
						// has a suffix label
						else {
							detailDisplay = detailDisplay + " " + clinLineLabel;
						}
					}

					// build display line for a non-empty detail
					if (detailDisplay > " ") {
						if (displayDetailCnt > 0) {
							displayLine += ", ";
						}
						displayLine += detailDisplay;
						displayDetailCnt += 1;
					}
					validDetailCnt += 1;

					var detailValue = oeDetail.getAttribute("OE_FIELD_VALUE");

					//if not a decimal-> add .00 for the number to be treated as decimal
					if (parseFloat(detailValue) % 1 == 0) {
						detailValue = detailValue.toFixed(2);
					} else {
						detailValue = "" + detailValue;
					}

					var currentDetail = {
						"oe_field_id": oeDetail.getAttribute("OE_FIELD_ID").toFixed(2),
						"oe_field_display_value": "" + oeDetail.getAttribute("OE_FIELD_DISPLAY_VALUE"),
						"oe_field_value": detailValue,
						"oe_field_meaning_id": oeDetail.getAttribute("OE_FIELD_MEANING_ID").toFixed(2),
						"field_type_flag": oeDetail.getAttribute("FIELD_TYPE_FLAG"),
						"sequence": (validDetailCnt)
					};
					detail_list[detail_list.length] = currentDetail;
				}
			});
		}
		Request = {
			"order_sentence_display_line": displayLine,
			"order_sentence_id": attributes["ORDER_SENTENCE_ID"].toFixed(2),
			"oe_format_id": attributes["OE_FORMAT_ID"].toFixed(2),
			"parent_entity_name": "ORDER_CATALOG_SYNONYM",
			"parent_entity_id": attributes["SYNONYM_ID"].toFixed(2),
			"parent_entity2_name": "",
			"parent_entity2_id": (0).toFixed(2),
			"detail_cnt": detail_list.length,
			"detail_list": detail_list
		};

		return (JSON.stringify(Request));
	});


	//initialize function
	OrderSentence.method("initialize", function (oeDetails, curSentenceManager) {
		var self = this;
		var editViewType = curSentenceManager.getEditViewType();
		// Add to Order Sentence Manager only if valid number of order details are present
		if (oeDetails.length > 0) {
			curSentenceManager.addOrderSentence(this);
		}
		// initialize attributes
		this.setAttributes({
			"ORDER_SENTENCE_ID": 0.00,
			"SYNONYM_ID": 0.0,
			"OE_FORMAT_ID": 0.0,
			"ACTION_TYPE": "ORDER"
		});
		this.setOrderEntryDetails([]);

		var currentSequence = curSentenceManager.getCurrentOrderSentenceSeq();
		switch (editViewType) {
			case "ENHANCED": // build the enhanced edit view
				self.buildEnhancedView(oeDetails, currentSequence, curSentenceManager.getTabIndexOffset());
				break;
			default:
				// build the detail line
				self.buildLine(oeDetails, currentSequence);
				break;
		}
	});


	// Initialize order sentence control
	this.initialize.apply(this,arguments);
});

// Inherit Order Details Edit control
OrderSentence.inherits(OrderDetailsEdit);// Requires Jquery, Underscore
var OrderEntryDetail = function (defaultAttributes, callBack, options) {
	var attributes = {};
	var self = this;
	var orderEntryElement, REQUIRED_DETAIL_FLAG = 0;
	var parentAttributes = {};
	var changedDetail = false;
	var detailDisplayType = "DEFAULT";

	this.hasChanged = function () {
		return (changedDetail);
	};

	this.getAttributes = function () {
		return (attributes);
	};
	this.setAttributes = function (newAttributes) {
		$.extend(attributes, newAttributes);
	};
	this.getAttribute = function (attribute) {
		return (attributes[attribute]);
	};
	this.setAttribute = function (attribute, value) {
		if ((typeof value).toUpperCase() === "OBJECT") {
			value = $.clone(value);
		}
		attributes[attribute] = value;
	};
	this.getParentAttributes = function () {
		return (parentAttributes);
	};
	this.setParentAttributes = function (newAttributes) {
		$.extend(parentAttributes, newAttributes);
	};
	this.getParentAttribute = function (attribute) {
		return (parentAttributes[attribute]);
	};
	this.setParentAttribute = function (attribute, value) {
		if ((typeof value).toUpperCase() === "OBJECT") {
			value = $.clone(value);
		}
		parentAttributes[attribute] = value;
	};
	this.getElement = function () {
		return (orderEntryElement);
	};
	this.getDisplayType = function () {
		return (detailDisplayType);
	};
	this.setDisplay = function () {
		var field_display_value;
		var field_value;
		var field_type_flag;
		field_display_value = attributes["OE_FIELD_DISPLAY_VALUE"];
		field_value = parseFloat(attributes["OE_FIELD_VALUE"]);
		field_type_flag = parseInt(attributes["FIELD_TYPE_FLAG"], 10);
		if (field_type_flag == 7) {
			if (field_value === 1) {
				this.setAttribute("OE_FIELD_DISPLAY_VALUE", "Yes");
			} else {
				if (field_display_value == "0") {
					this.setAttribute("OE_FIELD_DISPLAY_VALUE", "");
				} else {
					// for other no
					if (this.getAttribute("OE_FIELD_DISPLAY_VALUE") > " ") {
						this.setAttribute("OE_FIELD_DISPLAY_VALUE", "No");
					}
				}
			}
		} else if (field_type_flag == 6) {
			if (field_value === 0) {
				this.setAttribute("OE_FIELD_DISPLAY_VALUE", "");
			}
		}
	};
	this.updateDisplay = function (options) {
		var displayValue, previousDisplayValue;
		var editContainer = $(".oe-edit-popup", orderEntryElement);
		var displayElement = $(".oe-detail-display", orderEntryElement);
		var displayElementTag = displayElement.prop("tagName").toUpperCase();
		this.setDisplay();
		displayValue = this.getDisplayValue();
		previousDisplayValue = displayElement.html();

		var field_value = parseFloat(attributes["OE_FIELD_VALUE"]);
		var field_display_value = attributes["OE_FIELD_DISPLAY_VALUE"];

		// change display only on default type
		if (detailDisplayType === "DEFAULT") {
			displayElement.html(displayValue);
		} else {
			switch (displayElementTag) {
				// for select and input type elements
				case "SELECT":
				case "INPUT":
					// only a true change in value -> update the value field
					if (displayElement.val() != field_value) {
						// if a select element tag  with no options loaded -> update the option manually
						if (displayElementTag === "SELECT" && !displayElement.attr("options-loaded")) {
							displayElement.children().first().val(field_value).html(field_display_value);
						}
						// set the value of display element
						displayElement.val(field_value);
					}
					break;
			}
		}

		// trigger events
		if (!options || options.silent == false) {
			// trigger a full value change if there was a delta and the previous value wasn't blank
			if (previousDisplayValue !== displayValue && previousDisplayValue.indexOf('&lt;') < 0) {
				$(orderEntryElement).trigger("full-change-value", [this, editContainer]);
			}
			$(orderEntryElement).trigger("change-value", [this]);
		}
	};
	this.isRequired = function () {
		return $(".oe-detail-display", orderEntryElement).hasClass("oe-required-field");
	};
	this.setRequired = function (isRequired) {
		var oeElement = $(".oe-detail-display", orderEntryElement);
		if (isRequired) {
			oeElement.addClass("oe-required-field");
		} else {
			oeElement.removeClass("oe-required-field");
		}
	};

	this.getDisplayValue = function () {
		var displayValue;
		var field_display_value;
		var field_value;
		var field_type_flag;
		var accept_flag;
		field_display_value = attributes["OE_FIELD_DISPLAY_VALUE"];
		field_value = parseFloat(attributes["OE_FIELD_VALUE"]);
		accept_flag = parseInt(attributes["ACCEPT_FLAG"], 10);
		field_type_flag = parseInt(attributes["FIELD_TYPE_FLAG"], 10);

		// Use display value if present, else use description
		if (field_display_value && field_display_value > " ") {
			// For Yes/No default to display name is description
			if (field_type_flag == 7) {
				displayValue = attributes["LABEL_TEXT"] + "&nbsp;[" + field_display_value + "]";
			} else {
				displayValue = field_display_value;
			}
		} else {
			displayValue = "&lt;" + attributes["LABEL_TEXT"] + "&gt;";
		}

		// set required based on display value
		if (attributes["OE_FIELD_DISPLAY_VALUE"] === "" && accept_flag === REQUIRED_DETAIL_FLAG) {
			this.setRequired(true);
		} else {
			this.setRequired(false);
		}
		return (displayValue);
	};

	this.createElement = function () {
		var oeElement, tabIndex = (parseInt(attributes["DETAIL_SEQ"], 10) + parseInt(attributes["SENTENCE_SEQ"], 10) * 100);
		var clinLineLabel = attributes["CLIN_LINE_LABEL"];
		var oeFieldMeaning = attributes["OE_FIELD_MEANING"];
		var acceptClass = OrderEntryFields.getAcceptClassByFlag(attributes["ACCEPT_FLAG"]);
		// set the display HTML
		var displayHTML = "<span class='oe-detail-display' tabIndex='" + tabIndex + "'></span>";
		// has a label
		if (parseInt(attributes["CLIN_LINE_IND"], 10) == 1 && clinLineLabel > " ") {
			// has a prefix label
			if (parseInt(attributes["CLIN_SUFFIX_IND"], 10) === 0) {
				displayHTML = "<span class='oe-detail-label-prefix'>" + clinLineLabel + "&nbsp;</span>" + displayHTML;
			}
			// has a suffix label
			else {
				displayHTML = displayHTML + "<span class='oe-detail-label-suffix'>&nbsp;" + clinLineLabel + "</span>";
			}
		}
		oeElement = $("<span class='oe-detail " + acceptClass + "' oe-field-meaning='" + oeFieldMeaning + "' >" + displayHTML + "</span>");
		return (oeElement);
	};

	this.triggerFocusOut = function () {
		$(orderEntryElement).trigger("focus-out");
	};

	this.triggerFocusIn = function () {
		$(orderEntryElement).trigger("focus-in");
	};

	this.listenFocusOut = function (callBack) {
		$(orderEntryElement).bind("focus-out", {
			"orderEntryElement": orderEntryElement
		}, callBack);
	};

	this.listenFocusIn = function (callBack) {
		$(orderEntryElement).bind("focus-in", callBack);
	};

	this.listenCreatedEditView = function (callBack) {
		$(orderEntryElement).bind("created-edit-view", callBack);
	};

	this.listenChangedDetail = function (callBack) {
		$(orderEntryElement).bind("active-changed-value", {
			"orderEntryElement": orderEntryElement
		}, callBack);
	};

	this.triggerChangedDetail = function (callBack) {
		$(orderEntryElement).trigger("active-changed-value");
	};

	this.setChanged = function (value) {
		changedDetail = value;
	};


	this.encodeAttributeValue = function (attribute) {
		var encodedValue = this.getAttribute(attribute);
		encodedValue = encodedValue.replace("&", "&amp;");
		encodedValue = encodedValue.replace("<", "&lt;");
		encodedValue = encodedValue.replace(">", "&gt;");
		encodedValue = encodedValue.replace("\'", "&quot;");
		encodedValue = encodedValue.replace("\"", "&apos;");
		encodedValue = encodedValue.replace("/", ".");
		encodedValue = encodedValue.replace(" ", "-");
		return (encodedValue);
	};

	this.revertDisplay = function () {
		self.changeDisplay(self.getAttribute("PREV_OE_FIELD_DISPLAY_VALUE"), orderEntryElement);
	}

	this.changeDisplay = function (newDisplay, orderEntryElement) {
		var editContainer = $(".oe-edit-popup", orderEntryElement);

		if (editContainer != null) {
			var textElement = $(".oe-edit-value", editContainer);
			if (textElement.length > 0) {
				textElement.html(newDisplay);
				// call set text display
				OrderEntryFields.setTextValue(self, editContainer);
			}
		}

	}


	//initialize function
	function initialize() {
		// Set any default attributes
		if (!defaultAttributes || defaultAttributes === null || defaultAttributes === {}) {
			defaultAttributes = {
				"GROUP_SEQ": 0,
				"FIELD_SEQ": 0,
				"ACCEPT_FLAG": 0,
				"OE_FIELD_ID": 0,
				"OE_FIELD_VALUE": 0,
				"OE_FIELD_DISPLAY_VALUE": "",
				"PREV_OE_FIELD_DISPLAY_VALUE": "",
				"OE_FIELD_MEANING_ID": 0,
				"OE_FIELD_MEANING": "",
				"FIELD_TYPE_FLAG": 0,
				"OE_FIELD_DESCRIPTION": "",
				"CODESET": 0,
				"LABEL_TEXT": ""
			};
		}
		self.setAttributes(defaultAttributes);

		var prebuiltView = null;
		if (options) {
			// set any pre-built view
			prebuiltView = options.PREBUILT_VIEW;
			// set the detail display
			detailDisplayType = options.DETAIL_DISPLAY_TYPE || detailDisplayType;
		}

		// pre-built view ? -> set it to the order entry element
		if (prebuiltView) {
			orderEntryElement = prebuiltView;
		} else {
			//Create element and attach any call backs
			orderEntryElement = self.createElement();
			// Update display value
			self.updateDisplay({
				"silent": true
			});
		}

		//callback function not defined -> use default display edit
		if (!callBack || !$.isFunction(callBack)) {
			callBack = OrderEntryFields.displayEdit;
		}

		$(".oe-detail-display", orderEntryElement).focus(function (event, eventData) {
			if (!eventData || (eventData && eventData.DO_NOT_DISPLAY != true)) {
				self.triggerFocusIn();
				callBack(event, self);
			}
		});

		// set changed indicator to true if value changes
		$(orderEntryElement).bind("change-value", function () {
			changedDetail = true;
		});

	}

	initialize();
};
//Require orderEntryDetail
var OrderEntryFields = (new function () {
	var code_set_cache = {};
	var self = this;
	var order_entry_fields_cache = {};
	var currentEditContainer = null;
	var displayPref = "popup";
	var editRowTRPref = "";
	var _originalOrderDetailDisplayOnEditPopup = false;

	// Encode line breaks into HTML character code
	function encodeLineBreaks(stringValue) {
		if (stringValue && stringValue != undefined && stringValue > " ") {
			return stringValue.replace(/\n/g, '&#10;').replace(/\r/g, '&#13;');
		} else {
			return "";
		}
	}

	function buildOptionsEditShell(orderEntryDetail, options) {
		var EditShellHtml = [];
		var headerDisplay;
		var field_value = orderEntryDetail.getAttribute("OE_FIELD_VALUE");
		var field_description = orderEntryDetail.getAttribute("OE_FIELD_DESCRIPTION");
		var field_display_value = orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");

		// specify the header
		// if no display value defined -> Use the field description
		if (field_display_value === "") {
			headerDisplay = field_description;
		}
		//else use the display value
		else {
			headerDisplay = field_display_value;
		}

		EditShellHtml.push("<div class='oe-edit-popup'>");
		EditShellHtml.push("<table class='oe-edit-tbl'>");
		EditShellHtml.push("<tr><td class='oe-edit-tab'><span class='oe-edit-tab-hdr'>", headerDisplay, "</span></td><td class='oe-edit-tab-crnr'></td></tr>");
		EditShellHtml.push("<tr class='oe-edit-row-hd'><td class='oe-edit-row-tl'>&nbsp; </td><td class='oe-edit-row-tr'>&nbsp;</td></tr>");
		EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-l' colspan='2'>");
		if (options !== null && $.isArray(options)) {
			EditShellHtml.push("<select  size='6' class='oe-edit-value'>");
			EditShellHtml.push("<option value='0.00'></option>");
			if (options != undefined) {
				options.forEach(function (option) {
					if (field_display_value.toUpperCase() === option.DISPLAY.toUpperCase()) {
						EditShellHtml.push("<option selected value='" + option.CODE + "'>", option.DISPLAY, "</option>");
					} else {
						EditShellHtml.push("<option value='" + option.CODE + "'>", option.DISPLAY, "</option>");
					}
				});
			}
			EditShellHtml.push("</select>");
		}
		EditShellHtml.push("</td></tr>");
		EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-b oe-edit-container-footer' colspan='2'>&nbsp; </td></tr>");
		EditShellHtml.push("</table>");
		EditShellHtml.push("</div>");
		return (EditShellHtml.join(""));
	}

	function buildFreeTextEditShell(orderEntryDetail, tagName) {
		var EditShellHtml = [];
		var headerDisplay;
		var field_description = orderEntryDetail.getAttribute("OE_FIELD_DESCRIPTION");
		var field_display_value = orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");

		// use field description for multi-line details
		if (tagName === "textarea") {
			headerDisplay = field_description;
		}
		// use field description if no value provided
		else {
			if (field_display_value === "") {
				headerDisplay = field_description;
			} else {
				headerDisplay = field_display_value;
			}
		}

		EditShellHtml.push("<div class='oe-edit-popup'>");
		EditShellHtml.push("<table class='oe-edit-tbl'>");
		EditShellHtml.push("<tr><td class='oe-edit-tab'><span class='oe-edit-tab-hdr'>", headerDisplay, "</span></td><td class='oe-edit-tab-crnr'></td></tr>");
		EditShellHtml.push("<tr class='oe-edit-row-hd'><td class='oe-edit-row-tl'>&nbsp; </td>");
		if (editRowTRPref == "") {
			//default
			EditShellHtml.push("<td class='oe-edit-row-tr'>&nbsp;</td></tr>");
		} else {
			EditShellHtml.push("<td class='oe-edit-row-tr'>", editRowTRPref, "</td></tr>");
		}
		EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-l' colspan='2'>");
		if (tagName === "textarea") {
			EditShellHtml.push("<textarea type='text' class='oe-edit-value'>", field_display_value, "</textarea>");
		} else {
			EditShellHtml.push("<input type='text' class='oe-edit-value' value='", field_display_value, "' />");
		}
		EditShellHtml.push("</td></tr>");
		EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-b oe-edit-container-footer' colspan='2'>&nbsp; </td></tr>");
		EditShellHtml.push("</table>");
		EditShellHtml.push("</div>");
		return (EditShellHtml.join(""));
	}

	function buildCodeSetEditShell(orderEntryDetail) {
		var EditShellHtml = [];
		var headerDisplay;
		var field_value = orderEntryDetail.getAttribute("OE_FIELD_VALUE");
		var field_description = orderEntryDetail.getAttribute("OE_FIELD_DESCRIPTION");
		var field_display_value = orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");
		var options = null;
		var oeFieldCache = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)];
		var oeField = oeFieldCache.OE_FIELD_DATA;
		var cachedCodeSet = code_set_cache[getCodeSetCacheKey(oeFieldCache)];

		// Not an undefined codeSet
		if (cachedCodeSet) {
			options = cachedCodeSet;
		}
		// Use the field description if no value defined
		if (field_display_value === "") {
			headerDisplay = field_description;
		} else {
			headerDisplay = field_display_value;
		}

		EditShellHtml.push("<div class='oe-edit-popup'>");
		EditShellHtml.push("<table class='oe-edit-tbl'>");
		EditShellHtml.push("<tr><td class='oe-edit-tab'><span class='oe-edit-tab-hdr'>", headerDisplay, "</span></td><td class='oe-edit-tab-crnr'></td></tr>");
		EditShellHtml.push("<tr class='oe-edit-row-hd'><td class='oe-edit-row-tl'>&nbsp; </td><td class='oe-edit-row-tr'>&nbsp;</td></tr>");
		EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-l' colspan='2'>");
		if (options != null && $.isArray(options)) {
			EditShellHtml.push("<select  size='6' class='oe-edit-value'>");
			EditShellHtml.push("<option value='0.00'></option>");
			if (options != undefined) {
				options.forEach(function (option) {
					if (field_display_value.toUpperCase() === option.DISPLAY.toUpperCase()) {
						EditShellHtml.push("<option selected value='" + option.CODE + "'>", option.DISPLAY, "</option>");
					} else {
						EditShellHtml.push("<option value='" + option.CODE + "'>", option.DISPLAY, "</option>");
					}
				});
			}
			EditShellHtml.push("</select>");
		}
		EditShellHtml.push("</td></tr>");
		EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-b oe-edit-container-footer' colspan='2'>&nbsp; </td></tr>");
		EditShellHtml.push("</table>");
		EditShellHtml.push("</div>");
		return (EditShellHtml.join(""));
	}


	function setPosition(parentElement, editContainer) {
		parentElement = parentElement.get(0);
		var p = $(parentElement).position();
		var top = p.top;
		var left = p.left;
		var tblAdded = $(".oe-edit-tbl", editContainer);

		if (!_originalOrderDetailDisplayOnEditPopup) {
			$(".oe-edit-tab", tblAdded).hide();
			$(".oe-edit-row-tl", tblAdded).css("border-top", "2px solid #568ECB");
			// hiding the first table row means we'll need to have a buffer for the popup
			top += $(parentElement).height();
		}

		if (displayPref == "inline") {
			editContainer.css("display", "inline");
			editContainer.css("position", "relative");
			tblAdded.css("display", "block");
		} else {
			// tblAdded.css("display","block");
			editContainer.css("display", "block");
			editContainer.css("position", "absolute");
			editContainer.css("left", left + "px");
			editContainer.css("top", top + "px");
		}

	}

	function launchEditTextPopup(editContainer, orderEntryDetail, multiLineInd) {
		var orderEntryDetailElement = orderEntryDetail.getElement();
		var displayType = orderEntryDetail.getDisplayType();
		// Embedded display for detail
		if (displayType == "EMBEDDED") {
			var textElement = $(".oe-detail-display", orderEntryDetailElement);
			var textParentElement = textElement.parent();
			// if select element has no options loaded
			if (!textParentElement.attr("text-loaded")) {
				// trigger created edit view event
				$(orderEntryDetailElement).trigger("created-edit-view", [editContainer]);
				// get the element to update
				var elementToUpdate = $(".oe-edit-value", editContainer);
				// set attributes
				elementToUpdate.get(0).className = textElement.get(0).className;
				elementToUpdate.get(0).tabIndex = textElement.get(0).tabIndex;

				// reset the text element to the new element
				textElement = elementToUpdate;
				// add the new element
				textParentElement.empty().append(elementToUpdate);
				elementToUpdate.focus();
				textElement.keyup(function (keyupEvent) {
					//Update the text value
					setTextValue(orderEntryDetail, orderEntryDetailElement);
					orderEntryDetail.triggerChangedDetail();

				});
				textParentElement.attr("text-loaded", true);
			}
		} else {
			// Edit Container not already appended to order detail entry element
			if (!editContainer.parent().is(orderEntryDetailElement)) {

				// trigger created edit view event
				$(orderEntryDetailElement).trigger("created-edit-view", [editContainer]);

				var hideEvent = function (hideEvent) {
					setTextValue(orderEntryDetail, editContainer);
					// orderEntryDetailElement.css("position", "static");
					orderEntryDetail.triggerFocusOut();
					editContainer.hide();
				};

				$(".oe-edit-value", editContainer).attr("tabIndex", $(".oe-detail-display", orderEntryDetailElement).attr("tabIndex"));
				$(".oe-edit-value", editContainer).focusout(hideEvent);
				$(".oe-edit-value", editContainer).dblclick(hideEvent);
				$(".oe-edit-value", editContainer).keyup(function (keyupEvent) {
					if (keyupEvent.which === 13) {
						hideEvent(keyupEvent);
						keyupEvent.preventDefault();
					}
					orderEntryDetail.triggerChangedDetail();
				});

				// focus event to stop propogation to parent element
				$(".oe-edit-value", editContainer).focus(function (focusEvent) {
					focusEvent.stopPropagation();
				});

				// append container to body for display
				$(orderEntryDetailElement).append(editContainer);
				// 'hack' to fix positioning issues in IE the first time these popups are shown
				setPosition(orderEntryDetailElement, editContainer);

			}
			// show existing edit container
			else {
				if (!multiLineInd) {
					// Update the tab display with value
					updateTabHeader(orderEntryDetail, editContainer);
				}
				editContainer.show();
			}

			// position container
			setPosition(orderEntryDetailElement, editContainer);

			currentEditContainer = editContainer;

			// set focus on container
			$(".oe-edit-value", editContainer).focus();
			orderEntryDetail.triggerFocusIn();
		}
	}

	function updateTabHeader(orderEntryDetail, editContainer) {
		var field_description = orderEntryDetail.getAttribute("OE_FIELD_DESCRIPTION");
		var field_display_value = orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");
		var headerDisplay;

		// specify the header
		// if no display value defined -> Use the field description
		if (field_display_value === "") {
			headerDisplay = field_description;
		}
		//else use the display value
		else {
			headerDisplay = field_display_value;
		}
		$(".oe-edit-tab-hdr", editContainer).html(headerDisplay);
	}

	function launchEditSelectPopup(editContainer, orderEntryDetail) {
		var orderEntryDetailElement = orderEntryDetail.getElement();
		var field_display_value = orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE");
		var field_type_flag = orderEntryDetail.getAttribute("FIELD_TYPE_FLAG");
		var displayType = orderEntryDetail.getDisplayType();
		// Embedded display for detail
		if (displayType == "EMBEDDED") {
			var selectElement = $(".oe-detail-display", orderEntryDetailElement);
			// if select element has no options loaded
			if (!selectElement.attr("options-loaded")) {
				var optionsToAdd = $(".oe-edit-value", editContainer).children();
				selectElement.empty().append(optionsToAdd);
				// setup event handler on change
				selectElement.change(function (event) {
					setSelectValue(orderEntryDetail, orderEntryDetailElement);
				});
				selectElement.attr("options-loaded", true);
				//trigger click to re-open
				selectElement.focusout();
			}
		} else {
			// Edit Container not already appended to order detail entry element
			if (!editContainer.parent().is(orderEntryDetailElement)) {
				var hideEvent = function (hideEvent) {
					setSelectValue(orderEntryDetail, editContainer);
					// orderEntryDetailElement.css("position", "static");
					orderEntryDetail.triggerFocusOut();
					editContainer.hide();
				};

				$(".oe-edit-value", editContainer).attr("tabIndex", $(".oe-detail-display", orderEntryDetailElement).attr("tabIndex"));
				$(".oe-edit-value", editContainer).focusout(hideEvent);
				$(".oe-edit-value", editContainer).dblclick(hideEvent);
				$(".oe-edit-value", editContainer).keyup(function (keyupEvent) {
					if (keyupEvent.which == 13) {
						hideEvent(keyupEvent);
						keyupEvent.preventDefault();
					}
				});

				// focus event to stop propogation to parent element
				$(".oe-edit-value", editContainer).focus(function (focusEvent) {
					focusEvent.stopPropagation();
				});

				// append container to body for display
				$(orderEntryDetailElement).append(editContainer);
				// 'hack' to fix positioning issues in IE the first time these popups are shown
				setPosition(orderEntryDetailElement, editContainer);
			}
			// show existing edit container
			else {
				// Update the tab display with value
				updateTabHeader(orderEntryDetail, editContainer);
				editContainer.show();
				// select values from dropdown
				$(".oe-edit-value option").filter(function () {
					return $(this).text().toUpperCase() == field_display_value.toUpperCase();
				}).attr('selected', true);
			}

			// position container
			setPosition(orderEntryDetailElement, editContainer);

			currentEditContainer = editContainer;

			// set focus on container
			$(".oe-edit-value", editContainer).focus();
			orderEntryDetail.triggerFocusIn();
		}
	}

	function setTextValue(orderEntryDetail, editContainer) {
		var textElement = $(".oe-edit-value", editContainer);
		var textValue = textElement.val();
		var integertextValue = textValue.split(" ").join("");
		var integerValue = parseFloat(integertextValue);
		if (textValue >= "") {
			// set the previous value
			orderEntryDetail.setAttribute("PREV_OE_FIELD_DISPLAY_VALUE", orderEntryDetail.getAttribute("OE_FIELD_DISPLAY_VALUE"));
			orderEntryDetail.setAttribute("OE_FIELD_DISPLAY_VALUE", encodeLineBreaks(textValue));
			if ($.isNumeric(integerValue)) {
				orderEntryDetail.setAttribute("OE_FIELD_VALUE", integerValue);
			} else {
				orderEntryDetail.setAttribute("OE_FIELD_VALUE", 0); // reset OE_FIELD_VALUE
			}
			orderEntryDetail.updateDisplay();
		}
	}

	function setSelectValue(orderEntryDetail, editContainer) {
		var selectElement = $(".oe-edit-value", editContainer).get(0);
		var selectedIndex = selectElement.selectedIndex;
		var selectedOption;
		if (selectedIndex >= 0) { // valid selection made
			selectedOption = selectElement.options[selectedIndex];
			orderEntryDetail.setAttribute("OE_FIELD_DISPLAY_VALUE", selectedOption.innerHTML);
			orderEntryDetail.setAttribute("OE_FIELD_VALUE", parseFloat(selectedOption.value));
			orderEntryDetail.updateDisplay();
		}
	}


	function getOeFieldCacheKey(orderEntryDetail) {
		var keyString = "";
		var actionType = orderEntryDetail.getParentAttribute("ACTION_TYPE") || "DEFAULT";
		var oeSynonymId = orderEntryDetail.getParentAttribute("SYNONYM_ID") || 0;
		var oeFieldId = orderEntryDetail.getAttribute("OE_FIELD_ID");
		keyString = actionType + "_" + oeSynonymId + "_" + oeFieldId;
		return (keyString);
	}

	function getCodeSetCacheKey(oeFieldCache) {
		var keyString = "";
		var oeFieldData = oeFieldCache.OE_FIELD_DATA;
		var oeFieldMeaning = oeFieldData["OE_FIELD_MEANING"];
		var codeSet = oeFieldData.CODESET;
		var identifier = "";
		switch (oeFieldCache.OE_FORMAT_DATA.FILTER_PARAMS) {
			case "ORDERABLE":
				identifier = oeFieldCache.ORDER_CATALOG_DATA.CATALOG_CD;
				break;
			case "ACTIVITY TYPE":
				identifier = oeFieldCache.ORDER_CATALOG_DATA.ACTIVITY_TYPE_CD;
				break;
			case "CATALOG TYPE":
				identifier = oeFieldCache.ORDER_CATALOG_DATA.CATALOG_TYPE_CD;
				break;
			default:
				identifier = "DEFAULT";
		}

		keyString = oeFieldMeaning + "_" + codeSet + "_" + identifier;
		return (keyString);
	}


	this.setTextValue = setTextValue;

	this.isFieldEditable = function (curOeDetail) {
		var fieldTypeFlag = curOeDetail.FIELD_TYPE_FLAG;
		var codeSet = curOeDetail.CODESET;
		var oeFieldMeaning = curOeDetail.OE_FIELD_MEANING;

		var displayDetail = false;
		switch (fieldTypeFlag) {
			case 0:
			case 1:
			case 2:
			case 6:
			case 7:
				displayDetail = true;
				break;
			case 12:
				if (codeSet > 0 || oeFieldMeaning == "REASONFOREXAM") {
					displayDetail = true;
				}
				break;
		}
		return (displayDetail)
	}

	this.setOriginalOrderDetailDisplayOnEditPopup = function (val) {
		// truthiness!
		_originalOrderDetailDisplayOnEditPopup = val ? true : false;
	};

	this.getOriginalOrderDetailDisplayOnEditPopup = function () {
		return _originalOrderDetailDisplayOnEditPopup;
	};

	// cleanup
	this.reset = function () {
		delete code_set_cache;
		delete order_entry_fields_cache;
		code_set_cache = {};
		order_entry_fields_cache = {};
		// Remove any existing containers
		$("div.oe-edit-popup").remove();
		// Reset events and container
		if (currentEditContainer !== null) {
			currentEditContainer.remove();
			currentEditContainer = null;
		}
	};

	this.displayEdit = function (event, orderEntryDetail) {

		var fieldTypeFlag = orderEntryDetail.getAttribute("FIELD_TYPE_FLAG");
		var oeFieldId = orderEntryDetail.getAttribute("OE_FIELD_ID");
		var codeSet = orderEntryDetail.getAttribute("CODESET");
		var oeFieldMeaning = orderEntryDetail.getAttribute("OE_FIELD_MEANING");
		var callBackFunction = null;

		switch (fieldTypeFlag) {
			case 0:
				callBackFunction = self.alphaNumericEdit;
				break;
			case 1:
				callBackFunction = self.integerEdit;
				break;
			case 2:
				callBackFunction = self.decimalEdit;
				break;
			case 6:
				callBackFunction = self.codeSetEdit;
				break;
			case 7:
				callBackFunction = self.yesNoEdit;
				break;
			case 12:
				if (codeSet > 0 || oeFieldMeaning == "REASONFOREXAM") {
					callBackFunction = self.codeSetEdit;
				}
				break;
		}
		// Not a null or undefined function
		if (!(callBackFunction === null) && !(callBackFunction === void 0)) {
			//If oe field was cached, use the cache value
			if (order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)] && (typeof order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)]).toUpperCase() === "OBJECT") {
				callBackFunction(orderEntryDetail);
			}
			//retrieve oe field details
			else {
				self.getOeField(orderEntryDetail, callBackFunction);
			}
		} else {
			self.doNothing();
		}
	};

	this.alphaNumericEdit = function (orderEntryDetail) {
		var orderEntryDetailElement = orderEntryDetail.getElement();
		var editContainer = $(".oe-edit-popup", orderEntryDetailElement);
		var oeField = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FIELD_DATA;
		var acceptSize = parseInt(oeField["ACCEPT_SIZE"], 10);
		var multiLineInd = true;

		// build edit container if not defined
		if (!editContainer.get(0)) {
			editContainer = $(buildFreeTextEditShell(orderEntryDetail, "textarea"));
			$("textarea.oe-edit-value", editContainer).attr("rows", 4);
			// max length
			if (acceptSize > 0) {
				// max length
				$("textarea.oe-edit-value", editContainer).on('keyup blur', function () {
					var val = $(this).val();

					// Trim the field if it has content over the maxlength.
					if (val.length > acceptSize) {
						$(this).val(val.slice(0, acceptSize));
					}
				});
			}
		}

		//launch edit Pop-up
		launchEditTextPopup(editContainer, orderEntryDetail, multiLineInd);
	};

	this.integerEdit = function (orderEntryDetail) {
		var orderEntryDetailElement = orderEntryDetail.getElement();
		var editContainer = $(".oe-edit-popup", orderEntryDetailElement);
		var oeField = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FIELD_DATA;
		var acceptSize = parseInt(oeField["ACCEPT_SIZE"], 10);
		var multiLineInd = false;

		// build edit container if not defined
		if (!editContainer.get(0)) {
			editContainer = $(buildFreeTextEditShell(orderEntryDetail, "input"));
			// max length
			if (acceptSize > 0) {
				$("input.oe-edit-value", editContainer).attr("maxlength", acceptSize);
			}
			// set integer input validation
			InputFieldValidation.integer($("input.oe-edit-value", editContainer));
		}

		//launch edit Pop-up
		launchEditTextPopup(editContainer, orderEntryDetail, multiLineInd);
	};

	this.decimalEdit = function (orderEntryDetail) {
		var orderEntryDetailElement = orderEntryDetail.getElement();
		var editContainer = $(".oe-edit-popup", orderEntryDetailElement);
		var oeField = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FIELD_DATA;
		var acceptSize = parseInt(oeField["ACCEPT_SIZE"], 10);
		var multiLineInd = false;

		// build edit container if not defined
		if (!editContainer.get(0)) {
			editContainer = $(buildFreeTextEditShell(orderEntryDetail, "input"));
			// max length
			if (acceptSize > 0) {
				$("input.oe-edit-value", editContainer).attr("maxlength", acceptSize);
			}
			// set integer input validation
			InputFieldValidation.decimal($("input.oe-edit-value", editContainer));
		}

		//launch edit Pop-up
		launchEditTextPopup(editContainer, orderEntryDetail, multiLineInd);
	};

	this.codeSetEdit = function (orderEntryDetail) {
		var oeFieldCache = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)];
		var cachedCodeSet;
		var oeFieldData = oeFieldCache.OE_FIELD_DATA;

		codeSet = oeFieldData.CODESET;
		cachedCodeSet = code_set_cache[getCodeSetCacheKey(oeFieldCache)];

		//If code set was cached, use the cached values
		if (cachedCodeSet) {
			if (cachedCodeSet && $.isArray(cachedCodeSet)) {
				self.displayCodeSetSelect(orderEntryDetail, codeSet);
			}
		}
		// retrieve code set values
		else {
			self.getCodeSet(orderEntryDetail, codeSet, self.displayCodeSetSelect);
		}
	};

	this.getCodeSet = function (orderEntryDetail, codeSet, callBackFunction) {
		// Ajax request for retrieving code value
		var parameters;
		var oeFieldCache = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)];
		var oeFieldData = oeFieldCache.OE_FIELD_DATA;
		var oeFormatData = oeFieldCache.OE_FORMAT_DATA;
		var oeCatalogData = oeFieldCache.ORDER_CATALOG_DATA;
		var oeFieldMeaning = oeFieldData["OE_FIELD_MEANING"];
		var jsonParams = '{ "OE_FIELD_DATA":{"FILTER_PARAMS": "' + oeFormatData.FILTER_PARAMS + '"' +
			', "CATALOG_TYPE_CD" : ' + parseFloat(oeCatalogData.CATALOG_TYPE_CD).toFixed(2) +
			', "ACTIVITY_TYPE_CD" : ' + parseFloat(oeCatalogData.ACTIVITY_TYPE_CD).toFixed(2) +
			', "CATALOG_CD" : ' + parseFloat(oeCatalogData.CATALOG_CD).toFixed(2) +
			'}}';

		//parameters = "^MINE^," + codeSet + ",^" + oeFieldMeaning + "^,@" + jsonParams.length + ":" + jsonParams + "@";
		parameters = ["^MINE^", codeSet,"^" + oeFieldMeaning + "^","@" + jsonParams.length + ":" + jsonParams + "@"];
		var scriptRequest = new ScriptRequest();
		scriptRequest.setProgramName("INN_OM_GET_OE_CODE_VALUES");
		scriptRequest.setParameterArray(parameters);
		scriptRequest.setResponseHandler(function(reply){
			var code_set_key = getCodeSetCacheKey(oeFieldCache);
			code_set_cache[code_set_key] = reply.getResponse().CODES;
			code_set_cache[code_set_key] = code_set_cache[code_set_key].sort(
				function (codeValue1, codeValue2) {
					var a = codeValue1.DISPLAY.toUpperCase(),
						b = codeValue2.DISPLAY.toUpperCase();
					if (a < b)
						return -1;
					if (a > b)
						return 1;
					return 0;
				});

			callBackFunction(orderEntryDetail, codeSet, code_set_cache[code_set_key]);
		});
		scriptRequest.performRequest();

	};
	//Retrive order entry field details
	this.getOeField = function (orderEntryDetail, callBackFunction) {
		var oeFieldId = orderEntryDetail.getAttribute("OE_FIELD_ID");
		var oeSynonymId = orderEntryDetail.getParentAttribute("SYNONYM_ID");
		var actionType = orderEntryDetail.getParentAttribute("ACTION_TYPE");

		//var parameters = "^MINE^," + "^" + actionType + "^" + "," + parseFloat(oeSynonymId).toFixed(2) + "," + parseFloat(oeFieldId).toFixed(2);
		var parameters = ["^MINE^", "^" + actionType + "^", parseFloat(oeSynonymId).toFixed(2), parseFloat(oeFieldId).toFixed(2)];
		var scriptRequest = new ScriptRequest();
		scriptRequest.setProgramName("INN_OM_GET_OEFIELD_FORMAT");
		scriptRequest.setParameterArray(parameters);
		scriptRequest.setResponseHandler(function(reply){
			var response = reply.getResponse();
			order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)] = {};
			order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FIELD_DATA = response.OE_FIELD;
			order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].OE_FORMAT_DATA = response.OE_FORMAT;
			order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)].ORDER_CATALOG_DATA = response.ORDER_CATALOG;
			callBackFunction(orderEntryDetail);
		});
		scriptRequest.performRequest();

	};

	this.getCachedOeFieldData = function (orderEntryDetail) {
		var oeFieldCache = order_entry_fields_cache[getOeFieldCacheKey(orderEntryDetail)];
		return (oeFieldCache);
	};

	this.displayCodeSetSelect = function (orderEntryDetail, codeSet) {
		var orderEntryDetailElement = orderEntryDetail.getElement(),
			editContainer = $(".oe-edit-popup", orderEntryDetailElement);

		// build edit container if not defined
		if (!editContainer.get(0)) {
			editContainer = $(buildCodeSetEditShell(orderEntryDetail, codeSet));
		}

		//launch edit Pop-up
		launchEditSelectPopup(editContainer, orderEntryDetail);
	};

	this.yesNoEdit = function (orderEntryDetail) {
		var orderEntryDetailElement = orderEntryDetail.getElement(),
			editContainer = $(".oe-edit-popup", orderEntryDetailElement);

		// build edit container if not defined
		if (!editContainer.get(0)) {
			editContainer = $(buildOptionsEditShell(orderEntryDetail, [{
				"CODE": 0.0,
				"DISPLAY": "No"
			}, {
				"CODE": 1.0,
				"DISPLAY": "Yes"
			}]));
		}

		//launch edit Pop-up
		launchEditSelectPopup(editContainer, orderEntryDetail);
	};

	this.doNothing = function () {};

	this.buildFreeTextEditShell = buildFreeTextEditShell;

	this.buildCodeSetEditShell = buildCodeSetEditShell;

	this.buildOptionsEditShell = buildOptionsEditShell;

	this.getCodeSetCache = function () {
		return (code_set_cache);
	};

	this.getCurrentEditContainer = function () {
		return (currentEditContainer);
	};

	this.setDisplayPreference = function (pref) {
		displayPref = pref;
	};

	this.setEditRowTRPreference = function (pref) {
		editRowTRPref = pref;
	};

	this.getAcceptClassByFlag = function (acceptFlag) {
		var acceptClass = "";
		// accept flag is specified -> define an accept class
		if (acceptFlag != undefined) {
			switch (acceptFlag) {
				case 0:
					acceptClass = "oe-format-required";
					break;
				case 1:
					acceptClass = "oe-format-optional";
					break;
			}
		}
		return (acceptClass);
	}
});
function PrnVirtualField(schPrnDetail, prnInstructionsDetail, prnReasonDetail, $fieldElement) {
    this.schPrnYesNo = schPrnDetail;
    this.reason = prnReasonDetail;
    this.reasonIndicator = 0;
    this.instructions = prnInstructionsDetail;
    this.instructionsIndicator = 0;
    this.pendingDetails = "";
    this.changed = 0;

    var virtualField = this;
    $fieldElement.on("blur", function (event) {
        virtualField.parsePrnInput($fieldElement.val());
        virtualField.pendingDetails = "";
        event.stopPropagation();
        event.preventDefault();
    });

    $fieldElement.on("change", function (event) {
        this.changed = 1;
        virtualField.pendingDetails = $fieldElement.val();
    });

    if (this.reason && this.reason.getAttribute("OE_FIELD_DISPLAY_VALUE") > " ") {
        this.reasonIndicator = 1;
        $fieldElement.val(this.reason.getAttribute("OE_FIELD_DISPLAY_VALUE"));
    } else if (this.instructions && this.instructions.getAttribute("OE_FIELD_DISPLAY_VALUE") > " ") {
        this.instructionsIndicator = 1;
        $fieldElement.val(this.instructions.getAttribute("OE_FIELD_DISPLAY_VALUE"));
    }
}

PrnVirtualField.prototype.getOrderEntryDetails = function () {
    if (this.changed) {
        this.parsePrnInput(this.pendingDetails);
        this.pendingDetails = "";
    }

    if (this.reasonIndicator) {
        return [this.schPrnYesNo, this.reason];
    } else if (this.instructionsIndicator) {
        return [this.schPrnYesNo, this.instructions];
    } else {
        return [this.schPrnYesNo];
    }
};

PrnVirtualField.prototype.parsePrnInput = function (prnInput) {
    prnInput = prnInput.trim();

    // clear
    if (!(prnInput > " ")) {
        this.clearPrnInstructions();
        this.clearPrnReason();
        this.setPrnYesNo(0);
        return;
    }

    var prn = this;
    OrderEntryFields.getOeField(prn.reason, function (prnReasonEntryDetail) {
        OrderEntryFields.getCodeSet(prnReasonEntryDetail, 4005, function (reason, code, reasonCodeSet) {
            var reasonUnit = prn.checkReasonUnit(prnInput, reasonCodeSet);
            if (reasonUnit) {
                prn.reasonIndicator = 1;
                prn.instructionsIndicator = 0;
                prn.clearPrnInstructions();
                prn.setPrnReason(reasonUnit);
            } else {
                prn.reasonIndicator = 0;
                prn.instructionsIndicator = 1;
                prn.clearPrnReason();
                prn.setPrnInstructions(prnInput);
            }
            prn.changed = false;
            prn.pendingDetails = "";
        });
    });
};

PrnVirtualField.prototype.checkReasonUnit = function (reasonUnit, codeSet) {
    reasonUnit = reasonUnit || "";
    codeSet = codeSet || "";

    if (reasonUnit.length === 0 || codeSet.length === 0) {
        return false;
    }

    reasonUnit = reasonUnit.toUpperCase();
    for (var i = codeSet.length; i--; ) {
        if (reasonUnit === codeSet[i].DISPLAY.toUpperCase()) {
            return codeSet[i];
        }
    }

    return false;
};

PrnVirtualField.prototype.setPrnInstructions = function (value) {
    this.instructions.setAttribute("OE_FIELD_DISPLAY_VALUE", value);
    this.instructions.setAttribute("OE_FIELD_VALUE", 0);
    this.instructions.setChanged(true);

    this.setPrnYesNo(1);
};

PrnVirtualField.prototype.setPrnReason = function (reasonUnit) {
    this.reason.setAttribute("OE_FIELD_DISPLAY_VALUE", reasonUnit.DISPLAY);
    this.reason.setAttribute("OE_FIELD_VALUE", reasonUnit.CODE);
    this.reason.setChanged(true);

    this.setPrnYesNo(1);
};

PrnVirtualField.prototype.clearPrnInstructions = function () {
    this.instructions.setAttribute("OE_FIELD_DISPLAY_VALUE", "");
    this.instructions.setAttribute("OE_FIELD_VALUE", 0);
    this.instructions.setChanged(true);

    this.setPrnYesNo(0);
};

PrnVirtualField.prototype.clearPrnReason = function () {
    this.reason.setAttribute("OE_FIELD_DISPLAY_VALUE", "");
    this.reason.setAttribute("OE_FIELD_VALUE", 0);
    this.reason.setChanged(true);

    this.setPrnYesNo(0);
};

PrnVirtualField.prototype.setPrnYesNo = function (value) {
    this.schPrnYesNo.setAttribute("OE_FIELD_DISPLAY_VALUE", value ? "YES" : "NO");
    this.schPrnYesNo.setAttribute("OE_FIELD_VALUE", value ? 1 : 0);
    this.schPrnYesNo.setChanged(true);
};// eslint global flags
/* global ComponentStyle:true,
    i18n: true,
    Util: true,
    MP_Util: true,
    $: true,
    MPageComponent: true,
    mp_formatter: true,
    MP_Core: true,
    OrderModifyManager: true,
    OrderSentenceManager: true,
    mp_formatter: true,
    MPAGE_LOCALE: true,
    alert: true,
    CERN_EventListener: true,
    EventListener: true,
    _g: true,
    OrderEntryFields: true,
    Menu: true,
    MenuSelection: true,
    MenuSeparator: true,
    OrderModify: true,
    gvs: true,
    MP_MenuManager: true,
    OrderSentence: true,
    m_criterionJSON: true,
    confirm: true
*/

function AmbMedsRecComponentStyle2 () {
    "use strict";
    this.initByNamespace("amr2");
}

AmbMedsRecComponentStyle2.prototype = new ComponentStyle();
AmbMedsRecComponentStyle2.prototype.constructor = ComponentStyle;

/**
 * The Home Medication component will retrieve all home medication information associated to the encounter
 *
 * @param {Criterion} criterion
 */
function AmbMedsRecComponent2 (criterion) {
    "use strict";
    // Static variables and methods
    this.dateFormatter = null;
    this.CANCEL_ACTION = "CANCEL";
    this.CANCEL_DC_ACTION = "CANCEL DC";
    this.DISCONTINUE_ACTION = "DISCONTINUE";
    this.COMPLETE_ACTION = "COMPLETE";
    this.NEW_ORDER_ACTION = "NEW_ORDER";
    this.RENEW_ACTION = "RENEW";
    this.MODIFY_ACTION = "MODIFY";

    //add modification  functions
    this.setCriterion(criterion);
    this.setStyles(new AmbMedsRecComponentStyle2());
    this.setComponentLoadTimerName("USR:MPG.AMB_MEDS_REC.O2 - load component");
    this.setComponentRenderTimerName("ENG:MPG.AMB_MEDS_REC.O2 - render component");
    this.setIncludeLineNumber(true);
    this.setScope(1);
    this.medModInd = false;
    this.documentEventId = 0;
    this.documentEventTitle = "";
    this.editMode = false;
    this.medModObj = {};
    this.originalOrder = {};
    this.medRec = false;
    this.setHasActionsMenu(true);
    this.compliance = false;
    this.compMenuReference = {};
    this.reconNeededInd = false;
    this.m_isPlusAdd = true;
    this.m_isPlusAddCustom = true;

    this.m_venueCode = {
        admission: 0,
        discharge: 0
    };

    this.reconciliationStatus = {
        componentId: 0,
        encounter: {
            type_mean: ""
        },
        history: {
            css: "",
            status: "",
            performedDate: "",
            performedBy: ""
        },
        discharge: {
            css: "",
            status: "",
            performedDate: "",
            performedBy: ""
        }
    };

    this.modifyManager = new OrderModifyManager();
    this.sentenceManager = new OrderSentenceManager();    // set to enhanced edit
    this.modifyManager.setModifyViewType("ENHANCED");
    this.modifyManager.setTabIndexOffset(5);
    this.sentenceManager.setEditViewType("ENHANCED");
    this.sentenceManager.setTabIndexOffset(5);

    this.renewExcludedDetails = [{
        "OE_FIELD_MEANING": "DISPENSEQTY"
    }, {
        "OE_FIELD_MEANING": "DISPENSEQTYUNIT"
    }, {
        "OE_FIELD_MEAING": "REFILLQTY"
    }, {
        "OE_FIELD_MEANING": "NBRREFILLS"
    }, {
        "OE_FIELD_MEANING": "TOTALREFILLS"
    }];

    // Add a listener for any order action to insert data into the component
    CERN_EventListener.addListener(this, EventListener.EVENT_ORDER_ACTION, this.retrieveComponentData, this);

    /**
     * The following functions will read the event from the component menu and call the queueOrder function
     * to acheive a sepecific functionality on clicking the component menu items.
     *
     * @Parameter {obj} event [required]: The event object clickEvent.
     */
    this.callQueueOrder = function (event) {
        this.queueOrder.call(event, event);
    };

    this.callResetRows = function (event) {
        this.resetRows.call(event, event);
    };

    this.callSignMedMods = function (event) {
        this.signMedMods.call(event, event);
    };

    // Click Event for InfoButton
    this.callInfoButtonClick = function (event) {
        this.infoButtonClick.call(event, event);
    };
}

AmbMedsRecComponent2.prototype = new MPageComponent();
AmbMedsRecComponent2.prototype.constructor = MPageComponent;

AmbMedsRecComponent2.prototype.isMedModInd = function () {
    return this.medModInd;
};

AmbMedsRecComponent2.prototype.setMedModInd = function (value) {
    this.medModInd = value;
};

AmbMedsRecComponent2.prototype.setPrintClinicalEvent = function (value) {
    this.documentEventId = parseInt(value, 10);
};

AmbMedsRecComponent2.prototype.setPrintClincialEventTitle = function (value) {
    this.documentEventTitle = value;
};

AmbMedsRecComponent2.prototype.sortByMedicationName = function () {
    var component = this;
    return function (a, b) {
        var aName = component.getMedicationDisplayName(a);
        var bName = component.getMedicationDisplayName(b);

        var aUpper = (aName !== null) ? aName.toUpperCase() : "";
        var bUpper = (bName !== null) ? bName.toUpperCase() : "";

        if (aUpper > bUpper) {
            return 1;
        } else if (aUpper < bUpper) {
            return -1;
        } else {
            return 0;
        }
    };
};

AmbMedsRecComponent2.prototype.getMedicationDisplayName = function (order) {
    var medName = "";
    var displays = order.DISPLAYS;
    if (displays !== null) {
        medName = displays.CLINICAL_NAME || displays.REFERENCE_NAME || displays.DEPARTMENT_NAME;
    }
    return medName;
};

AmbMedsRecComponent2.prototype.extractOrderIdFromHtmlId = function (rowId) {
    return parseInt(rowId.slice(rowId.indexOf("_") + 1), 10);
};

AmbMedsRecComponent2.prototype.removeModifyOrder = function (currentRow) {
    var medCompId = this.medModObj.medModCompId;
    var currentOrderId = this.extractOrderIdFromHtmlId(currentRow.id);
    var orderObject = this.originalOrder[currentOrderId];
    var orderDetailContainer =  $("#amr2DetailEdit" + medCompId + "_" + currentOrderId);
    // clear actions to perform
    orderObject.PERFORM_ACTION = "";
    // reset create new prescription indicator
    orderObject.makeNewPrescription =  false;
    // remove from order modify manager
    this.modifyManager.removeOrderModifyWithOrderId(currentOrderId);
    // hide the order detail container
    orderDetailContainer.hide();
    $(currentRow).find(".order-modify-details").detach();
    $(currentRow).find("span.amr2-sig.detail-line").show();
};

AmbMedsRecComponent2.prototype.removeRenewOrder = function (currentRow) {
    var currentOrderId = this.extractOrderIdFromHtmlId(currentRow.id);
    var orderObject = this.originalOrder[currentOrderId];
    // clear actions to perform
    orderObject.PERFORM_ACTION = "";
    // reset create new prescription indicator
    orderObject.makeNewPrescription =  false;
    // remove renew row
    $(currentRow).find(".amr2-sel-container").detach();
};

AmbMedsRecComponent2.prototype.setPrintDisplayInd = function (value) {
    this.printDisplayInd = value;
};

AmbMedsRecComponent2.prototype.getPrintDisplayInd = function () {
    return this.printDisplayInd;
};

AmbMedsRecComponent2.prototype.setMedRec = function (value) {
    this.medRec = value;
};

AmbMedsRecComponent2.prototype.getMedRec = function () {
    return this.medRec;
};

AmbMedsRecComponent2.prototype.setOneClickReconciliationActionInd = function (value) {
    this.oneClickReconciliationActionInd = value;
};

AmbMedsRecComponent2.prototype.getOneClickReconciliationActionInd = function () {
    return this.oneClickReconciliationActionInd;
};

AmbMedsRecComponent2.prototype.openTab = function () {
    var criterion = this.getCriterion();
    if (!this.anyOrdersToSign()) {
        // Launch to MOEW in search mode if no orders to sign
        MPAGES_EVENT("ORDERS", criterion.person_id.toFixed(2) + "|" + criterion.encntr_id.toFixed(2) + "|{ORDER|0|0|0|0|0}|0|{2|127}{3|127}|8");
        // refresh component data
        this.retrieveComponentData();
    } else {
        // sign med mods and display MOEW
        this.signMedicationModifications(false);
    }

};

AmbMedsRecComponent2.prototype.setAllData = function (recordData) {
    this.allData = recordData;

    var orders = recordData.ORDERS, iterator;
    for (iterator = orders.length; iterator--;) {
        // medication that needs reconciliation and is visible or a discontinued or completed med
        if (orders[iterator].RECON_ACTION_DETAILS.RECON_NEEDED_IND == true) {
            if (orders[iterator].RECON_ACTION_DETAILS.SHOW_IND == true || orders[iterator].RECON_ACTION_DETAILS.LAST_ACTION_MEANING === "DISCONTINUE" || orders[iterator].RECON_ACTION_DETAILS.LAST_ACTION_MEANING === "COMPLETE") {
                // require reconciliation
                this.setReconNeeded(true);
                break;
            }
        }
    }
};

AmbMedsRecComponent2.prototype.getAllData = function () {
    return this.allData;
};

/**
 * Format numeric values for local display and api use
 * @param {string] inVal : Value to be formatted
 * @return {array]  : Array containing local display value and api value
 */
AmbMedsRecComponent2.prototype.formatDispenseQuantity = function (inVal) {
    var nf = new mp_formatter.NumericFormatter(MPAGE_LOCALE);
    var decSep = nf.lc.decimal_point;
    var thouSep = nf.lc.thousands_sep;
    var decPos = inVal.lastIndexOf(decSep);
    var thouPos = inVal.lastIndexOf(thouSep);
    var intSec = "";
    var decSec = "";
    var numArr = inVal.split(decSep);
    var localDispStr;
    var apiVal;
    var intParts;

    if (numArr.length === 2 && decPos > thouPos) {
        intParts = numArr[0].split(thouSep);
        numArr[0] = intParts.join("");
        if (!isNaN(numArr[0]) && !isNaN(numArr[1])) {
            intSec = numArr[0];
            decSec = numArr[1];
        } else {
            return [null, null];
        }

    } else if (numArr.length === 1) {
        intParts = numArr[0].split(thouSep);
        numArr[0] = intParts.join("");
        if (!isNaN(numArr[0])) {
            intSec = numArr[0];
        } else {
            return [null, null];
        }
    } else {
        return [null, null];
    }
    if (decSec) {
        localDispStr = intSec + decSep + decSec;
        apiVal = intSec + "." + decSec;
    } else {
        localDispStr = intSec;
        apiVal = intSec;
    }
    return [localDispStr, apiVal];
};

AmbMedsRecComponent2.prototype.buildDCCompleteFragment = function (orderId, curImg) {
    var currentOrder = this.originalOrder[orderId];
    var $cancelCompleteSelectionFrag;
    var $container = $("<span class='amr2-sel-container'></span>");
    var self = this;
    var amri18n = i18n.innov.ambmedsrec_o2;

    // setup elements
    $container.append($("<span>,&nbsp;</span>"));
    $cancelCompleteSelectionFrag = $("<span class='amr2-sel-spn'></span>");
    $cancelCompleteSelectionFrag.html("<span class='amr2-sel-opt-spn'>" + amri18n.DISCONTINUE + "</span>");

    $container.append($cancelCompleteSelectionFrag);
    var cancelDCList = [{"DISPLAY":amri18n.DISCONTINUE,"VALUE":"0"},{"DISPLAY":amri18n.COMPLETE,"VALUE":"1"}];
    var initialDCData = {"DISPLAY":amri18n.DISCONTINUE,"VALUE":"0"};
    var criterion = self.getCriterion();
    var ipath = criterion.static_content;
    // default order to discontinue
    currentOrder.PERFORM_ACTION = self.DISCONTINUE_ACTION;
    currentOrder.DCSelection = self.getSelectListControl();
    currentOrder.DCSelection.setContainerElement($cancelCompleteSelectionFrag);
    currentOrder.DCSelection.setListData(cancelDCList,initialDCData);
    currentOrder.DCSelection.setCallBack(function (selectedData) {
        var iconDisplay = "";
        $(".amr2-sel-opt-spn",$cancelCompleteSelectionFrag).html(selectedData.DISPLAY);
        if(selectedData.VALUE === 1){
            currentOrder.PERFORM_ACTION = self.COMPLETE_ACTION;
            iconDisplay = "complete.gif";
        } else {
            currentOrder.PERFORM_ACTION = self.DISCONTINUE_ACTION;
            iconDisplay = "cancel.gif";
        }
        // update the icon display based action
        curImg.src = ipath + "/images/" + iconDisplay;
    });

    $cancelCompleteSelectionFrag.on("click", function (e){
        currentOrder.DCSelection.renderSelectList();
        Util.cancelBubble(e);
    });

    return $container;
};


/**
 * Store some of the original order row details for use in reset
 * @param {string] ordId : Order Id
 * @param {string] dispQty : Dispense quantity
 * @param {string] rflQty : Refill Quantity
 * @param {string] rxType : Rx or Hx
 */
AmbMedsRecComponent2.prototype.setOrigOrder = function (rxType, medClass, medName, ordersMedInfo, orders) {
    var ordId = orders.CORE.ORDER_ID;
    this.originalOrder[ordId] = {};
    this.originalOrder[ordId].ordId = ordId;
    this.originalOrder[ordId].rxType = rxType;
    this.originalOrder[ordId].medClass = medClass;
    this.originalOrder[ordId].mnemonic = medName;
    this.originalOrder[ordId].catalogCode = ordersMedInfo.CATALOG_CD;
    this.originalOrder[ordId].dispenseQuantity = ordersMedInfo.DISPENSE_QTY;
    this.originalOrder[ordId].dispenseQuantityUnit = ordersMedInfo.DISPENSE_QTY_UNIT;
    this.originalOrder[ordId].dispenseQuantityCode = ordersMedInfo.DISPENSE_QTY_UNIT_CD;
    this.originalOrder[ordId].refills = ordersMedInfo.NBR_REFILLS;
    this.originalOrder[ordId].hxInd = ordersMedInfo.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND;
    this.originalOrder[ordId].synonymCKI = orders.CKI_DETAILS.CKI_VALUE;
    this.originalOrder[ordId].origSynonymId = ordersMedInfo.SYNONYM_ID;
    this.originalOrder[ordId].synonymId = ordersMedInfo.SYNONYM_ID;
    this.originalOrder[ordId].clinicalDisplayLine = orders.DISPLAYS.CLINICAL_DISPLAY_LINE;
    this.originalOrder[ordId].simplifiedDisplayLine = orders.DISPLAYS.SIMPLIFIED_DISPLAY_LINE;
    this.originalOrder[ordId].makeNewPrescription = false;
};

/**
 * Search route object for a match
 * @param {string] curCatCode : Catalog Code of the Med
 * @param {string] uid : Unique Id of Route - comination of Field Display Value + Field Value + Mean Id
 * @param {obj} medComp : The component the routes are being searched in
 * @return {array]  : Array containing Field Display Value, Field Value, Mean Id, and Route Display of matched route
 */
AmbMedsRecComponent2.prototype.searchRoutes = function (curCatCode, uid) {
    var defRoute;
    var curCatList = this.medModObj.jsonRoutes[curCatCode];
    var amri18n = i18n.innov.ambmedsrec_o2;

    if (curCatList.pharmacies.length) {
        var pharms = curCatList.pharmacies;
        var phLen = pharms.length;
        for (var i = phLen; i--; ) {
            var curPharm = pharms[i];
            if (uid) {
                if (uid == curPharm.fieldDispValue + curPharm.fieldValue + curPharm.meanId) {
                    defRoute = curPharm.display;
                    return [curPharm.fieldDispValue, curPharm.fieldValue, curPharm.meanId, defRoute];
                }
            } else if (curPharm.bDefault) {
                defRoute = curPharm.display;
                return [curPharm.fieldDispValue, curPharm.fieldValue, curPharm.meanId, defRoute];
            }
        }
    }

    if (!defRoute) {
        if (curCatList.printers.length) {
            var printers = curCatList.printers;
            var prLen = printers.length;
            for (var printIndex = prLen; printIndex--; ) {
                var curPrint = printers[printIndex];
                if (uid) {
                    if (uid == curPrint.fieldDispValue + curPrint.fieldValue + curPrint.meanId) {
                        defRoute = curPrint.display;
                        return [curPrint.fieldDispValue, curPrint.fieldValue, curPrint.meanId, defRoute];
                    }
                } else if (curPrint.bDefault) {
                    defRoute = curPrint.display;
                    return [curPrint.fieldDispValue, curPrint.fieldValue, curPrint.meanId, defRoute];
                }
            }
        }

    }
    if (!defRoute) {
        if (curCatList.doNotSendReasons.length) {
            var dns = curCatList.doNotSendReasons;
            var dnsLen = dns.length;
            for (var dnsIndex = dnsLen; dnsIndex--; ) {
                var curDns = dns[dnsIndex];
                if (uid) {
                    if (uid == curDns.fieldDispValue + curDns.fieldValue + curDns.meanId) {
                        defRoute = curDns.display;
                        return [curDns.fieldDispValue, curDns.fieldValue, curDns.meanId, defRoute];
                    }
                } else if (curDns.bDefault) {
                    defRoute = amri18n.DNS_LABEL + ": " + curDns.display;
                    return [curDns.fieldDispValue, curDns.fieldValue, curDns.meanId, defRoute];
                }
            }
        }

    }

    //if no matches for default
    if (!uid) {
        return [null, null, null, amri18n.NO_DEFAULTS];
    }
};

/**
 * Search route object and return matched object to build intersection list
 * @param {string] curCatCode : Catalog Code of the Med
 * @param {string] uid : Unique Id of Route - comination of Field Display Value + Field Value + Mean Id
 * @param {string} interType : Intersection type being searched - pharmInt, printInd, or dnsInt
 * @param {obj} medComp : The component the routes are being searched in
 * @return {obj]  : Matched route object
 */
AmbMedsRecComponent2.prototype.searchRouteInt = function (curCatCode, uid, interType, medComp) {
    var medComp = this;
    var curCatList = medComp.medModObj.jsonRoutes[curCatCode];
    var index;
    if (interType === "pharmInt") {
        if (curCatList.pharmacies) {
            var pharms = curCatList.pharmacies;
            var phLen = pharms.length;
            for (index = 0; index < phLen; index++) {
                var curPharm = pharms[index];
                if (uid == curPharm.fieldDispValue + curPharm.fieldValue + curPharm.meanId) {
                    return curPharm;
                }
            }
        }
    } else if (interType === "printInt") {
        if (curCatList.printers) {
            var printers = curCatList.printers;
            var prLen = printers.length;
            for (index = 0; index < prLen; index++) {
                var curPrint = printers[index];
                if (uid == curPrint.fieldDispValue + curPrint.fieldValue + curPrint.meanId) {
                    return curPrint;
                }
            }
        }
    } else if (interType === "dnsInt") {
        if (curCatList.doNotSendReasons) {
            var dns = curCatList.doNotSendReasons;
            var dnsLen = dns.length;
            for (index = 0; index < dnsLen; index++) {
                var curDns = dns[index];
                if (uid == curDns.fieldDispValue + curDns.fieldValue + curDns.meanId) {
                    return curDns;
                }
            }
        }
    }
};

/**
 * Add hover to route menu rows and delayed tool tip for additional pharmacy info
 */
AmbMedsRecComponent2.prototype.hltRouteRow = function () {
    var parentId = Util.gp(this).id;
    var idFromRouteMenu = parseInt(parentId.replace("rtMnu", ""), 10);
    var medComp = MP_Util.GetCompObjById(idFromRouteMenu);
    var medCompId = medComp.medModObj.medModCompId;
    if (this.id == "morePrinter" + medCompId) {
        $(this).addClass("amr2-mp-hvr");
    } else {
        $(this).addClass("amr2-mnu-hvr");
        var mpBtn = _g("morePrinter" + medCompId);
        if (mpBtn) {
            if (Util.Style.ccss(mpBtn, "amr2-mp-hvr")) {
                Util.Style.rcss(mpBtn, "amr2-mp-hvr");
            }
        }
    }
    if ($(this).hasClass("amr2-rt-pharm")) {
        var ofs = Util.goff(this);
        var rtToolTip = Util.gns(Util.gns(this));
        var thisWidth = this.offsetWidth;

        var showRtDet = function () {
            var rtHTML = rtToolTip.innerHTML;
            medComp.medModObj.rtDiv = Util.cep("div", {
                "className" : "amr2-rt-div"
            });
            medComp.medModObj.rtDiv.innerHTML = rtHTML;

            Util.ac(medComp.medModObj.rtDiv, document.body);

            var divOfs = medComp.medModObj.rtDiv.offsetWidth + 15;

            var vpOfs = ofs[0] - divOfs;
            if (vpOfs > 0) {
                medComp.medModObj.rtDiv.style.left = vpOfs + "px";
                medComp.medModObj.ttArrow = Util.cep("span", {
                    "className" : "amr2-tt-arr-lt"
                });
                medComp.medModObj.ttArrow.style.left = (ofs[0] - 18) + "px";
            } else {
                medComp.medModObj.rtDiv.style.left = (ofs[0] + thisWidth + 16) + "px";
                medComp.medModObj.ttArrow = Util.cep("span", {
                    "className" : "amr2-tt-arr-rt"
                });
                medComp.medModObj.ttArrow.style.left = (ofs[0] + thisWidth + 3) + "px";
            }
            medComp.medModObj.rtDiv.style.top = (ofs[1] - 5) + "px";

            medComp.medModObj.ttArrow.style.top = (ofs[1] + 2) + "px";
            Util.ac(medComp.medModObj.ttArrow, document.body);
        };

        medComp.medModObj.rtTimer = setTimeout(showRtDet, 500);
    }
};

/**
 * Initialize and position refill table
 * @param {obj} e : event object
 * @param {string] tId : table id
 * @param {string} selTable : HTML string of table contents
 * @return {obj} tblAdded : The med component the menu is for
 */
AmbMedsRecComponent2.prototype.initializeDetailTable = function ($parentElement, tId, selTable) {
    $parentElement.append(selTable);
    var position = $parentElement.offset();
    var $table = $("#" + tId);
    $table.show().offset({
        top: position.top - 5,
        left: position.left
    }).on("focusin", function (childEvent) {
        childEvent = childEvent || window.event;
        Util.cancelBubble(childEvent);
    });

    return $table;
};

/**
 * change dispense quantity
 * @param {obj} changeDispenseQtyEvent : event object
 */
AmbMedsRecComponent2.prototype.changeDispenseQuantity = function (tabIndex) {
    var component = this;
    var hoverIsActive = false;
    return function (changeDispenseQtyEvent) {
        if (hoverIsActive) return;
        hoverIsActive = true;

        var tableId = "Tbl" + this.id;
        var $quantity = $(this).find(".amr2-dq-qty");
        var quantityUnit = $(this).find(".amr2-dq-tp").text();
        var table = window.render.amrDispenseQuantityTable({
            tableId: tableId,
            quantity: $quantity.text(),
            unit: quantityUnit,
            tabIndex: tabIndex
        });
        var $tblAdded = component.initializeDetailTable($(this), tableId, table);

        // build close event handler
        var closeTable = function () {
            var formatArr = component.formatDispenseQuantity($tblAdded.find(".amr2-qty-txt").val());
            if (formatArr[0] > 0) {
                $quantity.html(formatArr[0]);
                $tblAdded.remove();
                hoverIsActive = false;
            } else {
                alert(i18n.innov.ambmedsrec_o2.INVALID_QTY);
            }
        };

        // bind close table event handler
        $tblAdded.on("focusout mouseleave", closeTable);
        // close edit dialog on enter keypress
        $tblAdded.find(".amr2-qty-txt").on("keypress", function (keypress) {
            if (keypress.which == 13) {
                closeTable(keypress);
                keypress.preventDefault();
            }
        });

    };
};

/**
 * change number of refills
 * @param {obj} changeRefillEvent : event object
 */
AmbMedsRecComponent2.prototype.changeRefill = function (tabIndex) {
    var component = this;
    var hoverIsActive = false;
    return function (changeRefillEvent) {
        if (hoverIsActive) return;
        hoverIsActive = true;

        var medCompId = component.medModObj.medModCompId;
        var currentRefill = this;
        var tableId = "Tbl" + this.id;
        var quantity = parseInt(currentRefill.innerHTML, 10);
        var amri18n = i18n.innov.ambmedsrec_o2;
        var table = window.render.amrRefillTable({
            tableId: tableId,
            refillsDisplay: this.innerHTML,
            quantity: quantity,
            medCompId: medCompId,
            tabIndex: tabIndex
        });
        var tblAdded = component.initializeDetailTable($(this), tableId, table);
        $(tblAdded).find(".amr2-row-tl").attr("width", this.offsetWidth);

        var closeRflTbl = function () {
            var refills = parseInt($(tblAdded).find(".amr2-qty-txt").val(), 10);
            if (refills >= 0) {
                if ($(".amr2-rfl-all").prop("checked")) {
                    $(".amr2-rfl-rnw", component.getSectionContentNode()).each(function (index) {
                        $(this).text(refills + " " + amri18n.REFILLS);
                    });
                } else {
                    $(currentRefill).text(refills + " " + amri18n.REFILLS);
                }
                $("#" + tableId).detach();
                hoverIsActive = false;
            } else {
                alert(amri18n.INVALID_QTY);
            }
        };

        $(tblAdded).on("focusout mouseleave", closeRflTbl);
        // close refill on press enter
        $(".amr2-qty-txt", tblAdded).keypress(function (keyupEvent) {
            if (keyupEvent.which == 13) {
                closeRflTbl(keyupEvent);
                keyupEvent.preventDefault();
            }
        });
    }
};


//Click event for InfoButton Menu item to enable icons for results, Show and Hide of icons for results
AmbMedsRecComponent2.prototype.infoButtonClick = function (e) {
    var medCompId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
    var component = MP_Util.GetCompObjById(medCompId);
    var componentId = component.getComponentId();
    var hMedInfoIcons;

    if (component.compMenuReference["compMenuInfoButton" + componentId].isSelected()) {
        component.compMenuReference["compMenuInfoButton" + componentId].setIsSelected(false);
        MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "0");

        hMedInfoIcons = $("#amr2Content" + componentId).find(".amr2-info-icon");
        hMedInfoIcons.addClass("hidden");
    } else {
        component.compMenuReference["compMenuInfoButton" + componentId].setIsSelected(true);
        MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId, "", "", false, "1");

        hMedInfoIcons = $("#amr2Content" + componentId).find(".amr2-info-icon");
        $.each(hMedInfoIcons, function () {
            hMedInfoIcons.removeClass("hidden");
        });
    }
    if (component.hasInfoButton() && component.isInfoButtonEnabled()) {
        var hmlInfoIcons = $("#amr2Content" + componentId).find(".amr2-info-icon");

        $.each(hmlInfoIcons, function () {
            $(this).on("click", function (e) {

                //Get the values needed for the API
                var patId = $(this).attr("data-patId");
                var encId = $(this).attr("data-encId");
                var synonymId = $(this).attr("data-synonymId");
                var priCriteriaCd = $(this).attr("data-priCriteriaCd");
                var launchInfoBtnApp = window.external.DiscernObjectFactory("INFOBUTTONLINK");
                try {
                    if (launchInfoBtnApp) {
                        launchInfoBtnApp.SetInfoButtonData(parseFloat(patId), parseFloat(encId), parseFloat(priCriteriaCd), 1, 2);
                        launchInfoBtnApp.AddMedication(parseFloat(synonymId));
                        launchInfoBtnApp.LaunchInfoButton();
                    }
                } catch (err) {
                    MP_Util.LogJSError(component, err, "ambmedsrec-o2.js", "renderComponent");
                    // bubble error up
                    throw err;
                }
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            });
        });
    }
};

/**
 * reset row(s) to initial state
 * @param {obj} e : event object
 */
AmbMedsRecComponent2.prototype.resetRows = function (e) {
    if ($(this).hasClass("amr2-dthrd") || $(this).hasClass("opts-menu-item-dthr")) {
        e = e || window.event;
        Util.cancelBubble(e);
    } else {
        var idFromResetBtn = parseInt(this.id.replace("mnuRnwReset", ""), 10);
        var medComp = MP_Util.GetCompObjById(idFromResetBtn);
        var medCompId = medComp.medModObj.medModCompId;
        var origOrder = medComp.originalOrder;

        var rootMedSecCont = medComp.getSectionContentNode();
        var selectedRows = Util.Style.g("amr2-med-selected", rootMedSecCont, "dl");
        var selRowLen = selectedRows.length;
        var $curRow;

        for (var i = selRowLen; i--; ) {
            var curRow = selectedRows[i];
            medComp.resetSingleRow(origOrder,curRow);
        }

        medComp.disableActions();

        var totCancels = Util.Style.g("amr2-cncld", rootMedSecCont, "dl").length;
        var totModifies = Util.Style.g("amr2-modify", rootMedSecCont, "dl").length;
        var totRenewals = Util.Style.g("amr2-renew", rootMedSecCont, "dl").length;
        var compID = medComp.getComponentId();
        if (totRenewals === 0 && totCancels === 0 && totModifies === 0) {
            $("#medSgnBtn" + medCompId).prop("disabled", true);
            $("#medReconBtn" + medCompId).prop("disabled", false);
            medComp.compMenuReference["compMenuGoto" + compID].setIsDisabled(true);
            medComp.compMenuReference["compMenuSign" + compID].setIsDisabled(true);
            medComp.setEditMode(false);
        }

        var totRoutes = Util.Style.g("amr2-rt-uid", rootMedSecCont, "span").length;
        if (totRoutes === 0) {
            Util.Style.acss(_g("routeLink" + medCompId), "amr2-dthrd");
        }

    }
    //reset highlight
    $(this).removeClass("amr2-mnu-hvr");
};//end resetRows

AmbMedsRecComponent2.prototype.resetSingleRow = function (origOrder, curRow) {
    var medComp = this;
    var curId = medComp.extractOrderIdFromHtmlId(curRow.id);
    var imgSpan = Util.Style.g("amr2-rx-hx", curRow, "span");
    var curImg = Util.gc(imgSpan[0]);
    var curSrc = curImg.src;
    var orderObject = origOrder[curId];
    if (origOrder[curId]) {
        //set to original image
        curImg.src = origOrder[curId].rxType;
    } else if (curSrc.search(/_selected/) > -1) {
        var newSrc = curSrc.replace("_selected.gif", ".gif");
        curImg.src = newSrc;
    }

    var $curRow = $(curRow);
    // remove modify display
    if ($curRow.hasClass("amr2-modify")) {
        medComp.removeModifyOrder(curRow);
    } else if ($curRow.hasClass("amr2-cncld")) {
        // remove discontinue details
        $curRow.find(".amr2-sel-container").detach();
        // clear actions to perform
        orderObject.PERFORM_ACTION = "";
        delete origOrder[curId].DCSelection;
    } else if ($curRow.hasClass("amr2-renew")) {
        // remove renew display
        medComp.removeRenewOrder(curRow);
    }

    // remove classes
    $curRow.removeClass("amr2-pending-action");
    $curRow.removeClass("amr2-med-selected");
    $curRow.removeClass("amr2-modify");
    $curRow.removeClass("amr2-renew");
    $curRow.removeClass("amr2-cncld");

    medComp.checkIntersection("reset");
};

/**
 * loop through queued orders and add for the appropriate action
 * can attempt to sign silently or launch MOEW depending on caller
 * @param {obj} e : event object
 */
AmbMedsRecComponent2.prototype.signMedMods = function (e) {
    if ($(this).hasClass("amr2-dthrd") || $(this).hasClass("opts-menu-item-dthr")) {
        e = e || window.event;
        Util.cancelBubble(e);
    } else {
        var medCompId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
        var medComp = MP_Util.GetCompObjById(medCompId);

        // silent sign if routing isn't needed
        var silentSignMOEW = !(this.id == ("routeLink" + medCompId) || this.id == ("mnuGtOrders" + medCompId));

        medComp.signMedicationModifications(silentSignMOEW);
    }
}; //end signMedMods

AmbMedsRecComponent2.prototype.getDischargeCode = function () {
    var dischargeMedCd = 0;
    var code = MP_Util.GetCodeValueByMeaning("DISCHARGEMED", 54732);
    dischargeMedCd = (code) ? code.codeValue : 0;

    return dischargeMedCd;
};

/**
 * Builds intersection list of routes and populates default routing link drop down
 * @param {string] inUid : Unique Id of Route - comination of Field Display Value + Field Value + Mean Id
 * @param {obj} medComp : The med component intersection is being checked for
 */
AmbMedsRecComponent2.prototype.checkIntersection = function (inUid) {
    var medCompId = this.medModObj.medModCompId;
    var jsonRoutes = this.medModObj.jsonRoutes;
    var uids = Util.Style.g("amr2-rt-uid", _g("amr2" + medCompId), "span");
    var uLen = uids.length;
    var rtLink = _g("routeLink" + medCompId);
    var amri18n = i18n.innov.ambmedsrec_o2;
    var catCd;

    if (uLen === 0) {
        rtLink.onclick = null;
        rtLink.innerHTML = amri18n.MED_NONE_SELECTED;
    } else {
        var defRoute = Util.gps(uids[0]).innerHTML;

        if (uLen === 1) {
            var uid = uids[0].innerHTML;
            rtLink.innerHTML = "<span class='amr2-route-opt-spn'>" + defRoute + "</span><span class='amr2-defrt-uid'>" + uid + "</span>";
            catCd = uids[0].className.replace("amr2-rt-uid cat-", "");
            jsonRoutes.intersectionList = {};
            jsonRoutes.intersectionList.pharmacies = jsonRoutes[catCd].pharmacies;
            jsonRoutes.intersectionList.printers = jsonRoutes[catCd].printers;
            jsonRoutes.intersectionList.doNotSendReasons = jsonRoutes[catCd].doNotSendReasons;

            rtLink.onclick = this.routeSelect;
        } else {
            var pharmIntersect = [];
            var printIntersect = [];
            var dnsIntersect = [];
            var multi = false;
            var matchUid;
            var defUid;

            if (inUid !== "reset") {
                defUid = inUid;
            } else {
                defUid = uids[0].innerHTML;
            }

            for (var i = 0; i < uLen; i++) {
                catCd = uids[i].className.replace("amr2-rt-uid cat-", "");
                if (i === 0) {
                    pharmIntersect = jsonRoutes[catCd].pharmacies;
                    printIntersect = jsonRoutes[catCd].printers;
                    dnsIntersect = jsonRoutes[catCd].doNotSendReasons;
                    matchUid = uids[i].innerHTML;
                } else {
                    pharmIntersect = this.getIntersect(pharmIntersect, jsonRoutes[catCd].pharmacies, catCd, "pharmInt");
                    printIntersect = this.getIntersect(printIntersect, jsonRoutes[catCd].printers, catCd, "printInt");
                    dnsIntersect = this.getIntersect(dnsIntersect, jsonRoutes[catCd].doNotSendReasons, catCd, "dnsInt");
                }
                if (matchUid !== uids[i].innerHTML) {
                    multi = true;
                    defUid = amri18n.DEF_ROUTE_MULTI;
                }
            }

            jsonRoutes.intersectionList = {};
            jsonRoutes.intersectionList.pharmacies = pharmIntersect;
            jsonRoutes.intersectionList.printers = printIntersect;
            jsonRoutes.intersectionList.doNotSendReasons = dnsIntersect;
            //take instersect list and build default menu
            if (multi) {
                defRoute = amri18n.DEF_ROUTE_MULTI;
            }

            rtLink.onclick = this.routeSelect;
            rtLink.innerHTML = "<span class='amr2-route-opt-spn'>" + defRoute + "</span><span class='amr2-defrt-uid'>" + defUid + "</span>";
        }
    }
};

/**
 * Compares two arrays of objects and returns array of matches
 * @param {string] list1 : First array to compare
 * @param {string] list : Second array to compare
 * @param {string] catCode : Catalog Code of the Med
 * @param {string} interType : Intersection type being searched - pharmInt, printInd, or dnsInt
 * @param {obj} medComp : The component the routes are being searched in
 * @return {array]  : returns array of matched objects
 */
AmbMedsRecComponent2.prototype.getIntersect = function (list1, list2, catCd, interType) {
    var intersection = [];
    var tempUids = [];

    var getCount = function (arr) {
        var countObj = {}, len = arr.length, tmp;
        for (var i = 0; i < len; i++) {
            tmp = countObj[arr[i]];
            countObj[arr[i]] = tmp ? tmp + 1 : 1;
        }
        return countObj;
    };

    var l1Len = list1.length;
    var l2Len = list2.length;

    for (var l1i = 0; l1i < l1Len; l1i++) {
        var curL1 = list1[l1i];
        var l1Uid = curL1.fieldDispValue + curL1.fieldValue + curL1.meanId;
        tempUids.push(l1Uid);
    }

    for (var l2i = 0; l2i < l2Len; l2i++) {
        var curL2 = list2[l2i];
        var l2Uid = curL2.fieldDispValue + curL2.fieldValue + curL2.meanId;
        tempUids.push(l2Uid);
    }

    var uidObj = getCount(tempUids);
    for (var uid in uidObj) {
        if (uidObj[uid] === 2) {
            intersection.push(this.searchRouteInt(catCd, uid, interType));
        }
    }

    return intersection;
};

/**
 * Un-highlight menu rows of route menu and reset pharmacy tool tip
 */
AmbMedsRecComponent2.prototype.unHltRouteRow = function (e) {
    var rootEl = $(this).parent().get(0);
    var parentId = rootEl.id;
    var idFromRouteMenu = parseInt(parentId.replace("rtMnu", ""), 10);
    var medComp = MP_Util.GetCompObjById(idFromRouteMenu);
    var medCompId = medComp.medModObj.medModCompId;

    if (this.id == ("morePrinter" + medCompId)) {
        var mPrintDv = _g("morePrintDiv" + medCompId);
        if (!mPrintDv) {
            $(this).removeClass("amr2-mp-hvr");
        }
    } else {
        $(this).removeClass("amr2-mnu-hvr");

    }
    clearTimeout(medComp.medModObj.rtTimer);

    Util.de(medComp.medModObj.rtDiv);
    Util.de(medComp.medModObj.ttArrow);
};

/**
 * Show additional menu of printers if more than 4
 * @param {obj} that : this from call
 * @param {bool] isIntList : is menu for intersection list
 * @param {obj} medComp : The med component the menu is for
 */
AmbMedsRecComponent2.prototype.showMorePrinters = function (that, isIntList) {
    var medCompId = this.medModObj.medModCompId;
    var medComp = this;
    if (_g("morePrintDiv" + medCompId)) {
        Util.de(_g("morePrintDiv" + medCompId));
    } else {
        var ofs = Util.goff(that);
        var moreMenu = Util.gns(that);
        var thisWidth = that.offsetWidth;
        var mpHTML = moreMenu.innerHTML;
        var mpDiv = Util.cep("div", {
            "className": "amr2-mp-div",
            "id": "morePrintDiv" + medCompId
        });
        mpDiv.innerHTML = mpHTML;
        Util.ac(mpDiv, document.body);

        var divOfs = mpDiv.offsetWidth;

        var vpOfs = ofs[0] - divOfs;
        if (vpOfs > 0) {
            mpDiv.style.left = (vpOfs - 2) + "px";
            Util.Style.acss(mpDiv, "amr2-mpd-lt");
        } else {
            mpDiv.style.left = (ofs[0] + thisWidth + 6) + "px";
            Util.Style.acss(mpDiv, "amr2-mpd-rt");

        }
        mpDiv.style.top = (ofs[1] - 5) + "px";

        var closePrintMnu = function (printMenuEvent) {
            printMenuEvent = printMenuEvent || window.event;
            Util.de(mpDiv);
            var mpBtn = _g("morePrinter" + medCompId);
            if (mpBtn) {
                if (Util.Style.ccss(mpBtn, "amr2-mp-hvr")) {
                    Util.Style.rcss(mpBtn, "amr2-mp-hvr");
                }
            }
            Util.cancelBubble(printMenuEvent);
        };

        var changePrinter = function () {
            var newPrinter = this.innerHTML;
            var newUidEl = Util.gns(this);
            var newUid = newUidEl.innerHTML;
            var catCodes = [];
            var uidIndex;

            if (isIntList) {
                var uids = Util.Style.g("amr2-rt-uid", _g("amr2" + medCompId), "span");
                var uLen = uids.length;
                for (uidIndex = 0; uidIndex < uLen; uidIndex++) {
                    var catCd = uids[uidIndex].className.replace("amr2-rt-uid cat-", "");
                    Util.gps(uids[uidIndex]).innerHTML = newPrinter;
                    uids[uidIndex].innerHTML = newUid;
                    catCodes.push(catCd);
                }

                catCodes.push("intersectionList");
            } else {
                medComp.medModObj.routeOpt.innerHTML = newPrinter;
                medComp.medModObj.routeUid.innerHTML = newUid;
                catCodes.push(newUidEl.className.replace("amr2-rt-uid cat-", ""));
            }

            medComp.checkIntersection(newUid);
            medComp.orderPrinters(catCodes, newUid);
            Util.de(mpDiv);
            Util.de(_g("rtMnu" + medCompId));
            Util.cancelBubble();
        };

        var mpOptions = Util.Style.g("amr2-rt-printer", _g("morePrintDiv" + medCompId), "div");
        var mpoLen = mpOptions.length;
        var mpIndex;
        for (mpIndex = 0; mpIndex < mpoLen; mpIndex++) {
            Util.addEvent(mpOptions[mpIndex], "click", changePrinter);
        }

        if (window.attachEvent) {
            Util.addEvent(mpDiv, "mouseleave", closePrintMnu);
        } else {
            Util.addEvent(mpDiv, "mouseout", closePrintMnu);
        }

        var mpMenuRows = Util.Style.g("amr2-rt-printer", _g("morePrintDiv" + medCompId), "div");
        var mpMnLen = mpMenuRows.length;
        for (mpIndex = mpMnLen; mpIndex--; ) {
            Util.addEvent(mpMenuRows[mpIndex], "mouseover", medComp.highlightMenuRow);
            Util.addEvent(mpMenuRows[mpIndex], "mouseout", medComp.unHighlightMenuRow);
        }
    }
    Util.cancelBubble();
};

/**
 * If printer is selected from more printers secondary menu, move to top of list in printers object for display on relaunch of primary menu
 * @param {array} catCodes : array of catalog codes
 * @param {string] newUid : uid of the new selection
 * @param {obj} medComp : The med component the menu is for
 */
AmbMedsRecComponent2.prototype.orderPrinters = function (catCodes, newUid) {
    var jsonRoutes = this.medModObj.jsonRoutes;
    var catCdLen = catCodes.length;
    for (var j = 0; j < catCdLen; j++) {
        var catCode = catCodes[j];
        if (jsonRoutes[catCode].printers.length) {
            var printers = jsonRoutes[catCode].printers;
            var prLen = printers.length;
            for (var i = 0; i < prLen; i++) {
                var curPrinter = printers[i];
                var rtUid = curPrinter.fieldDispValue + curPrinter.fieldValue + curPrinter.meanId;
                if (rtUid === newUid) {
                    var prnToMove = printers.splice(i, 1);
                    printers.splice(0, 0, prnToMove[0]);
                    break;
                }
            }
        }
    }
};

/**
 * Highlight more printer menu rows
 */
AmbMedsRecComponent2.prototype.highlightMenuRow = function () {
    $(this).addClass("amr2-mnu-hvr");
};

/**
 * Un-highlight more printer menu rows
 */
AmbMedsRecComponent2.prototype.unHighlightMenuRow = function () {
    $(this).removeClass("amr2-mnu-hvr");
};

/**
 * Build and display menu of routes
 */
AmbMedsRecComponent2.prototype.routeSelect = function () {
    var medComp;
    var rtSpan = this;
    var catCode;
    var isIntList = false;
    var medCompId;
    var index = 0;
    var rtUid;

    if (this.id) {
        var idFromRouteLink = parseInt(this.id.replace("routeLink", ""), 10);
        medComp = MP_Util.GetCompObjById(idFromRouteLink);
    } else {
        var parentContSec = $(this).closest(".sec-content");
        var idFromContSec = parseInt(parentContSec.attr("id").replace("amr2Content", ""), 10);
        medComp = MP_Util.GetCompObjById(idFromContSec);
    }

    medCompId = medComp.medModObj.medModCompId;

    // ensure the popup hasn't already been activated
    if ($("#rtMnu" + medCompId).length > 0) {
        return;
    }

    if ($(this).hasClass("amr2-rt-spn")) {
        var catCodeEl = Util.gc(this, 1);
        catCode = catCodeEl.className.replace("amr2-rt-uid cat-", "");
    } else {
        catCode = "intersectionList";
        isIntList = true;
    }

    var curUid = Util.gc(rtSpan, 1).innerHTML;
    var ofs = Util.goff(rtSpan);

    medComp.medModObj.routeOpt = Util.gc(rtSpan);
    medComp.medModObj.routeUid = Util.gc(rtSpan, 1);
    var pharmHTML = "";
    var printHTML = "";
    var dnsHTML = "";
    var amri18n = i18n.innov.ambmedsrec_o2;
    var jsonRoutes = medComp.medModObj.jsonRoutes;

    if (!jsonRoutes) {
        alert(amri18n.NO_ROUTE_OPT);
    }

    if (jsonRoutes[catCode]) {
        var dispStr;
        var rtClass = "amr2-route-opt";
        var curCatList = jsonRoutes[catCode];
        if (curCatList.pharmacies.length) {
            var pharms = curCatList.pharmacies;
            var phLen = pharms.length;
            if (phLen > 3) {//Limit pharmacies to 3
                phLen = 3;
            }

            for (index = 0; index < phLen; index++) {
                var curPharm = pharms[index];
                dispStr = curPharm.display;
                rtUid = curPharm.fieldDispValue + curPharm.fieldValue + curPharm.meanId;

                if (curUid == rtUid) {
                    rtClass += " amr2-rt-sel";
                }
                var addrs = curPharm.streetAddress;
                pharmHTML += "<div class='amr2-rt-pharm " + rtClass + "' >" + dispStr + " - " + addrs + "</div><span class='amr2-rt-uid cat-" + catCode + "''>" + rtUid + "</span><div class='hidden'><div class='amr2-rt-hover-hd'>" + dispStr + " - " + curPharm.pharmNum + "</div><div class='amr2-rt-addr'><div>" + curPharm.streetAddress + "</div><div>" + curPharm.city + ", " + curPharm.state + " " + curPharm.zip + "</div><div>" + curPharm.country + "</div></div><div>" + amri18n.MED_MOD_TEL + ": " + curPharm.tel + "</div><div>" + amri18n.MED_MOD_FAX + ": " + curPharm.fax + "</div></div>";
                rtClass = rtClass.replace(" amr2-rt-sel", "");
            }
        }

        if (curCatList.printers.length) {
            var printers = curCatList.printers;
            var prLen = printers.length;
            var curPrinter;
            if (prLen < 5) {
                for (index = 0; index < prLen; index++) {
                    curPrinter = printers[index];
                    dispStr = curPrinter.display;
                    rtUid = curPrinter.fieldDispValue + curPrinter.fieldValue + curPrinter.meanId;
                    if (curUid == rtUid) {
                        rtClass += " amr2-rt-sel";
                    }
                    printHTML += "<div class=\"amr2-rt-printer " + rtClass + "\" >" + dispStr + "</div><span class=\"amr2-rt-uid cat-" + catCode + "\">" + rtUid + "</span>";
                    rtClass = rtClass.replace(" amr2-rt-sel", "");

                }
            } else {
                for (index = 0; index < prLen; index++) {
                    curPrinter = printers[index];
                    dispStr = curPrinter.display;
                    rtUid = curPrinter.fieldDispValue + curPrinter.fieldValue + curPrinter.meanId;
                    if (curUid == rtUid) {
                        rtClass += " amr2-rt-sel";
                    }
                    if (index === 3) {
                        printHTML += "<div class='amr2-rt-more-printer amr2-route-opt' id='morePrinter" + medCompId + "'>" + amri18n.MORE_PRINTERS + "</div>";
                        printHTML += "<div class='amr2-rt-more-menu menu-hide cat" + catCode + "' id='morePrintMenu" + medCompId + "'>";
                        printHTML += "<div class='amr2-rt-printer " + rtClass + "' >" + dispStr + "</div>" + "<span class='amr2-rt-uid cat-" + catCode + "'>" + rtUid + "</span>";
                    } else {
                        printHTML += "<div class='amr2-rt-printer " + rtClass + "' >" + dispStr + "</div>" + "<span class='amr2-rt-uid cat-" + catCode + "'>" + rtUid + "</span>";
                    }
                    rtClass = rtClass.replace(" amr2-rt-sel", "");
                }
                printHTML += "</div>";
            }
        }

        if (curCatList.doNotSendReasons.length) {
            var dns = curCatList.doNotSendReasons;
            var dnsLen = dns.length;
            if (dnsLen > 3) {//Limit DNS to 3
                dnsLen = 3;
            }
            for (index = 0; index < dnsLen; index++) {
                var curDNS = dns[index];
                dispStr = curDNS.display;
                rtUid = curDNS.fieldDispValue + curDNS.fieldValue + curDNS.meanId;
                if (curUid == rtUid) {
                    rtClass += " amr2-rt-sel";
                }
                dnsHTML += "<div class=\"" + rtClass + "\" >" + amri18n.DNS_LABEL + ": " + dispStr + "</div>" + "<span class=\"amr2-rt-uid cat-" + catCode +
                            "\">" + rtUid + "</span>";
                rtClass = rtClass.replace(" amr2-rt-sel", "");
            }
        }
    }

    if (pharmHTML) {
        pharmHTML += "<hr class='amr2-rt-hr' />";
    }

    if (printHTML) {
        printHTML += "<hr class='amr2-rt-hr' />";
    }

    var routeMnu = Util.cep("div", {
        "className": "amr2-rt-menu",
        "id": "rtMnu" + medCompId
    });

    if (pharmHTML || printHTML || dnsHTML) {
        routeMnu.innerHTML = pharmHTML + printHTML + dnsHTML;
    } else {
        routeMnu.innerHTML = amri18n.NO_DEFAULTS;
    }

    $(routeMnu).mouseleave(function (e) {
        e = e || window.event;
        if (!_g("morePrintDiv" + medCompId)) {
            $(".amr2-rt-menu").detach();
            Util.cancelBubble(e);
        }
    });

    var changeRoute = function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (Util.Style.ccss(target, "amr2-rt-menu")) {
            return;
        }

        if (target.id != "morePrinter" + medCompId) {
            if (target.nodeName.toLowerCase() === "div" && Util.Style.ccss(target, "amr2-route-opt")) {
                if (isIntList) {
                    var uids = Util.Style.g("amr2-rt-uid", _g("amr2" + medCompId), "span");
                    var uLen = uids.length;
                    var newRoute = target.innerHTML;
                    var newUid = Util.gns(target).innerHTML;
                    var catCodes = [];
                    var isPrinter = Util.Style.ccss(target, "amr2-rt-printer");

                    for (var uidIndex = 0; uidIndex < uLen; uidIndex++) {
                        var curUid = uids[uidIndex];
                        if (isPrinter) {
                            var catCd = curUid.className.replace("amr2-rt-uid cat-", "");
                            catCodes.push(catCd);
                        }
                        Util.gps(curUid).innerHTML = newRoute;
                        curUid.innerHTML = newUid;
                    }
                    medComp.checkIntersection(newUid);
                    if (isPrinter) {
                        medComp.orderPrinters(catCodes, newUid);
                    }
                } else {
                    medComp.medModObj.routeOpt.innerHTML = target.innerHTML;
                    medComp.medModObj.routeUid.innerHTML = Util.gns(target).innerHTML;

                    medComp.checkIntersection(medComp.medModObj.routeUid.innerHTML);
                }
                Util.cancelBubble(e);
                Util.de(routeMnu);
                var mPrintDiv = _g("morePrintDiv" + medCompId);
                if (mPrintDiv) {
                    Util.de(mPrintDiv);
                }
            }
        }
    };

    var rtMenuRows = Util.Style.g("amr2-route-opt", routeMnu, "div");
    var rtMnLen = rtMenuRows.length;
    for (index = rtMnLen; index--; ) {
        Util.addEvent(rtMenuRows[index], "mouseover", medComp.hltRouteRow);
        Util.addEvent(rtMenuRows[index], "mouseout", medComp.unHltRouteRow);
        Util.addEvent(rtMenuRows[index], "click", changeRoute);
    }

    Util.ac(routeMnu, this);

    if (_g("morePrinter" + medCompId)) {
        Util.addEvent(_g("morePrinter" + medCompId), "click", function () {
            medComp.showMorePrinters(this, isIntList);
        });
    }
    $(routeMnu).offset({
        top: $(this).offset().top + $(this).height()
    });
    Util.cancelBubble();
};

/**
 * Sets up the available actions based on orders selected
 */
AmbMedsRecComponent2.prototype.verifyAvailableActions = function () {
    log.info("verifyAvailableActions");
    var medComp = this;
    var criterion = this.getCriterion();
    var dPersonId = criterion.person_id;
    var dEncounterId = criterion.encntr_id;
    var rootMedSecCont = medComp.getSectionContentNode();
    var currentOrder;
    var orderId;
    var $currentRow;
    var selRow;
    var cancelDCInd = true;
    var modifyInd = true;
    var renewInd = true;

    var selectedRows = Util.Style.g("amr2-med-selected", rootMedSecCont, "dl");
    var selRowLen = selectedRows.length;
    var origOrders = medComp.originalOrder;
    var availableActionsStr;

    // disable all actions
    medComp.disableActions();

    var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
    var hMOEW = PowerOrdersMPageUtils.CreateMOEW(dPersonId, dEncounterId, 0, 2, 127);

    for (var i = 0; i < selRowLen; i++) {
        selRow = selectedRows[i];
        $currentRow = $(selRow);
        orderId = parseFloat(medComp.extractOrderIdFromHtmlId(selRow.id));
        currentOrder = origOrders[orderId + ""];
        // available actions bitmap not defined -> get it
        if(!currentOrder.AVAIL_ACTION_BITMAP){
            currentOrder.AVAIL_ACTION_BITMAP  = PowerOrdersMPageUtils.GetAvailableOrderActions(hMOEW, orderId);
        }
        log.info("currentOrder.AVAIL_ACTION_BITMAP -- > "+currentOrder.AVAIL_ACTION_BITMAP);
        availableActionsStr = currentOrder.AVAIL_ACTION_BITMAP;
        // cancel/dc action is not available
        if(!(availableActionsStr & 1)){
            cancelDCInd = false;
        }

        // modify action is not available
        if(!(availableActionsStr & 2)){
            modifyInd = false;
        }
        // Renewal or Renewal Rx action not available
        if(!(availableActionsStr & 2048) && !(availableActionsStr & 33554432)){
            renewInd = false;
        }
        renewInd = true;
    }

    log.info(" cancelDCInd -- > "+cancelDCInd);
    log.info(" modifyInd -- > "+modifyInd);
    log.info(" renewInd -- > "+renewInd);
    PowerOrdersMPageUtils.DestroyMOEW(hMOEW);
    // enable actions
    medComp.enableActions(cancelDCInd,modifyInd,renewInd);
};


/**
 * marks row(s) with appropriate class for action to take on submit
 * @param {obj} queueEvent : The event object
 */
AmbMedsRecComponent2.prototype.queueOrder = function (queueEvent) {
    if ($(this).hasClass("amr2-dthrd") || $(this).hasClass("opts-menu-item-dthr")) {
        queueEvent = queueEvent || window.event;
        Util.cancelBubble(queueEvent);
    } else {
        var medCompId = parseInt(this.id.replace(/[^\d]/g, ""), 10);
        var medComp = MP_Util.GetCompObjById(medCompId);
        var ipath = medComp.getCriterion().static_content;
        var rootMedSecCont = medComp.getSectionContentNode();
        var rtUid = "";
        var currentOrder;
        var orderId;
        var $currentRow;
        var selRow;
        var imgSpan;
        var curImg;
        var rType;
        var routeFrag;
        var amri18n = i18n.innov.ambmedsrec_o2;

        // cancel action
        if (this.id == ("medCnclBtn" + medCompId) || this.id == ("mnuCancel" + medCompId)) {
            rType = "amr2-cncld";
        }
        // modify action
        else if (this.id == ("medModifyBtn" + medCompId) || this.id == ("mnuModify" + medCompId)) {
            rType = "amr2-modify";
        }
        // renew action
        else if (this.id == ("medRenewBtn" + medCompId) || this.id == ("mnuRenew" + medCompId)) {
            rType = "amr2-renew";
        }

        var selectedRows = Util.Style.g("amr2-med-selected", rootMedSecCont, "dl");
        var selRowLen = selectedRows.length;
        var origOrders = medComp.originalOrder;
        var orderObject;
        for (var i = 0; i < selRowLen; i++) {
            selRow = selectedRows[i];
            imgSpan = Util.Style.g("amr2-rx-hx", selRow, "span");
            curImg = Util.gc(imgSpan[0]);
            $currentRow = $(selRow);
            orderId = parseFloat(medComp.extractOrderIdFromHtmlId(selRow.id));
            currentOrder = origOrders[orderId + ""];
            orderObject = medComp.originalOrder[orderId];
            // has pending action -> reset
            if ($currentRow.hasClass("amr2-pending-action")) {
                medComp.resetSingleRow(origOrders,selRow);
            }

            if (rType === "amr2-cncld") {
                //DC Selection list not defined -> build the discontinue/complete option
                 if (!currentOrder.DCSelection) {
                    $currentRow.find(".amr2-med-col").append(medComp.buildDCCompleteFragment(orderId, curImg));
                }
            } else if (rType === "amr2-modify") {
                // Not an existing modify
                if(orderObject.PERFORM_ACTION != medComp.MODIFY_ACTION){
                   // Add Order Modify
                    var container = $("<span class='order-modify-details'><span>&nbsp;&nbsp</span><span class='order-details'></span><span>&nbsp;</span><span class='order-routing-details'></span></span>");
                    $currentRow.find("span.amr2-sig.detail-line").parent().append(container);

                    var orderData = {
                        "ORDER_ID": orderId,
                        "EXCLUDE_DETAILS": []
                    };

                    // For prescriptions, exclude dispense quantity/refills -> these will be handled as renew details
                    if(orderObject.hxInd === 0){
                        orderData.EXCLUDE_DETAILS = medComp.renewExcludedDetails;
                    }

                    var orderDetailContainer =  $("#amr2DetailEdit" + medCompId + "_" + orderId);
                    // show order detail editor element
                    var orderModifyObject = new OrderModify(orderData, orderDetailContainer, medComp.modifyManager);
                    // save reference to order modify object
                    orderObject.orderModifyObject  = orderModifyObject;

                    var $toggleIcon = $("<span class='amr2-order-detail-toggle'><img src='"+ipath+"/images/5323_expanded_16.png' /><span>" + amri18n.ORDER_DETAILS + "</span></span>");
                    var detailsTable = $(".oe-edit-en-top-details table",orderDetailContainer).get(0);
                    // find last tabIndex of top details
                    var tabIndex = parseInt($(detailsTable).find(".oe-detail-display").last().attr("tabindex"), 10) + 1;

                    $toggleIcon.on("click", function (e) {
                        var toggleElement = $(this);
                        var nextElement = toggleElement.next();
                        var iconElement;
                        // toggle visibility
                        nextElement.toggle();
                        // element is hidden -> change icon to collpased
                        if (nextElement.is(":hidden")) {
                            $("img", toggleElement).attr("src", ipath + "/images/5323_collapsed_16.png");
                        }
                        // else set to open icon
                        else {
                            $("img", toggleElement).attr("src", ipath + "/images/5323_expanded_16.png");
                        }
                    });

                    // pre-pend a toggle icon
                    orderDetailContainer.prepend($toggleIcon);

                    // indicate modify action to perform
                    orderObject.PERFORM_ACTION = medComp.MODIFY_ACTION;

                    // build the renew details fragment
                    detailsTable = medComp.buildRenewDetailsFragment(orderId, detailsTable, tabIndex);

                    // find routing details

                    // For home medications -> hide the renew details initiall
                    if (orderObject.hxInd === 1) {
                        $(".oe-renew-details", detailsTable).hide();
                    }

                    // Show the container
                    orderDetailContainer.show();
                }

            } else if (rType === "amr2-renew") {
                var orderObject = medComp.originalOrder[orderId];
                 // add the modify pending message
                var container = $("<span class='order-routing-details'>&nbsp;&nbsp;&nbsp;</span>");
                $currentRow.find("span.amr2-sig.detail-line").parent().append(container);

                // indicate modify action to perform
                orderObject.PERFORM_ACTION = medComp.RENEW_ACTION;
                // build the renew details fragment
                routeFrag = medComp.buildRenewDetailsFragment(orderId);

                // if it is a home medication -> set make new prescription indicator to true
                if(orderObject.hxInd === 1){
                    orderObject.makeNewPrescription = true;
                }

                // Append routing and toggle Optional elements
                $currentRow.find(".order-routing-details").append(routeFrag);
            }

            imgSpan = Util.Style.g("amr2-rx-hx", selRow, "span");
            curImg = Util.gc(imgSpan[0]);

            if (rType === "amr2-cncld") {
                curImg.src = ipath + "/images/cancel.gif";
            } else if (rType === "amr2-modify") {
                curImg.src = ipath + "/images/modify.gif";
            } else if (rType === "amr2-renew") {
                curImg.src = ipath + "/images/renew.gif";
            }

            Util.Style.rcss(selRow, "amr2-med-selected");
            Util.Style.rcss(selRow, "amr2-modify");
            Util.Style.rcss(selRow, "amr2-renew");
            Util.Style.rcss(selRow, "amr2-cncld");
            Util.Style.acss(selRow, rType);
            Util.Style.acss(selRow, "amr2-pending-action");

        }

        medComp.checkIntersection(rtUid);

        $("#medSgnBtn" + medCompId).prop("disabled", false);
        $("#medReconBtn" + medCompId).prop("disabled", true);
        var compID = medComp.getComponentId();
        medComp.compMenuReference["compMenuGoto" + compID].setIsDisabled(false);
        medComp.compMenuReference["compMenuSign" + compID].setIsDisabled(false);

        var totRoutes = Util.Style.g("amr2-rt-uid", rootMedSecCont, "span").length;
        if (totRoutes) {
            Util.Style.rcss(_g("routeLink" + medCompId), "amr2-dthrd");
        }
        // disable actions
        medComp.disableActions();
    }
    //reset highlight
    $(this).removeClass("amr2-mnu-hvr");
};

AmbMedsRecComponent2.prototype.buildRenewDetailsFragment = function (orderId, detailsTable, tabIndex) {
    var medComp = this;
    tabIndex = tabIndex || 0;
    if (!medComp.medModObj.jsonRoutes) {
        medComp.getRouteJSON();
    }
    var order = medComp.originalOrder[orderId];
    var $routeFrag;
    var $container;
    var appendToTableInd = false;
    var amri18n = i18n.innov.ambmedsrec_o2;
    //details table provided -> set container to table and indicator to true
    if (detailsTable) {
        $container = detailsTable;
        appendToTableInd = true;
    } else {
        $container = $("<span class='amr2-sel-container'></span>");
    }
    var routes = medComp.medModObj.jsonRoutes;

    // append dispense quantity
    if (order.dispenseQuantity) {
        // append to table
        if (appendToTableInd) {
            // dispense quantity
            var dispenseQuantContainer = $("<td class='oe-renew-details'></td>");
            // build the rx selection container
            dispenseQuantContainer = medComp.appendDispenseDetail(order, dispenseQuantContainer, tabIndex);
            tabIndex+=2;
            //add label to first row
            $("tr:first", $container).append("<td class='oe-renew-details'>" + amri18n.DISPENSE_QUANTITY + "</td>");
            //add values container to second row
            $("tr:nth-child(2)", $container).append(dispenseQuantContainer);
        }
        // append to renew container
        else {
            $container.append("<span>,&nbsp;</span>");
            $container = medComp.appendDispenseDetail(order, $container, tabIndex);
            tabIndex+=2;
        }
    }

    // append refill options
    if (order.refills || order.medClass === "amr2-rx") {
        // append to table
        if (appendToTableInd) {
            // Refill Options
            var refillContainer = $("<td class='oe-renew-details'></td>");
            // build the rx selection container
            refillContainer = medComp.appendRefillDetail(order, refillContainer, tabIndex);
            tabIndex+=2;
            //add label to first row
            $("tr:first", $container).append("<td class='oe-renew-details'>" + amri18n.REFILLS_HEADER + "</td>");
            //add values container to second row
            $("tr:nth-child(2)", $container).append(refillContainer);
        }
        // append to renew container
        else {
            $container.append("<span>,&nbsp;</span>");
            $container = medComp.appendRefillDetail(order, $container, tabIndex);
            tabIndex+=2;
        }
    }

    //append routing options
    if (routes && routes[order.catalogCode]) {
        // append to table
        if (appendToTableInd) {
            // Routing Options
            var routingContainer = $("<td class='oe-renew-details'></td>");
            // build the rx selection container
            routingContainer = medComp.appendRoutingOptions(order, routingContainer, tabIndex);
            tabIndex++;
            //add label to first row
            $("tr:first", $container).append("<td class='oe-renew-details'>" + amri18n.DEF_ROUTE_LBL + "</td>");
            //add values container to second row
            $("tr:nth-child(2)", $container).append(routingContainer);
        }
        // append to renew container
        else {
            $container.append("<span>,&nbsp;</span>");
            $container = medComp.appendRoutingOptions(order, $container, tabIndex);
            tabIndex++;
        }
    }

    // if the order is a home medication and has modify action -> build the send/do not send to rx selection
    if (order.PERFORM_ACTION === medComp.MODIFY_ACTION && order.hxInd) {
        // append to table
        if (appendToTableInd) {
            var rxOptionsContainer = $("<td></td>");
            // build the rx selection container
            rxOptionsContainer = medComp.appendRxOptions(order, rxOptionsContainer, $container, tabIndex);
            //add label to first row
            $("tr:first", $container).append("<td>" + amri18n.RX_OPTIONS + "</td>");
            //add values container to second row
            $("tr:nth-child(2)", $container).append(rxOptionsContainer);
        }
        // append to renew container
        else {
            $container.append("<span>,&nbsp;</span>");
            $container = medComp.appendRxOptions(order, $container, $container, tabIndex);
        }
    }
    return $container;
};

AmbMedsRecComponent2.prototype.appendRoutingOptions = function (order, $container, tabIndex) {
    var routeInfo = this.searchRoutes(order.catalogCode, null);
    var defRoute = routeInfo[3];
    var rtUid = routeInfo[0] + routeInfo[1] + routeInfo[2];
    $routeFrag = $("<span></span>").addClass("amr2-rt-spn");
    $routeFrag.html("<span class='amr2-route-opt-spn'>&nbsp;" + defRoute + "</span><span class='amr2-rt-uid cat-" + order.catalogCode + "'>" + rtUid + "</span>");
    $routeFrag.on("focusin click", this.routeSelect);
    $routeFrag.attr("tabindex", tabIndex);
    $container.append($routeFrag);
    return ($container);
};

AmbMedsRecComponent2.prototype.appendRefillDetail = function (order, $container, tabIndex) {
    order.refills = order.refills || 0;
    var $refillsDisplay = $("<span></span>").addClass("amr2-rfl-rnw").text(" " + order.refills + " " + i18n.innov.ambmedsrec_o2.REFILLS + " ");
    $refillsDisplay.attr("tabindex", tabIndex);
    $refillsDisplay.on("focusin click", this.changeRefill(++tabIndex));
    $container.append($refillsDisplay);
    return ($container);
};

AmbMedsRecComponent2.prototype.appendDispenseDetail = function (order, $container, tabIndex) {
    var $dispenseQuantityDisplay = $("<span></span>").addClass("amr2-disp-q amr2-disp-q-rnw").attr("id", order.ordId).attr("tabindex", tabIndex);
    $("<span></span>").addClass("amr2-dq-qty").text(order.dispenseQuantity).appendTo($dispenseQuantityDisplay);
    $("<span></span>").addClass("amr2-dq-tp").text(" " + order.dispenseQuantityUnit).appendTo($dispenseQuantityDisplay);
    $dispenseQuantityDisplay.on("focusin click", this.changeDispenseQuantity(++tabIndex));
    $container.append($dispenseQuantityDisplay);
    return ($container);
};

AmbMedsRecComponent2.prototype.appendRxOptions = function (order, $container, $detailsContainer, tabIndex) {
    var $sendToRxSelectionFrag;
    var RXList = [{
        "DISPLAY": i18n.innov.ambmedsrec_o2.DONT_MAKE_RX,
        "VALUE": "0"
    }, {
        "DISPLAY": i18n.innov.ambmedsrec_o2.MAKE_RX,
        "VALUE": "1"
    }];
    var initialRXData = {
        "DISPLAY": i18n.innov.ambmedsrec_o2.DONT_MAKE_RX,
        "VALUE": "0"
    };
    var medComp = this;
    var orderModifyObject = order.orderModifyObject;

    $sendToRxSelectionFrag = $("<span></span>").addClass("amr2-sel-spn");
    $sendToRxSelectionFrag.html("<span class='amr2-sel-opt-spn'>" + i18n.innov.ambmedsrec_o2.DONT_MAKE_RX + "</span>");
    $sendToRxSelectionFrag.attr("tabindex", tabIndex);
    $container.append($sendToRxSelectionFrag);
    order.RXSelection = this.getSelectListControl();
    order.RXSelection.setContainerElement($sendToRxSelectionFrag);
    order.RXSelection.setListData(RXList, initialRXData);
    order.RXSelection.setCallBack(function (selectedData) {
        $(".amr2-sel-opt-spn", $sendToRxSelectionFrag).html(selectedData.DISPLAY);
        order.makeNewPrescription = Boolean(selectedData.VALUE);
        // creating a new prescription -> show renew details
        if (order.makeNewPrescription) {
            $(".oe-renew-details", $detailsContainer).show();
            // hide exclusion details on modify object
            orderModifyObject.toggleExclusionDetails(false, medComp.renewExcludedDetails);
        }
        // hide renew details if not creating a prescription
        else {
            $(".oe-renew-details", $detailsContainer).hide();
            // show exclusion details on modify object
            orderModifyObject.toggleExclusionDetails(true, medComp.renewExcludedDetails);
        }
    });
    $sendToRxSelectionFrag.on("focusin", function (e) {
        order.RXSelection.renderSelectList();
        Util.cancelBubble(e);
    });
    return ($container);
};


AmbMedsRecComponent2.prototype.getReconNeeded = function () {
    return this.reconNeededInd;
};

AmbMedsRecComponent2.prototype.setReconNeeded = function (reconInd) {
    this.reconNeededInd = reconInd;
};

AmbMedsRecComponent2.prototype.setCompliance = function (value) {
    this.compliance = value;
};

AmbMedsRecComponent2.prototype.hasCompliance = function () {
    return this.compliance;
};

AmbMedsRecComponent2.prototype.medRowSel = function () {
    var medComp = this;
    return function (selectEvent) {
        medComp.setEditMode(true);
        var rootMedSecCont = medComp.getSectionContentNode();
        var curImg;
        var curSrc;
        var amr2Dets;
        var detLen;
        selectEvent = selectEvent || window.event;


        // make row selection play nice with order details editing
        var $target = $(selectEvent.srcElement);
        // row higlighting / select conflicts
        var $row = $target.prop("tagName") == "DL" ? $target : $target.prop("tagName") == "DD" ? $target.parent() : $target.parentsUntil("dl").parent();


        // if it's a proposal, we aren't going to select it since its not editable
        if ($row.find(".amr2-px").length) {
            // reset hovers
            amr2Dets = Util.Style.g("hvr");
            detLen = amr2Dets.length;
            for (var i = detLen; i--; ) {
                amr2Dets[i].style.display = "none";
            }
            return;
        }
        $row.css("background-color", "");

        //allow multi select if shift key pressed
        if (selectEvent.shiftKey && medComp.medModObj.lastMedSel) {
            var startIndex;
            var endIndex;
            var medRows = Util.Style.g("amr2-info", rootMedSecCont, "dl");
            var medLen = medRows.length;
            //get start and end position of multi select
            for (var rowIndex = 0; rowIndex < medLen; rowIndex++) {
                var curId = medRows[rowIndex].id;
                if (curId == medComp.medModObj.lastMedSel) {
                    startIndex = rowIndex;
                } else if (curId == this.id) {
                    endIndex = rowIndex;
                }
            }
            //flip positions for multi select up
            if (startIndex > endIndex) {
                var tempIndx = startIndex;
                startIndex = endIndex;
                endIndex = tempIndx;
            }

            for (var j = startIndex; j <= endIndex; j++) {
                Util.Style.acss(medRows[j], "amr2-med-selected");
                curImg = $("img", $(medRows[j]).find(".amr2-rx-col"));
                curSrc = curImg.attr("src");
                if (curSrc.search(/_selected/) == -1) {
                    curImg.attr("src", curSrc.replace(".gif", "_selected.gif"));
                }
            }
            //reset last med row selected
            medComp.medModObj.lastMedSel = null;
        } else {
            // this.style.background = "#0000FF";
            curImg = $("img", $(this).find(".amr2-rx-col"));
            curSrc = curImg.attr("src");
            if ($(this).hasClass("amr2-med-selected")) {
                $(this).removeClass("amr2-med-selected");
                //reset last row selected on deselect
                medComp.medModObj.lastMedSel = null;
                //switch images for selected/unselected rows
                if (curSrc.search(/_selected/) > -1) {
                    curImg.attr("src", curSrc.replace("_selected.gif", ".gif"));
                }
            } else {
                $(this).addClass("amr2-med-selected");
                //set last row selected for multi select
                medComp.medModObj.lastMedSel = this.id;
                if (curSrc.search(/_selected/) === -1) {
                    curImg.attr("src", curSrc.replace(".gif", "_selected.gif"));
                }
            }
        }
        var selectedRows = Util.Style.g("amr2-med-selected", rootMedSecCont, "dl");
        var selectLen = selectedRows.length;

        if (selectLen > 0) {
            //refresh hovers when not in edit mode
            if (selectLen === 1 && !medComp.medModObj.editMode) {
                amr2Dets = Util.Style.g("hvr");
                detLen = amr2Dets.length;
                for (var detailIndex = detLen; detailIndex--; ) {
                    amr2Dets[detailIndex].style.display = "none";
                }

            }

            medComp.setEditMode(true);
            medComp.verifyAvailableActions();

            //enable reset if row(s) selected
            var compID = medComp.getComponentId();
            for (var rowsIndex = selectLen; rowsIndex--; ) {
                if (Util.Style.ccss(selectedRows[rowsIndex], "amr2-renew") ||
                        Util.Style.ccss(selectedRows[rowsIndex], "amr2-cncld") ||
                        Util.Style.ccss(selectedRows[rowsIndex], "amr2-modify")) {
                    medComp.compMenuReference["compMenuReset" + compID].setIsDisabled(false);
                    break;
                } else if (rowsIndex === 0) {
                    medComp.compMenuReference["compMenuReset" + compID].setIsDisabled(true);
                }
            }
        } else {
            var rnwdLen = Util.Style.g("amr2-renew", rootMedSecCont, "dl").length;
            var cncldLen = Util.Style.g("amr2-cncld", rootMedSecCont, "dl").length;
            if (rnwdLen === 0 && cncldLen === 0) {
                medComp.setEditMode(false);
            }
            medComp.disableActions();
        }
    };
};

AmbMedsRecComponent2.prototype.getSelectListControl = function () {
    var listData = [];
    var currentSelection = {};
    var onSelectCallBack = null;
    var parentElement = null;
    var displayPref = "popup";
    var originalOrderDetailDisplayOnEditPopup = false;

    function buildSelectHTML () {
        var EditShellHtml = [];
        var fieldDisplayValue = currentSelection.DISPLAY || "";

        EditShellHtml.push("<div class='oe-edit-popup'>");
        EditShellHtml.push("<table class='oe-edit-tbl'>");
        EditShellHtml.push("<tr><td class='oe-edit-tab'><span class='oe-edit-tab-hdr'>", fieldDisplayValue, "</span></td><td class='oe-edit-tab-crnr'></td></tr>");
        EditShellHtml.push("<tr class='oe-edit-row-hd'><td class='oe-edit-row-tl'>&nbsp; </td><td class='oe-edit-row-tr'>&nbsp;</td></tr>");
        EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-l' colspan='2'>");
        if (listData !== null && $.isArray(listData)) {
            EditShellHtml.push("<select  size='6' class='oe-edit-value'>");
            if (listData !== undefined) {
                listData.forEach(function (option) {
                    if(fieldDisplayValue.toUpperCase() === option.DISPLAY.toUpperCase()) {
                        EditShellHtml.push("<option selected value='" + option.VALUE + "'>", option.DISPLAY, "</option>");
                    } else {
                        EditShellHtml.push("<option value='" + option.VALUE + "'>", option.DISPLAY, "</option>");
                    }
                });
            }
            EditShellHtml.push("</select>");
        }
        EditShellHtml.push("</td></tr>");
        EditShellHtml.push("<tr class='oe-edit-row'><td class='oe-edit-row-b oe-edit-container-footer' colspan='2'>&nbsp; </td></tr>");
        EditShellHtml.push("</table>");
        EditShellHtml.push("</div>");

        return EditShellHtml.join("");
    }

    function setSelectValue (editContainer) {
        var selectElement =  $(".oe-edit-value", editContainer).get(0),
            selectedIndex = selectElement.selectedIndex,
            selectedOption;
        if (selectedIndex >= 0) { // valid selection made
            selectedOption = selectElement.options[selectedIndex];
            currentSelection.DISPLAY = selectedOption.innerHTML;
            currentSelection.VALUE = parseFloat(selectedOption.value);
            if (onSelectCallBack) {
                onSelectCallBack(currentSelection);
            }
        }
    }

    function setPosition (parentElement, editContainer) {
        parentElement = parentElement.get(0);

        var p = $(parentElement).position(),
            top = p.top, left = p.left,
            tblAdded = $(".oe-edit-tbl",editContainer);

        if (!originalOrderDetailDisplayOnEditPopup) {
            $(".oe-edit-tab", tblAdded).hide();
            $(".oe-edit-row-tl", tblAdded).css("border-top", "2px solid #568ECB");
            // hiding the first table row means we'll need to have a buffer for the popup
            top += $(parentElement).height();
        }

        if (displayPref === "inline") {
            editContainer.css("display","inline");
            editContainer.css("position","relative");
            tblAdded.css("display","block");
        } else {
            editContainer.css("display","block");
            editContainer.css("position","absolute");
            editContainer.css("left", left + "px");
            editContainer.css("top", top + "px");
        }
    }

    function launchEditSelectPopup (editContainer) {
        var fieldDisplayValue = currentSelection.DISPLAY || "";
        // Edit Container not already appended to order detail entry element
        if(!editContainer.parent().is(parentElement)){
            var hideEvent = function (event) {
                setSelectValue(editContainer);
                editContainer.hide();
            };

            $(".oe-edit-value",editContainer).attr("tabIndex",$(".oe-detail-display",parentElement).attr("tabIndex"));
            $(".oe-edit-value",editContainer).focusout(hideEvent);
            $(".oe-edit-value",editContainer).dblclick(hideEvent);
            $(".oe-edit-value",editContainer).keyup(function (keyupEvent) {
                if ( keyupEvent.which == 13 ) {
                    hideEvent(keyupEvent);
                    keyupEvent.preventDefault();
                }
            });

            // focus event to stop propogation to parent element
            $(".oe-edit-value",editContainer).focus(function (focusEvent) {
                focusEvent.stopPropagation();
                Util.cancelBubble(focusEvent);
            });

            $(".oe-edit-value",editContainer).click(function (focusEvent) {
                focusEvent.stopPropagation();
                Util.cancelBubble(focusEvent);
            });

            // append container to body for display
            $(parentElement).append(editContainer);
            // 'hack' to fix positioning issues in IE the first time these popups are shown
            setPosition(parentElement,editContainer);
        } else {
            // show existing edit container
            editContainer.show();
            // select values from dropdown
            $(".oe-edit-value option").filter(function () {
                return $(this).text().toUpperCase() == fieldDisplayValue.toUpperCase();
            }).attr("selected", true);
        }

        // position container
        setPosition(parentElement, editContainer);

        // set focus on container
        $(".oe-edit-value", editContainer).focus();
    }

    function renderSelectList () {
        // valid parent element and list
        if (parentElement && listData && listData.length > 0) {
            var editContainer = $(".oe-edit-popup", parentElement);

            // build edit container if not defined
            if (!editContainer.get(0)) {
                editContainer = $(buildSelectHTML());
            }

            //launch edit Pop-up
            launchEditSelectPopup(editContainer);
        }
    }

    return ({
        setContainerElement: function (el) {
            parentElement = el;
        },
        setListData: function (data, currentData) {
            listData = data;
            currentSelection = currentData || {};
        },
        setCallBack: function (callBack) {
            onSelectCallBack = callBack;
        },
        renderSelectList: function () {
            renderSelectList();
        }
    });
};

AmbMedsRecComponent2.prototype.getHomeMedicationType = function (order) {
    if (order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.PRESCRIPTION_IND !== "" && order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.PRESCRIPTION_IND === 1) {
        return i18n.innov.ambmedsrec_o2.PRESCRIBED;
    } else if (order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND !== "" && order.MEDICATION_INFORMATION.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND === 1) {
        return i18n.innov.ambmedsrec_o2.DOCUMENTED;
    } else {
        return "";
    }
};

AmbMedsRecComponent2.prototype.getDateFormatter = function () {
    if (this.dateFormatter === null) {
        this.dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
    }
    return this.dateFormatter;
};

AmbMedsRecComponent2.prototype.getDoseRouteInfo = function (order, hoverFlag) {
    return hoverFlag ? order.DISPLAYS.SIMPLIFIED_DISPLAY_LINE : order.DISPLAYS.CLINICAL_DISPLAY_LINE;
};

/**
 * Enable buttons and switch to active image
 * @param {obj} medComp : The Med component to enable actions in
 */
AmbMedsRecComponent2.prototype.enableActions = function (cancelDCInd,modifyInd,renewInd) {
    var ipath = this.getCriterion().static_content;
    var compID = this.getComponentId();
    // enable cancel dc
    if(cancelDCInd){
        $("#medCnclBtn" + compID).prop("disabled", false);
        $("#medCnclImg" + compID).prop("src", ipath + "/images/cancel.gif");
        this.compMenuReference["compMenuCancel" + compID].setIsDisabled(false);
    }

    // enable modify
    if(modifyInd){
        $("#medModifyBtn" + compID).prop("disabled", false);
        $("#medModifyImg" + compID).prop("src", ipath + "/images/modify.gif");
        this.compMenuReference["compMenuModify" + compID].setIsDisabled(false);
    }

    // enable renew
    if(renewInd){
        $("#medRenewBtn" + compID).prop("disabled", false);
        $("#medRenewImg" + compID).prop("src", ipath + "/images/renew.gif");
        this.compMenuReference["compMenuRenew" + compID].setIsDisabled(false);
    }
};

/**
 * Disable buttons and switch to disabled image
 * @param {obj} medComp : The Med component to disable actions in
 */
AmbMedsRecComponent2.prototype.disableActions = function () {
    var ipath = this.getCriterion().static_content;
    var compID = this.getComponentId();
    $("#medModifyBtn" + compID).prop("disabled", true);
    $("#medRenewBtn" + compID).prop("disabled", true);
    $("#medCnclBtn" + compID).prop("disabled", true);
    $("#medModifyImg" + compID).prop("src", ipath + "/images/modify_disabled.gif");
    $("#medRenewImg" + compID).prop("src", ipath + "/images/renew_disabled.gif");
    $("#medCnclImg" + compID).prop("src", ipath + "/images/cancel_disabled.gif");
    //disable component menu items
    this.compMenuReference["compMenuModify" + compID].setIsDisabled(true);
    this.compMenuReference["compMenuRenew" + compID].setIsDisabled(true);
    this.compMenuReference["compMenuCancel" + compID].setIsDisabled(true);

};

/**
 * The following will apply a drug class grouping sort on the drugs displayed in the component.
 *
 * @parameter recordData [required] - The list of all of the drugs which includes the drug class[es] that the drug resides in.
 * @parameter sortCriteria [required] - The hierarchical list of the drug class grouping which the drugs will be sorted by.
 */
AmbMedsRecComponent2.prototype.sortByDropdownValue = function (recordData, sortCriteria) {
    var multumArray = [];
    var nonMultumArray = [];
    var homeMedsi18n = i18n.innov.ambmedsrec_o2;
    var dummyArray = recordData.ORDERS.slice(0);

    if (dummyArray.length && sortCriteria && sortCriteria.length > 0) {
        var order;
        //Loops through all of the drug classes defined in the grouping set in Bedrock
        //Note that the sortCriteria is in reverse hierarchical order, which is why the for loop is in reverse
        for (var i = sortCriteria.length; i--; ) {
            //Loops through all of the drugs
            for (var j = dummyArray.length; j--; ) {
                order = dummyArray[j].MEDICATION_INFORMATION;
                //Loops through all of the classes that the current drug is under.
                if (order.MULTUM_CATEGORY_IDS.length > 0) {
                for (var k = 0, kl = order.MULTUM_CATEGORY_IDS.length; k < kl; k++) {
                        if (sortCriteria[i] === order.MULTUM_CATEGORY_IDS[k].MULTUM_CATEGORY_ID) {
                            multumArray.push(dummyArray[j]);
                            dummyArray.splice(j, 1);
                            break;
                        }
                    }
                } else {
                    nonMultumArray.push(dummyArray[j]);
                    dummyArray.splice(j, 1);
                    break;
                }
            }
        }

        nonMultumArray.sort(this.sortByMedicationName());
        for (var m = 0; m < nonMultumArray.length; m++) {
            multumArray.push(nonMultumArray[m]);
        }

        recordData.ORDERS = multumArray.slice(0);
    } else {
        if (this.getGrouperFilterLabel() === homeMedsi18n.NON_CATEGORIZED) {
            var orderNonMult;
            var initialArray = [];
            var finalArray = [];

            for (var dummyIndex = dummyArray.length; dummyIndex--; ) {
                orderNonMult = dummyArray[dummyIndex].MEDICATION_INFORMATION;
                if (orderNonMult.MULTUM_CATEGORY_IDS.length > 0) {
                    for (var categoryIndex = 0; categoryIndex < orderNonMult.MULTUM_CATEGORY_IDS.length; categoryIndex++) {
                        if (orderNonMult.MULTUM_CATEGORY_IDS[categoryIndex].MULTUM_CATEGORY_ID !== 0) {
                            initialArray.push(dummyArray[dummyIndex]);
                            dummyArray.splice(dummyIndex, 1);
                            break;
                        }
                    }
                } else {
                    finalArray.push(dummyArray[dummyIndex]);
                    dummyArray.splice(dummyIndex, 1);
                }
            }

            finalArray.sort(this.sortByMedicationName());
            initialArray.sort(this.sortByMedicationName());
            for (var arrayIndex = 0; arrayIndex < finalArray.length; arrayIndex++) {
                initialArray.push(finalArray[arrayIndex]);
            }

            recordData.ORDERS = initialArray.slice(0);
        }
    }
    return recordData;
};

AmbMedsRecComponent2.prototype.buildAllergyDisplay = function (element, index) {
    element.REACTION_TYPE = element.REACTION_TYPE ? " (" + element.REACTION_TYPE + ")" : element.REACTION_TYPE;
    if (index > 0) {
        element.REACTION_TYPE = element.REACTION_TYPE + "; ";
    }
    return element.SUBSTANCE_TYPE + element.REACTION_TYPE;
};

AmbMedsRecComponent2.prototype.buildOrderReconciliation = function (ordersArray, continueOrdInd, orderAction) {
    return ['{',
        '"recon_type_flag": 3', // discharge reconciliations only
        ', "to_action_seq": 1',
        ', "no_known_meds_ind": 0',
        ', "reltn_type_mean": "'+orderAction+'"',
        ', "order_list": ['+
                    ($.map(ordersArray, function (element, index) {
                        return ['{',
                            '"order_id": '+parseFloat(element.CORE.ORDER_ID).toFixed(2),
                            ',"clinical_display_line": "'+element.DISPLAYS.CLINICAL_DISPLAY_LINE.replace(/"/g, '\"')+'"',
                            ',"simplified_display_line": "'+element.DISPLAYS.SIMPLIFIED_DISPLAY_LINE.replace(/"/g, '\"')+'"',
                            ',"continue_order_ind": '+continueOrdInd,
                            ',"recon_order_action_mean": "'+orderAction+'"',
                            ',"order_mnemonic": "'+element.DISPLAYS.CLINICAL_NAME.replace(/"/g, '\"')+'"',
                        '}'].join("");
                    }).join(","))
            +']',
    "}"].join("");
};

AmbMedsRecComponent2.prototype.getComplianceInfo = function (compliance, personnelArray) {
    var ar = [];
    var lastDocDate = "", lastDocBy = "", msg = "";
    var amri18n = i18n.innov.ambmedsrec_o2;

    if (compliance.NO_KNOWN_HOME_MEDS_IND === 0 && compliance.UNABLE_TO_OBTAIN_IND === 0) {
        return [];
    } else if (compliance.NO_KNOWN_HOME_MEDS_IND === 1) {
        msg = amri18n.NO_KNOWN_HOME_MEDS;
    } else if (compliance.UNABLE_TO_OBTAIN_IND === 1) {
        msg = amri18n.UNABLE_TO_OBTAIN_MED_HIST;
    }

    if (compliance.PERFORMED_PRSNL_ID > 0) {
        var provider = MP_Util.GetValueFromArray(compliance.PERFORMED_PRSNL_ID, personnelArray);
        lastDocBy = provider.fullName;
    }
    if (compliance.PERFORMED_DATE !== "") {
        var dateTime = new Date();
        dateTime.setISO8601(compliance.PERFORMED_DATE);
        var df = this.getDateFormatter();
        lastDocDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
    }
    ar.push("<dl class='amr2-info'><dd><span class='important-icon'> </span><span>", msg, "</span></dd></dl><h4 class='det-hd'><span>", amri18n.MED_DETAIL, "</span></h4>", "<div class='hvr'><dl class='amr2-det'>", "<dt><span>", amri18n.LAST_DOC_DT_TM, ":</span></dt><dd class='amr2-det-name'><span>", lastDocDate, "</span></dd><dt><span>", i18n.innov.ambmedsrec_o2.LAST_DOC_BY, ":</span></dt><dd class='amr2-det-dt'><span>", lastDocBy, "</span></dd></dl></div>");
    return ar.join("");
};

AmbMedsRecComponent2.prototype.getMedicationDisplayNameForHover = function (order) {
    var medName = "";
    if (order.DISPLAYS === null) {
        return "";
    }

    medName = order.DISPLAYS.REFERENCE_NAME;
    if (medName === "") {
        medName = order.DISPLAYS.CLINICAL_NAME;
    } else if (order.DISPLAYS.CLINICAL_NAME !== "" && order.DISPLAYS.CLINICAL_NAME !== medName) {
        medName = medName.concat(" (", order.DISPLAYS.CLINICAL_NAME, ")");
    }
    if (medName === "") {
        medName = order.DISPLAYS.DEPARTMENT_NAME;
    }

    return medName;
};

AmbMedsRecComponent2.prototype.getRouteJSON = function () {
    try {
        MP_Util.LogDiscernInfo(this, "POWERORDERS", "ambmedsrec-o2.js", "getRouteJSON");
        var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
        var criterion = this.getCriterion();
        var dPersonId = criterion.person_id;
        var dEncounterId = criterion.encntr_id;
        var hMOEW = PowerOrdersMPageUtils.CreateMOEW(dPersonId, dEncounterId, 0, 2, 127);
        var routeListJSON = PowerOrdersMPageUtils.GetConsolidatedRoutingOptions(hMOEW, this.medModObj.catCodeList);
        if (routeListJSON) {
            this.medModObj.jsonRoutes = JSON.parse(routeListJSON);
        }
        PowerOrdersMPageUtils.DestroyMOEW(hMOEW);
    } catch (err) {
        MP_Util.LogJSError(err, this, "ambmedsrec-o2.js", "getRouteJSON");
        alert(i18n.innov.ambmedsrec_o2.ROUTE_LIST_ERROR + ": " + err.description);
    }
};

AmbMedsRecComponent2.prototype.buildRefillBar = function (daysRemaining, refillsRemaining, totalRefills) {
    var emptyCount = totalRefills - refillsRemaining;
    var fillClass = "";
    var displayHTML = "<table class='amr2-refill-bar'><tr>";

    if (daysRemaining >= 120) {
        fillClass = "amr2-refill-cell-many";
    } else if (daysRemaining >= 60) {
        fillClass = "amr2-refill-cell-some";
    } else if (daysRemaining >= 1) {
        fillClass = "amr2-refill-cell-few";
    }

    var index;

    if(refillsRemaining > 0){
        for (index = refillsRemaining; index--;){
            displayHTML += "<td class='" + fillClass + "'></td>";
        }
    }


    if(emptyCount > 0){
        for (index = emptyCount; index--;){
           displayHTML += "<td class='amr2-refill-bar-empty'></td>";
        }
    }
    displayHTML += "</tr></table>";

    return displayHTML;
};

/**
 * To display a spinner while component loads.
 * * @function
 * @memberof AmbMedsRecComponent2
 * @name showLoadingImage
 *
 * This function handles the logic to display a loading image on the content body when the backend script is running
 */
AmbMedsRecComponent2.prototype.showLoadingImage = function () {
    var compId = this.getComponentId();
    var dialog = _g("amr2-loading" + compId);
    dialog.innerHTML += "<div id='loadingimage" + compId + "' class='loading-spinner amr2-comm-loading'>&nbsp;</div>";
    //displaying a loading image.
    var loadingImage = _g("loadingimage" + compId);
    if (dialog.style.display === "block") {
        dialog.style.display = "none";
    } else {
        loadingImage.style.height = $("#amr2Content" + compId).height() + "px";
        dialog.style.display = "block";
    }
};

/**
 * Calls the architecture level resizeComponent function while adding some component specific logic.
 * @this {AmbMedsRecComponent2}
 * @return null
 */
AmbMedsRecComponent2.prototype.resizeComponent = function () {
    //Call base class functionality to resize component
    MPageComponent.prototype.resizeComponent.call(this);

    //Adjust the component headers if scrolling is applied
    var contentBody = $("#" + this.getStyles().getContentId()).find(".content-body");
    if (contentBody.length) {
        var maxHeight = parseInt($(contentBody).css("max-height").replace("px", ""), 10);

        //Get total height of all rows
        var contentHeight = 0;
        contentBody.find(".amr2-info").each(function (index) {
            contentHeight += $(this).outerHeight(true);
        });

        if (!isNaN(maxHeight) && (contentHeight > maxHeight)) {
            $("#amr2ContentHeader" + this.getComponentId()).addClass("amr2-header-shifted");
        } else {
            $("#amr2ContentHeader" + this.getComponentId()).removeClass("amr2-header-shifted");
        }
    }
};

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings for InfoButton
 */
AmbMedsRecComponent2.prototype.loadFilterMappings = function () {
    this.addFilterMappingObject("AMB_MEDS_MODS", {
        setFunction: this.setMedModInd,
        type: "Boolean",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_PRINT_DISPLAY", {
        setFunction: this.setPrintDisplayInd,
        type: "Boolean",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_PRINT", {
        setFunction: this.setPrintClinicalEvent,
        type: "NUMBER",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_PRINT_TITLE", {
        setFunction: this.setPrintClincialEventTitle,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_DISCH_MED_REC_MOD", {
        setFunction: this.setMedRec,
        type: "Boolean",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_DISCH_MED_REC_ACTION", {
        setFunction: this.setOneClickReconciliationActionInd,
        type: "Boolean",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM1_LABEL", {
        setFunction: this.setGrp1Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM1", {
        setFunction: this.setGrp1Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM2_LABEL", {
        setFunction: this.setGrp2Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM2", {
        setFunction: this.setGrp2Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM3_LABEL", {
        setFunction: this.setGrp3Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM3", {
        setFunction: this.setGrp3Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM4_LABEL", {
        setFunction: this.setGrp4Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM4", {
        setFunction: this.setGrp4Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM5_LABEL", {
        setFunction: this.setGrp5Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM5", {
        setFunction: this.setGrp5Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM6_LABEL",{
        setFunction: this.setGrp6Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM6",{
        setFunction: this.setGrp6Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM7_LABEL",{
        setFunction: this.setGrp7Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM7",{
        setFunction: this.setGrp7Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM8_LABEL",{
        setFunction: this.setGrp8Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM8",{
        setFunction: this.setGrp8Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM9_LABEL",{
        setFunction: this.setGrp9Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM9",{
        setFunction: this.setGrp9Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM10_LABEL",{
        setFunction: this.setGrp10Label,
        type: "String",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("AMB_HOME_MEDS_MULTUM10",{
        setFunction: this.setGrp10Criteria,
        type: "Array",
        field: "PARENT_ENTITY_ID"
    });
};
/**
 * LOAD INDICATOR                      BASE10  INCLUDE
 * load_ordered_ind                    1       YES
 * load_future_ind                     2       YES
 * load_in_process_ind                 4       YES
 * load_on_hold_ind                    8       YES
 * load_suspended_ind                  16      YES
 * load_incomplete_ind                 32      NO
 * load_canceled_ind                   64      NO
 * load_discontinued_ind               128     NO
 * load_completed_ind                  256     NO
 * load_pending_complete_ind           512     NO
 * load_voided_with_results_ind        1024    NO
 * load_voided_without_results_ind     2048    NO
 * load_transfer_canceled_ind          4096    NO
 *
 * 1 + 2 + 4 + 8 + 16 = 31
 */
AmbMedsRecComponent2.prototype.retrieveComponentData = function () {
    var self = this;
    this.loadReconciliationStatus(function () {
        var params = [];
        var criterion = self.getCriterion();
        // reset original orders
        self.originalOrder = {};
        params.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id+ ".0", criterion.provider_id + ".0");
        params.push(3650, 31, 6, 0, 1, 0, 0, 0, 0, 0, 0, self.getScope(), criterion.ppr_cd + ".0", 1);
        var request = new MP_Core.ScriptRequest(self, self.getComponentLoadTimerName());
        request.setProgramName("INN_MP_GET_ORDERS_PROPOSALS");
        request.setParameters(params);
        request.setAsync(true);
        MP_Core.XMLCCLRequestCallBack(self, request, function (reply) {
            self.renderComponent(reply.getResponse());
        });
    });
};

/**
 * The following function is used for the component level menu for home-meds-o2. The items in the component level menu also include a fly out sequence by menu which lists
 * out the filters from bedrock and the data is displayed based on the filter selected. It also has some buttons which are based on the selection of the rows. Additionally,
 * any selected grouping will automatically be saved to the component upon click.
 */
AmbMedsRecComponent2.prototype.preProcessing = function () {
    this.m_grouper_arr = this.m_grouper_arr || [];
    var compMenu = this.getMenu();
    var amri18n = i18n.innov.ambmedsrec_o2;
    var mnuDisplay = "";
    var compID = this.getComponentId();
    var style = this.getStyles();
    var groupLen = this.m_grouper_arr.length;
    var uniqueComponentId = style.getId();
    var self = this;

    if (compMenu) {
        // Declare component menu items and add events to them
        var compMenuSequence = new Menu("compMenuSequence" + compID);
        //InfoButton Menu item
        var compMenuInfoButton = new MenuSelection("compMenuInfoButton" + compID);
        var compMenuSeperator = new MenuSeparator("compMenuSeperator" + compID);
        var compMenuModify = new MenuSelection("compMenuModify" + compID);
        var compMenuRenew = new MenuSelection("compMenuRenew" + compID);
        var compMenuCancel = new MenuSelection("compMenuCancel" + compID);
        var compMenuReset = new MenuSelection("compMenuReset" + compID);
        var compMenuGoto = new MenuSelection("compMenuGoto" + compID);
        var compMenuSign = new MenuSelection("compMenuSign" + compID);


        compMenuSequence.setLabel(amri18n.SEQUENCEBY);
        compMenuSequence.setAnchorConnectionCorner(["top", "left"]);
        compMenuSequence.setContentConnectionCorner(["top", "right"]);
        compMenuSequence.setIsDisabled(false);
        compMenu.addMenuItem(compMenuSequence);

        //Validate InfoButton from Bedrock
        if (self.hasInfoButton()) {
            compMenuInfoButton.setLabel(i18n.innov.INFO_BUTTON);
            compMenu.addMenuItem(compMenuInfoButton);
            compMenuInfoButton.setIsDisabled(!self.hasInfoButton());
            this.compMenuReference[compMenuInfoButton.getId()] = compMenuInfoButton;

            compMenuInfoButton.setClickFunction(function (clickEvent) {
                clickEvent.id = "mnuInfoButton" + compID;
                self.callInfoButtonClick(clickEvent);
            });
        }

        compMenu.addMenuItem(compMenuSeperator);

        compMenuModify.setLabel(amri18n.MED_MODIFY);
        compMenu.addMenuItem(compMenuModify);
        compMenuModify.setIsDisabled(true);
        this.compMenuReference[compMenuModify.getId()] = compMenuModify;

        compMenuRenew.setLabel(amri18n.MED_RENEW);
        compMenu.addMenuItem(compMenuRenew);
        compMenuRenew.setIsDisabled(true);
        this.compMenuReference[compMenuRenew.getId()] = compMenuRenew;

        compMenuCancel.setLabel(amri18n.MED_DC_COMPLETE);
        compMenu.addMenuItem(compMenuCancel);
        compMenuCancel.setIsDisabled(true);
        this.compMenuReference[compMenuCancel.getId()] = compMenuCancel;

        compMenuReset.setLabel(amri18n.MED_RESET);
        compMenu.addMenuItem(compMenuReset);
        compMenuReset.setIsDisabled(true);
        this.compMenuReference[compMenuReset.getId()] = compMenuReset;

        compMenuGoto.setLabel(amri18n.MED_GTO);
        compMenu.addMenuItem(compMenuGoto);
        compMenuGoto.setIsDisabled(true);
        this.compMenuReference[compMenuGoto.getId()] = compMenuGoto;

        compMenuSign.setLabel(amri18n.MED_SIGN);
        compMenu.addMenuItem(compMenuSign);
        compMenuSign.setIsDisabled(true);
        this.compMenuReference[compMenuSign.getId()] = compMenuSign;


        compMenuModify.setClickFunction(function (clickEvent) {
            clickEvent.id = "mnuModify" + compID;
            self.callQueueOrder(clickEvent);
        });

        compMenuRenew.setClickFunction(function (clickEvent) {
            clickEvent.id = "mnuRenew" + compID;
            self.callQueueOrder(clickEvent);
        });

        compMenuCancel.setClickFunction(function (clickEvent) {
            clickEvent.id = "medCnclBtn" + compID;
            self.callQueueOrder(clickEvent);
        });

        compMenuReset.setClickFunction(function (clickEvent) {
            clickEvent.id = "mnuRnwReset" + compID;
            self.callResetRows(clickEvent);
        });

        compMenuGoto.setClickFunction(function (clickEvent) {
            clickEvent.id = "mnuGtOrders" + compID;
            self.callSignMedMods(clickEvent);
        });

        compMenuSign.setClickFunction(function (clickEvent) {
            clickEvent.id = "mnuSign" + compID;
            self.callSignMedMods(clickEvent);
        });

        // if there are no filters defined in bedrock then remove the sequence by filter.
        var bedrockGroupersDefined = false;
        for (var i = 0; i < 10; i++) {//10 is the maximum number of filter labels
            if (self.getGrouperLabel(i)) {
                bedrockGroupersDefined = 1;
                break;
            }
        }

        if (bedrockGroupersDefined === 0) {
            compMenu.removeMenuItem(compMenuSequence);
            compMenu.removeMenuItem(compMenuSeperator);
        }

        if (self.getGrouperFilterLabel()) {
            mnuDisplay = self.getGrouperFilterLabel();
        }

        var createFilterClickFunction = function (menuItem, index) {
            return function () {
                var a = 0;
                var compMenuArr = compMenuSequence.getMenuItemArray();
                if (compMenuArr && compMenuArr.length) {
                    for ( a = compMenuArr.length; a--; ) {
                        compMenuArr[a].setIsSelected(false);
                    }
                }
                menuItem.setIsSelected(true);
                if (index === 10) {// default is selected
                    self.showLoadingImage(compID);
                    self.displayAllData(-1);
                } else {// bedrock filter is selected
                    var grouperCriteria = self.getGrouperCriteria(index);
                    var recordData = self.getAllData();
                    self.setGrouperFilterLabel(menuItem.getLabel());
                    self.setGrouperFilterCriteria(grouperCriteria);
                    self.showLoadingImage(compID);
                    MP_Core.AppUserPreferenceManager.UpdateSingleCompPreferences(self, true);
                    if (recordData) {
                        self.displayAllData(index);
                    }
                }
            };
        };

        var groupingFilterItem;
        if (groupLen > 0) {
            groupingFilterItem = new MenuSelection("groupingFilterItem" + uniqueComponentId + "-" + 10);
            groupingFilterItem.setLabel(amri18n.DEFAULT);
            compMenuSequence.addMenuItem(groupingFilterItem);
            groupingFilterItem.setClickFunction(createFilterClickFunction(groupingFilterItem, 10));
            if (mnuDisplay === "") {
                groupingFilterItem.setIsSelected(true);
            }
        }

        for (var index = 0, count = 0; count < groupLen && index < 10; index++) {
            var currentLabel = self.getGrouperLabel(index);
            if (currentLabel) {
                count++;
                groupingFilterItem = new MenuSelection("groupingFilterItem" + uniqueComponentId + "-" + index);
                groupingFilterItem.setLabel(currentLabel);

                if (currentLabel === mnuDisplay) {
                    groupingFilterItem.setIsSelected(true);
                }

                groupingFilterItem.setClickFunction(createFilterClickFunction(groupingFilterItem, index));
                compMenuSequence.addMenuItem(groupingFilterItem);
            }
        }

        var groupingFilterNonCatItem = new MenuSelection("groupingFilterNonCatItem" + uniqueComponentId + "-" + groupLen + 1);
        groupingFilterNonCatItem.setLabel(amri18n.NON_CATEGORIZED);

        if (amri18n.NON_CATEGORIZED === mnuDisplay) {
            groupingFilterNonCatItem.setIsSelected(true);
        }

        groupingFilterNonCatItem.setClickFunction(createFilterClickFunction(groupingFilterNonCatItem, groupLen + 1));
        compMenuSequence.addMenuItem(groupingFilterNonCatItem);
        MP_MenuManager.updateMenuObject(compMenu);
    }
};

AmbMedsRecComponent2.prototype.assignNewOrderSentenceIds = function (successInd, newOrders,cancelOrders) {
    try {
        var orderable, ordSentence;
        //Assign order sentence id from order sentence object to orderable
        for (var index = 0,len = newOrders.length; index < len; index++) {
            orderable = newOrders[index];
            ordSentence = orderable.order_sentence;
            if (ordSentence) {
                orderable.sentenceId = ordSentence.getAttribute("ORDER_SENTENCE_ID");
            }
        }
        //Proceed with signing the new orderables
        this.signMOEWOrderables(newOrders,cancelOrders);
    } catch (e) {
        // Destroy any order sentences
        this.sentenceManager.destroyOrderSentences(function (successInd) {});
        throw (e);
    }
};

AmbMedsRecComponent2.prototype.signMOEWOrderables = function (newOrders,cancelOrders) {
    try {
        var MOEWXml = "";
        var moewParamString = [];
        var criterion = this.getCriterion();
        var orderable;
        var reconciliationData;
        var medComp = this;
        // any new order  to sign
        if((newOrders && newOrders.length > 0) || (cancelOrders && cancelOrders.length > 0)) {
            moewParamString.push(String(criterion.person_id));
            moewParamString.push("|");
            moewParamString.push(String(criterion.encntr_id));
            moewParamString.push("|");
            // build the parameters for each new order
            for (var index = 0; index < newOrders.length; index++) {
                orderable = newOrders[index];
                moewParamString.push("{ORDER|");
                moewParamString.push(orderable.synonymId);
                // order as prescription
                moewParamString.push("|1|");
                moewParamString.push(orderable.sentenceId);
                moewParamString.push("|0|1}");
            }

            // build the parameters for each cancel order
            for (var index = 0; index < cancelOrders.length; index++) {
                orderable = cancelOrders[index];
                moewParamString.push("{CANCEL DC|");
                moewParamString.push(orderable.ordId.toFixed(2));
                moewParamString.push("}");
            }

            //options for MOEW
            moewParamString.push("|24|{2|127}|32|1"); // silent sign

            MOEWXml = window.external.MPAGES_EVENT("ORDERS", moewParamString.join(""));

            // build the new order reconciliations
            reconciliationData = this.buildReconciliationData(MOEWXml, newOrders);

            // If new orders -> Destroy any order sentences and perform reconciliation
            if(newOrders && newOrders.length > 0){
                this.sentenceManager.destroyOrderSentences(function (successInd) {
                    // perform reconciliation
                    medComp.performReconciliation(reconciliationData);
                });
            }
            // else perform reconciliation
            else{
                medComp.performReconciliation(reconciliationData);
            }
        }
    }
    catch (e) {
        // Destroy any order sentences
        this.sentenceManager.destroyOrderSentences(function (successInd) {});
        throw (e);
    }
};

AmbMedsRecComponent2.prototype.getOrdersToDisplay = function(recordData){
    var ordersLength = recordData.ORDERS.length;
    var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
    var orderStatus;
    var currentOrder;
    var ordersToDisplay = {
        "TOTAL_CNT":0,
        "ORDERS":[],
        "ORDER_PROPOSALS":[]
    };

    // Get Orders to display
   for (var x = 0; x < ordersLength; x++) {
            currentOrder = recordData.ORDERS[x];
            orderStatus = MP_Util.GetValueFromArray(currentOrder.CORE.STATUS_CD, codeArray);
            // don't show med student orders or orders without a show indicator
            if (orderStatus.meaning === "MEDSTUDENT" || currentOrder.RECON_ACTION_DETAILS.SHOW_IND === 0) {
                continue;
            }
            ordersToDisplay.ORDERS.push(currentOrder);
            ordersToDisplay.TOTAL_CNT += 1;
    }

    // set order proposals
    ordersToDisplay.ORDER_PROPOSALS = recordData.ORDER_PROPOSALS;
    ordersToDisplay.TOTAL_CNT += recordData.ORDER_PROPOSALS.length;
    return (ordersToDisplay);
};


AmbMedsRecComponent2.prototype.renderComponent = function (recordData) {
    var component = this;
    var amri18n = i18n.innov.ambmedsrec_o2;
    var bMedMod = component.isMedModInd();
    var medCompId = component.getComponentId();
    var componentId = component.getComponentId();

    component.reconciliationStatus.encounter.type_mean = recordData.ENCOUNTER.TYPE_MEAN;

    component.setCompliance(false);
    //To save time from consistently calling the MP_GET_ORDERS script, the drugs that are retrieved from the beginning of the session will be saved and then retrieved locally for each refresh.
    component.setAllData(recordData);
    // build list of orders to displau
    component.ordersToDisplay = component.getOrdersToDisplay(recordData);
    component.displayAllData();

    //Add Info Button click events
    if (component.hasInfoButton() && component.isInfoButtonEnabled()) {
        var hmlInfoIcons = $("#amr2Content" + componentId).find(".amr2-info-icon");

        $.each(hmlInfoIcons, function () {
            $(this).on("click", function (e) {
                try {
                    //Get the values needed for the API
                    var patId = $(this).attr("data-patId");
                    var encId = $(this).attr("data-encId");
                    var synonymId = $(this).attr("data-synonymId");
                    var priCriteriaCd = $(this).attr("data-priCriteriaCd");
                    var launchInfoBtnApp = window.external.DiscernObjectFactory("INFOBUTTONLINK");
                    if (launchInfoBtnApp) {
                        launchInfoBtnApp.SetInfoButtonData(parseFloat(patId), parseFloat(encId), parseFloat(priCriteriaCd), 1, 2);
                        launchInfoBtnApp.AddMedication(parseFloat(synonymId));
                        launchInfoBtnApp.LaunchInfoButton();
                    }
                } catch (err) {
                    MP_Util.LogJSError(component, err, "ambmedsrec-o2.js", "renderComponent");
                    // bubble error up
                    throw err;
                } finally {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            });
        });
    }

    // turn on medication modifiers if any orders are present on patient
    if (bMedMod && component.ordersToDisplay.TOTAL_CNT > 0) {
        //add button click events
        Util.addEvent(_g("medModifyBtn" + medCompId), "click", component.queueOrder);
        Util.addEvent(_g("medRenewBtn" + medCompId), "click", component.queueOrder);
        Util.addEvent(_g("medCnclBtn" + medCompId), "click", component.queueOrder);

        var medModRootId = "amr2" + medCompId;
        var medCompSec = _g(medModRootId);
        //disable native selection to use custom select
        medCompSec.onselectstart = function () {
            return false;
        };
        //build component actions menu
        component.addMenuOption("mnuModify", "mnuModify" + medCompId, amri18n.MED_MODIFY, true, "click", component.queueOrder);
        component.addMenuOption("mnuRenew", "mnuRenew" + medCompId, amri18n.MED_RENEW_RX, true, "click", component.queueOrder);
        component.addMenuOption("mnuCancel", "mnuCancel" + medCompId, amri18n.MED_DC_COMPLETE, true, "click", component.queueOrder);
        component.addMenuOption("mnuRnwReset", "mnuRnwReset" + medCompId, amri18n.MED_RESET, true, "click", component.resetRows);
        component.addMenuOption("mnuGtOrders", "mnuGtOrders" + medCompId, amri18n.MED_GTO, true, "click", component.signMedMods);
        component.addMenuOption("mnuSign", "mnuSign" + medCompId, amri18n.MED_SIGN, true, "click", component.signMedMods);

        component.createMenu();
        //add click events
        Util.addEvent(_g("medSgnBtn" + medCompId), "click", component.signMedMods);

        //add row click events
        var rootMedSecCont = component.getSectionContentNode();
        var medRows = Util.Style.g("amr2-info", rootMedSecCont, "dl");
        var mrLen = medRows.length;

        for (var i = mrLen; i--; ) {
            if (component.hasCompliance() && i === 0) {
                continue;
            } else {
                $(medRows[i]).on("click", component.medRowSel());
            }
        }
        OrderEntryFields.setOriginalOrderDetailDisplayOnEditPopup(true);
        component.modifyManager.setBuildOrderModifiesSynchronously(true);
        // set flag to only retrieve required and optional fields
        component.modifyManager.setMaxAcceptFlag(1);
        component.modifyManager.setDisplayEditableOnly(true);
        component.modifyManager.setActionTypeMeaning("DISORDER");
        component.modifyManager.setAdditionalDetailsToModify('value("STRENGTHDOSE","STRENGTHDOSEUNIT","VOLUMEDOSE","VOLUMEDOSEUNIT","FREETXTDOSE","SCH/PRN","PRNREASON","PRNINSTRUCTIONS","SPECINX")');
        // attach on render event handler to hide optional details
        component.modifyManager.onRender = function(modifyInstance){
            var parentElement = modifyInstance.getElement();
        };

        //reset after component refresh
        component.setEditMode(false);
    }
};

AmbMedsRecComponent2.prototype.loadReconciliationStatus = function (callback) {
    var amri18n = i18n.innov.ambmedsrec_o2;
    var component = this;
    var criterion = this.getCriterion();

    var params = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", criterion.ppr_cd + ".0"];
    var request = new MP_Core.ScriptRequest();
    request.setProgramName("MP_GET_MED_STATUS");
    request.setParameters(params);
    request.setAsync(true);

    MP_Core.XMLCCLRequestCallBack(null, request, function (reply) {
        // set reconcilation status
        var data = reply.getResponse();
        component.m_venueCode.admission = data.VENUE_CODE.ADMISSION;
        component.m_venueCode.discharge = data.VENUE_CODE.DISCHARGE;

        component.reconciliationStatus.componentId = component.getComponentId();
        component.reconciliationStatus.history.performedDate = data.MEDS_HIST_STATUS.PERFORMED_DATE;
        component.reconciliationStatus.history.performedBy = data.MEDS_HIST_STATUS.PERFORMED_PRSNL_NAME;

        switch (data.MEDS_HIST_STATUS.STATUS_FLAG) {
            case 0:
                component.reconciliationStatus.history.css = "complete";
                component.reconciliationStatus.history.status = amri18n.COMPLETE;
                break;
            case 1:
                component.reconciliationStatus.history.css = "not-started";
                component.reconciliationStatus.history.status = amri18n.INCOMPLETE;
                break;
            case 2:
                component.reconciliationStatus.history.css = "inerror";
                component.reconciliationStatus.history.status = amri18n.IN_ERROR;
                break;
            case 3:
                component.reconciliationStatus.history.css = "partial";
                component.reconciliationStatus.history.status = amri18n.PARTIAL;
                break;
            case 4:
                component.reconciliationStatus.history.css = "partial-complete";
                component.reconciliationStatus.history.status = amri18n.PARTIAL_COMPLETE;
                break;
            case 5:
                component.reconciliationStatus.history.css = "not-started";
                component.reconciliationStatus.history.status = amri18n.NOT_STARTED;
                break;
            default:
                component.reconciliationStatus.history.css = "unknown";
                component.reconciliationStatus.history.status = amri18n.UNKNOWN;
                break;
        }

        component.reconciliationStatus.discharge.performedDate = data.MEDREC_DISCHARGE_STATUS.PERFORMED_DATE;
        component.reconciliationStatus.discharge.performedBy = data.MEDREC_DISCHARGE_STATUS.PERFORMED_PRSNL_NAME;

        switch (data.MEDREC_DISCHARGE_STATUS.STATUS_FLAG) {
            case 0:
                component.reconciliationStatus.discharge.css = "complete";
                component.reconciliationStatus.discharge.status = amri18n.COMPLETE;
                break;
            case 1:
                component.reconciliationStatus.discharge.css = "partial";
                component.reconciliationStatus.discharge.status = amri18n.PARTIAL;
                break;
            case 2:
                component.reconciliationStatus.discharge.css = "inerror";
                component.reconciliationStatus.discharge.status = amri18n.IN_ERROR;
                break;
            case 3:
                component.reconciliationStatus.discharge.css = "partial";
                component.reconciliationStatus.discharge.status = amri18n.PARTIAL;
                break;
            case 4:
                component.reconciliationStatus.discharge.css = "partial-complete";
                component.reconciliationStatus.discharge.status = amri18n.PARTIAL_COMPLETE;
                break;
            case 5:
                component.reconciliationStatus.discharge.css = "not-started";
                component.reconciliationStatus.discharge.status = amri18n.NOT_STARTED;
                break;
            default:
                component.reconciliationStatus.discharge.css = "unknown";
                component.reconciliationStatus.discharge.status = amri18n.UNKNOWN;
                break;
        }

        callback();
    });

};

/**
 * The following function will display the drugs in the home medication's component. The function determines how the drugs will be sorted and will then display
 * the drugs in the order that has been determined.
 *
 * @Parameter componentId [required] - The id of the instantiated Home Medication's component.
 * @Parameter groupNum [optional] - The grouping number of the selected drug class grouping.
 */
AmbMedsRecComponent2.prototype.displayAllData = function (groupNum) {
    try {
        var component = this;
        var componentId = this.getComponentId();
        var parentDiv = _g("grouperSelect" + componentId);
        var recordData = component.getAllData();
        var ordersToDisplay = component.ordersToDisplay;
        var medCompId = componentId;
        var amri18n = i18n.innov.ambmedsrec_o2;
        var meds = [];
        var criterion = component.getCriterion();
        var ipath = criterion.static_content;

        // Is the component first loading (without a grouping selected)
        // or has an option other than the previously selected option been selected?
        if (groupNum && groupNum !== -1 && parseInt(component.selectedGrouping, 10) === groupNum) {
            return;
        }

        if (isFinite(groupNum)) {
            if (groupNum === -1) {
                MP_Core.AppUserPreferenceManager.ClearCompPreferences(componentId);
                component.setGrouperFilterLabel("");
            }
        }

        var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
        var reconciliationNeeded = component.getReconNeeded();
        var reconciliationMessage = "";
        var reconciliationClass = "";
        var reconciliationIndicatorHtml = [];
        // Show reconciliation status when
        // Display medication reconciliation action preference is turned on
        // and there are orders present or no known home medications compliance is documented
        if (recordData.ORDERS.length > 0 || recordData.COMPLIANCE.NO_KNOWN_HOME_MEDS_IND === 1) {
            if (this.getOneClickReconciliationActionInd()) {
                // no known home medications
                if (recordData.COMPLIANCE.NO_KNOWN_HOME_MEDS_IND === 1 && recordData.ORDERS.length === 0) {
                    reconciliationMessage = amri18n.STATUS_UNRECONCILED;
                    reconciliationClass = "amr2-unreconciled";
                } else {
                    if (reconciliationNeeded) {
                        reconciliationMessage = amri18n.STATUS_UNRECONCILED;
                        reconciliationClass = "amr2-unreconciled";
                    } else {
                        reconciliationMessage = amri18n.STATUS_RECONCILED;
                        reconciliationClass = "amr2-reconciled";
                    }
                }
                reconciliationIndicatorHtml.push("<div class='amr2-mrec'>");
                reconciliationIndicatorHtml.push("<span class='", reconciliationClass, "' id='medReconBtn", medCompId, "'>", reconciliationMessage, "</span>");
                reconciliationIndicatorHtml.push("</div>");
            }
            meds.push(window.render.amrReconciliationStatusBar(component.reconciliationStatus));
        }

        meds.push("<div id='amr2-loading", medCompId, "' class='loading-screen amr2-loading'></div>");
        meds.push("<div class='amr2-table'>");
        var complianceText = component.getComplianceInfo(recordData.COMPLIANCE, personnelArray);
        if (complianceText.length > 0) {
            meds.push(complianceText);
            component.setCompliance(true);
        }

        var infoClass = "";
        var sHTML = "";
        var countText = "";
        var currentDate = new Date();
        var medCnt = 0;
        var rowCnt = 0;
        var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
        var df = this.getDateFormatter();
        var imgType = "";
        var imgClass = "";
        var catCodeList = "";
        var bMedMod = component.isMedModInd();
        var displayActionsInd = false;
        var grouperCriteria;
        var hasFilters = false;

        // Any orders to display
        if (ordersToDisplay.TOTAL_CNT > 0) {
            // show actions
            displayActionsInd = true;

            meds.push("<div class='amr2-container'>");
            // table header
            meds.push("<div class='hdr'><dl id='amr2ContentHeader", medCompId, "' class='amr2-header amr2-header-shifted'>");
            meds.push("<dd class='amr2-med-col amr2-header-format'>", amri18n.MEDICATION, "</dd>");
            meds.push("<dd class='amr2-compliance amr2-header-format'><span>", amri18n.COMPLIANCE, "</span></dd>");
            meds.push("<dd class='amr2-order-date amr2-header-format'><span>", amri18n.ORDER_DATE, "</span></dd>");
            meds.push("<dd class='amr2-order-date amr2-header-format'><span>", amri18n.ORDERING_PROVIDER, "</span></dd>")
            meds.push("<dd class='amr2-refills-container amr2-header-format'><span>&nbsp;</span></dd>");
            meds.push("</dl></div>");
            //Checks to see if the user selected a filter
            if (isFinite(groupNum)) {
                component.selectedGrouping = groupNum;
                //If groupNum = -1, then the user cleared the preferences, this will reload the component and sort the drugs alphabetically (called below)
                if (groupNum !== -1) {
                    grouperCriteria = component.getGrouperCriteria(groupNum).reverse();
                    component.setGrouperFilterCriteria(grouperCriteria);
                    recordData = component.sortByDropdownValue(recordData, grouperCriteria);
                    //Save the component preferences
                    MP_Core.AppUserPreferenceManager.SaveCompPreferences(componentId);
                }
            } else {
                for (var y = 0; y <= 10; y++) {
                    if (component.getGrouperLabel(y)) {
                        hasFilters = true;
                        break;
                    }
                }
                //The component has just loaded, check to see if any preferences are saved or not.
                if (!hasFilters || !component.getGrouperFilterLabel()) {

                    //No grouping has been selected, the drugs will be sorted alphabetically
                    if (recordData.ORDERS.length > 0) {
                        recordData.ORDERS.sort(component.sortByMedicationName());
                    }
                } else {
                    //A saved option is loaded and the drugs will be sorted according to the option
                    $("#filter-grouping-selected-label-" + component.getStyles().getId()).html(component.getGrouperFilterLabel());
                    var dummyCriteria = component.getGrouperFilterCriteria();
                    if (!dummyCriteria) {
                        dummyCriteria = component.getGrouperFilterEventSets();
                    }
                    recordData = component.sortByDropdownValue(recordData, dummyCriteria);
                }
            }
            meds.push("<div class='", MP_Util.GetContentClass(component, recordData.ORDERS.length), "'>");
            //used to make id unique
            var medIdFrag = medCompId + "_";
            var item = [];
            var medOrigDate = "";
            var lastDoseDate = "";
            var respProv = "";
            var compliance = "--";
            var code = {};
            var medName = "";
            var medNameHover = "";
            var dateTime = new Date();
            var compComment = "";
            var ordComment = "";
            var projectedStopDate = "";
            var allergyInfo = false;
            var orders = [];
            var orderStatus = "";
            var ordersMedInfo = "";
            var hxInd = 0;
            var ordId = 0;
            var priCriteriaCd = 0;
            var synonymId = 0;
            var projectedStopDateObj = null;
            var calculatedStopDate = "";
            var calculatedStopDateObj = null;
            var currentStopDate = "";
            var currentStopDateObj = null;
            var rowClass;
            var ordersLength = recordData.ORDERS.length;
            var qualifiedOrderCnt = 0;

            for (var x = 0; x < ordersLength; x++) {
                orders = recordData.ORDERS[x];
                orderStatus = MP_Util.GetValueFromArray(orders.CORE.STATUS_CD, codeArray);
                // don't show med student orders or orders without a show indicator
                if (orderStatus.meaning === "MEDSTUDENT" || orders.RECON_ACTION_DETAILS.SHOW_IND === 0) {
                    continue;
                }

                item = [];
                medOrigDate = "";
                lastDoseDate = "";
                respProv = "";
                compliance = "--";
                code = {};
                medName = component.getMedicationDisplayName(orders);
                medNameHover = component.getMedicationDisplayNameForHover(orders);
                dateTime = new Date();
                compComment = orders.DETAILS.COMPLIANCE_COMMENT || "--";

                // replace new lines with <br /> tag
                ordComment = orders.COMMENTS.ORDER_COMMENT.replace(/\n/g, "<br />");
                projectedStopDate = "";
                projectedStopDateObj = new Date();
                calculatedStopDate = "";
                calculatedStopDateObj = new Date();
                currentStopDate = "";
                currentStopDateObj = new Date();
                allergyInfo = (orders.ALLERGY.length) ? $.map(orders.ALLERGY, component.buildAllergyDisplay).join("") : false;

                if (orders.SCHEDULE.ORIG_ORDER_DT_TM !== "") {
                    dateTime.setISO8601(orders.SCHEDULE.ORIG_ORDER_DT_TM);
                    medOrigDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
                }

                if (orders.DETAILS.LAST_DOSE_DT_TM !== "") {
                    dateTime.setISO8601(orders.DETAILS.LAST_DOSE_DT_TM);
                    lastDoseDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                }

                if (orders.CORE.RESPONSIBLE_PROVIDER_ID > 0) {
                    var provider = MP_Util.GetValueFromArray(orders.CORE.RESPONSIBLE_PROVIDER_ID, personnelArray);
                    respProv = provider.fullName;
                }

                if (orders.DETAILS.COMPLIANCE_STATUS_CD > 0) {
                    code = MP_Util.GetValueFromArray(orders.DETAILS.COMPLIANCE_STATUS_CD, codeArray);
                    // display compliance
                    compliance = code.display;
                    // if not taking as prescribed, display compliance in bold
                    if (code.meaning !== "TAKINGASRX") {
                        compliance = "<b>" + compliance + "</b>";
                    }
                }

                // get current stop date/time
                if (orders.SCHEDULE.PROJECTED_STOP_DT_TM !== "") {
                    projectedStopDateObj.setISO8601(orders.SCHEDULE.PROJECTED_STOP_DT_TM);
                    projectedStopDate = df.format(projectedStopDateObj, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
                    currentStopDateObj = projectedStopDateObj;
                    currentStopDate = projectedStopDate;
                } else if (orders.SCHEDULE.CALCULATED_STOP_DT_TM !== "") {
                    calculatedStopDateObj.setISO8601(orders.SCHEDULE.CALCULATED_STOP_DT_TM);
                    calculatedStopDate = df.format(calculatedStopDateObj, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
                    currentStopDateObj = calculatedStopDateObj;
                    currentStopDate = calculatedStopDate;
                }

                ordersMedInfo = orders.MEDICATION_INFORMATION;
                hxInd = ordersMedInfo.ORIGINALLY_ORDERED_AS_TYPE.DOCUMENTED_IND;
                ordId = orders.CORE.ORDER_ID;
                priCriteriaCd = ordersMedInfo.PRIMARY_CRITERIA_CD;
                synonymId = ordersMedInfo.SYNONYM_ID;

                if (hxInd === 1) {
                    imgType = "hx.gif";
                    imgClass = "amr2-hx";
                } else {//Prescribed
                    imgType = "rx.gif";
                    imgClass = "amr2-rx";
                }

                var dur = ordersMedInfo.DURATION;
                var durUC = ordersMedInfo.DURATION_UNIT_CD;
                var dispDur = ordersMedInfo.DISP_DURATION;
                var dispDurUC = ordersMedInfo.DISP_DURATION_UNIT_CD;
                var dispQty = ordersMedInfo.DISPENSE_QTY;
                var dispQtyUnit = ordersMedInfo.DISPENSE_QTY_UNIT;
                var dispQtyUC = ordersMedInfo.DISPENSE_QTY_UNIT_CD;
                var numRfl = ordersMedInfo.NBR_REFILLS;
                var catCode = ordersMedInfo.CATALOG_CD;
                var freqMultiplier = parseFloat(orders.SCHEDULE.FREQUENCY_MULTIPLIER);

                if (bMedMod) {
                    component.medModObj.medModCompId = medCompId;
                    component.medModObj.medModIdFrag = medIdFrag;

                    if (catCode) {
                        catCodeList += catCode + ":";
                    }

                    if (dispQty) {
                        var formatArr = component.formatDispenseQuantity(dispQty);
                        dispQty = formatArr[0] || 0;
                    }

                    if (numRfl) {
                        numRfl =  parseInt(numRfl, 10) || 0;
                    } else if (imgClass === "amr2-rx") {
                        numRfl = 0;
                    }

                    component.setOrigOrder(ipath + "/images/" + imgType, imgClass, medName, ordersMedInfo, orders);
                }//end bmedmod

                //Determine state of Info Button
                if (component.hasInfoButton() && component.isInfoButtonEnabled()) {
                    if (!component.compMenuReference["compMenuInfoButton" + componentId].isSelected()) {
                        component.compMenuReference["compMenuInfoButton" + componentId].setIsSelected(true);
                    }
                    infoClass = "amr2-info-icon";
                } else {
                    infoClass = "amr2-info-icon hidden";
                }

                if (rowCnt % 2) {
                    item.push("<div class='amr2-info-icon-div even'><span data-patId='", criterion.person_id, "' data-encId='", criterion.encntr_id, "' data-synonymId='", synonymId, "' data-priCriteriaCd='", priCriteriaCd, "' class='", infoClass, " info-icon", componentId, "even'>&nbsp;</span>");
                } else {
                    item.push("<div class='amr2-info-icon-div odd'><span data-patId='", criterion.person_id, "' data-encId='", criterion.encntr_id, "' data-synonymId='", synonymId, "' data-priCriteriaCd='", priCriteriaCd, "' class='", infoClass, " info-icon",  componentId, "odd'>&nbsp;</span>");
                }

                item.push("<h3 class='info-hd'><span>", medName, "</span></h3>");

                rowClass = rowCnt % 2 ?  "even" : "odd";

                item.push("<div><dl class='amr2-info ", rowClass,"' id='amr2Info", medIdFrag, ordId, "'>");

                // duplicate status icon
                item.push("<dd class='amr2-status-icon'>");
                if (orders.NOTIFICATION.DUPLICATE_IND) {
                    item.push("<img src='", ipath, "/images/duplicate_16.png' alt='' />");
                }
                item.push("</dd>");

                // allergy status icon
                item.push("<dd class='amr2-status-icon'>");
                if (orders.NOTIFICATION.ALLERGY_IND) {
                    item.push("<img src='", ipath, "/images/allergy_16.png' alt='' />");
                }
                item.push("</dd>");

                item.push("<dd class='amr2-rx-col'><span class='amr2-rx-hx'><img src='", ipath, "/images/", imgType, "' alt='' class='", imgClass, "' /></span></dd>");
                item.push("<dd class='amr2-med-col'><span class='amr2-name' data-order-id='" + ordId + "'>", medName, "</span>");
                item.push("<span class='amr2-sig detail-line'>", component.getDoseRouteInfo(orders, !bMedMod), "</span>");
                // order comment indicator
                if (ordComment) {
                    item.push("<img src='", ipath, "/images/comment_16.png", "' alt='' />");
                }
                item.push("</dd>");
                item.push("<dd class='amr2-compliance'><span>", compliance, "</span></dd>");

                item.push("<dd class='amr2-order-date'><span>", medOrigDate, "</span></dd>");
                item.push("<dd class='amr2-ordering-physician'><span>", respProv || "--", "</span></dd>");

                // is an acute med with duration specified
                var daysRemaining = -1;

                // acute med -> duration specified or refill indicator is not true
                if (dur > " " || orders.NOTIFICATION.REFILL_IND == -1) {
                    if (dur > " ") {
                        var durationUnit = MP_Util.GetValueFromArray(durUC, codeArray);
                        // set the original order date
                        dateTime.setISO8601(orders.SCHEDULE.ORIG_ORDER_DT_TM);
                        var daysPassed = Math.round((currentDate - dateTime) / (1000 * 60 * 60 * 24));
                        daysRemaining = parseFloat(dur) - daysPassed;
                    } else {
                        // calculate days remaining from projected stop date
                        daysRemaining = Math.round((currentStopDateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                    }

                    if (daysRemaining > -1) {
                        item.push("<dd class='amr2-refills-container amr2-refill-days-remaining'><span>" + daysRemaining + " " + amri18n.DAYS_REMAINING + "</span></dd>");
                    } else {
                        // show 0 days remaning for overdue acute medications
                        item.push("<dd class='amr2-refills-container'><span>0 " + amri18n.DAYS_REMAINING + "</span></dd>");
                    }
                } else {
                    // maintenance medications
                    // valid stop date, dispense quantity and refill details
                    if (currentStopDate && orders.NOTIFICATION.REFILL_IND > 0 && parseFloat(dispQty) > 0 && freqMultiplier > 0) {
                        var stopTimeRemaining = currentStopDateObj.getTime() - currentDate.getTime();
                        // refill is overdue
                        if (stopTimeRemaining < 0) {
                            item.push("<dd class='amr2-refills-container'><span>", amri18n.REFILLS_OVERDUE, "</span></dd>");
                        } else {
                            daysRemaining = orders.NOTIFICATION.DAYS_REMAINING;
                            var refillDays = parseFloat(dispQty) / freqMultiplier;

                            // calculate refills with volume dose units if applicable
                            if (orders.MEDICATION_INFORMATION.INGREDIENTS.length === 1) {
                                var volumeDose = orders.MEDICATION_INFORMATION.INGREDIENTS[0].DOSE.VOLUME;
                                var volumeDoseUnitCD = orders.MEDICATION_INFORMATION.INGREDIENTS[0].DOSE.VOLUME_UNIT_CD;
                                // if volume dose unit and dispense quantity unit are present -> recalculate days total
                                if (dispQtyUC === volumeDoseUnitCD) {
                                    refillDays = refillDays / volumeDose;
                                }
                            }
                            var refillsTotal = Math.round(365 / refillDays);
                            //calculate refills remaining based on days remaining and refill days. If calculation is zero, set to minimum of 1
                            var refillsRemaining = Math.ceil(daysRemaining / refillDays);
                            item.push("<dd class='amr2-refills-bar'>" + component.buildRefillBar(daysRemaining, refillsRemaining, refillsTotal) + "</dd>");
                        }
                    } else {
                        item.push("<dd class='amr2-refills-container'><span> -- </span></dd>");
                    }
                }
                item.push("</dl>");
                // hover
                item.push("<h4 class='det-hd'><span>", amri18n.MED_DETAIL, "</span></h4>");
                item.push("<div class='hvr'><dl class='amr2-det'>");
                if (medNameHover) {
                    item.push("<dt><span>", amri18n.HOME_MEDICATION, ":</span></dt><dd class='amr2-det-name'><span>", medNameHover, "</span></dd>");
                }
                if (orders.DISPLAYS.CLINICAL_DISPLAY_LINE) {
                    item.push("<dt><span>", amri18n.ORDER_DETAILS, ":</span></dt><dd class='amr2-det-dt'><span>", orders.DISPLAYS.CLINICAL_DISPLAY_LINE, "</span></dd>");
                }
                if (ordComment) {
                    item.push("<dt><span>", amri18n.ORDER_COMMENT, ":</span></dt><dd class='amr2-det-dt'><span>", ordComment, "</span></dd>");
                }
                if (medOrigDate) {
                    item.push("<dt><span>", amri18n.ORDER_DATE, ":</span></dt><dd class='amr2-det-dt'><span>", medOrigDate, "</span></dd>");
                }
                if (respProv) {
                    item.push("<dt><span>", amri18n.ORDERING_PROVIDER, ":</span></dt><dd class='amr2-det-dt'><span>", respProv, "</span></dd>");
                }

                var homeMedType = component.getHomeMedicationType(orders);
                if (homeMedType) {
                    item.push("<dt><span>", amri18n.TYPE, ":</span></dt><dd class='amr2-det-dt'><span>", homeMedType, "</span></dd>");
                }
                if (compliance && compliance !== "--") {
                    item.push("<dt><span>", amri18n.COMPLIANCE, ":</span></dt><dd class='amr2-det-dt'><span>", compliance, "</span></dd>");
                }
                if (compComment && compComment !== "--") {
                    item.push("<dt><span>", amri18n.COMPLIANCE_COMMENT, ":</span></dt><dd class='amr2-det-dt'><span>", compComment, "</span></dd>");
                }
                if (allergyInfo) {
                    item.push("<dt><span>" + amri18n.ALLERGY_INTERACTION + ":</span></dt><dd class='amr2-det-dt'><span>", allergyInfo, "</span></dd>");
                }
                if (projectedStopDate) {
                    item.push("<dt><span>", amri18n.PROJECTED_STOP, ":</span></dt><dd class='amr2-det-dt'><span>", projectedStopDate, "</span></dd>");
                }
                item.push("</dl></div>");

                item.push("<div class='amr2-order-detail-editor hidden' id='amr2DetailEdit", medIdFrag, ordId, "'>");
                item.push("</div>");

                 item.push("</div></div>");
                meds = meds.concat(item);
                medCnt++;
                rowCnt++;
            }
            // add order proposals
            var proposal, proposalId;
            for (var proposalIndex = 0, proposalLength = recordData.ORDER_PROPOSALS.length; proposalIndex < proposalLength; proposalIndex++) {

                proposal = recordData.ORDER_PROPOSALS[proposalIndex];

                medName = component.getMedicationDisplayName(proposal);
                medNameHover = component.getMedicationDisplayNameForHover(proposal);
                ordComment = proposal.COMMENTS.ORDER_COMMENT;
                respProv = proposal.CORE.RESPONSIBLE_PROVIDER_ID ? (MP_Util.GetValueFromArray(proposal.CORE.RESPONSIBLE_PROVIDER_ID, personnelArray)).fullName : 0;
                proposalId = proposal.CORE.ORDER_PROPOSAL_ID;
                item = [];

                rowClass = rowCnt % 2 ?  "even" : "odd";
                item.push("<div><dl class='amr2-info ", rowClass,"' id='amr2Info", medIdFrag, proposalId, "'>");

                // duplicate status icon
                item.push("<dd class='amr2-status-icon'></dd>");

                // allergy status icon
                item.push("<dd class='amr2-status-icon'></dd>");

                item.push("<dd class='amr2-rx-col'><span class='amr2-rx-hx'><img src='", ipath, "/images/3865_16.gif' alt='' class='amr2-px' /></span></dd>");
                item.push("<dd class='amr2-med-col'><span class='amr2-name'>", medName, "</span>");
                item.push("<span class='amr2-sig detail-line'>", component.getDoseRouteInfo(proposal, true), "</span>");
                // order comment indicator
                if (ordComment) {
                    item.push("<img src='", ipath, "/images/comment_16.png", "' alt='' />");
                }
                item.push("</dd>");
                item.push("<dd class='amr2-compliance'></dd>");
                item.push("<dd class='amr2-refills-container'></dd>");
                item.push("</dl>");

                // hover
                item.push("<h4 class='det-hd'><span>", amri18n.MED_DETAIL, "</span></h4>");
                item.push("<div class='hvr'><dl class='amr2-det'>");
                if (medNameHover) {
                    item.push("<dt><span>", amri18n.HOME_MEDICATION, ":</span></dt><dd class='amr2-det-name'><span>", medNameHover, "</span></dd>");
                }
                if (proposal.DISPLAYS.CLINICAL_DISPLAY_LINE) {
                    item.push("<dt><span>", amri18n.ORDER_DETAILS, ":</span></dt><dd class='amr2-det-dt'><span>", proposal.DISPLAYS.CLINICAL_DISPLAY_LINE, "</span></dd>");
                }
                if (ordComment) {
                    item.push("<dt><span>", amri18n.ORDER_COMMENT, ":</span></dt><dd class='amr2-det-dt'><span>", ordComment, "</span></dd>");
                }
                if (respProv) {
                    item.push("<dt><span>", amri18n.ORDERING_PROVIDER, ":</span></dt><dd class='amr2-det-dt'><span>", respProv, "</span></dd>");
                }
                item.push("<dt><span>", amri18n.TYPE, ":</span></dt><dd class='amr2-det-dt'><span>", amri18n.PROPOSAL, "</span></dd>");
                item.push("</dl></div>"); // end hover

                // close row
                item.push("</div>");

                meds = meds.concat(item);
                medCnt++;
                rowCnt++;
            }

            component.medModObj.catCodeList = catCodeList;
            meds.push("</div>");
        }
        else {
            displayActionsInd = false;
            if (recordData.COMPLIANCE.NO_KNOWN_HOME_MEDS_IND === 0) {
                meds.push("<span class='res-none'>", amri18n.NO_RESULTS_FOUND, "</span>");
            }
        }

        // clear out the footer
        if (_g("amr2Ftr" + medCompId)) {
            Util.de(_g("amr2Ftr" + medCompId));
        }

        // Allowing modify action and displaying actions
        if (bMedMod && displayActionsInd) {
            var secCont = component.getSectionContentNode();
            var medModFt = Util.cep("div", {
                className : "amr2-content-ft",
                id : "amr2Ftr" + medCompId
            });
            var medModFtArr = [];
            medModFtArr.push("<div class='med-rnw-row' id='medRnwRow", medCompId, "'>");
            // Discontinue / Complete
            medModFtArr.push("<button class='amr2-rnw-btn' id='medCnclBtn", medCompId, "' disabled='true'><img id='medCnclImg", medCompId, "' src='", ipath, "/images/cancel_disabled.gif' alt='' /> ", amri18n.MED_DC_COMPLETE, "</button>");
            // modify
            medModFtArr.push("<button class='amr2-rnw-btn' id='medModifyBtn", medCompId, "' disabled='true'><img id='medModifyImg", medCompId, "'  src='", ipath, "/images/modify_disabled.gif' alt='' /> ", amri18n.MED_MODIFY, "</button>");
             // renew
            medModFtArr.push("<button class='amr2-rnw-btn' id='medRenewBtn", medCompId, "' disabled='true'><img id='medRenewImg", medCompId, "'  src='", ipath, "/images/renew_disabled.gif' alt='' /> ", amri18n.MED_RENEW, "</button>");
            medModFtArr.push("</div>");

            // routing
            medModFtArr.push("<div class= 'amr2-sgn-row' id='medSgnRow", medCompId, "'> <span class='amr2-route'>", amri18n.DEF_ROUTE_LBL, ": <a id='routeLink", medCompId, "' class='amr2-route-link amr2-dthrd' >", amri18n.MED_NONE_SELECTED, "</a></span>");
            medModFtArr.push("<button class='amr2-rnw-btn amr2-sgn-btn' id='medSgnBtn", medCompId, "' disabled='true'> ", amri18n.MED_SIGN, " </button></div>");

            medModFt.innerHTML = medModFtArr.join("");
            Util.ia(medModFt, secCont);
        }
        meds.push("</div></div>");

        // notifies whoever is listening that we have a new count
        var eventArg = {
            "count" : medCnt
        };
        CERN_EventListener.fireEvent(component, component, EventListener.EVENT_COUNT_UPDATE, eventArg);

        sHTML = meds.join("");
        countText = MP_Util.CreateTitleText(component, medCnt);
        MP_Util.Doc.FinalizeComponent(sHTML, component, countText);

        // Attach event on medications to display alternatives
        $(".amr2-name", $("#amr2Content" + medCompId)).on("click", function (e) {
            var containerElement = $(this);
            var curRow = containerElement.parent().parent();
            // order is in modify mode
            if (curRow.hasClass("amr2-modify")) {
               //stop event propagation from highlighting the row
                e.stopPropagation();
                var orderId = containerElement.attr("data-order-id");
                var orderObject = component.originalOrder[orderId];
                var synonymId = orderObject.synonymId;
                var currentData = {
                    "DISPLAY": orderObject.mnemonic,
                    "VALUE": synonymId
                };
                // product alternatives not defined -> retrieve products
                if (!orderObject.synonymSelection) {
                    var sendAr = [];
                    var cki = "^" + orderObject.synonymCKI + "^";
                    sendAr.push("^MINE^", cki);
                    var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
                    request.setProgramName("INN_PCO_GET_PRODUCT");
                    request.setParameters(sendAr);
                    request.setAsync(true);

                    MP_Core.XMLCCLRequestCallBack(null, request, function (reply) {
                        var synonymList = reply.getResponse().SYNONYM_LIST;
                        var selectList = [];

                        for (var sCntr = 0, sLen = synonymList.length; sCntr < sLen; sCntr++) {
                            selectList.push({
                                "DISPLAY": synonymList[sCntr].MNEMONIC,
                                "VALUE": synonymList[sCntr].SYNONYM_ID
                            });
                        }
                        orderObject.synonymSelection = component.getSelectListControl();
                        orderObject.synonymSelection.setContainerElement(containerElement);
                        orderObject.synonymSelection.setListData(selectList, currentData);
                        orderObject.synonymSelection.setCallBack(function (selectedData) {
                            var orderDetailContainer =  $("#amr2DetailEdit" + medCompId + "_" + orderId);

                            // only on a true synonym change
                            if (orderObject.synonymId != selectedData.VALUE) {
                                //clear out selected style
                                curRow.removeClass("amr2-med-selected");

                                // update the display and attribute with new synonym
                                $(containerElement).html(selectedData.DISPLAY);
                                orderObject.synonymId = selectedData.VALUE;
                                // remove the order modify object
                                component.removeModifyOrder(curRow.get(0));
                                //get the order sentences for synonym
                                var sendAr = [];
                                sendAr.push("^MINE^",criterion.encntr_id.toFixed(2),cki,orderObject.synonymId.toFixed(2), "^^",0,criterion.provider_id.toFixed(2),"^"+ipath+"^");
                                var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
                                request.setProgramName("ADVSR_MEDS_REC_GET_SYN_SNT");
                                request.setParameters(sendAr);
                                request.setAsync(true);
                                request.setRequiresRawData(true);

                                MP_Core.XMLCCLRequestCallBack(null, request, function (reply) {
                                    //Build the order sentence object
                                    var sentencesData = JSON.parse(reply.getResponse()).OSNTS;
                                    var sentencesContainer = $('<div class="amr2-ord-sent-container"></div>');
                                    var displayEmptyOrderDetailsEdit = (function(){
                                        var orderSentenceContainer =  $(".amr2-oe-sent-detail-container",sentencesContainer);
                                        var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
                                        request.setProgramName("ADVSR_MEDS_REC_COPY_ORD_DET");
                                        // Parameters: MINE, Original Order Id, Outpatient to Outpatient (3), Synonym Id, Allow optional details (1), Reset copied details (1)
                                        request.setParameters(["^MINE^",orderObject.ordId.toFixed(2),3,orderObject.synonymId.toFixed(2),1,1]);
                                        request.setAsync(true);
                                        request.setRequiresRawData(true);

                                        MP_Core.XMLCCLRequestCallBack(null, request, function (reply) {
                                            //Build the order synonym details object
                                            var synonymData = JSON.parse(reply.getResponse()).ORDER_DETAILS.SYN[0];
                                            if(synonymData){
                                                orderObject.order_sentence = new OrderSentence(synonymData.DETAILS, component.sentenceManager,orderSentenceContainer);
                                                orderObject.oeFormatId = synonymData.OE_FORMAT_ID
                                                orderObject.order_sentence.setAttribute("SYNONYM_ID", orderObject.synonymId);
                                                orderObject.order_sentence.setAttribute("OE_FORMAT_ID",orderObject.oeFormatId );
                                                orderSentenceElement = orderObject.order_sentence.getElement().get(0);
                                                orderSentenceContainer.empty().append(orderSentenceElement);
                                            }
                                        });
                                    });

                                    //hide the existing details
                                    $("span.amr2-sig.detail-line",curRow).hide();

                                    //reset sentence id information
                                    orderObject.sentenceId = 0;
                                    orderObject.actionSeq = 0;
                                    orderObject.oeFormatId = 0;

                                    //build the container
                                    sentencesContainer.html(window.render.amrOrderSentencesList(sentencesData));

                                    //assign on change event to update sentenceId and details editor
                                    $("select",sentencesContainer).change(function(e){
                                        var selectedOption = $(this);
                                        var orderSentenceContainer =  $(".amr2-oe-sent-detail-container",sentencesContainer);
                                        orderObject.sentenceId = parseFloat(selectedOption.val());
                                        orderObject.oeFormatId = parseFloat(selectedOption.attr("oe_format_id"));
                                        // clear out any existing order sentences
                                        if (orderObject.order_sentence) {
                                            delete orderObject.order_sentence;
                                        }

                                        if(orderObject.sentenceId > 0){
                                            // get sentence details
                                            var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
                                            request.setProgramName("INN_OM_GET_SENT_BY_ID");
                                            request.setParameters(["^MINE^","("+orderObject.sentenceId.toFixed(2)+")"]);
                                            request.setAsync(true);

                                            MP_Core.XMLCCLRequestCallBack(null, request, function (reply) {
                                                var currentSentence = reply.getResponse().SENTENCES[0];
                                                var sentenceDetails;
                                                var orderSentenceElement;
                                                //valid current sentence
                                                if(currentSentence){
                                                    sentenceDetails = currentSentence.DETAILS;
                                                    //Build Order Sentence Object
                                                    orderObject.order_sentence = new OrderSentence(sentenceDetails, component.sentenceManager,orderSentenceContainer);
                                                    orderObject.order_sentence.setAttribute("SYNONYM_ID", orderObject.synonymId);
                                                    orderObject.order_sentence.setAttribute("OE_FORMAT_ID", orderObject.oeFormatId);
                                                    orderSentenceElement = orderObject.order_sentence.getElement().get(0);
                                                    orderSentenceContainer.empty().append(orderSentenceElement);
                                                }
                                            });
                                        }
                                        // show empty order details edit
                                        else{
                                            displayEmptyOrderDetailsEdit();
                                        }
                                    });

                                    // Reset dose and volume order details on the new substitutable order
                                    orderDetailContainer.empty().append(sentencesContainer);
                                    orderDetailContainer.show();
                                    // No Order Sentences found -> show empty order details edit
                                    if(sentencesData.SNTS.length === 0){
                                        displayEmptyOrderDetailsEdit();
                                    }

                                    // indicate new order action to perform
                                    orderObject.PERFORM_ACTION = component.NEW_ORDER_ACTION;
                                });
                            }
                        });
                        orderObject.synonymSelection.renderSelectList();
                    });
                } else {
                    // synonym selection defined -> render the select list
                    orderObject.synonymSelection.renderSelectList();
                }
            }

        });
        // launch to Document Meds By Hx MOEWXml
        $("#medsHistory" + medCompId).on("click", function (event) {
            var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
            var m_hMOEW = PowerOrdersMPageUtils.CreateMOEW(criterion.person_id, criterion.encntr_id, 0, 4, 121);
            PowerOrdersMPageUtils.DisplayMOEW(m_hMOEW);
            PowerOrdersMPageUtils.DestroyMOEW(m_hMOEW);
            component.loadReconciliationStatus(function () {
                $(".amr2-status-container").replaceWith(window.render.amrReconciliationStatusBar(component.reconciliationStatus));
            });
        });

        // add reconcile button event handler
        var $componentHeader = $("#amr2" + medCompId + " h2.sec-hd");
        if ($componentHeader.find(".amr2-mrec").length > 0) {
            $componentHeader.find(".amr2-mrec").detach();
        }
        $componentHeader.append(reconciliationIndicatorHtml.join(""));

        $("#medReconBtn" + medCompId).on("click", function (event) {
            //if reconciliation has been initiated already -> return
            if ($(this).attr("reconciliation-initiated")) {
                return;
            }

            // set reconciliation to be initiated
            $(this).attr("reconciliation-initiated",true);
            var continueAr = [], doNotContinueAr = [], orders = recordData.ORDERS, ordersLength = orders.length, orderAction, reconciliationData = [], orderRecons = [];

            for (var orderIndex = 0; orderIndex < ordersLength; orderIndex++) {
                orderAction = orders[orderIndex].RECON_ACTION_DETAILS.LAST_ACTION_MEANING;
                if (orderAction === component.DISCONTINUE_ACTION || orderAction === component.COMPLETE_ACTION || orderAction === component.CANCEL_ACTION || orderAction === component.CANCEL_DC_ACTION) {
                    // ignore discontinued orders that don't need to be reconciled
                    // ignore meds that aren't perscriptions or documented
                    if (!orders[orderIndex].RECON_ACTION_DETAILS.RECON_NEEDED_IND || component.getHomeMedicationType(orders[orderIndex]) === "") {
                        continue;
                    }

                    doNotContinueAr.push(orders[orderIndex]);
                } else {
                    // ignore any meds that aren't shown (non documented or prescription)
                    if (!orders[orderIndex].RECON_ACTION_DETAILS.SHOW_IND) {
                        continue;
                    }
                    continueAr.push(orders[orderIndex]);
                }
            }



            // if everything has been reconciled, we don't need to re-reconcile any discontinued meds
            if (component.getReconNeeded() && doNotContinueAr.length > 0) {
                orderRecons.push(component.buildOrderReconciliation(doNotContinueAr, 2, "DISCONTINUE"));
            }
            if (continueAr.length > 0) {
                orderRecons.push(component.buildOrderReconciliation(continueAr, 1, "RECON_CONTINUE"));
            }

            // build the reconciliation data
            reconciliationData = []
            reconciliationData.push("{");
            reconciliationData.push("\"ord_recon_list\":");
            reconciliationData.push("{");
            reconciliationData.push("\"encntr_id\" : ", parseFloat(criterion.encntr_id).toFixed(2));
            reconciliationData.push(", \"performed_prsnl_id\" : ", parseFloat(criterion.provider_id).toFixed(2));
            reconciliationData.push(", \"ord_recons\" : [", orderRecons.join(","), "]");
            reconciliationData.push("}");
            reconciliationData.push("}");

            var request = new MP_Core.ScriptRequest(component, component.getComponentLoadTimerName());
            var sendAr = ["^MINE^", "^^", "^^", "^COMPLETE^"];
            request.setProgramName("ADVSR_MEDS_REC_ADD_ORD_RECON");
            request.setParameters(sendAr);
            request.setRequestBlobIn(reconciliationData.join(""));
            request.setAsync(true);

            MP_Core.XMLCCLRequestCallBack(null, request, function (reply) {
                $("#medReconBtn" + medCompId).val(amri18n.STATUS_RECONCILED);
                //disable reconciliation needed
                component.setReconNeeded(false);
                if ($(".amr2-mrec span").hasClass("amr2-unreconciled")) {
                    $(".amr2-mrec span").removeClass("amr2-unreconciled").addClass("amr2-reconciled");
                    $(".amr2-mrec span").html(amri18n.STATUS_RECONCILED);
                    // show the print icon
                    if (component.getPrintDisplayInd()) {
                        $("#print" + medCompId).show();
                    }
                }
                component.loadReconciliationStatus(function () {
                    $(".amr2-status-container").replaceWith(window.render.amrReconciliationStatusBar(component.reconciliationStatus));
                });
            });
        });

        if (this.getMedRec()) {
            // launch to discharge med rec window
            $("#medRecDischarge" + medCompId).on("click", function (e) {
                component.launchMedicationReconciliation(3, component.m_venueCode.discharge);
            });
        }

        if (this.getPrintDisplayInd()) {
            // Append print icon & event first time
            if ($("#print" + medCompId).length === 0) {
                // show print icon only if there is a valid list of orders or no know home medications compliance is documented
                if (recordData.ORDERS.length > 0) {
                    $("#amr2" + medCompId + " h2.sec-hd").find(".amr2-mrec").append("<img id='print" + medCompId + "' src='" + ipath + "/images/print_16.png' alt='' class='amr2-print' />");
                }

                $("#print" + medCompId).on("click", function (printEvent) {
                    var formatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                    var parsedCriterion = JSON.parse(m_criterionJSON);
                    var dob = (typeof criterion.getPatientInfo().getDOB == "function") ? new Date(criterion.getPatientInfo().getDOB()) : new Date(parsedCriterion.CRITERION.PERSON_INFO.DOB);
                    var patientName = (typeof criterion.getPatientInfo().getName == "function") ? criterion.getPatientInfo().getName() : (parsedCriterion.CRITERION.PERSON_INFO.PERSON_NAME);
                    var formattedDOB = formatter.format(dob, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
                    var demographicBanner = "<span class='amr2-print-name'>"+patientName+"</span>&nbsp;&nbsp;<span>"+amri18n.DOB_LABEL+": </span><span>"+formattedDOB+"</span>";
                    var containerData = {
                            "demobanner": demographicBanner,
                            "componentId": componentId
                        },
                        containerTemplate = window.render.amrPrintSetupContainer;
                    $(containerTemplate(containerData)).appendTo("body");
                    $(".amr2-print-preview-container").append("<img src='" + ipath + "/images/6439_24.gif' alt='' />");
                    $("#cancel" + medCompId).on("click", function (cancelEvent) {
                        $(".amr2-modal-container").detach();
                        $(".amr2-modal-shade").detach();
                        $(".amr2-preview-body .amr2-info").off("click");
                    });

                    // use orders service
                    var params = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0"];
                    var request = new MP_Core.ScriptRequest(component, "Print Medication Summary -- Ambulatory Meds Reconciliation o2");

                    request.setProgramName("mp_get_meds_rec");
                    request.setParameters(params);
                    request.setAsync(true);

                    MP_Core.XMLCCLRequestCallBack(null, request, function (reply) {

                        // check to make sure cancel button hasn't been selected
                        if ($(".amr2-modal-container").length < 1) {
                            return;
                        }
                        var template = window.render.amrPrintSetup, replyData = reply.getResponse();
                        $(".amr2-print-preview-container img").detach();
                        $(template(replyData)).appendTo(".amr2-print-preview-container");

                        if (replyData.STATUS_DATA.STATUS !== "S") {
                            $(".amr2-print-preview-container").text(amri18n.PRINT_LOAD_ERROR);
                        }

                        // remove isolation and isolation label
                        var $isolation = $(".amr2-modal-container #patient-banner dd.dmg-isolation");
                        $isolation.prev("dt").detach();
                        $isolation.detach();

                        $(".amr2-final-meds-list").hide();
                        $("#amr2-final-meds-list-select-" + componentId).on("click", function (selectEvent) {
                            // only take action if we're unselected
                            if (!$(this).hasClass("amr2-print-unselected")) {
                                return;
                            }

                            $(this).removeClass("amr2-print-unselected");
                            $("#amr2-simple-meds-list-select-" + componentId).addClass("amr2-print-unselected");

                            $(".amr2-final-meds-list").show();
                            $(".amr2-simple-meds-list").hide();
                        });

                        $("#amr2-simple-meds-list-select-" + componentId).on("click", function (selectEvent) {
                            // only take action if we're unselected
                            if (!$(this).hasClass("amr2-print-unselected")) {
                                return;
                            }

                            $(this).removeClass("amr2-print-unselected");
                            $("#amr2-final-meds-list-select-" + componentId).addClass("amr2-print-unselected");

                            $(".amr2-simple-meds-list").show();
                            $(".amr2-final-meds-list").hide();
                        });

                        $(".amr2-preview-body .amr2-info").on("click", function (orderRowEvent) {
                            var $self = $(this);
                            $self.toggleClass("amr2-dither");
                            // toggle checkbox if needed
                            if (orderRowEvent.target.nodeName !== "INPUT") {
                                var $checkbox = $self.find("input:checkbox");
                                $checkbox.prop("checked", !$checkbox.prop("checked"));
                            }
                            // keep the parent check box in sync with the group
                            var $orderGroup = $self.parent().children(),
                                orderGroupLength = $orderGroup.length,
                                ordersWithDitherCount = $orderGroup.filter(".amr2-dither").length,
                                $groupHeader = $(this).parent().prev(".amr2-group-heading");
                            if (ordersWithDitherCount === orderGroupLength) {
                                $self.parent().prev().prev().prop("checked", false);
                            } else if (ordersWithDitherCount === 0) {
                                $self.parent().prev().prev().prop("checked", true);
                            }

                            // keep the header in proper sync with the group
                            if (ordersWithDitherCount !== orderGroupLength) {
                                $groupHeader.removeClass("amr2-dither");
                            } else {
                                $groupHeader.addClass("amr2-dither");
                            }
                        });

                        $(".amr2-preview-body input.group").on("click", function (groupCheckboxEvent) {
                            var $dlContainer = $(this).next().next(".dl-container");
                            $dlContainer.find(".order").prop("checked", $(this).prop("checked"));
                            if ($(this).prop("checked")) {
                                $dlContainer.find("dl").removeClass("amr2-dither");
                                $(this).next(".amr2-group-heading").removeClass("amr2-dither");
                            } else {
                                $dlContainer.find("dl").addClass("amr2-dither");
                                $(this).next(".amr2-group-heading").addClass("amr2-dither");
                            }
                        });

                        $("#print-preview" + medCompId).on("click", function (previewEvent) {
                            $(".amr2-dither").hide();
                            $(".amr2-preview-body input").detach();
                            $("#create" + medCompId).on("click", function (createEvent) {
                                component.createDocument();
                                $(".amr2-print-preview-container").parent().detach();
                                $(".amr2-modal-shade").detach();
                            });

                            if (component.documentEventId === 0 || component.documentEventTitle === "") {
                                $(this).prop("value", amri18n.PRINT);
                            } else {
                                $(this).prop("value", amri18n.CREATE_PRINT);
                                $("#create" + medCompId).show();
                            }

                            $(this).on("click", function (printEvent) {
                                component.createDocument();
                                $(".amr2-nav-buttons").detach();
                                $(".amr2-modal-container input").detach();
                                var $container = $(".amr2-print-preview-container");
                                $container.find(".amr2-info").css("overflow", "hidden");
                                // remove modal styling
                                $container.css({
                                    "left": 0,
                                    "top": 0
                                });
                                // print
                                $container.width("7in").height("9in").jqprint();
                                $container.parent().detach();
                                $(".amr2-modal-shade").detach();
                            });
                            $(".amr2-preview-body .amr2-info").off("click");
                        });

                    });
                });
            }

            // hide the print icon if reconciliation is needed
            if (reconciliationNeeded) {
                $("#print" + medCompId).hide();
            } else {
                // show the print icon if reconciliation is completed
                $("#print" + medCompId).show();
            }
        }
    } catch (e) {
        MP_Util.LogError(e.message);
    }
};

/**
 * invoke the Orders API to open the Medications Reconciliation modal window and refresh the component when that action is complete
 * @param {number} compId - Component id for the home-medications-o2 component
 * @param {number} recMode 1 Admission, 2 Transfer, 3 Discharge Mode
 * @param {number} venueCode - the venue code
 * @returns {undefined} undefined
 */
AmbMedsRecComponent2.prototype.launchMedicationReconciliation = function(recMode, venueCode) {
    var component = this;
    var criterion = component.getCriterion();
    var medsRecObject = {};
    try {
        MP_Util.LogDiscernInfo(this, "ORDERS", "ambmedsrec-o2.js", "launchMedicationReconciliation");
        medsRecObject = window.external.DiscernObjectFactory("ORDERS");
        medsRecObject.PersonId = criterion.person_id;
        medsRecObject.EncntrId = criterion.encntr_id;
        medsRecObject.reconciliationMode = recMode;
        medsRecObject.defaultVenue = venueCode;
        medsRecObject.LaunchOrdersMode(2, 0, 0);
        component.retrieveComponentData();
    } catch (err) {
        MP_Util.LogJSError(err, null, "ambmedsrec-o2.js", "launchMedicationReconciliation");
        alert(i18n.innov.ambmedsrec_o2.ERROR_MEDS_REC);
    }
};

AmbMedsRecComponent2.prototype.createDocument = function (orders) {
    if (this.documentEventId === 0 || this.documentEventTitle === "") {
        return;
    }

    var input = [];
    $(".amr2-preview-body").children().not(":hidden").children().each(function (index, groupElement) {
        if ($(groupElement).find(".amr2-group-heading").hasClass("amr2-dither")) {
            return;
        }
        var orders = [];
        $(groupElement).find(".amr2-info").not(".amr2-dither").each(function (innerIndex, orderElement) {
            orders.push({
                name: $(orderElement).find(".clinical-name").text(),
                detail: $(orderElement).find(".amr2-print-detail-line").text()
            });
        });

        input.push({
            title: $(groupElement).find(".amr2-group-heading").text(),
            orders: orders
        });
    });

    var criterion = this.getCriterion(),
        request = new MP_Core.ScriptRequest(),
        clinicalNote = window.render.amrDocumentNote(input),
        parameters = [];

    parameters.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0");
    parameters.push(criterion.ppr_cd + ".0", this.documentEventId + ".0");
    parameters.push("^" + this.documentEventTitle + "^");

    request.setRequestBlobIn(clinicalNote);
    request.setProgramName("INN_ADVSR_AMR_ADD_DOC");
    request.setParameters(parameters);
    request.setAsync(true);

    MP_Core.XmlStandardRequest(null, request, function (reply) {
        // reply.getResponse()
    });
};

AmbMedsRecComponent2.prototype.buildReconciliationData =  function (MOEWXml, newOrders) {
    function getXMLNodeValue (xmlnode) {
        var value = "";
        if (xmlnode && xmlnode !== null && xmlnode.firstChild && xmlnode.firstChild !== null) {
            value = xmlnode.firstChild.nodeValue;
        }

        return value;
    }

    function sortIt (TheArr, us, u, vs, v, ws, w, xs, x, ys, y, zs, z) {
        // us-zs: 1=asc, -1=desc.  u-z: column-numbers.  See example
        var Sortsingle = function (a, b) {
            var swap = 0;
            if (isNaN(a - b)) {
                if ((isNaN(a)) && (isNaN(b))) {
                    swap = (b < a) - (a < b);
                } else {
                    swap = (isNaN(a) ? 1 : -1);
                }
            } else {
                swap = (a - b);
            }
            return swap * us;
        };

        var Sortmulti = function (a, b) {
            var swap = 0;
            if (isNaN(a[u] - b[u])) {
                if ((isNaN(a[u])) && (isNaN(b[u]))) {
                    swap = (b[u] < a[u]) - (a[u] < b[u]);
                } else {
                    swap = (isNaN(a[u]) ? 1 : -1);
                }
            } else {
                swap = (a[u] - b[u]);
            }
            if ((v === undefined) || (swap !== 0)) {
                return swap * us;
            } else {
                if (isNaN(a[v] - b[v])) {
                    if ((isNaN(a[v])) && (isNaN(b[v]))) {
                        swap = (b[v] < a[v]) - (a[v] < b[v]);
                    } else {
                        swap = (isNaN(a[v]) ? 1 : -1);
                    }
                } else {
                    swap = (a[v] - b[v]);
                }
                if ((w === undefined) || (swap !== 0)) {
                    return swap * vs;
                } else {
                    if (isNaN(a[w] - b[w])) {
                        if ((isNaN(a[w])) && (isNaN(b[w]))) {
                            swap = (b[w] < a[w]) - (a[w] < b[w]);
                        } else {
                            swap = (isNaN(a[w]) ? 1 : -1);
                        }
                    } else {
                        swap = (a[w] - b[w]);
                    }
                    if ((x === undefined) || (swap !== 0)) {
                        return swap * ws;
                    } else {
                        if (isNaN(a[x] - b[x])) {
                            if ((isNaN(a[x])) && (isNaN(b[x]))) {
                                swap = (b[x] < a[x]) - (a[x] < b[x]);
                            } else {
                                swap = (isNaN(a[x]) ? 1 : -1);
                            }
                        } else {
                            swap = (a[x] - b[x]);
                        }
                        if ((y === undefined) || (swap !== 0)) {
                            return swap * xs;
                        } else {
                            if (isNaN(a[y] - b[y])) {
                                if ((isNaN(a[y])) && (isNaN(b[y]))) {
                                    swap = (b[y] < a[y]) - (a[y] < b[y]);
                                } else {
                                    swap = (isNaN(a[y]) ? 1 : -1);
                                }
                            } else {
                                swap = (a[y] - b[y]);
                            }
                            if ((z === undefined) || (swap !== 0)) {
                                return swap * ys;
                            } else {
                                if (isNaN(a[z] - b[z])) {
                                    if ((isNaN(a[z])) && (isNaN(b[z]))) {
                                        swap = (b[z] < a[z]) - (a[z] < b[z]);
                                    } else {
                                        swap = (isNaN(a[z]) ? 1 : -1);
                                    }
                                } else {
                                    swap = (a[z] - b[z]);
                                }
                                return swap * zs;
                            }
                        }
                    }
                }
            }
        };

        if (u === undefined) {
            TheArr.sort(Sortsingle);
        } else { // if this is a simple array, not multi-dimensional, ie, sortIt(TheArr,1): ascending.
            TheArr.sort(Sortmulti);
        }
        return TheArr;
    }

    function buildReconDetailJSON (reconObj) {
       return ['{',
            '"order_id": '+parseFloat(reconObj.order_id).toFixed(2),
            ',"clinical_display_line": "'+reconObj.clinical_display_line.replace(/"/g, '\"')+'"',
            ',"simplified_display_line": "'+reconObj.simplified_display_line.replace(/"/g, '\"')+'"',
            ',"continue_order_ind": '+parseInt(reconObj.continue_order_ind, 10),
            ',"recon_order_action_mean": "'+reconObj.recon_order_action_mean+'"',
            ',"order_mnemonic": "'+reconObj.order_mnemonic.replace(/"/g, '\"')+'"',
        '}'].join("");
    }

    try {
        var ordersEntityList = {
                "ord_cnt": 0,
                "ords": []
            },
            curactionseq,
            curorder,
            curorderable,
            curorderid,
            curorderrecontypeflag,
            curordercdisp,
            curordersdisp,
            curorderactionmean,
            curordermnemomic,
            curordersentid,
            curordersynid,
            curRecon,
            curorderproviderid,
            xmlObj,
            xmlorders,
            criterion = this.getCriterion(),
            personnelInfo = criterion.getPersonnelInfo(),
            personnelId =  criterion.provider_id,
            orderReconciliations = [],
            reconciliationData = [];

        // Valid MOEW xml string
        if (MOEWXml > " ") {
            xmlObj = $.parseXML(MOEWXml);
            xmlorders = xmlObj.getElementsByTagName("Orders")[0].getElementsByTagName("Order");
            ordersEntityList.ord_cnt = xmlorders.length;
            for (var xmlIndex = 0; xmlIndex < xmlorders.length; xmlIndex++) {
                curorder = xmlorders[xmlIndex];
                curorderid = getXMLNodeValue(curorder.getElementsByTagName("OrderId")[0]);
                curordercdisp = getXMLNodeValue(curorder.getElementsByTagName("ClinDisplayLine")[0]);
                curordersdisp = getXMLNodeValue(curorder.getElementsByTagName("SimpleDisplayLine")[0]);
                curordermnemomic = getXMLNodeValue(curorder.getElementsByTagName("OrderedAsMnemonic")[0]);
                curordersentid = getXMLNodeValue(curorder.getElementsByTagName("OrderSentenceId")[0]);
                curordersynid = getXMLNodeValue(curorder.getElementsByTagName("SynonymId")[0]);
                curactionseq = getXMLNodeValue(curorder.getElementsByTagName("LastActionSeq")[0]);
                curactionseq = (curactionseq > "") ? curactionseq : "0";
                curactionseq = parseInt(curactionseq, 10);
                curorderproviderid = getXMLNodeValue(curorder.getElementsByTagName("ProviderId")[0]);

                // update ordering personnel id if ordered as different personnel
                if (parseFloat(curorderproviderid) > 0 && parseFloat(personnelId) != parseFloat(curorderproviderid)) {
                    personnelId = curorderproviderid;
                }

                // Handle double-quotes
                curordercdisp = curordercdisp.split("\"").join("'");
                curordersdisp = curordersdisp.split("\"").join("'");
                curordermnemomic = curordermnemomic.split("\"").join("'");
                curordersynid = (curordersynid > "") ? curordersynid : "0";
                curordersentid = (curordersentid > "") ? curordersentid : "0";
                ordersEntityList.ords[xmlIndex] = {};
                ordersEntityList.ords[xmlIndex].order_id = curorderid;
                ordersEntityList.ords[xmlIndex].mnemonic = curordermnemomic;
                ordersEntityList.ords[xmlIndex].clin_disp = curordersdisp;
                ordersEntityList.ords[xmlIndex].simp_disp = curordersdisp;
                ordersEntityList.ords[xmlIndex].synonym_id = parseInt(curordersynid, 10);
                ordersEntityList.ords[xmlIndex].sentence_id = parseInt(curordersentid, 10);
                ordersEntityList.ords[xmlIndex].action_seq = curactionseq + 1;
                ordersEntityList.ords[xmlIndex].last_action_seq = curactionseq;
                ordersEntityList.ords[xmlIndex].reconciled_ind = 0;
            }

            //Sort By Synonym_id and order_sentence_id
            sortIt(ordersEntityList.ords, 1, "synonym_id", 1, "sentence_id");
            sortIt(newOrders, 1, "synonymId", 1, "sentenceId");

            for (var ordersIndex = 0; ordersIndex < newOrders.length; ordersIndex++) {
                for (var entityIndex = 0; entityIndex < ordersEntityList.ord_cnt; entityIndex++) {
                    curorderable = newOrders[ordersIndex];
                    curorder = ordersEntityList.ords[entityIndex];
                    // valid order which has not yet been reconciled and matches between both lists
                    if (curorder && curorder !== null && curorder.reconciled_ind === 0 &&
                        (curorder.synonym_id === curorderable.synonymId && curorder.sentenceId === curorderable.sentence_id)) {

                        // set the order as reconciled
                        curorder.reconciled_ind = 1;
                        curorderid = curorder.order_id;
                        curordercdisp = curorder.clin_disp;
                        curordersdisp = curorder.simp_disp;
                        curordermnemomic = curorder.mnemonic;
                        curordersentid = curorder.sentence_id;
                        curordersynid = curorder.synonym_id;
                        curactionseq = curorder.action_seq;

                        // Handle double-quotes
                        curordercdisp = curordercdisp.split("\"").join("'");
                        curordersdisp = curordersdisp.split("\"").join("'");
                        curordermnemomic = curordermnemomic.split("\"").join("'");

                        curorderactionmean = "CANCEL REORD";
                        // Discharge
                        curorderrecontypeflag = 3;

                        curRecon = [];
                        curRecon.push("{");
                        curRecon.push("\"recon_type_flag\" :", curorderrecontypeflag);
                        curRecon.push(", \"no_known_meds_ind\" :", 0);
                        // Always reconciled orders
                        curRecon.push(", \"to_action_seq\" :", curactionseq);
                        curRecon.push(", \"reltn_type_mean\" : ", curorderactionmean, "\"");
                        curRecon.push(", \"order_list\" : [");
                        // new order
                        curRecon.push(buildReconDetailJSON({
                            "order_id": curorderid,
                            "clinical_display_line": curordercdisp,
                            "simplified_display_line": curordersdisp,
                            "continue_order_ind": 1, // keep
                            "recon_order_action_mean": "ORDER",
                            "order_mnemonic": curordermnemomic
                        }));

                        curRecon.push(",");
                        // previous order
                        curRecon.push(buildReconDetailJSON({
                            "order_id": curorderable.ordId,
                            "clinical_display_line": curorderable.clinicalDisplayLine,
                            "simplified_display_line": curorderable.simplifiedDisplayLine,
                            "continue_order_ind": 3, // discontinue
                            "recon_order_action_mean": curorderactionmean,
                            "order_mnemonic": curorderable.mnemonic
                        }));

                        curRecon.push("]");
                        curRecon.push("}");
                        orderReconciliations[orderReconciliations.length] = curRecon.join("");
                        curorderable.order_success_ind = true;

                        entityIndex = ordersEntityList.ord_cnt;
                    } // end ordersEntity loop
                }
            }

            // Now Build Reconciliation object
            reconciliationData = [];
            reconciliationData.push("{");
            reconciliationData.push("\"ord_recon_list\":");
            reconciliationData.push("{");
            reconciliationData.push("\"encntr_id\" : ", parseFloat(criterion.encntr_id).toFixed(2));
            reconciliationData.push(", \"performed_prsnl_id\" : ", parseFloat(personnelId).toFixed(2));
            reconciliationData.push(", \"ord_recons\" : [", orderReconciliations.join(","), "]");
            reconciliationData.push("}");

            reconciliationData.push("}");
        }
        return reconciliationData.join("");
    } catch (e) {
        throw (e);
    }
};

AmbMedsRecComponent2.prototype.performReconciliation = function (reconciliationData) {
    try {
        var reconciliationNeeded = this.getReconNeeded();
        var sendAr = [];
        var component = this;
        var dischargeReconStatus = "COMPLETE";
        if (reconciliationNeeded) {
            dischargeReconStatus = "PARTIAL";
        }
        sendAr.push("^MINE^", "^^","^^","^" + dischargeReconStatus + "^");
        var request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());

        request.setProgramName("ADVSR_MEDS_REC_ADD_ORD_RECON");
        request.setParameters(sendAr);
        request.setRequestBlobIn(reconciliationData);
        request.setAsync(true);
        request.setRequiresRawData(true);

        MP_Core.XMLCCLRequestCallBack(null, request, function (reply) {
            //disable reconciliation needed if complete
            if(dischargeReconStatus === "COMPLETE"){
                component.setReconNeeded(false);
            }

            //refresh the component
            component.retrieveComponentData();
        });
    } catch (e) {
        throw (e);
    }
};

AmbMedsRecComponent2.prototype.anyOrdersToSign = function () {
    var ordersToSign = false;
    var ordersList = this.originalOrder;
    var component = this;
    $.each(ordersList, function (orderId, currentOrder) {
        switch (currentOrder.PERFORM_ACTION) {
            // any complete, discontinue, new order, modify or renew -> mark orders to sign to true
            case component.COMPLETE_ACTION:
            case component.DISCONTINUE_ACTION:
            case component.NEW_ORDER_ACTION:
            case component.MODIFY_ACTION:
            case component.RENEW_ACTION:
                ordersToSign = true;
                break;
        }
    });
    return(ordersToSign);
};

AmbMedsRecComponent2.prototype.signMedicationModifications = function (silentSignMOEW) {
    var amri18n = i18n.innov.ambmedsrec_o2;
    var ordersList = this.originalOrder;
    var modifiesWithMissingDetails = this.modifyManager.getOrdersWithMissingRequiredDetails();
    var missingOrderList = [];
    var medCompId = this.getComponentId();
    var currentOrder;
    var currentOrderId;
    var currentDisplayRow;
    var criterion = this.getCriterion();
    var dPersonId = parseFloat(criterion.person_id);
    var dEncounterId = parseFloat(criterion.encntr_id);
    var successInd;
    var failedOrders = "";
    var component = this;
    var MOEWXml = "";
    var reconciliationData;
    var newOrdersInd = false;

    //build order actions list for different types of actions
    var cancels = [];
    var completes = [];
    var newOrders = [];
    var modifies = [];
    var renewals = [];
    var originalOrder;

    MP_Util.LogDiscernInfo(this, "POWERORDERS", "ambmedsrec-o2.js", "signMedMods");

     // has modifies with missing details -> add to missing order list
    if (modifiesWithMissingDetails.length) {
        for (var index = 0, l =  modifiesWithMissingDetails.length; index < l; index++) {
            currentOrderId = modifiesWithMissingDetails[index].getAttribute("ORDER_ID");
            missingOrderList.push(ordersList[currentOrderId].mnemonic);
        }
    }


    // if any missing orders -> display the missing details message
    if(missingOrderList.length){
        alert(amri18n.MISSING_DETAILS + "\n\n" + missingOrderList.join("\n"));
        return;
    }


    $.each(ordersList, function (orderId, currentOrder) {
        var hxInd = currentOrder.hxInd;
        var newPrescriptionInd = currentOrder.makeNewPrescription;

        switch (currentOrder.PERFORM_ACTION) {
            case component.COMPLETE_ACTION:
                completes.push(currentOrder);
                break;
            case component.DISCONTINUE_ACTION:
                cancels.push(currentOrder);
                break;
            case component.NEW_ORDER_ACTION:
                newOrdersInd = true;
                // add new order action for new synonym
                newOrders.push(currentOrder);
                // discontinue current order
                cancels.push(currentOrder);
                break;
            case component.MODIFY_ACTION:
                modifies.push(currentOrder);

                // push the order into renewals list if
                // Not a home medication
                // Or is a home medication with a new prescription indicator
                if (!hxInd || (hxInd && newPrescriptionInd) ) {
                    renewals.push(currentOrder);
                }
                break;
            case component.RENEW_ACTION:
                renewals.push(currentOrder);
                break;
        }
    });
    // pre-process renewal details
     //renew orders
    for (var renewalsIndex = 0; renewalsIndex < renewals.length; renewalsIndex++) {
        currentOrder = renewals[renewalsIndex];
        currentOrderId = parseFloat(currentOrder.ordId);

        var numRfls;
        var dispQty;
        //possible future api use, for now set to 0
        var dur = 0.0;
        var durCd = 0.0;
        var dispDur = 0.0;
        var dispDurCd = 0.0;
        var meanId;
        var fieldVal;
        var fieldDispVal;
        var originalOrder = ordersList[currentOrderId];

        // set current display row to the parent of the order id row
        currentDisplayRow = $("#amr2Info" + medCompId + "_" + currentOrderId).parent();

        // Get refill information
        var rflSpan = $("span.amr2-rfl-rnw", currentDisplayRow).get(0);
        numRfls = (rflSpan) ? parseFloat(rflSpan.innerHTML) || 0.0 : 0.0;

        // Get dispense quantity information
        var dispQtySpan = $("span.amr2-dq-qty", currentDisplayRow).get(0);
        if (dispQtySpan) {
            var formatArr = component.formatDispenseQuantity(dispQtySpan.innerHTML);
            dispQty = parseFloat(formatArr[1]) ? parseFloat(formatArr[1]) : 0;
        } else {
            dispQty = 0.0;
        }

        // Get routing information
        var routeUidEl = $(".amr2-rt-uid", currentDisplayRow).get(0);
        if (routeUidEl) {
            var routeUid = routeUidEl.innerHTML;
            var catCd = routeUidEl.className.replace("amr2-rt-uid cat-", "");
            var routeInfo = this.searchRoutes(catCd, routeUid);
            if (routeInfo) {
                meanId = parseFloat(routeInfo[2]);
                fieldVal = parseFloat(routeInfo[1]);
                fieldDispVal = routeInfo[0];
            } else {
                meanId = 0.0;
                fieldVal = 0.0;
                fieldDispVal = 0;
            }
        }

        //Add renewal details to order
        currentOrder.renewalDetails = {};
        currentOrder.renewalDetails.DURATION = dur;
        currentOrder.renewalDetails.DURATION_CD = durCd;
        currentOrder.renewalDetails.DISPENSE_DURATION = dispDur;
        currentOrder.renewalDetails.DISPENSE_DURATION_CD = dispDurCd;
        currentOrder.renewalDetails.NBR_REFILL = numRfls;
        currentOrder.renewalDetails.DISPENSE_QTY = dispQty;
        currentOrder.renewalDetails.DISPENSE_QTY_CD = originalOrder.dispenseQuantityCode;
        currentOrder.renewalDetails.ROUTING_MEANING_ID = meanId;
        currentOrder.renewalDetails.ROUTING_FIELD_VALUE = fieldVal;
        currentOrder.renewalDetails.ROUTING_DISPLAY_VALUE = fieldDispVal;
    }

    //apply action on modified orders
    if (modifies.length > 0) {
         //Proceed with signing the new orderables
        this.modifyManager.modifyOrders({
            "person_id": parseFloat(criterion.person_id),
            "encntr_id": parseFloat(criterion.encntr_id)
        }, function () { // function (successIndicator, moewXML)
        });
    }

    var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
    var hMOEW = PowerOrdersMPageUtils.CreateMOEW(dPersonId, dEncounterId, 0, 2, 127);

    function evaluateOrderAction (successInd, currentOrder) {
        var orderId = parseFloat(currentOrder.ordId);
        // action failed -> add to failed orders list
        if (!successInd) {
            failedOrders += currentOrder.mnemonic + "\n";
        } else {
            // remove order from the master list
            delete ordersList[orderId];
        }
    }


    //apply actions on complete orders
    for (var completesIndex = 0; completesIndex < completes.length; completesIndex++) {
        currentOrder = completes[completesIndex];
        currentOrderId = parseFloat(currentOrder.ordId);
        successInd = PowerOrdersMPageUtils.InvokeCompleteAction(hMOEW, currentOrderId);
        evaluateOrderAction(currentOrder, successInd);
    }

    //apply actions on renew orders
    for (var renewalsIndex = 0; renewalsIndex < renewals.length; renewalsIndex++) {
        currentOrder = renewals[renewalsIndex];
        currentOrderId = parseFloat(currentOrder.ordId);

        var hxInd = currentOrder.hxInd;
        var newPrescriptionInd = currentOrder.makeNewPrescription;

        var availableActionsStr  = currentOrder.AVAIL_ACTION_BITMAP;
        // Renewal or Renewal Rx action available
        if(availableActionsStr & 2048 || availableActionsStr & 33554432){
            // set current display row to the parent of the order id row
            currentDisplayRow = $("#amr2Info" + medCompId + "_" + currentOrderId).parent()

            // invoke renewal if valid number of refills
            originalOrder = ordersList[currentOrderId];

            successInd = PowerOrdersMPageUtils.InvokeRenewActionWithRouting(hMOEW
                                , currentOrderId
                                , currentOrder.renewalDetails.DURATION
                                , currentOrder.renewalDetails.DURATION_CD
                                , currentOrder.renewalDetails.DISPENSE_DURATION
                                , currentOrder.renewalDetails.DISPENSE_DURATION_CD
                                , currentOrder.renewalDetails.NBR_REFILL
                                , currentOrder.renewalDetails.DISPENSE_QTY
                                , currentOrder.renewalDetails.DISPENSE_QTY_CD
                                , currentOrder.renewalDetails.ROUTING_MEANING_ID
                                , currentOrder.renewalDetails.ROUTING_FIELD_VALUE
                                , currentOrder.renewalDetails.ROUTING_DISPLAY_VALUE);
            if (!successInd) {
                failedOrders += currentOrder.mnemonic + "\n";
            }
            // succesful renew
            else{
                // created new prescription -> discontinue original home medications
                if(hxInd && newPrescriptionInd){
                    cancels.push(currentOrder);
                }
            }
        }
    }

    //apply actions on  cancel orders -> pushed through the powerorders API only if there are no new orders
    if (cancels.length > 0 && !newOrdersInd) {
        var dCancelDCReason = 0.0;
        //default
        var date = new Date();
        //make sure leading zero is present
        var twoDigit = function (num) {
            num = (String(num).length < 2) ? String("0" + num) : String(num);
            return num;
        };
        //YYYYMMDDhhmmsscc -- cc is dropped but needed for format for API
        var cancelDate = "" + date.getFullYear() + twoDigit((date.getMonth() + 1)) + twoDigit(date.getDate()) + twoDigit(date.getHours()) + twoDigit(date.getMinutes()) + twoDigit(date.getSeconds()) + "99";

        for (var cancelsIndex = 0; cancelsIndex < cancels.length; cancelsIndex++) {
            currentOrder = cancels[cancelsIndex];
            currentOrderId = parseFloat(currentOrder.ordId);
            //add date time and reason
            successInd = PowerOrdersMPageUtils.InvokeCancelDCAction(hMOEW, currentOrderId, cancelDate, dCancelDCReason);
            evaluateOrderAction(currentOrder, successInd);
        }
    }

    //attempt to sign silently or display moew based on default routing
    var bSign;
    var showMOEW;

    if (failedOrders === "") {
        if (silentSignMOEW) {
            bSign = PowerOrdersMPageUtils.SignOrders(hMOEW);
        } else {
            //displays moew
            showMOEW = PowerOrdersMPageUtils.DisplayMOEW(hMOEW);
        }
    } else {
        if (renewals.length || completes.length || cancels.length) {
            failedOrders = amri18n.FAILED_ORDERS + ":\n\n" + failedOrders + "\n " + amri18n.CONTINUE_SIGN;
            if (confirm(failedOrders)) {
                //continue to sign
                if (silentSignMOEW) {
                    bSign = PowerOrdersMPageUtils.SignOrders(hMOEW);
                } else {
                    //displays moew
                    showMOEW = PowerOrdersMPageUtils.DisplayMOEW(hMOEW);
                }
            }
        } else {
            failedOrders = amri18n.FAILED_ORDERS + ":\n\n" + failedOrders + "\n " + amri18n.NO_VALID_ORDERS;
            alert(failedOrders);
        }
    }

    PowerOrdersMPageUtils.DestroyMOEW(hMOEW);

    // any new orders or cancels- > Perform new order actions
    if (newOrdersInd) {
        // Create any order sentences and sign them through MOEW
        this.sentenceManager.createOrderSentences(function (successInd) {
            component.assignNewOrderSentenceIds(successInd,newOrders,cancels);
        });
    } else {
        // refresh the component
        this.retrieveComponentData();
    }

    //any modified orders were present -> reset them
    if (modifies.length > 0) {
        component.modifyManager.reset();
    }
};

MP_Util.setObjectDefinitionMapping("AMB_HOME_MEDS", AmbMedsRecComponent2);
// -----------------------------------------------------------------------
// Eros Fratini - eros@recoding.it
// jqprint 0.3
//
// - 19/06/2009 - some new implementations, added Opera support
// - 11/05/2009 - first sketch
//
// Printing plug-in for jQuery, evolution of jPrintArea: http://plugins.jquery.com/project/jPrintArea
// requires jQuery 1.3.x
//
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
//------------------------------------------------------------------------
(function($) {
  var opt;

  $.fn.jqprint = function(options) {
    opt = $.extend({}, $.fn.jqprint.defaults, options);

    var $element = (this instanceof jQuery) ? this : $(this);

    if (opt.operaSupport && $.browser.opera) {
      var tab = window.open("", "jqPrint-preview");
      tab.document.open();

      var doc = tab.document;
    } else {
      var $iframe = $("<iframe  />");

      if (!opt.debug) {
        $iframe.css({
          position: "absolute",
          width: "0px",
          height: "0px",
          left: "-600px",
          top: "-600px"
        });
      }

      $iframe.appendTo("body");
      var doc = $iframe[0].contentWindow.document;
    }

    if (opt.importCSS) {
      if ($("link[media=print]").length > 0) {
        $("link[media=print]").each(function() {
          doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' media='print' />");
        });
      } else {
        $("link").each(function() {
          doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' />");
        });
      }
    }

    if (opt.printContainer) {
      doc.write($element.outer());
    } else {
      $element.each(function() {
        doc.write($(this).html());
      });
    }

    doc.close();

    (opt.operaSupport && $.browser.opera ? tab : $iframe[0].contentWindow).focus();
    setTimeout(function() {
      (opt.operaSupport && $.browser.opera ? tab : $iframe[0].contentWindow).print();
      if (tab) {
        tab.close();
      }
    }, 1000);
  }

  $.fn.jqprint.defaults = {
    debug: false,
    importCSS: true,
    printContainer: true,
    operaSupport: true
  };

  // Thanks to 9__, found at http://users.livejournal.com/9__/380664.html
  jQuery.fn.outer = function() {
    return $($('<div></div>').html(this.clone())).html();
  };
})(jQuery);

