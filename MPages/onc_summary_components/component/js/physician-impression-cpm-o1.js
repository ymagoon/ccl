/**
 * Create the component style object which will be used to style various aspects of our component
 */
function PhysicianImpressionsCPMComponentStyle(){
    this.initByNamespace("piCPM");
}

PhysicianImpressionsCPMComponentStyle.inherits(ComponentStyle);

/**
 * @constructor
 * Initialize the Existing Orders Intelligent Ordering Component
 * @param {criterion} criterion - The criterion object contains information needed to render the component
 */
function PhysicianImpressionsCPMComponent(criterion){
    var myi18n = i18n.discernabu.physician_impression_cpm_o1;
    this.setCriterion(criterion);
    this.setStyles(new PhysicianImpressionsCPMComponentStyle());
    this.setScope(1);
    this.setLabel(myi18n.LABEL);

    //Set timers
    this.setDocumentationTimerName("MPG.PHYS-IMPRESSION.CPM");
    this.setComponentLoadTimerName("USR:" + this.getDocumentationTimerName() + " - load component");
    this.setComponentRenderTimerName("ENG:" + this.getDocumentationTimerName() + " - render component");
    //Will contain the ckeditor
    this.m_editor = null;

    this.m_workflowId = 0;
    this.m_existingDocumentation = "";

}

/**
 * Inherits from the DocumentationBaseComponent which inherits from MPageComponent
 */
PhysicianImpressionsCPMComponent.prototype = new DocumentationBaseComponent();
PhysicianImpressionsCPMComponent.prototype.constructor = DocumentationBaseComponent;

CPMMPageComponent.attachMethods(PhysicianImpressionsCPMComponent);

/**
 * Sets the existing documentation text
 * Parameter must be a string type
 * @param {string} doc - previously saved documentation
 */
PhysicianImpressionsCPMComponent.prototype.setExistingDocumentation = function(doc){
    if (typeof doc !== 'string'){
        throw new Error("Type Error: Non-string 'doc' passed into 'setExistingDocumentation' method on 'PhysicianImpressionsCPMComponent'");
    }
    this.m_existingDocumentation = doc;
};

/**
 * Gets the existing documentation text
 * @returns {string} - existing documentation text
 */
PhysicianImpressionsCPMComponent.prototype.getExistingDocumentation = function(){
    return this.m_existingDocumentation;
};

/**
 * Removes event listeners and clears 'dirty' flag
 * This method gets called when the view is disposed
 */
PhysicianImpressionsCPMComponent.prototype.cleanUp = function(){
    var compId = this.getStyles().getId();
    CPMMPageComponent.prototype.cleanUp.call(this, null);
    //Remove listener - prevents memory leaks from having component stored in CERN_EventListener closure
    CERN_EventListener.removeListener(this, EventListener.EVENT_DYN_DOC_UPDATE, this.processWorkflowInfo, this);
    //Remove event handler
    var jqCompContent = $("#" + compId).children(".sec-content");
    jqCompContent.off("keyup.piCPM");
    //Remove editor if it exists - it seems sometimes editor isn't destroyed when component is destroyed.  Possible closure issue somewhere.
    this.resetDirty();
    var editor = this.getEditorInstance();
    if (editor){
        editor.destroy();
    }
};

/**
 * Handles the response from the component's data retrieval script
 * Sets pre-existing documentation, workflow id, and privs
 * @param {object} reply - ScriptReply from data retrieval script
 */
PhysicianImpressionsCPMComponent.prototype.handleGetCPMDocumentation = function(reply){
    if (!reply){
        throw new Error("No 'reply' passed into 'handleGetCPMDocumentation' method on 'PhysicianImpressionsCPMComponent'");
    }

    var replyStatus = reply.getStatus();
    if (replyStatus !== 'S' && replyStatus !== 'Z'){
        this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), "CPM Documentation Retrieval failed"), "");
        return;
    }
    var response = reply.getResponse();
    //Get doc priv
    var canAddDoc = !!response.PRIV_ADD_DOC;
    this.setWorkflowId(response.WORKFLOW_ID || 0);
    //Store off data if data was returned by the script
    if (!canAddDoc){
        var noPrivMsg = "<span class='res-none'>" + i18n.discernabu.physician_impression_cpm_o1.NO_PRIVS + "</span>";
        this.finalizeComponent(noPrivMsg, "");
    }
    this.setExistingDocumentation("");
    if (replyStatus === 'S'){
        var meaning;
        var concept = this.getConceptMean() || this.getConceptDisp();
        concept = concept.replace(/[^\w]+/g, "");
        var cpmList = response.CPM_LIST || [];
        var cLen = cpmList.length;
        var i;
        for (i = 0; i < cLen; i++){
            meaning = cpmList[i].CPM_MEAN || "";
            if (meaning === concept){
                this.setExistingDocumentation(cpmList[i].LONG_TEXT);
                break;
            }
        }
    }

    this.createTextEditor();
};

/**
 * Sets up and initializes CKEditor
 */
PhysicianImpressionsCPMComponent.prototype.createTextEditor = function(){
    var self = this;
    var compId = this.getStyles().getId();
    var criterion = this.getCriterion();
    var jqDocContainer = $("#" + compId + "DocContent");
    var existingDocumentation = this.getExistingDocumentation();
    var docContainerDOM;
    var editor;
    var configObj;

    if (existingDocumentation){
        //Place existing documentation where text editor will be created
        jqDocContainer.html(existingDocumentation);
    }

    docContainerDOM = (jqDocContainer.length) ? jqDocContainer.get(0) : null;

    //Add ckeditor
    var criterionLocale = criterion.locale_id;
    var basePath = criterion.static_content + '/ckeditor/';

    if (!docContainerDOM || docContainerDOM.nodeType !== 1){
        return;
    }

    editor = this.getEditorInstance();
    if (editor){
        editor.destroy();
    }

    if ((typeof CKEDITOR !== 'undefined') && CKEDITOR){
        window.CKEDITOR_BASEPATH = basePath;
        configObj = {};

        CKEDITOR.basePath = basePath;
        CKEDITOR.editorConfig(configObj);
        criterionLocale = criterionLocale.toLowerCase();
        switch (criterionLocale){
            case 'fr_fr':
                criterionLocale = 'fr';
                break;
            case 'en_us':
                criterionLocale = 'en';
                break;
            case 'en_au':
                criterionLocale = 'en-au';
                break;
            case 'es_es':
                criterionLocale = 'es';
                break;
            case 'de_de':
                criterionLocale = 'de';
                break;
            case 'en_gb':
                criterionLocale = 'en-gb';
                break;
            default:
                criterionLocale = 'en';
                break;
        }

        configObj.language = criterionLocale;
        configObj.baseHref = basePath;
        configObj.startupFocus = false;
        configObj.height = "";

        configObj.preSaveFunction = this.getPreSaveFunction();

        configObj.autosaveFunction = function(ckeditorContent, statusCallback){
            self.saveText(ckeditorContent, statusCallback);
        };

        configObj.setDirtyFunction = function(){
            self.setDirty();
        };

        configObj.resetDirtyFunction = function(){
            self.resetDirty();
        };

        configObj.placeholderText = "";
        CKEDITOR.config.customConfig = "";
        configObj.removePlugins = 'font';
        CKEDITOR.getUrl = function(resource){
            if (!CKEDITOR.basePathStaticContent){
                CKEDITOR.basePathStaticContent = JSON.parse(m_criterionJSON).CRITERION.STATIC_CONTENT + "/ckeditor/";
            }
            if (resource.indexOf(CKEDITOR.basePathStaticContent) === -1 && resource.indexOf('/') !== 0){
                resource = CKEDITOR.basePathStaticContent + resource;
            }
            //Add timestamp
            if (this.timestamp && resource.charAt(resource.length - 1) != '/' && !( /[&?]t=/ ).test(resource)){
                resource += ( resource.indexOf( '?' ) >= 0 ? '&' : '?' ) + 't=' + this.timestamp;
            }
            return resource;
        };

        CKEDITOR.plugins.initializePlugins(configObj, function(){
            self.setEditorInstance(CKEDITOR.replace(docContainerDOM, configObj));
            var jqComponent = $("#" + compId);
            var jqScrollContainer = jqComponent.closest(".cpm");
            var jqCompContent = jqComponent.children(".sec-content");

            jqCompContent.off("click.piCPM");
            jqCompContent.on("click.piCPM", "#cke_" + compId + "DocContent", function(event){
                self.elementAutoScroll($("#cke_" + compId + "DocContent"), jqScrollContainer);
            });
        });

    }
};

/**
 * Calls the Data Retrieval script
 * Asynchronous AJAX call
 */
PhysicianImpressionsCPMComponent.prototype.initializeInfo = function(){
    var self = this;
    var criterion = this.getCriterion();
    var request;
    var sendAr = [];
    var loadTimer = new RTMSTimer(this.getComponentLoadTimerName(), criterion.category_mean);
    var renderTimerFailed = false;

    var concept = this.getConceptMean() || this.getConceptDisp();
    concept = concept.replace(/[^\w]+/g, "");
    sendAr.push(
        "^MINE^"
        , criterion.person_id + ".0"
        , criterion.encntr_id + ".0"
        , criterion.provider_id + ".0"
        , criterion.ppr_cd + ".0"
        , "^" + concept + "^"
    );

    request = new ScriptRequest();
    request.setProgramName("MP_GET_CPM_PI");
    request.setParameterArray(sendAr);
    request.setLoadTimer(loadTimer);
    request.setResponseHandler(function(scriptReply){
        //Create render timer
        var renderTimer = new RTMSTimer(self.getComponentRenderTimerName(), criterion.category_mean);
        renderTimer.start();
        try {
            self.handleGetCPMDocumentation(scriptReply);
        } catch (err){
            self.finalizeComponent(self.generateScriptFailureHTML(), "");
            renderTimer.fail();
            renderTimerFailed = true;
            throw (err);
        } finally {
            if (!renderTimerFailed){
                renderTimer.stop();
            }
        }
    });
    request.performRequest();
};

/*
 Regex helpers
 */
/**
 *Converts a paragraph element to a div element
 * @params {string} html - an HTML string
 * @returns {string} - converted HTML string
 */
PhysicianImpressionsCPMComponent.prototype.convertParagraphToDiv = function(html){
    var pStartTagRegex = /<p(.*?)>/gi;
    var pEndTagRegex = /<\/p>/gi;
    var divBlankRegex = /<div(.*?)>&nbsp;<\/div>/gi;

    var convertedHtml = html.replace(pStartTagRegex, "<div$1>");
    convertedHtml = convertedHtml.replace(pEndTagRegex, "</div>");
    convertedHtml = convertedHtml.replace(divBlankRegex, "<div$1><span>&nbsp;</span></div>");
    return convertedHtml;
};

/**
 *Converts a div element to a paragraph element
 * @params {string} html - an HTML string
 * @returns {string} - converted HTML string
 */
PhysicianImpressionsCPMComponent.prototype.convertDivToParagraph = function(html){
    var divStartTagRegex = /<div(.*?)>/gi;
    var divEndTagRegex = /<\/div>/gi;

    var convertedHtml = html.replace(divStartTagRegex, "<p$1>");
    convertedHtml = convertedHtml.replace(divEndTagRegex, "</p>");
    return convertedHtml;
};

/**
 * Prepares an HTML string for conversion to RTF
 * The back-end service that converts HTML to RTF requires the HTML to follow certain standards that this method enforces
 * @params {string} html - an HTML string
 * @returns {string} - prepped HTML string
 */
PhysicianImpressionsCPMComponent.prototype.prepHtmlForRtf = function(html){
    //Since we're going the smart template approach, we need to massage the HTML generated so it can be converted to RTF
    var idAttrRegex = /(<div[^>]*id=)([\d\w\$\_\:]*)/ig;
    var startTagRegex = /(<\w*)/ig;
    var endTagRegex = /(<\/[^>]*)/ig;
    var stylesRegex = /(<\w*[^>]*style=["|'])([^\"|^\']*)/ig;
    var hexColorRegex = /#[0-9a-f]*/ig;

    //Find all divs with ids, and add quotes around the ID value if not already present (required for IE8)
    html = html.replace(idAttrRegex, function(match, captureGroup1, captureGroup2){
        var fixedId = captureGroup1;
        if (captureGroup2){
            //an ID was found
            fixedId += '"' + captureGroup2 + '"';
        }
        return fixedId;
    });

    //Convert all the opening HTML tags to lowercase (required for IE8)
    html = html.replace(startTagRegex, function(match){
        return match.toLowerCase();
    });

    //Convert all the closing HTML tags to lowercase (required for IE8)
    html = html.replace(endTagRegex, function(match){
        return match.toLowerCase();
    });

    //Convert all the style attributes to lowercase (Required for IE8)
    //Also converts hexadecimal colors to RGB
    html = html.replace(stylesRegex, function(match, startOfTagToStyles, styleAttributes){
        var fixedStyles = startOfTagToStyles;

        if (styleAttributes){
            //Convert hex colors to rgb while we're in here
            styleAttributes = styleAttributes.replace(hexColorRegex, function(match){
                var value = match.replace("#", "");
                //Convert the hexadecimal string to a hexadecimal number
                var hex = parseInt(value, 16);
                //For hexadecimal colors, every 2 digits is a color.
                //We can use bit shifting to get the base10 value of each color starting from the left
                //We also compare it to 255, the max value fr colors using RGB, to get the base10 value we need
                var r = (hex >> 16) & 255;
                var g = (hex >> 8) & 255;
                var b = hex & 255;
                return "rgb(" + r + "," + g + "," + b + ")";
            });

            //Now we can lowercase the attributes
            fixedStyles += styleAttributes.toLowerCase();
            //Add an ending semi-colon if it isn't there already
            if (fixedStyles.charAt(fixedStyles.length - 1) !== ";"){
                fixedStyles += ";";
            }
        }
        return fixedStyles;
    });

    return html;
};

/**
 * Calls the CCL script to save text contents
 * @params {string} text - CKEditor contents
 * @returns {function} statusCallback - callback function to call once script has returned
 */
PhysicianImpressionsCPMComponent.prototype.cclSaveText = function(text, statusCallback){
    var criterion = this.getCriterion();
    var request;
    var sendAr = [];
    var self = this;
    var ddi18n = i18n.discernabu.documentation_base;

    //Staleness check
    if (this.isStaleWorkflow()){
        MP_Util.AlertConfirm(
            ddi18n.REFRESH_REQUIRED_MSG,
            ddi18n.REFRESH_REQUIRED_TITLE,
            i18n.discernabu.CONFIRM_OK,
            null,
            false,
            null
        );
        //Disable save button
        //In order to save, the user would have to enter new content or click refresh, if they enter new content, it will trigger that dialog box again.
        var editor = this.getEditorInstance();
        $('#' + editor.container.$.id + ' button.autosave.save').attr('disabled', 'disabled');

        //Suppress framework level dirty flag
        this.resetDirty();

        //Reset editor instance as clean?
        editor.resetDirty();

        //Remove busy indicator
        this.setLastSaveText(null);

        return;
    }

    var concept = this.getConceptMean() || this.getConceptDisp();
    concept = concept.replace(/[^\w]+/g, "");

    sendAr.push(
        "^MINE^"
        , criterion.person_id + ".0"
        , criterion.encntr_id + ".0"
        , criterion.provider_id + ".0"
        , this.getWorkflowId() + ".0"
        , "^" + concept + "^"
        , "^" + text + "^"
    );

    request = new ScriptRequest();
    request.setProgramName("MP_SAVE_CPM_PI");
    request.setParameterArray(sendAr);
    request.setResponseHandler(function(scriptReply){
        var df = MP_Util.GetDateFormatter();
        var lastSavedText = "";

        if (scriptReply.getStatus() === 'S'){
            //Suppress framework level dirty flag
            self.resetDirty();
            //Reset editor instance as clean
            self.getEditorInstance().resetDirty();

            //update last saved text
            lastSavedText = i18n.discernabu.documentation_base.LAST_SAVE + df.format(new Date(), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
            self.setLastSaveText(lastSavedText);

            if (typeof statusCallback === 'function'){
                statusCallback("S");
            }
            return;
        }

        //Content wasn't saved
        lastSavedText = ddi18n.SAVE_FAILED_MSG;
        self.setLastSaveText(lastSavedText);

        if (typeof statusCallback === 'function'){
            statusCallback("F");
        }
    });
    request.performRequest();
};

/**
 * Saves the CKEditor contents
 * Processes the CKEditor contents and calls method to make AJAX call to save
 * @param {string} ckeditorContent - CKEditor contents text
 * @param {function} statusCallback - callback function to call once AJAX call has returned
 */
PhysicianImpressionsCPMComponent.prototype.saveText = function(ckeditorContent, statusCallback){
    //Replace spaces caused by escapes
    ckeditorContent = ckeditorContent.replace(/\s/gi, " ");
    //Get only the body contents
    ckeditorContent = ckeditorContent.replace(/(.*<body>)(.*)(<\/body>.*)/gi, function(match, c1, c2, c3){
        return c2;
    });

    var modifiedCkeditorContent = ckeditorContent.replace(/\$/g, "&#36;");
    modifiedCkeditorContent = modifiedCkeditorContent.replace(/\^/g, "&#94;");

    //Replace all paragraph tags with divs
    modifiedCkeditorContent = this.convertParagraphToDiv(modifiedCkeditorContent);

    //Massage the HTML since it needs to be converted to RTF in downstream processes
    modifiedCkeditorContent = this.prepHtmlForRtf(modifiedCkeditorContent);

    this.cclSaveText(modifiedCkeditorContent, statusCallback);
};

/**
 * Attempts fully show an element within a scroll container
 * @param {jQuery} jqElement - jQuery element to make fully visible
 * @param {jQuery} jqScrollContainer - jQuery scroll container that is an ancestor to the target element
 */
PhysicianImpressionsCPMComponent.prototype.elementAutoScroll = function(jqElement, jqScrollContainer){
    if (!jqElement || !jqElement.length || !jqScrollContainer || !jqScrollContainer.length){
        return;
    }
    //Get DOM elements' offsets relative to the document
    var containerOffset = jqScrollContainer.offset();
    var elementOffset = jqElement.offset();

    var containerHeight = jqScrollContainer.height();
    //Include padding in the element's height
    var elementHeight = jqElement.outerHeight(false);

    var containerTop = containerOffset.top;
    var elementTop = elementOffset.top;
    var containerBottom = containerTop + containerHeight;
    var elementBottom = elementTop + elementHeight;

    var containerScrollTop = jqScrollContainer.scrollTop();
    var delta = 0;

    if (elementTop >= containerTop && elementBottom <= containerBottom){
        //No scrolling!
        return;
    } else if (elementTop <= containerTop && elementBottom >= containerBottom){
        //It won't fit!
        return;
    } else if (elementTop < containerTop){
        delta = containerTop - elementTop;
        jqScrollContainer.scrollTop(containerScrollTop - delta);
    } else if (elementBottom > containerBottom){
        delta = elementBottom - containerBottom;
        jqScrollContainer.scrollTop(containerScrollTop + delta);
    }
};

PhysicianImpressionsCPMComponent.prototype.retrieveComponentData = function(){
    var self = this;
    var ddi18n = i18n.discernabu.documentation_base;
    var ext = external;
    var hasObjectFactory = ext && ("DiscernObjectFactory" in ext);
    var hasAutoText = hasObjectFactory && (ext.DiscernObjectFactory("AUTOTEXTHELPER"));
    var hasClipboard = hasObjectFactory && (ext.DiscernObjectFactory("CLIPBOARDHELPER"));
    var hasSpellCheck = hasObjectFactory && (ext.DiscernObjectFactory("SPELLCHECKHELPER"));
    var dynDoc = hasObjectFactory && (ext.DiscernObjectFactory("DYNDOC"));
    var hasDynDoc = (dynDoc && ("OpenDynDocByWorkflowId" in dynDoc));

    if (!hasAutoText || !hasClipboard || !hasSpellCheck || !hasDynDoc){
        MP_Util.LogError("Dynamic Documentation unavailable for this component: " + this.getStyles().getId());
        this.finalizeComponent(ddi18n.DYN_DOC_UNAVAILABLE, "");
        return;
    } else {
        this.renderComponent();
    }

    //Subscribe to dyn doc broadcasts
    BroadcastDispatcher.subscribe(BroadcastDispatcher.DYN_DOC_REFRESH, function(payload){
        var editor = self.getEditorInstance();
        if (editor) {
            editor.destroy();
        }
        self.renderComponent();
    });
};

/**
 * Renders the component and calls method to retrieve dyn doc data
 */
PhysicianImpressionsCPMComponent.prototype.renderComponent = function(){
    var html = "";

    html += "<div id='" + this.getStyles().getId() + "DocContent' class='documentation-content'></div>";
    //Add placeholder for CKEditor
    this.finalizeComponent(html, "");

    this.initializeInfo();
};

CPMController.prototype.addComponentMapping("IMPRESSIONS", PhysicianImpressionsCPMComponent);