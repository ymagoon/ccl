(function() {
	'use strict';
	var oGlobal = this,
		/**
		 * A general purpose container.
		 * @constructor Container
		 * @param {!Object} oProps                     - properties to set on this instance.
		 * @param {!Object} oProps.oEl                 - the dom element to assign to this container
		 * @param {?String} [oProps.sCssClasses=null] - space delimited css classes to apply to this container
		 * @prop  {Object} oEl                        - the dom element to assign to this container received from oProps.oEl
		 * @memberof DWL_Utils.Component
		 */
		Container = function(oProps) {
			var oConfig = $.extend({}, oProps),
				oEl = oConfig.oEl,
				$el = $(oEl).addClass(oConfig.sCssClasses || null);
			$.extend(this, {
				/**
				 * An array of this container's childrens' dom elements. DO NOT access directly, use 
				 * {@link Container#fnGetChildren} instead.
				 * @private
				 * @memberof DWL_Utils.Component.Container#
				 */
				_aoChildren: [],
				/**
				 * Jqueryfied version of this container DOM element. DO NOT access directly, use 
				 * {@link Container#oEl} instead.
				 * @private
				 * @memberof DWL_Utils.Component.Container#
				 */
				_$el: $el,
				oEl: oEl
			});
		};

	/**
	 * Assign dom elements as this container's children. Note: the order in which children are added is the order
	 * in which they appear in DOM.
	 * @param {Object[]} aoChildElements - an array of the dom elements to assign as children of this container.
	 *                                     Null or undefined will be interpreted as an empty array.
	 * @returns {Container} itself for chaining.
	 * @memberof DWL_Utils.Component.Container
	 */
	Container.prototype.fnAddChildren = function(aoChildElements) {
		this._aoChildren.push.apply(this._aoChildren, aoChildElements || []);
		return this;
	};

	/**
	 * @returns {Object[]} an array of this container's childrens' dom elements.
	 * @memberof DWL_Utils.Component.Container
	 */
	Container.prototype.fnGetChildren = function() {
		return this._aoChildren.slice();
	};

	/**
	 * Renders the container and its child elements onto its element.
	 * @returns {Container} itself for chaining.
	 * @memberof DWL_Utils.Component.Container
	 */
	Container.prototype.fnRender = function() {
		this._$el
			.empty()
			.append(this._aoChildren);
		return this;
	};

	oGlobal.DWL_Utils.Component.Container = Container;
}).call(this);