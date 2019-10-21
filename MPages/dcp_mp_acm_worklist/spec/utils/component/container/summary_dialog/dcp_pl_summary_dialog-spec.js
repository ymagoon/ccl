(function() {
	'use strict';
	var SummaryDialog = DWL_Utils.Component.SummaryDialog,
		NotifyingSummaryDialog = DWL_Utils.Component.NotifyingSummaryDialog,
		GenCommSummaryDialog = DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog,
		SingleProcessSummary = DWL_Utils.Component.GenCommSummary.SingleProcessSummary,
		O_PROPS_WITH_INITIAL_STATE = {
			oInitialState: {
				sSomeProp: 'some val'
			}
		},
		fnCreateMockComponents = function() {
			var $header = $('<div></div>'),
				$body = $('<div></div>'),
				$footer = $('<div></div>');
			return {
				oHeader: {
					oEl: $header,
					fnRender: jasmine.createSpy('fnRenderSpy').and.returnValue({
						oEl: $header
					})
				},
				oBody: {
					oEl: $body,
					fnRender: jasmine.createSpy('fnRenderSpy').and.returnValue({
						oEl: $body
					})
				},
				oFooter: {
					oEl: $footer,
					fnRender: jasmine.createSpy('fnRenderSpy').and.returnValue({
						oEl: $footer
					})
				}
			};
		};
	describe('A summary dialog', function() {
		it('can be created', function() {
			var oSummaryDialog = new SummaryDialog($.extend({}, O_PROPS_WITH_INITIAL_STATE, {
				oComponents: fnCreateMockComponents()
			}));
			expect(oSummaryDialog instanceof SummaryDialog).toBe(true);
		});
		it('exposes a property that a user can listen for the end of the dialog\'s lifecycle', function() {
			var oSummaryDialog = new SummaryDialog($.extend({}, O_PROPS_WITH_INITIAL_STATE, {
				oEl: sandbox(),
				oComponents: fnCreateMockComponents()
			}));
			expect(oSummaryDialog.fnAfterCancel).toBeDefined();
		});
		describe('being constructed', function() {
			it('should accept its properties during construction', function() {
				var oStatefulSummaryDialog = new SummaryDialog($.extend({}, O_PROPS_WITH_INITIAL_STATE, {
					oComponents: fnCreateMockComponents()
				}));
				expect(oStatefulSummaryDialog.fnGetState()).toEqual(O_PROPS_WITH_INITIAL_STATE.oInitialState);
				expect(oStatefulSummaryDialog.fnGetState().sSomProp).toEqual(O_PROPS_WITH_INITIAL_STATE.oInitialState.sSomProp);
			});
			it('should accept its dom element as one of its properties during construction', function() {
				var oProps = $.extend({}, O_PROPS_WITH_INITIAL_STATE, {
						oEl: sandbox(),
						oComponents: fnCreateMockComponents()
					}),
					oSummaryDialog = new SummaryDialog(oProps);
				expect(oSummaryDialog.hasOwnProperty('oEl')).toBe(true);
				expect(oSummaryDialog.oEl).toBe(oProps.oEl);
			});
		});
		describe('render function', function() {
			it('renders the SummaryDialog onto its el', function() {
				var oProps = $.extend({}, O_PROPS_WITH_INITIAL_STATE, {
						oEl: sandbox(),
						oComponents: fnCreateMockComponents()
					}),
					oSummaryDialog = new SummaryDialog(oProps);
				expect(oSummaryDialog.oEl).toBeEmpty();

				oSummaryDialog.fnRender();
				expect(oSummaryDialog.oEl).not.toBeEmpty();
			});
			it('should render its header, body container, and footer container received as properties during construction', function() {
				var oProps = $.extend({}, O_PROPS_WITH_INITIAL_STATE, {
						oEl: sandbox(),
						oComponents: fnCreateMockComponents()
					}),
					oSummaryDialog = new SummaryDialog(oProps);
				oSummaryDialog.fnRender();
				expect(oSummaryDialog.oEl).toContainElement(oProps.oComponents.oHeader.oEl);
			});
		});
		describe('dialog box shell', function() {
			it('is rendered in the SummaryDialog', function() {
				var oContainer = sandbox(),
					sDialogShellCssClasses = 'summary-dialog-class',
					oProps = $.extend({}, O_PROPS_WITH_INITIAL_STATE, {
						oEl: oContainer,
						oCssClasses: {
							sDialogShell: sDialogShellCssClasses
						},
						oComponents: fnCreateMockComponents()
					}),
					oSummaryDialog = new SummaryDialog(oProps);
				oSummaryDialog.fnRender();
				expect(oContainer).toContainElement('.' + sDialogShellCssClasses);
			});
		});
		describe('header container', function() {
			it('is rendered in the SummaryDialog with classes provided during construction', function() {
				var oContainer = sandbox(),
					sHeaderCssClasses = 'summary-dialog-header-class',
					oProps = $.extend({}, O_PROPS_WITH_INITIAL_STATE, {
						oEl: oContainer,
						oCssClasses: {
							oHeader: {
								sHeaderContainer: sHeaderCssClasses
							}
						},
						oComponents: fnCreateMockComponents()
					}),
					oSummaryDialog = new SummaryDialog(oProps);
				oSummaryDialog.fnRender();
				expect(oContainer).toContainElement('.' + sHeaderCssClasses);
			});
			describe('close button', function() {
				var sCloseCssClasses = 'summary-dialog-close';
				it('hides the dialog element when clicked', function() {
					var sHeaderCssClasses = 'summary-dialog-header',
						$fixture = $('<div></div>'),
						oProps = $.extend({}, O_PROPS_WITH_INITIAL_STATE, {
							oEl: $fixture,
							oCssClasses: {
								oHeader: {
									sHeaderContainer: sHeaderCssClasses,
									sClose: sCloseCssClasses
								}
							},
							oComponents: fnCreateMockComponents()
						}),
						oSummaryDialog = new SummaryDialog(oProps);
					setFixtures($fixture);
					expect(oSummaryDialog.oEl).toBeEmpty();

					oSummaryDialog.fnRender();
					expect(oSummaryDialog.oEl).not.toBeHidden();
					expect(oSummaryDialog.oEl).toContainElement('.' + sCloseCssClasses);

					$('.' + sCloseCssClasses).click();
					expect(oSummaryDialog.oEl).toBeHidden();
				});
				it('calls its onCancel callbacks with its current state', function() {
					var $fixture = $('<div></div>'),
						oProps = $.extend({}, O_PROPS_WITH_INITIAL_STATE, {
							oEl: $fixture,
							oCssClasses: {
								oHeader: {
									sClose: sCloseCssClasses
								}
							},
							oComponents: fnCreateMockComponents()
						}),
						oSummaryDialog = new SummaryDialog(oProps),
						oOnCancelSpy = jasmine.createSpy('lifecycleSpy');
					setFixtures($fixture);
					oSummaryDialog.fnAfterCancel(oOnCancelSpy);
					expect(oOnCancelSpy).not.toHaveBeenCalled();
					oSummaryDialog.fnRender();

					$('.' + sCloseCssClasses).click();
					expect(oOnCancelSpy).toHaveBeenCalledWith(O_PROPS_WITH_INITIAL_STATE.oInitialState);
				});
			});
		});
	});
	describe('A notifying summary dialog', function() {
		it('can be created', function() {
			var oDialog = new NotifyingSummaryDialog({
				oComponents: fnCreateMockComponents()
			});
			expect(oDialog instanceof NotifyingSummaryDialog).toBe(true);
		});
		it('accepts its dom element as constructor property', function() {
			var oEl = $(),
				oDialog = new NotifyingSummaryDialog({
					oComponents: fnCreateMockComponents(),
					oEl: oEl
				});
			expect(oDialog.oEl).toBe(oEl);
		});
		it('should expose a hook to register callbacks to when the dialog is canceled', function() {
			var sCloseButtonClass = 'closeButtonClass',
				$fixture = $('<div></div>'),
				oDialog = new NotifyingSummaryDialog({
					oComponents: fnCreateMockComponents(),
					oEl: $fixture,
					oCssClasses: {
						oHeader: {
							sClose: sCloseButtonClass
						}
					}
				}),
				fnSpyCallback = jasmine.createSpy('spyCallback');
			setFixtures($fixture);
			expect(oDialog.fnAfterCancel).toBeDefined();
			oDialog.fnAfterCancel(fnSpyCallback);
			oDialog.fnRender();
			$('.' + sCloseButtonClass).click();
			expect(fnSpyCallback).toHaveBeenCalled();
		});
		describe('render', function() {
			it('renders a header with css class supplied during construction', function() {
				var sHeaderContainerClass = 'dialogHeader',
					oDialog = new NotifyingSummaryDialog({
						oEl: setFixtures(sandbox()),
						oComponents: fnCreateMockComponents(),
						oCssClasses: {
							oHeader: {
								sHeaderContainer: sHeaderContainerClass
							}
						}
					});
				expect('.' + sHeaderContainerClass).not.toBeInDOM();
				oDialog.fnRender();
				expect('.' + sHeaderContainerClass).toBeInDOM();
			});
			it('renders a notification body with css class supplied during construction', function() {
				var sNotificationBodyClass = 'notificationBody',
					oDialog = new NotifyingSummaryDialog({
						oEl: setFixtures(sandbox()),
						oComponents: fnCreateMockComponents(),
						oCssClasses: {
							oNotification: {
								sNotificationBody: sNotificationBodyClass
							}
						}
					});
				expect('.' + sNotificationBodyClass).not.toBeInDOM();
				oDialog.fnRender();
				expect('.' + sNotificationBodyClass).toBeInDOM();
			});
			it('renders a notification message image with css class supplied during construction', function() {
				var sNotificationImageClass = 'notificationImage',
					oDialog = new NotifyingSummaryDialog({
						oEl: setFixtures(sandbox()),
						oComponents: fnCreateMockComponents(),
						oCssClasses: {
							oNotification: {
								sNotificationImage: sNotificationImageClass
							}
						}
					});
				expect('.' + sNotificationImageClass).not.toBeInDOM();
				oDialog.fnRender();
				expect('.' + sNotificationImageClass).toBeInDOM();
			});
			describe('notificaion message area', function() {
				it('renders a notification message area with css class supplied during construction', function() {
					var sNotificationMessageClass = 'notificationMessage',
						oDialog = new NotifyingSummaryDialog({
							oEl: setFixtures(sandbox()),
							oComponents: fnCreateMockComponents(),
							oCssClasses: {
								oNotification: {
									sNotificationMessage: sNotificationMessageClass
								}
							}
						});
					expect('.' + sNotificationMessageClass).not.toBeInDOM();
					oDialog.fnRender();
					expect('.' + sNotificationMessageClass).toBeInDOM();
				});
				it('renders a the notification message with the text supplied during construction', function() {
					var sNotificationMessage = 'some message',
						$fixture = setFixtures(sandbox()),
						oDialog = new NotifyingSummaryDialog({
							oEl: $fixture,
							oComponents: fnCreateMockComponents(),
							sNotificationMessage: sNotificationMessage
						});
					expect(oDialog.oEl).not.toContainText(sNotificationMessage);
					oDialog.fnRender();
					expect(oDialog.oEl).toContainText(sNotificationMessage);
				});
			});
		});
	});
	describe('A generate communication summary dialog', function() {
		it('can be created', function() {
			var oGenCommSummaryDialog = new GenCommSummaryDialog({
				oEl: sandbox()
			});
			expect(oGenCommSummaryDialog).toBeDefined();
		});
		it('should accept its el during construction', function() {
			var oContainer = sandbox(),
				oGenCommSummaryDialog = new GenCommSummaryDialog({
					oEl: oContainer
				});
			expect(oGenCommSummaryDialog.oEl).toBe(oContainer);
		});
		describe('notification message', function() {
			var fnCreateSmallWidthFixture = function() {
					return $('<div></div>', {
						css: {
							maxWidth: '1px',
							overflow: 'hidden'
						}
					});
				},
				fnCreateLargeWidthFixture = function() {
					return $('<div></div>', {
						css: {
							maxWidth: '999px',
							overflow: 'hidden'
						}
					});
				};
			it('can be tooltipified', function() {
				var sNotificationMessage = 'some long message',
					sNotificationMessageClass = 'notificationMessage',
					$fixtureWithSmallWidth = fnCreateSmallWidthFixture(),
					$fixtureWithAdequateWidth = fnCreateLargeWidthFixture(),
					$parentFixture = $().add($fixtureWithSmallWidth).add($fixtureWithAdequateWidth),
					oDialogWithOverflowingMessage = new GenCommSummaryDialog({
						oEl: $fixtureWithSmallWidth,
						sNotificationMessage: sNotificationMessage,
						oCssClasses: {
							oNotification: {
								sNotificationMessage: sNotificationMessageClass
							}
						}
					}),
					oDialogWithoutOverflowingMessage = new GenCommSummaryDialog({
						oEl: $fixtureWithAdequateWidth,
						sNotificationMessage: sNotificationMessage,
						oCssClasses: {
							oNotification: {
								sNotificationMessage: sNotificationMessageClass
							}
						}
					});
				setFixtures($parentFixture);
				oDialogWithOverflowingMessage.fnRender().fnTooltipifyNotificationMessage();
				oDialogWithoutOverflowingMessage.fnRender().fnTooltipifyNotificationMessage();
				expect($(oDialogWithOverflowingMessage.oEl).find('.' + sNotificationMessageClass).tooltip('instance')).toBeDefined();
				expect($(oDialogWithoutOverflowingMessage.oEl).find('.' + sNotificationMessageClass).tooltip('instance')).not.toBeDefined();
			});
		});
		describe('render function', function() {
			var sViewListButton = 'viewListButton',
				sMultiHeader = 'multiHeader',
				asComponentCssClasses = [
					'summaryDialogShell',
					'summaryDialogHeader',
					'summaryDialogClose',
					sMultiHeader,
					'summaryDialogBody',
					'summaryDialogFooter',
					'filterByPendingCallsCheckbox',
					sViewListButton
				];
			it('renders all components of the generate communcation summary dialog', function() {
				var oGenCommSummaryDialog = new GenCommSummaryDialog({
					oEl: sandbox()
				});
				asComponentCssClasses.forEach(function(sCssClassName) {
					expect(oGenCommSummaryDialog.oEl).not.toContainElement('.' + sCssClassName);
				});

				oGenCommSummaryDialog.fnRender();
				asComponentCssClasses.forEach(function(sCssClassName) {
					expect(oGenCommSummaryDialog.oEl).toContainElement('.' + sCssClassName);
				});
				expect(oGenCommSummaryDialog.oEl.find('.' + sViewListButton)).toHaveValue(i18n.genComm.S_VIEW_LIST);
				expect(oGenCommSummaryDialog.oEl.find('.' + sViewListButton).parent()).toHaveText(i18n.genComm.S_FILTER_ONLY_PENDING_CALLS);
			});
			describe('in the header', function() {
				it('renders the multiheaders', function() {
					var oProps = {
							oEl: sandbox(),
							sHeaderText: 'some header text',
							sSubHeaderText: 'some sub header text'
						},
						oGenCommSummaryDialog = new GenCommSummaryDialog(oProps);
					expect(oGenCommSummaryDialog.oEl).not.toContainElement('h1');
					expect(oGenCommSummaryDialog.oEl).not.toContainElement('h2');

					oGenCommSummaryDialog.fnRender();
					expect(oGenCommSummaryDialog.oEl).toContainElement('h1');
					expect(oGenCommSummaryDialog.oEl).toContainElement('h2');
					expect(oGenCommSummaryDialog.oEl.find('h1')).toContainText(oProps.sHeaderText);
					expect(oGenCommSummaryDialog.oEl.find('h2')).toContainText(oProps.sSubHeaderText);
				});
			});
			describe('in the body', function() {
				it('renders multiple single process summary elements with their respective classes', function() {
					var sSingleProcessSummaryClass = 'singleProcessSummary',
						sTotalClass = 'singleProcessSummaryTotal',
						sTextClass = 'singleProcessSummaryText',
						oProps = {
							oEl: sandbox(),
							aoProcessSummaries: [{
								iTotal: 1,
								sText: 'text1',
								oCssClasses: {
									sImage: 'image-class-1',
									sEl: sSingleProcessSummaryClass,
									sTotal: sTotalClass,
									sText: sTextClass
								}
							}, {
								iTotal: 2,
								sText: 'text2',
								oCssClasses: {
									sImage: 'image-class-2',
									sEl: sSingleProcessSummaryClass,
									sTotal: sTotalClass,
									sText: sTextClass
								}
							}, {
								iTotal: 3,
								sText: 'text3',
								oCssClasses: {
									sImage: 'image-class-3',
									sEl: sSingleProcessSummaryClass,
									sTotal: sTotalClass,
									sText: sTextClass
								}
							}]
						},
						oGenCommSummaryDialog = new GenCommSummaryDialog(oProps);
					expect(oGenCommSummaryDialog.oEl).toBeEmpty();

					oGenCommSummaryDialog.fnRender();
					$.each(oProps.aoProcessSummaries, function(iProcessSummaryIndex, oProcessSummary) {
						var oBodyElementChildren = oGenCommSummaryDialog.oEl.find('.summaryDialogBody').children();
						expect(oBodyElementChildren.get(iProcessSummaryIndex)).toHaveClass('singleProcessSummary');
						expect($(oBodyElementChildren.get(iProcessSummaryIndex)).find('.' + sTotalClass)).toContainText(oProcessSummary.iTotal);
						expect($(oBodyElementChildren.get(iProcessSummaryIndex)).find('.' + sTextClass)).toContainText(oProcessSummary.sText);
						expect(oBodyElementChildren.get(iProcessSummaryIndex)).toContainElement('.' + oProcessSummary.oCssClasses.sImage);
					});
				});
			});
		});
		describe('view list button when clicked', function() {
			it('resolve the dialog\'s lifecycle with the current state', function() {
				var $fixture = $('<div></div>'),
					oGenCommSummaryDialog = new GenCommSummaryDialog({
						oEl: $fixture
					}),
					oAfterActionSpy = jasmine.createSpy('afterActionSpy');
				setFixtures($fixture);
				oGenCommSummaryDialog.fnAfterAction(oAfterActionSpy);
				oGenCommSummaryDialog.fnRender();
				expect(oAfterActionSpy).not.toHaveBeenCalled();

				$('.viewListButton').click();
				expect(oAfterActionSpy).toHaveBeenCalledWith({
					bIsFilterByPendingPhoneCalls: false
				});
			});
			it('empties and hides the dialog', function() {
				var $fixture = $('<div></div>'),
					oGenCommSummaryDialog = new GenCommSummaryDialog({
						oEl: $fixture
					});
				setFixtures($fixture);
				oGenCommSummaryDialog.fnRender();
				expect(oGenCommSummaryDialog.oEl).not.toBeHidden();
				expect(oGenCommSummaryDialog.oEl).not.toBeEmpty();

				$('.viewListButton').click();
				expect(oGenCommSummaryDialog.oEl).toBeEmpty();
				expect(oGenCommSummaryDialog.oEl).toBeHidden();
			});
		});
		describe('close button', function() {
			it('does not resolve the dialog\'s lifecycle since state change is irrelvant', function() {
				var $fixture = $('<div></div>'),
					oGenCommSummaryDialog = new GenCommSummaryDialog({
						oEl: $fixture
					}),
					oAfterActionSpy = jasmine.createSpy('afterActionSpy');
				setFixtures($fixture);
				oGenCommSummaryDialog.fnAfterAction(oAfterActionSpy);
				oGenCommSummaryDialog.fnRender();

				$('.summaryDialogClose').click();
				expect(oAfterActionSpy).not.toHaveBeenCalled();
			});
			it('calls its onCancel callbacks with its current state', function() {
				var $fixture = $('<div></div>'),
					oGenCommSummaryDialog = new GenCommSummaryDialog({
						oEl: $fixture
					}),
					oAfterCancelSpy = jasmine.createSpy('afterCancelSpy');
				setFixtures($fixture);
				oGenCommSummaryDialog.fnAfterCancel(oAfterCancelSpy);
				oGenCommSummaryDialog.fnRender();
				expect(oAfterCancelSpy).not.toHaveBeenCalled();

				$('.summaryDialogClose').click();
				expect(oAfterCancelSpy).toHaveBeenCalledWith({
					bIsFilterByPendingPhoneCalls: false
				});
			});
			it('hides the dialog', function() {
				var $fixture = $('<div></div>'),
					oGenCommSummaryDialog = new GenCommSummaryDialog({
						oEl: $fixture
					});
				setFixtures($fixture);
				oGenCommSummaryDialog.fnRender();
				expect(oGenCommSummaryDialog.oEl).not.toBeHidden();

				$('.summaryDialogClose').click();
				expect(oGenCommSummaryDialog.oEl).toBeHidden();
			});
		});
		describe('filter by pending phone calls checkbox ', function() {
			it('is initialized in an enabled state', function() {
				var $fixture = $('<div></div>'),
					sDefaultCheckboxCssClass = 'filterByPendingCallsCheckbox',
					oGenCommSummaryDialog = new GenCommSummaryDialog({
						oEl: $fixture
					})
					.fnRender();

				setFixtures($fixture);

				expect(oGenCommSummaryDialog.oEl).toContainElement('.' + sDefaultCheckboxCssClass);
				expect('.' + sDefaultCheckboxCssClass).not.toBeChecked();
				expect('.' + sDefaultCheckboxCssClass).not.toBeDisabled();
			});
			it('can be initialized in a disabled state', function() {
				var $fixture = $('<div></div>'),
					sDefaultCheckboxCssClass = 'filterByPendingCallsCheckbox',
					oGenCommSummaryDialog = new GenCommSummaryDialog({
						oEl: $fixture,
						bIsFilterByPendingPhoneCallsEnabled: false
					})
					.fnRender();

				setFixtures($fixture);

				expect(oGenCommSummaryDialog.oEl).toContainElement('.' + sDefaultCheckboxCssClass);
				expect('.' + sDefaultCheckboxCssClass).not.toBeChecked();
				expect('.' + sDefaultCheckboxCssClass).toBeDisabled();
			});
			describe('state change', function() {
				it('changes the state in the dialog box', function() {
					var $fixture = $('<div></div>'),
						oPendingPhoneCallsCheckedState = {
							bIsFilterByPendingPhoneCalls: true
						},
						oPendingPhoneCallsUncheckedState = {
							bIsFilterByPendingPhoneCalls: false
						},
						oGenCommSummaryDialog = new GenCommSummaryDialog({
							oEl: $fixture
						});
					setFixtures($fixture);
					oGenCommSummaryDialog.fnRender();
					expect(oGenCommSummaryDialog.fnGetState()).toEqual(oPendingPhoneCallsUncheckedState);

					$('.filterByPendingCallsCheckbox').click();
					expect(oGenCommSummaryDialog.fnGetState()).toEqual(oPendingPhoneCallsCheckedState);

					$('.filterByPendingCallsCheckbox').click();
					expect(oGenCommSummaryDialog.fnGetState()).toEqual(oPendingPhoneCallsUncheckedState);
				});
				it('ditheres all ditherable single process summary elements', function() {
					var $fixture = $('<div></div>'),
						oProps = {
							oEl: $fixture,
							aoProcessSummaries: [{
								iTotal: 1,
								sText: 'text1',
								sImgPath: 'image path 1'
							}, {
								iTotal: 2,
								sText: 'text2',
								sImgPath: 'image path 2',
								bIsDitherable: true
							}, {
								iTotal: 3,
								sText: 'text3',
								sImgPath: 'image path 3',
								bIsDitherable: true
							}]
						},
						oGenCommSummaryDialog = new GenCommSummaryDialog(oProps),
						oBodyElementChildren = null;
					setFixtures($fixture);
					oGenCommSummaryDialog.fnRender();
					oBodyElementChildren = oGenCommSummaryDialog.oEl.find('.summaryDialogBody').children();

					$.each(oProps.aoProcessSummaries, function(iProcessSummaryIndex) {
						expect(oBodyElementChildren.get(iProcessSummaryIndex)).not.toHaveClass('dithered');
					});

					$('.filterByPendingCallsCheckbox').click();
					expect(oBodyElementChildren.get(0)).not.toHaveClass('dithered');
					expect(oBodyElementChildren.get(1)).toHaveClass('dithered');
					expect(oBodyElementChildren.get(2)).toHaveClass('dithered');

					$('.filterByPendingCallsCheckbox').click();
					$(oProps.aoProcessSummaries, function(iProcessSummaryIndex) {
						expect(oBodyElementChildren.get(iProcessSummaryIndex)).not.toHaveClass('dithered');
					});
				});
			});
		});
	});
	describe('A generate communcation single process summary', function() {
		describe('during initialization', function() {
			it('accepts its dom element in its initialization properties', function() {
				var oProps = {
						oEl: sandbox()
					},
					oSingleProcessSummary = new SingleProcessSummary(oProps);
				expect(oSingleProcessSummary.oEl).toBe(oProps.oEl);
			});
			it('applies the css classes passed as properties to its el', function() {
				var oContainer = sandbox(),
					sElCssClass = 'css-class',
					oSingleProcessSummary = null;
				expect(oContainer).not.toHaveClass(sElCssClass);
				oSingleProcessSummary = new SingleProcessSummary({
					oEl: oContainer,
					oCssClasses: {
						sEl: sElCssClass
					}
				});
				expect(oContainer).toHaveClass(sElCssClass);
			});
		});
		describe('render function', function() {
			it('renders the total', function() {
				var iTotal = 10,
					oSingleProcessSummary = new SingleProcessSummary({
						oEl: sandbox(),
						iTotal: iTotal
					});
				oSingleProcessSummary.fnRender();
				expect(oSingleProcessSummary.oEl).toContainText(iTotal);
			});
			it('renders the text', function() {
				var sText = 'some text',
					oSingleProcessSummary = new SingleProcessSummary({
						oEl: sandbox(),
						sText: sText
					});
				oSingleProcessSummary.fnRender();
				expect(oSingleProcessSummary.oEl).toContainText(sText);
			});
			it('adds appropriate image classes', function() {
				var sImgClass = 'some-css-class',
					oSingleProcessSummary = new SingleProcessSummary({
						oEl: sandbox(),
						oCssClasses: {
							sImage: sImgClass
						}
					});
				expect(oSingleProcessSummary.oEl).not.toContainElement('.' + sImgClass);
				oSingleProcessSummary.fnRender();
				expect(oSingleProcessSummary.oEl).toContainElement('.' + sImgClass);
			});
		});
		describe('dither function', function() {
			var bDither = true,
				bUndither = false,
				oDitheredCssClasses = {
					sElDithered: 'dithered-css'
				};
			it('should add a dither class to the element', function() {
				var oProps = {
						oEl: sandbox(),
						oCssClasses: oDitheredCssClasses,
						bIsDitherable: true
					},
					oSingleProcessSummary = new SingleProcessSummary(oProps);
				oSingleProcessSummary.fnRender();
				expect(oSingleProcessSummary.oEl).not.toHaveClass(oProps.oCssClasses.sElDithered);

				oSingleProcessSummary.fnToggleDither(bDither);
				expect(oSingleProcessSummary.oEl).toHaveClass(oProps.oCssClasses.sElDithered);

				oSingleProcessSummary.fnToggleDither(bUndither);
				expect(oSingleProcessSummary.oEl).not.toHaveClass(oProps.oCssClasses.sElDithered);
			});
			it('should never dither an unditherable element', function() {
				var oProps = {
						oEl: sandbox(),
						bIsDitherable: false,
						oCssClasses: oDitheredCssClasses
					},
					oSingleProcessSummary = new SingleProcessSummary(oProps);

				oSingleProcessSummary.fnRender();
				expect(oSingleProcessSummary.oEl).not.toHaveClass(oProps.oCssClasses.sElDithered);
				oSingleProcessSummary.fnToggleDither(bDither);
				expect(oSingleProcessSummary.oEl).not.toHaveClass(oProps.oCssClasses.sElDithered);
				oSingleProcessSummary.fnToggleDither(bUndither);
				expect(oSingleProcessSummary.oEl).not.toHaveClass(oProps.oCssClasses.sElDithered);
			});
		});
	});
})();