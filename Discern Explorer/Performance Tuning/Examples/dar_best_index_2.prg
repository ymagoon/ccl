;This query could suffer from poor index usage depending on when the indexes
;where created. If the person_id, catalog_type_cd index was created first,
;this would be the index that is used.  If the person_id, catalog_cd index was created
;first, this would be the index that is used.  The index that should be used is the person_id
;catalog_cd index

drop program dar_best_index_2 go
create program dar_best_index_2

;variables set earlier in the program
set catalog_cd_var       = request->catalog_cd_var
set catalog_type_cd_var  = request->catalog_type_cd_var
set person_id_var        = request->person_id

select o.order_id
  from orders 
 where o.catalog_cd      = catalog_cd_var
   and o.person_id       = person_id_var
   and o.catalog_type_cd = catalog_type_cd_var
  with nocounter



