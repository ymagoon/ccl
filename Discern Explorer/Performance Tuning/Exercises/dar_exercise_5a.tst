
;this can be used to run dar_exercise_5a
free set reply go
record reply
(
  1 aCharge[*]
    2 dActivity_id = f8
    2 sTransToPatName = vc
    2 iTransTo_Ind = i2
    2 sTransToExtAcctIDTxt = vc
) go

select into "nl:"
  from trans_trans_reltn t
  plan t 
 	   where t.parent_activity_id > 0
 	     and t.trans_reltn_reason_cd = 654415.0
         and t.active_ind = 1
  head report
       num = 0
detail
	   num = num + 1 
	   stat = alterlist(reply->aCharge, num)
	   reply->aCharge[num].dActivity_id = t.parent_activity_id
  with nocounter, maxqual(t, 21) go

dar_exercise_5a go

