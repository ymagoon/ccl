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
//        Source file name:       mp_ed_summary.js
//        Object name:
//        Request #:              N/A
// 
//        Product:                Discern ABU Services
//        Product Team:           Discern ABU Services
//        HNA Version:            HNAM: 08Jun2008
//        CCL Version:            CCL REV 8.4.1
// 
//        Program purpose:        Primary Javascript for ED Summary MPage
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


// Get Browser version

if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
 var ieVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
}
else {
 var ieVersion=0;
}

document.getElementsByClassName = function(cl) {
	var retnode = [];
	var clssnm = new RegExp('\\b'+cl+'\\b');
	var elem = this.getElementsByTagName('*');
	for (var u = 0; u < elem.length; u++) {
		var classes = elem[u].className;
		if (clssnm.test(classes)) retnode.push(elem[u]);
	}
	return retnode;
};

function fnFocus(e){
if (window.event) {
target = window.event.srcElement;
} else if (e) {
target = e.target;
} 
else return;

	target.style.backgroundColor="#E7FFCA";

}
function fnBlur(e){
	if (window.event) {
target = window.event.srcElement;
} else if (e) {
target = e.target;
} else return;

	target.style.backgroundColor="";
}
function fnTrap(sMsg,sUrl,sLine){
	alert("Error loading page:\n" + sMsg + "\n" + sLine);
}


function changeFontSize(inc){
var t = document.getElementsByTagName('td');
for(n=0; n<t.length; n++) {
	if(t[n].style.fontSize) {
		var size = parseInt(t[n].style.fontSize.replace("px", ""));
		} else
		{ var size = 13;
		}    t[n].style.fontSize = size+inc + 'px';   }
}


        var STHS_TN = function() {

            // The following functions were copied from Util.Core, a module within the Healthe Widget Library
            // http://prototyping.healthe.cerner.corp/repo/release/site/com.cerner.healthe.navigator/healthe-widget-library/1.2/jsdoc/
            function _gns(e) {
                if(!e) {
                    return null;
                }
                var a = e.nextSibling;
                while (a && a.nodeType !== 1) {
                    a = a.nextSibling;
                }
                return a;
            }

            function _gbt(t, e) {
                e = e || document;
                return e.getElementsByTagName(t);
            }

            function _ia(nn, rn) {
              if(rn){
                var p = rn.parentNode, n = rn.nextSibling;
                if (n) {
                    p.insertBefore(nn, n);
                }
                else {
                    p.appendChild(nn);
                }
              }

            };

            function getPosition(e) {
                e = e || window.event;
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
                return cursor;
            }

            // The following functions were copied from Util.Style, a module within the Healthe Widget Library
            // http://prototyping.healthe.cerner.corp/repo/release/site/com.cerner.healthe.navigator/healthe-widget-library/1.2/jsdoc/
            function ccss(e, c) {
                if (typeof(e.className) === 'undefined' || !e.className) {
                    return false;
                }
                var a = e.className.split(' ');
                for (var i = 0, b = a.length; i < b; i++) {
                    if (a[i] === c) {
                        return true;
                    }
                }
                return false;
            }

            function acss(e, c) {
                if (ccss(e, c)) {
                    return e;
                }

                e.className = (e.className ? e.className + ' ' : '') + c;
                return e;
            }

            function rcss(e, c) {
				
                if (!ccss(e, c)) {
                    return e;
                }
				var subHead = gbc("subsection", e, "DIV");
				var l1 =subHead.length;
				for(var w=0;w<l1;w++)
				{
					var e2=subHead[w];
					var c='closed';
					var a = e2.className.split(' '), d = "";
					var x = gbc("sec-hd-tgl", e2, "SPAN")[0];
			
					for (var i = 0, b = a.length; i < b; i++) {
			
						var f = a[i];
			
						if (f !== c) {
							d += d.length > 0 ? (" " + f) : f;
						}
					}
			        e2.className = d;
			
			
			
					if(x)
					{
			        	x.innerHTML = "-";
						x.title = "Hide Section";
					}
				}
				
                var a = e.className.split(' ');
                var d = "";

                for (var i = 0, b = a.length; i < b; i++) {
                    var f = a[i];
                    if (f !== c) {
                        d += d.length > 0 ? (" " + f) : f;
                    }
                }

                e.className = d;
                return e;
            }

            function tcss(e, c) {
                if (ccss(e, c)) {
                    rcss(e, c);
                    return false;
                }
                else {
                    acss(e, c);
                    return true;
                }
            }

            function gbc(c, e, t) {
                e = e || document;
                t = t || '*';

                var ns = [];
                var es = _gbt(t, e);
                var l = es.length;

                for (var i = 0, j = 0; i < l; i++) {
                    if (ccss(es[i], c)) {
                        ns[j] = es[i];
                        j++;
                    }
                }
                return ns;
            }
            function gvs() {
                var n = window, d = document, b = d.body, e = d.documentElement;
                 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
                if (typeof n.innerWidth !== 'undefined') {
                    return [n.innerHeight, n.innerWidth];
                }
                // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
                else if (typeof e !== 'undefined' && typeof e.clientWidth !== 'undefined' && e.clientWidth !== 0) {
                    return [e.clientHeight, e.clientWidth];
                }
                // older versions of IE
                else {
                    return [b.clientHeight, b.clientWidth];
                }
            }

            function gso() {
                var d = document, b = d.body, w = window, e = d.documentElement, et = e.scrollTop, bt = b.scrollTop, el = e.scrollLeft, bl = b.scrollLeft;
                if (typeof w.pageYOffset === "number") {
                    return [w.pageYOffset, w.pageXOffset];
                }
                if (typeof et === "number") {
                    if (bt > et || bl > el) {
                        return [bt, bl];
                    }
                    return [et, el];
                }
                return [bt, bl];
            }

            // Prepare the public API.
            return {

                /**
                 * Sets up the STHS_TN object and DOM; this will only be invoked once.
                 */
                setup : function() {

                    /* Hover Mouse Over */
                    function hmo(evt, n) {
                        var s = n.style, p = getPosition(evt), top = p.y + 30, left = p.x + 20;
                        evt = evt || window.event;
                        n._ps = n.previousSibling;
                        document.body.appendChild(n);
                        s.display = "block";
                        s.left = left + "px";
                        s.top = top + "px";
                   }


                    /* Hover Mouse Move */
                    function hmm(evt, n) {
                        var s = n.style, p = getPosition(evt), vp = gvs(), so = gso(), left = p.x + 20, top = p.y + 30;

                        if(left + n.offsetWidth > vp[1] + so[1]) {
                            left = left - 40 - n.offsetWidth;
                        }

                        if(top + n.offsetHeight >  vp[0] + so[0]) {
                            top = top - 40 - n.offsetHeight;
                        }

                        evt = evt || window.event;
                        s.top = top + "px";
                        s.left = left + "px";
                   }


                    /* Hover Mouse Out*/
                    function hmt(evt, n) {
                        evt = evt || window.event;
                        n.style.display = "";
                        _ia(n, n._ps);
                    }

                    /* Hover Setup */
                    function hs(e, n) {
                    	var priorBgColor = e.style.backgroundColor;
                    	var priorBorderColor = e.style.borderColor;
                        if(n && n.tagName == "DL") {
                                e.onmouseenter = function(evt) {
                                e.onmouseover = null;
                                e.onmouseout = null;
                                hmo(evt, n);
                            };
                            e.onmouseover = function(evt) {
                            	e.style.backgroundColor = "#FFC";
                            	e.style.borderColor     = "#ADCC92";
                                hmo(evt, n);
                            };
                            e.onmousemove = function(evt) {
                            	e.style.backgroundColor = "#FFC";
                            	e.style.borderColor     = "#ADCC92";
                                hmm(evt, n);
                            };
                            e.onmouseout = function(evt) {
                            	e.style.backgroundColor  = priorBgColor;
                            	e.style.borderColor = priorBorderColor;
                                hmt(evt, n);
                            };
                            e.onmouseleave = function(evt) {
                            	e.style.backgroundColor  = priorBgColor;
                            	e.style.borderColor = priorBorderColor;
                                e.onmouseover = null;
                                e.onmouseout = null;
                                hmt(evt, n);
                            };
                            acss(n, "hover");
                        }
                    }


                    function ftg(e) {
                        var x = gbc("sec-hd-tgl", e, "SPAN")[0];
                        if(tcss(e, "closed")) {
                            if(x) {
                                x.innerHTML = "+";
                                x.title = "Show Section";
                            }
                            return;
                        }
                        if(x) {
                            x.innerHTML = "-";
                            x.title = "Hide Section";
                        }
                    }

                    /* Section Setup */
                    function ss(e) {

                        // Grab the header, based on it's classname
                        var hd = gbc("sec-hd", e, "H2")[0];
                        var s = document.createElement("SPAN");
                        hd.insertBefore(s, hd.childNodes[0]);
                        s.className = "sec-hd-tgl";
                        s.innerHTML = "-";
                        s.title = "Hide Section";
                        s.style.cursor = "pointer";
                        s.onclick = function() {
                            ftg(e);
                        };

                      // Determine what sections are expanded on page load
                      // To have a section defaulted to collapse on page load, put the class name(s) in the following statment:
                      if(ccss(e, "onLoadCollapse")){
                        ftg(e);
                      }
                      
                  
                  }

					                   /* Sub Section Setup */
                   function ss2(e) {
                        // Grab the header, based on it's classname
                        var hd = gbc("sub-sec", e, "H3")[0];
                        var s = document.createElement("SPAN");
                        hd.insertBefore(s, hd.childNodes[0]);
                        s.className = "sec-hd-tgl";
                        s.innerHTML = "-";
                        hd.style.cursor = "pointer";
                        hd.onclick = function() {
                            ftg(e);
                            for(i in scrollNums) {
			      sectionScrolling(i,scrollNums[i]);
                            }
                        };
                    }

                    // Grab H3 elements and Section DIVs
                    var ah = gbc("al-info", null, "DL");
                    mh = gbc("ml-info", null, "DL");
					hmh = gbc("hml-info", null, "DL");
                    vh = gbc("vs-info", null, "DL");
                    s  = gbc("section", null, "DIV");
					wh = gbc("wr-info", null, "DL");
					mc = gbc("mic-info", null, "DL");
					lr = gbc("lr-info", null, "DL");
					lt = gbc("ltd-info", null, "DL");
					ph = gbc("pt-info", null, "DL");
					dh = gbc("dg-info", null, "DL");
					dc = gbc("doc-info", null, "DL");
					s2 = gbc("subsection", null, "DIV");

                    // Setup Documentation hovers
                    for(var i = 0; i < dc.length; i++) {
                        var m = dc[i];
                        if(m) {
                            var nm = _gns(_gns(m));
                            if(nm) {
                                if(ccss(nm, "doc-det")) {
                                    hs(m, nm);
                                }
                            }
                        }
                    }

                    // Setup Allergy hovers
                    for(var i = 0; i < ah.length; i++) {
                        var m = ah[i];
                        if(m) {
                            var nm = _gns(_gns(m));
                            if(nm) {
                                if(ccss(nm, "al-det")) {
                                    hs(m, nm);
                                }
                            }
                        }
                    }
					
					
                    // Setup Home Medications hovers
                    for(var i = 0; i < hmh.length; i++) {
                        var m = hmh[i];
                        if(m) {
                            var nm = _gns(_gns(m));
                            if(nm) {
                                if(ccss(nm, "hml-det")) {
                                    hs(m, nm);
                                }
                            }
                        }
                    }


                    // Setup Medication hover
                    for(var i = 0; i < mh.length; i++) {
                        var m = mh[i];
                        if(m) {
                            var nm = _gns(_gns(m));
                            if(nm) {
                                if(ccss(nm, "ml-det")) {
                                    hs(m, nm);
                                }
                            }
                        }
                    }


                    // Setup Lab hover
                    for(var i = 0; i < lr.length; i++) {
                        var l = lr[i];
                        if(l) {
                            var nl = _gns(_gns(l));
                            if(nl) {
                                if(ccss(nl, "lr-det")) {
                                    hs(l, nl);
                                }
                            }
                        }
                    }

                    // Setup Vitals hover
                    for(var i = 0; i < vh.length; i++) {
                        var v = vh[i];
                        if(v) {
                            var nv = _gns(_gns(v));
                            if(nv) {
                                if(ccss(nv, "vs-det")) {
                                    hs(v, nv);
                                }
                            }
                        }
                    }

                    // Setup Patient hover
                    for(var i = 0; i < ph.length; i++) {
                        var pt = ph[i];
                        if(pt) {
                            var npt = _gns(_gns(pt));
                            if(npt) {
                                if(ccss(npt, "pt-det")) {
                                    hs(pt, npt);
                                }
                            }
                        }
                    }

                    // Setup Diagnostic hover
                    for(var i = 0; i < dh.length; i++) {
                        var dg = dh[i];
                        if(dg) {
                            var ndg = _gns(_gns(dg));
                            if(ndg) {
                                if(ccss(ndg, "dg-det")) {
                                    hs(dg, ndg);
                                }
                            }
                        }
                    }



                    
                    // Setup the scrolling for sections that are defined to scroll
                    // Need to do this before collapsing the sections defined to collapse
                    for(i in scrollNums) {
                      sectionScrolling(i,scrollNums[i]);
                    }
                    
                    // Setup Section expanders
                    for(var i = 0; i < s.length; i++) {
                        ss(s[i]);
                    }

                    // Setup Sub Section expander
                    for(var i = 0; i < s2.length; i++) {
                        ss2(s2[i]);
                    }

                    STHS_TN.setup = {};
                }
            };
        }();

        // Set up the page onload.
        window.onload = STHS_TN.setup;
        


var g_expanded=false;

function collapse(){
	var s2 = gbc("section", null, "DIV")

	var s1 = gbc("sec-hd-tgl", null, "SPAN");

	var l = s2.length;
	for(var u=0;u<l;u++)
	{
		var e =s2[u];
		e.className = (e.className ? e.className + ' ' : '') + 'closed';
		var x = gbc("sec-hd-tgl", e, "SPAN")[0];
		if(x) {
			x.innerHTML = "+";
			x.title = "Show Section";
		}
	}
}

function expandToggle(){
	var x= gbc("expandToggle",null,"SPAN")[0];
	if(g_expanded==true)
	{
		collapse();
		g_expanded=false;
		if(x)
		{
        	x.innerHTML = "Expand All";
			x.title = "Expand All";
		}
	}
	else
	{
		expand();
		g_expanded=true;
		if(x)
		{
        	x.innerHTML = "Collapse All";
			x.title = "Collapse All";
		}
	}


	
}
function expand(){

	var s2 = gbc("section", null, "DIV")

	var subHead = gbc("subsection", null, "DIV");

	var l1 =subHead.length;
	for(var w=0;w<l1;w++)
	{
		var e=subHead[w];
		var c='closed';
		var a = e.className.split(' '), d = "";
		var x = gbc("sec-hd-tgl", e, "SPAN")[0];

		for (var i = 0, b = a.length; i < b; i++) {

			var f = a[i];

			if (f !== c) {
				d += d.length > 0 ? (" " + f) : f;
			}
		}
        e.className = d;
		if(x)
		{
        	x.innerHTML = "-";
			x.title = "Hide Section";
		}
	}

	var l = s2.length;
	for(var r=0;r<l;r++)
	{
		var e=s2[r];
		var c='closed';
		var a = e.className.split(' '), d = "";
		var x = gbc("sec-hd-tgl", e, "SPAN")[0];

		for (var i = 0, b = a.length; i < b; i++) {

			var f = a[i];

			if (f !== c) {
				d += d.length > 0 ? (" " + f) : f;
			}
		}
        e.className = d;



		if(x) {
        x.innerHTML = "-";
		x.title = "Hide Section";
		}

	}
}

            function ccss(e, c) {
                if (typeof(e.className) === 'undefined' || !e.className) {
                    return false;
                }
                var a = e.className.split(' ');
                for (var i = 0, b = a.length; i < b; i++) {
                    if (a[i] === c) {
                        return true;
                    }
                }
                return false;
            }

            function acss(e, c) {
                if (ccss(e, c)) {
                    return e;
                }
                e.className = (e.className ? e.className + ' ' : '') + c;
                return e;
            }

            function rcss(e, c) {
                if (!ccss(e, c)) {
                    return e;
                }
                var a = e.className.split(' '), d = "";

                for (var i = 0, b = a.length; i < b; i++) {

                    var f = a[i];

                    if (f !== c) {
                        d += d.length > 0 ? (" " + f) : f;
                    }
                }
                e.className = d;
                return e;
            }

            function tcss(e, c) {
                if (ccss(e, c)) {
                    rcss(e, c);
                    return false;
                }
                else {
                    acss(e, c);
                    return true;
                }
            }
			function gbc(c, e, t) {
				e = e || document;
				t = t || '*';
				var ns = [], es = _gbt(t, e), l = es.length;
				for (var i = 0, j = 0; i < l; i++) {
					if (ccss(es[i], c)) {
						ns[j] = es[i];
						j++;
					}
				}
				return ns;
            }
			function _gbt(t, e) {
				e = e || document;
				return e.getElementsByTagName(t);
            }
						


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// BEGIN JS TO BUILD HTML //////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var m_arContMed, m_arAdminMed, m_arSchMed, m_arPRNMed, m_arAllergy, m_arProb, m_oPtInfo, m_arSect, m_sCurDiv, m_arLab, m_arHomeMed, m_arDiagSecs;
var m_arDoc, m_arDiag, m_arVS, m_arMicro, m_arMicroPath, m_nLabNdx, m_nDiagNdx, m_nVSNdx;
var arTmpL, arTmpC, arTmpR;
var labMaxSeq, vsMaxSeq;

var scrollNums = new Array();

function scrollRows(id,rowCount) {
  scrollNums[id] = rowCount;
}


function sectionScrolling(id, totRowCnt) {
  if(totRowCnt == 0){
    return;
  }
  var section = document.getElementById(id) || id;
  var headers = _gbt("h3",section);
  var tables = _gbt("table",section);
  
  if(headers.length < 1 && tables.length < 1){
    return;
  }
  
  var totalHeight = 0;
  var currentRow = 0;
  for(x=0; x < tables.length; x++) {
    var header = headers[x];
    if(headers.length){
      totalHeight += headers[x].offsetHeight;
      if(ccss(headers[x].parentNode,"closed")){
        continue;
      }
    }
    
    var curTable = tables[x];
    if(ieVersion != 6){
      curTable.style.width = "97%";
    }
    var rows = _gbt("tr",curTable);
    if(currentRow < totRowCnt){
      for(zz=0; zz < rows.length; zz++) {
        var row = rows[zz];
        totalHeight += row.clientHeight;  
        if(!ccss(row,"headerrtcell")){
          currentRow++;
          if(currentRow == totRowCnt) {
            break; 
          }
        }
    
      }
    }
    if(currentRow == totRowCnt) {
      break; 
    }
  }
  
  if(totRowCnt == currentRow || currentRow==0){
    section.style.height = totalHeight + "px";
    if(headers){
      if(ieVersion != 6){
        for(yy = 0; yy < headers.length; yy++){
          headers[yy].style.width = currentRow>0 ? "97%":"100%" ;
        }
      }
    }
  }
}




function ParseXML(xmlSec, xmlData){
  // parse Section parameters
  var i, n, oTmp, arTmp;
  var s = "";
  
  // parse Section Parameter Data
  m_arSect = LoadSectArray(xmlSec.getElementsByTagName("ITEM"));

  // parse ED data
  arTmp = xmlData.getElementsByTagName("CCLREC")(0).childNodes;
  for(i = 0; i < arTmp.length; i ++){
    switch(arTmp[i].nodeName){
      case "PT_INFO":
        m_oPtInfo = LoadPtInfo(arTmp[i].childNodes);
        break;
      case "PROB":
        m_arProb = LoadSectArray(arTmp[i].childNodes);
        break;
      case "ALLERGY":
        m_arAllergy = LoadSectArray(arTmp[i].childNodes);
        break;
      case "PRN_MED":
        m_arPRNMed = LoadSectArray(arTmp[i].childNodes);
        break;
      case "SCH_MED":
        m_arSchMed = LoadSectArray(arTmp[i].childNodes);
        break;
      case "ADMIN_MED":
        m_arAdminMed = LoadSectArray(arTmp[i].childNodes);
        break;
      //case "SUSP_MED":
        //m_arSuspMed = LoadSectArray(arTmp[i].childNodes);
      //  break;      
      case "CONT_MED":
        m_arContMed = LoadSectArray(arTmp[i].childNodes);
        break;
      case "LAB":
        m_arLab = LoadSectArray(arTmp[i].childNodes);
        break;
	case "HOME_MED":
        m_arHomeMed = LoadSectArray(arTmp[i].childNodes);
        break;
	case "DOCUMENT":
	  m_arDoc = LoadSectArray(arTmp[i].childNodes);
        break;
	case "DIAG":
	  m_arDiag = LoadSectArray(arTmp[i].childNodes);
	  break;
	case "VS":
	  m_arVS = LoadSectArray(arTmp[i].childNodes);
	  break;
	case "MICRO_PATH":
	  m_arMicroPath = LoadSectArray(arTmp[i].childNodes);
	  break;
	case "DIAG_SEC_DISPS":
	  m_arDiagSecs = LoadSectArray(arTmp[i].childNodes);
	  break;
    }
  }
}


function LoadPtInfo(oNodes){
  var nCnt, n, i, arTmp, oTmp2, oNodes2, oNodes3;
  var oTmp = new Object();

  for(nCnt = 0; nCnt < oNodes.length; nCnt++){
    if(oNodes[nCnt].getAttribute("type") == "SEG" || oNodes[nCnt].getAttribute("type") == "LIST")
      oTmp[oNodes[nCnt].nodeName.toLowerCase()]= LoadSectArray(oNodes[nCnt].childNodes);
    else if(oNodes[nCnt].getAttribute("type") == "STRING")
      oTmp[oNodes[nCnt].nodeName.toLowerCase()] = oNodes[nCnt].text;
    else if(oNodes[nCnt].getAttribute("type") == "INT")
      oTmp[oNodes[nCnt].nodeName.toLowerCase()] = parseInt(oNodes[nCnt].getAttribute("value"));
    else if(oNodes[nCnt].getAttribute("type") == "DOUBLE")
      oTmp[oNodes[nCnt].nodeName.toLowerCase()] = parseFloat(oNodes[nCnt].getAttribute("value"));
  }
  return(oTmp);
}




function RenderPage(){

  mp_ed_demog.outerHTML = RenderHeader();
  
  arTmpL = m_arSect.GetAll("lcr", "L");
  RenderComponents(arTmpL);

  arTmpC = m_arSect.GetAll("lcr", "C");
  RenderComponents(arTmpC);
  
  arTmpR = m_arSect.GetAll("lcr", "R");
  RenderComponents(arTmpR);  
}


function RenderComponents(arTmp4){
  for(xyz = 0; xyz < arTmp4.size; xyz++){
    tmpObj = arTmp4.GetObject(xyz);
    switch(arTmp4.GetValue(xyz, "bedrock_name")){
      case "mp_ed_pt_info":
        mp_ed_pt_info.outerHTML = RenderPtInfo(tmpObj);
        break;
      case "mp_ed_allergy":
        mp_ed_allergy.outerHTML = RenderAllergy(tmpObj);
        break;
      case "mp_ed_problem":
        mp_ed_problem.outerHTML = RenderProblem(tmpObj);
        break;
      case "mp_ed_meds":
        mp_ed_meds.outerHTML = RenderMeds(tmpObj);
        break;
      case "mp_ed_lab":
        mp_ed_lab.outerHTML = RenderLabs(tmpObj);
        break;
      case "mp_ed_home_meds":
        mp_ed_home_meds.outerHTML = RenderHomeMeds(tmpObj);
        break;
      case "mp_ed_clin_doc":
        mp_ed_clin_doc.outerHTML = RenderDocs(tmpObj);
        break;
      case "mp_ed_rad":
        mp_ed_rad.outerHTML = RenderDiag(tmpObj);
        break;
      case "mp_ed_vs":
        mp_ed_vs.outerHTML = RenderVS(tmpObj);
        break;
      case "mp_ed_micro_pathnet":
        mp_ed_micro_pathnet.outerHTML = RenderMicroPath(tmpObj);
        break;
    }
  }
}

function RenderHeader(){
var paramStr = '^MINE^,'+ m_oPtInfo.personid + ',' + 0 + ',' + m_oPtInfo.encntrid;
var tableBody = "";
tableBody  = '<div class=noPrint>'
           +   '<div class="handheld_only">'
           +     '<table class="hdrTable">'
           +       '<tr>'
           +         '<td>'
           +           '<table class="menuTable">'
           +             '<tr>'
           +               '<td class="eds-hd"><span>ED Summary</span></td>'
           +               '<td class="menu-items">'
           +                 '<ul id="nav">'
           +                   '<li><a title="Lower the size of the text" onfocus="fnFocus()" onblur="fnBlur()" class="text-change-s" href="javascript:changeFontSize(-1)" tabindex="50">- A</a></li>'
           +                   '<li><a title="Raise the size of the text" onfocus="fnFocus()" onblur="fnBlur()" class="text-change-l" href="javascript:changeFontSize(+1)" tabindex="50">+ A</a></li>'
           +                 '</ul>'
           +               '</td>'
           +             '</tr>'
           +           '</table>'
           +         '</td>'
           +       '</tr>'
           +     '</table>'
           +     '<table class="pt-dtl-table">'
           +       '<tr>'
           +         '<td>'
           +           '<ul class="pt">'
           +             '<li id=patientName><span>' + m_oPtInfo.patfirst + ' ' + m_oPtInfo.patmid + ' ' + m_oPtInfo.patlast + '</span></li>'
           //+             '<li id=sex><span class="label">Gender:</span><span>' + m_oPtInfo.gender + '</span></li>'
           //+             '<li id=age><span class="label">Age:</span><span>' + m_oPtInfo.age + '</span></li>'
           +             '<li id=sex><span>' + m_oPtInfo.gender + ', ' + m_oPtInfo.age +  '</span></li>'
           +             '<li id=dob><span class="label">DOB:</span><span>' + m_oPtInfo.dob + '</span></li>'
           +           '</ul>'
           +           '<ul class="pt">'
           +             '<li id=mrn><span class="label">MRN:</span><span>' + m_oPtInfo.mrn + '</span></li>'
           +             '<li id=fin><span class="label">FIN:</span><span>' + m_oPtInfo.fin + '</span></li>'
           +           '</ul>'
           +           '<ul class="pt">'
           +             '<li id=vReason><span class="label">Visit Reason:</span><span class="vReason-det-type">' + m_oPtInfo.visitreas + '</span></li>'
           +           '</ul>'
           +         '</td>'
           +       '</tr>'
           +     '</table>'
           +     '<table class="infoTable">'
           +       '<tr>'
           +         '<td>'
           +           '<ul class="pt">'
           +             '<li><p class="disclaimer">This page is not a complete source of visit information.</p></li>'
           +           '</ul>'
           +         '</td>'
           +       '</tr>'
           +     '</table>'
           +   '</div>'
           + '</div>';

//BUILD TABLE FOR PRINTING, THIS WILL BE HIDDEN BY THE CSS
var printCurDtTmStr = "";
var currentTime = new Date();
var month = currentTime.getMonth() + 1;
var day = currentTime.getDate();
var year = currentTime.getFullYear();

var currentTime = new Date();
var hours = currentTime.getHours();
var minutes = currentTime.getMinutes();

if (minutes < 10){
minutes = "0" + minutes
}
if(hours > 11){
  var aOp = "PM"
} else {
  var aOp = "AM"
}
printCurDtTmStr = month + "/" + day + "/" + year + "&nbsp;" + hours + ":" + minutes //+ "&nbsp;" + aOp


tableBody += '<div id="printhead">'
           +   '<table class="printer-table">'
           +     '<tr>'
           +       '<td colspan="3">'
           +         '<ul class="print-pt">'
           +           '<li>ED Summary</li>'
           +           '<li>' + m_oPtInfo.patfirst + ' ' + m_oPtInfo.patmid + ' ' + m_oPtInfo.patlast + '</li>'
           //+           '<li id=sex><span class="label">Gender:</span>' + m_oPtInfo.gender + '</li>'
           //+           '<li id=age><span class="label">Age:</span>' + m_oPtInfo.age + '</li>'
           +           '<li id=sex><span>' + m_oPtInfo.gender + ', ' + m_oPtInfo.age +  '</span></li>'
           +           '<li id=dob><span class="label">DOB:</span>' + m_oPtInfo.dob + '</li>'
           +           '<li id=mrn><span class="label">MRN:</span>' + m_oPtInfo.mrn + '</li>'
           +           '<li id=fin><span class="label">FIN:</span>' + m_oPtInfo.fin + '</li>'
           +           '<li id=vReason><span class="label">Visit Reason:</span>' + m_oPtInfo.visitreas + '</li>'
           +           '<li>Page Generated: ' + printCurDtTmStr + '</li>'
           +         '</ul>'
           +       '</td>'
           +     '</tr>'
           +     '<tr>'
           +       '<td><p class=disclaimer>Not a complete source of visit information.</p></td>'
           +       '<td><p class=disclaimer>Values: H=High L=Low C=Critical</p></td>'
           +       '<td><p class="edTimeFrame">Results time-frame: Current ED visit and last result from previous visitwithin the past 6 months.</p></td>'
           +     '</tr>'
           +   '</table>'
           + '</div>'
           + '<div class="noPrint">'
           +   '<table class="pt-dtl-table">'
           +     '<tr>'
           +       '<td>'
           +         '<ul class="pt">'
           +           '<li id=patientName><span>' + m_oPtInfo.patfirst + ' ' + m_oPtInfo.patmid + ' ' + m_oPtInfo.patlast + '</span></li>'
           //+           '<li id=sex><span class="label">Gender:</span>' + m_oPtInfo.gender + '</li>'
           //+           '<li id=age><span class="label">Age:</span>' + m_oPtInfo.age + '</li>'
           +           '<li id=sex><span>' + m_oPtInfo.gender + ', ' + m_oPtInfo.age +  '</span></li>'
           +           '<li id=dob><span class="label">DOB:</span>' + m_oPtInfo.dob + '</li>'
           +           '<li id=mrn><span class="label">MRN:</span>' + m_oPtInfo.mrn + '</li>'
           +           '<li id=fin><span class="label">FIN:</span>' + m_oPtInfo.fin + '</li>'
           +           '<li id=vReason><span class="label">Visit Reason:</span><span class="vReason-det-type">' + m_oPtInfo.visitreas + '</span></li>'
           +         '</ul>'
           +       '</td>'
           +     '</tr>'
           +   '</table>'
           +   '<table class="infoTable">'
           +     '<tr>'
           +       '<td><p class="disclaimer">This page is not a complete source of visit information.</p></td>'
           +     '</tr>'
           +   '</table>'
           +   '<table class="hdrTable">'
           +     '<tr>'
           +       '<td>'
           +         '<table class="menuTable">'
           +           '<tr>'
           +             '<td class="eds-hd"><span>ED Summary</span></td>'
           +             '<td class="menu-items">'
           +               '<ul id="nav">'
           +                 '<li><a title="Lower the size of the text" onfocus="fnFocus()" onblur="fnBlur()" class="text-change-s" href="javascript:changeFontSize(-1)" tabindex="50">- A</a></li>'
           +                 '<li><a title="Raise the size of the text" onfocus="fnFocus()" onblur="fnBlur()" class="text-change-l" href="javascript:changeFontSize(+1)" tabindex="50">+ A</a></li>'
           +                 '<li><a title="Expand All" onfocus="fnFocus()" onblur="fnBlur()" tabindex="50" href="#" class="expandToggle" onclick="expandToggle()" id="expandToggle"><span class="expandToggle">Expand All</span></a></li>'
           +               '</ul>'
           +             '</td>'
           +           '</tr>'
           +           '<tr>'
           +             '<td class="spcr">&#160;</td>'
           +             '<td class="spcr">&#160;</td>'
           +           '</tr>'
           +         '</table>'
           +       '</td>'
           +     '</tr>'
           +   '</table>'
           + '</div>';
return tableBody;
}

function RenderPtInfo(oSect){
//** BUILD ANY DYNAMIC INFO AHEAD OF TIME TO KEEP CODE CLEANER **//

// Emergency numbers 
var emerNumInfo = "";
if(m_oPtInfo.emergnums.size == 0){
  emerNumInfo = '<tr>'
              +   '<th class="pt-label">Emergency #:</th>'
              +   '<td class="pt-result">No Result Found</td>'
              + '</tr>';
}
else{
  emerNumInfo =  '<tr>'
              +    '<th class="pt-label">Emergency #:</th>'
              +    '<td class="pt-result">' 
              +      '<dl class=pt-info>'
              +        '<dd><span>'+ m_oPtInfo.emergnums.GetValue(0, "number") + '</span></dd>'
              +      '</dl>'
              +      '<h4 class=pt-det-hd><span>Emergency #:</span></h4>'
              +      '<dl class="pt-det hideHover">';
              
  for(z=0; z<m_oPtInfo.emergnums.size; z++){
    emerNumInfo +=     '<dt class=pt-det-type><span>' + m_oPtInfo.emergnums.GetValue(z, "type") + '</span></dt>';
    emerNumInfo +=     '<dd class=result><span>' + m_oPtInfo.emergnums.GetValue(z, "number") + '</span></dd>';
  }
  
  emerNumInfo +=     '</dl>'
               +   '</td>'
               + '</tr>'
}  


// Code Stat info
var codeStatInfo = "";
// DO NOT DISPLAY LINE IF FILTER IS NOT DEFINED IN BEDROCK WIZARD
// CCL FILLS OUT m_oPtInfo.codestat == 'DONOTRENDERFILTER' IF FILTER IS NOT DEFINED
if(m_oPtInfo.codestat == 'DONOTRENDERFILTER') {
  codeStatInfo = "";
}
else {
  if(m_oPtInfo.codestatdetails.length > 0 && m_oPtInfo.codestatdetails != "DND" ){
    codeStatInfo =  '<tr>'
                 +    '<th class="pt-label">Code Status:</th>'
                 +    '<td class="pt-full-code">'
                 +      '<dl class=pt-info>'
                 +        '<dd><span>' + m_oPtInfo.codestat + '</span></dd>'
                 +      '</dl>'
                 +      '<h4 class=pt-det-hd><span>Resusitation Details:</span></h4>'
                 +      '<dl class="pt-det hideHover">'
                 +        '<dt class=pt-det-type><span>Resusitation Details:</span></dt>'
                 +        '<dd class=result><span>' + m_oPtInfo.codestatdetails + '</span></dd>'
                 +      '</dl>'
                 +    '</td>'
                 +  '</tr>'
  }else{
    codeStatInfo =  '<tr>'
                 +    '<th class="pt-label">Code Status:</th>'
                 +    '<td class="pt-full-code">' + m_oPtInfo.codestat + '</td>'
                 +  '</tr>'
  }
}
// Last ED Visit hover
var recentVisits = "";

if(m_oPtInfo.ed_visits.size == 0){
  recentVisits =  '<tr>'
               +    '<th class="pt-label">Last ED Visit:</th>'
               +    '<td class="pt-result">No result found</td>'
               +  '</tr>'
}
else if(m_oPtInfo.ed_visits.size == 1){
  if(m_oPtInfo.ed_visits.GetValue(0, "report_id") > 0){
    recentVisits =  '<tr>'
                 +    '<th class="pt-label">Last ED Visit:</th>'
                 +    '<td class="pt-result"><a onfocus="fnFocus()" onblur="fnBlur()" tabindex="8" class="sec-item" href=' + ReportLink(m_oPtInfo.ed_visits.GetValue(0, "report_id")) + '>' + m_oPtInfo.ed_visits.GetValue(0, "date") + '</a></td>'
                 +  '</tr>'
  }else{
    recentVisits =  '<tr>'
                 +    '<th class="pt-label">Last ED Visit:</th>'
                 +    '<td class="pt-result">' + m_oPtInfo.ed_visits.GetValue(0, "date") + '</td>'
                 +  '</tr>'
  }
}
else{
  if(m_oPtInfo.ed_visits.GetValue(0, "report_id") > 0){
    recentVisits =  '<tr>'
                 +    '<th class="pt-label">Last ED Visit:</th>'
                 +    '<td class="pt-result"><a onfocus="fnFocus()" onblur="fnBlur()" tabindex="8" class="sec-item" href=' + ReportLink(m_oPtInfo.ed_visits.GetValue(0, "report_id")) + '><span class="anchorclass" rel="visit-d">' + m_oPtInfo.ed_visits.GetValue(0, "date") + '</span></a>'
                 +      '<div id="visit-d" class="anylinkcsscols">'
                 +        '<div class="column">'
                 +          '<ul>'
                 +            '<li>Previous Ed Visit(s):</li>';
  }else{
    recentVisits =  '<tr>'
                 +    '<th class="pt-label">Last ED Visit:</th>'
                 +    '<td class="pt-result"><span class="anchorclass" rel="visit-d">' + m_oPtInfo.ed_visits.GetValue(0, "date") + '</span>'
                 +      '<div id="visit-d" class="anylinkcsscols">'
                 +        '<div class="column">'
                 +          '<ul>'
                 +            '<li>Previous Ed Visit(s):</li>';
  }
  
  for(z=1; z<m_oPtInfo.ed_visits.size; z++){
    if(m_oPtInfo.ed_visits.GetValue(z, "report_id") > 0){
      recentVisits += '<li><a href=' + ReportLink(m_oPtInfo.ed_visits.GetValue(z, "report_id")) + '>' + m_oPtInfo.ed_visits.GetValue(z, "date") + '</a></li>'
    }else{
      recentVisits += '<li>' + m_oPtInfo.ed_visits.GetValue(z, "date") + '</li>'
    }
  }

  recentVisits +=           '</ul>'
               +          '</div>'
               +        '</div>'
               +      '</td>'
               +    '</tr>'
}


// Mode of arrival
var modeOfArrivalInfo = "";
// DO NOT DISPLAY LINE IF FILTER IS NOT DEFINED IN BEDROCK WIZARD
// CCL FILLS OUT m_oPtInfo.arrivemode == 'DONOTRENDERFILTER' IF FILTER IS NOT DEFINED
if(m_oPtInfo.arrivemode == 'DONOTRENDERFILTER') {
  modeOfArrivalInfo = "";
}
else {
  modeOfArrivalInfo = '<tr>'
           +            '<th class="pt-label">Mode of Arrival:</th>'
           +            '<td class="pt-result">' + m_oPtInfo.arrivemode + '</td>'
           +          '</tr>'
}


// Chief Complaint
var chiefComplaintInfo = "";
// DO NOT DISPLAY LINE IF FILTER IS NOT DEFINED IN BEDROCK WIZARD
// CCL FILLS OUT m_oPtInfo.chiefcomp == 'DONOTRENDERFILTER' IF FILTER IS NOT DEFINED
if(m_oPtInfo.chiefcomp == 'DONOTRENDERFILTER') {
  chiefComplaintInfo = "";
}
else {
  chiefComplaintInfo = '<tr>'
           +             '<th class="pt-label">Chief Complaint:</th>'
           +             '<td class="pt-result">' + m_oPtInfo.chiefcomp + '</td>'
           +           '</tr>'
}


var tableBody = "";
  var olClass = "";
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }

tableBody =  '<div class="section pt-list ' + olClass + '">'
           +   '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '</h2>'
           +   '<div class=sec-content>'
           +     '<table class="pt-table">'
           +       '<caption>table: Patient Information</caption>'
           +       '<tr>'
           +         '<th class=pt-label>Primary Physician:</th>'
           +         '<td class="pt-result">' + m_oPtInfo.physfirst + ' ' + m_oPtInfo.physmid + ' ' + m_oPtInfo.physlast + '</td>'
           +       '</tr>'
           +       '<tr>'
           +         '<th class=pt-label>Emergency Contact:</th>'
           +         '<td class="pt-result">' + m_oPtInfo.emergfirst + ' ' + m_oPtInfo.emergmid + ' ' + m_oPtInfo.emerglast + '</td>'
           +       '</tr>'
           +       emerNumInfo
           +       codeStatInfo
           +       modeOfArrivalInfo
           +       recentVisits
           +       chiefComplaintInfo
           +     '</table>'
           +   '</div>'
           + '</div>'

return tableBody;
}



function RenderProblem(oSect){
  var tableBody, sRet;
  var olClass = "";
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }
  
  if(oSect.total_results){
    if(oSect.x_of_y)
	if(oSect.scroll_num)
	  sRet = '(' + Math.min(oSect.scroll_num, m_arProb.size) + ' of ' + m_arProb.size + ')';
	else
	  sRet = '(' + m_arProb.size + " of " + m_arProb.size + ')';
    else
	sRet = '(' + m_arProb.size + ')';
  }
  else
    sRet = "";
  
  
  scrollRows("problem-list",oSect.scroll_num);
  
  
  tableBody =        '<div class="section problem-list ' + olClass + '">'
              +        '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '<span class="num-val">' + sRet + '</span><span class="hd-info">Active</span></h2>'
             +         '<div class=sec-content id="problem-list">'
  
  if(m_arProb.size == 0){
    tableBody +=         '<p class="no-results">-- No results found --</p>'
               +       '</div>'
               +     '</div>'
  }else{
    tableBody +=         '<table class="pl-table" id="pl-table">'
               +           '<caption>table: Problems</caption>'
               +           '<tbody>'
    
    for(n = 0; n < m_arProb.size; n++){
      var probRowId = "pRow"+(n+1);
      tableBody +=           '<tr id="' + probRowId +'">'
      if(m_arProb.GetValue(n, "icd9").length >0){
        tableBody +=           '<td class=result><span>' + m_arProb.GetValue(n, "name") + '</span><span class="info">(' + m_arProb.GetValue(n, "icd9") + ')</span></td>'
      }else{
        tableBody +=           '<td class=result><span>' + m_arProb.GetValue(n, "name") + '</span></td>'
      }
      tableBody +=           '</tr>'
    }
  
    tableBody  +=          '</tbody>'
                +        '</table>'
                +      '</div>'
                +    '</div>'

  }
  return tableBody;
}


function RenderAllergy(oSect){
  var sClass = "";
  var tableBody = "";
  var olClass = "";
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }

  scrollRows("allergies-list",oSect.scroll_num);

  if(oSect.total_results){
    if(oSect.x_of_y)
	if(oSect.scroll_num)
	  sRet = '(' + Math.min(oSect.scroll_num, m_arAllergy.size) + ' of ' + m_arAllergy.size + ')';
	else
	  sRet = '(' + m_arAllergy.size + " of " + m_arAllergy.size + ')';
    else
	sRet = '(' + m_arAllergy.size + ')';
  }
  else
    sRet = "";
  
  tableBody =  '<div class="section allergies-list ' + olClass + '">'
             +   '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '<span class="num-val">' + sRet + '</span><span class="hd-info">Active</span></h2>'
             +   '<div class=sec-content id="allergies-list">'
             
  if(m_arAllergy.size == 0){
    tableBody +=         '<p class="no-results">-- No results found --</p>'
               +       '</div>'
               +     '</div>'
  }else{
    tableBody +=         '<table class="al-table">'
               +           '<caption>table: Allergies</caption>'
               +           '<tbody>'
               +             '<tr class="headerrtcell" id="alHeaderRow">'
               +               '<th class=al-hd>&#160;</th>'
               +               '<th class=al-hd>Reaction</th>'
               +             '</tr>'
    
    
    for(n = 0; n < m_arAllergy.size; n++){
      var alRowId = "alRow"+(n+1);
      sClass = m_arAllergy.GetValue(n, "severity") == "Severe" ? "severe" : "algSeverityN";
      tableBody += '<tr id="' + alRowId +'">'
                 +   '<td class="' + sClass + '">'
                 +     '<dl class="al-info">'
                 +       '<dd><span>' + m_arAllergy.GetValue(n, "name") + '</span></dd>'
                 +     '</dl>'
                 +     '<h4><span class="al-det-hd">Allergy Details</span></h4>'
                 +     '<dl class="al-det hideHover">'
                 +       '<dt class="al-det-type"><span>Allergy:</span></dt>'
                 +       '<dd class=result><span class="' + sClass + '">' + m_arAllergy.GetValue(n, "name") + '</span></dd>'
                 +       '<dt class="al-det-type"><span>Reaction:</span></dt>'
                 +       '<dd class=result><span class="' + sClass + '">' + m_arAllergy.GetValue(n, "react") + '</span></dd>'
                 +       '<dt class="al-det-type"><span>Severity:</span></dt>'
                 +       '<dd class=result><span class="' + sClass + '">' + m_arAllergy.GetValue(n, "severity") + '</span></dd>'
                 +     '</dl>'
                 +   '</td>'
                 +   '<td class="' + sClass + '"><span>' + m_arAllergy.GetValue(n, "react") + '</span></td>'
                 + '</tr>'
    }
    tableBody += '</tbody>'
               + '</table>'
               + '</div>'
               + '</div>'
  }
  
  return tableBody;
}


function RenderHomeMeds(oSect){
  var tableBody = "";
  var n, sRet;
  var olClass = "";
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }

  if(oSect.total_results){
    if(oSect.x_of_y)
	if(oSect.scroll_num)
	  sRet = '(' + Math.min(oSect.scroll_num, m_arHomeMed.size) + ' of ' + m_arHomeMed.size + ')';
	else
	  sRet = '(' + m_arHomeMed.size + " of " + m_arHomeMed.size + ')';
    else
	sRet = '(' + m_arHomeMed.size + ')';
  }
  else
    sRet = "";

  scrollRows("hml-list",oSect.scroll_num);

  tableBody =  '<div class="section hml-list ' + olClass + '">'
             +     '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '<span class="num-val">' + sRet + '</span><span class="hd-info">Active</span></h2>'
             +     '<div class=sec-content id="hml-list">'

  if(m_arHomeMed.size == 0){
    tableBody +=     '<p class="no-results">-- No results found --</p>'
               +   '</div>'
               + '</div>'
  }
  else{
    tableBody +=     '<table class="hml-table">'
               +       '<caption>table: Home Medications</caption>'
               +       '<tbody>'

    for(n = 0; n < m_arHomeMed.size; n++){
      var hmRowId = "hmRow"+(n+1);
      tableBody +=           '<tr id="' + hmRowId +'">'
                 +         '<td class="hml-med-name">'
                 +           '<dl class=hml-info>'
                 +             '<dt class="hml-det-type">Home Medication</dt>'
                 +             '<dd class="hml-med-name"><span>' + m_arHomeMed.GetValue(n, "name") + '</span><span class=hml-md-sig>' + m_arHomeMed.GetValue(n, "details") + '</span></dd>'
                 +           '</dl>'
                 +           '<h4><span class="hml-det-hd">Home Medication Details</span></h4>'
                 +           '<dl class="hml-det hideHover">'
                 +             '<dt class="hml-det-type"><span>Home Medication:</span></dt>'
                 +             '<dd class=result><span>' + m_arHomeMed.GetValue(n, "name") + '</span></dd>'
                 +             '<dt class="hml-det-type"><span>Last Dose Date/Time:</span></dt>'
                 +             '<dd class=result><span>' + m_arHomeMed.GetValue(n, "lastdose1") + '</span></dd>'
                 +             '<dt class="hml-det-type"><span>Detail:</span></dt>'
                 +             '<dd class=result><span>' + m_arHomeMed.GetValue(n, "details") + '</span></dd>'
                 +             '<dt class="hml-det-type"><span>Status:</span></dt>'
                 +             '<dd class=result><span>' + m_arHomeMed.GetValue(n, "status") + '</span></dd>'
                 +           '</dl>'
                 +         '</td>'
                 +       '</tr>'
    }
    
    tableBody +=       '</tbody>'
               +     '</table>'
               +   '</div>'
               + '</div>'

  }  
  return tableBody;
}  
  


function RenderMeds(oSect){
  var n, sRet;
  var bNum = oSect.total_results == "1" ? true : false;
  var tableBody = "";
  var olClass = "";
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }
  
  scrollRows("med-list",oSect.scroll_num);

  if(oSect.total_results){
    if(oSect.x_of_y) {
      if(oSect.scroll_num) {
        sRet = '<span class="num-val">(' + Math.min(oSect.scroll_num, m_arPRNMed.size + m_arSchMed.size + m_arContMed.size) + ' of ' + (m_arPRNMed.size + m_arSchMed.size + m_arContMed.size) + ')</span>';  
      }
      else {
        sRet = '<span class="num-val">(' + (m_arPRNMed.size + m_arSchMed.size + m_arContMed.size) + ' of ' + (m_arPRNMed.size + m_arSchMed.size + m_arContMed.size) + ')</span>';  
      }
    }
    else {
	sRet = '<span class="num-val">(' + (m_arPRNMed.size + m_arSchMed.size + m_arContMed.size) + ')</span>';
    }
  }
  else
    sRet = "";

  tableBody =      '<div class="section med-list ' + olClass + '">'
             +       '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '<span class="num-val">' + sRet + '</span><span class="hd-info">Active</span></h2>'
             +       '<div class=sec-content id="med-list">'

  if(!m_arSchMed.size && !m_arContMed.size && !m_arPRNMed.size && !m_arAdminMed.size){
    tableBody +=       '<p class="no-results">-- No results found --</p>'
               +     '</div>'
               +   '</div>'
    return tableBody;
  }


  // All Scheduled Meds
  sRet = bNum ? '<span class="num-val">(' + m_arSchMed.size + ')</span>' : "";

  tableBody +=         '<div class="subsection">'
             +           '<h3 class=sub-sec id="medSchHead"><span>Scheduled</span>' + sRet + '</h3>'
  
  if(m_arSchMed.size){
    tableBody +=         '<table class="ml-table">'
               +           '<caption>table: Medications</caption>'
    
    for(n = 0; n < m_arSchMed.size; n++){
      var medRowId = "medRow"+(n+1);
      tableBody +=         '<tr id="' + medRowId +'">'
                 +           '<td class="ml-med-name">'
                 +             '<dl class=ml-info>'
                 +               '<dt class="ml-det-type"><span>Medication</span></dt>'
                 +               '<dd>' + m_arSchMed.GetValue(n, "name") + '<span class="result">' + m_arSchMed.GetValue(n, "details") + '</span></dd>'
                 +             '</dl>'
                 +             '<h4><span class="ml-det-hd">Medication Details</span></h4>'
                 +             '<dl class="ml-det hideHover">'
                 +               '<dt class="ml-det-type"><span>Medication:</span></dt>'
                 +               '<dd class=result><span>' + m_arSchMed.GetValue(n, "name") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Start Date/Time:</span></dt>'
                 +               '<dd class=result><span>' + m_arSchMed.GetValue(n, "startdate") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Last Dose Date/Time:</span></dt>'
                 +               '<dd class=result><span>' + m_arSchMed.GetValue(n, "lastdose") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Detail:</span></dt>'
                 +               '<dd class=result><span>' + m_arSchMed.GetValue(n, "details") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Status:</span></dt>'
                 +               '<dd class=result><span>' + m_arSchMed.GetValue(n, "status") + '</span></dd>'
                 +             '</dl>'
                 +           '</td>'
                 +         '</tr>'
    }
    tableBody   +=       '</table>'
  }
  tableBody     +=     '</div>'


  // All Continuous Meds
  sRet = bNum ? '<span class="num-val">(' + m_arContMed.size + ')</span>' : "";

  tableBody +=         '<div class="subsection">'
             +           '<h3 class=sub-sec id="medContHead"><span>Continuous</span>' + sRet + '</h3>'
  
  if(m_arContMed.size){
    tableBody +=         '<table class="ml-table">'
               +           '<caption>table: Medications</caption>'
    
    for(n = 0; n < m_arContMed.size; n++){
      var medRowId = "medRow"+(n+1+m_arSchMed.size);
      tableBody +=         '<tr id="' + medRowId +'">'
                 +           '<td class="ml-med-name">'
                 +             '<dl class=ml-info>'
                 +               '<dt class="ml-det-type"><span>Medication</span></dt>'
                 +               '<dd>' + m_arContMed.GetValue(n, "name") + '<span class="result">' + m_arContMed.GetValue(n, "details") + '</span></dd>'
                 +             '</dl>'
                 +             '<h4><span class="ml-det-hd">Medication Details</span></h4>'
                 +             '<dl class="ml-det hideHover">'
                 +               '<dt class="ml-det-type"><span>Medication:</span></dt>'
                 +               '<dd class=result><span>' + m_arContMed.GetValue(n, "name") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Start Date/Time:</span></dt>'
                 +               '<dd class=result><span>' + m_arContMed.GetValue(n, "startdate") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Last Dose Date/Time:</span></dt>'
                 +               '<dd class=result><span>' + m_arContMed.GetValue(n, "lastdose") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Detail:</span></dt>'
                 +               '<dd class=result><span>' + m_arContMed.GetValue(n, "details") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Status:</span></dt>'
                 +               '<dd class=result><span>' + m_arContMed.GetValue(n, "status") + '</span></dd>'
                 +             '</dl>'
                 +           '</td>'
                 +         '</tr>'
    }
    tableBody   +=       '</table>'
  }
  tableBody     +=     '</div>'


  // All PRN Meds
  sRet = bNum ? '<span class="num-val">(' + m_arPRNMed.size + ')</span>' : "";

  tableBody +=         '<div class="subsection">'
             +           '<h3 class=sub-sec id="medPRNHead"><span>PRN</span>' + sRet + '</h3>'
  
  if(m_arPRNMed.size){
    tableBody +=         '<table class="ml-table">'
               +           '<caption>table: Medications</caption>'
    
    for(n = 0; n < m_arPRNMed.size; n++){
      var medRowId = "medRow"+(n+1+m_arSchMed.size+m_arContMed.size);
      tableBody +=         '<tr id="' + medRowId +'">'
                 +           '<td class="ml-med-name">'
                 +             '<dl class=ml-info>'
                 +               '<dt class="ml-det-type"><span>Medication</span></dt>'
                 +               '<dd>' + m_arPRNMed.GetValue(n, "name") + '<span class="result">' + m_arPRNMed.GetValue(n, "details") + '</span></dd>'
                 +             '</dl>'
                 +             '<h4><span class="ml-det-hd">Medication Details</span></h4>'
                 +             '<dl class="ml-det hideHover">'
                 +               '<dt class="ml-det-type"><span>Medication:</span></dt>'
                 +               '<dd class=result><span>' + m_arPRNMed.GetValue(n, "name") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Start Date/Time:</span></dt>'
                 +               '<dd class=result><span>' + m_arPRNMed.GetValue(n, "startdate") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Last Dose Date/Time:</span></dt>'
                 +               '<dd class=result><span>' + m_arPRNMed.GetValue(n, "lastdose") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Detail:</span></dt>'
                 +               '<dd class=result><span>' + m_arPRNMed.GetValue(n, "details") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Status:</span></dt>'
                 +               '<dd class=result><span>' + m_arPRNMed.GetValue(n, "status") + '</span></dd>'
                 +             '</dl>'
                 +           '</td>'
                 +         '</tr>'
    }
    tableBody   +=       '</table>'
  }
  tableBody     +=     '</div>'

  // All Administered Meds
  sRet = bNum ? '<span class="num-val">(' + m_arAdminMed.size + ')</span>' : "";

  tableBody +=         '<div class="subsection">'
             +           '<h3 class=sub-sec id=medAdminHead><span>Administered</span>' + sRet + '</h3>'
  
  if(m_arAdminMed.size){
    tableBody +=         '<table class="ml-table">'
               +           '<caption>table: Medications</caption>'
    
    for(n = 0; n < m_arAdminMed.size; n++){
      var medRowId = "medRow"+(n+1+m_arSchMed.size+m_arContMed.size+m_arPRNMed.size);
      tableBody +=         '<tr id="' + medRowId +'">'
                 +           '<td class="ml-med-name">'
                 +             '<dl class=ml-info>'
                 +               '<dt class="ml-det-type"><span>Medication</span></dt>'
                 +               '<dd>' + m_arAdminMed.GetValue(n, "name") + '<span class="result">' + m_arAdminMed.GetValue(n, "lastdoseamt") + " " + m_arAdminMed.GetValue(n, "route") + '</span></dd>'
                 +             '</dl>'
                 +             '<h4><span class="ml-det-hd">Medication Details</span></h4>'
                 +             '<dl class="ml-det hideHover">'
                 +               '<dt class="ml-det-type"><span>Medication:</span></dt>'
                 +               '<dd class=result><span>' + m_arAdminMed.GetValue(n, "name") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Start Date/Time:</span></dt>'
                 +               '<dd class=result><span>' + m_arAdminMed.GetValue(n, "startdate") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Administration Date/Time:</span></dt>'
                 +               '<dd class=result><span>' + m_arAdminMed.GetValue(n, "lastdosedttm") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Order Detail:</span></dt>'
                 +               '<dd class=result><span>' + m_arAdminMed.GetValue(n, "details") + '</span></dd>'
                 +               '<dt class="ml-det-type"><span>Order Status:</span></dt>'
                 +               '<dd class=result><span>' + m_arAdminMed.GetValue(n, "status") + '</span></dd>'
                 +             '</dl>'
                 +           '</td>'
                 +         '</tr>'
    }
    tableBody   +=       '</table>'
  }
  tableBody     +=     '</div>'

  
  // Close of Meds Section
  tableBody     +=   '</div>'
                 + '</div>'
  
  return tableBody;
}


function RenderVS(oSect){
  var n, i, sRet, sRet2, arTmp, arTmp2, arTmp3, sClass, bRes, oDt, dtRes, pClass1, pClass2, pIco1, pIco2;
  var nVS = 0;
  var tableBody = "";
  var olClass = "";
  vsMaxSeq = 0;
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }

  // Get the total number of VS rows
  for(n = 0; n < m_arVS.size; n++){
    arTmp = m_arVS.GetAll("seq", (n + 1));
    if(arTmp.size){
      vsMaxSeq++;
    }
  }

  if(oSect.total_results){
    if(oSect.x_of_y)
	if(oSect.scroll_num)
	  sRet = '(' + Math.min(oSect.scroll_num, vsMaxSeq) + ' of ' + vsMaxSeq + ')';
	else
	  sRet = '(' + vsMaxSeq + " of " + vsMaxSeq + ')';
    else
	sRet = '(' + vsMaxSeq + ')';
  }
  else
    sRet = "";

  scrollRows("vital-signs",oSect.scroll_num);
    
  // First assign timestamp for graphing
  for(n = 0; n < m_arVS.size; n++){
    sRet2 = m_arVS.GetValue(n, "graph_dttm_s");
    dtRes = new Date();
    dtRes.setMonth(Number(sRet2.substr(0, 2)) - 1);
    dtRes.setDate(Number(sRet2.substr(2, 2)));
    dtRes.setFullYear(Number(sRet2.substr(4, 4)));
    dtRes.setHours(Number(sRet2.substr(8, 2)) - Number(dtRes.getTimezoneOffset())/60);
    dtRes.setMinutes(Number(sRet2.substr(10, 2)));
    m_arVS.GetObject(n).graph_dttm = dtRes;
  }
  m_arVS.Sort("graph_dttm", true)



  tableBody =        '<div class="section vital-signs ' + olClass + '">'
              +        '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '<span class="num-val">' + sRet + '</span><span class="hd-info">Since ED arrival</span></h2>'
             +         '<div class=sec-content id="vital-signs">'

  if(!m_arVS.size){
    tableBody +=         '<p class="no-results">-- No results found --</p>'
               +       '</div>'
               +     '</div>'
    return tableBody;
  }
  
  tableBody +=           '<table class=vs-table>'
             +             '<caption>table: Vital Signs</caption>'
             +             '<tr id="vsHeaderRow" class="headerrtcell">'
             +               '<th class="latest_hd vs-lbl-hd">&#160;</th>'
		     +               '<th class="latest_hd vs-icon">&#160;</th>'
             +               '<th class="latest_hd vs-res"><span class="current">Latest</span></th>'
             +               '<th class="prev_hd vs-icon"><span>&#160;</span></th>'
             +               '<th class="prev_hd vs-res"><span>Previous</span></th>'
             +               '<th class="prev_hd vs-icon"><span>&#160;</span></th>'
             +               '<th class="prev_hd vs-res"><span>Previous</span></th>'
             +             '</tr>'

  //iterate through all vs results
  for(n = 0; n < m_arVS.size; n++){
    mod_n = n%2;
    rowClass = "";
    if (mod_n)
      {rowClass = "odd"}
    else
      {rowClass = "even"}
    arTmp = m_arVS.GetAll("seq", n + 1);
    // if there is a row at this seq
    if(arTmp.size){
      nVS++;
      var vsRowId = "vsRow"+nVS;
      
      // *** 1ST RESULT COLUMN ***
      // assign group or result name

      sRet = arTmp.GetValue(0, "isgroup") ? arTmp.GetValue(0, "group_disp") : arTmp.GetValue(0, "name")
      
      // if a result doesnt have a UOM, dont build the graph link
      if(arTmp.GetValue(0, "unit")) {
        tableBody +=          '<tr class=' + rowClass +' id=' + vsRowId + '>'
                   +            '<th class=thHd><span><a title="Click to view '+ sRet + ' graph" onClick="VSGraph(' + (n + 1) + ')">' + sRet + '</a></span></th>'
      } else {
        tableBody +=          '<tr class=' + rowClass +' id=' + vsRowId + '>'
                   +            '<th class=thHd><span>' + sRet + '</span></th>'
      }
      for(i = 0; i < 3; i++){
	  // determine if result is part of a pair
        if(arTmp.GetValue(0, "ispair")){
	    arTmp2 = arTmp.GetAll("pair_seq", 1);
          arTmp3 = arTmp.GetAll("pair_seq", 2);
	    if(i < arTmp2.size && i < arTmp3.size){
	      
	      if(arTmp2.GetValue(i, "normalcy") == "high"){
	        pClass1 = 'resHigh';
			pIco1 = '<span class="hi">&nbsp;<span class="print-hi">H</span></span>';
	      }
	      else if(arTmp2.GetValue(i, "normalcy") == "low" ){
	        pClass1 = 'resLow';
			pIco1 = '<span class="lo">&nbsp;<span class="print-lo">L</span></span>';
	      }
	      else if(arTmp2.GetValue(i, "normalcy") == "crit" ){
	        pClass1 = 'critical';
			pIco1 = '<span class="crit">&nbsp;<span class="print-crit">C</span></span>';
	      }
	      else{
	        pClass1 = 'result';
			pIco1 = '';
	      }  
	      if(arTmp3.GetValue(i, "normalcy") == "high"){
	        pClass2 = 'resHigh';
			pIco2 = '<span class="hi">&nbsp;<span class="print-hi">H</span></span>';
	      }
	      else if(arTmp3.GetValue(i, "normalcy") == "low" ){
	        pClass2 = 'resLow';
			pIco2 = '<span class="lo">&nbsp;<span class="print-lo">L</span></span>';
	      }
	      else if(arTmp3.GetValue(i, "normalcy") == "crit" ){
	        pClass2 = 'critical';
			pIco2 = '<span class="crit">&nbsp;<span class="print-crit">C</span></span>';
	      }
	      else{
	        pClass2 = 'result';
			pIco2 = '';
	      }  	      
	      
	      tableBody +=			'<td class="vs-icon"><span>&#160;</span></td>'
					 +			'<td class="vs-res">'
	                 +            '<dl class=vs-info>'
	                 +              '<dt class=vs-det-type><span>Result</span></dt>'
	                 +              '<dd>' + pIco1 + '<span class = ' + pClass1 + '>' + arTmp2.GetValue(i, "result") + '</span>/' + pIco2 + '<span class = ' + pClass2 + '>' + arTmp3.GetValue(i, "result") + '</span>'
					 +				  '<br /><span class="date-time">' + arTmp2.GetValue(i, "within") + '</span>'
					 +				'</dd>'
	                 +            '</dl>'
	                 +            '<h4><span class=vs-det-hd>VS details</span></h4>'
	                 +            '<dl class="vs-det hideHover">'
	                 +              '<dt class=vs-det-type><span>' + arTmp2.GetValue(i, "pair_name") + ':</span></dt>'
	                 +              '<dd class=result><span class=' + pClass1 + '>' + arTmp2.GetValue(i, "result") + '</span>/<span class = ' + pClass2 + '>' + arTmp3.GetValue(i, "result") + '</span></dd>'
	      if (arTmp2.GetValue(i, "method")) {
	        tableBody +=            '<dt class=result><span>Method:</span></dt>'
	                   +            '<dd class=vs-det-type><span>' + arTmp2.GetValue(i, "method") + '</span></dd>'
	      }
	      tableBody +=              '<dt class=result><span>Unit of Measure:</span></dt>'
	                 +              '<dd class=vs-det-type><span>' + arTmp2.GetValue(i, "unit") + '</span></dd>'
					 +				'<dt class=result><span>Date/Time:</span></dt>'
	                 +              '<dd class=vs-det-type><span>' + arTmp2.GetValue(i, "dttm") + '</span></dd>'
	                 +              '<dt class=result><span>Normal Range:</span></dt>'
	                 +              '<dd class=vs-det-type><span>' + arTmp2.GetValue(i, "low") + '/' + arTmp3.GetValue(i, "low") + ' - ' + arTmp2.GetValue(i, "high") + '/' + arTmp3.GetValue(i, "high") + '</span></dd>'
	                 +            '</dl>'
	                 +          '</td>'
	    }
	    else{  // if NOT a pair at this index
	      tableBody +=			'<td class="vs-icon"><span>&#160;</span></td>'
					 +			'<td class="vs-res result">'
	                 +            '<dl class=vs-info>'
	                 +              '<dd><span>---</span></dd>'
	                 +            '</dl>'
	                 +          '</td>'
	    }
        } // end if pair
        else if(i < arTmp.size){ // if NOT a pair
          if(arTmp.GetValue(i, "normalcy") == "high"){
            sRet = '<span class="hi">&nbsp;<span class="print-hi">H</span></span>';
            sClass = 'resHigh';
          }
          else if(arTmp.GetValue(i, "normalcy") == "low"){
            sRet = '<span class="lo">&nbsp;<span class="print-lo">L</span></span>';
            sClass = 'resLow';
          }
          else if(arTmp.GetValue(i, "normalcy") == "crit"){
            sRet = '<span class="crit">&nbsp;<span class="print-crit">C</span></span>';
            sClass = 'critical';
          }
          else{
            sRet = '<span>&nbsp;</span>';
            sClass = 'result';
          }
          
	  tableBody +=			'<td class="vs-icon">' + sRet + '</td>'
				 +			'<td class="vs-res">'
	             +            '<dl class=vs-info>'
	             +              '<dt class=vs-det-type><span>Result</span></dt>'
	             +              '<dd><span class=' + sClass +'>' + arTmp.GetValue(i, "result") + '</span>'
				 +				'<br /><span class="date-time">' + arTmp.GetValue(i, "within") + '</span>'
				 +				'</dd>'
	             +            '</dl>'
	             +            '<h4><span class=vs-det-hd>VS details</span></h4>'
	             +            '<dl class="vs-det hideHover">'
	             +              '<dt class=vs-det-type><span>' + arTmp.GetValue(i, "name") + ':</span></dt>'
	             +              '<dd class=result><span class=' + sClass + '>' + arTmp.GetValue(i, "result") + '</span></dd>'

	  if (arTmp.GetValue(i, "method")) {
	    tableBody +=            '<dt class=result><span>Method:</span></dt>'
	               +            '<dd class=vs-det-type><span>' + arTmp.GetValue(i, "method") + '</span></dd>'
	  }
	  tableBody +=              '<dt class=result><span>Unit of Measure:</span></dt>'
	             +              '<dd class=vs-det-type><span>' + arTmp.GetValue(i, "unit") + '</span></dd>'
				 +				'<dt class=result><span>Date/Time:</span></dt>'
	             +              '<dd class=vs-det-type><span>' + arTmp.GetValue(i, "dttm") + '</span></dd>'				 
	             +              '<dt class=result><span>Normal Range:</span></dt>'
	             +              '<dd class=vs-det-type><span>' + arTmp.GetValue(i, "low") + ' - ' + arTmp.GetValue(i, "high") + '</span></dd>'
	             +            '</dl>'
	             +          '</td>'
        }
        else{
	      tableBody +=			'<td class="vs-icon"><span>&#160;</span></td>'
					 +			'<td class="vs-res result">'
	                 +            '<dl class=vs-info>'
	                 +              '<dd><span>---</span></dd>'
	                 +            '</dl>'
	                 +          '</td>'
        } // end NOT bRes
      } //end for < 2
      tableBody +=                '</tr>'
    } // end if vitals at this row (at this seq)
    else
      n = m_arVS.size;
  } // end for all Vitals

  tableBody +=              '</table>'
             +            '</div>'
             +          '</div>'
  return tableBody;
}


function RenderLabs(oSect){
  var n, i, j, sRet, sRet2, sClass, arDet, arTmp, sClass2;
  var nLabs = 0;
  var tableBody = "";
  var olClass = "";
  labMaxSeq = 0;
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }
  
  // Get the total number of lab rows
  for(n = 0; n < m_arLab.size; n++){
    arTmp = m_arLab.GetAll("seq", (n + 1));
    if(arTmp.size){
      labMaxSeq++;
    }
  }

  if(oSect.total_results){
    if(oSect.x_of_y)
	if(oSect.scroll_num)
	  sRet = '(' + Math.min(oSect.scroll_num, labMaxSeq) + ' of ' + labMaxSeq + ')';
	else
	  sRet = '(' + labMaxSeq + " of " + labMaxSeq + ')';
    else
	sRet = '(' + labMaxSeq + ')';
  }
  else
    sRet = "";

  scrollRows("lab-results",oSect.scroll_num);
  
  // First assign timestamp for graphing
  for(n = 0; n < m_arLab.size; n++){
    sRet2 = m_arLab.GetValue(n, "graph_dttm_s");
    dtRes = new Date();
    dtRes.setMonth(Number(sRet2.substr(0, 2)) - 1);
    dtRes.setDate(Number(sRet2.substr(2, 2)));
    dtRes.setFullYear(Number(sRet2.substr(4, 4)));
    dtRes.setHours(Number(sRet2.substr(8, 2)) - Number(dtRes.getTimezoneOffset())/60);
    dtRes.setMinutes(Number(sRet2.substr(10, 2)));
    m_arLab.GetObject(n).graph_dttm = dtRes;
  }
  m_arLab.Sort("graph_dttm", true)
  
  
  tableBody =        '<div class="section lab-results ' + olClass + '">'
             +         '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '<span class="num-val">' + sRet + '</span><span class="hd-info">Since ED arrival</span></h2>'
             +         '<div class=sec-content id="lab-results">'

  if(!m_arLab.size){
    tableBody +=         '<p class="no-results">-- No results found --</p>'
               +       '</div>'
               +     '</div>'
    return tableBody;
  }
  
  tableBody +=           '<table class=lr-table>'
             +             '<caption>table: Lab Results</caption>'
             +             '<tr id="labHeaderRow" class="headerrtcell">'
             +               '<th class="latest_hd lab-lbl-hd">&#160;</th>'
		     +               '<th class="latest_hd lab-icon">&#160;</th>'
             +               '<th class="latest_hd lab-res"><span class="current">Latest</span></th>'
             +               '<th class="prev_hd lab-icon"><span>&#160;</span></th>'
             +               '<th class="prev_hd lab-res"><span>Previous</span></th>'
             +               '<th class="prev_hd lab-icon"><span>&#160;</span></th>'
             +               '<th class="prev_hd lab-res"><span>Previous</span></th>'
             +             '</tr>'



  for(n = 0; n < m_arLab.size; n++){
    mod_n = n%2;
    rowClass = "";
    if (mod_n)
      {rowClass = "odd"}
    else
      {rowClass = "even"}
    arTmp = m_arLab.GetAll("seq", (n + 1));
    if(arTmp.size){
      var sName = arTmp.GetValue(0, "name");
      nLabs++;
      var labRowId = "labRow"+nLabs;

        tableBody +=          '<tr class=' + rowClass +' id=' + labRowId+ '>'
                   +            '<th class=lab><span><a title="Click to view '+ sName + ' graph" onClick="LabGraph(' + (n + 1) + ')">' + sName + '</a></span></th>'
      
      // write only up to 2 results
      for(j = 0; j < 3; j++){
        bRes = j < arTmp.size ? true:false
        var sRet = "", sClass = "", sClass2 = "";
        
        if(bRes){
          if(arTmp.GetValue(j, "normalcy") == "high"){
            sRet = '<span class="hi">&nbsp;<span class="print-hi">H</span></span>';
            sClass = "resHigh";
          }
          else if(arTmp.GetValue(j, "normalcy") == "low"){
            sRet = '<span class="lo">&nbsp;<span class="print-lo">L</span></span>';
            sClass = "resLow";
          }
          else if(arTmp.GetValue(j, "normalcy") == "crit"){
            sRet = '<span class="crit">&nbsp;<span class="print-crit">C</span></span>';
            sClass = "critical";
          }
          else{
            sRet = '<span>&nbsp;</span>';
            sClass = 'result';
          }
        }
        
        if(bRes){
          tableBody += 			'<td class="lab-icon">' + sRet + '</td>'
					 +			'<td class="lab-res">'
                     +             '<dl class=lr-info>'
                     +               '<dt class=lr-det-type><span>Result</span></dt>'
                     +               '<dd><span class=' + sClass + '>' + arTmp.GetValue(j, "result") + '</span>'
					 +				 '<br /><span class="date-time">' + arTmp.GetValue(j, "within") + '</span>'
					 +				 '</dd>'
                     +             '</dl>'
                     +             '<h4><span class=lr-det-hd>Lab details</span></h4>'
                     +             '<dl class="lr-det hideHover">'
                     +               '<dt class=lr-det-type><span>' + arTmp.GetValue(j, "name") + ':</span></dt>'
                     +               '<dd class=result><span class=' + sClass + '>' + arTmp.GetValue(j, "result") + '</span></dd>'
                     +               '<dt class=lr-det-type><span>Unit of Measure:</span></dt>'
                     +               '<dd class=result><span>' + arTmp.GetValue(j, "unit") + '</span></dd>'
                     +               '<dt class=lr-det-type><span>Date/Time Collected:</span></dt>'
                     +               '<dd class=result><span>' + arTmp.GetValue(j, "collected") + '</span></dd>'
                     +               '<dt class=lr-det-type><span>Normal Range:</span></dt>'
                     +               '<dd class=result><span>' + arTmp.GetValue(j, "low") + ' - ' + arTmp.GetValue(j, "high") + '</span></dd>'
                     +             '</dl>'
                     +           '</td>'
        }
        else{
	  tableBody += 			'<td class="lab-icon">&nbsp;</td>'
				 +			'<td class="lab-res result">'
	             +            '<dl class=lr-info>'
	             +              '<dd><span>---</span></dd>'
	             +            '</dl>'
	             +          '</td>'
        }  //endif bRes
      } //endfor j
      tableBody +=            '</tr>'
    }  //endif arTmp.size
    else
	n = m_arLab.size;
  }  //endfor n
        
  tableBody +=              '</table>'
             +            '</div>'
             +          '</div>'
  
  return tableBody;
}



function RenderMicroPath(oSect){
  var n, x, sRet, sClass, sClass2, sClass3, sWithinHover;
  var tableBody = "";
  var olClass = "";
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }

  if(oSect.total_results){
    if(oSect.x_of_y)
	if(oSect.scroll_num)
	  sRet = '(' + Math.min(oSect.scroll_num, m_arMicroPath.size) + ' of ' + m_arMicroPath.size + ')';
	else
	  sRet = '(' + m_arMicroPath.size + " of " + m_arMicroPath.size + ')';
    else
	sRet = '(' + m_arMicroPath.size + ')';
  }
  else
    sRet = "";

  scrollRows("micro-results",oSect.scroll_num);

  tableBody =      '<div class="section micro-results ' + olClass + '">'
             +       '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '<span class="num-val">' + sRet + '</span><span class="hd-info">Last 10 days</span></h2>'
             +       '<div class=sec-content id="micro-results">'

  if(!m_arMicroPath.size){
    tableBody +=       '<p class="no-results">-- No results found --</p>'
               +     '</div>'
               +   '</div>'
    return tableBody;
  }


    tableBody +=       '<table  class="mic-table">'
               +         '<tr class="headerrtcell" id="micHeaderRow">'
               +           '<th class="hd mic-src">Source/Site</th>'
               +           '<th class="shd mic-dt"><span class="date-time">within</span></th>'
               +           '<th class="shd mic-norm">Normality</th>'
               +           '<th class="shd mic-stat">Status</th>'
               +         '</tr>'


  for(n = 0; n < m_arMicroPath.size; n++){
    if(m_arMicroPath.GetValue(n, "norm") == "Growth"){
      sClass = "critical";
      sClass2 = "mic-critical";
      sClass3 = "mic-critical";
      sClass4 = "dt-critical anchorclass";
    }
    else{
      sClass = "";
      sClass2 = "normalcy";
      sClass3 = "status";
      sClass4 = "dt-normal anchorclass";
    }
    sRet = m_arMicroPath.GetValue(n, "source") + (m_arMicroPath.GetValue(n, "site").length ? ", " + m_arMicroPath.GetValue(n, "site") : "")
    
    var dWithinSeq = "dSeq"+ n
    
    var rptItems = m_arMicroPath.GetValue(n, "reports");
    
    var sWithinHover = '<div id=' + dWithinSeq + ' class="anylinkcssmicro">'
                     +   '<div class=microCol>'
                     +     '<dl class="microDl">'
                     +       '<dt><span>Source/Body Site:</span></dt>'
                     +       '<dd><span>' + sRet + '</span></dd>'
                     +       '<dt><span>Collected Date/Time:</span></dt>'
                     +       '<dd><span>' + m_arMicroPath.GetValue(n, "collected") + '</span></dd>'
    if(m_arMicroPath.GetValue(n, "sus") == "Done"){
      sWithinHover +=        '<dt><span>Susceptibilty:</span></dt>'
                    +        '<dd><span>' + m_arMicroPath.GetValue(n, "sus") + '</span></dd>'
    }
                 
    if (rptItems.size)
    {
        sWithinHover += '<dt class=result><b>Associated Micro Reports:</b></dt><dd>&nbsp;</dd>';
        
        for (x = 0; x < rptItems.size; x++)
        {
                sWithinHover += '<dt><a href=' + ReportLink(rptItems.GetValue(x, "event_id")) + '>' + rptItems.GetValue(x, "description") + '</a></dt>'
                              + '<dd>' + rptItems.GetValue(x, "updt_dt_tm") + '</dd>'
        }
    }

    sWithinHover +=        '</dl>'
                     +   '</div>'
                     + '</div>'

    var micRowId = "micRow"+(n+1);
    tableBody +=       '<tr id="' + micRowId +'">'
               +         '<td class="mic-src ' + sClass + '">'
               +           '<dl>'
               +             '<dd class=mic-det-type><span>' + sRet + '</span></dd>'
               +           '</dl>'
               +         '</td>'
               +         '<td class="mic-dt date-time">'
               +           '<dl class=mic-info>'
               +             '<dd class=mic-det-type><span class="' + sClass4 + '" rel=' + dWithinSeq + '>' + m_arMicroPath.GetValue(n, "within") + '</span></dd>'
               +           '</dl>'
               +           sWithinHover
               +         '</td>'
               +         '<td class="mic-norm result"><span class=' + sClass2 + '>' + m_arMicroPath.GetValue(n, "norm") + '</span></td>' 
               +         '<td class="mic-stat result"><span class=' + sClass3 + '>' + m_arMicroPath.GetValue(n, "status") + '</span></td>' 
               +       '</tr>'
               
  }
  tableBody +=       '</table>'
             +     '</div>'
             +   '</div>'
  
  return tableBody;
}



function RenderDocs(oSect){
  var n, sRet, arTmp, arTmp1;
  var tableBody = "";
  var olClass = "";
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }

  if(oSect.total_results){
    if(oSect.x_of_y)
	if(oSect.scroll_num)
	  sRet = '(' + Math.min(oSect.scroll_num, m_arDoc.size) + ' of ' + m_arDoc.size + ')';
	else
	  sRet = '(' + m_arDoc.size + " of " + m_arDoc.size + ')';
    else
	sRet = '(' + m_arDoc.size + ')';
  }
  else
    sRet = "";

  scrollRows("nursing-doc",oSect.scroll_num);

  tableBody =      '<div class="section nursing-doc ' + olClass + '">'
             +       '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '<span class="num-val">' + sRet + '</span><span class="hd-info">Last 6 months</span></h2>'
             +       '<div class=sec-content id="nursing-doc">'

  if(!m_arDoc.size){
    tableBody +=       '<p class="no-results">-- No results found --</p>'
               +     '</div>'
               +   '</div>'
    return tableBody;
  }
  
  tableBody +=         '<table class="doc-table">'
             +           '<caption>table: Documentation</caption>'
             +           '<tbody>'
             +             '<tr class="headerrtcell" id="docHeaderRow1">'
             +               '<th class="shd doc-name">&#160;</th>'
             +               '<th class="shd doc-dt"><span class="date-time">within</span></th>'
             +               '<th class="shd doc-auth">Author</th>'
             +             '</tr>'


  arTmp = m_arDoc.GetAll("consult", 0)
  for(n = 0; n < arTmp.size; n++){
    var docRowId = "docRow"+(n+1);
    tableBody +=           '<tr id="' + docRowId +'">'
               +             '<td class="doc-name result">' + arTmp.GetValue(n, "name") + '</td>'
               +             '<td class="doc-dt date-time">'
               +               '<dl class=doc-info>';
               if (arTmp.GetValue(n, "report_id")>0)
               {
                tableBody+='<dd class=doc-det-type><a href=' + ReportLink(arTmp.GetValue(n, "report_id")) + '><span class="dt-res">' + arTmp.GetValue(n, "within") + '</span></a></dd>'
               }
               else{
                tableBody+='<dd class=doc-det-type><span class="dt-res">' + arTmp.GetValue(n, "within") + '</span></dd>'
               }
            
   tableBody  +=               '</dl>'
               +               '<h4 class=doc-det-hd><span>Documentation Details</span></h4>'
               +               '<dl class="doc-det hideHover">'
               +                 '<dt class=result><span>Note Name:</span></dt>'
               +                 '<dd class=doc-det-type><span>' + arTmp.GetValue(n, "name") + '</span></dd>'
               +                 '<dt class=result><span>Date/Time:</span></dt>'
               +                 '<dd class=doc-det-type><span>' + arTmp.GetValue(n, "dttm") + '</span></dd>'
               +                 '<dt class=result><span>Author:</span></dt>'
               +                 '<dd class=doc-det-type><span>' + arTmp.GetValue(n, "author") + '</span></dd>'
               +                 '<dt class=result><span>Status:</span></dt>'
               +                 '<dd class=doc-det-type><span>' + arTmp.GetValue(n, "status") + '</span></dd>'
               +               '</dl>'
               +             '</td>'
               +             '<td class="doc-table-author doc-auth"><span class="author">' + arTmp.GetValue(n, "author") + '</span></td>'
               +           '</tr>';
  }
  
  arTmp1 = m_arDoc.GetAll("consult", 1)
  
  tableBody +=             '<tr class="headerrtcell" id="docHeaderRow2">'
             +               '<td colspan="3"><span class="hd">Consultations</span><span class="num-val">(' + arTmp1.size + ')</span></td>'
             +               '</tr>';
  
  
  
  for(n = 0; n < arTmp1.size; n++){
    var docRowId = "docRow"+(n+1+arTmp.size);
    tableBody +=           '<tr id="' + docRowId +'">'
               +             '<td class="doc-name result">' + arTmp1.GetValue(n, "name") + '</td>'
               +             '<td class="doc-dt date-time">'
               +               '<dl class=doc-info>';
    if (arTmp.GetValue(n, "report_id")>0)
    {
     tableBody+='<dd class=doc-det-type><a href=' + ReportLink(arTmp1.GetValue(n, "report_id")) + '><span class="dt-res">' + arTmp1.GetValue(n, "within") + '</span></a></dd>'
    }
    else{
     tableBody+='<dd class=doc-det-type><span class="dt-res">' + arTmp.GetValue(n, "within") + '</span></dd>'
    }

    tableBody +=               '</dl>'
               +               '<h4 class=doc-det-hd><span>Documentation Details</span></h4>'
               +               '<dl class="doc-det hideHover">'
               +                 '<dt class=result><span>Note Name:</span></dt>'
               +                 '<dd class=doc-det-type><span>' + arTmp1.GetValue(n, "name") + '</span></dd>'
               +                 '<dt class=result><span>Date/Time:</span></dt>'
               +                 '<dd class=doc-det-type><span>' + arTmp1.GetValue(n, "dttm") + '</span></dd>'
               +                 '<dt class=result><span>Author:</span></dt>'
               +                 '<dd class=doc-det-type><span>' + arTmp1.GetValue(n, "author") + '</span></dd>'
               +                 '<dt class=result><span>Status:</span></dt>'
               +                 '<dd class=doc-det-type><span>' + arTmp1.GetValue(n, "status") + '</span></dd>'
               +               '</dl>'
               +             '</td>'
               +             '<td class="doc-table-author doc-auth"><span class="author">' + arTmp1.GetValue(n, "author") + '</span></td>'
               +           '</tr>';
  }
  
  tableBody +=           '</tbody>'
             +         '</table>'
             +       '</div>'
             +     '</div>';
  
  return tableBody;

}



var ekgSubSecCnt = 0;
var xrSubSecCnt = 0;
var otherSubSecCnt = 0;
function RenderDiag(oSect){
  var n, sRet, arTmp, arTmp2;
  var subsecDisp, subSecID;
  var tableBody;
  var nDiag = 0;
  var nTot = 0;
  var olClass = "";
  if(oSect.expanded == 0){
    olClass = "onLoadCollapse"
  }

  // Get the total number of rows ahead of time for display in section header
  var totRows = 0;
  for (xx = 0; xx < 3; xx++){
    arTmp = m_arDiag.GetAll("type", xx);
    var wCnt = 1;
    switch (xx)
    {
      case 0:
        while (arTmp.GetAll("seq", wCnt).size > 0) {
          wCnt++;
          totRows++;
          ekgSubSecCnt++;
        }
        break;
      case 1:
        while (arTmp.GetAll("seq", wCnt).size > 0) {
          wCnt++;
          totRows++;
          xrSubSecCnt++;
        }
        break;
      case 2:
        while (arTmp.GetAll("seq", wCnt).size > 0) {
          wCnt++;
          totRows++;
          otherSubSecCnt++;
        }
        break;
      default:
        break;
    }
  }

  if(oSect.total_results){
    if(oSect.x_of_y)
	if(oSect.scroll_num)
	  sRet = '(' + Math.min(oSect.scroll_num, totRows) + ' of ' + totRows + ')';
	else
	  sRet = '(' + totRows + " of " + totRows + ')';
    else
	sRet = '(' + totRows + ')';
  }
  else
    sRet = "";

  scrollRows("diagnostic-results",oSect.scroll_num);

  tableBody =      '<div class="section diagnostic ' + olClass + '">'
             +       '<h2 class=sec-hd>' + MillLinkTab(oSect.label, oSect.link, m_oPtInfo.encntrid, m_oPtInfo.personid, m_oPtInfo.appnum) + '<span class="num-val">' + sRet + '</span><span class="hd-info">Since ED Arrival</span></h2>'
             +       '<div class=sec-content id="diagnostic-results">'

  if(!m_arDiag.size){
    tableBody +=       '<p class="no-results">-- No results found --</p>'
               +     '</div>'
               +   '</div>'
    return tableBody;
  }
  
  tableBody +=         '<h3 style="visibility: hidden; display: none;"></h3>'
             +         '<table class="dg-table">'
             +           '<caption>table: Diagnostics</caption>'
             +           '<tr id="diagHeaderRow" class="headerrtcell">'
             +             '<th class="dg-item-hd dg-name">&nbsp;</th>'
             +             '<th class="date-time-hd dg-latest">Latest</th>'
             +             '<th class="status-hd dg-stat">Status</th>'
             +             '<th class="p-dt-hd dg-prev">Previous</th>'
             +           '</tr>'
             +         '</table>'

  
  var subsecDisp;
  // Use for loop to loop through each type of diagnostic report
  // type of 0 = EKG
  // type of 1 = Chest
  // type of 2 = Other
  
  for (xx = 0; xx < 3; xx++){
    arTmp = m_arDiag.GetAll("type", xx);
    // check to see which subsection we are building HTML for, and find the max <tr>'s that are needed for each subsection
    var totRows = 0;
    var wCnt = 1;
    switch (xx)
    {
      case 0:
        if(m_arDiagSecs.GetValue(0,"dispekg") == 1){
          subsecDisp = "EKG";
          subSecID = "diagEKGHead";
          while (arTmp.GetAll("seq", wCnt).size > 0) {
            wCnt++;
            totRows++;
          }
          tableBody +=       '<div class="subsection">'
                     +         '<h3 class=sub-sec id="' + subSecID + '">' + subsecDisp + '<span class="num-val"> (' + totRows +')</span></h3>'
        }
        break;
      case 1:
        if(m_arDiagSecs.GetValue(0,"dispcxr") == 1){
          subsecDisp = "Chest/Abd XR";
          subSecID = "diagXRHead";
          while (arTmp.GetAll("seq", wCnt).size > 0) {
            wCnt++;
            totRows++;
          }
          tableBody +=       '<div class="subsection">'
                     +         '<h3 class=sub-sec id="' + subSecID + '">' + subsecDisp + '<span class="num-val"> (' + totRows +')</span></h3>'
        }
        break;
      case 2:
        if(m_arDiagSecs.GetValue(0,"dispother") == 1){
          subsecDisp = "Other Radiology";
          subSecID = "diagOtherHead";
          while (arTmp.GetAll("seq", wCnt).size > 0) {
            wCnt++;
            totRows++;
          }
          tableBody +=       '<div class="subsection">'
                     +         '<h3 class=sub-sec id="' + subSecID + '">' + subsecDisp + '<span class="num-val"> (' + totRows +')</span></h3>'
        }
        break;
      default:
        subsecDisp = "Unknown";
    }
    
    if(totRows){
      tableBody +=       '<table  class=dg-table>'
      for(n = 0; n < totRows; n++){
        nDiag++;
        var diagRowId = "diagRow"+(n+1);
        arTmp2 = arTmp.GetAll("seq", n + 1);
        if(arTmp2.size){
       
          tableBody +=         '<tr id="' + diagRowId +'">'
                     +         '<td class="dg-item dg-name">' + arTmp2.GetValue(0, "name") + '</td>'
                     +         '<td class="dg-latest">'
                     +           '<dl class=dg-info>'
          
          if (arTmp2.GetValue(0, "report_id") > 0)
            tableBody +=         '<dd><span class=date-time><a href=' + ReportLink(arTmp2.GetValue(0, "report_id")) + '>' + arTmp2.GetValue(0, "within") +'</a></span></dd>'
          else
            tableBody +=         '<dd><span class=date-time>' + arTmp2.GetValue(0, "within") +'</span></dd>'
          
          tableBody +=         '</dl>'
                     +         '<h4><span class=dg-det-hd>Study Details</span></h4>'
                     +         '<dl class="dg-det hideHover">'
                     +           '<dt class=dg-det-type><span>Study:</span></dt>'
                     +           '<dd class=result><span>' + arTmp2.GetValue(0, "name") + '</span></dd>'
                     +           '<dt class=dg-det-type><span>Date/Time:</span></dt>'
                     +           '<dd class=result><span>' + arTmp2.GetValue(0, "dttm") + '</span></dd>'
                     +         '</dl>'
                     +       '</td>'
                     +       '<td class="dg-stat"><span class="status">' + arTmp2.GetValue(0, "status") + '</span></td>'
                     
          if(arTmp2.size > 1){
            var dWithinSeq = "dSeq"+ n;
            var sWithinHover = '<div id=' + dWithinSeq + ' class="anylinkcsscols">'
            var col1 = '<div class = column><p><u>Study Name</u></p><ul>'
            var col2 = '<div class = column><p><u>Within</u></p><ul>'
            var col3 = '<div class = column><p><u>Date/Time</u></p><ul>'
            var col4 = '<div class = column><p><u>Status</u></p><ul>'
            for(zz = 1; zz < arTmp2.size; zz++){
              col1 += '<li>' + arTmp2.GetValue(zz, "name") + '</li>'
              if(arTmp2.GetValue(zz, "report_id") > 0){
                col2 += '<li><a href=' + ReportLink(arTmp2.GetValue(zz, "report_id")) + '>' + arTmp2.GetValue(zz, "within") + '</a></li>'
              }
              else{
                col2 += '<li>' + arTmp2.GetValue(zz, "within") + '</li>'
              }
              
              col3 += '<li>' + arTmp2.GetValue(zz, "dttm") + '</li>'
              col4 += '<li>' + arTmp2.GetValue(zz, "status") + '</li>'
            }
            col1 += '</ul></div>'
            col2 += '</ul></div>'
            col3 += '</ul></div>'
            col4 += '</ul></div>'
            
            sWithinHover +=     col1
                          +     col2
                          +     col3
                          +     col4
                          +     '</div>'
              
            tableBody +=  '<td class="date-time dg-prev"><span class="anchorclass" rel=' + dWithinSeq + '>' + (arTmp2.size-1) + ' Previous</span></td>'   
                       +     sWithinHover
          }
          else {
            tableBody +=     '<td class="dg-prev">--</td>'
          } //endif (arTmp2.size > 1)
          
          tableBody +=     '</tr>'
        } //endif arTmp2.size
      }  //endfor(n = 0; n < totRows; n++)
      tableBody +=     '</table>'
      tableBody +=   '</div>'
    }  // endif(totRows){
    //tableBody +=     '</div>'
  }  // endfor xx < 3
  
  tableBody +=     '</div></div>'
  return tableBody;
}



function VSGraph(nSeq){
  var arSect, arData, arData2, n, oDiv, plotData, sRet, arTmp, arTmp2, options;
  CloseGraph();

  arSect = m_arVS.GetAll("seq", nSeq);

  if(arSect.GetValue(0, "unit")) {
    sRet = '<table><tr><td><span class=gr-close onclick="CloseGraph()">Close  X</span></td><tr>'
    + '<tr><td class=gr-title>' + (arSect.GetValue(0, "isgroup") ? arSect.GetValue(0, "group_disp") : arSect.GetValue(0, "name")) + ' <span class=gr-unit>(' + arSect.GetValue(0, "unit") + ')</span></td></tr></table>';
  }
  else {
    sRet = '<table><tr><td><span class=gr-close onclick="CloseGraph()">Close  X</span></td><tr>'
    + '<tr><td class=gr-title>' + (arSect.GetValue(0, "isgroup") ? arSect.GetValue(0, "group_disp") : arSect.GetValue(0, "name")) + ' </td></tr></table>';
  }

  $('<div id=graph-frame>' + sRet + '<div id=vs-graph></div></div>').css({
    position:'absolute',
    left: event.clientX + 10,
    top: event.clientY + 10,
    width:'400',
    height:'300',
    background:"#F5FFFA",
    border:'2px solid black',
    padding:'3px'
  }).appendTo('body').fadeIn(0);

  arData = new Array();
  if(arSect.GetValue(0, "ispair")){
    arData2 = new Array();
    arTmp = arSect.GetAll("pair_seq", 1);
    for(n = 0; n < arTmp.size; n++)
      arData.push([arTmp.GetValue(n, "graph_dttm").getTime(), Number(arTmp.GetValue(n, "result").match(/\d+/g))]);
    arTmp2 = arSect.GetAll("pair_seq", 2);
    for(n = 0; n < arTmp2.size; n++)
      arData2.push([arTmp2.GetValue(n, "graph_dttm").getTime(), Number(arTmp2.GetValue(n, "result").match(/\d+/g))]);
    plotData = [{data: arData, color:"blue", shadowSize:0}, {data: arData2, color:"red", shadowSize:0}];
    options = {
      lines: { show: true},
      points: { show: true},
      xaxis: {mode:"time", timeformat:"%m/%d %h:%M"},
	yaxis: {tickSize: 10},
      grid: {color:"black", backgroundColor:"white", hoverable:true, autoHighlight:true}
    };
  }
  else{
    for(n = 0; n < arSect.size; n++)
      arData.push([arSect.GetValue(n, "graph_dttm").getTime(), arSect.GetValue(n, "result")]);
    plotData = [{data: arData, color:"#8B4513", shadowSize:0}];
    options = {
      lines: { show: true},
      points: { show: true},
      xaxis: {mode:"time", timeformat:"%m/%d %h:%M"},
      grid: {color:"black", backgroundColor:"white", hoverable:true, autoHighlight:true}
    };
  }

  var plot = $.plot($("#vs-graph"), plotData, options);

  $("#vs-graph").bind("plothover", function(event, pos, item){
    if(item){
      $('#tooltip').remove();
      var sHov, sClass, oNode;
      if(arSect.GetValue(0, "ispair")){
        var arTmp3 = item.seriesIndex ? arTmp2 : arTmp;
        if(item.dataIndex > arTmp3.size)
   	    item.dataIndex -= 5;
	  if(arTmp3.GetValue(item.dataIndex, "normalcy") == "high")
	    sClass = 'resHigh';
	  else if(arTmp3.GetValue(item.dataIndex, "normalcy") == "low")
	    sClass = 'resLow';
	  else if(arTmp3.GetValue(item.dataIndex, "normalcy") == "crit")
	    sClass = 'critical';
	  else
	    sClass = 'result';

          sHov =              '<dt class=vs-det-type><span>' + arTmp3.GetValue(item.dataIndex, "name") + ':</span></dt>'
	       +              '<dd class=result><span class=' + sClass + '>' + arTmp3.GetValue(item.dataIndex, "result") + ' ' + arTmp3.GetValue(item.dataIndex, "unit") + '</span></dd>'

	  if (arTmp3.GetValue(item.dataIndex, "method")) {
	    tableBody +=      '<dt class=result><span>Method:</span></dt>'
	               +      '<dd class=vs-det-type><span>' + arTmp3.GetValue(item.dataIndex, "method") + '</span></dd>'
	      }

	  sHov +=             '<dt class=result><span>Date/Time:</span></dt>'
	       +              '<dd class=vs-det-type><span>' + arTmp3.GetValue(item.dataIndex, "dttm") + '</span></dd>'
	       +              '<dt class=result><span>Normal Range:</span></dt>'
	       +              '<dd class=vs-det-type><span>' + arTmp3.GetValue(item.dataIndex, "low") + ' - ' + arTmp3.GetValue(item.dataIndex, "high") + '</span></dd>'

      }
      else{
	  if(arSect.GetValue(item.dataIndex, "normalcy") == "high")
	    sClass = 'resHigh';
	  else if(arSect.GetValue(item.dataIndex, "normalcy") == "low")
	    sClass = 'resLow';
	  else if(arSect.GetValue(item.dataIndex, "normalcy") == "crit")
	    sClass = 'critical';
	  else
	    sClass = 'result';

          sHov = 	      '<dt class=vs-det-type><span>' + arSect.GetValue(item.dataIndex, "name") + ':</span></dt>'
	       +              '<dd class=result><span class=' + sClass + '>' + arSect.GetValue(item.dataIndex, "result") + ' ' + arSect.GetValue(item.dataIndex, "unit") + '</span></dd>'

	  if (arSect.GetValue(item.dataIndex, "method")) {
	    tableBody +=      '<dt class=result><span>Method:</span></dt>'
	               +      '<dd class=vs-det-type><span>' + arSect.GetValue(item.dataIndex, "method") + '</span></dd>'
	      }

	  sHov +=             '<dt class=result><span>Date/Time:</span></dt>'
	       +              '<dd class=vs-det-type><span>' + arSect.GetValue(item.dataIndex, "dttm") + '</span></dd>'
	       +              '<dt class=result><span>Normal Range:</span></dt>'
	       +              '<dd class=vs-det-type><span>' + arSect.GetValue(item.dataIndex, "low") + ' - ' + arSect.GetValue(item.dataIndex, "high") + '</span></dd>'


      }
      $('<dl id=tooltip class=vs-det style="border: 1px solid #000;">' + sHov + '</dl>').css({top:item.pageY, left:item.pageX + 25}).appendTo('body').fadeIn(0);

      oNode = $('#tooltip')
    }
    else
      $('#tooltip').remove();
  });

  $("#vs-graph").bind("dblclick", function(){
    plot = $.plot($("#vs-graph"), plotData, options);
  });

  $("#vs-graph").bind("mouseout", function(){
    $('#graph-frame').draggable('enable');
  });

  $("#vs-graph").bind("mouseover", function(){
    $('#graph-frame').draggable('disable');
  });

  $('.gr-close').hover(function(){
    $(this).css('color', 'black');
  },
  function(){
    $(this).css('color', '#505050');
  });

  $('#graph-frame').draggable();
}

function CloseGraph(){
  $('#tooltip').remove();
  $('#graph-frame').remove();
}



function LabGraph(nSeq){
  var arSect, arData, arData2, n, oDiv, plotData, sRet, arTmp, arTmp2, options;
  CloseGraph();

  arSect = m_arLab.GetAll("seq", nSeq);

  if(arSect.GetValue(0, "unit")) {
    sRet = '<table><tr><td><span class=gr-close onclick="CloseGraph()">Close  X</span></td><tr>'
    + '<tr><td class=gr-title>' + arSect.GetValue(0, "name") + ' <span class=gr-unit>(' + arSect.GetValue(0, "unit") + ')</span></td></tr></table>';
  }
  else {
    sRet = '<table><tr><td><span class=gr-close onclick="CloseGraph()">Close  X</span></td><tr>'
    + '<tr><td class=gr-title>' + arSect.GetValue(0, "name") + '</td></tr></table>';
  }
  
  $('<div id=graph-frame>' + sRet + '<div id=lab-graph></div></div>').css({
    position:'absolute',
    left: event.clientX + 10,
    top: event.clientY + 10,
    width:'400',
    height:'300',
    background:"#F5FFFA",
    border:'2px solid black',
    padding:'3px'
  }).appendTo('body').fadeIn(0);

  arData = new Array();
    for(n = 0; n < arSect.size; n++)
      arData.push([arSect.GetValue(n, "graph_dttm").getTime(), arSect.GetValue(n, "result")]);
    plotData = [{data: arData, color:"#8B4513", shadowSize:0}];
    options = {
      lines: { show: true},
      points: { show: true},
      xaxis: {mode:"time", timeformat:"%m/%d %h:%M"},
      grid: {color:"black", backgroundColor:"white", hoverable:true, autoHighlight:true}
    };

  var plot = $.plot($("#lab-graph"), plotData, options);

  $("#lab-graph").bind("plothover", function(event, pos, item){
    if(item){
      $('#tooltip').remove();
      var sHov, sClass, oNode;
	  if(arSect.GetValue(item.dataIndex, "normalcy") == "high")
	    sClass = 'resHigh';
	  else if(arSect.GetValue(item.dataIndex, "normalcy") == "low")
	    sClass = 'resLow';
	  else if(arSect.GetValue(item.dataIndex, "normalcy") == "crit")
	    sClass = 'critical';
	  else
	    sClass = 'result';


          sHov = 	      '<dt class=lr-det-type><span>' + arSect.GetValue(item.dataIndex, "name") + ':</span></dt>'
	       +              '<dd class=result><span class=' + sClass + '>' + arSect.GetValue(item.dataIndex, "result") + ' ' + arSect.GetValue(item.dataIndex, "unit") + '</span></dd>'
	       +              '<dt class=lr-det-type><span>Date/Time Collected:</span></dt>'
	       +              '<dd class=result><span>' + arSect.GetValue(item.dataIndex, "collected") + '</span></dd>'
	       +              '<dt class=result><span>Normal Range:</span></dt>'
	       +              '<dd class=vs-det-type><span>' + arSect.GetValue(item.dataIndex, "low") + ' - ' + arSect.GetValue(item.dataIndex, "high") + '</span></dd>'

      $('<dl id=tooltip class=lr-det style="border: 1px solid #000;">' + sHov + '</dl>').css({top:item.pageY, left:item.pageX + 25}).appendTo('body').fadeIn(0);

      oNode = $('#tooltip')
    }
    else
      $('#tooltip').remove();
  });

  $("#lab-graph").bind("dblclick", function(){
    plot = $.plot($("#lab-graph"), plotData, options);
  });

  $("#lab-graph").bind("mouseout", function(){
    $('#graph-frame').draggable('enable');
  });

  $("#lab-graph").bind("mouseover", function(){
    $('#graph-frame').draggable('disable');
  });

  $('.gr-close').hover(function(){
    $(this).css('color', 'black');
  },
  function(){
    $(this).css('color', '#505050');
  });

  $('#graph-frame').draggable();
}

function CloseGraph(){
  $('#tooltip').remove();
  $('#graph-frame').remove();
}