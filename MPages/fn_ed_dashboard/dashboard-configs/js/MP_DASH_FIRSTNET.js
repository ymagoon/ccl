// Group (Perioperative ABU) specific config - Dashboard independent
if (typeof dashboard === "undefined") {
    dashboard = {};
}

// Dashboard (periopORManager) specific config
if (typeof dashboard.periopORManager === "undefined") {
    dashboard.periopORManager = {
        layoutType : "DASHBOARD",
        debug : true,
		theme : 'light',//options available - 1. light 2. dark
        helpLinkURL : "https://wiki.ucern.com/display/public/1101firstnetHP/Working+with+ED+Real+Time+Dashboard+Component",
		Filters : {
			"ConfigFile" : "MP_DASH_FIRSTNET"
		}
    };
}
if (typeof dashboard.periopORManager.pageFilters === "undefined") {
    dashboard.periopORManager.pageFilters = [{
            filterDef : {
                type : "string",
                defaultVal : "^MINE^"
            },
            visible : false,
            editable : false
        }, {
            filterGroup : {
                visible : true,
                editable : true,
                filters : [{
                        label : "",
                        filterDef : {
                            name : "dashHiddenID",
                            type : "CustomTrackingGroup",
                            parentControl : "dashHiddenID"
                        }
                    }, {
                        label : "",
                        filterDef : {
                            name : "dashHiddenType",
                            type : "Hidden",
                            parentControl : "dashHiddenType"
                        }
                    }
                ]
            }
        }
    ];
}   
if (typeof dashboard.periopORManager.layout === "undefined") {
    dashboard.periopORManager.layout = {
        components : [{
                componentType : 'LengthOfStay',
                label : i18n.LENGTH_OF_STAY,
                id : 'LengthOfStay',
                gridPosLeft : 1,
                gridPosTop : 1,
                gridPosRight : 3,
                gridPosBottom : 4,           
			    chartDataCall : 'fnmp_dash_los',             
                componentFilters : [dashboard.periopORManager.pageFilters[0],dashboard.periopORManager.pageFilters[1]],
                chartConfig : {},
				buttonCollection : [{
					buttonName : i18n.LENGTH_OF_STAY,
					buttonId : 'losButton',
					buttonImage : 'images/expandcorner_light.png',
					hoverImage :'images/expandcorner_hover2_light.png',
					buttonHoverText : i18n.LENGTH_OF_STAY_DETAIL,
					buttonFunction : ED_CORE.DashGetDetailsInfo,
					buttonDataCall : 'fnmp_dash_los_d', 
					buttonCallback : CERN_DASHBOARD_LOS_O1.RenderLOSDetailDialog
				}]
            },
			{
                componentType : "DonutChart",
				label : i18n.ED_VOLUME,
                id : "EdVolume",
                gridPosLeft : 4,
                gridPosTop : 1,
                gridPosRight : 6,
                gridPosBottom : 4,
				chartDataCall : "fnmp_dash_ed_volume", 
				chartConfig : {},
				componentFilters :[dashboard.periopORManager.pageFilters[0],dashboard.periopORManager.pageFilters[1]],
				buttonCollection : [{
					buttonName : i18n.ED_VOLUME,
					buttonId : 'edVolumeButton',
					buttonImage : 'images/expandcorner_light.png',
					hoverImage :'images/expandcorner_hover2_light.png',
					buttonHoverText : i18n.ED_VOLUME_DETAIL,
					buttonFunction : ED_CORE.DashGetDetailsInfo,
					buttonDataCall : 'fnmp_dash_ed_volume_d',
					buttonCallback : CERN_DASHBOARD_DONUT_O1.RenderEDVolumeDetailDialog				
				}]
				
            },
			{
				componentType : "WaitingRoom",
				label : i18n.WAITING_ROOM,
				id : "waitingRoom",
				gridPosLeft : 7,
				gridPosTop : 1,
				gridPosRight : 9,
				gridPosBottom : 4,
				chartDataCall : "fnmp_dash_wait_room",
				chartConfig : {},
				componentFilters : [dashboard.periopORManager.pageFilters[0], dashboard.periopORManager.pageFilters[1]],
				buttonCollection : [{
						buttonName : i18n.WAITING_ROOM,
						buttonId : 'waitingRoomButton',
						buttonImage : 'images/expandcorner_light.png',
						hoverImage : 'images/expandcorner_hover2_light.png',
						buttonHoverText : i18n.WAITING_ROOM_DETAIL,
						buttonFunction : ED_CORE.DashGetDetailsInfo,
						buttonDataCall : 'fnmp_dash_wait_room_d',
						buttonCallback : CERN_DASHBOARD_WAITING_ROOM_O1.RenderWaitingRoomDetailDialog
					}
				]

			},
			{
			    componentType : 'PendingAdmits',
                id : 'PendingAdmits',
				label : i18n.PENDING_ADMITS,
                gridPosLeft : 10,
                gridPosTop : 1,
                gridPosRight : 12,
                gridPosBottom : 4,
				graphDataPeriod : "6",
				chartDataCall : "fnmp_dash_pend_admit", 
				chartConfig : {},
				componentFilters :[dashboard.periopORManager.pageFilters[0],dashboard.periopORManager.pageFilters[1]],
				buttonCollection : [{
					buttonName : i18n.PENDING_ADMITS,
					buttonId : 'pendingAdmitsButton',
					buttonImage : 'images/expandcorner_light.png',
					hoverImage :'images/expandcorner_hover2_light.png',
					buttonHoverText : i18n.PENDING_ADMITS_DETAIL,
					buttonFunction : ED_CORE.DashGetDetailsInfo,
					buttonDataCall : 'fnmp_dash_pend_admit_d',
					buttonCallback : CERN_DASHBOARD_PENDING_ADMITS_O1.RenderPendingAdmitsDetailDialog				
				}]
			},
			{
                componentType : "PendingOrders",
                id : "PendingOrders",
				label : i18n.PENDING_ORDERS,
                gridPosLeft : 1,
                gridPosTop : 5,
                gridPosRight : 12,
                gridPosBottom : 12,
				chartDataCall : 'fnmp_dash_pend_orders',
				componentFilters : dashboard.periopORManager.pageFilters,
				chartConfig : {},
				buttonCollection : [{
					buttonName : i18n.PENDING_ORDERS,
					buttonId : 'ordersButton',
					buttonImage : 'images/expandcorner_light.png',
					hoverImage :'images/expandcorner_hover2_light.png',
					buttonHoverText : i18n.PENDING_ORDERS_DETAIL,
					buttonFunction : ED_CORE.DashGetDetailsInfo,
					buttonDataCall : 'fnmp_dash_pend_orders_d',
					buttonCallback : CERN_DASHBOARD_ORDER_O1.RenderOrdersDetailDialog
				}]
            }
        ]
    };
}