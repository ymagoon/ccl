/*
    This code is from Dynamic Web Coding at dyn-web.com
    Copyright 2003-2012 by Sharon Paine 
    See Terms of Use at www.dyn-web.com/business/terms.php
    regarding conditions under which you may use this code.
    This notice must be retained in the code as is!
    
    Version date: Nov 2012
    All required code is in this file
*/

/* Resources:
  focus/blur: http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
  dw_Util.getCurrentStyle: from jquery, dean edwards, see http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
*/

var dw_Event={add:function(obj,etype,fp,cap){cap=cap||false;if(obj.addEventListener)obj.addEventListener(etype,fp,cap);else if(obj.attachEvent)obj.attachEvent("on"+etype,fp);},remove:function(obj,etype,fp,cap){cap=cap||false;if(obj.removeEventListener)obj.removeEventListener(etype,fp,cap);else if(obj.detachEvent)obj.detachEvent("on"+etype,fp);},DOMit:function(e){e=e?e:window.event;if(!e.target)e.target=e.srcElement;if(!e.preventDefault)e.preventDefault=function(){e.returnValue=false;return false;};if(!e.stopPropagation)e.stopPropagation=function(){e.cancelBubble=true;};return e;},getTarget:function(e){e=dw_Event.DOMit(e);var tgt=e.target;if(tgt.nodeType!=1)tgt=tgt.parentNode;return tgt;}}

var dw_Viewport={getWinWidth:function(){this.width=0;if(window.innerWidth)this.width=window.innerWidth-18;else if(document.documentElement&&document.documentElement.clientWidth)this.width=document.documentElement.clientWidth;else if(document.body&&document.body.clientWidth)this.width=document.body.clientWidth;return this.width;},getWinHeight:function(){this.height=0;if(window.innerHeight)this.height=window.innerHeight-18;else if(document.documentElement&&document.documentElement.clientHeight)this.height=document.documentElement.clientHeight;else if(document.body&&document.body.clientHeight)this.height=document.body.clientHeight;return this.height;},getScrollX:function(){this.scrollX=0;if(typeof window.pageXOffset=="number")this.scrollX=window.pageXOffset;else if(document.documentElement&&document.documentElement.scrollLeft)this.scrollX=document.documentElement.scrollLeft;else if(document.body&&document.body.scrollLeft)this.scrollX=document.body.scrollLeft;else if(window.scrollX)this.scrollX=window.scrollX;return this.scrollX;},getScrollY:function(){this.scrollY=0;if(typeof window.pageYOffset=="number")this.scrollY=window.pageYOffset;else if(document.documentElement&&document.documentElement.scrollTop)this.scrollY=document.documentElement.scrollTop;else if(document.body&&document.body.scrollTop)this.scrollY=document.body.scrollTop;else if(window.scrollY)this.scrollY=window.scrollY;return this.scrollY;},getAll:function(){this.getWinWidth();this.getWinHeight();this.getScrollX();this.getScrollY();}};

var dw_Util;if(!dw_Util)dw_Util={};dw_Util.getImage=function(src){var img=new Image();img.src=src;return img;};dw_Util.forBackCompatWidth=function(el){var val=0;var getStyle=dw_Util.getCurrentStyle;if(el.currentStyle&&!window.opera&&(document.compatMode==null||document.compatMode=="BackCompat")){var pl=parseInt(getStyle(el,'paddingLeft'));var pr=parseInt(getStyle(el,'paddingRight'));var bl=parseInt(getStyle(el,'borderLeftWidth'));var br=parseInt(getStyle(el,'borderRightWidth'));val=(!isNaN(pl)?pl:0)+(!isNaN(pr)?pr:0)+(!isNaN(bl)?bl:0)+(!isNaN(br)?br:0);}return val;};dw_Util.getCurrentStyle=function(el,prop){var val='';if(document.defaultView&&document.defaultView.getComputedStyle){val=document.defaultView.getComputedStyle(el,null)[prop];}else if(el.currentStyle){val=el.currentStyle[prop];if(!/^\d+(px)?$/i.test(val)&&/^\d/.test(val)){var style=el.style.left;var runtimeStyle=el.runtimeStyle.left;el.runtimeStyle.left=el.currentStyle.left;el.style.left=val||0;val=el.style.pixelLeft+"px";el.style.left=style;el.runtimeStyle.left=runtimeStyle;}}return val;};dw_Util.writeStyleRule=function(rule,bScreenOnly){var media=(bScreenOnly!=false)?' media="screen">':'>';document.write('\n<style type="text/css"'+media+rule+'</style>');};dw_Util.mouseleave=function(e,oNode){e=dw_Event.DOMit(e);var toEl=e.relatedTarget?e.relatedTarget:e.toElement?e.toElement:null;if(oNode!=toEl&&!dw_Util.contained(toEl,oNode)){return true;}return false;};dw_Util.contained=function(oNode,oCont){if(!oNode)return null;while((oNode=oNode.parentNode))if(oNode==oCont)return true;return false;};dw_Util.getPageOffsets=function(el){var left=0,top=0;do{left+=el.offsetLeft;top+=el.offsetTop;}while((el=el.offsetParent));return{x:left,y:top};};dw_Util.isTouchDevice=function(){return 'ontouchend' in document;};dw_Util.makeClickable=function(sel,el){el=el||document;if(el.querySelectorAll){var list=el.querySelectorAll(sel);for(var i=0;list[i];i++){dw_Event.add(list[i],'click',function(){});}}};

var dw_Tooltip={tip:null,timer:0,hoverTimer:0,active:false,actuator:null,resetFlag:false,restored:true,init:function(){var _this=dw_Tooltip,el;if(_this.hasSupport()){_this.setProps(true);if(dw_Util.isTouchDevice()){if(!_this.supportTouch){return;}_this.forTouch=true;}if(!(el=document.getElementById(_this.tipID))){el=document.createElement("div");el.id=_this.tipID;document.body.appendChild(el);}el.style.position='absolute';el.style.visibility='hidden';el.style.zIndex=10000;_this.tip=el;if(_this.forTouch||_this.activateOnClick){_this.showDelay=1;_this.hideDelay=1;}_this.setProps();_this.setPosition(0,0);_this.initHandlers();}},hasSupport:function(){var doc=document;if(doc.createElement&&doc.getElementsByTagName&&(doc.addEventListener||doc.attachEvent)){return true;}return false;},setProps:function(dflts){var _this=dw_Tooltip;var list=dflts?_this.getDefaultsList():_this.getPropsList();var prop,el;if(!_this.defaultProps)_this.defaultProps={};for(var i=0;el=list[i];i++){prop=el[0];_this[prop]=(typeof _this.defaultProps[prop]==el[1])?_this.defaultProps[prop]:el[2];}if(!dflts){_this.tip.className=_this.klass;_this.coordinateOptions();}},getDefaultsList:function(){return[['offX','number',12],['offY','number',12],['showDelay','number',100],['hideDelay','number',100],['hoverDelay','number',500],['tipID','string','tipDiv'],['actuatorClass','string','showTip'],['maxLoops','number',2],['supportTouch','boolean',false],['activateOnClick','boolean',false],['showCloseBox','boolean',false],['closeBoxImage','string',''],['activateOnFocus','boolean',true],['content_source','string','content_vars'],['on_activate','function',function(){}],['on_show','function',function(){}],['on_position','function',function(){}],['on_deactivate','function',function(){}],['on_hide','function',function(){}]];},getPropsList:function(){return[['klass','string',''],['followMouse','boolean',true],['sticky','boolean',false],['hoverable','boolean',false],['duration','number',0],['jumpAbove','boolean',true],['jumpLeft','boolean',true],['Left','boolean',false],['Above','boolean',false],['positionFn','function',this.positionRelEvent],['wrapFn','function',this.plainWrap]];},plainWrap:function(str){return str;},activate:function(e,tgt,msg,id){var _this=dw_Tooltip;if(!_this.tip)return;_this.clearTimer('timer');_this.clearTimer('hoverTimer');if(!_this.restored){_this.handleRestore();}_this.actuator=tgt;dw_Viewport.getAll();_this.getContent(e,tgt,msg,id);if(!_this.tip.innerHTML)return;_this.active=true;_this.on_activate();_this.positionFn(e,tgt);_this.adjust();_this.timer=setTimeout(_this.show,_this.showDelay);},getContent:function(e,tgt,msg,id){var _this=dw_Tooltip,vars,obj;if(id&&!msg){vars=_this.content_vars||{};obj=vars[id]?vars[id]:false;if(typeof obj=='string'){msg=obj;}else if(typeof obj=='object'){_this.checkForProps(obj);if(_this.content_source=='ajax'&&!obj['static']){_this.initAjaxRequest(id);}if(obj['content']){msg=obj['content'];}else if(obj['html_id']){var el=document.getElementById(obj['html_id']);if(el)msg=el.innerHTML;}else{msg=obj;}}}_this.restored=false;_this.handleOptions(e);_this.writeTip(msg);},writeTip:function(msg){msg=this.wrapFn(msg);this.tip.innerHTML=msg;},positionRelEvent:function(e,tgt){var _this=dw_Tooltip,pos;if(typeof e=='object'){if(e.type=='mouseover'||e.type=='mousemove'||e.type=='click'){_this.evX=_this.getMouseEventX(e);_this.evY=_this.getMouseEventY(e);if(e.type=='click'){pos=dw_Util.getPageOffsets(tgt);if((_this.evX>(pos.x+tgt.offsetWidth))||(_this.evX<pos.x)||(_this.evY>(pos.y+tgt.offsetHeight))||(_this.evY<pos.y)){_this.evX=pos.x;_this.evY=pos.y;_this.foc=true;}}}else{pos=dw_Util.getPageOffsets(tgt);_this.evX=pos.x;_this.evY=pos.y;_this.foc=true;}}var coords=_this.calcPosCoords(e,tgt);_this.setPosition(coords.x,coords.y);},calcPosCoords:function(e,tgt){var vp=dw_Viewport,_this=dw_Tooltip;var x=_this.evX,y=_this.evY;var maxX=_this.getMaxX(),maxY=_this.getMaxY();var xXd,yXd,dx,dy;var tx=x+_this.offX,ty=y+_this.offY;var altx=x-(_this.width+_this.offX);var alty=y-(_this.height+_this.offY);var spL=x-vp.scrollX>vp.width/2;var spA=y-vp.scrollY>vp.height/2;if(typeof e=='object'&&_this.foc){_this.focX=x+_this.offX+tgt.offsetWidth;if(_this.focX<=maxX){tx=_this.focX;}else{tx=_this.focX=maxX;}}else if(_this.focX){tx=_this.focX;}if(tx<=maxX&&!_this.Left){x=tx;}else if(altx>=vp.scrollX&&(_this.jumpLeft||_this.Left)){x=altx;}else if((_this.jumpLeft&&spL)||_this.Left){x=vp.scrollX;xXd='Left';}else{x=maxX;xXd='Right';}if(ty<=maxY&&!_this.Above){y=ty;}else if(alty>=vp.scrollY&&(_this.jumpAbove||_this.Above)){y=alty;}else if((_this.jumpAbove&&spA)||_this.Above){y=vp.scrollY;yXd='Above';}else{y=maxY;yXd='Below';}if(xXd&&yXd){dx=(xXd=='Left')?vp.scrollX-altx:tx-maxX;dy=(yXd=='Above')?vp.scrollY-alty:ty-maxY;if(dx<=dy){x=(xXd=='Left')?altx:tx;}else{y=(yXd=='Above')?alty:ty;}}return{x:x,y:y}},adjust:function(){var _this=dw_Tooltip;var imgs=_this.tip.getElementsByTagName('img');var img=imgs.length?imgs[imgs.length-1]:null;checkComplete();function checkComplete(){if(!_this.active)return;_this.positionFn();if(img&&!img.complete){setTimeout(checkComplete,50);}}},setPosition:function(x,y){this.tip.style.left=x+'px';this.tip.style.top=y+'px';this.on_position();},show:function(){var _this=dw_Tooltip;_this.tip.style.visibility='visible';_this.on_show();},deactivate:function(e){var _this=dw_Tooltip;if(!_this.tip||!_this.active||_this.sticky){return;}e=e?e:window.event;if(e.type&&e.type=='mouseout'&&!dw_Util.mouseleave(e,_this.actuator)){return;}_this.clearTimer('timer');_this.clearTimer('hoverTimer');if(_this.hoverable){_this.hoverTimer=setTimeout(_this.hide,_this.hoverDelay);return;}if(_this.duration){_this.timer=setTimeout(_this.hide,_this.duration);return;}_this.on_deactivate();_this.timer=setTimeout(_this.hide,_this.hideDelay);},hide:function(){var _this=dw_Tooltip;if(!_this.tip)return;_this.tip.style.visibility='hidden';_this.handleRestore();_this.on_hide();},handleOptions:function(e){var _this=dw_Tooltip;_this.coordinateOptions();if(_this.klass){_this.tip.className=_this.klass;}if(_this.hoverable){_this.tip.onmouseout=_this.tipOutCheck;_this.tip.onmouseover=function(){_this.clearTimer('hoverTimer');}}else if(_this.followMouse&&!(e.type=='focus'||e.type=='focusin')){dw_Event.add(document,'mousemove',_this.positionRelEvent,true);}else if(!(_this.forTouch||_this.activateOnClick)&&(_this.sticky||_this.duration)){dw_Event.add(document,"mouseup",_this.checkDocClick,true);}if(!_this.activateOnClick){dw_Event.add(_this.actuator,"click",_this.checkLinkClick);}},coordinateOptions:function(){var _this=dw_Tooltip;if(_this.forTouch||_this.activateOnClick||_this.sticky||_this.hoverable||_this.duration||_this.positionFn!=_this.positionRelEvent){_this.followMouse=false;}if(_this.forTouch||_this.activateOnClick||_this.sticky){_this.hoverable=false;_this.duration=0;}if(_this.hoverable){_this.duration=0;}if((_this.sticky||_this.forTouch||_this.activateOnClick)&&(_this.wrapFn==_this.plainWrap)){_this.wrapFn=_this.handleWrapOpts;}},handleRestore:function(){var _this=dw_Tooltip;if(_this.followMouse){dw_Event.remove(document,'mousemove',_this.positionRelEvent,true);}else if(!(_this.forTouch||_this.activateOnClick)&&(_this.sticky||_this.duration)){dw_Event.remove(document,"mouseup",_this.checkDocClick,true);}if(!_this.forTouch){_this.tip.onmouseover=_this.tip.onmouseout=function(){};}if(!_this.activateOnClick&&_this.actuator){dw_Event.remove(_this.actuator,"click",_this.checkLinkClick);}if(_this.resetFlag){_this.setProps();}_this.resetRequest();_this.tip.innerHTML='';_this.active=false;_this.actuator=null;_this.tip.style.width='';_this.focX=0;_this.foc=false;_this.restored=true;},getTipClass:function(cls){if(!cls){return '';}var c='',classes=cls.split(/\s+/);for(var i=0;classes[i];i++){if(classes[i]==this.actuatorClass&&classes[i+1]){c=classes[i+1];break;}}return c;},checkForProps:function(obj){var _this=dw_Tooltip,list=_this.getPropsList(),prop;for(var i=0;list[i];i++){prop=list[i][0];if(typeof obj[prop]!='undefined'){_this[prop]=obj[prop];_this.resetFlag=true;}}},tipOutCheck:function(e){var _this=dw_Tooltip,tip=this;if(dw_Util.mouseleave(e,tip)){_this.timer=setTimeout(_this.hide,_this.hideDelay);}},checkEscKey:function(e){e=e?e:window.event;if(e.keyCode==27)dw_Tooltip.hide();},checkDocClick:function(e){var _this=dw_Tooltip;if(!_this.active)return;var tgt=dw_Event.getTarget(e);var tip=document.getElementById(_this.tipID);if(tgt===_this.actuator||tgt===tip){return;}else if(dw_Util.contained(tgt,tip)){if(tgt.tagName&&tgt.tagName.toLowerCase()=="img")tgt=tgt.parentNode;if(tgt.tagName.toLowerCase()!="a"||tgt.href.indexOf("dw_Tooltip.hide")!=-1)return;}_this.timer=setTimeout(_this.hide,10);},checkLinkClick:function(e){var _this=dw_Tooltip,tgt=_this.actuator,cur_href,tgt_href,cur,pg,pt;if(!(tgt.nodeName.toLowerCase()=='a')&&!(tgt.nodeName.toLowerCase()=='area')){return;}tgt_href=tgt.href;if(!tgt_href||!(tgt_href.lastIndexOf('#')==tgt_href.length-1)){return;}cur_href=location.href;pt=cur_href.indexOf('#');cur=(pt!=-1)?cur_href.slice(0,pt):cur_href;pt=tgt_href.indexOf('#');pg=(pt!=-1)?tgt_href.slice(0,pt):tgt_href;if(cur==pg){e=dw_Event.DOMit(e);e.preventDefault();}},clearTimer:function(timer){if(dw_Tooltip[timer]){clearTimeout(dw_Tooltip[timer]);dw_Tooltip[timer]=0;}},initAjaxRequest:function(){},resetRequest:function(){},getWidth:function(){return this.width=this.tip.offsetWidth;},getHeight:function(){return this.height=this.tip.offsetHeight;},getMaxX:function(){return dw_Viewport.width+dw_Viewport.scrollX-this.getWidth()-1;},getMaxY:function(){return dw_Viewport.height+dw_Viewport.scrollY-this.getHeight()-1;},getMouseEventX:function(e){return e.pageX?e.pageX:e.clientX+dw_Viewport.scrollX;},getMouseEventY:function(e){return e.pageY?e.pageY:e.clientY+dw_Viewport.scrollY;},checkForActuator:function(e){var tgt=dw_Event.getTarget(e);if(!tgt){return;}var _this=dw_Tooltip,tipAct=null,ctr=0,msg='',id='',maxCnt=_this.maxLoops;do{if((tipAct=_this.getActuatorInfo(tgt))){msg=tipAct.msg;id=tipAct.id;switch(e.type){case 'mouseover':if(!_this.forTouch){if(window.attachEvent){dw_Event.remove(tgt,'mouseout',_this.deactivate);}dw_Event.add(tgt,'mouseout',_this.deactivate);}if(_this.forTouch&&_this.activateOnClick){dw_Event.add(tgt,'click',function(e){e.preventDefault();});}break;case 'click':if(_this.activateOnClick){e.preventDefault();}break;case 'focus':case 'focusin':if(_this.active&&tgt==_this.actuator){return;}if(window.addEventListener){dw_Event.add(tgt,'blur',_this.deactivate);}else if(window.attachEvent){dw_Event.add(tgt,'focusout',_this.deactivate);}break;}_this.activate(e,tgt,msg,id);break;}ctr++;}while(ctr<maxCnt&&(tgt=tgt.parentNode));},getActuatorInfo:function(tgt){var _this=dw_Tooltip,cls=_this.getTipClass(tgt.className);if(!cls)return '';var vars=_this.content_vars||{},msg='',id='',el;id=(vars&&vars[cls])?cls:'';if(!id&&_this.content_source=='class_id'&&(el=document.getElementById(cls))){msg=el.innerHTML;}if(id||msg){return{msg:msg,id:id}}return false;},initHandlers:function(){var _this=dw_Tooltip;if(_this.ready){return;}if(!_this.forTouch){if(_this.activateOnClick){dw_Event.add(document,'click',_this.checkForActuator,true);dw_Event.add(document,"mouseup",_this.checkDocClick,true);}else{dw_Event.add(document,'mouseover',_this.checkForActuator,true);}dw_Event.add(document,"keydown",_this.checkEscKey,true);if(!_this.activateOnClick&&_this.activateOnFocus){if(window.addEventListener){dw_Event.add(document,'focus',_this.checkForActuator,true);}else if(window.attachEvent){dw_Event.add(document,'focusin',_this.checkForActuator);}}}else{dw_Event.add(document,'mouseover',_this.checkForActuator,true);}_this.ready=true;}}

/////////////////////////////////////////////////////////////////////
// NOTE: means of adding tipContent style rule is available for xml (without document.write)
// Used when the tooltip content is in HTML elements with tipContent class attached 
dw_Tooltip.writeStyleRule = function() {
    if ( dw_Tooltip.hasSupport() ) {
        dw_Util.writeStyleRule('.tipContent { display:none; }');
    }
}

/////////////////////////////////////////////////////////////////////
//  Positioning algorithms 
dw_Tooltip.posWinCenter = dw_Tooltip.positionWindowCenter = function() {
    var vp = dw_Viewport, _this = dw_Tooltip;
    var x = Math.round( (vp.width - _this.tip.offsetWidth)/2 ) + vp.scrollX;
    var y = Math.round( (vp.height - _this.tip.offsetHeight)/2 ) + vp.scrollY;
    _this.setPosition(x,y);
}

// new fn's to position relative to target location
dw_Tooltip.posCenterAboveTgt = function() {
    var _this = dw_Tooltip;
    var tgt = _this.actuator;
    var pos = dw_Util.getPageOffsets( tgt );
    // center horizontally
    var x = pos.x + (tgt.offsetWidth/2 - _this.tip.offsetWidth/2);
    var y = pos.y - _this.tip.offsetHeight; // above
    _this.setPosition(x,y);
}

dw_Tooltip.posCenterBelowTgt = function() {
    var _this = dw_Tooltip;
    var tgt = _this.actuator;
    var pos = dw_Util.getPageOffsets( tgt );
    // center horizontally
    var x = pos.x + (tgt.offsetWidth/2 - _this.tip.offsetWidth/2);
    var y = pos.y + tgt.offsetHeight + _this.offY; // below
    _this.setPosition(x,y);
}

dw_Tooltip.posLeftTgt = function() {
    var _this = dw_Tooltip;
    var tgt = _this.actuator;
    var pos = dw_Util.getPageOffsets( tgt );
    var x = pos.x - (_this.tip.offsetWidth + _this.offX);
    var y = pos.y;
    _this.setPosition(x,y);
}

dw_Tooltip.posRightTgt = function() {
    var _this = dw_Tooltip;
    var tgt = _this.actuator;
    var pos = dw_Util.getPageOffsets( tgt );
    var x = pos.x + tgt.offsetWidth + _this.offX;
    var y = pos.y;
    _this.setPosition(x,y);
}

/////////////////////////////////////////////////////////////////////
// formatting and display functions 

// for style sheet specs: div.topBar, span.closeBox, span.caption, div.XtipContent
dw_Tooltip.wrapWithCloseBox = function(str, caption) {
    caption = caption || ''; //'&nbsp;'; 
    var img = this.closeBoxImage || '', css = '', box, msg;
    if ( img ) { 
        dw_Util.getImage(img); 
    } else { // styles for linked X
        css = ' style="text-decoration:none; font-weight:bold;"';
    }
    box = img? '<img style="border:none" src="' + img + '" alt="Close box" />': 'X';
    msg = '<div class="topBar"><span class="closeBox" style="position:absolute; top:0; right:0; text-align:right;"><a href="javascript: void dw_Tooltip.hide()"' + css + '>' + box + '</a></span><span class="caption">' + caption + '</span></div><div class="XtipContent">' + str + '</div>';
    return msg;
}

// close link at bottom
dw_Tooltip.wrapWithCloseLink = function(str, caption) {
    if ( caption ) {
        str = '<div class="caption">' + caption + '</div>' + str;
    }
    str += '<div class="close" style="text-align:center; margin:4px 0;"><a href="javascript: void dw_Tooltip.hide()">Close</a></div>';
    return str;
}

// handles options for caption, width, closebox for wrap functions below
// div.caption if no close box (not sticky, activateOnClick, forTouch)
dw_Tooltip.handleWrapOpts = function(str, obj) {
    var _this = dw_Tooltip;
    var w = (obj && obj['w'])? obj['w']: '';
    var caption = (obj && obj['caption'])? obj['caption']: '';
    if ( _this.sticky || _this.activateOnClick || _this.forTouch ) { 
        str = _this.showCloseBox? _this.wrapWithCloseBox(str, caption): _this.wrapWithCloseLink(str, caption);
    } else if ( caption ) { 
        str = '<div class="caption">' + caption + '</div>' + str;
    }
    if ( w && _this.showCloseBox && (_this.sticky || _this.activateOnClick || _this.forTouch) ) { 
        w += 8; // attempt to account for padding of inner wrapper
    }
    if ( w ) { _this.setTipWidth( w ); }
    return str;
}

/////////////////////////////////////////////////////////////////////
// customizable wrap functions. Modify (at your own risk) or ask for
// custom function(s) designed to suit your needs.

// optional caption, optional width supported by all these wrapFn's
// if js errors, check content_vars obj props 

//  modified to include option for img or str props in obj
dw_Tooltip.wrapToWidth = function(obj) {
    var _this = dw_Tooltip; var str = '';
    if ( obj['img'] ) {
        dw_Util.getImage( obj['img'] );
        str = '<img src="' + obj['img'] + '" alt="" />';
    } else {
        str = obj['str'];
    }
    return dw_Tooltip.handleWrapOpts(str, obj);
}

dw_Tooltip.wrapImageOverText = function(obj) {
    dw_Util.getImage( obj['img'] );
    var str = '<div class="img"><img src="' + obj['img'] + '" alt="" /></div><div class="txt">' + obj['txt'] + '</div>';
    return dw_Tooltip.handleWrapOpts(str, obj);
}

dw_Tooltip.wrapTextOverImage = function(obj) {
    dw_Util.getImage( obj['img'] );
    var str = '<div class="txt">' + obj['txt'] + '</div><div class="img"><img src="' + obj['img'] + '" alt="" /></div>';
    return dw_Tooltip.handleWrapOpts(str, obj);
}

// Image and text side by side
// w is width to set tipDiv
dw_Tooltip.wrapTextByImage = function(obj) {
    dw_Util.getImage( obj['img'] );
    
    // table with att's used to reduce support issues that other markup choices would entail!
    var str = '<table cellpadding="0" cellspacing="0" border="0"><tr>' + 
        '<td><div class="txt">' + obj['txt'] + '</div></td>' + 
         '<td><div class="img"><img src="' + obj['img'] + '" alt="" /></div>' + 
         '</td></tr></table>';
    
    return dw_Tooltip.handleWrapOpts(str, obj);
}

// w, h in obj are applied to img width and height attributes
// can be used to resize img
dw_Tooltip.wrapImageToWidth = function(obj) {
    var _this = dw_Tooltip; dw_Util.getImage( obj['img'] );
    var str = '<img src="' + obj['img'] + '" width="' + obj['w'] + '" height="' + obj['h'] + '" alt="" />';
    return dw_Tooltip.handleWrapOpts(str, obj);
}

// end customizable wrap functions
/////////////////////////////////////////////////////////////////////

// several functions include option of setting width 
dw_Tooltip.setTipWidth = function(w) {
    w = parseInt(w) + dw_Util.forBackCompatWidth( this.tip ); // in case padding and border set on tipDiv
    this.tip.style.width = w + "px";
}

/////////////////////////////////////////////////////////////////////
// Initialization: init tooltip and set up event delegation
dw_Event.add( window, 'load', dw_Tooltip.init );