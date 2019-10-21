if(typeof SpellCheck==="undefined"){SpellCheck={};
}SpellCheck.Element=function(parent){if(parent){this.root=parent.root;
if(parent.arrChildren){parent.arrChildren.push(this);
}}this.parent=parent;
this.arrChildren=[];
this.invalidTextIdx=null;
this.mapAttributeCache={};
this.isValid=function(){return this.root==this||this.root.invalidTextIdx==null||this.nTextStart<this.root.invalidTextIdx;
};
this.getHtml=function(){return this.sHtml||this.root.sHtml.substring(this.nTagStart,this.closingTag.nTagEnd+1);
};
this.getText=function(){return !this.root||this.root==this?this.sText:this.root.sText.substring(this.nTextStart,this.nTextEnd);
};
this.getAttribute=function(attributeName){var cached=this.mapAttributeCache[attributeName];
if(cached!=null){return cached;
}if(!this.sTagName){return null;
}var sAttributeHtml=this.root.sHtml.substring(this.nTagStart+this.sTagName.length+1,this.nTagEnd);
var r=new RegExp(/\s/.source+attributeName+/\s*=\s*(.)/.source,"g");
var match=r.exec(sAttributeHtml);
if(!match){return null;
}var nValueStart;
var chQuot=null;
if(match[1]==='"'||match[1]==="'"){nValueStart=match.index+match[0].length;
chQuot=match[1];
}else{nValueStart=match.index+match[0].length-1;
}var reValue;
if(chQuot){reValue=new RegExp("((?:\\\\'|\\\\\"|[^"+chQuot+"])*)"+chQuot,"g");
}else{reValue=/([^ \/>]*)/g;
}var matchValue=reValue.exec(sAttributeHtml.substring(nValueStart));
if(!matchValue){return null;
}var value=matchValue[1];
this.mapAttributeCache[attributeName]=value;
return value;
};
this.hasClassName=function(className){if(!this.sTagName){return false;
}var sClassNames=this.getAttribute("class");
return sClassNames?DDCOMMON.hasClassName(sClassNames,className):false;
};
this.parse=function(sHtml){this.root=this;
this.invalidTextIdx=null;
this.sHtml=sHtml;
this.sText="";
this.mapTextPositionCache={0:{node:this,htmlIndex:0}};
var currentTag=null;
var chQuote=false;
var stack=[this];
var nCursor=0;
var i;
for(i=0;
i<sHtml.length;
i++){if(currentTag){var ch=sHtml.charAt(i);
if(chQuote){if(ch==="\\"){if(sHtml.charAt(i+1)==="'"||sHtml.charAt(i+1)==='"'){i++;
}}else{if(ch===chQuote){chQuote=false;
}}}else{if(ch==="'"||ch==='"'){chQuote=sHtml.charAt(i);
}else{if(ch===">"){currentTag.nTagEnd=i;
currentTag.nTextStart=this.sText.length;
this.mapTextPositionCache[currentTag.nTextStart]={node:currentTag,htmlIndex:currentTag.nTagEnd+1};
stack.push(currentTag);
currentTag=null;
nCursor=i+1;
}}}}else{var nLtIdx=sHtml.indexOf("<",i);
var nAmpIdx=sHtml.indexOf("&",i);
if(nLtIdx>=0&&nAmpIdx>=0){i=Math.min(nLtIdx,nAmpIdx);
}else{if(nLtIdx>=0){i=nLtIdx;
}else{if(nAmpIdx>=0){i=nAmpIdx;
}else{break;
}}}this.sText+=sHtml.substring(nCursor,i);
if(sHtml.charAt(i)==="&"){var tag=new SpellCheck.Element(stack[stack.length-1]);
tag.nTagStart=i;
tag.sTagName="ENTITY";
tag.nTagEnd=sHtml.indexOf(";",i+1);
tag.nTextStart=this.sText.length;
this.mapTextPositionCache[this.sText.length]={node:tag,htmlIndex:i};
this.sText+=" ";
tag.nTextEnd=this.sText.length;
this.mapTextPositionCache[this.sText.length]={node:tag.parent,htmlIndex:tag.nTagEnd+1};
i=tag.nTagEnd;
nCursor=i+1;
}else{if(sHtml.charAt(i+1)==="/"){var closingTag=new SpellCheck.Element();
closingTag.nTagStart=i;
closingTag.nTagEnd=sHtml.indexOf(">",i+1);
if(closingTag.nTagEnd<0){throw"HTML malformed.  End of tag not found";
}closingTag.sTagName=/^\s*([^\s\/>]+)/.exec(sHtml.substring(i+2))[1];
closingTag.sTagName=closingTag.sTagName.toUpperCase();
do{var openingTag=stack.pop();
openingTag.closingTag=closingTag;
openingTag.nTextEnd=this.sText.length;
this.mapTextPositionCache[this.sText.length]={node:openingTag.parent,htmlIndex:closingTag.nTagEnd+1};
if(openingTag.sTagName===closingTag.sTagName){break;
}}while(stack.length);
i=closingTag.nTagEnd;
nCursor=closingTag.nTagEnd+1;
}else{var tag=new SpellCheck.Element(stack[stack.length-1]);
tag.nTagStart=i;
tag.sTagName=/^([^\s\/>]+)/.exec(sHtml.substring(i+1))[1];
tag.sTagName=tag.sTagName.toUpperCase();
if(tag.sTagName==="BR"){tag.nTextStart=this.sText.length;
this.mapTextPositionCache[this.sText.length]={node:tag,htmlIndex:i};
this.sText+="\r\n";
tag.nTextEnd=this.sText.length;
tag.nTagEnd=sHtml.indexOf(">",i);
if(tag.nTagEnd<0){throw"HTML malformed.  End of tag not found";
}this.mapTextPositionCache[this.sText.length]={node:tag.parent,htmlIndex:tag.nTagEnd+1};
i=tag.nTagEnd;
nCursor=i+1;
}else{currentTag=tag;
i+=currentTag.sTagName.length;
}}}}}if(i>=0){this.sText+=sHtml.substring(i);
}};
this.findNodeAt=function(nTextPos){for(var i=nTextPos;
i>=0;
i--){var oMarker=this.mapTextPositionCache[i];
if(oMarker){return oMarker.node;
}}return null;
};
this.findNodeWithClassAt=function(nTextPos,className){for(var node=this.findNodeAt(nTextPos);
node;
node=node.parent){if(node.hasClassName(className)){return node;
}}return null;
};
this.findCommonAncestor=function(nTextStart,nTextEnd){if(nTextStart>nTextEnd){throw"Range given to findCommonAncestor is invalid.";
}var leftNode=this.findNodeAt(nTextStart);
var rightNode=this.findNodeAt(nTextEnd-1);
if(leftNode.openingTag){leftNode=leftnode.openingTag;
}if(rightNode.openingTag){rightNode=rightnode.openingTag;
}if(leftNode==rightNode){return leftNode;
}for(var node=leftNode;
node&&node!==this.root;
node=node.parent){if(node.openingTag){node=node.openingTag;
}if(node.nTextEnd>=rightNode.nTextEnd){return node;
}}return this.root;
};
this.wrapRange=function(nTextStart,nTextEnd,sBefore,sAfter){if(nTextStart>nTextEnd){throw"Range given to wrapRange is invalid.";
}if(this.root.invalidTextIdx!=null&&nTextStart>=this.root.invalidTextIdx){throw"Range given to wrapRange is invalid; comes after invalidated data";
}var commonAncestor=this.findCommonAncestor(nTextStart,nTextEnd);
var nRangeHtmlStart=commonAncestor==this.root?nTextStart:commonAncestor.nTagEnd+1+(nTextStart-commonAncestor.nTextStart);
var nRangeHtmlLength=nTextEnd-nTextStart;
var calculateRange=function(parent){for(var i=0;
i<parent.arrChildren.length;
i++){var childNode=parent.arrChildren[i];
if(childNode.nTextEnd<=nTextStart){nRangeHtmlStart=childNode.closingTag?childNode.closingTag.nTagEnd+1:childNode.nTagEnd+1;
nRangeHtmlStart+=nTextStart-childNode.nTextEnd;
}else{if(childNode.nTextStart>=nTextStart&&childNode.nTextEnd<=nTextEnd){nRangeHtmlLength+=childNode.nTagEnd-childNode.nTagStart+1;
if(childNode.closingTag){nRangeHtmlLength+=childNode.closingTag.nTagEnd-childNode.closingTag.nTagStart+1;
}calculateRange(childNode);
}else{break;
}}}};
calculateRange(commonAncestor);
var sHtml=this.sHtml;
this.sHtml=[sHtml.substring(0,nRangeHtmlStart),sBefore,sHtml.substr(nRangeHtmlStart,nRangeHtmlLength),sAfter,sHtml.substring(nRangeHtmlStart+nRangeHtmlLength)].join("");
this.invalidTextIdx=nTextStart;
};
this.unwrap=function(element){if(this.root.invalidTextIdx!=null&&element.nTextStart>=this.root.invalidTextIdx){throw"Cannot unwrap invalidated element";
}var sHtml=this.sHtml;
this.sHtml=[sHtml.substring(0,element.nTagStart),sHtml.substring(element.nTagEnd+1,element.closingTag.nTagStart),sHtml.substring(element.closingTag.nTagEnd+1)].join("");
this.invalidTextIdx=element.nTextStart;
};
};