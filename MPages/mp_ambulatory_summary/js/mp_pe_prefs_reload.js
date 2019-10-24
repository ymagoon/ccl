$(function() {
    var personId = $('#person_id').text();
	var userId = $('#user_id').text();
	var encntrId = $('#encntr_id').text();
	var appName = $('#app_name').text();
	var posCode = $('#pos_code').text();
	var pprCode = $('#ppr_code').text();
	paramString = "^MINE^," + personId + "," + userId + "," + encntrId + ",^" + appName + "^," + posCode + "," + pprCode;
	javascript:CCLLINK('mp_pe_clin_smry', paramString ,1)
});