Ext.define("MPAGE.view.Results", {
	extend: 'univnm.ext.SupaGrid',
	alias:'widget.resultgrid',
	events:{
	
	},
	paged:true,
	pageSize:20,
	variables:{},
	result:[],
	
	initComponent:function(config){
		var columns = this.result.columns
		var data = this.result.data
		
		
		this.columns=[{
			dataIndex:"$num", 
			text:"#",
			width:25
		}].concat(columns.map(function(col){
			return {dataIndex:col.name}	
		})).map(function(col){
			return Ext.applyIf(col,{
				text:col.dataIndex,
				renderer:function(val){
					if (val && val instanceof Date){
						return val.format("m/d/Y H:i:s")	
					} else {
						return String(val).left(100).escapeHtml()	
					}
				}	
			})
		})
		this.callParent(arguments);
		
		
	}
})