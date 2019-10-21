/**
 * Driver for the RCM Discharge Planning Summary page. 
 * The list of components includes post-acute placement add, post-acute placement modify, post-acute placement faxing component,
 * post-acute services add, post-acute services modify, and post-acute services faxing component.
 * This driver renders the appropriate components for display in an MPage and hides the others according to user interactions.  
 * 
 * @author Brandon Rockhold - Revenue Cycle Access
 * @author Jason Roberts - Revenue Cycle Access
 * @author Leonardo Ji 
 */
function RenderPage() {
	var currentTLCState = {
		"isUseTLC" : false,
		"workFlow" : "",
		// Compiled, Open or null (To indicate no selection)
		"packetState" : null
	};
	var postAcuteAddFormComponent;
	var postAcuteTLCAddFormComponent;
	var postAcuteManageFormComponent; 
	var postAcuteTLCManageFormComponent;
	var postAcuteServicesComponent;
	var postAcuteTLCServicesComponent;
	var postAcutePacketFormComponent;
	
	var serviceDelegate = new PostAcutePlacementDelegate();
	
    RCM_Clinical_Util.setMpFormatterLocale();
    var js_criterion = JSON.parse(m_criterionJSON);
    var criterion = MP_Util.GetCriterion(js_criterion, CERN_static_content);

    //var componentMapping = RCM_DR_Summary_Util.createComponentMappings();
    var componentMapping = RCM_Clinical_Util.createComponentMappings("mp_dcm");	
    var pageFuncFilterMapping = new Array(
    		new MP_Core.MapObject('MP_DCM_BANNER',
            '{"FUNCTION":{"NAME":"setBannerEnabled", "TYPE":"Boolean", "FIELD": "FREETEXT_DESC"}}'));;
    //var funcMapping = RCM_DR_Summary_Util.createComponentFunctionMapping();
    var funcMapping = RCM_Clinical_Util.createComponentFunctionMapping("mp_dcm");
 
    var mpageName = "MP_DCM_SUMMARY";
	
	//Loading Policy
	var loadingPolicy = new MP_Bedrock.LoadingPolicy();
	loadingPolicy.setLoadPageDetails(true); 
	loadingPolicy.setLoadComponentBasics(true); 
	loadingPolicy.setLoadComponentDetails(true); 
	loadingPolicy.setCategoryMean(mpageName);
	loadingPolicy.setCriterion(criterion); 
	var mPage = MP_Bedrock.MPage.LoadBedrockMPage(loadingPolicy, componentMapping, pageFuncFilterMapping, funcMapping);
    mPage.setCustomizeEnabled(false);
    
    // care management component with in-line editing.
    var utilManRetrieveComponent = RCM_Clinical_Util.getMPageComponent(mPage,
            UtilizationManagementRetrieveComponent);
    if (utilManRetrieveComponent) {
        utilManRetrieveComponent.enableModify(true);
		// refresh the retrieve after a successful save.
		// this is needed because the DRG id needs to be retrieved for the next modifying DRG event.
		utilManRetrieveComponent.addSaveListener(function() {
			utilManRetrieveComponent.InsertData();
		});	
    }
    
    // The indicator determine whether to show either post acute fax form or post acute services fax form 
    // once the user click 'back' button on the packet form.
    var showPostAcuteFaxForm = false;
    
    // post acute placement component
    var postAcutePlacementListComponent = RCM_Clinical_Util.getMPageComponent(mPage,
            RCMPostAcutePlacementListComponent);
    if(postAcutePlacementListComponent) {
		postAcutePlacementListComponent.addPlacementLoadedListener(function() {
			currentTLCState.isUseTLC = postAcutePlacementListComponent.isTLCPlacement();
			if (currentTLCState.isUseTLC) {
				postAcutePlacementListComponent.setOpenLinkVisible(true);
				postAcutePlacementListComponent.setUploadLinkVisible(true);
					
				postAcutePlacementListComponent.addUploadClinicalsListener(function() {
					currentTLCState.workFlow = "PlacementManage";		
					showPacketForm(false, 1);
				});
				postAcutePlacementListComponent.addOpenPostAcuteCandidatesListener(function() {
					showPostAcuteManageForm();
				});
				postAcutePacketFormComponent.setUseTLC(true);
				// Switch post acute add and manage forms to ones for TLC
				postAcuteAddFormComponent = postAcuteTLCAddFormComponent;
				postAcuteManageFormComponent = postAcuteTLCManageFormComponent;	
			} else {
				postAcutePlacementListComponent.setManageLinkVisible(true);
				postAcutePlacementListComponent.setFaxLinkVisible(true);
				postAcutePlacementListComponent.setPrintLinkVisible(true);
			}
    	});
    	postAcutePlacementListComponent.addNewPostAcuteCandidateListener(function() {
    		showPostAcuteCandidatesForm();
        });
    	postAcutePlacementListComponent.addManagePostAcuteCandidatesListener(function() {
    		showPostAcuteManageForm();
    	});
    	postAcutePlacementListComponent.addFaxPostAcuteCandidatesListener(function() {
    		showPostAcuteFaxForm = true;
    		showPacketForm(true, 1);
    	});
		postAcutePlacementListComponent.addPrintPreviewPostAcuteListener(function() {
    		showPostAcuteFaxForm = true;
    		showPacketForm(true, 1);
    	});
    	postAcutePlacementListComponent.addResendFailedFaxListener(function() {
    		postAcutePlacementListComponent.setRenderCandidatesSectionCollapsed(false);
    		postAcutePlacementListComponent.InsertData();
    	});
    	
    }
    
    // post acute services component
    var postAcuteServicesListComponent = RCM_Clinical_Util.getMPageComponent(mPage, 
            RCMPostAcuteServicesListComponent);
    if (postAcuteServicesListComponent) {
		postAcuteServicesListComponent.addServicesLoadedListener(function() {
			currentTLCState.isUseTLC = postAcuteServicesListComponent.isTLCServices();
			if (currentTLCState.isUseTLC) {
				postAcuteServicesListComponent.setOpenLinkVisible(true);
				postAcuteServicesListComponent.setUploadLinkVisible(true);
				
				postAcuteServicesListComponent.addUploadClinicalsListener(function() {
					currentTLCState.workFlow = "ServiceManage";
					showPacketForm(false, 2);
				});
				postAcuteServicesListComponent.addOpenPostAcuteServicesListener(function() {
					showPostAcuteServicesModifyForm();
				});
				postAcutePacketFormComponent.setUseTLC(true);
				// Switch post acute service form to one for TLC
				postAcuteServicesComponent = postAcuteTLCServicesComponent;
			} else {
				postAcuteServicesListComponent.setManageLinksVisible(true);
				postAcuteServicesListComponent.setFaxOptionVisible(true);
				postAcuteServicesListComponent.setPrintLinkVisible(true);
			}
		});
		postAcuteServicesListComponent.addNewPostAcuteServicesListener(function() {
			showPostAcuteServicesAddForm();
		});
		postAcuteServicesListComponent.addManagePostAcuteServicesListener(function() {
			showPostAcuteServicesModifyForm();
		});
		postAcuteServicesListComponent.addFaxPostAcuteServicesListener(function() {
			showPostAcuteFaxForm = false;
			showPacketForm(true, 2);
		});
		
    }
    
	// start of right side column forms
    // Hidden post acute add form   	
	for (var form = 0; form < 2; form++) {
		// Default the add form to the candidates form
		if (form === 1) {
			postAcuteAddFormComponent = new RCMPostAcuteCandidatesFormComponent(criterion);
		} else {
			postAcuteTLCAddFormComponent = new RCMPostAcuteTLCAddComponent(criterion);			
			postAcuteAddFormComponent = postAcuteTLCAddFormComponent; 
		}
		postAcuteAddFormComponent.setColumn(2);
		postAcuteAddFormComponent.setPageGroupSequence(1);
		postAcuteAddFormComponent.setSequence(1);
		postAcuteAddFormComponent.setExpanded(true);
		mPage.addComponent(postAcuteAddFormComponent);
		
		postAcuteAddFormComponent.addSaveListener(function() {
			postAcutePlacementListComponent.InsertData();
			showSummaryForm(true);
		});
		postAcuteAddFormComponent.addSaveAndFaxListener(function() {
			postAcutePlacementListComponent.InsertData();
			// make sure to show post acute faxing form when compile packet in the packet form.
			showPostAcuteFaxForm = true;
			showPacketForm(true, 1);
		});
		postAcuteAddFormComponent.addCancelListener(function() {
			showSummaryForm();
		});
    }
	
    // Hidden post acute manage form    
	for (var form = 0; form < 2; form++) {
		// Default the manage form to the manual form
		if (form === 1) {
			postAcuteManageFormComponent = new RCMPostAcuteManageFormComponent(criterion);
		} else {
			postAcuteTLCManageFormComponent = new RCMPostAcuteTLCManageComponent(criterion);			
			postAcuteManageFormComponent = postAcuteTLCManageFormComponent;
		}
		postAcuteManageFormComponent.setColumn(2);
		postAcuteManageFormComponent.setPageGroupSequence(1);
		postAcuteManageFormComponent.setSequence(1);
		postAcuteManageFormComponent.setExpanded(true);
		mPage.addComponent(postAcuteManageFormComponent);
		
		postAcuteManageFormComponent.addSaveListener(function() {
			postAcutePlacementListComponent.InsertData();
			showSummaryForm(true);
		});
		postAcuteManageFormComponent.addCancelListener(function() {
			showSummaryForm();
		});
    }
	
    // Hidden post acute packet form
    postAcutePacketFormComponent = new RCMPostAcutePacketFormComponent(criterion);
    postAcutePacketFormComponent.setColumn(2);
    postAcutePacketFormComponent.setPageGroupSequence(1);
    postAcutePacketFormComponent.setSequence(1);
    postAcutePacketFormComponent.setExpanded(true);
    
    mPage.addComponent(postAcutePacketFormComponent);
    
	postAcutePacketFormComponent.addPacketCompiledListener(function() {
		if (currentTLCState.isUseTLC) {
			currentTLCState.packetState = "Compiled";
			switch (currentTLCState.workFlow) {
			case "PlacementAdd" :
				showPostAcuteCandidatesForm();
				break;
			case "PlacementManage" :
				showPostAcuteManageForm();
				break;
			case "ServiceAdd" :
				showPostAcuteServicesAddForm();
				break;
			case "ServiceManage" :
				showPostAcuteServicesModifyForm();
				break;			
			}
			// Reset the packet state for the next TLC form
			currentTLCState.packetState = null;
		}
    	else if (showPostAcuteFaxForm === true) {
    		showFaxingForm();
    		postAcuteFaxingFormComponent.setPacketDetails(postAcutePacketFormComponent.getPacketDetails());    		
    	}
    	else {
    		showServicesFaxingForm();
    		postAcuteServicesFaxingFormComponent.setPacketDetails(postAcutePacketFormComponent.getPacketDetails());
    	}
    });
    postAcutePacketFormComponent.addCancelListener(function() {
    	showSummaryForm();
    });
	
	postAcutePacketFormComponent.addOpenListener(function() {
		if (currentTLCState.isUseTLC) {
			currentTLCState.packetState = "Open";
			switch (currentTLCState.workFlow) {
			case "PlacementAdd" :
				showPostAcuteCandidatesForm();
				break;
			case "PlacementManage" :
				showPostAcuteManageForm();
				break;
			case "ServiceAdd" :
				showPostAcuteServicesAddForm();
				break;
			case "ServiceManage" :
				showPostAcuteServicesModifyForm();
				break;			
			}
			// Reset the packet state for the next TLC form
			currentTLCState.packetState = null;
		}
	});		
	
	postAcutePacketFormComponent.addPacketPreviewListener(function(canPrint){
		var pDetails = postAcutePacketFormComponent.getPacketDetails();
		var packetPreviewDetails = {};
		packetPreviewDetails.templateID = pDetails.chartTemplateId;
		packetPreviewDetails.sectionIDs = pDetails.chartTemplateSectionIds;
		packetPreviewDetails.eventIDs = pDetails.clinicalEventIds;
		packetPreviewDetails.encounterID = (criterion.encntr_id).toString();
		packetPreviewDetails.paitientID = (criterion.person_id).toString();
		if(pDetails.startDate){
			packetPreviewDetails.beginDate = pDetails.startDate;
		}
		if(pDetails.endDate){
			packetPreviewDetails.endDate = pDetails.endDate;
		}
		serviceDelegate.previewPostAcuteInfo(packetPreviewDetails.encounterID, packetPreviewDetails.paitientID, packetPreviewDetails.templateID, packetPreviewDetails.beginDate, packetPreviewDetails.endDate, packetPreviewDetails.eventIDs, packetPreviewDetails.sectionIDs);
	});
    
    // Hidden post acute placement faxing form
    var postAcuteFaxingFormComponent = new RCMPostAcuteFaxingFormComponent(criterion);
    postAcuteFaxingFormComponent.setColumn(2);
	postAcuteFaxingFormComponent.setPageGroupSequence(1);
    postAcuteFaxingFormComponent.setSequence(1);
    postAcuteFaxingFormComponent.setExpanded(true);
    mPage.addComponent(postAcuteFaxingFormComponent);
    
    postAcuteFaxingFormComponent.addSendListener(function() {
    	postAcutePlacementListComponent.InsertData();
    	showSummaryForm(true);
    });
    postAcuteFaxingFormComponent.addCancelListener(function() {
    	showSummaryForm();
    });
    postAcuteFaxingFormComponent.addBackListener(function() {
    	showPostAcuteFaxForm = true;
    	showPacketForm();
    });
	
	
	postAcuteFaxingFormComponent.addPacketPreviewListener(function() {
    	var pDetails = postAcutePacketFormComponent.getPacketDetails();
		var packetPreviewDetails = {};
		packetPreviewDetails.templateID = pDetails.chartTemplateId;
		packetPreviewDetails.sectionIDs = pDetails.chartTemplateSectionIds;
		packetPreviewDetails.eventIDs = pDetails.clinicalEventIds;
		packetPreviewDetails.encounterID = (criterion.encntr_id).toString();
		packetPreviewDetails.paitientID = (criterion.person_id).toString();
		if(pDetails.startDate){
			packetPreviewDetails.beginDate = pDetails.startDate;
		}
		if(pDetails.endDate){
			packetPreviewDetails.endDate = pDetails.endDate;
		}
		serviceDelegate.previewPostAcuteInfo(packetPreviewDetails.encounterID, packetPreviewDetails.paitientID, packetPreviewDetails.templateID, packetPreviewDetails.beginDate, packetPreviewDetails.endDate, packetPreviewDetails.eventIDs, packetPreviewDetails.sectionIDs);
	});
    
    // Hidden post acute services faxing form
    var postAcuteServicesFaxingFormComponent = new RCMPostAcuteServicesFaxingFormComponent(criterion);
    postAcuteServicesFaxingFormComponent.setColumn(2);
    postAcuteServicesFaxingFormComponent.setPageGroupSequence(1);
    postAcuteServicesFaxingFormComponent.setSequence(1);
    postAcuteServicesFaxingFormComponent.setExpanded(true);
    mPage.addComponent(postAcuteServicesFaxingFormComponent);
    
    postAcuteServicesFaxingFormComponent.addSendListener(function() {
		postAcuteServicesListComponent.InsertData();
    	showSummaryForm(true);
    });
    postAcuteServicesFaxingFormComponent.addCancelListener(function() {
    	showSummaryForm();
    });
    postAcuteServicesFaxingFormComponent.addBackListener(function() {
    	showPostAcuteFaxForm = false;
    	showPacketForm();
    });
	postAcuteServicesFaxingFormComponent.addPacketPreviewListener(function() {
    	var pDetails = postAcutePacketFormComponent.getPacketDetails();
		var packetPreviewDetails = {};
		packetPreviewDetails.templateID = pDetails.chartTemplateId;
		packetPreviewDetails.sectionIDs = pDetails.chartTemplateSectionIds;
		packetPreviewDetails.eventIDs = pDetails.clinicalEventIds;
		packetPreviewDetails.encounterID = (criterion.encntr_id).toString();
		packetPreviewDetails.paitientID = (criterion.person_id).toString();
		if(pDetails.startDate){
			packetPreviewDetails.beginDate = pDetails.startDate;
		}
		if(pDetails.endDate){
			packetPreviewDetails.endDate = pDetails.endDate;
		}
		serviceDelegate.previewPostAcuteInfo(packetPreviewDetails.encounterID, packetPreviewDetails.paitientID, packetPreviewDetails.templateID, packetPreviewDetails.beginDate, packetPreviewDetails.endDate, packetPreviewDetails.eventIDs, packetPreviewDetails.sectionIDs);
	});
	

    
    // Hidden post acute services form	
	for (var form = 0; form < 2; form++) {
		// Default the services form to the manual form
		if (form === 1) {
			postAcuteServicesComponent = new RCMPostAcuteServicesComponent(criterion);
			postAcuteServicesComponent.setLabel(RCMPostAcuteServicesI18n.POST_ACUTE_SERVICES_ADD_COMPONENT_LABEL);
		} else {
			postAcuteTLCServicesComponent = new RCMPostAcuteServicesTLCComponent(criterion);
			postAcuteServicesComponent = postAcuteTLCServicesComponent; 
		}
		postAcuteServicesComponent.setColumn(2);
		postAcuteServicesComponent.setPageGroupSequence(1);
		postAcuteServicesComponent.setSequence(1);	
		mPage.addComponent(postAcuteServicesComponent);
		
		postAcuteServicesComponent.addSaveAndCloseListener(function() {
			showSummaryForm(true);
		});
		postAcuteServicesComponent.addSaveAddListener(function() {
			postAcuteServicesListComponent.InsertData();
			postAcuteServicesComponent.InsertData();
		});
		postAcuteServicesComponent.addCancelListener(function() {
			showSummaryForm();
		});
		postAcuteServicesComponent.addSaveModifyListener(function() {
			postAcuteServicesListComponent.InsertData();
			postAcuteServicesComponent.InsertData();
		});
	}
	
    // switch logic between post acute candidates, post acute faxing, post acute manage, post acute services add, post acute service modify.
    var showPostAcuteManageForm = function() {
		currentTLCState.workFlow = "PlacementManage";
    	show2Columns();
		if (currentTLCState.isUseTLC && currentTLCState.packetState === "Compiled") {
			postAcuteManageFormComponent.InsertData(true, postAcutePacketFormComponent.getPacketDetails());
		} else {
			postAcuteManageFormComponent.InsertData(true);
		}
       	$(postAcuteManageFormComponent.getRootComponentNode()).show();
       	$(postAcuteFaxingFormComponent.getRootComponentNode()).hide();
       	$(postAcuteServicesFaxingFormComponent.getRootComponentNode()).hide();
      	$(postAcutePacketFormComponent.getRootComponentNode()).hide();
       	$(postAcuteAddFormComponent.getRootComponentNode()).hide();
       	$(postAcuteServicesComponent.getRootComponentNode()).hide();
    };
    
    var showPostAcuteCandidatesForm = function() {
		currentTLCState.workFlow = "PlacementAdd";
    	show2Columns();       	
		if (currentTLCState.isUseTLC && !currentTLCState.packetState) {
			showPacketForm(false, 1);
		} else {
			$(postAcuteManageFormComponent.getRootComponentNode()).hide();
			$(postAcuteFaxingFormComponent.getRootComponentNode()).hide();
			$(postAcuteServicesFaxingFormComponent.getRootComponentNode()).hide();
			$(postAcutePacketFormComponent.getRootComponentNode()).hide();
			if (currentTLCState.isUseTLC && currentTLCState.packetState === "Compiled") {
				postAcuteAddFormComponent.InsertData(true, postAcutePacketFormComponent.getPacketDetails());
			} else {
				postAcuteAddFormComponent.InsertData(true);
			}
			$(postAcuteAddFormComponent.getRootComponentNode()).show();
			$(postAcuteServicesComponent.getRootComponentNode()).hide();
		}
    };
    
    var showPacketForm = function(reload, xrtemlplateFlag) {
    	show2Columns();
       	$(postAcuteManageFormComponent.getRootComponentNode()).hide();
    	$(postAcuteFaxingFormComponent.getRootComponentNode()).hide();
       	$(postAcuteServicesFaxingFormComponent.getRootComponentNode()).hide();
       	postAcutePacketFormComponent.setXRTemplateFilterFlag(xrtemlplateFlag);
		if (currentTLCState.isUseTLC) {
			postAcutePacketFormComponent.InsertData(true);
		}		
       	//reset packet form
       	else if (reload === true) {
       		postAcutePacketFormComponent.InsertData(true);
       		if (showPostAcuteFaxForm === true) {
       			postAcuteFaxingFormComponent.InsertData();
       		}
       		else {
       			postAcuteServicesFaxingFormComponent.InsertData();
       		}
       	}
       	// reset packet component's label depending on the type of fax.
       	if (showPostAcuteFaxForm === true || (currentTLCState.isUseTLC && !(currentTLCState.workFlow === "ServiceAdd" 
				|| currentTLCState.workFlow === "ServiceManage"))) {
       		$(postAcutePacketFormComponent.getRootComponentNode()).find('.sec-title').find('span:first').text(rcm_post_acute_placement_i18n.POST_ACUTE_PLACEMENT_PACKET_LABEL);
       	}
       	else {
       		$(postAcutePacketFormComponent.getRootComponentNode()).find('.sec-title').find('span:first').text(RCMPostAcuteServicesI18n.POST_ACUTE_SERVICES_PACKET_LABEL);
       	}
    	$(postAcutePacketFormComponent.getRootComponentNode()).show();
      	$(postAcuteAddFormComponent.getRootComponentNode()).hide();
      	$(postAcuteServicesComponent.getRootComponentNode()).hide();
    };
    
    var showFaxingForm = function() {
    	show2Columns();
     	$(postAcuteFaxingFormComponent.getRootComponentNode()).show();
      	$(postAcutePacketFormComponent.getRootComponentNode()).hide();
    };
    
    var showServicesFaxingForm = function() {
    	show2Columns();
     	$(postAcuteServicesFaxingFormComponent.getRootComponentNode()).show();
      	$(postAcutePacketFormComponent.getRootComponentNode()).hide();
    };
    
    var showPostAcuteServicesAddForm = function() {		
		currentTLCState.workFlow = "ServiceAdd";
    	show2Columns();
		if (currentTLCState.isUseTLC && !currentTLCState.packetState) {
			showPacketForm(false, 2);
		} else {
			$(postAcuteManageFormComponent.getRootComponentNode()).hide();
			$(postAcuteFaxingFormComponent.getRootComponentNode()).hide();
			$(postAcuteServicesFaxingFormComponent.getRootComponentNode()).hide();
			$(postAcutePacketFormComponent.getRootComponentNode()).hide();
			$(postAcuteAddFormComponent.getRootComponentNode()).hide();			
			if (currentTLCState.isUseTLC) {
				if (currentTLCState.packetState === "Compiled") {
					postAcuteServicesComponent.InsertData(true, postAcutePacketFormComponent.getPacketDetails());
				} else {
					postAcuteServicesComponent.InsertData(true);
				}
			} else {
				// reset post acute service add component's label
				$(postAcuteServicesComponent.getRootComponentNode()).find('.sec-title').find('span:first').text(RCMPostAcuteServicesI18n.POST_ACUTE_SERVICES_ADD_COMPONENT_LABEL);
				postAcuteAddFormComponent.InsertData(true);
				postAcuteServicesComponent.isAddOrModify(false);
				postAcuteServicesComponent.InsertData(true);
			}
			$(postAcuteServicesComponent.getRootComponentNode()).show();
		}
    };
    
    var showPostAcuteServicesModifyForm = function() {
		currentTLCState.workFlow = "ServiceManage";
    	show2Columns();
       	$(postAcuteManageFormComponent.getRootComponentNode()).hide();
    	$(postAcuteFaxingFormComponent.getRootComponentNode()).hide();
       	$(postAcuteServicesFaxingFormComponent.getRootComponentNode()).hide();
    	$(postAcutePacketFormComponent.getRootComponentNode()).hide();
      	$(postAcuteAddFormComponent.getRootComponentNode()).hide();
      	// reset post acute service modify form component's label
		if (!currentTLCState.isUseTLC) {
			$(postAcuteServicesComponent.getRootComponentNode()).find('.sec-title').find('span:first').text(RCMPostAcuteServicesI18n.POST_ACUTE_SERVICES_MANAGE_COMPONENT_LABEL);
		}
     	postAcuteServicesComponent.isAddOrModify(true);
		if (currentTLCState.isUseTLC && currentTLCState.packetState === "Compiled") {
			postAcuteServicesComponent.InsertData(true, postAcutePacketFormComponent.getPacketDetails());
		} else {
			postAcuteServicesComponent.InsertData(true);
		}
    	$(postAcuteServicesComponent.getRootComponentNode()).show();
    };
    
    var showSummaryForm = function(reload) {
    	if (reload === true) {
    		postAcutePlacementListComponent.InsertData();
			if (postAcuteServicesListComponent) {
				postAcuteServicesListComponent.InsertData();
			}
    	}
        show3Columns();
       	$(postAcuteManageFormComponent.getRootComponentNode()).hide();
       	$(postAcuteFaxingFormComponent.getRootComponentNode()).hide();
       	$(postAcuteServicesFaxingFormComponent.getRootComponentNode()).hide();
      	$(postAcutePacketFormComponent.getRootComponentNode()).hide();
       	$(postAcuteAddFormComponent.getRootComponentNode()).hide();
     	$(postAcuteServicesComponent.getRootComponentNode()).hide();
    };
    
    mPage.setName(rcm_dr_summary_i18n.DISCHARGE_CARE_MANAGEMENT_SUMMARY);
    MP_Util.Doc.InitLayout(mPage);
    // Retrieves patient demographics if the demographics banner is visible.
    if (mPage.isBannerEnabled()) {
        CERN_DEMO_BANNER_O1.GetPatientDemographics(_g("banner"), criterion);
    }
	
	// Hide TLC forms until the placement or service lists indicate that TLC is being used
	$(postAcuteTLCAddFormComponent.getRootComponentNode()).hide();
	$(postAcuteTLCManageFormComponent.getRootComponentNode()).hide();
	$(postAcuteTLCServicesComponent.getRootComponentNode()).hide();	
	
    var movedComponentMap = {};
    var columnResizeFunction = null;
    var is2Column = false;
    var show2Columns = function() {
    	if (is2Column === false) {
    		var leftSection = postAcutePlacementListComponent.getRootComponentNode().parentNode;
      		// move each of the second and third section's components to the first section.
    		var excludedList = [postAcuteManageFormComponent,
    		                    postAcuteAddFormComponent,
    		                    postAcuteFaxingFormComponent,
    		                    postAcuteServicesFaxingFormComponent,
    		                    postAcutePacketFormComponent,
    		                    postAcuteServicesComponent
    		                   ];
        	movedComponentMap = RCM_Clinical_Util.moveMpageComponent(mPage, excludedList, leftSection); 
        	
        	// Set column widths.
        	$('.col1').css('width', '35%');
    		$('.col2').css('width', '64%');
    		$('.col3').css('width', '0%');
    		
    		// Add column scrolling.
    		columnResizeFunction = RCM_Clinical_Util.addColumnVerticalScrolling(mPage, $(".col1").get(0), $(".col2").get(0), 500);
    		
    		is2Column = true;
    	}
    };
    
    var show3Columns = function() {
    	if (is2Column === true) {
    		// Reset column widths.
    		$('.col1').css('width', '32.65%');
    		$('.col2').css('width', '33.65%');
    		$('.col3').css('width', '32.65%');
    		
    		// Remove column scrolling.
    		RCM_Clinical_Util.removeColumnVerticalScrolling($(".col1").get(0), $(".col2").get(0), columnResizeFunction);
    		
    		// move each of the components back to second and third section.
    		RCM_Clinical_Util.movebackMpageComponent(movedComponentMap);
    		
    		is2Column = false;
    	}
    };
    
    // Initially this page shows the discharge planning summary page.
    showSummaryForm(true);
    
    // Performs InsertData calls for the post-acute placement list and candidates form so that their
    // asynchronous loads are more likely to finish before the other standard components, and they are rendered faster.
    var excludedList = [postAcutePlacementListComponent,
                        postAcuteServicesListComponent,
                        postAcuteManageFormComponent,
						postAcuteTLCManageFormComponent,
	                    postAcuteAddFormComponent,
						postAcuteTLCAddFormComponent,
	                    postAcuteFaxingFormComponent,
	                    postAcuteServicesFaxingFormComponent,
	                    postAcutePacketFormComponent,
	                    postAcuteServicesComponent,
						postAcuteTLCServicesComponent
	                   ];
    
    RCM_Clinical_Util.componentInsertData(mPage, excludedList, "MP_DCM", mpageName);
}