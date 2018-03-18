/* 	*******************************************************************************
 
	Script Name:	pfi_study_correction_email.prg
	Description:	Once a study correction request is subbmited by the end user
					pfi_study_correction_email will be executed which will send an
					email to all administrators notifying them of the request.
 
	Date Written:	March 17, 2015
	Written By:		Yitzhak Magoon
					Pfizer
 
	Executed from:	Explorer Menu
 
	*******************************************************************************
								REVISION INFORMATION
	*******************************************************************************
	Rev	Date		By			Comment
	---	-----------	-----------	---------------------------------------------------
 
	******************************************************************************* */
 
drop program pfi_study_correction_email go
create program pfi_study_correction_email
 
;set filenames
set filename = concat('cer_temp:scr_',format(curdate,'yyyymmdd;;d'),".csv")
set shortname = concat('scr_',format(curdate,'yyyymmdd;;d'),".csv")
set fullTempDir = "/cerner/d_p576/temp"
declare body = vc
declare msg = vc
declare bCnt = i2
;set body = concat("'", "The following study corrections are ready to be reviewed: ", char(13), char(13), "'")
set body = "'The following study correction requests are ready to be reviewed: "
 
;create file with the correction # and the request user
select distinct into "nl:" ;value(filename)
	correction_number = trim(cnvtstring(scr.group_id))
	, request_user = trim(p.name_full_formatted)
from
	study_correction_request scr
	, person p
plan scr where scr.active_ind = 1
join p where p.person_id = scr.request_user_id
order by
	scr.group_id
head report
	bCnt = 0
 
	;msg = concat ("Corr #","         ", "Requested By", char(13))
detail
	bCnt = bCnt + 1 ;cnt prevents "," from printing in email
	if (bCnt = 1)
		;msg = concat(msg, correction_number, "  ", request_user)
		msg = concat(correction_number)
	else
		;msg = concat(msg, char(13), correction_number, "  ", request_user)
		msg = concat(msg, ",", correction_number)
	endif
foot report
	row + 0
with maxcol = 500, format = pcformat, separator = ",", heading, format, nullreport
 
set msg = trim(msg)
set body = concat(body, msg, "'")
;call echo (msg)
call echo (body)
;char(13) = carriage return
;set body = concat("'", "The following study corrections are ready to be reviewed: ", char(13), char(13), body, "'")
set mailStatus = 0
 
 
declare FilePath = vc
declare subject = vc
declare emailaddrs = vc
 
;build email address, file path and email subject
set emailaddrs = build2("DL-CernerSupport@pfizer.com");DL-CernerSupport@pfizer.com")
 
set FilePath = replace(FileName, 'cer_temp:', fullTempDir)
set subject = "'Study Correction Request'"
 
call echo(build2('echo ', body, ' | mail -s ', subject," ",emailaddrs))
 
set mailCmd2 = build2('echo ', body, ' | mail -s ', subject, " ",emailaddrs)
 call echo(size(mailCmd2))
;call echo(size(mailCmd2))
 
call dcl(mailCmd2,size(mailCmd2),mailStatus) ;send email address
 
set syscmd = build2("rm ", FilePath)
 
call dcl(syscmd, size(syscmd), mailStatus) ;remove temp file
 
end
go
 
