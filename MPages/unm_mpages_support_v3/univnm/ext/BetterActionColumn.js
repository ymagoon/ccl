/* Class:  univnm.ext.BetterActionColumn
	An Ext4 ActionColumn implementation with extra features

	Detail:
		This is an extension of Ext.grid.column.Action that allows for per-row
		icon swapping and using an icon class instead of an icon URL. Width is
		also automatically set to fit the number of icons

	Topic: Examples
	(code)
		//Single Button
		...
		columns:[{
			xtype:"betteractioncolumn",
			text:"Options",
			dataIndex:"id",
			eventName:"actionAdd",
			handler:function(view,rowIndex,colIndex,item,e){
				var value = view.getStore().getAt(rowIndex).get(this.dataIndex)
				console.log("btn2 " + value)
			},
			tooltip:"col1",
			iconCls:"icon_add",

			// instead of a class can use a url
			//icon:"http://blah/blah/blah/images/delete.png",

			// Instead of a class, you can use a function that returns a class
			// Takes same paramters as a header renderer
			//getClass:function(value,meta,record){
			//	if (record.get("has_entries")) return "icon_delete"
			//	return "icon_add"
			//}

		}]
		...
		listeners:{
			actionAdd:function(data){
				alert("called 'add' against column " + data.col.dataIndex +" with value " + data.value)
			}
		}
		...
		(end)

		(code)
		//Multiple Buttons
		...
		columns:[{
			xtype:"betteractioncolumn",
			text:"Options",
			dataIndex:"id",
			items:[{
				handler:function(view,rowIndex,colIndex,item,e){
					var value = view.getStore().getAt(rowIndex).get(this.dataIndex)
					console.log("btn1 " + value)
				},
				eventName:"actionAdd",
				tooltip:"col1",
				iconCls:"icon_add"
			},{
				handler:function(view,rowIndex,colIndex,item,e){
					var value = view.getStore().getAt(rowIndex).get(this.dataIndex)
					console.log("btn2 " + value)
				},
				tooltip:"col2",
				iconCls:"icon_delete"
			}]

		}],
		...
		listeners:{
			actionAdd:function(data){
				alert("called 'add' against column " + data.col.dataIndex +" with value " + data.value)
			}
		}
		...
	(end)

	Property: eventName
		causes an event with this name to fire against the grid/tree containing
		this column when the button is clicked

		Paramters:
			data	-	Object containing event information, see *Data:* below

		Data:
			src		-	The component clicked on.
			value	-	value of the cell containing the action button
			record	-	the record in the row clicked on
			col		-	The column definition (the same as src for single buttons)
			owner	-	grid or tree that owns this column
			store	-	store that backs this view. Note this is NOT the tree store if this column is in a tree

*/
Ext.define('univnm.ext.BetterActionColumn', {
	extend: 'Ext.grid.column.Action',
	alias:'widget.betteractioncolumn',
	constructor: function(config) {
		var me = this,
			cfg = Ext.apply({}, config),
			items = cfg.items || [me]
		;

		config.width =  items.length*18
		this.callParent(arguments);

		// Items is an array property of ActionColumns
		// 	Renderer closure iterates through items creating an <DIV> element
		//	for each and tagging with an identifying
		//	class name x-action-col-{n}
		me.renderer = function(v, meta) {
			//  Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
			var args = Array.parse(arguments);
			v = Ext.isFunction(cfg.renderer) ? cfg.renderer.apply(this, arguments)||'' : '';
			if(meta){
				meta.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
			}

			return v+ items.map(function(item,i){
				item.enable = Ext.Function.bind(me.enableAction, me, [i]);
				var iconStyle ="width:16px;height:16px;float:left;cursor:pointer;"
				if (item.icon) {
					iconStyle +=" background: url("+item.icon+") 0 0 no-repeat !important;";
				}

				return new Ext.Template(
					//'<img height="16" width="16"/>',
					'<div ',
						'alt="{altText}" ',
						'class="  {disabledClass} {itemClass}"',
						'style="{style}"',
						'{toolTip}',
						'><div style="height:16px;width:16px" class="{colIconClass} {colIconIdClass}"></div></div>',
				'').apply({
					altText:item.altText || me.altText,
					icon:item.icon || Ext.BLANK_IMAGE_URL,
					colIconClass:Ext.baseCSSPrefix + 'action-col-icon',
					colIconIdClass:Ext.baseCSSPrefix + 'action-col-' + String(i),
					disabledClass:item.disabled
						? Ext.baseCSSPrefix + 'item-disabled'
						: ' ',
					itemClass:Ext.isFunction(item.getClass)
						? item.getClass.apply(item.scope||me.scope||me, args)
						: item.iconCls || '',
					toolTip:item.tooltip?'data-qtip="'+ item.tooltip + '"':'',
					style:iconStyle

				})
			}).join(" ")
		};
	},
	processEvent: function(type, view, cell, recordIndex, cellIndex, e){

        var me = this,
            match = e.getTarget().className.match(me.actionIdRe),
            item, fn;

        if (match) {
            item = me.items[parseInt(match[1], 10)];
            if (item) {
                if (type == 'click') {
                	if (item.eventName){
  						view.ownerCt.fireEvent(item.eventName,{
                			src:item,
                			col:me,
                			owner:view.ownerCt,
                			store:view.getStore(),
                			record:view.getStore().getAt(recordIndex),
                			value:view.getStore().getAt(recordIndex).get(me.dataIndex)
                		})
                		//return false
                	}

                } else if (type == 'mousedown' && item.stopSelection !== false) {
                    return false;
                }
            }
        }
        return me.callParent(arguments);
    }
})