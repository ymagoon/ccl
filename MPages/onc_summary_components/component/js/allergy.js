/**
 * Create the allergy component style object
 * @constructor
 */
function AllergyComponentStyle() {
	this.initByNamespace("al");
}

AllergyComponentStyle.inherits(ComponentStyle);

/**
 * The Allergy component will retrieve all allergies associated to the patient
 *
 * @constructor
 * @param {Criterion} criterion
 */
function AllergyComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new AllergyComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.ALLERGY.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.ALLERGY.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(1);

	AllergyComponent.method("InsertData", function() {
		CERN_ALLERGY_O1.GetAllergyTable(this);
	});
	AllergyComponent.method("HandleSuccess", function(recordData) {
		CERN_ALLERGY_O1.RenderComponent(this, recordData);
	});
	AllergyComponent.method("openTab", function() {
		var criterion = this.getCriterion();
		var sParms = '/PERSONID=' + criterion.person_id + ' /ENCNTRID=' + criterion.encntr_id + ' /FIRSTTAB=^' + this.getLink() + '+^';
		APPLINK(0, criterion.executable, sParms);
		this.InsertData();
	});
}

AllergyComponent.inherits(MPageComponent);

/**
 * The allergy namespace <CODE>CERN_ALLERGY_O1</code> is utilized for retrieving and rendering
 * the allergy information for a specific patient
 */
var CERN_ALLERGY_O1 = function() {
	return {
		/**
		 * The retrieval entry point for getting allergy information.
		 */
		GetAllergyTable : function(component) {
			var sendAr = [];
			var criterion = component.getCriterion();
			sendAr.push("^MINE^", criterion.person_id + ".0", "0.0", 0, criterion.provider_id + ".0", criterion.ppr_cd + ".0");

			MP_Core.XMLCclRequestWrapper(component, "MP_GET_ALLERGIES", sendAr, true);
		},
		RenderComponent : function(component, recordData) {

			var countText = "";
			try {
				var jsAlHTML = [];
				var alHTML = "";
				var j, reactionsLength = 0;
				var severityCodeObj, jsSeverity, jsSeverityDisp = "", statusCodeObj, reactionCodeObj, infoSourceObj;
				var onsetPrecision = "";
				var dateTime = new Date();
				var onsetDate = "--";
				var datetimeFlag = 0;
				var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
				var personnelArray = MP_Util.LoadPersonelListJSON(recordData.PRSNL);
				jsAlHTML.push("<div class='", MP_Util.GetContentClass(component, recordData.ALLERGY.length), "'>");
				var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
				var allergyArray = recordData.ALLERGY;
				var reactionCodeDisp = "--";
				var infoSourceDisp = "--";

				for (var i = 0, il = allergyArray.length; i < il; i++) {
					jsSeverityDisp = "--"; 
					reactionCodeDisp = "--";
					infoSourceDisp = "--";
					reactionsLength = recordData.ALLERGY[i].REACTIONS.length;

					if (recordData.ALLERGY[i].ONSET_DT_TM && recordData.ALLERGY[i].ONSET_DT_TM !== "") {
						onsetDate = recordData.ALLERGY[i].ONSET_DT_TM;
						dateTime.setISO8601(onsetDate);
					}
					onsetPrecision = (recordData.ALLERGY[i].ONSET_PRECISION_CD ) ? MP_Util.GetValueFromArray(recordData.ALLERGY[i].ONSET_PRECISION_CD, codeArray).display : "--";
					datetimeFlag = recordData.ALLERGY[i].ONSETDATE_FLAG;

					switch (datetimeFlag) {
						case 20:
						case 30:
							onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_4YEAR);
							break;
						case 40:
							onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_MONTH_4YEAR_NO_DATE);
							break;
						case 50:
							onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_4YEAR);
							break;
						case 0:
							onsetDate = "";
							break;
						default:
							onsetDate = df.format(dateTime, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
							break;
					}
					if (recordData.ALLERGY[i].STATUS_CD) {
						statusCodeObj = MP_Util.GetValueFromArray(recordData.ALLERGY[i].STATUS_CD, codeArray);
					}

					if (recordData.ALLERGY[i].SEVERITY_CD) {
						severityCodeObj = MP_Util.GetValueFromArray(recordData.ALLERGY[i].SEVERITY_CD, codeArray);
						jsSeverity = severityCodeObj.meaning;
						jsSeverityDisp = severityCodeObj.display;
					}
					if (recordData.ALLERGY[i].REACTION_CLASS_CD) {
						reactionCodeObj = MP_Util.GetValueFromArray(recordData.ALLERGY[i].REACTION_CLASS_CD, codeArray);
						reactionCodeDisp = reactionCodeObj.display;
					}

					if (recordData.ALLERGY[i].SOURCE_OF_INFO_CD) {
						infoSourceObj = MP_Util.GetValueFromArray(recordData.ALLERGY[i].SOURCE_OF_INFO_CD, codeArray);
						infoSourceDisp = infoSourceObj.display;
					}

					var reactionHTML = (reactionsLength) ? [] : ["--"];
					for ( j = 0; j < reactionsLength; j++) {
						if (j > 0) {
							reactionHTML.push(", ");
						}
						reactionHTML.push(recordData.ALLERGY[i].REACTIONS[j].REACTION_NAME);
					}
					var reactionText = reactionHTML.join("");

					jsSeverity = (jsSeverity == "SEVERE" || jsSeverityDisp.toUpperCase() == "ANAPHYLLAXIS") ? "res-severe" : "res-normal";

					jsAlHTML.push("<h3 class='info-hd'><span class='", jsSeverity, "'>", recordData.ALLERGY[i].NAME, "</span></h3><dl class='al-info result-info'><dt><span>" + i18n.ALLERGY + ":</span></dt><dd class='al-name'><span class='", jsSeverity, "'>", recordData.ALLERGY[i].NAME, "</span></dd><dt><span>" + i18n.REACTION + ":</span></dt><dd class='al-reac'><span class='", jsSeverity, "'>");

					jsAlHTML.push(reactionText);

					jsAlHTML.push("</span></dd></dl><div class='result-details hvr'><dl class='al-det'><dt><span>" + i18n.ALLERGY_NAME + ":</span></dt><dd class='al-det-name'><span class='", jsSeverity, "'>", recordData.ALLERGY[i].NAME, "</span></dd><dt><span>" + i18n.REACTION + ":</span></dt><dd class='al-det-reac'><span class='", jsSeverity, "'>");

					jsAlHTML.push(reactionText);

					jsAlHTML.push("</span></dd>", "<dt><span>", i18n.SEVERITY, ":</span></dt><dd class='al-det-sev'><span class='", jsSeverity, "'>", jsSeverityDisp, "</span></dd>", "<dt><span>" + i18n.REACTION_TYPE + ":</span></dt><dd class='al-det-sev'><span>" + reactionCodeDisp + "</span></dd>", "<dt><span>" + i18n.SOURCE + ":</span></dt><dd class='al-det-sev'><span>" + infoSourceDisp + "</span></dd>", "<dt><span>", i18n.STATUS, ":</span></dt><dd class='al-det-status'><span>", statusCodeObj.display, "</span></dd>", "<dt><span>", i18n.ONSET_DATE, ":</span></dt><dd class='al-det-dt'><span>");

					if (onsetPrecision && onsetPrecision !== "") {
						jsAlHTML.push(onsetPrecision, "&nbsp;", onsetDate);
					}
					else {
						jsAlHTML.push(onsetDate);
					}
					var comments = (MP_Util.Doc.GetComments(recordData.ALLERGY[i], personnelArray) !== "") ? MP_Util.Doc.GetComments(recordData.ALLERGY[i], personnelArray) : "--";
					jsAlHTML.push("</span></dd><dt><span>", i18n.COMMENTS, ":</span></dt><dd class='al-det-comment'><span>", comments, "</span></dd></dl></div>");
				}
				jsAlHTML.push("</div>");
				alHTML = jsAlHTML.join("");
				countText = MP_Util.CreateTitleText(component, recordData.ALLERGY.length);
				component.finalizeComponent(alHTML, countText);
			}
			catch (err) {
				var errMsg = [];
				errMsg.push("<b>", i18n.JS_ERROR, "</b><br><ul><li>", i18n.MESSAGE, ": ", err.message, "</li><li>", i18n.NAME, ": ", err.name, "</li><li>", i18n.NUMBER, ": ", (err.number & 0xFFFF), "</li><li>", i18n.DESCRIPTION, ": ", err.description, "</li></ul>");
				component.finalizeComponent(MP_Util.HandleErrorResponse(component.getStyles().getNameSpace(), errMsg.join("")), countText);

				throw (err);
			}
			finally {
				//do nothing
			}
		}

	};
}();
