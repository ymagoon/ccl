CKEDITOR.plugins.add("about",{requires:"dialog",lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn",icons:"about",hidpi:true,init:function(editor){var command=editor.addCommand("about",new CKEDITOR.dialogCommand("about"));
command.modes={wysiwyg:1,source:1};
command.canUndo=false;
command.readOnly=1;
editor.ui.addButton&&editor.ui.addButton("About",{label:editor.lang.about.title,command:"about",toolbar:"about"});
CKEDITOR.dialog.add("about",this.path+"dialogs/about.js");
}});
