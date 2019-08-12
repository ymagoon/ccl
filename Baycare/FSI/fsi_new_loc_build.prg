drop program fsi_new_loc_build go
create program fsi_new_loc_build
 
prompt
                "Output to File/Printer/MINE" = "MINE"                                                                ;* Enter or select the p
                , "Enter Org Type" = ""                                                                               ;* BMG/BUC = 2.16.840.1.
                ;<<hidden>>"Enter Organization Search String" = ""                                                    ;* Enter or select the p
                , "" = 0
                , "prompt1" = 0
                , "If building a BOI location  select the hospital it is associated to  otherwise, leave blank" = 0
 
with OUTDEV, org_type, organization, facility, boi_organization
 
;store data input from user or generated by program
record data (
  1 organization_id = f8
  1 oid = vc
  1 org_contributor_sys_reltn_id = f8
  1 fl_shots_code = vc
)
 
;sim_ccd_add_oid - add row to si_oid
record request1234857 (
  1 qual[1]
    2 entity_name = vc
    2 entity_id = f8
    2 entity_type = vc
    2 contributor_source_cd = f8
    2 cerner_defined_ind = i2
    2 oid_txt = vc
    2 alias_pool_rank_val = f8
)
 
;sim_add_org_cont_sys_reltn - add row to org_contributor_sys_reltn
record request1234131 (
  1 org_contributor_sys_reltn [1]
    2  organization_id = f8
    2  contributor_system_cd = f8
    2  reltn_type_cd = f8
    2  authorization_type_cd = f8
    2  domain_addr = vc
    2  consent_policy_id = f8
    2  info_sub_type_cd = f8
    2  udf_consent_cd = f8
)
 
;sim_add_service_property - add row to si_service_property
record request1234874 (
  1 qual[1]
    2 parent_entity_name = vc
    2 parent_entity_id = f8
    2 prop_name = vc
    2 prop_value = vc
    2 encryption_flag = i2
)
 
declare fl_shots_contrib_sys_cd = f8 with constant(value(uar_get_code_by("DISPLAYKEY",73,"FLORIDASHOTSSOURCE")))
 
set data->organization_id = $organization
 
/***************************************************
*             FIND THE OID                        *
**************************************************/
if ($org_type in ("BMG","BUC","SUN")) ;BMG, BUC, SunCoast
  select
    new_oid_trailing_digits = max(cnvtint(replace(s.oid_txt, "2.16.840.1.113883.3.1106.5000.", ""))+1)
  from
    si_oid s
    , organization o
  where o.organization_id = s.entity_id
    and s.entity_type = "ORGANIZATION"
    and s.oid_txt = "2.16.840.1.113883.3.1106.5000.*"
  detail
    data->oid = concat("2.16.840.1.113883.3.1106.5000.", cnvtstring(new_oid_trailing_digits))
  with nocounter
endif
 
if ($org_type = "HOSP") ;Hospital
  select
    max_nbr = max(cnvtint(replace(s.oid_txt, "2.16.840.1.113883.3.1106.", "")))
  from
    si_oid s
    , organization o
  where o.organization_id = s.entity_id
    and s.entity_type = "ORGANIZATION"
    and o.org_name != "RESONANCE"
    and s.oid_txt = "2.16.840.1.113883.3.1106.*"
    and s.oid_txt != "2.16.840.1.113883.3.1106.5000.*"
  detail
    /*
      We take the largest number built (max_nbr), excluding 5000* numbers and resonance,
      and find the next number divisible by 25.
    */
    diff = 25 - mod(max_nbr, 25)
    new_nbr = max_nbr + diff
 
    data->oid = concat("2.16.840.1.113883.3.1106.5000.", cnvtstring(new_nbr))
  with nocounter
endif
 
if ($org_type = "BOI")
  ;find base OID
  select
    s.oid_txt
  from
    si_oid s
  where s.entity_id = $boi_organization
  detail
    data->oid = s.oid_txt
  with nocounter
 
  record tmp (
    1 qual[*]
      2 num = i4
  )
 
  ;search string to find all OIDs within base
  set oid_search = concat(substring(1, textlen(data->oid) - 2, data->oid), "*")
 
  ;piece takes the 8th position of the OID, which are the last 3 digits
  set base_oid = cnvtint(piece(data->oid, ".", 8, "Not Found"))
  call echo (build("base_oid=",base_oid))
 
  select
    s.oid_txt
  from
    si_oid s
  where s.oid_txt = patstring(oid_search,1) ;
    and s.oid_txt != "2.16.840.1.113883.3.1106.5000.*"
  head report
    stat = alterlist(tmp->qual, 100)
    cnt = 0
  detail
    cnt = cnt + 1
    tmp->qual[cnt].num = cnvtint(piece(s.oid_txt, ".", 8, "Not Found"))
  foot report
    stat = alterlist(tmp->qual, cnt)
  with nocounter
 
  call echorecord(tmp)
 
  set last_oid = 0
  set flag = 0
 
  for (x = 1 to size(tmp->qual,5))
    call echo(build("num=",tmp->qual[x].num))
 
    ;todo - add base logic to work with 650 series
 
    ;set cur_oid = cnvtint(piece(s.oid_txt, ".", 8, "Not Found")) ;find last 3 digits of current oid
    set cur_oid = tmp->qual[x].num
    call echo(build("cur_oid=", cur_oid))
    call echo(build("last_oid=",last_oid))
 
    /* compare last 3 digits to current 3 digits - 1. If numbers are consequtive this is never run. We find
       the first instance where it is not consequtive and that value is set as the oid
     */
  ;  if (base_oid >= last_oid)
      if (last_oid != cur_oid - 1 and flag = 0 and last_oid != 0)
 
        set flag = 1
        set new_oid = last_oid + 1
        call echo(build("new_oid=",new_oid))
        set data->oid = concat("2.16.840.1.113883.3.1106.", cnvtstring(new_oid))
 
      endif
  ;  endif
 
    call echo(build("flag=",flag))
    set last_oid = cur_oid
  endfor
 
  ;the flag won't be set if all numbers are sequential (e.g. 500,501,502). Only if they are nonsequential (601,602,603,650)
  if (flag = 0)
    set new_oid = cnvtstring(tmp->qual[size(tmp->qual,5)].num + 1)
    set data->oid = concat("2.16.840.1.113883.3.1106.", new_oid)
  endif
 
  call echo(build("final=",data->oid))
endif
/***************************************************
*             FIND THE FL SHOTS CODE              *
**************************************************/
;todo - confirm when the fl shots should be created and what logic should revolve around whether it can't be found.
select into "nl:"
  cvo.alias
from
  code_value_outbound cvo
where cvo.code_value = $facility
  and cvo.contributor_source_cd = fl_shots_contrib_sys_cd
detail
  data->fl_shots_code = cvo.alias
with nocounter
 
call echo($facility)
call echorecord (data)
 
;populate request structure for sim_ccd_add_oid
set request1234857->qual.entity_name = "ORGANIZATION"
set request1234857->qual.entity_id = data->organization_id
set request1234857->qual.entity_type = "ORGANIZATION"
set request1234857->qual.contributor_source_cd = 0
set request1234857->qual.cerner_defined_ind = 0
set request1234857->qual.oid_txt = data->oid
set request1234857->qual.alias_pool_rank_val = 0
 
;execute SIM_CCD_ADD_OID with replace("REQUEST",REQUEST1234857) ;build OID
 
if ($org_type != "BOI")
  ;populate record structure for sim_add_org_cont_sys_reltn
  set fl_shots_contributor_system_cd = uar_get_code_by("DISPLAYKEY",89,"FLORIDAIMMREGISTRYFLSHOTS")
  set immunization_reltn_type_cd = uar_get_code_by("MEANING",311,"IISREGISTRY")
 
  set request1234131->org_contributor_sys_reltn.organization_id = data->organization_id
  set request1234131->org_contributor_sys_reltn.contributor_system_cd = fl_shots_contributor_system_cd
  set request1234131->org_contributor_sys_reltn.reltn_type_cd = immunization_reltn_type_cd
  set request1234131->org_contributor_sys_reltn.authorization_type_cd = 0
  set request1234131->org_contributor_sys_reltn.domain_addr = ""
  set request1234131->org_contributor_sys_reltn.consent_policy_id = 0
  set request1234131->org_contributor_sys_reltn.info_sub_type_cd = 0
  set request1234131->org_contributor_sys_reltn.udf_consent_cd = 0
 
  set trace = recpersist
 
;  execute SIM_ADD_ORG_CONT_SYS_RELTN with replace("REQUEST",REQUEST1234131) ;build row on org_contributor_sys_reltn
 
  set trace = norecpersist
 
;  set data->org_contributor_sys_reltn_id = reply->org_contributor_sys_reltn_qual.org_contributor_sys_reltn_id
 
  /* the reply from SIM_ADD_ORG_CONT_SYS_RELTN is different than the reply from SIM_ADD_SERVICE_PROPERTY
     so we need to free the reply returned from SIM_ADD_ORG_SYS_RELTN so we don't get an error */
  free record reply
 
  ;populate record structure for sim_add_service_property
  set request1234874->qual.parent_entity_name = "ORG_CONTRIBUTOR_SYS_RELTN"
  set request1234874->qual.parent_entity_id = data->org_contributor_sys_reltn_id
  set request1234874->qual.prop_name = "MSH_4_SENDING_FACILITY_NAMESPACE"
  set request1234874->qual.prop_value = data->fl_shots_code
  set request1234874->qual.encryption_flag = 0
 
;  execute SIM_ADD_SERVICE_PROPERTY with replace("REQUEST",REQUEST1234874) ;build row on si_service_property
 
endif ;end logic to skip BOI
 
/***************************************************
*             REPORT AND EMAIL                    *
**************************************************/
record rep (
  1 org_name = vc
  1 organization_id = f8
  1 oid = vc
  1 fl_shots_code = vc
  1 loc_alias = vc
)
 
select into "nl:"
  o.org_name
  , o.organization_id
  , oid = oid.oid_txt
  , s.prop_value
from
  organization o
  , org_contributor_sys_reltn org
  , si_service_property s
  , si_oid oid
plan o
  where o.organization_id = data->organization_id
join org
  where org.organization_id = o.organization_id
    and org.contributor_system_cd = value(uar_get_code_by("DISPLAYKEY",89,"FLORIDAIMMREGISTRYFLSHOTS"))
join s
  where s.parent_entity_id = org.org_contributor_sys_reltn_id
    and s.parent_entity_name = "ORG_CONTRIBUTOR_SYS_RELTN"
join oid
  where oid.entity_id = o.organization_id
    and oid.entity_type = "ORGANIZATION"
detail
  rep->org_name = o.org_name
  rep->organization_id = o.organization_id
  rep->oid = oid.oid_txt
  rep->fl_shots_code = s.prop_value
with nocounter
 
select into "nl:"
  cvo.alias
from
  code_value cv
  , code_value_outbound cvo
plan cv
  where cv.display = "BMG MPMS Neuro"
    and cv.cdf_meaning = "FACILITY"
join cvo
  where cvo.code_value = cv.code_value
    and cvo.contributor_source_cd = value(uar_get_code_by("DISPLAYKEY",73,"FLORIDASHOTSSOURCE"))
detail
  rep->loc_alias = cvo.alias
with nocounter
 
select into $outdev
  org_name = rep->org_name
  , org_id = rep->organization_id
  , oid = rep->oid
  , fl_shots_code = rep->fl_shots_code
  , loc_alias = rep->loc_alias
from
  (dummyt d with seq = 1)
plan d
head report
  col 0 "Build complete"
  row + 1
  col 0 "OID and Florida Shots build successful"
  row + 1
detail
  o = build2("organization: ", org_name)
  o_id = build2("org_id: ", org_id)
  od = build2("oid: ", oid)
  fl_shots = build2("Florida Shots Code: ", fl_shots_code)
  alias = build2("Location alias for facility: ", loc_alias)
 
  col 0 o
  row + 1
  col 0 o_id
  row + 1
  col 0 od
  row + 1
  col 0 fl_shots
  row + 1
  col 0 alias
  row + 1
  if (fl_shots_code != loc_alias)
    col 0 "Location alias was either not found or there is a descrepency between the two. Double check build and alias."
  endif
with nocounter
 
;send email to HIE team
if (curqual > 0)
  if (trim(rep->fl_shots_code) = trim(rep->loc_alias))
    set sub = "New Location Build"
    set bdy = build2("oid = ", rep->oid, " Florida Shots Code = ", rep->fl_shots_code)
    set email = "yitzhak.magoon@baycare.org"
 
    ;execute fsi_generate_email sub, bdy, email
  endif
endif
 
end
go
 
 
