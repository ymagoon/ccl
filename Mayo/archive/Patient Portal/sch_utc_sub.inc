/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-2001 Cerner Corporation                 *
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
 
          Date Written:       03/26/03
          Source file name:   sch_utc_sub.inc
          Object name:
          Request #:
 
          Product:            CORE V500
          Product Team:       CORE V500
          HNA Version:        V500
          CCL Version:
 
          Program purpose:    This include file contains utc subroutines.
 
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
 30870 03/26/03 Chinh Luu          Initial Release
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
/**********************************************************************/
/* Declares                                                           */
/**********************************************************************/
 declare s_format_utc_date (date, tz_index, option) = vc
 
 /*********************************************************************
* Name: s_format_utc_date
* Purpose: format the absolute datetime applying the timezone index
* Inputs:  date -  converted date (dq8)
*          tz_index - time zone index (i4)
* Outputs: Formatted date (vc)
***********************************************************************/
subroutine s_format_utc_date (date, tz_index, option)
  if (curutc)
     if (tz_index > 0)
        return (format(datetimezone(date,tz_index),option))
     else
        return (format(datetimezone(date,curtimezonesys),option))
     endif
  else
     return (format(date,option))
  endif
end
 

