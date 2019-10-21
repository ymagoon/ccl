//initialize namespace
function ScalesAssessComponentWFStyle() {
	this.initByNamespace("wf-sa");
}
//inherit component style.
ScalesAssessComponentWFStyle.prototype = new ComponentStyle();
/**
 * The scales and assessment component retrieves assessments for face-up results for display
 * and allow user to click on result to launch the powerform that was used to chart it.
 * @param {{}} criterion - The criterion containing the requested information
 * @class
 */
function ScalesAssessComponentWF(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new ScalesAssessComponentWFStyle());
	this.setComponentLoadTimerName("USR:MPG.SCALEASSESS.WF - load component");
	this.setComponentRenderTimerName("ENG:MPG.SCALEASSESS.WF - render component");
	this.setIncludeLineNumber(false);
	this.m_iViewAdd = false;
	this.bandName = "";
	this.sectionName = "";
	this.itemName = "";
	this.scrollvar = 0;
	this.powerformIds = [];
}

ScalesAssessComponentWF.prototype = new MPageComponent();
ScalesAssessComponentWF.prototype.constructor = MPageComponent;
MP_Util.setObjectDefinitionMapping("WF_SA", ScalesAssessComponentWF);

/**
 * This is the ScalesAssessComponentWF implementation of the openTab function.
 * It launches the selected powerform.
 * @returns {undefined}
 */
ScalesAssessComponentWF.prototype.openTab = function () {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|0|0|0";
	logger.logMPagesEventInfo(this, "POWERFORM", paramString, "scales-assess.js", "openTab");
	MPAGES_EVENT("POWERFORM", paramString);
	CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "ScalesAssess");
};

/**
 * This is the ScalesAssessComponentWF implementation of the openDropDown function.
 * It displays the powerforms that were mapped from bedrock.
 * @param {Number} formID
 * 			identication of the type of powerform.
 */
ScalesAssessComponentWF.prototype.openDropDown = function (formID) {
	var criterion = this.getCriterion();
	var paramString = criterion.person_id + "|" + criterion.encntr_id + "|" + formID + "|0|0";
	logger.logMPagesEventInfo(this, "POWERFORM", paramString, "scales-assess.js", "openDropDown");
	MPAGES_EVENT("POWERFORM", paramString);
	CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "ScalesAssess");
};

/**
 * Scales and Assessment component can display specific powerforms originally
 * mapped out in bedrock and display new instance for each when clicked
 * from the sorted list.
 * @param compFilter
 *             The name of the bedrock filter for powerforms
 *             containing the requested information
 * @class
 */
ScalesAssessComponentWF.prototype.loadPowerFormOptions = function (compFilter) {
	var menuItem = null;
	var pfArr = null;
	var pfCnt = 0;
	var powerForm = null;
	var x = 0;
	pfArr = this.getFilterValues(compFilter);
	pfArr.sort(function(a, b)
	{
		return a.m_description > b.m_description ? 1 : -1;
	});
	pfCnt = pfArr.length;
	for(x = 0; x < pfCnt; x++)
	{
		powerForm = pfArr[x];
		var powerForm_id = powerForm.getId();
		menuItem = new MP_Core.MenuItem();
		menuItem.setName(powerForm.getName());
		menuItem.setDescription(powerForm.getDescription());
		menuItem.setId(powerForm_id);
		this.powerformIds.push(powerForm_id);
		this.addMenuItem(menuItem);
	}
};

/**
 * The addAssessmentRows function builds the HTML markup for the results of each vital group.
 *
 * @param recordData
 *            recordData has the information about the vitals groups.
 * @param tgArray tgArray will be filled out with the appropriate "default" no results markup.
 *
 */
ScalesAssessComponentWF.prototype.addAssessmentRows = function (recordData, tgArray) {
	var resultGroup = recordData.RG;
	var rgLength = resultGroup.length;
	var minMaxData = recordData.MIN_MAX_48HR_TEMP;
	var x = 0;
	var y = 0;
	var z = 0;
	var criticalFlag = 0;
	var prevSeq = 0;
	var curSeq = 0;
	var resultCnt = 0;
	var groupName = "";
	var namespace = this.getStyles().getNameSpace();
	var scales_assessI18N = i18n.discernabu.scales_assess_o2;
	var labelHTML = [];
	var compId = this.getComponentId();
	var tblBdyId = "body_scales_assess" + compId;
	var frstColId = "firstColumn_scales_assess" + compId;
	var inProgressColId = "in_progress_scales_assess" + compId;
	var blnkDivId = "blank-div-left" + compId;
	var tblHdrId = "header_scales_assess" + compId;
	var rgArray = [];
	var resultHTML = [];
	var pfGroup = recordData.IN_PROGRESS_PF;
	var pfCount = 0;
	var pfLength = pfGroup.length;
	var criterion = this.getCriterion();
	var personId = criterion.person_id;
	var encntrId = criterion.encntr_id + ".0";
	var providerId = criterion.provider_id + ".0";
	var totalResultsHTML = [];
	var hover;
	var rgArrayStr = "";
	var tdResultClass = "";
	//create the left one-column table
	labelHTML.push("<div id='", frstColId, "' class='wf-sa-floatLeftdownDiv'><table class='wf-sa-table'>");
	for (x = 0; x < rgLength; x++)
	{
		//in this table display the names of the assessments as mapped out in bedrock
		var normalcyClass = "";
		rgArray = [];
		rgArray = tgArray.slice();
		groupName = resultGroup[x].GROUP_NAME;
		labelHTML.push("<tr  class='", ((x % 2) === 0) ? "odd" : "even", "'><td class='wf-sa-data wf-sa-word-fix'><span class='wf-sa-rowlabelCol'>", resultGroup[x].GROUP_NAME, "</span></td>");
		var measureGroup = resultGroup[x].MEASUREMENTS;
		var measureLength = measureGroup.length;
		prevSeq = 0;
		resultCnt = 0;
		//if assessment results exist...create a row with html markup to display them and allow the user to launch the assessment that was used to
		//to chart the result by clicking on the result itself.
		for (y = 0; y < measureLength; y++)
		{
			var activityId;
			var eventArr = [];
			if (criticalFlag === 0)
			{
				var normalcy = (measureGroup[y].NORMALCY !== "") ? measureGroup[y].NORMALCY : " ";
				if ((normalcy.indexOf("CRITICAL") !== -1) || (normalcy.indexOf("EXTREMEHIGH") !== -1) || (normalcy.indexOf("PANICHIGH") !== -1) || (normalcy.indexOf("EXTREMELOW") !== -1) || (normalcy.indexOf("PANICLOW") !== -1) || (normalcy.indexOf("VABNORMAL") !== -1) || (normalcy.indexOf("POSITIVE") !== -1)) {
					CERN_EventListener.fireEvent(this, this, EventListener.EVENT_CRITICAL_UPDATE, {
						critical: true
					});
					criticalFlag = 1;
				}
			}//get the latest time group(TG)
			if (y === 0)
			{
				prevSeq = measureGroup[y].TG_SEQ;
			}

			if (prevSeq !== measureGroup[y].TG_SEQ)
			{
				resultHTML = [];
				hover = this.createAdditionalInfoHover(measureGroup, resultCnt, y, eventArr, groupName, minMaxData);
				//check if multiple scores exist in this TG if so create html to display multiple hover scores and launch powerform on latest score.
				if (resultCnt > 1)
				{	//if wf-sa-dayTimeSeparator exist from setting up the table & header earlier with createTableHeader function then keep it.
					rgArrayStr = rgArray[measureGroup[y - resultCnt].TG_SEQ - 1];
					if (rgArrayStr.indexOf("wf-sa-dayTimeSeparator") >= 0)
					{
						tdResultClass = "wf-sa-dayTimeSeparator";
					}
					else
					{
						tdResultClass = "wf-sa-timeSeparator";
					}
					normalcyClass = this.getNormalcy(measureGroup[y - resultCnt].NORMALCY);
					resultType = measureGroup[y - resultCnt].RES_TYPE;
					activityId = measureGroup[y - resultCnt].ACTIVITY_ID;
					resultHTML.push("<td class='", tdResultClass, "'><dl class='", namespace, "-info'><dt><span>", scales_assessI18N.VALUE, "</span></dt><dd ><div class = 'wf-sa-resVal'><span class='", normalcyClass, "'><span class='res-ind'></span><span >", this.createClickEvent(measureGroup[y - resultCnt].RESULT, personId, encntrId, activityId, resultType, eventArr), "</span>", this.getModifiedIcon(measureGroup[y - resultCnt].STATUS_MEAN), "</span>&nbsp;<span class = 'wf-sa-mulResults'>[<span><span class='wf-sa-mulResults'><span class='", this.getNormalcy(measureGroup[y - resultCnt + 1].NORMALCY), "'>", resultCnt, "</span>", "</span>]</span></span></dd></dl>", hover, "</div></td>");
					rgArray[measureGroup[y - resultCnt].TG_SEQ - 1] = resultHTML.join("");//add the tg html to an array
					resultCnt = 1;
				} //display single face up score and html to launch its assessment.
				else
				{
					resultHTML = [];
					//if wf-sa-dayTimeSeparator exist from setting up the table & header earlier with createTableHeader function then keep it.
					rgArrayStr = rgArray[measureGroup[y - 1].TG_SEQ - 1];
					if (rgArrayStr.indexOf("wf-sa-dayTimeSeparator") >= 0)
					{
						tdResultClass = "wf-sa-dayTimeSeparator";
					}
					else
					{
						tdResultClass = "wf-sa-timeSeparator";
					}
					resultType = measureGroup[y - 1].RES_TYPE;
					activityId = measureGroup[y - 1].ACTIVITY_ID;
					normalcyClass = this.getNormalcy(measureGroup[y - 1].NORMALCY);
					resultHTML.push("<td class='", tdResultClass, "'><dl class='", namespace, "-info'><dd ><div class = 'wf-sa-resVal'><span class='", normalcyClass, "'><span class='res-ind'></span><span >", this.createClickEvent(measureGroup[y - 1].RESULT, personId, encntrId, activityId, resultType, eventArr), "</span>", this.getModifiedIcon(measureGroup[y - 1].STATUS_MEAN), "</span></dd></dl>", hover, "</div></td>");
					rgArray[measureGroup[y - 1].TG_SEQ - 1] = resultHTML.join("");//add the tg html to an array
					resultCnt = 1;
				}//create html on oldest score on this assessment
				if (y === (measureLength - 1))
				{
					resultHTML = [];
					if (resultCnt > 1)
					{
						//if wf-sa-dayTimeSeparator exist from setting up the table & header earlier with createTableHeader function then keep it.
						rgArrayStr = rgArray[measureGroup[y - resultCnt].TG_SEQ - 1];
						if (rgArrayStr.indexOf("wf-sa-dayTimeSeparator") >= 0)
						{
							tdResultClass = "wf-sa-dayTimeSeparator";
						}
						else
						{
							tdResultClass = "wf-sa-timeSeparator";
						}
						hover = this.createAdditionalInfoHover(measureGroup, resultCnt, y, normalcyClass, eventArr, groupName, minMaxData);
						normalcyClass = this.getNormalcy(measureGroup[y - resultCnt].NORMALCY);
						resultType = measureGroup[y - resultCnt].RES_TYPE;
						activityId = measureGroup[y - resultCnt].ACTIVITY_ID;
						resultHTML.push("<td class='", tdResultClass, "'><dl class='", namespace, "-info'><dt><span>", scales_assessI18N.VALUE, "</span></dt><dd ><div class = 'wf-sa-resVal'><span class='", normalcyClass, "'><span class='res-ind'></span><span >", this.createClickEvent(measureGroup[y - resultCnt].RESULT, personId, encntrId, activityId, resultType, eventArr), "</span>", this.getModifiedIcon(measureGroup[y - resultCnt].STATUS_MEAN), "</span>&nbsp;<span class = 'wf-sa-mulResults'>[<span><span class='wf-sa-mulResults'><span class='", this.getNormalcy(measureGroup[y - resultCnt + 1].NORMALCY), "'>", resultCnt, "</span>", "</span>]</span></span></dd></dl>", hover, "</div></td>");
						rgArray[measureGroup[y].TG_SEQ - 1] = resultHTML.join("");//add the tg html to an array
					} //create html on  scores not last or first
					else
					{
						rgArrayStr = rgArray[measureGroup[y].TG_SEQ - 1];
						if (rgArrayStr.indexOf("wf-sa-dayTimeSeparator") >= 0)
						{
							tdResultClass = "wf-sa-dayTimeSeparator";
						}
						else
						{
							tdResultClass = "wf-sa-timeSeparator";
						}
						hover = this.createAdditionalInfoHover(measureGroup, 0, y, eventArr, groupName, minMaxData);
						normalcyClass = this.getNormalcy(measureGroup[y].NORMALCY);
						resultHTML = [];
						resultType = measureGroup[y].RES_TYPE;
						activityId = measureGroup[y].ACTIVITY_ID;
						resultHTML.push("<td class='", tdResultClass, "'><dl class='", namespace, "-info'><dd ><div class = 'wf-sa-resVal'><span class='", normalcyClass, "'><span class='res-ind'></span><span >", this.createClickEvent(measureGroup[y].RESULT, personId, encntrId, activityId, resultType, eventArr), "</span>", this.getModifiedIcon(measureGroup[y].STATUS_MEAN), "</span></dd></dl>", hover, "</div></td>");
						rgArray[measureGroup[y].TG_SEQ - 1] = resultHTML.join("");//add the tg html to an array
					}
				}
				else
				{
					prevSeq = measureGroup[y].TG_SEQ;
					resultCnt = 1;
				}
			}
			else
			{
				if (y === (measureLength - 1))
				{
					resultHTML = [];
					if (resultCnt >= 1)
					{
						rgArrayStr = rgArray[measureGroup[y - resultCnt].TG_SEQ - 1];
						if (rgArrayStr.indexOf("wf-sa-dayTimeSeparator") >= 0)
						{
							tdResultClass = "wf-sa-dayTimeSeparator";
						}
						else
						{
							tdResultClass = "wf-sa-timeSeparator";
						}
						hover = this.createAdditionalInfoHover(measureGroup, resultCnt + 1, y + 1, eventArr, groupName, minMaxData);
						normalcyClass = this.getNormalcy(measureGroup[y - resultCnt].NORMALCY);
						resultType = measureGroup[y - resultCnt].RES_TYPE;
						activityId = measureGroup[y - resultCnt].ACTIVITY_ID;
						resultHTML.push("<td class='", tdResultClass, "'><dl class='", namespace, "-info'><dt><span>", scales_assessI18N.VALUE, "</span></dt><dd ><div class = 'wf-sa-resVal'><span class='", normalcyClass, "'><span class='res-ind'></span><span >", this.createClickEvent(measureGroup[y - resultCnt].RESULT, personId, encntrId, activityId, resultType, eventArr), "</span>", this.getModifiedIcon(measureGroup[y - resultCnt].STATUS_MEAN), "</span>&nbsp;<span class = 'wf-sa-mulResults'>[<span><span class='wf-sa-mulResults'><span class='", this.getNormalcy(measureGroup[y - resultCnt + 1].NORMALCY), "'>", resultCnt + 1, "</span>", "</span>]</span></span></dd></dl>", hover, "</div></td>");
						rgArray[measureGroup[y].TG_SEQ - 1] = resultHTML.join("");//add the tg html to an array
					}
					else
					{
						rgArrayStr = rgArray[measureGroup[y].TG_SEQ - 1];
						if (rgArrayStr.indexOf("wf-sa-dayTimeSeparator") >= 0)
						{
							tdResultClass = "wf-sa-dayTimeSeparator";
						}
						else
						{
							tdResultClass = "wf-sa-timeSeparator";
						}
						hover = this.createAdditionalInfoHover(measureGroup, 0, y, eventArr, groupName, minMaxData);
						normalcyClass = this.getNormalcy(measureGroup[y].NORMALCY);
						resultHTML = [];
						resultType = measureGroup[y].RES_TYPE;
						activityId = measureGroup[y].ACTIVITY_ID;
						resultHTML.push("<td class='", tdResultClass, "'><dl class='", namespace, "-info'><dd ><div class = 'wf-sa-resVal'><span class='", normalcyClass, "'><span class='res-ind'></span><span >", this.createClickEvent(measureGroup[y].RESULT, personId, encntrId, activityId, resultType, eventArr), "</span>", this.getModifiedIcon(measureGroup[y].STATUS_MEAN), "</span></dd></dl>", hover, "</div></td>");
						rgArray[measureGroup[y].TG_SEQ - 1] = resultHTML.join("");//add the tg html to an array
					}
				}
				else
				{
					resultCnt++;
				}
			}
		}
		var classVar = "";
		if (x % 2 === 0) {
			classVar = "odd";//though it displays odd here, its desirable to start a row with white background if previous row/header is not of white background.
		} else {
			classVar = "even";
		}//add the tg html list to html row related to an assessment
		totalResultsHTML.push("<tr class='", classVar, "'>", rgArray.join(""), "</tr>");
	}//get total in progress assessments for assessments currently mapped in bedrock
	for(x = 0; x < pfLength; x++)
	{
		pfCount = pfCount + pfGroup[x].PF_ID_LIST_CNT;
	}//create sub head to display in progress if any exist as well display those assessment within wf-sa table or left table.
	labelHTML.push("</table></div><div id=", tblBdyId, " class='wf-sa-contentdwnCol' onScroll='ScalesAssessComponentWF.prototype.scrollWithHeader(", compId, ");'>");
	labelHTML.push("<table id='scales_assess_table", compId, "' class='wf-sa-rightdivtable'>", totalResultsHTML.join(""), "<tr>");
	labelHTML.push("</table></div></div></div></div>");
	for (x = 0; x < pfLength; x++)
	{
		pfCount = pfCount + pfGroup[x].PF_ID_LIST_CNT;
	}

	if (pfCount > 0) {
		labelHTML.push("<table><tr><td>&nbsp</td></tr></table>");
		var mainTableHeight = $("#" + inProgressColId).height();
		var inprogress_height = $(".wf-sa-row").height();
		var pfRowCount = 0;
		var pfRows = 0;
		var pfidList = [];
		labelHTML.push("<div id='", inProgressColId, "' class='wf-sa-floatLeftdownDiv'><table class='wf-sa-in-progress-table'>");
		labelHTML.push("<tr class='wf-sa-row'><td class='wf-sa-section-header-title'>", scales_assessI18N.IN_PROGRESS_ASSESSMENTS, "</td></tr>");
		for (z = 0; z < pfLength; z++)
		{
			groupName = pfGroup[z].POWERFORM_NAME;
			pfidList = pfGroup[z].PF_ID_LIST;
			pfRows = pfRows + pfidList;
			for (y = 0; y < pfidList.length; y++)
			{
				if(y === pfidList.length)
				{
					pfRowCount = pfRows;
				}
				else
				{
					pfRowCount = pfRowCount + 1;
				}
				labelHTML.push("<tr  class='", ((pfRowCount % 2) === 0) ? "even" : "odd", "'><td class='wf-sa-data wf-sa-word-fix'><span class='wf-sa-rowlabelCol'>");
				labelHTML.push("<a onclick='ScalesAssessComponentWF.prototype.launchPowerForm(", personId, ",", encntrId, ",", pfidList[y].POWERFORM_ID, ",", 0, ",", 1, ");' href='#'>", groupName, "</a></br>", pfidList[y].ACTIVITY_DTTM, "</span></span></td>");
			}
		}
	}
	labelHTML.push("</table></div>");
	return labelHTML.join("");
};

/**
 * The createAssessmentTableHeader function has the logic to create the HTML markup
 * for creating the columns for each day that has corresponding assessment
 * scores.
 * @param dtArray  dtArray has the information with all the timegroups for the lab results.
 * @param tgArray  tgArray will be filled out with the appropriate "default" no results markup. This will be used in the addAsssessmentRows function.
 * @param namespace namespace for this component.
 */
ScalesAssessComponentWF.prototype.createAssessmentTableHeader = function (dtArray, tgArray, namespace) {
	var curDate = new Date();
	var curDateValue = curDate.getDate();
	var curMonth = curDate.getMonth();
	var curYear = curDate.getFullYear();
	var thisDate = new Date();
	var nextDate = new Date();
	var dtArrayLength = dtArray.length;
	var x = 0;
	var dateHTML = [];
	var timeHTML = [];
	var scales_assessI18N = i18n.discernabu.scales_assess_o2;
	var dateClass = "";
	var dateDisp = "";
	var timeClass = "";
	var dateFlag = 0;
	for (x = 0; x < dtArrayLength; x++)
	{
		dateClass = "";
		dateDisp = "";
		timeClass = "";
		thisDate.setISO8601(dtArray[x].TIME_DISP);
		//set up table and header with blank results for now, later on it will be replaced with values and proper bordering in
		//in addAssessmentRows function
		if ((thisDate.getDate() === curDateValue) && (thisDate.getMonth() === curMonth) && (thisDate.getFullYear() === curYear)) {
			if ((x + 1) < dtArrayLength) {
				nextDate.setISO8601(dtArray[x + 1].TIME_DISP);
				if ((thisDate.getDate() === nextDate.getDate()) && (thisDate.getMonth() === nextDate.getMonth()) && (thisDate.getFullYear() === nextDate.getFullYear())) {
					dateClass = "wf-sa-timeSeparatorRow1";
					dateDisp = x === 0 ? scales_assessI18N.TODAY : "";
					timeClass = "wf-sa-timeSeparator";
				} else {
					dateClass = "wf-sa-dayTimeSeparator";
					dateDisp = x === 0 ? scales_assessI18N.TODAY : "";
					timeClass = "wf-sa-dayTimeSeparator";
				}
			} else {
				dateClass = "wf-sa-dayTimeSeparator";
				dateDisp = x === 0 ? scales_assessI18N.TODAY : "";
				timeClass = "wf-sa-dayTimeSeparator";
			}
		}
		else
		{
			if ((x + 1) < dtArrayLength) {
				nextDate.setISO8601(dtArray[x + 1].TIME_DISP);
				if ((thisDate.getDate() === nextDate.getDate()) && (thisDate.getMonth() === nextDate.getMonth()) && (thisDate.getFullYear() === nextDate.getFullYear())) {
					dateClass = "wf-sa-timeSeparatorRow1";
					if(dateFlag === 0)
					{
						dateDisp = thisDate.format("mediumDate");
						dateFlag = 1;
					}
					else
					{
						dateDisp = "";
					}
					timeClass = "wf-sa-timeSeparator";
				}
				else
				{
					dateClass = "wf-sa-dayTimeSeparator";
					dateDisp = dateFlag === 0 ? thisDate.format("mediumDate") : "";
					dateFlag = 0;
					timeClass = "wf-sa-dayTimeSeparator";
				}
			} else {
				dateClass = "wf-sa-dayTimeSeparator";
				dateDisp = dateFlag === 0 ? thisDate.format("mediumDate") : "";
				timeClass = "wf-sa-dayTimeSeparator";
			}
		}
		dateHTML.push("<td class='", dateClass, "'><span class = 'wf-sa-hdr'><div class='wf-sa-col-hdr-cell'>", dateDisp, "</div></span></td>");
		timeHTML.push("<th class='", timeClass, "'><span  class='wf-sa-hdr'><div class='wf-sa-col-hdr-cell'>", thisDate.format("militaryTime"), "</div></span></th>");
		var temp = [];
		temp.push("<td class='", timeClass, "'><dl class='", namespace, "-info'><dt>SCALESASSESS</dt><dd class='res-none'>--</dd></dl></td>");
		tgArray.push(temp.join(""));
	}
	dateHTML.push("</tr><tr>", timeHTML.join(""), "</tr></table></div></div></div>");
	return dateHTML.join("");
};

/**
 * This is the RenderComponent implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the
 * call to XMLCCLRequestWrapper.
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 */
ScalesAssessComponentWF.prototype.RenderComponent = function(reply) {
	var compId = this.getComponentId();
	var recordData = reply.getResponse();
	var timeGroup = recordData.TG;
	var df = MP_Util.GetDateFormatter();
	var countText = "";
	var saArray = [];
	var tgArray = [];
	var blnkDivId = "blank-div-left" + compId;
	var tblHdrId = "header_scales_assess" + compId;
	var frstColId = "firstColumn_scales_assess" + compId;
	var initHeight;
	var compNS = this.getStyles().getNameSpace();
	var scales_assessI18N = i18n.discernabu.scales_assess_o2;

	try
	{
		//Create the render timer
		timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());
		//Check to see if the component script call returned successfully.  If not handle the response appropriately
		replyStatus = reply.getStatus();
		if(replyStatus !== "S"){
			if(replyStatus == "F") {
				errMsg.push(reply.getError());
				this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("<br />")), "");
			}
			else {
				this.finalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()), "(0)");
			}
			// update count text in the navigation pane
			CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {
				"count": 0
			});
			return;
		}
		assessmentCount = recordData.RG.length;
		countText = MP_Util.CreateTitleText(this, assessmentCount);
		//create header
		saArray.push("<div class='", MP_Util.GetContentClass(this, 0), "' style='max-height:", initHeight, "px'>");
		saArray.push("<div id='", blnkDivId, "' class='wf-sa-floatLeftDiv'></div>");
		saArray.push("<div class='wf-sa-background-div'><div id='", tblHdrId, "' class='wf-sa-contenthdrCol'><table class='wf-sa-rightdivtable'><tr class='hdr'>");
		saArray.push(this.createAssessmentTableHeader(timeGroup, tgArray, compNS));
		saArray.push(this.addAssessmentRows(recordData, tgArray));
		MP_Util.Doc.FinalizeComponent(saArray.join(""), this, "");
		var tabheadheight = $("#" + tblHdrId).height();
		$("#" + blnkDivId).css({
			height: tabheadheight
		});
	}
	catch(err)
	{
		if(timerRenderComponent)
		{
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		logger.logJSError(this, err, "scales-assess-o2.js", "RenderComponent");
		//Throw the error to the architecture
		throw (err);
	}
	finally
	{
		if(timerRenderComponent)
		{
			timerRenderComponent.Stop();
		}
	}
};

ScalesAssessComponentWF.prototype.postProcessing = function(){
	//Add a listener for any Clinical Event action so we can refresh the component if a new event is added
	CERN_EventListener.addListener(this, EventListener.EVENT_CLINICAL_EVENT, this.refresh, this);
};

/**
 * This is the ScalesAssessComponentWF implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 */
ScalesAssessComponentWF.prototype.retrieveComponentData = function() {
	var criterion = null;
	var request = null;
	var sendAr = [];
	var self = this;
	var sOtherParams = "^^";
	var groups = this.getGroups();
	/**
	 * mp_get_outstanding_orders script parameters:
	 * outdev, inputPersonID, inputEncounterID, inputPersonnelID, lookbackUnits, lookbackUnitTypeFlag,
	 * categoryType, orderStatuses, PPRCd
	 */
	//Create the parameter array for our script call
	criterion = this.getCriterion();
	var encntr_id = this.getScope() == 2 ? criterion.encntr_id + ".0" : "0.0";
	for (var i = 0; i < groups.length; i++)
	{
		var group = groups[i];
		if (group instanceof MPageEventSetGroup)
		{
			sOtherParams = MP_Util.CreateParamArray(group.getEventSets(), 1);
		}
	}
	sendAr = ["^MINE^", criterion.person_id + ".0", encntr_id, criterion.provider_id + ".0", criterion.ppr_cd + ".0",
	this.getLookbackUnits(), this.getLookbackUnitTypeFlag(), sOtherParams, MP_Util.CreateParamArray(this.powerformIds, 1)];

	request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
	request.setProgramName("MP_RETRIEVE_SCALES_ASSESS_DATA");
	request.setParameters(sendAr);
	request.setAsync(true);

	MP_Core.XMLCCLRequestCallBack(this, request, function(reply)
	{
		self.RenderComponent(reply);
	});
};
/**
 * Function to launch powerform unique by activity_id and only in read only mode and determine hyperlink reference.
 *
*/
ScalesAssessComponentWF.prototype.createClickEvent = function(value, personId, encntrId, activityId, type, eventArray) {
	var resultDate = new Date();
	var resultDateDisp = "";
	if (type === 3) {
		resultDate.setISO8601(value);
		resultDateDisp = resultDate.format("longDateTime3");
	}
	else
	{
		resultDateDisp = this.formatNumber(value);
	}
	var returnString = "";
	var launchPowerFormStr = "<a onclick='ScalesAssessComponentWF.prototype.launchPowerForm(" + personId + "," + encntrId + "," + activityId + "," + 1 + "," + 0 + ");' href='#'>" + resultDateDisp + "</a>";
	var launchClinNoteViewerStr = "<a onclick='ScalesAssessComponentWF.prototype.launchClinNoteViewer(" + personId + "," + encntrId + ",\"" + eventArray + "\"," + '"EVENT"' + ");' href='#'>" + resultDateDisp + "</a>";

	if (value === "--" || !CERN_Platform.inMillenniumContext())
	{
		return resultDateDisp;
	}
	else
	{
		returnString += activityId > 0 ? launchPowerFormStr : launchClinNoteViewerStr;
	}
	return returnString;
};

/**
 * Function to set & display additional status info on each result via hover.
 */
ScalesAssessComponentWF.prototype.createAdditionalInfoHover = function(resultsObj, resultsCnt, index, eventArr, groupName, minMaxData) {
	var i = 0;
	var addResultsHtml = [];
	var hoverHTML = [];
	var tempHTML = [];
	var faceUpIndex = 0;
	if (index === 0)
	{
		faceUpIndex = index;
	}
	else
	{
		faceUpIndex = index - resultsCnt;
	}
	var scales_assessI18N = i18n.discernabu.scales_assess_o2;
	var faceUpResult;
	var resDate = new Date();
	resDate.setISO8601(resultsObj[faceUpIndex].DTTM);
	eventArr.push(resultsObj[faceUpIndex].EVENT_ID);
	var dateDisp = resDate.format("longDateTime3");
	var normArr = [];
	if (resultsCnt > 1)
	{
		var prevModInd = "";
		addResultsHtml.push("<div class='scales-assess-prev-det'><div class='scales-assess-prev-res-hdr'>", scales_assessI18N.ADDITIONAL_RESULTS, "</div><ol>");
		for (i = 1;i < resultsCnt; i++)
		{
			eventArr.push("-", resultsObj[faceUpIndex + i].EVENT_ID);
			addResultsHtml.push("<li><span class='", this.getNormalcy(resultsObj[faceUpIndex + i].NORMALCY), "'><span class='res-ind'></span><span class='res-value'>", this.formatNumber(resultsObj[faceUpIndex + i].RESULT), "&nbsp", resultsObj[faceUpIndex + i].UOM, "</span></span>");
			if (resultsObj[faceUpIndex + i].STATUS_MEAN === "MODIFIED" || resultsObj[faceUpIndex + i].STATUS_MEAN === "ALTERED")
			{
				addResultsHtml.push("<span class='res-modified'>&nbsp;</span>");
			}
			addResultsHtml.push("</li>");
		}
		addResultsHtml.push("</ol></div>");
	}
	if (resultsObj[faceUpIndex].RES_TYPE === 3)
	{
		var dateResult = new Date();
		dateResult.setISO8601(resultsObj[faceUpIndex].RESULT);
		faceUpResult = dateResult.format("longDateTime3");
	}
	else
	{
		faceUpResult = resultsObj[faceUpIndex].RESULT;
	}
	var modInd = "";
	var status = resultsObj[faceUpIndex].STATUS_MEAN;
	var mCritHigh = (resultsObj[faceUpIndex].CHIGH !== "") ? ("</span></dd><dt><span>" + scales_assessI18N.CRITICAL_HIGH + ":</span></dt><dd><span>" + this.formatNumber(resultsObj[faceUpIndex].CHIGH)) : "";
	var mCritLow = (resultsObj[faceUpIndex].CLOW !== "") ? ("</span></dd><dt><span>" + scales_assessI18N.CRITICAL_LOW + ":</span></dt><dd><span>" + this.formatNumber(resultsObj[faceUpIndex].CLOW)) : "";
	var mNormHigh = (resultsObj[faceUpIndex].NHIGH !== "") ? ("</span></dd><dt><span>" + scales_assessI18N.NORMAL_HIGH + ":</span></dt><dd><span>" + this.formatNumber(resultsObj[faceUpIndex].NHIGH)) : "";
	var mNormLow = (resultsObj[faceUpIndex].NLOW !== "") ? ("</span></dd><dt><span>" + scales_assessI18N.NORMAL_LOW + ":</span></dt><dd><span>" + this.formatNumber(resultsObj[faceUpIndex].NLOW)) : "";

	if (status === "MODIFIED" || status === "ALTERED")
	{
		modInd = "<span class='res-modified'>&nbsp;</span>";
	}
	var hoverClass = (resultsCnt > 1) ? "scales-assess-cur-det" : "scales-assess-cur-det-noprev";
	hoverHTML.push("<h4 class='det-hd'><span>", scales_assessI18N.LABORATORY_DETAILS, "</span></h4><div class='hvr wf-sa-additional-result'><div class= '", hoverClass, "'><dl><dt><span>", resultsObj[faceUpIndex].RESULT_NAME, ":</span></dt><dd><span class='", this.getNormalcy(resultsObj[faceUpIndex].NORMALCY), "'>", this.formatNumber(faceUpResult), "&nbsp;", resultsObj[faceUpIndex].UOM, modInd, "</span></dd><dt><span>", scales_assessI18N.DATE_TIME, ":</span></dt><dd><span>", dateDisp, "</span></dd><dt><span>", scales_assessI18N.STATUS, ":</span></dt><dd><span>", status);
	hoverHTML.push(mCritHigh, mCritLow, mNormHigh, mNormLow);
	hoverHTML.push("</span></dd>", tempHTML.join(""), "</dl>", "</div>", addResultsHtml.join(""), "</div>");
	return hoverHTML.join("");
};

ScalesAssessComponentWF.prototype.formatNumber = function(value)
{
	var nf = MP_Util.GetNumericFormatter();
	return mp_formatter._isNumber(value) ? nf.format(value, "^." + MP_Util.CalculatePrecision(value)) : value;
};

/**
 * Function to set & display severity on result by normalcy code.
 *
 */
ScalesAssessComponentWF.prototype.getNormalcy = function(normalcyArray)
{
	var normClass;
	switch(normalcyArray)
	{
		case "CRITICAL":
		case "EXTREMEHIGH":
		case "EXTREMELOW":
		case "PANICHIGH":
		case "PANICLOW":
		case "VABNORMAL":
		case "POSITIVE":
			normClass = "res-severe";
			break;
		case "ABNORMAL":
			normClass = "res-abnormal";
			break;
		case "HIGH":
			normClass = "res-high";
			break;
		case "LOW":
			normClass = "res-low";
			break;
		default:
			normClass = "res-normal";
	}
	return normClass;
};

ScalesAssessComponentWF.prototype.getModifiedIcon = function(isModified) {
	return (isModified.indexOf("MODIFIED") !== -1) ? "<span class='res-modified'></span>" : "";
};

/**
 * Function to launch a charted powerform by activity id.
 *
 */
ScalesAssessComponentWF.prototype.launchPowerForm = function (personID, encntrID, activityID, chartmode, progressInd) {
	var pfObject = {};
	pfObject = window.external.DiscernObjectFactory("POWERFORM");
	pfObject.OpenForm(personID, encntrID, 0, activityID, chartmode);
	if(progressInd === 1)
	{
		CERN_EventListener.fireEvent(null, this, EventListener.EVENT_CLINICAL_EVENT, "ScalesAssess");
	}
};

/**
 * Function to handling the scrolling of various divs including the header divs.
 *
 */
ScalesAssessComponentWF.prototype.scrollWithHeader = function (compId) {
	var tblBdyId = "body_scales_assess" + compId;
	var frstColId = "firstColumn_scales_assess" + compId;
	var blnkDivId = "blank-div-left" + compId;
	var tblHdrId = "header_scales_assess" + compId;
	$("#" + tblHdrId).scrollLeft($("#" + tblBdyId).scrollLeft());
	$("#" + frstColId).scrollTop($("#" + tblBdyId).scrollTop());
};

/**
 * Function to empty html content and refresh by calling retrieveComponentData function.
 *
 */
ScalesAssessComponentWF.prototype.refresh = function() {
	var contentNode = this.getSectionContentNode();
	contentNode.innerHTML = "";
	this.retrieveComponentData();
};

/**
 * Function to launch a clincal note viewer to display additional info of a clicked result not
 * documented from a powerform.
 */
ScalesAssessComponentWF.prototype.launchClinNoteViewer = function (patientId, encntrId, eventId, docViewerType) {
	var m_dPersonId = parseFloat(patientId);
	var m_dEncntrId = parseFloat(encntrId);
	//will add one item to eventIdArray if no comma if found.
	var eventIdArray = eventId.split(",");

	var viewerObj = window.external.DiscernObjectFactory("PVVIEWERMPAGE");
	logger.logDiscernInfo(null, "PVVIEWERMPAGE", "mp_core.js", "LaunchClinNoteViewer");
	try {
		if (docViewerType === "EVENT")
		{
			viewerObj.CreateEventViewer(m_dPersonId);
			var x = 0;
			for (x = 0; x < eventId.length; x++)
			{
				//if values is not hypen and not empty from eeventIdArray, add as valid result to obj viewer
				if (eventIdArray[x] !== "-" && eventIdArray[x] > "")
				{
					viewerObj.AppendEvent(eventIdArray[x]);
				}
			}
			viewerObj.LaunchEventViewer();
		}
	} catch (err) {
		logger.logJSError(err, null, "mp_core.js", "LaunchClinNoteViewer");
		alert(i18n.discernabu.CAN_NOT_VIEW_RESULTS + "  " + i18n.discernabu.CONTACT_ADMINISTRATOR);
	}
};