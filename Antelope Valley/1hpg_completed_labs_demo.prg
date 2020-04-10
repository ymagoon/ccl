drop program 1hpg_completed_labs_demo go
create program 1hpg_completed_labs_demo
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Begin Date" = "CURDATE"
	, "End Date" = "CURDATE"
 
with OUTDEV, begd, endd
 
 
/****************************************************************************************
;
*****************************************************************************************/
free record lblist
record lblist
	(
	1 lbcnt				= I4
	1 qual[*]
	  2 encntrid		= F8
	  2 personid		= F8
	  2 lname			= VC
	  2 mname			= vc
	  2 fname			= vc
	  2 gender			= vc
	  2 patient_type	= vc
	  2 ssn				= vc
	  2 mrn				= vc
	  2 fin				= vc
	  2 dob				= vc
	  2 marital_status	= vc
	  2 admit_date		= vc
	  2 disch_adate		= vc
	  2 adm_phys		= vc
	  2 adm_phys_npi	= vc
	  2 ref_phys_npi	= vc
	  2 ref_physician	= vc
	  2 pat_addres		= vc
	  2 pat_address2	= vc
	  2 pat_city		= vc
	  2 pat_st			= vc
	  2 pat_zipcode		= vc
	  2 pat_phone		= vc
	  2 employer_name	= vc
	  2 employer_address	= vc
	  2 employer_address2	= vc
	  2 employer_city		= vc
	  2 employer_st			= vc
	  2 employer_zipcode	= vc
	  2 employer_phone		= vc
	  2 occupation			= vc
	  2	dx1					= vc
	  2 dx2					= vc
	  2 ordcnt				= I4
	  2 ordlist[*]
	  	3 orderid			= F8
	  	3 accessionbr		= vc
	  	3 ord_phys			= vc
	  	3 ord_phys_npi		= vc
	  	3 veryf_phys		= vc
	  	3 veryf_phys_npi	= vc
	  	3 ord_name			= vc
	  	3 bcnt				= I4
	  	3 blist[*]
	  	  4 bill_code		= vc
	  	  4 service_dttm	= vc
	  2 g_lname			= vc
	  2 g_fname			= vc
	  2 g_mname			= vc
	  2 g_dob			= vc
	  2 g_ssn			= vc
	  2 g_address1		= vc
	  2 g_address2		= vc
	  2 g_city			= vc
	  2 g_st			= vc
	  2 g_zip			= vc
	  2 g_dob			= vc
	  2 g_phone			= vc
	  2 g_personid		= F8
	  2 g_occupation	= vc
	  2 g_employer_name	= vc
	  2 g_employer_address	= vc
	  2 g_employer_city		= vc
	  2 g_employer_st		= vc
	  2 g_employer_zip		= vc
	  2 g_employer_phone	= vc
	  2 relation			= vc
	  2 ins1_orgid			= F8
	  2 ins1_hplanid		= F8
	  2 ins1_code			= vc
	  2 ins1_name			= vc
	  2 ins1_grpnbr			= vc
	  2 ins1_idpolicy		= vc
	  2 ins1_plan			= vc
	  2 ins1_subslname		= vc
	  2 ins1_subsfname		= vc
	  2 ins1_subsmname		= vc
	  2 ins1_subsrel		= vc
	  2 ins1_addr1			= vc
	  2 ins1_addr2			= vc
	  2 ins1_city			= vc
	  2 ins1_st				= vc
	  2 ins1_zip			= vc
	  2 ins1_phone			= vc
	  2 ins1_authnbr		= vc
	  2 ins2_code			= vc
	  2 ins2_name			= vc
	  2 ins2_grpnbr			= vc
	  2 ins2_idpolicy		= vc
	  2 ins2_plan			= vc
	  2 ins2_subslname		= vc
	  2 ins2_subsfname		= vc
	  2 ins2_subsmname		= vc
	  2 ins2_subsrel		= vc
	  2 ins2_addr1			= vc
	  2 ins2_addr2			= vc
	  2 ins2_city			= vc
	  2 ins2_st				= vc
	  2 ins2_zip			= vc
	  2 ins2_phone			= vc
	  2 ins2_authnbr		= vc
	  )
 
/****************************************************************************************
; Substitution Values
*****************************************************************************************/
declare output_dest = vc
if($BEGD = "OPS")
  set beg_dt_tm = cnvtdatetime(curdate-1,0)
  set end_dt_tm = cnvtdatetime(curdate-1,235959)
  set output_dest = build("/nfs/middle_fs/custom_warehouses/p604/proc/orion_rand/1_avh_orion_demo_",
                          format(beg_dt_tm, "yyyymmdd;;d"),".txt")
elseif($BEGD = "MONTH")
  set beg_dt_tm = datetimefind(cnvtlookbehind("28,D"),"M","B","B")
  set end_dt_tm = datetimefind(cnvtlookbehind("28,D"),"M","E","E")
  set output_dest = build("/nfs/middle_fs/custom_warehouses/p604/proc/orion_rand/1_avh_orion_demo_month_",
                          format(beg_dt_tm, "yyyymm;;d"),".txt")
elseif($OUTDEV = "BACKLOAD")
  set beg_dt_tm = cnvtdatetime("01-JAN-2019 00:00:00")
  set end_dt_tm = cnvtdatetime("01-JUN-2019 00:00:00")
  set output_dest = build("/nfs/middle_fs/custom_warehouses/p604/proc/orion_rand/1_avh_orion_demo_back_",
                          format(beg_dt_tm, "yyyy;;d"),".txt")
else
  set beg_dt_tm = cnvtdatetime(cnvtdate2(trim($BEGD, 3), "DD-MMM-YYYY"), 000000)
  set end_dt_tm = cnvtdatetime(cnvtdate2(trim($ENDD, 3), "DD-MMM-YYYY"), 235959)
  set output_dest = $OUTDEV
endif
 
/****************************************************************************************
; Declared Variables
*****************************************************************************************/
declare lbcnt          								= i4 with public, noconstant(0)
declare ordcnt          							= i4 with public, noconstant(0)
declare icnt          								= i4 with public, noconstant(0)
declare acnt          								= i4 with public, noconstant(0)
declare dcnt          								= i4 with public, noconstant(0)
set client_encntr_type_cd = uar_get_code_by("DISPLAYKEY",71,"CLIENT") ;002
 
/****************************************************************************************
; Get Labs / Demographic Information
*****************************************************************************************/
SELECT INTO "NL:"
	E.ENCNTR_ID
	, P.PERSON_ID
	, PA.ALIAS
	, PAE.ALIAS
	, EA.ALIAS
 
FROM
	order_action oa
	, orders	o
	, accession_order_r a
	, prsnl_alias onpi
	, ENCOUNTER   E
	, PERSON   P
	, PERSON_ALIAS   PA
	, PERSON_ALIAS   PAE
	, ENCNTR_ALIAS   EA
	, encntr_prsnl_reltn	eprl
	, prsnl ppra
	, prsnl_alias npi
	, encntr_prsnl_reltn	epr
	, prsnl pepr
	, prsnl_alias rnpi
	, prsnl	op
	, prsnl vp
	, prsnl_alias vnpi
 
PLAN e  where e.disch_dt_tm between CNVTDATETIME(beg_dt_tm)
                                and CNVTDATETIME(end_dt_tm)
          and e.active_ind = 1
          and e.encntr_type_cd != client_encntr_type_cd ;002
 
;LAB ORDERS
JOIN o WHERE o.encntr_id = e.encntr_id
         and o.encntr_id != 0
         and o.person_id != 0
         and o.catalog_type_cd = 2513 ; LABORATORY
;ORDER ACTION
JOIN oa where oa.order_id = o.order_id
          and oa.action_type_cd = 2529 ; COMPLETE; Pathology = Result Verified
 
;ACCESSION
join a where o.order_id = a.order_id
 
 
JOIN P WHERE O.PERSON_ID = P.PERSON_ID
         AND P.active_ind = 1
;SSN
JOIN PA WHERE PA.PERSON_ID = outerjoin(O.PERSON_ID)
          and PA.PERSON_ALIAS_TYPE_CD = outerjoin(10)
          and PA.END_EFFECTIVE_DT_TM > outerjoin(CNVTDATETIME(CURDATE, curtime3))
          and PA.ACTIVE_IND = outerjoin(1)
;MRN
JOIN pae WHERE PAE.PERSON_ID = outerjoin(O.PERSON_ID)
           and PAE.PERSON_ALIAS_TYPE_CD = outerjoin(18)
           and PAE.END_EFFECTIVE_DT_TM > outerjoin(CNVTDATETIME(CURDATE, curtime3))
           and PAE.ACTIVE_IND = outerjoin(1)
;FIN
JOIN ea WHERE EA.ENCNTR_ID = outerjoin(O.ENCNTR_ID)
          and EA.ENCNTR_ALIAS_TYPE_CD = outerjoin(1077)
          and EA.END_EFFECTIVE_DT_TM > outerjoin(CNVTDATETIME(CURDATE, curtime3))
          and EA.ACTIVE_IND = outerjoin(1)
;ADMITTING(RELATION)
join eprl where EPRL.ENCNTR_ID = outerjoin(O.ENCNTR_ID)
            and eprl.encntr_prsnl_r_cd = outerjoin(1116.00)
            and eprl.active_ind = outerjoin(1)
            and eprl.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
;ADMITTING(NAME)
join ppra where outerjoin(eprl.prsnl_person_id) = ppra.person_id
 
;ADMITTING(NPI)
join npi where outerjoin(eprl.prsnl_person_id) = npi.person_id
           and npi.prsnl_alias_type_cd = outerjoin(4038127.00)
           and npi.active_ind = outerjoin(1)
           and npi.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
;REFERRING(RELATION)
join epr where outerjoin(o.encntr_id) = epr.encntr_id
           and epr.encntr_prsnl_r_cd = outerjoin(1126.00)
           and epr.active_ind = outerjoin(1)
           and epr.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
;REFERRING(NAME)
join pepr where outerjoin(epr.prsnl_person_id) = pepr.person_id
 
;REFERRING(NPI)
join rnpi where outerjoin(epr.prsnl_person_id) = rnpi.person_id
            and rnpi.prsnl_alias_type_cd = outerjoin(4038127.00)
            and rnpi.active_ind = outerjoin(1)
            and rnpi.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
;ORDERING PROVIDER (NAME)
join op where oa.order_provider_id = op.person_id
 
;ORDERING PROVIDER (NPI)
join onpi where outerjoin(oa.order_provider_id) = onpi.person_id
            and onpi.prsnl_alias_type_cd = outerjoin(4038127.00)
            and onpi.active_ind = outerjoin(1)
            and onpi.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
;VERIFYING PROVIDER (NAME)  - PATHOLOGY
join vp where oa.action_personnel_id = vp.person_id
 
;VERIFYING PROVIDER (NPI)   - PATHOLOGY
join vnpi where outerjoin(oa.action_personnel_id) = vnpi.person_id
            and vnpi.prsnl_alias_type_cd = outerjoin(4038127.00)
            and vnpi.active_ind = outerjoin(1)
            and vnpi.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
ORDER BY
	O.ENCNTR_ID
	, o.order_id
 
head report
lbcnt = 0
stat = alterlist(lblist->qual, 100)
 
head o.encntr_id
lbcnt = lbcnt+ 1
if (mod(lbcnt, 100) = 1)
 stat = alterlist(lblist->qual, lbcnt+ 99)
endif
 
		lblist->qual[lbcnt].encntrid			= o.encntr_id
 		lblist->qual[lbcnt].personid			= o.person_id
 		lblist->qual[lbcnt].admit_date		= format(e.reg_dt_tm, "MM/DD/YYYY;;D")
 		lblist->qual[lbcnt].disch_adate		= format(e.disch_dt_tm, "MM/DD/YYYY;;D")
 		lblist->qual[lbcnt].dob				= format(p.birth_dt_tm, "MM/DD/YYYY;;D")
 		lblist->qual[lbcnt].fin				= trim(ea.alias)
 		lblist->qual[lbcnt].fname			= trim(p.name_first)
 		lblist->qual[lbcnt].mname			= trim(p.name_middle)
 		lblist->qual[lbcnt].lname			= trim(p.name_last)
 		lblist->qual[lbcnt].gender			= trim(uar_get_code_display(p.sex_cd))
 		lblist->qual[lbcnt].mrn				= trim(pa.alias)
 		lblist->qual[lbcnt].patient_type	= substring(1, 1, trim(uar_get_code_display(e.encntr_type_cd)))
 		lblist->qual[lbcnt].ssn				= trim(pae.alias)
 		lblist->qual[lbcnt].adm_phys_npi	= trim(cnvtalias(npi.alias, npi.alias_pool_cd), 3)
 		lblist->qual[lbcnt].adm_phys		= trim(ppra.name_full_formatted)
 		lblist->qual[lbcnt].ref_phys_npi	= trim(cnvtalias(rnpi.alias, rnpi.alias_pool_cd), 3)
 		lblist->qual[lbcnt].ref_physician	= trim(pepr.name_full_formatted)
 
ordcnt = 0
stat = alterlist(lblist->qual[lbcnt].ordlist, 10)
 
head o.order_id
ordcnt = ordcnt + 1
if (mod(ordcnt, 10) = 1)
 stat = alterlist(lblist->qual[lbcnt].ordlist, ordcnt + 9)
endif
 
	lblist->qual[lbcnt].ordlist[ordcnt].orderid 		= o.order_id
	lblist->qual[lbcnt].ordlist[ordcnt].ord_name		= trim(uar_get_code_display(o.catalog_cd))
 	lblist->qual[lbcnt].ordlist[ordcnt].ord_phys_npi	= cnvtalias(onpi.alias, onpi.alias_pool_cd)
	lblist->qual[lbcnt].ordlist[ordcnt].ord_phys 		= trim(op.name_full_formatted)
	lblist->qual[lbcnt].ordlist[ordcnt].accessionbr		= trim(a.accession)
 
	if (o.activity_type_cd = 671.00)
	lblist->qual[lbcnt].ordlist[ordcnt].veryf_phys		= trim(vp.name_full_formatted)
	lblist->qual[lbcnt].ordlist[ordcnt].veryf_phys_npi	= cnvtalias(vnpi.alias, vnpi.alias_pool_cd)
	endif
 
 
foot o.order_id
 row + 0
 
 
foot o.encntr_id
lblist->qual[lbcnt].ordcnt = ordcnt
stat = alterlist(lblist->qual[lbcnt].ordlist, ordcnt)
 
 
foot report
lblist->lbcnt = lbcnt
stat = alterlist(lblist->qual, lbcnt)
 
WITH nocounter
/****************************************************************************************
;
*****************************************************************************************/
/****************************************************************************************
; Address and Phone
*****************************************************************************************/
 
SELECT INTO "NL:"
	QUAL_ENCNTRID = LBLIST->qual[D1.SEQ].encntrid
	, QUAL_PERSONID = LBLIST->qual[D1.SEQ].personid
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(LBLIST->qual, 5)))
	, address a
	, phone p
 
PLAN D1 where LBLIST->qual[D1.SEQ].personid != 0.00
 
join a where outerjoin(LBLIST->qual[D1.SEQ].personid) = a.parent_entity_id
and a.parent_entity_name = "PERSON"
and a.active_ind = outerjoin(1)
and a.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join p where outerjoin(LBLIST->qual[D1.SEQ].personid) = p.parent_entity_id
and outerjoin(p.parent_entity_name) = "PERSON"
and  p.active_ind = outerjoin(1)
and p.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
order by d1.seq, p.parent_entity_id
 
head d1.seq
NULL
 
head p.parent_entity_id
	lblist->qual[D1.SEQ].pat_addres	= trim(a.street_addr)
	lblist->qual[D1.SEQ].pat_address2	= trim(a.street_addr2)
	lblist->qual[D1.SEQ].pat_city	= trim(a.city)
	lblist->qual[D1.SEQ].pat_st		= substring(1, 2, trim(UAR_GET_CODE_DISPLAY(a.state_cd), 3))
 
	if(textlen(trim(a.zipcode))>0)
		if(textlen(trim(a.zipcode)) = 5)
			lblist->qual[D1.SEQ].pat_zipcode = format(trim(a.zipcode), "#####")
		elseif(textlen(trim(a.zipcode)) > 5)
			lblist->qual[D1.SEQ].pat_zipcode = format(trim(a.zipcode), "#####-####")
		endif
	elseif (textlen(trim(a.zipcode))= 0)
		lblist->qual[D1.SEQ].pat_zipcode	= ""
	endif
 
	lblist->qual[D1.SEQ].pat_phone		= trim(p.phone_num)
 
WITH NOCOUNTER
/****************************************************************************************
; Employer Data
*****************************************************************************************/
 
SELECT INTO "NL:"
	QUAL_PERSONID = LBLIST->qual[D1.SEQ].personid
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(LBLIST->qual, 5)))
	, person_org_reltn p
	, organization o
	, address adr
	, phone oph
 
PLAN D1 where LBLIST->qual[D1.SEQ].personid != 0.00
 
join p where outerjoin(LBLIST->qual[D1.SEQ].personid) = p.person_id
and p.person_org_reltn_cd = outerjoin(1136.00)
and p.active_ind = outerjoin(1)
and p.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join o where outerjoin(p.organization_id) = o.organization_id
 
join adr where outerjoin(o.organization_id) = adr.parent_entity_id
and adr.parent_entity_name = outerjoin("ORGANIZATION")
and adr.active_ind = outerjoin(1)
and adr.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join oph where outerjoin(o.organization_id) = oph.parent_entity_id
and oph.parent_entity_name = outerjoin("ORGANIZATION")
and oph.active_ind = outerjoin(1)
and oph.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
order by d1.seq, p.person_id
 
head d1.seq
NULL
 
head p.person_id
	lblist->qual[D1.SEQ].employer_name = trim(p.ft_org_name)
	lblist->qual[D1.SEQ].occupation		= trim(p.empl_occupation_text)
 
	lblist->qual[D1.SEQ].employer_address = trim(adr.street_addr)
	lblist->qual[D1.SEQ].employer_address2		= trim(adr.street_addr2)
	lblist->qual[D1.SEQ].employer_city		= trim(adr.city)
	lblist->qual[D1.SEQ].employer_st = substring(1, 2, trim(UAR_GET_CODE_DISPLAY(adr.state_cd), 3))
 
	if(textlen(trim(adr.zipcode))>0)
		if(textlen(trim(adr.zipcode)) = 5)
			lblist->qual[D1.SEQ].employer_zipcode = format(trim(adr.zipcode), "#####")
		elseif(textlen(trim(adr.zipcode)) > 5)
			lblist->qual[D1.SEQ].employer_zipcode = format(trim(adr.zipcode), "#####-####")
		endif
	elseif (textlen(trim(adr.zipcode))= 0)
		lblist->qual[D1.SEQ].employer_zipcode	= ""
	endif
 
	lblist->qual[D1.SEQ].employer_phone = trim(oph.phone_num)
 
WITH NOCOUNTER
 
 
/****************************************************************************************
; Guarantor Info
*****************************************************************************************/
SELECT into "NL:"
	ENCNTRID = lblist->qual[D1.SEQ].encntrid
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(lblist->qual, 5)))
	, encntr_person_reltn e
	, person p
	, person_alias pa
	, address a
	, phone ph
	, person_org_reltn po
	, organization o
	, address adr
	, phone oph
 
PLAN D1 where lblist->qual[D1.SEQ].encntrid != 0
 
join e where e.encntr_id = lblist->qual[D1.SEQ].encntrid
and e.person_reltn_type_cd = 1150.00
and e.active_ind = 1
and e.end_effective_dt_tm > CNVTDATETIME(CURDATE, curtime3)
 
join p where e.related_person_id = p.person_id
 
join pa where outerjoin(p.person_id) = pa.person_id
and pa.person_alias_type_cd = outerjoin(18)
and pa.active_ind = outerjoin(1)
and pa.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join a where outerjoin(e.related_person_id) = a.parent_entity_id
and a.parent_entity_name = outerjoin("PERSON")
and a.address_type_cd = outerjoin(756.00)
and a.active_ind = outerjoin(1)
and a.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join ph where outerjoin(e.related_person_id) = ph.parent_entity_id
and ph.parent_entity_name = outerjoin("PERSON")
and ph.phone_type_cd = outerjoin(170.00)
and ph.active_ind = outerjoin(1)
and ph.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join po where outerjoin(e.related_person_id) = po.person_id
and po.person_org_reltn_cd = outerjoin(1136.00)
and po.active_ind = outerjoin(1)
and po.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join o where outerjoin(po.organization_id) = o.organization_id
 
join adr where outerjoin(o.organization_id) = adr.parent_entity_id
and adr.parent_entity_name = outerjoin("ORGANIZATION")
and adr.active_ind = outerjoin(1)
and adr.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join oph where outerjoin(o.organization_id) = oph.parent_entity_id
and oph.parent_entity_name = outerjoin("ORGANIZATION")
and oph.active_ind = outerjoin(1)
and oph.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
 
order by d1.seq, e.encntr_id
 
head d1.seq
NULL
 
head e.encntr_id
	lblist->qual[D1.SEQ].g_fname = trim(p.name_first)
	lblist->qual[D1.SEQ].g_lname	= trim(p.name_last)
	lblist->qual[D1.SEQ].g_mname	= trim(p.name_middle)
	lblist->qual[D1.SEQ].g_dob	= format(p.birth_dt_tm, "MM/DD/YYYY;;D")
	lblist->qual[D1.SEQ].g_personid	= e.related_person_id
	lblist->qual[D1.SEQ].relation = trim(uar_get_code_display(e.related_person_reltn_cd))
	lblist->qual[D1.SEQ].g_ssn	= trim(pa.alias)
	lblist->qual[D1.SEQ].g_address1	= trim(a.street_addr)
	lblist->qual[D1.SEQ].g_address2	= trim(a.street_addr2)
	lblist->qual[D1.SEQ].g_city		= trim(a.city)
	lblist->qual[D1.SEQ].g_st		= substring(1, 2, trim(UAR_GET_CODE_DISPLAY(a.state_cd), 3))
 
	if(textlen(trim(a.zipcode))>0)
		if(textlen(trim(a.zipcode)) = 5)
			lblist->qual[D1.SEQ].g_zip = format(trim(a.zipcode), "#####")
		elseif(textlen(trim(a.zipcode)) > 5)
			lblist->qual[D1.SEQ].g_zip = format(trim(a.zipcode), "#####-####")
		endif
	elseif (textlen(trim(a.zipcode))= 0)
		lblist->qual[D1.SEQ].g_zip	= ""
	endif
 
	lblist->qual[D1.SEQ].g_phone		= trim(ph.phone_num)
	lblist->qual[D1.SEQ].g_employer_address = trim(adr.street_addr)
	lblist->qual[D1.SEQ].g_employer_city		= trim(adr.city)
	lblist->qual[D1.SEQ].g_employer_name		= trim(o.org_name)
	lblist->qual[D1.SEQ].g_employer_st = substring(1, 2, trim(UAR_GET_CODE_DISPLAY(adr.state_cd), 3))
 
	if(textlen(trim(adr.zipcode))>0)
		if(textlen(trim(adr.zipcode)) = 5)
			lblist->qual[D1.SEQ].g_employer_zip = format(trim(adr.zipcode), "#####")
		elseif(textlen(trim(adr.zipcode)) > 5)
			lblist->qual[D1.SEQ].g_employer_zip = format(trim(adr.zipcode), "#####-####")
		endif
	elseif (textlen(trim(adr.zipcode))= 0)
		lblist->qual[D1.SEQ].g_employer_zip	= ""
	endif
 
	lblist->qual[D1.SEQ].g_employer_phone = trim(oph.phone_num)
	lblist->qual[D1.SEQ].g_occupation		= trim(po.empl_occupation_text)
 
 
WITH NOCOUNTER
 
 
; get insurance info
SELECT INTO "nl:"
	ENCNTRID = lblist->qual[D1.SEQ].encntrid
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(lblist->qual, 5)))
	, encntr_plan_reltn e
	, organization o
	, health_plan H
	, health_plan_alias ha
	, encntr_person_reltn epr
	, person p
	, address a
	, phone ph
 
PLAN D1 where lblist->qual[D1.SEQ].encntrid != 0
 
join e where e.encntr_id = lblist->qual[D1.SEQ].encntrid
and e.active_ind = 1
and e.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join o where e.organization_id = o.organization_id
 
join h where e.health_plan_id = h.health_plan_id
 
join ha where h.health_plan_id = ha.health_plan_id
 
join epr where e.encntr_id = epr.encntr_id
;and epr.related_person_id = e.person_id
and epr.person_reltn_type_cd = 1158.00
and epr.active_ind = 1.00
and epr.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
 
JOIN p where epr.related_person_id = p.person_id
 
join a where outerjoin(e.encntr_plan_reltn_id) = a.parent_entity_id
and a.parent_entity_name = outerjoin("ENCNTR_PLAN_RELTN")
and a.address_type_cd = outerjoin(754.00)
and a.active_ind = outerjoin(1)
and a.end_effective_dt_tm >  outerjoin(CNVTDATETIME(CURDATE, curtime3))
 
join ph where outerjoin(e.health_plan_id) = ph.parent_entity_id
and ph.parent_entity_name = outerjoin("HEALTH_PLAN")
and ph.phone_type_cd = outerjoin(163.00)
and ph.active_ind = outerjoin(1)
and ph.end_effective_dt_tm > outerjoin(CNVTDATETIME(CURDATE, curtime3))
order by d1.seq, e.encntr_id, e.priority_seq
 
head d1.seq
NULL
 
head e.encntr_id
icnt = 0
 
detail
icnt = icnt + 1
 
	case (e.priority_seq)
		OF 1:
			lblist->qual[D1.SEQ].ins1_orgid	= o.organization_id
			lblist->qual[D1.SEQ].ins1_hplanid	= h.health_plan_id
			lblist->qual[D1.SEQ].ins1_code = trim(ha.alias)
			lblist->qual[D1.SEQ].ins1_name = trim(h.plan_name)
			lblist->qual[D1.SEQ].ins1_grpnbr	= trim(e.group_nbr)
			lblist->qual[D1.SEQ].ins1_idpolicy = trim(e.member_nbr)
			lblist->qual[D1.SEQ].ins1_plan	= trim(uar_get_code_display(h.plan_type_cd))
			lblist->qual[D1.SEQ].ins1_subslname = trim(p.name_last)
			lblist->qual[D1.SEQ].ins1_subsfname = trim(p.name_first)
			lblist->qual[D1.SEQ].ins1_subsmname = trim(p.name_middle)
			lblist->qual[D1.SEQ].ins1_subsrel	= trim(uar_get_code_display(epr.related_person_reltn_cd))
			lblist->qual[D1.SEQ].ins1_addr1	= trim(a.street_addr)
			lblist->qual[D1.SEQ].ins1_addr2	= trim(a.street_addr2)
			lblist->qual[D1.SEQ].ins1_city	= trim(a.city)
			lblist->qual[D1.SEQ].ins1_st		= substring(1, 2, trim(uar_get_code_display(a.state_cd)))
 
 
			if(textlen(trim(a.zipcode))>0)
				if(textlen(trim(a.zipcode)) = 5)
					lblist->qual[D1.SEQ].ins1_zip = format(trim(a.zipcode), "#####")
				elseif(textlen(trim(a.zipcode)) > 5)
					lblist->qual[D1.SEQ].ins1_zip = format(trim(a.zipcode), "#####-####")
				endif
			elseif (textlen(trim(a.zipcode))= 0)
					lblist->qual[D1.SEQ].ins1_zip	= ""
			endif
 
			lblist->qual[D1.SEQ].ins1_phone	= trim(ph.phone_num)
		OF 2:
			lblist->qual[D1.SEQ].ins2_code = trim(ha.alias)
			lblist->qual[D1.SEQ].ins2_name = trim(h.plan_name)
			lblist->qual[D1.SEQ].ins2_grpnbr	= trim(e.group_nbr)
			lblist->qual[D1.SEQ].ins2_idpolicy = trim(e.member_nbr)
			lblist->qual[D1.SEQ].ins2_plan	= " "
			lblist->qual[D1.SEQ].ins2_subslname = trim(p.name_last)
			lblist->qual[D1.SEQ].ins2_subsfname = trim(p.name_first)
			lblist->qual[D1.SEQ].ins2_subsmname = trim(p.name_middle)
			lblist->qual[D1.SEQ].ins2_subsrel	= trim(uar_get_code_display(epr.related_person_reltn_cd))
			lblist->qual[D1.SEQ].ins2_addr1	= trim(a.street_addr)
			lblist->qual[D1.SEQ].ins2_addr2	= trim(a.street_addr2)
			lblist->qual[D1.SEQ].ins2_city	= trim(a.city)
			lblist->qual[D1.SEQ].ins2_st		= substring(1, 2, trim(uar_get_code_display(a.state_cd)))
 
			if(textlen(trim(a.zipcode))>0)
				if(textlen(trim(a.zipcode)) = 5)
					lblist->qual[D1.SEQ].ins2_zip = format(trim(a.zipcode), "#####")
				elseif(textlen(trim(a.zipcode)) > 5)
					lblist->qual[D1.SEQ].ins2_zip = format(trim(a.zipcode), "#####-####")
				endif
			elseif (textlen(trim(a.zipcode))= 0)
					lblist->qual[D1.SEQ].ins2_zip	= ""
			endif
			lblist->qual[D1.SEQ].ins2_phone	= trim(ph.phone_num)
	endcase
 
 
WITH NOCOUNTER
  
;get the authorization#
SELECT into "nl:"
	QUAL_ENCNTRID = lblist->qual[D1.SEQ].encntrid
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(lblist->qual, 5)))
	, encntr_plan_reltn epr
	, encntr_plan_auth_r epar
	, authorization a
 
PLAN D1 where lblist->qual[D1.SEQ].encntrid != 0
join epr where epr.encntr_id = lblist->qual[D1.SEQ].encntrid
and epr.active_ind = 1
and epr.end_effective_dt_tm > CNVTDATETIME(CURDATE, curtime3)
join epar where epr.	encntr_plan_reltn_id = epar.encntr_plan_reltn_id
join a where epar.authorization_id = a.authorization_id
and a.active_ind = 1
and a.end_effective_dt_tm > CNVTDATETIME(CURDATE, curtime3)
 
order by d1.seq, epr.encntr_id, epr.priority_seq
 
head d1.seq
NULL
 
head epr.encntr_id
acnt = 0
 
head epr.priority_seq
acnt = acnt + 1
 
detail
 
	case (acnt)
		OF 0:
			NULL
		OF 1:
			lblist->qual[D1.SEQ].ins1_authnbr	= trim(a.auth_nbr)
		OF 2:
			lblist->qual[D1.SEQ].ins2_authnbr	= trim(a.auth_nbr)
	endcase
 
 
WITH NOCOUNTER
 
;find DX
SELECT INTO "NL:"
	QUAL_ENCNTRID = LBLIST->qual[D1.SEQ].encntrid
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(LBLIST->qual, 5)))
	, diagnosis d
	, nomenclature n
 
PLAN D1 where LBLIST->qual[D1.SEQ].encntrid != 0.00
 
join d where LBLIST->qual[D1.SEQ].encntrid = d.encntr_id
and d.active_ind = 1
and d.end_effective_dt_tm > CNVTDATETIME(CURDATE, curtime3)
and d.diag_type_cd = 88
 
join n where d.nomenclature_id = n.nomenclature_id
and n.principle_type_cd =  1252.00 and n.source_vocabulary_cd = 19350056.00
 
order by d1.seq, d.encntr_id, d.diagnosis_id
 
head d1.seq
NULL
 
head d.encntr_id
dcnt = 0
 
 
head d.diagnosis_id
 
dcnt = dcnt + 1
 
 
if (n.source_identifier != NULL)
 CASE (dcnt)
  OF 0:
   	NULL
 
  OF 1:
  	lblist->qual[D1.SEQ].dx1 = trim(n.source_identifier)
 
  OF 2:
 
  	lblist->qual[D1.SEQ].dx2 = trim(n.source_identifier)
  ENDCASE
 
endif
 
 
WITH NOCOUNTER
 
;get the cpt code
SELECT INTO "NL:"
	ORDERID = LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].orderid
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(LBLIST->qual, 5)))
	, (DUMMYT   D2  WITH SEQ = 1)
	, charge c
	, charge_mod chm
 
PLAN D1 WHERE MAXREC(D2, SIZE(LBLIST->qual[D1.SEQ].ordlist, 5))
JOIN D2 where LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].orderid != 0.00
join c where LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].orderid = c.order_id
join chm where c.charge_item_id = chm.charge_item_id
           and chm.field1_id in ( 615214.00	; CPT
                             ,2555298341.00	; Medi-Cal CPT
                             ,2556641195.00	; IP CPT
                             ,2556641205.00	; IP Medi-Cal CPT
                             ,615215.000000 ; HCPCS
                             ,2555519907.00 ; Medi-Cal HCPCS
                             ,2556641241.00 ; IP HCPCS
                             ,2556641251.00 ; IP Medi-Cal HCPCS
                             ,2558600357.00 ; Medicare HCPCS
 
                            )
order by d1.seq, d2.seq, c.order_id, chm.charge_item_id
 
head d1.seq
NULL
 
head d2.seq
NULL
 
head c.order_id
bcnt = 0
stat = alterlist(LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].blist, 10)
 
head chm.charge_item_id
bcnt = bcnt + 1
if (mod(bcnt, 10) = 1)
 stat = alterlist(LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].blist, bcnt+9)
endif
 
LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].blist[bcnt].bill_code = trim(chm.field6)
LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].blist[bcnt].service_dttm	= format(c.service_dt_tm, "MM/DD/YYYY HH:MM;;DQ8")
 
foot chm.charge_item_id
NULL
 
foot c.order_id
LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].bcnt = bcnt
stat = alterlist(LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].blist, LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].bcnt)
 
WITH NOCOUNTER
 
call echorecord(LBLIST)
 
SELECT INTO value(output_dest)
	QUAL_FIN = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].fin)
	, QUAL_LNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].lname)
	, QUAL_FNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].fname)
	, QUAL_MNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].mname)
	, QUAL_PAT_ADDRES = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].pat_addres)
	, QUAL_PAT_ADDRESS2 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].pat_address2)
	, QUAL_PAT_CITY = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].pat_city)
	, QUAL_PAT_ST = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].pat_st)
	, QUAL_PAT_ZIPCODE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].pat_zipcode)
	, QUAL_PAT_PHONE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].pat_phone)
	, QUAL_SSN = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ssn)
	, QUAL_GENDER = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].gender)
	, QUAL_DOB = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].dob)
	, QUAL_MARITAL_STATUS = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].marital_status)
	, QUAL_ADMIT_DATE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].admit_date)
	, QUAL_DISCH_ADATE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].disch_adate)
	, QUAL_PATIENT_TYPE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].patient_type)
	, QUAL_MRN = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].mrn)
	, QUAL_EMPLOYER_NAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].employer_name)
	, QUAL_EMPLOYER_ADDRESS = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].employer_address)
	, QUAL_EMPLOYER_ADDRESS2 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].employer_address2)
	, QUAL_EMPLOYER_CITY = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].employer_city)
	, QUAL_EMPLOYER_ST = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].employer_st)
	, QUAL_EMPLOYER_ZIPCODE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].employer_zipcode)
	, QUAL_EMPLOYER_PHONE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].employer_phone)
	, QUAL_OCCUPATION = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].occupation)
	, QUAL_G_LNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_lname)
	, QUAL_G_FNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_fname)
	, QUAL_G_MNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_mname)
	, QUAL_G_ADDRESS1 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_address1)
	, QUAL_G_ADDRESS2 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_address2)
	, QUAL_G_CITY = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_city)
	, QUAL_G_ST = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_st)
	, QUAL_G_ZIP = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_zip)
	, QUAL_G_PHONE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_phone)
	, QUAL_G_SSN = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_ssn)
	, QUAL_RELATION = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].relation)
	, QUAL_G_EMPLOYER_NAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_employer_name)
	, QUAL_G_EMPLOYER_ADDRESS = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_employer_address)
	, QUAL_G_EMPLOYER_CITY = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_employer_city)
	, QUAL_G_EMPLOYER_ST = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_employer_st)
	, QUAL_G_EMPLOYER_ZIP = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_employer_zip)
	, QUAL_G_EMPLOYER_PHONE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_employer_phone)
	, QUAL_G_OCCUPATION = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].g_occupation)
	, QUAL_INS1_CODE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_code)
	, QUAL_INS1_NAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_name)
	, QUAL_INS1_ADDR1 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_addr1)
	, QUAL_INS1_ADDR2 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_addr2)
	, QUAL_INS1_CITY = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_city)
	, QUAL_INS1_ST = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_st)
	, QUAL_INS1_ZIP = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_zip)
	, QUAL_INS1_IDPOLICY = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_idpolicy)
	, QUAL_INS1_GRPNBR = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_grpnbr)
	, QUAL_INS1_PLAN = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_plan)
	, QUAL_INS1_SUBSLNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_subslname)
	, QUAL_INS1_SUBSFNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_subsfname)
	, QUAL_INS1_SUBSMNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_subsmname)
	, QUAL_INS1_SUBSREL = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins1_subsrel)
	, QUAL_INS2_CODE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_code)
	, QUAL_INS2_NAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_name)
	, QUAL_INS2_ADDR1 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_addr1)
	, QUAL_INS2_ADDR2 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_addr2)
	, QUAL_INS2_CITY = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_city)
	, QUAL_INS2_ST = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_st)
	, QUAL_INS2_ZIP = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_zip)
	, QUAL_INS2_IDPOLICY = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_idpolicy)
	, QUAL_INS2_GRPNBR = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_grpnbr)
	, QUAL_INS2_PLAN = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_plan)
	, QUAL_INS2_SUBSLNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_subslname)
	, QUAL_INS2_SUBSFNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_subsfname)
	, QUAL_INS2_SUBSMNAME = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_subsmname)
	, QUAL_INS2_SUBSREL = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ins2_subsrel)
	, QUAL_ADM_PHYS_NPI = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].adm_phys_npi)
	, QUAL_ADM_PHYS = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].adm_phys)
	, QUAL_REF_PHYS_NPI = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ref_phys_npi)
	, QUAL_REF_PHYSICIAN = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ref_physician)
	, QUAL_DX1 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].dx1)
	, QUAL_DX2 = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].dx2)
	, BLIST_BILL_CODE = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].blist[D3.SEQ].bill_code)
	, BLIST_SVC_DTTM = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].blist[D3.SEQ].service_dttm)
	, ACCESSIONBR = SUBSTRING(1, 30, LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].accessionbr)
	, ORD_PHYS = SUBSTRING(1, 50, LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].ord_phys)
	, ORD_PHYS_NPI = SUBSTRING(1, 50, LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].ord_phys_npi)
	, VERYF_PHYS = SUBSTRING(1, 50, LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].veryf_phys)
	, VERYF_PHYS_NPI = SUBSTRING(1, 50, LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].veryf_phys_npi)
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(LBLIST->qual, 5)))
	, (DUMMYT   D2  WITH SEQ = 1)
	, (DUMMYT   D3  WITH SEQ = 1)
	, DUMMYT   D4
	, DUMMYT   D5
 
PLAN D1 WHERE MAXREC(D2, SIZE(LBLIST->qual[D1.SEQ].ordlist, 5))
JOIN D4
JOIN D2 WHERE MAXREC(D3, SIZE(LBLIST->qual[D1.SEQ].ordlist[D2.SEQ].blist, 5))
JOIN D5
JOIN D3
 
ORDER BY
	QUAL_LNAME
 
HEAD REPORT
HeaderLine = concat("PatAcct","|","PatLastName","|","PatFirstName","|", "PatMI"
, "|", "PatAddr1","|", "PatAddr2", "|", "PatCity", "|", "PatState"
, "|", "PatZip","|", "PatPhone","|", "PatSSN", "|", "PatSex"
, "|", "PatDOB", "|", "PatMaritalStatus", "|", "AdmitDate", "|", "DisChgDate", "|", "PatType", "|", "MedicalRecNum"
, "|", "EmployerName", "|", "EmployerAddr1", "|", "EmployerAddr2", "|", "EmployerCity", "|", "EmployerState"
, "|", "EmployerZip", "|","EmployerPhone","|","Occupation", "|", "GuarLastName", "|", "GurarFirstName"
, "|", "GurarMI","|","GuarAddr1","|","GuarAddr2", "|", "GuarCity", "|", "GuarState"
, "|", "GuarZip","|","GuarPhone","|","GuarSSN","|","GuarRelToPat", "|", "GuarEmpName", "|","GuarEmpAddr1"
, "|", "GuarEmpCity","|","GuarEmpState","|","GuarEmpZip", "|", "GuarWorkPhone","|", "GuarOccupation"
, "|", "Ins1Co","|","Ins1Name", "|", "Ins1Addr1","|","Ins1Addr2","|","Ins1City","|","Ins1State","|","Ins1Zip"
, "|", "Ins1PolicyID","|","Ins1Group","|","Ins1Plan","|","SubLastName","|","SubFirstName","|","SubMI"
, "|", "SubRelToPat","|","Ins2Co", "|","Ins2Name","|","Ins2Addr1","|","Ins2Addr2","|","Ins2City","|","Ins2State"
, "|", "Ins2Zip","|","Ins2PolicyID","|","Ins2Group","|","Ins2Plan","|","Sub2LastName","|","Sub2FirstName"
, "|", "Sub2MI","|","Sub2RelToPat","|","OrderingDocNPI", "|", "OrderingDoc", "|", "VerifyingDocNPI", "|", "VerifyingDoc"
, "|", "ReferringDocNPI","|","ReferringDoc","|","AdmittingDocNPI", "|", "AdmittingDoc"
, "|", "AccessionNbr", "|", "ICD10","|","ICD102", "|", "ServiceCode", "|", "Service Date/Time", "|" )
 
COL 0
HeaderLine
Row + 1
 
 
DETAIL
DisplayLine = build(QUAL_FIN,"|",QUAL_LNAME,"|",QUAL_FNAME,"|",QUAL_MNAME,"|",QUAL_PAT_ADDRES,"|",QUAL_PAT_ADDRESS2,
"|",QUAL_PAT_CITY,"|",QUAL_PAT_ST,"|",QUAL_PAT_ZIPCODE, "|",QUAL_PAT_PHONE,"|",QUAL_SSN,"|",QUAL_GENDER,"|",QUAL_DOB,
"|",QUAL_MARITAL_STATUS,"|",QUAL_ADMIT_DATE,"|",QUAL_DISCH_ADATE,"|",QUAL_PATIENT_TYPE, "|",QUAL_MRN,"|",  QUAL_EMPLOYER_NAME,
"|",QUAL_EMPLOYER_ADDRESS, "|", QUAL_EMPLOYER_ADDRESS2, "|", QUAL_EMPLOYER_CITY, "|",QUAL_EMPLOYER_ST,"|",QUAL_EMPLOYER_ZIPCODE,
"|",QUAL_EMPLOYER_PHONE,"|",QUAL_OCCUPATION,"|",QUAL_G_LNAME,"|",QUAL_G_FNAME,"|",QUAL_G_MNAME,"|",QUAL_G_ADDRESS1,
"|",QUAL_G_ADDRESS2,"|", QUAL_G_CITY,"|",QUAL_G_ST,"|",QUAL_G_ZIP,"|",QUAL_G_PHONE,"|",QUAL_G_SSN,"|",QUAL_RELATION,
"|",QUAL_G_EMPLOYER_NAME,"|",QUAL_G_EMPLOYER_ADDRESS,"|",QUAL_G_EMPLOYER_CITY,"|",QUAL_G_EMPLOYER_ST,"|",QUAL_G_EMPLOYER_ZIP,
"|",QUAL_G_EMPLOYER_PHONE,"|",QUAL_G_OCCUPATION,"|",QUAL_INS1_CODE,"|",QUAL_INS1_NAME,"|",QUAL_INS1_ADDR1,
"|",QUAL_INS1_ADDR2,"|",QUAL_INS1_CITY,"|",QUAL_INS1_ST,"|",QUAL_INS1_ZIP,"|",QUAL_INS1_IDPOLICY,"|",QUAL_INS1_GRPNBR,
"|",QUAL_INS1_PLAN,"|",QUAL_INS1_SUBSLNAME,"|",QUAL_INS1_SUBSFNAME,"|",QUAL_INS1_SUBSMNAME, "|", QUAL_INS1_SUBSREL,
"|",QUAL_INS2_CODE, "|",QUAL_INS2_NAME, "|",QUAL_INS2_ADDR1,"|",QUAL_INS2_ADDR2,"|",QUAL_INS2_CITY,
"|",QUAL_INS2_ST,"|", QUAL_INS2_ZIP,"|",QUAL_INS2_IDPOLICY,"|",QUAL_INS2_GRPNBR,"|", QUAL_INS2_PLAN,
"|",QUAL_INS2_SUBSLNAME,"|",QUAL_INS2_SUBSFNAME,"|",QUAL_INS2_SUBSMNAME,"|", QUAL_INS2_SUBSREL ,"|", ORD_PHYS_NPI,
"|",ORD_PHYS, "|", VERYF_PHYS_NPI, "|", VERYF_PHYS, "|", QUAL_REF_PHYS_NPI, "|",QUAL_REF_PHYSICIAN,"|",QUAL_ADM_PHYS_NPI,
"|", QUAL_ADM_PHYS, "|", ACCESSIONBR, "|", QUAL_DX1,"|",QUAL_DX2,"|",BLIST_BILL_CODE, "|", BLIST_SVC_DTTM, "|", CHAR(13))
 
COL 0
DisplayLine
ROW + 1
 
WITH MAXCOL = 32000, OUTERJOIN = D4, OUTERJOIN = D5, noformfeed,
format = lfstream, nullreport
 
;call echorecord(LBLIST)
 
 
end
go
 
