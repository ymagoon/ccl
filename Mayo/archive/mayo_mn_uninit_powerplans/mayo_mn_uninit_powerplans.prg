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
 002    10/04/13        JTW / M026751       Increase Nurse Unit display from 8 to
                                            20 characters
 003    10/09/13        JTW / M026751       Change time to look back to ~14 hours
 004    10/23/13        JTW / M026751       1) Add Sub Phase Plan column
                                            2) Filter by encounter types of Inpatient,
                                               Observation, Day Surgery & Hospital
                                               Outpatient
                                            3) Remove 14 hour look back
                                            4) Exclude Test patients
 005     02/10/14       JTW / M026751       Add Swingbed encounter type
 006     03/19/14		Akcia-SE			Make header print even when no data qualifies
 											Remove LASF Day Surgery and LASF Endoscopy
 007     05/01/14       JTW / M026751       Request to remove the following locations from the report:
                                            Mankato: MAIJ Endoscopy, MAIJ Intervent, MAIJ ISDC, MAIJ SDC,
                                                     MAIJ CT
                                            Fairmont: FAFH SDS
                                            New Prague: MAQN SDS
                                            St James: MAJH Endoscopy, MAJH SDC
                                            Springfield: MASH SDC
                                            Waseca: MAWH SDC
                                            Albert Lea: ALNH ASU
                                            Austin: AUHO OR, AUHO Psych
                                            Cannon Valley: CAMH Surgery OP
                                            Lake City: LCMC Same Day Surgery
                                            Red Wing: RWHO SDS, RWHO Pre-op, RWHO PACU
 											Eau Clair: EULH Anticoag, EULH CATH LAB, EULH ED ALT EULH SRG TCH PREP, EULH SURGERY CTR
 											La Crosse: LASH Day Surgery
 008     05/27/14       JTW / M026751       Add AUHOPSYCH back into report
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
declare lasf_day_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "LASFDAYSURG"))		;006
declare lasf_endo_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "LASFENDOSCOPY"))		;006
/* JTW exclude more nurse units begin 007*/
declare MAIJENDOSCOPY_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAIJENDOSCOPY"))		;007
declare MAIJINTERVENT_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAIJINTERVENT"))		;007
declare MAIJISDC_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAIJISDC"))		;007
declare MAIJSDC_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAIJSDC"))		;007
declare MAIJCT_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAIJCT"))		;007
declare FAFHSDS_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "FAFHSDS"))		;007
declare MAQNSDS_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAQNSDS"))		;007
declare MAJHENDOSCOPY_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAJHENDOSCOPY"))		;007
declare MAJHSDC_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAJHSDC"))		;007
declare MASHSDC_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MASHSDC"))		;007
declare MAWHSDC_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MAWHSDC"))		;007
declare ALNHASU_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "ALNHASU"))		;007
declare AUHOOR_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "AUHOOR"))		;007
;;declare AUHOPSYCH_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "AUHOPSYCH"))		;007  ;008
declare LCMCSAMEDAYSRG_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "LCMCSAMEDAYSRG"))		;007
declare EULHANTICOAG_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "EULHANTICOAG"))		;007
declare EULHCATHLAB_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "EULHCATHLAB"))		;007
declare EULHEDALT_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "EULHEDALT"))		;007
declare EULHSRGPREPREC_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "EULHSRGPREPREC"))		;007
declare EULHSURGERYCTR_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "EULHSURGERYCTR"))		;007
declare EULHINTERVRAD_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "EULHINTERVRAD"))		;007
declare LASHDAYSURG_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "LASHDAYSURG"))		;007
declare CAMHSURGERYOP_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "CAMHSURGERYOP"))		;007
declare RWHOPREOPERATIVE_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "RWHOPREOPERATIVE"))		;007
declare RWHOPACU_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "RWHOPACU"))		;007
declare RWHOSDS_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "RWHOSDS"))		;007
declare RWHOPREOP_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "RWHOPREOP"))		;007
/* JTW exclude more nurse units end 007*/
 
; 004 2) Filter by encounter types BEGIN JTW
declare inpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "INPATIENT"))
declare observation_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "OBSERVATION"))
declare daysurgery_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "DAYSURGERY"))
declare HospOutPatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "HOSPITALOUTPATIENT"))
declare Swingbed_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "SWINGBED"))  ;005
; 004 2) Filter by encounter types END JTW
 
SELECT INTO $OUTDEV
        P_PW_STATUS_DISP = UAR_GET_CODE_DISPLAY( P.PW_STATUS_CD ),
        E_LOC_NURSE_UNIT_DISP = UAR_GET_CODE_DISPLAY( E.LOC_NURSE_UNIT_CD ),
        PE.NAME_FULL_FORMATTED,
        P.DESCRIPTION,
        TIME = format(P.UPDT_DT_TM,";;Q"),
        fin = cnvtalias(ea.alias,ea.alias_pool_cd),
        PC.Sub_Phase_Ind  ; 004 1) Add Sub_Phase column JTW
 
FROM
        PATHWAY  P,
        PATHWAY_CATALOG PC, ; 004 1) Add Sub_Phase column JTW
        ENCOUNTER  E,
        PERSON  PE,
        encntr_alias ea
 
PLAN P  WHERE  P.PW_STATUS_CD = planned_cd
 
/* 004 3) Remove 14 hour lookback begin JTW
 
;003 Begin 1400 - 14 hours, 40 minutes  JTW
;and p.updt_dt_tm between cnvtdatetime(curdate,curtime-1150) and cnvtdatetime(curdate, curtime )
and p.updt_dt_tm between cnvtdatetime(curdate,curtime-1400) and cnvtdatetime(curdate, curtime )
;003 End JTW
 
004 3) Remove 14 hour lookback end JTW  */
 
and p.pathway_type_cd =	medical_cd							;001
JOIN E WHERE  E.ENCNTR_ID =  P.ENCNTR_ID
;AND E.LOC_NURSE_UNIT_CD = $NUNIT
and e.loc_facility_cd = $hospital
and e.disch_dt_tm is null
; 004 2) Filter by encounter types BEGIN JTW
and e.encntr_type_cd IN(inpatient_cd,observation_cd,daysurgery_cd,HospOutPatient_cd,Swingbed_cd)  ;005
; 004 2) Filter by encounter types END JTW
and E.active_ind = 1
and not e.loc_nurse_unit_cd in (lasf_day_cd,lasf_endo_cd,   ;006
                                MAIJENDOSCOPY_cd,MAIJINTERVENT_cd,MAIJISDC_cd,MAIJSDC_cd,MAIJCT_cd,FAFHSDS_cd, ;007
                                MAQNSDS_cd,MAJHENDOSCOPY_cd,MAJHSDC_cd,MASHSDC_cd,MAWHSDC_cd,ALNHASU_cd,AUHOOR_cd, ;007
                                ;;AUHOPSYCH_cd,  ;008
                                LCMCSAMEDAYSRG_cd,RWHOSDS_cd,EULHANTICOAG_cd, LASHDAYSURG_cd, ;007
                                EULHCATHLAB_cd, EULHEDALT_cd, EULHSRGPREPREC_cd, EULHSURGERYCTR_cd, EULHINTERVRAD_cd, ;007
                                CAMHSURGERYOP_CD, RWHOPREOPERATIVE_CD, RWHOPACU_CD, RWHOPREOP_CD ;007
                                )
 
; 004 1) Add Sub_Phase column Begin JTW
JOIN PC WHERE PC.pathway_catalog_id = P.pathway_catalog_id
        AND PC.active_ind = 1
; 004 1) Add Sub_Phase column End JTW
 
JOIN PE
WHERE  E.PERSON_ID =  PE.PERSON_ID
AND    cnvtupper(PE.name_full_formatted) NOT LIKE '%TEST%' ; 004 4) Exclude Test patients JTW
 
join ea
where ea.encntr_id = e.encntr_id
  and ea.encntr_alias_type_cd = fin_cd
  and ea.end_effective_dt_tm > sysdate
  and ea.active_ind = 1
 
 
ORDER BY  E_LOC_NURSE_UNIT_DISP,
          fin,
          PE.NAME_FULL_FORMATTED,
          P_PW_STATUS_DISP
 
Head Report
		first_time = "Y"
        y_pos = 18
        dcnt = 0   ;006
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
        CALL PRINT(CALCPOS(525,y_pos+11)) "{U}Sub-Phase{ENDU}{ENDB}"  ; 004 1) Add Sub_Phase column JTW
        ;ROW + 1
        y_pos = y_pos + 17
        first_time = "Y"
 
 
Head E_LOC_NURSE_UNIT_DISP
        if (first_time = "N")
          ;y_pos = y_pos + 20
          stat = 0
 		endif
 		first_time = "N"
 
;Head PE.NAME_FULL_FORMATTED  :JTW to correct multiple FIN numbers per patient
Head fin
        ;y_pos = y_pos +24
        NAME_FULL_FORMATTED1 = SUBSTRING( 1, 20, PE.NAME_FULL_FORMATTED ),
        E_LOC_NURSE_UNIT_DISP1 = SUBSTRING( 1, 20, E_LOC_NURSE_UNIT_DISP ),  ;002
        ROW + 1, "{CPI/14}"
        CALL PRINT(CALCPOS(20,y_pos+11)) fin
        ROW + 1,
         CALL PRINT(CALCPOS(90,y_pos+11)) NAME_FULL_FORMATTED1
        ROW + 1,
        CALL PRINT(CALCPOS(214,y_pos+11)) E_LOC_NURSE_UNIT_DISP1
        ROW + 1
        ;y_pos = y_pos + 23
 
Detail
		dcnt = dcnt + 1  ;006
        ; 004 1) Add Sub_Phase column Begin Formatting JTW
        if (PC.Sub_Phase_Ind = 1)
          SUB_PHASE = "Yes"
        else
          SUB_PHASE = "No"
 		endif
 		; 004 1) Add Sub_Phase column End Formatting JTW
        if (( y_pos + 66) >= 792 ) y_pos = 0,  break endif
        ;y_pos = y_pos +12
        DESCRIPTION1 = SUBSTRING( 1, 45, P.DESCRIPTION ),
        ROW + 1,
        CALL PRINT(CALCPOS(330,y_pos+11)) DESCRIPTION1
        ; 004 1) Add Sub_Phase column Begin JTW
        CALL PRINT(CALCPOS(545,y_pos+11)) SUB_PHASE
        ; 004 1) Add Sub_Phase column End JTW
        y_pos = y_pos + 14
 
 
Foot PE.NAME_FULL_FORMATTED
        y_pos = y_pos + 0
 
Foot E_LOC_NURSE_UNIT_DISP
        y_pos = y_pos + 0
 
Foot Page
    if (dcnt =0)													;006
      CALL PRINT(CALCPOS(20,y_pos+11)) "{B}NO DATA FOUND{ENDB}"		;006
    endif															;006
	y_pos = 565
	ROW + 1, "{F/0}{CPI/15}"
    page_Count = concat( "Page: ", cnvtstring(curpage) )  ;2
	ROW + 1, CALL PRINT(CALCPOS(18,y_pos+12)) 	page_Count
 
	ROW + 1, "{F/0}{CPI/15}"
	ROW + 1, CALL PRINT(CALCPOS(100,y_pos+12)) curdate  ;2
	ROW + 1, CALL PRINT(CALCPOS(150,y_pos+12)) curtime  ;2
 
WITH MAXREC = 10000000, MAXCOL = 300, MAXROW = 500 , DIO = 08, NOHEADING, FORMAT= VARIABLE, TIME= VALUE( MaxSecs )
 ,nullreport  ;006
#END_PROGRAM
 
 
END
GO
 
