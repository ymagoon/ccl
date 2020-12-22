drop program avh_import_employees go
create program avh_import_employees
 
/*
record requestin (
  1 list_0[*]
    2 id = vc
    2 last = vc
    2 first = vc
    2 deptid = vc
    2 deptdescr = vc
    2 jobcode = vc
    2 jobdescr = vc
    2 fte = vc
    2 dob = vc
)
*/
 
record data (
  1 list[*]
    2 person_id = f8
    2 employee_id = f8
    2 name_last = c40
    2 name_first = c40
    2 dept_id = c6
    2 dept_desc = c30
    2 job_code = c4
    2 position_cd = f8
    2 job_desc = c30
    2 fte = c3
    2 active_ind = i2
)
 
record missing (
  1 list[*]
    2 name_first
    2 name_last
)
 
;set trace = rdbbind
;set trace = rdbdebug
 
call echo(build("sz of requestin=",size(requestin->list_0,5)))
 
select into "nl:"
from
  prsnl p
  , (dummyt d with seq = value(size(requestin->list_0,5)))
plan d
join p
  where p.active_ind = 1
    and p.person_id > 0
    and p.name_last_key = cnvtupper(trim(requestin->list_0[d.seq].last,3))
    and p.name_first_key = cnvtupper(trim(requestin->list_0[d.seq].first,3))
head report
  stat = alterlist(data->list,3000)
  pCnt = 0
detail
  pCnt = pCnt + 1
 
  if (pCnt > size(data->list,5))
    stat = alterlist(data->list,pCnt + 100)
  endif
 
  data->list[d.seq].person_id = p.person_id
  data->list[d.seq].employee_id = cnvtint(requestin->list_0[d.seq].id)
  data->list[d.seq].name_last = p.name_first
  data->list[d.seq].name_first = p.name_last
  data->list[d.seq].dept_id = requestin->list_0[d.seq].deptid
  data->list[d.seq].dept_desc = requestin->list_0[d.seq].deptdescr
  data->list[d.seq].job_code = requestin->list_0[d.seq].jobcode
  data->list[d.seq].position_cd = p.position_cd
  data->list[d.seq].job_desc = requestin->list_0[d.seq].jobdescr
  data->list[d.seq].fte = requestin->list_0[d.seq].fte
  data->list[d.seq].active_ind = p.active_ind
foot report
  stat = alterlist(data->list,pCnt)
with nocounter
 
set idx = 0
set ydx = 0
set cnt = 0
;for (idx = 0 to value(size(requestin->list_0,5)))
;  set pos = locateval(ydx, 1, size(data->list,5),requestin->list_0[idx].last, data->list[ydx].name_last)
;
;  if (pos <= 0)
;    set cnt = cnt + 1
;
;    if (cnt > size(missing->list,5))
;      set stat = alterlist(missing->list, cnt + 1)
;    endif
;
;    set missing->list[cnt].name_last = requestin->list_0[idx].last
;    set missing->list[cnt].name_first = requestin->list_0[idx].first
;  endif
;endfor
;
;call echorecord(missing)
 
 
/*insert into cust_prsnl_info c
  , (dummyt d with seq = (value(size(data->list,5))))
  set c.person_id = data->list[d.seq].person_id
    , c.employee_id = data->list[d.seq].employee_id
    , c.name_last = data->list[d.seq].name_last
    , c.name_first = data->list[d.seq].name_first
    , c.dept_id = data->list[d.seq].dept_id
    , c.dept_desc = data->list[d.seq].dept_desc
    , c.job_code = data->list[d.seq].job_code
    , c.position_cd = data->list[d.seq].position_cd
    , c.job_desc = data->list[d.seq].job_desc
    , c.fte = data->list[d.seq].fte
    , c.updt_cnt = 0
    , c.updt_dt_tm = cnvtdatetime(curdate,curtime3)
    , c.updt_id = reqinfo->updt_id
    , c.updt_task = reqinfo->updt_task
plan d
  where data->list[d.seq].active_ind = 1
    and data->list[d.seq].person_id > 0
join c
with nocounter
*/
call echorecord(data)
 
end
go
 
