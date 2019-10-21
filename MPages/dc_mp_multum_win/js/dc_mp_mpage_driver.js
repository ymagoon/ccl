var MpageDriver = function(){
    var MPAGECOMPONENTSLIST = [],criterion = {};
    
    // Get preference by id
    function getPreference(prefsList, prefIdField, prefId){
        for (var j = 0, plen = prefsList.length; j < plen; j++) {
            if (((prefsList[j])[prefIdField]) == prefId) {
                return prefsList[j];
            }
        }
        return null;
    }
    
    /***** Error handling functions ***/
    function errmsg(msg, det){
        alert(msg + "--" + det)
    }
    return {
		getComponentsList : function(){return MPAGECOMPONENTSLIST;},
        
        loadMpage: function(jsonData){
            try {
              	var prefList = jsonData.response, curPref, 
					dmMpageLayout = new MpageLayout()
					, newMpageComponent
					, newMpageComponentType
					, criterion = {}
				
				//MULTUM:
				var m_jsonUtil = new UtilJsonXml();
				
				var jsonAlertData = m_jsonUtil.parse_json(m_AlertDataJSON);
				instantiateNeededComponents(jsonAlertData.ALERTDATA);
				criterion.encounter_id = jsonAlertData.ALERTDATA.ENCNTR_ID + ".0";
				criterion.person_id = jsonAlertData.ALERTDATA.PERSON_ID + ".0";
				// Create Mpage Layout	
                dmMpageLayout.createColumnLayout({
                    "layoutTitle": prefList.TITLE,
                    "columns": prefList.COLUMNS,
                    "toggleComponentsTitle": [ "(Collapse All)", "(Expand All)"],
                    "toggleComponentsHover": [" Collapse All ", " Expand All "]
                });
				
				//MULTUM: Add link to MAR
				//dmMpageLayout.insertHeaderLink("<a href='javascript:APPLINK(0, \"Powerchart.exe\", \"/PERSONID="+criterion.person_id+" /ENCNTRID="+criterion.encounter_id+" /FIRSTTAB=^Task List^\")'> MAR </a>", 1);
				//dmMpageLayout.insertHeaderLink("<a href='javascript:APPLINK(100, \"http://www.cerner.com\", \"\");'> MAR </a>", 1);
				//dmMpageLayout.insertHeaderLink("<a href='javascript:MPAGES_EVENT(\"ORDERS\",\"1416145.0000|3842513.00|{CANCEL DC|4711432}|0|{3|127}|32|1\")'>Add a new order</a>");
                // Create and Insert Mpage Components into Layout
                for (var i = 0, len = MPAGECOMPONENTSLIST.length; i < len; i++) {
					
                    newMpageComponent = MPAGECOMPONENTSLIST[i].component;
                    newMpageComponentType = MPAGECOMPONENTSLIST[i].componentType;
					//TODO: Change to SWITCH Statement
                    if (newMpageComponentType && newMpageComponentType.toUpperCase() == "BANNER") {
                    	// Initiate component load
						dmMpageLayout.insertBanner(newMpageComponent);
                        newMpageComponent.load(criterion);
                    }
					else if (newMpageComponentType && newMpageComponentType.toUpperCase() == "ALERT") {
                    	// Initiate component load
						dmMpageLayout.attachComponent(newMpageComponent, dmMpageLayout.getHeaderAlertDOM(), "section");
                        newMpageComponent.load(criterion);
                    }
					else if (newMpageComponentType && newMpageComponentType.toUpperCase() == "FOOTER") {
                    	// Initiate component load
						dmMpageLayout.attachComponent(newMpageComponent, dmMpageLayout.getLayoutFooterDOM(), "section");
                        newMpageComponent.load(criterion);
                    }
                    else {
						// Get Preference for the current component	
                        if (newMpageComponent.meaning) {
                            curPref = getPreference(prefList.COMPONENTS, "MEANING", newMpageComponent.meaning);
                        }
						
						if (curPref !== null) {
							// Setup component UI
							newMpageComponent.createComponent({
								"header": curPref.TITLE,
								"row": parseInt(curPref.ROW,10),
								"columnSpan":parseInt(curPref.COLUMNSPAN,10),
								"column": parseInt(curPref.COLUMN,10),
								"loadingDisplay": "Loading...",
								"toggleTitle": ["+", "-"],
								"toggleHover": ["Expand Component", "Collapse Component"]
							});
							
						}
						else{							
                            newMpageComponent.createComponent({
                                "header": "Undefined Component",
                                "toggleTitle": ["+", "-"],
                                "toggleHover": ["Expand Component", "Collapse Component"]
                            });
						}
						
                      // Insert component into layout
					 
					   dmMpageLayout.insertComponent(newMpageComponent);
					   
                       // Initiate component load
                       newMpageComponent.initialize(criterion);
                    }
                }
				
                //document.body.innerHTML = "";
                // Add the Layout DOM to Body
                Util.ac(dmMpageLayout.getHeaderDOM(), document.body);
				//MULTUM: 
				Util.ac(dmMpageLayout.getHeaderAlertDOM(), document.body);
                Util.ac(dmMpageLayout.getBannerDOM(), document.body);
                Util.ac(dmMpageLayout.getLayoutDOM(), document.body);
				Util.ac(dmMpageLayout.getLayoutFooterDOM(), document.body);
                // Notify all Mpage Components of DOM insertion
				badFixSelectBoxDataWidthIE();
				MpageDriver.DOMReady();


            } 
            catch (e) {
                alert(e.message + "loadMpage")
            }
        },
        
        register: function(MpageComponent){
			if (MpageComponent instanceof Array) {
				for (var i = MpageComponent.length; i--;) {
					MPAGECOMPONENTSLIST.push(MpageComponent[i]);
				}
			}
			else {
				MPAGECOMPONENTSLIST.push(MpageComponent);
			}
        },
    	setCriterion: function(crit){
    		criterion = crit;
    	}
    }
    
}();

/**
	* Call an MpageComponent from another MpageComponent
	* @author RB018070
	* @memberOf MpageDriver
	* @method
	* @param   {JSONObject} cData  Preferences to call the component <br/><br/>
	* 				{<br/> 
	* 					&nbsp; <b>meaning		&nbsp;: meaning of the component to call</b> (ex: LabsComponent_1),<br/>
	* 					&nbsp; <b>caller 	&nbsp;: Description of the calling entity</b>   (ex: MicroComponent_1))  ,<br/>
	* 					&nbsp; <b>dataType &nbsp;: Type of data passed to the component</b>  (ex: HTML, JSON, XML etc) ,<br/> 
	* 					&nbsp; <b>data &nbsp;: Data passed to the component</b>  (ex: 2 ) ,<br/> 
	* 					&nbsp; <b>triggerLoad &nbsp;: Indicate to load the called component</b>  (ex: true/false ) ,<br/> 
	* 					&nbsp; <b>triggerCriterion &nbsp;: Criterion to load the called component </b>  (ex: {"person_id":123423,"encounter_id":12342}) ,<br/>
	* 					&nbsp; <b>targetFunction &nbsp;: Indicate the function to call on the called component</b>,<br/> 
	* 					additional user prefs can be defined here}
	*/
MpageDriver.callComponent = function(cData) {
	if(cData && cData.meaning){
		var targetComponent = cData.meaning
			,cntr = 0
			,componentsList = MpageDriver.getComponentsList()
			,currentComponent
			,length = componentsList.length;
		while (cntr < length) {
			currentComponent = componentsList[cntr].component;
			if (currentComponent.meaning === targetComponent) {		
				if(cData.targetFunction){
					if(currentComponent[cData.targetFunction]){
						currentComponent[cData.targetFunction](cData)
					}
				}
				else{	
					currentComponent.listener(cData);
				}
			}
			cntr += 1;			
		}		
	}
};

/**
	* Called when MpageLayout has been appended to body (DOM is ready) <br/>
	* this method will trigger the onDOMLoad call per component to trigger DOM dependent functionality
	* @author RB018070
	* @memberOf MpageDriver
	* @method
	*/
MpageDriver.DOMReady = function(){
		var cntr = 0
			,componentsList = MpageDriver.getComponentsList()
			,currentComponent
			,length = componentsList.length
			,dcntr = 0
			,dlength = 0;
		while (cntr < length) {
			dcntr = 0;
			currentComponent = componentsList[cntr].component;
			if (currentComponent.onDOMLoad && currentComponent.onDOMLoad.length > 0) {	
				dlength = currentComponent.onDOMLoad.length;
				while(dcntr < dlength){
					currentComponent.onDOMLoad[dcntr]();
					dcntr += 1;
				}
			}
			cntr += 1;			
		}		
	
}

/* Triggering load of Mpage on window load
*/
function loadMpage(){
	
	try {
		var json_handler = new UtilJsonXml(), cclParam = "'MINE'";
		MpageDriver.loadMpage({
			"response": {
				"TITLE": "Medication Clinical Decision Support (mCDS)",
				"COLUMNS": 1,
				"COMPONENTS": [{
					"MEANING": "Interaction-Alg",
					"TITLE": "Allergy",
					"ROW": 1,
					"COLUMN": 1
				}, {
					"MEANING": "Interaction-DrugDrug",
					"TITLE": "Drug/Drug",
					"ROW": 2,
					"COLUMN": 1
				},
				{
					"MEANING": "Interaction-DrugFood",
					"TITLE": "Drug/Food",
					"ROW": 3,
					"COLUMN": 1
				},
				{
					"MEANING": "Interaction-DupTherapy",
					"TITLE": "Duplicate Therapy",
					"ROW": 4,
					"COLUMN": 1
				}]
			}
		});
	}
	catch(err){
	
		alert("Error loading MPage: " + "JavaScript Error \n"
					+ "Message: " + err.message + " \n"
					+ "Name: " + err.name + " \n"
					+ "Number: "+ (err.number & 0xFFFF) + "\n"
					+"Description: " + err.description + "");
	}
    
}

function badFixSelectBoxDataWidthIE() {
    if ($.browser.msie) {
        $('select').each(function() {
			if ($(this).attr('id') != "masterOr") {
				if ($(this).attr('multiple') == false) {
					$(this).mousedown(function(){
						if ($(this).css("width") != "auto") {
							var width = $(this).width();
							$(this).data("origWidth", $(this).css("width")).css("width", "auto");
							
							// If the width is now less than before then undo
							if ($(this).width() < width) {
								$(this).unbind('mousedown');
								$(this).css("width", $(this).data("origWidth"));
							}
						}
					})		// Handle blur if the user does not change the value
					.blur(function(){
						$(this).css("width", "80%");
					})		// Handle change of the user does change the value
					/*.change(function(){
						$(this).css("width", "89%");
					})*/;
				}
			}
		});
    }
}

