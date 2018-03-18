/************************************************************************
          Date Written:       01/11/10
          Source file name:   mayo_mn_pco_res_let_prov.prg
          Object name:        mayo_mn_pco_res_let_prov
          Request #:
 
          Product:            ExploreMenu
          Product Team:
          HNA Version:        V500
          CCL Version:
 
          Program purpose:    Driver program for provider prompt for program
          											mayo_mn_pco_result_letter_bj
 
          Tables read:
 
          Tables updated:     None
 
          Executing from:     Explorer Menu
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 01/11/10 Akcia      initial release       *
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
DROP PROGRAM mayo_mn_pco_res_let_prov:dba GO
CREATE PROGRAM mayo_mn_pco_res_let_prov:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start Date:" = CURDATE
	, "End Date:" = CURDATE
	, "Patient" = 0
	;<<hidden>>"Search" = ""
	;<<hidden>>"Remove" = ""
	, "Select results NOT to show" = 0
 
with OUTDEV, SDATE, EDATE, lstPerson, results_not_show
 
 
declare provider_id = f8 with protect, noconstant(reqinfo->updt_id)
 
 
 
execute mayo_mn_pco_result_letter_bj $outdev,$sdate,$edate,$lstPerson,$results_not_show,provider_id
 
 
 
 
 
end go
