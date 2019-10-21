/**
* @class
*/
function NeonateOverviewComponentStyle()
{
	this.initByNamespace("neooverview");
}

NeonateOverviewComponentStyle.inherits(ComponentStyle);

/**
 * Overview component
 * @class
 * @param {Criterion} criterion
 */
function NeonateOverviewComponent(criterion){
	this.setCriterion(criterion);
	this.setStyles(new NeonateOverviewComponentStyle());
	this.setIncludeLineNumber(false);
	
	var egaBallardEvents = "0.0";
	var neuroEvents = "0.0";
	var physEvents = "0.0";
	var apgar1Events = "0.0";
	var apgar1CompEvents = "0.0";
	var apgar5Events = "0.0";
	var apgar5CompEvents = "0.0";
	var apgar10Events = "0.0";
	var apgar10CompEvents = "0.0";
	var deliveryEvents = "0.0";
	var newbornEvents = "0.0";
	var maternalEvents = "0.0";
	var newbornDateTimeOfBirthEvent = "0.0";
	
	this.dayOfLifeStart = -1;
	this.dayOfLifeIncrement = -1;
	
	this.apgar1Seqs = [];
	this.apgar5Seqs = [];
	this.apgar10Seqs = [];
	this.deliverySeqs = [];
	this.maternalSeqs = [];
	this.newbornSeqs = [];


	this.setComponentLoadTimerName("USR:MPG.NeonateOverviewComponent.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.NeonateOverviewComponent.O1 - render component");
	
    NeonateOverviewComponent.method("InsertData", function(){
    	retrieveGroups(this);
		CERN_NB_OVERVIEW_O1.GetOverviewTable(this);
    });
	NeonateOverviewComponent.method("HandleSuccess", function(recordData){		
		CERN_NB_OVERVIEW_O1.RenderComponent(this, recordData);
	});
	NeonateOverviewComponent.method("getEgaByBallardEvents", function () {
        return  egaBallardEvents;
    });
    NeonateOverviewComponent.method("getNeuroMaturityEvents", function () {
        return neuroEvents;
    });
    NeonateOverviewComponent.method("getPhysMaturityEvents", function () {
        return physEvents;
    });
    NeonateOverviewComponent.method("getApgar1Events", function () {
        return apgar1Events;
    });
    NeonateOverviewComponent.method("getApgar1CompEvents", function () {
        return apgar1CompEvents;
    });
    NeonateOverviewComponent.method("getApgar5Events", function () {
        return apgar5Events;
    });
    NeonateOverviewComponent.method("getApgar5CompEvents", function () {
        return apgar5CompEvents;
    });
    NeonateOverviewComponent.method("getApgar10Events", function () {
        return apgar10Events;
    });
    NeonateOverviewComponent.method("getApgar10CompEvents", function () {
        return apgar10CompEvents;
    });
    NeonateOverviewComponent.method("getDeliveryInfoEvents", function () {
        return deliveryEvents;
    });
    NeonateOverviewComponent.method("getNewbornInfoEvents", function () {
        return newbornEvents;
    });
    NeonateOverviewComponent.method("getMaternalInfoEvents", function () {
        return maternalEvents;
    });
    NeonateOverviewComponent.method("getNewbornDateTimeOfBirth", function () {
        return newbornDateTimeOfBirthEvent;
    });
	
	
	NeonateOverviewComponent.method("getDayOfLifeStart", function () {
        return this.dayOfLifeStart;
    });
    NeonateOverviewComponent.method("setDayOfLifeStart", function (value) {
        this.dayOfLifeStart = value ? 1 : 0;
    });
	
    NeonateOverviewComponent.method("getDayOfLifeIncrement", function () {
        return this.dayOfLifeIncrement;
    });
    NeonateOverviewComponent.method("setDayOfLifeIncrement", function (value) {
        this.dayOfLifeIncrement = value ? 1 : 0;
    });
	
    
    NeonateOverviewComponent.method("getApgar1Seqs", function () {
        return this.apgar1Seqs;
    });
    NeonateOverviewComponent.method("setApgar1Seqs", function (value) {
		this.apgar1Seqs.push(value);
    });
    NeonateOverviewComponent.method("getApgar5Seqs", function () {
        return this.apgar5Seqs;
    });
    NeonateOverviewComponent.method("setApgar5Seqs", function (value) {
		this.apgar5Seqs.push(value);
    });
    NeonateOverviewComponent.method("getApgar10Seqs", function () {
        return this.apgar10Seqs;
    });
    NeonateOverviewComponent.method("setApgar10Seqs", function (value) {
		this.apgar10Seqs.push(value);
    });
    NeonateOverviewComponent.method("getDeliveryInfoSeqs", function () {
        return this.deliverySeqs;
    });
    NeonateOverviewComponent.method("setDeliveryInfoSeqs", function (value) {
		this.deliverySeqs.push(value);
    });
    NeonateOverviewComponent.method("getMaternalInfoSeqs", function () {
        return this.maternalSeqs;
    });
    NeonateOverviewComponent.method("setMaternalInfoSeqs", function (value) {
		this.maternalSeqs.push(value);
    });
    NeonateOverviewComponent.method("getNewbornInfoSeqs", function () {
        return this.newbornSeqs;
    });
    NeonateOverviewComponent.method("setNewbornInfoSeqs", function (value) {
		this.newbornSeqs.push(value);
    });
    

	function retrieveGroups(component){
        var groups = component.getGroups();
        var xl = (groups) ? groups.length : 0;
        for (var x = xl; x--; ) {
            var group = groups[x];            
            switch (group.getGroupName()) {
                case "NEO_EGA_BY_BALLARD":
                    egaBallardEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_NEURO_MATURITY":
                    neuroEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_PHYS_MATURITY":
                    physEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_APGAR_1_MIN":
                    apgar1Events = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_APGAR_1_MIN_COMP":
                    apgar1CompEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_APGAR_5_MIN":
                    apgar5Events = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_APGAR_5_MIN_COMP":
                    apgar5CompEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_APGAR_10_MIN":
                    apgar10Events = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_APGAR_10_MIN_COMP":
                    apgar10CompEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_DELIVERY_INFO":
                    deliveryEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_NEWBORN_INFO":
                    newbornEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break;
                case "NEO_MATERNAL_INFO":
                    maternalEvents = MP_Util.CreateParamArray(group.getEventSets(), 1);
                    break; 
                case "NEO_BIRTH_DT_TM":
                	newbornDateTimeOfBirthEvent = MP_Util.CreateParamArray(group.getEventCodes(), 1);
                    break;
            }
        }
    }
}

NeonateOverviewComponent.prototype = new MPageComponent();
NeonateOverviewComponent.prototype.constructor = MPageComponent;

NeonateOverviewComponent.prototype.loadFilterMappings = function() {

	// Add the filter mapping object for the Days of Life Start
	this.addFilterMappingObject("NEO_DOL_START", {
		setFunction : this.setDayOfLifeStart,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
	
	// Add the filter mapping object for the Days of Life Increment rate
	this.addFilterMappingObject("NEO_DOL_INCREMENT", {
		setFunction : this.setDayOfLifeIncrement,
		type : "BOOLEAN",
		field : "FREETEXT_DESC"
	});
};

MP_Util.setObjectDefinitionMapping("NEO_OVERVIEW", NeonateOverviewComponent);

 /**
  * Neonate Overview methods
  * @namespace CERN_NB_OVERVIEW_O1
  * @dependencies Script: mp_nb_get_overview
  */
var CERN_NB_OVERVIEW_O1 = function(){
    return {
        GetOverviewTable : function(component){
			var sendAr = [];
			var criterion = component.getCriterion();
			sendAr.push("^MINE^", 
				criterion.person_id + ".0",
				criterion.provider_id + ".0",
				criterion.ppr_cd + ".0", 
				component.getEgaByBallardEvents(),
				component.getApgar1Events(),
				component.getApgar5Events(),
				component.getApgar10Events(),
				component.getApgar1CompEvents(),
				component.getApgar5CompEvents(),
				component.getApgar10CompEvents(),
				component.getDeliveryInfoEvents(),
				component.getNewbornInfoEvents(),
				component.getMaternalInfoEvents(),
				component.getNeuroMaturityEvents(),
				component.getPhysMaturityEvents(),
				component.getNewbornDateTimeOfBirth(),
				component.getDayOfLifeStart(),
				component.getDayOfLifeIncrement());
							
			MP_Core.XMLCclRequestWrapper(component, "MP_GET_NEONATE_OVERVIEW", sendAr, true);
        },
		RenderComponent : function(component, recordData){
			try
			{
				var df = MP_Util.GetDateFormatter();
				var i18n_no = i18n.discernabu.neonateoverview_o1;
				var contentId = component.getStyles().getContentId();
				var rootId = component.getStyles().getId();
				var contacts = recordData.CONTACT_INFO.CONTACT;
				
				//This is a quick hack to work around a non passive change in how CCL generates JSON
				//CONTACT_INFO could either be an object or an array containing a single object
				//If we don't get the CONTACT array the first way, try the second
				//(We could also change the script so that the contact_info item in the record structure
				//is variable length instead of fixed)
				if (contacts === undefined) {
					contacts = recordData.CONTACT_INFO[0].CONTACT;
				}
				var contactTableHTML = ""
				var deliveryTable = ["<table class='neooverview-table'>"];
				var ageHours = recordData.AGE_HOURS;
				var dayOfLife = (recordData.DAYS_OF_LIFE !== -1) ? recordData.DAYS_OF_LIFE : "--";
				var gestAge = (recordData.BIRTH_GEST_AGE !== 0) ? ageFormat(recordData.BIRTH_GEST_AGE) : "--";
			    var pma = (recordData.BIRTH_GEST_AGE !== 0) ? ageFormat(recordData.PMA) : "--";
						
			    function ageFormat(days){
					var weeks = Math.floor(days/7);
					var remDays = days%7;
					return [weeks, i18n_no.WEEKS, remDays, i18n_no.DAYS].join(" ");
				}
				
				//There's got to be a better way to generate column oriented tables but its escaping me so this is the best i could do
				//maybe it would be better to restructure the script reply than to build column1 here
				var column1 = [];
				column1.push({LABEL: i18n_no.BIRTH_DT, VALUE: df.formatISO8601(recordData.DOB,mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)}); 
				//not sure if it would be better to send the date from the script differently so it doesn't require UTC flag
				column1.push({LABEL: i18n_no.EGA_BALLARD, VALUE: recordData.EGA_BALLARD, 
					HOVER_DATA: recordData.BALLARD_DETAILS, HOVER_FXN: ballardDetails});
				column1.push({LABEL: i18n_no.SEX, VALUE: recordData.SEX});
				column1.push({LABEL: i18n_no.APGAR_1, VALUE: recordData.APGAR1MIN, 
					HOVER_DATA: recordData.APGAR1DETAILS, HOVER_FXN: generateDetails});
				column1.push({LABEL: i18n_no.APGAR_5, VALUE: recordData.APGAR5MIN, 
					HOVER_DATA: recordData.APGAR5DETAILS, HOVER_FXN: generateDetails});
				column1.push({LABEL: i18n_no.APGAR_10, VALUE: recordData.APGAR10MIN, 
					HOVER_DATA: recordData.APGAR10DETAILS, HOVER_FXN: generateDetails});
				
				function sortOverviewInfo(a,b) {
					if(a.ID > b.ID) {
						return 1;
					} else {
						if(a.ID < b.ID) {
							return -1;
						}
					}
					return 0;
				}
				
				var d_seqs = component.getDeliveryInfoSeqs();
				jQuery.each(recordData.DELIVERY, function(s) {
					jQuery.each(d_seqs[0], function() {
						if(this.id === recordData.DELIVERY[s].ID) {
							recordData.DELIVERY[s].ID = this.seq;
						}
					});
				});
				recordData.DELIVERY.sort(sortOverviewInfo);
				jQuery.each(recordData.DELIVERY, function(i){ 
			    column1.push(this); });
				
				var column2 = recordData.NEWBORN;
				var n_seqs = component.getNewbornInfoSeqs();
				jQuery.each(column2, function(s) {
					jQuery.each(n_seqs[0], function() {
						if(this.id === column2[s].ID) {
							column2[s].ID = this.seq;
						}
					});
				});
				column2.sort(sortOverviewInfo);
				
				var column3 = recordData.MATERNAL;
				var m_seqs = component.getMaternalInfoSeqs();
				jQuery.each(column3, function(s) {
					jQuery.each(m_seqs[0], function() {
						if(this.id === column3[s].ID) {
							column3[s].ID = this.seq;
						}
					});
				});
				column3.sort(sortOverviewInfo);
				
				//generate as many rows as the needed for the column with the most items
				var rowCount = Math.max(column1.length,column2.length,column3.length);
				generateDeliveryRow(rowCount);

				function generateDeliveryRow(n) {
					function generateDeliveryCells(item) {
						var label = (!item) ? "&nbsp;" : item.LABEL + ": ";
						var value = (!item || item.VALUE.length===0) ? "&nbsp;" : item.VALUE;
						var hoverHTML = "";
						
						var dttm = value.indexOf("{date_value}");
						if (dttm > -1) {
							value = df.formatISO8601(value.substr(dttm+12), mp_formatter.DateTimeFormatter.FULL_DATE_TIME_4YEAR)
						}
						
						//if it exists, invoke the hover generating callback for this item
						if (item && item.HOVER_DATA && item.VALUE !== "") {
							hoverHTML = item.HOVER_FXN(item.HOVER_DATA);
						}
						return "<td class='label'>"+label+"</td><td class='value'><dl>"+value+"</dl>"+hoverHTML+"</td>"
					}
					
					for (var i = 0; i < n; i++) {
						var col1 = generateDeliveryCells(column1[i]);
						var col2 = generateDeliveryCells(column2[i]);
						var col3 = generateDeliveryCells(column3[i]);
						var rowHTML = "<tr>" + col1 + col2 + col3 + "</tr>";
						deliveryTable.push(rowHTML);
					}
				}
				
				//generic detail hover generating callback that expects an array of objects
				//with LABEL and VALUE properties
				function generateDetails(detailData) {
					if (detailData.length === 0){
						return "";
					};
				
				    var detailsTMP = [];				
			        jQuery.each(detailData, function(d){
						detailsTMP.push("<dt><span>"+this.LABEL+": </span></dt><dd><span>"+this.VALUE+"</span></dd>");
					});
					var detailsHTML = detailsTMP.join("");
					return "<div class='hvr'><dl>"+detailsHTML+"</dl><div>"; 	
				}
				
				//generates the hover div for the ballard details
				function ballardDetails(detailData) {
					var detailsHTML = [];
					function addDetails(header, details){
						if (details.length === 0) {
							return;
						}
						detailsHTML.push(header+"<p>");  
						var subDetailsTMP = [];				
			        	jQuery.each(details,function(d){
							subDetailsTMP.push("<dt><span>"+this.LABEL+": </span></dt><dd><span>"+this.VALUE+"</span></dd>");
						});
						var subDetailsHTML = subDetailsTMP.join("");
						detailsHTML.push("<dl>"+subDetailsHTML+"</dl><br>");
					};
					if (!detailData) {
						return "";
					}
					//This is a quick hack to work around a non passive change in how CCL generates JSON
					//detailData could either be an object or an array containing a single object
					//If we don't get the NEURO or PHYSICIAL arrays the first way, try the second				
					if (detailData.NEURO === undefined || detailData.PHYSICAL === undefined) {
						detailData = detailData[0];
					}
					addDetails(i18n_no.NEURO, detailData.NEURO);
					addDetails(i18n_no.PHYSICAL, detailData.PHYSICAL);

					return "<div class='hvr'>"+detailsHTML.join("")+"<div>";
				}
				
				deliveryTable.push("</table>");
				var deliveryTableHTML = deliveryTable.join("");
				
				//Generate the HTML table for the contacts tab
				var mother="";
				jQuery.each(contacts, function(c){
					if (this.TYPE==="MOTHER") { mother = this };
				});
				
				var father="";
				jQuery.each(contacts, function(c){
					if (this.TYPE==="FATHER") { father = this };
				});
				
				var peds=[];
				jQuery.each(contacts, function(c){
					if (this.TYPE==="PEDIATRICIAN") { peds.push(this) };
				});
				
				var rowCounter = 0;
				contactTableHTML = "<table class='neooverview-contact-table'>" + generateContactRow(mother) + generateContactRow(father);
				
				var pedsStr = []; 
				jQuery.each(peds,function(dr){
					pedsStr.push(generateContactRow(this));
				})
				contactTableHTML += pedsStr.join("") + "</table>";
				
				String.prototype.repeat = function(num)
				{
					return new Array(num + 1).join(this);
				}
				
				//TODO: surely there's a better way to make sure the table cells are wide enough than adding spaces
				var space="&nbsp;";
				var tabMenuHTML = "<table><tr class='neonateoverview-table-header-border'><td>\
									<ul class='neooverview-tabmenu'>\
									<li ><a id='neooverview-tab1' class='active' href=''>"+i18n_no.DELIVERY_SUMMARY+space.repeat(12)+"</a></li>\
									<li ><a id='neooverview-tab2' class='inactive' href=''>"+i18n_no.CONTACT_INFO+space.repeat(19)+"</a></li>\
									</ul></td><td class='neooverview-day-of-life neooverview-day-of-life-width'><dl>"+i18n_no.DAYS_OF_LIFE+": "+dayOfLife+"</dl><div class='hvr'>"+ageHours+" "+i18n_no.HOURS+"</div><td>\
									<td class='neooverview-day-of-life neooverview-ga-at-birth-width'>"+i18n_no.GA_BIRTH+": "+gestAge+"<td>\
									<td class='neooverview-day-of-life neooverview-pma-width'>"+i18n_no.PMA+": "+pma+"<td></tr>\
								</table>";
				var tempAr = new Array();
				jQuery("#"+contentId).append(tabMenuHTML);
				jQuery("#"+contentId).append("<div id='delivery-summary-tab'>"+deliveryTableHTML+"</div>");
				jQuery("#"+contentId).append("<div id='contact-info-tab' style='display:none'>"+contactTableHTML+"</div>");
				
				//add the classes for zebra stripe styling to the contact table rows.  it just seemed easier to do
				//it this way than when generating the HTML.
				//get the set of <tr> element descendents of the contact-table, and add the "odd" class to every other element
				jQuery(".neooverview-contact-table tr").filter(":odd").addClass("odd")
				
				function generateContactRow(contact) {
					if (!contact) {
						return "";
					}
					var name = contact.LABEL + ": " + contact.NAME;

					var phonesTMP = [];				
			        jQuery.each(contact.PHONE,function(p){
			        	phonesTMP.push(this.LABEL + ": " + this.NUMBER);
			        });
			        var phones = phonesTMP.join("<br/>");
					
					var addr = (contact.STREET_ADDRESS !== "") ? i18n_no.ADDRESS + ": " + contact.STREET_ADDRESS : "";
					var addr2 = contact.CITY + " " + contact.STATE + " " + contact.ZIP
					
					//var rowClass = (++rowCounter % 2) ? "even" : "odd";
				
					var rowHTML = "<tr><td>"+name+"</td><td>"+phones+"</td><td>"+addr+"</td><td>"+addr2+"</td></tr>";
					return rowHTML;
				}
											
				var activateTab = function() {
					//define a mapping between the tab <a> elements and the tab content <divs>
					var tab2div = {
						"neooverview-tab1": "delivery-summary-tab", 
						"neooverview-tab2": "contact-info-tab"
					};
					return function(event){
						//select all <a> elements containing "neooverview-tab" in the id and inactivate them
						event.preventDefault();
						var tabs = jQuery("a[id*='neooverview-tab']");
						tabs.attr("class", "inactive");
						
						//and hide the div associated to each tab
						for(var i = 0; i < tabs.length; i++){
							jQuery("#"+tab2div[tabs[i].id]).css("display", "none");
						}
						
						//and now activate the selected tab
						//(jQuery binds "this" in the event callback to the element on which the event was triggered)
						jQuery(this).attr("class", "active");
						//and display the div associated to it
						var tabKey = jQuery(this).attr("id");
						jQuery("#"+tab2div[tabKey]).css("display", "block");
					}
			    }();
			
			    //bind the click event on the tab <a>'s to our handler
			    jQuery("a[id*='neooverview-tab']").click(activateTab);
							
				var hoverStyle = Util.Style.g("hvr",_g(rootId),"div");
			    jQuery.each(hoverStyle,function(div){
				     hs(Util.gp(this),this,component);
			    });
				
				//i'm not sure if it's preferable to override the width this way
				//or to create a different hover class in the css to handle a hover
				//where it doesn't make sense to use the same width as all the other
				//hovers
				jQuery(".neooverview-day-of-life .hvr").css("width", "5em");
			
				var sResultText = MP_Util.CreateTitleText(component, 0);
				var totalCount = Util.Style.g("sec-total", component.getRootComponentNode(), "span");
				totalCount[0].innerHTML = sResultText;
			}
			catch(err){
				alert(err.message);
			}
		}
    };
}();