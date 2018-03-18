;This query is accessing the tables in an inefficient order.  
;More rows will qualify on the ADDRESS table than on
;the PERSON table.  By not joining the tables from most
;restrictive to least restrictive, the query will be working
;with a larger data set than needed and the query will be slow.

drop program dar_execution_path_1 go
create program dar_execution_path_1

;variables set earlier in the program
set zipcode_var   = request->zipcode
set last_name_var = request->last_name

select *
  from person p,
       address a
  plan a 
      where a.zipcode_key        = zipcode_var
        and a.parent_entity_name = "PERSON"
  join p 
      where p.person_id     = a.parent_entity_id
        and p.name_last_key = last_name_var
  with nocounter
end go


