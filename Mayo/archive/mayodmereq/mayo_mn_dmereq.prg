  drop program mayodmereq:dba go
create program mayodmereq:dba
/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-2003 Cerner Corporation                 *
 *                                                                      *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
 *  This material contains the valuable properties and trade secrets of *
 *  Cerner Corporation of Kansas City, Missouri, United States of       *
 *  America (Cerner), embodying substantial creative efforts and        *
 *  confidential information, ideas and expressions, no part of which   *
 *  may be reproduced or transmitted in any form or by any means, or    *
 *  retained in any storage or retrieval system without the express     *
 *  written permission of Cerner.                                       *
 *                                                                      *
 *  Cerner is a registered mark of Cerner Corporation.                  *
 *                                                                      *
 ************************************************************************
 
        Source file name:       RXREQGEN01.PRG
        Object name:            RXREQGEN01
        Task #:                 NA
        Request #:              NA
 
        Product:                EasyScript (Rx printing)
        Product Team:           PowerChart Office
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Print/Fax Rx requisitions
 
        Special Notes:          Generic script based off of TMMC_FL_PCORXRECGEN,
                                written by Steven Farmer.
 
 ************************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                  *
 ************************************************************************
 *                                                                      *
 *Mod Date     Engineer Comment                                         *
 *--- -------- -------- ----------------------------------------------- *
 *000 02/11/03 JF8275   Initial Release                                 *
 *001 05/21/03 SF3151   Correct Drug Sorting                            *
 *002 06/09/03 SF3151   Validate Don't Print detail is valued           *
 *003 06/10/03 SF3151   1) Print COMPLETE orders                        *
 *                      2) Print STREET_ADDR2 for patient               *
 *                      3) Remove Re-print indicator                    *
 *004 06/17/03 SF3151   Throw error if can't find CSA_SCHEDULE          *
 *005 06/23/03 SF3151   Correct Phone Format                            *
 *006 07/02/03 SF3151   Correct Multum table check                      *
 *007 12/10/03 BP9613   Replacing Dispense Duration to Dispense when    *
 *                      necessary.                                      *
 *008 12/29/03 JF8275   Fix defects CAPEP00113087 and CAPEP00112906     *
 *009 01/09/04 JF8275   Added fix for volume dose                       *
 *010 01/14/04 JF8275   Group Misc. Meds individually by csa_group      *
 *011 04/02/04 BP9613   Ordering on the correct parameter               *
 *012 07/09/04 IT010631 Refill and Mid-level enahncement changes        *
 *013 07/16/04 PC3603   Fix refill/renew issues                         *
 *014 08/25/04 PC3603   Subtract one from additional refill field because
 *                      it was incremented when it was refilled         *
 *015 01/07/05 BP9613   Front end printing enhancement change:          *
 *                      Ordering the print jobs for one printer call    *
 *                      while still grouping the fax jobs the same      *
 *016 04/04/05 SF3151   Access Righs                                    *
 *017 04/08/05 SF3151   Handle traversing prsnl_org orgs correctly      *
 *018 04/11/05 SF3151   Handle Getting prsnl_org orgs correctly         *
 *019 10/20/05 KS012546 Printing does not occur on the complete action  *
 *                      for orders that are not one times.              *
 *020 02/02/06 KS012546 Requisitions no longer print "PRN" on SIG line  *
 *                      after PRN instructions removed.                 *
 *021 02/13/06 MJ6234   Selecting from frequency schedule is done using *
 *                      dummyt table instead of expand function.        *
 *022 02/22/07 AC013650 Time stamps added to determine if an order with *
 *                      a complete action should be printed             *
 *023 05/24/07 RD012555 Changed naming convention of fax output to      *
 *                      ensure uniqueness.                              *
 *024 05/24/07 RD012555 Prescriptions without a frequency will not print*
 *                      twice when taking a complete action.            *
 *025 08/07/07 RD012555 Add ellipsis to mnemonics that are truncated.   *
 *026 05/06/08 SA016585 Changed the ORDER and HEAD section of select for*
 *                      DEA number to print the DEA number of the       *
 *                      prescribing physician when supervising physician*
 *                      is present.                                     *
 *027 07/18/08 WC014474 Stop printing if order status is med student.   *
 *028 07/23/08 WC014474 Print NPI number                                *
 *029 08/07/08 MK012585 Fix to print both DEA and NPI aliases correctly *
 *030 10/30/08 SJ016555 For Orders containing both strength and volume  *
 *                      dose the requisitions will print both strength  *
 *                      and volume doses for Primary, Brand and C type  *
 *                      mnemonics                                       *
 *031 11/14/08 SA016585 Introduced Order by Sup_phys_id to print        *
 *                      multiple RX on different pages if they have diff*
 *                      sup_phys_id.  Removed order by d.seq since order*
 *                      by can be done at most on 10 items.             *
 *032 12/22/08 SW015124 Added drug form detail.                         *
 *033 01/20/09 CG011817 Changes for stacked suspend on new order.       *
 *034 02/20/09 CH014039 Create DME Req for UNIV_NM Feature #: 201400    *
 *CMB 04/21/09 MC4839   Adding below MAYO_MN mods from mayorxreq to dme *
 *                      req which should resolve address issue described*
 *                      in SR 1-3207566471, among others - using CMB as *
 *                      mod # since I'm combining two scripts and not   *
 *                      actually making any new modifications           *
 *----------------------CMB BEGIN---------------------------------------*
 *035 05/07/08          Edit for MAYO_MN (excluding NPI covered by 028) *
 *036 10/15/08          Edit for MAYO_MN SR 1-1442197551                *
 *037 11/17/08          Edit for MAYO_MN SR 1-2694038151                *
 *038 11/17/08          Edit for MAYO_MN SR 1-2639402545                *
 *039 12/10/08          Changed Address for SR 1-2733515601             *
 *040 02/04/09          Corrected NPI number display SR 1-3023359281    *
 *041 04/16/09          Move DEA # field to the right to avoid bleeding *
 *----------------------CMB END-----------------------------------------*
 *043 05/07/09 MC4839   Correct DME req not faxing SR 1-3255958612      *
 *044 06/23/09 MC4839   CAB 6227 - Use Phys Address oe field (if any)   *
 *                      (just backing out mod 039)                      *
 *045 06/23/09 MC4839   CAB 6227 - Use sec phone when sec address used  *
 *046 06/23/09 MC4839   Move page break logic to ensure correct phone   *
 *                      and address used on each page (based on 1st med)*
 *047 07/08/09 MC4839   Correct logic for weight event                  *
 *048 08/26/09 Akcia	change the signature lines						*
 *049 06/02/11 Akcia    Rebranding                                      *
 *050 05/19/14 Akcia	make changes suggested by Cerner for efficiency *
 ****************************************************************************
 
 *****************************************************************************************************************
 *                                                                                                                *
 *Mod Date     Engineer CAB    Comment                                                                            *
 *--- -------- -------- ------ ---------------------------------------------------------------------------------- *
 
 *051 05/28/14 Akcia    60210  Added code to to diagnosis display                                                 *
 *052 05/29/14 Akcia    60588  Added sign date and time for e-sig                                                 *
 
 *****************************************************************************************************************/
 
/****************************************************************************
*       Request record                                                      *
*****************************************************************************/
;*** requisitions should always have the request defined (not commented out)
;*** order of the request fields matter.
record request
(
  1 person_id         = f8
  1 print_prsnl_id    = f8
  1 order_qual[*]
    2 order_id        = f8
    2 encntr_id       = f8
    2 conversation_id = f8
  1 printer_name      = c50
)
 
call echorecord(request)
 
/****************************************************************************
*       Reply record                                                        *
*****************************************************************************/
free record reply
record reply
(
%i cclsource:status_block.inc
)
 
/****************************************************************************
*       Include files                                                       *
*****************************************************************************/
;%i cclsource:cps_header_declares.inc
 
if (validate(FALSE,-1) = -1)
   set FALSE         = 0
endif
if (validate(TRUE,-1) = -1)
   set TRUE          = 1
endif
set GEN_NBR_ERROR = 3      ;*** error generating a sequence number
set INSERT_ERROR  = 4      ;*** error inserting item
set UPDATE_ERROR  = 5      ;*** error updating item
set DELETE_ERROR  = 6      ;*** error deleteing item
set SELECT_ERROR  = 7      ;*** error selecting item
set LOCK_ERROR    = 8
set INPUT_ERROR   = 9      ;*** error in request data
set EXE_ERROR     = 10     ;*** error in execution of embedded program
set failed        = FALSE  ;*** holds failure status of script
set table_name    = fillstring (50, " ")
set sErrMsg       = fillstring(132, " ")
set iErrCode      = error(sErrMsg,1)
set iErrCode      = 0
 
/****************************************************************************
*       Declare variables                                                   *
*****************************************************************************/
declare new_rx_text    = c22 with public, constant("Prescription Details:") ;012
declare refill_rx_text = c22 with public, constant("Prescription Details:") ;012
declare reprint_text   = c24 with public, constant("RE-PRINT Prescription(s)")
declare is_a_reprint   = i2 with public, noconstant(FALSE)
declare v500_ind       = i2 with public, noconstant(FALSE)
declare use_pco        = i2 with public, noconstant(FALSE)
declare mltm_loaded    = i2 with public, noconstant(FALSE)
declare non_blank_nbr  = i2 with public, noconstant(TRUE) ;008
declare found_npi      = i2 with public, noconstant(FALSE);028
declare found_npi_sup  = i2 with public, noconstant(FALSE);028
 
declare username  = vc with public, noconstant(" ")
declare file_name = vc with public, noconstant(" ")
 
declare work_add_cd         = f8 with public, noconstant(0.0)
declare work2_add_cd        = f8 with public, constant(UAR_GET_CODE_BY("MEANING",212,"SECBUSINESS"))  /*045*/
declare home_add_cd         = f8 with public, noconstant(0.0)
declare work_phone_cd       = f8 with public, noconstant(0.0)
declare work2_phone_cd      = f8 with public, constant(UAR_GET_CODE_BY("MEANING",43,"SECBUSINESS"))  /*045*/
declare home_phone_cd       = f8 with public, noconstant(0.0)
declare order_cd            = f8 with public, noconstant(0.0)
declare complete_cd         = f8 with public, noconstant(0.0)
declare modify_cd           = f8 with public, noconstant(0.0)
declare suspend_cd          = f8 with public, noconstant(0.0);033
declare studactivate_cd     = f8 with public, noconstant(0.0)
declare docdea_cd           = f8 with public, noconstant(0.0)
declare licensenbr_cd       = f8 with public, noconstant(0.0)
declare canceled_allergy_cd = f8 with public, noconstant(0.0)
declare emrn_cd             = f8 with public, noconstant(0.0)
declare pmrn_cd             = f8 with public, noconstant(0.0)
declare ord_comment_cd      = f8 with public, noconstant(0.0)
declare prsnl_type_cd       = f8 with public,noconstant(0.0)
declare medstudent_hold_cd  = f8 with public, noconstant(0.0);027
declare docnpi_cd           = f8 with public, noconstant(0.0);028
declare eprsnl_ind          = i2 with public,noconstant(FALSE)
declare code_set    = i4  with public, noconstant(0)
declare cdf_meaning = c12 with public, noconstant(fillstring(12," "))
declare csa_group_cnt       = i4 with public, noconstant(0)   ;010
declare temp_csa_group      = vc with public, noconstant(" ") ;010
declare pos                 = i4 with protect, noconstant(0)        ;019
declare j                   = i4 with protect, noconstant(0)        ;019
 
;*** MOD 016 BEG
declare bPersonOrgSecurityOn = i2 with public,noconstant(FALSE)
declare dminfo_ok = i2 with private,noconstant(FALSE)
declare algy_bit_pos = i2 with public,noconstant(0)
declare algy_access_priv = f8 with public,noconstant(0.0)
declare access_granted = i2 with public,noconstant(FALSE)
declare user_id = f8 with public,noconstant(0.0)
declare eidx = i4 with public,noconstant(0)
declare fidx = i4 with public,noconstant(0)
declare adr_exist = i2 with public,noconstant(FALSE)
;*** MOD 016 END
 
declare mnemonic_size = i4 with protect, noconstant(0)        ;025
declare mnem_length = i4 with protect, noconstant(0)        ;025
 
declare primary_mnemonic_type_cd = f8 with protect, noconstant(0.0)
declare brand_mnemonic_type_cd   = f8 with protect, noconstant(0.0)
declare c_mnemonic_type_cd       = f8 with protect, noconstant(0.0)
 
;032 Start
declare generic_top_type_cd = f8 with protect, noconstant(0.0)
declare trade_top_type_cd = f8 with protect, noconstant(0.0)
declare generic_prod_type_cd = f8 with protect, noconstant(0.0)
declare trade_prod_type_cd = f8 with protect, noconstant(0.0)
;032 End
 
/*047 BEGIN*/
declare INERROR1_CD     = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",8,"IN ERROR"))
declare INERROR2_CD     = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",8,"INERRNOMUT"))
declare INERROR3_CD     = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",8,"INERRNOVIEW"))
declare INERROR4_CD     = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",8,"INERROR"))
/*047 END*/
 
/****************************************************************************
*       Initialize variables                                                *
*****************************************************************************/
set code_set = 212
set cdf_meaning = "HOME"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,home_add_cd)
 
if (home_add_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 212
set cdf_meaning = "BUSINESS"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,work_add_cd)
if (work_add_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 43
set cdf_meaning = "HOME"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,home_phone_cd)
if (home_phone_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 43
set cdf_meaning = "BUSINESS"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,work_phone_cd)
if (work_phone_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 6003
set cdf_meaning = "ORDER"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,order_cd)
if (order_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 6003
set cdf_meaning = "COMPLETE"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,complete_cd)
if (complete_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 6003
set cdf_meaning = "MODIFY"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,modify_cd)
if (modify_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 6003
set cdf_meaning = "STUDACTIVATE"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,studactivate_cd)
if (studactivate_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
;Begin Mod 033
set code_set = 6003
set cdf_meaning = "SUSPEND"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,suspend_cd)
if (suspend_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
;End Mod 033
 
set code_set = 12025
set cdf_meaning = "CANCELED"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,canceled_allergy_cd)
if (canceled_allergy_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 320
set cdf_meaning = "LICENSENBR"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,licensenbr_cd)
if (licensenbr_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 320
set cdf_meaning = "DOCDEA"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,docdea_cd)
if (docdea_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
/*** start 027 ***/
set code_set = 6004
set cdf_meaning = "MEDSTUDENT"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,medstudent_hold_cd)
if (medstudent_hold_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
/*** end 027 ***/
 
/*** start 028 ***/
set code_set = 320
set cdf_meaning = "NPI"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,docnpi_cd)
if (docnpi_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
/*** end 028 ***/
 
set code_set = 319
set cdf_meaning = "MRN"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,emrn_cd)
if (emrn_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 4
set cdf_meaning = "MRN"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,pmrn_cd)
if (pmrn_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Unable to find the Code Value for ",
                         trim(cdf_meaning),
                         " in Code Set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 14
set cdf_meaning = "ORD COMMENT"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,ord_comment_cd)
if (ord_comment_cd < 1)
    set failed = SELECT_ERROR
    set table_name = "CODE_VALUE"
    set sErrMsg = concat("Failed to find the code_value for ",
                         trim(cdf_meaning),
                         " in code_set ",
                         trim(cnvtstring(code_set)))
    go to EXIT_SCRIPT
endif
 
set code_set = 213
set cdf_meaning = "PRSNL"
set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,1,prsnl_type_cd)
if (prsnl_type_cd < 1)
   set failed = SELECT_ERROR
   set table_name = "CODE_VALUE"
   set sErrMsg = concat("Failed to find the code_value for ",
                        trim(cdf_meaning),
                        " in code_set ",
                        trim(cnvtstring(code_set)))
   go to EXIT_SCRIPT
endif
 
;030
set code_set = 6011
set cdf_meaning = "PRIMARY"
set stat = uar_get_meaning_by_codeset(code_set, cdf_meaning, 1, primary_mnemonic_type_cd)
if (primary_mnemonic_type_cd < 1)
   set failed = SELECT_ERROR
   set table_name = "CODE_VALUE"
   set sErrMsg = concat("Failed to find the code_value for ",
                        trim(cdf_meaning),
                        " in code_set ",
                        trim(cnvtstring(code_set)))
   go to EXIT_SCRIPT
endif
 
set cdf_meaning = "BRANDNAME"
set stat = uar_get_meaning_by_codeset(code_set, cdf_meaning, 1, brand_mnemonic_type_cd)
if (brand_mnemonic_type_cd < 1)
   set failed = SELECT_ERROR
   set table_name = "CODE_VALUE"
   set sErrMsg = concat("Failed to find the code_value for ",
                        trim(cdf_meaning),
                        " in code_set ",
                        trim(cnvtstring(code_set)))
   go to EXIT_SCRIPT
endif
 
set cdf_meaning = "DISPDRUG"
set stat = uar_get_meaning_by_codeset(code_set, cdf_meaning, 1, c_mnemonic_type_cd)
 
if (c_mnemonic_type_cd < 1)
   set failed = SELECT_ERROR
   set table_name = "CODE_VALUE"
   set sErrMsg = concat("Failed to find the code_value for ",
                        trim(cdf_meaning),
                        " in code_set ",
                        trim(cnvtstring(code_set)))
   go to EXIT_SCRIPT
endif
 
;032 Start
set cdf_meaning = "GENERICTOP"
set stat = uar_get_meaning_by_codeset(code_set, cdf_meaning, 1, generic_top_type_cd)
if (generic_top_type_cd < 1)
   set failed = SELECT_ERROR
   set table_name = "CODE_VALUE"
   set sErrMsg = concat("Failed to find the code_value for ",
                        trim(cdf_meaning),
                        " in code_set ",
                        trim(cnvtstring(code_set)))
   go to EXIT_SCRIPT
endif
 
set cdf_meaning = "TRADETOP"
set stat = uar_get_meaning_by_codeset(code_set, cdf_meaning, 1, trade_top_type_cd)
if (trade_top_type_cd < 1)
   set failed = SELECT_ERROR
   set table_name = "CODE_VALUE"
   set sErrMsg = concat("Failed to find the code_value for ",
                        trim(cdf_meaning),
                        " in code_set ",
                        trim(cnvtstring(code_set)))
   go to EXIT_SCRIPT
endif
 
set cdf_meaning = "GENERICPROD"
set stat = uar_get_meaning_by_codeset(code_set, cdf_meaning, 1, generic_prod_type_cd)
if (generic_prod_type_cd < 1)
   set failed = SELECT_ERROR
   set table_name = "CODE_VALUE"
   set sErrMsg = concat("Failed to find the code_value for ",
                        trim(cdf_meaning),
                        " in code_set ",
                        trim(cnvtstring(code_set)))
   go to EXIT_SCRIPT
endif
 
set cdf_meaning = "TRADEPROD"
set stat = uar_get_meaning_by_codeset(code_set, cdf_meaning, 1, trade_prod_type_cd)
if (trade_prod_type_cd < 1)
   set failed = SELECT_ERROR
   set table_name = "CODE_VALUE"
   set sErrMsg = concat("Failed to find the code_value for ",
                        trim(cdf_meaning),
                        " in code_set ",
                        trim(cnvtstring(code_set)))
   go to EXIT_SCRIPT
endif
;032 End
 
; determine if this is a reprint
if (request->print_prsnl_id > 0)
    set is_a_reprint = TRUE
endif
call echo(build2("*** is_a_reprint = ", is_a_reprint))
 
; find printer
if (is_a_reprint = FALSE)
    select into "nl:"
    from
        prsnl p
    plan p where
        p.person_id = reqinfo->updt_id
    head report
        username = trim(substring(1,12,p.username))
    with nocounter
endif
 
if (not(username > " "))
   set username = "faxreq"
endif
 
call echo ("***")
call echo (build("*** username :",username))
call echo ("***")
/****************************************************************************
*       load patient demographics                                           *
*****************************************************************************/
free record demo_info
record demo_info
(
  1 pat_id         = f8
  1 pat_name       = vc
  1 pat_sex        = vc
  1 pat_bday       = vc
  1 pat_age        = vc
  1 pat_addr       = vc
  1 pat_city       = vc
  1 pat_hphone     = vc
  1 pat_wphone     = vc
  1 pat_weight	   = vc ;035
  1 start_dt       = dq8 ;035
  1 end_dt         = dq8 ;035
  1 allergy_line   = vc
  1 allergy_knt    = i4
  1 allergy[*]
    2 disp         = vc
)
 
;*** get name and address information
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
declare weight = f8 with public, constant(uar_get_code_by("DISPLAYKEY",72,"ACTUALWEIGHT")) ;035
;052 declare print_ind = i2 with protected, noconstant(0) ;035
declare print_ind = i2 with protect, noconstant(0) ;052  clean up run time errors
 
set demo_info->start_dt = cnvtagedatetime(18,0,0,0) ;035
set demo_info->end_dt = cnvtagedatetime(0,0,0,0) ;035
 
select distinct into "nl:"
from
    person p,
    address a
;047     ,clinical_event c, ;035
;047     encounter e ;035
plan p where
    p.person_id = request->person_id
;047 join e where e.person_id = p.person_id ;035
join a where
    a.parent_entity_id = outerjoin(p.person_id) and
    a.parent_entity_name = outerjoin("PERSON") and
    a.address_type_cd = outerjoin(home_add_cd) and
    (a.active_ind = outerjoin(1) and
     a.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3)) and
     a.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3)))
;047 join c where c.event_cd = outerjoin(weight) ;035 Beg
;047 	and c.encntr_id = outerjoin(e.encntr_id) ;035 End
order
    ;a.beg_effective_dt_tm desc
    a.address_id
 
head report
    demo_info->pat_id   = p.person_id
    demo_info->pat_name = trim(p.name_full_formatted)
    demo_info->pat_sex  = trim(uar_get_code_display(p.sex_cd))
    demo_info->pat_bday = format(cnvtdatetime(p.birth_dt_tm),"mm/dd/yyyy;;d")
    demo_info->pat_age  = cnvtage(p.birth_dt_tm)
;047     weight_val = substring(1,5, c.result_val) ;035 Beg
;047     weight_unit = substring(1,3, UAR_GET_CODE_DISPLAY(C.RESULT_UNITS_CD))
;047     weight_str = concat(weight_val, " ", weight_unit)
;047     demo_info->pat_weight = weight_str ;035 End
    found_address = FALSE
 
    if(cnvtdatetime(p.birth_dt_tm) between demo_info->start_dt and demo_info->end_dt) ;035 Beg
    	print_ind = 1
    endif ;035 End
 
head a.address_id
 
    if (a.address_id > 0 and found_address = FALSE)
        found_address = TRUE
        demo_info->pat_addr = trim(substring(1,33,a.street_addr))
        if (a.street_addr2 > " ")
            demo_info->pat_addr = trim(substring(1,33,trim(concat(trim(demo_info->pat_addr),", ",trim(a.street_addr2)))))
        endif
 
        demo_info->pat_city = trim(a.city)
 
        if (a.state_cd > 0)
            demo_info->pat_city = concat(trim(demo_info->pat_city),", ",trim(uar_get_code_display(a.state_cd)))
        elseif (a.state > " ")
            demo_info->pat_city = concat(trim(demo_info->pat_city),", ",trim(a.state))
        endif
 
        if (a.zipcode > " ")
            demo_info->pat_city = concat(trim(demo_info->pat_city)," ",trim(a.zipcode))
        endif
 
        demo_info->pat_city = trim(substring(1,33,demo_info->pat_city))
    endif
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "NAME_ADDRESS"
    go to EXIT_SCRIPT
endif
 
/*047 BEGIN*/
SELECT INTO "nl:"
FROM encounter e,
  clinical_event c
PLAN e WHERE e.person_id = request->person_id
JOIN c WHERE c.event_cd = weight
  and c.person_id = e.person_id		;050
  AND c.encntr_id = e.encntr_id
  AND c.result_status_cd NOT IN (INERROR1_CD,INERROR2_CD,INERROR3_CD,INERROR4_CD)
  AND c.valid_until_dt_tm = cnvtdatetime("31-DEC-2100")
ORDER
  c.person_id,
  c.event_end_dt_tm DESC
HEAD c.person_id
  weight_val = substring(1,5, c.result_val)
  weight_unit = substring(1,3, UAR_GET_CODE_DISPLAY(C.RESULT_UNITS_CD))
  weight_str = concat(weight_val, " ", weight_unit)
  demo_info->pat_weight = weight_str
WITH nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "CLINICAL_EVENT"
    go to EXIT_SCRIPT
endif
/*047 END*/
 
;*** get patient phone numbers
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
from
    phone p
plan p where
    p.parent_entity_id = request->person_id and
    p.parent_entity_name = "PERSON" and
    p.phone_type_cd in (home_phone_cd,work_phone_cd) and
    (p.active_ind = 1 and
     p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
     p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
order
    p.beg_effective_dt_tm desc
 
head report
    found_home = FALSE
    found_work = FALSE
 
detail
    if (found_home = FALSE and p.phone_type_cd = home_phone_cd)
        found_home = TRUE
        demo_info->pat_hphone = trim(cnvtphone(p.phone_num,p.phone_format_cd,2))
    endif
 
    if (found_work = FALSE and p.phone_type_cd = work_phone_cd)
        found_work = TRUE
        demo_info->pat_wphone = trim(cnvtphone(p.phone_num,p.phone_format_cd,2))
   endif
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "PATIENT_PHONE"
    go to EXIT_SCRIPT
endif
 
;*** get allergy info
 
;*** MOD 016 BEG
;*** Is Person/Org Security On ================================================
 
;*** Check to see if ADR table exist.  If it exist then Person/Org Security
;*** may be on
 
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
from
    dba_tables d
plan d where
    d.table_name = "ACTIVITY_DATA_RELTN" and
    d.owner = "V500"
detail
    adr_exist = TRUE
with nocounter
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "DBA_TABLES"
    go to EXIT_SCRIPT
endif
 
if (adr_exist = TRUE)
;*** determine if Person/Org Security is on
   set dminfo_ok = validate( ccldminfo->mode, 0 )
   if(dminfo_ok = 1)
      if (ccldminfo->sec_org_reltn = 1 and ccldminfo->person_org_sec = 1)
         set bPersonOrgSecurityOn = TRUE
      endif
   else
      set iErrCode = error(sErrMsg,1)
      set iErrCode = 0
      select into "nl:"
      from dm_info di
      plan di
         where di.info_domain = "SECURITY"
         and di.info_name in ("SEC_ORG_RELTN", "PERSON_ORG_SEC")
         and di.info_number = 1
      head report
         encntr_org_sec_on = 0
         person_org_sec_on = 0
      detail
         if (di.info_name = "SEC_ORG_RELTN" and di.info_number = 1)
            encntr_org_sec_on = 1
         elseif (di.info_name = "PERSON_ORG_SEC")
            person_org_sec_on = 1
         endif
      foot report
         if (person_org_sec_on = 1 and encntr_org_sec_on = 1)
            bPersonOrgSecurityOn = TRUE
         endif
      with nocounter
      set iErrCode = error(sErrMsg,1)
      if (iErrCode > 0)
         set failed = SELECT_ERROR
         set table_name = "DM_INFO"
         go to EXIT_SCRIPT
      endif
   endif
endif
 
if (bPersonOrgSecurityOn = TRUE)
;*** If Person/Org Security is on check to see if the User has an "Override" Person/Prsnl
;*** relationship to the patient.  If and "Override" relationship exist then act as if
;*** Person/Org Security is off
 
   set iErrCode = error(sErrMsg,1)
   set iErrCode = 0
   select into "nl:"
   from orders o
      ,order_action oa
   plan o
      where o.order_id = request->order_qual[1].order_id
   join oa
      where oa.order_id = o.order_id
      and oa.action_sequence = o.last_action_sequence
   detail
      user_id = oa.order_provider_id
   with nocounter
   set iErrCode = error(sErrMsg,1)
   if (iErrCode > 0)
      set failed = SELECT_ERROR
      set table_name = "GET_USER_ID"
      go to EXIT_SCRIPT
   endif
 
   if (user_id < 1)
      set bPersonOrgSecurityOn = FALSE
   else
      set iErrCode = error(sErrMsg,1)
      set iErrCode = 0
      select into "nl:"
      from person_prsnl_reltn ppr
         ,code_value_extension cve
      plan ppr
         where ppr.prsnl_person_id = user_id
         and ppr.active_ind = 1
         and ppr.person_id+0 = request->person_id
         and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
         and ppr.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
      join cve
         where cve.code_value = ppr.person_prsnl_r_cd
         and cve.code_set = 331
         and (cve.field_value = "1" or cve.field_value = "2")
         and cve.field_name = "Override"
      head report
         bPersonOrgSecurityOn = FALSE
      with nocounter
      set iErrCode = error(sErrMsg,1)
      if (iErrCode > 0)
         set failed = SELECT_ERROR
         set table_name = "PRSNL_OVERRIDE"
         go to EXIT_SCRIPT
      endif
   endif
endif
if (bPersonOrgSecurityOn = TRUE)
;*** If Person/Org Security is on determine the Allergy Access Priv Code Value
;*** to be used later to determine the bit position of the access priv of the
;*** Org Set the user belongs to.
 
   set algy_access_priv = uar_get_code_by("DISPLAYKEY",413574,"ALLERGIES")
   if (algy_access_priv < 1)
      set failed = SELECT_ERROR
      set table_name = "CODE_VALUE"
      set sErrMsg = "Failed to find Code Value for Display Key ALLERGIES in Code Set 413574"
      go to EXIT_SCRIPT
   endif
endif
 
;*** Load Prsnl Orgs ==========================================================
if (bPersonOrgSecurityOn = TRUE)
 
;*** Person/Org Security is on, load the organizations and org sets the user belongs to
 
   call echo ("***")
   call echo ("***   Load Prsnl Orgs")
   call echo ("***")
 
   declare network_var = f8 with Constant(uar_get_code_by("MEANING",28881,"NETWORK")),protect
 
   free record prsnl_orgs
   record prsnl_orgs
   (
      1  org_knt = i4
      1  org[*]
         2  organization_id = f8
      1  org_set_knt = i4
      1  org_set[*]
         2  org_set_id = f8
         2  access_privs = i4
         2  org_list_knt = i4
         2  org_list[*]
            3  organization_id = f8
   )
 
   set iErrCode = error(sErrMsg,1)
   set iErrCode = 0
   select into "nl:"
   from prsnl_org_reltn por
   plan por
      where por.person_id = user_id
      and por.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and por.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
      and por.active_ind = TRUE
   head report
      knt = 0
      stat = alterlist(prsnl_orgs->org,10)
   head por.organization_id
      knt = knt + 1
      if (mod(knt,10) = 1 and knt != 1)
         stat = alterlist(prsnl_orgs->org,knt + 9)
      endif
      prsnl_orgs->org[knt].organization_id = por.organization_id
   foot report
      prsnl_orgs->org_knt = knt
      stat = alterlist(prsnl_orgs->org,knt)
   with nocounter
   set iErrCode = error(sErrMsg,1)
   if (iErrCode > 0)
      set failed = SELECT_ERROR
      set table_name = "PRSNL_ORG_RELTN"
      go to EXIT_SCRIPT
   endif
 
   if (network_var < 1)
      set failed = SELECT_ERROR
      set table_name = "CODE_VALUE"
      set sErrMsg = "Failed to find Code Value for CDF_MEANING NETWORK from Code Set 28881"
      go to EXIT_SCRIPT
   endif
 
   ;*** MOD 018 :: Use ORG_SET_TYPE_R to determine if Network Org
   set iErrCode = error(sErrMsg,1)
   set iErrCode = 0
   select into "nl:"
   from org_set_prsnl_r ospr
      ,org_set_type_r ostr
      ,org_set os
      ,org_set_org_r osor
   plan ospr
      where ospr.prsnl_id = reqinfo->updt_id
      and ospr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and ospr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
      and ospr.active_ind = TRUE
   join ostr
      where ostr.org_set_id = ospr.org_set_id
      and ostr.org_set_type_cd = network_var
      and ostr.active_ind = 1
      and ostr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and ostr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
   join os
      where os.org_set_id = ospr.org_set_id
   join osor
      where osor.org_set_id = os.org_set_id
      and osor.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and osor.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
      and osor.active_ind = TRUE
   head report
      knt = 0
      stat = alterlist(prsnl_orgs->org_set,10)
   head ospr.org_set_id
      knt = knt + 1
      if (mod(knt,10) = 1 and knt != 1)
         stat = alterlist(prsnl_orgs->org_set,knt + 9)
      endif
      prsnl_orgs->org_set[knt].org_set_id = ospr.org_set_id
      prsnl_orgs->org_set[knt].access_privs = os.org_set_attr_bit
      oknt = 0
      stat = alterlist(prsnl_orgs->org_set[knt].org_list,10)
   detail
      oknt = oknt + 1
      if (mod(oknt,10) = 1 and oknt != 1)
         stat = alterlist(prsnl_orgs->org_set[knt].org_list,oknt + 9)
      endif
      prsnl_orgs->org_set[knt].org_list[oknt].organization_id = osor.organization_id
   foot ospr.org_set_id
      prsnl_orgs->org_set[knt].org_list_knt = oknt
      stat = alterlist(prsnl_orgs->org_set[knt].org_list,oknt)
   foot report
      prsnl_orgs->org_set_knt = knt
      stat = alterlist(prsnl_orgs->org_set,knt)
   with nocounter
   set iErrCode = error(sErrMsg,1)
   if (iErrCode > 0)
      set failed = SELECT_ERROR
      set table_name = "PRSNL_ORG_RELTN"
      go to EXIT_SCRIPT
   endif
endif
;==============================================================================
 
if (bPersonOrgSecurityOn = TRUE)
 
;*** Person Org Security is on, load all allergies that will be later filter based
;*** on viewablity
 
call echo ("***")
call echo ("***   bPersonOrgSecurityOn = TRUE")
call echo ("***")
 
   free record temp_alg
   record temp_alg
   (
      1  qual_knt = i4
      1  qual[*]
         2  allergy_id = f8
         2  subst_name = vc
         2  organization_id = f8
         2  viewable_ind = i2
         2  adr_knt = i4
         2  adr[*]
            3  reltn_entity_name = vc
            3  reltn_entity_id = f8
   )
 
   set iErrCode = error(sErrMsg,1)
   set iErrCode = 0
   select into "nl:"
   from
      allergy a
      ,nomenclature n
   plan a
      where a.person_id = request->person_id
      and a.reaction_status_cd != canceled_allergy_cd
      and (a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
            and a.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
   join n
      where n.nomenclature_id = a.substance_nom_id
   head report
      knt = 0
      stat = alterlist(temp_alg->qual,10)
   detail
      knt = knt + 1
      if (mod(knt,10) = 1 and knt != 1)
         stat = alterlist(temp_alg->qual,knt + 9)
      endif
      temp_alg->qual[knt].allergy_id = a.allergy_id
      temp_alg->qual[knt].organization_id = a.organization_id
      if (n.nomenclature_id < 1)
         temp_alg->qual[knt].subst_name = a.substance_ftdesc
      else
         temp_alg->qual[knt].subst_name = n.source_string
      endif
      if (a.organization_id = 0.0)  ;*** if the allergy is associated to org_id 0.0 then everybody can see it.
         temp_alg->qual[knt].viewable_ind = 1
      endif
   foot report
      temp_alg->qual_knt = knt
      stat = alterlist(temp_alg->qual,knt)
   with nocounter
   set iErrCode = error(sErrMsg,1)
   if (iErrCode > 0)
      set failed = SELECT_ERROR
      set table_name = "ALLERGY"
      go to EXIT_SCRIPT
   endif
 
   if (temp_alg->qual_knt > 0)
 
      ;*** Allergies have been found, we need to load the ADR data for the allergies
 
      set iErrCode = error(sErrMsg,1)
      set iErrCode = 0
      select into "nl:"
      from activity_data_reltn adr
      plan adr
         where expand(eidx,1,temp_alg->qual_knt,adr.activity_entity_id,temp_alg->qual[eidx].allergy_id)
         and adr.activity_entity_name = "ALLERGY"
      head adr.activity_entity_id
         fidx = 0
         fidx = locateval(fidx,1,temp_alg->qual_knt,adr.activity_entity_id,temp_alg->qual[eidx].allergy_id)
         if (fidx > 0)
            stat = alterlist(temp_alg->qual[fidx].adr,10)
         endif
         knt = 0
      detail
         if (fidx > 0)
            knt = knt + 1
            if (mod(knt,10) = 1 and knt != 1)
               stat = alterlist(temp_alg->qual[fidx].adr,knt + 9)
            endif
            temp_alg->qual[fidx].adr[knt].reltn_entity_name = adr.reltn_entity_name
            temp_alg->qual[fidx].adr[knt].reltn_entity_id = adr.reltn_entity_id
         endif
      foot adr.activity_entity_id
         temp_alg->qual[fidx].adr_knt = knt
         stat = alterlist(temp_alg->qual[fidx].adr,knt)
      with nocounter
      set iErrCode = error(sErrMsg,1)
      if (iErrCode > 0)
         set failed = SELECT_ERROR
         set table_name = "ACTIVITY_DATA_RELTN"
         go to EXIT_SCRIPT
      endif
 
      set viewable_knt = 0
      for (vidx = 1 to temp_alg->qual_knt)
 
         ;*** Cycle through the allergy list and determine what's viewable
         set continue = TRUE
         set oknt = 1
         while (continue = TRUE and oknt <= prsnl_orgs->org_knt and temp_alg->qual[vidx].viewable_ind < 1)
            ;*** Check to see if "direct" organization between allergy and prsnl exist
            if (temp_alg->qual[vidx].organization_id = prsnl_orgs->org[oknt].organization_id)
               set temp_alg->qual[vidx].viewable_ind = 1
               set continue = FALSE
            endif
            set oknt = oknt + 1
         endwhile
         if (temp_alg->qual[vidx].viewable_ind < 1)
            set osknt = 1
            set continue = TRUE
            while (continue = TRUE and osknt <= prsnl_orgs->org_set_knt)
               ;*** Check to see if the allergy organization is in the Org Set org list of the user
               set oknt = 1
               set access_granted = FALSE
               set access_granted = btest(prsnl_orgs->org_set[osknt].access_priv,algy_bit_pos)
               while (continue = TRUE and oknt < prsnl_orgs->org_set[osknt].org_list_knt and access_granted = TRUE)
                  if (temp_alg->qual[vidx].organization_id = prsnl_orgs->org_set[osknt].org_list[oknt].organization_id)
                     set temp_alg->qual[vidx].viewable_ind = 1
                     set continue = FALSE
                  endif
                  set oknt = oknt + 1
               endwhile
               set osknt = osknt + 1
            endwhile
         endif
         if (temp_alg->qual[vidx].adr_knt > 0 and temp_alg->qual[vidx].viewable_ind < 1)
            for (ridx = 1 to temp_alg->qual[vidx].adr_knt)
               ;*** detemine if ADR orgs are related to user orgs
 
               set continue = TRUE
               set oknt = 1
               while (continue = TRUE and oknt <= prsnl_orgs->org_knt and temp_alg->qual[vidx].viewable_ind < 1)
                  ;*** Check to see if "direct" organization between adr and prsnl exist
                  if (temp_alg->qual[vidx].adr[ridx].reltn_entity_name = "ORGANIZATION" and
                      temp_alg->qual[vidx].adr[ridx].reltn_entity_id = prsnl_orgs->org[oknt].organization_id)
                     set temp_alg->qual[vidx].viewable_ind = 1
                     set continue = FALSE
                  endif
                  set oknt = oknt + 1
               endwhile
               if (temp_alg->qual[vidx].viewable_ind < 1)
                  set osknt = 1
                  set continue = TRUE
                  while (continue = TRUE and osknt <= prsnl_orgs->org_set_knt)
                     ;*** Check to see if "in-direct" organization between adr and prsnl org set org exist
                     set oknt = 1
                     set access_granted = FALSE
                     set access_granted = btest(prsnl_orgs->org_set[osknt].access_priv,algy_bit_pos)
                     while (continue = TRUE and oknt <= prsnl_orgs->org_set[osknt].org_list_knt and access_granted = TRUE)
                        if (temp_alg->qual[vidx].adr[ridx].reltn_entity_name = "ORGANIZATION" and
                            temp_alg->qual[vidx].adr[ridx].reltn_entity_id =
                            prsnl_orgs->org_set[osknt].org_list[oknt].organization_id)
                           set temp_alg->qual[vidx].viewable_ind = 2
                           set continue = FALSE
                        endif
                        set oknt = oknt + 1
                     endwhile
                     set osknt = osknt + 1
                  endwhile
               endif
            endfor
         endif
 
         if (temp_alg->qual[vidx].viewable_ind > 0)
            set viewable_knt = viewable_knt + 1
            if (viewable_knt = 1)
               set demo_info->allergy_line = trim(temp_alg->qual[vidx].subst_name)
            else
               set demo_info->allergy_line = concat(trim(demo_info->allergy_line),", ",trim(temp_alg->qual[vidx].subst_name))
            endif
         endif
      endfor
   endif
else  ;*** MOD 016 END
 
   call echo ("***")
   call echo ("***   bPersonOrgSecurityOn = FALSE")
   call echo ("***")
 
 
   set iErrCode = error(sErrMsg,1)
   set iErrCode = 0
 
   select into "nl:"
   from
    allergy a,
    nomenclature n
plan a where
    a.person_id = request->person_id and
    a.reaction_status_cd != canceled_allergy_cd and
    (a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
     a.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
join n where
    n.nomenclature_id = a.substance_nom_id
 
head report
    knt = 0
detail
    knt = knt + 1
 
    if (knt = 1)
        if (n.nomenclature_id > 0)
            demo_info->allergy_line = trim(n.source_string)
        else
            demo_info->allergy_line = trim(a.substance_ftdesc)
        endif
    else
        if (n.nomenclature_id > 0)
            demo_info->allergy_line = concat(trim(demo_info->allergy_line),", ",
                trim(n.source_string))
        else
            demo_info->allergy_line = concat(trim(demo_info->allergy_line),", ",
                trim(a.substance_ftdesc))
        endif
    endif
with nocounter
 
   set iErrCode = error(sErrMsg,1)
   if (iErrCode > 0)
      set failed = SELECT_ERROR
      set table_name = "ALLERGY"
      go to EXIT_SCRIPT
   endif
 
endif
 
;*** parse allergy line
free record pt
record pt
(
  1 line_cnt = i2
  1 lns[*]
    2 line   = vc
)
 
if (not(demo_info->allergy_line > " "))
    set demo_info->allergy_knt = 1
    set stat = alterlist(demo_info->allergy,demo_info->allergy_knt)
    set demo_info->allergy[1]->disp = "No Allergy Information Has Been Recorded"
else
    set pt->line_cnt = 0
    set max_length   = 90
    execute dcp_parse_text value(demo_info->allergy_line), value(max_length)
    set demo_info->allergy_knt = pt->line_cnt
    set stat = alterlist(demo_info->allergy,demo_info->allergy_knt)
 
    for (c = 1 to pt->line_cnt)
        set demo_info->allergy[c]->disp = trim(pt->lns[c]->line)
    endfor
endif
 
/****************************************************************************
*       Load Order and Encounter Information                                *
*****************************************************************************/
free record temp_req
record temp_req
(
  1 qual_knt              = i4
  1 qual[*]
    2 order_id            = f8
    2 encntr_id           = f8
    2 d_nbr               = vc
    2 csa_schedule        = c1
    2 csa_group           = vc  ;*** C = 0 | A = 1,2 | B = 3,4,5
    2 mrn                 = vc
    2 found_emrn          = i2
    2 hp_pri_found        = i2
    2 hp_pri_name         = vc
    2 hp_pri_polgrp       = vc
    2 hp_sec_found        = i2
    2 hp_sec_name         = vc
    2 hp_sec_polgrp       = vc
    2 oe_format_id        = f8
    2 phys_id             = f8
    2 phys_sign_dt_tm	  = vc  ;052
    2 phys_name           = vc
    2 phys_fname          = vc
    2 phys_mname          = vc
    2 phys_lname          = vc
    2 phys_title          = vc
    2 phys_bname          = vc
    2 found_phys_addr_ind = i2
    2 phys_facility	  = vc ;035
    2 phys_site       = vc ;049
    2 phys_addr_id        = f8
    2 phys_addr1          = vc
    2 phys_addr2          = vc
    2 phys_addr3          = vc
    2 phys_addr4          = vc
    2 phys_city           = vc
    2 phys_dea            = vc
    2 phys_npi            = vc ;028
    2 sup_phys_npi        = vc ;028
    2 phys_lnbr           = vc
    2 phys_phone_type_cd  = f8  /*045*/
    2 phys_phone          = vc
    2 eprsnl_ind          = i2
    2 eprsnl_id           = f8
    2 eprsnl_name         = vc
    2 eprsnl_fname        = vc
    2 eprsnl_mname        = vc
    2 eprsnl_lname        = vc
    2 eprsnl_title        = vc
    2 eprsnl_bname        = vc
    2 order_dt            = dq8
    2 output_dest_cd      = f8
    2 free_text_nbr       = vc
    2 print_loc           = vc
    2 no_print            = i2
    2 print_dea           = i2
    2 daw                 = i2
    2 start_date          = dq8
    2 req_start_date      = dq8
    2 perform_loc         = vc
    2 order_mnemonic      = vc
    2 order_as_mnemonic   = vc
    2 free_txt_ord        = vc
    2 med_name            = vc
    2 med_knt             = i4
    2 med[*]
      3 disp              = vc
    2 strength_dose       = vc
    2 strength_dose_unit  = vc
    2 volume_dose         = vc
    2 volume_dose_unit    = vc
    2 freetext_dose       = vc
    2 rx_route            = vc
    2 frequency           = vc
    2 duration            = vc
    2 duration_unit       = vc
    2 sig_line            = vc
    2 sig_knt             = i4
    2 sig[*]
      3 disp              = vc
    2 dispense_qty        = vc
    2 dispense_qty_unit   = vc
    2 dispense_line       = vc
    2 dispense_knt        = i4
    2 dispense[*]
      3 disp              = vc
    2 dispense_duration   = vc                        ;*** MOD 007
    2 dispense_duration_unit = vc                ;*** MOD 007
    2 dispense_duration_line = vc                ;*** MOD 007
    2 dispense_duration_knt  = i4                ;*** MOD 007
    2 dispense_duration_qual[*]                        ;*** MOD 007
      3 disp              = vc                        ;*** MOD 007
    2 req_refill_date     = dq8
    2 nbr_refills_txt     = vc
    2 nbr_refills         = f8
    2 total_refills       = f8
    2 add_refills_txt     = vc          ;008
    2 add_refills         = f8          ;008
    2 refill_ind          = i2
    2 refill_line         = vc
    2 refill_knt          = i4
    2 refill[*]
      3 disp              = vc
    2 special_inst        = vc
    2 special_knt         = i4
    2 special[*]
      3 disp              = vc
    2 prn_ind             = i2
    2 prn_inst            = vc
    2 prn_knt             = i4
    2 prn[*]
      3 disp              = vc
    2 indications         = vc
    2 indic_knt           = i4
    2 indic[*]
      3 disp              = vc
    2 get_comment_ind     = i2
    2 comments            = vc
    2 comment_knt         = i4
    2 comment[*]
      3 disp              = vc
    2 sup_phys_bname      = vc           ;012
    2 sup_phys_dea        = vc           ;012
    2 sup_phys_id         = f8           ;012
    2 action_type_cd          = f8           ;019
    2 frequency_cd        = f8           ;019
    2 action_dt_tm        = dq8          ;022
    2 orig_order_dt_tm    = dq8          ;022
    2 mnemonic_type_cd    = f8           ;030
    2 drug_form           = vc           ;032
    2 oe_format_fields [*] ;034
      3 label_text = vc
      3 oe_field_display_value = vc
      3 oe_field_id = f8
      3 oe_field_value = f8
      3 disp_yes_no_flag = i2
      3 accept_flag = i2
      3 oe_field_meaning_id = f8
      3 line_knt = i4
      3 lines[*]
        4 disp = vc
    2 clinical_disp_line = vc
    2 clin_disp_cnt = i4
    2 clin_disp[*]
            3 disp = vc
 
)
 
declare ORDER_ACTION_TYPE_CD       = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",6003,"ORDER"))  /*043*/
declare DISCH_ORDER_ACTION_TYPE_CD = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",6003,"DISORDER"))  /*043*/
 
;*** get order data
set eprsnl_ind = FALSE
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
select into "nl:"
    encntr_id = request->order_qual[d.seq]->encntr_id,
    oa.order_provider_id,
    o.order_id,
    cki_len = textlen(o.cki)
from
    (dummyt d with seq = value(size(request->order_qual,5))),
    orders o,
    order_action oa,
    prsnl p
    , encounter e ;035
plan d where
    d.seq > 0
join o where
    o.order_id = request->order_qual[d.seq]->order_id and
    o.encntr_id = request->order_qual[d.seq]->encntr_id and
    o.order_status_cd != medstudent_hold_cd ;027
join oa where
    oa.order_id = o.order_id and
    oa.action_sequence = o.last_action_sequence and
    (((oa.action_type_cd = order_cd or
       oa.action_type_cd = complete_cd or
       oa.action_type_cd = modify_cd or
       oa.action_type_cd = studactivate_cd or ;033
         oa.action_type_cd = suspend_cd) and ;033
      ;034 (o.orig_ord_as_flag = 1)) or
      (o.orig_ord_as_flag in (0, 1))) or
     (is_a_reprint = TRUE))
join p where
    p.person_id = oa.order_provider_id
join e where ;035
	e.encntr_id = o.encntr_id ;035
order
    o.order_id  ;MOD 011
 
head report
    knt = 0
    stat = alterlist(temp_req->qual,10)
    mnemonic_size = size(o.hna_order_mnemonic,3) - 1        ;025
 
head o.order_id
 
        if (not(((DATETIMEDIFF(oa.action_dt_tm, o.orig_order_dt_tm,4)) >= 1) and (oa.action_type_cd = suspend_cd))) ;033
            knt = knt + 1
            if (mod(knt,10) = 1 and knt != 1)
                stat = alterlist(temp_req->qual, knt + 9)
            endif
 
            temp_req->qual[knt]->order_id          = o.order_id
            temp_req->qual[knt]->encntr_id         = o.encntr_id
            temp_req->qual[knt]->clinical_disp_line = o.clinical_display_line
            temp_req->qual[knt]->oe_format_id      = o.oe_format_id
            temp_req->qual[knt]->phys_id           = oa.order_provider_id
            temp_req->qual[knt]->phys_sign_dt_tm   = ;format(oa.action_dt_tm, "mm/dd/yyyy hh:mm zzz;;d")   ;052
            										DATETIMEZONEFORMAT(oa.order_dt_tm,OA.order_tz,"MM/DD/YYYY HH:mm ZZZ") ;052
            temp_req->qual[knt].phys_phone_type_cd = work_phone_cd  /*045*/
            temp_req->qual[knt]->sup_phys_id       = oa.supervising_provider_id ;012
            temp_req->qual[knt]->eprsnl_id         = oa.action_personnel_id
    temp_req->qual[knt]->phys_facility 	   = substring(4,54,uar_get_code_description(E.LOC_FACILITY_CD)) ;038
            temp_req->qual[knt]->phys_site   = "Mayo Clinic Health System"  ;049
            if (oa.order_provider_id != oa.action_personnel_id)
              temp_req->qual[knt]->eprsnl_ind = TRUE
              eprsnl_ind = TRUE
            endif
            temp_req->qual[knt]->phys_name         = trim(p.name_full_formatted)
            temp_req->qual[knt]->order_dt          = cnvtdatetime(cnvtdate(oa.action_dt_tm),0)
            temp_req->qual[knt]->print_loc         = request->printer_name
 
;BEGIN 025
                mnem_length = size(trim(o.hna_order_mnemonic),1)
            if (mnem_length >= mnemonic_size
                    and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
                    temp_req->qual[knt]->order_mnemonic = concat(trim(o.hna_order_mnemonic), "...")
            else
                    temp_req->qual[knt]->order_mnemonic = o.hna_order_mnemonic
            endif
 
                 mnem_length = size(trim(o.ordered_as_mnemonic),1)
            if (mnem_length >= mnemonic_size
                    and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
                    temp_req->qual[knt]->order_as_mnemonic = concat(trim(o.ordered_as_mnemonic), "...")
            else
                    temp_req->qual[knt]->order_as_mnemonic = o.ordered_as_mnemonic
            endif
;END 025
 
            temp_req->qual[knt]->action_type_cd    = oa.action_type_cd     ;019
            temp_req->qual[knt]->action_dt_tm      = oa.action_dt_tm       ;022
            temp_req->qual[knt]->orig_order_dt_tm  = o.orig_order_dt_tm    ;022
            if (band(o.comment_type_mask,1) = 1)
                temp_req->qual[knt]->get_comment_ind = TRUE
            endif
 
            d_pos = findstring("!d",o.cki)
            if (d_pos > 0)
                temp_req->qual[knt]->d_nbr = trim(substring(d_pos + 1, cki_len, o.cki))
            endif
         endif
 
foot report
    temp_req->qual_knt = knt
    stat = alterlist(temp_req->qual,knt)
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "ORDER_INFO"
    go to EXIT_SCRIPT
endif
 
if (temp_req->qual_knt < 1)
    call echo ("***")
    call echo ("***   No items found to print")
    call echo ("***")
    go to EXIT_SCRIPT
endif
 
;*** get title
call echo("***")
call echo("***   Get Phys Title")
call echo("***")
 
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
select into "nl:"
from (dummyt d with seq = value(temp_req->qual_knt))
   ,person_name p
plan d
   where d.seq > 0
join p
   where (p.person_id = temp_req->qual[d.seq].phys_id or
          p.person_id = temp_req->qual[d.seq].sup_phys_id) ;012
   and p.person_id > 0                                     ;012
   and p.name_type_cd = prsnl_type_cd
   and p.active_ind = TRUE
   and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
detail
    if (p.person_id = temp_req->qual[d.seq].phys_id)
      temp_req->qual[d.seq]->phys_fname = trim(p.name_first)
      temp_req->qual[d.seq]->phys_mname = trim(p.name_middle)
      temp_req->qual[d.seq]->phys_lname = trim(p.name_last)
      temp_req->qual[d.seq]->phys_title = trim(p.name_title)
      if (p.name_first > " ")
        temp_req->qual[d.seq]->phys_bname = trim(p.name_first)
        if (p.name_middle > " ")
          temp_req->qual[d.seq]->phys_bname = concat(trim(temp_req->qual[d.seq]->phys_bname)," ",trim(p.name_middle))
          if (p.name_last > " ")
            temp_req->qual[d.seq]->phys_bname = concat(trim(temp_req->qual[d.seq]->phys_bname)," ",trim(p.name_last))
          endif
        elseif (p.name_last > " ")
          temp_req->qual[d.seq]->phys_bname = concat(trim(temp_req->qual[d.seq]->phys_bname)," ",trim(p.name_last))
        endif
      elseif (p.name_middle > " ")
        temp_req->qual[d.seq]->phys_bname = trim(p.name_middle)
        if (p.name_last > " ")
          temp_req->qual[d.seq]->phys_bname = concat(trim(temp_req->qual[d.seq]->phys_bname)," ",trim(p.name_last))
        endif
      elseif (p.name_last > " ")
        temp_req->qual[d.seq]->phys_bname = concat(trim(temp_req->qual[d.seq]->phys_bname)," ",trim(p.name_last))
      else
        temp_req->qual[d.seq]->phys_bname = temp_req->qual[d.seq]->phys_name
      endif
      if (temp_req->qual[d.seq]->phys_bname > " " and p.name_title > " ")
        temp_req->qual[d.seq]->phys_bname = concat(trim(temp_req->qual[d.seq]->phys_bname),", ",trim(p.name_title))
      endif
    ;Mod 012 Start- Added the if/else to write the supervising physician name
    else
      if (p.name_first > " ")
        temp_req->qual[d.seq]->sup_phys_bname = trim(p.name_first)
        if (p.name_middle > " ")
          temp_req->qual[d.seq]->sup_phys_bname = concat(trim(temp_req->qual[d.seq]->sup_phys_bname)," ",trim(p.name_middle))
          if (p.name_last > " ")
            temp_req->qual[d.seq]->sup_phys_bname = concat(trim(temp_req->qual[d.seq]->sup_phys_bname)," ",trim(p.name_last))
          endif
        elseif (p.name_last > " ")
          temp_req->qual[d.seq]->sup_phys_bname = concat(trim(temp_req->qual[d.seq]->sup_phys_bname)," ",trim(p.name_last))
        endif
      elseif (p.name_middle > " ")
        temp_req->qual[d.seq]->sup_phys_bname = trim(p.name_middle)
        if (p.name_last > " ")
          temp_req->qual[d.seq]->sup_phys_bname = concat(trim(temp_req->qual[d.seq]->sup_phys_bname)," ",trim(p.name_last))
        endif
      elseif (p.name_last > " ")
        temp_req->qual[d.seq]->sup_phys_bname = concat(trim(temp_req->qual[d.seq]->sup_phys_bname)," ",trim(p.name_last))
      else
        temp_req->qual[d.seq]->sup_phys_bname = temp_req->qual[d.seq]->phys_name
      endif
      if (temp_req->qual[d.seq]->sup_phys_bname > " " and p.name_title > " ")
        temp_req->qual[d.seq]->sup_phys_bname = concat(trim(temp_req->qual[d.seq]->sup_phys_bname),", ",trim(p.name_title))
      endif
    endif
    ;Mod 012 End
with nocounter
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "PERSON_NAME"
    go to EXIT_SCRIPT
endif
 
if (eprsnl_ind = TRUE)
call echo("***")
call echo("***   Get Eprsnl Title")
call echo("***")
   set iErrCode = error(sErrMsg,1)
   set iErrCode = 0
   select into "nl:"
   from (dummyt d with seq = value(temp_req->qual_knt))
      ,person_name p
   plan d
      where d.seq > 0
      and temp_req->qual[d.seq].eprsnl_ind = TRUE
   join p
      where p.person_id = temp_req->qual[d.seq].eprsnl_id
      and p.name_type_cd = prsnl_type_cd
      and p.active_ind = TRUE
      and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
   detail
      temp_req->qual[d.seq]->eprsnl_name = trim(p.name_full)
      temp_req->qual[d.seq]->eprsnl_fname = trim(p.name_first)
      temp_req->qual[d.seq]->eprsnl_mname = trim(p.name_middle)
      temp_req->qual[d.seq]->eprsnl_lname = trim(p.name_last)
      temp_req->qual[d.seq]->eprsnl_title = trim(p.name_title)
      if (p.name_first > " ")
         temp_req->qual[d.seq]->eprsnl_bname = trim(p.name_first)
         if (p.name_middle > " ")
               temp_req->qual[d.seq]->eprsnl_bname = concat(trim(temp_req->qual[d.seq]->eprsnl_bname)," ",trim(p.name_middle))
               if (p.name_last > " ")
                  temp_req->qual[d.seq]->eprsnl_bname = concat(trim(temp_req->qual[d.seq]->eprsnl_bname)," ",trim(p.name_last))
               endif
         elseif (p.name_last > " ")
               temp_req->qual[d.seq]->eprsnl_bname = concat(trim(temp_req->qual[d.seq]->eprsnl_bname)," ",trim(p.name_last))
         endif
      elseif (p.name_middle > " ")
         temp_req->qual[d.seq]->eprsnl_bname = trim(p.name_middle)
         if (p.name_last > " ")
               temp_req->qual[d.seq]->eprsnl_bname = concat(trim(temp_req->qual[d.seq]->eprsnl_bname)," ",trim(p.name_last))
         endif
      elseif (p.name_last > " ")
         temp_req->qual[d.seq]->eprsnl_bname = concat(trim(temp_req->qual[d.seq]->eprsnl_bname)," ",trim(p.name_last))
      else
         temp_req->qual[d.seq]->eprsnl_bname = temp_req->qual[d.seq]->eprsnl_name
      endif
      if (temp_req->qual[d.seq]->eprsnl_bname > " " and p.name_title > " ")
         temp_req->qual[d.seq]->eprsnl_bname = concat(trim(temp_req->qual[d.seq]->eprsnl_bname),", ",trim(p.name_title))
      endif
   with nocounter
   set iErrCode = error(sErrMsg,1)
   if (iErrCode > 0)
      set failed = SELECT_ERROR
      set table_name = "EPRSNL_NAME"
      go to EXIT_SCRIPT
   endif
endif
 
;*** find multum table
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
from
    dba_tables d
plan d where
    d.table_name = "MLTM_NDC_MAIN_DRUG_CODE" and
    d.owner = "V500"
detail
    use_pco = TRUE
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "DBA_TABLES"
    go to EXIT_SCRIPT
endif
 
if (use_pco = FALSE)
    set iErrCode = error(sErrMsg,1)
    set iErrCode = 0
 
    select into "nl:"
    from
        dba_tables d
    plan d where
        d.table_name = "NDC_MAIN_MULTUM_DRUG_CODE" and
        d.owner = "V500"
    detail
        v500_ind = TRUE
    with nocounter
    set iErrCode = error(sErrMsg,1)
    if (iErrCode > 0)
        set failed = SELECT_ERROR
        set table_name = "DBA_TABLES"
        go to EXIT_SCRIPT
    endif
endif
 
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
set non_blank_nbr = TRUE                                                    ;008
set mltm_loaded   = FALSE                                                   ;008
 
if (use_pco = TRUE)
    select into "nl:"
    from
        (dummyt d with seq = value(temp_req->qual_knt)),
        mltm_ndc_main_drug_code n
    plan d where
        d.seq > 0 ;and
        ;temp_req->qual[d.seq]->d_nbr > " "                                 ;008
    join n where
        n.drug_identifier = temp_req->qual[d.seq]->d_nbr
    order
        d.seq,
        n.csa_schedule
 
    head d.seq
        if (temp_req->qual[d.seq]->d_nbr > " ")                             ;008
            mltm_loaded = TRUE                                              ;008
            non_blank_nbr = FALSE                                           ;008
        endif                                                               ;008
        temp_req->qual[d.seq]->csa_schedule = n.csa_schedule
        if (n.csa_schedule = "0")
            temp_req->qual[d.seq]->csa_group = "C"
        elseif (n.csa_schedule = "1" or n.csa_schedule = "2")
            temp_req->qual[d.seq]->csa_group = "A"
        elseif (n.csa_schedule = "3" or n.csa_schedule = "4" or n.csa_schedule = "5")
            temp_req->qual[d.seq]->csa_group = "B"
        elseif (temp_req->qual[d.seq]->d_nbr <= " ")                        ;010
            temp_req->qual[d.seq]->csa_schedule = "0"                       ;010
            csa_group_cnt = csa_group_cnt + 1                               ;010
            temp_req->qual[d.seq]->csa_group = concat("D",                  ;010
                trim(cnvtstring(csa_group_cnt)))                            ;010
        else
            temp_req->qual[d.seq]->csa_group = "C"
        endif
    with outerjoin = d, nocounter                                           ;010
 
    set iErrCode = error(sErrMsg,1)
    if ((iErrCode > 0 or mltm_loaded = FALSE) and non_blank_nbr = FALSE)    ;008
        set failed = SELECT_ERROR
        set table_name = "MLTM_CSA_SCHEDULE"
        if (mltm_loaded = FALSE)
            set sErrMsg = "Table is Empty"
        endif
        go to EXIT_SCRIPT
    endif
elseif (v500_ind = TRUE)
    select into "nl:"
    from
        (dummyt d with seq = value(temp_req->qual_knt)),
        ndc_main_multum_drug_code n
    plan d where
        d.seq > 0 ;and
        ;temp_req->qual[d.seq]->d_nbr > " "                                 ;008
    join n where
        n.drug_identifier = temp_req->qual[d.seq]->d_nbr
    order
        d.seq,
        n.csa_schedule
    head d.seq
        if (temp_req->qual[d.seq]->d_nbr > " ")                             ;008
            mltm_loaded = TRUE                                              ;008
            non_blank_nbr = FALSE                                           ;008
        endif                                                               ;008
        temp_req->qual[d.seq]->csa_schedule = n.csa_schedule
        if (n.csa_schedule = "0")
            temp_req->qual[d.seq]->csa_group = "C"
        elseif (n.csa_schedule = "1" or n.csa_schedule = "2")
            temp_req->qual[d.seq]->csa_group = "A"
        elseif (n.csa_schedule = "3" or n.csa_schedule = "4" or n.csa_schedule = "5")
            temp_req->qual[d.seq]->csa_group = "B"
        elseif (temp_req->qual[d.seq]->d_nbr <= " ")                        ;010
            temp_req->qual[d.seq]->csa_schedule = "0"                       ;010
            csa_group_cnt = csa_group_cnt + 1                               ;010
            temp_req->qual[d.seq]->csa_group = concat("D",                  ;010
                trim(cnvtstring(csa_group_cnt)))                            ;010
        else
            temp_req->qual[d.seq]->csa_group = "C"
        endif
    with outerjoin = d, nocounter                                           ;010
 
    set iErrCode = error(sErrMsg,1)
    if ((iErrCode > 0 or mltm_loaded = FALSE) and non_blank_nbr = FALSE)    ;008
        set failed = SELECT_ERROR
        set table_name = "CSA_SCHEDULE"
        if (mltm_loaded = FALSE)
            set sErrMsg = "Table is Empty"
        endif
        go to EXIT_SCRIPT
    endif
else
    select into "nl:"
    from
        (dummyt d with seq = value(temp_req->qual_knt)),
        v500_ref.ndc_main_multum_drug_code n
    plan d where
        d.seq > 0 ;and
        ;temp_req->qual[d.seq]->d_nbr > " "                                 ;008
    join n where
        n.drug_id = temp_req->qual[d.seq]->d_nbr
    order
        d.seq,
        n.csa_schedule
    head d.seq
        if (temp_req->qual[d.seq]->d_nbr > " ")                             ;008
            mltm_loaded = TRUE                                              ;008
            non_blank_nbr = FALSE                                           ;008
        endif                                                               ;008
        temp_req->qual[d.seq]->csa_schedule = n.csa_schedule
        if (n.csa_schedule = "0")
            temp_req->qual[d.seq]->csa_group = "C"
        elseif (n.csa_schedule = "1" or n.csa_schedule = "2")
            temp_req->qual[d.seq]->csa_group = "A"
        elseif (n.csa_schedule = "3" or n.csa_schedule = "4" or n.csa_schedule = "5")
            temp_req->qual[d.seq]->csa_group = "B"
        elseif (temp_req->qual[d.seq]->d_nbr <= " ")                        ;010
            temp_req->qual[d.seq]->csa_schedule = "0"                       ;010
            csa_group_cnt = csa_group_cnt + 1                               ;010
            temp_req->qual[d.seq]->csa_group = concat("D",                  ;010
                trim(cnvtstring(csa_group_cnt)))                            ;010
        else
            temp_req->qual[d.seq]->csa_group = "C"
        endif
    with outerjoin = d, nocounter                                           ;010
 
    set iErrCode = error(sErrMsg,1)
    if ((iErrCode > 0 or mltm_loaded = FALSE) and non_blank_nbr = FALSE)    ;008
        set failed = SELECT_ERROR
        set table_name = "V500_CSA_SCHEDULE"
        if (mltm_loaded = FALSE)
            set sErrMsg = "Table is Empty"
        endif
        go to EXIT_SCRIPT
    endif
endif
 
;*** get order detail
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
from
    order_detail od,
    oe_format_fields oef,
    (dummyt d1 with seq = value(temp_req->qual_knt))
plan d1 where
    d1.seq > 0
join od where
    od.order_id = temp_req->qual[d1.seq]->order_id
join oef where
    oef.oe_format_id = temp_req->qual[d1.seq]->oe_format_id and
    oef.oe_field_id = od.oe_field_id and
;043     oef.action_type_cd = temp_req->qual[d1.seq].action_type_cd ; ??? seems necessary to remove duplicates
    ; oef.action_type_cd = 758895.00 ; REMOVE THIS
/*043 BEGIN*/
    (oef.action_type_cd = temp_req->qual[d1.seq].action_type_cd
      OR (oef.action_type_cd = DISCH_ORDER_ACTION_TYPE_CD
        AND temp_req->qual[d1.seq].action_type_cd = ORDER_ACTION_TYPE_CD))
/*043 END*/
    and oef.accept_flag != 2 ; maybe?
order
    od.order_id,
    oef.group_seq,
    oef.field_seq,
    od.oe_field_id,
    od.action_sequence desc
 
head od.order_id
        oef_cnt = 0
 
head od.oe_field_id
    act_seq = od.action_sequence
    odflag = TRUE
 
head od.action_sequence
    if (act_seq != od.action_sequence)
        odflag = FALSE
    endif
 
detail
    if (odflag = TRUE)
            ; call echo("** in detail/odflag")
 
/*
        if (od.oe_field_meaning_id = 2107)
            temp_req->qual[d1.seq]->print_dea = od.oe_field_value
 
        elseif (od.oe_field_meaning_id = 2056)
            temp_req->qual[d1.seq]->strength_dose = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2057)
            temp_req->qual[d1.seq]->strength_dose_unit = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2058)
            temp_req->qual[d1.seq]->volume_dose = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2059)
            temp_req->qual[d1.seq]->volume_dose_unit = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2063)
            temp_req->qual[d1.seq]->freetext_dose = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2050)
            temp_req->qual[d1.seq]->rx_route = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2011)
            temp_req->qual[d1.seq]->frequency = trim(od.oe_field_display_value)
            temp_req->qual[d1.seq]->frequency_cd = od.oe_field_value        ;019
 
        elseif (od.oe_field_meaning_id = 2061)
            temp_req->qual[d1.seq]->duration = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2062)
            temp_req->qual[d1.seq]->duration_unit = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2015)
            temp_req->qual[d1.seq]->dispense_qty = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2102)
            temp_req->qual[d1.seq]->dispense_qty_unit = trim(od.oe_field_display_value)
 
        ;BEGIN MOD 007
        elseif ((od.oe_field_meaning_id = 2290) and (od.oe_field_value > 0))
            temp_req->qual[d1.seq]->dispense_duration = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2291)
            temp_req->qual[d1.seq]->dispense_duration_unit = trim(od.oe_field_display_value)
        ;END MOD 007
 
        elseif (od.oe_field_meaning_id = 67)
            temp_req->qual[d1.seq]->nbr_refills_txt = trim(od.oe_field_display_value)
            temp_req->qual[d1.seq]->nbr_refills     = od.oe_field_value
 
        elseif (od.oe_field_meaning_id = 2101)
            temp_req->qual[d1.seq]->prn_inst = trim(od.oe_field_display_value)
            temp_req->qual[d1.seq]->prn_ind = 1
 
        elseif (od.oe_field_meaning_id = 1103)
            temp_req->qual[d1.seq]->special_inst = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 15)
            temp_req->qual[d1.seq]->indications = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 2017)
            temp_req->qual[d1.seq]->daw = od.oe_field_value
 
        elseif (od.oe_field_meaning_id = 18)
            temp_req->qual[d1.seq]->perform_loc = trim(od.oe_field_display_value)
*/
        if (od.oe_field_meaning_id = 2108)
            temp_req->qual[d1.seq]->phys_addr_id = od.oe_field_value
/*
        elseif (od.oe_field_meaning_id = 1)
            temp_req->qual[d1.seq]->free_txt_ord = trim(od.oe_field_display_value)
 
        elseif (od.oe_field_meaning_id = 1560)
            temp_req->qual[d1.seq]->req_refill_date = od.oe_field_dt_tm_value
 
        elseif (od.oe_field_meaning_id = 51)
            temp_req->qual[d1.seq]->req_start_date = od.oe_field_dt_tm_value
 
        elseif (od.oe_field_meaning_id = 1558)
            temp_req->qual[d1.seq]->total_refills = od.oe_field_value
 
        elseif (od.oe_field_meaning_id = 1557 and od.oe_field_value > 0)              ;008
            ;014 temp_req->qual[d1.seq]->add_refills_txt = trim(od.oe_field_display_value) ;008
            temp_req->qual[d1.seq]->add_refills_txt = trim(cnvtstring(od.oe_field_value-1)) ;014
            ;014 temp_req->qual[d1.seq]->add_refills = od.oe_field_value                   ;008
            temp_req->qual[d1.seq]->add_refills = od.oe_field_value - 1               ;014
            temp_req->qual[d1.seq]->refill_ind = TRUE
*/
        elseif (od.oe_field_meaning_id = 2105 and od.oe_field_value > 0 and not(is_a_reprint)) ;*** MOD 002
            temp_req->qual[d1.seq]->no_print = TRUE
 
        elseif (od.oe_field_meaning_id = 138 and
                is_a_reprint = FALSE and
                temp_req->qual[d1.seq]->csa_group != "A")  ;*** ORDEROUTPUTDEST
            temp_req->qual[d1.seq]->output_dest_cd = od.oe_field_value
 
        elseif (od.oe_field_meaning_id = 139 and
                is_a_reprint = FALSE and
                temp_req->qual[d1.seq]->csa_group != "A")  ;*** FREETEXTORDERFAXNUMBER
            temp_req->qual[d1.seq]->free_text_nbr = trim(od.oe_field_display_value)
        else
 
            oef_cnt = oef_cnt + 1
                    if (mod(oef_cnt, 10) = 1)
                            ; call echo("** sizing record")
                            stat = alterlist(temp_req->qual[d1.seq].oe_format_fields, oef_cnt + 9)
                           endif
                           ; call echo(build2("oef_cnt = ", oef_cnt))
                           temp_req->qual[d1.seq].oe_format_fields[oef_cnt].label_text = oef.label_text
                           temp_req->qual[d1.seq].oe_format_fields[oef_cnt].oe_field_display_value = od.oe_field_display_value
                           temp_req->qual[d1.seq].oe_format_fields[oef_cnt].accept_flag = oef.accept_flag
                           temp_req->qual[d1.seq].oe_format_fields[oef_cnt].disp_yes_no_flag = oef.disp_yes_no_flag
                           temp_req->qual[d1.seq].oe_format_fields[oef_cnt].oe_field_id = oef.oe_field_id
                           temp_req->qual[d1.seq].oe_format_fields[oef_cnt].oe_field_meaning_id = od.oe_field_meaning_id
                           temp_req->qual[d1.seq].oe_format_fields[oef_cnt].oe_field_value = od.oe_field_value
 
/*
        ;032 Start Drug Form detail
        elseif (od.oe_field_meaning_id = 2014)
            temp_req->qual[d1.seq]->drug_form = trim(od.oe_field_display_value)
        ;032 end
;*/
        endif
 
    endif
 
foot od.order_id
        stat = alterlist(temp_req->qual[d1.seq].oe_format_fields, oef_cnt)
 
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "ORDER_DETAIL"
    go to EXIT_SCRIPT
endif
 
;*** get order comments
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
from
    (dummyt d with seq = value(temp_req->qual_knt)),
    order_comment oc,
    long_text lt
plan d where
    d.seq > 0 and
    temp_req->qual[d.seq]->get_comment_ind = TRUE
join oc where
    oc.order_id = temp_req->qual[d.seq]->order_id and
    oc.comment_type_cd = ord_comment_cd
join lt where
    lt.long_text_id = oc.long_text_id
order
    oc.order_id,
    oc.action_sequence desc
 
head oc.order_id
    found_comment = FALSE
 
detail
    if (found_comment = FALSE)
        found_comment = TRUE
        temp_req->qual[d.seq]->comments = lt.long_text
    endif
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "ORDER_DETAIL"
    go to EXIT_SCRIPT
endif
 
;*** find mrn by encntr_id
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
    d.seq,
    ea.beg_effective_dt_tm
from
    (dummyt d with seq = value(temp_req->qual_knt)),
    encntr_alias ea
plan d where
    d.seq > 0 and
    temp_req->qual[d.seq]->encntr_id > 0
join ea where
    ea.encntr_id = temp_req->qual[d.seq]->encntr_id and
    ea.encntr_alias_type_cd = emrn_cd and
    (ea.active_ind = TRUE and
     ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
     ea.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
order
    ;ea.beg_effective_dt_tm desc
    d.seq  ;MOD 008
 
head d.seq
    temp_req->qual[d.seq]->found_emrn = TRUE
    if (ea.alias_pool_cd > 0)
        temp_req->qual[d.seq]->mrn = trim(cnvtalias(ea.alias,ea.alias_pool_cd))
    else
        temp_req->qual[d.seq]->mrn = trim(ea.alias)
    endif
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "LOAD_EMRN"
    go to EXIT_SCRIPT
endif
 
;BEGIN 019
; Completed orders printed greater then 1 minute after the original order action are not printed
 
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
;Changes by mj6234
/*I think that if you use the "expand" function on multiple fields in the select, you have to
wrap the function around every field that you use it on. It didn't seem to work when the "expand"
function was just on the fs.frequency_cd. As soon as I commented out the check to see if the
frequency_cd in the record structure was > 0 and the check to see if the action_type_cd in the
record structure was complete, it worked. Then I went back to the "old school" way using the
dummyt, it seemed to work OK. but then again, I don't ever use the "expand" function.*/
 
select into "nl:"
from frequency_schedule fs,
     (dummyt d  with seq = value(temp_req->qual_knt))
plan d
join fs
where fs.frequency_cd = temp_req->qual[d.seq]->frequency_cd
and temp_req->qual[d.seq]->action_type_cd = complete_cd
 
;BEGIN 022
head d.seq
   if (fs.frequency_type != 4 or temp_req->qual[d.seq]->frequency_cd = 0.0)                        ;024
      temp_req->qual[d.seq]->no_print=TRUE
   else
      if ((DATETIMEDIFF(temp_req->qual[d.seq]->action_dt_tm, temp_req->qual[d.seq]->orig_order_dt_tm,4)) >= 1)
         temp_req->qual[d.seq]->no_print=TRUE
      endif
   endif
 
with nocounter
 
;END 022
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "FREQUENCY_SCHEDULE"
    go to EXIT_SCRIPT
endif
;END 019
 
;*** get mrn by person_id
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
call echo(build("*** pmrn_cd :",pmrn_cd))
 
select into "nl:"
    d.seq,
    pa.beg_effective_dt_tm
from
    (dummyt d with seq = value(temp_req->qual_knt)),
    person_alias pa
plan d where
    d.seq > 0 and
    temp_req->qual[d.seq]->found_emrn = FALSE
join pa where
    pa.person_id = request->person_id and
    pa.person_alias_type_cd = pmrn_cd and
    (pa.active_ind = TRUE and
     pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
     pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
order
    ;pa.beg_effective_dt_tm desc
    d.seq   ;MOD 011
 
head d.seq
    temp_req->qual[d.seq]->found_emrn = TRUE
 
    if (pa.alias_pool_cd > 0)
        temp_req->qual[d.seq]->mrn = trim(cnvtalias(pa.alias,pa.alias_pool_cd))
    else
        temp_req->qual[d.seq]->mrn = trim(pa.alias)
    endif
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "LOAD_PMRN"
    go to EXIT_SCRIPT
endif
 
;044 /*039--
;*** find physician address by addr_id
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
    d.seq
from
    (dummyt d with seq = value(temp_req->qual_knt)),
    address a
plan d where
    d.seq > 0 and
    temp_req->qual[d.seq]->no_print = FALSE and
    temp_req->qual[d.seq]->phys_addr_id > 0
join a where
    a.address_id = temp_req->qual[d.seq]->phys_addr_id
order
    d.seq   ;MOD 011
 
head d.seq
    temp_req->qual[d.seq]->found_phys_addr_ind = TRUE
 
/*045 BEGIN*/
    temp_req->qual[d.seq].phys_phone_type_cd = EVALUATE(a.address_type_cd,
                                                        work_add_cd,  work_phone_cd,
                                                        work2_add_cd, work2_phone_cd,
                                                        work_phone_cd)
/*045 END*/
 
    temp_req->qual[d.seq]->phys_addr1 = trim(a.street_addr)
 
    if (a.street_addr2 > " ")
        temp_req->qual[d.seq]->phys_addr2 = trim(a.street_addr2)
    endif
 
    if (a.street_addr3 > " ")
        temp_req->qual[d.seq]->phys_addr3 = trim(a.street_addr3)
    endif
 
    if (a.street_addr4 > " ")
        temp_req->qual[d.seq]->phys_addr4 = trim(a.street_addr4)
    endif
 
    if (a.city > " ")
        temp_req->qual[d.seq]->phys_city = trim(a.city)
    endif
 
    if (a.state > " " or a.state_cd > 0)
        if (temp_req->qual[d.seq]->phys_city > " ")
            if (a.state_cd > 0)
                temp_req->qual[d.seq]->phys_city = concat(trim(temp_req->qual[d.seq]->
                    phys_city),", ",trim(uar_get_code_display(a.state_cd)))
            else
                temp_req->qual[d.seq]->phys_city = concat(trim(temp_req->qual[d.seq]->
                    phys_city),", ",trim(a.state))
            endif
        else
            if (a.state_cd > 0)
                temp_req->qual[d.seq]->phys_city = trim(uar_get_code_display(a.state_cd))
            else
                temp_req->qual[d.seq]->phys_city = trim(a.state)
            endif
        endif
    endif
 
    if (a.zipcode > " ")
        if (temp_req->qual[d.seq]->phys_city > " ")
            temp_req->qual[d.seq]->phys_city = concat(trim(temp_req->qual[d.seq]->phys_city),
                " ",trim(a.zipcode))
        else
            temp_req->qual[d.seq]->phys_city = trim(a.zipcode)
        endif
    endif
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "PHYS_ADDR1"
    go to EXIT_SCRIPT
endif
;044 */;--039
 
;*** find dea number
;*** find npi number ;028
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
    d.seq,
    pa.prsnl_alias_type_cd,
    pa.beg_effective_dt_tm
from
    (dummyt d with seq = value(temp_req->qual_knt)),
    prsnl_alias pa
plan d where
    d.seq > 0 and
    temp_req->qual[d.seq]->no_print = FALSE and
    temp_req->qual[d.seq]->phys_id > 0
join pa where
    pa.person_id > 0 and                                    ;012
    pa.person_id in (temp_req->qual[d.seq]->phys_id, temp_req->qual[d.seq]->sup_phys_id) and
    pa.prsnl_alias_type_cd in (docdea_cd,docnpi_cd) and                                 ;028
    (pa.active_ind = TRUE and
    pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
    pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
order
    d.seq,
    pa.prsnl_alias_type_cd,
    pa.person_id,
    pa.beg_effective_dt_tm desc
 
;head report           ***MOD 012
;    found_dea = FALSE ***MOD 012
 
head d.seq
    found_dea = FALSE
    found_dea_sup = FALSE ;012
 
head pa.prsnl_alias_type_cd ;029
    found_npi = FALSE                ;028
    found_npi_sup = FALSE         ;028
 
head pa.person_id
 
    if (found_dea = FALSE and pa.prsnl_alias_type_cd = docdea_cd and pa.person_id=temp_req->qual[d.seq]->phys_id)   ;012
        found_dea = TRUE
 
        if (pa.alias_pool_cd > 0)
            temp_req->qual[d.seq]->phys_dea = trim(cnvtalias(pa.alias,pa.alias_pool_cd))
        else
            temp_req->qual[d.seq]->phys_dea = trim(pa.alias)
        endif
    endif
 
    ;MOD 012 Start - Added in order to get the dea for the supervising physician
 
    if (found_dea_sup = FALSE and pa.prsnl_alias_type_cd = docdea_cd and pa.person_id=temp_req->qual[d.seq]->sup_phys_id)
        found_dea_sup = TRUE
 
        if (pa.alias_pool_cd > 0)
            temp_req->qual[d.seq]->sup_phys_dea = trim(cnvtalias(pa.alias,pa.alias_pool_cd))
        else
            temp_req->qual[d.seq]->sup_phys_dea = trim(pa.alias)
        endif
    endif
    ;MOD 012 Stop
 
    /*** start 028 ***/
    if (found_npi = FALSE and pa.prsnl_alias_type_cd = docnpi_cd and pa.person_id=temp_req->qual[d.seq]->phys_id)
        found_npi = TRUE
                if (pa.alias_pool_cd > 0)
                        temp_req->qual[d.seq]->phys_npi = trim(cnvtalias(pa.alias,pa.alias_pool_cd))
                else
                        temp_req->qual[d.seq]->phys_npi = trim(pa.alias)
                endif
        endif
 
        if (found_npi_sup = FALSE and pa.prsnl_alias_type_cd = docnpi_cd and pa.person_id=temp_req->qual[d.seq]->sup_phys_id)
        found_npi_sup = TRUE
                if (pa.alias_pool_cd > 0)
                        temp_req->qual[d.seq]->sup_phys_npi = trim(cnvtalias(pa.alias,pa.alias_pool_cd))
                else
                        temp_req->qual[d.seq]->sup_phys_npi = trim(pa.alias)
                endif
        endif
         /*** end 028 ***/
 
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "PHYS_DEA"
    go to EXIT_SCRIPT
endif
 
;*** find physician address by phys_id
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
    d.seq,
    a.beg_effective_dt_tm
from
    (dummyt d with seq = value(temp_req->qual_knt)),
    address a
plan d where
    d.seq > 0 and
    temp_req->qual[d.seq]->no_print = FALSE and
    temp_req->qual[d.seq]->found_phys_addr_ind = FALSE and
    temp_req->qual[d.seq]->phys_id > 0
join a where
    a.parent_entity_id = temp_req->qual[d.seq]->phys_id and
    a.parent_entity_name in ("PERSON","PRSNL") and
    a.address_type_cd = work_add_cd and
    (a.active_ind = 1 and
     a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
     a.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
order
    d.seq,
    a.beg_effective_dt_tm desc
 
head d.seq
    if (temp_req->qual[d.seq]->found_phys_addr_ind = FALSE)
 
        temp_req->qual[d.seq]->phys_addr_id        = a.address_id
        temp_req->qual[d.seq]->found_phys_addr_ind = TRUE
        temp_req->qual[d.seq]->phys_addr1          = trim(a.street_addr)
 
        if (a.street_addr2 > " ")
            temp_req->qual[d.seq]->phys_addr2 = trim(a.street_addr2)
        endif
 
        if (a.street_addr3 > " ")
            temp_req->qual[d.seq]->phys_addr3 = trim(a.street_addr3)
        endif
 
        if (a.street_addr4 > " ")
            temp_req->qual[d.seq]->phys_addr4 = trim(a.street_addr4)
        endif
 
        if (a.city > " ")
            temp_req->qual[d.seq]->phys_city = trim(a.city)
        endif
 
        if (a.state > " " or a.state_cd > 0)
            if (temp_req->qual[d.seq]->phys_city > " ")
                if (a.state_cd > 0)
                temp_req->qual[d.seq]->phys_city = concat(trim(temp_req->qual[d.seq]->
                    phys_city),", ",trim(uar_get_code_display(a.state_cd)))
                else
                    temp_req->qual[d.seq]->phys_city = concat(trim(temp_req->qual[d.seq]->
                        phys_city),", ",trim(a.state))
                endif
            else
                if (a.state_cd > 0)
                    temp_req->qual[d.seq]->phys_city = trim(uar_get_code_display(a.state_cd))
                else
                    temp_req->qual[d.seq]->phys_city = trim(a.state)
                endif
            endif
        endif
 
        if (a.zipcode > " ")
            if (temp_req->qual[d.seq]->phys_city > " ")
 
                temp_req->qual[d.seq]->phys_city = concat(trim(temp_req->qual[d.seq]->
                    phys_city)," ",trim(a.zipcode))
            else
                temp_req->qual[d.seq]->phys_city = trim(a.zipcode)
            endif
        endif
    endif
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "PHYS_ADDR2"
    go to EXIT_SCRIPT
endif
 
;*** Find doctor phone number
select into "nl:"
from
    (dummyt d with seq = value(temp_req->qual_knt)),
    phone p
plan d where
    d.seq > 0
join p where
    p.parent_entity_id = temp_req->qual[d.seq]->phys_id and
    p.parent_entity_name in ("PERSON","PRSNL") and
;045     p.phone_type_cd = work_phone_cd and
    p.phone_type_cd = temp_req->qual[d.seq].phys_phone_type_cd and  /*045*/
    (p.active_ind = 1 and
     p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
     p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
order
    d.seq,
    p.beg_effective_dt_tm desc
 
head d.seq
  temp_req->qual[d.seq]->phys_phone = trim(cnvtphone(p.phone_num,p.phone_format_cd,2))
with nocounter
 
;*** find facility address if no phys address was found
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
        d.seq
 
from
        (dummyt d with seq = value(temp_req->qual_knt))
        , encounter e
        , address a
plan d
where d.seq > 0
  and temp_req->qual[d.seq]->no_print = FALSE
  and temp_req->qual[d.seq]->found_phys_addr_ind = FALSE
 
join e
where e.encntr_id = temp_req->qual[d.seq].encntr_id
 
join a
where a.parent_entity_name = outerjoin("LOCATION")
  and a.parent_entity_id = outerjoin(e.loc_facility_cd)
  and a.address_type_cd = outerjoin(work_add_cd)
  and a.active_ind = outerjoin(1)
  and a.beg_effective_dt_tm <= outerjoin(SYSDATE)
  and a.end_effective_dt_tm > outerjoin(SYSDATE)
order d.seq, a.beg_effective_dt_tm desc
 
head d.seq
    if (temp_req->qual[d.seq]->found_phys_addr_ind = FALSE)
 
        temp_req->qual[d.seq]->phys_addr_id        = a.address_id
        temp_req->qual[d.seq]->found_phys_addr_ind = TRUE
        temp_req->qual[d.seq]->phys_addr1          = trim(uar_get_code_description(e.loc_facility_cd))
 
        if (a.street_addr2 > " ")
            temp_req->qual[d.seq]->phys_addr2 = trim(a.street_addr)
        endif
 
        if (a.street_addr3 > " ")
            temp_req->qual[d.seq]->phys_addr3 = trim(a.street_addr2)
        endif
 
        if (a.street_addr4 > " ")
            temp_req->qual[d.seq]->phys_addr4 = trim(a.street_addr3)
        endif
 
        if (a.city > " ")
            temp_req->qual[d.seq]->phys_city = trim(a.city)
        endif
 
        if (a.state > " " or a.state_cd > 0)
            if (temp_req->qual[d.seq]->phys_city > " ")
                if (a.state_cd > 0)
                temp_req->qual[d.seq]->phys_city = concat(trim(temp_req->qual[d.seq]->
                    phys_city),", ",trim(uar_get_code_display(a.state_cd)))
                else
                    temp_req->qual[d.seq]->phys_city = concat(trim(temp_req->qual[d.seq]->
                        phys_city),", ",trim(a.state))
                endif
            else
                if (a.state_cd > 0)
                    temp_req->qual[d.seq]->phys_city = trim(uar_get_code_display(a.state_cd))
                else
                    temp_req->qual[d.seq]->phys_city = trim(a.state)
                endif
            endif
        endif
 
        if (a.zipcode > " ")
            if (temp_req->qual[d.seq]->phys_city > " ")
 
                temp_req->qual[d.seq]->phys_city = concat(trim(temp_req->qual[d.seq]->
                    phys_city)," ",trim(a.zipcode))
            else
                temp_req->qual[d.seq]->phys_city = trim(a.zipcode)
            endif
        endif
    endif
with nocounter
 
 
;*** find health plans by encntr
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
    d.seq,
    epr.beg_effective_dt_tm
from
    (dummyt d with seq = value(temp_req->qual_knt)),
    encntr_plan_reltn epr,
    health_plan hp,
    organization o
plan d where
    d.seq > 0 and
    temp_req->qual[d.seq]->encntr_id > 0
join epr where
    epr.encntr_id = temp_req->qual[d.seq]->encntr_id and
    epr.priority_seq in (1,2,99) and
    (epr.active_ind = TRUE and
     epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
     epr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
join hp where
    hp.health_plan_id = epr.health_plan_id and
    hp.active_ind = TRUE
join o where
    o.organization_id= epr.organization_id
order
    d.seq,
    epr.beg_effective_dt_tm desc
 
head report
    hp_99_name   = fillstring(100," ")
    hp_99_polgrp = fillstring(200," ")
 
head d.seq
    found_pri_hp = FALSE
    found_sec_hp = FALSE
    found_99_hp  = FALSE
 
detail
 
    if (epr.priority_seq = 1 and found_pri_hp = FALSE)
        temp_req->qual[d.seq]->hp_pri_found  = TRUE
        temp_req->qual[d.seq]->hp_pri_name   = trim(o.org_name)
        temp_req->qual[d.seq]->hp_pri_polgrp = concat(trim(epr.member_nbr),"/",
            trim(hp.group_nbr))
        found_pri_hp = TRUE
    endif
 
    if (epr.priority_seq = 2 and found_sec_hp = FALSE)
        temp_req->qual[d.seq]->hp_sec_found  = TRUE
        temp_req->qual[d.seq]->hp_sec_name   = trim(o.org_name)
        temp_req->qual[d.seq]->hp_sec_polgrp = concat(trim(epr.member_nbr),"/",
            trim(hp.group_nbr))
        found_sec_hp = TRUE
    endif
 
    if (epr.priority_seq = 99 and found_99_hp = FALSE)
        hp_99_name   = trim(o.org_name)
        hp_99_polgrp = concat(trim(epr.member_nbr),"/",trim(hp.group_nbr))
        found_99_hp  = TRUE
    endif
 
foot d.seq
    if (found_pri_hp = FALSE and found_99_hp = TRUE)
        temp_req->qual[d.seq]->hp_pri_found  = TRUE
        temp_req->qual[d.seq]->hp_pri_name   = trim(hp_99_name)
        temp_req->qual[d.seq]->hp_pri_polgrp = trim(hp_99_polgrp)
        found_pri_hp = TRUE
    endif
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "ENCNTR_HEALTH"
    go to EXIT_SCRIPT
endif
 
;*** find health plans by person
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
select into "nl:"
    d.seq,
    ppr.beg_effective_dt_tm
from
    (dummyt d with seq = value(temp_req->qual_knt)),
    person_plan_reltn ppr,
    health_plan hp,
    organization o
plan d where
    d.seq > 0 and
    (temp_req->qual[d.seq]->hp_pri_found = FALSE or
     temp_req->qual[d.seq]->hp_sec_found = FALSE)
join ppr where
    ppr.person_id = request->person_id and
    ppr.priority_seq in (1,2,99) and
    (ppr.active_ind = TRUE and
     ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
     ppr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3))
join hp where
    hp.health_plan_id = ppr.health_plan_id and
    hp.active_ind = TRUE
join o where
    o.organization_id= ppr.organization_id
order
    d.seq,
    ppr.beg_effective_dt_tm desc
 
head report
    hp_99_name = fillstring(100," ")
    hp_99_polgrp = fillstring(200," ")
 
head d.seq
    found_pri_hp = FALSE
    found_sec_hp = FALSE
    found_99_hp = FALSE
 
detail
    if (ppr.priority_seq = 1 and found_pri_hp = FALSE and
        temp_req->qual[d.seq]->hp_pri_found = FALSE)
 
        temp_req->qual[d.seq]->hp_pri_found  = TRUE
        temp_req->qual[d.seq]->hp_pri_name   = trim(o.org_name)
        temp_req->qual[d.seq]->hp_pri_polgrp = concat(trim(ppr.member_nbr),"/",
            trim(hp.group_nbr))
        found_pri_hp = TRUE
    endif
 
    if (ppr.priority_seq = 2 and found_sec_hp = FALSE and
       temp_req->qual[d.seq]->hp_sec_found = FALSE)
 
        temp_req->qual[d.seq]->hp_sec_found  = TRUE
        temp_req->qual[d.seq]->hp_sec_name   = trim(o.org_name)
        temp_req->qual[d.seq]->hp_sec_polgrp = concat(trim(ppr.member_nbr),"/",
            trim(hp.group_nbr))
        found_sec_hp = TRUE
    endif
 
    if (ppr.priority_seq = 99 and found_99_hp = FALSE and
        temp_req->qual[d.seq]->hp_pri_found = FALSE)
 
        hp_99_name   = trim(o.org_name)
        hp_99_polgrp = concat(trim(ppr.member_nbr),"/",trim(hp.group_nbr))
        found_99_hp  = TRUE
   endif
 
foot d.seq
    if (found_pri_hp = FALSE and found_99_hp = TRUE)
        temp_req->qual[d.seq]->hp_pri_found  = TRUE
        temp_req->qual[d.seq]->hp_pri_name   = trim(hp_99_name)
        temp_req->qual[d.seq]->hp_pri_polgrp = trim(hp_99_polgrp)
        found_pri_hp = TRUE
   endif
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "PERSON_HEALTH"
    go to EXIT_SCRIPT
endif
 
;030
select into "nl:"
from  (dummyt d with seq = size(request->order_qual, 5)),
      order_catalog_synonym ocs,
      orders o
 
plan  d
where d.seq > 0
 
join o
where o.order_id = temp_req->qual[d.seq]->order_id
 
join ocs
where ocs.synonym_id = o.synonym_id
 
detail
temp_req->qual[d.seq]->mnemonic_type_cd = ocs.mnemonic_type_cd
with nocounter
 
;*** parse details
for (a = 1 to temp_req->qual_knt)
 
    if (temp_req->qual[a]->no_print = FALSE)
 
        if (temp_req->qual[a]->free_txt_ord > " ")
            set temp_req->qual[a]->med_name = trim(temp_req->qual[a]->free_txt_ord)
        else
            set temp_req->qual[a]->med_name = trim(temp_req->qual[a]->order_as_mnemonic)
        endif
 
        ;MOD 012 Start - Should look like a new prescription when having additional refill.
        if (temp_req->qual[a]->add_refills_txt > " " and temp_req->qual[a]->add_refills > 0)
            set temp_req->qual[a]->refill_line = trim(temp_req->qual[a]->add_refills_txt)
        ;MOD 012 End
        else
            ;008
            if (temp_req->qual[a]->nbr_refills_txt > " " and temp_req->qual[a]->nbr_refills > 0)
                if (temp_req->qual[a]->nbr_refills = temp_req->qual[a]->total_refills)
                    set temp_req->qual[a]->refill_line = trim(temp_req->qual[a]->nbr_refills_txt)
                endif
            endif
                endif        ;Mod 13 PC3603
            if (temp_req->qual[a]->refill_line > " ")
                set pt->line_cnt = 0
                set max_length = 60
                execute dcp_parse_text value(temp_req->qual[a]->refill_line), value(max_length)
 
                set temp_req->qual[a]->refill_knt = pt->line_cnt
                set stat = alterlist(temp_req->qual[a]->refill,temp_req->qual[a]->refill_knt)
                for (c = 1 to pt->line_cnt)
                    set temp_req->qual[a]->refill[c]->disp = concat("<",trim(pt->lns[c]->line),">")
                endfor
            endif
;Mod 13 PC3603        endif
 
        set pt->line_cnt = 0
        set max_length = 55
        execute dcp_parse_text value(temp_req->qual[a]->med_name), value(max_length)
 
        set temp_req->qual[a]->med_knt = pt->line_cnt
        set stat = alterlist(temp_req->qual[a]->med,temp_req->qual[a]->med_knt)
 
        for (c = 1 to pt->line_cnt)
            set temp_req->qual[a]->med[c]->disp = trim(pt->lns[c]->line)
        endfor
 
        if (temp_req->qual[a]->nbr_refills = temp_req->qual[a]->total_refills)
            set temp_req->qual[a]->start_date = cnvtdatetime(cnvtdate(temp_req->qual[a]->
                req_start_date),0)
        else
            set temp_req->qual[a]->start_date = cnvtdatetime(cnvtdate(temp_req->qual[a]->
                req_refill_date),0)
        endif
 
        if (temp_req->qual[a]->strength_dose > " " and temp_req->qual[a]->volume_dose > " ")
 
          ;030 For Orders containing both strength and volume doses the requisitions will print both
           ;  strength and volume doses for Primary, Brand and C type mnemonics
 
           if (temp_req->qual[a]->mnemonic_type_cd = value(primary_mnemonic_type_cd) or
               temp_req->qual[a]->mnemonic_type_cd = value(brand_mnemonic_type_cd) or
               temp_req->qual[a]->mnemonic_type_cd = value(c_mnemonic_type_cd))
 
            set temp_req->qual[a]->sig_line = trim(temp_req->qual[a]->strength_dose)
 
            if (temp_req->qual[a]->strength_dose_unit > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->strength_dose_unit))
            endif
 
            set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    "/",trim(temp_req->qual[a]->volume_dose))
 
            if (temp_req->qual[a]->volume_dose_unit > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->volume_dose_unit))
            endif
 
          else   ;030
 
            set temp_req->qual[a]->sig_line = trim(temp_req->qual[a]->volume_dose)
 
            if (temp_req->qual[a]->volume_dose_unit > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->volume_dose_unit))
            endif
 
          endif  ;030
 
            ;032 Start Drug From
            if (temp_req->qual[a]->drug_form > " " and not
                   (temp_req->qual[a]->mnemonic_type_cd = value(generic_top_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(trade_top_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(generic_prod_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(trade_prod_type_cd)))
                    set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->drug_form))
            endif
            ;032 End
 
            if (temp_req->qual[a]->rx_route > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->rx_route))
            endif
 
            if (temp_req->qual[a]->frequency > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->frequency))
            endif
 
            if (temp_req->qual[a]->duration > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " for ",trim(temp_req->qual[a]->duration))
            endif
 
            if (temp_req->qual[a]->duration_unit > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->duration_unit))
            endif
 
        elseif (temp_req->qual[a]->strength_dose > " ")
 
            set temp_req->qual[a]->sig_line = trim(temp_req->qual[a]->strength_dose)
            if (temp_req->qual[a]->strength_dose_unit > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->strength_dose_unit))
            endif
 
            ;032 Drug Form
            if (temp_req->qual[a]->drug_form > " " and not
                   (temp_req->qual[a]->mnemonic_type_cd = value(generic_top_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(trade_top_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(generic_prod_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(trade_prod_type_cd)))
                    set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->drug_form))
            endif
            ;032 End
 
            if (temp_req->qual[a]->rx_route > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->rx_route))
            endif
 
            if (temp_req->qual[a]->frequency > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->frequency))
            endif
 
            if (temp_req->qual[a]->duration > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " for ",trim(temp_req->qual[a]->duration))
            endif
 
            if (temp_req->qual[a]->duration_unit > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->duration_unit))
            endif
 
        elseif (temp_req->qual[a]->volume_dose > " ")
 
            set temp_req->qual[a]->sig_line = trim(temp_req->qual[a]->volume_dose)
            if (temp_req->qual[a]->volume_dose_unit > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->volume_dose_unit))
            endif
 
            ;032 Drug Form
            if (temp_req->qual[a]->drug_form > " " and not
                   (temp_req->qual[a]->mnemonic_type_cd = value(generic_top_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(trade_top_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(generic_prod_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(trade_prod_type_cd)))
                    set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->drug_form))
            endif
            ;032 End
 
            if (temp_req->qual[a]->rx_route > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->rx_route))
            endif
 
            if (temp_req->qual[a]->frequency > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->frequency))
            endif
 
            if (temp_req->qual[a]->duration > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " for ",trim(temp_req->qual[a]->duration))
            endif
 
            if (temp_req->qual[a]->duration_unit > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->duration_unit))
            endif
        else
 
            set temp_req->qual[a]->sig_line = trim(temp_req->qual[a]->freetext_dose)
 
            ;032 Drug Form
            if (temp_req->qual[a]->drug_form > " " and not
                   (temp_req->qual[a]->mnemonic_type_cd = value(generic_top_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(trade_top_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(generic_prod_type_cd)
                    or temp_req->qual[a]->mnemonic_type_cd = value(trade_prod_type_cd)))
                    set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->drug_form))
            endif
            ;032 End
 
            if (temp_req->qual[a]->rx_route > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->rx_route))
            endif
 
            if (temp_req->qual[a]->frequency > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->frequency))
            endif
 
            if (temp_req->qual[a]->duration > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " for ",trim(temp_req->qual[a]->duration))
            endif
 
            if (temp_req->qual[a]->duration_unit > " ")
                set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line),
                    " ",trim(temp_req->qual[a]->duration_unit))
            endif
        endif
 
        if (temp_req->qual[a]->prn_ind = TRUE and temp_req->qual[a]->prn_inst > " ")        ; MOD 020
            set temp_req->qual[a]->sig_line = concat(trim(temp_req->qual[a]->sig_line)," PRN ",trim(temp_req->qual[a]->prn_inst))
        endif
 
        if (temp_req->qual[a]->sig_line > " ")
            set pt->line_cnt = 0
            set max_length = 60
            execute dcp_parse_text value(temp_req->qual[a]->sig_line), value(max_length)
 
            set temp_req->qual[a]->sig_knt = pt->line_cnt
            set stat = alterlist(temp_req->qual[a]->sig,temp_req->qual[a]->sig_knt)
            for (c = 1 to pt->line_cnt)
                set temp_req->qual[a]->sig[c]->disp = trim(pt->lns[c]->line)
            endfor
        endif
 
        if (temp_req->qual[a]->dispense_qty > " ")
            set temp_req->qual[a]->dispense_line = trim(temp_req->qual[a]->dispense_qty)
            if (temp_req->qual[a]->dispense_qty_unit > " ")
                set temp_req->qual[a]->dispense_line = trim(concat(temp_req->qual[a]->
                    dispense_line," ",trim(temp_req->qual[a]->dispense_qty_unit)))
            endif
 
        elseif (temp_req->qual[a]->dispense_qty_unit > " ")
            set temp_req->qual[a]->dispense_line = trim(temp_req->qual[a]->dispense_qty_unit)
        endif
 
         ;BEGIN MOD 007
        if (temp_req->qual[a]->dispense_duration > " ")
            set temp_req->qual[a]->dispense_duration_line = trim(temp_req->qual[a]->dispense_duration)
            if (temp_req->qual[a]->dispense_duration_unit > " ")
                set temp_req->qual[a]->dispense_duration_line = trim(concat(temp_req->qual[a]->
                    dispense_duration_line," ",trim(temp_req->qual[a]->dispense_duration_unit)))
            endif
 
        elseif (temp_req->qual[a]->dispense_duration_unit > " ")
            set temp_req->qual[a]->dispense_duration_line = trim(temp_req->qual[a]->dispense_duration_unit)
 
        endif
 
        if (temp_req->qual[a]->dispense_duration_line > " ")
                set temp_req->qual[a]->dispense_duration_line = concat(temp_req->qual[a]->dispense_duration_line," supply")
                set temp_req->qual[a]->dispense_line = " "
        endif
        ;END MOD 007
 
        if (temp_req->qual[a]->dispense_line > " ")
            set pt->line_cnt = 0
            set max_length = 60
            execute dcp_parse_text value(temp_req->qual[a]->dispense_line), value(max_length)
 
            set temp_req->qual[a]->dispense_knt = pt->line_cnt
            set stat = alterlist(temp_req->qual[a]->dispense,temp_req->qual[a]->dispense_knt)
            for (c = 1 to pt->line_cnt)
                set temp_req->qual[a]->dispense[c]->disp = concat("<",trim(pt->lns[c]->line),">")
            endfor
        endif
 
        ;BEGIN MOD 007
        if (temp_req->qual[a]->dispense_duration_line > " ")
            set pt->line_cnt = 0
            set max_length = 60
            execute dcp_parse_text value(temp_req->qual[a]->dispense_duration_line), value(max_length)
 
            set temp_req->qual[a]->dispense_duration_knt = pt->line_cnt
            set stat = alterlist(temp_req->qual[a]->dispense_duration_qual,temp_req->qual[a]->dispense_duration_knt)
            for (c = 1 to pt->line_cnt)
                set temp_req->qual[a]->dispense_duration_qual[c]->disp = concat("<",trim(pt->lns[c]->line),">")
            endfor
        endif
        ;END MOD 007
 
/*
        if (not(temp_req->qual[a]->add_refills > " "))
            if (temp_req->qual[a]->nbr_refills_txt > " ")
                if (temp_req->qual[a]->nbr_refills = temp_req->qual[a]->total_refills)
                    set temp_req->qual[a]->refill_line = trim(temp_req->qual[a]->nbr_refills_txt)
                endif
            endif
 
            if (temp_req->qual[a]->refill_line > " ")
                set pt->line_cnt = 0
                set max_length = 60
                execute dcp_parse_text value(temp_req->qual[a]->refill_line), value(max_length)
 
                set temp_req->qual[a]->refill_knt = pt->line_cnt
                set stat = alterlist(temp_req->qual[a]->refill,temp_req->qual[a]->refill_knt)
                for (c = 1 to pt->line_cnt)
                    set temp_req->qual[a]->refill[c]->disp = concat("<",trim(pt->lns[c]->line),">")
                endfor
            endif
        endif
*/
 
        if (temp_req->qual[a]->special_inst > " ")
            set temp_req->qual[a]->special_inst = trim(temp_req->qual[a]->special_inst)
            set pt->line_cnt = 0
            set max_length = 60
            execute dcp_parse_text value(temp_req->qual[a]->special_inst), value(max_length)
 
            set temp_req->qual[a]->special_knt = pt->line_cnt
            set stat = alterlist(temp_req->qual[a]->special,temp_req->qual[a]->special_knt)
            for (c = 1 to pt->line_cnt)
                set temp_req->qual[a]->special[c]->disp = trim(pt->lns[c]->line)
            endfor
        endif
 
/**
        if (temp_req->qual[a]->prn_inst > " ")
            set temp_req->qual[a]->prn_inst = trim(temp_req->qual[a]->prn_inst)
            set pt->line_cnt = 0
            set max_length = 60
            execute dcp_parse_text value(temp_req->qual[a]->prn_inst), value(max_length)
 
            set temp_req->qual[a]->prn_knt = pt->line_cnt
            set stat = alterlist(temp_req->qual[a]->prn,temp_req->qual[a]->prn_knt)
            for (c = 1 to pt->line_cnt)
                set temp_req->qual[a]->prn[c]->disp = trim(pt->lns[c]->line)
            endfor
        endif
**/
 
        if (temp_req->qual[a]->indications > " ")
            set temp_req->qual[a]->indications = trim(temp_req->qual[a]->indications)
            set pt->line_cnt = 0
            set max_length = 60
            execute dcp_parse_text value(temp_req->qual[a]->indications), value(max_length)
 
            set temp_req->qual[a]->indic_knt = pt->line_cnt
            set stat = alterlist(temp_req->qual[a]->indic,temp_req->qual[a]->indic_knt)
            for (c = 1 to pt->line_cnt)
                set temp_req->qual[a]->indic[c]->disp = trim(pt->lns[c]->line)
            endfor
        endif
 
        if (temp_req->qual[a]->comments > " ")
            set temp_req->qual[a]->comments = trim(temp_req->qual[a]->comments)
            set pt->line_cnt = 0
            set max_length = 60
            execute dcp_parse_text value(temp_req->qual[a]->comments), value(max_length)
 
            set temp_req->qual[a]->comment_knt = pt->line_cnt
            set stat = alterlist(temp_req->qual[a]->comment,temp_req->qual[a]->comment_knt)
            for (c = 1 to pt->line_cnt)
                set temp_req->qual[a]->comment[c]->disp = trim(pt->lns[c]->line)
            endfor
        endif
 
        call echo("3000")
 
        if (temp_req->qual[a].clinical_disp_line > " ")
                set temp_req->qual[a].clinical_disp_line = trim(temp_req->qual[a].clinical_disp_line)
                set pt->line_cnt = 0
                set max_length = 80
                execute dcp_parse_text value(temp_req->qual[a].clinical_disp_line), value(max_length)
 
                set temp_req->qual[a].clin_disp_cnt = pt->line_cnt
                set stat = alterlist(temp_req->qual[a].clin_disp, temp_req->qual[a].clin_disp_cnt)
                for (c = 1 to pt->line_cnt)
                        set temp_req->qual[a].clin_disp[c]->disp = trim(pt->lns[c]->line)
                endfor
        endif
 
        set oef_cnt = size(temp_req->qual[a].oe_format_fields, 5)
        if (oef_cnt > 0)
                for(b = 1 to oef_cnt)
                        ; call echo(build2("** ", temp_req->qual[a].oe_format_fields[b].oe_field_display_value))
                        set pt->line_cnt = 0
                        set max_length = 60
                        execute dcp_parse_text value(build2(trim(temp_req->qual[a].oe_format_fields[b].label_text), ": {b}",
                                                            trim(temp_req->qual[a].oe_format_fields[b].oe_field_display_value),
                                                            "{endb}")
                                                    ), value(max_length)
                        ;call echorecord(pt)
                        set temp_req->qual[a].oe_format_fields[b].line_knt = pt->line_cnt
                        set stat = alterlist(temp_req->qual[a].oe_format_fields[b].lines, pt->line_cnt)
                        for (c = 1 to pt->line_cnt)
                                set temp_req->qual[a].oe_format_fields[b].lines[c].disp = trim(pt->lns[c].line)
                        endfor
                endfor
              endif
    endif
endfor
 
/****************************************************************************
*       build print record                                                  *
*****************************************************************************/
free record tprint_req
record tprint_req
(
  1 job_knt = i4
  1 job[*]
    2 refill_ind     = i2
    2 phys_id        = f8 ;040
    2 phys_sign_dt_tm = vc ;052
    2 phys_name      = vc
    2 phys_bname     = vc
    2 phys_fname     = vc
    2 phys_mname     = vc
    2 phys_lname     = vc
    2 eprsnl_id      = f8
    2 eprsnl_ind     = i2
    2 eprsnl_name    = vc
    2 eprsnl_bname   = vc
    2 eprsnl_fname   = vc
    2 eprsnl_mname   = vc
    2 eprsnl_lname   = vc
    2 phys_facility  = vc ;035
    2 phys_site      = vc ;049
    2 phys_addr1     = vc
    2 phys_addr2     = vc
    2 phys_addr3     = vc
    2 phys_addr4     = vc
    2 phys_city      = vc
    2 phys_dea       = vc
    2 phys_npi       = vc ;028
    2 sup_phys_npi   = vc ;028
    2 phys_lnbr      = vc
    2 phys_phone     = vc
    2 csa_group      = vc
    2 phys_ord_dt    = vc
    2 output_dest_cd = f8
    2 free_text_nbr  = vc
    2 print_loc      = vc
    2 daw            = i2
    2 mrn            = vc
    2 hp_found       = i2
    2 hp_pri_name    = vc
    2 hp_pri_polgrp  = vc
    2 hp_sec_name    = vc
    2 hp_sec_polgrp  = vc
    2 req_knt        = i4
    2 req[*]
      3 order_id     = f8
      3 fax_dest     = vc
      3 print_dea    = i2
      3 csa_sched    = c1
      3 start_dt     = vc
      3 med_knt      = i4
      3 med[*]
        4 disp       = vc
      3 sig_knt      = i4
      3 sig[*]
        4 disp       = vc
      3 dispense_knt = i4
      3 dispense[*]
        4 disp       = vc
      3 dispense_duration_knt = i4        ;*** MOD 007
      3 dispense_duration[*]                ;*** MOD 007
        4 disp       = vc                ;*** MOD 007
      3 refill_knt   = i4
      3 refill[*]
        4 disp       = vc
      3 special_knt  = i4
      3 special[*]
        4 disp       = vc
      3 prn_knt      = i4
      3 prn[*]
        4 disp       = vc
      3 indic_knt    = i4
      3 indic[*]
        4 disp       = vc
      3 comment_knt  = i4
      3 comment[*]
        4 disp       = vc
      3 diag_knt	 = i4 ;035
      3 diag_lne     = vc ;28
      3 diag[*]	 	 = vc ;035
      	4 disp		 = vc ;035
      	4 seq_code   = vc ;035
      3 oef_field_knt = i4 ;034
      3 oef_fields[*]
        4 line_knt = i4
              4 lines [*]
                5 disp     = vc
      3 clin_disp_cnt = i4
      3 clin_disp[*]
              4 disp = vc
    2 sup_phys_bname = vc   ;012
    2 sup_phys_dea   = vc   ;012
    2 sup_phys_id    = f8   ;012
)
 
set iErrCode = error(sErrMsg,1)
set iErrCode = 0
 
;CMB declare phys_npi_cd = f8 with public, constant(uar_get_code_by("MEANING",320,"NPI")) ;035
;CMB declare diagnosis_cd = f8 with public, constant(uar_get_code_by("MEANING",17,"FINAL")) ;035
call echo("** select into nl")
call echo(build2("temp_req->qual_knt = ", temp_req->qual_knt))
;ch014039 set temp_req->qual[1].no_print = FALSE
 
select into "nl:"
    encntr_id = temp_req->qual[d.seq]->encntr_id,
    print_loc = temp_req->qual[d.seq]->print_loc,
    order_dt = format(cnvtdatetime(temp_req->qual[d.seq]->order_dt),"mm/dd/yyyy;;d"),
    print_dea = temp_req->qual[d.seq]->print_dea,
    csa_schedule = temp_req->qual[d.seq]->csa_schedule,
    csa_group = temp_req->qual[d.seq]->csa_group,
    daw = temp_req->qual[d.seq]->daw,
    output_dest_cd = temp_req->qual[d.seq]->output_dest_cd,
    free_text_nbr = temp_req->qual[d.seq]->free_text_nbr,
    fax_seq = build(temp_req->qual[d.seq]->output_dest_cd,temp_req->qual[d.seq]->free_text_nbr),
    phys_id = temp_req->qual[d.seq]->phys_id,
    phys_addr_id = temp_req->qual[d.seq]->phys_addr_id,
    phys_seq = build(temp_req->qual[d.seq]->phys_id,temp_req->qual[d.seq]->phys_addr_id),
    sup_phys_id = temp_req->qual[d.seq]->sup_phys_id,
    refill_ind = temp_req->qual[d.seq]->refill_ind,
    o_seq_1 = build(temp_req->qual[d.seq]->refill_ind,temp_req->qual[d.seq]->encntr_id),
    d.seq
from
    (dummyt d with seq = value(temp_req->qual_knt))
plan d where
    d.seq > 0 and
    temp_req->qual[d.seq]->no_print = FALSE
order
;**    refill_ind,
;**    encntr_id,
    o_seq_1,
    order_dt,
    daw,
    csa_group,
    csa_schedule,
    print_loc,
    fax_seq,
    phys_seq,
    sup_phys_id,
    print_dea
    ;d.seq
 
head report
    call echo("** In head report")
    jknt = 0
    rknt = 0
    stat = alterlist(tprint_req->job,10)
 
    new_job             = FALSE
;    temp_refill_ind     = -1
;    temp_encntr_id      = 0.0
    temp_o_seq_1        = fillstring(255," ")
    temp_order_dt       = fillstring(12," ")
    temp_print_loc      = fillstring(255," ")
    temp_output_dest_cd = 0.0
    temp_free_text_nbr  = fillstring(255," ")
    temp_phys_id        = 0.0
    temp_phys_addr_id   = 0.0
    temp_sup_phys_id         = 0.0
    temp_daw            = 0
    temp_csa_group      = ""
    temp_csa_schedule   = fillstring(1," ")
 
detail
 
/*
    if (temp_refill_ind != refill_ind)
        new_job = TRUE
    endif
 
    if (temp_encntr_id != encntr_id)
        new_job = TRUE
    endif
*/
 
    if (temp_o_seq_1 != o_seq_1)
            call echo("* 1")
        new_job = TRUE
    endif
 
    if (temp_order_dt != order_dt)
    call echo("* 2")
        new_job = TRUE
    endif
 
    if (temp_print_loc != print_loc)
            call echo("* 3")
        new_job = TRUE
    endif
 
    if (temp_output_dest_cd != output_dest_cd)
            call echo("* 4")
        new_job = TRUE
    endif
 
    if (temp_free_text_nbr != free_text_nbr)
            call echo("* 5")
        new_job = TRUE
    endif
 
    if (temp_phys_id != phys_id)
            call echo("* 6")
        new_job = TRUE
    endif
 
    if (temp_phys_addr_id != phys_addr_id)
            call echo("* 7")
        new_job = TRUE
    endif
 
    if (temp_sup_phys_id != sup_phys_id)
            call echo("* 8")
        new_job = TRUE
    endif
 
    if (temp_daw != daw)
            call echo("* 9")
        new_job = TRUE
    endif
 
;    if (temp_csa_group != csa_group)
;        call echo("* 10")
;        new_job = TRUE
;    endif
 
    if (new_job = TRUE)
        new_job = FALSE
 
        if (jknt > 0)
            tprint_req->job[jknt]->req_knt = rknt
            stat = alterlist(tprint_req->job[jknt]->req,rknt)
        endif
 
        jknt = jknt + 1
        if (mod(jknt,10) = 1 and jknt != 1)
            stat = alterlist(tprint_req->job,jknt + 9)
        endif
 
        tprint_req->job[jknt]->csa_group   = csa_group
        tprint_req->job[jknt]->refill_ind = temp_req->qual[d.seq]->refill_ind
	tprint_req->job[jknt]->phys_id	   = temp_req->qual[d.seq]->phys_id   ;040
        tprint_req->job[jknt]->phys_sign_dt_tm   = temp_req->qual[d.seq]->phys_sign_dt_tm ;052
        tprint_req->job[jknt]->phys_name   = temp_req->qual[d.seq]->phys_name
        tprint_req->job[jknt]->phys_bname   = temp_req->qual[d.seq]->phys_bname
        tprint_req->job[jknt]->phys_fname  = temp_req->qual[d.seq]->phys_fname
        tprint_req->job[jknt]->phys_mname  = temp_req->qual[d.seq]->phys_mname
        tprint_req->job[jknt]->phys_lname  = temp_req->qual[d.seq]->phys_lname
        tprint_req->job[jknt]->eprsnl_ind = temp_req->qual[d.seq]->eprsnl_ind
        tprint_req->job[jknt]->eprsnl_bname = temp_req->qual[d.seq]->eprsnl_bname
        tprint_req->job[jknt]->eprsnl_id = temp_req->qual[d.seq]->eprsnl_id             ;022
        tprint_req->job[jknt]->phys_addr1  = temp_req->qual[d.seq]->phys_addr1
        tprint_req->job[jknt]->phys_addr2  = temp_req->qual[d.seq]->phys_addr2
        tprint_req->job[jknt]->phys_addr3  = temp_req->qual[d.seq]->phys_addr3
        tprint_req->job[jknt]->phys_addr4  = temp_req->qual[d.seq]->phys_addr4
        tprint_req->job[jknt]->phys_city   = temp_req->qual[d.seq]->phys_city
        tprint_req->job[jknt]->phys_dea    = temp_req->qual[d.seq]->phys_dea
        tprint_req->job[jknt]->phys_npi    = temp_req->qual[d.seq]->phys_npi ;028
        tprint_req->job[jknt]->sup_phys_npi = temp_req->qual[d.seq]->sup_phys_npi ;028
        tprint_req->job[jknt]->phys_lnbr   = temp_req->qual[d.seq]->phys_lnbr
        tprint_req->job[jknt]->phys_phone  = temp_req->qual[d.seq]->phys_phone
        tprint_req->job[jknt]->phys_ord_dt = order_dt
        tprint_req->job[jknt]->sup_phys_bname   = temp_req->qual[d.seq]->sup_phys_bname ;012
        tprint_req->job[jknt]->sup_phys_dea    = temp_req->qual[d.seq]->sup_phys_dea    ;012
        tprint_req->job[jknt]->phys_facility = temp_req->qual[d.seq]->phys_facility ;035
        tprint_req->job[jknt]->phys_site = temp_req->qual[d.seq]->phys_site ;049
 
        if (tprint_req->job[jknt]->csa_group = "A")
            tprint_req->job[jknt]->output_dest_cd = -1
            tprint_req->job[jknt]->free_text_nbr = "1"
        else
            ;036 temp_req->qual[d.seq]->output_dest_cd = 897597 (input dest_cd for fax ver.)
            tprint_req->job[jknt]->output_dest_cd = temp_req->qual[d.seq]->output_dest_cd
            tprint_req->job[jknt]->free_text_nbr = trim(temp_req->qual[d.seq]->free_text_nbr)
        endif
 
        tprint_req->job[jknt]->print_loc     = trim(temp_req->qual[d.seq]->print_loc)
        tprint_req->job[jknt]->daw           = temp_req->qual[d.seq]->daw
        tprint_req->job[jknt]->mrn           = temp_req->qual[d.seq]->mrn
call echo("***")
call echo(build("***   hp_pri_found :",temp_req->qual[d.seq]->hp_pri_found))
call echo(build("***   hp_sec_found :",temp_req->qual[d.seq]->hp_sec_found))
call echo("***")
        if (temp_req->qual[d.seq]->hp_pri_found = TRUE or temp_req->qual[d.seq]->hp_sec_found = TRUE)
            tprint_req->job[jknt]->hp_found = TRUE
        endif
        tprint_req->job[jknt]->hp_pri_name   = temp_req->qual[d.seq]->hp_pri_name
        tprint_req->job[jknt]->hp_pri_polgrp = temp_req->qual[d.seq]->hp_pri_polgrp
        tprint_req->job[jknt]->hp_sec_name   = temp_req->qual[d.seq]->hp_sec_name
        tprint_req->job[jknt]->hp_sec_polgrp = temp_req->qual[d.seq]->hp_sec_polgrp
 
;**     temp_refill_ind     = refill_ind
;**        temp_encntr_id      = encntr_id
        temp_o_seq_1        = o_seq_1
        temp_order_dt       = order_dt
        temp_print_loc      = print_loc
        temp_output_dest_cd = output_dest_cd
        temp_free_text_nbr  = free_text_nbr
        temp_phys_id        = phys_id
        temp_phys_addr_id   = phys_addr_id
        temp_sup_phys_id        = sup_phys_id
        temp_daw            = daw
        temp_csa_group      = csa_group
        temp_csa_schedule   = csa_schedule
 
        rknt = 0
        stat = alterlist(tprint_req->job[jknt]->req,10)
    endif
 
    if (jknt > 0)
        rknt = rknt + 1
        if (mod(rknt,10) = 1 and rknt != 1)
            stat = alterlist(tprint_req->job[jknt]->req,rknt + 9)
        endif
 
        tprint_req->job[jknt]->req[rknt]->order_id = temp_req->qual[d.seq]->order_id
        tprint_req->job[jknt]->req[rknt]->print_dea   = temp_req->qual[d.seq]->print_dea
        tprint_req->job[jknt]->req[rknt]->csa_sched = csa_schedule
        tprint_req->job[jknt]->req[rknt]->start_dt = format(cnvtdatetime(temp_req->
            qual[d.seq]->start_date),"mm/dd/yyyy;;d")
 
        tprint_req->job[jknt]->req[rknt]->med_knt = temp_req->qual[d.seq]->med_knt
        stat = alterlist(tprint_req->job[jknt]->req[rknt]->med,tprint_req->job[jknt]->
            req[rknt]->med_knt)
        for (z = 1 to tprint_req->job[jknt]->req[rknt]->med_knt)
            tprint_req->job[jknt]->req[rknt]->med[z]->disp = temp_req->qual[d.seq]->med[z]->
                disp
        endfor
 
        tprint_req->job[jknt]->req[rknt]->sig_knt = temp_req->qual[d.seq]->sig_knt
        stat = alterlist(tprint_req->job[jknt]->req[rknt]->sig,tprint_req->job[jknt]->
            req[rknt]->sig_knt)
        for (z = 1 to tprint_req->job[jknt]->req[rknt]->sig_knt)
            tprint_req->job[jknt]->req[rknt]->sig[z]->disp = temp_req->qual[d.seq]->sig[z]->
                disp
        endfor
 
        if (temp_req->qual[d.seq]->dispense_knt > 0)        ;*** MOD 007
            tprint_req->job[jknt]->req[rknt]->dispense_knt = temp_req->qual[d.seq]->dispense_knt
            stat = alterlist(tprint_req->job[jknt]->req[rknt]->dispense,tprint_req->job[jknt]->
                req[rknt]->dispense_knt)
            for (z = 1 to tprint_req->job[jknt]->req[rknt]->dispense_knt)
                tprint_req->job[jknt]->req[rknt]->dispense[z]->disp = temp_req->qual[d.seq]->
                    dispense[z]->disp
            endfor
        ;BEGIN MOD 007
        else
            tprint_req->job[jknt]->req[rknt]->dispense_duration_knt = temp_req->qual[d.seq]->dispense_duration_knt
            stat = alterlist(tprint_req->job[jknt]->req[rknt]->dispense_duration,tprint_req->job[jknt]->
                req[rknt]->dispense_duration_knt)
            for (z = 1 to tprint_req->job[jknt]->req[rknt]->dispense_duration_knt)
               tprint_req->job[jknt]->req[rknt]->dispense_duration[z]->disp =
                 temp_req->qual[d.seq]->dispense_duration_qual[z]->disp
            endfor
        endif
        ;END MOD 007
 
        tprint_req->job[jknt]->req[rknt]->refill_knt = temp_req->qual[d.seq]->refill_knt
        stat = alterlist(tprint_req->job[jknt]->req[rknt]->refill,tprint_req->job[jknt]->
            req[rknt]->refill_knt)
        for (z = 1 to tprint_req->job[jknt]->req[rknt]->refill_knt)
            tprint_req->job[jknt]->req[rknt]->refill[z]->disp = temp_req->qual[d.seq]->refill[z]->disp
        endfor
 
        tprint_req->job[jknt]->req[rknt]->special_knt = temp_req->qual[d.seq]->special_knt
        stat = alterlist(tprint_req->job[jknt]->req[rknt]->special,tprint_req->job[jknt]->
            req[rknt]->special_knt)
        for (z = 1 to tprint_req->job[jknt]->req[rknt]->special_knt)
            tprint_req->job[jknt]->req[rknt]->special[z]->disp = temp_req->qual[d.seq]->
                special[z]->disp
        endfor
 
        tprint_req->job[jknt]->req[rknt]->prn_knt = temp_req->qual[d.seq]->prn_knt
        stat = alterlist(tprint_req->job[jknt]->req[rknt]->prn,tprint_req->job[jknt]->
            req[rknt]->prn_knt)
        for (z = 1 to tprint_req->job[jknt]->req[rknt]->prn_knt)
            tprint_req->job[jknt]->req[rknt]->prn[z]->disp = temp_req->qual[d.seq]->prn[z]->
                disp
        endfor
 
        tprint_req->job[jknt]->req[rknt]->indic_knt = temp_req->qual[d.seq]->indic_knt
        stat = alterlist(tprint_req->job[jknt]->req[rknt]->indic,tprint_req->job[jknt]->
            req[rknt]->indic_knt)
        for (z = 1 to tprint_req->job[jknt]->req[rknt]->indic_knt)
            tprint_req->job[jknt]->req[rknt]->indic[z]->disp = temp_req->qual[d.seq]->
                indic[z]->disp
        endfor
 
        tprint_req->job[jknt]->req[rknt]->comment_knt = temp_req->qual[d.seq]->comment_knt
        stat = alterlist(tprint_req->job[jknt]->req[rknt]->comment,tprint_req->job[jknt]->
            req[rknt]->comment_knt)
        for (z = 1 to tprint_req->job[jknt]->req[rknt]->comment_knt)
            tprint_req->job[jknt]->req[rknt]->comment[z]->disp = temp_req->qual[d.seq]->
                comment[z]->disp
        endfor
 
        ;034 begin
        call echo("3400")
        tprint_req->job[jknt]->req[rknt]->clin_disp_cnt = temp_req->qual[d.seq]->clin_disp_cnt
        stat = alterlist(tprint_req->job[jknt]->req[rknt]->clin_disp,tprint_req->job[jknt]->
            req[rknt]->clin_disp_cnt)
        for (z = 1 to tprint_req->job[jknt]->req[rknt]->clin_disp_cnt)
            tprint_req->job[jknt]->req[rknt]->clin_disp[z]->disp = temp_req->qual[d.seq]->
                clin_disp[z]->disp
        endfor
 
 
        tprint_req->job[jknt]->req[rknt].oef_field_knt = size(temp_req->qual[d.seq].oe_format_fields, 5)
        stat = alterlist(tprint_req->job[jknt].req[rknt].oef_fields, tprint_req->job[jknt]->req[rknt].oef_field_knt)
        for (z = 1 to tprint_req->job[jknt]->req[rknt].oef_field_knt)
                tprint_req->job[jknt].req[rknt].oef_fields[z].line_knt = temp_req->qual[d.seq].oe_format_fields[z].line_knt
                stat = alterlist(tprint_req->job[jknt].req[rknt].oef_fields[z].lines,
                                 tprint_req->job[jknt].req[rknt].oef_fields[z].line_knt)
                for (y = 1 to tprint_req->job[jknt].req[rknt].oef_fields[z].line_knt)
                        tprint_req->job[jknt].req[rknt].oef_fields[z].lines[y].disp =
                                temp_req->qual[d.seq].oe_format_fields[z].lines[y].disp
                endfor
        endfor
        ;034 end
    endif
 
foot report
    tprint_req->job_knt = jknt
    stat = alterlist(tprint_req->job,jknt)
 
    tprint_req->job[jknt]->req_knt = rknt
    stat = alterlist(tprint_req->job[jknt]->req,rknt)
with nocounter
 
set iErrCode = error(sErrMsg,1)
if (iErrCode > 0)
    set failed = SELECT_ERROR
    set table_name = "BUILD_TPRINT"
    go to EXIT_SCRIPT
endif
 
;035 Beg
;CMB select into "nl"
;CMB from
;CMB     (dummyt d with seq = value(tprint_req->job_knt))
;CMB     , prsnl_alias pa
;CMB
;CMB plan d
;CMB join pa where pa.person_id = tprint_req->job[d.seq]->phys_id
;CMB 	and pa.prsnl_alias_type_cd = phys_npi_cd
;CMB 	and pa.active_ind = 1  ;040
;CMB 	and pa.beg_effective_dt_tm < SYSDATE ;040
;CMB 	and pa.end_effective_dt_tm >= SYSDATE ;040
;CMB detail
;CMB
;CMB ;040	tprint_req->job[d.seq]->phys_npi = pa.prsnl_alias_id
;CMB 	tprint_req->job[d.seq]->phys_npi = pa.alias ;040
;CMB
;CMB with nocounter
 
select into "nl"
from
    (dummyt d with seq = value(tprint_req->job_knt))
    , order_detail od
    , (dummyt d1 with seq = 1)
    ,orders o
    , dcp_entity_reltn der
    , diagnosis dg
    , nomenclature n
plan d where maxrec(d1, size(tprint_req->job[d.seq]->req, 5))
join d1 where tprint_req->job[d.seq]->req[d1.seq]->order_id > 0
join o where o.order_id = tprint_req->job[d.seq]->req[d1.seq]->order_id
join od where od.order_id = outerjoin(o.order_id)
	and od.oe_field_id = outerjoin(634668)
join der where der.entity1_id = outerjoin(o.order_id)
   and der.active_ind = outerjoin(1)
   and der.entity_reltn_mean = outerjoin("ORDERS/DIAGN")
join dg where dg.diagnosis_id = outerjoin(der.entity2_id)
join n where n.nomenclature_id = outerjoin(dg.nomenclature_id)
 
;head report
 	;dknt = 0
 
detail
 
	tprint_req->job[d.seq]->req[d1.seq]->fax_dest = od.oe_field_display_value
 
    if (n.nomenclature_id > 0 or (dg.diag_ftdesc != NULL and dg.diag_ftdesc > " "))
      	;dknt = dknt + 1
      	;if (mod(dknt,10) = 1)
	 		;stat = alterlist(tprint_req->job[d.seq]->req[d1.seq]->diag, dknt + 9)
      	;endif
      	if (n.nomenclature_id > 0)
      		;tprint_req->job[d.seq]->req[d1.seq]->diag[dknt].seq_code =
      			;concat(trim(cnvtstring(der.rank_sequence)),
      				;char(176),
      				;" - ",
      				;trim(n.source_identifier))
      				;begin 28
            if(tprint_req->job[d.seq]->req[d1.seq]->diag_lne > "")
      		  tprint_req->job[d.seq]->req[d1.seq]->diag_lne =
      		  concat(tprint_req->job[d.seq]->req[d1.seq]->diag_lne,
;051      		  ", ", trim(n.source_string))
      		  ", ", concat(trim(n.source_identifier)," - ",trim(n.source_string)))  ;051
      		else
      		  tprint_req->job[d.seq]->req[d1.seq]->diag_lne =
;051      		  trim(n.source_string)
      		  concat(trim(n.source_identifier)," - ",trim(n.source_string));051
      		endif
      	else
      		;tprint_req->job[d.seq]->req[d1.seq]->diag[dknt].seq_code =
      			;concat(trim(cnvtstring(der.rank_sequence)),char(176)," - ")
      	    if(tprint_req->job[d.seq]->req[d1.seq]->diag_lne > "")
      		  tprint_req->job[d.seq]->req[d1.seq]->diag_lne =
      		  concat(tprint_req->job[d.seq]->req[d1.seq]->diag_lne,
      		  ", ",trim(dg.diag_ftdesc))
      		else
      		  tprint_req->job[d.seq]->req[d1.seq]->diag_lne =
      		  trim(n.source_string)
      		endif  ;end 28
 
      	endif
   	endif
 
;foot report
 
	;tprint_req->job[d.seq]->req[d1.seq]->diag_knt = dknt
    ;stat = alterlist(tprint_req->job[d.seq]->req[d1.seq]->diag, dknt)
 
with nocounter
;035 End
 
;28 begin
;*** parse diagnosis line
free record pt
record pt
(
  1 line_cnt = i2
  1 lns[*]
    2 line   = vc
)
 
for(x = 1 to tprint_req->job_knt)
if (tprint_req->job[x]->req[1]->diag_lne > " ")
 
    set pt->line_cnt = 0
    set max_length   = 75
    execute dcp_parse_text value(tprint_req->job[x]->req[1]->diag_lne), value(max_length)
    set tprint_req->job[x]->req[1]->diag_knt = pt->line_cnt
    set stat = alterlist(tprint_req->job[x]->req[1]->diag,pt->line_cnt)
 
    for (c = 1 to pt->line_cnt)
        set tprint_req->job[x]->req[1]->diag[c].disp = trim(pt->lns[c]->line)
    endfor
endif
endfor
;28 end
 
call echorecord(demo_info)
call echorecord(temp_req)
free record temp_req
call echorecord(tprint_req)
 
if (tprint_req->job_knt = 0)                        ;019
        call echo("No print job found!",1)        ;019
        go to EXIT_SCRIPT                       ;019
endif                                           ;019
 
call echo("****************************************************************************")
call echo (request->printer_name)
call echo("****************************************************************************")
 
 
;------------------------------------------------------------------------------
 
/****************************************************************************
*       Print Requisition                                                   *
*****************************************************************************/
if (request->printer_name > " ")                            ;*** MOD 015
   select into value(request->printer_name)                 ;*** MOD 015
   from
     (dummyt d with seq=value(tprint_req->job_knt))         ;*** MOD 015
   plan d where tprint_req->job[d.seq]->output_dest_cd < 1  ;*** MOD 015
   order d.seq                                              ;*** MOD 015
   head report
 
;%i cclsource:RXREQGEN_PRINT_MACROS.INC
 
;***
;***  Print Macros
;***
;***  Special Notes: Based off of original print macros include file
;***                 written by Steven Farmer
;***
;***  000   02/14/03 JF8275   Initial Release
;***  001   12/03/03 BP9613   Adding dispense_duration for EasyScript Supply
;***                                                        calculation.
;***  002   01/15/04 JF8275   Shortened line for DEA #
;***  003   07/09/04 IT010631 Refill and Mid-level Enhancement
;***  004   01/07/05 BP9613   Replacing job[i] with job[d.seq]
 
/****************************************************************************
*       print page frame                                                    *
*****************************************************************************/
macro (print_page_frame)
 
    ;*** print header
    ;035 req_title = tprint_req->job[d.seq]->phys_addr1
    req_title = tprint_req->job[d.seq]->phys_facility ;035
    req_site = tprint_req->job[d.seq]->phys_site ;049
 
    "{f/4}{lpi/12}"
    y_pos = header_top_pos
    x_pos = c_pos
;049    call print(calcpos(x_pos,y_pos)) "{cpi/8}{b}",req_title,"{endb}{cpi/12}"
    call print(calcpos(x_pos,y_pos)) "{cpi/8}{b}",req_site,"{endb}{cpi/12}"  ;049
    row + 1
 
    y_pos = y_pos + 2_line  ;049
    x_pos = c_pos     ;049
    call print(calcpos(x_pos,y_pos)) "{cpi/8}{b}",req_title,"{endb}{cpi/12}" ;049
    row + 1  ;049
    if (tprint_req->job[d.seq]->phys_addr1 > " ") ;035 Beg
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->phys_addr1
        row + 1
    endif ;035 End
 
    if (tprint_req->job[d.seq]->phys_addr2 > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->phys_addr2
        row + 1
    endif
 
    if (tprint_req->job[d.seq]->phys_addr3 > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->phys_addr3
        row + 1
    endif
 
    if (tprint_req->job[d.seq]->phys_city > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->phys_city
        row + 1
    endif
 
    if (tprint_req->job[d.seq]->phys_addr4 > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->phys_addr4
        row + 1
    endif
 
 	;035 Beg Need to Add Physician Phone
 	if (tprint_req->job[d.seq]->phys_phone > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->phys_phone
        row + 1
    endif ;035 End
 
    ;*** patient information
    ;035 y_pos = patient_top_pos
    y_pos = patient_top_pos + 20 ;035
    x_pos = b_pos
 
    call print(calcpos(x_pos,y_pos))
    "{b}{lpi/10}{color/31}{box/82/1}{endb}" ;003
    row + 1
 
    call print(calcpos(x_pos,y_pos))
    "{b}{lpi/10}{color/31}{box/82/1}{endb}"
    row + 1
 
    y_pos = y_pos + 10
    x_pos = c_pos
    call print(calcpos(x_pos,y_pos)) "{cpi/10}{b}Patient Name:  ",demo_info->pat_name,"{endb}{cpi/12}"
    row + 1
 
    y_pos = y_pos + 4
    x_pos = b_pos
    call print(calcpos(x_pos,y_pos))
    "{b}{color/31}{cpi/12}{lpi/12}{box/82/1}{endb}"
    row + 1
 
    call print(calcpos(x_pos,y_pos))
    "{b}{color/31}{cpi/12}{lpi/12}{box/82/10}{endb}"
    row + 1
 
    "{cpi/12}{lpi/12}"
    y_pos = y_pos + 10
    x_pos = c_pos
    call print(calcpos(x_pos,y_pos)) "Birthdate:  ",demo_info->pat_bday
    row + 1
 
    x_pos = g_pos
    call print(calcpos(x_pos,y_pos)) "Age:  ", demo_info->pat_age
    row + 1
 
 	if(print_ind = 1) ;035 Beg
 		x_pos = h1_pos
    else
    x_pos = h_pos
    endif ;035 End
    ;035 x_pos = h_pos
    call print(calcpos(x_pos,y_pos)) "Sex:  ", demo_info->pat_sex
    row + 1
 
    if(print_ind = 1) ;035 beg
    	x_pos = h2_pos
    	call print(calcpos(x_pos,y_pos)) "Weight:  ", demo_info->pat_weight
    	row + 1
 	endif ;035 end
 
    x_pos = i_pos
    call print(calcpos(x_pos,y_pos)) "MRN:  ", tprint_req->job[d.seq]->mrn
    row + 1
 
    y_pos = y_pos + 2_line
    x_pos = c_pos
    call print(calcpos(x_pos,y_pos)) "Allergies:"
    row + 1
 
    if (demo_info->allergy_knt > 0)
        for (x = 1 to demo_info->allergy_knt)
            if (x < 4)  ;*** Max of 3 lines printed
                x_pos = c_pos + 45
                call print(calcpos(x_pos,y_pos)) "{b}",demo_info->allergy[x]->disp,"{endb}"
                y_pos = y_pos + 2_line
                row + 1
            endif
        endfor
    endif
 
    ;035 y_pos = pat_addr_top_pos - 18
    y_pos = pat_addr_top_pos ;035
    x_pos = f_pos + 30
    call print(calcpos(x_pos,y_pos)) "{cpi/12}Pharmacist please note--Allergy list may be incomplete.{cpi/12}"
    row + 1
 
    ;*** address
    y_pos = pat_addr_top_pos + 13 ;035
    x_pos = c_pos
    call print(calcpos(x_pos,y_pos)) "Patient Address:"
    row + 1
    x_pos = f_pos
    call print(calcpos(x_pos,y_pos)) demo_info->pat_addr
    row + 1
 
    x_pos = j_pos
    call print(calcpos(x_pos,y_pos)) "Home Phone:"
    row + 1
    x_pos = n_pos
    call print(calcpos(x_pos,y_pos)) demo_info->pat_hphone
    row + 1
 
    y_pos = y_pos + 2_line
    x_pos = f_pos
    call print(calcpos(x_pos,y_pos)) demo_info->pat_city
    row + 1
 
    x_pos = j_pos
    call print(calcpos(x_pos,y_pos)) "Work Phone:"
    row + 1
    x_pos = n_pos
    call print(calcpos(x_pos,y_pos)) demo_info->pat_wphone
    row + 1
 
; 003 Requirements state that health plan information no longer needed
/*
    if (tprint_req->job[d.seq]->hp_found = TRUE)
        y_pos = y_pos + 2_line
        x_pos = c_pos
        call print(calcpos(x_pos,y_pos)) "Primary Health Plan:"
        row + 1
        x_pos = f_pos
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->hp_pri_name
        row + 1
 
        x_pos = j_pos
        call print(calcpos(x_pos,y_pos)) "Policy/Group #:"
        row + 1
        x_pos = n_pos
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->hp_pri_polgrp
        row + 1
 
        y_pos = y_pos + 2_line
        x_pos = c_pos
        call print(calcpos(x_pos,y_pos)) "Secondary Health Plan:"
        row + 1
        x_pos = f_pos
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->hp_sec_name
        row + 1
 
        x_pos = j_pos
        call print(calcpos(x_pos,y_pos)) "Policy/Group #:"
        row + 1
        x_pos = n_pos
        call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->hp_sec_polgrp
        row + 1
    endif
*/
    ;*** body
    y_pos = body_top_pos + hp_offset
    x_pos = b_pos
    call print(calcpos(x_pos,y_pos))
    "{color/31}{lpi/10}{cpi/12}{box/82/1}" ;003
    row + 1
 
    call print(calcpos(x_pos,y_pos))
    "{b}{color/31}{lpi/10}{cpi/12}{box/82/1}{endb}"
    row + 1
 
    y_pos = y_pos + 10
    x_pos = c_pos
    "{cpi/10}{lpi/12}"
    if (tprint_req->job[d.seq].refill_ind = TRUE)
        call print(calcpos(x_pos,y_pos)) "{b}",refill_rx_text,"{endb}"
    else
        call print(calcpos(x_pos,y_pos)) "{b}",new_rx_text,"{endb}"
    endif
 
    ;MOD 003 Start
 
    x_pos = k_pos - 20
    call print(calcpos(x_pos,y_pos)) "{cpi/10}{lpi/12}{b}Date Issued: ", tprint_req->job[d.seq]->phys_ord_dt ,"{endb}"
 
    ;MOD 003 End
 
    row + 1
 
    ; set starting position for large box for prescription details
    y_pos = y_pos + 4
    x_pos = b_pos
    call print(calcpos(x_pos,y_pos))
    if (hp_offset > 0)
        "{color/31}{cpi/12}{lpi/12}{b}{box/82/75}"
    else
        "{color/31}{cpi/12}{lpi/12}{b}{box/82/80}"
    endif
    row + 1
 
    y_pos = rx_top_pos + hp_offset
    clean_frame = TRUE
    current_row_knt = 0
    first_req = FALSE
 
    if (is_last_page = FALSE)
        stamp_dea = FALSE
        stamp_att = TRUE
    endif
 
endmacro ;*** print_page_frame
 
/****************************************************************************
*       does_req_fit                                                        *
*****************************************************************************/
macro (does_req_fit)
 
    req_fit = TRUE
    temp_row_knt = current_row_knt
    temp_row_knt = temp_row_knt +
                   (tprint_req->job[d.seq]->req[j]->med_knt +
                    tprint_req->job[d.seq]->req[j]->sig_knt +
                    tprint_req->job[d.seq]->req[j]->dispense_knt +
                    tprint_req->job[d.seq]->req[j]->dispense_duration_knt + ;*** MOD 001
                    tprint_req->job[d.seq]->req[j]->refill_knt +
                    tprint_req->job[d.seq]->req[j]->special_knt +
                    tprint_req->job[d.seq]->req[j]->prn_knt +
                    tprint_req->job[d.seq]->req[j]->indic_knt +
                    tprint_req->job[d.seq]->req[j]->comment_knt +
                    tprint_req->job[d.seq]->req[j]->clin_disp_cnt + 1)
 
    if (temp_row_knt > max_row_knt)
        req_fit = FALSE
    endif
 
endmacro ;*** does_req_fit
 
/****************************************************************************
*       print_rx                                                            *
*****************************************************************************/
macro (print_rx)
 
    "{f/4}{cpi/12}{lpi/12}"
    row + 1
 
    if (tprint_req->job[d.seq]->req[j]->med_knt > 0)
 
        if (is_last_page = FALSE)
            if (tprint_req->job[d.seq]->req[j].csa_sched != "0")
                stamp_att = FALSE
            endif
            if (tprint_req->job[d.seq]->req[j].print_dea = 1)
                stamp_dea = TRUE
            endif
        endif
 
        clean_frame = FALSE
 
        ;*** Do Rx
        if (req_fit = FALSE and break_field = "MED")
            x_pos = c_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb} page",
                " prescription ---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        for (x = 1 to tprint_req->job[d.seq]->req[j]->med_knt)
 
            if (x = 1)
                x_pos = c_pos
                call print(calcpos(x_pos,y_pos)) "{cpi/10}{b}Rx:{endb}{cpi/12}"
                row + 1
 
                x_pos = c_pos + 25
                call print(calcpos(x_pos,y_pos)) "{cpi/10}{b}",tprint_req->job[d.seq]->req[j]->med[x]->disp,"{endb}{cpi/12}"
                row + 1
 
                x_pos = k_pos
                ;call print(calcpos(x_pos,y_pos)) "Start Date:  {b}",tprint_req->job[d.seq]->req[j]->start_dt,"{endb}"
                row + 1
            else
                x_pos = c_pos + 25
                call print(calcpos(x_pos,y_pos)) "{cpi/10}{b}", tprint_req->job[d.seq]->req[j]->med[x]->disp,"{endb}{cpi/12}"
                row + 1
            endif
 
            y_pos = y_pos + 2_line
            current_row_knt = current_row_knt + 1
        endfor
 
/*
sline = fillstring(25," ")
for (z = 2 to 32)
    sline = build("Line Number :",z)
    x_pos = rx_detail_pos
    call print(calcpos(x_pos,y_pos)) "{b}{cpi/10}",sline,"{endb}"
    y_pos = y_pos + 2_line
    row+1
endfor
x_pos = b_pos + 5
call print(calcpos(x_pos,y_pos)) sep_line, "{cpi/12}"
row + 1
y_pos = y_pos + 2_line
;print_footer
;*/
 
/*;034 Begin
    if (tprint_req->job[d.seq].req[j].oef_field_knt > 0)
      for (x = 1 to tprint_req->job[d.seq].req[j].oef_field_knt)
        if (tprint_req->job[d.seq].req[j].oef_fields[x].line_knt > 0)
          for (y = 1 to tprint_req->job[d.seq].req[j].oef_fields[x].line_knt)
            x_pos = d_pos
            call print(calcpos(x_pos, y_pos)) tprint_req->job[d.seq].req[j].oef_fields[x].lines[y].disp
            row + 1
            y_pos = y_pos + 2_line
            current_row_knt = current_row_knt + 1
          endfor
        endif
      endfor
    endif
*/
 
    ; call echo("3800")
    if (tprint_req->job[d.seq].req[j].clin_disp_cnt > 0)
      for (x = 1 to tprint_req->job[d.seq].req[j].clin_disp_cnt)
        x_pos = d_pos
        call print(calcpos(x_pos, y_pos)) "{cpi/10}", tprint_req->job[d.seq].req[j].clin_disp[x].disp, "{cpi/12}"
        row + 1
        y_pos = y_pos + 2_5_line
        current_row_knt = current_row_knt + 1
      endfor
    endif
;034 End
 
 
        ;*** do sig
        if (req_fit = FALSE and break_field = "SIG")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb} page ",
                "prescription ---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[d.seq]->req[j]->sig_knt > 0)
 
            for (x = 1 to tprint_req->job[d.seq]->req[j]->sig_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "SIG:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->sig[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->sig[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do dispense
        if (req_fit = FALSE and break_field = "DISPENSE")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                          " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[d.seq]->req[j]->dispense_knt > 0)
 
            for (x = 1 to tprint_req->job[d.seq]->req[j]->dispense_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Dispense/Supply:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->dispense[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->dispense[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do dispense duration
        ;BEGIN MOD 001
        if (req_fit = FALSE and break_field = "DISPENSE_DURATION")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                          " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[d.seq]->req[j]->dispense_duration_knt > 0)
 
            for (x = 1 to tprint_req->job[d.seq]->req[j]->dispense_duration_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Dispense/Supply:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->dispense_duration[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->dispense_duration[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
        ;END MOD 001
 
        ;*** do refill
        if (req_fit = FALSE and break_field = "REFILL")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                          " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[d.seq]->req[j]->refill_knt > 0)
 
            for (x = 1 to tprint_req->job[d.seq]->req[j]->refill_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Refill:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->refill[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->refill[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do special
        if (req_fit = FALSE and break_field = "SPECIAL")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                          " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[d.seq]->req[j]->special_knt > 0)
 
            for (x = 1 to tprint_req->job[d.seq]->req[j]->special_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Instructions:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->special[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->special[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do prn
        if (req_fit = FALSE and break_field = "PRN")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                          " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[d.seq]->req[j]->prn_knt > 0)
 
            for (x = 1 to tprint_req->job[d.seq]->req[j]->prn_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "PRN Instructions:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->prn[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->prn[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do indic
        if (req_fit = FALSE and break_field = "INDIC")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                          " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[d.seq]->req[j]->indic_knt > 0)
 
            for (x = 1 to tprint_req->job[d.seq]->req[j]->indic_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Indications:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->indic[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->indic[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do comment
        if (req_fit = FALSE and break_field = "COMMENT")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                          " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[d.seq]->req[j]->comment_knt > 0)
 
            for (x = 1 to tprint_req->job[d.seq]->req[j]->comment_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Comments:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->comment[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->comment[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
 
 		;035 Beg **** do Diagnosis
 		if (req_fit = FALSE and break_field = "DIAGNOSIS")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                          " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[d.seq]->req[j]->diag_knt > 0)
 
            for (x = 1 to tprint_req->job[d.seq]->req[j]->diag_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Diagnosis:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->diag[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->req[j]->diag[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 		;035 End
 
        x_pos = b_pos + 5
        call print(calcpos(x_pos,y_pos)) sep_line
        row + 1
        y_pos = y_pos + 2_line
        current_row_knt = current_row_knt + 1
 
        if (is_last_page = TRUE)
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}LAST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            is_last_page = FALSE
        endif
    endif
 
endmacro ;*** print_rx
 
/****************************************************************************
*       find_break_field                                                    *
*****************************************************************************/
macro (find_break_field)
 
    found_it = FALSE
    temp_row_knt = 0
 
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->med_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "MED"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->sig_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "SIG"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->dispense_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "DISPENSE"
    endif
 
    ;BEGIN MOD 001
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->dispense_duration_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "DISPENSE_DURATION"
    endif
    ;END MOD 001
 
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->refill_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "REFILL"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->special_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "SPECIAL"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->prn_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "PRN"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->indic_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "INDIC"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->comment_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "COMMENT"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[d.seq]->req[j]->diag_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "DIAGNOSIS"
    endif
 
endmacro ;*** find_break_field
 
/****************************************************************************
*       print_footer                                                        *
*****************************************************************************/
macro (print_footer)
 
    y_pos = y_pos + 2_5_line
    temp_y_pos = y_pos
    ;048  x_pos = c_pos
    ;048  call print(calcpos(x_pos,y_pos)) "{b}",signature_line,"{endb}"
    ;048  row + 1
    x_pos = j_pos
    y_pos = temp_y_pos - 3							;048
 	call print(calcpos(x_pos,y_pos)) "{b}X{endb}"	;048
    row + 1											;048
 
    call print(calcpos(x_pos,y_pos)) "{b}",signature_line,"{endb}"
    row + 1
 
    ;048  y_pos = y_pos + 2_line
    y_pos = y_pos + 2_5_line  ;048
    ;048  x_pos = c_pos + 38
    ;048  call print(calcpos(x_pos,y_pos)) "{b}DISPENSE AS WRITTEN{endb}"
    ;048  row + 1
    x_pos = j_pos + 30
    call print(calcpos(x_pos,y_pos)) "{b}PROVIDER SIGNATURE{endb}"		;048
    ;048 call print(calcpos(x_pos,y_pos)) "{b}SUBSTITUTION PERMITTED{endb}"
    row + 1
 
 
    y_pos = y_pos + 3_line
    x_pos = c_pos
    ;035 Beg call print(calcpos(x_pos,y_pos)) "Prescribed by: {b}",tprint_req->job[d.seq]->phys_bname,"{endb}"
    call print(calcpos(x_pos,y_pos)) "Prescribed by: {b}",tprint_req->job[d.seq]->phys_bname,"{endb}",
    	"   ", "NPI#: " tprint_req->job[d.seq]->phys_npi ;035 End
    row+1
 
/*
    x_pos = g_pos + 30
    call print(calcpos(x_pos,y_pos)) "Date:"
    row + 1
    x_pos = x_pos + 26
    call print(calcpos(x_pos,y_pos)) tprint_req->job[d.seq]->phys_ord_dt
    row + 1
*/
 
    if (stamp_dea = TRUE)
;041         x_pos = j_pos + 8
        x_pos = k_pos  /*041*/
 
        if (tprint_req->job[d.seq]->phys_dea > " ")
            call print(calcpos(x_pos,y_pos))"DEA #:  ",tprint_req->job[d.seq]->phys_dea ;003
        else
            call print(calcpos(x_pos,y_pos))"DEA #:  _______________" ;002 and 003
        endif
        row + 1
    endif
 
;CMB     /*** start 028 ***/
;CMB     if (tprint_req->job[d.seq]->phys_npi > " ")
;CMB                 y_pos = y_pos + 2_line
;CMB                 x_pos = j_pos + 8
;CMB                 call print(calcpos(x_pos,y_pos))"NPI #:  ",tprint_req->job[d.seq]->phys_npi
;CMB                 row + 1
;CMB     endif
;CMB     /*** end 028 ***/
 
    ;MOD 003 Start - Writes the Supervising Physician field if sup_phys_bname is populated
 
    if (tprint_req->job[d.seq]->sup_phys_bname > " ")
        x_pos = c_pos
        y_pos = y_pos + 3_line
        call print(calcpos(x_pos,y_pos)) "Supervising Physician: {b}",tprint_req->job[d.seq]->sup_phys_bname,"{endb}"
        row+1
        ;003 See if DEA box is checked and put DEA if TRUE
 
            if (stamp_dea = TRUE)
;041             x_pos = j_pos + 8
            x_pos = k_pos  /*041*/
                    if (tprint_req->job[d.seq]->sup_phys_dea > " ")
                            call print(calcpos(x_pos,y_pos))"DEA #:  ",tprint_req->job[d.seq]->sup_phys_dea
                    else
                            call print(calcpos(x_pos,y_pos))"DEA #:  _______________" ;002
                    endif
                           row + 1
                endif
 
            ;MOD 003 Stop
 
            /*** start 028 ***/
                   if (tprint_req->job[d.seq]->sup_phys_npi > " ")
                        y_pos = y_pos + 2_line
                        x_pos = j_pos + 8
                        call print(calcpos(x_pos,y_pos))"NPI #:  ",tprint_req->job[d.seq]->sup_phys_npi
                        row + 1
                endif
                /*** end 028 ***/
    endif
 
    if (tprint_req->job[d.seq]->eprsnl_ind = TRUE)
        y_pos = y_pos + 2_line
        x_pos = c_pos
        call print(calcpos(x_pos,y_pos)) "Entered by: {b}",tprint_req->job[d.seq]->eprsnl_bname,"{endb}"
        row+1
    endif
 
 
    y_pos = y_pos + 1_5_line						;048
    temp_y_pos = y_pos								;048
    x_pos = j_pos									;048
    call print(calcpos(x_pos,y_pos-3)) "{b}",tprint_req->job[d.seq]->phys_bname," {endb} (E-Sig.)"
    row + 1
    call print(calcpos(x_pos,y_pos)) "{b}",signature_line,"{endb}"   ;048
    row + 1											;048
	    y_pos = y_pos + 2_line  ;052
	    x_pos = j_pos    ;052
	    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->phys_sign_dt_tm,"{endb}";052
    	row + 1	;052
 
    y_pos = y_pos + 2_line
    x_pos = j_pos + 30
    if (tprint_req->job[d.seq]->daw > 0)
      call print(calcpos(x_pos,y_pos)) "{b}DISPENSE AS WRITTEN{endb}"
    else
      call print(calcpos(x_pos,y_pos)) "{b}SUBSTITUTION PERMITTED{endb}"
    endif
    row + 1
 
 
    if (stamp_att = TRUE)
        y_pos = y_pos + 2_line
        x_pos = f_pos + 20
        call print(calcpos(x_pos,y_pos)) "{cpi/16}{b}ATTENTION: THIS RX NOT VALID FOR CONTROLLED SUBSTANCES{endb}{cpi/12}"
        row + 1
    endif
    ;048  if (tprint_req->job[d.seq].csa_group != "A")
     ;048     y_pos = temp_y_pos - 3
 
       ;048  if (tprint_req->job[d.seq]->daw > 0)
       ;048      x_pos = c_pos     ;*** Dispense As Written
       ;048  else
       ;048      x_pos = j_pos     ;*** Substitution Permitted
       ;048  endif
 
    ;048      call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->phys_bname," {endb} (E-Sig.)"
    ;048      row + 1
    ;048  else
    ;048      y_pos = temp_y_pos - 3
 
    ;048      if (tprint_req->job[d.seq]->daw > 0)
    ;048          x_pos = c_pos     ;*** Dispense As Written
     ;048     else
     ;048         x_pos = j_pos     ;*** Substitution Permitted
     ;048     endif
 
     ;048     call print(calcpos(x_pos,y_pos)) "{b}X{endb}"
     ;048     row + 1
    ;048  endif
endmacro ;*** print_footer
 
 
       y_pos = 0
       x_pos = 0
 
       ; The following are used to position data in the proper x position, to allow
       ; for easy x_pos modification for similarly positioned data
 
       a_pos =  72      ; header
       b_pos =  57      ; left side of boxes
       c_pos =  65      ; patient name label, signature lines
       d_pos =  79      ; SIG label,other RX labels on left
       e_pos = 194      ; pharmacist note
       f_pos = 165      ; patient address data
       g_pos = 234      ; Age label
       h_pos = 347      ; Sex label
       h1_pos = 320     ;035 Sex label 2
       h2_pos = 380     ;035 Weight label
       i_pos = 459      ; MRN label
       j_pos = 350      ; Home Phone, other similar labels
       k_pos = 450      ; Start Date label
       l_pos = 392      ; DAW label
       m_pos = 320      ; Provider signature line
       n_pos = 423      ; phone and policy data
 
       ; The following are used to position data in the proper y position, to allow
       ; for easy y_pos modification for similarly positioned data
 
       header_top_pos   = 36       ; starting y_pos for header info
       patient_top_pos  = 96
       body_top_pos     = 220
       rx_top_pos       = 250
       pat_addr_top_pos = 192
       body_bottom_pos  = 705
       rx_detail_pos    = 155
 
       call echo("***")
       call echo(build("***   hp_found :",tprint_req->job[d.seq]->hp_found))
       call echo("***")
       if (tprint_req->job[d.seq]->hp_found = TRUE)
          hp_offset        = 20
       else
          hp_offset        = 0
       endif
 
       ; The following are used to determine the amount of vertical line space
       half_line = 3
       1_line    = 6
       1_5_line  = 9
       2_line    = 12
       2_5_line  = 15
       3_line    = 18
       3_5_line  = 21
       4_line    = 24
       req_fit         = FALSE
       clean_frame     = FALSE
       break_field     = fillstring(12," ")
       signature_line  = fillstring(40,"_")
       sep_line        = fillstring(87,"-")
       name_line       = fillstring(50," ")
       if (tprint_req->job[d.seq]->hp_found = TRUE)
;049          max_row_knt     = 29
;049          current_row_knt = 29
          max_row_knt     = 28
          current_row_knt = 28
       else
;049          max_row_knt     = 32
;049          current_row_knt = 32
          max_row_knt     = 31   ;049
          current_row_knt = 31   ;049
 
       endif
       first_req       = TRUE
       is_last_page    = FALSE
       stamp_dea       = FALSE
       stamp_att       = TRUE
 
   head d.seq           ;*** MOD 015
       place_holder = 0 ;*** MOD 015
 
/*046 BEGIN*/
       if (d.seq > 1)
          break
          print_page_frame
       endif
/*046 END*/
 
   detail
       for (j = 1 to tprint_req->job[d.seq]->req_knt)
           does_req_fit
           if (req_fit = TRUE)
              print_rx
              if (j = tprint_req->job[d.seq]->req_knt)
                 print_footer
              endif
           else
              if (clean_frame = FALSE)
                 if (j != 1)
                    print_footer
                    break
                 endif
                 print_page_frame
                 does_req_fit
                 if (req_fit = TRUE)
                    print_rx
                    if (j = tprint_req->job[d.seq]->req_knt)
                       print_footer
                    endif
                 else
                    find_break_field
                    print_rx
                    print_footer
                    if (j != tprint_req->job[d.seq]->req_knt)
                       break
                       print_page_frame
                    endif
                 endif
              else
                 find_break_field
                 print_rx
                 print_footer
                 if (j != tprint_req->job[d.seq]->req_knt)
                    break
                    print_page_frame
                 endif
              endif
           endif
       endfor
 
;046    foot d.seq                            ;*** MOD 015
;046        if (d.seq < tprint_req->job_knt)  ;*** MOD 015
;046           break                          ;*** MOD 015
;046           print_page_frame               ;*** MOD 015
;046        endif                             ;*** MOD 015
 
   with
       nocounter,
       maxrow = 120,
       maxcol = 256,
       dio = 8
endif
 
 
/****************************************************************************
*       Fax Requisition                                                     *
*****************************************************************************/
;*** MOD 015 Keeping the the same grouping for fax jobs
for (i = 1 to tprint_req->job_knt)
   if (tprint_req->job[i]->output_dest_cd > 0)
 
   set toad = 1
   set file_name = concat("cer_print:",trim(cnvtlower(username)),"_",                ;023
       trim(cnvtstring(curtime3,7,0,r)),"_",trim(cnvtstring(i)),".dat")
 
   call echo ("***")
   call echo (build("***   file_name :",file_name))
   call echo ("***")
 
   set tprint_req->job[i]->print_loc = trim(file_name)
 
   ;036 put file name in case of fax value("cer_print:fe.rtf")
   select into value(tprint_req->job[i]->print_loc)
   from
      (dummyt d with seq = 1)
 
   head report
 
;%i cclsource:RXREQGEN_RXFAX_MACROS.INC
 
;***
;***  RxFax Macros
;***
;***  Special Notes: Based off of original print macros include file
;***                 written by Steven Farmer
;***
;***  000   02/14/03 JF8275   Initial Release
;***  001   12/03/03 BP9613   Adding dispense_duration for EasyScript Supply
;***                                                        calculation.
;***  002   01/15/04 JF8275   Shortened line for DEA #
;***  003   07/09/04 IT010631 Refill and Mid-level Enhancement
;***  004   02/22/07 AC013605 Added a meaningful report title
 
/****************************************************************************
*       print page frame                                                    *
*****************************************************************************/
macro (print_page_frame)
 	;035 Beg ADD FAX OUTPUT DEST HERE
 	;036 for (x = 1 to tprint_req->job[i]->req_knt)
 		"{f/4}{lpi/12}"
    	y_pos = header_top_pos
    	x_pos = c_pos
    	;036 call print(calcpos(x_pos,y_pos)) "{cpi/12}", tprint_req->job[i]->req[x]->fax_dest
    	call print(calcpos(x_pos,y_pos)) "{cpi/12}", tprint_req->job[i]->req[1]->fax_dest
    	row + 2
    ;036 endfor ;035 End
 
    ;*** print header
    ;035 req_title = tprint_req->job[i]->phys_addr1
    req_title = tprint_req->job[d.seq]->phys_facility ;035
    req_site = tprint_req->job[d.seq]->phys_site ;049
 
    "{f/4}{lpi/12}"
    ;036 y_pos = header_top_pos
    y_pos = header_top_pos + 2_line ;036
    x_pos = c_pos
;049    call print(calcpos(x_pos,y_pos)) "{cpi/8}{b}",req_title,"{endb}{cpi/12}"
    call print(calcpos(x_pos,y_pos)) "{cpi/8}{b}",req_site,"{endb}{cpi/12}"  ;049
    row + 1
 
    y_pos = y_pos + 2_line ;049
    x_pos = c_pos   ;049
    call print(calcpos(x_pos,y_pos)) "{cpi/8}{b}",req_title,"{endb}{cpi/12}" ;049
    row + 1  ;049
 
    y_pos = y_pos + half_line
 
    if (tprint_req->job[i]->phys_addr1 > " ") ;035 Beg
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->phys_addr1
        row + 1
    endif ;035 End
 
    if (tprint_req->job[i]->phys_addr2 > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->phys_addr2
        row + 1
    endif
 
    if (tprint_req->job[i]->phys_addr3 > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->phys_addr3
        row + 1
    endif
 
    if (tprint_req->job[i]->phys_city > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->phys_city
        row + 1
    endif
 
    if (tprint_req->job[i]->phys_addr4 > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->phys_addr4
        row + 1
    endif
 
    ;035 Beg
    if (tprint_req->job[i]->phys_phone > " ")
        y_pos = y_pos + 2_line
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->phys_phone
        row + 1
    endif ;035 End
 
    ;*** patient information
    y_pos = patient_top_pos + 10
    x_pos = c_pos
    call print(calcpos(x_pos,y_pos)) "{cpi/10}{b}Patient Name:  ",demo_info->pat_name,"{endb}{cpi/12}"
    row + 1
 
    y_pos = y_pos + 14
    x_pos = c_pos
    call print(calcpos(x_pos,y_pos)) "Birthdate:  ",demo_info->pat_bday
    row + 1
 
    x_pos = g_pos
    call print(calcpos(x_pos,y_pos)) "Age:  ", demo_info->pat_age
    row + 1
 
 
    if(print_ind = 1) ;037 begin
 		x_pos = h1_pos
    else
    x_pos = h_pos
    endif
    call print(calcpos(x_pos,y_pos)) "Sex:  ", demo_info->pat_sex
    row + 1
 
    if(print_ind = 1)
    	x_pos = h2_pos
    	call print(calcpos(x_pos,y_pos)) "Weight:  ", demo_info->pat_weight
    	row + 1
 	endif ;037 end
 
 
    x_pos = i_pos
    call print(calcpos(x_pos,y_pos)) "MRN:  ", tprint_req->job[i]->mrn
    row + 1
 
    y_pos = y_pos + 2_line
    x_pos = c_pos
    call print(calcpos(x_pos,y_pos)) "Allergies:"
    row + 1
 
    if (demo_info->allergy_knt > 0)
        for (x = 1 to demo_info->allergy_knt)
            if (x < 4)  ;*** Max of 3 lines printed
                x_pos = c_pos + 45
                call print(calcpos(x_pos,y_pos)) "{b}",demo_info->allergy[x]->disp,"{endb}"
                y_pos = y_pos + 2_line
                row + 1
            endif
        endfor
    endif
 
    y_pos = pat_addr_top_pos - 18
    x_pos = f_pos + 30
    call print(calcpos(x_pos,y_pos)) "{cpi/12}Pharmacist please note--Allergy list may be incomplete.{cpi/12}"
    row + 1
 
    ;*** address
    y_pos = pat_addr_top_pos
    x_pos = c_pos
    call print(calcpos(x_pos,y_pos)) "Patient Address:"
    row + 1
    x_pos = f_pos
    call print(calcpos(x_pos,y_pos)) demo_info->pat_addr
    row + 1
 
    x_pos = j_pos
    call print(calcpos(x_pos,y_pos)) "Home Phone:"
    row + 1
    x_pos = n_pos
    call print(calcpos(x_pos,y_pos)) demo_info->pat_hphone
    row + 1
 
    y_pos = y_pos + 2_line
    x_pos = f_pos
    call print(calcpos(x_pos,y_pos)) demo_info->pat_city
    row + 1
 
    x_pos = j_pos
    call print(calcpos(x_pos,y_pos)) "Work Phone:"
    row + 1
    x_pos = n_pos
    call print(calcpos(x_pos,y_pos)) demo_info->pat_wphone
    row + 1
 
; 003 Requirements state that health plan information no longer needed
/*
    if (tprint_req->job[i]->hp_found = TRUE)
        y_pos = y_pos + 2_line
        x_pos = c_pos
        call print(calcpos(x_pos,y_pos)) "Primary Health Plan:"
        row + 1
        x_pos = f_pos
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->hp_pri_name
        row + 1
 
        x_pos = j_pos
        call print(calcpos(x_pos,y_pos)) "Policy/Group #:"
        row + 1
        x_pos = n_pos
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->hp_pri_polgrp
        row + 1
 
        y_pos = y_pos + 2_line
        x_pos = c_pos
        call print(calcpos(x_pos,y_pos)) "Secondary Health Plan:"
        row + 1
        x_pos = f_pos
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->hp_sec_name
        row + 1
 
        x_pos = j_pos
        call print(calcpos(x_pos,y_pos)) "Policy/Group #:"
        row + 1
        x_pos = n_pos
        call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->hp_sec_polgrp
        row + 1
    endif
*/
    "      "
    row + 1
 
    ;*** body
    y_pos = body_top_pos + hp_offset
    y_pos = y_pos + 10
    x_pos = c_pos
    if (tprint_req->job[i].refill_ind = TRUE)
        call print(calcpos(x_pos,y_pos)) "{b}",refill_rx_text,"{endb}"
    else
        call print(calcpos(x_pos,y_pos)) "{b}",new_rx_text,"{endb}"
    endif
 
    ;MOD 003 Start - Place Date on same line as rx_text
 
    x_pos = k_pos - 20
    call print(calcpos(x_pos,y_pos)) "{cpi/10}{lpi/12}{b}Date Issued: ", tprint_req->job[i]->phys_ord_dt ,"{endb}"
 
    ;MOD 003 Stop
 
    row + 1
 
    "        "
    row + 1
 
    y_pos = rx_top_pos + hp_offset
    clean_frame = TRUE
    current_row_knt = 0
    first_req = FALSE
 
    if (is_last_page = FALSE)
        stamp_dea = FALSE
        stamp_att = TRUE
    endif
 
endmacro ;*** print_page_frame
 
/****************************************************************************
*       does_req_fit                                                        *
*****************************************************************************/
macro (does_req_fit)
 
    req_fit = TRUE
    temp_row_knt= current_row_knt
    temp_row_knt = temp_row_knt +
                   (tprint_req->job[i]->req[j]->med_knt +
                    tprint_req->job[i]->req[j]->sig_knt +
                    tprint_req->job[i]->req[j]->dispense_knt +
                    tprint_req->job[i]->req[j]->dispense_duration_knt + ;*** MOD 001
                    tprint_req->job[i]->req[j]->refill_knt +
                    tprint_req->job[i]->req[j]->special_knt +
                    tprint_req->job[i]->req[j]->prn_knt +
                    tprint_req->job[i]->req[j]->indic_knt +
                    ;036 Beg tprint_req->job[i]->req[j]->comment_knt + 1)
                    tprint_req->job[i]->req[j]->comment_knt +
                    tprint_req->job[i]->req[j]->clin_disp_cnt +
                    tprint_req->job[i]->req[j]->diag_knt + 1) ;036 End
 
    if (temp_row_knt > max_row_knt)
        req_fit = FALSE
    endif
 
endmacro ;*** does_req_fit
 
/****************************************************************************
*       print_rx                                                            *
*****************************************************************************/
macro (print_rx)
 
    "{f/4}{cpi/12}{lpi/12}"
    row + 1
 
    if (tprint_req->job[i]->req[j]->med_knt > 0)
 
        if (is_last_page = FALSE)
            if (tprint_req->job[i]->req[j].csa_sched != "0")
                stamp_att = FALSE
            endif
            if (tprint_req->job[i]->req[j].print_dea = 1)
                stamp_dea = TRUE
            endif
        endif
 
        clean_frame = FALSE
 
        ;*** Do Rx
        if (req_fit = FALSE and break_field = "MED")
            x_pos = c_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb} page",
                                             " prescription ---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        for (x = 1 to tprint_req->job[i]->req[j]->med_knt)
 
            if (x = 1)
                x_pos = c_pos
                call print(calcpos(x_pos,y_pos)) "{cpi/10}{b}Rx:{endb}{cpi/12}"
                row + 1
 
                x_pos = c_pos + 25
                call print(calcpos(x_pos,y_pos)) "{cpi/10}{b}",tprint_req->job[i]->req[j]->med[x]->disp,"{endb}{cpi/12}"
                row + 1
 
                x_pos = k_pos
                ;034 call print(calcpos(x_pos,y_pos)) "Start Date:  {b}",tprint_req->job[i]->req[j]->start_dt,"{endb}"
                row + 1
            else
                x_pos = c_pos + 25
                call print(calcpos(x_pos,y_pos)) "{cpi/10}{b}", tprint_req->job[i]->req[j]->med[x]->disp,"{endb}{cpi/12}"
                row + 1
            endif
 
            y_pos = y_pos + 2_line
            current_row_knt = current_row_knt + 1
        endfor
 
/*
sline = fillstring(25," ")
for (z = 2 to 30)
    sline = build("Line Number :",z)
    x_pos = rx_detail_pos
    call print(calcpos(x_pos,y_pos)) "{b}",sline,"{endb}"
    y_pos = y_pos + 2_line
    row+1
endfor
x_pos = b_pos + 5
call print(calcpos(x_pos,y_pos)) sep_line
row + 1
y_pos = y_pos + 2_line
print_footer
*/
 
;034 Begin
        if (tprint_req->job[d.seq].req[j].clin_disp_cnt > 0)
          for (x = 1 to tprint_req->job[d.seq].req[j].clin_disp_cnt)
            x_pos = d_pos
            call print(calcpos(x_pos, y_pos)) "{cpi/10}", tprint_req->job[d.seq].req[j].clin_disp[x].disp, "{cpi/12}"
            row + 1
            y_pos = y_pos + 2_5_line
            current_row_knt = current_row_knt + 1
          endfor
        endif
;034 End
 
 
        ;*** do sig
        if (req_fit = FALSE and break_field = "SIG")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb} page ",
                                             "prescription ---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[i]->req[j]->sig_knt > 0)
 
            for (x = 1 to tprint_req->job[i]->req[j]->sig_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "SIG:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->sig[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->sig[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do dispense
        if (req_fit = FALSE and break_field = "DISPENSE")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[i]->req[j]->dispense_knt > 0)
 
            for (x = 1 to tprint_req->job[i]->req[j]->dispense_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Dispense/Supply:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->dispense[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->dispense[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do dispense duration
        ;BEGIN MOD 001
        if (req_fit = FALSE and break_field = "DISPENSE_DURATION")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[i]->req[j]->dispense_duration_knt > 0)
 
            for (x = 1 to tprint_req->job[i]->req[j]->dispense_duration_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Dispense/Supply:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->dispense_duration[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->dispense_duration[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
        ;END MOD 001
 
        ;*** do refill
        if (req_fit = FALSE and break_field = "REFILL")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[i]->req[j]->refill_knt > 0)
 
            for (x = 1 to tprint_req->job[i]->req[j]->refill_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Refill:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->refill[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->refill[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do special
        if (req_fit = FALSE and break_field = "SPECIAL")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[i]->req[j]->special_knt > 0)
 
            for (x = 1 to tprint_req->job[i]->req[j]->special_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Instructions:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->special[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->special[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do prn
        if (req_fit = FALSE and break_field = "PRN")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[i]->req[j]->prn_knt > 0)
 
            for (x = 1 to tprint_req->job[i]->req[j]->prn_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "PRN Instructions:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->prn[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->prn[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do indic
        if (req_fit = FALSE and break_field = "INDIC")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[i]->req[j]->indic_knt > 0)
 
            for (x = 1 to tprint_req->job[i]->req[j]->indic_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Indications:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->indic[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->indic[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
        ;*** do comment
        if (req_fit = FALSE and break_field = "COMMENT")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
        if (tprint_req->job[i]->req[j]->comment_knt > 0)
 
            for (x = 1 to tprint_req->job[i]->req[j]->comment_knt)
 
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Comments:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->comment[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->comment[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                current_row_knt = current_row_knt + 1
            endfor
        endif
 
 		;035 Beg do Diagnosis
 		if (req_fit = FALSE and break_field = "DIAGNOSIS")
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}FIRST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
            y_pos = y_pos + 2_line
            print_footer
            break
 
            is_last_page = TRUE
            print_page_frame
            clean_frame = FALSE
        endif
 
 		if (tprint_req->job[i]->req[j]->diag_knt > 0)
 
            for (x = 1 to tprint_req->job[i]->req[j]->diag_knt)
 				;call print("Diagnosis Exist");28
                if (x = 1)
                    x_pos = d_pos
                    call print(calcpos(x_pos,y_pos)) "Diagnosis:"
                    row + 1
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->diag[x]->disp,"{endb}"
                else
                    x_pos = rx_detail_pos
                    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[i]->req[j]->diag[x]->disp,"{endb}"
                endif
 
                row + 1
                y_pos = y_pos + 2_line
                row + 1
                current_row_knt = current_row_knt + 1
            endfor
        endif
		;035 End
        row + 1
        x_pos = b_pos + 5
        row + 1
        call print(calcpos(x_pos,y_pos)) sep_line
        row + 1
        y_pos = y_pos + 2_line
        current_row_knt = current_row_knt + 1
 
        "    "
        row + 1
 
        if (is_last_page = TRUE)
            x_pos = d_pos
            call print(calcpos(x_pos,y_pos)) "***--- Note: This is the {b}LAST{endb} page of a {b}2{endb}",
                                             " page prescription---***"
            row + 1
 
            "      "
            row + 1
 
            y_pos = y_pos + 2_line
            is_last_page = FALSE
        endif
    endif
 
endmacro ;*** print_rx
 
/****************************************************************************
*       find_break_field                                                    *
*****************************************************************************/
macro (find_break_field)
 
    found_it = FALSE
    temp_row_knt = 0
 
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->med_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "MED"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->sig_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "SIG"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->dispense_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "DISPENSE"
    endif
 
    ;BEGIN MOD 001
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->dispense_duration_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "DISPENSE_DURATION"
    endif
    ;END MOD 001
 
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->refill_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "REFILL"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->special_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "SPECIAL"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->prn_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "PRN"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->indic_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "INDIC"
    endif
 
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->comment_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "COMMENT"
    endif
 
    ;035 Beg
    temp_row_knt = temp_row_knt + tprint_req->job[i]->req[j]->diag_knt
    if ((found_it = FALSE) and (temp_row_knt + 1 > max_row_knt))
        found_it = TRUE
        break_field = "DIAGNOSIS"
    endif
    ;035 End
 
endmacro ;*** find_break_field
 
/****************************************************************************
*       print_footer                                                        *
*****************************************************************************/
macro (print_footer)
 
    "  "
    row + 1
 
    y_pos = y_pos + 2_5_line
    temp_y_pos = y_pos
    ;048  x_pos = c_pos
    ;048  call print(calcpos(x_pos,y_pos)) "{b}",signature_line,"{endb}"
    ;048  row + 1
    y_pos = temp_y_pos - 3							;048
 	call print(calcpos(x_pos,y_pos)) "{b}X{endb}"	;048
    row + 1											;048
 
    x_pos = j_pos
    call print(calcpos(x_pos,y_pos)) "{b}",signature_line,"{endb}"
    row + 1
 
    ;048  y_pos = y_pos + 2_line
    y_pos = y_pos + 2_5_line  ;048
    ;048  x_pos = c_pos + 38
    ;048  call print(calcpos(x_pos,y_pos)) "{b}DISPENSE AS WRITTEN{endb}"
    ;048  row + 1
    x_pos = j_pos + 30
    call print(calcpos(x_pos,y_pos)) "{b}Provider Signature{endb}"		;048
    ;048 call print(calcpos(x_pos,y_pos)) "{b}SUBSTITUTION PERMITTED{endb}"
    row + 1
 
 
    y_pos = y_pos + 3_line
    x_pos = c_pos
    ;035 Beg call print(calcpos(x_pos,y_pos)) "Prescribed by: {b}",tprint_req->job[i]->phys_bname,"{endb}"
     call print(calcpos(x_pos,y_pos)) "Prescribed by: {b}",tprint_req->job[d.seq]->phys_bname,"{endb}",
    	"   ", "NPI#: " tprint_req->job[d.seq]->phys_npi ;035 End
    row+1
/*
    x_pos = g_pos + 30
    call print(calcpos(x_pos,y_pos)) "Date:"
    row + 1
    x_pos = x_pos + 26
    call print(calcpos(x_pos,y_pos)) tprint_req->job[i]->phys_ord_dt
    row + 1
*/
    if (stamp_dea = TRUE)
;041         x_pos = j_pos + 8
        x_pos = k_pos  /*041*/
 
        if (tprint_req->job[i]->phys_dea > " ")
            call print(calcpos(x_pos,y_pos))"DEA #:  ",tprint_req->job[i]->phys_dea ;003
        else
            call print(calcpos(x_pos,y_pos))"DEA #:  _______________" ;002 and 003
        endif
        row + 1
    endif
 
;CMB          /*** start 028 ***/
;CMB         if (tprint_req->job[d.seq]->phys_npi > " ")
;CMB                 y_pos = y_pos + 2_line
;CMB                 x_pos = j_pos + 8
;CMB                 call print(calcpos(x_pos,y_pos))"NPI #:  ",tprint_req->job[d.seq]->phys_npi
;CMB                 row + 1
;CMB     endif
;CMB          /*** end 028 ***/
 
    ;MOD 003 Start - Writes the Supervising Physician field if sup_phys_bname is populated
 
    if (tprint_req->job[i]->sup_phys_bname > " ")
        x_pos = c_pos
        y_pos = y_pos + 3_line
        call print(calcpos(x_pos,y_pos)) "Supervising Physician: {b}",tprint_req->job[i]->sup_phys_bname,"{endb}"
        row+1
 
        ;003 See if DEA box is checked and put DEA if TRUE
 
        if (stamp_dea = TRUE)
;041             x_pos = j_pos + 8
            x_pos = k_pos  /*041*/
 
            if (tprint_req->job[i]->sup_phys_dea > " ")
                 call print(calcpos(x_pos,y_pos))"DEA #:  ",tprint_req->job[i]->sup_phys_dea
            else
                 call print(calcpos(x_pos,y_pos))"DEA #:  _______________" ;002
            endif
        row + 1
        endif
    endif
 
    ;MOD 003 Stop
 
    if (tprint_req->job[i]->eprsnl_ind = TRUE)
        y_pos = y_pos + 2_line
        x_pos = c_pos
        call print(calcpos(x_pos,y_pos)) "Entered by: {b}",tprint_req->job[i]->eprsnl_bname,"{endb}"
        row+1
    else
            y_pos = y_pos + 2_line
    endif
 
         /*** start 028 ***/
        if (tprint_req->job[d.seq]->sup_phys_npi > " ")
                x_pos = j_pos + 8
                call print(calcpos(x_pos,y_pos))"NPI #:  ",tprint_req->job[d.seq]->sup_phys_npi
                row + 1
    endif
         /*** end 028 ***/
 
 
    y_pos = y_pos + 1_5_line						;048
    temp_y_pos = y_pos								;048
    x_pos = j_pos									;048
    call print(calcpos(x_pos,y_pos-3)) "{b}",tprint_req->job[i]->phys_bname," {endb} (E-Sig.)"
    row + 1
    call print(calcpos(x_pos,y_pos)) "{b}",signature_line,"{endb}"   ;048
    row + 1											;048
	    y_pos = y_pos + 2_line  ;052
	    x_pos = j_pos    ;052
	    call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->phys_sign_dt_tm,"{endb}";052
 
    	row + 1	;052
 
    y_pos = y_pos + 2_line
    x_pos = j_pos + 30
    if (tprint_req->job[i]->daw > 0)
      call print(calcpos(x_pos,y_pos)) "{b}DISPENSE AS WRITTEN{endb}"
    else
      call print(calcpos(x_pos,y_pos)) "{b}SUBSTITUTION PERMITTED{endb}"
    endif
    row + 1
 
    if (stamp_att = TRUE)
        y_pos = y_pos + 2_line
        x_pos = f_pos + 20
        call print(calcpos(x_pos,y_pos)) "{cpi/16}{b}ATTENTION: THIS RX NOT VALID FOR CONTROLLED SUBSTANCES{endb}{cpi/12}"
        row + 1
    endif
 
     ;048  if (tprint_req->job[d.seq].csa_group != "A")
     ;048     y_pos = temp_y_pos - 3
 
       ;048  if (tprint_req->job[d.seq]->daw > 0)
       ;048      x_pos = c_pos     ;*** Dispense As Written
       ;048  else
       ;048      x_pos = j_pos     ;*** Substitution Permitted
       ;048  endif
 
    ;048      call print(calcpos(x_pos,y_pos)) "{b}",tprint_req->job[d.seq]->phys_bname," {endb} (E-Sig.)"
    ;048      row + 1
    ;048  else
    ;048      y_pos = temp_y_pos - 3
 
    ;048      if (tprint_req->job[d.seq]->daw > 0)
    ;048          x_pos = c_pos     ;*** Dispense As Written
     ;048     else
     ;048         x_pos = j_pos     ;*** Substitution Permitted
     ;048     endif
 
     ;048     call print(calcpos(x_pos,y_pos)) "{b}X{endb}"
     ;048     row + 1
    ;048  endif
 
    "   "
    row + 1
 
endmacro ;*** print_footer
 
       y_pos = 0
       x_pos = 0
 
       ; The following are used to position data in the proper x position, to allow
       ; for easy x_pos modification for similarly positioned data
 
       a_pos =  72      ; header
       b_pos =  57      ; left side of boxes
       c_pos =  65      ; patient name label, signature lines
       d_pos =  79      ; SIG label,other RX labels on left
       e_pos = 194      ; pharmacist note
       f_pos = 165      ; patient address data
       g_pos = 234      ; Age label
       h_pos = 347      ; Sex label
       h1_pos = 320     ;035 Sex label 2
       h2_pos = 380     ;035 Weight label
       i_pos = 459      ; MRN label
       j_pos = 350      ; Home Phone, other similar labels
       k_pos = 450      ; Start Date label
       l_pos = 392      ; DAW label
       m_pos = 320      ; Provider signature line
       n_pos = 423      ; phone and policy data
 
       ; The following are used to position data in the proper y position, to allow
       ; for easy y_pos modification for similarly positioned data
 
       header_top_pos   = 36       ; starting y_pos for header info
;036 Beg
;       patient_top_pos  = 96
;       body_top_pos     = 220
;       rx_top_pos       = 250
;       pat_addr_top_pos = 192
       patient_top_pos  = 96 + 30
       body_top_pos     = 220 + 12
       rx_top_pos       = 250 + 12
       pat_addr_top_pos = 192 + 12
;036 End
       body_bottom_pos  = 705
       rx_detail_pos    = 155  ;*** y_pos
       if (tprint_req->job[i]->hp_found = TRUE)
          hp_offset        = 20
       else
          hp_offset        = 0
       endif
 
       ; The following are used to determine the amount of vertical line space
       half_line = 3
       1_line    = 6
       1_5_line  = 9
       2_line    = 12
       2_5_line  = 15
       3_line    = 18
       3_5_line  = 21
       4_line    = 24
       req_fit         = FALSE
       clean_frame     = FALSE
       break_field     = fillstring(12," ")
       signature_line  = fillstring(40,"_")
       sep_line        = fillstring(90,"-")
       name_line       = fillstring(50," ")
       if (tprint_req->job[i]->hp_found = TRUE)
;049          max_row_knt     = 29
;049          current_row_knt = 29
          max_row_knt     = 28   ;049
          current_row_knt = 28   ;049
       else
;049          max_row_knt     = 32
;049          current_row_knt = 32
          max_row_knt     = 31   ;049
          current_row_knt = 31   ;049
       endif
       first_req       = TRUE
       is_last_page    = FALSE
       stamp_dea       = FALSE
       stamp_att       = TRUE
 
   detail
       for (j = 1 to tprint_req->job[i]->req_knt)
           does_req_fit
           if (req_fit = TRUE)
              print_rx
              if (j = tprint_req->job[i]->req_knt)
                 print_footer
              endif
           else
              if (clean_frame = FALSE)
                 if (j != 1)
                    print_footer
                    break
                 endif
                 print_page_frame
                 does_req_fit
                 if (req_fit = TRUE)
                    print_rx
                    if (j = tprint_req->job[i]->req_knt)
                       print_footer
                    endif
                 else
                    find_break_field
                    print_rx
                    print_footer
                    if (j != tprint_req->job[i]->req_knt)
                       break
                       print_page_frame
                    endif
                 endif
              else
                 find_break_field
                 print_rx
                 print_footer
                 if (j != tprint_req->job[i]->req_knt)
                    break
                    print_page_frame
                 endif
              endif
           endif
       endfor
   with
       nocounter,
       maxrow = 120,
       maxcol = 255,
       dio = 36
 
   free record prequest
   record prequest
   (
     1 output_dest_cd   = f8
     1 file_name        = vc
     1 copies           = i4
     1 output_handle_id = f8  ; this field should never be passed in!
     1 number_of_pages  = i4
     1 transmit_dt_tm   = dq8
     1 priority_value   = i4
     1 report_title     = vc
     1 server           = vc
     1 country_code     = c3
     1 area_code        = c10
     1 exchange         = c10
     1 suffix           = c50
   )
 
   set prequest->output_dest_cd  = tprint_req->job[i]->output_dest_cd
   set prequest->file_name       = tprint_req->job[i]->print_loc
   set prequest->number_of_pages = 1
   set prequest->report_title = concat("RX","|",trim(cnvtstring(tprint_req->job[i]->req[1]->order_id)),"|",
                                       trim(demo_info->pat_name),"|","0","|"," ","|"," ","|",trim(cnvtstring(demo_info->pat_id)),
                                       "|",trim(cnvtstring(tprint_req->job[i]->eprsnl_id)),"|"," ","|","0")
 
   if (tprint_req->job[i]->free_text_nbr > " " and
       tprint_req->job[i]->free_text_nbr != "0")
       set prequest->suffix = tprint_req->job[i]->free_text_nbr
   endif
 
       free record preply
       record preply
       (
         1 sts = i4
         1 status_data
           2 status = c1
           2 subeventstatus[1]
             3 OperationName = c15
             3 OperationStatus = c1
             3 TargetOjbectName = c15
             3 TargetObjectValue = c100
       )
 
       call echo ("***")
       call echo ("***   Executing SYS_OUTPUTDEST_PRINT")
       call echo ("***")
       execute sys_outputdest_print with replace("REQUEST",prequest),replace("REPLY",preply)
       call echo ("***")
       call echo ("***   Finished executing SYS_OUTPUTDEST_PRINT")
       call echo ("***")
       call echorecord(preply)
   endif
endfor
 
/****************************************************************************
*       EXIT_SCRIPT                                                         *
*****************************************************************************/
#EXIT_SCRIPT
 
if (failed != FALSE)
    set reply->status_data->status = "F"
    set reply->status_data->subeventstatus[1]->OperationStatus = "F"
    set reply->status_data->subeventstatus[1]->TargetObjectValue = sErrMsg
 
    if (failed = SELECT_ERROR)
        set reply->status_data->subeventstatus[1]->OperationName = "SELECT"
        set reply->status_data->subeventstatus[1]->TargetObjectName = table_name
    elseif (failed = INSERT_ERROR)
        set reply->status_data->subeventstatus[1]->OperationName = "INSERT"
        set reply->status_data->subeventstatus[1]->TargetObjectName = table_name
    elseif (failed = INPUT_ERROR)
        set reply->status_data->subeventstatus[1]->OperationName = "VALIDATION"
        set reply->status_data->subeventstatus[1]->TargetObjectName = table_name
    else
        set reply->status_data->subeventstatus[1]->OperationName = "UNKNOWN"
        set reply->status_data->subeventstatus[1]->TargetObjectName = table_name
    endif
else
    set reply->status_data->status = "S"
endif
 
call echorecord(reply)
set script_version = "047 07/08/09 MC4839"
set rx_version = "01"
end
go
