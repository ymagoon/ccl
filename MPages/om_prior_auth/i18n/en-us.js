function _i18nData(){return {
	"app" : {
		"modules" : {
			"demographics" : {
				"MRN" : "MRN"
			},
			"questionSet" : {
				"phone" : "Phone",
				"save" : "Save",
        "submit": "Submit",
        "resubmit":  "Resubmit",
				"submittedQuestionSets" : "Submitted Question Sets",
				"optionalAdditionalText" : "Optional Additional Text",
				"requiredAdditionalText" : "Required Additional Text",
				"loadError" : "Prior authorization form failed to load. Please contact your system administrator.",
				"allFieldsRequired": "All fields required unless otherwise indicated.",
				"formLocked": "This form is currently being worked on by another user. Saving this form may overwrite their changes.",
				"formLockedBy": "This form is currently being worked on by __lockOwnerName__. Saving this form may overwrite their changes.",
				"breakLock": "Continue",
				"fileSizeExceeded": "(Exceeds file size limit of 7 MB by __overage__)",
        "icd10": "Enter ICD10 code.",
        "validateNumberMessage": "Please enter a valid number.",
        "validateICD10Message": "Please enter a diagnosis code in the appropriate ICD10 format (example: E11.311).",
        "validateDateMessage": "Please enter a date in mm/dd/yyyy format.",
        "validateDateTimeMessage": "Please enter a date and time in mm/dd/yyyy HH:MM format.",
        "submitError": "An error occurred when submitting the prior authorization to the __responsibleParty__. Contact your system administrator and resubmit the form once the error is resolved.",
        "rxHub": "Cerner ePrescribing Hub",
        "FSI": "prior authorization interface",
        "externalSystem": "external system",
        "unknown": "unknown",
        "spaceRemaining": "__spaceUsed__ (__spaceUsedPercentage__) of 14 MB used"
			},
			"priorAuthorizationDetails" : {
				"paNote" : "Prior Authorization Note",
				"paCaseIdentifier" : "Prior Authorization Case Identifier",
				"expirationDateTime" : "Expiration date/time",
				"appealNote" : "Appeal note",
				"appeal" : "Appeal",
				"authorization" : "Authorization",
				"authorizationNumber" : "Authorization number",
				"authorizationPeriod" : "Authorization Period",
				"effectiveDateTime" : "Effective date/time",
				"authorizationDetails" : "Authorization Details",
				"pharmacyType" : "Pharmacy type",
				"daysSupply" : "Days supply",
				"noOfCycles" : "Number of cycles",
				"noOfRefills" : "Number of refills",
				"quantity" : "Quantity",
				"note" : "Note",
				"denied" : "Denied",
				"inprogress" : "In Progress",
				"notStarted" : "Not Started",
				"approved" : "Approved",
				"submitted" : "Submitted",
				"cancel" : "Canceled",
				"deferred": "Deferred",
				"error": "Error",
				"closed": "Closed",
				"infoNeeded": "Info Needed"
			},
			"errors" : {
				"errorOccurred" : "Error Occurred",
				"ok" : "OK",
				"yes" : "Yes",
				"no" : "No",
				"continue" : "Continue",
				"formAlreadyUpdatedMessage" : "The form cannot be saved or submitted because it has been updated by another user.",
				"reload" : "Click continue to reload the form.",
				"internalError" : "An internal error occurred.",
				"internalErrorDescription" : "Please contact your system administrator.",
				"deadlinePassed" : "Prior authorization submission deadline has elapsed.",
				"deadlinePassedDescription" : "Please initiate a new Prior Authorization request.",
				"unsavedChanges" : "You have unsaved changes on the form.",
				"areYouSure" : "Do you want to save the changes before closing ?",
				"sessionExpired" : "Your session has expired."
			},
      "priorAuthorizationInfoText": {
        "formDeadlinePassed": "The submission deadline of __formattedDeadline__ has passed. Please cancel this prior authorization and initiate a new prior authorization."
      },
      "attachments": {
        "loading": "Loading...",
        "noClinDocsFound": "No Documents Found",
        "noCammsFound": "No PDFs or Images Found in CAMM",
        "generation": {
          "successful": "PDF generation successful",
          "failed": "PDF generation not successful",
          "partial": "PDF generation partially successful",
          "inprogress": "Generating PDF"
        },
        "inboundAttachment": "Included Attachment:",
        "of": "of ",
        "getBetterTiffs": "The image attached is corrupted or could not be displayed.",
        "all": "All",
        "cammServerIsDown": "CAMM Server is down."
      }
		},
		"inboundAttachments" : {
			"attachmentTitle" : "View Attachments"
		}
	}
}
;}