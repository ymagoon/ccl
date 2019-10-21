/* global CommunicationEventsDateTimeValidator */

function CommunicationEventsValidator(formId, component){
  this.formId = formId;
  this.component = component;
  this.$role = $('#' + formId + ' select[name="role"]');
  this.$method = $('#' + formId + ' select[name="method"]');
  this.$outcome = $('#' + formId + ' select[name="outcome"]');
  this.$duration = $('#' + formId + ' input[name="duration"]');
  this.$type = $('#' + formId + ' input[name="typeRadio"]');

  this.registerEvents();
}

CommunicationEventsValidator.prototype.registerEvents = function() {
  var validator = this;
  var formId = validator.formId;

  this.$role.on('change blur', function() {
    validator.validateRole();
    validator.component.resizeSidePanel();
  });

  this.$method.on('change blur', function() {
    validator.validateMethod();
    validator.component.resizeSidePanel();
  });

  this.$outcome.on('change blur', function() {
    validator.validateOutcome();
    validator.component.resizeSidePanel();
  });

  this.$type.on('change blur', function() {
    validator.validateType();
    validator.component.resizeSidePanel();
  });

  $('#' + this.formId + ' .date-input, ' + '#' + formId + ' .time-input').on('change blur', function() {
    var dateTimeValidator = new CommunicationEventsDateTimeValidator(validator.formId, validator.component);
    dateTimeValidator.validate();
    validator.component.resizeSidePanel();
  });

  // propertychange is for older browsers that does on support on input.
  this.$duration.on('propertychange input blur', function() {
    validator.validateDuration();
  });
};

CommunicationEventsValidator.prototype.isFormValid = function() {
  var validator = this;
  var isRoleValid = validator.validateRole();
  var isMethodValid = validator.validateMethod();
  var isOutcomeValid = validator.validateOutcome();
  var isTypeValid = validator.validateType();

  var dateTimeValidator = new CommunicationEventsDateTimeValidator(validator.formId, validator.component);
  validator.component.resizeSidePanel();

  return isRoleValid && isTypeValid && isOutcomeValid && isMethodValid && dateTimeValidator.validate();
};

CommunicationEventsValidator.prototype.validateRole = function() {
  return this.checkForEmptyValueAndAddError(this.$role, 'role');
};

CommunicationEventsValidator.prototype.validateMethod = function() {
  return this.checkForEmptyValueAndAddError(this.$method, 'method');
};

CommunicationEventsValidator.prototype.validateOutcome = function() {
  return this.checkForEmptyValueAndAddError(this.$outcome, 'outcome');
};

CommunicationEventsValidator.prototype.validateType = function() {
  return this.checkForEmptyValueAndAddErrorForRadio(this.$type, 'type');
};

CommunicationEventsValidator.prototype.checkForEmptyValueAndAddError = function(inputElement, errorLabelId) {
  if (inputElement.val() === '') {
    if ($('#' + this.formId + ' #' + errorLabelId).length === 0) {
      inputElement.addClass('error-input comm-event-required');
      var i18nFieldRequired = i18n.discernabu.communication_events_o1.FIELD_REQUIRED;
      if (inputElement.is(':visible')) {
        $('<div id="' + errorLabelId + '" class="required-error">' + i18nFieldRequired + '</div>').insertAfter(inputElement);
      }
    }
    return false;
  }
  else {
    inputElement.removeClass('error-input comm-event-required');
    $('#' + this.formId + ' #' + errorLabelId).remove();
    return true;
  }
};

CommunicationEventsValidator.prototype.checkForEmptyValueAndAddErrorForRadio = function(inputElement, errorLabelId) {
  if (!inputElement.is(':checked') && inputElement.is(':visible')) {
    if ($('#' + this.formId + ' #' + errorLabelId).length === 0) {
      $('#' + this.formId + ' span[name="type"]').addClass('error-input comm-event-required');
      var i18nFieldRequired = i18n.discernabu.communication_events_o1.FIELD_REQUIRED;
      $('<div id="' + errorLabelId + '" class="required-error">' + i18nFieldRequired + '</div>').insertAfter($('#' + this.formId + ' span[name="type"]'));
    }
    return false;
  }
  else {
    $('#' + this.formId + ' span[name="type"]').removeClass('error-input comm-event-required');
    $('#' + this.formId + ' #' + errorLabelId).remove();
    return true;
  }
};

CommunicationEventsValidator.prototype.validateDuration = function() {
  var $duration = this.$duration;
  var numbersOnlyRegex = i18n.discernabu.communication_events_o1.NUMBERS_ONLY_REGEX;
  var validator = this;

  // We need to unbind the propertychange event for ie8 because we are changing the the value of
  // the input field below which results to firing the propertychange event which goes into and infinite loop
  // and ends up in stack overflow error. We need to register it once again after the regex validation is done.
  $duration.off('propertychange');

  $duration.val($duration.val().replace(numbersOnlyRegex, ''));

  $duration.on('propertychange', function(){
    validator.validateDuration();
  });
};