drop program   dar_exercise_5a go
create program dar_exercise_5a

;this query is returning a name_full_formatted and a ext_acct_id_txt for 
;each parent_activity_id

declare dTransfer_Value = f8 with constant(uar_get_code_by("MEANING",25753, "TRANSFER"))
declare dPatient_Value = f8 with constant(uar_get_code_by("MEANING", 18936, "PATIENT"))

for (i = 1 to size (reply->aCharge, 5))

  select  into "nl:"    
  	from trans_trans_reltn ttr,
         pft_trans_reltn ptr,
         account a, 
         pft_acct_reltn par, 
         person p	      
  	plan ttr 
  	     where ttr.Parent_activity_id = reply->aCharge[i].dActivity_ID
  		   and ttr.trans_reltn_reason_cd = dTransfer_Value
  	       and ttr.active_ind = 1
  	join ptr
  	     where ptr.activity_id = ttr.Child_activity_id
  		   and ptr.Parent_Entity_name = "ACCOUNT"
  	join a	
  	     where a.acct_id = ptr.parent_entity_id
   	join par 
   	     where par.acct_id = a.acct_id
  		   and par.parent_entity_NAME = "PERSON"
  		   and par.role_type_cd = dPatient_value
   	join p	
   	     where p.person_id = par.parent_entity_ID
  detail
   	      reply->aCharge[i].iTransTo_Ind = 1
  		  reply->aCharge[i].sTransToPatName = p.name_full_formatted
  		  reply->aCharge[i].sTransToExtAcctIDTxt = a.ext_acct_id_txt
  	with nocounter
endfor

call echorecord(reply)

end go

