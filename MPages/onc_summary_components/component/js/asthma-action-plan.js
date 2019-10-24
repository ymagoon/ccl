(function(){function aapActiveMedicationsSelector(it
/**/) {
var out='<div class="aap-multi-select" data-zone-attribute="'+(it.ZONE)+'" data-section-attribute="'+(it.SECTION)+'"><select multiple>';var arr1=it.ORDERS;if(arr1){var order,index=-1,l1=arr1.length-1;while(index<l1){order=arr1[index+=1];out+='<option value="'+(index)+'">'+(order.NAME)+' '+(order.SIMPLIFIED_DISPLAY_LINE)+'</option>';} } out+='</select></div>';return out;
}var itself=aapActiveMedicationsSelector, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['aapActiveMedicationsSelector']=itself;}}());(function(){function aapClinicalNote(it
/**/) {
var out=''; function aapPrintZoneBody(zone) { out+='<div>';if(zone.MEDS_REQUIRED){ for(var section in zone.SECTIONS) { out+='<div><span>'+(zone.SECTIONS[section].LABEL)+':</span></div><div>';var arr1=zone.SECTIONS[section].MEDICATIONS;if(arr1){var medication,i1=-1,l1=arr1.length-1;while(i1<l1){medication=arr1[i1+=1];if(medication.SELECTED_IND){out+='<div><div><span>'; out+=window.render.aapOrderDisplay(medication.ORDER_ID); out+='</span></div><div><span>'+(medication.COMMENTS);if(medication.SPACER_IND){out+=" ";out+=''+(i18n.innov.asthmaActionPlan.PRINT_SPACER);}out+='</span></div></div>';}} } out+='</div>'; } if(zone.SPECIAL_INSTRUCTIONS){out+='<br/><div><div><span>'+(i18n.innov.asthmaActionPlan.YELLOW_ZONE_INSTRUCTIONS_LABEL)+':</span></div><div><span>'+(zone.SPECIAL_INSTRUCTIONS)+'</span></div></div>';}if(zone.COMMENTS_IND && zone.COMMENTS && zone.COMMENTS.length > 0){out+='<br/><div><div><span>'+(i18n.innov.asthmaActionPlan.COMMENTS)+':</span></div><div><span>'+(zone.COMMENTS)+'</span></div></div>';}}else{out+='<span>'+(i18n.innov.asthmaActionPlan.NO_MEDS_REQUIRED)+'</span>';}out+='</div>'; } out+='<div><div>'; out+=window.render.aapActionPlanTitle(); out+='</div><div>'+(i18n.innov.asthmaActionPlan.DATE_LABEL)+': '; out+=window.render.aapPrintSettings("PLAN_DATE"); out+='</div><div><span>'+(i18n.innov.asthmaActionPlan.ACT_SCORE)+': </span>'+(it.GENERAL_INFORMATION.ASTHMA_CONTROL_TEST_SCORE)+'</div><div><span>'+(i18n.innov.asthmaActionPlan.PEAK_FLOW)+': </span>'+(it.GENERAL_INFORMATION.PERSONAL_BEST_PEAK_FLOW)+'</div>';if(it.GENERAL_INFORMATION.SEVERITY_LABEL){out+='<div><span>'+(it.GENERAL_INFORMATION.SEVERITY_LABEL)+': </span>';if(it.GENERAL_INFORMATION.ASTHMA_SEVERITY){out+=' '+(it.GENERAL_INFORMATION.ASTHMA_SEVERITY);}else{out+=' -- ';}out+='</div>';}out+='<div><span>'+(i18n.innov.asthmaActionPlan.ER_VISITS_LONG)+': </span>';if(it.GENERAL_INFORMATION.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION){out+=''+(it.GENERAL_INFORMATION.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION);}else{out+='--';}out+='</div><div><span>'+(i18n.innov.asthmaActionPlan.HOSPITALIZATIONS_LONG)+': </span>';if(it.GENERAL_INFORMATION.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT){out+=''+(it.GENERAL_INFORMATION.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT);}else{out+=' -- ';}out+='</div>';var arr2=it.GENERAL_INFORMATION.OTHER_CE;if(arr2){var event,i2=-1,l2=arr2.length-1;while(i2<l2){event=arr2[i2+=1];out+='<div>'+(event.DISPLAY)+'</div>';} } out+='<div>'+(i18n.innov.asthmaActionPlan.TRIGGERS)+':</div>';var arr3=it.GENERAL_INFORMATION.TRIGGERS;if(arr3){var trigger,i3=-1,l3=arr3.length-1;while(i3<l3){trigger=arr3[i3+=1];out+='<span>';if(trigger.MEANING.length > 0){if(trigger.MEANING === "TRIGGER_OTHER"){out+=''+(i18n.innov.asthmaActionPlan[trigger.MEANING]);if(trigger.COMMENTS){out+=': '+(trigger.COMMENTS);}}else{out+=window.render.aapTriggerLabels(trigger.MEANING);}}else{out+=''+(i18n.innov.asthmaActionPlan[trigger]);}out+='</span>';} } out+='</div><div><span>'+(i18n.innov.asthmaActionPlan.GREEN_ZONE)+'</span>'; aapPrintZoneBody(it.GREEN_ZONE); out+='</div><div><span>'+(i18n.innov.asthmaActionPlan.YELLOW_ZONE)+'</span>'; aapPrintZoneBody(it.YELLOW_ZONE); out+='</div><div><span>'+(i18n.innov.asthmaActionPlan.RED_ZONE)+'</span>'; aapPrintZoneBody(it.RED_ZONE); out+='</div>';return out;
}var itself=aapClinicalNote, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['aapClinicalNote']=itself;}}());(function(){function aapFooter(it
/**/) {
var out='<div class="aap-footer"><div class="aap-col-full"><span class="aap-label">'+(i18n.innov.asthmaActionPlan.FOOTER_INSTRUCTIONS)+':</span><br/><input type="text" class="aap-special-instructions" value="'+(it.INSTRUCTIONS)+'" /></div><div class="aap-col-full"><span class="aap-follow-up-label">'+(i18n.innov.asthmaActionPlan.FOLLOW_UP)+':</span><div class="aap-follow-in" data-follow-attribute="FOLLOW_IN_IND"><input type="radio" name="aap-follow-up-rb" ';if(it.FOLLOW_IN_IND){out+='checked';}out+=' /> '+(i18n.innov.asthmaActionPlan.FOLLOW_IN)+'<br/><select class="aap-follow-up" ';if(it.FOLLOW_IN_IND){out+='value="'+(it.FOLLOW_UP)+'"';}out+='>'; out+=window.render.aapBuildFollowInOptions(); out+='</select></div><div class="aap-follow-on" data-follow-attribute="FOLLOW_ON_IND"><input type="radio" name="aap-follow-up-rb" ';if(it.FOLLOW_ON_IND){out+='checked';}out+=' /> '+(i18n.innov.asthmaActionPlan.FOLLOW_ON)+'<br/><input type="text" class="aap-follow-up" id="aap-datepicker" placeholder="-- / -- / ----" ';if(it.FOLLOW_ON_IND){out+='value="'+(it.FOLLOW_UP)+'"';}out+=' /></div><div class="aap-follow-other" data-follow-attribute="FOLLOW_OTHER_IND"><input type="radio" name="aap-follow-up-rb" ';if(it.FOLLOW_OTHER_IND){out+='checked';}out+=' /> '+(i18n.innov.asthmaActionPlan.FOLLOW_OTHER)+'<br/><input type="text" class="aap-follow-up" ';if(it.FOLLOW_OTHER_IND){out+='value="'+(it.FOLLOW_UP)+'"';}out+=' placeholder="'+(i18n.innov.asthmaActionPlan.FOLLOW_UP_INSTRUCTIONS)+'" /></div></div><div class="aap-col-full"><input type="checkbox" class="aap-school-authorization" ';if(it.AUTHORIZATION_NEEDED){out+='checked';}out+='/> '+(i18n.innov.asthmaActionPlan.SCHOOL_AUTH)+'</div></div>';return out;
}var itself=aapFooter, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['aapFooter']=itself;}}());(function(){function aapGeneralInformation(it
/**/) {
var out='<div class="aap-powerform-links">'; out+=window.render.aapPowerformLinks(); out+='</div><div class="aap-zone-body"><div class="aap-col-full">';if(it.ASTHMA_TEST_REQUIRED || it.ASTHMA_CONTROL_TEST_SCORE){out+='<span class="aap-label">';if(it.ASTHMA_TEST_REQUIRED){out+='<span class="aap-required">* </span>';}out+=''+(it.ASTHMA_TEST_LABEL)+':<span class="aap-measurement">';if(it.ASTHMA_CONTROL_TEST_SCORE){out+=' '+(it.ASTHMA_CONTROL_TEST_SCORE);}else{out+=' -- ';}out+='</span></span>';}if(it.PEAK_FLOW_REQUIRED || it.PERSONAL_BEST_PEAK_FLOW){out+='<span class="aap-label">';if(it.PEAK_FLOW_REQUIRED){out+='<span class="aap-required">* </span>';}out+=''+(it.PEAK_FLOW_LABEL)+':<span class="aap-measurement">';if(it.PERSONAL_BEST_PEAK_FLOW){out+=' '+(it.PERSONAL_BEST_PEAK_FLOW);}else{out+=' -- ';}out+='</span></span>';}if(it.ED_VISITS_REQUIRED || it.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION){out+='<span class="aap-label">';if(it.ED_VISITS_REQUIRED){out+='<span class="aap-required">* </span>';}out+=''+(it.ED_VISITS_LABEL)+':<span class="aap-measurement">';if(it.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION){out+=' '+(it.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION);}else{out+=' -- ';}out+='</span></span>';}if(it.INP_STAY_REQUIRED || it.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT){out+='<span class="aap-label">';if(it.INP_STAY_REQUIRED){out+='<span class="aap-required">* </span>';}out+=''+(it.INP_STAY_LABEL)+':<span class="aap-measurement">';if(it.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT){out+=' '+(it.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT);}else{out+=' -- ';}out+='</span></span>';}out+='</div><div class="aap-col-full">';if(it.SEVERITY_LABEL.length > 0){out+='<span class="aap-label">'+(it.SEVERITY_LABEL)+':&nbsp;<span class="aap-measurement">';if(it.ASTHMA_SEVERITY){out+=''+(it.ASTHMA_SEVERITY);}else{out+='-- ';}out+='</span></span>';}if(it.ALLERGY_LABEL.length > 0){out+='<span class="aap-label">'+(it.ALLERGY_LABEL)+':';var arr1=it.ALLERGIES;if(arr1){var allergy,i1=-1,l1=arr1.length-1;while(i1<l1){allergy=arr1[i1+=1];out+=' <span class="aap-measurement aap-allergy">'+(allergy.DISPLAY)+'</span> ';} } out+='</span>';}if(it.OTHER_CE_LABEL.length > 0){out+='<span class="aap-label">'+(it.OTHER_CE_LABEL)+':&nbsp;<span class="aap-measurement">'+(it.OTHER_CE_VALUE)+'</span></span>';}if((it.INFANT_REQUIRED && it.INFANT_LABEL_DISPLAY_IND) || (it.INFANT_ASTHMA_EVENT && it.INFANT_LABEL_DISPLAY_IND)){out+='<span class="aap-label">';if(it.INFANT_REQUIRED){out+='<span class="aap-required">* </span>';}out+=''+(it.INFANT_LABEL)+':<span class="aap-measurement">';if(it.INFANT_ASTHMA_EVENT){out+=' '+(it.INFANT_ASTHMA_EVENT);}else{out+='-- ';}out+='</span></span>';}out+='</div><div class="aap-col-full"><span class="aap-label"><span class="aap-required">* </span>'+(i18n.innov.asthmaActionPlan.TRIGGERS)+':';var arr2=it.TRIGGERS;if(arr2){var trigger,i2=-1,l2=arr2.length-1;while(i2<l2){trigger=arr2[i2+=1];out+='<span class="aap-measurement aap-asthma-trigger">';if(trigger.MEANING.length > 0){if(trigger.MEANING === "TRIGGER_OTHER"){out+='&nbsp;'+(i18n.innov.asthmaActionPlan[trigger.MEANING]);if(trigger.COMMENTS){out+=': '+(trigger.COMMENTS);}}else{out+='&nbsp;';out+=window.render.aapTriggerLabels(trigger.MEANING);}}else{out+='&nbsp;'+(i18n.innov.asthmaActionPlan[trigger]);}out+='</span>';} } out+='</span></div></div>';return out;
}var itself=aapGeneralInformation, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['aapGeneralInformation']=itself;}}());(function(){function aapZoneCommentsBlock(it
/**/) {
var out='';if(it.COMMENTS_IND !== 0){out+='<div><div>'+(it.COMMENTS_LABEL)+':</div><input class="aap-zone-comments" type="text" value="';if(it.COMMENTS){out+=''+(it.COMMENTS);}else{out+=' ';}out+='" maxlength="256" /></div>';}return out;
}function aapZoneMedsBlock(it
/**/) {
var out='';if(it.zoneSection.MEDICATIONS){out+='<div class="aap-med-section" data-section-attribute="'+(it.sectionKey)+'">';var arr1=it.zoneSection.MEDICATIONS;if(arr1){var medication,i1=-1,l1=arr1.length-1;while(i1<l1){medication=arr1[i1+=1];out+='<span class="aap-medication" data-order-id="'+(medication.ORDER_ID)+'"><input class="aap-medication-selector" type="checkbox" ';if(medication.SELECTED_IND){out+='checked';}out+='/><span> '; out+=window.render.aapOrderDisplay(medication.ORDER_ID); out+='</span><div class="aap-required-freetext" style="display:';if(medication.SELECTED_IND){out+='block;';}else{out+='none;';}out+='"><span>*</span><input type="text" class="aap-dose-route" value="'+(medication.COMMENTS)+'" />';if(window.render.aapOrderSpacerDisplay(medication.ORDER_ID)){out+='<div><input type="checkbox" class="aap-spacer-administration" ';if(medication.SPACER_IND){out+='checked';}out+=' />'+(i18n.innov.asthmaActionPlan.SPACER)+'</div>';}out+='</div></span>';} } out+='</div>';}else{out+='<div class="aap-label">'+(i18n.innov.asthmaActionPlan.NO_MEDS)+'</div>';}out+='<span data-section-attribute="'+(it.sectionKey)+'"><a href="#" class="aap-add-medications">'+(i18n.innov.asthmaActionPlan.ADD_MEDICATIONS)+'</a></span><br/><br/>';return out;
}function aapZoneDescriptionBlock(it
/**/) {
var out='<div class="aap-content">'+(it.SYMPTOMS.LABEL)+'<ul>';var arr1=it.SYMPTOMS.LIST;if(arr1){var symptom,i1=-1,l1=arr1.length-1;while(i1<l1){symptom=arr1[i1+=1];out+='<li>'+(symptom.key)+'</li>';} } out+='</ul></div>';if(it.PEAK_FLOW_DISPLAY_IND){out+='<div class="aap-content"><span><span class="aap-measurement">'+(i18n.innov.asthmaActionPlan.PEAK_FLOW_COLUMN)+'</span> ('+(i18n.innov.asthmaActionPlan.OPTIONAL)+'): </span><span class="aap-measurement">'+(it.PEAK_FLOW_RANGE_DISPLAY)+'</span><br/><span class="aap-italics">'+(it.PEAK_FLOW_RANGE_LABEL)+'</span></div>';}return out;
}function aapClientInstructionsBlock(it
/**/) {
var out='';if(it.CLIENT_SPECIAL_INSTRUCTIONS.length > 0){out+='<div class="aap-client-instructions"><span>'+(it.CLIENT_SPECIAL_INSTRUCTIONS)+'</span></div>';}return out;
}function aapGreenZone(it
/**/) {
var out='<div class="aap-green-zone-header"><div class="aap-col-one-third"><span class="aap-content">'+(i18n.innov.asthmaActionPlan.GREEN_ZONE)+'</span></div><div class="aap-col-two-thirds"><span class="aap-content">'+(i18n.innov.asthmaActionPlan.GREEN_ZONE_SUBHEADING)+'</span></div></div><div class="aap-zone-body" data-zone-attribute="GREEN_ZONE"><div class="aap-col-one-third"><div class="aap-content">'+(it.SYMPTOMS.LABEL)+'<ul>';var arr1=it.SYMPTOMS.LIST;if(arr1){var symptom,i1=-1,l1=arr1.length-1;while(i1<l1){symptom=arr1[i1+=1];out+='<li>'+(symptom.key)+'</li>';} } out+='</ul></div>';if(it.PEAK_FLOW_DISPLAY_IND){out+='<div class="aap-content"><span><span class="aap-measurement">'+(i18n.innov.asthmaActionPlan.PEAK_FLOW_COLUMN)+'</span> ('+(i18n.innov.asthmaActionPlan.OPTIONAL)+'): </span><span class="aap-measurement">'+(it.PEAK_FLOW_RANGE_DISPLAY)+'</span><br/><span class="aap-italics">'+(it.PEAK_FLOW_RANGE_LABEL)+'</span></div>';}out+='</div><div class="aap-col-two-thirds"><div class="aap-medications-required">'+(i18n.innov.asthmaActionPlan.ARE_MEDS_REQUIRED)+'<span><input type="radio" name="aap-green-meds-required" ';if(it.MEDS_REQUIRED){out+='checked="true"';}out+=' /> '+(i18n.innov.asthmaActionPlan.YES)+'</span><span><input type="radio" name="aap-green-meds-required" ';if(!it.MEDS_REQUIRED){out+='checked="true"';}out+=' /> '+(i18n.innov.asthmaActionPlan.NO)+'</span></div><div class="aap-content"><div><span class="aap-required">* </span>'+(i18n.innov.asthmaActionPlan.GREEN_ZONE_DAILY_LABEL)+':';if({zoneSection: it.SECTIONS.DAILY, sectionKey: "DAILY"}.zoneSection.MEDICATIONS){out+='<div class="aap-med-section" data-section-attribute="'+({zoneSection: it.SECTIONS.DAILY, sectionKey: "DAILY"}.sectionKey)+'">';var arr2={zoneSection: it.SECTIONS.DAILY, sectionKey: "DAILY"}.zoneSection.MEDICATIONS;if(arr2){var medication,i2=-1,l2=arr2.length-1;while(i2<l2){medication=arr2[i2+=1];out+='<span class="aap-medication" data-order-id="'+(medication.ORDER_ID)+'"><input class="aap-medication-selector" type="checkbox" ';if(medication.SELECTED_IND){out+='checked';}out+='/><span> '; out+=window.render.aapOrderDisplay(medication.ORDER_ID); out+='</span><div class="aap-required-freetext" style="display:';if(medication.SELECTED_IND){out+='block;';}else{out+='none;';}out+='"><span>*</span><input type="text" class="aap-dose-route" value="'+(medication.COMMENTS)+'" />';if(window.render.aapOrderSpacerDisplay(medication.ORDER_ID)){out+='<div><input type="checkbox" class="aap-spacer-administration" ';if(medication.SPACER_IND){out+='checked';}out+=' />'+(i18n.innov.asthmaActionPlan.SPACER)+'</div>';}out+='</div></span>';} } out+='</div>';}else{out+='<div class="aap-label">'+(i18n.innov.asthmaActionPlan.NO_MEDS)+'</div>';}out+='<span data-section-attribute="'+({zoneSection: it.SECTIONS.DAILY, sectionKey: "DAILY"}.sectionKey)+'"><a href="#" class="aap-add-medications">'+(i18n.innov.asthmaActionPlan.ADD_MEDICATIONS)+'</a></span><br/><br/></div>';if(it.COMMENTS_IND !== 0){out+='<div><div>'+(it.COMMENTS_LABEL)+':</div><input class="aap-zone-comments" type="text" value="';if(it.COMMENTS){out+=''+(it.COMMENTS);}else{out+=' ';}out+='" maxlength="256" /></div>';}if(it.CLIENT_SPECIAL_INSTRUCTIONS.length > 0){out+='<div class="aap-client-instructions"><span>'+(it.CLIENT_SPECIAL_INSTRUCTIONS)+'</span></div>';}out+='</div><div class="aap-hide-medications"></div></div></div>';return out;
}var itself=aapGreenZone, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.aapZoneCommentsBlock=aapZoneCommentsBlock;itself.aapZoneMedsBlock=aapZoneMedsBlock;itself.aapZoneDescriptionBlock=aapZoneDescriptionBlock;itself.aapClientInstructionsBlock=aapClientInstructionsBlock;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['aapGreenZone']=itself;}}());(function(){function aapPlanInformationHover(it
/**/) {
var out='<span class="aap-label"><span class="aap-measurement">'; window.render.aapActionPlanTitle(); out+='</span></span><span class="aap-label">'+(i18n.innov.asthmaActionPlan.DATE_LABEL)+':<span class="aap-measurement">';if(it.PLAN_DATE){out+=' '+(it.PLAN_DATE);}else{out+=' -- ';}out+='</span></span><span class="aap-label">'+(i18n.innov.asthmaActionPlan.ACT_SCORE)+':<span class="aap-measurement">';if(it.GENERAL_INFORMATION.ASTHMA_CONTROL_TEST_SCORE){out+=' '+(it.GENERAL_INFORMATION.ASTHMA_CONTROL_TEST_SCORE);}else{out+=' -- ';}out+='</span></span><span class="aap-label">'+(i18n.innov.asthmaActionPlan.PEAK_FLOW)+':<span class="aap-measurement">';if(it.GENERAL_INFORMATION.PERSONAL_BEST_PEAK_FLOW){out+=' '+(it.GENERAL_INFORMATION.PERSONAL_BEST_PEAK_FLOW);}else{out+=' -- ';}out+='</span></span><span class="aap-label">'+(i18n.innov.asthmaActionPlan.ER_VISITS)+':<span class="aap-measurement">';if(it.GENERAL_INFORMATION.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION){out+=' '+(it.GENERAL_INFORMATION.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION);}else{out+=' -- ';}out+='</span></span><span class="aap-label">'+(i18n.innov.asthmaActionPlan.HOSPITALIZATIONS)+':<span class="aap-measurement">';if(it.GENERAL_INFORMATION.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT){out+=' '+(it.GENERAL_INFORMATION.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT);}else{out+=' -- ';}out+='</span></span><span class="aap-label">'+(i18n.innov.asthmaActionPlan.TRIGGERS)+':';var arr1=it.GENERAL_INFORMATION.TRIGGERS;if(arr1){var trigger,i1=-1,l1=arr1.length-1;while(i1<l1){trigger=arr1[i1+=1];out+='<span class="aap-measurement aap-asthma-trigger">';if(trigger.MEANING.length > 0){if(trigger.MEANING === "TRIGGER_OTHER"){out+='&nbsp;'+(i18n.innov.asthmaActionPlan[trigger.MEANING]);if(trigger.COMMENTS){out+=': '+(trigger.COMMENTS);}}else{out+='&nbsp;';out+=window.render.aapTriggerLabels(trigger.MEANING);}}else{out+='&nbsp;'+(i18n.innov.asthmaActionPlan[trigger]);}out+='</span>';} } out+='</span>';return out;
}var itself=aapPlanInformationHover, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['aapPlanInformationHover']=itself;}}());(function(){function aapSchoolAuthorizationBlock(it
/**/) {
var out='';if(it.FOOTER.AUTHORIZATION_NEEDED){if(window.render.aapPrintSettings("SCHOOL_AUTH")){ out+=window.render.aapPrintSettings("SCHOOL_AUTH"); }else{out+='<div class="aap-col-full aap-print-authorization"><div>'+(i18n.innov.asthmaActionPlan.SCHOOL_AUTH_LABEL)+'</div><div>'+(i18n.innov.asthmaActionPlan.APPROVED_BY_LABEL)+':&nbsp;&nbsp;&#9744; '+(i18n.innov.asthmaActionPlan.PROVIDER)+'&nbsp;&nbsp;&#9744; '+(i18n.innov.asthmaActionPlan.SCHOOL_NURSE)+'&nbsp;&nbsp;&#9744; '+(i18n.innov.asthmaActionPlan.EDUCATOR)+'</div><div class="aap-signature-line">'+(i18n.innov.asthmaActionPlan.SCHOOL_SIGNATURE_LABEL)+': ____________________________________________</div><div class="aap-signature-line">'+(i18n.innov.asthmaActionPlan.SIGNATURE_DATE_LABEL)+': ___________________</div></div><div class="aap-col-full aap-print-authorization"><div>'+(i18n.innov.asthmaActionPlan.PARENT_LABEL)+'</div><div class="aap-signature-line">'+(i18n.innov.asthmaActionPlan.PARENT_SIGNATURE_LABEL)+' ____________________________________________</div><div class="aap-signature-line">'+(i18n.innov.asthmaActionPlan.SIGNATURE_DATE_LABEL)+' ___________________</div></div>';}}return out;
}function aapPrintSetup(it
/**/) {
var out=''; function aapPrintZoneBody(zone) { out+='<div class="aap-col-two-thirds">';if(zone.MEDS_REQUIRED){ for(var section in zone.SECTIONS) { out+='<div class="aap-print-section-header"><div class="aap-col-one-third"><span>'+(zone.SECTIONS[section].LABEL)+':</span></div><div class="aap-col-two-thirds"><span>'+(i18n.innov.asthmaActionPlan.MED_FREQUENCY_HEADER)+':</span></div></div><div class="aap-print-section">';var arr1=zone.SECTIONS[section].MEDICATIONS;if(arr1){var medication,i1=-1,l1=arr1.length-1;while(i1<l1){medication=arr1[i1+=1];if(medication.SELECTED_IND){out+='<div class="aap-print-medication"><div class="aap-col-one-third"><span>'; out+=window.render.aapOrderDisplay(medication.ORDER_ID); out+='</span></div><div class="aap-col-two-thirds"><span>'+(medication.COMMENTS);if(medication.SPACER_IND){out+=" ";out+=''+(i18n.innov.asthmaActionPlan.PRINT_SPACER);}out+='</span></div></div>';}} } out+='</div>'; } if(zone.SPECIAL_INSTRUCTIONS && zone.SPECIAL_INSTRUCTIONS.length > 0){out+='<br/><div class="aap-print-section-header"><div class="aap-col-full"><span>'+(i18n.innov.asthmaActionPlan.YELLOW_ZONE_INSTRUCTIONS_LABEL)+':</span></div></div><div class="aap-col-full"><span>'+(zone.SPECIAL_INSTRUCTIONS)+'</span></div>';}if(zone.COMMENTS_IND && zone.COMMENTS && zone.COMMENTS.length > 0){out+='<br/><div class="aap-print-section-header"><div class="aap-col-full"><span>'+(zone.COMMENTS_LABEL)+':</span></div></div><div class="aap-col-full"><span>'+(zone.COMMENTS)+'</span></div>';}if(zone.CLIENT_SPECIAL_INSTRUCTIONS.length > 0){out+='<div class="aap-client-instructions"><span>'+(zone.CLIENT_SPECIAL_INSTRUCTIONS)+'</span></div>';}}else{out+='<span class="aap-content">'+(i18n.innov.asthmaActionPlan.NO_MEDS_REQUIRED)+'</span>';}out+='</div>'; } out+='<div class="aap-print-header"><div style="width:735px;clear:both;height:0;display:block;visibility:hidden;"></div><div class="aap-print-title-group"><span class="aap-print-title">'; out+=window.render.aapActionPlanTitle(); out+=':</span><span class="aap-print-name"> '+(it.GENERAL_INFORMATION.NAME )+'</span></div><div class="aap-print-header-information"><span class="aap-print-label-group"><span class="aap-label">'+(i18n.innov.asthmaActionPlan.PROVIDER )+': </span>'+(it.GENERAL_INFORMATION.PREPARED_BY )+'</span><span class="aap-print-label-group"><span class="aap-label">'+(i18n.innov.asthmaActionPlan.DOB_LABEL)+': </span>'+(it.GENERAL_INFORMATION.DOB )+'</span><span class="aap-print-label-group"><span class="aap-label">'+(i18n.innov.asthmaActionPlan.DATE_LABEL)+': </span>'; out+=window.render.aapPrintSettings("PLAN_DATE"); out+='</span></div><div style="width:735px;clear:both;height:0;display:block;visibility:hidden;"></div></div><div class="aap-print-body"><div class="aap-print-information"><div class="aap-col-one-third">';if(window.render.aapPrintSettings("MRN_PRINT")){out+='<span class="aap-print-label-group"><span class="aap-label">'+(i18n.innov.asthmaActionPlan.MRN_LABEL)+': </span>'+(it.GENERAL_INFORMATION.MRN )+'</span>';}if(it.GENERAL_INFORMATION.PCP_LABEL && it.GENERAL_INFORMATION.PCP_LABEL.length > 0){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.PCP_LABEL)+': </span>'+(it.GENERAL_INFORMATION.PRIMARY_PROVIDER_NAME)+'</span>';}if(it.GENERAL_INFORMATION.PCP_PHONE_LABEL && it.GENERAL_INFORMATION.PCP_PHONE_LABEL.length > 0){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.PCP_PHONE_LABEL)+': </span>'+(it.GENERAL_INFORMATION.PRIMARY_PROVIDER_PHONE)+'</span>';}if(it.FOOTER.FOLLOW_UP.length > 0){out+='<span class="aap-print-label-group"><span class="aap-label">'+(i18n.innov.asthmaActionPlan.VISIT_LABEL)+': </span>'+(it.FOOTER.FOLLOW_UP)+'</span>';}out+='</div><div class="aap-col-one-third">';if(window.render.aapPrintSettings("ACT_PRINT")){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.ASTHMA_TEST_LABEL)+': </span>'+(it.GENERAL_INFORMATION.ASTHMA_CONTROL_TEST_SCORE)+'</span>';}if(window.render.aapPrintSettings("INFANT_PRINT")){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.INFANT_LABEL)+': </span>'+(it.GENERAL_INFORMATION.INFANT_ASTHMA_EVENT)+'</span>';}if(window.render.aapPrintSettings("PEAK_FLOW_PRINT")){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.PEAK_FLOW_LABEL)+': </span>'+(it.GENERAL_INFORMATION.PERSONAL_BEST_PEAK_FLOW)+'</span>';}if(window.render.aapPrintSettings("ASTHMA_SEV_PRINT") && it.GENERAL_INFORMATION.SEVERITY_LABEL){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.SEVERITY_LABEL)+': </span>';if(it.GENERAL_INFORMATION.ASTHMA_SEVERITY){out+=''+(it.GENERAL_INFORMATION.ASTHMA_SEVERITY);}else{out+=' -- ';}out+='</span>';}out+='</div><div class="aap-col-one-third">';if(it.GENERAL_INFORMATION.OTHER_CE_LABEL.length > 0){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.OTHER_CE_LABEL)+': </span>'+(it.GENERAL_INFORMATION.OTHER_CE_VALUE)+'</span>';}if(window.render.aapPrintSettings("ED_VISITS_PRINT")){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.ED_VISITS_LABEL)+': </span>';if(it.GENERAL_INFORMATION.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION){out+=''+(it.GENERAL_INFORMATION.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION);}else{out+=' -- ';}out+='</span>';}if(window.render.aapPrintSettings("INP_STAYS_PRINT")){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.INP_STAY_LABEL)+': </span>';if(it.GENERAL_INFORMATION.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT){out+=''+(it.GENERAL_INFORMATION.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT);}else{out+=' -- ';}out+='</span>';}out+='</div></div><div class="aap-col-full"><div class="aap-col-two-thirds"><span class="aap-label">'+(i18n.innov.asthmaActionPlan.TRIGGERS)+':</span>';var arr2=it.GENERAL_INFORMATION.TRIGGERS;if(arr2){var trigger,i2=-1,l2=arr2.length-1;while(i2<l2){trigger=arr2[i2+=1];out+='<span class="aap-asthma-trigger">';if(trigger.MEANING.length){if(trigger.MEANING === "TRIGGER_OTHER"){out+='&nbsp;'+(i18n.innov.asthmaActionPlan[trigger.MEANING]);if(trigger.COMMENTS){out+=': '+(trigger.COMMENTS);}}else{out+='&nbsp;';out+=window.render.aapTriggerLabels(trigger.MEANING);}}else{out+='&nbsp;'+(i18n.innov.asthmaActionPlan[trigger]);}out+='</span>';} } out+='</div><div class="aap-col-one-third">';if(it.GENERAL_INFORMATION.ALLERGY_LABEL){out+='<span class="aap-print-label-group"><span class="aap-label">'+(it.GENERAL_INFORMATION.ALLERGY_LABEL)+': </span>';var arr3=it.GENERAL_INFORMATION.ALLERGIES;if(arr3){var allergy,i3=-1,l3=arr3.length-1;while(i3<l3){allergy=arr3[i3+=1];out+=' <span class="aap-allergy">'+(allergy.DISPLAY)+'</span>';} } out+='</span>';}out+='</div></div><div class="aap-print-zone-body"><div class="aap-print-zone-header aap-green-zone-header"><div class="aap-col-one-third"><span>'+(i18n.innov.asthmaActionPlan.GREEN_ZONE)+'</span></div><div class="aap-col-two-thirds"><span>'+(i18n.innov.asthmaActionPlan.GREEN_ZONE_SUBHEADING)+'</span></div></div><div class="aap-col-one-third"><div class="aap-print-zone-icon">'; out+=window.render.aapIcons("GREEN_ICON"); out+='</div><div class="aap-print-content"><div class="aap-content"><ul>';var arr4=it.GREEN_ZONE.SYMPTOMS.LIST;if(arr4){var symptom,i4=-1,l4=arr4.length-1;while(i4<l4){symptom=arr4[i4+=1];out+='<li>'+(symptom.key)+'</li>';} } out+='</ul></div><div><span>'+(i18n.innov.asthmaActionPlan.PEAK_FLOW)+':<span class="aap-print-measurement"> '+(it.GREEN_ZONE.PEAK_FLOW_RANGE_DISPLAY)+'</span></span><span class="aap-italics">'+(it.GREEN_ZONE.PEAK_FLOW_RANGE_LABEL)+'</span></div></div></div>'; aapPrintZoneBody(it.GREEN_ZONE); out+='</div><div class="aap-print-zone-body"><div class="aap-print-zone-header aap-yellow-zone-header"><div class="aap-col-one-third"><span>'+(i18n.innov.asthmaActionPlan.YELLOW_ZONE)+'</span></div><div class="aap-col-two-thirds"><span>'+(i18n.innov.asthmaActionPlan.YELLOW_ZONE_SUBHEADING)+'</span></div></div><div class="aap-col-one-third"><div class="aap-print-zone-icon">'; out+=window.render.aapIcons("YELLOW_ICON"); out+='</div><div class="aap-print-content"><div class="aap-content"><ul>';var arr5=it.YELLOW_ZONE.SYMPTOMS.LIST;if(arr5){var symptom,i5=-1,l5=arr5.length-1;while(i5<l5){symptom=arr5[i5+=1];out+='<li>'+(symptom.key)+'</li>';} } out+='</ul></div><div><span>'+(i18n.innov.asthmaActionPlan.PEAK_FLOW)+':<span class="aap-print-measurement"> '+(it.YELLOW_ZONE.PEAK_FLOW_RANGE_DISPLAY)+'</span></span><span class="aap-italics">'+(it.YELLOW_ZONE.PEAK_FLOW_RANGE_LABEL)+'</span></div></div></div>'; aapPrintZoneBody(it.YELLOW_ZONE); out+='</div><div class="aap-print-zone-body"><div class="aap-print-zone-header aap-red-zone-header"><div class="aap-col-one-third"><span>'+(i18n.innov.asthmaActionPlan.RED_ZONE)+'</span></div><div class="aap-col-two-thirds"><span>'+(i18n.innov.asthmaActionPlan.RED_ZONE_SUBHEADING)+'</span></div></div><div class="aap-col-one-third"><div class="aap-print-zone-icon">'; out+=window.render.aapIcons("RED_ICON"); out+='</div><div class="aap-print-content"><div class="aap-content"><ul>';var arr6=it.RED_ZONE.SYMPTOMS.LIST;if(arr6){var symptom,i6=-1,l6=arr6.length-1;while(i6<l6){symptom=arr6[i6+=1];out+='<li>'+(symptom.key)+'</li>';} } out+='</ul></div><div><span>'+(i18n.innov.asthmaActionPlan.PEAK_FLOW)+':<span class="aap-print-measurement"> '+(it.RED_ZONE.PEAK_FLOW_RANGE_DISPLAY)+'</span></span><span class="aap-italics">'+(it.RED_ZONE.PEAK_FLOW_RANGE_LABEL)+'</span></div></div></div>'; aapPrintZoneBody(it.RED_ZONE); if(it.FOOTER.INSTRUCTIONS){out+='<div class="aap-col-full aap-content"><span class="aap-label">'+(i18n.innov.asthmaActionPlan.INSTRUCTIONS_LABEL)+':</span><span class="aap-content">'+(it.FOOTER.INSTRUCTIONS)+'</span></div>';}out+='</div><div class="aap-print-footer">';if(it.FOOTER.AUTHORIZATION_NEEDED){if(window.render.aapPrintSettings("SCHOOL_AUTH")){ out+=window.render.aapPrintSettings("SCHOOL_AUTH"); }else{out+='<div class="aap-col-full aap-print-authorization"><div>'+(i18n.innov.asthmaActionPlan.SCHOOL_AUTH_LABEL)+'</div><div>'+(i18n.innov.asthmaActionPlan.APPROVED_BY_LABEL)+':&nbsp;&nbsp;&#9744; '+(i18n.innov.asthmaActionPlan.PROVIDER)+'&nbsp;&nbsp;&#9744; '+(i18n.innov.asthmaActionPlan.SCHOOL_NURSE)+'&nbsp;&nbsp;&#9744; '+(i18n.innov.asthmaActionPlan.EDUCATOR)+'</div><div class="aap-signature-line">'+(i18n.innov.asthmaActionPlan.SCHOOL_SIGNATURE_LABEL)+': ____________________________________________</div><div class="aap-signature-line">'+(i18n.innov.asthmaActionPlan.SIGNATURE_DATE_LABEL)+': ___________________</div></div><div class="aap-col-full aap-print-authorization"><div>'+(i18n.innov.asthmaActionPlan.PARENT_LABEL)+'</div><div class="aap-signature-line">'+(i18n.innov.asthmaActionPlan.PARENT_SIGNATURE_LABEL)+' ____________________________________________</div><div class="aap-signature-line">'+(i18n.innov.asthmaActionPlan.SIGNATURE_DATE_LABEL)+' ___________________</div></div>';}}out+='</div></div>';return out;
}var itself=aapPrintSetup, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.aapSchoolAuthorizationBlock=aapSchoolAuthorizationBlock;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['aapPrintSetup']=itself;}}());(function(){function aapZoneCommentsBlock(it
/**/) {
var out='';if(it.COMMENTS_IND !== 0){out+='<div><div>'+(it.COMMENTS_LABEL)+':</div><input class="aap-zone-comments" type="text" value="';if(it.COMMENTS){out+=''+(it.COMMENTS);}else{out+=' ';}out+='" maxlength="256" /></div>';}return out;
}function aapZoneMedsBlock(it
/**/) {
var out='';if(it.zoneSection.MEDICATIONS){out+='<div class="aap-med-section" data-section-attribute="'+(it.sectionKey)+'">';var arr1=it.zoneSection.MEDICATIONS;if(arr1){var medication,i1=-1,l1=arr1.length-1;while(i1<l1){medication=arr1[i1+=1];out+='<span class="aap-medication" data-order-id="'+(medication.ORDER_ID)+'"><input class="aap-medication-selector" type="checkbox" ';if(medication.SELECTED_IND){out+='checked';}out+='/><span> '; out+=window.render.aapOrderDisplay(medication.ORDER_ID); out+='</span><div class="aap-required-freetext" style="display:';if(medication.SELECTED_IND){out+='block;';}else{out+='none;';}out+='"><span>*</span><input type="text" class="aap-dose-route" value="'+(medication.COMMENTS)+'" />';if(window.render.aapOrderSpacerDisplay(medication.ORDER_ID)){out+='<div><input type="checkbox" class="aap-spacer-administration" ';if(medication.SPACER_IND){out+='checked';}out+=' />'+(i18n.innov.asthmaActionPlan.SPACER)+'</div>';}out+='</div></span>';} } out+='</div>';}else{out+='<div class="aap-label">'+(i18n.innov.asthmaActionPlan.NO_MEDS)+'</div>';}out+='<span data-section-attribute="'+(it.sectionKey)+'"><a href="#" class="aap-add-medications">'+(i18n.innov.asthmaActionPlan.ADD_MEDICATIONS)+'</a></span><br/><br/>';return out;
}function aapZoneDescriptionBlock(it
/**/) {
var out='<div class="aap-content">'+(it.SYMPTOMS.LABEL)+'<ul>';var arr1=it.SYMPTOMS.LIST;if(arr1){var symptom,i1=-1,l1=arr1.length-1;while(i1<l1){symptom=arr1[i1+=1];out+='<li>'+(symptom.key)+'</li>';} } out+='</ul></div>';if(it.PEAK_FLOW_DISPLAY_IND){out+='<div class="aap-content"><span><span class="aap-measurement">'+(i18n.innov.asthmaActionPlan.PEAK_FLOW_COLUMN)+'</span> ('+(i18n.innov.asthmaActionPlan.OPTIONAL)+'): </span><span class="aap-measurement">'+(it.PEAK_FLOW_RANGE_DISPLAY)+'</span><br/><span class="aap-italics">'+(it.PEAK_FLOW_RANGE_LABEL)+'</span></div>';}return out;
}function aapClientInstructionsBlock(it
/**/) {
var out='';if(it.CLIENT_SPECIAL_INSTRUCTIONS.length > 0){out+='<div class="aap-client-instructions"><span>'+(it.CLIENT_SPECIAL_INSTRUCTIONS)+'</span></div>';}return out;
}function aapRedZone(it
/**/) {
var out='<div class="aap-red-zone-header"><div class="aap-col-one-third"><span class="aap-content">'+(i18n.innov.asthmaActionPlan.RED_ZONE)+'</span></div><div class="aap-col-two-thirds"><span class="aap-content">'+(i18n.innov.asthmaActionPlan.RED_ZONE_SUBHEADING)+'</span></div></div><div class="aap-zone-body" data-zone-attribute="RED_ZONE"><div class="aap-col-one-third"><div class="aap-content">'+(it.SYMPTOMS.LABEL)+'<ul>';var arr1=it.SYMPTOMS.LIST;if(arr1){var symptom,i1=-1,l1=arr1.length-1;while(i1<l1){symptom=arr1[i1+=1];out+='<li>'+(symptom.key)+'</li>';} } out+='</ul></div>';if(it.PEAK_FLOW_DISPLAY_IND){out+='<div class="aap-content"><span><span class="aap-measurement">'+(i18n.innov.asthmaActionPlan.PEAK_FLOW_COLUMN)+'</span> ('+(i18n.innov.asthmaActionPlan.OPTIONAL)+'): </span><span class="aap-measurement">'+(it.PEAK_FLOW_RANGE_DISPLAY)+'</span><br/><span class="aap-italics">'+(it.PEAK_FLOW_RANGE_LABEL)+'</span></div>';}out+='</div><div class="aap-col-two-thirds"><div class="aap-medications-required">'+(i18n.innov.asthmaActionPlan.ARE_MEDS_REQUIRED)+'<span><input type="radio" name="aap-red-meds-required" ';if(it.MEDS_REQUIRED){out+='checked';}out+=' /> '+(i18n.innov.asthmaActionPlan.YES)+'</span><span><input type="radio" name="aap-red-meds-required" ';if(!it.MEDS_REQUIRED){out+='checked';}out+=' />  '+(i18n.innov.asthmaActionPlan.NO)+'</span></div><div class="aap-content"><div><span class="aap-required">* </span>'+(i18n.innov.asthmaActionPlan.RED_ZONE_EMERGENCY_LABEL)+':';if({zoneSection: it.SECTIONS.EMERGENCY, sectionKey: "EMERGENCY"}.zoneSection.MEDICATIONS){out+='<div class="aap-med-section" data-section-attribute="'+({zoneSection: it.SECTIONS.EMERGENCY, sectionKey: "EMERGENCY"}.sectionKey)+'">';var arr2={zoneSection: it.SECTIONS.EMERGENCY, sectionKey: "EMERGENCY"}.zoneSection.MEDICATIONS;if(arr2){var medication,i2=-1,l2=arr2.length-1;while(i2<l2){medication=arr2[i2+=1];out+='<span class="aap-medication" data-order-id="'+(medication.ORDER_ID)+'"><input class="aap-medication-selector" type="checkbox" ';if(medication.SELECTED_IND){out+='checked';}out+='/><span> '; out+=window.render.aapOrderDisplay(medication.ORDER_ID); out+='</span><div class="aap-required-freetext" style="display:';if(medication.SELECTED_IND){out+='block;';}else{out+='none;';}out+='"><span>*</span><input type="text" class="aap-dose-route" value="'+(medication.COMMENTS)+'" />';if(window.render.aapOrderSpacerDisplay(medication.ORDER_ID)){out+='<div><input type="checkbox" class="aap-spacer-administration" ';if(medication.SPACER_IND){out+='checked';}out+=' />'+(i18n.innov.asthmaActionPlan.SPACER)+'</div>';}out+='</div></span>';} } out+='</div>';}else{out+='<div class="aap-label">'+(i18n.innov.asthmaActionPlan.NO_MEDS)+'</div>';}out+='<span data-section-attribute="'+({zoneSection: it.SECTIONS.EMERGENCY, sectionKey: "EMERGENCY"}.sectionKey)+'"><a href="#" class="aap-add-medications">'+(i18n.innov.asthmaActionPlan.ADD_MEDICATIONS)+'</a></span><br/><br/></div>';if(it.COMMENTS_IND !== 0){out+='<div><div>'+(it.COMMENTS_LABEL)+':</div><input class="aap-zone-comments" type="text" value="';if(it.COMMENTS){out+=''+(it.COMMENTS);}else{out+=' ';}out+='" maxlength="256" /></div>';}if(it.CLIENT_SPECIAL_INSTRUCTIONS.length > 0){out+='<div class="aap-client-instructions"><span>'+(it.CLIENT_SPECIAL_INSTRUCTIONS)+'</span></div>';}out+='</div><div class="aap-hide-medications"></div></div></div>';return out;
}var itself=aapRedZone, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.aapZoneCommentsBlock=aapZoneCommentsBlock;itself.aapZoneMedsBlock=aapZoneMedsBlock;itself.aapZoneDescriptionBlock=aapZoneDescriptionBlock;itself.aapClientInstructionsBlock=aapClientInstructionsBlock;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['aapRedZone']=itself;}}());(function(){function aapZoneCommentsBlock(it
/**/) {
var out='';if(it.COMMENTS_IND !== 0){out+='<div><div>'+(it.COMMENTS_LABEL)+':</div><input class="aap-zone-comments" type="text" value="';if(it.COMMENTS){out+=''+(it.COMMENTS);}else{out+=' ';}out+='" maxlength="256" /></div>';}return out;
}function aapZoneMedsBlock(it
/**/) {
var out='';if(it.zoneSection.MEDICATIONS){out+='<div class="aap-med-section" data-section-attribute="'+(it.sectionKey)+'">';var arr1=it.zoneSection.MEDICATIONS;if(arr1){var medication,i1=-1,l1=arr1.length-1;while(i1<l1){medication=arr1[i1+=1];out+='<span class="aap-medication" data-order-id="'+(medication.ORDER_ID)+'"><input class="aap-medication-selector" type="checkbox" ';if(medication.SELECTED_IND){out+='checked';}out+='/><span> '; out+=window.render.aapOrderDisplay(medication.ORDER_ID); out+='</span><div class="aap-required-freetext" style="display:';if(medication.SELECTED_IND){out+='block;';}else{out+='none;';}out+='"><span>*</span><input type="text" class="aap-dose-route" value="'+(medication.COMMENTS)+'" />';if(window.render.aapOrderSpacerDisplay(medication.ORDER_ID)){out+='<div><input type="checkbox" class="aap-spacer-administration" ';if(medication.SPACER_IND){out+='checked';}out+=' />'+(i18n.innov.asthmaActionPlan.SPACER)+'</div>';}out+='</div></span>';} } out+='</div>';}else{out+='<div class="aap-label">'+(i18n.innov.asthmaActionPlan.NO_MEDS)+'</div>';}out+='<span data-section-attribute="'+(it.sectionKey)+'"><a href="#" class="aap-add-medications">'+(i18n.innov.asthmaActionPlan.ADD_MEDICATIONS)+'</a></span><br/><br/>';return out;
}function aapZoneDescriptionBlock(it
/**/) {
var out='<div class="aap-content">'+(it.SYMPTOMS.LABEL)+'<ul>';var arr1=it.SYMPTOMS.LIST;if(arr1){var symptom,i1=-1,l1=arr1.length-1;while(i1<l1){symptom=arr1[i1+=1];out+='<li>'+(symptom.key)+'</li>';} } out+='</ul></div>';if(it.PEAK_FLOW_DISPLAY_IND){out+='<div class="aap-content"><span><span class="aap-measurement">'+(i18n.innov.asthmaActionPlan.PEAK_FLOW_COLUMN)+'</span> ('+(i18n.innov.asthmaActionPlan.OPTIONAL)+'): </span><span class="aap-measurement">'+(it.PEAK_FLOW_RANGE_DISPLAY)+'</span><br/><span class="aap-italics">'+(it.PEAK_FLOW_RANGE_LABEL)+'</span></div>';}return out;
}function aapClientInstructionsBlock(it
/**/) {
var out='';if(it.CLIENT_SPECIAL_INSTRUCTIONS.length > 0){out+='<div class="aap-client-instructions"><span>'+(it.CLIENT_SPECIAL_INSTRUCTIONS)+'</span></div>';}return out;
}function aapYellowZone(it
/**/) {
var out='<div class="aap-yellow-zone-header"><div class="aap-col-one-third"><span class="aap-content">'+(i18n.innov.asthmaActionPlan.YELLOW_ZONE)+'</span></div><div class="aap-col-two-thirds"><span class="aap-content">'+(i18n.innov.asthmaActionPlan.YELLOW_ZONE_SUBHEADING)+'</span></div></div><div class="aap-zone-body" data-zone-attribute="YELLOW_ZONE"><div class="aap-col-one-third"><div class="aap-content">'+(it.SYMPTOMS.LABEL)+'<ul>';var arr1=it.SYMPTOMS.LIST;if(arr1){var symptom,i1=-1,l1=arr1.length-1;while(i1<l1){symptom=arr1[i1+=1];out+='<li>'+(symptom.key)+'</li>';} } out+='</ul></div>';if(it.PEAK_FLOW_DISPLAY_IND){out+='<div class="aap-content"><span><span class="aap-measurement">'+(i18n.innov.asthmaActionPlan.PEAK_FLOW_COLUMN)+'</span> ('+(i18n.innov.asthmaActionPlan.OPTIONAL)+'): </span><span class="aap-measurement">'+(it.PEAK_FLOW_RANGE_DISPLAY)+'</span><br/><span class="aap-italics">'+(it.PEAK_FLOW_RANGE_LABEL)+'</span></div>';}out+='</div><div class="aap-col-two-thirds"><div class="aap-medications-required">'+(i18n.innov.asthmaActionPlan.ARE_MEDS_REQUIRED)+'<span><input type="radio" name="aap-yellow-meds-required" ';if(it.MEDS_REQUIRED){out+='checked';}out+=' /> '+(i18n.innov.asthmaActionPlan.YES)+'</span><span><input type="radio" name="aap-yellow-meds-required" ';if(!it.MEDS_REQUIRED){out+='checked';}out+=' /> '+(i18n.innov.asthmaActionPlan.NO)+'</span></div><div class="aap-content"><div><span class="aap-required">* </span>'+(i18n.innov.asthmaActionPlan.QUICK_RELIEF)+':';if({zoneSection: it.SECTIONS.RELIEF, sectionKey: "RELIEF"}.zoneSection.MEDICATIONS){out+='<div class="aap-med-section" data-section-attribute="'+({zoneSection: it.SECTIONS.RELIEF, sectionKey: "RELIEF"}.sectionKey)+'">';var arr2={zoneSection: it.SECTIONS.RELIEF, sectionKey: "RELIEF"}.zoneSection.MEDICATIONS;if(arr2){var medication,i2=-1,l2=arr2.length-1;while(i2<l2){medication=arr2[i2+=1];out+='<span class="aap-medication" data-order-id="'+(medication.ORDER_ID)+'"><input class="aap-medication-selector" type="checkbox" ';if(medication.SELECTED_IND){out+='checked';}out+='/><span> '; out+=window.render.aapOrderDisplay(medication.ORDER_ID); out+='</span><div class="aap-required-freetext" style="display:';if(medication.SELECTED_IND){out+='block;';}else{out+='none;';}out+='"><span>*</span><input type="text" class="aap-dose-route" value="'+(medication.COMMENTS)+'" />';if(window.render.aapOrderSpacerDisplay(medication.ORDER_ID)){out+='<div><input type="checkbox" class="aap-spacer-administration" ';if(medication.SPACER_IND){out+='checked';}out+=' />'+(i18n.innov.asthmaActionPlan.SPACER)+'</div>';}out+='</div></span>';} } out+='</div>';}else{out+='<div class="aap-label">'+(i18n.innov.asthmaActionPlan.NO_MEDS)+'</div>';}out+='<span data-section-attribute="'+({zoneSection: it.SECTIONS.RELIEF, sectionKey: "RELIEF"}.sectionKey)+'"><a href="#" class="aap-add-medications">'+(i18n.innov.asthmaActionPlan.ADD_MEDICATIONS)+'</a></span><br/><br/></div><div><span class="aap-required">* </span>'+(i18n.innov.asthmaActionPlan.YELLOW_ZONE_INSTRUCTIONS_LABEL)+':<input type="text" class="aap-special-instructions" value="';if(it.SPECIAL_INSTRUCTIONS){out+=''+(it.SPECIAL_INSTRUCTIONS);}else{out+=' ';}out+='" /></div>';if(it.COMMENTS_IND !== 0){out+='<div><div>'+(it.COMMENTS_LABEL)+':</div><input class="aap-zone-comments" type="text" value="';if(it.COMMENTS){out+=''+(it.COMMENTS);}else{out+=' ';}out+='" maxlength="256" /></div>';}if(it.CLIENT_SPECIAL_INSTRUCTIONS.length > 0){out+='<div class="aap-client-instructions"><span>'+(it.CLIENT_SPECIAL_INSTRUCTIONS)+'</span></div>';}out+='</div><div class="aap-hide-medications"></div></div></div>';return out;
}var itself=aapYellowZone, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.aapZoneCommentsBlock=aapZoneCommentsBlock;itself.aapZoneMedsBlock=aapZoneMedsBlock;itself.aapZoneDescriptionBlock=aapZoneDescriptionBlock;itself.aapClientInstructionsBlock=aapClientInstructionsBlock;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['aapYellowZone']=itself;}}());var MpageAdvisorEvent=(function(){var instance;
function _ajax_request(scriptName,cclParameters,callback){if(typeof MP_Core!=="undefined"){var request=CERN_BrowserDevInd?new XMLHttpRequest():new XMLCclRequest(),target=scriptName;
cclParameters=cclParameters.join(",");
request.onreadystatechange=function(){if(this.readyState!==4){return;
}if(this.status===200){callback(JSON.parse(this.responseText));
}};
if(CERN_BrowserDevInd){cclParameters="parameters="+cclParameters.replace(/&/g,"%26");
request.open("POST",target,true);
request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
request.send(cclParameters);
}else{request.open("GET",target,true);
request.send(cclParameters);
}}else{if(typeof AjaxHandler!=="undefined"){AjaxHandler.ajax_request({request:{type:"XMLCCLREQUEST",target:scriptName,parameters:cclParameters},response:{type:"JSON",target:function(reply){callback(reply.response);
}}});
}}}function Singleton(){this.saved_fragment_count=0;
this.total_save_fragment_count=0;
this.addAdvisorGroup=function(person_id,encntr_id,prev_advsr_group_id,type_meaning,status_meaning,description,data,callback){type_meaning="^"+type_meaning+"^";
status_meaning="^"+status_meaning+"^";
var cclParam=["^MINE^",prev_advsr_group_id,type_meaning,"1"],self=this,dataFragments=MpageAdvisorEvent.createDataFragments(data),advsr_group_id=0;
_ajax_request("EKS_ADD_ADVSR_GROUP",cclParam,function(reply){advsr_group_id=reply.GROUP_REPLY.GROUP_ID;
self.addAdvisorGroupEvents(person_id,encntr_id,advsr_group_id,type_meaning,status_meaning,description,dataFragments,callback);
});
};
this.addAdvisorGroupEvents=function(person_id,encntr_id,advsr_group_id,type_meaning,status_meaning,description,dataFragments,callback){var cclParam="",cur_data_string="",cur_description="",self=this;
this.saved_fragment_count=0;
this.total_save_fragment_count=dataFragments.length;
var callbackWrapper=function(reply){self.saved_fragment_count+=1;
if(self.total_save_fragment_count==self.saved_fragment_count){callback({group_id:advsr_group_id});
}};
for(var index=0,len=dataFragments.length;
index<len;
index++){cur_description="^"+description+"_"+(index+1)+"^";
cur_data_string=dataFragments[index];
cur_data_string=cur_data_string.replace(/;/g,"&#59;");
cur_data_string=cur_data_string.replace(/~/g,"&#126;");
cur_data_string=cur_data_string.replace(/%/g,"&#37;");
cur_data_string="@"+cur_data_string.length+":"+cur_data_string+"@";
cclParam=["^MINE^",person_id,encntr_id,advsr_group_id,type_meaning,status_meaning,cur_description,cur_data_string];
_ajax_request("EKS_ADD_ADVSR_GROUP_EVENT",cclParam,callbackWrapper);
}};
this.updateAdvisorGroupEffectiveDateTime=function(options){var advsr_group_id=options.advsr_group_id,callback=options.call_back_function,begEffectiveDateTime=options.advsr_beg_effective_dt_tm,cclParam=["^MINE^",advsr_group_id,begEffectiveDateTime];
_ajax_request("EKS_UPD_ADVSR_DT_TM",cclParam,function(reply){callback();
});
};
}return{createDataFragments:function(data){if(typeof data!=="string"){data=JSON.stringify(data);
}var stringFragments=[],stringSize=data.length,fragmentCount=Math.ceil(stringSize/31000),counter;
for(counter=0;
counter<fragmentCount;
counter++){stringFragments.push(data.substr(counter*31000,31000));
}return stringFragments;
},getInstance:function(){if(instance===undefined){instance=new Singleton();
}return instance;
}};
})();
// eslint global flags
/* global ComponentStyle, i18n, MP_Util, $:, MPageComponent, MP_Core, alert, confirm, m_criterionJSON,
    ModalButton, ModalDialog, TableColumn, ComponentTable, MP_ModalDialog, MpageAdvisorEvent */

function AsthmaActionPlanComponentStyle () {
    "use strict";
    this.initByNamespace("aap");
}

AsthmaActionPlanComponentStyle.prototype = new ComponentStyle();
AsthmaActionPlanComponentStyle.prototype.constructor = ComponentStyle;

function AsthmaActionPlanComponent (criterion) {
    "use strict";
    this.setCriterion(criterion);
    this.setStyles(new AsthmaActionPlanComponentStyle());
    this.setComponentLoadTimerName("USR:MPG.AsthmaActionPlan - load component");
    this.setComponentRenderTimerName("ENG:MPG.AsthmaActionPlan - render component");
    this.setLookBackDropDown(false);

    this.launchPlanEngTimer = null;
    this.printPlanCapTimer = null;
    this.signPlanEngTimer = null;
    this.savePlanEngTimer = null;

    this.activeActionPlan = {};
    this.activePreviousGroupId = 0;
    this.activePlanEditsFlag = false;
    this.ADVSR_TYPE_MEANING = "CP_AAP";
    this.DESCRIPTION = "Asthma_Action_Plan";
    this.STATUS_IN_PROGRESS = "INPROGRESS";
    this.STATUS_COMPLETE = "COMPLETE";
    this.STATUS_ERROR = "INERROR";
    this.SCHOOL_AUTH_AGE_LIMIT = 18;

    this.infantPowerFormId = 0;
    this.pediatricPowerFormId = 0;
    this.adultPowerFormId = 0;
    this.doc1PowerFormId = 0;
    this.doc2PowerFormId = 0;
    this.doc3PowerFormId = 0;
    this.doc4PowerFormId = 0;

    this.asthmaSeverityLabel = "";
    this.activeAllergyLabel = "";
    this.primaryCareProviderLabel = "";
    this.primaryCareProviderPhoneLabel = "";
    this.otherCELabel = "";
    this.spacerLowerAge = 0;
    this.spacerUpperAge = 0;
    this.formBrowserName = "";

    this.greenZoneInstructions = "";
    this.yellowZoneInstructions = "";
    this.redZoneInstructions = "";

    this.infantPowerFormLabel = "";
    this.pediatricPowerFormLabel = "";
    this.adultPowerFormLabel = "";
    this.doc1PowerFormLabel = "";
    this.doc2PowerFormLabel = "";
    this.doc3PowerFormLabel = "";
    this.doc4PowerFormLabel = "";

    this.mrnPrintIndicator = "";
    this.actLabel = "";
    this.actRequired = false;
    this.actPrintIndicator = "";
    this.peakFlowLabel = "";
    this.peakFlowRequired = false;
    this.peakFlowPrintIndicator = "";
    this.edVisitsLabel = "";
    this.edVisitsRequired = false;
    this.edVisitsPrintIndicator = "";
    this.inpatientStaysLabel = "";
    this.inpatientStaysRequired = false;
    this.inpatientStaysPrintIndicator = "";
    this.asthmaInfantLabel = "";
    this.asthmaInfantRequired = false;
    this.asthmaInfantPrintIndicator = false;
    this.asthmaSeverityPrintIndicator = "";
    this.clinicalNoteCodeValue = 0;
    this.yellowZoneCommentsLabel = "";

    this.patientDisplayLinks = [];
    this.referenceDisplayLinks = [];
    this.asthmaEducationEventNomenId = 0;
    this.asthmaEducationEventCd = 0;
    this.quickReliefSectionSynonyms = [];
    this.actionPlanTitle = "";
    this.schoolAuthorizationSection = "";

    this._DataBedrockFilters = [];

    this.patientAge = this.calculateAge(criterion.getPatientInfo().getDOB());
}

AsthmaActionPlanComponent.prototype = new MPageComponent();
AsthmaActionPlanComponent.prototype.constructor = MPageComponent;

// ***********************
// Bedrock Filter Mappings
// ***********************
AsthmaActionPlanComponent.prototype.loadFilterMappings = function () {
    // load display filters
    this.addFilterMappingObject("PATIENT_DISPLAY_LINK", { setFunction: this.setPatientDisplayLink, type: "ARRAY", field: "FTXT" });
    this.addFilterMappingObject("REFERENCE_DISPLAY_LINK", { setFunction: this.setReferenceDisplayLink, type: "ARRAY", field: "FTXT" });
    this.addFilterMappingObject("QM_EVENT", { setFunction: this.setAsthmaEducationEvent, type: "NUMBER", field: "PARENT_ENTITY_ID" });
    this.addFilterMappingObject("QM_EVENT_NOMEN", { setFunction: this.setAsthmaEducationEventNomenclature, type: "NUMBER", field: "PARENT_ENTITY_ID" });
    this.addFilterMappingObject("QUICK_RELIEF", { setFunction: this.setQuickRelief, type: "ARRAY", field: "PARENT_ENTITY_ID" });
    this.addFilterMappingObject("TITLE", { setFunction: this.setActionPlanTitle, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ASTHMA_SEV_LBL", { setFunction: this.setAsthmaSeverityLabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ACTIVE_ALLER_LBL", { setFunction: this.setActiveAllergyLabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("PCP_LBL", { setFunction: this.setPrimaryCareProviderLabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("PCP_PHONE_LBL", { setFunction: this.setPrimaryCareProviderPhoneLabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("SPACER_LOWER", { setFunction: this.setSpacerLowerAge, type: "NUMBER", field: "FTXT" });
    this.addFilterMappingObject("SPACER_UPPER", { setFunction: this.setSpacerUpperAge, type: "NUMBER", field: "FTXT" });
    this.addFilterMappingObject("FORM_BROWSWER", { setFunction: this.setFormBrowserName, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("GREEN_SPECIAL_CLIENT", { setFunction: this.setGreenZoneInstructions, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("YELLOW_SPECIAL_CLIENT", { setFunction: this.setYellowZoneInstructions, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("RED_SPECIAL_CLIENT", { setFunction: this.setRedZoneInstructions, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("GREEN_SPECIAL_PROVIDER", { setFunction: this.setGreenZoneCommentsIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("YELLOW_SPECIAL_PROVIDER", { setFunction: this.setYellowZoneCommentsIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("RED_SPECIAL_PROVIDER", { setFunction: this.setRedZoneCommentsIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_DANDER_LBL", { setFunction: this.setTrigger1Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TIGGER_CIGARETTE_LBL", { setFunction: this.setTrigger2Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_STRESS_LBL", { setFunction: this.setTrigger3Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_EXERCISE_LBL", { setFunction: this.setTrigger4Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_COLD_LBL", { setFunction: this.setTrigger5Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_DUST_LBL", { setFunction: this.setTrigger6Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_POLLEN_LBL", { setFunction: this.setTrigger7Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_ANIMAL_LBL", { setFunction: this.setTrigger8Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_MICE_LBL", { setFunction: this.setTrigger9Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_MOLD_LBL", { setFunction: this.setTrigger10Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_SMOKE_LBL", { setFunction: this.setTrigger11Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_12_LBL", { setFunction: this.setTrigger12Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_13_LBL", { setFunction: this.setTrigger13Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_14_LBL", { setFunction: this.setTrigger14Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_15_LBL", { setFunction: this.setTrigger15Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_16_LBL", { setFunction: this.setTrigger16Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_17_LBL", { setFunction: this.setTrigger17Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_18_LBL", { setFunction: this.setTrigger18Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_19_LBL", { setFunction: this.setTrigger19Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("TRIGGER_20_LBL", { setFunction: this.setTrigger20Label, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("MRN_PRINT", { setFunction: this.setMRNPrintIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ACT_PRINT", { setFunction: this.setACTPrintIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ASTHMA_TEST_LABEL", { setFunction: this.setACTLabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ASTHMA_TEST_REQUIRED", { setFunction: this.setACTRequired, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("PEAK_FLOW_PRINT", { setFunction: this.setPeakFlowPrintIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("PEAK_FLOW_LABEL", { setFunction: this.setPeakFlowLabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("PEAK_FLOW_REQUIRED", { setFunction: this.setPeakFlowRequired, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ED_VISITS_PRINT", { setFunction: this.setEDVisitsPrintIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ED_VISITS_LABEL", { setFunction: this.setEDVisitsLabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ED_VISITS_REQUIRED", { setFunction: this.setEDVisitsRequired, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("INP_STAY_PRINT", { setFunction: this.setInpatientStaysPrintIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("INP_STAY_LABEL", { setFunction: this.setInpatientStaysLabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("INP_STAY_REQUIRED", { setFunction: this.setInpatientStaysRequired, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ASTHMA_SEV_PRINT", { setFunction: this.setAsthmaSeverityPrintIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("AAP_NOTE_TYPE", { setFunction: this.setClinicalNoteCodeValue, type: "NUMBER", field: "PE_ID" });
    this.addFilterMappingObject("OTHER_CE_LBL", { setFunction: this.setOtherCELabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ASTHMA_INFANT_LABEL", { setFunction: this.setAsthmaInfantLabel, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ASTHMA_INFANT_REQUIRED", { setFunction: this.setAsthmaInfantRequired, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("ASTHMA_INFANT_PRINT", { setFunction: this.setAsthmaInfantPrintIndicator, type: "STRING", field: "FTXT" });
    this.addFilterMappingObject("YELLOW_COMMENT_LABEL", { setFunction: this.setYellowZoneCommentsLabel, type: "STRING", field: "FTXT" });
    // load powerform filters
    this.addFilterMappingObject("ACT_PF_DOC_INFANT", { setFunction: this.loadPowerFormFilter, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ACT_PF_DOC_PED", { setFunction: this.loadPowerFormFilter, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ACT_PF_DOC_ADULT", { setFunction: this.loadPowerFormFilter, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ASTHMA_PF_DOC_1", { setFunction: this.loadPowerFormFilter, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ASTHMA_PF_DOC_2", { setFunction: this.loadPowerFormFilter, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ASTHMA_PF_DOC_3", { setFunction: this.loadPowerFormFilter, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ASTHMA_PF_DOC_4", { setFunction: this.loadPowerFormFilter, type: "FILTER_OBJECT", field: "ALL" });


    // data bedrock filters
    this.addFilterMappingObject("ACTIVE_MEDS_SYNONYM", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ACTIVE_MEDS_CLASS", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("SPACER_ROUTE", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("QUICK_RELIEF", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    //data clinical event filters
    this.addFilterMappingObject("PEAK_FLOW", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ASTHMA_TEST", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("NUMBER_ED_VISITS", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("NUMBER_INP_STAY", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ASTHMA_INFANT_EVENT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_DANDER", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_CIGARETTE", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_STRESS", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_EXERCISE", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_COLD", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_DUST", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_POLLEN", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_ANIMAL", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_MICE", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_MOLD", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_SMOKE", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_OTHER", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_12", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_13", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_14", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_15", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_16", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_17", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_18", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_19", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_20", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_DANDER_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_CIGARETTE_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_STRESS_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_EXERCISE_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_COLD_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_DUST_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_POLLEN_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_ANIMAL_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_MICE_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_MOLD_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_SMOKE_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_OTHER_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_OTHER_COMMENT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_12_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_13_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_14_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_15_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_16_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_17_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_18_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_19_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("TRIGGER_20_RESULT", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("PCP", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("OTHER_CE", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("PCP_PHONE", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ASTHMA_SEV", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });
    this.addFilterMappingObject("ACTIVE_ALLER", { setFunction: this.buildFilterList, type: "FILTER_OBJECT", field: "ALL" });

};

AsthmaActionPlanComponent.prototype.loadPowerFormFilter = function (filterObject) {
    if (filterObject && filterObject.VALS.length > 0) {
        switch (filterObject.F_MN) {
            case "ACT_PF_DOC_INFANT":
                this.infantPowerFormLabel = filterObject.VALS[0].FTXT;
                this.infantPowerFormId = filterObject.VALS[0].PE_ID;
                break;
            case "ACT_PF_DOC_PED":
                this.pediatricPowerFormId = filterObject.VALS[0].PE_ID;
                this.pediatricPowerFormLabel = filterObject.VALS[0].FTXT;
                break;
            case "ACT_PF_DOC_ADULT":
                this.adultPowerFormId = filterObject.VALS[0].PE_ID;
                this.adultPowerFormLabel = filterObject.VALS[0].FTXT;
                break;
            case "ASTHMA_PF_DOC_1":
                this.doc1PowerFormId = filterObject.VALS[0].PE_ID;
                this.doc1PowerFormLabel = filterObject.VALS[0].FTXT;
                break;
            case "ASTHMA_PF_DOC_2":
                this.doc2PowerFormId = filterObject.VALS[0].PE_ID;
                this.doc2PowerFormLabel = filterObject.VALS[0].FTXT;
                break;
            case "ASTHMA_PF_DOC_3":
                this.doc3PowerFormId = filterObject.VALS[0].PE_ID;
                this.doc3PowerFormLabel = filterObject.VALS[0].FTXT;
                break;
            case "ASTHMA_PF_DOC_4":
                this.doc4PowerFormId = filterObject.VALS[0].PE_ID;
                this.doc4PowerFormLabel = filterObject.VALS[0].FTXT;
                break;
        }
    }
};


AsthmaActionPlanComponent.prototype.getComponentFiltersJSON = function () {
    var componentFilters = {
            "COMPONENT_FILTERS": {
                "FILTERS": this._DataBedrockFilters
            }
        };

    var componentFiltersJSON = JSON.stringify(componentFilters);
    // append trailing zeros to ids in the JSON
    componentFiltersJSON = componentFiltersJSON.replace(/_ID":(\d+),/g , '_ID":$1\.00,');

    return componentFiltersJSON;
};

AsthmaActionPlanComponent.prototype.buildFilterList = function (filterObject) {
   if(filterObject){
        //push the filter object fo filter list
        this._DataBedrockFilters.push(filterObject);
    }
};

AsthmaActionPlanComponent.prototype.setPatientDisplayLink = function (val) {
    for (var index = 0, length = val.length; index < length; index += 2) {
        this.patientDisplayLinks.push({
            "url": val[index],
            "display": val[index + 1]
        });
    }
};

AsthmaActionPlanComponent.prototype.setReferenceDisplayLink = function (val) {
    for (var index = 0, length = val.length; index < length; index += 2) {
        this.referenceDisplayLinks.push({
            "url": val[index],
            "display": val[index + 1]
        });
    }
};

AsthmaActionPlanComponent.prototype.setAsthmaEducationEvent = function (eventCd) {
    this.asthmaEducationEventCd = eventCd;
};

AsthmaActionPlanComponent.prototype.setAsthmaEducationEventNomenclature = function (nomenId) {
    this.asthmaEducationEventNomenId = nomenId;
};

AsthmaActionPlanComponent.prototype.setQuickRelief = function (quickReliefArray) {
    this.quickReliefSectionSynonyms = quickReliefArray;
};

AsthmaActionPlanComponent.prototype.setActionPlanTitle = function (title) {
    this.actionPlanTitle = title;
};

AsthmaActionPlanComponent.prototype.setAsthmaSeverityLabel = function (label) {
    this.asthmaSeverityLabel = label;
};

AsthmaActionPlanComponent.prototype.setActiveAllergyLabel = function (label) {
    this.activeAllergyLabel = label;
};

AsthmaActionPlanComponent.prototype.setPrimaryCareProviderLabel = function (label) {
    this.primaryCareProviderLabel = label;
};

AsthmaActionPlanComponent.prototype.setPrimaryCareProviderPhoneLabel = function (label) {
    this.primaryCareProviderPhoneLabel = label;
};

AsthmaActionPlanComponent.prototype.setSpacerLowerAge = function (age) {
    this.spacerLowerAge = age;
};

AsthmaActionPlanComponent.prototype.setSpacerUpperAge = function (age) {
    this.spacerUpperAge = age;
};

AsthmaActionPlanComponent.prototype.setFormBrowserName = function (name) {
    this.formBrowserName = name;
};

AsthmaActionPlanComponent.prototype.setGreenZoneInstructions = function (text) {
    this.greenZoneInstructions = text;
};

AsthmaActionPlanComponent.prototype.setYellowZoneInstructions = function (text) {
    this.yellowZoneInstructions = text;
};

AsthmaActionPlanComponent.prototype.setRedZoneInstructions = function (text) {
    this.redZoneInstructions = text;
};

AsthmaActionPlanComponent.prototype.setGreenZoneCommentsIndicator = function (indicator) {
    this.greenZoneCommentsIndicator = parseInt(indicator, 10);
};

AsthmaActionPlanComponent.prototype.setYellowZoneCommentsIndicator = function (indicator) {
    this.yellowZoneCommentsIndicator = parseInt(indicator, 10);
};

AsthmaActionPlanComponent.prototype.setRedZoneCommentsIndicator = function (indicator) {
    this.redZoneCommentsIndicator = parseInt(indicator, 10);
};

AsthmaActionPlanComponent.prototype.setTrigger1Label = function (label) {
    this.trigger1Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger2Label = function (label) {
    this.trigger2Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger3Label = function (label) {
    this.trigger3Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger4Label = function (label) {
    this.trigger4Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger5Label = function (label) {
    this.trigger5Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger6Label = function (label) {
    this.trigger6Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger7Label = function (label) {
    this.trigger7Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger8Label = function (label) {
    this.trigger8Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger9Label = function (label) {
    this.trigger9Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger10Label = function (label) {
    this.trigger10Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger11Label = function (label) {
    this.trigger11Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger12Label = function (label) {
    this.trigger12Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger13Label = function (label) {
    this.trigger13Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger14Label = function (label) {
    this.trigger14Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger15Label = function (label) {
    this.trigger15Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger16Label = function (label) {
    this.trigger16Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger17Label = function (label) {
    this.trigger17Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger18Label = function (label) {
    this.trigger18Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger19Label = function (label) {
    this.trigger19Label = label;
};

AsthmaActionPlanComponent.prototype.setTrigger20Label = function (label) {
    this.trigger20Label = label;
};

AsthmaActionPlanComponent.prototype.setMRNPrintIndicator = function (indicator) {
    this.mrnPrintIndicator = parseFloat(indicator);
};

AsthmaActionPlanComponent.prototype.setACTPrintIndicator = function (indicator) {
    this.actPrintIndicator = parseFloat(indicator);
};

AsthmaActionPlanComponent.prototype.setPeakFlowPrintIndicator = function (indicator) {
    this.peakFlowPrintIndicator = parseFloat(indicator);
};

AsthmaActionPlanComponent.prototype.setEDVisitsPrintIndicator    = function (indicator) {
    this.edVisitsPrintIndicator = parseFloat(indicator);
};

AsthmaActionPlanComponent.prototype.setInpatientStaysPrintIndicator = function (indicator) {
    this.inpatientStaysPrintIndicator = parseFloat(indicator);
};

AsthmaActionPlanComponent.prototype.setAsthmaSeverityPrintIndicator = function (indicator) {
    this.asthmaSeverityPrintIndicator = parseFloat(indicator);
};

AsthmaActionPlanComponent.prototype.setClinicalNoteCodeValue = function (value) {
    this.clinicalNoteCodeValue = parseInt(value, 10);
};

AsthmaActionPlanComponent.prototype.setOtherCELabel = function (label) {
    this.otherCELabel = label;
};

AsthmaActionPlanComponent.prototype.setACTLabel = function (label) {
    this.actLabel = label;
};

AsthmaActionPlanComponent.prototype.setACTRequired = function (val) {
    this.actRequired = parseFloat(val);
};

AsthmaActionPlanComponent.prototype.setPeakFlowLabel = function (label) {
    this.peakFlowLabel = label;
};

AsthmaActionPlanComponent.prototype.setPeakFlowRequired = function (val) {
    this.peakFlowRequired = parseFloat(val) ? true : false;
};

AsthmaActionPlanComponent.prototype.setEDVisitsLabel = function (label) {
    this.edVisitsLabel = label;
};

AsthmaActionPlanComponent.prototype.setEDVisitsRequired = function (val) {
    this.edVisitsRequired = parseFloat(val) ? true : false;
};

AsthmaActionPlanComponent.prototype.setInpatientStaysLabel = function (label) {
    this.inpatientStaysLabel = label
};

AsthmaActionPlanComponent.prototype.setInpatientStaysRequired = function (val) {
    this.inpatientStaysRequired = parseFloat(val) ? true : false;
};

AsthmaActionPlanComponent.prototype.setAsthmaInfantLabel = function (label) {
    this.asthmaInfantLabel = label;
};

AsthmaActionPlanComponent.prototype.setAsthmaInfantRequired = function (val) {
    this.asthmaInfantRequired = parseInt(val, 10) === 1 ? true : false;
};

AsthmaActionPlanComponent.prototype.setAsthmaInfantPrintIndicator = function (val) {
    this.asthmaInfantPrintIndicator = parseFloat(val) ? true : false;
};

AsthmaActionPlanComponent.prototype.setYellowZoneCommentsLabel = function (label) {
    this.yellowZoneCommentsLabel = label;
};

// ***********************
// End of Bedrock Mappings
// ***********************

AsthmaActionPlanComponent.prototype.preProcessing = function () {
    this.setAlwaysExpanded(true);
    this.setPlusAddEnabled(true);
    this.m_isPlusAddCustom = true;
};

AsthmaActionPlanComponent.prototype.retrieveComponentData = function () {
    var parameters = [],
        criterion = this.getCriterion();

    parameters.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", this.getLookbackUnits(), this.getLookbackUnitTypeFlag());

    MP_Core.XMLCclRequestWrapper(this, "inn_advsr_aap_get_instances", parameters, true);
};

AsthmaActionPlanComponent.prototype.renderComponent = function (reply) {
    $("#lookbackContainer" + this.getRenderStrategy().componentId).hide();

    var aapi18n = i18n.innov.asthmaActionPlan,
        aapTable = new ComponentTable();

    aapTable.setNamespace(this.getStyles().getId());
    aapTable.setZebraStripe(true);
	var dateFormatter = MP_Util.GetDateFormatter();
    // transform status into using i18n, value = key
    for (var index = reply.CNT; index--;) {
        reply.QUAL[index].SSTATUS = aapi18n[reply.QUAL[index].SSTATUS];
		reply.QUAL[index].SINSTANCEDATE = dateFormatter.formatISO8601(reply.QUAL[index].DTINSTANCEDATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
    }
	
    var titleColumn = this.buildTableColumn("TITLE_COLUMN", aapi18n.TITLE_COLUMN, "<a href='#'>" + this.actionPlanTitle + "</a>", "aap-title-column");
    var statusColumn = this.buildTableColumn("STATUS_COLUMN", aapi18n.STATUS_COLUMN, "${SSTATUS}");
    statusColumn.setPrimarySortField("SSTATUS");
    statusColumn.setIsSortable(true);
    var actScoreColumn = this.buildTableColumn("ACT_SCORE_COLUMN", this.actLabel.length > 0 ? this.actLabel : aapi18n.ACT_SCORE_COLUMN, "${DACTSCORE}");
    actScoreColumn.setPrimarySortField("DACTSCORE");
    actScoreColumn.setIsSortable(true);
    var infantEventColumn = this.buildTableColumn("INFANT_EVENT_COLUMN", this.asthmaInfantLabel, "${SINFANTEVENT}");
    var peakFlowColumn = this.buildTableColumn("PEAK_FLOW_COLUMN", this.peakFlowLabel, "${DPEAKFLOW}");
    peakFlowColumn.setPrimarySortField("DPEAKFLOW");
    peakFlowColumn.setIsSortable(true);
    var dateColumn = this.buildTableColumn("DATE_COLUMN", aapi18n.DATE_COLUMN, "${SINSTANCEDATE}");

    aapTable.addColumn(titleColumn);
    aapTable.addColumn(statusColumn);
    aapTable.addColumn(dateColumn);
    aapTable.addColumn(actScoreColumn);
    if (this.patientAge <= 4 && this.asthmaInfantLabel.length > 0 && this.asthmaInfantRequired) {
        aapTable.addColumn(infantEventColumn);
    }
    aapTable.addColumn(peakFlowColumn);

    aapTable.setCurrentlySortedBy(function (a, b) {
        return (new Date(b.getResultData().SINSTANCEDATE)).getTime() - (new Date(a.getResultData().SINSTANCEDATE)).getTime();
    });
    aapTable.bindData(reply.QUAL);
    this.setComponentTable(aapTable);

    var componentContent = aapTable.render() + this.buildLinksFooter("aap-component-footer");

    this.finalizeComponent(componentContent, false);

    this.styleInErrorPlans();
    this.setPlanClickHandlers();
    this.setHoverHandlers();
    this.buildHelperFunctions();
};

AsthmaActionPlanComponent.prototype.openTab = function () {
    var parameters = [],
        criterion = this.getCriterion(),
        request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName()),
        categoryMeaning = criterion.category_mean,
        component = this;

    if (categoryMeaning.indexOf("_ssView_") > -1) {
        categoryMeaning = categoryMeaning.slice(0, categoryMeaning.indexOf("_ssView_"));
    }

    parameters.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", "^" + categoryMeaning + "^");

    request.setRequestBlobIn(this.getComponentFiltersJSON());
    request.setProgramName("INN_ADVSR_AAP_GET_DATA");
    request.setParameters(parameters);
    request.setAsync(true);

    MP_Core.XmlStandardRequest(null, request, function (reply) {
        //previous group ID is 0 because it's a new instance
        component.renderAsthmaActionPlan(reply.getResponse(), 0, i18n.innov.asthmaActionPlan[component.STATUS_IN_PROGRESS]);
    });
};

AsthmaActionPlanComponent.prototype.styleInErrorPlans = function () {
    var aapi18n = i18n.innov.asthmaActionPlan,
        inErrorPlans = $.grep(this.m_componentTable.activeRows, function (element) {
            return element.resultData.SSTATUS === aapi18n.INERROR;
        }),
        length = inErrorPlans.length,
        componentHtmlId = this.getStyles().getId();

    for (var index = length; index--;) {
        $("#" + componentHtmlId + "\\:" + inErrorPlans[index].rowId).find(".aap-title-column").html("<span class='aap-label'>" + this.actionPlanTitle + "</span>");
    }
};

AsthmaActionPlanComponent.prototype.setPlanClickHandlers = function () {
    var $rootNode = $(this.getRootComponentNode()),
        component = this;

    $rootNode.on("click", ".aap-title-column", function () { //function (eventObject) {
        if ($(this).hasClass("header-item")) {
            return;
        }

        var rowData = component.getRowData($(this).attr("id"));

        if (rowData.SSTATUS === i18n.innov.asthmaActionPlan.INERROR) {
            return;
        }

        // start the plan launch timer
        component.launchPlanEngTimer = MP_Util.CreateTimer("ENG:MPG.AsthmaActionPlan - launch plan", component.getCriterion().category_mean, rowData.SSTATUS);

        // refresh data if it's an previously in progress instance
        if (rowData.SSTATUS === i18n.innov.asthmaActionPlan.INPROGRESS) {
            component.activeActionPlan = JSON.parse(rowData.SDATA).INSTANCE_DATA;
            component.activePreviousGroupId = rowData.DGROUPID;
            component.refreshMedicationsData();
        } else {
            component.renderAsthmaActionPlan(JSON.parse(rowData.SDATA).INSTANCE_DATA, rowData.DGROUPID, rowData.SSTATUS);
        }

    });
};

// html id follows this form: namespace:row#:COLUMN_NAME
// example ID: aap12079617:row1:TITLE_COLUMN
AsthmaActionPlanComponent.prototype.getRowData = function (htmlId) {
    var rowId = htmlId.slice(htmlId.indexOf(":") + 1, htmlId.lastIndexOf(":"));
    return this.m_componentTable.rowMap[rowId].resultData;
};

AsthmaActionPlanComponent.prototype.setHoverHandlers = function () {
    var component = this,
        timeoutID;

    $("#aap" + this.m_componentId + "tableBody").find("dl").hover(function (hoverStartObject) {
        var rowId = $(this).attr("id") + ":",
            mouseX = hoverStartObject.pageX,
            mouseY = hoverStartObject.pageY + 10,
            rowData = component.getRowData(rowId),
            instanceData = (JSON.parse(rowData.SDATA)).INSTANCE_DATA;

        // action plan hover
        timeoutID = window.setTimeout(function () {
            instanceData.PLAN_DATE = rowData.SINSTANCEDATE;
            var $planHover = $("<div></div>").addClass("aap-plan-hover").html(window.render.aapPlanInformationHover(instanceData));

            if (mouseX > ($(window).width() - 300)) {
                $planHover.css({
                    left: mouseX - 250,
                    top: mouseY
                });
            } else {
                $planHover.css({
                    left: mouseX,
                    top: mouseY
                });
            }

            $planHover.appendTo("body");
        }, 500);

        // in error button
        if (rowData.SSTATUS !== i18n.innov.asthmaActionPlan.INERROR) {
            var $errorIcon = $("<span></span>").addClass("aap-error-icon").on("click", function () { //function (eventObject) {
                if (confirm(i18n.innov.asthmaActionPlan.ERROR_CONFIRM)) {
                    $("body").css("cursor", "wait");

                    component.activeActionPlan = instanceData;
                    component.activePreviousGroupId = rowData.DGROUPID;
                    component.updatePlanInstance(component.STATUS_ERROR, function () {
                        $("body").css("cursor", "default");
                        component.resetActiveActionPlanData();
                        component.retrieveComponentData();
                    });
                }
            });
            $(this).find("dd").last().append($errorIcon);
        }
    }, function () { //function (hoverStopObject) {
        $(this).find(".aap-error-icon").remove();
        window.clearTimeout(timeoutID);
        $(".aap-plan-hover").remove();
    });
};

AsthmaActionPlanComponent.prototype.buildBaseModalPopup = function (status) {
    MP_ModalDialog.deleteModalDialogObject("aapPlanModal");

    var component = this,
        aapi18n = i18n.innov.asthmaActionPlan,
        asthmaActionPlanModal = new ModalDialog("aapPlanModal");

    asthmaActionPlanModal.setShowCloseIcon(false).setHeaderTitle(this.actionPlanTitle);
    asthmaActionPlanModal.setTopMarginPercentage(5).setRightMarginPercentage(5).setLeftMarginPercentage(5).setBottomMarginPercentage(5);

    if (status === aapi18n.INPROGRESS) {
        var footerSignPrint = new ModalButton("signAndPrint");
        footerSignPrint.setText(aapi18n.SIGN_PRINT).setCloseOnClick(false).setOnClickFunction(function () {
            if (!component.performValidation()) {
                alert(aapi18n.VALIDATION_FAILED);
                return;
            }
            var metadata = component.asthmaEducationEventCd > 0 && component.asthmaEducationEventNomenId > 0 ? "education event codes defined" : "education event codes not defined";
            component.signPlanEngTimer = MP_Util.CreateTimer("ENG:MPG.AsthmaActionPlan - sign plan", component.getCriterion().category_mean, metadata);

            component.printPlan(asthmaActionPlanModal);

            MP_ModalDialog.closeModalDialog(asthmaActionPlanModal.getId());
            component.updatePlanInstance(component.STATUS_COMPLETE, function () {
                // Create clinical event
                component.createPrintClinicalEvent(function (reply) {
                    if (component.signPlanEngTimer) {
                        component.signPlanEngTimer.Stop();
                        component.signPlanEngTimer = null;
                    }

                    component.createClinicalNote();
                    component.resetActiveActionPlanData();
                    // refresh data
                    component.retrieveComponentData();
                });
            });
        });
        asthmaActionPlanModal.addFooterButton(footerSignPrint);

        var footerPreview = new ModalButton("preview");
        footerPreview.setText(aapi18n.PREVIEW).setCloseOnClick(false).setOnClickFunction(function () {
            if (component.performValidation()) {
                asthmaActionPlanModal.setBodyHTML(window.render.aapPrintSetup(component.activeActionPlan));
                asthmaActionPlanModal.setFooterButtonDither("preview", true);
            } else {
                alert(aapi18n.VALIDATION_FAILED);
            }
        });
        asthmaActionPlanModal.addFooterButton(footerPreview);

        var footerSave = new ModalButton("save");
        footerSave.setText(aapi18n.SAVE).setCloseOnClick(true).setOnClickFunction(function () {
            component.savePlanEngTimer = MP_Util.CreateTimer("ENG:MPG.AsthmaActionPlan - save plan", component.getCriterion().category_mean);

            $("body").css("cursor", "wait");
            component.updatePlanInstance(component.STATUS_IN_PROGRESS, function () {
                if (component.savePlanEngTimer) {
                    component.savePlanEngTimer.Stop();
                    component.savePlanEngTimer = null;
                }
                component.resetActiveActionPlanData();
                $("body").css("cursor", "default");

                component.retrieveComponentData();
            });
        });
        asthmaActionPlanModal.addFooterButton(footerSave);

    } else if (status === aapi18n.COMPLETE) {

        var footerPrint = new ModalButton("print");
        footerPrint.setText(aapi18n.PRINT).setCloseOnClick(false).setOnClickFunction(function () {
            component.printPlan(asthmaActionPlanModal);

            component.createPrintClinicalEvent(function () {
                component.resetActiveActionPlanData();
                MP_ModalDialog.closeModalDialog(asthmaActionPlanModal.getId());
            });
        });
        asthmaActionPlanModal.addFooterButton(footerPrint);
    }


    var footerCancel = new ModalButton("cancel");
    footerCancel.setText(aapi18n.CANCEL).setCloseOnClick(false).setOnClickFunction(function () {
        if (!component.activePlanEditsFlag || (component.activePlanEditsFlag && confirm(aapi18n.PENDING_DATA))) {
            component.resetActiveActionPlanData();
            MP_ModalDialog.closeModalDialog(asthmaActionPlanModal.getId());
        }
    });
    asthmaActionPlanModal.addFooterButton(footerCancel);

    MP_ModalDialog.addModalDialogObject(asthmaActionPlanModal);
};

AsthmaActionPlanComponent.prototype.printPlan = function (asthmaActionPlanModal) {
    asthmaActionPlanModal.setBodyHTML(window.render.aapPrintSetup(this.activeActionPlan));

    var containerHeight = 750;
    var headerHtml = $("#aapPlanModalbody").find(".aap-print-header").css({ width: "735px" }).html();
    var $element = $("#aapPlanModalbody").find(".aap-print-body").css({ overflow: "hidden" });
    var doc;
    var $iframe = $("<iframe  />");

    $iframe.css({
        position: "absolute",
        left: "-900px",
        top: "-900px",
        width: "735px"
    });

    $iframe.appendTo("body");
    doc = $iframe[0].contentWindow.document;
    $("link").each(function() {
      doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' />");
    });

    $element.width("735px");
    var html = "<div>";
    var pageBreak = "<div style='page-break-after:always;width:735px;clear:both;height:0;display:block;visibility:hidden;'></div>";
    var height = 0;
    var elements = $element.children();

    html += headerHtml;
    for (var index = 0; index < elements.length; index++) {
        if (elements[index].scrollHeight + height >= containerHeight) {
            // new div
            html += pageBreak;
            html += headerHtml;
            height = 0;
        }
        html += elements[index].outerHTML;
        height += elements[index].scrollHeight;
    }
    html += "</div>";

    doc.write(html);
    doc.close();

    $iframe[0].contentWindow.focus();
    setTimeout(function() {
      $iframe[0].contentWindow.print();
      $iframe.detach();
    }, 1000);

    this.printPlanCapTimer = MP_Util.CreateTimer("CAP:MPG.AsthmaActionPlan - print plan", this.getCriterion().category_mean);
    if (this.printPlanCapTimer) {
        this.printPlanCapTimer.Stop();
        this.printPlanCapTimer = null;
    }
};

AsthmaActionPlanComponent.prototype.renderAsthmaActionPlan = function (asthmaDataModel, previousGroupId, actionPlanStatus) {
    this.buildBaseModalPopup(actionPlanStatus);

    var component = this;
    var criterion = this.getCriterion();
    var aapPlanModal = MP_ModalDialog.retrieveModalDialogObject("aapPlanModal");

    asthmaDataModel = this.calculatePeakFlowRanges(asthmaDataModel);
    asthmaDataModel = this.loadLabels(asthmaDataModel);

    // set up partials and helpers
    this.initializeOrderDisplayHelper(asthmaDataModel);

    MP_ModalDialog.closeModalDialog(aapPlanModal.getId());

    this.activeActionPlan = asthmaDataModel;
    this.activePreviousGroupId = previousGroupId;

    aapPlanModal.setBodyDataFunction(function (modalObj) {
        if (actionPlanStatus === i18n.innov.asthmaActionPlan.COMPLETE) {
            modalObj.setBodyHTML(window.render.aapPrintSetup(asthmaDataModel));
        } else if (actionPlanStatus === i18n.innov.asthmaActionPlan.INPROGRESS) {
            modalObj.setBodyHTML(window.render.aapSetup(asthmaDataModel));
        }

        $("#" + modalObj.getFooterElementId()).append(component.buildLinksFooter("aap-plan-footer"));
    });

    MP_ModalDialog.updateModalDialogObject(aapPlanModal);
    MP_ModalDialog.showModalDialog("aapPlanModal");

    var $modalBody = $("#aapPlanModalbody");
    // ensure left columns are at least as tall as the right columns
    $.each($modalBody.find(".aap-zone-body"), function (index, value) {
        var $val = $(value), $leftColumn = $val.find(".aap-col-one-third"), $rightColumn = $val.find(".aap-col-two-thirds");
        if ($leftColumn.outerHeight() < $rightColumn.outerHeight()) {
            $leftColumn.height($rightColumn.height());
        }
    });

    // powerform links
    $modalBody.find(".aap-powerform-links").on("click", ".aap-powerform-link", function () { //function (eventObject) {
        var powerFormId = $(this).attr("data-powerform-id");
        component.launchPowerForm(powerFormId, function () {
            component.refreshClinicalEventData();
        });
    }).on("click", ".aap-refresh-link", function () { //function (eventObject) {
        component.refreshMedicationsData();
    }).on("click", ".aap-form-browser-link", function () {
        var formBrowserName = $(this).attr("data-tab-name");
        $("body").css("cursor", "wait");
        component.updatePlanInstance(component.STATUS_IN_PROGRESS, function () {
            component.resetActiveActionPlanData();
            $("body").css("cursor", "default");
            MP_ModalDialog.closeModalDialog(aapPlanModal.getId());
            component.retrieveComponentData();
            APPLINK(0, criterion.executable, "/PERSONID=" + criterion.person_id + ".0" + " /ENCNTRID=" + criterion.encntr_id + ".0" + "/FIRSTTAB=^" + formBrowserName + "^");
        });
    }).on("click", ".aap-moew-link", function () {
        var PowerOrdersMPageUtils = window.external.DiscernObjectFactory("POWERORDERS");
        var hMOEW = PowerOrdersMPageUtils.CreateMOEW(parseFloat(criterion.person_id), parseFloat(criterion.encntr_id), 0, 2, 127);
        PowerOrdersMPageUtils.DisplayMOEW(hMOEW);
        PowerOrdersMPageUtils.DestroyMOEW(hMOEW);
        component.refreshMedicationsData();
    });

    // meds checkboxes
    $modalBody.find(".aap-zone-body").on("click", ".aap-medication-selector", function () { //function (eventObject) {
        var $med = $(this).parent(),
            orderId = $med.attr("data-order-id"),
            section = $med.parent().attr("data-section-attribute"),
            zone = $med.parentsUntil(".aap-zone-body").parent().attr("data-zone-attribute");

        $med.find(".aap-required-freetext").toggle();
        component.toggleMedSelected(zone, section, orderId);
        // check age for spacer
        if (component.patientAge <= component.spacerUpperAge && component.patientAge >= component.spacerLowerAge) {
            $med.find(".aap-spacer-administration").prop("checked", true).trigger("change");
        }
    }).on("change", ".aap-spacer-administration", function () {
        var $med = $(this).parentsUntil(".aap-medication").parent(),
            orderId = $med.attr("data-order-id"),
            section = $med.parent().attr("data-section-attribute"),
            zone = $med.parentsUntil(".aap-zone-body").parent().attr("data-zone-attribute");

        component.toggleSpacerSelected(zone, section, orderId);
    });


    if (this.activeActionPlan.GREEN_ZONE.MEDS_REQUIRED === 0) {
        this.toggleZoneMedsVisibility($modalBody, 1);
    }
    if (this.activeActionPlan.YELLOW_ZONE.MEDS_REQUIRED === 0) {
        this.toggleZoneMedsVisibility($modalBody, 2);
    }
    if (this.activeActionPlan.RED_ZONE.MEDS_REQUIRED === 0) {
        this.toggleZoneMedsVisibility($modalBody, 3);
    }
    if (this.activeActionPlan.FOOTER.FOLLOW_IN_IND === 1) {
        $modalBody.find("select.aap-follow-up").val(this.activeActionPlan.FOOTER.FOLLOW_UP);
    }

    // school authorization precheck
    if (this.patientAge < this.SCHOOL_AUTH_AGE_LIMIT) {
        $modalBody.find(".aap-school-authorization").prop("checked", true);
        this.activeActionPlan.FOOTER.AUTHORIZATION_NEEDED = 1;
    }

    // med comments changes
    $modalBody.on("change", ".aap-dose-route", function () { //function (eventObject){
        var $med = $(this).parent().parent(),
            orderId = $med.attr("data-order-id"),
            section = $med.parent().attr("data-section-attribute"),
            zone = $med.parentsUntil(".aap-zone-body").parent().attr("data-zone-attribute");

        component.setMedComments(zone, section, orderId, $(this).val());
    });

    $modalBody.on("change", ".aap-special-instructions", function () { //function (eventObject) {
        if ($(this).parentsUntil(".aap-zone-body").parent().attr("data-zone-attribute") == "YELLOW_ZONE") {
            component.setSymptomsPersistInstructions($(this).val());
        } else {
            component.setNonZoneInstructions($(this).val());
        }
    });

    $modalBody.on("change", ".aap-zone-comments", function () { //function (eventObject) {
        component.setZoneComments($(this).val(), $(this).parentsUntil(".aap-zone-body").parent().attr("data-zone-attribute"));
    });

    // section meds required
    $modalBody.on("change", "input[name='aap-green-meds-required']", function () { //function (eventObject) {
        component.toggleZoneMedsRequiredIndicator("GREEN_ZONE");
        component.toggleZoneMedsVisibility($modalBody, 1);
    });
    $modalBody.on("change", "input[name='aap-yellow-meds-required']", function () { //function (eventObject) {
        component.toggleZoneMedsRequiredIndicator("YELLOW_ZONE");
        component.toggleZoneMedsVisibility($modalBody, 2);
    });
    $modalBody.on("change", "input[name='aap-red-meds-required']", function () { //function (eventObject) {
        component.toggleZoneMedsRequiredIndicator("RED_ZONE");
        component.toggleZoneMedsVisibility($modalBody, 3);
    });

    $modalBody.on("click", ".aap-add-medications", function () { //function (eventObject) {
        var $target = $(this),
            section = $target.parent().attr("data-section-attribute"),
            zone = $target.parentsUntil(".aap-zone-body").parent().attr("data-zone-attribute");

        component.loadActiveMedications(zone, section);
    });

    $modalBody.find("#aap-datepicker").datepicker({ minDate: 0 });

    // follow up section
    $modalBody.on("click", ".aap-follow-up", function () { //function (eventObject) {
        // select appropriate radio button automatically
        $(this).parent().find("input[name='aap-follow-up-rb']").prop("checked", true).trigger("change");

        // clear other selections
        $modalBody.find(".aap-follow-up").not($(this)).each(function (index, element) {
            if (element.nodeName === "SELECT") {
                $(element).val('0');
            } else if (element.nodeName === "INPUT") {
                $(element).val("");
            }
        });
    });

    $modalBody.on("change", ".aap-follow-up", function () { //function (eventObject) {
        component.setFollowUpText($(this).val());
    });
    $modalBody.on("change", "input[name='aap-follow-up-rb']", function () { //function (eventObject) {
        component.setFollowUpIndicator($(this).parent().attr("data-follow-attribute"));
    });
    $modalBody.on("change", ".aap-school-authorization", function () { //function (eventObject) {
        component.activeActionPlan.FOOTER.AUTHORIZATION_NEEDED = $(this).prop("checked") ? 1 : 0;
    });

    $modalBody.on("change", "input", function () { //function (eventObject) {
        component.activePlanEditsFlag = true;
    });

    // circumvent default "enter" behavior in IE
    $modalBody.on("keydown", "input", function (keyDownEvent) {
        keyDownEvent = keyDownEvent || window.event;
        var charCode = (keyDownEvent.which) ? keyDownEvent.which : keyDownEvent.keyCode;
        if (charCode == 13) {
            keyDownEvent.stopPropagation();
            keyDownEvent.preventDefault();
            return;
        }
    });


    // stop launch plan timer
    if (this.launchPlanEngTimer) {
        this.launchPlanEngTimer.Stop();
        this.launchPlanEngTimer = null;
    }
};

AsthmaActionPlanComponent.prototype.filterMedicationList = function (originalList, excludeList) {
    var filteredList = [];
    var origOrder;
    var excludeInd;
    // loop through original list, remove exclusions and build filtered list
    for (var origIndex = 0, origLength = originalList.length; origIndex < origLength; origIndex++) {
        excludeInd = false;
        origOrder = originalList[origIndex];
        for (var excludeIndex = 0, excludeLength = excludeList.length; excludeIndex < excludeLength; excludeIndex++) {
            if (origOrder.ORDER_ID === excludeList[excludeIndex].ORDER_ID) {
                excludeInd = true;
                break;
            }
        }
        if (!excludeInd) {
            filteredList[filteredList.length] = origOrder;
        }
    }
    return filteredList;
};

AsthmaActionPlanComponent.prototype.loadActiveMedications = function (zone, section) {
    var parameters = [],
        criterion = this.getCriterion(),
        request = new MP_Core.ScriptRequest(),
        aapi18n = i18n.innov.asthmaActionPlan;

    parameters.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0");

    request.setProgramName("INN_ADVSR_AAP_GET_HX_MEDS");
    request.setParameters(parameters);
    request.setAsync(true);

    var component = this;
    MP_Core.XmlStandardRequest(null, request, function (reply) {
        var meds = reply.getResponse(),
            selectModal = new ModalDialog("medSelectModal"),
            currentMedList = component.activeActionPlan[zone].SECTIONS[section].MEDICATIONS;

        // filter add medications list to exclude current medication list
        meds.ORDERS = component.filterMedicationList(meds.ORDERS, currentMedList);
        meds.ZONE = zone;
        meds.SECTION = section;

        selectModal.setHeaderTitle(aapi18n.MED_SELECT_HEADER);
        selectModal.setTopMarginPercentage(20).setRightMarginPercentage(25).setLeftMarginPercentage(25).setBottomMarginPercentage(15);

        var selectSubmit = new ModalButton("selectSubmit");
        selectSubmit.setText(aapi18n.SELECT_SUBMIT).setCloseOnClick(false).setOnClickFunction(function () {
            var $container = $("#medSelectModalbody").find(".aap-multi-select"),
                $selectedMeds = $container.find(":selected"),
                medZone = $container.attr("data-zone-attribute"),
                medSection = $container.attr("data-section-attribute"),
                length = $selectedMeds.length,
                medIndex = 0,
                latch = true,
                orderIndex;

            // add each selected med to the zone we're in
            // add the order info to orders_details and adhoc_orders
            for (var index = length; index--;) {
                medIndex = $selectedMeds[index].value;
                component.activeActionPlan[medZone].SECTIONS[medSection].MEDICATIONS.push({
                    SELECTED_IND: 1,
                    COMMENTS: meds.ORDERS[medIndex].SIMPLIFIED_DISPLAY_LINE,
                    ORDER_ID: meds.ORDERS[medIndex].ORDER_ID
                });

                // add to the order details section if we aren't duplicating
                latch = true;
                for (orderIndex = component.activeActionPlan.ORDERS_DETAILS.length; orderIndex--;) {
                    if (component.activeActionPlan.ORDERS_DETAILS[orderIndex].ORDER_ID === meds.ORDERS[medIndex].ORDER_ID) {
                        latch = false;
                        break;
                    }
                }
                if (latch) {
                    component.activeActionPlan.ORDERS_DETAILS.push(meds.ORDERS[medIndex]);
                }

            }
            component.updateZoneSectionMedsDisplay(medZone);

            MP_ModalDialog.closeModalDialog("medSelectModal");
            MP_ModalDialog.deleteModalDialogObject("medSelectModal");
        });
        selectModal.addFooterButton(selectSubmit);

        var selectCancel = new ModalButton("cancel");
        selectCancel.setText(aapi18n.CANCEL).setCloseOnClick(false).setOnClickFunction(function () {
            MP_ModalDialog.closeModalDialog("medSelectModal");
            MP_ModalDialog.deleteModalDialogObject("medSelectModal");
        });
        selectModal.addFooterButton(selectCancel);

        selectModal.setBodyDataFunction(function (modalObj) {
            modalObj.setBodyHTML(window.render.aapActiveMedicationsSelector(meds));
        });
        MP_ModalDialog.addModalDialogObject(selectModal);
        MP_ModalDialog.showModalDialog("medSelectModal");
    });
};

AsthmaActionPlanComponent.prototype.updateZoneSectionMedsDisplay = function (zone) {
    var component = this;
    var $zoneBody = $("#aapPlanModalbody").find(".aap-zone-body").filter(function (index) {
        return $(this).attr("data-zone-attribute") === zone;
    });

    if (zone === "GREEN_ZONE") {
        $("#aapPlanModalbody").find(".aap-green-zone-header").detach();
        component.renderZoneMeds(window.render.aapGreenZone(this.activeActionPlan.GREEN_ZONE), $zoneBody);
    } else if (zone === "YELLOW_ZONE") {
        $("#aapPlanModalbody").find(".aap-yellow-zone-header").detach();
        component.renderZoneMeds(window.render.aapYellowZone(this.activeActionPlan.YELLOW_ZONE), $zoneBody);
    } else if (zone === "RED_ZONE") {
        $("#aapPlanModalbody").find(".aap-red-zone-header").detach();
        component.renderZoneMeds(window.render.aapRedZone(this.activeActionPlan.RED_ZONE), $zoneBody);
    }
    $zoneBody.detach();
};

AsthmaActionPlanComponent.prototype.renderZoneMeds = function (html, $zoneBody) {
    var component = this;

    $(html).insertAfter($zoneBody).on("click", ".aap-medication-selector", function () {
        var $med = $(this).parent(),
            orderId = $med.attr("data-order-id"),
            section = $med.parent().attr("data-section-attribute"),
            zone = $med.parentsUntil(".aap-zone-body").parent().attr("data-zone-attribute");

        $med.find(".aap-required-freetext").toggle();
        component.toggleMedSelected(zone, section, orderId);
        // check age for spacer
        if (component.patientAge <= component.spacerUpperAge && component.patientAge >= component.spacerLowerAge) {
            $med.find(".aap-spacer-administration").prop("checked", true).trigger("change");
        }
    }).on("change", ".aap-spacer-administration", function () {
        var $med = $(this).parentsUntil(".aap-medication").parent(),
            orderId = $med.attr("data-order-id"),
            section = $med.parent().attr("data-section-attribute"),
            zone = $med.parentsUntil(".aap-zone-body").parent().attr("data-zone-attribute");

        component.toggleSpacerSelected(zone, section, orderId);
    });
};

AsthmaActionPlanComponent.prototype.updatePlanInstance = function (status, callbackFn) {
    var criterion = this.getCriterion(),
        instance_data = { "INSTANCE_DATA": this.activeActionPlan };

    MpageAdvisorEvent.getInstance().addAdvisorGroup(
        criterion.person_id,
        criterion.encntr_id,
        this.activePreviousGroupId,
        this.ADVSR_TYPE_MEANING,
        status,
        this.DESCRIPTION,
        instance_data,
        callbackFn
    );
};

AsthmaActionPlanComponent.prototype.toggleMedSelected = function (zone, section, orderId) {
    var meds = this.activeActionPlan[zone].SECTIONS[section].MEDICATIONS;
    for (var index = meds.length; index--;) {
        if (meds[index].ORDER_ID == orderId) {
            // invert selection
            meds[index].SELECTED_IND = meds[index].SELECTED_IND ? 0 : 1;
            return;
        }
    }
};

AsthmaActionPlanComponent.prototype.toggleSpacerSelected = function (zone, section, orderId) {
    var meds = this.activeActionPlan[zone].SECTIONS[section].MEDICATIONS;

    for (var index =  meds.length; index--;) {
        if (meds[index].ORDER_ID == orderId) {
            //invert selection
            meds[index].SPACER_IND = meds[index].SPACER_IND ? 0 : 1;
        }
    }
};

AsthmaActionPlanComponent.prototype.setMedComments = function (zone, section, orderId, value) {
    var meds = this.activeActionPlan[zone].SECTIONS[section].MEDICATIONS;
    for (var index = meds.length; index--;) {
        if (meds[index].ORDER_ID == orderId) {
            meds[index].COMMENTS = value;
            return;
        }
    }
};

AsthmaActionPlanComponent.prototype.setFollowUpText = function (text) {
    this.activeActionPlan.FOOTER.FOLLOW_UP = text;
};

AsthmaActionPlanComponent.prototype.setFollowUpIndicator = function (activeIndicatorKey) {
    var data = this.activeActionPlan.FOOTER;
    data.FOLLOW_IN_IND = 0;
    data.FOLLOW_ON_IND = 0;
    data.FOLLOW_OTHER_IND = 0;
    data[activeIndicatorKey] = 1;
};

AsthmaActionPlanComponent.prototype.toggleZoneMedsRequiredIndicator = function (zone) {
    // invert selection
    this.activeActionPlan[zone].MEDS_REQUIRED = this.activeActionPlan[zone].MEDS_REQUIRED ? 0 : 1;
};

AsthmaActionPlanComponent.prototype.setSymptomsPersistInstructions = function (instructions) {
    this.activeActionPlan.YELLOW_ZONE.SPECIAL_INSTRUCTIONS = instructions;
};

AsthmaActionPlanComponent.prototype.setNonZoneInstructions = function (instructions) {
    this.activeActionPlan.FOOTER.INSTRUCTIONS = instructions;
};

AsthmaActionPlanComponent.prototype.setZoneComments = function (comments, zone) {
    this.activeActionPlan[zone].COMMENTS = comments;
};

AsthmaActionPlanComponent.prototype.buildLinksFooter = function (cssClass) {
    var html = [],
        index,
        patientLinks = this.patientDisplayLinks,
        patientLinksLength = this.patientDisplayLinks.length,
        refLinks = this.referenceDisplayLinks,
        refLinksLength = this.referenceDisplayLinks.length;

    html += "<div class='" + cssClass + "'>";
    for (index = 0; index < refLinksLength; index++) {
        html += "<a href='javascript:APPLINK(100,\"" + refLinks[index].url + "\", \"\")'>" + refLinks[index].display + "</a>";
    }
    for (index = 0; index < patientLinksLength; index++) {
        html += "<a href='javascript:APPLINK(100, \"" + patientLinks[index].url + "\", \"\")'>" + patientLinks[index].display + "</a>";
    }
    html += "</div>";

    return html;
};

AsthmaActionPlanComponent.prototype.buildHelperFunctions = function () {
    var aapi18n = i18n.innov.asthmaActionPlan;
    var component = this;
    window.render = window.render || {};

    window.render.aapActionPlanTitle = function () {
        return component.actionPlanTitle;
    };

    window.render.aapSetup = function (data) {
        var html = [];
        html.push(window.render.aapGeneralInformation(data.GENERAL_INFORMATION));
        html.push(window.render.aapGreenZone(data.GREEN_ZONE));
        html.push(window.render.aapYellowZone(data.YELLOW_ZONE));
        html.push(window.render.aapRedZone(data.RED_ZONE));
        html.push(window.render.aapFooter(data.FOOTER));

        return html.join("");
    };

    window.render.aapPowerformLinks = function () {
        var html = [];
        if (component.infantPowerFormId > 0 && component.patientAge < 4) {
            html.push("<a class=\"aap-powerform-link\" data-powerform-id=\"", component.infantPowerFormId, "\" href=\"#\">", component.infantPowerFormLabel, "</a>");
        }
        if (component.pediatricPowerFormId > 0 && component.patientAge >= 4 && component.patientAge < 12) {
            html.push("<a class=\"aap-powerform-link\" data-powerform-id=\"", component.pediatricPowerFormId, "\" href=\"#\">", component.pediatricPowerFormLabel, "</a>");
        }
        if (component.adultPowerFormId > 0 && component.patientAge >= 12) {
            html.push("<a class=\"aap-powerform-link\" data-powerform-id=\"", component.adultPowerFormId, "\" href=\"#\">", component.adultPowerFormLabel, "</a>");
        }
        if (component.doc1PowerFormId > 0) {
            html.push("<a class=\"aap-powerform-link\" data-powerform-id=\"", component.doc1PowerFormId, "\" href=\"#\">", component.doc1PowerFormLabel, "</a>");
        }
        if (component.doc2PowerFormId > 0) {
            html.push("<a class=\"aap-powerform-link\" data-powerform-id=\"", component.doc2PowerFormId, "\" href=\"#\">", component.doc2PowerFormLabel, "</a>");
        }
        if (component.doc3PowerFormId > 0) {
            html.push("<a class=\"aap-powerform-link\" data-powerform-id=\"", component.doc3PowerFormId, "\" href=\"#\">", component.doc3PowerFormLabel, "</a>");
        }
        if (component.doc4PowerFormId > 0) {
            html.push("<a class=\"aap-powerform-link\" data-powerform-id=\"", component.doc4PowerFormId, "\" href=\"#\">", component.doc4PowerFormLabel, "</a>");
        }
        if (component.formBrowserName.length > 0) {
            html.push("<a class=\"aap-form-browser-link\" data-tab-name=\"", component.formBrowserName, "\" href=\"#\">", component.formBrowserName, "</a>");
        }


        html.push("<a class=\"aap-refresh-link\" href=\"#\">", aapi18n.REFRESH, "</a>");
        html.push("<a class=\"aap-moew-link\" href=\"#\">", aapi18n.MOEW, "</a>");

        return html.join("");
    };

    var triggerSpriteHashMap = {
        "GREEN_ICON": "aap-green-icon",
        "YELLOW_ICON": "aap-yellow-icon",
        "RED_ICON": "aap-red-icon"
    };

    window.render.aapIcons = function (key) {
        var html = "",
            staticContent = component.getCriterion().static_content;

        if (key && key !== "TRIGGER_OTHER") {
            html = "<img src='" + staticContent + "/images/" + triggerSpriteHashMap[key] + ".png'></span>";
        }

        return html;
    };

    var request = new MP_Core.ScriptRequest();
        request.setProgramName("INN_ADVSR_AAP_GET_SCHOOL_AUTH");
        request.setAsync(true);
        request.setParameters(["^MINE^"]);

    MP_Core.XmlStandardRequest(null, request, function (reply) {
        var auth = (reply.getResponse()).LONG_TEXT;
        if (auth.length > 0) {
            component.schoolAuthorizationSection = auth;
        }
    });

    window.render.aapPrintSettings = function (key) {
        var display = "";

        switch (key) {
            case "MRN_PRINT":
                display = component.mrnPrintIndicator;
                break;
            case "ACT_PRINT":
                display = component.actPrintIndicator;
                break;
            case "PEAK_FLOW_PRINT":
                display = component.peakFlowPrintIndicator;
                break;
            case "ED_VISITS_PRINT":
                display = component.edVisitsPrintIndicator;
                break;
            case "INP_STAYS_PRINT":
                display = component.inpatientStaysPrintIndicator;
                break;
            case "ASTHMA_SEV_PRINT":
                display = component.asthmaSeverityPrintIndicator;
                break;
            case "PLAN_DATE":
                if (component.activeActionPlan.GENERAL_INFORMATION.PLAN_DATE.length == 0) {
                    var formatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                    component.activeActionPlan.GENERAL_INFORMATION.PLAN_DATE = formatter.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                }
                display = component.activeActionPlan.GENERAL_INFORMATION.PLAN_DATE;
                break;
            case "SCHOOL_AUTH":
                if (component.schoolAuthorizationSection.length > 0) {
                    display = component.schoolAuthorizationSection;
                } else {
                    display = 0;
                }
                break;
            case "INFANT_PRINT":
                if (component.asthmaInfantPrintIndicator) {
                    display = component.asthmaInfantLabel;
                } else {
                    display = 0;
                }
        }

        return display;
    };

    window.render.aapTriggerLabels = function (meaning) {
        var display = "undefined";
        switch (meaning) {
            case "TRIGGER_DANDER":
                display = component.trigger1Label;
                break;
            case "TRIGGER_CIGARETTE":
                display = component.trigger2Label;
                break;
            case "TRIGGER_STRESS":
                display = component.trigger3Label;
                break;
            case "TRIGGER_EXERCISE":
                display = component.trigger4Label;
                break;
            case "TRIGGER_COLD":
                display = component.trigger5Label;
                break;
            case "TRIGGER_DUST":
                display = component.trigger6Label;
                break;
            case "TRIGGER_POLLEN":
                display = component.trigger7Label;
                break;
            case "TRIGGER_ANIMAL":
                display = component.trigger8Label;
                break;
            case "TRIGGER_MICE":
            case "TRIGGER_MICE_RESULT":
                display = component.trigger9Label;
                break;
            case "TRIGGER_MOLD":
                display = component.trigger10Label;
                break;
            case "TRIGGER_SMOKE":
                display = component.trigger11Label;
                break;
            case "TRIGGER_12":
                display = component.trigger12Label;
                break;
            case "TRIGGER_13":
                display = component.trigger13Label;
                break;
            case "TRIGGER_14":
                display = component.trigger14Label;
                break;
            case "TRIGGER_15":
                display = component.trigger15Label;
                break;
            case "TRIGGER_16":
                display = component.trigger16Label;
                break;
            case "TRIGGER_17":
                display = component.trigger17Label;
                break;
            case "TRIGGER_18":
                display = component.trigger18Label;
                break;
            case "TRIGGER_19":
                display = component.trigger19Label;
                break;
            case "TRIGGER_20":
                display = component.trigger20Label;
                break;
        }

        return display;
    };

    // method to render follow in options from lookback configurations
    window.render.aapBuildFollowInOptions = function () {
        var html = "",
            lookbackOptions = component.getLookbackMenuItems(),
            item,
            lookbackValue,
            lookbackUnitMeaning;
        if (lookbackOptions && lookbackOptions.length) {
            for (var index = 0; index < lookbackOptions.length; index++) {
                item = lookbackOptions[index];
                // get the lookback description and units
                // check for old version of lookback object
                if (item.getDescription) {
                    lookbackValue = item.getDescription()
                } else {
                    lookbackValue = item.getUnits();
                }
                // check for old version of lookback object
                if (item.getMeaning) {
                    lookbackUnitMeaning = item.getMeaning();
                } else {
                    switch (item.getType()) {
                        case 0:
                            lookbackUnitMeaning = undefined;
                            break;
                        case 1:
                            lookbackUnitMeaning = "HOURS";
                            break;
                        case 2:
                            lookbackUnitMeaning = "DAYS";
                            break;
                        case 3:
                            lookbackUnitMeaning = "WEEKS";
                            break;
                        case 4:
                            lookbackUnitMeaning = "MONTHS";
                            break;
                        case 5:
                            lookbackUnitMeaning = "YEARS";
                            break;
                    }
                }

                if (lookbackUnitMeaning === undefined) {
                    html = "<option></option>" + html;
                } else {
                    html += "<option value='" + lookbackValue + " " + aapi18n[lookbackUnitMeaning] + "'>" + lookbackValue + " " + aapi18n[lookbackUnitMeaning] + "</option>";
                }
            }
        }
        return html;
    };
};

AsthmaActionPlanComponent.prototype.launchPowerForm = function (powerFormId, callbackFn) {
    var criterion = this.getCriterion(),
        discernPowerForms = window.external.DiscernObjectFactory("POWERFORM");

    if (discernPowerForms && typeof discernPowerForms.OpenForm !== "undefined") {
        discernPowerForms.OpenForm(criterion.person_id, criterion.encntr_id, powerFormId, 0, 0);
    }
    callbackFn();
};

AsthmaActionPlanComponent.prototype.refreshClinicalEventData = function () {
    var criterion = this.getCriterion(),
        categoryMeaning = criterion.category_mean;
    if (categoryMeaning.indexOf("_ssView_") > -1) {
        categoryMeaning.slice(0, categoryMeaning.indexOf("_ssView_"));
    }

    var parameters = ["^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", "^" + categoryMeaning + "^"],
        request = new MP_Core.ScriptRequest(),
        component = this;

    request.setRequestBlobIn(this.getComponentFiltersJSON());
    request.setProgramName("INN_ADVSR_AAP_GET_CLIN_EVENTS");
    request.setParameters(parameters);
    request.setAsync(true);

    MP_Core.XmlStandardRequest(null, request, function (reply) {
        var clinicalData = reply.getResponse();
        component.activeActionPlan.GENERAL_INFORMATION = clinicalData.GENERAL_INFORMATION;
        component.renderAsthmaActionPlan(component.activeActionPlan, component.activePreviousGroupId, i18n.innov.asthmaActionPlan[component.STATUS_IN_PROGRESS]);
    });
};

AsthmaActionPlanComponent.prototype.createPrintClinicalEvent = function (callBack) {
    if (this.asthmaEducationEventCd === 0 || this.asthmaEducationEventNomenId === 0) {
        callBack();
        return;
    }

    var criterion = this.getCriterion(),
        parameters = [],
        parmeterRequestJSON = [],
        request = new MP_Core.ScriptRequest();

    parmeterRequestJSON = ["{",
            "\"NOMEN_REQUEST\": {",
                "\"LIST\": [{",
                    "\"INPUTPERSONID\": " + criterion.person_id + ".000000,",
                    "\"INPUTPROVIDERID\": " + criterion.provider_id + ".000000,",
                    "\"INPUTENCOUNTERID\": " + criterion.encntr_id + ".000000,",
                    "\"INPUTEVENTCD\": " + this.asthmaEducationEventCd + ".000000,",
                    "\"ENDDTTM\": \"\",",
                    "\"INPUTNOMENCLATUREID\": [{",
                        "\"NOMID\": " + this.asthmaEducationEventNomenId + ".000000",
                    "}],",
                    "\"INPUTFREETEXT\": \"\",",
                    "\"INPUTPPR\": 0.000000,",
                    "\"TASKASSAYCD\": 0.000000",
                "}]",
            "}",
        "}"].join("");
    parameters = ["^MINE^", "@" + parmeterRequestJSON.length + ":" + parmeterRequestJSON + "@"];

    request.setProgramName("INN_ADVSR_AAP_ADD_EDU_EVENT");
    request.setParameters(parameters);
    request.setAsync(true);

    MP_Core.XmlStandardRequest(null, request, function (reply) {
        callBack(reply.getResponse());
    });
};

AsthmaActionPlanComponent.prototype.createClinicalNote = function () {

    if (this.clinicalNoteCodeValue === 0) {
        return;
    }

    var criterion = this.getCriterion(),
        request = new MP_Core.ScriptRequest(),
        clinicalNote = window.render.aapClinicalNote(this.activeActionPlan),
        parameters = [];

    parameters.push("^MINE^", criterion.person_id + ".0", criterion.provider_id + ".0", criterion.encntr_id + ".0");
    parameters.push(criterion.ppr_cd + ".0", this.clinicalNoteCodeValue + ".0");
    parameters.push("^" + this.actionPlanTitle + "^", "^" + clinicalNote + "^");

    request.setProgramName("INN_ADVSR_AAP_ADD_DOC");
    request.setParameters(parameters);
    request.setAsync(true);

    MP_Core.XmlStandardRequest(null, request, function (reply) {
        // reply.getResponse()
    });
};

AsthmaActionPlanComponent.prototype.refreshMedicationsData = function () {
    var parameters = [],
        criterion = this.getCriterion(),
        encounters = (criterion.getPersonnelInfo()).getViewableEncounters(),
        request = new MP_Core.ScriptRequest(),
        categoryMeaning = criterion.category_mean,
        orderList = JSON.stringify({
            "AAP_ORDERS_LIST": {
                "LAST_REFRESH_DT_TM": this.activeActionPlan.LAST_ORDERS_UPDATE_DT_TM,
                "ORDERS_DETAILS": this.activeActionPlan.ORDERS_DETAILS,
                "EXISTING_ORDERS": this.buildExistingOrders()
            }
        });

    if (categoryMeaning.indexOf("_ssView_") > -1) {
        categoryMeaning = categoryMeaning.slice(0, categoryMeaning.indexOf("_ssView_"));
    }
    encounters = encounters ? "value(" + encounters + ")" : "0.0";

    parameters.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id + ".0", "^" + categoryMeaning + "^");

    if (!CERN_BrowserDevInd) {
        parameters.push("@" + orderList.length + ":" +  orderList + "@");
    }

    request.setRequestBlobIn(this.getComponentFiltersJSON());
    request.setProgramName("INN_ADVSR_AAP_GET_DATA");
    request.setParameters(parameters);
    request.setAsync(true);

    var component = this;

    MP_Core.XmlStandardRequest(null, request, function (reply) {
        var newData = reply.getResponse();
        component.activeActionPlan.LAST_ORDERS_UPDATE_DT_TM = newData.LAST_ORDERS_UPDATE_DT_TM
        component.activeActionPlan.GENERAL_INFORMATION = newData.GENERAL_INFORMATION;
        component.activeActionPlan.ORDERS_DETAILS = newData.ORDERS_DETAILS;
        component.updateZoneAsthmaMeds(newData);

        component.renderAsthmaActionPlan(component.activeActionPlan, component.activePreviousGroupId, i18n.innov.asthmaActionPlan[component.STATUS_IN_PROGRESS]);
    });
};

AsthmaActionPlanComponent.prototype.buildExistingOrders = function () {
    function getZoneOrder (meds, orderId) {
        return $.grep(meds, function (med) {
            return med.ORDER_ID === orderId;
        });
    }

    function getZoneSelectedInd (meds, orderId) {
        var order = getZoneOrder(meds, orderId);
        if (order.length > 0) {
            return order[0].SELECTED_IND;
        } else {
            return 0;
        }
    }

    function getZoneComments (meds, orderId) {
        var order = getZoneOrder(meds, orderId);
        if (order.length > 0) {
            return order[0].COMMENTS;
        } else {
            return "";
        }
    }

    function getZoneSpacerInd (meds, orderId) {
        var order = getZoneOrder(meds, orderId);
        if (order.length > 0) {
            return order[0].SPACER_IND;
        } else {
            return 0;
        }
    }

    function getZoneInd (meds, orderId) {
        return getZoneOrder(meds, orderId).length > 0 ? 1 : 0;
    }

    var existingOrdersData = [];
    var orders = this.activeActionPlan.ORDERS_DETAILS;
    var greenZoneMeds = this.activeActionPlan.GREEN_ZONE.SECTIONS.DAILY.MEDICATIONS;
    var yellowZoneMeds = this.activeActionPlan.YELLOW_ZONE.SECTIONS.RELIEF.MEDICATIONS;
    var redZoneMeds = this.activeActionPlan.RED_ZONE.SECTIONS.EMERGENCY.MEDICATIONS;
    var curOrderId;

    for (var index = orders.length; index--;) {
        curOrderId = orders[index].ORDER_ID;
        existingOrdersData.push({
            "ORDER_ID": curOrderId,
            "GREEN_IND": getZoneInd(greenZoneMeds, curOrderId),
            "GREEN_SELECTED_IND": getZoneSelectedInd(greenZoneMeds, curOrderId),
            "GREEN_COMMENTS": getZoneComments(greenZoneMeds, curOrderId),
            "GREEN_SPACER_IND": getZoneSpacerInd(greenZoneMeds, curOrderId),
            "YELLOW_IND": getZoneInd(yellowZoneMeds, curOrderId),
            "YELLOW_SELECTED_IND": getZoneSelectedInd(yellowZoneMeds, curOrderId),
            "YELLOW_COMMENTS": getZoneComments(yellowZoneMeds, curOrderId),
            "YELLOW_SPACER_IND": getZoneSpacerInd(yellowZoneMeds, curOrderId),
            "RED_IND": getZoneInd(redZoneMeds, curOrderId),
            "RED_SELECTED_IND": getZoneSelectedInd(redZoneMeds, curOrderId),
            "RED_COMMENTS": getZoneComments(redZoneMeds, curOrderId),
            "RED_SPACER_IND": getZoneSpacerInd(redZoneMeds, curOrderId)
        });
    }

    return existingOrdersData;
};

AsthmaActionPlanComponent.prototype.updateZoneAsthmaMeds = function (newData) {
    this.activeActionPlan.GREEN_ZONE.SECTIONS.DAILY.MEDICATIONS = newData.GREEN_ZONE.SECTIONS.DAILY.MEDICATIONS;
    this.activeActionPlan.YELLOW_ZONE.SECTIONS.RELIEF.MEDICATIONS = newData.YELLOW_ZONE.SECTIONS.RELIEF.MEDICATIONS;
    this.activeActionPlan.RED_ZONE.SECTIONS.EMERGENCY.MEDICATIONS = newData.RED_ZONE.SECTIONS.EMERGENCY.MEDICATIONS;
};

AsthmaActionPlanComponent.prototype.performValidation = function () {
    var clinicalData = this.activeActionPlan.GENERAL_INFORMATION,
        selectedSectionMedsCount = 0,
        section,
        index,
        key,
        medsArray = [];

    if (clinicalData.TRIGGERS.length < 1) {
        return false;
    }

    if (this.actRequired && clinicalData.ASTHMA_CONTROL_TEST_SCORE.length < 1) {
        return false;
    }

    if (this.peakFlowRequired && clinicalData.PERSONAL_BEST_PEAK_FLOW.length < 1) {
        return false;
    }

    if (this.edVisitsRequired && clinicalData.PATIENT_REPORTED_ER_VISITS_NO_HOSPITALIZATION.length < 1) {
        return false;
    }

    if (this.inpStaysRequired && clinicalData.PATIENT_REPORTED_HOSPITALIZATIONS_OVERNIGHT.length < 1) {
        return false;
    }


    if (this.activeActionPlan.GREEN_ZONE.MEDS_REQUIRED) {
        for (key in this.activeActionPlan.GREEN_ZONE.SECTIONS) {
            if (this.activeActionPlan.GREEN_ZONE.SECTIONS.hasOwnProperty(key)) {
                section = this.activeActionPlan.GREEN_ZONE.SECTIONS[key];
                selectedSectionMedsCount = 0;
                medsArray = section.MEDICATIONS;
                for (index = section.MEDICATIONS.length; index--; ) {
                    if (medsArray[index].SELECTED_IND) {
                        selectedSectionMedsCount = 1;
                        break;
                    }
                }
                if (selectedSectionMedsCount === 0) {
                    return false;
                }
            }
        }
    }

    if (this.activeActionPlan.YELLOW_ZONE.MEDS_REQUIRED) {
        for (key in this.activeActionPlan.YELLOW_ZONE.SECTIONS) {
            if (this.activeActionPlan.YELLOW_ZONE.SECTIONS.hasOwnProperty(key)) {
                section = this.activeActionPlan.YELLOW_ZONE.SECTIONS[key];
                if (section.MEDICATIONS) {
                    selectedSectionMedsCount = 0;
                    medsArray = section.MEDICATIONS;
                    for (index = section.MEDICATIONS.length; index--; ) {
                        if (medsArray[index].SELECTED_IND) {
                            selectedSectionMedsCount = 1;
                            break;
                        }
                    }
                    if (selectedSectionMedsCount === 0) {
                        return false;
                    }
                }
            }
        }
    }

    selectedSectionMedsCount = 0;
    if (this.activeActionPlan.RED_ZONE.MEDS_REQUIRED) {
        for (key in this.activeActionPlan.RED_ZONE.SECTIONS) {
            if (this.activeActionPlan.RED_ZONE.SECTIONS.hasOwnProperty(key)) {
                section = this.activeActionPlan.RED_ZONE.SECTIONS[key];
                selectedSectionMedsCount = 0;
                medsArray = section.MEDICATIONS;
                for (index = section.MEDICATIONS.length; index--; ) {
                    if (medsArray[index].SELECTED_IND) {
                        selectedSectionMedsCount = 1;
                        break;
                    }
                }
                if (selectedSectionMedsCount === 0) {
                    return false;
                }
            }
        }
    }

    return true;
};

AsthmaActionPlanComponent.prototype.getSynonymId = function (orderId) {
    var orders = this.activeActionPlan.ORDERS_DETAILS,
        length = orders.length;
    for (var index = length; index--;) {
        if (orders[index].ORDER_ID === orderId) {
            return parseInt(orders[index].SYNONYM_ID, 10);
        }
    }
    return 0;
};

AsthmaActionPlanComponent.prototype.resetActiveActionPlanData = function () {
    this.activeActionPlan = {};
    this.activePreviousGroupId = 0;
    this.activePlanEditsFlag = false;
};

AsthmaActionPlanComponent.prototype.calculateAge = function (dateString) {
    // +new Date to get a number value
    var birthday = +new Date(dateString);
    // ~~ used for a faster version of math.floor
    return ~~(( (+new Date) - birthday) / (31557600000)); // jshint ignore:line
};

AsthmaActionPlanComponent.prototype.toggleZoneMedsVisibility = function ($modalBody, zoneIndex) {
    var $zone = $($modalBody.find(".aap-zone-body").get(zoneIndex)),
        $content = $zone.find(".aap-col-two-thirds .aap-content"),
        $filler = $zone.find(".aap-hide-medications");
    $filler.text(i18n.innov.asthmaActionPlan.NO_MEDS_REQUIRED).width($content.outerWidth(true)).height($content.outerHeight(true)).toggle();
    $content.toggle();
};

AsthmaActionPlanComponent.prototype.buildTableColumn = function (id, display, renderKey, customClass) {
    var defaultClass = this.patientAge <= 4 && this.asthmaInfantLabel.length > 0 && this.asthmaInfantRequired ? "aap-table-extra-column" : "aap-table-column";

    var column = new TableColumn();
    column.setColumnId(id);
    column.setCustomClass(customClass || defaultClass);
    column.setColumnDisplay(display);
    column.setRenderTemplate("<span>" + renderKey + "</span>");
    return column;
};

AsthmaActionPlanComponent.prototype.calculatePeakFlowRanges = function (asthmaDataModel) {
    // calculate peak flow ranges
    var bestPeakFlow = asthmaDataModel.GENERAL_INFORMATION.PERSONAL_BEST_PEAK_FLOW,
        aapi18n = i18n.innov.asthmaActionPlan,
        displayInd = this.peakFlowRequired || asthmaDataModel.GENERAL_INFORMATION.PERSONAL_BEST_PEAK_FLOW > 0;

    asthmaDataModel.GREEN_ZONE.PEAK_FLOW_DISPLAY_IND = displayInd;
    asthmaDataModel.GREEN_ZONE.PEAK_FLOW_RANGE_DISPLAY = Math.round(bestPeakFlow * 0.8) + " " + aapi18n.TO + " " + bestPeakFlow;
    asthmaDataModel.YELLOW_ZONE.PEAK_FLOW_DISPLAY_IND = displayInd;
    asthmaDataModel.YELLOW_ZONE.PEAK_FLOW_RANGE_DISPLAY = Math.round(bestPeakFlow * 0.5) + " " + aapi18n.TO + " " + Math.round(bestPeakFlow * 0.79);
    asthmaDataModel.RED_ZONE.PEAK_FLOW_DISPLAY_IND = displayInd;
    asthmaDataModel.RED_ZONE.PEAK_FLOW_RANGE_DISPLAY = aapi18n.LESS_THAN + " " + Math.round(bestPeakFlow * 0.5);

    return asthmaDataModel;
};

AsthmaActionPlanComponent.prototype.loadLabels = function (asthmaDataModel) {
    var aapi18n = i18n.innov.asthmaActionPlan;
    var criterion = this.getCriterion();
    var formatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);

    asthmaDataModel.GENERAL_INFORMATION.NAME = (typeof criterion.getPatientInfo().getName == "function") ? criterion.getPatientInfo().getName() : (JSON.parse(m_criterionJSON)).CRITERION.PERSON_INFO.PERSON_NAME;
    var dob = (typeof criterion.getPatientInfo().getDOB == "function") ? new Date(criterion.getPatientInfo().getDOB()) : new Date((JSON.parse(m_criterionJSON)).CRITERION.PERSON_INFO.DOB);
    asthmaDataModel.GENERAL_INFORMATION.DOB = formatter.format(dob, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);

    if (typeof asthmaDataModel.GENERAL_INFORMATION.PLAN_DATE === "undefined" || asthmaDataModel.GENERAL_INFORMATION.PLAN_DATE.length < 0) {
        asthmaDataModel.GENERAL_INFORMATION.PLAN_DATE = formatter.format(new Date(), mp_formatter.DateTimeFormatter.SHORT_DATE_2YEAR);
    }

    asthmaDataModel.GENERAL_INFORMATION.ED_VISITS_LABEL = this.edVisitsLabel;
    asthmaDataModel.GENERAL_INFORMATION.ED_VISITS_REQUIRED = this.edVisitsRequired;
    asthmaDataModel.GENERAL_INFORMATION.INP_STAY_LABEL = this.inpatientStaysLabel;
    asthmaDataModel.GENERAL_INFORMATION.INP_STAY_REQUIRED = this.inpatientStaysRequired;
    asthmaDataModel.GENERAL_INFORMATION.ASTHMA_TEST_LABEL = this.actLabel.length > 0 ? this.actLabel : aapi18n.ACT_SCORE;
    asthmaDataModel.GENERAL_INFORMATION.ASTHMA_TEST_REQUIRED = this.actRequired;
    asthmaDataModel.GENERAL_INFORMATION.PEAK_FLOW_LABEL = this.peakFlowLabel;
    asthmaDataModel.GENERAL_INFORMATION.PEAK_FLOW_REQUIRED = this.peakFlowRequired;
    asthmaDataModel.GENERAL_INFORMATION.SEVERITY_LABEL = this.asthmaSeverityLabel;
    asthmaDataModel.GENERAL_INFORMATION.ALLERGY_LABEL = this.activeAllergyLabel;
    asthmaDataModel.GENERAL_INFORMATION.PCP_LABEL = this.primaryCareProviderLabel;
    asthmaDataModel.GENERAL_INFORMATION.PCP_PHONE_LABEL = this.primaryCareProviderPhoneLabel;
    asthmaDataModel.GENERAL_INFORMATION.OTHER_CE_LABEL = this.otherCELabel;
    asthmaDataModel.GENERAL_INFORMATION.INFANT_REQUIRED = this.asthmaInfantRequired;
    asthmaDataModel.GENERAL_INFORMATION.INFANT_LABEL = this.asthmaInfantLabel;
    asthmaDataModel.GENERAL_INFORMATION.INFANT_LABEL_DISPLAY_IND = this.patientAge < 4;

    asthmaDataModel.GREEN_ZONE.PEAK_FLOW_RANGE_LABEL = aapi18n.GREEN_ZONE_PEAK_FLOW_DESCRIPTION;
    asthmaDataModel.GREEN_ZONE.SYMPTOMS.LABEL = aapi18n.GREEN_ZONE_SYMPTOMS_LABEL;
    asthmaDataModel.GREEN_ZONE.SYMPTOMS.LIST = [{"key":aapi18n.GREEN_ZONE_SYMPTOMS_1}, {"key":aapi18n.GREEN_ZONE_SYMPTOMS_2}, {"key":aapi18n.GREEN_ZONE_SYMPTOMS_3}, {"key":aapi18n.GREEN_ZONE_SYMPTOMS_4}];
    asthmaDataModel.GREEN_ZONE.SECTIONS.DAILY.LABEL = aapi18n.GREEN_ZONE_DAILY_LABEL;
    asthmaDataModel.GREEN_ZONE.CLIENT_SPECIAL_INSTRUCTIONS = this.greenZoneInstructions;
    asthmaDataModel.GREEN_ZONE.COMMENTS_IND = this.greenZoneCommentsIndicator;
    asthmaDataModel.GREEN_ZONE.COMMENTS_LABEL = aapi18n.COMMENTS;

    asthmaDataModel.YELLOW_ZONE.PEAK_FLOW_RANGE_LABEL = aapi18n.YELLOW_ZONE_PEAK_FLOW_DESCRIPTION;
    asthmaDataModel.YELLOW_ZONE.SYMPTOMS.LABEL = aapi18n.YELLOW_ZONE_SYMPTOMS_LABEL;
    asthmaDataModel.YELLOW_ZONE.SYMPTOMS.LIST = [{"key":aapi18n.YELLOW_ZONE_SYMPTOMS_1}, {"key":aapi18n.YELLOW_ZONE_SYMPTOMS_2}, {"key":aapi18n.YELLOW_ZONE_SYMPTOMS_3}, {"key":aapi18n.YELLOW_ZONE_SYMPTOMS_4}];
    asthmaDataModel.YELLOW_ZONE.SECTIONS.RELIEF.LABEL = aapi18n.QUICK_RELIEF;
    asthmaDataModel.YELLOW_ZONE.CLIENT_SPECIAL_INSTRUCTIONS = this.yellowZoneInstructions;
    asthmaDataModel.YELLOW_ZONE.COMMENTS_IND = this.yellowZoneCommentsIndicator;
    asthmaDataModel.YELLOW_ZONE.COMMENTS_LABEL = this.yellowZoneCommentsLabel.length > 0 ? this.yellowZoneCommentsLabel : aapi18n.COMMENTS;

    asthmaDataModel.RED_ZONE.PEAK_FLOW_RANGE_LABEL = aapi18n.RED_ZONE_PEAK_FLOW_DESCRIPTION;
    asthmaDataModel.RED_ZONE.SYMPTOMS.LABEL = aapi18n.RED_ZONE_SYMPTOMS_LABEL;
    asthmaDataModel.RED_ZONE.SYMPTOMS.LIST = [{"key":aapi18n.RED_ZONE_SYMPTOMS_1}, {"key":aapi18n.RED_ZONE_SYMPTOMS_2}, {"key":aapi18n.RED_ZONE_SYMPTOMS_3}, {"key":aapi18n.RED_ZONE_SYMPTOMS_4}, {"key":aapi18n.RED_ZONE_SYMPTOMS_5}];
    asthmaDataModel.RED_ZONE.SECTIONS.EMERGENCY.LABEL = aapi18n.RED_ZONE_EMERGENCY_LABEL;
    asthmaDataModel.RED_ZONE.CLIENT_SPECIAL_INSTRUCTIONS = this.redZoneInstructions;
    asthmaDataModel.RED_ZONE.COMMENTS_IND = this.redZoneCommentsIndicator;
    asthmaDataModel.RED_ZONE.COMMENTS_LABEL = aapi18n.COMMENTS;

    return asthmaDataModel;
};

AsthmaActionPlanComponent.prototype.initializeOrderDisplayHelper = function (asthmaDataModel) {
    window.render = window.render || {};

    // orderable name
    window.render.aapOrderDisplay = function (orderId) {
        var index, order, length = asthmaDataModel.ORDERS_DETAILS.length;
        for (index = 0; index < length; index++) {
            order = asthmaDataModel.ORDERS_DETAILS[index];
            if (parseInt(order.ORDER_ID, 10) === parseInt(orderId, 10)) {
                return order.NAME;
            }
        }
    };

    // this indicator is set to true when an order matches a
    // selected route code for spacer administration
    window.render.aapOrderSpacerDisplay = function (orderId) {
        var index, order, length = asthmaDataModel.ORDERS_DETAILS.length;
        for (index = 0; index < length; index++) {
            order = asthmaDataModel.ORDERS_DETAILS[index];
            if (parseInt(order.ORDER_ID, 10) === parseInt(orderId, 10)) {
                return order.SPACER_DISPLAY_IND;
            }
        }
    };
};

MP_Util.setObjectDefinitionMapping("ADV_ASTHMA_DOC", AsthmaActionPlanComponent);