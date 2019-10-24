function DischargeOrdersComponentStyle()
/**
* @class
*/
{
	this.initByNamespace("dishord");
}
/**
* @class
*/
DischargeOrdersComponentStyle.inherits(ComponentStyle);

function DischargeOrdersComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new DischargeOrdersComponentStyle());
	this.setComponentLoadTimerName("USR:MPG.DISCH_ORDERS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.DISCH_ORDERS.O1 - render component");
	this.setIncludeLineNumber(true);
	this.setScope(2);
	
	DischargeOrdersComponent.method("InsertData", function(){
		CERN_DISCH_ORDERS_O1.GetOrdersTable(this);
	});
	DischargeOrdersComponent.method("HandleSuccess", function(recordData){
		CERN_DISCH_ORDERS_O1.RenderComponent(this, recordData);
		 
	});
	DischargeOrdersComponent.method("setCatalogCodes", function(value){
		this.m_catalogCodes = value;
	});
	DischargeOrdersComponent.method("addCatalogCode", function(value){
		if(this.m_catalogCodes == null){
			this.m_catalogCodes = [];
		}
		this.m_catalogCodes.push(value);		
	});
	DischargeOrdersComponent.method("getCatalogCodes", function(){
		if (this.m_catalogCodes != null){
			return this.m_catalogCodes;
		}
		return this.m_catalogCodes;
	});
		
	DischargeOrdersComponent.method("openTab", function(){
		var criterion = this.getCriterion();
		
		var params = [criterion.person_id, ".0|", criterion.encntr_id, ".0|"];
		params.push("{ORDER|0|0|0|0|0}"); 
		params.push("|0|{2|127}|8");  
		MP_Util.LogMpagesEventInfo(this, "ORDERS", params.join(""), "dischargeorders.js", "openTab");
		MPAGES_EVENT("ORDERS", params.join(""));
		this.InsertData();
	});
}
DischargeOrdersComponent.inherits(MPageComponent);

var CERN_DISCH_ORDERS_O1 = function(){
/**
* @namespace
*/
	function OrderDateSort(a, b) {
		if (a.ORIG_ORDER_DT_TM > b.ORIG_ORDER_DT_TM) {
			return -1;
		} else if (a.ORIG_ORDER_DT_TM < b.ORIG_ORDER_DT_TM) {
			return 1;
		}
		return 0;
	}
	
	function appendDropDown(preSec, component, recdata, contentPath) {
        if (preSec != "dishord") {
            return;
        }
        pre = component.getStyles().getId();
        if ((_g(pre + "Drop") != null) && _g(pre + "Menu") != null) {
            return; //already defined
        }
        var img = Util.cep("img", { 'src': contentPath + '/images/3943_16.gif' });
        var link = Util.cep("a", { 'className': 'drop-Down', 'id': pre + 'Drop' });
        var menu = Util.cep("div", { 'id': pre + 'Menu', 'className': 'form-menu menu-hide' });
        Util.ac(img, link);
        var sec = _g(component.getStyles().getId());

        var secCL = Util.Style.g("sec-title", sec, "span");
        var secSpan = secCL[0]; 
        Util.ac(link, secSpan);
        Util.ac(menu, secSpan);
        loadDropDown(recdata, component);
    }
	
    function loadDropDown(recdata, component) {
    	var jsonRecdata = null;
    	try {
            jsonRecdata = recdata; 
        }
        catch (err) {
            alert(err.description);
        }
        var docDropId = component.getStyles().getId() + "Drop";
        var docDrop = _g(docDropId); 
        var htmlStr = [];
        var numId = 0;
        var ordRec = jsonRecdata.DISCH_ORDERABLES; 

        if (ordRec[0] === null) {
            htmlStr.push('<div>', i18n.DOCUMENT_FAVS, '<span class="favHidden" id="docCKI', numId, '">', ' ', '</span></div>');
        }
        else {
            var crit = component.getCriterion();
            for (var j = 0, l = ordRec.length; j < l; j++) {
                var rec = ordRec[j];
                
                numId = numId + 1;
                htmlStr.push('<div><a id="doc', numId, '" href="#">', rec.ORDER_DISPLAY, '</a>',  //disp
					'<span class="favHidden" id="docCKI', numId, '">', rec.SYNONYM_ID, '</span>', //store synonym_id to be used later to default order to scratchpad
					'<span class="favHidden" id="docStyleID', numId, '">', component.getStyles().getId(), '</span>',
					'</div>');
            }
        }
		
        var ddarray = htmlStr.join('');
        var newSpan = Util.cep('span');
        newSpan.innerHTML = ddarray;
        var docMenuId = component.getStyles().getId() + "Menu";
        var docMenu = _g(docMenuId);
        Util.ac(newSpan, docMenu);

        //doc more add options
        var docMenuList = _gbt('a', docMenu);
        var dmLen = docMenuList.length;
        for (var i = dmLen; i--; ) {
            Util.addEvent(docMenuList[i], "click", addDocDet);
        }
        //set up menu close
        closeMenuInit(docMenu, component.getStyles().getId());
        //set up doc flyout menu
        Util.addEvent(docDrop, "click",
			function() {
			    if (Util.Style.ccss(Util.gns(this), "menu-hide")) {
			        _g(component.getStyles().getId()).style.zIndex = 2; //'doc'
			        Util.preventDefault();
			        Util.Style.rcss(Util.gns(this), "menu-hide");
			    }
			    else {
			        _g(component.getStyles().getId()).style.zIndex = 1; //'doc'
			        Util.Style.acss(Util.gns(this), "menu-hide");
			    }

			}
		);
    }

    function addDocDet() {
        var menuVal = Util.gns(this); 
        var synonymId = menuVal.firstChild.data;
        var spanDocStyleID = Util.gns(menuVal);
        var comp = null;
        //get the exact component from global array
        for (var x = 0, xl = CERN_MPageComponents.length; x < xl; x++) {
            comp = CERN_MPageComponents[x];
		    var styles = comp.getStyles();
            if (styles.getId() == spanDocStyleID.firstChild.data) {
                break;
            }
        }
        var crit = comp.getCriterion();
		
		var params = [crit.person_id, ".0|", crit.encntr_id, ".0|"];
		params.push("{ORDER|" + synonymId + "|0|0|0|0}"); 
		params.push("|24|{2|127}{3|127}|32|1");
		MP_Util.LogMpagesEventInfo(comp, "ORDERS", params.join(""), "dischargeorders.js", "addDocDet");
		MPAGES_EVENT("ORDERS", params.join(""));
        CERN_DISCH_ORDERS_O1.GetOrdersTable(comp);
    }

    function closeMenuInit(inMenu, compId) {
        var menuId;
        var docMenuId = compId + "Menu";
        
        function menuLeave(e) {
            if (!e){
            	var e = window.event;
            }
            var relTarg = e.relatedTarget || e.toElement;
            if (e.relatedTarget.id == inMenu.id) {
                Util.Style.acss(inMenu, "menu-hide");
                _g(menuId).style.zIndex = 1;
            }
            e.stopPropagation();
            Util.cancelBubble(e);
        }        
        
        if (inMenu.id == docMenuId) {
            menuId = compId;
        }
        if (!e){
        	var e = window.event;
        }
        if (window.attachEvent) {
            Util.addEvent(inMenu, "mouseleave", function() {
                Util.Style.acss(inMenu, "menu-hide");
                _g(menuId).style.zIndex = 1;
            });
        }
        else {
            Util.addEvent(inMenu, "mouseout", menuLeave);
        }
    }	

    return {
        GetOrdersTable : function(component){
			var sendAr = [];
			var criterion = component.getCriterion();
			sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0");
			var codes = component.getCatalogCodes(); 
			var catCd = (codes && codes.length > 0) ? codes : null;
			if (catCd){
				sendAr.push("value(" + catCd.join(",") + ")");
			}
			else{
				sendAr.push("0");
			}
			sendAr.push(criterion.provider_id + ".0", criterion.ppr_cd + ".0");
			MP_Core.XMLCclRequestWrapper(component, "mp_retrieve_disch_orders", sendAr, true);
        },
        RenderComponent: function(component, recordData){
		
			try{
				var countText = "";
				var ordHTML = "";
				var jsORDHTML = [];
                var jsOrdSec = [];
                var jsDiscSec = [];
                var discCount = 0;
                var ordCount = 0;
				var isPlusAddEnabled = component.isPlusAddEnabled();
                var tableBody = [];
                var ordItem = [];
				if (recordData.ORDERS.length === 0){	
					ordItem.push(i18n.NO_RESULTS_FOUND);
					ordHTML = ordItem.join("");
					countText = "(0)";	
				}
				
				else {
					var ordLen = recordData.ORDERS.length;
					recordData.ORDERS.sort(OrderDateSort);
					
					jsORDHTML.push("<div class='",MP_Util.GetContentClass(component, ordLen),"'>");
					for (var j=0;j<ordLen;j++) {
						var orders = recordData.ORDERS[j];
						var ordName = "", ordDate = "", statusTypeDisp = "", orderDetails = "";
						ordItem = [];
						var dateTime = new Date();
						if (orders) 
						{
							dateTime.setISO8601(orders.ORIG_ORDER_DT_TM);
							ordDate = dateTime.format("longDateTime3");
							
							statusTypeDisp = orders.ORDER_STATUS;
							orderDetails = orders.ORDER_DETAIL;
						}
						
						if (orders.ORDER_DISPLAY) {
							ordName = orders.ORDER_DISPLAY;
						}
	
						ordItem.push("<dl class='dishord-info'><dd class= 'dishord-name'>", ordName,"</dd></dl><h4 class='dishord-det-hd'><span>", 
							"</span></h4><div class='hvr'><dl class='dishord-det'><dt><span>", 
							i18n.ORDER_NAME, ":</span></dt><dd class='dishord-det-dt'><span>", ordName, "</span></dd><dt><span>", 
							i18n.ORDER_DETAILS, ":</span></dt><dd class='dishord-det-dt'><span>", orderDetails, "</span></dd><dt><span>",
							i18n.ORDER_DATE, ":</span></dt><dd class='dishord-det-dt'><span>", ordDate, "</span></dd><dt><span>", 
							i18n.ORDER_STATUS, ":</span></dt><dd class='dishord-det-dt'><span>", statusTypeDisp, "</span></dd></dl></div>");
						
							jsOrdSec = jsOrdSec.concat(ordItem);
							ordCount++;
					}
					jsORDHTML.push(jsOrdSec.join(""), "</div>");
					tableBody = tableBody.concat(jsORDHTML);					
					ordHTML = tableBody.join("");
				
				    countText = "("+ (ordLen) + ")";
				}

				var compNS = component.getStyles().getNameSpace();
                MP_Util.Doc.FinalizeComponent(ordHTML, component, countText);
				if (component.isPlusAddEnabled()) {
                    appendDropDown(compNS, component, recordData, component.getCriterion().static_content);
                }
			}
            catch (err) {
                
                throw (err);
            }
            finally {
                //do nothing
            }
        }
    };
}();
