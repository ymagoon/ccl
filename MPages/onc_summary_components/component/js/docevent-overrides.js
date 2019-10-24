DocEventManager.prototype.getNodeId = function() {
	return this.nodeId || null;
};

DocEventManager.prototype.getPathwayId = function() {
	return this.pathwayId || null;
};

DocEventManager.prototype.setIntentionMeaning = function(val) {
	this.intentionMeaning = val;
};

DocEventManager.prototype.setNodeId = function(val) {
	this.nodeId = val;
};

DocEventManager.prototype.setPathwayId = function(val) {
	this.pathwayId = val;
};

DocEventManager.prototype.checkIsStale = function() {
	var activityLog = this.getActivityLog();
	var x;

	for ( x = activityLog.length; x--; ) {
		if (activityLog[x].NEW) {
			return true;
		}
	}

	return false;
};

DocEventManager.prototype.getNodeBehavior = function(responseIdent, callback) {
	var pathwayId = this.getPathwayId();
	var nodeId = this.getNodeId();

	if (pathwayId && nodeId) {
		CPEventManager.getNodeBehaviors({
			"PATHWAY_ID" : pathwayId,
			"NODE_ID" : nodeId,
			"RESPONSE_IDENT" : responseIdent
		}, callback);
	}
};

DocEventManager.prototype.handleSuggestAction = function(action) {
	var that = this;
	var target = action.TARGET;
	var pathwayId = that.getPathwayId();
	var nodeId = that.getNodeId();
	var items = action.ITEMS;

	if (that.getStateByOCID(target) !== true) {
		that.setStateByOCID(target, true);
		that.setItemByResponseIdent(target, items);

		that.pushToQueue({
			"ACTION" : function() {
				CPEventManager.notifyObservers("CP_NODE_BEHAVIOR", {
					"PATHWAY_ID" : pathwayId,
					"NODE_ID" : nodeId,
					"RESPONSE_IDENT" : target
				});
			},
			"PRIORITY" : action.PRIORITY,
			"TARGET" : target,
			"TYPE" : action.TYPE
		});
	}
};

DocEventManager.prototype.handleUnsuggestAction = function(action) {
	var that = this;
	var target = action.TARGET;

	if (that.getStateByOCID(target) !== false) {
		that.setStateByOCID(target, false);
		that.pushToQueue({
			"ACTION" : function() {
				that.getNodeBehavior(target, function(behavior) {
					if (behavior) {
						var identifier, x, y;

						for ( x = 0, y = behavior.length; x < y; x++) {
							switch(behavior[x].REACTION_ENTITY_NAME) {
								case "ORDER_SENTENCE" :
									identifier = "SENTENCE";
									break;
								case "ORDER_CATALOG_SYNONYM":
								case "ALT_SEL_CAT":
									identifier = "ORDER";
									break;
								case "CP_NODE":
									identifier = "NODE";
									break;
								case "REGIMEN_CATALOG" :
									identifier = "REGIMEN";
									break;
								case "PATHWAY_CATALOG" :
									identifier = "PATHWAY";
									break;
								default:
									identifier = null;
							}

							if (identifier) {
								CPEventManager.notifyObservers("CP_NODE_BEHAVIOR_REACTION_UNDO", {
									"CP_NODE_ID" : that.getNodeId(),
									"TYPE" : identifier,
									"DATA" : behavior
								});
							}
						}
					}
				});
			},
			"PRIORITY" : action.PRIORITY,
			"TARGET" : target,
			"TYPE" : action.TYPE
		});
	}
};

DocEventManager.prototype.reverseTranslate = function(curEvent) {
	var expression = curEvent.EXPRESSION;
	var tags = curEvent.TAGS;
	var termsByOCID = this.getTermsByOCID();
	var regex, term, x, y;

	var regexValues = {
		"TERM_VALUES" : {
			"STATE" : ""
		},
		"OPERATORS" : {
			"AND" : i18n.innovations.pathways_shared.AND,
			"OR" : i18n.innovations.pathways_shared.OR,
			"NOT" : i18n.innovations.pathways_shared.NOT,
			"EQUALS" : "",
			"GTE" : i18n.innovations.pathways_shared.GTE,
			"GT" : i18n.innovations.pathways_shared.GT,
			"LTE" : i18n.innovations.pathways_shared.LTE,
			"LT" : i18n.innovations.pathways_shared.LT
		},
		"CONSTANTS" : {
			"NULL" : "-",
			"YES" : i18n.innovations.pathways_shared.YES_SHORT,
			"NO" : i18n.innovations.pathways_shared.NO_SHORT
		}
	};

	for (x in regexValues) {
		for (y in regexValues[x]) {
			regex = new RegExp(y, "g");
			expression = expression.replace(regex, regexValues[x][y]);
		}
	}

	for ( x = tags.length; x--; ) {
		term = termsByOCID[tags[x]];
		regex = new RegExp("TERM\\{" + x + "\\}", "g");
		expression = expression.replace(regex, term.getTitle());
	}

	return expression;
};

DocEventManager.prototype.updateActivityLog = function(section) {
	var termsByOCID = this.getTermsByOCID();
	var activityLog = [];
	var ocid, state, groupByIdent, itemIdent, attributeIdent, attributeMenuItemIdent, ocidIdent, truthStateMeanIdent, a, b, c, d, x;

	groupByIdent = "groupbys";
	itemIdent = "items";
	attributeIdent = "attributes";
	attributeMenuItemIdent = "attribute_menu_items";
	ocidIdent = "ocid";
	truthStateMeanIdent = "truth_state_mean";

	for ( a = section[groupByIdent].length; a--; ) {
		for ( b = section[groupByIdent][a][itemIdent].length; b--; ) {
			for ( c = section[groupByIdent][a][itemIdent][b][attributeIdent].length; c--; ) {
				for ( d = section[groupByIdent][a][itemIdent][b][attributeIdent][c][attributeMenuItemIdent].length; d--; ) {
					ocid = section[groupByIdent][a][itemIdent][b][attributeIdent][c][attributeMenuItemIdent][d][ocidIdent];
					state = section[groupByIdent][a][itemIdent][b][attributeIdent][c][attributeMenuItemIdent][d][truthStateMeanIdent];

					activityLog.push({
						"TERM_OCID" : ocid,
						"TERM_DISPLAY" : termsByOCID[ocid].getTitle(),
						"TERM_STATE" : state === "T" ? 1 : (state === "F" ? 2 : 0),
						"ORIG_STATE" : state === "T" ? 1 : (state === "F" ? 2 : 0),
						"TIMESTAMP" : "",
						"NEW" : false
					});
				}
			}
		}
	}

	this.setActivityLog(activityLog);
};
