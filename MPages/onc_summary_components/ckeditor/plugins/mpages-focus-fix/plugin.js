(function(){var pluginName="mpages-focus-fix";
CKEDITOR.plugins.add(pluginName,{init:function(editor){editor.on("instanceReady",function(e){var editorInstance=e.editor;
var editable=editorInstance.editable();
var editableArea=editable.$;
function attachFocusForEditableAreas(){$(editableArea).on("focus",".ddfreetext",function(){!editorInstance.MPAGES&&(editorInstance.MPAGES={});
editorInstance.MPAGES.lastEdited=this;
});
}if(editorInstance.MPAGES&&editorInstance.MPAGES.mixedContent){attachFocusForEditableAreas();
}editorInstance.on("onEnableMixedContent",function(){attachFocusForEditableAreas();
});
editorInstance.on("focusFix",function(){editorInstance.MPAGES&&editorInstance.MPAGES.lastEdited&&$(editorInstance.MPAGES.lastEdited).focus();
});
});
}});
})();