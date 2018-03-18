;This query does not have an explicit join between the tables.
;By not explicitly joining the tables, non-matching rows will
;be returned.  The large amount of data being queried and returned
;require a large amount of database resources and will result
;in this query being extremely slow.

drop program dar_executiion_path_2 go
create program dar_executiion_path_2

;variables set earlier in the program
set person_var   = request->person
set catalog_var  = request->catalog
set specimen_var = request->specimen

select *
  from orders o,
       container c
  plan o 
      where o.person_id  = person_var
        and o.catalog_cd = catalog_var
  join c 
      where c.specimen_type_cd = specimen_var
  with nocounter
end go

