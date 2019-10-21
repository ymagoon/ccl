/**
 * Create the component style object which will be used to style various aspects
 * of our component. Please refer to
 * https://wiki.ucern.com/pages/viewpage.action?pageId=32221071 for better
 * implementation of table. This is now not being implemented due to lack of
 * time
 */
function BBProductsComponentStyle() {
	this.initByNamespace("bbp");
}

BBProductsComponentStyle.inherits(ComponentStyle);

/**
 * @constructor Initialize the blood bank Product Availability component
 * @param {Criterion}
 *            criterion : The Criterion object which contains information needed
 *            to render the component.
 */
function BBProductsComponent(criterion) {
	this.setCriterion(criterion);
	this.setStyles(new BBProductsComponentStyle());
	// Set the timer names so the architecture will create the correct timers
	// for our use
	this.setComponentLoadTimerName("USR:MPG.BBPRODUCTS.O1 - load component");
	this.setComponentRenderTimerName("ENG:MPG.BBPRODUCTS.O1 - render component");

	// Make sure the architecture includes the result count when creating the
	// count text
	this.setIncludeLineNumber(true);
}

/**
 * Setup the prototype and constructor to inherit from the base MPageComponent
 * object
 */
BBProductsComponent.prototype = new MPageComponent();
BBProductsComponent.prototype.constructor = MPageComponent;

/* Main rendering functions */

/**
 * This is the BBProductsComponent implementation of the retrieveComponentData
 * function. It creates the necessary parameter array for the data acquisition
 * script call and the associated Request object.
 */
BBProductsComponent.prototype.retrieveComponentData = function() {
	var self = this;

	// Create the parameter array for our script call
	var criterion = this.getCriterion();
	var sendAr = ["^MINE^", criterion.person_id + ".0"];

	var request = new MP_Core.ScriptRequest(this, this.getComponentLoadTimerName());
	request.setProgramName("MP_BBSUM_PRODUCTS");
	request.setParameters(sendAr);
	request.setAsync(true);

	MP_Core.XMLCCLRequestCallBack(this, request, function(reply) {
		self.renderComponent(reply);
	});
};

/**
 * function to internationalize the date time.
 */
BBProductsComponent.prototype.productI18nDateTime = function(bbpDateTime) {
	// null date time would be all zero's as represented instead of null
	if (bbpDateTime === "\/Date(0000-00-00T00:00:00.000+00:00)\/") {
		return null;
	}
	var resultDtTm = new Date();
	resultDtTm.setISO8601(bbpDateTime);
	return resultDtTm.format("longDateTime3");
};

///* function to display the hover for each date and id has to be unique */
BBProductsComponent.prototype.createEventHandlers = function() {
	$('a.abbphover').mouseover(function(e) {
		// specimen availability table id
		var concatId = "satab-" + e.target.id;
		$("#" + concatId + "").removeClass("hidden");
		$("#" + concatId + "").css({
			top : e.clientY + 10,
			left : e.clientX + 20
		});
	}).mouseout(function(e) {
		/* function to hide the hover when cursor is moved away and id should unique */
		var concatId = "satab-" + e.target.id;
		$("#" + concatId + "").addClass("hidden");
	});
	
	/* change the expand collapse image and hide/show the product sections*/
	$(document).on("click", "span.bbp-expand", function(e) {
       var getId = e.target.id;
		document.getElementById(getId).className = "bbp-collapse";
		document.getElementById(getId.split(" ")[0]).className = "bbp-displaynone";
    });
	
	$(document).on("click", "span.bbp-collapse", function(e) {
       var getId = e.target.id;
		document.getElementById(getId).className = "bbp-expand";
		document.getElementById(getId.split(" ")[0]).className = "bbp-displaytable";
    });
};

/**
 * This is the BBProductsComponent implementation of the renderComponent
 * function. It takes the information retrieved from the script call and renders
 * the component's visuals. There is no check on the status of the script call's
 * reply since that is handled in the call to XMLCCLRequestWrapper.
 *
 * @param {MP_Core.ScriptReply}
 *            The ScriptReply object returned from the call to
 *            MP_Core.XMLCCLRequestCallBack function in the
 *            retrieveComponentData function of this object.
 */
BBProductsComponent.prototype.renderComponent = function(reply) {
	var compId = this.getComponentId();
	var productHoverId = compId;
	var self = this;
	var countText = "";
	var errMsg = [];
	var timerRenderComponent = null;
	var prodHover = "";
	try {
		timerRenderComponent = MP_Util.CreateTimer(this.getComponentRenderTimerName());
		var replyStatus = reply.getStatus();
		if (replyStatus !== "S") {
			if (replyStatus == "F") {
				errMsg.push(reply.getError());
				this.finalizeComponent(MP_Util.HandleErrorResponse(this.getStyles().getNameSpace(), errMsg.join("<br />")), "");
			}
			else {
				this.finalizeComponent(MP_Util.HandleNoDataResponse(this.getStyles().getNameSpace()), "(0)");
			}
		}
		var recordData = reply.getResponse();
		var bbpArray = [];
		var AssignRecCnt = recordData.ASSIGNEDLIST.length;
		var CrossMatchRecCnt = recordData.CROSSMATCHEDLIST.length;
		var DispRecCnt = recordData.DISPENSEDLIST.length;
		var TransRecCnt = recordData.TRANSFUSEDLIST.length;
		/* The above crossmatch count is used for traversing through the products, the number of products in each section depends on display flag*/
		var xMatchToDisplayCnt = 0;
		for(var i = 0; i < CrossMatchRecCnt; i++) {
			if(recordData.CROSSMATCHEDLIST[i].DISPLAYFLAG == true){
				xMatchToDisplayCnt++;
			}
		}
		var prodCount = AssignRecCnt + xMatchToDisplayCnt + DispRecCnt + TransRecCnt;
		bbpArray.push("<div class='content-body'>");
		bbpArray.push("<table>");
		bbpArray.push("<th class='content-hdr bbp_padding'>" + i18n.lab.bbt_products_o1.PRODUCT_NUMBER + "</th>");
		bbpArray.push("<th class='content-hdr bbp_padding'>" + i18n.lab.bbt_products_o1.PRODUCT_NAME + "</th>");
		bbpArray.push("<th class='content-hdr bbp_padding'>" + i18n.lab.bbt_products_o1.ABORH + "</th>");
		bbpArray.push("<th class='content-hdr bbp_padding'>" + i18n.lab.bbt_products_o1.QUANTITY_SHORT + "</th>");
		bbpArray.push("<th class='content-hdr bbp_padding'>" + i18n.lab.bbt_products_o1.STATUS_DATE_TIME + "</th>");
		bbpArray.push("</table>");

		/***********************************************************************
		 * //post the Assigned List
		 **********************************************************************/
		var assignId = "bbp_assigntable " + compId;
		bbpArray.push("<h3 class='sub-sec-hd'><span id='" + assignId + "' class='bbp-expand' type='image'></span><span class='sub-sec-title'>" + i18n.lab.bbt_products_o1.ASSIGNED + " (" + AssignRecCnt + ")</span></h3>");
		bbpArray.push("<div class='bbp_wrap_section'><table id='bbp_assigntable' class='bbp-displaytable'>");
		// zebra pattern for rows
		for (var i = 0; i < AssignRecCnt; i++) {
			if(recordData.ASSIGNEDLIST[i].DISPLAYFLAG == false){
				continue;
			}
			if (i % 2 == 1) {
				bbpArray.push("<tr class='bbp_evenrow'>");
			}
			else {
				bbpArray.push("<tr class='bbp_oddrow'>");
			}
			// increment hover id so that each hover is unique
			productHoverId = productHoverId + 1;
			bbpArray.push("<td class='bbp_prod-number bbp_padding'>", recordData.ASSIGNEDLIST[i].PRODUCT_NUMBER, "</td>");
			bbpArray.push("<td class='bbp_prod-name'>", recordData.ASSIGNEDLIST[i].PRODUCT, "</td>");
			
			bbpArray.push("<td class='bbp_prod-abo '>", recordData.ASSIGNEDLIST[i].PRODUCT_GRP, "</td>");
			if (recordData.ASSIGNEDLIST[i].QUANTITY > 0) {
				bbpArray.push("<td class='bbp_qty'>", recordData.ASSIGNEDLIST[i].QUANTITY, "</td>");
			}
			else {
				bbpArray.push("<td class='bbp_qty'></td>");
			}
			/* Jquery handles the hover event */
			bbpArray.push("<td class='bbp_prd-datetime' id='td" + productHoverId + "'><a href='#' id='" + productHoverId + "' class='abbphover'>" + self.productI18nDateTime(recordData.ASSIGNEDLIST[i].PE_EVENT_DT_TM_STR) + "</a></td>");
			bbpArray.push("</tr>");

			/* before for loop ends get the individual hover information, with the unique div id*/
			prodHover = prodHover + "<div id='satab-" + productHoverId + "' class='bbphover'><table><tr><td class='bbp_specimenheader'>" + i18n.lab.bbt_products_o1.PRODUCT_EXPIRATION + "&nbsp;&nbsp;</td><td>" + "  " + self.productI18nDateTime(recordData.ASSIGNEDLIST[i].PR_EXPIRE_DT_TM_STR) + "</td></tr></table></div>";

		}// end for
		bbpArray.push("</table></div>");

		/***********************************************************************
		 * //post the CrossMatched List
		 **********************************************************************/
		var xmatchId = "bbp_xmatchtable " + compId;
		bbpArray.push("<h3 class='sub-sec-hd'><span id='" + xmatchId + "' class='bbp-expand' type='image'></span><span class='sub-sec-title'>" + i18n.lab.bbt_products_o1.CROSSMATCHED + " (" + xMatchToDisplayCnt + ")</span></h3>");
		bbpArray.push("<div class='bbp_wrap_section'><table id='bbp_xmatchtable' class='bbp-displaytable'>");
		// zebra pattern for rows
		for (var i = 0; i < CrossMatchRecCnt; i++) {
			if(recordData.CROSSMATCHEDLIST[i].DISPLAYFLAG == false){
				continue;
			}
			if (i % 2 == 1) {
				bbpArray.push("<tr class='bbp_evenrow'>");
			}
			else {
				bbpArray.push("<tr class='bbp_oddrow'>");
			}
			productHoverId = productHoverId + 1;
			bbpArray.push("<td class='bbp_prod-number bbp_padding'>", recordData.CROSSMATCHEDLIST[i].PRODUCT_NUMBER, "</td>");
			bbpArray.push("<td class='bbp_prod-name'>", recordData.CROSSMATCHEDLIST[i].PRODUCT, "</td>");
			bbpArray.push("<td class='bbp_prod-abo'>", recordData.CROSSMATCHEDLIST[i].PRODUCT_GRP, "</td>");
			bbpArray.push("<td class='bbp_qty'></td>");
			// jquery handles the hover on the date
			bbpArray.push("<td class='bbp_prd-datetime' id='td" + productHoverId + "'><a href='#' id='" + productHoverId + "' class='abbphover'>" + self.productI18nDateTime(recordData.CROSSMATCHEDLIST[i].PE_EVENT_DT_TM_STR) + "</a></td>");
			bbpArray.push("</tr>");
			prodHover = prodHover + "<div id='satab-" + productHoverId + "' class='bbphover'><table><tr><td class='bbp_specimenheader'>" + i18n.lab.bbt_products_o1.CROSSMATCH_EXPIRATION + "&nbsp;&nbsp;</td><td>" + self.productI18nDateTime(recordData.CROSSMATCHEDLIST[i].XM_EXPIRE_DT_TM_STR) + "</td></tr><tr><td class='bbp_specimenheader'>" + i18n.lab.bbt_products_o1.PRODUCT_EXPIRATION + "&nbsp;&nbsp;</td><td>" + self.productI18nDateTime(recordData.CROSSMATCHEDLIST[i].PR_EXPIRE_DT_TM_STR) + "</td></tr></table></div>";
		}// end for
		bbpArray.push("</table></div>");

		/***********************************************************************
		 * //post the DispensedList
		 **********************************************************************/
		var dispenseId = "bbp_dispensetable " + compId;
		bbpArray.push("<h3 class='sub-sec-hd'><span id='" + dispenseId + "' class='bbp-expand' type='image'></span><span class='sub-sec-title'>" + i18n.lab.bbt_products_o1.DISPENSED + " (" + DispRecCnt + ")</span></h3>");
		bbpArray.push("<div class='bbp_wrap_section'><table id='bbp_dispensetable' class='bbp-displaytable'>");
		// zebra pattern for rows
		for (var i = 0; i < DispRecCnt; i++) {
			if(recordData.DISPENSEDLIST[i].DISPLAYFLAG == false){
				continue;
			}
			if (i % 2 == 1) {
				bbpArray.push("<tr class='bbp_evenrow'>");
			}
			else {
				bbpArray.push("<tr class='bbp_oddrow'>");
			}
			// unique id for each hover generated
			productHoverId = productHoverId + 1;
			bbpArray.push("<td class='bbp_prod-number bbp_padding'>", recordData.DISPENSEDLIST[i].PRODUCT_NUMBER, "</td>");
			bbpArray.push("<td class='bbp_prod-name'>", recordData.DISPENSEDLIST[i].PRODUCT, "</td>");
			bbpArray.push("<td class='bbp_prod-abo'>", recordData.DISPENSEDLIST[i].PRODUCT_GRP, "</td>");
			// Display only if there is quantity specified
			if (recordData.DISPENSEDLIST[i].QUANTITY > 0) {
				bbpArray.push("<td class='bbp_qty'>", recordData.DISPENSEDLIST[i].QUANTITY, "</td>");
			}
			else {
				bbpArray.push("<td class='bbp_qty'></td>");
			}
			// display hover only if device or cooler exits
			if (recordData.DISPENSEDLIST[i].COOLER != "" || recordData.DISPENSEDLIST[i].DEVICE != "") {
				bbpArray.push("<td class='bbp_prd-datetime' id='td" + productHoverId + "'><a href='#' id='" + productHoverId + "' class='abbphover'>" + self.productI18nDateTime(recordData.DISPENSEDLIST[i].PE_EVENT_DT_TM_STR) + "</a></td>");
				prodHover = prodHover + "<div id='satab-" + productHoverId + "'class='bbphover'><table><tr class='bbp_specimenheader'><td>" + i18n.lab.bbt_products_o1.DISPENSED_TO + "  " + "</td></tr>";
				if (recordData.DISPENSEDLIST[i].DEVICE != "") {
					prodHover = prodHover + "<tr><td class='bbp_specimenheader'>" + i18n.lab.bbt_products_o1.DEVICE + "&nbsp;&nbsp;</td><td>" + recordData.DISPENSEDLIST[i].DEVICE + "</td></tr>";
				}
				// add if the cooler exists
				if (recordData.DISPENSEDLIST[i].COOLER != "") {
					prodHover = prodHover + "<tr><td class='bbp_specimenheader'>" + i18n.lab.bbt_products_o1.COOLER + "&nbsp;&nbsp;</td><td>" + recordData.DISPENSEDLIST[i].COOLER + "</td></tr>";
				}
				prodHover = prodHover + "</table></div>";
			}
			else {
				bbpArray.push("<td class='bbp_prd-datetime'>" + self.productI18nDateTime(recordData.DISPENSEDLIST[i].PE_EVENT_DT_TM_STR), "</td>");
			}
			bbpArray.push("</tr>");
			// add the device if it exists
		}// end for

		bbpArray.push("</table></div>");

		/***********************************************************************
		 * //post the Transfused List
		 **********************************************************************/
		var transId = "bbp_transfusetable " + compId;
		bbpArray.push("<h3 class='sub-sec-hd'><span id='" + transId + "' class='bbp-collapse' type='image'></span><span class='sub-sec-title'>" + i18n.lab.bbt_products_o1.LAST_3_MONTHS + " (" + TransRecCnt + ")</span></h3>");
		bbpArray.push("<div class='bbp_wrap_section'><table id='bbp_transfusetable' class='bbp-displaynone'>");
		// zebra pattern for rows
		for (var i = 0; i < TransRecCnt; i++) {
			if(recordData.TRANSFUSEDLIST[i].DISPLAYFLAG == false){
				continue;
			}
			if (i % 2 == 1) {
				bbpArray.push("<tr class='bbp_evenrow'>");
			}
			else {
				bbpArray.push("<tr class='bbp_oddrow'>");
			}
			bbpArray.push("<td class='bbp_prod-number bbp_padding'>", recordData.TRANSFUSEDLIST[i].PRODUCT_NUMBER, "</td>");
			bbpArray.push("<td class='bbp_prod-name'>", recordData.TRANSFUSEDLIST[i].PRODUCT, "</td>");
			bbpArray.push("<td class='bbp_prod-abo'>", recordData.TRANSFUSEDLIST[i].PRODUCT_GRP, "</td>");
			if (recordData.TRANSFUSEDLIST[i].QUANTITY > 0) {
				bbpArray.push("<td class='bbp_qty'>", recordData.TRANSFUSEDLIST[i].QUANTITY, "</td>");
			}
			else {
				bbpArray.push("<td class='bbp_qty'></td>");
			}
			bbpArray.push("<td class='bbp_prd-datetime'>", self.productI18nDateTime(recordData.TRANSFUSEDLIST[i].PE_EVENT_DT_TM_STR), "</td>");

			bbpArray.push("</tr>");
		}// end for
		bbpArray.push("</table></div>");
		bbpArray.push("</div>");
		// end the content body
		$("body").append(prodHover);
		countText = MP_Util.CreateTitleText(this, prodCount);
		this.finalizeComponent(bbpArray.join(""), countText);
		this.createEventHandlers();
	}
	catch (err) {
		if (timerRenderComponent) {
			timerRenderComponent.Abort();
			timerRenderComponent = null;
		}
		MP_Util.LogJSError(this, err, "mp_bbt_products.js", "renderComponent");
		throw (err);
	}
	finally {
		if (timerRenderComponent) {
			timerRenderComponent.Stop();
		}
	}
};

MP_Util.setObjectDefinitionMapping("MP_BBT_PRODUCTS_LAYOUT", BBProductsComponent);