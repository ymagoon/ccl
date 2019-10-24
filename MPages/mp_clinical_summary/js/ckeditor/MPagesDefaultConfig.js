/*
Primary use is to test multiple editors living in an mpage, not currently used in production
*/
CKEDITOR.editorConfig = function (config) {

    config.removePlugins = 'a11yhelp,about,bidi,blockquote,dialogadvtab,div,elementspath,entities,fakeobjects,filebrowser,find,flash,forms,horizontalrule,iframe,image,link,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,save,scayt,smiley,showblocks,showborders,sourcearea,specialchar,tab,table,tabletools,templates,wsc';
    config.extraPlugins = 'autosave,placeholdertext';

    config.toolbar = [];
    var localToolbar = ['Font', 'FontSize', '-', 'Cut', 'Copy', 'Paste', '-', 'Bold', 'Italic', 'Underline', '-', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'];

    // check if we should append the AutoText plugin
	/*
    if (typeof CKEDITOR.AutoTextHelper !== 'undefined' && 1 == CKEDITOR.AutoTextHelper.IsAutoTextEnabled()) {
        localToolbar.push('-');
        localToolbar.push('ManageAutoText');
    }
	*/

    config.toolbar.push(localToolbar);

    // Right-click menu, currently ONLY including Cut, Copy and Paste (spellcheck suggestions added dynamically)
    config.menu_groups = 'clipboard';

    // fonts
    config.font_names = 'Arial;Calibri;Comic Sans MS;Courier New;Georgia;Lucida Sans Unicode;Tahoma;Times New Roman;Trebuchet MS;Verdana;Willow';

    // default font name and size
    config.font_defaultLabel = 'Calibri';
    config.fontSize_defaultLabel = '14px';
    
	// #fff
	//configObj.uiColor = DDCOLOR.getDefaultBackgroundColor();
    config.uiColor = '#fff';

    // set the behavior for the ENTER key to insert a <BR>
    config.enterMode = CKEDITOR.ENTER_BR;

    config.contentsCss = [CKEDITOR.basePath + 'css/dyndochover.css', CKEDITOR.basePath + 'contents.css'];

    // set the behavior of the TAB key to add five spaces (&nbsp;) to the text
    config.tabSpaces = 5;

    // Need to make this launch a CCDialog and get rid of the unsaved changes message box w/the caption
    // "Message from the browser".  For now don't show it at all.
    config.colorButton_enableMore = false;

    // Defaults to 20
    config.undoStackSize = 30;

    config.resize_enabled = false;

    // Set to true if using source, set to false if generating minified dyndocckeditor.js
    config.loadPluginJsFiles = false;
    
    // remove collapse button for the toolbar
    config.toolbarCanCollapse = false;
};
