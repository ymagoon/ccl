CKEDITOR.plugins.add("newpage",{lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn",icons:"newpage,newpage-rtl",hidpi:true,init:function(editor){editor.addCommand("newpage",{modes:{wysiwyg:1,source:1},exec:function(editor){var command=this;
editor.setData(editor.config.newpage_html||"",function(){editor.focus();
setTimeout(function(){editor.fire("afterCommandExec",{name:"newpage",command:command});
editor.selectionChange();
},200);
});
},async:true});
editor.ui.addButton&&editor.ui.addButton("NewPage",{label:editor.lang.newpage.toolbar,command:"newpage",toolbar:"document,20"});
}});
