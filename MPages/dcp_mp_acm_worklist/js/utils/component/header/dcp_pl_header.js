(function() {
	'use strict';
	var oGlobal = this,
		B_DEEP_COPY = true,
		/**
		 * Creates a Header.
		 * @constructor Header
		 * @param {Object} oProps                - initial properties to set to the instance.
		 * @param {Object} oProps.oEl            - the dom element to create this Header within.
		 * @param {String} oProps.sText          - the text to display in the header. Null or undefined will be interpreted
		 *                                         as empty text.
		 * @param {Number} [oProps.iLevel=1]     - the level of header to create. For example: level 1 creates an h1, 
		 *                                         2 creates h2, 3 creates h3 and so on. The default level is 1.
		 * @param {Object} [oProps.oCssClasses]  - namespace for css classes of various components.
		 * @param {String} [oProps.oCssClasses.sEl=null]     - space delimited list of css class names for the oEl
		 * @param {String} [oProps.oCssClasses.sHeader=null] - space delimited list of css class names for the header element
		 *
		 * @prop  {Object} oEl                   - the dom element create a Header within received from oProps.oEl
		 * @memberof DWL_Utils.Component
		 */
		Header = function(oProps) {
			var oConfig = $.extend(B_DEEP_COPY, {}, oProps),
				oEl = oConfig.oEl,

				oCssClasses = oConfig.oCssClasses || {},
				sHeaderClasses = oCssClasses.sHeader || null,
				sElClasses = oCssClasses.sEl || null,

				sText = oConfig.sText || '',
				iLevel = oConfig.iLevel || 1,

				$header = $('<h' + iLevel + '>').addClass(sHeaderClasses),
				$el = $(oEl).addClass(sElClasses);

			$.extend(this, {
				oEl: oEl,
				/**
				 * Returns the DOM object that represents the header.
				 * @returns {Object} the DOM object that represents the header.
				 * @public
				 * @memberof DWL_Utils.Component.Header
				 * @instance
				 */
				fnGetHeaderElement: function() {
					return $header.get();
				},
				/**
				 * Renders the header onto its element.
				 * @returns {Header} itself for chaining.
				 * @public
				 * @memberof DWL_Utils.Component.Header
				 * @instance
				 */
				fnRender: function() {
					$el .empty()
						.append($header.text(sText));
					return this;
				}
			});
		};

	oGlobal.DWL_Utils.Component.Header = Header;
}).call(this);

(function() {
	'use strict';
	var oGlobal = this,
		/**
		 * Creates a multi header consisting of one ore more {@link Header|Headers}.
		 * @constructor MultiHeader
		 * @param {Object} oProps                    - initial properties to set to the instance.
		 * @param {Object} oProps.oEl                - the dom element to create this MultiHeader within.
		 * @param {String} [oProps.sCssClasses=null] - the space delimited css classes to apply to the oEl.
		 * @memberof DWL_Utils.Component
		 */
		MultiHeader = function(oProps) {
			var oConfig = $.extend({}, oProps),
				oEl = oConfig.oEl,
				$el = $(oEl).addClass(oConfig.sCssClasses),
				aoHeaders = [];

			$.extend(this, {
				oEl: oEl,
				/**
				 * Adds {@link Header|Headers} to this MultiHeader. Keep in mind, the order in which these headers
				 * are added will be the order in which they will be rendered.
				 * @param {Header[]} aoNewHeaders - an array of headers to add to this MultiHeader. A null or undefined 
				 *                                  value will be interpreted as an empty array.
				 * @returns {MultiHeader} itself for chaining.
				 * @public
				 * @memberof DWL_Utils.Component.MultiHeader
				 * @instance
				 */
				fnAddHeaders: function(aoNewHeaders) {
					aoHeaders.push.apply(aoHeaders, aoNewHeaders || []);
					return this;
				},
				/**
				 * @returns {Header[]} the headers in this MultiHeader.
				 * @public
				 * @memberof DWL_Utils.Component.MultiHeader
				 * @instance
				 */
				fnGetHeaders: function() {
					return aoHeaders.slice();
				},
				/**
				 * Renders all of its headers into its DOM element.
				 * @returns {MultiHeader} itself for chaining.
				 * @public
				 * @memberof DWL_Utils.Component.MultiHeader
				 * @instance
				 */
				fnRender: function() {
					var aoHeaderElements = $.map(aoHeaders, function(oHeader) {
						return oHeader.fnRender().fnGetHeaderElement();
					});
					$el .empty()
						.append(aoHeaderElements);
					return this;
				}
			});
		};

	oGlobal.DWL_Utils.Component.MultiHeader = MultiHeader;
}).call(this);