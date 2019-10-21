(function() {
	'use strict';
	var global = this,
		/**
		 * @param {ProgressIndicator|ProgressIndicatorBar} component - the component whose el to return.
		 * @returns the element bound to the component
		 * @private
		 */
		getElement = function(component) {
			return component.el;
		},
		/**
		 * Calls remove method on the context.
		 * @this {ProgressIndicator|ProgressIndicatorBar}
		 * @returns the return value of this#remove.
		 * @private
		 */
		remove = function() {
			return this.remove();
		},
		/**
		 * Creates a progress indicator bar which contains one or more {@link ProgressIndicator}.
		 * @constructor ProgressIndicatorBar
		 * @param {Object} props                          - properties to set on a new instance.
		 * @param {Object} props.el                       - the html element to render this component in.
		 * @param {String} [props.cssClassChildCountPrefix='progressIndicators']          - prefix to use for a class name for this component
		 *                                                  to indicate how many child indicators there are. This is mainly to apply specific css.
		 *                                                  Default eg: progressIndicators3 indicates there 3 child indicators.
		 * @param {Object} [props.cssClasses]             - the space delimited list of css classes to apply.
		 * @param {String} [props.cssClasses.progressIndicatorBar='progressIndicatorBar'] - class name(s) for the this component's dom element.
		 * @param {String} [props.cssClasses.tooltip='progressIndicatorBarTooltip']       - class name(s) for the this component's tooltip dom element.
		 * @param {String} [props.tooltipMessage]         - the message to display as the tooltip for the progress indicator bar. 
		 *                                                  No tooltip will be displayed if the message is null or undefined.
		 * @prop  {Object} el                             - element received from props.el
		 * @prop  {String} cssClasses                     - list of css classes received from props.cssClasses or defaults
		 * @prop  {String} cssClassChildCountPrefix       - prefix received from props.cssClassChildCountPrefix or the default
		 * @memberof DWL_Utils.Component
		 */
		ProgressIndicatorBar = function(props) {
			var DEEP_COPY = true,
				privateState = {
					/*@private*/
					_indicators: []
				},
				overwriteableDefaults = {
					/*@public*/
					cssClasses: {
						progressIndicatorBar: 'progressIndicatorBar',
						tooltip: 'progressIndicatorBarTooltip'
					},
					/*@public*/
					cssClassChildCountPrefix: 'progressIndicators'
				};
			$.extend(DEEP_COPY, this, overwriteableDefaults, props, privateState);
			/*@private*/
			this._$el = $(this.el);
		};

	/**
	 * @returns {Object[]} the dom elements for each indicator in this progress indicator bar or empty array.
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype._getIndicatorElements = function() {
		return $.map(this._indicators, getElement);
	};

	/**
	 * Invokes each indicators remove method before discarding a reference to them entirely.
	 * @returns {ProgressIndicatorBar} itself for chaining.
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype._removeIndicators = function() {
		$.each(this._indicators, remove);
		this._indicators = [];
		return this;
	};

	/**
	 * Updates its element's css with cssClassChildCountPrefix and the number of child
	 * indicator the progress indicator bar has.
	 * @returns {ProgressIndicatorBar} itself for chaining.
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype._updateIndicatorCssClassCount = function() {
		this._$el
			.removeClass()
			.addClass(this.cssClasses.progressIndicatorBar)
			.addClass(this.cssClassChildCountPrefix + this._indicators.length);
		return this;
	};

	/**
	 * @returns {Boolean} true if tooltip already exists on the progress indicator bar, false otherwise.
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype._tooltipExists = function() {
		return DWL_Utils.isNullOrUndefined(this._$el.tooltip('instance')) === false;
	};

	/**
	 * @returns {Boolean} true if tooltip message was passed in during construction, false otherwise.
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype._tooltipMessageExists = function() {
		return DWL_Utils.isNullOrUndefined(this.tooltipMessage) === false;
	};

	/**
	 * Adds a tooltip to its DOM element if one does not already exist and a tooltipMessage was supplied.
	 * @returns {ProgressIndicatorBar} itself for chaining.
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype._tooltipify = function() {
		var self = this;
		if (self._tooltipExists() === true || self._tooltipMessageExists() === false) {
			return self;
		}
		self._$el.tooltip({
			content: self.tooltipMessage,
			tooltipClass: self.cssClasses.tooltip,
			track: true
		});
		return self;
	};

	/**
	 * Adds the progressIndicators to the progress indicator bar, and changes each inidcator's element css class to reflect the 
	 * number of progressIndicators added.
	 * Note: the order in which these progressIndicators are added to the progress bar dictates the order in which they will 
	 * appear in the DOM.
	 * @param   {ProgressIndicator[]} indicators - a list of {@link ProgressIndicator} to add to the progress indicator bar.
	 *											 Null or undefined will be interpreted as an empty collection.
	 * @returns {ProgressIndicatorBar} itself for chaining.
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype.addIndicators = function(indicators) {
		this._indicators.push.apply(this._indicators, indicators || []);
		return this._updateIndicatorCssClassCount();
	};

	/**
	 * @returns {ProgressIndicatorBar[]} a list of {@link ProgressIndicator} in this progress indicator bar or empty array.
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype.getIndicators = function() {
		return this._indicators.slice();
	};

	/**
	 * Renders the progress indicator bar onto its el.
	 * @returns {ProgressIndicatorBar} itself for chaining.
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype.render = function() {
		this._$el
			.empty()
			.addClass(this.cssClasses.progressIndicatorBar)
			.append(this._getIndicatorElements.bind(this))
			.show();
		return this._tooltipify();
	};

	/**
	 * Removes all its indicators, clears out its dom and loses its reference to el.
	 * @returns {ProgressIndicatorBar} itself for chaining.
	 * @memberof DWL_Utils.Component.ProgressIndicatorBar
	 */
	ProgressIndicatorBar.prototype.remove = function() {
		this._removeIndicators()
			._$el.empty();
		delete this.el;
		delete this._$el;
		return this;
	};

	global.DWL_Utils = global.DWL_Utils || {};
	global.DWL_Utils.Component = global.DWL_Utils.Component || {};

	// exports
	global.DWL_Utils.Component.ProgressIndicatorBar = ProgressIndicatorBar;
}).call(this);