drop program bc_mp_mvs_orders_14:dba go
create program bc_mp_mvs_orders_14:dba
/**************************************************************************************************
              Purpose: Displays orders on ED Summary Custom MPage
     Source File Name: bc_mp_mvs_orders_14.PRG
              Analyst: MediView Solutions
          Application: FirstNet
  Execution Locations: FirstNet
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   06/09/2011      MediView Solutions 	    Initial Release
    2   mm/dd/yyyy      Engineer Name           Initial Release
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

record orders(
  1 clin_cat[*]
    2 c_line = vc
    2 o_qual[*]
      3 order_id = f8
      3 ord_prov = vc
      3 mnem = vc
      3 label = vc
      3 d_line = vc
      3 cs_name 		= vc
      3 date 			= c20
      3 date_f8 		= f8
      3 comment 		= vc
      3 ORDER_STATUS 	= VC	; vav
      3 order_status_F8 = f8
      3 updt_dt 		= VC 	; f8
      3 o_date 			= VC 	; c20
)

declare ordered_6004_cv 		= f8 with public, constant(uar_get_code_by("MEANING",6004,"ORDERED"))
declare pendingrev_6004_cv 		= f8 with public, constant(uar_get_code_by("MEANING",6004,"PENDING REV"))
declare inprocess_6004_cv 		= f8 with public, constant(uar_get_code_by("MEANING", 6004, "INPROCESS"))
declare discontinued_6004_cv 	= f8 with public, constant(uar_get_code_by("MEANING", 6004, "DISCONTINUED"))
declare completed_6004_cv 		= f8 with public, constant(uar_get_code_by("MEANING", 6004, "COMPLETED"))
declare ord_inproc_14281_dv 	= f8 with public, constant(uar_get_code_by("MEANING", 14281,	"INPATHOLOGY"))
declare active_14389_cv 		= f8 with public, constant(uar_get_code_by("MEANING", 16389, "ACTIVITY"))
declare condition_16389_cv 		= f8 with public, constant(uar_get_code_by("MEANING", 16389, "CONDITION"))
declare diet_16389_cv 			= f8 with public, constant(uar_get_code_by("MEANING", 16389, "DIET"))
declare lab_16389_cv 			= f8 with public, constant(uar_get_code_by("MEANING", 16389, "LABORATORY"))
declare patcare_16389_cv 		= f8 with public, constant(uar_get_code_by("MEANING", 16389, "NURSORDERS"))
declare radiology_16389_cv 		= f8 with public, constant(uar_get_code_by("MEANING", 16389, "USERDEF1"))
declare consults_16389_cv 		= f8 with public, constant(uar_get_code_by("MEANING", 16389, "CONSULTS")) ; 005
declare diagtest_16389_cv 		= f8 with public, constant(uar_get_code_by("MEANING", 16389, "DIAGTESTS")) ; 005
declare therapy_16389_cv 		= f8 with public, constant(uar_get_code_by("MEANING", 16389, "USERDEF3")); 005

declare vital_16389_cv 			= f8 with public, constant(uar_get_code_by("MEANING", 16389, "VITALS")) ; 005
 
declare order_6003_cv 			= f8 with public, constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare modify_6003_cv 			= f8 with public, constant(uar_get_code_by("MEANING",6003,"MODIFY"))
declare activate_6003_cv 		= f8 with public, constant(uar_get_code_by("MEANING",6003,"ACTIVATE"))
declare discontinue_6003_cv 	= f8 with public, constant(uar_get_code_by("MEANING",6003,"DISCONTINUE"))
declare complete_6003_cv 		= f8 with public, constant(uar_get_code_by("MEANING",6003,"COMPLETE"))
declare patcare_task_6026_cv 	= f8 with public, constant(uar_get_code_by("DISPLAYKEY",6026,"PATIENTCARE"))
declare patcaret_task_6026_cv 	= f8 with public, constant(uar_get_code_by("DISPLAYKEY",6026,"PATIENTCARET"))
 
 ; append in process
declare statuschange_cd 		= f8 with public, constant(uar_get_code_by("MEANING",6003,"STATUSCHANGE"))

set lidx = 0
set prev_cnt = 0
set cnt = 0
set f_prev_cnt = 0
set f_cnt = 0
set act_flag = 0

select distinct into "nl:"
	  o.order_id
	  , o.catalog_type_cd
	  , o.orig_order_dt_tm
	  , o.dcp_clin_cat_cd
	  , o.order_status_cd
	  , ORDER_STATUS = UAR_GET_CODE_DISPLAY(o.order_status_cd )
	  , updt_dt = format( CNVTDATETIME(o.updt_dt_tm ) , "MM/DD/YYYY HH:MM;;D" )
	  
		; set up sort structure to sort the orders by type
	  , clin_cat_order =
		    if (o.dcp_clin_cat_cd = condition_16389_cv) 1
			    elseif (o.dcp_clin_cat_cd = diet_16389_cv) 3
			    elseif (o.dcp_clin_cat_cd = consults_16389_cv) 5
			    elseif (o.dcp_clin_cat_cd = patcare_16389_cv) 11 ;6
			    elseif (o.dcp_clin_cat_cd = lab_16389_cv) 7
			    elseif (o.dcp_clin_cat_cd = radiology_16389_cv) 8
			    elseif (o.dcp_clin_cat_cd = diagtest_16389_cv) 9
			    elseif (o.dcp_clin_cat_cd = therapy_16389_cv) 10
		    endif,
	  otx_task_ind =
		    if (ot.reference_task_id > 0) 1
		    	else 0
		    endif,
	  table_flag = 1,
	  		o.current_start_dt_tm "mm/dd/yyyy hh:mm:ss;;d",
	  od.order_id,
	  oef.label_text,
	  oef.clin_line_label,
	  oef.group_seq,
	  oef.field_seq,
	  oef.action_type_cd,
	  oa.action_type_cd,
	  od.oe_field_id,
	  od.action_sequence,
	  ef.field_type_flag,
	  ord_date = format(CNVTDATETIME( o.orig_order_dt_tm) , "MM/DD/YYYY HH:MM;;D" )
 
from
  orders o,
  dummyt d1,
  order_action oa,
  prsnl p,
  order_detail od,
  oe_format_fields oef,
  order_entry_fields ef,
  dummyt d2,
  order_task_xref otx,
  order_task ot
 
plan o
  where o.encntr_id = $ENCNTRID 
    and o.order_status_cd + 0 in (ordered_6004_cv,pendingrev_6004_cv,inprocess_6004_cv,completed_6004_cv,
    								discontinued_6004_cv)
    and o.template_order_flag+0 in (0,1)
;    and o.cs_flag+0 in (0,2,8,32)
    and o.cs_flag+0 in (0,2,4,32)
    and o.dcp_clin_cat_cd+0 in (condition_16389_cv,diet_16389_cv,
    lab_16389_cv,radiology_16389_cv,patcare_16389_cv, therapy_16389_cv, consults_16389_cv,
  diagtest_16389_cv)
 
join oa where oa.order_id = o.order_id
    and oa.action_sequence = o.last_action_sequence
 
join p where oa.order_provider_id = p.person_id
 
join (d1
join od where o.order_id = od.order_id
    and od.action_sequence >= 0
    and od.detail_sequence >= 0
    and trim(od.oe_field_meaning) not in ("REQSTARTDTTM","PRIORITY")
 
join oef where oef.oe_format_id = o.oe_format_id
    and oef.oe_field_id = od.oe_field_id
    and oef.clin_line_ind + 0 = 1
    and (oef.action_type_cd = oa.action_type_cd
     or (oef.action_type_cd = order_6003_cv
        ;  append in process (statuschange_cd)
        and oa.action_type_cd + 0
        in (modify_6003_cv,
            activate_6003_cv,
            statuschange_cd,	
            complete_6003_cv,
            discontinue_6003_cv)))
 
join ef where ef.oe_field_id = oef.oe_field_id)
 
join (d2
join otx where o.catalog_cd = otx.catalog_cd
  and otx.reference_task_id >= 0
 
join ot where otx.reference_task_id = ot.reference_task_id
  and ot.task_type_cd = patcaret_task_6026_cv) ;d2
 
order
  clin_cat_order,
  cnvtdatetime(o.current_start_dt_tm) desc,
  o.order_id,
  oef.group_seq,
  oef.field_seq,
  od.oe_field_id,
  od.action_sequence desc,
  od.detail_sequence
 
head report
    clinical_cat = fillstring(30," ")
    cindex = 0
 
head clin_cat_order
 
	; Set up for catalog index and records
  if (otx_task_ind != 1)
	; increment cindex by 1 for each time through the head clause
    cindex = cindex + 1, row + 1
	; Give the record structure room to write another record
    stat = alterlist(orders->clin_cat, cindex)
	; Write the record
    orders->clin_cat[cindex].c_line = substring(1,30,uar_get_code_display(o.dcp_clin_cat_cd))
	; Set the index back to 0 for next catalog type
    oindex = 0
  endif
 
head o.order_id

	; Set up for the Orders index and records  check that the indicator is not 1
  if (otx_task_ind != 1)
    oindex = oindex + 1
	; Set up next row in structure
    stat = alterlist(orders->clin_cat[cindex]->o_qual, oindex)
	; Write data to recors structure
    orders->clin_cat[cindex]->o_qual[oindex].order_id = o.order_id
    orders->clin_cat[cindex]->o_qual[oindex].order_status_F8 = o.order_status_cd
	orders->clin_cat[cindex]->o_qual[oindex].ORDER_STATUS = UAR_GET_CODE_DISPLAY(o.order_status_cd )
    orders->clin_cat[cindex]->o_qual[oindex].mnem = o.order_mnemonic
    orders->clin_cat[cindex]->o_qual[oindex].date_f8 = o.orig_order_dt_tm
    orders->clin_cat[cindex]->o_qual[oindex].updt_dt = updt_dt    ;o.updt_dt_tm
    orders->clin_cat[cindex]->o_qual[oindex].o_date = ord_date
 
	;Set up name as first inital and last name.
      init = substring(1, 1, p.name_first)
	  lastpos = findstring(",", p.name_full_formatted)
	  lastname = substring(1, lastpos - 1, p.name_full_formatted)
	  pname = concat(init, " ", lastname)
	; Write name to record Structure
	  orders->clin_cat[cindex]->o_qual[oindex].ord_prov = pname ;p.name_full_formatted
 
 
    ;orders->clin_cat[cindex]->o_qual[oindex].ord_prov = p.name_full_formatted
 
	; Begin here append in process
    ;This section appends "(In Process)" to items in the output if they are being processed in PowerChart, "Ordered (In Process)"
    if (o.order_status_cd = ordered_6004_cv and o.dept_status_cd = ord_inproc_14281_dv)
       orders->clin_cat[cindex]->o_qual[oindex].mnem =
               concat(orders->clin_cat[cindex]->o_qual[oindex].mnem," (In Process)")
    endif
    ;in powerchart, "InProcess"
    if (o.order_status_cd = inprocess_6004_cv)
      orders->clin_cat[cindex]->o_qual[oindex].mnem =
              concat(orders->clin_cat[cindex]->o_qual[oindex].mnem," (In Process)")
    endif
		; End here append in process
 
    prev_cnt = 0
    cnt = 0
    f_prev_cnt = 0
    f_cnt = 0
    task_ind = 0
  else
    task_ind = 1
  endif
 
head oef.group_seq
  if (task_ind != 1)
    cnt = cnt + 1
  endif
 
head oef.field_seq
  if (task_ind != 1)
    f_cnt = f_cnt + 1
  endif
 
head od.oe_field_id
  if (task_ind != 1)
    act_seq = od.action_sequence
    act_flag = 1
  endif
 
head od.action_sequence
  if (task_ind != 1)
    if (act_seq != od.action_sequence)
      act_flag = 0
    endif
  endif
 
detail
  if (task_ind != 1)
    if (act_flag = 1)
      if (ef.field_type_flag = 7)   ;value of Yes/No is not to be displayed, just label
        if (oef.disp_yes_no_flag = 0)
          if (od.oe_field_display_value = "Yes")
		; if label > " " us oef.label_text otherwise ust oef.clin_line_label
            if (orders->clin_cat[cindex]->o_qual[oindex].label > " ")
              orders->clin_cat[cindex]->o_qual[oindex].label = oef.label_text
            endif
          else
            if (orders->clin_cat[cindex]->o_qual[oindex].label)
              orders->clin_cat[cindex]->o_qual[oindex].label = oef.clin_line_label
            endif
          endif
          if (orders->clin_cat[cindex]->o_qual[oindex].label > " ")
		; if cnt != to prev_cnt then separate d_line and label with a "," otherwise use a blank space.
            if (cnt != prev_cnt)
              orders->clin_cat[cindex]->o_qual[oindex].d_line =
                      concat(orders->clin_cat[cindex]->o_qual[oindex].d_line,", ",
                             orders->clin_cat[cindex]->o_qual[oindex].label)
            else
              orders->clin_cat[cindex]->o_qual[oindex].d_line =
                      concat(orders->clin_cat[cindex]->o_qual[oindex].d_line," ",
                             orders->clin_cat[cindex]->o_qual[oindex].label)
            endif
          endif
        elseif (oef.disp_yes_no_flag = 1)
          if (od.oe_field_display_value = "Yes")
            orders->clin_cat[cindex]->o_qual[oindex].label = oef.label_text
            if (orders->clin_cat[cindex]->o_qual[oindex].label > " ")
		; if cnt != to prev_cnt then separate d_line and label with a "," otherwise use a blank space.
              if (cnt != prev_cnt)
                orders->clin_cat[cindex]->o_qual[oindex].d_line =
                        concat(orders->clin_cat[cindex]->o_qual[oindex].d_line,", ",
                               orders->clin_cat[cindex]->o_qual[oindex].label)
              else
                orders->clin_cat[cindex]->o_qual[oindex].d_line =
                        concat(orders->clin_cat[cindex]->o_qual[oindex].d_line," ",
                               orders->clin_cat[cindex]->o_qual[oindex].label)
              endif
            endif
          else
            orders->clin_cat[cindex]->o_qual[oindex].label = " "
          endif
        elseif (oef.disp_yes_no_flag = 2)
          if (od.oe_field_display_value = "Yes")
            orders->clin_cat[cindex]->o_qual[oindex].label = " "
          else
            orders->clin_cat[cindex]->o_qual[oindex].label = oef.clin_line_label
		; make sure lable is not blanke
            if (orders->clin_cat[cindex]->o_qual[oindex].label > " ")
		; if cnt != to prev_cnt then separate d_line and label with a "," otherwise use a blank space.
              if (cnt != prev_cnt)
                orders->clin_cat[cindex]->o_qual[oindex].d_line =
                        concat(orders->clin_cat[cindex]->o_qual[oindex].d_line,", ",
                               orders->clin_cat[cindex]->o_qual[oindex].label)
              else
                orders->clin_cat[cindex]->o_qual[oindex].d_line =
                        concat(orders->clin_cat[cindex]->o_qual[oindex].d_line," ",
                               orders->clin_cat[cindex]->o_qual[oindex].label)
              endif
            endif
          endif
        endif ; endif for yes/no flag
      elseif (oef.clin_suffix_ind = 1)   ;show the label after the value
        orders->clin_cat[cindex]->o_qual[oindex].label = oef.clin_line_label
		; if cnt != to prev_cnt then separate d_line and label with a "," otherwise use a blank space.
        if (cnt != prev_cnt)
          orders->clin_cat[cindex]->o_qual[oindex].d_line =
                  concat(orders->clin_cat[cindex]->o_qual[oindex].d_line,",  ",
                         trim(od.OE_FIELD_DISPLAY_VALUE)," ",
                         orders->clin_cat[cindex]->o_qual[oindex].label)
        else
          orders->clin_cat[cindex]->o_qual[oindex].d_line =
                  concat(orders->clin_cat[cindex]->o_qual[oindex].d_line,"  ",
                         trim(od.OE_FIELD_DISPLAY_VALUE)," ",
                         orders->clin_cat[cindex]->o_qual[oindex].label)
        endif
      elseif (ef.allow_multiple_ind = 1)
	; if cnt != to prev_cnt then separate d_line, label and display value with a ","
	; otherwise use a "|" to separate the fields
 
        if (f_cnt != f_prev_cnt) ;* orig
          orders->clin_cat[cindex]->o_qual[oindex].label = trim(oef.clin_line_label)
          orders->clin_cat[cindex]->o_qual[oindex].d_line =
                  concat(orders->clin_cat[cindex]->o_qual[oindex].d_line,", ",
                         orders->clin_cat[cindex]->o_qual[oindex].label, " ",
                         trim(od.OE_FIELD_DISPLAY_VALUE))
        else
          orders->clin_cat[cindex]->o_qual[oindex].label = trim(oef.clin_line_label)
          orders->clin_cat[cindex]->o_qual[oindex].d_line =
                  concat(orders->clin_cat[cindex]->o_qual[oindex].d_line,"|", " ",
                         trim(od.OE_FIELD_DISPLAY_VALUE))
        endif
      elseif (oef.clin_line_label > " " AND ef.field_type_flag != 7)
        orders->clin_cat[cindex]->o_qual[oindex].label = trim(oef.clin_line_label)
	; if cnt != to prev_cnt then separate d_line and label with a "," otherwise use a blank space.
        if (cnt != prev_cnt)
          orders->clin_cat[cindex]->o_qual[oindex].d_line =
                  concat(orders->clin_cat[cindex]->o_qual[oindex].d_line,", ",
                         orders->clin_cat[cindex]->o_qual[oindex].label, " ",
                         trim(od.OE_FIELD_DISPLAY_VALUE))
        else
          orders->clin_cat[cindex]->o_qual[oindex].d_line =
                  concat(orders->clin_cat[cindex]->o_qual[oindex].d_line," ",
                         orders->clin_cat[cindex]->o_qual[oindex].label, " ",
                         trim(od.OE_FIELD_DISPLAY_VALUE))
        endif
      else
        orders->clin_cat[cindex]->o_qual[oindex].label = " "
	; make sure field display value has data...
        if (od.oe_field_display_value > " ")
	; if cnt != to prev_cnt then separate d_line and label with a "," otherwise use a blank space.
          if (cnt != prev_cnt)
            orders->clin_cat[cindex]->o_qual[oindex].d_line =
                    concat(orders->clin_cat[cindex]->o_qual[oindex].d_line,", ",
                           orders->clin_cat[cindex]->o_qual[oindex].label, " ",
                           trim(od.OE_FIELD_DISPLAY_VALUE))
          else
            orders->clin_cat[cindex]->o_qual[oindex].d_line =
                    concat(orders->clin_cat[cindex]->o_qual[oindex].d_line," ",
                           orders->clin_cat[cindex]->o_qual[oindex].label, " ",
                           trim(od.OE_FIELD_DISPLAY_VALUE))
          endif
        endif
      endif
    endif ; act_flag
  endif ; task_ind
 
foot oef.field_seq
  if (task_ind != 1)
    prev_cnt = cnt
  endif
 
with
  nocounter, outerjoin = d1, outerjoin = d2
  
call echojson(orders, $OUTDEV)
end
go
