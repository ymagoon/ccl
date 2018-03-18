drop program sch_mayo_mn_layout_code3 go
create program sch_mayo_mn_layout_code3
 
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;    * 001 01/03/12 m063907             Removed ".dat" ext on output file   *
;~DE~************************************************************************
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
 
execute ReportRtl
record T_LIST (
  1 BEG_DT_TM = DQ8
  1 END_DT_TM = DQ8
  1 PATNAME = VC
  1 LLOCCNT = I4
  1 LOC [*]
    2 LOCCD = F8
    2 BUILDING = VC
    2 DEPARTMENT = VC
    2 PHONE = VC
    2 LAPPTCNT = I4
    2 APPT [*]
      3 APPTID = F8
      3 DATE = VC
      3 TIME = VC
      3 RSCIND = I4
      3 RSCTYPE = VC
      3 RSCLBL = VC
      3 LPREPCNT = I4
      3 PREPS [*]
        4 PREPINSTRUCT = VC
)
 
 call echo (" after t_list def")
 
;;/**************************************************************
;;; DVDev DECLARED SUBROUTINES
;;**************************************************************/
;;
;;declare _CreateFonts(dummy) = null with Protect
;;declare _CreatePens(dummy) = null with Protect
;;declare LayoutQuery(dummy) = null with Protect
;;declare PageBreak(dummy) = null with Protect
;;declare FinalizeReport(sSendReport=vc) = null with Protect
;;declare footlocation(nCalc=i2) = f8 with Protect
;;declare footlocationABS(nCalc=i2,OffsetX=f8,OffsetY=f8) = f8 with Protect
;;declare headsection1(nCalc=i2) = f8 with Protect
;;declare headsection1ABS(nCalc=i2,OffsetX=f8,OffsetY=f8) = f8 with Protect
;;declare footappointment(nCalc=i2) = f8 with Protect
;;declare footappointmentABS(nCalc=i2,OffsetX=f8,OffsetY=f8) = f8 with Protect
;;declare footprepshead(nCalc=i2) = f8 with Protect
;;declare footprepsheadABS(nCalc=i2,OffsetX=f8,OffsetY=f8) = f8 with Protect
;;declare footpreps(nCalc=i2,maxHeight=f8,bContinue=i2(Ref)) = f8 with Protect
;;declare footprepsABS(nCalc=i2,OffsetX=f8,OffsetY=f8,maxHeight=f8,bContinue=i2(Ref)) = f8 with Protect
;;declare FootPageSection(nCalc=i2) = f8 with Protect
;;declare FootPageSectionABS(nCalc=i2,OffsetX=f8,OffsetY=f8) = f8 with Protect
;;declare headpagesection(nCalc=i2) = f8 with Protect
;;declare headpagesectionABS(nCalc=i2,OffsetX=f8,OffsetY=f8) = f8 with Protect
;;declare InitializeReport(dummy) = null with Protect
;;
;;/**************************************************************
;;; DVDev DECLARED VARIABLES
;;**************************************************************/
;;
;;declare _hReport = i4 with NoConstant(0),protect
;;declare _YOffset = f8 with NoConstant(0.0),protect
;;declare _XOffset = f8 with NoConstant(0.0),protect
;;declare Rpt_Render = i2 with Constant(0),protect
;;declare _CRLF = vc with Constant(concat(char(13),char(10))),protect
;;declare RPT_CalcHeight = i2 with Constant(1),protect
;;declare _YShift = f8 with NoConstant(0.0),protect
;;declare _XShift = f8 with NoConstant(0.0),protect
;;declare _SendTo = vc with NoConstant($OutDev),protect
;;declare _rptErr = i2 with NoConstant(0),protect
;;declare _rptStat = i2 with NoConstant(0),protect
;;declare _oldFont = i4 with NoConstant(0),protect
;;declare _oldPen = i4 with NoConstant(0),protect
;;declare _dummyFont = i4 with NoConstant(0),protect
;;declare _dummyPen = i4 with NoConstant(0),protect
;;declare _fDrawHeight = f8 with NoConstant(0.0),protect
;;declare _rptPage = i4 with NoConstant(0),protect
;;declare _OutputType = i2 with noConstant(RPT_PostScript),protect
;;declare _bHoldContinue = i2 with NoConstant(0),protect
;;declare _bContfootpreps = i2 with NoConstant(0),protect
;;declare _Remprep_inst = i2 with NoConstant(1),protect
;;declare _Times10I0 = i4 with NoConstant(0),protect
;;declare _Times10B0 = i4 with NoConstant(0),protect
;;declare _Times10BU0 = i4 with NoConstant(0),protect
;;declare _Times120 = i4 with NoConstant(0),protect
;;declare _Times12B0 = i4 with NoConstant(0),protect
;;declare _Times100 = i4 with NoConstant(0),protect
;;declare _pen14S0C0 = i4 with NoConstant(0),protect
;;
;;/**************************************************************
;;; DVDev DEFINED SUBROUTINES
;;**************************************************************/
;;
;;subroutine LayoutQuery(dummy)
;;SELECT INTO "nl:"
;;	pat_nme = trim(substring(1,50, t_list->patName), 3)
;;	, build_nme = trim(substring(1,200, t_list->loc[d1.seq].building), 3)
;;	, dept_nme = trim(substring(1,200, t_list->loc[d1.seq].department), 3)
;;	, phone_nbr = trim(substring(1,30, t_list->loc[d1.seq].phone), 3)
;;	, date = trim(substring(1,20, t_list->loc[d1.seq].appt[d2.seq].date), 3)
;;	, time = trim(substring(1,20, t_list->loc[d1.seq].appt[d2.seq].time), 3)
;;	, rscLbl = trim(substring(1,40, t_list->loc[d1.seq].appt[d2.seq].rscLbl), 3)
;;	, rscType = trim(substring(1,50, t_list->loc[d1.seq].appt[d2.seq].rscType), 3)
;;	, preps = trim(substring(1,100, t_list->loc[d1.seq].appt[d2.seq].preps[d3.seq].prepInstruct), 3)
;;	, d1seq = d1.seq
;;	, d2seq = d2.seq
;;	, d3seq = d3.seq
;;	, lapptCnt1 = t_list->aptCnt
;;	, prepLneCnt = t_list->loc[d1.seq].appt[d2.seq].lPrepLneCnt
;;
;;FROM
;;	(dummyt   d1  with seq = lLocCnt)
;;	, (dummyt   d2  with seq = 1)
;;	, (dummyt   d3  with seq = 1)
;;
;;plan d1 where maxrec(d2,size(t_list->loc[d1.seq].appt,5))
;;   join d2 where maxrec(d3, size(t_list->loc[d1.seq].appt[d2.seq].preps,5))
;;   join d3
;;
;;ORDER BY
;;	d1.seq
;;	, d2.seq
;;	, d3.seq
;;
;;
;;
;;Head Report
;;	_d0 = pat_nme
;;	_d1 = build_nme
;;	_d2 = dept_nme
;;	_d3 = phone_nbr
;;	_d4 = date
;;	_d5 = time
;;	_d6 = rsclbl
;;	_d7 = rsctype
;;	_d8 = preps
;;	_d9 = d1seq
;;	_d10 = d2seq
;;	_d11 = d3seq
;;	_d12 = lapptcnt1
;;; set bottom extent of page
;;_fEndDetail = RptReport->m_pageHeight-RptReport->m_marginBottom
;;_fEndDetail = _fEndDetail-FootPageSection(RPT_CALCHEIGHT)
;;
;;
;;Head Page
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;if (curpage > 1 and lCnt1 < lapptCnt1)
;;	dummy_val = PageBreak(0)
;;endif
;;
;;if (lCnt1 < lapptCnt1)
;;  dummy_val = HeadPageSection(RPT_RENDER)
;;  dummy_val = headsection1(RPT_RENDER)
;;
;;endif
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;
;;Head d1.seq
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;; calculate section height
;;_fDrawHeight = footlocation(RPT_CALCHEIGHT)
;;; break if bottom of page exceeded
;;if (_YOffset+_fDrawHeight +
;;t_list->loc[d1.seq].appt[d2.seq].lPrepLneCnt/2  >_fEndDetail)
;;	break
;;endif
;;
;;if(lCnt1 < lapptCnt1)
;;  dummy_val = footlocation(RPT_RENDER)
;;endif
;;/****** YOUR CODE BEGINS HERE ******/
;;first_time = 1
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;
;;Head d2.seq
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;; calculate section height
;;_fDrawHeight = footappointment(RPT_CALCHEIGHT)
;;; break if bottom of page exceeded
;;if (_YOffset+_fDrawHeight + prepLneCnt/2  >_fEndDetail)
;;	break
;;                dummy_val = footlocation(RPT_RENDER)
;;endif
;;
;;if(lCnt1 < lapptCnt1)
;;  dummy_val = footappointment(RPT_RENDER)
;;  lCnt1 = lCnt1 + 1
;;endif
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;
;;Head d3.seq
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;; calculate section height
;;_fDrawHeight = footprepshead(RPT_CALCHEIGHT) + 1
;;
;;; keep together
;;if (_fEndDetail > _YOffset+_fDrawHeight)
;;	_bHoldContinue = 0
;;	_fDrawHeight = _fDrawHeight+footpreps(RPT_CALCHEIGHT,_fEndDetail-_YOffset-_fDrawHeight,_bHoldContinue)
;;	if (_bHoldContinue=1) ; force a break to happen
;;		_fDrawHeight = _fEndDetail + 1
;;	endif
;;endif
;;
;;; break if bottom of page exceeded
;;;if (_YOffset+_fDrawHeight>_fEndDetail)
;;	;break
;;         ;dummy_val = footlocation(RPT_RENDER)
;;;endif
;;
;;dummy_val = footprepshead(RPT_RENDER)
;;_bContfootpreps = 0
;;; begin grow loop
;;bFirstTime = 1
;;while (_bContfootpreps=1 OR bFirstTime=1)
;;
;;; calculate section height
;;_bHoldContinue = _bContfootpreps
;;_fDrawHeight = footpreps(RPT_CALCHEIGHT,_fEndDetail-_YOffset,_bHoldContinue)
;;
;;; break if bottom of page exceeded
;;;if (_YOffset+_fDrawHeight>_fEndDetail)
;;	;break
;;; keep section if doesn't fit (one time only)
;;;elseif (_bHoldContinue=1 AND _bContfootpreps = 0)
;;	;break
;;;endif
;;
;;dummy_val = footpreps(RPT_RENDER,_fEndDetail-_YOffset,_bContfootpreps)
;;bFirstTime = 0
;;endwhile
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;first_time = 0
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;
;;Foot Page
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;_YHold = _YOffset
;;_YOffset = _fEndDetail
;;
;;  dummy_val = FootPageSection(RPT_RENDER)
;;
;;_YOffset = _YHold
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;
;;WITH NOCOUNTER, SEPARATOR=" ", FORMAT, outerjoin = d2, outerjoin = d3
;;end ;LayoutQuery
;;subroutine PageBreak(dummy)
;;set _rptPage = uar_rptEndPage(_hReport)
;;set _rptPage = uar_rptStartPage(_hReport)
;;set _YOffset = RptReport->m_marginTop
;;end ; PageBreak
;;
;;subroutine FinalizeReport(sSendReport)
;;set _rptPage = uar_rptEndPage(_hReport)
;;set _rptStat = uar_rptEndReport(_hReport)
;;declare sFilename = vc with NoConstant(trim(sSendReport)),private
;;declare bPrint = i2 with NoConstant(0),private
;;if(textlen(sFilename)>0)
;;set bPrint = CheckQueue(sFilename)
;;  if(bPrint)
;;    execute cpm_create_file_name "RPT","PS"
;;    set sFilename = cpm_cfn_info->file_name_path
;;  endif
;;endif
;;;pel set sFilename = concat(sFilename, ".dat")
;;set _rptStat = uar_rptPrintToFile(_hReport,nullterm(sFileName))
;;if(bPrint)
;;  set spool value(sFilename) value(sSendReport) with deleted
;;endif
;;declare _errorFound = i2 with noConstant(0),protect
;;declare _errCnt = i2 with noConstant(0),protect
;;set _errorFound = uar_RptFirstError( _hReport , RptError )
;;while ( _errorFound = RPT_ErrorFound and _errCnt < 512 )
;;   set _errCnt = _errCnt+1
;;   set stat = AlterList(RptErrors->Errors,_errCnt)
;;set RptErrors->Errors[_errCnt].m_severity = RptError->m_severity
;;     set RptErrors->Errors[_errCnt].m_text =  RptError->m_text
;;     set RptErrors->Errors[_errCnt].m_source = RptError->m_source
;;   set _errorFound = uar_RptNextError( _hReport , RptError )
;;endwhile
;;set _rptStat = uar_rptDestroyReport(_hReport)
;;end ; FinalizeReport
;;
;;subroutine footlocation(nCalc)
;;declare a1=f8 with noconstant(0.0),private
;;set a1=(footlocationABS(nCalc,_XOffset,_YOffset))
;;return (a1)
;;end ;subroutine footlocation(nCalc)
;;
;;subroutine footlocationABS(nCalc,OffsetX,OffsetY)
;;declare sectionHeight = f8 with noconstant(0.820000), private
;;if (nCalc = RPT_RENDER)
;;set RptSD->m_flags = 4
;;set RptSD->m_borders = RPT_SDNOBORDERS
;;set RptSD->m_padding = RPT_SDNOBORDERS
;;set RptSD->m_paddingWidth = 0.000
;;set RptSD->m_lineSpacing = RPT_SINGLE
;;set RptSD->m_rotationAngle = 0
;;set RptSD->m_y = OffsetY + 0.063
;;set RptSD->m_x = OffsetX + 0.063
;;set RptSD->m_width = 0.688
;;set RptSD->m_height = 0.250
;;set _oldFont = uar_rptSetFont(_hReport, _Times10B0)
;;set _oldPen = uar_rptSetPen(_hReport,_pen14S0C0)
;;; DRAW LABEL --- FieldName3
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Building:",char(0)))
;;set RptSD->m_y = OffsetY + 0.250
;;set RptSD->m_x = OffsetX + 0.063
;;set RptSD->m_width = 0.771
;;set RptSD->m_height = 0.250
;;; DRAW LABEL --- FieldName5
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Department:",char(0)))
;;set RptSD->m_y = OffsetY + 0.063
;;set RptSD->m_x = OffsetX + 5.625
;;set RptSD->m_width = 0.563
;;set RptSD->m_height = 0.302
;;; DRAW LABEL --- FieldName7
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Phone #:",char(0)))
;;set RptSD->m_y = OffsetY + 0.563
;;set RptSD->m_x = OffsetX + 1.375
;;set RptSD->m_width = 0.688
;;set RptSD->m_height = 0.250
;;; DRAW LABEL --- FieldName9
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Date",char(0)))
;;set RptSD->m_y = OffsetY + 0.563
;;set RptSD->m_x = OffsetX + 2.500
;;set RptSD->m_width = 0.521
;;set RptSD->m_height = 0.260
;;; DRAW LABEL --- FieldName10
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Time",char(0)))
;;; DRAW LINE --- FieldName12
;;set _rptStat = uar_rptLine( _hReport,OffsetX+0.750,OffsetY+ 0.751,OffsetX+6.542, OffsetY+0.751)
;;set RptSD->m_flags = 0
;;set RptSD->m_y = OffsetY + 0.063
;;set RptSD->m_x = OffsetX + 0.938
;;set RptSD->m_width = 4.563
;;set RptSD->m_height = 0.250
;;set _DummyFont = uar_rptSetFont(_hReport, _Times100)
;;; DRAW TEXT --- build_nme
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(build_nme,char(0)))
;;set RptSD->m_y = OffsetY + 0.250
;;set RptSD->m_x = OffsetX + 0.938
;;set RptSD->m_width = 4.563
;;set RptSD->m_height = 0.250
;;; DRAW TEXT --- dept_nme
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(dept_nme,char(0)))
;;set RptSD->m_y = OffsetY + 0.063
;;set RptSD->m_x = OffsetX + 6.250
;;set RptSD->m_width = 1.156
;;set RptSD->m_height = 0.250
;;; DRAW TEXT --- phone_nbr
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(cnvtphone(phone_nbr,874),char(0)))
;;set RptSD->m_y = OffsetY + 0.563
;;set RptSD->m_x = OffsetX + 4.000
;;set RptSD->m_width = 1.021
;;set RptSD->m_height = 0.250
;;set _DummyFont = uar_rptSetFont(_hReport, _Times10B0)
;;; DRAW TEXT --- resource_label
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(rscLbl,char(0)))
;;set _DummyFont = uar_rptSetFont(_hReport, _oldFont)
;;set _DummyPen = uar_rptSetPen(_hReport,_oldPen)
;;	set _YOffset = OffsetY + sectionHeight
;;endif
;;return(sectionHeight)
;;end ;subroutine footlocationABS(nCalc,OffsetX,OffsetY)
;;
;;subroutine headsection1(nCalc)
;;declare a1=f8 with noconstant(0.0),private
;;set a1=(headsection1ABS(nCalc,_XOffset,_YOffset))
;;return (a1)
;;end ;subroutine headsection1(nCalc)
;;
;;subroutine headsection1ABS(nCalc,OffsetX,OffsetY)
;;declare sectionHeight = f8 with noconstant(1.220000), private
;;if (nCalc = RPT_RENDER)
;;set RptSD->m_flags = 20
;;set RptSD->m_borders = RPT_SDNOBORDERS
;;set RptSD->m_padding = RPT_SDNOBORDERS
;;set RptSD->m_paddingWidth = 0.000
;;set RptSD->m_lineSpacing = RPT_SINGLE
;;set RptSD->m_rotationAngle = 0
;;set RptSD->m_y = OffsetY + 0.250
;;set RptSD->m_x = OffsetX + 0.000
;;set RptSD->m_width = 7.500
;;set RptSD->m_height = 0.250
;;set _oldFont = uar_rptSetFont(_hReport, _Times12B0)
;;set _oldPen = uar_rptSetPen(_hReport,_pen14S0C0)
;;; DRAW LABEL --- FieldName0
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Mayo Health System Patient Itinerary",char(0)))
;;set RptSD->m_y = OffsetY + 0.500
;;set RptSD->m_x = OffsetX + 3.375
;;set RptSD->m_width = 0.719
;;set RptSD->m_height = 0.260
;;; DRAW LABEL --- FieldName2
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("for",char(0)))
;;set RptSD->m_flags = 16
;;set RptSD->m_y = OffsetY + 0.750
;;set RptSD->m_x = OffsetX + 0.000
;;set RptSD->m_width = 7.500
;;set RptSD->m_height = 0.271
;;set _DummyFont = uar_rptSetFont(_hReport, _Times120)
;;; DRAW TEXT --- patname
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(trim(pat_nme),char(0)))
;;set _DummyFont = uar_rptSetFont(_hReport, _oldFont)
;;set _DummyPen = uar_rptSetPen(_hReport,_oldPen)
;;	set _YOffset = OffsetY + sectionHeight
;;endif
;;return(sectionHeight)
;;end ;subroutine headsection1ABS(nCalc,OffsetX,OffsetY)
;;
;;subroutine footappointment(nCalc)
;;declare a1=f8 with noconstant(0.0),private
;;set a1=(footappointmentABS(nCalc,_XOffset,_YOffset))
;;return (a1)
;;end ;subroutine footappointment(nCalc)
;;
;;subroutine footappointmentABS(nCalc,OffsetX,OffsetY)
;;declare sectionHeight = f8 with noconstant(0.340000), private
;;if (nCalc = RPT_RENDER)
;;set RptSD->m_flags = 0
;;set RptSD->m_borders = RPT_SDNOBORDERS
;;set RptSD->m_padding = RPT_SDNOBORDERS
;;set RptSD->m_paddingWidth = 0.000
;;set RptSD->m_lineSpacing = RPT_SINGLE
;;set RptSD->m_rotationAngle = 0
;;set RptSD->m_y = OffsetY + 0.063
;;set RptSD->m_x = OffsetX + 1.375
;;set RptSD->m_width = 0.677
;;set RptSD->m_height = 0.177
;;set _oldPen = uar_rptSetPen(_hReport,_pen14S0C0)
;;; DRAW TEXT --- date
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(date,char(0)))
;;set RptSD->m_y = OffsetY + 0.063
;;set RptSD->m_x = OffsetX + 2.500
;;set RptSD->m_width = 0.542
;;set RptSD->m_height = 0.219
;;; DRAW TEXT --- time
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(time,char(0)))
;;set RptSD->m_y = OffsetY + 0.063
;;set RptSD->m_x = OffsetX + 3.938
;;set RptSD->m_width = 2.604
;;set RptSD->m_height = 0.281
;;; DRAW TEXT --- resource
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(rscType,char(0)))
;;set _DummyPen = uar_rptSetPen(_hReport,_oldPen)
;;	set _YOffset = OffsetY + sectionHeight
;;endif
;;return(sectionHeight)
;;end ;subroutine footappointmentABS(nCalc,OffsetX,OffsetY)
;;
;;subroutine footprepshead(nCalc)
;;declare a1=f8 with noconstant(0.0),private
;;set a1=(footprepsheadABS(nCalc,_XOffset,_YOffset))
;;return (a1)
;;end ;subroutine footprepshead(nCalc)
;;
;;subroutine footprepsheadABS(nCalc,OffsetX,OffsetY)
;;declare sectionHeight = f8 with noconstant(0.250000), private
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;if (NOT(preps > " " and first_time = 1))
;;   return (0.0)
;;endif
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;if (nCalc = RPT_RENDER)
;;set RptSD->m_flags = 4
;;set RptSD->m_borders = RPT_SDNOBORDERS
;;set RptSD->m_padding = RPT_SDNOBORDERS
;;set RptSD->m_paddingWidth = 0.000
;;set RptSD->m_lineSpacing = RPT_SINGLE
;;set RptSD->m_rotationAngle = 0
;;set RptSD->m_y = OffsetY + 0.000
;;set RptSD->m_x = OffsetX + 0.625
;;set RptSD->m_width = 0.521
;;set RptSD->m_height = 0.250
;;set _oldFont = uar_rptSetFont(_hReport, _Times10BU0)
;;set _oldPen = uar_rptSetPen(_hReport,_pen14S0C0)
;;; DRAW LABEL --- PreLbl
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Prep:",char(0)))
;;set _DummyFont = uar_rptSetFont(_hReport, _oldFont)
;;set _DummyPen = uar_rptSetPen(_hReport,_oldPen)
;;	set _YOffset = OffsetY + sectionHeight
;;endif
;;return(sectionHeight)
;;end ;subroutine footprepsheadABS(nCalc,OffsetX,OffsetY)
;;
;;subroutine footpreps(nCalc,maxHeight,bContinue)
;;declare a1=f8 with noconstant(0.0),private
;;set a1=(footprepsABS(nCalc,_XOffset,_YOffset,maxHeight,bContinue))
;;return (a1)
;;end ;subroutine footpreps(nCalc,maxHeight,bContinue)
;;
;;subroutine footprepsABS(nCalc,OffsetX,OffsetY,maxHeight,bContinue)
;;declare sectionHeight = f8 with noconstant(0.190000), private
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;if (NOT(preps > " " ))
;;   return (0.0)
;;endif
;;/*----- YOUR CODE ENDS HERE -----*/
;;declare growSum = i4 with noconstant(0), private
;;if (bContinue=0)
;;	set _Remprep_inst = 1
;;endif
;;set RptSD->m_flags = 5
;;set RptSD->m_borders = RPT_SDNOBORDERS
;;set RptSD->m_padding = RPT_SDNOBORDERS
;;set RptSD->m_paddingWidth = 0.000
;;set RptSD->m_lineSpacing = RPT_SINGLE
;;set RptSD->m_rotationAngle = 0
;;if (bContinue)
;;	set RptSD->m_y = OffsetY
;;else
;;	set RptSD->m_y = OffsetY + 0.000
;;endif
;;set RptSD->m_x = OffsetX + 0.875
;;set RptSD->m_width = 6.375
;;set RptSD->m_height = OffsetY+maxHeight-RptSD->m_y
;;set _oldPen = uar_rptSetPen(_hReport,_pen14S0C0)
;;set _HoldRemprep_inst = _Remprep_inst
;;if (_Remprep_inst > 0)
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, nullterm(substring(_Remprep_inst,size(trim(t_list->loc[d1seq].appt[d2seq].
;;preps[d3seq].prepInstruct, 3))-_Remprep_inst+1,trim(t_list->loc[d1seq].appt[d2seq].preps[d3seq].prepInstruct, 3))))
;;if (RptSD->m_height > OffsetY + sectionHeight - RptSD->m_y)
;;	set sectionHeight = RptSD->m_y + _fDrawHeight - OffsetY
;;endif
;;if (RptSD->m_drawLength = 0)
;;	set _Remprep_inst = 0
;;elseif (RptSD->m_drawLength < size(nullterm(substring(_Remprep_inst,size(trim(t_list->loc[d1seq].appt[d2seq].preps[d3seq].
;;prepInstruct, 3))-_Remprep_inst+1,trim(t_list->loc[d1seq].appt[d2seq].preps[d3seq].prepInstruct, 3))))) ; subtract null
;;	set _Remprep_inst = _Remprep_inst+RptSD->m_drawLength
;;else
;;	set _Remprep_inst = 0
;;endif
;;	; append remainder to growSum so we know whether or not to continue at the end
;;	set growSum = growSum + _Remprep_inst
;;endif
;;set RptSD->m_flags = 4
;;if (nCalc = RPT_RENDER AND _HoldRemprep_inst > 0)
;;; DRAW TEXT --- prep_inst
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, nullterm(substring(_HoldRemprep_inst,size(trim(t_list->loc[d1seq].appt[d2seq
;;].preps[d3seq].prepInstruct, 3))-_HoldRemprep_inst+1,trim(t_list->loc[d1seq].appt[d2seq].preps[d3seq].prepInstruct, 3))))
;;else
;;	set _Remprep_inst = _HoldRemprep_inst
;;endif
;;set RptSD->m_flags = 64
;;set RptSD->m_y = OffsetY + 0.000
;;set RptSD->m_x = OffsetX + 0.594
;;set RptSD->m_width = 0.250
;;set RptSD->m_height = 0.188
;;if (nCalc = RPT_RENDER AND bContinue = 0)
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;if (preps > " ")
;;; DRAW TEXT --- PrepCnt
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(build(d3seq, ". "),char(0)))
;;endif
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;endif
;;set _DummyPen = uar_rptSetPen(_hReport,_oldPen)
;;if (nCalc = RPT_RENDER)
;;	set _YOffset = OffsetY + sectionHeight
;;endif
;;	if (growSum > 0)
;;		set bContinue = 1 ; continue grow
;;	else
;;		set bContinue = 0 ; done growing
;;	endif
;;return(sectionHeight)
;;end ;subroutine footprepsABS(nCalc,OffsetX,OffsetY,maxHeight,bContinue)
;;
;;subroutine FootPageSection(nCalc)
;;declare a1=f8 with noconstant(0.0),private
;;set a1=(FootPageSectionABS(nCalc,_XOffset,_YOffset))
;;return (a1)
;;end ;subroutine FootPageSection(nCalc)
;;
;;subroutine FootPageSectionABS(nCalc,OffsetX,OffsetY)
;;declare sectionHeight = f8 with noconstant(1.200000), private
;;if (nCalc = RPT_RENDER)
;;set RptSD->m_flags = 64
;;set RptSD->m_borders = RPT_SDNOBORDERS
;;set RptSD->m_padding = RPT_SDNOBORDERS
;;set RptSD->m_paddingWidth = 0.000
;;set RptSD->m_lineSpacing = RPT_SINGLE
;;set RptSD->m_rotationAngle = 0
;;set RptSD->m_y = OffsetY + 0.750
;;set RptSD->m_x = OffsetX + 1.000
;;set RptSD->m_width = 6.000
;;set RptSD->m_height = 0.260
;;set _oldPen = uar_rptSetPen(_hReport,_pen14S0C0)
;;; DRAW TEXT --- page_nbr
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(RPT_PageOfPage,char(0)))
;;set RptSD->m_flags = 68
;;set RptSD->m_y = OffsetY + 0.438
;;set RptSD->m_x = OffsetX + 0.938
;;set RptSD->m_width = 6.000
;;set RptSD->m_height = 0.313
;;set _oldFont = uar_rptSetFont(_hReport, _Times10I0)
;;
;;/****** YOUR CODE BEGINS HERE ******/
;;if (curendreport != 1 and lCnt1 < lapptCnt1)
;;; DRAW LABEL --- FieldName6
;;set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("(continued on next page)",char(0)))
;;endif
;;/*----- YOUR CODE ENDS HERE -----*/
;;
;;; DRAW LINE --- FieldName7
;;set _rptStat = uar_rptLine( _hReport,OffsetX+0.688,OffsetY+ 0.720,OffsetX+7.001, OffsetY+0.720)
;;set _DummyFont = uar_rptSetFont(_hReport, _oldFont)
;;set _DummyPen = uar_rptSetPen(_hReport,_oldPen)
;;	set _YOffset = OffsetY + sectionHeight
;;endif
;;return(sectionHeight)
;;end ;subroutine FootPageSectionABS(nCalc,OffsetX,OffsetY)
;;
;;subroutine headpagesection(nCalc)
;;declare a1=f8 with noconstant(0.0),private
;;set a1=(headpagesectionABS(nCalc,_XOffset,_YOffset))
;;return (a1)
;;end ;subroutine headpagesection(nCalc)
;;
;;subroutine headpagesectionABS(nCalc,OffsetX,OffsetY)
;;declare sectionHeight = f8 with noconstant(10.000000), private
;;if (nCalc = RPT_RENDER)
;;set _oldPen = uar_rptSetPen(_hReport,_pen14S0C0)
;;; DRAW RECTANGLE --- FieldName10
;;set _rptStat = uar_rptRect ( _hReport, OffsetX+-0.010, OffsetY+0.000, 7.510, 10.000, RPT_NOFILL, RPT_WHITE)
;;set _DummyPen = uar_rptSetPen(_hReport,_oldPen)
;;endif
;;return(sectionHeight)
;;end ;subroutine headpagesectionABS(nCalc,OffsetX,OffsetY)
;;
;;subroutine InitializeReport(dummy)
;;set RptReport->m_recSize = 100
;;set RptReport->m_reportName = "SCH_MAYO_MN_LAYOUT_CODE"
;;set RptReport->m_pageWidth = 8.50
;;set RptReport->m_pageHeight = 11.00
;;set RptReport->m_orientation = Rpt_Portrait
;;set RptReport->m_marginLeft = 0.50
;;set RptReport->m_marginRight = 0.50
;;set RptReport->m_marginTop = 0.50
;;set RptReport->m_marginBottom = 0.50
;;set RptReport->m_horzPrintOffset = _XShift
;;set RptReport->m_vertPrintOffset = _YShift
;;set _YOffset = RptReport->m_marginTop
;;set _XOffset = RptReport->m_marginLeft
;;set _hReport = uar_rptCreateReport(RptReport, _OutputType,Rpt_Inches)
;;set _rptErr = uar_rptSetErrorLevel(_hReport,Rpt_Error)
;;set _rptStat = uar_rptStartReport(_hReport)
;;set _rptPage = uar_rptStartPage(_hReport)
;;call _CreateFonts(0)
;;call _CreatePens(0)
;;end ;_InitializeReport
;;
;;subroutine _CreateFonts(dummy)
;;set RptFont->m_recSize = 50
;;set RptFont->m_fontName = RPT_TIMES
;;set RptFont->m_pointSize = 10
;;set RptFont->m_bold = RPT_OFF
;;set RptFont->m_italic = RPT_OFF
;;set RptFont->m_underline = RPT_OFF
;;set RptFont->m_strikethrough = RPT_OFF
;;set RptFont->m_rgbColor = RPT_BLACK
;;set _Times100 = uar_rptCreateFont(_hReport, RptFont)
;;set RptFont->m_bold = RPT_ON
;;set _Times10B0 = uar_rptCreateFont(_hReport, RptFont)
;;set RptFont->m_pointSize = 12
;;set _Times12B0 = uar_rptCreateFont(_hReport, RptFont)
;;set RptFont->m_bold = RPT_OFF
;;set _Times120 = uar_rptCreateFont(_hReport, RptFont)
;;set RptFont->m_pointSize = 10
;;set RptFont->m_bold = RPT_ON
;;set RptFont->m_underline = RPT_ON
;;set _Times10BU0 = uar_rptCreateFont(_hReport, RptFont)
;;set RptFont->m_bold = RPT_OFF
;;set RptFont->m_italic = RPT_ON
;;set RptFont->m_underline = RPT_OFF
;;set _Times10I0 = uar_rptCreateFont(_hReport, RptFont)
;;end;**************Create Fonts*************
;;
;;subroutine _CreatePens(dummy)
;;set RptPen->m_recSize = 16
;;set RptPen->m_penWidth = 0.014
;;set RptPen->m_penStyle = 0
;;set RptPen->m_rgbColor =  RPT_BLACK
;;set _pen14S0C0 = uar_rptCreatePen(_hReport,RptPen)
;;end;**************Create Pen*************
;;
;;;**************Report Layout End*************
;;
;; */
call echo (" dvl include")
 
%i mhs_prg:sch_mayo_mn_layout_code3.dvl
 
;call InitializeReport(0)
 call echo (" after dvl ")
 
call LayoutQuery(0)
;call FinalizeReport(_SendTo)
 
end go
