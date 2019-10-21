(function(){function gaeInterventions(it
/**/) {
var out='';if(it.goal.INTERVENTIONS.length >0){out+='<div id=\'gwf-gaetable\' class=\'component-table list-as-table interventions-table\'>';out += window.render.gaeInterventionsHeader(it);out+='<div  id=\'gwf-gaetableBody\' class=\'content-body\'><div>';var arr1=it.goal.INTERVENTIONS;if(arr1){var inter,idx=-1,l1=arr1.length-1;while(idx<l1){inter=arr1[idx+=1];if(inter.DELETE_IND !== 1){out += window.render.gaeSingleIntervention({intervention: inter, index:idx, detailLists: it.detailLists});}} } out+='</div></div></div>';}return out;
}var itself=gaeInterventions, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['gaeInterventions']=itself;}}());(function(){function gaeInterventionsHeader(it
/**/) {
var out='<div id=\'gwf-gaeheaderWrapper\' class=\'content-hdr\'><dl id=\'gwf-gaeheader\' class=\' hdr\'><dd id=\'gwf-gaecolumnHeaderINTER_PRIORITY_COL\' class=\'header-item gwf-gae-inter-priority\'><span id=\'gwf-gaeheaderItemDisplayINTER_PRIORITY_COL\' class=\'header-item-display\'>&nbsp;</span></dd><dd id=\'gwf-gaecolumnHeaderINTER_DESC_COL\' class=\'header-item gwf-gae-inter-desc\'><span id=\'gwf-gaeheaderItemDisplayINTER_DESC_COL\' class=\'header-item-display required\'>'+(it.labels.interventionLabel)+'</span></dd><dd id=\'gwf-gaecolumnHeaderTYPE_COLUMN\' class=\'header-item gwf-gae-inter-type\'><span id=\'gwf-gaeheaderItemDisplayTYPE_COLUMN\' class=\'header-item-display  ';if(it.bedrockSettings.interTypeRequiredInd){out+='required';}out+='\'>'+(it.labels.interTypeLabel)+'</span></dd><dd id=\'gwf-gaecolumnHeaderCATEGORY_COLUMN\' class=\'header-item gwf-gae-inter-category\'><span id=\'gwf-gaeheaderItemDisplayCATEGORY_COLUMN\' class=\'header-item-display ';if(it.bedrockSettings.interCategoryRequiredInd){out+='required';}out+='\'>'+(it.labels.interCategoryLabel)+'</span></dd><dd id=\'gwf-gaecolumnHeaderSTATUS_COLUMN\' class=\'header-item gwf-gae-inter-status\'><span id=\'gwf-gaeheaderItemDisplaySTATUS_COLUMN\' class=\'header-item-display ';if(it.bedrockSettings.interStatusRequiredInd){out+='required';}out+='\'>'+(it.labels.interStatusLabel)+'</span></dd><dd id=\'gwf-gaecolumnHeaderFREQUENCY_COLUMN\' class=\'header-item gwf-gae-inter-frequency\'><span id=\'gwf-gaeheaderItemDisplayFREQUENCY_COLUMN\' class=\'header-item-display ';if(it.bedrockSettings.interFrequencyRequiredInd){out+='required';}out+='\'>'+(it.labels.interFrequencyLabel)+'</span></dd><dd id=\'gwf-gaecolumnHeaderTARGET_COLUMN\' class=\'header-item gwf-gae-inter-target\'><span id=\'gwf-gaeheaderItemDisplayTARGET_COLUMN\' class=\'header-item-display ';if(it.bedrockSettings.interTargetRequiredInd){out+='required';}out+='\'>'+(it.labels.interTargetLabel)+'</span></dd><dd id=\'gwf-gaecolumnHeaderCONFIDENCE_COLUMN\' class=\'header-item gwf-gae-inter-confidence\'><span id=\'gwf-gaeheaderItemDisplayCONFIDENCE_COLUMN\' class=\'header-item-display ';if(it.bedrockSettings.interConfidenceRequiredInd){out+='required';}out+='\'>'+(it.labels.interConfidenceLabel)+'</span></dd><dd id=\'gwf-gaecolumnHeaderDELETE_INTERVENTION_COLUMN\' class=\'header-item gwf-gae-inter-delete\'><span id=\'gwf-gaeheaderItemDisplayDELETE_INTERVENTION_COLUMN\' class=\'header-item-display\'>&nbsp;</span></dd></dl></div>';return out;
}var itself=gaeInterventionsHeader, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['gaeInterventionsHeader']=itself;}}());(function(){function gaeSingleIntervention(it
/**/) {
var out='<dl id=\'gwf-gae:row'+(it.index)+'\' class=\'result-info '+(GoalsAddEditWindow.getOddEven(it.index+1))+'\'><dd id=\'gwf-gae:row'+(it.index)+':INTER_PRIORITY_COL\' class=\'table-cell gwf-gae-inter-priority\'><span class="vertical-dots"></span><span class=\'priority-nbr\'>'+(it.intervention.PRIORITY)+'</span></dd><dd id=\'gwf-gae:row'+(it.index)+':INTER_DESC_COL\' class=\'table-cell gwf-gae-inter-desc\'>';if(it.intervention.NEW_IND === 1){out+='<textarea class=\'gwf-gae-inter-description\' id="'+(it.intervention.OUTCOMEACTID)+'" rows="2"></textarea><span class=\'gwf-gae-inter-helper-area\'><span class=\'inter-search-tip\'>'+(i18n.innov.GoalsWorkflowComponent.SEARCH_INTER_TIP)+'</span><span class=\'inter-text-counter\'>0/100</span></span>';}else if(it.intervention.OUTCOMECATID === it.detailLists.interventionCatalogId){out+='<textarea class=\'gwf-gae-inter-description\' id="'+(it.intervention.OUTCOMEACTID)+'" rows="2" ';if(it.intervention.SAVED_DESCRIPTION){out+='saved';}out+='>'+(it.intervention.SAVED_DESCRIPTION)+'</textarea><span class=\'gwf-gae-inter-helper-area\'><span class=\'inter-text-counter\'>'+(it.intervention.SAVED_DESCRIPTION.length)+'/100</span></span>';}else if(it.intervention.OUTCOMECATID !== it.detailLists.interventionCatalogId){out+='<span id="'+(it.intervention.OUTCOMEACTID)+'" class=\'gwf-gae-inter-description\'>'+(it.intervention.SAVED_DESCRIPTION.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</span>';}out+='</dd><dd id=\'gwf-gae:row'+(it.index)+':TYPE_COLUMN\' class=\'table-cell gwf-gae-inter-type\'><select multiple="multiple">';var arr1=it.detailLists.typeList;if(arr1){var type,i1=-1,l1=arr1.length-1;while(i1<l1){type=arr1[i1+=1];out+='<option value='+(type.CODE_VALUE)+' ';var arr2=it.intervention.SAVED_TYPE;if(arr2){var saved_type,i2=-1,l2=arr2.length-1;while(i2<l2){saved_type=arr2[i2+=1];if(saved_type.CODE_VALUE === type.CODE_VALUE){out+='selected';}} } out+='>'+(type.DISPLAY)+'</option>';} } out+='</select></dd><dd id=\'gwf-gae:row'+(it.index)+':CATEGORY_COLUMN\' class=\'table-cell gwf-gae-inter-category\'><select multiple="multiple">';var arr3=it.detailLists.categoryList;if(arr3){var category,i3=-1,l3=arr3.length-1;while(i3<l3){category=arr3[i3+=1];out+='<option value='+(category.CODE_VALUE)+' ';var arr4=it.intervention.SAVED_CATEGORY;if(arr4){var saved_category,i4=-1,l4=arr4.length-1;while(i4<l4){saved_category=arr4[i4+=1];if(saved_category.CODE_VALUE === category.CODE_VALUE){out+='selected';}} } out+='>'+(category.DISPLAY)+'</option>';} } out+='</select></dd><dd id=\'gwf-gae:row'+(it.index)+':STATUS_COLUMN\' class=\'table-cell gwf-gae-inter-status\'><select><option selected disabled hidden>'+(i18n.innov.GoalsWorkflowComponent.NONE)+'</option>';var arr5=it.intervention.STATUSLIST;if(arr5){var status,i5=-1,l5=arr5.length-1;while(i5<l5){status=arr5[i5+=1];out+='<option value='+(status.CODE_VALUE)+' ';if(status.CODE_VALUE === it.intervention.STATUS.SAVED_STATUS_CD){out+='selected';}out+='>'+(status.DISPLAY)+'</option>';} } out+='</select></dd><dd id=\'gwf-gae:row'+(it.index)+':FREQUENCY_COLUMN\' class=\'table-cell gwf-gae-inter-frequency\'><select><option selected disabled hidden>'+(i18n.innov.GoalsWorkflowComponent.NONE)+'</option>';var arr6=it.detailLists.frequencyList;if(arr6){var frequency,i6=-1,l6=arr6.length-1;while(i6<l6){frequency=arr6[i6+=1];out+='<option value='+(frequency.CODE_VALUE)+' ';if(frequency.CODE_VALUE === it.intervention.FREQUENCY.SAVED_FREQUENCY_CD){out+='selected';}out+='>'+(frequency.DISPLAY)+'</option>';} } out+='</select></dd><dd id=\'gwf-gae:row'+(it.index)+':TARGET_COLUMN\' class=\'table-cell gwf-gae-inter-target\'><input type=\'text\' class=\'gwf-gae-inter-target-val\' value="';if(it.intervention.SAVED_TARGET_VAL){out+=''+(it.intervention.SAVED_TARGET_VAL);}out+='"></input><select><option selected disabled hidden>'+(i18n.innov.GoalsWorkflowComponent.NONE)+'</option>';var arr7=it.detailLists.targetUnitCdsList;if(arr7){var target,i7=-1,l7=arr7.length-1;while(i7<l7){target=arr7[i7+=1];out+='<option value='+(target.CODE_VALUE)+' ';if(target.CODE_VALUE === it.intervention.TARGETUNIT.SAVED_TARGETUNIT_CD){out+='selected';}out+='>'+(target.DISPLAY)+'</option>';} } out+='</select></dd><dd id=\'gwf-gae:row'+(it.index)+':CONFIDENCE_COLUMN\' class=\'table-cell gwf-gae-inter-confidence\'><select><option selected disabled hidden>'+(i18n.innov.GoalsWorkflowComponent.NONE)+'</option>';for(var i = 1; i<=10; i++){out+='<option value='+(i)+' ';if(String(it.intervention.SAVED_CONFIDENCE) === String(i)){out+='selected';}out+='>'+(i)+'</option>';}out+='</select></dd><dd id=\'gwf-gae:row'+(it.index)+':DELETE_INTERVENTION_COLUMN\' class=\'table-cell gwf-gae-inter-delete\'><span class=\'gwf-gae-inter-delete-icon\'></span></dd></dl>';return out;
}var itself=gaeSingleIntervention, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['gaeSingleIntervention']=itself;}}());(function(){function goalsAddEdit(it
/**/) {
var out='<div class="gwf-gae-goal-info-sec"><div class="gwf-gae-goal-header required">'+(i18n.innov.GoalsWorkflowComponent.GOAL)+'</div><div class="gwf-gae-goal-sec">';if(it.goal.NEW_IND){out+='<textarea rows="2"></textarea><div class=\'gwf-gae-goal-helper-area\'><span class=\'goal-search-tip\'>'+(i18n.innov.GoalsWorkflowComponent.SEARCH_GOAL_TIP)+'</span><span class=\'goal-text-counter\'>0/100</span></div>';}else if(it.goal.OUTCOMECATID === it.detailLists.goalCatalogId){out+='<textarea rows="2" ';if(it.goal.SAVED_DESCRIPTION){out+='saved';}out+='>'+(it.goal.SAVED_DESCRIPTION)+'</textarea><div class=\'goal-helper-area\'><span class=\'goal-text-counter\'>'+(it.goal.SAVED_DESCRIPTION.length)+'/100</span></div>';}else if(it.goal.OUTCOMECATID !== it.detailLists.goalCatalogId){out+='<span class=\'gwf-gae-goal-description\'>'+(it.goal.SAVED_DESCRIPTION.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</span>';}out+='</div><div class=\'gwf-gae-goal-details\'><div class="gwf-gae-start-sec"><span class="gwf-gae-start-lbl ';if(it.bedrockSettings.startRequiredInd){out+='required';}out+='">'+(it.labels.startLabel)+'</span><input type="text" class=\'gwf-gae-start\'></input></div><div class="gwf-gae-target-sec"><span class="gwf-gae-target-lbl ';if(it.bedrockSettings.targetRequiredInd){out+='required';}out+='">'+(it.labels.targetLabel)+'</span><input type="text" class=\'gwf-gae-target\'></input></div><div class="gwf-gae-type-sec"><span class="gwf-gae-type-lbl ';if(it.bedrockSettings.typeRequiredInd){out+='required';}out+='">'+(it.labels.typeLabel)+'</span><select class="gwf-gae-type" multiple="multiple">';var arr1=it.detailLists.typeList;if(arr1){var type,index=-1,l1=arr1.length-1;while(index<l1){type=arr1[index+=1];out+='<option value='+(type.CODE_VALUE)+' ';var arr2=it.goal.SAVED_TYPE;if(arr2){var saved_type,saved_index=-1,l2=arr2.length-1;while(saved_index<l2){saved_type=arr2[saved_index+=1];if(saved_type.CODE_VALUE === type.CODE_VALUE){out+='selected';}} } out+='>'+(type.DISPLAY)+'</option>';} } out+='</select></div><div class="gwf-gae-category-sec"><span class="gwf-gae-category-lbl ';if(it.bedrockSettings.categoryRequiredInd){out+='required';}out+='">'+(it.labels.categoryLabel)+'</span><select class="gwf-gae-category" multiple="multiple">';var arr3=it.detailLists.categoryList;if(arr3){var category,index=-1,l3=arr3.length-1;while(index<l3){category=arr3[index+=1];out+='<option value='+(category.CODE_VALUE)+' ';var arr4=it.goal.SAVED_CATEGORY;if(arr4){var saved_category,saved_index=-1,l4=arr4.length-1;while(saved_index<l4){saved_category=arr4[saved_index+=1];if(saved_category.CODE_VALUE === category.CODE_VALUE){out+='selected';}} } out+='>'+(category.DISPLAY)+'</option>';} } out+='</select></div><div class="gwf-gae-barriers-sec"><span class="gwf-gae-barriers-lbl ';if(it.bedrockSettings.barrierRequiredInd){out+='required';}out+='">'+(it.labels.barrierLabel)+'</span><select class="gwf-gae-barriers" multiple="multiple">';var arr5=it.detailLists.barriersList;if(arr5){var barrier,index=-1,l5=arr5.length-1;while(index<l5){barrier=arr5[index+=1];out+='<option value='+(barrier.CODE_VALUE)+' ';var arr6=it.goal.SAVED_BARRIER;if(arr6){var saved_barrier,saved_index=-1,l6=arr6.length-1;while(saved_index<l6){saved_barrier=arr6[saved_index+=1];if(saved_barrier.CODE_VALUE === barrier.CODE_VALUE){out+='selected';}} } out+='>'+(barrier.DISPLAY)+'</option>';} } out+='</select></div><div class=\'gwf-gae-goal-status-sec ';if(it.goal.FUTUREIND){out+='hidden';}out+='\'><span class="gwf-gae-goal-status-lbl">'+(i18n.innov.GoalsWorkflowComponent.STATUS)+'</span><select class="gwf-gae-goal-status"><option selected disabled hidden>'+(i18n.innov.GoalsWorkflowComponent.NONE)+'</option>';var arr7=it.goal.STATUSLIST;if(arr7){var status,i7=-1,l7=arr7.length-1;while(i7<l7){status=arr7[i7+=1];out+='<option value='+(status.CODE_VALUE)+' ';if(status.CODE_VALUE === it.goal.GOAL_STATUS.SAVED_STATUS_CD){out+='selected';}out+='>'+(status.DISPLAY)+'</option>';} } out+='</select></dd></div></div><div class="gwf-gae-interventions-header ';if(it.bedrockSettings.interventionRequiredInd){out+='required';}out+='">'+(i18n.innov.GoalsWorkflowComponent.INTERVENTIONS)+'</div><div class="gwf-gae-goal-interventions-sec">';out += window.render.gaeInterventions(it);out+='</div><span class=\'gwf-gae-add-intervention\'>'+(i18n.innov.GoalsWorkflowComponent.ADD_INTERVENTION)+'</span>';return out;
}var itself=goalsAddEdit, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['goalsAddEdit']=itself;}}());(function(){function goalHtmlBlock(param
/**/) {
var out='<li class ="gwf-goal-li"><div class="gwf-goal" id="'+(param.goal.OUTCOMEACTID)+'"><div class="gwf-goal-priority">';if((param.goal.METIND !== 1) && (param.goal.FUTUREIND===0)){out+='<span class="vertical-dots"></span><span class="priority-nbr">'+(param.goal.PRIORITY)+'</span>';}out+='</div><div class="gwf-goal-status-div"><div class=\'gwf-goal-status-select\' id=\'outcomeStatus'+(param.goal.OUTCOMEACTID)+'\' title=\''+(param.goal.GOAL_STATUS.CURRENT_STATUS_DISPLAY)+'\' catid=\''+(param.goal.OUTCOMECATID)+'\'>';if(param.goal.METIND === 1){out+='<span class=\'gwf-status-icon gwf-status-met\'></span>';}else if(param.goal.METIND !== 1){out+='<span class=\'gwf-status-icon gwf-status-unmet\'></span>';}out+='<span class=\'down-arrow\'></span></div></div><div class="gwf-goal-details"><div class="gwf-goal-details-1"><span class="gwf-goal-description">'+(param.goal.CURRENT_DESCRIPTION.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</span><div class="gwf-goal-creator-sec"><span class="gwf-goal-creator-lbl">'+(param.labels.creatorLabel)+':&nbsp;</span><span class="gwf-goal-creator">';if(param.goal.CREATOR){out+=''+(param.goal.CREATOR);}else if(!param.goal.CREATOR){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-target-sec"><span class="gwf-goal-target-lbl">'+(param.labels.targetLabel)+':&nbsp;</span><span class="gwf-goal-target">';if(param.goal.ENDDTTM){out+=''+(param.component.capitalizeFirstLetterOnly(param.goal.ENDDTTM));}else if(!param.goal.ENDDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-start-date-sec"><span class="gwf-goal-start-lbl">'+(param.labels.startLabel)+':&nbsp;</span><span class="gwf-goal-start-date">';if(param.goal.STARTDTTM){out+=''+(param.component.capitalizeFirstLetterOnly(param.goal.STARTDTTM));}else if(!param.goal.STARTDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div><div class="gwf-goal-details-2">';if(param.goal.ACTIVE_INTERVENTIONS_CNT > 0){out+='<span class="gwf-goal-expand-collapse expand-icon"></span><span class=\'gwf-goal-met-inter-cnt\'>'+(param.goal.MET_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.OF)+'&nbsp;'+(param.goal.ACTIVE_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.MET)+'</span>';}else if(param.goal.ACTIVE_INTERVENTIONS_CNT === 0){out+='<span class=\'gwf-no-interventions\'>'+(i18n.innov.GoalsWorkflowComponent.NO_INTERVENTIONS)+'</span>';}out+='<div class="gwf-goal-barriers-sec"><span class="gwf-goal-barriers-lbl">'+(param.labels.barrierLabel)+':&nbsp;</span><span class="gwf-goal-barriers">';if(param.goal.SAVED_BARRIER.length > 0){var arr1=param.goal.SAVED_BARRIER;if(arr1){var barrier,barrier_idx=-1,l1=arr1.length-1;while(barrier_idx<l1){barrier=arr1[barrier_idx+=1];if(param.goal.SAVED_BARRIER.length-1 === barrier_idx){out+=''+(barrier.DISPLAY);}else{out+=''+(barrier.DISPLAY)+',&nbsp;&#x200b;';}} } }else if(param.goal.SAVED_BARRIER.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-type-sec"><span class="gwf-goal-type-lbl">'+(param.labels.typeLabel)+':&nbsp;</span><span class="gwf-goal-type">';if(param.goal.SAVED_TYPE.length > 0){var arr2=param.goal.SAVED_TYPE;if(arr2){var type,type_idx=-1,l2=arr2.length-1;while(type_idx<l2){type=arr2[type_idx+=1];if(param.goal.SAVED_TYPE.length-1 === type_idx){out+=''+(type.DISPLAY);}else{out+=''+(type.DISPLAY)+',&nbsp;&#x200b;';}} } }else if(param.goal.SAVED_TYPE.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-category-sec"><span class="gwf-goal-category-lbl">'+(param.labels.categoryLabel)+':&nbsp;</span><span class="gwf-goal-category">';if(param.goal.SAVED_CATEGORY.length > 0){var arr3=param.goal.SAVED_CATEGORY;if(arr3){var category,cat_idx=-1,l3=arr3.length-1;while(cat_idx<l3){category=arr3[cat_idx+=1];if(param.goal.SAVED_CATEGORY.length-1 === cat_idx){out+=''+(category.DISPLAY);}else{out+=''+(category.DISPLAY)+',&nbsp;&#x200b;';}} } }else if(param.goal.SAVED_CATEGORY.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div></div><div class="gwf-goal-edit"><span class="goal-edit-icon" title="'+(i18n.innov.GoalsWorkflowComponent.EDIT)+'"></span></div><div class="gwf-goal-comment"><span class="goal-comment-icon ';if(param.goal.COMMENT){out+='comment-exists';}out+='" title="'+(i18n.innov.GoalsWorkflowComponent.COMMENT)+'"></span></div><div class="gwf-goal-interventions hidden">'+( param.component.getInterventionsTable(param.goal.INTERVENTIONS))+'</div></div></li>';return out;
}function goalsComponent(it
/**/) {
var out='<div class=\'gwf-control-bar\'><div class=\'gwf-control-buttons-wrapper\'><button class=\'gwf-all-gls-control\'>'+(i18n.innov.GoalsWorkflowComponent.ALL)+' (<span class=\'all-goals-count\'>'+(it.data.UNMET_OUTCOMES.length+it.data.MET_OUTCOMES.length+it.data.FUTURE_OUTCOMES.length)+'</span>)</button><button class=\'gwf-unmet-gls-control\'>'+(it.labels.unmetLabel)+' (<span class=\'unmet-goals-count\'>'+(it.data.UNMET_OUTCOMES.length)+'</span>)</button><button class=\'gwf-future-gls-control\'>'+(it.labels.futureLabel)+' (<span class=\'future-goals-count\'>'+(it.data.FUTURE_OUTCOMES.length)+'</span>)</button><button class=\'gwf-met-gls-control\'>'+(it.labels.metLabel)+' (<span class=\'met-goals-count\'>'+(it.data.MET_OUTCOMES.length)+'</span>)</button><span id=\'timedMessage\'></span></div></div><div class=\'gwf-add-goal\'>+ add goal</div><div class="gwf-goals-unmet-header">'+(it.labels.unmetLabel)+'</div><ul class="gwf-unmet-goals" id="sortableGoals">';var arr1=it.data.UNMET_OUTCOMES;if(arr1){var unmet_goal,unmet_index=-1,l1=arr1.length-1;while(unmet_index<l1){unmet_goal=arr1[unmet_index+=1];out+='<li class ="gwf-goal-li"><div class="gwf-goal" id="'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.OUTCOMEACTID)+'"><div class="gwf-goal-priority">';if(({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.METIND !== 1) && ({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.FUTUREIND===0)){out+='<span class="vertical-dots"></span><span class="priority-nbr">'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.PRIORITY)+'</span>';}out+='</div><div class="gwf-goal-status-div"><div class=\'gwf-goal-status-select\' id=\'outcomeStatus'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.OUTCOMEACTID)+'\' title=\''+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.GOAL_STATUS.CURRENT_STATUS_DISPLAY)+'\' catid=\''+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.OUTCOMECATID)+'\'>';if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.METIND === 1){out+='<span class=\'gwf-status-icon gwf-status-met\'></span>';}else if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.METIND !== 1){out+='<span class=\'gwf-status-icon gwf-status-unmet\'></span>';}out+='<span class=\'down-arrow\'></span></div></div><div class="gwf-goal-details"><div class="gwf-goal-details-1"><span class="gwf-goal-description">'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.CURRENT_DESCRIPTION.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</span><div class="gwf-goal-creator-sec"><span class="gwf-goal-creator-lbl">'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.labels.creatorLabel)+':&nbsp;</span><span class="gwf-goal-creator">';if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.CREATOR){out+=''+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.CREATOR);}else if(!{goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.CREATOR){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-target-sec"><span class="gwf-goal-target-lbl">'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.labels.targetLabel)+':&nbsp;</span><span class="gwf-goal-target">';if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.ENDDTTM){out+=''+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.component.capitalizeFirstLetterOnly({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.ENDDTTM));}else if(!{goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.ENDDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-start-date-sec"><span class="gwf-goal-start-lbl">'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.labels.startLabel)+':&nbsp;</span><span class="gwf-goal-start-date">';if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.STARTDTTM){out+=''+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.component.capitalizeFirstLetterOnly({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.STARTDTTM));}else if(!{goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.STARTDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div><div class="gwf-goal-details-2">';if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.ACTIVE_INTERVENTIONS_CNT > 0){out+='<span class="gwf-goal-expand-collapse expand-icon"></span><span class=\'gwf-goal-met-inter-cnt\'>'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.MET_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.OF)+'&nbsp;'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.ACTIVE_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.MET)+'</span>';}else if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.ACTIVE_INTERVENTIONS_CNT === 0){out+='<span class=\'gwf-no-interventions\'>'+(i18n.innov.GoalsWorkflowComponent.NO_INTERVENTIONS)+'</span>';}out+='<div class="gwf-goal-barriers-sec"><span class="gwf-goal-barriers-lbl">'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.labels.barrierLabel)+':&nbsp;</span><span class="gwf-goal-barriers">';if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER.length > 0){var arr2={goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER;if(arr2){var barrier,barrier_idx=-1,l2=arr2.length-1;while(barrier_idx<l2){barrier=arr2[barrier_idx+=1];if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER.length-1 === barrier_idx){out+=''+(barrier.DISPLAY);}else{out+=''+(barrier.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-type-sec"><span class="gwf-goal-type-lbl">'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.labels.typeLabel)+':&nbsp;</span><span class="gwf-goal-type">';if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE.length > 0){var arr3={goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE;if(arr3){var type,type_idx=-1,l3=arr3.length-1;while(type_idx<l3){type=arr3[type_idx+=1];if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE.length-1 === type_idx){out+=''+(type.DISPLAY);}else{out+=''+(type.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-category-sec"><span class="gwf-goal-category-lbl">'+({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.labels.categoryLabel)+':&nbsp;</span><span class="gwf-goal-category">';if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY.length > 0){var arr4={goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY;if(arr4){var category,cat_idx=-1,l4=arr4.length-1;while(cat_idx<l4){category=arr4[cat_idx+=1];if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY.length-1 === cat_idx){out+=''+(category.DISPLAY);}else{out+=''+(category.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div></div><div class="gwf-goal-edit"><span class="goal-edit-icon" title="'+(i18n.innov.GoalsWorkflowComponent.EDIT)+'"></span></div><div class="gwf-goal-comment"><span class="goal-comment-icon ';if({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.COMMENT){out+='comment-exists';}out+='" title="'+(i18n.innov.GoalsWorkflowComponent.COMMENT)+'"></span></div><div class="gwf-goal-interventions hidden">'+( {goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.component.getInterventionsTable({goal:unmet_goal,index:unmet_index,component:it.component, labels:it.labels}.goal.INTERVENTIONS))+'</div></div></li>';} } out+='</ul><div class="gwf-goals-met-header">'+(it.labels.metLabel)+'</div><ul class="gwf-met-goals">';var arr5=it.data.MET_OUTCOMES;if(arr5){var met_goal,met_index=-1,l5=arr5.length-1;while(met_index<l5){met_goal=arr5[met_index+=1];out+='<li class ="gwf-goal-li"><div class="gwf-goal" id="'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.OUTCOMEACTID)+'"><div class="gwf-goal-priority">';if(({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.METIND !== 1) && ({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.FUTUREIND===0)){out+='<span class="vertical-dots"></span><span class="priority-nbr">'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.PRIORITY)+'</span>';}out+='</div><div class="gwf-goal-status-div"><div class=\'gwf-goal-status-select\' id=\'outcomeStatus'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.OUTCOMEACTID)+'\' title=\''+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.GOAL_STATUS.CURRENT_STATUS_DISPLAY)+'\' catid=\''+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.OUTCOMECATID)+'\'>';if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.METIND === 1){out+='<span class=\'gwf-status-icon gwf-status-met\'></span>';}else if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.METIND !== 1){out+='<span class=\'gwf-status-icon gwf-status-unmet\'></span>';}out+='<span class=\'down-arrow\'></span></div></div><div class="gwf-goal-details"><div class="gwf-goal-details-1"><span class="gwf-goal-description">'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.CURRENT_DESCRIPTION.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</span><div class="gwf-goal-creator-sec"><span class="gwf-goal-creator-lbl">'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.labels.creatorLabel)+':&nbsp;</span><span class="gwf-goal-creator">';if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.CREATOR){out+=''+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.CREATOR);}else if(!{goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.CREATOR){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-target-sec"><span class="gwf-goal-target-lbl">'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.labels.targetLabel)+':&nbsp;</span><span class="gwf-goal-target">';if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.ENDDTTM){out+=''+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.component.capitalizeFirstLetterOnly({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.ENDDTTM));}else if(!{goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.ENDDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-start-date-sec"><span class="gwf-goal-start-lbl">'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.labels.startLabel)+':&nbsp;</span><span class="gwf-goal-start-date">';if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.STARTDTTM){out+=''+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.component.capitalizeFirstLetterOnly({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.STARTDTTM));}else if(!{goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.STARTDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div><div class="gwf-goal-details-2">';if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.ACTIVE_INTERVENTIONS_CNT > 0){out+='<span class="gwf-goal-expand-collapse expand-icon"></span><span class=\'gwf-goal-met-inter-cnt\'>'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.MET_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.OF)+'&nbsp;'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.ACTIVE_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.MET)+'</span>';}else if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.ACTIVE_INTERVENTIONS_CNT === 0){out+='<span class=\'gwf-no-interventions\'>'+(i18n.innov.GoalsWorkflowComponent.NO_INTERVENTIONS)+'</span>';}out+='<div class="gwf-goal-barriers-sec"><span class="gwf-goal-barriers-lbl">'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.labels.barrierLabel)+':&nbsp;</span><span class="gwf-goal-barriers">';if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER.length > 0){var arr6={goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER;if(arr6){var barrier,barrier_idx=-1,l6=arr6.length-1;while(barrier_idx<l6){barrier=arr6[barrier_idx+=1];if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER.length-1 === barrier_idx){out+=''+(barrier.DISPLAY);}else{out+=''+(barrier.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-type-sec"><span class="gwf-goal-type-lbl">'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.labels.typeLabel)+':&nbsp;</span><span class="gwf-goal-type">';if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE.length > 0){var arr7={goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE;if(arr7){var type,type_idx=-1,l7=arr7.length-1;while(type_idx<l7){type=arr7[type_idx+=1];if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE.length-1 === type_idx){out+=''+(type.DISPLAY);}else{out+=''+(type.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-category-sec"><span class="gwf-goal-category-lbl">'+({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.labels.categoryLabel)+':&nbsp;</span><span class="gwf-goal-category">';if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY.length > 0){var arr8={goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY;if(arr8){var category,cat_idx=-1,l8=arr8.length-1;while(cat_idx<l8){category=arr8[cat_idx+=1];if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY.length-1 === cat_idx){out+=''+(category.DISPLAY);}else{out+=''+(category.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div></div><div class="gwf-goal-edit"><span class="goal-edit-icon" title="'+(i18n.innov.GoalsWorkflowComponent.EDIT)+'"></span></div><div class="gwf-goal-comment"><span class="goal-comment-icon ';if({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.COMMENT){out+='comment-exists';}out+='" title="'+(i18n.innov.GoalsWorkflowComponent.COMMENT)+'"></span></div><div class="gwf-goal-interventions hidden">'+( {goal:met_goal,index:met_index,component:it.component, labels:it.labels}.component.getInterventionsTable({goal:met_goal,index:met_index,component:it.component, labels:it.labels}.goal.INTERVENTIONS))+'</div></div></li>';} } out+='</ul><div class="gwf-goals-future-header">'+(it.labels.futureLabel)+'</div><ul class="gwf-future-goals">';var arr9=it.data.FUTURE_OUTCOMES;if(arr9){var future_goal,future_index=-1,l9=arr9.length-1;while(future_index<l9){future_goal=arr9[future_index+=1];out+='<li class ="gwf-goal-li"><div class="gwf-goal" id="'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.OUTCOMEACTID)+'"><div class="gwf-goal-priority">';if(({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.METIND !== 1) && ({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.FUTUREIND===0)){out+='<span class="vertical-dots"></span><span class="priority-nbr">'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.PRIORITY)+'</span>';}out+='</div><div class="gwf-goal-status-div"><div class=\'gwf-goal-status-select\' id=\'outcomeStatus'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.OUTCOMEACTID)+'\' title=\''+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.GOAL_STATUS.CURRENT_STATUS_DISPLAY)+'\' catid=\''+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.OUTCOMECATID)+'\'>';if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.METIND === 1){out+='<span class=\'gwf-status-icon gwf-status-met\'></span>';}else if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.METIND !== 1){out+='<span class=\'gwf-status-icon gwf-status-unmet\'></span>';}out+='<span class=\'down-arrow\'></span></div></div><div class="gwf-goal-details"><div class="gwf-goal-details-1"><span class="gwf-goal-description">'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.CURRENT_DESCRIPTION.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</span><div class="gwf-goal-creator-sec"><span class="gwf-goal-creator-lbl">'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.labels.creatorLabel)+':&nbsp;</span><span class="gwf-goal-creator">';if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.CREATOR){out+=''+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.CREATOR);}else if(!{goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.CREATOR){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-target-sec"><span class="gwf-goal-target-lbl">'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.labels.targetLabel)+':&nbsp;</span><span class="gwf-goal-target">';if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.ENDDTTM){out+=''+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.component.capitalizeFirstLetterOnly({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.ENDDTTM));}else if(!{goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.ENDDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-start-date-sec"><span class="gwf-goal-start-lbl">'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.labels.startLabel)+':&nbsp;</span><span class="gwf-goal-start-date">';if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.STARTDTTM){out+=''+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.component.capitalizeFirstLetterOnly({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.STARTDTTM));}else if(!{goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.STARTDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div><div class="gwf-goal-details-2">';if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.ACTIVE_INTERVENTIONS_CNT > 0){out+='<span class="gwf-goal-expand-collapse expand-icon"></span><span class=\'gwf-goal-met-inter-cnt\'>'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.MET_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.OF)+'&nbsp;'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.ACTIVE_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.MET)+'</span>';}else if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.ACTIVE_INTERVENTIONS_CNT === 0){out+='<span class=\'gwf-no-interventions\'>'+(i18n.innov.GoalsWorkflowComponent.NO_INTERVENTIONS)+'</span>';}out+='<div class="gwf-goal-barriers-sec"><span class="gwf-goal-barriers-lbl">'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.labels.barrierLabel)+':&nbsp;</span><span class="gwf-goal-barriers">';if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER.length > 0){var arr10={goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER;if(arr10){var barrier,barrier_idx=-1,l10=arr10.length-1;while(barrier_idx<l10){barrier=arr10[barrier_idx+=1];if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER.length-1 === barrier_idx){out+=''+(barrier.DISPLAY);}else{out+=''+(barrier.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_BARRIER.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-type-sec"><span class="gwf-goal-type-lbl">'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.labels.typeLabel)+':&nbsp;</span><span class="gwf-goal-type">';if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE.length > 0){var arr11={goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE;if(arr11){var type,type_idx=-1,l11=arr11.length-1;while(type_idx<l11){type=arr11[type_idx+=1];if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE.length-1 === type_idx){out+=''+(type.DISPLAY);}else{out+=''+(type.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_TYPE.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-category-sec"><span class="gwf-goal-category-lbl">'+({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.labels.categoryLabel)+':&nbsp;</span><span class="gwf-goal-category">';if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY.length > 0){var arr12={goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY;if(arr12){var category,cat_idx=-1,l12=arr12.length-1;while(cat_idx<l12){category=arr12[cat_idx+=1];if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY.length-1 === cat_idx){out+=''+(category.DISPLAY);}else{out+=''+(category.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.SAVED_CATEGORY.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div></div><div class="gwf-goal-edit"><span class="goal-edit-icon" title="'+(i18n.innov.GoalsWorkflowComponent.EDIT)+'"></span></div><div class="gwf-goal-comment"><span class="goal-comment-icon ';if({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.COMMENT){out+='comment-exists';}out+='" title="'+(i18n.innov.GoalsWorkflowComponent.COMMENT)+'"></span></div><div class="gwf-goal-interventions hidden">'+( {goal:future_goal,index:future_index,component:it.component, labels:it.labels}.component.getInterventionsTable({goal:future_goal,index:future_index,component:it.component, labels:it.labels}.goal.INTERVENTIONS))+'</div></div></li>';} } out+='</ul>';return out;
}var itself=goalsComponent, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.goalHtmlBlock=goalHtmlBlock;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['goalsComponent']=itself;}}());(function(){function goalsSave(it
/**/) {
var out='{\\rtf1\\ansi\\deff0 '+(it.data.m_label)+' \\pard \\brdrb \\brdrs\\brdrw10\\brsp20 {\\fs4\\~}\\par \\pard '+(it.data.banner)+' \\par\\par ';if(it.data.unmetGoals.length){out+=''+(it.data.m_unmetGoalHeader)+' \\par \\trowd\\trgaph70 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx1000 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx3000\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx5000\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx6100\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx7400\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx8200\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx9200\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx10200\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx12300 \\intbl '+(it.data.m_priorHeader)+'\\cell\\intbl '+(it.data.m_goalHeader)+'\\cell\\intbl '+(it.data.m_interHeader)+'\\cell\\intbl '+(it.data.m_typeHeader)+'\\cell \\intbl '+(it.data.m_catHeader)+'\\cell \\intbl '+(it.data.m_statusHeader)+'\\cell \\intbl '+(it.data.m_startDateHeader)+'\\cell \\intbl '+(it.data.m_targetDateHeader)+'\\cell \\intbl '+(it.data.m_commentHeader)+'\\cell \\row ';var arr1=it.data.unmetGoals;if(arr1){var curGoal,index=-1,l1=arr1.length-1;while(index<l1){curGoal=arr1[index+=1];out+=' \\trowd\\trgaph70 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx1000 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx3000\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx5000\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx6100 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx7400 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx8200 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx9200 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx10200 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx12300\\intbl '+(curGoal.priority)+' \\cell\\intbl '+(curGoal.goal)+' \\cell \\intbl ';var arr2=curGoal.interventions;if(arr2){var curInt,intIndex=-1,l2=arr2.length-1;while(intIndex<l2){curInt=arr2[intIndex+=1];if(curInt.isMet){out+='(met)';}out+=''+(curInt.intervention)+'\\line\\line ';} } out+='\\cell \\intbl ';var arr3=curGoal.types;if(arr3){var curType,intIndex=-1,l3=arr3.length-1;while(intIndex<l3){curType=arr3[intIndex+=1];out+=''+(curType.type)+'\\line\\line ';} } out+='\\cell \\intbl ';var arr4=curGoal.categories;if(arr4){var curCat,intIndex=-1,l4=arr4.length-1;while(intIndex<l4){curCat=arr4[intIndex+=1];out+=''+(curCat.category)+'\\line\\line ';} } out+='\\cell \\intbl '+(curGoal.status)+'\\cell \\intbl '+(curGoal.startDate)+'\\cell \\intbl '+(curGoal.targetDate)+'\\cell \\intbl '+(curGoal.comments)+'\\cell \\row ';} } }out+=' \\pard\\par\\par\\par ';if(it.data.metGoals.length){out+=''+(it.data.m_metGoalHeader)+' \\par \\trowd\\trgaph70 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx2000\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx4500\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx5600 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx6900 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx7700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx8700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx9700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx12300\\intbl '+(it.data.m_goalHeader)+'\\cell\\intbl '+(it.data.m_interHeader)+'\\cell\\intbl '+(it.data.m_typeHeader)+'\\cell \\intbl '+(it.data.m_catHeader)+'\\cell \\intbl '+(it.data.m_statusHeader)+'\\cell \\intbl '+(it.data.m_startDateHeader)+'\\cell \\intbl '+(it.data.m_targetDateHeader)+'\\cell \\intbl '+(it.data.m_commentHeader)+'\\cell\\row ';var arr5=it.data.metGoals;if(arr5){var curGoal,index=-1,l5=arr5.length-1;while(index<l5){curGoal=arr5[index+=1];out+=' \\trowd\\trgaph70 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx2000\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx4500\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx5600 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx6900 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx7700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx8700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx9700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx12300\\intbl '+(curGoal.goal)+' \\cell \\intbl ';var arr6=curGoal.interventions;if(arr6){var curInt,intIndex=-1,l6=arr6.length-1;while(intIndex<l6){curInt=arr6[intIndex+=1];if(curInt.isMet){out+='(met)';}out+=''+(curInt.intervention)+'\\line\\line ';} } out+='\\cell \\intbl ';var arr7=curGoal.types;if(arr7){var curType,intIndex=-1,l7=arr7.length-1;while(intIndex<l7){curType=arr7[intIndex+=1];out+=''+(curType.type)+'\\line\\line ';} } out+='\\cell \\intbl ';var arr8=curGoal.categories;if(arr8){var curCat,intIndex=-1,l8=arr8.length-1;while(intIndex<l8){curCat=arr8[intIndex+=1];out+=''+(curCat.category)+'\\line\\line ';} } out+='\\cell \\intbl '+(curGoal.status)+'\\cell \\intbl '+(curGoal.startDate)+'\\cell \\intbl '+(curGoal.targetDate)+'\\cell \\intbl '+(curGoal.comments)+'\\cell \\row ';} } }out+=' \\pard\\par\\par\\par ';if(it.data.futureGoals.length){out+=''+(it.data.m_futureGoalHeader)+' \\par \\trowd\\trgaph70 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx2000\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx4500\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx5600 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx6900 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx7700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx8700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx9700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx12300\\intbl '+(it.data.m_goalHeader)+'\\cell\\intbl '+(it.data.m_interHeader)+'\\cell\\intbl '+(it.data.m_typeHeader)+'\\cell \\intbl '+(it.data.m_catHeader)+'\\cell \\intbl '+(it.data.m_statusHeader)+'\\cell \\intbl '+(it.data.m_startDateHeader)+'\\cell \\intbl '+(it.data.m_targetDateHeader)+'\\cell \\intbl '+(it.data.m_commentHeader)+'\\cell\\row ';var arr9=it.data.futureGoals;if(arr9){var curGoal,index=-1,l9=arr9.length-1;while(index<l9){curGoal=arr9[index+=1];out+=' \\trowd\\trgaph70 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx2000\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx4500\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx5600 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx6900 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx7700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx8700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx9700 \\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs \\cellx12300\\intbl '+(curGoal.goal)+' \\cell \\intbl ';var arr10=curGoal.interventions;if(arr10){var curInt,intIndex=-1,l10=arr10.length-1;while(intIndex<l10){curInt=arr10[intIndex+=1];if(curInt.isMet){out+='(met)';}out+=''+(curInt.intervention)+'\\line\\line ';} } out+='\\cell \\intbl ';var arr11=curGoal.types;if(arr11){var curType,intIndex=-1,l11=arr11.length-1;while(intIndex<l11){curType=arr11[intIndex+=1];out+=''+(curType.type)+'\\line\\line ';} } out+='\\cell \\intbl ';var arr12=curGoal.categories;if(arr12){var curCat,intIndex=-1,l12=arr12.length-1;while(intIndex<l12){curCat=arr12[intIndex+=1];out+=''+(curCat.category)+'\\line\\line ';} } out+='\\cell \\intbl '+(curGoal.status)+'\\cell \\intbl '+(curGoal.startDate)+'\\cell \\intbl '+(curGoal.targetDate)+'\\cell \\intbl '+(curGoal.comments)+'\\cell \\row ';} } }out+=' \\pard\\par\\par\\par }';return out;
}var itself=goalsSave, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['goalsSave']=itself;}}());(function(){function goalHtmlBlock(param
/**/) {
var out='<li class ="gwf-goal-li"><div class="gwf-goal" id="'+(param.goal.OUTCOMEACTID)+'"><div class="gwf-goal-priority">';if((param.goal.METIND !== 1) && (param.goal.FUTUREIND===0)){out+='<span class="vertical-dots"></span><span class="priority-nbr">'+(param.goal.PRIORITY)+'</span>';}out+='</div><div class="gwf-goal-status-div"><div class=\'gwf-goal-status-select\' id=\'outcomeStatus'+(param.goal.OUTCOMEACTID)+'\' title=\''+(param.goal.GOAL_STATUS.CURRENT_STATUS_DISPLAY)+'\' catid=\''+(param.goal.OUTCOMECATID)+'\'>';if(param.goal.METIND === 1){out+='<span class=\'gwf-status-icon gwf-status-met\'></span>';}else if(param.goal.METIND !== 1){out+='<span class=\'gwf-status-icon gwf-status-unmet\'></span>';}out+='<span class=\'down-arrow\'></span></div></div><div class="gwf-goal-details"><div class="gwf-goal-details-1"><span class="gwf-goal-description">'+(param.goal.CURRENT_DESCRIPTION.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</span><div class="gwf-goal-creator-sec"><span class="gwf-goal-creator-lbl">'+(param.labels.creatorLabel)+':&nbsp;</span><span class="gwf-goal-creator">';if(param.goal.CREATOR){out+=''+(param.goal.CREATOR);}else if(!param.goal.CREATOR){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-target-sec"><span class="gwf-goal-target-lbl">'+(param.labels.targetLabel)+':&nbsp;</span><span class="gwf-goal-target">';if(param.goal.ENDDTTM){out+=''+(param.component.capitalizeFirstLetterOnly(param.goal.ENDDTTM));}else if(!param.goal.ENDDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-start-date-sec"><span class="gwf-goal-start-lbl">'+(param.labels.startLabel)+':&nbsp;</span><span class="gwf-goal-start-date">';if(param.goal.STARTDTTM){out+=''+(param.component.capitalizeFirstLetterOnly(param.goal.STARTDTTM));}else if(!param.goal.STARTDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div><div class="gwf-goal-details-2">';if(param.goal.ACTIVE_INTERVENTIONS_CNT > 0){out+='<span class="gwf-goal-expand-collapse expand-icon"></span><span class=\'gwf-goal-met-inter-cnt\'>'+(param.goal.MET_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.OF)+'&nbsp;'+(param.goal.ACTIVE_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.MET)+'</span>';}else if(param.goal.ACTIVE_INTERVENTIONS_CNT === 0){out+='<span class=\'gwf-no-interventions\'>'+(i18n.innov.GoalsWorkflowComponent.NO_INTERVENTIONS)+'</span>';}out+='<div class="gwf-goal-barriers-sec"><span class="gwf-goal-barriers-lbl">'+(param.labels.barrierLabel)+':&nbsp;</span><span class="gwf-goal-barriers">';if(param.goal.SAVED_BARRIER.length > 0){var arr1=param.goal.SAVED_BARRIER;if(arr1){var barrier,barrier_idx=-1,l1=arr1.length-1;while(barrier_idx<l1){barrier=arr1[barrier_idx+=1];if(param.goal.SAVED_BARRIER.length-1 === barrier_idx){out+=''+(barrier.DISPLAY);}else{out+=''+(barrier.DISPLAY)+',&nbsp;&#x200b;';}} } }else if(param.goal.SAVED_BARRIER.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-type-sec"><span class="gwf-goal-type-lbl">'+(param.labels.typeLabel)+':&nbsp;</span><span class="gwf-goal-type">';if(param.goal.SAVED_TYPE.length > 0){var arr2=param.goal.SAVED_TYPE;if(arr2){var type,type_idx=-1,l2=arr2.length-1;while(type_idx<l2){type=arr2[type_idx+=1];if(param.goal.SAVED_TYPE.length-1 === type_idx){out+=''+(type.DISPLAY);}else{out+=''+(type.DISPLAY)+',&nbsp;&#x200b;';}} } }else if(param.goal.SAVED_TYPE.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-category-sec"><span class="gwf-goal-category-lbl">'+(param.labels.categoryLabel)+':&nbsp;</span><span class="gwf-goal-category">';if(param.goal.SAVED_CATEGORY.length > 0){var arr3=param.goal.SAVED_CATEGORY;if(arr3){var category,cat_idx=-1,l3=arr3.length-1;while(cat_idx<l3){category=arr3[cat_idx+=1];if(param.goal.SAVED_CATEGORY.length-1 === cat_idx){out+=''+(category.DISPLAY);}else{out+=''+(category.DISPLAY)+',&nbsp;&#x200b;';}} } }else if(param.goal.SAVED_CATEGORY.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div></div><div class="gwf-goal-edit"><span class="goal-edit-icon" title="'+(i18n.innov.GoalsWorkflowComponent.EDIT)+'"></span></div><div class="gwf-goal-comment"><span class="goal-comment-icon ';if(param.goal.COMMENT){out+='comment-exists';}out+='" title="'+(i18n.innov.GoalsWorkflowComponent.COMMENT)+'"></span></div><div class="gwf-goal-interventions hidden">'+( param.component.getInterventionsTable(param.goal.INTERVENTIONS))+'</div></div></li>';return out;
}function singleGoalHtml(it
/**/) {
var out='<li class ="gwf-goal-li"><div class="gwf-goal" id="'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.OUTCOMEACTID)+'"><div class="gwf-goal-priority">';if(({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.METIND !== 1) && ({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.FUTUREIND===0)){out+='<span class="vertical-dots"></span><span class="priority-nbr">'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.PRIORITY)+'</span>';}out+='</div><div class="gwf-goal-status-div"><div class=\'gwf-goal-status-select\' id=\'outcomeStatus'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.OUTCOMEACTID)+'\' title=\''+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.GOAL_STATUS.CURRENT_STATUS_DISPLAY)+'\' catid=\''+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.OUTCOMECATID)+'\'>';if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.METIND === 1){out+='<span class=\'gwf-status-icon gwf-status-met\'></span>';}else if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.METIND !== 1){out+='<span class=\'gwf-status-icon gwf-status-unmet\'></span>';}out+='<span class=\'down-arrow\'></span></div></div><div class="gwf-goal-details"><div class="gwf-goal-details-1"><span class="gwf-goal-description">'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.CURRENT_DESCRIPTION.replace(/</g,"&lt;").replace(/>/g,"&gt;"))+'</span><div class="gwf-goal-creator-sec"><span class="gwf-goal-creator-lbl">'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.labels.creatorLabel)+':&nbsp;</span><span class="gwf-goal-creator">';if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.CREATOR){out+=''+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.CREATOR);}else if(!{goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.CREATOR){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-target-sec"><span class="gwf-goal-target-lbl">'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.labels.targetLabel)+':&nbsp;</span><span class="gwf-goal-target">';if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.ENDDTTM){out+=''+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.component.capitalizeFirstLetterOnly({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.ENDDTTM));}else if(!{goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.ENDDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-start-date-sec"><span class="gwf-goal-start-lbl">'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.labels.startLabel)+':&nbsp;</span><span class="gwf-goal-start-date">';if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.STARTDTTM){out+=''+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.component.capitalizeFirstLetterOnly({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.STARTDTTM));}else if(!{goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.STARTDTTM){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div><div class="gwf-goal-details-2">';if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.ACTIVE_INTERVENTIONS_CNT > 0){out+='<span class="gwf-goal-expand-collapse expand-icon"></span><span class=\'gwf-goal-met-inter-cnt\'>'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.MET_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.OF)+'&nbsp;'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.ACTIVE_INTERVENTIONS_CNT)+'&nbsp;'+(i18n.innov.GoalsWorkflowComponent.MET)+'</span>';}else if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.ACTIVE_INTERVENTIONS_CNT === 0){out+='<span class=\'gwf-no-interventions\'>'+(i18n.innov.GoalsWorkflowComponent.NO_INTERVENTIONS)+'</span>';}out+='<div class="gwf-goal-barriers-sec"><span class="gwf-goal-barriers-lbl">'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.labels.barrierLabel)+':&nbsp;</span><span class="gwf-goal-barriers">';if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_BARRIER.length > 0){var arr1={goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_BARRIER;if(arr1){var barrier,barrier_idx=-1,l1=arr1.length-1;while(barrier_idx<l1){barrier=arr1[barrier_idx+=1];if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_BARRIER.length-1 === barrier_idx){out+=''+(barrier.DISPLAY);}else{out+=''+(barrier.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_BARRIER.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-type-sec"><span class="gwf-goal-type-lbl">'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.labels.typeLabel)+':&nbsp;</span><span class="gwf-goal-type">';if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_TYPE.length > 0){var arr2={goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_TYPE;if(arr2){var type,type_idx=-1,l2=arr2.length-1;while(type_idx<l2){type=arr2[type_idx+=1];if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_TYPE.length-1 === type_idx){out+=''+(type.DISPLAY);}else{out+=''+(type.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_TYPE.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div><div class="gwf-goal-category-sec"><span class="gwf-goal-category-lbl">'+({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.labels.categoryLabel)+':&nbsp;</span><span class="gwf-goal-category">';if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_CATEGORY.length > 0){var arr3={goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_CATEGORY;if(arr3){var category,cat_idx=-1,l3=arr3.length-1;while(cat_idx<l3){category=arr3[cat_idx+=1];if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_CATEGORY.length-1 === cat_idx){out+=''+(category.DISPLAY);}else{out+=''+(category.DISPLAY)+',&nbsp;&#x200b;';}} } }else if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.SAVED_CATEGORY.length === 0){out+=''+(i18n.innov.GoalsWorkflowComponent.NONE);}out+='</span></div></div></div><div class="gwf-goal-edit"><span class="goal-edit-icon" title="'+(i18n.innov.GoalsWorkflowComponent.EDIT)+'"></span></div><div class="gwf-goal-comment"><span class="goal-comment-icon ';if({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.COMMENT){out+='comment-exists';}out+='" title="'+(i18n.innov.GoalsWorkflowComponent.COMMENT)+'"></span></div><div class="gwf-goal-interventions hidden">'+( {goal:it.goal,index:it.index, component:it.component, labels: it.labels}.component.getInterventionsTable({goal:it.goal,index:it.index, component:it.component, labels: it.labels}.goal.INTERVENTIONS))+'</div></div></li>';return out;
}var itself=singleGoalHtml, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());itself.goalHtmlBlock=goalHtmlBlock;if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['singleGoalHtml']=itself;}}());var GoalsAddEditWindow = function() {
	var goalData, goalIndex, newInterCount = 0;
	var detailLists, component, blankGoal, blankIntervention, originalGoal;
	var bedrockSettings, labels, oldGoalType;
	var modalName = "gwfGoalsAddEdit";

	function getOddEven(index) {
		return index % 2 === 1 ? "odd" : "even";
	}

	function setComponent(comp) {
		this.component = comp;
	}

	function getComponent() {
		return this.component;
	}

	function getBlankGoal() {
		return this.blankGoal;
	}

	function setOriginalGoal(goal) {
		this.originalGoal = jQuery.extend(true, {}, goal);
	}

	function getOriginalGoal(goal) {
		return this.originalGoal;
	}

	function getBlankIntervention() {
		return this.blankIntervention;
	}

	function getGoalData() {
		return this.goalData;
	}

	function setOldGoalType() {
		var goal = getGoalData();
		if (goal.FUTUREIND === 1) {
			this.oldGoalType = "future";
		}
		else if (goal.METIND === 1) {
			this.oldGoalType = "met";
		}
		else {
			this.oldGoalType = "unmet";
		}
	}

	function getOldGoalType() {
		return this.oldGoalType;
	}

	function setBlankGoalIntervention() {
		this.blankGoal = {
			"NEW_IND": 1,
			"MODIFIED_IND": 0,
			"DELETE_IND": 0,
			"OUTCOMECLASSCD": 0,
			"OUTCOMEACTID": 0,
			"OUTCOMECATID": 0,
			"SAVED_OUTCOMECATID": 0,
			"OUTCOMESTATUSCD": 0,
			"OUTCOMEENCNTRID": 0,
			"TASK_ASSAY_CD": 0,
			"SAVED_DESCRIPTION": "",
			"CURRENT_DESCRIPTION": "",
			"SELECTED_DESCRIPTION": "",
			"SELECTED_OUTCOMECATID": 0,
			"STARTDTTM": "",
			"ENDDTTM": "",
			"STARTDATE": "",
			"TARGETDATE": "",
			"SAVED_STARTDATE": "",
			"SAVED_TARGETDATE": "",
			"EXPECTATION": "",
			"METIND": 0,
			"FUTUREIND": 0,
			"UPDTCNT": 0,
			"PRIORITY": 0,
			"SAVED_PRIORITY": 0,
			"CREATOR": "",
			"SAVED_TYPE": [],
			"TYPE": [],
			"SAVED_CATEGORY": [],
			"CATEGORY": [],
			"SAVED_BARRIER": [],
			"BARRIER": [],
			"GOAL_STATUS": {
				"CURRENT_STATUS_CD": 0,
				"CURRENT_STATUS_DISPLAY": "",
				"SAVED_STATUS_CD": 0,
				"SAVED_STATUS_DISPLAY": ""
			},
			"MET_INTERVENTIONS_CNT": 0,
			"ACTIVE_INTERVENTIONS_CNT": 0,
			"TOTAL_INTERVENTIONS_CNT": 0,
			"LAST_MODIFICATION_DT_TM": 0,
			"LAST_MODIFICATION_DATE_DISPLAY": "",
			"LAST_MODIFIED_USER_ID": 0,
			"LAST_MODIFIED_USER": "",
			"INTERVENTIONS": [],
			"COMMENT": "",
			"EVENT_CD": 0,
			"CRITERIA": [],
			"RESULTS": [],
			"STATUSLIST": []
		};

		this.blankIntervention = {
			"OUTCOMEACTID": 0,
			"OUTCOMECATID": 0,
			"SAVED_OUTCOMECATID": 0,
			"OUTCOMESTATUSCD": 0,
			"OUTCOMECLASSCD": 0,
			"EVENT_CD": 0,
			"TASK_ASSAY_CD": 0,
			"UPDTCNT": 0,
			"EXPECTATION": "",
			"METIND": 0,
			"PRIORITY": 0,
			"SAVED_PRIORITY": 0,
			"NEW_IND": 1,
			"MODIFIED_IND": 0,
			"DELETE_IND": 0,
			"SAVED_DESCRIPTION": "",
			"CURRENT_DESCRIPTION": "",
			"SELECTED_DESCRIPTION": "",
			"SELECTED_OUTCOMECATID": 0,
			"SAVED_CONFIDENCE": "",
			"CURRENT_CONFIDENCE": "",
			"SAVED_TARGET_VAL": "",
			"CURRENT_TARGET_VAL": "",
			"CRITERIA": [],
			"RESULTS": [],
			"SAVED_TYPE": [],
			"TYPE": [],
			"SAVED_CATEGORY": [],
			"CATEGORY": [],
			"STATUS": {
				"CURRENT_STATUS_CD": 0,
				"CURRENT_STATUS_DISPLAY": "",
				"SAVED_STATUS_CD": 0,
				"SAVED_STATUS_DISPLAY": "",
				"STATUS_ICON": "status-unmet"
			},
			"FREQUENCY": {
				"CURRENT_FREQUENCY_CD": 0,
				"CURRENT_FREQUENCY_DISPLAY": "",
				"SAVED_FREQUENCY_CD": 0,
				"SAVED_FREQUENCY_DISPLAY": ""
			},
			"TARGETUNIT": {
				"CURRENT_TARGETUNIT_CD": 0,
				"CURRENT_TARGETUNIT_DISPLAY": "",
				"SAVED_TARGETUNIT_CD": 0,
				"SAVED_TARGETUNIT_DISPLAY": ""
			},
			"STATUSLIST": []
		};
	}

	function setDetailLists(optionLists) {
		this.detailLists = optionLists;
	}

	function getDetailLists() {
		return this.detailLists;
	}

	function getNewInterCount() {
		return this.newInterCount;
	}

	function resetNewInterCount() {
		this.newInterCount = 0;
	}

	function increaseNewInterCount() {
		this.newInterCount += 1;
	}

	function setGoalData(goal) {
		this.goalData = goal;
	}

	function setGoalIndex(index) {
		this.goalIndex = index;
	}

	function getGoalIndex() {
		return this.goalIndex;
	}

	function setBedrockSettings() {
		this.bedrockSettings = getComponent().getBedrockSettings();
	}

	function setLabels() {
		this.labels = {
			startLabel: this.bedrockSettings.startLabel || i18n.innov.GoalsWorkflowComponent.START,
			targetLabel: this.bedrockSettings.targetLabel || i18n.innov.GoalsWorkflowComponent.TARGET,
			typeLabel: this.bedrockSettings.typeLabel || i18n.innov.GoalsWorkflowComponent.TYPE,
			categoryLabel: this.bedrockSettings.categoryLabel || i18n.innov.GoalsWorkflowComponent.CATEGORY,
			barrierLabel: this.bedrockSettings.barrierLabel || i18n.innov.GoalsWorkflowComponent.BARRIERS,
			interventionLabel: this.bedrockSettings.interventionLabel || i18n.innov.GoalsWorkflowComponent.INTERVENTION,
			interTypeLabel: this.bedrockSettings.interTypeLabel || i18n.innov.GoalsWorkflowComponent.TYPE,
			interCategoryLabel: this.bedrockSettings.interCategoryLabel || i18n.innov.GoalsWorkflowComponent.CATEGORY,
			interStatusLabel: this.bedrockSettings.interStatusLabel || i18n.innov.GoalsWorkflowComponent.STATUS,
			interFrequencyLabel: this.bedrockSettings.interFrequencyLabel || i18n.innov.GoalsWorkflowComponent.FREQUENCY,
			interTargetLabel: this.bedrockSettings.interTargetLabel || i18n.innov.GoalsWorkflowComponent.TARGET,
			interConfidenceLabel: this.bedrockSettings.interConfidenceLabel || i18n.innov.GoalsWorkflowComponent.CONFIDENCE
		};
	}

	function getLabels() {
		return this.labels;
	}

	function getBedrockSettings() {
		return this.bedrockSettings;
	}

	function getInterventionId(target) {
		return $(target).closest("dl").find(".gwf-gae-inter-desc .gwf-gae-inter-description").attr("id");
	}

	function reArrangeRowColors() {
		var interRows = $("#gwf-gaetableBody dl");
		for (var i = interRows.length; i--; ) {
			$(interRows[i]).removeClass("odd").removeClass("even").addClass(getOddEven(i + 1));
		}
	}

	function createStatusHtml(statusList) {
		var statusHtml = [];
		statusHtml.push("<select class='gwf-gae-goal-status'><option selected disabled hidden>" + i18n.innov.GoalsWorkflowComponent.NONE + "</option>");
		for (var i = statusList.length; i--; ) {
			statusHtml.push("<option value='", statusList[i].CODE_VALUE, "'>", statusList[i].DISPLAY, "</option>");
		}
		statusHtml.push("</select>");
		return statusHtml.join("");
	}

	function priorityCompare(a, b) {
		if (a.PRIORITY < b.PRIORITY) {
			return -1;
		}
		if (a.PRIORITY > b.PRIORITY) {
			return 1;
		}
		return 0;
	}

	function attachGoalTextareaEvent() {
		$(".gwf-gae-goal-sec textarea:not([saved])").unbind().autocomplete({
			source: function(request, response) {
				function searchOutcomesResponseHandler(scriptReply) {
					var results = scriptReply.getResponse();
					var suggestResults = [];
					if(results.LIST.length > 0) {
						for (var i = 0, j = results.LIST.length; i < j; i++) {
							suggestResults.push({
								label: results.LIST[i].DESCRIPTION,
								value: results.LIST[i].OUTCOMECATID
							});
						}
						response(suggestResults);
					}
					else {
						suggestResults.push({
								label: i18n.innov.GoalsWorkflowComponent.NO_RESULTS_FOUND,
								value: -1
						});
						response(suggestResults);
					}
				}
				var programName = "INN_MP_SEARCH_OUTCOMES";
				var parameterArray = ["^MINE^", "@" + request.term.length +":"+ request.term + "@", 5, 20, 0, "value(" + (getBedrockSettings().goalSearchClassCds.join(".0,") || "0.0") + ")"];
				var component = getComponent();
				component.requestData(searchOutcomesResponseHandler, component, programName, parameterArray);
			},
			minLength: 2,
			delay: 500,
			select: function(event, ui) {
				if (ui.item.value === -1) {
					return false;
				}
				var goalTextarea = this;
				$(goalTextarea).val(ui.item.label);
				$(goalTextarea).parent().find(".goal-text-counter").text(ui.item.label.length + "/100");
				var goal = getGoalData();
				goal.OUTCOMECATID = ui.item.value;
				goal.CURRENT_DESCRIPTION = ui.item.label;
				goal.SELECTED_OUTCOMECATID = ui.item.value;
				goal.SELECTED_DESCRIPTION = ui.item.label;
				function getStatusListResponseHandler(scriptReply) {
					handleGoalStatusesReply(scriptReply, goal, goalTextarea);
				}
				
				var programName = "INN_MP_GWF_GET_STATUSES";
				var parameterArray = ["^MINE^", ui.item.value + ".0"];
				var component = getComponent();
				component.requestData(getStatusListResponseHandler, component, programName, parameterArray);
				setGoalData(goal);
				checkSaveEligibility();
				return false;
			},
			open: function(event, ui) {
				$(this).css("z-index", "2000");
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close: function(event, ui) {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			},
			focus: function(event, ui) {
				event.preventDefault();
				//ui.item.value of -1 checks for No Results found and 
				//event.which will be >0 if the focus to list items is through keyboard instead of mouse.
				if(ui.item.value !== -1 && event.which > 0){
					$(this).val(ui.item.label);
				}
			}
		});
		$(".gwf-gae-goal-sec textarea").keydown(function(e) {
			if ($(e.target).val().length >= 100) {
				if (e.keyCode === 46 || e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
					return true;
				}
				else {
					return false;
				}
			}
		}).keyup(function(event) {
			var goal = getGoalData();
			var tempStr = $(event.target).val();
			goal.CURRENT_DESCRIPTION = tempStr.replace(/"/g, '\"');
			$(event.target).parent().find(".goal-text-counter").text(goal.CURRENT_DESCRIPTION.length + "/100");
			if (goal.CURRENT_DESCRIPTION !== goal.SELECTED_DESCRIPTION) {
				if (parseFloat(goal.OUTCOMECATID) !== parseFloat(getDetailLists().goalCatalogId)) {
					goal.OUTCOMECATID = getDetailLists().goalCatalogId;
					function getStatusListResponseHandler(scriptReply) {
						handleGoalStatusesReply(scriptReply, goal, event.target);
					}
					var programName = "INN_MP_GWF_GET_STATUSES";
					var parameterArray = ["^MINE^", goal.OUTCOMECATID + ".0"];
					var component = getComponent();
					component.requestData(getStatusListResponseHandler, component, programName, parameterArray);
				}
			}
			setGoalData(goal);
			checkSaveEligibility();
		});
	}
	function datePickerShortcut(event){
		if(event.keyCode === 84){
			$(event.target).datepicker("setDate", new Date());
		}
	}
	
	function bindStartDatePicker() {
		var parsedDate = $.datepicker.parseDate("mm/dd/yy", getGoalData().STARTDATE)
		$("input.gwf-gae-start").unbind().datepicker({
			changeMonth: true,
			changeYear: true,
			showAnim: "slideDown"
		}).datepicker("setDate", parsedDate).keydown(datePickerShortcut);
	}

	function bindTargetDatePicker() {
		var parsedDate = $.datepicker.parseDate("mm/dd/yy", getGoalData().TARGETDATE)
		$("input.gwf-gae-target").unbind().datepicker({
			changeMonth: true,
			changeYear: true,
			showAnim: "slideDown"
		}).datepicker("setDate", parsedDate).keydown(datePickerShortcut);
	}

	function attachGoalStartEvent() {
		$(".gwf-gae-start").unbind("change").change(function(event) {
			var goal = getGoalData();
			var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
			var startDate = new Date($(event.target).val());
			if (startDate > new Date()) {
				goal.FUTUREIND = 1;
				if(!$(".gwf-gae-goal-status-sec").hasClass('hidden')){
					$(".gwf-gae-goal-status-sec").addClass('hidden');
				}
			}
			else {
				goal.FUTUREIND = 0;
				$(".gwf-gae-goal-status-sec").removeClass('hidden');
			}
			goal.STARTDATE = $(event.target).val();
			goal.STARTDTTM = monthNames[startDate.getMonth()] + ". " + startDate.getDate() + ", " + startDate.getFullYear();
			if (startDate > new Date(goal.TARGETDATE)) {
				goal.TARGETDATE = "";
				$(".gwf-gae-target").datepicker("setDate", "");
			}
			setGoalData(goal);
			$(".gwf-gae-target").datepicker("option", "minDate", startDate);
			checkSaveEligibility();
		});
	}

	function attachGoalTargetEvent() {
		$(".gwf-gae-target").unbind("change").change(function(event) {
			var goal = getGoalData();
			var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
			goal.TARGETDATE = $(event.target).val();
			var endDt = new Date($(event.target).val());
			goal.ENDDTTM = monthNames[endDt.getMonth()] + ". " + endDt.getDate() + ", " + endDt.getFullYear();
			setGoalData(goal);
			checkSaveEligibility();
		});
	}

	function attachGoalCategoryEvent() {
		$(".gwf-gae-category-sec select").unbind().multiselect({
			header: false,
			noneSelectedText: i18n.innov.GoalsWorkflowComponent.NONE,
			click: function(event, ui) {
				var goal = getGoalData();
				var existIndex = -1;
				for (var i = goal.CATEGORY.length; i--; ) {
					if (parseFloat(goal.CATEGORY[i].CODE_VALUE) === parseFloat(ui.value)) {
						existIndex = i;
					}
				}
				if (ui.checked) {
					if (existIndex >= 0) {
						goal.CATEGORY[existIndex].CHECKED_IND = 1;
					}
					else {
						goal.CATEGORY.push({
							"CODE_VALUE": parseFloat(ui.value),
							"DISPLAY": ui.text,
							"CHECKED_IND": 1
						});
					}
				}
				else {
					if (existIndex >= 0) {
						goal.CATEGORY[existIndex].CHECKED_IND = 0;
					}
					else {
						goal.CATEGORY.push({
							"CODE_VALUE": parseFloat(ui.value),
							"DISPLAY": ui.text,
							"CHECKED_IND": 0
						});
					}
				}
				setGoalData(goal);
				checkSaveEligibility();
			},
			close: function(event, ui) {
				checkSaveEligibility();
			}
		});
	}

	function attachGoalBarriersEvent() {
		$(".gwf-gae-barriers-sec select").unbind().multiselect({
			header: false,
			noneSelectedText: i18n.innov.GoalsWorkflowComponent.NONE,
			click: function(event, ui) {
				var goal = getGoalData();
				var existIndex = -1;
				for (var i = goal.BARRIER.length; i--; ) {
					if (parseFloat(goal.BARRIER[i].CODE_VALUE) === parseFloat(ui.value)) {
						existIndex = i;
					}
				}
				if (ui.checked) {
					if (existIndex >= 0) {
						goal.BARRIER[existIndex].CHECKED_IND = 1;
					}
					else {
						goal.BARRIER.push({
							"CODE_VALUE": parseFloat(ui.value),
							"DISPLAY": ui.text,
							"CHECKED_IND": 1
						});
					}
				}
				else {
					if (existIndex >= 0) {
						goal.BARRIER[existIndex].CHECKED_IND = 0;
					}
					else {
						goal.BARRIER.push({
							"CODE_VALUE": parseFloat(ui.value),
							"DISPLAY": ui.text,
							"CHECKED_IND": 0
						});
					}
				}
				setGoalData(goal);
				checkSaveEligibility();
			},
			close: function(event, ui) {
				checkSaveEligibility();
			}
		});
	}

	function attachGoalTypeEvent() {
		$(".gwf-gae-type-sec select").unbind().multiselect({
			header: false,
			noneSelectedText: i18n.innov.GoalsWorkflowComponent.NONE,
			click: function(event, ui) {
				var goal = getGoalData();
				var existIndex = -1;
				for (var i = goal.TYPE.length; i--; ) {
					if (parseFloat(goal.TYPE[i].CODE_VALUE) === parseFloat(ui.value)) {
						existIndex = i;
					}
				}
				if (ui.checked) {
					if (existIndex >= 0) {
						goal.TYPE[existIndex].CHECKED_IND = 1;
					}
					else {
						goal.TYPE.push({
							"CODE_VALUE": parseFloat(ui.value),
							"DISPLAY": ui.text,
							"CHECKED_IND": 1
						});
					}
				}
				else {
					if (existIndex >= 0) {
						goal.TYPE[existIndex].CHECKED_IND = 0;
					}
					else {
						goal.TYPE.push({
							"CODE_VALUE": parseFloat(ui.value),
							"DISPLAY": ui.text,
							"CHECKED_IND": 0
						});
					}
				}
				setGoalData(goal);
				checkSaveEligibility();
			},
			close: function(event, ui) {
				checkSaveEligibility();
			}
		});
	}
	
	function attachGoalStatusEvent() {
		$(".gwf-gae-goal-status").unbind().change(function(event) {
			var goal = getGoalData();
			goal.GOAL_STATUS.CURRENT_STATUS_DISPLAY = $(event.target).find("option:selected").text();
			goal.GOAL_STATUS.CURRENT_STATUS_CD = parseFloat($(event.target).find("option:selected").val());
			setGoalData(goal);
			checkSaveEligibility();
		});
	}

	function attachAddInterventionEvent() {
		$(".gwf-gae-add-intervention").unbind().click(function(event) {
			increaseNewInterCount();
			var goal = getGoalData();
			goal.TOTAL_INTERVENTIONS_CNT = goal.TOTAL_INTERVENTIONS_CNT + 1;
			goal.ACTIVE_INTERVENTIONS_CNT = goal.ACTIVE_INTERVENTIONS_CNT + 1;
			var inter = jQuery.extend(true, {}, getBlankIntervention());
			inter.OUTCOMEACTID = getNewInterCount();
			inter.PRIORITY = $("#gwf-gaetableBody div dl").length + 1;
			goal.INTERVENTIONS.push(inter);
			setGoalData(goal);
			if ($("#gwf-gaetableBody div dl").length > 0) {
				var newInterventionHtml = window.render.gaeSingleIntervention({
					intervention: inter,
					index: goal.INTERVENTIONS.length - 1,
					detailLists: getDetailLists()
				});
				$("#gwf-gaetableBody div").append(newInterventionHtml);
			}
			else {
				var interventionsHtml = window.render.gaeInterventions({
					goal: goal,
					detailLists: getDetailLists(),
					labels: getLabels(),
					bedrockSettings: getBedrockSettings()
				});
				$(".gwf-gae-goal-interventions-sec").html(interventionsHtml);
			}
			attachInterventionEvents();
			checkSaveEligibility();
		});
	}
	
	function handleGoalStatusesReply(reply, goal, goalTextarea) {
		var response = reply.getResponse();
		goal.STATUSLIST = response.STATUSLIST;
		var statusHtml = createStatusHtml(response.STATUSLIST);
		$(goalTextarea).closest(".gwf-gae-goal-info-sec").find(".gwf-gae-goal-status").replaceWith(statusHtml);
		$(goalTextarea).closest(".gwf-gae-goal-info-sec").find(".gwf-gae-goal-status").change(function(changeEvent) {
			goal.GOAL_STATUS.CURRENT_STATUS_DISPLAY = $(changeEvent.target).find("option:selected").text();
			goal.GOAL_STATUS.CURRENT_STATUS_CD = parseFloat($(changeEvent.target).find("option:selected").val());
			checkSaveEligibility();
		});
	}

	function handleInterStatusesReply(reply, goal, i, interTextarea) {
		var response = reply.getResponse();
		goal.INTERVENTIONS[i].STATUSLIST = response.STATUSLIST;
		var statusHtml = createStatusHtml(response.STATUSLIST);
		$(interTextarea).closest("dl").find(".gwf-gae-inter-status").html(statusHtml);
		$(interTextarea).closest("dl").find(".gwf-gae-inter-status select").change(function(changeEvent) {
			goal.INTERVENTIONS[i].STATUS.CURRENT_STATUS_DISPLAY = $(changeEvent.target).find("option:selected").text();
			goal.INTERVENTIONS[i].STATUS.CURRENT_STATUS_CD = parseFloat($(changeEvent.target).find("option:selected").val());
			checkSaveEligibility();
		});
	}
	
	function attachInterTextareaEvent() {
		$(".gwf-gae-inter-desc textarea:not([saved])").unbind().autocomplete({
			source: function(request, response) {
				function interSearchOutcomesResponseHandler(scriptReply) {
					var results = scriptReply.getResponse();
					var suggestResults = [];
					if(results.LIST.length > 0) {
						for (var i = 0, j = results.LIST.length; i < j; i++) {
							suggestResults.push({
								label: results.LIST[i].DESCRIPTION,
								value: results.LIST[i].OUTCOMECATID
							});
						}
						response(suggestResults);
					}
					else {
						suggestResults.push({
							label: i18n.innov.GoalsWorkflowComponent.NO_RESULTS_FOUND,
							value: -1
						});
						response(suggestResults);
					}
				}
				var programName = "INN_MP_SEARCH_OUTCOMES";
				var parameterArray = ["^MINE^", "@" + request.term.length +":"+ request.term + "@", 6, 20, 0, "value(" + (getBedrockSettings().goalSearchClassCds.join(".0,") || "0.0") + ")"];
				var component = getComponent();
				component.requestData(interSearchOutcomesResponseHandler, component, programName, parameterArray);

			},
			minLength: 2,
			delay: 500,
			select: function(event, ui) {
				if (ui.item.value === -1) {
					return false;
				}
				var interTextarea = this;
				$(interTextarea).val(ui.item.label);
				$(interTextarea).parent().find(".inter-text-counter").text(ui.item.label.length + "/100");
				var interventionId = $(interTextarea).attr("id");
				var goal = getGoalData();
				for (var i = goal.TOTAL_INTERVENTIONS_CNT; i--; ) {
					if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interventionId)) {
						if (parseFloat(goal.INTERVENTIONS[i].OUTCOMECATID) !== parseFloat(ui.item.value)) {
							goal.INTERVENTIONS[i].OUTCOMECATID = ui.item.value;
							goal.INTERVENTIONS[i].SELECTED_OUTCOMECATID = ui.item.value;
							goal.INTERVENTIONS[i].CURRENT_DESCRIPTION = ui.item.label;
							goal.INTERVENTIONS[i].SELECTED_DESCRIPTION = ui.item.label;
							function getStatusListResponseHandler(scriptReply) {
								handleInterStatusesReply(scriptReply, goal, i, interTextarea);
							}
							
							var programName = "INN_MP_GWF_GET_STATUSES";
							var parameterArray = ["^MINE^", ui.item.value + ".0"];
							var component = getComponent();
							component.requestData(getStatusListResponseHandler, component, programName, parameterArray);
						}
						break;
					}
				}
				setGoalData(goal);
				checkSaveEligibility();
				return false;
			},
			open: function(event, ui) {
				$(this).css("z-index", "2000");
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close: function(event, ui) {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			},
			focus: function(event, ui) {
				event.preventDefault();
				//ui.item.value of -1 checks for No Results found and 
				//event.which will be >0 if the focus to list items is through keyboard instead of mouse.
				if(ui.item.value !== -1 && event.which > 0){ 
					$(this).val(ui.item.label);
				}
			}
		});
		$(".gwf-gae-inter-desc textarea").keydown(function(e) {
			if ($(e.target).val().length >= 100) {
				if (e.keyCode === 46 || e.keyCode === 8 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
					return true;
				}
				else {
					return false;
				}
			}
		}).keyup(function(event) {
			var interId = getInterventionId(event.target);
			var goal = getGoalData();
			for (var i = goal.INTERVENTIONS.length; i--; ) {
				if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interId)) {
					var tempStr = $(event.target).val();
					goal.INTERVENTIONS[i].CURRENT_DESCRIPTION = tempStr.replace(/"/g, '\"');
					$(event.target).parent().find(".inter-text-counter").text(goal.INTERVENTIONS[i].CURRENT_DESCRIPTION.length + "/100");
					if (goal.INTERVENTIONS[i].CURRENT_DESCRIPTION !== goal.INTERVENTIONS[i].SELECTED_DESCRIPTION) {
						if (parseFloat(goal.INTERVENTIONS[i].OUTCOMECATID) !== parseFloat(getDetailLists().interventionCatalogId)) {
							goal.INTERVENTIONS[i].OUTCOMECATID = getDetailLists().interventionCatalogId;
							function getStatusListResponseHandler(scriptReply) {
								handleInterStatusesReply(scriptReply, goal, i, event.target);
							}
							var programName = "INN_MP_GWF_GET_STATUSES";
							var parameterArray = ["^MINE^", goal.INTERVENTIONS[i].OUTCOMECATID + ".0"];
							var component = getComponent();
							component.requestData(getStatusListResponseHandler, component, programName, parameterArray);

						}
					}
					break;
				}
			}
			setGoalData(goal);
			checkSaveEligibility();
		});
	}

	function attachInterTargetEvent() {
		$(".gwf-gae-inter-target-val").unbind().keypress(function(e) {
			if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
				return false;
			}
		}).keyup(function(event) {
			var interId = getInterventionId(event.target);
			var goal = getGoalData();
			for (var i = goal.INTERVENTIONS.length; i--; ) {
				if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interId)) {
					goal.INTERVENTIONS[i].CURRENT_TARGET_VAL = $(event.target).val();
					break;
				}
			}
			setGoalData(goal);
			checkSaveEligibility();
		});

		$(".gwf-gae-inter-target select").unbind().change(function(event) {
			var interId = getInterventionId(event.target);
			var goal = getGoalData();
			for (var i = goal.INTERVENTIONS.length; i--; ) {
				if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interId)) {
					goal.INTERVENTIONS[i].TARGETUNIT.CURRENT_TARGETUNIT_DISPLAY = $(event.target).find("option:selected").text();
					goal.INTERVENTIONS[i].TARGETUNIT.CURRENT_TARGETUNIT_CD = parseFloat($(event.target).find("option:selected").val());
					break;
				}
			}
			setGoalData(goal);
			checkSaveEligibility();
		});
	}

	function attachInterCategoryEvent() {
		$(".gwf-gae-inter-category select").unbind().multiselect({
			header: false,
			noneSelectedText: i18n.innov.GoalsWorkflowComponent.NONE,
			click: function(event, ui) {
				var interId = getInterventionId(this);
				var goal = getGoalData();
				var existIndex = -1;
				for (var i = goal.INTERVENTIONS.length; i--; ) {
					if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interId)) {
						for (var j = goal.INTERVENTIONS[i].CATEGORY.length; j--; ) {
							if (parseFloat(goal.INTERVENTIONS[i].CATEGORY[j].CODE_VALUE) === parseFloat(ui.value)) {
								existIndex = j;
								break;
							}
						}
						if (ui.checked) {
							if (existIndex >= 0) {
								goal.INTERVENTIONS[i].CATEGORY[existIndex].CHECKED_IND = 1;
							}
							else {
								goal.INTERVENTIONS[i].CATEGORY.push({
									"CODE_VALUE": parseFloat(ui.value),
									"DISPLAY": ui.text,
									"CHECKED_IND": 1
								});
							}
						}
						else {
							if (existIndex >= 0) {
								goal.INTERVENTIONS[i].CATEGORY[existIndex].CHECKED_IND = 0;
							}
							else {
								goal.INTERVENTIONS[i].CATEGORY.push({
									"CODE_VALUE": parseFloat(ui.value),
									"DISPLAY": ui.text,
									"CHECKED_IND": 0
								});
							}
						}
						break;
					}
				}
				setGoalData(goal);
				checkSaveEligibility();
			},
			close: function(event, ui) {
				checkSaveEligibility();
			}
		});
	}

	function attachInterTypeEvent() {
		$(".gwf-gae-inter-type select").unbind().multiselect({
			header: false,
			noneSelectedText: i18n.innov.GoalsWorkflowComponent.NONE,
			click: function(event, ui) {
				var interId = getInterventionId(this);
				var goal = getGoalData();
				var existIndex = -1;
				for (var i = goal.INTERVENTIONS.length; i--; ) {
					if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interId)) {
						for (var j = goal.INTERVENTIONS[i].TYPE.length; j--; ) {
							if (parseFloat(goal.INTERVENTIONS[i].TYPE[j].CODE_VALUE) === parseFloat(ui.value)) {
								existIndex = j;
								break;
							}
						}
						if (ui.checked) {
							if (existIndex >= 0) {
								goal.INTERVENTIONS[i].TYPE[existIndex].CHECKED_IND = 1;
							}
							else {
								goal.INTERVENTIONS[i].TYPE.push({
									"CODE_VALUE": parseFloat(ui.value),
									"DISPLAY": ui.text,
									"CHECKED_IND": 1
								});
							}
						}
						else {
							if (existIndex >= 0) {
								goal.INTERVENTIONS[i].TYPE[existIndex].CHECKED_IND = 0;
							}
							else {
								goal.INTERVENTIONS[i].TYPE.push({
									"CODE_VALUE": parseFloat(ui.value),
									"DISPLAY": ui.text,
									"CHECKED_IND": 0
								});
							}
						}
						break;
					}
				}
				setGoalData(goal);
				checkSaveEligibility();
			},
			close: function(event, ui) {
				checkSaveEligibility();
			}
		});
	}

	function attachInterFrequencyEvent() {
		$(".gwf-gae-inter-frequency select").unbind().change(function(event) {
			var interId = getInterventionId(event.target);
			var goal = getGoalData();
			for (var i = goal.INTERVENTIONS.length; i--; ) {
				if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interId)) {
					goal.INTERVENTIONS[i].FREQUENCY.CURRENT_FREQUENCY_DISPLAY = $(event.target).find("option:selected").text();
					goal.INTERVENTIONS[i].FREQUENCY.CURRENT_FREQUENCY_CD = parseFloat($(event.target).find("option:selected").val());
					break;
				}
			}
			setGoalData(goal);
			checkSaveEligibility();
		});
	}

	function attachInterStatusEvent() {
		$(".gwf-gae-inter-status select").unbind().change(function(event) {
			var interId = getInterventionId(event.target);
			var goal = getGoalData();
			for (var i = goal.INTERVENTIONS.length; i--; ) {
				if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interId)) {
					goal.INTERVENTIONS[i].STATUS.CURRENT_STATUS_DISPLAY = $(event.target).find("option:selected").text();
					goal.INTERVENTIONS[i].STATUS.CURRENT_STATUS_CD = parseFloat($(event.target).find("option:selected").val());
					break;
				}
			}
			setGoalData(goal);
			checkSaveEligibility();
		});
	}

	function attachInterConfidenceEvent() {
		$(".gwf-gae-inter-confidence select").unbind().change(function(event) {
			var interId = getInterventionId(event.target);
			var goal = getGoalData();
			for (var i = goal.INTERVENTIONS.length; i--; ) {
				if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interId)) {
					goal.INTERVENTIONS[i].CURRENT_CONFIDENCE = $(event.target).find("option:selected").val();
					break;
				}
			}
			setGoalData(goal);
			checkSaveEligibility();
		});
	}

	function attachInterDeleteEvent() {
		$("#gwf-gaetableBody .gwf-gae-inter-delete-icon").unbind().click(function(event) {
			if (confirm(i18n.innov.GoalsWorkflowComponent.INTERVENTION_DELETE)) {
				var interventionId = $(event.target).closest("dl").find(".gwf-gae-inter-desc .gwf-gae-inter-description").attr("id");
				var goal = getGoalData();
				getComponent().logCapTimer("");
				for (var i = goal.TOTAL_INTERVENTIONS_CNT; i--; ) {
					if (String(goal.INTERVENTIONS[i].OUTCOMEACTID) === String(interventionId)) {
						if (goal.INTERVENTIONS[i].METIND === 1) {
							goal.MET_INTERVENTIONS_CNT = goal.MET_INTERVENTIONS_CNT - 1;
						}
						if (goal.INTERVENTIONS[i].NEW_IND === 1) {
							goal.INTERVENTIONS.splice(i, 1);
							goal.TOTAL_INTERVENTIONS_CNT = goal.TOTAL_INTERVENTIONS_CNT - 1;
						}
						else {
							goal.INTERVENTIONS[i].DELETE_IND = 1;
						}
						goal.ACTIVE_INTERVENTIONS_CNT = goal.ACTIVE_INTERVENTIONS_CNT - 1;

						if ($(event.target).closest("#gwf-gaetableBody div").find("dl").length > 1) {
							$(event.target).closest("dl").remove();
							reArrangeRowColors();
						}
						else {
							$(event.target).closest("#gwf-gaetable").remove();
						}
						break;
					}
				}
				setGoalData(goal);
				checkSaveEligibility();
			}
		});
	}

	function attachInterSortingEvent() {
		$("#gwf-gaetableBody div").sortable({
			handle: ".gwf-gae-inter-priority",
			axis: "y",
			contaiment: "parent",
			cursor: "move",
			distance: "5",
			revert: true,
			scroll: true,
			tolerance: "pointer",
			placeholder: "sortable-placeholder",
			forcePlaceholderSize: true,
			cursor: "url('../images/closedhand.cur'),move",
			stop: function(event, ui) {
				$("#gwf-gaetableBody div .gwf-gae-inter-priority span.priority-nbr").text(function(i, c) {
					return (i + 1);
				});
				var goal = getGoalData();
				var goalInterventionsLength = goal.INTERVENTIONS.length;
				var interventions = $(event.target).closest("div").find("dl");
				for (var i = interventions.length; i--; ) {
					var outcomeActId = $(interventions[i]).find(".gwf-gae-inter-desc .gwf-gae-inter-description").attr("id");
					for (var j = 0; j < goalInterventionsLength; j++) {
						if (String(outcomeActId) === String(goal.INTERVENTIONS[j].OUTCOMEACTID)) {
							goal.INTERVENTIONS[j].PRIORITY = i + 1;
						}
					}
				}
				goal.INTERVENTIONS.sort(priorityCompare);
				setGoalData(goal);
				reArrangeRowColors();
			},
			start: function(event, ui) {
				ui.placeholder.height(ui.item.height() + 10);
			}
		});
	}

	function attachInterventionEvents() {
		attachInterTextareaEvent();
		attachInterTargetEvent();
		attachInterCategoryEvent();
		attachInterTypeEvent();
		attachInterFrequencyEvent();
		attachInterStatusEvent();
		attachInterConfidenceEvent();
		attachInterDeleteEvent();
		attachInterSortingEvent();
	}

	function attachEvents() {
		attachInterventionEvents();
		attachGoalTextareaEvent();
		bindStartDatePicker();
		bindTargetDatePicker();
		attachGoalStartEvent();
		attachGoalTargetEvent();
		attachGoalCategoryEvent();
		attachGoalBarriersEvent();
		attachGoalTypeEvent();
		attachGoalStatusEvent();
		attachAddInterventionEvent();
	}

	function checkCatalogIds() {
		var goalData = getGoalData();
		if (parseFloat(goalData.OUTCOMECATID) <= 0.0) {
			return false;
		}
		for (var i = goalData.INTERVENTIONS.length; i--; ) {
			if (parseFloat(goalData.INTERVENTIONS[i].OUTCOMECATID) <= 0.0) {
				return false;
			}
		}
		return true;
	}

	function showDitheredSaveButton() {
		if (!$("#"+modalName+"footerbtnCont #save").hasClass("hidden")) {
			$("#"+modalName+"footerbtnCont #save").addClass("hidden");
		}
		$("#"+modalName+"footerbtnCont #saveDithered").removeClass("hidden");
	}

	function showActiveSaveButton() {
		$("#"+modalName+"footerbtnCont #save").removeClass("hidden");
		if (!$("#"+modalName+"footerbtnCont #saveDithered").hasClass("hidden")) {
			$("#"+modalName+"footerbtnCont #saveDithered").addClass("hidden");
		}
	}

	function checkSaveEligibility() {
		var component = getComponent();
		var interventions = $("#gwf-gaetableBody div dl");
		var bedrockSettings = getComponent().getBedrockSettings();
		var dateReg = /^\d{2}([./-])\d{2}\1\d{4}$/;
		var startDate = $(".gwf-gae-start-sec input").val();
		var targetDate = $(".gwf-gae-target-sec input").val();
		var showingDithered = 0;

		if ($(".gwf-gae-goal-sec textarea").length && !$(".gwf-gae-goal-sec textarea").val()) {
			showingDithered = 1;
			showDitheredSaveButton();
		}
		else if (bedrockSettings.startRequiredInd && (!startDate || !startDate.match(dateReg))) {
			showingDithered = 1;
			showDitheredSaveButton();
		}
		else if (bedrockSettings.targetRequiredInd && (!targetDate || !targetDate.match(dateReg))) {
			showingDithered = 1;
			showDitheredSaveButton();
		}
		else if (bedrockSettings.typeRequiredInd && ($(".gwf-gae-type-sec select").find("option:selected").length === 0)) {
			showingDithered = 1;
			showDitheredSaveButton();
		}
		else if (bedrockSettings.categoryRequiredInd && ($(".gwf-gae-category-sec select").find("option:selected").length === 0)) {
			showingDithered = 1;
			showDitheredSaveButton();
		}
		else if (bedrockSettings.barrierRequiredInd && ($(".gwf-gae-barriers-sec select").find("option:selected:not(:disabled)").length === 0)) {
			showingDithered = 1;
			showDitheredSaveButton();
		}
		else if (bedrockSettings.interventionRequired && (interventions.length === 0)) {
			showingDithered = 1;
			showDitheredSaveButton();
		}
		if (showingDithered !== 1) {
			for (var i = interventions.length; i--; ) {
				if ($(interventions[i]).find(".gwf-gae-inter-desc textarea").length && !$(interventions[i]).find(".gwf-gae-inter-desc textarea").val()) {
					showingDithered = 1;
					showDitheredSaveButton();
					break;
				}
				else if (bedrockSettings.interTypeRequiredInd && ($(interventions[i]).find(".gwf-gae-inter-type select").find("option:selected").length === 0)) {
					showingDithered = 1;
					showDitheredSaveButton();
					break;
				}
				else if (bedrockSettings.interCategoryRequiredInd && ($(interventions[i]).find(".gwf-gae-inter-category select option:selected").length === 0)) {
					showingDithered = 1;
					showDitheredSaveButton();
					break;
				}
				else if (bedrockSettings.interStatusRequiredInd && ($(interventions[i]).find(".gwf-gae-inter-status select option:selected:not(:disabled)").length === 0)) {
					showingDithered = 1;
					showDitheredSaveButton();
					break;
				}
				else if (bedrockSettings.interFrequencyRequiredInd && ($(interventions[i]).find(".gwf-gae-inter-frequency select option:selected:not(:disabled)").length === 0)) {
					showingDithered = 1;
					showDitheredSaveButton();
					break;
				}
				else if (bedrockSettings.interTargetRequiredInd && (($(interventions[i]).find(".gwf-gae-inter-target select option:selected:not(:disabled)").length === 0) || (!$(interventions[i]).find(".gwf-gae-inter-target input").val()))) {
					showingDithered = 1;
					showDitheredSaveButton();
					break;
				}
				else if (bedrockSettings.interConfidenceRequiredInd && ($(interventions[i]).find(".gwf-gae-inter-confidence select option:selected:not(:disabled)").length === 0)) {
					showingDithered = 1;
					showDitheredSaveButton();
					break;
				}
			}
		}

		if (!showingDithered) {
			showActiveSaveButton();
		}
	}

	function setModifiedIndicators() {
		var goalData = getGoalData();
		var i = 0, j = 0;
		if (goalData.NEW_IND !== 1) {
			var originalGoal = getOriginalGoal();
			var xGoalData = jQuery.extend(true, {}, goalData);
			xGoalData.INTERVENTIONS = [];
			var xOriginalGoal = jQuery.extend(true, {}, originalGoal);
			xOriginalGoal.INTERVENTIONS = [];
			goalData.MODIFIED_IND = (JSON.stringify(xGoalData) === JSON.stringify(xOriginalGoal)) ? 0 : 1;
			for ( i = goalData.INTERVENTIONS.length; i--; ) {
				if (goalData.INTERVENTIONS[i].NEW_IND !== 1 && goalData.INTERVENTIONS[i].DELETE_IND !== 1) {
					for ( j = originalGoal.INTERVENTIONS.length; j--; ) {
						if (originalGoal.INTERVENTIONS[j].OUTCOMEACTID === goalData.INTERVENTIONS[i].OUTCOMEACTID) {
							goalData.INTERVENTIONS[i].MODIFIED_IND = (JSON.stringify(goalData.INTERVENTIONS[i]) === JSON.stringify(originalGoal.INTERVENTIONS[j])) ? 0 : 1;
						}
					}
				}
			}
		}
		setGoalData(goalData);
	}

	function createNewDialog(dialogTitle) {
		var goalsAddEditDialog = new ModalDialog(modalName);
		goalsAddEditDialog.setTopMarginPercentage(15).setRightMarginPercentage(15).setBottomMarginPercentage(15).setLeftMarginPercentage(15).setIsBodySizeFixed(false).setHeaderTitle(dialogTitle).setHasGrayBackground(true).setIsIconActive(true).setBodyElementId(modalName+"Body");

		var cancelButton = new ModalButton("cancel");
		cancelButton.setText(i18n.innov.GoalsWorkflowComponent.CANCEL).setIsDithered(false).setCloseOnClick(true);
		goalsAddEditDialog.addFooterButton(cancelButton);

		var saveButtonDithered = new ModalButton("saveDithered");
		saveButtonDithered.setText(i18n.innov.GoalsWorkflowComponent.SAVE).setIsDithered(true);
		goalsAddEditDialog.addFooterButton(saveButtonDithered);

		var saveButton = new ModalButton("save");
		saveButton.setText(i18n.innov.GoalsWorkflowComponent.SAVE).setIsDithered(false).setCloseOnClick(false).setOnClickFunction(function() {
			var component = getComponent();
			if (checkCatalogIds()) {
				setModifiedIndicators();
				var goal = getGoalData();
				var goalIdx = getGoalIndex();
				if (goalIdx < 0) {
					if (goal.FUTUREIND === 1) {
						goalIdx = $(".gwf-future-goals li").length;
					}
					else if (goal.METIND === 1) {
						goalIdx = $(".gwf-met-goals li").length;
					}
					else {
						goalIdx = $(".gwf-unmet-goals li").length;
						goal.PRIORITY = goalIdx + 1;
					}
				}
				setGoalData(goal);
				if (goal.NEW_IND) {
					if (parseFloat(goal.OUTCOMECATID) === parseFloat(getDetailLists().goalCatalogId)) {
						component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Add_Goal_FreeText");
					}
					else {
						component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Add_Goal_Searchable");
					}
				}
				else {
					component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Goal_Edited");
				}
				for (var i = goal.INTERVENTIONS.length; i--; ) {
					if (goal.INTERVENTIONS[i].NEW_IND) {
						component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Add_Intervention");
					}
					else if (goal.INTERVENTIONS[i].DELETE_IND) {
						component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Delete_Intervention");
					}
				}

				saveModifiedGoal(component, goalIdx, getOldGoalType());
				var cloneGoal = jQuery.extend(true, {}, goal);
				var i = cloneGoal.TOTAL_INTERVENTIONS_CNT;
				while (i--) {
					if (cloneGoal.INTERVENTIONS[i].DELETE_IND === 1) {
						cloneGoal.INTERVENTIONS.splice(i, 1);
						cloneGoal.TOTAL_INTERVENTIONS_CNT = cloneGoal.TOTAL_INTERVENTIONS_CNT - 1;
					}
				}
				MP_ModalDialog.closeModalDialog(modalName);
			}
			else {
				alert(i18n.innov.GoalsWorkflowComponent.CANT_SAVE_FREETEXT);
			}

		});
		goalsAddEditDialog.addFooterButton(saveButton);

		MP_ModalDialog.addModalDialogObject(goalsAddEditDialog);
		return goalsAddEditDialog;
	}

	function saveModifiedGoal(component, goalIndex, oldGoalType) {
		var criterion = component.getCriterion();
		var blankStatus = {
			"STATUS": "",
			"SUBEVENTSTATUS": []
		};

		function saveGoalResponseHandler(scriptReply) {
			component.hideSavingTip();
			component.showModifiedGoal(scriptReply.getResponse().OUTCOMES, goalIndex, oldGoalType);
		}
		
		var programName = "INN_MP_GWF_SAVE_GOALS";
		var parameterArray = ["^MINE^", criterion.ppr_cd.toFixed(1)];
		var blob = '{"SAVEREQ":{"PERSON_ID":' + criterion.person_id.toFixed(1) + ', "ENCNTR_ID":' + criterion.encntr_id.toFixed(1) + ', "OUTCOMES":' + JSON.stringify(getGoalData()) + ',"STATUS_DATA":' + JSON.stringify(blankStatus) + '}}';
		var component = getComponent();
		component.requestData(saveGoalResponseHandler, component, programName, parameterArray, blob);
	}

	return {
		launch: function(component, detailLists, goalIndex, goal) {
			setDetailLists(detailLists);
			setBlankGoalIntervention();
			setGoalData(goal || getBlankGoal());
			if (goal) {
				setOriginalGoal(goal);
			}
			setGoalIndex(goalIndex);
			setComponent(component);
			setBedrockSettings();
			setLabels();
			resetNewInterCount();
			setOldGoalType();
			var dialogTitle = i18n.innov.GoalsWorkflowComponent.TITLE;

			var goalsAddEditDialog = MP_ModalDialog.retrieveModalDialogObject(modalName);

			if (!goalsAddEditDialog) {
				goalsAddEditDialog = createNewDialog(dialogTitle);
			}

			goalsAddEditDialog.setBodyDataFunction(function(modalObj) {
				goalsAddEditDialog.setBodyHTML(window.render.goalsAddEdit({
					goal: getGoalData(),
					detailLists: getDetailLists(),
					labels: getLabels(),
					bedrockSettings: getBedrockSettings()
				}));
				attachEvents();
			});

			MP_ModalDialog.showModalDialog(goalsAddEditDialog.getId());
			checkSaveEligibility();
		},
		getOddEven: getOddEven
	};
}();
var goalsCommentWindow = function() {
	var component;
	var outcomeActId = 0;

	function createNewDialog() {
		var goalsCommentDialog = new ModalDialog("GoalsComments");
		goalsCommentDialog.setTopMarginPercentage(25).setRightMarginPercentage(22).setBottomMarginPercentage(25).setLeftMarginPercentage(22).setIsBodySizeFixed(true).setHeaderTitle(i18n.innov.GoalsWorkflowComponent.COMMENT_DIALOG_TITLE).setHasGrayBackground(true).setIsIconActive(true).setBodyElementId("goalsCommentBody");

		var cancelButton = new ModalButton("cancel");
		cancelButton.setText(i18n.innov.GoalsWorkflowComponent.CANCEL).setIsDithered(false).setCloseOnClick(true);
		goalsCommentDialog.addFooterButton(cancelButton);

		var saveButton = new ModalButton("save");
		saveButton.setText(i18n.innov.GoalsWorkflowComponent.SAVE).setIsDithered(false).setOnClickFunction(function() {
			component.saveComment(outcomeActId, $("#goalsCommentBody textarea").val().replace(/\^/g ,"&#94;"));
		});
		goalsCommentDialog.addFooterButton(saveButton);

		var saveButtonDithered = new ModalButton("saveDithered");
		saveButtonDithered.setText(i18n.innov.GoalsWorkflowComponent.SAVE).setIsDithered(true);
		goalsCommentDialog.addFooterButton(saveButtonDithered);

		MP_ModalDialog.addModalDialogObject(goalsCommentDialog);
		return goalsCommentDialog;
	}

	function showDitheredSaveButton() {
		if (!$("#GoalsCommentsfooterbtnCont #save").hasClass("hidden")) {
			$("#GoalsCommentsfooterbtnCont #save").addClass("hidden");
		}
		$("#GoalsCommentsfooterbtnCont #saveDithered").removeClass("hidden");
	}

	function showActiveSaveButton() {
		$("#GoalsCommentsfooterbtnCont #save").removeClass("hidden");
		if (!$("#GoalsCommentsfooterbtnCont #saveDithered").hasClass("hidden")) {
			$("#GoalsCommentsfooterbtnCont #saveDithered").addClass("hidden");
		}
	}

	return {
		/**
		 * launches the Goals Comment dialog
		 *
		 * @param {Object} comp Component from which the modal window will be launched
		 * @param {Number} otcmActId Outcome Activity Id of the outcome that the comment will be linked to.
		 * @param {String} cmnt Existing comment for the outcome if any.
		 *
		 * @static
		 * @function
		 * @memberof goalsCommentWindow
		 * @name launch
		 */
		launch: function(comp, otcmActId, cmnt) {
			outcomeActId = otcmActId;
			component = comp;

			var goalsCommentDialog = MP_ModalDialog.retrieveModalDialogObject("GoalsComments");

			if (!goalsCommentDialog) {
				goalsCommentDialog = createNewDialog();
			}
			goalsCommentDialog.setBodyDataFunction(function() {
				goalsCommentDialog.setBodyHTML("<textarea rows='5'>" + cmnt + "</textarea>");
			});

			MP_ModalDialog.showModalDialog(goalsCommentDialog.getId());
			$("#goalsCommentBody textarea").keyup(function(event) {
				var tempComment = $(event.target).val();
				if (tempComment) {
					showActiveSaveButton();
				}
				else {
					showDitheredSaveButton();
				}
			});
			$("#goalsCommentBody textarea").trigger("keyup");
		}
	};
}();
/**
 * Create the component style object which will be used to style various aspects of our component
 */
function GoalsWorkflowComponentStyle() {
	this.initByNamespace("gwf");
}

//GoalsWorkflowComponentStyle.inherits(ComponentStyle);
GoalsWorkflowComponentStyle.prototype = new ComponentStyle();
GoalsWorkflowComponentStyle.prototype.constructor = ComponentStyle;

/*
 * @constructor
 * Initialize the Goals Component component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function GoalsWorkflowComponent(criterion) {
	//This is your component's constructor.
	this.setCriterion(criterion);
	this.setStyles(new GoalsWorkflowComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.GoalsWorkflowComponent - load component");
	this.setComponentRenderTimerName("ENG:MPG.GoalsWorkflowComponent - render component");
	this.setScope(1);
	this.labels;
	this.bedrockSettings = {
		mrnDisplayInd: 0,
		finDisplayInd: 0,
		pcpReltnCodes: [0.0],
		pcpPhoneCodes: [0.0],
		readOnlyInd: 0,
		freeTextGoalCatId: 0,
		freeTextInterventionCatId: 0,
		goalSearchClassCds: [0.0],
		goalClinicalNoteCd: 0,
		unmetLabel: "",
		futureLabel: "",
		metLabel: "",
		creatorLabel: "",
		startLabel: "",
		startRequiredInd: 0,
		targetLabel: "",
		targetRequiredInd: 0,
		typeLabel: "",
		typeRequiredInd: 0,
		categoryLabel: "",
		categoryRequiredInd: 0,
		barrierLabel: "",
		barrierRequiredInd: 0,
		barriersEvent: [0.0],
		interventionLabel: "",
		interventionRequiredInd: 0,
		interTypeLabel: "",
		interTypeRequiredInd: 0,
		interCategoryLabel: "",
		interCategoryRequiredInd: 0,
		interStatusLabel: "",
		interStatusRequiredInd: 0,
		interFrequencyLabel: "",
		interFrequencyRequiredInd: 0,
		interFrequencyCodes: [0.0],
		interTargetLabel: "",
		interTargetRequiredInd: 0,
		interConfidenceLabel: "",
		interConfidenceRequiredInd: 0,
		physicianName: "",
		physicianRel: "",
		physicianPhone: "",
		physicianPhoneType: ""
	};
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
GoalsWorkflowComponent.prototype = new MPageComponent();
GoalsWorkflowComponent.prototype.constructor = MPageComponent;

GoalsWorkflowComponent.prototype.preProcessing = function() {
	if (!this.getReadOnly()) {
		this.setPlusAddEnabled(true);
	}
};

GoalsWorkflowComponent.prototype.openTab = function() {
	GoalsAddEditWindow.launch(this, this.getDetailLists(), -1);
};

GoalsWorkflowComponent.prototype.setMRNDisplay = function(val) {
	this.bedrockSettings.mrnDisplayInd = parseInt(val, 10);
};

GoalsWorkflowComponent.prototype.setFINDisplay = function(val) {
	this.bedrockSettings.finDisplayInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setPCPReltn = function(val) {
	this.bedrockSettings.pcpReltnCodes = val;
};
GoalsWorkflowComponent.prototype.setPCPPhone = function(val) {
	this.bedrockSettings.pcpPhoneCodes = val;
};
GoalsWorkflowComponent.prototype.setReadOnly = function(val) {
	this.bedrockSettings.readOnlyInd = !parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setFreetextGoalCatId = function(val) {
	this.bedrockSettings.freeTextGoalCatId = parseFloat(val);
};
GoalsWorkflowComponent.prototype.setFreetextInterventionCatId = function(val) {
	this.bedrockSettings.freeTextInterventionCatId = parseFloat(val);
};
GoalsWorkflowComponent.prototype.setGoalSearchClassCodes = function(val) {
	this.bedrockSettings.goalSearchClassCds = val;
};
GoalsWorkflowComponent.prototype.setGoalClinicalNote = function(val) {
	this.bedrockSettings.goalClinicalNoteCd = val;
};
GoalsWorkflowComponent.prototype.setUnmetLabel = function(val) {
	this.bedrockSettings.unmetLabel = val;
};
GoalsWorkflowComponent.prototype.setFutureLabel = function(val) {
	this.bedrockSettings.futureLabel = val;
};
GoalsWorkflowComponent.prototype.setMetLabel = function(val) {
	this.bedrockSettings.metLabel = val;
};
GoalsWorkflowComponent.prototype.setCreatorLabel = function(val) {
	this.bedrockSettings.creatorLabel = val;
};
GoalsWorkflowComponent.prototype.setStartLabel = function(val) {
	this.bedrockSettings.startLabel = val;
};
GoalsWorkflowComponent.prototype.setStartRequired = function(val) {
	this.bedrockSettings.startRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setTargetLabel = function(val) {
	this.bedrockSettings.targetLabel = val;
};
GoalsWorkflowComponent.prototype.setTargetRequired = function(val) {
	this.bedrockSettings.targetRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setTypeLabel = function(val) {
	this.bedrockSettings.typeLabel = val;
};
GoalsWorkflowComponent.prototype.setTypeRequired = function(val) {
	this.bedrockSettings.typeRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setCategoryLabel = function(val) {
	this.bedrockSettings.categoryLabel = val;
};
GoalsWorkflowComponent.prototype.setCategoryRequired = function(val) {
	this.bedrockSettings.categoryRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setBarrierLabel = function(val) {
	this.bedrockSettings.barrierLabel = val;
};
GoalsWorkflowComponent.prototype.setBarrierRequried = function(val) {
	this.bedrockSettings.barrierRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setBarriersEvent = function(val) {
	this.bedrockSettings.barriersEvent = val;
};
GoalsWorkflowComponent.prototype.setInterventionLabel = function(val) {
	this.bedrockSettings.interventionLabel = val;
};
GoalsWorkflowComponent.prototype.setInterventionRequired = function(val) {
	this.bedrockSettings.interventionRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setInterTypeLabel = function(val) {
	this.bedrockSettings.interTypeLabel = val;
};
GoalsWorkflowComponent.prototype.setInterTypeRequired = function(val) {
	this.bedrockSettings.interTypeRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setInterCategoryLabel = function(val) {
	this.bedrockSettings.interCategoryLabel = val;
};
GoalsWorkflowComponent.prototype.setInterCategoryRequired = function(val) {
	this.bedrockSettings.interCategoryRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setInterStatusLabel = function(val) {
	this.bedrockSettings.interStatusLabel = val;
};
GoalsWorkflowComponent.prototype.setInterStatusRequired = function(val) {
	this.bedrockSettings.interStatusRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setInterFrequencyLabel = function(val) {
	this.bedrockSettings.interFrequencyLabel = val;
};
GoalsWorkflowComponent.prototype.setInterFrequencyRequired = function(val) {
	this.bedrockSettings.interFrequencyRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setInterventionFrequencies = function(val) {
	this.bedrockSettings.interFrequencyCodes = val;
};
GoalsWorkflowComponent.prototype.setInterTargetLabel = function(val) {
	this.bedrockSettings.interTargetLabel = val;
};
GoalsWorkflowComponent.prototype.setInterTargetRequired = function(val) {
	this.bedrockSettings.interTargetRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.setInterConfidenceLabel = function(val) {
	this.bedrockSettings.interConfidenceLabel = val;
};
GoalsWorkflowComponent.prototype.setInterConfidenceRequired = function(val) {
	this.bedrockSettings.interConfidenceRequiredInd = parseInt(val, 10);
};
GoalsWorkflowComponent.prototype.getMRNDisplay = function() {
	return this.bedrockSettings.mrnDisplayInd;
};

GoalsWorkflowComponent.prototype.getFINDisplay = function() {
	return this.bedrockSettings.finDisplayInd;
};
GoalsWorkflowComponent.prototype.getPCPReltn = function() {
	return this.bedrockSettings.pcpReltnCodes;
};
GoalsWorkflowComponent.prototype.getPCPPhone = function() {
	return this.bedrockSettings.pcpPhoneCodes;
};
GoalsWorkflowComponent.prototype.getReadOnly = function() {
	return this.bedrockSettings.readOnlyInd;
};
GoalsWorkflowComponent.prototype.getFreetextGoalCatId = function() {
	return this.bedrockSettings.freeTextGoalCatId;
};
GoalsWorkflowComponent.prototype.getFreetextInterventionCatId = function() {
	return this.bedrockSettings.freeTextInterventionCatId;
};
GoalsWorkflowComponent.prototype.getGoalSearchClassCodes = function() {
	return this.bedrockSettings.goalSearchClassCds;
};
GoalsWorkflowComponent.prototype.getGoalClinicalNote = function() {
	return this.bedrockSettings.goalClinicalNoteCd;
};
GoalsWorkflowComponent.prototype.getUnmetLabel = function() {
	return this.bedrockSettings.unmetLabel;
};
GoalsWorkflowComponent.prototype.getFutureLabel = function() {
	return this.bedrockSettings.futureLabel;
};
GoalsWorkflowComponent.prototype.getMetLabel = function() {
	return this.bedrockSettings.metLabel;
};
GoalsWorkflowComponent.prototype.getCreatorLabel = function() {
	return this.bedrockSettings.creatorLabel;
};
GoalsWorkflowComponent.prototype.getStartLabel = function() {
	return this.bedrockSettings.startLabel;
};
GoalsWorkflowComponent.prototype.getStartRequired = function() {
	return this.bedrockSettings.startRequiredInd;
};
GoalsWorkflowComponent.prototype.getTargetLabel = function() {
	return this.bedrockSettings.targetLabel;
};
GoalsWorkflowComponent.prototype.getTargetRequired = function() {
	return this.bedrockSettings.targetRequiredInd;
};
GoalsWorkflowComponent.prototype.getTypeLabel = function() {
	return this.bedrockSettings.typeLabel;
};
GoalsWorkflowComponent.prototype.getTypeRequired = function() {
	return this.bedrockSettings.typeRequiredInd;
};
GoalsWorkflowComponent.prototype.getCategoryLabel = function() {
	return this.bedrockSettings.categoryLabel;
};
GoalsWorkflowComponent.prototype.getCategoryRequired = function() {
	return this.bedrockSettings.categoryRequiredInd;
};
GoalsWorkflowComponent.prototype.getBarrierLabel = function() {
	return this.bedrockSettings.barrierLabel;
};
GoalsWorkflowComponent.prototype.getBarrierRequried = function() {
	return this.bedrockSettings.barrierRequiredInd;
};
GoalsWorkflowComponent.prototype.getBarriersEvent = function() {
	return this.bedrockSettings.barriersEvent;
};
GoalsWorkflowComponent.prototype.getInterventionLabel = function() {
	return this.bedrockSettings.interventionLabel;
};
GoalsWorkflowComponent.prototype.getInterventionRequired = function() {
	return this.bedrockSettings.interventionRequiredInd;
};
GoalsWorkflowComponent.prototype.getInterTypeLabel = function() {
	return this.bedrockSettings.interTypeLabel;
};
GoalsWorkflowComponent.prototype.getInterTypeRequired = function() {
	return this.bedrockSettings.interTypeRequiredInd;
};
GoalsWorkflowComponent.prototype.getInterCategoryLabel = function() {
	return this.bedrockSettings.interCategoryLabel;
};
GoalsWorkflowComponent.prototype.getInterCategoryRequired = function() {
	return this.bedrockSettings.interCategoryRequiredInd;
};
GoalsWorkflowComponent.prototype.getInterStatusLabel = function() {
	return this.bedrockSettings.interStatusLabel;
};
GoalsWorkflowComponent.prototype.getInterStatusRequired = function() {
	return this.bedrockSettings.interStatusRequiredInd;
};
GoalsWorkflowComponent.prototype.getInterFrequencyLabel = function() {
	return this.bedrockSettings.interFrequencyLabel;
};
GoalsWorkflowComponent.prototype.getInterFrequencyRequired = function() {
	return this.bedrockSettings.interFrequencyRequiredInd;
};
GoalsWorkflowComponent.prototype.getInterventionFrequencies = function() {
	return this.bedrockSettings.interFrequencyCodes;
};
GoalsWorkflowComponent.prototype.getInterTargetLabel = function() {
	return this.bedrockSettings.interTargetLabel;
};
GoalsWorkflowComponent.prototype.getInterTargetRequired = function() {
	return this.bedrockSettings.interTargetRequiredInd;
};
GoalsWorkflowComponent.prototype.getInterConfidenceLabel = function() {
	return this.bedrockSettings.interConfidenceLabel;
};
GoalsWorkflowComponent.prototype.getInterConfidenceRequired = function() {
	return this.bedrockSettings.interConfidenceRequiredInd;
};
GoalsWorkflowComponent.prototype.getBedrockSettings = function() {
	return this.bedrockSettings;
};
GoalsWorkflowComponent.prototype.getLabels = function() {
	return this.labels;
};

GoalsWorkflowComponent.prototype.setLabels = function() {
	var bedrockSettings = this.getBedrockSettings();
	this.labels = {
		unmetLabel: bedrockSettings.unmetLabel || i18n.innov.GoalsWorkflowComponent.UNMET,
		metLabel: bedrockSettings.metLabel || i18n.innov.GoalsWorkflowComponent.MET,
		futureLabel: bedrockSettings.futureLabel || i18n.innov.GoalsWorkflowComponent.FUTURE,
		startLabel: bedrockSettings.startLabel || i18n.innov.GoalsWorkflowComponent.START,
		targetLabel: bedrockSettings.targetLabel || i18n.innov.GoalsWorkflowComponent.TARGET,
		creatorLabel: bedrockSettings.creatorLabel || i18n.innov.GoalsWorkflowComponent.CREATOR,
		typeLabel: bedrockSettings.typeLabel || i18n.innov.GoalsWorkflowComponent.TYPE,
		categoryLabel: bedrockSettings.categoryLabel || i18n.innov.GoalsWorkflowComponent.CATEGORY,
		barrierLabel: bedrockSettings.barrierLabel || i18n.innov.GoalsWorkflowComponent.BARRIER
	};
};
GoalsWorkflowComponent.prototype.getDetailLists = function() {
	return this.detailLists;
};
GoalsWorkflowComponent.prototype.setDetailLists = function() {
	var bedrockSettings = this.getBedrockSettings();
	var goalsData = this.getGoalsData();
	this.detailLists = {
		"goalCatalogId": bedrockSettings.freeTextGoalCatId,
		"interventionCatalogId": bedrockSettings.freeTextInterventionCatId,
		"typeList": goalsData.TYPELIST,
		"categoryList": goalsData.CATEGORYLIST,
		"frequencyList": goalsData.FREQUENCYLIST,
		"targetUnitCdsList": goalsData.TARGETUNITCDSLIST,
		"barriersList": goalsData.BARRIERSLIST
	};
};
GoalsWorkflowComponent.prototype.setGoalsData = function(data) {
	this.goalsData = data;
};

GoalsWorkflowComponent.prototype.getGoalsData = function() {
	return this.goalsData;
};

GoalsWorkflowComponent.prototype.getOutcomesList = function(targetElement, goalsData) {
	if ($(targetElement).closest("ul").hasClass("gwf-unmet-goals")) {
		return goalsData.UNMET_OUTCOMES;
	}
	else if ($(targetElement).closest("ul").hasClass("gwf-met-goals")) {
		return goalsData.MET_OUTCOMES;
	}
	else if ($(targetElement).closest("ul").hasClass("gwf-future-goals")) {
		return goalsData.FUTURE_OUTCOMES;
	}
};

/**
 * This function is used to load the filters that are associated to this component.  Each filter mapping
 * is associated to one specific component setting.  The filter mapping lets the MPages architecture know
 * which functions to call for each filter.
 */
GoalsWorkflowComponent.prototype.loadFilterMappings = function() {
	this.addFilterMappingObject("MRN_DISPLAY", {
		setFunction: this.setMRNDisplay,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("FIN_DISPLAY", {
		setFunction: this.setFINDisplay,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("PCP_RLT", {
		setFunction: this.setPCPReltn,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("PCP_PHONE", {
		setFunction: this.setPCPPhone,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("READ_ONLY", {
		setFunction: this.setReadOnly,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("FREE_GOAL", {
		setFunction: this.setFreetextGoalCatId,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("FREE_INTERVENTION", {
		setFunction: this.setFreetextInterventionCatId,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("GOAL_SEARCH", {
		setFunction: this.setGoalSearchClassCodes,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("GOAL_NOTE", {
		setFunction: this.setGoalClinicalNote,
		type: "NUMBER",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("UNMET_LBL", {
		setFunction: this.setUnmetLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("FUTURE_LBL", {
		setFunction: this.setFutureLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("MET_LBL", {
		setFunction: this.setMetLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("PRIOR_REQUIRE", {
		setFunction: this.setPriorityRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("CREATOR_LBL", {
		setFunction: this.setCreatorLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("START_LBL", {
		setFunction: this.setStartLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("START_REQUIRE", {
		setFunction: this.setStartRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("TARGET_LBL", {
		setFunction: this.setTargetLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("TARGET_REQUIRE", {
		setFunction: this.setTargetRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("TYPE_LBL", {
		setFunction: this.setTypeLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("TYPE_REQUIRE", {
		setFunction: this.setTypeRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("CATEGORY_LBL", {
		setFunction: this.setCategoryLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("CATEGORY_REQUIRE", {
		setFunction: this.setCategoryRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("BARRIER_LBL", {
		setFunction: this.setBarrierLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("BARRIER_REQUIRE", {
		setFunction: this.setBarrierRequried,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("BARRIERS_EVENT", {
		setFunction: this.setBarriersEvent,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("INTERVENTION_LBL", {
		setFunction: this.setInterventionLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INTERVENTION_REQUIRE", {
		setFunction: this.setInterventionRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_TYPE_LBL", {
		setFunction: this.setInterTypeLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_TYPE_REQUIRE", {
		setFunction: this.setInterTypeRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_CATEGORY_LBL", {
		setFunction: this.setInterCategoryLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_CATEGORY_REQUIRE", {
		setFunction: this.setInterCategoryRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_STATUS_LBL", {
		setFunction: this.setInterStatusLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_STATUS_REQUIRE", {
		setFunction: this.setInterStatusRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_FREQ_LBL", {
		setFunction: this.setInterFrequencyLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_FREQ_REQUIRE", {
		setFunction: this.setInterFrequencyRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_FREQ", {
		setFunction: this.setInterventionFrequencies,
		type: "ARRAY",
		field: "PARENT_ENTITY_ID"
	});
	this.addFilterMappingObject("INT_TARGET_LBL", {
		setFunction: this.setInterTargetLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_TARGET_REQUIRE", {
		setFunction: this.setInterTargetRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_CONF_LBL", {
		setFunction: this.setInterConfidenceLabel,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
	this.addFilterMappingObject("INT_CONF_REQUIRE", {
		setFunction: this.setInterConfidenceRequired,
		type: "STRING",
		field: "FREETEXT_DESC"
	});
};

GoalsWorkflowComponent.prototype.updateGoalsControlCount = function() {
	var goalsData = this.getGoalsData();
	$(".gwf-all-gls-control .all-goals-count").text(goalsData.UNMET_OUTCOMES.length + goalsData.MET_OUTCOMES.length + goalsData.FUTURE_OUTCOMES.length);
	$(".gwf-unmet-gls-control .unmet-goals-count").text(goalsData.UNMET_OUTCOMES.length);
	$(".gwf-future-gls-control .future-goals-count").text(goalsData.FUTURE_OUTCOMES.length);
	$(".gwf-met-gls-control .met-goals-count").text(goalsData.MET_OUTCOMES.length);
};

/**
 * This is the GoalsWorkflowComponent implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * This function will be called from the MPages architecture when it is ready for the component to render its content.
 */
GoalsWorkflowComponent.prototype.retrieveComponentData = function() {
	var criterion = this.getCriterion();
	var prsnlInfo = criterion.getPersonnelInfo();
	var encntrs = prsnlInfo.getViewableEncounters();
	var encntrVal = encntrs ? "value(" + encntrs + ")" : "0.0";
	var bedrockSettings = this.getBedrockSettings();
	var sendAr = [], scriptRequest;
	sendAr.push("^MINE^", criterion.person_id.toFixed(1), encntrVal , "value(" + (bedrockSettings.pcpReltnCodes.join('.0,') || '0.0') + ")", "value(" + (bedrockSettings.pcpPhoneCodes.join('.0,') || '0.0') + ")", "value(" + (bedrockSettings.barriersEvent.join('.0,') || '0.0') + ")", "value(" + (bedrockSettings.interFrequencyCodes.join('.0,') || '0.0') + ")");
	if ( typeof ComponentScriptRequest !== 'undefined') {
		scriptRequest = new ComponentScriptRequest();
		scriptRequest.setProgramName("inn_mp_gwf_get_goals");
		scriptRequest.setParameterArray(sendAr);
		scriptRequest.setAsyncIndicator(true);
		scriptRequest.setComponent(this);
		scriptRequest.setResponseHandler(this.renderComponent);
		var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
		scriptRequest.setLoadTimer(loadTimer);
		scriptRequest.performRequest();
	}
	else {
		scriptRequest = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
		scriptRequest.setProgramName("inn_mp_gwf_get_goals");
		scriptRequest.setParameters(sendAr);
		scriptRequest.setAsync(true);
		MP_Core.XMLCCLRequestCallBack(this, scriptRequest, this.renderComponent);
	}
	this.setLabels();
};

GoalsWorkflowComponent.prototype.showAllGoals = function() {
	$(".gwf-control-bar button.selected").removeClass("selected");
	$(".gwf-all-gls-control").addClass("selected");

	if ($(".gwf-future-goals .gwf-goal-li").length > 0) {
		$(".gwf-goals-future-header").show();
		$(".gwf-future-goals").show();
	}
	else {
		$(".gwf-goals-future-header").hide();
		$(".gwf-future-goals").hide();
	}

	if ($(".gwf-met-goals .gwf-goal-li").length > 0) {
		$(".gwf-goals-met-header").show();
		$(".gwf-met-goals").show();
	}
	else {
		$(".gwf-goals-met-header").hide();
		$(".gwf-met-goals").hide();
	}

	if ($(".gwf-unmet-goals .gwf-goal-li").length > 0) {
		$(".gwf-goals-unmet-header").show();
		$(".gwf-unmet-goals").show();
	}
	else {
		$(".gwf-goals-unmet-header").hide();
		$(".gwf-unmet-goals").hide();
	}

	$("#sortableGoals").sortable("option", "disabled", true);
	$(".gwf-goal-li .gwf-goal-priority span.vertical-dots").hide();
};

GoalsWorkflowComponent.prototype.showMetGoals = function() {
	$(".gwf-control-bar button.selected").removeClass("selected");
	$(".gwf-met-gls-control").addClass("selected");
	$(".gwf-future-goals").hide();
	$(".gwf-met-goals").show();
	$(".gwf-unmet-goals").hide();
	$(".gwf-goals-future-header").hide();
	$(".gwf-goals-met-header").hide();
	$(".gwf-goals-unmet-header").hide();
};

GoalsWorkflowComponent.prototype.showFutureGoals = function() {
	$(".gwf-control-bar button.selected").removeClass("selected");
	$(".gwf-future-gls-control").addClass("selected");
	$(".gwf-future-goals").show();
	$(".gwf-met-goals").hide();
	$(".gwf-unmet-goals").hide();
	$(".gwf-goals-future-header").hide();
	$(".gwf-goals-met-header").hide();
	$(".gwf-goals-unmet-header").hide();
};

GoalsWorkflowComponent.prototype.showUnmetGoals = function() {
	$(".gwf-control-bar button.selected").removeClass("selected");
	$(".gwf-unmet-gls-control").addClass("selected");
	$(".gwf-future-goals").hide();
	$(".gwf-met-goals").hide();
	$(".gwf-unmet-goals").show();
	$(".gwf-goal-li .gwf-goal-priority span.vertical-dots").show();
	$("#sortableGoals").sortable("option", "disabled", false);
	$(".gwf-goals-future-header").hide();
	$(".gwf-goals-met-header").hide();
	$(".gwf-goals-unmet-header").hide();
};

GoalsWorkflowComponent.prototype.attachEvents = function() {
	var component = this;
	var recordData = component.getGoalsData();
	var criterion = component.getCriterion();

	$('.gwf-all-gls-control').unbind().click(component.showAllGoals);
	$('.gwf-met-gls-control').unbind().click(component.showMetGoals);
	$('.gwf-future-gls-control').unbind().click(component.showFutureGoals);
	$('.gwf-unmet-gls-control').unbind().click(component.showUnmetGoals);

	$(".gwf-goal-expand-collapse").unbind().click(function(event) {
		$(event.target).closest("li").find('.gwf-goal-interventions').toggleClass("hidden");
		$(event.target).toggleClass("collapse-icon").toggleClass("expand-icon");
		//Only expand or contract type/category/barrier spans if the interventions will also be expanding or contracting with them
		if(!$(event.target).closest(".gwf-goal-details-2").children("div").hasClass("gwf-goal-expanded-sec") && !$(event.target).closest("li").find(".gwf-goal-interventions").hasClass("hidden")){
			$(event.target).closest(".gwf-goal-details-2").children("div").toggleClass("gwf-goal-expanded-sec");
		}
		else if($(event.target).closest(".gwf-goal-details-2").children("div").hasClass("gwf-goal-expanded-sec") && $(event.target).closest("li").find(".gwf-goal-interventions").hasClass("hidden")){
			$(event.target).closest(".gwf-goal-details-2").children("div").toggleClass("gwf-goal-expanded-sec");
		}
	});
	
	$(".gwf-goal-type-sec, .gwf-goal-category-sec, .gwf-goal-barriers-sec").unbind().click(function(event){
		$(event.target).closest(".gwf-goal-details-2").children("div").toggleClass("gwf-goal-expanded-sec");		
	});

	$(".gwf-goal-status-select").unbind().click(function(event) {
		var anchorElementId = $(this).attr('id');
		var anchorCatId = $(this).attr('catid');
		var statusMenu = MP_MenuManager.getMenuObject('goalsStatusMenu' + anchorCatId);

		if (statusMenu) {
			statusMenu.setAnchorElementId(anchorElementId);
			MP_MenuManager.updateMenuObject(statusMenu);
		}
		MP_MenuManager.showMenu("goalsStatusMenu" + anchorCatId);
		var statusMenuItems = $("#menuContentgoalsStatusMenu" + anchorCatId).find(".menu-item");
		var menuSeparators = $("#menuContentgoalsStatusMenu" + anchorCatId).find(".menu-separator");

		for (var i = statusMenuItems.length; i--; ) {
			if ($("#" + anchorElementId).closest("ul").hasClass("gwf-future-goals")) {
				if (!$(statusMenuItems[i]).hasClass("hidden")) {
					$(statusMenuItems[i]).addClass("hidden");
				}
			}
			else {
				$(statusMenuItems[i]).removeClass("hidden");
			}
		}

		$(statusMenuItems[statusMenuItems.length - 1]).removeClass("hidden");
		$(menuSeparators[menuSeparators.length - 1]).removeClass("hidden");
		var anchorTop = $("#" + anchorElementId).offset().top;
		var menuOffset = $("#menuContentgoalsStatusMenu" + anchorCatId).offset();
		var menuHeight = $("#menuContentgoalsStatusMenu" + anchorCatId).height();
		if (menuOffset.top < anchorTop) {
			$("#menuContentgoalsStatusMenu" + anchorCatId).offset({
				top: anchorTop - menuHeight,
				left: menuOffset.left
			});
		}
	});

	$(".gwf-inter-status-select").unbind().click(function(event) {
		var anchorElementId = $(this).attr('id');
		var anchorCatId = $(this).attr('catid');
		var statusMenu = MP_MenuManager.getMenuObject('goalsStatusMenu' + anchorCatId);
		if (statusMenu) {
			statusMenu.setAnchorElementId(anchorElementId);
			MP_MenuManager.updateMenuObject(statusMenu);
		}
		MP_MenuManager.showMenu("goalsStatusMenu" + anchorCatId);
		var statusMenuItems = $("#menuContentgoalsStatusMenu" + anchorCatId).find(".menu-item");
		var menuSeparators = $("#menuContentgoalsStatusMenu" + anchorCatId).find(".menu-separator");
		if (!$(statusMenuItems[statusMenuItems.length - 1]).hasClass("hidden")) {
			$(statusMenuItems[statusMenuItems.length - 1]).addClass("hidden");
		}
		if (!$(menuSeparators[menuSeparators.length - 1]).hasClass("hidden")) {
			$(menuSeparators[menuSeparators.length - 1]).addClass("hidden");
		}
		var anchorTop = $("#" + anchorElementId).offset().top;
		var menuOffset = $("#menuContentgoalsStatusMenu" + anchorCatId).offset();
		var menuHeight = $("#menuContentgoalsStatusMenu" + anchorCatId).height();
		if (menuOffset.top < anchorTop) {
			$("#menuContentgoalsStatusMenu" + anchorCatId).offset({
				top: anchorTop - menuHeight,
				left: menuOffset.left
			});
		}
	});

	if (!component.getReadOnly()) {
		$('.gwf-goal-edit').unbind().click(function(event) {
			var goalId = $(event.target).closest('.gwf-goal').attr('id');
			var goalsData = component.getGoalsData();
			var goalIndex;
			var outcomesList = component.getOutcomesList($(event.target), goalsData);
			for (var i = outcomesList.length; i--; ) {
				if (parseFloat(outcomesList[i].OUTCOMEACTID) === parseFloat(goalId)) {
					goalIndex = i;
				}
			}
			component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Edit_Window_Opened");
			GoalsAddEditWindow.launch(component, component.getDetailLists(), goalIndex, jQuery.extend(true, {}, outcomesList[goalIndex]));
		});
		$('.gwf-goal-comment').unbind().click(function(event) {
			var goalId = $(event.target).closest('.gwf-goal').attr('id');
			var goalsData = component.getGoalsData();
			var goalIndex;
			var outcomesList = component.getOutcomesList($(event.target), goalsData);
			for (var i = outcomesList.length; i--; ) {
				if (parseFloat(outcomesList[i].OUTCOMEACTID) === parseFloat(goalId)) {
					goalIndex = i;
				}
			}
			goalsCommentWindow.launch(component, goalId, outcomesList[goalIndex].COMMENT);
		});

		$(".gwf-add-goal").unbind().click(function() {
			GoalsAddEditWindow.launch(component, component.getDetailLists(), -1);
		});
	}
	if (component.getReadOnly()) {
		$(".gwf-inter-status-select").addClass("disabled");
		$(".gwf-goal-status-select").addClass("disabled");
	}
};

GoalsWorkflowComponent.prototype.saveComment = function(outcomeActId, comment) {
	var component = this;
	var programName = "INN_MP_GWF_SAVE_COMMENT";
	var parameterArray = ["^MINE^", outcomeActId+".0", "^" + comment + "^"];
	component.requestData(saveCommentResponeHandler, component, programName, parameterArray);

	function saveCommentResponeHandler(scriptReply) {
		if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
			var goals = component.getGoalsData();
			var goalFound = false;
			for (var i = goals.UNMET_OUTCOMES.length; i--; ) {
				if (parseFloat(goals.UNMET_OUTCOMES[i].OUTCOMEACTID) === parseFloat(outcomeActId)) {
					goals.UNMET_OUTCOMES[i].COMMENT = comment;
					goalFound = true;
					break;
				}
			}
			if (!goalFound) {
				for (var i = goals.FUTURE_OUTCOMES.length; i--; ) {
					if (parseFloat(goals.FUTURE_OUTCOMES[i].OUTCOMEACTID) === parseFloat(outcomeActId)) {
						goals.FUTURE_OUTCOMES[i].COMMENT = comment;
						goalFound = true;
						break;
					}
				}
			}
			if (!goalFound) {
				for (var i = goals.MET_OUTCOMES.length; i--; ) {
					if (parseFloat(goals.MET_OUTCOMES[i].OUTCOMEACTID) === parseFloat(outcomeActId)) {
						goals.MET_OUTCOMES[i].COMMENT = comment;
						goalFound = true;
						break;
					}
				}
			}
			component.setGoalsData(goals);
			if (comment) {
				$(".gwf-goal-li #" + outcomeActId + ".gwf-goal").find(".goal-comment-icon").addClass("comment-exists");
			}
			else {
				$(".gwf-goal-li #" + outcomeActId + ".gwf-goal").find(".goal-comment-icon").removeClass("comment-exists");
			}
		}
	}

};
GoalsWorkflowComponent.prototype.sendScriptRequest = function(responseHandler, component, programName, parameterArray, dataBlob){
	var scriptRequest = new ScriptRequest();
	scriptRequest.setProgramName(programName);
	scriptRequest.setParameterArray(parameterArray);
	scriptRequest.setAsyncIndicator(true);
	scriptRequest.setResponseHandler(responseHandler);
	if(typeof dataBlob !== "undefined"){
		scriptRequest.setDataBlob(dataBlob);
	}
	scriptRequest.performRequest();
};
GoalsWorkflowComponent.prototype.sendLegacyDataRequest = function(responseHandler, component, programName, parameterArray, dataBlob){
	var scriptRequest = new MP_Core.ScriptRequest();
	scriptRequest.setProgramName(programName);
	scriptRequest.setParameters(parameterArray);
	scriptRequest.setAsync(true);
	if(typeof dataBlob !== "undefined"){
		scriptRequest.setRequestBlobIn(dataBlob);
	}
	MP_Core.XMLCCLRequestCallBack(component, scriptRequest, responseHandler);
};
GoalsWorkflowComponent.prototype.requestData = function(responseHandler, component, programName, parameterArray, dataBlob){
	if ( typeof ScriptRequest !== "undefined") {
		component.sendScriptRequest(responseHandler, component, programName, parameterArray, dataBlob);
	}
	else {
		component.sendLegacyDataRequest(responseHandler, component, programName, parameterArray, dataBlob);
	}
};
GoalsWorkflowComponent.prototype.saveGoalStatus = function(statusCode, statusDisplay, anchorElement) {
	var component = this;
	var goalsData = component.getGoalsData();
	var criterion = component.getCriterion();
	var labels = component.getLabels();
	var mpReq = component.buildMPReq(criterion, statusCode, statusDisplay);

	var outcomeActId = $(anchorElement).closest(".gwf-goal").attr("id");
	outcomeActId = parseFloat(outcomeActId);
	var outcomesList = component.getOutcomesList(anchorElement, goalsData);
	var originalStatus;
	if ($(anchorElement).closest("ul").hasClass("gwf-unmet-goals")) {
		originalStatus = "unmet";
	}
	else if ($(anchorElement).closest("ul").hasClass("gwf-met-goals")) {
		originalStatus = "met";
	}
	else if ($(anchorElement).closest("ul").hasClass("gwf-future-goals")) {
		originalStatus = "future";
	}

	if (outcomeActId > 0) {
		for (var i = outcomesList.length; i--; ) {
			if (parseFloat(outcomesList[i].OUTCOMEACTID) === outcomeActId) {
				outcomesList[i].GOAL_STATUS.CURRENT_STATUS_CD = statusCode;
				outcomesList[i].GOAL_STATUS.CURRENT_STATUS_DISPLAY = statusDisplay;
				mpReq.LIST[0].ACCESSION_NBR = "PP" + outcomesList[i].OUTCOMEACTID;
				mpReq.LIST[0].TASKASSAYCD = outcomesList[i].TASK_ASSAY_CD;
				mpReq.LIST[0].INPUTEVENTCD = outcomesList[i].EVENT_CD;
				component.setGoalsData(goalsData);
			}
		}
	}
	var programName = "INN_MP_POST_LTC_OUTCOMES";
	var parameterArray = ["^MINE^", "^{'MPREQ':" + JSON.stringify(mpReq).replace(/"/g, "'") + "}^"];
	component.showSavingTip();
	component.requestData(goalStatusResponseHander, component, programName, parameterArray);

	function goalStatusResponseHander(scriptReply) {
		component.hideSavingTip();
		var glsData = component.getGoalsData();
		var outcomesLst = component.getOutcomesList(anchorElement, glsData);
		var currentStatus;
		if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
			if (outcomeActId > 0) {
				for (var i = outcomesLst.length; i--; ) {
					if (parseFloat(outcomesLst[i].OUTCOMEACTID) === outcomeActId) {
						outcomesLst[i].GOAL_STATUS.SAVED_STATUS_CD = outcomesLst[i].GOAL_STATUS.CURRENT_STATUS_CD;
						outcomesLst[i].GOAL_STATUS.SAVED_STATUS_DISPLAY = outcomesLst[i].GOAL_STATUS.CURRENT_STATUS_DISPLAY;
						for (var j = outcomesLst[i].STATUSLIST.length; j--; ) {
							if (parseFloat(outcomesLst[i].STATUSLIST[j].CODE_VALUE) === parseFloat(outcomesLst[i].GOAL_STATUS.SAVED_STATUS_CD)) {
								outcomesLst[i].METIND = outcomesLst[i].STATUSLIST[j].METIND;
								if (outcomesLst[i].STATUSLIST[j].METIND) {
									currentStatus = "met";
								}
								else {
									if (outcomesLst[i].FUTUREIND) {
										currentStatus = "future";
									}
									else {
										currentStatus = "unmet";
									}
								}
								break;
							}
						}
						if (((originalStatus === "unmet") || (originalStatus === "future")) && (currentStatus === "met")) {
							//move goal from unmet or future to met
							var curGoal = outcomesLst.splice(i, 1)[0];
							glsData.MET_OUTCOMES.push(curGoal);
							var goal = glsData.MET_OUTCOMES[glsData.MET_OUTCOMES.length - 1];
							if (goal.PRIORITY > 0) {
								goal.PRIORITY = 0;
								component.saveGoalPriority(goal);
							}

							var goalElement = $(anchorElement).closest(".gwf-goal-li").detach();
							$(goalElement).find(".gwf-goal-priority").html("");
							$(".gwf-met-goals").append(goalElement);
							component.showTimedMessage(i18n.innov.GoalsWorkflowComponent.GOAL_MOVED_TO + " " + labels.metLabel);
							component.reArrangePriorities();
						}
						else if (originalStatus === "met") {
							if (currentStatus === "unmet") {
								//move goal from met to unmet
								var curGoal = outcomesLst.splice(i, 1)[0];
								curGoal.PRIORITY = glsData.UNMET_OUTCOMES.length + 1;
								glsData.UNMET_OUTCOMES.push(curGoal);
								component.reArrangePriorities();
								var goalElement = $(anchorElement).closest(".gwf-goal-li").detach();
								$(goalElement).find(".gwf-goal-priority").html('<span class="vertical-dots"></span><span class="priority-nbr">' + curGoal.PRIORITY + "</span>");
								$(".gwf-unmet-goals").append(goalElement);
								component.showTimedMessage(i18n.innov.GoalsWorkflowComponent.GOAL_MOVED_TO + " " + labels.unmetLabel);
							}
							else if (currentStatus === "future") {
								//move goal from met to future
								var curGoal = outcomesLst.splice(i, 1)[0];
								glsData.FUTURE_OUTCOMES.push(curGoal);

								var goalElement = $(anchorElement).closest(".gwf-goal-li").detach();
								$(".gwf-future-goals").append(goalElement);
								component.showTimedMessage(i18n.innov.GoalsWorkflowComponent.GOAL_MOVED_TO + " " + labels.futureLabel);
							}
						}
						component.setGoalsData(glsData);
						component.updateGoalsControlCount();
						if ($(".gwf-all-gls-control").hasClass("selected")) {
							component.showAllGoals();
						}
						break;
					}
				}
			}
		}
	}

};
GoalsWorkflowComponent.prototype.buildMPReq = function(criterion, statusCode, statusDisplay){
	var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	var currentDate = new Date();
	var formattedDtTm = currentDate.getDate() + "-" + monthNames[currentDate.getMonth()] + "-" + currentDate.getFullYear() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + ":00";
	var mpReq = {
		"LIST": [{
			"INPUTPERSONID": criterion.person_id,
			"INPUTPROVIDERID": criterion.provider_id,
			"INPUTENCOUNTERID": criterion.encntr_id,
			"INPUTEVENTCD": "",
			"ENDDTTM": formattedDtTm,
			"INPUTNOMENCLATUREID": [{
				"NOMID": statusCode
			}],
			"INPUTFREETEXT": statusDisplay,
			"INPUTPPR": criterion.ppr_cd,
			"TASKASSAYCD": "",
			"ACCESSION_NBR": ""
		}]
	};
	return mpReq;
};

GoalsWorkflowComponent.prototype.saveInterventionStatus = function(statusCode, statusDisplay, anchorElement) {
	var component = this;
	var goalsData = component.getGoalsData();
	var criterion = component.getCriterion();
	var mpReq = component.buildMPReq(criterion, statusCode, statusDisplay);
	var goalOutcomeActId = $(anchorElement).closest(".gwf-goal").attr("id");
	var interOutcomeActId = $(anchorElement).closest("dl").find('.gwf-goal-inter-desc span').attr("id");
	var outcomesList = component.getOutcomesList(anchorElement, goalsData);

	if (parseFloat(goalOutcomeActId) > 0 && parseFloat(interOutcomeActId) > 0) {
		for (var i = outcomesList.length; i--; ) {
			if (parseFloat(outcomesList[i].OUTCOMEACTID) === parseFloat(goalOutcomeActId)) {
				for (var j = outcomesList[i].INTERVENTIONS.length; j--; ) {
					if (parseFloat(outcomesList[i].INTERVENTIONS[j].OUTCOMEACTID) === parseFloat(interOutcomeActId)) {
						outcomesList[i].INTERVENTIONS[j].STATUS.CURRENT_STATUS_CD = statusCode;
						outcomesList[i].INTERVENTIONS[j].STATUS.CURRENT_STATUS_DISPLAY = statusDisplay;
						mpReq.LIST[0].ACCESSION_NBR = "PP" + outcomesList[i].INTERVENTIONS[j].OUTCOMEACTID;
						mpReq.LIST[0].TASKASSAYCD = outcomesList[i].INTERVENTIONS[j].TASK_ASSAY_CD;
						mpReq.LIST[0].INPUTEVENTCD = outcomesList[i].INTERVENTIONS[j].EVENT_CD;
						component.setGoalsData(goalsData);
					}
				}
			}
		}
	}

	var programName = "INN_MP_POST_LTC_OUTCOMES";
	var parameterArray = ["^MINE^", "^{'MPREQ':" + JSON.stringify(mpReq).replace(/"/g, "'") + "}^"];
	component.showSavingTip();
	component.requestData(interStatusResponseHandler, component, programName, parameterArray);

	function interStatusResponseHandler(scriptReply) {
		component.hideSavingTip();
		var glsData = component.getGoalsData();
		var outcomesLst = component.getOutcomesList(anchorElement, glsData);
		if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
			if (goalOutcomeActId > 0 && interOutcomeActId > 0) {
				for (var i = outcomesLst.length; i--; ) {
					if (parseFloat(outcomesLst[i].OUTCOMEACTID) === parseFloat(goalOutcomeActId)) {
						for (var j = outcomesLst[i].INTERVENTIONS.length; j--; ) {
							if (parseFloat(outcomesLst[i].INTERVENTIONS[j].OUTCOMEACTID) === parseFloat(interOutcomeActId)) {
								outcomesLst[i].INTERVENTIONS[j].STATUS.SAVED_STATUS_CD = outcomesLst[i].INTERVENTIONS[j].STATUS.CURRENT_STATUS_CD;
								outcomesLst[i].INTERVENTIONS[j].STATUS.SAVED_STATUS_DISPLAY = outcomesLst[i].INTERVENTIONS[j].STATUS.CURRENT_STATUS_DISPLAY;
								for (var k = outcomesLst[i].INTERVENTIONS[j].STATUSLIST.length; k--; ) {
									if (parseFloat(outcomesLst[i].INTERVENTIONS[j].STATUSLIST[k].CODE_VALUE) === parseFloat(outcomesLst[i].INTERVENTIONS[j].STATUS.SAVED_STATUS_CD)) {
										if (outcomesLst[i].INTERVENTIONS[j].METIND !== 1) {
											if (outcomesLst[i].INTERVENTIONS[j].STATUSLIST[k].METIND === 1) {
												outcomesLst[i].MET_INTERVENTIONS_CNT += 1;
											}
										}
										else {
											if (outcomesLst[i].INTERVENTIONS[j].STATUSLIST[k].METIND !== 1) {
												outcomesLst[i].MET_INTERVENTIONS_CNT -= 1;
											}
										}
										outcomesLst[i].INTERVENTIONS[j].METIND = outcomesLst[i].INTERVENTIONS[j].STATUSLIST[k].METIND;
										break;
									}
								}
								break;
							}
						}
						break;
					}
				}
				component.setGoalsData(glsData);
				if (outcomesLst[i].TOTAL_INTERVENTIONS_CNT) {
					$(anchorElement).closest(".gwf-goal-li").find(".gwf-goal-met-inter-cnt").text(outcomesLst[i].MET_INTERVENTIONS_CNT + " " + i18n.innov.GoalsWorkflowComponent.OF + " " + outcomesLst[i].TOTAL_INTERVENTIONS_CNT + " " + i18n.innov.GoalsWorkflowComponent.MET);
				}
			}
		}
	}

};

GoalsWorkflowComponent.prototype.reArrangePriorities = function() {
	$("#sortableGoals li .gwf-goal-priority span.priority-nbr").text(function(i) {
		return (i + 1);
	});
	var component = this;
	var priorities = [];
	var goalsData = component.getGoalsData();
	var goals = $('#sortableGoals .gwf-goal-li');
	for (var i = goals.length; i--; ) {
		var outcomeActId = $(goals[i]).find(".gwf-goal").attr("id");
		for (var j = 0, goalsLength = goalsData.UNMET_OUTCOMES.length; j < goalsLength; j++) {
			if (String(outcomeActId) === String(goalsData.UNMET_OUTCOMES[j].OUTCOMEACTID)) {
				goalsData.UNMET_OUTCOMES[j].PRIORITY = i + 1;
				if (goalsData.UNMET_OUTCOMES[j].SAVED_PRIORITY !== goalsData.UNMET_OUTCOMES[j].PRIORITY) {
					priorities.push({
						"OUTCOMEACTID": outcomeActId,
						"PRIORITY": i + 1
					});
				}
				break;
			}
		}
	}
	component.setGoalsData(goalsData);
	var criterion = component.getCriterion();
	if (priorities.length) {
		var programName = "INN_MP_GWF_SAVE_PRIORITIES";
		var parameterArray = ["^MINE^", "^{'PRIORITIESREC':{'PERSON_ID':" + criterion.person_id + ".0, 'ENCNTR_ID':" + criterion.encntr_id + ".0, 'OUTCOMES':" + JSON.stringify(priorities).replace(/"/g, "'") + '}}^'];
		component.requestData(prioritiesSaveResponseHandler, component, programName, parameterArray);

		function prioritiesSaveResponseHandler(scriptReply) {
			if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
				for (var i = 0, goalsLength = goalsData.UNMET_OUTCOMES.length; i < goalsLength; i++) {
					if (goalsData.UNMET_OUTCOMES[i].SAVED_PRIORITY !== goalsData.UNMET_OUTCOMES[i].PRIORITY) {
						goalsData.UNMET_OUTCOMES[i].SAVED_PRIORITY = goalsData.UNMET_OUTCOMES[i].PRIORITY;
						goalsData.UNMET_OUTCOMES[i].UPDTCNT += 1;
					}
				}
				goalsData.UNMET_OUTCOMES.sort(component.priorityCompare);
			}
		}

	}
};

GoalsWorkflowComponent.prototype.priorityCompare = function(a, b) {
	if (a.PRIORITY < b.PRIORITY) {
		return -1;
	}
	if (a.PRIORITY > b.PRIORITY) {
		return 1;
	}
	return 0;
};

GoalsWorkflowComponent.prototype.descriptionCompare = function(a, b) {
	if (a.SAVED_DESCRIPTION < b.SAVED_DESCRIPTION) {
		return -1;
	}
	if (a.SAVED_DESCRIPTION > b.SAVED_DESCRIPTION) {
		return 1;
	}
	return 0;
};

GoalsWorkflowComponent.prototype.startDateCompare = function(a, b) {
	var aStartDate = new Date(a.STARTDATE || "12/31/2100");
	var bStartDate = new Date(b.STARTDATE || "12/31/2100");
	if (aStartDate < bStartDate) {
		return -1;
	}
	if (aStartDate > bStartDate) {
		return 1;
	}
	return 0;
};

GoalsWorkflowComponent.prototype.capitalizeFirstLetterOnly = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

GoalsWorkflowComponent.prototype.createStatusMenus = function() {
	var component = this;
	var goalsData = component.getGoalsData();

	for (var i = goalsData.UNMET_OUTCOMES.length; i--; ) {
		component.createSingleStatusMenu(goalsData.UNMET_OUTCOMES[i]);
		for (var j = goalsData.UNMET_OUTCOMES[i].INTERVENTIONS.length; j--; ) {
			component.createSingleStatusMenu(goalsData.UNMET_OUTCOMES[i].INTERVENTIONS[j]);
		}
	}
	for (var i = goalsData.MET_OUTCOMES.length; i--; ) {
		component.createSingleStatusMenu(goalsData.MET_OUTCOMES[i]);
		for (var j = goalsData.MET_OUTCOMES[i].INTERVENTIONS.length; j--; ) {
			component.createSingleStatusMenu(goalsData.MET_OUTCOMES[i].INTERVENTIONS[j]);
		}
	}
	for (var i = goalsData.FUTURE_OUTCOMES.length; i--; ) {
		component.createSingleStatusMenu(goalsData.FUTURE_OUTCOMES[i]);
		for (var j = goalsData.FUTURE_OUTCOMES[i].INTERVENTIONS.length; j--; ) {
			component.createSingleStatusMenu(goalsData.FUTURE_OUTCOMES[i].INTERVENTIONS[j]);
		}
	}
};

GoalsWorkflowComponent.prototype.createSingleStatusMenu = function(outcome) {
	var component = this;
	var statusMenu = MP_MenuManager.getMenuObject("goalsStatusMenu" + outcome.OUTCOMECATID);
	if (!statusMenu) {
		statusMenu = new Menu("goalsStatusMenu" + outcome.OUTCOMECATID);
		statusMenu.setTypeClass("goals-status-menu");
		statusMenu.setAnchorConnectionCorner(["bottom", "left"]);
		statusMenu.setContentConnectionCorner(["top", "left"]);
		statusMenu.setAutoFlipHorizontal(true);
		statusMenu.setAutoFlipVertical(true);

		for (var i = outcome.STATUSLIST.length; i--; ) {
			var menuItem = new MenuItem(outcome.STATUSLIST[i].DISPLAY);
			menuItem.setLabel(((outcome.STATUSLIST[i].METIND) ? '<span class="gwf-status-icon gwf-status-met"></span>' : '<span class="gwf-status-icon gwf-status-unmet"></span>') + '<span class="status-display" value="' + outcome.STATUSLIST[i].CODE_VALUE + '">' + outcome.STATUSLIST[i].DISPLAY + "</span>");
			menuItem.setClickFunction(function() {
				var anchorElement = $("#" + statusMenu.getAnchorElementId());
				var menuItemElement = $("<div>" + this.getLabel() + "</div>");
				var statusCode = $(menuItemElement).find(".status-display").attr("value");
				var statusDisplay = $(menuItemElement).find(".status-display").text();
				if ($(anchorElement).parent().prop("tagName") === "DD") {
					$(anchorElement).find("span.status-display").text(statusDisplay);
					$(anchorElement).find("span.gwf-status-icon").replaceWith($(menuItemElement).find(".gwf-status-icon"));
					component.saveInterventionStatus(statusCode, statusDisplay, anchorElement);
				}
				else {
					$(anchorElement).attr("title", statusDisplay);
					$(anchorElement).find("span.gwf-status-icon").replaceWith($(menuItemElement).find(".gwf-status-icon"));
					component.saveGoalStatus(statusCode, statusDisplay, anchorElement);
				}
			});
			if (MenuItem.prototype.isPrototypeOf(menuItem)) {
				statusMenu.addMenuItem(menuItem);
			}
			statusMenu.addMenuItem(new MenuSeparator("separator"));
		}

		var menuItem = new MenuItem("DeleteGoal");
		menuItem.setLabel('<span class="gwf-status-icon gwf-status-delete"></span><span class="status-display" value="">' + i18n.innov.GoalsWorkflowComponent.DELETE + "</span>");
		menuItem.setClickFunction(function() {
			if (confirm(i18n.innov.GoalsWorkflowComponent.DELETE_CONFIRM)) {
				component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Goal_InError");
				var anchorElement = $("#" + statusMenu.getAnchorElementId());
				var menuItemElement = $("<div>" + this.getLabel() + "</div>");
				var statusDisplay = $(menuItemElement).find(".status-display").text();
				$(anchorElement).find("span.gwf-status-icon").replaceWith($(menuItemElement).find(".gwf-status-icon"));
				$(anchorElement).attr("title", statusDisplay);
				if ($(anchorElement).parent().prop("tagName") !== "DD") {
					component.deleteGoal(anchorElement);
				}
			}
		});
		if (MenuItem.prototype.isPrototypeOf(menuItem)) {
			statusMenu.addMenuItem(menuItem);
		}
		MP_MenuManager.updateMenuObject(statusMenu);
	}
};

GoalsWorkflowComponent.prototype.showTimedMessage = function(message) {
    $("#timedMessage").text(message);
    setTimeout(function () {
        $("#timedMessage").text("");
    }, 3000);
};

GoalsWorkflowComponent.prototype.showSavingTip = function() {
	var compNode = this.getRootComponentNode();
	$(compNode).find(".sec-total").text(i18n.innov.GoalsWorkflowComponent.SAVING).removeClass("hidden");
};

GoalsWorkflowComponent.prototype.hideSavingTip = function() {
	var compNode = this.getRootComponentNode();
	if (!$(compNode).find(".sec-total").hasClass("hidden")) {
		$(compNode).find(".sec-total").text("").addClass("hidden");
	}
};

GoalsWorkflowComponent.prototype.deleteGoal = function(anchorElement) {
	var component = this;
	var criterion = component.getCriterion();
	var goalsData = component.getGoalsData();
	var goal, i;
	var outcomesList = component.getOutcomesList(anchorElement, goalsData);
	var outcomeActId = $(anchorElement).closest(".gwf-goal").attr("id");
	var blankStatus = {
		"STATUS": "",
		"SUBEVENTSTATUS": []
	};

	for ( i = outcomesList.length; i--; ) {
		if (parseFloat(outcomesList[i].OUTCOMEACTID) === parseFloat(outcomeActId)) {
			goal = outcomesList[i];
			break;
		}
	}
	if (goal) {
		goal.DELETE_IND = 1;
		for ( i = goal.INTERVENTIONS.length; i--; ) {
			goal.INTERVENTIONS[i].DELETE_IND = 1;
		}

		var programName = "INN_MP_GWF_SAVE_GOALS";
		var parameterArray = ["^MINE^", criterion.ppr_cd.toFixed(1)];
		var dataBlob = '{"SAVEREQ":{"PERSON_ID":' + criterion.person_id.toFixed(1) + ', "ENCNTR_ID":' + criterion.encntr_id.toFixed(1) + ', "OUTCOMES":' + JSON.stringify(goal) + ',"STATUS_DATA":' + JSON.stringify(blankStatus) + '}}';
		component.showSavingTip();
		component.requestData(deleteGoalResponseHandler, component, programName, parameterArray, dataBlob);
		component.showTimedMessage(i18n.innov.GoalsWorkflowComponent.DELETING_GOAL);

		function deleteGoalResponseHandler(scriptReply) {
			component.hideSavingTip();
			var response = scriptReply.getResponse();
			var glsData = component.getGoalsData();
			var otcmsList = component.getOutcomesList(anchorElement, glsData);
			$(anchorElement).closest(".gwf-goal-li").remove();
			for ( i = otcmsList.length; i--; ) {
				if (parseFloat(otcmsList[i].OUTCOMEACTID) === parseFloat(response.OUTCOMES.OUTCOMEACTID)) {
					otcmsList.splice(i, 1);
					break;
				}
			}
			component.reArrangePriorities();
			component.updateGoalsControlCount();
			if ((glsData.UNMET_OUTCOMES.length === 0) && (glsData.MET_OUTCOMES.length === 0) && (glsData.FUTURE_OUTCOMES.length === 0)) {
				$(".gwf-control-bar").parent().html("<div class='no-goals-glyph-parent'><div class='no-goals-glyph-icon'></div><div class='no-goals-glyph-text'>" + i18n.innov.GoalsWorkflowComponent.NO_GOALS_TO_DISPLAY + "</div></div>");
			}
			if ($(".gwf-all-gls-control").hasClass("selected")) {
				component.showAllGoals();
			}
		}

	}
};

GoalsWorkflowComponent.prototype.showNoResultsGlyph = function() {
	MP_Util.Doc.FinalizeComponent("<div class='no-goals-glyph-parent'><div class='no-goals-glyph-icon'></div><div class='no-goals-glyph-text'>" + i18n.innov.GoalsWorkflowComponent.NO_GOALS_TO_DISPLAY + "</div></div>", this, "");
};

GoalsWorkflowComponent.prototype.logCapTimer = function(timerName) {
	var timer = MP_Util.CreateTimer(timerName);
	if (timer) {
		timer.Start();
		timer.Stop();
	}
};

/**
 * This is the GoalsWorkflowComponent implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 */
GoalsWorkflowComponent.prototype.renderComponent = function(reply) {
	var recordData = reply.getResponse();
	var component = reply.getComponent();
	var timerRenderComponent = MP_Util.CreateTimer(component.getComponentRenderTimerName(), component.getCriterion().category_mean);
	try {
		if ((recordData.STATUS_DATA.STATUS === "S") || (recordData.STATUS_DATA.STATUS === "Z")) {
			component.setGoalsData(recordData);
			component.setDetailLists();
			component.createStatusMenus();
			if (recordData.PHYSICIAN && recordData.PHYSICIAN.length > 0) {
				component.bedrockSettings.physicianName = recordData.PHYSICIAN[0].NAME_FULL_FORMATTED;
				component.bedrockSettings.physicianRel = recordData.PHYSICIAN[0].RELATION_TYPE;
				component.bedrockSettings.physicianPhone = recordData.PHYSICIAN[0].PHONE_NUMBER;
				component.bedrockSettings.physicianPhoneType = recordData.PHYSICIAN[0].PHONE_TYPE;
			}

			if (recordData.STATUS_DATA.STATUS === "S") {
				recordData.MET_OUTCOMES.sort(component.descriptionCompare);
				recordData.FUTURE_OUTCOMES.sort(component.startDateCompare);
				MP_Util.Doc.FinalizeComponent(window.render.goalsComponent({
					data: recordData,
					component: component,
					labels: component.getLabels()
				}), component, "");
				component.attachEvents();
				component.reArrangePriorities();

			}
			else if (recordData.STATUS_DATA.STATUS === "Z") {
				component.showNoResultsGlyph();
			}
			component.enableGoalsSorting();
			component.showUnmetGoals();
			if (!_g("gwfPrintPreview" + component.getComponentId())) {
				var curDiv = Util.ce("span");
				curDiv.className = "gwf-preview-icon";
				curDiv.title = i18n.innov.GoalsWorkflowComponent.PRINT_PREVIEW;
				curDiv.id = "gwfPrintPreview" + component.getComponentId();
				component.getRenderStrategy().addComponentSection($(".header-elements-container", $(component.getRootComponentNode())), curDiv);
				curDiv.onclick = function() {
					component.launchPreviewDialog(component);
				};
			}
		}
	}
	catch (err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		throw (err);
	}
	finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};

GoalsWorkflowComponent.prototype.enableGoalsSorting = function() {
	var component = this;
	$("#sortableGoals").unbind().sortable({
		handle: ".gwf-goal-priority",
		axis: "y",
		contaiment: "parent",
		distance: "5",
		revert: true,
		scroll: true,
		tolerance: "pointer",
		placeholder: "sortable-placeholder",
		forcePlaceholderSize: true,
		cursor: "url('../images/closedhand.cur'),move",
		stop: function() {
			component.reArrangePriorities();
		},
		start: function(event, ui) {
			ui.placeholder.height(ui.item.height() + 10);
		}
	});
};

GoalsWorkflowComponent.prototype.saveGoalPriority = function(goal) {
	var component = this;
	if (goal.SAVED_PRIORITY !== goal.PRIORITY) {
		var priorities = [{
			"OUTCOMEACTID": goal.OUTCOMEACTID,
			"PRIORITY": goal.PRIORITY
		}];
		var criterion = this.getCriterion();
		var programName = "INN_MP_GWF_SAVE_PRIORITIES";
		var parameterArray = ["^MINE^", "^{'PRIORITIESREC':{'PERSON_ID':" + criterion.person_id + ".0, 'ENCNTR_ID':" + criterion.encntr_id + ".0, 'OUTCOMES':" + JSON.stringify(priorities).replace(/"/g, "'") + '}}^'];
		component.requestData(savePriorityResponseHandler, component, programName, parameterArray);

		function savePriorityResponseHandler(scriptReply) {
			if (scriptReply.getResponse().STATUS_DATA.STATUS === "S") {
				goal.SAVED_PRIORITY = goal.PRIORITY;
				goal.UPDTCNT = goal.UPDTCNT + 1;
			}
		}

	}
};

GoalsWorkflowComponent.prototype.showModifiedGoal = function(goal, index, old_goal_type) {
	var goals = this.getGoalsData(), current_goal_type, outcomesList;
	var component = this;
	var goal_index = index;
	var labels = component.getLabels();
	if (goal.FUTUREIND === 1) {
		current_goal_type = "future";
		component.showTimedMessage(i18n.innov.GoalsWorkflowComponent.GOAL_SAVED_TO + " " + labels.futureLabel);
		outcomesList = goals.FUTURE_OUTCOMES;
	}
	else if (goal.METIND === 1) {
		current_goal_type = "met";
		component.showTimedMessage(i18n.innov.GoalsWorkflowComponent.GOAL_SAVED_TO + " " + labels.metLabel);
		outcomesList = goals.MET_OUTCOMES;
	}
	else {
		current_goal_type = "unmet";
		outcomesList = goals.UNMET_OUTCOMES;
		component.showTimedMessage(i18n.innov.GoalsWorkflowComponent.GOAL_SAVED_TO + " " + labels.unmetLabel);
	}

	component.createSingleStatusMenu(goal);
	for (var i = goal.INTERVENTIONS.length; i--; ) {
		component.createSingleStatusMenu(goal.INTERVENTIONS[i]);
	}

	if ((goals.UNMET_OUTCOMES.length === 0) && (goals.MET_OUTCOMES.length === 0) && (goals.FUTURE_OUTCOMES.length === 0)) {
		outcomesList.push(goal);
		this.setGoalsData(goals);
		$(".no-goals-glyph-parent").replaceWith(window.render.goalsComponent({
			data: goals,
			component: component,
			labels: component.getLabels()
		}));
		component.enableGoalsSorting();
		component.attachEvents();
		component.reArrangePriorities();
		component.showUnmetGoals();
	}
	else {
		var goalHtml = window.render.singleGoalHtml({
			goal: goal,
			index: goal_index,
			component: this,
			labels: this.getLabels()
		});
		if (current_goal_type === old_goal_type) {
			if (outcomesList.length === goal_index) {
				outcomesList.push(goal);
				switch (current_goal_type){
					case "future":
					$(".gwf-future-goals").append(goalHtml);
					break;
					case "unmet":
					$(".gwf-unmet-goals").append(goalHtml);
					break;
					case "met":
					$(".gwf-met-goals").append(goalHtml);
					break;
				}
			}
			else {
				$(".gwf-goal[id=" + goal.OUTCOMEACTID + "]").closest(".gwf-goal-li").replaceWith(goalHtml);
				outcomesList[goal_index] = goal;
			}
		}
		else {
			$(".gwf-goal[id=" + goal.OUTCOMEACTID + "]").closest(".gwf-goal-li").remove();
			function spliceOutcomes(outcomes, goal){
				for (var i = outcomes.length; i--; ){
					if (parseFloat(outcomes[i].OUTCOMEACTID) === parseFloat(goal.OUTCOMEACTID)){
						outcomes.splice(i, 1);
					}
				}
			}
			switch (old_goal_type){
				case "future":
					spliceOutcomes(goals.FUTURE_OUTCOMES, goal);
					break;

				case "met":
					spliceOutcomes(goals.MET_OUTCOMES, goal);
					break;

				case "unmet":
					spliceOutcomes(goals.UNMET_OUTCOMES, goal);
					break;


			}

			this.reArrangePriorities();
			if (current_goal_type === "future") {
				if (goal.PRIORITY !== 0) {
					goal.PRIORITY = 0;
					this.saveGoalPriority(goal);
				}
				$(".gwf-future-goals").append(goalHtml);
			}
			else if (current_goal_type === "unmet") {
				if (goal.PRIORITY === 0) {
					goal.PRIORITY = $(".gwf-unmet-goals li").length + 1;
					this.saveGoalPriority(goal);
				}
				goalHtml = window.render.singleGoalHtml({
					goal: goal,
					index: goal_index,
					component: this,
					labels: this.getLabels()
				});
				$(".gwf-unmet-goals").append(goalHtml);
			}
			else if (current_goal_type === "met") {
				if (goal.PRIORITY !== 0) {
					goal.PRIORITY = 0;
					this.saveGoalPriority(goal);
				}
				$(".gwf-met-goals").append(goalHtml);
			}
			outcomesList.push(goal);
		}
		this.setGoalsData(goals);
		this.attachEvents();
		this.updateGoalsControlCount();
		if ($(".gwf-all-gls-control").hasClass("selected")) {
			component.showAllGoals();
		}
	}
};

GoalsWorkflowComponent.prototype.getInterventionsTable = function(interventions) {
	var bedrockSettings = this.getBedrockSettings();
	var table = new ComponentTable();
	table.setCustomClass("interventions-table");
	table.setNamespace("gwf");
	table.setZebraStripe(true);

	var InterDescCol = new TableColumn();
	InterDescCol.setColumnId("INTER_DESC_COL");
	InterDescCol.setCustomClass("gwf-goal-inter-desc");
	InterDescCol.setColumnDisplay(bedrockSettings.interventionLabel || i18n.innov.GoalsWorkflowComponent.INTERVENTION);
	InterDescCol.setRenderTemplate('<span id="${OUTCOMEACTID}">${CURRENT_DESCRIPTION}</span>');
	table.addColumn(InterDescCol);

	var TypeCol = new TableColumn();
	TypeCol.setColumnId("TYPE_COLUMN");
	TypeCol.setCustomClass("gwf-goal-inter-type");
	TypeCol.setColumnDisplay(bedrockSettings.interTypeLabel || i18n.innov.GoalsWorkflowComponent.TYPE);
	TypeCol.setRenderTemplate("<span>${TYPE_DISPLAY_STR}</span>");
	table.addColumn(TypeCol);

	var CategoryCol = new TableColumn();
	CategoryCol.setColumnId("CATEGORY_COLUMN");
	CategoryCol.setCustomClass("gwf-goal-inter-category");
	CategoryCol.setColumnDisplay(bedrockSettings.interCategoryLabel || i18n.innov.GoalsWorkflowComponent.CATEGORY);
	CategoryCol.setRenderTemplate("<span>${CATEGORY_DISPLAY_STR}</span>");
	table.addColumn(CategoryCol);

	var StatusCol = new TableColumn();
	StatusCol.setColumnId("STATUS_COLUMN");
	StatusCol.setCustomClass("gwf-goal-inter-status");
	StatusCol.setColumnDisplay(bedrockSettings.interStatusLabel || i18n.innov.GoalsWorkflowComponent.STATUS);
	var statusHtml = "<div class='gwf-inter-status-select' id='outcomeStatus${OUTCOMEACTID}' catid='${OUTCOMECATID}'><span class='${STATUS.STATUS_ICON} gwf-status-icon'></span><span class='status-display'>${STATUS.CURRENT_STATUS_DISPLAY}</span><span class='down-arrow'></span></div>";
	StatusCol.setRenderTemplate(statusHtml);
	table.addColumn(StatusCol);

	var FrequencyCol = new TableColumn();
	FrequencyCol.setColumnId("FREQUENCY_COLUMN");
	FrequencyCol.setCustomClass("gwf-goal-inter-frequency");
	FrequencyCol.setColumnDisplay(bedrockSettings.interFrequencyLabel || i18n.innov.GoalsWorkflowComponent.FREQUENCY);
	FrequencyCol.setRenderTemplate("<span>${FREQUENCY.CURRENT_FREQUENCY_DISPLAY}</span>");
	table.addColumn(FrequencyCol);

	var TargetCol = new TableColumn();
	TargetCol.setColumnId("TARGET_COLUMN");
	TargetCol.setCustomClass("gwf-goal-inter-target");
	TargetCol.setColumnDisplay(bedrockSettings.interTargetLabel || i18n.innov.GoalsWorkflowComponent.TARGET);
	TargetCol.setRenderTemplate("<span>${SAVED_TARGET_VAL}&nbsp;${TARGETUNIT.CURRENT_TARGETUNIT_DISPLAY}</span>");
	table.addColumn(TargetCol);

	var ConfidenceCol = new TableColumn();
	ConfidenceCol.setColumnId("CONFIDENCE_COLUMN");
	ConfidenceCol.setCustomClass("gwf-goal-inter-confidence");
	ConfidenceCol.setColumnDisplay(bedrockSettings.interConfidenceLabel || i18n.innov.GoalsWorkflowComponent.CONFIDENCE);
	ConfidenceCol.setRenderTemplate("<span>${CURRENT_CONFIDENCE}</span>");
	table.addColumn(ConfidenceCol);

	for (var i = interventions.length; i--; ) {
		var interTypes = [], interCategories = [];
		for (var j = interventions[i].SAVED_TYPE.length; j--; ) {
			interTypes.push(interventions[i].SAVED_TYPE[j].DISPLAY);
		}
		for (var j = interventions[i].SAVED_CATEGORY.length; j--; ) {
			interCategories.push(interventions[i].SAVED_CATEGORY[j].DISPLAY);
		}
		interventions[i].TYPE_DISPLAY_STR = interTypes.join(', ');
		interventions[i].CATEGORY_DISPLAY_STR = interCategories.join(', ');
		interventions[i].CURRENT_DESCRIPTION = interventions[i].CURRENT_DESCRIPTION.replace(/</g,"&lt;").replace(/>/g,"&gt;");
		if (interventions[i].STATUS.CURRENT_STATUS_DISPLAY === '') {
			interventions[i].STATUS.CURRENT_STATUS_DISPLAY = i18n.innov.GoalsWorkflowComponent.NONE;
		}
	}

	table.bindData(interventions);
	return table.render();
};

GoalsWorkflowComponent.prototype.launchPreviewDialog = function(component) {
	var outcomes = component.getGoalsData();
	var metOutcomes = outcomes.MET_OUTCOMES;
	var futureOutcomes = outcomes.FUTURE_OUTCOMES;
	var criterion = component.getCriterion();

	var previewDialog = new ModalDialog("previewDialog");
	var print_button = new ModalButton("printButton");
	var save_button = new ModalButton("saveButton");
	var savenprint_button = new ModalButton("savenprintButton");
	var cancel_button = new ModalButton("cancelButton");
	var submit_button = new ModalButton("submitButton");
	var title = "Patient Goals";

	previewDialog.setIconClass("preview-dialog").setTopMarginPercentage(0).setRightMarginPercentage(0).setBottomMarginPercentage(0).setLeftMarginPercentage(0).setIsBodySizeFixed(true).setHeaderTitle(title).setIsFooterAlwaysShown(true).setShowCloseIcon(false);

	previewDialog.setBodyDataFunction(function(obj) {
		var html = "";
		//if demobanner is not created on the mpage, call MP_GET_PATIENT_DEMO to get patient info
		if ($("#demobanner").length === 0) {
			var sendAr = ["^MINE^ ," + criterion.person_id + ".0, " + criterion.encntr_id + ".0"];
			var programName = "MP_GET_PATIENT_DEMO";
			component.requestData(patientDemoResponseHandler, component, programName, sendAr);

			function patientDemoResponseHandler(scriptReply) {
				var recordData = scriptReply.getResponse();
				html = component.getPrevBannerHtmlFromJson(recordData);
				//create preview html
				html += component.getPreviewHtml();
				obj.setBodyHTML(html);
				component.attachPreviewCheckBoxEvents();
			}
		}
		else {
			html = component.getPrevBannerHtml();
			html += component.getPreviewHtml();
			obj.setBodyHTML(html);
			component.attachPreviewCheckBoxEvents();
		}
	});

	//print function
	previewDialog.print = function() {
		//Clone the Div
		var clone = $(".dyn-modal-body-container").clone();
		var head = $(".dyn-modal-hdr-container");
		//Detach the body from html
		var body = $("body").detach();

		//Append the div to the page along with body
		$("html").append($("<body></body>"));
		var pageHeader = $(clone).find(".dmg-info").detach();
		$("body").append("<table><thead><tr><td><div class='page-header'></div><br/></td></tr></thead><tbody><tr><td></td></tr></tbody></table>");
		$(".page-header").prepend(pageHeader);
		$(".page-header").prepend(head);
		$("tbody tr td").html($(clone).html());
		$(clone).find(":checkbox").removeAttr("disabled");
		$(clone).width("8in");

		//Show the clone
		clone.show();
		// In case the content was hidden
		//Print Page
		window.print();

		//Remove the clone div from the page
		$("html body").remove();

		//Restore orignal page content
		body.appendTo($("html"));
		MP_ModalDialog.closeModalDialog("previewDialog");
		MP_ModalDialog.deleteModalDialogObject("previewDialog");
	};

	//save function
	function populateViewObject(){
		return {
			m_label: "Patient Goals",
			m_unmetGoalHeader: component.getUnmetLabel(),
			m_futureGoalHeader: component.getFutureLabel(),
			m_metGoalHeader: component.getMetLabel(),
			banner: $("#previewDialogbody").find(".dmg-info").text(),
			m_priorHeader: i18n.innov.GoalsWorkflowComponent.PRIORITY,
			m_goalHeader: i18n.innov.GoalsWorkflowComponent.GOALS,
			m_interHeader: component.getInterventionLabel(),
			m_typeHeader: component.getTypeLabel(),
			m_catHeader: component.getCategoryLabel(),
			m_statusHeader: component.getInterStatusLabel(),
			m_commentHeader: i18n.innov.GoalsWorkflowComponent.COMMENT,
			m_startDateHeader: component.getStartLabel(),
			m_targetDateHeader: component.getTargetLabel(),
			unmetGoals: [],
			metGoals: [],
			futureGoals: []
		};
	}
	previewDialog.save = function() {
		var viewObj = populateViewObject();
		var $dialogBody = $("#previewDialogbody");
		//fill in unmet goals to viewobj
		var liArr = [];
		var curLi = null;
		var rowsArr = $dialogBody.find(".gwf-preview-table-unmet tbody tr");
		var row = null;
		var i = 0, il = 0, j = 0, jl = 0, m = 0;
		var curEl = viewObj.unmetGoals;
		var goalClass = ".gwf-goal-cell";
		var commentClass = ".gwf-cmt-cell";
		for ( m = 3; m--; ) {
			if (m < 2) {
				goalClass = ".gwf-goal-cell-2";
				commentClass = ".gwf-cmt-cell-2";
			}
			for ( i = 0, il = rowsArr.length; i < il; i++) {
				row = rowsArr[i];
				var goalObj = {};
				var $row = $(row);
				if (m >= 2) {
					goalObj.priority = $row.find(".gwf-pri-cell") ? $row.find(".gwf-pri-cell").text() : "";
				}
				goalObj.goal = $row.find(goalClass) ? $row.find(goalClass).text() : "";
				goalObj.interventions = [];
				goalObj.types = [];
				goalObj.categories = [];
				if ($row.find(".gwf-int-cell")) {
					liArr = $row.find(".gwf-int-cell li");
					for ( j = 0, jl = liArr.length; j < jl; j++) {
						curLi = liArr[j];
						var $li = $(curLi);
						var isMetInt = false;
						if ($li.find(".metInd").attr("title") == 1) {
							isMetInt = true;
						}

						goalObj.interventions.push({
							intervention: $li.find(".int-text").text(),
							isMet: isMetInt
						});

					}
				}
				goalObj.types = [];
				if ($row.find(".gwf-typ-cell")) {
					liArr = $row.find(".gwf-cat-cell div");
					for ( j = 0, jl = liArr.length; j < jl; j++) {
						goalObj.types.push({
							type: $(liArr[j]).text()
						});
					}
				}
				goalObj.categories = [];
				if ($row.find(".gwf-cat-cell")) {
					liArr = $row.find(".gwf-cat-cell div");
					for ( j = 0, jl = liArr.length; j < jl; j++) {
						goalObj.categories.push({
							category: $(liArr[j]).text()
						});
					}
				}
				goalObj.status = $row.find(".gwf-sta-cell") ? $row.find(".gwf-sta-cell").text() : "";
				goalObj.comments = $row.find(commentClass) ? $row.find(commentClass).text() : "";
				goalObj.startDate = $row.find(".gwf-start-date-cell") ? $row.find(".gwf-start-date-cell").text() : "";
				goalObj.targetDate = $row.find(".gwf-target-date-cell") ? $row.find(".gwf-target-date-cell").text() : "";
				curEl.push(goalObj);
			}
			if (m === 2) {
				rowsArr = $dialogBody.find(".gwf-preview-table-met tbody tr");
				curEl = viewObj.metGoals;
			}
			else {
				rowsArr = $dialogBody.find(".gwf-preview-table-future tbody tr");
				curEl = viewObj.futureGoals;
			}
		}
		var template = window.render.goalsSave({
			data: viewObj
		});
		var rtf = template.replace(/\s+/g, " ");
		//call inn_mp_add_document to add document

		var goalEvtCd = component.bedrockSettings.goalClinicalNoteCd;
		var sendAr = ["^MINE^ ," + criterion.person_id.toFixed(1) + ", " + criterion.provider_id.toFixed(1) + ", " + criterion.encntr_id.toFixed(1) + ", " + goalEvtCd + ", ^" + i18n.innov.GoalsWorkflowComponent.PLAN_OF_CARE + "^, ^" + rtf + "^, " + criterion.ppr_cd.toFixed(1)];
		var programName = "INN_MP_ADD_DOCUMENT";
		component.showSavingTip();
		component.requestData(addDocumentResponseHandler, component, programName, sendAr);

		function addDocumentResponseHandler(scriptReply) {
			var recordData = scriptReply.getResponse();
			component.hideSavingTip();
			var scriptStatus = recordData.STATUS_DATA.STATUS;
			if (scriptStatus === "S") {
				component.showTimedMessage(i18n.innov.GoalsWorkflowComponent.DOCUMENT_SAVED);
			}
		}

	};
	//print selected outcomes on letter size paper
	print_button.setText(i18n.innov.GoalsWorkflowComponent.PRINT).setOnClickFunction(function() {
		component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Print_Doc");
		previewDialog.print();
	});
	cancel_button.setText(i18n.innov.GoalsWorkflowComponent.CANCEL).setOnClickFunction(function() {
		MP_ModalDialog.closeModalDialog("previewDialog");
		MP_ModalDialog.deleteModalDialogObject("previewDialog");
	});
	//submit selected outcomes, update button and table
	submit_button.setText(i18n.innov.GoalsWorkflowComponent.SUBMIT).setOnClickFunction(function() {
		var $dialogBody = $("#previewDialogbody");
		var $dialogFooter = $("#previewDialogfooter");
		var $unmetTable = $dialogBody.find(".gwf-preview-table-unmet");
		var $metTable = $dialogBody.find(".gwf-preview-table-met");
		var $futureTable = $dialogBody.find(".gwf-preview-table-future");
		var notSelected = $dialogBody.find(".gwf-preview-checkbox:not(:checked)");
		var allRows = $dialogBody.find(".gwf-preview-table").find("tr");
		var metRows = $dialogBody.find(".gwf-preview-table-met").find("tr");
		var futureRows = $dialogBody.find(".gwf-preview-table-future").find("tr");
		var cmtNotSelected = $dialogBody.find(".gwf-preview-cmt-checkbox:not(:checked)");
		//Type checkbox
		var isUnmetTypeSelected = $unmetTable.find(".gwf-preview-type-checkbox").is(":checked");
		var isMetTypeSelected = $metTable.find(".gwf-preview-type-checkbox").is(":checked");
		var isFutureTypeSelected = $futureTable.find(".gwf-preview-type-checkbox").is(":checked");

		var isUnmetIntSelected = $unmetTable.find(".gwf-preview-int-checkbox").is(":checked");
		var isMetIntSelected = $metTable.find(".gwf-preview-int-checkbox").is(":checked");
		var isFutureIntSelected = $futureTable.find(".gwf-preview-int-checkbox").is(":checked");
		//Category checkbox
		var isUnmetCategorySelected = $unmetTable.find(".gwf-preview-category-checkbox").is(":checked");
		var isMetCategorySelected = $metTable.find(".gwf-preview-category-checkbox").is(":checked");
		var isFutureCategorySelected = $futureTable.find(".gwf-preview-category-checkbox").is(":checked");

		//find removed(unSelectd) Met rows
		var rmMetRow = 0;
		var rmFutureRow = 0;
		var i = 0, il = 0, j = 0, jl = 0;
		var el = null;
		var el1 = null;
		var row = null;

		for ( i = 0, il = metRows.length; i < il; i++) {
			row = metRows[i];
			if ($(row).find(".gwf-preview-checkbox:not(:checked)").length > 0) {
				rmMetRow = rmMetRow + 1;
			}
		}

		for ( i = 0, il = futureRows.length; i < il; i++) {
			row = futureRows[i];
			if ($(row).find(".gwf-preview-checkbox:not(:checked)").length > 0) {
				rmFutureRow = rmFutureRow + 1;
			}
		}

		for ( i = 0, il = notSelected.length; i < il; i++) {
			el = notSelected[i];
			$(el).closest("tr").remove();
		}

		for ( i = 0, il = cmtNotSelected.length; i < il; i++) {
			el = cmtNotSelected[i];
			$(el).closest("td").text("");
		}

		for ( i = 0, il = allRows.length; i < il; i++) {
			el = allRows[i];
			$(el).find("td:eq(0)").remove();
			$(el).find("th:eq(0)").remove();
			$(el).find(".gwf-preview-cmt-checkbox").remove();
			var intRows = $(el).find(".gwf-int-listcell");
			//check each intervention for checked
			for ( j = 0, jl = intRows.length; j < jl; j++) {
				el1 = intRows[j];
				if ($(el1).find(".gwf-int-checkbox").is(":checked")) {
					$(el1).find(".gwf-int-checkbox").remove();
				}
				else {
					$(el1).remove();
				}
			}
		}

		if (!isUnmetTypeSelected) {
			$unmetTable.find(".gwf-typ-cell").hide();
		}
		if (!isUnmetIntSelected) {
			$unmetTable.find(".gwf-int-cell").hide();
		}
		if (!isUnmetCategorySelected) {
			$unmetTable.find(".gwf-cat-cell").hide();
		}
		if (!isMetTypeSelected) {
			$metTable.find(".gwf-typ-cell").hide();
		}
		if (!isMetIntSelected) {
			$metTable.find(".gwf-int-cell").hide();
		}
		if (!isMetCategorySelected) {
			$metTable.find(".gwf-cat-cell").hide();
		}
		if (!isFutureTypeSelected) {
			$futureTable.find(".gwf-typ-cell").hide();
		}
		if (!isFutureIntSelected) {
			$futureTable.find(".gwf-int-cell").hide();
		}
		if (!isFutureCategorySelected) {
			$futureTable.find(".gwf-cat-cell").hide();
		}

		if (metOutcomes) {
			if (rmMetRow === metOutcomes.length) {
				//if no Met Goals row is selected, hide the entire Met Goals section
				$(".met-goal-header").hide();
				$metTable.hide();
			}
		}
		if (futureOutcomes) {
			if (rmFutureRow === futureOutcomes.length) {
				//if no Met Goals row is selected, hide the entire Met Goals section
				$(".future-goal-header").hide();
				$futureTable.hide();
			}
		}

		$dialogFooter.find("#submitButton").hide();
		$dialogFooter.find("#printButton").show();
		$dialogFooter.find("#saveButton").show();
		$dialogFooter.find("#savenprintButton").show();
		$dialogBody.find(".gwf-preview-type-checkbox").hide();
		$dialogBody.find(".gwf-preview-int-checkbox").hide();
		$dialogBody.find(".gwf-preview-category-checkbox").hide();
	});
	save_button.setText(i18n.innov.GoalsWorkflowComponent.SAVE).setOnClickFunction(function() {
		component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Save_Doc");
		previewDialog.save();
	});
	savenprint_button.setText(i18n.innov.GoalsWorkflowComponent.SAVE_AND_PRINT).setOnClickFunction(function() {
		component.logCapTimer("CAP:MPG:GoalsWorkflowComponent_Save_Print_Doc");
		previewDialog.save();
		previewDialog.print();
	});

	previewDialog.addFooterButton(save_button);
	previewDialog.addFooterButton(print_button);
	previewDialog.addFooterButton(savenprint_button);
	previewDialog.addFooterButton(submit_button);
	previewDialog.addFooterButton(cancel_button);
	previewDialog.setFooterButtonCloseOnClick("submitButton", false);
	MP_ModalDialog.addModalDialogObject(previewDialog);
	MP_ModalDialog.showModalDialog("previewDialog");
	//hide the shadow
	component.hideShadow();
};

GoalsWorkflowComponent.prototype.hideShadow = function() {
	var $dialogFooter = $("#previewDialogfooter");
	$(".dyn-modal-div").css("background-color", "white");
	$(".dyn-modal-div").css("opacity", "");
	$(".dyn-modal-div").css("-moz-opacity", "");
	$(".dyn-modal-div").css("filter", "");
	$dialogFooter.find("#printButton").hide();
	$dialogFooter.find("#saveButton").hide();
	$dialogFooter.find("#savenprintButton").hide();
};
//attach checkbox event in preview dialog
GoalsWorkflowComponent.prototype.attachPreviewCheckBoxEvents = function() {
	$(".gwf-preview-checkbox-all").bind("change", function(event) {
		var $target = $(event.target);
		if ($target.is(":checked")) {
			$target.closest("table").find(".gwf-preview-checkbox").prop("checked", true);
			if ($target.closest("table").find(".gwf-preview-int-checkbox").is(":checked")) {
				$target.closest("table").find(".gwf-int-checkbox").prop("checked", true);
			}

		}
		else {
			$target.closest("table").find(".gwf-preview-checkbox").prop("checked", false);
			$target.closest("table").find(".gwf-int-checkbox").prop("checked", false);
		}
	});

	$(".gwf-preview-checkbox").bind("change", function(event) {
		var $target = $(event.target);
		if ($target.is(":checked")) {
			if ($target.closest("table").find(".gwf-preview-int-checkbox").is(":checked")) {
				$target.closest("tr").find(".gwf-int-checkbox").prop("checked", true);
			}
		}
		else {
			$target.closest("tr").find(".gwf-int-checkbox").prop("checked", false);
		}
	});

	$(".gwf-preview-int-checkbox").bind("change", function(event) {
		var $target = $(event.target);
		if ($target.is(":checked")) {
			$target.closest("table").find(".gwf-int-checkbox").show();
		}
		else {
			$target.closest("table").find(".gwf-int-checkbox").hide();
		}
	});
};

//get print preview banner html from json string
GoalsWorkflowComponent.prototype.getPrevBannerHtmlFromJson = function(recordData) {
	var birthDate = "";
	var birthDtTm = new Date();
	var codeArray = null;
	var enCodeArray = [];
	var finNbr = "";
	var jsHTML = [];
	var mrnNbr = "";
	var nameFull = "";
	var patInfo = null;
	var ptCodeArray = [];
	var component = this;
	//Setup
	codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
	patInfo = recordData.DEMOGRAPHICS.PATIENT_INFO;
	nameFull = patInfo.PATIENT_NAME.NAME_FULL;

	//Determine if DOB is displayed.
	//Determine the patient's age based on the absolute date stored in the DB or the calculated date and time
	if (patInfo.ABS_BIRTH_DT_TM !== "") {
		var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
		var d = patInfo.ABS_BIRTH_DT_TM.match(new RegExp(regexp));
		birthDtTm = new Date(d[1], d[3] - 1, d[5], d[7], d[8], d[10]);
		birthDate = birthDtTm.format("shortDate2");
	}
	else if (patInfo.BIRTH_DT_TM !== "") {
		birthDtTm.setISO8601(patInfo.BIRTH_DT_TM);
		birthDate = birthDtTm.format("shortDate2");
	}
	//Determine if MRN or FIN is displayed
	if (component.getMRNDisplay() || component.getFINDisplay()) {
		//codeObject.display - will give the display name associated with the code value
		var encntrInfo = recordData.DEMOGRAPHICS.ENCOUNTER_INFO;
		for (var j = 0, e = encntrInfo.length; j < e; j++) {
			for (var i = 0, l = encntrInfo[j].ALIAS.length; i < l; i++) {
				enCodeArray[i] = MP_Util.GetValueFromArray(encntrInfo[j].ALIAS[i].ALIAS_TYPE_CD, codeArray);
				if (enCodeArray[i].meaning === "FIN NBR") {
					finNbr = encntrInfo[j].ALIAS[i].FORMATTED_ALIAS;
				}
				if (enCodeArray[i].meaning === "MRN") {
					mrnNbr = encntrInfo[j].ALIAS[i].FORMATTED_ALIAS;
				}
			}
		}
		//If did not find MRN look in Patient ALIAS
		var aliasArry = recordData.DEMOGRAPHICS.PATIENT_INFO.ALIAS;
		if (mrnNbr === "") {
			for (var k = 0, l = aliasArry.length; k < l; k++) {
				ptCodeArray[k] = MP_Util.GetValueFromArray(aliasArry[k].ALIAS_TYPE_CD, codeArray);
				if (ptCodeArray[k].meaning === "MRN") {
					mrnNbr = aliasArry[k].FORMATTED_ALIAS;
				}
			}
		}
	}
	//Populate the Demo Banner HTML
	jsHTML.push("<dl class='dmg-info'><dt class='dmg-pt-name-lbl'><span>", i18n.NAME, ":</span></dt><dd class='dmg-pt-name'><span>", nameFull, "&#32;&#32;</span></dd>");
	jsHTML.push("<dt><span>", i18n.DOB, ":</span></dt><dd class='dmg-dob'><span>", birthDate, "&#32;&#32;</span></dd>");
	if (component.getMRNDisplay()) {
		jsHTML.push("<dt><span>", i18n.MRN, ":</span></dt><dd class='dmg-mrn'><span>", mrnNbr, "&#32;&#32;</span></dd>");
	}
	if (component.getFINDisplay()) {
		jsHTML.push("<dt><span>", i18n.FIN, ":</span></dt><dd class='dmg-fin'><span>", finNbr, "&#32;&#32;</span></dd>");
	}
	if (component.bedrockSettings.physicianRel > "") {
		jsHTML.push("<dt><span>", component.bedrockSettings.physicianRel, ":&#32;</span></dt><dd class='dmg-phy'><span>", component.bedrockSettings.physicianName, "&#32;&#32;</span></dd>");
	}
	if (component.bedrockSettings.physicianPhoneType > "") {
		jsHTML.push("<dt><span>", "Phone:&#32;</span></dt><dd class='dmg-phy-phone'><span>", component.bedrockSettings.physicianPhone, "&#32;&#32;</span></dd>");
	}
	jsHTML.push("</dl>");
	jsHTML.push("<br/>");

	jsHTML = jsHTML.join("");
	return jsHTML;
};

GoalsWorkflowComponent.prototype.getPrevBannerHtml = function() {
	var component = this;
	var nameFull = "";
	var birthDate = "";
	var finNbr = "";
	var mrnNbr = "";
	var jsHTML = [];

	nameFull = $(".dmg-pt-name")[0].innerText;
	birthDate = $(".dmg-dob")[0].innerText;
	mrnNbr = $(".dmg-mrn")[0].innerText;
	finNbr = $(".dmg-fin")[0].innerText;

	//Populate the Demo Banner HTML
	jsHTML.push("<dl class='dmg-info'><dt class='dmg-pt-name-lbl'><span>", i18n.NAME, ":</span></dt><dd class='dmg-pt-name'><span>", nameFull, "&nbsp;&nbsp;</span></dd>");
	jsHTML.push("<dt><span>", i18n.DOB, ":</span></dt><dd class='dmg-dob'><span>", birthDate, "&nbsp;&nbsp;</span></dd>");

	if (component.getMRNDisplay()) {
		jsHTML.push("<dt><span>", i18n.MRN, ":</span></dt><dd class='dmg-mrn'><span>", mrnNbr, "&nbsp;&nbsp;</span></dd>");
	}
	if (component.getFINDisplay()) {
		jsHTML.push("<dt><span>", i18n.FIN, ":</span></dt><dd class='dmg-fin'><span>", finNbr, "&nbsp;&nbsp;</span></dd>");
	}
	if (component.bedrockSettings.physicianRel > "") {
		jsHTML.push("<dt><span>", component.bedrockSettings.physicianRel, ":&nbsp;</span></dt><dd class='dmg-phy'><span>", component.bedrockSettings.physicianName, "&nbsp;&nbsp;</span></dd>");
	}
	if (component.bedrockSettings.physicianPhoneType > "") {
		jsHTML.push("<dt><span>", "Phone:&nbsp;</span></dt><dd class='dmg-phy-phone'><span>", component.bedrockSettings.physicianPhone, "&nbsp;&nbsp;</span></dd>");
	}

	jsHTML.push("</dl>");
	jsHTML.push("<br/>");

	jsHTML = jsHTML.join("");
	return jsHTML;
};

//get preview tbale html
GoalsWorkflowComponent.prototype.getPreviewHtml = function() {
	var component = this;
	var outcomes = component.getGoalsData();
	var outcome = null;
	var futureOutcomes = outcomes.FUTURE_OUTCOMES;
	var metOutcomes = outcomes.MET_OUTCOMES;
	var unmetOutcomes = outcomes.UNMET_OUTCOMES;
	var curOutcomes = unmetOutcomes;
	var priorityHeader = "<th class='gwf-pri-cell'>" + i18n.innov.GoalsWorkflowComponent.PRIORITY + "</th>";
	var goalsHeader = i18n.innov.GoalsWorkflowComponent.GOALS;
	var interHeader = component.getInterventionLabel();
	var typeHeader = component.getTypeLabel();
	var catHeader = component.getCategoryLabel();
	var statusHeader = component.getInterStatusLabel();
	var commentHeader = i18n.innov.GoalsWorkflowComponent.COMMENT;
	var startDateHeader = component.getStartLabel();
	var targetDateHeader = component.getTargetLabel();
	var unmetGoalHeader = component.getUnmetLabel();
	var metGoalHeader = component.getMetLabel();
	var futureGoalHeader = component.getFutureLabel();
	var curHeader = "<h3 style='font-weight:bold'>" + unmetGoalHeader + "</h3><table class='gwf-preview-table gwf-preview-table-unmet'>";
	var theadHtml = "<thead><tr><th class='gwf-check-all-width'><input type='checkbox' class='gwf-preview-checkbox-all'/></th>";
	var headerHtml = "";

	var intervention = null;
	var interventions = [];
	var catDisplay = "";
	var comment = "";
	var html = "";
	var priority = "";
	var typeDisplay = "";
	var goalClass = "gwf-goal-cell";
	var commentClass = "gwf-cmt-cell";
	var i = 0, il = 0, j = 0, jl = 0;

	headerHtml += "<th class='gwf-goal-cell'>" + goalsHeader + "</th>";

	headerHtml += "<th class='gwf-int-cell'><input type='checkbox' class='gwf-preview-int-checkbox' checked/>" + interHeader + "</th>";
	headerHtml += "<th class='gwf-typ-cell'><input type='checkbox' class='gwf-preview-type-checkbox' checked/>" + typeHeader + "</th>";
	headerHtml += "<th class='gwf-cat-cell'><input type='checkbox' class='gwf-preview-category-checkbox' checked/>" + catHeader + "</th>";
	headerHtml += "<th class='gwf-sta-cell'>" + statusHeader + "</th>";
	headerHtml += "<th class='gwf-start-date-cell'>" + startDateHeader + "</th>";
	headerHtml += "<th class='gwf-target-date-cell'>" + targetDateHeader + "</th>";

	headerHtml += "<th class='gwf-cmt-cell'>" + commentHeader + "</th>";

	headerHtml += "</tr></thead>";

	for (var m = 3; m--; ) {
		if (curOutcomes && curOutcomes.length > 0) {
			html += curHeader;
			html += theadHtml;
			if (m >= 2) {
				html += priorityHeader;
			}
			else {
				if (goalClass !== "gwf-goal-cell-2") {
					headerHtml = headerHtml.replace("gwf-goal-cell", "gwf-goal-cell-2").replace("gwf-cmt-cell", "gwf-cmt-cell2");
					goalClass = "gwf-goal-cell-2";
					commentClass = "gwf-cmt-cell-2";
				}
			}
			html += headerHtml;
			html += "<tbody>";
			for ( i = 0, il = curOutcomes.length; i < il; i++) {
				outcome = curOutcomes[i];

				html += "<tr><td class='gwf-check-all-width'><input type='checkbox' class='gwf-preview-checkbox' value='" + outcome.OUTCOMEACTID + "'/></td>";
				if (m >= 2) {
					html += "<td class='gwf-pri-cell'>";
					priority = outcome.PRIORITY;
					html += (priority === 99) ? " " : priority;
					html += "</td>";
				}

				html += "<td class='" + goalClass + "'>";
				html += outcome.SAVED_DESCRIPTION + "</td>";

				interventions = outcome.INTERVENTIONS;
				html += "<td class='gwf-int-cell'><ol>";

				for ( j = 0, jl = interventions.length; j < jl; j++) {
					intervention = interventions[j];
					html += "<li class='gwf-int-listcell'>";
					html += "<input type='checkbox' class='gwf-int-checkbox'";
					if (intervention.FLAG) {
						html += "> <span class='metInd' title='1'>(Met)&nbsp;</span><span class='int-text'>" + intervention.SAVED_DESCRIPTION + "</span>";
					}
					else {
						html += "> <span class='metInd' title='0'></span><span class='int-text'>" + intervention.SAVED_DESCRIPTION + "</span>";
					}
					html += "</li>";
				}

				html += "</td></ol>";

				typeDisplay = "";
				for ( j = 0, jl = outcome.TYPE.length; j < jl; j++) {
					typeDisplay += "<div>" + outcome.TYPE[j].DISPLAY + "</div>";
				}
				html += "<td class='gwf-typ-cell'>" + typeDisplay + "</td>";

				catDisplay = "";
				for ( j = 0, jl = outcome.CATEGORY.length; j < jl; j++) {
					catDisplay += "<div>" + outcome.CATEGORY[j].DISPLAY + "</div>";
				}
				html += "<td class='gwf-cat-cell'>" + catDisplay + "</td>";

				html += "<td class='gwf-sta-cell'>" + outcome.GOAL_STATUS.CURRENT_STATUS_DISPLAY + "</td>";
				html += "<td class='gwf-start-date-cell'>" + outcome.STARTDTTM + "</td>";
				html += "<td class='gwf-target-date-cell'>" + outcome.ENDDTTM + "</td>";

				comment = outcome.COMMENT;
				html += "<td class='" + commentClass + "'>";
				html += (comment) ? "<input type='checkbox' class='gwf-preview-cmt-checkbox'/>" : "";
				html += comment + "</td>";

				html += "</tr>";
			}
		}
		if (m === 2) {
			curOutcomes = metOutcomes;
			curHeader = "</tbody></table><h3 class='met-goal-header' style='font-weight:bold'>" + metGoalHeader + "</h3><table class='gwf-preview-table gwf-preview-table-met'>";
		}
		else {
			curOutcomes = futureOutcomes;
			curHeader = "</tbody></table><h3 class='future-goal-header' style='font-weight:bold'>" + futureGoalHeader + "</h3><table class='gwf-preview-table gwf-preview-table-future'>";
		}
	}
	html += "</tbody></tbale>";
	return html;
};

/**
 * Map the Goals Component object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "GOALS_WF" filter
 */
MP_Util.setObjectDefinitionMapping("GOALS_WF", GoalsWorkflowComponent);
