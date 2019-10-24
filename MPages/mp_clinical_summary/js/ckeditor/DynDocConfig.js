/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function (config) {
    
    // If language is not specified in the config file, CKEditor sets the language based on OS locale. 
    // If language is specified in the property here, it is loaded irrespective of the locale.
    config.language = '';

    // Substitute CKEditor's clipboard plug-in with DynDoc implementation, cerndyndocclipboard.
    // 'pastetext' has a dependency on 'clipboard', therefore it must be removed too.
    // cerndyndocclipboard and cernclipboard cannot co-exist with 'clipboard', as they share the same command name

    config.removePlugins = 'a11yhelp,about,basicstyles,bidi,blockquote,clipboard,dialogadvtab,div,elementspath,entities,fakeobjects,filebrowser,find,flash,forms,horizontalrule,iframe,image,justify,link,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,save,scayt,smiley,showblocks,showborders,sourcearea,specialchar,tab,table,tabletools,templates,wsc';
    config.extraPlugins = 'cerndyndocf3,cerndyndocmaximize,cerndyndocsavenote,cerndyndoccss,cerndyndocclosenote,cerndyndocscayt,cerndyndocundo,cerndyndocsignnote,cerndyndocclipboard,cerndyndocdirty,cerndyndocbasicstyles,cerndyndocjustify,cerndisablehotkeys,cerndyndoccommon,cerndyndocautotext,cernborder,cerngetxhtml,cerndyndoclayout,cernselectionfix';

    // Check if SCAYT Preference is 'off' (0). If so, do not load cerndyndocscayt plugin     
    if (null != CKEDITOR.DynDocHelper && (typeof CKEDITOR.DynDocHelper.GetIntPref !== 'undefined') && 0 == CKEDITOR.DynDocHelper.GetIntPref("ScaytEnabled")) {
        config.extraPlugins = 'cerndyndocf3,cerndyndocmaximize,cerndyndocsavenote,cerndyndoccss,cerndyndocclosenote,cerndyndocundo,cerndyndocsignnote,cerndyndocclipboard,cerndyndocdirty,cerndyndocbasicstyles,cerndyndocjustify,cerndisablehotkeys,cerndyndoccommon,cerndyndocautotext,cernborder,cerngetxhtml,cerndyndoclayout';
    }

    config.toolbar = [];
    var localToolbar = null;
    if ((null == CKEDITOR.DynDocHelper) || (typeof CKEDITOR.DynDocHelper.GetIntPref === 'undefined') || (1 == CKEDITOR.DynDocHelper.GetIntPref("NoStrikeThrough"))) {
        localToolbar = ['Font', 'FontSize', '-', 'Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo', '-', 'Bold', 'Italic', 'Underline', 'Strike', '-', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'];
    }
    else {
        localToolbar = ['Font', 'FontSize', '-', 'Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo', '-', 'Bold', 'Italic', 'Underline', '-', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'];
    }
    
    // check if we should append the AutoText plugin
    if (typeof CKEDITOR.AutoTextHelper !== 'undefined' && 1 == CKEDITOR.AutoTextHelper.IsAutoTextEnabled()) {
        localToolbar.push('-');
        localToolbar.push('ManageAutoText');
    }

    config.toolbar.push(localToolbar);

    // Right-click menu, currently ONLY including Cut, Copy and Paste (spellcheck suggestions added dynamically)
    config.menu_groups = 'clipboard';

    // fonts
    config.font_names = 'Arial;Calibri;Comic Sans MS;Courier New;Georgia;Lucida Sans Unicode;Tahoma;Times New Roman;Trebuchet MS;Verdana;Willow';

    // set the behavior for the ENTER key to insert a <BR>
    config.enterMode = CKEDITOR.ENTER_BR;

    config.contentsCss = [CKEDITOR.basePath + 'css/dyndochover.css', CKEDITOR.basePath + 'contents.css'];

    // This defines the maximum number of spellcheck suggestions to be shown in the context menu
    config.scayt_maxSuggestions = 5;

    // Needed to set the initial focus to a free text field
    config.startupFocus = true;

    // Need to make this launch a CCDialog and get rid of the unsaved changes message box w/the caption
    // "Message from the browser".  For now don't show it at all.
    config.colorButton_enableMore = false;

    // Defaults to 20
    config.undoStackSize = 30;

    // Set to true if using source, set to false if generating minified dyndocckeditor.js
    config.loadPluginJsFiles = true;
};
