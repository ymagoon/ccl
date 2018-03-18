drop program orm_mayo_mn_meds_rec_admission:dba go
create program orm_mayo_mn_meds_rec_admission:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
/*************************************************************************
*                                                                        *
*  Copyright Notice:  (c) 1983 Laboratory Information Systems &          *
*                              Technology, Inc.                          *
*       Revision      (c) 1984-2001 Cerner Corporation                   *
*                                                                        *
*  Cerner (R) Proprietary Rights Notice:  All rights reserved.           *
*  This material contains the valuable properties and trade secrets of   *
*  Cerner Corporation of Kansas City, Missouri, United States of         *
*  America (Cerner), embodying substantial creative efforts and          *
*  confidential information, ideas and expressions, no part of which     *
*  may be reproduced or transmitted in any form or by any means, or      *
*  retained in any storage or retrieval system without the express       *
*  written permission of Cerner.                                         *
*                                                                        *
*  Cerner is a registered mark of Cerner Corporation.                    *
*                                                                        *
**************************************************************************
 
        Source file name:   orm_rpt_meds_rec_admission.prg
        Object name:        orm_rpt_meds_rec_admission
        Request #:
 
        Solution:           Powerchart
        Solution Team:      Orders Management
        HNA Version:        500
        CCL Version:
 
        Program purpose:    Generates a report of outpatient orders for a given patient
 
        Tables read:		None
 
        Tables updated:		None
 
        Executing from:
 
        Special notes:
 
**************************************************************************
                      GENERATED MODIFICATION CONTROL LOG                 *
**************************************************************************
 Mod Date     Engineer     Feature Comment
 --- -------- ------------ ------- ---------------------------------------
 000 11/29/05 AT012526     0069455 Initial release - ITN 119015
 001 12/04/08 NT5990       Customized for MAYO_MN SR 1-2733784281
                           to retrieve the date and time of last taken
 002 03/11/11 Akcia - SE   redo layout of report to allow only showing Reconciled
 							line on last page
 003 05/24/11 Akcia - PL   fix formatting issues and data truncating
 004 06/16/11 Akcia - SE   add "(cont)" on end of line if greater than 4 lines (changes in layoutbuilder)
 005 01/10/12 AKCIA-PEL    Changes to signature line (CAB 44976)                       *
 
*************************************************************************/
 
call echo("***  BEGIN - orm_rpt_meds_rec_admission.prg   ***")
 
record reply
(
	1 elapsed_time = f8
%i ccluserdir:status_block.inc
)
 
 
;****************************************************************************
; BUILDING SCRIPT VARIABLES
;****************************************************************************
declare getStringFitLen(fitString = vc, cellWidth = f8,cellHeight = f8) = i4
declare person_id = f8 with protect
declare encntr_id = f8 with protect
declare printer_name = vc with protect
declare dummy_val = f8 with protect
declare num_allergies = i4 with protect
declare title = vc with protect
declare allergies_disp = vc with protect
declare room_bed = vc with protect
declare drug_details = vc with protect
declare allergy_list = vc with protect
declare allergy_list2 = vc with protect
declare secondstr = vc with protect
declare fit_length = i4 with protect
declare fit_length2 = i4 with protect
declare bGrow = i1 with protect, noconstant(1)
declare foot_rpt_flag = i1 with protect, noconstant(0)
declare errorCode = i2 with protect, noconstant(0)
DECLARE  _HI18NHANDLE  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT ;005
;001 %i cclsource:orm_rpt_meds_rec_error_codes.inc
;001 %i cclsource:orm_rpt_meds_rec_orders_record.inc
%i ccluserdir:orm_mayo_mn_meds_rec_error_codes.inc     ;001
%i ccluserdir:orm_mayo_mn_meds_rec_orders_record.inc   ;001
 
execute ReportRtl
%i mhs_prg:orm_mayo_mn_meds_rec_admission.dvl
set lRetVal = uar_i18nlocalizationinit(_hI18NHandle, curprog, "", curcclrev)
 
 
;****************************************************************************
; BUILDING PATIENT REQUEST STRUCTURE
;****************************************************************************
;001 %i cclsource:orm_rpt_meds_rec_requests.inc
%i ccluserdir:orm_mayo_mn_meds_rec_requests.inc   ;001
set errorCode = BuildPatientRequest("")
if (errorCode != SUCCESS)
	go to EXIT_SCRIPT
endif
 
 
 
 
;****************************************************************************
; BUILDING PATIENT INFO
;****************************************************************************
;001 %i cclsource:orm_rpt_meds_rec_patient_data.inc
%i ccluserdir:orm_mayo_mn_meds_rec_patient_data.inc   ;001
set errorCode = LoadPatientInfo("")
if (errorCode != SUCCESS)
	go to EXIT_SCRIPT
endif
 
 
 
;****************************************************************************
; BUILDING OUTPATIENT ORDER LIST
;****************************************************************************
;001 %i cclsource:orm_rpt_meds_rec_admission_data.inc
%i ccluserdir:orm_mayo_mn_meds_rec_admission_data.inc  ;001
set errorCode = LoadOutpatOrdersOfPatient("")
if (errorCode != SUCCESS)
	go to EXIT_SCRIPT
endif
 
 
 
;****************************************************************************
; GENERATING ADMISSION REPORT
;****************************************************************************
call InitializeReport(0)
 
set _fEndDetail = RptReport->m_pageHeight - RptReport->m_marginBottom
 
;002  set dummy_val = tableRpt(rpt_render, _fEndDetail-_YOffset, bGrow)
 
 
;002 start
SELECT
	orders_list_mnemonic = SUBSTRING(1, 30, cnvtupper(ordersRec->orders_list [D.SEQ].mnemonic) )
	, o_seq = d.seq
 
FROM
	(DUMMYT   D  WITH SEQ =  VALUE(SIZE(ordersRec->orders_list, 5)))
 
ORDER BY
	;d.seq
 orders_list_mnemonic
head page
  x = HeaderSection(rpt_render)
  last_page = "N"
  last_record = "N"
  record_cnt = 0
  new_page_ind = 1
 
 
head d.seq
record_cnt = record_cnt + 1
x_cnt = 1 ;003
last_line = 1 ;003 used to flex the botton line after the comments.
comp_comment_cnt = size(ordersRec->orders_list[d.seq].details.comp_comment_lines,5)
comment_cnt = size(ordersRec->orders_list[d.seq].details.ord_comment_lines,5)
drug_line_cnt = size(ordersRec->orders_list[d.seq].med_lines,5)
 
detail_len = SepLineSection0(1)
detail_len = detail_len +DetailSection(1)
detail_len = detail_len + PageFooterSection(1)
detail_len = detail_len + detail_order_info(1)
 
  if (drug_line_cnt >1)
     for (x_cnt = 2 to drug_line_cnt)
 
        detail_len = detail_len + DetailDrugSection1(1)
     endfor
 
  endif
  for (x_cnt = 1 to comp_comment_cnt)
	  detail_len = detail_len + CompCommentSection(1)
  endfor
  for (x_cnt = 1 to comment_cnt)
	  detail_len = detail_len + OrdCommentSection(1)
  endfor
;if (_Yoffset + DetailSection(1) + PageFooterSection(1) + detail_order_info(1)+
;	DetailDrugSection1(1) > _fEndDetail)
x_cnt = 1 ;003
if (_Yoffset + detail_len > _fEndDetail)
   my_Yoffset = _Yoffset
 _Yoffset = _fEndDetail - 1.2
 x = PageFooterSection1(rpt_render);;;005
 _Yoffset = my_Yoffset
  call PageBreak(0)
  new_page_ind = 1  ;003
  x = HeaderSection(rpt_render)
  x = SepLineSection0(rpt_render)
  x = DetailSection(rpt_render)
 
  call echo("*********************med_line count ***********************************")
  call echo(drug_line_cnt)
  if (drug_line_cnt >1)
     for (x_cnt = 2 to drug_line_cnt)
      call echo(build( "in for loop, x_cnt = ",x_cnt))
        x = DetailDrugSection1(rpt_render)
     endfor
  elseif(ordersRec->orders_list[d.seq].details[1].last_admin_dt_tm > " ")
  		x_cnt = 2
        x = DetailDrugSection1(rpt_render)
 
;;  else
;;     x_cnt = 2
;;  	 x = DetailDrugSection1(rpt_render)
  endif
  x = detail_order_info(rpt_render)
  for (x_cnt = 1 to comp_comment_cnt)
	  detail_len = detail_len + CompCommentSection(rpt_render)
  endfor
  for (x_cnt = 1 to comment_cnt)
	  x = OrdCommentSection(rpt_render)
  endfor
  x = FillerSection(rpt_render)
else
  x = SepLineSection0(rpt_render)
 
  x = DetailSection(rpt_render)
  drug_line_cnt = size(ordersRec->orders_list[d.seq].med_lines,5)
  call echo("*********************med_line count ***********************************")
  call echo(drug_line_cnt)
  if (drug_line_cnt >1)
     for (x_cnt = 2 to drug_line_cnt)
      call echo(build( "in for loop, x_cnt = ",x_cnt))
        x = DetailDrugSection1(rpt_render)
     endfor
  elseif(ordersRec->orders_list[d.seq].details[1].last_admin_dt_tm > " ")
  		x_cnt = 2
        x = DetailDrugSection1(rpt_render)
 
;;  else
;;     x_cnt = 2
;;  	 x = DetailDrugSection1(rpt_render)
  endif
  x = detail_order_info(rpt_render)
  for (x_cnt = 1 to comp_comment_cnt)
	  detail_len = detail_len + CompCommentSection(rpt_render)
  endfor
  for (x_cnt = 1 to comment_cnt)
	  x = OrdCommentSection(rpt_render)
  endfor
  x = FillerSection(rpt_render)
 
endif
;if (d.seq = SIZE(ordersRec->orders_list, 5))
if (record_cnt =  SIZE(ordersRec->orders_list, 5))
  last_page = "Y"
endif
new_page_ind = 0  ;003
foot page
 my_Yoffset = _Yoffset
 _Yoffset = _fEndDetail - 1.2
;;if (  last_page = "Y")  ;005
;; x = PageFooterSection1(rpt_render)
;;else ;005
 x = PageFooterSection(rpt_render);005
;;endif;005
 _Yoffset = my_Yoffset
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
;002 end
 
call FinalizeReport(printer_name)
 
 
 
;****************************************************************************
; GET FIT LENGTH FOR VISUAL REPORT LAYOUT
;****************************************************************************
subroutine getStringFitLen(fitString, cellWidth,cellHeight)
	declare sectionHeight = f8 with noconstant(0.498906), private
 
	;if changing alignments, make sure to add those flags from dvl
 
	set RptSD->m_flags = 12 + RPT_SDCALCRECT
	set RptSD->m_borders = RPT_SDNOBORDERS
	set RptSD->m_padding = RPT_SDLEFTBORDER
	set RptSD->m_paddingWidth = 0.040
	set RptSD->m_lineSpacing = RPT_SINGLE
	set RptSD->m_rotationAngle = 0
	set RptSD->m_y = 0
	set RptSD->m_x = 0
	set RptSD->m_width = cellWidth
	set RptSD->m_height = cellHeight
	set _oldPen = uar_rptSetPen(_hReport,_pen14S0C0)
	set _fDrawHeight = uar_rptStringDraw(_hReport, RptSD, nullterm(build2(fitString,char(0))))
	set _DummyPen = uar_rptSetPen(_hReport,_oldPen)
 
	return (RptSD->m_drawlength)
end
 
 
 
;****************************************************************************
; SCRIPT CLEANUP AND ERROR HANDLING
;****************************************************************************
#EXIT_SCRIPT
 
call StatusHandler("")
call DestroyRecords("")
 
call echo("***  END - orm_rpt_meds_rec_admission.prg  ***")
 
end
go
 
