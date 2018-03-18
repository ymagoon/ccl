drop program lcmc_performance_billing_rpt go
create program lcmc_performance_billing_rpt

; 001 Akcia - pel 10/03/2011   cab 33562 - added encntr type to display 
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "start date" = CURDATE
	, "end date" = CURDATE
 
with OUTDEV, SDATE, EDATE
 
set ops_ind = validate(request->batch_selection, "N")
if (ops_ind != "N")
  set beg_dt = format(curdate - 7, "mmddyyyy;;d")
  set end_dt = format(curdate, "mmddyyyy;;d")
else
	set beg_dt = $sdate
    set end_dt = $edate
endif
 
call echo ($sdate)
call echo ($edate)
 
	declare finCd    		= f8 with constant(uar_get_code_by("MEANING", 319, "FIN NBR" )) ,protect
	declare MRNCd    		= f8 with constant(uar_get_code_by("MEANING", 319, "MRN" )) ,protect
	declare SSNcd    		= f8 with constant(uar_get_code_by("MEANING", 4, "SSN" )) ,protect
	declare home_cd  		= f8 with constant(uar_get_code_by("MEANING", 212, "HOME" )) ,protect
	declare rtf_cd 	 		= f8 with constant(uar_get_code_by("MEANING", 23, "RTF" )) ,protect
 
	declare business_add_cd	= f8 with constant(uar_get_code_by("MEANING", 212, "BUSINESS" )) ,protect
	declare business_phone_cd  	= f8 with constant(uar_get_code_by("MEANING", 43, "BUSINESS" )) ,protect
	declare home_phone_cd  	= f8 with constant(uar_get_code_by("MEANING", 43, "HOME" )) ,protect
 
	declare def_guar_cd		= f8 with constant(uar_get_code_by("MEANING", 351,"DEFGUAR")) ,protect
	declare insured_cd  	= f8 with constant(uar_get_code_by("MEANING", 351,"INSURED")) ,protect
	declare order_action_cd = f8 with constant(uar_get_code_by("MEANING", 6003,"ORDER")) ,protect
 
	Declare BILL_CODE_cd = f8   with public, constant(uar_get_code_by("MEANING",13019,"BILL CODE" ))
 
	Declare cpt4_cd = f8   with public, constant(uar_get_code_by("MEANING",14002,"CPT4" ))
 
	declare dOCFCompCd    = f8 with constant(uar_get_code_by("MEANING", 120, "OCFCOMP" )) ,protect
	declare rad_resource_cd = f8 with constant(uar_get_code_by("MEANING", 202, "RAD" )) ,protect
	declare iOutBuffLen = i4 with noconstant(32768),protect
	declare sOutBuffer = c32768 with noconstant(""),protect
	declare iUnCompressRetLen = i4 with noconstant(0),protect
	declare sBlobIn = c32768 with noconstant(""),protect
	declare BITMAP_CE_BLOB_RESULT  = i4 with constant(8),protect
  set cr = char(10)
  declare temp1 = vc
  free record temp
  record temp(
  1 qual[*]
	2 encntr_id = f8
    2 person_id = f8
    2 name_full_formatted = vc
    2 pat
		3	Street_Address						= vc
		3	Street_Address2						= vc
		3	Street_Address3						= vc
		3	Street_Address4						= vc
 
		3	Zip_Code							= vc
		3	City								= vc
		3	State								= vc
		3	Home_Phone							= vc
    2 dob = vc
    2 ssn = vc
    2 mrn = vc
    2 fin = vc
    2 encntr_type   = vc                       ;001
 
    2 guarantor_name = vc
    2 ins[*]
	    3 ins_carrier 								= vc
 
		3	Street_Address						= vc
		3	Street_Address2						= vc
		3	Street_Address3						= vc
		3	Street_Address4						= vc
 
		3	Zip_Code							= vc
		3	City								= vc
		3	State								= vc
  		3 	policy_nbr 							= vc
  		3	group_nbr							= vc
 
	2	Performing_Loc						= vc
	2	Date_of_service						= vc
	2	Exam_order_id						= f8
	2	exam_event_id						= f8
	2	Exam_display						= vc
	2	Exam_loc							= vc
	2	Reason_for_visit					= vc
	2	Cpt[*]
		3	code 							= vc
		3	display							= vc
	2	ordering_prov_id					= f8
	2	ordering_prov_name					= vc
 
	2	Rpt_event_id						= f8
	2	rpt_order_id 						= f8
;	2   rpt_type                			= vc
	2	rpt_final_date						= vc
	2	rpt_final_date2						= vc
	2	doc_qual[*]
    	3 doc = vc
    )
 
 
select into "nl:"
;ce.event_id,
;ce.order_id,
celr.linked_event_id,
ce3.collating_seq,
ce3.order_id,
ce3.task_assay_cd,
event_name = uar_get_code_display(ce3.event_cd),
ce3.*,
b.*
from  rad_report rr ,
 ce_linked_result  celr ,
 encounter e,
 person p,
 encntr_alias mrn,
 encntr_alias fnbr,
 person_alias pa,
 clinical_event  ce3 ,
 ce_blob_result  br ,
 ce_blob  cb ,
 ce_event_note  cnote ,
 long_blob  sig
 plan  rr
where rr.posted_final_dt_tm between (cnvtdatetime(cnvtdate(beg_dt),0)) and
                                     (cnvtdatetime(cnvtdate(end_dt),235959))
join celr
	where celr.linked_event_id=;ce.event_id
						rr.report_event_id
	and celr.valid_until_dt_tm= cnvtdatetime ("31-dec-2100 00:00:00.00" )
join e
	where e.encntr_id = celr.encntr_id
	and e.loc_facility_cd in (24988875.00, 24988876.00, 24988877.00, 24988878.00, 24988879.00, 24988880.00)
;and e.encntr_id = 41953355
 
join p
	where p.person_id = e.person_id
join mrn
	where mrn.encntr_id = outerjoin(e.encntr_id)
	and mrn.encntr_alias_type_cd = outerjoin(mrncd)
	and mrn.active_ind = outerjoin(1)
	and mrn.end_effective_dt_tm > outerjoin(sysdate)
join fnbr
	where fnbr.encntr_id = outerjoin(e.encntr_id)
	and fnbr.encntr_alias_type_cd = outerjoin(fincd)
	and fnbr.active_ind = outerjoin(1)
	and fnbr.end_effective_dt_tm > outerjoin(sysdate)
join pa
	where pa.person_id = outerjoin(e.person_id)
	and pa.active_ind = outerjoin(1)
	and pa.person_alias_type_cd = outerjoin(SSNcd)
	and pa.end_effective_dt_tm > outerjoin(sysdate)
join ce3
	where ce3.parent_event_id=celr.linked_event_id
 	and ce3.valid_until_dt_tm= cnvtdatetime ("31-dec-2100 00:00:00.00" )
;and  (( ((ce3.record_status_cd+ 0 )> deleted_cd ) )
;       or  (((ce3.record_status_cd+ 0 )< deleted_cd ) ))
 
join br
	where br.event_id=ce3.event_id
 	and br.valid_until_dt_tm= cnvtdatetime ("31-dec-2100 00:00:00.00")
join cb
	where cb.event_id=br.event_id
	and cb.valid_until_dt_tm= cnvtdatetime ("31-dec-2100 00:00:00.00" )
join cnote
	where cnote.event_id= outerjoin (ce3.event_id)
;and (cnote.note_type_cd= outerjoin ( note_type_cd ))
 	and cnote.valid_until_dt_tm= outerjoin ( cnvtdatetime ("31-dec-2100 00:00:00.00" ))
join sig
	where sig.parent_entity_id= outerjoin (cnote.ce_event_note_id)
	and sig.parent_entity_name=  outerjoin ("ce_event_note" )
 
;select; into $outdev
;cb.* from ce_blob cb where cb.event_id =     828985638.00
order rr.report_event_id,cb.blob_seq_num
head report
	rpt_cnt = 0
head rr.report_event_id
	rpt_cnt = rpt_cnt + 1
	stat = alterlist(temp->qual,rpt_cnt)
	temp->qual[rpt_cnt].encntr_id 			= e.encntr_id
	temp->qual[rpt_cnt].dob 				= format(P.birth_dt_tm,"mm/dd/yyyy")
	temp->qual[rpt_cnt].name_full_formatted = substring(1,35,p.name_full_formatted)
	temp->qual[rpt_cnt].rpt_final_date	 	= format(rr.posted_final_dt_tm, "mm/dd/yyyy;;d")
	temp->qual[rpt_cnt].mrn 				= cnvtalias(mrn.alias,mrn.alias_pool_cd)
	temp->qual[rpt_cnt].fin 				= cnvtalias(fnbr.alias,mrn.alias_pool_cd)
	temp->qual[rpt_cnt].ssn					= cnvtalias(pa.alias,pa.alias_pool_cd)
	temp->qual[rpt_cnt].person_id			= e.person_id
	temp->qual[rpt_cnt].encntr_type         = uar_get_code_display(e.encntr_type_cd) ; 001
	temp->qual[rpt_cnt].Exam_event_id		= celr.event_id
	temp->qual[rpt_cnt].Exam_order_id		= celr.order_id
	temp->qual[rpt_cnt].Rpt_event_id 		= celr.linked_event_id
	temp->qual[rpt_cnt].rpt_final_date		= format(rr.posted_final_dt_tm, "mm/dd/yyyy hh:mm:ss;;d")
	temp->qual[rpt_cnt].rpt_final_date2		= format(ce3.event_end_dt_tm , "mm/dd/yyyy hh:mm:ss;;d")
;	temp->qual[rpt_cnt]
;	temp->qual[rpt_cnt]
 
 
 
 
 
head cb.event_id
;   temp1 = fillstring(500," ")
   z = 0
detail
;if(btest(ce.subtable_bit_map, BITMAP_CE_BLOB_RESULT) = 1
;				and cbr.event_id > 0.0 )
			;if the blob is compressed use uar to uncompress
			sBlobIn = fillstring(32768, " ")
			sOutBuffer = fillstring(32768, " ")
		    if (cb.compression_cd = dOCFCompCd)
;		       temp->qual[rpt_cnt].rpt_type = "compressed"
		      iUnCompressRetLen = 0
		      call uar_ocf_uncompress(cb.blob_contents,cb.blob_length,sBlobIn, textlen(sBlobIn), iUnCompressRetLen)
		      if (br.format_cd = rtf_cd)
		     	 stat = uar_rtf2(sBlobIn, textlen(trim(sBlobIn)),sOutBuffer, iOutBuffLen, 1)
	         	 if (stat = 1)
;		          reply->tokens[iReplyTokenCount]->data_value = sOutBuffer
					 call echo (soutbuffer)
;			      call echo(build("RetVal->", reply->tokens[iReplyTokenCount]->data_value))
			  	endif
			  else
			  	  soutbuffer = sBlobIn
			  endif
		    elseif (br.format_cd = rtf_cd)
		      sBlobIn = cb.blob_contents
 
			      stat = uar_rtf2(sBlobIn, textlen(trim(sBlobIn)), sOutBuffer, iOutBuffLen, 1)
	          	if (stat = 1)
		        	  call echo( sOutBuffer)
;			      call echo(build("RetVal->", reply->tokens[iReplyTokenCount]->data_value))
			  	endif
			else
			  	sOutBuffer = cb.blob_contents
		    endif
;		    call echo (sBlobIn)
 x1 = size(trim(sOutBuffer))
;;temp1 = substring(1,x1,sBlobIn)
;;
;;   z = z + 1
;;   stat = alterlist(temp->qual[rpt_cnt].doc_qual,z)
;;   temp->qual[rpt_cnt].doc_qual[z]->doc = sBlobIn ;temp1
;;
 
temp1 = substring(1,x1,sOutBuffer)
cr1 = 0
sub1 = 1
 
cr1 = findstring(cr,temp1)
if (cr1 > 0)
 
 
  while (cr1 > 0)
         z = z + 1
   stat = alterlist(temp->qual[rpt_cnt].doc_qual,z)
   temp->qual[rpt_cnt].doc_qual[z]->doc = substring (sub1,cr1-1,temp1)
   temp1 = substring(cr1 +1, (size(temp1)-cr1),temp1)
   cr1 = findstring(cr,temp1)
   call echo (temp1)
   if (z > 500)
      cr1 = 0
      call echo (" looped more than 500 times --- breaking out")
   endif
  endwhile
;call echo (build("cr1 = ",cr1))
else
   z = z + 1
      stat = alterlist(temp->qual[rpt_cnt].doc_qual,z)
   temp->qual[rpt_cnt].doc_qual[z]->doc = temp1
endif
with nocounter
 
;001 added check for zero qualifing record
if (size(temp->qual,5) = 0)
    select into $outdev
 
	from (dummyt d with seq  =1 )
	plan d
 
	head report
	 XCOL = 0 ,
	 YCOL = 0 ,
	 SCOL = 0 ,
	 ZCOL = 0 ,
	 LINE_CNT = 0 ,
	 AST  = "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *" ,
	 AST2 = "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *" ,
	 CAT_LINE = FILLSTRING ( 150 ,  " " )
 
 
	HEAD PAGE
	; "{cpi/10}{f/12}" ,
	 "{cpi/13}{f/8}" ,
	 ROW + 1 ,
	 "{pos/200/50}{b}LCMC Performance Billing Report" ,
	 ROW + 1 ,
	 "{cpi/13}{f/8}" ,
	 ROW + 1 ,
	 "{pos/200/70}{b}  ******* No Data Qualified: ******* {endb}" ,
	 ROW + 1
	with ;nocounter, maxcol = 32000, format = undefined
	NOCOUNTER , MAXCOL = 800 , MAXROW = 800 , DIO = POSTSCRIPT
   go to end_program
endif
;001 end block 
; get address
select into "nl:"
 
from (dummyt d with seq = size(temp->qual,5)),
	Address a
plan d
join a where a.parent_entity_name = "PERSON"
	and a.parent_entity_id = temp->qual[d.seq].person_id
	and a.active_ind = 1
	and a.end_effective_dt_tm > sysdate
	and a.address_type_cd = home_cd
 
detail
	temp->qual[d.seq].pat.Street_Address = a.street_addr
	temp->qual[d.seq].pat.Street_Address2 = a.street_addr2
	temp->qual[d.seq].pat.Street_Address3 = a.street_addr3
	temp->qual[d.seq].pat.Street_Address4 = a.street_addr4
	temp->qual[d.seq].pat.City 			  = if (a.city_cd > 0)
													uar_get_code_display(a.city_cd)
												   else
												     a.city
												   endif
	temp->qual[d.seq].pat.State 			= if (a.state_cd > 0)
													uar_get_code_display(a.state_cd)
												   else
												     a.state
												   endif
	temp->qual[d.seq].pat.Zip_Code			= if (size(a.zipcode,1) > 5)
												format(a.zipcode, "#####-####")
											  else
											    a.zipcode
											  endif
 
with nocounter
 
; get address
select into "nl:"
 
from (dummyt d with seq = size(temp->qual,5)),
	phone p
plan d
join p where p.parent_entity_name = "PERSON"
	and p.parent_entity_id = temp->qual[d.seq].person_id
	and p.active_ind = 1
	and p.end_effective_dt_tm > sysdate
	and p.phone_type_cd = home_phone_cd
 
detail
	temp->qual[d.seq].pat.Home_Phone = p.phone_num
with nocounter
 
 
 
 
;************************ exam information *******************************
 
 
select into "nl:"
 
from (dummyt d with seq = size(temp->qual,5)),
	rad_exam re,
	order_detail od,  ;  reason for visit
	order_action oa,   ; ordering provider
	person p,           ; ordering provider name
	loc_resource_r lr
plan d
join re
	where re.order_id = temp->qual[d.seq].Exam_order_id
join lr
	where lr.service_resource_cd = outerjoin(re.service_resource_cd)
	and lr.loc_resource_type_cd = outerjoin(rad_resource_cd)
join oa
	where oa.order_id = re.order_id
	  and oa.action_type_cd = order_action_cd
join p
	where p.person_id = oa.order_provider_id
join od
	where od.order_id = re.order_id
	and od.oe_field_meaning = "REASONFOREXAM"
order by od.action_sequence desc
head re.order_id
   	temp->qual[d.seq].Date_of_service = format(re.complete_dt_tm ,"mm/dd/yyyy;;d")
   	temp->qual[d.seq].ordering_prov_id = oa.order_provider_id
   	temp->qual[d.seq].ordering_prov_name = p.name_full_formatted
   	temp->qual[d.seq].Exam_loc = uar_get_code_display(lr.location_cd)
detail
	temp->qual[d.seq].Reason_for_visit = od.oe_field_display_value
with nocounter
 
 
;***********************  Guarantor  **************************************
;call echo ("Guarantor")
 
	select into "nl:"
	from (dummyt d with seq = size(temp->qual,5)),
		encntr_person_reltn epr,
		person p
	plan d
	join epr
		where epr.encntr_id = temp->qual[d.seq].encntr_id
        and epr.active_ind >= 1
        and epr.person_reltn_type_cd = def_guar_cd
        and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
        and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join p
		where p.person_id = epr.related_person_id
 
	head d.seq
 
		temp->qual[d.seq].guarantor_name = p.name_full_formatted
	with nocounter
 
;*******************************cpt4 info from chage mod table ****************************
 
   select into "nl:"
   from (dummyt d with seq = size(temp->qual,5)),
   		charge c,
   		charge_mod cm
   	plan d
 
   	join c
   		where c.order_id = temp->qual[d.seq].Exam_order_id
   	join cm
	   	where cm.charge_item_id = c.charge_item_id
	   	and cm.charge_mod_type_cd = BILL_CODE_cd
	   	and cm.field1_id = CPT4_cd
	head c.order_id
		cpt_cnt = 0
	detail
		cpt_cnt = cpt_cnt + 1
	    stat = alterlist(temp->qual[d.seq].Cpt,cpt_cnt)
		temp->qual[d.seq].Cpt[cpt_cnt].code = cm.field6
	with nocounter
 
 
 
;***********************  insurance **************************************
;call echo("get insurance_info")
;call echo (business_add_cd)
 
	select into "nl:"
	from (dummyt d with seq = size(temp->qual,5)),
;;	dummyt d2,
		encntr_plan_reltn epr,
		person p,
		encntr_person_reltn enc_pr,
 
		health_plan hp,
;;		authorization auth,
		address epr_a,
		phone epr_ph
;		address hp_a,
;		phone hp_ph,
;		person_org_reltn por,
;		address sub_a,
;		phone sub_ph,
;		organization o,
;		address oa,
;		phone oph
	plan d
	join epr
		where epr.encntr_id = temp->qual[d.seq].encntr_id
		and epr.active_ind >= 1
        and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
        and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join p
		where p.person_id = epr.person_id
 
	join enc_pr
		where enc_pr.encntr_id = epr.encntr_id
		and enc_pr.related_person_id = epr.person_id
		and enc_pr.person_reltn_type_cd = insured_cd
		and enc_pr.active_ind = 1
		and enc_pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
        and enc_pr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
 
	join hp
		where hp.health_plan_id = epr.health_plan_id
;;;	join auth
;;;		where auth.encntr_id = outerjoin(epr.encntr_id)
;;;		and auth.health_plan_id = outerjoin(epr.health_plan_id)
;;;		and auth.auth_type_cd = outerjoin(auth_type_cd)
;;;;		and auth.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
;;;;		and auth.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
	join epr_a
		where epr_a.parent_entity_id = outerjoin(epr.encntr_plan_reltn_id)
		and epr_a.parent_entity_name = outerjoin("ENCNTR_PLAN_RELTN")
		and epr_a.active_ind = outerjoin(1)
		and epr_a.address_type_cd = outerjoin(business_add_cd)
 
	join epr_ph
		where epr_ph.parent_entity_id = outerjoin(epr.encntr_plan_reltn_id)
		and epr_ph.parent_entity_name = outerjoin("ENCNTR_PLAN_RELTN")
		and epr_ph.active_ind = outerjoin(1)
		and epr_ph.phone_type_cd = outerjoin(business_phone_cd)
;;;	join hp_a
;;;		where hp_a.parent_entity_id = outerjoin(hp.health_plan_id)
;;;		and hp_a.parent_entity_name = outerjoin("HEALTH_PLAN")
;;;		and hp_a.active_ind = outerjoin(1)
;;;		and hp_a.address_type_cd = outerjoin(business_add_cd)
 
;;	join hp_ph
;;		where hp_ph.parent_entity_id = outerjoin(hp.health_plan_id)
;;		and hp_ph.parent_entity_name = outerjoin("HEALTH_PLAN")
;;		and hp_ph.active_ind = outerjoin(1)
;;		and hp_ph.phone_type_cd = outerjoin(business_phone_cd)
 
 
 
;;	join sub_a
;;		where sub_a.parent_entity_id = outerjoin(epr.person_id)
;;		and sub_a.parent_entity_name = outerjoin("PERSON")
;;		and sub_a.address_type_cd = outerjoin(home_add_cd);(business_add_cd)
;;		and sub_a.active_ind = outerjoin(1)
;;	join sub_ph
;;		where sub_ph.parent_entity_id = outerjoin(epr.person_id)
;;		and sub_ph.parent_entity_name = outerjoin("PERSON")
;;		and sub_ph.phone_type_cd = outerjoin(home_phone_cd);(business_phone_cd)
;;		and sub_ph.active_ind = outerjoin(1)
;;
;;	join por  ; subscriber
;;		where por.person_id = outerjoin(epr.person_id)
;;		and por.active_ind = outerjoin(1)
;;		and por.person_org_reltn_cd = outerjoin(sub_employer_cd)
;;	join d2
;;;	join o
;;;		where o.organization_id = por.organization_id
;;;	join oa
;;;		where oa.parent_entity_id = outerjoin(o.organization_id)
;;;		and oa.parent_entity_name = outerjoin("ORGANIZATION")
;;;		and oa.address_type_cd = outerjoin(business_add_cd)
;;;		and oa.active_ind = outerjoin(1)
;;;	join oph
;;;		where oph.parent_entity_id = outerjoin(o.organization_id)
;;;		and oph.parent_entity_name = outerjoin("ORGANIZATION")
;;;		and oph.phone_type_cd = outerjoin(business_phone_cd)
;;;		and oph.active_ind = outerjoin(1)
 
 	order d.seq, epr.priority_seq
 	head d.seq
 		p_cnt = 0
 	head epr.priority_seq
 		p_cnt = p_cnt + 1
 		stat = alterlist(temp->qual[d.seq].ins,p_cnt)
		temp->qual[d.seq].ins[p_cnt].ins_carrier = hp.plan_name
		temp->qual[d.seq].ins[p_cnt].Street_Address 	= epr_a.street_addr
		temp->qual[d.seq].ins[p_cnt].Street_Address2 	= epr_a.street_addr2
		temp->qual[d.seq].ins[p_cnt].Street_Address3 	= epr_a.street_addr3
		temp->qual[d.seq].ins[p_cnt].Street_Address4 	= epr_a.street_addr4
		temp->qual[d.seq].ins[p_cnt].City				= if (epr_a.city_cd > 0)
													uar_get_code_display(epr_a.city_cd)
												   else
												     epr_a.city
												   endif
		temp->qual[d.seq].ins[p_cnt].State				= if (epr_a.state_cd > 0)
													uar_get_code_display(epr_a.state_cd)
												   else
												     epr_a.state
												   endif
;		temp->qual[d.seq].ins[p_cnt].Zip_Code 			= epr_a.zipcode
		temp->qual[d.seq].ins.Zip_Code		= if (size(epr_a.zipcode,1) > 5)
												format(epr_a.zipcode, "#####-####")
											  else
											    epr_a.zipcode
											  endif
 
 
		temp->qual[d.seq].ins[p_cnt].group_nbr			= hp.group_nbr
		temp->qual[d.seq].ins[p_cnt].policy_nbr		= epr.subs_member_nbr
 
 
	with nocounter
; call echo(" in program ")
;go to end_program
;*************************************************************************************
 
call echo (temp1)
 
 
select into $outdev
   doc = substring (1,(size (temp->qual[d.seq].doc_qual[d1.seq].doc)),temp->qual[d.seq].doc_qual[d1.seq].doc)
;   doc = temp->qual[d.seq].doc
;   doc = temp1
from (dummyt d with seq = size(temp->qual,5)),
      (dummyt d1 with seq =1 )
plan d
 where maxrec(d1,size(temp->qual[d.seq].doc_qual,5))
join d1
head report
 XCOL = 0 ,
 YCOL = 0 ,
 SCOL = 0 ,
 ZCOL = 0 ,
 LINE_CNT = 0 ,
 AST  = "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *" ,
 AST2 = "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *" ,
 CAT_LINE = FILLSTRING ( 150 ,  " " )
 
	xof_addr = 29
	xoff_ins_info = 240
	xoff_ins_addr = 285
	xoff_policy = 240
	xoff_group = 380
	xoff_dob = 86
	xoff_ssn = 0
	xoff_exam_dt = 86
	xoff_encntr_type = 0;240   ;001
	xoff_exam_loc = 0
	xoff_rfv = 0
	xoff_op = 0
	xoff_cpt = 0
	hold_y1 = 0
	hold_y2 = 0
 
HEAD PAGE
; "{cpi/10}{f/12}" ,
 "{cpi/13}{f/8}" ,
 ROW + 1 ,
 "{pos/200/50}{b}LCMC Performance Billing Report" ,
 ROW + 1 ,
 "{cpi/13}{f/8}" ,
 ROW + 1 ,
 "{pos/30/70}{b}Name: {endb}" ,
 temp->qual[d.seq].name_full_formatted ,
 ROW + 1 ,
 YCOL = 80
 xcol = 30
 hold_y1 = 0
 hold_y2 = 0
 
	 CALL PRINT(CALCPOS(XCOL+ xof_addr,YCOL)),; "{b}Address: {endb}" ,
	 temp->qual[d.seq].pat.Street_Address ,
	 ycol = ycol + 10,
	 ROW + 1
 
 
 if (temp->qual[d.seq].pat.Street_Address2 > "")
	 CALL PRINT(CALCPOS(XCOL + xof_addr,YCOL))
	 temp->qual[d.seq].pat.Street_Address2 ,
	 ycol = ycol + 10
	 ROW + 1
 
 endif
  if (temp->qual[d.seq].pat.Street_Address3 > "")
	 CALL PRINT(CALCPOS(XCOL + xof_addr,YCOL))
	 temp->qual[d.seq].pat.Street_Address3 ,
	 ycol = ycol + 10
	 ROW + 1
 
 endif
  if (temp->qual[d.seq].pat.Street_Address4 > "")
	 CALL PRINT(CALCPOS(XCOL + xof_addr,YCOL))
	 temp->qual[d.seq].pat.Street_Address4 ,
	 ycol = ycol + 10
	 ROW + 1
 
 endif
	city_state = fillstring(50," ")
	city_state = concat(temp->qual[d.seq].pat.City,", ",temp->qual[d.seq].pat.State," ",temp->qual[d.seq].pat.Zip_Code)
 
 	 CALL PRINT(CALCPOS(XCOL + xof_addr,YCOL)) city_state
	 ycol = ycol + 10
	 ROW + 1
 
 
	 CALL PRINT(CALCPOS(XCOL,YCOL)), "{b}Guarantor: {endb}" ,
	 temp->qual[d.seq].guarantor_name,
	 ycol = ycol + 10
	 ROW + 1
 
 
 
	 CALL PRINT(CALCPOS(XCOL,YCOL)) "{b}MRN: {endb}" ,
 temp->qual[d.seq].mrn ,
; 	 ycol = ycol + 10
 ROW + 1 ,
 
 
	 CALL PRINT(CALCPOS(XCOL+xoff_dob ,YCOL)) "{b}DOB: {endb}" ,
 temp->qual[d.seq].dob,
 	 ycol = ycol + 10
 
 ROW + 1 ,
	 CALL PRINT(CALCPOS(XCOL+xoff_ssn,YCOL)) "{b}SSN: {endb}" ,
;   if (temp->qual[d.seq].ssn > " ")
  temp->qual[d.seq].ssn
;  else
;   temp->qual[d.seq].person_id, " **"
;   endif
 
 ROW + 1 ,
 
 
 
 
 
;	 CALL PRINT(CALCPOS(XCOL+xoff_exam_dt,YCOL)) "{b}Exam Date: {endb}" ,
; temp->qual[d.seq].Date_of_service ,
; 
; ROW + 1 ,                                                                           ;001
; 
;	 CALL PRINT(CALCPOS(XCOL+xoff_encntr_type,YCOL)) "{b}Encounter type: {endb}" ,   ;001
; temp->qual[d.seq].encntr_type ,                                                     ;001
; 
;ROW + 1 ,                                                                            ;001
 
 	 ycol = ycol + 10
 
 
	 CALL PRINT(CALCPOS(XCOL+xoff_cpt,YCOL)) "{b}CPT: {endb}" ,
 
 if (size(temp->qual[d.seq].Cpt,5) > 0)
 	for (z = 1 to size(temp->qual[d.seq].Cpt,5))
 	     If (z > 1)
 	        ", "
 	     endif
		 temp->qual[d.seq].Cpt[z].code
 
 	 endfor
 endif
  	 ycol = ycol + 10
 	 row +1
 
	 CALL PRINT(CALCPOS(XCOL+xoff_exam_loc,YCOL)) "{b}Exam Location: {endb}" ,
		temp->qual[d.seq].Exam_loc
; temp->qual[d.seq].Date_of_service ,
 	 ycol = ycol + 10
 	 row +1

 ROW + 1 ,                                                                           ;001
 
	 CALL PRINT(CALCPOS(XCOL+xoff_encntr_type,YCOL)) "{b}Encounter type: {endb}" ,   ;001
     temp->qual[d.seq].encntr_type ,                                                 ;001
 	 ycol = ycol + 10                                                                ;001
ROW + 1 ,                                                                            ;001
 
 
;Insurance information
xcol = 30
hold_y1 = ycol
ycol = 70
 CALL PRINT(CALCPOS(XCOL+ xoff_ins_info,YCOL)), "{b}Insurance Information {endb}" ,
 
 
	 ROW + 1
;; CALL PRINT(CALCPOS(XCOL+xoff_policy,YCOL)), "{b}Policy #  {endb}" ,
;; 	 temp->qual[d.seq].ins.policy_nbr
;;	 ROW + 1
;;;  CALL PRINT(CALCPOS(XCOL+xoff_group,YCOL)), "{b}Group #  {endb}" ,
; 	 temp->qual[d.seq].ins.policy_nbr
;	 ROW + 1
 ycol = ycol + 10,
 
;   CALL PRINT(CALCPOS(XCOL+xoff_group,YCOL)), "{b}Group #  {endb}" ,
; 	 temp->qual[d.seq].ins.policy_nbr
;	 ROW + 1
;
 for (z = 1 to size(temp->qual[d.seq].ins,5))
 	  ins_line = fillstring(20," ")
      ins_line = concat("{b}Carrier",format(z ,"#"),": {endb}")
	  CALL PRINT(CALCPOS(XCOL+ xoff_ins_info,YCOL)), ins_line ; "{b}Carrier: {endb}" ,
		 temp->qual[d.seq].ins[z].ins_carrier ,
		 ycol = ycol + 10,
		 ROW + 1
 
	; if (temp->qual[d.seq].ins[z].Street_Address > "")
 
		 CALL PRINT(CALCPOS(XCOL+ xoff_ins_addr,YCOL)) ;"{b}Address: {endb}" ,
		 temp->qual[d.seq].ins[z].Street_Address ,
		 ycol = ycol + 10
		 ROW + 1
	; endif
	;xcol = 314
 
	 if (temp->qual[d.seq].ins[z].Street_Address2 > "")
		 CALL PRINT(CALCPOS(XCOL+ xoff_ins_addr,YCOL))
		 temp->qual[d.seq].ins[z].Street_Address2 ,
		 ycol = ycol + 10
		 ROW + 1
	 endif
	  if (temp->qual[d.seq].ins[z].Street_Address3 > "")
		 CALL PRINT(CALCPOS(XCOL+ xoff_ins_addr,YCOL))
		 temp->qual[d.seq].ins[z].Street_Address3 ,
		 ycol = ycol + 10
		 ROW + 1
	 endif
	  if (temp->qual[d.seq].ins[z].Street_Address4 > "")
		 CALL PRINT(CALCPOS(XCOL+ xoff_ins_addr,YCOL))
		 temp->qual[d.seq].ins[z].Street_Address4 ,
		 ycol = ycol + 10
		 ROW + 1
	 endif
 
	city_state = fillstring(50," ")
	city_state = concat(temp->qual[d.seq].ins[z].City,", ",temp->qual[d.seq].ins[z].State," ",temp->qual[d.seq].ins[z].Zip_Code)
	 	 CALL PRINT(CALCPOS(XCOL+ xoff_ins_addr,YCOL)) city_state
		 ycol = ycol + 10
		 ROW + 1
	 CALL PRINT(CALCPOS(XCOL+xoff_policy,YCOL)), "{b}Policy #  {endb}" ,
	 	 temp->qual[d.seq].ins[z].policy_nbr
		 ROW + 1
 
 
 
	   CALL PRINT(CALCPOS(XCOL+xoff_group,YCOL)), "{b}Group #  {endb}" ,
	 	 temp->qual[d.seq].ins[z].policy_nbr
	 	 ycol = ycol + 20
		 ROW + 1
	hold_y2 = ycol
endfor
XCOL = 30
 
If (hold_y2 > hold_y1)
	YCOL = hold_y2
else
	ycol = hold_y1 + 10
endif
 
;  	 ycol = ycol + 10
 row + 1
 
	 CALL PRINT(CALCPOS(XCOL+xoff_rfv,YCOL)) "{b}Reason for Visit: {endb}" ,
 temp->qual[d.seq].Reason_for_visit ,
 row + 1
 ycol = ycol + 10
 
	 CALL PRINT(CALCPOS(XCOL+xoff_op,YCOL)) "{b}Ordering Provider: {endb}" ,
 temp->qual[d.seq].ordering_prov_name ,
  	 ycol = ycol + 20
 row + 1
;;  "{pos/270/80}{b}Gender: {endb}" ,
;; SEX ,
;; ROW + 1 ,
;; "{pos/370/80}{b}HT: {endb}" ,
;; Height ,
;; ROW + 1 ,
;;  "{pos/470/80}{b}WT: {endb}" ,
;; weight ,
;;
;; ROW + 1 ,
;; "{pos/30/90}{b}Location: {endb}" ,
;; LOCATION ,
 
 
;col 0  "*************report start *************************"
;row + 1
cnt = 0
new_rpt = 0
HEAD D.SEQ
 
	if (new_rpt > 0)
		break
	endif
;;;   col 0 temp->qual[d.seq].encntr_id
;;;   call echo (temp->qual[d.seq].encntr_id)
;;;   col +5 temp->qual[d.seq].name_full_formatted
;;;   col +5 temp->qual[d.seq].rpt_final_date
;;;   col +5 temp->qual[d.seq].mrn
;;;   col +5 temp->qual[d.seq].fin
;;;   row +1
;;;   col 0 temp->qual[d.seq].exam_event_id
;;;   col + 5 temp->qual[d.seq].Exam_order_id
;;;   col + 5 temp->qual[d.seq].Rpt_event_id
;;;   col + 5 temp->qual[d.seq].rpt_final_date
;;;   col + 5 temp->qual[d.seq].rpt_final_date2
 
;; ycol = 130
; ycol = 190
 XCOL = 30
;; CALL PRINT(CALCPOS(XCOL,YCOL))
;; TEMP->QUAL[X]->QUAL [ Y ]-> DATE  ROW + 1
;;  XCOL = 415
;;  CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) TEMP -> QUAL [ X ]-> QUAL [ Y ]-> taken_DATE  ROW + 1
;;
;; XCOL = 490
;; CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "_____         _____"
;; XCOL = 100  SCOL = YCOL
 
   cnt = cnt + 1
DETAIL
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) temp->qual[d.seq].doc_qual[D1.SEQ].doc
 row +1
 YCOL =( YCOL + 10 ) ZCOL = YCOL
;;
;;
;;
	if (ycol > 750)
		breaK
	ENDIF
 
	new_rpt = 1
 
 
with ;nocounter, maxcol = 32000, format = undefined
	NOCOUNTER , MAXCOL = 800 , MAXROW = 800 , DIO = POSTSCRIPT
 
 
# end_program
free record temp
;if (ops_ind != "N")
;  set reply->status_data->status = "S"
;endif
 
end
go
