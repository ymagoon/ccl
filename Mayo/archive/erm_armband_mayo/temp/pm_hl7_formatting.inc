/****************************************************************************
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
 ************************************************************************
 
          Date Written:       8/7/97
          Source file name:   n/a
          Object name:        n/a
          Request #:          n/a
 
          Product:            CORE V500
          Product Team:       CORE V500
          HNA Version:        V500
          CCL Version:
 
          Program purpose:    Include file for HL7 formatting scripts
 
          Tables read:
          Tables updated:
          Executing from:
 
          Special Notes:
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 08/07/97 Tim Barry            Initial Release                    *
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
 
/*****************************************************************************
*
******************************************************************************/
 
; common variables for routines
  set TRUE = 1
  set FALSE = 0
 
  if (validate(rp_hl7_form->initialized,"!") = "!")
 
    set trace recpersist
    record rp_hl7_form
    (1 initialized       = c1
     1 current_name_cd   = f8 )
    set trace norecpersist
 
    set rp_hl7_form->initialized = "Y"
 
    set rp_hl7_form->current_name_cd = 0
    select into "nl:"
     c.seq
    from code_value c
    where c.code_set = 213
      and c.cdf_meaning = "CURRENT"
      and c.active_ind = 1
      and begin_effective_dt_tm <= cnvtdatetime(curdate,curtime)
      and end_effective_dt_tm >= cnvtdatetime(curdate,curtime)
    detail
      rp_hl7_form->current_name_cd = c.code_value
    with nocounter
  endif
 
; used for pm_hl7_provider
  set PRV_ALIAS = 1
  set PRV_LAST_NAME = 2
  set PRV_FIRST_NAME = 3
  set PRV_MIDDLE_NAME = 4
  set PRV_NAME_FULL_FORMATTED = 5
  set PRV_PREFIX = 6
  set PRV_SUFFIX = 7
  set PRV_DEGREE = 8
  set PRV_USERNAME = 9
 
  declare pm_hl7_provider( prv_row_id, prv_option ) = c100
 
; subroutine to send back requested information about a provider.  row_id is prsnl row; option is info to send back
subroutine pm_hl7_provider( prv_row_id, prv_option )
 
;  call echo(concat("RowID: ", cnvtstring(prv_row_id)))
 
  set prv_rtn_string = fillstring(132, " ")
  set prv_last_name_st = fillstring(132, " ")
  set prv_first_name_st = fillstring(132, " ")
  set prv_name_full_formatted_st = fillstring(132," ")
  set prv_middle_name_st = fillstring(132, " ")
  set prv_suffix_st = fillstring(132, " ")
  set prv_prefix_st = fillstring(132, " ")
  set prv_free_text = FALSE
  set prv_username_st = fillstring(50, " ")
 
  select into "nl:"
   p.seq
  from prsnl p
   where p.person_id = prv_row_id
  detail
    prv_free_text = p.free_text_ind
    prv_last_name_st = p.name_last
    prv_first_name_st = p.name_first
    prv_name_full_formatted_st = p.name_full_formatted
    prv_username_st = p.username
  with nocounter
 
  if ( curqual > 0 )
    case ( prv_option )
      of PRV_ALIAS:
        set prv_rtn_string = " "
 
      of PRV_LAST_NAME:
        set prv_rtn_string = prv_last_name_st
 
      of PRV_FIRST_NAME:
        set prv_rtn_string = prv_first_name_st
 
      of PRV_NAME_FULL_FORMATTED:
        set prv_rtn_string = prv_name_full_formatted_st
 
      of PRV_USERNAME:
        set prv_rtn_string = prv_username_st
 
      of PRV_MIDDLE_NAME:
         if ( prv_free_text = TRUE )
           set rtn_string = " "
         else
           select into "nl:"
            n.seq
           from person_name n
           where n.person_id = prv_row_id
             and n.name_type_cd = rp_hl7_form->current_name_cd
             and n.active_ind = 1
             and n.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
             and n.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
           detail
             prv_rtn_string = n.name_middle
           with nocounter
         endif
 
      of PRV_PREFIX:
         if ( prv_free_text = TRUE )
           set prv_rtn_string = " "
         else
           select into "nl:"
            n.seq
           from person_name n
           where n.person_id = prv_row_id
             and n.name_type_cd = rp_hl7_form->current_name_cd
             and n.active_ind = 1
             and n.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
             and n.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
           detail
             prv_rtn_string = n.name_prefix
           with nocounter
         endif
 
      of PRV_SUFFIX:
         if ( prv_free_text = TRUE )
           set prv_rtn_string = " "
         else
           select into "nl:"
            n.seq
           from person_name n
           where n.person_id = prv_row_id
             and n.name_type_cd = rp_hl7_form->current_name_cd
             and n.active_ind = 1
             and n.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
             and n.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
           detail
             prv_rtn_string = n.name_suffix
           with nocounter
         endif
 
      of PRV_DEGREE:
         if ( prv_free_text = TRUE )
           set prv_rtn_string = " "
         else
           select into "nl:"
            n.seq
           from person_name n
           where n.person_id = prv_row_id
             and n.name_type_cd = rp_hl7_form->current_name_cd
             and n.active_ind = 1
             and n.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
             and n.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
           detail
             prv_rtn_string = n.name_degree
           with nocounter
         endif
 
    endcase
  endif
 
  return( prv_rtn_string )
 
end ; pm_hl7_provider
 
 
 
 
