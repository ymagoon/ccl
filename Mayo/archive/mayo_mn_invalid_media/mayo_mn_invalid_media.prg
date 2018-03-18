;Patient Identifiers:
;Gratz, Norman   MRN  MO2004071       Visit 10/20/11
; MRN, media type, volume number, and  chart tracking id.
drop program mayo_mn_invalid_media go
create program mayo_mn_invalid_media
 
prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Media Type" = 0 

with OUTDEV, media_type
 
 
 
 
select into $outdev
 ;count(*)
;MM.*
 
	pat_name = substring(1,50,p.name_full_formatted)
	,mrn = cnvtalias(pa.alias,pa.alias_pool_cd)
	,media_type= uar_get_code_display(mm.media_type_cd)
	,volume_nbr = mm.volume_nbr
	,chart_tracking_id = trim(mma.alias_str)
 
/*
;mma.alias,
mma.alias_str
;,mma.alias_type_cd
;,type = uar_get_code_display(mma.alias_type_cd)
 
,mm.current_loc_cd
,cur_loc = uar_get_code_display(mm.current_loc_cd)
,mm.permanent_loc_cd
,mm.updt_cnt
;,mm.*
*/
from media_master mm
,media_master_alias mma
,person p
,person_alias pa
 
plan mm
where mm.create_prsnl_id < 0
and mm.active_ind = 1
and mm.media_type_cd = $media_type
;and mm.create_dt_tm+0 ;between cnvtdatetime(cnvtdate(02122011),0)
;   <= cnvtdatetime(cnvtdate(02122011),235959)
and mm.updt_id < 0
;order by  mm.create_dt_tm
 
join mma
where mma.media_master_id = mm.media_master_id
 
join p
where p.person_id = mm.person_id
join pa
	where pa.person_id = p.person_id
	and pa.active_ind = 1
	and pa.person_alias_type_cd = 10
	and pa.end_effective_dt_tm > sysdate
 
order by p.name_full_formatted
 
head report
 D_line = fillstring(131,"-")
 col 0 "Invalid Media Report"
 row +1
 col 0 curdate row +1
head page
 col 0 D_line row + 1
 col 0 "Patient Name"
 col 55 "MRN"
 col 69 "Media Type"
 col 82 "volume Number"
 col 98 "Chart Tracking ID"
 row + 1
 col 0 D_line row + 1
 
detail
disp_mrn = substring(1,18,trim(mrn))
disp_trk_size = size(trim(mma.alias_str,3))
disp_trk = substring(1,30,trim(mma.alias_str,3))
	 col 0 pat_name
	 col 52 disp_mrn
	 col 69 media_type
	 col 78 volume_nbr
	 col 101 disp_trk
	 row + 1
foot page
row + 2
col 0 "Page:" col + 1 curpage row + 1
 
with  maxrec = 50,
maxcol = 132
 
 
 
 
 
 end
 go
