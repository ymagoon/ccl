/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-2008 Cerner Corporation                 *
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
 
          Author:             M142151
          Date Written:       06/11/2015
          Source file name:   mayo_mn_formfast_rule.prg
          Object Name:        mayo_mn_formfast_rule
          Request #:          n/a
 
          Program purpose:    Custom quadramed extract
 
          Tables read:        Various
          Tables Updated:     None
          Executing From:     CCL
 
          Special Notes:
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 06/11/15 m142151              Initial release                    *
 ******************** End of Modification Log **************************/
 
;PROMPT "Facility: "=""
drop program mayo_mn_formfast_rule:dba go
create program mayo_mn_formfast_rule:dba
set RETVAL = 0
 
free set formfast_request
record formfast_request
(
  1 facility = vc
  1 printer = vc
  1 sch_event_id = f8
)
 
call echorecord(request)
 
set formfast_request->facility = trim(cnvtupper($1),3)
set formfast_request->printer = trim(cnvtlower($2),3) ;JRG Changed this to lower, may have to go back to upper later
 
for (j = 1 to value(size(request->qual,5)))
  set formfast_request->sch_event_id = request->qual[j]->sch_event_id
    if ((formfast_request->sch_event_id > 0) and (textlen(formfast_request->facility) > 0))
      set RETVAL = 100
      execute mayo_mn_rpt_formfast_extract "mayo_mn_formfast_rule.dat"
    endif
endfor
 
end
go
 
