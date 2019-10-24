// Mpage Component Initializations

function CaseDistributionStyle() {
  this.initByNamespace("hcmCaseLoad");
}
CaseDistributionStyle.inherits(ComponentStyle);

CaseDistribution = (function() {
  "use strict";

  /**
   * @constructor
   * @param {Criterion}
   */
  function Component(criterion) {
    var component = this;
    var componentViewId = criterion.category_mean;

    // required attributes
    this.setCriterion(criterion);
    this.setStyles(new CaseDistributionStyle());
    this.setComponentLoadTimerName("USR:MPG.CARE_MANAGEMENT_CASE_DISTRIBUTION.O1 - load component");
    this.setComponentRenderTimerName("ENG:MPG.CARE_MANAGEMENT_CASE_DISTRIBUTION.O1 - render component");

    // custom attributes
    Component.i18n = i18n.discernabu.CaseDistribution;
    this.chartId   = "hcm-case-dist-donut-chart-" + newId();
    this.criterion = this.getCriterion();

    $(document).on("careManagerSelected", function(event) {
      if (componentViewId === event.viewId && component.supervisorInd() === "0") {
        component.selectedCareManagerId = event.careManagerId;
        component.selectedCareManagerName = event.name;
        component.retrieveComponentData(component.selectedCareManagerId);
      }
    });
  };

  Component.prototype = new MPageComponent();
  Component.prototype.constructor = MPageComponent;
  MP_Util.setObjectDefinitionMapping("CASE_DISTRIBUTION", Component);

  /**
   * SUPPORTING PUBLIC METHODS
   */

  Component.prototype.supervisorInd = function() {
    this._supervisorInd = this._supervisorInd || "0";

    if (arguments.length > 0) {
      this._supervisorInd = arguments[0];
    };

    return this._supervisorInd;
  };

  Component.prototype.loadFilterMappings = function() {
    this.addFilterMappingObject("CASE_DIST_VIEW_RELATED_IND", {
      type: "STRING",
      field: "FREETEXT_DESC",
      setFunction: this.supervisorInd,
    });
  };

  Component.prototype.retrieveComponentData = function(careManagerSelected) {
    var scriptRequest = new ComponentScriptRequest(),
        providerID = careManagerSelected || this.criterion.provider_id;

    scriptRequest.setComponent(this);
    scriptRequest.setProgramName("HCM_GET_CASE_DISTRIBUTION");
    scriptRequest.setParameterArray(["^MINE^", providerID, this.supervisorInd()]);
    scriptRequest.setLoadTimer(new RTMSTimer(this.getComponentLoadTimerName()));
    scriptRequest.setRenderTimer(new RTMSTimer(this.getComponentRenderTimerName()));

    scriptRequest.performRequest();
  };

  Component.prototype.renderComponent = function(recordData) {
    var component = this,
        cmNameSpan,
        nameHolder = "",
        namespace = component.getStyles().getNameSpace(),
        body;
    component.chartData = chartData(recordData);

    if (component.selectedCareManagerName) {
      cmNameSpan = "<span class='" + namespace + "-caremanager-name'>" + component.selectedCareManagerName + "</span>";
      nameHolder = "<div class='sub-title-disp'>" +
                      "<span>" + Component.i18n.careManagerName.replace("{name}", cmNameSpan) + "</span>" +
                   "</div>";
    }

    if (isResultsFound(component.chartData)) {
      body = "<div class='" + namespace +"'>" + nameHolder + getChartDiv(component.chartId, component.chartData) + "</div>";
      /*
        Order is important here. createChart() must only be called after finalizeComponent()

        jqPlot expects the HTML to be in the dom during creation of the chart. With the MPages framework,
        our generated HTML is not attached to the dom until finalizeComponent() has completed.
      */
      this.finalizeComponent(body);
      createChart(component.chartId, component.chartData);
    } else{
      body = "<div class='" + namespace +"'>" + nameHolder + component.generateNoDataFoundHTML() + "</div>";
      this.finalizeComponent(body)
    };
  };

  // private api exposed for testing
  Component.__private = {
    getChartDiv: getChartDiv,
    chartData: chartData,
    createChart: createChart,
    legendRows: legendRows,
    legendsTable: legendsTable,
  };

  /**
   * PRIVATE FUNCTIONS
   */

   function isResultsFound(data) {
     return $.grep(data, function(labelAndCount) {
        return labelAndCount[1] > 0;
     }).length > 0;
   };

  function chartData(caseData) {
    var caseData = caseData || {},
        caseCounts = $.makeArray(caseData.CASE_COUNTS),
        counts = $.map(caseCounts, function(status) { return [[status.STATUS_DISP, status.STATUS_CNT]]; });

    counts.total = caseData.TOTAL_CNT || 0;
    return counts;
  };

  function getChartDiv(id, data) {
    return "<div class='chart' id='" + id + "'></div>" +
          "<div class='legends'>" + legendsTable(data) + "</div>";
  };

  function legendsTable(data) {
    return "<table>" +
      "<tr>" +
        "<th class='label-column'>" + Component.i18n.labelHeading + "</th>" +
        "<th class='count-column'>" + Component.i18n.countHeading + "</th>" +
      "</tr>" +
      legendRows(data) +
      "<tr class='total-cases-row'>" +
        "<td class='label-column'>" + Component.i18n.totalCases + "</td>" +
        "<td class='count-column'>" + data.total + "</td>" +
      "</tr>" +
    "</table>";
  };

  var CHART_COLORS = ["#AEC7E8", "#FF7F0E", "#FFBB78", "#2CA02C", "#98DF8A", "#1F77B4"];

  function legendRows(data) {
    return $.map(data, function(labelAndCount, index) {
      var color = CHART_COLORS[index % CHART_COLORS.length];

      return "<tr>" +
        "<td class='label-column'>" +
          "<div class='color' style='background-color: " + color + "'></div>" +
          "<div class='value'>" + labelAndCount[0] + "</div>" +
        "</td>" +
        "<td class='count-column'>" + labelAndCount[1] + "</td>" +
      "</tr>"
    }).join("");
  };

  function createChart(id, data) {
    return $.jqplot(id, [data], {
      seriesColors: CHART_COLORS,
      grid: {
        background: "white",
        borderColor: "white",
        shadow: false,
      },
      seriesDefaults: {
        renderer: $.jqplot.DonutRenderer,
        rendererOptions: {
          dataLabels: "value",
          highlight: true,
          shadow: false,
          showDataLabels: true,
          sliceMargin: 2,
          startAngle: -90,
        }
      },
      cursor: {
        style: "default",
        show: false,
        useAxesFormatters: false,
      },
      highlighter: {
        show: false,
        useAxesFormatters: false,
      }
    });
  };

  var newId = (function() {
    var counter = 0;
    return function() { return counter += 1; };
  })();

  return Component;
})();
