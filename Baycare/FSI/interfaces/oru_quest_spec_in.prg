/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name: oru_spec_mobj_in
 *  Description:  Reformats Incoming Results to Charted
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author: ko3600
 *  Domain: Build
 *  Creation Date:  10/28/2002 9:10:20 AM
 *  ---------------------------------------------------------------------------------------------
 */
/**********************************************************************************************
MOD      Date            Name        Comments
000     10/28/02        ko3600      Original Creation of Script.  This script is designed to 
                                    take incoming transactions from a Reference Lab and 
                                    modify the format from Discrete to Charted so that the data 
                                    will  post in the Flowsheet as needed.

v2      10/31/02        ko3600      Complete revamp on the code after speaking with Ken Koenig
                                    v2 will replace v1

v2.1    12/12/02        ko3600      Added "LAB" to all iterations of OBR 4.1 - Cerner

v3      12/13/02        ko3600      Client requested that NTE Comment Section be moved from 
                                    PowerChart type Comments (which must be clicked to view) to
                                    actually posting with the Actual Result.  In order to do
                                    this all NTE Segments must be moved from the NTE segment
                                    to the OBX Segment.  This coding is done due to the fact
                                    that the Vendor sending RLI type results sends the comments
                                    in the NTE segment which is standard HL7.  Cerner interprets
                                    the NTE segments as normal HL7 processing.  Client wishes
                                    functionality which is not part of Cerners Standard HL7
                                    Processing.
v3.1    2/27/03         ce4834   Need to add logic so OBX;3.2 (Procedure Description) is concatenated 
                                   onto each OBX;5 (Observation Value) on each OBX regardless if Units and Reference Ranges 
                                   are present.

v3.2    03/20/03       ko3600  corrected alterlisting of new res_group to match new number of OBX's per 
                                   ORC/OBR grouping

v3.3    04/09/03        ce4834  add abnormal flag into OBX;5 (result blob).  So there is now in OBX;5 (result blob) - 
                                     Test name (OBX;3), result value (OBX;5) and Units (OBX;6), Reference Range (OBX;7), 
                                     Abnormal Flag (OBX;8) if valued.
v3.4   06/17/03         ce4834   added values to populate the first iteration of the OBX segment 6 - 16 if valued.

v3.5   07/07/03         ce4834   Changed script to get results down to 1 OBX and not convert NTE's to OBX's.

** Note ** This script was designed specifically for BAYC_FL and is to be used on RLI inbound
           feeds only.

** WARNING **  Modifications made to this script without the express written consent of Cerner
               Corporation may be cause for additional fees for service.  Changes in Client
               Process, Workflow or Policy may warrant additional Fees for service to maintain
               or modify this code.  Changes to Governmental Processes, Regulations or Policy 
               may warrant additional Fees for service to maintain or modify this code.

Example of how the Data will be formatted:
Procedure Name: <OBX 4.2>
<OBX 3.2> <result value - OBX 5.1> <units - OBX 6.1 If Present> Ref Rng:<OBX 7.1 If Present> 

** Fields being sent inbound to Cerner which are not valued will be interpreted as Blanks.

**********************************************************************************************/

/*********          Error Management          **********

There has been no error management discussed with the client beyond the normal Cerner 
Processes which allow users to troubleshoot systems.
This interface script will not be responsible for any form of Error Notification beyond 
that which is already inherent in the Cerner Systems.

**********       End of Error Management     ***********/

/*********************** Variables and Constants Declaration  *****************************/

Free Set X             ;Numeric Value to be used in For Loops
Set X = 0
Free Set Y             ;Numeric Value to be used in For Loops
Set Y = 0
Free Set Z             ;Numeric Value to be used in For Loops
Set Z = 0
Free Set Wi            ;Numeric Value to be used in For Loops
Set Wi = 0
Free Set OBR_Cnt       ;Numeric Value which holds the total # of ORC/OBR Groupings
Set OBR_Cnt = size(oen_reply->RES_ORU_GROUP,5)
Free Set OBX_Cnt       ;Numeric Value which holds the total # of OBX Groupings
Free Set NTE_Cnt       ;Numeric Value which holds the total # of NTE Groupings


Free Set work          ;Record Structure used to manipulate the OBX into the required OBX's
record work
(
1 OBR [*]
 2 OBX [*]
  3 Obs_Id
   4 Id = vc
   4 Text = vc
   4 Coding_Sys = vc
  3 Value_1 = vc
  3 Units = vc
  3 Ref_Range = VC
  3 low = vc
  3 high = vc
  3 Abn_Flag = vc
  3 Obs_Res_Status = vc
  3 Obs_dt_tm = vc
  3 Proc_Id = vc
  3 Resp_Obs_Id_Nbr = vc
  3 NTE [*]
   4 Set_Id = vc
   4 Src_of_Com = vc
   4 Comment = vc
)

/**  TDB Structure being used OEOCFORUORU  **
oen_reply->RES_ORU_GROUP [1][1] 
oen_reply->RES_ORU_GROUP [1]->OBR->set_id 
oen_reply->RES_ORU_GROUP [1]->OBR->placer_ord_nbr->id 
oen_reply->RES_ORU_GROUP [1]->OBR->filler_ord_nbr->id
oen_reply->RES_ORU_GROUP [1]->OBR->univ_service_id->identifier 
oen_reply->RES_ORU_GROUP [1]->OBR->univ_service_id->text 
oen_reply->RES_ORU_GROUP [1]->OBR->univ_service_id->coding_system 
 
oen_reply->RES_ORU_GROUP [1]->OBR->priority 
oen_reply->RES_ORU_GROUP [1]->OBR->requested_dt_tm 
oen_reply->RES_ORU_GROUP [1]->OBR->specimen_act_cd 
oen_reply->RES_ORU_GROUP [1]->OBR->spec_rec_dt_tm 
oen_reply->RES_ORU_GROUP [1]->OBR->spec_source->spec_name_cd->identifier 
oen_reply->RES_ORU_GROUP [1]->OBR->spec_source->spec_name_cd->text 
oen_reply->RES_ORU_GROUP [1]->OBR->ord_provider->id_nbr 
oen_reply->RES_ORU_GROUP [1]->OBR->ord_provider->last_name 
oen_reply->RES_ORU_GROUP [1]->OBR->ord_provider->first_name 
oen_reply->RES_ORU_GROUP [1]->OBR->ord_provider->middle_name 

oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1][1] 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->set_id 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->value_type 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->observation_id->identifier 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->observation_id->text 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->observation_id->coding_system 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->observation_value [1]->value_1 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->units->identifier 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->ref_range->ref_range 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->ref_range->low 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->ref_range->high 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->abnormal_flag [1]->abnormal_flag 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->observation_res_status 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->observation_dt_tm 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->producers_id->identifier 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->respon_observer [1]->id_nbr 

oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->NTE [1][1] 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->NTE [1]->set_id 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->NTE [1]->src_of_comment 
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->NTE [1]->comment [1]->comment 
130*/

/********************** End of Variable & Constants Declaration  ***********************/

/*** Start of Code ***/
;EXECUTE OENCPM_MSGLOG("** Start of RLI_Trans_Formatter_v3 Script **")
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application =  "SPECIALTY"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility = "BAYCARE HEALTH"
;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application = "REFLAB"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility = "REFLAB"
;Load our Record Structure
Set Stat = Alterlist(work->OBR, OBR_Cnt)
;EXECUTE OENCPM_MSGLOG (Build("OBR_Cnt -->",OBR_Cnt))
For (X = 1 to OBR_Cnt)
   Set OBX_Cnt = (size(oen_reply->RES_ORU_GROUP[X]->OBX_GROUP, 5))
;EXECUTE OENCPM_MSGLOG (Build("OBX_Cnt -->",OBX_Cnt))
   Set Stat = Alterlist(work->OBR[X]->OBX, OBX_Cnt)
   Set Wi = 0
/**
;Populate the new First OBX
;EXECUTE OENCPM_MSGLOG ("Populating First New OBX")
;EXECUTE OENCPM_MSGLOG (Build("Current Value of X|Wi -->",X,"|", Wi))
   Set work->OBR[X]->OBX[Wi]->Obs_Id->Id = 
       oen_reply->RES_ORU_GROUP[X]->OBR->univ_service_id->identifier
   Set work->OBR[X]->OBX[Wi]->Obs_Id->Text = 
       oen_reply->RES_ORU_GROUP[X]->OBR->univ_service_id->text
   Set work->OBR[X]->OBX[Wi]->Obs_Id->Coding_Sys = 
       oen_reply->RES_ORU_GROUP[X]->OBR->univ_service_id->coding_system
   Set work->OBR[X]->OBX[Wi]->Value_1 =  
       oen_reply->RES_ORU_GROUP[X]->OBR->univ_service_id->text
;;;beginning of v3.4
     Set work->OBR[X]->OBX[Wi]->Obs_Res_Status =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->observation_res_status
      Set work->OBR[X]->OBX[Wi]->Obs_dt_tm =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->observation_dt_tm
     Set work->OBR[X]->OBX[Wi]->Proc_Id =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->producers_id->identifier
  If(oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->respon_observer[1]->id_nbr > " ")
      Set work->OBR[X]->OBX[Wi]->Resp_Obs_Id_Nbr =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->respon_observer[1]->id_nbr
  endif
;;;end of v3.4
**/

/***Loading OBX data into record structures***/
   For (Y = 1 to OBX_Cnt) 
      Set Wi = Wi + 1
      Set Stat = Alterlist(work->OBR[X]->OBX, Wi)
;EXECUTE OENCPM_MSGLOG ("Building off of the OBX")
;EXECUTE OENCPM_MSGLOG (Build("Current Value of X|Wi -->",X,"|", Wi))
      Set work->OBR[X]->OBX[Wi]->Obs_Id->Id = 
         oen_reply->RES_ORU_GROUP [X]->OBR->univ_service_id->identifier
      Set work->OBR[X]->OBX[Wi]->Obs_Id->Text =
          oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_id->text 
      Set work->OBR[X]->OBX[Wi]->Obs_Id->Coding_Sys = 
          oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_id->coding_system 
   If (oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_value[1]->value_1 > " ")
      Set work->OBR[X]->OBX[Wi]->Value_1 =
          concat (" ", oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_value[1]->value_1)
   else
       Set work->OBR[X]->OBX[Wi]->Value_1 = fillstring(5, " ")
   endif
   If (oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->units->identifier > " ")
      Set work->OBR[X]->OBX[Wi]->Units =
          oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->units->identifier
   Else
      Set work->OBR[X]->OBX[Wi]->Units = fillstring(5, " ")
   EndIf
   If (oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->ref_range->ref_range > " ")
       Set work->OBR[X]->OBX[Wi]->Ref_Range = 
          oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->ref_range->ref_range
   Else
        Set work->OBR[X]->OBX[Wi]->Ref_Range = fillstring(5, " ")
   EndIf
         Set work->OBR[X]->OBX[Wi]->Low =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->ref_range->low
         Set work->OBR[X]->OBX[Wi]->High =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->ref_range->high
         IF (oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->abnormal_flag[1]->abnormal_flag > " ")
         Set work->OBR[X]->OBX[Wi]->Abn_Flag =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->abnormal_flag[1]->abnormal_flag
         EndIf
         Set work->OBR[X]->OBX[Wi]->Obs_Res_Status =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_res_status
         Set work->OBR[X]->OBX[Wi]->Obs_dt_tm =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_dt_tm
         Set work->OBR[X]->OBX[Wi]->Proc_Id =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->producers_id->identifier
         If (oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->respon_observer[1]->id_nbr > " ")
         Set work->OBR[X]->OBX[Wi]->Resp_Obs_Id_Nbr =
             oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->respon_observer[1]->id_nbr 
         EndIf

/***Loading NTE data into record structures***/
         Set NTE_Cnt = size(oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->NTE, 5)
         Set Stat = Alterlist(work->OBR[X]->OBX[Y]->NTE, NTE_Cnt)
         For (Z = 1 to NTE_Cnt)
;EXECUTE OENCPM_MSGLOG ("Build off of the NTE")
;EXECUTE OENCPM_MSGLOG (Build("Current Value of X|Wi -->",X,"|", Wi))
            Set Wi = Wi + 1 
            Set Stat = Alterlist(work->OBR[X]->OBX, Wi)
            Set work->OBR[X]->OBX[Wi]->Obs_Id->Id = 
                oen_reply->RES_ORU_GROUP [X]->OBR->univ_service_id->identifier
            Set work->OBR[X]->OBX[Wi]->Obs_Id->Text =
               oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_id->text 
           ; Set work->OBR[X]->OBX[Wi]->Obs_Id->Coding_Sys = 
                ;oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y - 1]->OBX->observation_id->coding_system
            If (oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->NTE[Z]->comment[1]->comment > " ") 
            Set work->OBR[X]->OBX[Wi]->Value_1 =
                concat ("$", " ", oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->NTE[Z]->comment[1]->comment )
             else
                set work->OBR[X]->OBX[Wi]->Value_1 = fillstring(5, " ")
             Endif               
            ;If (oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y - 1]->OBX->units->identifier > " ")
               ;Set work->OBR[X]->OBX[Wi]->Units =
                  ; oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y - 1]->OBX->units->identifier
            ;Else
               ;Set work->OBR[X]->OBX[Wi]->Units = fillstring(5, " ")
           ;EndIf
           ;If (oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y - 1]->OBX->ref_range->ref_range > " ")
               ;Set work->OBR[X]->OBX[Wi]->Ref_Range = 
               ;oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y - 1]->OBX->ref_range->ref_range
             ;Else
               ;Set work->OBR[X]->OBX[Wi]->Ref_Range = fillstring(5, " ")
            ;EndIf
            ;Set work->OBR[X]->OBX[Wi]->Low =
                 ;oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y - 1]->OBX->ref_range->low
            ;Set work->OBR[X]->OBX[Wi]->High =
            ;     oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y - 1]->OBX->ref_range->high
            ;Set work->OBR[X]->OBX[Wi]->Abn_Flag =
            ;    cnvtstring(oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y - 1]->OBX->abnormal_flag[1]->abnormal_flag)
            Set work->OBR[X]->OBX[Wi]->Obs_Res_Status =
                oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_res_status
            Set work->OBR[X]->OBX[Wi]->Obs_dt_tm =
                oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_dt_tm
            Set work->OBR[X]->OBX[Wi]->Proc_Id =
                oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->producers_id->identifier
            If (oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->respon_observer[1]->id_nbr > " ")
            Set work->OBR[X]->OBX[Wi]->Resp_Obs_Id_Nbr =
                oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->respon_observer[1]->id_nbr
            EndIf

/***Do not need to populate NTE for viewability***/
;Populate the NTE anyway for viewability 
           ;Set work->OBR[X]->OBX[Y]->NTE[Z]->Src_of_Com =
                ;oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->NTE[Z]->src_of_comment
            ;Set work->OBR[X]->OBX[Y]->NTE[Z]->Comment = 
                ;oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->NTE[Z]->comment[1]->comment

       EndFor ;Z
   EndFor ;Y
EndFor ;X

/***Destroy OBX & NTE to make room for new format***/
For (X = 1 to OBR_Cnt)
;EXECUTE OENCPM_MSGLOG ("Destroying the OBX and NTE Segments")
   ;Set Stat = Alterlist(oen_reply->RES_ORU_GROUP[X]->OBX_GROUP, 0)
   For (Y = 1 to OBX_Cnt)
      Set Stat = Alterlist(oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y], 0)
   EndFor ;Y
EndFor ;X

/***Create new format and populate fields***/
For (X = 1 to OBR_Cnt)
EXECUTE OENCPM_MSGLOG ("Creating new Format and Populating Fields")
;v2.1
;Set oen_reply->RES_ORU_GROUP [X]->OBR->univ_service_id->identifier =   ;"LAB" 
 ;  work->OBR[X]->OBX[1]->Obs_Id->Id
Set oen_reply->RES_ORU_GROUP [X]->OBR->univ_service_id->coding_system = " "

;subroutine declarations
%i accession_rebuild.inc
;set OBR;19 to variable short_accn_num
  ;set short_accn_num = oen_reply->RES_ORU_GROUP[X]->OBR->placer_field2
   ;set short_accn_num = cnvtalphanum(short_accn_num)

;rebuild accession number and set to OBR;19
  ;set long_accn_num = accRebuild (short_accn_num)
  ;set oen_reply->RES_ORU_GROUP[X]->OBR->placer_field2 = long_accn_num
  ;Set oen_reply->RES_ORU_GROUP [X]->OBR->placer_field1 [1]->value = long_accn_num


;v3.2 The old line was    Set Stat = Alterlist(oen_reply->RES_ORU_GROUP[X]->OBX_GROUP, Wi)
;This only yielded the last value of Wi.
   Set Stat = Alterlist(oen_reply->RES_ORU_GROUP[X]->OBX_GROUP, size(work->obr[X]->obx, 5))

/****************************************Do not need to build 1st OBX seperately
   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->set_id = "1"
   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->value_type = "TX"
   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->observation_id->identifier = 
       work->OBR[X]->OBX[1]->Obs_Id->Id
   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->observation_id->text =
       work->OBR[X]->OBX[1]->Obs_Id->Text 
;   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->observation_id->coding_system =
;       work->OBR[X]->OBX[1]->Obs_Id->Coding_Sys
   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->observation_value[1]->value_1 = 
       work->OBR[X]->OBX[1]->Value_1
   Set oen_reply->RES_ORU_GROUP [X]->OBX_GROUP [1]->OBX->ref_range = " "

;v3.1  Added the following lines of code to allow the first OBX to post correctly ko3600 02/11/03
   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->observation_res_status = 
       work->OBR[X]->OBX[1]->Obs_Res_Status 
   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->observation_dt_tm =
       work->OBR[X]->OBX[1]->Obs_dt_tm
   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->producers_id->identifier =
       work->OBR[X]->OBX[1]->Proc_Id
   Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[1]->OBX->respon_observer[1]->id_nbr =
       work->OBR[X]->OBX[1]->Resp_Obs_Id_Nbr
   Set oen_reply->RES_ORU_GROUP [X]->OBX_GROUP [1]->OBX->observation_sub_id = "1"
*******************************************/

/***Creating new fields from data within record structure***/
;EXECUTE OENCPM_MSGLOG (Build("Rebuild - work->obr[x]->obx CNT ->",size(work->obr[X]->obx, 5)))
;v3.2 Modified the For loop to accurately reflect the total number of new OBX's per ORC/OBR Grouping 
  For (Y = 1  to size(work->obr[X]->obx , 5))
      Set oen_reply->RES_ORU_GROUP [X]->OBR->univ_service_id->identifier =   
        work->OBR[X]->OBX[Y]->Obs_Id->Id

;EXECUTE OENCPM_MSGLOG (Build("Rebuilding - Current Value of X|Wi|Y -->",X,"|", Wi, "|", Y))

      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->set_id = cnvtstring(Y)
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->value_type = "TX"
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_id->identifier = 
          work->OBR[X]->OBX[Y]->Obs_Id->Id
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_id->text =
          work->OBR[X]->OBX[Y]->Obs_Id->Text
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_id->coding_system = " "
;          work->OBR[X]->OBX[Y]->Obs_Id->Coding_Sys
      Set oen_reply->RES_ORU_GROUP [X]->OBX_GROUP [Y]->OBX->observation_sub_id = "1"
      Set oen_reply->RES_ORU_GROUP [X]->OBX_GROUP [Y]->OBX->ref_range = ""

/***Concatenate result value (OBX;5), units (OBX;6), ref range (OBX;7), abnormal flag (OBX;8) and put into OBX;5***/
      Free Set Text_Hold
      Free Set Text_Hold_1
      If (work->OBR[X]->OBX[Y]->Value_1 > " ") ;and (work->OBR[X]->OBX[Y]->Obs_Id->Text > " "))
                   If ((work->OBR[X]->OBX[Y]->Units>" ") and (work->OBR[X]->OBX[Y]->Ref_Range>" ") and 
                   (work->OBR[X]->OBX[Y]->Abn_Flag>" "))
                   Set Text_Hold_1 = concat(" ", work->OBR[X]->OBX[Y]->Obs_Id->Text, ":", " ",
                              work->OBR[X]->OBX[Y]->Value_1, " ", work->OBR[X]->OBX[Y]->Abn_Flag," ",
                              work->OBR[X]->OBX[Y]->Units, " ", "(Ref Rng: ",work->OBR[X]->OBX[Y]->Ref_Range,")")
                   ;EXECUTE OENCPM_MSGLOG(build("Text_Hold_1 = ", Text_Hold_1)) 
                   Free Set Text_Hold
                   Set Text_Hold = Text_Hold_1
         ElseIf ((work->OBR[X]->OBX[Y]->Units<=" ") and (work->OBR[X]->OBX[Y]->Ref_Range>" ") and 
                   (work->OBR[X]->OBX[Y]->Abn_Flag>" "))
                   Set Text_Hold_1 = concat(" ", work->OBR[X]->OBX[Y]->Obs_Id->Text, ":", " ",
                              work->OBR[X]->OBX[Y]->Value_1," ",
                              work->OBR[X]->OBX[Y]->Abn_Flag, " ", "(Ref Rng: ",work->OBR[X]->OBX[Y]->Ref_Range,")")
                    EXECUTE OENCPM_MSGLOG(build("Text_Hold_1 = ", Text_Hold_1))      
                   Free Set Text_Hold
                   Set Text_Hold = Text_Hold_1
          ElseIf ((work->OBR[X]->OBX[Y]->Units>" ") and (work->OBR[X]->OBX[Y]->Ref_Range<=" ")
                   and (work->OBR[X]->OBX[Y]->Abn_Flag>" "))
                   Set Text_Hold_1 = concat(" ", work->OBR[X]->OBX[Y]->Obs_Id->Text, ":", " ",
                       work->OBR[X]->OBX[Y]->Value_1, " ", work->OBR[X]->OBX[Y]->Abn_Flag, " ", work->OBR[X]->OBX[Y]->Units)
                    ;EXECUTE OENCPM_MSGLOG(build("Text_Hold_1 = ", Text_Hold_1)) 
                   Free Set Text_Hold
                   Set Text_Hold = Text_Hold_1
           ElseIf ((work->OBR[X]->OBX[Y]->Units>" ") and (work->OBR[X]->OBX[Y]->Ref_Range>" ")
                    and (work->OBR[X]->OBX[Y]->Abn_Flag<=" "))
                    Set Text_Hold_1 = concat(" ", work->OBR[X]->OBX[Y]->Obs_Id->Text, ":", " ",
                             work->OBR[X]->OBX[Y]->Value_1, " ",work->OBR[X]->OBX[Y]->Units, " ",  
                             "(Ref Rng: ",work->OBR[X]->OBX[Y]->Ref_Range,")" )
                    ;EXECUTE OENCPM_MSGLOG(build("Text_Hold_1 = ", Text_Hold_1)) 
                    Free Set Text_Hold
                   Set Text_Hold = Text_Hold_1
            ElseIf ((work->OBR[X]->OBX[Y]->Units<=" ") and (work->OBR[X]->OBX[Y]->Ref_Range<=" ")
                    and (work->OBR[X]->OBX[Y]->Abn_Flag>" "))
                   Set Text_Hold_1 = concat(" ", work->OBR[X]->OBX[Y]->Obs_Id->Text, ":", work->OBR[X]->OBX[Y]->Value_1, " ",
                            work->OBR[X]->OBX[Y]->Abn_Flag)
                   ;EXECUTE OENCPM_MSGLOG(build("Text_Hold_1 = ", Text_Hold_1)) 
                   Free Set Text_Hold
                   Set Text_Hold = Text_Hold_1
           ElseIf ((work->OBR[X]->OBX[Y]->Units>" ") and (work->OBR[X]->OBX[Y]->Ref_Range<=" ")
                    and (work->OBR[X]->OBX[Y]->Abn_Flag<=" "))
                   Set Text_Hold_1 = concat(" ", work->OBR[X]->OBX[Y]->Obs_Id->Text, ":", work->OBR[X]->OBX[Y]->Value_1, " ",
                           work->OBR[X]->OBX[Y]->Units )
                   ;EXECUTE OENCPM_MSGLOG(build("Text_Hold_1 = ", Text_Hold_1)) 
                   Free Set Text_Hold
                   Set Text_Hold = Text_Hold_1
          ElseIf ((work->OBR[X]->OBX[Y]->Units<=" ") and (work->OBR[X]->OBX[Y]->Ref_Range>" ")
                    and (work->OBR[X]->OBX[Y]->Abn_Flag<=" "))
                   Set Text_Hold_1 = concat(" ", work->OBR[X]->OBX[Y]->Obs_Id->Text, ":", work->OBR[X]->OBX[Y]->Value_1, " ",
                           "(Ref Rng: ",work->OBR[X]->OBX[Y]->Ref_Range,")" )
                   ;EXECUTE OENCPM_MSGLOG(build("Text_Hold_1 = ", Text_Hold_1)) 
                   Free Set Text_Hold
                   Set Text_Hold = Text_Hold_1
           Else ;((work->OBR[X]->OBX[Y]->Units<=" ") and (work->OBR[X]->OBX[Y]->Ref_Range<=" ")
                    ;and (work->OBR[X]->OBX[Y]->Abn_Flag<=" "))
                   free set nte_var
                   Set nte_var = findstring ("$",work->OBR[X]->OBX[Y]->Value_1,1)
                   If (nte_var >= 1)
                     free set nte_size
                     free set nte_hold
                     Set nte_size = size(work->OBR[X]->OBX[Y]->Value_1)
                     Set nte_hold=substring(2, nte_size - 1,work->OBR[X]->OBX[Y]->Value_1)
                     Set Text_Hold_1 = concat (" ", nte_hold)
                   else
                      Set Text_Hold_1 = concat(" ",work->OBR[X]->OBX[Y]->Obs_Id->Text, ":", work->OBR[X]->OBX[Y]->Value_1)
                      ;EXECUTE OENCPM_MSGLOG(build("Text_Hold_1 = ", Text_Hold_1))
                    endif 
                       Free Set Text_Hold
                       Set Text_Hold = Text_Hold_1        
           EndIf
      ElseIf (work->OBR[X]->OBX[Y]->Value_1 <= " ")
             Set Text_Hold = fillstring (5, " ")
      EndIf

      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_value[1]->value_1 = 
          Text_Hold

/***Remove units, ref range, high/low and abn flag since it was concatenated into the result (OBX;5)***/
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->units->identifier = " "
          ;work->OBR[X]->OBX[Y]->Units
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->ref_range->ref_range = " "
          ;work->OBR[X]->OBX[Y]->Ref_Range
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->ref_range->low = " "
          ;work->OBR[X]->OBX[Y]->Low
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->ref_range->high =  " "
          ;work->OBR[X]->OBX[Y]->High
     Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->abnormal_flag[1]->abnormal_flag = " "
          ;work->OBR[X]->OBX[Y]->Abn_Flag

      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_res_status = 
             work->OBR[X]->OBX[Y]->Obs_Res_Status 
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->observation_dt_tm =
             work->OBR[X]->OBX[Y]->Obs_dt_tm
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->producers_id->identifier =
             work->OBR[X]->OBX[Y]->Proc_Id
      Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->OBX->respon_observer[1]->id_nbr =
             work->OBR[X]->OBX[Y]->Resp_Obs_Id_Nbr

      ;Set NTE_Cnt = size(work->OBR[X]->OBX[Y]->NTE, 5)
      ;Set Stat = Alterlist(oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->NTE, NTE_Cnt)
      ;For (Z = 1 to NTE_Cnt)
         ;Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->NTE[Z]->set_id = cnvtstring(Z)
         ;Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->NTE[Z]->src_of_comment =
             ;work->OBR[X]->OBX[Y]->NTE[Z]->Src_of_Com
         ;Set oen_reply->RES_ORU_GROUP[X]->OBX_GROUP[Y]->NTE[Z]->comment[1]->comment =
             ;work->OBR[X]->OBX[Y]->NTE[Z]->Comment
      ;EndFor ;Z
   EndFor ;Y
EndFor ;X
;EXECUTE OENCPM_MSGLOG("** End of RLI_Trans_Formatter_v3 Script **")