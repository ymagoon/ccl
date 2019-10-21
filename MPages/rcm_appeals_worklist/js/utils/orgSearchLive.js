function OrgServiceDelegate(){var that=this;
this.getResults=function(searchString,orgType,callback,orgSecurityInd,physicianInd){if(searchString.replace(/\s+/g,"").length<3){callback(new Array());
return;
}var json={RCM_ORG_REQUEST:{ORG_CDS:[{ORG_TYPE_CD:0}],ORG_TYPE_CODE:0,ORG_TEXT:searchString+"*",MAX:10,START_NUM:1,ORG_ALIAS:"",SEARCH_IND:1,MATCH_IND:"*",SHOW_UNAUTH:0,GROUPNAMEDISP:0,SHOW_INACTIVE:0,ZIP_CODE:"",FSCONTEXT:{CONTEXTLIST:[]},SEARCH_ALL_LOGICAL_DOMAINS_IND:0,PRSNL_ID:0,RCCLINIC_FLAG:0,FILTER_OUT_RCCLINIC_FLAG:0,SPONSOR_NAME_CONTAINS_IND:0,PARENT_ORG_ID:0,RCM_ORG_TYPE_MEANING:orgType}};
var requestArgs=[];
requestArgs.push("^MINE^","0.0","8","^"+JSON.stringify(json)+"^");
Search_Util.makeCCLRequest("rcm_searches",requestArgs,true,function(status,recordData){if("S"===status){var orgResults=[];
for(var i=0,length=recordData.ORGANIZATION.length;
i<length;
i++){var orgResult=recordData.ORGANIZATION[i];
orgResults.push({NAME:orgResult.ORG_NAME,VALUE:orgResult.ORGANIZATION_ID,DETAILS:""});
}callback(orgResults);
}else{if("F"===status||"Z"===status){callback(new Array());
}}});
};
}