(function(){function checkSelectionChange(){var sel=this.getSelection(1);
if(sel.getType()==CKEDITOR.SELECTION_NONE){return;
}this.fire("selectionCheck",sel);
var currentPath=this.elementPath();
if(!currentPath.compare(this._.selectionPreviousPath)){this._.selectionPreviousPath=currentPath;
this.fire("selectionChange",{selection:sel,path:currentPath});
}}CKEDITOR.plugins.add("cernbasicstyles_base",{lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en-au,en-ca,en-gb,en,eo,es,et,eu,fa,fi,fo,fr-ca,fr,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt-br,pt,ro,ru,sk,sl,sr-latn,sr,sv,th,tr,ug,uk,vi,zh-cn,zh",icons:"bold,italic,underline,strike,subscript,superscript",beforeInit:function(editor){if(!BasicStyles){CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("plugins/cernbasicstyles_base/js/styles.js"));
}},init:function(editor){var lang=editor.lang.cernbasicstyles_base;
var order=0;
var styles={bold:new BasicStyles.BoldStyle(editor),underline:new BasicStyles.UnderlineStyle(editor),italic:new BasicStyles.ItalicStyle(editor),strike:new BasicStyles.StrikeStyle(editor)};
var addStyleCommand=function(commandName,styleDefinition,buttonName,buttonLabel){var ckestyle=new CKEDITOR.style(styleDefinition);
editor.attachStyleStateChange(ckestyle,function(state){var command=editor.getCommand(commandName);
if(!editor.readOnly&&command.state!==CKEDITOR.TRISTATE_DISABLED){command.setState(state);
}});
editor.addCommand(commandName,{modes:{wysiwyg:1},canUndo:true,editorFocus:false,exec:function(editor){var range=editor.document.$.selection.createRange();
if(!range.moveStart){return;
}var parentElement=range.parentElement();
var selectionInEditor=(function(){for(var element=parentElement;
element&&element!=editor.document.$;
element=element.parentElement){if(element===editor.editable().$){return true;
}}return false;
})();
if(!selectionInEditor){return;
}var state=editor.getCommand(commandName).state;
var style=styles[commandName.toLowerCase()];
if(!style){return;
}if(!style.ieCommand){return;
}var ierange=editor.document.$.selection.createRange();
if(ierange.moveStart){var stateBefore=ierange.queryCommandState(style.ieCommand);
if(stateBefore==false){editor.document.$.execCommand(style.ieCommand);
}else{style.remove(ierange);
}}checkSelectionChange.call(editor);
}});
if(editor.ui.addButton){editor.ui.addButton(buttonName,{label:buttonLabel,command:commandName,toolbar:"basicstyles,"+(order+=10)});
}};
addStyleCommand("bold",CKEDITOR.config.coreStyles_bold,"Bold",lang.bold);
addStyleCommand("italic",CKEDITOR.config.coreStyles_italic,"Italic",lang.italic);
addStyleCommand("underline",CKEDITOR.config.coreStyles_underline,"Underline",lang.underline);
addStyleCommand("strike",CKEDITOR.config.coreStyles_strike,"Strike",lang.strike);
editor.setKeystroke([[CKEDITOR.CTRL+66,"bold"],[CKEDITOR.CTRL+73,"italic"],[CKEDITOR.CTRL+85,"underline"]]);
}});
})();
CKEDITOR.config.coreStyles_bold={element:"strong",overrides:"b"};
CKEDITOR.config.coreStyles_bold={element:"span",styles:{"font-weight":"bold"},overrides:["b","strong"]};
CKEDITOR.config.coreStyles_italic={element:"em",overrides:"i"};
CKEDITOR.config.coreStyles_italic={element:"span",styles:{"font-style":"italic"},overrides:["i","em"]};
CKEDITOR.config.coreStyles_underline={element:"u"};
CKEDITOR.config.coreStyles_underline={element:"span",styles:{"text-decoration":"underline"},overrides:"u"};
CKEDITOR.config.coreStyles_strike={element:"s",overrides:"strike"};
CKEDITOR.config.coreStyles_strike={element:"span",styles:{"text-decoration":"line-through"},overrides:["s","strike","del"]};
CKEDITOR.config.coreStyles_subscript={element:"sub"};
CKEDITOR.config.coreStyles_superscript={element:"sup"};
