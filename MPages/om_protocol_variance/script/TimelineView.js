$(window).load(function () {
    var activeTabIndex = -1;

    var compareRightIndex = -1;
    var compareLeftIndex = -1;

    var tabArray = [];
    var maxVisibleTabCapacity = 0;
    var firstVisibleTabIndex = 0;
    var lastVisibleTabIndex = 0;
    var partialShowTabIndex = -1;

    var pageArray = [];
    var visibleTabContent = [];

    var currentWindowWidth = $(window).width();
    var currentWindowHeight = $(window).height();
    var tabWidths = [];
    var varianceIconWidth = 18;

    var tooltipHoverTimeout;

    var filterString;
    var originalFilterString;

    /**************************************************/
    /* VARIABLE INITIALIZATION                        */
    /**************************************************/

    // Populate array of tabs
    $.each($(".tab"), function () {
        tabArray.push($(this));
    });

    // Populate array of pages
    $.each($(".page"), function () {
        pageArray.push($(this));
    });

    // Mark the comparison page as hidden
    $(".comparePage").hide();

    // Fill out the string representing the state of the filters.
    // Capture the initial state to avoid unnecessary message sending.
    assembleFilterString();
    originalFilterString = filterString;

    /**************************************************/
    /* LAYOUT CALCULATIONS                            */
    /**************************************************/

    // Measure visual elements for later use.
    function measureVisualElements() {
        // Apply each tab's current width as its style width to maintain width while its contents are hidden.
        $.each($(".tabCompare"), function () {
            var $tabCompare = $(this);
            $tabCompare.css("width", $tabCompare.width());
            $tabCompare.css("height", $tabCompare.height());
        });

        // Obtain tab widths.
        $.each($(".tab"), function () {
            tabWidths.push($(this).outerWidth(true) + 5);
        });
    }

    // Determine the number of tabs that should be visible.
    function determineVisibleTabs() {
        var availableWidth = $(window).innerWidth() - ($(".tabScrollButton").outerWidth(true) * 2);
        var visibleTabWidth = 0;

        for (i = firstVisibleTabIndex; i <= lastVisibleTabIndex; i++) {
            visibleTabWidth += tabWidths[i];
        }

        // Grow to the right.
        while (lastVisibleTabIndex <= tabArray.length - 1) {
            if ((visibleTabWidth + tabWidths[lastVisibleTabIndex + 1]) <= availableWidth) {
                lastVisibleTabIndex++;
                visibleTabWidth += tabWidths[lastVisibleTabIndex];
            } else {
                break;
            }
        }

        // Grow to the left (but only if the right is maxed).
        while (firstVisibleTabIndex >= 0 && lastVisibleTabIndex == tabArray.length - 1) {
            if ((visibleTabWidth + tabWidths[firstVisibleTabIndex - 1]) <= availableWidth) {
                firstVisibleTabIndex--;
                visibleTabWidth += tabWidths[firstVisibleTabIndex];
            } else {
                // Next tab is too large.
                break;
            }
        }

        // Shrink from the right.
        while (firstVisibleTabIndex !== lastVisibleTabIndex) {
            if (visibleTabWidth > availableWidth) {
                visibleTabWidth -= tabWidths[lastVisibleTabIndex];
                lastVisibleTabIndex--;
            } else {
                // We have an appropriate number of tabs.
                break;
            }
        }

        // show a partial tab to fill the tab bar if available (doesn't work yet)
        if (lastVisibleTabIndex < tabArray.length - 1) {
            //partialShowTabIndex = lastVisibleTabIndex + 1;
        } else if (firstVisibleTabIndex > 0) {
            //partialShowTabIndex = firstVisibleTabIndex - 1;
        } else {
            partialShowTabIndex = -1;
        }
    }

    /**************************************************/
    /* VISUAL ADJUSTMENTS                             */
    /**************************************************/

    // Initialize tab heights so all are equal.
    function initializeTabSizes() {
        var tallestTabHeight = 0;
        $.each($(".tab"), function () {
            var tab = $(this);
            if (tab.height() > tallestTabHeight) {
                tallestTabHeight = tab.height();
            }
        });

        $(".tab").css("height", tallestTabHeight);
    }

    // Sets width of 'tabs' div.
    function setTabAreaWidth() {
        $(".tabs").css("max-width", ($(window).innerWidth() - (2 * $(".tabScrollButton").outerWidth(true))) + "px");
    }

    // Adjust the height of the info pane div to fill the bottom portion of the screen
    // A static height is required in order for overflow:auto to provide a scroll bar
    // and we want to scroll the info pane only (if possible).
    function setInfoPaneHeight() {
        var tabBarHeight = $(".tabBar").outerHeight(true);
        var regimenTitleBarHeight = $(".regimenTitleBar").outerHeight(true);
        var pageTitleRowHeight = 0;
        var $comparePage = $(".comparePage");
        var $resizeTarget = -1;
        if ($comparePage.css("display") != "none") {
            pageTitleRowHeight = $comparePage.children(".comparePageTitles").outerHeight(true);
        } else {
            $.each($(".page"), function () {
                var $page = $(this);
                if ($page.css("display") != "none") {
                    pageTitleRowHeight = $page.children(".pageTitles").outerHeight(true);
                }
            });
        }

        var height = (currentWindowHeight - tabBarHeight - regimenTitleBarHeight - pageTitleRowHeight) + "px";
        $comparePage.children(".compareRows").css("height", height);
        $(".pageRowScrollContainer").css("height", height);

        adjustPagesForScrollBar();
    }

    // Hide all compare checkboxes and uncheck them.
    // The unchecking part is to fix inconsistent default behavior in IE8.
    function hideAllCompareCheckboxes() {
        $(".tabCompare").children().hide().attr("checked", false);
    }

    // Hide all pages.
    function hideAllPages() {
        $(".page").hide();
    }

    // Equalize variance type icon column widths.
    function setVarianceTypeIconColumnWidths() {
        var maxVarianceIconCount = 0;
        $.each($(".pageRow"), function () {
            var iconCount = $(this).children(".details").children(".varianceTypeIcon").children("img").size();
            if (iconCount > maxVarianceIconCount) {
                maxVarianceIconCount = iconCount;
            }
        });

        var $pageRows = $(".pageRow");
        $.each($pageRows.children(".details").children(".varianceTypeIcon"), function () {
            $(this).css("width", maxVarianceIconCount * varianceIconWidth);
        });

        $.each($pageRows.children(".pageRowChild").children(".details").children(".varianceTypeIcon"), function () {
            $(this).css("width", ((maxVarianceIconCount + 1) * varianceIconWidth) + 2);
        });
    }

    // Expands the width of each tab to fill the available space.
    // This will attempt to keep tabs at the same width if possible.
    function expandTabsToFill() {
        if (tabArray.length == 0) {
            return;
        }
        $(".tab").css("width", "");
        var visibleTabWidths = [];
        var availableWidth = $(window).innerWidth() - ($(".tabScrollButton").outerWidth(true) * 2);
        for (i = firstVisibleTabIndex; i <= lastVisibleTabIndex; i++) {
            availableWidth -= (tabArray[i].outerWidth(true) - tabArray[i].width());
            visibleTabWidths.push(tabArray[i].width());
        }
        visibleTabWidths = growValuesToMatch(visibleTabWidths, availableWidth);
        for (i = firstVisibleTabIndex; i <= lastVisibleTabIndex; i++) {
            tabArray[i].css("width", visibleTabWidths.shift());
        }
    }

    // Refresh the show/hide state of tabs and scroll buttons as appropriate.
    function showHideTabs() {
        $.each(tabArray, function (index, value) {
            if (((index < firstVisibleTabIndex) || (index > lastVisibleTabIndex)) && index != partialShowTabIndex) {
                value.hide();
            } else {
                value.show();
            }
        });

        // If the first and/or last tab is visible, hide the appropriate scroll button(s).
        firstVisibleTabIndex == 0 ? $("#leftScroll").addClass("tabScrollButtonDisabled") : $("#leftScroll").removeClass("tabScrollButtonDisabled");
        lastVisibleTabIndex == tabArray.length - 1 ? $("#rightScroll").addClass("tabScrollButtonDisabled") : $("#rightScroll").removeClass("tabScrollButtonDisabled");

        expandTabsToFill();
    }

    // Since we only allow part of each page's table to be scrollable, we need to make sure the non-scrollable areas are adjusted
    // to match when the scroll bar is made visible (since it takes up space and pushes scrolled elements off to the left).
    function adjustPagesForScrollBar() {
        var scrollBarWidth = 0;
        $.each($(".page"), function () {
            var $page = $(this);
            if ($page.css("display") != "none") {
                var $pageRowScrollContainer = $page.children(".pageRowScrollContainer");
                if ($pageRowScrollContainer.outerWidth(true) > $pageRowScrollContainer.children(".pageRow").outerWidth(true)) {
                    scrollBarWidth = $pageRowScrollContainer.outerWidth(true) - $pageRowScrollContainer.children(".pageRow").outerWidth(true);
                    $page.children(".pageTitles").css("padding-right", scrollBarWidth + "px");
                } else {
                    $page.children(".pageTitles").css("padding-right", "");
                }
            }
        });

        var $comparePage = $(".comparePage");
        if ($comparePage.css("display") != "none") {
            var $compareRowsContainer = $comparePage.children(".compareRows");
            if ($compareRowsContainer.outerWidth(true) > $compareRowsContainer.children(".pageRow").outerWidth(true)) {
                scrollBarWidth = $compareRowsContainer.outerWidth(true) - $compareRowsContainer.children(".pageRow").outerWidth(true);
                $comparePage.children(".comparePageTitles").css("padding-right", scrollBarWidth + "px");
            } else {
                $comparePage.children(".comparePageTitles").css("padding-right", "");
            }
        }
    }

    /**************************************************/
    /* EVENT HANDLERS                                 */
    /**************************************************/

    /***** WINDOW RESIZE ******/
    $(window).resize(function () {
        // This check is necessecary because IE8 is dumb and will fire window resize events
        // on page element changes (like what we want to call upon window resize) even though
        // the window size hasn't actually changed.  Without it, IE8 will freeze due to an
        // infinite loop of adjusting page -> window resize event -> adjusting page -> etc.
        if (currentWindowWidth !== $(window).width() || currentWindowHeight !== $(window).height()) {
            currentWindowWidth = $(window).width();
            currentWindowHeight = $(window).height();

            setInfoPaneHeight();
            setTabAreaWidth();
            determineVisibleTabs();
            showHideTabs();
        }
    });


    /***** SCROLL TABS LEFT *****/
    $("#leftScroll").click(scrollLeft);

    function scrollLeft() {
        if (firstVisibleTabIndex > 0) {
            firstVisibleTabIndex--;
            determineVisibleTabs();
            showHideTabs();
        }
    }

    /***** SCROLL TABS RIGHT *****/
    $("#rightScroll").click(scrollRight);

    function scrollRight() {
        var oldLastIndex = lastVisibleTabIndex;
        if (lastVisibleTabIndex < tabArray.length - 1) {
            firstVisibleTabIndex++;
            determineVisibleTabs();
            if (lastVisibleTabIndex == oldLastIndex) {
                // This recursion is necessecary due to the nature of determineVisibleTabs() algorithm.
                // Since it picks the last visible tab relative to the first, it's possible
                // that a wider tab might not immediately appear just by bumping the first index.
                // If this happens, call this function again until the next tab can be displayed.
                scrollRight();
            } else {
                showHideTabs();
            }
        }
    }

    /***** SELECT TAB *****/
    $(".tab").click(function () {
        selectTab($(this).index());
    });

    function selectTab(index) {
        if ((compareLeftIndex == -1) || (compareRightIndex == -1)) {
            $(".comparePage").hide();
            $(".defaultPage").hide();
            if (activeTabIndex > -1) {
                pageArray[activeTabIndex].hide();
            }
            pageArray[index].show();
            activeTabIndex = index;
            $.each($(".tab"), function () {
                var $tab = $(this);
                if ($tab.index() == activeTabIndex) {
                    $tab.addClass("tabSelected");
                    $tab.removeClass("tabHovered");
                } else {
                    $tab.removeClass("tabSelected");
                }
            });
            setInfoPaneHeight();
        }
    }

    /***** TAB HOVER *****/
    $(".tab").hover(tabHoverOver, tabHoverOut);

    function tabHoverOver() {
        var $tab = $(this);
        var $compareContainer = $tab.children(".tabContents").children(".tabInfoRow").children(".tabCompare");

        // Style the tab appropriately.
        if ($tab.hasClass("tabSelected") == false) {
            $tab.addClass("tabHovered");
        }
    }

    function tabHoverOut() {
        var $tab = $(this);
        var $compareContainer = $tab.children(".tabContents").children(".tabInfoRow").children(".tabCompare");

        // Remove hover style.
        $tab.removeClass("tabHovered");
    }

    /***** COMPARE CHECKBOX CLICK *****/
    $(".tabCompare :checkbox").click(function (event) {
        var $checkbox = $(this);
        checkboxEvent($checkbox, $checkbox.parents(".tab").index());

        // Prevent this click event from propagating up into the "Tab Selection" event.
        event.stopPropagation();
    });

    function checkboxEvent($checkbox, index) {
        if ($checkbox.is(":checked")) {
            if (compareLeftIndex == -1) {
                compareLeftIndex = index;
                selectTab(index);
            } else if (compareRightIndex == -1) {
                compareRightIndex = index;

                // Insure the lower index is on the left.
                if (compareLeftIndex > compareRightIndex) {
                    var temp = compareLeftIndex;
                    compareLeftIndex = compareRightIndex;
                    compareRightIndex = temp;
                }

                // Disable all unchecked compare checkboxes if two are selected.
                $.each($(".tabCompare :checkbox"), function () {
                    if ($(this).is(":checked") == false) {
                        $(this).attr("disabled", "disabled");
                    }
                });

                // Force both checked tabs to appear as selected.
                $.each($(".tab"), function () {
                    var $tab = $(this);
                    if ($tab.index() == compareLeftIndex || $tab.index() == compareRightIndex) {
                        $tab.addClass("tabSelected");
                    } else {
                        $tab.removeClass("tabSelected");
                    }
                });

                comparePages();
            }
        } else {
            // Clear the left/right index that was tracking this checkbox.
            if (index == compareLeftIndex) {
                compareLeftIndex = compareRightIndex;
                compareRightIndex = -1;
            } else {
                compareRightIndex = -1;
            }

            // Hide the compare page and remove its contents.
            $(".comparePage").hide();

            // Re-enable all checkboxes.
            $.each($(".tabCompare :checkbox"), function () {
                $(this).removeAttr("disabled");
            });

            // Show the last-selected tab.
            if (compareLeftIndex > -1) {
                selectTab(compareLeftIndex);
            }
        }
    }

    /***** COMPARE CLOSE PAGE LINK CLICK EVENT *****/
    $(".compareClose").click(function () {
        var $compareClose = $(this);
        var indexToClose = -1;
        if ("closeLeft" == $compareClose.attr("id")) {
            indexToClose = compareLeftIndex;
        } else if ("closeRight" == $compareClose.attr("id")) {
            indexToClose = compareRightIndex;
        }

        if (indexToClose > -1) {
            // Uncheck the appropriate checkbox and hide it.
            var $tabCompare = $(".tab").eq(indexToClose).children(".tabContents").children(".tabInfoRow").children(".tabCompare");
            $tabCompare.children(":checkbox").attr("checked", false);


            // Call the checkbox event to reconcile the change.
            checkboxEvent($(".tab").eq(indexToClose).children(".tabContents").children(".tabInfoRow").children(".tabCompare").children(":checkbox"), indexToClose);
        }
    });

    /***** PAGE ROW HOVER *****/
    $(".pageRow").hover(pageRowHoverOver, pageRowHoverOut);

    function pageRowHoverOver() {
        var $pageRow = $(this);
        $pageRow.children(".details").children(".detailText").children(".unchangedDetails").addClass("unchangedDetailsVisible");
        $pageRow.children(".pageRowChild").children(".details").children(".detailText").children(".unchangedDetails").addClass("unchangedDetailsVisible");
    }

    function pageRowHoverOut() {
        var $pageRow = $(this);
        $pageRow.children(".details").children(".detailText").children(".unchangedDetails").removeClass("unchangedDetailsVisible");
        $pageRow.children(".pageRowChild").children(".details").children(".detailText").children(".unchangedDetails").removeClass("unchangedDetailsVisible");
    }

    /***** TAB TITLE HOVER *****/
    $(".tabTitleRow").hover(tabTitleHoverOver, tabTitleHoverOut);

    function tabTitleHoverOver() {
        var $tabTitleRow = $(this);

        tooltipHoverTimeout = setTimeout(function () {
            var tabTitleText = $tabTitleRow.children(".tabTitle").text();
            var tabTitleFullText = $tabTitleRow.children(".tabTitleFull").text();
            if (tabTitleText != tabTitleFullText && tabTitleFullText != "") {
                $(".tooltip").html("");
                var tooltipHTML = generateTabTitleTooltipHTML(tabTitleFullText);
                $(".tooltip").html(tooltipHTML);
                positionTooltip($tabTitleRow);
                $(".tooltip").show();
            }
        }, 500);
    }

    function generateTabTitleTooltipHTML(text) {
        return '<div class="tooltipItemName">' + text + '</div>';
    }

    function tabTitleHoverOut() {
        clearTimeout(tooltipHoverTimeout);
        $(".tooltip").hide().html("");
    }

    /**************************************************/
    /* COMPARISON LOGIC                               */
    /**************************************************/

    function comparePages() {
        // Hide any page which might currently be displayed.
        pageArray[activeTabIndex].hide();

        // Clear any existing HTML in the comparison page div.
        $(".compareRows").html("");

        // Obtain the compared pages to extract information from.
        var $leftPage = $(".page").eq(compareLeftIndex);
        var $rightPage = $(".page").eq(compareRightIndex);

        // Insert the titles.
        var leftTitle = $leftPage.children(".pageTitles").children(".varianceTitle").html();
        $(".leftCompareTitle").children(".compareTitle").html(leftTitle);
        var rightTitle = $rightPage.children(".pageTitles").children(".varianceTitle").html();
        $(".rightCompareTitle").children(".compareTitle").html(rightTitle);

        // Generate the detail row comparisons.
        var compareHTML = "";
        var rightMatchedIndexes = [];

        // Display all of the left side page rows along with any matching right side page rows.
        if ($leftPage.children(".pageRowScrollContainer").children(".pageRow").size() > 0) {
            $.each($leftPage.children(".pageRowScrollContainer").children(".pageRow"), function () {
                var $leftPageRow = $(this);
                var leftProtocolText = $leftPageRow.children(".protocol").children().text();
                var leftDetailHTML = $leftPageRow.children(".details").html();

                // Check for a matching row from the right page.
                var $matchedRightPageRow = -1;
                var rightProtocolText = "";
                var rightDetailHTML = '&nbsp;';
                $.each($rightPage.children(".pageRowScrollContainer").children(".pageRow"), function () {
                    var $rightPageRow = $(this);
                    if (-1 == $.inArray($rightPageRow.index(), rightMatchedIndexes) && comparePageRows($leftPageRow, $rightPageRow) == true) {
                        rightMatchedIndexes.push($rightPageRow.index());
                        $matchedRightPageRow = $rightPageRow;
                        rightProtocolText = $matchedRightPageRow.children(".protocol").children().text();
                        rightDetailHTML = $matchedRightPageRow.children(".details").html();
                        return;
                    }
                });

                compareHTML += '<div class="pageRow">';
                compareHTML += /**/generateCompareRowHTMLContents(leftProtocolText, rightProtocolText, leftDetailHTML, rightDetailHTML);

                // Handle Child Rows
                var rightChildMatchedIndexes = [];
                var $leftChildren = $leftPageRow.children(".pageRowChild");

                var $rightChildren = -1;
                if ($matchedRightPageRow != -1) {
                    $rightChildren = $matchedRightPageRow.children(".pageRowChild");
                }

                // Display all of the left side child page rows along with any matching right side child page rows.
                if ($leftChildren.size() > 0) {
                    var rightChildToDisplay = 0;
                    $.each($leftChildren, function () {
                        var $leftChild = $(this);
                        var leftChildProtocolText = $leftChild.children(".protocol").children().text();
                        var leftChildDetailHTML = $leftChild.children(".details").html();
                        var rightChildProtocolText = "";
                        var rightChildDetailHTML = '&nbsp;';

                        // Attempt to find a matching child row from the right side row.
                        if ($rightChildren != -1 && $rightChildren.size() > 0) {
                            $.each($rightChildren, function() {
                                var $rightChild = $(this);
                                if (-1 == $.inArray($rightChild.index(), rightChildMatchedIndexes) && comparePageRows($leftChild,$rightChild) == true) {
                                    rightChildMatchedIndexes.push($rightChild.index());
                                    rightChildProtocolText = $rightChild.children(".protocol").children().text();
                                    rightChildDetailHTML = $rightChild.children(".details").html();
                                    return;
                                }
                            });
                        }

                        compareHTML += '<div class="pageRowChild">';
                        compareHTML += /**/generateCompareRowHTMLContents(leftChildProtocolText, rightChildProtocolText, leftChildDetailHTML, rightChildDetailHTML);
                        compareHTML += '</div>';
                    });                 
                }

                // Display all non-matched right side child rows.
                if ($rightChildren != -1 && $rightChildren.size() > 0) {
                    $.each($rightChildren, function() {
                        var $rightChild = $(this);
                        if (-1 == $.inArray($rightChild.index(), rightChildMatchedIndexes)) {
                            compareHTML += '<div class="pageRowChild">';
                            compareHTML += /**/generateCompareRowHTMLContents("", $rightChild.children(".protocol").children().text(), "&nbsp;", $rightChild.children(".details").html());
                            compareHTML += '</div>';
                        }
                    });
                }

                compareHTML += '</div>';
            });
        }

        // Display all non-matched right side rows.
        if ($rightPage.children(".pageRowScrollContainer").children(".pageRow").size() > 0) {
            $.each($rightPage.children(".pageRowScrollContainer").children(".pageRow"), function () {
                var $rightPageRow = $(this);
                if (-1 == $.inArray($rightPageRow.index(), rightMatchedIndexes)) {
                    compareHTML += '<div class="pageRow">';
                    compareHTML += generateCompareRowHTMLContents("", $rightPageRow.children(".protocol").children().text(), "&nbsp;", $rightPageRow.children(".details").html());

                    if ($rightPageRow.children(".pageRowChild").size() > 0) {
                        $.each($rightPageRow.children(".pageRowChild"), function () {
                            var $pageRowChild = $(this);
                            compareHTML += '<div class="pageRowChild">';
                            compareHTML += /**/generateCompareRowHTMLContents("", $pageRowChild.children(".protocol").children().text(), "&nbsp;", $pageRowChild.children(".details").html());
                            compareHTML += '</div>';
                        });
                    }

                    compareHTML += '</div>';
                }
            });
        }

        // Populate the compareRows div with the generated HTML and zebra stripe the newly generated rows.
        $(".compareRows").html(compareHTML).children(".pageRow:nth-child(even)").css("background-color", "#EEF5FF");

        // Set up the hover behavior of the comparison page's pageRow divs.
        $(".comparePage").children(".compareRows").children(".pageRow").hover(comparePageRowHoverOver, comparePageRowHoverOut);

        // Display the comparison page.
        $(".comparePage").show();
        setInfoPaneHeight();
    }

    // Generates the HTML of an individual comparison page row.
    function generateCompareRowHTMLContents(leftProtocol, rightProtocol, leftDetails, rightDetails) {
        var HTML = "";  
        HTML += '<div class="protocol">';
        HTML += /**/'<div class="protocolText">';
        HTML += /****/assembleProtocolDetails(leftProtocol,rightProtocol);
        HTML += /**/'</div>';
        HTML += '</div>';
        HTML += '<div class="leftCompareDetails">';
        HTML += /**/leftDetails;
        HTML += '</div>';
        HTML += '<div class="rightCompareDetails">';
        HTML += /**/rightDetails;
        HTML += '</div>';
        return HTML;
    }

    // Compare two variance page rows and return a boolean representing whether or not they match.
    // If a reference ID is blank, it is assumed to be an adhoc component which will never have a match.
    function comparePageRows($left, $right) {
        var leftReferenceId = $left.attr("referenceid");
        var rightReferenceId = $right.attr("referenceid");

        if (leftReferenceId.length == 0 || rightReferenceId.length == 0)
        {
            return false;
        }

        return leftReferenceId == rightReferenceId;
    }

    // Assemble protocol details section for a comparison row.
    function assembleProtocolDetails(leftProtocol, rightProtocol){
        // Get separator character from the javascript of the generated HTML page (since it may be i18n'd).
        var separator = getSeparator();

        if (leftProtocol == rightProtocol || rightProtocol.length == 0) {
            // Return the left side's protocol text directly if the two are equal or the right is empty.
            return leftProtocol;
        }
        else if (leftProtocol.length == 0)
        {
            //Return the right side's protocol text directly if the two aren't equal and the left is empty.
            return rightProtocol;
        }

        // Split the left side's protocol details into an array for comparison.
        var combinedProtocolArray = leftProtocol.split(separator);

        // Split the right side's protocol details into an array and append any new unique details to the "combined" array.
        var rightProtocolArray = rightProtocol.split(separator);
        for (var i = 0; i < rightProtocolArray.length; i++){
            if ($.inArray(rightProtocolArray[i], combinedProtocolArray) == -1) {
                combinedProtocolArray.push(rightProtocolArray[i]);
            }
        }

        return combinedProtocolArray.join(separator);
    }

    /**************************************************/
    /* FILTER DROPDOWN MENU                           */
    /**************************************************/
    jQuery && function (e) {
        function t(t, i) {
            var s = t ? e(this) : i;
            var o = e(s.attr("data-dropdown"));
            var u = s.hasClass("dropdown-open");
            if (t) {
                if (e(t.target).hasClass("dropdown-ignore"))
                    return;
                t.preventDefault();
                t.stopPropagation()
            } else if (s !== i.target && e(i.target).hasClass("dropdown-ignore")) return;
            n(t);
            if (u || s.hasClass("dropdown-disabled")) return;
            s.addClass("dropdown-open");
            s.addClass("filterMenuOpen");
            o.data("dropdown-trigger", s).show();
            r();
            o.trigger("show", { dropdown: o, trigger: s })
        }
        function n(t) {
            var n = t ? e(t.target).parents().addBack() : null;
            if (n && n.is(".dropdown")) {
                if (!n.is(".dropdown-menu")) return;
                if (!n.is("A"))
                    return;
            }
            e(document).find(".dropdown:visible").each(function () {
                var t = e(this);
                t.hide().removeData("dropdown-trigger").trigger("hide", { dropdown: t })

                if (filterString != originalFilterString) {
                    sendFilterMessage(filterString);
                }
            });
            e(document).find(".dropdown-open").removeClass("dropdown-open");
            e(document).find(".filterMenuOpen").removeClass("filterMenuOpen");
        }
        function r() {
            var t = e(".dropdown:visible").eq(0);
            var n = t.data("dropdown-trigger");
            var r = n ? parseInt(n.attr("data-horizontal-offset") || 0, 10) : null;
            var i = n ? parseInt(n.attr("data-vertical-offset") || 0, 10) : null;
            if (t.length === 0 || !n) return;
            t.css({
                left: n.offset().left - (t.outerWidth() - n.outerWidth()) + r, top: n.offset().top + n.outerHeight() + i
            })
        }
        e(document).on("click.dropdown", "[data-dropdown]", t);
        e(document).on("click.dropdown", n);
        e(window).on("resize", r)
    }(jQuery);

    /***** MENU ITEM HOVER *****/
    $(".menuListItem").hover(menuHoverOver, menuHoverOut);

    function menuHoverOver() {
        $(this).children(".menuText").addClass("hoveredMenuText");
        $(this).addClass("hoveredMenuListItem");
    }

    function menuHoverOut() {

        $(this).children(".menuText").removeClass("hoveredMenuText");
        $(this).removeClass("hoveredMenuListItem");
    }

    /**************************************************/
    /* CHECKMARKS FOR FILTER MENU                     */
    /**************************************************/
    $(".menuListItem").click(function () {
        $(this).toggleClass("menuChecked");
        //var $checkmark = $(this).closest("tr").children("td").children("img");
        var $checkmark = $(this).children(".menuCheckmark").children("img");
        //var $checkmark = $(this).closest("div").children("div").children("img");
        if ($checkmark.css("display") == "none") {
            $checkmark.css("display", "inline");
        } else {
            $checkmark.css("display", "none");
        }
        assembleFilterString();
    });

    /*********************************************************************************************************************/

    // Compare Page Hover Over event handler.
    function comparePageRowHoverOver() {
        var $pageRow = $(this);
        $pageRow.children(".leftCompareDetails").children(".detailText").children(".unchangedDetails").addClass("unchangedDetailsVisible");
        $pageRow.children(".rightCompareDetails").children(".detailText").children(".unchangedDetails").addClass("unchangedDetailsVisible");
        $pageRow.children(".pageRowChild").children(".leftCompareDetails").children(".detailText").children(".unchangedDetails").addClass("unchangedDetailsVisible");
        $pageRow.children(".pageRowChild").children(".rightCompareDetails").children(".detailText").children(".unchangedDetails").addClass("unchangedDetailsVisible");
    }

    // Compare Page Hover Out event handler.
    function comparePageRowHoverOut() {
        var $pageRow = $(this);
        $pageRow.children(".leftCompareDetails").children(".detailText").children(".unchangedDetails").removeClass("unchangedDetailsVisible");
        $pageRow.children(".rightCompareDetails").children(".detailText").children(".unchangedDetails").removeClass("unchangedDetailsVisible");
        $pageRow.children(".pageRowChild").children(".leftCompareDetails").children(".detailText").children(".unchangedDetails").removeClass("unchangedDetailsVisible");
        $pageRow.children(".pageRowChild").children(".rightCompareDetails").children(".detailText").children(".unchangedDetails").removeClass("unchangedDetailsVisible");
    }

    /**************************************************/
    /* TAB ICON HOVER TOOLTIPS                        */
    /**************************************************/
    $(".tabImage").hover(tabImageHoverOver, tabImageHoverOut);

    function tabImageHoverOver() {
        var $tabImage = $(this);
        tooltipHoverTimeout = setTimeout(function () {
            var pageIndex = $tabImage.parents(".tab").index();
            var typeImage = $tabImage.children("img").attr("src");
            if (typeof typeImage !== "undefined") {
                $(".tooltip").html("");
                var tooltipHTML = generateTabIconTooltipHTML(pageIndex, typeImage);
                $(".tooltip").html(tooltipHTML);
                var $positionTarget = $tabImage.children("img");
                positionTooltip($positionTarget);
                $(".tooltip").show();
            }
        }, 500);
    }

    // Calculate the correct position of the tooltip so that it appears near and below
    // the icon which is being hovered without spilling off the side of the page.
    function positionTooltip($positionTarget) {
        var $tooltip = $(".tooltip");
        var $tooltipDetailRows = $(".tooltipDetailRow");
        var tooltipWidth = 0;
        var tooltipHeight = 0;
        var pageWidth = $(window).width();
        var pageHeight = $(window).height();
        var tooltipDetailHeights = [];

        // Quickly show then hide the tooltip to obtain its height/width.
        // TODO: find a better way to do this to avoid potential flicker.
        // My JQuery-fu is not yet strong enough to accomplish this task.
        $tooltip.show();
        tooltipWidth = $tooltip.outerWidth(true);
        tooltipHeight = $tooltip.outerHeight(true);
        $.each($tooltipDetailRows, function () {
            tooltipDetailHeights.push($(this).outerHeight(true));
        });
        $tooltip.hide();

        var topPosition = $positionTarget.position().top + 20;
        var leftPosition = $positionTarget.position().left + 10;

        // Fit tooltip within the width of the page.
        if (leftPosition + tooltipWidth > pageWidth) {
            leftPosition = pageWidth - tooltipWidth;
        }

        // If items beyond the first would cause the tooltip to spill past
        // the bottom of the page, then truncate the list of items.
        var lastVisibleDetailIndex = $tooltipDetailRows.length - 1;
        while (topPosition + tooltipHeight > pageHeight && lastVisibleDetailIndex > 0) {
            $tooltipDetailRows.eq(lastVisibleDetailIndex).hide();
            lastVisibleDetailIndex--;
        }

        if (lastVisibleDetailIndex != $tooltipDetailRows.length - 1) {
            $tooltip.append('<div class="tooltipTruncatedText">' + ($tooltipDetailRows.length - 1 - lastVisibleDetailIndex) + '&nbsp;' + getMoreDisplay() + '</div>');
        }

        $tooltip.css({ "top": topPosition, "left": leftPosition });
    }

    // Generate the tooltip content from the relavent items
    // associated with the tab holding the icon being hovered over.
    function generateTabIconTooltipHTML(pageIndex, typeImage) {
        var tooltipHTML = "";
        var $sourcePage = $(".page").eq(pageIndex);
        var tooltipMaxIconCount = 1;

        $.each($sourcePage.children(".pageRowScrollContainer").children(".pageRow"), function () {
            var $images = $(this).children(".details").children(".varianceTypeIcon").children("img");
            $.each($images, function () {
                if ($(this).attr("src") == typeImage) {
                    if ($images.size() > tooltipMaxIconCount) {
                        tooltipMaxIconCount = $images.size();
                    }
                }
            });
        });

        tooltipHTML += '<div class="tooltipTitle">';
        tooltipHTML += getVarianceTypeName(typeImage);
        tooltipHTML += '</div>';

        $.each($sourcePage.children(".pageRowScrollContainer").children(".pageRow"), function () {
            var $pageRow = $(this);
            var includeInTooltip = false;
            $.each($pageRow.children(".details").children(".varianceTypeIcon").children("img"), function () {
                if ($(this).attr("src") == typeImage) {
                    includeInTooltip = true;
                }
            });

            var pageRowChildrenToInclude = [];
            $.each($pageRow.children(".pageRowChild"), function () {
                var $pageRowChild = $(this);
                $.each($pageRowChild.children(".details").children(".varianceTypeIcon").children("img"), function () {
                    if ($(this).attr("src") == typeImage) {
                        pageRowChildrenToInclude.push($pageRowChild);
                        return false;
                    }
                });
            });

            if (includeInTooltip || pageRowChildrenToInclude.length > 0) {
                tooltipHTML += '<div class="tooltipDetailRow">';
                tooltipHTML += /**/'<div class="tooltipIcon" style="width:' + (tooltipMaxIconCount * varianceIconWidth) + 'px;">';
                tooltipHTML += /****/$pageRow.children(".details").children(".varianceTypeIcon").html();
                tooltipHTML += /**/'</div>';
                tooltipHTML += /**/'<div class="tooltipItemName">';
                tooltipHTML += /****/$.trim($pageRow.children(".details").children(".detailText").children(".itemName").text());
                tooltipHTML += /**/'</div>';
                tooltipHTML += /**/'<div class="tooltipDetails" style="padding-left:' + ((tooltipMaxIconCount * varianceIconWidth) + 5) + 'px">';
                var changedDetailText = $.trim($pageRow.children(".details").children(".detailText").children(".changedDetails").text());
                if (changedDetailText.length > 0) {
                    tooltipHTML += /****/'<div class="tooltipChangedDetails">';
                    tooltipHTML += /******/changedDetailText
                    tooltipHTML += /****/'</div>';
                }
                var unchangedDetailText = $.trim($pageRow.children(".details").children(".detailText").children(".unchangedDetails").text());
                if (unchangedDetailText.length > 0) {
                    if (changedDetailText.length > 0) {
                        tooltipHTML += /****/'&nbsp';
                    }
                    tooltipHTML += /****/'<div class="tooltipUnchangedDetails">';
                    tooltipHTML += /******/unchangedDetailText
                    tooltipHTML += /****/'</div>';
                }
                var protocolText = $.trim($pageRow.children(".protocol").children(".protocolText").text());
                if (protocolText.length > 0) {
                    tooltipHTML += /****/'<div class="tooltipProtocol">';
                    tooltipHTML += /******/'&nbsp;(' + protocolText + ')';
                    tooltipHTML += /****/'</div>';
                }
                tooltipHTML += /**/'</div>';


                for (var i = 0; i < pageRowChildrenToInclude.length; i++) {
                    tooltipHTML += /**/'<div class="tooltipDetailRowChild">';
                    tooltipHTML += /****/'<div class="tooltipIcon" style="width:' + (((tooltipMaxIconCount + 1) * varianceIconWidth)) + 'px;">';
                    tooltipHTML += /******/pageRowChildrenToInclude[i].children(".details").children(".varianceTypeIcon").html();
                    tooltipHTML += /****/'</div>';
                    tooltipHTML += /****/'<div class="tooltipItemName">';
                    tooltipHTML += /******/$.trim(pageRowChildrenToInclude[i].children(".details").children(".detailText").children(".itemName").text());
                    tooltipHTML += /****/'</div>';
                    tooltipHTML += /****/'<div class="tooltipDetails" style="padding-left:' + (((tooltipMaxIconCount + 1) * varianceIconWidth) + 5) + 'px">';
                    changedDetailText = $.trim(pageRowChildrenToInclude[i].children(".details").children(".detailText").children(".changedDetails").text());
                    if (changedDetailText.length > 0) {
                        tooltipHTML += /****/'<div class="tooltipChangedDetails">';
                        tooltipHTML += /******/changedDetailText
                        tooltipHTML += /****/'</div>';
                    }
                    unchangedDetailText = $.trim(pageRowChildrenToInclude[i].children(".details").children(".detailText").children(".unchangedDetails").text());
                    if (unchangedDetailText.length > 0) {
                        if (changedDetailText.length > 0) {
                            tooltipHTML += /****/'&nbsp';
                        }
                        tooltipHTML += /****/'<div class="tooltipUnchangedDetails">';
                        tooltipHTML += /******/unchangedDetailText
                        tooltipHTML += /****/'</div>';
                    }
                    protocolText = $.trim(pageRowChildrenToInclude[i].children(".protocol").children(".protocolText").text());
                    if (protocolText.length > 0) {
                        tooltipHTML += /******/'<div class="tooltipProtocol">';
                        tooltipHTML += /********/'&nbsp;(' + protocolText + ')';
                        tooltipHTML += /******/'</div>';
                    }
                    tooltipHTML += /****/'</div>';
                    tooltipHTML += /**/'</div>';
                }

                tooltipHTML += '</div>';
            }
        });

        return tooltipHTML;
    }

    function tabImageHoverOut() {
        clearTimeout(tooltipHoverTimeout);
        $(".tooltip").hide().html("");
    }


    /**************************************************/
    /* SELECT SPECIFIC TAB ROUTINES                   */
    /**************************************************/
    window.selectTabByPlanId = selectTabByPlanId;
    function selectTabByPlanId(planId) {
        var newSelectedIndex = -1;
        $.each($(".tab"), function () {
            var $tab = $(this);
            if ($tab.attr("id") == planId.toString()) {
                newSelectedIndex = $tab.index();
            }
        });

        if (newSelectedIndex == -1) {
            showDefaultPage();
            return;
        }

        while (firstVisibleTabIndex < newSelectedIndex && lastVisibleTabIndex < tabArray.length - 1) {
            scrollRight();
        }
        while (firstVisibleTabIndex > newSelectedIndex && firstVisibleTabIndex > 0) {
            scrollLeft();
        }

        closeCompare();
        determineVisibleTabs();
        showHideTabs();
        selectTab(newSelectedIndex);
    }

    function showDefaultPage() {
        closeCompare();
        $(".page").hide();
        $(".comparePage").hide();
        $(".defaultPage").show();
        $(".tab").removeClass("tabSelected");
        $(".tab").removeClass("tabHovered");
    }

    function closeCompare() {
        compareLeftIndex = -1;
        compareRightIndex = -1;
    }

    /**************************************************/
    /* MISCELLANEOUS                                  */
    /**************************************************/

    // Zebra Striping Routine.  Sets every other row to a light blue.
    function zebraStripe() {
        $.each($(".page"), function () {
            $(".pageRow:nth-child(2n)", this).css("background-color", "#EEF5FF");
        });
    }

    function assembleFilterString() {
        filterString = "";
        $.each($(".menuListItem"), function () {
            if ($(this).hasClass("menuChecked")) {
                filterString += "1";
            } else {
                filterString += "0";
            }
        });
    }

    function sendFilterMessage(message) {
        window.location = ("winmsg:filtersChanged:" + message);
    }

    // takes a given array and grows its values (starting with the smallest)
    // until the total reaches a given limit
    function growValuesToMatch(values, limit) {
        var totalSize = 0;
        var lowValue = -1;
        for (i = 0; i < values.length; i++) {
            totalSize += values[i];
            if (values[i] < lowValue || lowValue == -1) {
                lowValue = values[i];
            }
        }

        while (totalSize < limit) {
            // find the indexes with the lowest value
            var lowValueIndexes = [];
            for (i = 0; i < values.length; i++) {
                if (values[i] == lowValue) {
                    lowValueIndexes.push(i);
                }
            }

            var targetValue = -1
            if (lowValueIndexes.length != values.length) {
                // find the second lowest value and set it as the target to grow the smallest to
                for (i = 0; i < values.length; i++) {
                    if (values[i] > lowValue && (values[i] < targetValue || targetValue == -1)) {
                        targetValue = values[i];
                    }
                }

                var totalGrowValue = (targetValue - lowValue) * lowValueIndexes.length
                if (totalSize + totalGrowValue > limit) {
                    // growing the smallest values to match the next value above them would surpass the limit
                    // so grow the smallest values evenly until the limit is reached
                    var growValue = Math.floor((limit - totalSize) / lowValueIndexes.length);
                    for (i = 0; i < lowValueIndexes.length; i++) {
                        values[lowValueIndexes[i]] += growValue;
                    }
                    totalSize = limit;
                } else {
                    // grow the smallest values to match the next value above them
                    for (i = 0; i < lowValueIndexes.length; i++) {
                        values[lowValueIndexes[i]] = targetValue;
                    }
                    lowValue = targetValue;
                    totalSize += totalGrowValue;
                }
            } else {
                // all values are even, divide the limit value amongst them
                targetValue = Math.floor(limit / values.length);
                for (i = 0; i < values.length; i++) {
                    values[i] = targetValue;
                }
                totalSize = limit;
            }
        }

        return values;
    }

    // scroll to last tab
    function scrollToEnd() {
        selectTabByPlanId($(".tab:last").attr("id"));
    }

    /**************************************************/
    /* INITIAL FUNCTION CALLS                         */
    /**************************************************/
    measureVisualElements(); // Perform initial size checking and static sizing as needed.
    initializeTabSizes(); // Equalize tab heights.
    setVarianceTypeIconColumnWidths(); // Set all variance type icon divs to the same width.
    hideAllPages();  //Hide all pages.
    zebraStripe(); // Apply Zebra Striping to all pageRow divs.
    setTabAreaWidth(); // Set the width of the tab area (so to enable partial tab viewing)
    determineVisibleTabs(); // Calculate how many tabs can be shown.
    showHideTabs(); // Show and Hide the appropriate tabs.
    scrollToEnd(); // Scroll to last tab.
    setInfoPaneHeight(); // Set a static height height on the InfoPane div to enable scrolling.
});
                                                                                                                                            