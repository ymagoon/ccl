// Group (Perioperative ABU) specific config - Dashboard independent
if (typeof periop === "undefined") {
	var periop = {};
}
if (typeof periop.dash === "undefined") {
	periop.dash = {};
}
if (typeof periop.dash.filterDefs === "undefined") {
	periop.dash.filterDefs = {
		outdev : {
			defaultVal : "^MINE^"
		},
		provider : {
			type : "Criterion",
			property : "providerID"
		},
		dateRange : {
			start : {
				type : "DatePicker",
				defaultVal : "01012012"
			},
			end : {
				type : "DatePicker",
				defaultVal : "01012013"
			}
		},
		location : {
			iD : {
				type : "Autocomplete",
				defaultVal : "0.0"
			},
			type : {
				type : "Textbox",
				defaultVal : ""
			}
		}
	};
}

// Dashboard (VB_DashboardDemo) specific config
if (typeof periop.dash.vb_DashboardDemo === "undefined") {
	periop.dash.vb_DashboardDemo = {
		layoutType : "CAROUSEL",
		debug : true
	};
}
if (typeof periop.dash.vb_DashboardDemo.pageFilters === "undefined") {
	periop.dash.vb_DashboardDemo.pageFilters = [{
			filterDef : periop.dash.filterDefs.outdev,
			visible : false,
			editable : false
		}, {
			filterDef : periop.dash.filterDefs.provider,
			visible : false,
			editable : false
		}, {
			filterGroup : {
				label : "Date Range: ",
				visible : true,
				editable : true,
				filters : [{
						label : "Start: ",
						filterDef : periop.dash.filterDefs.dateRange.start
					}, {
						label : "End: ",
						filterDef : periop.dash.filterDefs.dateRange.end
					}
				]
			}
		}, {
			filterGroup : {
				label : "Location: ",
				visible : true,
				editable : true,
				filters : [{
						label : "ID(will be Name): ",
						filterDef : periop.dash.filterDefs.location.iD,
						value : "2520057121.0"
					}, {
						label : "Type",
						editable : false,
						filterDef : periop.dash.filterDefs.location.type,
						value : "Area"
					}
				]
			}
		}
	];
}
if (typeof periop.dash.vb_DashboardDemo.layout === "undefined") {
	periop.dash.vb_DashboardDemo.layout = {
		groups : [
			[{
					componentType : "Chart",
					label : "Number of delay minutes",
					id : "NumDelayMinutes",
					widthMultiplier : 2,
					heightMultiplier : 1,
					dataCall : "mp_get_dash_num_delay_minutes",
					componentFilters : periop.dash.vb_DashboardDemo.pageFilters,
					chartConfig : {
						animate : true,
						animateReplot : true,
						seriesDefaults : {
							renderer : $.jqplot.BarRenderer,
							pointLabels : {
								show : false
							},
							trendline : {
								show : false
							},
							rendererOptions : {
								shadowOffset : 4,
								shadowAlpha : 0.7,
								shadowDepth : 6,
								shadowAngle : 135,
								highlightMouseOver : true
							}
						},
						seriesColors : ["#3333FF"],
						axes : {
							xaxis : {
								renderer : $.jqplot.CategoryAxisRenderer,
								tickRenderer : $.jqplot.CanvasAxisTickRenderer,
								tickOptions : {
									angle : -30
								}
							}
						},
						grid : {
							shadow : false
						},
						cursor : {
							show : false
						}
					}
				}, {
					componentType : "Chart",
					label : "Number of cases with delays",
					id : "NumDelayCases",
					widthMultiplier : 2,
					heightMultiplier : 1,
					dataCall : "mp_get_dash_num_cases_with_delays",
					componentFilters : periop.dash.vb_DashboardDemo.pageFilters,
					chartConfig : {
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
								shadowDepth : 10,
								shadowAngle : 137,
								highlightMouseOver : true
							}
						},
						seriesColors : ["#3333FF"],
						axes : {
							xaxis : {
								renderer : $.jqplot.CategoryAxisRenderer,
								tickRenderer : $.jqplot.CanvasAxisTickRenderer,
								tickOptions : {
									angle : -30
								}
							}
						},
						grid : {
							shadow : false
						},
						cursor : {
							show : false
						}
					}
				}, {
					componentType : 'Chart',
					label : 'On-time starts',
					id : 'OnTimeStarts',
					widthMultiplier : 1,
					heightMultiplier : 1,
					dataCall : 'mp_get_dash_ontime_starts',
					componentFilters : periop.dash.vb_DashboardDemo.pageFilters,
					chartConfig : {
						animate : true,
						animateReplot : true,
						seriesDefaults : {
							renderer : $.jqplot.DonutRenderer,
							rendererOptions : {
								diameter : 180,
								innerDiameter : 75,
								sliceMargin : 5,
								startAngle : 270,
								dataLabelPositionFactor : 1.7,
								shadowOffset : 1,
								shadowAlpha : 0.1,
								shadowDepth : 20,
								shadowAngle : 135,
								showDataLabels : true
							}
						},
						seriesColors : ['#FF0000', '#008000'],
						grid : {
							drawGridlines : false,
							drawBorder : false,
							shadow : false
						},
						cursor : {
							show : false
						}
					}
				}
				/*, {
				componentType : 'Chart',
				label : 'Cerner Twitter Feed',
				id : 'CernerTwitterFeed',
				widthMultiplier : 1,
				heightMultiplier : 3,
				dataCall : 'http://search.twitter.com/search.json?q=',
				componentFilters : ['Cerner']
				}*/
			],
			[{
					componentType : 'Chart',
					label : 'Idle Time - REUSING DATA',
					id : 'IdleTime',
					widthMultiplier : 2,
					heightMultiplier : 1,
					dataCall : 'mp_get_dash_idle_time',
					componentFilters : periop.dash.vb_DashboardDemo.pageFilters,
					chartConfig : {
						animate : true,
						animateReplot : true,
						seriesDefaults : {
							renderer : $.jqplot.BarRenderer,
							pointLabels : {
								show : true,
								location : 'n'
							},
							trendline : {
								show : false
							},
							rendererOptions : {
								shadowOffset : 1,
								shadowAlpha : 0.2,
								shadowDepth : 10,
								shadowAngle : 135,
								highlightMouseOver : true
							}
						},
						seriesColors : ["teal"],
						axesDefaults : {
							labelRenderer : $.jqplot.CanvasAxisLabelRenderer,
							rendererOptions : {
								formatString : '%'
							}

						},
						axes : {
							xaxis : {
								renderer : $.jqplot.CategoryAxisRenderer,
								tickRenderer : $.jqplot.CanvasAxisTickRenderer,
								tickOptions : {
									angle : -30
								}
							}
						},
						grid : {
							shadow : false
						},
						cursor : {
							show : false
						}
					}
				}, {
					componentType : 'Chart',
					label : 'Number of Add-on Cases',
					id : 'NumOfAddOnCases',
					widthMultiplier : 1,
					heightMultiplier : 1,
					dataCall : 'mp_get_dash_add_on',
					componentFilters : [
						periop.dash.vb_DashboardDemo.pageFilters[0],
						periop.dash.vb_DashboardDemo.pageFilters[1], {
							filterGroup : {
								id : "AddOnDateRange",
								label : "Date Range: ",
								visible : true,
								editable : false,
								filters : [{
										filterDef : {
											type : "dateTime"
										},
										label : "Start: ",
										value : "10012012"
									}, {
										filterDef : {
											type : "dateTime"
										},
										label : "End: ",
										value : "01012013"
									}
								]
							}
						},
						periop.dash.vb_DashboardDemo.pageFilters[3]
					],
					chartConfig : {
						stackSeries : true,
						seriesDefaults : {
							renderer : $.jqplot.BarRenderer,
							shadowAngle : 135,
							rendererOptions : {
								highlightMouseDown : true,
								barWidth : 30
							},
							pointLabels : {
								show : true,
								formatString : '%d'
							},
							trendline : {
								show : false
							},

						},
						axes : {
							xaxis : {
								renderer : $.jqplot.CategoryAxisRenderer
							}
						}
					}
				}
			],
			[{
					componentType : 'Chart',
					label : 'Scheduled vs. actual minutes - FAKE DATA',
					id : 'NumSchedVsActMinutes',
					widthMultiplier : 3,
					heightMultiplier : 1,
					dataCall : 'mp_get_dash_num_sched_vs_act_m',
					componentFilters : periop.dash.vb_DashboardDemo.pageFilters,
					chartConfig : {
						animate : true,
						animateReplot : true,
						seriesDefaults : {
							rendererOptions : {
								smooth : true
							},
							trendline : {
								show : false
							}
						},
						series : [{
								lineWidth : 20,
								markerOptions : {
									style : 'square'
								}
							}, {
								markerOptions : {
									size : 7,
									style : 'x'
								}
							}, {
								markerOptions : {
									style : 'circle'
								}
							}, {
								lineWidth : 5,
								markerOptions : {
									style : 'filledSquare',
									size : 10
								}
							}
						],
						axes : {
							xaxis : {
								renderer : $.jqplot.CategoryAxisRenderer
							}
						},
						grid : {
							shadow : false
						}
					}
				}
			]
		]
	};
}
