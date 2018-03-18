
;Below code can be used to test dar_exercise_2

free record request go
record request(
    1 zipcode = vc
    1 cki = vc
    1 disp_line = vc
    1 misc_line = vc
) with protect go

free record reply go
record reply(
    1 qual[*]
      2 person_id = f8
) with protect go

;;The following select can be used to run the exercise in any environment
select into "nl:"
       a.zipcode_key
  from address a, orders o
  plan a
       where a.parent_entity_name = "PERSON"
  join o 
       where o.person_id = a.parent_entity_id
detail
       request->zipcode = a.zipcode_key
       request->cki = o.cki
       request->disp_line = o.clinical_display_line
       request->misc_line = o.dept_misc_line
  with nocounter, maxqual(a, 1) go
  
dar_exercise_2 go