function wklWorklist(controller) {
	var m_controller = controller;
	var staticContentPath = m_controller.staticContentPath;
	var curScrollLeft = 0;
	var orderedPatientIds = [];
	var filteredOutPatientIds = [];
	var currentUserId = $("body").data("user_id");
	var lastSpinnerUpdatePosition = 0;
	var criterionOb = controller.getCriterion().CRITERION;
	var m_bUTCOn = criterionOb.UTC_ON;
	var m_worklistObj = this;
	var m_selectedIndex = 0;
	var m_expandViewPtId = 0.0;
	var bedrock_prefs = m_controller.getBedrockPrefs();
	var m_staticPositionValues = {
		wlkRightClickWindowWidth:   182,    // width including border width as specified in CSS
		wklRightClickWindowHeight:  42,     // height including border height
		wklRankOptionsWindowHeight: 125,    // height for the rank options window
		wklRankOptionsWindowWidth:  87      // width for the rank options window
	};
	var InsertedPatientIndex;
	var scrollByExpandView = [];
	var visiblePatientCount = 0;
	var firstPatientRow;
	var firstPatientRowID;
	var lastPatientRowID;
	var lastScrollTop = 0;
	var firstSelectedId;
	var lastSelectedId;
	var divShown = {
		firstRow : 1,
		secondRow : 2,
		thirdRow : 3
	};
	var listDisplayLength = 75;
	var oCurrentPopover = null;
	var worklistItemsArray = [];
	var colDataObjDefault = {
		fixedSize : 0,
		scrollSize : 0,
		fixedWidth : 0,
		scrollWidth : 0,
		shadowWidth : 4,
		numVisible : 12,
		columns : [{
			"title" : "",
			width : 16,
			"fixed" : true,
			"contentBuilder" : (buildDeltaCell),
			"id" : "PtDeltaId",
			key : "COL_DELTA",
			delayedLoad : false, // even though this is a delayed load, it doesn't work like the others
			display: true
		}, {
			"title" : i18n.rwl.CHPATIENT,
			width : 264,
			maxWidth : 792,
			minWidth : 119, // 264 * .45 = 118.8 -- min width is 45% of default width so that rank won't be cut off
			"fixed" : true,
			"contentBuilder" : (createPatientCell),
			"id" : "PtCellId",
			key : "COL_PATIENT",
			delayedLoad : false,
			display: true
		}, {
			"title" : bedrock_prefs.PCP_HEADER,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildPCPCell),
			"dataSet" : "PPRS",
			"columnLoadName" : "providerReltns",
			key : "COL_PRI_CARE_PHY",
			delayedLoad : true,
			display: true
		}, {
			"title" : i18n.rwl.CHCONDITIONS,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildConditionCell),
			"dataSet" : "CONDITIONS",
			"columnLoadName" : "conditions",
			key : "COL_CONDITIONS",
			delayedLoad : true,
			display: true
		}, {
			"title" : i18n.rwl.CHPAYER,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildHealthPlanCell),
			"dataSet" : "HEALTH_PLANS",
			"columnLoadName" : "healthPlans",
			key : "COL_PAYER_HP_CLASS",
			delayedLoad : true,
			display: true
		}, {
			"title" : i18n.rwl.CHRISK,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildRiskCell),
			"columnLoadName" : "risks",
			key : "COL_RISK",
			delayedLoad : true,
			display: true
		}, {
			"title" : i18n.rwl.CHADMITDISCHARGE,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildLast24HourEncounterCell),
			"dataSet" : "encounterBucketAr",
			"columnLoadName" : "encounters",
			key : "COL_ADM_DISCH_LAST_24HRS",
			delayedLoad : true,
			display: true
		}, {
			"title" : i18n.rwl.CHVISITS,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildEncountersByTypeCell),
			"dataSet" : "encounterBucketAr",
			"columnLoadName" : "encounters",
			key : "COL_VISITS_TIMEFRAME",
			delayedLoad : true,
			display: true
		}, {
			"title" : bedrock_prefs.CASE_MGR_HEADER,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildCaseManagerCell),
			"dataSet" : "PPRS",
			"columnLoadName" : "providerReltns",
			key : "COL_CASE_MANAGER",
			delayedLoad : true,
			display: true
		}, {
			"title" : i18n.rwl.CHREGISTRYIMPORT,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildRegistryImportCell),
			"dataSet" : "REGISTRY",
			"columnLoadName" : "conditions",
			key : "COL_REGISTRY_IMPORT",
			delayedLoad : true,
			display: true
		}, {
			"title" : i18n.rwl.CHQUALIFIEDDATE,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildQualifiedDateCell),
			key : "COL_QUALIFIED_DATE",
			delayedLoad : false,
			display: true
		}, {
			"title" : i18n.rwl.CHLASTCOMPACTION,
			width : 200,
			maxWidth : 600,
			minWidth : 40,
			"fixed" : false,
			"contentBuilder" : (buildLastCompActionCell),
			"dataSet" : "COMMENTS",
			"columnLoadName" : "workItems",
			key : "COL_LAST_COMP_ACTION",
			delayedLoad : true,
			display: true
		}]
	};
	if(m_controller.getRiskFlag() == 0 && m_controller.getMaraFlag() === 0) {
		for(var c = 0, clen = colDataObjDefault.columns.length; c < clen; c++) {
			if(colDataObjDefault.columns[c].title == i18n.rwl.CHRISK) {
				colDataObjDefault.columns.splice(c, 1);
				break;
			}
		}
	}
	var colDataObj = $.extend(true, {}, colDataObjDefault);
	var wklColumns = {};

	var pvFrameworkLinkObj = window.external.DiscernObjectFactory("PVFRAMEWORKLINK");
	var $worklist = $("<div class='wklOuterDiv full' id ='wklOuterDiv'>")
						.mouseover(function(event) {  //Handle mouseover on the patient detail columns
							var $target = $(event.target); //span
							var $div = $target.parent();
							var tooltipText = null;
							if($div.hasClass('ellipsis') === true) {
								if(DWL_Utils.fnIsTextOverflowed($div[0]) === true) {
									tooltipText = $div.hasClass('subDiv') === true ? $div.html() : $target.html();
									$div.addClass('hoverColor');
									buildFullTextTooltip(tooltipText, event);
								}
							}
							else if($div.hasClass('divWorklistMoreImg') === true) {
								var colType = $target.parents(".wklRowCell").attr("key");
								var ptID = $target.parents(".wklPatientRow").attr("id").replace("PtRowId", "");
								m_worklistObj.buildMoreTooltip(colType, ptID, event);
							}
						})
						.mouseout(function(event){  //Handle mouseout on the patient detail columns
							var $target = $(event.target);  //span
							var $div = $target.parent();
							if($div.hasClass('hoverColor')){
								$div.removeClass('hoverColor');
								$("#wklOuterDiv").children("div.ellipsisToolTip").remove();
							}
							$("#moreTooltip").parent().remove();
						})
						.append(buildListContents())
						.appendTo($('body'));

	function buildListContents() {
		colDataObj.fixedSize = colDataObj.scrollSize = colDataObj.fixedWidth = colDataObj.scrollWidth = 0;
		return $()
			.add(buildWklRightClickMenu())
			.add(buildWklRightClickRankMenu())
			.add(buildHeaderRightClickMenu())
			.add(buildHeaderRightClickSubMenu())
			.add(buildHeader())
			.add($("<div id ='loadingMessage'>").append($("<img src='" + staticContentPath + "/images/6439_48.gif'/>")))
			.add(buildBody())
			.add($("<div id='wklResizeLine'>"))
			.add($("<div id = 'wklExpandedViewWrapper'>")
					.append($("<div id = 'wklExpandedView'>").css("left", colDataObj.fixedWidth)))
			.add($('<div class="wklHorizScroller handleRowSelection">')
				.css({
					'width': 'calc(100% - ' + DWL_Utils.getScrollbarWidth() + 'px)'
				})
				.addClass('hidden')
				.append($("<div class='wklHorizScrollerInset'>"))
				.scroll(function() {
					var scrollLeft = $(this).scrollLeft();
					$("#wklHeaderDiv div.wklHeaderScroll").scrollLeft(scrollLeft);
					$("#wklBodyScroll").scrollLeft(scrollLeft);
					if (scrollLeft > 0) {
						showWklShadow();
					} else {
						hideWklShadow();
					}
				}));
	}


	function rightClickOnPatientRow(event,id) {
		var curSelected = $("#wklBodyScroll").find("div.wklPatientRow#PtRowId" + id).hasClass("selected");
		if(curSelected) {
			handlePatientRowRightClick(event);
		} else {
			clearWklRightClickMenu();
			handlePatientRowSelection(event,id);
			handlePatientRowRightClick(event);
		}
	}

	function handlePatientRowRightClick(event) {
			for(var rowcnt = 0; rowcnt < 6; rowcnt++) {
			    $("#rightClickRank" + rowcnt + "").replaceWith(function () {
					return m_controller.createRankControl($(this).data('rank-value'),"subOpt" + rowcnt,"",true).addClass("subDiv");
				});
			}
			var patientsSelected = m_controller.getPatientSelectedValue();
			if(patientsSelected.length > 0) {
				m_worklistObj.rightClickMenuOperations(event,m_controller.arePatientsRemovable(patientsSelected),patientsSelected);
			}
	}
	function setRankUsingDot($target) {
		var newValue = $target.data('rank-value');
		var $parent = $target.parent();
		var rankChanged = updateDots($parent, newValue);
		if(rankChanged) {
			m_controller.setSinglePatientRank(newValue, $parent.attr("id"));
		}
	}
	function updateDots($rankContainer, newValue) {
		var rankChanged = false;
		var $children = $rankContainer.children();
		$children.each(function(){
			var $rankDot = $(this);
			var dotValue = $rankDot.data('rank-value');
			var isOn = $rankDot.hasClass("on");
			if(dotValue <= newValue && !isOn) {
				$rankDot.addClass("on");
				rankChanged = true;
			}
			else if(dotValue > newValue && isOn) {
				$rankDot.removeClass("on");
				rankChanged = true;
			}
		});
		return rankChanged;
	}

	m_controller.addMousedownFunction(function($target,bScrollbar,event){
		if($target.closest("#wklBodyFixed").length) {  //Handle all clicks on the patient column
			clearHeaderRightClickMenu();
			switch(event.which) {
				case 1:
					clearWklRightClickMenu();
					if($target.is("a")) { //let links do their own thing
						if(!$target.closest(".patientName").length) {
							return;
						}
					}
					if($target.hasClass("rank")) {
						setRankUsingDot($target);
						event.stopPropagation();
						return;
					}
					if($target.hasClass("wklPtCellButton")) { //clear selection on expand view
						removeSelectedPtRows();
						return;
					}
					var $patientRowFixed = $target.hasClass("wklPatientRowFixed") ? $target : $target.parents("div.wklPatientRowFixed");
					if($patientRowFixed.length > 0 && !$("#filterTab").hasClass("expandViewShown")) {
						handlePatientRowSelection(event, $patientRowFixed.attr("id").replace("PtRowFixedId",""));
						event.stopPropagation();
						return;
					}
					break;
				case 3:
					var $patientRowFixed2 = $target.hasClass("wklPatientRowFixed") ? $target : $target.parents("div.wklPatientRowFixed");
					if($patientRowFixed2.length > 0 && !$("#filterTab").hasClass("expandViewShown")) {
						rightClickOnPatientRow(event, $patientRowFixed2.attr("id").replace("PtRowFixedId",""));
					}
					break;
			}
		}
		if($target.closest("#wklBodyScroll").length) {     //Handle all mousedowns on the patient detail columns
			clearHeaderRightClickMenu();
			var $patientRow = $target.hasClass("wklPatientRow") ? $target : $target.parents("div.wklPatientRow");
			if($patientRow.length == 0) {
				return;
			}
			$("#wklOuterDiv").unbind("contextmenu"); //ENABLE THE DEFAULT RIGHT CLICK MENU IF DISABLED
			switch(event.which) {
			case 1:				// Left Click
				clearWklRightClickMenu();
				handlePatientRowSelection(event,$patientRow.attr("id").replace("PtRowId",""));
				break;
			case 2:				// Center,Scroll Click
				break;
			case 3:				// Right Click
				rightClickOnPatientRow(event,$patientRow.attr("id").replace("PtRowId",""));
				break;
			}
		}

		if(!$target.closest("div.filterToolbarDrop,div.wklPatientRow,div.wklPatientRowFixed,div.worklistContentDiv,.handleRowSelection,#wklExpandedView,#hiddenToolbar").length){
			if($("#divSaveBackground").length == 0) {
				if(bScrollbar && $target.is("#wklBodyDiv")){
					return;	// Click is in the scrollbar area
				}
				clearHeaderRightClickMenu();
				if($target.closest("#wklHeaderDiv .wklHeaderCell").length) {
					clearWklRightClickMenu();
					handleRightClickOnHeader(event);
					return;
				}

				$target.closest("#wklRightClickRankOptionsId .wklRightClickRankOptionsTabs").each(function(index) {
					changePatientRowRank($(this).attr("id").replace("#",""));
				});

				if($target.closest("#wklRightClickWindowRmvPatId").length) {
					if(event.which == 1) {								// 1 - LEFT CLICK
						m_controller.removePatients();
					}
					clearWklRightClickMenu();
				}
				if(m_controller.getPatientSelectedValue().length > 0) {
					if(!$target.closest("#wklRightClickWindowRmvPatId").length) {
						m_worklistObj.clearRowSelection();
					}
				}

				if(!$("#wklBodyDiv").hasClass('expandViewShown')) {
					m_controller.clearPOI();
				}
			}
		}
	});
	function handleRightClickOnHeader(event) {
		var clickType = event.which;
		var $outerDiv = $("#wklOuterDiv");
		var $wklHeaderDropId = $("#wklHeaderDropId");
		if(clickType == 3 && !$("#filterTab").hasClass("expandViewShown")) {
			$outerDiv.bind("contextmenu", function(e) {		// DISABLE THE DEFAULT RIGHT CLICK MENU
				return false;
			});
			var x = event.pageX - $("#filterShell").width();
			var y = event.pageY - $("#divFilterPanelTopBar").height();

			var $errDisplay =  $("#wklMessageBanner");
			if(!($errDisplay.is(":hidden"))) {
				var messageDivHeight = $errDisplay.outerHeight();
				y = y - messageDivHeight;
			}

			var wklHeaderDropWidth = $wklHeaderDropId.outerWidth();
			var wklDropDownTotalWidth = wklHeaderDropWidth + $("#wklHeaderSubMenuId").outerWidth();
			if($outerDiv.width() - x <= wklHeaderDropWidth) {
				x = x - wklHeaderDropWidth;
			}
			$wklHeaderDropId.css('top',y).css('left',x).show();
			if($outerDiv.width() - x <= wklDropDownTotalWidth) {
				x = x - wklDropDownTotalWidth;
			}
			showHeaderRightClickSubMenu(x,y,wklHeaderDropWidth);
		}
	}

	function buildHeader() {
		clearWklRightClickMenu();
		clearHeaderRightClickMenu();
		var $fixed = $("<div>");
		var $scroll = $("<div>");
		var numVisible = colDataObj.numVisible;
		var numDrawn = 0;
		for (var i = 0, len = colDataObj.columns.length; i < len; i++) {
			var curColumn = colDataObj.columns[i];
			if(curColumn.display) {
				var $headerCell = $("<div class='wklHeaderCell' id='wklHeader"+ curColumn.key + "'>");

				if(numDrawn < numVisible -1) {
					$headerCell.css("width", curColumn.width);
				}
				else {
					$headerCell.addClass("rightmost");
				}

				if(curColumn.key == "COL_PATIENT")
				{
						$headerCell.append($("<div class='ellipsis patientHeaderExtraMargin'>")
											.append("<span>" + curColumn.title + "</span>")
											.width(curColumn.width-20),
											buildHeaderResize(curColumn.key));
				}
				else if(curColumn.key != "COL_DELTA")
				{
						$headerCell.append($("<div class='ellipsis'>")
											.append("<span>" + curColumn.title + "</span>")
											.width(curColumn.width-20),
											buildHeaderResize(curColumn.key));
				}

				if(curColumn.delayedLoad) {
					$headerCell.append("<img src='" + staticContentPath + "/images/6439_16.gif'/>");
				}
				wklColumns[curColumn.key] = i;

				if (curColumn.fixed) {
					colDataObj.fixedSize++;
					colDataObj.fixedWidth += curColumn.width + 1;
					$fixed.append($headerCell);
				}
				else {
					colDataObj.scrollSize++;
					colDataObj.scrollWidth += curColumn.width + 1;
					$scroll.append($headerCell);
				}
				numDrawn++;
			}
		}

		var $header = $("<div id='wklHeaderDiv'>")
			.append($("<div class='wklHeaderFixed'>")
			.css("width", colDataObj.fixedWidth + colDataObj.shadowWidth)
			.append($fixed.children(), $("<div class='wklShadow wklShadowOverlayDimmed'>")
			.css("width", colDataObj.shadowWidth)), $("<div class='wklHeaderScroll'>")
			.css("left", colDataObj.fixedWidth).append($("<div class='wklHeaderHorizScroller'>")
			.css("width", colDataObj.scrollWidth).append($scroll.children())));
		return $header;
	}

	function buildHeaderResize(colKey) {
		var $resizeDiv = $("<div class='wklHeaderResizeDiv'>");
		var beginx = 0;
		$resizeDiv.mousedown(function(event) {
			var $outerDiv = $("#wklOuterDiv");
			var $scroller = $outerDiv.find("div.wklHorizScroller");
			var $inset = $outerDiv.find("div.wklHorizScrollerInset");
			var $resizeLine = $("#wklResizeLine");
			var $bodyScroll = $("#wklBodyScroll");
			var $bodyFixed = $("#wklBodyFixed");
			var $wklHeaderDiv = $("#wklHeaderDiv");
			var $curColHeader = $("#wklHeader" + colKey);
			var $curWklCol = $("#wklBodyDiv").find("." + colKey);
			var filterWidth = $("#filterShell").width();

			$resizeLine.css("left", (event.pageX - filterWidth)).show();
			$("body").mouseleave(function(event) {
				$resizeLine.hide();
				$inset.width(colDataObj.fixedWidth + colDataObj.shadowWidth + colDataObj.scrollWidth);
				$scroller.scroll();
				$outerDiv.unbind("mousemove mouseup").removeClass("resizingCol");
				$(this).unbind("mouseleave");
				event.stopPropagation();
			});
			$inset.width(colDataObj.fixedWidth + colDataObj.shadowWidth + colDataObj.scrollWidth + 400);

			$outerDiv.addClass("resizingCol").mousemove(function(event) {
				var offset = filterWidth + getColOffset(colKey);
				if(!colDataObj.columns[wklColumns[colKey]].fixed) {
					offset -= $bodyScroll.scrollLeft();
				}
				var newWidth = event.pageX-offset;
				var col = findDefaultCol(colKey);
				if(newWidth > col.maxWidth || newWidth < col.minWidth) {
					event.stopPropagation();
					return;
				}
				var x = event.pageX - filterWidth;
				$resizeLine.css("left", x);
				if(x > beginx && $curColHeader.hasClass('rightmost')) {
					var scrollLeft = $scroller.scrollLeft() + 50;
					$scroller.scrollLeft(scrollLeft).scroll();
				}
				beginx = x;
				event.stopPropagation();
			}).mouseup(function(event) {
				var fixed = colDataObj.columns[wklColumns[colKey]].fixed;
				var offset = getColOffset(colKey);
				if(!fixed) {
					offset -= $bodyScroll.scrollLeft();
				}
				var newWidth = parseInt($resizeLine.css("left"),10) - offset;
				var widthDiff = newWidth - colDataObj.columns[wklColumns[colKey]].width;
				colDataObj.columns[wklColumns[colKey]].width = newWidth;
				if(fixed) {
					colDataObj.fixedWidth += widthDiff;
					var colDataObjWidth = colDataObj.fixedWidth;
					var colDataObjShadowWidth = colDataObj.shadowWidth;
					$wklHeaderDiv.find("div.wklHeaderFixed").width(colDataObjWidth + colDataObjShadowWidth);
					$bodyFixed.width(colDataObjWidth + colDataObjShadowWidth).find("div.wklPatientRowFixed").width(colDataObjWidth);
					$wklHeaderDiv.find("div.wklHeaderScroll").css("left", colDataObjWidth);
					$bodyScroll.css("padding-left", colDataObjWidth);
					if(colKey == "COL_PATIENT") {
						$bodyFixed.find(".ellipsis").width(newWidth-30); //30 to accommodate the data being so far left in the cell
						$("#wklBodyFixedGrayTop")
						.add("#wklBodyFixedGrayBottom")
						.remove();
						$bodyFixed.prepend(buildGrayOverlay("wklBodyFixedGrayTop"), buildGrayOverlay("wklBodyFixedGrayBottom"));
						$("#wklExpandedView").css("left", colDataObjWidth);
					}
				}
				else {
					colDataObj.scrollWidth += widthDiff;
					$bodyScroll.find("div.wklPatientRow").width(colDataObj.scrollWidth);
				}
				$wklHeaderDiv.find("div.wklHeaderHorizScroller").width(colDataObj.scrollWidth);
				$inset.width(colDataObj.fixedWidth + colDataObj.shadowWidth + colDataObj.scrollWidth);
				$curColHeader.width(newWidth).children(".ellipsis").width(newWidth-20); //20 to account for the 10px of the resize area
				$curWklCol.width(newWidth).children().find("div").not(".divWorklistMoreImg").width(newWidth-15);
				$resizeLine.hide();
				$scroller.scroll();
				$(this).unbind("mousemove mouseup").removeClass("resizingCol");
				$("body").unbind("mouseleave");
				m_controller.updateColumnPrefs(colDataObj, false, "resize");
			}).disableSelection();
		});
		return $resizeDiv;
	}
	function getColOffset(colKey) {
		var columns = colDataObj.columns;
		var offset = 0;
		for(var c = 0, clen = columns.length; c < clen; c++) {
			curColumn = columns[c];
			if(curColumn.display == true){
				if(curColumn.key == colKey) {
					break;
				}
				else {
					offset += curColumn.width + 1;
				}
			}
		}
		return offset;
	}
	function findDefaultCol(colKey) {
		var columns = colDataObjDefault.columns;
		for(var c = 0, clen = columns.length; c < clen; c++) {
			curColumn = columns[c];
			if(curColumn.key == colKey) {
				return curColumn;
			}
		}
	}
	function buildHeaderRightClickMenu() {
		var htmlString = "<tr id='trwklDefaultSort'><td><span>" + i18n.rwl.SETDEFAULTSORT + "</span></td>";
		htmlString += "<td class='tdMenuIcon'><span><img src='" + staticContentPath + "/images/right_arrow.png'/></span></td></tr>";
		var tablewklActionsList = $("<table id='tablewklActionsList' class='wklHeaderDropTable' />")
				.append(htmlString)
				.find("tr").mouseover(function(){
					if($(this).hasClass("disabled")){
						return false;
					}
					switch($(this).attr("id")){
						case "trwklDefaultSort":
							$("#wklHeaderSubMenuId").show();
							break;
						default:
							$("#wklHeaderSubMenuId").hide();
							break;
					}
			}).end();
		var headerRightClickMenu = $("<div class='wklHeaderDrop' id='wklHeaderDropId'>")
				.append(tablewklActionsList);

		return headerRightClickMenu;
	}

	function buildHeaderRightClickSubMenu() {
		var tableWklDefaultSort = $("<table id='tableWklDefaultSort' class='wklHeaderDropTable'/>")
				.append("<tr id='trWklName'><td class='tdMenuIcon'><span><span><img src='" + staticContentPath + "/images/6432_11.png'/></span></span></td><td><span>" + i18n.rwl.DSPATIENTNAME + "</span></td></tr>")
				.append("<tr id='trWklRank'><td class='tdMenuIcon'></td><td><span>" + i18n.rwl.DSRANK + "</span></td></tr>")
				.append("<tr id='trWklQualifiedDate'><td class='tdMenuIcon'></td><td></span><span>" + i18n.rwl.DSQUALIFIEDDATE + "</span></td></tr>")
				.append("<tr id='trWklLastAction'><td class='tdMenuIcon'></td><td></span><span>" + i18n.rwl.DSLASTACTION + "</span></td></tr>");
		var headerRightClickSubMenu = $("<div class='wklHeaderSubMenu' id='wklHeaderSubMenuId'>")
				.append(tableWklDefaultSort)
				.find("tr").mousedown(function(event){
					if(event.which == 1) {
						$("#wklOuterDiv")
							.add("#divFilterPanelTopBar")
							.add("#filterShell").css("cursor","wait");
						if($("#fuzzySearchInput").val() != "") {
							m_controller.resetFuzzySearch();
							$("#fuzzySearchInput").keyup();
						}
						if($(this).hasClass("disabled")){
							return false;
						}
						m_controller.createCheckpoint("USR:DWL-SORTLIST", "Start");

						var sID = $(this).attr("id")||"";
						switch(sID){
							case "trWklName":
								m_controller.callSaveDefaultSortCriteria(m_controller.sortCriteria.SORT_BY_NAME);
							break;
							case "trWklRank":
								m_controller.callSaveDefaultSortCriteria(m_controller.sortCriteria.SORT_BY_RANK);
							break;
							case "trWklQualifiedDate":
								m_controller.callSaveDefaultSortCriteria(m_controller.sortCriteria.SORT_BY_QUALIFIED_DATE);
							break;
							case "trWklLastAction":
								m_controller.callSaveDefaultSortCriteria(m_controller.sortCriteria.SORT_BY_LAST_ACTION);
							break;
						}
						clearHeaderRightClickMenu();
						var metaData = [
							{key: "List ID",   value: m_controller.getActivePatientListID()},
							{key: "Sort Type", value:sID.replace(/^trWkl/,"")},
							{key: "Number of Patients", value: m_controller.getStaticPatientListSize()}
						];
						m_controller.createCheckpoint("USR:DWL-SORTLIST", "Stop", metaData);
					}
				}).end();

		return headerRightClickSubMenu;
	}

	function buildWklRightClickMenu() {
		var wklRightClickMenu = $('<div class="wklRightClickWindow" id="wklRightClickWindowId">')
				.append($('<div class="wklRightClickWindowRankTab">')
				.append('<span id="spanRightClickRankFont">' + i18n.rwl.RANK + '</span>')
				.append('<span  id="spanRightClickRankImg"><img id="imgRightClickRankId" src="' + staticContentPath + '/images/right_arrow.png"/></span>')
				.hover(function() {
					$("#imgRightClickRankId").attr("src", "" + staticContentPath + "/images/arrow_white_right_click.png");
					$("#wklRightClickRankOptionsId").show();
				}, function() {
					$("#imgRightClickRankId").attr("src", "" + staticContentPath + "/images/right_arrow.png");
				}),
				$('<div class="wklRightClickWindowRmvPatTab" id="wklRightClickWindowRmvPatId">')
				.append('<span id="spanRightClickRemoveFont">' + i18n.rwl.REMOVEPATIENT + '</span>')
				.mouseenter(function() {
					$("#wklRightClickRankOptionsId").hide();
				}));

		return wklRightClickMenu;
	}

	function buildWklRightClickRankMenu() {
		var htmlString = "";
		for(var rowcnt = 0; rowcnt < 6; rowcnt++) {
			htmlString += '<div id="subOpt' + rowcnt + '" class="wklRightClickRankOptionsTabs">';
			htmlString += '<div data-rank-value=' + rowcnt + ' id="rightClickRank' + rowcnt + '"></div></div>';
		}
		var wklRightClickRankMenu = $('<div class="wklRightClickRankOptions" id="wklRightClickRankOptionsId">')
				.append(htmlString);

		return wklRightClickRankMenu;
	}
	function showHeaderRightClickSubMenu(leftpos,toppos,wklHeaderDropWidth) {
		$("#wklHeaderSubMenuId").css('top',toppos).css('left',leftpos+wklHeaderDropWidth).hide();
	}


	function handleWorklistScrolling($this) {
		if(worklistItemsArray.length <= listDisplayLength) {
			visiblePatientCount = worklistItemsArray.length;
		}
		var scrollDirection;
		var st = $this.scrollTop();
		if (st > lastScrollTop){			// downscroll code
			scrollDirection = "down";
		}
		if (st < lastScrollTop) {			// upscroll code
			scrollDirection = "up";
		}
		lastScrollTop = st;

		var $firstRow;
		if(!firstPatientRow) {
			firstPatientRowID = orderedPatientIds[0];
			$firstRow = $("#PtRowId" + firstPatientRowID);
			lastPatientRowID = orderedPatientIds[99];
		} else {
			$firstRow = $(firstPatientRow);
		}
		var rowHeight = $firstRow.height();

		var $wklBodyDiv = $("#wklBodyDiv");
		var $wklBodyScroll = $("#wklBodyScroll");
		var topRowPosition = $wklBodyScroll.position().top;
		var scrollPosition = Math.floor(Math.abs(topRowPosition/rowHeight));
		var percentageScrolled = ($wklBodyDiv.scrollTop()/$wklBodyScroll.height())*100;
		var sortCriteria = m_controller.getSortCriteria();

		if(scrollDirection == "up") {
			if((scrollPosition % 17) == 0 && scrollPosition > 1 && scrollPosition < 18) {
				if(divShown.firstRow != 1 && divShown.secondRow != 2 && divShown.thirdRow != 3) {
					var worklistItems = worklistItemsArray;
					m_worklistObj.showPatientList(worklistItems,sortCriteria,(listDisplayLength/3),"",scrollDirection);
					m_controller.updatePatientCounts(worklistItems);
				}
			}
			if(percentageScrolled < 1) {
				if(firstPatientRowID != orderedPatientIds[0]) {
					var worklistItems = worklistItemsArray;
					m_worklistObj.showPatientList(worklistItems,sortCriteria,(listDisplayLength/3),"",scrollDirection);
					m_controller.updatePatientCounts(worklistItems);
				}
			}

		} else if(scrollDirection == "down"  && scrollPosition > 1) {
			if(scrollPosition >= 49 && scrollPosition < 51 && (scrollPosition % 50) == 0) {
				var worklistItems = worklistItemsArray;
				m_worklistObj.showPatientList(worklistItems,sortCriteria,(listDisplayLength/3),"",scrollDirection);
				m_controller.updatePatientCounts(worklistItems);
			}
			if(($wklBodyDiv.scrollTop() >= ($wklBodyScroll.height() - $wklBodyDiv.height())) || (scrollPosition % 68) == 0) {
				var worklistItems = worklistItemsArray;

				m_worklistObj.showPatientList(worklistItems,sortCriteria,(listDisplayLength/3),"",scrollDirection);
				m_controller.updatePatientCounts(worklistItems);
			}

			if(percentageScrolled > 80 && percentageScrolled < 100) {

				var orderedPatientIdsLength = orderedPatientIds.length;

				if(lastPatientRowID != orderedPatientIds[orderedPatientIdsLength - 1]) {
					var worklistItems = worklistItemsArray;
					if(scrollDirection == "down" && visiblePatientCount < worklistItems.length) {
						m_worklistObj.showPatientList(worklistItems,sortCriteria,(listDisplayLength/3),"",scrollDirection);
						m_controller.updatePatientCounts(worklistItems);
					}
				}
			}
		}
	}
	function getTopOffsetOfWorklistBody() {
		var $body = $('#wklBodyDiv');
		var $fakeElementToGetCssProperty = null;
		var top = 0;
		if ($body.length > 0) {
			top = $body.offset().top;
		} else {
			$fakeElementToGetCssProperty = $('<div id="wklBodyDiv"></div>');
			top = $fakeElementToGetCssProperty.appendTo('body').offset().top;
			$fakeElementToGetCssProperty.remove();
		}
		return top;
	}

	function buildBody() {
		var $body = $("<div id='wklBodyDiv'>")
			.append($("<div class = 'inAccessibleListMsg' id = 'NoListAccess'>")
						.text(i18n.rwl.INACCESSLISTMSG))
			.append($("<div class = 'wklMessage' id = 'NoPerson'>")
						.append($("<div class='message'>" + i18n.rwl.NOPERSON + "</div>"),
								$("<div id='createListBtn'><input type='button' value='" + i18n.rwl.CREATELIST + "'/></div>")
									.on("click", "input", function() {
										m_controller.launchCreateDlg();
									})),
				$("<div id='wklBodyFixed'>")
					.css("width", colDataObj.fixedWidth + colDataObj.shadowWidth)
					.append($("<div class='wklShadow wklShadowOverlayDimmed'>")
								.css("width", colDataObj.shadowWidth))
					.mouseover(function(event){   //Handle mouseover on the patient column
						var $target = $(event.target);
						var $div = $target.parent().parent();
						if($div.hasClass("patientName")) {
							if(DWL_Utils.fnIsTextOverflowed($div[0]) === true) {
									$div.addClass('hoverColor');
									buildFullTextTooltip($target.html(),event);
							}
						}
					})
					.mouseout(function(event){   //Handle mouseout on the patient column
						var $target = $(event.target);
						var $div = $target.parent().parent();
						if($div.hasClass("hoverColor")){
							$div.removeClass('hoverColor');
							$("#wklOuterDiv").children("div.ellipsisToolTip").remove();
						}
					}),
					$("<div id='wklBodyScroll'>")
						.css("padding-left", colDataObj.fixedWidth), $("<div class='wklSpinner'>"))
						.scroll(function() {
							if(scrollByExpandView.length > 0) {
								scrollByExpandView = [];
							} else {
								handleWorklistScrolling($(this));
							}

							var _this = this;
							setTimeout(function() {
								var changeSinceLastUpdate = lastSpinnerUpdatePosition - $(_this).scrollTop();
								if (Math.abs(changeSinceLastUpdate) < 100) {
									return;
								}
								lastSpinnerUpdatePosition = $(_this).scrollTop();
								updateColumnSpinners([
									wklColumns.COL_PRI_CARE_PHY,
									wklColumns.COL_CONDITIONS,
									wklColumns.COL_PAYER_HP_CLASS,
									wklColumns.COL_ADM_DISCH_LAST_24HRS,
									wklColumns.COL_VISITS_TIMEFRAME,
									wklColumns.COL_CASE_MANAGER,
									wklColumns.COL_REGISTRY_IMPORT,
									wklColumns.COL_QUALIFIED_DATE,
									wklColumns.COL_LAST_COMP_ACTION
								]);
								if (m_controller.getRiskFlag() === 1 || m_controller.getMaraFlag() === 1) {
								    updateColumnSpinners([wklColumns.COL_RISK]);
								}
							}, 1);
						})
						.disableSelection();
		$body.css(
			'height',
			'calc(100% - ' + DWL_Utils.getScrollbarWidth() + 'px - ' + getTopOffsetOfWorklistBody() + 'px)'
		);
		$("#wklOuterDiv").find("div.wklHorizScroller").addClass("hidden");
		return $body;
	}
	function buildFullTextTooltip(fullText, event, bMore) {
	    var toolTipHeight;
	    var toolTipWidth;
	    var leftSpace;
	    var topSpace;
	    var rightSpace;
	    var bottomSpace;
	    var hoverOffset;
	    var leftAdj;
	    var topAdj;
        var $target = $(event.target);
        var divLength = $target.parents(".COL_LAST_COMP_ACTION").length; //This is to check if it is the last completed action column
	    var $outerDiv = $("#wklOuterDiv"),
			$toolTip = $("<div class = 'ellipsisToolTip'>" + fullText + "</div>")
						.find(bMore ? "table.worklistContentTable" : "").unwrap().end()
						.appendTo($outerDiv);


	    toolTipHeight = $toolTip.height();
	    if (divLength > 0) {
	        toolTipWidth = 0.4 * $outerDiv.width(); //added 0.4 just to look better.
	        $toolTip.css("display", "inline-block");
	    }
	    else {
	        toolTipWidth = $toolTip.width();
	    }

	    leftSpace = event.pageX - $outerDiv.offset().left;
	    topSpace = event.pageY - $outerDiv.offset().top;
	    rightSpace = $outerDiv.width() - leftSpace - 4; // 4 is buffer space from somewhere
	    bottomSpace = $outerDiv.height() - topSpace - 4;

	    hoverOffset = 20; // distance we'll try to put the tooltip from cursor either dimension

	    leftAdj = rightSpace < (0.7 * leftSpace) ?		// if much less space below/right, move to other side
                    Math.min(leftSpace,toolTipWidth + hoverOffset) * -1 :		// but don't go past far top/left
                    toolTipWidth + hoverOffset > rightSpace ? 		// check if it will exceed far bottom/right
                        Math.max(leftSpace * -1,rightSpace - toolTipWidth) :		// don't go past far top/left
                        hoverOffset;		// just move down/right by the desired offset - no adjustments needed

		topAdj = bottomSpace < (0.7 * topSpace) ?
						Math.min(topSpace,toolTipHeight + hoverOffset) * -1 :
						toolTipHeight + hoverOffset > bottomSpace ?
							Math.max(topSpace * -1,bottomSpace - toolTipHeight) :
							hoverOffset;
		$toolTip.css({ width: toolTipWidth,top: topSpace + topAdj, left: leftSpace + leftAdj });
	}
	function showWklShadow() {
		$("#wklHeaderDiv").find("div.wklShadow").show();
		$("#wklBodyFixed").find("div.wklShadow").show();
	};
	function hideWklShadow() {
		$("#wklHeaderDiv").find("div.wklShadow").hide();
		$("#wklBodyFixed").find("div.wklShadow").hide();
	};
	this.addFilteredOutPatientId = function(personId) {
		var added = false;
		if($.inArray(personId, orderedPatientIds) === -1) {
			filteredOutPatientIds.push(personId);
			added = true;
		}
		return added;
	};
	this.retainFilteredOutPatientIds = function() {
		filteredOutPatientIds = [];
		var allPatients = m_controller.getAllPatients(),
		allPatientsLength = allPatients.length;
		for(var i = 0; i < allPatientsLength; i++) {
			m_worklistObj.addFilteredOutPatientId(allPatients[i].PERSON_ID);
		}
	};
	this.retainDisplayedPatientIds = function(worklistItems) {
		orderedPatientIds = [];
		for (var i = 0, sz = worklistItems.length; i < sz; i++) {
			orderedPatientIds.push(worklistItems[i].PERSON_ID);
		}
		worklistItemsArray = worklistItems;
	};
	this.redrawPatientList = function(worklistItems,sortBy) {
		firstSelectedId = undefined;
		lastSelectedId = undefined;
		if(worklistItems != undefined && sortBy != undefined) {
			worklistItemsArray = worklistItems;
		}
		$("#wklOuterDiv").empty().append(buildListContents());
		m_worklistObj.showPatientList(worklistItems,sortBy);
		setTimeout(function() {
			updateColumnSpinners([
				wklColumns.COL_PRI_CARE_PHY,
				wklColumns.COL_CONDITIONS,
				wklColumns.COL_PAYER_HP_CLASS,
				wklColumns.COL_ADM_DISCH_LAST_24HRS,
				wklColumns.COL_VISITS_TIMEFRAME,
				wklColumns.COL_CASE_MANAGER,
				wklColumns.COL_REGISTRY_IMPORT,
				wklColumns.COL_QUALIFIED_DATE,
				wklColumns.COL_LAST_COMP_ACTION
			]);
			if (m_controller.getRiskFlag() === 1 || m_controller.getMaraFlag() === 1) {
			    updateColumnSpinners([wklColumns.COL_RISK]);
			}
		},0);
	};

	this.buildRows = function(worklistItem, zebraStriping, addClass, divClass) {
		var newRow = this.buildEntireRow(worklistItem, zebraStriping, addClass, divClass);
		newRow.$fixedCells.appendTo($("#wklBodyFixed"));
		return newRow.patientRow;
	};
	this.showPatientList = function(worklistItems,sortBy,scrollNumber,showType,scrollDirection,callFrom) {
		var showMaxPatients;
		var $fixedBody = $("#wklBodyFixed");
		var $scrollBody = $("#wklBodyScroll");

		if(scrollDirection == "down") {
			if(visiblePatientCount >= worklistItems.length && showType != 2 && showType != 1 && scrollNumber != undefined) {
				return;
			}
			$("#loadingMessage").css({ 'top': '65%', 'left': '45%'}).show();
		} else if(scrollDirection == "up") {
			if((visiblePatientCount > worklistItems.length && showType != 2 && showType != 1 && scrollNumber != undefined) || divShown.firstRow == 1) {
				return;
			}
			$("#loadingMessage").css({ 'top': '25%', 'left': '45%'}).show();
		}

		if(!scrollNumber || scrollNumber == undefined) {
			$fixedBody.find("div.wklPatientRowFixed").remove();
			$scrollBody.find("div.wklPatientRow").remove();
			divShown.firstRow = 1;
			divShown.secondRow = 2;
			divShown.thirdRow = 3;
			scrollNumber = 0;
			showMaxPatients = listDisplayLength;
			if(showMaxPatients > worklistItems.length) {
				showMaxPatients = worklistItems.length;
			}
			visiblePatientCount = showMaxPatients;
			this.clearList();
		} else {
			if(scrollDirection == "down") {
				showMaxPatients = (scrollNumber * (divShown.firstRow) + listDisplayLength);
			} else {
				showMaxPatients = (scrollNumber * (divShown.firstRow - 2) + listDisplayLength/3);
			}
			if(showMaxPatients > worklistItems.length) {
				showMaxPatients = worklistItems.length;
			}
			visiblePatientCount = showMaxPatients;
		}

		if(scrollNumber > worklistItems.length) {
			return;
		}

		if (worklistItems.length == 0) {
			m_controller.setWorklistMessage(i18n.rwl.NOPERSON,true);
		}
		else {
			$("#wklHeaderDiv").show();
			m_controller.setWorklistMessage(i18n.rwl.NOPERSON,false);

			m_worklistObj.retainDisplayedPatientIds(worklistItems);
			m_worklistObj.retainFilteredOutPatientIds();

			if(showType) {
				if(showType == 1) {
					firstPatientRow = "#PtRowId" + worklistItems[0].PERSON_ID + "";
					firstPatientRowID = worklistItems[0].PERSON_ID;
				}
			}

			var aWLComments	  = [],
				loopcount	  = 0,
				scrolla		  = [],
				scrolld		  = [];
			if(!(scrollNumber == 0 || scrollNumber == undefined)) {
				if(scrollDirection == "down") {
					loopcount = scrollNumber * divShown.thirdRow;
				} else {
					loopcount = scrollNumber * (divShown.firstRow - 2);
					$fixedBody.prepend("<div id='testdiv'></div>");
				}
			}

			var patientsSelected = m_controller.getPatientSelectedValue();
			if(loopcount >= 0) {
				for (var j = loopcount;j < showMaxPatients; j++) {
					var zebraStriping = (j % 2 == 0) ? "zebra-white" : "zebra-blue";
					var addClass = false;

					if($.inArray("" + worklistItems[j].PERSON_ID + "", patientsSelected) > -1) {
						addClass = true;
					}

					var newRow;
					if(j<(listDisplayLength/3) && scrollNumber == 0) {

						scrolla.push(this.buildRows(worklistItems[j], zebraStriping, addClass, 1));

					} else if(j>=(listDisplayLength/3) && j<(2*(listDisplayLength/3)) && scrollNumber == 0) {

						scrolla.push(this.buildRows(worklistItems[j], zebraStriping, addClass, 2));

					} else if(j>=(2*(listDisplayLength/3)) && j<listDisplayLength && scrollNumber == 0) {

						scrolla.push(this.buildRows(worklistItems[j], zebraStriping, addClass, 3));

					} else {
						if(scrollDirection == "down") {
							newRow = this.buildEntireRow(worklistItems[j], zebraStriping, addClass, divShown.thirdRow + 1);

							newRow.$fixedCells.appendTo($fixedBody);
							scrolld.push(newRow.patientRow);

							if(callFrom != "expand") {
								$("#wklBodyDiv").scrollTop(2500);
							}
							firstPatientRowID = orderedPatientIds[scrollNumber * (divShown.firstRow)];
							firstPatientRow =  "#PtRowId" + firstPatientRowID + "";
							var lastPatientRowIndex = (scrollNumber * (divShown.firstRow)) + listDisplayLength - 1;
							if(lastPatientRowIndex >= orderedPatientIds.length) {
								lastPatientRowIndex = orderedPatientIds.length - 1;
							}
							lastPatientRowID = orderedPatientIds[lastPatientRowIndex];
						} else if(scrollDirection == "up") {
							newRow = this.buildEntireRow(worklistItems[j], zebraStriping, addClass, divShown.firstRow - 1);

							newRow.$fixedCells.appendTo($("#testdiv"));
							scrolld.push(newRow.patientRow);

							if(callFrom != "expand") {
								$("#wklBodyDiv").scrollTop(4300);
							}
							firstPatientRowID = orderedPatientIds[scrollNumber * (divShown.firstRow - 2)];
							firstPatientRow =  "#PtRowId" + firstPatientRowID + "";
							var lastPatientRowIndex = (scrollNumber * (divShown.firstRow)) + listDisplayLength - 1;
							if(lastPatientRowIndex >= orderedPatientIds.length) {
								lastPatientRowIndex = orderedPatientIds.length - 1;
							}
							lastPatientRowID = orderedPatientIds[lastPatientRowIndex];
						}
					}

					if(worklistItems[j].COMMENTS){
						aWLComments.push(worklistItems[j]);
					}
					newRow = null;
				}
			}

			if(scrollNumber == 0 || scrollNumber == undefined) {
				$scrollBody.append(scrolla.join(""));
			} else {
				if(scrollDirection == "down") {
					$fixedBody.find("div.wklPatientRowFixed.div" + (divShown.firstRow)).remove();
					$scrollBody.append(scrolld.join("")).find("div.wklPatientRow.scroll" + (divShown.firstRow)).remove();
				} else {
					$fixedBody.prepend($("#testdiv").children()).find("div.wklPatientRowFixed.div" + (divShown.thirdRow)).remove();
					$scrollBody.prepend(scrolld.join("")).find("div.wklPatientRow.scroll" + (divShown.thirdRow)).remove();
					$("#testdiv").remove();
				}
			}

			if(scrollDirection == "down" && scrollNumber != 0) {
				divShown.firstRow = divShown.firstRow + 1;
				divShown.secondRow = divShown.secondRow + 1;
				divShown.thirdRow = divShown.thirdRow + 1;
			} else if(scrollDirection == "up" && scrollNumber != 0) {
				divShown.firstRow = divShown.firstRow - 1;
				divShown.secondRow = divShown.secondRow - 1;
				divShown.thirdRow = divShown.thirdRow - 1;
			}

			this.updateCommentData(aWLComments);
			this.updatePhoneCallData(worklistItems);
			$scrollBody.show();
			aWLComments = null;
			if(!$("#wklBodyFixedGrayTop").length && !$("#wklBodyFixedGrayBottom").length) {
				$fixedBody.prepend(buildGrayOverlay("wklBodyFixedGrayTop"), buildGrayOverlay("wklBodyFixedGrayBottom")).show();
			}

			$("#wklHeaderDiv").find('img').show();//show the spinners

			updateColumnSpinners([
				wklColumns.COL_PRI_CARE_PHY,
				wklColumns.COL_CONDITIONS,
				wklColumns.COL_PAYER_HP_CLASS,
				wklColumns.COL_ADM_DISCH_LAST_24HRS,
				wklColumns.COL_VISITS_TIMEFRAME,
				wklColumns.COL_CASE_MANAGER,
				wklColumns.COL_REGISTRY_IMPORT,
				wklColumns.COL_QUALIFIED_DATE,
				wklColumns.COL_LAST_COMP_ACTION]);

			if (m_controller.getRiskFlag() === 1 || m_controller.getMaraFlag() === 1) {
			    updateColumnSpinners([wklColumns.COL_RISK]);
			}
				setTimeout(function(){
				    $("#loadingMessage").hide();
				},1500);
		}
		if(sortBy) {
			var sortCriteria = m_controller.sortCriteria;
			var imageString = "<span><img src='" + staticContentPath + "/images/6432_11.png'/></span>";
			$('#tableWklDefaultSort').find('td:first-child').empty();
			switch(sortBy) {
				case sortCriteria.SORT_BY_NAME:
					$("#trWklName").find('td:first').html(imageString);
				break;
				case sortCriteria.SORT_BY_RANK:
					$("#trWklRank").find('td:first').html(imageString);
				break;
				case sortCriteria.SORT_BY_QUALIFIED_DATE:
					$("#trWklQualifiedDate").find('td:first').html(imageString);
				break;
				case sortCriteria.SORT_BY_LAST_ACTION:
					$("#trWklLastAction").find('td:first').html(imageString);
				break;
			}
			sortCriteria = null;
		}
		$("#wklBodyDiv").find("a.patientanchors").click(function(event) {
			if(event.shiftKey) {
				event.stopPropagation();
				event.preventDefault();
			}
		});
		adjustHorizontalScrollBar(worklistItems);

		$fixedBody = null;
		$scrollBody = null;
		worklistItems = null;
	};
	function adjustHorizontalScrollBar(worklistItems) {
		var worklistItemsDefensiveCopy = worklistItems || [],
			computedWidth = colDataObj.fixedWidth + colDataObj.shadowWidth + colDataObj.scrollWidth;
		$('#wklOuterDiv').find('.wklHorizScrollerInset')
			.css('width', worklistItemsDefensiveCopy.length > 0 ? computedWidth : 'auto');
	}

	function buildGrayOverlay(id) {
		var width = colDataObj.fixedWidth,
			rightOffset = 4,
			$overlay = $('<div/>')
				.attr('id', id)
				.addClass('wklExpandedPanelOverlay overlayDimmed')
				.css('width', width-rightOffset);
		return $overlay;
	}
	function removeSelectedPtRows() {

		var patientArray = m_controller.getPatientSelectedValue();
		if(patientArray.length <= 50) {
			for(var i = 0, len = patientArray.length; i<len; i++) {
				$("#PtRowId" + patientArray[i]).removeClass("selected").find(".selected").removeClass("selected");
				$("#PtRowFixedId" + patientArray[i]).removeClass("selected").find(".selected").removeClass("selected");
			}
		} else {
			$("#wklBodyScroll").find("div.wklPatientRow.selected").removeClass("selected").end()
								.find("div.wklRowCell.selected").removeClass("selected").end();
			$("#wklBodyFixed").find("div.col1.selected").removeClass("selected").end()
								.find("div.deltaCol.selected").removeClass("selected").end()
								.find("div.wklPatientRowFixed.selected").removeClass("selected").end();
		}
	}
	this.selectSinglePatient = function(id) {
		handlePatientRowSelection({},id);
	};
	function handlePatientRowSelection(event, id) {
		var selectionType = "single";
		var $patientRow = $("#PtRowId" + id);
		var $patientRowFixed = $("#PtRowFixedId" + id);
		var $patientDemog = $("#PtCellId" + id + " .col1");
		var $deltaCell = $("#PtDeltaId" + id + " .deltaCol");
		var poiID = m_controller.getPOI();
		var selectedPatients = [];

		if (event.shiftKey) {// Shift key is down - highlight all rows between the selected index and the clicked row

			lastSelectedId = id;

			selectionType = "shift";

			removeSelectedPtRows();

			selectedPatients = m_controller.getPatientSelectedValue();
			if(firstSelectedId && lastSelectedId && (selectedPatients.length != 0)) {
				selectedPatients = m_controller.returnWorkListItems(firstSelectedId,lastSelectedId,worklistItemsArray);

				for(var ind = 0, wklLength = selectedPatients.length; ind < wklLength; ind++) {
					var wklItem = selectedPatients[ind];
					var $ptRowFixed = $("#PtRowFixedId" + wklItem + "");
					$ptRowFixed.addClass('selected').find('div.worklistContentDiv.col1').addClass('selected');
					var $ptRowFixedDeltaCol = $ptRowFixed.find('div.worklistContentDiv.deltaCol');
					if($ptRowFixedDeltaCol.parent().hasClass("removable") == false) {
						$ptRowFixedDeltaCol.addClass('selected');
					}
					$("#PtRowId" + wklItem + "").addClass('selected').find(".wklRowCell").addClass('selected');

					if(wklItem == lastSelectedId) {
						m_controller.setPOI(lastSelectedId);
					}
					var patObj = m_controller.getPatientById(wklItem);
					m_controller.logPatInfo(patObj, wklItem);
				}
			}


		} else if (event.ctrlKey) {// Ctrl key is down - toggle the clicked row and set selected index, but do not affect other rows
			selectionType = "ctrl";
			$patientRow.toggleClass("selected").children("div.wklRowCell").toggleClass("selected");
			$patientDemog.toggleClass("selected");
			$patientRowFixed.toggleClass("selected");
			if($patientRow.hasClass("selected")){
				m_controller.setPOI(id);
				var patObj = m_controller.getPatientById(id);
				m_controller.logPatInfo(patObj, id);
			}
			else if(id == poiID){
				m_controller.clearPOI();
			}
			if(!$patientRow.hasClass("selected")) {
				m_controller.removeSelectedPatient(id);
			}
			if($deltaCell.parent().hasClass("removable") == false) {
				$deltaCell.toggleClass("selected");
			}
			m_selectedIndex = $patientRow.index();
		} else {// Just a mouse click - remove all other highlighting, toggle the current row and make it the selected index
			selectionType = "single";
			var curSelected = $patientRow.hasClass("selected");
			removeSelectedPtRows();
			if (!curSelected) {
				$patientRow.addClass("selected").children("div.wklRowCell").addClass("selected");
				$patientRowFixed.addClass("selected");
				$patientDemog.addClass("selected");
				if($deltaCell.parent().hasClass("removable") == false) {
					$deltaCell.addClass("selected");
				}
				m_controller.setPOI(id);
				var patObj = m_controller.getPatientById(id);
				m_controller.logPatInfo(patObj, id);
			}
			m_selectedIndex = $patientRow.index();
			firstSelectedId = id;

		}
		var patientsSelected = [];
		if(selectionType == "shift") {
			patientsSelected = selectedPatients.slice(0);
		} else {
			$("#wklBodyFixed div.col1.selected").each(function() {
				patientsSelected.push($(this).data('personid-value'));
			});
		}

		if (patientsSelected.length !== 1) {
			m_controller.clearPOI();
		}

		m_controller.handlePatientRowSelection(patientsSelected,selectionType);
	}
	this.clearRowSelection = function() {
		if(fnIsPopoverActive() === false) {
			removeSelectedPtRows();

			m_controller.handlePatientRowSelection();

			clearWklRightClickMenu();
		}
	};

	this.buildMoreTooltip = function(col, patientId, event){
		var patient = m_controller.getPatientById(patientId);
		var colNum = wklColumns[col];
		var contentBuilder = colDataObj.columns[colNum].contentBuilder;
		var dataSet = colDataObj.columns[colNum].dataSet;
		var html = "<div id='moreTooltip'>";
		if(dataSet == undefined || dataSet === "") {
			html += contentBuilder(patient, true);
		}
		else {
			html += contentBuilder(patient[dataSet], true);
		}
		html += "</div>";
		buildFullTextTooltip(html, event, true /* indicate it is a "more" tooltip */);
	};
	this.createSecondaryPatientColumns = function(patient,addClass) {
		var html = [];
		for (var i = colDataObj.fixedSize, len = colDataObj.columns.length; i < len; i++) {
			if(colDataObj.columns[i].display) {
			var contentBuilder = colDataObj.columns[i].contentBuilder;
			var dataSet = colDataObj.columns[i].dataSet;
			var cellContents;
			if (dataSet == undefined || dataSet === "")
				cellContents = contentBuilder(patient);
			else
				cellContents = contentBuilder(patient[dataSet]);

			var sLoaded = (patient.columnLoadIndicator[colDataObj.columns[i].columnLoadName] == 2 || i == wklColumns.COL_QUALIFIED_DATE) ? "true" : "false";
				html.push("<div key='" + colDataObj.columns[i].key + "' class='wklRowCell wklCol" + i + " " + colDataObj.columns[i].key);
			if(i == len-1) {
				html.push(" rightmost");//rightmost needs special logic to take remaining width. required because scaling down causes cells to get clipped
			}
			if(addClass) {
				html.push(" selected' loaded='" + sLoaded + "'");
			} else {
				html.push("' loaded='" + sLoaded + "'");
			}

			if(i < len-1) {
				html.push("style='width:" + colDataObj.columns[i].width + "px'");
			} else {
				html.push("style='margin-left:" + colDataObj.scrollWidth-colDataObj.columns[i].width + "px'");
			}
			html.push(">");

			if (cellContents.length > 0) {
				html.push(cellContents);
			}
			html.push("</div>");
			}
			contentBuilder = null;
			dataSet = null;
			cellContents = null;
		}
		return html.join("");
	};
	this.getPatientIds = function (startIndex, endIndex) {
		if (startIndex < 0 || endIndex < 0) {
			return [];
		}
		var patientIds = [];
		var orderedLength = orderedPatientIds.length;
		if(endIndex < orderedLength) { //All needed patients are in orderedPatientIds
			patientIds = orderedPatientIds.slice(startIndex, endIndex);
		}
		else if(startIndex >= orderedLength) { //All needed patients are in filteredOutPatientIds
			patientIds = filteredOutPatientIds.slice((startIndex - orderedLength),(endIndex - orderedLength));
		}
		else { //Some needed patients are in orderedPatientIds and some are in filteredOutPatientIds
			patientIds = orderedPatientIds.slice(startIndex);
			patientIds = patientIds.concat(filteredOutPatientIds.slice(0, (endIndex - orderedLength)));
		}

		return patientIds;
	};
	this.getFirstVisiblePatient = function() {
		var firstVisiblePatient = {
			patientId : 0,
			scrollPosition : 0
		};
		if (orderedPatientIds.length <= 0) {
			return firstVisiblePatient;
		}

		var $firstRow = $("#PtRowId" + orderedPatientIds[0]);
		if ($firstRow == undefined) {
			return firstVisiblePatient;
		}

		var rowHeight = $firstRow.height();
		var topRowPosition = $("#wklBodyScroll").position().top;
		if (topRowPosition >= 0)//top row is visible (no scrolling)
		{
			return firstVisiblePatient;
		}

		var likelyRowOnTop = Math.ceil(Math.abs(topRowPosition / rowHeight));
		if (likelyRowOnTop == 0 || likelyRowOnTop > orderedPatientIds.length) {
			return firstVisiblePatient;
		}

		firstVisiblePatientId = orderedPatientIds[likelyRowOnTop];
		var $firstVisibleRow = $("#PtRowId" + firstVisiblePatientId);
		if ($firstVisibleRow == undefined) {
			return firstVisiblePatient;
		}

		firstVisiblePatient.patientId = firstVisiblePatientId;
		firstVisiblePatient.scrollPosition = topRowPosition + $firstVisibleRow.position().top;

		return firstVisiblePatient;
	};

	this.clearList = function() {
		clearWklRightClickMenu();
		clearHeaderRightClickMenu();
		setTimeout(fnRemoveCurrentPopover);
		m_controller.setWorklistMessage(i18n.rwl.NOWORKLIST,false);
		$("#wklHeaderDiv").hide();
		$("#wklBodyScroll").hide().empty();
		$("#wklBodyFixed").hide().find("div.wklPatientRowFixed").remove();
		$("#wklBodyFixedGrayTop").remove();
		$("#wklBodyFixedGrayBottom").remove();
		$("#wklOuterDiv").find("div.wklHorizScroller").removeClass("hidden");
	};
	this.setLoadingState = function(bLoading) {
		var $wklSpinner = $("#wklBodyDiv").find("div.wklSpinner");
		if (bLoading) {
			$("#wklBodyFixed").hide();
			$("#wklBodyScroll").hide();
			$("#wklHeaderDiv").hide();
			$("#NoList").hide();
			$wklSpinner.show();
		} else {
			$wklSpinner.hide();
			$("#wklBodyFixed").show();
			$("#wklBodyScroll").show();
			$("#wklHeaderDiv").show();
		}
	};
	this.buildEntireRow = function(worklistItem, zebraStripeColor, addClass, divClass){
		var builtRow = [];
		var $str;

		if(addClass) {
			$str = $("<div class = 'wklPatientRowFixed " + zebraStripeColor +" selected div" + divClass +"' id= 'PtRowFixedId" + worklistItem.PERSON_ID + "'>");
		} else {
			$str = $("<div class = 'wklPatientRowFixed " + zebraStripeColor + " div" + divClass +"' id= 'PtRowFixedId" + worklistItem.PERSON_ID + "'>");
		}

		builtRow.$fixedCells = $str
			.css("width", colDataObj.fixedWidth)
			.mouseenter(function() {
				var id = $(this).attr("id").replace("PtRowFixedId", "");
				var $ptHoverArea = $(this).find("#PtHoverArea" + id);
				$ptHoverArea.show();
				var $ptShadow = $(this).find("#PtShadow" + id);
				$ptShadow.show();
			})
			.mouseleave(function() {
				var id = $(this).attr("id").replace("PtRowFixedId", "");
				var $ptHoverArea = $(this).find("#PtHoverArea" + id);
				$ptHoverArea.hide();
				var $ptShadow = $(this).find("#PtShadow" + id);
				$ptShadow.hide();
				$ptButton = $(this).find("#PtButton" + id);
				if($ptButton.parent().not('.rowClicked')) {
					$ptButton.not(".close").animate({width: "0px"},0).remove();
				}
		});
		$str = null;
		for (var i = 0, len = colDataObj.fixedSize; i < len; i++) {
			if(colDataObj.columns[i].display) {
				var contentBuilder = colDataObj.columns[i].contentBuilder;
				var id = colDataObj.columns[i].id;
				var $fixedCell = $("<div class='wklRowCell wklCol" + i + "' id='" + id + worklistItem.PERSON_ID + "'>");
				if(i < len-1) {
					$fixedCell.css("width", colDataObj.columns[i].width);
				} else {
					$fixedCell.addClass("rightmost").css("margin-left", colDataObj.fixedWidth-colDataObj.columns[i].width + "px");
				}
				$fixedCell.append(contentBuilder(worklistItem,addClass));
				if(id == "PtCellId") {
					$fixedCell.append(createPatientCellShadow( worklistItem.PERSON_ID ));
				}
				else {
					$fixedCell.mouseenter(function(event) {
						var $outerDiv = $("#wklBodyDiv");
						if($(this).hasClass("removable")) {
							var id = $(this).attr("id").replace("PtDeltaId", "");
							var top = $(this).parent().offset().top - $outerDiv.offset().top;
							var scroll = Math.abs($("#wklBodyScroll").position().top);
							var position = top + scroll + 40;
							var $disqualifying = $("<div id='disqualifyingCritera'>").css("top", position);
							m_controller.getDisqualifyingText(id, $disqualifying);
							var vertOff = 40;		//40 is random offset to shift towards down
							var topPos = event.pageY - $("#divFilterPanelTopBar").height() + vertOff;
							var $disqualifyingCriteria = $("#disqualifyingCritera");
							var toolTipHeight = $disqualifyingCriteria.height();
							var outerHeight = $outerDiv.outerHeight();
							var maxHeight = outerHeight - (outerHeight%5); //to get rid of the cases of having a partial line of text show
							$("#disqualifyContent").css("max-height", maxHeight-30); //to account for the scrollbar at the bottom
							$disqualifyingCriteria.css("max-height", maxHeight-10); //20px difference to allow for the  extra line of text
							if(topPos + toolTipHeight >= outerHeight){
								var positionFromTop = topPos;
								var positionFromBottom =  outerHeight - topPos;
								var currentTopPosition = $disqualifyingCriteria.offset().top;
								if(toolTipHeight > positionFromBottom && toolTipHeight < positionFromTop) {
									$disqualifyingCriteria.css("top", scroll + currentTopPosition - toolTipHeight - 40);
								} else if(toolTipHeight > positionFromBottom && toolTipHeight > positionFromTop) {
									$disqualifyingCriteria.css("top", scroll);
								}
							}
							$disqualifyingCriteria = null;
						}
						$outerDiv = null;
					}).mouseleave(function() {
						$("#disqualifyingCritera").remove();
					});
				}
				$fixedCell.appendTo(builtRow.$fixedCells);

				contentBuilder = null;
				id = null;
				$fixedCell = null;
			}
		}
		if(addClass) {
			builtRow.patientRow = "<div class='wklPatientRow " + zebraStripeColor + " selected scroll" + divClass +"' id='PtRowId" + worklistItem.PERSON_ID + "' style='width:" + colDataObj.scrollWidth + "px'>" +
				this.createSecondaryPatientColumns(worklistItem, addClass) + "</div>";
		} else {
			builtRow.patientRow = "<div class='wklPatientRow " + zebraStripeColor + " scroll" + divClass +"' id='PtRowId" + worklistItem.PERSON_ID + "' style='width:" + colDataObj.scrollWidth + "px'>" +
				this.createSecondaryPatientColumns(worklistItem) + "</div>";
		}
		return builtRow;
	};
	this.refreshExpandView = function(currentId,direction){
		var m_disableScrollButton = "";
		var currentIndex =0;
		for(var y =0, arrLen =orderedPatientIds.length; y < arrLen; y++){
			if(orderedPatientIds[y]==currentId){
				currentIndex = y;
			}
		}
		var nextID = 0;
		if(direction == "up"){
			if(currentIndex != 0){
				nextID = orderedPatientIds[currentIndex-1];
				if(nextID==orderedPatientIds[0]){
					m_disableScrollButton ="patientRowUp";
				}
				else{
					m_disableScrollButton = "";
				}
			}
		} else if(direction == "down"){
			var lastPatientIndex = (orderedPatientIds.length-1);
			if(currentIndex!=lastPatientIndex){
				nextID = orderedPatientIds[currentIndex+1];
				if(nextID==orderedPatientIds[lastPatientIndex]){
					m_disableScrollButton ="patientRowDown";
				}
				else{
					m_disableScrollButton = "";
				}
			}
		} else {
			nextID = orderedPatientIds[currentIndex];
		}
		try {
			var reltnCode = pvFrameworkLinkObj.EstablishRelationship(nextID,0,0);
			if(reltnCode > 0) {
				$("#PtButton" + currentId).remove();
				var $bodyDiv = $("#wklBodyDiv");
				$bodyDiv.toggleClass("expandViewShown",true);
				var $hoverArea = $("#PtHoverArea" + nextID);
				var $nextPtButton = patientCellButton(nextID);
				$nextPtButton.animate({width: "26px"},0);
				$hoverArea.parent().append($nextPtButton);
				patientCellButtonClick($nextPtButton,nextID);
			}else{return;}
		} catch (err) {
			var errorMessage = i18n.rwl.ERRORCODE.replace("{0}",JSON.stringify(err));
			alert(errorMessage);
			m_controller.logErrorMessages("",errorMessage,"refreshExpandView");
		}
	};
	function createPatientCellShadow(personId) {
		return $("<div class = 'wklPtCellHoverArea' id = 'PtHoverArea" + personId + "'>")
				.mouseenter(function() {
					var $ptButton = patientCellButton(personId);
					$(this).parent().append($ptButton);
					$ptButton.animate({width: "26px"},0);
				})
				.append($("<div class = 'wklPtCellShadow wklShadowOverlayDimmed' id='PtShadow" + personId + "'>"));
	}
	function patientCellButton(personId){
		var $hoverArea = $("#PtHoverArea" + personId);
		var $ptButton = $("<div class = 'wklPtCellButton' id = 'PtButton" + personId + "'>")
		.mouseleave(function() {
			if($(this).parent().not(".rowClicked")) {
				$(this).not(".close").animate({width: "0px"},0, function(){$(this).remove();});
			}
			$("#PtShadow" + personId).hide();
		})
		.click(function(){
			patientCellButtonClick($ptButton,personId);
		});
		return $ptButton;
	}
	function patientCellButtonClick($button,personId){
		$button.closest('.wklRowCell').addClass('rowClicked');
		if($button.hasClass('close')) {
			expandView(false);
			$button.removeClass('close').closest('.wklRowCell').removeClass('rowClicked');	//Remove ptButton if expanding the filtershell again
			m_controller.clearSpecificMessages(".summary");
			m_controller.clearPOI();
		} else {
			$button.addClass('close');
			try {
				var reltnCode = pvFrameworkLinkObj.EstablishRelationship(personId,0,0);
				if(reltnCode > 0) {
					m_controller.setPOI(personId);
					expandView(true,personId,reltnCode);
					m_controller.audit("Dynamic Worklist","Open Expanded View");
					$("#ptPhoneHover").remove();
				} else {
					$button.removeClass('close');      //Remove ptButton if no relationship found
				}
			} catch (err) {
				$button.removeClass('close');          //Remove ptButton if something went wrong with the Assign Relationship Dialog
				var errorMessage = i18n.rwl.ERRORCODE.replace("{0}",JSON.stringify(err));
				alert(errorMessage);
				m_controller.logErrorMessages("",errorMessage,"patientCellButtonClick");
			}
			$button.closest('.wklRowCell').removeClass('rowClicked');
		}
	}
	function repositionView(id){
		var $bodyDiv = $("#wklBodyDiv");
		var scrollHeight = $bodyDiv.height();
		if(scrollHeight <= 0) {
			return;
		}

		var $wklBodyScroll = $("#wklBodyScroll");
		var topRowPosition = $wklBodyScroll.position().top;
		var scrollPosition = Math.floor(Math.abs(topRowPosition/100));
		var percentageScrolled = ($bodyDiv.scrollTop()/$wklBodyScroll.height())*100;
		var scrollOffset = Math.abs(topRowPosition);
		var numberOfPtsVisible = Math.ceil((scrollHeight + scrollOffset % 100) / 100);
		var indexOfPatientOnTop = Math.floor(scrollOffset / 100);
		var indexOfMiddlePatient =  indexOfPatientOnTop +((Math.round(numberOfPtsVisible/2))-1);
		indexOfMiddlePatient = (listDisplayLength/3) * (divShown.firstRow - 1) + indexOfMiddlePatient;
		var middleCellId = orderedPatientIds[indexOfMiddlePatient];
		var $middleCellObj = $("#PtRowFixedId"+middleCellId);

		var beginList = orderedPatientIds.slice(0,((Math.round(numberOfPtsVisible/2))-1));
		var endList = orderedPatientIds.slice((orderedPatientIds.length-Math.round(numberOfPtsVisible/2)),orderedPatientIds.length);
		var beginEndCell = false;

		for(var b =0,blen = beginList.length;b < blen; b++){
			if(id==beginList[b]){
				beginEndCell = true;
				break;
			}
		}
		for(var e =0,elen = endList.length;e < elen; e++){
			if(id==endList[e]){
				beginEndCell = true;
				break;
			}
		}
		if(middleCellId != id && !beginEndCell){
			var middleRowPosition = Math.abs($middleCellObj.position().top);
			var $newVisibleRow = $("#PtRowId" + id);
			var currentRowPosition = $newVisibleRow.position().top;
			var scrollAmount = middleRowPosition - currentRowPosition;
			var currentScrollPosition = $bodyDiv.scrollTop();
			var newScrollPosition = currentScrollPosition - scrollAmount;
			scrollByExpandView.push(id);
			$bodyDiv.scrollTop(newScrollPosition);
		}
	}

	this.addPatientsOnNext = function(personId,scrollDirection) {
		var $bodyDiv = $("#wklBodyDiv");
		var $clickedPatientCell = $("#PtRowId" + personId);
		var top = $clickedPatientCell.offset().top - $bodyDiv.offset().top;
		var scroll = Math.abs($("#wklBodyScroll").position().top);
		var height = top + scroll;
		var sortCriteria = m_controller.getSortCriteria();
		var worklistItems = worklistItemsArray;

		if(($("#wklBodyScroll").height() - height) < 500 && scrollDirection == "down") {
			var orderedPatientIdsLength = orderedPatientIds.length;
			if(lastPatientRowID != orderedPatientIds[orderedPatientIdsLength - 1]) {
				this.showPatientList(worklistItems,sortCriteria,(listDisplayLength/3),"",scrollDirection,"expand");
			}
		} else if(height < 500 && scrollDirection == "up") {
			if(divShown.firstRow != 1 && divShown.secondRow != 2 && divShown.thirdRow != 3) {
				this.showPatientList(worklistItems,sortCriteria,(listDisplayLength/3),"",scrollDirection,"expand");
			}
		}
	};

	this.getExpandViewPatientId = function(){
		return m_expandViewPtId;
	};
    this.expandViewWrapper = function(show, person, reltn) {
        expandView(show, person, reltn);
    };
	function expandView(bShow,personId,reltnCode) {
		var m_disableScrollButton = '',
			$bodyDiv = $('#wklBodyDiv'),
			$clickedPatientCell = $bodyDiv.find('div.wklRowCell.wklCol1.rowClicked'),
			$button = $clickedPatientCell.find('div.wklPtCellButton'),
			filterShellWidth = 15,
			viewHtml = null,
			viewWidth = bShow ? ($(window).width() - ($('#wklBodyFixed').width() + filterShellWidth)) : 0;
		if(bShow){
			$("#fuzzySearchInput").attr("disabled","disabled"); // Disable Fuzzy Search
			m_controller.createCheckpoint("USR:DWL-ACCESS.EXPANDED.VIEW", "Start");
			m_expandView = new ACM_Expanded_View(m_controller,personId,reltnCode);
			viewHtml= m_expandView.buildWklExpandedView();
			m_expandViewPtId = personId;
		}
		else{
			$("#fuzzySearchInput").removeAttr("disabled"); // Enable Fuzzy Search
			m_expandViewPtId = 0.0;
		}

		if (viewHtml !== null) {
			$("#wklExpandedView").html(viewHtml);
		}
		
		$("#wklExpandedView")
            .toggle(bShow)			
			.animate({width:viewWidth},1,function(){
				$("#filterTab").toggleClass("expandViewShown",bShow).trigger("updateFilterState");
				$bodyDiv.add($button).toggleClass("expandViewShown",bShow);
			});

		m_controller.disableOnExpandView(bShow);
		if(!bShow){
			$("#wklBodyFixedGrayTop").add("#wklBodyFixedGrayBottom").hide();
			$("#wklOuterDiv").find("div.wklHorizScroller").removeClass("hidden");
			return;
		}
		if(orderedPatientIds.length == 1) {
			m_disableScrollButton = "both";
		}else if(personId == orderedPatientIds[0]){
			m_disableScrollButton = "patientRowUp";
		}else if(personId == orderedPatientIds[orderedPatientIds.length-1]){
			m_disableScrollButton = "patientRowDown";
		}else{
			m_disableScrollButton ="";
		}
		if(m_disableScrollButton!="" && m_disableScrollButton!="both"){
			m_controller.disableExpandViewButton(m_expandView,m_disableScrollButton);
		} else if(m_disableScrollButton == "both") {
			m_controller.disableExpandViewButton(m_expandView,"patientRowUp");
			m_controller.disableExpandViewButton(m_expandView,"patientRowDown");
		}
		$("#wklOuterDiv").find("div.wklHorizScroller").addClass("hidden");
		var $bodyDiv = $("#wklBodyDiv");
		var top = $clickedPatientCell.offset().top - $bodyDiv.offset().top;
		var scroll = Math.abs($("#wklBodyScroll").position().top);
		var height = top + scroll;
		if(height != 0) {
			$("#wklBodyFixedGrayTop").css("height", height-4).show();
		}else{
			$("#wklBodyFixedGrayTop").hide();
		}
		$("#wklBodyFixedGrayBottom").css("top", (height + 100)).show();
		repositionView(personId);

		m_controller.createCheckpoint("USR:DWL-ACCESS.EXPANDED.VIEW", "Stop", [{key: "List ID", value: m_controller.getActivePatientListID()},{key: "Person ID", value: personId}]);
	}
    this.adjustGrayCovering = function() {
        var $body = $("div.wklBodyDiv");
        var $button = $("#wklBodyFixed").find(".close");
        if ($body.length > 0 && $button.length > 0) {
            var top = $button.offset().top - $body.offset().top;
            var scroll = Math.abs($("#wklBodyScroll").position().top);
            var height = top + scroll;
            $("#wklBodyFixedGrayTop").css("height", height);
            $("#wklBodyFixedGrayBottom").css("top", (height + 100));
        }
    };
	this.rightClickMenuOperations = function(e,patientRemoveStatus,m_patientsSelected) {
			var $outerDiv = $("#wklOuterDiv");
			var $wklRcWindowRmvPatTab = $("#wklRightClickWindowRmvPatId");

			var filterShellWidth;
			if($("#filterTab").hasClass("collapsed")) {
				filterShellWidth = 20;						//Filter Tab Closed
			} else {
				filterShellWidth = 360;						//Filter Tab Open
			}
			var leftpos = e.pageX - filterShellWidth;		// DECIDE THE POSITION ON THE BASIS OF FILTER TAB WIDTH

			$outerDiv.bind("contextmenu", function(e) {		// DISABLE THE DEFAULT RIGHT CLICK MENU
				return false;
			});
			clearWklRightClickMenu();

			if(patientRemoveStatus) {
				$wklRcWindowRmvPatTab.show();
			} else {
				$wklRcWindowRmvPatTab.hide();
			}
            if($outerDiv.width() - leftpos <= m_staticPositionValues.wlkRightClickWindowWidth) {
				leftpos = leftpos - m_staticPositionValues.wlkRightClickWindowWidth;
			}
			var toppos = e.pageY - $("#divFilterPanelTopBar").height();

			var $errDisplay = $("#wklMessageBanner");
			if(!($errDisplay.is(":hidden"))) {
				var messageDivHeight = $errDisplay.outerHeight();
				toppos = toppos - messageDivHeight;
			}
			if($outerDiv.height() - toppos <= m_staticPositionValues.wklRightClickWindowHeight) {
				toppos = toppos - (m_staticPositionValues.wklRightClickWindowHeight/2);
			}

			$("#spanRightClickRankFont").text(i18n.rwl.RANK);
			$("#spanRightClickRemoveFont").text(i18n.rwl.REMOVEPATIENT);
			if(m_patientsSelected.length > 1) {

				$("#spanRightClickRankFont").text(i18n.rwl.RANKMULTIPLEPATIENTS.replace("{25}",m_patientsSelected.length));
				$("#spanRightClickRemoveFont").text(i18n.rwl.REMOVEMULTIPLEPATIENTS.replace("{24}",m_patientsSelected.length));
			}

			$("#wklRightClickWindowId").css("top",toppos).css("left",leftpos).show();

			var $wklRightClickRankOptions = $("#wklRightClickRankOptionsId");
			$wklRightClickRankOptions.hide();

			var lpos = $("#wklRightClickWindowId").position().left + m_staticPositionValues.wlkRightClickWindowWidth;
			var tpos = $("#wklRightClickWindowId").position().top;

			if($outerDiv.width() - lpos <= m_staticPositionValues.wklRankOptionsWindowWidth) {
				lpos = lpos - (m_staticPositionValues.wlkRightClickWindowWidth + m_staticPositionValues.wklRankOptionsWindowWidth);
			}
			if($outerDiv.height() - toppos <= m_staticPositionValues.wklRankOptionsWindowHeight) {
				tpos = tpos - (m_staticPositionValues.wklRankOptionsWindowHeight - m_staticPositionValues.wklRightClickWindowHeight/2);
			}
			$wklRightClickRankOptions.css("top",tpos).css("left",lpos);
	};
	function clearWklRightClickMenu() {
		$("#wklRightClickWindowId").hide();			// CLEARS OUT THE RIGHT CLICK MENU
		$("#wklRightClickRankOptionsId").hide();	// CLEARS OUT THE RANK MENU
	}

	function clearHeaderRightClickMenu() {
		$("#wklHeaderSubMenuId").hide();
		$("#wklHeaderDropId").hide();
	}
	function changePatientRowRank(targetId) {
		var rankValue = targetId.charAt(targetId.length - 1);
		var selectedPatients = m_controller.getPatientSelectedValue();
		for(var i = 0; i < selectedPatients.length; i++) {
			var patientRowDivId = "div.rankContainer.subDiv#" + selectedPatients[i];
			updateDots($(patientRowDivId), rankValue);
		}
		m_controller.setSinglePatientRank(rankValue,selectedPatients);
		clearWklRightClickMenu();
	}
	function createPatientCell(person,addClass) {
		var personId = person.PERSON_ID;
		var iEncntrId = 0;
		var html = [];
		var width = colDataObj.columns[wklColumns["COL_PATIENT"]].width - 30;

		if(addClass) {
			html.push("<div class='worklistContentDiv col1 selected' data-personid-value=" + personId + ">");
		} else {
			html.push("<div class='worklistContentDiv col1' data-personid-value=" + personId + ">");
		}

		var params = '/PERSONID=' + personId + ' /ENCNTRID=" + tempEncntrId + "';
		html.push('<div class="ptCommentInd ptPhone"></div>');

		html.push("<div style='width:" + width + "px' class='patientName ellipsis'><span>");
		html.push("<a href='javascript:m_controller.setPOI(" + personId + ");var tempEncntrId=m_controller.getEncounterId(" + personId + ");APPLINK(0, \"powerchart.exe\", \"" + params + "\");' class='patientanchors'>" + person.NAME_FULL_FORMATTED + "</a>");
		html.push("</span></div><div class='ptCommentInd'></div>");

		var age = "";
		var birth_date = "";
		var dobDisp = "--";
		var sexDisp = "--";
		var mrnDisp = "--";
		var rank = person.RANK;
		var bUTCDate = true;
		if (person.BIRTH_DT_TM != null) {
			var birthDate = person.BIRTH_DT_TM;
			birth_date = birthDate.format(i18n.rwl_lc.fulldate4yr, bUTCDate);
			if (person.DECEASED_DT_TM && person.DECEASED_DT_TM != '') {
				age = MP_Util.CalcAge(birthDate, person.DECEASED_DT_TM);
			} else {
				age = MP_Util.CalcAge(birthDate);
			}
			dobDisp = birth_date + " (" + age + ")";
		}
		if ($.trim(person.SEX_DISP)) {
			sexDisp = $.trim(person.SEX_DISP);
		}
		if ($.trim(person.MRN)) {
			mrnDisp = $.trim(person.MRN);
		}
		html.push("<div style='width:" + width + "px' class='age subDiv ellipsis'><span class='typeSpan'>" + i18n.rwl.DOB + "</span><span class='dataSpan'>&nbsp;",dobDisp,"</span></div>");
		html.push("<div class='ptCommentInd todo'></div>");
		html.push("<div class = 'patientInfo'>");
		html.push("<div style='width:" + width + "px' class='subDiv ellipsis'><span class='typeSpan'>" + i18n.rwl.SEXTEXT + "</span><span class='dataSpan'>&nbsp;&nbsp;",sexDisp,"</span></div>");
		html.push("<div style='width:" + width + "px' class='subDiv ellipsis'><span class='typeSpan'>" + i18n.rwl.MRN + "</span><span class='dataSpan'>  ",mrnDisp,"</span></div>");
		html.push("</div>");
		html.push("<div class = 'rating'>");
		html.push("<div class='rankContainer subDiv' data-rank-value='" + rank + "' id='" + personId + "'>");
		var sClass = "rank blank";
		for(var i=0; i<=5; i++) // 5 point rating plus blank reset target on left
		{
			html.push("<div class='" + sClass + "' data-rank-value='" + i +"'></div>");
			sClass = (i<rank) ? "rank on" : "rank";
		}
		html.push("</div>");
		html.push("</div>");
		html.push("</div>");

		var $newCell = $(html.join(""));
		var hoverTimeout;
		$newCell.find("div.ptCommentInd")
			.mouseenter(function(event){
				if($(this).hasClass("ptPhone")) {
					var patientID = $(this).parents(".worklistContentDiv").data('personid-value');
					showPhoneHover(patientID, event);
					return;
				}

				var commAr = $(this).data("commAr");
				if(!commAr || commAr.length<=0){
					return;
				}
				var $outerDiv = $("#wklOuterDiv");

				var dateLoc = new Date();
				dateLoc.setTime(commAr[0].date.getTime());
				var dateString = DWL_Utils.fnGetDateString(dateLoc, m_bUTCOn);
				var title = commAr[0].prsnl_name + " (" + dateString.replace("{2}", i18n.discernabu.MONTHNAMES[dateLoc.getMonth()]) + ")";
				var strNoteType = " " + ($(this).hasClass("todo") ? i18n.rwl.TODOSINCOMP : i18n.rwl.COMMENTS);

				hoverTimeout = setTimeout(function(){
					var commentSeq = i18n.rwl.COMMENTSEQ.replace("{42}",commAr.length);
					$("<div class='ptCommentHover'>").appendTo($outerDiv)
						.html("<span class='commTitle'>" + title + "</span>" +
								"<span>" + commAr[0].text + "</span>" +
								"<span class='commSeq'>" + commentSeq + strNoteType + "</span>")
						.css({top:event.pageY - $outerDiv.offset().top,
								left:event.pageX - $outerDiv.offset().left + 15})
						.show();
				},250);
			})
			.mouseleave(function(){
				if($(this).hasClass("ptPhone")) {
					$("#ptPhoneHover").remove();
					return;
				}
				clearTimeout(hoverTimeout);
				$("#wklOuterDiv").find("div.ptCommentHover").remove();
			});
		return $newCell;
	}

	function showPhoneHover(patientID, event) {
		var patient = m_controller.getPatientById(patientID);

		var home_phone = patient.HOME_PHONE || "";
		var home_ext = patient.HOME_EXT || "";
		var mobile_phone = patient.MOBILE_PHONE || "";
		var mobile_ext = patient.MOBILE_EXT || "";
		var work_phone = patient.WORK_PHONE || "";
		var work_ext = patient.WORK_EXT || "";

		var html = "<div id='ptPhoneNums'>";

		if(home_phone.length == 0 && mobile_phone.length == 0 && work_phone.length == 0) {
			html += "<div class='ptPhoneNum'><span class='phoneNum'>" + i18n.rwl.NOPHONEFOUND + "</span></div>";
		}
		else {
			if(home_phone.length > 0) {
				if(home_ext.length > 0) {
					home_ext = " .ext " + home_ext;
				}
				html += "<div class='ptPhoneNum'><span class='phoneDispText'>" + i18n.rwl.HOMEPHONE + "</span><span class='phoneNum'>&nbsp;" + home_phone + home_ext + "</span></div>";
			}
			if(mobile_phone.length > 0) {
				if(mobile_ext.length > 0) {
					mobile_ext = " .ext " + mobile_ext;
				}
				html += "<div class='ptPhoneNum'><span class='phoneDispText'>" + i18n.rwl.MOBILEPHONE + "</span><span class='phoneNum'>&nbsp;" + mobile_phone + mobile_ext + "</span></div>";
			}
			if(work_phone.length > 0) {
				if(work_ext.length > 0) {
					work_ext = " .ext " + work_ext;
				}
				html += "<div class='ptPhoneNum'><span class='phoneDispText'>" + i18n.rwl.WORKPHONE + "</span><span class='phoneNum'>&nbsp;" + work_phone + work_ext + "</span></div>";
			}
		}
		html += "</div>";

		var $outerDiv = $("#wklOuterDiv");
		$("<div id='ptPhoneHover' class='ptCommentHover'>").appendTo($outerDiv)
			.html(html)
			.css({top:event.pageY - $outerDiv.offset().top,
					left:event.pageX - $outerDiv.offset().left + 15})
			.show();
	}
	var updateColumnSpinners = function(columnsToCheck) {
		var scrollHeight = $("#wklBodyDiv").height();
		if(scrollHeight <= 0) {
			return;
		}

		var scrollOffset = Math.abs($("#wklBodyScroll").position().top);
		var numberOfPtsVisible = Math.ceil((scrollHeight + scrollOffset % 100) / 100);
		var indexOfPatientOnTop = Math.floor(scrollOffset / 100);
		var isAllVisibleInColumnLoaded = [];
		for (var i = 0; i < columnsToCheck.length; i++) {
			isAllVisibleInColumnLoaded.push(true);
		}

		for (var ptIdx = indexOfPatientOnTop, ptSz = orderedPatientIds.length; ptIdx < ptSz && ptIdx - indexOfPatientOnTop < numberOfPtsVisible; ptIdx++) {
			var $patientRow = $("#PtRowId" + orderedPatientIds[ptIdx]);
			if ($patientRow.length == 1) {
				for (var j = 0, jSz = columnsToCheck.length; j < jSz; j++) {
					var attrLoaded = $patientRow.children(".wklCol" + columnsToCheck[j]).attr("loaded");
					if (attrLoaded == "false") {
						isAllVisibleInColumnLoaded[j] = false;
					}
				}
			}
		}

		var $columnHeaders = $("#wklHeaderDiv").find("div.wklHeaderCell");
		for (var k = 0, kSz = columnsToCheck.length; k < kSz; k++) {
			$columnHeaders.eq(columnsToCheck[k]).children("img").not(".columnLoadingFailed").toggle(isAllVisibleInColumnLoaded[k]==false);
		}
	};
	this.columnLoadingFailed = function(patientsList,columnsFailedKey) {
		var columnsFailed = [];
		switch(columnsFailedKey) {
			case "conditions":
				columnsFailed = [wklColumns.COL_CONDITIONS, wklColumns.COL_REGISTRY_IMPORT];
			break;
			case "providerreltns":
				columnsFailed = [wklColumns.COL_PRI_CARE_PHY, wklColumns.COL_CASE_MANAGER];
			break;
			case "encounters":
				columnsFailed = [wklColumns.COL_ADM_DISCH_LAST_24HRS, wklColumns.COL_VISITS_TIMEFRAME];
			break;
			case "healthplans":
				columnsFailed = [wklColumns.COL_PAYER_HP_CLASS];
			break;
			case "comments":
				columnsFailed = [wklColumns.COL_LAST_COMP_ACTION];
			break;
		}

		var columnSuccessfullyLoaded = [];
		for (var i = 0; i < columnsFailed.length; i++) {
			columnSuccessfullyLoaded.push(true);
		}

		for (var ptIdx = 0, ptSz = patientsList.length; ptIdx < ptSz; ptIdx++) {
			var $patientRow = $("#PtRowId" + patientsList[ptIdx].person_id);
			if ($patientRow.length == 1) {
				for (var j = 0, jSz = columnsFailed.length; j < jSz; j++) {
					if ($patientRow.children(".wklCol" + columnsFailed[j]).attr("loaded") == "false") {
						$patientRow.children(".wklCol" + columnsFailed[j]).attr("loaded","failed");
						columnSuccessfullyLoaded[j] = false;
					}
				}
			}
		}

		for (var k = 0, kSz = columnsFailed.length; k < kSz; k++) {
			var $columnHeader = $("#wklHeaderDiv .wklHeaderCell").eq(columnsFailed[k]);
			if (columnSuccessfullyLoaded[k] == true) {
				$columnHeader.children("img").hide();
			} else {
				$columnHeader.children("img")
					.attr("src",staticContentPath + "/images/6275_16.png")
					.addClass("columnLoadingFailed")
					.mouseover(function(event) {
						columnLoadFailedTooltip(event);
					})
					.mouseout(function(event) {
						$("#columnLoadErrorToolTip").remove();
					})
					.show();
			}
		}
	};

	function columnLoadFailedTooltip(event) {
		var $outerDiv = $("#wklOuterDiv");
		var toolTipWidth = 150;
		var leftPos = event.pageX - $("#filterShell").width() + 10;				//10 is random offset to shift towards right
		if($outerDiv.width() - leftPos <= toolTipWidth) {
			leftPos = leftPos - toolTipWidth;
		}
		var topPos = event.pageY - $("#divFilterPanelTopBar").height() + 10;	//10 is random offset to shift towards down
		var fullTextTooltip = "<div id = 'columnLoadErrorToolTip' class='errorToolTips' style='top:" + topPos + ";left:" + leftPos + "'>" + i18n.rwl.NOCOLUMNDATA + "</div>";
		$outerDiv.append(fullTextTooltip);
	}
	this.updateRiskData = function(patients) {
		for (var i = 0, len = patients.length; i < len; i++) {
			var riskHtml = buildRiskCell(patients[i]);
			var $patientRow = $("#PtRowId" + patients[i].PERSON_ID);
			var $riskCell = $patientRow.children(".wklCol" + wklColumns.COL_RISK);
			$riskCell.attr('loaded', 'true');
			if (riskHtml.length > 0) {
				$riskCell.html(riskHtml);
			}
		}
		updateColumnSpinners([wklColumns.COL_RISK]);
	};
	this.updatePhoneCallData = function(patients) {
		var $phoneIcon = null;
		var iPendingLen = -1;
		for(var i = 0, len = patients.length; i < len; i++) {
			if($.isArray(patients[i].aPendingCalls) === false) {
				continue;
			}
			iPendingLen = patients[i].aPendingCalls.length;
			$phoneIcon = $('#PtRowFixedId' + patients[i].PERSON_ID);
			if(iPendingLen > 0) {
				$phoneIcon.find('.ptPhone')
					.removeClass('ptPhone')
					.addClass('ptPendingPhone')
					.on('click', displayPhonePopover);
			}
			else {
				$phoneIcon.find('.ptPendingPhone')
					.removeClass('ptPendingPhone')
					.addClass('ptPhone')
					.off('click');
			}
		}
		$phoneIcon = null;
	};
	function fnHasEnoughSpaceBelow(iAvailableSpace, iRequiredSpace) {
	 return iAvailableSpace >= iRequiredSpace;
	}
	function fnHasEnoughSpaceAbove(iAvailableSpace, iRequiredSpace) {
	 return iAvailableSpace >= iRequiredSpace;
	}
	function fnHasEnoughSpaceBelowAfterResize(iAvailableSpace, iRequiredSpace) {
	 return iAvailableSpace >= iRequiredSpace;
	}
	function displayPhonePopover(event) {
		if (fnIsPopoverActive() === true) {
			return false;
		}
		var $target = $(event.target);
		var $parentRow = $target.parents('.wklPatientRowFixed');
		var $outerDiv = $('#wklOuterDiv');
		var iId = parseInt($parentRow.attr('id').replace('PtRowFixedId', ''), 10);
		var sDisplayPosition = 'down';
		var iYCord = $target.offset().top + $target.outerHeight();
		var iXCord = $target.offset().left + $target.outerWidth();
		var iMaxPopoverHeight = 375;
		var iPopOverHeightReduction = 144;
		var iOuterDivOuterHeight = $outerDiv.outerHeight();
		var bShowFullSize = true;

		if(fnHasEnoughSpaceBelow(iOuterDivOuterHeight, iYCord + iMaxPopoverHeight) === false) {

			if(fnHasEnoughSpaceAbove(iYCord, iMaxPopoverHeight) === true) {
				sDisplayPosition = 'up';

			} else if(fnHasEnoughSpaceBelowAfterResize( iOuterDivOuterHeight, iYCord + (iMaxPopoverHeight - iPopOverHeightReduction)) === true) {
				sDisplayPosition = 'down';
				bShowFullSize = false;

			} else { // Won't have enough space after reducing size so keep it above the patient name
				sDisplayPosition = 'up';
				bShowFullSize = false;
			}
		}

		var oProps = {
			oPopover: {
				sId: 'patientPendingCallPopover',
				iXCord: iXCord,
				iYCord: iYCord,
				sDisplayPosition: sDisplayPosition,
				iPatientId: iId,
				bShowFull: bShowFullSize
			},
			oOverlay: {
				sId: 'patientPendingCallPopoverOverlay',
				sClasses: 'patientPendingCallPopoverOverlay'
			}
		};
		oCurrentPopover = new DWL_Utils.Component.OverlayingPopover(oProps);
		oCurrentPopover
			.fnRender()
			.fnOnRemoval(fnRemoveCurrentPopover);

		$target = null;
		$parentRow = null;
		$outerDiv = null;
	}
	function fnRemoveCurrentPopover() {
		if(oCurrentPopover !== null) {
			oCurrentPopover.fnRemove();
			oCurrentPopover = null;
		}
	}
	function fnIsPopoverActive() {
		return DWL_Utils.isNullOrUndefined(oCurrentPopover) === false;
	}
	this.updateCommentData = function(patients) {
		for (var i=0,len=patients.length; i<len; i++) {
			var comments = patients[i].COMMENTS || [];
			var commAr = [];
			for(var j=0,jLen=comments.length; j<jLen; j++){
				commAr.push({
					id: comments[j].COMMENT_ID,
					text: comments[j].COMMENT_TEXT,
					type: comments[j].COMMENT_TYPE,
					date: convertSQLDateStringToJS(comments[j].UPDT_DT_TM),
					prsnl_id: comments[j].UPDT_ID,
					prsnl_name: $.trim(comments[j].UPDT_NAME)
				});
			}
			m_worklistObj.updateCommentInd(patients[i].PERSON_ID,commAr);

			var lastCompActionHTML = buildLastCompActionCell(commAr);
			var $lastCompActionCell = $("#PtRowId" + patients[i].PERSON_ID).children(".wklCol" + wklColumns.COL_LAST_COMP_ACTION);
			$lastCompActionCell.attr('loaded', 'true');
			if (lastCompActionHTML.length > 0) {
				$lastCompActionCell.html(lastCompActionHTML);
			}
		}
		updateColumnSpinners([wklColumns.COL_LAST_COMP_ACTION]);
	};
	this.updateLastCompActionCell = function(personId, eventAction){
		var $lastCompActionCell = $("#PtRowId" + personId).children(".wklCol" + wklColumns.COL_LAST_COMP_ACTION),
			lastCompActionHTML = buildLastCompActionCell(eventAction, false);

		if(lastCompActionHTML.length > 0){
			$lastCompActionCell.html(lastCompActionHTML);		//puts generated HTML into the appropriate cell

		}
		updateColumnSpinners([wklColumns.COL_LAST_COMP_ACTION]);
	};
	this.updateCommentInd = function(personId,data) {
		var $commInd = $('#PtRowFixedId' + personId).find('div.ptCommentInd').not('.ptPhone, .ptPendingPhone');
		var aComm = [],
			aTodo = [];
		for(var i=0,len=data.length;i<len;i++){
			if(data[i] !== undefined && data[i] !== null &&
				data[i].type !== undefined && data.type !== null) {
				if(data[i].type == 1) {
					aTodo.push(data[i]);
				} else if(data[i].type != 2){
					aComm.push(data[i]);
				}
			}
		}
		$commInd.not(".todo").css("visibility",aComm.length ? "visible" : "hidden").data("commAr",aComm);
		$commInd.filter(".todo").css("visibility",aTodo.length ? "visible" : "hidden").data("commAr",aTodo);
	};
	this.getCommentsById = function(personId){
		var aData = [];
		$('#PtRowFixedId' + personId).find('div.ptCommentInd').not('.ptPhone, .ptPendingPhone').each(function(){
			aData = aData.concat($(this).data("commAr"));
		});
		return aData;
	};

	this.getCurrentColData = function() {
		return $.extend(true,{},colDataObj);
	};
	this.getColDefaults = function() {
		return $.extend(true,{},colDataObjDefault);
	};
	this.setCurrentColData = function(newColDataObj) {
		colDataObj = (newColDataObj && newColDataObj.columns) ? newColDataObj : $.extend(true, [], colDataObjDefault);
		var columns = colDataObj.columns;
		var numVisible = 0;
		for(var c = 0, clen = columns.length; c < clen; c++) {
			wklColumns[columns[c].key] = c;
			if(columns[c].display) {
				numVisible++;
			}
		}
		colDataObj.numVisible = numVisible;
	};
	this.updateRelationshipData = function(patients) {
		for (var i = 0; i < patients.length; i++) {
			var pcpHtml = buildPCPCell(patients[i].PPRS);
			var caseManagerHtml = buildCaseManagerCell(patients[i].PPRS);
			$patientRow = $("#PtRowId" + patients[i].PERSON_ID);

			var $pcpCell = $patientRow.children(".wklCol" + wklColumns.COL_PRI_CARE_PHY);
			$pcpCell.attr('loaded', 'true');
			if (pcpHtml.length > 0) {
				$pcpCell.html(pcpHtml);
			}
			var $caseManagerCell = $patientRow.children(".wklCol" + wklColumns.COL_CASE_MANAGER);
			$caseManagerCell.attr('loaded', 'true');
			if (caseManagerHtml.length > 0) {
				$caseManagerCell.html(caseManagerHtml);
			}
		}
		updateColumnSpinners([wklColumns.COL_PRI_CARE_PHY, wklColumns.COL_CASE_MANAGER]);
	};
	function buildPCPCell(relationshipList, showAll) {
		if (relationshipList == undefined || relationshipList.length == 0) {
			return "";
		}
		relationshipList = alphaSort(relationshipList, "PRSNL_NAME");
		var displayAr = [];
		for (var pprx = 0, pprcnt = relationshipList.length; pprx < pprcnt; pprx++) {
			var relationship = relationshipList[pprx];
			if (relationship.RELTN_GROUP & 1) {
				displayAr.push(relationship.PRSNL_NAME);
			}
		}

		if (displayAr.length <= 0) {
			return "";
		}

		var html = [];
		html.push("<div class='worklistContentDiv'>");
		html.push(formContentTable(displayAr, "COL_PRI_CARE_PHY", showAll));
		html.push("</div>");
		return html.join("");
	}
	function buildRiskCellRow(sDivClasses, iDivWidth, sSpanClasses, sSpanContent) {
		return '<tr>' +
		        '<td>' +
		         '<div class="' + sDivClasses + '" style="width:' + iDivWidth + 'px">' +
		          '<span class="' + sSpanClasses + '">' + sSpanContent + '</span>' +
		         '</div>' +
		        '</td>' +
		       '</tr>';
 }

	function buildRiskCell(person) {
		var html = [];
		html.push("<div class='worklistContentDiv'>");
		var divWidth = colDataObj.columns[wklColumns.COL_RISK].width - 15; //15 so the text isn't on the edge of the cell before it shows ellipsis
		var stratification = person.RISK_VALUE || -1;
		var riskClass = person.RISK_TEXT || "";
		var dMaraScore = person.MARA_SCORE || -1.0;
		var iMaraBedrockPref = m_controller.getMaraFlag();

		if(riskClass.length > 0 && stratification > -1) {
			html.push('<table class="worklistContentTable">' +
				buildRiskCellRow('ellipsis', divWidth, 'riskHeader', i18n.rwl.READMISSIONRISK) +
				buildRiskCellRow('ellipsis bottomSpace', divWidth, '', riskClass + ' (' + stratification + '%)') +
					'</table>');
		}

		if(iMaraBedrockPref > 0 && dMaraScore >= 0) {
			html.push('<table class="worklistContentTable">' +
			buildRiskCellRow('ellipsis', divWidth, 'riskHeader', i18n.rwl.MARASCORE) +
			buildRiskCellRow('ellipsis', divWidth, '', dMaraScore) +
			'</table>');
		}

		html.push("</div>");
		return html.join("");
	}
	function buildCaseManagerCell(relationshipList, showAll) {
		if (relationshipList == undefined || relationshipList.length == 0) {
			return "";
		}
		relationshipList = alphaSort(relationshipList, "PRSNL_NAME");
		var displayAr = [];
		for (var pprx = 0, pprcnt = relationshipList.length; pprx < pprcnt; pprx++) {
			var relationship = relationshipList[pprx];
			if (relationship.RELTN_GROUP & 2) {
				if (relationship.PRSNL_ID == currentUserId) {
					displayAr.unshift(relationship.PRSNL_NAME);
				} else {
					displayAr.push(relationship.PRSNL_NAME);
				}
			}
		}

		if (displayAr.length <= 0) {
			return "";
		}

		var html = [];
		html.push("<div class='worklistContentDiv'>");
		html.push(formContentTable(displayAr, "COL_CASE_MANAGER", showAll));
		html.push("</div>");
		return html.join("");
	}
	this.updateHealthPlanData = function(patients) {
		for (var i = 0; i < patients.length; i++) {
			var html = buildHealthPlanCell(patients[i].HEALTH_PLANS);
			var $healthPlanCell = $("#PtRowId" + patients[i].PERSON_ID).children(".wklCol" + wklColumns.COL_PAYER_HP_CLASS);
			$healthPlanCell.attr('loaded', 'true');
			if (html.length > 0) {
				$healthPlanCell.html(html);
			}
		}
		updateColumnSpinners([wklColumns.COL_PAYER_HP_CLASS]);
	};
	function buildHealthPlanCell(planList, showAll) {
		if (planList == undefined || planList.length <= 0) {
			return "";
		}

		var html = [];
		html.push("<div class='worklistContentDiv'>");
		var displayAr = [];
		if (planList) {
			for (var plnx = 0, plncnt = planList.length; plnx < plncnt; plnx++) {
				var plan = planList[plnx];
				var planName = $.trim(plan.PLAN_NAME);
				if (planName == "") {
					planName = "--";
				}
				var planType = $.trim(plan.PLAN_TYPE_CD_DISP);
				if (planType == "") {
					planType = "--";
				}
				var planClass = $.trim(plan.FIN_CLASS_CD_DISP);
				if (planClass == "") {
					planClass = "--";
				}
				var planDisplay = planName + "/" + planType + "/" + planClass;
				displayAr.push(planDisplay);
			}
		}
		html.push(formContentTable(displayAr, "COL_PAYER_HP_CLASS", showAll));
		html.push("</div>");
		return html.join("");
	}
	this.updateConditionData = function(patients, listCount) {

		for (var i = 0; i < patients.length; i++) {
			var conditionHtml = buildConditionCell(patients[i].CONDITIONS);
			var registryHtml = buildRegistryImportCell(patients[i].REGISTRY);
			$patientRow = $("#PtRowId" + patients[i].PERSON_ID);

			var $conditionCell = $patientRow.children(".wklCol" + wklColumns.COL_CONDITIONS);
			$conditionCell.attr('loaded', 'true');
			if (conditionHtml.length > 0) {
				$conditionCell.html(conditionHtml);
			}

			var $registryCell = $patientRow.children(".wklCol" + wklColumns.COL_REGISTRY_IMPORT);
			$registryCell.attr('loaded', 'true');
			if (registryHtml.length > 0) {
				$registryCell.html(registryHtml);
			}
		}
		updateColumnSpinners([wklColumns.COL_CONDITIONS, wklColumns.COL_REGISTRY_IMPORT]);
	};
	function buildConditionCell(conditionList, showAll) {
		if (conditionList == undefined || conditionList.length == 0) {
			return "";
		}

		var displayAr = [];
		for (var y = 0, conditionCnt = conditionList.length; y < conditionCnt; y++) {
			displayAr.push(conditionList[y].NAME);
		}

		if (displayAr.length <= 0) {
			return "";
		}

		var html = [];
		html.push("<div class='worklistContentDiv'>");
		html.push(formContentTable(displayAr, "COL_CONDITIONS", showAll));
		html.push("</div>");
		return html.join("");
	}
	function buildRegistryImportCell(registryImportList, showAll) {
		if (registryImportList == undefined || registryImportList.length <= 0) {
			return "";
		}

		var displayArray = [];
		for (var i = 0, regCount = registryImportList.length; i < regCount; i++) {
			if (registryImportList[i].INDEPENDENT_PARENT_IND == 1) {
				displayArray.push(registryImportList[i].NAME);
			}

			for (var j = 0, condCount = registryImportList[i].CONDITIONS.length; j < condCount; j++) {
				var condString = registryImportList[i].NAME + "(" + registryImportList[i].CONDITIONS[j].NAME + ")";
				displayArray.push(condString);
			}
		}

		if (displayArray.length <= 0) {
			return "";
		}

		var html = [];
		html.push("<div class='worklistContentDiv'>");
		html.push(formContentTable(displayArray, "COL_REGISTRY_IMPORT", showAll));
		html.push("</div>");
		return html.join("");
	}
	this.updateEncounterData = function(patients) {
		for (var i = 0; i < patients.length; i++) {
			var encByTypeHTML = buildEncountersByTypeCell(patients[i].encounterBucketAr);
			var $encounterByTypeCell = $("#PtRowId" + patients[i].PERSON_ID).children(".wklCol" + wklColumns.COL_VISITS_TIMEFRAME);
			$encounterByTypeCell.attr('loaded', 'true');
			if (encByTypeHTML.length > 0) {
				$encounterByTypeCell.html(encByTypeHTML);
			}
			var encLast24HourHTML = buildLast24HourEncounterCell(patients[i].encounterBucketAr);
			var $encLast24HourCell = $("#PtRowId" + patients[i].PERSON_ID).children(".wklCol" + wklColumns.COL_ADM_DISCH_LAST_24HRS);
			$encLast24HourCell.attr('loaded', 'true');
			if (encLast24HourHTML.length > 0) {
				$encLast24HourCell.html(encLast24HourHTML);
			}
		}
		updateColumnSpinners([wklColumns.COL_ADM_DISCH_LAST_24HRS, wklColumns.COL_VISITS_TIMEFRAME]);
	};
	function buildEncountersByTypeCell(encounterBucketArray, showAll) {
		if (encounterBucketArray == undefined || encounterBucketArray.length <= 0) {
			return "";
		}
		var utilDisplayAr = [];
		for (var j = 0; j < encounterBucketArray.length; j++) {
			var curEncBucket = encounterBucketArray[j];

			if (curEncBucket.encounterAr && curEncBucket.encounterAr.length) {
				var displayStr = i18n.rwl.ENCOUNTERSTRING.replace("{26}",curEncBucket.encounterAr.length);
				displayStr = displayStr.replace("{27}",$.trim(curEncBucket.ENCNTR_GROUP_LABEL));
				displayStr = displayStr.replace("{28}",curEncBucket.ENCNTR_GROUP_DAYS);

				utilDisplayAr.push(displayStr);
			}
		}
		if (utilDisplayAr.length <= 0) {
			return "";
		}
		return ("<div class='worklistContentDiv'>" + formContentTable(utilDisplayAr, "COL_VISITS_TIMEFRAME", showAll) + "</div>");
	}
	function buildLast24HourEncounterCell(encounterBucketArray, showAll) {
		if (encounterBucketArray == undefined || encounterBucketArray.length <= 0) {
			return "";
		}

		var visitDisplayAr = [];
		for (var j = 0; j < encounterBucketArray.length; j++) {
			var curEncBucket = encounterBucketArray[j];
			if ((curEncBucket.enc24HoursAdmAr && curEncBucket.enc24HoursAdmAr.length) || (curEncBucket.enc24HoursDisAr && curEncBucket.enc24HoursDisAr.length)) {
				var admNum = (curEncBucket.enc24HoursAdmAr.length) ? curEncBucket.enc24HoursAdmAr.length : "-";
				var disNum = (curEncBucket.enc24HoursDisAr.length) ? curEncBucket.enc24HoursDisAr.length : "-";
				var displayStr = admNum + "/" + disNum + " " + $.trim(curEncBucket.ENCNTR_GROUP_LABEL);
				visitDisplayAr.push(displayStr);
			}
		}
		if (visitDisplayAr.length <= 0) {
			return "";
		}

		return ("<div class='worklistContentDiv'>" + formContentTable(visitDisplayAr, "COL_ADM_DISCH_LAST_24HRS", showAll) + "</div>");
	}
	function buildQualifiedDateCell(person, showAll) {
		if (person == undefined) {
			return "";
		}

		var qualifiedDateArr = [];
		var displayString = person.LAST_ACTION_DT_TM.format(i18n.rwl_lc.fulldate4yr);
		qualifiedDateArr.push(displayString);

		if (qualifiedDateArr.length <= 0) {
			return "";
		}
		return ("<div class='worklistContentDiv'>" + formContentTable(qualifiedDateArr, "COL_QUALIFIED_DATE", showAll) + "</div>");
	}
	function buildLastCompActionCell(comments, showAll) {
		if(comments == undefined){
			return "";
		}
		var strDisp = [];
		for(var i=0,len=comments.length;i<len;i++){
			if(comments[i].type==2){
				strDisp.push(comments[i].date.format(i18n.rwl_lc.fulldate4yr) + ":");
				strDisp.push(comments[i].text);
				break; // only need the most recent
			}
		}
		return ("<div class='worklistContentDiv'>" + formContentTable(strDisp, "COL_LAST_COMP_ACTION", showAll) + "</div>");
	}
	function buildDeltaCell(person,addClass) {
		var removablePatients = m_controller.returnRemovablePatients();
		if($.inArray(parseInt(person.PERSON_ID), removablePatients) == -1 && addClass) {
			return "<div class='worklistContentDiv deltaCol selected' data-personid-value=" + person.PERSON_ID + "></div>";
		}
		return "<div class='worklistContentDiv deltaCol' data-personid-value=" + person.PERSON_ID + "></div>";
	}

	function formContentTable(contentArray, colKey, showAll) {
		var contentAr = $.extend(true, [], contentArray);
		var html = "";
		var divWidth = 200-15;	// Width of content table in default column.
		var numToShow = showAll ? contentAr.length : 4;
		if(typeof colKey != 'undefined'){
			for(i=0, numCols=colDataObj.columns.length; i < numCols; i++){
				if(colDataObj.columns[i].key == colKey){
					divWidth = colDataObj.columns[i].width - 15;
				}
			}
		}

		html += "<table class='worklistContentTable'>";
		for (var i = 0; i < numToShow && i < contentAr.length; i++) {
			html += "<tr><td><div class='ellipsis'";
			if(!showAll) {
				html += "style='width:" + divWidth + "px'>";
			}
			else {
				html += ">";
			}
			html += "<span>" + escapeHtmlString($.trim(contentAr[i])) + "</span></div></td></tr>";
		}
		html += "</table>";

		if (!showAll && contentAr.length > numToShow) {
			html += "<div class='divWorklistMoreImg'><span>" + i18n.rwl.MOREIMGTEXT + "</span></div>";
		}
		return html;
	}
	this.reloadPatientList = function() {

		$("#wklBodyFixed").find("div.wklPatientRowFixed").remove();
		$("#wklBodyScroll").find("div.wklPatientRow").remove();

		var sortCriteria = m_controller.returnSortCriteria();
		var worklistItems = m_controller.returnWorkListItems();

		this.showPatientList(worklistItems,sortCriteria);

	};
	this.insertPatient = function(worklistItem, personId, indexOfPatient) {

		var newRow;
		var insertClass;

		if(indexOfPatient >= 0) {

			if(indexOfPatient >= (divShown.firstRow - 1) * (listDisplayLength/3) && indexOfPatient < divShown.firstRow * (listDisplayLength/3)) {
				insertClass = divShown.firstRow;
			} else if(indexOfPatient >= divShown.firstRow * (listDisplayLength/3) && indexOfPatient < divShown.secondRow * (listDisplayLength/3)) {
				insertClass = divShown.secondRow;
			} else if(indexOfPatient >= divShown.secondRow * (listDisplayLength/3) && indexOfPatient < divShown.thirdRow * (listDisplayLength/3)) {
				insertClass = divShown.thirdRow;
			}
			if(insertClass) {
				newRow = this.buildEntireRow(worklistItem, "zebra-white","",insertClass);
			}
		} else {
			newRow = this.buildEntireRow(worklistItem, "zebra-white");
		}
		if (personId == 0.0) {
			m_controller.setWorklistMessage(i18n.rwl.NOPERSON,false);
			$("#wklHeaderDiv").show();
			$("#wklBodyFixed").prepend(newRow.$fixedCells).show();
			$("#wklBodyScroll").prepend(newRow.patientRow).show();
			orderedPatientIds.unshift(worklistItem.PERSON_ID);
			setWorkListItemsArray(worklistItem, personId, indexOfPatient);
			InsertedPatientIndex = 0;
			return;
		}
		if(indexOfPatient >= (divShown.firstRow - 1) * (listDisplayLength/3) && indexOfPatient <= (divShown.thirdRow) * (listDisplayLength/3)) {
			var insertAfterRowId = "#PtRowId" + personId;
			var insertAfterPersonId = "#PtRowFixedId" + personId;
			newRow.$fixedCells.insertAfter($(insertAfterPersonId));
			var $patientRow = $(newRow.patientRow);
			$patientRow.insertAfter($(insertAfterRowId));
		}

		setWorkListItemsArray(worklistItem, personId, indexOfPatient);
	};

	function setWorkListItemsArray(worklistItem, personId, indexOfPatient) {
		var orderedLength = orderedPatientIds.length;
		var indexToInsert = 0;
		for (var i = 0; i < orderedLength; i++) {
			if (orderedPatientIds[i] == personId) {
				indexToInsert = i + 1;
				break;
			}
		}
		InsertedPatientIndex = indexToInsert;
		orderedPatientIds.splice(indexToInsert, 0, worklistItem.PERSON_ID);
		worklistItemsArray.splice(indexToInsert, 0, worklistItem);
	}

	 function managePatientPosOnInsert() {
		if($("#wklBodyFixed .wklPatientRowFixed.div" + divShown.firstRow).length > (listDisplayLength/3)) {
				$("#wklBodyFixed .wklPatientRowFixed.div" + divShown.firstRow + ":last")
								.removeClass("div" + divShown.firstRow + "")
								.addClass("div" + divShown.secondRow + "");

				$("#wklBodyScroll .wklPatientRow.scroll" + divShown.firstRow + ":last")
									.removeClass("scroll" + divShown.firstRow + "")
									.addClass("scroll" + divShown.secondRow + "");
			}

			if($("#wklBodyFixed .wklPatientRowFixed.div" + divShown.secondRow).length > (listDisplayLength/3)) {
				$("#wklBodyFixed .wklPatientRowFixed.div" + divShown.secondRow + ":last")
							.removeClass("div" + divShown.secondRow + "")
							.addClass("div" + divShown.thirdRow + "");

				$("#wklBodyScroll .wklPatientRow.scroll" + divShown.secondRow + ":last")
									.removeClass("scroll" + divShown.secondRow + "")
									.addClass("scroll" + divShown.thirdRow + "");
			}

			if($("#wklBodyFixed .wklPatientRowFixed").length > listDisplayLength && $("#wklBodyScroll .wklPatientRow").length > listDisplayLength) {
				$("#wklBodyFixed .wklPatientRowFixed.div" + divShown.thirdRow + ":last").remove();
				$("#wklBodyScroll .wklPatientRow.scroll" + divShown.thirdRow + ":last").remove();
			}
	}
	this.manageInsert = function() {

		var $wklBodyFixed = $("#wklBodyFixed .wklPatientRowFixed");
		var $wklBodyScroll = $("#wklBodyScroll .wklPatientRow");
		var indexToInsert = InsertedPatientIndex;
		var batchSize = (listDisplayLength/3);

		if(indexToInsert < batchSize * (divShown.firstRow - 1)) {
			var scrollarray = [];
			var worklistItems = worklistItemsArray;
			var zebraStriping = ((batchSize * (divShown.firstRow - 1)) % 2 == 0) ? "zebra-white" : "zebra-blue";

			var newRow = this.buildEntireRow(worklistItems[batchSize * (divShown.firstRow - 1)], zebraStriping, false, divShown.firstRow);

			newRow.$fixedCells.insertBefore($("#wklBodyFixed .wklPatientRowFixed.div" + divShown.firstRow + ":first"));
			scrollarray.push(newRow.patientRow);
			$("#wklBodyScroll .wklPatientRow.scroll" + divShown.firstRow + ":first").before(scrollarray.join(""));

			managePatientPosOnInsert();

		} else if(indexToInsert >= batchSize * (divShown.firstRow - 1) && indexToInsert < batchSize * divShown.firstRow) {

			managePatientPosOnInsert();

		} else if(indexToInsert >= batchSize * divShown.firstRow && indexToInsert < batchSize * divShown.secondRow) {

			if($("#wklBodyFixed .wklPatientRowFixed.div" + divShown.secondRow).length > (listDisplayLength/3)) {
				$("#wklBodyFixed .wklPatientRowFixed.div" + divShown.secondRow + ":last")
							.removeClass("div" + divShown.secondRow + "")
							.addClass("div" + divShown.thirdRow + "");


				$("#wklBodyScroll .wklPatientRow.scroll" + divShown.secondRow + ":last")
									.removeClass("scroll" + divShown.secondRow + "")
									.addClass("scroll" + divShown.thirdRow + "");
			}


			if($("#wklBodyFixed .wklPatientRowFixed").length > listDisplayLength && $("#wklBodyScroll .wklPatientRow").length > listDisplayLength) {
				$("#wklBodyFixed .wklPatientRowFixed.div" + divShown.thirdRow + ":last").remove();
				$("#wklBodyScroll .wklPatientRow.scroll" + divShown.thirdRow + ":last").remove();
			}

		} else if(indexToInsert >= batchSize * divShown.secondRow && indexToInsert < batchSize * divShown.thirdRow) {
			if($("#wklBodyFixed .wklPatientRowFixed").length > listDisplayLength && $("#wklBodyScroll .wklPatientRow").length > listDisplayLength) {
				$("#wklBodyFixed .wklPatientRowFixed.div" + divShown.thirdRow + ":last").remove();
				$("#wklBodyScroll .wklPatientRow.scroll" + divShown.thirdRow + ":last").remove();
			}
		}
		adjustHorizontalScrollBar(worklistItemsArray);
	};
	function removePatient(patID) {
		var indexToRemove = $.inArray(patID, orderedPatientIds);
		if(indexToRemove === -1) {
			indexToRemove = $.inArray(patID, filteredOutPatientIds);
			if(indexToRemove > -1) {
				filteredOutPatientIds.splice(indexToRemove, 1);
			}
		} else {
			orderedPatientIds.splice(indexToRemove, 1);
			worklistItemsArray.splice(indexToRemove, 1);
		}
		return indexToRemove;
	}
	function addNextPatient(batchSize) {
		var nextPatientIndex = batchSize * divShown.thirdRow + 1;
		if(nextPatientIndex > worklistItemsArray.length) {
			return;
		}
		var nextPatientRow = m_worklistObj.buildEntireRow(worklistItemsArray[nextPatientIndex], "zebra-white", false, 3);
		var scrollarray = [];
		nextPatientRow.$fixedCells.insertAfter($("#wklBodyFixed .wklPatientRowFixed.div" + divShown.thirdRow + ":last"));
		scrollarray.push(nextPatientRow.patientRow);
		$("#wklBodyScroll .wklPatientRow.scroll" + divShown.thirdRow + ":last").after(scrollarray.join(""));
	}
	function movePatientBetweenBatches(startingBatch, newBatch) {
		$("#wklBodyFixed .wklPatientRowFixed.div" + startingBatch + ":first")
						.removeClass("div" + startingBatch + "")
						.addClass("div" + newBatch + "");

		$("#wklBodyScroll .wklPatientRow.scroll" + startingBatch + ":first")
							.removeClass("scroll" + startingBatch + "")
							.addClass("scroll" + newBatch + "");
	}
	this.manageRemoval = function(patientIDs, removeAllPatients) {
		var batchSize = (listDisplayLength/3);
		for(var p = 0, plen = patientIDs.length; p < plen; p++) {
			var patID = patientIDs[p];
			var removeIndex = removePatient(patID);
			if(removeAllPatients === undefined) {
				$("#PtRowFixedId" + patID).remove();
				$("#PtRowId" + patID).remove();
				if(removeIndex >= batchSize * (divShown.firstRow -1) && removeIndex < batchSize * divShown.firstRow) {
					movePatientBetweenBatches(divShown.secondRow, divShown.firstRow);
					movePatientBetweenBatches(divShown.thirdRow, divShown.secondRow);
					addNextPatient(batchSize);

				}
				else if(removeIndex >= batchSize * divShown.firstRow && removeIndex < batchSize * divShown.secondRow) {
					movePatientBetweenBatches(divShown.thirdRow, divShown.secondRow);
					addNextPatient(batchSize);
				}
				else if(removeIndex >= batchSize * divShown.secondRow && removeIndex < batchSize * divShown.thirdRow) {
					addNextPatient(batchSize);
				}
			}
		}
		if(removeAllPatients !== undefined) {
			return;
		}
	    m_worklistObj.applyZebraStripes();
	    adjustHorizontalScrollBar(m_controller.returnWorkListItems());
	};
	this.applyZebraStripes = function() {
		$("#wklBodyFixed").find("div.wklPatientRowFixed").each(function(index) {
			$(this).removeClass("zebra-white zebra-blue");
			var zebraStriping;
			if(divShown.firstRow % 2 == 0) {
				zebraStriping = (index % 2 == 0) ? "zebra-blue" : "zebra-white";
			} else {
				zebraStriping = (index % 2 == 0) ? "zebra-white" : "zebra-blue";
			}
			$(this).addClass(zebraStriping);
		});
		$("#wklBodyScroll").find("div.wklPatientRow").each(function(index) {
			$(this).removeClass("zebra-white zebra-blue");
			var zebraStriping;
			if(divShown.firstRow % 2 == 0) {
				zebraStriping = (index % 2 == 0) ? "zebra-blue" : "zebra-white";
			} else {
				zebraStriping = (index % 2 == 0) ? "zebra-white" : "zebra-blue";
			}
			$(this).addClass(zebraStriping);
		});
	};
	this.setScrollPosition = function(firstVisiblePatient) {
		var patientId = firstVisiblePatient.patientId;
		var scrollPosition = firstVisiblePatient.scrollPosition;
		if (patientId == 0) {
			return;
		}
		var $newVisibleRow = $("#PtRowId" + patientId);
		if ($newVisibleRow == undefined) {
			return;
		}
		var currentRowPosition = $newVisibleRow.position().top + $("#wklBodyScroll").position().top;
		var scrollAmount = scrollPosition - currentRowPosition;
		var currentScrollPosition = $("#wklBodyDiv").scrollTop();
		var newScrollPosition = currentScrollPosition - scrollAmount;
		$("#wklBodyDiv").scrollTop(newScrollPosition);
	};
	this.markPatientsAsRemovable = function(patientIds) {
		var patientsMarked = 0;
		var length = patientIds.length;
		for (var i = 0; i < length; i++) {
			var patientId = patientIds[i];
			var $deltaCell = $("#PtDeltaId" + patientId);
			if ($deltaCell.length > 0) {
				patientsMarked++;
			}
			$deltaCell.addClass("removable");
		}
		return patientsMarked;
	};
	this.stopDeltaCheck = function() {
		m_controller.addDisplayMessage("info", i18n.rwl.DELTACOMPLETED, "deltaComp", staticContentPath + "/images/4021_16.png","auto");
		m_controller.clearSpecificMessages(".delta");
		setTimeout(function(){m_controller.clearSpecificMessages(".deltaComp");}, 3000);
	};
	this.removeColumnErrorImages = function() {
		var $columnHeaderCell = $("#wklHeaderDiv .wklHeaderCell");

		$columnHeaderCell.find("img.columnLoadingFailed")
							.attr("src",staticContentPath + "/images/6439_16.gif").hide().removeClass("columnLoadingFailed")
							.unbind("mouseover mouseout");
	};
}
