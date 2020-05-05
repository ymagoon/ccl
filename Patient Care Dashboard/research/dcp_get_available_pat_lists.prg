DROP PROGRAM dcp_get_available_pat_lists :dba GO
CREATE PROGRAM dcp_get_available_pat_lists :dba
 RECORD reply (
   1 patient_lists [* ]
     2 patient_list_id = f8
     2 name = vc
     2 description = vc
     2 patient_list_type_cd = f8
     2 owner_id = f8
     2 list_access_cd = f8
     2 arguments [* ]
       3 argument_name = vc
       3 argument_value = vc
       3 parent_entity_name = vc
       3 parent_entity_id = f8
     2 encntr_type_filters [* ]
       3 encntr_type_cd = f8
       3 encntr_class_cd = f8
     2 proxies [* ]
       3 prsnl_id = f8
       3 prsnl_group_id = f8
       3 list_access_cd = f8
       3 beg_effective_dt_tm = dq8
       3 end_effective_dt_tm = dq8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 SET reply->status_data.status = "F"
 DECLARE counter = i4 WITH noconstant (0 )
 DECLARE owner_cd = f8 WITH constant (uar_get_code_by ("MEANING" ,27380 ,"OWNER" ) )
 DECLARE arg_ctr = i4 WITH noconstant (0 )
 DECLARE encntr_ctr = i4 WITH noconstant (0 )
 DECLARE reltn_ctr = i4 WITH noconstant (0 )
 SELECT INTO "nl:"
  FROM (dcp_patient_list pl ),
   (dcp_pl_argument pa ),
   (dcp_pl_encntr_filter pe ),
   (dcp_pl_reltn pr )
  PLAN (pl
   WHERE (pl.owner_prsnl_id = request->prsnl_id ) )
   JOIN (pa
   WHERE (pa.patient_list_id = outerjoin (pl.patient_list_id ) ) )
   JOIN (pe
   WHERE (pe.patient_list_id = outerjoin (pl.patient_list_id ) ) )
   JOIN (pr
   WHERE (pr.patient_list_id = outerjoin (pl.patient_list_id ) )
   AND (pr.end_effective_dt_tm >= outerjoin (cnvtdatetime (curdate ,curtime3 ) ) )
   AND (pr.beg_effective_dt_tm <= outerjoin (cnvtdatetime (curdate ,curtime3 ) ) ) )
  ORDER BY pl.patient_list_id ,
   pa.argument_id ,
   pe.encntr_filter_id ,
   pr.reltn_id
  HEAD REPORT
   arg_ctr = 0
  HEAD pl.patient_list_id
   counter = (counter + 1 ) ,
   IF ((mod (counter ,10 ) = 1 ) ) 
     stat = alterlist (reply->patient_lists ,(counter + 9 ) )
   ENDIF
   
   reply->patient_lists[counter ].list_access_cd = owner_cd
   reply->patient_lists[counter ].patient_list_id = pl.patient_list_id
   reply->patient_lists[counter ].name = pl.name
   reply->patient_lists[counter ].description = pl.description
   reply->patient_lists[counter ].patient_list_type_cd = pl.patient_list_type_cd
   reply->patient_lists[counter ].owner_id = pl.owner_prsnl_id
   
   arg_ctr = 0
  HEAD pa.argument_id
   IF ((pa.argument_id != 0 ) ) 
     arg_ctr = (arg_ctr + 1 )
    IF ((mod (arg_ctr ,10 ) = 1 ) ) 
	  stat = alterlist (reply->patient_lists[counter ].arguments ,(arg_ctr + 9 ) )
    ENDIF
    
	reply->patient_lists[counter ].arguments[arg_ctr ].argument_name = pa.argument_name
	reply->patient_lists[counter ].arguments[arg_ctr ].argument_value = pa.argument_value
	reply->patient_lists[counter ].arguments[arg_ctr ].parent_entity_name = pa.parent_entity_name
	reply->patient_lists[counter ].arguments[arg_ctr ].parent_entity_id = pa.parent_entity_id
   ENDIF
   ,encntr_ctr = 0
  HEAD pe.encntr_filter_id
   IF ((pe.encntr_filter_id != 0 ) ) encntr_ctr = (encntr_ctr + 1 ) ,
    IF ((mod (encntr_ctr ,10 ) = 1 ) ) stat = alterlist (reply->patient_lists[counter ].
      encntr_type_filters ,(encntr_ctr + 9 ) )
    ENDIF
    ,reply->patient_lists[counter ].encntr_type_filters[encntr_ctr ].encntr_type_cd = pe
    .encntr_type_cd ,reply->patient_lists[counter ].encntr_type_filters[encntr_ctr ].encntr_class_cd
    = pe.encntr_class_cd
   ENDIF
   ,reltn_ctr = 0
  HEAD pr.reltn_id
   IF ((pr.reltn_id != 0 ) ) reltn_ctr = (reltn_ctr + 1 ) ,
    IF ((mod (reltn_ctr ,10 ) = 1 ) ) stat = alterlist (reply->patient_lists[counter ].proxies ,(
      reltn_ctr + 9 ) )
    ENDIF
    ,reply->patient_lists[counter ].proxies[reltn_ctr ].prsnl_id = pr.prsnl_id ,reply->patient_lists[
    counter ].proxies[reltn_ctr ].prsnl_group_id = pr.prsnl_group_id ,reply->patient_lists[counter ].
    proxies[reltn_ctr ].list_access_cd = pr.list_access_cd ,reply->patient_lists[counter ].proxies[
    reltn_ctr ].beg_effective_dt_tm = cnvtdatetime (pr.beg_effective_dt_tm ) ,reply->patient_lists[
    counter ].proxies[reltn_ctr ].end_effective_dt_tm = cnvtdatetime (pr.end_effective_dt_tm )
   ENDIF
  FOOT  pl.patient_list_id
   stat = alterlist (reply->patient_lists[counter ].arguments ,arg_ctr ) ,stat = alterlist (reply->
    patient_lists[counter ].encntr_type_filters ,encntr_ctr ) ,stat = alterlist (reply->
    patient_lists[counter ].proxies ,reltn_ctr )
  FOOT REPORT
   stat = alterlist (reply->patient_lists ,counter )
  WITH nocounter
 ;end select
 SELECT INTO "nl:"
  FROM (dcp_patient_list pl ),
   (dcp_pl_reltn pr ),
   (dcp_pl_argument pa ),
   (dcp_pl_encntr_filter pe ),
   (person p )
  PLAN (pr
   WHERE (pr.prsnl_id = request->prsnl_id )
   AND (pr.end_effective_dt_tm >= cnvtdatetime (curdate ,curtime3 ) )
   AND (pr.beg_effective_dt_tm <= cnvtdatetime (curdate ,curtime3 ) ) )
   JOIN (pl
   WHERE (pl.patient_list_id = pr.patient_list_id ) )
   JOIN (pa
   WHERE (pa.patient_list_id = outerjoin (pl.patient_list_id ) ) )
   JOIN (pe
   WHERE (pe.patient_list_id = outerjoin (pl.patient_list_id ) ) )
   JOIN (p
   WHERE (p.person_id = pl.owner_prsnl_id ) )
  ORDER BY pl.patient_list_id ,
   pa.argument_id ,
   pe.encntr_filter_id ,
   pr.reltn_id
  HEAD REPORT
   arg_ctr = 0
  HEAD pl.patient_list_id
   counter = (counter + 1 ) ,
   IF ((size (reply->patient_lists ,5 ) < counter ) ) stat = alterlist (reply->patient_lists ,(
     counter + 9 ) )
   ENDIF
   ,reply->patient_lists[counter ].list_access_cd = pr.list_access_cd ,reply->patient_lists[counter ]
   .patient_list_id = pl.patient_list_id ,reply->patient_lists[counter ].name = concat (trim (pl
     .name ) ,"   (" ,substring (1 ,1 ,p.name_first ) ,". " ,trim (p.name_last ) ,")" ) ,reply->
   patient_lists[counter ].description = pl.description ,reply->patient_lists[counter ].
   patient_list_type_cd = pl.patient_list_type_cd ,reply->patient_lists[counter ].owner_id = pl
   .owner_prsnl_id ,arg_ctr = 0
  HEAD pa.argument_id
   IF ((pa.argument_id != 0 ) )
    CALL echo (build ("PA NOT EQUAL 0" ,pa.argument_id ) ) ,arg_ctr = (arg_ctr + 1 ) ,
    IF ((mod (arg_ctr ,10 ) = 1 ) ) stat = alterlist (reply->patient_lists[counter ].arguments ,(
      arg_ctr + 9 ) )
    ENDIF
    ,reply->patient_lists[counter ].arguments[arg_ctr ].argument_name = pa.argument_name ,reply->
    patient_lists[counter ].arguments[arg_ctr ].argument_value = pa.argument_value ,reply->
    patient_lists[counter ].arguments[arg_ctr ].parent_entity_name = pa.parent_entity_name ,reply->
    patient_lists[counter ].arguments[arg_ctr ].parent_entity_id = pa.parent_entity_id
   ENDIF
   ,encntr_ctr = 0
  HEAD pe.encntr_filter_id
   IF ((pe.encntr_filter_id != 0 ) ) encntr_ctr = (encntr_ctr + 1 ) ,
    IF ((mod (encntr_ctr ,10 ) = 1 ) ) stat = alterlist (reply->patient_lists[counter ].
      encntr_type_filters ,(encntr_ctr + 9 ) )
    ENDIF
    ,reply->patient_lists[counter ].encntr_type_filters[encntr_ctr ].encntr_type_cd = pe
    .encntr_type_cd
   ENDIF
   ,reltn_ctr = 0
  HEAD pr.reltn_id
   IF ((pr.reltn_id != 0 ) ) reltn_ctr = (reltn_ctr + 1 ) ,
    IF ((mod (reltn_ctr ,10 ) = 1 ) ) stat = alterlist (reply->patient_lists[counter ].proxies ,(
      reltn_ctr + 9 ) )
    ENDIF
    ,reply->patient_lists[counter ].proxies[reltn_ctr ].prsnl_id = pr.prsnl_id ,reply->patient_lists[
    counter ].proxies[reltn_ctr ].prsnl_group_id = pr.prsnl_group_id ,reply->patient_lists[counter ].
    proxies[reltn_ctr ].list_access_cd = pr.list_access_cd ,reply->patient_lists[counter ].proxies[
    reltn_ctr ].beg_effective_dt_tm = cnvtdatetime (pr.beg_effective_dt_tm ) ,reply->patient_lists[
    counter ].proxies[reltn_ctr ].end_effective_dt_tm = cnvtdatetime (pr.end_effective_dt_tm )
   ENDIF
  FOOT  pl.patient_list_id
   stat = alterlist (reply->patient_lists[counter ].arguments ,arg_ctr ) ,stat = alterlist (reply->
    patient_lists[counter ].encntr_type_filters ,encntr_ctr ) ,stat = alterlist (reply->
    patient_lists[counter ].proxies ,reltn_ctr )
  FOOT REPORT
   stat = alterlist (reply->patient_lists ,counter )
  WITH nocounter
 ;end select
 SELECT INTO "nl:"
  FROM (dcp_patient_list pl ),
   (dcp_pl_reltn pr ),
   (prsnl_group_reltn pgr ),
   (dcp_pl_argument pa ),
   (dcp_pl_encntr_filter pe ),
   (person p )
  PLAN (pr
   WHERE (pr.prsnl_group_id > 0 )
   AND (pr.end_effective_dt_tm >= cnvtdatetime (curdate ,curtime3 ) )
   AND (pr.beg_effective_dt_tm <= cnvtdatetime (curdate ,curtime3 ) ) )
   JOIN (pgr
   WHERE (pgr.prsnl_group_id = pr.prsnl_group_id )
   AND (pgr.person_id = request->prsnl_id )
   AND (pgr.end_effective_dt_tm >= cnvtdatetime (curdate ,curtime3 ) )
   AND (pgr.beg_effective_dt_tm <= cnvtdatetime (curdate ,curtime3 ) ) )
   JOIN (pl
   WHERE (pl.patient_list_id = pr.patient_list_id ) )
   JOIN (pa
   WHERE (pa.patient_list_id = outerjoin (pl.patient_list_id ) ) )
   JOIN (pe
   WHERE (pe.patient_list_id = outerjoin (pl.patient_list_id ) ) )
   JOIN (p
   WHERE (p.person_id = pl.owner_prsnl_id ) )
  ORDER BY pl.patient_list_id ,
   pa.argument_id ,
   pe.encntr_filter_id ,
   pr.reltn_id
  HEAD REPORT
   arg_ctr = 0
  HEAD pl.patient_list_id
   counter = (counter + 1 ) ,
   IF ((size (reply->patient_lists ,5 ) < counter ) ) stat = alterlist (reply->patient_lists ,(
     counter + 9 ) )
   ENDIF
   ,reply->patient_lists[counter ].list_access_cd = pr.list_access_cd ,reply->patient_lists[counter ]
   .patient_list_id = pl.patient_list_id ,reply->patient_lists[counter ].name = concat (trim (pl
     .name ) ,"   (" ,substring (1 ,1 ,p.name_first ) ,". " ,trim (p.name_last ) ,")" ) ,reply->
   patient_lists[counter ].description = pl.description ,reply->patient_lists[counter ].
   patient_list_type_cd = pl.patient_list_type_cd ,reply->patient_lists[counter ].owner_id = pl
   .owner_prsnl_id ,arg_ctr = 0
  HEAD pa.argument_id
   IF ((pa.argument_id != 0 ) ) arg_ctr = (arg_ctr + 1 ) ,
    IF ((mod (arg_ctr ,10 ) = 1 ) ) stat = alterlist (reply->patient_lists[counter ].arguments ,(
      arg_ctr + 9 ) )
    ENDIF
    ,reply->patient_lists[counter ].arguments[arg_ctr ].argument_name = pa.argument_name ,reply->
    patient_lists[counter ].arguments[arg_ctr ].argument_value = pa.argument_value ,reply->
    patient_lists[counter ].arguments[arg_ctr ].parent_entity_name = pa.parent_entity_name ,reply->
    patient_lists[counter ].arguments[arg_ctr ].parent_entity_id = pa.parent_entity_id
   ENDIF
   ,encntr_ctr = 0
  HEAD pe.encntr_filter_id
   IF ((pe.encntr_filter_id != 0 ) ) encntr_ctr = (encntr_ctr + 1 ) ,
    IF ((mod (encntr_ctr ,10 ) = 1 ) ) stat = alterlist (reply->patient_lists[counter ].
      encntr_type_filters ,(encntr_ctr + 9 ) )
    ENDIF
    ,reply->patient_lists[counter ].encntr_type_filters[encntr_ctr ].encntr_type_cd = pe
    .encntr_type_cd
   ENDIF
   ,reltn_ctr = 0
  HEAD pr.reltn_id
   IF ((pr.reltn_id != 0 ) ) reltn_ctr = (reltn_ctr + 1 ) ,
    IF ((mod (reltn_ctr ,10 ) = 1 ) ) stat = alterlist (reply->patient_lists[counter ].proxies ,(
      reltn_ctr + 9 ) )
    ENDIF
    ,reply->patient_lists[counter ].proxies[reltn_ctr ].prsnl_id = pr.prsnl_id ,reply->patient_lists[
    counter ].proxies[reltn_ctr ].prsnl_group_id = pr.prsnl_group_id ,reply->patient_lists[counter ].
    proxies[reltn_ctr ].list_access_cd = pr.list_access_cd ,reply->patient_lists[counter ].proxies[
    reltn_ctr ].beg_effective_dt_tm = cnvtdatetime (pr.beg_effective_dt_tm ) ,reply->patient_lists[
    counter ].proxies[reltn_ctr ].end_effective_dt_tm = cnvtdatetime (pr.end_effective_dt_tm )
   ENDIF
  FOOT  pl.patient_list_id
   stat = alterlist (reply->patient_lists[counter ].arguments ,arg_ctr ) ,stat = alterlist (reply->
    patient_lists[counter ].encntr_type_filters ,encntr_ctr ) ,stat = alterlist (reply->
    patient_lists[counter ].proxies ,reltn_ctr )
  FOOT REPORT
   stat = alterlist (reply->patient_lists ,counter )
  WITH nocounter
 ;end select
 IF ((counter = 0 ) )
  SET reply->status_data.status = "Z"
 ELSE
  SET reply->status_data.status = "S"
 ENDIF
END GO