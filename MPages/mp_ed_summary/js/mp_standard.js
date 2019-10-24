//*************************************************************************
//  *                                                                      *
//  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
//  *                              Technology, Inc.                        *
//  *       Revision      (c) 1984-1997 Cerner Corporation                 *
//  *                                                                      *
//  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
//  *  This material contains the valuable properties and trade secrets of *
//  *  Cerner Corporation of Kansas City, Missouri, United States of       *
//  *  America (Cerner), embodying substantial creative efforts and        *
//  *  confidential information, ideas and expressions, no part of which   *
//  *  may be reproduced or transmitted in any form or by any means, or    *
//  *  retained in any storage or retrieval system without the express     *
//  *  written permission of Cerner.                                       *
//  *                                                                      *
//  *  Cerner is a registered mark of Cerner Corporation.                  *
//  *                                                                      *
//  ~BE~*******************************************************************/
///*************************************************************************
// 
//        Source file name:       mp_standard.js
//        Object name:
//        Request #:              N/A
// 
//        Product:                Discern ABU Services
//        Product Team:           Discern ABU Services
//        HNA Version:            HNAM: 08Jun2008
//        CCL Version:            CCL REV 8.4.1
// 
//        Program purpose:        Suplemental Javascript Functions for ED Summary MPage
// 
//        Tables read:            None
// 
//        Tables updated:         None
// 
//        Executing from:         Power Chart
// 
//        Special Notes:          None
// 
//***************************************************************************************/
//;~DB~**********************************************************************************
//;    *                   GENERATED MODIFICATION CONTROL LOG                           *
//;    **********************************************************************************
//;    *                                                                                *
//;    *Mod Date     Engineer            Feature    Comment                             *
//;    *--- -------- ------------------- -------    ----------------------------------- *
//;    *000 11/13/09 Kenny Benke         000000     Initial release                     *
//;~DE~**********************************************************************************
//;~END~ ************************  END OF ALL MODCONTROL BLOCKS  ************************

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///***********************************************
//* AnyLink CSS Menu script v2.0- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
//* This notice MUST stay intact for legal use
//* Visit Project Page at http://www.dynamicdrive.com/dynamicindex1/anylinkcss.htm for full source code
//***********************************************/




//** AnyLink CSS Menu v2.0- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com
//** Script Download/ instructions page: http://www.dynamicdrive.com/dynamicindex1/anylinkcss.htm
//** January 19', 2009: Script Creation date

//**May 23rd, 09': v2.1
	//1) Automatically adds a "selectedanchor" CSS class to the currrently selected anchor link
	//2) For image anchor links, the custom HTML attributes "data-image" and "data-overimage" can be inserted to set the anchor's default and over images.

//**June 1st, 09': v2.2
	//1) Script now runs automatically after DOM has loaded. anylinkcssmenu.init) can now be called in the HEAD section

if (typeof dd_domreadycheck=="undefined") //global variable to detect if DOM is ready
	var dd_domreadycheck=false

var anylinkcssmenu={

menusmap: {},
preloadimages: [],
effects: {delayhide: 200, shadow:{enabled:true, opacity:0.3, depth: [5, 5]}, fade:{enabled:false, duration:500}}, //customize menu effects

dimensions: {},

getoffset:function(what, offsettype){
	return (what.offsetParent)? what[offsettype]+this.getoffset(what.offsetParent, offsettype) : what[offsettype]
},

getoffsetof:function(el){
	el._offsets={left:this.getoffset(el, "offsetLeft"), top:this.getoffset(el, "offsetTop"), h: el.offsetHeight}
},

getdimensions:function(menu){
	this.dimensions={anchorw:menu.anchorobj.offsetWidth, anchorh:menu.anchorobj.offsetHeight,
		docwidth:(window.innerWidth ||this.standardbody.clientWidth)-20,
		docheight:(window.innerHeight ||this.standardbody.clientHeight)-15,
		docscrollx:window.pageXOffset || this.standardbody.scrollLeft,
		docscrolly:window.pageYOffset || this.standardbody.scrollTop
	}
	if (!this.dimensions.dropmenuw){
		this.dimensions.dropmenuw=menu.dropmenu.offsetWidth
		this.dimensions.dropmenuh=menu.dropmenu.offsetHeight
	}
},

isContained:function(m, e){
	var e=window.event || e
	var c=e.relatedTarget || ((e.type=="mouseover")? e.fromElement : e.toElement)
	while (c && c!=m)try {c=c.parentNode} catch(e){c=m}
	if (c==m)
		return true
	else
		return false
},

setopacity:function(el, value){
	el.style.opacity=value
	if (typeof el.style.opacity!="string"){ //if it's not a string (ie: number instead), it means property not supported
		el.style.MozOpacity=value
		if (el.filters){
			//el.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity="+ value*100 +")"
		}
	}
},

showmenu:function(menuid){
	var menu=anylinkcssmenu.menusmap[menuid]
	clearTimeout(menu.hidetimer)
	this.getoffsetof(menu.anchorobj)
	this.getdimensions(menu)
	//var posx=menu.anchorobj._offsets.left + (menu.orientation=="lr"? this.dimensions.anchorw : 0) //base x pos
	//var posy=menu.anchorobj._offsets.top+this.dimensions.anchorh - (menu.orientation=="lr"? this.dimensions.anchorh : 0)//base y pos
	
	var e = window.event;
	var cursor = {x: 0, y: 0};
	if (e.pageX || e.pageY) {
	    cursor.x = e.pageX;
	    cursor.y = e.pageY;
	}
	else {
	    var de = document.documentElement;
	    var b = document.body;
	    cursor.x = e.clientX +
	               (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
	    cursor.y = e.clientY +
	               (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
        }
	var posx = cursor.x;
	var posy = cursor.y;
	//alert("posx="+posx+"\nposy="+posy);
	
	if (posx+this.dimensions.dropmenuw+this.effects.shadow.depth[0]>this.dimensions.docscrollx+this.dimensions.docwidth){ //drop left instead?
		posx=posx-this.dimensions.dropmenuw + (menu.orientation=="lr"? -this.dimensions.anchorw : this.dimensions.anchorw)
	}
	if (posy+this.dimensions.dropmenuh>this.dimensions.docscrolly+this.dimensions.docheight){  //drop up instead?
		posy=Math.max(posy-this.dimensions.dropmenuh - (menu.orientation=="lr"? -this.dimensions.anchorh : this.dimensions.anchorh), this.dimensions.docscrolly) //position above anchor or window's top edge
	}
	if (this.effects.fade.enabled){
		this.setopacity(menu.dropmenu, 0) //set opacity to 0 so menu appears hidden initially
		if (this.effects.shadow.enabled)
			this.setopacity(menu.shadow, 0) //set opacity to 0 so shadow appears hidden initially
	}
	//var e = window.event;
	//var cursor = {x: 0, y: 0};
	//if (e.pageX || e.pageY) {
	//    cursor.x = e.pageX;
	//    cursor.y = e.pageY;
	//}
	//else {
	//    var de = document.documentElement;
	//    var b = document.body;
	//    cursor.x = e.clientX +
	//               (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
	//    cursor.y = e.clientY +
	//               (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
        //}
	//alert("posx="+posx+"\nposy="+posy+"\ncursor.x="+cursor.x+"\ncursor.y="+cursor.y);

	menu.dropmenu.setcss({left:posx+'px', top:posy+'px', visibility:'visible'})
	if (this.effects.shadow.enabled)
		menu.shadow.setcss({left:posx+anylinkcssmenu.effects.shadow.depth[0]+'px', top:posy+anylinkcssmenu.effects.shadow.depth[1]+'px', visibility:'visible'})
	if (this.effects.fade.enabled){
		clearInterval(menu.animatetimer)
		menu.curanimatedegree=0
		menu.starttime=new Date().getTime() //get time just before animation is run
		menu.animatetimer=setInterval(function(){anylinkcssmenu.revealmenu(menuid)}, 20)
	}
},

revealmenu:function(menuid){
	var menu=anylinkcssmenu.menusmap[menuid]
	var elapsed=new Date().getTime()-menu.starttime //get time animation has run
	if (elapsed<this.effects.fade.duration){
		this.setopacity(menu.dropmenu, menu.curanimatedegree)
		if (this.effects.shadow.enabled)
			this.setopacity(menu.shadow, menu.curanimatedegree*this.effects.shadow.opacity)
	}
	else{
		clearInterval(menu.animatetimer)
		this.setopacity(menu.dropmenu, 1)
		menu.dropmenu.style.filter=""
	}
	menu.curanimatedegree=(1-Math.cos((elapsed/this.effects.fade.duration)*Math.PI)) / 2
},

setcss:function(param){
	for (prop in param){
		this.style[prop]=param[prop]
	}
},

setcssclass:function(el, targetclass, action){
	var needle=new RegExp("(^|\\s+)"+targetclass+"($|\\s+)", "ig")
	if (action=="check")
		return needle.test(el.className)
	else if (action=="remove")
		el.className=el.className.replace(needle, "")
	else if (action=="add" && !needle.test(el.className))
		el.className+=" "+targetclass
},

hidemenu:function(menuid){
	var menu=anylinkcssmenu.menusmap[menuid]
	clearInterval(menu.animatetimer)
	menu.dropmenu.setcss({visibility:'hidden', left:0, top:0})
	menu.shadow.setcss({visibility:'hidden', left:0, top:0})
},

getElementsByClass:function(targetclass){
	if (document.querySelectorAll)
		return document.querySelectorAll("."+targetclass)
	else{
		var classnameRE=new RegExp("(^|\\s+)"+targetclass+"($|\\s+)", "i") //regular expression to screen for classname
		var pieces=[]
		var alltags=document.all? document.all : document.getElementsByTagName("*")
		for (var i=0; i<alltags.length; i++){
			if (typeof alltags[i].className=="string" && alltags[i].className.search(classnameRE)!=-1)
				pieces[pieces.length]=alltags[i]
		}
		return pieces
	}
},

addEvent:function(targetarr, functionref, tasktype){
	if (targetarr.length>0){
		var target=targetarr.shift()
		if (target.addEventListener)
			target.addEventListener(tasktype, functionref, false)
		else if (target.attachEvent)
			target.attachEvent('on'+tasktype, function(){return functionref.call(target, window.event)})
		this.addEvent(targetarr, functionref, tasktype)
	}
},


addState:function(anchorobj, state){
	if (anchorobj.getAttribute('data-image')){
		var imgobj=(anchorobj.tagName=="IMG")? anchorobj : anchorobj.getElementsByTagName('img')[0]
		if (imgobj){
			imgobj.src=(state=="add")? anchorobj.getAttribute('data-overimage') : anchorobj.getAttribute('data-image')
		}
	}
	else
		anylinkcssmenu.setcssclass(anchorobj, "selectedanchor", state)
},


setupmenu:function(targetclass, anchorobj, pos){
	this.standardbody=(document.compatMode=="CSS1Compat")? document.documentElement : document.body
	var relattr=anchorobj.getAttribute("rel")
	var dropmenuid=relattr.replace(/\[(\w+)\]/, '')
	var menu=this.menusmap[targetclass+pos]={
		id: targetclass+pos,
		anchorobj: anchorobj,	
		dropmenu: document.getElementById(dropmenuid),
		revealtype: (relattr.length!=dropmenuid.length && RegExp.$1=="click")? "click" : "mouseover",
		orientation: anchorobj.getAttribute("rev")=="lr"? "lr" : "ud",
		shadow: document.createElement("div")
	}
	menu.anchorobj._internalID=targetclass+pos
	menu.anchorobj._isanchor=true
	menu.dropmenu._internalID=targetclass+pos
	menu.shadow._internalID=targetclass+pos
	menu.shadow.className="anylinkshadow";
	var fragment = document.createDocumentFragment();
	fragment.appendChild(menu.dropmenu);
	fragment.appendChild(menu.shadow);
	//document.body.appendChild(menu.dropmenu) //move drop down div to end of page
	//document.body.appendChild(menu.shadow)
	document.body.appendChild(fragment);
	menu.dropmenu.setcss=this.setcss
	menu.shadow.setcss=this.setcss
	menu.shadow.setcss({width: menu.dropmenu.offsetWidth+"px", height:menu.dropmenu.offsetHeight+"px"})
	this.setopacity(menu.shadow, this.effects.shadow.opacity)
	this.addEvent([menu.anchorobj, menu.dropmenu, menu.shadow], function(e){ //MOUSEOVER event for anchor, dropmenu, shadow
		var menu=anylinkcssmenu.menusmap[this._internalID]
		if (this._isanchor && menu.revealtype=="mouseover" && !anylinkcssmenu.isContained(this, e)){ //event for anchor
			anylinkcssmenu.showmenu(menu.id)
			anylinkcssmenu.addState(this, "add")
		}
		else if (typeof this._isanchor=="undefined"){ //event for drop down menu and shadow
			clearTimeout(menu.hidetimer)
		}
	}, "mouseover")
	this.addEvent([menu.anchorobj, menu.dropmenu, menu.shadow], function(e){ //MOUSEOUT event for anchor, dropmenu, shadow
		if (!anylinkcssmenu.isContained(this, e)){
			var menu=anylinkcssmenu.menusmap[this._internalID]
			menu.hidetimer=setTimeout(function(){
				anylinkcssmenu.addState(menu.anchorobj, "remove")
				anylinkcssmenu.hidemenu(menu.id)
			}, anylinkcssmenu.effects.delayhide)
		}
	}, "mouseout")
	this.addEvent([menu.anchorobj, menu.dropmenu], function(e){ //CLICK event for anchor, dropmenu
		var menu=anylinkcssmenu.menusmap[this._internalID]
		if ( this._isanchor && menu.revealtype=="click"){
			if (menu.dropmenu.style.visibility=="visible")
				anylinkcssmenu.hidemenu(menu.id)
			else{
				anylinkcssmenu.addState(this, "add")
				anylinkcssmenu.showmenu(menu.id)
			}
			if (e.preventDefault)
				e.preventDefault()
			return false
		}
		else
			menu.hidetimer=setTimeout(function(){anylinkcssmenu.hidemenu(menu.id)}, anylinkcssmenu.effects.delayhide)
	}, "click")
},

trueinit:function(targetclass){
	var anchors=this.getElementsByClass(targetclass)
	var preloadimages=this.preloadimages
	for (var i=0; i<anchors.length; i++){
		if (anchors[i].getAttribute('data-image')){ //preload anchor image?
			preloadimages[preloadimages.length]=new Image()
			preloadimages[preloadimages.length-1].src=anchors[i].getAttribute('data-image')
		}
		if (anchors[i].getAttribute('data-overimage')){ //preload anchor image?
			preloadimages[preloadimages.length]=new Image()
			preloadimages[preloadimages.length-1].src=anchors[i].getAttribute('data-overimage')
		}
		this.setupmenu(targetclass, anchors[i], i)
	}
}


}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////








function LoadDataXML(sXML){
  // Load MPage data
  try //Internet Explorer
    {
    var xmlData = new ActiveXObject("Microsoft.XMLDOM");
    xmlData.async="false";
    xmlData.loadXML(sXML);
    }
  catch(e){
    try //Firefox, Mozilla, Opera, etc.
      {
      parser=new DOMParser();
      var xmlData = parser.parseFromString(sXML, "text/xml");
    }
    catch(e){
      alert("Could not load XML text");
      return(null);
    }
  }
  return(xmlData);
}

function ReportLink(dReport){
    //check for decimal value
    var decValue = "" + dReport;
    if (decValue.indexOf(".") == -1) {
        dReport = dReport + ".0";//convert to decimal
    }
  return('"CCLLINK(mp_clin_smry_clinicaldocs, \'^MINE^, ' + dReport + ',1\', 1);"');
}

function MillLinkTab(sLabel, sLink, dEncntr, dPerson, dAppNum){
  if((sLink.length > 0) && (dAppNum == 600005)){
    var sParms = "/PERSONID=" + dPerson + " /ENCNTRID=" + dEncntr + " /FIRSTTAB=^" + sLink + "^";
    return("<a title='Click to go to " + sLink + " Tab' href='javascript:APPLINK(0,\"powerchart.exe\",\"" + sParms + "\");'>" + sLabel + "</a>");
  }
  else if((sLink.length > 0) && (dAppNum == 4250111)){
    var sParms = "/PERSONID=" + dPerson + " /ENCNTRID=" + dEncntr + " /FIRSTTAB=^" + sLink + "^";
    return("<a title='Click to go to " + sLink + " Tab' href='javascript:APPLINK(0,\"firstnet.exe\",\"" + sParms + "\");'>" + sLabel + "</a>");
  }
  else
    return("<span>" + sLabel + "</span>");
}

function SectArray(){
  this.size = 0;
  this.ar = new Array();
  this.Add = SectAdd;
  this.toString = SectToString;
  this.toHTML = SectToHTML;
  this.GetAll = GetAll;
  this.GetValue = GetValue;
  this.GetObject = GetObject;
  this.SetObject = SetObject;
  this.Sort = Sort;
}

function GetValue(nNdx, sItem){
  return(eval("this.ar[nNdx]." + sItem));
}

function GetObject(nNdx){
  if(nNdx >= this.size || nNdx < 0)
    return(null);
  return(this.ar[nNdx]);
}

function SetObject(nNdx, oTmp){
  if(nNdx < this.size && nNdx >= 0)
    this.ar[nNdx] = oTmp;
}

function SectAdd(oTmp){
  this.ar[this.size] = oTmp;
  this.size++;
}

function Sort(sItem, bDesc){
  var n, i, oTmp;
  for(n = 0; n < this.size; n++){
    i = n;
    while(i > 0 &&
      ((bDesc && this.GetValue(i, sItem) > this.GetValue(i - 1, sItem)) ||
       (!bDesc && this.GetValue(i, sItem) < this.GetValue(i - 1, sItem)))
    ){
      oTmp = this.GetObject(i - 1);
      this.SetObject(i - 1, this.GetObject(i));
      this.SetObject(i, oTmp);
      i--;
    }
  }
}

function SectToString(){
  var n, i;
  var sRet = "";
  for(n = 0; n < this.size; n++){
    //sRet = sRet.concat("Item " + (n + 1) + ":\n");
    for(i in this.GetObject(n)){
      sRet = sRet.concat(i + ": " + this.GetObject(n)[i] + "\n");
    }
    sRet = sRet.concat("\n");
  }
  return(sRet);
}

function SectToHTML(){
  var n, i;
  var sRet = "";
  for(n = 0; n < this.size; n++){
    sRet = sRet.concat("<u>Item " + (n + 1) + "</u><br>");
    for(i in this.GetObject(n)){
      sRet = sRet.concat("<b>  " + i + "</b>: " + this.GetObject(n)[i] + "<br>");
    }
    sRet = sRet.concat("<br>");
  }
  return(sRet);
}

function GetAll(sItem, vArg){
  var arTmp = new SectArray();
  var n, i, oTmp;
  for(n = 0; n < this.size; n++){
    if(this.GetValue(n, sItem) == vArg)
      arTmp.Add(this.GetObject(n));
  }
  return(arTmp);
}

function LoadSectArray(oNodes){
  var nCnt, n, oTmp;
  var arTmp = new SectArray();

  for(nCnt = 0; nCnt < oNodes.length; nCnt++){
    oTmp = new Object();
    for(n = 0; n < oNodes[nCnt].childNodes.length; n++){
      if(oNodes[nCnt].childNodes.item(n).getAttribute("type") == "LIST")
        oTmp[oNodes[nCnt].childNodes.item(n).nodeName.toLowerCase()] = LoadSectArray(oNodes[nCnt].childNodes.item(n).childNodes);
      else if(oNodes[nCnt].childNodes.item(n).getAttribute("type") == "STRING")
        oTmp[oNodes[nCnt].childNodes.item(n).nodeName.toLowerCase()] = oNodes[nCnt].childNodes.item(n).text;
      else if(oNodes[nCnt].childNodes.item(n).getAttribute("type") == "INT")
    	  oTmp[oNodes[nCnt].childNodes.item(n).nodeName.toLowerCase()] = parseInt(oNodes[nCnt].childNodes.item(n).getAttribute("value"));
      else if(oNodes[nCnt].childNodes.item(n).getAttribute("type") == "DOUBLE")
    	  oTmp[oNodes[nCnt].childNodes.item(n).nodeName.toLowerCase()] = parseFloat(oNodes[nCnt].childNodes.item(n).getAttribute("value"));
    }
    arTmp.Add(oTmp);
  }
  return(arTmp);
}