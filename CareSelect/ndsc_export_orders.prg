DROP PROGRAM ndsc_export_orders GO
CREATE PROGRAM ndsc_export_orders
 PROMPT
  "Output to File/Printer/MINE" = "MINE" ,
  "CareSelect API Base URL:" = "https://cerner-testapi.careselect.org/v5/" ,
  "CareSelect API Username:" = "" ,
  "CareSelect API Password:" = "" ,
  "Catalog type(s) (CV from CS 6000)" = value (2517 ) ,
  "Orders Start Date for backload (DD-MMM-YYYY):" = "0" ,
  "Orders End Date for backload (DD-MMM-YYYY):" = "0" ,
  "Orders Days Back (set for nightly job):" = 0 ,
  "Write to output device" = 1
  WITH outdev ,base_url ,username ,password ,catalog_types ,start_date ,end_date ,days_back ,
  write_output
 EXECUTE ndsc_common_utility
 EXECUTE ndsc_careselect_api
 DECLARE dqdaysback = dq8
 DECLARE baseurl = vc
 DECLARE webserviceusername = vc
 DECLARE webservicepassword = vc
 DECLARE webservicetoken = vc
 DECLARE ordersdaysback = i4
 DECLARE ordersstartdate = vc
 DECLARE ordersenddate = vc
 DECLARE dqordersenddate = dq8
 DECLARE dqordersstartdate = dq8
 DECLARE dqorderscurrdate = dq8
 DECLARE realdsnfieldid = f8
 DECLARE realscorefieldid = f8
 DECLARE i = i4
 DECLARE a = i4
 DECLARE startpos = i4
 DECLARE endpos = i4
 DECLARE nmr = i4
 DECLARE intage = i4
 DECLARE strage = vc
 DECLARE strorders = vc
 DECLARE writeoutput = i4
 DECLARE configurations = vc
 DECLARE postresponse = vc
 SET baseurl =  $BASE_URL
 SET webserviceusername =  $USERNAME
 SET webservicepassword =  $PASSWORD
 SET writeoutput =  $WRITE_OUTPUT
 SET ordersstartdate =  $START_DATE
 SET ordersenddate =  $END_DATE
 SET ordersdaysback =  $DAYS_BACK
 SET webservicetoken = base64_encode (build2 (webserviceusername ,":" ,webservicepassword ) )
 SET configurations = getconfigs (baseurl ,webservicetoken )
 SET jsonstring = build2 ('{"configs":' ,configurations ,"}" )
 SET jrec = cnvtjsontorec (jsonstring )
 SET realdsnfieldid = cnvtreal (configs->configuration.cernerdsnquestionid )
 SET realscorefieldid = cnvtreal (configs->configuration.cernerscorequestionid )
 DECLARE constorderactiontypecd = f8 WITH constant (uar_get_code_by ("MEANING" ,6003 ,"ORDER" ) )
 IF ((ordersstartdate != "0" )
 AND (ordersenddate != "0" ) )
  SET dqordersstartdate = cnvtdatetime (ordersstartdate )
  SET dqordersenddate = cnvtdatetime (ordersenddate )
 ELSE
  SET dqordersstartdate = cnvtdatetime ((curdate - ordersdaysback ) ,0 )
  SET dqordersenddate = cnvtdatetime (curdate ,0 )
 ENDIF
 FREE RECORD orders_log
 RECORD orders_log (
   1 log [* ]
     2 order_id = vc
     2 dsn = vc
     2 order_dt_tm = dq8
     2 updated_dt_tm = dq8
 ) WITH persistscript
 IF ((writeoutput = 1 ) )
  CALL writehtml ('<html><head></head><body><textarea style="width:800px;height:800px;">' )
 ENDIF
 SET dqorderscurrdate = dqordersstartdate
 WHILE ((dqorderscurrdate <= dqordersenddate ) )
  IF ((writeoutput = 1 ) )
   CALL writehtml (build2 ("CurrDate " ,format (cnvtdatetime (dqorderscurrdate ) ,"MMDDYYYY ;;D" ) )
    )
  ENDIF
  SET i = 0
  SET stat = alterlist (orders_log->log ,0 )
  SELECT INTO "NL:"
   FROM (orders o ),
    (order_detail od )
   PLAN (o
    WHERE (o.catalog_type_cd =  $CATALOG_TYPES )
    AND (o.orig_order_dt_tm BETWEEN cnvtdatetime (dqorderscurrdate ) AND cnvtdatetime (datetimeadd (
      cnvtdatetime (dqorderscurrdate ) ,1 ) ) ) )
    JOIN (od
    WHERE (od.order_id = o.order_id )
    AND (od.oe_field_id = realdsnfieldid ) )
   DETAIL
    i = (i + 1 ) ,
    stat = alterlist (orders_log->log ,i ) ,
    orders_log->log[i ].order_id = cnvtstring (o.order_id ) ,
    orders_log->log[i ].dsn = od.oe_field_display_value ,
    orders_log->log[i ].order_dt_tm = o.orig_order_dt_tm ,
    orders_log->log[i ].updated_dt_tm = o.updt_dt_tm
   WITH time = 300 ,maxrec = 100000
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
    SET ndsc_orders->orders[a ].od = format (orders_log->log[i ].order_dt_tm ,
     "yyyy-MM-ddThh:mm:ss;;d" )
    SET ndsc_orders->orders[a ].ud = format (orders_log->log[i ].updated_dt_tm ,
     "yyyy-MM-ddThh:mm:ss;;d" )
    SET ndsc_orders->orders[a ].sid = ""
    SET ndsc_orders->orders[a ].sna = ""
    SET ndsc_orders->orders[a ].co = ""
    SET ndsc_orders->orders[a ].pg = "U"
    SET ndsc_orders->orders[a ].st = ""
    SET ndsc_orders->orders[a ].pa = - (1 )
   ENDFOR
   IF ((writeoutput = 1 ) )
    CALL writehtml (build2 ("Exporting " ,cnvtstring (size (ndsc_orders->orders ,5 ) ) ,
      " orders for " ,format (cnvtdatetime (dqorderscurrdate ) ,"MMDDYYYY ;;D" ) ) )
   ENDIF
   SET strorders = cnvtrectojson (ndsc_orders ,2 )
   SET postresponse = uploadorders (strorders ,baseurl ,webservicetoken )
   IF ((writeoutput = 1 ) )
    CALL writehtml (build2 ("Response: " ,postresponse ) )
   ENDIF
   SET startpos = (endpos + 1 )
  ENDWHILE
  SET dqorderscurrdate = datetimeadd (dqorderscurrdate ,1 )
 ENDWHILE
 IF ((writeoutput = 1 ) )
  CALL writehtml ("</textarea></body></html>" )
 ENDIF
 CALL printhtmlmpage (1 )
END GO