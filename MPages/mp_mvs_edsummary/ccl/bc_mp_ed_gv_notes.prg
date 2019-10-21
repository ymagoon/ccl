drop program bc_mp_ed_gv_notes:dba go
create program bc_mp_ed_gv_notes:dba
/**************************************************************************************************
              Purpose: Displays the Nurses Note  to an MPage
     Source File Name: bc_mp_ed_gv_notes.PRG
              Analyst: Vincent D
          Application: FirstNet
  Execution Locations: FirstNet
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   06/09/2011     V. Do    Initial Release

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, ENCNTRID

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/


declare EXPLANATION_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",72,"EXPLANATION")),protect
declare NOTIFICATIONS_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",72,"NOTIFICATIONS")),protect


declare TESTENV_IND			= i1 with protect, constant(evaluate(currdbname, "P30", 0, 1))

;50349186

DECLARE  OCFCOMPRESSION_VAR  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("MEANING" , 120 , "OCFCOMP" ))
, PROTECT

SET  BLOBOUT  =  FILLSTRING (32768 , " " )

SET  BLOBNORTF  =  FILLSTRING (32768 , " " )

SET  BSIZE  = 0


FREE RECORD TEMP
RECORD TEMP (
1 rec_cnt = i4
1 rec[*]
	2 NOTE_TYPE = vc
	2 NOTE[*]
		3 DESC = vc
		3 AUTHOR = vc
		3 DT = vc

			)
select INTO "NL:"
	 	ce.encntr_id,  
		ce.event_id,
		ce.clinical_event_id,
	    CE.event_cd,
		Note_Type = uar_get_code_display(ce.event_cd), 
;		ce.result_val, 
;		ce.event_title_text,
;
		DT = FORMAT(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm"),
;		result =uar_get_code_display( ce.result_status_cd),
		pr.name_full_formatted,
		 BLOBIN = TRIM (CB.BLOB_CONTENTS),
		 TEXTLEN = TEXTLEN (CB.BLOB_CONTENTS)
from clinical_event ce,
	prsnl pr,
	ce_blob cb
plan ce
where ce.encntr_id =   $ENCNTRID ; 50349186.00
	AND CE.event_cd in (  NOTIFICATIONS_VAR,   EXPLANATION_VAR) ;EXPLAINATION, NOFICATION
	and ce.result_status_cd in (25.0, 34.0, 35.0)
	and ce.view_level = 1
join pr
	where ce.performed_prsnl_id = pr.person_id
join cb
	where cb.event_id = OUTERJOIN(ce.event_id)
	
HEAD REPORT
		rcnt = 0
HEAD CE.event_cd
	rcnt = rcnt + 1
	if(mod(rcnt, 10) = 1)
		stat = alterlist(temp->rec, rcnt + 9)
	endif
	
	temp->rec[rcnt].NOTE_TYPE = Note_Type
	
	icnt = 0
DETAIL
	icnt = icnt + 1
	if(mod(icnt, 10) = 1)
		stat = alterlist(temp->rec[rcnt].NOTE, icnt + 9)
	endif
		
	temp->rec[rcnt].NOTE[icnt].AUTHOR = pr.name_full_formatted
	temp->rec[rcnt].NOTE[icnt].DT = DT
	
	IF (CE.event_cd = NOTIFICATIONS_VAR)
		temp->rec[rcnt].NOTE[icnt].DESC = ce.result_val
	ELSEIF (CE.event_cd = EXPLANATION_VAR)
	
	BLOB_UN = UAR_OCF_UNCOMPRESS (CB.BLOB_CONTENTS,  TEXTLEN ,  BLOBOUT ,  SIZE ( BLOBOUT ), 32768 )
	STAT = UAR_RTF ( BLOBOUT ,  SIZE ( BLOBOUT ),  BLOBNORTF ,  SIZE ( BLOBNORTF ),  BSIZE , 0 )
;	 blobout = substring(30, 50, blobout)
	txt_len = (TEXTLEN - 110)
	blobout = substring(110, txt_len, blobout)
	blobout = replace(blobout, "\par","",0)
	blobout = replace(blobout, "}","",0)
		temp->rec[rcnt].NOTE[icnt].DESC =blobout 
		 
		 
	ENDIF
	
FOOT CE.event_cd
	stat = alterlist(temp->rec[rcnt].NOTE, icnt)
	
FOOT REPORT
	temp->rec_cnt = rcnt
	stat = alterlist(temp->rec, temp->rec_cnt)
	
with format, time = 30

if(TESTENV_IND)
	call echorecord(temp)
endif


call echojson(TEMP, $OUTDEV)
end
go
