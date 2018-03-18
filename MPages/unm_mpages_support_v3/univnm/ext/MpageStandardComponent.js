/*global
	Ext:true
*/
/* Class:  univnm.ext.MpageStandardComponent
	An Ext4 wrapper for MPage Standard Components

	Detail:
		this is intended to render a standard component into an Ext framework
		without any changes to the component itself. This depends on
		univnm_mpage_component.js

	Config Properties:


	Topic: Examples
	(code)

	(end)


	*/
	Ext.define('univnm.ext.MpageStandardComponent' ,{
		extend: 'Ext.panel.Panel',
		alias: 'widget.mpagecomponent',
		layout:"fit",

		html:"<div style='width:100%;height:100%'></div>",
		listeners:{

		},
		initComponent:function(){
			var innerDivId =this.innerDivId ="comp-div-" + this.id;
			this.html = '<div id="'+innerDivId+'" style="width:100%;height:100%">';

			var constructor = eval("("+this.componentName+")");
			this.listeners.afterrender= function(panel){
				var c =panel.component =new constructor().create(
					Ext.get(innerDivId).dom,
					function(comp){
						var size = Ext.get(innerDivId).getSize();
						comp.resize(size.width,size.height);
					},
					panel.componentOptions
				);
				if (typeof panel.componentProperties == "object"){
					var props= panel.componentProperties;
					for (var prop in props){
						if (props.hasOwnProperty(prop)){
							c.setProperty(prop,props[prop]);
						}
					}
				}
				c.loadData(function(thisComponent){
					thisComponent.render();
				});

			};
			this.listeners.resize=function(panel){
				if ("component" in panel){
					var size = Ext.get(innerDivId).getSize();
					panel.component.resize(size.width,size.height);
				}
			};
			this.listeners.destroy=function(panel){
				if ("component" in panel){
					panel.component.unload();
				}
			};
			this.callParent(arguments);
		}
	});