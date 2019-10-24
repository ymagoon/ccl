drop program bc_mp_ed_pt_info:dba go
create program bc_mp_ed_pt_info:dba
/**************************************************************************************************
              Purpose: bc_mp_ed_pt_info
     Source File Name: bc_mp_ed_pt_info
              Analyst: bc_mp_ed_pt_info
          Application: FirstNet
  Execution Locations: FirstNet
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   12/30/2013		DeAnn Capanna			WO# 1047281 - Add patient name, fin, dob to printout


**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

RECORD  PTINFO 
(
	1 PT_NAME	= vc
	1 PT_FIN    = vc
	1 PT_DOB	= vc
)

SELECT  INTO "NL:"

FROM ENCOUNTER E
	, person p
	, encntr_alias ea

plan e	
	WHERE E.encntr_id = $ENCNTRID 
	  AND E.active_ind = 1

join p
	where p.person_id = e.person_id
	  and p.active_ind = 1

join ea
	where ea.encntr_id = e.encntr_id
	  and ea.encntr_alias_type_cd = 1077.00
	  and ea.active_ind = 1

order by
	e.encntr_id	

HEAD report
	
	PTINFO->PT_NAME = trim(p.name_full_formatted)
	PTINFO->PT_FIN = trim(ea.alias)
	PTINFO->PT_DOB = format(p.birth_dt_tm,"mm/dd/yyyy;;d")

WITH NOCOUNTER
call echorecord(PTINFO)

call echojson(PTINFO, $OUTDEV)
end
go
