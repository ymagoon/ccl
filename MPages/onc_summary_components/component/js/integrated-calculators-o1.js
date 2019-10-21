/****************************
 * integrated-calculators-o1
 ****************************/
/**
 * Create the component style object which will be used to style various aspects of our component
 */
function IntMedCalcComponentStyle() {
    this.initByNamespace("IntMedCalc");
}
IntMedCalcComponentStyle.inherits(ComponentStyle);

/**
 * Initialized the IntMedCalcComponent object
 * @param {JSON} criterion Object containing information from Bedrock and about the selected person
 */
function IntMedCalcComponent(criterion) {
    this.setCriterion(criterion);
    this.setStyles(new IntMedCalcComponentStyle());
    //Set the timer names so the architecture will create the correct timers for our use
    this.setComponentLoadTimerName("USR:MPG_Integrated-Calculators-o1-LoadComponent");
    this.setComponentRenderTimerName("ENG:MPG_Integrated-Calculators-o1-RenderComponent");
    this.setIncludeLineNumber(false);
    this.mcFavObj = {
        "favCalc": {
            "favorite": []
        }
    };
    this.limitingRows = true;
    this.curTab = "";
    this.htmlLoc = "";
    this.localElevation = "";
    this.RespiratoryQuotient = "";
}

/**
 * Making the component an MPageComponent
 * @type {MPageComponent}
 */
IntMedCalcComponent.prototype = new MPageComponent();
IntMedCalcComponent.prototype.constructor = MPageComponent;

/**
 * Calls mp_get_medcalc_data with the given criterion
 * @return {null}
 */
IntMedCalcComponent.prototype.retrieveComponentData = function() {
    var lookBackUnits = this.getLookbackUnits();
    var lookBackUnitTypeFlag = this.getLookbackUnitTypeFlag();
    var sendAr = [];
    var criterion = this.getCriterion();
    var sEncntr = (this.getScope() === 2) ? criterion.encntr_id + ".0" : "0.0";

    sendAr.push("^MINE^", criterion.person_id + ".0", sEncntr, criterion.provider_id + ".0", criterion.ppr_cd + ".0", lookBackUnits, lookBackUnitTypeFlag, "^" + criterion.category_mean + "^");
    MP_Core.XMLCclRequestWrapper(this, "MP_GET_MEDCALC_DATA", sendAr, true);

    var userPrefs = this.getPreferencesObj();
    if (userPrefs !== null && userPrefs.favCalc.favorite !== 0) {
        this.mcFavObj.favCalc.favorite = userPrefs.favCalc.favorite;
    }
};

/**
 * Creates the mappings between the Bedrock settings and the related setters
 * @return {null}
 */
IntMedCalcComponent.prototype.loadFilterMappings = function() {
    //Add the filter mapping object for the Catalog Type Codes
    this.addFilterMappingObject("MEDCALC_TOC_LINK", {
        setFunction: this.setTabLink,
        type: "STRING",
        field: "FREETEXT_DESC"
    });

    this.addFilterMappingObject("MEDCALC_HTML_LINK", {
        setFunction: this.setHtmlLocation,
        type: "STRING",
        field: "FREETEXT_DESC"
    });

    this.addFilterMappingObject("MEDCALC_ELEVATION", {
        setFunction: this.setElevation,
        type: "STRING",
        field: "FREETEXT_DESC"
    });
    this.addFilterMappingObject("MEDCALC_RESP_QUOT", {
        setFunction: this.setRespQuot,
        type: "STRING",
        field: "FREETEXT_DESC"
    });
};

/**
 * Setter for the tab that the Calculators Page link will take the user to
 * @param {String} link The name of the tab to go to
 */
IntMedCalcComponent.prototype.setTabLink = function(link) {
    this.tabLink = link;
};

/**
 * Setter for the root URL of the MedCalc Calculator files
 * @param {String} hLoc The URL
 */
IntMedCalcComponent.prototype.setHtmlLocation = function(hLoc) {
    if (hLoc.indexOf("http:") === -1) {
        this.htmlLoc = hLoc.replace(/&#092;/g, "\\") + "\\";
    } else {
        this.htmlLoc = hLoc.replace(/&#047;/g, "/") + "/";
    }
};
/**
 * Getter for the URL of the MedCalc Calculator files
 * @return {String} The URL of the MedCalc Calculator files
 */
IntMedCalcComponent.prototype.getHtmlLocation = function() {
    return (this.htmlLoc);
};
/**
 * Setter for the local elevation for use in calculators that need the elevation
 * @param {String} elev The elevation provided in Bedrock
 */
IntMedCalcComponent.prototype.setElevation = function(elev) {
    this.localElevation = elev;
};
/**
 * Setter for the respiratory quotient
 * @param {String} respQ Respiratory quotient defined in Bedrock
 */
IntMedCalcComponent.prototype.setRespQuot = function(respQ) {
    this.RespiratoryQuotient = respQ;
};

/**
 * Funtion that creates the layout of the MedCalc component
 * @param  {JSON} recordData JSON returned by the mp_get_medcalc_data script
 * @return {null}
 */
IntMedCalcComponent.prototype.renderComponent = function(recordData) {
    var data = recordData;
    var criterion = this.getCriterion();
    var catmean = criterion.category_mean;
    var minRows = 5; // Minimum rows to show on load
    var ICi18n = i18n.discernabu.integrated_calculators_o1;
    var thisComponent = this;
    var compId = thisComponent.getComponentId();

    var timerRenderComponent = null;
    /***********************************************************************************************************************************************************
     * Start Private Funtions
     **********************************************************************************************************************************************************/
    /**
     * Function that creates new dom elements
     * @param  {String} type       The type of dom element to create
     * @param  {Object} options A JSON object of additional properites and attributes to apply to the element
     * @return {Object}            The new element created
     */
    function newEl(type, options) {
        var el = document.createElement(type),
            opt = options || {},
            attr = opt.attributes || null;
        el.id = opt.id || "";
        el.className = opt.className || "";
        for (var key in attr) {
            el.setAttribute(key, attr[key]);
            }
        if (opt.innerHTML) {
            el.innerHTML = opt.innerHTML;
        }
        if (opt.text) {
            el.appendChild(document.createTextNode(opt.text));
        }
        if (opt.parent) {
            opt.parent.appendChild(el);
        }
        return el;
    }
    /**
     * Removes a class or list of classes from an element
     * @param  {string} className A space delimited list of classes
     * @return {undefined}        undefined
     */
    function removeClass(className) {
        if (this.classList) {
            var classNames = className.split(" ");
            for (var i = 0, len = classNames.length; i < len; i++) {
                this.classList.remove(classNames[i]);
            }
        } else {
            this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
    /**
     * Add a class or list of classes from an element
     * @param {string} className A space delimited list of classes
     * @return {undefined} undefined
     */
    function addClass(className) {
        if (this.classList) {
            var classNames = className.split(" ");
            for (var i = 0, len = classNames.length; i < len; i++) {
                this.classList.add(classNames[i]);
            }
        } else {
            this.className += ' ' + className;
        }
    }
    /**
     * Replaces a class with a different class
     * @param  {string} oldClass A space delimited list of classes to remove
     * @param  {string} newClass A space delimited list of classes to add
     * @return {undefined}          undefined
     */
    function replaceClass(oldClass, newClass) {
        removeClass.call(this, oldClass);
        addClass.call(this, newClass);
    }

    /**
     * Function that handles changes in textboxes
     * @param  {Object} e The event triggered by the change
     * @return {null}
     */
    function inputChanged(e) {
        var target = $(e.target)[0];
        var targetVal = null;
        var targetRow = target.parentNode;
        var runCalc = true;
        var targetDD = null;
        var calcName = null;
        var calcRow = null;
        var rowData = null;
        var targetRowIndex = null;
        var curParamObj = null;
        var dateCell = null;
        var renew = null;

        while (targetRow.tagName !== "TR") {
            targetRow = targetRow.parentNode;
        }

        targetDD = targetRow.parentNode; // Parent dd
        while (targetDD.tagName !== "DD") {
            targetDD = targetDD.parentNode;
        }

        calcName = targetDD.id.replace("_params", ""); // Calcualtor name
        calcRow = contentDiv.querySelector("#" + calcName + "_tr"); // Calculator row
        rowData = JSON.parse(calcRow.getAttribute("data-calc")); // Calculator information
        targetRowIndex = parseInt(targetRow.getAttribute("data-paramindex"));
        curParamObj = rowData.params[targetRowIndex];

        if (curParamObj.name === "Gender") {
            targetVal = target.options[target.selectedIndex].value;

            // Update params to reflect changes
            if (targetVal === "1") {
                curParamObj.curValue = "Male";
            } else if (targetVal === "0") {
                curParamObj.curValue = "Female";
            } else {
                curParamObj.curvalue = "";
            }

            calcRow.setAttribute("data-calc", JSON.stringify(rowData));
        } else {
            targetVal = target.value;
            if (targetVal !== curParamObj.curValue) {
                curParamObj.curValue = targetVal;
                curParamObj.curDate = new Date();

                dateCell = targetRow.lastChild;
                dateCell.innerHTML = MP_Util.CalcWithinTime(new Date());

                calcRow.setAttribute("data-calc", JSON.stringify(rowData));
            } else {
                runCalc = false;
            }
        }

        renew = calcRow.querySelector("#" + calcName + "_renew");
        if (renew.className.indexOf("intCalc-icon") === -1) {
            addClass.call(renew, "intCalc-icon");
        }

        if (runCalc) {
            thisComponent.runCalculations(thisComponent, calcName, calcRow, true);
        }
    }

    /**
     * Creates and displays the modal dialog for the Calculator Details link
     * @param  {String} custCont The url of the MedCalc calculator files
     * @param  {String} details  The HTML that will be displayed in the modal dialog
     * @return {null}
     */
    function displayModalDetail(custCont, details) {
        var medCalcModalDialog = MP_ModalDialog.retrieveModalDialogObject("intCalc_modal_medcalc_details_" + compId);
        var modalBodyDetails = null;
        var cssLink = null;
        var pubmedSrc = custCont + "pubmed.gif";
        var ncbiSrc = custCont + "ncbi.gif";
        var images = null;
        var x = 0;
        var disclaimer = newEl("a", {
            className: "intCalc-clickable",
            attributes: {
                "href": thisComponent.htmlLoc + "disclaimer.htm",
                "target": "_blank"
            },
            text: "Legal Notices and Disclaimers"
        });

        MP_ModalDialog.showModalDialog("intCalc_modal_medcalc_details_" + compId);
        modalBodyDetails = document.getElementById("intCalc_modal_medcalc_body_details_" + compId);
        cssLink = "<link href='" + thisComponent.htmlLoc + "medcalcstyles.css' type='text/css' rel='stylesheet' />";
        details = cssLink + details + disclaimer.outerHTML;
        medCalcModalDialog.setBodyHTML(details);

        images = modalBodyDetails.querySelectorAll("img[src*='pubmed.gif'],img[src*='ncbi.gif']");
        for (x = images.length; x--;) {
            if (images[x].src.indexOf("pubmed.gif") >= 0) {
                images[x].setAttribute("src", pubmedSrc);
            } else {
                images[x].setAttribute("src", ncbiSrc);
            }
        }
    }

    /**
     * Display clinical criteria calculators in a modal window
     * @param  {String} calcName Name of the calculator we are opening
     * @param  {String} custCont URL of the MedCalc calculator files
     * @param  {String} calcLoc  Full URL to the MedCalc calculator file we are going to open
     * @return {null}
     */
    function displayMCPages(calcName, custCont, calcLoc) {
        $.ajax({
            cache: false,
            type: "GET",
            crossDomain: false,
            url: calcLoc,
            data: "{'post'='now'}",
            traditional: true,
            contentType: "application/xml; charset=utf-8",
            dataType: "html"
        }).done(function(data) {
            if (data) {
                data = data.replace(/self.setTimeout/g, "null; //self.setTimeout"); // Removing timed event to prevent error on close
                resetButton.setOnClickFunction(function() {
                    var pageReset = $("#intCalc_modal_medcalc_body_" + compId).find("input[name='reset']");
                    if (pageReset.length > 0) {
                        pageReset.click();
                    } else {
                        $("#intCalc_modal_medcalc_body_" + compId).find("input[type='text']").each(function() {
                            $(this).val("");
                        });
                    }
                });

                applyButton.setOnClickFunction(function() {
                    if (xmltxt) {
                        var resultTdId = calcName + "_value",
                            xmlDoc;

                        if (window.DOMParser) {
                            var parser = new DOMParser();
                            xmlDoc = parser.parseFromString(xmltxt, "text/xml");
                        } else { // Internet Explorer
                            try {
                                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                                xmlDoc.async = false;
                                xmlDoc.loadXML(xmltxt);
                            } catch (err) {
                                MP_Util.LogJSError(err, null, "integrated-calculators-o1.js", "MedCalc:displayMCPages - apply button xml parse error");
                            }
                        }

                        IntMedCalcComponent.prototype.renderXML(thisComponent, xmltxt, resultTdId, contentDiv.querySelector("#" + calcName + "_tr"));

                    } else {
                        MP_Util.LogJSError(null, null, "integrated-calculators-o1.js", "MedCalc:displayMCPages - apply button no xml returned");
                    }
                });
                var medCalcModalDialog = MP_ModalDialog.retrieveModalDialogObject("intCalc_modal_medcalc_" + compId);
                MP_ModalDialog.updateModalDialogObject(modalMC);

                MP_ModalDialog.showModalDialog("intCalc_modal_medcalc_" + compId);
                var modalBody = $("#intCalc_modal_medcalc_body_" + compId);
                data = data.replace("medcalcstyles.css", thisComponent.htmlLoc + "medcalcstyles.css");
                medCalcModalDialog.setBodyHTML(data);

                modalBody.find("medCalcTitleBox").css("border", "0px");
                modalBody.find("input[type=button]").addClass("hidden");
                modalBody.find("input[type=reset]").addClass("hidden");
                modalBody.find("input[type=checkbox]").addClass("intCalc-modal-chxbox-pad");
                modalBody.find("#calc_input").addClass("intCalc-mc-input");
                modalBody.find("#calc_result").addClass("intCalc-mc-result");
                var pubmedSrc = custCont + "pubmed.gif";
                var ncbiSrc = custCont + "ncbi.gif";
                modalBody.find("img[src*='pubmed.gif']").attr("src", pubmedSrc);
                modalBody.find("img[src*='ncbi.gif']").attr("src", ncbiSrc);
                var newHref = custCont + "disclaimer.htm";
                modalBody.find("a[href*='disclaimer.htm']").attr("href", newHref);
                $("#" + calcName + "_intCalc_modal_medcalc_" + compId + "footerbtnCont").removeClass("dyn-modal-button-container");

                $("#resetButton_" + compId).addClass("intCalc-unit-left");
                $("#modal_medcalc_cancel_" + compId).addClass("intCalc-unit-right");
                $("#applyButton_" + compId).addClass("intCalc-unit-right");
            } else {
                MP_Util.LogJSError(null, null, "integrated-calculators-o1.js", "MedCalc:displayMCPages - calculator not found");
            }
        });
    }

    /**
     * Filters the rows based on the tab that is selected
     * @param  {Object} comp Reference to the component
     * @return {null}
     */
    function filterRows(comp) {
        var curTable = contentDiv.querySelector("#table_body");
        var curRow = null;
        var calcCount = 0;
        var calcFilter = "";
        var tableRows = curTable.childNodes;
        var calcId = "";
        var curCheck = null;
        var calcSelected = false;

        for (var x = 0, len = tableRows.length; x < len; x++) {
            curRow = tableRows[x];
            calcFilter = curRow.getAttribute("data-filters");
            if ((calcFilter && calcFilter.indexOf(comp.curTab) >= 0) && (calcCount < minRows || !comp.limitingRows)) {
                calcCount += 1;
                if (curRow.className.indexOf("hidden") >= 0) {
                    removeClass.call(curRow, "hidden");
                }
                calcId = curRow.id.replace("_tr", "");
                curCheck = curRow.querySelector("#" + calcId + "_chk");
                if (curCheck.checked && !curCheck.disabled) {
                    calcSelected = true;
                }
            } else {
                if (curRow.className.indexOf("hidden") === -1) {
                    addClass.call(curRow, "hidden");
                }
            }
        }
        if (calcSelected) {
            contentDiv.querySelector("#intCalc_copyButton").removeAttribute("disabled");
        } else {
            contentDiv.querySelector("#intCalc_copyButton").setAttribute("disabled", "disabled");
        }
    }

    /**
     * Formats the looks of the rows based on the selected tab
     * @param  {Object} comp Reference to the component
     * @return {null}
     */
    function formatRows(comp) {
        var curTable = contentDiv.querySelector("#table_body");
        var tableHeader = contentDiv.querySelector("#tab_content_header");
        var curRow = null;
        var tableRows = curTable.childNodes;
        var curEl = null;
        var x = null;
        var resValue = null;
        var resRow = null;
        var rowResult = null;
        var favSpan = null;
        var params = null;

        if (comp.curTab.indexOf(ICi18n.FAVORITES) >= 0) {
            for (x = tableRows.length; x--;) {
                curRow = tableRows[x];

                curEl = curRow.querySelector("span[id*='_favSpan']");
                replaceClass.call(curEl, "intCalc-fav-margin", "intCalc-fav-margin-alt");

                resValue = curRow.querySelector("dd[id*='_value']");
                removeClass.call(resValue, "hidden");

                curEl = curRow.querySelector("dd[id*='_date']");
                replaceClass.call(curEl, "hidden", "intCalc-unit-left");

                curEl = curRow.querySelector("dd[id*='_resultCheck']");
                replaceClass.call(curEl, "intCalc-icon", "hidden");
            }
            curEl = tableHeader.querySelector("#resultHeader");
            replaceClass.call(curEl, "intCalc-last-unit", "hidden");

            curEl = curEl.previousSibling;
            replaceClass.call(curEl, "intCalc-unit-left", "intCalc-last-unit");
        } else if (comp.curTab.indexOf(ICi18n.ALL) >= 0) {
            for (x = tableRows.length; x--;) {
                curRow = tableRows[x];

                curEl = curRow.querySelector("span[id*='_favSpan']");
                replaceClass.call(curEl, "intCalc-fav-margin-alt", "intCalc-fav-margin");

                params = curRow.querySelector("dd[id*='_params']");
                if (params.className.indexOf("hidden") >= 0) {
                    resValue = curRow.querySelector("dd[id*='_value']");
                    addClass.call(resValue, "hidden");
                }

                curEl = curRow.querySelector("dd[id*='_resultCheck']");
                rowResult = JSON.parse(curRow.getAttribute("data-result"));
                if (rowResult && rowResult.value !== "--" && rowResult.value !== "") {
                    if (curEl.className.indexOf("intCalc-icon") === -1) {
                        replaceClass.call(curEl, "hidden", "intCalc-icon");
                    }
                }

                curEl = curRow.querySelector("dd[id*='_date']");
                replaceClass.call(curEl, "intCalc-unit-left", "hidden");
            }
            curEl = tableHeader.querySelector("#resultHeader");
            replaceClass.call(curEl, "hidden", "intCalc-last-unit");

            curEl = curEl.previousSibling;
            replaceClass.call(curEl, "intCalc-last-unit", "intCalc-unit-left");
        }
    }

    /***********************************************************************************************************************************************************
     * Start component render
     **********************************************************************************************************************************************************/

    try {
        //Create the render timer
        timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());

        var calculators = data.CALCULATORS;
        var totalCalculators = calculators.length;
        var curCalc = null;
        var calcId = null;
        var curParam = null;
        var fragment = document.createDocumentFragment();
        var contentDiv = newEl("div", {
            parent: fragment,
            id: "intMedCalcContent",
            className: "intCalc-new-line"
        });
        var rowTemplate = null;
        var tabsContainer = null;
        var tabDiv = null;
        var tabTableDiv = null;
        var tabList = [ICi18n.FAVORITES, ICi18n.ALL]; //The list of tabs that will be displayed
        var tabUl = null;
        var tabContentDiv = null;
        var tabConTHRow = null;
        var tabConBody = null;
        var tabLi = null;
        var tabLiId = null;
        var checkCell = null;
        var calcResultCell = null;
        var calcFavCell = null;
        var actionDiv = null;
        var topDiv = null;
        var bottomDiv = null;
        var resData = null;
        var calcNameDiv = null;
        var calcNameDt = null;
        var paramData = null;
        var scrollClass = null;

        if (this.isScrollingEnabled() && (totalCalculators > this.getScrollNumber())) {
            scrollClass = " scrollable";
        }

        //Div to contain the tab control and related tab content
        tabsContainer = newEl("div", {
            parent: contentDiv,
            className: "intCalc-new-line"
        });

        //Div to contain the tab control
        tabDiv = newEl("div", {
            parent: tabsContainer,
            className: "intCalc-new-line intCalc-tab-control intCalc-clickable"
        });
        //Div to contain the tab content
        tabTableDiv = newEl("div", {
            parent: tabsContainer,
            className: "intCalc-new-line intCalc-tab-table-div"
        });

        //Tabs unordered list
        tabUl = newEl("ul", {
            parent: tabDiv,
            className: "intCalc-unit-left"
        });

        for (var i = 0, tabLen = tabList.length; i < tabLen; i++) { //Loop through the list of tab names and create a tab for each entry
            //In case the tab name contains as space replace it to make a valid id
            tabLiId = (tabList[i]).replace(" ", "_");
            if (i === 0) { //Make the first tab the active tab
                thisComponent.curTab = tabLiId;
                tabLi = newEl("li", {
                    parent: tabUl,
                    id: tabLiId + "_tab",
                    className: "intCalc-unit-left intCalc-tab-active"
                });
            } else { //Other inactive tabs
                tabLi = newEl("li", {
                    parent: tabUl,
                    id: tabLiId + "_tab",
                    className: "intCalc-unit-left intCalc-tab-inactive"
                });
            }
            newEl("span", {
                parent: tabLi,
                className: "intCalc-unit-left intCalc-icon intCalc-tab intCalc-tab-left"
            });
            newEl("span", {
                parent: tabLi,
                className: "intCalc-unit-left intCalc-icon intCalc-tab intCalc-tab-center",
                text: tabList[i]
            });
            newEl("span", {
                parent: tabLi,
                className: "intCalc-unit-left intCalc-icon intCalc-tab intCalc-tab-right"
            });
        }

        tabContentDiv = newEl("div", {
            parent: tabTableDiv,
            id: "tab_content",
            className: "intCalc-unit-left intCalc-table-border intCalc-whole" + scrollClass
        });
        tabConTHRow = newEl("div", {
            parent: tabContentDiv,
            id: "tab_content_header",
            className: "intCalc-new-line intCalc-table-header intCalc-light-text intCalc-row-seperator"
        });
        var checkLabel = newEl("label", {
            parent: tabConTHRow,
            className: "intCalc-unit-left intCalc-header-cell-padding"
        });
        newEl("input", {
            parent: checkLabel,
            id: "tab_allCalcsChk",
            attributes: {
                "type": "checkbox"
            }
        });
        var headerDiv = newEl("div", {
            parent: tabConTHRow,
            className: "intCalc-last-unit"
        });
        newEl("div", {
            parent: headerDiv,
            className: "intCalc-unit-left intCalc-column-border intCalc-header-cell-padding intCalc-no-right-padding intCalc-name-column-width",
            text: "My Calculators"
        });
        newEl("div", {
            parent: headerDiv,
            id: "resultHeader",
            className: "intCalc-last-unit intCalc-column-border intCalc-header-cell-padding",
            text: "Result"
        });
        tabConBody = newEl("ul", {
            parent: tabContentDiv,
            id: "table_body"
        });

        rowTemplate = newEl("li", {
            className: "intCalc-new-line intCalc-row-seperator"
        });
        checkCell = newEl("label", {
            parent: rowTemplate,
            className: "intCalc-unit-left intCalc-header-cell-padding"
        });
        newEl("input", {
            parent: checkCell,
            id: "{{calcName}}_chk",
            attributes: {
                "type": "checkbox",
                "disabled": true
            }
        });

        var calcDl = newEl("dl", {
            parent: rowTemplate,
            className: "intCalc-last-unit"
        });
        var calcDt = newEl("dt", {
            parent: calcDl,
            id: "{{calcName}}_name",
            className: "intCalc-unit-left intCalc-name-column-width intCalc-cell-padding intCalc-no-right-padding"
        });
        calcNameDiv = newEl("div", {
            parent: calcDt,
            className: "intCalc-unit-left intCalc-row-text-middle"
        });
        var expand = newEl("div", {
            parent: calcNameDiv,
            className: "intCalc-unit-left"
        });

        newEl("span", {
            parent: expand,
            id: "{{calcName}}_toggle",
            className: "intCalc-arrow-margin intCalc-clickable intCalc-icon intCalc-collapsed-icon"
        });

        newEl("span", {
            parent: calcNameDiv,
            id: "{{calcName}}_toggleDisp",
            className: "intCalc-unit-left intCalc-clickable"
        });

        calcFavCell = newEl("dd", {
            parent: calcDt,
            id: "{{calcName}}_fav",
            className: "intCalc-unit-left"
        });
        newEl("span", {
            parent: calcFavCell,
            id: "{{calcName}}_favSpan",
            className: "hidden intCalc-nonfavorite intCalc-fav-margin",
            attributes: {
                "title": ICi18n.ADD_TO_FAVORITES
            }
        });

        newEl("dd", {
            parent: calcDt,
            id: "{{calcName}}_resultCheck",
            className: "intCalc-unit-left intCalc-icon intCalc-result-check"
        });

        calcResultCell = newEl("dd", {
            parent: calcDt,
            id: "{{calcName}}_value",
            className: "intCalc-unit-left intCalc-name-column-width"
        });
        newEl("p", {
            parent: calcResultCell,
            id: "{{calcName}}_valueSpan",
            className: "intCalc-inline-block"
        });
        newEl("span", {
            parent: calcResultCell,
            id: "{{calcName}}_renew",
            className: "intCalc-clickable intCalc-renew-icon"
        });

        newEl("dd", {
            parent: calcDt,
            id: "{{calcName}}_date",
            className: "hidden"
        });
        newEl("dd", {
            parent: calcDt,
            id: "{{calcName}}_params",
            className: "intCalc-unit-left hidden"
        });
        var errorBanner = newEl("dd", {
            parent: calcDt,
            id: "{{calcName}}_errors",
            className: "intCalc-new-line intCalc-unit-left error-msg intCalc-mc-error-banner hidden"
        });
        newEl("span", {
            parent: errorBanner,
            className: "intCalc-unit-left alert-icon intCalc-mc-alert-icon"
        });
        var errorMessage = newEl("p", {
            parent: errorBanner,
            className: "alert-msg intCalc-mc-alert-msg"
        });
        newEl("span", {
            parent: errorMessage,
            id: "{{calcName}}_errorType",
            className: "intCalc-left-spacer"
        });
        newEl("span", {
            parent: errorMessage,
            id: "{{calcName}}_errorInfo",
            className: "intCalc-left-spacer alert-msg-secondary-text"
        });
        newEl("div", {
            parent: rowTemplate,
            id: "{{calcName}}_hvrDiv_" + compId,
            className: "result-details intCalc-hover"
        });

        newEl("span", {
            parent: rowTemplate,
            className: "intCalc-unit-right hidden intCalc-cell-padding"
        });

        for (var c = 0; c < totalCalculators; c++) {
            curCalc = calculators[c];
            calcId = curCalc.URL.replace(".htm", "");

            var cloneTr = rowTemplate.cloneNode(true);

            cloneTr.id = calcId + "_tr";
            cloneTr.innerHTML = cloneTr.innerHTML.replace(/\{\{calcName\}\}/g, calcId);

            if (this.mcFavObj.favCalc.favorite.indexOf(calcId) > -1) {
                cloneTr.setAttribute("data-filters", ICi18n.ALL + "," + ICi18n.FAVORITES);

                var favSpan = cloneTr.querySelector("#" + calcId + "_favSpan");
                replaceClass.call(favSpan, "hidden intCalc-nonfavorite", "intCalc-icon intCalc-favorite");
                favSpan.setAttribute("title", ICi18n.REMOVE_FROM_FAVORITES);
            } else {
                cloneTr.setAttribute("data-filters", ICi18n.ALL);
            }

            if (curCalc.PARAMETERS && curCalc.PARAMETERS.length > 0) {
                //Storing parameter information for the given calculator for use later
                paramData = {
                    params: []
                };
                for (var k = curCalc.PARAMETERS.length; k--;) {
                    curParam = curCalc.PARAMETERS[k];
                    if (curParam.URL_PARAM === "Gender") {
                        curParam.URL_VALUE = curParam.URL_VALUE.charAt(0) + (curParam.URL_VALUE.toLowerCase()).slice(1);
                    } else if (curParam.URL_PARAM === "Resp_Quot") {
                        curParam.URL_VALUE = this.RespiratoryQuotient;
                        curParam.URL_UNIT = "ratio";
                    } else if (curParam.URL_PARAM === "Elevation") {
                        curParam.URL_VALUE = this.localElevation;
                        curParam.URL_UNIT = "meters";
                    } else if (curParam.URL_PARAM === "Altitude") {
                        curParam.URL_VALUE = this.localElevation;
                        curParam.URL_UNIT = "m";
                    }
                    paramData.params.push({
                        "name": curParam.URL_PARAM,
                        "display": curParam.DISPLAY,
                        "value": curParam.URL_VALUE,
                        "units": curParam.URL_UNIT,
                        "date": curParam.RESULT_DATE,
                        "curValue": curParam.URL_VALUE,
                        "curDate": curParam.RESULT_DATE
                    });
                }
                calcNameDt = cloneTr.querySelector("#" + calcId + "_toggleDisp");
            } else {
                var toggle = cloneTr.querySelector("#" + calcId + "_toggle").parentNode;
                addClass.call(toggle, "hidden");
                cloneTr.innerHTML = cloneTr.innerHTML.replace(/_toggleDisp/g, "_calcpop");
                paramData = {
                    params: []
                };
                calcNameDt = cloneTr.querySelector("#" + calcId + "_calcpop");
            }

            calcNameDt.appendChild(document.createTextNode(curCalc.DISPLAY));

            cloneTr.setAttribute("data-calc", JSON.stringify(paramData));

            resData = {
                name: curCalc.DISPLAY,
                value: "",
                date: ""
            };
            cloneTr.setAttribute("data-result", JSON.stringify(resData));

            tabConBody.appendChild(cloneTr);
        }

        //Add a div for the action able items under the table
        actionDiv = newEl("div", {
            parent: contentDiv,
            className: "intCalc-new-line intCalc-last-unit intCalc-action-div"
        });

        //Div to hold the show more link
        if (totalCalculators > minRows) {
            newEl("a", {
                parent: actionDiv,
                id: "intCalc_showMoreLink",
                className: "intCalc-clickable intCalc-unit-left intCalc-show-more-link",
                text: ICi18n.SHOW_MORE
            });
        }

        newEl("button", {
            parent: actionDiv,
            id: "intCalc_copyButton",
            className: "intCalc-unit-right intCalc-copy-button",
            attributes: {
                "disabled": "disabled"
            },
            text: ICi18n.COPY_TO_CLIPBOARD
        });

        var curTable = contentDiv.querySelector("#table_body");
        var curRow = null;
        var curHover = null;
        var tableRows = curTable.childNodes;

        for (var x = tableRows.length; x--;) {
            curRow = tableRows[x];
            curHover = curRow.querySelector("#" + curRow.id.replace("_tr", "_hvrDiv") + "_" + compId);
            if (curRow && curHover) {
                hs(curRow, curHover, this);
            }
        }

        /*
         * Start of event handlers
         */
        //Binding to the window message event to listen for callbacks from the MedCalc pages
        //The MedCalc Pages return JSON in this format: '{"mcCalcName":"calcName.htm" ,"mcHtmTxt":"html Text","mcXmlTxt":"XML text","mcCalcTxt":"Calculator Text"}';
        $(window).bind("message", function(e) {
            var oEvent = e.originalEvent;
            var medCalcReply = null;

            //try and convert message data to json
            if (oEvent.data.length > 0 && oEvent.data.substring(0, 1) === "{") {
                try {
                    medCalcReply = JSON.parse(oEvent.data);
                } catch (err) {
                    MP_Util.LogJSError(err, null, "integrated-calculators-o1.js", "MedCalc:Message event - unable to parse data");
                    return;
                }

                if (medCalcReply["medcalc-calcname"]) {
                    var repCalcId = medCalcReply["medcalc-calcname"].replace(".htm", "");
                    var iframe = contentDiv.querySelector("#" + repCalcId + "_frame");
                    var calcRow = contentDiv.querySelector("#" + repCalcId + "_tr");

                    if (iframe && iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe);
                    }

                    if (medCalcReply["medcalc-xmltxt"]) {
                        var resultTdId = repCalcId + "_value";
                        (contentDiv.querySelector("#" + repCalcId + "_name")).setAttribute("data-details", medCalcReply["medcalc-htmtxt"]);

                        IntMedCalcComponent.prototype.renderXML(thisComponent, medCalcReply["medcalc-xmltxt"], resultTdId, calcRow);
                    }
                }
            }
        });

        /**
         * Click event handlers for the conentDiv
         * @param  {Object} e The event
         * @return {null}
         */
        contentDiv.onclick = function(e) {
            e = e || window.event;
            var myTarget = e.target || e.srcElement;
            var curTable = null;
            var el = null;
            var ICi18n = i18n.discernabu.integrated_calculators_o1;
            var activeCalc, checkBoxes, checkBox, toggle, i, j, len, x, dataLen, calcName, custCont, paramDiv;

            if (((myTarget.id).indexOf("_tab") > 0 || (myTarget.parentNode.id).indexOf("_tab") > 0) && (myTarget.id).indexOf("_table") === -1 && myTarget.tagName !== "TBODY") { //If the user clicks on a tab
                var tabId = myTarget.id || myTarget.parentNode.id;

                thisComponent.curTab = tabId.replace("_tab", "");
                //Set the classes of all tabs to their inactive states
                var tabs = contentDiv.querySelectorAll("li[id*='_tab']");
                var curTab;
                for (x = tabs.length; x--;) {
                    curTab = tabs[x];
                    if (curTab.id === tabId) {
                        replaceClass.call(curTab, "intCalc-tab-inactive", "intCalc-tab-active");
                    } else {
                        replaceClass.call(curTab, "intCalc-tab-active", "intCalc-tab-inactive");
                    }
                }

                //Show the calculators that match the tab filter
                filterRows(thisComponent);
                formatRows(thisComponent);

                curTable = contentDiv.querySelector("#tab_content");
                activeCalc = false;
                checkBoxes = curTable.querySelectorAll("input[type='checkbox']");
                for (x = checkBoxes.length; x--;) {
                    checkBox = checkBoxes[x];
                    if (checkBox.id !== "tab_allCalcsChk" && checkBox.parentNode.parentNode.className.indexOf("hidden") === -1 && checkBox.checked && !checkBoxes[x].disabled) {
                        activeCalc = true;
                    }
                }
                if (activeCalc) {
                    //Enable the copy button because all calculators are selected
                    contentDiv.querySelector("#intCalc_copyButton").removeAttribute("disabled");
                } else {
                    contentDiv.querySelector("#intCalc_copyButton").setAttribute("disabled", "disabled");
                }

                IntMedCalcComponent.prototype.loadVisibleCalculators(thisComponent, contentDiv);

            } else if (myTarget.id === "tab_allCalcsChk") { //If the select all check-box is clicked
                //Get the current table that is displayed
                curTable = contentDiv.querySelector("#tab_content");
                checkBoxes = curTable.querySelectorAll("input[type='checkbox']");
                if (myTarget.checked) { // Check all is checked
                    activeCalc = false;
                    //Find all check-boxes that aren't checked in table and check them

                    for (x = checkBoxes.length; x--;) {
                        checkBox = checkBoxes[x];
                        checkBox.checked = true;
                        if (checkBox.id !== "tab_allCalcsChk" && !checkBox.disabled && checkBox.parentNode.parentNode.className.indexOf("hidden") === -1) {
                            activeCalc = true;
                        }
                    }
                    if (activeCalc) {
                        //Enable the copy button because all calculators are selected
                        contentDiv.querySelector("#intCalc_copyButton").removeAttribute("disabled");
                    }
                } else {
                    //Disable the copy button because all calculators are not seleted
                    contentDiv.querySelector("#intCalc_copyButton").setAttribute("disabled", "disabled");

                    //Find all check-boxes that are checked and uncheck them
                    for (x = checkBoxes.length; x--;) {
                        checkBoxes[x].checked = false;
                    }
                }
            } else if (myTarget.type === "checkbox") { //If the user clicks a calculator check-box
                //Get the current table that is displayed
                curTable = contentDiv.querySelector("#tab_content");
                checkBoxes = curTable.querySelectorAll("input[type='checkbox']");
                if (myTarget.checked) { //Check-box that triggered the event is checked
                    //Enable the copy button because a calculator is selected
                    contentDiv.querySelector("#intCalc_copyButton").removeAttribute("disabled");

                    //Check if all check-boxes are checked but the select all check box.  If so then check the select all check-box
                    var allChecked = true;
                    for (x = checkBoxes.length; x--;) {
                        checkBox = checkBoxes[x];
                        if (!checkBox.disabled && !checkBox.checked && checkBox.id !== "tab_allCalcsChk") {
                            allChecked = false;
                        }
                    }
                    if (allChecked) {
                        curTable.querySelector("#tab_allCalcsChk").checked = true;
                    }
                } else {
                    //Set the select all check box to unchecked
                    curTable.querySelector("#tab_allCalcsChk").checked = false;

                    //Check if anything else is checked.  If nothing is then disable the copy button
                    var somethingChecked = false;
                    for (x = checkBoxes.length; x--;) {
                        if (checkBoxes[x].checked) {
                            somethingChecked = true;
                        }
                    }
                    if (!somethingChecked) {
                        contentDiv.querySelector("#intCalc_copyButton").setAttribute("disabled", "disabled");
                    }
                }
            } else if ((myTarget.id).indexOf("_toggle") > 0) { //If the expand toggle is clicked
                calcId = ((myTarget.id).replace("_toggleDisp", "")).replace("_toggle", "");
                var targetRow = contentDiv.querySelector("#" + calcId + "_tr");
                toggle = targetRow.querySelector("#" + calcId + "_toggle");
                var targetHover = document.getElementById(calcId + "_hvrDiv_" + compId);
                var valueDD = targetRow.querySelector("#" + calcId + "_value");
                i = 0;
                len = 0;
                paramDiv = targetRow.querySelector("#" + calcId + "_params");

                //Row is collapsed so expand
                if (toggle.className.indexOf("intCalc-collapsed-icon") >= 0) {
                    replaceClass.call(toggle, "intCalc-collapsed-icon", "intCalc-expanded-icon");
                    replaceClass.call(targetRow, "intCalc-row-seperator", "content-body");

                    if (paramDiv.childNodes.length === 0) {
                        thisComponent.initParamView(targetRow, thisComponent.curTab);
                    }
                    removeClass.call(paramDiv, "hidden");
                    if (thisComponent.curTab.indexOf(ICi18n.ALL) >= 0) {
                        removeClass.call(valueDD, "hidden");
                    }
                    targetHover.style.display = "none";
                } else { //Row is expanded so collapse
                    replaceClass.call(toggle, "intCalc-expanded-icon", "intCalc-collapsed-icon");
                    replaceClass.call(targetRow, "content-body", "intCalc-row-seperator");
                    addClass.call(paramDiv, "hidden");
                    if (thisComponent.curTab.indexOf(ICi18n.ALL) >= 0) {
                        addClass.call(valueDD, "hidden");
                    }
                    targetHover.style.display = "";
                }
            } else if ((myTarget.id).indexOf("_calcpop") > 0) { //For calculators with no params show calculator in modal window
                calcName = (myTarget.id).replace("_calcpop", "");
                custCont = thisComponent.htmlLoc;
                var calcLoc = custCont + calcName + ".htm";

                displayMCPages(calcName, custCont, calcLoc);
            } else if ((myTarget.id).indexOf("_favSpan") > 0) { //If the user clicks on a favorite icon future
                calcName = (myTarget.id).replace("_favSpan", "");
                var updatedRow = contentDiv.querySelector("#" + calcName + "_tr");
                var favEl = contentDiv.querySelector("#" + myTarget.id);

                if (myTarget.className.indexOf("intCalc-favorite") >= 0) {
                    replaceClass.call(favEl, "intCalc-favorite", "intCalc-nonfavorite");
                    favEl.title = ICi18n.ADD_TO_FAVORITES;

                    //Remove the selected calculator from the favorite array.
                    thisComponent.mcFavObj.favCalc.favorite.splice($.inArray(calcName, thisComponent.mcFavObj.favCalc.favorite), 1);
                    updatedRow.setAttribute("data-filters", ICi18n.ALL);
                    filterRows(thisComponent);
                } else {
                    replaceClass.call(favEl, "intCalc-hover-favorite", "intCalc-favorite");
                    replaceClass.call(favEl, "intCalc-nonfavorite", "intCalc-favorite");
                    favEl.title = ICi18n.REMOVE_FROM_FAVORITES;

                    //Add the selected calculator to the favorite array
                    thisComponent.mcFavObj.favCalc.favorite.push(calcName);
                    updatedRow.setAttribute("data-filters", ICi18n.ALL + "," + ICi18n.FAVORITES);
                }
                thisComponent.setPreferencesObj(thisComponent.mcFavObj);
                thisComponent.savePreferences(true);

            } else if (myTarget.id === "intCalc_copyButton") { //If the user clicks on the copy to clipboard button
                var calcText = "MedCalc 3000 " + ICi18n.CALCULATIONS + " \n\n";
                curTable = contentDiv.querySelector("#table_body");
                checkBoxes = curTable.querySelectorAll("input[type='checkbox']");
                var curCheck, selectedCalcs = "";

                for (j = 0, len = checkBoxes.length; j < len; j++) {
                    curCheck = checkBoxes[j];
                    calcId = curCheck.id.replace("_chk", "");
                    var curRow = contentDiv.querySelector("#" + calcId + "_tr");

                    if (!curCheck.disabled && curCheck.checked && curRow.className.indexOf("hidden") === -1) {
                        var valueTd = curRow.querySelector("#" + calcId + "_value");
                        var calcData = JSON.parse(curRow.getAttribute("data-calc"));
                        var curData = calcData.params;
                        var calcResult = JSON.parse(curRow.getAttribute("data-result"));
                        var resultVal = calcResult.value;
                        var resultDate = calcResult.date;
                        calcName = calcResult.name;
                        var renew = valueTd.querySelector("#" + calcId + "_renew");
                        toggle = curRow.querySelector("#" + calcId + "_toggle");
                        var df = MP_Util.GetDateFormatter();
                        var dateTime = null;
                        var tmpDate = null;
                        var tmpVal = null;
                        var tmpUnits = null;

                        selectedCalcs += calcName + "|";

                        if (curData.length === 0 || (renew && renew.className.indexOf("intCalc-icon") >= 0)) { //Check if the user modified this calculator
                            calcText = calcText + ICi18n.USER_ENTERED_DATA + " \n";
                        }

                        dateTime = df.format(new Date(resultDate), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                        calcText = calcText + calcName + " - " + resultVal.replace(/<BR>/gi, ", ") + " @ " + dateTime + "\n";

                        if (curData && curData.length > 0) {
                            for (i = 0, dataLen = curData.length; i < dataLen; i++) {
                                curParam = curData[i];
                                tmpDate = curParam.curDate.replace(/^\s+|\s+$/gm, "");
                                tmpVal = curParam.curValue.replace(/^\s+|\s+$/gm, "");
                                tmpUnits = curParam.units.replace(/^\s+|\s+$/gm, "");

                                if (curParam.name === "Gender") { //Format the gender value based on the value selected
                                    if (tmpVal == 1) {
                                        tmpVal = "Male";
                                    } else {
                                        tmpVal = "Female";
                                    }
                                }

                                if (tmpDate === "") {
                                    calcText = calcText + curParam.display + " - " + tmpVal + "\n";
                                } else {

                                    dateTime = df.format(new Date(tmpDate), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR);
                                    calcText = calcText + curParam.display + " - " + tmpVal + "(" + tmpUnits + ")" + " @ " + dateTime + "\n";
                                }
                            }
                        }
                        calcText = calcText + "\n";
                    }
                }

                if (window.clipboardData && window.clipboardData.setData) {
                    window.clipboardData.setData("text", calcText);

                    var ctcTimer = new CapabilityTimer("CAP:MPG_Integrated-Calculators-o1-CopyToClipboard", catmean);
                    if (ctcTimer) {
                        ctcTimer.addMetaData("rtms.legacy.metadata.1", selectedCalcs);
                        ctcTimer.capture();
                    }
                }
            } else if (myTarget.id === "intCalc_calcPageLink") { //If the user clicks on the calculator page link take them to the bedrock defined tab
                APPLINK(0, "$APP_APPNAME$", "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + thisComponent.tabLink + "+^");
            } else if (myTarget.id === "intCalc_showMoreLink") { //If the user clicks the show more or show less link
                if (myTarget.innerHTML === ICi18n.SHOW_MORE) {
                    thisComponent.limitingRows = false;
                    myTarget.childNodes[0].nodeValue = ICi18n.SHOW_LESS;
                    filterRows(thisComponent);
                    thisComponent.loadVisibleCalculators(thisComponent, contentDiv); //Run the newly visible calculators
                } else { //Show less hide rows down to the minimum number
                    thisComponent.limitingRows = true;
                    myTarget.childNodes[0].nodeValue = ICi18n.SHOW_MORE;
                    filterRows(thisComponent);
                }
            } else if ((myTarget.id).indexOf("_renew") > 0) { //If the user clicks the renew button
                myTarget.className = myTarget.className.replace(/ intCalc-icon/g, "");
                el = myTarget.parentNode;
                calcName = el.id.replace("_value", "");
                var calcRow = contentDiv.querySelector("#" + calcName + "_tr");
                paramDiv = calcRow.querySelector("#" + calcName + "_params");
                toggle = calcRow.querySelector("#" + calcName + "_toggle");

                //Row is expanded so collapse
                if (toggle.className.indexOf("intCalc-expanded-icon") >= 0) {
                    replaceClass.call(toggle, "intCalc-expanded-icon", "intCalc-collapsed-icon");
                    replaceClass.call(calcRow, "content-body", "intCalc-row-seperator");
                    addClass.call(paramDiv, "hidden");

                    if (thisComponent.curTab.indexOf(ICi18n.ALL) >= 0) {
                        addClass.call(el, "hidden");
                    }
                }

                //Calling updateParamView with refresh set to true to pull in original values
                thisComponent.initParamView(calcRow, thisComponent.curTab);
                thisComponent.runCalculations(thisComponent, calcName, calcRow, true);
            } else if ((myTarget.id).indexOf("_calcDetail") > 0) {
                el = contentDiv.querySelector("#" + (myTarget.id).replace("_calcDetail", "_name"));
                custCont = thisComponent.htmlLoc;
                var details = el.getAttribute("data-details");
                displayModalDetail(custCont, details);
            }
            e.stopPropagation();
        };

        /**
         * Row focus in event handler
         * @param  {Object} e The event
         * @return {null}
         */
        contentDiv.onfocusin = function(e) {
            e = e || window.event;
            var myTarget = e.target || e.srcElement;
            if ((myTarget.tagName === "INPUT" || myTarget.tagName === "SELECT") && myTarget.type !== "checkbox") {
                var targetParent = myTarget.parentNode; //Calculator name cell
                while (targetParent.tagName !== "DD") {
                    targetParent = targetParent.parentNode;
                }
                var targetId = targetParent.id.replace("_params", "");
                var targetHover = document.getElementById(targetId + "_hvrDiv_" + compId);
                thisComponent.setEditMode(true);
                targetHover.style.display = "none";
            }
        };

        /**
         * Row focus out event handler
         * @param  {Object} e The event
         * @return {null}
         */
        contentDiv.onfocusout = function(e) {
            e = e || window.event;
            var myTarget = e.target || e.srcElement;
            if ((myTarget.tagName === "INPUT" || myTarget.tagName === "SELECT") && myTarget.type !== "checkbox") {
                var targetParent = myTarget.parentNode; //Calculator name cell
                while (targetParent.tagName !== "DD") {
                    targetParent = targetParent.parentNode;
                }
                var targetId = targetParent.id.replace("_params", "");
                var targetHover = document.getElementById(targetId + "_hvrDiv_" + compId);

                thisComponent.setEditMode(false);
                targetHover.style.display = "";
            }
        };

        /**
         * Row mouse over event handler
         * @param  {Object} e The event
         * @return {null}
         */
        contentDiv.onmouseover = function(e) {
            e = e || window.event;
            var myTarget = e.target || e.srcElement,
                calcId, dl, favSpan, underLoc;

            if ((myTarget.id).indexOf("_fav") > 0 || (myTarget.id).indexOf("_name") > 0 || (myTarget.id).indexOf("_value") > 0) {
                underLoc = myTarget.id.lastIndexOf("_");
                calcId = myTarget.id.substring(0, underLoc);
                dl = myTarget.parentNode;

                while (dl.tagName !== "DL") {
                    dl = dl.parentNode;
                }
                favSpan = dl.querySelector("#" + calcId + "_favSpan");
                if (favSpan && favSpan.className.indexOf("intCalc-favorite") === -1) {
                    if ((myTarget.id).indexOf("_fav") > 0) {
                        if (myTarget.className.indexOf("intCalc-nonfavorite") >= 0) {
                            replaceClass.call(myTarget, "intCalc-nonfavorite", "intCalc-hover-favorite");
                            replaceClass.call(myTarget, "hidden", "intCalc-icon");
                        }
                    } else if ((myTarget.id).indexOf("_name") > 0 || (myTarget.id).indexOf("_value") > 0) {
                        replaceClass.call(favSpan, "hidden", "intCalc-icon");
                    }
                }
            }
        };


        /**
         * Row mouse out event handler
         * @param  {Object} e The event
         * @return {null}
         */
        contentDiv.onmouseout = function(e) {
            e = e || window.event;
            var myTarget = e.target || e.srcElement,
                calcId, dl, favSpan, underLoc;

            if ((myTarget.id).indexOf("_fav") > 0 || (myTarget.id).indexOf("_name") > 0 || (myTarget.id).indexOf("_value") > 0) {
                underLoc = myTarget.id.lastIndexOf("_");
                calcId = myTarget.id.substring(0, underLoc);
                dl = myTarget.parentNode;

                while (dl.tagName !== "DL") {
                    dl = dl.parentNode;
                }
                favSpan = dl.querySelector("#" + calcId + "_favSpan");
                if (favSpan && favSpan.className.indexOf("intCalc-favorite") === -1) {
                    if ((myTarget.id).indexOf("_fav") > 0) {
                        if (myTarget.className.indexOf("intCalc-hover-favorite") >= 0) {
                            replaceClass.call(myTarget, "intCalc-hover-favorite", "intCalc-nonfavorite");
                            replaceClass.call(myTarget, "intCalc-icon", "hidden");
                        }
                    } else if ((myTarget.id).indexOf("_name") > 0 || (myTarget.id).indexOf("_value") > 0) {
                        replaceClass.call(favSpan, "intCalc-icon", "hidden");
                    }
                }
            }
        };

        /**
         * Keyup event handler
         * @param  {Object} e The event
         * @return {null}
         */
        $(contentDiv).keyup(function(e) {
            e = e || window.event;
            if (e.which === 13) { // enter key
                var tagName = $(e.target).prop("tagName");
                if ((tagName === "INPUT" || tagName === "SELECT") && !$(e.target).is(":checkbox")) {
                    inputChanged(e);
                }
            }
        });

        /**
         * On change event handler
         * @param  {Object} e The event
         * @return {null}
         */
        $(contentDiv).change(function(e) {
            e = e || window.event;
            if (!$(e.target).is(":checkbox")) { // Filter out checkbox change events
                inputChanged(e);
            }
        });


        filterRows(thisComponent);
        formatRows(thisComponent);

        this.finalizeComponent(fragment, MP_Util.CreateTitleText(this, totalCalculators));
        this.loadVisibleCalculators(thisComponent, contentDiv);
        /*
         * Prepare reusable modal window for NON-medical equations
         */
        var resetButton = new ModalButton("resetButton_" + compId);
        resetButton.setText(ICi18n.RESET).setCloseOnClick(false);

        var applyButton = new ModalButton("applyButton_" + compId);
        applyButton.setText(ICi18n.APPLY).setCloseOnClick(true);

        var modalMCCancelBtn = new ModalButton("modal_medcalc_cancel_" + compId);
        modalMCCancelBtn.setText(ICi18n.CANCEL).setCloseOnClick(true);

        var modalMC = new ModalDialog("intCalc_modal_medcalc_" + compId);

        modalMC.setBodyElementId("intCalc_modal_medcalc_body_" + compId);
        modalMC.addFooterButton(resetButton);
        modalMC.addFooterButton(modalMCCancelBtn);
        modalMC.addFooterButton(applyButton);
        modalMC.setHeaderTitle("MedCalc 3000");
        MP_ModalDialog.addModalDialogObject(modalMC);

        //Prepare reusable modal window for medical equations
        var modalMCOKBtn = new ModalButton("modal_medcalc_ok_" + compId);
        modalMCOKBtn.setText(ICi18n.OK).setCloseOnClick(true);
        var modalMCDetails = new ModalDialog("intCalc_modal_medcalc_details_" + compId);
        modalMCDetails.setBodyElementId("intCalc_modal_medcalc_body_details_" + compId);
        modalMCDetails.addFooterButton(modalMCOKBtn);
        modalMCDetails.setHeaderTitle("MedCalc 3000");
        MP_ModalDialog.addModalDialogObject(modalMCDetails);

    } catch (err) {
        if (timerRenderComponent) {
            timerRenderComponent.Abort();
            timerRenderComponent = null;
        }

        MP_Util.LogJSError(err, null, "integrated-calculators-o1.js", "MedCalc:renderComponent - render error");
        //Throw the error to the architecture
        throw (err);
    } finally {
        if (timerRenderComponent) {
            timerRenderComponent.Stop();
        }
    }
};

/**
 * Finds the visible calculators and then runs the calculations for those calculators
 * @param  {Object} comp     A reference to the component
 * @param  {Object} par      The contentDiv
 * @return {null}
 */
IntMedCalcComponent.prototype.loadVisibleCalculators = function(comp, par) {
    var parent = par;
    var tableBody = parent.querySelector("#table_body");
    var tableRows = tableBody.childNodes;
    var curRow = null;
    var calcId = null;

    for (var x = 0, len = tableRows.length; x < len; x++) {
        curRow = tableRows[x];
        calcId = curRow.id.replace("_tr", "");
        if (!curRow.className || (curRow.className && (curRow.className).indexOf("hidden") === -1)) {
            this.runCalculations(comp, calcId, curRow, false);
        }
    }
};

/**
 * Initializes the parameter div for clinical equation calculators
 * @param  {Object} parentRow The row element of the calculator we are working with
 * @return {null}
 */
IntMedCalcComponent.prototype.initParamView = function(parentRow, curTab) {
    var par = parentRow;
    var calcId = par.id.replace("_tr", "");
    var paramData = null;
    var params = null;
    var param;
    var curParam = null;
    var calcResult = JSON.parse(par.getAttribute("data-result"));
    var paramEl = par.querySelector("#" + calcId + "_params");
    var paramFrag = document.createDocumentFragment();
    var paramTable = null;
    var paramTr = null;
    var nameCell = null;
    var resultCell = null;
    var dateCell = null;
    var paramInput = null;
    var paramOption = null;
    var calcDetail = document.createElement("a");
    var ICi18n = i18n.discernabu.integrated_calculators_o1;
    if (paramEl) {
        paramData = JSON.parse(par.getAttribute("data-calc"));
        if (paramData) {
            params = paramData.params;

            paramTable = document.createElement("table");
            paramTable.className += "intCalc-table-fixed-layout";
            paramFrag.appendChild(paramTable);

            for (param = params.length; param--;) {
                curParam = params[param];
                curParam.curValue = curParam.value;
                curParam.curDate = curParam.date;

                paramTr = document.createElement("tr");
                paramTr.setAttribute("data-paramIndex", param);
                paramTable.appendChild(paramTr);

                nameCell = document.createElement("td");
                nameCell.className = "intCalc-right-text intCalc-right-spacer intCalc-param-name-width intCalc-ellipsis";
                paramTr.appendChild(nameCell);

                resultCell = document.createElement("td");
                paramTr.appendChild(resultCell);

                dateCell = document.createElement("td");
                dateCell.className += "intCalc-date-width";
                paramTr.appendChild(dateCell);

                if (curParam.name === "Gender") {
                    nameCell.innerHTML = curParam.display;

                    paramInput = document.createElement("select");

                    resultCell.appendChild(paramInput);

                    paramOption = document.createElement("option");
                    paramOption.appendChild(document.createTextNode("Male"));
                    paramOption.setAttribute("value", 1);

                    paramInput.appendChild(paramOption);

                    paramOption = document.createElement("option");
                    paramOption.appendChild(document.createTextNode("Female"));
                    paramOption.setAttribute("value", 0);

                    paramInput.appendChild(paramOption);
                    curParam.value = (curParam.value).charAt(0).toUpperCase() + (curParam.value).substring(1).toLowerCase();

                    if (curParam.value === "Male") {
                        paramInput.selectedIndex = 0;
                    } else if (curParam.value === "Female") {
                        paramInput.selectedIndex = 1;
                    } else {
                        paramInput.selectedIndex = -1;
                    }
                } else {
                    nameCell.innerHTML = curParam.display + " (" + curParam.units + "):";

                    paramInput = document.createElement("input");
                    paramInput.setAttribute("type", "text");
                    paramInput.setAttribute("name", curParam.name);
                    paramInput.setAttribute("value", curParam.value);
                    paramInput.className = "intCalc-name-column-width";

                    resultCell.appendChild(paramInput);

                    if (curParam.date) {
                        dateCell.innerHTML = MP_Util.CalcWithinTime(new Date(curParam.date));
                    }

                    if (curParam.name === "Race") {
                        resultCell.disabled = true;
                    }

                }
            }
            calcDetail.innerHTML = ICi18n.CALCULATOR_DETAILS;
            calcDetail.id = calcId + "_calcDetail";
            calcDetail.className = "intCalc-new-line intCalc-unit-left intCalc-clickable intCalc-calc-details";
            paramFrag.appendChild(calcDetail);

            if (paramEl.childNodes.length > 0) {
                while (paramEl.childNodes.length > 0) {
                    paramEl.removeChild(paramEl.firstChild);
                }
            }
            par.setAttribute("data-calc", JSON.stringify(paramData));
            paramEl.appendChild(paramFrag);
        }
    }
};


/**
 * Create the URL string with parameters for the given calculator and opens that URL in the hidden iframe
 * @param  {Object} comp      A reference to the component
 * @param  {String} calcId    The name of the calculator
 * @param  {Object} parentRow The row element of the calculator
 * @return {null}
 */
IntMedCalcComponent.prototype.runCalculations = function(comp, calcId, parentRow, forceRun) {
    var parent = parentRow;
    var calcUrl = calcId + ".htm";
    var data = JSON.parse(parent.getAttribute("data-calc"));
    var param = null;
    var params = data.params;
    var paramLen = params.length;
    var curParam = null;
    var myFrame = parent.querySelector("#" + calcId + "_frame") || document.createElement("iframe");
    var resultTd = calcId + "_value";
    var calcDt = parent.querySelector("#" + calcId + "_name");
    var calcDetail = calcDt.getAttribute("data-details");
    var root = comp.htmlLoc;
    var url = root + calcUrl;
    var runCalc = true;
    if (paramLen > 0) {
        url = url + "?";
        for (param = 0; param < paramLen; param++) {
            curParam = params[param];

            if (curParam.name === "Gender") {
                curParam.name = "Sex";
            }

            if (curParam.name === "Race") {
                // return expected parameter value for Non Black/African American Race for GFR_IDMS, GFR_MDRD_Abbrev, and GFR_MDRD_Full calculators
                if (calcId === "GFR_IDMS" || calcId === "GFR_MDRD_Abbrev" || calcId === "GFR_MDRD_Full") {
                    if (curParam.curValue !== "Black" && curParam.curValue !== "African American") {
                        curParam.curValue = "Non-Black";
                    }
                }

                // return expected parameter value for Non Black/African American Race for GFR_CKD_EPI calculator
                if (calcId === "GFR_CKD_EPI") {
                    if (curParam.curValue !== "Black" && curParam.curValue !== "African American") {
                        curParam.curValue = "White or Other";
                    }
                }
            }

            if (param === 0) {
                url = url + curParam.name + "=" + curParam.curValue;
            } else {
                url = url + "&" + curParam.name + "=" + curParam.curValue;
            }
            if (curParam.units) {
                url = url + "|" + curParam.units;
            }

            if (curParam.curValue === "") {
                runCalc = false;
            }
        }

        url = url + "&post=now";

        if (runCalc || !calcDetail || forceRun) {
            myFrame.id = calcId + "_frame";
            myFrame.name = calcId + "_frame";
            myFrame.className = ("hidden");
            myFrame.src = url;
            parent.appendChild(myFrame);
        } else {
            this.renderXML(comp, "", resultTd, parent);
        }
    } else {
        this.updateHover(comp, parent);
    }
};

/**
 * Updates the hover for a given calculator to reflect changes made by the user
 * @param  {Object} row The row element for the selected calculator
 * @return {null}
 */
IntMedCalcComponent.prototype.updateHover = function(comp, row) {
    var selRow = row; //Get row that is selected
    var calcId = (selRow.id).replace("_tr", "");
    var paramData = JSON.parse(selRow.getAttribute("data-calc"));
    var resultData = JSON.parse(selRow.getAttribute("data-result"));
    var curParams = paramData.params;
    var curParam = null;
    var resultDate = resultData.date;
    var calcDisplay = resultData.name;
    var resultVal = resultData.value;
    var paramRow = null;
    var df = MP_Util.GetDateFormatter();
    var compId = comp.getComponentId();
    var hvrDiv = document.getElementById(calcId + "_hvrDiv_" + compId);
    var fragment = document.createDocumentFragment();
    var hoverDiv = newEl("div", {
        parent: fragment
    });
    var tableDiv = newEl("div", {
        parent: hoverDiv
    });
    var medCalcDiv = newEl("div", {
        parent: hoverDiv,
        className: "intCalc-unit-right"
    });
    var table = newEl("table", {
        parent: tableDiv,
        className: "intCalc-table-fixed-layout"
    });
    var headerRow = newEl("tr", {
        parent: table
    });
    var tempDate = "";
    var tempVal = "";

    newEl("th", {
        parent: headerRow,
        className: "intCalc-table-alt-header intCalc-param-name-width",
        text: calcDisplay
    });
    newEl("th", {
        parent: headerRow,
        className: "intCalc-table-alt-header intCalc-left-spacer",
        innerHTML: resultVal
    });

    if (resultDate && resultDate !== "--") {
        newEl("th", {
            parent: headerRow,
            className: "intCalc-table-alt-header intCalc-alt-text intCalc-date-width",
            text: MP_Util.CalcWithinTime(new Date(resultDate))
        });
    } else {
        newEl("th", {
            parent: headerRow,
            className: "intCalc-table-alt-header intCalc-alt-text intCalc-date-width"
        });
    }

    for (var i = curParams.length; i--;) {
        curParam = curParams[i];
        paramRow = newEl("tr", {
            parent: table
        });
        tempDate = curParam.curDate.replace(/^\s+|\s+$/gm, "");
        tempVal = curParam.curValue.replace(/^\s+|\s+$/gm, "");

        newEl("td", {
            parent: paramRow,
            className: "intCalc-right-text intCalc-light-text",
            text: curParam.display + " (" + curParam.units + "): "
        });
        newEl("td", {
            parent: paramRow,
            className: "intCalc-cell-padding",
            text: tempVal
        });
        if (curParam.curDate && curParam.curDate !== "--") {
            newEl("td", {
                parent: paramRow,
                className: "intCalc-alt-text intCalc-date-width",
                text: df.format(new Date(tempDate), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_2YEAR)
            });
        }
    }

    newEl("span", {
        parent: medCalcDiv,
        text: "Powered by "
    });
    newEl("span", {
        parent: medCalcDiv,
        className: "intCalc-medCalc-name",
        text: "MEDCALC "
    });
    newEl("span", {
        parent: medCalcDiv,
        className: "intCalc-medCalc-number",
        text: "3000"
    });

    if (hvrDiv.childNodes.length > 0) {
        hvrDiv.replaceChild(fragment, hvrDiv.firstChild);
    } else {
        hvrDiv.appendChild(fragment);
    }

    /**
     * Function that creates new dom elements
     * @param  {String} type       The type of dom element to create
     * @param  {Object} options A JSON object of additional properites and attributes to apply to the element
     * @return {Object}            The new element created
     */
    function newEl(type, options) {
        var el = document.createElement(type),
            opt = options || {},
            attr = opt.attributes || null;
        el.id = opt.id || "";
        el.className = opt.className || "";
        for (var key in attr) {
            el.setAttribute(key, attr[key]);
            }
        if (opt.innerHTML) {
            el.innerHTML = opt.innerHTML;
        }
        if (opt.text) {
            el.appendChild(document.createTextNode(opt.text));
        }
        if (opt.parent) {
            opt.parent.appendChild(el);
        }
        return el;
    }
};

/*
 * Gets XML back from MedCalc page and gets the calcualtor result
 */
/**
 * Takes the XML returned by the calculator page and parses it to retrieve the result information
 * @param  {String} xml        The XML
 * @param  {String} resultTdId The *_value cells id
 * @param  {Object} parentRow  The row element related to the given calculator
 * @return {null}
 */
IntMedCalcComponent.prototype.renderXML = function(comp, xml, resultTdId, parentRow) {
    var par = parentRow;
    var resultObj = JSON.parse(par.getAttribute("data-result"));
    var calcId = resultTdId.replace("_value", "");
    var resultVal = "";
    var resultSpan = par.querySelector("#" + calcId + "_valueSpan");
    var dateElement = par.querySelector("#" + calcId + "_date");
    var calcData = JSON.parse(par.getAttribute("data-calc"));
    var oldestDate = findOldestDate(calcData);
    var nameHold = null;
    var valHold = null;
    var unitHold = null;
    var xmlDoc = null;
    var len, i, j;
    var checkBox;
    var resultCheck = par.querySelector("#" + calcId + "_resultCheck");
    var errorBanner = par.querySelector("#" + calcId + "_errors");
    var errorTypeSpan, errorInfoSpan;
    var curTab = comp.curTab;
    var ICi18n = i18n.discernabu.integrated_calculators_o1;
    var contentDiv = par.parentNode;
    var errorHold;
    var errorUnitHold;
    var errorField;
    var errorUnit;
    var errorAllowableUnits;
    var errorAllowableUnitsMsg;
    var errorMsg;
    var errorInfo;
    var unitLen;

    while (contentDiv.id !== "intMedCalcContent") {
        contentDiv = contentDiv.parentNode;
    }

    if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");
    } else { // Internet Explorer
        try {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(xml);
        } catch (err) {
            MP_Util.LogJSError(err, null, "integrated-calculators-o1.js", "MedCalc:renderXML - xml parsing error");
        }
    }
    if (xmlDoc.getElementsByTagName("QueryStringErrors").length > 0 && xmlDoc.getElementsByTagName("QueryStringErrors")[0].childNodes[0]) {
        errorHold = xmlDoc.getElementsByTagName("QueryStringErrors")[0];
        if (errorHold.getElementsByTagName("Unit_Error") && errorHold.getElementsByTagName("Unit_Error").length > 0) {
            errorMsg = ICi18n.UNIT_OF_MEASURE_ERROR;
            for (i = 0, len = errorHold.getElementsByTagName("Unit_Error").length; i < len; i++) {
                errorUnitHold = xmlDoc.getElementsByTagName("Unit_Error")[i];
                if (errorUnitHold.getElementsByTagName("Field") && errorUnitHold.getElementsByTagName("Field").length > 0) {
                    errorField = errorUnitHold.getElementsByTagName("Field")[0].childNodes[0].nodeValue;
                    errorUnit = errorUnitHold.getElementsByTagName("Error_Unit")[0].childNodes[0].nodeValue;
                    errorAllowableUnits = errorUnitHold.getElementsByTagName("Allowable_Units")[0];
                    for (j = 0, unitLen = errorAllowableUnits.getElementsByTagName("Unit").length; j < unitLen; j++) {
                        if (errorAllowableUnitsMsg && unitLen > 2) {
                            if (j === unitLen - 1) {
                                errorAllowableUnitsMsg += ", or " + errorAllowableUnits.getElementsByTagName("Unit")[j].childNodes[0].nodeValue;
                            } else {
                                errorAllowableUnitsMsg += ", " + errorAllowableUnits.getElementsByTagName("Unit")[j].childNodes[0].nodeValue;
                            }
                        } else if (errorAllowableUnitsMsg) {
                            errorAllowableUnitsMsg += " or " + errorAllowableUnits.getElementsByTagName("Unit")[j].childNodes[0].nodeValue;
                        } else {
                            errorAllowableUnitsMsg = errorAllowableUnits.getElementsByTagName("Unit")[j].childNodes[0].nodeValue;
                        }
                    }
                    if (errorInfo) {
                        errorInfo += " For " + errorField + " please use: " + errorAllowableUnitsMsg + " instead of " + errorUnit + ".  ";
                    } else {
                        errorInfo = " For " + errorField + " please use " + errorAllowableUnitsMsg + " instead of " + errorUnit + ".  ";
                    }
                    errorAllowableUnitsMsg = null;
                }
            }
        } else if (errorHold.getElementsByTagName("Invalid_Field") && errorHold.getElementsByTagName("Invalid_Field").length > 0) {
            errorField = errorHold.getElementsByTagName("Invalid_Field")[0].childNodes[0].nodeValue;
            errorMsg = ICi18n.INVALID_FIELD;
            errorInfo = " The " + errorField + " field is not valid for this calculator.";
        }
    }
    if (xmlDoc.getElementsByTagName("Total_Score").length > 0 && xmlDoc.getElementsByTagName("Total_Score")[0].childNodes[0]) {
        for (i = 0, len = xmlDoc.getElementsByTagName("Total_Score").length; i < len; i++) {
            valHold = xmlDoc.getElementsByTagName("Total_Score")[i].childNodes[0].nodeValue;
            if (valHold) {
                if (resultVal === "") {
                    resultVal = valHold.replace("Total Score = ", "");
                } else {
                    resultVal = resultVal + "<br>" + valHold.replace("Total Score = ", "");
                }
            }
        }
    } else if (xmlDoc.getElementsByTagName("Result_Value").length > 0 && xmlDoc.getElementsByTagName("Result_Value")[0].childNodes[0]) {
        for (i = 0, len = xmlDoc.getElementsByTagName("Result_Value").length; i < len; i++) {
            nameHold = xmlDoc.getElementsByTagName("Result_Name")[i].childNodes[0];
            valHold = xmlDoc.getElementsByTagName("Result_Value")[i].childNodes[0];
            unitHold = xmlDoc.getElementsByTagName("Result_Unit");
            if(unitHold && unitHold[i]) {
                unitHold = unitHold[i].childNodes[0];
            }
            if (nameHold && len > 1) {
                resultVal = resultVal + (nameHold.nodeValue).replace(/_/g, " ") + ": ";
            }
            if (valHold) {
                resultVal = resultVal + valHold.nodeValue;
            }
            if (unitHold && unitHold.nodeValue) {
                resultVal = resultVal + " " + unitHold.nodeValue + "<br>";
            } else {
                resultVal = resultVal + "<br>";
            }
        }
        resultVal = resultVal.replace(/<br>$/, "");
    } else if (xmlDoc.getElementsByTagName("Result_Interpretation").length > 0 && xmlDoc.getElementsByTagName("Result_Interpretation")[0].childNodes[0]) {
        for (i = 0, len = xmlDoc.getElementsByTagName("Result_Interpretation").length; i < len; i++) {
            valHold = xmlDoc.getElementsByTagName("Result_Interpretation")[i].childNodes[0].nodeValue;
            if (valHold) {
                if (resultVal === "") {
                    resultVal = valHold;
                } else {
                    resultVal = resultVal + "<br>" + valHold;
                }
            }
        }
    }
    if (xml) {
        if (errorBanner) {
            if (errorMsg && errorInfo) {
                errorBanner.className = errorBanner.className.replace(" hidden", "");
                errorTypeSpan = errorBanner.querySelector("#" + calcId + "_errorType");
                errorInfoSpan = errorBanner.querySelector("#" + calcId + "_errorInfo");
                errorTypeSpan.innerHTML = errorMsg;
                errorInfoSpan.innerHTML = errorInfo;
            } else {
                if (errorBanner.className.indexOf("hidden") === -1) {
                    errorBanner.className += " hidden";
                }
            }
        }
    }

    if (resultVal && resultVal !== "--") {
        if (resultSpan) {
            resultSpan.innerHTML = resultVal;
        }

        if (oldestDate) {
            dateElement.innerHTML = MP_Util.CalcWithinTime(oldestDate);
        }
        checkBox = par.querySelector("input[type='checkbox']");
        checkBox.removeAttribute("disabled");
        if (checkBox.checked) {
            contentDiv.querySelector("#intCalc_copyButton").removeAttribute("disabled");
        }
        if (curTab && curTab.indexOf(ICi18n.ALL) >= 0) {
            resultCheck.className = resultCheck.className.replace("hidden", "intCalc-icon");
        }
    } else {
        resultVal = "--";
        oldestDate = "--";

        if (resultSpan) {
            resultSpan.innerHTML = resultVal;
        }

        dateElement.innerHTML = oldestDate;

        par.querySelector("input[type='checkbox']").setAttribute("disabled", "disabled");

        var curTable = contentDiv.querySelector("#tab_content");
        var checkBoxes = curTable.querySelectorAll("input[type='checkbox']");
        var anyChecked = false;
        checkBox = null;
        for (var x = checkBoxes.length; x--;) {
            checkBox = checkBoxes[x];
            if (checkBox.id !== "tab_allCalcsChk" && !checkBox.disabled) {
                if (checkBox.checked) {
                    anyChecked = true;
                    break;
                }
            }
        }

        if (!anyChecked) {
            contentDiv.querySelector("#intCalc_copyButton").setAttribute("disabled", "disabled");
        }
        resultCheck.className = resultCheck.className.replace("intCalc-icon", "hidden");
    }

    resultObj.value = resultVal;
    resultObj.date = oldestDate;
    par.setAttribute("data-result", JSON.stringify(resultObj));

    this.updateHover(comp, par);

    function findOldestDate(data) {
        var curData = data;
        var curParam = null;
        var tmpDate = null;
        var returnDate = new Date();
        if (curData && curData.params) {
            for (var i = curData.params.length; i--;) {
                curParam = curData.params[i];
                tmpDate = new Date(curParam.curDate.replace(/^\s+|\s+$/gm, ""));
                if (returnDate > tmpDate) {
                    returnDate = tmpDate;
                }
            }
        }
        return returnDate;
    }
};


/**
 * Map the InnovATE MedCalc3000 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "MEDCALC" filter
 */
MP_Util.setObjectDefinitionMapping("MEDCALC", IntMedCalcComponent);

/*********************************
 * integrated-calculators-o1 End
 *********************************/
