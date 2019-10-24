/**
 * Pregnancy History methods
 * @namespace CERN_PREG_HISTORY_CONSOLIDATED
 * @static
 * @global
 */
var CERN_PREG_HISTORY_CONSOLIDATED = function() {
	return {
		//logic to display the title for the sensitivity indicator.
		SensIndHover: function(img, divelmt) {
			img.onmouseenter = function() {
				divelmt.style.visibility = 'hidden';
			};

			img.onmouseout = function() {
				divelmt.style.visibility = 'visible';
			};
		},

		RenderComponent: function(component, recordData) {
			//Creating Markup for the Weight Column
			function createWeightClmn(childRecord) {
				jsColHTML = [];
				htmlString = "--";
				var wString = parseFloat(childRecord.INFANT_WT);

				if (wString > 0) {
					htmlString = (childRecord.INFANT_WT !== "") ? (wString + "<span class='unit'>" + pregHistI18N.GRAMS + "</span>") : "";

				}
				jsPregHTML.push("<td class='chx-columns chx-wgt'>", htmlString, "</td>");
				return jsColHTML.join("");
			}

			//Creating Markup for the Gender Column
			function createGenderClmn(childRecord) {
				jsColHTML = [];
				htmlString = "&nbsp;";
				if (childRecord.CHILD_GENDER) {
					eventObj = MP_Util.GetValueFromArray(childRecord.CHILD_GENDER, codeArray);
					htmlString = eventObj.display;
				}
				else {
					htmlString = "--";

				}
				jsColHTML.push("<td class='chx-columns'>", htmlString, "</td>");
				return jsColHTML.join("");
			}

			//Creating Markup for the Neonate Outcome Column
			function createNeonateClmn(childRecord) {
				jsColHTML = [];
				htmlString = "&nbsp;";

				if (childRecord.NEONATE_OUTCOME > 0) {
					eventObj = MP_Util.GetValueFromArray(childRecord.NEONATE_OUTCOME, codeArray);
					htmlString = eventObj.display;

				}
				jsColHTML.push("<td class='chx-columns'>", htmlString, "</td>");
				return jsColHTML.join("");
			}

			//Creating Markup for the Length Of Labor Column
			function createLengthOfLaborClmn(childRecord) {
				var lengthOfLabor = childRecord.LENGTH_LABOR;
				var htmlString = "";
				var hr = 0;
				var mins = 0;
				jsColHTML = [];
				htmlString = "";
				if (lengthOfLabor.indexOf('h') !== -1) {
					hr = lengthOfLabor.substring(0, lengthOfLabor.indexOf('h'));

				}
				if (lengthOfLabor.indexOf('m') !== -1) {
					if (lengthOfLabor.indexOf('h') !== -1) {
						mins = lengthOfLabor.substring(lengthOfLabor.indexOf('h') + 3, lengthOfLabor.indexOf('m'));
					}
					else {
						mins = lengthOfLabor.substring(0, lengthOfLabor.indexOf('m'));
					}
				}

				if (hr === 0 && mins === 0) {

					if (childRecord.LENGTH_LABOR <= 0) {
						htmlString = "--";
					}
					else {
						htmlString = childRecord.LENGTH_LABOR;
					}

				}
				else {
					htmlString = "<span>" + hr + "<span class='unit'>" + pregHistI18N.HOURS + "</span>&nbsp;" + mins + "<span class='unit'>" + pregHistI18N.MINUTES + "</span></span>";
				}

				jsColHTML.push("<td class='chx-columns'>", htmlString, "</td>");
				return jsColHTML.join("");

			}

			//Creating Markup for the Pregnancy Outcome Column
			function createPregOutcomeClmn(childRecord) {
				jsColHTML = [];
				htmlString = "";
				var eventObj = "";
				if (childRecord.PREG_OUTCOME > 0) {
					eventObj = MP_Util.GetValueFromArray(childRecord.PREG_OUTCOME, codeArray);
					htmlString = eventObj.display;

				}

				jsColHTML.push("<td class='chx-columns chx-outcome'><p class='chx-outcome-txt'>", htmlString, "</p></td>");
				return jsColHTML.join("");
			}

			//Creating Markup for the GestationAge Column
			function createGestationAgeClmn(childRecord) {
				jsColHTML = [];
				htmlString = "";
				var gesPrd = childRecord.GEST_AT_BIRTH;
				var weeks = 0;
				var days = 0;
				if (gesPrd.indexOf("w") !== -1) {
					weeks = gesPrd.substring(0, gesPrd.indexOf('w'));
				}
				if (gesPrd.indexOf('d') != -1) {
					if (gesPrd.indexOf("w") !== -1) {
						days = gesPrd.substring(gesPrd.indexOf('w') + 3, gesPrd.indexOf('d'));
					}
					else {
						days = gesPrd.substring(0, gesPrd.indexOf('d'));
					}

				}

				if (weeks === "" && days === "") {

					if (childRecord.GEST_AT_BIRTH <= 0) {
						htmlString = "--";
					}
					else {
						htmlString = childRecord.GEST_AT_BIRTH;
					}
				}
				else {
					htmlString = "<span>" + weeks + "<span class='unit'>" + pregHistI18N.WEEKS + "</span>&nbsp;" + days + "<span class='unit'>" + pregHistI18N.DAYS + "</span></span>";
				}
				jsColHTML.push("<td class='chx-columns'>", htmlString, "</td>");
				return jsColHTML.join("");

			}


			//Creating Markup for the Pregnancy Column
			function createPregnancyClmn(childRecord) {
				jsColHTML = [];
				htmlString = "";
				//Displaying the Delivery Date
				var dateTime = new Date();

				//Logic to be applied if the date is returned in mm/dd/yyyy format.
				if (childRecord.DLV_DATE_PRECISION_FLG === 0) {

					dateTime.setISO8601(childRecord.DLV_DATE);
					htmlString = dateTime.format("shortDate3");
				}
				else {
					htmlString = childRecord.DLV_DATE;
				}
				jsColHTML.push("<td class='chx-columns'>", htmlString, "</td>");
				return jsColHTML.join("");

			}

			//Creating Markup for the Baby Column
			function createBabyClmn(childRecord, childCnt) {
				jsColHTML = [];
				htmlString = "";
				jsColHTML.push("<td class='chx-columns'>", babyNames[childCnt], "</td>");
				return jsColHTML.join("");
			}

			//declaring the variables.
			var pregHistI18N = i18n.discernabu.consolidated_history;
			var jsPregHTML = [];
			var buildSec = [];
			var pregHTML = "";
			var childRecord = "";
			var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
			var len = recordData.PREG_CNT;
			var compID = component.getComponentId();
			var htmlString = "";
			var i = 0;
			var childObjArr = [];
			var jsColHTML = [];
			var pregSpan = "";
			var pregNum = "";
			var babyNames = [pregHistI18N.BABY_A, pregHistI18N.BABY_B, pregHistI18N.BABY_C, pregHistI18N.BABY_D, pregHistI18N.BABY_E, pregHistI18N.BABY_F, pregHistI18N.BABY_G, pregHistI18N.BABY_H, pregHistI18N.BABY_I, pregHistI18N.BABY_J, pregHistI18N.BABY_K, pregHistI18N.BABY_L, pregHistI18N.BABY_M, pregHistI18N.BABY_N, pregHistI18N.BABY_O];


			//Creating the header row for the Pregnancy History Table (css was chx-info-hdrwrap)
			jsPregHTML.push("<div class = 'content-hdr'><div id='chxHdrRow", compID, "' class='chx-info-hdr hdr'><table class ='chx-table'><tr>");
			jsPregHTML.push("<th class='chx-sens-hdr'>&nbsp;</th>");
			jsPregHTML.push("<th class='chx-hdr'>", pregHistI18N.PREGNANCY, "</th>");
			jsPregHTML.push("<th class='chx-hdr'>", pregHistI18N.DELIVERYDATE, "</th>");
			jsPregHTML.push("<th class='chx-hdr'>", pregHistI18N.BABY, "</th>");
			jsPregHTML.push("<th class='chx-hdr'>", pregHistI18N.GESTATIONAL_AGE, "</th>");
			jsPregHTML.push("<th class='chx-hdr chx-outcome'>", pregHistI18N.PREG_OUTCOME, "</th>");
			jsPregHTML.push("<th class='chx-hdr'>", pregHistI18N.DURATION_OF_LABOR, "</th>");
			jsPregHTML.push("<th class='chx-hdr'>", pregHistI18N.NEONATE_OUTCOME, "</th>");
			jsPregHTML.push("<th class='chx-hdr'>", pregHistI18N.GENDER, "</th>");
			jsPregHTML.push("<th class='chx-hdr chx-wgt'>", pregHistI18N.WEIGHT, "</th>");
			jsPregHTML.push("</tr></table></div></div>");
			jsPregHTML.push("<div class ='content-body'>");

			//getting PREG_CNT value and looping
			for (i = 0; i <= len - 1; i++) {
				pregNum = i + 1;
				var pregRecord = recordData.PREG[i];
				var childCnt = pregRecord.CHILD_CNT;
				var zebraStriping = (i % 2 === 0) ? "odd" : "even";
				var trPregtabid = 'chx' + compID + 'table' + i;
				var cName = "";
				//Defining child object to store the child's information(used to display in the hover)
				var childObj = {
					divPregid: 'chx' + compID + 'div' + i,
					pregPic: "chx" + compID + "pregPic" + i,
					dlvHosp: "",
					fatherName: "",
					childHvr: ""
				};
				//display sensitive pregnancy indicator flag
				if (pregRecord.BSENSITIVITYIND === 1) {
					pregSpan = "<span id='" + childObj.pregPic + "' class='chx-pic' title='" + pregHistI18N.SENSITIVE + "'></span>";
				}
				else {

					pregSpan = "<span class='chx-result'>&nbsp;</span>";
				}
				jsPregHTML.push("<div id = '", trPregtabid, "' class='", zebraStriping, "'><table  class='chx-table'>");

				//Getting the child count and looping
				for (var j = 0; j < childCnt; j++) {

					if (j) {
						pregSpan = "&nbsp;";
						pregNum = "&nbsp;";
					}
					jsPregHTML.push("<tr><td class='chx-sens-hdr'>", pregSpan, "</td><td class='chx-columns'>", pregNum, "</td>");
					childRecord = pregRecord.CHILD[j];
					cName = (childRecord.CHILD_NAME !== "" ) ? childRecord.CHILD_NAME : "--";
					childObj.dlvHosp = (childRecord.DLV_HOSP !== "") ? (childRecord.DLV_HOSP) : "--";
					childObj.fatherName = (childRecord.FATHER_NAME !== "") ? (childRecord.FATHER_NAME) : "--";
					childObj.childHvr += "(" + babyNames[j] + "):&nbsp;" + cName + "<br />";

					//Creating Individual columns for each row
					jsPregHTML.push(createPregnancyClmn(childRecord));
					jsPregHTML.push(createBabyClmn(childRecord, j));
					jsPregHTML.push(createGestationAgeClmn(childRecord));
					jsPregHTML.push(createPregOutcomeClmn(childRecord));
					jsPregHTML.push(createLengthOfLaborClmn(childRecord));
					jsPregHTML.push(createNeonateClmn(childRecord));
					jsPregHTML.push(createGenderClmn(childRecord));
					jsPregHTML.push(createWeightClmn(childRecord));

					jsPregHTML.push("</tr>");
				}

				jsPregHTML.push("</table></div>");
				childObjArr[i] = childObj;
			}

			jsPregHTML.push("</div>");

			//Creating the hover markup
			for (i = len - 1; i >= 0; i--) {
				var childName;
				if (recordData.PREG[i].CHILD_CNT == 1) {
					childName = recordData.PREG[i].CHILD[0].CHILD_NAME !== "" ? recordData.PREG[i].CHILD[0].CHILD_NAME : "--";
				}
				else {
					childName = childObjArr[i].childHvr;
				}
				jsPregHTML.push("<div id='", childObjArr[i].divPregid, "' class='result-details hover'><h4 class='det-hd'><span>", i18n.PREGNANCY_DETAILS, "</span></h4><dl class='chx-det'><dt><span>", pregHistI18N.DELIVERY_HOSPITAL, ":</span></dt><dd><span>", childObjArr[i].dlvHosp, "</span></dd><dt><span>", pregHistI18N.FATHER_NAME, ":</span></dt><dd><span>", childObjArr[i].fatherName, "</span></dd><dt><span>", pregHistI18N.CHILD_NAME, ":</span></dt><dd><span>", childName, "</span></dd></dl></div>");
			}
			pregHTML = jsPregHTML.join("");
			//load tab data with a call back function, which initializes the pregnancy specific hovers
			component.loadTabData(len, pregHTML, component.HistoryComponentIndexObj.PREGNANCY_HISTORY, function() {
				//setting up hover for each pregnancy record.
				for (i = 0; i < len; i++) {
					var hvrElmnt = document.getElementById('chx' + component.getComponentId() + 'table' + i);
					var hvrDetail = document.getElementById('chx' + component.getComponentId() + 'div' + i);
					hs(hvrElmnt, hvrDetail, component);
				}
				var picId = null;
				var hsdiv = null;
				//Logic to display the title text for the sensitivity indicator.
				for (i = 0; i < len; i++) {
					if (recordData.PREG[i].BSENSITIVITYIND == 1) {
						picId = document.getElementById("chx" + component.getComponentId() + "pregPic" + i);
						hsdiv = document.getElementById("chx" + component.getComponentId() + "div" + i);
						CERN_PREG_HISTORY_CONSOLIDATED.SensIndHover(picId, hsdiv);
					}
				}
			});
		}
	};

}();
