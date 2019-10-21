(function() {
	'use strict';
	var Header = DWL_Utils.Component.Header,
		MultiHeader = DWL_Utils.Component.MultiHeader;
	describe('A Header', function() {
		it('can be created', function() {
			var oHeader = new Header();
			expect(oHeader).toBeDefined();
		});
		it('accepts its dom element during construction', function() {
			var oProp = {
					oEl: sandbox()
				},
				oHeader = new Header(oProp);
			expect(oHeader.oEl).toBe(oProp.oEl);
		});
		it('adds css classes received during construction onto its element', function() {
			var oProp = {
					oEl: sandbox(),
					oCssClasses: {
						sEl: 'cssClass-el'
					}
				},
				oHeader = new Header(oProp);
			expect(oHeader.oEl).toHaveClass(oProp.oCssClasses.sEl);
		});
		describe('render function', function() {
			it('renders the header text it accepted during construction', function() {
				var oProp = {
						oEl: sandbox(),
						sText: 'some text'
					},
					oHeader = new Header(oProp);
				expect(oHeader.oEl).not.toContainText(oProp.sText);
				oHeader.fnRender();
				expect(oHeader.oEl).toContainText(oProp.sText);
			});
			it('creates a header depending on what level was passed in during construction', function() {
				var oProp = {
						oEl: sandbox(),
						iLevel: 55
					},
					sExpectedHeaderTag = 'h' + oProp.iLevel,
					oHeader = new Header(oProp);
				expect(oHeader.oEl).not.toContainElement(sExpectedHeaderTag);
				oHeader.fnRender();
				expect(oHeader.oEl).toContainElement(sExpectedHeaderTag);
				expect(oHeader.fnGetHeaderElement()).toBeMatchedBy(sExpectedHeaderTag);
			});
			it('adds css classes received during construction onto its header element', function() {
				var oProp = {
						oEl: sandbox(),
						oCssClasses: {
							sHeader: 'cssClass-header'
						}
					},
					oHeader = new Header(oProp);
				expect(oHeader.oEl).not.toContainElement('.' + oProp.oCssClasses.sHeader);
				oHeader.fnRender();
				expect(oHeader.oEl).toContainElement('.' + oProp.oCssClasses.sHeader);
			});
		});
	});
	describe('A multi header', function() {
		it('can aggregate more than one header', function() {
			var oHeader1 = {},
				oHeader2 = {},
				oMultiHeader = new MultiHeader();
			oMultiHeader.fnAddHeaders([oHeader1, oHeader2]);
			expect(oMultiHeader.fnGetHeaders()).toContain(oHeader1);
			expect(oMultiHeader.fnGetHeaders()).toContain(oHeader2);
		});
		it('adds css classes received during construction onto its element', function() {
			var oProp = {
					oEl: sandbox(),
					sCssClasses: 'cssClass-el'
				},
				oMultiHeader = new MultiHeader(oProp);
			expect(oMultiHeader.oEl).toHaveClass(oProp.sCssClasses);
		});
		describe('render function', function() {
			it('should render its header elements onto its DOM element', function() {
				var oProp = {
						oEl: sandbox()
					},
					oHeader1Id = 'header1',
					oHeader2Id = 'header2',
					oHeader1 = jasmine.createSpyObj('header1', ['fnRender', 'fnGetHeaderElement']),
					oHeader2 = jasmine.createSpyObj('header2', ['fnRender', 'fnGetHeaderElement']),
					oMultiHeader = new MultiHeader(oProp);
				oHeader1.fnRender.and.returnValue(oHeader1);
				oHeader2.fnRender.and.returnValue(oHeader2);
				oHeader1.fnGetHeaderElement.and.returnValue($('<div></div>', {
					id: oHeader1Id
				}));
				oHeader2.fnGetHeaderElement.and.returnValue($('<div></div>', {
					id: oHeader2Id
				}));

				oMultiHeader.fnAddHeaders([oHeader1, oHeader2]);
				oMultiHeader.fnRender();

				expect(oHeader1.fnRender).toHaveBeenCalled();
				expect(oHeader2.fnRender).toHaveBeenCalled();
				expect(oHeader1.fnGetHeaderElement).toHaveBeenCalled();
				expect(oHeader2.fnGetHeaderElement).toHaveBeenCalled();

				expect(oMultiHeader.oEl).toContainElement('#' + oHeader1Id);
				expect(oMultiHeader.oEl).toContainElement('#' + oHeader2Id);
			});
		});
	});
})();