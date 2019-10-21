Function.prototype.method = function(name, func){
    this.prototype[name] = func;
    return this;
};

Function.method('inherits', function(parent){
    var d = {}, p = (this.prototype = new parent());
    this.method('uber', function uber(name){
        if (!(name in d)) {
            d[name] = 0;
        }
        var f, r, t = d[name], v = parent.prototype;
        if (t) {
            while (t) {
                v = v.constructor.prototype;
                t -= 1;
            }
            f = v[name];
        }
        else {
            f = p[name];
            if (f === this[name]) {
                f = v[name];
            }
        }
        d[name] += 1;
        r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
        d[name] -= 1;
        return r;
    });
    return this;
});

function mpo(e){
    var posx = 0, posy = 0;
    if (!e) {
        e = window.event;
    }
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else 
        if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
        }
    return [posy, posx];
}


/*
 * .{
 layoutTitle: "",
 toggleComponentsTitle: "",
 toggleComponentsHover: "",
 customizeLayoutTitle: "",
 customizeLayoutHover: "",
 savecustomizeTitle: "",
 savecustomizeHover: "",
 clearcustomizeTitle: "",
 clearcustomizeHover: "",
 helpTitle: "",
 helpHover:"",
 helpLink: "",
 }
 *
 */
/**
* Constructor for an MpageLayout
* @author RB018070
* @classDescription 	This class creates a new Mpage Layout
* @return {MpageLayout}		Returns new Mpage layout
* @type {object}
* @constructor
* @version 2.0
*/
var MpageLayout = function(){
	this.layoutRowNodes = "";
	this.layoutRowWidth = "";
	this.layoutColumnNodes = "";
	this.layoutColumnWidth = "";
	this.layoutDOM = "";
	this.layoutHeaderAlertDOM = "";
	this.layoutHeaderDOM = "";
	this.layoutFooterDOM = "";
	this.layoutBannerDOM = "";
	this.layoutButtonDOM = "";
	this.activeRowSequence = "";
	this.activeColumnDOM = "";
	this.activeColumnSequence = "";
	this.activeMpageComponent = "";
	this.placeHolderDOM = "";
	this.placeHolderParentDOM = "";
	this.customizeModeInd = "";
}  
    /*<DIV class=ps-hd>
	     <H1>
	     	<SPAN> </SPAN>
	     </H1>
	     <SPAN>
		     <A href="#">(Expand All)</A>
		     <A href="#">Customize View</A>
		     <A href="">
		     <IMG src="">Help
		     </A>
	     </SPAN>
     </DIV>
     */
	
	/**
	* Create a new Mpage Column Layout
	* @memberOf MpageLayout
	* @method
	* @param   {JSONObject} prefs  Preferences to create the column layout <br/><br/>
	* 				{<br/> 
	* 					&nbsp; <b>columns		&nbsp;: Number of columns on layout</b> (ex: 2),<br/>
	* 					&nbsp; <b>layoutTitle 	&nbsp;: Title to display on top of layout</b>   (ex: IC Summary Mpage)  ,<br/>
	* 					&nbsp; <b>toggleComponentsTitle &nbsp;: Text to display on a component collapse/expand</b>  (ex: ["(Expand All)", "(Collapse All)"] ) ,<br/> 
	* 					&nbsp; <b>toggleComponentsHover &nbsp;: Hover to display on a component collapse/expand</b>  (ex: [" Expand All ", " Collapse All "] ) ,<br/> 
	*  				}
	*/
    MpageLayout.prototype.createColumnLayout = function(prefs){
        var columns = parseInt(prefs.columns),layoutTable, layoutTitle = prefs.layoutTitle, toggleComponentsTitle = prefs.toggleComponentsTitle, toggleComponentsHover = prefs.toggleComponentsHover, customizeLayoutTitle = prefs.customizeLayoutTitle, customizeLayoutHover = prefs.customizeLayoutHover, savecustomizeTitle = prefs.savecustomizeTitle, savecustomizeHover = prefs.savecustomizeHover, clearcustomizeTitle = prefs.clearcustomizeTitle, clearcustomizeHover = prefs.clearcustomizeHover, helpTitle = prefs.helpTitle, helpHover = prefs.helpHover, helpLink = prefs.helpLink;
        
		//Create Alert Header Div
		this.layoutHeaderAlertDOM = Util.cep("div", {
			"className": "alert"
		});
		
		//Create Footer
		this.layoutFooterDOM = Util.cep("div", {
			"className": "mpage-layout-footer"
		});
		
        if (columns > 0) {
            this.layoutColumnWidth = (99 / columns);
            this.layoutColumnNodes = [];
            this.layoutDOM = Util.cep("div", {
                "className": "mpage-layout-container"
            });
			layoutTable = Util.cep("table", {
                "className": "mpage-layout-table"
				,"cellSpacing":5
				,"colSpan":columns
            });
			layoutTable.insertRow(-1);
            var that = this, cur_el;
            for (var i = 0; i < columns; i++) {
                cur_el = this.createColumnNode(layoutTable);
                this.layoutColumnNodes.unshift(cur_el);
            }
                Util.ac(layoutTable, this.layoutDOM);
            // Build Layout Header	
            this.placeHolderDOM = "";            
			this.layoutBannerDOM= Util.ce("div");
			this.layoutButtonDOM= Util.ce("div");
			this.layoutHeaderDOM = Util.cep("div", {
                "className": "ps-hd"
            });
            this.layoutHeaderSpanExpand = Util.cep("a", {});
            this.layoutHeaderSpanHelp = Util.cep("a", {});
            this.layoutHeaderSpanCustomize = Util.cep("a", {});
            this.layoutHeaderSpanSaveCustomize = Util.cep("a", {});
            this.layoutHeaderSpanClearCustomize = Util.cep("a", {});
            var that = this, layoutHeaderH1 = Util.ce("h1"), layoutHeaderH1Span = Util.ce("span"), layoutHeaderSpan = Util.ce("span"), toggleComponentsMethod = function(){
                that.toggleComponentsDisplay(that, toggleComponentsTitle, toggleComponentsHover);
            };
            
            if (layoutTitle && layoutTitle > "") {
                layoutHeaderH1Span = Util.ac(layoutHeaderH1Span, layoutHeaderH1);
                layoutHeaderH1 = Util.ac(layoutHeaderH1, this.layoutHeaderDOM);
                layoutHeaderH1Span.innerHTML = layoutTitle;
            }
            if (toggleComponentsTitle && toggleComponentsTitle > "") {
                this.layoutHeaderSpanExpand = Util.ac(this.layoutHeaderSpanExpand, layoutHeaderSpan);
                this.layoutHeaderSpanExpand.innerHTML = toggleComponentsTitle[0];
                if (toggleComponentsHover && toggleComponentsHover > "") {
                    this.layoutHeaderSpanExpand.title = toggleComponentsHover[0];
                }
                Util.addEvent(that.layoutHeaderSpanExpand, "click", toggleComponentsMethod);
            }
            if (customizeLayoutTitle && customizeLayoutTitle > "") {
                this.layoutHeaderSpanCustomize = Util.ac(this.layoutHeaderSpanCustomize, layoutHeaderSpan);
                this.layoutHeaderSpanCustomize.innerHTML = customizeLayoutTitle;
                if (customizeLayoutHover && customizeLayoutHover > "") {
                    this.layoutHeaderSpanCustomize.title = customizeLayoutHover;
                }
                Util.addEvent(that.layoutHeaderSpanCustomize, "click", function(){
                    that.toggleCustomizeDisplay(that, 1);
                });
                if (savecustomizeTitle && savecustomizeTitle > "") {
                    this.layoutHeaderSpanSaveCustomize = Util.ac(this.layoutHeaderSpanSaveCustomize, layoutHeaderSpan);
                    this.layoutHeaderSpanSaveCustomize.innerHTML = savecustomizeTitle;
                    if (savecustomizeHover && savecustomizeHover > "") {
                        this.layoutHeaderSpanSaveCustomize.title = savecustomizeHover;
                    }
                    Util.addEvent(that.layoutHeaderSpanSaveCustomize, "click", function(){
                        that.toggleCustomizeDisplay(that, 0);
                    });
                    this.layoutHeaderSpanSaveCustomize.style.display = "none";
                }
                if (clearcustomizeTitle && clearcustomizeTitle > "") {
                    this.layoutHeaderSpanClearCustomize = Util.ac(this.layoutHeaderSpanClearCustomize, layoutHeaderSpan);
                    this.layoutHeaderSpanClearCustomize.innerHTML = clearcustomizeTitle;
                    if (clearcustomizeHover && clearcustomizeHover > "") {
                        this.layoutHeaderSpanClearCustomize.title = clearcustomizeHover;
                    }
                    Util.addEvent(that.layoutHeaderSpanClearCustomize, "click", function(){
                        that.toggleCustomizeDisplay(that, 0);
                    });
                    this.layoutHeaderSpanClearCustomize.style.display = "none";
                }
            }
            if (helpTitle && helpTitle > "") {
                this.layoutHeaderSpanHelp = Util.ac(this.layoutHeaderSpanHelp, layoutHeaderSpan);
                this.layoutHeaderSpanHelp.innerHTML = helpTitle;
                if (helpHover && helpHover > "") {
                    this.layoutHeaderSpanHelp.title = helpHover;
                }
                if (helpLink && helpLink > "") {
                    this.layoutHeaderSpanHelp.href = helpLink;
                }
            }
            layoutHeaderSpan = Util.ac(layoutHeaderSpan, this.layoutHeaderDOM);
        }
    };    
	
	/**
	* Insert an MpageComponent Object into the layout banner
	* @memberOf MpageLayout
	* @method
	* @param {MpageComponentObject} component Mpage Component Object
	*/
	MpageLayout.prototype.insertBanner = function(component){
        try {
          	component.contentDOM = Util.ac(Util.cep("div",{"className":"dmg-pt-banner"}),this.layoutBannerDOM);
        } 
        catch (e) {
            alert(e.message + "insertBanner");
        }
    };
	
	/**
	* Insert an MpageComponent Object into the layout banner
	* @memberOf MpageLayout
	* @method
	* @param {MpageComponentObject} component Mpage Component Object
	*/
	MpageLayout.prototype.attachComponent = function(component, contentDOMParent, divClass){
        try {
          	component.contentDOM = Util.ac(Util.cep("div",{"className":divClass}),contentDOMParent);
        } 
        catch (e) {
            alert(e.message + "attachComponent");
        }
    };
	
	/**
	* Insert an MpageComponent Object into the layout button
	* @memberOf MpageLayout
	* @method
	* @param {MpageComponentObject} component Mpage Component Object
	*/
	MpageLayout.prototype.insertButton = function(component){
        try {
          	component.contentDOM = Util.ac(Util.cep("div",{"className":"dmg-pt-button"}),this.layoutButtonDOM);
        } 
        catch (e) {
            alert(e.message + "insertButton");
        }
    };
		
	/**
	* Insert an MpageComponent Object into the layout body
	* @memberOf MpageLayout
	* @method
	* @param {MpageComponentObject} component Mpage Component Object
	*/
    MpageLayout.prototype.insertComponent = function(component /*MpageComponent*/){
        try {
            var that = this, curColumn = this.layoutColumnNodes[component.columnSequence]
				, componentTitleCornerDOM = component.getComponentTitleCornerDOM()
				, componentDOM = component.getComponentDOM()
				, componentRowSequence = component.getRowSequence()
				, componentcolumnSpan = component.getColumnSpan()
				, columnChildNodes = Util.gcs(curColumn)
				, nextColumnNode
				, dragStartPosition = [0, 0], componentStartPosition = [0, 0]
				, mouseOffsetPosition = [0, 0], mouseMoveMethod = function(e){
                that.moveComponent(e, mouseOffsetPosition, that, component);
            };
			componentDOM.value = componentRowSequence;
			curColumn.colSpan = componentcolumnSpan;
			curColumn.style.width = (this.layoutColumnWidth*componentcolumnSpan) +"%";
			while(componentcolumnSpan > 1){
				nextColumnNode = Util.gns(curColumn);
				Util.de(nextColumnNode);
				componentcolumnSpan-=1;
			}
            if (columnChildNodes.length === 0) {
                Util.ac(componentDOM, curColumn);
            }
            else {
                for (var i = 0, len = columnChildNodes.length; i < len; i++) {
					if (componentRowSequence < columnChildNodes[i].value) {
                        curColumn.insertBefore(componentDOM, columnChildNodes[i]);
						break;
                    }
                }
				if(i == len){					
                	Util.ac(componentDOM, curColumn);
				}
            }			
            // Add event handlers for Drag/Drop	
			if (this.layoutHeaderSpanClearCustomize.innerHTML > "") {
				Util.addEvent(componentTitleCornerDOM, "mousedown", function(e){
					if (!e) {
						e = window.event;
					}
					dragStartPosition = mpo(e);
					componentStartPosition = Util.Pos.gop(componentDOM);
					mouseOffsetPosition = [dragStartPosition[0] - componentStartPosition[0], dragStartPosition[1] - componentStartPosition[1]];
					
					Util.addEvent(document, "mousemove", mouseMoveMethod);
					Util.cancelBubble(e);
				});
				Util.addEvent(componentTitleCornerDOM, "mouseup", function(e){
					if (!e) {
						e = window.event;
					}
					Util.removeEvent(document, "mousemove", mouseMoveMethod);
					that.finalizeComponent(that, componentDOM);
					Util.cancelBubble(e);
				});
			}
        } 
        catch (e) {
            alert(e.message + "insertComponent");
        }
    };
		
	/**
	* Get DOM reference to the layout Banner
	* @memberOf MpageLayout
	* @method
	* @return {DOMNode} DOM reference to layout Banner
	*/
    MpageLayout.prototype.getBannerDOM= function(){
        return this.layoutBannerDOM;
    };
	
	/**
	* Get DOM reference to the layout Button
	* @memberOf MpageLayout
	* @method
	* @return {DOMNode} DOM reference to layout Button
	*/
    MpageLayout.prototype.getButtonDOM= function(){
        return this.layoutButtonDOM;
    };
	
	/**
	* Get DOM reference to the layout Header
	* @memberOf MpageLayout
	* @method
	* @return {DOMNode} DOM reference to layout Header
	*/
    MpageLayout.prototype.getHeaderDOM = function(){
        return this.layoutHeaderDOM;
    };
	
	/**
	* Get DOM reference to the layout Header Alert
	* @memberOf MpageLayout
	* @method
	* @return {DOMNode} DOM reference to layout Header Alert
	*/
    MpageLayout.prototype.getHeaderAlertDOM = function(){
        return this.layoutHeaderAlertDOM;
    };
    	
	
	/**
	* Get DOM reference to the layout Body
	* @memberOf MpageLayout
	* @method
	* @return {DOMNode} DOM reference to layout Body
	*/
    MpageLayout.prototype.getLayoutDOM = function(){
        return this.layoutDOM;
    };

	/**
	* Get DOM reference to the layout Footer
	* @memberOf MpageLayout
	* @method
	* @return {DOMNode} DOM reference to layout Footer
	*/
    MpageLayout.prototype.getLayoutFooterDOM = function(){
        return this.layoutFooterDOM;
    };
    
		
    MpageLayout.prototype.toggleCustomizeDisplay= function(that, opt){
        var custDisp, otherDisp;
        if (opt === 1) {
            custDisp = "";
            otherDisp = "none";
        }
        else {
            custDisp = "none";
            otherDisp = "";
        }
        if (this.layoutHeaderSpanExpand !== null && typeof this.layoutHeaderSpanExpand === 'object') {
            this.layoutHeaderSpanExpand.style.display = otherDisp;
        }
        if (this.layoutHeaderSpanCustomize !== null && typeof this.layoutHeaderSpanCustomize === 'object') {
            this.layoutHeaderSpanCustomize.style.display = otherDisp;
            this.layoutHeaderSpanSaveCustomize.style.display = custDisp;
            this.layoutHeaderSpanClearCustomize.style.display = custDisp;
        }
        if (this.layoutHeaderSpanHelp !== null && typeof this.layoutHeaderSpanHelp === 'object') {
            this.layoutHeaderSpanHelp.style.display = otherDisp;
        }
    };
    	
    MpageLayout.prototype.moveComponent = function(e, mouseOffsetPos, that, component){
        if (!e) {
            e = window.event;
        }
        var componentDOM = component.getComponentDOM(), componentDOMleft = mpo(e), componentDOMtop = componentDOMleft[0], childNodesDOM, curcomponentDOM = null, curComponentDOMLeft, curComponentDOMTop;
        componentDOMleft = componentDOMleft[1];
        that.activeMpageComponent = component;
        if ((!that.placeHolderDOM || that.placeHolderDOM === null)) {
            that.placeHolderDOM = Util.cep("div", {
                "className": "mpage-layout-placeholder"
            });
        }
        if ((!that.placeHolderParentDOM || that.placeHolderParentDOM === null)) { // first movement
            // put place holder
            that.placeHolderDOM.style.height = componentDOM.offsetHeight + "px";
            that.placeHolderDOM.style.width = componentDOM.offsetWidth + "px";
            
            // make component absolute positioned
            componentDOM.style.width = componentDOM.offsetWidth + "px";
            componentDOM.style.height = componentDOM.offsetHeight + "px";
            componentDOM = (Util.gp(componentDOM)).removeChild(componentDOM);
            Util.ac(componentDOM, document.body);
            componentDOM.style.position = "absolute";
        }
        componentDOM.style.left = (componentDOMleft - mouseOffsetPos[1]) + "px";
        componentDOM.style.top = (componentDOMtop - mouseOffsetPos[0]) + "px";
        // Get active column
        for (var n = 0, l = this.layoutColumnNodes.length; n < l; n++) {
            if (Util.Pos.gop(this.layoutColumnNodes[n])[1] <= componentDOMleft) {
                that.activeColumnDOM = this.layoutColumnNodes[n];
                that.activeColumnSequence = (n + 1);
            }
        }
        childNodesDOM = Util.gcs(that.activeColumnDOM);
        for (var i = 0, len = childNodesDOM.length; i < len; i++) {
            curcomponentDOM = childNodesDOM[i];
            curComponentDOMLeft = Util.Pos.gop(curcomponentDOM);
            curComponentDOMTop = curComponentDOMLeft[0];
            curComponentDOMLeft = curComponentDOMLeft[1];
            if (that.placeHolderDOM !== curcomponentDOM) {
                if (curComponentDOMTop > componentDOMtop) {
                    that.activeRowSequence = (i + 1);
                    that.placeHolderParentDOM = that.activeColumnDOM;
                    that.placeHolderParentDOM.insertBefore(that.placeHolderDOM, curcomponentDOM);
                    break;
                }
            }
            if (i === len - 1) {
                that.activeRowSequence = (i + 2);
                that.placeHolderParentDOM = that.activeColumnDOM;
                Util.ia(that.placeHolderDOM, curcomponentDOM);
                break;
            }
        }
        if (childNodesDOM.length === 0) {
            that.activeRowSequence = 1;
            that.placeHolderParentDOM = that.activeColumnDOM;
            Util.ac(that.placeHolderDOM, that.placeHolderParentDOM);
        }
    };
    
    MpageLayout.prototype.finalizeComponent = function(that, componentDOM){
        if (that.placeHolderParentDOM !== null && typeof that.placeHolderParentDOM === 'object') {
            componentDOM = (Util.gp(componentDOM)).removeChild(componentDOM);
            componentDOM.style.position = "relative";
            componentDOM.style.top = (0) + "px";
            componentDOM.style.left = (0) + "px";
            componentDOM.style.height = "auto";
            componentDOM.style.width = "100.00%";
            Util.ia(componentDOM, that.placeHolderDOM);
            that.placeHolderDOM = that.placeHolderParentDOM.removeChild(that.placeHolderDOM);
            that.placeHolderParentDOM = null;
            that.activeMpageComponent.rowSequence = that.activeRowSequence;
            that.activeMpageComponent.columnSequence = that.activeColumnSequence;
        }
        //alert(Util.gp(componentDOM).outerHTML);
    };
    
    MpageLayout.prototype.toggleComponentsDisplay = function(that, toggleComponentsDisplay, toggleComponentsHover){
        var ccomps = Util.Style.g("section", document.body, "div")
			, i, l = ccomps.length, expandInd = (that.layoutHeaderSpanExpand.innerHTML === toggleComponentsDisplay[0] ? 0 : 1);
        for (i = 0; i < l; i++) {
            //	ccomps[i] = Util.gp(ccomps[i]); 
			cels = Util.Style.g("sec-hd-tgl",ccomps[i], "span")
			if (cels.length === 1) {
				if (expandInd === 1) {
					if (Util.Style.ccss(ccomps[i], "closed")) { // component collapse - > expand
						Util.Style.rcss(ccomps[i], "closed");
						cels[0].innerHTML = "-";
						cels[0].title = toggleComponentsDisplay[0];
					}
				}
				else {
					if (!Util.Style.ccss(ccomps[i], "closed")) { // component expand - > collapse
						Util.Style.acss(ccomps[i], "closed");
						cels[0].innerHTML = "+";
						cels[0].title = toggleComponentsDisplay[1];
					}
				}
			}
        }
        if (expandInd === 1) {
            that.layoutHeaderSpanExpand.innerHTML = toggleComponentsDisplay[0];
            that.layoutHeaderSpanExpand.title = toggleComponentsHover[0];
        }
        else {
            that.layoutHeaderSpanExpand.innerHTML = toggleComponentsDisplay[1];
            that.layoutHeaderSpanExpand.title = toggleComponentsHover[1];
        }
    };
	
	MpageLayout.prototype.createColumnNode = function(layoutTable){		
        var curColumnNode = layoutTable.rows[0].insertCell(0);
        curColumnNode.style.width = this.layoutColumnWidth + "%";
        return curColumnNode;
    };
        
    MpageLayout.prototype.getColumnNode = function(columnSequence /*Integer*/){
        return this.layoutColumnNodes[columnSequence];
    };
    
    MpageLayout.prototype.getRowNode = function(rowSequence /*Integer*/){
        return this.layoutRowNodes[rowSequence];
    };
	
	MpageLayout.prototype.insertHeaderLink = function(linkHTML /*String*/ , sequence /*integer*/){
		var linkSpan = Util.cep("span", {});
		if (sequence === 1) {
			var headerTag = _gbt( "H1", this.layoutHeaderDOM);
			Util.ia(linkSpan, headerTag[0]);
		}
		else{
			linkSpan = Util.ac(linkSpan, this.layoutHeaderDOM);
		}
			
		linkSpan.innerHTML = linkHTML;
	}
    
    

/*  MpageComponent 
 * 	<DIV id=j class="section  closed">
		 <H2 class=sec-hd>
			 <SPAN class=sec-hd-tgl title="Hide Section">
				 -
			 </SPAN>
			 <SPAN class=corner-left>
				 <SPAN>
				 	<A  href="#"></A>
				 </SPAN>
				 <SPAN>
				 	// Additional text to display
				 </SPAN>
			 </SPAN>
		 </H2>
		 <DIV  class=sec-content>
		 </DIV>
 	</DIV>
 
   {
        header: "",
        link: "",
        row: "",
        column: "",
        refreshInd: "",
        applinkInd: "",
        toggleTitle: [],
        toggleHover: []
    };
 */
/**
* Constructor for an MpageComponent, the following public class variables should be defined in each instance
* 		<br/><br/>
* 		&nbsp;<b>MpageComponent.meaning</b> - Unique identifier for the component  (used for communication between components)<br/>
* 		&nbsp;<b>MpageComponent.componentType</b>  -  Type of component  (simple <no borders >,other )<br/>
*   	&nbsp;<b>MpageComponent.defaultLoad </b> 	- Indicate default load of content in the component (true/false)<br/><br/>
*   
* @author RB018070
* @classDescription 	This class creates a new Mpage Component
* @return {MpageComponent}		Returns new Mpage Component
* @type {object}
* @constructor
* @version 2.0
*/
var MpageComponent = function(){
	this.groups = {};	    
	this.id = "";
	this.toggleTitle = "";
	this.toggleHover = "";
	this.locked = "";
	this.rowSequence = "";
	this.columnSpan = "1";
	this.columnSequence = "";
	this.componentDOM = "";
	this.contentDOM = "";
	this.componentToggleDOM = "";
	this.componentHyperLinkDOM = "";
	this.componentTitleWrapperDOM = "";
	this.componentTitleCornerDOM = "";
	this.componentTitleMiscDOM = "";
	this.componentHeaderDOM = "";
	this.display = "";
	this.componentType = "";
	this.criterion = "";
	this.defaultLoad = true;
	this.loadingDisplay = "";
	this.onDOMLoad = [];
	
}	

	
	
	
	/**
	* Create a new Mpage Component
	* @memberOf MpageComponent
	* @method
	* @param   {JSONObject} prefs  Preferences to create the component <br/><br/>
	* 				{<br/> 
	* 					&nbsp; <b>header		&nbsp;: Header to display on component</b> (ex: Labs),<br/>
	* 					&nbsp; <b>link 	&nbsp;: Hyperlink from component header</b>   (ex: javascript:APPLINK(0,\"powerchart.exe\",\"/PERSONID=1234567 /ENCNTRID=89012345 /FIRSTTAB=~Flowsheet~\"))  ,<br/>
	* 					&nbsp; <b>row &nbsp;: Layout row sequence of the component position</b>  (ex: 1) ,<br/> 
	* 					&nbsp; <b>column &nbsp;: Layout Column sequence of the component position</b>  (ex: 2 ) ,<br/> 
	* 					&nbsp; <b>toggleTitle &nbsp;: Display on a component collapse/expand</b>  (ex: ["+", "-"] ) ,<br/> 
	* 					&nbsp; <b>toggleHover &nbsp;: Hover to display on a component collapse/expand</b>  (ex: ["Expand Component", "Collapse Component"] ) ,<br/> 
	* 					&nbsp; <b>loadingDisplay &nbsp;: Indicator to display on component intialize</b>  (ex: Loading... ) ,<br/>}
	*/
	MpageComponent.prototype.createComponent= function(prefs){
        var that = this
        header = prefs.header
        , link = prefs.link
		, row = prefs.row
		, columnSpan = prefs.columnSpan
		, column = prefs.column
		, toggleTitle = prefs.toggleTitle
		, toggleHover = prefs.toggleHover
		, loadingDisplay = prefs.loadingDisplay;
		
        // Build Component DOM
        this.componentDOM = Util.cep("div", {
            "className": "section"			
        });
        this.contentDOM = Util.cep("div", {
            "className": "sec-content"
        });
        this.componentToggleDOM = Util.cep("span", {
            "className": "sec-hd-tgl"
        });
        this.componentHeaderDOM = Util.cep("h2", {
            "className": "sec-hd"
        });
        this.componentTitleCornerDOM = Util.cep("span", {
            "className": "corner-left"
        });
		this.componentTitleMiscDOM = Util.cep("span", {
            "className": "corner-misc"
        });
        this.componentTitleWrapperDOM = Util.ce("span");
        this.componentHyperLinkDOM = Util.cep("a", {});
		
		if ( this.componentType === undefined || this.componentType === ""|| this.componentType.toLowerCase() != "simple" ) {
			this.componentToggleDOM = Util.ac(this.componentToggleDOM, this.componentHeaderDOM);
			this.componentHyperLinkDOM = Util.ac(this.componentHyperLinkDOM, this.componentTitleWrapperDOM);
			this.componentTitleMiscDOM = Util.ac(this.componentTitleMiscDOM, this.componentTitleCornerDOM);
			this.componentTitleWrapperDOM = Util.ac(this.componentTitleWrapperDOM, this.componentTitleCornerDOM);
			this.componentTitleWrapperDOM.className = "sec-title";
			this.componentTitleCornerDOM = Util.ac(this.componentTitleCornerDOM, this.componentHeaderDOM);
			this.componentHeaderDOM = Util.ac(this.componentHeaderDOM, this.componentDOM);
		}
		if(this.componentType > " " && this.componentType.toLowerCase() === "simple" ) {
			 this.contentDOM.style.borderWidth  = "0px";
		}
        this.contentDOM = Util.ac(this.contentDOM, this.componentDOM);
        this.rowSequence = 0;
		this.columnSequence = 0;
        // Set Component Attributes	
        if (link && link > "") {
            this.componentHyperLinkDOM.href = link;
        }
		 if (header && header > "") {
            this.componentHyperLinkDOM.innerHTML = header;
        }
        if (row && row > "") {
            this.rowSequence = parseInt(row,10) - 1;
        }
        if (columnSpan && columnSpan > "") {
            this.columnSpan = parseInt(columnSpan,10);
        }
        if (column && column > "") {
            this.columnSequence = parseInt(column,10) - 1;
        }
        if (toggleTitle) {
			this.toggleTitle	= toggleTitle;
        	this.componentToggleDOM.innerHTML = toggleTitle[1];
		}
        if (toggleHover) {
			this.toggleHover	= toggleHover;
        	this.componentToggleDOM.title = toggleHover[1];
		}
		if(loadingDisplay){
			this.loadingDisplay = 	loadingDisplay;	
		}
        Util.addEvent(this.componentToggleDOM, "click", function(){
            that.toggleDisplay(that, 0);
        });
    };
	
     
	/**
	* Initializes a component to begin load
	* @memberOf MpageComponent
	* @method
	* @param   {JSONObject} crit  Criterion to load the component <br/><br/>
	* 				{ User Defined }
	*/
	MpageComponent.prototype.initialize=function(crit){
		this.criterion = crit;
		if(this.defaultLoad === true){
			this.componentTitleMiscDOM.innerHTML = 	this.loadingDisplay;
			this.load(crit);
		}
	};
	
	
	
	/**
	* Method to trigger async or sync calls to load content
	* @memberOf MpageComponent
	* @method
	* @param {JSONObject} criterion Criterion object to initiate the call
	*/
    MpageComponent.prototype.load = function(criterion){
    };
	
	/**
	* Callback load JSON from an async or sync calls and generate HTML to populate the component
	* @memberOf MpageComponent
	* @method
	* @param {JSONObject} jsonData JSON data retrieved from the async or sync call
	*/
    MpageComponent.prototype.loadJsonData = function(jsonData){
		
    }
	
	/**
	* Method to listen for any data calls made from other components
	* @memberOf MpageComponent
	* @method
	* @param {JSONObject} cData call Data sent from other component<br/><br/>
	* 				{<br/> 
	* 					&nbsp; <b>meaning		&nbsp;: meaning of the component to call</b> (ex: LabsComponent_1),<br/>
	* 					&nbsp; <b>caller 	&nbsp;: Description of the calling entity</b>   (ex: MicroComponent_1))  ,<br/>
	* 					&nbsp; <b>dataType &nbsp;: Type of data passed to the component</b>  (ex: HTML, JSON, XML etc) ,<br/> 
	* 					&nbsp; <b>data &nbsp;: Data passed to the component</b>  (ex: 2 ) ,<br/> 
	* 					&nbsp; <b>triggerLoad &nbsp;: Indicate to load the called component</b>  (ex: true/false ) ,<br/> 
	* 					&nbsp; <b>triggerCriterion &nbsp;: Criterion to load the called component </b>  (ex: {"person_id":123423,"encounter_id":12342}) ,<br/>
	* 					<br/> &nbsp;&nbsp;additional data can also be defined here (ex: myComponentIdentifier : 1 )<br/>}
	*/
	MpageComponent.prototype.dataListener = function(cData){
	}
	
	
	/**
	* Set display lock on component
	* @memberOf MpageComponent
	* @method
	* @param {Boolean}prefLock true/false to indicate display lock
	*/
     MpageComponent.prototype.setlockDisplay= function(prefLock /*Boolean*/){
        this.locked = prefLock;
    };
    
		
	/**
	* Set criterion defined for the component
	* @memberOf MpageComponent
	* @method
	* @param {JSONObject} Criterion to be defined for the component
	*/
	MpageComponent.prototype.setCriterion = function(crit){
       	this.criterion = crit;
    }
	
	/**
	* Toggle the display of a component
	* @memberOf MpageComponent
	* @method
	* @param {MpageComponentObject} that Reference to the current Mpage component object
	* @param {Integer} Mode Type of display ( 0 toggle, -1  hide, 1  show)
	*/ 
     MpageComponent.prototype.toggleDisplay= function(that, mode){
        var gpp = that.componentDOM,selIndex = 0;
        if (!that.locked) { // display not locked
            switch (mode) {
                case 0: // regular toggle
                    if (Util.Style.ccss(gpp, "closed")) { // component expanded
                        Util.Style.rcss(gpp, "closed");
						selIndex = 1;
                    }
                    else { // component collapsed
                        Util.Style.acss(gpp, "closed");
						selIndex = 0;
                    }
                    break;
                case -1: // hide
                    Util.Style.acss(gpp, "closed");
						selIndex = 0;
                    break;
                case 1: // show
                    Util.Style.rcss(gpp, "closed");
						selIndex = 1;                      
                    break;
            }
        }
		if (that.toggleTitle) {
			that.componentToggleDOM.innerHTML = that.toggleTitle[selIndex];
		}
		if (that.toggleHover) {
			that.componentToggleDOM.title = that.toggleHover[selIndex];
		}
    };
	
	/**
	* Indicate finished loading of component
	* @memberOf MpageComponent
	* @method
	*/
	 MpageComponent.prototype.finishedLoading= function(){
	 	if (this.componentType === undefined || this.componentType === "" || this.componentType.toLowerCase() != "simple") {
			this.componentTitleMiscDOM.innerHTML = "";
		}
    };
	
	
	/**
	* Append HTML string to Component Body
	* @memberOf MpageComponent
	* @method
	* @param {String} HTML string to append to Component Body
	*/
	MpageComponent.prototype.appendContentHTML = function(HTMLString){
       	this.contentDOM.innerHTML +=  HTMLString;
    }
	
	
	
	/**
	* Append HTML Node to Component Body
	* @memberOf MpageComponent
	* @method
	* @param {DOMNode} HTML Node to append to Component Body
	* @return {DOMNode} HTML Node appended to Component Body
	*/
	MpageComponent.prototype.appendContentNode = function(HTMLNode){
       return (Util.ac(HTMLNode,this.contentDOM));
    }
	
	
	/**
	* Clear Component Body HTML
	* @memberOf MpageComponent
	* @method
	*/
	MpageComponent.prototype.clearContentHTML = function(){
       	this.contentDOM.innerHTML = "";
    }
	
	
	/**
	* Get criterion defined for the component
	* @memberOf MpageComponent
	* @method
	* @return {JSONObject} Criterion defined for the component
	*/
	MpageComponent.prototype.getCriterion = function(){
       	return(this.criterion)
    } 	
     
	
	
	/**
	* Get DOM reference to the Component Header
	* @memberOf MpageComponent
	* @method
	* @return {DOMNode} DOM reference to Component Header
	*/
	MpageComponent.prototype.getComponentHeaderDOM= function(){
        return this.componentHeaderDOM;
    };
    	
	/**
	* Get DOM reference to the Component Header Display
	* @memberOf MpageComponent
	* @method
	* @return {DOMNode} DOM reference to Component Header Display
	*/
    MpageComponent.prototype.getComponentTitleCornerDOM= function(){
        return this.componentTitleCornerDOM;
    };
    	
    	
	/**
	* Get DOM reference to the Component Wrapper
	* @memberOf MpageComponent
	* @method
	* @return {DOMNode} DOM reference to Component Wrapper
	*/
    MpageComponent.prototype.getComponentDOM= function(){
        return this.componentDOM;
    };
    
	
	/**
	* Get DOM reference to the Component Body
	* @memberOf MpageComponent
	* @method
	* @return {DOMNode} DOM reference to Component Body
	*/
     MpageComponent.prototype.getContentDOM= function(){
        return this.contentDOM;
    };
     
	 
	/**
	* Get the layout column sequence of the Component
	* @memberOf MpageComponent
	* @method
	* @return {Integer} column sequence of the Component
	*/
     MpageComponent.prototype.getColumnSequence= function(){
        return this.columnSequence;
    };
    
	
	/**
	* Get the layout row sequence of the Component
	* @memberOf MpageComponent
	* @method
	* @return {Integer} row sequence of the Component
	*/
     MpageComponent.prototype.getRowSequence= function(){
        return this.rowSequence;
    };
    
    /**
	* Set DOM reference to the Component Body, this is typically useful when injecting tests
	* @memberOf MpageComponent
	* @method
	* @param {DOMNode} DOM reference to Component Body
	*/
     MpageComponent.prototype.setContentDOM= function(newContentDOM){
        this.contentDOM = newContentDOM;
    };
	
   /**
	* Listener for calls to an mpage component
	* @memberOf MpageComponent
	* @method
	* @param   {JSONObject} cData  Preferences to call the component <br/><br/>
	* 				{<br/> 
	* 					&nbsp; <b>meaning		&nbsp;: meaning of the component to call</b> (ex: LabsComponent_1),<br/>
	* 					&nbsp; <b>caller 	&nbsp;: Description of the calling entity</b>   (ex: MicroComponent_1))  ,<br/>
	* 					&nbsp; <b>dataType &nbsp;: Type of data passed to the component</b>  (ex: HTML, JSON, XML etc) ,<br/> 
	* 					&nbsp; <b>data &nbsp;: Data passed to the component</b>  (ex: 2 ) ,<br/> 
	* 					&nbsp; <b>triggerLoad &nbsp;: Indicate to load the called component</b>  (ex: true/false ) ,<br/> 
	* 					&nbsp; <b>triggerCriterion &nbsp;: Criterion to load the called component </b>  (ex: {"person_id":123423,"encounter_id":12342}) ,<br/>
	* 					&nbsp; <b>targetFunction &nbsp;: Indicate the function to call on the called component</b>,<br/> 
	* 					additional user prefs can be defined here}
	*/
	 MpageComponent.prototype.listener= function(cData){
		if (cData) {
			if(cData.triggerLoad && cData.triggerLoad === true ){
				this.defaultLoad = true;
				this.initialize(cData.loadCriterion)
			} 
			if (cData.dataType && cData.data) {
				switch(cData.dataType.toUpperCase()) {
					case  "HTML" : this.contentDOM.innerHTML += cData.data;
								   break;
					default		 : if(this.dataListener){
										this.dataListener(cData);
									}
									break;
				}
			}
		}
	};
	/**
	* Add Observers to a component
	* @memberOf MpageComponent
	* @method
	* @param {String} Name of event attached to observers
	* 		 {Function} Reference to observing function
	*/ 
	MpageComponent.prototype.addObserver = function(event, observer){
        var self = this, group = self.groups[event];
        if(group == undefined || !group){
        	group = [];
        }
      	group.push(observer);
    };
    
   /**
	* Notify Observers on a component
	* @memberOf MpageComponent
	* @method
	* @param {String} Name of event attached to observers
	* 		 {Object} Data passed as parameter to observer functions
	*/  
    MpageComponent.prototype.notifyObservers = function(event, data){
        var self = this, group = self.groups[event];
        if(group){
	        for (var i = 0, ilen = group.length; i < ilen; i++) {
	            group[i](data);
	        }
        }
    };
	
	/* TODO*/
	MpageComponent.prototype.getColumnSpan= function(){
        return this.columnSpan;
    };  
	   
