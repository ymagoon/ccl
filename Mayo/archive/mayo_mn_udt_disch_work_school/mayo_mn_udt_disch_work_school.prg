;    *                                                                      *
;    *Mod    Date     	Engineer              Comment                       *
;    *---   ------------ -------------------- ------------------------------*
;     000   11/03/08 	 Akcia               Initial Release 				*
;	  001   03/28/12     Akcia				 fix title length,  add ordering provider
;****************************************************************************
 
drop program mayo_mn_udt_disch_work_school:dba go
create program mayo_mn_udt_disch_work_school:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
%i cclsource:mayo_mn_html.inc
 
 
/****************************************************************************
*       Declare Variables                                                   *
*****************************************************************************/
declare disch_return_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",200,"DISCHARGERETURNTOWORKSCHOOL"))
declare sch_work_comment_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"SCHOOLWORKHEALTHSTATUSCOMMENT"))
declare date_return_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"DATEOFRETURNTOSCHOOLWORKWITHOUTRE"))
declare form_complete_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"SCHOOLMEDPROCEDUREFORMCOMPLETED"))
declare restrictions_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"SCHOOLORWORKRESTRICTIONS"))
declare patient_seen_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",14003,"DATEPATIENTSEEN"))
declare canceled_cd = f8 with constant(uar_get_code_by("MEANING",6004,"CANCELED"))
declare discontinued_cd = f8 with constant(uar_get_code_by("MEANING",6004,"DISCONTINUED"))
declare ordered_cd = f8 with constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare sText = vc
 
record data (
1 qual[*]
  2 order_name = vc
  2 ordering_provider = vc
  2 details[*]
    3 detail_name = vc
    3 value = vc
1 powerform[*]
  2 detail_name = vc
  2 value = vc
)
 
select into "nl:"
from
orders o,
order_action oa,			;001
prsnl pl,					;001
order_detail od,
oe_format_fields off
 
plan o
where o.encntr_id = request->encntr_id   ;62481329.00  ;
  and o.catalog_cd+0 = disch_return_cd
  and not o.order_status_cd+0 in (canceled_cd,discontinued_cd)
  and o.active_ind = 1
 
join oa										;001
where oa.order_id = o.order_id				;001
  and oa.action_type_cd = ordered_cd 		;001
 
join pl
where pl.person_id = oa.order_provider_id	;001
 
join od
where od.order_id = o.order_id
  and od.action_sequence = (select max(od2.action_sequence) from order_detail od2
  								where od2.order_id = od.order_id
  								  and od2.oe_field_id = od.oe_field_id)
 
join off
where off.oe_format_id = o.oe_format_id
  and off.oe_field_id = od.oe_field_id
 
order o.catalog_cd
 
head report
cnt = 0
cnt2 = 0
 
head o.catalog_cd
cnt = cnt + 1
stat = alterlist(data->qual,cnt)
data->qual[cnt].order_name = o.hna_order_mnemonic
data->qual[cnt].ordering_provider = pl.name_full_formatted		;001
cnt2 = 0
 
detail
cnt2 = cnt2 + 1
stat = alterlist(data->qual[cnt]->details,cnt2)
data->qual[cnt]->details[cnt2].detail_name = off.label_text
data->qual[cnt]->details[cnt2].value = od.oe_field_display_value
 
with nocounter
 
select into "nl:"
from
clinical_event ce,
ce_date_result cdr
 
plan ce
where ce.encntr_id =  request->encntr_id  ;62481329.00  ;
  and ce.task_assay_cd in (sch_work_comment_cd,date_return_cd,form_complete_cd,restrictions_cd,patient_seen_cd)
  and ce.valid_until_dt_tm > sysdate
  and not ce.result_status_cd in (28,29,30,31)
 
join cdr
where cdr.event_id = outerjoin(ce.event_id)
 
head report
cnt = 0
cnt2 = 0
 
head ce.task_assay_cd
cnt = cnt + 1
stat = alterlist(data->powerform,cnt)
data->powerform[cnt].detail_name = uar_get_code_description(ce.task_assay_cd)		;001
;001	data->powerform[cnt].detail_name = uar_get_code_display(ce.task_assay_cd)
if (cdr.event_id > 0)
  data->powerform[cnt].value = format(cdr.result_dt_tm,"mm/dd/yy hh:mm;;d")
else
  data->powerform[cnt].value = ce.result_val
endif
 
with nocounter
call echorecord(data)
 
set sText = csBegin
 
if (size(data->qual,5) > 0 and size(data->powerform,5) > 0 )
	for (x = 1 to size(data->qual,5))
	  set sText = concat(sText,"<P><B>",trim(data->qual[x].order_name,3),"</B><BR>")
	  set sText = concat(sText,"Ordering Provider:  ",trim(data->qual[x].ordering_provider,3),"<BR>")   ;001
	  for (y = 1 to size(data->qual[x]->details,5))
	    set sText = concat(sText,trim(data->qual[x]->details[y].detail_name,3),":  ",trim(data->qual[x]->details[y].value,3),"<BR>")
	  endfor
	  set sText = concat(sText,csParagraphEnd)
	endfor
 
	set sText = concat(sText,"<P>")
	for (z = 1 to size(data->powerform,5))
	  set sText = concat(sText,trim(data->powerform[z].detail_name,3),":  ",trim(data->powerform[z].value,3),"<BR>")
	endfor
	set sText = concat(sText,csParagraphEnd)
endif
 
set sText = concat(sText,csEnd)
 
call echo(sText)
set reply->text = sText
 
set reply->format = 1 ; this means HTML so the caller will know how to handle
 
end go
