 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
 
declare _CreateFonts(dummy) = null with Protect
declare _CreatePens(dummy) = null with Protect
declare PageBreak(dummy) = null with Protect
declare FinalizeReport(sSendReport=vc) = null with Protect
declare DetailSection(nCalc=i2) = f8 with Protect
declare DetailSectionABS(nCalc=i2,OffsetX=f8,OffsetY=f8) = f8 with Protect
declare InitializeReport(dummy) = null with Protect
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
 
declare _hReport = i4 with NoConstant(0),protect
declare _YOffset = f8 with NoConstant(0.0),protect
declare _XOffset = f8 with NoConstant(0.0),protect
declare Rpt_Render = i2 with Constant(0),protect
declare _CRLF = vc with Constant(concat(char(13),char(10))),protect
declare RPT_CalcHeight = i2 with Constant(1),protect
declare _YShift = f8 with NoConstant(0.0),protect
declare _XShift = f8 with NoConstant(0.0),protect
declare _SendTo = vc with NoConstant(""),protect
declare _rptErr = i2 with NoConstant(0),protect
declare _rptStat = i2 with NoConstant(0),protect
declare _oldFont = i4 with NoConstant(0),protect
declare _oldPen = i4 with NoConstant(0),protect
declare _dummyFont = i4 with NoConstant(0),protect
declare _dummyPen = i4 with NoConstant(0),protect
declare _fDrawHeight = f8 with NoConstant(0.0),protect
declare _rptPage = i4 with NoConstant(0),protect
declare _OutputType = i2 with noConstant(RPT_PostScript),protect
declare _Times80 = i4 with NoConstant(0),protect
declare _Times70 = i4 with NoConstant(0),protect
declare _Times9B0 = i4 with NoConstant(0),protect
declare _Times100 = i4 with NoConstant(0),protect
declare _pen13S0C0 = i4 with NoConstant(0),protect
declare _pen14S0C0 = i4 with NoConstant(0),protect
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
 
subroutine PageBreak(dummy)
set _rptPage = uar_rptEndPage(_hReport)
set _rptPage = uar_rptStartPage(_hReport)
set _YOffset = RptReport->m_marginTop
end ; PageBreak
 
subroutine FinalizeReport(sSendReport)
set _rptPage = uar_rptEndPage(_hReport)
set _rptStat = uar_rptEndReport(_hReport)
declare sFilename = vc with NoConstant(trim(sSendReport)),private
declare bPrint = i2 with NoConstant(0),private
if(textlen(sFilename)>0)
set bPrint = CheckQueue(sFilename)
  if(bPrint)
    execute cpm_create_file_name "RPT","PS"
    set sFilename = cpm_cfn_info->file_name_path
  endif
endif
set _rptStat = uar_rptPrintToFile(_hReport,nullterm(sFileName))
if(bPrint)
  set spool value(sFilename) value(sSendReport) with deleted
endif
declare _errorFound = i2 with noConstant(0),protect
declare _errCnt = i2 with noConstant(0),protect
set _errorFound = uar_RptFirstError( _hReport , RptError )
while ( _errorFound = RPT_ErrorFound and _errCnt < 512 )
   set _errCnt = _errCnt+1
   set stat = AlterList(RptErrors->Errors,_errCnt)
set RptErrors->Errors[_errCnt].m_severity = RptError->m_severity
     set RptErrors->Errors[_errCnt].m_text =  RptError->m_text
     set RptErrors->Errors[_errCnt].m_source = RptError->m_source
   set _errorFound = uar_RptNextError( _hReport , RptError )
endwhile
set _rptStat = uar_rptDestroyReport(_hReport)
end ; FinalizeReport
 
subroutine DetailSection(nCalc)
declare a1=f8 with noconstant(0.0),private
set a1=(DetailSectionABS(nCalc,_XOffset,_YOffset))
return (a1)
end ;subroutine DetailSection(nCalc)
 
subroutine DetailSectionABS(nCalc,OffsetX,OffsetY)
declare sectionHeight = f8 with noconstant(1.000000), private
if (nCalc = RPT_RENDER)
set RptSD->m_flags = 0
set RptSD->m_borders = RPT_SDNOBORDERS
set RptSD->m_padding = RPT_SDNOBORDERS
set RptSD->m_paddingWidth = 0.000
set RptSD->m_lineSpacing = RPT_SINGLE
set RptSD->m_rotationAngle = 0
set RptSD->m_y = OffsetY + 0.063
set RptSD->m_x = OffsetX + 0.625
set RptSD->m_width = 2.063
set RptSD->m_height = 0.219
set _oldFont = uar_rptSetFont(_hReport, _Times9B0)
set _oldPen = uar_rptSetPen(_hReport,_pen14S0C0)
; DRAW TEXT --- patient_name
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(full_name,char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 0.875
set RptSD->m_width = 0.510
set RptSD->m_height = 0.219
set _DummyFont = uar_rptSetFont(_hReport, _Times70)
; DRAW TEXT --- dob
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(dob,char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 1.625
set RptSD->m_width = 0.260
set RptSD->m_height = 0.219
; DRAW TEXT --- age
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(age_dp,char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 2.313
set RptSD->m_width = 0.573
set RptSD->m_height = 0.219
; DRAW TEXT --- sex
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(sex_dp,char(0)))
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 0.938
set RptSD->m_width = 0.823
set RptSD->m_height = 0.135
; DRAW TEXT --- admit
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(admit_dt,char(0)))
set RptSD->m_y = OffsetY + 0.813
set RptSD->m_x = OffsetX + 0.625
set RptSD->m_width = 1.563
set RptSD->m_height = 0.146
set _DummyFont = uar_rptSetFont(_hReport, _Times80)
; DRAW TEXT --- fin
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(fin,char(0)))
set RptSD->m_rotationAngle = 90
set RptSD->m_y = OffsetY + 0.885
set RptSD->m_x = OffsetX + 0.500
set RptSD->m_width = 0.885
set RptSD->m_height = 0.219
set _DummyFont = uar_rptSetFont(_hReport, _Times70)
; DRAW TEXT --- mrn
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(mrn_dp,char(0)))
set _DummyPen = uar_rptSetPen(_hReport,_pen13S0C0)
; DRAW BAR CODE --- mrn_barcode
set _rptDummy = uar_rptBarCodeInit(RptBCE,RPT_CODE128,OffsetX+0.250,OffsetY+0.958)
set RptBCE->m_recSize = 88
set RptBCE->m_width = 0.83
set RptBCE->m_height = 0.27
set RptBCE->m_rotation = 90
set RptBCE->m_ratio = 300
set RptBCE->m_barWidth = 1
set RptBCE->m_bScale = 1
set RptBCE->m_bPrintInterp = 0
set _rptStat = uar_rptBarCodeEx(_hReport,RPTBCE,build2(barcode_mrn,char(0)))
; DRAW BAR CODE --- fin_barcode
set _rptDummy = uar_rptBarCodeInit(RptBCE,RPT_CODE128,OffsetX+0.625,OffsetY+0.563)
set RptBCE->m_recSize = 88
set RptBCE->m_width = 1.51
set RptBCE->m_height = 0.26
set RptBCE->m_rotation = 0
set RptBCE->m_ratio = 300
set RptBCE->m_barWidth = 1
set RptBCE->m_bPrintInterp = 0
set _rptStat = uar_rptBarCodeEx(_hReport,RPTBCE,build2(barcode_fin,char(0)))
set RptSD->m_flags = 4
set RptSD->m_rotationAngle = 0
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 0.625
set RptSD->m_width = 0.313
set RptSD->m_height = 0.146
set _DummyPen = uar_rptSetPen(_hReport,_pen14S0C0)
; DRAW LABEL --- FieldName14
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("DOB:",char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 1.375
set RptSD->m_width = 0.313
set RptSD->m_height = 0.146
; DRAW LABEL --- FieldName15
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Age:",char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 1.938
set RptSD->m_width = 0.375
set RptSD->m_height = 0.146
; DRAW LABEL --- FieldName16
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Gender:",char(0)))
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 0.625
set RptSD->m_width = 0.313
set RptSD->m_height = 0.146
; DRAW LABEL --- FieldName17
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Admit:",char(0)))
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 0.625
set RptSD->m_width = 0.438
set RptSD->m_height = 0.219
; DRAW LABEL --- FieldName18
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Rm #:",char(0)))
set RptSD->m_flags = 0
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 0.875
set RptSD->m_width = 0.635
set RptSD->m_height = 0.188
; DRAW TEXT --- room19
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(room_dp,char(0)))
set RptSD->m_flags = 4
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 1.250
set RptSD->m_width = 0.688
set RptSD->m_height = 0.188
; DRAW LABEL --- FieldName20
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Pt Type:",char(0)))
set RptSD->m_flags = 0
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 1.625
set RptSD->m_width = 0.885
set RptSD->m_height = 0.198
; DRAW TEXT --- pattype_dpw21
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(pattype_dp,char(0)))
set RptSD->m_y = OffsetY + 0.063
set RptSD->m_x = OffsetX + 3.125
set RptSD->m_width = 2.063
set RptSD->m_height = 0.219
set _DummyFont = uar_rptSetFont(_hReport, _Times9B0)
; DRAW TEXT --- patient_name37
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(full_name,char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 3.375
set RptSD->m_width = 0.510
set RptSD->m_height = 0.219
set _DummyFont = uar_rptSetFont(_hReport, _Times70)
; DRAW TEXT --- dob38
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(dob,char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 4.125
set RptSD->m_width = 0.260
set RptSD->m_height = 0.219
; DRAW TEXT --- age39
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(age_dp,char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 4.813
set RptSD->m_width = 0.573
set RptSD->m_height = 0.219
; DRAW TEXT --- sex40
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(sex_dp,char(0)))
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 3.438
set RptSD->m_width = 0.823
set RptSD->m_height = 0.135
; DRAW TEXT --- admit41
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(admit_dt,char(0)))
set RptSD->m_y = OffsetY + 0.813
set RptSD->m_x = OffsetX + 3.125
set RptSD->m_width = 1.563
set RptSD->m_height = 0.146
set _DummyFont = uar_rptSetFont(_hReport, _Times80)
; DRAW TEXT --- fin42
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(fin,char(0)))
set _DummyPen = uar_rptSetPen(_hReport,_pen13S0C0)
; DRAW BAR CODE --- mrn_barcode43
set _rptDummy = uar_rptBarCodeInit(RptBCE,RPT_CODE128,OffsetX+2.688,OffsetY+0.958)
set RptBCE->m_recSize = 88
set RptBCE->m_width = 0.83
set RptBCE->m_height = 0.27
set RptBCE->m_rotation = 90
set RptBCE->m_ratio = 300
set RptBCE->m_barWidth = 1
set RptBCE->m_bScale = 1
set RptBCE->m_bPrintInterp = 0
set _rptStat = uar_rptBarCodeEx(_hReport,RPTBCE,build2(barcode_mrn,char(0)))
; DRAW BAR CODE --- fin_barcode44
set _rptDummy = uar_rptBarCodeInit(RptBCE,RPT_CODE128,OffsetX+3.125,OffsetY+0.563)
set RptBCE->m_recSize = 88
set RptBCE->m_width = 1.51
set RptBCE->m_height = 0.26
set RptBCE->m_rotation = 0
set RptBCE->m_ratio = 300
set RptBCE->m_barWidth = 1
set RptBCE->m_bPrintInterp = 0
set _rptStat = uar_rptBarCodeEx(_hReport,RPTBCE,build2(barcode_fin,char(0)))
set RptSD->m_flags = 4
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 3.125
set RptSD->m_width = 0.313
set RptSD->m_height = 0.146
set _DummyFont = uar_rptSetFont(_hReport, _Times70)
set _DummyPen = uar_rptSetPen(_hReport,_pen14S0C0)
; DRAW LABEL --- FieldName45
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("DOB:",char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 3.875
set RptSD->m_width = 0.313
set RptSD->m_height = 0.146
; DRAW LABEL --- FieldName46
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Age:",char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 4.438
set RptSD->m_width = 0.375
set RptSD->m_height = 0.146
; DRAW LABEL --- FieldName47
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Gender:",char(0)))
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 3.125
set RptSD->m_width = 0.313
set RptSD->m_height = 0.146
; DRAW LABEL --- FieldName48
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Admit:",char(0)))
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 3.125
set RptSD->m_width = 0.438
set RptSD->m_height = 0.219
; DRAW LABEL --- FieldName49
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Rm #:",char(0)))
set RptSD->m_flags = 0
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 3.375
set RptSD->m_width = 0.635
set RptSD->m_height = 0.188
; DRAW TEXT --- room50
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(room_dp,char(0)))
set RptSD->m_flags = 4
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 3.750
set RptSD->m_width = 0.688
set RptSD->m_height = 0.188
; DRAW LABEL --- FieldName51
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Pt Type:",char(0)))
set RptSD->m_flags = 0
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 4.125
set RptSD->m_width = 0.885
set RptSD->m_height = 0.198
; DRAW TEXT --- pattype_dpw52
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(pattype_dp,char(0)))
set RptSD->m_y = OffsetY + 0.063
set RptSD->m_x = OffsetX + 5.625
set RptSD->m_width = 2.063
set RptSD->m_height = 0.219
set _DummyFont = uar_rptSetFont(_hReport, _Times9B0)
; DRAW TEXT --- patient_name53
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(full_name,char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 5.875
set RptSD->m_width = 0.510
set RptSD->m_height = 0.219
set _DummyFont = uar_rptSetFont(_hReport, _Times70)
; DRAW TEXT --- dob54
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(dob,char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 6.625
set RptSD->m_width = 0.260
set RptSD->m_height = 0.219
; DRAW TEXT --- age55
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(age_dp,char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 7.313
set RptSD->m_width = 0.573
set RptSD->m_height = 0.219
; DRAW TEXT --- sex56
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(sex_dp,char(0)))
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 5.938
set RptSD->m_width = 0.823
set RptSD->m_height = 0.135
; DRAW TEXT --- admit57
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(admit_dt,char(0)))
set RptSD->m_y = OffsetY + 0.813
set RptSD->m_x = OffsetX + 5.625
set RptSD->m_width = 1.563
set RptSD->m_height = 0.146
set _DummyFont = uar_rptSetFont(_hReport, _Times80)
; DRAW TEXT --- fin58
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(fin,char(0)))
set _DummyPen = uar_rptSetPen(_hReport,_pen13S0C0)
; DRAW BAR CODE --- mrn_barcode59
set _rptDummy = uar_rptBarCodeInit(RptBCE,RPT_CODE128,OffsetX+5.188,OffsetY+0.958)
set RptBCE->m_recSize = 88
set RptBCE->m_width = 0.83
set RptBCE->m_height = 0.27
set RptBCE->m_rotation = 90
set RptBCE->m_ratio = 300
set RptBCE->m_barWidth = 1
set RptBCE->m_bScale = 1
set RptBCE->m_bPrintInterp = 0
set _rptStat = uar_rptBarCodeEx(_hReport,RPTBCE,build2(barcode_mrn,char(0)))
; DRAW BAR CODE --- fin_barcode60
set _rptDummy = uar_rptBarCodeInit(RptBCE,RPT_CODE128,OffsetX+5.625,OffsetY+0.563)
set RptBCE->m_recSize = 88
set RptBCE->m_width = 1.51
set RptBCE->m_height = 0.26
set RptBCE->m_rotation = 0
set RptBCE->m_ratio = 300
set RptBCE->m_barWidth = 1
set RptBCE->m_bPrintInterp = 0
set _rptStat = uar_rptBarCodeEx(_hReport,RPTBCE,build2(barcode_fin,char(0)))
set RptSD->m_flags = 4
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 5.625
set RptSD->m_width = 0.313
set RptSD->m_height = 0.146
set _DummyFont = uar_rptSetFont(_hReport, _Times70)
set _DummyPen = uar_rptSetPen(_hReport,_pen14S0C0)
; DRAW LABEL --- FieldName61
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("DOB:",char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 6.375
set RptSD->m_width = 0.313
set RptSD->m_height = 0.146
; DRAW LABEL --- FieldName62
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Age:",char(0)))
set RptSD->m_y = OffsetY + 0.188
set RptSD->m_x = OffsetX + 6.938
set RptSD->m_width = 0.375
set RptSD->m_height = 0.146
; DRAW LABEL --- FieldName63
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Gender:",char(0)))
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 5.625
set RptSD->m_width = 0.313
set RptSD->m_height = 0.146
; DRAW LABEL --- FieldName64
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Admit:",char(0)))
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 5.625
set RptSD->m_width = 0.438
set RptSD->m_height = 0.219
; DRAW LABEL --- FieldName65
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Rm #:",char(0)))
set RptSD->m_flags = 0
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 5.875
set RptSD->m_width = 0.635
set RptSD->m_height = 0.188
; DRAW TEXT --- room66
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(room_dp,char(0)))
set RptSD->m_flags = 4
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 6.250
set RptSD->m_width = 0.688
set RptSD->m_height = 0.188
; DRAW LABEL --- FieldName67
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Pt Type:",char(0)))
set RptSD->m_flags = 0
set RptSD->m_y = OffsetY + 0.438
set RptSD->m_x = OffsetX + 6.625
set RptSD->m_width = 0.885
set RptSD->m_height = 0.198
; DRAW TEXT --- pattype_dpw68
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(pattype_dp,char(0)))
set RptSD->m_rotationAngle = 90
set RptSD->m_y = OffsetY + 0.885
set RptSD->m_x = OffsetX + 2.948
set RptSD->m_width = 0.885
set RptSD->m_height = 0.219
; DRAW TEXT --- mrn69
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(mrn_dp,char(0)))
set RptSD->m_y = OffsetY + 0.885
set RptSD->m_x = OffsetX + 5.469
set RptSD->m_width = 0.885
set RptSD->m_height = 0.219
; DRAW TEXT --- mrn70
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(mrn_dp,char(0)))
set RptSD->m_rotationAngle = 0
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 1.667
set RptSD->m_width = 0.917
set RptSD->m_height = 0.135
; DRAW TEXT --- prov1
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(prov_att,char(0)))
set RptSD->m_flags = 4
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 1.479
set RptSD->m_width = 0.177
set RptSD->m_height = 0.146
; DRAW LABEL --- Prov_lbl1
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Att:",char(0)))
set RptSD->m_flags = 0
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 4.167
set RptSD->m_width = 0.917
set RptSD->m_height = 0.135
; DRAW TEXT --- prov9
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(prov_att,char(0)))
set RptSD->m_flags = 4
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 3.979
set RptSD->m_width = 0.177
set RptSD->m_height = 0.146
; DRAW LABEL --- Prov_lbl10
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Att:",char(0)))
set RptSD->m_flags = 0
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 6.667
set RptSD->m_width = 0.917
set RptSD->m_height = 0.135
; DRAW TEXT --- prov11
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2(prov_att,char(0)))
set RptSD->m_flags = 4
set RptSD->m_y = OffsetY + 0.313
set RptSD->m_x = OffsetX + 6.479
set RptSD->m_width = 0.177
set RptSD->m_height = 0.146
; DRAW LABEL --- Prov_lbl12
set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, build2("Att:",char(0)))
set _DummyFont = uar_rptSetFont(_hReport, _oldFont)
set _DummyPen = uar_rptSetPen(_hReport,_oldPen)
	set _YOffset = OffsetY + sectionHeight
endif
return(sectionHeight)
end ;subroutine DetailSectionABS(nCalc,OffsetX,OffsetY)
 
subroutine InitializeReport(dummy)
set RptReport->m_recSize = 100
set RptReport->m_reportName = "ERM_LABELSHEET_MAYO"
set RptReport->m_pageWidth = 8.50
set RptReport->m_pageHeight = 11.00
set RptReport->m_orientation = Rpt_Portrait
set RptReport->m_marginLeft = 0.50
set RptReport->m_marginRight = 0.50
set RptReport->m_marginTop = 0.63
set RptReport->m_marginBottom = 0.31
set RptReport->m_horzPrintOffset = _XShift
set RptReport->m_vertPrintOffset = _YShift
set _YOffset = RptReport->m_marginTop
set _XOffset = RptReport->m_marginLeft
set _hReport = uar_rptCreateReport(RptReport, _OutputType,Rpt_Inches)
set _rptErr = uar_rptSetErrorLevel(_hReport,Rpt_Error)
set _rptStat = uar_rptStartReport(_hReport)
set _rptPage = uar_rptStartPage(_hReport)
call _CreateFonts(0)
call _CreatePens(0)
end ;_InitializeReport
 
subroutine _CreateFonts(dummy)
set RptFont->m_recSize = 50
set RptFont->m_fontName = RPT_TIMES
set RptFont->m_pointSize = 10
set RptFont->m_bold = RPT_OFF
set RptFont->m_italic = RPT_OFF
set RptFont->m_underline = RPT_OFF
set RptFont->m_strikethrough = RPT_OFF
set RptFont->m_rgbColor = RPT_BLACK
set _Times100 = uar_rptCreateFont(_hReport, RptFont)
set RptFont->m_pointSize = 9
set RptFont->m_bold = RPT_ON
set _Times9B0 = uar_rptCreateFont(_hReport, RptFont)
set RptFont->m_pointSize = 7
set RptFont->m_bold = RPT_OFF
set _Times70 = uar_rptCreateFont(_hReport, RptFont)
set RptFont->m_pointSize = 8
set _Times80 = uar_rptCreateFont(_hReport, RptFont)
end;**************Create Fonts*************
 
subroutine _CreatePens(dummy)
set RptPen->m_recSize = 16
set RptPen->m_penWidth = 0.014
set RptPen->m_penStyle = 0
set RptPen->m_rgbColor =  RPT_BLACK
set _pen14S0C0 = uar_rptCreatePen(_hReport,RptPen)
set RptPen->m_penWidth = 0.014
set _pen13S0C0 = uar_rptCreatePen(_hReport,RptPen)
end;**************Create Pen*************
 
;**************Report Layout End*************
 
 
