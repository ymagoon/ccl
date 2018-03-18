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
 
        Source file name:       rad_packet_detail.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Set order details
 
        Tables read:            many
 
        Tables updated:         ?
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     ### 08/19/03 Tammy Baack/Sandra Prow    Initial Release               *
;~DE~************************************************************************
 
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
call echo ("*******************Begin Order Details sets***************")
;ORDER ENTRY FIELD MEANINGS
declare o2= c8 with public, noconstant("PTOXYGEN")
declare iv = c7 with public, noconstant("PTHASIV")
declare preg = c8 with public, noconstant("PREGNANT")
declare lnmp = c4 with public, noconstant("LNMP")
declare isolation = c with public, noconstant("ISOLATIONCODE")
declare comment1 = vc with public, noconstant("COMMENTTYPE1")
declare comment2 = vc with public, noconstant("COMMENTTYPE2")
declare commenttext1 = vc with public, noconstant("COMMENTTEXT1")
declare commenttext2 = vc with public, noconstant("COMMENTTEXT2")
declare detail1 = vc with public, noconstant("DETAIL1")
declare detail2 = vc with public, noconstant("DETAIL2")
declare detail3 = vc with public, noconstant("DETAIL3")
declare detail4 = vc with public, noconstant("DETAIL4")
declare detail5 = vc with public, noconstant("DETAIL5")
 
;ORDER ENTRY FIELD IDS- NUMBERS ONLY
declare detail6 = i4 with public, noconstant(24990013)
declare detail7 = i4 with public, noconstant(28060774)
declare detail8 = i4 with public, noconstant(0)
declare detail9 = i4 with public, noconstant(0)
declare detail10 = i4 with public, noconstant(0)
 
call echo ("*******************End Order Details sets***************")


