 ;;Solution_Test/script/PathNet -- BB Transfusion/Dispenseassign/BBT_CHK_PAT_DEMOG.INC Turn on black mode

/*******************************************************************************************
 * NAME:  bbt_chk_pat_demog.inc
 *
 * PURPOSE:  To check if the patient's BB Comments, ABO/RH, Transfusion Requirements and Antibodies
 *           has not changed during the conversation in the application
 * USE:
 *       1.  In calling program 
 *              %i cclsource:bbt_chk_pat_demog.inc
 *       2.  To retrieve info:
 *       set sub_bb_comment_changed             ;determine if patient's comments changed
 *       set sub_bb_comment_changed_error             ;determine if patient's comments changed
 *       set sub_pat_aborh_changed              ;determine if patient's ABO/Rh changed
 *       set sub_pat_aborh_changed_error              ;determine if patient's ABO/Rh changed
 *       set sub_trans_req_changed              ;determine if transfusion requirements changed
 *       set sub_trans_req_changed_error              ;determine if transfusion requirements changed
 *       set sub_antibodies_changed             ;determine if Patient's antibodies changed
 *       set sub_antibodies_changed_error             ;determine if Patient's antibodies changed
 *
 * MODIFICATIONS:  09/24/99 Creation. Jose Suarez
 *                 08/22/01 Defect CAPEP00020383 Select one instance of antibodycersrh   *
 *******************************************************************************************/
/*******************************************************************************************
 *  Structures needed for processing information                                           *
 *******************************************************************************************/
        record trans_req_rec
        ( 
          1 reqs[*]
            2 requirement_cd                =     f8
        )
 
        record antibody_rec
        ( 
          1 antibody[*]
            2 antibody_cd                =     f8
        )
/*******************************************************************************************
 *  Variables to hold the information to be used in the calling program.                   *
 *******************************************************************************************/
        set sub_bb_comment_changed_error = FILLSTRING(255, " ")
        set sub_bb_comment_changed = FILLSTRING(1, " ")
        set sub_bb_comment_changed = "F"
        set sub_pat_aborh_changed_error = FILLSTRING(255, " ")
        set sub_pat_aborh_changed = FILLSTRING(1, " ")
        set sub_pat_aborh_changed = "F"
        set sub_trans_req_changed_error = FILLSTRING(255, " ")
        set sub_trans_req_changed = FILLSTRING(1, " ")
        set sub_trans_req_changed = "F"
        set sub_antibodies_changed_error = FILLSTRING(255, " ")
        set sub_antibodies_changed = FILLSTRING(1, " ")
        set sub_antibodies_changed = "F"

subroutine CHECK_PATIENT_DEMOGRAPHICS(sub_dummy)
  ;******************************************
  ;Checking patient's blood bank comments   *
  ;******************************************
  set sErrorMsg = FILLSTRING(255, " ")
  set nErrorStatus = ERROR(sErrorMsg,1)
  set check_bb_comment_id = 0.0
  set check_bb_comment_updt_cnt = 0
  select into "nl:"
     b.*
  from blood_bank_comment b
  plan b where b.person_id = request->person_id
         and b.active_ind = 1
  detail
      check_bb_comment_id = b.bb_comment_id
      check_bb_comment_updt_cnt = b.updt_cnt
  with nocounter, forupdate(b)
 
  set nErrorStatus = ERROR(sErrorMsg,0)
  if (nErrorStatus = 0)
     if (curqual < 1)
        ;Checking if the patient had comments and now there is any
        if ((check_bb_comment_id != request->bb_comment_id) or (check_bb_comment_updt_cnt != request->bb_comment_updt_cnt))
            set sub_bb_comment_changed = "T"
        endif
     else
        ;Checking that the patient's comments did not change for the patient
        if ((check_bb_comment_id != request->bb_comment_id) or (check_bb_comment_updt_cnt != request->bb_comment_updt_cnt))
            set sub_bb_comment_changed = "T"
        endif
     endif
  else
     ;There was an error in the select
     set sub_bb_comment_changed_error = sErrorMsg
     set sub_bb_comment_changed = "E"
  endif

  ;**********************************************
  ; Checking patient's ABO/RH                   *
  ;**********************************************
  set sErrorMsg = FILLSTRING(255, " ")
  set nErrorStatus = ERROR(sErrorMsg,1)
  set check_abo_cd = 0.0
  set check_rh_cd = 0.0
  select into "nl:"
      p.*
  from
      person_aborh p
  plan p where p.person_id = request->person_id
           and p.active_ind = 1
  detail
        check_abo_cd = p.abo_cd
        check_rh_cd = p.rh_cd
  with nocounter, forupdate(p)
  
  set nErrorStatus = ERROR(sErrorMsg,0)
  if (nErrorStatus = 0)
     if (curqual < 1)
        ;Checking if the patient had ABO/RH and now there is any
        if ((check_abo_cd != request->abo_cd) or (check_rh_cd != request->rh_cd))
            set sub_pat_aborh_changed = "T"
        endif
     else
        ;Checking that patient's ABO/RH did not change for the patient
        if ((check_abo_cd != request->abo_cd) or (check_rh_cd != request->rh_cd))
            set sub_pat_aborh_changed = "T"
        endif
     endif
  else
     ;There was an error in the select
     set sub_pat_aborh_changed_error = sErrorMsg
     set sub_pat_aborh_changed = "E"
  endif

  ;**********************************************
  ; Checking patient's transfusion requirement  *
  ;**********************************************
  set sErrorMsg = FILLSTRING(255, " ")
  set nErrorStatus = ERROR(sErrorMsg,1)
  set trans_cnt = 0
  select into "nl:"
    p.*
  from person_trans_req p 
  plan p where p.person_id = request->person_id 
           and p.active_ind = 1
  detail
        trans_cnt = trans_cnt + 1
        stat = alterlist(trans_req_rec->reqs, trans_cnt)
        trans_req_rec->reqs[trans_cnt].requirement_cd = p.requirement_cd
  with nocounter, forupdate(p)

  set nErrorStatus = ERROR(sErrorMsg,0)
  if (nErrorStatus = 0)
        set trans_req_changed = "F"
        set bfound = "F"
        set trans_now_cnt = size(trans_req_rec->reqs,5)
        set trans_before_cnt = size(request->transreqlist,5)
        if (trans_now_cnt = 0 and trans_before_cnt = 0)
                ;NO changes to the Patient's transfusion requirements
                set trans_req_changed = "F"
        ;elseif (trans_now_cnt != trans_before_cnt)
        ;        ;YES changes to the Patient's transfusion requirements
        ;        set trans_req_changed = "T"
        else
                ;Find out if the Patient's transfusion requirements changed
                for (n = 1 to trans_now_cnt)
                        set bfound = "F"
                        for (b = 1 to trans_before_cnt)
                                if (trans_req_rec->reqs[n].requirement_cd = request->transreqlist[b].requirement_cd)
                                        set bfound = "T"
                                        set b = trans_before_cnt
                                endif
                        endfor
                        if (bfound = "F")
                                set trans_req_changed = "T"
                                set n = trans_now_cnt
                        endif
                endfor
        endif
        if (trans_req_changed = "T")
                set sub_trans_req_changed = "T"
        endif
  else
    ;There was an error in the select
     set sub_pat_aborh_changed_error = sErrorMsg
     set sub_pat_aborh_changed = "E"
  endif  
  ;**********************************************
  ; Checking patient's antibodies               *
  ;**********************************************  
  set sErrorMsg = FILLSTRING(255, " ")
  set nErrorStatus = ERROR(sErrorMsg,1)
  set anti_cnt = 0
  select into "nl:"
     p.*
  from person_antibody p 
  plan p where p.person_id = request->person_id 
           and p.active_ind = 1
  order by p.antibody_cd
  head p.antibody_cd  ;cersrh want only one instance of each antibody
;cersrh  detail
        anti_cnt = anti_cnt + 1
        stat = alterlist(antibody_rec->antibody, anti_cnt)
        antibody_rec->antibody[anti_cnt].antibody_cd = p.antibody_cd
  with nocounter, forupdate(p)
  
  set nErrorStatus = ERROR(sErrorMsg,0)
  if (nErrorStatus = 0)
        set antibody_changed = "F"
        set bfound = "F"
        set antibody_now_cnt = size(antibody_rec->antibody,5)
        set antibody_before_cnt = size(request->antibodylist,5)
        if (antibody_now_cnt = 0 and antibody_before_cnt = 0)
                ;NO changes to the Patient's Antibodies
                set antibody_changed = "F"
        elseif (antibody_now_cnt != antibody_before_cnt)
                ;YES changes to the Patient's Antibodies
                set antibody_changed = "T"
        else
                ;Find out if the Patient's Antibodies changed
                for (n = 1 to antibody_now_cnt)
                        set bfound = "F"
                        for (b = 1 to antibody_before_cnt)
                                if (antibody_rec->antibody[n].antibody_cd = request->antibodylist[b].antibody_cd)
                                        set bfound = "T"
                                        set b = antibody_before_cnt
                                endif
                        endfor
                        if (bfound = "F")
                                set antibody_changed = "T"
                                set n = antibody_now_cnt
                        endif
                endfor
        endif
        if (antibody_changed = "T")
                set sub_antibodies_changed = "T"
        endif
  else
     ;There was an error in the select
     set sub_pat_aborh_changed_error = sErrorMsg
     set sub_pat_aborh_changed = "E"
  endif

end     ;end subroutine

;Generated by GNU enscript 1.6.4.
