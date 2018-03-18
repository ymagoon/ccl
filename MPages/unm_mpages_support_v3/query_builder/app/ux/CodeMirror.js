Ext.define("MPAGE.ux.CodeMirror", {
	extend: 'Ext.form.field.TextArea',
	alias:"widget.codemirror",
	requires: [
	
	],
	setValue:function(val){
		if (this.codeMirror){
			this.codeMirror.setValue(val);
		}
		Ext.form.field.TextArea.prototype.setValue.apply(this,Array.parse(arguments));
	},
	setRawValue:function(val){
		var cm = this.codeMirror;
		if (cm){
			cm.setValue(val+"\n");
			var lc =cm.lineCount();
			cm.setCursor(lc-1,10000);
			window.setTimeout(function(){
				var pos =cm.cursorCoords();
				cm.scrollTo(pos.x,pos.y);
			});
			
		}
		Ext.form.field.TextArea.prototype.setRawValue.apply(this,Array.parse(arguments));
	},
	getValue:function(){
		if (this.codeMirror){
			return this.codeMirror.getValue();
		} else {
			return Ext.form.field.TextArea.prototype.setValue.call(this);
		}
	},
	getRawValue:function(){
		if (this.codeMirror){
			return this.codeMirror.getValue();
		} else {
			return Ext.form.field.TextArea.prototype.getRawValue.call(this);
		}
	},
	constructor:function(config){
		this.callParent(arguments);
		this.on("afterrender",function(ta){
			ta.codeMirror = CodeMirror.fromTextArea(
				ta.getEl().dom,
				Ext.apply(
					{
						onChange:function(cm){
							ta.fireEvent("change",ta,cm.getValue());
						},
						extraKeys:{
						}
					},
					ta.options||{}
				)
			);
			window.setTimeout(function(){
				ta.codeMirror.focus();
			},100);
			
			var panel = ta.up("sql");
			if (ta.value) ta.codeMirror.setValue(ta.value);
		});
		
		this.on("resize",function(panel,w,h){
			var el =panel.getEl();
			var scroller =el.up("div").down(".CodeMirror-scroll");
			if (scroller) {
				scroller.setHeight(h);
				scroller.setWidth(w);
				panel.codeMirror.refresh();
			}
		});
	}
			
});