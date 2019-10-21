if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
	var ieVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
}
else {
	var ieVersion=0;
}
/**
 * Lab Console 
 * 
 * @param {Criterion} criterion
 * @author Amy Gum
 */

function RenderPage()
{	

	
	var js_criterion = JSON.parse(m_criterionJSON);
	var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);
	//var mpage = new MPage();
	
	//One column is used for in ie6 for CSS reasons
	var ie6 = false; 
	if((ieVersion != 0) && (ieVersion < 7)){
		ie6 = true;
	}
	
	MP_LAB_CONSOLE.StartUp(criterion);
	//Tab name and number for the Order Details tab
	MP_LAB_CONSOLE.SetOrderDetailsTab("PAGE_TAB_04", 4);
	
	var tabWelcome = new MPage(); //Welcome
	var tabScientist = new MPage(); //Lab Scientist
	var tabSuper = new MPage(); //Lab Supervisor
	var tabDetails = new MPage(); //order details

	var startPage = 0;
	tabWelcome.setName(i18n.lab.labconsole_o1.WELCOME);
	tabWelcome.setPageId("lab_console_welcome");
	tabWelcome.setCriterion(criterion);	
	
	//If you want to read the Web Components from Preference manager,
	//Leave this code here.  Otherwise, define the web components yourself.
	var facility_cd = 0;
	if(criterion.position_cd> 0){
		facility_cd = criterion.position_cd;
	}
	var paramsAr = [];
	paramsAr.push("MINE");
	paramsAr.push(facility_cd+".00");
		MP_Core.XMLCclRequestWrapper_notComponent("USR:MPG.LABMANAGERPREFS.O1 - load pref manager prefs", "pnc_get_startup_prefs", paramsAr, false, function(data, failure){
			if(!failure){
				startPage = parseInt(data.START_UP_PAGE)
				var pageCount = data.WELCOME_PAGES.length
				for (var x = 0; x < pageCount; x++)
				{
					var str = data.WELCOME_PAGES[x].VALUE.split("]");
					str[0] = str[0].replace(/\[/g,"").replace(/\_/g," ");
					str[1] = str[1].replace(/\[/g,"");

					var oWebControl1 = new WebComponent(criterion, {url:str[1]});
					oWebControl1.setPlusAddEnabled(false);
					oWebControl1.setLabel(str[0]);
					oWebControl1.setComponentId("WC0"+x);
					if(x%2 == 0){
						oWebControl1.setColumn(1);
					}else{
						oWebControl1.setColumn(2);
					}
					oWebControl1.setSequence(1);
					oWebControl1.setExpanded(true);
					oWebControl1.setScrollNumber(20);
					oWebControl1.setScrollingEnabled(false);
					oWebControl1.setPageGroupSequence(1);
					tabWelcome.addComponent(oWebControl1);
				}
			}
	});

	tabScientist.setName(i18n.lab.labconsole_o1.LAB_SCIENTIST);
	tabScientist.setPageId("lab_console_scientist");
	tabScientist.setCriterion(criterion);
		
	var oPendingOrders = new PendingOrdersComponent(criterion);
	oPendingOrders.setPlusAddEnabled(false);
	oPendingOrders.setLabel(i18n.lab.labconsole_o1.PENDING_ORDERS);
	oPendingOrders.setComponentId("POR01");
	oPendingOrders.setColumn(1);
	oPendingOrders.setSequence(1);
	oPendingOrders.setExpanded(true);
	oPendingOrders.setScrollNumber(20);
	oPendingOrders.setScrollingEnabled(false);
	oPendingOrders.setPageGroupSequence(1);
	tabScientist.addComponent(oPendingOrders);
	
	var oTATMonitor = new TATMonitorComponent(criterion);
	oTATMonitor.setPlusAddEnabled(false);
	oTATMonitor.setLabel(i18n.lab.labconsole_o1.TAT_MONITOR);
	oTATMonitor.setComponentId("TAT0001");
	oTATMonitor.setColumn(1);
	oTATMonitor.setSequence(1);
	oTATMonitor.setExpanded(true);
	oTATMonitor.setScrollNumber(10);
	oTATMonitor.setScrollingEnabled(false);
	oTATMonitor.setIncludeLineNumber(false);
	oTATMonitor.setPageGroupSequence(2);
	tabScientist.addComponent(oTATMonitor);	
	
	var oInstrumentMonitor = new InstrumentActivityComponent(criterion);
	oInstrumentMonitor.setPlusAddEnabled(false);
	oInstrumentMonitor.setLabel(i18n.lab.labconsole_o1.INSTR_ACTIVITY);
	oInstrumentMonitor.setComponentId("IA0001");
	if(ie6){
		oInstrumentMonitor.setColumn(1);
		oInstrumentMonitor.setSequence(2);
	}else{
		oInstrumentMonitor.setColumn(2);
		oInstrumentMonitor.setSequence(1);
	}
	oInstrumentMonitor.setExpanded(true);
	oInstrumentMonitor.setScrollNumber(10);
	oInstrumentMonitor.setScrollingEnabled(false);
	oInstrumentMonitor.setIncludeLineNumber(false);
	oInstrumentMonitor.setPageGroupSequence(2);
	tabScientist.addComponent(oInstrumentMonitor);	

	var oPersonDemog = new PersonDemogComponent(criterion);
	oPersonDemog.setPlusAddEnabled(false);
	oPersonDemog.setLabel(i18n.lab.labconsole_o1.PERSON_DEMOG);
	oPersonDemog.setComponentId("PD01");
	oPersonDemog.setColumn(1);
	oPersonDemog.setSequence(1);
	oPersonDemog.setExpanded(true);
	oPersonDemog.setScrollNumber(20);
	oPersonDemog.setScrollingEnabled(false);
	oPersonDemog.setPageGroupSequence(3);
	tabScientist.addComponent(oPersonDemog);
	
	var oOrderList = new OrderListComponent(criterion);
	oOrderList.setPlusAddEnabled(false);
	oOrderList.setLabel(i18n.lab.labconsole_o1.ORDER_LIST);
	oOrderList.setComponentId("ODL0001");
	oOrderList.setColumn(1);
	oOrderList.setSequence(2);
	oOrderList.setExpanded(true);
	oOrderList.setScrollNumber(10);
	oOrderList.setScrollingEnabled(false);
	oOrderList.setIncludeLineNumber(false);
	oOrderList.setPageGroupSequence(3);
	tabScientist.addComponent(oOrderList);
	
	var oLabComments = new LabCommentsComponent(criterion);
	oLabComments.setPlusAddEnabled(false);
	oLabComments.setLabel(i18n.COMMENTS);
	oLabComments.setComponentId("LC01");
	oLabComments.setColumn(1);
	oLabComments.setSequence(1);
	oLabComments.setExpanded(true);
	oLabComments.setScrollNumber(20);
	oLabComments.setScrollingEnabled(false);
	oLabComments.setPageGroupSequence(4);
	tabScientist.addComponent(oLabComments);
	
	var oContainers = new consoleContainerComponent(criterion);
	oContainers.setPlusAddEnabled(false);
	oContainers.setLabel(i18n.lab.labconsole_o1.CONTAINERS);
	oContainers.setComponentId("CC0001");
	if(ie6){
		oContainers.setColumn(1);
		oContainers.setSequence(2);		
	}else{
		oContainers.setColumn(2);
		oContainers.setSequence(1);		
	}

	oContainers.setExpanded(true);
	oContainers.setScrollNumber(10);
	oContainers.setScrollingEnabled(false);
	oContainers.setIncludeLineNumber(false);
	oContainers.setPageGroupSequence(4);
	tabScientist.addComponent(oContainers);
		
	tabSuper.setName(i18n.lab.labconsole_o1.LAB_SUPERVISOR);
	tabSuper.setPageId("lab_console_super")
	tabSuper.setCriterion(criterion);
	
	var oTATMonitor2 = new TATMonitorComponent(criterion);
	oTATMonitor2.setPlusAddEnabled(false);
	oTATMonitor2.setLabel(i18n.lab.labconsole_o1.TAT_MONITOR);
	oTATMonitor2.setComponentId("TAT0002");
	oTATMonitor2.setColumn(1);
	oTATMonitor2.setSequence(1);
	oTATMonitor2.setExpanded(true);
	oTATMonitor2.setScrollNumber(10);
	oTATMonitor2.setScrollingEnabled(false);
	oTATMonitor2.setIncludeLineNumber(false);
	tabSuper.addComponent(oTATMonitor2);	
	
	var oQCInquiry = new QCInquiryComponent(criterion);
	oQCInquiry.setPlusAddEnabled(false);
	oQCInquiry.setLabel(i18n.lab.labconsole_o1.QC_INQUIRY);
	oQCInquiry.setComponentId("QCI0001");
	oQCInquiry.setColumn(1);
	oQCInquiry.setSequence(2);
	oQCInquiry.setExpanded(true);
	oQCInquiry.setScrollNumber(10);
	oQCInquiry.setScrollingEnabled(false);
    oQCInquiry.setIncludeLineNumber(false);
	tabSuper.addComponent(oQCInquiry);		
	
	var oReviewQueueSum = new ReviewQueueSumComponent(criterion);
	oReviewQueueSum.setPlusAddEnabled(false);
	oReviewQueueSum.setLabel(i18n.lab.labconsole_o1.REVIEW_QUEUE_SUMMARY);
	oReviewQueueSum.setComponentId("RQ01");
	oReviewQueueSum.setColumn(1);
	oReviewQueueSum.setSequence(2);
	oReviewQueueSum.setExpanded(true);
	oReviewQueueSum.setScrollNumber(20);
	oReviewQueueSum.setScrollingEnabled(false);	
	tabSuper.addComponent(oReviewQueueSum);	
	
	tabDetails.setName(i18n.lab.labconsole_o1.ORDER_DETAILS);
	tabDetails.setPageId("lab_console_details")
	tabDetails.setCriterion(criterion);

	
	var oPersonDemog2 = new PersonDemogComponent(criterion);
	oPersonDemog2.setPlusAddEnabled(false);
	oPersonDemog2.setLabel(i18n.lab.labconsole_o1.PERSON_DEMOG);
	oPersonDemog2.setComponentId("PD02");
	oPersonDemog2.setColumn(1);
	oPersonDemog2.setSequence(1);
	oPersonDemog2.setExpanded(true);
	oPersonDemog2.setScrollNumber(20);
	oPersonDemog2.setScrollingEnabled(false);
	oPersonDemog2.setPageGroupSequence(1);
	tabDetails.addComponent(oPersonDemog2);
	
	var oOrderList2 = new OrderListComponent(criterion);
	oOrderList2.setPlusAddEnabled(false);
	oOrderList2.setLabel(i18n.lab.labconsole_o1.ORDER_LIST);
	oOrderList2.setComponentId("ODL0002");
	oOrderList2.setColumn(1);
	oOrderList2.setSequence(2);
	oOrderList2.setExpanded(true);
	oOrderList2.setScrollNumber(10);
	oOrderList2.setScrollingEnabled(false);
	oOrderList2.setIncludeLineNumber(false);
	oOrderList2.setPageGroupSequence(1);
	tabDetails.addComponent(oOrderList2);
	
	var oResults = new OrderResultsComponent(criterion);
	oResults.setPlusAddEnabled(false);
	oResults.setLabel(i18n.lab.labconsole_o1.RESULTS);
	oResults.setComponentId("OR01");
	oResults.setColumn(1);
	oResults.setSequence(1);
	oResults.setExpanded(true);
	oResults.setScrollNumber(20);
	oResults.setScrollingEnabled(false);
	oResults.setPageGroupSequence(2);
	tabDetails.addComponent(oResults);
	
	var oPrevResults = new PrevResultsComponent(criterion);
	oPrevResults.setPlusAddEnabled(false);
	oPrevResults.setLabel(i18n.lab.labconsole_o1.PREVIOUS_RESULTS);
	oPrevResults.setComponentId("PR0001");
	if(ie6){
		oPrevResults.setColumn(1);
		oPrevResults.setSequence(2);		
	}else{
		oPrevResults.setColumn(2);
		oPrevResults.setSequence(1);		
	}

	oPrevResults.setExpanded(true);
	oPrevResults.setScrollNumber(10);
	oPrevResults.setScrollingEnabled(false);
	oPrevResults.setIncludeLineNumber(false);
	oPrevResults.setPageGroupSequence(2);
	tabDetails.addComponent(oPrevResults);		
	
	var oLabComments2 = new LabCommentsComponent(criterion);
	oLabComments2.setPlusAddEnabled(false);
	oLabComments2.setLabel(i18n.COMMENTS);
	oLabComments2.setComponentId("LC02");
	if(ie6){
		oLabComments2.setColumn(1);
		oLabComments2.setSequence(3);		
	}else{
		oLabComments2.setColumn(1);
		oLabComments2.setSequence(2);		
	}
	oLabComments2.setExpanded(true);
	oLabComments2.setScrollNumber(20);
	oLabComments2.setScrollingEnabled(false);
	oLabComments2.setPageGroupSequence(2);
	tabDetails.addComponent(oLabComments2);
	
	var oContainers2 = new consoleContainerComponent(criterion);
	oContainers2.setPlusAddEnabled(false);
	oContainers2.setLabel(i18n.lab.labconsole_o1.CONTAINERS);
	oContainers2.setComponentId("CC0002");
	if(ie6){
		oContainers2.setColumn(1);
		oContainers2.setSequence(4);
	}else{
		oContainers2.setColumn(2);
		oContainers2.setSequence(2);		
	}

	oContainers2.setExpanded(true);
	oContainers2.setScrollNumber(10);
	oContainers2.setScrollingEnabled(false);
	oContainers2.setIncludeLineNumber(false);
	oContainers2.setPageGroupSequence(2);
	tabDetails.addComponent(oContainers2);


	//Setup Tabbed MPage
	var tabAr = new Array(
		new MP_Core.MapObject("PAGE_TAB_01",tabWelcome),
		new MP_Core.MapObject("PAGE_TAB_02",tabScientist),
		new MP_Core.MapObject("PAGE_TAB_03",tabSuper),
		new MP_Core.MapObject("PAGE_TAB_04",tabDetails)			
	);
	
	MP_Util.Doc.InitMPageTabLayout(tabAr, i18n.lab.labconsole_o1.LAB_CONSOLE);
	MP_Util.Doc.RenderLayout();
	
	var arg2 = "a-tab"+startPage;
	var startPageNumber = startPage + 1;	
	var startPageName = "PAGE_TAB_0"+startPageNumber;		
	MP_Util.DisplaySelectedTab(startPageName,arg2);

	//Initialize the container event filter dialog.
	lab.core.CONT_EVENT_FILTER_DIALOG.InitComponent(1050009, 'MP_LAB_CONSOLE');
	
}




