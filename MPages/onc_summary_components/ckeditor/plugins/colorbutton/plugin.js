CKEDITOR.plugins.add("colorbutton",{requires:"panelbutton,floatpanel",lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn",icons:"bgcolor,textcolor",hidpi:true,init:function(editor){var config=editor.config,lang=editor.lang.colorbutton;
var clickFn;
if(!CKEDITOR.env.hc){addButton("TextColor","fore",lang.textColorTitle,10);
addButton("BGColor","back",lang.bgColorTitle,20);
}function addButton(name,type,title,order){var style=new CKEDITOR.style(config["colorButton_"+type+"Style"]),colorBoxId=CKEDITOR.tools.getNextId()+"_colorBox";
editor.ui.add(name,CKEDITOR.UI_PANELBUTTON,{label:title,title:title,modes:{wysiwyg:1},editorFocus:1,toolbar:"colors,"+order,allowedContent:style,requiredContent:style,panel:{css:CKEDITOR.skin.getPath("editor"),attributes:{role:"listbox","aria-label":lang.panelTitle}},onBlock:function(panel,block){block.autoSize=true;
block.element.addClass("cke_colorblock");
block.element.setHtml(renderColors(panel,type,colorBoxId));
block.element.getDocument().getBody().setStyle("overflow","hidden");
CKEDITOR.ui.fire("ready",this);
var keys=block.keys;
var rtl=editor.lang.dir=="rtl";
keys[rtl?37:39]="next";
keys[40]="next";
keys[9]="next";
keys[rtl?39:37]="prev";
keys[38]="prev";
keys[CKEDITOR.SHIFT+9]="prev";
keys[32]="click";
},onOpen:function(){var selection=editor.getSelection(),block=selection&&selection.getStartElement(),path=editor.elementPath(block),color;
block=path.block||path.blockLimit||editor.document.getBody();
do{color=block&&block.getComputedStyle(type=="back"?"background-color":"color")||"transparent";
}while(type=="back"&&color=="transparent"&&block&&(block=block.getParent()));
if(!color||color=="transparent"){color="#ffffff";
}this._.panel._.iframe.getFrameDocument().getById(colorBoxId).setStyle("background-color",color);
return color;
}});
}function renderColors(panel,type,colorBoxId){var output=[],colors=config.colorButton_colors.split(",");
var clickFn=CKEDITOR.tools.addFunction(function(color,type){if(color=="?"){var applyColorStyle=arguments.callee;
function onColorDialogClose(evt){this.removeListener("ok",onColorDialogClose);
this.removeListener("cancel",onColorDialogClose);
evt.name=="ok"&&applyColorStyle(this.getContentElement("picker","selectedColor").getValue(),type);
}editor.openDialog("colordialog",function(){this.on("ok",onColorDialogClose);
this.on("cancel",onColorDialogClose);
});
return;
}setTimeout(function(){editor.fire("focusFix");
editor.focus();
},0);
panel.hide();
editor.fire("saveSnapshot");
editor.removeStyle(new CKEDITOR.style(config["colorButton_"+type+"Style"],{color:"inherit"}));
if(color){var colorStyle=config["colorButton_"+type+"Style"];
colorStyle.childRule=type=="back"?function(element){return isUnstylable(element);
}:function(element){return !(element.is("a")||element.getElementsByTag("a").count())||isUnstylable(element);
};
editor.applyStyle(new CKEDITOR.style(colorStyle,{color:color}));
}editor.fire("saveSnapshot");
});
output.push('<a class="cke_colorauto" _cke_focus=1 hidefocus=true title="',lang.auto,'" onclick="CKEDITOR.tools.callFunction(',clickFn,",null,'",type,"');return false;\" href=\"javascript:void('",lang.auto,'\')" role="option"><table role="presentation" cellspacing=0 cellpadding=0 width="100%"><tr><td><span class="cke_colorbox" id="',colorBoxId,'"></span></td><td colspan=7 align=center>',lang.auto,'</td></tr></table></a><table role="presentation" cellspacing=0 cellpadding=0 width="100%">');
for(var i=0;
i<colors.length;
i++){if((i%8)===0){output.push("</tr><tr>");
}var parts=colors[i].split("/"),colorName=parts[0],colorCode=parts[1]||colorName;
if(!parts[1]){colorName="#"+colorName.replace(/^(.)(.)(.)$/,"$1$1$2$2$3$3");
}var colorLabel=editor.lang.colorbutton.colors[colorCode]||colorCode;
output.push('<td><a class="cke_colorbox" _cke_focus=1 hidefocus=true title="',colorLabel,'" onclick="CKEDITOR.tools.callFunction(',clickFn,",'",colorName,"','",type,"'); return false;\" href=\"javascript:void('",colorLabel,'\')" role="option"><span class="cke_colorbox" style="background-color:#',colorCode,'"></span></a></td>');
}if(editor.plugins.colordialog&&config.colorButton_enableMore===undefined||config.colorButton_enableMore){output.push('</tr><tr><td colspan=8 align=center><a class="cke_colormore" _cke_focus=1 hidefocus=true title="',lang.more,'" onclick="CKEDITOR.tools.callFunction(',clickFn,",'?','",type,"');return false;\" href=\"javascript:void('",lang.more,"')\"",' role="option">',lang.more,"</a></td>");
}output.push("</tr></table>");
return output.join("");
}function isUnstylable(ele){return(ele.getAttribute("contentEditable")=="false")||ele.getAttribute("data-nostyle");
}}});
CKEDITOR.config.colorButton_colors="000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF";
CKEDITOR.config.colorButton_foreStyle={element:"span",styles:{color:"#(color)"},overrides:[{element:"font",attributes:{color:null}}]};
CKEDITOR.config.colorButton_backStyle={element:"span",styles:{"background-color":"#(color)"}};
