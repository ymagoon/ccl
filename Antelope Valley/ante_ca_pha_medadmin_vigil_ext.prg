/*~BB~*******************************************************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-2011 Cerner Corporation                 *
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
  ~BE~******************************************************************************************************************/
 
/************************************************************************************************************************
        Current file name:      ante_ca_pha_medadmin_vigil_ext.prg
        Current object name:    ante_ca_pha_medadmin_vigil_ext
        Baseline file name:     stvn_nm_med_admin_midas_ext.prg
        Baseline Object name:   stvn_nm_med_admin_midas_ext
        Product:                Centers Custom Programming Services
        Product Team:           Centers Custom Programming Services
        Program purpose:        To extract all the medication that was administered in the past 30 mins
        Executing from:         Operations
        NOTE:
*/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     000 08/28/15 TD020616               CCPS-5945 Extract to Midas
;     001 07/03/18 LV028574               CCPS-13559: Med administration extract to
;                                         Vigilanz 3rd party system.123
;     002 10/15/18 LV028574               Changing filename
;~DE~*******************************************************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ***************************************************************
drop program ante_ca_pha_medadmin_vigil_ext:dba go
create program ante_ca_pha_medadmin_vigil_ext:dba
prompt
	"Output to File/Printer/MINE" = "MINE"
 
with OUTDEV;, BEGIN_DT_TM, ENDING_DT_TM
 
 
;Include
;--------------------------------------------------------------------------------------------------------------------------
call echo("test2")
/****************************************************************************************
* DVDev INCLUDE FILES
*****************************************************************************************/
%i ccluserdir:ccps_ld_security.inc
%i ccluserdir:ccps_org_security.inc
%i ccluserdir:ccps_script_logging.inc
%i ccluserdir:sc_cps_get_prompt_list.inc
%i ccluserdir:sc_cps_parse_date_subs.inc
%i ccluserdir:ante_ca_outbound_alias.inc
 
/*******************************************************************************************
* Recordstructures declaration section
/*******************************************************************************************/
free record med_admin_data
record med_admin_data
(
    1 cnt                           = i4
    1 ord_list[*]
        2 message_timestamp         = vc
        2 message_type              = vc
        2 loc_fac                   = vc ;sending_facility
        2 fin                       = vc
        2 mrn                       = vc
        2 person_lastname           = vc
        2 person_firstname          = vc
        2 person_middlename         = vc
        2 date_of_birth             = dq8
        2 birth_tz                  = i4
        2 gender                    = vc
        2 encntr_type_class         = c1 ;Patient Class
        2 order_id                  = f8
        2 parent_order_ident        = f8
        2 GiveSubIDCounter          = f8 ;Unique identifier for the event
        2 admin_dt_tm               = vc ;Adminitration_Date_Time
        2 admin_dosage              = vc ;Dose administered
        2 admin_dosage_unit         = vc ;Units administered
        2 admin_strength            = vc
        2 admin_strength_unit       = vc
        2 admin_route               = vc ;IV PiggyBack vs Oral
        2 admin_loc                 = vc ;Administered Location - Nurse unit
        2 admin_note                = vc ;Administration Note
        2 ord_mnemonic              = vc ;Drug Description
        2 ord_phys                  = vc ;Ordering Physician
        2 result_status				      = vc
        2 result_status_cd          = f8
        2 transaction_type          = vc ;Administered vs Refused
        2 reason_not_given          = vc ;Comments
        2 ndc_type                  = vc ;identify where the ndc came from(SCANNED,PRIMARY,ORDER_DETAIL)
        2 ndc                       = vc ;
        2 ndc_flag                  = i2
        2 clinical_event_id         = f8
        2 clinical_event_id_vc      = vc
        2 clinical_seq              = vc ;40
        2 event_cd                  = f8
        2 performed_prsnl_id        = f8
        2 performed_dt_tm           = vc
        2 parent_event_id           = f8
 
        2 template_order_id			    = f8
        2 template_order_flag		    = i2
        2 ord_prod_id				        = f8
        2 action_sequence           = i4 ;main query
        2 person_id                 = f8 ;q2
        2 encntr_id                 = f8 ;q2
        2 fin_class_cd              = f8 ;q2
        2 item_id                   = f8 ;main query
        2 item_id_flag 			 	      = i2
 
        2 ord_strength              = vc ;main query
        2 ord_s_unit                = vc ;main query
        2 ord_strength_flag         = i2
        2 ord_strength_populated    = vc
        2 dose_qty                  = vc ;q4
        2 dose_qty_unit             = vc ;q4
        2 dose_qty_populated        = vc
        2 ord_volume                = vc ;main query
        2 ord_vol_unit              = vc ;main query
        2 ord_vol_flag              = i2
        2 ord_vol_populated         = vc
        2 cdm                       = vc ;q3
        2 drug_form                 = vc ;q5
 
        2 inpt_flag                 = i4 ;q2
        2 trans_id                  = vc ;main query
        2 event_id                  = f8
        2 synonym_id                = f8
        2 default_dose_flag         = i2
        2 order_ingre_last_action_seq
                                    = i4
        2 order_ingre_ind           = i2
        2 ingred_cnt                = i4
        2 ingred_qual_cnt           = i4
        2 ingred_qual[*]
          3 i_event_id              = f8
          3 component_type          = vc
          3 catalog_cd              = vc ;ndc
          3 catalog_disp            = vc
          3 volume                  = vc
          3 volume_units            = vc
          3 strength                = vc
          3 strength_units          = vc
          3 synonym_id              = f8
        2 event_end_dt_tm			      = dq8
        2 rec_identifier			      = vc
        2 facility					        = vc
        ;2 task_cont					        = f8
        2 infuse_rate				        = vc
        2 infuse_cd					        = vc
        2 iv_ind					          = i2
)
 
free record frec_hl7
record frec_hl7(
      1 file_desc            = i4
      1 file_name            = vc
      1 file_buf             = vc
      1 file_dir             = i4
      1 file_offset          = i4
)
 
record msh(
    1 field[22]
        2 txt = vc
)
 
record pid(
    1 field[19]
        2 txt = vc
)
 
record orc(
    1 field[19]
        2 txt = vc
)
 
record rxa(
    1 field[26]
        2 txt = vc
)
 
record rxc(
    1 field[6]
        2 txt = vc
)
 
record rxr(
    1 field[1]
        2 txt = vc
)
 
;++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
;++ Declaration of subroutines                                                                       ++
;++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
declare BuildMSH(o_pos = i4)                        = vc
declare BuildPID(set_id = i4, o_pos = i4)           = vc
declare BuildORC(o_pos = i4)                        = vc
declare BuildRXA(o_pos = i4, admin_dose = vc, admin_dose_unit = vc) = vc
declare BuildRXC(o_pos = i4, a_pos = i4)            = vc
declare BuildRXR(o_pos = i4)                        = vc
declare FormatSegment(unformatted = vc)             = vc
declare FormatField(unformatted = vc)               = vc
;declare DisplayFileData(cnt = i4, extract_filename = vc)= null
declare GetFileName(file_dir =vc, sub_dir =vc, file_mnemonic=vc, ce_id_vc = vc, file_ext=vc) = vc
 
/************************************************************************************************************
	 TOTAL_PATH_SAMPLE         = DIR_LOG/CONCAT(FILE_MNEMONIC+FILE_EXT)
*************************************************************************************************************/
; DIRECTORY TO LAND THE FILES IN
;declare output_file::dir_log	      = vc  with protect, constant(value(trim(logical("cer_temp"))))
declare output_file::dir_log	      = vc  with protect, constant(value(trim(logical("cust_wh"))))
declare output_file::sub_dir	      = vc  with protect, constant(value(trim("ccluserdir")))
declare output_file::file_mnemonic	= vc  with protect, noconstant("ante_ca_pha_ma_vigil")
declare output_file::file_output    = i2  with protect, noconstant(0)
declare output_file::file_ext		    = c4  with protect, constant(".txt")
 
/*********************************************************************************************************
; Declaration of Constants - codevalues
*********************************************************************************************************/
declare 319_FIN_EA_TYPE_CD          = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!2930")),     protect
declare 319_MRN_EA_TYPE_CD          = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!8021")),     protect
declare 11000_CDM_cd                = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!3304")),     protect
declare 11000_NDC_cd                = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!3295")),     protect
declare 11000_RXMISC1_cd            = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!2160033")),  protect
declare 53_immu_event_class_cd      = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!7991")),     protect
declare 53_med_event_class_cd       = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!2699")),     protect
declare 54_volume_ml_result_units   = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!3780")),     protect
declare 54_strength_mg_result_units = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!2749")),     protect
declare 4500_inp_pharm_type_cd      = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!101131")),   protect
declare 4063_MEDPRODUCT  			      = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!2553258")),  protect
 
;result status (clinical Event)
declare 8_auth_result_status_cd 	  = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!2628")),     protect
declare 8_modified_result_status_cd = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!2636")),     protect
declare 8_altered_result_status_cd  = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!16901")),    protect
declare 8_inerror_result_status_cd  = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!7982")),     protect
declare 8_notdone_result_status_cd  = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!2631")),     protect
 
;order_detail (oe_field_id)
declare 16449_drugform              =  f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!1301440")), protect
declare 16449_strengthdose          =  f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!1301457")), protect
declare 16449_strengthdose_unit     =  f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!1301458")), protect
declare 16449_volumedose            =  f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!1301459")), protect
declare 16449_volumedose_unit       =  f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!1301460")), protect
declare 16449_ndc_cdm               =  f8 with constant(uar_get_code_by("DISPLAYKEY",16449,"NDCCDM")), protect
declare 16449_dose_quantity         =  f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!1301534")), protect
declare 16449_dose_quantity_unit    =  f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!1301535")), protect
declare 16449_rate                  =  f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!1301450")), protect
declare 16449_rate_unit             =  f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!1301530")), protect
 
;IV Types
declare 180_begin_bag_iv_event_cd   = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!31642")),    protect
declare 180_bolus_iv_event_cd       = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!31648")),    protect
 
;Pharmacy orders
declare 6000_PHARMACY_VAR           = f8 with Constant(uar_get_code_by_cki("CKI.CODEVALUE!3079")),     protect
declare 180_IVWASTEVAR              = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!31649")),    protect
declare 69_INPT_ENCNTR_CLASS_CD     = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!17006")),    protect
declare 69_EMER_ENCNTR_CLASS_CD     = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!17005")),    protect
declare 69_OTPT_ENCNTR_CLASS_CD     = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!17007")),    protect
 
;No CKI found
declare 73_ESO_STD_CD               = f8 with constant(uar_get_code_by("DISPLAYKEY",73,"ESOSTANDARD")), protect
/**************************************************************
; Misc Variables
**************************************************************/
declare num                        = i4  with noconstant(0),   protect
declare cnt                        = i4  with noconstant(0),   protect
declare i_cnt                      = i4  with noconstant(0),   protect
declare index                      = i4  with noconstant(0),   protect
declare loc_index                  = i4  with noconstant(0),   protect
declare pos                        = i4  with noconstant(0),   protect
declare cdm                        = vc  with noconstant(" "), protect
declare ndc                        = vc  with noconstant(" "), protect
declare drug_form 			           = vc  with noconstant(""),  protect
declare ord_strength 		           = vc  with noconstant(""),  protect
declare ord_vol 			             = vc  with noconstant(""),  protect
declare dose_qty			             = vc  with noconstant(""),  protect
declare dose_qty_unit      	       = vc  with noconstant(""),  protect
declare ord_strength_unit 	       = vc  with noconstant(""),  protect
declare ord_vol_unit 		           = vc  with noconstant(""),  protect
declare rate				               = vc  with noconstant(""),  protect
declare rate_unit			             = vc  with noconstant(""),  protect
declare order_mnemonic             = vc  with noconstant(""),  protect
declare ndc_cdm				             = vc  with noconstant(""),  protect
declare ndc_length_11		           = i4  with constant(11),    protect
declare admin_dosage               = vc  with noconstant(""),  protect
declare admin_dosage_unit          = vc  with noconstant(""),  protect
declare default_dose_qty           = vc  with constant("1"),   protect
declare default_dose_qty_uncharted
                                   = vc  with constant("-1"),  protect
;if (ISOPSJOB) else
;declare BEG_DT_TM                  = dq8 with constant(ParseDatePrompt($BEGIN_DT_TM,  CURDATE, (CURTIME - 30) )),protect
;declare END_DT_TM                  = dq8 with constant(ParseDatePrompt($ENDING_DT_TM, CURDATE, CURTIME )),protect
declare DATE_FORMAT_FILE           = vc  with constant("MMDDYYYY;;d"),                                    protect
;declare FILE_BEG_DT                = vc  with noconstant(format(BEG_DT_TM, DATE_FORMAT_FILE)),            protect
;declare FILE_END_DT                = vc  with noconstant(format(END_DT_TM, DATE_FORMAT_FILE)),            protect
 
declare non_iv_orders_iv_event_cd
                                   = f8  with constant(0.0),                                               protect
declare dose 				               = vc  with noconstant(""),                                              protect
declare IVPARVAR			             = vc  with constant("IVPARENT"),                                        protect
declare CHILDVAR		               = f8  with constant(132.00),                                            protect
declare codeset                    = vc  with noconstant("69,220,57"),                                     protect
declare return_value               = f8  with noconstant(populateOutbound_Alias(73_ESO_STD_CD ,codeset)),  protect
 
declare UNDERSCORE                 = c1  with constant("_"),                                               protect
declare ORG_PARSER                 = vc  with constant(GetPrsnlOrgExpand(reqinfo->updt_id,"be.organization_id")),protect
declare ACTIVE_IND_TRUE            = i4  with constant(1),                                                 protect
declare DATE_FORMAT                = vc  with constant("YYYYMMDDHHMM;;d"),                                 protect
declare DATE_FORMAT_DISPLAY        = vc  with constant("YYYY-MM-DD HH:MM;;q"),                             protect
 
declare F_SEPARATOR                = c1  with constant("|"),                                        protect ;field separator
declare C_SEPARATOR                = c1  with constant("^"),                                        protect ;component separator
declare S_SEPARATOR                = c1  with constant("&"),                                        protect ;subcomponent separator
declare R_SEPARATOR                = c1  with constant("~"),                                        protect ;repetition separator
declare E_CHARACTER                = c1  with constant("\"),                                        protect ;escape character
declare EMPTY                      = vc  with constant(" "),                                        protect
declare ENQ                        = c1  with constant(char(5)),                                    protect
declare VT                         = c1  with constant(char(11)),                                   protect
declare CR                         = c1  with constant(char(13)),                                   protect
declare FS                         = c1  with constant(char(28)),                                   protect
; DIRECTORY TO LAND THE FILES IN
declare FINAL_DIR_PATH             = vc  with noconstant(""),                                       protect
declare FINAL_FILE_NAME            = vc  with noconstant(""),                                       protect
 
 
;******************************************************************************************************
;  Write HL7 File: MSH Segment
;******************************************************************************************************
 
;;Cerner Test:
;;MSH1|^~\&2|3|4|5|6|7|8|9|10RAS^O01|11AVH|12|1320180725093026
;;
;;
;;Prod:
;;MSH1|^~\&2|3|4|5|6|720180726110451|8|9RAS^O01|10|11|12|13|14|15|
 
subroutine BuildMSH(o_pos)
    declare segment        = vc with noconstant(" ")
    declare fld            = i4 with noconstant(0)
    set stat               = initrec(msh)
    set segment            = build("MSH",F_SEPARATOR);0
    set msh->field[1].txt  = build(C_SEPARATOR, R_SEPARATOR, E_CHARACTER, S_SEPARATOR)
    set msh->field[2].txt  = EMPTY
    set msh->field[3].txt  = EMPTY
    set msh->field[4].txt  = EMPTY
    set msh->field[5].txt  = EMPTY
    set msh->field[6].txt  = format(cnvtdatetime(sysdate),"yyyymmddhhmmss;;d");DateTime of Message
    set msh->field[7].txt  = EMPTY
    set msh->field[8].txt  = "RAS^O01" ;EMPTY
    set msh->field[9].txt  = EMPTY
    set msh->field[10].txt = med_admin_data->ord_list[o_pos].loc_fac          ;Sending Facility
    set msh->field[11].txt = EMPTY
    set msh->field[12].txt = EMPTY
   ; set msh->field[12].txt = format(cnvtdatetime(sysdate),"yyyymmddhhmmss;;d");DateTime of Message
    set msh->field[13].txt = EMPTY
    set msh->field[14].txt = EMPTY
    set msh->field[15].txt = EMPTY
    set msh->field[16].txt = EMPTY;"RSA"
    set msh->field[17].txt = EMPTY
    set msh->field[18].txt = EMPTY;"P"
    set msh->field[19].txt = EMPTY;"2.3"
    set msh->field[20].txt = EMPTY
    set msh->field[21].txt = EMPTY
    set msh->field[22].txt = EMPTY
    ;Insert non-printable character between each field
    for(fld = 1 to size(msh->field,5))
        set segment        = build(segment,msh->field[fld].txt,ENQ)
    endfor
 
    ;Remove any trailing empty fields and replace with correct separator
    set segment = FormatSegment(segment)
 
    return(segment)
end ; end BuildMSH
 
;******************************************************************************************************
;  Write HL7 File: PID Segment
;******************************************************************************************************
subroutine BuildPID(set_id,o_pos)
  declare segment        = vc with noconstant(" ")
  declare fld            = i4 with noconstant(0)
  set stat               = initrec(pid)
  set segment            = build("PID",F_SEPARATOR)
  set pid->field[1].txt  = build(set_id)
 
  set pid->field[2].txt  = med_admin_data->ord_list[o_pos].mrn
  set pid->field[3].txt  = med_admin_data->ord_list[o_pos].mrn
  set pid->field[4].txt  = EMPTY
  set pid->field[5].txt  = build2(med_admin_data->ord_list[o_pos].person_lastname
                                 ;,S_SEPARATOR
                                 ,C_SEPARATOR
                                 ,med_admin_data->ord_list[o_pos].person_firstname
                                 ;,S_SEPARATOR)
                                 ,C_SEPARATOR)
  set pid->field[6].txt  = EMPTY
  set pid->field[7].txt  = datetimezoneformat(med_admin_data->ord_list[o_pos].date_of_birth,
                           med_admin_data->ord_list[o_pos].birth_tz,"YYYYMMDDHHMM",CURTIMEZONEDEF)
  set pid->field[8].txt  = med_admin_data->ord_list[o_pos].gender
  set pid->field[9].txt  = EMPTY
  set pid->field[10].txt = EMPTY
  set pid->field[11].txt = EMPTY
  set pid->field[12].txt = EMPTY
  set pid->field[13].txt = EMPTY
  set pid->field[14].txt = EMPTY
  set pid->field[15].txt = EMPTY
  set pid->field[16].txt = EMPTY
  set pid->field[17].txt = EMPTY
  set pid->field[18].txt = med_admin_data->ord_list[o_pos].fin
  set pid->field[19].txt = EMPTY;F_SEPARATOR;EMPTY
 
  ;Another Pipe needed ?
  set pid->field[5].txt  = FormatField(pid->field[5].txt)
 
  ;Insert non-printable character between each field
  for(fld = 1 to size(pid->field,5))
    set segment          = build(segment,pid->field[fld].txt,ENQ)
  endfor
 
  ;Remove any trailing empty fields and replace with correct separator
  set segment            = FormatSegment(segment)
 
  return(segment)
end
 
;******************************************************************************************************
;  Write HL7 File: ORC Segment
;******************************************************************************************************
subroutine BuildORC(o_pos)
  declare segment        = vc with noconstant(" ")
  declare fld            = i4 with noconstant(0)
  set stat               = initrec(orc)
  set segment            = build("ORC",F_SEPARATOR)
  set orc->field[1].txt  = EMPTY
  set orc->field[2].txt  = EMPTY
  ;set orc->field[3].txt  = cnvtstring(med_admin_data->ord_list[o_pos].order_id)
  set orc->field[3].txt  = cnvtstring(med_admin_data->ord_list[o_pos].parent_order_ident)
  set orc->field[4].txt  = EMPTY
  set orc->field[5].txt  = EMPTY
  set orc->field[6].txt  = EMPTY
  set orc->field[7].txt  = EMPTY; Quantity/Timing
  set orc->field[8].txt  = EMPTY
  set orc->field[9].txt  = med_admin_data->ord_list[o_pos].admin_dt_tm       ;Date-Time of Transaction
  set orc->field[10].txt = EMPTY
  set orc->field[11].txt = EMPTY
  set orc->field[12].txt = EMPTY
  set orc->field[13].txt = EMPTY; Enterer's location
  set orc->field[14].txt = EMPTY
  set orc->field[15].txt = EMPTY
  set orc->field[16].txt = EMPTY; Order Control
  set orc->field[17].txt = EMPTY; Code Reason
  set orc->field[18].txt = EMPTY
  set orc->field[19].txt = EMPTY; Entering Device
 
  ;Insert non-printable character between each field
  for(fld = 1 to size(orc->field,5))
    set segment          = build(segment,orc->field[fld].txt,ENQ)
  endfor
 
  ;Remove any trailing empty fields and replace with correct separator
  set segment            = FormatSegment(segment)
 
  return(segment)
end
 
 
;******************************************************************************************************
;  Write HL7 File: RXA Segment
;******************************************************************************************************
subroutine BuildRXA(o_pos, admin_dose, admin_dose_unit)
  declare segment        = vc with noconstant(" ")
  declare fld            = i4 with noconstant(0)
  set stat               = initrec(rxa)
  set segment            = build("RXA",F_SEPARATOR)
  set rxa->field[1].txt  = build(
                            ;med_admin_data->ord_list[o_pos].RESULT_STATUS
                            ;,med_admin_data->ord_list[o_pos].RESULT_STATUS_CD
                            ;,S_SEPARATOR
                            ;TO-DO:Delete Above
                            ;,cnvtstring(med_admin_data->ord_list[o_pos].event_id)
                            ;,S_SEPARATOR
                            cnvtstring(med_admin_data->ord_list[o_pos].parent_event_id)
                            ;,C_SEPARATOR;,S_SEPARATOR
                            ;,cnvtstring(med_admin_data->ord_list[o_pos].clinical_event_id)
                           );Give_Sub_Id_Counter
  set rxa->field[2].txt  = EMPTY                                                  ;Administration_Sub_ID_Counter
  set rxa->field[3].txt  = med_admin_data->ord_list[o_pos].admin_dt_tm            ;DateTime start of administration
  set rxa->field[4].txt  = EMPTY                                                  ;DateTime end of administration
  set rxa->field[5].txt  = build2( med_admin_data->ord_list[o_pos].cdm            ;Administered Code/NDC
                                  ,C_SEPARATOR;S_SEPARATOR
                                  ,med_admin_data->ord_list[o_pos].ndc
                                  ;TO-DO:Delete Below
                                  ,C_SEPARATOR;,S_SEPARATOR
                                  ,med_admin_data->ord_list[o_pos].ORD_MNEMONIC)
 
  set rxa->field[6].txt  = med_admin_data->ord_list[o_pos].ADMIN_DOSAGE           ;Administered Amount
  set rxa->field[7].txt  = med_admin_data->ord_list[o_pos].ADMIN_DOSAGE_UNIT      ;Administered Units
  set rxa->field[8].txt  = med_admin_data->ord_list[o_pos].drug_form              ;Administered Dosage Form
  set rxa->field[9].txt  = EMPTY                                                  ;Administration Notes/(Drug description?)
  set rxa->field[10].txt = med_admin_data->ord_list[o_pos].ord_phys               ;Administering Provider
  set rxa->field[11].txt = med_admin_data->ord_list[o_pos].admin_loc              ;Administered At Location
  set rxa->field[12].txt = EMPTY                                                  ;Administered Per (Time Unit)
  set rxa->field[13].txt = med_admin_data->ord_list[o_pos].admin_strength         ;Administered Strength
  set rxa->field[14].txt = med_admin_data->ord_list[o_pos].admin_strength_unit    ;Administered Strength Units
  set rxa->field[15].txt = EMPTY
  set rxa->field[16].txt = EMPTY
  set rxa->field[17].txt = EMPTY
  set rxa->field[18].txt = med_admin_data->ord_list[o_pos].reason_not_given       ;Reason Not Given
  set rxa->field[19].txt = EMPTY
  set rxa->field[20].txt = med_admin_data->ord_list[o_pos].transaction_type       ;Transaction_Type
  set rxa->field[21].txt = EMPTY
  set rxa->field[22].txt = EMPTY
  set rxa->field[23].txt = EMPTY
  set rxa->field[24].txt = EMPTY
  set rxa->field[25].txt = EMPTY
  set rxa->field[26].txt = EMPTY;Pharmacy Order Type
 
  set rxa->field[18].txt = FormatField(rxa->field[18].txt)
 
  ;Insert non-printable character between each field
  for(fld = 1 to size(rxa->field,5))
    set segment = build(segment,rxa->field[fld].txt,ENQ)
  endfor
 
  ;Remove any trailing empty fields and replace with correct separator
  set segment = FormatSegment(segment)
 
  return(segment)
end
 
 
;******************************************************************************************************
;  Write HL7 File: RXC Segment
;******************************************************************************************************
subroutine BuildRXC(o_pos, p_pos)
  declare segment       = vc with noconstant(" ")
  declare fld           = i4 with noconstant(0)
  set stat              = initrec(rxc)
  set segment           = build("RXC",F_SEPARATOR)
  set rxc->field[1].txt = med_admin_data->ord_list[o_pos].ingred_qual[p_pos].component_type            ;RX Component Type
  set rxc->field[2].txt = build2(trim(cnvtstring(med_admin_data->ord_list[o_pos].ingred_qual[p_pos].catalog_cd),3),
                                 C_SEPARATOR, ;S_SEPARATOR ,
                                 med_admin_data->ord_list[o_pos].ingred_qual[p_pos].catalog_disp)      ;Rx Component Code
  set rxc->field[3].txt = med_admin_data->ord_list[o_pos].ingred_qual[p_pos].volume        ;Component Amount
  set rxc->field[4].txt = med_admin_data->ord_list[o_pos].ingred_qual[p_pos].volume_units  ;Component Units
  set rxc->field[5].txt = med_admin_data->ord_list[o_pos].ingred_qual[p_pos].strength      ;Component Strength
  set rxc->field[6].txt = med_admin_data->ord_list[o_pos].ingred_qual[p_pos].strength_units;Component Strength Units
 
  ;Insert non-printable character between each field
  for(fld = 1 to size(rxc->field,5))
    set segment         = build(segment,rxc->field[fld].txt,ENQ)
  endfor
 
  ;Remove any trailing empty fields and replace with correct separator
  set segment           = FormatSegment(segment)
 
  return(segment)
end
 
 
;******************************************************************************************************
;  Write HL7 File: RXR Segment
;******************************************************************************************************
subroutine BuildRXR(o_pos)
  declare segment       = vc with noconstant(" ")
  declare fld           = i4 with noconstant(0)
  set stat              = initrec(rxr)
  set segment           = build("RXR",F_SEPARATOR)
  set rxr->field[1].txt = med_admin_data->ord_list[o_pos].admin_route
 
  ;Insert non-printable character between each field
  for(fld = 1 to size(rxr->field,5))
    set segment         = build(segment,rxr->field[fld].txt,ENQ)
  endfor
 
  ;Remove any trailing empty fields and replace with correct separator
  set segment           = FormatSegment(segment)
 
  return(segment)
end
 
;******************************************************************************************************
;  FormatWithSeparator
;******************************************************************************************************
subroutine FormatWithSeparator(unformatted,separator)
   declare formatted = vc with noconstant(" ")
 
   set formatted = trim(unformatted)                ;trim any empty fields
   set formatted = replace(formatted,ENQ,separator)	;replace all ENQ
 
   return(formatted)
end
 
subroutine FormatSegment(unformatted)
   declare formatted = vc with noconstant(" ")
 
   set formatted = trim(unformatted)                    ;trim any empty fields
   set formatted = replace(formatted,ENQ,F_SEPARATOR)   ;replace all ENQ with |
;   set formatted = build(formatted,F_SEPARATOR)        ;add | after last field
 
   return(formatted)
end
 
;******************************************************************************************************
;  FormatField
;******************************************************************************************************
subroutine FormatField(unformatted)
   declare formatted = vc with noconstant(" ")
 
   set formatted = trim(unformatted,3)                  ;trim any empty fields
   set formatted = replace(formatted,ENQ,C_SEPARATOR)   ;replace all ENQ with ^
 
   return(formatted)
end
 
;********************************************************************************
; subroutine GetFileName
;********************************************************************************
; Description:Generates the concatenated output filename
; Output     : Formatted filename: <ante_ca_pha_ma_vigil>_<PROMPT_BEGIN_DT>_<PROMPT_END_DT>_<RUN_DT>_<RUN_TM>.txt
;********************************************************************************
subroutine GetFileName(file_dir, sub_dir, file_mnemonic, ce_id_vc, file_ext)
  declare FileName	     = vc  with protect, noconstant("")
	set FINAL_DIR_PATH     = cnvtlower(concat(file_dir, "/" ,sub_dir ,"/"))
	set FINAL_FILE_NAME    = cnvtlower(concat( file_mnemonic       , UNDERSCORE,
												                     ;FILE_BEG_DT         , UNDERSCORE,
												                     ;FILE_END_DT         , UNDERSCORE,
												                     format(curdate, DATE_FORMAT_FILE),UNDERSCORE,
												                     format(curtime3, "hhmmss;3;m"),
												                     ce_id_vc,
												                     file_ext
												                    )
												             )
 
	/*set FINAL_FILE_NAME    = cnvtlower(concat( file_mnemonic       , UNDERSCORE,
												                     FILE_BEG_DT         , UNDERSCORE,
												                     FILE_END_DT         , ;UNDERSCORE,
												                     ;format(curdate, DATE_FORMAT_FILE),UNDERSCORE,
												                     ;format(curtime3, "hhmmss;3;m"),
												                     file_ext
												                    )
												             )	*/
	set FileName           =  concat(trim(FINAL_DIR_PATH,3), trim(FINAL_FILE_NAME,3))
	call logMsg(build2("File Path:",FileName))
	return(FileName)
end;subroutine GetFileName
 
/*subroutine DisplayFileData(cnt , extract_filename)
    select into $OUTDEV
    from (dummyt d with seq = 1)
    plan d
    head report
      ;"{CPI/9}{FONT/0}"
      row 1, col 0, call print(build2("Program            : ", cnvtlower(curprog)))
      row + 1
      row 3, col 0, call print(build2("Execution Date/Time: ", format(cnvtdatetime(curdate,curtime), "mm/dd/yyyy hh:mm:ss;;q")))
      row + 1
      row 7, col 0, call print(build2("Prompt selected are follows:"))  row + 1
      row + 1
      row 9, col 0, call print(build2("Begin Date: ",format(BEG_DT_TM,DATE_FORMAT_DISPLAY) ))
      row + 1
      row 11, col 0, call print(build2("End Date  : ", format(END_DT_TM,DATE_FORMAT_DISPLAY)))
      row + 1
      row 15, col 0, call print(build2("Output Information : "))  row + 1
      row + 1
      row 17, col 0, call print(build2("File Dir : ",FINAL_DIR_PATH))
      row + 1
      row 19, col 0, call print(build2("File Name:",FINAL_FILE_NAME))
      row + 1
      row 21, col 0, call print(build2("Node     : ", curnode))
      row + 1
      row 23, col 0, call print(build2("The file should contain ",
             trim(cnvtstring(cnt),3), " number of records."))
      row + 1
    with nocounter, nullreport, maxcol = 300, dio = postscript
end*/
;--------------------------------------------------------------------------------------------------------------------------
;Include
/*********************************************************************************************************
 Include File
*********************************************************************************************************/
;%i cclsource:ante_ca_pha_medadmin_vigil_ext.inc
;call echo(build2("* * *  BEG_DT_TM is * * * ", format(BEG_DT_TM, "mm/dd/yyyy hh:mm:ss;;q")))
;call echo(build2("* * *  END_DT_TM is * * * ", format(END_DT_TM, "mm/dd/yyyy hh:mm:ss;;q")))
/*****************************************************************************************************************
   Main Query
*****************************************************************************************************************/
select into "nl:"
from
	 clinical_event ce
	,encounter      e
	,orders         o
	,ce_med_result  cmr
plan ce
	where ce.event_end_dt_tm between
	 cnvtlookbehind ("30,MIN" ) AND cnvtdatetime (curdate ,curtime )
	;cnvtdatetime(BEG_DT_TM) and cnvtdatetime(END_DT_TM)
	;cnvtdatetime(curdate,curtime-30) and cnvtdatetime(curdate,curtime)
	;between cnvtdatetime("12-JUN-2018 09:00:00") and cnvtdatetime("12-JUN-2018 10:00:00")
	;and ce.person_id          = 12554345;12552596;12553045.00
	and ce.view_level         = 1
	and ce.publish_flag       = 1
	;Shall send them entire history of the changes done
	and ce.valid_until_dt_tm  = (cnvtdatetime("31-DEC-2100 00:00:00"))
	and ce.event_title_text  != IVPARVAR
	and ce.task_assay_cd      = 0.00
	and ce.event_reltn_cd     = CHILDVAR
	and ce.event_class_cd     in (53_med_event_class_cd, 53_immu_event_class_cd)
	;To filter out events that may be coming out from 3rd party interface
	and ce.event_cd           > 0.00
join o
	where o.order_id          = ce.order_id
	and o.catalog_type_cd     = 6000_PHARMACY_VAR
join e
	where e.encntr_id         = o.encntr_id
	and e.active_ind          = 1
	and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	and e.end_effective_dt_tm >  cnvtdatetime(curdate,curtime3)
join cmr
	where cmr.event_id        = outerjoin(ce.event_id)
	and cmr.event_id         != outerjoin(0)
	and cmr.valid_until_dt_tm = outerjoin(cnvtdatetime("31-DEC-2100 00:00:00"))
	and cmr.synonym_id       != outerjoin(0)
	and cmr.iv_event_cd      != outerjoin(180_IVWASTEVAR)
order by
     o.order_id
    ,ce.parent_event_id; multi ingredients will have same parent_event_id
 ;   ,ce.event_id
    ,ce.result_status_cd
head report
    cnt = 0
head o.order_id
	null
head ce.parent_event_id
   null
head ce.result_status_cd
    cnt = cnt + 1
    if(mod(cnt,1000) = 1)
        stat = alterlist(med_admin_data->ord_list,cnt + 999)
    endif
    med_admin_data->ord_list[cnt].event_end_dt_tm      = ce.event_end_dt_tm
    med_admin_data->ord_list[cnt].result_status        = uar_get_code_display(ce.result_status_cd)
    med_admin_data->ord_list[cnt].result_status_cd     = ce.result_status_cd
    med_admin_data->ord_list[cnt].clinical_event_id    = ce.clinical_event_id
    med_admin_data->ord_list[cnt].clinical_event_id_vc = trim(cnvtstring(ce.clinical_event_id),3)
    med_admin_data->ord_list[cnt].ord_mnemonic         = trim(ce.event_title_text,3)
    if(textlen(med_admin_data->ord_list[cnt].ord_mnemonic) = 0)
    	;med_admin_data->ord_list[cnt].ord_mnemonic       = o.order_mnemonic
    	med_admin_data->ord_list[cnt].ord_mnemonic     = uar_get_code_display(ce.catalog_cd)
    endif
 
 	if(ce.result_status_cd = 8_inerror_result_status_cd)
 		med_admin_data->ord_list[cnt].default_dose_flag    = 1
 	else
 		med_admin_data->ord_list[cnt].default_dose_flag    = 0
 	endif
 	med_admin_data->ord_list[cnt].admin_loc            = concat(GetAlias(e.loc_nurse_unit_cd)
 														 ,C_SEPARATOR
 														 ,GetAlias(e.loc_room_cd)
 														 ,C_SEPARATOR
 													     ,GetAlias(e.loc_bed_cd)
 													     ,C_SEPARATOR
 													     ,GetAlias(e.loc_facility_cd)
 													     ,C_SEPARATOR
 													     ,C_SEPARATOR
 													     ,GetAlias(e.loc_building_cd))
 
    med_admin_data->ord_list[cnt].event_id             = ce.event_id
    med_admin_data->ord_list[cnt].admin_route          = uar_get_code_display(cmr.admin_route_cd)
    med_admin_data->ord_list[cnt].admin_dt_tm          = format(ce.event_end_dt_tm, DATE_FORMAT)
    med_admin_data->ord_list[cnt].admin_dosage         = cnvtstring(cmr.admin_dosage,17,3)
    med_admin_data->ord_list[cnt].admin_dosage_unit    = uar_get_code_display(cmr.dosage_unit_cd)
    med_admin_data->ord_list[cnt].drug_form            = uar_get_code_display(cmr.medication_form_cd)
    med_admin_data->ord_list[cnt].reason_not_given     = uar_get_code_display(cmr.refusal_cd)
    med_admin_data->ord_list[cnt].admin_note           = trim(cmr.admin_note,3)
 
    med_admin_data->ord_list[cnt].admin_strength       = trim(cnvtstring(cmr.admin_strength,17,3),3)
    med_admin_data->ord_list[cnt].admin_strength_unit  = trim(uar_get_code_display(cmr.admin_strength_unit_cd),3)
    med_admin_data->ord_list[cnt].order_id             = o.order_id
    med_admin_data->ord_list[cnt].template_order_id    = o.template_order_id
    med_admin_data->ord_list[cnt].template_order_flag  = o.template_order_flag
    if (med_admin_data->ord_list[cnt].template_order_flag = 4)
    	med_admin_data->ord_list[cnt].ord_prod_id        = med_admin_data->ord_list[cnt].template_order_id
    else
    	med_admin_data->ord_list[cnt].ord_prod_id        = med_admin_data->ord_list[cnt].order_id
    endif
   ;med_admin_data->ord_list[cnt].action_sequence      = oa.action_sequence
    med_admin_data->ord_list[cnt].person_id            = e.person_id
    med_admin_data->ord_list[cnt].fin_class_cd         = e.financial_class_cd
    med_admin_data->ord_list[cnt].encntr_id            = e.encntr_id
 
    med_admin_data->ord_list[cnt].encntr_type_class    = trim(GetAlias(e.encntr_type_class_cd),3)
    med_admin_data->ord_list[cnt].loc_fac              = trim(GetAlias(e.loc_facility_cd),3)
 
    med_admin_data->ord_list[cnt].item_id_flag         = 0
 
    med_admin_data->ord_list[cnt].synonym_id           = cmr.synonym_id
    med_admin_data->ord_list[cnt].order_ingre_ind      = o.ingredient_ind
    med_admin_data->ord_list[cnt].order_ingre_last_action_seq
                                                       = o.last_ingred_action_sequence
    if(ce.result_units_cd = 54_volume_ml_result_units)
        if(cnvtreal(ce.result_val) != 0.00)
            if(findstring(".",ce.result_val) = 0)
                med_admin_data->ord_list[cnt].ord_volume
                                                       = trim(ce.result_val,3)
            else
                med_admin_data->ord_list[cnt].ord_volume
                                                       = substring(1,findstring(".",ce.result_val)+2,ce.result_val)
            endif
            med_admin_data->ord_list[cnt].ord_vol_unit = uar_get_code_display(ce.result_units_cd)
            med_admin_data->ord_list[cnt].ord_vol_populated
                                                       = "CLINICAL_EVENT"
            med_admin_data->ord_list[cnt].ord_vol_flag
                                                       = 1
        endif
    else
        if(cnvtreal(ce.result_val) != 0.00)
             if(findstring(".",ce.result_val) = 0)
                med_admin_data->ord_list[cnt].ord_strength
                                                       = trim(ce.result_val,3)
            else
                med_admin_data->ord_list[cnt].ord_strength
                                                       = substring(1,findstring(".",ce.result_val)+2,ce.result_val)
            endif
            med_admin_data->ord_list[cnt].ord_s_unit  = uar_get_code_display(ce.result_units_cd)
            med_admin_data->ord_list[cnt].ord_strength_populated
                                                       = "CLINICAL_EVENT"
            med_admin_data->ord_list[cnt].ord_strength_flag
                                                       = 1
        endif
    endif
    med_admin_data->ord_list[cnt].iv_ind               = o.iv_ind
    if(med_admin_data->ord_list[cnt].iv_ind = 1)
    	med_admin_data->ord_list[cnt].infuse_rate        = CNVTSTRINGCHK(cmr.infusion_rate)
    	if(med_admin_data->ord_list[cnt].infuse_rate = "0")
    		med_admin_data->ord_list[cnt].infuse_rate      = ""
    	endif
    	;med_admin_data->ord_list[cnt].infuse_cd         = trim(uar_get_code_display(cmr.infusion_unit_cd,3))
    endif
 
    if(ce.result_status_cd in (8_notdone_result_status_cd) )
      med_admin_data->ord_list[cnt].reason_not_given   = trim(ce.event_tag,3)
    endif
    med_admin_data->ord_list[cnt].clinical_seq         = ce.clinical_seq
    med_admin_data->ord_list[cnt].event_cd             = ce.event_cd
    med_admin_data->ord_list[cnt].performed_prsnl_id   = ce.performed_prsnl_id
    med_admin_data->ord_list[cnt].performed_dt_tm      = format(ce.performed_dt_tm, DATE_FORMAT)
    med_admin_data->ord_list[cnt].parent_event_id      = ce.parent_event_id
                                                         ;uar_get_code_display(mae.event_type_cd)
foot ce.result_status_cd
    null
foot ce.parent_event_id
     null
foot o.order_id
    null
foot report
    stat = alterlist(med_admin_data->ord_list, cnt)
    med_admin_data->cnt = cnt
 
with nocounter, expand = 1
 
/***********************************************************************************
 Get the parent_order_id incase the order has a parent_order_id
************************************************************************************/
select into "nl:"
from
	 ce_event_order_link ceol
plan ceol
   where expand(num, 1, med_admin_data->cnt, ceol.event_id,  med_admin_data->ord_list[num].event_id,
                                             ;ceol.order_id,  med_admin_data->ord_list[num].order_id,
                                             ceol.valid_until_dt_tm, cnvtdatetime("31-DEC-2100 00:00:00"))
order by ceol.event_id
head report
  null
head ceol.event_id
  pos = locateval(loc_index, 1, med_admin_data->cnt, ceol.event_id,  med_admin_data->ord_list[loc_index].event_id,
                                             ceol.valid_until_dt_tm, cnvtdatetime("31-DEC-2100 00:00:00"))
  if(pos > 0)
    med_admin_data->ord_list[pos].parent_order_ident = ceol.parent_order_ident
  endif
foot ceol.event_id
  null
foot report
  null
with nocounter, expand = 1
 
/***********************************************************************************
 Get all of the Ingredient details: Gather order vol and strength from clinical_event
************************************************************************************/
select into "nl:"
from
	 clinical_event           ce
	,ce_med_result            cmr
	,ce_med_admin_ident_reltn reltn
	,ce_med_admin_ident       ident
	,order_catalog_synonym    ocs
	,med_identifier			  mi
plan ce
  where expand(num, 1, med_admin_data->cnt
                                        , ce.parent_event_id,   med_admin_data->ord_list[num].parent_event_id
                                        , ce.order_id       ,   med_admin_data->ord_list[num].order_id
                                        , ce.result_status_cd,  med_admin_data->ord_list[num].result_status_cd)
	and ce.view_level         = 1
	and ce.publish_flag       = 1
	and ce.valid_until_dt_tm  = (cnvtdatetime("31-DEC-2100 00:00:00"))
	and ce.event_title_text  != IVPARVAR
	and ce.task_assay_cd      = 0.00
	and ce.event_reltn_cd     = CHILDVAR
	and ce.event_class_cd     in (53_med_event_class_cd, 53_immu_event_class_cd)
	and ce.event_cd           > 0.00
join cmr
	where cmr.event_id        = ce.event_id
	and cmr.event_id         != 0
	and cmr.valid_until_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")
	and cmr.synonym_id       != 0
	and cmr.iv_event_cd      != 180_IVWASTEVAR
 
join ocs
  where ocs.synonym_id       = cmr.synonym_id
 
join reltn
  where reltn.event_id       = outerjoin(ce.event_id)
join ident
  where ident.ce_med_admin_ident_id
                             = outerjoin(reltn.ce_med_admin_ident_id)
join mi
  where mi.item_id           = outerjoin(ocs.item_id)
  and mi.med_identifier_type_cd = outerjoin(11000_CDM_cd)
order by
    ce.parent_event_id
    ,ce.result_status_cd
    ,ce.event_id
    ;,ce.clinical_event_id
    ;,reltn.ce_med_admin_ident_id
head report
   cnt = 0
head ce.parent_event_id
   null
head ce.result_status_cd
   cnt = 0
   pos = locateval(loc_index, 1, med_admin_data->cnt   , ce.parent_event_id,   med_admin_data->ord_list[loc_index].parent_event_id
                                                       , ce.order_id       ,   med_admin_data->ord_list[loc_index].order_id
                                                       , ce.result_status_cd,  med_admin_data->ord_list[loc_index].result_status_cd)
   med_admin_data->ord_list[pos].transaction_type     = uar_get_code_display(ce.result_status_cd)
head ce.event_id
  if(pos > 0 )
      ;cmr.admin_start_dt_tm between
;  detail
      cnt  = cnt + 1
      if(mod(cnt,5) = 1)
         stat = alterlist(med_admin_data->ord_list[pos].ingred_qual,cnt + 4)
      endif
      med_admin_data->ord_list[pos].ingred_qual[cnt].i_event_id     = ce.event_id
      med_admin_data->ord_list[pos].ingred_qual[cnt].catalog_disp   = trim(ce.event_title_text,3)
 
      if(textlen(med_admin_data->ord_list[pos].ingred_qual[cnt].catalog_disp) = 0)
        med_admin_data->ord_list[pos].ingred_qual[cnt].catalog_disp = uar_get_code_display(ce.catalog_cd)
                                                                    ; uar_get_code_display(cmr.diluent_type_cd)
      endif
      med_admin_data->ord_list[pos].ingred_qual[cnt].strength       = cnvtstring(cmr.admin_strength,17,3)
      med_admin_data->ord_list[pos].ingred_qual[cnt].strength_units = uar_get_code_display(cmr.admin_strength_unit_cd)
      med_admin_data->ord_list[pos].ingred_qual[cnt].synonym_id     = cmr.synonym_id
      med_admin_data->ord_list[pos].ingred_qual[cnt].catalog_cd     = trim(mi.value,3)
      med_admin_data->ord_list[pos].ingred_qual[cnt].volume         = cnvtstring(cmr.admin_dosage,17,3)
      med_admin_data->ord_list[pos].ingred_qual[cnt].volume_units   = uar_get_code_display(cmr.dosage_unit_cd)
 
     ; pos = locateval(loc_index, pos+1, med_admin_data->cnt   , ce.parent_event_id,   med_admin_data->ord_list[loc_index].
    ;  parent_event_id,ce.order_id       ,   med_admin_data->ord_list[loc_index].order_id
   ;      , ce.result_status_cd,  med_admin_data->ord_list[loc_index].result_status_cd)
  endif
  ;endwhile
foot ce.event_id
 null
foot ce.result_status_cd
 null
foot ce.parent_event_id
 stat = alterlist(med_admin_data->ord_list[pos].ingred_qual,cnt)
 med_admin_data->ord_list[pos].ingred_qual_cnt   = cnt
 cnt = 0
foot report
 null
with nocounter, expand = 1
 
/***********************************************************************************
 Get Ingredient details: Gather order vol and strength from order ingredient
************************************************************************************/
select into "nl:"
from
    order_ingredient oi
plan oi
    where expand(num, 1, med_admin_data->cnt
                                        , oi.order_id,   med_admin_data->ord_list[num].order_id
                                        , oi.synonym_id, med_admin_data->ord_list[num].synonym_id)
order by
    oi.order_id
    ,oi.synonym_id
    ,oi.action_sequence desc
 
head oi.order_id
    null
 
head oi.synonym_id
    ord_vol = ""
    ord_vol_unit = ""
    ord_strength = ""
    ord_strength_unit = ""
 
detail
    ord_vol           = build(oi.volume)
    ord_vol_unit      = uar_get_code_display(oi.volume_unit)
    ord_strength      = build(oi.strength)
    ord_strength_unit = uar_get_code_display(oi.strength_unit)
 
foot oi.synonym_id
    pos = locateval(num,1,med_admin_data->cnt
                                        ,oi.order_id  , med_admin_data->ord_list[num].order_id
                                        ,oi.synonym_id, med_admin_data->ord_list[num].synonym_id)
    while(pos > 0)
        if(textlen(trim(med_admin_data->ord_list[pos].ord_volume,3)) = 0)
            if(oi.volume != 0.00)
                if(findstring(".",ord_vol) = 0)
                    med_admin_data->ord_list[pos].ord_volume    = ord_vol
                else
                    med_admin_data->ord_list[pos].ord_volume    = substring(1,findstring(".",ord_vol)+2,ord_vol)
                endif
                med_admin_data->ord_list[pos].ord_vol_unit      = ord_vol_unit
                med_admin_data->ord_list[pos].ord_vol_populated = "ORDER_INGREDIENT"
				        med_admin_data->ord_list[pos].ord_vol_flag      = 1
            endif
        endif
 
        if(textlen(trim(med_admin_data->ord_list[pos].ord_strength,3)) = 0)
            if(oi.strength != 0.00)
                 if(findstring(".",ord_strength) = 0)
                    med_admin_data->ord_list[pos].ord_strength  = ord_strength
                else
                    med_admin_data->ord_list[pos].ord_strength  = substring(1,findstring(".",ord_strength)+2,ord_strength)
                endif
                med_admin_data->ord_list[pos].ord_s_unit        = ord_strength_unit
                med_admin_data->ord_list[pos].ord_strength_populated
                                                                = "ORDER_INGREDIENT"
				med_admin_data->ord_list[pos].ord_strength_flag         = 1
            endif
        endif
 
        pos = locateval(num,pos+1,med_admin_data->cnt
                                        ,oi.order_id,    med_admin_data->ord_list[num].order_id
                                        ,oi.synonym_id,  med_admin_data->ord_list[num].synonym_id
                       )
    endwhile
with nocounter, expand = 1
 
/*****************************************************************************************************
 Get item_id based on synonym_id from ce_med_result
******************************************************************************************************/
select into "nl:"
from
    order_catalog_synonym ocs
plan ocs
    where expand(num, 1, med_admin_data->cnt, ocs.synonym_id, med_admin_data->ord_list[num].synonym_id)
order by
    ocs.synonym_id
head report
    null
head ocs.synonym_id
    pos = locateval(num, 1, med_admin_data->cnt, ocs.synonym_id, med_admin_data->ord_list[num].synonym_id)
    while(pos > 0)
        med_admin_data->ord_list[pos].item_id          = ocs.item_id
        if(med_admin_data->ord_list[pos].item_id > 0)
        	med_admin_data->ord_list[pos].item_id_flag   = 1
        endif
        pos = locateval(num,pos+1,med_admin_data->cnt,ocs.synonym_id,med_admin_data->ord_list[num].synonym_id)
    endwhile
foot ocs.synonym_id
    null
foot report
    null
with nocounter, expand = 1
 
/**********************************************************************************************
 get dose quantity,item_id from order_product table
***********************************************************************************************/
select into "nl:"
from
	order_product op
plan op
	where expand(index, 1, med_admin_data->cnt, op.order_id, med_admin_data->ord_list[index].ord_prod_id)
	                                   ;,op.item_id,med_admin_data->ord_list[index].item_id)
order by
	op.order_id
	,op.action_sequence desc
 
head op.order_id
	pos = locateval(index, 1, med_admin_data->cnt, op.order_id, med_admin_data->ord_list[index].ord_prod_id)
	                                           ;,op.item_id,med_admin_data->ord_list[index].item_id)
	while(pos > 0)
		med_admin_data->ord_list[pos].item_id            = op.item_id
		if(med_admin_data->ord_list[pos].item_id > 0)
				med_admin_data->ord_list[pos].item_id_flag   = 1
		endif
		;The administration was uncharted so it will be credited.
		if (med_admin_data->ord_list[pos].result_status_cd = 8_inerror_result_status_cd)
		  med_admin_data->ord_list[pos].dose_qty         = cnvtstring(ceil(op.dose_quantity * - 1))
		else
		  med_admin_data->ord_list[pos].dose_qty         = cnvtstring(ceil(op.dose_quantity))
		endif
		med_admin_data->ord_list[pos].dose_qty_unit      = uar_get_code_display(op.dose_quantity_unit_cd)
		med_admin_data->ord_list[pos].dose_qty_populated = "ORDER_PRODUCT"
		pos = locateval(index,pos + 1, med_admin_data->cnt, op.order_id, med_admin_data->ord_list[index].ord_prod_id)
		                                                 ;,op.item_id,med_admin_data->ord_list[index].item_id)
	endwhile
 
with nocounter,expand = 1
 
/*************************************************************************************************
 Get specific NDC when a drug is scanned - for RXR segment
 *************************************************************************************************/
select into "nl:"
from
	ce_med_admin_ident_reltn reltn
	,ce_med_admin_ident      ident
plan reltn
	where expand(index, 1, med_admin_data->cnt, reltn.event_id, med_admin_data->ord_list[index].event_id)
join ident
	where ident.ce_med_admin_ident_id          = reltn.ce_med_admin_ident_id
order by
	reltn.event_id
	,reltn.ce_med_admin_ident_id
 
head reltn.event_id
	pos = locateval(loc_index,1,med_admin_data->cnt,reltn.event_id,med_admin_data->ord_list[loc_index].event_id)
	if(pos > 0)
		if(textlen(trim(replace(ident.med_admin_barcode,"-","",0),3)) =  ndc_length_11)
			med_admin_data->ord_list[pos].ndc      = trim(replace(ident.med_admin_barcode,"-","",0),3)
			med_admin_data->ord_list[pos].ndc_type = "SCANNED"
			med_admin_data->ord_list[pos].ndc_flag = 1
		endif
		if(med_admin_data->ord_list[pos].item_id_flag = 0)
			med_admin_data->ord_list[pos].item_id  = ident.item_id
			if(med_admin_data->ord_list[pos].item_id > 0)
				med_admin_data->ord_list[pos].item_id_flag = 1
			endif
		endif
	endif
 
with nocounter,expand = 1
 
/*******************************************************************************************
if specific ndc is not found we find the generic ndc
********************************************************************************************/
select into "nl:"
from
	 med_identifier          mi
  ,med_def_flex            mdf
  ,med_flex_object_idx     mfoi
plan mi
	where expand(index,1,med_admin_data->cnt,mi.item_id,med_admin_data->ord_list[index].item_id
								 ,1,med_admin_data->ord_list[index].item_id_flag
								 ,0,med_admin_data->ord_list[index].ndc_flag)
     and mi.pharmacy_type_cd       = 4500_inp_pharm_type_cd
     and mi.med_identifier_type_cd = 11000_NDC_cd
     and mi.active_ind             = 1
     and mi.primary_ind            = 1
join mdf
	where mdf.med_def_flex_id        = mi.med_def_flex_id
join mfoi
	where mfoi.med_def_flex_id       = mdf.med_def_flex_id
    and mfoi.flex_object_type_cd   = 4063_MEDPRODUCT
    and mfoi.parent_entity_name    = "MED_PRODUCT"
    and mfoi.parent_entity_id      = mi.med_product_id
    and mfoi.sequence = 1
order by
	mi.item_id
 
head mi.item_id
	pos = locateval(loc_index,1,med_admin_data->cnt,mi.item_id,med_admin_data->ord_list[loc_index].item_id)
	while(pos > 0)
	    if(textlen(trim(med_admin_data->ord_list[pos].ndc,3)) = 0)
		      med_admin_data->ord_list[pos].ndc       = trim(replace(mi.value,"-","",0),3)
		      med_admin_data->ord_list[pos].ndc_type  = "PRIMARY"
		  endif
		pos = locateval(loc_index,pos + 1,med_admin_data->cnt,mi.item_id,med_admin_data->ord_list[loc_index].item_id)
	endwhile
 
with nocounter,expand = 1
 
/*******************
 CDM
 *******************/
select into "nl:"
from
    med_identifier mi
 
plan mi
    where expand(index, 1, med_admin_data->cnt, mi.item_id, med_admin_data->ord_list[index].item_id
    										 ,1,med_admin_data->ord_list[index].item_id_flag)
    and mi.active_ind = 1
    and mi.primary_ind = 1
    and mi.med_identifier_type_cd = 11000_CDM_cd
order by
	mi.item_id
	,mi.med_identifier_type_cd
 
head mi.item_id
    cdm = ""
 
head mi.med_identifier_type_cd
    cdm = trim(mi.value, 3)
 
foot mi.med_identifier_type_cd
    null
 
foot mi.item_id
	pos = locateval (index, 1, med_admin_data->cnt, mi.item_id, med_admin_data->ord_list[index].item_id
												 ,1,med_admin_data->ord_list[index].item_id_flag)
	while (pos > 0)
        med_admin_data->ord_list[pos].cdm = cdm
        pos = locateval (index,pos + 1, med_admin_data->cnt, mi.item_id, med_admin_data->ord_list[index].item_id
        												 ,1,med_admin_data->ord_list[index].item_id_flag)
    endwhile
 
with nocounter,expand = 1
 
/**********************************************************************************************
;Retrieve the drug form, strength, strength dose unit,volume,volume unit,pharm_ref,dose_qty,dose_qty_unit,
;ndc and cdm(if the product is not assigned)
;***********************************************************************************************/
select into "nl:"
from
    order_detail o
plan o
    where expand(index, 1, med_admin_data->cnt, o.order_id, med_admin_data->ord_list[index].order_id)
    and o.oe_field_id in (
    					   16449_drugform
    					  ,16449_strengthdose
    					  ,16449_strengthdose_unit
    					  ,16449_volumedose
    					  ,16449_volumedose_unit
    					  ,16449_dose_quantity
    					  ,16449_dose_quantity_unit
    					  ,16449_ndc_cdm
    					  ,16449_rate
    					  ,16449_rate_unit
    					  )
order by
	o.order_id
	,o.oe_field_id
	,o.action_sequence desc
 
;If the dose form order detail has been documented on multiple actions,
;retrieve the value from the most recent action sequence.
head o.order_id
   drug_form              = ""
   ord_strength           = ""
   ord_strength_unit      = ""
   ord_vol                = ""
	 ord_vol_unit           = ""
	 dose_qty               = ""
	 dose_qty_unit          = ""
	 rate                   = ""
	 rate_unit              = ""
 
head o.oe_field_id
 
	case(o.oe_field_id)
    	of 16449_drugform:
    		drug_form          = trim(o.oe_field_display_value, 3)
    	of 16449_strengthdose:
    		ord_strength       = trim(o.oe_field_display_value, 3)
		  of 16449_strengthdose_unit:
			   ord_strength_unit = trim(o.oe_field_display_value, 3)
		  of 16449_volumedose:
			   ord_vol           = trim(o.oe_field_display_value, 3)
		  of 16449_volumedose_unit:
			   ord_vol_unit      = trim(o.oe_field_display_value, 3)
		  of 16449_dose_quantity:
			   dose_qty          = trim(o.oe_field_display_value, 3)
		  of 16449_dose_quantity_unit:
			   dose_qty_unit     = trim(o.oe_field_display_value, 3)
		  of 16449_rate:
			   rate              = trim(o.oe_field_display_value, 3)
		  of 16449_rate_unit:
			   rate_unit         = trim(o.oe_field_display_value, 3)
			of 16449_ndc_cdm:
			    ndc_cdm          = trim(o.oe_field_display_value, 3)
     endcase
 
foot o.order_id
pos = locateval(index, 1, med_admin_data->cnt, o.order_id, med_admin_data->ord_list[index].order_id)
 
while (pos > 0)
  ;We will only need this info incase we are not able to pull the info from ce_med_result
  if(med_admin_data->ord_list[pos].drug_form = "")
	   med_admin_data->ord_list[pos].drug_form                     = drug_form
  endif
    if(textlen(trim(med_admin_data->ord_list[pos].ord_strength,3)) = 0)
        if(med_admin_data->ord_list[pos].ord_strength_flag       = 1)
		    if(textlen(trim(ord_strength,3))> 0)
		         if(findstring(".",ord_strength) = 0)
			         med_admin_data->ord_list[pos].ord_strength        = ord_strength
			     else
			         med_admin_data->ord_list[pos].ord_strength        =
			                 substring(1,findstring(".",ord_strength)+2,ord_strength)
			     endif
			     med_admin_data->ord_list[pos].ord_s_unit              = ord_strength_unit
			     med_admin_data->ord_list[pos].ord_strength_populated  = "ORDER_DETAIL"
			endif
		endif
	endif
 
	if(textlen(trim(med_admin_data->ord_list[pos].infuse_rate,3))  = 0)
        if(med_admin_data->ord_list[pos].iv_ind = 1)
        	if(textlen(trim(rate,3))> 0)
        	   	 if(findstring(".",rate) = 0)
			         med_admin_data->ord_list[pos].infuse_rate         = rate
			         med_admin_data->ord_list[pos].infuse_cd           = rate_unit
			     endif
            endif
        endif
    endif
 
    if(textlen(trim(med_admin_data->ord_list[pos].ord_volume,3)) = 0)
        if(med_admin_data->ord_list[pos].ord_vol_flag = 1)
        	if(textlen(trim(ord_vol,3))> 0)
        	   	 if(findstring(".",ord_vol) = 0)
			         med_admin_data->ord_list[pos].ord_volume          = ord_vol
			     else
			         med_admin_data->ord_list[pos].ord_volume          =
			                 substring(1,findstring(".",ord_vol)+2,ord_vol)
			     endif
 
            	med_admin_data->ord_list[pos].ord_vol_unit         = ord_vol_unit
            	med_admin_data->ord_list[pos].ord_vol_populated    = "ORDER_DETAIL"
            endif
        endif
    endif
 
    if(textlen(trim(med_admin_data->ord_list[pos].dose_qty,3)) = 0)
        if(med_admin_data->ord_list[pos].result_status_cd        = 8_inerror_result_status_cd AND
           textlen(trim(dose_qty,3))> 0)
          dose_qty = concat ("-", dose_qty)
        endif
 
        if(textlen(trim(dose_qty,3))> 0)
           med_admin_data->ord_list[pos].dose_qty                = dose_qty
           med_admin_data->ord_list[pos].dose_qty_unit           = dose_qty_unit
           med_admin_data->ord_list[pos].dose_qty_populated      = "ORDER_DETAIL"
        else
           ; if the dose quantity is not entered use a default value of 1
           ; and dose qty unit would be drug form
           if(med_admin_data->ord_list[pos].default_dose_flag = 1)
            med_admin_data->ord_list[pos].dose_qty               = default_dose_qty_uncharted
           else
            med_admin_data->ord_list[pos].dose_qty               = default_dose_qty
           endif
		   med_admin_data->ord_list[pos].dose_qty_unit               = drug_form
		   med_admin_data->ord_list[pos].dose_qty_populated          = "DEFAULT_DOSE"
        endif
    endif
 
       ;only populate cdm if the field is blank
    	 if(textlen(trim(med_admin_data->ord_list[pos].cdm,3)) = 0)
		      med_admin_data->ord_list[pos].cdm                      = piece(ndc_cdm, ";",2,"")
 
		endif
 
	pos = locateval(index,pos+1, med_admin_data->cnt, o.order_id, med_admin_data->ord_list[index].order_id)
 
endwhile
 
with nocounter,expand = 1
 
/**************************************************************************************************************
;Retrieve Patient FIN, MRN
;**************************************************************************************************************/
select into "nl:"
from
    encntr_alias ea
plan ea
    where expand(index, 1, med_admin_data->cnt, ea.encntr_id, med_admin_data->ord_list[index].encntr_id)
    and ea.encntr_alias_type_cd in (319_FIN_EA_TYPE_CD, 319_MRN_EA_TYPE_CD)
    and ea.active_ind           = 1
    and ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and ea.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
order by
	ea.encntr_id,
	ea.encntr_alias_type_cd
head ea.encntr_id
    null
head ea.encntr_alias_type_cd
    pos = locateval(index, 1, med_admin_data->cnt, ea.encntr_id, med_admin_data->ord_list[index].encntr_id)
    while (pos > 0)
       case(ea.encntr_alias_type_cd)
        of 319_FIN_EA_TYPE_CD:
           med_admin_data->ord_list[pos].fin  = trim(ea.alias, 3)
        of 319_MRN_EA_TYPE_CD:
           med_admin_data->ord_list[pos].mrn  = trim(ea.alias, 3)
        endcase
        pos = locateval(index,pos + 1, med_admin_data->cnt, ea.encntr_id, med_admin_data->ord_list[index].encntr_id)
    endwhile
foot ea.encntr_alias_type_cd
  null
foot ea.encntr_id
  null
with nocounter, expand = 1
 
/******************************************************************************************************
;Retrieve Name, DOB, Gender
*****************************************************************************************************/
select into "nl:"
from
    person p
plan p
    where expand(index, 1, med_admin_data->cnt, p.person_id, med_admin_data->ord_list[index].person_id)
    and p.active_ind           = 1
    and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and p.end_effective_dt_tm >  cnvtdatetime(curdate,curtime3)
order by
	p.person_id
 
head p.person_id
    pos = locateval(index, 1, med_admin_data->cnt, p.person_id, med_admin_data->ord_list[index].person_id)
    while (pos > 0)
        med_admin_data->ord_list[pos].person_middlename = p.name_middle
        med_admin_data->ord_list[pos].person_lastname   = p.name_last
        med_admin_data->ord_list[pos].person_firstname  = p.name_first
 
        med_admin_data->ord_list[pos].gender            = trim(GetAlias(p.sex_cd),3)
        med_admin_data->ord_list[pos].date_of_birth     = p.birth_dt_tm;format(p.birth_dt_tm, DATE_FORMAT)
        med_admin_data->ord_list[pos].birth_tz          = p.birth_tz ;format(p.birth_dt_tm, DATE_FORMAT)
 
 
        pos = locateval(index, pos + 1, med_admin_data->cnt, p.person_id, med_admin_data->ord_list[index].person_id)
    endwhile
 
with nocounter, expand = 1
 
/******************************************************************************************************
;Retrieve Nurse Unit Location of the medication adminstration event
*****************************************************************************************************/
select into "nl:"
from
     med_admin_event mae
plan mae
     where expand(index, 1, med_admin_data->cnt, mae.event_id, med_admin_data->ord_list[index].event_id)
order by mae.event_id
head report
 null
head mae.event_id
 pos = locateval(index, 1, med_admin_data->cnt, mae.event_id, med_admin_data->ord_list[index].event_id)
 ;med_admin_data->ord_list[pos].admin_loc         = uar_get_code_display(mae.nurse_unit_cd)
 med_admin_data->ord_list[pos].transaction_type  = uar_get_code_display(mae.event_type_cd)
 
foot mae.event_id
 null
foot report
 null
with nocounter, expand = 1
 
/******************************************************************************************************
;Retrieve Performed Personnel's Name and ID
*****************************************************************************************************/
select *
from
    prsnl p
plan p
	where expand(index, 1 ,med_admin_data->cnt ,p.person_id, med_admin_data->ord_list[index].performed_prsnl_id)
order by
    p.person_id
head report
 null
head p.person_id
  pos = locateval(index, 1, med_admin_data->cnt ,p.person_id, med_admin_data->ord_list[index].performed_prsnl_id)
  while(pos > 0)
       med_admin_data->ord_list[pos].ord_phys = build2(
                                                        trim(cnvtstring(p.person_id),3),
                                                       ; S_SEPARATOR,
                                                        C_SEPARATOR,
                                                        trim(p.name_first,3),
                                                        trim(p.name_last ,3)
                                                       )
       pos = locateval(index, pos + 1, med_admin_data->cnt ,p.person_id, med_admin_data->ord_list[index].performed_prsnl_id)
  endwhile
foot p.person_id
 null
foot report
 null
with nocounter, expand = 1
call catchErrors("get order ingredients")
 
/*************************************************************************************************/
/** Write HL7 File                                                                              **/
/*************************************************************************************************/
call echo(build2("CURNODE:",CURNODE))
call echo(build2("Size of record:",size(med_admin_data->ord_list)))
call echo(build2("LV Test", trim(logical("cer_temp")) ))
 
 
if(med_admin_data->cnt > 0)
 
for(i = 1 to med_admin_data->cnt)
set stat = initrec(frec_hl7)
set frec_hl7->file_name      =  ;"/cerner/d_c604/temp/test_lv.txt"
							;;"/cerner/d_p604/temp/test3.txt"
                            getfilename(    output_file::dir_log
                                           ,output_file::sub_dir
  										                     ,output_file::file_mnemonic
  										                     ,med_admin_data->ord_list[i].clinical_event_id_vc
  										                     ,output_file::file_ext
  										                  )
  set frec_hl7->file_buf   = "w"
  call logMsg(build2("File Name: ", frec_hl7->file_name)					    , CCPS_LOG_AUDIT)
  if(not cclio("OPEN", frec_hl7))
  	  call logMsg(build2("Failed to open ", frec_hl7->file_name)                , CCPS_LOG_ERROR)
  	  call echorecord(frec_hl7)
  	else
  	  call logMsg("Opened the output file to write output records to it.."      , CCPS_LOG_AUDIT)
  	  call logMsg(build2("File: ", frec_hl7->file_name)							, CCPS_LOG_AUDIT)
  	  set stat = cclio("OPEN", frec_hl7)
  endif
 
  set frec_hl7->file_buf     = notrim(BuildMSH(i))
  set stat                   = cclio("WRITE", frec_hl7)
  set frec_hl7->file_buf     = notrim(concat(CR,BuildPID(1, i)))
  set stat                   = cclio("WRITE", frec_hl7)
  set frec_hl7->file_buf     = notrim(concat(CR,BuildORC(i)))
  set stat                   = cclio("WRITE", frec_hl7)
  set frec_hl7->file_buf     = notrim(concat(CR,BuildRXA(i, admin_dosage, admin_dosage_unit)))
  set stat                   = cclio("WRITE", frec_hl7)
  for(j = 1 to med_admin_data->ord_list[i].ingred_qual_cnt)
     set frec_hl7->file_buf  = notrim(concat(CR,BuildRXC(i,j)))
     set stat                = cclio("WRITE", frec_hl7)
  endfor
 
  set frec_hl7->file_buf     = notrim(concat(CR,BuildRXR(i)))
  set stat                   = cclio("WRITE", frec_hl7)
  set admin_dosage           = ""
  set admin_dosage_unit      = ""
  set frec_hl7->file_buf     = ""
  call logMsg(build2("~~~~~~~~~~~~~~~Leaving write_file~~~~~~~~~~~~~~~"), CCPS_LOG_AUDIT)
  set stat                   = cclio("CLOSE", frec_hl7)
endfor
endif
 
 
;if(not ISOPSJOB)
;  call DisplayFileData(med_admin_data->cnt ,frec_hl7->file_name)
;endif
 
 
 
;call echorecord(med_admin_data)
set last_mod = "001 07/03/18 LV028574 CCPS-13559"
end
go