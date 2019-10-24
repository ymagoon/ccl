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
                label : "Day to View",
                filters : [{
                        label : "",
                        filterDef : dashboard.filterDefs.dateRange.start
                    }, {
                        visible : false,
                        filterDef : dashboard.filterDefs.dateRange.start
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
                gridPosRight : 12,
                gridPosBottom : 2,
                chartDataCall : 'mp_dash_get_scoreboard',
                detailDataCall : 'mp_dash_get_scoreboard_details',
                detailTableColumnNames : ['Case Number', 'Room', 'Surgeon', 'Start Time', 'Sched. Start Time', 'Pat. in Room Time', 'Add On', 'Cancel Time', 'Cancel Reason', 'Resched. Time', 'Resched. Reason', 'Term. Time', 'Term. Reason', 'Completed Time', 'Pat. in PACU1 Time', 'Pat. in PACU2 Time'],
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
                            var tmpDate = ((rawObject.StartTime == "0000-00-00T00:00:00Z") || (rawObject.StartTime == "")) ? "" : dateFormatter.formatISO8601(rawObject.StartTime, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'SchedStartTime',
                        index : 'SchedStartTime',
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
                            var tmpDate = ((rawObject.SchedStartTime == "0000-00-00T00:00:00Z") || (rawObject.SchedStartTime == "")) ? "" : dateFormatter.formatISO8601(rawObject.SchedStartTime, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'PatInRoomTime',
                        index : 'PatInRoomTime',
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
                            var tmpDate = ((rawObject.PatInRoomTime == "0000-00-00T00:00:00Z") || (rawObject.PatInRoomTime == "")) ? "" : dateFormatter.formatISO8601(rawObject.PatInRoomTime, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'AddOn',
                        index : 'AddOn',
                        width : 32,
                    }, {
                        name : 'CancelledTime',
                        index : 'CancelledTime',
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
                        name : 'CancelledReason',
                        index : 'CancelledReason'
                    }, {
                        name : 'ReschedTime',
                        index : 'ReschedTime',
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
                            var tmpDate = ((rawObject.ReschedTime == "0000-00-00T00:00:00Z") || (rawObject.ReschedTime == "")) ? "" : dateFormatter.formatISO8601(rawObject.ReschedTime, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'ReschedReason',
                        index : 'ReschedReason'
                    }, {
                        name : 'TermTime',
                        index : 'TermTime',
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
                            var tmpDate = ((rawObject.TermTime == "0000-00-00T00:00:00Z") || (rawObject.TermTime == "")) ? "" : dateFormatter.formatISO8601(rawObject.TermTime, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'TermReason',
                        index : 'TermReason'
                    }, {
                        name : 'CompletedTime',
                        index : 'CompletedTime',
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
                        name : 'PatInPACU1Time',
                        index : 'PatInPACU1Time',
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
                            var tmpDate = ((rawObject.PatInPACU1Time == "0000-00-00T00:00:00Z") || (rawObject.PatInPACU1Time == "")) ? "" : dateFormatter.formatISO8601(rawObject.PatInPACU1Time, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'PatInPACU2Time',
                        index : 'PatInPACU2Time',
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
                            var tmpDate = ((rawObject.PatInPACU2Time == "0000-00-00T00:00:00Z") || (rawObject.PatInPACU2Time == "")) ? "" : dateFormatter.formatISO8601(rawObject.PatInPACU2Time, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }
                ],
                componentFilters : dashboard.periopORManager.pageFilters,
                chartConfig : {}
            }, {
                componentType : "BaseChart",
                id : "NumDelayCases",
                gridPosLeft : 1,
                gridPosTop : 9,
                gridPosRight : 6,
                gridPosBottom : 12,
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
                        width : 110,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'H:i'
                        },
                        cellattr : function (rowId, val, rawObject) {
                            var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                            var dfFull = mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR;
                            var tmpDate = ((rawObject.AnticipIn == "0000-00-00T00:00:00Z") || (rawObject.AnticipIn == "")) ? "" : dateFormatter.formatISO8601(rawObject.AnticipIn, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'ActualIn',
                        index : 'ActualIn',
                        width : 105,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'H:i'
                        },
                        cellattr : function (rowId, val, rawObject) {
                            var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                            var dfFull = mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR;
                            var tmpDate = ((rawObject.ActualIn == "0000-00-00T00:00:00Z") || (rawObject.ActualIn == "")) ? "" : dateFormatter.formatISO8601(rawObject.ActualIn, dfFull);
                            return " title='" + tmpDate + "' ";
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
                componentType : "BaseChart",
                id : "NumDelayMinutes",
                gridPosLeft : 7,
                gridPosTop : 9,
                gridPosRight : 12,
                gridPosBottom : 12,
                chartDataCall : "mp_dash_get_num_delay_minutes",
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
                        width : 110,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'H:i'
                        },
                        cellattr : function (rowId, val, rawObject) {
                            var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                            var dfFull = mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR;
                            var tmpDate = ((rawObject.AnticipIn == "0000-00-00T00:00:00Z") || (rawObject.AnticipIn == "")) ? "" : dateFormatter.formatISO8601(rawObject.AnticipIn, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'ActualIn',
                        index : 'ActualIn',
                        width : 105,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'H:i'
                        },
                        cellattr : function (rowId, val, rawObject) {
                            var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                            var dfFull = mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR;
                            var tmpDate = ((rawObject.ActualIn == "0000-00-00T00:00:00Z") || (rawObject.ActualIn == "")) ? "" : dateFormatter.formatISO8601(rawObject.ActualIn, dfFull);
                            return " title='" + tmpDate + "' ";
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
                    title : "Number of Minutes Cases Started Late ",
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
                    seriesColors : ["#4096ee"],
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
                        width : 110,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'H:i'
                        },
                        cellattr : function (rowId, val, rawObject) {
                            var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                            var dfFull = mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR;
                            var tmpDate = ((rawObject.AnticipIn == "0000-00-00T00:00:00Z") || (rawObject.AnticipIn == "")) ? "" : dateFormatter.formatISO8601(rawObject.AnticipIn, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'ActualIn',
                        index : 'ActualIn',
                        width : 105,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'H:i'
                        },
                        cellattr : function (rowId, val, rawObject) {
                            var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                            var dfFull = mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR;
                            var tmpDate = ((rawObject.ActualIn == "0000-00-00T00:00:00Z") || (rawObject.ActualIn == "")) ? "" : dateFormatter.formatISO8601(rawObject.ActualIn, dfFull);
                            return " title='" + tmpDate + "' ";
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
                        width : 110,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'H:i'
                        },
                        cellattr : function (rowId, val, rawObject) {
                            var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                            var dfFull = mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR;
                            var tmpDate = ((rawObject.AnticipIn == "0000-00-00T00:00:00Z") || (rawObject.AnticipIn == "")) ? "" : dateFormatter.formatISO8601(rawObject.AnticipIn, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'ActualIn',
                        index : 'ActualIn',
                        width : 105,
                        sorttype : 'date',
                        formatter : 'date',
                        formatoptions : {
                            srcformat : 'ISO8601Long',
                            newformat : 'H:i'
                        },
                        cellattr : function (rowId, val, rawObject) {
                            var dateFormatter = new mp_formatter.DateTimeFormatter(MPAGE_LOCALE);
                            var dfFull = mp_formatter.DateTimeFormatter.FULL_DATE_2YEAR;
                            var tmpDate = ((rawObject.ActualIn == "0000-00-00T00:00:00Z") || (rawObject.ActualIn == "")) ? "" : dateFormatter.formatISO8601(rawObject.ActualIn, dfFull);
                            return " title='" + tmpDate + "' ";
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
                componentType : "BaseChart",
                id : "CaseCancelledDOS",
                gridPosLeft : 10,
                gridPosTop : 3,
                gridPosRight : 12,
                gridPosBottom : 5,
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
                            var tmpDate = ((rawObject.SchedStartTime == "0000-00-00T00:00:00Z") || (rawObject.SchedStartTime == "")) ? "" : dateFormatter.formatISO8601(rawObject.SchedStartTime, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'CancelledTime',
                        index : 'CancelledTime',
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
                            var tmpDate = ((rawObject.RescheduledTime == "0000-00-00T00:00:00Z") || (rawObject.RescheduledTime == "")) ? "" : dateFormatter.formatISO8601(rawObject.RescheduledTime, dfFull);
                            return " title='" + tmpDate + "' ";
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
                            var tmpDate = ((rawObject.SchedStartTime == "0000-00-00T00:00:00Z") || (rawObject.SchedStartTime == "")) ? "" : dateFormatter.formatISO8601(rawObject.SchedStartTime, dfFull);
                            return " title='" + tmpDate + "' ";
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
                detailTableColumnNames : ['Case Number', 'Room', 'Surgeon', 'Anticipated Stop', 'Patient Out'],
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
                        name : 'AnticipStop',
                        index : 'AnticipStop',
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
                            var tmpDate = ((rawObject.AnticipStop == "0000-00-00T00:00:00Z") || (rawObject.AnticipStop == "")) ? "" : dateFormatter.formatISO8601(rawObject.AnticipStop, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }, {
                        name : 'PatientOut',
                        index : 'PatientOut',
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
                            var tmpDate = ((rawObject.PatientOut == "0000-00-00T00:00:00Z") || (rawObject.PatientOut == "")) ? "" : dateFormatter.formatISO8601(rawObject.PatientOut, dfFull);
                            return " title='" + tmpDate + "' ";
                        }
                    }
                ],
                componentFilters : dashboard.periopORManager.pageFilters,
                chartConfig : {
                    title : 'Anticipated Stops',
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
                    canvasOverlay : {
                        show : true,
                        objects : [{
                                verticalLine : {
                                    name : 'now',
                                    x : 2,
                                    lineWidth : 1,
                                    lineCap : 'butt',
                                    color : 'blue',
                                    shadow : false
                                }
                            }
                        ]
                    },
                    grid : {
                        shadow : false,
                        background : "transparent"
                    },
                }
            }
        ]
    };
}
