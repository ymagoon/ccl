(function() {
	'use strict';
	var oGlobal = this,
		oDwlUtils = oGlobal.DWL_Utils,
		Dialog = oDwlUtils.Dialog,
		Header = oDwlUtils.Component.Header,
		Container = oDwlUtils.Component.Container,
		/**
		 * Id for a parent element that does not exist.
		 * @private
		 * @constant
		 * @type {String}
		 * @memberof DWL_Utils.Component.SummaryDialog
		 * @inner
		 */
		S_NO_PARENT_ID = '',
		/**
		 * @private
		 * @param {String} sCssClasses - space delimited strings that represent cssClasses
		 * @returns {String[]} an array of strings where each string is a css class.
		 * @memberof DWL_Utils.Component.SummaryDialog
		 * @inner
		 */
		fnExtractCssClasses = function(sCssClasses) {
			return (sCssClasses || '').split(' ');
		},
		/**
		 * @private
		 * @param {Object} oCssClasses - options provided by user which can potentially have null or undefined entries.
		 * @returns {Object} a copy of oCssClasses with default values according to the documentation for {@link SummaryDialog}.
		 * @memberof DWL_Utils.Component.SummaryDialog
		 * @inner
		 */
		fnDefaultedCssClasses = function(oCssClasses) {
			var oDefaultedCssClasses = oCssClasses || {};
			oDefaultedCssClasses.sDialogShellCssClasses = oDefaultedCssClasses.sDialogShell || null;
			oDefaultedCssClasses.oHeader = oDefaultedCssClasses.oHeader || {};
			oDefaultedCssClasses.oHeader.sHeaderContainer = oDefaultedCssClasses.oHeader.sHeaderContainer || null;
			oDefaultedCssClasses.oHeader.sClose = oDefaultedCssClasses.oHeader.sClose || null;
			return oDefaultedCssClasses;
		},
		/**
		 * @private
		 * @param {Object} oHeaderCssClasses - css classes for various components of the SummaryDialog header container.
		 * @returns {Object} an object with properties for containing the header container, the header and the close button.
		 * @memberof DWL_Utils.Component.SummaryDialog
		 * @inner
		 */
		fnCreateHeader = function(oHeader, oHeaderCssClasses) {
			var oHeaderContainer = new Container({
					oEl: $('<div></div>'),
					sCssClasses: oHeaderCssClasses.sHeaderContainer
				}),
				oHeaderComponent = oHeader || new Header({
					oEl: $('<div></div>')
				}),
				oCloseButton = {
					oEl: $('<span>', {
						addClass: oHeaderCssClasses.sClose
					}).get(0)
				};
			return {
				oContainer: oHeaderContainer.fnAddChildren([oHeaderComponent.fnRender().oEl, oCloseButton.oEl]),
				oHeader: oHeader,
				oCloseButton: oCloseButton
			};
		},
		/**
		 * A closeable dialog box that contains summary information.
		 * @constructor SummaryDialog
		 * @param {!Object}  oProps               - the properties to set on the {@link DWL_Utils.Component.SummaryDialog|SummaryDialog}
		 * @param {!Object}  oProps.oEl           - the dom element for this {@link DWL_Utils.Component.SummaryDialog|SummaryDialog}
		 * @param {!Object}  oProps.oComponents   - the various components of this SummaryDialog.
		 * @param {?Object}  [oProps.oCssClasses={}] - css classes for various components of the SummaryDialog.
		 * @param {?String}  [oProps.oCssClasses.sDialogShell=null] - css classes for the SummaryDialog shell.
		 * @param {?Object}  [oProps.oCssClasses.oHeader={}] - css classes for the header section of SummaryDialog.
		 * @param {?String}  [oProps.oCssClasses.oHeader.sHeaderContainer=null] - css classes for the header container element of the SummaryDialog.
		 * @param {?String}  [oProps.oCssClasses.oHeader.sClose=null] - css classes for the close button in the header of the SummaryDialog.
		 * @param {!Header|MultiHeader}  oProps.oComponents.oHeader - the header or multiheader of this summary dialog
		 * @param {!Container}  oProps.oComponents.oBody - the body container of this summary dialog
		 * @param {!Container}  oProps.oComponents.oFooter - the footer container of this summary dialog
		 * @param {?Object}  [oProps.oInitialState={}] - the initial state to set on the {@link DWL_Utils.Component.SummaryDialog|SummaryDialog}
		 * @memberof DWL_Utils.Component
		 */
		SummaryDialog = function(oProps) {
			var self = this,
				oEl = oProps.oEl,
				$el = $(oEl),
				oState = $.extend({}, oProps.oInitialState || {}),

				oCssClasses = fnDefaultedCssClasses(oProps.oCssClasses),

				oPurpose = $.Deferred(),

				oDialogShell = new Dialog(null, fnExtractCssClasses(oCssClasses.sDialogShell), S_NO_PARENT_ID),
				oHeader = fnCreateHeader(oProps.oComponents.oHeader, oCssClasses.oHeader),
				oBody = oProps.oComponents.oBody,
				oFooter = oProps.oComponents.oFooter,

				/**
				 * Registers all event handlers that is pertinent to the SummaryDialog.
				 * @private
				 * @returns {SummaryDialog} itself for chaining.
				 * @memberof DWL_Utils.Component.SummaryDialog
				 * @inner
				 */
				fnRegisterEventHandlers = function() {
					$(oHeader.oCloseButton.oEl).on('click', self.fnClose.bind(self));
					return self;
				};

			$.extend(self, {
				/**
				 * The dom element for this {@link SummaryDialog}
				 * @type {Object}
				 * @memberof DWL_Utils.Component.SummaryDialog#
				 */
				oEl: oEl,
				/**
				 * Css class names received during construction.
				 * @type {Object}
				 * @memberof DWL_Utils.Component.SummaryDialog#
				 */
				oCssClasses: oCssClasses,
				/**
				 * A hook to register a callback that will be called once this dialog box is canceled using the close button.
				 * @function
				 * @param {Function} callback - a callback which will be called when the dialog is canceled
				 * @memberof DWL_Utils.Component.SummaryDialog#
				 */
				fnAfterCancel: oPurpose.promise().fail,
				/**
				 * Hides the dialog from view but does not remove the element from dom.
				 * @public
				 * @returns {SummaryDialog} returns itself for chaining.
				 * @memberof DWL_Utils.Component.SummaryDialog#
				 */
				fnClose: function() {
					oPurpose.reject(oState);
					$el.hide();
					return self;
				},
				/**
				 * @public
				 * @returns {Object} the current state of the {@link SummaryDialog}.
				 * @memberof DWL_Utils.Component.SummaryDialog#
				 */
				fnGetState: function() {
					return oState;
				},
				/**
				 * @public
				 * @returns {SummaryDialog} itself for chaining.
				 * @memberof DWL_Utils.Component.SummaryDialog#
				 */
				fnRender: function() {
					var $dialog = oDialogShell.getDialog();
					$dialog
						.empty()
						.append([
							oHeader.oContainer.fnRender().oEl,
							oBody.fnRender().oEl,
							oFooter.fnRender().oEl
						])
						.appendTo($el.empty());
					return self;
				}
			});

			return fnRegisterEventHandlers();
		};

	oGlobal.DWL_Utils = oDwlUtils;
	oGlobal.DWL_Utils.Component.SummaryDialog = SummaryDialog;
}).call(this);

(function() {
	'use strict';
	var oGlobal = this,
		oDwlUtils = oGlobal.DWL_Utils,
		oComponent = oDwlUtils.Component,
		SummaryDialog = oComponent.SummaryDialog,
		/**
		 * @private
		 * @param {Object} oCssClasses - options provided by user which can potentially have null or undefined entries.
		 * @returns {Object} a copy of oCssClasses with default values according to the documentation for 
		 *                   {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}.
		 * @memberof DWL_Utils.Component.NotifyingSummaryDialog
		 * @inner
		 */
		fnDefaultedCssClasses = function(oCssClasses) {
			var oDefaultedCssClasses = oCssClasses || {};
			oDefaultedCssClasses.oHeader = oDefaultedCssClasses.oHeader || {};
			oDefaultedCssClasses.oHeader.sHeaderContainer = oDefaultedCssClasses.oHeader.sHeaderContainer || 'headerContainer';
			oDefaultedCssClasses.oNotification = oDefaultedCssClasses.oNotification || {};
			return oDefaultedCssClasses;
		},

		/**
		 * A summary dialog box that has a notification banner.
		 * @constructor NotifyingSummaryDialog
		 * @param {!Object}  oProps - the properties to set on the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}.
		 *                            Accepts same properties as {@link DWL_Utils.Component.SummaryDialog|SummaryDialog} and some additional ones.
		 * @param {!Object}  oProps.oEl - the dom element for this {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}
		 * @param {!String}  [oProps.sNotificationMessage=""] - the notification message for the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}
		 * @param {?Object}  [oProps.oCssClasses={}] - css classes for various components of the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}
		 * @param {?Object}  [oProps.oCssClasses.oHeader={}] - css classes for various components of the header of the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}
		 * @param {?String}  [oProps.oCssClasses.oHeader.sHeaderContainer="headerContainer"] - css classes for the header container element of the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}
		 * @param {?Object}  [oProps.oCssClasses.oNotification={}] - css classes for various components of the notification area of the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}
		 * @param {?String}  [oProps.oCssClasses.oNotification.sNotificationImage] - css classes for the image in the notification area of the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}
		 * @param {?String}  [oProps.oCssClasses.oNotification.sNotificationBody] - css classes for the body of the notification area of the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}
		 * @param {?String}  [oProps.oCssClasses.oNotification.sNotificationMessage] - css classes for the message of the notification area of the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}
		 * @memberof DWL_Utils.Component
		 */
		NotifyingSummaryDialog = function(oProps) {
			var oSelf = this,
				oEl = oProps.oEl,
				$el = $(oEl),
				oCssClasses = fnDefaultedCssClasses(oProps.oCssClasses),
				oSummaryDialogShell = new SummaryDialog({
					oEl: $('<div></div>'),
					oComponents: oProps.oComponents,
					oCssClasses: oCssClasses
				});
			$.extend(oSelf, {
				/**
				 * The dom element for this {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}.
				 * @type {Object}
				 * @memberof DWL_Utils.Component.NotifyingSummaryDialog#
				 */
				oEl: oEl,
				/**
				 * Renders the {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog} onto its dom element.
				 * @public
				 * @returns {DWL_Utils.Component.NotifyingSummaryDialog} itself for chaining.
				 * @memberof DWL_Utils.Component.NotifyingSummaryDialog#
				 */
				fnRender: function() {
					var $summaryDialogShell = $(oSummaryDialogShell.fnRender().oEl),
						$notificationBanner = $('<div></div>', {
							addClass: oCssClasses.oNotification.sNotificationBody,
							append: [
								$('<span></span>', {
									addClass: oCssClasses.oNotification.sNotificationImage
								}),
								$('<div></div>', {
									addClass: oCssClasses.oNotification.sNotificationMessage,
									text: oProps.sNotificationMessage,
									attr: {
										title: oProps.sNotificationMessage
									}
								})
							]
						});
					$summaryDialogShell
						.find('.' + oCssClasses.oHeader.sHeaderContainer)
						.after($notificationBanner);
					$el.empty().append($summaryDialogShell);
					return oSelf;
				},
				/**
				 * A hook to register a callback that will be called once this dialog box is canceled using the close button.
				 * Delegates to {@link DWL_Utils.Component.SummaryDialog#fnAfterCancel}.
				 * @function
				 * @param {Function} callback - a callback which will be called when the dialog is canceled
				 * @memberof DWL_Utils.Component.NotifyingSummaryDialog#
				 */
				fnAfterCancel: oSummaryDialogShell.fnAfterCancel
			});
		};

	oComponent.NotifyingSummaryDialog = NotifyingSummaryDialog;
}).call(this);

(function() {
	'use strict';
	var oGlobal = this,
		oDwlUtils = oGlobal.DWL_Utils,
		/**
		 * A element that conveys summary of a single process of generate communcation.
		 * @constructor SingleProcessSummary
		 * @param {!Object}   oProps             - the properties to set on the SingleProcessSummary
		 * @param {!Object}   oProps.oEl         - the dom element for this SingleProcessSummary
		 * @param {?Boolean}  [oProps.bIsDitherable=false] - an explicit value of true allows this element to dither when the {@link DWL_Utils.Component.GenCommSummary.SingleProcessSummary#fnToggleDither|#fnToggleDither} is called.
		 *                                           when this property is set to false, this element will never dither making {@link DWL_Utils.Component.GenCommSummary.SingleProcessSummary#fnToggleDither|#fnToggleDither} a no-op.
		 * @param {!Number}   oProps.iTotal      - the number of items completed for the SingleProcessSummary
		 * @param {!String}   oProps.sText       - the text accompanying the SingleProcessSummary
		 * @param {!Object}   oProps.oCssClasses - namespace that contains css classes for components of the SingleProcessSummary 
		 * @param {!String}   oProps.oCssClasses.sEl    - space delimited css class names to apply on the element of the SingleProcessSummary
		 * @param {!String}   oProps.oCssClasses.sImage - space delimited css class names to apply on the image element of the SingleProcessSummary
		 * @param {?String}   [oProps.oCssClasses.sTotal="summaryTotal"] - space delimited css class names to apply on the element that displays the total of the SingleProcessSummary
		 * @param {?String}   [oProps.oCssClasses.sText="summaryText"]  - space delimited css class names to apply on the element that displays the text of the SingleProcessSummary
		 * @param {?String}   [oProps.oCssClasses.sElDithered="dithered"] - space delimited css class names to apply on the element of the SingleProcessSummary when it's dithered
		 * @memberof DWL_Utils.Component.GenCommSummary
		 */
		SingleProcessSummary = function(oProps) {
			var self = this,
				oEl = oProps.oEl,

				bIsDitherable = (oProps.bIsDitherable === true),
				oCssClasses = oProps.oCssClasses || {},
				sElClasses = oCssClasses.sEl || null,
				sTotalClasses = oCssClasses.sTotal || 'summaryTotal',
				sTextClasses = oCssClasses.sText || 'summaryText',
				sElDitheredClasses = oCssClasses.sElDithered || 'dithered',
				sImageClasses = oCssClasses.sImage || null,

				$el = $(oEl).addClass(sElClasses);

			$.extend(self, {
				/**
				 * The dom element for this {@link SingleProcessSummary}
				 * @type {Object}
				 * @memberof DWL_Utils.Component.GenCommSummary.SingleProcessSummary#
				 */
				oEl: oEl,
				/**
				 * Dithers the single process summary.
				 * Note, if this object was initialized with to never be ditherable, then this function is a no-op.
				 * @param {Boolean} bDither - passing true will dither this process summary. 
				 *                            Passing anything else, including not passing anything at all, will be treated as false
				 *                            and will undither the process summary.
				 * @public
				 * @returns {SingleProcessSummary} itself for chaining
				 * @memberof DWL_Utils.Component.GenCommSummary.SingleProcessSummary#
				 */
				fnToggleDither: function(bDither) {
					var bToggleState = null;
					if (bIsDitherable === false) {
						return self;
					}
					bToggleState = (bDither === true);
					$el.toggleClass(sElDitheredClasses, bToggleState);
					return self;
				},
				/**
				 * @public
				 * @returns {SingleProcessSummary} itself for chaining.
				 * @memberof DWL_Utils.Component.GenCommSummary.SingleProcessSummary#
				 */
				fnRender: function() {
					$el.empty()
						.append([
							$('<div></div>', {
								text: oProps.iTotal,
								addClass: sTotalClasses
							}),
							$('<div></div>', {
								text: oProps.sText,
								addClass: sTextClasses
							}),
							$('<div></div>', {
								append: $('<span></span>', {
									addClass: sImageClasses
								})
							}),
						]);
					return self;
				}
			});
		};

	oGlobal.DWL_Utils = oDwlUtils;
	oGlobal.DWL_Utils.Component.GenCommSummary.SingleProcessSummary = SingleProcessSummary;
}).call(this);

(function() {
	'use strict';
	var oGlobal = this,
		oDwlUtils = oGlobal.DWL_Utils,
		Checkbox = oDwlUtils.Checkbox,
		Button = oDwlUtils.Button,
		Header = oDwlUtils.Component.Header,
		MultiHeader = oDwlUtils.Component.MultiHeader,
		Container = oDwlUtils.Component.Container,
		SummaryDialog = oDwlUtils.Component.SummaryDialog,
		NotifyingSummaryDialog = oDwlUtils.Component.NotifyingSummaryDialog,
		SingleProcessSummary = oDwlUtils.Component.GenCommSummary.SingleProcessSummary,
		/**
		 * @inner
		 * @private
		 * @type {Boolean}
		 * @const
		 * Flag that enables deep copy when using $.extend().
		 */
		B_DEEP_COPY = true,
		/**
		 * Creates a {@link DWL_Utils.Component.Container} whose element is a div.
		 * @param {String} sCssClasses - the space delimited css classes to apply to this container's element.
		 * @returns {Container} a Conatainer whose element is a div.
		 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
		 * @inner
		 */
		fnCreateDivContainer = function(sCssClasses) {
			return new Container({
				oEl: $('<div></div>'),
				sCssClasses: sCssClasses
			});
		},
		/**
		 * @param   {?String}     [sHeaderText=i18n.genComm.S_GENERATED_COMMUNCATION_SUMMARY] - the text to display in the header of the generate communication summary dialog
		 * @param   {!String}     sSubHeaderText - the text to display in the sub-header of the generate communication summary dialog
		 * @param   {!String}     sMultiHeaderClasses - space delimited css classes to apply on the multi header.
		 * @returns {MultiHeader} the multiheader for the generate communication summary dialog
		 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
		 * @inner
		 */
		fnCreateMultiHeader = function(sHeaderText, sSubHeaderText, sMultiHeaderClasses) {
			return new MultiHeader({
				oEl: $('<div></div>'),
				sCssClasses: sMultiHeaderClasses
			}).fnAddHeaders([
				new Header({
					oEl: $('<div></div>'),
					sText: sHeaderText || i18n.genComm.S_GENERATED_COMMUNCATION_SUMMARY,
					iLevel: 1
				}),
				new Header({
					oEl: $('<div></div>'),
					sText: sSubHeaderText,
					iLevel: 2
				})
			]);
		},
		/**
		 * @param {SingleProcessSummary[]} aoSingleProcessSummaries - a list of SingleProcessSummary to add to the body container.
		 * @param {String} sBodyContainerCss - space delimited css classes to apply on the body container element
		 * @returns {Container} the body container that contains single process summaries.
		 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
		 * @inner
		 */
		fnCreateBody = function(aoSingleProcessSummaries, sBodyContainerCss) {
			return fnCreateDivContainer(sBodyContainerCss)
				.fnAddChildren($.map(aoSingleProcessSummaries, function(oProcessSummary) {
					return oProcessSummary.fnRender().oEl;
				}));
		},
		/**
		 * @param {Object}  oFooterClasses - css classes for the various components of the GenCommSummaryDialog footer
		 * @param {String}  oFooterClasses.sFooterContainerCss - space delimited css classes to apply on the footer container element
		 * @param {String}  oFooterClasses.sFilterCheckbox - space delimited css classes to apply on the footer's filter checkbox'
		 * @param {String}  oFooterClasses.sViewListButton - space delimited css classes to apply on the footer's view list button.
		 * @param {?Boolean} [bIsFilterByPendingPhoneCallsEnabled=true] - if set to true, which is the default option, the filterByPendingCallsCheckbox is enabled and interactable on this dialog box.
		 *                                                                if set to false, the filterByPendingCallsCheckbox is disabled and non-interactable on this dialog box.
		 * @returns {Container} the footer container of the GenCommSummaryDialog
		 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
		 * @inner
		 */
		fnBuildFooter = function(oFooterClasses, bIsFilterByPendingPhoneCallsEnabled) {
			var oFilterByPendingCallsCheckbox = new Checkbox(
					null, [oFooterClasses.sFilterCheckbox],
					null,
					null,
					i18n.genComm.S_FILTER_ONLY_PENDING_CALLS
				)
				.init()
				.getCheckbox()
				.prop('disabled', (bIsFilterByPendingPhoneCallsEnabled === false)),

				oViewListButton = new Button(
					null, [oFooterClasses.sViewListButton],
					i18n.genComm.S_VIEW_LIST,
					false
				).fnInit().getButton();

			return fnCreateDivContainer(oFooterClasses.sFooterContainer)
				.fnAddChildren([
					oFilterByPendingCallsCheckbox.parent().get(0),
					oViewListButton.get(0)
				]);
		},
		/**
		 * A dialog box that summarizes the various processes and directs a user to further actions.
		 * @constructor GenCommSummaryDialog
		 * @param {!Object}   oProps                - the properties to set on the {@link DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog|GenCommSummaryDialog}
		 * @param {!Object}   oProps.oEl            - the dom element for this {@link DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog|GenCommSummaryDialog}
		 * @param {!Object[]} oProps.aoProcessSummaries - an array of properties for the single process summary in the GenCommSummaryDialog body. @see {@link DWL_Utils.Component.GenCommSummary.SingleProcessSummary|parameter to the constructor of SingleProcessSummary}
		 * @param {?Boolean}  [oProps.bIsFilterByPendingPhoneCallsEnabled=true] - if set to true, which is the default option, the filterByPendingCallsCheckbox is enabled and interactable on this dialog box.
		 *                                                                if set to false, the filterByPendingCallsCheckbox is disabled and non-interactable on this dialog box.
		 * @param {?String}  [oProps.sNotificationMessage=null] - if a non-null string message is given then a notification message is added to the {@link DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog|GenCommSummaryDialog}
		 *                                                        by utilizing a {@link DWL_Utils.Component.NotifyingSummaryDialog|NotifyingSummaryDialog}. If no message is given, then a regular 
		 *                                                        {@link DWL_Utils.Component.SummaryDialog|SummaryDialog} is used.
		 * @param {!String}   oProps.sSubHeaderText - the text to display in the subheader of the generate communication summary dialog
		 * @param {?String}   [oProps.sHeaderText=i18n.genComm.S_GENERATED_COMMUNCATION_SUMMARY] - the text to display in the header of the generate communication summary dialog
		 * @memberof DWL_Utils.Component.GenCommSummary
		 */
		GenCommSummaryDialog = function(oProps) {
			var self = this,
				oEl = oProps.oEl,
				$el = $(oEl),

				/**
				 * A namespace for all applicable css classes for the GenCommSummaryDialog.
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 * @type {Object}
				 * @private
				 * @inner
				 */
				oCssClasses = {
					oComponents: {
						sDialogShell: 'summaryDialogShell',
						oHeader: {
							sHeaderContainer: 'summaryDialogHeader',
							sMultiHeader: 'multiHeader',
							sClose: 'summaryDialogClose'
						},
						oNotification: {
							sNotificationBody: 'notificationBody',
							sNotificationMessage: 'notificationMessage',
							sNotificationImage: 'notificationImage'
						},
						oBody: {
							sBodyContainer: 'summaryDialogBody',
							sSingleProcess: 'singleProcessSummary'
						},
						oFooter: {
							sFooterContainer: 'summaryDialogFooter',
							sFilterCheckbox: 'filterByPendingCallsCheckbox',
							sViewListButton: 'viewListButton'
						}
					}
				},

				/**
				 * The state of the GenCommSummaryDialog. It is kept updated according to the interactions made by 
				 * user.
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 * @type {Object}
				 * @prop {Boolean} bIsFilterByPendingPhoneCalls - whether the dialog's filter by pending phone calls option is selected.
				 * @private
				 * @inner
				 */
				oState = {
					bIsFilterByPendingPhoneCalls: false
				},

				/**
				 * A collection of single process summaries to add to the body of this GenCommSummaryDialog.
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 * @type {DWL_Utils.Component.GenCommSummary.SingleProcessSummary[]}
				 * @private
				 * @inner
				 */
				aoSingleProcessSummaries = $.map(oProps.aoProcessSummaries || [], function(oProcessSummaryProp) {
					return new SingleProcessSummary($.extend({
						oEl: $('<div></div>')
					}, oProcessSummaryProp));
				}),

				/**
				 * The initialization properties of a summary dialog.
				 * @private
				 * @inner
				 * @type {Object}
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 */
				oSummaryDialogProps = {
					oEl: oEl,
					oInitialState: oState,
					oCssClasses: {
						oHeader: {
							sHeaderContainer: oCssClasses.oComponents.oHeader.sHeaderContainer,
							sClose: oCssClasses.oComponents.oHeader.sClose
						},
						sDialogShell: oCssClasses.oComponents.sDialogShell
					},
					oComponents: {
						oHeader: fnCreateMultiHeader(oProps.sHeaderText, oProps.sSubHeaderText, oCssClasses.oComponents.oHeader.sMultiHeader),
						oBody: fnCreateBody(aoSingleProcessSummaries, oCssClasses.oComponents.oBody.sBodyContainer),
						oFooter: fnBuildFooter(oCssClasses.oComponents.oFooter, oProps.bIsFilterByPendingPhoneCallsEnabled)
					}
				},

				/**
				 * The dialog shell of the GenCommSummaryDialog.
				 * @type {DWL_Utils.Component.SummaryDialog}
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 * @private
				 * @inner
				 */
				oSummaryDialogShell = (DWL_Utils.isNullOrUndefined(oProps.sNotificationMessage) === true ?
					new SummaryDialog(oSummaryDialogProps) :
					new NotifyingSummaryDialog($.extend(B_DEEP_COPY, {}, oSummaryDialogProps, {
						oCssClasses: {
							oNotification: oCssClasses.oComponents.oNotification
						},
						sNotificationMessage: oProps.sNotificationMessage
					}))),

				/**
				 * A $.Deferred that represents the purpose of this GenCommSummaryDialog. This deferred will be resolved or 
				 * rejected based on whether the user wants an action to be performed through the options presented by this
				 * dialog or simply closes this dialog.
				 * @type {$.Deferred}
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 * @private
				 * @inner
				 */
				oPurpose = $.Deferred(),
				/**
				 * Hides the dom element, and triggers callbacks that need to run on dialog box cancel.
				 * @private
				 * @returns {GenCommSummaryDialog} itself for chaining.
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 * @inner
				 */
				fnAfterCancel = function() {
					$el.hide();
					oPurpose.reject(oState);
					return self;
				},
				/**
				 * Empties and hides the dom element, and triggers callbacks that need to run on dialog box non-cancel action.
				 * @private
				 * @returns {GenCommSummaryDialog} returns itself for chaining.
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 * @inner
				 */
				fnAfterAction = function() {
					$el.hide().empty();
					oPurpose.resolve(oState);
					return self;
				},
				/**
				 * Registers all event handlers that is pertinent to the GenCommSummaryDialog.
				 * @private
				 * @returns {GenCommSummaryDialog} itself for chaining.
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 * @inner
				 */
				fnRegisterEventHandlers = function() {
					var S_VIEW_LIST_BUTTON_CLASS = '.' + oCssClasses.oComponents.oFooter.sViewListButton,
						S_FILTER_ONLY_PENDING_CALLS_CLASS = '.' + oCssClasses.oComponents.oFooter.sFilterCheckbox;
					$el.on('click', S_VIEW_LIST_BUTTON_CLASS, fnAfterAction.bind(self))
						.on('change', S_FILTER_ONLY_PENDING_CALLS_CLASS, function() {
							oState.bIsFilterByPendingPhoneCalls = $(this).is(':checked');
							$.each(aoSingleProcessSummaries, function() {
								var oSingleProcessSummary = this;
								oSingleProcessSummary.fnToggleDither(oState.bIsFilterByPendingPhoneCalls);
							});
						});
					oSummaryDialogShell.fnAfterCancel(fnAfterCancel.bind(self));
					return self;
				},
				/**
				 * @private
				 * @inner
				 * @returns {Boolean} true if the notification message is truncated; false if the dialog was created without a notificaion message or if
				 *                    the notification message is not truncated.
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog
				 */
				fnIsNotificationMessageTruncated = function() {
					if (DWL_Utils.isNullOrUndefined(oProps.sNotificationMessage) === true) {
						return false;
					}
					var $notificationMessageElement = $el.find('.' + oCssClasses.oComponents.oNotification.sNotificationMessage);
					return DWL_Utils.fnIsTextOverflowed($notificationMessageElement.get(0)) === true;
				};

			$.extend(self, {
				/**
				 * The dom element for this {@link GenCommSummaryDialog}
				 * @type {Object}
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog#
				 */
				oEl: oEl,
				/**
				 * The callback that's called after a summary dialog is canceled.
				 * @callback DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog~fnAfterCancelCallback
				 * @param {Object} oState - the current state of the dialog
				 */
				/**
				 * A hook to register a callback that will be called once this dialog box is canceled using the close button.
				 * @function
				 * @param {DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog~fnAfterCancelCallback} fnCallback - a callback which will be called when the dialog has been canceled
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog#
				 */
				fnAfterCancel: oPurpose.promise().fail,
				/**
				 * The callback that's called after once the user has requested an action to be performed through this dialog box.
				 * @callback DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog~fnAfterActionCallback
				 * @param {Object} oState - the current state of the dialog
				 */
				/**
				 * A hook to register a callback that will be called once the user has requested an action to be performed
				 * through this summary dialog.
				 * @function
				 * @param {DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog~fnAfterActionCallback} fnCallback - a callback which will be called when the user has requested an action to be performed
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog#
				 */
				fnAfterAction: oPurpose.promise().done,
				/**
				 * @public
				 * @returns {Object} the current state of the {@link GenCommSummaryDialog}.
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog#
				 */
				fnGetState: function() {
					return oState;
				},
				/**
				 * @returns {GenCommSummaryDialog} itself for chaining.
				 * @memberof DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog#
				 */
				fnRender: function() {
					oSummaryDialogShell.fnRender();
					$el.show();
					return self;
				},
				/**
				 * Tooltipifies the notification message if it exists and is overflowing.
				 * Note: in order for this to work, the generate communication summary dialog must first be in DOM.
				 * @returns {GenCommSummaryDialog} itself for chaining.
				 */
				fnTooltipifyNotificationMessage: function() {
					if (fnIsNotificationMessageTruncated() === false) {
						return self;
					}
					var $notificationMessage = $el.find('.' + oCssClasses.oComponents.oNotification.sNotificationMessage);
					$notificationMessage.tooltip({
						content: oProps.sNotificationMessage,
						items: $notificationMessage,
						tooltipClass: 'notificationTooltip',
						show: false,
						hide: false
					});
					return self;
				}
			});
			return fnRegisterEventHandlers();
		};

	oGlobal.DWL_Utils = oDwlUtils;
	oGlobal.DWL_Utils.Component.GenCommSummary.GenCommSummaryDialog = GenCommSummaryDialog;
}).call(this);