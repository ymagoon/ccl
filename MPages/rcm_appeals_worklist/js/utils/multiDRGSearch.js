function NomenclatureSearchByName(searchTerm,terminologyCD,isContains,callback,failureCallback){var terminologyJson=[{terminology_cd:terminologyCD}];
var searchType=isContains?3:1;
var json={nomenclature_search_request:{search_type_flag:searchType,preferred_type_flag:1,search_string:searchTerm,terminology_cds:terminologyJson,terminology_axis_cds:[],principle_type_cds:[],max_results:20,effective_flag:0,active_flag:0}};
var sendAr=[];
sendAr.push("^MINE^","0.0","5","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){if(recordData){var drgResults=new Array();
for(var i=0,length=recordData.NOMENCLATURES.length;
i<length;
i++){var drg=recordData.NOMENCLATURES[i];
drgResults.push({NAME:drg.DESCRIPTION+" ("+drg.SOURCE_IDENTIFIER+")",VALUE:{SOURCEIDENTIFIER:drg.SOURCE_IDENTIFIER,NOMENCLATUREID:drg.NOMENCLATURE_ID},DETAILS:"<strong>Description</strong>: <dfn>"+drg.DESCRIPTION+"</dfn><br><strong>Code</strong>: <em>"+drg.SOURCE_IDENTIFIER+"</em>"});
}callback(drgResults);
}}else{if("Z"===status){callback();
}else{if("F"===status){failureCallback();
}}}});
}function NomenclatureSearchByCode(searchTerm,terminologyCD,callback,failureCallback){var terminologyJson=[{terminology_cd:terminologyCD}];
var json={nomenclature_search_request:{search_type_flag:1,preferred_type_flag:1,search_string:searchTerm,terminology_cds:terminologyJson,terminology_axis_cds:[],principle_type_cds:[],max_results:20,effective_flag:0,active_flag:0}};
var sendAr=[];
sendAr.push("^MINE^","0.0","6","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){if(recordData){var drgResults=new Array();
for(var i=0,length=recordData.NOMENCLATURES.length;
i<length;
i++){var drg=recordData.NOMENCLATURES[i];
drgResults.push({NAME:drg.DESCRIPTION+" ("+drg.SOURCE_IDENTIFIER+")",VALUE:{SOURCEIDENTIFIER:drg.SOURCE_IDENTIFIER,NOMENCLATUREID:drg.NOMENCLATURE_ID},DETAILS:"<strong>Description</strong>: <dfn>"+drg.DESCRIPTION+"</dfn><br><strong>Code</strong>: <em>"+drg.SOURCE_IDENTIFIER+"</em>"});
}callback(drgResults);
}}else{if("Z"===status){callback();
}else{if("F"===status){failureCallback();
}}}});
}