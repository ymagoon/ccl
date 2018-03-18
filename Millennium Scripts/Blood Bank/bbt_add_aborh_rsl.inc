 ;;Solution_Test/script/PathNet -- BB Transfusion/RESULTENTRYFORBLOODBANK/BBT_ADD_ABORH_RSL.INC Turn on black mode

/*
 *  PURPOSE:  add row to person_aborh_result table
 *
 *  PRELIMINARIES:
 *   1)  Include the following code in calling program:
 *           %i cclsource:bbt_add_aborh_rsl.inc
 *           END        ; end subroutine ADD_ABORH_RESULT
 *   2)  Declare the followoing variables in the calling program, prior to calling the subroutine:
 *             set gsub_aborh_result_status = "  " (gsub = global subroutine variable)
 *   3)  Call subroutine using CALL FORMAT below
 *   4)  After control returns from subroutine, evaluate gsub_person_aborh_result_status as follows:
 *         "FP" = person_aborh_id search failed
 *         "FS" = selection of next id number failed
 *         "FA" = add aborh_result failed
 *         "OK" = add successful
 *         "FV" = Failure to validate Standard_aborh_cd
 *
 *  CALL FORMAT (this may be copied into calling program): */
 ;       call ADD_ABORH_RESULT
 ;          (                             ** These <variables> set in calling program **
 ;           /* specimen_id             */ <specimen_id>,
 ;           /* container_id            */ <container_id>,
 ;           /* drawn_dt_tm             */ <drawn_dt_tm>,
 ;           /* person_aborh_id         */ <person_aborh_id>,
 ;           /* person_id               */ <person_id>,
 ;           /* encntr_id               */ <encntr_id>,
 ;           /* result_id               */ <result_id>,
 ;           /* result_cd               */ <result_cd>,
 ;           /* active_ind              */ <active_ind>,
 ;           /* active_status_cd        */ <reqdata->active_status_cd>,
 ;           /* active_status_dt_tm     */ cnvtdatetime(<active_status_dt_tm>),
 ;           /* active_status_prsnl_id  */ <active_status_prsnl_id>
 ;          )
 
    subroutine ADD_ABORH_RESULT
        (
         sub_specimen_id,
         sub_container_id,
         sub_drawn_dt_tm,
         sub_person_aborh_id,
         sub_person_id,
         sub_encntr_id,
         sub_result_id,
         sub_result_cd,
         sub_active_ind,
         sub_active_status_cd,
         sub_active_status_dt_tm,
         sub_active_status_prsnl_id
        )
    /* Initialize gsub_aborh_result_status */
    set gsub_aborh_result_status = "  "
 
    declare person_aborh_rs_id          = f8  with protect, private, noconstant(0.0)
    declare result_codeset              = i4  with protect, noconstant(0)
    declare standard_aborh_cd           = f8  with protect, noconstant(0.0)
    declare lStandardAborhCodeSet       = i4  with protect, constant(1640)
    declare lResultAborhCodeSet         = i4  with protect, constant(1643)
    declare cABORH_cd                   = c8  with protect, constant("ABORH_cd")
    declare specimen_id_text            = c11 with protect, constant("specimen_id")
    declare container_id_text           = c12 with protect, constant("container_id")
    declare drawn_dt_tm_text            = c11 with protect, constant("drawn_dt_tm")    
    declare person_aborh_id_text        = c15 with protect, constant("person_aborh_id")
    declare person_id_text              = c9  with protect, constant("person_id")    
    declare encntr_id_text              = c9  with protect, constant("encntr_id")
    declare result_id_text              = c9  with protect, constant("result_id")
    declare result_cd_text              = c9  with protect, constant("result_cd")
    declare active_ind_text             = c10 with protect, constant("active_ind")   
    declare active_status_cd_text       = c16 with protect, constant("active_status_cd")
    declare active_status_dt_tm_text    = c19 with protect, constant("active_status_dt_tm")
    declare active_status_prsnl_id_text = c22 with protect, constant("active_status_prsnl_id")
    declare standard_aborh_cd_text      = c17 with protect, constant("standard_aborh_cd")

    set result_codeset = uar_get_code_set(sub_result_cd)
 
    if (result_codeset = lStandardAborhCodeset)
       set standard_aborh_cd = sub_result_cd
    else
       select into "nl:"
          cve.code_value,
          cve.field_name,
          cve.field_value
       from code_value_extension cve
       where cve.code_value = sub_result_cd
         and cve.field_name = cABORH_cd
 
       detail
          standard_aborh_cd = cnvtreal(trim(cve.field_value))
       with nocounter
    endif
 
    set result_codeset = uar_get_code_set(standard_aborh_cd)
 
    if (result_codeset = lStandardAborhCodeset)

       set stat = alterlist(gm_i_person_aborh_r0793_req->qual, 1)
       call gm_i_PERSON_ABORH_R0793_f8(specimen_id_text, sub_specimen_id, 1, 0)
       call gm_i_PERSON_ABORH_R0793_f8(container_id_text, sub_container_id, 1, 0)
       call gm_i_PERSON_ABORH_R0793_dq8(drawn_dt_tm_text, sub_drawn_dt_tm, 1, 0)
       call gm_i_PERSON_ABORH_R0793_f8(person_aborh_id_text, sub_person_aborh_id, 1, 0)
       call gm_i_PERSON_ABORH_R0793_f8(person_id_text, sub_person_id, 1, 0)
       call gm_i_PERSON_ABORH_R0793_f8(encntr_id_text, sub_encntr_id, 1, 0)
       call gm_i_PERSON_ABORH_R0793_f8(result_id_text, sub_result_id, 1, 0)
       call gm_i_PERSON_ABORH_R0793_f8(result_cd_text, sub_result_cd, 1, 0)
       call gm_i_PERSON_ABORH_R0793_i2(active_ind_text, sub_active_ind, 1, 0)
       call gm_i_PERSON_ABORH_R0793_f8(active_status_cd_text, sub_active_status_cd, 1, 0)
       call gm_i_PERSON_ABORH_R0793_dq8(active_status_dt_tm_text, sub_active_status_dt_tm, 1, 0)
       call gm_i_PERSON_ABORH_R0793_f8(active_status_prsnl_id_text, sub_active_status_prsnl_id, 1, 0)
       call gm_i_PERSON_ABORH_R0793_f8(standard_aborh_cd_text, standard_aborh_cd, 1, 0)
       
       execute gm_i_person_aborh_r0793 with
               replace(request, gm_i_person_aborh_r0793_req),
               replace(reply, gm_i_person_aborh_r0793_rep)
       if (gm_i_person_aborh_r0793_rep->status_data->status = 'F')
           call echo('Insert into person_aborh_result table failed.')
   		   set gsub_aborh_result_status = "FA"
       elseif (gm_i_person_aborh_r0793_rep->status_data->status = 'S')
           call echo('Insert into person_aborh_result table success.')
           set gsub_aborh_result_status = "OK"
           set stat = alterlist(gm_i_person_aborh_r0793_rep->qual, 1)
           set person_aborh_rs_id = gm_i_person_aborh_r0793_rep->qual[1].person_aborh_rs_id
           if (person_aborh_rs_id = 0)
               set gsub_aborh_result_status = "FA"
           endif
   	   endif
    else
       call echo("Result_cd's corresponding Standard_ABORH_CD not found on code set 1640")
       set gsub_aborh_result_status = "FV"
    endif
 
/* END for subroutine is to be included in calling program code */

;Generated by GNU enscript 1.6.4.
