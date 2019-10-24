drop program bc_mp_ed_gv_iso:dba go
create program bc_mp_ed_gv_iso:dba
/**************************************************************************************************
              Purpose: bc_mp_ed_gv_iso
     Source File Name: bc_mp_ed_gv_iso
              Analyst: bc_mp_ed_gv_iso
          Application: FirstNet
  Execution Locations: FirstNet
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   04/03/2013		Vincent Do	bc_mp_ed_gv_iso (isolation for ED Patient)


**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"
	, "ENCNTRID" = 0 

with OUTDEV, ENCNTRID


RECORD  ISOLATION 
(
	1 ISOLATION	= vc
)

SELECT  INTO "NL:"

FROM ENCOUNTER E
WHERE E.encntr_id = $ENCNTRID 
AND E.active_ind = 1
	
DETAIL
	IF (E.isolation_cd = 0.0)
		ISOLATION->ISOLATION = "No Isolation Found!"
	ELSE
		ISOLATION->ISOLATION  = UAR_GET_CODE_DISPLAY(E.isolation_cd)
	ENDIF
WITH NOCOUNTER

call echojson(ISOLATION, $OUTDEV)
end
go
