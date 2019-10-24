if(typeof Lib === 'undefined') {
    var Lib = {};
}

/**
 * An embedded Modal.
 * @class
 * @param {String} id         The desired ID for the Modal.
 * @param {String} htmlString The desired content to be displayed in the Modal.
 */
Lib.Modal = function(id, htmlString) {
    id = (id || '') + 'Modal';
    htmlString = htmlString || '';
    
    var modal = this,
        /**
         * jQuery object representing the Modal.
         * @memberOf Modal
         * @private
         * @type {Object}
         */
        $modal,
    	functionOnClose;

    /**
     * Gets the jQuery object representing the Modal.
     * @memberOf Modal
     * @public
     * @return {Object} The jQuery object representing the Modal.
     */
    modal.getModal = function() {
        return $modal;
    };

    /**
     * Sets the jQuery object representing the Modal.
     * @memberOf Modal
     * @private
     * @param {Object} $newObj A new jQuery object representing the Modal.
     */
    function setModal($newObj) {
        $modal = $newObj;
    }

    /**
     * Shows the Modal.
     * @memberOf Modal
     * @public
     * @param {Object} [options] Standard jQuery options for show().
     * @return {Modal} The instance of the Modal.
     */
    modal.show = function(options) {
        modal.getModal().show(options);
        return modal;
    };

    /**
     * Hides the Modal.
     * @memberOf Modal
     * @public
     * @param {Object} [options] Standard jQuery options for hide().
     * @return {Modal} The instance of the Modal.
     */
    modal.hide = function(options) {
        modal.getModal().hide(options);
        return modal;
    };

    /**
     * Sets the content to be displayed in the Modal.
     * @memberOf Modal
     * @public
     * @param {String} content An HTML string of content to display in the Modal.
     * @return {Modal} The instance of the Modal.
     */
    modal.setContent = function(content) {
        if(typeof content === 'string' && content !== '') {
            modal.getModal().find('.modalContent').html(content);
        }
        return modal;
    };

    /**
     * @memberOf Modal
     * @public
     * @return {String} The HTML content of the Modal.
     */
    modal.getContent = function() {
        return modal.getModal().find('.modalContent').html();
    };

    /**
     * Sets what function to call when the modal is closed
     * @memberOf Modal
     * @public
     * @param {function} fn - Function to run on close of modal
     */
    modal.setFunctionOnClose = function (fn) {
        if (typeof fn === 'function') {
            functionOnClose = fn;
        }
        return modal;
    };

    /**
     * Attaches the necessary event handlers to the Modal.
     * @memberOf Modal
     * @private
     */
    function attachEventHandlers() {
        modal.getModal().find('.modalClose button')
            .add('.modalBackground').click(function() {
                modal.hide();

                if(functionOnClose !== undefined) {
                    functionOnClose();
                }
        });
    }

    /**
     * Initializes the Modal.
     * @constructs Modal#
     * @private
     */
    function init() {
        var html = '<div id="' + id + '" class="modalContainer">' +
                '<div id="' + id + 'ModalBackground" class="modalBackground">' +
                '</div>' +
                '<div class="modalSpacer">' +
                '</div>' +
                '<div id="' + id + 'Modal" class="modal">' +
                    '<div id="' + id + 'Content" class="modalContent">' +
                    '</div>' +
                    '<div id="' + id + 'Close" class="modalClose">' +
                        '<button type="button" class="modalCloseButton">' +
                            i18n.common.CLOSE +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="modalSpacer">' +
                '</div>' +
            '</div>';
        $('body').prepend(html);
        setModal($('#' + id));
        modal.getModal().hide();
        modal.setContent(htmlString);
        attachEventHandlers();
    }
    
    init();
};