/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-1995 Cerner Corporation                 *
 *                                                                      *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
 *  This material contains the valuable properties and trade secrets of *
 *  Cerner Corporation of Kansas City, Missouri, United States of       *
 *  America (Cerner), embodying substantial creative efforts and        *
 *  confidential information, ideas and expressions, no part of which   *
 *  may be reproduced or transmitted in any form or by any means, or    *
 *  retained in any storage or retrieval system without the express     *
 *  written permission of Cerner.                                       *
 *                                                                      *
 *  Cerner is a registered mark of Cerner Corporation.                  *
 *                                                                      *
 ************************************************************************
 
          Date Written:       03/12/98
          Source file name:   mayo_mn_pco_result_letter_bj.prg
          Object name:        mayo_mn_pco_result_letter_bj
          Request #:
 
          Product:            ExploreMenu
          Product Team:
          HNA Version:        V500
          CCL Version:
 
          Program purpose:    Prints a report out of Explorer Menu to show
                              patients results from the lab.
 
          Tables read:        Person, Clinical_Event, Address, order_action, prsnl, orders
 
          Tables updated:     None
 
          Executing from:     Explorer Menu
 
          Special Notes:
 
          Include Files:
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 11/11/08 Nancy Toalson      initial release SR 1-2137310801      *
 *001 12/05/08 Bharti Jain		  Custom Changes Requested by site     *
 *003 12/30/09 Akcia						Modify prompt to have two versions one for providers
 																and one for non-providers
 *004 07/22/10 Akcia			  Add comments to the display to show outside lab info
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
DROP PROGRAM mayo_mn_pco_result_letter_se:dba GO
CREATE PROGRAM mayo_mn_pco_result_letter_se:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start Date:" = CURDATE
	, "End Date:" = CURDATE
	, "Person" = 0
	;<<hidden>>"Search" = ""
	;<<hidden>>"Remove" = ""
	, "Select results NOT to show" = 0
	, "provider" = 0
 
with OUTDEV, SDATE, EDATE, lstPerson, results_not_show, providerid
 
declare foot_person_ind = i2 with protect, noconstant(0);mo61596
declare print_page_nbr = i2 with protect, noconstant(0);mo61596
declare AUTH          = f8 with  protect, constant(uar_get_code_by("MEANING",8,"AUTH")) ;public,noconstant(0.0)
declare inerror1_cd    = f8 with  protect, constant(uar_get_code_by("MEANING",8,"IN ERROR")) 	;004
declare inerror2_cd    = f8 with  protect, constant(uar_get_code_by("MEANING",8,"INERROR")) 	;004
declare LABCD         = f8 with Constant(uar_get_code_by("DESCRIPTION",93,"LABORATORY")),protect
;eclare MRNCD         = f8 with protect, constant(uar_get_code_by("MEANING", 4, "MRN"))
declare ORDERCD       = f8 with protect, Constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare HOMECD        = f8 with Constant(uar_get_code_by("MEANING",212,"HOME")),protect
declare address_cd    = f8 with protect,constant(uar_get_code_by("MEANING",212,"BUSINESS"))
declare phone_cd  	  = f8 with protect,constant(uar_get_code_by("MEANING",43,"BUSINESS"))
declare compression_cd  	  = f8 with protect,constant(uar_get_code_by("MEANING",120,"OCFCOMP"))		;004
declare completed_cd  	  = f8 with protect,constant(uar_get_code_by("MEANING",6004,"COMPLETED"))		;004
declare docsigf = vc
declare docsigl = vc
declare pg_num        = i4
declare num                   = I4
declare loc_encntr_id = f8	;003
;declare provider_id = f8 with constant(reqinfo->updt_id)  ;003
 
;declare new_person_id                  = I4 with public, noconstant(0.0)
;declare old_person_id                  = I4 with public, noconstant(0.0)
;declare all_docs = vc with public, noconstant(" ")
;declare normal_range = vc
 
;declare lab_result = vc
;declare labname = vc
;declare doc_name = vc
;declare lab_name = vc
 
;declare lab_final = vc
;declare ref_range = vc
;declare num = i4
 
;set AUTH = uar_get_code_by("MEANING",8,"AUTH")
CALL ECHO(BUILD("HOME ADDRESS CODE ",HOMECD))
 
;003  set s_d = cnvtdatetime(cnvtdate2($SDATE,"dd-mmm-yyyy"),0)
 
;003 set e_d = cnvtdatetime(cnvtdate2($EDATE,"dd-mmm-yyyy"),235959)
 
;call echo(build("TESTING SDATE",s_d))
;call echo(build("TESTING EDATE",e_d))
;call echo($PROVIDER)
;call echo($SIGDOC)
;
 
%i ccluserdir:aps_uar_rtf.inc
free set lab
record lab
(
   1 lab_cnt                            = i4
   1 lab_qual[*]
     2 lab_cd                           = f8
)
 
;free set tmp
record tmp
(  1 results_not											= vc
   1 Person_id                          = f8
   1 pat_name                           = vc
   1 pat_fname                          = vc
   1 pat_lname                          = vc
   1 address                            = vc
   1 city                               = vc
   1 state                              = vc
   1 zip_code                           = vc
   1 b_day                              = dq8
   1 doc_sig                            = vc
   1 doc_cnt                            = i4
   1 all_docs                           = vc
   1 fac_facility												= vc  ;003
   1 fac_address1												= vc  ;003
   1 fac_city														= vc  ;003
   1 fac_state													= vc  ;003
   1 fac_zip														= vc  ;003
   1 fac_phone													= vc  ;003
   1 result_cnt                         = i4
   1 result_qual[*]
     2 order_id                         = f8
     ;2 order_date						= dq8  ;m061596
     2 performed_date					= dq8  ;003
     2 doc_id                           = f8
     2 doc_name                         = vc
     2 lab_name                         = vc
     2 result_val                       = vc
     2 normal_cd                        = vc
     2 ref_range                        = vc
     2 comment							= vc   ;004
)
set tmp->results_not = build("results=",$results_not_show)
 
;Getting all the lab order event codes
select into "nl:"
from v500_event_set_explode vese
where vese.event_set_cd = LABCD
head report
  lab_cnt = 0
detail
  lab_cnt = lab_cnt + 1
  if (mod(lab_cnt, 10) = 1)
    stat = alterlist(lab->lab_qual, lab_cnt + 9)
  endif
  lab->lab_qual[lab_cnt]->lab_cd = vese.event_cd
foot report
  stat = alterlist(lab->lab_qual, lab_cnt)
  lab->lab_cnt = lab_cnt
with nocounter
 
;main select statement
select into "nl:"
from prsnl pr
where pr.person_id = $providerid  ;003 $SIGDOC
  and pr.active_ind = 1
 
detail
  docsigf             = trim(pr.name_first)
  docsigl             = trim(pr.name_last)
  tmp->doc_sig        = concat("Dr. ",docsigf, " ", docsigl)
with nocounter
 
 
SELECT INTO "nl:"
cd= uar_get_code_display(ce.event_cd),
ceb.event_id
 
from
	 person   p
	, address a
	, order_action   oa
	, clinical_event   ce
	, ce_blob ceb1				;004
	, clinical_event ce2		  ;004
	, ce_blob ceb		  ;004
	, prsnl pr
	, orders o
	, ce_event_note cen		  ;004
	, long_blob lb			  ;004
    , organization_resource org   ;004
	, clinical_event ce3		  ;004
	, ce_blob ceb3		  ;004
 
plan p
where p.person_id = $lstPerson  ;003  $PERSON  ;cnvtreal($PERSON)
  and p.beg_effective_dt_tm <= sysdate
  and p.end_effective_dt_tm >  sysdate
  and p.active_ind = 1
 
join a
where a.parent_entity_id  = p.person_id  ;003  $PERSON  ;cnvtreal($PERSON)
  and a.address_type_cd = HOMECD
  and a.beg_effective_dt_tm <= sysdate
  and a.end_effective_dt_tm >  sysdate
  and a.active_ind = 1
 
join ce
where ce.person_id = p.person_id ;003  $PERSON ;cnvtreal($PERSON)
  ;and expand(num,1,size(lab->lab_qual,5),ce.event_cd, lab->lab_qual[num]->lab_cd)
  and ce.event_cd = (select ve.event_cd from v500_event_set_explode ve
  										where ve.event_set_cd = LABCD and ve.event_cd = ce.event_cd)
  and not ce.clinical_event_id = $results_not_show
;and ce.event_cd in(select event_cd
;                      from v500_event_set_explode
;                      where event_set_cd = (select event_set_cd
;                                            ;from v500_event_set_code
;                                            ;where event_set_name_key = "LABORATORY"))
;003  and ce.event_end_dt_tm >= cnvtdatetime(s_d)
;003  and ce.event_end_dt_tm <= cnvtdatetime(e_d)
;003  and ce.valid_until_dt_tm = cnvtdatetime("31-DEC-2100,00:00:00")
  and ce.event_end_dt_tm >= cnvtdatetime(cnvtdate($sdate),0)				;003
  and ce.event_end_dt_tm <= cnvtdatetime(cnvtdate($edate),235959)		;003
  and ce.valid_until_dt_tm > sysdate																;003
;004   and ce.result_status_cd = AUTH
  and not ce.result_status_cd in (inerror1_cd,inerror2_cd)  ;004
  and ce.view_level = 1
  and ce.publish_flag = 1
  and ce.order_id+0 > 0
 
join oa
where oa.order_provider_id+0 = $providerid ;2876054  ;  ;003  in($PROVIDER)
  and oa.order_id = ce.order_id
  and oa.action_type_cd = ORDERCD
 
join o
where o.order_id = oa.order_id
  and o.order_status_cd = completed_cd			;004
 
join pr
where pr.person_id = oa.order_provider_id
  and pr.active_ind = 1
 
;004 start
join ceb1
where ceb1.event_id = outerjoin(ce.event_id)
  and ceb1.valid_until_dt_tm > outerjoin(sysdate)
 
join ce2
where ce2.parent_event_id = outerjoin(ce.event_id)
  and ce2.event_id != outerjoin(ce.event_id)
  and ce2.valid_until_dt_tm > outerjoin(sysdate)
  and ce2.result_status_cd != outerjoin(inerror1_cd)
  and ce2.result_status_cd != outerjoin(inerror2_cd)
  and ce2.event_tag = outerjoin("Final")
 
join ceb
where ceb.event_id = outerjoin(ce2.event_id)
  and ceb.valid_until_dt_tm > outerjoin(sysdate)
 
join cen
where cen.event_id = outerjoin(ce.event_id)
  and cen.valid_until_dt_tm > outerjoin(sysdate)
 
join lb
where lb.parent_entity_id  = outerjoin(cen.ce_event_note_id)
  and lb.parent_entity_name = outerjoin("CE_EVENT_NOTE")
  and lb.active_ind = outerjoin(1)
 
join org
where org.service_resource_cd = outerjoin(ce.resource_cd)
  and org.active_ind = outerjoin(1)
 
join ce3
where ce3.parent_event_id = outerjoin(ce.event_id)
  and ce3.event_id != outerjoin(ce.event_id)
  and ce3.valid_until_dt_tm > outerjoin(sysdate)
  and ce3.result_status_cd != outerjoin(inerror1_cd)
  and ce3.result_status_cd != outerjoin(inerror2_cd)
 
join ceb3
where ceb3.event_id = outerjoin(ce3.event_id)
  and ceb3.valid_until_dt_tm > outerjoin(sysdate)
;004 end
 
order by
	ce.event_end_dt_tm desc, ce.encntr_id,ce.clinical_event_id ;ce2.event_end_dt_tm desc,ce2.parent_event_id ;oa.order_provider_id
 
head report
 
  tmp->Person_id      = p.person_id
  tmp->pat_name       = substring(1,40,trim(p.name_full_formatted))
  tmp->pat_fname      = trim(p.name_first)
  tmp->pat_lname      = trim(p.name_last)
  tmp->address        = substring(1,50,trim(a.street_addr))
  tmp->city = substring(1,30,trim(a.city))
  If(a.state_cd > 0)
    tmp->state        = uar_get_code_description(a.state_cd)
  else
    tmp->state        = substring(1,30,trim(a.state))
  endif
  tmp->zip_code       = substring(1,20,trim(a.zipcode))
  tmp->b_day          = p.birth_dt_tm
  loc_encntr_id = ce.encntr_id
  res_cnt = 0
  doc_cnt = 0
  pg_num = 1
 ; cnt = 1
  lf = char(10)		;004
  cr = char(13)		;004
 
;004  detail
head ce.clinical_event_id
    res_cnt = res_cnt + 1
   if (mod(res_cnt, 10) = 1)
      stat = alterlist(tmp->result_qual, res_cnt + 9)
   endif
 
   tmp->result_qual[res_cnt]->order_id     = ce.order_id
   ;tmp->result_qual[res_cnt]->order_date    = o.orig_order_dt_tm   ;003
   tmp->result_qual[res_cnt]->performed_date = ce.event_end_dt_tm   ;003
   tmp->result_qual[res_cnt]->doc_name     = pr.name_full_formatted
   tmp->result_qual[res_cnt]->lab_name     = uar_get_code_display(ce.event_cd)
   if (ce.result_val > " ")
     tmp->result_qual[res_cnt]->result_val   = ce.result_val
;004   else
   elseif (ceb.event_id > 0)
     if (ceb.compression_cd = compression_cd)
       TBlobIn = ceb.blob_contents
       call Decompress_text(TBlobIn)
       call rtf_to_text(trim(TBlobOut), 1, 50)
       NoRtftext = replace(NoRtftext,lf," ",0)
       NoRtftext = replace(NoRtftext,cr," ",0)
       tmp->result_qual[res_cnt]->result_val = NoRtftext
     else
       if (findstring("ocf_blob",ceb.blob_contents) = 0)
         tmp->result_qual[res_cnt]->result_val = ceb.blob_contents
       else
         tmp->result_qual[res_cnt]->result_val = substring(1,findstring("ocf_blob",ceb.blob_contents)-1,ceb.blob_contents)
       endif
     endif
   elseif (ceb1.event_id > 0)
     if (ceb1.compression_cd = compression_cd)
       TBlobIn = ceb1.blob_contents
       call Decompress_text(TBlobIn)
       call rtf_to_text(trim(TBlobOut), 1, 50)
       NoRtftext = replace(NoRtftext,lf," ",0)
       NoRtftext = replace(NoRtftext,cr," ",0)
       tmp->result_qual[res_cnt]->result_val = NoRtftext
     else
       if (findstring("ocf_blob",ceb1.blob_contents) = 0)
         tmp->result_qual[res_cnt]->result_val = ceb1.blob_contents
       else
         tmp->result_qual[res_cnt]->result_val = substring(1,findstring("ocf_blob",ceb1.blob_contents)-1,ceb1.blob_contents)
       endif
     endif
   else
     if (ceb3.compression_cd = compression_cd)
       TBlobIn = ceb3.blob_contents
       call Decompress_text(TBlobIn)
       call rtf_to_text(trim(TBlobOut), 1, 50)
       ;NoRtftext = replace(NoRtftext,lf," ",0)
       ;NoRtftext = replace(NoRtftext,cr," ",0)
       tmp->result_qual[res_cnt]->result_val = NoRtftext
     else
       if (findstring("ocf_blob",ceb1.blob_contents) = 0)
         tmp->result_qual[res_cnt]->result_val = ceb3.blob_contents
       else
         tmp->result_qual[res_cnt]->result_val = substring(1,findstring("ocf_blob",ceb3.blob_contents)-1,ceb3.blob_contents)
       endif
     endif
   endif
   tmp->result_qual[res_cnt]->normal_cd    = uar_get_code_description(ce.normalcy_cd)
   tmp->result_qual[res_cnt]->ref_range    = concat(trim(ce.normal_low), " - ", trim(ce.normal_high))
;004 start
   if (cen.compression_cd = compression_cd)
     TBlobIn = lb.long_blob
     call Decompress_text(TBlobIn)
     call rtf_to_text(trim(TBlobOut), 1, 50)
     NoRtftext = replace(NoRtftext,lf," ",0)
     NoRtftext = replace(NoRtftext,cr," ",0)
     tmp->result_qual[res_cnt]->comment = NoRtftext
   else
       if (findstring("ocf_blob",ceb.blob_contents) = 0)
         tmp->result_qual[res_cnt]->comment = lb.long_blob
       else
         tmp->result_qual[res_cnt]->comment = substring(1,findstring("ocf_blob",lb.long_blob)-1,lb.long_blob)
       endif
   endif
   if (findstring("PERFORMED",cnvtupper(tmp->result_qual[res_cnt]->comment)) = 0)
     tmp->result_qual[res_cnt]->comment = " "
   endif
 if (not tmp->result_qual[res_cnt]->comment > " ")
   if (org.org_res_id > 0)
     tmp->result_qual[res_cnt]->comment = org.ref_lab_description
   endif
 endif
;004 end
 
foot report
   pg_num = pg_num +1
   tmp->doc_cnt = doc_cnt
   tmp->result_cnt = res_cnt
 
WITH nocounter  ;,skipreport = 1,format, separator = " "
 call echo(loc_encntr_id)
set  stat = alterlist(tmp->result_qual, tmp->result_cnt)
;***** start 003
;get location header information
select  into "nl:"
from
encounter  e ,
 address  a ,
 phone  p
plan e
where e.encntr_id = loc_encntr_id
 
join a
where a.parent_entity_id = outerjoin(e.loc_facility_cd)
  and a.parent_entity_name = outerjoin("LOCATION")
  and a.address_type_cd = outerjoin(address_cd)
  and a.beg_effective_dt_tm <= outerjoin(sysdate)
  and a.end_effective_dt_tm > outerjoin(sysdate)
  and a.active_ind = outerjoin(1)
 
join p
where p.parent_entity_id = outerjoin(e.loc_facility_cd)
 and p.parent_entity_name= outerjoin("LOCATION")
  and p.phone_type_cd= outerjoin(phone_cd)
  and p.beg_effective_dt_tm <= outerjoin(sysdate)
  and p.end_effective_dt_tm > outerjoin(sysdate)
  and p.active_ind = outerjoin(1)
 
 detail
   tmp->fac_facility	= substring(4,size(uar_get_code_description(e.loc_facility_cd)),uar_get_code_description(e.loc_facility_cd))
   tmp->fac_address1 = a.street_addr
   tmp->fac_city	= a.city
   if (a.state_cd > 0)
     tmp->fac_state = uar_get_code_display(a.state_cd)
   else
     tmp->fac_state = a.state
   endif
   tmp->fac_zip = a.zipcode
   tmp->fac_phone = cnvtphone(p.phone_num, p.phone_format_cd)
 with nocounter
 ;*****end 003
 
call echorecord(tmp)
;set MOD = "000 NT5990 12/02/2008"
 
Execute reportrtl
%i mhs_prg:mayo_mn_pco_result_letter_se.dvl
set _SendTo=$1
 
;;if (cnvtlower(substring(1,10,_SendTo)) = "cer_print/"
;;  and cnvtlower(substring(textlen(_SendTo)-3,4,_SendTo)) != ".dat")
;;  set _SendTo = concat(_SendTo,".dat")
;;endif
;
call LayoutQuery(0)
 
end go
