/**
  Common functions for rxstation/omnicell/carefusion mPage to use
  29/01/2016 JL027904
*/

//A wrapper function that makes the XMLCclRequest call to ADM_ADAPTER_CCL_DRIVER to Get Adm Domain Type and examines the reply status before
//determining how to handle the reply.
function GetAdmDomainTypeCCLRequestWrapper(criterion) {
    var adm_domain_type = "UNDEFINED";
    var sendAr= [];
	
    var get_adm_domain_type_by_encounter_id_request = new Object();
    get_adm_domain_type_by_encounter_id_request.qualifiers = new Object();
    get_adm_domain_type_by_encounter_id_request.qualifiers.encounter_id = criterion.encntr_id + ".0";

    var json_object = new Object();
    json_object.get_adm_domain_type_by_encounter_id_request = get_adm_domain_type_by_encounter_id_request;

    var json_request = JSON.stringify(json_object);

    sendAr.push("^MINE^", "^GET_ADM_DOMAIN_DETAILS^", "^" + json_request + "^");
			
    var info = new XMLCclRequest();
    info.onreadystatechange = function () {
        //4 is completed and 200 is success
        if (info.readyState == 4 && info.status == 200) {
            try {
                var jsonEval = JSON.parse(info.responseText);
                var recordData = jsonEval.RECORD_DATA;
                if (recordData.STATUS_DATA.STATUS == "S") {	
                    adm_domain_type = jsonEval.RECORD_DATA.REPLY_DATA.ADM_TYPE_FLAG;	
                }
            } catch (err) {    
            } finally {
            }
        } 
    }
    //do a synchronized call to ccl script 
	//because need to wait on the result before rendering mPage
    info.open('GET', "ADM_ADAPTER_CCL_DRIVER",0);
    info.send(sendAr.join(","));
	
	//what if the value returned is not 0,1 or 2?
	if(adm_domain_type == "UNDEFINED" || adm_domain_type =="undefined"){
		return -1;//unknown adm_domain_type
	}

    return adm_domain_type;
}

//check the adm_domain_type for current encounter to determine if current mPage should be displayed
//-1 means adm_domain is not set, for passivity, display mPage if adm domain is not set
function validateAdmDomainTypeAndRenderBlankPage(mPageTitle,criterion){
	var adm_domain_type = GetAdmDomainTypeCCLRequestWrapper(criterion);
	if(adm_domain_type != m_adm_type && adm_domain_type != -1){
		MP_Util.Doc.PageNotAvailableLayout(mPageTitle);
		MP_Util.Doc.RenderLayout();
		return true;
	}else{
		return false;
	}
}