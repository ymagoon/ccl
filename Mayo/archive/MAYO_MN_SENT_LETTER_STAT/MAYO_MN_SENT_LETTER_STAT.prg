drop program MAYO_MN_Sent_Letter_Stat go
create program MAYO_MN_Sent_Letter_Stat
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start Date (Sent Date)" = "CURDATE"
	, "End Date (Sent Date)" = "CURDATE"
 
with OUTDEV, start_dt_tm, end_dt_tm
 
free record data_rec
record data_rec (
  1 rec_count = i4
  1 list [*]
    2 sent_dt_tm = vc
    2 generated_dt_tm = vc
    2 method_flag = i4
    2 method = vc
    2 Program_id = f8
    2 Program_name = vc
    2 source = vc
    2 status_flag = i4
    2 status = vc
    2 pat_name = vc
    2 pat_id = f8
   ; 2 mrn = vc
)
 
 
declare ctr = i4 with public
;declare MRN_CD = f8 with constant(uar_get_code_by("MEANING",4,"MRN")),public
select into "nl:"
from INVTN_COMMUNICATION IC
,INVTN_PROGRAM  IP
,PERSON p
;,PERSON_ALIAS PA
, hm_expect_sat hes
plan IC
	where IC.sent_dt_tm>= cnvtdatetime(cnvtdate2($start_dt_tm,"MM/DD/YY"), 0)
	and IC.sent_dt_tm <= cnvtdatetime(cnvtdate2($end_dt_tm,"MM/DD/YY"), 2359)
join IP
	where IP.program_id = IC.program_id
join p
	where p.person_id = IC.person_id
join hes
	where hes.satisfier_meaning = outerjoin(ip.source_meaning)
;join pa
;	where pa.person_id = outerjoin(p.person_id)
;		and pa.active_ind = outerjoin(1)
;		and pa.person_alias_type_cd = outerjoin(MRN_CD)
order by IC.sent_dt_tm,IC.generated_dt_tm
head report
stat = alterlist(data_rec->list,100)
detail
ctr = ctr+1
if(mod(ctr,100)=1)
	stat = alterlist(data_rec->list,ctr+99)
endif
data_rec->list[ctr]->generated_dt_tm = format(IC.generated_dt_tm,"mm/dd/yyyy hh:mm:ss;;Q")
data_rec->list[ctr]->sent_dt_tm = format(IC.sent_dt_tm,"mm/dd/yyyy hh:mm:ss;;Q")
data_rec->list[ctr]->pat_id = IC.person_id
data_rec->list[ctr]->Program_id = IC.program_id
data_rec->list[ctr]->Program_name =IP.program_name
if(textlen(hes.expect_sat_name)=0)
	data_rec->list[ctr]->source = IP.source_meaning
else
	data_rec->list[ctr]->source = hes.expect_sat_name
endif
data_rec->list[ctr]->method_flag = IC.method_flag
if(data_rec->list[ctr]->method_flag = 0)
	data_rec->list[ctr]->method = "Printed Letter"
elseif(data_rec->list[ctr]->method_flag = 1)
	data_rec->list[ctr]->method = "atient Portal"
endif
data_rec->list[ctr]->status_flag = IC.status_flag
if(data_rec->list[ctr]->status_flag = 4)
	data_rec->list[ctr]->status = "Sent"
elseif(data_rec->list[ctr]->status_flag = 5)
	data_rec->list[ctr]->status = "Re-sent"
endif
data_rec->list[ctr]->pat_name = p.name_full_formatted
;data_rec->list[ctr]->mrn = cnvtalias(pa.alias,pa.alias_pool_cd)
foot report
stat = alterlist(data_rec->list,ctr)
data_rec->rec_count = ctr
with nocounter,expand = 1
 
/*Display*/
 
SELECT into $outdev
	SENT_DT_TM = SUBSTRING(1, 30, DATA_REC->list[D1.SEQ].sent_dt_tm)
	, GENERATED_DT_TM = SUBSTRING(1, 30, DATA_REC->list[D1.SEQ].generated_dt_tm)
	, METHOD = SUBSTRING(1, 30, DATA_REC->list[D1.SEQ].method)
	, PROGRAM_NAME = SUBSTRING(1, 30, DATA_REC->list[D1.SEQ].Program_name)
	, SOURCE_DETAILS= SUBSTRING(1, 30, DATA_REC->list[D1.SEQ].source)
	, STATUS = SUBSTRING(1, 30, DATA_REC->list[D1.SEQ].status)
	, PAT_ID = DATA_REC->list[D1.SEQ].pat_id
	, PAT_Name = DATA_REC->list[D1.SEQ].pat_name
	;, MRN = SUBSTRING(1, 30, DATA_REC->list[D1.SEQ].mrn)
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(DATA_REC->list, 5)))
 
PLAN D1
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
 
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
 
end
go
 
