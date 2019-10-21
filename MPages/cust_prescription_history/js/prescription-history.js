MPage.namespace("cerner");

cerner.etreby_patientHistory=function(){};
cerner.etreby_patientHistory.prototype=new MPage.Component();
cerner.etreby_patientHistory.prototype.constructor=MPage.Component;
cerner.etreby_patientHistory.prototype.base=MPage.Component.prototype;
cerner.etreby_patientHistory.prototype.name="cerner.etreby_patientHistory";

cerner.etreby_patientHistory.prototype.init=function(options){};

cerner.etreby_drugHistory = function(drugId, callback){
	var histcomponent = this,
		request = new XMLHttpRequest(), 
		url = 'http://www.google.com';
		
	var url2 = drugId;

		
	request.open('GET', url2, true);
	
	request.setRequestHeader('resourcename', 'RxDetails');
	request.setRequestHeader('apikey', 'bf5488c6-5248-4104-97c5-3fd4fac92c14');

	request.onreadystatechange = function (event) {
		if (request.readyState === 4) {
			if (request.status === 200) {
				histcomponent.data = request.responseText;				
			} else {
				alert("Request status: " + request.status + "\nReponse text: " + request.responseText);
			}
			
			var histobj = JSON.parse(histcomponent.data);

			var htrElement = null;
			var htableElement = document.createElement("table");
			var hthElement = document.createElement('thead');
			var htableBodyElement = document.createElement("tbody");
			var sdh = document.createElement("th");
			var dqh = document.createElement("th");
			var dsh = document.createElement("th");
			sdh.innerHTML = "Service Date";
			sdh.className = 'cerner_etreby_history_header';
			dqh.innerHTML = "Dispensed Quantity";
			dqh.className = 'cerner_etreby_history_header';
			dsh.innerHTML = "Days Supply";
			dsh.className = 'cerner_etreby_history_header';
			hthElement.appendChild(sdh);
			hthElement.appendChild(dqh);
			hthElement.appendChild(dsh);

			for(var y = 0; y < histobj.ReFillDetails.length; y++){
				hist = histobj.ReFillDetails[y];
				var htrElement = document.createElement("tr");
				var sd = document.createElement("td");
				var dq = document.createElement("td");
				var ds = document.createElement("td");
				sd.innerHTML = hist.DateFilled;
				dq.innerHTML = hist.DispensedQty;
				ds.innerHTML = hist.DaysSupply;
				htrElement.appendChild(sd);
				htrElement.appendChild(dq);
				htrElement.appendChild(ds);

				htableBodyElement.appendChild(htrElement);
			}

			htableElement.appendChild(hthElement);
			htableElement.appendChild(htableBodyElement);

			// pop up dialog box
			var drugHistoryUtil = new ModalDialog("drugHistory")
			.setHeaderTitle('Prescription Refill History')
			.setShowCloseIcon(true)
			.setTopMarginPercentage(15)
			.setRightMarginPercentage(30)
			.setBottomMarginPercentage(15)
			.setLeftMarginPercentage(30)
			.setIsBodySizeFixed(false)
			.setIsFooterAlwaysShown(true);

			drugHistoryUtil.setBodyDataFunction(
				function(modalObj){
					modalObj.setBodyHTML('<table>' + htableElement.innerHTML + '</table>');
				}
			);

			MP_ModalDialog.updateModalDialogObject(drugHistoryUtil);
			MP_ModalDialog.showModalDialog(drugHistoryUtil.getId());
			callback(histcomponent);
		}
	};
	
	request.send(null);
};

cerner.etreby_patientHistory.prototype.render=function(){
	var contentArea = this.getTarget();
	var pui;
	var lastName;
	var firstName;
	var dob;
	var alias;

	//UNIQUE IDENTIFIER TYPE
	//used to get unique alias in millennium
	//populate identifierType variable below with display_key from codeset 263 for client defined alias (MRN, etc...)
	//if using person id rather than an alias, leave the variable empty (ex. var identifierType = "";)
	var identifierType = ""; //"BWMCMRN";

	//ETREBY SERVICE QUERY PARAMTER
	//used to get unique identifier in etreby database
	//populate puiFieldName varaible below with etreby defined alias values (MRN, etc...)
	//if using person id rather than an alias, leave the variable empty (ex. var puiFieldName = "";)
	var puiFieldName = ""; //"MRN";
	
	var cclRequest = new XMLCclRequest();
	var cclScriptName = "MP_GET_ETREBY_PATIENT";
	var params =  "^MINE^," + this.getProperty("personId") + ".0,^" + identifierType + "^";
	cclRequest.open('GET', cclScriptName, 0);
	cclRequest.send(params);
	if (cclRequest.status === 200) {
		var json = JSON.parse(cclRequest.responseText);
		lastName = json.PATIENTINFO.LAST_NAME;
		firstName = json.PATIENTINFO.FIRST_NAME;
		dob = json.PATIENTINFO.DOB;
		if (identifierType.length > 0) {
			alias = json.PATIENTINFO.ALIAS;
		} else {
			alias = this.getProperty("personId")
		}
	}

	//load patient drugs
	var dateString;
	var currentDate = new Date();
	var newDate = new Date(currentDate - (1000*60*60*24*730)); // SET LOOKBACK DAYS HERE -- currently set to 730 days (2 years)
	var day = newDate.getDate();
	var month = newDate.getMonth()+1;
	var year = newDate.getFullYear();
	dateString = (month<=9?'0'+month:month) + '/' + (day<=9?'0'+day:day) + '/' + year;
	var drugParams;
	if (identifierType.length > 0) {
		drugParams = '{"firstName":"' + firstName + '","lastName":"' + lastName + '","dob":"' + dob + '","pui":"' + alias + '","puiFieldName":"' + puiFieldName + '","startDate":"' + dateString + '"}';
	} else {
		drugParams = '{"firstName":"' + firstName + '","lastName":"' + lastName + '","dob":"' + dob + '","pui":"' + alias + '","startDate":"' + dateString + '"}';
	}
	
	var mycomponent = this,
		request = new XMLHttpRequest(), 
		url = 'https://65.197.204.86:2048/ce-json';
		
	var url2 = 'https://65.197.204.86:2048/ce-json';		
	request.open('GET', url2, true);
	
	request.setRequestHeader('apikey', 'bf5488c6-5248-4104-97c5-3fd4fac92c14');
	request.setRequestHeader('resourcename', 'PatientDrugHistory');
	request.setRequestHeader('resourceparams', drugParams);

	var errorString;
	var ErrorMessage;
	request.onreadystatechange = function (event) {
		var successInd = false;
		if (request.readyState === 4) {
			if (request.status === 200) {
				mycomponent.data = request.responseText;
				var medobj = JSON.parse(mycomponent.data);
				successInd = true;
			} else {
				errorString = request.responseText;
				var m = errorString.length;
				var n = errorString.indexOf("Message");
				errorMessage = errorString.substring(n+12,m-4);
			}

			var trElement = null;
			var divElement = document.createElement("div");
			var tableElement = document.createElement("table");
			var thElement = document.createElement('thead');
			var tableBodyElement = document.createElement("tbody");
			var rxh = document.createElement("th");
			var dwh = document.createElement("th");
			var fsh = document.createElement("th");
			var lsh = document.createElement("th");
			var dnh = document.createElement("th");
			var pdh = document.createElement("th");
			var pqh = document.createElement("th");
			var ddh = document.createElement("th");
			var dqh = document.createElement("th");
			var rah = document.createElement("th");
			var rrh = document.createElement("th");
			var sgh = document.createElement("th");
			var pth = document.createElement("th");
			rxh.innerHTML = "Rx Number";
			rxh.className = 'cerner_etreby_header';
			dwh.innerHTML = "Date Written";
			dwh.className = 'cerner_etreby_header';
			fsh.innerHTML = "First Service Date";
			fsh.className = 'cerner_etreby_header';
			lsh.innerHTML = "Last Service Date";
			lsh.className = 'cerner_etreby_header';
			dnh.innerHTML = "Doctor Name";
			dnh.className = 'cerner_etreby_header';
			pdh.innerHTML = "Prescribed Drug";
			pdh.className = 'cerner_etreby_header';
			pqh.innerHTML = "Prescribed Quantity";
			pqh.className = 'cerner_etreby_header';
			ddh.innerHTML = "Dispensed Drug";
			ddh.className = 'cerner_etreby_header';
			dqh.innerHTML = "Dispensed Quantity";
			dqh.className = 'cerner_etreby_header';
			rah.innerHTML = "Refills";
			rah.className = 'cerner_etreby_header';
			rrh.innerHTML = "Remaining Refills";
			rrh.className = 'cerner_etreby_header';
			sgh.innerHTML = "SIG";
			sgh.className = 'cerner_etreby_header';
			pth.innerHTML = "Prescription Type";
			pth.className = 'cerner_etreby_header';
			thElement.appendChild(rxh);
			thElement.appendChild(dwh);
			thElement.appendChild(fsh);
			thElement.appendChild(lsh);
			thElement.appendChild(dnh);
			thElement.appendChild(pdh);
			thElement.appendChild(pqh);
			thElement.appendChild(ddh);
			thElement.appendChild(dqh);
			thElement.appendChild(rah);
			thElement.appendChild(rrh);
			thElement.appendChild(sgh);
			thElement.appendChild(pth);

			if (successInd === true) {
				for(var x = 0; x < medobj.PatientPrescriptions.length; x++){
					medication = medobj.PatientPrescriptions[x];
					var trElement = document.createElement("tr");
					var rx = document.createElement("td");
					var dw = document.createElement("td");
					var fs = document.createElement("td");
					var ls = document.createElement("td");
					var dn = document.createElement("td");
					var pd = document.createElement("td");
					var pq = document.createElement("td");
					var dd = document.createElement("td");
					var dq = document.createElement("td");
					var ra = document.createElement("td");
					var rr = document.createElement("td");
					var sg = document.createElement("td");
					var pt = document.createElement("td");
					rx.innerHTML = medication.RxNumber;
					rx.className = 'cerner_etreby_row';
					dw.innerHTML = medication.DateWritten;
					dw.className = 'cerner_etreby_row';
					fs.innerHTML = medication.FirstServiceDate;
					fs.className = 'cerner_etreby_row';
					ls.innerHTML = medication.LastServiceDate;
					ls.className = 'cerner_etreby_row';
					dn.innerHTML = medication.DoctorName;
					dn.className = 'cerner_etreby_row';
					pd.innerHTML = medication.PrescribedDrug;
					pd.className = 'cerner_etreby_row';
					pq.innerHTML = medication.PrescribedQty;
					pq.className = 'cerner_etreby_row';
					dd.innerHTML = medication.DispensedDrug;
					dd.className = 'cerner_etreby_row';
					dq.innerHTML = medication.DispensedQty;
					dq.className = 'cerner_etreby_row';
					ra.innerHTML = medication.RefillsAuthQty;
					ra.className = 'cerner_etreby_row';
					rr.innerHTML = medication.RemainingRefills;
					rr.className = 'cerner_etreby_row';
					sg.innerHTML = medication.Sig;
					sg.className = 'cerner_etreby_row';
					pt.innerHTML = medication.PrescriptionType;
					pt.className = 'cerner_etreby_row';
					trElement.setAttribute('data-drugId', medication.RxDetailsLink);
					trElement.className = 'cerner_etreby';
					trElement.appendChild(rx);
					trElement.appendChild(dw);
					trElement.appendChild(fs);
					trElement.appendChild(ls);
					trElement.appendChild(dn);
					trElement.appendChild(pd);
					trElement.appendChild(pq);
					trElement.appendChild(dd);
					trElement.appendChild(dq);
					trElement.appendChild(ra);
					trElement.appendChild(rr);
					trElement.appendChild(sg);
					trElement.appendChild(pt);
										
					var clickHandler = function (event) {
						var drugId = event.currentTarget.getAttribute("data-drugId");
						var hist;
						// get data based on drugId
						cerner.etreby_drugHistory(drugId, function(){});
					};
					$(trElement).click(clickHandler);

					tableBodyElement.appendChild(trElement);
				}
							
				tableElement.appendChild(thElement);
				tableElement.appendChild(tableBodyElement);
				divElement.appendChild(tableElement);
				divElement.className = 'cerner_etreby_div';
							
				if (medobj.PatientPrescriptions.length > 0){
					contentArea.appendChild(divElement);
				} else {
					contentArea.innerHTML = "No prescription history data found for this person";
				}
			} else {
				contentArea.innerHTML = errorMessage;
			}
		}
	};
	request.send(null);
};
