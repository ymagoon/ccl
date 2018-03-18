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

        Source file name:       rad_packet_modify_data.inc
        Object name:            n/a
        Request #:              multiple

        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
        
        Program purpose:        data flags for modify and reprint on the patient packet

        Tables read:            many

        Tables updated:         none
        Executing from:         ?

        Special Notes:          ?
                                                                  
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     ### 08/19/03 Tammy Baack/Sandra Prow Initial Release                  *
;~DE~************************************************************************


;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
call echo("*****START OF MODIFY/REPRINT DATA*****")

;modify flag
   if (modify_flag = 1)
        A_mod->status = "MODIFIED"
   endif
;reprint flag                   
   if (working_array->reprint_flag = "Y")           
       A_mod->reprint = "REPRINT"
   endif


