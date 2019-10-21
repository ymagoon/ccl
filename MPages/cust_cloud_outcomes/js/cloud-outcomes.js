MPage.namespace("cerner");

/*Initialize Cloud Outcomes Component*/
cerner.cloud_outcomes = function(){};
cerner.cloud_outcomes.prototype = new MPage.Component();
cerner.cloud_outcomes.prototype.constructor = MPage.Component;
cerner.cloud_outcomes.prototype.base = MPage.Component.prototype;
cerner.cloud_outcomes.prototype.name = "cerner.cloud_outcomes";
cerner.cloud_outcomes.prototype.cclProgram = "MP_GET_OUTCOMES";
cerner.cloud_outcomes.prototype.cclParams = [];
cerner.cloud_outcomes.prototype.cclDataType = "JSON";

/* Initialize the cclParams variable */
cerner.cloud_outcomes.prototype.init = function(options){
	var params = [];
	//Set the params for the component
	params.push("MINE");
	params.push(this.getProperty("personId"));
	this.cclParams = params;
	this.data = "";
};

/* Render the basic layout of the component */
cerner.cloud_outcomes.prototype.render = function(){
	var outcome;
	var detail;
	var factor;
	var fdetail;
	var num;
	var contentArea = this.getTarget();
	
	$(contentArea).addClass("cloud_outcomes");
	
	//Retrieve the outcomes
	outcomes = this.data.OUTCOMEINFO;

	var divElement = document.createElement("div");
	var trElement = null;
	var tableElement = document.createElement("table");
	var thElement = document.createElement('thead');
	var thRowElement = document.createElement('tr');
	var tableBodyElement = document.createElement("tbody");
	var och = document.createElement("th");
	var dth = document.createElement("th");
	var sch = document.createElement("th");
	och.innerHTML = "Outcome";
	och.className = 'cerner_outcomes_header';
	dth.innerHTML = "Date";
	dth.className = 'cerner_outcomes_header';
	sch.innerHTML = "Score";
	sch.className = 'cerner_outcomes_header';
	thRowElement.appendChild(och);
	thRowElement.appendChild(dth);
	thRowElement.appendChild(sch);
	thElement.appendChild(thRowElement);
	
	for(var x = 0; x < outcomes.OUTCOMES.length; x++){
	
		outcome = outcomes.OUTCOMES[x];
		var dateString;
		var outcomeDate = new Date(outcome.OUTCOME_DATE);
		var outcomeType;
		var score;
		var day = outcomeDate.getDate();
		var month = outcomeDate.getMonth()+1;
		var year = outcomeDate.getFullYear();
		var hour = outcomeDate.getHours();
		var minute = outcomeDate.getMinutes();
		var stratificationFound = false;
		dateString = (month<=9?'0'+month:month) + '/' + (day<=9?'0'+day:day) + '/' + year + " " + (hour<=9?'0'+hour:hour) + ":" + (minute<=9?'0'+minute:minute);

				num = outcome.RISK_SCORE;
				var trElement = document.createElement("tr");
				var oc = document.createElement("td");
				var dt = document.createElement("td");
				var sc = document.createElement("td");
				if (outcome.OUTCOME_NAME > "") {
					outcomeType = outcome.OUTCOME_NAME;
				} else {
					outcomeType = outcome.OUTCOME_TYPE
				}
				oc.innerHTML = outcomeType;
				oc.className = 'cerner_outcomes_row';
				dt.innerHTML = dateString;
				dt.className = 'cerner_outcomes_row';

                //Logic to determine if STRATIFICATION is being supplied (V3 Logic)
                for (var out_cnt = 0; out_cnt < outcome.OUTCOME_DETAILS.length; out_cnt++) {
                    fdetail = outcome.OUTCOME_DETAILS[out_cnt];
                    if(fdetail.DETAIL_TYPE === "STRATIFICATION"){
                        score = fdetail.DETAIL_INFO;
                        stratificationFound = true;
                    }
                }
                //Logic when STRATIFICATION is not supplied (V2 Logic)
                if(!stratificationFound){
                    if (num > 0 && num < 21) {
                        score = "Very Low";
                    } else if (num > 20 && num < 41) {
                        score = "Low";
                    } else if (num > 40 && num < 61) {
                        score = "Moderate";
                    } else if (num > 60 && num < 81) {
                        score = "High";
                    } else if (num > 80 && num < 101) {
                        score = "Very High";
                    } else if (num == 0) {
                        score = "Not Available";
                    }
                }
				sc.innerHTML = score;
				sc.className = 'cerner_outcomes_row';

				var ftrElement = null;
				var ftableElement = document.createElement("table");
				var ftableHElement = document.createElement("thead");
				var fthRowElement = document.createElement('tr');
				var fnameh = document.createElement("th");
				var finfoh = document.createElement("th");
				fnameh.innerHTML = "Contributing Risk Factors";
				fnameh.className = 'cerner_outcomes_detail_header';
				finfoh.innerHTML = "";
				finfoh.className = 'cerner_outcomes_detail_header';
				fthRowElement.appendChild(fnameh);
				fthRowElement.appendChild(finfoh);
				ftableHElement.appendChild(fthRowElement);
			
				var ftableBodyElement = document.createElement("tbody");
				for (var z = 0; z < outcome.OUTCOME_FACTORS.length; z++) {
					factor = outcome.OUTCOME_FACTORS[z];
					var ftrElement = document.createElement("tr");
					var fname = document.createElement("td");
					var finfo = document.createElement("td");
					fname.innerHTML = factor.NAME;
					fname.className = 'cerner_outcomes_detail_row';
					var infoStr = "";
					for (var j = 0; j < factor.DETAILS.length; j++) {
						fdetail = factor.DETAILS[j];
						if (fdetail.DETAIL_TYPE == "INTERPRETATION_STRING") {
							if (infoStr.length == 0) {
								infoStr = fdetail.DETAIL_INFO;
							} else {
								infoStr = infoStr + "; " + fdetail.DETAIL_INFO;
							}
						} else if (fdetail.DETAIL_TYPE == "INTERPRETATION_NUMERIC") {
							if (infoStr.length == 0) {
								infoStr = fdetail.DETAIL_INFO;
							} else {
								infoStr = infoStr + "; " + fdetail.DETAIL_INFO;
							}
						} else if (fdetail.DETAIL_TYPE == "UNIT") {
							if (infoStr.length == 0) {
								infoStr = fdetail.DETAIL_INFO;
							} else {
								infoStr = infoStr + "; " + fdetail.DETAIL_INFO;
							}
						} else if (fdetail.DETAIL_TYPE == "FACT_IDENTIFIER") {
							infoStr = infoStr;
						} else if (fdetail.DETAIL_TYPE == "INTERPRETATION_BOOLEAN") {
							var iInd;
							if (fdetail.DETAIL_INFO == "false") {
								iInd = "No";
							} else {
								iInd = "Yes";
							}
							if (infoStr.length == 0) {
								infoStr = iInd;
							} else {
								infoStr = infoStr + "; " + iInd;
							}
						}
					}
					finfo.innerHTML = infoStr;
					finfo.className = 'cerner_outcomes_detail_row';
					ftrElement.appendChild(fname);
					ftrElement.appendChild(finfo);
					ftableBodyElement.appendChild(ftrElement);
				}
				ftableElement.appendChild(ftableHElement);
				ftableElement.appendChild(ftableBodyElement);
			
				trElement.setAttribute('data-factorInfo', ftableElement.outerHTML);
				var title = "Risk Score: " + num;
				trElement.setAttribute('data-factorTitle', title);
				trElement.className = 'cerner_cloud_outcomes';
				trElement.appendChild(oc);
				trElement.appendChild(dt);
				trElement.appendChild(sc);

				var clickHandler = function (event) {
					var factorInfo = event.currentTarget.getAttribute("data-factorInfo");
					var factorTitle = event.currentTarget.getAttribute("data-factorTitle");
					
					// pop-up for alert details
					cerner.cloud_outcomes_factors(factorInfo, factorTitle);
				};
				$(trElement).click(clickHandler);

				tableBodyElement.appendChild(trElement);
	}

	tableElement.appendChild(thElement);
	tableElement.appendChild(tableBodyElement);
	divElement.appendChild(tableElement);
	divElement.className = 'cerner_outcomes_div';

	if(outcomes.OUTCOMES.length > 0){
		contentArea.appendChild(divElement);
	} else {
		contentArea.innerHTML = "No results found";
	}
};

// factor details pop up dialog
cerner.cloud_outcomes_factors = function(factorInfo ,title){

	var factorInfoUtil = new ModalDialog("factorDetails")
			.setHeaderTitle(title)
			.setShowCloseIcon(true)
			.setTopMarginPercentage(15)
			.setRightMarginPercentage(30)
			.setBottomMarginPercentage(15)
			.setLeftMarginPercentage(30)
			.setIsBodySizeFixed(false)
			.setIsFooterAlwaysShown(true);

	factorInfoUtil.setBodyDataFunction(
		function(modalObj){
			modalObj.setBodyHTML(factorInfo);
		}
	);

	MP_ModalDialog.updateModalDialogObject(factorInfoUtil);
	MP_ModalDialog.showModalDialog(factorInfoUtil.getId());
};
