/************************************************************************
 
        Source file name:       mayo_sch_parm.inc
        Program purpose:        centralize code for scheduling parameters
 
 ************************************************************************
 *                      GENERATED MODIFICATION CONTROL LOG              *
 ************************************************************************
 *Mod Date     Engineer             Comment                             *
 *--- -------- -------------------- ----------------------------------- *
 *000 07/29/08 Michael Chapman      Initial release                     *
 ******************  END OF ALL MODCONTROL BLOCKS  **********************/
 
call echo("***** BEGIN mayo_sch_parm.inc *****")
 
;%i cclsource:sch_header_ccl.inc
;%i cclsource:sch_i18n_new.inc
;%i cclsource:sch_format_text_str.inc
;%i cclsource:sch_format_text_sub.inc
%i cclsource:sch_get_atgroup_exp_str.inc
%i cclsource:sch_get_locgroup_exp_str.inc
%i cclsource:sch_get_res_group_exp_str.inc
%i cclsource:sch_get_slot_group_exp_str.inc
 
free set sch_parm
record sch_parm
(
  1 queue_id = f8
  1 person_id = f8
  1 resource_cd = f8
  1 location_cd = f8
  1 beg_dt_tm = dq8
  1 end_dt_tm = dq8
  1 atgroup_id = f8
  1 locgroup_id = f8
  1 res_group_id = f8
  1 slot_group_id = f8
  1 appt_type_cd = f8
  1 title = vc
  1 appttype_qual_cnt = i4
  1 appttype_qual [*]
    2 appt_type_cd = f8
  1 location_qual_cnt = i4
  1 location_qual [*]
    2 location_cd = f8
  1 resource_qual_cnt = i4
  1 resource_qual [*]
    2 resource_cd = f8
    2 person_id = f8
  1 slot_qual_cnt = i4
  1 slot_qual [*]
    2 slot_type_id = f8
)
 
;==> Search thru the input list and extract the parameters
call echo ("Checking the input fields...")
for (i_input = 1 to size(request->qual,5))
   if (request->qual[i_input]->oe_field_meaning_id = 0)
      ;==> Process the Standard Tokens
      case (request->qual[i_input]->oe_field_meaning)
         of "QUEUE":
            set sch_parm->queue_id = request->qual[i_input]->oe_field_value
         of "PERSON":
            set sch_parm->person_id = request->qual[i_input]->oe_field_value
         of "RESOURCE":
            set sch_parm->resource_cd = request->qual[i_input]->oe_field_value
         of "LOCATION":
            set sch_parm->location_cd = request->qual[i_input]->oe_field_value
         of "BEGDTTM":
            set sch_parm->beg_dt_tm = request->qual[i_input]->oe_field_dt_tm_value
         of "ENDDTTM":
            set sch_parm->end_dt_tm = request->qual[i_input]->oe_field_dt_tm_value
         of "ATGROUP":
            set sch_parm->atgroup_id = request->qual[i_input]->oe_field_value
         of "LOCGROUP":
            set sch_parm->locgroup_id = request->qual[i_input]->oe_field_value
         of "RESGROUP":
            set sch_parm->res_group_id = request->qual[i_input]->oe_field_value
         of "SLOTGROUP":
            set sch_parm->slot_group_id = request->qual[i_input]->oe_field_value
         of "TITLE":
            set sch_parm->title = request->qual[i_input]->oe_field_display_value
         of "APPTTYPE":
            set sch_parm->appt_type_cd = request->qual[i_input]->oe_field_value
      endcase
   else  ; Process the Accept Format Fields
      case (request->qual[i_input]->label_text)
         of "<Label Text Goes Here>":
            set sch_parm->user_defined = request->qual[i_input]->oe_field_display_value
      endcase
   endif
endfor
 
;==> Explode the Appointment Type Group (if defined)
if (sch_parm->atgroup_id > 0)
   set get_atgroup_exp_request->call_echo_ind = 0
   set get_atgroup_exp_request->security_ind = 1
   set get_atgroup_exp_reply->qual_cnt = 1
   set stat = alterlist(get_atgroup_exp_request->qual, get_atgroup_exp_reply->qual_cnt)
   set get_atgroup_exp_request->qual[get_atgroup_exp_reply->qual_cnt]->sch_object_id = sch_parm->atgroup_id
   set get_atgroup_exp_request->qual[get_atgroup_exp_reply->qual_cnt]->duplicate_ind = 1
   execute sch_get_atgroup_exp
   for (i_input = 1 to get_atgroup_exp_reply->qual_cnt)
      set sch_parm->appttype_qual_cnt = get_atgroup_exp_reply->qual[i_input]->qual_cnt
      set stat = alterlist(sch_parm->appttype_qual, sch_parm->appttype_qual_cnt)
      for (j_input = 1 to sch_parm->appttype_qual_cnt)
         set sch_parm->appttype_qual[j_input]->appt_type_cd
            = get_atgroup_exp_reply->qual[i_input]->qual[j_input]->appt_type_cd
      endfor
   endfor
else
   set sch_parm->appttype_qual_cnt = 0
endif
 
;==> Explode the Location Group (if defined)
if (sch_parm->locgroup_id > 0)
   set get_locgroup_exp_request->call_echo_ind = 0
   set get_locgroup_exp_request->security_ind = 1
   set get_locgroup_exp_reply->qual_cnt = 1
   set stat = alterlist(get_locgroup_exp_request->qual, get_locgroup_exp_reply->qual_cnt)
   set get_locgroup_exp_request->qual[get_locgroup_exp_reply->qual_cnt]->sch_object_id = sch_parm->locgroup_id
   set get_locgroup_exp_request->qual[get_locgroup_exp_reply->qual_cnt]->duplicate_ind = 1
   execute sch_get_locgroup_exp
   for (i_input = 1 to get_locgroup_exp_reply->qual_cnt)
      set sch_parm->location_qual_cnt = get_locgroup_exp_reply->qual[i_input]->qual_cnt
      set stat = alterlist(sch_parm->location_qual, sch_parm->location_qual_cnt)
      for (j_input = 1 to sch_parm->location_qual_cnt)
         set sch_parm->location_qual[j_input]->location_cd
            = get_locgroup_exp_reply->qual[i_input]->qual[j_input]->location_cd
      endfor
   endfor
else
   set sch_parm->location_qual_cnt = 0
endif
 
;==> Explode the Resource Group (if defined)
if (sch_parm->res_group_id > 0)
   set get_res_group_exp_request->call_echo_ind = 0
   set get_res_group_exp_request->security_ind = 1
   set get_res_group_exp_reply->qual_cnt = 1
   set stat = alterlist(get_res_group_exp_request->qual, get_res_group_exp_reply->qual_cnt)
   set get_res_group_exp_request->qual[get_res_group_exp_reply->qual_cnt]->res_group_id = sch_parm->res_group_id
   set get_res_group_exp_request->qual[get_res_group_exp_reply->qual_cnt]->duplicate_ind = 1
   execute sch_get_res_group_exp
   for (i_input = 1 to get_res_group_exp_reply->qual_cnt)
      set sch_parm->resource_qual_cnt = get_res_group_exp_reply->qual[i_input]->qual_cnt
      set stat = alterlist(sch_parm->resource_qual, sch_parm->resource_qual_cnt)
      for (j_input = 1 to sch_parm->resource_qual_cnt)
         set sch_parm->resource_qual[j_input]->resource_cd
            = get_res_group_exp_reply->qual[i_input]->qual[j_input]->resource_cd
      endfor
   endfor
else
   set sch_parm->resource_qual_cnt = 0
endif
 
;==> Explode the Slot Group (if defined)
if (sch_parm->slot_group_id > 0)
   set get_slot_group_exp_request->call_echo_ind = 0
   set get_slot_group_exp_request->security_ind = 1
   set get_slot_group_exp_reply->qual_cnt = 1
   set stat = alterlist(get_slot_group_exp_request->qual, get_slot_group_exp_reply->qual_cnt)
   set get_slot_group_exp_request->qual[get_slot_group_exp_reply->qual_cnt]->slot_group_id = sch_parm->slot_group_id
   set get_slot_group_exp_request->qual[get_slot_group_exp_reply->qual_cnt]->duplicate_ind = 1
   execute sch_get_slot_group_exp
   for (i_input = 1 to get_slot_group_exp_reply->qual_cnt)
      set sch_parm->slot_qual_cnt = get_slot_group_exp_reply->qual[i_input]->qual_cnt
      set stat = alterlist(sch_parm->slot_qual, sch_parm->slot_qual_cnt)
      for (j_input = 1 to sch_parm->slot_qual_cnt)
         set sch_parm->slot_qual[j_input]->slot_type_id
            = get_slot_group_exp_reply->qual[i_input]->qual[j_input]->slot_type_id
      endfor
   endfor
else
   set sch_parm->slot_qual_cnt = 0
endif
 
;==> Populate person_id for resources (if any)
if (sch_parm->resource_qual_cnt > 0)
   select into "nl:"
      a.person_id,
      d.seq
   from (dummyt d with seq = value(sch_parm->resource_qual_cnt)),
      sch_resource a
   plan d
   join a where
      a.resource_cd = sch_parm->resource_qual[d.seq]->resource_cd
       and a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
   detail
      sch_parm->resource_qual[d.seq]->person_id = a.person_id
   with nocounter
endif
 
call echo("***** END mayo_sch_parm.inc *****")
 

