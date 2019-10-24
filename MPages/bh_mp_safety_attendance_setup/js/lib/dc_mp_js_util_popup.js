/** extern healthe-widget-library-1.3.2-min */

/**~BB~************************************************************************
 *                                                                       *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
 *                              Technology, Inc.                         *
 *       Revision      (c) 1984-2009 Cerner Corporation                  *
 *                                                                       *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.          *
 *  This material contains the valuable properties and trade secrets of  *
 *  Cerner Corporation of Kansas City, Missouri, United States of        *
 *  America (Cerner), embodying substantial creative efforts and         *
 *  confidential information, ideas and expressions, no part of which    *
 *  may be reproduced or transmitted in any form or by any means, or     *
 *  retained in any storage or retrieval system without the express      *
 *  written permission of Cerner.                                        *
 *                                                                       *
 *  Cerner is a registered mark of Cerner Corporation.                   *
 *                                                                       *
 * 1. Scope of Restrictions                                              *
 *  A.  Us of this Script Source Code shall include the right to:        *
 *  (1) copy the Script Source Code for internal purposes;               *
 *  (2) modify the Script Source Code;                                   *
 *  (3) install the Script Source Code in Client's environment.          *
 *  B. Use of the Script Source Code is for Client's internal purposes   *
 *     only. Client shall not, and shall not cause or permit others, to  *
 *     sell, redistribute, loan, rent, retransmit, publish, exchange,    *
 *     sublicense or otherwise transfer the Script Source Code, in       *
 *     whole or part.                                                    *
 * 2. Protection of Script Source Code                                   *
 *  A. Script Source Code is a product proprietary to Cerner based upon  *
 *     and containing trade secrets and other confidential information   *
 *     not known to the public. Client shall protect the Script Source   *
 *     Code with security measures adequate to prevent disclosures and   *
 *     uses of the Script Source Code.                                   *
 *  B. Client agrees that Client shall not share the Script Source Code  *
 *     with any person or business outside of Client.                    *
 * 3. Client Obligations                                                 *
 *  A. Client shall make a copy of the Script Source Code before         *
 *     modifying any of the scripts.                                     *
 *  B. Client assumes all responsibility for support and maintenance of  *
 *     modified Script Source Code.                                      *
 *  C. Client assumes all responsibility for any future modifications to *
 *     the modified Script Source Code.                                  *
 *  D. Client assumes all responsibility for testing the modified Script *
 *     Source Code prior to moving such code into Client's production    *
 *     environment.                                                      *
 *  E. Prior to making first productive use of the Script Source Code,   *
 *     Client shall perform whatever tests it deems necessary to verify  *
 *     and certify that the Script Source Code, as used by Client,       *
 *     complies with all FDA and other governmental, accrediting, and    *
 *     professional regulatory requirements which are applicable to use  *
 *     of the scripts in Client's environment.                           *
 *  F. In the event Client requests that Cerner make further             *
 *     modifications to the Script Source Code after such code has been  *
 *     modified by Client, Client shall notify Cerner of any             *
 *     modifications to the code and will provide Cerner with the        *
 *     modified Script Source Code. If Client fails to provide Cerner    *
 *     with notice and a copy of the modified Script Source Code, Cerner *
 *     shall have no liability or responsibility for costs, expenses,    *
 *     claims or damages for failure of the scripts to function properly *
 *     and/or without interruption.                                      *
 * 4. Limitations                                                        *
 *  A. Client acknowledges and agrees that once the Script Source Code is*
 *     modified, any warranties set forth in the Agreement between Cerner*
 *     and Client shall not apply.                                       *
 *  B. Cerner assumes no responsibility for any adverse impacts which the*
 *     modified Script Source Code may cause to the functionality or     *
 *     performance of Client's System.                                   *
 *  C. Client waives, releases, relinquishes, and discharges Cerner from *
 *     any and all claims, liabilities, suits, damages, actions, or      *
 *     manner of actions, whether in contract, tort, or otherwise which  *
 *     Client may have against Cerner, whether the same be in            *
 *     administrative proceedings, in arbitration, at law, in equity, or *
 *     mixed, arising from or relating to Client's use of Script Source  *
 *     Code.                                                             *
 * 5. Retention of Ownership                                             *
 *    Cerner retains ownership of all software and source code in this   *
 *    service package. Client agrees that Cerner owns the derivative     *
 *    works to the modified source code. Furthermore, Client agrees to   *
 *    deliver the derivative works to Cerner.                            *
 ~BE~************************************************************************/
/******************************************************************************

 Source file name:       dc_mp_js_util_popup.js

 Product:                Discern Content
 Product Team:           Discern Content

 File purpose:           Provides the UtilPopup class with methods
 to attach Popups and Hovers to DOM elements.

 Special Notes:          <add any special notes here>

 ;~DB~**********************************************************************************
 ;*                      GENERATED MODIFICATION CONTROL LOG                    		  *
 ;**************************************************************************************
 ;*                                                                            		  *
 ;*Mod Date     Engineer             		Feature      Comment                      *
 ;*--- -------- -------------------- 		------------ -----------------------------*
 ;*000 		   RB018070				    	######       Initial Release              *
 ;~DE~**********************************************************************************
 ;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************/
/**
 * @author RB018070
 * Reference
 * attachHover - parameter format
 * 	 {	"elementDOM": "Reference to the DOM element to attach hover behavior to",
 "event": "elementDOM event to trigger hover behavior",
 "content": "Display content for the hover"
 }
 *
 * attachPopup - parameter format
 * 	 {	"elementDOM": "Reference to the DOM element to attach Popup behavior to",
 "event": "elementDOM event to trigger popup behavior",
 "width": "Width of the popup",
 "defaultpos": ["Top Corner position", "Left Corner Position"],
 "exit": "Display string for the popup exit button",
 "header": "Display string for the popup header",
 "content": "Display content for the popup",
 "displayTimeout": "Timeout before displaying the hover"
 }
 *
 */
var UtilPopup = ( function() {
	var hoverPopupDOM = Util.cep("div", {
		"className": "popup_hover"
	})
	, dragObj = {}
	, popupDOM = null
	, modalPopup = null
	, popupHeaderTextDOM = null
	, popupHeaderWrapDOM = null
	, popupHeaderDragDOM = null
	, popupContentDOM = null
	, popupHeaderExitDOM = null
	, popupConfirmButtonsWrapDOM = null
	,hideHoverFnc
	,displayTimeOut
	,hideTimeOut
	,currentDragNode = null
	,currentDragCloneNode = null
	,dragTimeOut;
	var dragHolderNode = null;
	function UtilPopup_mpo(e) {
		var posx = 0;
		var posy = 0;
		if (!e)
			var e = window.event;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft +
			document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop +
			document.documentElement.scrollTop;
		}
		return [posy, posx];
	}

	function modalWindow(contents) {
		var that = "", iBlockr = "", windowGeometry = "", shim = "", iebody = "", dsocleft = 0, dsoctop = 0, blockrHeight = 0, mcontents = contents;
		//Determining document scroll offset coordinates (DSOC)
		//	var browserName = getBrowserName();

		//Verify which web browser that is used.
		//switch(browserName.toLowerCase()){
		//case "firefox":
		//	dsocleft = window.pageXOffset;
		//	dsoctop = window.pageYOffset;
		//	break;
		//case "msie":
		//If your page uses a doctype at the top of the page that causes IE6 to go into standards compliant mode (ie: XHTML strict),
		//the way to accessing the DSOC properties in IE6 changes, namely, from document.body to document.documentElement.
		//This means is that whenever you're referencing the DSOC properties, your code should take into account the
		//possibility of IE6 strict mode, and choose between document.documentElement and document.body, respectively.
		iebody = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
		dsocleft = document.all ? iebody.scrollLeft : pageXOffset;
		dsoctop = document.all ? iebody.scrollTop : pageYOffset
		//break;
		//}
		//Create a reference to self.
		that = this;
		//Make the mcontents object hidden but rendered so I can measure it's size.
		mcontents.style.visibility = "hidden";

		//Get the size of the mcontents div.
		this.width = mcontents.offsetWidth;
		this.height = mcontents.offsetHeight;

		//First create a semi-transparent input blocker to cover the page.
		iBlockr = Util.cep("div", {
			"id": "div-iBlockr",
			"className": "popup-modal-background"
		});
		setOpacity(iBlockr, 0.3); // Make it semi-transparent.
		//Get the size of the document and window and use it to size the input blocker.
		windowGeometry = getWindowGeometry();
		//iBlockr.style.width = windowGeometry.bodyWidth + "px";
		//Note: 600 is added so the "grey area" is longer.
		blockrHeight = parseInt(windowGeometry.bodyHeight);
		iBlockr.style.height = blockrHeight + "px";
		Util.ac(iBlockr, document.body);
		//This function will display the window.
		this.display = function() {
			//Make this window a singleton and keep a global reference.
			window.currentModalWindow = that;
			//Attach the modal input blocker to the document.
			iBlockr.style.display = "";
			mcontents.style.display = "";
			iBlockr.style.visibility = "visible";
			mcontents.style.visibility = "visible";
			mcontents.style.zIndex = 3000;
		}
		//This will eradicate the modal window.
		this.hide = function() {
			//Hide the content window.
			iBlockr.style.display = "none";
			mcontents.style.display = "none";
			iBlockr.style.visibility = "hidden";
			mcontents.style.visibility = "hidden";
			window.currentModalWindow = null;
		}
	}

	function setOpacity(elRef, value) {
		//Value should be between 0 and 1.
		//W3C browsers and IE7+
		elRef.style.opacity = value;
		//Older versions of IE
		elRef.style.filter = 'alpha(opacity=' + Math.round(value * 100) + ')';

	}

	function getWindowGeometry() {
		var doc = "", browserWidth = "", browserHeight = "", bodyWidth = "", bodyHeight = "", scrollX = "", scrollY = "";

		try {
			doc = (!document.compatMode || document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;
			if (window.innerWidth) {
				//Most Browsers
				browserWidth = window.innerWidth;
				browserHeight = window.innerHeight;
			} else {
				//IE
				browserWidth = doc.clientWidth;
				browserHeight = doc.clientHeight;
			}
			bodyWidth = Math.max(doc.scrollWidth, browserWidth);
			bodyHeight = Math.max(doc.scrollHeight, browserHeight);

			scrollX = (bodyWidth > browserWidth);
			scrollY = (bodyHeight > browserHeight);
		} catch (error) {
			showErrorMessage(error.message, "getWindowGeometry");
		}
		return {
			windowWidth: browserWidth,
			windowHeight: browserHeight,
			bodyWidth: bodyWidth,
			bodyHeight: bodyHeight,
			scrollX: scrollX,
			scrollY: scrollY
		};
	}

	function dragStart(e, domObj) {
		var el, x, y, e, startMousePosition = UtilPopup_mpo(e);
		if (!e)
			e = window.event;
		dragObj.elNode = domObj;
		x = UtilPopup_mpo(e);
		y = x[0];
		x = x[1];
		dragObj.cursorStartX = x;
		dragObj.cursorStartY = y;
		dragObj.elStartLeft = dragObj.elNode.offsetLeft;
		dragObj.elStartTop = dragObj.elNode.offsetTop;

		document.onmousemove = dragGo;
		document.onmouseup = dragStop;
		Util.cancelBubble(e);
		return false;
	}

	function dragGo(e) {
		var mpos,x, y, e;
		if (!e)
			e = window.event;
		mpos = UtilPopup_mpo(e);
		y = mpos[0];
		x = mpos[1];
		dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
		dragObj.elNode.style.top = (dragObj.elStartTop + y - dragObj.cursorStartY) + "px";
		checkDropContainers(mpos);
		Util.cancelBubble(e);
	}

	function dragStop(e) {
		try {
			if (!e)
				e = window.event;
			var deleteNode;
			if (dragTimeOut && dragTimeOut != null) {
				clearTimeout(dragTimeOut);
			}

			// handler drag Nodes without any
			if (currentDragNode != null && dragHolderNode == null) {
				Util.de(currentDragNode);
				currentDragNode = null;
			} else if (dragHolderNode != null && currentDragNode != null) {
				currentDragNode.style.position = "relative";
				currentDragNode.style.top = "0px";
				currentDragNode.style.left = "0px";
				currentDragNode.style.width = "100%";
				currentDragNode.style.height = "auto";
				Util.removeEvent(currentDragNode, "mousedown", draggableHandlerFunction);
				deleteNode = Util.ce("div");
				deleteNode.innerHTML = "x";
				deleteNode.style.top = "0px";
				deleteNode.style.right = "2px";
				deleteNode.style.position = "absolute";
				deleteNode.style.fontWeight = "bold";
				deleteNode.style.display = "block";
				deleteNode.title = "Click to remove item.";
				deleteNode.style.cursor = "hand";
				Util.addEvent(deleteNode, "click", function(e2) {
					Util.de(Util.gp(deleteNode));
				});
				currentDragNode.style.cursor = "default";
				deleteNode = Util.ac(deleteNode, currentDragNode);
				Util.ia(currentDragNode, dragHolderNode);
				Util.de(dragHolderNode);
				dragHolderNode = null;
			}

			currentDragNode = null;

			document.onmousemove = function(e) {
			};
			document.onmouseup = function(e) {
			};
			Util.cancelBubble(e);
		} catch(err) {
			alert(err.message+"--> UtilPopup.dragStop");
		}
	}

	function displayModalPopup(popPrefs,popupType) {
		var popupConfirmYesDOM,popupConfirmNoDOM,pageHeightWidth = Util.Pos.gvs();
		
		if (popupDOM != null) { // Popup type
			Util.de(popupDOM);	
		
		}
			popupDOM = Util.cep("div", {
				"className": "popup-modal"
			});
			popupContentDOM = Util.cep("div", {
				"className": "popup-modal-content"
			});

			popupHeaderWrapDOM = Util.cep("span", {
				"className": "popup-modal-header-wrapper"
			});
			popupHeaderTextDOM = Util.cep("span", {
				"className": "popup-modal-header-text",
				"title": "Click and Hold to move popup"
			});
			popupHeaderExitDOM = Util.cep("span", {
				"className": "popup-modal-header-exit",
				"title": "Click to close popup"
			});
			
			popupConfirmButtonsWrapDOM = Util.cep("span", {
				"className": "popup-modal-buttons-wrapper"
			});
			
			popupConfirmYesDOM	= Util.cep("input",{"type":"button","value":"Yes","className": "popup-modal-button"});
			popupConfirmNoDOM	= Util.cep("input",{"type":"button","value":"No","className": "popup-modal-button"});

			modalPopup = new modalWindow(popupDOM);

			if(popupType == "MODAL_POPUP") {
				popupHeaderTextDOM = Util.ac(popupHeaderTextDOM, popupHeaderWrapDOM);
				popupHeaderExitDOM = Util.ac(popupHeaderExitDOM, popupHeaderWrapDOM);
				popupHeaderWrapDOM = Util.ac(popupHeaderWrapDOM, popupDOM);

				popupContentDOM = Util.ac(popupContentDOM, popupDOM);
				popupHeaderExitDOM.onclick = function() {
					modalPopup.hide();
				}
				if (popPrefs.exitFnc) {
					popupHeaderExitDOM.onclick = function() {
						modalPopup.hide();
						popPrefs.exitFnc;
					}
				}
				Util.addEvent(popupHeaderTextDOM, "mousedown", function(e) {
					dragStart(e, popupDOM)
				});
			}
			else if (popupType == "MODAL_CONFIRM") {
				popupHeaderTextDOM = Util.ac(popupHeaderTextDOM, popupHeaderWrapDOM);
				popupHeaderTextDOM.style.width = "100.00%";
				popupHeaderWrapDOM = Util.ac(popupHeaderWrapDOM, popupDOM);
				popupConfirmNoDOM = Util.ac(popupConfirmNoDOM,popupConfirmButtonsWrapDOM);
				popupConfirmYesDOM = Util.ac(popupConfirmYesDOM,popupConfirmButtonsWrapDOM);
				if(popPrefs.yes_no && popPrefs.yes_no.length > 0){
					if(popPrefs.yes_no[0]){
						popupConfirmYesDOM.value = popPrefs.yes_no[0];
					}
					if(popPrefs.yes_no[1]){
						popupConfirmNoDOM.value = popPrefs.yes_no[1];
					}
				}
				
				popupConfirmYesDOM.onclick = function(){
					modalPopup.hide();
					popPrefs.onconfirm(true);
				}	
				popupConfirmNoDOM.onclick = function(){
					modalPopup.hide();
					popPrefs.onconfirm(false);
				}	
				popupContentDOM = Util.ac(popupContentDOM, popupDOM);		
				popupConfirmButtonsWrapDOM = Util.ac(popupConfirmButtonsWrapDOM, popupDOM);
			}
			else{				
				popupContentDOM = Util.ac(popupContentDOM, popupDOM);
			}
			
			Util.ac(popupDOM, document.body);
		
		if (popupType == "MODAL_POPUP") { // Popup type
			popupHeaderTextDOM.innerHTML = (popPrefs.header) ? popPrefs.header : "&nbsp;";
			popupHeaderExitDOM.innerHTML = (popPrefs.exit) ? popPrefs.exit : "x";
		}
		
		if (popupType == "MODAL_CONFIRM") {
			popupHeaderTextDOM.innerHTML = (popPrefs.header) ? popPrefs.header : "&nbsp;";
		}
		
		
		if (popPrefs.defaultpos) {
			if (popPrefs.defaultpos[0]) {
				popupDOM.style.top = popPrefs.defaultpos[0]
			}
			if (popPrefs.defaultpos[1]) {
				popupDOM.style.left = popPrefs.defaultpos[1]
			}
		}
		
		if (popPrefs.width) {
			popupDOM.style.width = popPrefs.width
		}
		
		var popchildNodes = Util.gcs(popupContentDOM),popchildNodeslen = popchildNodes.length,idx = 0 ;
		if(popupContentDOM.innerHTML > "") {
			for (idx = 0; idx < popchildNodeslen; idx++) {
				Util.de(popchildNodes[idx])
			}
			popupContentDOM.innerHTML = " ";
		}
		if (popPrefs.content) {
			popupContentDOM.innerHTML = popPrefs.content;
		}
		if (popPrefs.contentDOM) {

			Util.ac(popPrefs.contentDOM,popupContentDOM);
		}
		
		if (popPrefs.position
				&& popPrefs.position.toUpperCase() == "CENTER") {
			popupDOM.style.top = ((Math.floor(parseInt(pageHeightWidth[0],10)/2) - Math.floor(parseInt(popupDOM.offsetHeight,10)/2)))+"px";
			popupDOM.style.left = ((Math.floor(parseInt(pageHeightWidth[1],10)/2) - Math.floor(parseInt(popupDOM.offsetWidth,10)/2)))+"px";
		}		
		modalPopup.display();
	}

	function draggableHandler(e) {
		try {
			var pos, childNodes, index, childNodesLength, childCloneNode, targ, dragNode;
			if (e.target)
				targ = e.target;
			else if (e.srcElement)
				targ = e.srcElement;
			if (targ.nodeType == 3) {// defeat Safari bug
				targ = targ.parentNode;
			}
			while (targ.className.indexOf("draggable-element") == -1 && targ != null) {
				targ = Util.gp(targ)
			}
			if (targ != null) {
				dragNode = targ;
				// draggable without clone node
				if (dragNode.className.indexOf("draggable-clone") == -1) {
					dragHolderNode = Util.ce("div")
					dragHolderNode.style.width = "100.00%";
					dragHolderNode.style.height = "auto";
					dragHolderNode.style.border = "1px dashed #000000";
					dragHolderNode.className = dragNode.className;
					Util.ia(dragHolderNode, dragNode);
				} else {
					currentDragCloneNode = Util.ce(dragNode.tagName);
					currentDragCloneNode.style.width = "100.00%";
					currentDragCloneNode.style.height = "auto";
					currentDragCloneNode.className = dragNode.className;
					childNodes = Util.gcs(dragNode);
					index = 0;
					childNodesLength = childNodes.length;
					while (index < childNodesLength) {
						childCloneNode = childNodes[index].cloneNode(true);
						/*
						 * if this is MSIE 6/7, then we need to copy the innerHTML to
						 * fix a bug related to some form field elements
						 */
						if (!!document.all && childCloneNode.tagName.toUpperCase() != "TABLE")
							childCloneNode.innerHTML = childNodes[index].innerHTML;

						Util.ac(childCloneNode, currentDragCloneNode);
						index += 1;
					}
					Util.addEvent(currentDragCloneNode, "mousedown", draggableHandlerFunction);
					Util.ia(currentDragCloneNode, dragNode);
				}
				dragNode.style.width = dragNode.offsetWidth + "px";
				dragNode.style.height = dragNode.offsetHeight + "px";
				dragNode.style.zIndex = 99999;
				dragNode.style.position = "absolute";
				dragNode.style.display = "block";
				dragNode.className = dragNode.className;
				pos = UtilPopup_mpo(e);
				// not draggable inside parent => add to body
				if (dragNode.className.indexOf("draggable-inside-parent") == -1) {
					dragNode = Util.ac(dragNode, document.body);

				}
				dragNode.style.top = (pos[0] - (dragNode.offsetHeight / 2)) + "px";
				dragNode.style.left = (pos[1] - (dragNode.offsetWidth / 2)) + "px";
				currentDragNode = dragNode;
				dragStart(e, dragNode);
				//	Util.preventDefault(e);
			}

		} catch (err) {
			alert(err.message+"--> UtilPopup.draggableHandler");
		}
	}

	function draggableHandlerFunction(e) {
		if (!e) {
			var e = window.event;
		}
		var eventCopy = {};
		for (var i in e) {
			eventCopy[i] = e[i];
		}
		dragTimeOut = setTimeout( function() {
			draggableHandler(eventCopy);
		},500);
	}

	function checkDropContainers(mousepos) {
		var droppableContainers = Util.Style.g("droppable-container")
		,droppableLength = droppableContainers.length
		,index
		,dims;
		index = 0;
		while(index < droppableLength) {
			dims = Util.Pos.gop(droppableContainers[index]);
			dims[2] = dims[0]+droppableContainers[index].offsetHeight;
			dims[3] = dims[1]+droppableContainers[index].offsetWidth;
			if(mousepos[0]  >= dims[0] &&  mousepos[0]  <= dims[2]
			&& mousepos[1]  >= dims[1] &&  mousepos[1]  <= dims[3]) {
				break;
			} else {
				index += 1;
			}
		}
		if (index < droppableLength) {
			dropContainer = droppableContainers[index];
			if (!e)
				var e = window.event;
			if (currentDragNode != null) {
				if (dragHolderNode != null) {
					Util.de(dragHolderNode);
				}
				dragHolderNode = Util.ce("div")
				dragHolderNode.style.width = dropContainer.offsetWidth + "px";
				dragHolderNode.style.height = currentDragNode.offsetHeight + "px";
				dragHolderNode.style.top = "0px";
				dragHolderNode.style.left = "0px";
				dragHolderNode.style.border = "1px dashed #000000";
				Util.ac(dragHolderNode, dropContainer);
			}
		}
	}

	// return API
	return {
		getDragTimeOut: function() {
			return(dragTimeOut);
		},
		attachHover: function(hvrPrefs) {
			try {
				var objDOM = hvrPrefs.elementDOM, hoverAlign = hvrPrefs.align, objDOMPos = Util.Pos.gop(objDOM), objDOMScrollOffsets = hvrPrefs.scrolloffsets, offsets = hvrPrefs.offsets, position = hvrPrefs.position, dimensions = hvrPrefs.dimensions, showHoverFnc, hvrOutFnc = hvrPrefs.hvrOutFnc, hvrTxt = hvrPrefs.content, hvrTxtDOM = hvrPrefs.contentDOM, hvrRef = hvrPrefs.contentRef, stickyTimeOut = hvrPrefs.stickyTimeOut, displayHvr = hvrPrefs.displayHvr, stickyOut;
				if (objDOMScrollOffsets && objDOMScrollOffsets.length === 2) {
					objDOMPos[0] = objDOMPos[0] - objDOMScrollOffsets[0];
					objDOMPos[1] = objDOMPos[1] - objDOMScrollOffsets[1];
				}

				hideHoverFnc = function(e) {
					// clear any display timeout
					clearTimeout(displayTimeOut);
					// clear any hide timeout
					clearTimeout(hideTimeOut);
					hoverPopupDOM.style.visibility = "hidden";
					hoverPopupDOM.style.display = "none";
					if (hvrRef) {
						hvrRef.innerHTML = hoverPopupDOM.innerHTML;
					}
					if (hvrOutFnc) {
						hvrOutFnc();
					}
					Util.cancelBubble(e);
				}
				if (hvrTxt > "" || hvrRef || hvrTxtDOM) {
					showHoverFnc = function(e,mousePosition) {

						if (!e) {
							e = window.event;
						}
						var curMousePosition, curWindowDim = Util.Pos.gvs(), curMaxHeight, curMaxWidth;
						if(!mousePosition || mousePosition == [] || mousePosition.length == 0) {
							curMousePosition = UtilPopup_mpo(e);
						} else {
							curMousePosition = mousePosition;
						}

						if (hoverPopupDOM.parentNode == null) {
							hoverPopupDOM = Util.ac(hoverPopupDOM, document.body);
						}
						hoverPopupDOM.style.display = "block";
						//	if(hvrTxtDOM){
						//		Util.de(hvrTxtDOM,hoverPopupDOM);
						//	}
						if (hoverPopupDOM.innerHTML > "") {
							Util.de(Util.gcs(hoverPopupDOM)[0])
						}

						x = curMousePosition[1];
						y = curMousePosition[0];
						hoverPopupDOM.style.width = "auto";
						hoverPopupDOM.style.height = "auto";
						if (hvrRef) {
							hoverPopupDOM.innerHTML = hvrRef.innerHTML;
						} else if (hvrTxt) {
							hoverPopupDOM.innerHTML = hvrTxt;
						} else {
							hoverPopupDOM.innerHTML = "";
							hvrTxtDOM = Util.ac(hvrTxtDOM, hoverPopupDOM);
						}
						if (dimensions) {
							hoverPopupDOM.style.width = dimensions[1] ? (dimensions[1] + "px") : "auto";
							hoverPopupDOM.style.height = dimensions[0] ? (dimensions[0] + "px") : "auto";
						}
						if (hoverPopupDOM.offsetHeight > curWindowDim[0] - 50) { // longer than screen height
							curMaxHeight = (y - hoverPopupDOM.offsetHeight > y) ? y - hoverPopupDOM.offsetHeight : y;
							hoverPopupDOM.style.height = (curMaxHeight - 10) + "px";
						}
						if (hoverPopupDOM.offsetWidth > curWindowDim[1] - 50) { // wider than screen width
							curMaxWidth = (x - hoverPopupDOM.offsetWidth > x) ? x - hoverPopupDOM.offsetWidth : x;
							hoverPopupDOM.style.width = (curMaxWidth - 10) + "px";
						}
						if (!offsets) {
							offsets = [0, 0]
						}
						if (position && position.length == 2) {
							x += position[1];
							y += position[0];
						} else {
							if (y < hoverPopupDOM.offsetHeight && x > hoverPopupDOM.offsetWidth) // top-right edges of screen
							{
								y += 5 + offsets[0];
								x = (x - hoverPopupDOM.offsetWidth - 5 - offsets[1]);
							} else if (y > hoverPopupDOM.offsetHeight && x < hoverPopupDOM.offsetWidth) // bottom-left edges of screen
							{
								y = (y - hoverPopupDOM.offsetHeight - 5 - offsets[0]);
								x += 5 + offsets[1];
							} else if (y > hoverPopupDOM.offsetHeight && x > hoverPopupDOM.offsetWidth) // bottom-right edges of screen
							{
								y = (y - hoverPopupDOM.offsetHeight - 5 - offsets[0]);
								x = (x - hoverPopupDOM.offsetWidth - 5 - offsets[1]);
							} else { // top-left edges of screen
								y += 5 + offsets[0];
								x += 5 + offsets[1];
							}
						}
						if (hoverAlign) {
							switch (hoverAlign) {
								case "up-horizontal":
									x = (objDOMPos[1]) ;
									if (hoverPopupDOM.offsetHeight > objDOMPos[0]) {
										y = 0;
										hoverPopupDOM.style.height = (objDOMPos[0] - 5);
									} else {
										y = (objDOMPos[0] - hoverPopupDOM.offsetHeight);
									}
									break;
								case "down-horizontal":
									x = (objDOMPos[1]);
									if (hoverPopupDOM.offsetHeight > objDOMPos[0]) {
										y = 0;

									} else {
										y = (objDOMPos[0] - hoverPopupDOM.offsetHeight);
									}
									break;

							}
						}
						hoverPopupDOM.style.top = (y) + "px";
						hoverPopupDOM.style.left = (x) + "px"
						hoverPopupDOM.style.visibility = "visible";
					};
					if (displayHvr === undefined) {
						if(hvrPrefs.displayTimeOut > " ") {
							hvrPrefs.displayTimeOut = parseInt(hvrPrefs.displayTimeOut,10)
						} else {
							hvrPrefs.displayTimeOut = 0
						}
						// No display timeout => regular event
						if(hvrPrefs.displayTimeOut == 0) {
							Util.addEvent(objDOM, hvrPrefs.event, function(showHoverEvent) {
								showHoverFnc(showHoverEvent,[]);
							});
						}
						// Display timeout
						else {
							Util.addEvent(objDOM, hvrPrefs.event, function(showHoverEvent) {
								if (!showHoverEvent) {
									showHoverEvent = window.event;
								}
								var mousePosition = UtilPopup_mpo(showHoverEvent);
								// clear any display timeout
								clearTimeout(displayTimeOut);
								displayTimeOut = setTimeout( function() {
									showHoverFnc(showHoverEvent,mousePosition);
								},hvrPrefs.displayTimeOut);
							});
						}
					} else {
						showHoverFnc(displayHvr,[]);
					}

					//Sticky Hover
					if (hvrPrefs.sticky && (hvrPrefs.sticky == 1 || hvrPrefs.sticky == true)) {
						if (!displayHvr) {
							stickyOut = "mouseleave";
							stickyTimeOut = (stickyTimeOut && parseInt(stickyTimeOut) > 0) ? stickyTimeOut : 200;
							Util.addEvent(objDOM, "mouseleave", function(mouseLeaveEvent) {
								hideTimeOut = setTimeout(hideHoverFnc, stickyTimeOut);
								Util.cancelBubble(mouseLeaveEvent);
								Util.preventDefault(mouseLeaveEvent);
							});
						}
						Util.addEvent(hoverPopupDOM, "mouseenter", function(mouseEnterEvent) {
							clearTimeout(hideTimeOut);
							Util.addEvent(hoverPopupDOM, "mouseleave", hideHoverFnc);
							Util.cancelBubble(mouseEnterEvent);
							Util.preventDefault(mouseEnterEvent);
						});
					}
					//Plain Old Hover
					else {
						Util.addEvent(objDOM, "mouseout", hideHoverFnc);
					}
				}

			} catch (err) {
				alert(err.message+"--> UtilPopup.attachHover");
			}
		},
		attachModalPopup: function(popPrefs) {
			var that = this;
			Util.addEvent(popPrefs.elementDOM, popPrefs.event, function() {
				displayModalPopup(popPrefs,"MODAL_POPUP");
			});
		},
		hideHover : function(e) {
			// clear any display timeout
			clearTimeout(displayTimeOut);
			// clear any hide timeout
			clearTimeout(hideTimeOut);
			hoverPopupDOM.style.visibility = "hidden";
			hoverPopupDOM.style.display = "none";
			if (e != null && e != undefined) {
				Util.cancelBubble(e);
			}
		},
		launchModalPopup : function(popPrefs) {
			displayModalPopup(popPrefs,"MODAL_POPUP");
		},
		launchModalDialog : function(popPrefs) {
			displayModalPopup(popPrefs,"MODAL_DIALOG");
		},
		launchModalConfirmPopup: function(popPrefs) {
			displayModalPopup(popPrefs,"MODAL_CONFIRM");
		},
		closeModalDialog : function() {
			modalPopup.hide();
			popupDOM = null;
		},
		closeModalPopup: function() {
			modalPopup.hide();
		},
		initializeDragDrop: function(parentNode) {
			if(!parentNode) {
				parentNode = document.body;
			}
			var draggableElements = Util.Style.g("draggable-element",parentNode)
			,draggableLength = draggableElements.length
			,index;
			index = 0;
			document.onmousemove = function(e) {
			};
			document.onmouseup = function(e) {
			};
			while(index < draggableLength) {
				Util.addEvent(draggableElements[index], "mousedown", draggableHandlerFunction);
				/*	Util.addEvent(draggableElements[index], "mouseup", function(){
				 if (dragTimeOut && dragTimeOut != null) {
				 clearTimeout(dragTimeOut);
				 }
				 });*/
				index += 1;
			}

		}
	}
}());