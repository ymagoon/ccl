(function() {
	'use strict';
	describe('A generate communication progress state', function() {
		var StaticProgressState = DWL_Utils.Component.ProgressState.StaticProgressState;
		it('accepts default values', function() {
			var progressState = new StaticProgressState({
				message: 'Some message'
			});
			expect(progressState.hasOwnProperty('message')).toBe(true);
		});
		it('can be constructed without user supplied properties', function() {
			var progressState = new StaticProgressState();
			expect(progressState).toBeDefined();
		});
		it('has a default complete state of false', function() {
			var progressState = new StaticProgressState();
			expect(progressState.complete).toBe(false);
		});
		it('has a complete state that can be overridden', function() {
			var progressState = new StaticProgressState({
				complete: true
			});
			expect(progressState.complete).toBe(true);
		});
	});
	describe('A generate communication ranged progress state', function() {
		var RangedProgressState = DWL_Utils.Component.ProgressState.RangedProgressState;
		it('should have initial state of complete as false', function() {
			var rangedProgressState = new RangedProgressState();
			expect(rangedProgressState.complete).toBe(false);
		});
		describe('ranges', function() {
			var finished = 0,
				total = 10,
				createRangedProgressState = function(finished, total) {
					return new RangedProgressState({
						finished: finished,
						total: total
					});
				};
			it('should allow setting its finished and total properties', function() {
				var rangedProgressState = createRangedProgressState(finished, total);
				expect(rangedProgressState.finished).toEqual(finished);
				expect(rangedProgressState.total).toEqual(total);
			});
			it('should allow incrementing the value of finished', function() {
				var valueToIncrement = 5,
					rangedProgressState = createRangedProgressState(finished, total);
				for (var i = 0; i < valueToIncrement; i++) {
					rangedProgressState.incrementFinished();
				}
				expect(rangedProgressState.finished).toEqual(valueToIncrement);
			});
			it('should NOT increment the value of finished if it\'s more than the total', function() {
				var valueToIncrement = 1,
					rangedProgressState = createRangedProgressState(finished, total);
				for (var i = 0; i < total + valueToIncrement; i++) {
					rangedProgressState.incrementFinished();
				}
				expect(rangedProgressState.finished).toEqual(total);
			});
			it('should set the complete state to true if progress reaches total', function() {
				var rangedProgressState = createRangedProgressState(finished, total);
				for (var i = 0; i < total - 1; i++) {
					rangedProgressState.incrementFinished();
					expect(rangedProgressState.complete).toBe(false);
				}
				// last increment
				rangedProgressState.incrementFinished();
				expect(rangedProgressState.complete).toBe(true);
			});
			it('should trigger a change event when its finished value is incremented', function() {
				var spyOnChange = null,
					rangedProgressState = createRangedProgressState(finished, total);
				for (var i = 0; i < total; i++) {
					spyOnChange = spyOnEvent(rangedProgressState, 'change');
					rangedProgressState.incrementFinished();
					expect('change').toHaveBeenTriggeredOn(rangedProgressState);
					spyOnChange.reset();
				}

				spyOnChange = spyOnEvent(rangedProgressState, 'change');
				rangedProgressState.incrementFinished();
				expect('change').not.toHaveBeenTriggeredOn(rangedProgressState);
				spyOnChange.reset();
			});
		});
	});
})();