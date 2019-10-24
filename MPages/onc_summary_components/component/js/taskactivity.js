/**
 * Create the TaskActivity component style object
 * @constructor
 */
function TaskActivityComponentStyle() {
	this.initByNamespace("ta");
}

TaskActivityComponentStyle.inherits(ComponentStyle);

/**
 * The TaskActivity component will retrieve task activity information, mainly overdue tasks.
 *
 * The look back range is specified using setLookbackUnits() and setLookbackUnitType().
 * setLookBackDays() is no longer used to set the look back range for this component.
 *
 * @constructor
 * @param {Criterion} criterion
 */
function TaskActivityComponent(criterion) {
	var i18nCore = i18n.discernabu;
	var replaceText = i18nCore.LAST_N_HOURS.replace("{0}", "24");
	var subTitleText = i18nCore.SELECTED_N_VISIT.replace("{0}", replaceText);
	var template = ['<div class="sub-title-disp lb-drop-down">', subTitleText, '</div>'];

	// the look back range for this component is hard coded to 24 hours of the selected visit
	// we have to we generate a custom sub title text for it due to the possibility of bedrock overriding the hard coded settings.
	this.setScopeHTML(template.join(''));
	this.setScope(3);

	this.setCriterion(criterion);
	this.setStyles(new TaskActivityComponentStyle());
	this.setIncludeLineNumber(true);
	this.m_overdueTaskTypeCodes = null;

	//meanings is used to allow loading of the status codes
	//when needed aka 'lazy loading'.  Hence why the retrieval of
	//meanings is not exposed to the consumer.  Only retrieval of codes
	//is available.
	this.m_taskStatusMeanings = ["OVERDUE"];

	TaskActivityComponent.method("InsertData", function() {
		CERN_TASK_ACTIVITY_O1.GetTaskActivities(this);
	});
	TaskActivityComponent.method("setOverdueTaskTypeCodes", function(value) {
		this.m_overdueTaskTypeCodes = value;
	});
	TaskActivityComponent.method("getOverdueTaskTypeCodes", function() {
		return this.m_overdueTaskTypeCodes;
	});
	TaskActivityComponent.method("addTaskStatusMeaning", function(value) {
		if(!this.m_taskStatusMeanings) {
			this.m_taskStatusMeanings = [];
		}
		this.m_taskStatusMeanings.push(value);
	});
	TaskActivityComponent.method("setTaskStatusMeanings", function(value) {
		this.m_taskStatusMeanings = value;
	});
	TaskActivityComponent.method("getTaskStatusMeanings", function() {
		return this.m_taskStatusMeanings;
	});
	TaskActivityComponent.method("HandleSuccess", function(recordData) {
		CERN_TASK_ACTIVITY_O1.RenderComponent(this, recordData);
	});
}

TaskActivityComponent.inherits(MPageComponent);

/**
 * The namespace <CODE>CERN_TASK_ACTIVITY_O1</code> is utilized for retrieving and rendering
 * the task activity information for a specific patient
 * 
 * The look back range is specified using setLookbackUnits() and setLookbackUnitType().
 * setLookBackDays() is no longer used to set the look back range for this component.
 * 
 */
var CERN_TASK_ACTIVITY_O1 = function() {
	function TaskSorter(a, b) {

		var aDate = a.SCHEDULED_DATE;
		var bDate = b.SCHEDULED_DATE;

		if (aDate < bDate) {
			return -1;
		}
		else if (aDate > bDate) {
			return 1;
		}
		else {
			return 0;
		}

	}

	return {
		GetTaskActivities: function(component) {
			var sendAr = [];
			var taskTypeCodes = MP_Util.CreateParamArray(component.getOverdueTaskTypeCodes());
			var criterion = component.getCriterion();
			var taskStatusMeanings = "Value(^" + component.getTaskStatusMeanings().join("^,^") + "^)";

			// re-set the lookback range to 24 hours because under certain circumstances...
			// because bedrock can potentially override the defaults in the constructor
			// but we don't want to use bedrock "settings" because you can't actually set these setting in bedrock.
			component.setLookbackUnits(24);
			component.setLookbackUnitTypeFlag(1);
			
			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", 0.0, 0, taskTypeCodes, 0.0, component.getLookbackUnits(), component.getLookbackUnitTypeFlag(), taskStatusMeanings);
			MP_Core.XMLCclRequestWrapper(component, "MP_GET_TASKS", sendAr, true);
		},
		RenderComponent: function(component, recordData) {
			var otHTML = "";
			var date = "";
			var otHdrStr = "";
			var num_days_hours = "";
			var countText = "";
			var codeArray = MP_Util.LoadCodeListJSON(recordData.CODES);
			var otAr = [];
			var taskDtTm = "";
			var severity = "";
			var taskStatus = "";
			var df = MP_Util.GetDateFormatter();
			
			recordData.TASKS.sort(TaskSorter);
					
			for(var i = 0, l = recordData.TASKS.length; i < l; i++) {
				var tasks = recordData.TASKS[i];
				if(tasks.SCHEDULED_DT_TM && tasks.SCHEDULED_DT_TM !== "") {
					taskDtTm = df.formatISO8601(tasks.SCHEDULED_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
				}

				taskStatus = MP_Util.GetValueFromArray(tasks.TASK_STATUS_CD, codeArray);
				severity = (taskStatus && taskStatus.meaning == "OVERDUE") ? "res-severe" : "res-normal";
				otAr.push("<h3 class='info-hd'><span>", tasks.TASK_DESCRIPTION, "</span></h3><dl class='ta-info'><dt class='ta-desc'><span>", tasks.TASK_DESCRIPTION, "</span></dt><dd class='ta-name'><span class='", severity, "'>", tasks.TASK_DESCRIPTION, "</span></dd><dt class='ta-dt-tm'><span>", taskDtTm, "</span></dt><dd class='ta-date'><span class='date-time ", severity, "'>", taskDtTm, "</span></dd></dl>");
			}
			countText = MP_Util.CreateTitleText(component, recordData.TASKS.length);
			otHTML = otAr.join("");
			MP_Util.Doc.FinalizeComponent(otHTML, component, countText);
		}
	};

}();
