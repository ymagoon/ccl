(function() {
	'use strict';
	describe('dcp_pl_driver', function() {
		window.m_criterionJSON = Mock.Common.CRITERION;
		window.m_patientlists = Mock.Common.PATIENTLISTS;

		describe('RenderDCPPatientList', function() {
			it('should not throw an error', function() {
				var fn = function() {
					RenderDCPPatientList();
				};
				expect(fn).not.toThrow();
			});

			it('should create the controller', function() {
				RenderDCPPatientList();
				expect(typeof window.m_controller).toBe('object');
			});
		});
	});
})();
