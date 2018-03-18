/*************************************************************************
 MODS:
 Called by HIT rule
 
 000 10/01/2011    Larry Sonnenschein 	Initial Write
*************************************************************************/
 
;drop program   lcs_add_heparin_allergy2 : dba  go
;create program  lcs_add_heparin_allergy2 : dba
drop program   mc_add_heparin_allergy2 : dba  go
create program  mc_add_heparin_allergy2 : dba
 
;prompt
;	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
;	, "Link_PersonId" = ""
;	, "Link_EncntrId" = ""
;
;with OUTDEV, Link_PersonId, Link_EncntrId
 
record  reply  (
1  status_data
	2  status  =  c1
	2  subeventstatus [1 ]
		3  operationname  =  c8
		3  operationstatus  =  c1
		3  targetobjectname  =  c15
		3  targetobjectvalue  =  c100 )
 
Record Allergy2(
   1 allergy_cnt 						= i4                  ;[Long]
   1 AllQual[*]                       ;[List]
      2 allergy_instance_id   		= f8        ;[Double]
      2 allergy_id            		= f8        ;[Double]
      2 person_id             		=f8        ;[Double]
      2 encntr_id                     = f8        ;[Double]
      2 substance_nom_id              = f8        ;[Double]
      2 substance_ftdesc              = vc     ;[String: Variable]
      2 substance_type_cd             = f8        ;[Double]
      2 reaction_class_cd             = f8        ;[Double]
      2 severity_cd                   = f8        ;[Double]
      2 source_of_info_cd             = f8        ;[Double]
      2 source_of_info_ft             = vc     ;[String: Variable]
      2 onset_dt_tm                   = dq8       ;[Date]
      2 onset_tz                      = i4       ;[Long]
      2 onset_precision_cd            = f8        ;[Double]
      2 onset_precision_flag          = i2         ;[Short]
      2 reaction_status_cd            = f8        ;[Double]
      2 cancel_reason_cd              = f8        ;[Double]
      2 cancel_dt_tm                  = dq8       ;[Date]
      2 cancel_prsnl_id               = f8        ;[Double]
      2 created_prsnl_id              = f8        ;[Double]
      2 reviewed_dt_tm                = dq8       ;[Date]
      2 reviewed_tz                   = fi4       ;[Long]
      2 reviewed_prsnl_id             = f8        ;[Double]
      2 active_ind                    = i2         ;[Short]
      2 active_status_cd              = f8        ;[Double]
      2 active_status_dt_tm           = dq8       ;[Date]
      2 active_status_prsnl_id        = f8        ;[Double]
      2 beg_effective_dt_tm           = dq8       ;[Date]
      2 beg_effective_tz              = fi4       ;[Long]
      2 end_effective_dt_tm           = dq8       ;[Date]
      2 contributor_system_cd         = f8        ;[Double]
      2 data_status_cd                = f8        ;[Double]
      2 data_status_dt_tm             = dq8       ;[Date]
      2 data_status_prsnl_id          = f8        ;[Double]
      2 verified_status_flag          = i2         ;[Short]
      2 rec_src_vocab_cd              = f8        ;[Double]
      2 rec_src_identifer            = vc     ;[String: Variable]
      2 rec_src_string                = vc     ;[String: Variable]
      2 cmb_instance_id               = f8        ;[Double]
      2 cmb_flag                      = i2         ;[Short]
      2 cmb_prsnl_id                  = f8        ;[Double]
      2 cmb_person_id                 = f8        ;[Double]
      2 cmb_dt_tm                     = dq8       ;[Date]
      2 cmb_tz                        = i2         ;[Short]
      2 updt_id                       = f8        ;[Double]
      2 updt_dt_tm                    = dq8       ;[Date]
      2 reaction_status_dt_tm         = dq8       ;[Date]
      2 created_dt_tm                 = dq8       ;[Date]
      2 orig_prsnl_id                 = f8        ;[Double]
      2 reaction_cnt                  = fi4       ;[Long]
      2 reaction [*]                      ;[List]
        3 reaction_id                   = f8        ;[Double]
        3 allergy_instance_id           = f8        ;[Double]
        3 allergy_id                    = f8        ;[Double]
        3 reaction_nom_id               = f8        ;[Double]
        3 reaction_ftdesc               = vc     ;[String: Variable]
        3 active_ind                    = i2         ;[Short]
        3 active_status_cd              = f8        ;[Double]
        3 active_status_dt_tm           = dq8       ;[Date]
        3 active_status_prsnl_id        = f8        ;[Double]
        3 beg_effective_dt_tm           = dq8       ;[Date]
        3 end_effective_dt_tm           = dq8       ;[Date]
        3 contributor_system_cd         = f8        ;[Double]
        3 data_status_cd                = f8        ;[Double]
        3 data_status_dt_tm             = dq8       ;[Date]
        3 data_status_prsnl_id          = f8        ;[Double]
        3 cmb_reaction_id               = f8        ;[Double]
        3 cmb_flag                      = i2         ;[Short]
        3 cmb_prsnl_id                  = f8        ;[Double]
        3 cmb_person_id                 = f8        ;[Double]
        3 cmb_dt_tm                     = dq8       ;[Date]
        3 cmb_tz                        = i2         ;[Short]
        3 updt_id                       = f8        ;[Double]
        3 updt_dt_tm                    = dq8       ;[Date]
        3 allergy_comment_cnt           = fi4       ;[Long]
      	3 allergy_comment [*]               ;[List]
         4 allergy_comment_id            = f8        ;[Double]
         4 allergy_instance_id           = f8        ;[Double]
         4 allergy_id                    = f8        ;[Double]
         4 comment_dt_tm                 = dq8       ;[Date]
         4 comment_tz                    = fi4       ;[Long]
         4 comment_prsnl_id              = f8        ;[Double]
         4 allergy_comment               = vc     ;[String: Variable]
         4 active_ind                    = i2         ;[Short]
         4 active_status_cd              = f8        ;[Double]
         4 active_status_dt_tm           = dq8       ;[Date]
         4 active_status_prsnl_id        = f8        ;[Double]
         4 beg_effective_dt_tm           = dq8       ;[Date]
         4 beg_effective_tz              = fi4       ;[Long]
         4 end_effective_dt_tm           = dq8       ;[Date]
         4 contributor_system_cd         = f8        ;[Double]
         4 data_status_cd                = f8        ;[Double]
         4 data_status_dt_tm             = dq8       ;[Date]
         4 data_status_prsnl_id          = f8        ;[Double]
         4 cmb_comment_id                = f8        ;[Double]
         4 cmb_flag                      = i2         ;[Short]
         4 cmb_prsnl_id                  = f8        ;[Double]
         4 cmb_person_id                 = f8        ;[Double]
         4 cmb_dt_tm                     = dq8       ;[Date]
         4 cmb_tz                        = i2         ;[Short]
         4 updt_id                       = f8        ;[Double]
         4 updt_dt_tm                    = dq8       ;[Date]
   		 4 disable_inactive_person_ens   = i2         ;[Short]
		)
 
declare idx = i4
declare idx2 = i4
declare idx3 = i4
declare idxnka = i2
 
declare heparin_vocab_cd = f8 with public, constant(uar_get_code_by("MEANING",400,'MUL.DRUG'))
 
declare allergy_type_cd = f8 with public, constant(uar_get_code_by("MEANING",12021,'ALLERGY'))
declare allergy_severity_cd = f8 with public, constant(uar_get_code_by("MEANING",12022,'SEVERE'))
declare allergy_sourceofinfo_cd = f8 with public, constant(uar_get_code_by("MEANING",12023,'NOTENTERED'))
declare allergy_onset_precision_cd = f8 with public, constant(uar_get_code_by("MEANING",25320,'NOTENTERED'))
declare drug_allergy_cd = f8 with public, constant(uar_get_code_by("MEANING",12020,'DRUG'))
declare active_allergy_cd = f8 with public, constant(uar_get_code_by("MEANING",48,'ACTIVE'))
declare active_rxn_cd = f8 with public, constant(uar_get_code_by("MEANING",12025,'ACTIVE'))
declare unauth_cd = f8 with public, constant(uar_get_code_by("MEANING",8,'UNAUTH'))
 
;declare link_personid = f8
;declare link_encntrid = f8
;set link_personid = 5351355;5351527.00
;set link_encntrid = 16875855	;16868172.00
;
declare heparin_add = f8
 
declare system_id = f8
select into "nl:"
	p.person_id
 
from prsnl p
plan p
	where p.name_last_key = 'SYSTEM'
	and p.active_ind+0 = 1
 
order by p.person_id
 
head p.person_id
system_id = p.person_id
 
with nocounter
	,format
	,separator = ' '
 
;go to endit
 
select into "nl:"
	n.nomenclature_id
 
from nomenclature n
 
plan n
	where n.source_string = 'heparin'
	and n.source_vocabulary_cd = heparin_vocab_cd
	and n.active_ind+0 = 1
 
order by n.nomenclature_id
 
head n.nomenclature_id
heparin_add = n.nomenclature_id
 
with nocounter
	,format
	,separator = ' '
 
;go to endit
 
;Get sequence for Allergy_id and allergy_instance_id
 
set Allergy->allergy_cnt = 1
set idx = idx+1
 
set stat = alterlist(Allergy2->allqual,idx)
 	select  into "nl:"
	 num = seq ( health_status_seq ,  nextval )"##################;rp0"
 
	from dual
 
	detail
	 Allergy2->allqual[idx]->allergy_instance_id = cnvtreal ( num )
	 Allergy2->allqual[idx]->allergy_id = cnvtreal ( num )
 
	with  format
		 ,counter
 
set Allergy2->allqual[idx].person_id = link_personid
set Allergy2->allqual[idx].encntr_id = link_encntrid
 
set Allergy2->allqual[idx].substance_nom_id = heparin_add        ;substance_nom_id =
set Allergy2->allqual[idx].substance_ftdesc =  ""       ;substance_ftdesc =
set Allergy2->allqual[idx].substance_type_cd = drug_allergy_cd	;1483        ;substance_type_cd =
set Allergy2->allqual[idx].reaction_class_cd = allergy_type_cd	;4039097        ;reaction_class_cd =
set Allergy2->allqual[idx].severity_cd = allergy_severity_cd        ;severity_cd =
set Allergy2->allqual[idx].source_of_info_cd = allergy_sourceofinfo_cd        ;= NotEntered
set Allergy2->allqual[idx].source_of_info_ft = ""      ;source_of_info_ft =
set Allergy2->allqual[idx].updt_dt_tm = cnvtdatetime(curdate,curtime3)        ;onset_dt_tm =
set Allergy2->allqual[idx].onset_precision_cd = allergy_onset_precision_cd        ;=NotEntered
set Allergy2->allqual[idx].onset_precision_flag = 0        ;onset_precision_flag =
set Allergy2->allqual[idx].reaction_status_cd = active_rxn_cd	;1494        ;reaction_status_cd =
set Allergy2->allqual[idx].cancel_reason_cd = 0        ;cancel_reason_cd =
set Allergy2->allqual[idx].cancel_prsnl_id = 0        ;cancel_prsnl_id =
set Allergy2->allqual[idx].created_prsnl_id = reqinfo->updt_id        ;created_prsnl_id =
set Allergy2->allqual[idx].reviewed_dt_tm = cnvtdatetime(curdate,curtime3)        ;reviewed_dt_tm =
set Allergy2->allqual[idx].reviewed_tz = 35        ;reviewed_tz =
set Allergy2->allqual[idx].reviewed_prsnl_id = reqinfo->updt_id	;5353628        ;reviewed_prsnl_id =
set Allergy2->allqual[idx].active_ind = 1        ;active_ind =
set Allergy2->allqual[idx].active_status_cd = active_allergy_cd	;4216        ;active_status_cd =
set Allergy2->allqual[idx].active_status_dt_tm = cnvtdatetime(curdate,curtime3)        ;active_status_dt_tm =
set Allergy2->allqual[idx].active_status_prsnl_id = reqinfo->updt_id        ;active_status_prsnl_id =
set Allergy2->allqual[idx].beg_effective_dt_tm = cnvtdatetime(curdate,curtime3)        ;beg_effective_dt_tm =
set Allergy2->allqual[idx].beg_effective_tz = 0        ;beg_effective_tz =
set Allergy2->allqual[idx].end_effective_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")        ;end_effective_dt_tm =
set Allergy2->allqual[idx].contributor_system_cd = 0        ;contributor_system_cd =
set Allergy2->allqual[idx].data_status_cd = unauth_cd	;663        ;data_status_cd =
set Allergy2->allqual[idx].data_status_dt_tm = cnvtdatetime(curdate,curtime3)        ;data_status_dt_tm =
set Allergy2->allqual[idx].data_status_prsnl_id = reqinfo->updt_id        ;data_status_prsnl_id =
set Allergy2->allqual[idx].verified_status_flag = 0        ;verified_status_flag =
set Allergy2->allqual[idx].rec_src_vocab_cd = 0        ;rec_src_vocab_cd =
set Allergy2->allqual[idx].rec_src_identifer = " "        ;rec_src_identifer =
set Allergy2->allqual[idx].rec_src_string =    ""     ;rec_src_string =
set Allergy2->allqual[idx].cmb_instance_id = 0        ;cmb_instance_id =
set Allergy2->allqual[idx].cmb_flag = 0        ;cmb_flag =
set Allergy2->allqual[idx].cmb_prsnl_id = 0        ;cmb_prsnl_id =
set Allergy2->allqual[idx].cmb_person_id = 0        ;cmb_person_id =
set Allergy2->allqual[idx].cmb_tz = 0        ;cmb_tz = <updt_id = 0        ;updt_id =
set Allergy2->allqual[idx].created_dt_tm = cnvtdatetime(curdate,curtime3)        ;created_dt_tm =
set Allergy2->allqual[idx].orig_prsnl_id = reqinfo->updt_id        ;orig_prsnl_id =
 
call echorecord(allergy2,"HepAllergyRec")
set  x  = 0
set  alg_cnt  = 0
set  reaction_cnt  = 0
set  comment_cnt  = 0
set  code_set  = 0.0
set  code_value  = 0.0
set  cdf_meaning  =  fillstring (12 , " " )
set  cur_reaction_id  = 0.0
set  cur_allergy_comment_id  = 0.0
set  inactive_cd  = 0.0
set  cancel_cd  = 0.0
set  react_id_cnt  = 0
set  comment_id_cnt  = 0
 
set  code_set  = 48
set  cdf_meaning  = "INACTIVE"
 execute cpm_get_cd_for_cdf
set  inactive_cd  =  code_value
 
set  code_set  = 12025
set  cdf_meaning  = "CANCELED"
 execute cpm_get_cd_for_cdf
set  cancel_cd  =  code_value
 
;go to AddAllergy
 
;for(x  = 1  to  allergy -> allergy_cnt)
 
#AddAllergy
 
	insert from allergy  a
	set a.allergy_instance_id= Allergy2->allqual[idx].allergy_instance_id ,
		a.allergy_id = Allergy2->allqual[idx].allergy_id ,
		a.person_id =link_personid,
		a.encntr_id =link_encntrid,
		a.substance_nom_id=Allergy2->allqual[idx].substance_nom_id,
		a.substance_ftdesc=Allergy2->allqual[idx].substance_ftdesc,
		a.substance_type_cd=Allergy2->allqual[idx].substance_type_cd,
		a.reaction_class_cd=Allergy2->allqual[idx].reaction_class_cd,
		a.severity_cd=Allergy2->allqual[idx].severity_cd,
		a.source_of_info_cd=Allergy2->allqual[idx].source_of_info_cd,
		a.source_of_info_ft=Allergy2->allqual[idx].source_of_info_ft,
;		a.onset_id = reqinfo -> updt_id  ;system_id=Allergy2->allqual[idx].onset_dt_tm,
		a.updt_dt_tm = cnvtdatetime(curdate,curtime3),	;Allergy2->allqual[idx].updt_dt_tm,
		a.updt_id = reqinfo -> updt_id,  ;system_id,
;		a.onset_tz=Allergy2->allqual[idx].onset_tz,
		a.onset_precision_cd=Allergy2->allqual[idx].onset_precision_cd,
		a.onset_precision_flag=Allergy2->allqual[idx].onset_precision_flag,
		a.reaction_status_cd=Allergy2->allqual[idx].reaction_status_cd,
		a.cancel_reason_cd=Allergy2->allqual[idx].cancel_reason_cd,
;		a.cancel_dt_tm = Allergy2->allqual[idx].cancel_dt_tm,
		a.cancel_prsnl_id=Allergy2->allqual[idx].cancel_prsnl_id,
		a.created_prsnl_id=Allergy2->allqual[idx].created_prsnl_id,
		a.reviewed_dt_tm = cnvtdatetime(curdate,curtime3),
		a.reviewed_tz=Allergy2->allqual[idx].reviewed_tz,
		a.reviewed_prsnl_id=Allergy2->allqual[idx].reviewed_prsnl_id,
		a.active_ind=Allergy2->allqual[idx].active_ind,
		a.active_status_cd=Allergy2->allqual[idx].active_status_cd,
		a.active_status_dt_tm = cnvtdatetime(curdate,curtime3),
		a.active_status_prsnl_id= reqinfo -> updt_id,  ;system_id,
		a.beg_effective_dt_tm = cnvtdatetime(curdate,curtime3),
		a.beg_effective_tz=Allergy2->allqual[idx].beg_effective_tz,
;		a.end_effective_dt_tm=Allergy2->allqual[idx].end_effective_dt_tm,
		a.contributor_system_cd=Allergy2->allqual[idx].contributor_system_cd,
		a.data_status_cd=Allergy2->allqual[idx].data_status_cd,
		a.data_status_dt_tm = cnvtdatetime(curdate,curtime3),
		a.data_status_prsnl_id=reqinfo -> updt_id,  ;system_id,
		a.verified_status_flag=Allergy2->allqual[idx].verified_status_flag,
		a.rec_src_vocab_cd=Allergy2->allqual[idx].rec_src_vocab_cd,
		a.rec_src_identifer=Allergy2->allqual[idx].rec_src_identifer,
		a.rec_src_string=Allergy2->allqual[idx].rec_src_string,
		a.cmb_instance_id=Allergy2->allqual[idx].cmb_instance_id,
		a.cmb_flag=Allergy2->allqual[idx].cmb_flag,
		a.cmb_prsnl_id=Allergy2->allqual[idx].cmb_prsnl_id,
		a.cmb_person_id=Allergy2->allqual[idx].cmb_person_id,
;		a.cmb_dt_tm=Allergy2->allqual[idx].cmb_dt_tm,
		a.cmb_tz=Allergy2->allqual[idx].cmb_tz,
;		a.reaction_status_dt_tm=Allergy2->allqual[idx].reaction_status_dt_tm,
		a.created_dt_tm = cnvtdatetime(curdate,curtime3),
		a.orig_prsnl_id=Allergy2->allqual[idx].orig_prsnl_id,
		a.created_prsnl_id = reqinfo -> updt_id  ;system_id
	 with  nocounter
 
;call echorecord(allergy)
call echo("End Insert")
go to endit
 
	if(curqual =0)
		set  reply -> status_data -> status  = "F"
		go to  exit_script
	endif
 
;go to endit
;
;	if(Allergy2->allqual[idx].reaction_cnt >0 )
;		update from reaction  r
;				   ,(dummyt  d3  with  seq = value ( Allergy2->allqual[idx].reaction_cnt ))
;		set r.active_ind= false ,
;			r.active_status_cd= inactive_cd ,
;			r.active_status_prsnl_id= reqinfo -> updt_id ,
;			r.active_status_dt_tm= cnvtdatetime(curdate,curtime3),
;			r.end_effective_dt_tm= cnvtdatetime(curdate,curtime3),
;			r.updt_cnt=(r.updt_cnt+1 ),
;			r.updt_dt_tm= cnvtdatetime (curdate,curtime3),
;			r.updt_id= reqinfo -> updt_id ,
;			r.updt_applctx= reqinfo -> updt_applctx ,
;			r.updt_task= reqinfo -> updt_task
;
;		plan d3
;
;		join r
;			where r.reaction_id= Allergy2->allqual[idx].reaction [d3.seq]-> reaction_id
;
;		with  nocounter
;
;		if (curqual != Allergy2->allqual[idx].reaction_cnt)
;			set  reply -> status_data -> status  = "F"
;			go to  exit_script
;		endif
;
;		for (react_id_cnt = 1 to Allergy2->allqual[idx].reaction_cnt)
;			select  into "nl:"
;			 num = seq ( health_status_seq ,  nextval )"##################;rp0"
;
;			from ( dual )
;
;			detail
;			 Allergy2->allqual[idx].reaction [ react_id_cnt ]-> reaction_id = cnvtreal (num)
;
;			with  format
;				 ,counter
;		endfor
;
;		insert from reaction r
;				   ,( dummyt  d4  with  seq = value ( Allergy2->allqual[idx].reaction_cnt ))
;		set r.reaction_id= Allergy2->allqual[idx].reaction [d4.seq]-> reaction_id ,
;			r.allergy_instance_id= Allergy2->allqual[idx].allergy_instance_id ,
;			r.allergy_id= Allergy2->allqual[idx].allergy_id ,
;			r.reaction_nom_id= Allergy2->allqual[idx].reaction [d4.seq]-> reaction_nom_id ,
;			r.reaction_ftdesc= Allergy2->allqual[idx].reaction [d4.seq]-> reaction_ftdesc ,
;			r.contributor_system_cd= Allergy2->allqual[idx].reaction [d4.seq]-> contributor_system_cd ,
;			r.data_status_cd= Allergy2->allqual[idx].reaction [d4.seq]-> data_status_cd ,
;			r.data_status_dt_tm= cnvtdatetime ( Allergy2->allqual[idx].reaction [d4.seq]->data_status_dt_tm ),
;			r.data_status_prsnl_id= Allergy2->allqual[idx].reaction [d4.seq]-> data_status_prsnl_id ,
;			r.beg_effective_dt_tm= cnvtdatetime ( Allergy2->allqual[idx].reaction [d4.seq]->beg_effective_dt_tm ),
;			r.end_effective_dt_tm= cnvtdatetime ( Allergy2->allqual[idx].reaction [d4.seq]->end_effective_dt_tm ),
;			r.active_ind= Allergy2->allqual[idx].reaction [d4.seq]-> active_ind ,
;			r.active_status_cd= Allergy2->allqual[idx].reaction [d4.seq]-> active_status_cd ,
;			r.active_status_prsnl_id= Allergy2->allqual[idx].reaction [d4.seq]-> active_status_prsnl_id ,
;			r.active_status_dt_tm= cnvtdatetime ( Allergy2->allqual[idx].reaction [d4.seq]->active_status_dt_tm ),
;			r.updt_cnt=0 ,
;			r.updt_dt_tm= cnvtdatetime ( curdate ,  curtime3 ),
;			r.updt_id= reqinfo -> updt_id ,
;			r.updt_applctx= reqinfo -> updt_applctx ,
;			r.updt_task= reqinfo -> updt_task
;
;		plan d4
;
;		join r
;
;		with  nocounter
;
;		if(curqual != Allergy2->allqual[idx].reaction_cnt)
;			set  reply -> status_data -> status  = "F"
;			go to  exit_script
;		endif
;	endif
;
;	if(Allergy2->allqual[idx].allergy_comment_cnt >0)
;	update from allergy_comment  ac
;			   ,( dummyt  d5  with  seq = value ( Allergy2->allqual[idx].allergy_comment_cnt ))
;	set ac.active_ind= false ,
;		ac.active_status_cd= inactive_cd ,
;		ac.active_status_prsnl_id= reqinfo -> updt_id ,
;		ac.active_status_dt_tm= cnvtdatetime ( curdate ,  curtime3 ),
;		ac.end_effective_dt_tm= cnvtdatetime ( curdate ,  curtime3 ),
;		ac.updt_cnt=(ac.updt_cnt+1 ),
;		ac.updt_dt_tm= cnvtdatetime ( curdate ,  curtime3 ),
;		ac.updt_id= reqinfo -> updt_id ,
;		ac.updt_applctx= reqinfo -> updt_applctx ,
;		ac.updt_task= reqinfo -> updt_task
;
;	plan d5
;
;	join ac
;		where ac.allergy_comment_id= Allergy2->allqual[idx].allergy_comment [d5.seq]->allergy_comment_id
;
;	with  nocounter
;
;	if(curqual != Allergy2->allqual[idx].allergy_comment_cnt)
;		set  reply -> status_data -> status  = "F"
;		go to  exit_script
;	endif
;
;	for(comment_id_cnt  = 1  to  Allergy2->allqual[idx].allergy_comment_cnt)
;
;		select  into "nl:"
;		 num = seq ( health_status_seq ,  nextval )"##################;rp0"
;
;		from dual
;
;		detail
;		 Allergy2->allqual[idx].allergy_comment[comment_id_cnt]->allergy_comment_id=cnvtreal(num)
;
;		with fomat
;			,counter
;
;	endfor
 
;go to endit
 
	insert from allergy_comment ac
			   ,(dummyt  d6  with  seq = value ( Allergy2->allqual[idx].allergy_comment_cnt ))
 
	set ac.allergy_comment_id= Allergy2->allqual[idx].allergy_comment [d6.seq]-> allergy_comment_id ,
		ac.allergy_instance_id= Allergy2->allqual[idx].allergy_instance_id ,
		ac.allergy_id= Allergy2->allqual[idx].allergy_id ,
		ac.comment_dt_tm= cnvtdatetime ( Allergy2->allqual[idx].allergy_comment [d6.seq]-> comment_dt_tm ),
		ac.comment_prsnl_id= Allergy2->allqual[idx].allergy_comment [d6.seq]-> comment_prsnl_id ,
		ac.allergy_comment= Allergy2->allqual[idx].allergy_comment [d6.seq]-> allergy_comment ,
		ac.contributor_system_cd= Allergy2->allqual[idx].allergy_comment [d6.seq]-> contributor_system_cd ,
		ac.data_status_cd= Allergy2->allqual[idx].allergy_comment [d6.seq]-> data_status_cd ,
		ac.data_status_dt_tm= cnvtdatetime ( Allergy2->allqual[idx].allergy_comment [d6.seq]-> data_status_dt_tm ),
		ac.data_status_prsnl_id= Allergy2->allqual[idx].allergy_comment [d6.seq]-> data_status_prsnl_id ,
		ac.beg_effective_dt_tm= cnvtdatetime ( Allergy2->allqual[idx].allergy_comment [d6.seq]-> beg_effective_dt_tm ),
		ac.end_effective_dt_tm= cnvtdatetime ( Allergy2->allqual[idx].allergy_comment [d6.seq]-> end_effective_dt_tm ),
		ac.active_ind= Allergy2->allqual[idx].allergy_comment [d6.seq]-> active_ind ,
		ac.active_status_cd= Allergy2->allqual[idx].allergy_comment [d6.seq]-> active_status_cd ,
		ac.active_status_prsnl_id= Allergy2->allqual[idx].allergy_comment [d6.seq]-> active_status_prsnl_id ,
		ac.active_status_dt_tm= cnvtdatetime ( Allergy2->allqual[idx].allergy_comment [d6.seq]-> active_status_dt_tm ),
		ac.updt_cnt=0 ,
		ac.updt_dt_tm= cnvtdatetime ( curdate ,  curtime3 ),
		ac.updt_id= reqinfo -> updt_id ,
		ac.updt_applctx= reqinfo -> updt_applctx ,
		ac.updt_task= reqinfo -> updt_task
 
	plan d6
 
	join ac
 
	with  nocounter
 
call echorecord(allergy2)
go to endit
 
	if(curqual != Allergy2->allqual[idx].allergy_comment_cnt)
		set  reply -> status_data -> status  = "F"
		go to  exit_script
	endif
 
;	endif
 
;endfor	;lcs
 
# exit_script
;
;if ( ( reply -> status_data -> status ="f" ) )
;set  reply -> status_data -> subeventstatus [1 ]-> operationname  = "upd allergy"
;set  reply -> status_data -> subeventstatus [1 ]-> operationstatus  = "f"
;set  reply -> status_data -> subeventstatus [1 ]-> targetobjectname  = "allergy"
;set  reply -> status_data -> subeventstatus [1 ]-> targetobjectvalue  = "allergy"
;set  reqinfo -> commit_ind  = 0
;else
;set  reqinfo -> commit_ind  = 1
;endif
 
#endit
 
call echorecord(allergy2)
 
end
GO
