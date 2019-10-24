var ManageCaseWorkFlow = ManageCaseWorkFlow || {};
ManageCaseWorkFlow.KeyValueTable = {};

/**
 * Creates a Key value table shown here: http://design.cerner.corp/styleguide-beta/2010/12/30/table-rows/
 * @param {Object} settings - settingS for KeyValueTable.
 *        {String} namespace - namespace that will be applied to the key value table.
 *        {Object} data - a hash containing a String as the key and ManageCaseWorkFlow.KeyValueTable.Value as the value
 *        {String} header - header for the table.
 *        {Integer} emptyRows -number of empty rows added to the table. (Needed if the height of the table needs to be more)
 */
ManageCaseWorkFlow.KeyValueTable.create = function(settings) {
  this.namespace = settings.namespace;
  this.data = settings.data;
  this.header = settings.header;
  this.emptyRows = settings.numberOfEmptyRows
  var that = this;

  this.html = function() {
    var html = "<div class='"+ this.namespace +"-list-group'>"
    html += header() + table();
    html += "</div>"
    html += "<div class='"+ this.namespace +"-table-space'><table class='"+ this.namespace +"-list-container'><tr><td>&nbsp;</td></tr></table></div>";

    return html;
  };

  // private

  var header = function() {
    var html = "";

    if (that.header) {
      html += "<b> " + that.header + "</b>"
    }

    return html;
  }

  var table = function() {
    var namespace = that.namespace,
        html = "";

    html += "<div class='" + namespace +"-table-container'><table class='" + namespace + "-list-container'>";
    html += "<tbody>"

    $.each(that.data, function(label, value) {
      html += "<tr>"
      html += "<td class='"+ namespace +"-list-terms'>" + label + "</td><td class='"+ namespace +"-list-descriptions'"
      if (value.toolTipText) {
        html += " title='" + value.toolTipText + "'";
      }
      html += ">" + value.text + "</td>";
      html += "</tr>"
    });

    html += emptyRows();

    html += "</tbody>"
    html += "</table></div>"

    return html;
  }

  var emptyRows = function() {
    var html = "";

    for(var emptyRowCnt = 0; emptyRowCnt < that.emptyRows ; emptyRowCnt++) {
      html += "<tr>"
      html += "<td class='"+ that.namespace +"-list-terms'>&nbsp;</td><td class='"+ that.namespace +"-list-descriptions'>&nbsp;</td>";
      html += "</tr>"
    }

    return html;
  }

  return this;
};

ManageCaseWorkFlow.KeyValueTable.Value = function(text, toolTipText) {
  this.text = text;
  this.toolTipText = toolTipText;
}
