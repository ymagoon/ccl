CKEDITOR.plugins.add("smiley",{requires:"dialog",lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn",icons:"smiley",hidpi:true,init:function(editor){editor.config.smiley_path=editor.config.smiley_path||(this.path+"images/");
editor.addCommand("smiley",new CKEDITOR.dialogCommand("smiley",{allowedContent:"img[alt,height,!src,title,width]",requiredContent:"img"}));
editor.ui.addButton&&editor.ui.addButton("Smiley",{label:editor.lang.smiley.toolbar,command:"smiley",toolbar:"insert,50"});
CKEDITOR.dialog.add("smiley",this.path+"dialogs/smiley.js");
}});
CKEDITOR.config.smiley_images=["regular_smile.gif","sad_smile.gif","wink_smile.gif","teeth_smile.gif","confused_smile.gif","tongue_smile.gif","embarrassed_smile.gif","omg_smile.gif","whatchutalkingabout_smile.gif","angry_smile.gif","angel_smile.gif","shades_smile.gif","devil_smile.gif","cry_smile.gif","lightbulb.gif","thumbs_down.gif","thumbs_up.gif","heart.gif","broken_heart.gif","kiss.gif","envelope.gif"];
CKEDITOR.config.smiley_descriptions=["smiley","sad","wink","laugh","frown","cheeky","blush","surprise","indecision","angry","angel","cool","devil","crying","enlightened","no","yes","heart","broken heart","kiss","mail"];
