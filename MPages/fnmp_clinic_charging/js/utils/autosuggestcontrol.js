/**
* An autosuggest textbox control.
* @class
* @scope public
*/
function AutoSuggestControl(oComponent /*:ComponentToAddTo*/,
                            oQueryHandler /*:SuggestionProvider*/,
                            oSelectionHandler /*:SelectionHandler*/,
                            oSuggestionDisplayHandler /*:SuggestionDisplayHandler*/)
{
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
    * Selection Display Handler for the autosuggest feature.
    * @scope private.
    */
    this.suggestionDisplayHandler /*:SuggestionDisplayHandler*/ = oSuggestionDisplayHandler;

    /**
    * The textbox to capture.
    * @scope private
    */
    this.textbox /*:HTMLInputElement*/ = _g(oComponent.getStyles().getNameSpace() + "ContentCtrl" + oComponent.getComponentId());
    /**
    * The JSON string.
    * @scope private
    */
    this.objArray /*JSON*/ = "";

    //initialize the control
    this.init();

    //Delays the calling of a function for a set time interval
    this.timeoutId = null;
}
/**
* Autosuggests one or more suggestions for what the user has typed.
* If no suggestions are passed in, then no autosuggest occurs.
* @scope private
* @param aSuggestiona A JSON array of suggestion strings.  The JSON object passed in 
* must have a list at the first level.  This list should be the list of items that will be
* displayed in the AutoSuggestion drop down.
*/
AutoSuggestControl.prototype.autosuggest = function (aSuggestions /*:Array JSON*/)
{
    this.layer.style.width = this.textbox.offsetWidth;
    //make sure there's at least one suggestion
    this.objArray = aSuggestions;
    if (aSuggestions && aSuggestions.length > 0)
    {
        this.showSuggestions(aSuggestions);
    } else
    {
        this.hideSuggestions();
    }
};

/**
* Creates the dropdown layer to display multiple suggestions.
* @scope private
*/
AutoSuggestControl.prototype.createDropDown = function ()
{
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
    this.layer.onmouseover = function (oEvent)
    {
        oEvent = oEvent || window.event;
        oTarget = oEvent.target || oEvent.srcElement;
        if (oEvent.type == "mousedown")
        {
            var index = AutoSuggestControl.prototype.indexOf(this, oTarget);
            oThis.selectionHandler(oThis.objArray[index], oThis.textbox, oThis.component);
            oThis.hideSuggestions();
        } else if (oEvent.type == "mouseover")
        {
            var index = AutoSuggestControl.prototype.indexOf(this, oTarget);
            oThis.cur = index;
            oThis.highlightSuggestion(oTarget);
        } else
        {
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
AutoSuggestControl.prototype.getLeft = function () /*:int*/{
    var oNode = this.textbox;
    var iLeft = 0;

    while (oNode && oNode.tagName != "BODY")
    {
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
AutoSuggestControl.prototype.getTop = function () /*:int*/{
    var oNode = this.textbox;
    var iTop = 0;

    while (oNode && oNode.tagName != "BODY")
    {
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
AutoSuggestControl.prototype.handleKeyDown = function (oEvent /*:Event*/)
{
    if (this.layer.style.visibility != "hidden")
    {
        switch (oEvent.keyCode)
        {
            case 38: //up arrow
                this.previousSuggestion();
                break;
            case 40: //down arrow 
                this.nextSuggestion();
                break;
            case 13: //enter
                this.selectionHandler(this.objArray[this.cur], this.textbox, this.component);
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
AutoSuggestControl.prototype.handleKeyUp = function (oEvent /*:Event*/)
{
    var oThis = this;
    var iKeyCode = oEvent.keyCode;

    clearTimeout(this.timeoutId);

    //for backspace (8) and delete (46), shows suggestions without typeahead
    if (iKeyCode == 8 || iKeyCode == 46)
    {
        if (this.textbox.value.length > 0)
            this.timeoutId = setTimeout(function ()
            {
                oThis.queryHandler(oThis, oThis.textbox, oThis.component);
            }, 500);
        else
            this.hideSuggestions();

        //make sure not to interfere with non-character keys
    } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123))
    {
        //ignore
    } else
    {
        //request suggestions from the suggestion provider
        this.timeoutId = setTimeout(function ()
        {
            oThis.queryHandler(oThis, oThis.textbox, oThis.component);
        }, 500);
    }
};

/**
* Hides the suggestion dropdown.
* @scope private
*/
AutoSuggestControl.prototype.hideSuggestions = function ()
{
    this.layer.style.visibility = "hidden";
};

/**
* Highlights the given node in the suggestions dropdown.
* @scope private
* @param oSuggestionNode The node representing a suggestion in the dropdown.
*/
AutoSuggestControl.prototype.highlightSuggestion = function (oSuggestionNode)
{

    for (var i = 0; i < this.layer.childNodes.length; i++)
    {
        var oNode = this.layer.childNodes[i];
        if (oNode == oSuggestionNode || oNode == oSuggestionNode.parentNode)
        {
            oNode.className = "current";
        } else if (oNode.className == "current")
        {
            oNode.className = "";
        }
    }
};

/**
* Initializes the textbox with event handlers for
* auto suggest functionality.
* @scope private
*/
AutoSuggestControl.prototype.init = function ()
{
    //save a reference to this object
    var oThis = this;

    //assign the onkeyup event handler
    this.textbox.onkeyup = function (oEvent)
    {

        //check for the proper location of the event object
        if (!oEvent)
        {
            oEvent = window.event;
        }

        //call the handleKeyUp() method with the event object
        oThis.handleKeyUp(oEvent);
    };

    //assign onkeydown event handler
    this.textbox.onkeydown = function (oEvent)
    {

        //check for the proper location of the event object
        if (!oEvent)
        {
            oEvent = window.event;
        }

        //call the handleKeyDown() method with the event object
        oThis.handleKeyDown(oEvent);
    };

    //assign onblur event handler (hides suggestions)    
    this.textbox.onblur = function ()
    {
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
AutoSuggestControl.prototype.nextSuggestion = function ()
{
    var cSuggestionNodes = this.layer.childNodes;
    if (cSuggestionNodes.length > 0 && this.cur < cSuggestionNodes.length - 1)
    {
        var oNode = cSuggestionNodes[++this.cur];
        this.highlightSuggestion(oNode);
    }
};

/**
* Highlights the previous suggestion in the dropdown and
* places the suggestion into the textbox.
* @scope private
*/
AutoSuggestControl.prototype.previousSuggestion = function ()
{
    var cSuggestionNodes = this.layer.childNodes;
    if (cSuggestionNodes.length > 0 && this.cur > 0)
    {
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
AutoSuggestControl.prototype.showSuggestions = function (aSuggestions /*:Array*/)
{
    var oDiv = null;
    this.layer.innerHTML = "";  //clear contents of the layer
    for (var i = 0; i < aSuggestions.length; i++)
    {
        oDiv = document.createElement("div");
        if (i == 0)
        {
            oDiv.className = "current";
        }
        this.cur = 0;
        var domText = this.suggestionDisplayHandler(aSuggestions[i], this.textbox.value);
        oDiv.innerHTML = domText;
        oDiv.appendChild(document.createTextNode(""));
        this.layer.appendChild(oDiv);
    }

    this.layer.style.left = this.getLeft() + "px";
    this.layer.style.top = (this.getTop() + this.textbox.offsetHeight) + "px";
    this.layer.style.visibility = "visible";
    this.layer.style.position = "absolute";
};

AutoSuggestControl.prototype.indexOf = function (parent, el)
{

    var nodeList = parent.childNodes;
    for (var i = 0; i < nodeList.length; i++)
    {
        var oNode = nodeList[i];
        //Parent Node grabs the BODY element if user clicked on a bolded section of the suggestions
        if (oNode == el || oNode == el.parentNode)
        {
            return i;
        }
    }
    return -1;
};

AutoSuggestControl.prototype.highlight = function (value, term)
{
    return "<strong>" + value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1").split(" ").join("|") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "</strong>$1<strong>") + "</strong>";
};
