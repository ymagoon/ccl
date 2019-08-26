/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-1999 Cerner Corporation                 *
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

        OE script name:         si_pyxis_in_typescript
        CCL program name:      op_si_pyxis_in_typescript
        Request #:              None

        Product:                EDI
        Product Team:           Standard Interfaces
        HNA Version:            500
        CCL Version:            7.0

        Program purpose:        Determines message type

        Tables read:            None

        Tables updated:         None

        Executing from:         Open Engine CCL Communication Server

        Special Notes:          None

******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     000 08/7/99 Ron Murphy           Rev 7.8 Release                     *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************


declare foundqry=i4

set foundqry = findstring("|QRY^Q02|",oen_request->org_msg,1)
execute oencpm_MsgLog build("Found QRY=", foundqry, char(0))

if (foundqry)
  set oen_reply->type = concat("QRY", char(0))
  set oen_reply->trigger = concat("QRY", char(0))
else
  set oen_reply->type = concat("DFT", char(0))
  set oen_reply->trigger = concat("DFT", char(0))
endif