(function(){function addCombo(editor,comboName,styleType,lang,entries,defaultLabel,styleDefinition,order){var config=editor.config,style=new CKEDITOR.style(styleDefinition);
var names=entries.split(";"),values=[];
var styles={};
for(var i=0;
i<names.length;
i++){var parts=names[i];
if(parts){parts=parts.split("/");
var vars={},name=names[i]=parts[0];
vars[styleType]=values[i]=parts[1]||name;
styles[name]=new CKEDITOR.style(styleDefinition,vars);
styles[name]._.definition.name=name;
}else{names.splice(i--,1);
}}editor.ui.addRichCombo(comboName,{label:lang.label,title:lang.panelTitle,toolbar:"styles,"+order,allowedContent:style,requiredContent:style,panel:{css:[CKEDITOR.skin.getPath("editor")].concat(config.contentsCss),multiSelect:false,attributes:{"aria-label":lang.panelTitle}},init:function(){this.startGroup(lang.panelTitle);
for(var i=0;
i<names.length;
i++){var name=names[i];
this.add(name,styles[name].buildPreview(),name);
}},onClick:function(value){setTimeout(function(){editor.fire("focusFix");
editor.focus();
},0);
editor.fire("saveSnapshot");
var style=styles[value];
editor[this.getValue()==value?"removeStyle":"applyStyle"](style);
editor.fire("saveSnapshot");
},onRender:function(){editor.on("selectionChange",function(ev){var currentValue=this.getValue();
var elementPath=ev.data.path,elements=elementPath.elements;
for(var i=0,element;
i<elements.length;
i++){element=elements[i];
for(var value in styles){if(styles[value].checkElementMatch(element,true)){if(value!=currentValue){this.setValue(value);
}return;
}}}this.setValue("",defaultLabel);
},this);
}});
}CKEDITOR.plugins.add("font",{requires:"richcombo",lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn",init:function(editor){var config=editor.config;
addCombo(editor,"Font","family",editor.lang.font,config.font_names,config.font_defaultLabel,config.font_style,30);
addCombo(editor,"FontSize","size",editor.lang.font.fontSize,config.fontSize_sizes,config.fontSize_defaultLabel,config.fontSize_style,40);
}});
})();
CKEDITOR.config.font_names="Arial/Arial, Helvetica, sans-serif;Comic Sans MS/Comic Sans MS, cursive;Courier New/Courier New, Courier, monospace;Georgia/Georgia, serif;Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;Tahoma/Tahoma, Geneva, sans-serif;Times New Roman/Times New Roman, Times, serif;Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;Verdana/Verdana, Geneva, sans-serif";
CKEDITOR.config.font_defaultLabel="";
CKEDITOR.config.font_style={element:"span",styles:{"font-family":"#(family)"},overrides:[{element:"font",attributes:{face:null}}]};
CKEDITOR.config.fontSize_sizes="8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px";
CKEDITOR.config.fontSize_defaultLabel="";
CKEDITOR.config.fontSize_style={element:"span",styles:{"font-size":"#(size)"},overrides:[{element:"font",attributes:{size:null}}]};
