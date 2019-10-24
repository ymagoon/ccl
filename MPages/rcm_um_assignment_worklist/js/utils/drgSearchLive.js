function DrgServiceDelegate(){this.getResults=function(searchString,callback){var json={drg_search_request:{search_phrase:searchString,term_limit:0}};
var sendAr=[];
sendAr.push("^MINE^","0.0","3","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){var drgResults=new Array();
for(var i=0,length=recordData.TERMS.length;
i<length;
i++){var drg=recordData.TERMS[i];
drgResults.push({NAME:drg.TERM+" ("+drg.CODE+")",VALUE:{SOURCEIDENTIFIER:drg.CODE,NOMENCLATUREID:drg.NOMENCLATURE_ID},DETAILS:"<strong>Description</strong>: <dfn>"+drg.TERM+"</dfn><br><strong>Code</strong>: <em>"+drg.CODE+"</em>"});
}callback(drgResults);
}else{if("F"===status){if(recordData){alert(recordData);
}}}});
};
}