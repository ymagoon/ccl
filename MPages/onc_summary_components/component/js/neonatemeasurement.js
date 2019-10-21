/**
* @class
*/
function NeonateMeasurementComponentStyle()
{
	this.initByNamespace("neomeas");
}

NeonateMeasurementComponentStyle.inherits(ComponentStyle);

/**
 * The Neonate Measurements component will retrieve measurements associated to the patient
 * from the defined event sets
 * 
 * @param {Criterion} criterion
 * @author Wes Dembinski
 */
function NeonateMeasurementComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new NeonateMeasurementComponentStyle());
	this.setIncludeLineNumber(true);
	
	var birthWeightEvent = "0.0";
	var birthLengthEvent = "0.0";
	var birthHeadCircEvent = "0.0";
	var birthAbCircEvent = "0.0";
	var birthChestCircEvent = "0.0";
	var weightEvent = "0.0";
	var lengthEvent = "0.0";
	var headCircEvent = "0.0";
	var abCircEvent = "0.0";
	var chestCircEvent = "0.0";
	
	this.setComponentLoadTimerName("USR:MPG.NeonateMeasureComponent.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.NeonateMeasureComponent.O1 - render component");
	
	NeonateMeasurementComponent.method("InsertData", function(){
		retrieveGroups(this);
		CERN_NB_MEASUREMENTS_O1.GetMeasurementsTable(this);
	});
	NeonateMeasurementComponent.method("HandleSuccess", function(recordData){	
		CERN_NB_MEASUREMENTS_O1.RenderComponent(this, recordData);
	});
	NeonateMeasurementComponent.method("getBirthWeightEvents", function () {
        return  birthWeightEvent;
    });
    NeonateMeasurementComponent.method("getBirthLengthEvents", function () {
        return birthLengthEvent;
    });
    NeonateMeasurementComponent.method("getBirthHeadCircEvents", function () {
        return birthHeadCircEvent;
    });
    NeonateMeasurementComponent.method("getBirthAbCircEvents", function () {
        return birthAbCircEvent;
    });
    NeonateMeasurementComponent.method("getBirthChestCircEvents", function () {
        return birthChestCircEvent;
    });
    NeonateMeasurementComponent.method("getWeightEvents", function () {
        return  weightEvent;
    });
    NeonateMeasurementComponent.method("getLengthEvents", function () {
        return lengthEvent;
    });
    NeonateMeasurementComponent.method("getHeadCircEvents", function () {
        return headCircEvent;
    });
    NeonateMeasurementComponent.method("getAbCircEvents", function () {
        return abCircEvent;
    });
    NeonateMeasurementComponent.method("getChestCircEvents", function () {
        return chestCircEvent;
    });
    

	function retrieveGroups(component){
        var groups = component.getGroups();
        var xl = (groups) ? groups.length : 0;
        for (var x = xl; x--; ) {
            var group = groups[x];            
            switch (group.getGroupName()) {
                case "NEO_BIRTH_WT_ES":
                    birthWeightEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_BIRTH_LENGTH_ES":
                    birthLengthEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_BIRTH_HEAD_CIRC_ES":
                   birthHeadCircEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_BIRTH_ABD_CIRC_ES":
                    birthAbCircEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_BIRTH_CHEST_CIR_ES":
                    birthChestCircEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_WT_ES":
                    weightEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_LENGTH_ES":
                    lengthEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_HEAD_CIRC_ES":
                    headCircEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_ABD_CIRC_ES":
                    abCircEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_CHEST_CIR_ES":
                    chestCircEvent = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
            }
        }
    }
}

NeonateMeasurementComponent.inherits(MPageComponent);

 /**
  * Neonate Measurements and Weights methods
  * @namespace CERN_NB_MEASUREMENTS_O1
  * @dependencies Script: mp_nb_get_measures
  */
var CERN_NB_MEASUREMENTS_O1 = function(){
    return {
        GetMeasurementsTable : function(component){
			var sendAr = [];
			var criterion = component.getCriterion();
			
			var dob = '""';
			var dobTmp = criterion.getPatientInfo().getDOB();
			if(dobTmp!==null){
				dob =  '"' + criterion.getPatientInfo().getDOB().format("dd-mmm-yyyy HH:MM") + '"';
			}
			
			sendAr.push("^MINE^",
				criterion.person_id + ".0",
				criterion.provider_id + ".0",
				criterion.ppr_cd + ".0",
				dob,
				component.getBirthWeightEvents(),
				component.getBirthLengthEvents(),
				component.getBirthHeadCircEvents(),
				component.getBirthAbCircEvents(),
				component.getBirthChestCircEvents(),
				component.getWeightEvents(),
				component.getLengthEvents(),
				component.getHeadCircEvents(),
				component.getAbCircEvents(),
				component.getChestCircEvents());
				
			MP_Core.XMLCclRequestWrapper(component, "MP_GET_NEONATE_MEASURES", sendAr, true);
        },
        RenderComponent: function(component, recordData){
            var i18n_nm = i18n.discernabu.neonatemeasurement_o1;
			var contentId = component.getStyles().getContentId();
			var measurements = ["<table class='neomeas-table'>\
						<th class='sub-sec-hd'>&nbsp;</th>\
						<th class='sub-sec-hd'>"+i18n_nm.BIRTH+"</th>\
						<th class='sub-sec-hd'>"+i18n_nm.LATEST_RESULT+"</th>\
						<th class='sub-sec-hd'>"+i18n_nm.PERCENT_CHANGE+"</th>\
						<th class='sub-sec-hd'>"+i18n_nm.PREV_RESULT+"</th>"];
					
			measurements.push(CreateResultRow(i18n_nm.WEIGHT, recordData.WEIGHT[0], 0));
			measurements.push(CreateResultRow(i18n_nm.LENGTH, recordData.LENGTH[0], 1));
			measurements.push(CreateResultRow(i18n_nm.HEAD_CIRC, recordData.HEAD_CIRC[0], 2));
			measurements.push(CreateResultRow(i18n_nm.AB_CIRC, recordData.ABD_CIRC[0], 3));
			measurements.push(CreateResultRow(i18n_nm.CHEST_CIRC, recordData.CHEST_CIRC[0], 4));
			measurements.push("</table>");
						
			_g(contentId).innerHTML = measurements.join("");
			
			//setup the hovers on all divs with the hvr class under the content div
			var hoverStyle = Util.Style.g("hvr",_g(contentId),"div");
			jQuery.each(hoverStyle,function(div){
				hs(Util.gp(this),this,component);
			});
			
			var countText = MP_Util.CreateTitleText(component, recordData.RESULT_CNT);
			var totalCount = Util.Style.g("sec-total", component.getRootComponentNode(), "span");
			totalCount[0].innerHTML = countText;			
        }
    };
	
	function CreateResultRow(type, measObj, rowNum) {	
		var df = MP_Util.GetDateFormatter();		
		var rowHTML = "<tr class='{rowClass}'><td>{resultType}</td>\
			<td><dl>{birth}</dl>{birthHover}</td><td><dl>{latest}</dl>{latestHover}</td>\
			<td>{change}</td><td><dl>{previous}</dl>{previousHover}</td></tr>";
			
		var rowClass = (rowNum % 2) ? "even" : "odd";

		
	    			
		return rowHTML.interpolate({
			rowClass: rowClass,
			resultType: type,
			birth:findDisplayVal(measObj.BIRTH_DISPLAY),
			latest:findDisplayVal(measObj.LATEST_DISPLAY),
			previous: findDisplayVal(measObj.PREVIOUS_DISPLAY),
			change: CalcPercentChange(measObj.LATEST_RESULT, measObj.BIRTH_RESULT),
			birthHover: (measObj.BIRTH_RESULT > 0) ? AddResultDetail(type, df.formatISO8601(measObj.BIRTH_DTTM_DISPLAY,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)) : "",
			latestHover: (measObj.LATEST_RESULT > 0) ? AddResultDetail(type, df.formatISO8601(measObj.LATEST_DTTM_DISPLAY,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)) : "",
			previousHover: (measObj.PREVIOUS_RESULT > 0) ? AddResultDetail(type, df.formatISO8601(measObj.PREVIOUS_DTTM_DISPLAY,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)) : ""
		});		
	}
	
	function AddResultDetail(type, dateDisplay) {
		var hoverHTML = "<div class='hvr'><dl><dt><span>"+i18n.discernabu.neonatemeasurement_o1.RESULT_TYPE+": </span></dt>\
			<dd><span>{resultType}</span></dd><dt><span>"+i18n.discernabu.neonatemeasurement_o1.DATE_TIME+": </span></dt><dd><span>{date}</span></dd>\
			</dl></div>";
		
		
	    	
		return hoverHTML.interpolate({resultType:type, date:dateDisplay});
	}
	
	function CalcPercentChange(current, previous) {
		if(current === 0 || previous === 0) {
			return "";
		}
		
		
			
		return MP_Util.Measurement.SetPrecision((current/previous - 1) * 100,2) + i18n.discernabu.neonatemeasurement_o1.PERCENT;
	}
	
	function findDisplayVal(resultDisplay){
		if(resultDisplay.length===0){
			return "";
		}
		var resDispArr = resultDisplay.split("");
		var displayVal = [];
		var i=0;
		for(i=0;i<resultDisplay.length;i++){
			if(isNaN(resDispArr[i]) && resDispArr[i]!=='.'){
				break;
			}
			else{
				displayVal[i]=resDispArr[i];
			}
			
		}
		var finaldisplayVal =displayVal.join("");
		var numericVal = finaldisplayVal.toString().split(".")[0];
		var decimalVal = finaldisplayVal.toString().split(".")[1];
		var len =0;
		if (decimalVal !== undefined){
			len = decimalVal.length;
		}
			
		finaldisplayVal = MP_Util.Measurement.SetPrecision(finaldisplayVal,len);
		var displayUnit = resultDisplay.substring(i, resultDisplay.length);
		
		return finaldisplayVal+displayUnit;
	}
	
}();