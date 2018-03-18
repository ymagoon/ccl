/************************************************************************
          Date Written:       08/29/2013
          Source file name:   CORE_LOCATION_AUDIT.prg
          Object name:        CORE_LOCATION_AUDIT
          Request #:
 
          Program purpose:   CORE LOCATION AUDIT report
 
          Executing from:     Explorer Menu
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 08/29/2013 JTW                Changed location description       *
 *                                  substring from 40 to 60 in length  *
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
DROP PROGRAM   CORE_LOCATION_AUDIT : DBA  GO
CREATE PROGRAM  CORE_LOCATION_AUDIT : DBA
PROMPT "Enter MINE/CRT/printer/file: " ="MINE"

SET  CDF_MEANING  =  FILLSTRING (12 , " " )

SET  CODE_VALUE  = 0.0

SET  CODE_SET  = 48

SET  CDF_MEANING  = "DELETED"

 EXECUTE CPM_GET_CD_FOR_CDF

SET  LOC_DELETED_CD  =  CODE_VALUE

RECORD  QUEUE  (
1  CNT  =  N8
1  PROCESSED  =  N8
1  LIST [*]
2  CODE_VALUE  =  F8
2  LEVEL  =  I4 )

SELECT  DISTINCT  INTO "nl:"
C.CODE_VALUE
FROM ( CODE_VALUE  C ),
( LOCATION_GROUP  LG )
 PLAN ( C
WHERE (C.CODE_SET=220 ) AND (C.CDF_MEANING="FACILITY" ) AND (C.ACTIVE_IND=1 ) AND (
C.BEGIN_EFFECTIVE_DT_TM<= CNVTDATETIME ( CURDATE ,  CURTIME3 )) AND (C.END_EFFECTIVE_DT_TM>=
 CNVTDATETIME ( CURDATE ,  CURTIME3 )) AND (C.ACTIVE_TYPE_CD!= LOC_DELETED_CD ))
 AND ( LG
WHERE (LG.PARENT_LOC_CD=C.CODE_VALUE) AND (LG.ROOT_LOC_CD=0 ) AND (LG.ACTIVE_IND=1 ) AND (
LG.BEG_EFFECTIVE_DT_TM<= CNVTDATETIME ( CURDATE ,  CURTIME3 )) AND (LG.END_EFFECTIVE_DT_TM>=
 CNVTDATETIME ( CURDATE ,  CURTIME3 )) AND (LG.ACTIVE_STATUS_CD!= LOC_DELETED_CD ))


HEAD REPORT
 QUEUE -> CNT =0 ,
 QUEUE -> PROCESSED =0
DETAIL
 QUEUE -> CNT =( QUEUE -> CNT +1 ),
 STAT = ALTERLIST ( QUEUE -> LIST ,  QUEUE -> CNT ),
 QUEUE -> LIST [ QUEUE -> CNT ]-> CODE_VALUE =C.CODE_VALUE,
 QUEUE -> LIST [ QUEUE -> CNT ]-> LEVEL =1
 WITH  NOCOUNTER

WHILE ( ( QUEUE -> PROCESSED < QUEUE -> CNT ) AND ( QUEUE -> PROCESSED <10000 ))

SET  QUEUE -> PROCESSED  = ( QUEUE -> PROCESSED +1 )
 CALL NAVIGATE_LOCATION ( QUEUE -> LIST [ QUEUE -> PROCESSED ]-> CODE_VALUE , ( QUEUE -> LIST [
 QUEUE -> PROCESSED ]-> LEVEL +1 ))

ENDWHILE


SUBROUTINE   NAVIGATE_LOCATION  ( PARENT_CODE_VALUE ,  PARENT_LEVEL  )

SELECT  INTO "nl:"
C.DESCRIPTION,
C.DISPLAY
FROM ( CODE_VALUE  C ),
( LOCATION  L ),
( LOCATION_GROUP  LG ),
( CODE_VALUE  CH ),
( DUMMYT  D )
 PLAN ( C
WHERE (C.CODE_VALUE= PARENT_CODE_VALUE ))
 AND ( L
WHERE (C.CODE_VALUE=L.LOCATION_CD) AND (L.ACTIVE_IND=1 ) AND (L.BEG_EFFECTIVE_DT_TM<= CNVTDATETIME (
 CURDATE ,  CURTIME3 )) AND (L.END_EFFECTIVE_DT_TM>= CNVTDATETIME ( CURDATE ,  CURTIME3 )) AND (
L.ACTIVE_STATUS_CD!= LOC_DELETED_CD ))
 AND ( D )
 AND ( LG
WHERE (LG.PARENT_LOC_CD=C.CODE_VALUE) AND (LG.ROOT_LOC_CD=0 ) AND (LG.ACTIVE_IND=1 ) AND (
LG.BEG_EFFECTIVE_DT_TM<= CNVTDATETIME ( CURDATE ,  CURTIME3 )) AND (LG.END_EFFECTIVE_DT_TM>=
 CNVTDATETIME ( CURDATE ,  CURTIME3 )) AND (LG.ACTIVE_STATUS_CD!= LOC_DELETED_CD ))
 AND ( CH
WHERE (LG.CHILD_LOC_CD=CH.CODE_VALUE) AND (CH.ACTIVE_IND=1 ) AND (CH.BEGIN_EFFECTIVE_DT_TM<=
 CNVTDATETIME ( CURDATE ,  CURTIME3 )) AND (CH.END_EFFECTIVE_DT_TM>= CNVTDATETIME ( CURDATE ,
 CURTIME3 )) AND (CH.ACTIVE_TYPE_CD!= LOC_DELETED_CD ))

ORDER BY LG.SEQUENCE DESC

HEAD REPORT
 I =0
HEAD C.CODE_VALUE
 COL 01 ,C.DESCRIPTION, ROW +1
DETAIL
 QUEUE -> CNT =( QUEUE -> CNT +1 ),
 STAT = ALTERLIST ( QUEUE -> LIST ,  QUEUE -> CNT ),
 I = QUEUE -> CNT ,

WHILE ( ( I >( QUEUE -> PROCESSED +1 )))
 QUEUE -> LIST [ I ]-> CODE_VALUE = QUEUE -> LIST [( I -1 )]-> CODE_VALUE , QUEUE -> LIST [ I ]->
 LEVEL = QUEUE -> LIST [( I -1 )]-> LEVEL , I =( I -1 )

ENDWHILE
,
 QUEUE -> LIST [ I ]-> CODE_VALUE =CH.CODE_VALUE,
 QUEUE -> LIST [ I ]-> LEVEL = PARENT_LEVEL
 WITH  NOCOUNTER , ORAHINT ("index(lg xpklocation_group)" )

END ;Subroutine


SELECT  INTO  $1
 ;LOC = SUBSTRING (1 , 40 , C.DESCRIPTION), ;000 JTW
 LOC = SUBSTRING (1 , 60 , C.DESCRIPTION),  ;000 JTW
 DISP = SUBSTRING (1 , 20 , C.DISPLAY),
 TYPE = SUBSTRING (1 , 12 , C.CDF_MEANING),
 LEVEL = QUEUE -> LIST [D.SEQ]-> LEVEL
FROM ( DUMMYT  D  WITH  SEQ = VALUE ( QUEUE -> CNT )),
( CODE_VALUE  C )
 PLAN ( D )
 AND ( C
WHERE ( QUEUE -> LIST [D.SEQ]-> CODE_VALUE =C.CODE_VALUE) AND (C.CDF_MEANING IN ("FACILITY" ,
"BUILDING" ,
"AMBULATORY" ,
"NURSEUNIT" ,
"ROOM" ,
"BED" )))


HEAD REPORT
 COL 01 ,
 CURDATE "dd-mmm-yyyy;;d"
,
 COL +1 ,
 CURTIME3 "hh:mm;;m"
,
 COL 50 ,
"|" ,
"Location by Facility" ,
 ROW +2 ,
"Type" ,
 COL 5 ,
"|" ,
"Description" ,
 COL 46 ,
"|" ,
"Display" ,
 ROW +2
DETAIL
 TYPE ,
 MYSPACES = FILLSTRING (2 , " " ),
 COL +1 ,
"|" ,

IF ( (C.CDF_MEANING="ROOM" ) )  MYSPACES
ENDIF
,

IF ( (C.CDF_MEANING="BED" ) )  MYSPACES ,  MYSPACES
ENDIF
,
 LOC ,
 COL +1 ,
"|" ,

IF ( (C.CDF_MEANING="ROOM" ) )  MYSPACES
ENDIF
,

IF ( (C.CDF_MEANING="BED" ) )  MYSPACES ,  MYSPACES
ENDIF
,
 DISP ,
 ROW +1
 WITH  NOCOUNTER , MAXCOL =120
 END GO

