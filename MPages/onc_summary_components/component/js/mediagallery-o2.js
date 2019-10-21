var g_MediaGadgetO2XMLHttpRequestObj = new XMLHttpRequest();
/**
 * Create the component style object which will be used to style various aspects of our component.
 * @class
 * @return {undefined} Nothing
 */
function MediaGalleryO2ComponentStyle(){
    this.initByNamespace("mmfgal-o2");
}
MediaGalleryO2ComponentStyle.inherits(ComponentStyle);

/**
 * @class
 * @classdesc Initialize the Media Gallery Workflow (o2) component
 * @constructor
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function MediaGalleryO2Component(criterion){
    this.m_baseServiceURL = "";
    this.m_sURLParams = "";
    this.m_mediaStash = null;
    this.m_personId = 0;
    this.m_viewableImageIds = [];
    this.setCriterion(criterion);
    this.setLookBackDropDown(true);
    this.setStyles(new MediaGalleryO2ComponentStyle());
    this.clearTimeoutCount = 750;
    this.activelyHovering = false;
    this.docTimeout = null;
    this.m_MediaViewerURL = "";
    this.m_menuGroupBy = 0; //0: Group By Date, 1: Group By Content Type
    this.m_thumbNailSize = 100; // Default thumb nail size
    this.m_docData = []; //store related documents for images
    this.m_contentTypeFilterList = []; //store the list of Bedrock filtered content types
    this.compMenuReference = {};
    this.$rootNode = {};
    this.m_contentTypeJSON = null; //store content types JSON object
    this.m_patientImages = [];
    this.mmf2I18n = i18n.discernabu.mediaGallery_o2;
    this.m_arrayofGrps = [];
    this.m_docDataForSelectedMedias = {}; //key/value pairs object to store related documents for selected images for Review Pane
    this.m_selectedIdxOnReviewPane = 0; //store the index of the current selected image on the Review pane
    this.m_reviewPaneCurWidthOfLeftSec = 0; //initialize the current width of the Left body section in the review pane
    this.m_mineTypeList = [
                        "image/jpeg",
                        "image/jpg",
                        "image/bmp",
                        "image/png",
                        "image/pipeg",
                        "image/ipe",
                        "jpeg",
                        "jpg",
                        "bmp",
                        "png"
                        ]; //  this is the list of mineType (media Type) can be displayed in the Review Pane.

    this.m_fullCanonicalDomainName = "";
    this.m_imageIdSelectedList = []; //store the list of image ids of selected images that are viewed in review pane

    //Set the timer names so the architecture will create the correct timers for our use
    this.setComponentLoadTimerName("USR:MPG.MMF.GALLERY.02 _ load component");
    this.setComponentRenderTimerName("ENG:MPG.MMF.GALLERY.02 _ render component");
    //Make sure the architecture includes the result count when creating the count text
    this.setIncludeLineNumber(true);
    this.setMineTypeList(this.m_mineTypeList);
    this.ORIENTATION_TOOLS = {ROTATE_LEFT: 0, ROTATE_RIGHT: 1, FLIP_VERTICAL: 2, FLIP_HORIZONTAL: 3};

    MediaGalleryO2Component.method("openTab", function() {
        var criterion = this.getCriterion();
        var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + this.getLink() + "+^";
        APPLINK(0, criterion.executable, sParms);
    });

    MediaGalleryO2Component.method("getPrefJson", function() {
        var json = {"GROUP_BY_PREF": this.m_menuGroupBy};
        return json;
    });

    this.mediaGalleryo2PrefObj = {
        MEDIA_GALLERY_PREFS: {}
    };
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
MediaGalleryO2Component.prototype = new MPageComponent();
MediaGalleryO2Component.prototype.constructor = MPageComponent;
MediaGalleryO2Component.inherits(MPageComponent);

/* Supporting functions */
/**
 * Retrieve the components preferences.
 * @return {object} Preference Object.
 */
MediaGalleryO2Component.prototype.getPreferencesObj = function() {
    return MPageComponent.prototype.getPreferencesObj.call(this, null);
};

/**
 * Sets the URL paramaters used to determine which medias to retrieve.
 * @param {[string]} sURLParams : A URL string that will be used when retrieving medias.
 * @return {undefined} Nothing
 */
MediaGalleryO2Component.prototype.setURLParams = function(sURLParams){
      this.m_sURLParams = sURLParams;
};

/**
 * Retrieves the URL paramaters that will be used when retrieving medias.
 * @return {[string]} A URL string that will be used when retrieving medias.
 */
MediaGalleryO2Component.prototype.getURLParams = function(){
    return this.m_sURLParams;
};

/**
 * Retrieves the CAMM URL that will be used when retrieving medias.
 * @return {[string]} A URL string that will be used when retrieving medias.
 * (i.e. http://iptmpwas01/camm-mpage-1.0/provide.northamerica.cerner.net/service/)
 */
MediaGalleryO2Component.prototype.getBaseURL = function(){
    return this.m_baseServiceURL;
};

/**
 * Sets the json object of medias used to determine when displaying component.
 * @param {[object]}  media A json object that will be used when displaying component.
 * @return {undefined} Nothing
 */
MediaGalleryO2Component.prototype.setMediaStash = function(media){
    this.m_mediaStash = media;
};
/**
 * Retrieves the medias that will be used when displaying component.
 * @return {[object]} A json object that will be used when displaying component.
 */
MediaGalleryO2Component.prototype.getMediaStash = function(){
    return this.m_mediaStash;
};

/**
 * Sets the array of media objects for the patient.
 * @param [{object}] media An array of media objects.
 * @return {undefined} Nothing
 */
MediaGalleryO2Component.prototype.setPatientImages = function(media){
    this.m_patientImages = media;
};

/**
 * getPatientImages
 * Retrieves the media objects array.
 * @return [{object}] An array of media objects.
 */
MediaGalleryO2Component.prototype.getPatientImages = function(){
    return this.m_patientImages;
};

/**
 * Sets the json object of all content types used to determine if user has privilege to maintain (inactivate) a media.
 * @param {[object]} contentTypes : A json object that will be used to determine if user has privilege to maintain (inactivate) a media.
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.setContentTypesJSON = function(contentTypes){
    this.m_contentTypesJSON = contentTypes;
};

/**
 * Retrieves the content types JSON that will be used to determine if user has privilege to maintain (inactivate) a media.
 * @return {[object]} A json object that will be used to determine if user has privilege to maintain (inactivate) a media.
 */
MediaGalleryO2Component.prototype.getContentTypesJSON = function(){
    return this.m_contentTypesJSON;
};

MediaGalleryO2Component.prototype.setPersonId = function(personId){
    this.m_personId = personId;
};
MediaGalleryO2Component.prototype.getPersonId = function(){
    return this.m_personId;
};

/**
 * Set imageRecord for the image object to contain the following attributes:
 * imageId, description, serviceDate, contentType, imageURL, mimeType, groupId, maintainPriv, version, size
 * @param   {STRING} imageId the unique media object identifier (i.e {35-59-57-eb-f1-2d-48-2a-9a-94-d4-ce-14-89-94-8b})
 * @param {STRING} description the description of image
 * @param {String} serviceDate the service start date stored with the object. If no service start date was stored the date created date is returned. The numeric value represents the epoch time - Number of seconds elapsed since midnight January 1, 1970 UTC
 * @param {String} contentType : Image's content type
 * @param {String} imageURL : the URL that will launch Media Viewer for the image. It has the format as this.getBaseURL() + "thumbnail/" + obj.identifier + "?size=5&generic=1"
 * @param {String} mimeType : the stored mime type for the object.
 * @param {String} groupId : group identifier if the object is a member of a group or is the parent object for a group.
 * @param {String} maintainPriv : Content type privilege to rename/inactivate images (True/false)
 * @param {String} version : media object version
 * @param {String} size : size of image. There is no unique, by default is KB.
 * @param {String} contentTypeKey : media's content type key.
 * @return {object}: image object with the following attribute
 *                  imageId, description, serviceDate, contentType, imageURL, mimeType, groupId, maintainPriv, version, size, contentTypeKey
 */
MediaGalleryO2Component.prototype.imageRecord = function(imageId, description, serviceDate, contentType, imageURL, mimeType, groupId, maintainPriv, version, size, contentTypeKey) {
      return {imageId: imageId, description: description, serviceDate: serviceDate, contentType: contentType, imageURL: imageURL, mimeType: mimeType, groupId: groupId, maintainPriv: maintainPriv, versionNumber: version, size: size, contentTypeKey: contentTypeKey};
};

/**
 * Sets the array of content type ids used when determining which content types to retrieve.
 * @param {[object]} contentTypes : An array of content type ids which will be used to determine which
 * media objects to retrieve.
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.setContentTypes = function(contentTypes) {
    this.m_contentTypes = contentTypes;
};

/**
 * Retrieves the array of content type ids that will be used when retrieving media objects.
 * @return {[object]} An array of content type ids which will be used when retrieving media objects.
 */
MediaGalleryO2Component.prototype.getContentTypes = function() {
    return this.m_contentTypes;
};

/**
 * Sets the array of content type objects used when determining which content types to retrieve.
 * @param {[object]} contentTypeFilterList : An array of content type objects which will be used to determine which
 * media objects to retrieve.
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.setContentTypeFilterList = function(contentTypeFilterList) {
    this.m_contentTypeFilterList = contentTypeFilterList;
};

/**
 * Retrieves the array of content type objects that will be used when retrieving media objects.
 * @return {[object]} An array of content type objects which will be used when retrieving media objects.
 */
MediaGalleryO2Component.prototype.getContentTypeFilterList = function() {
    return this.m_contentTypeFilterList;
};

/**
 * Sets the array of document data objects used when determining which related documents for selected image to retrieve.
 * @param [{object}] docDataForSelectedMedias An array of related document data objects which will be used to determine which
 * related documents for selected image.
 */
MediaGalleryO2Component.prototype.setDocDataForSelectedMedias = function(docDataForSelectedMedias) {
    var docDataObj = {}; //this is the key/value pairs object to store the related document where image_id is the key, value is an array of document objects.
    var relateDocsArray = [];
    var docsLen = docDataForSelectedMedias.length;
     for(var i = 0; i < docsLen; i++) {
        var curDoc = docDataForSelectedMedias[i];
        if (docDataObj[curDoc.IMAGE_ID]) { //if key found, then add curDoc into the existing array doc value
            relateDocsArray = docDataObj[curDoc.IMAGE_ID];
            relateDocsArray.push(curDoc);
            docDataObj[curDoc.IMAGE_ID] = relateDocsArray;
        }
        else { //key not found, reset the document array, and insert the document in.
            relateDocsArray = [];
            relateDocsArray.push(curDoc);
            docDataObj[curDoc.IMAGE_ID] = relateDocsArray;
        }
     }//end for

     this.m_docDataForSelectedMedias = docDataObj;
};

/**
 * Retrieves the key/value pairs object of related document data objects that will be used when retrieving related documents for selected image.
 * @return {[object]} key/value pairs object for related document data objects which will be used when related documents for selected image.
 */
MediaGalleryO2Component.prototype.getDocDataForSelectedMedias = function() {
    return this.m_docDataForSelectedMedias;
};

/**
 * Sets the array of mine types (media types) used when determining which the media object can have the image content (larger size).
 * @param [{String}] mineTypeList An array of mine types which will be used to determine which
 * media objects can have image content.
 */
MediaGalleryO2Component.prototype.setMineTypeList = function(mineTypeList) {
    this.m_mineTypeList = mineTypeList;
};

/**
 * Retrieves the array of mine types (media type such jpg, pdf....) that will be used when determining a media object can be displayed in the review pane.
 * @return [{String}] An array of mine types which will be used when determining a media object can be displayed in the review pane.
 */
MediaGalleryO2Component.prototype.getMineTypeList = function() {
    return this.m_mineTypeList;
};

/**
 * Sets the current index of the selected image(or active-slide) on the review pane.
 * @param {number} selectedIdxOnReviewPane :the index of the selected image or active-slide.
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.setSelectedIdxOnReviewPane = function(selectedIdxOnReviewPane) {
    this.m_selectedIdxOnReviewPane = selectedIdxOnReviewPane;
};

/**
 * Retrieves the current index of the selected image(or active-slide) on the review pane.
 * @return {number} the index of the selected image or active-slide.
 */
MediaGalleryO2Component.prototype.getSelectedIdxOnReviewPane = function() {
    return this.m_selectedIdxOnReviewPane;
};

/**
 * Sets the current width of the Left Body section in the Review Pane.
 * @param {Number} reviewPaneCurWidthOfLeftSec : The current width of the Left Body section in the Review Pane.
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.setReviewPaneCurWidthOfLeftSec = function(reviewPaneCurWidthOfLeftSec) {
    this.m_reviewPaneCurWidthOfLeftSec = reviewPaneCurWidthOfLeftSec;
};

/**
 * Retrieves the current width of the Left Body section in the Review Pane.
 * @return {number} the number of pixels for the current width of the Left Body section in the Review Pane.
 */
MediaGalleryO2Component.prototype.getReviewPaneCurWidthOfLeftSec = function() {
    return this.m_reviewPaneCurWidthOfLeftSec;
};

/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.loadFilterMappings = function(){
    //Add the filter mapping object for the Content Types //mg_content_type
    this.addFilterMappingObject("WF_MG_CONTENT_TYPE", {
        setFunction: this.setContentTypes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
};

/**
 * This function sets the save button to enabled or disabled.
 * @param {boolean} enabled is the button to be enabled or not
 * @return {undefined} none
 */
MediaGalleryO2Component.prototype.setSaveButton = function(enabled) {
  var mmfgalO2compId = "mmfgal-o2" + this.getComponentId();
  //reset the button if it is NOT a read only content.
  if (!$("#" + mmfgalO2compId + "contentReadOnly").is(":visible")) {
    var rpEditSaveBtn = document.getElementById(mmfgalO2compId + "rpEditSaveBtn");
    if(rpEditSaveBtn !== null) {
        rpEditSaveBtn.disabled = !enabled;
    }
  }
};

/**
 * This function sets the cancel button to enabled or disabled.
 * @param {boolean} enabled is the button to be enabled or not
 * @return {undefined} none
 */
MediaGalleryO2Component.prototype.setCancelButton = function(enabled) {
  var component = this;
  var compId = component.getComponentId();
    var rpEditResetBtn = _g("mmfgal-o2" + compId + "rpEditResetBtn");

  //look for the current selected image.
  var $activeSlide = $(component.$rootNode.find(".active-slide").children()[0]);
  var activeImageId = $activeSlide.attr("id");
  var sImageId = "{" + activeImageId + "}";

  //get image object for the given image id.
  var imgObj = component.getImageObjById(sImageId);
  var imageTypeList = component.getMineTypeList(); //get the list of mine type that are image type such jpeg, png, bmp...
  var imageType = $.grep(imageTypeList, function(imgType) {
    return imgType === imgObj.mimeType; //look for the same mineType
  });

  //only reset cancel button if it is an image type
  if (imageType.length > 0) {
    if(rpEditResetBtn !== null) {
        rpEditResetBtn.disabled = !enabled;
    }
  }
};

MediaGalleryO2Component.prototype.resizeComponent = function() {
    var compId = this.getComponentId();
    var component = this;
    var NAV_BUTTONS_WDTH = 46; //Total width that used for the prev/next button in image tray of review pane.
    var IMAGE_WIDTH = 58;//Total width that used for each image div
    var SPACES = 105; //spaces are used for calculating width/height layout.
    var $rootNode = this.$rootNode;
    var IMG_NAV_BUTTONS_WDTH = 60; //Total width that used for the prev/next buttons in image content section of review pane
    var OTHER_SPACES = 10; //other spaces are used for calculating width/height layout.
    var mmfgalO2compId = "#mmfgal-o2" + compId;
    var curActiveSlideIdx = component.getSelectedIdxOnReviewPane(); //get the current active-slide index
    var RP_RIGHT_FIXED_W = 300;//The fixed width 300px for right section on review pane.
    var RP_WIDTH_600 = 600; //The width 600px that will be used to determine when the right section width is needed to adjust
    var BORDER_2PX = 2; //constant for 2 px
    var OTHER_3PX = 3; //constant for 3 px

    //Call the base class functionality to resize the component
    MPageComponent.prototype.resizeComponent.call(this, null);

    var bodyContentHeight = $rootNode.find(".mmf2-content-body").height();
    $rootNode.find(".mmf2-nav-panel").css("height", bodyContentHeight);

    //Resize the Review pane's height the same as height of browser view port when the component is resized.
    var windowHeight = $(window).height();   //returns height of browser view port
    var $mmf2contentReviewDiv = $("#mmf2contentReviewDiv" + compId); //get review pane
    $mmf2contentReviewDiv.css("height", windowHeight - SPACES); //set height for review pane


    var reviewPaneOuterHeight = $mmf2contentReviewDiv.outerHeight(); //get review pane outer height
    var rpLeftHeaderOuterHeight = $(mmfgalO2compId + "rpLeftHeader").outerHeight(); //get review pane left header outer height

    //set height for left body section (Image area) = reviewpane height - left header - left footer sections
    var $rpLeftFooterImageTray = $(mmfgalO2compId + "rpLeftFooterImageTray"); //get left footer (image tray)
    var rpLeftFooterOuterHeight = $rpLeftFooterImageTray.outerHeight(); //get left footer (image tray) height
    $(mmfgalO2compId + "rpLeftBody").css("height", reviewPaneOuterHeight - rpLeftHeaderOuterHeight - rpLeftFooterOuterHeight - BORDER_2PX); //note: 2px for viewpoint borders

    var rpOuterWidth = $mmf2contentReviewDiv.outerWidth(); //get review pane outer width
    var $rpLeft = $rootNode.find(".mmf2-review-pane-left"); //get review pane Left section
    var $rpRight = $(mmfgalO2compId + "reviewPaneRight"); //get review pane Right Section
    var rpRigthOuterWidth = $rpRight.outerWidth(); //review pane - right section outer width

    //Initial set width for the left section = Review pane width - Right section width - other border pixels
    $rpLeft.css("width", rpOuterWidth - rpRigthOuterWidth - OTHER_3PX - BORDER_2PX); //note: 3px for review pane borders for some reasons

    //-----------------Resize review pane left and right width------------------------------------------------

    //Review pane right section has 300px fixed, when resizing occurred that made it to be about 50% portion of review pane which is 600px,
    //therefore when the size is smaller then 600px, adjust the right section to be 35% of the review pane.
    if (rpOuterWidth >= RP_WIDTH_600) {
        $rpRight.css("width", RP_RIGHT_FIXED_W); //set right section 300px fixed
        $rpLeft.css("width", rpOuterWidth - RP_RIGHT_FIXED_W - OTHER_3PX - BORDER_2PX);
    } else { //review pane less than 600 which is right and left section is about 50%, then adjust the right panel to be 35% of review pane width
        $rpRight.css("width", (rpOuterWidth * 0.35));
        $rpLeft.css("width", rpOuterWidth - $rpRight.width() - OTHER_3PX - BORDER_2PX);
    }
    /*-----------------Resize the Image Content Section (left body section/Image area)-----------------------------*/
    //Set height for Image content Navigator the same as the left body height section
    var rpLeftBodyHeight = $(mmfgalO2compId + "rpLeftBody").height();
    $(mmfgalO2compId + "reviewImgNavContainer").css("height", rpLeftBodyHeight); //set height for image navigator container
    $rootNode.find(".mmf2-review-pane-img-content-container").css("height", rpLeftBodyHeight - 10); //set height for image content container area

    //Set width for Image content Navigator (left body section (Image area)
    var oldrpLeftBodyWidth = component.getReviewPaneCurWidthOfLeftSec();
    var rpLeftBodyWidth = $(mmfgalO2compId + "rpLeftBody").width();
    component.setReviewPaneCurWidthOfLeftSec(rpLeftBodyWidth); //keep track the current width of the Left Body section
    $(mmfgalO2compId + "reviewImgNavContainer").css("width", rpLeftBodyWidth); //set width for image navigator container
    $(mmfgalO2compId + "reviewPaneImgNavContent").css("width", rpLeftBodyWidth - IMG_NAV_BUTTONS_WDTH - OTHER_SPACES); //set width for image navigator content
    $rootNode.find(".mmf2-review-pane-img-content-container").css("width", rpLeftBodyWidth - IMG_NAV_BUTTONS_WDTH - OTHER_SPACES); //set width for image content container

    //check if it has been resized, the image content width has changed that pushed the active slide to left/right
    //therefore it needs to scroll/animate to ensure the current active-slide is still displaying in the right position.
    if (oldrpLeftBodyWidth > 0) { //resizing occurred (when it is 0, the review pane is just loaded)
        var imgContentContainerWidth = $rootNode.find(".mmf2-review-pane-img-content-container").width();
        //check if the current active-slide is not the 1st element, then scroll/animate accordingly.
        //note: there is no need to animate the first element because the image content was not impacted of pushing left/right when the width is changed.
        if (curActiveSlideIdx > 0) {
            if (rpLeftBodyWidth !== oldrpLeftBodyWidth) { //resizing occurred
                //Find the total width for all slides
                var imgSlideList = $rootNode.find("#mmfgal-o2" + compId + "reviewPaneImgNavContent")[0].children;
                var totalWidthAllImgContainer = (imgContentContainerWidth * imgSlideList.length) + 100 + "px";
                var positionActiveSlide = (imgContentContainerWidth + 8) * curActiveSlideIdx + "px"; //8px is for borders and margins
                //make the slide to scroll to the farthest left at the beginning of the 1st element
                //then make it scroll to the current index of the active-slide
                //stop(true, true): will force the animation completed without showing the animation
                $(mmfgalO2compId + "reviewPaneImgNavContent").animate({
                    scrollLeft: "-=" + totalWidthAllImgContainer
                }).stop(true, true).animate({
                    scrollLeft: "+=" + positionActiveSlide
                }).stop(true, true);
            }
        }
    }

    //Set top position for buttons on the Image Content Area (on the left body section/Image area)
    //it will be in 1/2 of Image area height minus 1/2 buttons' height
    $rootNode.find(".mmf2-review-pane-img-nav-btns").css("top", (rpLeftBodyHeight / 2 - 25)); //set top for buttons on the Image content navigator

    /*-----------------Resize the Image Tray Section (left footer section)-----------------------------*/
    //set width for image tray navigator
    var rpLeftFooterWidth = $rpLeftFooterImageTray.width();

    $rootNode.find(".mmf2-review-pane-nav-container").css("width", rpLeftFooterWidth);  //set width for the image tray container
    var $mmf2ReviewPaneNavContent = $("#mmf2ReviewPaneNavContent" + compId); //get review navigator content
    $mmf2ReviewPaneNavContent.css("width", rpLeftFooterWidth - NAV_BUTTONS_WDTH);  //set width for the image tray content
    var rpNavContentWidth = $mmf2ReviewPaneNavContent.width();

    //Find the total width that are needed for displaying all images on the image tray
    var imgNodes = $rootNode.find( ".mmf2-review-pane-img-contain .mmf2-thumb");
    var imagesWidth = (imgNodes.length) * IMAGE_WIDTH;

    var mgReviewPrevNavId = mmfgalO2compId + "reviewPrevNav";
    var mgReviewNxtNavId = mmfgalO2compId + "reviewNxtNav";
    var imageTrayNavBtns = mgReviewPrevNavId + ", " + mgReviewNxtNavId;

    //check if the total width for all images is shorter then the viewable image tray content, then don't show the image asset icons (Prev/Next Navigator icons)
    if (imagesWidth <= rpNavContentWidth) {
        $(imageTrayNavBtns).hide();
        $mmf2ReviewPaneNavContent.css("left", 0); //adjust the Left of image tray content to 0 position when the image asset icons are hidden.
    }
    else { //show the prev/next navigator icons when images' width longer then the viewable image tray.
        $(imageTrayNavBtns).show();
        $mmf2ReviewPaneNavContent.css("left", 20); //adjust the Left of image tray content to 20px so that it displays the Previous image asset icon

        //TODO: Determine when to show the prev/next button on the image tray.
        //check to see if there is hidden previous/next images on the tray, then display the prev/next buttons accordingly
    }

  //Resize Edit tab section
  component.resizeEditTabContent();
  //Resize the Canvas Display
  component.resizeCanvasDisplay();
};

/**
 * resizeEditTabContent
 * This function will resize any elements that are needed to be resized on the Edit tab in the review pane.
 * @return {UNDEFINED} Nothing
 */
 MediaGalleryO2Component.prototype.resizeEditTabContent = function() {
  var mmfgalO2compId = "#mmfgal-o2" + this.getComponentId();
  var TAB_OFFSET = 45; //some OFFSET that are needed for adjustment
  var EDIT_TAB_MARGIN_R = parseInt($(mmfgalO2compId + "tab1").css("margin-right"), 10); //take tab margin right for tab1 since all tabs the same
  var TAB_HEIGHT = 30;
  var tabsWidth = $(".mmf2-review-pane-tabs").outerWidth();
  var tabsMarginLeft = parseInt($(".mmf2-review-pane-tabs ul").css("margin-left"), 10);
  var tab1Width = $(mmfgalO2compId + "tab1").outerWidth() + EDIT_TAB_MARGIN_R;
  var tab2Width = $(mmfgalO2compId + "tab2").outerWidth() + EDIT_TAB_MARGIN_R;
  var totalWidthIcons = ($(".mmf2-review-pane-edit-btn").width() + parseInt($(".mmf2-review-pane-edit-btn").css("margin-left"), 10) + parseInt($(".mmf2-review-pane-edit-btn").css("margin-right"), 10)) * 4; //width + margins for all 4 icons
  var mmfgalO2CompIdContentReadOnly = mmfgalO2compId + "contentReadOnly";
  var contentReadOnlyDisplay = $(mmfgalO2CompIdContentReadOnly).css("display");

  //check if the tabs width layout is smaller then the total width of each tabs.
  //then increase the tab's height layout.
  if (tabsWidth - tabsMarginLeft < tab1Width + tab2Width) {
    $(".mmf2-review-pane-tabs").css("height", TAB_HEIGHT * 2);
  } else {
    $(".mmf2-review-pane-tabs").css("height", TAB_HEIGHT);
  }

  var rpRightHeight = $(".mmf2-review-pane-right").height();
  var tabHeight = $(".mmf2-review-pane-tabs").height();

  //set the height for tab contents
  $(".mmf2-review-pane-tab-content").css("height", rpRightHeight - tabHeight - 5);

  //set height for the edit tab content
  var nEditTabContent = $(".mmf2-review-pane-tab-wrap").outerHeight() - $(".mmf2-review-pane-tabs").outerHeight();
  $(mmfgalO2compId + "tabContent2").css("height", nEditTabContent);

  //set right-edit-body height same as the tab content
  $(".mmf2-review-pane-right-edit-body").css("height", $(mmfgalO2compId + "tabContent2").outerHeight());

  //set min-height for the edit tab content.
  if (contentReadOnlyDisplay === "block") {
    $(mmfgalO2compId + "tabContent2").css("min-height", 245);
  }else {
    $(mmfgalO2compId + "tabContent2").css("min-height", 205);
  }

  var editToolsWidth = $(".mmf2-review-pane-edit-tools").width();

  //resize the Orientation tools (fiedset group)
  if (editToolsWidth > 0) {//when 0, review pane just loaded, resize not happened
    if (editToolsWidth < totalWidthIcons){
      $(".mmf2-review-pane-edit-tools-fieldset").css("height", 110 );
    } else {
      $(".mmf2-review-pane-edit-tools-fieldset").css("height", 60 );
    }
  }

  //Set margin top for the buttons to display on the bottom of the edit tab.
  var nEditImageNameOuterHeight = $(".mmf2-review-pane-edit-image-name").outerHeight();
  var nEditImageNameHeight = $(".mmf2-review-pane-edit-image-name").height();
  var contentReadOnlyHeight = $(mmfgalO2CompIdContentReadOnly).outerHeight();
  if (nEditImageNameHeight === 0) {//When it is first load, the height is 0, so add height 18 for it
    nEditImageNameOuterHeight += 18;
  }
  var nMarginForEditBtnSec = $(".mmf2-review-pane-right-edit-body").outerHeight() - nEditImageNameOuterHeight -
                $(".mmf2-review-pane-edit-line-separator").outerHeight() -
                $(".mmf2-review-pane-edit-tools-fieldset").outerHeight();
  if (contentReadOnlyDisplay === "block") {
    nMarginForEditBtnSec = nMarginForEditBtnSec - contentReadOnlyHeight - 10;
  }

  $(".mmf2-review-pane-edit-btn-sec").css("margin-top", nMarginForEditBtnSec - TAB_OFFSET);
};

/**
 * resizeCanvasDisplay
 * This function will resize image display on the canvas when it is in Edit tab in the review pane.
 * @return {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.resizeCanvasDisplay = function() {
    logger.logDebug("Entering resizeCanvasDisplay");
	var component = this;
	var nameSpace = component.getStyles().getNameSpace();
	var mmfgalO2compId = "#" + nameSpace + component.getComponentId();
    //find the active slide element
    var $activeSlide = $(component.$rootNode.find(".active-slide").children()[0]);
    //get the active slide element id attribute
    var activeImageId = $activeSlide.attr("id");
    //get the canvas element
	var fgCanvas = $(mmfgalO2compId + "mmf2Canvas" + activeImageId);

    if(fgCanvas.length !== 0) {
        // find the active slide content container
        var $rpImgcontentContainer = $(mmfgalO2compId + "rpImgContentContainer.active-slide");
        //calculate the image size to display on canvas based on the image container size and the real image size (on the canvas html attributes)
        var displayCanvas = component.calculateMaxImageDisplay($rpImgcontentContainer, {width: fgCanvas.attr("width"), height: fgCanvas.attr("height")});
        //Set the width/height for the image can be displayed on the canvas element
        fgCanvas.css("width", displayCanvas.width + "px");
        fgCanvas.css("height", displayCanvas.height + "px");
    }else{
        logger.logDebug("canvas element not present");
    }
};

/**
 * rotateImage This function will rotate a canvas 90 degrees to the right or the left.
 * @param {string} compId the component identifier
 * @param {number} direction direction of the rotation
 * @return {undefined} none
 */
MediaGalleryO2Component.prototype.rotateImage = function(compId, direction) {
    logger.logDebug("Entering rotateImage");
    var component = MP_Util.GetCompObjById(compId);
    var mmfgalO2compId = "mmfgal-o2" + compId;
    //find the active slide element
    var $activeSlide = $(component.$rootNode.find(".active-slide").children()[0]);
    //get the active slide element id attribute
    var activeImageId = $activeSlide.attr("id");

    if($("#" + mmfgalO2compId + "mmf2Canvas" + activeImageId).length) {
        //retrieve the canvas element
        var canvas = document.getElementById(mmfgalO2compId + "mmf2Canvas" + activeImageId);
        //there needs to be a null check here
        //because the canvas might not exist at the point in time when the user clicks the flip/rotate button
        //because the canvas is created asynchronously when the review pane is created
        if (canvas && typeof canvas !== "undefined") {
            var context = canvas.getContext("2d");
            var dataURL = canvas.toDataURL();
            var canvasWidth = canvas.width;
            var canvasHeight = canvas.height;
            var degrees = 0;

            canvas.width = canvasHeight;
            canvas.height = canvasWidth;

            //Save the current state
            context.save();

            switch(direction) {
                case component.ORIENTATION_TOOLS.ROTATE_LEFT:
                context.translate(0, canvas.height);
                degrees = -90;
                break;
                case component.ORIENTATION_TOOLS.ROTATE_RIGHT:
                context.translate(canvas.width, 0);
                degrees = 90;
                break;
                default:
                return;
            }

            context.rotate(degrees * Math.PI / 180);

            var img = new Image();
            img.onload = function(){
                // draw the image
                context.drawImage(img, 0, 0);
                // Restore the last saved state
                context.restore();
                // Resize the canvas display
                component.resizeCanvasDisplay();
            };
            img.src = dataURL;
        }
    }
};

/**
 * flipImage This function will flip a canvas horizontally or vertically.
 * @param {number} compId Component id.
 * @param {string} flipDirection direction of the flip
 * @return {undefined} none
 */
MediaGalleryO2Component.prototype.flipImage = function(compId, flipDirection) {
    logger.logDebug("Entering flipImage");
    var component = MP_Util.GetCompObjById(compId);
    var mmfgalO2compId = "mmfgal-o2" + compId;
    //find the active slide element
    var $activeSlide = $(component.$rootNode.find(".active-slide").children()[0]);
    //get the active slide element id attribute
    var activeImageId = $activeSlide.attr("id");
    logger.logDebug("activeImageId: " + activeImageId);

    //retrieve the canvas element
    var canvas = document.getElementById(mmfgalO2compId + "mmf2Canvas" + activeImageId);
    //there needs to be a null check here
    //because the canvas might not exist at the point in time when the user clicks the flip/rotate button
    //because the canvas is created asynchronously when the review pane is created
    if (canvas && typeof canvas !== "undefined") {
        var context = canvas.getContext("2d");
        var dataURL = canvas.toDataURL();

        //unchanged, these values result in no effect
        var scaleH = 1;
        var scaleV = 1;
        var posX = 0;
        var posY = 0;

        //alter scale and pos for the flip
        switch(flipDirection){
            case component.ORIENTATION_TOOLS.FLIP_VERTICAL:
                scaleH = 1;
                scaleV = -1;
                posX = 0;
                posY = canvas.height * -1;
                break;
            case component.ORIENTATION_TOOLS.FLIP_HORIZONTAL:
                scaleH = -1;
                scaleV = 1;
                posX = canvas.width * -1;
                posY = 0;
                break;
            default:
                return;
        }

        // Save the current state
        context.save();
        // Set scale to flip the image
        context.scale(scaleH, scaleV);

        var img = new Image();
        img.onload = function(){
            // draw the image
            context.drawImage(img, posX, posY);
            // Restore the last saved state
            context.restore();
        };
        img.src = dataURL;
    }
};

/**
 * removeCanvas: this function will remove a canvas when the edit tab is no longer active.
 * @param {number} compId component identifier
 * @return {undefined} none
*/
MediaGalleryO2Component.prototype.removeCanvas = function(compId) {
    var component = MP_Util.GetCompObjById(compId);
    var mmfgalO2compId = "mmfgal-o2" + compId;
    var $activeSlide = $(component.$rootNode.find(".active-slide").children()[0]);
    var activeImageId = $activeSlide.attr("id");
    var $mmf2CanvasContainer = component.$rootNode.find("#" + mmfgalO2compId + "mmf2Canvas" + activeImageId);

    if($mmf2CanvasContainer.length) {
        $mmf2CanvasContainer.parent(".mmf2-canvas-container").remove();
        component.$rootNode.find(".active-slide img").css("visibility", "visible");
        component.setCancelButton(false);
        component.setSaveButton(false);
    }
};

/**
 * generateCanvas
 * This function will generate a canvas html with the current selected image's dimension
 * @param {Number} compId the component identifier
 * @param {Image} img the image that will be drawn.
 * @param {Number} width the original width of an selected image.
 * @param {Number} height the original height of an selected image.
 * @return {undefined} none
 */
MediaGalleryO2Component.prototype.generateCanvas = function(compId, img, width, height) {
    logger.logDebug("Entering generateCanvas");
    var component = MP_Util.GetCompObjById(compId);

    if(component.isCanvasSupported()) {
        var mmfgalO2compId = "mmfgal-o2" + compId;
        var $rootNode = component.$rootNode;
        var $activeSlide = $($rootNode.find(".active-slide").children()[0]);
        var activeImageId = $activeSlide.attr("id");

        var cHTML = "<div class='mmf2-canvas-container' name = '" + activeImageId + "'><canvas id ='" + mmfgalO2compId + "mmf2Canvas" + activeImageId + "' width='" + width + "' height='" + height + "' style='z-index:10;'></canvas></div>";
        if($rootNode.find("#" + mmfgalO2compId + "mmf2Canvas" + activeImageId).size() === 0) {
            $rootNode.find("img#" + activeImageId + ".mmf2-thumb").parent(".mmf2-review-pane-img-content-container").append(cHTML);
        }

		//Calculate the canvas size to display the right image size to fit the image container
		var $rpImgcontentContainer = $("#" + mmfgalO2compId + "rpImgContentContainer.active-slide");
		var displayCanvas = component.calculateMaxImageDisplay($rpImgcontentContainer, {width: width, height: height});
		$("#" + mmfgalO2compId + "mmf2Canvas" + activeImageId).css("width", displayCanvas.width + "px");
		$("#" + mmfgalO2compId + "mmf2Canvas" + activeImageId).css("height", displayCanvas.height + "px");
		var fgCanvas = document.getElementById(mmfgalO2compId + "mmf2Canvas" + activeImageId);
		var fgContext = fgCanvas.getContext("2d");
		fgContext.drawImage(img, 0, 0);
		$rootNode.find(".active-slide img").css("visibility", "hidden");
    }else{
        logger.logMessage("generateCanvas: isCanvasSupported: canvas is not supported");
    }
};

/**
 * addCanvas
 * This function will generate a canvas layout with the current selected image (active-slide of image content area).
 * @param {Number} compId the component identifier
 * @return {undefined} none
 */
MediaGalleryO2Component.prototype.addCanvas = function(compId) {
	logger.logDebug("Entering addCanvas");
	var self = this;
    var component = MP_Util.GetCompObjById(compId);

    if(component.isCanvasSupported()){
        var mmfgalO2compId = "mmfgal-o2" + compId;
        var imageTypeList = [];
        var imgObj = null;
        var $activeSlide = $(component.$rootNode.find(".active-slide").children()[0]);
        var activeImageId = $activeSlide.attr("id");
        var sImageId = "{" + activeImageId + "}";

        //get image object for the given image id.
        imgObj = component.getImageObjById(sImageId);
        imageTypeList = component.getMineTypeList(); //get the list of mine type that are image type such jpeg, png, bmp...
        var imageType = $.grep(imageTypeList, function(imgType) {
            return imgType === imgObj.mimeType; //look for the same mineType
        });

        //verify that the edit tab is selected
        if(component.$rootNode.find("#" + mmfgalO2compId + "tab2").hasClass("active") && imageType.length){
			var imgMaxSizeRequest = "height=1200&width=1600";
			var imageCanvasSrc = component.getBaseURL() + "asImage/{" + activeImageId + "}?" + imgMaxSizeRequest;
			var receiver = document.getElementById(mmfgalO2compId + "iFrameReceiver").contentWindow;
			
			logger.logMessage("Posting message to receiver: " + imageCanvasSrc);
			// Send a message with the image canvas source to the new window.
			receiver.postMessage( {getDataURL: {imageSource:imageCanvasSrc}}, component.getCAMMOrigin());
        }
    }else{
        logger.logMessage("addCanvas: isCanvasSupported: canvas is not supported");
    }
};

/**
 * preProcessing
 * Adding Component Menu items for Workflow
 *
 * @return {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.preProcessing = function() {
    var compMenu, compId;
    compMenu = this.getMenu();
    compId = this.getComponentId();
    var mediagalI18n = i18n.discernabu.mediaGallery_o2;
    var component = this;
    if (this.isDisplayable() === true) {
        //setting the component menu item: Group By Content Type
        var compMenuGroupByContentType = new MenuSelection("compMenuGroupByContentType" + compId);
        compMenuGroupByContentType.setLabel(mediagalI18n.GROUP_BY_CONTENT_TYPE);
        compMenuGroupByContentType.setIsDisabled(false); //enable menu
        compMenuGroupByContentType.setIsSelected(component.m_menuGroupBy === 1 ? true : false); //set unselected by default
        compMenuGroupByContentType.setClickFunction(function() {
            if (component.m_menuGroupBy === 0) { //if it is group by Date
                component.m_menuGroupBy = 1; //reset the indicator to group by Content Type
                compMenuGroupByContentType.setIsSelected(true); //display check mark icon on the menu //display a check mark icon when the menu is selected.

            }
            else {//it is group by Content Type, then unselect
                component.m_menuGroupBy = 0; //reset the indicator to group by Date
                compMenuGroupByContentType.setIsSelected(false); //remove check mark icon on the menu
            }
                component.displayGroupByContentType();
        });
        compMenu.addMenuItem(compMenuGroupByContentType);
        this.compMenuReference[compMenuGroupByContentType.getId()] = compMenuGroupByContentType;

        //setting the component menu item: Show Related Documents
        var compMenuShowRelatedDoc = new MenuSelection("compMenuShowRelatedDoc" + compId);
        compMenuShowRelatedDoc.setLabel(mediagalI18n.SHOW_RELATED_DOCUMENTS);
        compMenuShowRelatedDoc.setIsDisabled(false); //enable menu
        compMenuShowRelatedDoc.setIsSelected(false); //set unselected by default
        compMenuShowRelatedDoc.setClickFunction(function(){
            if (component.getMenuShowRelatedDocsInd() === 0) {
                component.setMenuShowRelatedDocsInd(1); //reset the indicator
                compMenuShowRelatedDoc.setIsSelected(true); //display check mark icon on the menu
                component.getRelatedDocs(); //display show related docs icon on the image
            }
            else {
                component.setMenuShowRelatedDocsInd(0); //reset the indicator
                compMenuShowRelatedDoc.setIsSelected(false); //remove check mark icon from the menu
                component.removeShowRelatedDocsIcon(); //remove Related Docs icon from the image
            }
        });
        compMenu.addMenuItem(compMenuShowRelatedDoc);
        this.compMenuReference[compMenuShowRelatedDoc.getId()] = compMenuShowRelatedDoc;
    }
};
/**
 * This is the MediaGalleryO2Component implementation of the retrieveComponentData function.
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.retrieveComponentData=function(){
    var criterion=this.getCriterion();
    var sendAr=null;
    this.setPersonId(criterion.person_id);
    var searchScope = this.getScope();
    var lookBackUnits = this.getLookbackUnits();
    var lookBackUnitType = this.getLookbackUnitTypeFlag();

    var sUrlParam = "";
    if (searchScope === 1){
        sUrlParam = 'media?personId=' + criterion.person_id;
    }
    else{
        sUrlParam = 'media?encounterId=' + criterion.encntr_id;
    }
    if (lookBackUnits > 0){
        var searchDate = new Date();    //set to current date/time
        switch (lookBackUnitType)
        {
        case 1: //hours
            searchDate.setHours(searchDate.getHours() - lookBackUnits);
            break;
        case 2: //days
            searchDate.setDate(searchDate.getDate() - lookBackUnits);
            break;
        case 3: //weeks
            searchDate.setDate(searchDate.getDate() - lookBackUnits*7);
            break;
        case 4: //months
            searchDate.setMonth(searchDate.getMonth() - lookBackUnits);
            break;
        case 5: //years
            searchDate.setFullYear(searchDate.getFullYear() - lookBackUnits);
            break;
        }
        var sUrlDateParam = '&beginDate='+ Math.round(searchDate.getTime()/1000);   //service takes in seconds not milliseconds
        sUrlParam = sUrlParam + sUrlDateParam;
    }

    this.setURLParams(sUrlParam);
    sendAr=["^MINE^", criterion.person_id+".0", MP_Util.CreateParamArray(this.getContentTypes(), 1)];
    MP_Core.XMLCclRequestWrapper(this, "MP_MEDIA_GALLERY", sendAr, true);
};

/**
 * Mark the media as selected when it is not selected and mark it unselected if it is already selected.
 * @param {number} compId Component id.
 * @return {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.doSelect=function(compId) {
    var tmp=this;
    var component = MP_Util.GetCompObjById(compId);

    if (tmp.getAttribute("class") === "mmf2-imgContain mmf2-selected") { //user clicks to un-select an image
        tmp.setAttribute("class", "mmf2-imgContain");
        var itemSelectedCnt = component.$rootNode.find( ".mmf2-imgContain.mmf2-selected" ).length;
        if (itemSelectedCnt === 0 ) {//if none of images are selected, then set buttons disabled
            MediaGalleryO2Component.prototype.disableActions.apply(this, [compId]);//set buttons disabled
        }
        else {//check the rest of selected images, if all's maintainPriv = false, then set the Inactivate and Rename buttons disabled.
            var inactivateBtn = _g("mgInactivateBtn" + compId);
            var renameBtn = _g("mgRenameBtn" + compId);
            //if the button is currently enabled, disable it if the rest of selected items have maintainPriv = false
            if ((inactivateBtn && inactivateBtn.disabled === false) || (renameBtn && renameBtn.disabled === false))  {
                var imageListing = component.getPatientImages();
                var disableInd = true;
                $( ".mmf2-imgContain.mmf2-selected" ).find(".mmf2-thumb").each(function(imgIndex, imgNode){
                    var selectedItemId = "{" + $(imgNode).attr('id') + "}"; //add the {} since it was removed when setting id;
                    var mediaArray =$.grep(imageListing, function(mediaObj) {
                          return mediaObj.imageId === selectedItemId; //the id of media matched the id of selected media
                    });
                    if (mediaArray.length > 0) //it should be 1 only, but to be safe using > 0
                    {
                        if (mediaArray[0].maintainPriv === "true") { //if 1 image has maintainPriv = true, no need to reset the button, exit loop
                            disableInd = false;
                        return false; //exit each loop
                        }
                    }
                });
                if (disableInd) { //if none of selected items has maintainPriv = true
                    if (inactivateBtn) {
                        inactivateBtn.disabled = true; //disable Inactivate button
                    }
                    if (renameBtn) {
                        renameBtn.disabled = true; //disable rename button
                    }
                }
            }
        }
    } else { //user clicks to select an image
        tmp.setAttribute("class", "mmf2-imgContain mmf2-selected");
        var imageId = $(this).find(".mmf2-thumb").attr("id");
        MediaGalleryO2Component.prototype.enableActions.apply(this, [imageId, compId]);//set buttons enabled
    }
};

/**
 * Launch Media Viewer window as a Modal dialog for a given patient with the URL Media viewer
 * @param {Number} compId : The unique id for the component
 * @param {String} viewerURL : The URL Media Viewer with a given person id. (i.e. 'http://tbird2/mediaviewer/mom?hideDemographicsBar=true&patientId=1234')
 * @param {String} subTimerName: the category_mean of the MPages that will be used for logging as the sub timer name.
 * @param {String} imageId  OPTIONAL: the image identifier. This is the case where user clicked on the image name hyperlink or date group link. It will be blank if viewing by View Selection button.
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.launchMediaViewer=function(compId, viewerURL, subTimerName, imageId) {
    var component = MP_Util.GetCompObjById(compId);
    var mmfI18n = i18n.discernabu.mediaGallery_o2;
    var viewMediaAuthenticated = false;

    var slaTimer = MP_Util.CreateTimer("CAP:MPG_Media_Gallery_o2_Launch_Media_Viewer");
    if (slaTimer) {
        slaTimer.SubtimerName = subTimerName;
        slaTimer.Stop();
    }
    if (typeof(imageId) !== "undefined") {//this is viewing by Image name hyperlink or Date group link
        viewerURL = viewerURL + imageId;
    }
    else {//this is viewing by clicking View Selection button to view more than 1 images
        component.$rootNode.find( ".mmf2-imgContain.mmf2-selected" ).find(".mmf2-thumb").each(function(i, obj){
            viewerURL = viewerURL + '&identifier=' + "{" + obj.getAttribute('id') + "}";  //add the {} since it was removed setting id
        });
    }

    MP_Util.LogInfo("mediagallery-o2.js: launchMediaViewer: viewerURL: " + viewerURL);
    //Make an XMLHttpRequest call with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call before passing into the Modal dialog.
    try
    {
        g_MediaGadgetO2XMLHttpRequestObj.open("GET", viewerURL, false);
        if (CERN_Platform.inMillenniumContext()) {
            window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetO2XMLHttpRequestObj)";
        }
        g_MediaGadgetO2XMLHttpRequestObj.withCredentials = true;
        g_MediaGadgetO2XMLHttpRequestObj.send();

        if (g_MediaGadgetO2XMLHttpRequestObj.status === 200) {
            viewMediaAuthenticated = true;
        }
        else{
            MP_Util.LogInfo("mediagallery-o2.js: launchMediaViewer: Failed to get Media Viewer Authenticated:" + g_MediaGadgetO2XMLHttpRequestObj.status);
        }
    }
    catch(err)
    {
        // on error or on unsuccessful log error
        MP_Util.LogJSError(this, err, "mediagallery-o2.js", "launchMediaViewer");
        throw(err);
    }

    //if it is authenticated, then generate the Modal dialog with the URL has been passing authenticated.
    if (viewMediaAuthenticated === true) {
        var modalId = "MediaGalleryO2Component";
        var mDialog = new ModalDialog(modalId);
        mDialog.setHeaderCloseFunction(function(){
           MP_ModalDialog.closeModalDialog(modalId);
           MP_ModalDialog.deleteModalDialogObject(modalId);
        });
        mDialog.setBodyDataFunction(function(modalObj){
            modalObj.setBodyHTML('<iframe class="mmf2-media-viewer-modal-dialog" src="'+ viewerURL +'" ></iframe>');
        });
        mDialog.setHeaderTitle(mmfI18n.MEDIA_VIEWER);

        MP_ModalDialog.addModalDialogObject(mDialog);
        MP_ModalDialog.showModalDialog(modalId);
    }
};

/**
 * Clear selection for the selected Medias and disable the buttons.
 * @param {number} compId: Component id.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.clearMediaSelection=function(compId) {
    var component = MP_Util.GetCompObjById(compId);
   //For each selected media, make it unselected.
    component.$rootNode.find(".mmf2-imgContain.mmf2-selected").removeClass("mmf2-selected");

    //set the buttons (View Selection and Clear Selection) to be disabled.
    MediaGalleryO2Component.prototype.disableActions.apply(this, [compId]);
};
/**
 * findImages
 * This function will find medias from the json medias. If it is group by Date, then filter out the Group object (since this can contain the folder group that is not medias).
 * If it is group by Content Type, then take all images and Group under content type as well.
 * Once a media is found, it put into an image record and collected into an array of image records (patientImages)
 * @return {ARRAY} patientImages An array of image records.
 */
MediaGalleryO2Component.prototype.findImages=function() {
    var patientImages = [];
    var imageObject = null;
    var tempMedia = this.getMediaStash();
    var imageIdList = []; //store the list of image ids
    var contentTypes = this.getContentTypesJSON();
    var maintainPriv = "false";

    if (tempMedia) {
        try{
            for(var i = 0; i<tempMedia.length; i++){
                var obj = tempMedia[i];
                if (typeof obj.name === "undefined"){
                    obj.name = ""; //this is needed for sorting name
                }
                if (typeof obj.contentTypeDisplay === "undefined"){
                    obj.contentTypeDisplay = ""; //this is needed for sorting name
                }

                //get maintainPrivilege for media by checking its contentType.maintainPrivilege
                var contentTypeObj=$.grep(contentTypes, function(ctObj) {
                    return ctObj.key === obj.contentTypeKey; //the key of content types matched the content type key of media
                });

                if (contentTypeObj.length > 0) //it should be 1 only, but to be safe using > 0
                {
                    maintainPriv = contentTypeObj[0].maintainPrivilege;
                }

                if (this.m_menuGroupBy === 0) { //group by Date
                    //filter out the group folder
                    //if media has "groupIdentifier", it could be the group (folder) or media(children under the folder)
                    //so take only the media (children of folder) where obj.groupIdentifier != obj.identifier
                    //media not under group, there is no groupIdentifier
                    if ((obj.groupIdentifier && obj.groupIdentifier !== obj.identifier) || (obj.groupIdentifier === undefined))
                    {
                        imageObject = this.imageRecord(obj.identifier, obj.name, obj.serviceDate, obj.contentTypeDisplay, this.getBaseURL() + "thumbnail/" + obj.identifier + "?size=5&generic=1", obj.mimeType, obj.groupIdentifier, maintainPriv, obj.version, obj.size, obj.contentTypeKey);
                        patientImages.push(imageObject);
                        imageIdList.push('"' + obj.identifier + '"');
                    }
                }
                else {//group by Content Type
                    imageObject = this.imageRecord(obj.identifier, obj.name, obj.serviceDate, obj.contentTypeDisplay, this.getBaseURL() + "thumbnail/" + obj.identifier + "?size=5&generic=1", obj.mimeType, obj.groupIdentifier, maintainPriv, obj.version, obj.size, obj.contentTypeKey);
                    patientImages.push(imageObject);
                    imageIdList.push('"' + obj.identifier + '"');
                }
            }
        }
        catch(err)
        {
            throw(err);
        }
    }
    this.m_viewableImageIds = imageIdList;
    return patientImages;
};

/**
 * This function will generate HTML string for navigation panels content.
 * @param {object} imageGrpArr: an array of image groups with subgroups.
 * @return {object} a HTML string for navigation panel content.
 */
MediaGalleryO2Component.prototype.generateNavPaneContent=function(imageGrpArr){
    this.$rootNode.find( ".mmf2-nav-content" ).empty();
    var imageGrpArrLen = imageGrpArr.length;
    var compId = this.getComponentId();
    var navPaneContentHtml = "";
    var grpByStr = this.mmf2I18n.GROUP_BY + " : ";
    if(this.m_menuGroupBy === 1){
        grpByStr+= this.mmf2I18n.CONTENT_TYPE;
    }
    else{
        grpByStr+= this.mmf2I18n.DATE;
    }
    navPaneContentHtml+='<div class = "mmf2-nav-header"><div class="mmf2-nav-header-title">'+ grpByStr +'</div><div id="mmf2NavPanePin'+compId+'"class="mmf2-nav-pin"></div></div><div class= "mmf2-nav-row-content">';
    for(var i = 0; i < imageGrpArrLen; i++){
        var groupArr = [];
        if(this.m_menuGroupBy === 1){
            groupArr = imageGrpArr[i];
            var contentType = groupArr[0].contentType;
            var groupCnt = 0;
            for (var j = 0; j< groupArr.length; j++){
                if(groupArr[j].groupId === undefined){
                    groupCnt++;
                }
                else{
                    if(groupArr[j].hasOwnProperty("subImage")){
                        groupCnt = groupCnt + groupArr[j].subImage.length;
                    }
                }
            }
            navPaneContentHtml+='<div class="mmf2-nav-row"><div class="mmf2-nav-row-title" title="'+contentType+'">'+ contentType +'</div><div class="mmf2-nav-row-cnt">('+ groupCnt  +')</div></div>';
        }
        else{
            groupArr = imageGrpArr[i];
            var imageDateObj = new Date(groupArr[0].serviceDate*1000);
            var options = {weekday: "short", year: "numeric", month: "short", day: "numeric"};  //this works on chrome and Internet Explorer v11 but nothing else
            var imageDate=imageDateObj.toLocaleDateString(options);
            navPaneContentHtml+='<div class="mmf2-nav-row"><div class="mmf2-nav-row-title" title="'+imageDate+'">'+ imageDate +'</div><div class="mmf2-nav-row-cnt">('+ groupArr.length  +')</div></div>';
        }
    }
    navPaneContentHtml+="</div>";
    return navPaneContentHtml;
};

/**
 * This function will sort the the array of patient images and Sort it according to the Group By (Date/Content Type) then
 * split the images into an array for displaying together
 * @param {object} displayImages An array of patient images.
 * @returns {UNDEFINED} Nothing
*/
MediaGalleryO2Component.prototype.imageGroup=function(displayImages) {
    var component = this;
    var sImageGrpListHTML = [];
    var ordArray = [];

    /**
    * This function will sort image records in to order from oldest to newest.
    * @param {object} a image record a.
    * @param {object} b image record b.
  * @return {UNDEFINED} Nothing
    */
    function imageDateSorter(a, b){
        var aDate = a.serviceDate;
        var bDate = b.serviceDate;
        if (aDate > bDate) {
            return 1;
        }
        else if (aDate < bDate) {
            return -1;
        }
        else {
            return 0;
        }
    }

    /**
    * This function will sort image records in alphabetical order based on content type display.
    * @param {object} a image record a.
    * @param {object} b image record b.
  * @returns {UNDEFINED} Nothing
    */
    function imageContentTypeSorter(a, b){
        var aContentTypeDisplay = a.contentType.toUpperCase();
        var bContentTypeDisplay = b.contentType.toUpperCase();
        if (aContentTypeDisplay > bContentTypeDisplay) {
            return 1;
        }
        else if (aContentTypeDisplay < bContentTypeDisplay) {
            return -1;
        }
        else {
            return 0;
        }
    }

    /**
    * This function will sort image records in alphabetical order based on the name(description) of the image/group.
    * @param {object} a image record a.
    * @param {object} b image record b.
  * @returns {UNDEFINED} Nothing
    */
    function imageDescriptionSorter(a, b){
        var aName = a.description.toUpperCase();
        var bName = b.description.toUpperCase();
        if (aName > bName) {
            return 1;
        }
        else if (aName < bName) {
            return -1;
        }
        else {
            return 0;
        }
    }

    /**
    * This function will sort image records in alphabetical order based on the image's groupIdentifier.
    * @param {object} a image record a.
    * @param {object} b image record b.
  * @returns {UNDEFINED} Nothing
    */
    function imageGroupIdSorter(a, b){
        var aGroupIdentifier = a.groupId;
        var bGroupIdentifier = b.groupId;
        if (aGroupIdentifier > bGroupIdentifier) {
            return 1;
        }
        else if (aGroupIdentifier < bGroupIdentifier) {
            return -1;
        }
        else {
            return 0;
        }
    }

    /**
    * This function will generate HTML string to display an image under a header section.
    * @param {object} tempImage an image record that will be displayed.
    * @return {object} an array of HTML string for image.
    */
    function generateHTMLdisplayImage(tempImage){
        var ImageId = tempImage.imageId;
        var imageIdStr = ImageId.substring(1, ImageId.length - 1); //take out the {} from the string
        var sImageListHTML = [];
        var serviceDateObj = new Date(tempImage.serviceDate*1000);
        var sServiceDate = serviceDateObj.toLocaleDateString();
        var sServiceTime = serviceDateObj.toLocaleTimeString();

        //Display Media with the name as a hyperlink and hover details
        sImageListHTML.push("<div class='mmf2-image' image-name = \"", tempImage.description, "\">");
        sImageListHTML.push("<div class='mmf2-imgContain'>");

        sImageListHTML.push("<dl class =\"mmfgal-o2-info result-info\">");
        sImageListHTML.push("<img class='mmf2-thumb' id=", imageIdStr, " alt= '", tempImage.description, "' src= '", tempImage.imageURL, "'/>");
        sImageListHTML.push("<div class='mmf2-iconHolder'></div>");// add an image holder for the Show Related Documents icon
        sImageListHTML.push("</dl>");

        //below line would not be displayed on front end
        sImageListHTML.push("<h4 class='det-hd'>media detail hover</h4>");
        sImageListHTML.push("<div class=\"hvr\">");
        sImageListHTML.push("<dl class=\"mmf2-det\"><dt><span class='mmf2-hvr-name'>", component.mmf2I18n.NAME, ":</span></dt><dd><span class='mmf2-hvr-name'>", tempImage.description, "</span></dd><dt><span>", component.mmf2I18n.CONTENT_TYPE, ":</span></dt><dd><span>", tempImage.contentType, "</span></dd><dt><span class='mmf2-hvr-image-container'><img class='mmf2-hvr-image' alt= '", tempImage.description, "' src= '", tempImage.imageURL, "'/></span></dt><dt><span>", component.mmf2I18n.SERVICE_DATE_TIME, ":</span></dt><dd><span>", sServiceDate, "&nbsp;", sServiceTime, "</span></dd><dt><span>", component.mmf2I18n.MEDIA_TYPE, ":</span></dt><dd><span>", tempImage.mimeType, "</span></dd><dt><span>", component.mmf2I18n.VERSION, ":</span></dt><dd><span>", tempImage.versionNumber, "</span></dd></dl>");
        sImageListHTML.push("</div>");
        sImageListHTML.push("</div>");

        //display media name as a hyperlink under the media image.
        if (tempImage.description) {//if name is available, display name
            sImageListHTML.push("<div class='mmf2-media-name' ><span class='mmf2-imageLaunchViewer' name='&identifier=", tempImage.imageId, "' title=\"", tempImage.description, "\" >", tempImage.description, "</span></div>"); //display media name
        }
        else {//if no name, display [View]
            sImageListHTML.push("<div class='mmf2-media-name'><span class='mmf2-imageLaunchViewer' name='&identifier=", tempImage.imageId, "' >[", component.mmf2I18n.VIEW, "]</span></div>"); //display [View]
        }
        sImageListHTML.push("</div>");
        return sImageListHTML;
    } //end generateHTMLdisplayImage

    /**
    * This function will take in an array of images for the same date generate header with date and number of images
    * and display images in group.
    * @param {object} imagesGroup an array of image records that has the same date.
  * @returns {UNDEFINED} Nothing
    */
    function displayDateGroup(imagesGroup){
        var i=0;
        var imageDateObj = new Date(imagesGroup[i].serviceDate*1000);
        var sHyperLinkGroupId = "";
        var sSectionHeaderHTML = [];
        var sImageListHTML = [];
        var options = {weekday: "short", year: "numeric", month: "short", day: "numeric"};  //this works on chrome and Internet Explorer v11 but nothing else
        var imageDate=imageDateObj.toLocaleDateString(options);

        for (i=0; i<imagesGroup.length; i++) {
            var tempImage = imagesGroup[i];
            sHyperLinkGroupId = sHyperLinkGroupId + "&identifier=" + tempImage.imageId;
            var sImageHTML = generateHTMLdisplayImage(tempImage); //replaced with function to get HTML string for an image record.
            sImageListHTML.push(sImageHTML.join(""));
        }
        sSectionHeaderHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", "Collapse", "'>-</span><span class='mmf2-dateLinkLaunchViewer' name='", sHyperLinkGroupId, "'><span class='sub-sec-title'><span class = 'mmf2-grp-hdr'>", imageDate, "</span> (<span class = 'mmf2-grp-cnt'>", imagesGroup.length, "</span>)", "</span></span></h3>", "<div class='sub-sec-content'>");
        ordArray.push(sSectionHeaderHTML.join(""));
        ordArray.push(sImageListHTML.join(""));
        ordArray.push("</div></div>");
    }

    /**
    * This function will take in an array of images for the same group (group under a content type)
    * and generate HTML string that will be displayed under the group section.
    * @param {object} imagesGroup an array of image records that has the same group under 1 content type.
    * @returns {Object} an array of string HTML to display images and a string of image id for the group link.
    */
    function displaySubGroup(imagesGroup){
        var i=0;
        var sHyperLinkGroupId = "&identifier=" + imagesGroup[0].groupId; //take the first item since the whole group will have the same groupId
        var sImageListHTML = [];

        for (i=0; i<imagesGroup.length; i++) {
            var tempImage = imagesGroup[i];
            var arrayHTML = generateHTMLdisplayImage(tempImage); //get HTML string for an image record
                sImageListHTML.push(arrayHTML.join(""));
        } //end for loop

        var arrayHTMLandLink = [];
        arrayHTMLandLink.push(sImageListHTML, sHyperLinkGroupId);
        return arrayHTMLandLink;
    } //displaySubGroup

    /**
    * This function will take an array of images with the same content type then display images in the content type group.
    * It will check if there is groups (under content types), and display images that are under each group accordingly.
    * @param {object} imagesGroup an array of image records that have the same 1 content type and all the groups belong this content type.
    *                   (since they both on the same tree level). The groups have subimages as an array of the groups that contain image records that
    *                   has the same group under this content type.
    * @return {UNDEFINED} Nothing
  */
    function displayContentTypeGroup(imagesGroup){
        var i=0;
        var imageDateObj = new Date(imagesGroup[i].serviceDate*1000);
        var sHyperLinkGroupId = "";
        var sSectionHeaderHTML = [];
        var sImageListHTML = [];
        var imgCnt = 0;
        var sContentTypeDisplay = imagesGroup[0].contentType;

        //loop thru imagesGroup to display the images(not under the group) and the groups under the Content Type header section.
        for (i=0; i<imagesGroup.length; i++) {
            var tempImage = imagesGroup[i];
            //if it is image, display under Content Type folder
            if (tempImage.groupId === undefined) //image (not under group) and not group
            {
                sHyperLinkGroupId = sHyperLinkGroupId + "&identifier=" + tempImage.imageId;
                var arrayHTMLandLink = generateHTMLdisplayImage(tempImage); //replaced with function
                sImageListHTML.push(arrayHTMLandLink.join(""));
                imgCnt = imgCnt + 1;
            }
            else //it is a group/folder.
            {
                var groupId = tempImage.groupId;
                var groupIdStr = groupId.substring(1, groupId.length - 1); //take out the {} from the string
                var sGroupHeaderHTML = [];
                var subGroupLen = 0;
                var arrayHTMLandLink = [];
                var sSubGroupHyperLinkId = "";
                var serviceDateObj = new Date(tempImage.serviceDate*1000);
                var sServiceDate = serviceDateObj.toLocaleDateString();
                var sServiceTime = serviceDateObj.toLocaleTimeString();
                var imgInSubGroup = []; //store image records that has the same group
                if(tempImage.hasOwnProperty("subImage")){
                    imgInSubGroup = tempImage.subImage;
                    subGroupLen = imgInSubGroup.length;
                    arrayHTMLandLink = displaySubGroup(imgInSubGroup);
                    imgCnt = imgCnt + subGroupLen;
                }

                //if there is images under this group, get the HTML string to display images and the hyper link id for the whole group.
                if (arrayHTMLandLink.length > 0) {
                    sSubGroupHyperLinkId = arrayHTMLandLink[1]; //hyperlink for the subgroup
                    sHyperLinkGroupId = sHyperLinkGroupId + sSubGroupHyperLinkId; //hyperlink for the Content type
                }

                //generate HTML for group header section
                sGroupHeaderHTML.push("<div class='sub-sec  mmf2-group'>");
                sGroupHeaderHTML.push("<dl class ='mmfgal-o2-info result-info'>");
                sGroupHeaderHTML.push("<h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", "Collapse", "'>-</span><span class='mmf2-dateLinkLaunchViewer' name='", sSubGroupHyperLinkId, "'><span class='sub-sec-title'><span class = 'mmf2-grp-hdr'>", tempImage.description, "</span> (<span class = 'mmf2-grp-cnt'>", subGroupLen, "</span>)", "</span></span></h3>");
                sGroupHeaderHTML.push("</dl>");

                //generate HTML for group hover (NOTE: h4 element will not be visible to the end user, it is utilizing standard classes for semantic headings.)
                sGroupHeaderHTML.push("<h4 class='det-hd'>group detail hover</h4>");
                sGroupHeaderHTML.push("<div class=\"hvr\">");
                sGroupHeaderHTML.push("<dl class=\"mmf2-det\"><dt><span>", component.mmf2I18n.CONTENT_TYPE, ":</span></dt><dd><span>", tempImage.contentType, "</span></dd><dt><span>", component.mmf2I18n.NAME, ":</span></dt><dd><span>", tempImage.description, "</span></dd><dt><span>", component.mmf2I18n.SERVICE_DATE_TIME, ":</span></dt><dd><span>", sServiceDate, "&nbsp;", sServiceTime, "</span></dd></dl>");
                sGroupHeaderHTML.push("</div>");
                sGroupHeaderHTML.push("<div class='sub-sec-content' id ='", groupIdStr, "'>");

                sImageListHTML.push(sGroupHeaderHTML.join("")); //display a group header

                if (arrayHTMLandLink.length > 0 ) { //if there is images under that group
                    sImageListHTML.push(arrayHTMLandLink[0].join("")); //display images under the group
                }
                sImageListHTML.push("</div></div>");
            }

        }//end for i loop

        //generate HTML for Content Type header section
        sSectionHeaderHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", "Collapse", "'>-</span><span class='mmf2-dateLinkLaunchViewer' name='", sHyperLinkGroupId, "'><span class='sub-sec-title'><span class = 'mmf2-grp-hdr'>", sContentTypeDisplay, "</span> (<span class = 'mmf2-grp-cnt'>", imgCnt, "</span>)", "</span></span></h3>", "<div class='sub-sec-content'>");
        ordArray.push(sSectionHeaderHTML.join("")); //display content type header section
        ordArray.push(sImageListHTML.join("")); //display all images under content type, group header and images under the group header section.
        ordArray.push("</div></div>");
    } //displayContentTypeGroup

    /**
    * Take the array of SORTED patient images in content type alphabetical order and
    * split the images for each content type into an array. From each each content type group, break it down into 2 seperate arrays:
    *   - contentTypleList: contains images and groups(they are on same tree level), sort it by content type and display together.
    *   - groupList: contains images under all the groups for each content types, sort it by image name and display each group together.
    * @param {object} displayImages An array of patient images that were sorted in alphabetical order by Content type.
    * @returns {UNDEFINED} Nothing
  */
    function groupByContentType(displayImages){
        var i = 0;
        var imgGrouping = [];
        var imgContentTypeDisplay = "";
        var arryImgSubGrouping = [];
        var contentTypeArray = [];
        var grpByContentTypeArray = [];
        var contentTypeGroup = [];
        component.m_arrayofGrps = [];

        //loop thru all image records (images ang group), split the images for each content type into an array, then display each content type group.
        while (i < displayImages.length)
        {
            imgContentTypeDisplay =  displayImages[i].contentType;
            for (i=i; i<displayImages.length; i++) {
                var tempImage = displayImages[i];
                var sCompContentTypeDisplay = tempImage.contentType;
                //find image that has same content type.
                if (imgContentTypeDisplay !== sCompContentTypeDisplay){
                    break; //exit for loop
                }
                imgGrouping.push(tempImage); //put image with the same content type into a content type group.
            }

            var contentTypleList = []; //store images (that not under the group) and the group objects.
            var imgObj = null;
            var groupList = []; //to store only images that are under the group/folder

            //separate the group and image not under group into 1 array (contentTypleList)
            //images under groups into another array (groupList)
            for (var idx=0; idx<imgGrouping.length; idx++)
            {
                imgObj = imgGrouping[idx];
                if ((imgObj.groupId && imgObj.groupId  === imgObj.imageId) // group that has images
                    ||(imgObj.groupId === undefined)) //image NOT under group
                {
                    contentTypleList.push(imgObj);
                }
                else //get images UNDER a group and store into the groupList
                {
                    groupList.push(imgObj);
                }
            }
            //sort the contentType List alphabetical order
            contentTypleList.sort(imageDescriptionSorter);
            //check if groups exist, then sort the groupList by groupId, then separate them into the same group (subgroup/folder)
            if (groupList.length > 1)
            {   //get the images in the groups. First, sort the list, then break it down into the same groups.
                groupList.sort(imageGroupIdSorter); //sort by Group Identifier
                arryImgSubGrouping = groupBySubGroup(groupList); //break it down into the same subgroups (groups under 1 content type)
            }
            else if (groupList.length === 1) //only 1 item  in subgroups, no need to sort or break down, just store it into the array
            {
                arryImgSubGrouping.push(groupList);
            }
            contentTypeArray = [];
            for (var j = 0; j<contentTypleList.length; j++ ){
                var groupId = contentTypleList[j].groupId;
                if(groupId === undefined){
                    contentTypeArray.push(contentTypleList[j]);
                }
                else{
                    var groupHeader = {};
                    groupHeader = contentTypleList[j];
                    for (var y = 0; y < arryImgSubGrouping.length; y++){
                        var imgInSubGroup = []; //store image records that has the same group
                        imgInSubGroup = arryImgSubGrouping[y];
                            if (groupId === imgInSubGroup[0].groupId) //only need to compare the first item of the array, since images in same group has same groupId
                            {
                                groupHeader.subImage = imgInSubGroup;
                                break;//only 1 can be found, exit for loop
                            }
                    }
                    contentTypeArray.push(groupHeader);
                }
            }
            component.m_arrayofGrps.push(contentTypeArray);
            displayContentTypeGroup(contentTypeArray); //display all images and group images with same content type into 1 section
            imgGrouping.length=0;
        } //end while
    } //end groupByContentType

  /**
    * Take the array of SORTED (by group id) group images and
    * split the images for each group into an array, then sort images in each group by alphabetical order of name.
    * And store it into another array and return.
    * @param {object} groupList An array of images that are under the group and were sorted by group identifier.
    * @returns {object} an array of array images that have the same group and sorted by alphabetical order of name/description
    */
    function groupBySubGroup (groupList){
        var i = 0;
        var arryImgSubGrouping = []; //store all groups of images.
        var groupListLen = groupList.length;

        if (groupListLen > 1)
        {
            //loop thru the list and find images that have same group and store into an array (imgSubGrouping)
            while (i < groupListLen)
            {
               var imgSubGrouping = []; //store all image that has the same group (groupId)
                var groupId =  groupList[i].groupId;
                for (i=i; i<groupListLen; i++) {
                    var tempImage = groupList[i];
                    if (groupId !== tempImage.groupId) {
                        break; //break for loop
                    }
                    imgSubGrouping.push(tempImage); //put image with the same group into a group.
                }
                //sort name/description before displaying.
                if (imgSubGrouping.length > 1) { //if 2 or more items, then sort alphabetical order by description(name)
                    imgSubGrouping.sort(imageDescriptionSorter);
                }
                arryImgSubGrouping.push(imgSubGrouping); //put the group images into an array that will be displayed later
            }
        }
        return arryImgSubGrouping;
    }

    //Main logic for imageGroup function
    //start grouping images based on the groupby indicator
    if (component.m_menuGroupBy === 0) { //group by Date
        displayImages.sort(imageDateSorter); //sort images by Date before displaying
        var i = displayImages.length - 1;
        var imageDateObj=null;
        var imageDate="";
        var imgGrouping=[];
        component.m_arrayofGrps = [];

        while (i > -1) //display images from newest to oldest
        {
            imageDateObj = new Date(displayImages[i].serviceDate*1000);
            imageDate=imageDateObj.toLocaleDateString();

            for (i = i; i >= 0; i-- ) {
                var tempImage = displayImages[i];
                var compDate = new Date(tempImage.serviceDate*1000);
                var sCompDate = compDate.toLocaleDateString();

                if (imageDate !== sCompDate){
                    break;
                }
                imgGrouping.push(tempImage); //put image with the same date into a date group.
            }
            displayDateGroup(imgGrouping); //display all images with same date into 1 section
            component.m_arrayofGrps.push(imgGrouping);
            imgGrouping = [];
        }
    }
    else //group by Content Type
    {
        displayImages.sort(imageContentTypeSorter); //sort by content type display before displaying
        groupByContentType(displayImages);
    }

    return ordArray;
}; //end imageGroup function

/**
 * Enable buttons
 * @param {string} imageId image/media id.
 * @param {number} compId Component id.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.enableActions=function(imageId, compId) {
    _g("mgViewBtn" + compId).disabled = false;
    _g("mgClearBtn" + compId).disabled = false;
    //check maintainPriv to determine if the inactivate and rename buttons can be enabled.
    var inactivateBtn = _g("mgInactivateBtn" + compId);
    var renameBtn = _g("mgRenameBtn" + compId);
    if ((inactivateBtn && inactivateBtn.disabled === true) || (renameBtn && renameBtn.disabled === true)) {
        //if the button is currently disabled, then set Inactivate button enabled only if the selected image has maintainPriv = true.
        var component = MP_Util.GetCompObjById(compId);
        var imageListing = component.getPatientImages();
        var mediaId = "{" + imageId + "}";  //add the {} since it was removed when setting id
        var mediaArray =$.grep(imageListing, function(mediaObj) {
              return mediaObj.imageId === mediaId; //found the media id from the patient image list matched the id of selected media
        });
        if (mediaArray.length > 0) //it should be 1 only, but to be safe using > 0
        {
            if (mediaArray[0].maintainPriv === "true") {
                if (inactivateBtn){
                    inactivateBtn.disabled = false;
                }
                if (renameBtn){
                    renameBtn.disabled = false; //enable rename button if the selected item has maintainPriv = true
                }
            }
        }
    }
    //else //NOTE: it currently enabled, there is no need to check
    _g("mgReviewBtn" + compId).disabled = false; //enable Review button
};

/**
 * Disable buttons
 * @param {number} compId Component id.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.disableActions = function(compId) {
    _g("mgViewBtn" + compId).disabled = true;
    _g("mgClearBtn" + compId).disabled = true;
    var inactivateBtn = _g("mgInactivateBtn" + compId);
    if (inactivateBtn) {
        inactivateBtn.disabled = true;
    }

    var renameBtn = _g("mgRenameBtn" + compId);
    if (renameBtn){
        renameBtn.disabled = true; //disable rename button
    }

    _g("mgReviewBtn" + compId).disabled = true;
};

/**
 * This function will get the json object of the BASE CAMM URL for the given Service Directory
 * by calling the CAMM REST Service URL link with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call.
 * @param {string} url the CAMM Service Directory URL (i.e. https://directory.devcareaware.com/services-directory/authorities/provide.northamerica.cerner.net/keys/urn:cerner:api:mmf-camm-mpage-app-service-1.0.json)
 * @returns {string} a string of CAMM REST service URL. (i.e. http://iptmpwas01/camm-mpage-1.0/provide.northamerica.cerner.net/service/)
 */
MediaGalleryO2Component.prototype.getCAMMURL = function (url){
    var CAMM_URL = "";

    if (CERN_Platform.inMillenniumContext()) {
        try
        {
            g_MediaGadgetO2XMLHttpRequestObj.open("GET", url, false);
            window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetO2XMLHttpRequestObj)";
            g_MediaGadgetO2XMLHttpRequestObj.send();

            if (g_MediaGadgetO2XMLHttpRequestObj.status === 200) {
                var Links =  JSON.parse(g_MediaGadgetO2XMLHttpRequestObj.responseText);
                CAMM_URL = Links.link;
                MP_Util.LogInfo("MMF Media Gallery :getCAMMURL: " + CAMM_URL );
            }
            else{
                MP_Util.LogInfo("mediagallery-o2.js: getCAMMURL: Failed to retrieve the CAMM URL from Service Directory:" + g_MediaGadgetO2XMLHttpRequestObj.status);
            }
        }
        catch(err)
        {
            // on error or on unsuccessful log error
            MP_Util.LogJSError(this, err, "mediagallery-o2.js", "getCAMMURL");
            throw(err);
        }
    }
    else { //web enabling
		//NOTE: the code is assuming the camm services reside on the same host as the provider of this code (the discern-mpages service) when running web enabled.
		//That configuration is not essential. Only the mmf-iframe-messaging code must live on the same host as the camm services.
		//An undesired additional credential challenge displays if the camm services and discern-mpages service are not on the same host, but that cannot be prevented.
        CAMM_URL = "/camm-mpage/" + this.m_fullCanonicalDomainName + "/service/";
    }

    return (CAMM_URL);
};

/**
 * This function will get the CAMM protocol and host name based on the CAMM URL.
 * (i.g. http://iptmpwas01, https://iptmpwas01 or http://10.190.111.222 )
 * @returns {String} returnCammOrigin the CAMM protocol and host name
 */
MediaGalleryO2Component.prototype.getCAMMOrigin = function (){
	var returnCammOrigin = "";
	if (CERN_Platform.inMillenniumContext()) {
		//use regEx from CAMM URL to find the match string as http:// or https:// followed by any character
		//and return the string before it found the "/" (i.g.  http://iptmpwas01, https://iptmpwas01 or http://10.190.111.222)
        var cammOrigin = this.getBaseURL().match("^http.?://[^/]*/").toString();
        returnCammOrigin = cammOrigin.length > 0 ? cammOrigin.substring(0, cammOrigin.length - 1) : "";
    }
    else {
	//NOTE: the code is assuming the camm services reside on the same host as the provider of this code (the discern-mpages service) when running web enabled.
    //That configuration is not essential. Only the mmf-iframe-messaging code must live on the same host as the camm services.
	//An undesired additional credential challenge displays if the camm services and discern-mpages service are not on the same host, but that cannot be prevented.
	  returnCammOrigin =  window.location.protocol + "//" + window.location.hostname;
    }
    logger.logMessage("this.getCAMMOrigin(): " + returnCammOrigin);
	return returnCammOrigin;
};

/**
 * This function will get the media json object for the given patient
 * by calling the CAMM REST Service URL link with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call.
 * @param {string} url the CAMM REST Service URL with patient id (i.e. http://iptmpwas01/camm-mpage-1.0/provide.northamerica.cerner.net/service/media?personId=34844160)
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.retrieveMedia = function (url){
    MP_Util.LogInfo("MMF Media Gallery O2:retrieveMedia:URL:" + url );
    if(g_MediaGadgetO2XMLHttpRequestObj){
        try{
            g_MediaGadgetO2XMLHttpRequestObj.open("GET", url, false);
            if (CERN_Platform.inMillenniumContext()) {
                window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetO2XMLHttpRequestObj)";
            }
            g_MediaGadgetO2XMLHttpRequestObj.withCredentials = true;
            g_MediaGadgetO2XMLHttpRequestObj.send();
        }
        catch(err)
        {
            MP_Util.LogJSError(this, err, "mediagallery-o2.js", "retrieveMedia");
            throw(err);
        }

        if (g_MediaGadgetO2XMLHttpRequestObj.status === 200) {
            var vartest = g_MediaGadgetO2XMLHttpRequestObj.responseText;
            try{

                this.setMediaStash(JSON.parse(vartest));
                MP_Util.LogInfo("MMF Media Gallery O2:retrieveMedia:responseText:" + vartest );
            }
            catch(err)
            {
                MP_Util.LogJSError(this, err, "mediagallery-o2.js", "retrieveMedia");
                throw(err);
            }
        }
        else { //unsuccessful status (not 200)
                var errMgs = "RetrieveMedia returned unsuccessful status: " + g_MediaGadgetO2XMLHttpRequestObj.status;
            MP_Util.LogError(errMgs);
            throw errMgs;
        }
    }
};

/**
 * getAllContentTypes
 * This function will get the list of all content types json object for the domain
 * by calling the CAMM REST Service URL link with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call.
 * @param {string} url the CAMM REST Service URL to get contentTypes (i.e. http://iptmpwas01/camm/solution.northamerica.cerner.net/service/contentTypes)
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.getAllContentTypes = function (url){
    var subTimerName = this.getCriterion().category_mean;
    var slaTimer = MP_Util.CreateTimer("ENG:MPG.MMF.GALLERY.02 _ Get Content Types");
    MP_Util.LogInfo("MMF Media Gallery O2:getAllContentTypes:URL:" + url );
    if(g_MediaGadgetO2XMLHttpRequestObj){
        try{
            if (slaTimer) {
                slaTimer.SubtimerName = subTimerName;
                slaTimer.Start();
            }
            g_MediaGadgetO2XMLHttpRequestObj.open("GET", url, false);
            if (CERN_Platform.inMillenniumContext()) {
                window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetO2XMLHttpRequestObj)";
            }
            g_MediaGadgetO2XMLHttpRequestObj.send();
        }
        catch(err)
        {
            if (slaTimer) {
                slaTimer.Abort();
            }
            MP_Util.LogJSError(this, err, "mediagallery-o2.js", "getAllContentTypes");
            throw(err);
        }
        //check if status 200 is successful
        if (g_MediaGadgetO2XMLHttpRequestObj.status === 200) {
            var responseText = JSON.parse(g_MediaGadgetO2XMLHttpRequestObj.responseText);
            if (slaTimer) {
                slaTimer.Stop();
            }
            var contentTypes = responseText.ContentType;
            try{

                this.setContentTypesJSON(contentTypes);
                MP_Util.LogInfo("MMF Media Gallery O2:getAllContentTypes:responseText:" + responseText);
            }
            catch(err)
            {
                if (slaTimer) {
                    slaTimer.Abort();
                }
                MP_Util.LogJSError(this, err, "mediagallery-o2.js", "getAllContentTypes");
                throw(err);
            }
        }
        else { //unsuccessful status (not 200)
            if (slaTimer) {
                slaTimer.Abort();
            }
            var errMgs = "getAllContentTypes returned unsuccessful status: " + g_MediaGadgetO2XMLHttpRequestObj.status;
            MP_Util.LogError(errMgs);
            throw (errMgs);
        }
    }
};
/**
 * renderComponent
 * This is the MediaGalleryO2component implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the
 * call to XMLCCLRequestWrapper.
 * @param {MP_Core.ScriptReply} recordData The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the
 * retrieveComponentData function of this object.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.renderComponent=function(recordData){
    var compId=this.getComponentId();
    var countText="";
    var imageSum=0;
    var ordArray=[];
    var SERVICE_DIR_KEY = "/keys/urn:cerner:api:mmf-camm-mpage-app-service-1.0.json";
    var catName = this.getCriterion().category_mean;
    var component = this;
    var contentTypeKeys = []; //a list of bedrock content type keys filter.
    this.$rootNode = $(component.getRootComponentNode());

    try{
        var url = recordData.SERVICE_DIRECTORY_URL + SERVICE_DIR_KEY;
        //i.e. url = "https://directory.devcareaware.com/services-directory/authorities/provide.northamerica.cerner.net/keys/urn:cerner:api:mmf-camm-mpage-app-service-1.0.json"

        this.m_fullCanonicalDomainName = recordData.FULLCANONICALDOMAINNAME; //this will be used for when this component is run from Web browser
        var CAMMURL = this.getCAMMURL(url);
        this.m_baseServiceURL = CAMMURL;
        this.setMenuShowRelatedDocsInd(0); //not display menu by default
        this.m_MediaViewerURL = recordData.URL;
        this.setContentTypeFilterList(recordData.CONTENT_TYPES);

        //get the list of content type keys from filter list
        var contentTypeFilterList = this.getContentTypeFilterList();
        var contentTypeListLen = contentTypeFilterList.length;
        
        if (contentTypeListLen > 0)
        {
            for (var idx=0; idx<contentTypeListLen; idx++)
            {
                var filterObj = contentTypeFilterList[idx];
                contentTypeKeys.push(filterObj.CONTENT_TYPE_KEY);
            }
            contentTypeKeys.toString();
        }

        if (CAMMURL)
        {
            var sParams = this.getURLParams();
            //if there is content type filter, add it into the parameter list that will be used to query media object
            if (contentTypeKeys.length > 0)
            {
                sParams = sParams +"&contentType=" + contentTypeKeys;
                this.setURLParams(sParams);//reset params
            }
            this.retrieveMedia(CAMMURL + sParams);
        }
        //get user preference
        var savedUserPrefs = this.getPreferencesObj();
        //get groupby preference
        if(savedUserPrefs !== null && savedUserPrefs.media_gallery_prefs !== null){
            this.m_menuGroupBy = savedUserPrefs.media_gallery_prefs.GROUP_BY_PREF;
            component.compMenuReference["compMenuGroupByContentType" + compId].setIsSelected(this.m_menuGroupBy === 1 ? true : false);
        }

        if (recordData.CONTENT_TYPES.length > 0) {
            this.displayFilterApplied();
        }

        //get content types to get the maintain privilege
        this.getAllContentTypes(CAMMURL + "contentTypes");

        this.displayBodyContent(); //replaced to use function call to display Body content by grouping images accordingly.
        MPageComponent.prototype.resizeComponent.call(this, null);

        //Reset Show Related Document menu checked
        component.compMenuReference["compMenuShowRelatedDoc" + compId].setIsSelected(false);

    }catch(err){
        MP_Util.LogJSError(this, err, "mediagallery-o2.js", "renderComponent");
        throw (err);
    }
};

/**
 * displayBodyContent
 * This function will display the body content for the component.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.displayBodyContent=function(){
    var compId=this.getComponentId();
    var countText="";
    var imageSum=0;
    var ordArray=[];
    var component = this;
    var imageListing = [];
    var imageListingLen = 0;
    var zoomBarHTML = "";
    var small = "32";
    var medium = "116";
    var large = "200";
    var checkInputRangeBrowserSupport = $('<input type=range>');


    //Condition to display the slider depending on browser support. If browser doesn't support slider doesn't display.
    if(checkInputRangeBrowserSupport[0].type === 'range'){
        zoomBarHTML = '<div class = "mmf2-zoom-section">' +
                            '<div class = "mmf2-size-label">'+component.mmf2I18n.SIZE+':</div>' +
                            '<div id = "mmf2ZoomContainer'+ compId + '" class = "mmf2-zoom-container">' +
                                '<input type="range" min=32 max=200 value="' + this.m_thumbNailSize + '"id="mmf2ZoomBar'+ compId +'" class ="mmf2-zoom-bar"  list="mmf2SizeSettings'+compId+'"/>' +
                                    '<datalist id="mmf2SizeSettings'+ compId +'">' +
                                        '<option>'+ small + '</option><option>' + medium + '</option><option>' + large + '</option>' +
                                    '</datalist>' +
                            '</div>' +
                        '</div>';
     }

    if (this.getMediaStash()!== null){//logically it needs to check null here, but it won't occur at this point since it has been checked and thrown error above logic if it is failed.
        imageListing = this.findImages();
        //count number of media objects
        imageListingLen = imageListing.length; //imageListing can contain images and group if group by content type
        this.setPatientImages(imageListing);
    }
    //Make the component content into a main div so that it can be toggled with review pane.
    ordArray.push("<div id='mmf2contentMainDiv", compId, "'>");
    //Display View Selection, Clean Selection, Inactivate, Rename and Review buttons
    ordArray.push("<div class='mmf2-viewselection-row' id='mgbuttonViewRow", compId, "'><div class= 'mmf2-btn-section'>");
    ordArray.push("<button class='mmf2-header-btn' id='mgViewBtn", compId, "' disabled='true' title='", component.mmf2I18n.VIEW_SELECTION, "'>", component.mmf2I18n.VIEW_SELECTION, "</button>"); //button View Selection
    ordArray.push("<button class='mmf2-header-btn' id='mgClearBtn", compId, "' disabled='true' title='", component.mmf2I18n.CLEAR_SELECTION, "'>", component.mmf2I18n.CLEAR_SELECTION, "</button>"); //button Clear Selection
    ordArray.push("<button class='mmf2-header-btn' id='mgInactivateBtn", compId, "' disabled='true' title='", component.mmf2I18n.INACTIVATE, "'>", component.mmf2I18n.INACTIVATE, "</button>"); //button Inactivate
    ordArray.push("<button class='mmf2-header-btn' id='mgRenameBtn", compId, "' disabled='true' title='", component.mmf2I18n.RENAME_BTN, "'>", component.mmf2I18n.RENAME_BTN, "</button>"); //button Rename
    ordArray.push("<button class='mmf2-header-btn' id='mgReviewBtn", compId, "' disabled='true' title='", component.mmf2I18n.REVIEW_BTN, "'>", component.mmf2I18n.REVIEW_BTN, "</button></div>"); //button Review, close div button row
    ordArray.push("<div class = 'mmf2-search-section'><div class='mmf2-search-box'>", MP_Util.CreateAutoSuggestBoxHtml(this), "</div></div>"); //Search box


    if (zoomBarHTML !== ""){
            ordArray.push(zoomBarHTML);
    }
    ordArray.push('</div>');

    if (imageListingLen === 0) //no medias, display "No results found"
    {
        ordArray.push("<div class='mmf2-content-body'> ");
        ordArray.push("<div><span class = 'res-none'>", i18n.NO_RESULTS_FOUND, "</span></div>");
    }
    else
    {
        for(var i = 0; i < imageListingLen; i++) {
            var obj = imageListing[i];
            if ((obj.groupId  && obj.groupId  !== obj.imageId) || (obj.groupId === undefined)) //image under group or image
            {
                imageSum = imageSum + 1;
            }
        }
        var imgGrpHTML = this.imageGroup(imageListing);
        // Here navContent string contains the html string of the navigation panel content.
        var navContent = this.generateNavPaneContent(this.m_arrayofGrps);
        var navPane = '<div id="mmf2NavPan'+ compId +'" class="mmf2-nav-panel">'+
                            '<div class="mmf2-nav-button" id="mmf2NavBtn'+compId+'"><div class = "mmf2-nav-button-icon mmf2-nav-unselected-collapsed"></div></div>'+
                            '<div class="mmf2-nav-content" id="mmf2NavContent'+compId +'">'+ navContent +'</div>'+
                       '</div>';
        ordArray.push(navPane);

        ordArray.push("<div class='content-body mmf2-content-body' oncontextmenu='return false;'>"); //added oncontextMenu to disable default mouse right click
        ordArray.push(imgGrpHTML.join(""));
    }
    ordArray.push("</div>");
    //close the mmf2contentMainDiv and add a new mmf2contentReviewDiv for the review pane and this is hidden.
    ordArray.push("</div><div class = 'mmf2-review-pane' id='mmf2contentReviewDiv", compId, "'></div>" );

    countText=MP_Util.CreateTitleText(this, imageSum);
    this.applyTemplate("list-as-table");

    MP_Util.Doc.FinalizeComponent(ordArray.join(""), this, countText);

    //Added event click to select/unselect a media
    this.$rootNode.off( "click", ".mmf2-imgContain"); //remove the click before add if it has been added before. This is needed when Group by option is changed
    this.$rootNode.on( "click", ".mmf2-imgContain",  function() {
       MediaGalleryO2Component.prototype.doSelect.apply(this, [compId]);
    });

    //Added event button click for View Selection button to launch Media Viewer
    var name = this.getCriterion().category_mean;
    this.$rootNode.off( "click", "#mgViewBtn" + compId);
    this.$rootNode.on( "click", "#mgViewBtn" + compId,  function() {
       MediaGalleryO2Component.prototype.launchMediaViewer.apply(this, [compId, component.m_MediaViewerURL, name]);
    });

    //Added event button click for Clear Selection button to clean selection for selected Medias
    this.$rootNode.off( "click", "#mgClearBtn" + compId);
    this.$rootNode.on( "click", "#mgClearBtn" + compId,  function() {
       MediaGalleryO2Component.prototype.clearMediaSelection.apply(this, [compId]);
    });

    //Added event button click for Rename button to rename the selected Media items.
    this.$rootNode.off( "click", "#mgRenameBtn" + compId);
    this.$rootNode.on( "click", "#mgRenameBtn" + compId,  function() {
       MediaGalleryO2Component.prototype.renameMedia.apply(this, [compId]);
    });

    //Added event button click for Review button to review the selected Media items.
    this.$rootNode.off( "click", "#mgReviewBtn" + compId);
    this.$rootNode.on( "click", "#mgReviewBtn" + compId,  function() {
       MediaGalleryO2Component.prototype.reviewMedia.apply(this, [compId]);
    });

    //Added event for search box
    var searchBox = _g(this.getStyles().getNameSpace() + "ContentCtrl" + compId);
    var searchBoxTimeOut = 0;
    searchBox.value = component.mmf2I18n.SEARCH;
    searchBox.className += " placeholder";
    //please reference the mpage-core documentation for keycode concept.
    searchBox.onkeyup = function(event){
        var textBox = this;
        event = event || window.event;
        var iKeyCode = event.keyCode;
        clearTimeout(searchBoxTimeOut);
        searchBoxTimeOut = setTimeout(function(){
            if(iKeyCode === 8 || iKeyCode === 46){
                component.searchImages(event, textBox, component);
            }
            else{
                if(iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)){
                }
                else{
                    component.searchImages(event, textBox, component);
                }
            }
        }, 500);
    };

    //below 2 methods are used to make the placeholder property of the input tag work in older browser
    searchBox.onblur = function(event){
        if(this.value === ""){
            this.value = component.mmf2I18n.SEARCH;
            $(this).addClass("placeholder");
        }
    };
    searchBox.onfocus = function(event){
        if(this.value === component.mmf2I18n.SEARCH){
            this.value = "";
            $(this).removeClass("placeholder");
        }
    };
    CERN_EventListener.fireEvent(this, this, EventListener.EVENT_COUNT_UPDATE, {count: imageSum});
};

/**
 * searchImages
 * This function will do a search on the DOM based on image names and subfolder names.
 * @param {object} callback event object of the search box
 * @param {object} textBox Object of the textbox DOM element
 * @param {object} component Reference of the component
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.searchImages = function(callback, textBox, component){
    var searchString = textBox.value.toUpperCase();
    var rootNode = component.getRootComponentNode();
    var imageMainNode = $(rootNode).find(".mmf2-content-body").children();
    var imageCnt = -1;
    var hiddenImageCnt = -1;
    var subGrpImageCnt = -1;
    var subGrpHiddenImageCnt = -1;
    var subfolderSearchMatch = false;
    var headerText = "";
    var imageName = "";

    $(imageMainNode).each(function(index, item){
        imageCnt = $(item).find(".mmf2-image").length;
        //hide all the images at all levels if they dont match the search String
        $(item).find(".mmf2-image").each(function(imgIndex, imgNode){
            var imageName = $(imgNode).attr("image-name").toUpperCase();
            if(imageName.indexOf(searchString) == -1){
                $(imgNode).addClass("mmf2-force-hidden");
            }
            else{
                $(imgNode).removeClass("mmf2-force-hidden");
            }
        });

        //Hide the subgroups if they dont have any visible images inside them
        $(item).find(".mmf2-group").each(function(imgIndex, subNode){
            //search for the sub group header name
            headerText = $(subNode).find(".mmf2-grp-hdr").text().toUpperCase();
            subfolderSearchMatch = (headerText.indexOf(searchString) == -1) ? false : true;
            if(subfolderSearchMatch){
                $(subNode).find(".mmf2-force-hidden").removeClass("mmf2-force-hidden");
            }

            subGrpImageCnt = $(subNode).find(".mmf2-image").length;
            subGrpHiddenImageCnt = $(subNode).find(".mmf2-image.mmf2-force-hidden").length;
            if(subGrpImageCnt === subGrpHiddenImageCnt){
                $(subNode).addClass("mmf2-force-hidden");
            }
            else{
                $(subNode).removeClass("mmf2-force-hidden");
                $(subNode).find(".sub-sec-hd").find(".mmf2-grp-cnt").text(subGrpImageCnt - subGrpHiddenImageCnt);
            }
        });

        //hide the main group if there are no visible images inside it.
        hiddenImageCnt = $(item).find(".mmf2-image.mmf2-force-hidden").length;
        if(imageCnt === hiddenImageCnt && imageCnt !== 0){
            $(item).addClass("mmf2-force-hidden");
        }
        else if(imageCnt !== 0){
            $(item).removeClass("mmf2-force-hidden");
            $(item).children(".sub-sec-hd").find(".mmf2-grp-cnt").text(imageCnt - hiddenImageCnt);
        }
    });
    //Show everything if the search box is empty
    if(searchString.length === 0){
        $(imageMainNode).each(function(index, item){
            $(item).find(".mmf2-force-hidden").removeClass("mmf2-force-hidden");
        });
    }
};


/**
 * displayFilterApplied
 * This function will display the filter message in the component header section if there is bedrock filtered content types.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.displayFilterApplied=function(){
    var namespace = this.getStyles().getId();
    var lbContainer  = "lookbackContainer" + namespace; //i.e. lookbackContainermmfgal-o23012095018 //this is the location where it displays the lookbackoption i.e. All visits
    var filterMsgHTML = "";
    var contentTypeDisplays = [];
    var idx = 0;
    var mmfI18n = i18n.discernabu.mediaGallery_o2;
    var contentTypeFilterList = this.getContentTypeFilterList();
    var filterContentTypesLen = contentTypeFilterList.length;

    if (filterContentTypesLen > 0) { //if there is filter for Content Types
        //get the list of content type displays
        for (idx=0; idx<filterContentTypesLen; idx++)
        {
            var filterObj = contentTypeFilterList[idx];
            contentTypeDisplays.push(filterObj.DISPLAY);
        }
        var filterMegObj = document.getElementById("filterMessage" + namespace);
        //check to see if the filter message has been displayed, if not, add it. This will prevent the duplicated message displayed when the lookbackoption is changed.
        if(!filterMegObj){
            filterMsgHTML = '<span id="filterMessage'+ namespace +'" title="'+ mmfI18n.CONTENT_TYPES + ': '+ contentTypeDisplays.join(', ')+ '" class="mmf2-filter-applied-message"> '+ mmfI18n.FILTER_APPLIED+ '</span>';
            //search for the lookbackoption header section and add filter applied message.
            $("#" + lbContainer).append(filterMsgHTML);
        }
    }
};//displayFilterApplied

/**
 * displayGroupByContentType
 * This function will display image grouping according by Group by Content Type selected/unselected
 * and save user preference for the Group By into the backend by calling MPagesComponent.savePreferences
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.displayGroupByContentType = function(){
    this.displayBodyContent(); //display Body content by grouping accordingly.
    MPageComponent.prototype.resizeComponent.call(this, null);
    this.postProcessing(); //to add click events for launching media viewer

    if (this.m_menuShowRelatedDocsInd === 1) { //if show related document menu is currently selected, add the show related doc icons on image
        this.generateHTMLShowRelatedDocsIcon();
    }

    //save user preference for the Group By option.
    this.mediaGalleryo2PrefObj.media_gallery_prefs = this.getPrefJson();
    this.setPreferencesObj(this.mediaGalleryo2PrefObj);
    this.savePreferences(true);
};

/**
 * Retrieves the indicator for the Show Related Documents menu
 * @return {[number]} an indicator will be used when Show Related Documents is selected/unselected.
 */
MediaGalleryO2Component.prototype.getMenuShowRelatedDocsInd = function(){
    return this.m_menuShowRelatedDocsInd;
};

/**
 * Sets the indicator for the Show Related Documents menu used to determine which medias to retrieve.
 * @param {[number]} menuShowRelatedDocsInd : an indicator will be used when Show Related Documents is selected/unselected.
 */

MediaGalleryO2Component.prototype.setMenuShowRelatedDocsInd = function(menuShowRelatedDocsInd){
    this.m_menuShowRelatedDocsInd = menuShowRelatedDocsInd;
};

/**
 * getRelatedDocs
 * This function will get the Related Clinical Documents for the images.
 * It will call the mp_media_gallery_get_docs.prg to get the related documents.
 * This function is triggered when the option menu "Show Related Documents" is selected.
 * @param {String} imageIds  (optional) The selected images identifier. This is the case where review pane is displayed for selected images.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.getRelatedDocs = function(imageIds) {
    var criterion=this.getCriterion();
    var request = null;
    var self = this;
    var encntrs = null;
    var encntrStr = "";
    var aSyncIndicator = false;
    var imageIdList = "";

    encntrs=criterion.getPersonnelInfo().getViewableEncounters();
    if (CERN_Platform.inMillenniumContext()) {
        encntrStr=(encntrs)?"value("+encntrs+")":"0";
    } else { //NOTE: For Web enabling it will return 0 for encntrs that it will take the current encounter id
        encntrStr=(encntrs)?"value("+encntrs+")":"value("+criterion.encntr_id + ".0)";
    }

    /*
     * mp_media_gallery_get_docs script parameters:
     *  OUTDEV, inputPersonID, inputViewableEncounters, inputImageIds, inputProviderId, inputPPR
     */
    //Create the parameter array for our script call
    if (typeof(imageIds) !== "undefined") { //if existed when it sent by Review Media
        imageIdList = "value("+ imageIds + ")"; //it will look like this 'value("{35-59-57-eb-f1-2d-48-2a-9a-94-d4-ce-14-89-94-8b}")'
    }
    else{ //no list, it is all images calling by show related docs menu
        imageIdList = "value("+this.m_viewableImageIds + ")"; //it will look like this 'value("{35-59-57-eb-f1-2d-48-2a-9a-94-d4-ce-14-89-94-8b}","{0d-ef-8d-61-ed-3f-43-88-b6-64-7c-f3-0f-d1-5f-41}")'
        aSyncIndicator = true;
    }
    var sendAr=["^MINE^", criterion.person_id + ".0", encntrStr, imageIdList, criterion.provider_id + ".0", criterion.ppr_cd + ".0"];

    request = new MP_Core.ScriptRequest(this, "ENG:MPG.MMF.GALLERY.02 _ Get Related Docs");
    request.setProgramName("MP_MEDIA_GALLERY_GET_DOCS");
    request.setParameters(sendAr);
    request.setAsync(aSyncIndicator);


    MP_Core.XMLCCLRequestCallBack(this, request, function(reply) {
        if (typeof(imageIds) !== "undefined") {
            self.loadRelatedDocs(reply);//load related documents for Review Pane
        }
        else {
            self.displayShowRelatedDocsIcon(reply); //display related documents for Show Related Document menu
        }
    });
};

/**
 * displayShowRelatedDocsIcon
 * This function will display the Show Related Documents icon into the images that are associated to Clinial Document.
 * A click event on the icon will display the list of documents as a hyperlink.
 * This function is triggered when the option menu "Show Related Documents" is selected.
 * @param {Object} reply: the script reply record data
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.displayShowRelatedDocsIcon = function(reply){
    var component = this;
    var replyData = null;
    var replyStatus = "";
    replyStatus = reply.getStatus();
    if(replyStatus !== "S"){
        if(replyStatus === "F") {
            var errMgs = "getRelatedDocs returned unsuccessful status: " + replyStatus;
            MP_Util.LogError(errMgs);
            alert(i18n.ERROR_RETREIVING_DATA);
        }
        else {
            MP_Util.LogInfo("MMF Media Gallery O2:getRelatedDocs:No results found");
        }
        return;
    }

    //script successful, get the documents info the display icon on the image.
    replyData = reply.getResponse();
    this.m_docData = replyData.DOCS;
    this.generateHTMLShowRelatedDocsIcon(); //replaced the logic by calling function to generate related icon associated to images.
};

/**
 * generateHTMLShowRelatedDocsIcon
 * This function will generate HTML string to display the Show Related Documents icon into the images that are associated to Clinial Document.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.generateHTMLShowRelatedDocsIcon = function(){
    var component = this;
    if (this.m_menuShowRelatedDocsInd === 1 && component.m_docData)
    {
        //insert the Show Related Documents icon into the image that associated to the document
        component.$rootNode.find(".mmf2-iconHolder").each(function(){
            var imgMenuId = $(this).prev().attr("id"); //find image id for each image
            var docsObject =  [];
            var docCnt = 0;
            var docsLen = component.m_docData.length;

            //loop thru all docs that have the image attached, then add it into the docsObject
            if(docsLen) {
                for(var i = 0; i < docsLen; i++) {
                    var curDoc = component.m_docData[i];
                            var thumbnailId = curDoc.IMAGE_ID;
                            var thumbnailIdStr = thumbnailId.substring(1, thumbnailId.length - 1); //take out the {}

                if (thumbnailIdStr === imgMenuId )
                {
                    docsObject[docCnt] = curDoc;
                    docCnt = docCnt + 1;
                }
                }
            } //endif docsLen

            if (docCnt > 0)
            {
                $(this).addClass("mmf2-show-related-docs-icon");
                $(this).click(function(){
                    component.setEditMode(true); //Setting this to true to not display yellow tooltips when mouse clicks on the related doc icon
                    component.displayDocumentsMenu(imgMenuId, docsObject);
                    $(".hvr.hover").hide(); //manually hide hover if it is displaying
                });
                $(this).mouseenter(function(){
                    component.setEditMode(true); //Setting this to true to not display yellow tooltips when mouse enter the related doc icon
                    this.activelyHovering = true;
                });
                $(this).mouseleave(function(){
                    component.setEditMode(false); //Setting this back to false re-enables the yellow tooltips hover details
                    this.activelyHovering = false;
                });
            }
        }
        );
    }//end if
};

/**
 * removeShowRelatedDocsIcon
 * This function will remove the Show Related Documents icon into the images that are associated to Clinial Document.
 * This function is triggered when the option menu "Show Related Documents" is unselected.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.removeShowRelatedDocsIcon = function(){
    if (this.m_menuShowRelatedDocsInd === 0)
    {
        this.$rootNode.find(".mmf2-show-related-docs-icon").removeClass("mmf2-show-related-docs-icon"); //remove the icon Show Related Documents
    }
};


/**
 * displayDocumentsMenu
 * This function will display the list of Clinical documents that have this image associated to.
 * This function is triggered when the icon "Show Related Documents" on the media is clicked.
 * @param {string} imgMenuId The id of the media that has Show Related Documents icon is clicked.
 * @param {object} objDocs An array of document objects that related to the image Id.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.displayDocumentsMenu = function(imgMenuId, objDocs){
    var component           = this;
    if(this.docTimeout !== null){
        this.hideDocumentMenu(this, true);
    }
    this.setEditMode(true); // //set to edit mode to stop showing hover (When true, tooltips cannot display)

    var docsHTML            = "";
    var compId              = this.getComponentId();
    var docsLen             = objDocs.length;

    this.docTimeout         = setTimeout(function(){component.hideDocumentMenu(component); }, this.clearTimeoutCount);
    this.activelyHovering   = true;

    if(docsLen) {
        for(var i = 0; i < docsLen; i++) {
            var curDoc          = objDocs[i];
            var patId           = curDoc.PERSON_ID;
            var enctrId         = curDoc.ENCNTR_ID;
            var evntId          = curDoc.EVENT_ID;
            var doc             = curDoc.EVENT_CD_DISP;
            var viewerType      = curDoc.VIEWER_TYPE;
            var parentEventId   = curDoc.PARENT_EVENT_ID;
            var docDt           = null;
            var dateTime        = new Date();

            if (curDoc.EFFECTIVE_DATE) {
                dateTime.setISO8601(curDoc.EFFECTIVE_DATE);
                docDt = MP_Util.DisplayDateByOption(component, dateTime);
            } else {
                docDt = i18n.UNKNOWN;
            }
        //use CreateClinNoteLink to add event onlick to launch Clinical Note Viewer
        //i.e.  <span><a onclick='javascript:MP_Util.LaunchClinNoteViewer(34844160.0,16553761.0,3060732060.0,"DOC",3060732060.0); return false;' href='#'>Wound Care</a></span>
            docsHTML += "<div class='mmf2-doc-item-opt'><span><span>"+ docDt + "<span class ='mmf2-doc-item-name' title = '"+doc+"'>"+ "<span><a href='#' onclick='ResultViewer.launchAdHocViewer(" + evntId +  ")'>"+ doc+ "</a></span>"+"</span></span></span></div>";
        }

        //create mmf2-docs-menu div element with properties
        var docsMnu = Util.cep("div", {
            "className": "mmf2-docs-menu",
            "id": "docsMnu" + compId
        });

        docsMnu.innerHTML =  docsHTML;

        // Establish mouseEnter and mouseLeave events for the document menu box =======================================================================================
        // Sets the "is currently hovering" flag to the component (which prevents the closing of the document list box) when the user hovers over the document list box
        $(docsMnu).bind('mouseenter', {self: this}, function(event) {
            var self = event.data.self;
            self.setEditMode(true); //Setting this to true to not display yellow tooltips when mouse enter the document list
            self.activelyHovering = true;
            self.docTimeout = setTimeout(function(){self.hideDocumentMenu(self); }, self.clearTimeoutCount);
        });

        // add events to close the documents menu when mouse leaves the document menu
        $(docsMnu).bind('mouseleave', {self: this}, function(event) {
            var self = event.data.self;
            self.setEditMode(false); //Setting this to false to re-enable the  yellow tooltips hover when mouse leave the document list.
            self.activelyHovering = false;
            event.stopPropagation();
        });

        //this is needed here : it will trigger to close the menu if user doesn't enter the menu.
        // Establish mouseEnter and mouseLeave events for the trigger icons =======================================================================================
        // add events to close the documents menu when mouse leaves the document menu trigger icon
        $(".mmf2-show-related-docs-icon").bind('mouseleave', {self: this}, function(event) {
            var self = event.data.self;
            self.activelyHovering = false;
            self.setEditMode(false); //Setting this to false to re-enable the  yellow tooltips hover when mouse leave the related doc icon
            event.stopPropagation();
        });
        //append child (docsMnu) to the imgMenuId on the component
        var imageMenuId = component.$rootNode.find("#" + imgMenuId).parent();
        imageMenuId.append(docsMnu);

        Util.cancelBubble();
    }//endif docsLen
};

/**
 * This function will check if it is actively hovering over the document menu box or document related icon, it starts setTimeOut.
 * If it is not actively hovering or bypassCheck is not undefined (when the click event occurred to the view the another document menu box,
 * it will clear the docTimeOut and close the current document menu box and set the edit mode to False where the yellow tooltips can be displayed again.
 * @param {object} component This media gallery component.
 * @param {boolean} bypassCheck (optional) It was passed with value (TRUE) when the document related icon is clicked.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.hideDocumentMenu = function(component, bypassCheck){
    if(this.activelyHovering === false || typeof(bypassCheck) !== "undefined"){
        this.docTimeout = null;
        $(".mmf2-docs-menu").remove();
        this.setEditMode(false); // Setting this back to false re-enables our yellow tooltips
    }else{
        this.docTimeout = setTimeout(function(){component.hideDocumentMenu(component); }, this.clearTimeoutCount);
    }
};

/**
 * This function will display a warning message box before the images are inactivated.
 * @param {object} event This media gallery component.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.displayInactivateMediaWarnBox  = function(event) {
    var self = (event) ? event.data.self : this;
    //Get the number of images selected
    var imageSelCount = self.$rootNode.find(".mmf2-imgContain.mmf2-selected").length;

    var mBodyContent = "<div class='warning-container" + "'><span class='message-info-text'>" + self.mmf2I18n.INACTIVATE_WARNING.replace(/\{0\}/, imageSelCount) + "</span></div>";
    var modalId = "MediaGalleryInactivate";
    var modalTitle = self.mmf2I18n.INACTIVATE_WARNING_TITLE;
    //Retrieve the Modal object using modalId.Will have undefined as the value if modal object does not exist/
    var mDialog = MP_ModalDialog.retrieveModalDialogObject(modalId);
    var okButton = {};
    var cancelButton = {};
    //If modal object is not available , create a new object.
    if (!mDialog) {
        mDialog = new ModalDialog(modalId);
        mDialog.setHeaderTitle(modalTitle).setBodyElementId(modalId).setShowCloseIcon(true).setIsBodySizeFixed(false).setTopMarginPercentage(20).setBottomMarginPercentage(20).setLeftMarginPercentage(35).setRightMarginPercentage(35);
        okButton = new ModalButton("OkButton");
        okButton.setText(i18n.discernabu.CONFIRM_OK).setIsDithered(false).setOnClickFunction(function() {
            MP_ModalDialog.closeModalDialog(modalId);
            self.inactivateMedia(self);
        });
        mDialog.addFooterButton(okButton);
        cancelButton = new ModalButton("cancelButton");
        cancelButton.setText(i18n.discernabu.CONFIRM_CANCEL).setIsDithered(false).setOnClickFunction(function() {
            MP_ModalDialog.closeModalDialog(modalId);
        });
        mDialog.addFooterButton(cancelButton);
        mDialog.setHeaderCloseFunction(function() {
            MP_ModalDialog.closeModalDialog(modalId);
        });
        MP_ModalDialog.addModalDialogObject(mDialog);
    }
    MP_ModalDialog.showModalDialog(modalId);
    mDialog.setBodyHTML(mBodyContent);
};
/**
 * inactivateMedia
 * This function will inactivate selected images. If user doesn't have privilege to inactivate any image, it will display a message.
 * @param {number} component Component Context.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.inactivateMedia=function(component) {
    var imageListing = component.getPatientImages();
    var warningInd = false;

    //Find all selected images and inactivate
    component.$rootNode.find( ".mmf2-imgContain.mmf2-selected" ).find(".mmf2-thumb").each(function(i, obj){
        //check to see if user has access to inactivate the image/meida by checking its maintainPriv
        var mediaId = "{" + obj.getAttribute('id') + "}";  //add the {} since it was removed setting id
        var mediaArray =$.grep(imageListing, function(mediaObj) {
              return mediaObj.imageId === mediaId; //the id of media matched the id of selected media
        });

        if (mediaArray.length > 0) { //it should be 1 only, but to be safe using > 0
            if (mediaArray[0].maintainPriv === "true") {
                var inactivateURL = component.getBaseURL() + 'inactivate/' + mediaId;  //URI to inactivate the image
                //Make an XMLHttpRequest call with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call before passing into the Modal dialog.
                try
                {
                    MP_Util.LogInfo("mediagallery-o2.js: inactivateMedia: inactivateURL:" + inactivateURL);
                    g_MediaGadgetO2XMLHttpRequestObj.open("POST", inactivateURL, false);
                    if (CERN_Platform.inMillenniumContext()) {
                        window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetO2XMLHttpRequestObj)";
                    }
                    g_MediaGadgetO2XMLHttpRequestObj.send();
                    if (g_MediaGadgetO2XMLHttpRequestObj.status === 200) {
                        var responseText = g_MediaGadgetO2XMLHttpRequestObj.responseText;
                        if (responseText !== "[OK]") {
                            alert (component.mmf2I18n.MSG_ERROR_SAVING_CHANGES + ': ' + responseText);
                        }
                    }
                    else{
                        MP_Util.LogInfo("mediagallery-o2.js: inactivateMedia: Failed to inactivate the Media:" + g_MediaGadgetO2XMLHttpRequestObj.status);
                    }
                }
                catch(err)
                {
                    // on error or on unsuccessful log error
                    MP_Util.LogJSError(this, err, "mediagallery-o2.js", "inactivateMedia");
                    throw(err);
                }
            }//end if maintainPriv
            else { //no maintain priv
                MP_Util.LogInfo("mediagallery-o2.js: inactivateMedia: User doesn't have privilege to inactivate the media id:" + mediaId);
                warningInd = true;
             }
        } //end if
    });

    if (warningInd) {
        alert (component.mmf2I18n.MSG_INACTIVATE_PRIV);
    }
    //refresh the page
    component.retrieveMedia(component.getBaseURL() + component.getURLParams());
    component.displayBodyContent(); //display Body content by grouping accordingly.
    MPageComponent.prototype.resizeComponent.call(component, null);
    component.postProcessing(); //to add click events for launching media viewer

    if (component.m_menuShowRelatedDocsInd === 1) { //if show related document menu is currently selected, add the show related doc icons on image
        component.generateHTMLShowRelatedDocsIcon();
    }
};

/**
 * renameMedia
 * This function will display the Rename dialog to let user enter new name for selected images. Click OK will save the rename. Cancel/Close will cancel the action.
 * @param {number} compId Component id.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.renameMedia=function(compId) {
    var component = MP_Util.GetCompObjById(compId);
    var okButton=null;
    var cancelButton=null;
    var sDialogHTML = [];
    var itemSelectedCnt = component.$rootNode.find( ".mmf2-imgContain.mmf2-selected" ).length;
    var MARGIN_20 = 20;
    var MARGIN_35 = 35;

    //generate a Modal dialogue with the OK/cancel buttons that user can enter name
    var modalId = "MediaGalleryO2Component_Rename";
    var mDialog = new ModalDialog(modalId);
    mDialog.setHeaderCloseFunction(function(){
       MP_ModalDialog.closeModalDialog(modalId);
       MP_ModalDialog.deleteModalDialogObject(modalId);
    });


    mDialog.setHeaderTitle(component.mmf2I18n.RENAME_MEDIA);
    //display OK button on the dialog with onClick event will close the dialog and save rename media
    okButton = new ModalButton("MediaGalleryO2OKButton");
    okButton.setText(i18n.discernabu.CONFIRM_OK).setIsDithered(true).setOnClickFunction(function(){
        var value = $("#mgRenameTxt" + compId).val();
        MP_ModalDialog.closeModalDialog(modalId);
        MP_ModalDialog.deleteModalDialogObject(modalId);
        component.saveRenameMedia(compId, value);
    });
    mDialog.addFooterButton(okButton);

    //display Cancel button on the dialog with onClick event will close the dialog without saving.
    cancelButton = new ModalButton("MediaGalleryO2CancelButton");
    cancelButton.setText(i18n.discernabu.CONFIRM_CANCEL).setIsDithered(false).setOnClickFunction(function(){
        MP_ModalDialog.closeModalDialog(modalId);
        MP_ModalDialog.deleteModalDialogObject(modalId);
    });
    mDialog.addFooterButton(cancelButton);

    //display text/label and input box on the body content of the dialog.
    mDialog.setBodyDataFunction(function(modalObj){
        sDialogHTML.push("<div class='mmf2-rename-dialog-lbl'>", component.mmf2I18n.RENAME_TXT.replace("{0}", itemSelectedCnt), ":</div>");
        sDialogHTML.push("<div class='mmf2-rename-dialog-txt'><input type='text' id='mgRenameTxt", compId, "' name='newName' value=''></div>");
        modalObj.setBodyHTML(sDialogHTML.join(""));
    });
    //Set the position/size of the modal dialog.
    mDialog.setTopMarginPercentage(MARGIN_20).setRightMarginPercentage(MARGIN_35).setBottomMarginPercentage(MARGIN_20).setLeftMarginPercentage(MARGIN_35).setIsBodySizeFixed(false);

    //Display modal dialog
    MP_ModalDialog.addModalDialogObject(mDialog);
    MP_ModalDialog.showModalDialog(modalId);
    $("#mgRenameTxt" + compId).focus(); //set focus on the text box

    //Determine when to enable/disable OK button
    var inputBox = $("#mgRenameTxt" + compId);
    inputBox.on("keyup", function(event){
        if(this.value === ""){
            mDialog.setFooterButtonDither("MediaGalleryO2OKButton", true);
        }
        else{
            mDialog.setFooterButtonDither("MediaGalleryO2OKButton", false);
        }
    });

    //Add key events
    $("#vwpModalDialogMediaGalleryO2Component_Rename").keydown(function(e) {
        if(e.which === 27){ //if Escape key is pressed, close (cancel) the action without saving rename.
            MP_ModalDialog.closeModalDialog(modalId);
            MP_ModalDialog.deleteModalDialogObject(modalId);
        }
        else if(e.which === 13){ //if Enter key is pressed, as OK to save rename.
            var value = $("#mgRenameTxt" + compId).val();
            if (value !== undefined) {
                MP_ModalDialog.closeModalDialog(modalId);
                MP_ModalDialog.deleteModalDialogObject(modalId);
                component.saveRenameMedia(compId, value);
                Util.cancelBubble(); //to stop this event propagation in the event chain.
            }
            return false; //this will end the Enter key function to prevent it function something else.
        }
        Util.cancelBubble(); //to stop this event propagation in the event chain.
    });
}; //end renameMedia

/**
 * saveRenameMedia
 * This function will call URI to save the rename selected items. If user doesn't have privilege to rename any image, it will display a message.
 * example URI: http://iptmpwas01/camm-mpage/solution.northamerica.cerner.net/service/maintain/{a4-95-37-62-32-89-44-38-b0-26-c2-09-be-8c-5d-45}?name=Dessert2&version=1
 * @param {number} compId Component id.
 * @param {string} newName The name that will be used for rename.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.saveRenameMedia = function (compId, newName) {
    var component = MP_Util.GetCompObjById(compId);
    var imageListing = component.getPatientImages();
    var warningInd = false;

    //Find all selected images and rename
    component.$rootNode.find( ".mmf2-imgContain.mmf2-selected" ).find(".mmf2-thumb").each(function(i, obj){
        //check to see if user has access to rename the image/media by checking its maintainPriv
        var mediaId = "{" + obj.getAttribute('id') + "}";  //add the {} since it was removed setting id
        var mediaArray =$.grep(imageListing, function(mediaObj) {
              return mediaObj.imageId === mediaId; //the id of media matched the id of selected media
        });

        if (mediaArray.length > 0) { //it should be 1 only, but to be safe using > 0
            if (mediaArray[0].maintainPriv === "true") {
                var renameURL = component.getBaseURL() + 'maintain/' + mediaId + "?name=" + newName + "&version="+ mediaArray[0].versionNumber;  //URI to inactivate the image
                //Make an XMLHttpRequest call with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call before passing into the Modal dialog.
                try
                {
                    MP_Util.LogInfo("mediagallery-o2.js: saveRenameMedia: renameURL:" + renameURL);
                    g_MediaGadgetO2XMLHttpRequestObj.open("POST", renameURL, false);
                    if (CERN_Platform.inMillenniumContext()) {
                        window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetO2XMLHttpRequestObj)";
                    }
                    g_MediaGadgetO2XMLHttpRequestObj.send();
                    var responseText = g_MediaGadgetO2XMLHttpRequestObj.responseText;
                    if (g_MediaGadgetO2XMLHttpRequestObj.status !== 200) { //a non-successful response (any other status code), the response body will contain the Exception Message.
                        alert (component.mmf2I18n.MSG_ERROR_SAVING_CHANGES + ': ' + responseText);
                        MP_Util.LogInfo("mediagallery-o2.js: saveRenameMedia: Failed to rename the Media:" + g_MediaGadgetO2XMLHttpRequestObj.status);
                    }
                }
                catch(err)
                {
                    // on error or on unsuccessful log error
                    MP_Util.LogJSError(this, err, "mediagallery-o2.js", "saveRenameMedia");
                    throw(err);
                }
            }//end if maintainPriv
            else { //no maintain priv
                MP_Util.LogInfo("mediagallery-o2.js: saveRenameMedia: User doesn't have privilege to rename the media id:" + mediaId);
                warningInd = true;
             }
        }//end if
    });

    if (warningInd) {
        alert (component.mmf2I18n.MSG_RENAME_PRIV);
    }
    //refresh the page
    component.retrieveMedia(component.getBaseURL() + component.getURLParams());
    component.displayBodyContent(); //display Body content by grouping accordingly.
    MPageComponent.prototype.resizeComponent.call(component, null);
    component.postProcessing(); //to add those events handler.

    if (component.m_menuShowRelatedDocsInd === 1) { //if show related document menu is currently selected, add the show related doc icons on image
        component.generateHTMLShowRelatedDocsIcon();
    }
};//end saveRenameMedia


/**
 * reviewMedia
 * This function will create the review pane for the selected media/images.
 * @param {number} compId Component id.
 * @return {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.reviewMedia = function(compId) {
    var component = MP_Util.GetCompObjById(compId);
    var itemSelectedCnt = component.$rootNode.find( ".mmf2-imgContain.mmf2-selected" ).length;
    var $mmf2ContentMainDiv = $("#mmf2contentMainDiv" + compId);
    var $mmf2ReviewPaneDiv = $("#mmf2contentReviewDiv" + compId);
    var imageIdSelectedList = []; //the list of selected images.
    var firstSelectedImageId = ""; //the first selected image from the component.
    var reviewPaneHTML = "";
    var LEFT_KEY = 37;
    var RIGHT_KEY = 39;
	var cammOrigin = component.getCAMMOrigin();
    var iFrameHtmlPath = "/mmf-iframe-messaging/html/mmf-iframe-messaging.html";
	
    var subTimerName = component.getCriterion().category_mean;
    var slaTimer = MP_Util.CreateTimer("CAP:MPG_Media_Gallery_o2_Launch_Review_Media", subTimerName);
    if (slaTimer) {
        slaTimer.Stop();
    }

    //display a loading spinner when loading review Media
    //MP_Util.LoadSpinner("mmf2contentReviewDiv" + compId); //future implementation

    //Loop thru the selected images and get the image id.
    component.$rootNode.find( ".mmf2-imgContain.mmf2-selected .mmf2-thumb").each(function(i, obj){
        var mediaId = "{" + obj.getAttribute('id') + "}";  //add the {} since it was removed when setting id
        imageIdSelectedList.push('"' + mediaId + '"');
        if (i===0) { //get the first selected image id so that it will be displayed by default on the Review pane.
            firstSelectedImageId = mediaId;
        }
    });
    //get related documents for all selected images.
    component.getRelatedDocs(imageIdSelectedList);
    component.m_imageIdSelectedList = imageIdSelectedList;

    var dv1Height = $mmf2ContentMainDiv.height();

    $mmf2ReviewPaneDiv.height(dv1Height);
    //Hide the main div
    $mmf2ContentMainDiv.hide();

    //Hide the Lookback option filter, filter message, refresh button and the Main component menu in the Review pane
    $("#lookbackContainermmfgal-o2" + compId).hide();
    $("#filterMessagemmfgal-o2" + compId).hide();
    $("#mainCompRefresh" + compId).hide();
    $("#mainCompMenummfgal-o2" + compId).hide();

    //Start generating review pane lay out
    reviewPaneHTML += "<div class='mmf2-review-pane-left'>";
    reviewPaneHTML += "<div class='mmf2-review-pane-left-header' id = 'mmfgal-o2" + compId + "rpLeftHeader'>";
    reviewPaneHTML += "<button class='mmf2-review-pane-gallery-btn' id='mgGalleryBtn"+compId+"' title='"+ component.mmf2I18n.MEDIA_GALLERY_BTN +"'>"+"< "+component.mmf2I18n.MEDIA_GALLERY_BTN +"</button>";
    reviewPaneHTML += "<div class = 'mmf2-review-pane-review-label'>" + component.mmf2I18n.REVIEW_TXT.replace("{0}", "(" +itemSelectedCnt + ")")+"</div></div>";
    //generate HTML for the Image Area (left-body section on the review pane)
    reviewPaneHTML += component.generateHTMLrpImageContentArea(itemSelectedCnt);

    reviewPaneHTML += "<div class='mmf2-review-pane-left-footer' id = 'mmfgal-o2" + compId + "rpLeftFooterImageTray'>"; //left footer content start
    //View button section
    reviewPaneHTML += component.generateHTMLrpFootViewSection();

    //image tray navigator
    reviewPaneHTML += "<div class='mmf2-review-pane-nav-container'>";
    reviewPaneHTML += "<div class='mmf2-review-pane-nxt-nav-area' id='mmfgal-o2" + compId + "reviewNxtNavArea'>"; //next nav area div
    reviewPaneHTML += "<div class='mmf2-review-pane-nav-btns mmf2-review-pane-nxt-nav' id='mmfgal-o2" + compId + "reviewNxtNav'>&nbsp;</div>";//next button
    reviewPaneHTML += "</div>"; //close next nav area div
    reviewPaneHTML += "<div class='mmf2-review-pane-prev-nav-area' id='mmfgal-o2" + compId + "reviewPrevNavArea'>"; //prev nav area div
    reviewPaneHTML += "<div class='mmf2-review-pane-nav-btns' id='mmfgal-o2" + compId + "reviewPrevNav'>&nbsp;</div>"; //previous button


    reviewPaneHTML += "</div>"; //close prev nav area div
    reviewPaneHTML += "<div class='mmf2-review-pane-nav-content'  id='mmf2ReviewPaneNavContent"+compId+"'></div>"; //navigation content
    reviewPaneHTML += "</div>"; //close nav-container div
    reviewPaneHTML += "</div>"; //close left footer div
    //end image tray navigator

    reviewPaneHTML += "</div>"; //close div .mmf2-review-pane-left
    //start the right layout
    reviewPaneHTML += "<div class='mmf2-review-pane-right' id = 'mmfgal-o2" + compId + "reviewPaneRight'>";  //the right div layout //This will be the Details/Edit/Map section.
	reviewPaneHTML += component.generateHTMLrpRightBodySection(firstSelectedImageId); //Generate right body section layout with the first selected image by default
	reviewPaneHTML += "</div>"; //close the right div

    if(component.isCanvasSupported()) {
        window.addEventListener("message", function(e) {
            logger.logDebug("Entering window message listener");
            var img = new Image();

            img.onload = function(){
                logger.logDebug("Entering img.onload");
                component.generateCanvas(compId, this, this.width, this.height);
            };
          
            img.src = e.data;
        });

        logger.logMessage("creating iframe src : " + cammOrigin + "/mpage-content/" + component.m_fullCanonicalDomainName + iFrameHtmlPath);
        reviewPaneHTML += '<iframe class = "mmf2-iframe-receiver" id="mmfgal-o2' + compId + 'iFrameReceiver" src="' + cammOrigin + '/mpage-content/' + component.m_fullCanonicalDomainName + iFrameHtmlPath + '" height="0" width="0"></iframe>';
    }

    $mmf2ReviewPaneDiv.append(reviewPaneHTML);
    component.populateImagesOnReviewImageTray(); //displays selected image on the image tray.
    $mmf2ReviewPaneDiv.show();
    //$(".loading-screen").remove(); //remove loading screen //future implementation

    component.resizeComponent(); //call resize to adjust to body panel accordingly
    component.populateImageContentOnReviewPane(); //display selected images on the image content area

    component.handleEventsForImgContentNav(); ////Add events (click/mouseover/mouseout) for Image Navigator section (on the Image area)

    //------------Events for Image Tray Navigator section (on the Image Tray = left footer area)---------------------
    var $mgReviewNxtNavAreaId = $("#mmfgal-o2" + compId + "reviewNxtNavArea");
    var $mgReviewPrevNavAreaId = $("#mmfgal-o2" + compId + "reviewPrevNavArea");
    var $mgReviewPrevNavId = $("#mmfgal-o2" + compId + "reviewPrevNav");
    var $mgReviewNxtNavId = $("#mmfgal-o2" + compId + "reviewNxtNav");

    //Click event for Previous Navigator Area to scroll right to show previous images on the left of image list
    $mgReviewPrevNavAreaId.click(function () {
        $("#mmf2ReviewPaneNavContent" + compId).animate({
            scrollLeft: '-=115px'
        });
        //Since it has been scrolled to previous, so add the next arrow background icon if it has not been displayed
        if ($mgReviewNxtNavId.hasClass("mmf2-review-pane-nxt-nav") === false) {
            $mgReviewNxtNavId.addClass("mmf2-review-pane-nxt-nav");
        }
    });

    //Click event for Next Navigator Area to scroll left to show next images on the right of image list
    $mgReviewNxtNavAreaId.click(function () {
        $("#mmf2ReviewPaneNavContent"+compId).animate({
            scrollLeft: '+=115px'
        });
        //Since it has been scrolled to next, so add the previous arrow background icon if it has not been displayed
        if ($mgReviewPrevNavId.hasClass("mmf2-review-pane-prev-nav") === false) {
            $mgReviewPrevNavId.addClass("mmf2-review-pane-prev-nav");
        }
    });

    //MouseOver event for displaying Previous Navigator Active icon
    $mgReviewPrevNavAreaId.mouseover(function() {
        if ($mgReviewPrevNavId.hasClass("mmf2-review-pane-prev-nav")) {
            $mgReviewPrevNavId.removeClass("mmf2-review-pane-prev-nav").addClass("mmf2-review-pane-prev-nav-active");
        }
    }).mouseout(function() { //MouseOut event for displaying Previous Navigator Normal icon
        if ($mgReviewPrevNavId.hasClass("mmf2-review-pane-prev-nav-active")) {
            $mgReviewPrevNavId.removeClass("mmf2-review-pane-prev-nav-active").addClass("mmf2-review-pane-prev-nav");
        }
    });


    //MouseOver and MouseOut event for Next Navigation to display normal/Active icon
    $mgReviewNxtNavAreaId.mouseover(function() { //MouseOver  event displaying Next Navigator Active icon
        if ($mgReviewNxtNavId.hasClass("mmf2-review-pane-nxt-nav")) {
            $mgReviewNxtNavId.removeClass("mmf2-review-pane-nxt-nav").addClass("mmf2-review-pane-nxt-nav-active");
        }
    }).mouseout(function() { //MouseOut event displaying Next Navigator Normal icon
        if ($mgReviewNxtNavId.hasClass("mmf2-review-pane-nxt-nav-active")) {
           $mgReviewNxtNavId.removeClass("mmf2-review-pane-nxt-nav-active").addClass("mmf2-review-pane-nxt-nav");
        }
    });

    //Add LEFT/RIGHT ARROW KEY to REVIEW media
    //NOTE: Hot key only works while the focus is on the REVIEW PANE
    //NOTE: There is a bug for keypress/keydown event registers multiple times if the event is attached to the JQuery object,
    //it will cause the image skipped to display the next image several times.
    //To avoid that, use JQuery selectors and get the raw DOM element instead and then attach the event to the raw DOM element by using the JS array notation
    $mmf2ReviewPaneDiv[0].onkeydown = function(e) {
        if(e.which === RIGHT_KEY){//if right key is pressed while the focus in on the REVIEW PANE, IT WILL DISPLAY NEXT IMAGE.
            component.displayNextImageContentInReviewPane();
            Util.cancelBubble(); //to stop this event propagation in the event chain.
        }
        else if(e.which === LEFT_KEY) {
            component.displayPrevImageContentInReviewPane();
            Util.cancelBubble(); //to stop this event propagation in the event chain.
        }
    };
}; //end reviewMedia

/**
 * displayComponentContent
 * This function will display the component Main content when Review pane is closed.
 * @param {number} compId Component id.
 * @return {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.displayComponentContent = function(compId) {
    var component = MP_Util.GetCompObjById(compId);
    var $mmf2contentReviewDiv = $("#mmf2contentReviewDiv" + compId);
    var $mmf2contentMainDiv = $("#mmf2contentMainDiv" + compId);

    //Hide the Review Pane
    $mmf2contentReviewDiv.hide();
    //Show the component Main Content
    $mmf2contentMainDiv.show();
    component.resizeComponent();

    //Show the Lookback option filter, filter message, refresh button and the Main component menu again
    $("#lookbackContainermmfgal-o2" + compId).show();
    $("#filterMessagemmfgal-o2" + compId).show();
    $("#mainCompRefresh" + compId).show();
    $("#mainCompMenummfgal-o2" + compId).show();

    //Clear the Review Pane
    $mmf2contentReviewDiv.html('');
};

/**
 * getImageObjById
 * This method will get the image object for a given image id.
 * @param {String} imageId The id of image that will be looked for its object.
 * @return {Object} imgObj An image object of the given image id.
 */
MediaGalleryO2Component.prototype.getImageObjById = function(imageId) {
  var imgObj = null;
  var imageListing = this.getPatientImages(); //get the list of image objects

  //Find the image object for the given imageId
    var mediaArray =$.grep(imageListing, function(mediaObj) {
          return mediaObj.imageId === imageId; //the id of image matched the id of selected image
    });

    if (mediaArray.length > 0) { //logically, it needs to check, but it should be always 1 only
        imgObj = mediaArray[0];
  }

  return imgObj;
};

/**
 * This method will be called when a selected image is navigated to view in review pane.
 * This method will populate the image info for the Details.
 * @param {String} imageId The id of image that will be displayed on the review pane.
 * @return {String} sImageDetailHTML HTML string for details layout on the review pane.
 */
MediaGalleryO2Component.prototype.populateDetails = function(imageId) {
    var component = this;
    var compID = component.getComponentId();
    var imageListing = component.getPatientImages(); //get the list of image objects
    var sImageDetailHTML = "";
    var imageIdList = [];
    var docsHTML = "";

    //generate HTML string for related documents for the selected image
    docsHTML = component.generateRelatedDocsHTML(imageId);

    //find the image object for the given imageId
    var mediaArray =$.grep(imageListing, function(mediaObj) {
          return mediaObj.imageId === imageId; //the id of image matched the id of selected image
    });

    if (mediaArray.length > 0) { //logically, it needs to check, but it should be always 1 only
        var tempImage = mediaArray[0];
        var serviceDateObj = new Date(tempImage.serviceDate*1000);
        var sServiceDate = serviceDateObj.toLocaleDateString();
        var sServiceTime = serviceDateObj.toLocaleTimeString();

        //display image name on top of details
        sImageDetailHTML += "<div class='mmf2-review-pane-detail-name'>" + tempImage.description +"</div>";
        //display image info: Name, content type, service date/time, Create Person, Date Modified, Version, Media Type and Size
        sImageDetailHTML += "<dl><div class='mmf2-review-pane-detail-label'>" + component.mmf2I18n.NAME+":</div><div class='mmf2-review-pane-detail-dat'>"+tempImage.description + "</div>";
        sImageDetailHTML += "<div class='mmf2-review-pane-detail-label'>"+component.mmf2I18n.CONTENT_TYPE + ":</div><div class='mmf2-review-pane-detail-dat'>" + tempImage.contentType + "</div>";
        sImageDetailHTML += "<div class='mmf2-review-pane-detail-label'>"+component.mmf2I18n.SERVICE_DATE_TIME + ":</div><div class='mmf2-review-pane-detail-dat'>" + sServiceDate + "&nbsp;" + sServiceTime + "</div>";

        //Create Person and Date Modified are no data for now , as display "--"
        sImageDetailHTML += "<div class='mmf2-review-pane-detail-label'>"+component.mmf2I18n.CREATE_PERSON + ":</div><div class='mmf2-review-pane-detail-dat'>" + "--" + "</div>";
        sImageDetailHTML += "<div class='mmf2-review-pane-detail-label'>"+component.mmf2I18n.DATE_MODIFIED + ":</div><div class='mmf2-review-pane-detail-dat'>" + "--" + "</div>";

        sImageDetailHTML += "<div class='mmf2-review-pane-detail-label'>"+component.mmf2I18n.VERSION + ":</div><div class='mmf2-review-pane-detail-dat'>" + tempImage.versionNumber + "</div> ";
        sImageDetailHTML += "<div class='mmf2-review-pane-detail-label'>"+component.mmf2I18n.MEDIA_TYPE + ":</div><div class='mmf2-review-pane-detail-dat'>" + tempImage.mimeType + "</div>";
        sImageDetailHTML += "<div class='mmf2-review-pane-detail-label'>"+component.mmf2I18n.SIZE + ":</div><div class='mmf2-review-pane-detail-dat'>" + tempImage.size + " KB" + "</div></dl>";

        sImageDetailHTML += docsHTML; //add the Related Documents string
    }

    return sImageDetailHTML;
};
/**
 * generateRelatedDocsHTML
 * This method will be called when a selected image is navigated to be viewed in review pane for the Details.
 * This method will generate HTML string for the related documents associated to the given imageId.
 * @param {String} imageId The media id for the selected media (i.e. "{31-9e-c1-da-bb-23-4f-6b-81-c8-eb-ae-a1-21-05-a5}" )
 * @return {String} docsHTML HTML string for Related document layout on the Details in review pane.
 */
MediaGalleryO2Component.prototype.generateRelatedDocsHTML = function(imageId) {
    var component = this;
    var docsHTML = "";
    var sRelatedDocHeaderHTML = "";
    var docDataObj = component.getDocDataForSelectedMedias(); //get related documents for all selected images.
    var relatedDocsArray  =  []; //store related document for the given image.
    var relatedDocCnt = 0;


    //Get related documents (array of document's objects)  for the given imageId
    //then add it into the relatedDocsArray.
     relatedDocsArray = docDataObj[imageId];
     if (relatedDocsArray) {
         relatedDocCnt = relatedDocsArray.length;
      }

     //if there are related documents, generate Relate Documents layout.
     if (relatedDocCnt > 0) {
        for(var i = 0; i < relatedDocCnt; i++) {
            var curDoc          = relatedDocsArray[i];
            var patId           = curDoc.PERSON_ID;
            var enctrId         = curDoc.ENCNTR_ID;
            var evntId          = curDoc.EVENT_ID;
            var doc             = curDoc.EVENT_CD_DISP;
            var viewerType      = curDoc.VIEWER_TYPE;
            var parentEventId   = curDoc.PARENT_EVENT_ID;
            var docDt           = null;
            var dateTime        = new Date();

            if (curDoc.EFFECTIVE_DATE) {
                dateTime.setISO8601(curDoc.EFFECTIVE_DATE);
                docDt = MP_Util.DisplayDateByOption(component, dateTime);
            } else {
                docDt = i18n.UNKNOWN;
            }
        //use CreateClinNoteLink to add event onlick to launch Clinical Note Viewer
        //i.e.  <span><a onclick='javascript:MP_Util.LaunchClinNoteViewer(34844160.0,16553761.0,3060732060.0,"DOC",3060732060.0); return false;' href='#'>Wound Care</a></span>
            docsHTML += "<div class='mmf2-review-pane-related-doc-item'>" +
                            "<span>" +
                                "<span class='mmf2-review-pane-related-doc-date'>"+ docDt+"</span>" +
                                "<span  class ='mmf2-doc-item-name' title = '"+doc+"'>"+ "<span><a href='#' onclick='ResultViewer.launchAdHocViewer(" + evntId +  ")'>"+ doc+ "</a></span>"+"</span>" +
                            "</span>" +
                        "</div>";
        } //end for
        sRelatedDocHeaderHTML = "<fieldset class='mmf2-review-pane-related-doc-fieldset'><legend class='mmf2-review-pane-related-doc-legend'>"+component.mmf2I18n.RELATED_DOCUMENTS.replace("{0}", relatedDocCnt)+"</legend>";
        docsHTML = sRelatedDocHeaderHTML + docsHTML  + "</fieldset>";
    } //end if
    return docsHTML;
};

/**
 * loadRelatedDocs
 * This function will load Related documents for selected images on the Details tab of the Review Pane.
 * @param {Object} reply json object returned from script mp_media_gallery_get_docs.prg
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.loadRelatedDocs = function(reply) {
    var component = this;
    var replyData = null;
    var replyStatus = "";
    var docData = []; //store related documents for images
    var sMsg = "";
    var docsHTML = "";
    var errorModal = null;

    replyStatus = reply.getStatus();

    //if failed, display error message
    if(replyStatus === "F") {
        var i18nABU = i18n.discernabu;
        var errorMessage = i18n.ERROR_RETREIVING_DATA;
        MP_Util.LogError("mediagallery-o2.js: getRelatedDocs returned unsuccessful status: " + replyStatus);
        errorModal = MP_ModalDialog.retrieveModalDialogObject("errorModal");
        if (!errorModal){
            errorModal = MP_Util.generateModalDialogBody("errorModal", "error", errorMessage, i18nABU.INFO_BUTTON_ERROR_ACTION);
            errorModal.setHeaderTitle(component.mmf2I18n.RELATED_DOCUMENTS_TITLE);
            var closeButton = new ModalButton("closeButton");
            closeButton.setText(i18n.CLOSE).setCloseOnClick(true);
            errorModal.addFooterButton(closeButton);
        }
        MP_ModalDialog.updateModalDialogObject(errorModal);
        MP_ModalDialog.showModalDialog("errorModal");
    }
    else { //S or Z status
        //script successful, get the documents info then display on the details tab.
        replyData = reply.getResponse();
        docData = replyData.DOCS;
        component.setDocDataForSelectedMedias(docData);
    }
};

/**
 * populateImagesOnReviewImageTray
 * This function will get the selected images and display on the image tray (bottom section) of the Review Pane.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.populateImagesOnReviewImageTray = function() {
    var component = this;
    var compId   = component.getComponentId();
    var $reviewPaneImgContain= "";

    //Find all of the selected image thumbnails from the Main content, then make a copy set so that they can be added into the image tray (left footer panel) on the Review Pane.
    var imgNodes = component.$rootNode.find( ".mmf2-imgContain.mmf2-selected .mmf2-thumb").clone();
    //For each of image node, create a div container and add it in.
    for(var cnt=0; cnt < imgNodes.length; cnt++){
        $reviewPaneImgContain = $('<div class="mmf2-review-pane-img-contain">'); //create a div container for each image
        if (cnt===0) {//set the first image to be selected by default;
            $reviewPaneImgContain = $('<div class="mmf2-review-pane-img-contain mmf2-review-pane-selected">'); //create a div container for each image
        }
        $reviewPaneImgContain.append(imgNodes[cnt]).appendTo('#mmf2ReviewPaneNavContent'+ compId); //add image on the image tray (navigator content div)
    }

    //Add click event to select an image from the image tray list.
    component.$rootNode.on( "click", ".mmf2-review-pane-img-contain",  function() {
      var button = this;
      component.displayUnsavedModalDialog(compId, function(){
        component.selectImageOnReviewPane.apply(button, [compId]);
      });
    });
}; //end populateImagesOnReviewImageTray

/**
 * selectImageOnReviewPane
 * This function is executed when an image on the image tray of the review pane is selected
 * or when user navigate next/pre on the image content area
 * This function will remove the previous selected image and mark this one as selected
 * and its details information.
 * @param {number} compId The component id.
 * @param {String} directionInd (optional) Direction of the image content scrolled (P: previous, N:next)
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.selectImageOnReviewPane=function(compId, directionInd) {
    var self =this;
    var component = MP_Util.GetCompObjById(compId);
    var imageId = "";
    var $rootNode = component.$rootNode;
    var imgList = $rootNode.find( "#mmf2ReviewPaneNavContent" + compId)[0].children;
    var prevSelectedIdx = 0;
    var newSelectedIdx = 0;
    var scrollLeftValue = 0;

    component.removeCanvas(compId);

    //check to see if it is by user selected image on image tray or navigate from Image Content section
    if (typeof(directionInd) === "undefined") { //this is by user selected an image thumbnail from the image tray.
        var $currentSelectedItm = $rootNode.find( ".mmf2-review-pane-img-contain.mmf2-review-pane-selected")[0]; //get the current selected item
        //find the index of the current selected item on the image tray.
        for(var i=0; i< imgList.length; i++) {
            if (imgList[i] === $currentSelectedItm) {
                prevSelectedIdx = i;
                break;
            }
        }
        //reset the new selected item.
        $rootNode.find( ".mmf2-review-pane-img-contain.mmf2-review-pane-selected").removeClass("mmf2-review-pane-selected"); //remove current selected image
        self.setAttribute("class", "mmf2-review-pane-img-contain mmf2-review-pane-selected"); //set it selected.

        //get imageId for the selected one.
        imageId =  "{" + $(self).find(".mmf2-thumb").attr("id") + "}";  //get image id and add {} since it was removed when setting id

        //find index of the new selected item from the image tray
        imgList = $rootNode.find( "#mmf2ReviewPaneNavContent" + compId)[0].children;
        for(var i=0; i< imgList.length; i++) {
            if (imgList[i] === self) {
                newSelectedIdx = i;
                break;
            }
        }

        //Reset active-slide for the image on the Image Content Section by looking for the same index of the selected image from the tray
        var imgSlideList = $rootNode.find("#mmfgal-o2"+ compId + "reviewPaneImgNavContent")[0].children;
        for(var i=0; i< imgSlideList.length; i++) {
            if (i === newSelectedIdx) { //found the index on the image content section
                $rootNode.find(".active-slide").removeClass("active-slide"); //remove the previous active
                $(imgSlideList[i]).addClass("active-slide");
                component.setSelectedIdxOnReviewPane(newSelectedIdx); //reset the current index of the active-slide/selected image
                break;
            }
        }

        //automatically scroll/animate the image content to the active-slide by looking for the index of the active-slide
        //then calculate the pixels to scroll by difference from the old to the new active-slide
        var scrollDirection = newSelectedIdx - prevSelectedIdx;
        var imgContentScrollLeft = $("#mmfgal-o2" + compId + "rpImgContentContainer").width() + 8;
        var $mgReviewImgPrevNavId = $("#mmfgal-o2" + compId + "reviewImgPrevNav");
        var $mgReviewImgNxtNavId = $("#mmfgal-o2" + compId + "reviewImgNxtNav");
        if (scrollDirection < 0) { // scrollDirection is negative, need to scroll to previous (left)
            scrollLeftValue = (scrollDirection * (imgContentScrollLeft) *(-1)) + "px";
            $("#mmfgal-o2" + compId + "reviewPaneImgNavContent").animate({
                scrollLeft: '-=' + scrollLeftValue
            });

            //find the slide previous to active-slide --------------------------------
            var $prevSlide = $rootNode.find( ".mmf2-review-pane-img-content-container.active-slide").prev();
            //if there is no hidden previous slide, remove the previous button.
            if ($prevSlide.length === 0) {
                $mgReviewImgPrevNavId.removeClass("mmf2-review-pane-img-prev-nav");
            }
            //since it has been scrolled to left, it should have the next arrow background icon displayed
            if ($mgReviewImgNxtNavId.hasClass("mmf2-review-pane-img-nxt-nav") === false) {
                $mgReviewImgNxtNavId.addClass("mmf2-review-pane-img-nxt-nav");
            }
        }
        else if (scrollDirection  > 0){ //need to scroll to next (right)
            scrollLeftValue = (scrollDirection * (imgContentScrollLeft)) +"px";
            $("#mmfgal-o2" + compId + "reviewPaneImgNavContent").animate({
                scrollLeft: '+=' + scrollLeftValue
            });

            //find the slide next to active-slide --------------------------------
            var $nextSlide = $rootNode.find( ".mmf2-review-pane-img-content-container.active-slide").next();
            //if there is no hidden next slide, remove the next button.
            if ($nextSlide.length === 0) {
                $mgReviewImgNxtNavId.removeClass("mmf2-review-pane-img-nxt-nav");
            }
            //since it has been scrolled to next, it should have the prev arrow background icon displayed
            if ($mgReviewImgPrevNavId.hasClass("mmf2-review-pane-img-prev-nav") === false) {
                $mgReviewImgPrevNavId.addClass("mmf2-review-pane-img-prev-nav");
            }
        }
        //if scrollDirection = 0: nothing changed. user clicked on same selected image thumbnail.
    }
    else { //this is when user select navigate from the Image Area next/previous
        var $newSelected = {};
        var rpNavContentClientWidth = $rootNode.find( "#mmf2ReviewPaneNavContent" + compId)[0].clientWidth; //width of image tray content
        var rpNavContentOffsetLeft = $rootNode.find( "#mmf2ReviewPaneNavContent" + compId)[0].offsetLeft; //left offset of image tray content
        //find the new selected item by using the direction from the current selected one.
        if (directionInd === "N" ) {
            $newSelected = $rootNode.find( ".mmf2-review-pane-img-contain.mmf2-review-pane-selected").next();
        }
        else { //"P"
            $newSelected = $rootNode.find( ".mmf2-review-pane-img-contain.mmf2-review-pane-selected").prev();
        }

        //------------On the image tray, reset the new selected item, and determine if it is needed to scroll to view and hide/show the prev/next button accordingly
        if ($newSelected[0]) {
            //reset the selected item
            $rootNode.find( ".mmf2-review-pane-img-contain.mmf2-review-pane-selected").removeClass("mmf2-review-pane-selected"); //remove current selected image
            $newSelected.addClass("mmf2-review-pane-selected"); //set the new selected image
            imageId = "{" + $newSelected.find(".mmf2-thumb")[0].id + "}"; //get imageId for the selected item

            //Determine If it needs to automatically scroll to left/right
            var offsetLeftOfSelected = $newSelected[0].offsetLeft;
            var clientWidthOfSelected = $newSelected[0].clientWidth;
            var $mgReviewPrevNavId = $("#mmfgal-o2" + compId + "reviewPrevNav");
            var $mgReviewNxtNavId = $("#mmfgal-o2" + compId + "reviewNxtNav");

            if (directionInd === "N" && ((offsetLeftOfSelected + clientWidthOfSelected) > rpNavContentClientWidth )) { //scroll left to see the hidden next image thumbnails
                scrollLeftValue = (offsetLeftOfSelected + clientWidthOfSelected) - rpNavContentClientWidth + 10 + "px";
                $("#mmf2ReviewPaneNavContent" + compId).animate({
                    scrollLeft: '+=' + scrollLeftValue
                });

                //-------------check to see if there are no next hidden image thumbnails, then remove the right arrow button-------------------
                //find the next image thumbnail.
                var $nextImgThumb= $rootNode.find( ".mmf2-review-pane-img-contain.mmf2-review-pane-selected").next();
                if ($nextImgThumb.length === 0) {  //no more next hidden image thumbnail, remove the right arrow button
                    $mgReviewNxtNavId.removeClass("mmf2-review-pane-nxt-nav-active mmf2-review-pane-nxt-nav");
                }
                //Since it has been scrolled to right, so add the previous arrow background icon if it has not been displayed
                if ($mgReviewPrevNavId.hasClass("mmf2-review-pane-prev-nav") === false) {
                    $mgReviewPrevNavId.addClass("mmf2-review-pane-prev-nav");
                }
            }
            else if (directionInd === "P" && (offsetLeftOfSelected - clientWidthOfSelected < clientWidthOfSelected)) { //need to scroll right to see the hidden previous image thumbnails
                scrollLeftValue = clientWidthOfSelected - (offsetLeftOfSelected - clientWidthOfSelected) + 50 + "px";
                $("#mmf2ReviewPaneNavContent" + compId).animate({
                    scrollLeft: '-=' + scrollLeftValue
                });
                //-------------check to see if there are no previous hidden image thumbnails, then remove the left arrow button-------------------
                //find the previous image thumbnail from the selected one
                var $prevImgThumb= $rootNode.find( ".mmf2-review-pane-img-contain.mmf2-review-pane-selected").prev();
                if ($prevImgThumb.length === 0) {  //no more prev hidden image, remove the prev arrow button
                    $mgReviewPrevNavId.removeClass("mmf2-review-pane-prev-nav-active mmf2-review-pane-prev-nav");
                }
                //Since it has been scrolled to left, so add the prev arrow background icon if it has not been displayed
                if ($mgReviewNxtNavId.hasClass("mmf2-review-pane-nxt-nav") === false) {
                    $mgReviewNxtNavId.addClass("mmf2-review-pane-nxt-nav");
                }
            }
        }
    }

    //populate the image details.
    var sImageDetailHTML =  component.populateDetails(imageId); //generate details info
    var $detailsBody = $rootNode.find( ".mmf2-review-pane-right-details-body"); //find the details section

    //Reset to display the details info for the selected image on the details body section.
    $detailsBody.empty();
    $(sImageDetailHTML).appendTo($detailsBody);

  //Get image name for selected image on the Edit tab
  component.getImgNameOnRpEditTab (imageId);
  //Display the Readonly message according to the media is read only or not.
  component.displayReadOnlyMessage(imageId);

  component.addCanvas(compId);
};

/**
 * This function will generate a string of HTML structure for the Image Content area (left body section of the Review Pane).
 * @param {number} itemSelectedCnt Number of selected images to be displayed in the review pane.
 * @return{String} the HTML string for Image Content section
 */
MediaGalleryO2Component.prototype.generateHTMLrpImageContentArea = function(itemSelectedCnt) {
    var sHTMLrpImageContentArea = "";
    var component = this;
    var compId   = component.getComponentId();

    sHTMLrpImageContentArea += "<div class='mmf2-review-pane-left-body' id = 'mmfgal-o2" + compId + "rpLeftBody'>"; //Left body content

    //image content navigator --------------------------------------------
    sHTMLrpImageContentArea += "<div class='mmf2-review-pane-img-nav-container' id='mmfgal-o2" + compId + "reviewImgNavContainer'>";
    sHTMLrpImageContentArea += "<div class='mmf2-review-pane-img-nxt-nav-area' id='mmfgal-o2" + compId + "reviewImgNxtNavArea'>"; //next nav area div
    if (itemSelectedCnt > 1) {//if there are more than 1 image slide, then display the next arrow button
        sHTMLrpImageContentArea += "<div class='mmf2-review-pane-img-nav-btns  mmf2-review-pane-img-nxt-nav' id='mmfgal-o2" + compId + "reviewImgNxtNav'>&nbsp;</div>";//next button
    }
    else {
        sHTMLrpImageContentArea += "<div class='mmf2-review-pane-img-nav-btns' id='mmfgal-o2" + compId + "reviewImgNxtNav'>&nbsp;</div>";//next button
    }
    sHTMLrpImageContentArea += "</div>"; //close img next nav area div
    sHTMLrpImageContentArea += "<div class='mmf2-review-pane-img-prev-nav-area' id='mmfgal-o2" + compId + "reviewImgPrevNavArea'>"; //prev nav area div

    sHTMLrpImageContentArea += "<div class='mmf2-review-pane-img-nav-btns' id='mmfgal-o2" + compId + "reviewImgPrevNav'>&nbsp;</div>"; //previous button
    sHTMLrpImageContentArea += "</div>"; //close img prev nav area div
    sHTMLrpImageContentArea += "<div class='mmf2-review-pane-img-nav-content'  id='mmfgal-o2" + compId + "reviewPaneImgNavContent'></div>"; //navigation content
    sHTMLrpImageContentArea += "</div>"; //close img-nav-content div
    //end image content navigator-----------------------------------------
    sHTMLrpImageContentArea += "</div>"; //close div left body content
    return sHTMLrpImageContentArea;
};

/**
 * generateHTMLrpFootViewSection
 * This function will generate a string of HTML structure for the View Button section (the child of the left foot section of the Review Pane).
 * @returns {String} the HTML string for View button section
 */
MediaGalleryO2Component.prototype.generateHTMLrpFootViewSection = function() {
    var component = this;
  var sHTMLrpViewBtnSection = "";
    var mmfgalO2compId = "mmfgal-o2" + component.getComponentId();

    sHTMLrpViewBtnSection += "<div class='mmf2-review-pane-view-sec' id = '" + mmfgalO2compId + "rpViewSection'>";
    sHTMLrpViewBtnSection += "<button class='mmf2-review-pane-view-btn' id = '" + mmfgalO2compId + "rpViewBtn' title='" + component.mmf2I18n.VIEW + "'>" + component.mmf2I18n.VIEW + "...</button>";
    sHTMLrpViewBtnSection += "</div>"; //close view section div

    return sHTMLrpViewBtnSection;
};

/**
 * isCanvasSupported
 * This function will check if the canvas element is supported.
 * @returns {bool} True if supported. False otherwise
 */
MediaGalleryO2Component.prototype.isCanvasSupported = function(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
};

/**
 * generateHTMLrpRightBodySection
 * This function will generate a string of HTML structure for the tab section on the right section (the child of the right foot section of the Review Pane).
 * @param {String} sSelectedImageId An image id of the selected image on the review pane.
 * @returns {String} the HTML string for tab section on the right review pane.
 */
MediaGalleryO2Component.prototype.generateHTMLrpRightBodySection = function(sSelectedImageId) {
  var component = this;
  var sHTMLrpRightBodySection = "";
  var sImageDetailHTML = "";
  var mmfgalO2compId = "mmfgal-o2" + component.getComponentId();

  //Generate a tab-wrap div with a tabs div contains 2 tabs elements: Details and Edit.
  sHTMLrpRightBodySection += "<div class='mmf2-review-pane-tab-wrap'>";
  sHTMLrpRightBodySection += "<div class='mmf2-review-pane-tabs'>";
  sHTMLrpRightBodySection += "<ul>";

  //display each tab as left edge/center/right edge with the image background to have the round edge layout.
  sHTMLrpRightBodySection += "<li><a name='tab' id='" + mmfgalO2compId + "tab1' class='mmf2-review-pane-tab active'>";
  sHTMLrpRightBodySection += "<span class='mmf2-tab-left-edge'>&nbsp;</span><span class='mmf2-tab-text'>" + i18n.DETAILS + "</span><span class='mmf2-tab-right-edge'>&nbsp;</span></a></li>";
  sHTMLrpRightBodySection += "<li><a name='tab' id='" + mmfgalO2compId + "tab2' class='mmf2-review-pane-tab'>";
  sHTMLrpRightBodySection += "<span class='mmf2-tab-left-edge'>&nbsp;</span><span class='mmf2-tab-text'>" + component.mmf2I18n.EDIT + "</span><span class='mmf2-tab-right-edge'>&nbsp;</span></a></li>";


  sHTMLrpRightBodySection += "</ul>";
  sHTMLrpRightBodySection += "</div>"; //close tabs div

  sHTMLrpRightBodySection += "<hr class='mmf2-review-pane-tab-wrap-hr'>"; //line separator for tabs

  //Begin the Details tab content (tab 1)
  sHTMLrpRightBodySection += "<div name='tab_content' id='" + mmfgalO2compId + "tabContent1' class='mmf2-review-pane-tab-content active'>";

  //begin the Details tab content
  sHTMLrpRightBodySection += "<div class='mmf2-review-pane-right-details-body'>"; //the details content
    //Populate details info for the given selected image.
    sImageDetailHTML = component.populateDetails(sSelectedImageId);
    sHTMLrpRightBodySection += sImageDetailHTML;
    sHTMLrpRightBodySection += "</div>"; //end the details body tab div
  sHTMLrpRightBodySection += "</div>"; //close the tabContent1 div

  //begin the Edit tab content (tab 2)
  sHTMLrpRightBodySection += "<div name='tab_content' id='" + mmfgalO2compId + "tabContent2' class='mmf2-review-pane-tab-content'>";

  sHTMLrpRightBodySection += "<div class='mmf2-review-pane-right-edit-body'>"; //the Edit content
  //Populate Edit info for the 1st selected image from the component list by default.
  sHTMLrpRightBodySection += component.generateHtmlRpEditTab(sSelectedImageId);
  sHTMLrpRightBodySection += "</div>"; //end the Edit body tab div
  sHTMLrpRightBodySection += "</div>"; //end the Edit content tab div
  sHTMLrpRightBodySection += "</div>"; //close the tab-wrap div

  return sHTMLrpRightBodySection;
};

/**
 * generateHtmlRpEditTab
 * This function will generate a string of HTML structure for the Edit tab content on the review pane-right section.
 * @param {String} sSelectedImageId an image id of the selected image on the review pane.
 * @returns {String} the HTML string for the Edit tab content.
 */
MediaGalleryO2Component.prototype.generateHtmlRpEditTab = function(sSelectedImageId) {
  var component = this;
  var sHtmlRpEditTabContent = "";
    var mmfgalO2compId = "mmfgal-o2" + component.getComponentId();
  var imageName = "";
  var imgObj = null;
  var contentIsReadOnly = component.isContentReadOnly(sSelectedImageId); //check if media is Read only

  imgObj = component.getImageObjById(sSelectedImageId);

  if (imgObj) {
    imageName = imgObj.description;
  }

  //display image name on top of edit tab
    sHtmlRpEditTabContent += "<div class='mmf2-review-pane-edit-image-name'>" + imageName + "</div>";
  sHtmlRpEditTabContent += "<hr class='mmf2-review-pane-edit-line-separator'>";
  //generate alert message Content is Read-only and set display/none according to the contentIdReadOnly.
  sHtmlRpEditTabContent += component.generateHTMLContentReadOnly(contentIsReadOnly);

    if(component.isCanvasSupported()){
        //display Orientation Tools fieldset
        sHtmlRpEditTabContent += "<fieldset class='mmf2-review-pane-edit-tools-fieldset'>";
        sHtmlRpEditTabContent += "<legend class='mmf2-review-pane-edit-tools-legend'>" + component.mmf2I18n.ORIENTATION_TOOLS + "</legend>";

        //display the tools section that has 4 toolbar icons
        sHtmlRpEditTabContent += "<div class='mmf2-review-pane-edit-tools-sec'>";
        sHtmlRpEditTabContent += "<ul class='mmf2-review-pane-edit-tools'>";
        sHtmlRpEditTabContent += "<li class='mmf2-review-pane-edit-btn mmf2-review-pane-rotate-left' title='" + component.mmf2I18n.ROTATE_COUNTERCLOCKWISE + "'></li>";
        sHtmlRpEditTabContent += "<li class='mmf2-review-pane-edit-btn mmf2-review-pane-rotate-right' title='" + component.mmf2I18n.ROTATE_CLOCKWISE + "'></li>";
        sHtmlRpEditTabContent += "<li class='mmf2-review-pane-edit-btn mmf2-review-pane-flip-horizontal' title='" + component.mmf2I18n.FLIP_HORIZONTALLY + "'></li>";
        sHtmlRpEditTabContent += "<li class='mmf2-review-pane-edit-btn mmf2-review-pane-flip-vertical' title='" + component.mmf2I18n.FLIP_VERTICALLY + "'></li></ul></div>";
        sHtmlRpEditTabContent += "</fieldset>";
    }else{
        MP_Util.LogInfo("isCanvasSupported: canvas is not supported");
    }

  //Button section for Save and Cancel:
  sHtmlRpEditTabContent += "<div class='mmf2-review-pane-edit-btn-sec' id='" + mmfgalO2compId + "rpEditButtonSection'>";
  sHtmlRpEditTabContent += "<button class='mmf2-review-pane-edit-reset-btn' id='" + mmfgalO2compId + "rpEditResetBtn' disabled='true' title ='" + component.mmf2I18n.RESET + "'>" + component.mmf2I18n.RESET + "</button>";
  sHtmlRpEditTabContent += "<button class='mmf2-review-pane-edit-save-btn' id='" + mmfgalO2compId + "rpEditSaveBtn' disabled='true' title ='" + component.mmf2I18n.SAVE_CHANGES + "'>" + component.mmf2I18n.SAVE + "</button>";
  sHtmlRpEditTabContent += "</div>"; //close button section div

  return sHtmlRpEditTabContent;
};

/**
 * getImgNameOnRpEditTab
 * This function will get the image name for a given image id on the Edit tab content of the review pane-right section .
 * @param {String} sImageId An image id of the selected image on the review pane.
 * @returns {Undefined} nothing
 */
MediaGalleryO2Component.prototype.getImgNameOnRpEditTab = function(sImageId) {
  var component = this;
  var imageName = "";
  var imgObj = null;

  //get image object for the given image id.
  imgObj = component.getImageObjById(sImageId);

  //get image name
  if (imgObj) {
    imageName = imgObj.description;
  }

  var $imgNameOnEditTab = component.$rootNode.find(".mmf2-review-pane-edit-image-name"); //find the image name layout on edit tab.
  $imgNameOnEditTab.html(imageName); //reset the image name display.
};

/**
 * populateImageContentOnReviewPane
 * This function will get the selected images from the main content and display in the image content (larger size, not thumbnail one)
 * on the Image Content area (left body section of the Review Pane).
 * It will call CAMM/REST service URI to get the image content (i.e. http://iptmpwas01/camm-mpage/provide.northamerica.cerner.net/service/asImage/{c7-2e-00-c4-53-7f-4f-14-91-38-1a-9d-ae-a0-60-6f}?height=500&width=500'>)
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.populateImageContentOnReviewPane = function() {
    var component = this;
    var compId   = component.getComponentId();
    var $reviewPaneImgContentContainer= "";
    var sHTMLrpImgContentContainer = "";
    var imageListing = component.getPatientImages(); //get the list of image objects
    var tempMediaObj = {};
    var imageTypeList = component.getMineTypeList(); //get the list of mine type that are image type such jpeg, png, bmp...
    var imageType = {};

    var rpImgNavContentWidth = $("#mmfgal-o2" + compId + "reviewPaneImgNavContent").width();
    var rpImgNavContentHeight = $("#mmfgal-o2" + compId + "reviewPaneImgNavContent").height() - 10;

    //Find all of the selected image thumbnails from the Main content, then make a copy set
    //so that they can be added into the image content list (left body section) on the Review Pane.
    var imgNodes = component.$rootNode.find( ".mmf2-imgContain.mmf2-selected .mmf2-thumb").clone();
    //For each of image node, create a div container and add it in.
    for(var cnt = 0; cnt < imgNodes.length; cnt++){
        if (cnt > 0) {
            sHTMLrpImgContentContainer = '<div class="mmf2-review-pane-img-content-container" id = "mmfgal-o2'+ compId+ 'rpImgContentContainer" ' +
                                         'style ="height: '+ rpImgNavContentHeight + 'px; width:' + rpImgNavContentWidth+ 'px;">'; //create a div container for each image content (large image)
        }
        else { //set the first image to be active slide/selected by default;
            sHTMLrpImgContentContainer = '<div class="mmf2-review-pane-img-content-container active-slide" id = "mmfgal-o2'+ compId+ 'rpImgContentContainer' +
                                            '" style ="height: '+ rpImgNavContentHeight + 'px; width:' + rpImgNavContentWidth+ 'px;">'; //create a div container for each image content (large image)
            component.setSelectedIdxOnReviewPane(0); //set the current active-slide/selected image
        }
        $reviewPaneImgContentContainer = $(sHTMLrpImgContentContainer);
        var imgId = imgNodes[cnt].id;

        //Find the image object for the selected image to get the mineType (media type)
        var mediaArray = $.grep(imageListing, function(mediaObj) {
              return mediaObj.imageId === "{" + imgId + "}"; //the id of image matched the id of selected image
        });

        //Check to see mineType of the selected image is the image type.
        if (mediaArray.length > 0) { //logically, it needs to check, but it should be always 1 only
            tempMediaObj = mediaArray[0];
            imageType = $.grep(imageTypeList, function(imgType) {
                return imgType === tempMediaObj.mimeType; //look for the same mineType
            });
        }

        var $imageContentNode = imgNodes[cnt]; //this will copy reference so change in imageContentNode will change the imgNodes also
        //check if imageType is found, then display image as the full content by setting src of URI using CAMM asImage service
        //If it is not image type, then display as thumbnail size which is currently the same as the node was cloned from the Main content.
        if (imageType.length > 0) { //if it is image type, then display image content
            var imageContentSrc = component.getBaseURL() + "asImage/{" + imgId + "}?height=768&width=1024";
            var sHTML = "<img class='mmf2-thumb' id='" + imgId +"' src='" + imageContentSrc + "'>";
            $imageContentNode.src = imageContentSrc;
        }
        //else it is not image type, there is not need to reset the src , display src as thumbnail which is already set from the imgNode[]
        $reviewPaneImgContentContainer.append($imageContentNode).appendTo('#mmfgal-o2' + compId + 'reviewPaneImgNavContent'); //add image on the image content list (navigator content div)
    }
};

/**
 * handleEventsForImgContentNav
 * This function will handle the click, mouseover, mouseout events for the Image Asset (Prev/Next buttons) on the Image Content Section
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.handleEventsForImgContentNav = function() {
    var component = this;
    var compId   = component.getComponentId();
    var mmfgalO2compId = "#mmfgal-o2" + compId;
    var $mgReviewImgNxtNavAreaId = $(mmfgalO2compId + "reviewImgNxtNavArea");
    var $mgReviewImgPrevNavAreaId = $(mmfgalO2compId + "reviewImgPrevNavArea");
    var $mgReviewImgPrevNavId = $(mmfgalO2compId + "reviewImgPrevNav");
    var $mgReviewImgNxtNavId = $(mmfgalO2compId + "reviewImgNxtNav");

    //Click event for the previous button (left arrow) to scroll right to show previous image content (large image) on the left of image content's list
    $mgReviewImgPrevNavAreaId.click(function () {
      if($mgReviewImgPrevNavId.hasClass("mmf2-review-pane-img-prev-nav-hover")){
        component.displayUnsavedModalDialog(compId, function(){
          component.removeCanvas(compId);
          component.displayPrevImageContentInReviewPane(); //function call to display previous image
        });
      }
    });

    //Click event for Next Navigator Area to scroll left to show next images on the right of image list
    $mgReviewImgNxtNavAreaId.click(function () {
      if($mgReviewImgNxtNavId.hasClass("mmf2-review-pane-img-nxt-nav-hover")){
        component.displayUnsavedModalDialog(compId, function(){
          component.removeCanvas(compId);
          component.displayNextImageContentInReviewPane();//function call to display next image
        });
      }
    });

    //MouseOver event on the Image Previous Navigator to display the hover icon
    $mgReviewImgPrevNavAreaId.mouseover(function() {
        if ($mgReviewImgPrevNavId.hasClass("mmf2-review-pane-img-prev-nav")) {
            $mgReviewImgPrevNavId.removeClass("mmf2-review-pane-img-prev-nav").addClass("mmf2-review-pane-img-prev-nav-hover");
        }
    }).mouseout(function() {////MouseOut event on the Image Previous Navigator to display the normal icon
        if ($mgReviewImgPrevNavId.hasClass("mmf2-review-pane-img-prev-nav-hover")) {
           $mgReviewImgPrevNavId.removeClass("mmf2-review-pane-img-prev-nav-hover").addClass("mmf2-review-pane-img-prev-nav");
        }
    });


    //MouseOver event on the Image Next Navigator to display the hover icon
    $mgReviewImgNxtNavAreaId.mouseover(function() {
        if ($mgReviewImgNxtNavId.hasClass("mmf2-review-pane-img-nxt-nav")) {
            $mgReviewImgNxtNavId.removeClass("mmf2-review-pane-img-nxt-nav").addClass("mmf2-review-pane-img-nxt-nav-hover");
        }
    }).mouseout(function() {//MouseOut event on the Image Next Navigator to display the normal icon
        if ($mgReviewImgNxtNavId.hasClass("mmf2-review-pane-img-nxt-nav-hover")) {
           $mgReviewImgNxtNavId.removeClass("mmf2-review-pane-img-nxt-nav-hover").addClass("mmf2-review-pane-img-nxt-nav");
        }
    });
};

/**
 * displayNextImageContentInReviewPane
 * This function will handle the click of the Next button and Right arrow key on keyboard on the Image Content Section to display the next hidden image.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.displayNextImageContentInReviewPane = function() {
    var component = this;
    var compId   = component.getComponentId();
    var mmfgalO2compId = "#mmfgal-o2" + compId;
    var $mgReviewImgNxtNavAreaId = $(mmfgalO2compId + "reviewImgNxtNavArea");
    var $mgReviewImgPrevNavAreaId = $(mmfgalO2compId + "reviewImgPrevNavArea");
    var $mgReviewImgPrevNavId = $(mmfgalO2compId + "reviewImgPrevNav");
    var $mgReviewImgNxtNavId = $(mmfgalO2compId + "reviewImgNxtNav");
    var imgContentScrollLeft = $(mmfgalO2compId + "rpImgContentContainer").width() + 8 + "px";

    //Click event for Next Navigator Area/or Right arrow key to scroll left to show next images on the right of image list
    if ($mgReviewImgNxtNavId.hasClass("mmf2-review-pane-img-nxt-nav-hover") //if user clicks on the button while button is hovering
        || $mgReviewImgNxtNavId.hasClass("mmf2-review-pane-img-nxt-nav")) { //if user pressed key right on key board the button is not hovering status
        $(mmfgalO2compId + "reviewPaneImgNavContent").animate({
            scrollLeft: '+=' + imgContentScrollLeft
        });

        //find the slide next to the current active-slide
        var $nextSlide = component.$rootNode.find( ".mmf2-review-pane-img-content-container.active-slide").next();
        //reset the active-slide and determine to display/hide the next button
        if ($nextSlide.length > 0) {
            component.$rootNode.find( ".mmf2-review-pane-img-content-container.active-slide").removeClass("active-slide"); //remove current active slide
            $nextSlide.addClass("active-slide"); //set the next image as active slide
            component.setSelectedIdxOnReviewPane(component.getSelectedIdxOnReviewPane() + 1); //reset the current index of the active-slide/selected image by adding 1 to the old one
            component.selectImageOnReviewPane(compId, "N"); //automatically set the selected item on the image tray and populate details.
            if ($nextSlide.next().length === 0) {//if no more next hidden image from the current active-slide, remove the next button
                $mgReviewImgNxtNavId.removeClass("mmf2-review-pane-img-nxt-nav-hover"); //remove the next arrow background hover icon
                $mgReviewImgNxtNavId.removeClass("mmf2-review-pane-img-nxt-nav");  //or remove the next arrow background normal icon is user is not hovering.
            }
            //check if there is the prev hidden image, then add the prev arrow background icon
            if (!$mgReviewImgPrevNavId.hasClass("mmf2-review-pane-img-prev-nav")) {
                $mgReviewImgPrevNavId.addClass("mmf2-review-pane-img-prev-nav");
            }
        }
    }
};

/**
 * displayPrevImageContentInReviewPane
 * This function will handle the click of the Previous button and Left arrow key on keyboard on the Image Content Section to display the previous hidden image.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.displayPrevImageContentInReviewPane = function() {
    var component = this;
    var compId   = component.getComponentId();
    var mmfgalO2compId = "#mmfgal-o2" + compId;
    var $mgReviewImgNxtNavAreaId = $(mmfgalO2compId + "reviewImgNxtNavArea");
    var $mgReviewImgPrevNavAreaId = $(mmfgalO2compId + "reviewImgPrevNavArea");
    var $mgReviewImgPrevNavId = $(mmfgalO2compId + "reviewImgPrevNav");
    var $mgReviewImgNxtNavId = $(mmfgalO2compId + "reviewImgNxtNav");
    var imgContentScrollLeft = $(mmfgalO2compId + "rpImgContentContainer").width() + 8 + "px";

    //Click event for the previous button or left arrow key to scroll right to show previous image content (large image) on the left of image content's list
    if ($mgReviewImgPrevNavId.hasClass("mmf2-review-pane-img-prev-nav-hover") //user clicks on the prev button that button is hovering
        || $mgReviewImgPrevNavId.hasClass("mmf2-review-pane-img-prev-nav")) { //user pressed Left arrow key that button is not hovering status
        $(mmfgalO2compId + "reviewPaneImgNavContent").animate({
            scrollLeft: '-=' + imgContentScrollLeft
        });
        //find the slide previous to the current active-slide
        var $prevSlide = component.$rootNode.find( ".mmf2-review-pane-img-content-container.active-slide").prev();
        //reset the active-slide and determine it the next/prev buttons to display
        if ($prevSlide.length > 0) {
            component.$rootNode.find( ".mmf2-review-pane-img-content-container.active-slide").removeClass("active-slide"); //remove current active slide
            $prevSlide.addClass("active-slide"); //set the next image as active slide
            component.setSelectedIdxOnReviewPane(component.getSelectedIdxOnReviewPane() - 1); //reset the current index of the active-slide/selected image by substracting 1 from the old index
            component.selectImageOnReviewPane(compId, "P"); //automatically set selected image on the image tray with the asset image indicator is P as for Previous image from the tray list.
            if ($prevSlide.prev().length === 0) { //if no more prev hidden image from the active-slide, remove the prev button
                $mgReviewImgPrevNavId.removeClass("mmf2-review-pane-img-prev-nav-hover");
                $mgReviewImgPrevNavId.removeClass("mmf2-review-pane-img-prev-nav");
            }
            //check if there is the next hidden image, then add the next arrow background icon
            if (!$mgReviewImgNxtNavId.hasClass("mmf2-review-pane-img-nxt-nav")) {
                $mgReviewImgNxtNavId.addClass("mmf2-review-pane-img-nxt-nav");
            }
        }
    }
};

/**
 * expandNavPanel
 * This function will expand the Navigation Panel and update the navigation button icon to show the icon in expanded mode depending on
 * if header option in navigation panel is selected or not. This function is triggered when navigation button is clicked or when mouse enters the navigation panel.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.expandNavPanel = function(){
    var compId=this.getComponentId();
    var $navPaneBtnIcon = this.$rootNode.find('.mmf2-nav-button-icon');
    if(!$("#mmf2NavContent"+compId).is(':animated')){
        $("#mmf2NavContent"+compId).stop(true, true).animate({
            width: "200px"
        }, 700);

        if($navPaneBtnIcon.hasClass("mmf2-nav-unselected-collapsed")){
            $navPaneBtnIcon.removeClass("mmf2-nav-unselected-collapsed").addClass("mmf2-nav-unselected-expanded");
        }
        if($navPaneBtnIcon.hasClass("mmf2-nav-selected-collapsed")){
            $navPaneBtnIcon.removeClass("mmf2-nav-selected-collapsed").addClass("mmf2-nav-selected-expanded");
        }
    }
};

/**
 * collapseNavPanel
 * This function will collapse the Navigation Panel and update the navigation button icon to show the icon in collapsed mode depending on
 * if header option in navigation panel is selected or not. This function is triggered when navigation button is clicked or when mouse leaves the navigation panel.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.collapseNavPanel = function(){
    var compId=this.getComponentId();
    var $navPaneBtnIcon = this.$rootNode.find('.mmf2-nav-button-icon');
    if(!$("#mmf2NavContent"+compId).is(':animated')){
        $("#mmf2NavContent"+compId).stop(true, true).animate({
            width: "0px"
        }, 700);

        if($navPaneBtnIcon.hasClass("mmf2-nav-unselected-expanded")){
            $navPaneBtnIcon.removeClass("mmf2-nav-unselected-expanded").addClass("mmf2-nav-unselected-collapsed");
        }

        if($navPaneBtnIcon.hasClass("mmf2-nav-selected-expanded")){
            $navPaneBtnIcon.removeClass("mmf2-nav-selected-expanded").addClass("mmf2-nav-selected-collapsed");
        }
    }
};

/**
 * navPanelPinned
 * This function will pin the Navigation Panel by changing the direction of the pin downwards and update the padding of the content body to
 * show on right side of the navigation panel. This function is triggered when navigation pin is clicked.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.navPanelPinned = function(){
    var compId=this.getComponentId();
    var navPaneWidth = $("#mmf2NavPan"+compId).outerWidth() + 2 + "px";
    this.$rootNode.find(".mmf2-content-body").css("padding-left", navPaneWidth);
    $("#mmf2NavPanePin"+compId).addClass("mmf2-nav-pinned");
};

/**
 * navPanelUnpinned
 * This function will unpin the Navigation Panel by changing the direction of the pin to default position and update the padding of the content body to
 * show below the navigation panel. This function is triggered when navigation pin is clicked.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.navPanelUnpinned = function(){
    var compId=this.getComponentId();
    this.$rootNode.find(".mmf2-content-body").css("padding-left", "20px");
    $("#mmf2NavPanePin"+compId).removeClass("mmf2-nav-pinned");
    this.collapseNavPanel();
};

/**
 * rightClickHandler
 * Handle the event when the user right-clicks within the image area and section header/subgroup header.
 * it will display a context menu with the following items:
 * - View : will launch Media Viewer.
 * - Review: will launch Review Pane.
 * - Rename: will launch Rename dialogue.
 * - Inactivate: will launch the Inactivate warning window.
 * @param {jQuery.Event} event The jQuery click event that occurred.
 * @returns {UNDEFINED} Nothing
 */
MediaGalleryO2Component.prototype.rightClickHandler = function(event){
    var contextMenu = null;
    var rgtClickEvent = event;
    var self = this;
    var viewMenuSelection = null;
    var reviewMenuSelection = null;
    var renameMenuSelection = null;
    var inactivateMenuSelection = null;
    var compId=self.getComponentId();
    var catName = self.getCriterion().category_mean;
    var imageId = "";
    var $currentTarget = $(rgtClickEvent.currentTarget);
    var VIEW_MENU_IDX = 0;
    var REVIEW_MENU_IDX = 1;
    var RENAME_MENU_IDX = 2;
    var INACTIVATE_MENU_IDX = 3;

    try{
        //Catch the right click event
        if(rgtClickEvent.which === 3 || rgtClickEvent.button === 2){ //if it is right click event
            if ($currentTarget.is(".sub-sec-hd")) {//if it is clicked on the section header
                MediaGalleryO2Component.prototype.clearMediaSelection.apply(this, [compId]); //clear other selected items
                if ($currentTarget.parent().is(".sub-sec") === true) { //check if this is the section header
                    //for each image under this section header, mark it as selected
                    $currentTarget.next().find(".mmf2-imgContain").each(function(){
                        $(this).addClass("mmf2-selected");
                        imageId = $(this).find(".mmf2-thumb").attr("id");
                        MediaGalleryO2Component.prototype.enableActions.apply(this, [imageId, compId]);//set buttons enabled
                    });
                }
                else { //this is the subgroup (under section header) (NOTE: the parent)() is not sub-sec, it is result-info)
                    //for each image under this subgroup header, mark it as selected
                    $currentTarget.parent().siblings(".sub-sec-content").find(".mmf2-imgContain").each(function(){
                        $(this).addClass("mmf2-selected");
                        imageId = $(this).find(".mmf2-thumb").attr("id");
                        MediaGalleryO2Component.prototype.enableActions.apply(this, [imageId, compId]);//set buttons enabled
                    });
                }
            }
            else if ($currentTarget.is(".mmf2-image")) { //if it is clicked on the Image area
                if($(rgtClickEvent.target).closest(".mmf2-docs-menu", $currentTarget).length > 0){ //this will prevent the right click in the document list area
                    return;
                }
                //check if it is not currently selected, clear other selected items and make this one to be selected.
                if ($currentTarget.children().hasClass("mmf2-selected") === false) {
                    MediaGalleryO2Component.prototype.clearMediaSelection.apply(this, [compId]); //clear other selected items
                    $currentTarget.children(':first').addClass("mmf2-selected");            //add this item to be selected
                    imageId = $currentTarget.find(".mmf2-thumb").attr("id");
                    MediaGalleryO2Component.prototype.enableActions.apply(this, [imageId, compId]);//set buttons enabled
                }
            }
            else { //logically it needs to have else here, but it should not occur at this point since the delegate on() already filter out that.
                return;
            }

            $(".hvr.hover").hide(); //manually hide hover if it is displaying
            self.setEditMode(true); //set to edit mode to stop showing hover (When true, tooltips cannot display)

            //Create Context Menu------------------------------------------------------------------------------------------------
            contextMenu = MP_MenuManager.getMenuObject("MediaGalleryO2ContextMenu");
            if(!contextMenu){
                contextMenu = new ContextMenu("MediaGalleryO2ContextMenu").setIsRootMenu(true).setAnchorElementId("MediaGalleryO2ContextMenuAnchor").setAnchorConnectionCorner(["bottom", "left"]).setContentConnectionCorner(["top", "left"]);
                //View menu item
                viewMenuSelection = new MenuSelection("viewMenuSelection").setLabel(self.mmf2I18n.VIEW).setIsSelected(true).setSelectedClass("");
                contextMenu.addMenuItem(viewMenuSelection);
                //Review menu item
                reviewMenuSelection = new MenuSelection("reviewMenuSelection").setLabel(self.mmf2I18n.REVIEW_BTN).setIsSelected(true).setSelectedClass("");
                contextMenu.addMenuItem(reviewMenuSelection);
                //Rename menu item
                renameMenuSelection = new MenuSelection("renameMenuSelection").setLabel(self.mmf2I18n.RENAME_BTN);
                contextMenu.addMenuItem(renameMenuSelection);
                //Inactivate menu item
                inactivateMenuSelection = new MenuSelection("inactivateMenuSelection").setLabel(self.mmf2I18n.INACTIVATE);
                contextMenu.addMenuItem(inactivateMenuSelection);

                //Set the edit mode back once the right click menu closed.
                contextMenu.setCloseFunction(function(){
                     self.setEditMode(false); //set edit mode back so that the yellow hover is turned on back.
                });
                MP_MenuManager.addMenuObject(contextMenu);
            }
            //Get item menus from the contextMenu

            viewMenuSelection = contextMenu.getMenuItemArray()[VIEW_MENU_IDX];
            reviewMenuSelection = contextMenu.getMenuItemArray()[REVIEW_MENU_IDX];
            renameMenuSelection = contextMenu.getMenuItemArray()[RENAME_MENU_IDX];
            inactivateMenuSelection = contextMenu.getMenuItemArray()[INACTIVATE_MENU_IDX];

            //enable/disable View menu item
            viewMenuSelection.setIsDisabled(_g("mgViewBtn" + compId).disabled);
            reviewMenuSelection.setIsDisabled(_g("mgReviewBtn" + compId).disabled);
            //enable/disable Rename menu item
            renameMenuSelection.setIsDisabled(_g("mgRenameBtn" + compId).disabled);
            //enable/disable Inactivate menu item
            inactivateMenuSelection.setIsDisabled(_g("mgInactivateBtn" + compId).disabled);

            //Set the click function for the View contextMenu to launch Media Viewer
            viewMenuSelection.setClickFunction(function(){
                MediaGalleryO2Component.prototype.launchMediaViewer.apply(this, [compId, self.m_MediaViewerURL, catName]);
                self.setEditMode(false); //set edit mode back so that the yellow hover is turned on back.
            });

            //Set the click function for the Rename contextMenu to rename selected media
            renameMenuSelection.setClickFunction(function(){
                MediaGalleryO2Component.prototype.renameMedia.apply(this, [compId]);
                self.setEditMode(false); //set edit mode back so that the yellow hover is turned on back.
            });

            //Set the click function for the Inactivate contextMenu to inactivate selected media
            inactivateMenuSelection.setClickFunction(function(){
                self.displayInactivateMediaWarnBox();
                self.setEditMode(false); //set edit mode back so that the yellow hover is turned on back.
            });

            //Set the click function for the Review contextMenu to display Review pane
            reviewMenuSelection.setClickFunction(function(){
                MediaGalleryO2Component.prototype.reviewMedia.apply(this, [compId]);
                self.setEditMode(false); //set edit mode back so that the yellow hover is turned on back.
            });

            //Update the x and y coordinates of the menu and set the anchor element
            contextMenu.setXOffset(event.pageX).setYOffset(event.pageY).setAnchorElement();
            MP_MenuManager.showMenu("MediaGalleryO2ContextMenu");
            contextMenu.removeAnchorElement();
        }//end if right click
    }
    catch(err){
        MP_Util.LogJSError(err, null, "mediagallery_o2.js", "rightClickHandler");
    }
};
/**
 * postProcessing
 * Appends any events onto the relevant objects
 * @returns {undefined} nothing
 */
MediaGalleryO2Component.prototype.postProcessing = function(){
    var $self, $scopeObj, $allHyperLinkImages, $currentImageObj;
    var catName = this.getCriterion().category_mean;
    $self = this;
    var compId = $self.getComponentId();
    var collapseTimer = null;
    var navPanePinned = false;
    
  var mmfgalO2compId = "#mmfgal-o2" + compId;

    //Find image link info, and apply click event to launch the Media Viewer
    $scopeObj = $("#" + this.m_rootComponentNode.id);
    //look for the image name link and date group link
    $allHyperLinkImages = $scopeObj.find(".mmf2-imageLaunchViewer, .mmf2-dateLinkLaunchViewer");

    for(var i = 0; i<$allHyperLinkImages.length; i++){
        $currentImageObj    = $allHyperLinkImages[i];
        var currentImgAttr = $($currentImageObj).attr("name");
        if(currentImgAttr !== null){
            $($currentImageObj).click({component: $self, imageIdStr: currentImgAttr}, function(event) {
                var eData = event.data;
                //launch Media Viewer with passing the media viewer, category name and image id.
                eData.component.launchMediaViewer(compId, eData.component.m_MediaViewerURL, catName, eData.imageIdStr);
            });
        }
    }

    var $imageContainer = $scopeObj.find(".mmf2-imgContain");
    var $imageName = $scopeObj.find(".mmf2-media-name");

    $imageContainer.width($self.m_thumbNailSize).height($self.m_thumbNailSize);
    $imageName.width($self.m_thumbNailSize);

    //delegate to change the size of the image container when the slider handle is changed.
    $("#mmf2ZoomBar"+ compId).change( function(event) {
        var size = parseInt($(this).val(), 10);
        $self.m_thumbNailSize = size;
        $imageContainer.width(size).height(size);
        $imageName.width(size);
    });
    //Event handlers for Inactivate button.
    $self.$rootNode.off( "click", "#mgInactivateBtn" + compId);
    $self.$rootNode.on( "click", "#mgInactivateBtn" + compId, {self: this}, this.displayInactivateMediaWarnBox);
    //Event handler to add closed class to the sub group header
    $self.$rootNode.off( "click", ".mmfgal-o2-info.result-info .sub-sec-hd-tgl");
    $self.$rootNode.on( "click", ".mmfgal-o2-info.result-info .sub-sec-hd-tgl", function(event) {
        $( event.target ).closest( ".sub-sec.mmf2-group" ).toggleClass( "closed");
    });
    //Add hot key F2 to rename media
    $scopeObj.keydown(function(e) {
        if(e.which === 113){//if F2 is pressed while the focus in on the component, display Rename dialog.
            if (_g("mgRenameBtn" + compId).disabled === false) {
                $self.renameMedia(compId);
            }
            Util.cancelBubble(); //to stop this event propagation in the event chain.
        }
    });

    //Add event right-click on the image area or the section header/sub group header to display context menu
    $self.$rootNode.off( "mousedown", ".mmf2-image, .sub-sec-hd");
    $self.$rootNode.on( "mousedown", ".mmf2-image, .sub-sec-hd", function(e, dataObj) {
        $self.rightClickHandler(e, dataObj);
        Util.cancelBubble();

    });

    $self.$rootNode.off("click", ".mmf2-review-pane-rotate-left");
    $self.$rootNode.on("click", ".mmf2-review-pane-rotate-left", function(){
        $self.rotateImage(compId, $self.ORIENTATION_TOOLS.ROTATE_LEFT);
        $self.setSaveButton(true);
        $self.setCancelButton(true);
    });

    $self.$rootNode.off("click", ".mmf2-review-pane-rotate-right");
    $self.$rootNode.on("click", ".mmf2-review-pane-rotate-right", function(){
        $self.rotateImage(compId, $self.ORIENTATION_TOOLS.ROTATE_RIGHT);
        $self.setSaveButton(true);
        $self.setCancelButton(true);
    });

    $self.$rootNode.off("click", ".mmf2-review-pane-flip-vertical");
    $self.$rootNode.on("click", ".mmf2-review-pane-flip-vertical", function(){
        $self.flipImage(compId, $self.ORIENTATION_TOOLS.FLIP_VERTICAL);
        $self.setSaveButton(true);
        $self.setCancelButton(true);
    });

    $self.$rootNode.off("click", ".mmf2-review-pane-flip-horizontal");
    $self.$rootNode.on("click", ".mmf2-review-pane-flip-horizontal", function(){
        $self.flipImage(compId, $self.ORIENTATION_TOOLS.FLIP_HORIZONTAL);
        $self.setSaveButton(true);
        $self.setCancelButton(true);
    });

    //Added event button click for Media Gallery button from the Review Pane to close the Review Pane and display the Main Content again
    this.$rootNode.off( "click", ".mmf2-review-pane-gallery-btn");
    this.$rootNode.on( "click", ".mmf2-review-pane-gallery-btn", function() {
      var button = this;
      $self.displayUnsavedModalDialog(compId, function(){
        $self.displayComponentContent.apply(button, [compId]);
      });
    });

    //Added event button click for View button from the Review Pane to launch Media Viewer
    this.$rootNode.off( "click", "#mmfgal-o2" + compId + "rpViewBtn");
    this.$rootNode.on( "click", "#mmfgal-o2" + compId + "rpViewBtn", function() {
        $self.viewFromReviewHandler();
    });


  //Added Click event on Tab1(Details tab) of the review pane.
  //reviewPaneTabsHandler
  this.$rootNode.off("click", "#mmfgal-o2" + compId + "tab1");
  this.$rootNode.on("click", "#mmfgal-o2" + compId + "tab1", function() {
    $self.displayUnsavedModalDialog(compId, function(){
      $self.reviewPaneTabsHandler(1);
      $self.removeCanvas(compId);
    });
  });

  //Added Click event on Tab2(Edit tab) of the review pane.
  this.$rootNode.off("click", "#mmfgal-o2" + compId + "tab2");
    this.$rootNode.on("click", "#mmfgal-o2" + compId + "tab2", function() {
    $self.reviewPaneTabsHandler(2);
    $self.resizeEditTabContent();
        $self.addCanvas(compId);
  });

  //Added Click event on Save button to save the canvas image for the active iamge on the review pane.
  this.$rootNode.off("click", mmfgalO2compId + "rpEditSaveBtn");
    this.$rootNode.on("click", mmfgalO2compId + "rpEditSaveBtn", function() {
    $self.saveEditImage();
  });


  //Added Click event on Cancel button to cancel the canvas image for the active image on the review pane.
  this.$rootNode.off("click", mmfgalO2compId + "rpEditResetBtn");
    this.$rootNode.on("click", mmfgalO2compId + "rpEditResetBtn", function() {
    $self.removeCanvas(compId); //this will display image original view and reset Save/cancel buttons
    $self.addCanvas(compId); //add new canvas back to be ready for a new edit.
  });

    var $groups = $self.$rootNode.find(".content-body.mmf2-content-body").children(".sub-sec");
    var $navPanelId = $("#mmf2NavPan"+compId);
    var $navPanelPinId = $("#mmf2NavPanePin"+compId);
    var $navPanelBtnId = $("#mmf2NavBtn"+compId);
    var $navPanelContentId = $("#mmf2NavContent"+compId);
    var $navPaneBtnIcon = $self.$rootNode.find('.mmf2-nav-button-icon');
    var $mmf2ContentBody = $self.$rootNode.find(".mmf2-content-body");

    //click event to select/unselect a row and filter groups based on the row selection
    $navPanelContentId.off( "click", ".mmf2-nav-row");
    $navPanelContentId.on( "click", ".mmf2-nav-row", function() {
        var $navPanelHeader = $self.$rootNode.find(".mmf2-nav-header");
        //check if the row is already selected, if yes then unselect the row, unhide all the groups which are hidden
        //change the navigation header to default color, change the button icon to default icon in expanded mode.
        if($(this).hasClass("mmf2-nav-selected-row")){
            $groups.removeClass("mmf2-force-hidden");
            $(this).removeClass("mmf2-nav-selected-row");
            $navPanelHeader.removeClass("mmf2-nav-header-selected");
            if($navPaneBtnIcon.hasClass("mmf2-nav-selected-expanded")){
                $navPaneBtnIcon.removeClass("mmf2-nav-selected-expanded").addClass("mmf2-nav-unselected-expanded");
            }
            if(!navPanePinned){
                $mmf2ContentBody.css("padding-left", "20px");
                $navPanelPinId.removeClass("mmf2-nav-pinned");
            }
        }
        //else if new row is selected-unselect the previously selected row, highlight the selected row and the navigation header,
        //hide all the groups, unhide the group which is selected, change the default icon of button to blue icon in expanded mode.
        else{
            var height = $(".mmf2-nav-panel").height();
            $mmf2ContentBody.css("height", height);
            $self.$rootNode.find(".mmf2-nav-selected-row").removeClass("mmf2-nav-selected-row");
            if($navPaneBtnIcon.hasClass("mmf2-nav-unselected-expanded")){
                $navPaneBtnIcon.removeClass("mmf2-nav-unselected-expanded").addClass("mmf2-nav-selected-expanded");
            }
            $navPanelHeader.addClass("mmf2-nav-header-selected");
            $(this).toggleClass("mmf2-nav-selected-row");
            var index = $(this).index();
            $groups.removeClass("mmf2-force-hidden");
            $groups.addClass("mmf2-force-hidden");
            $groups.eq(index).removeClass("mmf2-force-hidden");
            $self.navPanelPinned();
        }
    });

    var height = $mmf2ContentBody.height();
    $navPanelId.css("height", height);
    // click event for navigation panel button to expand/collapse the panel only when the panel isn't pinned
    $navPanelBtnId.off( "click");
    $navPanelBtnId.on("click", function(){
        if(!$navPanelPinId.hasClass("mmf2-nav-pinned")){
            if($navPaneBtnIcon.hasClass("mmf2-nav-unselected-collapsed") || $navPaneBtnIcon.hasClass("mmf2-nav-selected-collapsed")){
                $self.expandNavPanel();
            }
            else{
                $self.collapseNavPanel();
            }
        }
    });
    $navPanelPinId.off("click");
    // click event for navigation panel pin to pin/unpin the panel
    $navPanelPinId.on("click", function(){
        if(!$navPanelPinId.hasClass("mmf2-nav-pinned")){
            navPanePinned = true;
            $self.navPanelPinned();
        }
        else{
            navPanePinned = false;
            $self.navPanelUnpinned();
        }
    });
    $navPanelId.off("mouseleave,mouseenter");
    // mouseenter and mouseleave for navigation panel to expand/collapse the panel only when the panel isn't pinned
    $navPanelId.mouseleave(function() {
        if(!$navPanelPinId.hasClass("mmf2-nav-pinned")){
            if($navPaneBtnIcon.hasClass("mmf2-nav-unselected-expanded") || $navPaneBtnIcon.hasClass("mmf2-nav-selected-expanded")){
                collapseTimer = setTimeout(function(){
                    $self.collapseNavPanel();
                }, 500);
            }
        }
    }).mouseenter(function() {
         if (collapseTimer !== null) {
            clearTimeout(collapseTimer);
        }
     });    
     
};

/**
 * viewFromReviewHandler
 * This function will handle the click event for the View button button from Review pane to launch Media Viewer
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.viewFromReviewHandler = function(){
    var component = this;
  var catName = component.getCriterion().category_mean;
    var compId = component.getComponentId();
    var idList = component.m_imageIdSelectedList;
    var idListLen = idList.length;
    var imageIdStr = "";

    for(var i = 0; i < idListLen; i++) {
        var idStr = idList[i]; //this id contains the "" around it (i.e. "{0d-ef-8d-61-ed-3f-43-88-b6-64-7c-f3-0f-d1-5f-41}"
        //Set the right format for URI query to call media viewer for the list of images
        //as &identifier=<imageid> (i.e. &identifier={0d-ef-8d-61-ed-3f-43-88-b6-64-7c-f3-0f-d1-5f-41}&identifier={31-9e-c1-da-bb-23-4f-6b-81-c8-eb-ae-a1-21-05-a5}
        imageIdStr += "&identifier=" + idStr.substring(1, idStr.length - 1); //take out the "" for image id
    }
    component.launchMediaViewer(compId, component.m_MediaViewerURL, catName, imageIdStr);
};

/**
 * reviewPaneTabsHandler
 * This function will handle the click event for Tabs in review pane.
 * @param  {Number} nSelectedTab the tab number that is selected (i.e 1 or 2)
 * @returns {undefined} Nothing
 */
MediaGalleryO2Component.prototype.reviewPaneTabsHandler = function(nSelectedTab) {
  var component = this;
  var compId = component.getComponentId();
  var mmfgalO2compId = "mmfgal-o2" + compId;
  var x = 0;

  // Tab contents
  var sTabContent = mmfgalO2compId + "tabContent" + nSelectedTab;
  var contents = component.$rootNode.find(".mmf2-review-pane-tab-content");
  var contentsLen = contents.length;
  for(x = 0; x < contentsLen; x++) {
    if (contents[x].id === sTabContent) {
      $(contents[x]).css("display", "block");
    } else {
      $(contents[x]).css("display", "none");
    }
  }
  // tabs
  var sTab = mmfgalO2compId + "tab" + nSelectedTab;
  var tabs = component.$rootNode.find(".mmf2-review-pane-tabs").find("a");
  var tabLen = tabs.length;

  for(x = 0; x < tabLen; x++) {
    if (tabs[x].id === sTab) {
      $(tabs[x]).addClass("active");
    } else {
      $(tabs[x]).removeClass("active");
    }
  }
};

/**
 * isContentReadOnly
 * This function will determine whether or not the given media is a Read-only content. It is a Read-only content if:
 * 1. Its' maintain priv is false (user doesn't have maintain priv on the content type for this media).
 * 2. It has Related Documents (The media has been attached in any clinical documents)
 * 3. Its mineType is not image type (i.e. .pdf, .xml)
 * @param  {String} sImageId the image id that will be used to check for read-only (i.e. "{35-59-57-eb-f1-2d-48-2a-9a-94-d4-ce-14-89-94-8b}" )
 * @returns {boolean} True: it is read-only. False otherwise.
*/
MediaGalleryO2Component.prototype.isContentReadOnly = function(sImageId) {
  var component = this;
  var docDataObj = component.getDocDataForSelectedMedias(); //get related documents for all selected images.
  var imageTypeList = [];
  var imageType = {};
  var imgObj = null;
  var isReadOnly = false;

  //get image object for the given image id.
  imgObj = component.getImageObjById(sImageId);

  //check maintain priv
  if (imgObj.maintainPriv === "true"){
    //user has maintain priv, then check image type
    imageTypeList = component.getMineTypeList(); //get the list of mine type that are image type such jpeg, png, bmp...
    imageType = $.grep(imageTypeList, function(imgType) {
          return imgType === imgObj.mimeType; //look for the same mineType
        });
    //if it is not an image type OR has related docs so it is read-only
    if (imageType.length <= 0 || docDataObj[sImageId]) {
      isReadOnly = true;
    } else {
      isReadOnly = false;
    }
  }else{
    //no maintain priv, it is read-only content
    isReadOnly = true;
  }
  return isReadOnly;
};

/**
 * generateHTMLContentReadOnly
 * This function will generate HTML alert warning message "Content is Read only" and it set it to display or none according to the content is read only or not.
 * @param  {boolean} contentIsReadOnly True: it is read-only. False otherwise.
 * @returns {String} sHtml an HTML string for the alert read only message.
*/
MediaGalleryO2Component.prototype.generateHTMLContentReadOnly = function(contentIsReadOnly) {
  var sHtml = "";
  var component = this;
  var mmfgalO2compId = "mmfgal-o2" + component.getComponentId();
  var sStyleDisplay = "";

  if (contentIsReadOnly) {
    sStyleDisplay = "block";
  } else {
    sStyleDisplay = "none";
  }

  sHtml = "<div class='mmf2-review-pane-edit-msg-wrapper' id = '" + mmfgalO2compId + "contentReadOnly' style='display:" + sStyleDisplay + ";'>" +
        "<div class='mmf2-review-pane-edit-msg-content'>" +
          "<div class='mmf2-review-pane-edit-msg-notify'>" +
            "<div class='mmf2-review-pane-edit-msg-icon'>&nbsp;</div>" +
            "<div class='mmf2-review-pane-edit-msg-text'>" +
              "<span class='mmf2-review-pane-edit-msg-notify-primary'>" + component.mmf2I18n.CONTENT_IS_READ_ONLY + "</span>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>";
  return sHtml;
};

/**
 * displayReadOnlyMessage
 * This function will determine whether or not to display the alert warning message for the given media.
 * @param  {String} sImageId the image id that will be used to check for read-only (i.e. "{35-59-57-eb-f1-2d-48-2a-9a-94-d4-ce-14-89-94-8b}" )
 * @returns {UNDEFINED} Nothing
*/
MediaGalleryO2Component.prototype.displayReadOnlyMessage = function(sImageId) {
  var component = this;
  var contentReadOnly = component.isContentReadOnly(sImageId); //check to see if the media is read only content.
  var mmfgalO2CompIdContentReadOnly = "#mmfgal-o2" + component.getComponentId() + "contentReadOnly";

  if (contentReadOnly) {
    $(mmfgalO2CompIdContentReadOnly).css("display", "block"); //display alert warning message if it is read only.
  }else {
    $(mmfgalO2CompIdContentReadOnly).css("display", "none"); //hide the alert warning message if it is NOT read only.
  }
};

/**
 * displayUnsavedModalDialog
 * This function will display the unsaved modal dialog when the user attempts to perform an action that would clear the canvas.
 * The modal dialog would not be displayed if the content is a read only object.
 * @param {number} compId Component id.
 * @param {function} unsavedModalCallback the function to be performed if the user selects save, don't save, or the modal is not displayed at all.
 * @returns {undefined} n/a
 */
MediaGalleryO2Component.prototype.displayUnsavedModalDialog = function(compId, unsavedModalCallback){
    var component = MP_Util.GetCompObjById(compId);
    var mmfgalO2compId = "mmfgal-o2" + compId;
    //Set Modal Box Id
    var modalId = mmfgalO2compId + "-" + "unsavedChanges";
    //set Model Title
    var modalTitle = "Unsaved Changes";
    //image name
    var imageName = $("#" + mmfgalO2compId + "tabContent1 > div > div.mmf2-review-pane-detail-name").text();
    //modal string and replace {0} with imageName
    var modalString = component.mmf2I18n.UNSAVED_CHANGES.replace("{0}", imageName);
    //HTML content for the Modal Body
    var mBodyContent = "<div class='mmf2-dyn-modal-body-container'><div class='mmf2-icon-container mmf2-warning-icon'></div><div class='modal-text-container'><p>" + modalString + "</p></div></div>";

    //Retrieve the Modal object using modalId. Will have undefined as the value if modal object does not exist
    var mDialog = MP_ModalDialog.retrieveModalDialogObject(modalId);

    var isEditTabActive = ($("#" + mmfgalO2compId + "tab2").hasClass("active")) ? true : false;
    var unsavedChanges = !(document.getElementById(mmfgalO2compId + "rpEditResetBtn").disabled);

    if(mDialog) {
      MP_ModalDialog.closeModalDialog(modalId);
      MP_ModalDialog.deleteModalDialogObject(modalId);
    }

    var $mmfgalO2CompIdContentReadOnly = $("#mmfgal-o2" + compId + "contentReadOnly");
    var contentReadOnlyDisplay = $mmfgalO2CompIdContentReadOnly.css("display");
    var contentIsReadOnly = (contentReadOnlyDisplay === "block") ? true : false;

    if(isEditTabActive && unsavedChanges && !contentIsReadOnly){
      var closeButton = {};
      var applyButton = {};
      var discardButton = {};

      mDialog = new ModalDialog(modalId);
      mDialog.setHeaderTitle(modalTitle).setHasGrayBackground(true).setBodyElementId(modalId).setShowCloseIcon(true).setIsBodySizeFixed(false).setTopMarginPercentage(20).setBottomMarginPercentage(20).setLeftMarginPercentage(30).setRightMarginPercentage(30).setIconHoverText(modalTitle).setIconClass("warning-icon").setIsIconActive(true);

      applyButton = new ModalButton("save");
      applyButton.setText(component.mmf2I18n.SAVE).setIsDithered(false).setOnClickFunction(function(){
        component.saveEditImage();
        unsavedModalCallback();
      });

      discardButton = new ModalButton("doNotSave");
      discardButton.setText(component.mmf2I18n.DO_NOT_SAVE).setIsDithered(false).setOnClickFunction(function(){
        unsavedModalCallback();
      });

      closeButton = new ModalButton("cancel");
      closeButton.setText(component.mmf2I18n.CANCEL).setIsDithered(false).setOnClickFunction(function(){
          MP_ModalDialog.closeModalDialog(modalId);
      });

      mDialog.addFooterButton(applyButton);
      mDialog.addFooterButton(discardButton);
      mDialog.addFooterButton(closeButton);

      mDialog.setHeaderCloseFunction(function(){
          MP_ModalDialog.closeModalDialog(modalId);
      });
      MP_ModalDialog.addModalDialogObject(mDialog);

      MP_ModalDialog.showModalDialog(modalId);
      mDialog.setBodyHTML(mBodyContent);

      //On click event for the grey background to close the dialog box.
      $(".dyn-modal-div").click(function(event){
          MP_ModalDialog.closeModalDialog(modalId);
      });
    }else{
      unsavedModalCallback();
    }
};

/**
 * dataURItoBlob
 * This function will convert the Base64 string data URI to the binary Blob type.
 * @param {String} dataURI base64 string data URI from canvas data
 * @param {String} dataType Type of image in the dataURI (i.e. image/jpeg, image/png...)
 * @returns {Object} Blob Binary Blob data.
*/
MediaGalleryO2Component.prototype.dataURItoBlob = function(dataURI, dataType) {
  var binary = atob(dataURI.split(",")[1]),
    array = [];
  for(var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: dataType});
};

/**
 * saveEditImage
 * This function will call CAMM REST service API to save the edit image for the canvas data URI.
 * (i.g. http://localhost:8080/camm/service/PERSON_PHOTO/store?name=PatientName&mimeType=image%2fjpeg&personId=8041363 )
 * @returns {undefined} Nothing.
*/
MediaGalleryO2Component.prototype.saveEditImage = function(){
  var component = this;
  var personId = component.getPersonId();
  var mmfgalO2compId = "mmfgal-o2" + component.getComponentId();
  var $activeSlide = $(component.$rootNode.find(".active-slide").children()[0]); //find active slide element.
  var activeImageId = $activeSlide.attr("id"); //get image id from the active slide content.
  var sImageId = "{" + activeImageId + "}";

  var imgObj = component.getImageObjById(sImageId);

  //set URL to store image into the image's Content type key
  var storeURL = component.getBaseURL() + imgObj.contentTypeKey + "/store?personId=" + personId + "&identifier=" + sImageId + "&version=" + imgObj.versionNumber + "&mimeType=" + imgObj.mimeType;

  var fgCanvas = document.getElementById(mmfgalO2compId + "mmf2Canvas" + activeImageId); //get canvas element
  var imgData = component.dataURItoBlob(fgCanvas.toDataURL(imgObj.mimeType), imgObj.mimeType); //convert data to Binary content

  //Make an XMLHttpRequest call with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call
  try
  {
    logger.logMessage("mediagallery-o2.js: saveEditImage: url:" + storeURL);
    g_MediaGadgetO2XMLHttpRequestObj.open("POST", storeURL, false);
    if (CERN_Platform.inMillenniumContext()) {
      window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetO2XMLHttpRequestObj)";
    }

    g_MediaGadgetO2XMLHttpRequestObj.send(imgData); //send image binary date to store CAMM service repository
    if (g_MediaGadgetO2XMLHttpRequestObj.status === 200) { //successful
      //set the Save and cancel button disabled after image was saved.
      component.setSaveButton(false);
      component.setCancelButton(false);
    }
    else { //unsuccessful
      logger.logMessage("mediagallery-o2.js: saveEditImage: Failed to save changes:" + g_MediaGadgetO2XMLHttpRequestObj.status);
      component.displayErrorMsg();
    }
  }
  catch(err)
  {
    //on other error or on unsuccessful log error
	logger.logJSError(err, component, "mediagallery-o2.js", "saveEditImage");
    throw (err);
  }
};

/**
 * displayErrorMsg
 * This function will generate modal dialog error message.
 * @returns {undefined} Nothing
*/
MediaGalleryO2Component.prototype.displayErrorMsg = function() {
  var component = this;
    var mBodyContent = "<div class='warning-container" + "'><span class='message-info-text'>" + component.mmf2I18n.MSG_ERROR_SAVING_CHANGES + "</span></div>";
    var modalId = "MediaGalleryO2Error";
    var modalTitle = component.mmf2I18n.SAVE_CHANGES;
    //Retrieve the Modal object using modalId. Will have undefined as the value if modal object does not exist.
    var mDialog = MP_ModalDialog.retrieveModalDialogObject(modalId);
    var okButton = {};
    //If modal object is not available , create a new object.
    if (!mDialog) {
        mDialog = new ModalDialog(modalId);
        mDialog.setHeaderTitle(modalTitle).setBodyElementId(modalId).setShowCloseIcon(true).setIsBodySizeFixed(false).setTopMarginPercentage(20).setBottomMarginPercentage(20).setLeftMarginPercentage(40).setRightMarginPercentage(40);
        okButton = new ModalButton("OkButton");
        okButton.setText(i18n.discernabu.CONFIRM_OK).setIsDithered(false).setOnClickFunction(function() {
            MP_ModalDialog.closeModalDialog(modalId);
        });
        mDialog.addFooterButton(okButton);
        mDialog.setHeaderCloseFunction(function() {
            MP_ModalDialog.closeModalDialog(modalId);
        });
        MP_ModalDialog.addModalDialogObject(mDialog);
    }
    MP_ModalDialog.showModalDialog(modalId);
    mDialog.setBodyHTML(mBodyContent);
};

/**
 * calculateMaxImageDisplay
 * This function will calculate the max size of Image can be displayed in the image container (the viewable area)
 * @param {object} $imageContainer Jquery selector for image container
 * @param {object} image object that has the height and width.
 * @return {width: Number, height: Number}.
 */
MediaGalleryO2Component.prototype.calculateMaxImageDisplay = function($imageContainer, image){
  var containerWidth = $imageContainer.width();
  var containerHeight = $imageContainer.height();
  var imageWidth = image.width;
  var imageHeight = image.height;

  //check that we need to resize the image
  if (imageHeight > containerHeight || imageWidth > containerWidth) {
    imageHeight *= containerWidth / imageWidth;
    imageWidth = containerWidth;

    if(imageHeight > containerHeight) {
      imageWidth *= containerHeight / imageHeight;
      imageHeight = containerHeight;
    }
  }
  return {width: Math.floor(imageWidth), height: Math.floor(imageHeight)};
};


/**
 * Map the MMF Media Gallery option 2 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "WF_MMF_MED_GAL" filter
 */
MP_Util.setObjectDefinitionMapping("WF_MMF_MED_GAL", MediaGalleryO2Component);
