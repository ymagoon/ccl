/**
 * The care team component style
 */
function CareTeamo1ComponentStyle() {
	this.initByNamespace('care-team-o1');
}
CareTeamo1ComponentStyle.prototype = new ComponentStyle();
CareTeamo1ComponentStyle.prototype.constructor = ComponentStyle;

/**
 * The care team component
 *
 * @param {Object} criterion
 *        The criterion containing the information about the requested information
 */
function CareTeamo1Component(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new CareTeamo1ComponentStyle());
	this.setComponentLoadTimerName('USR:MPG.CARETEAM.O1 - load component');
	this.setComponentRenderTimerName('ENG:MPG.CARETEAM.O1 - render component');
	this.m_providerRowId = "";
	this.m_renderTimer = null;
}
CareTeamo1Component.prototype = new MPageComponent();
CareTeamo1Component.prototype.constructor = MPageComponent;
MP_Util.setObjectDefinitionMapping("CARE_TEAM", CareTeamo1Component);

/**
 * Retrieve the care team data on page load.
 * This function handles the logic to make a ccl script call and retrieve the care team data.
 */
CareTeamo1Component.prototype.retrieveComponentData = function() {
	/**
	 * Utility function to format numbers correctly for CCL parameters
	 *
	 * @param {Number} number
	 *        The number to be altered for ccl program use
	 * @return {String}
	 *         The result of concatenating '.0' to the number
	 */
	function cclNumber(number) {
		return (parseInt(number, 10) || 0) + '.0';
	}

	var criterion = this.getCriterion();
	var personId = criterion.person_id;
	var encntrId = criterion.encntr_id;
	var domainId = criterion.logical_domain_id;
	var self = this;

	try {
		if (domainId === null) {
			throw new Error('Logical Domain is null.');
		}

		// If encounter id is falsey, show 'encounter needed' message in the component
		if (!encntrId) {
			this.finalizeComponent('<p class="disabled">' + i18n.discernabu.careteam_o1.NO_ENCNTR + '</p>', '');
			return;
		}

		// Prep the CCL request parameters
		var cclParams = [
			'^MINE^', // 'Output to File'
			cclNumber(personId), // 'Person ID'
			cclNumber(encntrId), // 'Encounter ID'
			'0.0', // 'Care Team ID'
			cclNumber(domainId) // 'Logical Domain ID'
		];


		// Prep the CCL request
		var request = new ScriptRequest();
		request.setProgramName('MP_GET_CARE_TEAM_ASSIGN');
		request.setParameterArray(cclParams);
		request.setLoadTimer(new RTMSTimer(self.getComponentLoadTimerName()));

		// Prep the response callback
		request.setResponseHandler(function(reply) {
			switch (reply.getStatus()) {
				case 'S':
					self.renderComponent(reply.getResponse());
					break;
				case 'F':
					self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), reply.getError()), '');
					break;
				default:
					self.renderNoCareTeam();
			}
		});

		// Send the CCL request
		request.performRequest();
	}
	catch (err) {
		MP_Util.LogJSError(err, self, 'care-team-o1.js', 'retrieveComponentData');
		self.finalizeComponent(MP_Util.HandleErrorResponse(self.getStyles().getNameSpace(), err.message), '');
	}
};

/**
 * Processes the passed in results to create the necessary contents
 * for the role, contact, and phone columns for the component table.
 *
 * @param {Object} results
 *        The listing of results returned from the back-end script mp_get_care_team_assign
 */
CareTeamo1Component.prototype.processResultsForRender = function(results, primaryContact) {
	var ctI18n = i18n.discernabu.careteam_o1;
	var resultLength = results.length;
	var phoneHoverHTML;
	var phoneHTML;
	var roleHTML;
	var contactHTML;
	var careTeamResult;
	var primaryContactTeamId = (primaryContact) ? primaryContact.PCT_CARE_TEAM_ID : 0;

	for (var i = 0; i < resultLength; i++) {
		careTeamResult = results[i];
		phoneHoverHTML = [];

		// Define the role HTML
		// --------------------

		// If there is a shift assignment defined for the row, display the shift role in the role column.
		if (careTeamResult.MEMBER_TYPE === "SHIFT_ASSIGNMENTS") {
			roleHTML = careTeamResult.ASSIGN_TYPE;
		}
		// If there is no shift assignment, but there is a lifetime relationship or non provider relation defined for the row,
		// display the relationship in the role column.
		else {
			if (careTeamResult.MEMBER_TYPE === "LIFETIME_RELATIONSHIP" || careTeamResult.MEMBER_TYPE === "NONPROVIDER_LIFETIME_RELATION" || careTeamResult.MEMBER_TYPE === "PROVIDER_RELATION") {
			roleHTML = careTeamResult.RELTN_TYPE;
			}
			// If there is no shift assignment or lifetime relationship defined for the row, assume we are dealing
			// with a provider, and display the relevant information in the role column.
			else {
				var medServiceDisp = careTeamResult.PCT_MED_SERVICE_DISPLAY;

				// If the team is defined, or a personnel exists for the row, add the team to the role column.
				if (careTeamResult.PCT_TEAM_DISPLAY) {
					medServiceDisp += ' | ' + careTeamResult.PCT_TEAM_DISPLAY;
				}

				// If no facility is defined, display the "All Facilities" string.
				if (!careTeamResult.FACILITY_CD) {
					medServiceDisp += ' <span class="secondary-text">(' + ctI18n.ALL_FACILITIES + ')</span>';
				}

				// If a personnel exists for the row and they have a role defined,
				// display the role on the primary line, and the medical service on the secondary line.
				if (careTeamResult.PRSNL_ID && careTeamResult.RELTN_TYPE) {
					roleHTML = [
						careTeamResult.RELTN_TYPE,
						'<div class="secondary-line secondary-text">',
							medServiceDisp,
						'</div>'
					].join('');
				}
				// If there is no personnel or personnel role defined, display the medical service on the primary line.
				else {
					roleHTML = medServiceDisp;
				}
			}
		}
			careTeamResult.ROLE_DISPLAY = roleHTML;
		// Define the contact HTML
		// -----------------------

		// If a personnel exists for the row, display their name in the contact column.
		if (careTeamResult.PRSNL_ID) {
			if(careTeamResult.PCT_CARE_TEAM_ID == primaryContactTeamId) {
				this.m_providerRowId = "care-team-o1"+this.getComponentId()+":THIS_VISIT:row" + i;
				//append Primary label
				contactHTML = [
					'<span class="care-team-o1-team">',
						'<span class="care-team-o1-contact-spacer">',
							'&nbsp;',
						'</span>',
						'<span class="care-team-o1-contact-name">',
							careTeamResult.PRSNL_NAME + ' (' + ctI18n.PRIMARY + ')',
						'</span>',
					'</span>',
				].join('');
			}
			else {
				contactHTML = [
					'<span class="care-team-o1-contact">',
						'<span class="care-team-o1-contact-spacer">',
							'&nbsp;',
						'</span>',
						'<span class="care-team-o1-contact-name">',
							careTeamResult.PRSNL_NAME,
						'</span>',
					'</span>'
				].join('');
			}
		}

		// If no personnel exists for the row, but a team is defined, display the team in the contact column.
		else if (careTeamResult.PCT_TEAM_DISPLAY) {
			contactHTML = [
				'<span class="care-team-o1-team">',
					'<span class="care-team-o1-contact-spacer care-team-o1-contact-icon">',
						'&nbsp;',
					'</span>',
					'<span class="care-team-o1-contact-name">',
						careTeamResult.PCT_TEAM_DISPLAY,
					'</span>',
				'</span>'
			].join('');
		}

		//If no provider or team associated , but Medical Service is defined , display Medical Service in the contact column
		else if (careTeamResult.PCT_MED_SERVICE_DISPLAY) {
			contactHTML = [
				'<span class="care-team-o1-team">',
					'<span class="care-team-o1-contact-spacer care-team-o1-contact-icon">',
						'&nbsp;',
					'</span>',
					'<span class="care-team-o1-contact-name">',
						careTeamResult.PCT_MED_SERVICE_DISPLAY,
					'</span>',
				'</span>'
			].join('');
		}

		// If no personnel or team is defined, display "--" in the contact column.
		else {
			contactHTML = [
				'<span class="care-team-o1-contact">',
					'<span class="care-team-o1-contact-spacer">',
						'&nbsp;',
					'</span>',
					'--',
				'</span>'
			].join('');
		}
		careTeamResult.CONTACT_DISPLAY = contactHTML;

		// Define the phone HTML and Hover
		// -------------------------------

		// If there are phones numbers defined for the row, display the first phone number in the phone column,
		// and display all of the phone numbers in the phone hover.
		if (careTeamResult.PHONES && careTeamResult.PHONES.length) {
			var phoneLength = careTeamResult.PHONES.length;
			phoneHTML = careTeamResult.PHONES[0].PHONE_NUM;

			for (var phoneIndex = 0; phoneIndex < phoneLength; phoneIndex++) {
				var phone = careTeamResult.PHONES[phoneIndex];
				phoneHoverHTML.push([
					'<dt>',
						'<span class="pull-left secondary-text">',
							phone.PHONE_TYPE + ':',
						'</span>',
					'</dt>',
					'<dd>',
						'<span>',
							phone.PHONE_NUM,
						'</span>',
					'</dd>'
				].join(''));
			}
		}
		// If there are no phone numbers defined for the row, display -- in the phone column,
		// and the "No Phone" string in the hover.
		else {
			phoneHTML = '--';
			phoneHoverHTML.push([
				'<dt>',
					ctI18n.NO_PHONE,
				'</dt>'
			].join(''));
		}
		careTeamResult.PHONE_DISPLAY = phoneHTML;
		careTeamResult.PHONE_HOVER = [
			'<div class="care-team-o1-hover">',
				'<dl>',
					phoneHoverHTML.join(''),
				'</dl>',
			'</div>'
		].join('');
	}
};


/**
 * Renders the retrieved data for the component into HTML markup to display within the document
 *
 * @param {Object} recordData
 *        The retrieved JSON to generate the HTML markup
 */
CareTeamo1Component.prototype.renderComponent = function(recordData) {
	var ctI18n = i18n.discernabu.careteam_o1;
	// Get result information
	var providers = recordData.CARE_TEAMS;
	var shiftAssignment = recordData.SHIFT_ASSIGNMENTS;
	var lifetimeReltn = recordData.LIFETIME_RELTN;
	var providerReltn = recordData.PROVIDER_RELTN;
	var nonProviders = recordData.NONPROVIDER_LIFETIME_RELTN;
	var primaryContact = recordData.PRIMARY_CONTACT;
	var numberResult = 0;
	var self = this;

	var thisVisit = providers.concat(shiftAssignment);
	var crossVisit = lifetimeReltn.concat(providerReltn);

	numberResult = thisVisit.length + crossVisit.length + nonProviders.length;
	try{
		this.m_renderTimer = MP_Util.CreateTimer(this.getComponentRenderTimerName());
		// Create and initialize the component table
		var careTeamTable = (new ComponentTable())
			.setNamespace(this.getStyles().getId())
			.setIsHeaderEnabled(true)
			.setCustomClass('care-team-o1-result-table');

		// Create and configure the role column
		var roleColumn = (new TableColumn())
			.setColumnId('ROLE')
			.setCustomClass('care-team-o1-role-column')
			.setColumnDisplay(ctI18n.ROLE_RELATIONSHIP)
			.setPrimarySortField('ROLE_DISPLAY')
			.setIsSortable(true)
			.setRenderTemplate('${ROLE_DISPLAY}');

		// Create and configure the contact column
		var contactColumn = (new TableColumn())
			.setColumnId('CONTACT')
			.setCustomClass('care-team-o1-contact-column')
			.setColumnDisplay('<span class="care-team-o1-contact-spacer">&nbsp;</span>' + ctI18n.CONTACT)
			.setPrimarySortField('CONTACT_DISPLAY')
			.setIsSortable(true)
			.setRenderTemplate('${CONTACT_DISPLAY}');

		// Create and configure the phone column
		var phoneColumn = (new TableColumn())
			.setColumnId('PHONE')
			.setCustomClass('care-team-o1-phone-column')
			.setColumnDisplay(ctI18n.PHONE)
			.setRenderTemplate('${PHONE_DISPLAY}');

		// Add the columns to the table
		careTeamTable.addColumn(roleColumn);
		careTeamTable.addColumn(contactColumn);
		careTeamTable.addColumn(phoneColumn);

		// Create and configure the providers group.
		if (thisVisit.length) {
			this.processResultsForRender(thisVisit, primaryContact);

			var thisVisitGroup = (new TableGroup())
				.bindData(thisVisit)
				.setDisplay(ctI18n.THIS_VISIT)
				.setGroupId('THIS_VISIT')
				.setCanCollapse(false);

			careTeamTable.addGroup(thisVisitGroup);
		}

		// Create and configure the lifetime relationship group.
		if (crossVisit.length) {
			this.processResultsForRender(crossVisit);

			var crossVisitsGroup = (new TableGroup())
				.bindData(crossVisit)
				.setDisplay(ctI18n.CROSS_VISITS)
				.setGroupId('CROSS_VISITS')
				.setCanCollapse(false);

			careTeamTable.addGroup(crossVisitsGroup);
		}

		// Create and configure the shift assignments group.
		if (nonProviders.length) {
			this.processResultsForRender(nonProviders);

			var nonProvidersGroup = (new TableGroup())
				.bindData(nonProviders)
				.setDisplay(ctI18n.NON_PROVIDERS)
				.setGroupId('NON_PROVIDERS')
				.setCanCollapse(false);

			careTeamTable.addGroup(nonProvidersGroup);
		}

		// Default sorting for the table will be on the Role Column
		careTeamTable.sortByColumnInDirection('ROLE', TableColumn.SORT.ASCENDING);

		// Set up row hover extension to display phone information.
		var hoverExtension = (new TableRowHoverExtension())
			.setHoverRenderer('${RESULT_DATA.PHONE_HOVER}');

		// Add the hover extention to the component table.
		careTeamTable.addExtension(hoverExtension);

		// Set the component table for the component.
		this.setComponentTable(careTeamTable);

		// Generate the table's HTML and finalize the component.
		this.finalizeComponent(careTeamTable.render());

		/**
		 * Override the toggleColumnSort method of ComponentTable to
		 * re-highlight the previously selected row and move the physician
		 * contact row to the top, if it exists.
		 *
		 * @param {string}
		 * columnId - the column to be sorted
		 */
		careTeamTable.toggleColumnSort = function(columnId) {
			// call the base class functionality to sort the column
			ComponentTable.prototype.toggleColumnSort.call(this, columnId);
			// Call function that checks for the primary contact and sets of a
			// chain of events for viewing it, if exists
			self.movePrimaryToTop();
		};

		var node = this.getSectionContentNode();
		if (this.isScrollingEnabled() && this.getScrollNumber()) {
			//Add the scrollable class
			if (numberResult > this.getScrollNumber()) {
				$('#care-team-o1' + this.getComponentId() + 'tableBody').addClass('scrollable');
			}
			//Enable scrolling, 1.6 is the min-height
			MP_Util.Doc.InitScrolling(Util.Style.g("scrollable", node, "div"), this.getScrollNumber(), "1.6");
			careTeamTable.refresh();
		}
		this.movePrimaryToTop();
	}
	catch(err) {
			if (this.m_renderTimer) {
				this.m_renderTimer.Abort();
				this.m_renderTimer = null;
			}
			MP_Util.LogJSError(err, self, "care-team-o1.js", "renderComponent");
			throw (err);
		}
		finally {
			if (this.m_renderTimer) {
				this.m_renderTimer.Stop();
			}
		}
};

/**
 * This function finds the primary contact row and moves it to the top of
 * the component table.
 */
CareTeamo1Component.prototype.movePrimaryToTop = function() {
	var component = this;
	var primaryRow = document.getElementById(this.m_providerRowId);

	if (primaryRow) {
		// prepend correct row to top of list of rows of careteam group which consists of care team assignments.
		$("#care-team-o1"+this.getComponentId()+"\\:THIS_VISIT\\:content").prepend(primaryRow);
		// call function to fix zebra stripes after shifting rows
		this.fixZebraStripes();
	}
};



/**
 * This function resets the zebra striping for the component table
 */
CareTeamo1Component.prototype.fixZebraStripes = function() {
	//fix the zebra stripes for the careteam group which consists of care team assignments.
	var tableBodyArr = $("#care-team-o1"+this.getComponentId()+"\\:THIS_VISIT\\:content").children();
	// redo zebra striping
	for ( var i = 0; i < tableBodyArr.length; i++) {
		tableBodyArr[i].className = "result-info "+ ((i % 2 === 0) ? "odd" : "even");
	}
};
/**
 * This function renders an empty component box displaying "No care teams"
 */
CareTeamo1Component.prototype.renderNoCareTeam = function() {
	var compId = this.getComponentId();

	try {
		// Finalize the component
		this.finalizeComponent([
			'<div id="' + compId + 'mainContainer">',
				'<div id="' + compId + 'tableView">',
					'<span class="disabled">',
						i18n.discernabu.careteam_o1.NO_RESULTS,
					'</span>',
				'</div>',
			'</div>'
		].join(''));
	}
	catch (err) {
		MP_Util.LogJSError(err, this, 'care-team-o1.js', 'renderNoCareTeam');
		throw (err);
	}
};

/**
 * Map the Care Team o1 object to the bedrock filter mapping so the architecture
 * will know what object to create when it sees the 'care-team-o1' filter
 */
MP_Util.setObjectDefinitionMapping('care-team-o1', CareTeamo1Component);
