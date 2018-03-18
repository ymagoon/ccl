/*******************************************************************
 
Report Name:  Charges Out
Report Description:  Displays FIN for Charges sent out of selected interface
						(used for troubleshooting balancing issues)
 
Created by:  Mary Wiersgalla
Created date:  10/2010
 
Modified by:
Modified date:
Modifications:
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
drop program 1_dft_audit:dba go
create program 1_dft_audit:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "interface" = ""
	, "start date" = CURDATE
	, "end date" = CURDATE
 
with OUTDEV, interface, sdate, edate
 
SET  MAXSEC  =  60
 
SET facility = value(concat(" ",trim($interface,3)))
 
SET beg_dt = $sdate
SET end_dt = $edate
 
/* Parse HL7 */
DECLARE  AMY_PARSE (( HL7STRING = VC ), ( WHATSEGMENT = I4 ), ( SUBSEGMENT = I4 )) =  VC
 
SUBROUTINE   AMY_PARSE  ( HL7STRING ,  WHATSEGMENT ,  SUBSEGMENT  )
 
SET  V_SEGMENT  =  1
SET  V_BAR1  =  FINDSTRING ( "|" ,  HL7STRING ,  1 )
SET  V_BAR2  =  FINDSTRING ( "|" ,  HL7STRING , ( V_BAR1 + 1 ))
WHILE ( ( V_SEGMENT < WHATSEGMENT ))
 
SET  V_BAR1  =  V_BAR2
SET  V_BAR2  =  FINDSTRING ( "|" ,  HL7STRING , ( V_BAR1 + 1 ))
SET  V_SEGMENT  = ( V_SEGMENT + 1 )
 
ENDWHILE
 
SET  V_LEN  = ( V_BAR2 - V_BAR1 )
SET  V_RESULT  =  SUBSTRING (( V_BAR1 + 1 ), ( V_LEN - 1 ),  HL7STRING )
IF ( ( SUBSEGMENT > 0 ) AND ( SUBSEGMENT < 4 ) )
SET  V_SUBSEGMENT  =  1
SET  V_CARET1  =  0
SET  V_CARET2  =  FINDSTRING ( "^" ,  V_RESULT , ( V_CARET1 + 1 ))
WHILE ( ( V_SUBSEGMENT < SUBSEGMENT ))
 
SET  V_CARET1  =  V_CARET2
SET  V_CARET2  =  FINDSTRING ( "^" ,  V_RESULT , ( V_CARET1 + 1 ))
SET  V_SUBSEGMENT  = ( V_SUBSEGMENT + 1 )
 
ENDWHILE
 
SET  V_LEN  = ( V_CARET2 - V_CARET1 )
SET  V_SUBRESULT  =  SUBSTRING (( V_CARET1 + 1 ), ( V_LEN - 1 ),  V_RESULT )
SET  V_RESULT  =  V_SUBRESULT
ENDIF
 
IF ( ( SUBSEGMENT = 4 ) )
SET  V_RESULT1  =  V_RESULT
SET  V_LENGTH  = ( V_BAR2 - V_BAR1 )
SET  V_RESULT2  =  SUBSTRING (( V_LENGTH - 2 ),  2 ,  V_RESULT1 )
IF ( ( SUBSTRING ( 2 ,  1 ,  V_RESULT2 )= "^" ) )
SET  V_RESULT2  =  " "
ENDIF
 
SET  V_RESULT  =  V_RESULT2
ENDIF
 RETURN ( V_RESULT )
 
 
END ;Subroutine
 
 
SELECT  INTO $outdev
FIN = SUBSTRING ( 1 ,  15 ,  AMY_PARSE (O.MSG_TEXT,  30 ,  1 ))
/*, CDM_1 = SUBSTRING ( 1 ,  15 ,  AMY_PARSE (O.MSG_TEXT,  93 ,  1 )),
CDM_2 = SUBSTRING ( 1 ,  15 ,  AMY_PARSE (O.MSG_TEXT,  88 ,  1 )),
CDM_3 = SUBSTRING ( 1 ,  15 ,  AMY_PARSE (O.MSG_TEXT,  94 ,  1 )),
CDM_4 = SUBSTRING ( 1 ,  15 ,  AMY_PARSE (O.MSG_TEXT,  90 ,  1 ))*/
FROM  OEN_TXLOG  O
WHERE  O.CREATE_DT_TM BETWEEN cnvtdatetime(cnvtdate(beg_dt),230000)
AND cnvtdatetime(cnvtdate(end_dt),235959)
AND O.INTERFACEID = facility
 
ORDER BY FIN
 
WITH TIME = VALUE( MAXSEC ), FORMAT, SKIPREPORT = 1, Separator = " "
 
END
GO
