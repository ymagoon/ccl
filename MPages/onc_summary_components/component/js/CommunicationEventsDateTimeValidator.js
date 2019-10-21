function CommunicationEventsDateTimeValidator(formId, component){
  this.formId = formId;
  this.component = component;
  this.$date = $('#' + formId + ' .date-input');
  this.$time = $('#' + formId + ' .time-input');
  this.$dateErrorInsert = $('#' + this.formId + ' .ui-datepicker-trigger');
  this.$timeErrorInsert = $('#' + this.formId + ' .wfHcmCommEvents-clock-icon');
}

CommunicationEventsDateTimeValidator.prototype.validate = function() {
  this.destroyAlerts();

  var isDateAcceptable = this.isDateFilled() && this.isDateValid();
  var isTimeAcceptable = this.isTimeFilled() && this.isTimeValid();

  return isDateAcceptable && this.isNotFutureDate() && isTimeAcceptable && this.isNotFutureTime();
};

CommunicationEventsDateTimeValidator.prototype.isDateFilled = function() {
  return this.checkForEmptyFieldAndAddError(this.$date, this.$dateErrorInsert);
};

CommunicationEventsDateTimeValidator.prototype.isTimeFilled = function() {
  return this.checkForEmptyFieldAndAddError(this.$time, this.$timeErrorInsert);
};

CommunicationEventsDateTimeValidator.prototype.checkForEmptyFieldAndAddError = function($inputElement, $insertElement) {
  if ($inputElement.val()) {
    return true;
  }
  else {
    this.addErrorAlert($inputElement, this.component.i18n.FIELD_REQUIRED, $insertElement);
    return false;
  }
};

CommunicationEventsDateTimeValidator.prototype.isDateValid = function() {
  return this.checkForInvalidDateAndAddError(this.$date.val());
};

CommunicationEventsDateTimeValidator.prototype.isTimeValid = function() {
  return this.checkForInvalidTimeAndAddError(this.$time.val());
};

CommunicationEventsDateTimeValidator.prototype.checkForInvalidDateAndAddError = function(dateStr) {
  if (this.component.i18n.DATE_REGEX.test(dateStr)) {
    return true;
  }
  else {
    this.addErrorAlert(this.$date, this.component.i18n.DATE_FORMAT_ERROR + '<i>' + this.component.i18n.DATE_FORMAT + '</i>.', this.$dateErrorInsert);
    return false;
  }
};

CommunicationEventsDateTimeValidator.prototype.checkForInvalidTimeAndAddError = function(timeStr) {
  var t = timeStr.split(':');
  var isTimeValid = (this.component.i18n.TIME_REGEX1.test(timeStr) || this.component.i18n.TIME_REGEX2.test(timeStr)) &&
                t[0] >= 0 && t[0] < 24 &&
                t[1] >= 0 && t[1] < 60;

  if (isTimeValid) {
    return true;
  }
  else {
    this.addErrorAlert(this.$time, this.component.i18n.TIME_FORMAT_ERROR + '<i>' + this.component.i18n.TIME_ERROR + '</i>.', this.$timeErrorInsert);
    return false;
  }
};

CommunicationEventsDateTimeValidator.prototype.isNotFutureDate = function() {
  var enteredDate = new Date(this.$date.val());
  return this.checkForFutureDateTimeAndAddError(enteredDate, this.$date, this.$dateErrorInsert);
};

CommunicationEventsDateTimeValidator.prototype.isNotFutureTime = function() {
  var enteredDateTime = new Date(this.$date.val().concat(' ' + this.$time.val()));
  return this.checkForFutureDateTimeAndAddError(enteredDateTime, this.$time, this.$timeErrorInsert);
};

CommunicationEventsDateTimeValidator.prototype.checkForFutureDateTimeAndAddError = function(dateTime, $inputElement, $insertElement) {
  if (dateTime > new Date()) {
    this.addErrorAlert($inputElement, this.component.i18n.FUTURE_DATE_TIME_ERROR, $insertElement);
    return false;
  }
  else {
    return true;
  }
};

CommunicationEventsDateTimeValidator.prototype.addErrorAlert = function($inputElement, alertMsg, $insertElement) {
  $inputElement.addClass('error-input comm-event-required');
  $('<div class="date-time-error required-error">' + alertMsg + '</div>').insertAfter($insertElement);
};

CommunicationEventsDateTimeValidator.prototype.destroyAlerts = function() {
  this.$time.removeClass('error-input comm-event-required');
  this.$date.removeClass('error-input comm-event-required');
  $('#' + this.formId + ' .date-time-error').remove();
};
