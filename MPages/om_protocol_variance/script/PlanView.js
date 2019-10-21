$(window).load(function () {
    var visiblePageIndex = 0;
    var pageArray = [];

    var varianceIconWidth = 18; //16x16 icon + 2px padding

    var currentWindowWidth = $(window).width();
    var currentWindowHeight = $(window).height();

    var filterString;
    var originalFilterString;

    /**************************************************/
    /* VARIABLE INITIALIZATION                        */
    /**************************************************/

    // Populate array of pages
    $.each($(".page"), function () {
        pageArray.push($(this));
    });

    // Fill out the string representing the state of the filters.
    // Capture the initial state to avoid unnecessary message sending.
    assembleFilterString();
    originalFilterString = filterString;

    /**************************************************/
    /* LAYOUT CALCULATIONS                            */
    /**************************************************/

    /**************************************************/
    /* VISUAL ADJUSTMENTS                             */
    /**************************************************/
    // Show and Hide the appropriate pages.
    function showHidePages() {
        $.each(pageArray, function (index, value) {
            if (index != visiblePageIndex) {
                value.hide();
            } else {
                value.show();
            }
        });

        // If the first or last page is visible, hide the appropriate scroll button(s).
        visiblePageIndex == 0 ? $("#left").addClass("pageScrollButtonDisabled") : $("#left").removeClass("pageScrollButtonDisabled");
        visiblePageIndex == pageArray.length - 1 ? $("#right").addClass("pageScrollButtonDisabled") : $("#right").removeClass("pageScrollButtonDisabled");
        setInfoPaneHeight();
    }

    // Adjust the height of the info pane div to fill the bottom portion of the screen
    // A static height is required in order for overflow:auto to provide a scroll bar.
    function setInfoPaneHeight() {
        $(".pageRowScrollContainer").css("height", $(window).innerHeight() - $(".pageTitles").eq(visiblePageIndex).outerHeight(true) + "px");
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

    // Hide all pages.
    function hideAllPages() {
        $.each($(".page"), function () {
            $(this).hide();
        });
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
        }
    });

    /***** NAVIGATE LEFT *****/
    $(".pageNavLeft").click(pageNavLeft);

    function pageNavLeft() {
        if (visiblePageIndex > 0) {
            visiblePageIndex--;
            showHidePages();
        }
    }

    /***** NAVIGATE RIGHT *****/
    $(".pageNavRight").click(pageNavRight);

    function pageNavRight() {
        if (visiblePageIndex < pageArray.length - 1) {
            visiblePageIndex++;
            showHidePages();
        }
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
        var $checkmark = $(this).children(".menuCheckmark").children("img");
        if ($checkmark.css("display") == "none") {
            $checkmark.css("display", "inline");
        } else {
            $checkmark.css("display", "none");
        }
        assembleFilterString();
    });

    /**************************************************/
    /* SELECT SPECIFIC TAB ROUTINES                   */
    /**************************************************/
    window.selectPageByPlanId = selectPageByPlanId;
    function selectPageByPlanId(planId) {
        var newSelectedIndex = -1;
        $.each($(".page"), function () {
            var $page = $(this);
            if ($page.attr("id") == planId.toString()) {
                newSelectedIndex = $page.index();
            }
        });

        if (newSelectedIndex == -1) {
            return;
        }

        visiblePageIndex = newSelectedIndex;

        showHidePages();
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

    /**************************************************/
    /* INITIAL FUNCTION CALLS                         */
    /**************************************************/
    zebraStripe(); // Apply Zebra Striping to all pageRow divs.
    setVarianceTypeIconColumnWidths(); // Set all variance type icon divs to the same width.
    showHidePages(); // Show the appropriate page only.
    setInfoPaneHeight(); // Set a static height height on the InfoPane div to enable scrolling.
    assembleFilterString(); // Capture initial filter states.
});