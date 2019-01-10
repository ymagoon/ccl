 
 
/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-1997 Cerner Corporation                 *
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
 
        Source file name:       ESO_GET_ORDER_SELECTION.PRG
        Object name:            ESO_GET_ORDER_SELECTION
        Request #:              1210250
 
        Product:                ESO
        Product Team:           Outbound Open Port
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Suppress order events in the ORM Servers
                                from being eligable for processing in an
                                outbound orders interface through the
                                ESO Servers.
 
        Tables read:            none
 
        Tables updated:         none
 
        Executing from:         ORM Servers (SCP Entries 101, 104, 105, 107)
 
        Special Notes:          This is a custom script that need to be
                                handled specially between software relaeses.
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     000 01/01/98 Steven Baranowski    Initial Write
;     001 05/09/98 Steven Baranowski    Add call echos and bill_only_ind
;     002 11/24/98 Steven Baranowski    Add cs/template/type flags support
;     003 11/24/98 Steven Baranowski    General clean-up and commenting
;     004 09/03/99 Eric Martin          Added validate logic to reply structure
;     005 05/01/03 James Grosser        Suppress Child Pharmacy orders by default
;     006 12/02/03 Lance Hoover         Add orig_ord_as_flag logic, remove mod 005
;     007 03/16/06 Robert Becho         Changes to correct passivity with
;                                       Alternating IV's
;	  008 11/21/09 Chris Eakes	        Begin Baycare Control LOG
;     009 11/25/09 Steve Wade	   Changed ENDO to Surgery and added activate add an action type.
;     010 12/16/09 SW/CE		   Add organization logic around ENDO to only send SJH, SFB & SJN.
;								   Creating persistent record structure to cache organizations.
;     011 12/1/11  Rick Q          Added logic to unsupress teletracker orders
;     012 01/6/12  Rick Q          Modified logic for Echo orders to include Pedi Echo orders
;     013 03/6/12  Rick Q          v12 Removed "Cardiovascul" from suppression logic for
;                                  Cardio orders to MUSE
 
;     07/09/12 P Hopkins           Added logic to suppress all order updates for encounters that
;								   have been discharged for over a year.
;     11/20/13 H. Kaczmarczyk      Added logic to unsuppress Edutainment orders.
;     06/16/14 H. Kaczmarczyk      Added logic to unsupress activity type "CARDIOLOGY".
;     02/09/15 H. Kaczmarczyk      Added logic to suppress HealthSouth echo orders.
;     04/25/16 T. McArtor          v17 Added logic to unsuppress RFC 11407
;     06/10/16 H. Kaczmarczyk      Added logic for AMB EKG orders.
;     12/06/16 H. Kaczmarczyk      Added logic to unsuppress EMMI orders with activity type = OFC Videos.
;     07/27/17 H. Kaczmarczyk      Added logic to unsupress Bridge Breast Milk/Infant Feeding Orders
;                                  and Lab orders.
;     08/02/17 S. Parimi		   Updated code value for Invision with Display name.
;     12/19/17 J.Starke		       Added logic to unsuppress activity type CDF of PALLIATIVE
;     01/03/18 H. Kaczmarczyk      Added logic to unsuppress SOI Rad orders with activity type CDF of SOIRADIOLOGY
;     02/02/18 H. Kaczmarczyk      Added logic to unsuppress Audiology orders with activity type CDF of AUDIOLOGY
;	  11/27/18 Yitzhak Magoon	   Added logic for Model upgrade
;***********************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
drop program ESO_GET_ORDER_SELECTION go
create program ESO_GET_ORDER_SELECTION
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 1.
 
THE FOLLOWING REQUEST RECORD SHOULD BE DEFINED IN TDB.  PERFORM A
"SHOW ESO_GET_ORDER_SELECTION" IN TDB TO VERFIY THIS REQUEST STRUCTURE IS IN SYNC
 
record request
{
   activity_type_cd      [Double]                      ** ACTIVITY TYPE FROM THE ORDERS TABLE           **
   action_type_cd        [Double]                      ** ACTION TYPE FROM THE ORDER ACTION TABLE       **
   from_contributor_system_cd  [Double]                ** NO LONGER USED (SINCE REV 7.3)                **
   to_contributor_system_cd  [Double]                  ** NO LONGER USED (SINCE REV 7.3)                **
   order_status_cd       [Double]                      ** ORDER STATUS FROM THE ORDER_ACTION TABLE      **
   encntr_id             [Double]                      ** ENCNTR_ID FROM THE ORDERS TABLE               **
   organiztion_id        [Double]                      ** ORG_ID FROM THE ENCOUNTER TABLE (NOT USED)    **
   dept_order_status_cd  [Double]                      ** DEPT ORDER STATUS FROM ORDER_ACTION TABLE     **
   hl7_event_cd          [Double]                      ** H7 EVENT (NOT USED CURRENTLY)                 **
   order_template_flag   [Short]                       ** DEFINES CONTINUING ORDER TYPE                 **
   cs_flag               [Short]                       ** DEFINES PARENT/CHILD HIERARCHY                **
   orderable_type_flag   [Short]                       ** DEFINES ORDERABLE TYPE                        **
   order_control_disp    [String: Variable]            ** DEFINES ORDER CONTROL STRING FROM ORC SEGMENT **
   failure_ind           [Short]                       ** ORDER FAILURE, ONLY THE ESI SERVER SETS THIS  **
   order_contrib_sys_cd  [Double]                      ** THE SYSTEM THAT CREATED THE ORDER ORIGINALLY  **
   action_contrib_sys_cd  [Double]                     ** THE SYSTEM THAT IS PROFORM THE ACTION         **
   order_id              [Double]                      ** ORDER_ID ON THE ORDERS TABLE                  **
   action_sequence       [Long]                        ** ACTION_SEQUENCE ON THE ORDER_ACTION TABLE     **
   bill_only_ind         [Short]                       ** DEFINES IF THE ORDERABLE IS BILL ONLY         **
}
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
 
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 2.
 
DEFINE LOCAL VARIABLE THAT CAN BE USED IN THE CUSTOM SCRIPTING AT THE BOTTOM OF THIS FILE
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
set activity_type_cdm            = fillstring(12," ")  /* THE CDF MEANING FOR THE ACTIVITY_TYPE       */
set action_type_cdm              = fillstring(12," ")  /* THE CDF MEANING FOR THE ACTION_TYPE         */
set order_status_cdm             = fillstring(12," ")  /* THE CDF MEANING FOR THE ORDER_STATUS        */
set dept_order_status_cdm        = fillstring(12," ")  /* THE CDF MEANING FOR THE DEPT_ORDER_STATUS   */
 
set from_contributor_system_disp = fillstring(40," ")  /* THE IS NO LONGER USED AS OF REV 7.3         */
set to_contributor_system_disp   = fillstring(40," ")  /* THE IS NO LONGER USED AS OF REV 7.3         */
set order_contrib_sys_disp       = fillstring(40," ")  /* THE SYSTEM DISPLAY THAT CREATED THE ORDER   */
set action_contrib_sys_disp      = fillstring(40," ")  /* THE SYSTEM DISPLAY THAT PERFORM THE ACTION  */
 
 
/* CS_FLAG ENCODING- NOTE: AN ORDERABLE MAY HAVE MULTIPLE MEANINGS(ie.It can be a CSParent and a CSChild)*/
 
set CSNone_ind                   = 0                   /* DEFINES A SIMPLE ORDERABLE                  */
set CSParent_ind                 = 0                   /* DEFINES A CARE SET PARENT                   */
set CSChild_ind                  = 0                   /* DEFINES A CARE SET CHILD                    */
set CSSGParent_ind               = 0                   /* DEFINES A SUPER-GROUP PARENT                */
set CSSGChild_ind                = 0                   /* DEFINES A SUPER_GROUP CHILD                 */
set CSCPParent_ind               = 0                   /* DEFINES A CARE-PLAN PARENT                  */
set CSCPChild_ind                = 0                   /* DEFINES A CARE-PLAN CHILD                   */
 
/* ORDERABLE TYPE ENCODING -- NOTE:  ONLY ONE MEANING CAN BE DEFINED */
 
set OrdNone_ind                  = 0                   /* DEFINES A SIMPLE ORDERABLE                  */
set OrdTypeNormal_ind            = 0                   /* DEFINES A SIMPLE ORDERABLE                  */
set OrdTypeSuperGroup_ind        = 0                   /* DEFINES A SUPER GROUP                       */
set OrdTypeCarePlan_ind          = 0                   /* DEFINES A CARE PLAN                         */
set OrdTypeAPSpecial_ind         = 0                   /* DEFINES AP SPECIAL USAGE                    */
set OrdTypeDeptOnly_ind          = 0                   /* DEFINES DEPARTMENT ONLY USAGE               */
set OrdTypeCareSet_ind           = 0                   /* DEFINES A CASE SET                          */
set OrdTypeIntervalTest_ind      = 0                   /* DEFINES AN INTERVAL TEST                    */
 
/* ORDER TEMPLATE ENCODING -- NOTE:  ONLY ONE MEANING CAN BE DEFINED */
 
set ContOrdNone_ind              = 0                   /* DEFINES A NON-CONTINUING ORDERABLE          */
set ContOrdTemplate_ind          = 0                   /* DEFINES A TEMPLATE PARENT                   */
set ContOrdInstance_ind          = 0                   /* DEFINES A TEMPLATE INSTANCE                 */
;006
declare iContTaskInstance_ind    = i2 with public,noconstant(0) ;DEFINES A TASK BASED INSTANCE ORDER
declare iContRxInstance_ind      = i2 with public,noconstant(0) ;DEFINES A RX BASED INSTANCE ORDER
declare iContFutureRecTemp_ind   = i2 with public,noconstant(0) ;DEFINES A FUTURE RECURRING TEMPLATE ORDER
declare iContFutureRecInst_ind   = i2 with public,noconstant(0) ;DEFINES A FUTURE RECURRING INSTANCE ORDER
 
 
;006 ORIG_ORD_AS_FLAG ENCODING -- NOTE:  ONLY ONE MEANING CAN BE DEFINED
 
declare iOrgOrdAsNormal     = i2 with public,noconstant(0) ;DEFINES A NORMAL ORDER
declare iOrgOrdAsPresDisc   = i2 with public,noconstant(0) ;DEFINES A PRESCRIPTION/DISCHARGE
declare iOrgOrdAsRecHome    = i2 with public,noconstant(0) ;DEFINES A RECORDED/HOME MEDS
declare iOrgOrdAsPatMed     = i2 with public,noconstant(0) ;DEFINES A PATIENT'S OWN MEDS
declare iOrgOrdAsPhmChg     = i2 with public,noconstant(0) ;DEFINES A PHARMACY CHARGE ONLY
declare iOrgOrdAsSuperBill  = i2 with public,noconstant(0) ;DEFINES A SATELLITE/SUPERBILL
 
;006 AD_HOC_ORDER_FLAG ENCODING -- NOTE:  ONLY ONE MEANING CAN BE DEFINED
declare iAdHocOrderFlag     = i2 with public,noconstant(0) ;DEFINES AD HOC ORDERS
 
;006 ADDITIVE FREQUENCY ENCODING
declare iAdditiveFreqInd    = i2 with public,noconstant(0) ;DEFINES AN ADDITIVE FREQUENCY ORDER
 
if ( validate ( reply -> iVersionNbr ) ) ;;007
   set reply -> iVersionNbr = 2 /* DO NOT CHANGE THIS VERSION NBR. ENGINEERING ONLY */ ;;007
endif
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 3.
 
DECODE THE CS_FLAG INTO INDICATOR VARIABLES
 
Here is the enumeration definition for the CS_FLAG:
   eCSNone   = 0,
   eCSParent = 1,
   eCSChild  = 2,
   eCSSGParent = 4,
   eCSSGChild  = 8,
   eCSCPParent = 16,
   eCSCPChild  = 32
 
When using the BTEST function, bit numbering starts at 0
 
----------------------------------------------------------------------------------------
***************************************************************************************/
 
if( request->cs_flag = 0)
  set CSNone_ind     = 1
endif
set CSParent_ind   = BTEST(request->cs_flag,0)
set CSChild_ind    = BTEST(request->cs_flag,1)
set CSSGParent_ind = BTEST(request->cs_flag,2)
set CSSGChild_ind  = BTEST(request->cs_flag,3)
set CSCPParent_ind = BTEST(request->cs_flag,4)
set CSCPChild_ind  = BTEST(request->cs_flag,5)
 
 
/**************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 4.
 
DECODE THE ORDERABLE_TYPE_FLAG INTO INDICATOR VARIABLES
 
Here is the enumeration definition for the ORDERABLE_TYPE_FLAG
   eOrdNone   = 0,
   eOrdTypeNormal = 1,
   eOrdTypeSuperGroup = 2,
   eOrdTypeCarePlan = 3,
   eOrdTypeAPSpecial = 4,
   eOrdTypeDeptOnly = 5,
   eOrdTypeCareSet = 6,
   eOrdTypeIntervalTest = 9
 
----------------------------------------------------------------------------------------
***************************************************************************************/
 
if(request->orderable_type_flag = 0)
   set OrdNone_ind             = 1
endif
if (request->orderable_type_flag = 1)
   set OrdTypeNormal_ind       = 1
endif
if(request->orderable_type_flag = 2)
   set OrdTypeSuperGroup_ind   = 1
endif
if(request->orderable_type_flag = 3)
   set OrdTypeCarePlan_ind     = 1
endif
if(request->orderable_type_flag = 4)
   set OrdTypeAPSpecial_ind    = 1
endif
if(request->orderable_type_flag = 5)
   set OrdTypeDeptOnly_ind     = 1
endif
if(request->orderable_type_flag = 6)
   set OrdTypeCareSet_ind      = 1
endif
if (request->orderable_type_flag = 9)
  set OrdTypeIntervalTest_ind = 1
endif
 
 
/***************************************************************************************
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 5.
 
DECODE THE ORDER_TEMPLATE_FLAG INTO INDICATOR VARIABLES:
 
Here is the enumeration definition for the ORDER_TEMPLATE_FLAG:
   eContOrdNone   = 0,   --  not part of cont order
   eContOrdTemplate = 1, -- parent
   eContOrdInstance = 2  -- instance
 
----------------------------------------------------------------------------------------
***************************************************************************************/
 
if(request->order_template_flag = 0)
   set ContOrdNone_ind     = 1
endif
if(request->order_template_flag = 1)
   set ContOrdTemplate_ind = 1
endif
if(request->order_template_flag = 2)
   set ContOrdInstance_ind = 1
endif
 
;006 begin
if(request->order_template_flag = 3)
   set iContTaskInstance_ind = 1
endif
if(request->order_template_flag = 4)
   set iContRxInstance_ind = 1
endif
if(request->order_template_flag = 5)
   set iContFutureRecTemp_ind = 1
endif
if(request->order_template_flag = 6)
   set iContFutureRecInst_ind = 1
endif
 
;***************************************************************************************
;+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
;SECTION 6.
 
;DECODE THE ORIG_ORD_AS_FLAG AND AD_HOC_ORDER_FLAG INTO INDICATOR VARIABLES:
 
;Here is the enumeration definition for the ORDER_TEMPLATE_FLAG:
;   iOrgOrdAsNormal     = 0, -- DEFINES A NORMAL ORDER
;   iOrgOrdAsPresDisc   = 1, -- DEFINES A PRESCRIPTION/DISCHARGE
;   iOrgOrdAsRecHome    = 2  -- DEFINES A RECORDED/HOME MEDS
;   iOrgOrdAsPatMed     = 3  -- DEFINES A PATIENT'S OWN MEDS
;   iOrgOrdAsPhmChg     = 4  -- DEFINES A PHARMACY CHARGE ONLY
;   iOrgOrdAsSuperBill  = 5  -- DEFINES A SATELLITE/SUPERBILL
 
;   iAdHocOrderFlag     = 1  -- DEFINES AD HOC ORDERS
;----------------------------------------------------------------------------------------
;****************************************************************************************
 
if(validate(request->orig_ord_as_flag, 999) != 999)
 
    ;ORIG_ORD_AS_FLAG
    if(request->orig_ord_as_flag = 0)
       set iOrgOrdAsNormal = 1
    endif
    if(request->orig_ord_as_flag = 1)
       set iOrgOrdAsPresDisc = 1
    endif
    if(request->orig_ord_as_flag = 2)
       set iOrgOrdAsRecHome = 1
    endif
    if(request->orig_ord_as_flag = 3)
       set iOrgOrdAsPatMed = 1
    endif
    if(request->orig_ord_as_flag = 4)
       set iOrgOrdAsPhmChg = 1
    endif
    if(request->orig_ord_as_flag = 5)
       set iOrgOrdAsSuperBill = 1
    endif
endif
 
if(validate(request->ad_hoc_order_flag, 999) != 999)
 
    ;AD HOC
    if(request->ad_hoc_order_flag = 1)
       set iAdHocOrderFlag = 1
    endif
 
endif
 
;;007+
 
if ( validate ( reply -> iAlt_IV_ind, 999) != 999 )
 
    if ( reply -> iAlt_IV_ind > 0 )
 
        call echo( "This is an alternating IV order" )
        set iAdditiveFreqInd = 1
 
    endif
 
else
 
;;007-
 
    if(validate(request->activity_type_mean, "9999999999") != "9999999999")
 
        if ( request->activity_type_mean = "PHARMACY"  )
         free set detail_found
         set detail_found = 0
 
         free set i
         set i = 0
 
         free set detail_list_size
         set detail_list_size = size( request->detailList , 5 )
 
         for ( i = 1 to detail_list_size )
 
              if ( request->detailList[ i ]->oeFieldMeaningId = 2080 )
 
                   set detail_found = 1
 
                   if ( request->detailList[ i ]->oeFieldValue > 0 )
 
                        set iAdditiveFreqInd = 1
 
                   endif
 
              endif
 
         endfor
 
         if ( detail_found = 1 )
 
              call echo( "NBROFBAGS detail found in detaillist" )
 
         else
 
              free set highest_verified_action
              set highest_verified_action = 0
 
              select into "nl:"
 
                   oac.order_id ,
                   oac.action_sequence ,
                   oac.needs_verify_ind
 
              from order_action oac
 
              where ( ( oac.order_id = request->order_id ) and
                      ( oac.action_sequence < request->action_sequence ) and
                      ( oac.needs_verify_ind in ( 0 , 3 ) ) )
 
              order action_sequence desc
 
              detail
 
                   highest_verified_action = oac.action_sequence
 
              with maxqual( oac , 1 )
 
              if ( highest_verified_action > 0 )
 
                   free set highest_action
                   set highest_action = 0
 
                   select into "nl:"
 
                        oac.order_id ,
                        oac.action_sequence ,
                        oac.needs_verify_ind ,
                        od.order_id ,
                        od.action_sequence ,
                        od.oe_field_meaning_id ,
                        od.oe_field_value
 
                   from
 
                        order_action oac ,
                        order_detail od
 
                   plan oac where ( ( oac.order_id = request->order_id ) and
                                    ( oac.action_sequence <= highest_verified_action ) and
                                    ( oac.needs_verify_ind in ( 0 , 2 , 3 , 5 ) ) )
 
                   join od where ( ( od.order_id = oac.order_id ) and
                                   ( od.action_sequence = oac.action_sequence ) and
                                   ( od.oe_field_meaning_id = 2080 ) )
 
                   order oac.action_sequence desc
 
                   head report
 
                        highest_action = 1
 
                   detail
 
                        detail_found = 1
 
                        if ( highest_action )
 
                             if ( od.oe_field_value > 0 )
 
                                  iAdditiveFreqInd = 1
 
                             endif
 
                        endif
 
                   foot oac.action_sequence
 
                        highest_action = 0
 
                   with nocounter
 
              endif
 
              if ( detail_found = 1 )
 
                   call echo( "NBROFBAGS detail found on ORDER_DETAIL table" )
 
              endif
 
        endif
 
    endif
endif
;006 end
 
endif;;if ( validate ( reply -> iAlt_IV_ind, 999) != 999 ) ;;007
/****************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 7.
 
PERFORM UAR CODE CALLS TO GET CDF_MEANING AND DISPLAY STRINGS FOR CODE_VALUE PARAMETERS
 
------------------------------------------------------------------------------------------
*****************************************************************************************/
 
set activity_type_cdm           = uar_get_code_meaning(request->activity_type_cd)
set action_type_cdm             = uar_get_code_meaning(request->action_type_cd)
set order_status_cdm            = uar_get_code_meaning(request->order_status_cd)
set dept_order_status_cdm       = uar_get_code_meaning(request->dept_order_status_cd)
 
set from_contributor_system_disp = uar_get_code_display(request->from_contributor_system_cd)
set to_contributor_system_disp   = uar_get_code_display(request->to_contributor_system_cd)
set order_contrib_sys_disp       = uar_get_code_display(request->order_contrib_sys_cd)
set action_contrib_sys_disp      = uar_get_code_display(request->action_contrib_sys_cd)
 
;;;;;010
;declare bayc_org_name_key = vc
;select into "nl:"
 ;o.org_name_key
;from organization o
;where o.organization_id=request->organiztion_id
;and o.active_ind=1
;detail
 ;bayc_org_name_key=o.org_name_key
;with nocounter
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 8.
 
PERFORM CALL ECHO STATEMENTS FOR DEBUGGING
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
;set trace callecho
call echo("*** ESO_GET_ORDER_SELECTION *****************************")
call echo(concat("order_id = ",cnvtstring(request->order_id)))
call echo(concat("action_sequence = ",cnvtstring(request->action_sequence)))
call echo(concat("encntr_id = ",cnvtstring(request->encntr_id)))
call echo(concat("activity_type_cd = ",
                 cnvtstring(request->activity_type_cd),
                 " = ", activity_type_cdm))
call echo(concat("action_type_cd = ",
                 cnvtstring(request->action_type_cd),
                 " = ", action_type_cdm))
call echo(concat("from_contributor_system_cd = ",
                 cnvtstring(request->from_contributor_system_cd),
                 " = ", from_contributor_system_disp))
call echo(concat("to_contributor_system_cd = ",
                 cnvtstring(request->to_contributor_system_cd),
                 " = ", to_contributor_system_disp))
call echo(concat("order_status_cd = ",
                 cnvtstring(request->order_status_cd),
                 " = ", order_status_cdm))
call echo(concat("dept_order_status_cd = ",
                 cnvtstring(request->dept_order_status_cd),
                 " = ", dept_order_status_cdm))
call echo(concat("cs_flag = ",cnvtstring(request->cs_flag)))
     if( CSNone_ind > 0 )
        call echo("==> CSNone_ind SET, May be a simple orderable")
     endif
     if( CSParent_ind > 0 )
        call echo("==> CSParent_ind SET, CareSet Parent Orderable")
     endif
     if( CSChild_ind > 0 )
        call echo("==> CSChild_ind SET, CareSet Child Orderable")
     endif
     if( CSSGParent_ind > 0 )
        call echo("==> CSSGParent_ind SET, Super-Group Parent Orderable")
     endif
     if( CSSGChild_ind > 0 )
        call echo("==> CSSGChild_ind SET, Super-Group Child Orderable")
     endif
     if( CSCPParent_ind > 0 )
        call echo("==> CSSCP_ind SET, Care Plan Parant Orderable")
     endif
     if( CSCPChild_ind > 0 )
        call echo("==> CSSCPChild_ind SET, Care Plan Child Orderable")
     endif
 
call echo(concat("orderable_type_flag = ",cnvtstring(request->orderable_type_flag)))
     if( OrdNone_ind > 0 )
        call echo("==> OrdNone_ind SET, Maybe a simple or normal orderable")
     endif
     if( OrdTypeNormal_ind > 0 )
        call echo("==> OrdTypeNormal_ind SET, Normal Orderable Type")
     endif
     if( OrdTypeSuperGroup_ind > 0 )
        call echo("==> OrdTypeSuperGroup_ind SET, Super Group Orderable Type")
     endif
     if( OrdTypeCarePlan_ind > 0 )
        call echo("==> OrdTypeCarePlan_ind SET, Care Plan Orderable Type")
     endif
     if( OrdTypeAPSpecial_ind > 0 )
        call echo("==> OrdTypeAPSpecial_ind SET, AP Special Orderable Type")
     endif
     if( OrdTypeDeptOnly_ind > 0 )
        call echo("==> OrdTypeDeptOnly_ind SET, Dept Only Orderable Type")
     endif
     if( OrdTypeCareSet_ind > 0 )
        call echo("==> OrdTypeCareSet_ind SET, Care Set Orderable Type")
     endif
     if( OrdTypeIntervalTest_ind > 0 )
        call echo("==> OrdTypeIntervalTest_ind SET, Interval Test Orderable Type")
     endif
 
call echo(concat("order_template_flag = ",cnvtstring(request->order_template_flag)))
     if( ContOrdNone_ind     > 0 )
        call echo("==> ContOrdNone_ind SET, Not a Template Orderable" )
     endif
     if( ContOrdTemplate_ind > 0 )
        call echo("==> ContOrdTemplate_ind SET, Template Order Parent" )
     endif
     if( ContOrdInstance_ind > 0 )
        call echo("==> ContOrdInstance_ind SET, Template Order Based Instance" )
     endif
 
;006 begin
     if( iContTaskInstance_ind > 0 )
        call echo("==> iContTaskInstance_ind SET, Template Task Based Instance" )
     endif
     if( iContRxInstance_ind > 0 )
        call echo("==> iContRxInstance_ind SET, Template Rx Based Instance" )
     endif
     if( iContFutureRecTemp_ind > 0 )
        call echo("==> iContFutureRecTemp_ind SET, Template Future Recurring Template" )
     endif
     if( iContFutureRecInst_ind > 0 )
        call echo("==> iContFutureRecInst_ind SET, Template Future Recurring Instance" )
     endif
 
     if(validate(request->orig_ord_as_flag, 999) != 999)
 
         call echo(concat("orig_ord_as_flag = ",cnvtstring(request->orig_ord_as_flag)))
 
     endif
 
     if( iOrgOrdAsNormal > 0 )
        call echo("==> iOrgOrdAsNormal SET, Normal Order")
     endif
     if( iOrgOrdAsPresDisc > 0 )
        call echo("==> iOrgOrdAsPresDisc SET, Prescription/Discharge Order")
     endif
     if( iOrgOrdAsRecHome > 0 )
        call echo("==> iOrgOrdAsRecHome SET, Recorded/Home Med Order")
     endif
     if( iOrgOrdAsPatMed > 0 )
        call echo("==> iOrgOrdAsPatMed SET, Patient's Own Med Order")
     endif
     if( iOrgOrdAsPhmChg > 0 )
        call echo("==> iOrgOrdAsPhmChg SET, Pharmacy Charge Only Order")
     endif
     if( iOrgOrdAsSuperBill > 0 )
        call echo("==> iOrgOrdAsSuperBill SET, Satellite/SuperBill Order")
     endif
 
     if(validate(request->ad_hoc_order_flag, 999) != 999)
        call echo(concat("ad_hoc_order_flag = ",cnvtstring(request->ad_hoc_order_flag)))
     endif
 
     if( iAdHocOrderFlag > 0 )
        call echo("==> iAdHocOrderFlag SET, Ad Hoc Order")
     endif
 
     if( iAdditiveFreqInd > 0 )
        call echo("==> iAdditiveFreqInd SET, Additive Frequency Order")
     endif
;006 end
 
call echo(concat("failure_ind = ",cnvtstring(request->failure_ind)))
call echo(concat("order_contrib_sys_cd = ",
                 cnvtstring(request->order_contrib_sys_cd),
                 " = ", order_contrib_sys_disp))
call echo(concat("action_contrib_sys_cd = ",
                 cnvtstring(request->action_contrib_sys_cd),
                 " = ", action_contrib_sys_disp))
call echo(concat("order_control_disp = ",request->order_control_disp))
call echo(concat("bill_only_ind = ",cnvtstring(request->bill_only_ind)))
 
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 9.
 
DEFINE THE REPLY HANDLE
 
The reply->status_data->status should have the following values:
 
 "S" means that order event is not suppress and that the CQM Server should be sent the event
 "Z" means to suppress the order event and the CQM Server should not be contacted
 "F" means that the script actually failed for some unknown or critical reason
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
/* 004 */
 
if ( not validate( reply , 0 ) )
 
	record reply
	(
	/* %i cclsource:status_block.inc */
	  1 status_data
	    2 status = c1
	    2 subeventstatus[1]
	      3 OperationName = c25
	      3 OperationStatus = c1
	      3 TargetObjectName = c25
	      3 TargetObjectValue = vc
	)
 
	set reply->status_data->status = "S"
 
endif
 
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 10.
 
PERFORM ALL SITE SPECIFIC CUSTOM CODING HERE
 
Use basic if statements to check any variable condition to determime when to set the
reply->status_data->status variable to a "Z" (to suppress).  Since the
reply->status_data->status variable is default to "S", the order event is assumed to be
valid until a suppression condition below is encountered.
 
Use varibles defined in Sections 1 and 2 above in the if statements.  DO NOT use code_value
variables in the REQUEST record as it leads to a non-portable implementation between
environment.  Instead, use the CDF MEANING or DISPLAY variable declared in Section 2 and
values fetched in Section 6.
 
---------------------------------------------------------------------------------------------
********************************************************************************************/


;suppress obsolete order updates for encounters > 1 year old
declare obsolete = dq8
 
select
  e.disch_dt_tm
from
  encounter   e
where e.encntr_id = request->encntr_id
 
detail
  obsolete = e.disch_dt_tm
with nocounter
 
if (obsolete > 0)
  if(obsolete <= cnvtdatetime(curdate-365, curtime3))
    set reply->status_data->status = "Z"
    call echo(build("disch_date = ",obsolete))
    go to single_exit
  else
	set reply->status_data->status = "S"
  endif
endif
 

; Task Based Instance                                           ;;006
if (iContTaskInstance_ind)                                      ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Task Based Instance Orders SUPPRESSED")            ;;006
endif                                                           ;;006
 
; Rx Based Instance                                             ;;006
if (iContRxInstance_ind)                                        ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Rx Based Instance Orders SUPPRESSED")              ;;006
endif                                                           ;;006
 
; Future Recurring Template                                     ;;006
if (iContFutureRecTemp_ind)                                     ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Future Recurring Template Orders SUPPRESSED")      ;;006
endif                                                           ;;006
 
; Future Recurring Instance                                     ;;006
if (iContFutureRecInst_ind)                                     ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Future Recurring Instance Orders SUPPRESSED")      ;;006
endif                                                           ;;006
 
; Prescription/Discharge                                        ;;006
if (iOrgOrdAsPresDisc)                                          ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Prescription/Discharge Orders SUPPRESSED")         ;;006
endif                                                           ;;006
 
; Recorded/Home Med                                             ;;006
if (iOrgOrdAsRecHome)                                           ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Recorded/Home Med Orders SUPPRESSED")              ;;006
endif                                                           ;;006
 
; Patient's Own Med                                             ;;006
if (iOrgOrdAsPatMed)                                            ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Patient's Own Med Orders SUPPRESSED")              ;;006
endif                                                           ;;006
 
; Pharmacy Charge Only                                          ;;006
if (iOrgOrdAsPhmChg)                                            ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Pharmacy Charge Only Orders SUPPRESSED")           ;;006
endif                                                           ;;006
 
; Satellite/SuperBill                                           ;;006
if (iOrgOrdAsSuperBill)                                         ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Satellite/SuperBill Orders SUPPRESSED")            ;;006
endif                                                           ;;006
 
; Ad Hoc Order                                                  ;;006
if (iAdHocOrderFlag)                                            ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Ad Hoc Orders SUPPRESSED")                         ;;006
endif                                                           ;;006
 
; Additive Frequency Order                                      ;;006
if (iAdditiveFreqInd)                                           ;;006
  set reply->status_data->status = "Z"                          ;;006
  call echo("Additive Frequency Orders SUPPRESSED")             ;;006
endif                                                           ;;006
 
/*****LAB BEGIN*****/    										;;008
if (request->failure_ind > 0 )
  set reply->status_data->status = "Z"
  call echo("ESI failure")
endif
 
if (dept_order_status_cdm = "LABDISPATCH")
  if (action_type_cdm = "STATUSCHANGE")
    set reply->status_data->status = "Z"
    call echo("labdispatch/statuschange combo suppressed")
  endif
endif
 
if (not (order_status_cdm  in ("ORDERED" ,"CANCELED" ,"COMPLETED")))
  set reply->status_data->status = "Z"
  call echo("order status suppressed")
endif
 
if (not (dept_order_status_cdm  in ("LABCOLLECTED"
									, "LABINLAB"
									, "LABINPROCESS"
									, "LABPRELIM"
									, "CANCELED"
									, "COMPLETED"
									, "LABDISPATCH"
									, "LABFINAL"
									, "LABSTAIN"
									, "LABSUS"
									, "LABSCHEDULED")))
  set  reply->status_data->status = "Z"
  call echo("DEPT ORDER STATUS SUPPRESSED")
endif
 
if (order_status_cdm = "INPROCESS")
  if (dept_order_status_cdm in ("LABFINAL","LABPRELIM", "LABSTAIN" ,"LABSUS"))
    set  reply->status_data->status = "S"
    call echo("ORDER STATUS -> INPROCESS RELEASED")
  endif
endif
 
if (action_type_cdm in ("MODIFY","ADD ALIAS"))
  set reply->status_data->status = "Z"
  call echo("MODIFY AND ADD ALIAS ORDERS SUPPRESSED")
endif
 
if (action_type_cdm in ("ORDER","CANCEL"))
  if (action_contrib_sys_disp = "HealthSouth")
   set reply->status_data->status = "Z"
   call echo("New Order echos suppressed")
  endif
endif

if (dept_order_status_cdm = "INPATHOLOGY")
  if (activity_type_cdm = "AP")
    set reply->status_data->status = "S"
    call echo("AP ORDERS ARE NOT SUPPRESSED")
  endif
endif
 
 
if (action_type_cdm = "COMPLETE")
  if (activity_type_cdm = "AP")
   set reply->status_data->status = "S"
   call echo("AP COMPLETES ARE NOT SUPPRESSED")
  endif
endif
 
if (action_type_cdm = "CANCEL" and order_status_cdm = "CANCELED")
  set reply->status_data->status = "S"
  call echo("DUPLICATE CHECKING CANCEL SENT OUT")
endif
 
if (action_type_cdm = "ORDER" AND dept_order_status_cdm = "CANCELED")
  set reply->status_data->status = "Z"
  call echo("DUPLICATE CHECKING NEW ORDER SUPPRESSED")
endif
/*****LAB END*****/
 
/*****BEACON PHASE I BEGIN*****/				;008
if (activity_type_cdm = "PHARMACY")
  set reply->status_data->status = "S"
  call echo("RDE NOT SUPPRESSED")
endif
 
if (activity_type_cdm = "RULEORDERS")
  set reply->status_data->status = "S"
  call echo("RULE ORDERS UNSUPPRESSED")
endif
/*****BEACON PHASE I END*****/
 
/*****BEACON PHASE II BEGIN*****/				;008
if (activity_type_cdm = "DIETARY")
  set reply->status_data->status = "S"
  call echo("DIET ORDERS UNSUPPRESSED")
endif
 
if (activity_type_cdm = "TUBEFEEDING")
  set reply->status_data->status = "Z"
  call echo("DIET ORDERS SUPPRESSED")
endif
 
/*****EDUTAINMENT BEGIN*****/
 
if (activity_type_cdm in ("EDUTAINMENT","OFCVIDEOS"))
  if (dept_order_status_cdm in ("ORDERED","DISCONTINUED"))
    set reply->status_data->status = "S"
    call echo("INPROCESS RELEASED EDUCATION ORDER UNSUPPRESSED")
  endif
  
  if (dept_order_status_cdm = "COMPLETED")
    set reply->status_data->status = "Z"
  endif
endif
 
/*****EDUTAINMENT END*****/
 
if (activity_type_cdm in ("RADIOLOGY","MRIRADIOLOGY"))
  set reply->status_data->status = "S"
  call echo("RAD ORDERS UNSUPPRESSED")
endif
 
if (activity_type_cdm in ("RADIOLOGY","MRIRADIOLOGY"))
  if (action_type_cdm in ("STATUSCHANGE","MODIFY","COMPLETE"))
    if (action_contrib_sys_disp = "IDX")
      set reply->status_data->status = "Z"
      call echo("RAD status change echos suppressed")
    endif
  endif
endif
 
if (action_contrib_sys_disp = "IDX")
  if (activity_type_cdm in ("ECHO","PEDI ECHO"))
    set reply->status_data->status = "S"
    call echo("ECHO and PEDI ECHO ORDER UNSUPPRESSED")
  endif
endif
 
if (activity_type_cdm = "PHYSCONSULT")
  if (action_type_cdm in ("ORDER","CANCEL","DISCONTINUE","DELETE"))
    set reply->status_data->status = "S"
    call echo("PHYSICIAN CONSULT ORDER/CANCEL ORDER UNSUPPRESSED")
  endif
  
  if (action_type_cdm in ("COMPLETE","SUSPEND","STATUSCHANGE"))
    set reply->status_data->status = "Z"
  endif
endif
 
if (activity_type_cdm = "ADMITTO")
  if (action_type_cdm in ("ORDER","CANCEL","DISCONTINUE","DELETE"))
    set reply->status_data->status = "S"
    call echo ("Bed Status order/cancel order unsuppressed" )
  endif
  
  if (action_type_cdm in ("COMPLETE","SUSPEND","STATUSCHANGE"))
    set reply->status_data->status = "Z"
  endif
endif
 
 
if (activity_type_cdm in ("ECHO","PEDI ECHO","CARDIOVASCUL","CARDIOLOGY","EKG"))
  if (action_type_cdm in ("ORDER","CANCEL","DISCONTINUE","DELETE"))
    set reply->status_data->status = "S"
    call echo("Echo and Pedi Echo order/cancel orders unsuppressed")
  endif
  
  if (action_type_cdm in ("COMPLETE","SUSPEND","STATUSCHANGE"))
    set reply->status_data->status = "Z"
    call echo("Echo and Pedi Echo complete/sc orders unsuppressed")
  endif
endif
 
if (activity_type_cdm = "SURGERY")
  if (action_type_cdm in ("ORDER","CANCEL","ACTIVATE"))
    set reply->status_data->status = "S"
    call echo("Surgery ENDO order/cancel order unsuppressed")
  endif
  
  if (action_type_cdm in ("COMPLETE","DISCONTINUE","SUSPEND","DELETE"))
    set reply->status_data->status = "Z"
  endif
endif
 
if (action_type_cdm = "UNDO")
  set reply->status_data->status = "Z"
  call echo("UNDO order action suppressed")
endif
 
if (order_contrib_sys_disp in ("quest","QUESTAUTH"))
  set reply->status_data->status = "Z"
  call echo("Quest orders suppressed")
endif
 
/*****Bridge Breast Milk/Infant Feeding Orders w activity_type_cdm = "ASMTTXMONITO"*****/
if (activity_type_cdm  in ("PTCARE","ASMTTXMONITO","ACTIVITY","RTCARE","DIETCONSULTS", 
						   "SUPPORT SERV","THERAPEUTIC","CRITICALCARE","DIAGNOSTIC"))
  declare activity_subtype_cdm = vc

  select into "nl:"
    oc_activity_subtype_cdf = uar_get_code_meaning(oc.activity_subtype_cd)
  from
    orders   o
    , order_catalog   oc
  plan o 
    where o.order_id = request->order_id
  join oc 
    where o.catalog_cd = oc.catalog_cd
  detail
    activity_subtype_cdm = oc_activity_subtype_cdf
  with nocounter
 
  if (activity_subtype_cdm = "BRIDGE")
    set reply->status_data->status = "S"
    call echo("BREAST MILK/INFANT FEEDING ORDERS UNSUPPRESSED")
  else
    set reply->status_data->status = "Z"
    call echo("Activity/Diagnostic/etc Orders suppressed")
  endif
endif
 
if (activity_type_cdm in ("PALLIATIVE"))
  set reply->status_data->status = "S"
  call echo("PALLIATIVE ORDERS UNSUPPRESSED")
endif
 
if ( activity_type_cdm in ("SOIRADIOLOGY"))
  set reply->status_data->status = "S"
  call echo("PALLIATIVE ORDERS UNSUPPRESSED")
endif
 
if (activity_type_cdm in ("AUDIOLOGY"))
  set reply->status_data->status = "S"
  call echo("AUDIOLOGY ORDERS UNSUPPRESSED")
endif
 
if (activity_type_cdm in ("BAYESOSUPRES", "COMMUNICATIO"))
  declare  alias  =  vc
  declare con_source_display = f8
  set con_source_display = uar_get_code_by("DISPLAY",73,"Invision")
 
  select
    cvo.alias
  from
    code_value_outbound cvo
    , orders o
  plan o 
    where o.order_id = request->order_id
  join cvo 
    where cvo.code_value = o.catalog_cd
      and cvo.contributor_source_cd = con_source_display
  detail
    alias = trim (cvo.alias)
  with  nocounter
;using aliases from code set 200 - order catalog
  if (trim(alias) in ("Isolation", "Discharge Patient", "ADOD"))
    set reply->status_data->status = "S"
    call echo("Unsuppressing orderables to be sent to Teletracker")
  else
    set reply->status_data->status = "Z"
    call echo ( "BAYESOSUPRES/COMMUNICATIO Orders suppressed")
  endif
endif
 
/*****BEACON PHASE II END*****/
 
#single_exit
 
call echo(build("ORG_ID = ", request->organiztion_id))
call echo(concat("ESO_GET_ORDER_SELECTION STATUS = ",reply->status_data->status))
 
end
go