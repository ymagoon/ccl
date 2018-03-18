 ;;Solution_Test/script/PathNet -- Common Services/ACCESSION_COMMON/ACCESSION_COMMON.INC Turn on black mode

;;
;; File: accession_common.inc
;; Description: Accession scripts common constants, variables, and record.
;; Request Nbr: n/a
;;
;;-----------------------------------------------------------------------------
;; Date                  Feature    Description
;; -------- -----------  ---------- -------------------------------------------
;; 07/01/99 CERGYL             6255 File creation.
;; 01/01/01 CERGYL            17518 Declare variables and make constant.
;; 07/11/03 JN9001            35089 Added description for option "2" of accession_chk->check_disp_ind             ;;

;**********************************************************************
;* Version information.
;*

;* Indicates version of ACCESSION_COMMON.INC include in script.
;*
;*   This field should be incremented when a non-passive change is 
;*   made to this file and accession program should check this variable 
;*   before accessing new fields.
;*
;*     declare variable = i2 with constant (validate (ACCESSION_COMMON_VERSION, 0))

if (validate (ACCESSION_COMMON_VERSION, -1) = -1)

declare ACCESSION_COMMON_VERSION = i2 with constant (0)

;*
;* Version information.
;**********************************************************************

;**********************************************************************
;* Constants.
;*

declare ACC_SUCCESS              = i2 with constant (0)
declare ACC_ERROR                = i2 with constant (1)
declare ACC_FUTURE               = i2 with constant (2)
declare ACC_NULL_DT_TM           = i2 with constant (3)
declare ACC_TEMPLATE             = i2 with constant (300)
declare ACC_POOL                 = i2 with constant (310)
declare ACC_POOL_SEQUENCE        = i2 with constant (320)
declare ACC_DUPLICATE            = i2 with constant (410)
declare ACC_MODIFY               = i2 with constant (420)
declare ACC_SEQUENCE_ID          = i2 with constant (430)
declare ACC_INSERT               = i2 with constant (440)
declare ACC_POOL_ID              = i2 with constant (450)
declare ACC_AOR_FALSE            = i2 with constant (500)
declare ACC_AOR_TRUE             = i2 with constant (501)
declare ACC_PERSON_FALSE         = i2 with constant (502)
declare ACC_PERSON_TRUE          = i2 with constant (503)

declare SITE_LENGTH              = i2 with constant (5)
declare JULIAN_SEQUENCE_LENGTH   = i2 with constant (6)
declare PREFIX_SEQUENCE_LENGTH   = i2 with constant (7)

declare accession_status         = i4 with noconstant (ACC_SUCCESS)
declare accession_meaning        = c200 with noconstant (fillstring (200, " "))

;*
;* Constants.
;**********************************************************************

;**********************************************************************
;* accession_settings.prg definitions
;*

record acc_settings
(
  1 acc_settings_loaded    = i2
  1 site_code_length       = i4
  1 julian_sequence_length = i4
  1 alpha_sequence_length  = i4
  1 year_display_length    = i4
  1 default_site_cd        = f8
  1 default_site_prefix    = c5
  1 assignment_days        = i4
  1 assignment_dt_tm       = dq8
  1 check_disp_ind         = i2
)

;*
;* accession_settings.prg definitions
;**********************************************************************

;**********************************************************************
;* accession_assign.prg definitions
;*

;*
;* When the accession format is passed in, the assignment pool is 
;* derived from the facility and accession format
;*
;* When the accession format is not passed in, the assignment pool is
;* derived from catalog and specimen type.
;*
;* The accession_flag is used to force a unique accession number.
;*
;*    0 = default
;*    1 = collected 

record accession_fmt
(
 1 time_ind                       = i2
 1 insert_aor_ind                 = i2
 1 cpri_lookup                    = i2
 1 act_lookup                     = i2
 1 qual[*]
   2 order_id                     = f8
   2 catalog_cd                   = f8
   2 facility_cd                  = f8
   2 site_prefix_cd               = f8
   2 site_prefix_disp             = c5
   2 accession_format_cd          = f8
   2 accession_format_mean        = c12
   2 accession_class_cd           = f8
   2 specimen_type_cd             = f8
   2 accession_dt_tm              = dq8
   2 accession_day                = i4
   2 accession_year               = i4
   2 alpha_prefix                 = c2
   2 accession_seq_nbr            = i4
   2 accession_pool_id            = f8
   2 assignment_meaning           = vc
   2 assignment_status            = i2
   2 accession_id                 = f8
   2 accession                    = c20
   2 accession_formatted          = c25
   2 activity_type_cd             = f8
   2 activity_type_mean           = c12
   2 order_tag                    = i2
   2 accession_info_pos           = i2
   2 accession_flag               = i2
   2 collection_priority_cd       = f8
   2 group_with_other_flag        = i2
   2 accession_parent             = i2
   2 body_site_cd                 = f8
   2 body_site_ind                = i2
   2 specimen_type_ind            = i2
   2 service_area_cd              = f8
   2 linked_qual[*]
     3 linked_pos                 = i2
)

;*
;* Used to group new orders onto an existing accession number.
;*

record accession_grp
(
 1 cpri_lookup                    = i2
 1 act_lookup                     = i2
 1 qual[*]
   2 catalog_cd                   = f8
   2 specimen_type_cd             = f8
   2 site_prefix_cd               = f8
   2 accession_format_cd          = f8
   2 accession_class_cd           = f8
   2 accession_dt_tm              = dq8
   2 accession_pool_id            = f8
   2 accession_id                 = f8
   2 accession                    = c20
   2 activity_type_cd             = f8
   2 accession_flag               = i2
   2 collection_priority_cd       = f8
   2 group_with_other_flag        = i2
   2 body_site_cd                 = f8
   2 service_area_cd              = f8
)


;*
;* accession_assign.prg definitions
;**********************************************************************

;**********************************************************************
;* accession_string.prg definitions.
;*

declare accession_nbr            = c20 with noconstant (fillstring (20, " "))
declare accession_nbr_chk        = c50 with noconstant (fillstring (50, " "))

record accession_str
(
  1 site_prefix_disp             = c5
  1 accession_year               = i4
  1 accession_day                = i4
  1 alpha_prefix                 = c2
  1 accession_seq_nbr            = i4
  1 accession_pool_id            = f8
)

;*
;* accession_string.prg definitions.
;**********************************************************************

;**********************************************************************
;* acc_site_prefix.prg definitions.
;*

declare acc_site_prefix_cd       = f8 with noconstant (0.0)
declare acc_site_prefix          = c5 with noconstant (fillstring (value (SITE_LENGTH), " "))

;*
;* acc_site_prefix.prg definitions.
;**********************************************************************

;**********************************************************************
;* accession_check.prg definitions.
;*

declare accession_id             = f8 with noconstant (0.0)
declare accession_dup_id         = f8 with noconstant (0.0)
declare accession_updt_cnt       = i4 with noconstant (0)
declare accession_assignment_ind = i2 with noconstant (0)

record accession_chk
(
  1 check_disp_ind               = i2 ; 0 = no check; 1 = check; 2 = check only accession.accession
  1 site_prefix_cd               = f8
  1 accession_year               = i4
  1 accession_day                = i4
  1 accession_pool_id            = f8
  1 accession_seq_nbr            = i4
  1 accession_class_cd           = f8
  1 accession_format_cd          = f8
  1 alpha_prefix                 = c2
  1 accession_id                 = f8
  1 accession                    = c20
  1 accession_nbr_check          = c50
  1 accession_updt_cnt           = i4
  1 action_ind                   = i2 ; 0 = validate/insert, 1 = validate only, 2 = validate/modify
  1 preactive_ind                = i2
  1 assignment_ind               = i2
)

;*
;* accession_check.prg definitions.
;**********************************************************************

endif

;Generated by GNU enscript 1.6.4.
