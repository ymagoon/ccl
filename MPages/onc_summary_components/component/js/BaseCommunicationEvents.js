/* global TableCellHoverExtension */

function BaseCommunicationEvents(){}

BaseCommunicationEvents.prototype = new MPageComponent();
BaseCommunicationEvents.prototype.constructor = MPageComponent;

BaseCommunicationEvents.prototype.retrieveComponentData = function() {
  var criterion = this.getCriterion();
  var loadTimer = new RTMSTimer(this.getComponentLoadTimerName());
  var renderTimer = new RTMSTimer(this.getComponentRenderTimerName());
  var scriptRequest;
  var sendAr;

  if (criterion.encntr_id) {
    sendAr = [ '^MINE^', criterion.person_id + '.0', criterion.encntr_id + '.0', this.getLookbackUnits(), this.getLookbackUnitTypeFlag() ];
    scriptRequest = new ComponentScriptRequest();
    scriptRequest.setProgramName('HCM_GET_COMM_EVENTS');
    scriptRequest.setParameterArray(sendAr);
    scriptRequest.setComponent(this);
    scriptRequest.setLoadTimer(loadTimer);
    scriptRequest.setRenderTimer(renderTimer);
    scriptRequest.setResponseHandler(function(scriptReply) {
      this.getComponent().checkReplyStatus(this, scriptReply.getResponse());
    });
    scriptRequest.performRequest();
  }
  else {
    this.finalizeComponent('<span class="disabled">' + i18n.discernabu.communication_events_o1.NO_ENCOUNTER_MSG + '</span>');
  }
};

BaseCommunicationEvents.prototype.checkReplyStatus = function(scriptRequest, reply) {
  var component = this;
  var status = reply.STATUS_DATA.STATUS.toUpperCase();

  if (status === 'S' || status === 'Z') {
    component.renderComponent(reply);
  }
  else {
    scriptRequest.logScriptExecutionError(this);
    logger.logError(scriptRequest.createErrorMessage(this));
    component.finalizeComponent(component.generateScriptFailureHTML(), component.isLineNumberIncluded() ? '(0)' : '');
  }
};

BaseCommunicationEvents.prototype.formatDataForTableDisplay = function(commEvents) {
  var component = this;
  component.i18n = i18n.discernabu.communication_events_o1;
  var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
  var notesSpan = null;
  var notesTooltipSpan = null;
  var compNS = this.getStyles().getNameSpace();
  var notesMaxLength = 125;

  $(commEvents).each(function(index, commEvent) {
    if (commEvent.CONTACTED_PERSON_ID > 0.0) {
      commEvent.CONTACTED_PERSON_NAME = component.criterion.getPatientInfo().getName();
    }

    if (commEvent.CONTACTED_PERSONNEL.ID > 0.0) {
      commEvent.CONTACTED_PERSON_NAME = commEvent.CONTACTED_PERSONNEL.FULL_NAME;
    }

    commEvent.CREATED_BY_PERSON_NAME = commEvent.CREATED_BY.FULL_NAME;
    commEvent.FORMATTED_DT_TM = df.formatISO8601(commEvent.COMM_DT_TM, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
    commEvent.DURATION_IN_MIN_VIEW = commEvent.DURATION_IN_MIN || component.i18n.NO_DATA;
    commEvent.PERSON_ROLE_DISP = commEvent.PERSON_ROLE_DISP || component.i18n.NO_DATA;
    commEvent.TYPE_DISP_VIEW = commEvent.TYPE_DISP || '';
    commEvent.CONTACTED_PERSON_NAME_VIEW = commEvent.CONTACTED_PERSON_NAME || component.i18n.NO_DATA;
    commEvent.METHOD_DISP = commEvent.METHOD_DISP || component.i18n.NO_DATA;

    notesSpan = commEvent.NOTES ? '<span class="hcm-comm-events-notes-icon">&nbsp;</span>' : '';
    var formattedDisplay = component.i18n.FORMATTED_DISPLAY.replace('{display_value}', commEvent.DURATION_IN_MIN_VIEW + ' ' + component.i18n.MIN);
    commEvent.DATE_DURATION_TABLE_DISP = commEvent.FORMATTED_DT_TM + '<br><span class="disabled">' + formattedDisplay + ' </span>' + notesSpan;
    commEvent.CONTACTED_TABLE_DISP = commEvent.CONTACTED_PERSON_NAME_VIEW + '<br><span class="disabled">' + component.i18n.FORMATTED_DISPLAY.replace('{display_value}', commEvent.PERSON_ROLE_DISP) + '</span>';
    commEvent.METHOD_TYPE_DISP = commEvent.METHOD_DISP;
    if (commEvent.TYPE_DISP) {
      commEvent.METHOD_TYPE_DISP += '<br><span class="disabled">' + component.i18n.FORMATTED_DISPLAY.replace('{display_value}', commEvent.TYPE_DISP_VIEW) + '</span>';
    }

    if (commEvent.NOTES.length > notesMaxLength) {
      commEvent.NOTES_TOOLTIP = '<span class="' + compNS + '-hover">' + commEvent.NOTES.substring(0, 121) + component.i18n.ELLIPSIS + '</span>';
    }
    else {
      notesTooltipSpan = '<span class="' + compNS + '-hover">' + commEvent.NOTES + '</span>';
      commEvent.NOTES_TOOLTIP = commEvent.NOTES ? notesTooltipSpan : '';
    }

    commEvent.NOTES_VIEW = commEvent.NOTES ? commEvent.NOTES : component.i18n.NO_DATA;
    commEvent.CREATED_AT = df.formatISO8601(commEvent.CREATED_AT, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);

    if (commEvent.EDITED_AT) {
      commEvent.EDITED_AT = df.formatISO8601(commEvent.EDITED_AT, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR);
    }
  });
};

BaseCommunicationEvents.prototype.createColumn = function(columnId, columnClass, display, isSortable, primarySortField, template) {
  var column = new TableColumn();

  column.setColumnId(columnId);
  column.setCustomClass(columnClass);
  column.setColumnDisplay(display);
  column.setIsSortable(isSortable);
  column.setPrimarySortField(primarySortField);
  column.setRenderTemplate(template);

  return column;
};

BaseCommunicationEvents.prototype.getCommunicationTable = function() {
  var communicationTable = new ComponentTable();
  var component = this;
  var compNS = component.getStyles().getNameSpace();
  var hoverExtension = new TableCellHoverExtension();
  var dateColumn = component.createColumn('datetime', compNS + '-communication-col', component.i18n.DATE_DURATION, true, 'COMM_DT_TM', '${DATE_DURATION_TABLE_DISP}');

  communicationTable.setNamespace(component.getRootComponentNode().id);
  hoverExtension.addHoverForColumn(dateColumn, function(data){
    return data.RESULT_DATA.NOTES_TOOLTIP;
  });
  communicationTable.addColumn(dateColumn);
  communicationTable.addExtension(hoverExtension);

  communicationTable.addColumn(component.createColumn('type', compNS + '-communication-col', component.i18n.METHOD_TYPE, true, 'METHOD_TYPE_DISP', '${METHOD_TYPE_DISP}'));
  communicationTable.addColumn(component.createColumn('outcome', compNS + '-communication-col', component.i18n.OUTCOME, true, 'OUTCOME_DISP', '${OUTCOME_DISP}'));
  communicationTable.addColumn(component.createColumn('name', compNS + '-communication-col', component.i18n.CONTACT_CONTACT_TYPE, true, 'CONTACTED_TABLE_DISP', '${CONTACTED_TABLE_DISP}'));
  communicationTable.addColumn(component.createColumn('createdby', compNS + '-communication-col', component.i18n.CREATED_BY, true, 'CREATED_BY_PERSON_NAME', '${CREATED_BY_PERSON_NAME}'));

  return communicationTable;
};