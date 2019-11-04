drop program cpmstartup_perigen go
create program cpmstartup_perigen

set trace = callecho
call echo ("executing cpmstartup_perigen..." )
execute cpmstartup
set trace = server
set trace = callecho
;call echo ("setting cpmstartup_eso cache parameters..." )
;SET trace rangecache 350
;SET trace progcachesize 200
;SET trace progcache 100
; CALL echo ("ESO set -> Rangecache set to 350" )
; CALL echo ("ESO set -> Program cache set to 200" )
; CALL echo ("ESO set -> Progcachsize set to 100" )
; CALL echo ("setting cpmstartup_eso trace parameters..." )
set trace = nocallecho
set trace = noechoinput
set trace = noechoinput2
set trace = noechoprog
set trace = noechoprogsub
set trace = noechorecord
set trace = nomemory
set trace = nordbdebug
set trace = nordbbind
set trace = noshowuar
set trace = noshowuarpar
set trace = notest
set trace = notimer
set message = noinformation
set trace = recpersist

/********************************************************************************************
* LOAD SERVER CACHE - whenever server is cycled, the cache record structure is re-populated *
*********************************************************************************************/
if (validate(cache) != 1)
  call log_msg(2, "Loading Server Cache", "PeriGenAud")
 
  record cache (
    1 alias[*]
      2 alias = vc
      2 code_value = f8
      2 code_set = i4
      2 id_nbr = f8
    1 esi_alias_trans[*]
      2 contrib_sys_cd = f8
      2 alias_pool_cd = f8
      2 alias_entity_name = vc
      2 alias_entity_alias_type_cd = f8
      2 esi_alias_type = vc
      2 esi_assign_auth = vc
      2 esi_assign_fac = vc
  )
 
  ;load contributor_system aliases
  set default_cd = uar_get_code_by("DISPLAYKEY",73,"DEFAULT")
 
  select
    cva.alias
    , cva.code_value
    , cva.code_set
  from
    code_value_alias cva
  where cva.code_set = 89
    and cva.contributor_source_cd = default_cd
  head report
    cnt = 0
  detail
    cnt = cnt + 1
 
    if (cnt > size(cache->alias,5))
      stat = alterlist(cache->alias, cnt + 10)
    endif
 
    cache->alias[cnt].alias = cva.alias
    cache->alias[cnt].code_value = cva.code_value
    cache->alias[cnt].code_set = cva.code_set
  foot report
    stat = alterlist(cache->alias,cnt)
  with nocounter
 
  ;load additional aliases
  set invision_cd = uar_get_code_by("DISPLAYKEY",73,"INVISION")
 
  select
    cva.alias
    , cva.code_value
    , cva.code_set
  from
    code_value_alias cva
  where cva.code_set = 57
    and cva.contributor_source_cd = invision_cd
  head report
    cnt = size(cache->alias,5)
  detail
    cnt = cnt + 1
 
    if (cnt > size(cache->alias,5))
      stat = alterlist(cache->alias, cnt + 10)
    endif
 
    cache->alias[cnt].alias = cva.alias
    cache->alias[cnt].code_value = cva.code_value
    cache->alias[cnt].code_set = cva.code_set
  foot report
    stat = alterlist(cache->alias,cnt)
  with nocounter
 
  ;load tracking reference locations
  set acuity_cd = uar_get_code_by("MEANING", 16409, "ACUITY")
 
  select
    cv.code_value
    , cv.code_set
    , cva.alias
    , tr.tracking_ref_id
  from
    track_reference tr
    , code_value cv
    , code_value_alias cva
  plan tr
    where tr.tracking_ref_type_cd = acuity_cd
      and tr.active_ind = 1
  ;;; todo - CV table can go away once 16589 is aliased
  join cv
    where cv.code_value = tr.assoc_code_value
      and cv.code_set = 16589
  join cva
    where cva.code_value = outerjoin(cv.code_value)
      and cva.contributor_source_cd = outerjoin(invision_cd)
  head report
    cnt = size(cache->alias,5)
  detail
    cnt = cnt + 1
 
    if (cnt > size(cache->alias,5))
      stat = alterlist(cache->alias, cnt + 10)
    endif
 
    cache->alias[cnt].alias = cva.alias
    cache->alias[cnt].code_value = cv.code_value
    cache->alias[cnt].code_set = cv.code_set
    cache->alias[cnt].id_nbr = tr.tracking_ref_id
  foot report
    stat = alterlist(cache->alias,cnt)
  with nocounter
 
  ;load contributor_system alias translations
  select
    eat.contributor_system_cd
    , eat.alias_pool_cd
    , eat.alias_entity_name
    , eat.alias_entity_alias_type_cd
    , eat.esi_alias_type
    , eat.esi_assign_auth
    , eat.esi_assign_fac
  from
    esi_alias_trans eat
  where eat.active_ind = 1
 
  head report
    cnt = 0
  detail
    cnt = cnt + 1
 
    if (cnt > size(cache->esi_alias_trans,5))
      stat = alterlist(cache->esi_alias_trans, cnt + 10)
    endif
 
    cache->esi_alias_trans[cnt].contrib_sys_cd = eat.contributor_system_cd
    cache->esi_alias_trans[cnt].alias_pool_cd = eat.alias_pool_cd
    cache->esi_alias_trans[cnt].alias_entity_name = eat.alias_entity_name
    cache->esi_alias_trans[cnt].alias_entity_alias_type_cd = eat.alias_entity_alias_type_cd
    cache->esi_alias_trans[cnt].esi_alias_type = eat.esi_alias_type
    cache->esi_alias_trans[cnt].esi_assign_auth = eat.esi_assign_auth
    cache->esi_alias_trans[cnt].esi_assign_fac = eat.esi_assign_fac
  foot report
    stat = alterlist(cache->esi_alias_trans,cnt)
  with nocounter
endif

set trace = norecpersist

end
go

