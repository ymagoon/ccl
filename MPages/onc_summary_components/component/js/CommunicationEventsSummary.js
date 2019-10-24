/* global BaseCommunicationEvents */

function CommunicationEventsSummaryStyle() {
  this.initByNamespace('summHcmCommEvents');
}

CommunicationEventsSummaryStyle.prototype = new ComponentStyle();
CommunicationEventsSummaryStyle.prototype.constructor = ComponentStyle;

function CommunicationEventsSummary(criterion) {
  this.setCriterion(criterion);
  this.setComponentLoadTimerName('USR:MPG.COMMUNICATION_EVENTS.O1.SUM - load component');
  this.setComponentRenderTimerName('ENG:MPG.COMMUNICATION_EVENTS.O1.SUM - render component');
  this.setIncludeLineNumber(true);
  this.setStyles(new CommunicationEventsSummaryStyle());
}

CommunicationEventsSummary.prototype = new BaseCommunicationEvents();

/**
 * This is the communication_events (summary component) implementation of the renderComponent function.
 * It takes the information retrieved from the HCM_GET_COMM_EVENTS script call and renders the component's visuals.
 * @param {object} reply The data object returned from the HCM_GET_COMM_EVENTS script.
 * @returns {void}
 */
CommunicationEventsSummary.prototype.renderComponent = function(reply) {
  var component = this;
  var compNS = component.getStyles().getNameSpace();
  var componentId = component.getComponentId();
  var $mainContainerObj = $('<div id="' + componentId + '-main-container" class="' + compNS + '-main-container">');
  var $tableView = $('<div id="' + componentId + '-table-view" class="' + compNS + '-communication-table"/>');
  var communicationHTML = '';

  component.commEventsTotal = reply.COMM_EVENTS.length;
  component.formatDataForTableDisplay(reply.COMM_EVENTS);
  component.communicationTable = component.getCommunicationTable();
  component.communicationTable.bindData(reply.COMM_EVENTS);
  component.setComponentTable(component.communicationTable);

  $tableView.append($(component.communicationTable.render()));
  $mainContainerObj.append($tableView);

  communicationHTML += $mainContainerObj[0].outerHTML;

  component.finalizeComponent(communicationHTML, '(' + component.commEventsTotal + ')');

};

CommunicationEventsSummary.prototype.postProcessing = function() {
  if (this.isScrollingEnabled() && this.getScrollNumber()) {
    var node = this.getSectionContentNode();

    //Approximate height of each row used by the framework to know when to add scrolling based on the bedrock configuration.
    var approximateRowHeight = '3';

    if (this.commEventsTotal > this.getScrollNumber()) {
      $('#' + this.getComponentTable().getNamespace() + 'tableBody').addClass('comm-event-scrollable');
      MP_Util.Doc.InitScrolling(Util.Style.g('comm-event-scrollable', node, 'div'), this.getScrollNumber(), approximateRowHeight);
    }
  }
};

MP_Util.setObjectDefinitionMapping('HCM_COMM_EVENTS', CommunicationEventsSummary);
