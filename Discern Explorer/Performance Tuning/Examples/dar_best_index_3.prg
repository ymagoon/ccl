;This query has 10 indexes to choose from.  Which one would be the best.  are there any
;indexes that may be better in some situations and worse in other situations.  If this
;is coded for worst case scenarios the best choice is person_id, catalog_cd

drop program   dar_best_index_3 go
create program dar_best_index_3

select o.order_id
  from orders o
 where o.person_id        = request->person_id
   and o.catalog_cd       = request->catalog_cd
   and o.catalog_type_cd  = request->catalog_type_cd
   and o.activity_type_cd = request->activity_type_cd
   and o.dept_status_cd   = request->dept_status_cd
   and o.order_status_cd  = request->order_status_cd 



