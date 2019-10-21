var ManageCaseSumm = ManageCaseSumm || {};

ManageCaseSumm.caseInformationTable = (function(){
  function createGroup(options) {
    var group = new TableGroup();

    group.setGroupId(options.id);
    group.setDisplay(options.display);
    group.setKey(options.key);
    group.setValue(options.value);
    group.bindData(options.data);

    return group;
  }

  function caseDetailsGroup(caseInformation) {
    var caseDetails = $.grep(caseInformation, function(row) {
      return row.GROUPER === "case-detail";
    });

    var options = {
      id: "case-details",
      display: i18n.discernabu.manageCaseO1.CASE_DETAILS,
      key: "GROUPER",
      value: "case-detail",
      data: caseDetails
    }

    return createGroup(options);
  }

  function caseDatesGroup(caseInformation) {
    var caseDates = $.grep(caseInformation, function(row) {
      return row.GROUPER === "case-date";
    });

    var options = {
      id: "case-dates",
      display: i18n.discernabu.manageCaseO1.CASE_DATES,
      key: "GROUPER",
      value: "case-date",
      data: caseDates
    }

    return createGroup(options);
  }

  function casePersonnelGroup(caseInformation) {
    var casePersonnel = $.grep(caseInformation, function(row) {
      return row.GROUPER === "case-personnel";
    });

    var options = {
      id: "case-personnel",
      display: i18n.discernabu.manageCaseO1.CASE_PERSONNEL,
      key: "GROUPER",
      value: "case-date",
      data: casePersonnel
    }

    return createGroup(options);
  }

  function createColumn(id, columnClass, template) {
    var column = new TableColumn();

    column.setColumnId(id);
    column.setCustomClass(columnClass);
    column.setRenderTemplate(template);

    return column;
  }

  //private api exposed for testing
  ManageCaseSumm.__caseInformationTable = {
    createGroup        : createGroup,
    caseDetailsGroup   : caseDetailsGroup,
    caseDatesGroup     : caseDatesGroup,
    casePersonnelGroup : casePersonnelGroup,
    createColumn       : createColumn
  };

  // public
  return function(component, caseInformation) {
    var caseInformationTable = new ComponentTable();
    caseInformationTable.setNamespace(component.namespace);

    caseInformationTable.addColumn(createColumn("label", "case-label secondary-text", "${LABEL}"));
    caseInformationTable.addColumn(createColumn("value", "case-value", "${VALUE}"));
    caseInformationTable.setZebraStripe(false);

    caseInformationTable.bindData(caseInformation);
    
    caseInformationTable.addGroup(caseDetailsGroup(caseInformation));
    caseInformationTable.addGroup(caseDatesGroup(caseInformation));
    caseInformationTable.addGroup(casePersonnelGroup(caseInformation));

    return caseInformationTable.render();
  };
})();
