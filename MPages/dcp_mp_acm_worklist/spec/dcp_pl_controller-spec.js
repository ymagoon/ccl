(function() {
	'use strict';
	describe('dcp_pl_controller', function() {
		describe('ACM_Controller', function() {
			it('can be created', function() {
				var oController = new ACM_Controller();
				expect(oController).toBeDefined();
			});
			describe('get summary string of health maintencance filter', function() {
				it('should return summary string of a health maintenance filter', function() {
					var expectations=['expectation1','expectation2'];
					var statuses=['status1','status2'];
					expect(new ACM_Controller().setSummaryContent(expectations,statuses)).toEqual('expectation1 is status1 or status2 OR expectation2 is status1 or status2');
				});

			});
		});
	});
})();
