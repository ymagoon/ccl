Ext.define("MPAGE.view.ExtPane", {
	extend: 'Ext.form.Panel',
	alias:"widget.ext_pane",
	requires: [
		"MPAGE.ux.CodeMirror"
	],
	
	title:"Ext Code",
	layout: {
		type:'vbox',
		align:"stretch"
	}, 
	bbar:[{
		text:"to SQL",
		iconCls:"icon_to_sql",
		handler:function(b){
			var v  = b.up("ext_pane")
			v.fireEvent("to_sql",{
				src:v,
				code:v.form.findField("code").getValue()
			})
		}
	}],
	items:[{
		xtype: "codemirror",
		flex:1,
		name:"code",
		options:{
			lineNumbers: true,
			matchBrackets: true,
			theme:"rubyblue",
			indentUnit: 4,
			mode: "text/x-javascript"
		}
		
		
			
	}]
});