var g_MediaGadgetXMLHttpRequestObj = new XMLHttpRequest();
/**
 * Create the component style object which will be used to style various aspects of our component
 */
function MediaGalleryComponentStyle(){
    this.initByNamespace("mmfgal-o1");
}
MediaGalleryComponentStyle.inherits(ComponentStyle);
/**
 * @constructor
 * Initialize the Media Gallery summary (o1) component
 * @param {Criterion} criterion : The Criterion object which contains information needed to render the component.
 */
function MediaGalleryComponent(criterion){
    this.m_baseServiceURL = ""; 
    this.m_sURLParams = "" ;
    this.m_mediaStash = null;
    this.m_personId=0;
    this.m_viewableImageIds = [];
    this.setCriterion(criterion);
    this.setLookBackDropDown(true);
    this.setStyles(new MediaGalleryComponentStyle());
    this.clearTimeoutCount = 750;
    this.activelyHovering = false;
    this.docTimeout = null;
    this.m_MediaViewerURL = "";
    this.m_menuGroupBy = 0; //0: Group By Date, 1: Group By Content Type
    this.m_docData = []; //store related documents for images
    this.m_contentTypeFilterList = []; //store the list of Bedrock filtered content types
    this.rootNode$ = {};
    
    //Set the timer names so the architecture will create the correct timers for our use
    this.setComponentLoadTimerName("USR:MPG.MMF.GALLERY.01 _ load component");
    this.setComponentRenderTimerName("ENG:MPG.MMF.GALLERY.01 _ render component");
    //Make sure the architecture includes the result count when creating the count text
    this.setIncludeLineNumber(true);
    MediaGalleryComponent.method("openTab", function() {
        var criterion = this.getCriterion();
        var sParms = "/PERSONID=" + criterion.person_id + " /ENCNTRID=" + criterion.encntr_id + " /FIRSTTAB=^" + this.getLink() + "+^";
        APPLINK(0, criterion.executable, sParms);
    }); 
    
    MediaGalleryComponent.method("getPrefJson", function() {
        var json = {"GROUP_BY_PREF": this.m_menuGroupBy};
        return json;
    });
    
    this.mediaGalleryo1PrefObj = {
        MEDIA_GALLERY_PREFS: {}
    };
    
    //Add a listener for any Order action so we can refresh the component if a new order is added
    CERN_EventListener.addListener(this,EventListener.EVENT_ORDER_ACTION,this.retrieveComponentData,this);
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent object
 */
MediaGalleryComponent.prototype=new MPageComponent();
MediaGalleryComponent.prototype.constructor=MPageComponent;
MediaGalleryComponent.inherits(MPageComponent);

/* Supporting functions */
/**
 * Retrieve the components preferences.
 * @returns {object} Preference Object.
 */
MediaGalleryComponent.prototype.getPreferencesObj = function() {
    return MPageComponent.prototype.getPreferencesObj.call(this,null);
};

/**
 * Sets the URL paramaters used to determine which medias to retrieve.
 * @param {[string]} sURLParams : A URL string that will be used when retrieving medias.
 */
MediaGalleryComponent.prototype.setURLParams=function(sURLParams){
      this.m_sURLParams = sURLParams;
};

/**
 * Retrieves the URL paramaters that will be used when retrieving medias.
 * @return {[string]} A URL string that will be used when retrieving medias.
 */
MediaGalleryComponent.prototype.getURLParams=function(){
    return this.m_sURLParams;
};

/**
 * Retrieves the CAMM URL that will be used when retrieving medias.
 * @return {[string]} A URL string that will be used when retrieving medias.
 * (i.e. http://iptmpwas01/camm-mpage-1.0/provide.northamerica.cerner.net/service/)
 */
MediaGalleryComponent.prototype.getBaseURL=function(){
    return this.m_baseServiceURL;
};

/**
 * Sets the json object of medias used to determine when displaying component.
 * @param {[object]} media : A json object that will be used when displaying component.
 */
MediaGalleryComponent.prototype.setMediaStash=function(media){
    this.m_mediaStash = media;
};
/**
 * Retrieves the medias that will be used when displaying component.
 * @return {[object]} A json object that will be used when displaying component.
 */
MediaGalleryComponent.prototype.getMediaStash=function(){
    return this.m_mediaStash;
};
MediaGalleryComponent.prototype.setPersonId=function(personId){
    this.m_personId = personId;
};
MediaGalleryComponent.prototype.getPersonId=function(){
    return this.m_personId;
};
 
MediaGalleryComponent.prototype.imageRecord=function(imageId, description, serviceDate, contentType, imageURL, mimeType, groupId) {
      return {imageId: imageId, description: description, serviceDate: serviceDate, contentType: contentType, imageURL: imageURL, mimeType: mimeType, groupId: groupId};
}; 

/**
 * Sets the array of content type ids used when determining which content types to retrieve.
 * @param {[object]} contentTypes : An array of content type ids which will be used to determine which 
 * media objects to retrieve.
 */
MediaGalleryComponent.prototype.setContentTypes = function(contentTypes) {
    this.m_contentTypes = contentTypes;
};

/**
 * Retrieves the array of content type ids that will be used when retrieving media objects.
 * @return {[object]} An array of content type ids which will be used when retrieving media objects.
 */
MediaGalleryComponent.prototype.getContentTypes = function() {
    return this.m_contentTypes;
};

/**
 * Sets the array of content type objects used when determining which content types to retrieve.
 * @param {[object]} contentTypes : An array of content type objects which will be used to determine which 
 * media objects to retrieve.
 */
MediaGalleryComponent.prototype.setContentTypeFilterList = function(contentTypeFilterList) {
    
	this.m_contentTypeFilterList = contentTypeFilterList;
};

/**
 * Retrieves the array of content type objects that will be used when retrieving media objects.
 * @return {[object]} An array of content type objects which will be used when retrieving media objects.
 */
MediaGalleryComponent.prototype.getContentTypeFilterList = function() {
    return this.m_contentTypeFilterList;
};
/**
 * Creates the filterMappings that will be used when loading the component's bedrock settings
 */
MediaGalleryComponent.prototype.loadFilterMappings = function(){
    //Add the filter mapping object for the Content Types //mg_content_type
    this.addFilterMappingObject("MG_CONTENT_TYPE", {
        setFunction: this.setContentTypes,
        type: "ARRAY",
        field: "PARENT_ENTITY_ID"
    });
};
/**
 * This is the MediaGalleryO1Component implementation of the retrieveComponentData function.  
 * It creates the necessary parameter array for the data acquisition script call and the associated Request object.
 */
MediaGalleryComponent.prototype.retrieveComponentData=function(){
    var criterion=this.getCriterion();
    var sendAr=null;
    this.setPersonId(criterion.person_id);
    var searchScope = this.getScope();
    var lookBackUnits = this.getLookbackUnits();
    var lookBackUnitType = this.getLookbackUnitTypeFlag();
    
    var sUrlParam = "";
    if (searchScope == 1){
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
    sendAr=["^MINE^",criterion.person_id+".0",MP_Util.CreateParamArray(this.getContentTypes(),1)];
    MP_Core.XMLCclRequestWrapper(this, "MP_MEDIA_GALLERY", sendAr, true);
};
    
/**
 * Mark the media as selected when it is not selected and mark it unselected if it is already selected.
 */ 
MediaGalleryComponent.prototype.doSelect=function(compId) {
    var tmp=this;

    if (tmp.getAttribute("class") == "mmf-thumb mmf-selected") {
        tmp.setAttribute("class", "mmf-thumb");     
		if ($( ".mmf-thumb.mmf-selected" ).length === 0 ) {//if none of images are selected, then set buttons disabled
	    	MediaGalleryComponent.prototype.disableActions.apply(this, [compId]) ;//set buttons disabled 
        }
    } else {
      	tmp.setAttribute("class", "mmf-thumb mmf-selected");
		MediaGalleryComponent.prototype.enableActions.apply(this, [compId]) ;//set buttons enabled
    }   
};

/**
 * Launch Media Viewer window as a Modal dialog for a given patient with the URL Media viewer
 * @param {String} viewerURL : The URL Media Viewer with a given person id. (i.e. 'http://tbird2/mediaviewer/mom?hideDemographicsBar=true&patientId=1234')
 * @param {String} subTimerName: the category_mean of the MPages that will be used for logging as the sub timer name.
 * @param {String} (optional) imageId: the image identifier. This is the case where user clicked on the image name hyperlink or date group link. It will be blank if viewing by View Selection button.
 */
MediaGalleryComponent.prototype.launchMediaViewer=function(viewerURL, subTimerName, imageId) {
    var mmfI18n = i18n.discernabu.mediaGallery_o1;
    var viewMediaAuthenticated = false;
    
    var slaTimer = MP_Util.CreateTimer("CAP:MPG_Media_Gallery_o1_Launch_Media_Viewer"); 
    if (slaTimer) {
        slaTimer.SubtimerName = subTimerName;          
        slaTimer.Stop();
    }
    if (typeof(imageId) !== "undefined") {//this is viewing by Image name hyperlink or Date group link
        viewerURL = viewerURL + imageId ; 
    }
    else {//this is viewing by clicking View Selection button to view more than 1 images
        $( ".mmf-thumb.mmf-selected" ).each(function(i, obj){   
            viewerURL = viewerURL + '&identifier=' + "{" + obj.getAttribute('id') + "}";  //add the {} since it was removed setting id
        });
    }
   
    //Make an XMLHttpRequest call with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call before passing into the Modal dialog.
    try
    {
        g_MediaGadgetXMLHttpRequestObj.open("GET",viewerURL,false);
        window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetXMLHttpRequestObj)";
        g_MediaGadgetXMLHttpRequestObj.send(); 
        
        if (g_MediaGadgetXMLHttpRequestObj.status == 200) {
            viewMediaAuthenticated = true;
        }
        else{
            MP_Util.LogInfo("mediagallery-o1.js: launchMediaViewer: Failed to get Media Viewer Authenticated:" + g_MediaGadgetXMLHttpRequestObj.status);
        }
    }   
    catch(err)
    {
        // on error or on unsuccessful log error
        MP_Util.LogJSError(this,err,"mediagallery-o1.js","launchMediaViewer"); 
        throw(err);
    }   
    
    //if it is authenticated, then generate the Modal dialog with the URL has been passing authenticated.
    if (viewMediaAuthenticated === true) {
        var modalId = "MediaGalleryComponent";
        var mDialog = new ModalDialog(modalId);
        mDialog.setHeaderCloseFunction(function(){
           MP_ModalDialog.closeModalDialog(modalId);
           MP_ModalDialog.deleteModalDialogObject(modalId);
        });
        mDialog.setBodyDataFunction(function(modalObj){
            modalObj.setBodyHTML('<iframe class="mmf-media-viewer-modal-dialog" src="'+ viewerURL +'" ></iframe>');
        }); 
        mDialog.setHeaderTitle(mmfI18n.MEDIA_VIEWER);
        
        MP_ModalDialog.addModalDialogObject(mDialog);
        MP_ModalDialog.showModalDialog(modalId);
    }
};

/**
 * Clear selection for the selected Medias and disable the buttons.
 * @param none
 */
MediaGalleryComponent.prototype.clearMediaSelection=function(compId) {
    //For each selected media, make it unselected.
    $(".mmf-thumb.mmf-selected").removeClass("mmf-selected"); 
       
    //set the buttons (View Selection and Clear Selection) to be disabled.
    MediaGalleryComponent.prototype.disableActions.apply(this, [compId]) ;
};
/**
 * This function will find medias from the json medias. If it is group by Date, then filter out the Group object (since this can contain the folder group that is not medias).
 * If it is group by Content Type, then take all images and Group under content type as well.
 * Once a media is found, it put into an image record and collected into an array of image records (patientImages)
 * @param none
 * @return patientImages: an array of image records.
 */
MediaGalleryComponent.prototype.findImages=function() {
    var patientImages = [];
    var imageObject = null; 
    var tempMedia = this.getMediaStash();
    var imageIdList = []; //store the list of image ids
   
    if (tempMedia) {
        try{
            for(var i = 0;i<tempMedia.length;i++){
                var obj = tempMedia[i];
                if (typeof obj.name === "undefined"){
                    obj.name = ""; //this is needed for sorting name
                }
                if (typeof obj.contentTypeDisplay === "undefined"){
                    obj.contentTypeDisplay = ""; //this is needed for sorting name
                }
                if (this.m_menuGroupBy === 0) { //group by Date
                    //filter out the group folder   
                    //if media has "groupIdentifier", it could be the group (folder) or media(children under the folder)
                    //so take only the media (children of folder) where obj.groupIdentifier != obj.identifier
                    //media not under group, there is no groupIdentifier
                    if ((obj.groupIdentifier && obj.groupIdentifier !== obj.identifier) || (obj.groupIdentifier === undefined))
                    {   
                        imageObject = this.imageRecord(obj.identifier, obj.name, obj.serviceDate, obj.contentTypeDisplay, this.getBaseURL() + "thumbnail/" + obj.identifier + "?size=4&generic=1", obj.mimeType, obj.groupIdentifier); 
                        patientImages.push(imageObject);  
                        imageIdList.push('"' + obj.identifier + '"'); 
                    } 
                }
                else {//group by Content Type
                    imageObject = this.imageRecord(obj.identifier, obj.name, obj.serviceDate, obj.contentTypeDisplay, this.getBaseURL() + "thumbnail/" + obj.identifier + "?size=4&generic=1", obj.mimeType, obj.groupIdentifier); 
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
    * This function will sort the the array of patient images and Sort it according to the Group By (Date/Content Type) then
    * split the images into an array for displaying together
    * @param: {object}: displayImages: An array of patient images.
    */
MediaGalleryComponent.prototype.imageGroup=function(displayImages) { 
    var component = this;
    var sImageGrpListHTML = [];
    var ordArray = [];
    
    /**
    * This function will sort image records in to order from oldest to newest.
    * @param: {object}: a: image record a.
    * @param: {object}: b: image record b.
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
    * @param: {object}: a: image record a.
    * @param: {object}: b: image record b.
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
    * @param: {object}: a: image record a.
    * @param: {object}: b: image record b.
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
    * @param: {object}: a: image record a.
    * @param: {object}: b: image record b.
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
    * @param: {object}: tempImage: an image record that will be displayed.
    * @return: {object} an array of HTML string for image.
    */
    function generateHTMLdisplayImage(tempImage){
        var ImageId = tempImage.imageId;
        var imageIdStr = ImageId.substring(1,ImageId.length - 1); //take out the {} from the string
        var sImageListHTML = [];
        var mmfI18n = i18n.discernabu.mediaGallery_o1;
        var serviceDateObj = new Date(tempImage.serviceDate*1000);
        var sServiceDate = serviceDateObj.toLocaleDateString();
        var sServiceTime = serviceDateObj.toLocaleTimeString();

        //Display Media with the name as a hyperlink and hover details
        sImageListHTML.push("<div class='mmf-image' image-name = \"", tempImage.description,"\">"); 
        sImageListHTML.push("<div class='mmf-imgContain'>");
        
        sImageListHTML.push("<dl class =\"mmfgal-o1-info result-info\">");  
        sImageListHTML.push("<img class='mmf-thumb' id=", imageIdStr," alt= '", tempImage.description,"' src= '", tempImage.imageURL,"'/>");
        sImageListHTML.push("<div class='mmf-iconHolder'></div>") ;// add an image holder for the Show Related Documents icon
        sImageListHTML.push("</dl>");
        
        //below line would not be displayed on front end
        sImageListHTML.push("<h4 class='det-hd'>media detail hover</h4>");
        sImageListHTML.push("<div class=\"hvr\">");
        sImageListHTML.push("<dl class=\"mmf-det\"><dt><span>",mmfI18n.CONTENT_TYPE,":</span></dt><dd><span>",tempImage.contentType,"</span></dd><dt><span>",mmfI18n.NAME,":</span></dt><dd><span>",tempImage.description,"</span></dd><dt><span>",mmfI18n.SERVICE_DATE_TIME,":</span></dt><dd><span>",sServiceDate,"&nbsp;",sServiceTime,"</span></dd></dl>");
        sImageListHTML.push("</div>");
        sImageListHTML.push("</div>");
         
        //display media name as a hyperlink under the media image.
        if (tempImage.description) {//if name is available, display name
            sImageListHTML.push("<div class='mmf-media-name' ><span><span class='mmf-imageLaunchViewer' name='&identifier=",tempImage.imageId,"' title=\"",tempImage.description,"\" >",tempImage.description,"</span></span></div>"); //display media name      
        }
        else {//if no name, display [View]
            sImageListHTML.push("<div class='mmf-media-name'><span><span class='mmf-imageLaunchViewer' name='&identifier=",tempImage.imageId,"' >[",mmfI18n.VIEW,"]</span></span></div>"); //display [View]
        }
        sImageListHTML.push("</div>");  
        return sImageListHTML;          
    } //end generateHTMLdisplayImage
    
    /**
    * This function will take in an array of images for the same date generate header with date and number of images
    * and display images in group.
    * @param: {object}: imagesGroup: an array of image records that has the same date.
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
            sHyperLinkGroupId = sHyperLinkGroupId + "&identifier=" + tempImage.imageId ;
            var sImageHTML = generateHTMLdisplayImage(tempImage); //replaced with function to get HTML string for an image record.
            sImageListHTML.push(sImageHTML.join(""));
        }  
        sSectionHeaderHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", "Collapse", "'>-</span><span class='mmf-dateLinkLaunchViewer' name='",sHyperLinkGroupId,"'><span class='sub-sec-title'><span class = 'mmf-grp-hdr'>", imageDate,"</span> (<span class = 'mmf-grp-cnt'>", imagesGroup.length, "</span>)", "</span></span></h3>", "<div class='sub-sec-content'>");
        ordArray.push(sSectionHeaderHTML.join(""));
        ordArray.push(sImageListHTML.join(""));
        ordArray.push("</div></div>");
    }

    /**
    * This function will take in an array of images for the same group (group under a content type)  
    * and generate HTML string that will be displayed under the group section.
    * @param: {object}: imagesGroup: an array of image records that has the same group under 1 content type.
    * @return:{Object} an array of string HTML to display images and a string of image id for the group link.
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
    * @param: {object}: imagesGroup: an array of image records that have the same 1 content type and all the groups belong this content type. 
    *                   (since they both on the same tree level).
    * @param: {object}: imagesInSubGroups: an array of the groups that contain image records that has the same group under this content type.
    */
    function displayContentTypeGroup(imagesGroup, imagesInSubGroups){
        var i=0;
        var imageDateObj = new Date(imagesGroup[i].serviceDate*1000);
        var sHyperLinkGroupId = "";
        var sSectionHeaderHTML = []; 
        var sImageListHTML = []; 
        var imgCnt = 0;
        var sContentTypeDisplay = imagesGroup[0].contentType;
		var mmfI18n = i18n.discernabu.mediaGallery_o1;
		
        //loop thru imagesGroup to display the images(not under the group) and the groups under the Content Type header section.
        for (i=0; i<imagesGroup.length; i++) {
            var tempImage = imagesGroup[i];
            //if it is image, display under Content Type folder
            if (tempImage.groupId === undefined) //image (not under group) and not group
            {
                sHyperLinkGroupId = sHyperLinkGroupId + "&identifier=" + tempImage.imageId ;
                var arrayHTMLandLink = generateHTMLdisplayImage(tempImage); //replaced with function
                sImageListHTML.push(arrayHTMLandLink.join(""));
                imgCnt = imgCnt + 1;
            }
            else //it is a group/folder, find the images under this group then display the group header section and images under this group.
            {
                var groupId = tempImage.groupId;
                var groupIdStr = groupId.substring(1,groupId.length - 1); //take out the {} from the string
                var sGroupHeaderHTML = []; 
                var subGroupLen = 0;
                var arrayHTMLandLink = [];
                var sSubGroupHyperLinkId = "";
				var serviceDateObj = new Date(tempImage.serviceDate*1000);
				var sServiceDate = serviceDateObj.toLocaleDateString();
				var sServiceTime = serviceDateObj.toLocaleTimeString();
				
                //loop thru all the groups(imagesInSubGroups) to find the group that is matched with the group displaying under Content type, 
                //then generate html for all the images under this group
                for (var idx=0;idx<imagesInSubGroups.length;idx++)
                {
                    var imgInSubGroup = []; //store image records that has the same group
                    imgInSubGroup = imagesInSubGroups[idx];
                    if (groupId === imgInSubGroup[0].groupId) //only need to compare the first item of the array, since images in same group has same groupId
                    {
                        //image in the same group, display images in this group
                        subGroupLen = imgInSubGroup.length;
                        arrayHTMLandLink = displaySubGroup(imgInSubGroup);
                        imgCnt = imgCnt + subGroupLen;
                        break;//only 1 can be found, exit for loop idx
                    }
                }
                //if there is images under this group, get the HTML string to display images and the hyper link id for the whole group.
                if (arrayHTMLandLink.length > 0) { 
                    sSubGroupHyperLinkId = arrayHTMLandLink[1]; //hyperlink for the subgroup
                    sHyperLinkGroupId = sHyperLinkGroupId + sSubGroupHyperLinkId; //hyperlink for the Content type
                }
                
                //generate HTML for group header section
				sGroupHeaderHTML.push("<div class='sub-sec  mmf-group'>");
				sGroupHeaderHTML.push("<dl class ='mmfgal-o1-info result-info'>");  
				sGroupHeaderHTML.push("<h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", "Collapse", "'>-</span><span class='mmf-dateLinkLaunchViewer' name='",sSubGroupHyperLinkId,"'><span class='sub-sec-title'><span class = 'mmf-grp-hdr'>", tempImage.description,"</span> (<span class = 'mmf-grp-cnt'>", subGroupLen, "</span>)", "</span></span></h3>");
				sGroupHeaderHTML.push("</dl>");
			
				//generate HTML for group hover (NOTE: h4 element will not be visible to the end user, it is utilizing standard classes for semantic headings.)
				sGroupHeaderHTML.push("<h4 class='det-hd'>group detail hover</h4>");
				sGroupHeaderHTML.push("<div class=\"hvr\">");
				sGroupHeaderHTML.push("<dl class=\"mmf-det\"><dt><span>",mmfI18n.CONTENT_TYPE,":</span></dt><dd><span>",tempImage.contentType,"</span></dd><dt><span>",mmfI18n.NAME,":</span></dt><dd><span>",tempImage.description,"</span></dd><dt><span>",mmfI18n.SERVICE_DATE_TIME,":</span></dt><dd><span>",sServiceDate,"&nbsp;",sServiceTime,"</span></dd></dl>");
				sGroupHeaderHTML.push("</div>");	
				sGroupHeaderHTML.push("<div class='sub-sec-content' id ='",groupIdStr,"'>");
			
				sImageListHTML.push(sGroupHeaderHTML.join("")); //display a group header

                if (arrayHTMLandLink.length > 0 ) { //if there is images under that group
                    sImageListHTML.push(arrayHTMLandLink[0].join("")); //display images under the group
                }
                sImageListHTML.push("</div></div>"); 
            }
            
        }//end for i loop
        
        //generate HTML for Content Type header section
        sSectionHeaderHTML.push("<div class='sub-sec'><h3 class='sub-sec-hd'><span class='sub-sec-hd-tgl' title='", "Collapse", "'>-</span><span class='mmf-dateLinkLaunchViewer' name='",sHyperLinkGroupId,"'><span class='sub-sec-title'><span class = 'mmf-grp-hdr'>", sContentTypeDisplay,"</span> (<span class = 'mmf-grp-cnt'>", imgCnt, "</span>)", "</span></span></h3>", "<div class='sub-sec-content'>");
        ordArray.push(sSectionHeaderHTML.join("")); //display content type header section
        ordArray.push(sImageListHTML.join("")); //display all images under content type, group header and images under the group header section.
        ordArray.push("</div></div>");
    } //displayContentTypeGroup
    
    /** 
    * Take the array of SORTED patient images in content type alphabetical order and
    * split the images for each content type into an array. From each each content type group, break it down into 2 seperate arrays:
    *   - contentTypleList: contains images and groups(they are on same tree level), sort it by content type and display together. 
    *   - groupList: contains images under all the groups for each content types, sort it by image name and display each group together.
    * @param: {object}: displayImages: An array of patient images that were sorted in alphabetical order by Content type.
    */
    function groupByContentType(displayImages){
        var i = 0;  
        var imgGrouping = [];
        var imgContentTypeDisplay = "";
        var arryImgSubGrouping = [];
        
        //loop thru all image records (images ang group), split the images for each content type into an array, then display each content type group. 
        while (i < displayImages.length) 
        {
            imgContentTypeDisplay =  displayImages[i].contentType;
            for (i=i; i<displayImages.length; i++) {
                var tempImage = displayImages[i];
                var sCompContentTypeDisplay = tempImage.contentType;
                //find image that has same content type.
                if (imgContentTypeDisplay!=sCompContentTypeDisplay){
                    break; //exit for loop
                }
                imgGrouping.push(tempImage); //put image with the same content type into a content type group.
            }
            
            var contentTypleList = []; //store images (that not under the group) and the group objects.
            var imgObj = null;
            var groupList = []; //to store only images that are under the group/folder
            
            //separate the group and image not under group into 1 array (contentTypleList)
            //images under groups into another array (groupList)
            for (var idx=0;idx<imgGrouping.length;idx++)
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
            displayContentTypeGroup(contentTypleList, arryImgSubGrouping); //display all images and group images with same content type into 1 section
            imgGrouping.length=0;
        } //end while
    } //end groupByContentType  
    
  /** 
    * Take the array of SORTED (by group id) group images and
    * split the images for each group into an array, then sort images in each group by alphabetical order of name.
    * And store it into another array and return.
    * @param: {object}: groupList: An array of images that are under the group and were sorted by group identifier.
    * @return: {object}: an array of array images that have the same group and sorted by alphabetical order of name/description
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
                    if (groupId != tempImage.groupId) {
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
        
        while (i > -1) //display images from newest to oldest
        {
            imageDateObj = new Date(displayImages[i].serviceDate*1000);
            imageDate=imageDateObj.toLocaleDateString();

            for (i = i; i >= 0; i-- ) {
                var tempImage = displayImages[i];
                var compDate = new Date(tempImage.serviceDate*1000);
                var sCompDate = compDate.toLocaleDateString();
                
                if (imageDate!=sCompDate){
                    break;
                }
                imgGrouping.push(tempImage); //put image with the same date into a date group.
            }
            displayDateGroup(imgGrouping); //display all images with same date into 1 section
            imgGrouping.length=0;
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
 */
MediaGalleryComponent.prototype.enableActions=function(compId) {
    _g("mgViewBtn" + compId).disabled = false;
    _g("mgClearBtn" + compId).disabled = false;  
};

/**
 * Disable buttons
 */
MediaGalleryComponent.prototype.disableActions = function(compId) {
    _g("mgViewBtn" + compId).disabled = true;
    _g("mgClearBtn" + compId).disabled = true;
};

/**
 * This function will get the json object of the BASE CAMM URL for the given Service Directory 
 * by calling the CAMM REST Service URL link with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call.
 * @param: {string}: url: the CAMM Service Directory URL (i.e. https://directory.devcareaware.com/services-directory/authorities/provide.northamerica.cerner.net/keys/urn:cerner:api:mmf-camm-mpage-app-service-1.0.json) 
 * @return: {string}: a string of CAMM REST service URL. (i.e. http://iptmpwas01/camm-mpage-1.0/provide.northamerica.cerner.net/service/)       
 */
MediaGalleryComponent.prototype.getCAMMURL = function (url){    
    var CAMM_URL = "";

    try
    {
        //getURL = url + "/keys/urn:cerner:api:mmf-camm-mpage-app-service-1.0.json"
        g_MediaGadgetXMLHttpRequestObj.open("GET",url,false);
        window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetXMLHttpRequestObj)";
        g_MediaGadgetXMLHttpRequestObj.send(); 
        
        if (g_MediaGadgetXMLHttpRequestObj.status == 200) {
            var Links =  JSON.parse(g_MediaGadgetXMLHttpRequestObj.responseText);
            CAMM_URL = Links.link;
            MP_Util.LogInfo("MMF Media Gallery :getCAMMURL: " + CAMM_URL );
        }
        else{
            MP_Util.LogInfo("mediagallery-o1.js: getCAMMURL: Failed to retrieve the CAMM URL from Service Directory:" + g_MediaGadgetXMLHttpRequestObj.status);
        }
    }   
    catch(err)
    {
        // on error or on unsuccessful log error
        MP_Util.LogJSError(this,err,"mediagallery-o1.js","getCAMMURL"); 
        throw(err);
    }   
    return (CAMM_URL);
};
/**
 * This function will get the media json object for the given patient 
 * by calling the CAMM REST Service URL link with passing the authentication info with using javascript:MPAGES_SVC_AUTH() function call.
 * @param: {string}: url: the CAMM REST Service URL with patient id (i.e. http://iptmpwas01/camm-mpage-1.0/provide.northamerica.cerner.net/service/media?personId=34844160) 
 */
MediaGalleryComponent.prototype.retrieveMedia = function (url){
    MP_Util.LogInfo("MMF Media Gallery:retrieveMedia:URL:" + url );
    if(g_MediaGadgetXMLHttpRequestObj){
        try{
            g_MediaGadgetXMLHttpRequestObj.open("GET",url,false);
            window.location = "javascript:MPAGES_SVC_AUTH(g_MediaGadgetXMLHttpRequestObj)";
            g_MediaGadgetXMLHttpRequestObj.send();
        }
        catch(err)
        {
            MP_Util.LogJSError(this,err,"mediagallery-o1.js","retrieveMedia");
            throw(err);
        }
            
        if (g_MediaGadgetXMLHttpRequestObj.status == 200) {
            var vartest = g_MediaGadgetXMLHttpRequestObj.responseText;
            try{
        
                this.setMediaStash(JSON.parse(vartest));
                MP_Util.LogInfo("MMF Media Gallery:retrieveMedia:responseText:" + vartest );
            }
            catch(err)
            {
                MP_Util.LogJSError(this,err,"mediagallery-o1.js","retrieveMedia");
                throw(err);
            }
        }
        else { //unsuccessful status (not 200) 
            var errMgs = "RetrieveMedia returned unsuccessful status: " + g_MediaGadgetXMLHttpRequestObj.status;
            MP_Util.LogError(errMgs);
            throw errMgs;
        }
    }
};

/**
 * This is the MediaGalleryO1component implementation of the renderComponent function.  It takes the information retrieved from the script
 * call and renders the component's visuals.  There is no check on the status of the script call's reply since that is handled in the 
 * call to XMLCCLRequestWrapper.
 * @param {MP_Core.ScriptReply} The ScriptReply object returned from the call to MP_Core.XMLCCLRequestCallBack function in the 
 * retrieveComponentData function of this object.
 */
MediaGalleryComponent.prototype.renderComponent=function(recordData){
    var compId=this.getComponentId();
    var countText="";
    var imageSum=0;
    var ordArray=[];
    var SERVICE_DIR_KEY = "/keys/urn:cerner:api:mmf-camm-mpage-app-service-1.0.json" ;
    var mmfI18n = i18n.discernabu.mediaGallery_o1;  
    var catName = this.getCriterion().category_mean;
    var component = this;  
    var contentTypeKeys = []; //a list of bedrock content type keys filter.
    this.rootNode$ = $(component.getRootComponentNode());
    
    try{
        var url = recordData.SERVICE_DIRECTORY_URL + SERVICE_DIR_KEY; 
        //i.e. url = "https://directory.devcareaware.com/services-directory/authorities/provide.northamerica.cerner.net/keys/urn:cerner:api:mmf-camm-mpage-app-service-1.0.json"
        
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
			for (var idx=0;idx<contentTypeListLen; idx++)
			{
				var filterObj = contentTypeFilterList[idx] ;
				contentTypeKeys.push(filterObj.CONTENT_TYPE_KEY);
			} 
			contentTypeKeys.toString();	
		}
		
        if (CAMMURL) 
        {
            var sParams = this.getURLParams() ;
            //if there is content type filter, add it into the parameter list that will be used to query media object
            if (contentTypeKeys.length > 0)
			{
				sParams = sParams +"&contentType=" + contentTypeKeys;
			}
            this.retrieveMedia(CAMMURL + sParams); 
        }
        //get user preference
        var savedUserPrefs = this.getPreferencesObj();
        //get groupby preference
        if(savedUserPrefs !== null && savedUserPrefs.media_gallery_prefs !== null){
            this.m_menuGroupBy = savedUserPrefs.media_gallery_prefs.GROUP_BY_PREF;
        }
        
        if (recordData.CONTENT_TYPES.length > 0) {
            this.displayFilterApplied();
        }
        
        this.displayBodyContent(); //replaced to use function call to display Body content by grouping images accordingly.
        
        //Add menu Show Related Document into the menu group
        this.addComponentMenu();
        
        //display a check mark icon when the Group By Date menu is selected.
        if (this.m_menuGroupBy === 1)//Group By Content Type
        {
            var menuGroupByContentType = $("#mnuMediaGalleryo1GroupByContentType" + compId);
            var menuGroupByContentTypeHtml = menuGroupByContentType.html();
            menuGroupByContentTypeHtml = menuGroupByContentTypeHtml + "<span class='mmf-opt-mnu-grp-by-content-type'></span>" ;
            menuGroupByContentType.html(menuGroupByContentTypeHtml);
        }
        
    }catch(err){    
        MP_Util.LogJSError(this,err,"mediagallery-o1.js","renderComponent"); 
        throw (err);
    }
};

/** 
 * This function will display the body content for the component.  
 * @param: none.
 * @return: none
 */
MediaGalleryComponent.prototype.displayBodyContent=function(){
    var compId=this.getComponentId();
    var countText="";
    var imageSum=0;
    var ordArray=[];
    var mmfI18n = i18n.discernabu.mediaGallery_o1;  
    var component = this;
    var imageListing = [];
    var imageListingLen = 0;
    
     
    //Display View Selection and Clean Selection buttons
    ordArray.push("<div class='mmf-viewselection-row' id='mgbuttonViewRow", compId, "'><div class= 'mmf-btn-section'><button class='mmf-viewselection-btn' id='mgViewBtn",compId,"' disabled='true' title='",mmfI18n.VIEW_SELECTION,"'>", mmfI18n.VIEW_SELECTION, "</button>", "<button class='mmf-clear-selection-btn' id='mgClearBtn",compId,"' disabled='true' title='",mmfI18n.CLEAR_SELECTION,"'>", mmfI18n.CLEAR_SELECTION, '</button>','</div><div class = "mmf-search-section"><div class="mmf-search-box">', MP_Util.CreateAutoSuggestBoxHtml(this), '</div></div>');    
    if (this.getMediaStash()!== null){//logically it needs to check null here, but it won't occur at this point since it has been checked and thrown error above logic if it is failed.
        imageListing = this.findImages();
        //count number of media objects
        imageListingLen = imageListing.length; //imageListing can contain images and group if group by content type
    }
    
    if (imageListingLen === 0) //no medias, display "No results found"
    {
        ordArray.push("<div class='mmf-content-body'> ");
        ordArray.push("<div><span class = 'res-none'>",mmfI18n.NO_RESULTS_FOUND,"</span></div>");
    }
    else
    {
        var nBedrockScrollNumber = this.getScrollNumber();
        var sMaxHeight = "";
        
        if ( nBedrockScrollNumber > 0) {
            nBedrockScrollNumber = (nBedrockScrollNumber * 100) + 150;
            sMaxHeight = nBedrockScrollNumber + "px";
        }
        
        if (nBedrockScrollNumber === 0){
            ordArray.push("<div class='mmf-content-body'> ");
        }
        else {
            ordArray.push("<div class='mmf-content-body' style = 'max-height: ",sMaxHeight," ; overflow-y: auto;'> ");
        } 
        
        for(var i = 0; i < imageListingLen; i++) {
            var obj = imageListing[i];
            if ((obj.groupId  && obj.groupId  !== obj.imageId) || (obj.groupId === undefined)) //image under group or image
            {
                imageSum = imageSum + 1;
            }
        }
        var imgGrpHTML = this.imageGroup(imageListing);
        ordArray.push(imgGrpHTML.join("")); 
    }
    ordArray.push("</div>");
    countText=MP_Util.CreateTitleText(this,imageSum);
    this.applyTemplate("list-as-table");
    
    MP_Util.Doc.FinalizeComponent(ordArray.join(""), this, countText);

    //Added event click to select/unselect a media
    this.rootNode$.off( "click", ".mmf-thumb"); //remove the click before add if it has been added before. This is needed when Group by option is changed   
    this.rootNode$.on( "click", ".mmf-thumb",  function() {
       MediaGalleryComponent.prototype.doSelect.apply(this, [compId]); 
    });

    //Added event button click for View Selection button to launch Media Viewer 
    var name = this.getCriterion().category_mean;
    this.rootNode$.off( "click", ".mmf-viewselection-btn");
    this.rootNode$.on( "click", ".mmf-viewselection-btn",  function() {
       MediaGalleryComponent.prototype.launchMediaViewer.apply(this, [component.m_MediaViewerURL, name]); 
    }); 
    
    //Added event button click for Clear Selection button to clean selection for selected Medias
    this.rootNode$.off( "click", ".mmf-clear-selection-btn"); 
    this.rootNode$.on( "click", ".mmf-clear-selection-btn",  function() {
       MediaGalleryComponent.prototype.clearMediaSelection.apply(this, [compId]);
    });
    
        //Added event for search box 
        var searchBox = _g(this.getStyles().getNameSpace() + "ContentCtrl" + compId);
        var searchBoxTimeOut = 0;
        searchBox.value = mmfI18n.SEARCH;
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
                this.value = mmfI18n.SEARCH;
                $(this).addClass("placeholder");
            }
        };
        searchBox.onfocus = function(event){
            if(this.value === mmfI18n.SEARCH){
                this.value = "";
                $(this).removeClass("placeholder");
            }
        };
    CERN_EventListener.fireEvent(this,this,EventListener.EVENT_COUNT_UPDATE,{count:imageSum}); 
};

/** 
 * @method This function will do a search on the DOM based on image names and subfolder names.
 * @param {object} callback - event object of the search box 
 * @param {object} textBox - Object of the textbox DOM element
 * @param {object} component - Reference of the component
 * @return none
 */
MediaGalleryComponent.prototype.searchImages = function(callback, textBox, component){
    var searchString = textBox.value.toUpperCase();
    var rootNode = component.getRootComponentNode();
    var imageMainNode = $(rootNode).find(".mmf-content-body").children();
    var imageCnt = -1;
    var hiddenImageCnt = -1;
    var subGrpImageCnt = -1;
    var subGrpHiddenImageCnt = -1;
    var subfolderSearchMatch = false;
    var headerText = "";
    var imageName = "";
    
    $(imageMainNode).each(function(index, item){
        imageCnt = $(item).find(".mmf-image").length;
        //hide all the images at all levels if they dont match the search String
        $(item).find(".mmf-image").each(function(imgIndex, imgNode){
            var imageName = $(imgNode).attr("image-name").toUpperCase();
            if(imageName.indexOf(searchString) == -1){
                $(imgNode).addClass("mmf-force-hidden");
            }
            else{
                $(imgNode).removeClass("mmf-force-hidden");
            }
        });
        
        //Hide the subgroups if they dont have any visible images inside them
        $(item).find(".mmf-group").each(function(imgIndex, subNode){
            //search for the sub group header name
            headerText = $(subNode).find(".mmf-grp-hdr").text().toUpperCase();
            subfolderSearchMatch = (headerText.indexOf(searchString) == -1) ? false : true;
            if(subfolderSearchMatch){
                $(subNode).find(".mmf-force-hidden").removeClass("mmf-force-hidden");
            }
            
            subGrpImageCnt = $(subNode).find(".mmf-image").length;
            subGrpHiddenImageCnt = $(subNode).find(".mmf-image.mmf-force-hidden").length;
            if(subGrpImageCnt === subGrpHiddenImageCnt){
                $(subNode).addClass("mmf-force-hidden");
            }
            else{
                $(subNode).removeClass("mmf-force-hidden");
                $(subNode).find(".sub-sec-hd").find(".mmf-grp-cnt").text(subGrpImageCnt - subGrpHiddenImageCnt);
            }
        });
        
        //hiden the main group if there are no visible images inside it.
        hiddenImageCnt = $(item).find(".mmf-image.mmf-force-hidden").length;
        if(imageCnt === hiddenImageCnt && imageCnt !== 0){
            $(item).addClass("mmf-force-hidden");
        }
        else if(imageCnt !== 0){
        	$(item).removeClass("mmf-force-hidden");
            $(item).children(".sub-sec-hd").find(".mmf-grp-cnt").text(imageCnt - hiddenImageCnt);
        }
    });
    //Show everything if the search box is empty
    if(searchString.length === 0){
        $(imageMainNode).each(function(index, item){
            $(item).find(".mmf-force-hidden").removeClass("mmf-force-hidden");
        });
    }
};


/** 
 * This function will display the filter message in the component header section if there is bedrock filtered content types.  
 * @param: none.
 * @return: none
 */
MediaGalleryComponent.prototype.displayFilterApplied=function(){
    var namespace = this.getStyles().getId();
    var lbContainer  = "lookbackContainer" + namespace; //i.e. lookbackContainermmfgal-o13012095018 //this is the location where it displays the lookbackoption i.e. All visits
    var filterMsgHTML = "";
    var contentTypeDisplays = [];
    var idx = 0;
    var mmfI18n = i18n.discernabu.mediaGallery_o1;
    var contentTypeFilterList = this.getContentTypeFilterList();
    var filterContentTypesLen = contentTypeFilterList.length;
	
    if (filterContentTypesLen > 0) { //if there is filter for Content Types
        //get the list of content type displays
        for (idx=0;idx<filterContentTypesLen; idx++)
        {
            var filterObj = contentTypeFilterList[idx];
            contentTypeDisplays.push(filterObj.DISPLAY);
        }       
        var filterMegObj = document.getElementById("filterMessage" + namespace);
        //check to see if the filter message has been displayed, if not, add it. This will prevent the duplicated message displayed when the lookbackoption is changed.
        if(!filterMegObj){
            filterMsgHTML = '<span id="filterMessage'+ namespace +'" title="'+ mmfI18n.CONTENT_TYPES + ': '+ contentTypeDisplays.join(', ')+ '" class="mmf-filter-applied-message"> '+ mmfI18n.FILTER_APPLIED+ '</span>';
            //search for the lookbackoption header section and add filter applied message.
            $("#" + lbContainer).append(filterMsgHTML);
        } 
    }
};//displayFilterApplied
/** 
 * This function will create the following menu to the component menu list:
 * - Show Related Documents: This menu will be unselected by Default. An event click will show related documents to the images. 
 
 * - Group By Content Type: By default, it is unselected. An event click will organize images to be displayed in grouping by Content Type.
 * @param: none.
 * @return: none
 */
MediaGalleryComponent.prototype.addComponentMenu=function(){
    var compId = this.getComponentId();
    var mmfI18n = i18n.discernabu.mediaGallery_o1; 
    var component = this;
    var menuShowRelatedDocsSelected = component.getMenuShowRelatedDocsInd();

    //generate Group by Content Type menu
    this.addMenuOption("mnuMediaGalleryo1GroupByContentType", 
                        "mnuMediaGalleryo1GroupByContentType" + compId, 
                        mmfI18n.GROUP_BY_CONTENT_TYPE, false 
                        ,"click", function () { 
                                component.displayGroupByContentType();
                            }
                        ); 
                        
    this.addMenuOption("mnuMediaGalleryo1ShowRelatedDocs", 
                        "mnuMediaGalleryo1ShowRelatedDocs" + compId, 
                        mmfI18n.SHOW_RELATED_DOCUMENTS, false 
                        ,"click", function(){
                            if (component.getMenuShowRelatedDocsInd() === 0) {
                                component.setMenuShowRelatedDocsInd(1); //reset the indicator
                                //display a check mark icon when the menu is selected.
                                var menuShowRelatedDocs = $("#mnuMediaGalleryo1ShowRelatedDocs" + compId);
                                var menuShowRelatedDocsHtml = menuShowRelatedDocs.html();
                                menuShowRelatedDocsHtml = menuShowRelatedDocsHtml + "<span class='mmf-gal-opt-mnu-show-related-docs'></span>" ;
                                menuShowRelatedDocs.html(menuShowRelatedDocsHtml);
                                //display show related docs icon on the image
                                component.getRelatedDocs();
                            }
                            else {
                                component.setMenuShowRelatedDocsInd(0); //reset the indicator
                                //remove the checked mark icon when the menu is unselected.
                                $("#mnuMediaGalleryo1ShowRelatedDocs" + compId+">span").removeClass();
                                component.removeShowRelatedDocsIcon();
                            }
                        }
                    ); 
    this.createMenu();  
};


/**
 * This function will display image grouping according by Group by Content Type selected/unselected 
 * and save user preference for the Group By into the backend by calling MPagesComponent.savePreferences 
 * @return: none
 */
MediaGalleryComponent.prototype.displayGroupByContentType = function(){
    var compId = this.getComponentId();
    if (this.m_menuGroupBy === 0) { //if it is group by Date
        this.m_menuGroupBy = 1 ; //reset the indicator to group by Content Type
        //display a check mark icon when the menu is selected.
        var menuGroupByContentType = $("#mnuMediaGalleryo1GroupByContentType" + compId);
        var menuGroupByContentTypeHtml = menuGroupByContentType.html();
        menuGroupByContentTypeHtml = menuGroupByContentTypeHtml + "<span class='mmf-opt-mnu-grp-by-content-type'></span>" ;
        menuGroupByContentType.html(menuGroupByContentTypeHtml);
    }
    else {//it is group by Content Type, then unselect
        this.m_menuGroupBy = 0 ; //reset the indicator to group by Date
        $("#mnuMediaGalleryo1GroupByContentType" + compId+">span").removeClass(); //remove the checked mark icon when for the group by Content Type
    }
    
    this.displayBodyContent(); //display Body content by grouping accordingly.
    this.postProcessing(); //to add click events for lauching media viewer
    
    if (this.m_menuShowRelatedDocsInd === 1) { //if show related document menu is currently selected, add the show related doc icons on image
        this.generateHTMLShowRelatedDocsIcon();
    }
    
    //save user preference for the Group By option.
    this.mediaGalleryo1PrefObj.media_gallery_prefs = this.getPrefJson();
    this.setPreferencesObj(this.mediaGalleryo1PrefObj);
    this.savePreferences(true);
};

/**
 * Retrieves the indicator for the Show Related Documents menu
 * @return {[number]} an indicator will be used when Show Related Documents is selected/unselected.
 */
MediaGalleryComponent.prototype.getMenuShowRelatedDocsInd = function(){
    return this.m_menuShowRelatedDocsInd;
};

/**
 * Sets the indicator for the Show Related Documents menu used to determine which medias to retrieve.
 * @param {[number]} menuShowRelatedDocsInd : an indicator will be used when Show Related Documents is selected/unselected.
 */

MediaGalleryComponent.prototype.setMenuShowRelatedDocsInd = function(menuShowRelatedDocsInd){
    this.m_menuShowRelatedDocsInd = menuShowRelatedDocsInd;
};

/** 
 * This function will get the Related Clinical Documents for the images.
 * It will call the mp_media_gallery_get_docs.prg to get the related documents.
 * This function is triggered when the option menu "Show Related Documents" is selected.
 * @param: none
 * @return: none
 */
MediaGalleryComponent.prototype.getRelatedDocs = function() {
    var criterion=this.getCriterion();
    var request = null;
    var self = this;
    var encntrs = null;
    var encntrStr = "";
    
    encntrs=criterion.getPersonnelInfo().getViewableEncounters();
    encntrStr=(encntrs)?"value("+encntrs+")":"0";
    /*
     * mp_media_gallery_get_docs script parameters:
     *  OUTDEV, inputPersonID, inputViewableEncounters, inputImageIds, inputProviderId, inputPPR
     */
    //Create the parameter array for our script call
    var imageIdList = "value("+this.m_viewableImageIds + ")"; //it will look like this 'value("{35-59-57-eb-f1-2d-48-2a-9a-94-d4-ce-14-89-94-8b}","{0d-ef-8d-61-ed-3f-43-88-b6-64-7c-f3-0f-d1-5f-41}")'
    var sendAr=["^MINE^",criterion.person_id + ".0", encntrStr, imageIdList, criterion.provider_id + ".0",criterion.ppr_cd + ".0"];
    
    request = new MP_Core.ScriptRequest(this, "ENG:MPG.MMF.GALLERY.01 _ Get Related Docs");
    request.setProgramName("MP_MEDIA_GALLERY_GET_DOCS");
    request.setParameters(sendAr);
    request.setAsync(true);

    MP_Core.XMLCCLRequestCallBack(this, request, function(reply) {
        self.displayShowRelatedDocsIcon(reply);
    });
};

/** 
 * This function will display the Show Related Documents icon into the images that are associated to Clinial Document.
 * A click event on the icon will display the list of documents as a hyperlink.
 * This function is triggered when the option menu "Show Related Documents" is selected.
 * @param: none.
 * @return: none
 */
MediaGalleryComponent.prototype.displayShowRelatedDocsIcon = function(reply){
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
            MP_Util.LogInfo("MMF Media Gallery:getRelatedDocs:No results found");
        }
        return;
    }
    
    //script successful, get the documents info the display icon on the image.
    replyData = reply.getResponse();
    this.m_docData = replyData.DOCS;
    this.generateHTMLShowRelatedDocsIcon(); //replaced the logic by calling function to generate related icon associated to images.
};

/** 
 * This function will generate HTML string to dislay the Show Related Documents icon into the images that are associated to Clinial Document.
 * @param: none.
 * @return: none
 */
MediaGalleryComponent.prototype.generateHTMLShowRelatedDocsIcon = function(){
    var component = this;
    if (this.m_menuShowRelatedDocsInd === 1 && component.m_docData)
    {
        //insert the Show Related Documents icon into the image that associated to the document
        	component.rootNode$.find(".mmf-iconHolder").each(function(){   
            var imgMenuId = $(this).prev().attr("id"); //find image id for each image
            var docsObject =  [];
            var docCnt = 0;
            var docsLen = component.m_docData.length;
        
            //loop thru all docs that have the image attached, then add it into the docsObject
            if(docsLen) {
                for(var i = 0; i < docsLen; i++) {
                    var curDoc = component.m_docData[i];
                            var thumbnailId = curDoc.IMAGE_ID;
                            var thumbnailIdStr = thumbnailId.substring(1,thumbnailId.length - 1); //take out the {}
                            
                if (thumbnailIdStr === imgMenuId )
                {
                    docsObject[docCnt] = curDoc;
                    docCnt = docCnt + 1;
                }
                }
            } //endif docsLen
        
            if (docCnt > 0)
            {
                $(this).addClass("mmf-show-related-docs-icon");
                $(this).click(function(){
                    component.displayDocumentsMenu(imgMenuId, docsObject);
                    $(".hvr.hover").hide(); //manually hide hover if it is displaying
                });
                $(this).mouseenter(function(){
                    this.activelyHovering = true;
                });
                $(this).mouseleave(function(){
                    this.activelyHovering = false;
                });
            }
        }
        );
    }//end if
};

/** 
 * This function will remove the Show Related Documents icon into the images that are associated to Clinial Document.
 * This function is triggered when the option menu "Show Related Documents" is unselected.
 * @param: none.
 * @return: none
 */
MediaGalleryComponent.prototype.removeShowRelatedDocsIcon = function(){
    if (this.m_menuShowRelatedDocsInd === 0)
    { 
    	this.rootNode$.find(".mmf-show-related-docs-icon").removeClass("mmf-show-related-docs-icon"); //remove the icon Show Related Documents
    }
};


/** 
 * This function will display the list of Clinical documents that have this image associated to.
 * This function is triggered when the icon "Show Related Documents" on the media is clicked.
 * @param: {string} imgMenuId: the id of the media that has Show Related Documents icon is clicked.
 * @return: {object} objDocs: an array of document objects that related to the image Id.
 */
MediaGalleryComponent.prototype.displayDocumentsMenu = function(imgMenuId,objDocs){
    var component           = this;
    if(this.docTimeout !== null){
        this.hideDocumentMenu(this, true);
    }
    this.setEditMode(true); // //set to edit mode to stop showing hover (When true, tooltips cannot display)
    
    var docsHTML            = "";
    var compId              = this.getComponentId();
    var docsLen             = objDocs.length;
    
    this.docTimeout         = setTimeout(function(){component.hideDocumentMenu(component);},this.clearTimeoutCount);
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
                docDt = i18n.UNKNOWN ;
            }
        //use CreateClinNoteLink to add event onlick to launch Clinical Note Viewer 
        //i.e.  <span><a onclick='javascript:MP_Util.LaunchClinNoteViewer(34844160.0,16553761.0,3060732060.0,"DOC",3060732060.0); return false;' href='#'>Wound Care</a></span>
            docsHTML += "<div class='mmf-doc-item-opt'><span><span>"+ docDt + "<span  class ='mmf-doc-item-name' title = '"+doc+"'>"+ MP_Util.CreateClinNoteLink(patId,enctrId,evntId,doc,viewerType,parentEventId)+"</span></span></div>";
        }
        
        //create mmf-docs-menu div element with properties
        var docsMnu = Util.cep("div", {
            "className" : "mmf-docs-menu",
            "id" : "docsMnu" + compId
        });
        
        docsMnu.innerHTML =  docsHTML;
        
        // Establish mouseEnter and mouseLeave events for the document menu box =======================================================================================
        // Sets the "is currently hovering" flag to the component (which prevents the closing of the document list box) when the user hovers over the document list box
        $(docsMnu).bind('mouseenter', {self:this}, function(event) {   
            var self = event.data.self;
            self.activelyHovering = true;
            self.docTimeout = setTimeout(function(){self.hideDocumentMenu(self);},self.clearTimeoutCount);
        });
        
        // add events to close the documents menu when mouse leaves the document menu
        $(docsMnu).bind('mouseleave', {self:this}, function(event) {   
            var self = event.data.self;
            self.activelyHovering = false;
            event.stopPropagation();
        });
        
        // Establish mouseEnter and mouseLeave events for the trigger icons =======================================================================================
        // add events to close the documents menu when mouse leaves the document menu trigger icon
        $(".mmf-show-related-docs-icon").bind('mouseleave', {self:this}, function(event) {   
            var self = event.data.self;
            self.activelyHovering = false;
            event.stopPropagation();
        });
        
		//append child (docsMnu) to the imgMenuId on the component
		var imageMenuId = component.rootNode$.find("#" + imgMenuId).parent();
		imageMenuId.append(docsMnu);
		
		Util.cancelBubble();
    }//endif docsLen
};

/**
 * This function will check if it is actively hovering over the document menu box or document related icon, it starts setTimeOut.
 * If it is not actively hovering or bypassCheck is not undefined (when the click event occurred to the view the another document menu box, 
 * it will clear the docTimeOut and close the current document menu box and set the edit mode to False where the yellow tooltips can be displayed again.
 * @param: {object}: component: this media gallery component.
 * @param: {optional}: it was passed with value (TRUE) when the document related icon is clicked. 
 * 
 */
MediaGalleryComponent.prototype.hideDocumentMenu = function(component, bypassCheck){
    if(this.activelyHovering === false || typeof(bypassCheck) !== "undefined"){
        this.docTimeout = null;
        $(".mmf-docs-menu").remove();
        this.setEditMode(false); // Setting this back to false re-enables our yellow tooltips
    }else{
        this.docTimeout = setTimeout(function(){component.hideDocumentMenu(component);},this.clearTimeoutCount);
    }
};

/**
 * postProcessing
 * Appends any events onto the relevant objects 
 */
MediaGalleryComponent.prototype.postProcessing = function(){
    var $self, $scopeObj, $allHyperLinkImages, $currentImageObj;
    var catName = this.getCriterion().category_mean;
    $self = this;
    
    //Find image link info, and apply click event to launch the Media Viewer
    $scopeObj = $("#" + this.m_rootComponentNode.id);
    //look for the image name link and date group link
    $allHyperLinkImages = $scopeObj.find(".mmf-imageLaunchViewer, .mmf-dateLinkLaunchViewer");
   
    for(var i=0; i<$allHyperLinkImages.length; i++){
        $currentImageObj    = $allHyperLinkImages[i];
        var currentImgAttr = $($currentImageObj).attr("name");
        if(currentImgAttr !== null){
            $($currentImageObj).click({component:$self,imageIdStr:currentImgAttr}, function(event) {
                var eData = event.data;
                //launch Media Viewer with passing the media viewer, category name and image id.
                eData.component.launchMediaViewer(eData.component.m_MediaViewerURL, catName, eData.imageIdStr);
            });
        }   
    }
    //Event handler to add closed class to the sub group header
    $self.rootNode$.off( "click", ".mmfgal-o1-info.result-info .sub-sec-hd-tgl");
    $self.rootNode$.on( "click", ".mmfgal-o1-info.result-info .sub-sec-hd-tgl",function(event) {
    	$( event.target ).closest( ".sub-sec.mmf-group" ).toggleClass( "closed");
    });
};
/**
 * Map the MMF Media Gallery option 1 object to the bedrock filter mapping so the architecture will know what object to create
 * when it sees the "MMF_MED_GAL" filter 
 */
MP_Util.setObjectDefinitionMapping("MMF_MED_GAL",MediaGalleryComponent);
