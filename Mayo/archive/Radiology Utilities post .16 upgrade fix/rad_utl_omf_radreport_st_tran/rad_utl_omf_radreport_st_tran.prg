drop program rad_utl_omf_radreport_st_tran go
create program rad_utl_omf_radreport_st_tran

declare lCnt = i4 with protect, noconstant(0)
declare lIter = i4 with protect, noconstant(0)
declare dReportID = f8 with protect, noconstant(0.00)
declare lStat = i4 with protect, noconstant(0)
declare sErrMsg = vc with noconstant("")

subroutine omf_build_dt_nbr(i_dt_tm)
/******************************************************************************
construct foriegn key to omf_date table
******************************************************************************/
if (i_dt_tm = NULL or i_dt_tm = 0)
return(NULL)
else
set temp_dt_nbr = cnvtdate(i_dt_tm)
;call dt_nbr_check(temp_dt_nbr) ;insure temp_dt_nbr exists in omf_date
return(temp_dt_nbr)
endif
end
/******************************************************************************
end build_omf_dt_nbr
******************************************************************************/


subroutine omf_build_min_nbr(i_dt_tm)
/******************************************************************************
construct foriegn key to omf_time table
******************************************************************************/
if (i_dt_tm = NULL or i_dt_tm = 0)
return(NULL)
else
set temp_min_nbr = cnvtmin(cnvtint(format(i_dt_tm,"HHMM;1;M"))) + 1
return(temp_min_nbr)
endif
end
/******************************************************************************
end build_omf_min_nbr
******************************************************************************/

free record rad_report
record rad_report
(
1 array[*]
2 dOrderID = f8
2 dReportID = f8
2 lSequence = i4
2 dTranscriptionistID = f8
2 dRadiologistID = f8
2 dResidentID = f8
2 dProxyID = f8
2 dtTransDtTm = c25
2 lTransDtNbr = i4
2 lTransMinNbr = i4
2 lTransDtTz = i4
2 dtFinalDtTm = c25
2 lFinalDtNbr = i4
2 lFinalMinNbr = i4
2 lFinalDtTz = i4
2 dtDictatedDtTm = c25
2 lDictatedDtNbr = i4
2 lDictatedMinNbr = i4
2 lDictatedDtTz = i4
2 update_ind  = i2
)
set tmp_cnt = 0

;Get the last report_ID for the selected order (which is also parent order only in case of linked orders)
select into "nl:"
r.rad_report_id
from rad_report r
where 

r.original_trans_dt_tm between  cnvtdatetime("07-FEB-2013 00:00:00") and cnvtdatetime("28-FEB-2013 23:59:59") and     
 

r.sequence = 1 and
r.order_id > 0

order by r.rad_report_id desc, r.sequence desc
detail
tmp_cnt = tmp_cnt + 1
lStat = alterlist(rad_report->array,tmp_cnt)

	rad_report->array[tmp_cnt]->dOrderID = r.order_id
	rad_report->array[tmp_cnt]->dReportID = r.rad_report_id
	If (r.addendum_ind != null)
	rad_report->array[tmp_cnt]->lSequence = r.addendum_ind ;Set the corresponding value
	else
	rad_report->array[tmp_cnt]->lSequence = 0 ;By default fill all the null rows as 0
	endif


with nocounter ;Always picking the last report

;call echo(build("RecordReportInfo:: Order being processed is :",rad_report->array[tmp_cnt]->dOrderID))
;call echo(build("RecordReportInfo:: Last report ID derived is :",rad_report->array[tmp_cnt]->dReportID))
call echo(build("Number of reports being processed :",size(rad_report->array, 5)))

if (size(rad_report->array, 5) > 0)

	select into "nl:"
	r.order_id, r.rad_report_id,rp.prsnl_relation_flag, rp.report_prsnl_id
	, r.original_trans_dt_tm, r.original_trans_tz
	,r.original_trans_dt_tm, r.original_trans_tz
	,r.final_dt_tm,r.final_tz
	, rp.updt_applctx ,rp.updt_task , rp.updt_id
	from rad_report r, rad_report_prsnl rp,
	(dummyt d with seq = value(size(rad_report->array, 5)))
	plan d
	join r
	where r.order_id = rad_report->array[d.seq]->dOrderID
	and r.rad_report_id = rad_report->array[d.seq]->dReportID
	join rp
	where
	r.rad_report_id = rp.rad_report_id

	detail
	call echo("RecordReportInfo: In detail section and loading the report details")
	if(rp.prsnl_relation_flag = 0) ;Transcriptionist
	rad_report->array[d.seq]->dTranscriptionistID = rp.report_prsnl_id
	elseif(rp.prsnl_relation_flag = 1) ;Resident
	rad_report->array[d.seq]->dResidentID = rp.report_prsnl_id
	elseif(rp.prsnl_relation_flag = 2) ;Radiologist
	rad_report->array[d.seq]->dRadiologistID = rp.report_prsnl_id
	elseif(rp.prsnl_relation_flag = 4) ;Proxy
	rad_report->array[d.seq]->dProxyID = rp.report_prsnl_id
	endif

	rad_report->array[d.seq]->dtTransDtTm = format(r.original_trans_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
	rad_report->array[d.seq]->lTransDtTz = r.original_trans_tz

	rad_report->array[d.seq]->dtFinalDtTm = format(r.final_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
	rad_report->array[d.seq]->lFinalDtTz = r.final_tz

	rad_report->array[d.seq]->dtDictatedDtTm = format(r.dictated_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
	rad_report->array[d.seq]->lDictatedDtTz = r.dictated_tz

	with nocounter


	set lCnt = size(rad_report->array,5)

	;Set the date number, minute number
	for(lIter = 1 to lCnt)
	if(trim(rad_report->array[lIter]->dtTransDtTm) > ' ')
	set rad_report->array[lIter]->lTransDtNbr = omf_build_dt_nbr(cnvtdatetime(rad_report->array[lIter]->dtTransDtTm))
	set rad_report->array[lIter]->lTransMinNbr = omf_build_min_nbr(cnvtdatetime(rad_report->array[lIter]->dtTransDtTm))
	endif
	if(trim(rad_report->array[lIter]->dtFinalDtTm) > ' ')
	set rad_report->array[lIter]->lFinalDtNbr = omf_build_dt_nbr(cnvtdatetime(rad_report->array[lIter]->dtFinalDtTm))
	set rad_report->array[lIter]->lFinalMinNbr = omf_build_min_nbr(cnvtdatetime(rad_report->array[lIter]->dtFinalDtTm))
	endif
	if(trim(rad_report->array[lIter]->dtDictatedDtTm) > ' ')
	set rad_report->array[lIter]->lDictatedDtNbr = omf_build_dt_nbr(cnvtdatetime(rad_report->array[lIter]->dtDictatedDtTm))
	set rad_report->array[lIter]->lDictatedMinNbr = omf_build_min_nbr(cnvtdatetime(rad_report->array[lIter]->dtDictatedDtTm))
	endif
	endfor

;Begin logging records to be deleted JTW
;Header rows
                select into "/cerner/ops_share/mhcrt/rad_utl_omf_radreport_st_tran_DEL_LOG.dat"
                        "TranscriptionistID",
                        "ResidentID",
                        "RadiologistID",
                        "ProxyID",
                        "TransDtTm",
                        "FinalDtTm",
                        "DictatedDtTm"
                from
                (dummyt d)
                With separator = "|", format

;records
                select into "/cerner/ops_share/mhcrt/rad_utl_omf_radreport_st_tran_DEL_LOG.dat"
                        rad_report->array[d.seq]->dTranscriptionistID,
                        rad_report->array[d.seq]->dResidentID,
                        rad_report->array[d.seq]->dRadiologistID,
                        rad_report->array[d.seq]->dProxyID,
                        rad_report->array[d.seq]->dtTransDtTm,
                        rad_report->array[d.seq]->dtFinalDtTm,
                        rad_report->array[d.seq]->dtDictatedDtTm
                from
                (dummyt d with seq = size(rad_report->array,5))
                With separator = "|", format, append

;End logging records to be deleted JTW


	delete  from  OMF_RADREPORT_ST omf2,
	(dummyt d with seq = value(size(rad_report->array,5)))
	set omf2.seq = 1
	plan d
	join omf2 where
	omf2.order_id = rad_report->array[d.seq]->dOrderID
	and omf2.rad_report_id = rad_report->array[d.seq]->dReportID
	with nocounter

commit


	insert from OMF_RADREPORT_ST omf2,
	(dummyt d with seq = value(size(rad_report->array,5)))
	set omf2.OMF_RADREPORT_ST_ID = seq(omf_seq, nextval),
	omf2.RAD_REPORT_ID = rad_report->array[d.seq]->dReportID,
	omf2.order_id =  rad_report->array[d.seq]->dOrderID,
	omf2.TRANSCRIPTIONIST_ID = rad_report->array[d.seq]->dTranscriptionistID,
	omf2.RADIOLOGIST_ID = rad_report->array[d.seq]->dRadiologistID,
	omf2.RESIDENT_ID = rad_report->array[d.seq]->dResidentID,
	omf2.PROXY_ID = rad_report->array[d.seq]->dProxyID,
	omf2.TRANSCRIBE_DT_TM = cnvtdatetime(rad_report->array[d.seq]->dtTransDtTm),
	omf2.TRANSCRIBE_DT_NBR = rad_report->array[d.seq]->lTransDtNbr,
	omf2.TRANSCRIBE_MIN_NBR = rad_report->array[d.seq]->lTransMinNbr,
	omf2.TRANSCRIBE_TZ = rad_report->array[d.seq]->lTransDtTz,
	omf2.REPORT_STATUS_FLAG =	rad_report->array[d.seq]->lSequence,
	omf2.PROXY_ID = rad_report->array[d.seq]->dProxyID,
	omf2.FINAL_DT_TM = cnvtdatetime(rad_report->array[d.seq]->dtFinalDtTm),
	omf2.FINAL_DT_NBR = rad_report->array[d.seq]->lFinalDtNbr,
	omf2.FINAL_MIN_NBR = rad_report->array[d.seq]->lFinalMinNbr,
	omf2.FINAL_TZ = rad_report->array[d.seq]->lFinalDtTz,
	omf2.DICTATE_DT_TM = cnvtdatetime(rad_report->array[d.seq]->dtDictatedDtTm),
	omf2.DICTATE_DT_NBR = rad_report->array[d.seq]->lDictatedDtNbr,
	omf2.DICTATE_MIN_NBR = rad_report->array[d.seq]->lDictatedMinNbr,
	omf2.DICTATE_TZ = rad_report->array[d.seq]->lDictatedDtTz,
	omf2.updt_dt_tm = cnvtdatetime(curdate, curtime3),
	omf2.updt_id = 9319490, ;JTW
	omf2.updt_task = 2100013, ;JTW
	omf2.updt_applctx = 888.51250, ;JTW
	omf2.updt_cnt = omf2.updt_cnt + 1 ;JTW
	plan d where 
	rad_report->array[d.seq]->update_ind = 0

	join omf2
	with nocounter
commit


	;Verify if any error occurred while inserting
	if ((error(sErrMsg, 0) > 0) OR curqual = 0)
	call echo("RecordReportInfo: Error occurred while inserting")
	endif

	call echo(build2("RecordReportInfo: Inserted ", build(curqual), " row(s) on omf radreport"))

else
call echo("There are no rows qualified to update")
endif

	free record rad_report

	call echo("RecordReportInfo: Exiting the method")

	;009 END

	END GO


