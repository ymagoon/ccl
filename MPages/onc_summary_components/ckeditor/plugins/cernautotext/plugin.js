CKEDITOR.plugins.add("cernautotext",{lang:"en,en-gb,de,fr,es",m_mapHelpers:[],beforeInit:function(editor){if(typeof DDCOMMON==="undefined"){CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("js/dynDocCommonFunc.js"));
}if(typeof AutoTextPluginHelper==="undefined"){CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("plugins/cernautotext/js/autotext.js"));
}var oHelper=new AutoTextPluginHelper();
this.m_mapHelpers[editor.name]=oHelper;
oHelper.m_oEditor=editor;
},init:function(editor){var oHelper=this.m_mapHelpers[editor.name];
var manageAutoTextCmd={canUndo:false,editorFocus:false,exec:function(editor){oHelper.showManageAutoTextDlg();
}};
oHelper.initAutoText();
editor.addCommand(DDCMD_HIDE_AUTOTEXT_MENU,{canUndo:false,editorFocus:false,exec:function(editor){return oHelper.hideDropMenu();
}});
var commandName="cernautotext",command=editor.addCommand(commandName,manageAutoTextCmd);
editor.ui.add("ManageAutoText",CKEDITOR.UI_BUTTON,{label:editor.lang.cernautotext.MANAGE_AUTOTEXT,command:commandName});
if(oHelper.isPluginEnabled()){editor.on("contentDom",function(){editor.document.on("beforedeactivate",function(event){if(oHelper.isMouseOverPopup()){event.stop();
event.data.preventDefault();
return false;
}return true;
});
editor.document.getBody().on("scroll",oHelper.syncPosition,oHelper);
editor.editable().on("scroll",oHelper.syncPosition,oHelper);
var editorElement=editor.editable().$;
if(!editorElement.id){editorElement.id=CKEDITOR.DocUtilsHelper.GenerateGUID();
}editorElement=CKEDITOR.dom.element.get(editorElement);
editorElement.on("click",function(event){oHelper.onClick(event);
});
editorElement.on("mouseup",function(event){if(2==event.data.$.button){return oHelper.hideDropMenu();
}});
editorElement.on("keydown",function(event){if(null!=oHelper.m_oAutoTextTimout){clearTimeout(oHelper.m_oAutoTextTimout);
oHelper.m_oAutoTextTimout=null;
}if(!event||!event.data||!event.data.$){return;
}var nKeyCode=event.data.$.keyCode;
if(g_iDD_KEYCODE_SPACE==nKeyCode||g_iDD_KEYCODE_TAB==nKeyCode||g_iDD_KEYCODE_ESC==nKeyCode){oHelper.hideDropMenu();
return;
}if(oHelper.keyCodeHandledByPopup(nKeyCode)){if(nKeyCode==g_iDD_KEYCODE_KEYDOWN||nKeyCode==g_iDD_KEYCODE_KEYUP){oHelper.keyHandler(nKeyCode);
}event.stop();
event.data.preventDefault(true);
}},null,null,1);
editorElement.on("keypress",function(event){var nKeyCode=event.data.$.keyCode;
if(oHelper.keyCodeHandledByPopup(nKeyCode)){event.stop();
event.data.preventDefault(true);
}},null,null,1);
editorElement.on("keyup",function(event){if(null!=oHelper.m_oAutoTextTimout){clearTimeout(oHelper.m_oAutoTextTimout);
oHelper.m_oAutoTextTimout=null;
}if(oHelper.selectionExists()){return;
}if(!event||!event.data||!event.data.$){return;
}var nKeyCode=event.data.$.keyCode;
var oSrcElem=event.data.$.srcElement;
var doKeyHandler=function(){oHelper.saveFocusedElement(oSrcElem);
oHelper.evaluateAt();
oHelper.keyHandler(nKeyCode);
};
switch(nKeyCode){case g_iDD_KEYCODE_F3:break;
case g_iDD_KEYCODE_SPACE:case g_iDD_KEYCODE_TAB:case g_iDD_KEYCODE_ESC:oHelper.hideDropMenu();
break;
case g_iDD_KEYCODE_ENTER:if(oHelper.isPopupVisible()){oHelper.keyHandler(nKeyCode);
event.stop();
event.data.preventDefault(true);
}break;
case g_iDD_KEYCODE_KEYDOWN:case g_iDD_KEYCODE_KEYUP:if(oHelper.isPopupVisible()){event.stop();
event.data.preventDefault(true);
}break;
default:if(oHelper.isPopupVisible()){doKeyHandler();
}else{oHelper.m_oAutoTextTimout=setTimeout(doKeyHandler,200);
}}},null,null,1);
});
editor.on("beforeCommandExec",function(event){if(DDCMD_SAVE==event.data.name||DDCMD_SAVECLOSE==event.data.name||DDCMD_SIGN==event.data.name||DDCMD_DQRRESULTS==event.data.name||DDCMD_INSERTFREETEXT==event.data.name||DDCMD_REMOVEELEMENT==event.data.name||DDCMD_REFRESHELEMENT==event.data.name||DDCMD_STRIKEELEMENT==event.data.name||DDCMD_NEXT_UNDERSCORE==event.data.name||DDCMD_PREV_UNDERSCORE==event.data.name){oHelper.hideDropMenu();
}});
editor.on("afterCommandExec",function(event){if(DDCMD_UNDO==event.data.name||DDCMD_REDO==event.data.name||DDCMD_PASTE==event.data.name||DDCMD_CUT==event.data.name){var curSelection=editor.getSelection();
if(!curSelection){oHelper.hideDropMenu();
return;
}var oElement=curSelection.getStartElement();
if(oElement){oHelper.saveFocusedElement(oElement.$);
oHelper.evaluateAt();
}}else{oHelper.hideDropMenu();
}});
}}});
