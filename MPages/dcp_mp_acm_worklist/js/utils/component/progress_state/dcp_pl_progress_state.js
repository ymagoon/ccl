(function() {
	'use strict';
	var global = this,
		/** @namespace {Object} DWL_Utils.Component.ProgressState */
		ProgressState = global.DWL_Utils.ProgressState || {};

	global.DWL_Utils.Component.ProgressState = ProgressState;
}).call(this);

(function() {
	'use strict';
	var global = this,
		/**
		 * Creates a new ProgressState. A general progress state holds unmodifiable state.
		 * @constructor ProgressState
		 * @alias StaticProgressState
		 * @param {Object}  props             - properties to set on a new instance.
		 * @param {String}  props.message     - the display message associated with this state.
		 * @param {Boolean} [props.complete=false]  - indicates whether the progress state is in complete state.
		 * @param {String}  [props.cssClasses=null] - the css classes that this progress state's view should apply to itself.
		 * @prop  {String}  message           - value received from props.message.
		 * @prop  {Boolean} complete          - value received from props.complete or default.
		 * @prop  {String}  cssClasses        - value received from props.cssClasses or default.
		 * @memberof DWL_Utils.Component.ProgressState
		 */
		ProgressState = function(props) {
			var overwriteableDefaults = {
				/** @public */
				complete: false,
				/** @public */
				cssClasses: null
			};
			$.extend(this, overwriteableDefaults, props);
		};

	// exports
	global.DWL_Utils.Component.ProgressState.StaticProgressState = ProgressState;
}).call(this);

(function() {
	'use strict';
	var global = this,
		StaticProgressState = global.DWL_Utils.Component.ProgressState.StaticProgressState,
		/**
		 * Creates a new RangedProgressState. This progress can keep track of how much progress 
		 * has been made by tracking finished progress and total progress.
		 * @constructor RangedProgressState
		 * @augments ProgressState
		 * @param {Object} props          - properties to set on a new instance.
		 * @param {Number} props.finished - the amount of progress completed.
		 * @param {Number} props.total    - the total amount of progress to be made.
		 * @prop  {Number} finished       - value received from props.finished
		 * @prop  {Number} total          - value received from props.total
		 * @memberof DWL_Utils.Component.ProgressState
		 */
		RangedProgressState = function(props) {
			StaticProgressState.call(this, props);
		};

	RangedProgressState.prototype = new StaticProgressState();

	/**
	 * Increments the value of the finished state by one if it's less than the total progress, else
	 * sets the progress state property to complete.
	 * @public
	 * @memberof RangedProgressState
	 * @fires RangedProgressState#change
	 * @returns {RangedProgressState} itself for chaining.
	 */
	RangedProgressState.prototype.incrementFinished = function() {
		var self = this;
		if (self.finished + 1 >= self.total) {
			self.complete = self.complete || true;
		}
		if (self.finished < self.total) {
			self.finished++;
			/**
			 * Event to signify changes on the state of {@link RangedProgressState}.
			 * @event RangedProgressState#change
			 */
			$(self).trigger('change');
		}
		return self;
	};

	// exports
	global.DWL_Utils.Component.ProgressState.RangedProgressState = RangedProgressState;
}).call(this);