 
drop   program humedica_bc_prsnl_monthly:dba go
create program humedica_bc_prsnl_monthly:dba
 
;**** BEGINNING OF PREAMBLE ****
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;********************************************************
 
declare startdt = f8
declare enddt = f8
 
set stardt = cnvtdatetime(curdate-1,0)
set endt = cnvtdatetime(curdate-1,235959)
 
set startdt = cnvtdatetime(stardt)
set enddt = cnvtdatetime(endt)
free set today
declare today = f8
declare edt = vc
declare ydt = vc
 
declare month = vc
set month = format(startdt,"mmm;;d")
set dir_date = format(curdate,"yyyymm;;d")
 
set today = cnvtdatetime(curdate,curtime3)
set edt = format(today,"yyyymmdd;;d")
set dirdt = format(startdt,"yyyymmdd;;d")
set ydt = format(startdt,"yyyy;;d")
 
set beg_dt = startdt
set echo_beg_dt = format(beg_dt,"dd/mmm/yyyy hh:mm;;d")
set end_dt = enddt
set echo_end_dt = format(end_dt,"dd/mmm/yyyy hh:mm;;d")
 
;002 unique file logic
set print_file = concat("hum_zh_personnel_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR/",print_file)
;set hold_file = concat("$CCLSCRATCH/",print_file)
set print_dir = "ccluserdir:"
set client_code = "H416989"
set file_ext = "_zh_personnel.txt"
 
call echo(" ------------ get physicians -------------")
 
free record docs
record docs
(
  1 out_line                    = vc
  1 doc_cnt                     = i4
  1 qual[*]
    2 active_ind                = vc
    2 prsnl_id                  = i4
    2 doc_id                    = vc
    2 fname                      = vc
    2 lname                     = vc
    2 mname                     = vc
    2 NPI                       = vc
    2 name_title                = vc
    2 bus_phone                 = vc
    2 addr1                     = vc
    2 addr2                     = vc
    2 state_cd                  = vc
    2 city                      = vc
    2 state                     = vc
    2 zip                       = vc
    2 phone                     = vc
    2 beg_effective_dt_tm       = vc  ;01 Sep 2011....mrhine
    2 end_effective_dt_tm       = vc  ;01 Sep 2011....mrhine
    2 spec[*]
      5 specialty               = vc
)
 
 
 
set cnt = 0
select into "nl:"
 
from
  prsnl pr,
  prsnl_alias pa,
  person_name pn,
  address addr,
  phone pho,
  prsnl_group_reltn pgr,
  prsnl_group pg,
  prsnl_alias pa2
 
plan pr where pr.person_id > 0
;    and pr.active_ind+0 = 1
;    and pr.physician_ind+0 = 1
;    and pr.end_effective_dt_tm+0 > cnvtdatetime(curdate,curtime3)
join pa ;ORGANIZATION DOCNBR (SMS)
  where pa.person_id = outerjoin(pr.person_id)
    and pa.prsnl_alias_type_cd = outerjoin(11365300)  	;npi
    and pa.active_ind+0 = outerjoin(1)
    and pa.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
join addr
  where addr.parent_entity_id = outerjoin(pr.person_id)
    and addr.address_type_cd = outerjoin(754) ;business
    and addr.active_ind = outerjoin(1)
    and addr.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
join pho
  where pho.parent_entity_id = outerjoin(pr.person_id)
    and pho.phone_type_cd = outerjoin(163) ;business
    and pho.active_ind = outerjoin(1)
    and pho.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
join pa2   ;NPI
  where pa2.person_id = outerjoin(pr.person_id)
    and pa2.prsnl_alias_type_cd =outerjoin(11365300.00)	;npi
    and pa2.active_ind+0 = outerjoin(1)
    and pa2.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
join pn
  where pn.person_id = outerjoin(pr.person_id)
    and pn.name_type_cd+0 = outerjoin(766) ;current
    and pn.active_ind+0 = outerjoin(1)
    and pn.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
join pgr
  where pgr.person_id = outerjoin(pr.person_id)
    and pgr.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
    and pgr.active_ind+0 = outerjoin(1)
join pg
  where pg.prsnl_group_id = outerjoin(pgr.prsnl_group_id)
    and pg.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
    and pg.active_ind+0 =outerjoin(1)
;    and pg.prsnl_group_class_cd+0 = outerjoin(11156)
    and pg.prsnl_group_type_cd +0 >outerjoin(0)
 
order by
  pr.person_id,pgr.person_id,pg.prsnl_group_id
head report
x=0
cnt = 0
cnt2 = 0
head pr.person_id
  cnt = cnt + 1
  stat = alterlist(docs->qual,cnt)
  docs->qual[cnt].active_ind = cnvtstring(pr.active_ind)
  docs->qual[cnt].prsnl_id = pr.person_id
  docs->qual[cnt].doc_id = trim(pa.alias,3)
  docs->qual[cnt]->lname = trim(pn.name_last,3)
  docs->qual[cnt]->fname = trim(pn.name_first,3)
  docs->qual[cnt]->mname = trim(pn.name_middle,3)
  docs->qual[cnt]->npi = trim(pa2.alias,3)
  docs->qual[cnt]->name_title = trim(pn.name_title,3)
  docs->qual[cnt]->addr1 = trim(addr.street_addr,3)
  docs->qual[cnt]->addr2 = trim(addr.street_addr2,3)
  docs->qual[cnt]->city = trim(addr.city,3)
  docs->qual[cnt]->state = trim(addr.state,3)
  if (pho.phone_num > " ")
  docs->qual[cnt]->phone = format(pho.phone_num,"###-###-####")
  endif
  if (addr.state_cd > 0)
  docs->qual[cnt]->state_cd = cnvtstring(addr.state_cd)
  endif
  docs->qual[cnt]->zip = trim(addr.zipcode,3)
  docs->qual[cnt]->beg_effective_dt_tm = format(pr.beg_effective_dt_tm,"yyyyMMddhhmmss;;d")  ;01 Sep 2011....mrhine
  docs->qual[cnt]->end_effective_dt_tm = format(pr.end_effective_dt_tm,"yyyyMMddhhmmss;;d")  ;01 Sep 2011....mrhine
 
cnt2 = 0
head pgr.prsnl_group_reltn_id
x=0
cnt2 = cnt2+1
;cnt2 = 0
head pg.prsnl_group_id
;cnt2 = cnt2 + 1
stat = alterlist(docs->qual[cnt]->spec,14)
if (cnt2 < 15)
docs->qual[cnt]->spec[cnt2]->specialty = cnvtstring(pg.prsnl_group_type_cd)
endif
foot report
  stat = alterlist(docs->qual, cnt)
  docs->doc_cnt = cnt
 
with nocounter
 
call echo(build("cnt = ",docs->doc_cnt))
call pause(5)
 
 
;final select
select into concat(print_dir,print_file)	;humedica_bc_physicans ;$1
       substring(1,100,docs->qual[d.seq].doc_id)
from
  (dummyt d );with seq=value(size(docs->qual,5)))
plan d
head report
  first_time = 1
 
  docs->out_line = build("Active_Ind||","Prsnl ID||","Doc ID||","NPI||","First_Name||","Middle_Name||","Last_Name||",
                         "Title||","Address_1||","Address_2||","City||","State||","State_cd||","Zipcode||",
                         "Business_Phone||"
                         ,"Beg_effective_dt_tm||"   ;01 Sep 2011....mrhine
                         ,"End_effective_dt_tm||"   ;01 Sep 2011....mrhine
                         ,"Specialty_1||","Specialty_2||","Specialty_3||","Specialty_4||",
                         "Specialty_5||","Specialty_6||","Specialty_7||","Specialty_8||","Specialty_9||","Specialty_10||",
                         "Specialty_11||","Specialty_12||","Specialty_13||","Specialty_14|")
 
  col 0, docs->out_line
  row + 1
 
detail
for (idx = 1 to size(docs->qual,5))
col 0 docs->qual[idx].active_ind,'||',
col +0 docs->qual[idx].prsnl_id,'||',
col +0 docs->qual[idx].doc_id,'||',
col +0 docs->qual[idx].NPI,'||',
col +0 docs->qual[idx].fname,'||',
col +0 docs->qual[idx].mname,'||',
col +0 docs->qual[idx].lname,'||',
col +0 docs->qual[idx].name_title, '||',
col +0 docs->qual[idx]->addr1 , '||',
col +0 docs->qual[idx]->addr2 , '||',
col +0 docs->qual[idx]->city , '||',
col +0 docs->qual[idx]->state , '||',
col +0 docs->qual[idx]->state_cd ,'||',
col +0 docs->qual[idx]->zip , '||',
col +0 docs->qual[idx]->phone , '||',
col +0 docs->qual[idx]->beg_effective_dt_tm , '||',
col +0 docs->qual[idx]->end_effective_dt_tm , '||'
 
if (size(docs->qual[idx]->spec,5)>0)
   for (sdx = 1 to 14);size(docs->qual[idx]->spec,5))
     case (cnvtstring(sdx))
       of "1" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "2" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "3" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "4" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "5" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "6" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "7" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "8" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "9" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "10" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "11" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "12" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "13" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'||'
         else
         col +0 '||'
         endif
       of "14" :
         if (docs->qual[idx]->spec[sdx]->specialty not = "0")
         col +0 docs->qual[idx]->spec[sdx]->specialty,'|'
         else
         col +0 '|'
         endif
       endcase
   endfor
endif
 
row +1
endfor
with
     maxcol = 5000,
     formfeed = none,
     maxrow = 1,
     nocounter,
     format = variable
 
;****  BEGINNING OF POSTAMBLE ****
DECLARE LEN = I4
DECLARE dclcom = vc ;C255
DECLARE newdir = vc ;C255
 
set newdir = "$mhs_ops/"
set DCLCOM = concat("mkdir ",newdir,"humedica/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/"
set DCLCOM = concat("mkdir ",newdir,"cerner/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir ="$mhs_ops/humedica/cerner/"
set DCLCOM = concat("mkdir ",trim(newdir),"dictionaries/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/cerner/dictionaries/"
set DCLCOM = concat("mkdir ",trim(newdir),dir_date,"/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat(client_code,"_T",dirdt,"_E",edt,file_ext)
 
set newfile = concat(trim(newdir),dir_date,"/",outfile)
 
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
#exit_program
 
;****** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
;******************************************
 
end
go
 
