define(['jquery', 'plugins/dialog', 'knockout', 'jqueryui'], function ($, dialog, ko) {
    var customDialog = {
        blockoutOpacity: 0.2,
        removeDelay: 0,
        /**
        * In this function, you are expected to add a DOM element to the tree which will serve as the "host" for the modal's composed view. You must add a property called host to the modalWindow object which references the dom element. It is this host which is passed to the composition module.
        * @method addHost
        * @param {Dialog} theDialog The dialog model.
        */
        addHost: function (theDialog) {
            var body = $('body');
            var zIndex = dialog.getNextZIndex();
            var host = $('<div></div>')
                            .css({ 'z-index': dialog.getNextZIndex() })
                            .appendTo(body);

            theDialog.host = host.get(0);

            if (!dialog.isOpen()) {
                theDialog.oldBodyMarginRight = body.css("margin-right");
                theDialog.oldInlineMarginRight = body.get(0).style.marginRight;

                var html = $("html");
                var oldBodyOuterWidth = body.outerWidth(true);
                var oldScrollTop = html.scrollTop();
                $("html").css("overflow-y", "hidden");
                var newBodyOuterWidth = $("body").outerWidth(true);
                body.css("margin-right", (newBodyOuterWidth - oldBodyOuterWidth + parseInt(theDialog.oldBodyMarginRight)) + "px");
                html.scrollTop(oldScrollTop); // necessary for Firefox
                newBodyOuterWidth = null;
                html = null;
            }

            body = null;
            host = null;
        },
        /**
        * This function is expected to remove any DOM machinery associated with the specified dialog and do any other necessary cleanup.
        * @method removeHost
        * @param {Dialog} theDialog The dialog model.
        */
        removeHost: function (theDialog) {
            $(theDialog.host).css('opacity', 0);

            setTimeout(function () {
                $(theDialog.host).dialog("destroy");
                ko.removeNode(theDialog.host);
            }, this.removeDelay);

            if (!dialog.isOpen()) {
                var html = $("html");
                var oldScrollTop = html.scrollTop(); // necessary for Firefox.
                html.css("overflow-y", "").scrollTop(oldScrollTop);

                if (theDialog.oldInlineMarginRight) {
                    $("body").css("margin-right", theDialog.oldBodyMarginRight);
                } else {
                    $("body").css("margin-right", '');
                }
                html = null;
            }
        },
        /**
        * This function is called after the modal is fully composed into the DOM, allowing your implementation to do any final modifications, such as positioning or animation. You can obtain the original dialog object by using `getDialog` on context.model.
        * @method compositionComplete
        * @param {DOMElement} child The dialog view.
        * @param {DOMElement} parent The parent view.
        * @param {object} context The composition context.
        */
        compositionComplete: function (child, parent, context) {
            var $child = $(child);
            var $parent = $(parent);
            var parentWidth = 600;
            var parentHeight = 600;
            var theDialog = dialog.getDialog(context.model);
            var modalTitle = context.model.title;
            var dialogClass = "";

            var width = $child.width();
            width = width > parentWidth ? parentWidth : width;

            var height = $child.height();
            height = height > parentHeight ? parentHeight : height;

            if (ko.isComputed(modalTitle) || ko.isObservable(modalTitle)) {
                modalTitle = modalTitle();
            }

            // If no title is present, hide the title-bar
            if (modalTitle === undefined) {
                dialogClass = "no-title-bar";
            }

            $(theDialog.host).dialog({
                modal: true,
                height: height,
                minWidth: width + 40,
                title: modalTitle,
                dialogClass: dialogClass,
                closeOnEscape: false,
                beforeClose: function (event, ui) {
                    // Whenever the "X" button is clicked, call the dialog's close function
                    // to invoke Durandal's lifecycle management methods - canDeactivate and deactivate.
                    theDialog.close();
                    // Always return false, so that the dialog does not close immediately. The lifecylce
                    // events of durandal will handle removing the dialog from DOM if necessary.
                    return false;
                },
                buttons: context.model.buttons
            });

            // show the composed view as part of the modal
            $child.show();

            // reset the height and position based on rendering
            $(theDialog.host).height($child.height() > $parent.height() && $child.height() > parentHeight ? $parent.height() : $child.height() + 10);
            $(theDialog.host).dialog("option", "position", { my: "center", at: "center", of: window });

            $(theDialog.host).css('opacity', 1);

            $('.autofocus', child).each(function () {
                $(this).focus();
            });
        },
        attached: function (view, parent) {
            // hide the view to show it later as part of the modal
            $(view).hide();

        }
    };

    return customDialog;
});