CKEDITOR.plugins.add("print",{lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn",icons:"print,",hidpi:true,init:function(editor){if(editor.elementMode==CKEDITOR.ELEMENT_MODE_INLINE){return;
}var pluginName="print";
var command=editor.addCommand(pluginName,CKEDITOR.plugins.print);
editor.ui.addButton&&editor.ui.addButton("Print",{label:editor.lang.print.toolbar,command:pluginName,toolbar:"document,50"});
}});
CKEDITOR.plugins.print={exec:function(editor){if(CKEDITOR.env.opera){return;
}else{if(CKEDITOR.env.gecko){editor.window.$.print();
}else{editor.document.$.execCommand("Print");
}}},canUndo:false,readOnly:1,modes:{wysiwyg:!(CKEDITOR.env.opera)}};
