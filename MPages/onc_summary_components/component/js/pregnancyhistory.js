function PregnancyHistoryComponentStyle() {
	this.initByNamespace("preg");
}

PregnancyHistoryComponentStyle.inherits(ComponentStyle);

function PregnancyHistoryComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new PregnancyHistoryComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.PREGNANCY_HISTORY.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.PREGNANCY_HISTORY.O1 - render component");
	this.setIncludeLineNumber(true);

	PregnancyHistoryComponent.method("InsertData", function() {
		CERN_PREG_HISTORY_O1.GetPregTable(this);
	});
	PregnancyHistoryComponent.method("HandleSuccess", function(recordData) {
		CERN_PREG_HISTORY_O1.RenderComponent(this, recordData);
	});
}

PregnancyHistoryComponent.inherits(MPageComponent);

/**
 * Pregnancy History methods
 * @namespace CERN_PREG_HISTORY_O1
 * @static
 * @global
 */
var CERN_PREG_HISTORY_O1 = function() {
	return {
		GetPregTable : function(component) {
			var sendAr = [];
			var criterion = component.getCriterion();
			var messageHTML = "";
			var phi18n = i18n.discernabu.pregnancyhistory_o1;
	
			//Check to make sure the patient is a female
			if(!(criterion.getPatientInfo().getSex())||criterion.getPatientInfo().getSex().meaning !== "FEMALE") {
				//Male patient so just show a disclaimer
				messageHTML = "<h3 class='info-hd'><span class='res-normal'>" + phi18n.NOT_FEMALE + "</span></h3><span class='res-none'>" + phi18n.NOT_FEMALE + "</span>";
				MP_Util.Doc.FinalizeComponent(messageHTML, component, "(0)");
				return;
			}
			else {
				sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0");
				MP_Core.XMLCclRequestWrapper(component, "mp_get_pregnancy_history", sendAr, true);
			}
		},
		RenderComponent : function(component, recordData) {

			try {
				var jsPREGHTML = [];
				var buildSec = [];
				var pregHTML = "";
				var childRecord = "";
				var childDetl = "";
				var eventObj = "";
				var sec = "";
				var laborLength="";
				//getting PREG_CNT value and looping
				var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				var len = recordData.PREG_CNT;
				jsPREGHTML.push("<div class ='", MP_Util.GetContentClass(component, len), "'>");
				for(var i = 0; i < len; i++) {
					pregNum = i + 1;
					//getting CHILD_CNT value and looping
					var pregRecord = recordData.PREG[i];
					var childCnt = pregRecord.CHILD_CNT;
					var tableBody = [];
					var pregSpan = "";
					for(var j = 0; j < childCnt; j++) {
						num = j + 1;
						childRecord = pregRecord.CHILD[j];
						childDetl = getDeliveryDatePrecision(childRecord);
						if(childRecord.LENGTH_LABOR!=='-1'){
							laborLength=childRecord.LENGTH_LABOR;
						}
						if(childRecord.NEONATE_OUTCOME > 0) {
							eventObj = MP_Util.GetValueFromArray(childRecord.NEONATE_OUTCOME, codeArray);
							childDetl += ", " + eventObj.display;
						}
						if(childRecord.PREG_OUTCOME > 0) {
							eventObj = MP_Util.GetValueFromArray(childRecord.PREG_OUTCOME, codeArray);
							childDetl += ", " + eventObj.display;
						}
						if(childRecord.CHILD_GENDER) {
							eventObj = MP_Util.GetValueFromArray(childRecord.CHILD_GENDER, codeArray);
							childDetl += ", " + eventObj.display;
						}
						if(childRecord.INFANT_WT != "") {
							childDetl += ", " + childRecord.INFANT_WT;
						}
						if(childRecord.GEST_AT_BIRTH) {
							childDetl += ", " + childRecord.GEST_AT_BIRTH;
						}
						//display sensitive pregnancy indicator flag

						tableBody.push(" <dl class='preg-info'><dt>", i18n.PREGNANCY, "</dt><dd class='preg-baby'><span>", i18n.BABY, num, ":</span><span class='preg-stat detail-line'>", childDetl, "</span></dd></dl><h4><span class='det-hd'>", i18n.PREGNANCY_DETAILS, "</span></h4><div class='hvr'><dl class='preg-det'><dt><span>", i18n.LENGTH_OF_LABOR, ":</span></dt><dd><span>", laborLength , "</span></dd><dt><span>", i18n.DELIVERY_HOSPITAL, ":</span></dt><dd><span>", childRecord.DLV_HOSP, "</span></dd><dt><span>", i18n.CHILD_NAME, ":</span></dt><dd><span>", childRecord.CHILD_NAME, "</span></dd><dt><span>", i18n.FATHER_NAME, ":</span></dt><dd><span>", childRecord.FATHER_NAME, "</span></dd></dl></div>");
					}
					var sensitivity = pregRecord.BSENSITIVITYIND;
					if(sensitivity == 1) {
						pregSpan = "preg-pic";
					}
					else {
						pregSpan = "preg-result";
					}
					buildSec.push(" <div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", i18n.HIDE_SECTION, "'>-</span><span class='", pregSpan, "'></span><span class='sub-sec-title'>", i18n.PREGNANCY, " #", pregNum, "</span></h3><div class='sub-sec-content'>", tableBody.join(""), "</div> </div>");
				}
				jsPREGHTML.push(buildSec.join(""), "</div>");
				pregHTML = jsPREGHTML.join("");
				countText = MP_Util.CreateTitleText(component, len);
				MP_Util.Doc.FinalizeComponent(pregHTML, component, countText);
			}
			catch (err) {

				throw (err);
			}
			finally {
				//do nothing
			}
		}
	};

	function getDeliveryDatePrecision(childRecord) {
		var dlvDT = "";
		var flag = childRecord.DLV_DATE_PRECISION_FLG;
		if(flag == 0) {
			var dateTime = new Date();
			dateTime.setISO8601(childRecord.DLV_DATE);
			dlvDT = dateTime.format("shortDate3");
		}
		else {
			dlvDT = childRecord.DLV_DATE;
		}
		return dlvDT;
	}

}();
