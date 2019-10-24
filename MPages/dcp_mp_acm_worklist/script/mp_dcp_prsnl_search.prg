drop program mp_dcp_prsnl_search:dba go
create program mp_dcp_prsnl_search:dba
 
PROMPT "Output to File/Printer/MINE" ="MINE",
"JSON_ARGS:" = ""
WITH OUTDEV, JSON_ARGS
 
free record request
record request
(
  1 max             	 = i4
  1 name_last_key  		 = c100
  1 name_first_key  	 = c100
  1 search_str_ind    	 = i2
  1 search_str			 = vc
  1 title_str			 = vc
  1 suffix_str		 	 = vc
  1 degree_str			 = vc
  1 use_org_security_ind = i2
  1 organization_id      = f8
  1 organizations[*]
    2 organization_id    = f8
  1 context_ind			 = i2
  1 start_name        	 = vc
  1 start_name_first  	 = vc
  1 context_person_id 	 = f8
  1 physician_ind   	 = i2
  1 ft_ind         		 = i2
  1 non_ft_ind      	 = i2
  1 inactive_ind    	 = i2
  1 prsnl_group_id  	 = f8
  1 location_cd     	 = f8
  1 return_aliases       = i2
  1 return_orgs          = i2
  1 return_services      = i2
  1 alias_type_list		 = vc
  1 priv[*]
    2 privilege    		 = c12
  1 auth_only_ind		 = i2
  1 provider_filter[*]
    2 filter_name        = vc
    2 filter_data[*]
    	3 data_id	 	 = f8
)
 
free record reply
record reply
(  1 prsnl_cnt                      =     i4.0
   1 maxqual          				=     i4
   1 more_exist_ind                 =     i2.0
   1 context_ind			 		= 	  i2
   1 start_name        	 			=     vc
   1 start_name_first  	 			= 	  vc
   1 context_person_id 	 			=     f8
   1 search_name_first				= 	  vc
   1 search_name_last				=     vc
   1 prsnl[*]
     2 person_id                    =     f8.0
     2 name_last_key                =     c100.0
     2 name_first_key               =     c100.0
     2 prsnl_type_cd                =     f8.0
     2 name_full_formatted          =     c100.0
     2 password                     =     c100.0
     2 email                        =     c100.0
     2 physician_ind                =     i2.0
     2 position_cd                  =     f8.0
     2 department_cd                =     f8.0
     2 free_text_ind                =     i2.0
     2 section_cd                   =     f8.0
     2 contributor_system_cd        =     f8.0
     2 name_last                    =     c200.0
     2 name_first                   =     c200.0
     2 username                     =     c50.0
     2 service[*]
        3 service_desc_id           =     f8.0
        3 service_desc_name         =     c40.0
     2 org[*]
        3 org_id                    =     f8.0
        3 org_name                  =     c40.0
     2 prsnl_alias[*]
        3 prsnl_alias_id            =     f8.0
        3 alias_pool_cd             =     f8.0
        3 alias_pool_disp           =     c40.0
        3 alias                     =     c100.0
     2 positions[*]
     	3 position_cd				=	  f8
     	3 position_disp				=     vc
   1 status_data
     2  status                      =     c1.0
     2  subeventstatus[1]
        3  OperationName            =     c15.0
        3  OperationStatus          =     c1.0
        3  TargetObjectName         =     c15.0
        3  TargetObjectValue        =     c100.0
)
 
%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))
 
call echorecord(request)
 
execute ocx_get_providers_by_name
 
call echorecord(reply)
set _MEMORY_REPLY_STRING = CNVTRECTOJSON(reply)
 
end go
