(function(){var guardElements={table:1,ul:1,ol:1,blockquote:1,div:1},directSelectionGuardElements={},allGuardElements={};
CKEDITOR.tools.extend(directSelectionGuardElements,guardElements,{tr:1,p:1,div:1,li:1});
CKEDITOR.tools.extend(allGuardElements,directSelectionGuardElements,{td:1});
function setToolbarStates(editor,path){var useComputedState=editor.config.useComputedState,selectedElement;
useComputedState=useComputedState===undefined||useComputedState;
if(!useComputedState){selectedElement=getElementForDirection(path.lastElement,editor.editable());
}selectedElement=selectedElement||path.block||path.blockLimit;
if(selectedElement.equals(editor.editable())){var enclosedNode=editor.getSelection().getRanges()[0].getEnclosedNode();
enclosedNode&&enclosedNode.type==CKEDITOR.NODE_ELEMENT&&(selectedElement=enclosedNode);
}if(!selectedElement){return;
}var selectionDir=useComputedState?selectedElement.getComputedStyle("direction"):selectedElement.getStyle("direction")||selectedElement.getAttribute("dir");
editor.getCommand("bidirtl").setState(selectionDir=="rtl"?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF);
editor.getCommand("bidiltr").setState(selectionDir=="ltr"?CKEDITOR.TRISTATE_ON:CKEDITOR.TRISTATE_OFF);
}function handleMixedDirContent(editor,path){var directionNode=path.block||path.blockLimit||editor.editable();
var pathDir=directionNode.getDirection(1);
if(pathDir!=(editor._.selDir||editor.lang.dir)){editor._.selDir=pathDir;
editor.fire("contentDirChanged",pathDir);
}}function getElementForDirection(node,root){while(node&&!(node.getName() in allGuardElements||node.equals(root))){var parent=node.getParent();
if(!parent){break;
}node=parent;
}return node;
}function switchDir(element,dir,editor,database){if(element.isReadOnly()||element.equals(editor.editable())){return;
}CKEDITOR.dom.element.setMarker(database,element,"bidi_processed",1);
var parent=element,editable=editor.editable();
while((parent=parent.getParent())&&!parent.equals(editable)){if(parent.getCustomData("bidi_processed")){element.removeStyle("direction");
element.removeAttribute("dir");
return;
}}var useComputedState=("useComputedState" in editor.config)?editor.config.useComputedState:1;
var elementDir=useComputedState?element.getComputedStyle("direction"):element.getStyle("direction")||element.hasAttribute("dir");
if(elementDir==dir){return;
}element.removeStyle("direction");
if(useComputedState){element.removeAttribute("dir");
if(dir!=element.getComputedStyle("direction")){element.setAttribute("dir",dir);
}}else{element.setAttribute("dir",dir);
}editor.forceNextSelectionCheck();
return;
}function getFullySelected(range,elements,enterMode){var ancestor=range.getCommonAncestor(false,true);
range=range.clone();
range.enlarge(enterMode==CKEDITOR.ENTER_BR?CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:CKEDITOR.ENLARGE_BLOCK_CONTENTS);
if(range.checkBoundaryOfElement(ancestor,CKEDITOR.START)&&range.checkBoundaryOfElement(ancestor,CKEDITOR.END)){var parent;
while(ancestor&&ancestor.type==CKEDITOR.NODE_ELEMENT&&(parent=ancestor.getParent())&&parent.getChildCount()==1&&!(ancestor.getName() in elements)){ancestor=parent;
}return ancestor.type==CKEDITOR.NODE_ELEMENT&&(ancestor.getName() in elements)&&ancestor;
}}function bidiCommand(dir){return{context:"p",allowedContent:{"h1 h2 h3 h4 h5 h6 table ul ol blockquote div tr p div li td":{propertiesOnly:true,attributes:"dir"}},requiredContent:"p[dir]",refresh:function(editor,path){setToolbarStates(editor,path);
handleMixedDirContent(editor,path);
},exec:function(editor){var selection=editor.getSelection(),enterMode=editor.config.enterMode,ranges=selection.getRanges();
if(ranges&&ranges.length){var database={};
var bookmarks=selection.createBookmarks();
var rangeIterator=ranges.createIterator(),range,i=0;
while((range=rangeIterator.getNextRange(1))){var selectedElement=range.getEnclosedNode();
if(!selectedElement||selectedElement&&!(selectedElement.type==CKEDITOR.NODE_ELEMENT&&selectedElement.getName() in directSelectionGuardElements)){selectedElement=getFullySelected(range,guardElements,enterMode);
}selectedElement&&switchDir(selectedElement,dir,editor,database);
var iterator,block;
var walker=new CKEDITOR.dom.walker(range);
var start=bookmarks[i].startNode,end=bookmarks[i++].endNode;
walker.evaluator=function(node){return !!(node.type==CKEDITOR.NODE_ELEMENT&&node.getName() in guardElements&&!(node.getName()==(enterMode==CKEDITOR.ENTER_P?"p":"div")&&node.getParent().type==CKEDITOR.NODE_ELEMENT&&node.getParent().getName()=="blockquote")&&node.getPosition(start)&CKEDITOR.POSITION_FOLLOWING&&((node.getPosition(end)&CKEDITOR.POSITION_PRECEDING+CKEDITOR.POSITION_CONTAINS)==CKEDITOR.POSITION_PRECEDING));
};
while((block=walker.next())){switchDir(block,dir,editor,database);
}iterator=range.createIterator();
iterator.enlargeBr=enterMode!=CKEDITOR.ENTER_BR;
while((block=iterator.getNextParagraph(enterMode==CKEDITOR.ENTER_P?"p":"div"))){switchDir(block,dir,editor,database);
}}CKEDITOR.dom.element.clearAllMarkers(database);
editor.forceNextSelectionCheck();
selection.selectBookmarks(bookmarks);
editor.focus();
}}};
}CKEDITOR.plugins.add("bidi",{lang:"af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn",icons:"bidiltr,bidirtl",hidpi:true,init:function(editor){if(editor.blockless){return;
}function addButtonCommand(buttonName,buttonLabel,commandName,commandDef,order){editor.addCommand(commandName,new CKEDITOR.command(editor,commandDef));
if(editor.ui.addButton){editor.ui.addButton(buttonName,{label:buttonLabel,command:commandName,toolbar:"bidi,"+order});
}}var lang=editor.lang.bidi;
if(editor.ui.addToolbarGroup){editor.ui.addToolbarGroup("bidi","align","paragraph");
}addButtonCommand("BidiLtr",lang.ltr,"bidiltr",bidiCommand("ltr"),10);
addButtonCommand("BidiRtl",lang.rtl,"bidirtl",bidiCommand("rtl"),20);
editor.on("contentDom",function(){editor.document.on("dirChanged",function(evt){editor.fire("dirChanged",{node:evt.data,dir:evt.data.getDirection(1)});
});
});
editor.on("contentDirChanged",function(evt){var func=(editor.lang.dir!=evt.data?"add":"remove")+"Class";
var toolbar=editor.ui.space(editor.config.toolbarLocation);
if(toolbar){toolbar[func]("cke_mixed_dir_content");
}});
}});
function isOffline(el){var html=el.getDocument().getBody().getParent();
while(el){if(el.equals(html)){return false;
}el=el.getParent();
}return true;
}function dirChangeNotifier(org){var isAttribute=org==elementProto.setAttribute,isRemoveAttribute=org==elementProto.removeAttribute,dirStyleRegexp=/\bdirection\s*:\s*(.*?)\s*(:?$|;)/;
return function(name,val){if(!this.isReadOnly()){var orgDir;
if((name==(isAttribute||isRemoveAttribute?"dir":"direction")||name=="style"&&(isRemoveAttribute||dirStyleRegexp.test(val)))&&!isOffline(this)){orgDir=this.getDirection(1);
var retval=org.apply(this,arguments);
if(orgDir!=this.getDirection(1)){this.getDocument().fire("dirChanged",this);
return retval;
}}}return org.apply(this,arguments);
};
}var elementProto=CKEDITOR.dom.element.prototype,methods=["setStyle","removeStyle","setAttribute","removeAttribute"];
for(var i=0;
i<methods.length;
i++){elementProto[methods[i]]=CKEDITOR.tools.override(elementProto[methods[i]],dirChangeNotifier);
}})();