DROP PROGRAM mayo_mn_uninit_powerplans GO
CREATE PROGRAM mayo_mn_uninit_powerplans
 
/****************************************************************************
 
 Copy of hosp_plan_status_prompt.prg from Jacksonville.  Modified to work for
 Rochester.
 
 Program purpose:  This report produces a report of powerplans in a planned s
                                        status.
 
 Executing from: Explorer Menu
 
*****************************************************************************
                        MODIFICATION CONTROL LOG
*****************************************************************************
 Mod    Date            Engineer           Comment
 ---    --------        -----------------  -----------------------------
 000    12/12/11		Akcia - SE			Copy of hosp_plan_status_prompt.prg
 											from Jacksonville.
 001    05/04/12		Akcia - SE			add code to only pull medical plans
****************END OF ALL MODCONTROL BLOCKS*******************************/
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Select Hospital" = 0
 
with OUTDEV, hospital
 
;Request HNAM sign-on when executed from CCL on host
IF (VALIDATE(IsOdbc, 0) = 0)  EXECUTE CCLSECLOGIN  ENDIF
 
SET _SEPARATOR=^^       ; applies to VisualExplorer query mode
 
IF (VALIDATE(IsOdbc,0)= 0) SET _SEPARATOR=^ ^ ENDIF     ; applies to query mode in other apps
 
SET MaxSecs = 0
IF (VALIDATE(IsOdbc, 0) = 1)  SET MaxSecs = 15  ENDIF
 
declare planned_cd = f8 with protect, constant(uar_get_code_by("MEANING", 16769, "PLANNED"))
declare fin_cd = f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare medical_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 30183, "MEDICAL"))		;001
 
 
SELECT INTO $OUTDEV
        P_PW_STATUS_DISP = UAR_GET_CODE_DISPLAY( P.PW_STATUS_CD ),
        E_LOC_NURSE_UNIT_DISP = UAR_GET_CODE_DISPLAY( E.LOC_NURSE_UNIT_CD ),
        PE.NAME_FULL_FORMATTED,
        P.DESCRIPTION,
        TIME = format(P.UPDT_DT_TM,";;Q"),
        fin = cnvtalias(ea.alias,ea.alias_pool_cd)
 
FROM
        PATHWAY  P,
        ENCOUNTER  E,
        PERSON  PE,
        encntr_alias ea
 
PLAN P  WHERE  P.PW_STATUS_CD = planned_cd
;and p.updt_dt_tm between cnvtdatetime(curdate,curtime-1150) and cnvtdatetime(curdate, curtime )
and p.updt_dt_tm between cnvtdatetime(curdate,curtime-1400) and cnvtdatetime(curdate, curtime )
and p.pathway_type_cd =	medical_cd							;001
JOIN E WHERE  E.ENCNTR_ID =  P.ENCNTR_ID
;AND E.LOC_NURSE_UNIT_CD = $NUNIT
and e.loc_facility_cd = $hospital
and E.active_ind = 1
 
JOIN PE WHERE  E.PERSON_ID =  PE.PERSON_ID
 
join ea
where ea.encntr_id = e.encntr_id
  and ea.encntr_alias_type_cd = fin_cd
  and ea.end_effective_dt_tm > sysdate
  and ea.active_ind = 1
 
 
ORDER BY  E_LOC_NURSE_UNIT_DISP,
          PE.NAME_FULL_FORMATTED,
          P_PW_STATUS_DISP
 
Head Report
		first_time = "Y"
        y_pos = 18
SUBROUTINE OFFSET( yVal )
        CALL PRINT( FORMAT( y_pos + yVal, "###" ))
END
        ROW + 1, "{F/8}{CPI/10}"
        CALL PRINT(CALCPOS(208,y_pos+11)) "PowerPlans in a Planned Status"
        ROW + 1
        y_pos = y_pos + 27
 
Head Page
        if (curpage > 1)  y_pos = 18 endif
        ROW + 1, "{F/8}{CPI/11}"
        CALL PRINT(CALCPOS(20,y_pos+11)) "{U}FIN{ENDU}"
        CALL PRINT(CALCPOS(90,y_pos+11)) "{U}Patient Name{ENDU}"
        CALL PRINT(CALCPOS(214,y_pos+11)) "{U}Nursing Unit{ENDU}"
        CALL PRINT(CALCPOS(330,y_pos+11)) "{U}Phase Name{ENDU}{ENDB}"
        ;ROW + 1
        y_pos = y_pos + 17
        first_time = "Y"
 
Head E_LOC_NURSE_UNIT_DISP
        if (first_time = "N")
          y_pos = y_pos + 20
 		endif
 		first_time = "N"
 
Head PE.NAME_FULL_FORMATTED
        ;y_pos = y_pos +24
        NAME_FULL_FORMATTED1 = SUBSTRING( 1, 20, PE.NAME_FULL_FORMATTED ),
        E_LOC_NURSE_UNIT_DISP1 = SUBSTRING( 1, 8, E_LOC_NURSE_UNIT_DISP ),
        ROW + 1, "{CPI/14}"
        CALL PRINT(CALCPOS(20,y_pos+11)) fin
        ROW + 1,
         CALL PRINT(CALCPOS(90,y_pos+11)) NAME_FULL_FORMATTED1
        ROW + 1,
        CALL PRINT(CALCPOS(214,y_pos+11)) E_LOC_NURSE_UNIT_DISP1
        ROW + 1
        ;y_pos = y_pos + 23
 
Detail
        if (( y_pos + 66) >= 792 ) y_pos = 0,  break endif
        ;y_pos = y_pos +12
        DESCRIPTION1 = SUBSTRING( 1, 60, P.DESCRIPTION ),
        ROW + 1,
        CALL PRINT(CALCPOS(330,y_pos+11)) DESCRIPTION1
        y_pos = y_pos + 14
 
Foot PE.NAME_FULL_FORMATTED
        y_pos = y_pos + 0
 
Foot E_LOC_NURSE_UNIT_DISP
        y_pos = y_pos + 0
 
WITH MAXREC = 10000000, MAXCOL = 300, MAXROW = 500 , DIO = 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs )
 
#END_PROGRAM
 
 
END
GO
 
