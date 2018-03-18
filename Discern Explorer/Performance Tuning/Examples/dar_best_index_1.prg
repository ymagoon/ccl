;This query suffers from poor index usage.  The query will use
;the index which only uses the P.PHYSICIAN_IND field.  There is
;another index available which could use P.NAME_LAST_KEY and
;P.NAME_FIRST_KEY, but the optimizer is not choosing this index.
;The use of the bad index results in slow performance and
;overuse of database resources.

drop program dar_best_index_1 go
create program dar_best_index_1

;variables set earlier in the program
set last_name_var     = request->last_name
set first_name_var    = request->first_name
set physician_ind_var = request-> physician_ind

select *
  from  prsnl p
  where p.name_last_key  = last_name_var 
    and p.name_first_key = first_name_var 
    and p.physician_ind  = physician_ind_var
  with nocounter
end go


