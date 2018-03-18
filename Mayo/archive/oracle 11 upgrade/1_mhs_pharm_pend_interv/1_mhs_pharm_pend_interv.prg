/****************************************************************************
Program:  1_mhs_pharm_pend_interv
Created Date:  06/2009
 
Description:  Displays all non-discharged patients that have a
Pharmacy Clinical Intervention PowerForm filled out and the Intervention
Status = Pending.
 
Modifications:
1-removed dummy table joins with outerjoins to increase efficiency
2-implemented suggestions from Akcia to make more efficient
3-see below
*****************************************************************************/
/***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 00/00/00 Unknown              Unknown                            *
 *001 10/20/11 Rob Banks            Modify to use DB2                  *
 *002 01/05/12 Phil Landry		    DTA format changed - pullind data  *
 *                                    from new table                   *
 *003 07/11/12 Akcia - SE			changes for efficiency for oracle upgrade
 ******************** End of Modification Log **************************/
drop program 1_mhs_pharm_pend_interv:dba go
create program 1_mhs_pharm_pend_interv:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Facility Group" = ""
 
with outdev, facility_grp
 
/*** START 001 ***/
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
;*** Write instance ccl ran in to the log file
;SET Iname = fillstring(10," ")
;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;  run_date = format(sysdate,";;q")
; ,Iname = substring(1,7,instance_name)
;FROM v$instance
;DETAIL
;  col  1 run_date
;  col +1 curprog
;  col +1 " *Instance="
;  col +1 Iname
;with nocounter
;   , format
;****************** End of INSTANCE 2 routine ************************
/*** END 001 ***/
 
set MaxSecs = 6000
 
; 12.09.09
declare census_cd = f8 with protect, constant(uar_get_code_by("MEANING", 339, "CENSUS"))
 
;002 start block
declare ocfcomp_cd  = f8 with public, Constant(uar_get_code_by("MEANING",120,'OCFCOMP'))
	declare iOutBuffLen = i4 with noconstant(32768),protect
	declare sOutBuffer = c32768 with noconstant(""),protect
	declare iUnCompressRetLen = i4 with noconstant(0),protect
	declare sBlobIn = c32768 with noconstant(""),protect
	declare BITMAP_CE_BLOB_RESULT  = i4 with constant(8),protect
 
;002 end block
/*003
record facilities
( 1 qual[*]
	2 facility_cd = f8
)
 
select into "nl:"
cv.* from code_value cv
plan cv where cv.code_set = 220 and cv.cdf_meaning = "FACILITY"
and cv.display_key = value(concat(trim($facility_grp,3),"*"))
 
head report
	f_cnt = 0
detail
	f_cnt = f_cnt + 1
	stat = alterlist(facilities->qual,f_cnt)
	facilities->qual[f_cnt].facility_cd = cv.code_value
 
with nocounter
003*/
declare num = i2
 
select  into  $outdev
pe.name_full_formatted,
c_event_disp = uar_get_code_display (c.event_cd),
c.event_tag,
c.verified_dt_tm,
p.name_full_formatted,
e.alias,
en_loc_facility_desc = uar_get_code_description (en.loc_facility_cd),
en_loc_building_desc = uar_get_code_description (en.loc_building_cd),
en_loc_nurse_unit_desc = uar_get_code_description (en.loc_nurse_unit_cd),
en_loc_room_desc = uar_get_code_description (en.loc_room_cd),
en_loc_bed_desc = uar_get_code_description (en.loc_bed_cd),
ce_event_disp = uar_get_code_display (ce.event_cd),
ce.event_tag,
cel_event_disp = uar_get_code_display (cel.event_cd),
cel.event_tag
 
 
from  
code_value cv,     ;003
clinical_event  c,
prsnl  p,
person  pe,
encntr_alias  e,
encounter  en,
 clinical_event  celi,
; dummyt  d1,
; dummyt  d2,
 clinical_event  ce,
 clinical_event  cel
; 12.09.09
,
nurse_unit nu,
encntr_domain ed 
,ce_blob_result cbr     						;002
,ce_blob ceb    								;002
 
 
/*plan  en
; 856 = discharged
where en.encntr_status_cd+0 != 856.00
and (expand(num, 1, size(facilities->qual,5), en.loc_facility_cd,
facilities->qual[num].facility_cd))*/
 
; 12.09.09

plan cv 															;003
where cv.code_set = 220 											;003
and cv.cdf_meaning = "FACILITY"										;003
and cv.display_key = value(concat(trim($facility_grp,3),"*"))		;003

;003  plan nu
;003  where (expand(num, 1, size(facilities->qual,5), nu.loc_facility_cd,facilities->qual[num].facility_cd))
join nu
where nu.loc_facility_cd = cv.code_value							;003
and nu.end_effective_dt_tm > sysdate
and nu.active_ind = 1
 
join ed
where ed.loc_nurse_unit_cd = nu.location_cd
  and ed.encntr_domain_type_cd = census_cd
  and ed.end_effective_dt_tm+0 > sysdate
  and ed.active_ind = 1
 
join en
where en.encntr_id = ed.encntr_id
; 856 = discharged
and en.encntr_status_cd != 856.00
 
join  e
; 1077 = fin nbr
where e.encntr_id=en.encntr_id and e.encntr_alias_type_cd= 1077
 
join pe
where pe.person_id=en.person_id and pe.name_last_key != "TESTPATIENT"
 
join  c
where c.encntr_id=en.encntr_id
; 26175664 = intervention type pharmacy
and c.event_cd= 26175664.00
; only pull in for the date rang((c.encntr_id=en.encntr_id) and e selected
;and (c.verified_dt_tm between (cnvtdatetime(beg_dt)) and (cnvtdatetime(end_dt) + 1))
and c.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
 
join  p
where p.person_id = c.verified_prsnl_id
 
join celi
; 26175685 = intervention status
where celi.parent_event_id=c.parent_event_id and celi.event_cd= 26175685.00  and celi.event_tag
= "Pending"
and celi.valid_until_dt_tm > cnvtdatetime("30-DEC-2100")
 
 
;join  d1
 
join ce
; 26175673 = clinical importance pharmacy
where ce.parent_event_id=outerjoin(c.parent_event_id) and ce.event_cd= outerjoin(26175673.00)
and ce.valid_until_dt_tm > outerjoin(cnvtdatetime("30-DEC-2100"))
 
 
;join  d2
 
join  cel
; 26175694 = pharmacy additional information
where cel.parent_event_id=outerjoin(c.parent_event_id) and cel.event_cd= outerjoin(26175694.00)
and cel.valid_until_dt_tm > outerjoin(cnvtdatetime("30-DEC-2100"))
 
join cbr																	;002
	where cbr.event_id = outerjoin(cel.event_id)   							;002
	  and cbr.valid_until_dt_tm > outerjoin(cnvtdatetime("30-DEC-2100"))	;002
join ceb																		;002
	where ceb.event_id = outerjoin(cel.event_id)								;002
	  and ceb.valid_until_dt_tm > outerjoin(cnvtdatetime("30-DEC-2100"))		;002
 
order by
 en_loc_facility_desc ,
 en_loc_building_desc ,
 en_loc_nurse_unit_desc ,
 en_loc_room_desc
 
 
; begin report display
 
head report
 m_numlines = 0 ,
 
;002 start
subroutine get_blob(event_id, sOutBuffer)
  blob_out = fillstring(32000," ")
  sOutBuffer = fillstring(32768, " ")
  if (ceb.compression_cd = ocfcomp_cd)
    blob_ret_len = 0
    sze = size(trim(ceb.blob_contents))
    call uar_ocf_uncompress(ceb.blob_contents,sze,blob_out,32000,blob_ret_len)
    stat = uar_rtf2(blob_out, textlen(trim(blob_out)),sOutBuffer, iOutBuffLen, 1)
 
 
  else
    sze = size(trim(ceb.blob_contents))
    blob_out = substring(1,sze-8,ceb.blob_contents)
    sOutBuffer = blob_out
  endif
end ;subroutine
,                  							;002 end block
 
 
subroutine   cclrtf_print  ( par_flag ,  par_xpixel ,  par_yoffset ,  par_numcol ,  par_blob ,
 par_bloblen ,  par_check  )
 m_output_buffer_len = 0  blob_out = fillstring ( 30000 ,  " " ) blob_buf = fillstring ( 200 ,  " "
) m_linefeed = concat ( char ( 10 )) numlines = 0  textindex = 0  numcol = par_numcol  whiteflag =
 0  yincrement = 12  yoffset = 0
 call uar_rtf ( par_blob ,  par_bloblen ,  blob_out ,  size ( blob_out ),  m_output_buffer_len ,
 par_flag ) m_output_buffer_len = minval ( m_output_buffer_len ,  size ( trim ( blob_out )))
if ( ( m_output_buffer_len > 0 ) )  m_cc = 1 ,
while (  m_cc )
 m_cc2 = findstring ( m_linefeed ,  blob_out ,  m_cc )
if (  m_cc2  )  blob_len =( m_cc2 - m_cc ),
if ( ( blob_len <= par_numcol ) )  m_blob_buf = substring ( m_cc ,  blob_len ,  blob_out ),
 yoffset =( y_pos + par_yoffset ),
if (  par_check  )
 call print ( calcpos ( par_xpixel ,  yoffset )),
 call print ( trim ( check ( m_blob_buf )))
else
 call print ( calcpos ( par_xpixel ,  yoffset )),
 call print ( trim ( m_blob_buf ))
endif
,  par_yoffset =( par_yoffset + yincrement ),  numlines =( numlines + 1 ),  row + 1
else   m_blobbuf = substring ( m_cc ,  blob_len ,  blob_out ),
 call cclrtf_printline ( par_numcol ,  blob_out ,  blob_len ,  par_check )
endif
,
if ( ( m_cc2 >= m_output_buffer_len ) )  m_cc = 0
else   m_cc =( m_cc2 + 1 )
endif
 
else   blob_len =(( m_output_buffer_len - m_cc )+ 1 ),  m_blobbuf = substring ( m_cc ,  blob_len ,
 blob_out ),
 call cclrtf_printline ( par_numcol ,  blob_out ,  blob_len ,  par_check ),  m_cc = 0
endif
 
 
endwhile
 
endif
 m_numlines = numlines
 
end ;subroutine
,
 
subroutine   cclrtf_printline  ( par_numcol ,  blob_out ,  blob_len ,  par_check  )
 textindex = 0  numcol = par_numcol  whiteflag = 0  printcol = 0  rownum = 0  lastline = 0
 m_linefeed = concat ( char ( 10 ))
while ( ( blob_len > 0 ))
 
if ( ( blob_len <= par_numcol ) )  numcol = blob_len ,  lastline = 1
endif
 textindex =( m_cc + par_numcol )
if ( ( lastline = 0 ) )  whiteflag = 0 ,
while ( ( whiteflag = 0 ))
 
if (  (( ( substring ( textindex ,  1 ,  blob_out )= " " ) )  or  (( substring ( textindex ,  1 ,
 blob_out )= m_linefeed ) ))  )  whiteflag = 1
else   textindex =( textindex - 1 )
endif
 
if (  (( ( textindex = m_cc ) )  or  (( textindex = 0 ) ))  )  textindex =( m_cc + par_numcol ),
 whiteflag = 1
endif
 
 
endwhile
,  numcol =(( textindex - m_cc )+ 1 )
endif
 m_blob_buf = substring ( m_cc ,  numcol ,  blob_out )
if ( ( m_blob_buf > " " ) )  numlines =( numlines + 1 ),  yoffset =( y_pos + par_yoffset ),
if (  par_check  )
 call print ( calcpos ( par_xpixel ,  yoffset )),
 call print ( trim ( check ( m_blob_buf )))
else
 call print ( calcpos ( par_xpixel ,  yoffset )),
 call print ( trim ( m_blob_buf ))
endif
,  par_yoffset =( par_yoffset + yincrement ),  row + 1
else   blob_len = 0
endif
 m_cc =( m_cc + numcol )
if ( ( blob_len > numcol ) )  blob_len =( blob_len - numcol )
else   blob_len = 0
endif
 
 
endwhile
 
 
end ;subroutine
,
 y_pos = 18 ,
 
subroutine   offset  ( yval  )
 
 call print ( format (( y_pos + yval ),  "###" ))
 
end ;subroutine
 
head page
 y_pos = 36
head  en_loc_nurse_unit_desc
 
if ( (( y_pos + 114 )>= 792 ) )  y_pos = 0 , break
endif
, y_pos =( y_pos + 24 ), row + 1 , "{f/9}{cpi/11}" ,
 call print ( calcpos ( 245 , ( y_pos + 0 ))), "Pending Interventions" , row + 1 , row + 1 ,
 "{cpi/12}" , row + 1 ,
 call print ( calcpos ( 20 , ( y_pos + 31 ))), en_loc_nurse_unit_desc , row + 1 , row + 1 , y_val =(
( 792 - y_pos )- 59 ), "{ps/newpath 1 setlinewidth   20 " , y_val , " moveto  592 " , y_val ,
 " lineto stroke 20 " , y_val , " moveto/}" , row + 1 , y_pos =( y_pos + 61 )
detail
 
if ( (( y_pos + 194 )>= 792 ) )  y_pos = 0 , break
endif
,
 row + 1 ,
 "{f/9}{cpi/15}" ,
 
 call print ( calcpos ( 20 , ( y_pos + 0 ))),
 "Room/Bed" ,
 
 call print ( calcpos ( 90 , ( y_pos + 0 ))),
 "Fin Number" ,
 
 call print ( calcpos ( 144 , ( y_pos + 0 ))),
 "Patient Name" ,
 
 call print ( calcpos ( 306 , ( y_pos + 0 ))),
 "Intervention Signed By" ,
 
 call print ( calcpos ( 468 , ( y_pos + 0 ))),
 "Date" ,
 row + 1 ,
 alias1 = substring ( 1 ,  10 , e.alias),
 name_full_formatted1 = substring ( 1 ,  30 , pe.name_full_formatted),
 name_full_formatted2 = substring ( 1 ,  30 , p.name_full_formatted),
 row + 1 ,
 
 call print ( calcpos ( 20 , ( y_pos + 18 ))),
 en_loc_room_desc ,
 row + 1 ,
 
  call print ( calcpos ( 45 , ( y_pos + 18 ))),
 en_loc_bed_desc ,
 row + 1 ,
 
 
 call print ( calcpos ( 90 , ( y_pos + 18 ))),
 alias1 ,
 
 call print ( calcpos ( 144 , ( y_pos + 18 ))),
 name_full_formatted1 ,
 
 call print ( calcpos ( 306 , ( y_pos + 18 ))),
 name_full_formatted2 ,
 
 call print ( calcpos ( 468 , ( y_pos + 18 ))),
c.verified_dt_tm,
 row + 1 ,
 event_tag1 = substring ( 1 ,  75 , c.event_tag),
 row + 1 ,
 "{f/8}" ,
 
 call print ( calcpos ( 72 , ( y_pos + 54 ))),
 "Intervention Type" ,
 
 call print ( calcpos ( 180 , ( y_pos + 54 ))),
 event_tag1 ,
 row + 1 ,
 event_tag2 = substring ( 1 ,  75 , ce.event_tag),
 
 call print ( calcpos ( 72 , ( y_pos + 72 ))),
 "Clinical Importance" ,
 row + 1 ,
 
 call print ( calcpos ( 180 , ( y_pos + 72 ))),
 event_tag2 ,
 row + 1 ,
 
 if (ceb.event_id > 0)								;002
    call get_blob(ceb.event_id, sOutBuffer)			;002
 else												;002
     sOutBuffer = cel.event_tag					;002
 endif												;002
 
 call print ( calcpos ( 72 , ( y_pos + 90 ))),
 "Additional Information" ,
 
;002 call cclrtf_print ( 0 ,  180 ,  90 ,  75 , cel.event_tag,  255 ,  1 ),
 call cclrtf_print ( 0 ,  180 ,  90 ,  75 , sOutBuffer,  255 ,  1 ),  ;002
 y_pos =( y_pos +( m_numlines * 12 )),
 row + 1 ,
 row + 1 ,
 y_val =(( 792 - y_pos )- 118 ),
 "{ps/newpath 1 setlinewidth   19 " ,
 y_val ,
 " moveto  590 " ,
 y_val ,
 " lineto stroke 19 " ,
 y_val ,
 " moveto/}" ,
 y_pos =( y_pos + 111 )
foot   en_loc_nurse_unit_desc
break
foot page
 y_pos = 727 ,
 row + 1 ,
 "{f/0}{cpi/15}" ,
 
 call print ( calcpos ( 20 , ( y_pos + 0 ))),
 "Pending Interventions, page:" ,
 row + 1 ,
 
 call print ( calcpos ( 149 , ( y_pos + 0 ))),
 curpage ,
 row + 1 ,
 
 call print ( calcpos ( 383 , ( y_pos + 0 ))),
 "Run Date:" ,
 row + 1 ,
 
 call print ( calcpos ( 437 , ( y_pos + 0 ))),
 curdate ,
 row + 1 ,
 
 call print ( calcpos ( 491 , ( y_pos + 0 ))),
 "Run Time:" ,
 row + 1 ,
 
 call print ( calcpos ( 545 , ( y_pos + 0 ))),
 curtime
 
; end report display
 
with  maxcol = 300 , maxrow = 500 , dio = 08 , /*dontcare = ce , dontcare = cel , outerjoin = d1 ,
 outerjoin = d2 ,*/ noheading , format = variable, time = value( MaxSecs )
 
/*** START 001 ***/
;*** After report put back to instance 1
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
/*** END 001 ***/
 
end
go
