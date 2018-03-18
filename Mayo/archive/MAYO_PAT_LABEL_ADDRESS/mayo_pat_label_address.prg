drop program mayo_pat_label_address:dba go
create program mayo_pat_label_address:dba
 
/************************************************************************
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
 
          Date Written:       MM/DD/YYYY
          Source file name:   labelwarmband
          Object name:        labelwarmband
          Request #:          XXXXXX
 
          Product:            CORE V500
          Product Team:       CORE V500
          HNA Version:        V500
          CCL Version:
 
          Program purpose:    Label
 
          Tables read:        VARIABLE
          Tables updated:     None
          Executing from:     PM DBDocs
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 MM/DD/YY Sample Engineer      initial release                    *
 *001 03/29/02 DaRon Holmes         Sized for Tri-State Stock FM1542   *
 *002 01/12/05 Elaine Miller 	    customized FIN & MR# labels        *
 *003 03/31/05 Elaine Miller        Modified for generic doc file      *
 *004 06/10/09 dg5085               customize for mayo_Mn              *
 *005 06/26/08 dg5085               prefix 4 character and adjustements*
 *006 09/25/08 dg5085               next enhancements SR 1-1521526751  *
 *007 10/27/08 dg5085               truncate patient name to 23        *
 *008 12/09/08 dg5085               Chaged label to use layout builder *
 *                                  from SR 1-2058963541               *
 *009 05/07/09 rv5893               fix formatting of the fin and mrn alias
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
%i ccluserdir:pm_hl7_formatting.inc
execute reportrtl
%i ccluserdir:mayo_pat_label_address.dvl
set d0 = InitializeReport(0)
declare full_name = vc
declare first_name = vc
declare last_name = vc
declare middle_name = vc
declare add1=vc
declare add2=vc
declare add3=vc
declare city= vc
declare state=vc
declare zip_code=vc
declare loc = vc
DECLARE ADDr2 = F8
DECLARE ADDr3 = F8
DECLARE POS1 = F8
DECLARE POS2 = F8
 
 
 set first_name = trim(request->patient_data->person->current_name->name_first)
 set last_name = trim(request->patient_data->person->current_name->name_last)
 set middle_name = trim(request->patient_data->person->current_name->name_middle)
 if (middle_name = NULL)
 set full_name    = cnvtupper(SUBSTRING(1,40,CONCAT(FIRST_NAME," ",LAST_NAME)))
 else
 set full_name    = cnvtupper(SUBSTRING(1,40,CONCAT(FIRST_NAME," ",MIDDLE_NAME," ",LAST_NAME)));was 40
 endif
 set add1= trim(request->patient_data->PERSON->HOME_ADDRESS->STREET_ADDR)
 set add2= trim(request->patient_data->PERSON->HOME_ADDRESS->STREET_ADDR2)
 set add3= trim(request->patient_data->PERSON->HOME_ADDRESS->STREET_ADDR3)
 set city= trim(request->patient_data->PERSON->HOME_ADDRESS->CITY)
 set state= trim(request->patient_data->PERSON->HOME_ADDRESS->STATE)
 set zip_code = trim(request->patient_data->PERSON->HOME_ADDRESS->ZIPCODE)
set LOC = SUBSTRING(1,50,concat(CITY,", ",STATE," ",ZIP_CODE))
 
IF (add2 = NULL)
set ADDr2 = 0
set POS2 = 0
set POS1 = 1
set ADDr3 = 0
ELSE
set ADDr2 = 1
set POS2 = 1
set POS1 = 0
set ADDr3 = 0
Endif
IF(add3 != NULL)
set ADDr3 = 1
set POS2 = 0
set POS1 = 0
set ADDr2 = 1
ENDIF
  select
    d.seq
  from dummyt d
  plan d
 
  detail
    d0=DetailSection(Rpt_Render)
 
  with nocounter;, noformfeed, DIO = POSTSCRIPT
  set d0 = FinalizeReport($1);"cer_print:ds.dat");request->printer_name)
 
set last_mod = "009 02/11/10 m061596"
 
  end
  go
 
 
