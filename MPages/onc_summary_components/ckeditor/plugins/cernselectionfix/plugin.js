CKEDITOR.plugins.add("cernselectionfix",{init:function(editor){var parseStyles=function(configString){var mappings={};
var options=configString.split(";");
for(var i=0;
i<options.length;
i++){var parts=options[i].split("/");
var name=CKEDITOR.tools.trim(parts[0]);
if(name){var styles=(parts.length>=2?parts[1]:parts[0]).replace(/,\s*/,",").split(",");
for(var j=0;
j<styles.length;
j++){mappings[CKEDITOR.tools.trim(styles[j].toLowerCase())]=name;
}}}return mappings;
};
var fontMappings=parseStyles(editor.config.font_names);
var sizeMappings=parseStyles(editor.config.fontSize_sizes);
editor.on("selectionChange",function(event){if(editor.mode!="wysiwyg"){return;
}var start=editor.getSelection().getStartElement();
(function(){var fontcombo=editor.ui.get("Font");
if(fontcombo&&!fontcombo.getValue()){var sFontFamily=start.getComputedStyle("fontFamily");
var sFirstFont=/^([^,]+),?/.exec(sFontFamily)[1];
if(!sFirstFont){return;
}sFirstFont=sFirstFont.toLowerCase();
var sMappedFont=fontMappings[sFirstFont];
if(sMappedFont){fontcombo.setValue(sMappedFont);
}}})();
(function(){var fontsizecombo=editor.ui.get("FontSize");
if(fontsizecombo&&!fontsizecombo.getValue()){var sFontSize=start.getComputedStyle("fontSize");
var sMappedSize=sizeMappings[sFontSize.toLowerCase()];
if(sMappedSize){fontsizecombo.setValue(sMappedSize);
}}})();
},null,null,100);
}});
