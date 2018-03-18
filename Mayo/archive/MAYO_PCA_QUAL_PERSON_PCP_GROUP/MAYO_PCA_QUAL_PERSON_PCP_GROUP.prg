drop program mayo_pca_qual_person_pcp_group:dba go
create program mayo_pca_qual_person_pcp_group:dba
 
/****************************************************************************
 *                                                                          *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &            *
 *                              Technology, Inc.                            *
 *       Revision      (c) 1984-1999 Cerner Corporation                     *
 *                                                                          *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.             *
 *  This material contains the valuable properties and trade secrets of     *
 *  Cerner Corporation of Kansas City, Missouri, United States of           *
 *  America (Cerner), embodying substantial creative efforts and            *
 *  confidential information, ideas and expressions, no part of which       *
 *  may be reproduced or transmitted in any form or by any means, or        *
 *  retained in any storage or retrieval system without the express         *
 *  written permission of Cerner.                                           *
 *                                                                          *
 *  Cerner is a registered mark of Cerner Corporation.                      *
 *                                                                          *
 ****************************************************************************
 
          Date Written:       11/01/07
          Source file name:   pca_qual_person_pcp_group
          Object name:        pca_qual_person_pcp_group
          Request #:
 
          Product:            PowerChart Analytics
          Product Team:
          HNA Version:        2008
          CCL Version:        N/A
 
          Program purpose:    This program qualifies recently updated persons where
                              the patients PCP is a member of the PCA PCP grouping
                              (from OMF_GROUPINGS).
 
          Tables read:        PCA_QUALITY_TOPIC
                              CODE_VALUE
                              PERSON
                              ENCOUNTER
                              PROBLEM
                              DIAGNOSIS
                              ORDERS
                              CLINICAL_EVENT
                              PERSON_PRSNL_RELTN
                              OMF_GROUPINGS
          Tables updated:
          Executing from:     OPERATIONS
 
          Special Notes:
 ****************************************************************************
 *                      GENERATED MODIFICATION CONTROL LOG                  *
 ****************************************************************************
 *                                                                          *
 *Mod Date     Engineer             Comment                                 *
 *--- -------- -------------------- --------------------------------------- *
 *001 11/01/07 RG7351               Initial Release                         *
 ****************************************************************************/
 
call echo(build('Entering PCA_QUAL_PERSON_PCP_GROUP.prg...@', format(cnvtdatetime(curdate, curtime3), 'DD-MMM-YYYY HH:mm:SS;;D')))
 
/****** Declarations ******/
;Variable/Constant Declares
  declare iQualIDX            = i4  with protect, noconstant(0)    ;Index used to Qualified values
  declare iQualCnt            = i4  with protect, noconstant(0)    ;Used to count Qualified values
 
;Record Declares
;  record process_request (
;    1 topic_id  = f8
;    1 historical_ind    = i4
;    1 qual_from_dt_tm   = dq8
;    1 qual_to_dt_tm     = dq8
;  )
 
  record reply (
%i cclsource:status_block.inc
  )
 
;Qual record is exposed to calling process
  record qual (
    1 qual[*]
      2 person_id     = f8
      2 sex_cd        = f8
      2 birth_dt_tm   = dq8
      2 encntr_id     = f8
      2 accession_id  = f8
      2 order_id      = f8
      2 data[*]
        3 vc_var      = vc
        3 double_var    = f8
        3 long_var              = i4
        3 short_var       = i2
  ) with persistscript
 
 
/****** Initialization ******/
  set reply->status_data.status = 'F'
 
/****** Begin Logic ******/
  ;Insure that a CCLSeclogin has been used
  if (validate(xxcclseclogin) = 1)
    if (xxcclseclogin->loggedin = 0)
      call echo('Error : A CCLSeclogin must be used')
      go to END_PROGRAM
    endif
  endif
 
  ;Lookup the updated persons
  select
    if (request->historical_ind = 1)
      ;Get persons whose encounters have been updated in the requested timerange
      from omf_groupings og
        , person_prsnl_reltn ppr
        , person p
        , ((select per.person_id
            from person per
            where ((per.birth_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)) or
                   (per.deceased_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)) or
                   (per.updt_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)))
          UNION ALL
            (select enc.person_id
            from encounter enc
            where enc.updt_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm))
          with rdbunion, sqltype('F8')) pers)
      plan pers
        where pers.person_id+0 > 0.0
      join p
        where p.person_id = pers.person_id
      join ppr
        where ppr.person_id = p.person_id
          and ppr.person_prsnl_r_cd = value(uar_get_code_by('MEANING', 331, 'PCP'))
          and (cnvtdatetime(curdate, curtime) between ppr.beg_effective_dt_tm and ppr.end_effective_dt_tm
            or (cnvtdatetime(curdate, curtime) > ppr.beg_effective_dt_tm and ppr.end_effective_dt_tm is NULL))
      join og
        where og.grouping_cd = value(uar_get_code_by('MEANING', 13003, 'PCA PCP'))
          and cnvtreal(trim(og.key1,3)) = ppr.prsnl_person_id
          and ((cnvtdatetime(curdate, curtime) between og.valid_from_dt_tm and og.valid_until_dt_tm)
              or (cnvtdatetime(curdate, curtime) > og.valid_from_dt_tm and og.valid_until_dt_tm is NULL))
    else
      ;Get persons with depended data updated in the requested timerange
      from omf_groupings og
        , person_prsnl_reltn ppr
        , person p
        , ((select per.person_id
            from person per
            where ((per.birth_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)) or
                   (per.deceased_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)) or
                   (per.updt_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)))
          UNION ALL
           (select ppr.person_id
            from person_prsnl_reltn ppr
            where ppr.updt_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)
          UNION ALL
            (select pr.person_id
            from problem pr
            where pr.updt_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)
          UNION ALL
            (select enc.person_id
            from encounter enc
            where enc.updt_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)
          UNION ALL
            (select diag.person_id
            from diagnosis diag
            where diag.updt_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)
          UNION ALL
            (select ord.person_id
            from orders ord
            where ord.updt_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)
          UNION ALL
            (select ce.person_id
            from clinical_event ce
            where ce.updt_dt_tm between cnvtdatetime(request->qual_from_dt_tm) and cnvtdatetime(request->qual_to_dt_tm)))))))
          with rdbunion, sqltype('F8')) pers)
      plan pers
        where pers.person_id+0 > 0.0
      join p
        where p.person_id = pers.person_id
      join ppr
        where ppr.person_id = p.person_id
          and ppr.person_prsnl_r_cd = value(uar_get_code_by('MEANING', 331, 'PCP'))
          and (cnvtdatetime(curdate, curtime) between ppr.beg_effective_dt_tm and ppr.end_effective_dt_tm
              or (cnvtdatetime(curdate, curtime) > ppr.beg_effective_dt_tm and ppr.end_effective_dt_tm is NULL))
      join og
        where og.grouping_cd = value(uar_get_code_by('MEANING', 13003, 'PCA PCP'))
          and cnvtreal(trim(og.key1,3)) = ppr.prsnl_person_id
          and ((cnvtdatetime(curdate, curtime) between og.valid_from_dt_tm and og.valid_until_dt_tm)
              or (cnvtdatetime(curdate, curtime) > og.valid_from_dt_tm and og.valid_until_dt_tm is NULL))
    endif
  distinct into 'nl:' p.person_id, p.sex_cd, p.birth_dt_tm
  order by p.person_id
    ,  p.sex_cd
    ,  p.birth_dt_tm
  head report
    iQualCnt = 0
  detail
    iQualCnt = iQualCnt + 1
    if (mod(iQualCnt, c_ccl_block_medium) = 1)
      stat = alterlist(qual->qual, iQualCnt + (c_ccl_block_medium - 1))
    endif
    stat = alterlist(qual->qual[iQualCnt].data, 1)
    qual->qual[iQualCnt].person_id           = p.person_id
    qual->qual[iQualCnt].sex_cd              = p.sex_cd
    qual->qual[iQualCnt].birth_dt_tm         = p.birth_dt_tm
    qual->qual[iQualCnt].data[1].double_var  = cnvtreal(trim(og.key2,3))
  foot report
    stat = alterlist(qual->qual, iQualCnt)
  with nocounter, orahint('ALL_ROWS')   ; test
 
    call Write_Msg(c_hMsg, 0, c_sEventName, c_msg_debug, concat('Qualified ', build(iQualCnt), ' records'))
 
  set reply->status_data.status = 'S'
 
#END_PROGRAM
 
call echo(build('Exiting PCA_QUAL_PERSON_PCP_GROUP...@', format(cnvtdatetime(curdate, curtime3), 'DD-MMM-YYYY HH:mm:SS;;D')))
 
end
go

