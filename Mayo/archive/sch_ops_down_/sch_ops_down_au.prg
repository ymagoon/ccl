DROP PROGRAM   SCH_OPS_DOWN_AU : DBA  GO
CREATE PROGRAM  SCH_OPS_DOWN_AU : DBA
 
SET  RECOVER  = 1
 
SET  START_DATE  =  CURDATE
 
SET  START_TIME  = "00:00:00.00"
 
SET  END_DATE  = ( CURDATE +3 )
 
SET  END_TIME  = "00:00:00.00"
 
SET  RESOURCE_GROUP  = "AU"
 
FREE RECORD REQUEST
 
RECORD  REQUEST  (
1  CALL_ECHO_IND  =  I2
1  MNEM  =  VC
1  TYPE_QUAL [*]
2  RES_GROUP_CD  =  F8 )
 
FREE RECORD REP_FIND_GRP_ID
 
RECORD  REP_FIND_GRP_ID  (
1  QUAL_CNT  =  I4
1  QUAL [*]
2  RES_GROUP_ID  =  F8
2  MNEM  =  VC
2  DESC  =  VC
2  UPDT_CNT  =  I4
2  ACTIVE_IND  =  I2
2  CANDIDATE_ID  =  F8
1  STATUS_DATA
2  STATUS  =  C1
2  SUBEVENTSTATUS [1 ]
3  OPERATIONNAME  =  C25
3  OPERATIONSTATUS  =  C1
3  TARGETOBJECTNAME  =  C25
3  TARGETOBJECTVALUE  =  VC )
 
SET  REQUEST -> MNEM  =  RESOURCE_GROUP
 
 EXECUTE SCH_GET_RES_GROUP_DISP WITH  REPLACE ("REPLY" , "REP_FIND_GRP_ID" )
 
IF ( ( REP_FIND_GRP_ID -> STATUS_DATA [1 ]-> STATUS ="F" ) )
 CALL ECHO ("execute sch_get_res_group_disp failed!!" )
SET  REPLY -> STATUS_DATA -> STATUS  = "F"  GO TO  EXIT_FAIL
ELSEIF ( ( REP_FIND_GRP_ID -> QUAL_CNT >1 ) )
 CALL ECHO (
"More than one resource group returned!! You have duplicate mnemonics for your resource groups." )
 CALL ECHO (
"This report will not function with duplicate mnemonics.  Change the mnemonics and try again." )
SET  REPLY -> STATUS_DATA -> STATUS  = "F"  GO TO  EXIT_FAIL
ENDIF
 
 
FREE RECORD REQUEST
 
RECORD  REQUEST  (
1  CALL_ECHO_IND  =  I2
1  GET_RES_TYPES  =  I2
1  QUAL [*]
2  RES_GROUP_ID  =  F8 )
 
FREE RECORD REP_GET_RSC_GRP
 
RECORD  REP_GET_RSC_GRP  (
1  QUAL_CNT  =  I4
1  QUAL [*]
2  RES_GROUP_ID  =  F8
2  MNEM  =  VC
2  DESC  =  VC
2  INFO_SCH_TEXT_ID  =  F8
2  INFO_SCH_TEXT  =  VC
2  INFO_SCH_TEXT_UPDT_CNT  =  I4
2  UPDT_CNT  =  I4
2  ACTIVE_IND  =  I2
2  CANDIDATE_ID  =  F8
2  RES_LIST_CNT  =  I4
2  RES_LIST [*]
3  SEQ_NBR  =  I4
3  RES_CD  =  F8
3  RES_DISP  =  C40
3  RES_DESC  =  C60
3  RES_MEAN  =  C12
3  CHILD_RES_GROUP_ID  =  F8
3  CHILD_RES_GROUP_MNEM  =  VC
3  UPDT_CNT  =  I4
3  ACTIVE_IND  =  I2
3  CANDIDATE_ID  =  F8
2  RES_TYPE_CNT  =  I4
2  RES_TYPE [*]
3  RES_GROUP_CD  =  F8
3  RES_GROUP_DISP  =  C40
3  RES_GROUP_DESC  =  C60
3  RES_GROUP_MEAN  =  C12
3  RES_GROUP_MEANING  =  C12
3  UPDT_CNT  =  I4
3  ACTIVE_IND  =  I2
3  CANDIDATE_ID  =  F8
2  DATE_LINK_R_QUAL_CNT  =  I4
2  DATE_LINK_R_QUAL [*]
3  DATE_SET_SEQ_NBR  =  I4
3  PARENT_ENTITY_ID  =  F8
3  PARENT_ENTITY_NAME  =  C30
3  SCH_DATE_LINK_R_ID  =  F8
3  SCH_DATE_SET_ID  =  F8
3  UPDT_CNT  =  I4
3  SCH_DATE_SET_MNEM  =  VC
3  SCH_DATE_SET_DESC  =  VC
3  SCH_DATE_SET_ACTIVE_IND  =  I2
1  STATUS_DATA
2  STATUS  =  C1
2  SUBEVENTSTATUS [1 ]
3  OPERATIONNAME  =  C25
3  OPERATIONSTATUS  =  C1
3  TARGETOBJECTNAME  =  C25
3  TARGETOBJECTVALUE  =  VC )
 
FREE RECORD REPLY
 
RECORD  REPLY  (
1  STATUS_DATA
2  STATUS  =  C1
2  SUBEVENTSTATUS [1 ]
3  OPERATIONNAME  =  C25
3  OPERATIONSTATUS  =  C1
3  TARGETOBJECTNAME  =  C25
3  TARGETOBJECTVALUE  =  VC )
 
SET  STAT  =  ALTERLIST ( REQUEST -> QUAL , 1 )
 
SET  REQUEST -> QUAL [1 ]-> RES_GROUP_ID  =  REP_FIND_GRP_ID -> QUAL [1 ]-> RES_GROUP_ID
 
SET  REQUEST -> GET_RES_TYPES  = 1
 
 EXECUTE SCH_GET_RES_GROUP_BY_ID WITH  REPLACE ("REPLY" , "REP_GET_RSC_GRP" )
 
IF ( ( REP_GET_RSC_GRP -> STATUS_DATA [1 ]-> STATUS ="F" ) )
 CALL ECHO ("execute sch_get_res_group_by_id failed!!" )
SET  REPLY -> STATUS_DATA -> STATUS  = "F"  GO TO  EXIT_FAIL
ENDIF
 
 
SET  J_CNT  = 1
 
SET  CHK_GRP_IN_GRP  = 0
 
FOR (  GRP_SPY  = 1  TO  REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST_CNT  )
 
IF ( ( REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST [ GRP_SPY ]-> CHILD_RES_GROUP_ID >0.0 ) )
SET  STAT  =  ALTERLIST ( REQUEST -> QUAL ,  J_CNT )
SET  REQUEST -> QUAL [ J_CNT ]-> RES_GROUP_ID  =  REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST [ GRP_SPY
]-> CHILD_RES_GROUP_ID
SET  J_CNT  = ( J_CNT +1 )
SET  CHK_GRP_IN_GRP  = 1
ENDIF
 
 
ENDFOR
 
 
FREE RECORD REP_GET_RSC_GRP_GRP
 
RECORD  REP_GET_RSC_GRP_GRP  (
1  QUAL_CNT  =  I4
1  QUAL [*]
2  RES_GROUP_ID  =  F8
2  MNEM  =  VC
2  DESC  =  VC
2  INFO_SCH_TEXT_ID  =  F8
2  INFO_SCH_TEXT  =  VC
2  INFO_SCH_TEXT_UPDT_CNT  =  I4
2  UPDT_CNT  =  I4
2  ACTIVE_IND  =  I2
2  CANDIDATE_ID  =  F8
2  RES_LIST_CNT  =  I4
2  RES_LIST [*]
3  SEQ_NBR  =  I4
3  RES_CD  =  F8
3  RES_DISP  =  C40
3  RES_DESC  =  C60
3  RES_MEAN  =  C12
3  CHILD_RES_GROUP_ID  =  F8
3  CHILD_RES_GROUP_MNEM  =  VC
3  UPDT_CNT  =  I4
3  ACTIVE_IND  =  I2
3  CANDIDATE_ID  =  F8
2  RES_TYPE_CNT  =  I4
2  RES_TYPE [*]
3  RES_GROUP_CD  =  F8
3  RES_GROUP_DISP  =  C40
3  RES_GROUP_DESC  =  C60
3  RES_GROUP_MEAN  =  C12
3  RES_GROUP_MEANING  =  C12
3  UPDT_CNT  =  I4
3  ACTIVE_IND  =  I2
3  CANDIDATE_ID  =  F8
2  DATE_LINK_R_QUAL_CNT  =  I4
2  DATE_LINK_R_QUAL [*]
3  DATE_SET_SEQ_NBR  =  I4
3  PARENT_ENTITY_ID  =  F8
3  PARENT_ENTITY_NAME  =  C30
3  SCH_DATE_LINK_R_ID  =  F8
3  SCH_DATE_SET_ID  =  F8
3  UPDT_CNT  =  I4
3  SCH_DATE_SET_MNEM  =  VC
3  SCH_DATE_SET_DESC  =  VC
3  SCH_DATE_SET_ACTIVE_IND  =  I2
1  STATUS_DATA
2  STATUS  =  C1
2  SUBEVENTSTATUS [1 ]
3  OPERATIONNAME  =  C25
3  OPERATIONSTATUS  =  C1
3  TARGETOBJECTNAME  =  C25
3  TARGETOBJECTVALUE  =  VC )
 
IF ( ( CHK_GRP_IN_GRP =1 ) )
 EXECUTE SCH_GET_RES_GROUP_BY_ID WITH  REPLACE ("REPLY" , "REP_GET_RSC_GRP_GRP" )
IF ( ( REP_GET_RSC_GRP_GRP -> STATUS_DATA [1 ]-> STATUS ="F" ) )
 CALL ECHO ("execute sch_get_res_group_by_id failed!!" )
SET  REPLY -> STATUS_DATA -> STATUS  = "F"  GO TO  EXIT_FAIL
ENDIF
 
SET  J_CNT  = 1
FOR (  GRP_SPY  = 1  TO  REP_GET_RSC_GRP_GRP -> QUAL [1 ]-> RES_LIST_CNT  )
 
IF ( ( REP_GET_RSC_GRP_GRP -> QUAL [1 ]-> RES_LIST [ GRP_SPY ]-> CHILD_RES_GROUP_ID >0.0 ) )
 CALL ECHO ("Multiple embedded resource groups found!!  Script terminating" )
 CALL ECHO ("Embedded resource groups cannot have children resource groups." )
SET  REPLY -> STATUS_DATA -> STATUS  = "F"  GO TO  EXIT_FAIL
ENDIF
 
 
ENDFOR
 
SET  MERGE_CNT  =  REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST_CNT
FOR (  MERGE_I  = 1  TO  REP_GET_RSC_GRP_GRP -> QUAL [1 ]-> RES_LIST_CNT  )
 
IF ( ( REP_GET_RSC_GRP_GRP -> QUAL [1 ]-> RES_LIST [ MERGE_I ]-> RES_CD >0.0 ) AND (
 REP_GET_RSC_GRP_GRP -> QUAL [1 ]-> RES_LIST [ MERGE_I ]-> CHILD_RES_GROUP_ID =0.0 ) )
SET  MERGE_CNT  = ( MERGE_CNT +1 )
SET  STAT  =  ALTERLIST ( REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST ,  MERGE_CNT )
SET  REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST [ MERGE_CNT ]-> RES_CD  =  REP_GET_RSC_GRP_GRP -> QUAL
[1 ]-> RES_LIST [ MERGE_I ]-> RES_CD
ENDIF
 
 
ENDFOR
 
ENDIF
 
 
FREE RECORD REQUEST
 
RECORD  REQUEST  (
1  RECOVER  =  I4
1  PRINTER  =  VC
1  RSC_CD  =  VC
1  BEG_DT_PARAM  =  VC
1  END_DT_PARAM  =  VC
1  TITLE  =  VC
1  PRINTER_NAME  =  VC
1  QUAL_CNT  =  I4
1  QUAL [*]
2  RESOURCE_PARAM  =  VC
2  TITLE  =  VC )
 
SET  REQUEST -> QUAL_CNT  = 0
 
SET  REQUEST -> PRINTER_NAME  =  TRIM ( $1 )
 
SET  REQUEST -> BEG_DT_PARAM  =  CONCAT ("cnvtdatetime(" , '"' ,  FORMAT ( END_DATE ,
"DD-MMM-YYYY;;DATE" ),  END_TIME , '"' , ") > a.beg_dt_tm" )
 
SET  REQUEST -> END_DT_PARAM  =  CONCAT ("cnvtdatetime(" , '"' ,  FORMAT ( START_DATE ,
"DD-MMM-YYYY;;DATE" ),  START_TIME , '"' , ") < a.end_dt_tm" )
 
SET  STAT  =  ALTERLIST ( REQUEST -> QUAL ,  SIZE ( REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST , 5 ))
 
FOR (  RPT_LOOP  = 1  TO  SIZE ( REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST , 5 ) )
 
IF ( ( REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST [ RPT_LOOP ]-> RES_CD >0.0 ) )
SET  RSC_CD  =  CNVTSTRING ( REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST [ RPT_LOOP ]-> RES_CD )
SET  REQUEST -> QUAL [ RPT_LOOP ]-> RESOURCE_PARAM  =  CONCAT (" r.resource_cd = " ,  RSC_CD )
SET  REQUEST -> QUAL [ RPT_LOOP ]-> TITLE  =  CONCAT ("Resource Code: " ,  RSC_CD )
IF ( ( RECOVER =1 ) )
SET  PRINTER  =  BUILD ( REQUEST -> PRINTER_NAME ,  SUBSTRING (0 , 18 ,  CNVTALPHANUM (
 UAR_GET_CODE_DISPLAY ( REP_GET_RSC_GRP -> QUAL [1 ]-> RES_LIST [ RPT_LOOP ]-> RES_CD ))),".pdf")
ELSE
SET  PRINTER  =  REQUEST -> PRINTER_NAME
ENDIF
 
 EXECUTE SCH_RPTSTD_RES_APPT_LIST_PDF  VALUE ( PRINTER ),
 REQUEST -> BEG_DT_PARAM ,
 REQUEST -> END_DT_PARAM ,
 REQUEST -> QUAL [ RPT_LOOP ]-> RESOURCE_PARAM ,
 REQUEST -> QUAL [ RPT_LOOP ]-> TITLE
 CALL ECHO ( PRINTER )
 CALL ECHO ( BUILD ("qual::" ,  RPT_LOOP ))
ENDIF
 
 
ENDFOR
 
 
 CALL ECHORECORD ( REQUEST )
 
# EXIT_FAIL
 END GO
 
