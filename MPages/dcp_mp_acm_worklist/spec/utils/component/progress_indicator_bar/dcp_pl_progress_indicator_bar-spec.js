(function() {
	'use strict';
	var ProgressIndicatorBar = DWL_Utils.Component.ProgressIndicatorBar;
	describe('A generate communcation progress indicator bar', function() {
		it('can be created', function() {
			var progressBar = new ProgressIndicatorBar({
				el: sandbox()
			});
			expect(progressBar).toBeDefined();
		});
		it('should accept user supplied properties as its own', function() {
			var customProp = 'some prop',
				progressBar = new ProgressIndicatorBar({
					el: sandbox(),
					someProp: customProp
				});
			expect(progressBar.hasOwnProperty('someProp')).toBe(true);
			expect(progressBar.someProp).toEqual(customProp);
		});
		it('can contain progress indicator(s)', function() {
			var progressIndicator1 = {},
				progressIndicator2 = {},
				progressBar = new ProgressIndicatorBar({
					el: sandbox()
				})
				.addIndicators([progressIndicator1, progressIndicator2]);
			expect(progressBar.getIndicators()).toContain(progressIndicator1);
			expect(progressBar.getIndicators()).toContain(progressIndicator2);
		});
		describe('render function', function() {
			it('should render itself onto its el', function() {
				var progressBar = new ProgressIndicatorBar({
						el: sandbox()
					})
					.addIndicators([{
						el: $('<div>', {
							text: 'some text'
						})
					}]);
				$(progressBar.el).empty();
				progressBar.render();
				expect(progressBar.el).not.toBeEmpty();
			});
			it('should add its default class to its el', function() {
				var progressBar = new ProgressIndicatorBar({
					el: sandbox()
				});
				$(progressBar.el).removeClass();

				progressBar.render();
				expect(progressBar.el).toHaveClass(progressBar.cssClasses.progressIndicatorBar);
			});
			it('should add custom class name if it was provided', function() {
				var defaultClass = new ProgressIndicatorBar({
						el: sandbox()
					}).cssClasses.progressIndicatorBar,
					customClass = 'customClass',
					progressBar = new ProgressIndicatorBar({
						el: sandbox(),
						cssClasses: {
							progressIndicatorBar: customClass
						}
					});
				$(progressBar.el).removeClass();

				progressBar.render();
				expect(progressBar.el).toHaveClass(customClass);
				expect(progressBar.el).not.toHaveClass(defaultClass);
			});
			it('should add css classes with regards to how many indicators it has when indicators are added one by one', function() {
				var i = null,
					numberOfChildrenToAdd = 3,
					progressBar = new ProgressIndicatorBar({
						el: sandbox()
					});
				for (i = 1; i <= numberOfChildrenToAdd; i++) {
					progressBar.addIndicators([{
						el: $('<div>')
					}]);
				}
				expect(progressBar.el).toHaveClass(progressBar.cssClasses.progressIndicatorBar);
				expect(progressBar.el).toHaveClass(progressBar.cssClassChildCountPrefix + numberOfChildrenToAdd);
			});
			it('should add css classes with regards to how many indicators it has when indicators are added all at once', function() {
				var defaultPrefix = new ProgressIndicatorBar({
						el: sandbox()
					}).cssClassChildCountPrefix,
					progressBar = new ProgressIndicatorBar({
						el: sandbox()
					});
				progressBar.addIndicators([{
					el: $('<div>')
				}, {
					el: $('<div>')
				}, {
					el: $('<div>')
				}]);
				expect(progressBar.el).toHaveClass(defaultPrefix + progressBar.getIndicators().length);
			});
			describe('for tooltip', function() {
				var tooltipMessage = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.';
				it('should add a tooltip to the progress indicator if tooltipMessage was passed during construction', function() {
					var progressBar = new ProgressIndicatorBar({
						el: sandbox(),
						tooltipMessage: tooltipMessage
					});
					spyOn($.fn, 'tooltip').and.callThrough();

					progressBar.render();
					expect($.fn.tooltip).toHaveBeenCalledWith({
						content: tooltipMessage,
						track: true,
						tooltipClass: progressBar.cssClasses.tooltip
					});
				});
				it('should add all the user supplied classes to the tooltip', function() {
					var tooltipClass = 'class1',
						progressBar = new ProgressIndicatorBar({
							el: sandbox(),
							tooltipMessage: tooltipMessage,
							cssClasses: {
								tooltip: tooltipClass
							}
						});
					spyOn($.fn, 'tooltip').and.callThrough();

					progressBar.render();
					expect($.fn.tooltip).toHaveBeenCalledWith({
						content: tooltipMessage,
						track: true,
						tooltipClass: tooltipClass
					});
				});
				it('should NOT add a tooltip to the progress indicator if tooltipMessage was NOT passed during construction ', function() {
					var progressBar = new ProgressIndicatorBar({
							el: sandbox()
						})
						.render();
					expect($(progressBar.el).tooltip('instance')).not.toBeDefined();
				});
				it('should NOT add a tooltip to the progress indicator if null tooltipMessage was passed during construction ', function() {
					var progressBar = new ProgressIndicatorBar({
							el: sandbox(),
							tooltipMessage: null
						})
						.render();
					expect($(progressBar.el).tooltip('instance')).not.toBeDefined();
				});
			});
		});
		describe('remove function', function() {
			it('should remove all of its indicators and lose reference to its el', function() {
				var spyIndicator1 = jasmine.createSpyObj('indicator1', ['remove']),
					spyIndicator2 = jasmine.createSpyObj('indicator2', ['remove']),
					progressIndicators = [
						spyIndicator1,
						spyIndicator2
					],
					progressBar = new ProgressIndicatorBar({
						el: sandbox()
					})
					.addIndicators(progressIndicators)
					.render();
				expect(progressBar.getIndicators()).toEqual(progressIndicators);
				expect(progressBar.el).toBeDefined();

				progressBar.remove();
				expect(progressBar.getIndicators()).toEqual([]);
				expect(spyIndicator1.remove).toHaveBeenCalled();
				expect(spyIndicator2.remove).toHaveBeenCalled();
				expect(progressBar.el).not.toBeDefined();
			});
		});
	});
})();