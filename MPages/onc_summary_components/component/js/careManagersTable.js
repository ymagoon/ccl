CareManagersTable = (function() {

  /**
   * Public Constructor to initialize a Table.
   * @param {Array} careManagers: List of care managers with full name, case load, and potential cases fields.
   * @param {String} namespace: Component namespace.
   * @param {String} id: Component id.
   * @param {String} viewId: Id of the mpage view the component is added to.
   * @param {String} isPotentialCasesDiabled: Indicator to turn on/off potential cases column.
   */
  function Table(careManagers, namespace, id, viewId, isPotentialCasesDiabled) {
    var table = this;
    var customColumnClass = isPotentialCasesDiabled ? namespace + "-width-two-column" : namespace + "-width-three-column";

    this.setNamespace(namespace + id);
    this.setCustomClass(namespace + "-table");

    table.viewId = viewId;

    // Add column templates.
    this.addColumn(new Column("care-manager-name", namespace + "-name", CareManagers.i18n.CARE_MANAGER, false, "FULL_NAME", "${FULL_NAME}"));
    this.addColumn(new Column("case-load", customColumnClass, CareManagers.i18n.CASES, false, null, "${CASE_LOAD}"));
    if (!isPotentialCasesDiabled) {
      this.addColumn(new Column(
        "potential-cases",
        customColumnClass,
        CareManagers.i18n.POTENTIAL_CASES,
        false,
        null,
        "${POTENTIAL_CASES}"
      ));
    }

    // Bind initial table data.
    this.bindData(careManagers);

    // Add on click handler. The table must be finalized after it is rendered to register the handler.
    this.addExtension(new TableCellClickCallbackExtension().setCellClickCallback(function(event, data) {
      onCellClick.call(table, event, data);
    }));
  }

  Table.prototype = new ComponentTable();

  /**
   * PUBLIC METHODS
   */

  /**
   * Rebind and update the data listed in the table.
   * @param {Array} careManagers: List of care managers with full name, case load, and potential cases fields.
   */
  Table.prototype.update = function(careManagers) {
    this.bindData(careManagers);
    this.refresh();

    $("#" + this.namespace + " .sec-total").html("(" + careManagers.total_results + ")");
  };

  /**
   * Trigger a click event on the given row.
   * @param {Number} rowNumber: The number of the row to click, 0-based.
   */
  Table.prototype.clickRow = function(rowNumber) {
    $("#" + this.namespace + "\\:row" + rowNumber + "\\:care-manager-name").trigger("mouseup");
  };

  /**
   * Update the row classes in the table for a newly selected row.
   * @param {Object} $newRow: The jQuery object of the newly selected row.
   */
  Table.prototype.updateSelectedRow = function($newRow) {
    this.getSelectedRows().removeClass("selected");

    $newRow.addClass("selected");
  };

  /**
   * Get selected rows.
   */
  Table.prototype.getSelectedRows = function() {
    return $("#" + this.namespace + "table .selected");
  };

  /**
   * PRIVATE
   */

  /**
   * On click callback to gather id and name information from a selected row and fire a careManagerSelected event.
   * @param {Event} event: The jQuery event returned from a mouseup event on a cell inside the table.
   * @param {Object} data: The table data for the row in which the cell was clicked.
   */
  function onCellClick(event, data) {
    var selectedRow = $(event.target).parents("dl.result-info"),
      clickEvent = jQuery.Event("careManagerSelected");

    this.updateSelectedRow(selectedRow);
    clickEvent.careManagerId = data.RESULT_DATA.PERSONNEL_ID;
    clickEvent.name = data.RESULT_DATA.FULL_NAME;
    clickEvent.viewId = this.viewId;
    $(event.target).trigger(clickEvent);
  };

  /**
   * Private Constructor to initialize a TableColumn.
   * @param {String} columnId: Column Id string.
   * @param {String} columnClass: Column dlass string.
   * @param {String} display: Column display string.
   * @param {Boolean} isSortable: Boolean to specify whether column is sortable or not.
   * @param {String} primarySortField: Primary sort field for the column.
   * @param {String} template: Template to render in the column.
   * @return {TableColumn} column: A TableColumn object.
   */
  function Column(columnId, columnClass, display, isSortable, primarySortField, template) {
    this.setColumnId(columnId);
    this.setCustomClass(columnClass);
    this.setColumnDisplay(display);
    this.setIsSortable(isSortable);
    if (isSortable) {
      this.setPrimarySortField(primarySortField);
    }
    this.setRenderTemplate(template);
  };

  Column.prototype = new TableColumn();

  return Table;
})();
