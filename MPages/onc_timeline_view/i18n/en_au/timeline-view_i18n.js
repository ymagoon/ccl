if (typeof i18n === 'undefined') { var i18n={}; }
if (typeof i18n.oncology === 'undefined') { i18n.oncology={}; }
i18n.oncology.timeline = {};

i18n.oncology.timeline.view = {
    /* as in, by whom was the response to treatment noted? */
    BY: 'by',
    /* as in, the date the response to treatment was logged. */
    CHARTED_ON: 'Charted on',
    /* as in, "Do you want to remove this date's charted results of [some] monitored vital (e.g. blood pressure, weight, etc.) of this patient?"  */
    REMOVE_RESULTS: 'Remove Results?',
    /* as in, the treatment was ordered as [this name] when it was ordered. */
    ORDERED_AS: 'Ordered As',
	/* as in, to notify that the Bedrock filters are not defined */
	NO_FILTERS_DEFINED:'No data filters defined.',
	/*Hyperlink to provide an ability to show hidden results */
	SHOW_HIDDEN_RESULTS: 'Show hidden results'
};
