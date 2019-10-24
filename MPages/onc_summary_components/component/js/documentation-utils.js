
/**
 * Dyn Doc Sanitization Utilities
 * Contains various functions for sanitization of content
 * Logic has been carried over from Dynamic Documentation
 */
(function(){
	window.DocumentationUtils = {};

	/**
	 * Returns the DocUtilsHelper Win32 COM object
	 * @return {Object} DocUtilsHelper Win32 Utility
	 */
	DocumentationUtils.getDocUtilsHelper = function() {
		//Share COM object with CKEDITOR if it is present on page (done to avoid pulling in unnecessary CKEDITOR code)
		var utilContainer = CKEDITOR ? CKEDITOR : window;
		if(!utilContainer.DocUtilsHelper) {
			utilContainer.DocUtilsHelper = CERN_Platform.getDiscernObject("DOCUTILSHELPER");
		}
		return utilContainer.DocUtilsHelper;
	};

	/**
	 * Sanitize the passed HTML using the DOCUTILSHELPER CleanHtml function
	 * @param  {String} html HTML string to sanitize
	 * @return {String}      sanitized HTML string
	 */
	DocumentationUtils.cleanHtml = function(html){
		var DocUtilsHelper = DocumentationUtils.getDocUtilsHelper();
		var sanitizedHtml = "";
		if(typeof DocUtilsHelper !== "undefined" && typeof DocUtilsHelper.CleanHtml !== "undefined"){
			//wraps the html in a div as CleanHtml cleans innerHtml when second argument is true
			sanitizedHtml = DocUtilsHelper.CleanHtml("<div>" + html + "</div>", true);
		}
		else {
			throw new Error("DocUtilsHelper or DocUtilsHelper.CleanHtml undefined");
		}
		return sanitizedHtml;
	};

	/**
	 * Returns full XHTML string containing passed html within body
	 * @param  {String} html HTML to be contained within the HTML body
	 * @return {String}      Full XHTML string
	 */
	DocumentationUtils.getXHtml = function(html){
		return '<?xml version="1.0"?><html><head><title></title></head><body>' + html + "</body></html>";
	};

	/**
	 * Returns the currently selected HTML within the passed window
	 * Function has been brought over from Phys Doc (http://ipvmphysdoc03:8080/source/xref/WIN32/CPP/PvNotesRes/js/preview.js#280)
	 * @param  {Document}   HTML Document to check for currently selected HTML
	 * @param  {Window}     HTML Window to check for currently selected HTML
	 * @return {String}     String containing currently selected HTML
	 */
	DocumentationUtils.getSelectedHtml = (function(){
		var srcDocument;
		var srcWindow;

		function getComputedElementStyle(element, styleName) {
			var style;
			if (srcWindow.getSelection) {
				style = srcWindow.getComputedStyle(element);
				return style.getPropertyValue(styleName);
			}
			else {
				style = element.currentStyle;
				return style[styleName];
			}
		}

		var getDefaultStyle = (function() {
			var defaultsCache = {};

			/**
			* Get the default style for a styleName on a given element
			* @lends getDefaultStyle
			* @param {string} tagName tag to get default style for
			* @param {string} styleName style to get default for
			* @return {string} Default computed style for the element and style
			*/
			return function(tagName, styleName) {
				tagName = tagName.toLowerCase();
				styleName = styleName.toLowerCase();

				var tagDefaults = defaultsCache[tagName];
				if (tagDefaults && tagDefaults.hasOwnProperty(styleName)) {
					return tagDefaults[styleName];
				}

				var dummy = srcDocument.createElement(tagName);
				if (srcDocument.documentMode && srcDocument.documentMode < 9) {
					$(dummy).css({
						position:   "absolute",
						visibility: "hidden",
						top:        0,
						left:       0
					}).appendTo(srcDocument.body);
				}

				var def = getComputedElementStyle(dummy, styleName);
				$(dummy).remove();
				if (!tagDefaults) {
					tagDefaults = defaultsCache[tagName] = {};
				}
				tagDefaults[styleName] = def;
				return def;
			};
		})();

		//Used to determine which styles should be retained when saving tagged taxt
		var isStyleOk = (function() {
			var STYLE_WHITELIST = [
				"color",
				"text-decoration",
				"text-align",
				"vertical-align",
				"box-sizing",
				"direction",
				"kerning",
				"letter-spacing",
				"word-spacing",
				"line-break",
				"word-break",
				"line-height",
				"white-space",
				"table-layout",
				"text-transform"
			];
			var STYLE_WHITELIST_OTHER_REGEX = /(?:^font)|(?:^border)|(?:^margin)|(?:^padding)/i;
			// Create a lookup
			var STYLE_WHITELIST_LOOKUP = {};
			var whitelistLength = STYLE_WHITELIST.length;
			for (var i = 0; i < whitelistLength; i++) {
				var styleName = STYLE_WHITELIST[i];
				STYLE_WHITELIST_LOOKUP[styleName] = 1;
				// Store both dash-separated styles and camelCase styles
				var altName = styleName.replace(/-([a-z])/g, function(match, p1) { return p1.charAt(0).toUpperCase(); });
				STYLE_WHITELIST_LOOKUP[altName] = 1;
			}
			/**
			 * @lends isStyleOk
			 * @param {string} styleName name of style to check
			 * @return {boolean} Whether the filter should be kept or filtered
			 */
			return function(styleName) {
				styleName = styleName.toLowerCase();
				return STYLE_WHITELIST_LOOKUP[styleName] || STYLE_WHITELIST_OTHER_REGEX.test(styleName);
			};
		})();

		/**
		 * Copy CSS styles from one element to another
		 * @param {HTMLElement} src Element to copy styles from
		 * @param {HTMLElement} dest Element to copy styles to
		 */
		function copyStyles(src, dest) {
			var style;
			var styleName;
			var styleValue;
			var styleCnt;
			if (srcWindow.getSelection) {  // Standard JS
				// Get the style of the parent element of the tagged text using getComputedStyle for IE 9 and above
				style = srcWindow.getComputedStyle(src);
				styleCnt = style.length;
				for (var propIndex = 0; propIndex < styleCnt; propIndex++) {
					styleName = style[propIndex];
					if (!isStyleOk(styleName)) {
						continue;
					}

					styleValue = style.getPropertyValue(styleName);
					if (getDefaultStyle(dest.tagName, styleName) === styleValue) {
						continue;
					}

					dest.style.setProperty(styleName, styleValue, "");
				}
			}
			else {  // Old IE
				// Get the style of the parent element of the tagged text using currentStyle property for IE 8 and below
				style = src.currentStyle;
				for (styleName in style) {
					if (!isStyleOk(styleName)) {
						continue;
					}

					styleValue = style[styleName];
					if (getDefaultStyle(dest.tagName, styleName) === styleValue) {
						continue;
					}

					dest.style.setAttribute(styleName, styleValue);
				}
			}
		}

		/**
		 * @return {string} The HTML for the selected text
		 */
		function getSelectedHtml() {
			var html = "";
			var container = srcDocument.createElement("div");
			var parentElem;
			var selectionRangeCount;
			if (typeof srcWindow.getSelection != "undefined" && srcWindow.getSelection().toString() !== "" && (!srcDocument.documentMode || srcDocument.documentMode >= 9)) {
				var sel = srcWindow.getSelection();
				selectionRangeCount = sel.rangeCount;
				if (selectionRangeCount) {
					for (var i = 0, len = selectionRangeCount; i < len; ++i) {
						parentElem = sel.getRangeAt(i).commonAncestorContainer;
						//Find closest ancestor that is an element node
						while (parentElem.nodeType !== 1) {
							parentElem = parentElem.parentNode;
						}
						copyStyles(parentElem, container);

						// Once we have the style of the parent, get the child and its style using range.cloneContents()
						container.appendChild(sel.getRangeAt(i).cloneContents());
					}
					html = container.outerHTML;
				}
			}
			else if (typeof srcDocument.selection !== "undefined" && srcDocument.selection.type === "Text" && srcDocument.selection.createRange().text !== "" && srcDocument.documentMode < 9) {
				parentElem = srcDocument.selection.createRange().parentElement();
				//Find closest ancestor that is an element node
				while (parentElem.nodeType !== 1) {
					parentElem = parentElem.parentNode;
				}

				copyStyles(parentElem, container);

				// Once we have the style of the parent, get the child and its style using range.htmlText
				container.innerHTML = srcDocument.selection.createRange().htmlText;
				html = container.outerHTML;
			}
			return html;
		}

		return function(sourceDocument, sourceWindow){
			srcWindow = sourceWindow;
			srcDocument = sourceDocument;
			return getSelectedHtml();
		};
	})();
})();
