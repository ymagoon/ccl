function AutoTextPluginHelper(){var m_arrAbbreviationList=null;
var m_arrDelimiters=["\r","\n","\t"," "];
var m_nItemPosition=-1;
var m_nMaxWordLength=0;
var m_nScrollbarWidth=10;
var m_oDropMenu=null;
var m_sElementId=null;
var m_colorTextDefault=null;
var m_colorTextHighlighted=null;
var m_colorBackgroundDefault=null;
var m_colorBackgroundHighlighted=null;
var m_sFontFace="";
var m_nMinimumMenuSize=5;
var m_nMenuElementHeight=20;
var m_nScrollOffset=15;
var m_bIsPluginEnabled=false;
function addWord(oAutoTextHelper,sWord){var oWord=document.createElement("div");
oWord.style.cursor="pointer";
oWord.appendChild(document.createTextNode(sWord));
oWord.onclick=function(){oAutoTextHelper.onPopupClick(this);
};
oWord.ondblclick=function(){oAutoTextHelper.onPopupDblClick(this);
};
m_oDropMenu.appendChild(oWord);
m_oDropMenu.style.fontFamily=m_sFontFace;
}function clearDropMenu(){while(m_oDropMenu.hasChildNodes()){m_oDropMenu.removeChild(m_oDropMenu.firstChild);
}m_oDropMenu.style.height="auto";
m_oDropMenu.style.width="auto";
}function getAutoTextWords(oAutoTextHelper){var rangeAbbreviation=oAutoTextHelper.getAbbreviationRange();
if(!rangeAbbreviation){return false;
}var sText=rangeAbbreviation.text;
if(DDCOMMON.isEmpty(sText)){return false;
}m_arrAbbreviationList=CKEDITOR.AutoTextHelper.GetAbbreviations(sText);
if(DDCOMMON.isEmpty(m_arrAbbreviationList)){setVisible(oAutoTextHelper,"hidden");
m_nItemPosition=-1;
return false;
}m_arrAbbreviationList=eval("("+m_arrAbbreviationList+")");
return true;
}function getElementText(oElement){if(null==oElement){return"";
}return oElement.innerText.replace(/&nbsp;/g," ");
}function getLeftText(sText,nCurPos){return sText.substring(getStartingPos(sText,nCurPos),nCurPos+1);
}function getStartingPos(sText,nIdx){var nLength=sText.length;
while((nIdx>=0)&&(nIdx<nLength)){var ch=sText.charAt(nIdx);
if(DDCOMMON.contains(m_arrDelimiters,ch)){break;
}nIdx--;
}return nIdx;
}function insertText(oAutoTextHelper,sAbbreviation){if(!oAutoTextHelper||DDCOMMON.isEmpty(sAbbreviation)){return;
}var currentEditor=oAutoTextHelper.m_oEditor;
var hTimerHandle=CKEDITOR.DocUtilsHelper.StartSLATimer(g_sDYNDOC_SLA_TIMER_USR_EXECUTE_AUTOTEXT_DOCUMENT);
var oScaytHelper=null;
try{if(typeof oAutoTextHelper.m_oEditor.plugins.cernscayt!=="undefined"){oScaytHelper=oAutoTextHelper.m_oEditor.plugins.cernscayt.m_mapHelpers[oAutoTextHelper.m_oEditor.name];
oScaytHelper.setSpellCheckEnabled(false);
}var selection=oAutoTextHelper.m_oEditor.document.$.selection.createRange();
var sHTMLText=CKEDITOR.AutoTextHelper.ExecuteAutoText(sAbbreviation);
if(selection.moveStart){selection.select();
}sHTMLText=sHTMLText+"&nbsp";
var rangeAbbreviation=oAutoTextHelper.getAbbreviationRange();
if(null==rangeAbbreviation||!rangeAbbreviation.parentElement().isContentEditable){throw"could not get abbreviation range";
}if(sAbbreviation.indexOf(rangeAbbreviation.text)!==0||/\s/gi.test(rangeAbbreviation.text)){throw"range is invalid";
}if(!DDCOMMON.isEmpty(sHTMLText)){rangeAbbreviation.pasteHTML("");
currentEditor.insertHtml(sHTMLText,"unfiltered_html");
if(oScaytHelper){setTimeout(function(){oScaytHelper.spellCheckCurrentFreeText(true,true);
},0);
}}}catch(e){var message=e.message||e;
DocHandleError("AutoTextPluginHelper::insertText:  "+message+" (Abbreviation:  "+sAbbreviation+")","DynDocCKEditor","","");
}finally{if(oScaytHelper){oScaytHelper.setSpellCheckEnabled(true);
}CKEDITOR.DocUtilsHelper.StopSLATimer(g_sDYNDOC_SLA_TIMER_USR_EXECUTE_AUTOTEXT_DOCUMENT,hTimerHandle);
}}function setColor(nPosition,bgcolor,fgcolor){if(null==m_oDropMenu||m_oDropMenu.childNodes.length<=0){return;
}if(nPosition>-1&&nPosition<=m_arrAbbreviationList.length-1){m_oDropMenu.childNodes[nPosition].style.background=bgcolor;
m_oDropMenu.childNodes[nPosition].style.color=fgcolor;
}}function setVisible(oAutoTextHelper,sFlag){if(null==m_oDropMenu){return;
}if(sFlag==="hidden"&&m_oDropMenu.style.visibility===sFlag){return;
}m_oDropMenu.attributes.editorName.value=oAutoTextHelper.m_oEditor.name;
if("hidden"===sFlag){if(null!=oAutoTextHelper.m_oAutoTextTimout){clearTimeout(oAutoTextHelper.m_oAutoTextTimout);
oAutoTextHelper.m_oAutoTextTimout=null;
}m_oDropMenu.style.visibility=sFlag;
$(m_oDropMenu).hide();
return;
}else{if("visible"===sFlag){var documentBody=$(document.body);
var documentBodyHeight=documentBody.height();
var dropdownMenuElement=$(m_oDropMenu);
var currentEditor=oAutoTextHelper.m_oEditor;
currentEditor.focus();
var selection=currentEditor.getSelection();
var range=selection.getRanges()[0];
var padding={x:5,y:5};
var dummyElement=currentEditor.document.createElement("img",{attributes:{id:"mPagesDummyCKE",width:10,height:0}});
currentEditor.insertElement(dummyElement);
var dummyObj=dummyElement.$;
var cursor={x:0,y:0};
while(dummyObj.offsetParent){cursor.x+=dummyObj.offsetLeft;
cursor.y+=dummyObj.offsetTop;
dummyObj=dummyObj.offsetParent;
}cursor.x+=dummyObj.offsetLeft;
cursor.x+=padding.x;
cursor.y+=padding.y;
cursor.y+=dummyObj.offsetTop;
cursor.y-=$("#wrkflwViews_"+MP_Viewpoint.getActiveViewId()).scrollTop();
cursor.y-=$(currentEditor.container.$).find(".cke_wysiwyg_div").scrollTop();
dummyElement.remove();
range.select();
var popupHeight=dropdownMenuElement.outerHeight();
var popupWidth=dropdownMenuElement.outerWidth();
if(popupWidth+cursor.x>documentBody.width()){cursor.x=cursor.x-popupWidth;
}if(popupHeight+cursor.y>documentBodyHeight){cursor.y=documentBodyHeight-popupHeight;
}cursor.y=Math.max(0,cursor.y);
if(popupHeight>documentBodyHeight){dropdownMenuElement.css({"overflow-y":"scroll",height:(documentBodyHeight-10)+"px"});
}else{dropdownMenuElement.css("overflow-y","hidden");
}dropdownMenuElement.css({top:cursor.y+"px",left:cursor.x+"px"});
m_oDropMenu.style.visibility=sFlag;
dropdownMenuElement.show();
}}}function findStringWidth(string){var oDummy=$("<div>"+string+"</div>").css({position:"absolute","float":"left",border:"1px solid","white-space":"nowrap",visibility:"hidden",padding:"2px 2px 2px 2px","font-size":"10pt","font-family":m_sFontFace.toString()}).appendTo($("body"));
var width=oDummy.outerWidth();
oDummy.remove();
return width;
}return{m_oEditor:null,m_previousItemSelectionIndex:-1,m_oAutoTextTimout:null,syncPosition:function(){if(this.isPopupVisible()){this.evaluateAt();
}},evaluateAt:function(){if(m_oDropMenu.attributes.editorName.value!=this.m_oEditor.name){setVisible(this,"hidden");
m_nItemPosition=-1;
}var nPrevAbbreviations=0;
if(true==this.isPopupVisible()){nPrevAbbreviations=m_arrAbbreviationList.length;
}if(false==getAutoTextWords(this)){setVisible(this,"hidden");
m_nItemPosition=-1;
return;
}var nNewAbbreviations=m_arrAbbreviationList.length;
m_nMaxWordLength=0;
var rangeAbbreviationRange=this.getAbbreviationRange();
if(rangeAbbreviationRange&&rangeAbbreviationRange.text.length>0){if(nNewAbbreviations>0){clearDropMenu();
for(var i=0;
i<nNewAbbreviations;
++i){addWord(this,m_arrAbbreviationList[i]);
var width=findStringWidth(m_arrAbbreviationList[i]);
if(width>m_nMaxWordLength){m_nMaxWordLength=width;
}}setVisible(this,"visible");
if(nPrevAbbreviations!=nNewAbbreviations||-1==m_nItemPosition){m_nItemPosition=0;
this.m_previousItemSelectionIndex=m_nItemPosition;
}setColor(m_nItemPosition,m_colorBackgroundHighlighted,m_colorTextHighlighted);
}else{setVisible(this,"hidden");
m_nItemPosition=-1;
}}else{setVisible(this,"hidden");
m_nItemPosition=-1;
}},saveFocusedElement:function(element){m_sElementId=element.id?element.id:this.m_oEditor.editable().$.id;
},getAbbreviationRange:function(){if(!m_sElementId){return null;
}oElement=this.m_oEditor.document.$.getElementById(m_sElementId);
if(!oElement){return null;
}var oRange=this.m_oEditor.document.$.selection.createRange();
if(null==oRange||typeof oRange.text==="undefined"||oRange.text.length>0){return null;
}var sElementText=getElementText(oElement);
var nCursorPosition=DDCOMMON.getCursorPosition(oElement,oRange);
var sTextLeft=CKEDITOR.tools.trim(getLeftText(sElementText,nCursorPosition));
for(var i=sTextLeft.length;
i>=1;
i--){var ch=sTextLeft.charAt(i);
if(DDCOMMON.contains(m_arrDelimiters,ch)){break;
}oRange.moveStart("character",-1);
}return oRange;
},hideDropMenu:function(){if(this.isPluginEnabled()){setVisible(this,"hidden");
}},initAutoText:function(){m_bIsPluginEnabled=(1==CKEDITOR.AutoTextHelper.IsAutoTextEnabled())?true:false;
if(!m_bIsPluginEnabled){return;
}m_colorTextDefault=DDCOLOR.getFontColorDefault();
m_colorTextHighlighted=DDCOLOR.getFontColorSelected();
m_colorBackgroundDefault=DDCOLOR.getDefaultBackgroundColor();
m_colorBackgroundHighlighted=DDCOLOR.getTextHighlightColor();
m_sFontFace=DDCOLOR.getDefaultFont();
m_oDropMenu=document.getElementById("dropmenudiv");
if(null==m_oDropMenu){m_oDropMenu=$("<div class='dropmenudiv' id='dropmenudiv' editorName=''>")[0];
document.body.appendChild(m_oDropMenu);
}m_oDropMenu.style.hideFocus=true;
m_oDropMenu.style.fontFamily=m_sFontFace;
m_oDropMenu.style.fontSize="13px";
m_oDropMenu.style.paddingLeft="2px";
m_oDropMenu.style.paddingTop="2px";
m_oDropMenu.style.paddingRight="2px";
m_oDropMenu.style.paddingBottom="2px";
m_oDropMenu.style.border="1px solid "+DDCOLOR.getDropdownBorder();
m_oDropMenu.style.width="auto";
m_oDropMenu.style.background=m_colorBackgroundDefault;
m_oDropMenu.style.position="absolute";
m_oDropMenu.style.zIndex=9999;
$(m_oDropMenu).mouseover(function(event){$(m_oDropMenu).data("isover",true);
}).mouseout(function(event){$(m_oDropMenu).data("isover",false);
});
setVisible(this,"hidden");
},isPopupVisible:function(){return("visible"===m_oDropMenu.style.visibility)?true:false;
},isMouseOverPopup:function(){return m_oDropMenu&&this.isPopupVisible()&&$(m_oDropMenu).data("isover");
},isPluginEnabled:function(){return m_bIsPluginEnabled;
},keyHandler:function(keyPress){var oEditor=this.m_oEditor;
if("visible"===m_oDropMenu.style.visibility){if(g_iDD_KEYCODE_KEYDOWN==keyPress){if(m_nItemPosition==m_arrAbbreviationList.length-1){setColor(m_nItemPosition,m_colorBackgroundHighlighted,m_colorTextHighlighted);
return;
}if(m_arrAbbreviationList.length>0&&m_nItemPosition<=m_arrAbbreviationList.length-1){if(m_nItemPosition>=0){setColor(m_nItemPosition,m_colorBackgroundDefault,m_colorTextDefault);
}m_nItemPosition++;
if(m_nItemPosition<=m_arrAbbreviationList.length-1){setColor(m_nItemPosition,m_colorBackgroundHighlighted,m_colorTextHighlighted);
}var nVisibleElementCnt=Math.round(m_oDropMenu.clientHeight/m_nMenuElementHeight);
if(m_nItemPosition>=(nVisibleElementCnt-1)){m_oDropMenu.scrollTop+=m_nScrollOffset;
}}}else{if(g_iDD_KEYCODE_KEYUP==keyPress){if(0==m_nItemPosition){setColor(m_nItemPosition,m_colorBackgroundHighlighted,m_colorTextHighlighted);
return;
}if(m_arrAbbreviationList.length>0&&m_nItemPosition>=0){if(m_nItemPosition>0){setColor(m_nItemPosition,m_colorBackgroundDefault,m_colorTextDefault);
setColor(--m_nItemPosition,m_colorBackgroundHighlighted,m_colorTextHighlighted);
}else{setColor(m_nItemPosition,m_colorBackgroundDefault,m_colorTextDefault);
m_nItemPosition--;
}var nVisibleElementCnt=Math.round(m_oDropMenu.clientHeight/m_nMenuElementHeight);
if(m_nItemPosition<=(nVisibleElementCnt-1)||nVisibleElementCnt<=m_nMinimumMenuSize){m_oDropMenu.scrollTop-=m_nScrollOffset;
}}}else{if(g_iDD_KEYCODE_ENTER==keyPress){if(m_nItemPosition<=-1||m_nItemPosition>=m_arrAbbreviationList.length){setVisible(this,"hidden");
return;
}if(typeof this.firstChild!="object"||this.firstChild!=m_oDropMenu.childNodes[m_nItemPosition].firstChild){this.firstChild=m_oDropMenu.childNodes[m_nItemPosition].firstChild;
}if(null!=this.firstChild){insertText(this,this.firstChild.nodeValue);
}m_nItemPosition=-1;
m_oCurSelItem=null;
setVisible(this,"hidden");
}else{if(g_iDD_KEYCODE_SPACE==keyPress){setVisible(this,"hidden");
}}}}}},onClick:function(oEvent){this.saveFocusedElement(oEvent.data.$.srcElement);
this.evaluateAt();
this.keyHandler(oEvent.data.$.keyCode);
},onPopupDblClick:function(oElementClicked){if(this.selectionExists()){return;
}this.m_oEditor.focus();
if(null!=oElementClicked.firstChild){insertText(this,oElementClicked.firstChild.nodeValue);
this.m_oEditor.focus();
}setVisible(this,"hidden");
m_nItemPosition=-1;
},onPopupClick:function(oElementClicked){var previouslyShown=(m_oDropMenu.style.visibility==="visible");
$(this.m_oEditor.container.$).find(".cke_wysiwyg_div").trigger("click");
setColor(m_nItemPosition,m_colorBackgroundDefault,m_colorTextDefault);
for(var i=0;
i<m_oDropMenu.childNodes.length;
i++){if(m_oDropMenu.childNodes[i].firstChild.nodeValue==oElementClicked.firstChild.nodeValue){setColor(i,m_colorBackgroundHighlighted,m_colorTextHighlighted);
m_nItemPosition=i;
break;
}}this.m_oEditor.focus();
if(previouslyShown){if(this.m_previousItemSelectionIndex!==m_nItemPosition){setColor(this.m_previousItemSelectionIndex,m_colorBackgroundDefault,m_colorTextDefault);
}this.m_previousItemSelectionIndex=m_nItemPosition;
setVisible(this,"visible");
}},showManageAutoTextDlg:function(){CKEDITOR.AutoTextHelper.ShowManageAutoTextDlg();
},selectionExists:function(){var oRange=this.m_oEditor.document.$.selection.createRange();
if(null!=oRange&&oRange.text.length>0){this.hideDropMenu();
return true;
}return false;
},keyCodeHandledByPopup:function(nKeyCode){return(true==this.isPopupVisible()&&(g_iDD_KEYCODE_KEYDOWN==nKeyCode||g_iDD_KEYCODE_KEYUP==nKeyCode||g_iDD_KEYCODE_ENTER==nKeyCode))?true:false;
}};
}