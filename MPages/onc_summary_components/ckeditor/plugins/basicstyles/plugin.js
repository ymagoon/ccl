CKEDITOR.plugins.add("basicstyles",{lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn",icons:"bold,italic,underline,strike,subscript,superscript",hidpi:true,init:function(editor){var order=0;
var addButtonCommand=function(buttonName,buttonLabel,commandName,styleDefiniton){if(!styleDefiniton){return;
}var style=new CKEDITOR.style(styleDefiniton),forms=contentForms[commandName];
forms.unshift(style);
editor.attachStyleStateChange(style,function(state){!editor.readOnly&&editor.getCommand(commandName).setState(state);
});
editor.addCommand(commandName,new CKEDITOR.styleCommand(style,{contentForms:forms}));
if(editor.ui.addButton){editor.ui.addButton(buttonName,{label:buttonLabel,command:commandName,toolbar:"basicstyles,"+(order+=10)});
}};
var contentForms={bold:["strong","b",["span",function(el){var fw=el.styles["font-weight"];
return fw=="bold"||+fw>=700;
}]],italic:["em","i",["span",function(el){return el.styles["font-style"]=="italic";
}]],underline:["u",["span",function(el){return el.styles["text-decoration"]=="underline";
}]],strike:["s","strike",["span",function(el){return el.styles["text-decoration"]=="line-through";
}]],subscript:["sub"],superscript:["sup"]},config=editor.config,lang=editor.lang.basicstyles;
addButtonCommand("Bold",lang.bold,"bold",config.coreStyles_bold);
addButtonCommand("Italic",lang.italic,"italic",config.coreStyles_italic);
addButtonCommand("Underline",lang.underline,"underline",config.coreStyles_underline);
addButtonCommand("Strike",lang.strike,"strike",config.coreStyles_strike);
addButtonCommand("Subscript",lang.subscript,"subscript",config.coreStyles_subscript);
addButtonCommand("Superscript",lang.superscript,"superscript",config.coreStyles_superscript);
editor.setKeystroke([[CKEDITOR.CTRL+66,"bold"],[CKEDITOR.CTRL+73,"italic"],[CKEDITOR.CTRL+85,"underline"]]);
}});
CKEDITOR.config.coreStyles_bold={element:"strong",overrides:"b"};
CKEDITOR.config.coreStyles_italic={element:"em",overrides:"i"};
CKEDITOR.config.coreStyles_underline={element:"u"};
CKEDITOR.config.coreStyles_strike={element:"s",overrides:"strike"};
CKEDITOR.config.coreStyles_subscript={element:"sub"};
CKEDITOR.config.coreStyles_superscript={element:"sup"};
