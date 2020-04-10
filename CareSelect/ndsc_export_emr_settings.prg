DROP PROGRAM ndsc_export_emr_settings :dba GO
CREATE PROGRAM ndsc_export_emr_settings :dba
 PROMPT
  "Output to File/Printer/MINE" = "MINE" ,
  "Careselect Api Base URL:" = "https://cerner-testapi.careselect.org/v5/" ,
  "Careselect Api Username:" = "" ,
  "Careselect Api Password:" = "" ,
  "Catalog type(s) (CV from CS 6000):" = value (2517 ) ,
  "Reporting - Orders Start (90):" = 0 ,
  "Reporting - Orders Updated (90):" = 0 ,
  "Write to output device" = 1
  WITH outdev ,base_url ,username ,password ,catalog_types ,start_date ,days_back ,write_output
 EXECUTE ndsc_common_utility
 EXECUTE ndsc_careselect_api
 DECLARE exportvirtualview = i4
 DECLARE exportordercatalog = i4
 DECLARE exportorderentryformat = i4
 DECLARE exportcodeset = i4
 DECLARE daysback = i4
 DECLARE dqdaysback = dq8
 DECLARE baseurl = vc
 DECLARE webserviceusername = vc
 DECLARE webservicepassword = vc
 DECLARE token = vc
 DECLARE ordersdaysback = i4
 DECLARE ordersstartdate = i4
 DECLARE dqordersdaysback = dq8
 DECLARE dqordersstartdate = dq8
 DECLARE realdsnfieldid = f8
 DECLARE realscorefieldid = f8
 DECLARE jsonstring = vc WITH noconstant ("" )
 DECLARE jrec = i4 WITH noconstant (0 )
 SET exportvirtualview = 1
 SET exportordercatalog = 1
 SET exportorderentryformat = 1
 SET daysback = 0
 DECLARE i = i4
 DECLARE a = i4
 DECLARE startpos = i4
 DECLARE endpos = i4
 DECLARE nmr = i4
 DECLARE intage = i4
 DECLARE strage = vc
 DECLARE strorders = vc
 DECLARE writeoutput = i4
 SET baseurl =  $BASE_URL
 SET webserviceusername =  $USERNAME
 SET webservicepassword =  $PASSWORD
 SET writeoutput =  $WRITE_OUTPUT
 SET ordersstartdate =  $START_DATE
 SET ordersdaysback =  $DAYS_BACK
 SET token = base64_encode (build2 (webserviceusername ,":" ,webservicepassword ) )
 SET dqdaysback = cnvtdatetime ("01-JAN-1900" )
 IF ((ordersdaysback > 0 ) )
  SET dqordersdaysback = cnvtdatetime ((curdate - ordersdaysback ) ,curtime )
 ELSE
  SET dqordersdaysback = cnvtdatetime ((curdate - 180 ) ,curtime )
 ENDIF
 IF ((ordersstartdate > 0 ) )
  SET dqordersstartdate = cnvtdatetime ((curdate - ordersstartdate ) ,curtime )
 ELSE
  SET dqordersstartdate = cnvtdatetime ((curdate - 180 ) ,curtime )
 ENDIF
 DECLARE constorderactiontypecd = f8 WITH constant (uar_get_code_by ("MEANING" ,6003 ,"ORDER" ) )
 SELECT INTO "NL:"
  FROM (order_entry_fields oef )
  WHERE (cnvtupper (oef.description ) = "ACR DSN" )
  DETAIL
   realdsnfieldid = oef.oe_field_id
  WITH nocounter
 ;end select
 SELECT INTO "NL:"
  FROM (order_entry_fields oef )
  WHERE (cnvtupper (oef.description ) = "ACR SCORE" )
  DETAIL
   realscorefieldid = oef.oe_field_id
  WITH nocounter
 ;end select
 RECORD ndsc_vv_temp (
   1 virtual_view [* ]
     2 s = f8
     2 f = f8
 )
 RECORD ndsc_vv (
   1 nmr = i4
   1 virtual_view [* ]
     2 s = f8
     2 f = f8
 )
 RECORD ndsc_catalog (
   1 orders [* ]
     2 cc = f8
     2 cn = vc
     2 a = i4
 )
 RECORD ndsc_synonyms (
   1 synonyms [* ]
     2 o = f8
     2 s = vc
     2 oef_id = f8
     2 a = i4
     2 c = f8
 )
 RECORD ndsc_oef (
   1 oef [* ]
     2 oe_format_id = f8
     2 oe_format_name = vc
   1 oef_fields [* ]
     2 oe_format_id = f8
     2 oe_field_id = f8
     2 seq = i4
     2 default_value = vc
     2 label_text = vc
     2 accept_flag = i4
   1 oe_fields [* ]
     2 oe_field_id = f8
     2 description = vc
     2 code_set = i4
     2 field_type_flag = i4
 )
 DECLARE configurations = vc
 SET configurations = getconfigs (baseurl ,token )
 SET jsonstring = build2 ('{"configs":' ,configurations ,"}" )
 SET jrec = cnvtjsontorec (jsonstring )
 DECLARE hiddenexamsactive = vc WITH noconstant ("" )
 SET hiddenexamsactive = configs->configuration.hiddenexamsactive
 DECLARE postresponse = vc
 DECLARE cnt = i4 WITH protect
 DECLARE stat = i4 WITH protect
 IF ((writeoutput = 1 ) )
  CALL writehtml ('<html><head></head><body><textarea style="width:800px;height:800px;">' )
 ENDIF
 IF ((exportvirtualview = 1 ) )
  DECLARE strvirtualviewjson = vc
  SELECT INTO "NL:"
   FROM (order_catalog_synonym ocs ),
    (ocs_facility_r ofr ),
    (order_entry_format oef )
   PLAN (ocs
    WHERE (ocs.catalog_type_cd =  $CATALOG_TYPES )
    AND (ocs.active_ind = 1 ) )
    JOIN (ofr
    WHERE (ofr.synonym_id = ocs.synonym_id ) )
    JOIN (oef
    WHERE (oef.oe_format_id = ocs.oe_format_id )
    AND (oef.action_type_cd = constorderactiontypecd ) )
   ORDER BY ofr.synonym_id
   DETAIL
    cnt = (cnt + 1 ) ,
    stat = alterlist (ndsc_vv_temp->virtual_view ,cnt ) ,
    ndsc_vv_temp->virtual_view[cnt ].s = ocs.synonym_id ,
    ndsc_vv_temp->virtual_view[cnt ].f = ofr.facility_cd
   WITH nocounter
  ;end select
  SET startpos = 0
  WHILE ((startpos < size (ndsc_vv_temp->virtual_view ,5 ) ) )
   IF (((size (ndsc_vv_temp->virtual_view ,5 ) - startpos ) > 20000 ) )
    SET endpos = (startpos + 20000 )
    SET ndsc_vv->nmr = 0
   ELSE
    SET endpos = size (ndsc_vv_temp->virtual_view ,5 )
    SET ndsc_vv->nmr = 1
   ENDIF
   SET a = 0
   SET stat = alterlist (ndsc_vv->virtual_view ,(endpos - startpos ) )
   FOR (i = startpos TO endpos )
    SET ndsc_vv->virtual_view[a ].f = ndsc_vv_temp->virtual_view[i ].f
    SET ndsc_vv->virtual_view[a ].s = ndsc_vv_temp->virtual_view[i ].s
    SET a = (a + 1 )
   ENDFOR
   IF ((writeoutput = 1 ) )
    CALL writehtml (build2 ("Exporting " ,size (ndsc_vv->virtual_view ,5 ) ," virtual view entries."
      ) )
   ENDIF
   SET strvirtualviewjson = cnvtrectojson (ndsc_vv ,2 )
   SET postresponse = uploadvirtualviews (strvirtualviewjson ,baseurl ,token )
   IF ((writeoutput = 1 ) )
    CALL writehtml (build2 ("Response: " ,postresponse ) )
   ENDIF
   SET startpos = endpos
  ENDWHILE
 ENDIF
 IF ((exportordercatalog = 1 ) )
  DECLARE oc_cnt = i4
  DECLARE ocs_cnt = i4
  SET oc_cnt = 0
  SET ocs_cnt = 0
  SELECT INTO "NL:"
   FROM (order_catalog oc ),
    (order_catalog_synonym ocs )
   PLAN (oc
    WHERE (oc.catalog_type_cd =  $CATALOG_TYPES ) )
    JOIN (ocs
    WHERE (ocs.catalog_cd = oc.catalog_cd ) )
   ORDER BY oc.catalog_cd ,
    ocs.synonym_id
   HEAD oc.catalog_cd
    IF ((oc.updt_dt_tm > dqdaysback ) ) oc_cnt = (oc_cnt + 1 ) ,stat = alterlist (ndsc_catalog->
      orders ,oc_cnt ) ,ndsc_catalog->orders[oc_cnt ].cc = oc.catalog_cd ,ndsc_catalog->orders[
     oc_cnt ].cn = trim (removespecialchars (uar_get_code_display (oc.catalog_cd ) ) ,3 ) ,
     ndsc_catalog->orders[oc_cnt ].a = oc.active_ind
    ENDIF
   HEAD ocs.synonym_id
    IF ((ocs.updt_dt_tm > dqdaysback ) ) ocs_cnt = (ocs_cnt + 1 ) ,stat = alterlist (ndsc_synonyms->
      synonyms ,ocs_cnt ) ,ndsc_synonyms->synonyms[ocs_cnt ].o = ocs.synonym_id ,ndsc_synonyms->
     synonyms[ocs_cnt ].s = trim (removespecialchars (ocs.mnemonic ) ,3 ) ,ndsc_synonyms->synonyms[
     ocs_cnt ].oef_id = ocs.oe_format_id ,ndsc_synonyms->synonyms[ocs_cnt ].c = ocs.catalog_cd ,
     IF ((ocs.active_ind = 1 )
     AND (((cnvtupper (hiddenexamsactive ) = "TRUE" ) ) OR ((ocs.hide_flag = 0 ) )) ) ndsc_synonyms->
      synonyms[ocs_cnt ].a = 1
     ELSE ndsc_synonyms->synonyms[ocs_cnt ].a = 0
     ENDIF
    ENDIF
   WITH nocounter
  ;end select
  IF ((writeoutput = 1 ) )
   CALL writehtml (build2 ("Exporting " ,size (ndsc_catalog->orders ,5 ) ,
     " orderables (catalog_cd)." ) )
  ENDIF
  DECLARE strcatalogjson = vc
  SET strcatalogjson = cnvtrectojson (ndsc_catalog ,2 )
  SET postresponse = uploadordercatalog (strcatalogjson ,baseurl ,token )
  IF ((writeoutput = 1 ) )
   CALL writehtml (build2 ("Response: " ,postresponse ) )
  ENDIF
  IF ((writeoutput = 1 ) )
   CALL writehtml (build2 ("Exporting " ,size (ndsc_synonyms->synonyms ,5 ) ,
     " orderable synonyms (synonym_id)." ) )
  ENDIF
  DECLARE strsynonymsjson = vc
  SET strsynonymsjson = cnvtrectojson (ndsc_synonyms ,2 )
  SET postresponse = uploadorderables (strsynonymsjson ,baseurl ,token )
  IF ((writeoutput = 1 ) )
   CALL writehtml (build2 ("Response: " ,postresponse ) )
  ENDIF
 ENDIF
 IF ((exportorderentryformat = 1 ) )
  DECLARE oef_cnt = i4
  DECLARE off_cnt = i4
  DECLARE oeff_cnt = i4
  SET oef_cnt = 0
  SET off_cnt = 0
  SET oeff_cnt = 0
  SELECT INTO "NL:"
   FROM (order_catalog_synonym ocs ),
    (ocs_facility_r ofr ),
    (order_entry_format oef ),
    (oe_format_fields off )
   PLAN (ocs
    WHERE (ocs.catalog_type_cd =  $CATALOG_TYPES )
    AND (ocs.active_ind = 1 ) )
    JOIN (ofr
    WHERE (ofr.synonym_id = ocs.synonym_id ) )
    JOIN (oef
    WHERE (oef.oe_format_id = ocs.oe_format_id )
    AND (oef.action_type_cd = constorderactiontypecd ) )
    JOIN (off
    WHERE (off.oe_format_id = oef.oe_format_id )
    AND (off.action_type_cd = constorderactiontypecd ) )
   ORDER BY oef.oe_format_id ,
    off.oe_field_id
   HEAD oef.oe_format_id
    IF ((oef.updt_dt_tm > dqdaysback ) ) oef_cnt = (oef_cnt + 1 ) ,stat = alterlist (ndsc_oef->oef ,
      oef_cnt ) ,ndsc_oef->oef[oef_cnt ].oe_format_id = oef.oe_format_id ,ndsc_oef->oef[oef_cnt ].
     oe_format_name = trim (removespecialchars (oef.oe_format_name ) ,3 )
    ENDIF
   HEAD off.oe_field_id
    IF ((off.updt_dt_tm > dqdaysback ) ) off_cnt = (off_cnt + 1 ) ,stat = alterlist (ndsc_oef->
      oef_fields ,off_cnt ) ,ndsc_oef->oef_fields[off_cnt ].oe_format_id = off.oe_format_id ,ndsc_oef
     ->oef_fields[off_cnt ].oe_field_id = off.oe_field_id ,ndsc_oef->oef_fields[off_cnt ].seq = off
     .group_seq ,ndsc_oef->oef_fields[off_cnt ].default_value = trim (removespecialchars (off
       .default_value ) ,3 ) ,ndsc_oef->oef_fields[off_cnt ].label_text = trim (removespecialchars (
       off.label_text ) ,3 ) ,ndsc_oef->oef_fields[off_cnt ].accept_flag = off.accept_flag
    ENDIF
   WITH nocounter
  ;end select
  SELECT INTO "NL:"
   FROM (order_catalog_synonym ocs ),
    (ocs_facility_r ofr ),
    (order_entry_format oef ),
    (oe_format_fields off ),
    (order_entry_fields oeff )
   PLAN (ocs
    WHERE (ocs.catalog_type_cd =  $CATALOG_TYPES )
    AND (ocs.active_ind = 1 ) )
    JOIN (ofr
    WHERE (ofr.synonym_id = ocs.synonym_id ) )
    JOIN (oef
    WHERE (oef.oe_format_id = ocs.oe_format_id )
    AND (oef.action_type_cd = constorderactiontypecd ) )
    JOIN (off
    WHERE (off.oe_format_id = oef.oe_format_id )
    AND (off.action_type_cd = constorderactiontypecd ) )
    JOIN (oeff
    WHERE (oeff.oe_field_id = outerjoin (off.oe_field_id ) ) )
   ORDER BY oeff.oe_field_id
   HEAD oeff.oe_field_id
    IF ((off.updt_dt_tm > dqdaysback ) ) oeff_cnt = (oeff_cnt + 1 ) ,stat = alterlist (ndsc_oef->
      oe_fields ,oeff_cnt ) ,ndsc_oef->oe_fields[oeff_cnt ].oe_field_id = oeff.oe_field_id ,ndsc_oef
     ->oe_fields[oeff_cnt ].description = oeff.description ,ndsc_oef->oe_fields[oeff_cnt ].code_set
     = oeff.codeset ,ndsc_oef->oe_fields[oeff_cnt ].field_type_flag = oeff.field_type_flag
    ENDIF
   WITH nocounter
  ;end select
  IF ((writeoutput = 1 ) )
   CALL writehtml (build2 ("Exporting " ,size (ndsc_oef->oef ,5 ) ," order entry formats." ) )
  ENDIF
  DECLARE stroefjson = vc
  SET stroefjson = cnvtrectojson (ndsc_oef ,2 )
  SET postresponse = uploadformats (stroefjson ,baseurl ,token )
  IF ((writeoutput = 1 ) )
   CALL writehtml (build2 ("Response: " ,postresponse ) )
  ENDIF
 ENDIF
 IF ((ordersstartdate != 0 ) )
  SET i = 0
  FREE RECORD orders_log
  RECORD orders_log (
    1 log [* ]
      2 order_id = vc
      2 dsn = vc
      2 score = vc
      2 order_dt_tm = dq8
      2 updated_dt_tm = dq8
      2 synonym = vc
      2 catalog = vc
      2 orderable_name = vc
      2 provider_id = vc
      2 provider_specialty = vc
      2 provider_type = vc
      2 provider_name = vc
      2 provider_npi = vc
      2 user_id = vc
      2 username = vc
      2 birth_dt_tm = dq8
      2 gender = vc
      2 order_status = vc
      2 ordering_dept = vc
      2 ordering_dept_id = vc
      2 patient_class = vc
      2 loc_facility_cd = vc
      2 loc_facility = vc
  ) WITH persistscript
  FREE RECORD ndsc_orders
  RECORD ndsc_orders (
    1 nmr = i4
    1 sl = i4
    1 orders [* ]
      2 oid = vc
      2 dsn = vc
      2 sc = vc
      2 od = vc
      2 ud = vc
      2 sid = vc
      2 sna = vc
      2 co = vc
      2 pid = vc
      2 pna = vc
      2 psp = vc
      2 pty = vc
      2 npi = vc
      2 una = vc
      2 uid = vc
      2 pa = i4
      2 pg = vc
      2 st = vc
      2 did = vc
      2 pc = vc
      2 fid = vc
      2 dna = vc
      2 fna = vc
  ) WITH persistscript
  SELECT INTO "NL:"
   FROM (orders o ),
    (person p ),
    (encounter e ),
    (prsnl pr ),
    (prsnl pr2 ),
    (order_catalog_synonym ocs ),
    (order_detail od ),
    (order_detail od2 )
   PLAN (o
    WHERE (o.catalog_type_cd =  $CATALOG_TYPES )
    AND (o.orig_order_dt_tm > cnvtdatetime ((curdate - ordersstartdate ) ,curtime ) ) )
    JOIN (p
    WHERE (p.person_id = outerjoin (o.person_id ) ) )
    JOIN (e
    WHERE (e.encntr_id = outerjoin (o.encntr_id ) ) )
    JOIN (pr
    WHERE (pr.person_id = outerjoin (o.active_status_prsnl_id ) ) )
    JOIN (pr2
    WHERE (pr2.person_id = outerjoin (o.last_update_provider_id ) ) )
    JOIN (ocs
    WHERE (ocs.synonym_id = outerjoin (o.synonym_id ) ) )
    JOIN (od
    WHERE (od.order_id = outerjoin (o.order_id ) )
    AND (od.oe_field_id = outerjoin (realdsnfieldid ) ) )
    JOIN (od2
    WHERE (od2.order_id = outerjoin (o.order_id ) )
    AND (od2.oe_field_id = outerjoin (realscorefieldid ) ) )
   DETAIL
    IF ((o.updt_dt_tm > cnvtdatetime ((curdate - ordersdaysback ) ,curtime ) ) ) i = (i + 1 ) ,stat
     = alterlist (orders_log->log ,i ) ,orders_log->log[i ].order_id = cnvtstring (o.order_id ) ,
     orders_log->log[i ].dsn = od.oe_field_display_value ,orders_log->log[i ].score = od2
     .oe_field_display_value ,orders_log->log[i ].order_dt_tm = o.orig_order_dt_tm ,orders_log->log[
     i ].updated_dt_tm = o.updt_dt_tm ,orders_log->log[i ].synonym = cnvtstring (o.synonym_id ) ,
     orders_log->log[i ].orderable_name = ocs.mnemonic ,orders_log->log[i ].catalog = cnvtstring (o
      .catalog_cd ) ,orders_log->log[i ].provider_id = cnvtstring (o.last_update_provider_id ) ,
     orders_log->log[i ].provider_name = pr2.name_full_formatted ,orders_log->log[i ].provider_type
     = uar_get_code_display (pr2.position_cd ) ,orders_log->log[i ].provider_specialty =
     uar_get_code_display (pr2.position_cd ) ,orders_log->log[i ].user_id = cnvtstring (o
      .active_status_prsnl_id ) ,orders_log->log[i ].username = pr.username ,orders_log->log[i ].
     birth_dt_tm = p.birth_dt_tm ,orders_log->log[i ].gender = uar_get_code_display (p.sex_cd ) ,
     orders_log->log[i ].order_status = uar_get_code_display (o.order_status_cd ) ,orders_log->log[i
     ].ordering_dept = uar_get_code_display (e.loc_nurse_unit_cd ) ,orders_log->log[i ].
     ordering_dept_id = cnvtstring (e.loc_nurse_unit_cd ) ,orders_log->log[i ].patient_class =
     uar_get_code_display (e.encntr_type_cd ) ,orders_log->log[i ].loc_facility_cd = cnvtstring (e
      .loc_facility_cd ) ,orders_log->log[i ].loc_facility = uar_get_code_display (e.loc_facility_cd
      )
    ENDIF
   WITH nocounter
  ;end select
  SET modify = cnvtage (1 ,1 ,1 )
  SET startpos = 1
  WHILE ((startpos <= size (orders_log->log ,5 ) ) )
   FREE RECORD ndsc_orders
   RECORD ndsc_orders (
     1 nmr = i4
     1 sl = i4
     1 orders [* ]
       2 oid = vc
       2 dsn = vc
       2 sc = vc
       2 od = vc
       2 ud = vc
       2 sid = vc
       2 sna = vc
       2 co = vc
       2 pid = vc
       2 pna = vc
       2 psp = vc
       2 pty = vc
       2 npi = vc
       2 una = vc
       2 uid = vc
       2 pa = i4
       2 pg = vc
       2 st = vc
       2 did = vc
       2 pc = vc
       2 fid = vc
       2 dna = vc
       2 fna = vc
   ) WITH persistscript
   IF ((startpos = 1 ) )
    SET ndsc_orders->sl = 1
   ELSE
    SET ndsc_orders->sl = 0
   ENDIF
   IF (((size (orders_log->log ,5 ) - startpos ) > 2000 ) )
    SET endpos = (startpos + 2000 )
   ELSE
    SET endpos = size (orders_log->log ,5 )
   ENDIF
   IF ((endpos = size (orders_log->log ,5 ) ) )
    SET ndsc_orders->nmr = 1
   ELSE
    SET ndsc_orders->nmr = 0
   ENDIF
   SET a = 0
   FOR (i = startpos TO endpos )
    SET a = (a + 1 )
    SET stat = alterlist (ndsc_orders->orders ,a )
    SET ndsc_orders->orders[a ].oid = orders_log->log[i ].order_id
    SET ndsc_orders->orders[a ].dsn = orders_log->log[i ].dsn
    SET ndsc_orders->orders[a ].sc = orders_log->log[i ].score
    SET ndsc_orders->orders[a ].od = format (orders_log->log[i ].order_dt_tm ,
     "yyyy-MM-ddThh:mm:ss;;d" )
    SET ndsc_orders->orders[a ].ud = format (orders_log->log[i ].updated_dt_tm ,
     "yyyy-MM-ddThh:mm:ss;;d" )
    SET ndsc_orders->orders[a ].sid = orders_log->log[i ].synonym
    SET ndsc_orders->orders[a ].sna = orders_log->log[i ].orderable_name
    SET ndsc_orders->orders[a ].co = orders_log->log[i ].catalog
    SET ndsc_orders->orders[a ].pid = orders_log->log[i ].provider_id
    SET ndsc_orders->orders[a ].pna = orders_log->log[i ].provider_name
    SET ndsc_orders->orders[a ].psp = orders_log->log[i ].provider_specialty
    SET ndsc_orders->orders[a ].pty = orders_log->log[i ].provider_type
    SET ndsc_orders->orders[a ].una = orders_log->log[i ].username
    SET ndsc_orders->orders[a ].uid = orders_log->log[i ].user_id
    SET strage = cnvtage (orders_log->log[i ].birth_dt_tm )
    SET strage = cnvtupper (strage )
    IF ((findstring ("YEARS" ,strage ) = 0 ) )
     SET intage = 0
    ELSE
     SET intage = textlen (strage )
     SET intage = (intage - 6 )
     SET intage = cnvtint (substring (1 ,intage ,strage ) )
    ENDIF
    SET ndsc_orders->orders[a ].pa = intage
    SET ndsc_orders->orders[a ].pg = orders_log->log[i ].gender
    SET ndsc_orders->orders[a ].st = orders_log->log[i ].order_status
    SET ndsc_orders->orders[a ].dna = orders_log->log[i ].ordering_dept
    SET ndsc_orders->orders[a ].did = orders_log->log[i ].ordering_dept_id
    SET ndsc_orders->orders[a ].pc = orders_log->log[i ].patient_class
    SET ndsc_orders->orders[a ].fid = orders_log->log[i ].loc_facility_cd
    SET ndsc_orders->orders[a ].fna = orders_log->log[i ].loc_facility
   ENDFOR
   IF ((writeoutput = 1 ) )
    CALL writehtml (build2 ("Exporting " ,cnvtstring (size (ndsc_orders->orders ,5 ) ) ," orders" )
     )
   ENDIF
   SET strorders = cnvtrectojson (ndsc_orders ,2 )
   SET postresponse = uploadorders (strorders ,baseurl ,token )
   IF ((writeoutput = 1 ) )
    CALL writehtml (build2 ("Response: " ,postresponse ) )
   ENDIF
   SET startpos = (endpos + 1 )
  ENDWHILE
 ENDIF
 IF ((writeoutput = 1 ) )
  CALL writehtml ("</textarea></body></html>" )
 ENDIF
 CALL printhtmlmpage (1 )
END GO