/******************************************************************************
*	NOTE TO ENGINEERS: THIS SAME EXACT SCRIPT ALSO EXISTS IN THE SCRIPT       *
*	PROJECT 1335, \CODE\SCRIPT\BBT_GENERATETAGSLABELS\BBT_TAG_COMPONENT.PRG.  *
*	ANY CHANGES MADE TO THIS SCRIPT MUST ALSO BE MADE TO THE SCRIPT IN   	  *
*	THE ABOVE LISTED SCRIPT PROJECT.										  *
******************************************************************************/
 
/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-1995 Cerner Corporation                 *
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
  ~BE~***********************************************************************/
/*****************************************************************************
 
        Source file name:       bbt_tag_crossmatch.prg
        Object name:            bbt_tag_crossmatch
        Request #:
 
        Product:                Pathnet
        Product Team:           Blood Bank Transfusion
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Print component tags
 
        Tables read:            ?
 
        Tables updated:         None
 
        Executing from:         VB
 
        Special Notes:          ??
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;    *000 08/23/96 Carol Peterson       Initial Release                     *
;    *    10/28/97 Carol Peterson       Added ability to remove component   *
;    *                                  product info, add patient antibody  *
;    *                                  and product antigen info to tag.    *
;     001 05/24/99 Jose Suarez          change cer_temp to cer_print        *
;     002 02/26/01 Rob Peterson         Internationalize script             *
;     003 08/23/01 Doug Saus		Changed file name to more unique value
;					to solve duplicate printing problem
;         March 2011  ccsksw      customize for Zebra labels and aztec barcodes
;         01/11/12  ccsksw       per Susan Kindy, combine barcodes into one
;                                barcode.  Took data from each barcode -
;                               MRN, ABO/RH, name, unit# and combined the data
;                               plus the prefix/suffix into one string/barcode
;         02/09/12  ccsksw     change for RHO, change %i to MSJCCLDIR instead of
;                          full path.  Do a Save As with MSJCCLDIR: as the path.
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
/*****************************************************************************
 * Installation instructions:  Copy program from CCLSOURCE to the appropriate*
 * directory prior to making changes.  There are three TO DO sections in this*
 * program that allow the addition of patient antibodies, product antigens,  *
 * and component product number, ABO, and Rh to the component tag.  Search   *
 * for the section using TO DO: and follow the instructions.                 *
 *****************************************************************************/
 
drop program bbt_tag_crossmatch_msj:dba go
create program bbt_tag_crossmatch_msj:dba
;drop program bbt_tag_crossmatch_msj_sub:dba go go;mayo_mn_bbt_tag_cross_msj:dba go
;create program bbt_tag_crossmatch_msj_sub:dbamayo_mn_bbt_tag_cross_msj:dba ;
 
 
execute reportrtl
%i CCLUSERDIR:bbt_tag_crossmatch_msj.dvl
set d0 = InitializeReport(0)
;%i ccluserdir:bbt_tag_crossmatch_msj_sub.dvl
;set d0 = InitializeReport(0)
 
 
 
 
/*
 * record request populated in bbt_tag_print_ctrl.prg which calls this program
 */
 
/* declare internal record structures for antigens, antibodies and pooled component products */
%i ccluserdir:bbt_tag_internal_struct.inc
%i ccluserdir:bbt_get_rpt_filename.inc
 
;Begin 002
/*****************************************************************************
* Internationalization                                                       *
*****************************************************************************/
 
;003 replaced i18n file with bbt equivalent
;%i ccluserdir:i18n_uar.inc
%i ccluserdir:bbt_i18n_uar.inc
set i18nHandle = 0
set h = uar_i18nlocalizationinit(i18nHandle, curprog, "", curcclrev)
 
 
/******************************************************
*                Script                               *
******************************************************/
 
set rpt_date = 0
 
/* Create report filename */
/*004 comment out and replace with new code*/
;003 begin
;set logical d value(trim(logical("CER_PRINT"))) ;003 Created logical to shorten filename
;set rpt_filename
;	= GetReportFilename("d:bb_tag_comp.txt")
;set rpt_filename = substring(3,size(rpt_filename,1),rpt_filename)
;003 end
 
/*004 start*/
execute cpm_create_file_name_logical "bb_tag_xm","txt","x"
set rpt_filename = cpm_cfn_info->file_name
/*004 end*/
 
 
/*
 * Print Crossmatch Transfusion Tag
 */
 
 
;003 changed to select into logical
;004select into concat("d:", rpt_filename)
/*004 new select into line */
 
 
set x = 0
 
 
 
select into value(cpm_cfn_info->file_name_logical)
        d.seq
from  (dummyt d with seq = value(tot_tag_cnt))
 
 
 
detail
%i CCLUSERDIR:bbt_tag_load_from_request.inc
 
 
 
;for (x = 1 to 3)
;  if (x != 1)        ;page break before each page except first
;     d0 = PageBreak(0)
;   endif
 
   d0 = LabelDetailSection(Rpt_Render)
   d0 = PageBreak(0)
 
;endfor
 
 
with
 nocounter
 
call echoxml(tag_request,"sb_cross1.xml")
set d0 = FinalizeReport(value(cpm_cfn_info->file_name_logical))
 
 
end go
 
 
