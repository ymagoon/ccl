function PatientInfoWFStyle() {
  this.initByNamespace("patientInfoWf");
}

PatientInfoWFStyle.prototype = new ComponentStyle();
PatientInfoWFStyle.prototype.constructor = ComponentStyle;

/*
 * @constructor
 * Initialize the patient-info-o2 component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function PatientInfoWF(criterion) {
  this.setCriterion(criterion);

  this.setComponentLoadTimerName("USR:MPG.PATIENT_INFO.O2.WF - load component");
  this.setComponentRenderTimerName("ENG:MPG.PATIENT_INFO.O2.WF - render component");

  this.setStyles(new PatientInfoWFStyle());
  this.m_addressesInd = 0;
  this.m_contactInd = 0;
  this.m_emergencyContactInd = 0;
  this.m_healthPlansInd = 0;
  this.m_stickyNotesInd = 0;
  this.m_stickyNotesTypes = [];
  this.count = 0;
  this. m_pmConvoTaskNumber = 0.0;
}

PatientInfoWF.prototype = new MPageComponent();
PatientInfoWF.prototype.constructor = MPageComponent;

/* Supporting functions */

PatientInfoWF.prototype.setAddressesInd = function(value) {
  this.m_addressesInd = value === true ? 1 : 0;
};

PatientInfoWF.prototype.setContactInd = function(value) {
  this.m_contactInd = value === true ? 1 : 0;
};

PatientInfoWF.prototype.setEmergencyContactInd = function(value) {
  this.m_emergencyContactInd = value === true ? 1 : 0;
};

PatientInfoWF.prototype.setHealthPlansInd = function(value) {
  this.m_healthPlansInd = value === true ? 1 : 0;
};

PatientInfoWF.prototype.setStickyNotesInd = function(value) {
  this.m_stickyNotesInd = value === true ? 1 : 0;
};

PatientInfoWF.prototype.setStickyNotesTypes = function(value) {
  this.m_stickyNotesTypes = value;
};

PatientInfoWF.prototype.setEditPatientInfoInd = function(value) {
  this.m_editPatientInfoInd = value === true ? 1 : 0;
};

PatientInfoWF.prototype.setTaskNumber = function(value) {
  this.m_pmConvoTaskNumber = value.length > 0 ? parseFloat(value) : 0;
};

PatientInfoWF.prototype.getAddressesInd = function() {
  return this.m_addressesInd;
};

PatientInfoWF.prototype.getContactInd = function() {
  return this.m_contactInd;
};

PatientInfoWF.prototype.getEmergencyContactInd = function() {
  return this.m_emergencyContactInd;
};

PatientInfoWF.prototype.getHealthPlansInd = function() {
  return this.m_healthPlansInd;
};

PatientInfoWF.prototype.getStickyNotesInd = function() {
  return this.m_stickyNotesInd;
};

PatientInfoWF.prototype.getStickyNotesTypes = function() {
  return this.m_stickyNotesTypes;
};

PatientInfoWF.prototype.getEditPatientInfoInd = function() {
  return this.m_editPatientInfoInd;
};

PatientInfoWF.prototype.getTaskNumber = function() {
  return this.m_pmConvoTaskNumber;
};

PatientInfoWF.prototype.getAddressesDiv = function(addresses, componentId, compNS) {
  var component = this;
  if(component.getAddressesInd() !== 1) {
    return "";
  } else if(addresses.length === 0) {
    component.count += 1;
    return "<fieldset id='" + componentId + "' class='" + compNS + "-fieldset'>" +
              "<legend class='" + compNS + "-legend'>" + i18n.discernabu.PatientInfoWF.ADDRESSES + "</legend>" +
              component.getNoResultsDiv() +
            "</fieldset>";
  } else {
    var addressesDiv = "<fieldset id='" + componentId + "' class='" + compNS + "-fieldset'>" +
                        "<legend class='" + compNS + "-legend'>" + i18n.discernabu.PatientInfoWF.ADDRESSES + "</legend>";

    $.each(addresses, function(index, address) {
      addressesDiv += "<div class='" + compNS + "-wrapper'>" +
                        "<span class='" + compNS + "-label'>" + address.ADDRESS_TYPE + ":</span>" +
                        "<div class='" + compNS + "-addr-wrapper'>" +
                          component.getStreetAddressesDiv(address) +
                          "<span>" + address.CITY + "</span>" + ", " +
                          "<span>" + address.STATE + "</span>" + ", " +
                          "<span>" + address.ZIPCODE + "</span>" +
                        "</div>" +
                        "<div class='clear-fix'></div>" +
                      "</div>";
    });
    component.count += 1;
    return addressesDiv + "</fieldset>";
  }
};

PatientInfoWF.prototype.getStreetAddressesDiv = function(address) {
  var streetAddr = "<div>" + address.STREET_ADDRESS;

  function getStreetAddress(streetAddress) {
     return streetAddress ? "<br/>" + streetAddress : "";
   }
  streetAddr += getStreetAddress(address.STREET_ADDRESS2);
  streetAddr += getStreetAddress(address.STREET_ADDRESS3);
  streetAddr += getStreetAddress(address.STREET_ADDRESS4);

  return streetAddr + "</div>";
};

PatientInfoWF.prototype.getContactInfoDiv = function(contactInfo, componentId, compNS) {
  var emails = contactInfo.EMAILS || [];
  var phones = contactInfo.PHONE || [];
  if(this.getContactInd() !== 1) {
    return "";
  } else if(emails.length === 0 && phones.length === 0) {
    return "<fieldset id='" + componentId + "' class='" + compNS + "-fieldset'>" +
              "<legend class='" + compNS + "-legend'>" + i18n.discernabu.PatientInfoWF.CONTACT_INFORMATION + "</legend>" +
              this.getNoResultsDiv() +
            "</fieldset>";
  } else {
    var contactInfoDiv = "<fieldset id='" + componentId + "' class='" + compNS + "-fieldset'>" +
                          "<legend class='" + compNS + "-legend'>" + i18n.discernabu.PatientInfoWF.CONTACT_INFORMATION + "</legend>";

    $.each(phones, function(index, phone) {

      if(phone.PHONE_TYPE_CD === 0) {
        phone.PHONE_TYPE = i18n.discernabu.PatientInfoWF.PHONE_LABEL_OTHER;
      }

      contactInfoDiv += "<div class='" + compNS + "-wrapper'>" +
                          "<span class='" + compNS + "-label'>" + phone.PHONE_TYPE + ":</span>" +
                          "<span class='" + compNS + "-display'>" + phone.PHONE_NUM + "</span>" +
                          "<div class='clear-fix'></div>" +
                        "</div>";
    });

    $.each(emails, function(index, email) {
      contactInfoDiv += "<div class='" + compNS + "-wrapper'>" +
                          "<span class='" + compNS + "-label'>" + i18n.discernabu.PatientInfoWF.EMAIL + ":</span>" +
                          "<span class='" + compNS + "-display'>" + email.EMAIL + "</span>" +
                          "<div class='clear-fix'></div>" +
                        "</div>";
    });
    this.count += 1;
    return contactInfoDiv +
            "<div class='" + compNS + "-wrapper'>" +
                "<span class='" + compNS + "-label'>" + i18n.discernabu.PatientInfoWF.PREFERRED + ":</span>" +
                "<span class='" + compNS + "-display'>" + this.getDisplay(contactInfo.PREFERRED_METHOD_OF_CONTACT) + "</span>" +
                "<div class='clear-fix'></div>" +
            "</div>" +
          "</fieldset>";
  }
};

PatientInfoWF.prototype.getEmergencyContactsDiv = function(emergencyContacts, componentId, compNS) {
  var component = this;
  if(component.getEmergencyContactInd() !== 1) {
    return "";
  } else if(emergencyContacts.length === 0) {
    this.count += 1;
    return "<fieldset id='" + componentId + "' class='" + compNS + "-fieldset'>" +
              "<legend class='" + compNS + "-legend'>" + i18n.discernabu.PatientInfoWF.EMERGENCY_CONTACT + "</legend>" +
              component.getNoResultsDiv() +
            "</fieldset>";
  } else {
    var emergencyContactsDiv = "<fieldset id='" + componentId + "' class='" + compNS + "-fieldset'>" +
                                "<legend class='" + compNS + "-legend'>" + i18n.discernabu.PatientInfoWF.EMERGENCY_CONTACT + "</legend>";

    $.each(emergencyContacts, function(index, emergencyContact) {
      emergencyContactsDiv += "<div class='" + compNS + "-holder'>" +
                                "<div class='" + compNS + "-wrapper'>" +
                                  "<span class='" + compNS + "-label'>" + i18n.discernabu.PatientInfoWF.NAME + ":</span>" +
                                  "<span class='" + compNS + "-display'>" + emergencyContact.NAME + "</span>" +
                                  "<div class='clear-fix'></div>" +
                                "</div>" +
                                "<div class='" + compNS + "-wrapper'>" +
                                  "<span class='" + compNS + "-label'>" + i18n.discernabu.PatientInfoWF.RELATIONSHIP + ":</span>" +
                                  "<span class='" + compNS + "-display'>" + component.getDisplay(emergencyContact.RELATIONSHIP_TO_PERSON) + "</span>" +
                                  "<div class='clear-fix'></div>" +
                                "</div>";

      var contact = emergencyContact.CONTACT_PHONE || [];
      $.each(contact, function(pIndex, phone) {

        if(phone.PHONE_TYPE_CODE === 0) {
        phone.PHONE_TYPE = i18n.discernabu.PatientInfoWF.PHONE_LABEL_OTHER;
        }

        emergencyContactsDiv += "<div class='" + compNS + "-wrapper'>" +
                                  "<span class='" + compNS + "-label'>" + phone.PHONE_TYPE + ":</span>" +
                                  "<span class='" + compNS + "-display'>" + phone.PHONE_NUMBER + "</span>" +
                                  "<div class='clear-fix'></div>" +
                                "</div>";
      });
      emergencyContactsDiv += "</div>";
    });
    this.count += 1;
    return emergencyContactsDiv + "</fieldset>";
  }
};

PatientInfoWF.prototype.getHealthPlansDiv = function(healthPlans, component) {
  var compNS = component.getStyles().getNameSpace();
  var componentId = component.getComponentId();
  if(component.getHealthPlansInd() !== 1) {
    return "";
  } else if(healthPlans.length === 0) {
    this.count += 1;
    return "<fieldset id='" + componentId + "' class='" + compNS + "-fieldset'>" +
              "<legend class='" + compNS + "-legend'>" + i18n.discernabu.PatientInfoWF.HEALTH_PLANS + "</legend>" +
              component.getNoResultsDiv() +
            "</fieldset>";
  } else {
    var healthPlansDiv = "<fieldset id='" + componentId + "' class='" + compNS + "-fieldset'>" +
                          "<legend class='" + compNS + "-legend'>" + i18n.discernabu.PatientInfoWF.HEALTH_PLANS + "</legend>";

    $.each(healthPlans, function(index, healthPlan) {
      healthPlansDiv += "<div class='" + compNS + "-holder'>" +
                          "<div class='" + compNS + "-wrapper'>" +
                            "<span class='" + compNS + "-label'>" + component.getPriorityDisplay(healthPlan.PRIORITY) + ":</span>" +
                            "<div class='" + compNS + "-hp-wrapper'>" +
                              "<ul>" +
                                "<li>" + healthPlan.PLAN_TYPE + "</li>" +
                                "<li>" + healthPlan.PLAN_NAME + "</li>" +
                                "<li>" + healthPlan.PLAN_NUMBER + "</li>" +
                              "</ul>" +
                            "</div>" +
                            "<div class='clear-fix'></div>" +
                          "</div>" +
                        "</div>";
    });

    return healthPlansDiv + "</fieldset>";
  }
};

PatientInfoWF.prototype.getStickyNoteText = function(note) {
  if(note.LONG_NOTE_TEXT === "") {
    return note.NOTE_TEXT;
  } else {
    return note.LONG_NOTE_TEXT;
  }
};

PatientInfoWF.prototype.getDisplay = function(text) {
  if(text === "") {
    return i18n.discernabu.PatientInfoWF.NO_DATA;
  } else {
    return text;
  }
};

PatientInfoWF.prototype.getPriorityDisplay = function(priority) {
  switch(priority) {
    case 1:
      return i18n.discernabu.PatientInfoWF.PRIMARY;
    case 2:
      return i18n.discernabu.PatientInfoWF.SECONDARY;
    case 3:
      return i18n.discernabu.PatientInfoWF.TERTIARY;
    default:
      return i18n.discernabu.PatientInfoWF.OTHER;
  }
};

PatientInfoWF.prototype.getStickyNotesDiv = function(stickyNotes, component) {
  var compNS = component.getStyles().getNameSpace(),
      componentId = component.getComponentId(),
      stickyNotesDiv = "<div id='" + componentId + "StickyNotes" + "' class='" + compNS + "-tab'>";

  if(component.getStickyNotesInd() !== 1) {
    return "";
  } else if(stickyNotes.length === 0) {
    return stickyNotesDiv + component.getNoResultsDiv() + "</div>";
  } else {
    var df = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);

    $.each(stickyNotes, function(index, stickyNote) {
      stickyNotesDiv += "<fieldset id='" + componentId + "' class='" + compNS + "-sn-fieldset'>" +
                          "<legend class='" + compNS + "-legend'>" + df.formatISO8601(stickyNote.NOTE_DATE, mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR) + "</legend>"+
                          "<div class='" + compNS + "-sn-wrapper'>" +
                            "<div class='" + compNS + "-sn-label'>" + stickyNote.NOTE_AUTHOR + ":</div>" +
                            "<div class='" + compNS + "-sn-display'>" + component.getStickyNoteText(stickyNote) + "</div>" +
                          "</div>"+
                          "<div class='clear-fix'></div>" +
                        "</fieldset>";
      if((index + 1) % 3 === 0) { // Add clear-fix after every three sticky notes
        stickyNotesDiv += "<div class='clear-fix'></div>";
      }
    });

    return stickyNotesDiv + "</div>";
  }
};

PatientInfoWF.prototype.getNoResultsDiv = function() {
  return "<div>" +
            "<span class='res-none'>No results found</span>" +
          "</div>";
};

PatientInfoWF.prototype.getMainContainer = function(personInfo) {
  var component = this;
  var compNS = this.getStyles().getNameSpace();
  var componentId = this.getComponentId();
  var mainContainer = "<div id='" + componentId + "MainContainer" + "' class='" + compNS + "-main-container'>" +
                        "<ul class='" + compNS + "-tabs'>" +
                          "<li class='active'>" +
                            "<a class='" + compNS + "-tab-anchor' data-linkref='" + componentId + "PatientInfo" + "'>" + i18n.discernabu.PatientInfoWF.INFORMATION + "</a>" +
                          "</li>";

  if(component.getStickyNotesInd() === 1) {
    mainContainer += "<li>" +
                        "<a class='" + compNS + "-tab-anchor' data-linkref='" + componentId + "StickyNotes" + "'>" +
                          i18n.discernabu.PatientInfoWF.STICKY_NOTES.replace("{count}", personInfo.STICKY_NOTES.length) +
                        "</a>" +
                      "</li>";
  }

  if (component.getEditPatientInfoInd() === 1) {
    mainContainer += "<li class='edit-patient-info'>" +
                        "<a class='" + compNS + "-edit-conv'>" + i18n.discernabu.PatientInfoWF.EDIT_PATIENT_INFO + "</a>" +
                      "</li>";
  }

  mainContainer += "</ul><div class='" + compNS + "-tab-content'>" +
                   "<div id='" + componentId + "PatientInfo" + "' class='" + compNS + "-tab active'>" +
                   component.getAddressesDiv(personInfo.ADDRESSES, componentId, compNS) +
                   component.getContactInfoDiv(personInfo.CONTACT_INFORMATION, componentId, compNS) +
                   component.getEmergencyContactsDiv(personInfo.EMERGENCY_CONTACT_LIST, componentId, compNS);

  if (component.count  > 0 && component.count % 3 === 0) {
    mainContainer += "<div class='clear-fix'></div>";
  }

  mainContainer += component.getHealthPlansDiv(personInfo.HEALTH_PLANS, component);

  mainContainer += "</div>"; // patient container

  mainContainer += component.getStickyNotesDiv(personInfo.STICKY_NOTES, component);

  mainContainer += "<div class='clear-fix'></div>" +
                "</div>" + // tab content
              "</div>"; // main container

  return mainContainer;
};

PatientInfoWF.runConversation = function(taskNumber, patient_id, encntr_org_id) {
  var component = this,
      response = {
        failure: true
      };
  // PMAction API: https://wiki.ucern.com/pages/viewpageattachments.action?pageId=26116576
  function conversation(action, taskNumber, patient_id, encntr_org_id) {
    var conversation;
    if (window.external.DiscernObjectFactory) {
      //PMCONVOVB is the DISPLAY_KEY for the VB based PMAction.dll and PMCONVO is the DISPLAY_KEY for the C# based PMAction.dll.
      conversation = window.external.DiscernObjectFactory("PMCONVO") || window.external.DiscernObjectFactory("PMCONVOVB" );
	}

    if (conversation) {
      conversation.action = action;
      conversation.Task = taskNumber; // Task number determines the conversation to launch
      conversation.Person_ID = patient_id;
      conversation.Organization_ID = encntr_org_id;
      conversation.ConversationHidden = 0;
      conversation.Run();
    }
    return conversation;
  };

  // Action 100 - Add Person
  var conversation = conversation(100, taskNumber,patient_id, encntr_org_id);
  if (conversation) {
    if (conversation.CancelStatus) {
      response = {
        cancel: true
      };
    } else if (conversation.ConversationStatus === 0) {
      response = {
        success: true,
        personId: conversation.GetFieldValue("person.person_id")
      };
    }
  }
  return response;
};

PatientInfoWF.modifyPatientDetails = function(component, encntrOrgId) {
  var pmConvo = PatientInfoWF.runConversation(
    component.getTaskNumber(),
    component.getCriterion().person_id,
    encntrOrgId
  );

  if (pmConvo.success) {
    //trigger the capability timer for edit person
    new CapabilityTimer('CAP:MPG CARE MANAGEMENT PATIENT INFO EDIT PATIENT LINK USED').capture();

    component.retrieveComponentData();
  } else if (pmConvo.failure) {
    alert(i18n.discernabu.PatientInfoWF.PM_ERROR_MSG);
  }
};

PatientInfoWF.prototype.loadFilterMappings = function(){
  this.addFilterMappingObject("WF_PATIENT_INFO_ADDR_IND", {
    setFunction: this.setAddressesInd,
    type: "BOOLEAN",
    field: "FREETEXT_DESC"
  });
  this.addFilterMappingObject("WF_PATIENT_INFO_CONTACT_IND", {
    setFunction: this.setContactInd,
    type: "BOOLEAN",
    field: "FREETEXT_DESC"
  });
  this.addFilterMappingObject("WF_PATIENT_INFO_EMERGENCY_IND", {
    setFunction: this.setEmergencyContactInd,
    type: "BOOLEAN",
    field: "FREETEXT_DESC"
  });
  this.addFilterMappingObject("WF_PATIENT_INFO_HEALTHPLAN_IND", {
    setFunction: this.setHealthPlansInd,
    type: "BOOLEAN",
    field: "FREETEXT_DESC"
  });
  this.addFilterMappingObject("WF_PATIENT_INFO_NOTES_IND", {
    setFunction: this.setStickyNotesInd,
    type: "BOOLEAN",
    field: "FREETEXT_DESC"
  });
  this.addFilterMappingObject("WF_PATIENT_INFO_NOTES_TYPES", {
    setFunction: this.setStickyNotesTypes,
    type: "ARRAY",
    field: "PARENT_ENTITY_ID"
  });
  this.addFilterMappingObject("WF_PATIENT_INFO_EDIT_OPTION", {
	setFunction: this.setEditPatientInfoInd,
	type: "BOOLEAN",
	field: "FREETEXT_DESC"
  });
  this.addFilterMappingObject("WF_PATIENT_INFO_CONVERSATION", {
	setFunction: this.setTaskNumber,
	type: "STRING",
	field: "FREETEXT_DESC"
  });
};

PatientInfoWF.prototype.retrieveComponentData = function() {
  var component = this;
  var criterion = component.getCriterion();

  var cclParams = [
                    "^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", component.getAddressesInd(),
                    component.getContactInd(), component.getHealthPlansInd(), component.getEmergencyContactInd(),
                    component.getStickyNotesInd(), MP_Util.CreateParamArray(component.getStickyNotesTypes())
                  ];

  var scriptRequest = new ComponentScriptRequest();
  scriptRequest.setProgramName("MP_GET_PATIENT_INFO_WF");
  scriptRequest.setParameterArray(cclParams);
  scriptRequest.setComponent(component);
  scriptRequest.performRequest();
};

PatientInfoWF.prototype.renderComponent = function(personInfo) {
  var component = this,
      componentId = component.getComponentId(),
      compNS = component.getStyles().getNameSpace(),
      criterion = component.getCriterion(),
      mainContainer = component.getMainContainer(personInfo);

  // Render the component
  component.finalizeComponent(mainContainer);

  // Onclicking any of the tabs
  $("#" + componentId + "MainContainer").find("." + compNS + "-tab-anchor").on("click", function(e) {
    var $selectedTab = $(this),
        selectedTabId = $selectedTab.data("linkref");

    // Hide the other tab contents
    $("#" + selectedTabId).show().siblings().not(".clear-fix").hide();

    // Make the selected tab active, and the other tab inactive
    $selectedTab.parent("li").addClass("active").siblings().removeClass("active");
  });

  // Onclicking the Edit patient info link
  $("#" + componentId + "MainContainer").find("." + compNS + "-edit-conv").on("click", function(e) {
    PatientInfoWF.modifyPatientDetails(component, personInfo.ENCNTR_ORG_ID);

    e.stopImmediatePropagation();
  });
};

MP_Util.setObjectDefinitionMapping("WF_PATIENT_INFO", PatientInfoWF);
