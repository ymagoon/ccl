/*
Primary use is to test multiple editors living in an mpage, not currently used in production
*/

CKEDITOR.editorConfig = function (config) {
	if ('DiscernObjectFactory' in top.window.external) {
		if (!CKEDITOR.AutoTextHelper) {
			CKEDITOR.AutoTextHelper = top.window.external.DiscernObjectFactory("AUTOTEXTHELPER");
		}
		
		if (!CKEDITOR.ClipboardHelper) {
			CKEDITOR.ClipboardHelper = top.window.external.DiscernObjectFactory("CLIPBOARDHELPER");
		}
		
		if (!CKEDITOR.DocUtilsHelper) {
			CKEDITOR.DocUtilsHelper = top.window.external.DiscernObjectFactory("DOCUTILSHELPER");
		}
		
		if (!CKEDITOR.SpellCheckHelper) {
			CKEDITOR.SpellCheckHelper = top.window.external.DiscernObjectFactory("SPELLCHECKHELPER");
		}
	}
	
    //config.language = 'en';

    config.removePlugins = 'a11yhelp,about,bidi,blockquote,clipboard,dialogadvtab,div,elementspath,entities,fakeobjects,filebrowser,find,flash,forms,horizontalrule,iframe,image,link,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,save,scayt,smiley,showblocks,showborders,sourcearea,specialchar,tab,table,tabletools,templates,wsc';
    config.extraPlugins = 'cernautotext,cernclipboard,cerngetxhtml,cernscayt,cernf3,cernselectionfix,placeholdertext'; //autosave

    config.toolbar = [];
	
	//Toolbar is not required 
    // var localToolbar = ['Font', 'FontSize', '-', 'Cut', 'Copy', 'Paste', '-', 'Bold', 'Italic', 'Underline', '-', 'TextColor', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'];
	var localToolbar = [];
    // // check if we should append the AutoText plugin
     if (typeof CKEDITOR.AutoTextHelper !== 'undefined' && 1 == CKEDITOR.AutoTextHelper.IsAutoTextEnabled()) {
         //localToolbar.push('-');
         localToolbar.push('ManageAutoText');
     }

     config.toolbar.push(localToolbar);
	//Toolbar is not required 

    // Right-click menu, currently ONLY including Cut, Copy and Paste (spellcheck suggestions added dynamically)
    config.menu_groups = 'clipboard';

    // fonts
    config.font_names = 'Arial;Calibri;Comic Sans MS;Courier New;Georgia;Lucida Sans Unicode;Tahoma;Times New Roman;Trebuchet MS;Verdana;Willow';

    // default font name and size
    config.font_defaultLabel = 'Arial';
    config.fontSize_defaultLabel = '25px';
    
	// DDCOLOR.getDefaultBackgroundColor() has a dependency on CKEDITOR.DocUtilsHelper 
    if (DDCOLOR && CKEDITOR.DocUtilsHelper) {
    	config.uiColor = DDCOLOR.getDefaultBackgroundColor();
    }

    // set the behavior for the ENTER key to insert a <BR>
    config.enterMode = CKEDITOR.ENTER_BR;

    config.contentsCss = [CKEDITOR.basePath + 'css/dyndochover.css', CKEDITOR.basePath + 'contents.css'];

    // set the behavior of the TAB key to add five spaces (&nbsp;) to the text
    config.tabSpaces = 5;

    // This defines the maximum number of spellcheck suggestions to be shown in the context menu
    config.scayt_maxSuggestions = 5;

    // Needed to set the initial focus to a free text field
    config.startupFocus = false;
    
    // Need to make this launch a CCDialog and get rid of the unsaved changes message box w/the caption
    // "Message from the browser".  For now don't show it at all.
    config.colorButton_enableMore = false;

    // Defaults to 20
    config.undoStackSize = 30;

    config.resize_enabled = false;

    // Set to true if using source, set to false if generating minified dyndocckeditor.js
    config.loadPluginJsFiles = false;

    // The mpage needs the DTD, html, head, title, and body elements
    config.emitValidXhtml = true;
    
    // remove collapse button for the toolbar
    config.toolbarCanCollapse = false;

};
