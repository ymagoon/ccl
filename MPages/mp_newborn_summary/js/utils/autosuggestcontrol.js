/************************************************************************
*               	   AUTO SUGGEST FUNCTIONS                           *
************************************************************************/
/**
 * An autosuggest textbox control.
 * @class
 * @scope public
 */
function AutoSuggestControl(oComponent /*:ComponentToAddTo*/, 
                            oQueryHandler /*:SuggestionProvider*/,
                            oSelectionHandler /*:SelectionHandler*/,
                            oFlag /*:Flag*/) {
    /**
     * The currently selected suggestions.
     * @scope private
     */   
    this.cur /*:int*/ = 0;

    /**
     * The dropdown list layer.
     * @scope private
     */
    this.layer = null;
    
	/**
     * Component AutoSuggest is being added to
     * @scope private.
     */
    this.component /*:Component*/ = oComponent;
	
    /**
     * Suggestion provider for the autosuggest feature.
     * @scope private.
     */
    this.queryHandler /*:SuggestionProvider*/ = oQueryHandler;
	
	 /**
     * Selection Handler for the autosuggest feature.
     * @scope private.
     */
    this.selectionHandler /*:SelectionHandler*/ = oSelectionHandler;
    
	/**
    * Optional flag for autosuggest feature.
    * @scope private.
    */
    this.iFlag /*:Flag*/ = oFlag
	
    /**
    * Optional flag for autosuggest feature.
    * @scope private.
    */
    this.iFlag /*:Flag*/ = oFlag
	
    /**
     * The textbox to capture.
     * @scope private
     */
    this.textbox /*:HTMLInputElement*/ = _g(oComponent.getStyles().getNameSpace() + "ContentCtrl");
	 /**
     * The JSON string.
     * @scope private
     */
    this.objArray /*JSON*/ = "";
    
    //initialize the control
    this.init();
    
}
/**
 * Autosuggests one or more suggestions for what the user has typed.
 * If no suggestions are passed in, then no autosuggest occurs.
 * @scope private
 * @param aSuggestions An array of suggestion strings.
 * @param bTypeAhead If the control should provide a type ahead suggestion.
 */
AutoSuggestControl.prototype.autosuggest = function (aSuggestion /*:Array JSON*/) {
	this.layer.style.width = this.textbox.offsetWidth;
    //make sure there's at least one suggestion
	this.objArray = aSuggestion;
	
	var aSuggestions = [];
	for (var i=0 ; i < aSuggestion.length ; i++){
		aSuggestions.push(aSuggestion[i].NAME);
	}
	
    if (aSuggestions.length > 0) {
       this.showSuggestions(aSuggestions);
    } else {
        this.hideSuggestions();
    }
};

/**
 * Creates the dropdown layer to display multiple suggestions.
 * @scope private
 */
AutoSuggestControl.prototype.createDropDown = function () {
    var oThis = this;
    //create the layer and assign styles
    this.layer = document.createElement("div");
    this.layer.className = "suggestions";
    this.layer.style.visibility = "hidden";
    this.layer.style.width = this.textbox.offsetWidth;
    
    //when the user clicks on the a suggestion, get the text (innerHTML)
    //and place it into a textbox
    this.layer.onmousedown = 
    this.layer.onmouseup = 
    this.layer.onmouseover = function (oEvent) {
        oEvent = oEvent || window.event;
        oTarget = oEvent.target || oEvent.srcElement;
        if (oEvent.type == "mousedown") {
			var index = AutoSuggestControl.prototype.indexOf(this,oTarget);
			oThis.textbox.value = oThis.objArray[index].NAME;
			oThis.selectionHandler(oThis.objArray[index].VALUE, oThis.component);
			oThis.hideSuggestions();
        } else if (oEvent.type == "mouseover") {
			var index = AutoSuggestControl.prototype.indexOf(this,oTarget);
			oThis.cur = index;
            oThis.highlightSuggestion(oTarget);
        } else {
            oThis.textbox.focus();
        }
    };
    
    document.body.appendChild(this.layer);
};

/**
 * Gets the left coordinate of the textbox.
 * @scope private
 * @return The left coordinate of the textbox in pixels.
 */
AutoSuggestControl.prototype.getLeft = function () /*:int*/ {
    var oNode = this.textbox;
    var iLeft = 0;
    
    while(oNode && oNode.tagName != "BODY") {
        iLeft += oNode.offsetLeft;
        oNode = oNode.offsetParent;   		
    }
    
    return iLeft;
};

/**
 * Gets the top coordinate of the textbox.
 * @scope private
 * @return The top coordinate of the textbox in pixels.
 */
AutoSuggestControl.prototype.getTop = function () /*:int*/ {
	var oNode = this.textbox;
    var iTop = 0;
	
    while(oNode && oNode.tagName != "BODY") {
        iTop += oNode.offsetTop;
        oNode = oNode.offsetParent;
    }
    
    return iTop;
};

/**
 * Handles three keydown events.
 * @scope private
 * @param oEvent The event object for the keydown event.
 */
AutoSuggestControl.prototype.handleKeyDown = function (oEvent /*:Event*/) {

	if (this.layer.style.visibility != "hidden"){
		switch(oEvent.keyCode) {
			case 38: //up arrow
				this.previousSuggestion();
				break;
			case 40: //down arrow 
				this.nextSuggestion();
				break;
			case 13: //enter
				this.selectionHandler(this.objArray[this.cur].VALUE, this.component);
				this.hideSuggestions();
				break;
		}
	}
};

/**
 * Handles keyup events.
 * @scope private
 * @param oEvent The event object for the keyup event.
 */
AutoSuggestControl.prototype.handleKeyUp = function (oEvent /*:Event*/) {

    var iKeyCode = oEvent.keyCode;

    //for backspace (8) and delete (46), shows suggestions without typeahead
    if (iKeyCode == 8 || iKeyCode == 46) {
		if (this.textbox.value.length > 0)
			this.queryHandler(this, this.textbox, this.iFlag);
		else
			this.hideSuggestions();
        
    //make sure not to interfere with non-character keys
    } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
        //ignore
    } else {
        //request suggestions from the suggestion provider with typeahead
        this.queryHandler(this, this.textbox, this.iFlag);
    }
};

/**
 * Hides the suggestion dropdown.
 * @scope private
 */
AutoSuggestControl.prototype.hideSuggestions = function () {
    this.layer.style.visibility = "hidden";
};

/**
 * Highlights the given node in the suggestions dropdown.
 * @scope private
 * @param oSuggestionNode The node representing a suggestion in the dropdown.
 */
AutoSuggestControl.prototype.highlightSuggestion = function (oSuggestionNode) {

    for (var i=0; i < this.layer.childNodes.length; i++) {
        var oNode = this.layer.childNodes[i];
        if (oNode == oSuggestionNode || oNode == oSuggestionNode.parentNode) {
            oNode.className = "current";
        } else if (oNode.className == "current") {
            oNode.className = "";
        }
    }
};

/**
 * Initializes the textbox with event handlers for
 * auto suggest functionality.
 * @scope private
 */
AutoSuggestControl.prototype.init = function () {

    //save a reference to this object
    var oThis = this;
    
    //assign the onkeyup event handler
    this.textbox.onkeyup = function (oEvent) {
    
        //check for the proper location of the event object
        if (!oEvent) {
            oEvent = window.event;
        }    
        
        //call the handleKeyUp() method with the event object
        oThis.handleKeyUp(oEvent);
    };
    
    //assign onkeydown event handler
    this.textbox.onkeydown = function (oEvent) {
    
        //check for the proper location of the event object
        if (!oEvent) {
            oEvent = window.event;
        }    
        
        //call the handleKeyDown() method with the event object
        oThis.handleKeyDown(oEvent);
    };
    
    //assign onblur event handler (hides suggestions)    
    this.textbox.onblur = function () {
        oThis.hideSuggestions();
    };
    
    //create the suggestions dropdown
    this.createDropDown();
};

/**
 * Highlights the next suggestion in the dropdown and
 * places the suggestion into the textbox.
 * @scope private
 */
AutoSuggestControl.prototype.nextSuggestion = function () {
    var cSuggestionNodes = this.layer.childNodes;
    if (cSuggestionNodes.length > 0 && this.cur < cSuggestionNodes.length-1) {
        var oNode = cSuggestionNodes[++this.cur];
        this.highlightSuggestion(oNode);
    }
};

/**
 * Highlights the previous suggestion in the dropdown and
 * places the suggestion into the textbox.
 * @scope private
 */
AutoSuggestControl.prototype.previousSuggestion = function () {
    var cSuggestionNodes = this.layer.childNodes;
    if (cSuggestionNodes.length > 0 && this.cur > 0) {
        var oNode = cSuggestionNodes[--this.cur];
        this.highlightSuggestion(oNode); 
    }
};

/**
 * Builds the suggestion layer contents, moves it into position,
 * and displays the layer.
 * @scope private
 * @param aSuggestions An array of suggestions for the control.
 */
AutoSuggestControl.prototype.showSuggestions = function (aSuggestions /*:Array*/) {

    var oDiv = null;
    this.layer.innerHTML = "";  //clear contents of the layer
    for (var i=0; i < aSuggestions.length; i++) {
        oDiv = document.createElement("div");
		if (i == 0)
			oDiv.className = "current";
			this.cur = 0;
		var domText = this.highlight(aSuggestions[i],this.textbox.value);
		oDiv.innerHTML = domText;
		oDiv.appendChild(document.createTextNode(""));
        this.layer.appendChild(oDiv);
    }
    
	this.layer.style.left = this.getLeft() + "px";
	this.layer.style.top = (this.getTop()+this.textbox.offsetHeight) + "px";
    	this.layer.style.visibility = "visible";
	this.layer.style.position = "absolute";
};

AutoSuggestControl.prototype.indexOf = function (parent,el) {

    var nodeList = parent.childNodes;
	for (var i=0; i < nodeList.length; i++) {
		var oNode = nodeList[i];
		//Parent Node grabs the BODY element if user clicked on a bolded section of the suggestions
        if (oNode == el || oNode == el.parentNode) {
			return i;
		}
	}
    return -1;
}

AutoSuggestControl.prototype.highlight = function(value, term) {
	return "<strong>" + value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong>") + "</strong>";
}

/************************************************************************
*                           END AUTOSUGGEST                             *
************************************************************************/

function addNomenclatureFromAutoSuggest(nomenclature_id, component) {
	var criterion = component.getCriterion();
	var sendAr = [];
	sendAr.push("^MINE^", criterion.person_id + ".0", criterion.encntr_id + ".0", criterion.provider_id  + ".0", criterion.position_cd + ".0", criterion.ppr_cd + ".0" , nomenclature_id + ".0", "0.0", "1" );	
    var request = new MP_Core.ScriptRequest(component, component.getAutoSuggestAddTimerName());
    request.setProgramName(component.getAutoSuggestAddScript());
    request.setParameters(sendAr);
    request.setAsync(true);
	MP_Core.XMLCCLRequestCallBack(component, request, autoSuggestAddLoad )
}
function autoSuggestAddLoad(reply) {
	var alertMsg = "";	
	var jsonReply = reply.getResponse();
	var component = reply.getComponent();
	var componentName  = "";
	var textBox = _g(component.getStyles().getNameSpace() + "ContentCtrl");
	//Customize message based on component
	var compNs = component.getStyles().getNameSpace();
	switch(compNs) {
	case "pl":
	    componentName = i18n.discernabu.PROBLEM;
		break;
	case "dx":
		componentName = i18n.discernabu.DIAGNOSIS;
		break;
	default: 
		componentName = "";
	}

	if (jsonReply && jsonReply.PRIVILEGE_IND == 0)
	{
		alertMsg = i18n.discernabu.NO_PRIVS;
		alertMsg = alertMsg.replace("{name}", componentName)
		alert(alertMsg);
		textBox.value = "";
		
	}
	else if (jsonReply && jsonReply.DUPLICATE_IND == 1)
	{

		alertMsg = i18n.discernabu.DUPLICATE;
		alertMsg = alertMsg.replace(/{name}/gi , componentName);
		alert(alertMsg);
		textBox.value = "";
	}
	else 
	{
		//Tear down the hovers to avoid problem with hover being stuck on screen when component refreshes
		var hvrdls = Util.Style.g(component.getStyles().getNameSpace() + "-info", component.getSectionContentNode(), "DL")
		for (var i = hvrdls.length;  i--;) {
			hvrdls[i].onmouseover = null;
			hvrdls[i].onmousemove = null;
			hvrdls[i].onmouseenter = null;
			hvrdls[i].onmouseout = null;
			hvrdls[i].onmouseleave = null;			
		}
		//If a hover is active destroy it
		var hovers = Util.Style.g("hover", document.body , "DIV");
		for(var i= hovers.length;  i--;){
			if(Util.gp(hovers[i]).nodeName == "BODY")
			{
				hovers[i].style.display = 'none';
				Util.de(hovers[i]);
			}
			
		}
		component.InsertData();
		//For good measure
		hovers = Util.Style.g("hover", document.body , "DIV");
		for(var i= hovers.length;  i--;){
			if(Util.gp(hovers[i]).nodeName == "BODY")
			{
				hovers[i].style.display = 'none';
				Util.de(hovers[i]);
			}
			
		}
	}
}
//Global vars for AutoSearch
var curSearchCounter = 0;
var nextSearchCounter = 0;
var replySearchCounter = 0;	
function searchNomenclature(callback, textBox, iSearchTypeFlag) {

	// Initialize the request object
	var xhr = new XMLCclRequest ();
	var returnData;
	var searchPhrase         = textBox.value;
	var limit                = 10;

	curSearchCounter = curSearchCounter + 1;
	
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
			
            var msg = xhr.responseText; 
            var jsonMsg = "";
			//alert(msg);
			if (msg) 
			{
				jsonMsg = JSON.parse(msg);
			}

			if (jsonMsg)
			{
				replySearchCounter = jsonMsg.RECORD_DATA.SEARCHINDEX;
				if (replySearchCounter > nextSearchCounter && textBox.value != "")
				{
					nextSearchCounter = replySearchCounter;
					returnData = jsonMsg.RECORD_DATA.NOMENCLATURE;
					callback.autosuggest(returnData);
				}
			}
		}
	}	
	
	xhr.open('GET', "mp_search_nomenclatures");
	xhr.send("^MINE^, ^" + searchPhrase + "^," + limit + "," + curSearchCounter + "," + iSearchTypeFlag);
}
	