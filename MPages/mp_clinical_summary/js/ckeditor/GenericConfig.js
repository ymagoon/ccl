/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function (config) {

    // ,clipboard,basicstyles,justify
    config.removePlugins = 'basicstyles,clipboard,elementspath,showborders,scayt,flash,forms,link,image,table,pastefromword,pastetext';
    config.extraPlugins = 'cernbasicstyles,cernborder,cerncommon,cernclipboard,cerndyndocmaximize';

    config.toolbar = [['Font', 'FontSize', '-', 'Cut', 'Copy', 'Paste', '-', 'Bold', 'Italic', 'Underline', 'Strike', '-', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']];

    // Right-click menu, currently ONLY including Cut, Copy and Paste (spellcheck suggestions added dynamically)
    config.menu_groups = 'clipboard';

    // fonts
    config.font_names = 'Arial;Calibri;Comic Sans MS;Courier New;Georgia;Lucida Sans Unicode;Tahoma;Times New Roman;Trebuchet MS;Verdana;Willow';

    // set the behavior for the ENTER key to insert a <BR>
    config.enterMode = CKEDITOR.ENTER_BR;

    // set the behavior of the TAB key to add five spaces (&nbsp;) to the text
    config.tabSpaces = 5;

    config.contentsCss = [CKEDITOR.basePath + 'contents.css'];

    config.height = '300px';
    config.autoGrow_onStartup = true;

    // Need to make this launch a CCDialog and get rid of the unsaved changes message box w/the caption
    // "Message from the browser".  For now don't show it at all.
    config.colorButton_enableMore = false;

    // Defaults to 20
    config.undoStackSize = 30;

    // Needed to set the initial focus to a free text field
    config.startupFocus = true;

    // Set to true if using source, set to false if generating minified genericckeditor.js
    config.loadPluginJsFiles = true;
};
