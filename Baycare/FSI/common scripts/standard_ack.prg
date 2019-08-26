
 RECORD  TMP
(
 1  STR  =  VC
)

SET  EOSD  =  CHAR ( 13 )
SET  MP  =  FINDSTRING ( "MSH" ,  OEN_REQUEST -> ORG_MSG )

IF (  MP = 0  )
SET  OEN_REPLY -> ACK_STATUS  =  0
CALL ECHO ( "MSH segment not found" )
GO TO  SINGLE_EXIT
ENDIF

SET  SDP  =  FINDSTRING ( EOSD ,  OEN_REQUEST -> ORG_MSG ,  MP )
IF (  SDP = 0  )
SET  OEN_REPLY -> ACK_STATUS  =  0
CALL ECHO ( "MSH end of segment delimiter not found" )
GO TO  SINGLE_EXIT
ENDIF

SET  TMP -> STR  =  SUBSTRING ( MP ,  SDP - MP + 1 ,  OEN_REQUEST -> ORG_MSG )
SET  OEN_REPLY -> OUT_MSG  =  BUILD ( TMP -> STR ,  "MSA|AA|" ,  EOSD ,  CHAR (0))
SET  OEN_REPLY -> ACK_STATUS  =  1
 CALL ECHO ( "oen_reply->out_msg = " ,  0 )
 CALL ECHO ( OEN_REPLY -> OUT_MSG )
# SINGLE_EXIT