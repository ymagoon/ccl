(function() {
	'use strict';
	var global = this,
		/** @namespace {Object} DWL_Utils.Component.ProgressIndicator */
		ProgressIndicator = global.DWL_Utils.Component.ProgressIndicator || {};

	global.DWL_Utils.Component.ProgressIndicator = ProgressIndicator;
}).call(this);

(function() {
	'use strict';
	var global = this,
		/**
		 * Creates a ProgressIndicatorImage that represents the image accompanying a {@link ProgressIndicator}.
		 * @constructor ProgressIndicatorImage
		 * @param {Object} props                                       - initial properties to set to the instance.
		 * @param {String} props.path                                  - the path to the image.
		 * @param {String} [props.cssClasses='progressIndicatorImage'] - the css class name(s) to apply to the ProgressIndicatorImage.
		 * @prop  {String} path                                        - path received from props.path
		 * @prop  {String} cssClasses                                  - list of css classes received from props.cssClasses or defaults
		 * @memberof DWL_Utils.Component.ProgressIndicator
		 */
		ProgressIndicatorImage = function(props) {
			var overwriteableDefaults = {
				/** @public */
				cssClasses: 'progressIndicatorImage'
			};
			$.extend(this, overwriteableDefaults, props);
		};

	// export
	global.DWL_Utils.Component.ProgressIndicator.ProgressIndicatorImage = ProgressIndicatorImage;
}).call(this);

(function() {
	'use strict';
	var global = this,
		/**
		 * Creates a new ProgressIndicator which holds a non-interactive {@link StaticProgressState}.
		 * @constructor ProgressIndicator
		 * @alias StaticProgressIndicator
		 * @param {Object} props                          - initial properties to set to the instance.
		 * @param {Object} props.el                       - the html element to render this progress indicator in.
		 * @param {Object} [props.cssClasses]             - the space delimited list of css classes to apply.
		 * @param {String} [props.cssClasses.progressIndicator='progressIndicator']       - class name(s) for the progress indicator element.
		 * @param {String} [props.cssClasses.indicatorMessage='progressIndicatorMessage'] - class name(s) for the progress indicator message element.
		 * @param {ProgressIndicatorImage} [props.img]    - the image to accompany the ProgressIndicator.
		 * @prop  {Object} el                             - element received from props.el
		 * @prop  {Object} cssClasses                     - list of css classes received from props.cssClasses or defaults
		 * @prop  {String} cssClasses.progressIndicator   - list of css classes received from props.cssClasses.progressIndicator or defaults
		 * @prop  {String} cssClasses.indicatorMessage    - list of css classes received from props.cssClasses.indicatorMessage or defaults
		 * @memberof DWL_Utils.Component.ProgressIndicator
		 */
		ProgressIndicator = function(props) {
			var DEEP_COPY = true,
				privateState = {
					/**@private*/
					_state: null
				},
				overwriteableDefaults = {
					/**@public*/
					cssClasses: {
						progressIndicator: 'progressIndicator',
						indicatorMessage: 'progressIndicatorMessage'
					}
				};
			$.extend(DEEP_COPY, this, overwriteableDefaults, props, privateState);
			/**@private*/
			this._$el = $(this.el);
		};

	/**
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicator.ProgressIndicator
	 * @return {Boolean} true if this instance has a non-null, non-undefined progress state, false otherwise.
	 */
	ProgressIndicator.prototype._hasState = function() {
		return DWL_Utils.isNullOrUndefined(this._state) === false;
	};

	/**
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicator.ProgressIndicator
	 * @return {Boolean} true if this instance has a non-null, non-undefined message, false otherwise.
	 */
	ProgressIndicator.prototype._hasMessage = function() {
		return this._hasState() === true && DWL_Utils.isNullOrUndefined(this._state.message) === false;
	};

	/**
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicator.ProgressIndicator
	 * @return {Object} a jQuery object that represents the html element for the progress indicator image.
	 */
	ProgressIndicator.prototype._createImageTag = function() {
		var doesImageExist = DWL_Utils.isNullOrUndefined(this.img) === false &&
			DWL_Utils.isNullOrUndefined(this.img.path) === false;
		return doesImageExist ?
			$('<img>', {
				src: this.img.path,
				addClass: this.img.cssClasses
			}) : $();
	};

	/**
	 * Renders the current state, if available, into the dom element el.
	 * @see precondition of {@link ProgressIndicator#transition}.
	 * @public
	 * @memberof DWL_Utils.Component.ProgressIndicator.ProgressIndicator
	 * @returns {ProgressIndicator} returns itself for chaining.
	 */
	ProgressIndicator.prototype.render = function() {
		if (this._hasMessage() === false) {
			return this;
		}
		var $messageSpan = $('<span>', {
				text: this._state.message,
				addClass: this.cssClasses.indicatorMessage
			}),
			$image = this._createImageTag();
		this._$el
			.empty()
			.addClass([
				this.cssClasses.progressIndicator,
				this._state.cssClasses
			].join(' '))
			.append($image, $messageSpan)
			.show();
		return this;
	};

	/**
	 * @public
	 * @memberof DWL_Utils.Component.ProgressIndicator.ProgressIndicator
	 * @returns {ProgressState} the current state contained by the ProgressIndicator.
	 */
	ProgressIndicator.prototype.getCurrentState = function() {
		return this._state;
	};

	/**
	 * @public
	 * @memberof DWL_Utils.Component.ProgressIndicator.ProgressIndicator
	 * @param {Object} state - the state to check for renderability by this ProgressIndicator.
	 * @returns {Boolean} true if the state can be rendered by this ProgressIndicator, false otherwise.
	 */
	ProgressIndicator.prototype.canRender = function(state) {
		return DWL_Utils.isNullOrUndefined(state.message) === false;
	};

	/**
	 * Transitions the progress indicator to a new state.
	 * Its precondition is that {@link ProgressIndicator#canRender} must be true for newState.
	 * @public
	 * @memberof DWL_Utils.Component.ProgressIndicator.ProgressIndicator
	 * @param   {ProgressState} newState - the new state to transition to.
	 * @returns {ProgressIndicator} returns itself for chaining.
	 */
	ProgressIndicator.prototype.transition = function(newState) {
		this._state = newState;
		return this;
	};

	/**
	 * Removes the progress indicator, empties out its dom and forgets its state. It is highly recommended 
	 * to call remove before you change the reference of this ProgressIndicator. That's because there could
	 * be internal state and events that need cleaning up to avoid memory leaks.
	 * @public
	 * @memberof DWL_Utils.Component.ProgressIndicator.ProgressIndicator
	 * @returns {ProgressIndicator} returns itself for chaining.
	 */
	ProgressIndicator.prototype.remove = function() {
		this._state = null;
		this._$el.empty();
		delete this.el;
		delete this._$el;
		return this;
	};

	// exports
	global.DWL_Utils.Component.ProgressIndicator.StaticProgressIndicator = ProgressIndicator;
}).call(this);

(function() {
	'use strict';
	var global = this,
		StaticProgressIndicator = global.DWL_Utils.Component.ProgressIndicator.StaticProgressIndicator,
		/**
		 * Creates a new RangedProgressIndicator that can hold a {@link RangedProgressState}.
		 * @constructor RangedProgressIndicator
		 * @augments ProgressIndicator
		 * @param {Object} props                          - see [ProgressIndicator#constructor]{@link ProgressIndicator}
		 * @param {Object} props.el                       - see [ProgressIndicator#constructor]{@link ProgressIndicator}
		 * @param {Object} [props.cssClasses]             - the space delimited list of css classes to apply.
		 * @param {String} [props.cssClasses.indicatorRange='progressIndicatorRange'] - the css class name(s) for the progress indicator range element.
		 * @prop  {Object} el                             - element received from props.el
		 * @prop  {Object} cssClasses                     - list of css classes received from props.cssClasses or defaults
		 * @prop  {String} cssClasses.indicatorRange      - list of css classes received from props.cssClasses.indicatorRange or defaults
		 * @memberof DWL_Utils.Component.ProgressIndicator
		 */
		RangedProgressIndicator = function(props) {
			var DEEP_COPY = true,
				overwriteableDefaults = {
					/** @public */
					cssClasses: {
						indicatorRange: 'progressIndicatorRange'
					}
				};
			StaticProgressIndicator.call(this, $.extend(DEEP_COPY, {}, overwriteableDefaults, props));
		};

	RangedProgressIndicator.prototype = new StaticProgressIndicator();

	/**
	 * @private
	 * @memberof DWL_Utils.Component.ProgressIndicator.RangedProgressIndicator
	 * @returns {String} the html string for the progress state.
	 */
	RangedProgressIndicator.prototype._generateProgressHtml = function() {
		return '(' +
			i18n.rwl.progressxOfY
			.replace('{45}', this._state.finished)
			.replace('{46}', this._state.total) +
			')';
	};

	/**
	 * @public
	 * @memberof DWL_Utils.Component.ProgressIndicator.RangedProgressIndicator
	 * @inheritdoc
	 */
	RangedProgressIndicator.prototype.canRender = function(state) {
		return StaticProgressIndicator.prototype.canRender(state) === true &&
			DWL_Utils.isNullOrUndefined(state.finished) === false &&
			DWL_Utils.isNullOrUndefined(state.total) === false;
	};

	/**
	 * It stops listening to changes on the old state.
	 * Its precondition is that {@link RangedProgressIndicator#canRender} must be true for newState.
	 * @public
	 * @memberof DWL_Utils.Component.ProgressIndicator.RangedProgressIndicator
	 * @inheritdoc
	 */
	RangedProgressIndicator.prototype.transition = function(newState) {
		$(this._state).off();
		StaticProgressIndicator.prototype.transition.call(this, newState);
		$(newState).on('change', this.render.bind(this));
		return this;
	};

	/**
	 * @see precondition of {@link RangedProgressIndicator#transition}.
	 * @listens RangedProgressState#change
	 * @public
	 * @memberof DWL_Utils.Component.ProgressIndicator.RangedProgressIndicator
	 * @inheritdoc
	 */
	RangedProgressIndicator.prototype.render = function() {
		var self = this;
		if (self._hasMessage() === false) {
			return self;
		}

		StaticProgressIndicator.prototype
			.render.call(self)
			._$el.append($('<span>', {
				text: self._generateProgressHtml.bind(self),
				addClass: self.cssClasses.indicatorRange
			}));
		return self;
	};

	/**
	 * Stops listening to the RangedProgressState#change event.
	 * @public
	 * @memberof DWL_Utils.Component.ProgressIndicator.RangedProgressIndicator
	 * @inheritdoc
	 */
	RangedProgressIndicator.prototype.remove = function() {
		$(this._state).off();
		StaticProgressIndicator.prototype.remove.call(this);
		return this;
	};

	// export
	global.DWL_Utils.Component.ProgressIndicator.RangedProgressIndicator = RangedProgressIndicator;
}).call(this);