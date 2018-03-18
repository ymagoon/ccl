;    *                                                                      *
;    *Mod    Date     	Engineer              Comment                       *
;    *---   ------------ -------------------- ------------------------------*
;     000   11/03/08 	 Akcia               Initial Release 				*
;     001   04/16/2012   Akcia				 remove delted orders from qualifying
;											 changed dischareg home health displaykey
;     002   03/28/13     Akcia				 change so greater than and less than
;											signs don't cause problems with html
;     003   05/28/13   Akcia-se				add order "discharge medication instruction"
;     004   10/23/13   Akcia-SE				fix for duplicate special instructions
;****************************************************************************
 
drop program mayo_mn_udt_disch_details:dba go
create program mayo_mn_udt_disch_details:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
%i cclsource:mayo_mn_html.inc
 
/****************************************************************************
*       Declare Variables                                                   *
*****************************************************************************/
declare disch_diet_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",200,"DISCHARGEDIET"))
declare disch_home_health_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",200,"DISCHARGEWITHHOMEHEALTH"))
declare disch_incision_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",200,"DISCHARGEINCISIONWOUNDCARE"))
declare disch_instruction_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",200,"DISCHARGEINSTRUCTION"))
declare disch_med_instruction_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",200,"DISCHARGEMEDICATIONINSTRUCTION")) ;003
declare canceled_cd = f8 with constant(uar_get_code_by("MEANING",6004,"CANCELED"))
declare discontinued_cd = f8 with constant(uar_get_code_by("MEANING",6004,"DISCONTINUED"))
declare deleted_cd = f8 with constant(uar_get_code_by("MEANING",6004,"DELETED"))		;001
;declare disch_return_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",200,"DISCHARGERETURNTOWORKSCHOOL"))
;declare sch_work_comment_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"SCHOOLWORKHEALTHSTATUSCOMMENT"))
;declare date_return_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"DATEOFRETURNTOSCHOOLWORKWITHOUTRE"))
;declare form_complete_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"SCHOOLMEDPROCEDUREFORMCOMPLETED"))
;declare restrictions_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"SCHOOLORWORKRESTRICTIONS"))
;declare patient_seen_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"DATEPATIENTSEEN"))
declare sText = vc
declare detail_value = vc
declare hold_detail = vc    ;004
 
record data (
1 qual[*]
  2 order_name = vc
  2 details[*]
    3 detail_name = vc
    3 value = vc
1 powerform[*]
  2 detail_name = vc
  2 value = vc
)
 
 
select into "nl:"
order_name = uar_get_code_display(o.catalog_cd),
order_detail_name = off.label_text,
od.*
from
orders o,
order_detail od,
oe_format_fields off
 
plan o
where o.encntr_id = request->encntr_id   ;   77572402.00  ;
  and o.catalog_cd+0 in (disch_diet_cd,disch_home_health_cd,disch_incision_cd,disch_instruction_cd,disch_med_instruction_cd)  ;003
;003  and o.catalog_cd+0 in (disch_diet_cd,disch_home_health_cd,disch_incision_cd,disch_instruction_cd)
;001  and not o.order_status_cd+0 in (canceled_cd,discontinued_cd)
  and not o.order_status_cd+0 in (canceled_cd,discontinued_cd,deleted_cd)				;001
  and o.active_ind = 1
 
join od
where od.order_id = o.order_id
  and od.oe_field_meaning != "REQSTARTDTTM"
  and od.action_sequence = (select max(od2.action_sequence) from order_detail od2
  								where od2.order_id = od.order_id
  								  and od2.oe_field_id = od.oe_field_id)
 
join off
where off.oe_format_id = o.oe_format_id
  and off.oe_field_id = od.oe_field_id
 
order order_name, order_detail_name, od.detail_sequence
 
head report
cnt = 0
cnt2 = 0
first_time = "Y"
 
head order_name
cnt = cnt + 1
stat = alterlist(data->qual,cnt)
data->qual[cnt].order_name = o.hna_order_mnemonic
cnt2 = 0
 
head order_detail_name
cnt2 = cnt2 + 1
stat = alterlist(data->qual[cnt]->details,cnt2)
data->qual[cnt]->details[cnt2].detail_name = off.label_text
first_time = "Y"
hold_detail = " "   ;004
 
detail
call echo( od.oe_field_display_value)
if (first_time = "Y")
  detail_value = od.oe_field_display_value
  first_time = "N"
else
  if (hold_detail != od.oe_field_display_value)			;004
    detail_value = concat(detail_value,", ",trim(od.oe_field_display_value,3))
  endif														;004
endif
hold_detail = od.oe_field_display_value					;004
 
foot order_detail_name
;002  data->qual[cnt]->details[cnt2].value = replace(replace(detail_value,"<","&lt;"),">","&gt;")
 data->qual[cnt]->details[cnt2].value = replace(replace(detail_value,"<","&lt;"),">","&gt;")  ;002
 
 
 
 
with nocounter
 
;select into "nl:"
;from
;clinical_event ce,
;ce_date_result cdr
;
;plan ce
;where ce.encntr_id =  request->encntr_id  ;62481329.00  ;
;  and ce.task_assay_cd in (sch_work_comment_cd,date_return_cd,form_complete_cd,restrictions_cd,patient_seen_cd)
;  and ce.valid_until_dt_tm > sysdate
;
;join cdr
;where cdr.event_id = outerjoin(ce.event_id)
;
;head report
;cnt = 0
;cnt2 = 0
;
;head ce.task_assay_cd
;cnt = cnt + 1
;stat = alterlist(data->powerform,cnt)
;data->powerform[cnt].detail_name = uar_get_code_display(ce.task_assay_cd)
;if (cdr.event_id > 0)
;  data->powerform[cnt].value = format(cdr.result_dt_tm,"mm/dd/yy hh:mm;;d")
;else
;  data->powerform[cnt].value = ce.result_val
;endif
;
;with nocounter
call echorecord(data)
 
set sText = csBegin
 
for (x = 1 to size(data->qual,5))
  set sText = concat(sText,"<P><B>",trim(data->qual[x].order_name,3),"</B><BR>")
  for (y = 1 to size(data->qual[x]->details,5))
    set sText = concat(sText,trim(data->qual[x]->details[y].detail_name,3),":  ",trim(data->qual[x]->details[y].value,3),"<BR>")
  endfor
  set sText = concat(sText,csParagraphEnd)
endfor
 
;set sText = concat(sText,"<P>")
;for (z = 1 to size(data->powerform,5))
;  set sText = concat(sText,trim(data->powerform[z].detail_name,3),":  ",trim(data->powerform[z].value,3),"<BR>")
;endfor
;set sText = concat(sText,csParagraphEnd)
set sText = concat(sText,csEnd)
 
call echo(sText)
set reply->text = sText
 
set reply->format = 1 ; this means HTML so the caller will know how to handle
 
end go
