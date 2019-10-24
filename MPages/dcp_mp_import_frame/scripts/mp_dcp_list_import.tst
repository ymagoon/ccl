;**********************************************
;Declare Variables
;**********************************************
declare tstACTION_MEAN = vc go
declare tstPRSNL_ID = f8 with noconstant (0.0) go
declare tstREGISTRY_ID = f8 with noconstant (0.0) go
declare debug_mode = i4 with noconstant(1) go

/***********************************************
Available ACTION_MEANs
    *Required and Optional fields are listed below for the given actions. 
        - All object fields outside of the Required and optional must still be present in the object. 

    * "AUDIT"- Performing person, condition matching, success/failured counts and groups
    
        **IMPORT_DATA on Audit is a parsed version of the imported CSV, on Audit the file is scrub for duplicates. If found
        those records are removed from IMPORT_DATA and added to IMPORT_DUP. Do NOT fill in object fields for IMPORT_DUP
        
        Required
            -CONDITION
            -LAST_NAME
            -FIRST_NAME
            -GENDER
            -DOB
            -ORGANIZATION_ID
            -LOCATION_CD; set as 0 if not needed
            -DUP_ID ;sequence of record 1,2,3...
        Optional
            -MIDDLE_NAME
            -MRN
    "COMMIT":
        Required
            -CONDITION_ID
            -MATCH_PERSON_ID   
            -ORGANIZATION_ID
            -LOCATION_CD -- set as 0 if not needed
            -IGNORE_IND -- 1 ignore, 0 process
            -DUP_IND -- 1 duplicate & skip, 0 process       
    "INACTIVATE"
        Required
            -ORGANIZATION_ID
            -AC_CLASS_PERSON_RELTN_ID
            -DELETE_IND -- 1 inactivate record, 0 skip
    "QUERYDATA"	
        Required
            -ORGANIZATION_ID
    "TEMPLATE"
        -No request structure required
    "EXPORT" --NOT currently implemented        
***********************************************/

;**********************************************
;AUDIT and COMMIT ACTION_MEAN request->blob_in
;**********************************************
/*
set tstACTION_MEAN = "AUDIT" go
;set tstACTION_MEAN = "COMMIT" go 

free record request go
record request(
    1 blob_in = vc
) go

set request->blob_in =
^{"IMPORT_CSV":\
    {"IMPORT_DATA":\
        [{\     
        "CONDITION_ID":null,\
        "MATCH_PERSON_ID":null,\   
        "NAME_FULL_FORMATTED":"",\
        "IGNORE_IND":0,\      
        "DUP_IND":null,\ 
        "INDEPENDENT_PARENT_IND":null,\ 
        "AC_CLASS_PERSON_RELTN_ID":null,\
        "INSERT_REG_IND":null,\
        "INSERT_CON_IND":null,\
        "PARENT_CLASS_PERSON_RELTN_ID":null,\       
        "UPDATE_REG_IND":null,\
        "UPDATE_CON_IND":null,\
        "GROUPID":null,\
        "CONDITION":"ASTHMA",\
        "LAST_NAME":"MMF",\
        "FIRST_NAME":"TESTING",\
        "MIDDLE_NAME":"",\
        "GENDER":"Male",\
        "DOB":"11-18-1992",\
        "MRN":"",\
        "SELECTED_IND":null,\
        "DUP_ID":null,\
        }],\ 
    "IMPORT_DUP":\
        [{\     
        "CONDITION_ID":null,\
        "MATCH_PERSON_ID":null,\   
        "NAME_FULL_FORMATTED":"",\
        "IGNORE_IND":null,\     
        "DUP_IND":null,\
        "INDEPENDENT_PARENT_IND":null,\ 
        "AC_CLASS_PERSON_RELTN_ID":null,\
        "INSERT_REG_IND":null,\
        "INSERT_CON_IND":null,\      
        "PARENT_CLASS_PERSON_RELTN_ID":null,\        
        "UPDATE_REG_IND":null,\
        "UPDATE_CON_IND":null,\
        "GROUPID":null,\
        "CONDITION":"",\
        "LAST_NAME":"",\
        "FIRST_NAME":"",\
        "MIDDLE_NAME":"",\
        "GENDER":"",\
        "DOB":"",\
        "MRN":"",\
        "SELECTED_IND":null,\
        "DUP_ID":null,\
        }],\         
    "CSV_FAILURE_IND":null,\
    "SUCCESS_CNT":null,\
    "FAILURE_CNT":null,\
    "ORGANIZATION_ID":900296.0,\
    "LOCATION_CD":0.0\
   }\
}^ go
*/

;*****************************************
;PERSLOOKUP ACTION_MEAN request->blob_in
;*****************************************
/* 
set tstACTION_MEAN = "PERSLOOKUP" go

free record request go
record request(
    1 blob_in = vc
) go

set request->blob_in =
^{"PERS_LOOKUP":{\
    "SELECT_PERSON_ID":null,\
    "NAME_FULL_FORMATTED":"",\
    "MATCH_PERSON_ID":null,\
    "LAST_NAME":"",\
    "FIRST_NAME":"",\
    "MIDDLE_NAME":"",\
    "GENDER":"",\
    "DOB":"",\
    "MRN":""\
   }\
}^ go
*/

;*****************************************
;INACTIVATE ACTION_MEAN request->blob_in
;*****************************************
/*
set tstACTION_MEAN = "INACTIVATE" go

free record request go
record request(
    1 blob_in = vc
) go

set request->blob_in =
^{"IMPORT_CSV":\
    {"IMPORT_DATA":\
        [{\
        "AC_CLASS_PERSON_RELTN_ID":null,\
        "PARENT_CLASS_PERSON_RELTN_ID":null,\   
        "INDEPENDENT_PARENT_IND":null,\  
        "MATCH_PERSON_ID":null,\    
        "CONDITION":"",\
        "REGISTRY":"",\
        "NAME_FULL_FORMATTED":"",\
        "GENDER":"",\
        "DOB":"",\
        "MRN":"",\
        "IMPORT_DT_TM":"",\
        "DELETE_IND":null,\
        "LOCATION_NAME":"",\
        "LAST_NAME":"",\
        "FIRST_NAME":"",\        
        "MIDDLE_NAME":"",\
        }],\   
    "ORGANIZATION_ID":null\        
   }\
}^ go
*/

;*****************************************
;QUERYDATA ACTION_MEAN request->blob_in
;*****************************************
/*
set tstACTION_MEAN = "QUERYDATA" go

free record request go
record request(
    1 blob_in = vc
) go

set request->blob_in =
^{"IMPORT_CSV":{\
    "ORGANIZATION_ID":900296.0\
	}\
}^ go
*/       

;*****************************************
;TEMPLATE ACTION_MEAN
;*****************************************
/*
set tstACTION_MEAN = "TEMPLATE" go
;REGISTRY_ID can be set to 0
*/

;************************************
;PRSNL_ID & LOGICAL_DOMAIN_ID Query
;************************************
/*
select
pr.person_id,
pr.logical_domain_id,
pr.name_full_formatted
from 
prsnl pr
where pr.username = "ACM1"
and pr.active_ind = 1
*/

set tstPRSNL_ID = <PERSON_ID> go

;******************************
;Available Registry_IDs Query
;******************************
/*
select 
acd.ac_class_def_id,
acd.class_display_name
from
ac_class_def acd
Plan acd
    where acd.class_type_flag = 1;Registry
    and acd.logical_domain_id = <LOGICAL_DOMAIN_ID>
    and acd.active_ind = 1
    and acd.end_effective_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")
order cnvtupper(acd.class_display_name)
*/

set tstREGISTRY_ID = <REGISTRY_ID> go

;******************************
;Execute Test
;******************************
execute mp_dcp_import_list "MINE",tstACTION_MEAN,tstREGISTRY_ID,tstPRSNL_ID go
