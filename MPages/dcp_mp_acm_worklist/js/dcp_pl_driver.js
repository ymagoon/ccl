function RenderDCPPatientList(){
	'use strict';
	try {
		var js_criterion = json_parse(m_criterionJSON);
		var js_patientlists = json_parse(m_patientlists);

		window.m_controller = new ACM_Controller();
		window.onerror = function(message,file,lineNumber) {
			m_controller.logErrorMessages('',message + ' ' + file + ' ' + lineNumber,'');
		};
		window.oPvFrameworkLink = window.external.DiscernObjectFactory('PVFRAMEWORKLINK') || null;
		window.oPvGenerateCommunications = window.external.DiscernObjectFactory('PVGENERATECOMMUNICATIONS') || null;

		m_controller.fnLogCapabilityTimer('CAP:MPG DWL Launch MPage');

		if('MPAGESOVERRIDEREFRESH' in window.external){
			window.OnRefresh = m_controller.notifyDiscernRefresh;
			window.external.MPAGESOVERRIDEREFRESH('OnRefresh()');
		}

		m_controller.setData(js_criterion, js_patientlists);
		m_controller.initialize();
	}
	catch (err) {
		m_controller.logErrorMessages('',JSON.stringify(err), 'RenderDCPPatientList');
	}
}
