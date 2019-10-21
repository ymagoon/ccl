(function(){var horizontalruleCmd={canUndo:false,exec:function(editor){var hr=editor.document.createElement("hr");
editor.insertElement(hr);
},allowedContent:"hr",requiredContent:"hr"};
var pluginName="horizontalrule";
CKEDITOR.plugins.add(pluginName,{lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn",icons:"horizontalrule",hidpi:true,init:function(editor){if(editor.blockless){return;
}editor.addCommand(pluginName,horizontalruleCmd);
editor.ui.addButton&&editor.ui.addButton("HorizontalRule",{label:editor.lang.horizontalrule.toolbar,command:pluginName,toolbar:"insert,40"});
}});
})();
