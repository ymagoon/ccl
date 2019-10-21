var cur_params = window.location.search.replace(/%20/g, " ").split("?").join("").split(",")
var m_orderCki = cur_params[0];
var m_orderId = cur_params[1];
var m_orderName = cur_params[2];
var m_catalogCd = cur_params[3];
var m_personId = cur_params[4];
var m_encounterId = cur_params[5];
var m_LeafletLoaded = false;
var m_DrugReferenceLoaded = false;
var m_ReferenceLoaded = false;
var m_CurTab = 0;
var m_FormObject = null;
window.onload = function(){
    var tabLayout;
	var alertElem = null;
    tabLayout = new TabLayout().generateLayout({
        "defaultTab": "0",
        "tabsHeader": ["Drug Reference", "Education Leaflet", "Reference"],
        "tabsContentLoad": [loadDrugReference, loadEducationLeaflet, loadReference]
    });
	if (doAlertsExist(m_orderId)) {
		var alertElem = Util.ce("span");
		alertElem.innerHTML = "<a class='inter-alert-hist' onclick=showAlertHistory(" + m_orderId + ") > Alert History for "+ m_orderName + "</a>";
	}
	tabLayout.style.display = "none";
    Util.ac(tabLayout, document.body);
	tabLayout.style.display = "block";
	if(alertElem){
		Util.ac(alertElem, document.body);
	}
}	

function loadDrugReference(tabContentDOM){
	m_CurTab = 0;
    if (!m_DrugReferenceLoaded) {
        //tabContentDOM.innerHTML = getAllClinText();
		/*-----------------*/
		var iFrameE = _g('drugRefFrame');
		var allClinText = getAllClinText();
	    window.frames['drug-ref-frame'].document.body.innerHTML = allClinText; 
	    iFrameE.style.height = "100%";
	    iFrameE.style.width = "100%";
	    iFrameE.style.display = "inline";
	     Util.ac(iFrameE, tabContentDOM);
		/*--------------------*/
        m_DrugReferenceLoaded = true;
    }
}

function loadEducationLeaflet(tabContentDOM){
	m_CurTab = 1;
    if (!m_LeafletLoaded) {
		var langSel = Util.ce("div");
		langSel.className = 'inter-lang-sel';
		langSel.innerHTML = "<input id='interLeafLangEng' onclick='changeEducationLeaflet(this)' type='radio' checked='checked' name='lang-sel' /><span> English</span> <input id='interLeafLangSp' onclick='changeEducationLeaflet(this)' type='radio' name='lang-sel'><span> Spanish</span>"
        var sHTML = buildEducationLeaflet('EN');
		Util.ac(langSel, tabContentDOM);
        Util.ac(sHTML, tabContentDOM);
        m_LeafletLoaded = true;
    }
    
}

function changeEducationLeaflet(radioElem){
	if(radioElem.checked){
		if(radioElem.id == 'interLeafLangEng'){
			buildEducationLeaflet('EN');
		}
		if(radioElem.id == 'interLeafLangSp' ){
			buildEducationLeaflet('SP');
		}
	}
}

function loadReference(tabContentDOM){
	m_CurTab = 2;
	if (!m_ReferenceLoaded) {
		var refHTML = getRefText();
		
		var iFrameE = _g('refFrame');;
		window.frames['ref-frame'].document.body.innerHTML = refHTML;
		iFrameE.style.height = "100%";
		iFrameE.style.width = "100%";
		iFrameE.style.display = "inline";
		Util.ac(iFrameE, tabContentDOM);
		/*--------------------*/
		m_ReferenceLoaded = true;
	}
}

function buildEducationLeaflet(lang){
    var orderCki = m_orderCki
	if (m_FormObject == null) {
		try {
			m_FormObject = window.external.DiscernObjectFactory("DISCERNMULTUMCOM");
		} 
		catch (e) {
		
		}
	}
    if (m_FormObject) {
        var sHtmlFile = m_FormObject.DiscernGetHTMLLeaflets(orderCki, lang);
    }
    else {
        return ("<span>Failed to initialize DISCERNMULTUMCOM!</span>")
    }
    var iFrameE = _g('leafletFrame');
	if (sHtmlFile.length > 0) {
		var errDiv = _g("errorDiv");
		if(errDiv){
			Util.de(errDiv);
		}
		sHtmlFile = sHtmlFile.replace(/\\/gi, "\\\\")
		sHtmlFile = sHtmlFile.replace(/\//gi, "\\\\")
		iFrameE.src = "\\" + sHtmlFile;
		iFrameE.style.height = "95%";
		iFrameE.style.width = "99%";
		iFrameE.style.display = "inline";
	}
	else{
		var errDiv = Util.ce("div");
		errDiv.innerHTML = "No Leaflet found."
		errDiv.id = "errorDiv";
		iFrameE.src = "";		
		iFrameE.style.display = "none";
		Util.ia(errDiv, iFrameE)
	}
    return (iFrameE);
    
    
}

function getClinText(sType){
    var ckiValue = m_orderCki;
   if (m_FormObject == null) {
		try {
			m_FormObject = window.external.DiscernObjectFactory("DISCERNMULTUMCOM");
		} 
		catch (e) {
		
		}
	}
    if (m_FormObject) {
        var sClinText = m_FormObject.DiscernGetClinicalText(ckiValue, sType);
        return (sClinText);
    }
    else {
        alert("Failed to initialize DISCERNMULTUMCOM!");
    }
}

function getAllClinText(){
    var clinTextTypes = ["DOSAGE","DOSAGEADDITIONAL","PHARMACOLOGY", "WARNINGS", "PREGNANCY", "LACTATION", "SIDEFFECTS", "IVCOMPAT"];
    var clinText = [];
    for (var i = 0, il = clinTextTypes.length; i < il; i++) {
        clinText.push(getClinText(clinTextTypes[i]));
    }
	var clinTextHTML = clinText.join("");
	if (clinTextHTML.length > 0) {
		return (clinTextHTML);
	}
	else{
		return ("No Drug Reference found");
	}
    
}

function doAlertsExist(orderId){
    if (m_FormObject == null) {
		try {
			m_FormObject = window.external.DiscernObjectFactory("DISCERNMULTUMCOM");
		} 
		catch (e) {
		
		}
	}
    var alertExists = false;
    if (m_FormObject) {
        alertExists = m_FormObject.DiscernCheckAlertsExist(orderId, 0);
    }
    else {
        alert("Failed to initialize DISCERNMULTUMCOM!");
    }
    return (alertExists);
}
    
function showAlertHistory(orderId){

    if (m_FormObject == null) {
		try {
			m_FormObject = window.external.DiscernObjectFactory("DISCERNMULTUMCOM");
		} 
		catch (e) {
		
		}
	}
    if (m_FormObject) {
        m_FormObject.DiscernShowAlertHistory(orderId, 0, 0);
    }
    else {
        alert("Failed to initialize DISCERNMULTUMCOM!");
    }
}

function getRefText(){
    var refTextArray = [];
    var info = new XMLCclRequest();
    info.onreadystatechange = function(){
        var errMsg = null;
        if (this.readyState == 4 && this.status == 200) {
            try {
                var jsonParser = new UtilJsonXml();
                //alert(this.responseText);
                var recordData = jsonParser.parse_json(this.responseText).REPORT_DATA;
                if (recordData.STATUS_DATA.STATUS == "Z") {
                    refTextArray.push("No Reference Text");
                }
                else 
                    if (recordData.STATUS_DATA.STATUS == "S") {
                        var refTextList = recordData.REF_TEXT_LIST
                        for (var i = 0, il = refTextList.length; i < il; i++) {
                            refTextArray.push("<div style=' padding:10px 0 10px 0;' ><div><span style='font-weight:bold;' >", refTextList[i].TEXT_TYPE_DISP, " </span></div>", "<div><span style='padding-left:10px;' >", refTextList[i].LONG_BLOB, "</span></div></div>");
                        }
                        
                    }
                    else {
                        refTextArray.push("Error Retrieving Reference Text");
                    }
            } 
            catch (err) {
                refTextArray.push("Error Retrieving Reference Text");
            }
        }
        else 
            if (this.readyState == 4 && this.status != 200) {
                refTextArray.push("Error Retrieving Reference Text");
            }
    };
    info.open('GET', 'inn_get_ref_text_json', false);
    info.send("^MINE^," + m_personId + "," + m_encounterId + "," + m_catalogCd + ", ^ORDER_CATALOG^");
    return (refTextArray.join(""));
}


function printIFrame(){
	if (m_CurTab == 1) {
		document.frames['leaflet-frame'].focus();
	}
	else if(m_CurTab == 0){
		document.frames['drug-ref-frame'].focus();
	}
	else if(m_CurTab == 2){
		document.frames['ref-frame'].focus();
	}
	
    window.print();
}



