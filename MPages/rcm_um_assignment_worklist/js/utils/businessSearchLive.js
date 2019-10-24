function BusinessServiceDelegate(){this.getResults=function(parentOrgId,orgTypeCds,childOrgAddressTypeMeaning,searchString,callback){var childOrgTypeCdsJson=[];
for(var i=0;
i<orgTypeCds.length;
i++){childOrgTypeCdsJson.push({ORG_TYPE_CD:orgTypeCds[i].toFixed(1)});
}var json={BUSINESS_SEARCH_REQUEST:{PARENT_ORG_ID:parentOrgId.toFixed(1),CHILD_ORG_ADDRESS_TYPE_MEANING:childOrgAddressTypeMeaning,CHILD_ORG_PHONE_TYPE_MEANING:"",SERVICES_IND:0,CHILD_ORG_TYPES:childOrgTypeCdsJson}};
var sendAr=[];
sendAr.push("^MINE^","0.0","2","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",sendAr,true,function(status,recordData){if("S"===status){var orgResults=new Array();
for(var i=0,length=recordData.CHILD_ORGS.length;
i<length;
i++){var child_org=recordData.CHILD_ORGS[i];
orgResults.push({NAME:child_org.ORG_NAME,VALUE:child_org.ORGANIZATION_ID,DETAILS:child_org.ORG_FORMATTED_ADDRESS});
}callback(orgResults);
}else{if("F"===status){if(recordData){alert(recordData);
}}}});
};
}