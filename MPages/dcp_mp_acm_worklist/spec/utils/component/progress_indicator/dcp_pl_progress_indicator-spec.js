(function() {
	'use strict';
	var StaticProgressIndicator = DWL_Utils.Component.ProgressIndicator.StaticProgressIndicator,
		RangedProgressIndicator = DWL_Utils.Component.ProgressIndicator.RangedProgressIndicator,
		ProgressIndicatorImage = DWL_Utils.Component.ProgressIndicator.ProgressIndicatorImage;
	describe('A generate communication static progress indicator', function() {
		it('should accept its html element as a default value', function() {
			var container = sandbox(),
				progressIndicator = new StaticProgressIndicator({
					el: container
				});
			expect(progressIndicator.hasOwnProperty('el')).toBe(true);
			expect(progressIndicator.el).toBe(container);
		});
		it('should tell if a given state is renderable by it', function() {
			var renderableState = {
					message: 'some message'
				},
				unRenderableState = {},
				progressIndicator = new StaticProgressIndicator({
					el: sandbox()
				});
			expect(progressIndicator.canRender(renderableState)).toBe(true);
			expect(progressIndicator.canRender(unRenderableState)).toBe(false);
		});
		describe('render function', function() {
			describe('without minimum state', function() {
				it('should not be invoked if a progress indicator does not have minimum state', function() {
					var progressIndicator = new StaticProgressIndicator({
						el: sandbox()
					});
					expect(progressIndicator.el).toBeEmpty();
					expect(progressIndicator.render().el).toBeEmpty();
				});
			});
			describe('with state', function() {
				var expectedText = 'some message',
					minimumState = {
						message: expectedText
					},
					cssClasses = 'someclass anotherclass';
				it('should render the progress indicator message onto its html element', function() {
					var progressIndicator = new StaticProgressIndicator({
							el: sandbox()
						})
						.transition(minimumState);
					expect(progressIndicator.render().el).toContainText(expectedText);
				});
				it('should render the image', function() {
					var progressIndicatorImgPath = 'images/6457_up_darkBG_16.png',
						progressIndicator = new StaticProgressIndicator({
							el: sandbox(),
							img: new ProgressIndicatorImage({
								path: progressIndicatorImgPath
							})
						})
						.transition(minimumState)
						.render();
					expect(progressIndicator.el).toContainElement('img[src="' + progressIndicatorImgPath + '"]:first-child');
				});
				describe('and CSS classes', function() {
					it('should assign default values for classes if none are provided', function() {
						var progressIndicator = new StaticProgressIndicator({
								el: sandbox(),
								img: new ProgressIndicatorImage({
									path: 'some path'
								})
							})
							.transition(minimumState)
							.render();
						expect(progressIndicator.el).toHaveClass('progressIndicator');
						expect(progressIndicator.el).toContainElement('.progressIndicatorImage');
						expect(progressIndicator.el).toContainElement('.progressIndicatorMessage');
					});
					it('should set the classes passed in during construction as its element\'s html class names', function() {
						var progressIndicator = new StaticProgressIndicator({
								el: sandbox(),
								cssClasses: {
									progressIndicator: cssClasses
								}
							})
							.transition(minimumState)
							.render();
						expect(progressIndicator.el).toHaveClass(cssClasses);
					});
					it('should set the css classes specified by its progress state', function() {
						var progressStateCssClass = 'progressStateCss',
							progressIndicator = new StaticProgressIndicator({
								el: sandbox()
							})
							.transition($.extend({}, minimumState, {
								cssClasses: progressStateCssClass
							}))
							.render();
						expect(progressIndicator.el).toHaveClass(progressStateCssClass);
					});
				});
			});
		});
		describe('transition function', function() {
			it('should bind a state to the progress indicator', function() {
				var state = {},
					progressIndicator = new StaticProgressIndicator({
						el: sandbox()
					});
				progressIndicator.transition(state);
				expect(progressIndicator.getCurrentState()).toBe(state);
			});
			it('should discard the old state when given a new state', function() {
				var oldState = {},
					newState = {},
					progressIndicator = new StaticProgressIndicator({
						el: sandbox()
					});
				progressIndicator.transition(oldState);
				expect(progressIndicator.getCurrentState()).toBe(oldState);

				progressIndicator.transition(newState);
				expect(progressIndicator.getCurrentState()).not.toBe(oldState);
				expect(progressIndicator.getCurrentState()).toBe(newState);
			});
		});
		describe('remove function', function() {
			describe('when stateless', function() {
				it('should remove dom element and its reference', function() {
					var container = sandbox(),
						progressIndicator = new StaticProgressIndicator({
							el: container
						});
					expect(progressIndicator.el).toBeDefined();

					progressIndicator.remove();
					expect(progressIndicator.el).not.toBeDefined();
				});
			});
			describe('when stateful', function() {
				it('should remove dom element, its reference and its current state', function() {
					var container = sandbox(),
						message = 'some message',
						minimumState = {
							message: message
						},
						progressIndicator = new StaticProgressIndicator({
							el: container
						})
						.transition(minimumState)
						.render();
					expect(progressIndicator.getCurrentState()).not.toBeNull();
					expect(progressIndicator.el).toBeDefined();

					progressIndicator.remove();
					expect(progressIndicator.getCurrentState()).toBeNull();
					expect(progressIndicator.el).not.toBeDefined();
				});
			});
		});
	});
	describe('A generate communication ranged progress indicator', function() {
		it('should tell if a given state is renderable by it', function() {
			var renderableState = {
					message: 'some message',
					finished: 1,
					total: 1000
				},
				unRenderableState = {},
				progressIndicator = new RangedProgressIndicator({
					el: sandbox()
				});
			expect(progressIndicator.canRender(renderableState)).toBe(true);
			expect(progressIndicator.canRender(unRenderableState)).toBe(false);
		});
		describe('render function', function() {
			var state = {
				finished: 2222,
				total: 9999,
				message: 'some message'
			};
			it('should be triggered when it\'s state emits a change event', function() {
				var rangedProgressIndicator = new RangedProgressIndicator({
					el: sandbox()
				});
				rangedProgressIndicator.transition(state);
				$(rangedProgressIndicator.el).empty();

				$(state).trigger('change');
				expect(rangedProgressIndicator.el).not.toBeEmpty();
			});
			it('should display the ranged progress of its state', function() {
				var rangedProgressIndicator = new RangedProgressIndicator({
						el: sandbox()
					}),
					expectedText = i18n.rwl.progressxOfY.replace('{45}', state.finished).replace('{46}', state.total);
				rangedProgressIndicator.transition(state);
				$(rangedProgressIndicator.el).empty();

				expect(rangedProgressIndicator.render().el).toContainText(expectedText);
			});
			it('should assign default values for classes if none are provided', function() {
				var rangedProgressIndicator = new RangedProgressIndicator({
						el: sandbox(),
						img: new ProgressIndicatorImage({
							path: 'some path'
						})
					})
					.transition(state)
					.render();
				expect(rangedProgressIndicator.el).toHaveClass(rangedProgressIndicator.cssClasses.progressIndicator);
				expect(rangedProgressIndicator.el).toContainElement('.' + rangedProgressIndicator.img.cssClasses);
				expect(rangedProgressIndicator.el).toContainElement('.' + rangedProgressIndicator.cssClasses.indicatorMessage);
				expect(rangedProgressIndicator.el).toContainElement('.' + rangedProgressIndicator.cssClasses.indicatorRange);
			});
		});
		describe('transition function', function() {
			it('should stop listening to changes on the old state after transitioning to a new state', function() {
				var oldState = {},
					newState = {},
					rangedProgressIndicator = new RangedProgressIndicator({
						el: sandbox()
					});

				rangedProgressIndicator.transition(oldState);
				expect($._data(oldState, 'events')).toBeDefined();

				rangedProgressIndicator.transition(newState);
				expect($._data(oldState, 'events')).not.toBeDefined();
				expect($._data(newState, 'events')).toBeDefined();
			});
		});
		describe('remove function', function() {
			describe('when stateless', function() {
				it('should remove dom element and its reference', function() {
					var progressIndicator = new RangedProgressIndicator({
							el: sandbox()
						});
					expect(progressIndicator.el).toBeDefined();

					progressIndicator.remove();
					expect(progressIndicator.el).not.toBeDefined();
				});
			});
			describe('when stateful', function() {
				it('should remove dom element, its reference and its current state', function() {
					var message = 'some message',
						minimumState = {
							message: message
						},
						progressIndicator = new RangedProgressIndicator({
							el: sandbox()
						})
						.transition(minimumState)
						.render();
					expect(progressIndicator.getCurrentState()).not.toBeNull();
					expect($._data(minimumState, 'events')).toBeDefined();
					expect(progressIndicator.el).toBeDefined();

					progressIndicator.remove();
					expect($._data(minimumState, 'events')).not.toBeDefined();
					expect(progressIndicator.getCurrentState()).toBeNull();
					expect(progressIndicator.el).not.toBeDefined();
				});
			});
		});
	});
})();