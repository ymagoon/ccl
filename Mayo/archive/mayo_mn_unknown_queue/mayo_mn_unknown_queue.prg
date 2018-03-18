/************************************************************************
          Date Written:       04/01/11
          Source file name:   mayo_mn_unknown_queue.prg
          Object name:        mayo_mn_unknown_queue
          CAB #:
 
          Program purpose:   unknown queue report
 
          Executing from:     Explorer Menu
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 04/27/11 Akcia      initial release                              *
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
  drop program mayo_mn_unknown_queue go
create program mayo_mn_unknown_queue
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
declare pending_cd = f8 with protect, constant(uar_get_code_by("MEANING", 23018, "PENDING"))
declare attach_type_cd = f8 with protect, constant(uar_get_code_by("MEANING", 16110, "ORDER"))
declare ordered_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "ORDER"))
declare prsnl_group_class_cd = f8 with protect, constant(uar_get_code_by("MEANING", 19189, "SERVICE"))
 
 
select into $outdev
Patient = p.name_full_formatted,
Appointment_Type = uar_get_code_display(se.appt_type_cd),
Order_Name = o.hna_order_mnemonic,
Earlist_Date = format(se.earliest_dt_tm,"mm/dd/yy hh:mm;;d"),
Ordered_By = pr.name_full_formatted,
Prsnl_Group = pg.PRSNL_GROUP_NAME  
 
from
sch_entry se,
person p,
sch_event_attach sea,
order_action oa,
orders o,
prsnl pr,
prsnl_group_reltn pgr,
prsnl_group pg
 
plan se
where se.queue_id = 1800428      ; <-- Unknown Queue
and se.entry_state_cd  =pending_cd
and se.active_ind = 1
and se.version_dt_tm > sysdate
 
join p where
p.person_id = se.person_id
 
join sea
where sea.sch_event_id = se.sch_event_id
and sea.attach_type_cd = attach_type_cd
 
join o where
o.order_id = sea.order_id
 
join oa
where oa.order_id = o.order_id
and oa.action_type_cd = ordered_cd
 
join pr where
pr.person_id = oa.order_provider_id
 
join pgr
where pgr.person_id = pr.person_id
and pgr.active_ind  = 1
 
join pg
where pg.PRSNL_GROUP_ID = pgr.PRSNL_GROUP_ID
and pg.active_ind = 1
and pg.prsnl_group_class_cd+0 = prsnl_group_class_cd
 
order patient
 
with format, separator = " "
 
end go
 
 
