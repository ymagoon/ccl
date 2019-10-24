CKEDITOR.dialog.add("colordialog",function(editor){var $el=CKEDITOR.dom.element,$doc=CKEDITOR.document,lang=editor.lang.colordialog;
var dialog;
var spacer={type:"html",html:"&nbsp;"};
var selected;
function clearSelected(){$doc.getById(selHiColorId).removeStyle("background-color");
dialog.getContentElement("picker","selectedColor").setValue("");
selected&&selected.removeAttribute("aria-selected");
selected=null;
}function updateSelected(evt){var target=evt.data.getTarget(),color;
if(target.getName()=="td"&&(color=target.getChild(0).getHtml())){selected=target;
selected.setAttribute("aria-selected",true);
dialog.getContentElement("picker","selectedColor").setValue(color);
}}function whiteOrBlack(color){color=color.replace(/^#/,"");
for(var i=0,rgb=[];
i<=2;
i++){rgb[i]=parseInt(color.substr(i*2,2),16);
}var luma=(0.2126*rgb[0])+(0.7152*rgb[1])+(0.0722*rgb[2]);
return"#"+(luma>=165?"000":"fff");
}var focused,hovered;
function updateHighlight(event){!event.name&&(event=new CKEDITOR.event(event));
var isFocus=!(/mouse/).test(event.name),target=event.data.getTarget(),color;
if(target.getName()=="td"&&(color=target.getChild(0).getHtml())){removeHighlight(event);
isFocus?focused=target:hovered=target;
if(isFocus){target.setStyle("border-color",whiteOrBlack(color));
target.setStyle("border-style","dotted");
}$doc.getById(hicolorId).setStyle("background-color",color);
$doc.getById(hicolorTextId).setHtml(color);
}}function clearHighlight(){var color=focused.getChild(0).getHtml();
focused.setStyle("border-color",color);
focused.setStyle("border-style","solid");
$doc.getById(hicolorId).removeStyle("background-color");
$doc.getById(hicolorTextId).setHtml("&nbsp;");
focused=null;
}function removeHighlight(event){var isFocus=!(/mouse/).test(event.name),target=isFocus&&focused;
if(target){var color=target.getChild(0).getHtml();
target.setStyle("border-color",color);
target.setStyle("border-style","solid");
}if(!(focused||hovered)){$doc.getById(hicolorId).removeStyle("background-color");
$doc.getById(hicolorTextId).setHtml("&nbsp;");
}}function onKeyStrokes(evt){var domEvt=evt.data;
var element=domEvt.getTarget();
var relative,nodeToMove;
var keystroke=domEvt.getKeystroke(),rtl=editor.lang.dir=="rtl";
switch(keystroke){case 38:if((relative=element.getParent().getPrevious())){nodeToMove=relative.getChild([element.getIndex()]);
nodeToMove.focus();
}domEvt.preventDefault();
break;
case 40:if((relative=element.getParent().getNext())){nodeToMove=relative.getChild([element.getIndex()]);
if(nodeToMove&&nodeToMove.type==1){nodeToMove.focus();
}}domEvt.preventDefault();
break;
case 32:case 13:updateSelected(evt);
domEvt.preventDefault();
break;
case rtl?37:39:if((nodeToMove=element.getNext())){if(nodeToMove.type==1){nodeToMove.focus();
domEvt.preventDefault(true);
}}else{if((relative=element.getParent().getNext())){nodeToMove=relative.getChild([0]);
if(nodeToMove&&nodeToMove.type==1){nodeToMove.focus();
domEvt.preventDefault(true);
}}}break;
case rtl?39:37:if((nodeToMove=element.getPrevious())){nodeToMove.focus();
domEvt.preventDefault(true);
}else{if((relative=element.getParent().getPrevious())){nodeToMove=relative.getLast();
nodeToMove.focus();
domEvt.preventDefault(true);
}}break;
default:return;
}}function createColorTable(){table=CKEDITOR.dom.element.createFromHtml('<table tabIndex="-1" aria-label="'+lang.options+'" role="grid" style="border-collapse:separate;" cellspacing="0"><caption class="cke_voice_label">'+lang.options+'</caption><tbody role="presentation"></tbody></table>');
table.on("mouseover",updateHighlight);
table.on("mouseout",removeHighlight);
var aColors=["00","33","66","99","cc","ff"];
function appendColorRow(rangeA,rangeB){for(var i=rangeA;
i<rangeA+3;
i++){var row=new $el(table.$.insertRow(-1));
row.setAttribute("role","row");
for(var j=rangeB;
j<rangeB+3;
j++){for(var n=0;
n<6;
n++){appendColorCell(row.$,"#"+aColors[j]+aColors[n]+aColors[i]);
}}}}function appendColorCell(targetRow,color){var cell=new $el(targetRow.insertCell(-1));
cell.setAttribute("class","ColorCell");
cell.setAttribute("tabIndex",-1);
cell.setAttribute("role","gridcell");
cell.on("keydown",onKeyStrokes);
cell.on("click",updateSelected);
cell.on("focus",updateHighlight);
cell.on("blur",removeHighlight);
cell.setStyle("background-color",color);
cell.setStyle("border","1px solid "+color);
cell.setStyle("width","14px");
cell.setStyle("height","14px");
var colorLabel=numbering("color_table_cell");
cell.setAttribute("aria-labelledby",colorLabel);
cell.append(CKEDITOR.dom.element.createFromHtml('<span id="'+colorLabel+'" class="cke_voice_label">'+color+"</span>",CKEDITOR.document));
}appendColorRow(0,0);
appendColorRow(3,0);
appendColorRow(0,3);
appendColorRow(3,3);
var oRow=new $el(table.$.insertRow(-1));
oRow.setAttribute("role","row");
for(var n=0;
n<6;
n++){appendColorCell(oRow.$,"#"+aColors[n]+aColors[n]+aColors[n]);
}for(var i=0;
i<12;
i++){appendColorCell(oRow.$,"#000000");
}}var numbering=function(id){return CKEDITOR.tools.getNextId()+"_"+id;
},hicolorId=numbering("hicolor"),hicolorTextId=numbering("hicolortext"),selHiColorId=numbering("selhicolor"),table;
createColorTable();
return{title:lang.title,minWidth:360,minHeight:220,onLoad:function(){dialog=this;
},onHide:function(){clearSelected();
clearHighlight();
},contents:[{id:"picker",label:lang.title,accessKey:"I",elements:[{type:"hbox",padding:0,widths:["70%","10%","30%"],children:[{type:"html",html:"<div></div>",onLoad:function(){CKEDITOR.document.getById(this.domId).append(table);
},focus:function(){(focused||this.getElement().getElementsByTag("td").getItem(0)).focus();
}},spacer,{type:"vbox",padding:0,widths:["70%","5%","25%"],children:[{type:"html",html:"<span>"+lang.highlight+'</span>												<div id="'+hicolorId+'" style="border: 1px solid; height: 74px; width: 74px;"></div>												<div id="'+hicolorTextId+'">&nbsp;</div><span>'+lang.selected+'</span>												<div id="'+selHiColorId+'" style="border: 1px solid; height: 20px; width: 74px;"></div>'},{type:"text",label:lang.selected,labelStyle:"display:none",id:"selectedColor",style:"width: 74px",onChange:function(){try{$doc.getById(selHiColorId).setStyle("background-color",this.getValue());
}catch(e){clearSelected();
}}},spacer,{type:"button",id:"clear",style:"margin-top: 5px",label:lang.clear,onClick:clearSelected}]}]}]}]};
});
