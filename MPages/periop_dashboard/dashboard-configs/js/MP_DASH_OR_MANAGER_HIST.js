// Group (Perioperative ABU) specific config - Dashboard independent
if (typeof dashboard === "undefined") {
    dashboard = {};
}
if (typeof dashboard.filterDefs === "undefined") {
    dashboard.filterDefs = {
        outdev : {
            type : "string",
            defaultVal : "^MINE^"
        },
        provider : {
            type : "Criterion",
            property : "providerID"
        },
        dateRange : {
            start : {
                name : "startDate",
                type : "DatePicker",
                timeStamp : "00:00:00"
            },
            end : {
                name : "endDate",
                type : "DatePicker",
                timeStamp : "23:59:59"
            }
        },
        location : {
            iD : {
                name : "dashHiddenID",
                type : "CustomLocation",
                parentControl : "dashHiddenID",
                dataCall : "mp_dash_get_locations"
            },
            type : {
                name : "dashHiddenType",
                type : "Hidden",
                parentControl : "dashHiddenType"
            }
        }
    };
}

// Dashboard (periopORManager) specific config
if (typeof dashboard.periopORManager === "undefined") {
    dashboard.periopORManager = {
        layoutType : "DASHBOARD",
        debug : true,
        helpLinkURL : "https://wiki.ucern.com/display/public/reference/All+about+the+Perioperative+Dashboards"
    };
}
if (typeof dashboard.periopORManager.pageFilters === "undefined") {
    dashboard.periopORManager.pageFilters = [{
            filterDef : dashboard.filterDefs.outdev,
            visible : false,
            editable : false
        }, {
            filterDef : dashboard.filterDefs.provider,
            visible : false,
            editable : false
        }, {
            filterGroup : {
                visible : true,
                editable : true,
                label : "Date Range",
                filters : [{
                        label : "Start:",
                        filterDef : dashboard.filterDefs.dateRange.start
                    }, {
                        label : "End:",
                        filterDef : dashboard.filterDefs.dateRange.end
                    }
                ]
            }
        }, {
            filterGroup : {
                visible : true,
                editable : true,
                label : "Location",
                filters : [{
                        label : "",
                        filterDef : dashboard.filterDefs.location.iD
                    }, {
                        label : "",
                        filterDef : dashboard.filterDefs.location.type
                    }
                ]
            }
        }
    ];
}
if (typeof dashboard.periopORManager.layout === "undefined") {
    dashboard.periopORManager.layout = {
        components : [{
                componentType : 'Scoreboard',
                label : 'Case Progression',
                id : 'Scoreboard',
                gridPosLeft : 1,
                gridPosTop : 1,
                gridPosRight : 9,
                gridPosBottom : 2,
                chartDataCall : 'mp_dash_get_scoreboard',
                detailDataCall : 'mp_dash_get_scoreboard_details',
                detailTableColumnNames : ['Case Number', 'Room', 'Surgeon', 'Start Time', 'Sched. Start Time', 'Pat. in Room Time', 'Add On', 'Cancel Time', 'Cancel Reason', 'Resch. Time', 'Resch. Reason', 'Term. Time', 'Term. Reason', 'Completed Time'],
                detailTableColumnModel : [{
                        name : 'CaseNumber',
                        index : 'CaseNumber',
                        width : 110
                    }, {
                        name : 'Room',
                        index : 'Room',
                        width : 100
                    }, {
                        name : 'Surgeon',
                        index : 'Surgeon'
                    }, {
                        name : 'StartTime',
                        index : 'StartTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'SchedStartTime',
                        index : 'SchedStartTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'PatInRoomTime',
                        index : 'PatInRoomTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'AddOn',
                        index : 'AddOn',
                        width : 32
                    }, {
                        name : 'CancelledTime',
                        index : 'CancelledTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'CancelledReason',
                        index : 'CancelledReason'
                    }, {
                        name : 'ReschedTime',
                        index : 'ReschedTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'ReschedReason',
                        index : 'ReschedReason'
                    }, {
                        name : 'TermTime',
                        index : 'TermTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'TermReason',
                        index : 'TermReason'
                    }, {
                        name : 'CompletedTime',
                        index : 'CompletedTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }
                ],
                componentFilters : dashboard.periopORManager.pageFilters,
                chartConfig : {}
            }, {
                componentType : "HistoricalBar",
                id : "NumDelayCases",
                gridPosLeft : 1,
                gridPosTop : 9,
                gridPosRight : 12,
                gridPosBottom : 12,
                maxDatapoints : 20,
                chartDataCall : "mp_dash_get_num_cases_with_del",
                detailDataCall : "mp_dash_get_num_cases_w_del_d",
                detailTableColumnNames : ['Case Number', 'Room', 'Surgeon', 'Anticip. Patient In Room Time', 'Actual Patient In Room Time', 'Minutes Late'],
                detailTableColumnModel : [{
                        name : 'CaseNumber',
                        index : 'CaseNumber',
                        width : 110
                    }, {
                        name : 'Room',
                        index : 'Room',
                        width : 100
                    }, {
                        name : 'Surgeon',
                        index : 'Surgeon'
                    }, {
                        name : 'AnticipIn',
                        index : 'AnticipIn',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'ActualIn',
                        index : 'ActualIn',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'MinutesLate',
                        index : 'MinutesLate',
                        width : 75,
                        sorttype : 'int'
                    }
                ],
                componentFilters : dashboard.periopORManager.pageFilters,
                maxRec : 20,
                chartConfig : {
                    title : "Number of Cases with Late Starts",
                    animate : true,
                    animateReplot : true,
                    seriesDefaults : {
                        renderer : $.jqplot.BarRenderer,
                        pointLabels : {
                            show : true,
                            location : "s"
                        },
                        trendline : {
                            show : false
                        },
                        rendererOptions : {
                            shadowOffset : 1,
                            shadowAlpha : 0.2,
                            shadowDepth : 5,
                            shadowAngle : 137,
                            highlightMouseOver : true
                        }
                    },
                    seriesColors : ["lightblue"],
                    axes : {
                        xaxis : {
                            renderer : $.jqplot.CategoryAxisRenderer,
                            tickRenderer : $.jqplot.CanvasAxisTickRenderer,
                            tickOptions : {
                                angle : 30
                            }
                        },
                        yaxis : {
                            rendererOptions : {
                                forceTickAt0 : true
                            }
                        }
                    },
                    grid : {
                        shadow : false,
                        background : "transparent"
                    },
                    cursor : {
                        show : false
                    },
                    highlighter : {
                        show : false
                    }
                }
            }, {
                componentType : 'BaseChart',
                id : 'FirstCaseOnTimeStarts',
                gridPosLeft : 1,
                gridPosTop : 3,
                gridPosRight : 3,
                gridPosBottom : 5,
                chartDataCall : 'mp_dash_get_fc_ontime_starts',
                detailDataCall : "mp_dash_get_fc_ontime_starts_d",
                detailTableColumnNames : ['Case Number', 'Room', 'Surgeon', 'Anticip. Patient In Room Time', 'Actual Patient In Room Time', 'Minutes Late'],
                detailTableColumnModel : [{
                        name : 'CaseNumber',
                        index : 'CaseNumber',
                        width : 110
                    }, {
                        name : 'Room',
                        index : 'Room',
                        width : 100
                    }, {
                        name : 'Surgeon',
                        index : 'Surgeon'
                    }, {
                        name : 'AnticipIn',
                        index : 'AnticipIn',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'ActualIn',
                        index : 'ActualIn',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'MinutesLate',
                        index : 'MinutesLate',
                        width : 75,
                        sorttype : 'int'
                    }
                ],
                componentFilters : dashboard.periopORManager.pageFilters,
                chartConfig : {
                    title : 'First Case On-time Starts',
                    animate : true,
                    animateReplot : true,
                    seriesDefaults : {
                        renderer : $.jqplot.DonutRenderer,
                        rendererOptions : {
                            showDataLabels : true,
                            dataLabelPositionFactor : 1.6,
                            startAngle : -45
                        }
                    },
                    seriesColors : ['#A0D383', '#888888'],
                    grid : {
                        drawGridlines : false,
                        drawBorder : false,
                        shadow : false,
                        background : "transparent"
                    },
                    cursor : {
                        show : false
                    },
                    highlighter : {
                        show : false
                    }
                }
            }, {
                componentType : 'BaseChart',
                id : 'SubsequentOnTimeStarts',
                gridPosLeft : 4,
                gridPosTop : 3,
                gridPosRight : 6,
                gridPosBottom : 5,
                chartDataCall : 'mp_dash_get_ontime_starts',
                detailDataCall : "mp_dash_get_ontime_starts_d",
                detailTableColumnNames : ['Case Number', 'Room', 'Surgeon', 'Anticip. Patient In Room Time', 'Actual Patient In Room Time', 'Minutes Late'],
                detailTableColumnModel : [{
                        name : 'CaseNumber',
                        index : 'CaseNumber',
                        width : 110
                    }, {
                        name : 'Room',
                        index : 'Room',
                        width : 100
                    }, {
                        name : 'Surgeon',
                        index : 'Surgeon'
                    }, {
                        name : 'AnticipIn',
                        index : 'AnticipIn',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'ActualIn',
                        index : 'ActualIn',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'MinutesLate',
                        index : 'MinutesLate',
                        width : 75,
                        sorttype : 'int'
                    }
                ],
                componentFilters : dashboard.periopORManager.pageFilters,
                chartConfig : {
                    title : 'Subsequent On-time Starts',
                    animate : true,
                    animateReplot : true,
                    seriesDefaults : {
                        renderer : $.jqplot.DonutRenderer,
                        rendererOptions : {
                            showDataLabels : true,
                            dataLabelPositionFactor : 1.6,
                            startAngle : -45
                        }
                    },
                    seriesColors : ['#A0D383', '#888888'],
                    grid : {
                        drawGridlines : false,
                        drawBorder : false,
                        shadow : false,
                        background : "transparent"
                    },
                    cursor : {
                        show : false
                    },
                    highlighter : {
                        show : false
                    }
                }
            }, {
                componentType : "HistoricalBar",
                id : "CaseCancelledDOS",
                gridPosLeft : 10,
                gridPosTop : 1,
                gridPosRight : 12,
                gridPosBottom : 5,
                maxDatapoints : 10,
                chartDataCall : "mp_dash_get_num_cases_cancel",
                detailDataCall : "mp_dash_get_num_cases_cancel_d",
                detailTableColumnNames : ['Case Number', 'Room', 'Surgeon', 'Scheduled Start Time', 'Cancelled Time', 'Cancelled Reason', 'Terminated Time', 'Terminated Reason', 'Rescheduled Time', 'Rescheduled Reason'],
                detailTableColumnModel : [{
                        name : 'CaseNumber',
                        index : 'CaseNumber',
                        width : 110
                    }, {
                        name : 'Room',
                        index : 'Room',
                        width : 100
                    }, {
                        name : 'Surgeon',
                        index : 'Surgeon'
                    }, {
                        name : 'SchedStartTime',
                        index : 'SchedStartTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'CancelledTime',
                        index : 'CancelledTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'CancelledReason',
                        index : 'CancelledReason'
                    }, {
                        name : 'TerminatedTime',
                        index : 'TerminatedTime',
                        width : 100,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'H:i'
                        },
                        cellattr : function (rowId, val, rawObject) {
                            var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                            var dfFull = mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR;
                            var tmpDate = ((rawObject.CancelledTime == "0000-00-00T00:00:00Z") || (rawObject.CancelledTime == "")) ? "" : dateFormatter.formatISO8601(rawObject.CancelledTime, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'TerminatedReason',
                        index : 'TerminatedReason'
                    }, {
                        name : 'RescheduledTime',
                        index : 'RescheduledTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }, {
                        name : 'RescheduledReason',
                        index : 'RescheduledReason'
                    }
                ],
                componentFilters : dashboard.periopORManager.pageFilters,
                chartConfig : {
                    title : "Case Cancelled on DOS ",
                    animate : true,
                    animateReplot : true,
                    seriesDefaults : {
                        renderer : $.jqplot.BarRenderer,
                        pointLabels : {
                            show : true,
                            location : "s"
                        },
                        trendline : {
                            show : false
                        },
                        rendererOptions : {
                            shadowOffset : 1,
                            shadowAlpha : 0.2,
                            shadowDepth : 5,
                            shadowAngle : 137,
                            highlightMouseOver : true
                        }
                    },
                    seriesColors : ["#91e842"],
                    axes : {
                        xaxis : {
                            renderer : $.jqplot.CategoryAxisRenderer,
                            tickRenderer : $.jqplot.CanvasAxisTickRenderer,
                            tickOptions : {
                                angle : 30
                            }
                        }
                    },
                    grid : {
                        shadow : false,
                        background : "transparent"
                    },
                    cursor : {
                        show : false
                    },
                    highlighter : {
                        show : false
                    }
                }
            }, {
                componentType : 'BaseChart',
                id : 'NumOfAddOnCases',
                gridPosLeft : 7,
                gridPosTop : 3,
                gridPosRight : 9,
                gridPosBottom : 5,
                chartDataCall : 'mp_dash_get_add_on',
                detailDataCall : "mp_dash_get_add_on_d",
                detailTableColumnNames : ['Case Number', 'Room', 'Surgeon', 'Scheduled Start Time'],
                detailTableColumnModel : [{
                        name : 'CaseNumber',
                        index : 'CaseNumber',
                        width : 110
                    }, {
                        name : 'Room',
                        index : 'Room',
                        width : 100
                    }, {
                        name : 'Surgeon',
                        index : 'Surgeon'
                    }, {
                        name : 'SchedStartTime',
                        index : 'SchedStartTime',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    },
                ],
                componentFilters : dashboard.periopORManager.pageFilters,
                chartConfig : {
                    title : 'Add-on Cases',
                    animate : true,
                    seriesDefaults : {
                        renderer : $.jqplot.MeterGaugeRenderer,
                        pointLabels : {
                            show : false
                        },
                        rendererOptions : {
                            intervals : [20, 40, 50],
                            intervalColors : ['#66cc66', '#E7E658', '#cc6666']
                        }
                    },
                    grid : {
                        drawGridlines : false,
                        drawBorder : false,
                        shadow : false,
                        background : "transparent"
                    },
                    cursor : {
                        show : false
                    }
                }
            }, {
                componentType : 'AnticipatedStops',
                id : 'AnticipatedStop',
                gridPosLeft : 1,
                gridPosTop : 6,
                gridPosRight : 12,
                gridPosBottom : 8,
                chartDataCall : "mp_dash_get_anticip_stop",
                detailDataCall : "mp_dash_get_anticip_stop_d",
                detailTableColumnNames : ['Case Number', 'Room', 'Surgeon', 'Patient In'],
                detailTableColumnModel : [{
                        name : 'CaseNumber',
                        index : 'CaseNumber',
                        width : 110
                    }, {
                        name : 'Room',
                        index : 'Room',
                        width : 100
                    }, {
                        name : 'Surgeon',
                        index : 'Surgeon'
                    }, {
                        name : 'PatientIn',
                        index : 'PatientIn',
                        width : 115,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'n/j/Y H:i'
                        }
                    }
                ],
                componentFilters : dashboard.periopORManager.pageFilters,
                fullDayView : true,
                chartConfig : {
                    title : 'Patients entering PACU',
                    animate : true,
                    animateReplot : true,
                    axes : {
                        xaxis : {
                            renderer : $.jqplot.CategoryAxisRenderer
                        },
                        yaxis : {
                            min : 0,
                            padMin : 0
                        }
                    },
                    seriesDefaults : {
                        rendererOptions : {
                            smooth : true
                        },
                        trendline : {
                            show : false
                        }
                    },
                    series : [{
                            lineWidth : 2
                        }, {
                            showLine : false,
                            markerOptions : {
                                size : 10,
                                style : "triangle",
                                color : "red"
                            }
                        }
                    ],
                    grid : {
                        shadow : false,
                        background : "transparent"
                    },
                }
            }
        ]
    };
}
