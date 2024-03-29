﻿if (typeof i18n === 'undefined') { var i18n={}; }
if (typeof i18n.oncology === 'undefined') { i18n.oncology={}; }
i18n.oncology.timeline = {};

i18n.oncology.timeline.view = {
    /* as in, by whom was the response to treatment noted? */
    BY: 'por',
    /* as in, the date the response to treatment was logged. */
    CHARTED_ON: 'Documentado em',
    /* as in, "Do you want to remove this date's charted results of [some] monitored vital (e.g. blood pressure, weight, etc.) of this patient?"  */
    REMOVE_RESULTS: 'Remover resultados?',
    /* as in, the treatment was ordered as [this name] when it was ordered. */
    ORDERED_AS: 'Prescrito como',
	/* as in, to notify that the Bedrock filters are not defined */
	NO_FILTERS_DEFINED:'Nenhum filtro de dados definido.',
	/*Hyperlink to provide an ability to show hidden results */
	SHOW_HIDDEN_RESULTS: 'Exibir resultados ocultados'
	
};
