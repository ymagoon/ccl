/* 	*******************************************************************************
 
	Script Name:	pfi_accn_per_protocol.prg
	Description:	Outputs a report of accession numbers per protocol.
 
	Date Written:	12-Jan-2009
	Written By:		Yitzhak Magoon
 
	Executed from:	Explorer Menu
 
	*******************************************************************************
								REVISION INFORMATION
	*******************************************************************************
	Rev	Date		By				Comment
	---	-----------	---------------	---------------------------------------------------
	1.0 12-Jan-1009 Boone, Tracey	Initial release.
	2.0	17-Sep-2009	Boone, Nicholas	Updated to include Subject ID field on Report output
	2.1 19-Jul-2010	Boone, Nicholas Updated to include Unique ID, changed format,
									introduced filter and data extract option.
	2.2	25-Jan-2013 Boone, Nicholas	Updated filter to exclude VMRD protocols.
	2.3	16-Oct-2014	Boone, Nicholas	Updated to include date filter.
 	2.4 7/13/2015   Magoon, Yitzhak Modified alias pool to include the Pfizer ID
 									pool used for AWMS # (new MRN)
 	005 10/24/2016	Magoon, Yitzhak	Updating report to filter on TRUE collection dt/tm
 									not orig_order_dt_tm
	******************************************************************************* */
 
DROP PROGRAM pfi_accn_per_protocol_v2_5 GO
CREATE PROGRAM pfi_accn_per_protocol_v2_5
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	;<<hidden>>"Enter all or part of the study protocol name" = ""
	, "Protocol" = 0
	, "Select the orderable(s) to filter on" = ""
	, "Subject ID" = ""
	, "Select the timepoint(s) to filter on" = ""
	, "Apply a date range to the query? (date orders placed)" = "0"               ;* The date range is to be used when the samples
	, "Enter the expected date range" = "SYSDATE"                                 ;* The date range is to be used when the samples
	, "prompt1" = "SYSDATE"                                                       ;* The date range is to be used when the samples
	, "Apply an expected date range to the query? (scheduled collection)" = "0"   ;* The date range is to be used BEFORE the sampl
	, "Enter the expected date range" = "SYSDATE"                                 ;* The date range is to be used BEFORE the sampl
	, "prompt3" = "SYSDATE"                                                       ;* The date range is to be used BEFORE the sampl
	, "Select the Report Type" = ""
 
with OUTDEV, PROTOCOL, ORDERABLE, subjectid, TIMEPOINT, DATE_RANGE, FROM_DT, TO_DT,
	exp_date_range, exp_from_dt, exp_to_dt, REPORT_TYPE
 
/**************************************************************
; DECLARED VARIABLES AND RECORDS
**************************************************************/
DECLARE cUSER 			= c50
DECLARE cPROTOCOL 		= c100
DECLARE vPROTOCOL 		= f8
DECLARE cPRINT_DATE 	= c25
DECLARE strngHldr 		= vc with noconstant("")
DECLARE dbNme 			= vc with noconstant("")
SET dbNme 				= currdbname
declare alias_pool_temp = f8 ;2.4
declare prev_pid		= f8 ;2.4
declare prev_oid		= f8 ;2.4
declare pfiID 			= f8 ;2.4
declare flip			= i2
set pfiID 				= uar_get_code_by("DISPLAYKEY", 263, "PFIZERIDPOOL") ;2.4
 
SET cvFIN_NBR = UAR_GET_CODE_BY("MEANING", 319, "FIN NBR")
SET cvMRN = UAR_GET_CODE_BY("MEANING",4,"MRN")
SET cvCANCELED = UAR_GET_CODE_BY("MEANING",6004,"CANCELED")
SET cvTATTOO = UAR_GET_CODE_BY("DISPLAY",263,"Volunteer/Tattoo Pool")
SET cvDISC_MRN = UAR_GET_CODE_BY("DISPLAY",263,"Discovery MRN Pool")
 
RECORD rDATA (
	1 DATA[*]
		2 ACCESSION				= c11
		2 ACCESSION_2			= c9
		2 UNIQUE_ID				= c20
		2 tattoo				= c20 ;2.4
		2 SUBJECT_ID			= c20
		2 SUBJECT_INDEX			= i4
		2 TEST					= c30
		2 ORDER_ID				= f8
		2 TIMEPOINT				= c12
		2 COLLECTION_DT_TM		= c20
	1 COUNT						= i4
)
 
; Call program to retrieve the study protocol (cPROTOCOL)
; and username (cUSER)
SET vPROTOCOL = CNVTREAL($PROTOCOL)
EXECUTE mod_pfiz_protocol_and_user
 
/**************************************************************
; Define the date range
**************************************************************/
IF ($DATE_RANGE = "1")
	SET vFROM_DT = $FROM_DT
	SET vTO_DT = $TO_DT
ELSE
	SET vFROM_DT = BUILD("01-JAN-2005")
	SET vTO_DT = BUILD("01-SEP-2099")
ENDIF
 
;begin 005
if ($exp_date_range = "1")
  set exp_from_dt = $exp_from_dt
  set exp_to_dt = $exp_to_dt
else
  set exp_from_dt = build("01-JAN-2005")
  set exp_to_dt = build("01-DEC-2100")
endif
 
set date_range = $date_range
set exp_date_range = $exp_date_range
;end 005
 
/*****************************************
; Main select
*****************************************/
SELECT
  if ($exp_date_range = "1")
PLAN A
join ca																	;005
  where ca.accession_id = a.accession_id								;005
join c 																	;005
  where c.container_id = ca.container_id								;005
;    and c.drawn_dt_tm between cnvtdatetime(exp_from_dt)					;005
;    and cnvtdatetime(exp_to_dt)											;005
JOIN O where a.order_id = o.order_id
	and o.order_status_cd != cvCANCELED
	and o.current_start_dt_tm between cnvtdatetime(exp_from_dt)				;005
	and cnvtdatetime(exp_to_dt)												;005
JOIN OD where o.order_id = od.order_id
	and od.oe_field_id = 12785
    and od.oe_field_display_value in ($TIMEPOINT)
JOIN P where o.person_id = p.person_id
	;introduction of new alias pool will require logic in the report writer section to differentiate the true unique id
	and p.alias_pool_cd IN (cvTATTOO, cvDISC_MRN, pfiID) ;2.4
	and p.active_ind = 1
	and p.end_effective_dt_tm > CNVTDATETIME(CURDATE, CURTIME3)
JOIN E where o.encntr_id = e.encntr_id
	and e.organization_id = CNVTREAL($PROTOCOL)
JOIN EA where ea.encntr_id = o.encntr_id
	and ea.encntr_alias_type_cd = cvFIN_NBR
	and ea.alias = $subjectid								;005
JOIN CV where o.catalog_cd= cv.code_value
	and cv.display in ($ORDERABLE)
 
elseif ($date_range = "1")
 
PLAN A
join ca																	;005
  where ca.accession_id = a.accession_id								;005
join c 																	;005
  where c.container_id = ca.container_id								;005
	and c.drawn_dt_tm between cnvtdatetime(vFROM_DT)				;005
	and cnvtdatetime(vTO_DT)										;005
JOIN O where a.order_id = o.order_id
	and o.order_status_cd != cvCANCELED
;	and o.current_start_dt_tm between cnvtdatetime(exp_from_dt)				;005
;	and cnvtdatetime(exp_to_dt)												;005
JOIN OD where o.order_id = od.order_id
	and od.oe_field_id = 12785
    and od.oe_field_display_value in ($TIMEPOINT)
JOIN P where o.person_id = p.person_id
	;introduction of new alias pool will require logic in the report writer section to differentiate the true unique id
	and p.alias_pool_cd IN (cvTATTOO, cvDISC_MRN, pfiID) ;2.4
	and p.active_ind = 1
	and p.end_effective_dt_tm > CNVTDATETIME(CURDATE, CURTIME3)
JOIN E where o.encntr_id = e.encntr_id
	and e.organization_id = CNVTREAL($PROTOCOL)
JOIN EA where ea.encntr_id = o.encntr_id
	and ea.encntr_alias_type_cd = cvFIN_NBR
	and ea.alias = $subjectid								;005
JOIN CV where o.catalog_cd= cv.code_value
	and cv.display in ($ORDERABLE)
else
 
PLAN A
join ca																	;005
  where ca.accession_id = a.accession_id								;005
join c 																	;005
  where c.container_id = ca.container_id								;005
;    and c.drawn_dt_tm between cnvtdatetime(exp_from_dt)					;005
;    and cnvtdatetime(exp_to_dt)											;005
JOIN O where a.order_id = o.order_id
	and o.order_status_cd != cvCANCELED
;	and o.orig_order_dt_tm between cnvtdatetime(vFROM_DT)				;005
;	and cnvtdatetime(vTO_DT)											;005
JOIN OD where o.order_id = od.order_id
	and od.oe_field_id = 12785
    and od.oe_field_display_value in ($TIMEPOINT)
JOIN P where o.person_id = p.person_id
	;introduction of new alias pool will require logic in the report writer section to differentiate the true unique id
	and p.alias_pool_cd IN (cvTATTOO, cvDISC_MRN, pfiID) ;2.4
	and p.active_ind = 1
	and p.end_effective_dt_tm > CNVTDATETIME(CURDATE, CURTIME3)
JOIN E where o.encntr_id = e.encntr_id
	and e.organization_id = CNVTREAL($PROTOCOL)
JOIN EA where ea.encntr_id = o.encntr_id
	and ea.encntr_alias_type_cd = cvFIN_NBR
	and ea.alias = $subjectid								;005
JOIN CV where o.catalog_cd= cv.code_value
	and cv.display in ($ORDERABLE)
endif
 
INTO "NL:"
	UNIQUE_ID = P.ALIAS
	, SUBJECT_ID = EA.ALIAS
	, TEST = UAR_GET_CODE_DISPLAY(O.CATALOG_CD)
	, ORDER_ID = OD.ORDER_ID
	, TIMEPOINT = OD.OE_FIELD_DISPLAY_VALUE
	, ACCESSION = concat(substring(8,2,a.accession), "-", substring(10,3,a.accession),
			"-", substring(15,4,a.accession))
	, ACCESSION_2 = concat(substring(8,5,a.accession), substring(15,4,a.accession))
	;, COLLECTION_DT_TM = format(O.CURRENT_START_DT_TM, "DD-Mmm-YYYY HH:MM:SS;;Q")		;005
	, collection_dt_tm = format(c.drawn_dt_tm, "DD-Mmm-YYYY HH:MM:SS;;Q")				;005 if $date_range = 1
	, collection_dt_tm2 = format(o.current_start_dt_tm, "DD-Mmm-YYYY HH:MM:SS;;Q")		;005 if $exp_date_range = 1
	, alias_pool = p.alias_pool_cd ;2.4
 
FROM
	ACCESSION_ORDER_R   A
	, PERSON_ALIAS   P
	, ORDERS   O
	, ENCOUNTER   E
	, ENCNTR_ALIAS   EA
	, ORDER_DETAIL   OD
	, CODE_VALUE   CV
 	, container_accession ca											;005
	, container c														;005
 
ORDER BY
	A.ACCESSION
	, o.order_id
	;introduction of alias pool filter is required for sort logic in the detail section to determine whether
	;the unique id is in the new pfizer pool or the old tattoo pool
	, p.alias_pool_cd desc ;2.4
	, P.ALIAS
	, OD.OE_FIELD_DISPLAY_VALUE
	, COLLECTION_DT_TM ;2.4
	;, TIMEPOINT ;2.4
 
HEAD REPORT
	pCnt = 0
	STAT = ALTERLIST(rDATA->DATA, 100)
 
head o.order_id
	;if Pfizer ID exists
	flip = 0
	if (alias_pool = pfiID and flip = 0)
		pCnt = pCnt + 1
 
		if (pCnt > size(rdata->DATA,5))
			stat = alterlist(rDATA->DATA, pCnt + 100)
		endif
 
 		rDATA->DATA[pCnt].ACCESSION = accession
 		rDATA->DATA[pCnt].ACCESSION_2 = accession_2
		rDATA->DATA[pCnt].UNIQUE_ID = unique_id
		rDATA->DATA[pCnt].SUBJECT_ID = subject_id
		rDATA->DATA[pCnt].TEST = TEST
		rDATA->DATA[pCnt].ORDER_ID = ORDER_ID
		rDATA->DATA[pCnt].ACCESSION = ACCESSION
		rDATA->DATA[pCnt].ACCESSION_2 = ACCESSION_2
		rDATA->DATA[pCnt].TIMEPOINT = TIMEPOINT
		;005
 
		;rDATA->DATA[pCnt].COLLECTION_DT_TM = COLLECTION_DT_TM
 
		if (date_range = "1")
		  rDATA->DATA[pCnt].COLLECTION_DT_TM = COLLECTION_DT_TM
		else
		  rDATA->DATA[pCnt].COLLECTION_DT_TM = COLLECTION_DT_TM2
		endif
		;005
 
		if (ISNUMERIC(SUBJECT_ID) > 0)
			rDATA->DATA[pCnt].SUBJECT_INDEX = CNVTINT(SUBJECT_ID)
		else
			rDATA->DATA[pCnt].SUBJECT_INDEX = 0
		endif
 
		flip = 1 ;set tattoo in detail
	else
		pCnt = pCnt + 1
 
		if (pCnt > size(rdata->DATA,5))
			stat = alterlist(rDATA->DATA, pCnt + 100)
		endif
 
		rDATA->DATA[pCnt].ACCESSION = accession
 		rDATA->DATA[pCnt].ACCESSION_2 = accession_2
		rDATA->DATA[pCnt].UNIQUE_ID = unique_id
		rDATA->DATA[pCnt].SUBJECT_ID = subject_id
		rDATA->DATA[pCnt].TEST = TEST
		rDATA->DATA[pCnt].ORDER_ID = ORDER_ID
		rDATA->DATA[pCnt].ACCESSION = ACCESSION
		rDATA->DATA[pCnt].ACCESSION_2 = ACCESSION_2
		rDATA->DATA[pCnt].TIMEPOINT = TIMEPOINT
		rDATA->DATA[pCnt].COLLECTION_DT_TM = COLLECTION_DT_TM
		rDATA->DATA[pCnt].tattoo = ""
 
	endif
 
DETAIL
 
	if (flip = 1)
		if (alias_pool = pfiID)
			rDATA->DATA[pCnt].tattoo = ""
		else
			rDATA->DATA[pCnt].tattoo = unique_id
		endif
	endif
 
FOOT o.order_id
	row + 0
foot report
	STAT = ALTERLIST(rDATA->DATA, pCnt)
 
WITH COUNTER
 
call echorecord(rdata)
 
 /*
 
select into $outdev
	UNIQUE_ID					= rdata->DATA[d.seq].UNIQUE_ID
	, size = value(size(rdata->DATA,5))
		,SUBJECT_ID				= rDATA->DATA[D.SEQ].SUBJECT_ID
		, tatoo					= rDATA->DATA[d.seq].tattoo
		,SUBJECT_INDEX			= rDATA->DATA[D.SEQ].SUBJECT_INDEX
		, order_id 				= rDATA->DATA[d.seq].ORDER_ID
		,TEST					= rDATA->DATA[D.SEQ].TEST
		,ACCESSION				= rDATA->DATA[D.SEQ].ACCESSION
		,COLLECTION_DT_TM		= rDATA->DATA[D.SEQ].COLLECTION_DT_TM
		,TIMEPOINT				= rDATA->DATA[D.SEQ].TIMEPOINT
from
	(dummyt d with seq = value(size(rDATA->DATA,5)))
plan d
with nocounter, separator = " ", format
 
/***************************************************************************************************
;
;									Output Section
;
****************************************************************************************************/
EXECUTE ReportRTL
%i cust_script:pfi_accn_per_protocol_v2_5.dvl
CALL InitializeReport(0)
 
/***********************************************************************
; Generate output to screen
************************************************************************/
IF ($REPORT_TYPE = "PDF")
 
	SET	cPRINT_DATE = FORMAT(CNVTDATETIME(CURDATE, CURTIME3),"DD-Mmm-YYYY HH:MM;;Q")
 
	SELECT INTO "NL:"
		UNIQUE_ID				= rDATA->DATA[D.SEQ].UNIQUE_ID,
		tattoo					= rDATA->DATA[d.seq].tattoo, ;2.4
		SUBJECT_ID				= rDATA->DATA[D.SEQ].SUBJECT_ID,
		SUBJECT_INDEX			= rDATA->DATA[D.SEQ].SUBJECT_INDEX,
		TEST					= rDATA->DATA[D.SEQ].TEST,
		ACCESSION				= rDATA->DATA[D.SEQ].ACCESSION,
		COLLECTION_DT_TM		= rDATA->DATA[D.SEQ].COLLECTION_DT_TM,
		TIMEPOINT				= rDATA->DATA[D.SEQ].TIMEPOINT
	FROM	(DUMMYT				D WITH SEQ=VALUE(size(rDATA->DATA,5)));2.4
	PLAN D
	ORDER subject_index, subject_id, accession, test
	HEAD REPORT
		X = HeadReportSection(Rpt_Render)
  		X = HeadPageSection(Rpt_Render)
  		PG_CNT = 1
	HEAD PAGE
  		if(curpage > 1)
  			_YOffset = 7.7
    		X = FootPageSection(Rpt_Render)
    		X = PageBreak(0)
    		X = HeadPageSection(Rpt_Render)
  		endif
	DETAIL
  		if(_YOffset + DetailSection(Rpt_CalcHeight) + FootPageSection(Rpt_CalcHeight) > 8)
    		Break
  		endif
  		X = DetailSection(Rpt_Render)
	FOOT PAGE
  		_YOffset = 7.7
  		X = FootPageSection(Rpt_Render)
  		PG_CNT = PG_CNT + 1
	FOOT REPORT
  		X = 0
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
ENDIF
 
;CALL FinalizeReport($OUTDEV)
 
/***********************************************************************
; Generate output file delimited by a pipe delimiter character ("|")
************************************************************************/
IF ($REPORT_TYPE = "X")
 
;	SET OUTPUT = concat("ccluserdir:", CNVTLOWER($OUTDEV), "_accn_list.csv")
	set output = concat("cust_reports:", cnvtlower($outdev), "_accn_list.csv")
;	call echo ("inside report_type")
;	call echo (output)
 
	Select Into VALUE(OUTPUT)
		UNIQUE_ID				= rDATA->DATA[D.SEQ].UNIQUE_ID,
		tattoo					= rDATA->DATA[d.seq].tattoo, ;2.4
		SUBJECT_ID				= rDATA->DATA[D.SEQ].SUBJECT_ID,
		SUBJECT_INDEX			= rDATA->DATA[D.SEQ].SUBJECT_INDEX,
		TEST					= rDATA->DATA[D.SEQ].TEST,
		ACCESSION_2				= rDATA->DATA[D.SEQ].ACCESSION_2,
		COLLECTION_DT_TM		= rDATA->DATA[D.SEQ].COLLECTION_DT_TM,
		TIMEPOINT				= rDATA->DATA[D.SEQ].TIMEPOINT
	FROM	(DUMMYT				D WITH SEQ=VALUE(size(rDATA->DATA,5)));2.4
	PLAN D
	Order by SUBJECT_INDEX, SUBJECT_ID, ACCESSION_2, TEST
	HEAD REPORT
		strngHldr = trim(cProtocol)
		col 0 strngHldr
		row + 1
 
		strngHldr = "Accession,Test,Unique ID,Subject ID,Tattoo,Timepoint,Collection Date/Time"
		col 0 strngHldr
		row + 1
	DETAIL
		strngHldr = concat(trim(ACCESSION_2),",",trim(TEST),",")
		strngHldr = concat(strngHldr,trim(UNIQUE_ID),",",trim(SUBJECT_ID),",")
		strngHldr = concat(strngHldr,trim(tattoo),",")
		strngHldr = concat(strngHldr,trim(TIMEPOINT),",",trim(COLLECTION_DT_TM))
		col 0 strngHldr
		row + 1
 
	WITH format = variable, noheading, formfeed=none, maxrow=1, maxcol=32000, nullreport
 
; FTP the extract file to a front end fileshare
 /*
if(dbNme = "BUILD")
 set batch_filename_loc = value(trim(concat("/cerner/d_build/ccluserdir/", CNVTLOWER($OUTDEV),"_accn_list.csv")))
elseif(dbNme = "CERT")
 set batch_filename_loc = value(trim(concat("/cerner/d_cert/ccluserdir/", CNVTLOWER($OUTDEV),"_accn_list.csv")))
elseif(dbNme = "PROD")
 set batch_filename_loc = value(trim(concat("/cerner/d_prod/ccluserdir/", CNVTLOWER($OUTDEV),"_accn_list.csv")))
endif
 
set new_full_name = value(trim(concat(CNVTLOWER($OUTDEV),"_accn_list.csv")))
 
set remote_domain = "170.116.246.217" ; (AMRNDHW1437)
set remote_username = "cerner_reports"
set remote_password = "!QAZ2wsx"
;set remote_domain = "162.48.36.132" ; (GRDAMRAPP1014)
;set remote_username = "anonymous"
;set remote_password = "transfer"
 
set ftp_command = concat('print "', 'open ', remote_domain, '\n',
                                    'user ', remote_username, ' ', remote_password, '\n',
                                    'binary \n',
                                    'put ', batch_filename_loc, ' ', new_full_name,
                                '"','| ftp -i -n')
 
free set command
set command = ftp_command
set status = 0
call dcl(command,size(trim(command)),status)
 */
ENDIF
 
IF ($REPORT_TYPE != "X")
	CALL FinalizeReport($OUTDEV)
ENDIF
 
END
GO ;pfi_accn_per_protocol_v2_4 "MINE", 665092, "*", "*", 0, "", "", "PDF" go
 
 
