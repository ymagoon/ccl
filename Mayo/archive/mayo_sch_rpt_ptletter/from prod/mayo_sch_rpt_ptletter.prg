  drop program mayo_sch_rpt_ptletter:dba go
create program mayo_sch_rpt_ptletter:dba
/************************************************************************
 
        Source file name:       mayo_sch_rpt_ptletter.inc
        Program purpose:        custom patient letter
        SR#1-1914843968
 
 ************************************************************************
 *                      GENERATED MODIFICATION CONTROL LOG              *
 ************************************************************************
 *Mod Date     		Engineer             Comment                        *
 *--- -------- -------------------- ----------------------------------- *
 *000 07/29/08 		Sua Xiong      	Initial release                     *
  001 05/21/2009 	Bharti Jain		Hard coded the facility names
 *002 10/18/11 Rob Banks            Modify to use DB2                   *
 *003 05/23/12      AKCIA           Fixed issues - only 1 PREP showing  *
 *004 05/31/12      AKCIA pel       Removed duplicate Preps             *
 ******************  END OF ALL MODCONTROL BLOCKS  **********************/
 
/*** START 002 ***/
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;*** Write instance ccl ran in to the log file
;SET Iname = fillstring(10," ")
;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;  run_date = format(sysdate,";;q")
; ,Iname = substring(1,7,instance_name)
;FROM v$instance
;DETAIL
;  col  1 run_date
;  col +1 curprog
;  col +1 " *Instance="
;  col +1 Iname
;with nocounter
;   , format
;****************** End of INSTANCE 2 routine ************************
/*** END 002 ***/
 
%i mhs_prg:mayo_sch_parm.inc
;%i cust_script:mayo_sch_parm.inc
call echorecord(sch_parm)
 
free set hold
record hold
(
  1 cnt                   = i4
  1 qual[*]
    2 person_id           = f8
    2 encntr_id           = f8
    2 sch_event_id        = f8
    2 name_last           = vc
    2 name_first          = vc
    2 name_middle         = vc
    2 addr
      3 street_addr1      = vc
      3 street_addr2      = vc
      3 city              = vc
      3 state             = vc
      3 zip               = vc
    2 appt
      3 beg_dt_tm         = dq8
      3 appt_type_cd      = f8
      3 appt_type         = vc
      3 resource_cd       = f8
      3 appt_location_cd  = f8
      3 appt_location	  = vc
      3 appt_loc_phone    = vc
      3 order_md_phone    = vc
      3 appt_bld_cd		  = f8
      3 appt_bld	      = vc
      3 preappt_text      = vc
      3 prep_cnt          = i4  ;003
      3 prep_qual[*]		    ;003
        4 preappt_text    = vc  ;003
      3 desc_value        = vc
      3 desc_heading      = vc
 
)
 
declare foot_person_ind = i2 with protect, noconstant(0)
declare print_page_nbr = i2 with protect, noconstant(0)
 
Declare BUS_PH_TYPE_CD = f8 with protect,constant(UAR_GET_CODE_BY("MEANING", 43, "BUSINESS"))
Declare ADDR_TYPE_CD = f8 with protect,constant(UAR_GET_CODE_BY("MEANING",212,"HOME"))
Call echo("Retrieving appointments...")
;;;declare where_loc = vc                       ;003
;;;declare where_person = vc                    ;003
;;;
;;;;003 start
;;;if (sch_parm->location_cd  > 0)
;;;     set where_loc = concat("a2.appt_location_cd+0 = ", cnvtstring(sch_parm->location_cd))
;;;else
;;;	set where_loc = "1 = 1"
;;;endif
;;;
;;;if (sch_parm->person_id > 0)
;;;     set where_person = concat("a2.person_id+0 = ",cnvtstring(sch_parm->person_id))
;;;else
;;;	set where_person = "1 = 1"
;;;endif
;;;
;;;;003 stop
 
 
SELECT INTO "nl:"
FROM sch_appt a,  ;RESOURCE
  sch_appt a2,  ;PATIENT
  sch_event ev,
  encounter e,
  person p,
  nurse_unit n,
  phone ph
PLAN a WHERE a.beg_dt_tm >= cnvtdatetime(sch_parm->beg_dt_tm)
  AND a.beg_dt_tm <= cnvtdatetime(sch_parm->end_dt_tm)
  AND a.active_ind = 1
  AND a.role_meaning != "PATIENT"
  AND a.state_meaning IN ("CONFIRMED")  ;"CHECKED IN","CHECKED OUT","CANCELED","RESCHEDULED","NOSHOW","VOID","HOLD"
  AND a.primary_role_ind = 1
  AND a.version_dt_tm = cnvtdatetime("31-DEC-2100")
  AND a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN a2 WHERE a2.sch_event_id = a.sch_event_id +0
  AND a2.active_ind = 1
  AND a2.role_meaning = "PATIENT"
  AND a2.state_meaning IN ("CONFIRMED")  ;"CHECKED OUT","CANCELED","RESCHEDULED","NOSHOW","VOID","HOLD"
  AND a2.version_dt_tm = cnvtdatetime("31-DEC-2100")
  AND a2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND a2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  AND sch_parm->location_cd in (0,a2.appt_location_cd)
  AND sch_parm->person_id in (0,a2.person_id)
;;;  AND parser(where_loc)                                          ;003
;;;  AND parser(where_person)                                       ;003
 
 
JOIN ev WHERE ev.sch_event_id = a.sch_event_id +0
  AND sch_parm->appt_type_cd IN (0,ev.appt_type_cd)
JOIN e WHERE e.encntr_id = a2.encntr_id +0
JOIN p WHERE p.person_id = a2.person_id +0
JOIN n WHERE n.location_cd = OUTERJOIN(a2.appt_location_cd)
  AND n.active_ind = OUTERJOIN(1)
  AND n.beg_effective_dt_tm <= OUTERJOIN(cnvtdatetime(curdate,curtime3))
  AND n.end_effective_dt_tm >= OUTERJOIN(cnvtdatetime(curdate,curtime3))
JOIN ph WHERE ph.parent_entity_name = OUTERJOIN("LOCATION")
  AND ph.parent_entity_id = OUTERJOIN(a2.appt_location_cd)
  AND ph.phone_type_cd = OUTERJOIN((BUS_PH_TYPE_CD))
 ; AND ph.phone_type_seq = OUTERJOIN(1)
  AND ph.active_ind = OUTERJOIN(1)
  AND ph.beg_effective_dt_tm <= OUTERJOIN(cnvtdatetime(curdate,curtime3))
  AND ph.end_effective_dt_tm >= OUTERJOIN(cnvtdatetime(curdate,curtime3))
ORDER ev.sch_event_id
HEAD ev.sch_event_id
  hold->cnt = hold->cnt + 1
 
  if (mod(hold->cnt,100) = 1)
    stat = alterlist(hold->qual,hold->cnt+99)
  endif
 
  hold->qual[hold->cnt]->person_id              = p.person_id
  hold->qual[hold->cnt]->encntr_id              = e.encntr_id
  hold->qual[hold->cnt]->sch_event_id           = ev.sch_event_id
  hold->qual[hold->cnt]->name_last              = p.name_last
  hold->qual[hold->cnt]->name_first             = p.name_first
  hold->qual[hold->cnt]->name_middle            = p.name_middle
  hold->qual[hold->cnt]->appt->beg_dt_tm        = a2.beg_dt_tm
  hold->qual[hold->cnt]->appt->appt_type_cd     = ev.appt_type_cd
  hold->qual[hold->cnt]->appt->resource_cd      = a.resource_cd
  hold->qual[hold->cnt]->appt->appt_location_cd = a2.appt_location_cd
  hold->qual[hold->cnt]->appt->appt_location    = UAR_GET_CODE_DISPLAY(a2.appt_location_cd)
  hold->qual[hold->cnt]->appt->appt_bld_cd      = n.loc_building_cd
  ;hold->qual[hold->cnt]->appt->appt_bld         = UAR_GET_CODE_DESCRIPTION(n.loc_building_cd)
 ; hold->qual[hold->cnt]->appt->appt_loc_phone   = cnvtphone(ph.phone_num,ph.phone_format_cd)
  hold->qual[hold->cnt]->appt->appt_type        = UAR_GET_CODE_DESCRIPTION(ev.appt_type_cd)
 
  if (a2.appt_location_cd = 35356699 or a2.appt_location_cd = 24989193 or a2.appt_location_cd = 24989193
   or a2.appt_location_cd = 24989185 or a2.appt_location_cd = 24989214 or a2.appt_location_cd = 24989234)
  hold->qual[hold->cnt]->appt->appt_bld         = "Franciscan Skemp 212 South 11th Street"
  hold->qual[hold->cnt]->appt->appt_loc_phone   = "(608)392-9555"
  elseif (a2.appt_location_cd = 24989223 or a2.appt_location_cd = 24989222 or a2.appt_location_cd = 24989224)
  hold->qual[hold->cnt]->appt->appt_bld         = "Franciscan Skemp Center for Advanced Medicine & Surgery"
  hold->qual[hold->cnt]->appt->appt_loc_phone   = "(608)785-0940"
  elseif (a2.appt_location_cd = 24989201 or a2.appt_location_cd = 24989200 or a2.appt_location_cd = 24989208
   or a2.appt_location_cd = 28989221 or a2.appt_location_cd = 28989232 or a2.appt_location_cd = 24989240)
  hold->qual[hold->cnt]->appt->appt_bld         = "Franciscan Skemp LaCrosse Hospital"
  hold->qual[hold->cnt]->appt->appt_loc_phone   = "(608)785-0940"
  elseif(a2.appt_location_cd = 24989199)
  hold->qual[hold->cnt]->appt->appt_bld         = "Franciscan Skemp Professional Arts Building"
  hold->qual[hold->cnt]->appt->appt_loc_phone   = "(608)785-0940"
  elseif(a2.appt_location_cd = 24989220)
  hold->qual[hold->cnt]->appt->appt_bld         = "Franciscan Skemp Services to Business"
  hold->qual[hold->cnt]->appt->appt_loc_phone   = "(608)785-0940"
  elseif(a2.appt_location_cd = 25049406)
  hold->qual[hold->cnt]->appt->appt_bld         = "Franciscan Skemp 508 5th Avenue South"
  hold->qual[hold->cnt]->appt->appt_loc_phone   = "(608)785-0940"
  elseif(a2.appt_location_cd = 43350142)
  hold->qual[hold->cnt]->appt->appt_bld         = "Franciscan Skemp Onalaska Clinic"
  hold->qual[hold->cnt]->appt->appt_loc_phone   = "(608)785-0940"
  else
  hold->qual[hold->cnt]->appt->appt_bld         = UAR_GET_CODE_DESCRIPTION(n.loc_building_cd)
  hold->qual[hold->cnt]->appt->appt_loc_phone   = cnvtphone(ph.phone_num,ph.phone_format_cd)
  endif
 
  If (cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "LAB*")
  hold->qual[hold->cnt]->appt->desc_value = hold->qual[hold->cnt]->appt->appt_type
  hold->qual[hold->cnt]->appt->desc_heading = "Test"
  ElseIf (cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "BD *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "CT *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "NM *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "IR *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "MA *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "ST *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "FL *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "XR *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "MR *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "PET *"
  	OR cnvtupper(hold->qual[hold->cnt]->appt->appt_type) = "US *")
  hold->qual[hold->cnt]->appt->desc_value = hold->qual[hold->cnt]->appt->appt_type
  hold->qual[hold->cnt]->appt->desc_heading = "Exam"
  Else
  hold->qual[hold->cnt]->appt->desc_value = UAR_GET_CODE_DISPLAY(hold->qual[hold->cnt]->appt->resource_cd)
  hold->qual[hold->cnt]->appt->desc_heading = "Resource"
  Endif
 
 
WITH nocounter
set stat = alterlist(hold->qual,hold->cnt)
 
call echo("Loading addresses...")
 
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  address a
PLAN d
JOIN a WHERE a.parent_entity_name = "PERSON"
  AND a.parent_entity_id = hold->qual[d.seq]->person_id
  AND a.address_type_cd = ADDR_TYPE_CD
  AND a.address_type_seq = 1
  AND a.active_ind = 1
  AND a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
DETAIL
  hold->qual[d.seq]->addr->street_addr1 = a.street_addr
  hold->qual[d.seq]->addr->street_addr2 = a.street_addr2
  hold->qual[d.seq]->addr->city         = a.city
  hold->qual[d.seq]->addr->zip          = a.zipcode
 
  if (a.state_cd > 0)
    hold->qual[d.seq]->addr->state      = UAR_GET_CODE_DISPLAY(a.state_cd)
  else
    hold->qual[d.seq]->addr->state      = a.state
  endif
 
;could have done this instead
;  hold->qual[d.seq]->addr->state        = EVALUATE(a.state_cd,0.0,a.state,UAR_GET_CODE_DISPLAY(a.state_cd))
 
WITH nocounter
 
call echo("Loading ordering physician...")
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  sch_event_detail ed,
  phone ph
PLAN d
JOIN ed WHERE ed.sch_event_id = hold->qual[d.seq]->sch_event_id
  AND ed.oe_field_meaning = "SCHORDPHYS"
  AND ed.active_ind = 1
  AND ed.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND ed.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  AND ed.version_dt_tm = cnvtdatetime("31-DEC-2100")
JOIN ph WHERE ph.parent_entity_name = "PERSON"
  AND ph.parent_entity_id = ed.oe_field_value
  AND ph.phone_type_cd IN (BUS_PH_TYPE_CD)
  AND ph.phone_type_seq = 1
  AND ph.active_ind = 1
  AND ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
DETAIL
  hold->qual[d.seq]->order_md_phone     = cnvtphone(ph.phone_num,ph.phone_format_cd)
 
WITH nocounter
 
;003 start
 DECLARE  HOLD_PREP = VC
 declare cr = vc
 declare lf = vc
 set lf = char(10)
 set cr = char(13)
;003 end
 
call echo ("Loading preappointment info...")
;GET PREAPPT TEXT
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  sch_text_link tl,
  sch_sub_list sl,
  sch_template st,
  long_text_reference lt
PLAN d
JOIN tl WHERE tl.parent_id = hold->qual[d.seq]->appt->appt_type_cd
  and tl.parent2_id = hold->qual[d.seq].appt.appt_location_cd ; CAB 32622, added by m061596 on 8/25
  AND tl.text_type_meaning = "PREAPPT"
  AND tl.sub_text_meaning = "PREAPPT"
  AND tl.version_dt_tm = cnvtdatetime("31-DEC-2100")
  AND tl.active_ind = 1
  AND tl.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
JOIN sl WHERE sl.parent_table = "SCH_TEXT_LINK"
  AND sl.parent_id = tl.text_link_id
  AND sl.version_dt_tm = cnvtdatetime("31-DEC-2100")
;;003  AND sl.seq_nbr = 0
  AND sl.active_ind = 1
  AND sl.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
JOIN st WHERE st.template_id = sl.template_id
  AND st.active_ind = 1
  AND st.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
JOIN lt WHERE lt.parent_entity_name = "SCH_TEMPLATE"
  AND lt.parent_entity_id = st.template_id
  AND lt.long_text_id = st.text_id
  AND lt.active_ind = 1
ORDER BY d.seq, sl.beg_effective_dt_tm DESC
;HEAD d.seq
;  hold->qual[d.seq]->preappt_text = build(hold->qual[d.seq]->preappt_text,lt.long_text,char(13),char(10))
HEAD d.seq        												;003
   HOLD_PREP = ""        										;003
   PREP_CNT = 0        											;003
DETAIL
;003  hold->qual[d.seq]->preappt_text = build(hold->qual[d.seq]->preappt_text,lt.long_text,char(13),char(10))
   hold->qual[d.seq].PREP_CNT = hold->qual[d.seq].PREP_CNT + 1  ;003
   PREP_CNT = PREP_CNT + 1                                      ;003
   stat = alterlist(hold->qual[d.seq].prep_qual,hold->qual[d.seq].prep_cnt)	;003
   hold->qual[d.seq].prep_qual[hold->qual[d.seq].prep_cnt].preappt_text = lt.long_text    	;003
   HOLD_PREP = CONCAT (TRIM(HOLD_PREP),                                                     ;003
                        build(hold->qual[d.seq]->preappt_text,lt.long_text,                 ;003
                        " ",                                                                ;003
                        char(10),                                                           ;003
                        char(13)                                                            ;003
                        )                                                                   ;003
                        )                                                                   ;003
 
 
FOOT D.SEQ                                                                                  ;003
 
   hold->qual[d.seq]->preappt_text =  HOLD_PREP                                             ;003
WITH nocounter
 
 DECLARE  HOLD_PREP = VC
 
call echo ("Loading order prep info...")
;GET PREAPPT TEXT ORDER LEVEL
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  sch_event_attach sea,
  orders o,
  sch_text_link tl,
  sch_sub_list sl,
  sch_template st,
  long_text_reference lt
PLAN d
JOIN sea WHERE sea.sch_event_id = hold->qual[d.seq]->sch_event_id
  AND sea.attach_type_meaning = "ORDER"
  AND sea.state_meaning = "ACTIVE"
  AND sea.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
  AND sea.active_ind = 1
  AND sea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND sea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN o WHERE o.order_id = sea.order_id +0
JOIN tl WHERE tl.parent_id = o.catalog_cd +0
  AND tl.parent_table = "CODE_VALUE"
  AND tl.parent2_id = hold->qual[d.seq].appt.appt_location_cd
  AND tl.parent2_table = "CODE_VALUE"
  AND tl.text_type_meaning = "PREAPPT"
  AND tl.sub_text_meaning = "PREAPPT"
  AND tl.version_dt_tm = cnvtdatetime("31-DEC-2100")
  AND tl.active_ind = 1
  AND tl.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
JOIN sl WHERE sl.parent_table = "SCH_TEXT_LINK"
  AND sl.parent_id = tl.text_link_id
  AND sl.version_dt_tm = cnvtdatetime("31-DEC-2100")
;003  AND sl.seq_nbr = 0
  AND sl.active_ind = 1
  AND sl.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
JOIN st WHERE st.template_id = sl.template_id
  AND st.active_ind = 1
  AND st.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
JOIN lt WHERE lt.parent_entity_name = "SCH_TEMPLATE"
  AND lt.parent_entity_id = st.template_id
  AND lt.long_text_id = st.text_id
  AND lt.active_ind = 1
ORDER BY d.seq, sl.beg_effective_dt_tm DESC, lt.long_text_id
HEAD d.seq                                                                        ;003
   HOLD_PREP = ""                                                                 ;003
   PREP_CNT = 0                                                                 ;003
;DETAIL
;003  hold->qual[d.seq]->preappt_text = build(hold->qual[d.seq]->preappt_text,lt.long_text,char(13),char(10))
;003 start block -
;003 ;previous code was alway overwritting -
;003 ;added prep_qual to record structure due to report wirter not formatting concated lines correctly.
;003 ;Layout has several checks on preappt_text , so left text there as well
head lt.long_text_id ;004
   hold->qual[d.seq].PREP_CNT = hold->qual[d.seq].PREP_CNT + 1
   stat = alterlist(hold->qual[d.seq].prep_qual,hold->qual[d.seq].prep_cnt)
   hold->qual[d.seq].prep_qual[hold->qual[d.seq].prep_cnt].preappt_text = lt.long_text
 
	PREP_CNT = PREP_CNT + 1
   HOLD_PREP = CONCAT (TRIM(HOLD_PREP),
   						build(":",prep_cnt,":"),
                        build(hold->qual[d.seq]->preappt_text,lt.long_text,
                        " ",
                        char(10),
                        char(13),
                        " "
                        ))
FOOT D.SEQ
   hold->qual[d.seq]->preappt_text =  BUILD (
   											  hold->qual[d.seq]->preappt_text,
   											  HOLD_PREP)
;003 stop block -
 
WITH nocounter
 
 
 for ( x = 1 to size(hold->qual,5))
   if (hold->qual[x].PREP_CNT = 0 )
    set  hold->qual[x].PREP_CNT = 1
    set stat = alterlist(hold->qual[x].prep_qual,hold->qual[x].prep_cnt)
   endif
 endfor
 
;set stat = alterlist(hold->qual,1)
 
Call echorecord (hold)
 
Execute reportrtl
%i mhs_prg:mayo_sch_rpt_ptletter.dvl
;%i cust_script:mayo_sch_rpt_ptletter.dvl
set _SendTo=$1
 
if (cnvtlower(substring(1,10,_SendTo)) = "cer_print/"
  and cnvtlower(substring(textlen(_SendTo)-3,4,_SendTo)) != ".dat")
  set _SendTo = concat(_SendTo,".dat")
endif
 
call LayoutQuery(0)
 
/*** START 002 ***/
;*** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
/*** END 002 ***/
 
end
go
