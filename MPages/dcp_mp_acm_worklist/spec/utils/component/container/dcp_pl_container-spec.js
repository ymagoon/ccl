(function() {
	'use strict';
	var Container = DWL_Utils.Component.Container;
	describe('A container', function() {
		it('should take in its dom element during constructor', function() {
			var oProps = {
					oEl: sandbox()
				},
				oContainer = new Container(oProps);
			expect(oContainer.oEl).toBe(oProps.oEl);
		});
		it('should add the cssClasses received during construction onto its DOM element', function() {
			var oProps = {
					oEl: sandbox(),
					sCssClasses: 'css-class'
				},
				oContainer = new Container(oProps);
			expect(oContainer.oEl).toHaveClass(oProps.sCssClasses);
		});
		it('should accept all its children dom elements during construction', function() {
			var aoChildren = [{}, {}],
				oProps = {
					oEl: sandbox()
				},
				oContainer = new Container(oProps);
			expect(oContainer.fnGetChildren()).toEqual([]);
			oContainer.fnAddChildren(aoChildren);
			expect(oContainer.fnGetChildren()).not.toEqual(oProps.aoChildren);
		});
		describe('render function', function() {
			it('should render itself to its element along with all its children', function() {
				var aoChildren = [
						document.createElement('div'),
						document.createElement('div')
					],
					oProps = {
						oEl: sandbox()
					},
					oContainer = new Container(oProps);
				expect(oContainer.oEl).toBeEmpty();
				oContainer
					.fnAddChildren(aoChildren)
					.fnRender();
				expect(oContainer.oEl).not.toBeEmpty();
				aoChildren.forEach(function(oChild) {
					expect(oContainer.oEl).toContainElement(oChild);
				});
			});
		});
	});
})();