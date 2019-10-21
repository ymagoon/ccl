drop program bc_mp_mvs_rad_9:dba go
create program bc_mp_mvs_rad_9:dba
/****************************************************************************************************************
                                       ED RADIOLOGY RESULT VIEW
              Purpose: Displays the Radiology Results for the ED Custom MPage
     Source File Name: bc_mp_mvs_rad_9.PRG
              Analyst: 
          Application: Firstnet
  Execution Locations: Firstnet ED 
            Request #: 
      Translated From: 
        Special Notes:
****************************************************************************************************************/
/***************************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   06/07/2011      MediView Solutions      Initial Release
	2 	mm/dd/yyyy      FirstName LastName      Comments for first modification

****************************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

 RECORD CATORDS (
   1 person_id = f8	;MVS_06012011.sn
   1 encntr_id = f8	;MVS_06012011.en
   1 ocnt 				= i2
   1 OLIST[*]
     2 cat_cd 			= f8	;code_value.code_value
     2 cat_disp 		= vc	;display(code_value.code_value)
     2 qcnt 			= i2
     2 qual[*]
       3 order_id 		= f8
       3 activity_type 	= vc	;display(orders.activity_type_cd)
       3 display 		= vc	;o.clinical_display_line
       3 mnemonic 		= vc
       3 start_date 	= vc
       3 ord_status		= vc
       3 cs_flag 		= i2
       3 cs_order_id 	= f8
       3 cs_name 		= vc
       3 comment_ind 	= c1
       3 comment 		= vc
       3 comm_line_cnt 	= i2
       3 event_id 		= f8	;MVS_06012011.n
 
)

DECLARE INERROR_8_CV		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"INERROR")),Protect
DECLARE NOTDONE_8_CV		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"NOT DONE")),Protect
DECLARE MODIFIED_8_CV		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"MODIFIED")),Protect
DECLARE ALTERED_8_CV   		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"ALTERED")),Protect
DECLARE AUTH_8_CV      		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"AUTH")),Protect
 
DECLARE ACTV_48_CV      	= f8 WITH CONSTANT(uar_get_code_by("MEANING",48,"ACTIVE")),Protect
 
DECLARE ordCD_6003_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6003,"ORDER"))
DECLARE cmpSTAT_6004_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6004,"COMPLETED"))
DECLARE ordSTAT_6004_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6004,"ORDERED"))
DECLARE inpSTAT_6004_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6004,"INPROCESS"))
 
DECLARE radCD_6000_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6000,"RADIOLOGY"))
DECLARE RAD_106_CV			= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",106,"RADIOLOGY"))

DECLARE CHILD_24_CV = f8 with constant(uar_get_code_by("MEANING",24,"CHILD")),protect
 
DECLARE ord_cnt 			= i2
SELECT INTO "NL:"
FROM
	ENCOUNTER E
 
PLAN E WHERE E.ENCNTR_ID = $ENCNTRID
	 AND e.active_ind = 1
	 AND e.active_status_cd = ACTV_48_CV
 
DETAIL
 	catords->person_id = e.person_id
 	catords->encntr_id = e.encntr_id
WITH NOCOUNTER 
 
/*===============================================================================================================
                                       START OF CATALOG INFORMATION
===============================================================================================================*/
SELECT 	INTO "nl:"  	; INTO $OUTDEV	
  o.catalog_type_cd
  ,c.collation_seq
 
FROM
	orders o
	,code_value c
 
PLAN o WHERE O.PERSON_ID = $PERSONID 			; PERSON ID Index    		
	AND o.catalog_type_cd = radCD_6000_CV	; Index 2 
	AND o.encntr_id + 0  = $ENCNTRID      			
    AND NOT(o.template_order_flag + 0 IN (2,3,4))
    AND o.orderable_type_flag != 6
    AND o.active_ind + 0  = 1
 
JOIN c WHERE c.code_value = o.dcp_clin_cat_cd
 
ORDER BY c.collation_seq, o.catalog_type_cd,
	 UAR_GET_CODE_DISPLAY(o.activity_type_cd),
     CNVTDATETIME(o.active_status_dt_tm) desc



HEAD REPORT
 
  STAT = ALTERLIST(CATORDS->OLIST,10)
  tcnt = 0
  ocnt = 0
 
HEAD o.catalog_type_cd
 
  ;increment count of catalog type orders
    tcnt = tcnt + 1
 
  ;check for available memory in the catalog order list
 	IF(MOD(tcnt,10) = 1 AND tcnt > 10)
      STAT = ALTERLIST(CATORDS->OLIST, tcnt + 9)
    ENDIF
 
  CATORDS->OLIST[tcnt].cat_cd 	= c.code_value
  CATORDS->OLIST[tcnt].cat_disp = uar_get_code_display(c.code_value)
  ocnt = 0
 
DETAIL
 
  ocnt = ocnt + 1
 
  ;check for available memory in the order list
  IF(MOD(ocnt,10) = 1)
    STAT = ALTERLIST(CATORDS->OLIST[tcnt].qual,ocnt+9)
  ENDIF
 
  CATORDS->OLIST[tcnt].qual[ocnt].order_id 		= o.order_id
  CATORDS->OLIST[tcnt].qual[ocnt].activity_type = UAR_GET_CODE_DISPLAY(o.activity_type_cd)
  CATORDS->OLIST[tcnt].qual[ocnt].mnemonic 		= o.order_mnemonic
  CATORDS->OLIST[tcnt].qual[ocnt].display 		= TRIM(o.order_mnemonic)
  CATORDS->OLIST[tcnt].qual[ocnt].start_date 	= FORMAT(o.orig_order_dt_tm,"mm/dd/yy hh:mm;;d")
  CATORDS->OLIST[tcnt].qual[ocnt].ord_status	= UAR_GET_CODE_DISPLAY(o.order_status_cd)
  CATORDS->OLIST[tcnt].qual[ocnt].cs_flag 		= o.cs_flag
  CATORDS->OLIST[tcnt].qual[ocnt].cs_order_id 	= o.cs_order_id
 
  IF(o.order_comment_ind = 1)
  	CATORDS->OLIST[tcnt].qual[ocnt].comment_ind 	= "T"
  ELSE
    CATORDS->OLIST[tcnt].qual[ocnt].comment_ind 	= "F"
  ENDIF
 
FOOT o.catalog_type_cd
 
  CATORDS->OLIST[tcnt].qcnt = ocnt
  STAT = ALTERLIST(CATORDS->OLIST[tcnt].qual,ocnt)
 
FOOT REPORT
  CATORDS->ocnt = tcnt
  STAT = ALTERLIST(CATORDS->OLIST,tcnt)
 
WITH NOCOUNTER
 
;If a careset get child order details
FOR (cc = 1 TO CATORDS->ocnt)
  FOR (cx = 1 TO CATORDS->OLIST[cc].qcnt)
    IF (CATORDS->OLIST[cc].qual[cx].cs_flag = 2) ;careset child order
      SELECT INTO "nl:"
      FROM orders o
      WHERE o.order_id = CATORDS->OLIST[cc].qual[cx].cs_order_id
      DETAIL
        CATORDS->OLIST[cc].qual[cx].cs_name = TRIM(o.hna_order_mnemonic)
        CATORDS->OLIST[cc].qual[cx].display = CONCAT(TRIM(CATORDS->OLIST[cc].qual[cx].display),
                       " (",TRIM(o.hna_order_mnemonic),")")
      WITH NOCOUNTER
    ENDIF
    ;Get comments if they exist for the order
	IF (CATORDS->OLIST[cc].qual[cx].comment_ind = "T")
	   	SELECT INTO "nl:"
	  	FROM long_text lt,
	         order_comment oc
	  	PLAN oc WHERE oc.order_id = CATORDS->OLIST[cc].qual[cx].order_id
	  	JOIN lt WHERE lt.long_text_id = oc.long_text_id
	   	HEAD REPORT
		qcnt = 0
	   	DETAIL
	 	qcnt = qcnt + 1
	 	IF (qcnt = 1)
	       	CATORDS->OLIST[cc].qual[cx].comment = concat("Comment(s): ",TRIM(lt.long_text))
	    ELSE
	   		CATORDS->OLIST[cc].qual[cx].comment = CONCAT(
				TRIM(CATORDS->OLIST[cc].qual[cx].comment),
				"; ",TRIM(lt.long_text))
	    ENDIF
		WITH NOCOUNTER
	ENDIF

															; MVS_06012011.sn	
	select into 'nl:'
	from clinical_event ce
	plan ce
		where ce.order_id = catords->OLIST[cc].qual[cx].order_id
		and ce.valid_until_dt_tm > sysdate
		and ce.event_reltn_cd = CHILD_24_CV
	detail
		catords->OLIST[cc].qual[cx].event_id = ce.event_id
	with nocounter
															; MVS_06012011.en

  ENDFOR
ENDFOR

call echojson(catords, $OUTDEV)
 
END
GO
 
